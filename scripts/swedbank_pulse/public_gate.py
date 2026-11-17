"""Public negative-share gate (NW-D84). Until data/public/swedbank_config.json records the sentiment-accuracy check as
passed, every public negative share in the page payloads is written as null, so the screens show "—". Internal shares
(under "internal" and the internal journey table) are left alone. Runs last in run_all.sh, after the reconcile.
"""

from __future__ import annotations

import json

from common import OUT_APP, ROOT, dump

KEYS = ("negative_share", "share_negative")
INTERNAL = ("internal", "journey", "tiers", "tiers_bank")
FILES = ("periods.json", "themes.json", "products.json", "app_pulse.json", "store_series.json", "briefing.json")


def gate(o, inside_internal=False) -> int:
    n = 0
    if isinstance(o, dict):
        for k, v in o.items():
            if k in KEYS and not inside_internal and v is not None:
                o[k] = None
                n += 1
            else:
                n += gate(v, inside_internal or k in INTERNAL)
    elif isinstance(o, list):
        for v in o:
            n += gate(v, inside_internal)
    return n


def main():
    cfg = json.loads((ROOT / "data" / "public" / "swedbank_config.json").read_text(encoding="utf-8"))
    passed = bool(cfg["sentiment_accuracy_check"]["passed"])
    meta_path = OUT_APP / "meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["sentiment_checked"] = passed
    dump(meta, meta_path)
    if passed:
        print("public_gate: sentiment accuracy check passed; public negative share shown")
        return
    total = 0
    for f in FILES:
        p = OUT_APP / f
        d = json.loads(p.read_text(encoding="utf-8"))
        n = gate(d)
        dump(d, p)
        total += n
    print(f"public_gate: sentiment accuracy check not passed; {total} public negative-share figures hidden")


if __name__ == "__main__":
    main()
