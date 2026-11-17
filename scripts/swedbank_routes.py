"""Writes scripts/routes_swedbank.json: every /swedbank-pulse/v1 route, the oct13 route list with NatWest ids, from the
route folders and the data (products, Cards drill-downs, signal themes, one customer), so the 200-check and the crawl
follow the build. Run after the pipeline."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
P = "/swedbank-pulse/v1"


def main() -> None:
    out = ROOT / "data" / "out" / "swedbank_pulse"
    products = [r["id"] for r in json.loads((out / "products.json").read_text(encoding="utf-8"))["rows"]]
    themes = [t["id"] for t in json.loads((out / "themes.json").read_text(encoding="utf-8"))["themes"]]
    themes += [t for t in json.loads((out / "meta.json").read_text(encoding="utf-8")).get("theme_labels", {}) if t not in themes]
    personas = json.loads((ROOT / "data" / "seed" / "swedbank_pulse" / "aggregates.json").read_text(encoding="utf-8"))["personas"]
    routes = ["/swedbank-pulse", P, f"{P}/head-of-cx", f"{P}/mds-office", f"{P}/head-cx", f"{P}/satisfaction", f"{P}/market", f"{P}/priority",
              f"{P}/action-queue", f"{P}/deliverables", f"{P}/service-promise", f"{P}/my-view",
              f"{P}/module/everyday_accounts_app", f"{P}/module/nina_digital"]
    routes += [f"{P}/business/{p}" for p in products]
    routes += [f"{P}/business/everyday_accounts_app/{s}" for s in ("happy", "market", "service")]  # SW-D16 deep dive
    routes += [f"{P}/signal/{t}" for t in themes]
    routes += [f"{P}/customer/{personas[0]['masked_id']}"] if personas else []
    routes += [f"{P}/head-of-cx?period={p}" for p in ("brief", "7d", "14d", "all")]
    dest = ROOT / "scripts" / "routes_swedbank.json"
    dest.write_text(json.dumps(routes, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"swedbank_routes: {len(routes)} routes -> {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
