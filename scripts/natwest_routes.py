"""Writes scripts/routes_natwest.json: every /natwest-pulse/v1 route, the oct13 route list with NatWest ids, from the
route folders and the data (products, Cards drill-downs, signal themes, one customer), so the 200-check and the crawl
follow the build. Run after the pipeline."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
P = "/natwest-pulse/v1"


def main() -> None:
    out = ROOT / "data" / "out" / "natwest_pulse"
    products = [r["id"] for r in json.loads((out / "products.json").read_text(encoding="utf-8"))["rows"]]
    themes = [t["id"] for t in json.loads((out / "themes.json").read_text(encoding="utf-8"))["themes"]]
    personas = json.loads((ROOT / "data" / "seed" / "natwest_pulse" / "aggregates.json").read_text(encoding="utf-8"))["personas"]
    routes = ["/natwest-pulse", P, f"{P}/mds-office", f"{P}/head-cx", f"{P}/satisfaction", f"{P}/market", f"{P}/priority",
              f"{P}/action-queue", f"{P}/deliverables", f"{P}/service-promise", f"{P}/my-view",
              f"{P}/module/cards", f"{P}/module/cora_digital"]
    routes += [f"{P}/business/{p}" for p in products]
    routes += [f"{P}/business/cards/{s}" for s in ("happy", "market", "service")]
    routes += [f"{P}/signal/{t}" for t in themes]
    routes += [f"{P}/customer/{personas[0]['masked_id']}"] if personas else []
    routes += [f"{P}/mds-office?period={p}" for p in ("brief", "30d", "all")]
    dest = ROOT / "scripts" / "routes_natwest.json"
    dest.write_text(json.dumps(routes, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"natwest_routes: {len(routes)} routes -> {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
