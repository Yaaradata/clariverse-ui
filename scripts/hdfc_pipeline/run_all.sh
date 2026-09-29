#!/usr/bin/env bash
# Rebuild the V2 public layer and the synthetic internal layer from data/raw/hdfc_jul_sep/, then run the checks.
# Social items are labelled by the model batches in data/out/app_jul_sep/work/llm_batches/*.out.jsonl (see
# llm_gate.py); anything without an accepted label falls back to the rules in classify.py.
set -euo pipefail
cd "$(dirname "$0")"
python3 normalise.py
python3 classify.py
python3 aggregate.py
python3 ask.py
cd ../hdfc_v3
python3 public_v3.py
python3 seed_internal_v3.py
python3 check_reconcile_v3.py
cd ../..
python3 scripts/lint_terms.py
python3 scripts/check_pii.py
