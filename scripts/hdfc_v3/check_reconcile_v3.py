"""Reconcile checks for the V3 layer (B4 §8 check_reconcile, B7 §2). Exit code 1 on any failure.

Public: product rows + excluded businesses = on-topic total (themes.json), and = signals.json by_business.
Internal: every dial, cohort, deliverable and persona figure recomputed from the record-level files.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys

from common import NOW, OUT_APP, SEED_V3, load

NOW_DT = dt.datetime.fromisoformat(NOW)


def main() -> int:
    fails: list[str] = []

    def ok(cond: bool, msg: str):
        print(("PASS " if cond else "FAIL ") + msg)
        if not cond:
            fails.append(msg)

    themes = load(OUT_APP / "themes.json")
    signals = load(OUT_APP / "signals.json")
    products = load(OUT_APP / "products.json")
    rows_total = sum(r["count"] for r in products["rows"]) + sum(products["excluded"].values())
    ok(rows_total == themes["total_items"], f"public product rows + excluded = on-topic total ({rows_total} = {themes['total_items']})")
    for f in ("count", "negative", "escalation"):
        a = sum(r[f] for r in products["rows"]) + (sum(products["excluded"].values()) if f == "count" else sum(b[f] for b in signals["by_business"] if b["business"] in products["excluded"]))
        e = sum(b[f] for b in signals["by_business"])
        ok(a == e, f"public product {f} reconciles to signals.by_business ({a} = {e})")

    agg = load(SEED_V3 / "aggregates.json")
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    ok(len(inter) == agg["dials"]["total"] == agg["sample"]["interactions"], f"interactions total {len(inter)}")
    n_open = sum(1 for r in inter if r["status"] == "open")
    n_otl = sum(1 for r in inter if r["status"] == "open" and r["breached"])
    ok(n_open == agg["dials"]["open"], f"open recomputed {n_open}")
    ok(n_otl == agg["dials"]["open_too_long"], f"open too long recomputed {n_otl}")
    for f in ("total", "open", "open_too_long", "closed", "closed_or_responded"):
        ok(sum(p[f] for p in agg["products"]) == agg["dials"][f], f"product dials sum to overall: {f}")
        ok(sum(c[f] for c in agg["channels"]) == agg["dials"][f], f"channel dials sum to overall: {f}")
    ok(sum(d["total"] for d in agg["deliverables"]) == len(inter), "deliverable rows cover every interaction once")
    for d in agg["deliverables"]:
        if d["met"] + d["outside"] != d["measured"]:
            ok(False, f"deliverable {d['id']} met + outside = measured")
    for c in agg["cohorts"]:
        members = {m for m, x in customers.items() if c["id"] in x["cohorts"]}
        rows = [r for r in inter if r["masked_id"] in members and r["status"] == "open"]
        o24 = sum(1 for r in rows if (NOW_DT - dt.datetime.fromisoformat(r["created_at"])).total_seconds() > 24 * 3600)
        ok(len(members) == c["customers"] and len(rows) == c["open"] and o24 == c["open_over_24h"], f"cohort {c['id']} recomputed (customers, open, over 24 h)")
        ok(c["open_over_24h"] <= c["open_over_5h"] <= c["open"], f"cohort {c['id']} over 24 h ≤ over 5 h ≤ open")
        ok(c["rm_notified_today"] <= c["rm_should_know"] <= c["customers_with_open_issue"] + c["customers"], f"cohort {c['id']} RM counts bounded")
    hi = sum(1 for r in inter if r["high_impact"])
    ok(hi == agg["high_impact"]["total"], f"high-impact complaints recomputed {hi}")
    ok(all("high_impact" not in c for c in customers.values()), "no person-level high-impact flag on any customer")
    ok(sum(b["count"] for b in agg["triage"]["buckets"]) == agg["triage"]["total"] == 20, "20 escalation emails, each in one bucket")
    ok(agg["qa"]["theme_mix_pass"], "internal theme shares within ±20% of public mix (themes ≥ 5% share)")
    # No value reused across unrelated headline metrics on the exec page.
    head = [agg["dials"]["open"], agg["dials"]["open_too_long"], agg["high_impact"]["total"], agg["customer_memory"]["with_open_issue"], agg["rm"]["should_know"]]
    ok(len(set(head)) == len(head), f"exec headline values are distinct {head}")
    print(f"check_reconcile_v3: {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
