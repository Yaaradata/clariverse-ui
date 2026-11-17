# NatWest Pulse v1 · QA checklist (builder's own run, round 3, 17 Nov 2026)

Not a review: the fourth independent review runs in a fresh, read-only session (HL-11). Work on `main`; pushed to
`origin/main` after Usha confirmed Deployment Protection (17 Nov). Server: production build on port 3100, restarted
after the last build (HL-10). Data frozen 13 Nov 2026, 07:45 GMT; public window 1 Aug to 13 Nov 2026.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Layout is the `oct13` layout, relabelled; round-3 changes logged (NW-D90 to NW-D101) | PASS | `docs/demo-rebuild/MORNING_DECISIONS.md`; screenshots `qa/screens_natwest_pulse_v1/round3/` |
| 2 | Every `/natwest-pulse/v1/*` route 200 | PASS | `qa_routes_v2.mjs` on `scripts/routes_natwest.json`: 85/85 |
| 3 | HDFC and IndusInd routes still 200 (no change made there) | PASS | `scripts/routes.json` 26/26; `scripts/routes_indusind.json` 14/14 |
| 4 | Crawl: status, noindex header, footer note "internal figures illustrative", freeze date, no other demo bank outside customer quotes, no link leaving NatWest pages | PASS | `qa_natwest_routes.mjs`: 167/167 pages (85 seeds). The crawl now ignores script and style text (it had matched a quote's data inside the page payload) |
| 5 | Deployment Protection confirmed | PASS | Usha, 17 Nov 2026; pushed `f673d8b` |
| 6 | Header and freeze time on every screen; header line and Ask LisN bar fixed on top (NW-D99) | PASS | "Friday 13 November 2026, 07:45 GMT"; watermark removed (NW-D96), the footer carries the illustrative-data note |
| 7 | Pipeline runs end to end, five public sources loaded | PASS | `scripts/natwest_pulse/run_all.sh`: App Store, Google Play, X, Reddit, Trustpilot |
| 8 | Reconcile | PASS | `check_reconcile_v3.py`: 0 failures, including windows nest, one referral series, Cora open-too-long, social-inbox handling (60-70% within 24h, replied in thread = responded, within the Social channel row) |
| 9 | Public negative share only once the sentiment check passed | PASS | `public_gate.py`: review sources passed (49/51); X and Reddit indicative only, never in a share or the mood dial |
| 10 | Lint, NatWest scope (India terms, internal labels, names, other demo banks, banned words) | PASS | `lint_natwest.py`: 0 hits on 326 files and pages, including 167 rendered routes. Customer quotes are exempt, also when the page wraps them over lines |
| 11 | Personal data and post links, NatWest files | PASS | `check_pii.py`: 0 NatWest hits. Wallet addresses and long hashes in post text are now masked as "[number]"; social-inbox references are letter-only hashes. Remaining hits in the run are Swedbank files, not part of this build |
| 12 | Fixtures | PASS | `test_checks.py` 0 failures (NatWest 106 lint, 57 reconcile, 1 skipped: cohort RM alerts); `test_check_pii.py` 0 failures; new fixture: social inbox handled too fast |
| 13 | Biome on NatWest folders; tsc | PASS | `biome check` clean on `components/lib/app natwest-pulse`; `tsc --noEmit` exit 0 |
| 14 | `next build` | PASS | compiled, exit 0 |
| 15 | Personal loans routing (NW-D98) | PASS | 18 public items, 17 from customer sources (X noise removed); top issue from loan themes only |
| 16 | High-impact and high-priority mentions show handling (NW-D100, NW-D101) | PASS | "Handled n of m" with the Internal tag in every window; Google Play and Trustpilot keep their public reply figures |
| 17 | Screenshots 1440, 390, 1536×730 @1.25, light and dark | PASS | 174 page views in `qa/screens_natwest_pulse_v1/round3/`, local fonts |
| 18 | Overlapping text (layout script) | FAIL (unchanged) | 54 of 174 views flag overlaps, the same views as the previous round-3 report: mostly a figure and its label on one wrapped line ("▼ −7%" x "open backlog vs previous", "Top issue:" x the issue), and the market and credit-card happy pages. Not new; not fixed in this pass |
| 19 | Each brand filter | FAIL (not built) | `oct13` has no brand filter; layout rule bars adding one (NW-D27) |

## Numbers a UK banker may question

- Social-inbox handling (about 65% within 24 hours, 84% handled in all) is seeded, internal and illustrative; it is not
  a NatWest figure.
- High-impact sentiment is shown as "indicative": 59 of the 66 posts are on X, where sentiment was not checked.
- Referred to the Financial Ombudsman Service: about 150 a week is an assumption with no anchor.
- Contacts and Cora's channel share are assumptions.
