# Stage 5 Capabilities & Data Model — LiSN (Retail / e-commerce)

> Phase 3, stage 2 of 5. Inputs: RunConfig + Stage 3 catalogue + Stage 4 personas. **Methodology loaded:** `product-methodologies/fluid-lisn-analysis-method.md` — anomaly detection + auto-adaptive baselining; the atomic surfaced **unit is a *Signal*** (a surfaced anomaly + its so-what). Per-unit blocks use the methodology's section-F template; card slots use section-G; pipeline instantiates section-E; edge cases cite section-D. This is the contract Stage 9A/9B fill and Stage 8 structures. Brand rules applied.

---

## 1. Entity model

Entities and the relationships that matter (cardinalities noted where load-bearing):

- **Category** 1—* **SKU**; **SKU** *—1 **Seller** (a SKU is listed by a seller); **Seller** *—* **Category** (a seller spans categories).
- **Order** *—1 **SKU**, *—1 **Customer cohort**, *—1 **Pin-code/Lane**, *—0..1 **Promo/Campaign**, *—0..1 **Dark-store/Warehouse**.
- **Order** 1—0..* **Return/RTO** (a return carries reason-code **and** free-text); **Return** 1—1 **Refund-ledger** entry.
- **SKU/Seller/Order** 1—* **Interaction** (review, rating, care chat/call, seller-support ticket, Q&A, social, app-store, grievance) — the corpus LiSN owns at full coverage.
- **Signal** *—1 owner persona, 1—* **Evidence** items, 1—1 **Impact** estimate, 1—1 **Confidence** score, *—1 **Baseline cell**.

**Joins that already exist in the substrate (table-stakes):** Order → SKU → Seller; Order → Return reason-code; Order → Refund-ledger (settlement reconciliation); Order → Promo exposure; SKU → catalogue/PIM attributes.

**The differentiating joins (what a transaction-only copilot cannot make):**
1. **Return free-text / review / care-voice → SKU contribution + seller** (the wedge; powers T2-02). Keyed where the voice carries an order/SKU/seller key; cohort-level otherwise.
2. **Operational anomaly ↔ co-moving voice anomaly, against a regime-aware baseline** (the general spine; powers T2-26, T2-28, T2-12). **Cohort-level, never identity-level.**
3. **Seller SLA/ODR ↔ seller-keyed customer-voice damage + GMV-concentration band** (powers T2-07, T2-08).
4. **Parked Tier-3:** operational anomaly ↔ *external/unkeyed* voice (social/app-store) — not built in v1; the demo's "coming next" reveal.

**Domain-spine entities (the chain must be representable, or a card cannot trace it):**
`Interaction` → `Signal` (anomaly) → `BusinessIssue` (the so-what: margin leak / trust erosion / lost demand / conduct exposure) → `OwnerPersona` (routing) → `Evidence` (verbatims + order trail + provenance) → `RecommendedAction` (draft). Every Signal row carries a foreign key to each link in this chain. A Signal that cannot populate `Evidence` and `BusinessIssue` does not surface.

**Constraints from boundary (`DOES_NOT_DO`):** cross-domain joins are stored and rendered **cohort-level** (cohort = category × seller × pin-code/lane × cohort-bucket × time); no identity-level customer join. Every `RecommendedAction` carries `status: draft` + `accepted_by` / `accepted_at` (null until a human approves) + an immutable `audit_log` entry. No `Action` row may carry an `auto_executed` flag.

---

## 2. Field inventory (catalogue-driven; side + trust-bearing flagged)

`†` = **trust-bearing** — the cause/evidence-bearing fields the methodology relies on to make a Signal defensible; these are what 9A/9B must populate richly.

**Order** — `order_id`, `sku_id`, `seller_id`, `category_id`, `cohort_id`, `pincode`/`lane_id`, `darkstore_id`, `promo_id`, `gmv`, `contribution_value`†, `order_ts`, `channel`, `day_type` (normal/sale)† — *substrate*.
**Return/RTO** — `return_id`, `order_id`, `return_type` (CIR/RTO/cancellation), `reason_code`, `reason_freetext`†, `reverse_logistics_cost`†, `refunded_commission`†, `fault_class` (catalogue/seller/warehouse/intent)†, `initiation_ts`† — *substrate (codes) + interaction (free-text)*.
**Refund-ledger** — `refund_id`, `return_id`, `refund_value`, `refund_status`, `sla_due_ts`, `refund_ts` — *substrate*.
**SKU / Catalogue (PIM)** — `sku_id`, `title`, `attributes{}`, `sizing_chart`†, `completeness_score`†, `legal_metrology_fields{mrp,origin,net_qty,...}`† — *substrate*.
**Seller** — `seller_id`, `tier`, `gmv`, `gmv_concentration_pct`† (vs FDI 25% cap), `cancellation_rate`, `late_dispatch_rate`, `odr`†, `valid_tracking_rate` — *substrate*.
**Funnel event** — `session_id`(hashed cohort), `category_id`, `step` (visit/PDP/ATC/checkout/order), `event_ts`, `device`, `pincode` — *substrate*.
**Inventory/Availability** — `sku_id`, `darkstore_id`/`zone`, `available_flag`, `promise_date_met`†, `fill_rate` — *substrate*.
**Promo/Campaign** — `promo_id`, `sku_ids[]`, `ad_spend`, `roas`, `discount_depth`, `impression_log_ref` — *substrate*.
**Payment** — `order_id`, `gateway`, `status` (success/fail/deducted-no-order)†, `failure_ts` — *substrate*.
**Interaction** — `interaction_id`, `channel` (review/rating/chat/call/ticket/seller-support/QnA/social/appstore/grievance), `text`†, `language`†, `sku_id`?/`seller_id`?/`order_id`?† (the join keys), `aspect_tags[]`†, `theme_cluster`†, `sentiment`†, `escalation_language_flag`†, `pii_redacted`† , `interaction_ts`† — *interaction (the owned corpus)*.
**Signal** — `signal_id`, `card_id` (T2-##), `title`, `behaviour_type` (DENSE/BURSTY/SPARSE)†, `cohort_id`†, `baseline_cell_id`†, `deviation_stat`†, `onset_ts` (change-point)†, `cause_class`†, `confidence` (High/Med/Low)†, `impact_value`†, `ruled_out[]`†, `honesty_line`† (the feed that actually proves it), `owner_persona`, `action_id`, `severity` (S1/S2/S3).
**Action** — `action_id`, `signal_id`, `draft_text`, `routed_owner`, `status` (draft/accepted/dismissed), `accepted_by`, `accepted_at`, `audit_log_ref`. **No `auto_executed` field exists.**
**Baseline cell** — `cell_id`, grain keys, `behaviour_type`, `p05/p50/p95` or `median/iqr` or `poisson_lambda`, `sale_multiplier`, `sample_n`†, `stability_score`†, `last_promoted_ts`.

---

## 3. Capability list (C- substrate/analytics · O- operational/interaction)

| Code | Name | Computes | Feeds cards |
|---|---|---|---|
| **C-1** | Auto-adaptive baselining engine | classify each cell DENSE/BURSTY/SPARSE (sale-excluded, 8-weekday window); build the matching baseline model + sale scaling-factor | all |
| **C-2** | Return/RTO anomaly index | return/RTO rate vs the cell's *category-relative* band at SKU×seller×pin-code×week-type | T2-02, T2-05, T2-26 |
| **C-3** | Contribution-at-risk sizing | ₹ at risk = rate-excess × order-contribution; **recoverable** = fixable-share × contribution | T2-02, T2-16, T2-19 |
| **C-4** | Funnel/conversion anomaly index | conversion deviation per category×hour×day-type; change-point on promo/release edits | T2-12, T2-28 |
| **C-5** | Stockout lost-GMV + ad-waste pairing | lost GMV at peak demand + concurrent sponsored spend on the out-of-stock SKU | T2-16, T2-17 |
| **C-6** | Promo health composite | three-state (promote / caution / do-not-promote) from return rate + sentiment slope + availability + seller health vs ROAS | T2-19 |
| **C-7** | Seller-tier baseline + concentration tracker | per-tier expected breach/complaint profile; GMV-concentration vs FDI 25% cap | T2-07, T2-08 |
| **C-8** | Sale-day scaling + festival incident gate | normal baseline × sale multiplier with buffers; gate festival spikes for voice corroboration | T2-28, T2-15 |
| **C-9** | Confidence scorer | sample × baseline-stability × control-quality × corroboration → High/Med/Low (weak → advisory) | all |
| **C-10** | Category contribution rollup | contribution after returns, reverse-logistics, discounts, payment fees, blended CAC | KPI tiles |
| **O-1** | Multilingual semantic index | cluster reviews/chat/return-text by SKU+PIN+seller across Hinglish/regional | all voice cards |
| **O-2** | Return-reason cause-code distillation | free-text → ranked causes; **fixable-vs-intent split** via the GoKwik 60–70%-intent prior | T2-01, T2-02, T2-03 |
| **O-3** | Aspect-sentiment monitor (anti-NPS) | aspect-level negative-share slope; change-point cliff before the star average moves | T2-12, T2-13 |
| **O-4** | Seller-voice damage clustering | complaint clusters + repeat-contact rate, keyed to seller | T2-07, T2-08, T2-11 |
| **O-5** | Lane voice-theme classifier | split lane voice into delivery-theme (→ logistics) vs product-theme (→ seller) | T2-26 |
| **O-6** | Failure-voice detector | real-time "payment deducted, no order" / fraud language | T2-28, T2-15 |
| **O-7** | Switching-intent detector | "switched to X" / "promised today, didn't come" frustration | T2-17 |
| **O-8** | Provenance-stamped evidence-packet assembler | minimal sufficient verbatims + resolved order trail + timestamps | all (the evidence feed) |
| **O-9** | Insight-vs-action guardrail | flag any cohort/geography slice whose *differential action* proxies a protected attribute; PII redaction | wraps all |
| **O-10** | Deterministic returns↔order↔seller↔refund-ledger backbone | the operator-keyed join spine (MVP-0) the harder voice joins extend | T2-02, T2-04, T2-27 |

Every Stage-4 TOP_QUESTION maps to a capability (Q1/Q2→C-2+C-3+O-2; Q3→C-7+O-4; Q4→O-3+C-4; Q5→C-6; Q6→C-2+O-5; Q7→C-8+O-6; Q8→C-5+O-7; Q9→C-10; Q10→O-1+O-8 (+O-9); Q11→O-1+null-search). **No gap markers** — every question has a capability behind it.

---

## 4. Product pipeline (methodology section E, instantiated for retail / e-commerce)

**Grain:** `cohort × category × SKU × seller × pin-code/lane × week-type × time`.
**Comparison basis:** each cell's own **category-relative auto-adaptive baseline** — DENSE → rolling p05/p50/p95; BURSTY → median + IQR; SPARSE → Poisson rarity — **sale-day-scaled** inside a sale window (normal baseline × sale multiplier, p05×mult×0.8 / p95×mult×1.2). Sale/event days are excluded before classifying (non-negotiable; including them inflates DENSE and blinds post-sale detection).

1. **Ingestion** — substrate feeds + the interaction corpus (full coverage).
2. **Joins** — stitch each order to its return/reason/free-text/refund, seller, lane, promo exposure, and its review/care thread → an *enriched* row carrying cause-bearing fields (O-10 deterministic where keys exist; O-1 cohort-level semantic where only keyed text exists).
3. **Feature layer** — rates/mixes/splits/economics at the grain above.
4. **Baseline store** — per-cell category-relative baselines + sale multipliers + control definitions (matched cohorts; pre/post change-points for promo/release edits).
5. **Anomaly detection** — score each cell vs baseline (band / IQR / Poisson; change-point for promo edits; DiD for offers); gate by min sample; suppress sub-threshold. The "thousands of baselines → a few Signals" step.
6. **Root-cause attribution** — classify each surfaced anomaly from joined cause fields (return cause-code mix via O-2; lane voice-theme via O-5; failure-voice via O-6) + ruled-out checks (control path normal, demand drop, fraud flat).
7. **Financial-impact estimation** — contribution at risk, recoverable margin (fixable share × contribution), wasted ad spend, lost GMV, hidden-demand bleed.
8. **Confidence score** (C-9) — sample × baseline stability × control × corroboration → High/Med/Low; weak items forced to advisory.
9. **Insight store** — persist each Signal with cohort, evidence, ruled-out list, impact, confidence, owner, recommended action.
10. **Dashboard cards** — render from the insight store (the 24×7 rail, the seller board, the drill-downs).
11. **Action routing** — `insight_type → routing_table` (the Stage-4 routing map); emit **draft** actions only (human approves; audit-logged); advisory gated from auto-treatment; seller-facing drafts check FDI non-discrimination + the 25% band.
12. **AI analyst** — natural-language Q&A over the same insight store.

---

## 5. Unit / signal library (methodology section-F template, one block per demo-spine card)

### T2-02 · Recoverable-margin return card  `[merge MB3]`  — **HERO / the wedge**
```
Signal: Recoverable-margin return        Behaviour type: DENSE (return rate; category-relative band)
Formula: return_rate(SKU·seller) over its band AND return free-text fault-themes co-elevated;
         recoverable_₹ = fixable_share × order_contribution × excess_returns
Pseudocode: flag if return_rate > p95(cell, sale-excluded) AND excess > 3·band-width
         AND total_returns ≥ min_sample AND O-2 fault-share(catalogue/seller) skews up
         AND fixable_share (1 − GoKwik-intent prior) materially > 0
Feeds: returns(+reason_code,+reason_freetext,reverse_logistics_cost), order(contribution), seller,
       reviews/care (SKU-keyed) ; capabilities C-2, C-3, O-2, O-8, O-10
Min sample: ≥ N returns on the cell (e.g. ≥ 40/wk) before surfacing
Baseline period: trailing 8 same-weekday weeks, sale-excluded; category-relative band
Confidence: High if fault-theme skew aligns with a catalogue/seller change-event AND control SKUs normal
Impact: recoverable contribution, e.g. returns 31% on a shirt run; ~64% intent, residual "chest narrow vs
        chart" fault = ₹6L recoverable if the listing is fixed `[illustrative]`
FP checks: buyer-remorse/intent share (held out via GoKwik prior); a sale-day return lift (baseline scaled);
        a warehouse mis-pick masquerading as a seller fault (routed to T2-04 instead)
Routing: insight_type=return-margin → Catalogue/PIM + Seller-Brand ; DRAFT + human gate + audit log
Honesty line: detection is substrate (return rate); the *recoverable* verdict needs the return free-text +
        reviews — say so; do not claim "returns-data-only".
```
*Card slots (G):* Title "Recoverable margin on <SKU/seller>" · Severity S1 if recoverable > threshold · Cohort SKU×seller×category · Data source: returns + return free-text + reviews · Time: onset change-point on the return rate · Stats box: rate vs band, fixable-vs-intent split · AI verdict (sparkle): the fixable cause + the ₹ recoverable + draft fix.

### T2-05 · Return / RTO anomaly by SKU×seller×geography  `[merge MA23]` — substrate base
```
Signal: Return/RTO band breach           Behaviour type: DENSE (category-relative)
Formula: return/RTO_rate(SKU·seller·pincode·week-type) exceeds the cell's own band
Pseudocode: flag if rate > p95(cell, sale-excluded) AND GMV-weighted excess > threshold AND sample ≥ gate
Feeds: returns/RTO logs, order, seller, pincode ; C-1, C-2, C-9
Min sample: per-cell gate; hierarchy fallback (parent) for sparse pin-codes
Baseline period: 8 same-weekday weeks; fashion sits structurally 25–40% → band is category-relative
Confidence: High if breach persists ≥ 2 windows and control cells normal
Impact: contribution at risk = excess-rate × order-contribution × volume
FP checks: category-structural high returns (fashion at its normal level — not an anomaly); sale-day lift
Routing: → Operations / Seller-Brand ; DRAFT + human gate + audit log
Honesty line: substrate-only detection; this is the spine the voice cards (T2-02/T2-26) attach to.
```

### T2-07 · Seller trust-risk board  `[merge MA3]` — **HOME surface**
```
Signal: Seller customer-backed trust risk   Behaviour type: BURSTY (complaint clusters on a calm base)
Formula: seller customer-voice damage > peer-tier baseline, ranked by affected GMV
Pseudocode: flag/rank if (complaint-cluster rate + repeat-contact rate) > tier-baseline (median+IQR)
         AND GMV-weighted ; concentration_pct checked vs 25% cap
Feeds: seller SLA/ODR/cancellation, seller-support tickets, buyer care/reviews keyed to seller ;
       C-7, O-4, O-8
Min sample: ≥ N keyed interactions per seller; suppress one-offs (require cluster persistence)
Baseline period: per seller-tier rolling profile
Confidence: High if voice damage + an SLA breach corroborate (turns descriptive board → causal, T2-08)
Impact: customer-backed GMV exposure per seller row
FP checks: a single vocal complaint (not a cluster); a warehouse fault wrongly attributed to the seller
Routing: → Seller-Brand + Trust & Safety ; remediation FDI-non-discrimination-aware ; DRAFT + human gate
Honesty line: ranking is corpus-side + seller SLA; the evidence pack (verbatims + affected GMV) is the proof,
       and doubles as the fall-back-liability artifact.
```

### T2-12 · Aspect-sentiment cliff → conversion / returns risk  `[merge MA2 + MB6]` — **HERO (anti-NPS)**
```
Signal: Aspect-sentiment cliff           Behaviour type: DENSE share + change-point cliff
Formula: a negative aspect's share rises sharply vs its own trailing mix on a high-exposure SKU,
         co-moving with a conversion dip or return rise — BEFORE the star average moves
Pseudocode: flag if aspect_neg_share Δ-slope > change-point threshold AND SKU GMV-exposure high
         AND (conversion dip OR return rise) co-moves in-window AND sample ≥ gate
Feeds: reviews/ratings (SKU-keyed, aspect-tagged via O-3), funnel conversion, returns ; C-4, O-1, O-3, O-8
Min sample: ≥ N recent reviews carrying the aspect
Baseline period: the aspect's own trailing mix (the slow star average is explicitly NOT the baseline)
Confidence: High if the aspect cliff + conversion/return co-movement align; correlation-evidence band shown
Impact: aspect-driven conversion/return loss, e.g. "wrong shade" 19% of recent reviews, conversion −6% while
        the average holds 4.0★ → ₹ exposed `[illustrative]`
FP checks: sarcasm / code-mixing (Hinglish nuance is the moat and the risk); a genuine viral spike
Routing: → Catalogue + CX ; DRAFT + human gate + audit log
Honesty line: the join is directional (correlation, not proven cause) — band it; aspect extraction across
        Indian languages is what makes it defensible.
```

### T2-19 · Promo "do-not-promote" guardrail  `[merge MA6 + MB19]` — **HERO**
```
Signal: Promo health verdict             Behaviour type: DENSE composite (gate)
Formula: a promoted / about-to-be-promoted SKU crosses into unhealthy on a composite of
         return rate + recent sentiment slope + availability + seller health → promote / caution / do-not
Pseudocode: verdict = compose(C-2 return band, O-3 sentiment slope, availability, C-7 seller health) ;
         flag if composite crosses caution/do-not threshold WHILE ad/promo spend is scaling
Feeds: ad/promo exposure + ROAS, returns, recent review sentiment, seller health ; C-6, C-3, O-3
Min sample: composite gated on each input's own min sample; avoid stale-review penalties (recency-weighted)
Baseline period: each input's own baseline; composite weighting fixed and shown
Confidence: High if ≥2 composite inputs are unhealthy and corroborate
Impact: ad spend at risk redirected, e.g. ROAS 4.2 but reviews turned on "stopped working in a week" and
        returns above band → "do not promote", ₹3.4L redirected `[illustrative]`
FP checks: stale reviews dragging an otherwise-healthy SKU; a one-off return spike
Routing: → Pricing / Retail-Media ; **LiSN advises, Category Head decides** (org-seam, audit-logged)
Honesty line: composite over substrate + recent voice; it is a verdict-with-reason, not an auto-pause.
```

### T2-26 · Lane RTO ↔ care-voice arbitration  `[merge MB13 + MB14]` — **HERO (resolves an org fight)**
```
Signal: Lane RTO blame-resolution        Behaviour type: DENSE (lane RTO band) + voice attribution
Formula: an RTO/SLA breach in a lane co-moves with delivery-theme care voice (→ logistics)
         vs product-theme care voice (→ seller)
Pseudocode: flag if lane_RTO > p95(lane band, sale-excluded) AND O-5 voice-theme split resolves owner
         AND cohort sample ≥ gate ; verdict = argmax(theme share)
Feeds: RTO/NDR + delivery-SLA by lane, care voice (keyed, cohort-level) ; C-2, O-5, O-8
Min sample: lane cohort gate; sparse small-lane voice → hierarchy fallback / lower confidence
Baseline period: per-lane band, sale-excluded
Confidence: High if the dominant voice theme is decisive (e.g. 70% "rider didn't attempt")
Impact: contribution at risk on the lane; the verdict ends the standing logistics-vs-seller blame fight
FP checks: a sale-day RTO lift; mixed voice with no clear owner (held below threshold)
Routing: verdict → Operations (logistics) OR Seller-Brand ; pin-code differential action GATED (geography
         proxy) ; DRAFT + human gate + audit log
Honesty line: cohort-level lane join; the verdict is the deciding voice band, not a per-customer claim.
```

### T2-28 · Festival real-vs-failure incident detection  `[merge MB25]` — **HERO (peak)**
```
Signal: Festival real-vs-failure verdict  Behaviour type: sale-day-scaled DENSE + BURSTY failure-voice
Formula: a sale-window spike with NO co-moving failure voice → real demand; a spike co-moving with
         "payment deducted, no order" / fraud voice → failure, against a conservative sale-scaled baseline
Pseudocode: classify spike vs (normal baseline × sale_multiplier, buffered) ; if O-6 failure-voice
         corroborates in-window AND account/fraud signals align → FAILURE ; else suppress as expected demand
Feeds: order/payment/funnel events, care tickets (keyed), fraud/account signals ; C-8, C-4, O-6, O-8
Min sample: festival-scale gates; configurable alerting tier (conservative default in peak)
Baseline period: normal 8-week baseline × sale multiplier (e.g. BBD day-1 ≈ 11.8× normal)
Confidence: High only with voice corroboration + aligned account/fraud signal (conservative — FP is the risk)
Impact: GMV/trust at risk in the highest-stakes window (Diwali ≈ ₹50,000 cr in ~10 days) `[illustrative]`
FP checks: genuine sale-day surge (the whole point of the scaled baseline); rhetorical complaints without
         a payment-failure signal
Routing: verified → Trust & Safety + Operations ; DRAFT + human gate + audit log
Honesty line: runs on the real-time tier; the verdict needs the failure-voice feed, not order data alone.
```

**Supporting demo colour (brief blocks):**
- **T2-15 · Return-initiation ↔ care-chat defect wave** — BURSTY; real-time co-movement of a return-initiation spike on a model with a care-transcript defect theme (O-6/O-1); High confidence when the defect theme is specific; routes to Category + T&S as an early-recall signal; honesty line = needs care transcripts, not returns alone.
- **T2-17 · Hidden lost demand** — DENSE availability + BURSTY switching-voice; stockout/promise-miss co-moving with O-7 switching-intent voice; impact = weekly demand bleed; quick-commerce signature; the social-substitution variant is parked Tier-3.

---

## 6. Edge cases (methodology section-D register; per unit)

- **Sale contamination** → every unit excludes sale/event days before classifying; T2-28 uses the scaling-factor baseline instead (most acute here).
- **Hierarchy fallback** → T2-05, T2-26 fall back to the parent (category / metro band) when a SKU/pin-code cell has no baseline.
- **Sparse-cell / cold-start** → small-lane voice (T2-26) and per-pin-code returns (T2-05) get parent fallback + lower confidence rather than a false flag.
- **Alert fatigue / correlated alerts** → multi-layer suppression + root-cause grouping; in festival peak (T2-28) the conservative tier is default so the rail is not flooded.
- **Data-quality gate** → interaction corpus < 90% completeness for a cell → pre-validate; the Signal is held to advisory.
- **Classification drift** → > 20% distribution shift on a metric → stability monitor re-classifies behaviour type before trusting the band.
- **Saturation / dead-alert** → a return rate already at a structural ceiling (fashion) → pivot the metric to *change vs the cell's own band*, never an absolute threshold.

---

## 7. KPI definitions (each KPI shown on a screen is defined here)

| KPI | Plain formula | Source fields | Persona | Type |
|---|---|---|---|---|
| Category contribution after returns & CAC | GMV − returns cost − reverse logistics − discounts − payment fees − blended CAC | order.gmv, return costs, promo, CAC | Category | **north-star** |
| Profitable GMV / CM1 | platform revenue (commission + fulfilment + ad + payment) − variable cost, ÷ GMV | order, seller fees, ad-server | Category | north-star |
| Return / RTO rate | returns (CIR + RTO) ÷ delivered orders, by SKU·seller·pin-code | return, order | Category/CX | diagnostic |
| Recoverable margin | fixable-share × order-contribution × excess returns | return.fault_class, contribution | Category | diagnostic |
| Conversion (funnel by step) | step→step ratio (visit→PDP→ATC→checkout→order) | funnel events | Category | diagnostic |
| ROAS / promo incrementality | attributed GMV ÷ spend; lift net of cannibalised organic | promo, order, holdout | Pricing/Category | diagnostic |
| Seller SLA / ODR / concentration | cancellation + late-dispatch + ODR; GMV-share vs 25% cap | seller | Seller-Brand | diagnostic |
| Stockout / fill-rate | demand unmet by OOS ÷ demand; promise-date met | inventory, funnel | Category/Ops | diagnostic |
| Review-sentiment slope | Δ aspect negative-share vs trailing mix (NOT the star average) | interaction.aspect_tags | CX/Category | diagnostic |

---

## 8. Capability boundary

LiSN **consumes** the operator's summary tables and event feeds (order/GMV, funnel, returns/RTO, inventory, pricing/promo, fulfilment-SLA, seller-SLA, ad-server, payments, GSTR-8). It **owns** the interaction/voice/complaint corpus at full coverage and the insight store built on it. It **never owns or rebuilds** the core lakehouse, **never auto-fires** a customer- or seller-facing action (every action is draft + human gate + audit log), **never** autonomously down-ranks a seller / restricts a pin-code / restricts COD (those are gated, FDI-non-discrimination-aware, 25%-cap-checked), and joins **cohort-level, never identity-level**. Every AI-generated element carries the sparkle marker. Detection may run on substrate alone, but each unit's **honesty line** names the feed that actually proves the *verdict* — the demo never claims "transaction-only" when the cause needs the voice.

---
*Feeds: Stage 6 (KPIs + C-/O- codes for the Goal→Capability→UI table), Stage 8 (entities + data shape), Stage 9A (entities + comparison basis), Stage 9B (unit conditions + payload fields).*
