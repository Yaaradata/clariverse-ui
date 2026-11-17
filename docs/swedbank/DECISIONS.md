# Swedbank pulse v1: decision log

Clone of `natwest-pulse/v1` (SW-D01). Persona: Head of Customer Experience, Swedish Banking. Scope: Swedbank Sweden,
private customers. Window 22 Oct – 17 Nov 2026, freeze 17 Nov 2026 07:45 CET. Brief: `docs/swedbank/kickoff_prompt.md`.
Every NatWest rule (HL-01..HL-34, NW-D91..NW-D100, `docs/demo-rebuild/MORNING_DECISIONS.md`) applies unless overridden here.

- **SW-D01 · Copy.** `app/natwest-pulse` → `app/swedbank-pulse`, `components/`, `lib/`, `scripts/natwest_pulse` →
  `scripts/swedbank_pulse`, `data/out|seed/natwest_pulse` → `swedbank_pulse`, `data/public/natwest_{config,register}` →
  `swedbank_*`, `scripts/natwest_routes.py` → `swedbank_routes.py`, `lint_natwest.py` → `lint_swedbank.py`. Paths and the
  loader constant only; 86/86 routes 200 on the copied NatWest data. `data/raw/swedbank/` and
  `data/out/swedbank_pulse/work/` are gitignored like NatWest's.
- **SW-D02 · Header, footer, scope.** Header `Swedbank · Customer Pulse · 17 Nov 2026 07:45 CET`; page title
  `LisN · Swedbank`; role heading Head of Customer Experience. Footer scope line as in the brief. Kronor as `kr`, no
  decimals. Dates `17 Nov`.
- **SW-D03 · Windows and time.** Morning brief · Last 7 days · Last 14 days · Full window. The 30-day slot is renamed, not
  removed (id `14d`, 14 days). The pipeline holds every time in UTC (its code compares ISO strings), so the freeze is
  `2026-11-17T06:45:00+00:00`; the screens convert to Europe/Stockholm (`format.ts` `toLocal`). Calendar-day buckets for
  public items use the item's UTC date (at most one hour from the Swedish date at midnight). Swedish public holidays
  replace the England and Wales list.
- **SW-D04 · Products, channels, routing.** Six products (`common.PRODUCTS`), Nina as module `nina_digital` (a channel
  row and a module, not a card). Channel rows: Calls · Nina · App and internet-bank messages · Email · Social · Branch
  (kontor). Swedish routing words per the brief; routing is total (every on-topic item lands in one product or
  `nina_digital`, else the pipeline exits 1). Superseded on the deep dive by SW-D16.
- **SW-D05 · Cohorts.** `priority_a` Customers in a vulnerable situation (10%) · `priority_b` Recent complainants
  (90 days, derived) · `uhni` Premium and Private Banking (6%) · `multi` Account-measure affected (1.5%).
- **SW-D06 · ARN watch.** Same keys and state machine as NatWest: `brink` = first reply overdue (15 business days,
  bank standard) · `eligible` = final decision issued, Kundombudsman appeal open (21 days, assumption) · `unhappy` =
  ARN eligible (until one year after the complaint) · `awaiting_io` = filed with ARN (90 days on the tile). Filed ≤
  tile 2 + tile 3, checked every window. ARN pace about 10 a week, labelled an assumption. The reconcile recomputes
  every state with its own code.
- **SW-D07 · Register swap and lint.** `scripts/lint_swedbank.py` (scope `swedbank`): UK terms (SW-UK), UK and demo
  banks (NW-BANK), internal labels (SW-LABEL), India terms, missing-data wording (SW-NODATA, SW-D17). Runs on source,
  payloads, built pages and the crawl; quotes exempt. Fixtures in `scripts/test_swedbank_checks.py`.
  `data/public/swedbank_register.json` rewritten from the research pack.
- **SW-D08 · Service standards ledger.** Ten rows in `common.DELIVERABLES`; Payment Services Act and Swish rule rows cite
  their source; every other row reads "confirm with the bank". Redress = ARN recommendation.
- **SW-D09 · Internal scale.** 3.8m private customers (ANCHOR), about 5m contacts a year (ASSUMPTION), 7,500 × 40 =
  300k complaints a year (DERIVED from an ASSUMPTION), Nina 35% (ASSUMPTION). 80 rows in
  `docs/swedbank/volume_validation.md`; tags never reach a screen.
- **SW-D10 · 5 Nov Swish disturbance: dropped.** The X daily series shows 4 and 3 posts on 5–6 Nov (no spike); the 10–13
  Nov X spike is macro forecasts, market news and a Baltic SMS-provider leak. No public or internal spike is seeded.
- **SW-D11 · Public layer.** 344 records read and labelled (`scripts/swedbank_pulse/public_labels.jsonl`); 77 on-topic
  retail items (38 reviews), 120 investor_corporate, 85 group_other, 58 mention-only/other bank/off-topic, 4 after the
  freeze. The brief expected about 220–250; the crawl does not hold them. Swedish original plus English gloss on every
  quote. PII redacted in normalise (personnummer, mobiles, clearing/account numbers, IBANs, names, handles).
- **SW-D11b · Blind sentiment check.** 77 items (all on-topic; 100 do not exist); independent labeller saw the text
  only. Review sources 36/38 = 94.7% (gate 90%): passed; social 30/39 = 77% (social never feeds a sentiment figure,
  NW-D91). `scripts/swedbank_pulse/blind_check_result.json` lists the sample ids.
- **SW-D12 · Ask LisN.** Five persona questions, answered from the data (screens and `ask.json`). Q2 replaced in SW-D16.
- **SW-D13 · Navigation.** Banking (Swedbank) · Head of Customer Experience on the role-based landing page; route
  `/swedbank-pulse/v1/head-of-cx`.
- **SW-D14 · How it ran.** Steps 1–3 in one commit; screens, public and internal layers as three parallel workers on
  separate files, one integration pass.
- **SW-D15 · Zero-defect gate.** `check_gate.py` (one register, full-payload nesting, no empty figure, Swedbank data not
  the NatWest copy), `public_provenance.py`, the crawl (`scripts/qa_swedbank_routes.mjs`: every route × every window;
  header text, internal labels, empty figures, missing-data wording) and `check_parity.py` (sections against NatWest).
- **SW-D16 · Deep dive to Everyday accounts and app (Usha).** Product id `everyday_accounts_app`; routes
  `business/everyday_accounts_app/{happy,market,service}` and `module/everyday_accounts_app` with the save list. Order:
  Everyday accounts and app · Payments and Swish · Cards · Mortgages · Savings and funds · Consumer loans. Deep-dive
  categories: app update · app crashes and speed · BankID and sign-in · account measures · app features · fees ·
  service and kontor. Headline: the app update and account measures; mortgage rates secondary. Ask Q2: "What did the
  app update cost us in the stores this month?". Consumer loans and Nina show a public count of 0 with "—".
- **SW-D17 · Bank response from the internal seed (Usha).** Every source's reply figures (share, bar, n of m, median
  time) read the social-inbox seed (`kind: source_reply`): App Store 55%, Google Play 50%, Trustpilot 40%, X 25%,
  Reddit 22% target shares, m = the source's on-topic count in the window; the 4 real Google Play replies are always in
  the handled set. The card carries the tag Internal once in its header. "no reply data", "no data", "not available",
  "n/a", "unavailable", "not fetched", "no replies found" are banned on screen.
- **SW-D18 · Sidebar and notes (Usha, 17 Nov).** The sidebar's Ask LisN button is replaced by Back to roles
  (`/role-based/swedbank_bank`); Ask LisN stays in the header bar. The page footer, the save-list scoring note and the
  deep-dive categories note are removed. The header keeps the freeze (17 Nov 2026 07:45 CET).
