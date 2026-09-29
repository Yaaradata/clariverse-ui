#!/usr/bin/env bash
# Rebuild the V2 public layer and the synthetic internal layer from data/raw/hdfc_jul_sep/, then run the checks.
# Social items are labelled by the model batches in data/out/app_jul_sep/work/llm_batches/*.out.jsonl (see
# llm_gate.py); anything without an accepted label falls back to the rules in classify.py.
# People's names and handles are redacted in normalise.py and redact_batches.py (scripts/pii_names.py).
set -euo pipefail
cd "$(dirname "$0")"
PY="${PYTHON:-$(command -v python3 >/dev/null 2>&1 && echo python3 || echo python)}"
export PYTHONIOENCODING=utf-8
"$PY" redact_batches.py
"$PY" normalise.py
"$PY" classify.py
"$PY" aggregate.py
"$PY" ask.py
cd ../hdfc_v3
"$PY" public_v3.py
"$PY" seed_internal_v3.py
"$PY" check_reconcile_v3.py
cd ../..
"$PY" scripts/lint_terms.py
"$PY" scripts/check_pii.py
"$PY" scripts/test_check_pii.py
"$PY" scripts/test_checks.py
