# NatWest Pulse v1 · QA checklist (builder's own run, 13 Nov 2026)

Not a review: the independent review runs in a fresh, read-only session (HL-11). Build on local `main`, not pushed.
Server: production build on port 3100, restarted after the last build (HL-10).

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Layout is the `oct13` layout: same sections, order, cards, tables, drill routes, theme | PASS | Components, lib and routes reset to the `oct13` copy (ea6bad5); only copy, labels and the not-loaded state changed; screenshots `qa/screens_natwest_pulse_v1/` |
| 2 | Route tree reproduces `app/hdfc-pulse/oct13/` | PASS | Same folders under `app/natwest-pulse/v1/`; `docs/natwest/build_plan.md` records the list |
| 3 | Every `/natwest-pulse/v1/*` route 200 | PASS | `qa_routes_v2.mjs` on `scripts/routes_natwest.json`: 85/85 |
| 4 | HDFC and IndusInd routes unchanged | PASS | HDFC v2 26/26, `oct13` 26/26, IndusInd 14/14 |
| 5 | Crawl: status, noindex header, watermark, freeze footer, no other demo bank, no link leaving NatWest pages | PASS | `qa_natwest_routes.mjs`: 124/124 pages |
| 6 | No indexing | PASS | page meta `robots: noindex`; `X-Robots-Tag` on `/natwest-pulse` and `/role-based/natwest_bank`; `robots.txt` disallow |
| 7 | Deployment Protection confirmed | FAIL (blocked) | Not confirmed by Usha or Ranjith; nothing pushed (NW-D02) |
| 8 | Watermark and freeze date and time on every screen | PASS | crawl item 5; header "Thursday 12 November 2026, 07:45 GMT" |
| 9 | Pipeline runs, source counts logged | PASS | `scripts/natwest_pulse/run_all.sh`: six sources logged NOT LOADED |
| 10 | Reconcile | PASS | `check_reconcile_v3.py`: 0 failures |
| 11 | Volume validation (HL-18) | PASS | `qa/natwest_volume_validation.md`: 22/22 OK (complaints 49,200 vs anchor; 2.74 per 1,000; about 55% upheld; 48% within 3 days) |
| 12 | Lint, NatWest scope (India terms, internal labels, names, other demo banks) | PASS | `lint_terms.py`: 0 hits, 281 files and 124 rendered routes |
| 13 | PII and post-URL payload grep | PASS | `check_pii.py`: 0 hits in 113 files |
| 14 | Fixtures | PASS | `test_check_pii.py` 0 failures; `test_checks.py` 0 failures (NatWest 47 lint, 42 reconcile; 4 skipped until public data lands) |
| 15 | Biome on NatWest folders; tsc | PASS | `biome check` clean on `components/lib/app natwest-pulse`; `tsc --noEmit` clean |
| 16 | `next build` | PASS | exit 0 |
| 17 | No synthetic public data (HL-15) | PASS | public files empty; external blocks read "Public data not yet loaded"; simulated replies removed (NW-D24) |
| 18 | Screenshots 1440, 390, 1536×730 @1.25, light and dark, both view states | PASS | 243 captures, local fonts (Outfit loaded) |
| 19 | Each brand filter | FAIL (not built) | `oct13` has no brand filter; layout rule bars adding one (NW-D27) |
| 20 | Overflow at 390 | FAIL (inherited) | 689 hits on NatWest vs 722 on the `oct13` originals, same screens and pattern; not restyled under the layout rule |
| 21 | Gap scan | See file | `qa/natwest_gaps.json` |
| 22 | Research pack figures and peers | FAIL (blocked) | Pack not supplied (NW-D01); register values beyond the brief's five figures pending |
| 23 | Signal pages | PASS | A page for every theme; "Public data not yet loaded" until public themes exist (NW-D29) |

## Numbers a UK banker may question

- Referred to the Financial Ombudsman Service: about 2,500 in 103 days (5% of complaints) is an assumption with no anchor;
  on screen, referred outnumbers "past 8 weeks" by a wide margin.
- Financially vulnerable cohort at 1.2 million (6% of customers) is an assumption; FCA's own estimates are far higher.
- Contacts (9 million in the window) and Cora's 30% channel share are assumptions.
- "Not upheld" 45% comes from the anchor; partly upheld is counted as upheld.
