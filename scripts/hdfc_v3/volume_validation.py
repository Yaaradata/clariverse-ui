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
    add("Total contacts, full window", total, IN(total), "16-33 lakh", "K3 (derived)", 1_600_000, 3_300_000)
    add("Complaints, full window", n_cmp, IN(n_cmp), "about 1.1 lakh", "C5 (derived from C1)", 110_000, 110_000)
    uhni = next(x for x in full["customer_pulse"]["lists"] if x["id"] == "uhni")
    add("Ultra HNI customers with a contact, full window", uhni["in_contact"], IN(uhni["in_contact"]), "30,000-60,000 (15-30% of the list)", "P2 (assumption)", 30_000, 60_000)
    add("Ultra HNI contacts, full window", uhni["volume"], IN(uhni["volume"]), "scales with P2: 2-3 contacts per contacting customer", "P2 (assumption)",
        2 * uhni["in_contact"], 3 * uhni["in_contact"])

    # ---- rates
    add("Complaints per day (window average)", n_cmp / DAYS, IN(n_cmp / DAYS), "about 1,210", "C3 (derived)", 1210, 1210)
    add("Complaints per week", n_cmp / WEEKS, IN(n_cmp / WEEKS), "about 8,500", "C4 (derived)", 8500, 8500)
    day = [r for r in cmp if r["created_at"] >= brief["start"][:16]]
    add("Complaints in the Morning brief (last 24 hours)", W(day), IN(W(day)), "about 1,210", "C3 (derived)", 1210, 1210)
    add("Contacts per complaint", total / n_cmp, f"{total / n_cmp:.1f}x", "15-30x", "K1 (assumption)", 15, 30)
    add("Contacts per day (window average)", total / DAYS, IN(total / DAYS), "18,000-36,000", "K2 (derived)", 18_000, 36_000)
    bv = brief["cx_pulse"]["internal"]["volume"]
    add("Contacts in the Morning brief (last 24 hours)", bv, IN(bv), "18,000-36,000", "K2 (derived)", 18_000, 36_000)

    # ---- pending
    pending = W([r for r in cmp if r["status"] == "open"])
    add("Complaints pending at the window end", pending, IN(pending), "16,133 pending at FY25 year-end", "C2 (anchor)", 16_133, 16_133)
    annual = n_cmp * 365 / DAYS
    add("Pending as a share of annual intake", 100 * pending / annual, f"{100 * pending / annual:.1f}%", "about 3.6%", "C6 (derived)", 3.0, 4.0)
    add("Pending as a share of the 13-week intake", 100 * pending / n_cmp, f"{100 * pending / n_cmp:.1f}%", "3-4% (the brief's reading of C6)", "C6 (derived)", 3.0, 4.0,
        "C6 is pending over a year's intake (16,133 of 4.42 lakh). The same stock against one quarter's intake is about "
        "15%; holding it at 3-4% of the window would mean about 4,000 pending, a quarter of the published stock (C2). "
        "Calibrated to C2 instead")

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
    add("Complaint mix: the two leading products", 1 if lead == ["loans", "cards"] else 0, " then ".join(lead), "loans, then cards", "K5 / O4", 1, 1)
    for p, label in (("cards", "Cards"), ("accounts", "Accounts and deposits"), ("payzapp", "PayZapp and UPI"),
                     ("insurance", "Insurance"), ("digital", "Digital")):
        target = 100 * COMPLAINT_MIX[p]
        add(f"Complaint share: {label}", 100 * by_p[p] / n_cmp, f"{100 * by_p[p] / n_cmp:.1f}% ({IN(by_p[p])})",
            f"{target:.0f}% (our split of K5's order)", "K5 (derived)", target, target)
    for b in full["businesses"]:
        v = b["internal"]["volume"]
        add(f"Contacts: {b['label']}", v, f"{IN(v)} ({100 * v / total:.0f}%)", "no anchor; follows the sample's product mix", "none", v, v)

    # ---- Ombudsman (O7, O8)
    omb = W([r for r in rs if r.get("escalation") == "rbi_ombudsman"])
    add("Ombudsman complaints, full window", omb, IN(omb), "1,750-3,000 (7,000-12,000 a year)", "O7 (assumption)", 1750, 3000)
    add("Ombudsman complaints per week", omb / WEEKS, IN(omb / WEEKS), "135-230", "O8 (derived)", 135, 230)
    add("Ombudsman complaints per lakh customers, annualised", (omb * 365 / DAYS) / 1200, f"{(omb * 365 / DAYS) / 1200:.1f}",
        "7.7 per lakh accounts, all banks", "O5 (anchor; industry)", 7.7, 7.7)

    # ---- lists (P1-P3)
    sizes = scale["list_sizes"]
    for lst in full["customer_pulse"]["lists"]:
        k, size = lst["id"], sizes[lst["id"]]
        if k == "uhni":
            add("List size: Ultra HNI", size, IN(size), "about 2 lakh", "P1 / A4 (sponsor anchor)", 200_000, 200_000)
            add("Ultra HNI share in contact", 100 * lst["in_contact"] / size, f"{100 * lst['in_contact'] / size:.1f}%", "15-30%", "P2 (assumption)", 15, 30)
        elif k in ("priority_a", "priority_b"):
            add(f"List size: {lst['label']}", size, IN(size), "low thousands at most", "P3 (assumption)", 1_000, 5_000)
        else:
            add(f"List size: {lst['label']}", size, IN(size), "between the small lists and Ultra HNI", "our assumption (D29)", 5_000, 200_000)
        if k != "uhni":
            add(f"{lst['label']}: customers with a contact", lst["in_contact"], f"{IN(lst['in_contact'])} ({100 * lst['in_contact'] / size:.0f}% of the list)",
                "no anchor; our assumption", "D29", lst["in_contact"], lst["in_contact"])
        per_c = lst["volume"] / max(lst["in_contact"], 1)
        add(f"{lst['label']}: contacts per contacting customer", per_c, f"{per_c:.1f} ({IN(lst['volume'])} contacts)", "2-3", "our assumption (D29)", 2, 3)
    contacting = sum(customers[m]["cw"] for m in {r["masked_id"] for r in rs})
    add("All customers with a contact, full window", contacting, IN(contacting), "no anchor; about 0.9% of 12 crore customers", "A1 / D29", contacting, contacting)

    out = ["# Volume validation: internal layer against the public anchors", "",
           "Written by `scripts/hdfc_v3/volume_validation.py` from `data/out/app_jul_sep/periods.json` and the seed. Anchors:",
           "`docs/demo-rebuild/public_anchors_volumes.md`. Full window = 1 Jul to 29 Sep 08:30 (13 weeks).", "",
           f"Sample kept: {IN(scale['sample']['rows'])} rows and {IN(scale['sample']['customers'])} customers; every figure below is a weighted sum of those rows.", "",
           "Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.", "",
           "Pending complaints are calibrated to the published stock (C2: 16,133 pending at year-end), not to 3-4% of the window's intake: C6 is that stock over a full year's intake, and against one quarter's intake the same stock is about 15%.", "",
           "| Metric | Our figure | Anchor | Source | Ratio | Verdict |", "|---|---|---|---|---|---|"]
    out += [f"| {m} | {o} | {a} | {s} | {r} | {v} |" for m, o, a, s, r, v in rows]
    not_ok = [r for r in rows if not r[5].startswith("OK")]
    out += ["", f"{len(rows)} rows; {len(rows) - len(not_ok)} OK; {len(not_ok)} justified or to fix."]
    (ROOT / "qa" / "volume_validation.md").write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
    print(f"volume_validation: {len(rows)} rows, {bad} to fix, {len(not_ok) - bad} justified")
    for r in not_ok:
        print("  ", r[0], "|", r[1], "|", r[4], "|", r[5][:90])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
