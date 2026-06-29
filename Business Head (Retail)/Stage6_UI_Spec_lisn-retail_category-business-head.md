# Stage 6 UI Specification — LiSN (Retail / e-commerce) / Category-Business Head

> Phase 3, stage 3 of 5. Inputs: RunConfig + Stage 3 catalogue + Stage 4 personas (demo spine) + Stage 5 data model (C-/O- codes, signal blocks, card anatomy). Output decides **what screens exist and what each answers** — structure and content only. **No colour / spacing / chart-style here** (governed at 9C). Intent = sales-demo → `SCREEN_COUNT_TARGET 3–5`. Brand rules applied. The seven design rules and layout truths are cited inline as each decision is made.

---

## 1. Screen list

Five screens, matching the demo spine. The storyline builds from the most differentiating beat (the wedge) and peaks at the festival window. Landing = **Category Command Centre** for Priya (Category/Business Head).

| # | Screen | Persona question(s) | Renders (Tier-2) | Storyline role |
|---|---|---|---|---|
| **S1** | **Category Command Centre** (landing) | Q1, Q9, Q10 at a glance; the rail surfaces Q2/Q4/Q5/Q6/Q7 | rail surfaces T2-02, T2-12, T2-19, T2-26, T2-28, T2-07, T2-15, T2-17 | the Monday 5-minute view — "what should I act on this week?" |
| **S2** | **Recoverable-Margin Returns** (drill) | Q1, Q2 | **T2-02** (+ T2-01, T2-03 evidence; T2-05 substrate base) | **Hero 1 — the wedge:** returns are a content/seller problem, ₹ recoverable in the customer's words |
| **S3** | **Seller Trust-Risk Board** (drill) | Q3 | **T2-07** (+ T2-08 causal layer; T2-11 triage) | the seller-quality home surface — ranked by customer-backed GMV exposure, each row an evidence pack |
| **S4** | **Lane RTO Arbitration** (drill) | Q6 | **T2-26** (+ T2-04 fault-split) | **Hero 2 — resolves the org fight:** logistics vs seller, the voice decides |
| **S5** | **Festival Incident Monitor** (drill, real-time tier) | Q7 | **T2-28** (+ T2-15 defect-wave) | **Hero 3 — the peak:** real demand vs payment/bot/fraud failure, with a conservative tier |

**Cuts (stated):** a standalone *Conversion/Funnel* screen — cut for this persona/intent; conversion appears only where it is the consequence of a voice cause (T2-12 on the rail), per rule 1 (no metric without a path to action). A dedicated *Conduct/Compliance* screen — **cut unless governance adds the compliance class** (RunConfig open slot); for now the conduct cards (T2-22…25) are one-click flags off S1's Trust tile, not a screen. A *Promo* screen — folded: T2-19 rides the rail and reuses the S2 drill pattern. T2-12, T2-15, T2-17, T2-19 are **rail Signals that drill via the shared drill-down component** (Stage 7 details the per-Signal signature) — they do not each need a top-level screen, which keeps the count at five and every screen advancing the pitch (sales-demo "cut dead screens").

**Default landing screen:** S1 Category Command Centre.

---

## 2. Widget justification (both directions)

**Keep (component → why it earns its place for this persona):**
- **3 executive tiles** → the persona's top-3 worries, the 5-second headline set (rule 4; layout truth: headline largest, top-left). Mapped below.
- **Executive Brief strip + Executive Pulse strip** (critical / focus / stable) → the 3-question "what's broken / what to watch / what's fine" summary a head reads first (reference build pattern; rule 1).
- **AI Risk Spike Monitor rail** ("Today's Category Signal Monitor", AI-marked) → the 24×7 act-on-these output; the distilled "act on these", distinct from passive metrics (methodology §G rail label; rule 4).
- **AI insight cards** (the rail items) → each a surfaced Signal with its so-what and a draft action (rule 1, rule 2).
- **Evidence feed** (inside drills) → the verbatims + resolved order trail that meet Priya's trust threshold (Stage 4) and double as the compliance artifact.
- **OwnershipBoard with card-type filter bar** → the Seller Trust-Risk Board (S3), the family's board component.
- **Floating AI Day-Generator** → "generate my day" — re-ranks the rail to the act-on-these for the open window (sales-demo wow; reference build pattern).
- **Drill-down screens as separate components** → Layer-2 detail behind any Signal (rule 5: two layers only).

**Remove for this role (each with its reason — removing the wrong-persona widget is first-class):**
- **Agent-level / queue widgets (FCR, AHT, per-agent containment)** — the CX/Contact-Centre control room, not a category P&L view (Stage 4 remove list; rule 6 density).
- **Standalone Sentiment-Drift gauge (no outcome join)** — sentiment appears only joined to conversion/returns/₹ (T2-12); a bare NPS gauge is a vanity tile for her (rule 1).
- **The full 28-card dump** — only today's act-on-these on the primary view; the rest one click away (rule 4).
- **Identity-level customer detail** — she works at cohort/SKU/seller/lane grain; person-level is a boundary violation, not a feature (`DOES_NOT_DO`).
- **Compliance worklists / case management** — she sees the *flag* and routes it; the worklist is the Compliance screen's job.
- **Rename / strip on every card face (rule 7, brand rules):** no "chargeback" (e-commerce term is "return / refund / RTO"); **no internal codes** (T2-##, merge IDs, DENSE/BURSTY/SPARSE labels) — these live in tooltips/back-end, never on a card face; no vendor/engine names; no platform machinery on the face.

---

## 3. Per-screen zone specification

### S1 · Category Command Centre  *(landing; time default: this week vs last week — head cadence, rule 3)*

- **Headline signal (top-left, largest — F-pattern):** **Profitable Growth tile** — *Category contribution after returns & CAC, this week vs last.* **So-what:** not "GMV is ₹X" but "contribution is down ₹Y this week; the single costliest fixable driver is on the rail below." (rule 1; layout truth 5-second headline.)
- **3 executive tiles** (each: score + sparkline + mini gauge + AI callout — component vocabulary):
  1. **Profitable Growth & Margin** — KPI: *category contribution after returns & CAC* (Stage 5 §7: GMV − returns cost − reverse logistics − discounts − payment − blended CAC); sparkline this-week-vs-last. North-star.
  2. **Returns & Recoverable Margin** — KPI: *return/RTO rate* + *recoverable margin* (Stage 5 C-2, C-3, O-2); the wedge tile; drills to S2.
  3. **Seller & Conduct Trust** — KPI: *seller trust-risk count* (C-7, O-4) + *conduct-exposure flag* (T2-22…25 as a sub-flag); drills to S3.
- **Executive Brief strip:** one line each — *critical* (the S1 headline driver), *focus* (the next-worst Signal), *stable* (what's fine, so she doesn't chase it).
- **Executive Pulse strip:** the 3-question critical/focus/stable format across the category.
- **AI Risk Spike Monitor rail** ("Today's Category Signal Monitor" ✦AI) — horizontal-scroll Signal cards, severity-ordered (S1>S2>S3). Surfaces, in storyline order: **T2-02** (recoverable-margin returns), **T2-26** (lane RTO), **T2-28** (festival, when in a sale window), **T2-12** (aspect cliff → conversion), **T2-19** (promo do-not-promote), **T2-07** (top seller-risk row), with **T2-15 / T2-17** as quick-commerce colour. Each card → its drill (S2–S5 or the shared drill component).
- **Floating AI Day-Generator** ✦AI — "Generate my week" re-ranks the rail to the act-on-these for the open window.
- **Explainability line (rule 2, on hover/tap of the headline):** *"Contribution is ₹Y below last week; ~70% of the gap traces to returns on three SKU clusters — the costliest is a fixable sizing error, opened on the rail."*
- **Primary actions:** none fire from S1 except **open** a Signal (drill) and **Generate my week**; S1 is triage, not action (rule 4).
- **Layer-2 drill targets:** Tile 2 → S2; Tile 3 → S3; each rail card → its drill.

### S2 · Recoverable-Margin Returns  *(Hero 1; drill from Tile 2 / rail T2-02; time default: this week vs last)*

- **Headline signal (top-left, largest):** *"₹6.0L recoverable contribution on the Fashion returns spike this week"* `[illustrative]`. **So-what:** the fixable share is a listing/seller error, not buyer-remorse — draft the fix. (rule 1.)
- **Cards / components:**
  - **Recoverable-margin Signal card** — renders **T2-02**; card anatomy §4 below.
  - **Return cause-code breakdown** — renders **T2-01** (O-2): ranked causes (size / quality / fake / damage / delay / wrong-item) with % and the **fixable-vs-intent split** (the GoKwik ~60–70%-intent prior shown explicitly as the trust anchor).
  - **Catalogue auto-correction proposal** — renders **T2-03**: the specific PIM/sizing-chart attribute at fault + a *drafted* remap.
  - **Return/RTO anomaly context** — renders **T2-05** (substrate base): the rate vs its category-relative band, so a structurally-high fashion rate is not mistaken for an anomaly.
  - **Evidence feed** ✦ — the verbatim cluster ("chest narrow vs chart") + the resolved order trail + provenance (O-8).
- **KPIs shown (fields from Stage 5):** return/RTO rate (return, order); recoverable margin (return.fault_class, contribution); reverse-logistics cost (return). All in Priya's vocabulary. ✓
- **Explainability line (rule 2):** *"Returns on this shirt run are 31% vs a 22% band; ~64% is buyer-intent, but 'chest narrow vs chart' verbatims point to a fixable sizing-chart error — ₹6.0L recoverable if corrected."*
- **Primary actions (draft/route phrasing — never autonomous):** **Draft PIM sizing-chart fix** (→ Catalogue/PIM, human approves); **Route fixable share to Seller-Brand**; CX-side default action **Pre-empt the size-guide ticket** (the dual-action ordering; Stage 7).
- **Layer-2 drill target:** per-SKU evidence (the full verbatim set + order trail); this is already Layer 2 — no Layer 3 (rule 5).

### S3 · Seller Trust-Risk Board  *(drill from Tile 3 / rail T2-07; time default: this week vs last)*

- **Headline signal (top-left, largest):** *"3 sellers putting ₹Y of category GMV at risk this week"* `[illustrative]`. **So-what:** ranked by *customer-backed* exposure, not raw breach counts — open the top row's evidence pack.
- **Cards / components:**
  - **OwnershipBoard** with a card-type filter bar — ranked seller rows; renders **T2-07** (C-7, O-4). Each row: seller, tier, customer-backed GMV exposure, complaint-cluster + repeat-contact, and a **concentration band vs the FDI 25% cap**.
  - **Seller SLA ↔ trust-erosion card** — renders **T2-08**: turns the descriptive row causal (the SLA breach co-moving with trust-erosion voice) + the concentration flag.
  - **Per-seller evidence pack** ✦ — quotes + affected GMV + the resolved order trail (O-8); doubles as the fall-back-liability artifact.
  - **Seller-dispute triage** — renders **T2-11** (one row, event-triggered): uphold / reverse / coach with evidence both ways.
- **KPIs shown:** seller cancellation / late-dispatch / ODR (seller); GMV concentration % vs cap (seller.gmv_concentration_pct); repeat-contact rate (interaction). ✓
- **Explainability line (rule 2):** *"This seller's ODR is still 'near the line', but 'cancelled after I waited 3 days' clusters and a 23% GMV-concentration band put it top of the board."*
- **Primary actions:** **Open evidence pack**; **Draft seller review / coaching** (→ Seller-Brand, FDI-non-discrimination-aware, 25%-cap-checked, human approves); **Route to Trust & Safety** (counterfeit/safety rows).
- **Layer-2 drill target:** the evidence pack (already Layer 2).

### S4 · Lane RTO Arbitration  *(Hero 2; drill from rail T2-26; time default: this week vs last, flips to today-vs-same-day-baseline on a live spike)*

- **Headline signal (top-left, largest):** *"Metro lane RTO 33% vs a 21% band — the voice says logistics, not seller"* `[illustrative]`. **So-what:** route to the *correct* owner and end the standing blame fight.
- **Cards / components:**
  - **Lane arbitration verdict card** — renders **T2-26** (C-2, O-5): RTO/SLA vs the lane band + the **voice-theme split** (delivery-theme → logistics vs product-theme → seller) with the deciding share.
  - **Warehouse-vs-seller fault split** — renders **T2-04**: where the return text co-moves with a pick/pack exception, attribute to the warehouse, not the seller.
  - **Evidence feed** ✦ — the lane voice band (cohort-level) + the resolved orders (O-8).
- **KPIs shown:** RTO/NDR rate by lane (return, order, lane_id); delivery-SLA (fulfilment events). ✓
- **Explainability line (rule 2):** *"This lane's RTO is 33% vs 21%; 70% of the lane's voice is 'rider didn't attempt / marked undelivered' — a logistics failure, so the seller penalty is held."*
- **Primary actions:** **Route lane verdict to Operations** (logistics) **or Seller-Brand** (whichever the voice resolves to); **Route the process gap to the process map** (the diamond — e.g. a pick/pack gap to Operations). Pin-code differential action is **gated** (geography proxy; O-9), drafted not fired.
- **Layer-2 drill target:** the lane's voice + order detail (already Layer 2).

### S5 · Festival Incident Monitor  *(Hero 3; real-time tier; drill from rail T2-28; time default inside a sale window: today vs the same sale-day baseline, sale-scaled — rule 3)*

- **Headline signal (top-left, largest):** *"3× order spike on this SKU — is it real demand or a payment failure?"* with the **real-vs-failure verdict** beside it. **So-what:** verify before escalating; suppress expected sale-day surges so the rail isn't flooded.
- **Cards / components:**
  - **Real-vs-failure verdict card** — renders **T2-28** (C-8, O-6): the spike vs the sale-scaled baseline + the **failure-voice corroboration** ("payment deducted, no order") + the **conservative tier selector** with a confidence band.
  - **Return-initiation defect-wave card** — renders **T2-15** (O-6/O-1): a return-initiation spike co-moving with a care-transcript defect theme — the early-recall signal.
  - **Evidence feed** ✦ — the corroborating complaints (keyed) + fraud/account signal (O-8).
- **KPIs shown:** order/payment spike vs sale-scaled baseline (order, payment.status); failure-voice volume (interaction). ✓
- **Explainability line (rule 2):** *"This 3× spike co-moves with 'payment deducted, no order' complaints and an aligned account signal — a payment-gateway failure, not demand; escalated."* And the suppressed case: *"This 4× apparel spike has no failure voice — expected sale-day demand, suppressed."*
- **Primary actions:** **Prepare incident packet → Route to Trust & Safety + Operations** (verified, human-gated); **Adjust alert tier** (conservative default in peak).
- **Layer-2 drill target:** the incident packet (already Layer 2).

---

## 4. Card anatomy (read from the Fluid/LiSN methodology §G — the honest slots)

Every Signal card (the rail items and the drill hero cards) carries these slots; the honesty-line and the AI marker are mandatory:

- **Title** — names what deviated (plain language, no internal code). *e.g. "Recoverable margin on a Fashion shirt run."*
- **Severity** — S1 act-now / S2 review-this-week / S3 watch; from magnitude + impact + confidence; drives the rail order.
- **Cohort** — the grain the anomaly was isolated at (SKU×seller / lane / seller / SKU×aspect).
- **Data source (the honesty line)** — the feed that actually proves the *verdict*. *e.g. "Detection: return rate. Verdict: return free-text + reviews"* — never claim "returns-data-only" when the recoverable verdict needs the voice (hard fail if violated).
- **Time** — onset via change-point, anchoring the anomaly to a likely cause window.
- **Stats box** — quantifies the deviation (rate vs band; fixable-vs-intent split; voice-theme share; spike vs sale-scaled baseline).
- **AI verdict (✦ sparkle)** — states the cause and the recommended action, with the one-line explainability reason (rule 2). Carries the AI marker so it is never mistaken for a system of record.

The rail section title **"Today's Category Signal Monitor" (✦AI)** labels the rail as the distilled "act on these" output, distinct from the passive KPI tiles.

---

## 5. Goal → Capability → UI mapping

| Persona question | Capability (Stage 5) | UI zone | Gap? |
|---|---|---|---|
| Q1 costliest fixable margin leak this week | C-2 + C-3 + O-2 | S1 Tile 1/2 headline → S2 | no |
| Q2 why returns jumped + recoverable vs intent | C-2, C-3, O-2, O-10 | S2 cause-code breakdown + T2-02 card | no |
| Q3 sellers dragging trust, ranked by GMV | C-7, O-4, O-8 | S3 OwnershipBoard + evidence pack | no |
| Q4 aspect turning, dragging conversion | O-3, C-4 | S1 rail (T2-12) → shared drill | no |
| Q5 promote / caution / do-not-promote | C-6, C-3, O-3 | S1 rail (T2-19) → shared drill | no |
| Q6 RTO spike — logistics or seller | C-2, O-5 | S4 lane arbitration verdict | no |
| Q7 real demand vs failure in the sale | C-8, O-6 | S5 real-vs-failure verdict + tier | no |
| Q8 what a stockout is really costing | C-5, O-7 | S1 rail (T2-17) → shared drill | no |
| Q9 true category contribution | C-10 | S1 Tile 1 + monthly view | no |
| Q10 conduct/grievance exposure | O-1, O-8 (+O-9) | S1 Tile 3 sub-flag → one-click compliance flag | no (screen only if compliance class added) |
| Q11 assortment gaps | O-1 + null-search | (parked off-demo; rail card T2-18 optional) | no |

Every TOP_QUESTION has a capability behind it — **no coverage gaps**. (Q11 is in-scope but kept off the 5-screen demo path per sales-demo discipline.)

---

## 6. Navigation + landing

- **Shell (reference build pattern):** dark canvas with a **light/dark toggle** (light offered as default for a business head), a **collapsible sidebar**, `DashboardThemeProvider`. One product, distinct room — gold/navy accent (theme set in run-config; enforced at 9C).
- **Landing:** S1 Category Command Centre.
- **Navigation:** S1 is the hub; S2–S5 are Layer-2 drills reached from a tile or a rail Signal, each with a back-to-Command-Centre return. **Two layers only — no Layer 3** (rule 5): a drill's "deeper" content (full verbatim set, full order trail) is the evidence feed *within* the same drill, not a third screen.
- **Storyline path (the seller's walk-through):** S1 → S2 (wedge) → S3 (seller board) → S4 (org-fight) → S5 (festival peak) → optional reveal of the parked external-voice join as "coming next".

---

## 7. States (sales-demo: happy path fully built; others stubbed but never breaking the walk-through)

- **Selection / happy path:** fully built on all five screens — every hero Signal drills to convincing evidence; numbers tie out across S1↔S2↔S3↔S4↔S5 (Stage 9A/9B enforce the tie-out).
- **Empty:** static stub ("no Signals above threshold this window" with one suppressed near-miss visible for credibility) — never a blank screen mid-demo.
- **Loading:** static skeleton on the rail and drills; no spinner that stalls the walk-through.
- **Error:** static, non-blocking; no browser storage (artifact constraint).
- **Credibility requirement (sales-demo):** at least one **suppressed near-miss** on S1/S5 (an expected sale-day spike shown as suppressed) so the demo doesn't look all-red/fake.

---
*Feeds: Stage 7 (flows + per-Signal drill signatures from the drill targets), Stage 8 (components to name from the cards), Stage 9C (screens/components to map governance rule IDs onto).*
