# 02 · Requirements, Pain & Applied Value — KGS Commercial Fire demo

**For:** Ranjit BK · **From:** Exec Persona & Value Strategist · **v1.1 · 28 Sep 2026** (pack review: aligned to 04/05a/mock and the lead's decisions)
**Read first:** `01_Persona_Exec_Brief.md` (who Kartik is, glossary, tone rules).
**Primary source:** `out/Messaging_Positioning_Demo_Inputs.md` §10 (hero spec, tiles, dataset). Where this file adds a number, it is derived from §10.6 and shown with its method in §2.

## 0. Conventions

- **IDs.** `R-EX-n` overview, `R-Q1-n` / `R-Q2-n` / `R-Q3-n` drill-downs, `R-FSM-n` Field Signal Monitor, `R-SC-n` Safety & Cyber watch, `HS-n` hero stories, `AV-n` value-ledger tiles, `V-nn` value calculations. Priorities follow CONTEXT: **P0** overview, Q1 and hero deep-dive · **P1** Q2, Q3 · **P2** extras.
- **Pain point** is written in persona voice (Kartik's likely words). It is **not a quote**; never display it in quotes on screen.
- **"Today"** is an **industry pattern**, never a claim about KGS.
- Every money or count figure is **synthetic** and carries `[illustrative]` here. On screen:
  - it shows a small grey "illustrative" tag, or sits inside a panel labelled **"Synthetic scenario"**;
  - every $ or £ value has a method tooltip (text from §2).
- Numbers must match §2 exactly. **Do not recompute or round differently** in components; import them from one `values.ts`.
- Currency: **$** for NA signals, **£** for UK-EU. Never add $ and £ together.

---

## 1. Messaging anchors (exact strings)

| Slot | Exact string |
|---|---|
| Category name (header subtitle / tab title) | **"Installed-base early warning"** |
| Descriptor (About popover, login splash) | "The early-warning layer that joins what installers, partners and distributors say to firmware, batch, RMA and order data." |
| One-line promise (overview header, under the page title) | **"Hear it at the third call, not the monthly review."** |
| Page title (overview) | "Global Commercial Fire — Signals this week" |
| Persistent badge (top-right, every page, never hidden) | **"SYNTHETIC SCENARIO — illustrative data, not KGS data"** |
| Fixed footer (every page) | **"Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved."** |
| Insight box label (replaces "Conversation AI") | "LiSN insight" |
| Monitor strip title (replaces "AI Risk Spike Monitor") | "Field Signal Monitor" · subtitle "Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner." |
| Recommendation box label | "LiSN suggests · owner decides" |
| Summary wall label (replaces "AI Summary Wall") | "LiSN Signal Wall" |
| "Diagnosis" box label (replaces "AI Dispute Diagnosis") | "LiSN evidence summary" with rows **"Main signal" / "What changed" / "Decide first"** (lead decision; title and row labels as in the mock data) |
| Floating ✨ button tooltip | "Ask LiSN (P2 — canned answers)" |

**Value statements** (on screen; use 3 or 4). Place them in the "How we count" drawer header and the About popover, or rotate them in the empty-state panel:
1. "Each platform, release, date code and partner measured against its own baseline — special cause, not volume."
2. "Every signal joined to firmware, batch, RMA and orders, and routed to the executive who owns it."
3. "Every number opens to the calls, cases and RMAs behind it."
4. "LiSN drafts; your owners approve. Read-only, in your cloud."

---

## 2. Value register: the single source of truth for every derived figure

All `[illustrative]`, built on the §10.6 synthetic dataset. **Unit-cost assumptions (synthetic; Ranjith to confirm before the call):**
- tier-1 contact $25–60 (dossier C.1 panel range);
- fully loaded field cost per excess fault contact **$750**, made up of truck roll $450, Tier-3 escalation $150 and NFF return share $150;
- detector field replacement **$120** per unit (device plus labour).

| ID | Figure shown | Method (tooltip text) |
|---|---|---|
| V-01 | Hero exposure to date **≈ $12k** | Excess contacts = observed 23 − expected on the 4.0 rate (2.0 × 1.24k panels × 3 wks = 7.4) ≈ 16 × $750 fully loaded field cost. |
| V-02 | Hero projected **≈ $0.15m** over 12 weeks if the rollout continues unchanged | Panel-weeks at risk = 1,240 × 12 + 5,560 eligible × 6 (uniform upgrade over 12 wks) = 48,240 × excess rate 4.2 per 1,000 = ~203 excess contacts × $750. |
| V-03 | Hero contacts avoidable **~140** (≈ $0.1m field cost) **if** the owner pauses the rollout at week 3 | The 5,560 not-yet-upgraded panels' share of V-02: 33,360 panel-weeks × 4.2 per 1,000 ≈ 140 × $750. Decision sits with VP Engineering. |
| V-04 | Hero lead **21 days** | Next scheduled monthly RMA review (7 Oct) − threshold crossing (16 Sep). |
| V-05 | Date-code field exposure **up to $0.35m**; **1,900 units containable** | Installed units in window = 4,800 − 1,900 in distributor stock = 2,900 × $120. Containable = units still in stock at 11 distributors. |
| V-06 | Partner sell-in in view **$6.4m**; sell-in gap **≈ $1.4m / yr if −22% persists**; backlog **$0.9m** | Trailing-12-month sell-in of ESD-SE-07 × 22% decline vs the same weeks last year. |
| V-07 | Backlog at risk **$2.3m** (2.4% of ~$95m open backlog); **4 projects** with inspections ≤30 days | Sum of open value on the 312 N-3 lines pushed ≥3 weeks ÷ total open backlog. |
| V-08 | Invoices in dispute **£1.1m / 212**; DSO **+6 days ≈ £1.0m cash** tied up | 6 ÷ 365 × £60m annual sell-in of the top-10 UK-EU distributors. |
| V-09 | Cutover excess contacts **~48 / week** (≈ $1.2k–2.9k handling per week); **~290 avoidable** over 6 weeks if fixed | Pre-cutover baseline 30/wk × (2.7 − 1.1 control change) = 48/wk × 6 wks. |
| V-10 | Contacts avoidable, total **~430** (**$11k–26k** handling cost) | V-03 (140) + V-09 (290) × $25–60. Handling cost only. Field cost is shown separately. |
| V-11 | Median lead vs scheduled review **21 days** (5 signals) | Per signal, next scheduled review for the owner's metric − threshold-crossing date: hero 16 Sep→7 Oct (21) · date code 18 Sep→7 Oct (19) · partner 11 Sep→15 Oct QBR (34) · backorder 22 Sep→5 Oct OTIF report (13) · cutover 10 Sep→5 Oct DSO report (25). Median = 21. |
| V-12 | Look-alikes suppressed **212** | Quarter-end / seasonal 74 · how-to after launch (adoption, not fault) 58 · planned test or drill language 41 · same-site recontacts and duplicates 27 · credit hold, routed to AR 12. |
| V-13 | Governed watch time to owner: W-2 **7 min**; W-1 chronology moved **19 weeks earlier** | W-2: first mention 09:14 UTC → routed 09:21 UTC, 25 Sep. W-1: back-search on 23 Sep found an email coded "commissioning" 19 weeks before the 6 Sep mention. Quality decides its significance. |
| V-14 | Scale anchors ("How we count" drawer) | ~1,800 interactions / working day · ~9,000 this week · 233,900 in 26 weeks · 18,500 EST4 panels (hero cohort = 6.7%) · ~9,100 RMAs in 26 weeks · ~$95m open backlog · ~3,500 partner accounts. |

**Never on screen:** Commercial Fire revenue, the "1–2% warranty" estimate, "$10–20m", "one day of revenue", savings, ROI or payback. See §11.

---

## 3. Exec overview (P0)

### 3.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-EX-1 | What crossed a line this week, and who owns it? | Monthly operating-review pack; RMA dashboards; escalations arrive one by one. | Executive Brief line, Executive Pulse (3 cards) and funnel strip: 233,900 read → 1,640 clusters → 212 suppressed → **5 above threshold** → 2 governed. | Ranks the few that matter, names one owner per signal, shows gate state. | Each signal's owner | all |
| R-EX-2 | Is the aggregate hiding something? | Aggregate KPIs green; cohorts invisible. | Each question card puts the **signal count next to the aggregate that looks fine** (e.g. "EST4 RMA rate 0.28% · in control" beside "2 signals above threshold"). | Makes special cause visible without a new dashboard. | — | Q-1, Q-2 |
| R-EX-3 | Is this noise? Can I trust it? | Alert lists with no confidence. | Funnel "212 suppressed" with hover reasons (V-12). K/I confidence and S-class on every card. | Recall broad, rank severe; shows its own discipline. | — | Q-17 |
| R-EX-4 | What is it worth, and what happens if we wait? | Value arrives as a month-end variance. | **Applied value** ledger (§4). | Exposure and lead time by P&L line; no savings claims. | CFO (implicitly) | all |
| R-EX-5 | Can I forward this without creating a problem? | Screenshots travel without context. | Badge, footer, **Anonymise** toggle; exports default to anonymised. | Safe to forward to the second-call personas. | — | — |

### 3.2 Applied value per requirement

| ID | P&L metric protected | Illustrative figure | Method | Proof the screen must show |
|---|---|---|---|---|
| R-EX-1 | Executive attention / time-to-recognition | 5 of 1,640 clusters (0.3%); median lead 21 days | V-11, V-12 | Funnel with counts; owner chip and gate chip on each Pulse item |
| R-EX-2 | Warranty cost, backlog conversion, DSO | See Q1–Q3 | — | Aggregate metric and its control limit shown **beside** the signal count |
| R-EX-3 | Cost of false alarms (investigation time) | 212 suppressed | V-12 | Hover list of suppression reasons |
| R-EX-4 | All lines, separated | See §4 | V-01…V-11 | "How we count" drawer |
| R-EX-5 | Reputation / legal risk | n/a | — | Anonymise toggle works on every label; watermark on export |

### 3.3 Executive Brief (one line; A is used in 04 and the mock)
- **A:** "Five signals above threshold — installed base 2, channel 2, separation 1. All five are with named owners; none has been actioned without approval."
- **B:** "A firmware release is drifting from its predecessor at week three while the EST4 RMA rate is in control; one partner, one backlog family and one cutover also await an owner's decision."

### 3.4 Executive Pulse (three numbered cards; two variants each)

| Card | Variant A | Variant B |
|---|---|---|
| **1. What's critical** | "EST4 fw 4.1 (synthetic): 'devices not found after upgrade' at 3.1× panels still on 4.0 — 9 partners, 3 regions, 1,240 panels. Draft brief awaiting VP Engineering." | "One firmware release is drifting from 4.0 at week three, 21 days before the monthly RMA review. The aggregate is green; the cohort is not." |
| **2. Where's your focus** | "UK-EU remit-to and invoice contacts 2.7× since the 1 Sep entity cutover (control 1.1×): £1.1m in dispute, DSO +6 days at top-10 distributors." | "Strategic Partner ESD-SE-07 (synthetic): friction 3.1× its own baseline for six weeks while EST4 sell-in is −22% and two certifications have lapsed." |
| **3. What's stable** | "3 of 4 cutovers clean against control. Nuisance-alarm contacts within own baseline for every detector family. 212 look-alikes suppressed." | "45 of 46 firmware cohorts and 419 of 420 NA Strategic Partners within their own baselines; NA portal, APAC order management and EDI cutovers show no distributor friction." |

Each Pulse card also shows a small chip row: **S-class · owner · gate state**, e.g. `S2 · Quality` · `VP Engineering` · `Awaiting approval`.

### 3.5 The three question cards

The titles are fixed. The big number is the **count of signals above threshold**, not a composite score. A 0–100 "health index" would be fake precision; don't build one. Beside the number sits a **week-on-week delta chip** ("0 vs last week" / "+1 vs last week"; last week = digest of 18 Sep 18:00 UTC), with "+n in 4 weeks" as a micro line under it (04 §2.5).

| Field | Q1 | Q2 | Q3 |
|---|---|---|---|
| Title | "Is our installed base healthy?" | "Are we holding our channel?" | "Is the separation costing us?" |
| Sub-caption | "Firmware releases · Date-code windows · RMA · Field failures" | "Strategic Partners · Backorder consequence · Certification · Competitor language" | "Entity · Portal · ERP · EDI cutovers against a control region" |
| Big number · label · delta | **2** · "signals above threshold" · "0 vs last week" · "+2 in 4 weeks" | **2** · "signals above threshold" · "+1 vs last week" · "+2 in 4 weeks" | **1** · "signal above threshold" · "0 vs last week" · "+1 in 4 weeks" |
| Gauge 1 | "Firmware cohorts in control" 98% (45 of 46) | "NA Strategic Partners within own baseline" 99.8% (419 of 420) | "Cutovers clean vs control" 75% (3 of 4) |
| Gauge 2 | "EST4 RMA rate vs control limit" 0.28% of 0.35%, labelled **"in control"** | "N-3 OTD vs original promise" 71%, sub-label "94% vs revised" | "UK-EU distributors affected" 8% (14 of 180) |
| Trend (26 wks) | Contacts per 1,000 panel-weeks, fw 4.1 vs 4.0, release marker 2 Sep | ESD-SE-07 friction vs sell-in (dual axis) | Remit-to/entity contacts per week, UK-EU vs control, cutover markers |
| Mini KPI 1 | "TOP SIGNAL · fw 4.1 (synthetic) · 3.1×" | "DRIFTING PARTNER · ESD-SE-07 · 3.1×" | "IN DISPUTE · £1.1m · 212 invoices" |
| Mini KPI 2 | "PANELS EXPOSED · 1,240 · +5,560 eligible" | "BACKLOG AT RISK · $2.3m · 312 lines" | "DSO, TOP-10 UK-EU · +6 days" |
| Border | Orange, 2px, highlighted (holds the hero) | Teal | Sky blue (sky-400) |

**LiSN insight box: two variants per card**

| Card | Variant A | Variant B |
|---|---|---|
| Q1 | "Panels on fw 4.1 report 'devices not found after upgrade' at 6.2 per 1,000 panel-weeks vs 2.0 on 4.0 — 23 contacts from 9 unrelated partners since 4 Sep. Five installers have rolled back to 4.0. The EST4 RMA rate is still inside its control limit." | "Two cohorts are moving under a green aggregate: fw 4.1 (3.1× vs 4.0) and detector family D-2, date codes 2611–2614 (4.2× adjacent weeks). 1,900 D-2 units are still in distributor stock and containable." |
| Q2 | "ESD-SE-07 friction has run 3.1× its own baseline for six weeks; recontact 38% vs 14%; a competitor named in 4 calls. EST4 sell-in is −22% while territory peers are +4%." | "Notification family N-3: OTD is 94% against revised promise dates but 71% against the original. Cancel/substitute language 3.2× across 11 NA partners; 4 projects face inspections within 30 days." |
| Q3 | "Since UK-EU invoicing moved to the new KGS entity on 1 Sep, remit-to and entity contacts are 2.7× pre-cutover against 1.1× in the control regions. Top cluster: 'invoice entity doesn't match our PO entity'." | "The technical cutover completed on 1 Sep; since then 14 distributors are disputing 212 invoices (£1.1m) and portal-login contacts are 3.4×. The other three cutovers are clean against control." |

---

## 4. "Applied value" panel: spec for the exec screen (P0)

**Purpose:** a small, honest ledger that answers "what is this worth?" in the CFO's language without claiming savings.
**Placement:** a full-width slim strip between the three question cards and the Field Signal Monitor, about 120px high, with 5 tiles plus an optional 6th. It reuses the KPI-tile component from the banking drill-downs.
**Header:** "Applied value · this week" · chip **"Synthetic scenario"** · right-aligned link **"How we count"**, which opens a drawer listing V-01…V-14 with the methods from §2 and the value statements from §1.
**Footnote under the strip (exact):** "Lead time is measured against the review calendar, not against when your teams would otherwise have known. Discovery tests that blind."

| Tile | Label | Value (mono) | Sub-line | Method tooltip | Click |
|---|---|---|---|---|---|
| AV-1 | "Ahead of the review cycle" | "21 days" | "median lead vs next scheduled review · 5 signals" | V-11 | Opens a list of the 5 signals with crossing date, review date and lead |
| AV-2 | "Signals routed" | "5 → 5 owners" | "+ 2 governed watch items (restricted)" | Count of signals above threshold, each with exactly one owner | Scrolls to the Field Signal Monitor |
| AV-3 | "Decisions pending" | "5 awaiting owners" | "7 drafts · 0 sent · 0 automatic actions" | Gate-state count | Opens a decision queue (read-only in President view) |
| AV-4 | "Exposure in view" `illustrative` | three stacked lines: "Warranty & field ≤ $0.5m" · "Backlog at risk $2.3m" · "Invoices in dispute £1.1m" | "exposure, not savings · not summed" | V-02 + V-05; V-07; V-08 | Opens the "How we count" drawer at those rows |
| AV-5 | "Contacts avoidable" `illustrative` | "~430" | "$11k–26k handling cost · if owners approve" | V-10 | Same drawer |
| AV-6 (optional) | "Look-alikes suppressed" | "212" | "seasonal · how-to after launch · planned tests · credit holds" | V-12 | Same hover as the funnel |

**Rules**
- Never total AV-4 into one number. It mixes warranty exposure, backlog and cash, and it mixes $ and £.
- Every tile says "illustrative" or sits under the "Synthetic scenario" chip. No tile shows revenue, savings, ROI or payback.
- "How we count" must show the V-14 scale anchors, so the ledger visibly ties to Commercial Fire's scale through **volumes**, not revenue.
- Small numbers are fine and intended. The hero's caption says "Small because it is week three."

---

## 5. Q1 · "Is our installed base healthy?" (P0)

Suggested reuse of banking drill-down components:
- KPI tiles: "Signals above threshold 2" · "Firmware cohorts in control 45 / 46" · "EST4 RMA rate 0.28% · in control" · "Firmware recorded on EST4 trouble cases 38%".
- 12-week cohort monitor (line chart, fw 4.1 vs 4.0).
- **LiSN signal wall** (hero pinned first).
- Date-code heat strip with the detail side panel.
- Evidence readiness.
- "What's stable".
- A v2 teaser.

### 5.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-Q1-1 **Hero** | "I hear about a bad release when warranty cost moves, weeks after installers first described it." | RMA trend and warranty accrual reviewed monthly; reason codes rarely carry firmware; aggregate RMA rate in control. | fw 4.1 vs 4.0 **lineage river** with release marker, 16 Sep crossing, 7 Oct review marker and a flat grey aggregate. Severity strip, K/I confidence, chips (new phrasing, workaround, attribution), counter-evidence, evidence drawer, gate. | Joins contact language to per-panel firmware and the installed-base denominator; drafts the investigation brief and an agent known-issue note; candidate configuration, not cause. | **VP Engineering** (owner); cc VP Service & Tech Support; President sees it because S2 and blast radius exceed threshold | Q-1 (+Q-14, Q-15, Q-10) |
| R-Q1-2 | "The return rate is fine, so why are distributors calling about one detector?" | SKU-level p-chart green by construction; RMA Pareto ranks volume. | Date-code **heat strip** (2611–2614 lit) beside the green SKU p-chart (0.21% vs 0.30% limit); stock-by-distributor table. | Re-indexes contacts and RMAs to manufacturing time; drafts a containment memo with pre-filled 8D D1–D3. | **Director Product Quality**; cc VP Engineering | Q-2 |
| R-Q1-3 | "Can we even make this join on our data?" | Unknown until someone tries. | **Evidence readiness** tile: "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57%." Label: "Discovery measures this first — on your data." | Makes the data question a test, not an assertion; explains how K vs I is set. | Quality; VP Service; CIO | Q-17 |
| R-Q1-4 | "Show me what's fine too." | Green KPIs with no cohort detail. | "What's stable": 45 / 46 firmware cohorts in control; nuisance-alarm contacts within own baseline per detector family; "Edge how-to cluster after training release — adoption, not fault (suppressed)". | Builds trust by showing what it did **not** escalate. | — | Q-6 (descriptive only) |
| R-Q1-5 (P2) | "Where's the growth in my installed base?" | Migration opportunities appear once sales notices them. | Locked teaser tile: "Grow the installed base — EST3→EST4 migration intent (v2)". Sub-line: "Tell us if you want this next." | Seeds v2 feedback question 9. | — | C-9 (v2) |

### 5.2 Applied value per requirement

| ID | P&L metric | Illustrative figure | Method | Proof the screen must show |
|---|---|---|---|---|
| R-Q1-1 | **Warranty & field cost** (secondary: tech-support cost-to-serve) | To date ≈ $12k · projected ≈ $0.15m / 12 wks · ~140 contacts avoidable if paused at week 3 · 21 days ahead of review | V-01…V-04 | Rate with denominator (6.2 vs 2.0 per 1,000 panel-weeks), 23 source interactions, K 15 / I 8, counter-evidence (412 panels / 180 sites on 4.1 without symptom), caption "Small because it is week three." |
| R-Q1-2 | **Warranty & containment cost** | Up to $0.35m field replacement; 1,900 units (40%) containable; 19 days ahead of review | V-05, V-11 | 22 serial-verified (K) + 9 date codes read from photos (I); 14 share one component lot; SKU p-chart visibly green |
| R-Q1-3 | Containment precision (narrower scope, lower field cost) | n/a: capability, not money | — | Field-by-channel matrix; "Discovery measures this first" |
| R-Q1-4 | Investigation cost avoided (no false escalations) | 212 suppressed across all domains | V-12 | Suppression reasons |
| R-Q1-5 | Aftermarket / lifecycle mix | none shown in v1 | — | Locked state only; no numbers |

---

## 6. Hero double-click: EST4 fw 4.1 (synthetic) (P0)

### 6.1 The chain in one table

| Step | What it is | On screen |
|---|---|---|
| **Pain** | Field problems reach the President when they reach warranty cost; a monthly review would catch this on 7 Oct at the earliest. | Pulse "What's critical"; Q1 card with green RMA gauge beside "2 signals" |
| **Insight** | Panels on fw 4.1 report "devices not found after upgrade" at **6.2 vs 2.0** per 1,000 panel-weeks (**3.1×**), 9 unrelated partners, 3 regions; crossed on **16 Sep** at the third independent partner; the EST4 aggregate is flat. | Lineage river; headline; severity strip |
| **Evidence** | 23 interactions (calls, cases, email, RMA, after-hours); 2 NFF RMAs; 5 rollbacks; K 15 / I 8; source independence 0.78; counter-evidence. | "Evidence · 23" drawer; chips; counter-evidence line |
| **Decision** | VP Engineering decides on reproduction, and on whether to pause the staged 4.1 rollout. The President can ask but not approve. | Gate panel: "Draft investigation brief — awaiting VP Engineering approval" |
| **Value** | Warranty & field cost ≈ $12k to date, ≈ $0.15m projected over 12 weeks if unchanged; ~140 excess contacts avoidable if paused; 21 days ahead of the scheduled review. | P&L line with "How we count" |

### 6.2 User stories and acceptance criteria

**HS-1 · See it from the overview**
*As President, when I open the overview, I see the hero named in "What's critical", in the Q1 insight box and as the first Field Signal Monitor card, so that within 10 seconds I know the top signal, its owner and that it is waiting for a decision.*
- Pulse card 1, Q1 insight and FSM card 1 use the exact strings in §3.4, §3.5 and §9.2.
- Clicking Pulse card 1 or FSM card 1 opens the hero deep-dive (`/signals/A1`). Clicking the Q1 card chevron opens the Q1 drill-down.
- The owner chip "VP Engineering" and the gate chip "Awaiting approval" are visible on all three.

**HS-2 · See the contradiction before the detail**
*As President, when I click the Q1 card, I see "Signals above threshold 2" next to "EST4 RMA rate 0.28% · in control", with fw 4.1 pinned first on the LiSN signal wall, so that I see the aggregate and the cohort disagree before I click further.*
- KPI tiles in the order in §5.
- Hero card first on the wall, marked "#1 of 5".
- "Open signal →" on the hero opens the deep-dive.

**HS-3 · Judge special cause myself**
*As President, when I open the hero deep-dive, I see the lineage river with the release, the crossing and the next review marked, so that I can judge special cause against noise in my own terms.*
- Headline, exact: "EST4 · firmware 4.1 (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on 4.0; 9 partners, 3 regions; 1,240 panels on version".
- Metric line, exact: "6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 · same 3 weeks · event-time aligned to each panel's upgrade · Poisson exact p<0.001".
- The river shows two ribbons (4.0 and 4.1) over 26 weeks and denominator shading (panels on each version).
- Markers, exact: "2 Sep · fw 4.1 released (synthetic)" · "16 Sep · threshold crossed — third independent partner" · "7 Oct · next monthly RMA review".
- A grey flat line, labelled "EST4 RMA rate — in control".
- Hover on any week shows week, rate, contacts and panels on version.

**HS-4 · See severity and confidence rendered, not coded**
*As President, when I read the signal, I see class, type, blast radius, incident flag and confidence as text, so that I know how serious and how sure it is without asking.*
- Severity strip, exact: "S2 · Quality · Cliff (step at release) · Blast radius 1,240 panels · ~610 sites · 9 partners · 3 regions (US-SE, US-SW, Canada) · 5,560 eligible panels not yet upgraded · Incident flag: Off — no fire event, injury or dispatch mentioned".
- Rule line: "Any S1 phrase in this cohort routes to Quality immediately."
- Confidence, exact: "M 0.70 · K 15 cases with firmware in record · I 8 imputed from ship date and download logs · Source independence 0.78 (9 partners, 4 channels)".
- Colour is never the only carrier: the S2 chip reads "S2".

**HS-5 · See what doesn't fit**
*As President, when I scan the chips and counter-evidence, I see LiSN arguing against itself, so that I trust it isn't overclaiming.*
- Chips, exact: "New phrasing — first seen 4 Sep" · "Workaround spreading: 'rolled back to 4.0' in 5 cases" · "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)".
- Counter-evidence, expandable, exact: "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause".

**HS-6 · Open the calls behind the number**
*As President, when I click "Evidence · 23", I see the source interactions with dates, channels and K/I tags, so that every number is one click from what installers actually said.*
- A 520px right drawer with four tabs: **"Snippets 23" · "Linked RMAs 2" · "Cohort" · "Method & audit"** (04 §4.10).
- Snippets: the 5 verbatims from §10.4 of the source, each with channel, region, date, synthetic partner ID and a K/I tag.
- Linked RMAs tab: "RMA-S-2609-0142 (NFF)", "RMA-S-2609-0177 (NFF)".
- Cohort: "1,240 panels on fw 4.1 · serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic)". The export button is disabled, with tooltip "Export disabled in demo".
- Method & audit: detector, baseline window ("26 weeks, prior version, event-time aligned"), K vs I per case, and a viewed-by log that includes "President · just now".

**HS-7 · Know why it's ranked first**
*As President, when I click "Why ranked here?", I see the ranking factors with values, so that the order isn't a black box.*
- Popover rows: Severity S2 · Rate ratio 3.1× · Panels on version 1,240 (+5,560 eligible) · Source independence 0.78 · Est. field cost ≈ $0.15m projected `illustrative`.

**HS-8 · See that it waits for the owner**
*As President, when I look at the decision panel, I see the drafts and who must approve them, so that I know nothing happens without the owner.*
- Title "Decision". State chip, exact: **"Draft investigation brief — awaiting VP Engineering approval"**.
- Second line: "Draft known-issue note for tech-support agents — not sent".
- Recommended action, exact: "Owner to decide: engineering reproduction on the candidate configuration, and whether to pause the staged rollout and download of 4.1."
- "View draft" opens a read-only brief with these sections: Summary · Cohort · Excerpts · Configurations · Candidate causes (ranked) · Counter-evidence.
- **Approve** is disabled in President view, with tooltip "Approval sits with VP Engineering".
- The President's available action is "Ask VP Engineering for a decision". It adds the chip "Decision requested by President" and an audit line. It sends nothing outside the demo.

**HS-9 · Watch the loop close (approval transition, P0)**
*As VP Engineering (using the "Viewing as" switch on the decision panel), when I click "Approve investigation", the state changes and is logged, so that the President sees how a decision is recorded and that LiSN keeps watching.*
- A local segmented control on the decision panel only: "Viewing as: President | VP Engineering". The full role switcher is P2.
- After approval:
  - State chip becomes "Investigation approved by VP Engineering · reproduction on candidate configuration".
  - "Rollout decision: pending — VP Engineering" stays open. LiSN never decides it.
  - Known-issue note becomes "Awaiting VP Service & Tech Support approval — not sent".
  - Audit log prepends "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)", where {ts} is the live click time ("DD Mon HH:MM UTC"), captured once and shown identically on the gate, the audit log and the toast (04 §4.9).
  - New line: "LiSN keeps watching: the 4.1 rate is re-measured daily against 4.0."
- No "sent" or "notified" wording anywhere. Page reload resets the demo state.

**HS-10 · Read the value in proportion**
*As President, when I read the P&L line, I see small, method-backed figures, so that I can judge proportion without a sales pitch.*
- Text, exact: "P&L: Warranty & field cost · secondary: tech-support cost-to-serve".
- Figures: "To date ≈ $12k · projected ≈ $0.15m over 12 weeks if the rollout continues unchanged" with an `illustrative` tag.
- Caption, exact: "Small because it is week three."
- Two sub-tiles: "~140 excess contacts avoidable if the rollout is paused at week 3 — decision sits with VP Engineering" and "21 days ahead of the scheduled monthly RMA review".
- Each figure's tooltip shows its V-01…V-04 method.

**HS-11 · Forward it safely**
*As President, when I switch Anonymise on, every name becomes neutral, so that I can forward a screenshot without implying a KGS defect.*
- Anonymise is OFF by default in the live, narrated session (badge and footer always visible).
- Swaps (04 §7.1 / 05a §3.2): EST4 → "Panel platform A", fw 4.1 → "fw A.4.1", Edwards → "Brand A", ESD-SE-07 → "Partner P-07" (each partner has its own label), US-SE → "Region NA-1", Florida → "State 1" and so on.
- Any print or export action forces anonymise ON, with a diagonal "Synthetic scenario — not KGS data" watermark.
- The named mode cannot be exported.

---

## 7. Q2 · "Are we holding our channel?" (P1)

Suggested components:
- KPI tiles: "Signals above threshold 2" · "NA Strategic Partners within own baseline 419 / 420" · "N-3 OTD vs original 71% (94% vs revised)" · "Certified-technician lapses, drifting partner 2 of 5".
- Partner timeline (friction stream vs sell-in, with evidence pins).
- Backlog-at-risk bars with the **revised / original promise toggle**.
- "Strain & friction" table by partner tier.

### 7.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-Q2-1 | "Partner risk shows up at the lost bid." | QBRs, RSM inboxes, quarter-close orders. | ESD-SE-07 **friction vs sell-in** timeline: 40 interactions vs 13 baseline over 6 weeks (3.1×); recontact 38% vs 14%; sell-in −22% vs same weeks last year (peers +4%); friction led sell-in by ~5 weeks. | Joins friction to sell-in, certification and backlog against the partner's own baseline; drafts a partner-recovery brief. | **Regional GM NA**; cc VP Service | C-1 |
| R-Q2-2 | "Are we losing them on skills or on product?" | Certification tracked separately in the LMS. | Components on the partner card: "2 of 5 EST4-certified technicians lapsed (week 22)" · "a competitor named in 4 calls" (never named) · "2 of its cases sit in the fw 4.1 cohort" (cross-link). | Separates capability, product and competitive causes; links to the hero. | Regional GM NA; Learning Center (cc) | C-1 (C-2, C-13 components) |
| R-Q2-3 | "OTIF says we're fine; partners say they're cancelling." | OTD measured against revised promise dates. | Backlog-at-risk bars for N-3 with consequence-language overlay; **toggle "vs revised / vs original"** flips 94% ↔ 71%. | Ranks backlog by consequence and inspection date; drafts an allocation priority list. | **VP Supply Chain**; cc VP Sales | C-6 |
| R-Q2-4 | "Don't bring me a credit issue dressed up as churn." | Any order dip is read as churn. | "What's stable / suppressed": "One partner's order dip coincides with a credit hold — routed to AR, not scored as drift." 419 / 420 partners within baseline. | Shows discipline and routes the look-alike to its proper owner. | AR (routed) | C-1 distillation |

### 7.2 Applied value per requirement

| ID | P&L metric | Illustrative figure | Method | Proof the screen must show |
|---|---|---|---|---|
| R-Q2-1 | **Partner revenue retention / channel share** | $6.4m sell-in in view; ≈ $1.4m/yr gap if −22% persists; $0.9m backlog; 34 days ahead of QBR | V-06, V-11 | Evidence pins on friction spikes; K (orders, certifications) vs I ("friction leads orders"); gate "Partner-recovery brief — awaiting Regional GM approval · no outreach sent" |
| R-Q2-2 | Channel share; training-spend targeting | 2 lapses; 4 competitor mentions | counts | LMS lapse dates; verbatim pins, competitor name redacted as "[competitor]" |
| R-Q2-3 | **Backlog conversion / OTIF** | $2.3m at risk (2.4% of open backlog); 312 lines; 4 inspection-critical projects; 13 days ahead of OTIF report | V-07, V-11 | Toggle; line counts; gate "Allocation priority list — awaiting Supply Chain approval · no partner messages sent" |
| R-Q2-4 | Avoided mis-intervention | 1 look-alike routed to AR | V-12 | Suppression line |

---

## 8. Q3 · "Is the separation costing us?" (P1)

Suggested components:
- KPI tiles: "Signals above threshold 1" · "Cutovers clean vs control 3 of 4" · "Invoices in dispute £1.1m / 212" · "DSO top-10 UK-EU +6 days".
- **Cutover timeline** (4 vertical markers, topic bands, affected vs control).
- Cutover scorecard table.
- "LiSN evidence summary" box (Main signal / What changed / Decide first). The "Why invoices go into dispute" joined panel above it is the "card-system enhanced" join pattern from the banking demo.

### 8.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-Q3-1 | "The cutover went live; I find out what it broke at month-end DSO." | Programme reports technical status; business effect arrives as escalations; no "carve-out" reason code. | UK-EU entity cutover (1 Sep): remit-to/entity contacts **2.7× vs control 1.1×**; portal login 3.4×; 14 distributors; top cluster "invoice entity doesn't match our PO entity". | Difference-in-differences against a control region; joins contacts to AR disputes; drafts a separation defect ticket and a distributor notice. | **CIO / separation PMO**; CFO (DSO); Regional GM UK-EU | C-3 |
| R-Q3-2 | "Which cutovers were actually clean?" | Each cutover judged on its own. | Scorecard: NA portal 14 Jul · APAC order management 4 Aug · EDI mapping 12 Aug · UK-EU entity 1 Sep; 3 **clean vs control**, 1 flagged. | Validates each cutover by business outcome; a TSA-exit readiness signal. | CIO | C-3 (C-4 v2) |
| R-Q3-3 | "Is this a defect or just an unannounced change?" | Both look like the same spike. | Split bar: "expected, communicated change (FAQ-able)" vs "defect (wrong entity, lost acknowledgement)". | Sends FAQ-able contacts to knowledge fixes and defects to IT. | CIO; VP Service | C-3 distillation |
| R-Q3-4 | "Who approves what goes to distributors?" | Ad hoc. | Gate states: "Separation defect ticket — awaiting CIO triage" · "Distributor notice (corrected remit-to) — awaiting Regional GM UK-EU approval · not sent" · "Dunning pause on disputed invoices — CFO decision". | Every outward step is human-approved. | CIO, CFO, Regional GM UK-EU | C-3 |

### 8.2 Applied value per requirement

| ID | P&L metric | Illustrative figure | Method | Proof the screen must show |
|---|---|---|---|---|
| R-Q3-1 | **DSO / cash conversion** (secondary: cost-to-serve) | £1.1m / 212 invoices in dispute; DSO +6 days ≈ £1.0m cash; ~48 excess contacts/wk; 25 days ahead of month-end DSO report | V-08, V-09, V-11 | Control-region line visible; sample invoices (synthetic) in drawer; K on timing (H) vs I on cause (M); candidate "PO-entity mapping in the EDI layer — engineering to confirm" |
| R-Q3-2 | Separation milestones / TSA exit | 3 of 4 clean | count | Each cutover row shows affected vs control ratio |
| R-Q3-3 | Cost-to-serve | ~290 contacts avoidable over 6 weeks if fixed | V-09 | Split bar with counts |
| R-Q3-4 | Governance | 0 sent | — | Disabled send buttons with owner named |

---

## 9. Field Signal Monitor (P0: strip on the overview)

### 9.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-FSM-1 | "Give me the short list, ranked, not 300 alerts." | Alert queues ranked by volume. | A horizontally scrolling strip of **5 cards**, ranked by severity × rate ratio × population × source independence × est. cost; "#1 of 5" on the first card. | Recall broad, rank severe; one owner per card. | Per card | Q-1, Q-2, C-1, C-6, C-3 |
| R-FSM-2 | "What is it, how big, how sure, who has it?" | Headline without context. | Each card: title · S-class chip + domain · type · channels · top symptom · window · **before → after** metric · blast radius · confidence (K/I) · owner · gate state · P&L tag · "LiSN suggests · owner decides" box. | The whole severity model rendered on every card. | — | — |
| R-FSM-3 | "What did you throw away?" | Unknown. | End-of-strip card: "212 look-alikes suppressed" with the V-12 breakdown. | Transparency on noise. | — | — |
| R-FSM-4 | — | — | Click a card to open its deep-dive (hero = A1). Cards 2–5 open their Q-drill-down panel (P1). | — | — | — |

**Applied value:** executive attention. 5 of 1,640 clusters reach the President (0.3%). Median lead 21 days (V-11, V-12). The screen must show the ranking factors on hover and an owner and gate chip on every card.

### 9.2 Card copy (exact strings; all synthetic)

| # | Title | Chips | Before → after | Blast radius | Confidence | Owner · gate | P&L | "LiSN suggests · owner decides" |
|---|---|---|---|---|---|---|---|---|
| 1 | "EST4 fw 4.1 — devices not found after upgrade" | S2 · Quality · Cliff | "Contacts / 1,000 panel-weeks 2.0 → 6.2 · 3.1×" | "1,240 panels · 9 partners · 3 regions" | "M 0.70 · K 15 / I 8" | "VP Engineering · Awaiting approval" | Warranty & field | "Reproduce on configurations with more than two signalling loops. Owner to decide whether to pause the staged 4.1 rollout." |
| 2 | "Detector family D-2 — early-life failures, date codes 2611–2614" | S2 · Quality · Cliff (serial axis) | "Early-life contacts vs adjacent weeks · 4.2× · SKU return rate 0.21% (limit 0.30%) — in control" | "4,800 units · 1,900 in stock at 11 distributors" | "M 0.65 · K 22 / I 9" | "Director Product Quality · Containment memo awaiting approval" | Warranty & containment | "Sample return and teardown. Quality to decide on quarantine of units still in distributor stock." |
| 3 | "ESD-SE-07 — Strategic Partner drift" | S2 · Channel · Slope | "Interactions, 6 wks 13 → 40 · 3.1× · recontact 14% → 38%" | "$6.4m sell-in · $0.9m backlog" | "H on orders (K) · M on friction→orders (I)" | "Regional GM NA · Recovery brief awaiting approval · no outreach sent" | Partner revenue | "Regional GM visit with a named L3 engineer and two priority EST4 class seats." |
| 4 | "Notification family N-3 — backorder consequence" | S2 · Supply · Slope | "Cancel / substitute language · 3.2× · OTD 94% revised / 71% original" | "$2.3m backlog · 312 lines · 11 partners" | "H on dates (K) · M on cancellation (I)" | "VP Supply Chain · Allocation list awaiting approval" | Backlog conversion | "Review allocation with the 4 inspection-critical projects first." |
| 5 | "UK-EU entity cutover — remit-to and invoice friction" | S2 · Separation · Cliff | "Remit-to contacts vs pre-cutover · 2.7× (control 1.1×) · portal login 3.4×" | "14 distributors · £1.1m in dispute" | "H on timing (K) · M on cause (I)" | "CIO / separation PMO · Defect ticket awaiting triage" | DSO | "Candidate: PO-entity mapping in the EDI layer — engineering to confirm. CFO to decide on a dunning pause." |

The banking cards' imperative recommendations ("Freeze…", "Trigger…") are replaced by owner-addressed suggestions. **No card has an enabled action button.**

---

## 10. Safety & Cyber watch: governed (P0 tile, restricted panel P1)

### 10.1 Requirements: pain → screen

| ID | Pain (persona voice) | Today (industry pattern) | What LiSN shows | How LiSN aids resolution | Routes to | UC |
|---|---|---|---|---|---|---|
| R-SC-1 | "If a safety or cyber report lands in a support call, does the right person know — today?" | PSIRT sees submitted reports only; support codes these contacts as "network / IT issue". | Tile: "2 open watch items (restricted)". Per item: domain · S1 class · corroboration state · routed to · routed at · status · elapsed clock. **No contents, platform names or firmware** in President view. | Timestamps the candidate awareness moment and routes it to the people who decide. | **Quality + CLO** (W-1); **PSIRT + CLO** (W-2) | Q-7, Q-8 |
| R-SC-2 | "Make sure this doesn't create a legal problem." | — | Click opens the restricted panel only: "Access limited to Quality, PSIRT and Legal roles. Routed for human decision. **LiSN does not determine reportability.**" | Role-based access; contents never shown to the President role. | — | Q-7, Q-8 |
| R-SC-3 | "When did we first hear of it?" | Chronology rebuilt by hand after the fact. | W-1 line: "Back-search found an earlier related email (19 weeks before), coded 'commissioning' — chronology updated 23 Sep 10:02. Quality decides significance." | 36-month back-search. The first-mention timestamp is immutable. | Quality + CLO | Q-7 |
| R-SC-4 | "Is the CRA clock running?" | Unclear. | W-2 clock ring: "8h 46m since candidate first mention" with **24h / 72h ticks labelled "reference only — PSIRT determines whether awareness has begun"**. | Makes elapsed time visible without a legal verdict. | PSIRT + CLO | Q-8 |

**Exact item rows**
- **W-1:** "Safety · S1 watch · single source → awaiting corroboration · routed to Quality + CLO · 6 Sep 14:38 UTC · status: under Quality review · confidence L–M 0.35".
- **W-2:** "Cyber · S1 candidate · 4 unrelated sites · candidate first mention 25 Sep 09:14 UTC · not in PSIRT queue at detection · routed to PSIRT + CLO 09:21 UTC · confidence L 0.30".

**Applied value:** time from first mention to owner: 7 minutes (W-2). A chronology that moves 19 weeks earlier (W-1, V-13). **No $ figure** appears on this tile in any role. The P&L line reads "Restricted".

---

## 11. Out of scope / must not show

**Never on screen, in any mode**
- Commercial Fire or KGS revenue; any figure derived from it (1–2% warranty, $10–20m, one day of revenue); savings, ROI or payback; unrounded money; totals across unlike exposures or currencies.
- Named people (roles only, and the President is "President"); Carrier as the current owner; Gloria, suppression, extinguishers, residential products or recalls.
- Competitor names (show "[competitor]"); LiSN customer names or logos; SOC 2 / ISO claims.
- Banking leftovers: FCI, Conversation AI, HSHF, cards, cardholders, chargeback, MCC, merchant, EMI, disputes as a banking queue, hashtags, social reach, sentiment gauges, CSAT/NPS, churn, "customer journey", word clouds, volume league tables.
- Words: resolve(s), root cause (except "Candidate, not cause"), predicts, agentic, auto-report, compliance automation, real-time (unqualified), "300K", "100% of all interactions", cheap, "your data is fragmented".
- External signals: weather, macro, public forums, social media, app-store trends.
- Agent performance or any individual employee metric.
- Reportability verdicts, containment or recall decisions, any enabled send / notify / auto-fix / auto-report action.
- Real KGS data of any kind. Firmware versions, serials, date codes, SKU families and partner IDs **without "(synthetic)"**. Any platform or firmware name inside the Safety & Cyber watch.
- China, MEA or India vertical lenses, ConnectedSafety+ joins, migration numbers (v2; the locked teaser only).

**Out of scope for tomorrow's build**
- Backend, live data, authentication.
- Real exports (export shows a disabled state or an anonymised PNG only).
- The full role switcher (P2); the local "Viewing as" switch on the hero decision panel is P0.
- Ask-LiSN free text (P2 canned answers only).

---

## 12. Open questions (for Ranjith)

Items 1, 3 and 4 were decided by the lead on 28 Sep and are applied across the pack; item 2 remains open (see `00_README_START_HERE.md`).

1. **W-1 timing — decided.** W-1 is routed on first detection, 6 Sep 14:38 UTC; 23 Sep 10:02 is the back-search chronology update (source §10.5 had "routed 23 Sep 10:02", which read as a 17-day delay).
2. **Unit costs — open.** The costs behind V-01…V-10 ($750 fully loaded per excess fault contact; $120 per detector replacement; $25–60 per contact) are synthetic but should look sensible to a service VP. Default: keep as written.
3. **Big number on the question cards — decided.** Count of signals above threshold plus a week-on-week delta; no 0–100 index or score.
4. **Talk-track wording — decided.** "above threshold this week", never "crossed a threshold this week" (the crossing dates run from 10 to 22 Sep).
