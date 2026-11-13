#!/usr/bin/env bash
# NatWest Group pulse: rebuild data/out/natwest_pulse/ and data/seed/natwest_pulse/ (the data behind
# /natwest-pulse/v1/*), then run the NatWest checks. The raw public pull lives in data/raw/natwest/
# (gitignored); while it is empty every public tile reads "Public data not yet loaded".
set -euo pipefail
cd "$(dirname "$0")"
PY="${PYTHON:-$(command -v python3 >/dev/null 2>&1 && echo python3 || echo python)}"
export PYTHONIOENCODING=utf-8
"$PY" normalise.py          # source counts logged per source (loaded / NOT LOADED)
"$PY" seed_natwest.py       # internal layer, every window x brand
"$PY" build_public.py       # register, public files, Ask LisN answer bank
"$PY" check_reconcile_v3.py
"$PY" volume_validation.py
"$PY" ../natwest_routes.py
