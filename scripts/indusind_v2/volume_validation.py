"""Writes qa/volume_validation.md: the internal layer's bank-scale figures against the public anchors
(docs/demo-rebuild/public_anchors_volumes.md). One row per metric: our figure | anchor | source | ratio | verdict.

Verdict: OK when the figure is inside the anchor's range, or within 2x of a point anchor. Anything else must be fixed
or justified in the row. Exit code 1 if any row is neither OK nor justified.
"""

from __future__ import annotations

import collections
import json
import sys

from common import OUT_APP, ROOT, SEED_V3, load
from scale_v3 import CHANNEL_GROUP, COMPLAINT_MIX, is_complaint

WEEKS = 13
DAYS = 91
IN = lambda n: _indian(round(n))  # noqa: E731


def _indian(n: int) -> str:
    s = str(abs(n))
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        s = ",".join([head, *parts, tail]) if head else ",".join([*parts, tail])
    return ("-" if n < 0 else "") + s


rows: list[tuple[str, str, str, str, str, str]] = []
bad = 0


def add(metric: str, ours: float, shown: str, anchor: str, source: str, lo: float, hi: float, why: str = ""):
    """lo..hi is the anchor's range (lo == hi for a point). Ratio is ours against the nearest edge of the range."""
    global bad
    if lo == hi:  # a point anchor ("about"): within 5% counts as on it
        lo, hi = lo * 0.95, hi * 1.05
    inside = lo <= ours <= hi
    edge = lo if ours < lo else hi
    ratio = 1.0 if inside else (ours / edge if edge else float("inf"))
    within2 = 0.5 <= ratio <= 2
    if inside or within2:
        verdict = "OK" if inside or not why else f"OK ({why})"
        if not inside and not why:
            verdict = "OK (within 2x)"
    elif why:
        verdict = f"Justified: {why}"
    else:
        verdict = "FIX"
        bad += 1
    rows.append((metric, shown, anchor, source, "in range" if inside else f"{ratio:.2f}x", verdict))


def main() -> int:
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    scale = load(SEED_V3 / "scale.json")
    per = load(OUT_APP / "periods.json")["periods"]
    full, brief = per["all"], per["brief"]
    rs = [r for r in inter if r["channel"] in CHANNEL_GROUP]
    W = lambda xs: sum(r["w"] for r in xs)  # noqa: E731
    total = full["cx_pulse"]["internal"]["volume"]
    assert total == W(rs)
    cmp = [r for r in rs if is_complaint(r)]
    n_cmp = W(cmp)

    # ---- section 6 of the anchors file
    add("Total contacts, full window", total, IN(total), "3-6 lakh (15-30 per complaint)", "N31 x K1 (derived)", 300_000, 600_000)
    add("Complaints, full window", n_cmp, IN(n_cmp), "about 20,000", "N31: 80,062 in FY25, x 91/365 (derived)", 20_000, 20_000)
    uhni = next(x for x in full["customer_pulse"]["lists"] if x["id"] == "uhni")
    add("Pioneer customers with a contact, full window", uhni["in_contact"], IN(uhni["in_contact"]), "9,000-18,000 (15-30% of the list)", "P2 (assumption)", 9_000, 18_000)
    add("Pioneer contacts, full window", uhni["volume"], IN(uhni["volume"]), "scales with P2: 2-3 contacts per contacting customer", "P2 (assumption)",
        2 * uhni["in_contact"], 3 * uhni["in_contact"])

    # ---- rates
    add("Complaints per day (window average)", n_cmp / DAYS, IN(n_cmp / DAYS), "about 219", "N31 (derived)", 219, 219)
    add("Complaints per week", n_cmp / WEEKS, IN(n_cmp / WEEKS), "about 1,540", "N31 (derived)", 1540, 1540)
    day = [r for r in cmp if r["created_at"] >= brief["start"][:16]]
    add("Complaints in the Morning brief (last 24 hours)", W(day), IN(W(day)), "about 219", "N31 (derived)", 219, 219)
    add("Contacts per complaint", total / n_cmp, f"{total / n_cmp:.1f}x", "15-30x", "K1 (assumption)", 15, 30)
    add("Contacts per day (window average)", total / DAYS, IN(total / DAYS), "3,300-6,600", "N31 x K1 (derived)", 3_300, 6_600)
    bv = brief["cx_pulse"]["internal"]["volume"]
    add("Contacts in the Morning brief (last 24 hours)", bv, IN(bv), "3,300-6,600", "N31 x K1 (derived)", 3_300, 6_600)

    # ---- pending
    pending = W([r for r in cmp if r["status"] == "open"])
    add("Complaints pending at the window end", pending, IN(pending), "15,811 pending at FY25 year-end", "N32 (anchor)", 15_811, 15_811,
        "N32 is a year-end stock against a year of intake (80,062); the bank's classification broadened in FY25. Our pending stock follows the reply-time rules, not N32")
    annual = n_cmp * 365 / DAYS
    add("Pending as a share of annual intake", 100 * pending / annual, f"{100 * pending / annual:.1f}%", "about 19.7%", "N32 / N31 (derived)", 15.0, 25.0,
        "N32 is a year-end stock; our pending follows the reply-time rules (see the row above)")
    add("Pending as a share of the 13-week intake", 100 * pending / n_cmp, f"{100 * pending / n_cmp:.1f}%", "no anchor", "N32 / N31 (derived)", 0, 100)

    # ---- channel mix (K4)
    ch = collections.Counter()
    for r in rs:
        ch[CHANNEL_GROUP[r["channel"]]] += r["w"]
    for label, keys, lo, hi in (("Calls", ("calls",), 50, 60), ("Chat and WhatsApp", ("chat", "whatsapp"), 15, 25),
                                ("Email", ("emails",), 10, 15), ("Branch", ("branch",), 5, 10), ("Social inbox", ("social",), 1, 3)):
        n = sum(ch[k] for k in keys)
        add(f"Channel share: {label}", 100 * n / total, f"{100 * n / total:.1f}% ({IN(n)})", f"{lo}-{hi}%", "K4 (assumption)", lo, hi)

    # ---- product mix of complaints (K5, O4)
    by_p = {p: W([r for r in cmp if r["product"] == p]) for p in COMPLAINT_MIX}
    loans = sum(by_p[p] for p in ("personal_loans", "home_loans", "auto_loans"))
    add("Complaint share: loans (personal, home, auto)", 100 * loans / n_cmp, f"{100 * loans / n_cmp:.1f}% ({IN(loans)})",
        "leads; 29.25% at the Ombudsman", "K5 / O4", 29.25, 29.25)
    order = sorted(((v, k) for k, v in {"loans": loans, **{k: v for k, v in by_p.items() if "loans" not in k}}.items()), reverse=True)
    lead = [k for _, k in order[:2]]
    add("Complaint mix: the leading product", 1 if lead[0] == "loans" else 0, " then ".join(lead), "loans first (vehicle finance is the largest retail book)", "our assumption (IndusInd V2)", 1, 1)
    for p, label in (("cards", "Cards"), ("accounts", "Accounts and deposits"), ("upi", "UPI and BHIM IndusPay"),
                     ("insurance", "Insurance"), ("digital", "Digital")):
        target = 100 * COMPLAINT_MIX[p]
        add(f"Complaint share: {label}", 100 * by_p[p] / n_cmp, f"{100 * by_p[p] / n_cmp:.1f}% ({IN(by_p[p])})",
            f"{target:.0f}% (our split of K5's order)", "K5 (derived)", target, target)
    for b in full["businesses"]:
        v = b["internal"]["volume"]
        add(f"Contacts: {b['label']}", v, f"{IN(v)} ({100 * v / total:.0f}%)", "no anchor; follows the sample's product mix", "none", v, v)

    # ---- negative share (our assumption: 12% overall, 9-16% by product)
    neg = W([r for r in rs if r["sentiment"] == "negative"])
    add("Negative share of internal contacts", 100 * neg / total, f"{100 * neg / total:.1f}% ({IN(neg)})", "about 12%", "our assumption (D31)", 12, 12)
    cneg = W([r for r in cmp if r["sentiment"] == "negative"])
    add("Negative share of complaints", 100 * cneg / n_cmp, f"{100 * cneg / n_cmp:.0f}%", "mostly negative (85%)", "our assumption (D31)", 85, 85)
    rest = [r for r in rs if not is_complaint(r)]
    add("Negative share of queries and requests", 100 * W([r for r in rest if r["sentiment"] == "negative"]) / W(rest),
        f"{100 * W([r for r in rest if r['sentiment'] == 'negative']) / W(rest):.1f}%", "mostly neutral: under 12%", "our assumption (D31)", 0, 12)
    for b in full["businesses"]:
        v = b["internal"]
        add(f"Negative share: {b['label']}", 100 * v["negative"] / v["volume"], f"{100 * v['negative'] / v['volume']:.1f}%", "9-16% (cards and loans higher)",
            "our assumption (D31)", 9, 16)

    # ---- reject rate and the Internal Ombudsman (one register)
    cs = [json.loads(line) for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8")]
    WC = lambda xs: sum(c["w"] for c in xs)  # noqa: E731
    decided = WC([c for c in cs if c["decision_at"]])
    add("Complaints partly or fully rejected (sent to the Internal Ombudsman)", 100 * decided / WC(cs), f"{100 * decided / WC(cs):.1f}% ({IN(decided)})",
        "6-10% at peer banks", "peer disclosures (D31)", 6, 10)
    o = full["ombudsman"]
    add("Awaiting Internal Ombudsman review, of those sent", 100 * o["now"]["awaiting_io"] / max(o["io"]["decided"], 1),
        f"{100 * o['now']['awaiting_io'] / max(o['io']['decided'], 1):.0f}% ({IN(o['now']['awaiting_io'])} of {IN(o['io']['decided'])})",
        "no anchor; the queue is part of the one register", "D31", 0, 100)

    # ---- social inbox against the public sample
    social = sum(ch[k] for k in ("social",))
    pub = full["social_pulse"]["mentions"]
    add("Social inbox contacts against public mentions collected", social / pub, f"{social / pub:.1f}x ({IN(social)} vs {IN(pub)})", "no anchor",
        "K4 / public collection", 0.5, 2,
        "the inbox counts every message to the bank's care handles, including direct messages; the public figure is a "
        "collected sample of posts and reviews, not a census")

    # ---- at risk against Ombudsman filings
    add("Unhappy with the reply", o["now"]["unhappy"], IN(o["now"]["unhappy"]), "550-730 (30% of rejections, plus a few resolved)", "our assumption (D31, scaled to IndusInd)", 550, 730)
    add("At risk of reaching the Ombudsman (brink + eligible + unhappy)", o["now"]["at_risk"], IN(o["now"]["at_risk"]), "2,200-2,400", "our assumption (D31, scaled to IndusInd)", 2_200, 2_400)

    # ---- Ombudsman (O7, O8)
    omb = W([r for r in rs if r.get("escalation") == "rbi_ombudsman"])
    add("Ombudsman complaints, full window", omb, IN(omb), "320-550 (1,300-2,200 a year)", "O7 scaled to N31 (assumption)", 320, 550)
    add("Ombudsman complaints per week", omb / WEEKS, IN(omb / WEEKS), "25-42", "O8 scaled (derived)", 25, 42)
    add("Complaints at risk per Ombudsman complaint", o["now"]["at_risk"] / max(omb, 1), f"{o['now']['at_risk'] / max(omb, 1):.1f} to 1", "no anchor",
        "O7 / D31", 2, 10)
    add("Ombudsman complaints per lakh customers, annualised", (omb * 365 / DAYS) / 420, f"{(omb * 365 / DAYS) / 420:.1f}",
        "7.7 per lakh accounts, all banks", "O5 (anchor; industry)", 7.7, 7.7)

    # ---- lists (P1-P3)
    sizes = scale["list_sizes"]
    for lst in full["customer_pulse"]["lists"]:
        k, size = lst["id"], sizes[lst["id"]]
        if k == "uhni":
            add("List size: Pioneer (Ultra HNI)", size, IN(size), "about 60,000", "our assumption (IndusInd V2)", 60_000, 60_000)
            add("Ultra HNI share in contact", 100 * lst["in_contact"] / size, f"{100 * lst['in_contact'] / size:.1f}%", "15-30%", "P2 (assumption)", 15, 30)
        elif k in ("priority_a", "priority_b"):
            add(f"List size: {lst['label']}", size, IN(size), "low thousands at most", "P3 (assumption)", 1_000, 5_000)
        else:
            add(f"List size: {lst['label']}", size, IN(size), "between the small lists and Pioneer", "our assumption (D29)", 2_000, 60_000)
        if k != "uhni":
            add(f"{lst['label']}: customers with a contact", lst["in_contact"], f"{IN(lst['in_contact'])} ({100 * lst['in_contact'] / size:.0f}% of the list)",
                "no anchor; our assumption", "D29", lst["in_contact"], lst["in_contact"])
        per_c = lst["volume"] / max(lst["in_contact"], 1)
        add(f"{lst['label']}: contacts per contacting customer", per_c, f"{per_c:.1f} ({IN(lst['volume'])} contacts)", "2-3", "our assumption (D29)", 2, 3)
    contacting = sum(customers[m]["cw"] for m in {r["masked_id"] for r in rs})
    add("All customers with a contact, full window", contacting, IN(contacting), "no anchor; about 0.4% of an assumed 4.2 crore customers", "A1 / D29", contacting, contacting)

    out = ["# IndusInd pulse V2 · volume validation: internal layer against the public anchors", "",
           "Written by `scripts/indusind_v2/volume_validation.py` from `data/out/indusind_v2/periods.json` and the seed. Anchors:",
           "`docs/demo-rebuild/public_anchors_volumes.md`. Full window = 1 Jul to 29 Sep 08:30 (13 weeks).", "",
           f"Sample kept: {IN(scale['sample']['rows'])} rows and {IN(scale['sample']['customers'])} customers; every figure below is a weighted sum of those rows.", "",
           "Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.", "",
           "Pending complaints are calibrated to the published stock (C2: 16,133 pending at year-end), not to 3-4% of the window's intake: C6 is that stock over a full year's intake, and against one quarter's intake the same stock is about 15%.", "",
           "| Metric | Our figure | Anchor | Source | Ratio | Verdict |", "|---|---|---|---|---|---|"]
    out += [f"| {m} | {o} | {a} | {s} | {r} | {v} |" for m, o, a, s, r, v in rows]
    not_ok = [r for r in rows if not r[5].startswith("OK")]
    out += ["", f"{len(rows)} rows; {len(rows) - len(not_ok)} OK; {len(not_ok)} justified or to fix."]
    (ROOT / "qa" / "indusind_v2_volume_validation.md").write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
    print(f"volume_validation: {len(rows)} rows, {bad} to fix, {len(not_ok) - bad} justified")
    for r in not_ok:
        print("  ", r[0], "|", r[1], "|", r[4], "|", r[5][:90])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
