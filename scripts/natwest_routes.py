"""Writes scripts/routes_natwest.json: every route under /natwest-pulse, from the route folders and the data
(products, Cora journeys, windows and brands in natwest.json), so the 200-check and the crawl follow the build. Run after the pipeline."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "/natwest-pulse"
P = f"{BASE}/v1"


def main() -> None:
    nw = json.loads((ROOT / "data/out/natwest_pulse/natwest.json").read_text(encoding="utf-8"))
    products = [p["id"] for p in nw["products"] if p["id"] != "cora_digital"]
    journeys = [j["id"] for j in nw["journeys"]]
    routes = [BASE, P, f"{P}/mds-office", f"{P}/head-cx", f"{P}/satisfaction", f"{P}/market", f"{P}/priority",
              f"{P}/action-queue", f"{P}/deliverables", f"{P}/service-promise", f"{P}/my-view", f"{P}/module/cora_digital"]
    routes += [f"{P}/business/{p}" for p in products]
    routes += [f"{P}/signal/{j}" for j in journeys]
    # Window and brand states of the home screen (server-sliced per URL).
    routes += [f"{P}/mds-office?w={w['id']}&b={b['id']}" for w in nw["windows"] for b in nw["brands"]]
    out = ROOT / "scripts" / "routes_natwest.json"
    out.write_text(json.dumps(routes, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"natwest_routes: {len(routes)} routes -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
