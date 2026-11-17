#!/usr/bin/env bash
# Swedbank pulse (docs/swedbank/kickoff_prompt.md): the NatWest pipeline, re-parameterised for Swedbank Swedish Banking.
# Rebuilds data/out/swedbank_pulse/ and data/seed/swedbank_pulse/ (what /swedbank-pulse/v1/* reads) from
# data/raw/swedbank/ (gitignored) and the internal layer, then runs the reconcile, the zero-defect gate (SW-D15), the
# public provenance check and the volume validation. Any failed check stops the run.
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
"$PY" seed_social_inbox.py  # NW-D100: social-inbox handling (internal)
"$PY" responses_internal.py  # SW-D17: every reply figure reads the internal seed
"$PY" periods_v3.py
"$PY" ask.py
"$PY" public_gate.py  # NW-D84: review sentiment share hidden until the blind check passes (SW-D15 point 8)
"$PY" check_reconcile_v3.py
"$PY" check_gate.py  # SW-D15 points 1-3: one register, nested windows, no empty figure
"$PY" public_provenance.py  # SW-D15 point 7: every public row traces to data/raw/swedbank
"$PY" volume_validation.py  # SW-D15 point 11
"$PY" ../swedbank_routes.py
