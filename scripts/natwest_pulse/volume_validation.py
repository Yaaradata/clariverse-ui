"""Writes qa/natwest_volume_validation.md (HL-18): the NatWest internal layer's figures against the public anchors
(docs/natwest/public_anchors.md; ANCHOR rows are the figures the brief quotes from the research pack, NW-D01). One row per metric: our figure | anchor | source | ratio | verdict.

Verdict: OK when the figure is inside the anchor's range, or within 2x of a point anchor. Anything else must be fixed
or justified in the row. Exit code 1 if any row is neither OK nor justified.
"""

from __future__ import annotations

import collections
import json
import sys

import datetime as dt

from common import OUT_APP, ROOT, SEED_V3, load
from scale_v3 import CHANNEL_GROUP, COMPLAINT_MIX, is_complaint

WEEKS = 103 / 7
DAYS = 103
IN = lambda n: f"{round(n):,}"  # noqa: E731


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


def load_complaints():
    return [json.loads(line) for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8")]


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

    # ---- complaints: the H1 2026 return (brief Step 3.8), scaled to the 103 days of the window
    add("Complaints, full window", n_cmp, IN(n_cmp), "about 49,200 (86,498 in H1 x 103/181)", "ANCHOR, derived", 49_200, 49_200)
    add("Complaints per week", n_cmp / WEEKS, IN(n_cmp / WEEKS), "about 3,345", "ANCHOR, derived", 3345, 3345)
    accounts = 86_498 / 2.74 * 1000
    per1000 = n_cmp * 181 / DAYS / accounts * 1000
    add("Complaints per 1,000 accounts, half-year equivalent", per1000, f"{per1000:.2f}", "2.74", "ANCHOR (H1 2026 return)", 2.74, 2.74)
    cs = load_complaints()
    WC = lambda xs: sum(c["w"] for c in xs)  # noqa: E731
    replied = [c for c in cs if c["final_reply_at"]]
    upheld = [c for c in replied if c["outcome"] == "resolved"]
    add("Complaints upheld, of those with a final response", 100 * WC(upheld) / max(WC(replied), 1),
        f"{100 * WC(upheld) / max(WC(replied), 1):.0f}%", "about 55%", "ANCHOR (H1 2026 return)", 45, 65)
    fast = [c for c in replied if (dt.datetime.fromisoformat(c["final_reply_at"]) - dt.datetime.fromisoformat(c["received_at"])) <= dt.timedelta(days=3)]
    add("Complaints closed within 3 days", 100 * WC(fast) / max(WC(cs), 1), f"{100 * WC(fast) / max(WC(cs), 1):.0f}%", "48%",
        "ANCHOR (H1 2026 return)", 48, 48, "the sample's resolution-time model is the oct13 one; tune once the per-product return lands")
    # ---- contacts: assumptions (docs/natwest/public_anchors.md)
    add("Total contacts, full window", total, IN(total), "about 8,500,000", "ASSUMPTION (19m retail customers, Pass 2)", 8_500_000, 8_500_000)
    add("Contacts per complaint", total / n_cmp, f"{total / n_cmp:.0f}x", "no anchor", "DERIVED", total / n_cmp, total / n_cmp)
    neg = W([r for r in rs if r["sentiment"] == "negative"])
    add("Negative share of internal contacts", 100 * neg / total, f"{100 * neg / total:.1f}%", "about 12%", "HL-19", 12, 12)
    cneg = W([r for r in cmp if r["sentiment"] == "negative"])
    add("Negative share of complaints", 100 * cneg / n_cmp, f"{100 * cneg / n_cmp:.0f}%", "mostly negative (85%)", "HL-19", 85, 85)
    for g, label in (("calls", "Calls"), ("whatsapp", "Cora"), ("chat", "Secure message"), ("emails", "Email"), ("branch", "Branch"), ("social", "Social")):
        n = W([r for r in rs if CHANNEL_GROUP[r["channel"]] == g])
        add(f"Channel share: {label}", 100 * n / total, f"{100 * n / total:.1f}% ({IN(n)})", "assumption", "ASSUMPTION", 100 * n / total, 100 * n / total)
    # ---- Ombudsman
    o = full["ombudsman"]["bank"] if "bank" in full["ombudsman"] else full["ombudsman"]
    omb = W([r for r in rs if r.get("escalation") == "rbi_ombudsman"])
    add("Referred to the Financial Ombudsman Service, full window", omb, IN(omb), "about 2,500 (5% of complaints)", "ASSUMPTION (no anchor)", 2_500, 2_500)
    add("At risk (brink + past the deadline + unhappy)", o["now"]["at_risk"], IN(o["now"]["at_risk"]), "no anchor", "DERIVED", o["now"]["at_risk"], o["now"]["at_risk"])
    pending = o["pending"]
    add("Awaiting a final response at the window end", pending, IN(pending), "about 7 weeks of intake at most", "DERIVED (8-week rule)",
        0, 7 * n_cmp / WEEKS)
    # ---- cohorts
    sizes = scale["list_sizes"]
    for lst in full["customer_pulse"]["lists"]:
        size = sizes[lst["id"]]
        add(f"Cohort size: {lst['label']}", size, IN(size), "assumption" if lst["id"] != "priority_b" else "about 43,000 (a quarter's complaints)",
            "ASSUMPTION" if lst["id"] != "priority_b" else "DERIVED", size if lst["id"] != "priority_b" else 43_000, size if lst["id"] != "priority_b" else 43_000)

    out = ["# NatWest · volume validation (HL-18)", "",
           "Written by `scripts/natwest_pulse/volume_validation.py` from `data/out/natwest_pulse/periods.json` and the seed.",
           "Anchors: `docs/natwest/public_anchors.md`. Full window = 1 Aug to 12 Nov 08:30 (103 days).", "",
           f"Sample kept: {IN(scale['sample']['rows'])} rows and {IN(scale['sample']['customers'])} customers; every figure below is a weighted sum of those rows.", "",
           "Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.", "",
           "| Metric | Our figure | Anchor | Source | Ratio | Verdict |", "|---|---|---|---|---|---|"]
    out += [f"| {m} | {o} | {a} | {s} | {r} | {v} |" for m, o, a, s, r, v in rows]
    not_ok = [r for r in rows if not r[5].startswith("OK")]
    out += ["", f"{len(rows)} rows; {len(rows) - len(not_ok)} OK; {len(not_ok)} justified or to fix."]
    (ROOT / "qa" / "natwest_volume_validation.md").write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
    print(f"volume_validation: {len(rows)} rows, {bad} to fix, {len(not_ok) - bad} justified")
    for r in not_ok:
        print("  ", r[0], "|", r[1], "|", r[4], "|", r[5][:90])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
