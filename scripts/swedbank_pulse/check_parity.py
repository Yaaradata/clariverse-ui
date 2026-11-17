"""SW-D15 point 12: visual parity. Compares the screen inventory of every Swedbank route and window with the same NatWest
route (scripts/qa_inventory_pulse.mjs writes both): same sections, in the same order, the same number of tables in each.
Text may differ; structure may not. Exit 1 on any difference.

Route map: the worked deep dive moved from Credit cards to Everyday accounts and app (SW-D16), so NatWest business/cards
maps to Swedbank business/everyday_accounts_app (deep dive to deep dive); the plain product pages pair up in order.
NatWest's "Last 30 days" slot is Swedbank's "Last 14 days" (SW-D03).

Usage: python scripts/swedbank_pulse/check_parity.py [natwest_inventory.json] [swedbank_inventory.json]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PRODUCT = {"cards": "everyday_accounts_app", "current_accounts": "payments_swish", "payments_fraud": "cards",
           "savings": "savings_funds", "mortgages": "mortgages", "personal_loans": "consumer_loans"}
MODULE = {"cards": "everyday_accounts_app", "cora_digital": "nina_digital"}


def to_swedbank(route: str) -> str | None:
    path, _, q = route.partition("?")
    q = q.replace("period=30d", "period=14d")
    parts = path.split("/")
    if len(parts) < 2 or parts[1] != "natwest-pulse":
        return None
    parts[1] = "swedbank-pulse"
    if len(parts) > 4 and parts[3] == "business":
        parts[4] = PRODUCT.get(parts[4], parts[4])
    if len(parts) > 4 and parts[3] == "module":
        parts[4] = MODULE.get(parts[4], parts[4])
    if len(parts) > 4 and parts[3] == "signal":
        parts[4] = {"cora_unresolved": "nina_unresolved"}.get(parts[4], parts[4])
    out = "/".join(parts)
    return out + (f"?{q}" if q else "")


def shape(page: dict) -> list[tuple[int, int]]:
    return [(s.get("tables_n", len(s.get("tables", []))), len(s.get("tables", []))) for s in page["sections"]]


def compare(nw: list[dict], sw: list[dict]) -> tuple[list[str], int]:
    by_route = {p["route"]: p for p in sw}
    diffs, compared = [], 0
    for p in nw:
        target = to_swedbank(p["route"])
        if target is None or target not in by_route:
            continue
        q = by_route[target]
        compared += 1
        a, b = shape(p), shape(q)
        if len(a) != len(b):
            diffs.append(f"{target}: {len(b)} sections, NatWest {p['route']} has {len(a)}")
            continue
        for i, (x, y) in enumerate(zip(a, b)):
            if x != y:
                diffs.append(f"{target}: section {i + 1} ('{q['sections'][i]['title'][:50]}') has {y[0]} tables, NatWest {x[0]}")
    return diffs, compared


def main() -> int:
    nwf = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "qa" / "_crawl" / "natwest_parity_inventory.json"
    swf = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "qa" / "_crawl" / "swedbank_inventory.json"
    nw = json.loads(nwf.read_text(encoding="utf-8"))
    sw = json.loads(swf.read_text(encoding="utf-8"))
    diffs, compared = compare(nw, sw)
    missing = [p["route"] for p in nw if to_swedbank(p["route"]) and to_swedbank(p["route"]) not in {x["route"] for x in sw}]
    for d in diffs[:60]:
        print("DIFF", d)
    for m in missing[:20]:
        print("NO SWEDBANK PAGE for", m, "->", to_swedbank(m))
    print(f"check_parity: {compared} route-window pairs compared; {len(diffs)} difference(s); {len(missing)} without a pair")
    return 1 if diffs or missing or not compared else 0


if __name__ == "__main__":
    sys.exit(main())
