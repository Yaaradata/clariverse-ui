# IND-B4 · LisN IndusInd demo V1: build brief, screens and UX
Version 1.2 · 2 October 2026 · **Internal to YaaraLabs. Safe to commit to the private build repo. Never send to the bank.**

**Inherits:**
- IND-B2 (language, copy rules);
- IND-B3 (data, register, lint);
- IND-D1 (verified figures);
- from HDFC: B4 build rules and the HDFC V3 screens (`HDFC Demo V3-Execview`, `HDFC Demo V3-BusinessHead`).

Where they conflict: this brief wins on screens, IND-B3 on data, IND-D1 on numbers.

v1.1 applied an independent review. That review added the Q2 guard, corrected figures and framing, the Improving strip, a locked Ask LisN, hosting rules, a reduced core scope, and screen IDs that do not collide.

v1.2 applies Ranjith's decisions of 2 Oct 2026:
- the customer pulse leads the home page;
- the views are CEO's office and Head of CX, plus Cards;
- the trust watch is out.

**Scope:** smaller and deeper than HDFC. Five core screens and one mock, about 5 days for two people plus Claude Code. Stretch only after core passes QA.

## 0. What V1 must prove, in one sentence
LisN gives the CEO's office and the Head of CX one customer pulse, from bank level down to product. It shows what customers say inside the bank and in public, and what they are doing with their money. It then picks out the four items that need a decision this week. Each is sized on the book or tied to a dated obligation, with a true peer, an owner and a drafted action awaiting approval. The same engine drops to one business head's altitude: Cards.

## 0a. Design basis
- **Decisions of 2 Oct 2026** (log in IND-B2 §8):
  - The customer pulse, inside and outside, leads the home page.
  - The views are "CEO's office" and "Head of CX", plus one business view (Cards).
  - The trust watch is out of V1, and the MD's 150 bp estimate is not used.
  - There is no demo date yet. Build now for the first preview.
- **Research** (four engines, merged 1 Oct; verified 2 Oct):
  - Every pulse row carries its money line. The four items lead with deposit and lending economics, with a peer column inside every card.
  - Never show a single blended sentiment score. Keep risk and compliance to one card.
  - Home picks: savings (3 engines), vehicle finance (3), cost of deposits (2), the conduct rules of 1 Jan 2027 (2).
- **Discovery input** is held separately and is not in this repo.

---

## 1. Screen plan

| ID | Screen | Built from HDFC V3 | Priority |
|---|---|---|---|
| S-HOME | **Customer pulse** (home; view toggle CEO's office · Head of CX; business filter) | E1 exec page: header, customer pulse (inside and outside), Ombudsman watch, pulse by business, morning brief, footer, Ask. Plus new: the quarter line, four signal tiles, Improving strip, peer strip, horizon | **Core** |
| S-DEP | **Deposits** (deep dive) | Product-module template | **Core** |
| S-PEER | **Peer and market moves** | New | **Core** (reduced) |
| S-RISK | **Conduct and complaints horizon** | Ombudsman-watch component plus table patterns | **Core** |
| S-CARDS | **Cards: business view** | HDFC Cards business view, rebuilt on the IndusInd taxonomy and data | **Core** |
| S-APPR | **Approvals** (mock) | Replaces HDFC A1 email triage | **Core (mock)** |
| S-VF | Vehicle finance | Module template | Stretch |
| S-MICRO | Micro loans and rural | Module template | Stretch |
| S-APP | App release watch | HDFC digital module | Stretch |

### Code
- **Copy, don't refactor.** Copy the components you need from the HDFC V3 routes into `/indusind-v1/`, and inject `config/indusind.yaml`. Do not touch the HDFC routes.
- **Remove for IndusInd:**
  - priority relationships;
  - the customer signal trail;
  - MD-marked mail;
  - email triage;
  - the deliverables-ledger page;
  - the save list (customer-level).
- **Leakage:** no HDFC strings or seed data on IndusInd routes (IND-B3 lint 20).

### Hosting and brand
- **Access:** behind authentication, with `noindex`.
- **Watermark on every screen:** "Demonstration · public data plus illustrative internal data · not IndusInd Bank MIS".
- **Brand:** the IndusInd name appears as header text only. No IndusInd logo, brand colours or INDIE app screenshots.

### Visual system
The HDFC V3 LisN system: dials, tables, pills, spacing, phone legibility.

---

## 2. S-HOME, top to bottom

### 1. Header
- **Title line:** "IndusInd Bank · Customer pulse" · date and time · data freeze time.
- **View toggle:** CEO's office · Head of CX.
- **Window selector:** This week · Last 4 weeks · Last 13 weeks. There is no "quarter to date".
- **Business filter:** All · Deposits · Vehicle finance · Micro loans and rural · Cards · Digital.
- **Ask LisN** (§9.7).
- **The quarter line,** one thin line under the header and not a block: "Q1 FY27 (annualised): RoA 0.78% reported · 0.63% excluding one-offs · management target: exit FY27 at about 1%".
  - Two chips: "1 bp cost of deposits ≈ ₹41.5 crore a year" (S01) and "1 bp credit cost ≈ ₹32.6 crore a year" (S07). Each opens its basis.
  - No rupee gap to target.

### 2. Customer pulse: the meter
This follows the HDFC exec layout: inside the bank and outside, side by side. **The two sides are never added together, and there is no single blended score.**

| Side | Layer | Shows |
|---|---|---|
| **Inside the bank** | L3, illustrative | Contacts and complaints by channel (branch, contact centre, email, web, app, social inbox): received · closed · open · waiting on customer · open too long. Also escalated to a grievance desk, and referred to the Internal Ombudsman |
| **Outside** | L2, live | Public items by source · share of negative voice · escalation language (items naming RBI, the Ombudsman or a court) · responded (from the bank's replies) |
| **What customers are doing** | L1 + L3 | Savings balances at 30 Jun (L1), weekly outflow index and closures (L3), app FD and RD bookings (N42, bank-reported). This is the "doing" half of the join |

**Under it, the Ombudsman watch:** the HDFC component (on the brink · eligible · unhappy with the reply · awaiting IO review), with IndusInd L3 data.

**Caption:** "Public voice skews to people who post. Counts, not incidence. Inside figures illustrative until discovery."

### 3. Pulse by business
The meter, drilled from bank to product. One row per business:
- Deposits
- Vehicle finance
- Micro loans and rural
- Cards
- Personal loans
- Digital
- Wholesale (greyed, "next")

| Column | Content |
|---|---|
| Inside | Contacts or complaints, open, open too long (L3) |
| Outside | Public items, negative share with trend (shown only after the sentiment-accuracy check, IND-B3 §7), escalation language |
| Top theme | Theme, with a one-line paraphrase and date (hand-verified) |
| Money line | e.g. "Savings ₹87,440 crore, −2.7% QoQ, −4.0% YoY" (L1) |
| Open | The module (S-DEP, S-CARDS, stretch modules, or a generic product page) |

**Never on this table:** a total score, a word cloud, a mention-count headline, or a governance theme (see the IND-B3 §7 exclusions).

### 4. Needs you this week
Four tiles in a 2×2 grid (§3, Cards A–D). This is the morning-brief block: the items in the pulse that need a decision.
- **Each tile shows:** headline · two or three figures · chips (peer, voice, rupee or exposure, owner, status).
- **Click** opens the card drawer. **"Open"** goes to the module.
- **Conditional cards E and G** replace a tile only when their trigger fires.
- **Never more than four tiles.**

### 5. Improving
Two or three verified items, in this order of preference:
1. "Cost of deposits 6.44% → 5.95% year on year" (N10, N08).
2. "Retail deposits (LCR, quarterly average) 49.5% of deposits, the highest share yet (management)" (N14).
3. "Home loans ₹6,889 crore, +38% year on year" (N20).
4. "Wholesale ₹1,20,227 crore, +11% in the quarter" (N26).
5. "CRISIL outlook to Stable, 19 Aug 2026" (N40).

### 6. Peer moves this week
Three to five items, drawn from:
- `rate_change` events;
- `card_effective_date` events (example: "Federal FD card effective 29 Sep 2026: 1-year 6.25%; peak 6.70% at 48 months");
- ad captures;
- press.

If nothing changed: "No peer rate card changed this week (5 banks checked daily since [date])". Links to S-PEER.

### 7. Horizon
Dated items with live countdowns (N35–N39):
- Governance Amendment, in force from 1 Oct 2026;
- DPDP Consent Manager rules, November 2026;
- Conduct Second Amendment, 1 Jan 2027, with days to go;
- IO quarterly complaint-pattern analysis, next quarter-end;
- DPDP main obligations, May 2027.

Links to S-RISK.

### 8. Checked and within range
One item, taken only from a computed check that passed. Examples:
- "Play reviews since the app update listed on 18 Sep 2026: within the 12-week range";
- the "no peer rate change" line.

### 9. Footer
IND-B2 §4 rule 9 text, plus the freeze time.

### CEO's office vs Head of CX
Both views use the same blocks.

| View | Pulse | Tiles and evidence | Extras |
|---|---|---|---|
| **CEO's office** | Pulse summary | The four tiles; evidence collapsed | "Copy to pack" (card text with sources) |
| **Head of CX** | Pulse expanded by channel, Ombudsman watch open | Evidence open by default | An "Owners and status" table (item, owner role, action, status, age) |

**Owners are roles throughout. No personal names on screen.**

---

## 3. Signal cards

### Card drawer anatomy
Every card follows this order:
1. **What moved**, with dates.
2. **Peer context.** A fixed column for Federal, Yes and IDFC First; held cells show a greyed "pending verification" chip.
3. **What customers and the market said** (L2), dated, with reach where returned.
4. **Rupee line or exposure statement.** Arithmetic on click. "Not a forecast; not additive."
5. **Owner**, as a role.
6. **Drafted action**, structured: scope, ask, cost cap (if any), success measure, review date.
7. **Approval state** and approver role.
8. **Evidence:** sources, dates, layer tags.

### Card A · Savings balances fell while term deposits carried the growth (home)
- **What moved:**
  - Savings ₹87,440 crore: −2.7% in the quarter, −4.0% year on year (N04, D08).
  - CASA ratio 31.2% → 29.4%, Mar to Jun 2026 (D06, D05).
  - Deposits +3.7% in the quarter, with the growth in term money (D07, D03, D04).
- **Peers:** "CASA, 30 Jun 2026: IDFC First 50.8% (up from 49.8%) · Yes 32.7% (down from 35.1%) · Federal 32.23% (up 188 bp year on year)" (P04–P08).
- **Voice (L2):** deposits items tagged fee_change, closure_intent, app_failure and rate_offer; switching talk (`peer_mentioned`).
  - A reported savings-charge revision from October is unverified. **Do not show it** until the tariff is checked.
- **Inside (L3):** "Illustrative: where the outflow sits by slab, region and branch type. Your data shows the real split." No peer-rate attribution.
- **Rupee line:** "Since March, about ₹7,500 crore of the mix moved from CASA to term money. At today's spreads that mix costs about ₹170–275 crore a year more, pre-tax (approximate)." Source: S03, S04, with both spreads on click.
- **Owner:** Retail liabilities head (role), with the CFO and ALCO.
- **Drafted action:**
  1. Cut savings outflows over the last 90 days by slab, region and branch type.
  2. Set them beside peer rate-card changes and switching talk in the same weeks.
  3. Bring a targeted retention option for the two largest outflow clusters, with a cost cap, to the next ALCO.

  **Approver:** Head, Consumer Banking.

### Card B · Cost of deposits against true peers (home)
- **What moved:** IndusInd 6.44% → 6.07% → 5.95% (Q1 FY26, Q4 FY26, Q1 FY27) (N10, N09, N08).
- **Peers:**
  - "Cost of deposits, Q1 FY27, each bank's own disclosure: Federal 5.21% · Yes 5.4% · IndusInd 5.95%" (P01, P02, N08).
  - IDFC First appears on its own line as cost of funds, 5.96% (P03).
  - N15 is not used in V1 (DEC-3).
- **Voice (L2):** peer rate offers (`rate_offer`), with ad captures.
- **Rupee line:** "1 bp ≈ ₹41.5 crore a year; 10 bp ≈ ₹415 crore, on 30 Jun 2026 deposits" (S01, S02). No other sizing.
- **Owner:** CFO (ALCO), with the Head, Consumer Banking.
- **Drafted action:** a monthly decomposition of the gap to Federal and Yes into three parts:
  - mix (CASA, retail share);
  - term pricing by bucket;
  - bulk reliance.

  Set one quarterly target, with an owner for each part.

### Card C · Vehicle finance: Q1 disbursements ₹10,832 crore, 4% below a year ago. Demand, service or credit? (home)
- **What moved:**
  - Disbursements ₹11,298 crore → ₹10,832 crore year on year (N24, N22). They are 14% below the seasonal March quarter (N23, D11), shown in the drawer only.
  - Book ₹99,718 crore, +3% year on year, 31% of loans (N21).
- **Peers:** greyed "pending verification" (AU vehicle books are held).
- **Voice (L2):** vehicle-loan items tagged service_delay, fee_change and recovery_conduct_allegation, labelled "Posts alleging recovery-agent conduct (public, unverified)". Hindi items appear with a gloss.
- **Inside (L3, stretch dataset; in core use region-level illustrative):** application-to-disbursement time and dealer drop-offs by region.
- **Rupee line:** "10 bp of credit cost on the book ≈ ₹100 crore a year" (S05).
- **Owner:** Head, Vehicle Finance, with the CRO.
- **Drafted action:** in the two regions where disbursement delay and conduct complaints move together, review the hand-offs and the conduct-complaint log within 14 days, before any sourcing change.

### Card D · Conduct rules from 1 January 2027: [n] days. Which journeys carry the exposure? (home; the one risk card)
- **What moved:** N36 (full refund plus compensation where mis-selling is established; compulsory bundling barred; explicit consent).
- **Peers:** greyed "pending verification" (peer conduct penalties are held).
- **Voice (L2):** "Posts alleging mis-selling or bundling (public, unverified)", by product. Also items tagged insurance_investment_sales.
- **Inside (L3):** complaints in distribution-related RBI grounds by product; an illustrative readiness checklist.
- **Exposure statement:** "Supervisory and refund exposure; not quantified from public data."
- **Owner:** Chief Compliance Officer, with Consumer Banking (distribution). Internal Ombudsman informed.
- **Drafted action:** a 60-day readiness check for the CSCB, with an owner for each gap, covering:
  - 12 months of complaints about insurance or investment sales;
  - app and web journeys with pre-ticked or bundled consent;
  - incentive lines tied to third-party products.

### Conditional cards
These are off in the default demo and replace a tile only on trigger. Card F (trust watch) is out of V1 (DEC-2).

| Card | Content | Rupee line | Owner |
|---|---|---|---|
| **E · Micro loans** | Book ₹16,305 crore, with its label (N16). Conduct complaints by state against collection movement (L3). Hindi voice | 10 bp ≈ ₹16 crore a year (S06) | Head, Micro Loans and Rural, with the CRO and Chief Compliance Officer |
| **G · App release** | Play rating (LIVE-01, dated). Login, device-binding and KYC themes by app version (L2) | — | Head of Digital Banking (role) |

---

## 4. S-DEP · Deposits
1. **What.**
   - Absolute CA, SA and TD balances at 31 Mar and 30 Jun 2026, shown as verified dots (N03–N06, D03, D04), with the CASA ratio at the same two dates.
   - **Jul–Sep:** indexed inflow and outflow only (L3, Q1 average = 100). There is no line beyond 30 Jun.
2. **Is it real.** Compared against the indexed baseline, month-end and salary-week effects, stated in words.
3. **Where (L3, illustrative).** A heatmap of slab × region × branch type, with the top three clusters, labelled "Your data shows the real split".
4. **Why, from outside.** For the same weeks:
   - peer card dates and changes;
   - ad captures;
   - deposit-voice themes;
   - switching talk.
5. **How high.** S03 and S04, with both spreads; S01.
6. **Owner and action.** Card A's action, the approval gate and the audit line.
7. **Evidence.** Sources, dates and layer tags.

**Sub-tab "Cost of deposits":** P01–P03 and N08–N10; an illustrative decomposition (L3); IndusInd rate table only once `manual_read_logged`.

**Sub-tab "Retail franchise":** N13 and N14, labelled quarterly average; premature withdrawals and new money (L3, indexed).

---

## 5. S-PEER · Peer and market moves (core, reduced)
1. **Peer table.** P01–P09, with tier labels. Everything else is greyed "pending verification". Kotak only as "upper benchmark".
2. **Card effective dates and changes.** One row per bank, read from the rate captures. The left edge says "Capture began [date]".
3. **Rates side by side.** Only P10–P17 and IndusInd's own rate for the same band, once read. Never imply that core peers out-pay IndusInd on retail savings.
4. **Ads.** The 10 captured creatives, each with advertiser, date, product and offer.
5. **Press and ratings.** A dated list, including N40.

**Stretch:** peer voice on deposit topics; rate gap by band across all slabs.

**Never:** a league table of all banks, or HDFC, ICICI or Axis.

---

## 6. S-RISK · Conduct and complaints horizon
1. **Calendar.** N35–N39 with countdowns.
2. **Card D in full.** Readiness checklist (illustrative status), distribution-ground complaints (L3) and allegation-labelled public posts (L2).
3. **Complaint register.**
   - N31 and N32, with the classification-break footnote.
   - Weekly internal complaints (L3): received, closed, pending, over 30 days, rejected, reopened, referred to the IO.
   - **"What the IO's quarterly complaint-pattern analysis would cover this quarter":** product, category, customer group and geography (L3).
   - Owner: Principal Nodal Officer, with the Chief Compliance Officer. IO informed.
4. **Ombudsman exposure.** Reuse the HDFC watch component with IndusInd L3 data. Its states are on the brink · eligible · unhappy with the reply · awaiting IO review.
5. **Penalties.**
   - "Both RBI penalties cite the Interest Rate on Deposits Directions (20 Dec 2024 and 14 Aug 2026)" (N33, N34).
   - Suggested: one review of deposit-rate controls, owned by the Chief Compliance Officer.
   - No judgement on past management.
6. **Public escalation language.** Items naming the RBI, the Ombudsman or a court, by product (L2).

---

## 7. S-CARDS · Cards: business view
**This is the one business-owner view in V1 (DEC-10).**
- **Header:** "The same engine, at a business head's altitude."
- **Sub-line:** "Cards: the business with the most public customer voice this quarter", but only if the L2 data supports it. Otherwise use "Business view: Cards".

**Layout:** the HDFC Cards business view, rebuilt.
- Issue pulse: internal (L3) and public (L2) side by side.
- Ombudsman watch for Cards (L3).
- **"Accounts at risk of closure: n, by category"** (aggregate). This replaces the save list.
- Issues by category, with each category assigned to an owner role.
- Voice.
- Timelines.

**Categories:**
- rewards and redemption;
- lounge and benefits;
- fees and charges;
- limits;
- disputes and refunds;
- fraud and impersonation (customers targeted);
- applications and verification;
- activation;
- closure;
- app and card servicing;
- EMI and payments;
- co-brand partners.

**Rules:**
- **Money line:** N18 only.
- **Constructive tone:** include "Where customers praise us" if L2 has at least 15 such items.
- **Reconciles to the Cards row on S-HOME.**

**Stretch:** an approval-health tile (L3).

---

## 8. S-APPR · Approvals (mock)
- **One list of drafted actions across cards,** using the `actions` fields (IND-B3 §6).
- **Approve and Return change status locally only.** The audit line records who, when and which evidence version.
- **Banner:** "LisN recommends; people approve. Nothing is sent or executed."

---

## 9. Method rules (all screens)
1. Every number is bound to a register, L2 or L3 ID (IND-B3 lint 18).
2. Rupee figures show their arithmetic, their base and "not additive".
3. **Q2 guard.** No balance, ratio or share after 30 Jun 2026. Re-anchor when the Q2 update lands (IND-B3 §1).
4. Series that start mid-window are shown as shares.
5. Hindi items are shown in the original with a gloss.
6. Owners are roles. No customer is identifiable. Public text is paraphrased.
7. **Ask LisN, in demo mode, answers only from a pre-computed answer bank** bound to register, L2 and L3 IDs.
   - Free text matches the nearest of these five questions, or a "show me" chip:
     - "Where did savings go this quarter?"
     - "What changed in peer rate cards this week?" (only if a change or card date exists)
     - "Which products carry conduct-rule exposure?"
     - "Vehicle finance by region"
     - "What changed since Monday?"
   - Otherwise it answers: "I'd need your data for that. Here is what I'd look at."
   - **No model-generated numbers.**

---

## 10. QA before the first preview
1. A script checks every on-screen number against the register. Labels and bases must match IND-D1.
2. The IND-B3 §8 lint passes, all 26 rules.
3. **Reconciliation:**
   - business row = module;
   - Cards row = S-CARDS;
   - L3 totals = register at 31 Mar and 30 Jun.
4. **Depth test per home card.** Each card has:
   - a rupee line on the book, or an explicit exposure statement;
   - a true peer, or a greyed "pending verification" chip;
   - what customers said;
   - an owner and a drafted action;
   - something the MD could not get from his pack within the week.
5. Exactly four tiles. One computed quiet item. An Improving strip with verified items only.
6. No home or Cards text mentions SFIO, SEBI, derivatives, fraud at the bank, or former management.
7. Screenshots at 1440 px and on a phone, with no large blank gaps. The watermark appears on every screen.
8. An independent review in a fresh session against IND-B2 and this brief, saved to `qa/independent_review_indusind_v1.md`.

---

## 11. Tracks and owners

| Track | Items | Owner | Output |
|---|---|---|---|
| **T1 Decisions** | Decided 2 Oct 2026 (IND-B2 §8). Open: the first-preview date, which sets the data freeze | **Ranjith** | `MORNING_DECISIONS.md` |
| **T2 Data** | Register, sensitivities, owners file; core seed; social ingest with new fields and redaction; rate screenshots | **Claude Code** (files, seed, ingest); **dev** (pull, captures) | `data/public/*`, `data/seed/indusind_v1/`, `data/raw/indusind/*` |
| **T3 Screens** | Core: S-HOME, S-DEP, S-PEER (reduced), S-RISK, S-CARDS, S-APPR mock. Stretch: S-VF, S-MICRO, S-APP | **Claude Code** (components, binding); **dev** (visual polish) | `/indusind-v1/*`, screenshots |
| **T4 Manual** | IndusInd and IDFC First rate reads; 10 ad captures; watch for the Q2 update | **Ranjith or Usha**; dev | `rate_snapshots.csv`, `ads/` |
| **T5 Verification** | IND-D1 v1.1: S03 and S04 rows; two peer conduct penalties; AU VF definitions; the Q2 update when out | **Claude (chat)** | IND-D1 v1.1 |
| **T6 Review** | §10.8 | **Fresh CC session** | `qa/independent_review_indusind_v1.md` |

**Order:**
1. T1 and T4 today.
2. T2 starts with the register, then the seed and ingest.
3. T3 starts once the schemas are fixed.
4. T5 runs in parallel.
5. T6 runs last.

### Claude Code kickoff prompt (T2 + T3)
> Read `docs/indusind/IND-B4_Build_Brief_Screens_and_UX.md`, `IND-B3_Data_Requirements.md`, `IND-B2_Messaging_and_Positioning.md` and `IND-D1_Track_A_Verification.md`. Work in this order:
>
> 1. Copy the needed HDFC V3 components into `/indusind-v1/`, driven by `config/indusind.yaml`. Do not modify HDFC routes.
> 2. Build `data/public/indusind_register.json`, `indusind_sensitivities.json` and `indusind_owners_reference.json` exactly as IND-B3 §2 specifies. Use one figure per entry, with the IND-D1 wording, labels and bases.
> 3. Generate `data/seed/indusind_v1/` (core datasets, IND-B3 §6). Pass `check_reconcile`. No balance after 30 Jun 2026.
> 4. Extend `scripts/lint_terms.py` with all 26 rules in IND-B3 §8.
> 5. Build the core screens in order: S-HOME, S-DEP, S-PEER, S-RISK, S-CARDS, then the S-APPR mock.
>
> Bind every number to an ID; hard-coded figures are not allowed. Ask LisN must use the pre-computed answer bank only (§9.7). Build stretch screens only after QA passes (§10). Log every judgement call in `MORNING_DECISIONS.md`. Commit and push after each screen.
