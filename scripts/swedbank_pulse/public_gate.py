"""Public sentiment gate (NW-D84, SW-D15 point 8). Every review-source sentiment share in the page payloads is written as
null (the screens show "—") unless scripts/swedbank_pulse/blind_check_result.json records the blind check on Swedish
text with review-source agreement of at least 90%. Internal shares (under "internal", the journey and tier tables) are
left alone. Runs in run_all.sh after periods_v3.py.

blind_check_result.json (written by the lead after an independent labeller labels work/blind_sample.jsonl blind):
  {"review_sources": {"agree": 36, "n": 37, "agreement_pct": 97.3}, "social_sources": {...},
   "sample": "data/out/swedbank_pulse/work/blind_sample.jsonl", "labeller": "...", "checked_on": "2026-11-17"}
"""

from __future__ import annotations

import json
from pathlib import Path

from common import OUT_APP, dump

RESULT = Path(__file__).resolve().parent / "blind_check_result.json"
THRESHOLD = 90.0
KEYS = ("negative_share", "share_negative", "share_positive", "net_sentiment", "net_first_half", "net_second_half",
        "net_change_pts")
INTERNAL = ("internal", "journey", "tiers", "tiers_bank")
FILES = ("periods.json", "themes.json", "products.json", "app_pulse.json", "store_series.json", "briefing.json")
MOOD_KEYS = ("value", "window_average", "delta_pts", "net", "net_7d", "net_7d_unweighted", "window_net", "last7_net",
             "change_pts", "net_unweighted")


def check_passed() -> tuple[bool, str]:
    if not RESULT.exists():
        return False, "no blind_check_result.json"
    try:
        res = json.loads(RESULT.read_text(encoding="utf-8"))
        pct = float(res["review_sources"]["agreement_pct"])
    except (KeyError, TypeError, ValueError, json.JSONDecodeError) as e:
        return False, f"blind_check_result.json unreadable ({e})"
    return pct >= THRESHOLD, f"review-source agreement {pct}% (gate {THRESHOLD}%)"


def gate(o, keys=KEYS, inside_internal=False) -> int:
    n = 0
    if isinstance(o, dict):
        for k, v in o.items():
            if k in keys and not inside_internal and v is not None and not isinstance(v, (dict, list)):
                o[k] = None
                n += 1
            else:
                n += gate(v, keys, inside_internal or k in INTERNAL)
    elif isinstance(o, list):
        for v in o:
            n += gate(v, keys, inside_internal)
    return n


def main():
    passed, why = check_passed()
    meta_path = OUT_APP / "meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["sentiment_checked"] = passed
    dump(meta, meta_path)
    if passed:
        print(f"public_gate: blind check passed ({why}); review sentiment shares shown")
        return
    total = 0
    for f in FILES:
        p = OUT_APP / f
        if not p.exists():
            continue
        d = json.loads(p.read_text(encoding="utf-8"))
        total += gate(d)
        dump(d, p)
    mp = OUT_APP / "mood.json"
    if mp.exists():
        d = json.loads(mp.read_text(encoding="utf-8"))
        total += gate(d, MOOD_KEYS)
        dump(d, mp)
    print(f"public_gate: blind check not passed ({why}); {total} public sentiment figures hidden")


if __name__ == "__main__":
    main()
