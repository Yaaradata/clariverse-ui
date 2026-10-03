# IND-B3 · LisN for IndusInd Bank: data requirements
Version 1.2 · 2 October 2026 · **Internal to YaaraLabs. Safe to commit to the private build repo. Never send to the bank.**

Inherits:
- **IND-D1** (verified figures; it wins on any number);
- **IND-B2** (copy rules);
- **IND-B4** (screens);
- **HDFC B3a** (crawl schema) and **HDFC B4** (build rules: provenance, reconcile, lint).

v1.1 applies an independent review: atomic register, Q2 guard, corrected S03/S04, explicit lint, source and privacy fixes, and a reduced core scope.

## 0. The data in one paragraph
Every screen draws on three layers, and every tile says which:
- **`Public · verified`** holds disclosed figures, frozen in an atomic number register.
- **`Public · live`** holds the social pull, rate-card captures, adverts, press and regulator releases, frozen the evening before the demo.
- **`Internal · illustrative until discovery`** is a deterministic synthetic layer shaped like the first in-bank join we will ask the CDO for. It shows no balance or ratio after 30 Jun 2026.

---

## 1. Layers and rules

| Layer | Tag | Source | Rule |
|---|---|---|---|
| L1 | `Public · verified` | `data/public/indusind_register.json` (§2) | Exact value, label and basis from IND-D1. Nothing else from the research goes on screen. |
| L2 | `Public · live` | Social pull (§7), rate captures (§4), ads and press (§5) | Counts, never incidence. Reach only where the platform returns it. Frozen at 18:00 IST the day before the first preview (date to be set); the footer shows the freeze time. |
| L3 | `Internal · illustrative until discovery` | `data/seed/indusind_v1/` (§6) | Reconciles to L1 period-end figures at 31 Mar and 30 Jun 2026. **No balance, ratio or share for any date after 30 Jun 2026.** Jul–Sep weeks appear only as flows indexed to the Q1 weekly average (Q1 = 100). |

**Q2 FY27 guard (blocking):**
- IndusInd publishes a provisional quarterly business update a few days after quarter-end. For Q2 FY27 it was not out on 2 Oct 2026.
- **Watch the exchange filings daily.** When the update lands:
  1. add its figures to IND-D1 v1.1;
  2. re-anchor L3 to 30 Sep;
  3. re-check every home card's headline against it before any showing.
- Full Q2 results follow in late October. Repeat the same steps then.

---

## 2. Number register (L1)

**File:** `data/public/indusind_register.json`. **One figure per entry.**

Entry schema:
```json
{
  "id": "N08",
  "label_short": "Cost of deposits",
  "value": 5.95, "unit": "pct", "display": "5.95%",
  "period": "Q1 FY27 (Apr–Jun 2026)",
  "measure_basis": "quarterly_average",
  "entity_basis": "as_presented",
  "label_on_screen": "",
  "source_title": "Investor Presentation Q1 FY27", "source_url": "…", "source_date": "2026-07-22",
  "status": "verified",
  "derived_from": null,
  "do_not_pair_with": ["P03"],
  "display_default": true
}
```

Field values:
- `measure_basis`: period_end | quarterly_average | flow_quarter | annualised | rate_card | date | count_year.
- `entity_basis`: standalone | consolidated | as_presented. Use as_presented where IND-D1 does not state the basis, and confirm it before display.
- `status`: verified | derived | held.
- `derived_from`: `{ "ids": [...], "formula": "..." }` for derived entries.

All figures below are verified in IND-D1. "Derived" means arithmetic on verified figures.

**Deposits and funding**

| ID | Figure | Basis | Label on screen |
|---|---|---|---|
| N01 | Total deposits ₹4,14,766 crore, 30 Jun 2026 | period_end | — |
| N02 | Total deposits ₹3,99,931 crore, 31 Mar 2026 | period_end | Source: Q1 FY27 presentation, comparative column |
| N03 | Current accounts ₹34,620 crore, 30 Jun 2026 | period_end | — |
| N04 | Savings ₹87,440 crore, 30 Jun 2026 | period_end | — |
| N05 | Current accounts ₹35,034 crore, 31 Mar 2026 | period_end | — |
| N06 | Savings ₹89,899 crore, 31 Mar 2026 | period_end | — |
| N07 | Savings ₹91,113 crore, 30 Jun 2025 | period_end | — |
| D01 | CASA ₹1,22,060 crore, Jun 2026 | derived (N03 + N04) | — |
| D02 | CASA ₹1,24,933 crore, Mar 2026 | derived (N05 + N06) | — |
| D03 | Term deposits ₹2,92,706 crore, Jun 2026 | derived (N01 − D01) | "derived" |
| D04 | Term deposits ₹2,74,998 crore, Mar 2026 | derived (N02 − D02) | "derived" |
| D05 | CASA ratio 29.43%, displayed as 29.4% | derived (D01 ÷ N01) | "derived from reported CA and SA balances" |
| D06 | CASA ratio 31.24%, displayed as 31.2% | derived (D02 ÷ N02) | Same. Never show 31.24% beside a 31.2% label |
| D07 | Deposits +3.7% QoQ | derived | — |
| D08 | Savings −2.7% QoQ, −4.0% YoY | derived (N04, N06, N07) | — |
| N08 | Cost of deposits 5.95%, Q1 FY27 | quarterly_average | — |
| N09 | Cost of deposits 6.07%, Q4 FY26 | quarterly_average | — |
| N10 | Cost of deposits 6.44%, Q1 FY26 | quarterly_average | — |
| N11 | Cost of savings 4.72%, Q1 FY27 | quarterly_average | — |
| N12 | Cost of funds 5.05%, Q1 FY27 | quarterly_average | Never beside another bank's cost of deposits |
| D09 | Implied term-deposit cost ≈7.0% | derived ((N08 × N01 − N11 × N04) ÷ D03); average cost on period-end balances | "approximate" |
| D10 | Blended CASA cost ≈3.4% | derived ((N11 × N04) ÷ D01); current accounts at nil cost | "approximate" |
| N13 | Retail deposits (LCR definition) ₹1,90,166 crore | quarterly_average | "quarterly average" (mandatory) |
| N14 | Retail deposits share 49.5% of deposits | quarterly_average | "quarterly average; highest share yet (management)" |
| N15 | MD's estimate: cost-of-deposits gap to closest peer about 150 bp | statement | `display_default: false` (DEC-3). If on: evidence drawer only, labelled "management estimate, Q1 FY27 call; peer not named", never in the same row as P01–P02 |

**Peers**

| ID | Figure | Basis | Label |
|---|---|---|---|
| P01 | Federal cost of deposits 5.21%, Q1 FY27 | quarterly_average | "each bank's own Q1 FY27 disclosure" |
| P02 | Yes cost of deposits 5.4%, Q1 FY27 | quarterly_average | Same |
| P03 | IDFC First cost of funds 5.96%, Q1 FY27 | quarterly_average | Own row, labelled "cost of funds" |
| P04 | IDFC First CASA 50.8%, Jun 2026 | period_end | — |
| P05 | IDFC First CASA 49.8%, Mar 2026 | period_end | — |
| P06 | Yes CASA 32.7%, Jun 2026 | period_end | — |
| P07 | Yes CASA 35.1%, Mar 2026 | period_end | — |
| P08 | Federal CASA 32.23%, Jun 2026, up 188 bp YoY | period_end | "QoQ direction not confirmed" |
| P09 | RBL CASA 25.2% | quarterly_average | Footnote only: "average basis; not comparable" |
| P10 | Federal 1-year FD 6.25%; card effective 29 Sep 2026 | rate_card | Card date shown |
| P11 | Federal FD peak 6.70% (48 months); same card | rate_card | Same |
| P12 | Yes 12-month FD 6.65%; w.e.f. 2 Jun 2026 | rate_card | Same |
| P13 | Yes FD peak 7.25% (18 months 1 day to under 24 months); same card | rate_card | Same |
| P14 | RBL 365–500-day FD 6.90%; page dated 1 Oct 2026 | rate_card | Same |
| P15 | RBL savings 6% on ₹10 lakh–₹3 crore; page dated 1 Oct 2026 | rate_card | Same. Quote only this band |
| P16 | Federal savings 2.50% below ₹10 crore; effective 16 Jul 2026 | rate_card | Same |
| P17 | Yes savings 2.50% below ₹25 lakh; 3.50% for ₹25 lakh to under ₹100 crore; w.e.f. 7 Apr 2026 | rate_card | Re-read on demo day |

**Lending, returns, complaints, enforcement, regulation, app**

| ID | Figure | Basis | Label |
|---|---|---|---|
| N16 | Micro loans ₹16,305 crore (−3% QoQ) | period_end | "includes RBI-definition microfinance and other inclusive-banking loans" |
| N17 | Rural Banking ₹31,417 crore, 10% of loans | period_end | Never "microfinance". Not used in V1 copy |
| N18 | Credit cards ₹9,418 crore (−3% QoQ, −15% YoY) | period_end | — |
| N19 | Personal loans ₹9,930 crore (−4% QoQ) | period_end | — |
| N20 | Home loans ₹6,889 crore (+38% YoY) | period_end | — |
| N21 | Vehicle finance ₹99,718 crore (+3% YoY), 31% of loans | period_end | — |
| N22 | VF disbursements ₹10,832 crore, Q1 FY27 | flow_quarter | — |
| N23 | VF disbursements ₹12,665 crore, Q4 FY26 | flow_quarter | "seasonal March quarter" |
| N24 | VF disbursements ₹11,298 crore, Q1 FY26 | flow_quarter | — |
| D11 | VF disbursements −4% YoY; −14% vs the March quarter | derived | — |
| N25 | Loans ₹3,26,274 crore (+3% QoQ) | period_end | — |
| N26 | Wholesale ₹1,20,227 crore (+11% QoQ) | period_end | — |
| N27 | RoA 0.78% reported, Q1 FY27 (annualised) | annualised | — |
| N28 | RoA 0.63% excluding one-offs, Q1 FY27 (annualised) | annualised | — |
| N29 | Target: exit FY27 at about 1% RoA | statement | "management, Q1 FY27 call, 22 Jul 2026" |
| N30 | Path: ≈60% operating profit, ≈40% lower credit cost | statement | Same. No bp labels |
| N31 | FY25 complaints received 80,062 | count_year | "classification broadened in FY25; not comparable with FY24" |
| N32 | FY25 complaints pending at year-end 15,811 | count_year | Same |
| N33 | RBI penalty ₹59.20 lakh, 14 Aug 2026 (interest on certain current accounts; synthetic securitisation) | date | — |
| N34 | RBI penalty ₹27.30 lakh, 20 Dec 2024 (savings accounts opened for ineligible entities) | date | — |
| N35 | Governance Amendment Directions in force 1 Oct 2026 | date | — |
| N36 | Responsible Business Conduct Second Amendment effective 1 Jan 2027: full refund plus compensation where mis-selling is established; compulsory bundling barred; explicit consent | date | — |
| N37 | Internal Ombudsman Directions (14 Jan 2026): quarterly complaint-pattern analysis | date | Never "quarterly root-cause" |
| N38 | DPDP Consent Manager rules, November 2026 | date | Month and year only |
| N39 | DPDP main obligations, May 2027 | date | Same |
| N40 | CRISIL outlook to Stable from Negative, 19 Aug 2026 (AA+ reaffirmed) | date | — |
| N41 | INDIE 2.6 million+ monthly active users | period_end | "bank-reported" |
| N42 | ₹6,800 crore+ of FDs and RDs opened through INDIE in Q1 FY27 | flow_quarter | "bank-reported" |

**Moved to L2:** the INDIE Google Play rating (`LIVE-01`), refreshed on demo day: "4.5 from 8.19 lakh reviews, India listing, as of [date]".

**People:** `data/public/indusind_owners_reference.json` holds the names and titles from IND-D1 §8. Not rendered in V1 (DEC-9). Screens use role names only.

**Held** (`status: held`; renders as a greyed chip, "pending verification"):
- peer deposit sizes and growth;
- vehicle-finance slippage;
- third-party distribution's share of fees;
- total assets and the RoA rupee gap;
- IndusInd's and IDFC First's own rate tables;
- the IRDAI penalty;
- 30 Sep and 31 Dec 2025 deposit balances;
- the ECL date;
- peer conduct penalties;
- AU vehicle-finance books.

**Do-not-show list:** IND-D1, "Do not show". §8 lists the lint rule for each item.

### 2a. Sensitivities

**File:** `data/public/indusind_sensitivities.json`.
Entry schema: `{ "id", "label", "formula", "inputs": [register IDs], "value", "unit", "basis_note", "caveats" }`.

Every card that shows one opens its arithmetic. Footer on every sensitivity: "Not a forecast. Not additive across cards."

| ID | Label | Formula | Value |
|---|---|---|---|
| S01 | 1 bp of cost of deposits, on 30 Jun 2026 deposits of ₹4,14,766 crore | N01 × 0.01% | ≈ ₹41.5 crore a year. Note: ≈ ₹40.7 crore on the Q1 average base; ≈ ₹38 crore excluding current accounts |
| S02 | 10 bp of cost of deposits, same base | N01 × 0.10% | ≈ ₹415 crore a year |
| S03 | Mix shift since March at the June deposit base | N01 × (D06 − D05) | ≈ ₹7,500 crore moved from CASA to term money. As new CASA money instead, restoring 31.2% needs ≈ ₹10,900 crore ((0.3124 × N01 − D01) ÷ 0.6876) |
| S04 | Annual interest cost of that mix, pre-tax, approximate | S03 × (D09 − N11) at the low end; S03 × (D09 − D10) at the high end | ≈ ₹170–275 crore a year. Low end: the lost CASA was all savings (7.0% − 4.72% = 2.3 pp). High end: the lost CASA was in today's CA:SA mix (7.0% − 3.4% = 3.6 pp). Q1 average costs applied to 30 Jun balances |
| S05 | 10 bp of credit cost on vehicle finance, on 30 Jun 2026 book | N21 × 0.10% | ≈ ₹100 crore a year |
| S06 | 10 bp of credit cost on micro loans, same date | N16 × 0.10% | ≈ ₹16 crore a year |
| S07 | 1 bp of credit cost on total loans, on 30 Jun 2026 loans | N25 × 0.01% | ≈ ₹32.6 crore a year |

S08 (app deposit flow) is cut from V1.

**Before any screen shows S03 or S04,** add the derivation to IND-D1 v1.1 as an arithmetic row.

---

## 3. Peers

**Peer set** (`config/indusind.yaml`, key `peers`):

| Tier | Banks | On screen |
|---|---|---|
| Core | Federal, Yes, IDFC First | The peer column on every card |
| Upper benchmark | Kotak Mahindra | Only as "upper benchmark", greyed |
| Specialist | RBL; AU Small Finance; Bandhan | Product-specific only: RBL for savings and FD rates; AU and Bandhan for vehicle and micro loans, once verified |
| Excluded | HDFC Bank, ICICI, Axis, SBI | Never. The lint fails the build |

**Display-ready peer cells:** P01–P17 only. All other peer metrics are held.

**Honesty rule for rates:**
- On retail savings below ₹10 lakh, Federal and Yes pay less than IndusInd's headline. Never imply core peers out-pay IndusInd on retail savings.
- Show a peer savings rate only beside IndusInd's own rate for the same band. That needs the manual read (§4).

---

## 4. Rate captures (L2)

**Core: start today, 5 banks.**
- **Banks:** IndusInd, Federal, Yes, RBL, IDFC First.
- **Pages:** each bank's own savings and FD rate pages, daily at 09:00 IST.
- **Capture method:** full-page screenshot via Playwright (preinstalled), then manual transcription into `data/raw/indusind/rate_snapshots.csv`. Columns:
  - `bank`, `page_url`, `captured_at`, `effective_date_on_page`;
  - `product`, `tenor_from`, `tenor_to`, `slab_from`, `slab_to`;
  - `customer_type`, `rate`, `screenshot_path`.
- **Manual first read (owner: Ranjith or Usha):** IndusInd and IDFC First rate pages are script-drawn. Read them in a browser and record the tables with their printed effective dates. Until then IndusInd shows only the page headlines ("up to 7%" FD, "up to 4%" savings).

**Events emitted:**

| Event | Fields | Use |
|---|---|---|
| `card_effective_date` | bank, product, effective date on page, headline rates | Available from the first capture. Copy: "Federal FD card effective 29 Sep 2026: 1-year 6.25%; peak 6.70% at 48 months." It is not a change |
| `rate_change` | bank, product, band, old, new, effective date | Only when two captures differ |

**Fallback copy, if no change is captured before the demo:** "No peer rate card changed this week (5 banks checked daily since [date])". This doubles as a quiet item.

**Demo week:** check the RBI MPC outcome. A repo move triggers card changes.

**Stretch:** automated parsers; Kotak, AU and Bandhan.

---

## 5. Adverts, press and regulator (L2)

| Feed | Source | Method | Use |
|---|---|---|---|
| Digital ads | Google Ads Transparency Center; Meta Ad Library | **Manual only:** 10 hand-picked creatives for IndusInd and the core peers (advertiser, dates, product, offer) | Evidence an offer was visible. Never spend or impressions |
| Print | — | **Dropped for V1** (e-papers are behind logins and the page images are copyright) | — |
| Press | Headlines and links from public news sites | Through the social pull's news source, or RSS | Peer moves; context |
| Regulator | rbi.org.in press-release and notification pages (HTML pages fetch; rbidocs PDFs often hit a CAPTCHA) | On event | Risk page, enforcement |
| Rating | CRISIL, ICRA, India Ratings rationales | On event | Improving strip |

---

## 6. Internal layer (L3)

**Generator:** `scripts/seed_indusind.py`, writing to `data/seed/indusind_v1/`. Fixed seed.

**Core datasets:**

| Dataset | Grain | Fields | Reconcile |
|---|---|---|---|
| `deposits_weekly` | week × `product` (CA, SA, TD) × `customer_type` (resident retail, NRI, bulk/institutional) × `sa_slab` (SA only: <₹1 lakh, ₹1–25 lakh, ₹25 lakh–₹5 crore, >₹5 crore) × `region` (N, S, E, W, Central) × `branch_type` (metro, urban, semi-urban, rural). All dimensions mutually exclusive | `week_ending`, `balance_cr` (only to 30 Jun 2026), `inflow_index`, `outflow_index` (all weeks; Q1 average = 100), `new_accounts`, `closures`, `premature_td_withdrawals_index` | CA, SA and TD period-end totals at 31 Mar and 30 Jun 2026 equal N03–N06 and D03–D04. Absolute balances start at 31 Mar 2026; earlier weeks are index only. The resident/NRI/bulk split is invented: say so, and never reconcile it to N13 |
| `complaints_weekly` | week × product × category (RBI complaint grounds) × channel × region | `received`, `closed`, `pending`, `over_30_days`, `rejected`, `reopened`, `referred_to_io`, `escalation_language` | Scale illustrative; categories follow RBI grounds. No on-screen weekly total that implies an annual rate |
| `cards_internal` | week × category × channel | counts only | Counts scale to an illustrative card base, stated as such. The money line is N18 only. No customer-level rows |
| `actions` | action | `action_id`, `card_id`, `owner_role`, `scope`, `ask`, `cost_cap_cr` (nullable), `success_measure`, `review_date`, `status` (draft, awaiting approval, approved, returned), `approver_role`, `approved_at`, `evidence_version` | One per card |

**Stretch datasets:** `cases_weekly`, `rate_book` exceptions, `app_releases`, `vf_region_monthly`, `micro_state_monthly`.

**Generation rules:**
1. Totals reconcile across screens (`check_reconcile`); the same metric shows the same value everywhere.
2. No reused values across unrelated metrics, and no round numbers everywhere. Show the weekly rhythm and month-end effects.
3. **No causal story encoded.** Generate slab, region and branch-type outflows from a neutral distribution. The demo shows where the bank's data would show the split; the data must not "confirm" a peer-rate hypothesis.
4. **No personal data of any kind.** No names, masked IDs or account numbers: the first join is aggregate by design.
5. **No HDFC strings.** Do not copy HDFC seed segment or product names. The lint covers this (§8).

---

## 7. Social pull (L2)
Same collectors and schema as HDFC B3a, plus the fields below.

**Window:** 1 Jul 2026 to the day before the first preview, pulled daily, frozen at 18:00 IST the day before.

**Sources:**

| Source | Status | Notes |
|---|---|---|
| Google Play | Core | INDIE `com.indusind.indie`; the core peers' main retail apps. Keep `appVersion`, `replyContent` and `repliedAt` |
| Apple App Store | Core | INDIE listing (confirm the app ID before the run); core peers |
| Indus Appstore | Core | INDIE |
| YouTube | Core | Official API, comments only |
| consumercomplaints.in | Core | Public pages only; respect robots.txt and terms; redaction mandatory |
| Reddit | Core only through the official API under its terms; otherwise out | Confirm the subreddit names |
| X | Core only if a named paid API tier is in place; otherwise out | Do not scrape |
| Trustpilot, LinkedIn, Google Maps, TechnoFino, anything behind a login | **Out** | Terms |

**Query sets:**
- **IndusInd:** "IndusInd", "Indusind Bank", "INDIE app", "IndusInd credit card", "IndusInd FD", "IndusInd savings", "IndusDelite".
- **Micro loans:** "Bharat Financial", "BFIL" and the Hindi spellings.
- **Vehicle finance:** "IndusInd vehicle loan", "IndusInd tractor loan", "IndusInd recovery agent".
- **Core peers, on deposit topics only:** bank name plus "FD rate", "savings rate", "interest rate", "special FD", "account closed" or "charges".
- **Languages:** Hindi and English in core; others are stretch.

**Ingest steps (before storage):**
1. **Redact:**
   - Indian mobile numbers `\b[6-9]\d{9}\b`;
   - any 12–19-digit number;
   - email addresses;
   - PAN `\b[A-Z]{5}\d{4}[A-Z]\b`.
2. **Hash author handles.**
3. **Keep the original text** (redacted), plus `english_gloss`.

**Fields added to B3a:**

| Field | Values |
|---|---|
| `bank` | indusind, federal, yes, idfc_first, kotak, rbl, au, bandhan |
| `language` | ISO code |
| `product` | deposits_savings, fd_rd, nri, cards, vehicle_loans, micro_loans_rural, personal_loans, home_loans, app_digital, other |
| `topic_tags` | rate_offer, fee_change, insurance_investment_sales, escalation_language, closure_intent, trust_governance, recovery_conduct_allegation, mis_selling_allegation, fraud_impersonation (customers targeted), service_delay, app_failure |
| `peer_mentioned` | peer banks named in an IndusInd item |
| `reach` | only what the platform returns; null otherwise. Followers are never reach |
| `responded` | true or false, from the bank's reply |
| `on_topic` | false for jobs, stock chatter (`topic=investor`) and homonyms |

**Product to home-row mapping** (`config/indusind.yaml`):
- Deposits = deposits_savings + fd_rd + nri.
- Vehicle finance = vehicle_loans.
- Micro loans and rural = micro_loans_rural (money line N16 only).
- Cards = cards.
- Personal loans = personal_loans.
- Digital = app_digital.
- home_loans has no home-page row in V1. Show it in the Improving strip via N20 only.

**Exclusions on the default home and Cards pages:**
- `trust_governance` and `topic=investor` items are excluded from the top theme, examples and negative share.
- They stay in the data but appear on no V1 screen (the trust watch is out of V1, DEC-2).
- QA check: no home or Cards paraphrase mentions SFIO, SEBI, derivatives, fraud at the bank, or former management.

**Allegation labels on screen:** "Posts alleging mis-selling or bundling (public, unverified)" and "Posts alleging recovery-agent conduct (public, unverified)". Never "cases" or "complaints".

**Quality checks before use:**
- Hand-verify 100 random items for product and topic accuracy, and report the result.
- Hand-verify every home-page top theme and paraphrase.
- Report sentiment-label accuracy on a 100-item sample before showing any negative share.
- No single source above 60% of a product's count without a footnote.
- Series that start mid-window are plotted as shares, not raw counts.

---

## 8. Lint (extends HDFC `scripts/lint_terms.py`)
Runs on `/indusind-v1/*` routes, `data/public/`, `data/seed/indusind_v1/` and the Ask LisN answer bank. Each rule fails the build.

| # | Pattern | Covers |
|---|---|---|
| 1 | `microfinance` within 40 characters of `31,417`; and `31,417` anywhere in the home or Micro loans rows | IND-D1 do-not-show 1 |
| 2 | `\b(HDFC|ICICI|Axis|SBI)\b` in any peer column or table | Wrong peers |
| 3 | `closest peer` within 80 characters of any bank name | Do-not-show 2 |
| 4 | `6,200 crore` or `6200 crore` | Do-not-show 3 |
| 5 | `IDFC` within 80 characters of `5.96%`, unless the same cell says "cost of funds" | Do-not-show 4 |
| 6 | `RBL` with `29.21%` | Do-not-show 5 |
| 7 | `1,22,331`, `122331`, `25,616` or `25616` | Do-not-show 6 |
| 8 | Any IndusInd slab or FD rate (`2.50%`, `3.00%`, `4.00%`, `5.00%`, `7.05%`, or an FD tenor rate) on an IndusInd row, until `manual_read_logged: true` in config | Do-not-show 7 |
| 9 | IDFC First rate-card values | Do-not-show 8 |
| 10 | `Yes` with `7.00%` on a savings row | Do-not-show 9 |
| 11 | `5.68%` next to "cost of funds"; `5.25%` next to "Federal" | Fact-pack errors |
| 12 | `4.7` within 40 characters of `INDIE`; `8.11 lakh` | Wrong rating |
| 13 | `24 Dec` within 80 characters of `SFIO` | Do-not-show 11 |
| 14 | `14 Nov 2026` or `14 May 2027`; any DPDP date with a day | Do-not-show 12 |
| 15 | `quarterly root-cause` | Do-not-show 13 |
| 16 | `Bhasin`, `Pankaj Sharma` or `Ejaz Nazeer` | Do-not-show 15 |
| 17 | `Q2 FY27`, `H1 FY27`, or any L3 balance, ratio or share dated after 2026-06-30 | Q2 guard |
| 18 | Any number on a screen that is not bound to a register, L2 or L3 ID | Provenance |
| 19 | Any sensitivity without `formula` and `inputs` | Rupee rules |
| 20 | `Imperia`, `Regalia`, `Infinia`, `Millennia`, `Diners`, `PayZapp`, `SmartBuy`, `MyCards`, `Vidya`, `Anjani`, `Shashi`, `Neev` | HDFC leakage |
| 21 | Every term in `scripts/lint_local_terms.txt`, an untracked, gitignored file that Ranjith fills locally with names and phrases from discovery calls. Also `champion` and `KNOW` | Licence |
| 22 | `\brun-off\b`, `\brun on\b`, `real-time`, `sentiment score`, `net sentiment`, `\bchurn\b` | Tone |
| 23 | `\bfraud\b` within 60 characters of "IndusInd" or "the bank" (allow-list: "Fraud and impersonation (customers targeted)") | Tone |
| 24 | `\b(replace|replaces|instead of)\b` within 40 characters of MIS, BI, CRM or "data team" | Boundary |
| 25 | `\bsaving\b`, or `savings? (of|on) ₹`, in sensitivity or penalty tiles | "Saving" misuse |
| 26 | `LiSN` or `Lisn` | Brand spelling (use LisN) |

---

## 9. Routing map (owners are roles)

| Card | Owner role | With |
|---|---|---|
| A · Savings balances | Retail liabilities head (role) | CFO and ALCO |
| B · Cost of deposits | CFO (ALCO) | Head, Consumer Banking |
| C · Vehicle finance | Head, Vehicle Finance | CRO |
| D · Conduct rules | Chief Compliance Officer | Consumer Banking (distribution); Internal Ombudsman informed |
| E · Micro loans | Head, Micro Loans and Rural | CRO; Chief Compliance Officer |
| G · App release | Head of Digital Banking (role) | CIO; customer service |
| Complaint register integrity | Principal Nodal Officer | Chief Compliance Officer; Internal Ombudsman informed |

**Rule:** the Internal Ombudsman is independent and reports to the Customer Service Committee of the Board. It is never an owner.

---

## 10. Who does what

| Item | Owner | When |
|---|---|---|
| Social pull to §7 (sources, fields, redaction) | Dev | Now |
| Rate screenshots, 5 banks, daily | Dev | Start today |
| Manual read of the IndusInd and IDFC First rate pages | Ranjith or Usha | Before the Peer screen |
| Watch for the Q2 provisional business update | Dev or Usha | Daily from now |
| Register, sensitivities, owners files | Claude Code | First commit |
| Seed, core datasets | Claude Code | After the register |
| 10 ad captures | Dev | This week |
| IND-D1 v1.1 (S03 and S04 rows; peer conduct penalties; AU VF; Q2 update) | Claude (chat) | Before the first preview |
