# SW-D18 report: overview and Everyday accounts and app

Scope: `/swedbank-pulse/v1/head-of-cx` and `/swedbank-pulse/v1/business/everyday_accounts_app`, four windows each
(Morning brief · Last 7 days · Last 14 days · Full window). Production build on port 3100. Layout untouched.

## Gate

| Check | Result |
|---|---|
| Pipeline (`scripts/swedbank_pulse/run_all.sh`) | Pass |
| Reconcile (`check_reconcile_v3.py`) | 0 failures |
| Zero-defect gate (`check_gate.py`): one register, nesting over the whole payload, no empty figure, Swedbank data | 0 failures; 664 counts nest across the four windows |
| Public provenance (`public_provenance.py`) | Every public item, count, quote and evidence row traces to `data/raw/swedbank` |
| Crawl, 2 routes × 4 windows (`SW_ROUTES=… qa_swedbank_routes.mjs`): status 200, noindex, header freeze, banned strings, "0 of 0", blanks, empty quote slots | 8/8 pass |
| Lint, scope swedbank (source, payloads, built pages, crawl) | 0 hits on 169 files and pages |
| PII (`check_pii.py`, incl. Swedish rules on payloads and built pages) | 0 hits |
| Fixtures (`test_swedbank_checks.py`) | 83, 0 failures (lint 64 · PII 13 · gate 5 · provenance 1) |
| Screenshots | 40 captures: both routes × four windows (1536 at 1.25, dark), plus 1440 and 390 in both themes |

Final build: the high-impact rings on the Everyday accounts and app page (seen in an earlier 7-day screenshot as
"100% · 1 of 1") now read "—" with "1 of 1" beneath; crawl 8/8, lint 0, PII 0 and the 40 screenshots are from that
build.

## What changed (SW-D18)

- **Comparisons.** Morning brief vs 15 Nov; Last 7 and 14 days vs the previous 7 and 14 days; Full window vs first
  half. Every delta uses this; no window is without a comparison. Cohort tiles show one label.
- **"ARN pace: assumption"** removed from both pages; provenance stays in `docs/swedbank/volume_validation.md`.
- **n-rule on every share.** n ≥ 20 → share; 3 ≤ n < 20 → share + "indicative"; n < 3 → "—" with the count. Product
  cards, store dials, question cards, external dials, high-impact rings. No 0% or 100% from n < 3.
- **Responded** on every product card and Issues-by-category row: n of m from the internal social-inbox seed, m = the
  product's or category's public count; m = 0 reads "0 public items".
- **Morning brief.** Rising negative share goes to Signals that are building, never Improving or stable; thin
  products read "N public items in the window"; items lead with the internal figure, then the public count.
- **Other.** Two named rows, "Praise and loyalty" and "General dissatisfaction" (owner: Everyday banking · CX lead),
  in the public and internal columns. Internal seed re-weighted; Other is last in ARN at-risk by category and in
  Issues by category (internal). 3 public items relabelled where the text supports it.
- **Save list.** At most 4 of 10 rows per category; covers account measures, BankID and sign-in, app crashes,
  service and kontor, fees; repeat contacts 1–5; no two reasons alike.
- **CX pulse header** "Internal N · External M", no percentages.
- **Question cards.** Plurals; "Largest theme" when nothing passes the rising rule; "target not named in most
  posts"; the service card leads with contacts not responded in 48h+, public count second.
- **Fixed on the way.** X-Robots-Tag noindex on every Swedbank page; "Handled 0 of 0" → "— (0 posts in the period)";
  "positive 0 of 0" on the external responded dial; "Kundombudsman (Customer Ombudsman)" wording; the signal page's
  "Forums (MoneySavingExpert) … not yet loaded" leftover; PII false positives on inbox record ids.

## Strings added to the banned on-screen list (lint scope swedbank, crawl and a must-fail fixture each)

SW-D17: `no reply data` · `no data` · `not available` · `n/a` · `unavailable` · `not fetched` · `no replies found`
SW-D18: `no earlier period` · `assumption` / `assumed` · `estimate` / `estimated` · `MoneySavingExpert` / `MSE`

## Screenshots

`qa/screens_swedbank_pulse_v1/sw_d18/laptop125/dark/`:
`head-of-cx_period_{brief,7d,14d,all}-0{1,2}.jpg` and
`business_everyday_accounts_app_period_{brief,7d,14d,all}-0{1,2}.jpg`.

## Open

- `signal/complaint_handling` (outside this scope): the theme has no public items, so the page has no public
  section; parity with NatWest differs there (6 route-window pairs).
- The Vercel font error is fixed in `frontend/next.config.mjs` (`outputFileTracingRoot` and `turbopack.root` both the
  repository root, commit b88c364); confirm on the next deployment.
