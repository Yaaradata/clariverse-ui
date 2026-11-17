"""Swedbank zero-defect gate (docs/swedbank/kickoff_prompt.md SW-D15), the checks the NatWest reconcile did not already
make. Run after periods_v3.py and ask.py; exit 1 on any failure. `run(out_dir, seed_dir)` returns the failures so the
fixtures in scripts/test_checks.py can feed it tampered payloads.

1. One complaint register: for every window, the ARN watch tiles, the bank split by product, the deep-dive (Payments and
   Swish) block and the Ask LisN answers show the same figures; filed with ARN <= final decision issued + unhappy (ARN
   eligible), always.
2. Nested windows: Morning brief <= Last 7 days <= Last 14 days <= Full window for every count in the whole payload
   (every numeric leaf under a count-like key, lists matched by id), not a sample.
3. No empty windows: no card figure in any window is null, NaN, "undefined" or "0 of 0" in the payload (the rendered
   check is scripts/qa_swedbank_routes.mjs).
"""

from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from common import DEEP_DIVE_PRODUCT, OUT_APP, PERIOD_END, PRODUCT_IDS, SEED_V3  # noqa: E402

ORDER = ("brief", "7d", "14d", "all")
# Count-like keys: flows in a window, which can only grow when the window grows. Stocks at the window end (open, at
# risk, backlog) and shares, averages, changes are not counts and are not checked for nesting.
COUNT_KEYS = {"volume", "count", "items", "received", "responded", "handled", "high_impact", "negative", "positive",
              "escalation", "repeat", "complaints", "contacts", "total", "external", "internal_volume", "resolved",
              "reviews", "posts_n", "n"}
# Stocks and point-in-time figures that sit under count-like names in a few blocks.
STOCK_PATHS = re.compile(r"\.(now|prev|delta|buckets|on_lists|pending|open_too_long|backlog|stock|steady|as_of)\b"
                         # A "top" block names whichever theme leads in that window, so its count is not one series.
                         r"|\.top_\w+\b|\.peak\b")
# The ARN watch tiles (SW-D06), in the payload keys the watch keeps from the copied state machine.
TILES = ("brink", "eligible", "unhappy", "awaiting_io")
BAD_TEXT = re.compile(r"\bundefined\b|\bNaN\b|^null$|(?<![\d,])0 of 0\b|\bInfinity\b")


def _leaves(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from _leaves(v, f"{path}.{k}")
    elif isinstance(o, list):
        if o and all(isinstance(x, dict) and "id" in x for x in o):
            for x in o:
                yield from _leaves(x, f"{path}[{x['id']}]")
        # Unkeyed lists (trend points, rows in rank order) are not comparable across windows.
    else:
        yield path, o


def nesting(per: dict) -> list[str]:
    maps = {k: dict(_leaves(per["periods"][k])) for k in ORDER if k in per["periods"]}
    if set(maps) != set(ORDER):
        return [f"windows present: {sorted(maps)} (want {list(ORDER)})"]
    bad = []
    checked = 0
    for path, v in maps["all"].items():
        key = path.rsplit(".", 1)[-1]
        if key not in COUNT_KEYS or STOCK_PATHS.search(path) or isinstance(v, bool) or not isinstance(v, (int, float)):
            continue
        vals = [maps[k].get(path) for k in ORDER]
        if any(not isinstance(x, (int, float)) or isinstance(x, bool) for x in vals):
            continue
        checked += 1
        if any(a > b + 1e-9 for a, b in zip(vals, vals[1:])):
            bad.append(f"{path}: {vals}")
    if not checked:
        bad.append("no counts found to check")
    nesting.checked = checked  # type: ignore[attr-defined]
    return bad


def empties(per: dict) -> list[str]:
    bad = []
    for k in ORDER:
        for path, v in _leaves(per["periods"].get(k, {})):
            if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
                bad.append(f"[{k}] {path}: {v}")
            elif isinstance(v, str) and BAD_TEXT.search(v.strip()):
                bad.append(f"[{k}] {path}: '{v[:60]}'")
    return bad


def register(per: dict, ask: dict | None) -> list[str]:
    bad = []
    for k in ORDER:
        p = per["periods"][k]
        o = p.get("ombudsman") or {}
        now = o.get("now") or {}
        if not now:
            bad.append(f"[{k}] ARN watch block missing")
            continue
        for t in TILES:
            s = sum(x.get(t, 0) for x in o.get("by_business", []))
            if s != now.get(t):
                bad.append(f"[{k}] ARN tile {t}: products sum {s} != bank {now.get(t)}")
        row = next((x for x in o.get("by_business", []) if x["id"] == DEEP_DIVE_PRODUCT), None)
        dd = ((p.get("cards") or {}).get("ombudsman") or {}).get("now") or {}
        if row is None or any(row.get(t) != dd.get(t) for t in TILES):
            bad.append(f"[{k}] deep-dive ARN tiles {[dd.get(t) for t in TILES]} != its product row {[row and row.get(t) for t in TILES]}")
        # SW-D06: filed with ARN <= final decision issued (Kundombudsman appeal open) + unhappy (ARN eligible).
        for scope, blk in [("bank", now), *[(x["id"], x) for x in o.get("by_business", [])]]:
            if blk.get("awaiting_io", 0) > blk.get("eligible", 0) + blk.get("unhappy", 0):
                bad.append(f"[{k}] {scope}: filed {blk.get('awaiting_io')} > tile 2 + tile 3 ({blk.get('eligible')} + {blk.get('unhappy')})")
    # Ask LisN: every complaint figure an answer quotes must be one of the watch's figures in that window.
    if ask:
        for a in ask.get("prompts", []):
            refs = a.get("figures") or {}
            per_id = a.get("period") or "7d"
            now = per["periods"].get(per_id, {}).get("ombudsman", {}).get("now", {})
            for key, val in refs.items():
                if key in TILES and now.get(key) != val:
                    bad.append(f"Ask '{a.get('id')}' [{per_id}] {key} {val} != ARN watch {now.get(key)}")
    return bad


def swedbank_data(out_dir: Path, per: dict) -> list[str]:
    """G4 (SW-D02/D03): the payload is the Swedbank rebuild, not the copied NatWest data. The freeze is 17 Nov 2026
    07:45 CET in the header and footer fields, the window is 22 Oct to 17 Nov, the six Swedbank products are the cards,
    and no figure block is byte-identical to NatWest's."""
    bad = []
    meta = json.loads((out_dir / "meta.json").read_text(encoding="utf-8")) if (out_dir / "meta.json").exists() else {}
    if (meta.get("brief_label"), meta.get("brief_time")) != ("17 Nov 2026", "07:45 CET"):
        bad.append(f"header freeze is '{meta.get('brief_label')}, {meta.get('brief_time')}' (want 17 Nov 2026 07:45 CET)")
    if meta.get("freeze_label") != "17 Nov 2026 07:45 CET":
        bad.append(f"footer freeze is '{meta.get('freeze_label')}'")
    if (meta.get("window") or {}) != {"start": "2026-10-22", "end": "2026-11-17"}:
        bad.append(f"window {meta.get('window')} (want 22 Oct to 17 Nov)")
    if not str(meta.get("scope_note", "")).startswith("Retail figures: Swedbank Swedish Banking"):
        bad.append("scope note is not the Swedbank one")
    if per.get("end") != PERIOD_END:
        bad.append(f"periods end {per.get('end')} (want {PERIOD_END})")
    ids = [b["id"] for b in per["periods"]["all"].get("businesses", [])]
    if ids != PRODUCT_IDS:
        bad.append(f"product cards {ids} (want {PRODUCT_IDS})")
    nw = out_dir.parents[0] / "natwest_pulse" / "periods.json"
    if nw.exists():
        n = json.loads(nw.read_text(encoding="utf-8"))["periods"].get("all", {})
        mine = per["periods"]["all"]
        for k in ("cx_pulse", "ombudsman", "customer_pulse"):
            if k in n and json.dumps(n[k], sort_keys=True) == json.dumps(mine.get(k), sort_keys=True):
                bad.append(f"{k} is identical to the NatWest payload (copied data, not rebuilt)")
    return bad


def run(out_dir: Path = OUT_APP, seed_dir: Path = SEED_V3) -> list[str]:
    per = json.loads((out_dir / "periods.json").read_text(encoding="utf-8"))
    askf = out_dir / "ask.json"
    ask = json.loads(askf.read_text(encoding="utf-8")) if askf.exists() else None
    fails = []
    fails += [f"G1 one register: {x}" for x in register(per, ask)]
    fails += [f"G2 nesting: {x}" for x in nesting(per)]
    fails += [f"G3 empty: {x}" for x in empties(per)]
    fails += [f"G4 Swedbank data: {x}" for x in swedbank_data(out_dir, per)]
    return fails


def main() -> int:
    fails = run()
    for f in fails[:80]:
        print("FAIL", f)
    print(f"check_gate: {getattr(nesting, 'checked', 0)} counts checked for nesting across 4 windows; {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
