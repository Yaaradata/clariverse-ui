# IndusInd · QA checklist (IND-B4 §10, items 1–7)

Routes `/role-based/indusind_bank/customer-pulse/*` (roles CEO's office and Head of CX on the Indus Ind Bank page; `/indusind-v1/*` redirects). Branch `feat/indusind-v1`, data freeze 2 Oct 2026, 18:00 IST (provisional). **Not reviewed:** item 8, the independent
review, runs later in a fresh session (`qa/independent_review_indusind_v1.md`). Nothing here marks the build as
reviewed.

**IND-D1 is missing.** All 80 register values are pending, so every item that compares an on-screen number with IND-D1
fails until it arrives.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Every on-screen number checked against the register; labels and bases match IND-D1 | **FAIL (blocked on IND-D1)** | `scripts/check_indusind.py` checks every L1 figure on every page against `data/public/indusind_register.json` (label, period, display): 0 failures, 2,167 bound figures. Labels and bases come from IND-B3 §2; IND-D1 is not in the repo, so they are not yet matched to it and every value shows "pending verification". Public (L2) figures are checked against `data/public/indusind_l2_metrics.json` (registry check, with a fixture). |
| 2 | IND-B3 §8 lint passes, all 26 rules | **PASS** | `python scripts/lint_terms.py`: 0 hits over the IndusInd UI source, register, seed, payloads, answer bank and the built pages. 36 IndusInd lint fixtures, each tripping its rule (`scripts/test_checks.py`: 0 failures). |
| 3 | Reconciliation: business row = module; Cards row = S-CARDS; L3 totals = register at 31 Mar and 30 Jun | **FAIL (third part blocked on IND-D1)** | Business rows = home pulse per business and Cards row = Cards screen, in every window, for internal (L3) and public (L2) counts; home public total = sum of rows: all pass, each with a failing fixture. Period-end balances are bound to N03–N06, D03, D04, but those values are pending, so the equality cannot be shown. |
| 4 | Depth test per home card: rupee line or exposure; true peer or greyed chip; what customers said; owner and drafted action; something not in the MD's pack | **FAIL (partly)** | Rupee line or exposure: A (S03, S04), B (S01, S02), C (S05) as pending chips; D carries the exposure statement. Peers: greyed "pending verification" chips. Owner and drafted action: all four. What customers said: A, B, C and D each show their public-voice lines, but no line reaches 15 items in the last 4 weeks, so each reads "Not enough public items this window" (deposit sub-themes are too small; B, C and D have too few items in every window) and show "Not enough public items this window". Not-in-the-pack element: internal illustrative splits on all four. |
| 5 | Exactly four tiles; one computed quiet item; Improving strip with verified items only | **FAIL (Improving blocked on IND-D1)** | Four tiles on every home variant (`report.json`: tiles=4); one quiet item from a computed check that passed, with a fixture. The Improving strip shows register entries N10, N14, N20, all pending, so no item is verified yet. |
| 6 | No home or Cards text mentions SFIO, SEBI, derivatives, fraud at the bank or former management | **PASS** | Lint rules 13 and 23 over all copy; grep of the rendered pages for SFIO, SEBI, derivative and former management: 0 hits. Public `trust_governance` items are excluded from every theme and example; theme paraphrases are hand-written. |
| 7 | Screenshots at 1440 px and on a phone, no large blank gaps, watermark on every screen | **PASS** | `qa/screens_indusind_v1/`: 6 screens × 2 views + home with the Cards filter × 2 views, at 1440 and 390 (full page, plus an end-of-page shot with the Ask bar). All 200, no horizontal scroll, watermark on all 28 (`report.json`). `qa_overflow.mjs` at 1536@1.25 and 390: PASS. `qa_gaps_v2.mjs`: largest remaining gap 46 px (home card D title row; Deposits tab buttons are a false positive). Ask bar clear of the footer on every page. |

## Checks run (in order)

| Check | Result |
|---|---|
| Pipeline (`bash scripts/hdfc_pipeline/run_all.sh`, HDFC and IndusInd, with the public-voice profile and ingest) | PASS |
| Reconcile: `check_reconcile_v3.py` (HDFC) and `check_indusind.py` | PASS, 0 failures each |
| Lint, all 26 IndusInd rules, plus the internal-names lint | PASS, 0 hits (source and build) |
| PII and payload grep (`check_pii.py`; rendered pages for URLs, handles, emails, phones, PAN, internal labels, HDFC strings, source links) | PASS, 0 hits in 90 files; 0 in 14 rendered routes |
| Fixtures (`test_check_pii.py`, `test_checks.py`) | PASS (IndusInd: 36 lint, 23 reconcile; HDFC: 39 reconcile, 26 lint) |
| Biome (IndusInd files) and tsc | PASS. The three shared role-based files edited for the new roles already fail Biome formatting on main and were not reformatted (IV-15) |
| `next build` | PASS |
| Routes on the restarted server | 14/14 IndusInd, 26/26 HDFC: 200; role picker and Head of Cards 200; `/indusind-v1/*` 307 to the new routes |

## Public voice (L2) notes

- On screen: INDIE reviews on Google Play and the App Store, and consumercomplaints.in only. X, Reddit and MouthShut
  wait on a licence decision (`qa/indusind_l2_profile.md`).
- Negative share is hidden: `flags.sentiment_check_passed` is false until a person confirms
  `qa/indusind_l2_sample_check.md`.
- Google Play is 95–100% of every public count (footnoted) and starts 10 Aug (the collector's cap): windows reaching back further count from 10 Aug, with earlier App Store items shown apart.
- Card G (app release) candidate: `docs/indusind/card_g_candidate.md`; not swapped in.

## Re-scoped checks (all routes reachable from `/role-based/indusind_bank`)

`scripts/qa_indusind_routes.mjs` crawls from the role page and follows every link under `/role-based/indusind_bank`.

| Check | Routes covered | Result |
|---|---|---|
| Status 200 | 67 | 67/67 |
| noindex (`X-Robots-Tag`) | 67 | 67/67 |
| Watermark | 67 | 67/67 (the role page included) |
| Rendered-page grep (URLs, handles, emails, phones, PAN, internal labels, HDFC strings, source links) | 67 | 67/67 clean |
| lint_terms (26 rules and HL-06, HL-22, HL-28) on the rendered text | 67 | 0 hits |
| check_pii patterns on the rendered text | 67 | 0 hits |
| Screenshots | 15 screens × 3 sizes (1440, 390, 1536 at 1.25) | 45, 0 problems |

Head of Cards opens S-CARDS. The earlier cards demo (`/role-based/indusind_bank/head_cards`) is unlisted, so the crawl does
not reach it; noindex still covers it.

## Re-judged on IND-D1 figures (3 Oct 2026)

IND-D1 and its v1.1 addendum are in `docs/indusind/`; the register holds 59 verified, 11 derived and 10 held entries.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Every on-screen number checked against the register; labels and bases match IND-D1 | **PASS** | `check_indusind.py`: 2,166 bound figures, 0 failures; every L1 display equals its IND-D1 value, computed views (days to go, "4% below a year ago", "6.44% → 5.95%") recomputed from the register, and 1,858 public and internal displays traced to their values; the fill script recomputes D01–D11 and S01–S07 and fails on any difference from the addendum |
| 3 | Reconciliation: business row = module; Cards row = S-CARDS; L3 totals = register at 31 Mar and 30 Jun | **PASS** | Rows = home pulse per business and Cards row = Cards screen in every window (internal and public), with fixtures; the seed's 31 Mar and 30 Jun balances carry the register's verified values (N03–N06, D03, D04) |
| 4 | Depth test per home card | **FAIL (one part)** | Rupee line or exposure: A ≈ ₹7,500 crore moved, ≈ ₹170–275 crore a year with its caveats; B ≈ ₹41.5 crore a year per bp; C ≈ ₹100 crore a year per 10 bp; D the exposure statement. True peer: A CASA (IDFC First, Yes, Federal), B cost of deposits (Federal 5.21%, Yes 5.4%; IDFC First cost of funds on its own row); C and D greyed "pending verification" (held peers). Owner and drafted action: all four. **What customers said: no card reaches 15 public items for a claim in the last 4 weeks** (only INDIE app reviews are licensed for screen), so each shows "Not enough public items this window" |
| 5 | Exactly four tiles; one computed quiet item; Improving strip with verified items only | **PASS** | Four tiles on every home variant; quiet item from a passed check; Improving: cost of deposits 6.44% → 5.95% year on year, retail deposits 49.5%, home loans ₹6,889 crore (+38% YoY), CRISIL outlook Stable from Negative, all verified |

Volume (HL-18): intake 0.8× N31 (pass); the pending stock is 5.5× below N32's FY25 year-end figure, justified in
`qa/indusind_volume_validation.md` (broadened FY25 classification) and flagged.

## Visual review of 3 Oct (re-run 5 Oct 2026)

| Item | Result | Evidence |
|---|---|---|
| 0. Review-fix round (Yes parsed, IO referrals cover rejections, Cards title, Outside label) | PASS | `check_indusind.py` sanity checks; Peers shows Yes verified |
| 1. Index labels where shown; Published FY25 block apart; closure risk an index | PASS | "(index)" on home, business table, Cards, Conduct register; IV-54 |
| 2. IO analysis due 31 Dec 2026; days to go from data freeze; footer; no wall clock | PASS | `qend` view recomputed by the check; IV-55 |
| 3. Card chips name each bank; CASA 31.2% → 29.4%; money lines as figures | PASS | `line`, `pair`, `peers` views traced, with fixtures |
| 4. Peer card dates, press list, thin rows collapsed, empty tiles hidden | PASS | `text` and `srcdate` views traced, with fixtures; IV-56, IV-57 |
| 5. Filter scopes Outside and Doing; Cards Outside = Cards page | PASS | reconcile check plus fixture (62 items, last 4 weeks); IV-58 |
| 6. "To confirm with the bank"; quiet item | PASS | public Play check fails (338 vs 403–931), internal kept; IV-59, IV-60 |
| Gaps | PASS | columns stack and stretch; the Head of CX Ombudsman watch runs full width |
| 7. Checks and screenshots | PASS | pipeline, reconcile, lint/PII, fixtures, Biome, tsc, build, 79/79 IndusInd and 26/26 V2 routes; `qa/screens_indusind_v1/` at 1440, 390 and 1536@1.25 |
