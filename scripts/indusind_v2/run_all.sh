#!/usr/bin/env bash
# IndusInd pulse V2: rebuild data/out/indusind_v2/ and data/seed/indusind_v2/ (the data behind
# /role-based/indusind_bank/pulse-v2/*) from the IndusInd public pull and the synthetic internal layer.
# The raw pull lives outside the repo (INDUSIND_L2_RAW, default ../indusind_inputs/social_raw/IndusInd-jul1st26-sept30th26).
set -euo pipefail
cd "$(dirname "$0")"
PY="${PYTHON:-$(command -v python3 >/dev/null 2>&1 && echo python3 || echo python)}"
export PYTHONIOENCODING=utf-8
"$PY" normalise.py
"$PY" classify.py
"$PY" aggregate.py
"$PY" ask.py
"$PY" public_v3.py
"$PY" seed_internal_v3.py
"$PY" seed_complaints_v3.py
"$PY" periods_v3.py
"$PY" check_reconcile_v3.py
"$PY" volume_validation.py
