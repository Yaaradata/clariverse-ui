#!/usr/bin/env bash
# NatWest Group pulse (docs/natwest/brief.md): the oct13 pipeline, re-parameterised. Rebuilds data/out/natwest_pulse/
# and data/seed/natwest_pulse/ (what /natwest-pulse/v1/* reads) from data/raw/natwest/ (gitignored) and the
# illustrative internal layer, then runs the NatWest reconcile and volume validation. Source counts are logged per
# source; a source with no files is "not loaded" and its tiles read "Public data not yet loaded".
set -euo pipefail
cd "$(dirname "$0")"
PY="${PYTHON:-$(command -v python3 >/dev/null 2>&1 && echo python3 || echo python)}"
export PYTHONIOENCODING=utf-8
"$PY" normalise.py
"$PY" classify.py
"$PY" aggregate.py
"$PY" public_v3.py
"$PY" seed_internal_v3.py
"$PY" seed_complaints_v3.py
"$PY" periods_v3.py
"$PY" ask.py
"$PY" check_reconcile_v3.py
"$PY" volume_validation.py
"$PY" ../natwest_routes.py
