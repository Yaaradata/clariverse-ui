#!/usr/bin/env bash
# Swedbank FULL QA after a production build (docs/swedbank/kickoff_prompt.md Step 13). Needs `next start -p 3100` on the
# fresh build. Order: crawl every route x every window -> lint (scope swedbank, incl. built pages and crawl) -> PII ->
# fixtures -> Swedbank inventory and parity against NatWest -> screenshots. Writes qa/_crawl/sw_qa_*.log; does not stop
# at the first failure so the report can list every result.
cd "$(dirname "$0")/../.."
export PYTHONIOENCODING=utf-8
BASE="${BASE:-http://localhost:3100}"
L=qa/_crawl
mkdir -p "$L"
node scripts/qa_swedbank_routes.mjs "$BASE" > "$L/sw_qa_routes.log" 2>&1; echo "routes exit $?" >> "$L/sw_qa_routes.log"
python -c "
import sys; sys.path.insert(0, 'scripts')
import lint_swedbank as l
h, n = l.run()
for x in h: print(x)
print(f'lint_swedbank: {len(h)} hit(s) on {n} files and pages, {l.CRAWLED_ROUTES} crawled routes')
sys.exit(1 if h else 0)" > "$L/sw_qa_lint.log" 2>&1; echo "lint exit $?" >> "$L/sw_qa_lint.log"
python scripts/check_pii.py > "$L/sw_qa_pii.log" 2>&1; echo "pii exit $?" >> "$L/sw_qa_pii.log"
python scripts/test_swedbank_checks.py > "$L/sw_qa_fixtures.log" 2>&1; echo "fixtures exit $?" >> "$L/sw_qa_fixtures.log"
node scripts/qa_inventory_pulse.mjs "$BASE" scripts/routes_swedbank.json "$L/swedbank_inventory.json" > "$L/sw_qa_inventory.log" 2>&1
python scripts/swedbank_pulse/check_parity.py "$L/natwest_parity_inventory.json" "$L/swedbank_inventory.json" > "$L/sw_qa_parity.log" 2>&1; echo "parity exit $?" >> "$L/sw_qa_parity.log"
FONTSOURCE_DIR="${FONTSOURCE_DIR:-C:/Users/USHAJA~1/AppData/Local/Temp/claude/D--office-clariverse-ui/7546bfdd-91ca-414f-89b2-775a90da0dd8/scratchpad/qa/node_modules/@fontsource}" node scripts/qa_screens_swedbank.mjs qa/screens_swedbank_pulse_v1 2 > "$L/sw_qa_screens.log" 2>&1; echo "screens exit $?" >> "$L/sw_qa_screens.log"
for f in routes lint pii fixtures parity screens; do tail -2 "$L/sw_qa_$f.log"; done
