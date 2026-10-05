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
"$PY" seed_complaints_v3.py
"$PY" periods_v3.py
"$PY" check_reconcile_v3.py
"$PY" volume_validation.py
"$PY" walkthrough.py
cd ../..
# IndusInd (docs/indusind/): public voice (L2), internal seed, page payloads, reconcile and privacy checks.
# The raw public scrape lives outside the repo (handles, phone numbers, URLs). When it is present, profile and ingest
# it; otherwise the committed, redacted data/processed/indusind_l2/ is used as is.
if [ -d "${INDUSIND_L2_RAW:-../indusind_inputs/social_raw/IndusInd-jul1st26-sept30th26}" ]; then
  (cd scripts && "$PY" profile_indusind_l2.py && "$PY" ingest_indusind_l2.py)
else
  echo "indusind L2: raw scrape not present; using the committed data/processed/indusind_l2/"
fi
"$PY" scripts/seed_indusind.py
"$PY" scripts/seed_indusind_l2_illustrative.py
(cd scripts && "$PY" build_indusind.py)
"$PY" scripts/check_indusind.py
[ -f data/processed/indusind_l2/_audit/text.jsonl ] && (cd scripts && "$PY" sample_check_indusind_l2.py)
"$PY" scripts/lint_terms.py
"$PY" scripts/check_pii.py
"$PY" scripts/test_check_pii.py
"$PY" scripts/test_checks.py
# IndusInd route-check fixtures (no browser): an unlinked route without a watermark must fail, and so on.
node scripts/test_qa_indusind_routes.mjs
