# Stage 5 — Capabilities & Data Model — LiSN (Retail/E-commerce CX)

> **Phase 3, stage 2 of 5.** Input: run-config + Stage 3 catalogue + Stage 4 personas. **Methodology loaded:** `product-methodologies/fluid-lisn-analysis-method.md` (auto-adaptive baselining DENSE/BURSTY/SPARSE · the 12-stage detection pipeline · the per-signal spec template · the monitor-rail card anatomy). The generic stage names no technique; it instantiates that file. "Unit" = a surfaced anomaly/signal. Brand: LiSN · British "distil" · India primary.

---

## 1. Entity model

Entities and cardinalities (the chain every card must trace — the DOMAIN SPINE — is encoded explicitly):

```
Interaction (ticket | call | chat | review | app-store review | social | return/cancellation free-text | grievance)
   * many Interactions --belong to--> 1 Order            (order-linkage key; nullable for social/review)
   * many Interactions --tag--> Entity {SKU | Seller/Brand | Category | Dark-store/Pincode/City | Channel | App-version}
   * many Interactions --classified into--> Theme/Intent (+ confidence band)
Order        * many Orders --fulfilled by--> 1 Dark-store (q-commerce) ; --sold by--> 1 Seller ; --contains--> many SKUs
Signal (a surfaced anomaly)  --derived from--> a cluster of Interactions against a Baseline
   Signal --owns--> 1 BusinessIssue --routed to--> 1 PersonaOwner(routed exec) --carries--> EvidencePack --proposes--> DraftAction
Grievance    --has--> StatutoryClock {CP-Rules 48h ack / one-month redressal | DPDP 90-day erasure}
Baseline (per cell: Entity × Theme × time-grain)  --classified as--> {DENSE | BURSTY | SPARSE}
AuditLogEntry (immutable) --records--> every DraftAction approval ("accepted by X on date Y")
[Phase 2] TransactionRow {GMV | margin | returns/RTO | refund-ledger | conversion | stock-out | seller-payout}  — consumed, never owned
```

**DOMAIN SPINE entities (must be representable, or a card cannot trace it):**
`Interaction → Signal → BusinessIssue → PersonaOwner → EvidencePack → DraftAction`. Every unit block in §5 instantiates this chain.

**Joins that already exist in the substrate (Phase 1):** Interaction → Order-linkage key → Entity tags → Theme. This is LiSN's native corpus, at full coverage.

**The differentiating join (Phase 2, the wedge — competitors cannot make it):** `Signal (interaction-side) ⨝ TransactionRow (operator feed)` at **cohort/catchment level**, producing the dollarised P&L destination. Tagged `bridge-ready`, never run as if live in Phase 1.

**Cohort-level constraint (from DOES_NOT_DO):** every cross-domain join is cohort/catchment-level, never identity-level. No Signal flags a named individual automatically (buyer-fraud T2-13 is review-only).

**Audit chain:** every DraftAction carries `parent_signal_id` and an immutable `AuditLogEntry`; the full-coverage audit log is itself the compliance feature (T2-11).

---

## 2. Field inventory (only the fields the cards need; ✸ = trust-bearing)

| Entity | Field | Side | Trust-bearing? |
|---|---|---|---|
| Interaction | id, channel, timestamp, raw_text | interaction | |
| Interaction | order_linkage_key | interaction | ✸ (normalisation denominator) |
| Interaction | theme/intent, **confidence_band** | interaction | ✸ (MA18 — verdict is a band, not a label) |
| Interaction | entity_tags {sku, seller, category, dark_store, pincode, channel, app_version} | interaction | ✸ (NER quality drives every entity card) |
| Interaction | sentiment_score, sarcasm_flag | interaction | ✸ |
| Interaction | statutory_keyword_flags {"legal action","delete my data"} | interaction | ✸ (T2-11 override trigger) |
| Interaction | dark_pattern_theme {drip-pricing,basket-sneaking,MRP,country-of-origin,refund-timeline} | interaction | ✸ (T2-10 named-instrument match) |
| Order | id, dark_store_id, seller_id, sku_ids, placed_at | interaction-linkage | |
| Signal | id, title, **severity**, **cohort/grain**, onset_time, **data_source(honesty line)**, **confidence (High/Med/Low)**, raw_mentions, signal_count, **corroborating_channels[]** | derived | ✸✸ (all) |
| Signal | impact_estimate `[illustrative]`, routed_owner, recommended_draft_action | derived | ✸ |
| Signal | tier3_bridge_id (MB-id), bridge_status {bridge-ready} | derived | ✸ (honesty: not run on interaction data alone) |
| Baseline | cell_key (entity×theme×grain), behaviour_type, p05/p50/p95 \| median/IQR \| poisson_rate, sale_excluded | derived | ✸ (the comparison basis) |
| Grievance | id, statutory_clock_type, deadline_at, stall_state, touch_count | interaction | ✸ |
| EvidencePack | signal_id, snippet_refs[], ruled_out[], contributing_rows[] | derived | ✸ (what the drill renders) |
| AuditLogEntry | signal_id, action, approver, approved_at | derived | ✸ |
| [P2] TransactionRow | cohort_key, gmv, contribution_margin, returns_cost, refund_lag, conversion, stock_out, seller_payout | substrate | ✸ (bridge join key) |

---

## 3. Capability list (C-/O- coded — later stages cite these, not prose)

| Code | Name | Computes | Feeds cards |
|---|---|---|---|
| **C-1** | Per-cell auto-adaptive baselining | classify each (entity×theme×grain) cell DENSE/BURSTY/SPARSE (sale-excluded) and hold its baseline | every Tier-2 card (the floor) |
| **C-2** | Denominator normalisation (MA21) | every count ÷ exposure (per-order/session/delivery), judged growth-relative | every Tier-2 card (plumbing) |
| **C-3** | Cross-channel corroboration | a theme breaks baseline across ≥2 independent channels near-simultaneously | T2-1, T2-2, T2-14, T2-16 |
| **C-4** | Vernacular sarcasm/neutral confidence band (MA18) | emit a confidence band, route low-confidence/sarcastic to a senior queue | every text card |
| **C-5** | Geographic concentration / peer-relative anomaly | catchment issue-rate vs peer stores, normalised | T2-2, T2-3 |
| **C-6** | Entity velocity-break detection | negative-review/complaint velocity break before the lagging average moves | T2-5, T2-6, T2-8 |
| **C-7** | Named-instrument / fact-pattern match | map a complaint cluster to a named regulatory instrument + auditable evidence count | T2-9, T2-10, T2-18 |
| **C-8** | Statutory-clock monitor + routing override | re-rank a queue by clock proximity + keyword, override time-waiting | T2-11 |
| **C-9** | Inverse-anomaly (suppression) detection | flag a *falling* normalised metric coinciding with a support-access change | T2-20 |
| **C-10** | Release-event correlation | correlate a confusion/error theme to an app-version/flow change (3σ post-version) | T2-16 |
| **O-1** | Signal distillation + ranking | distil thousands of mentions to the few ranked "emerging now" | T2-1 (home tile) |
| **O-2** | Severity → escalation routing | severity by velocity×breadth×criticality; route to the owning function | every Tier-2 card |
| **O-3** | Draft-action + human-gate + audit log | emit a *draft* action, capture approval, write the audit entry | every Tier-2 card |
| **O-4** | Bot-transcript quality monitor | novel bot-failure / containment-drop / CSAT-after-bot | T2-14 |
| **O-5** | Review-integrity guard | coordinated-review detection under the entity cards | T2-7 (guards T2-5/T2-6) |
| **C-11** | **[Phase 2]** Cohort-level interaction×transaction bridge | join a Signal cohort to the operator feed → dollarised P&L | MB1, MB4, MB8, MB17 (bridge tiles) |

Every Stage-4 TOP_QUESTION maps to a capability above (no gap). Question 12 (revenue impact) maps to **C-11**, the only Phase-2 capability — surfaced as bridge-ready, honest about needing the feed.

---

## 4. Product pipeline (the Fluid/LiSN methodology, instantiated for retail CX)

**Analysis grain:** `cohort (entity: sku|seller|category|dark-store|pincode) × channel × theme × time-grain`.
**Comparison basis:** the per-cell auto-adaptive baseline (C-1), sale/event-excluded, weekday-normalised to the last 8 valid same-weekday occurrences.

The 12-stage detection pipeline (methodology §E), instantiated:
1. **Ingestion** — the interaction corpus (Wave 1: review + ticket + return text, PII-light; voice/chat Wave 2). `[Phase 2: + operator transaction feed]`
2. **Joins** — stitch each Interaction to its Order-linkage key and entity tags → an enriched row carrying cause-bearing fields (theme, sentiment, dark-pattern flag, statutory flag), not just text.
3. **Feature layer** — rates/mixes at the grain above: contact-per-order, theme velocity, negative-review velocity, repeat-contact rate, containment rate.
4. **Baseline store (C-1)** — per-cell DENSE/BURSTY/SPARSE baselines, **sale-excluded** (non-negotiable — including sale days inflates volatility and blinds post-sale alerting); this is what makes the outbreak map an anomaly index, not raw counts.
5. **Anomaly detection** — score each cell vs baseline (percentile-band/IQR/Poisson per type); gate by minimum support; suppress sub-threshold (the "thousands of baselines → few signals" step). Cross-channel corroboration (C-3) is the confidence gate.
6. **Root-cause attribution** — classify the surfaced anomaly using joined cause fields + ruled-out checks (peer stores flat, control channel normal, no sale event).
7. **Financial impact estimation** — `[illustrative]` rupee sizing, dollarised fully only at the Phase-2 bridge (C-11).
8. **Confidence score (C-4)** — sample size + baseline stability + corroboration + sarcasm/neutral band → High/Med/Low; weak items forced to advisory.
9. **Insight store** — persist each Signal with cohort, evidence, ruled-out list, impact, confidence, owner, recommended draft action, bridge-id.
10. **Dashboard cards** — render from the insight store (the radar rail, the outbreak map, the compliance queue, the suppression watchdog, the bridge-ready tiles).
11. **Action routing (O-2/O-3)** — `signal_type → routing_table → routed exec`; emit **draft** actions only, human approves, audit-logged.
12. **AI analyst** — answers natural-language questions over the same insight store (the Floating AI Day Generator).

---

## 5. Unit / signal library (one methodology block per demo-spine card)

Each block uses the methodology §F per-signal template. `[illustrative]` marks invented figures.

### T2-1 — Cross-channel emerging-issue radar (home tile) — C-1,C-2,C-3,C-4,O-1
```
Behaviour type: DENSE (theme-volume, continuous) with BURSTY spike overlay
Formula: theme breaks its own baseline across ≥2 independent channels within a near-simultaneous window
Pseudocode: flag if cross_channel_count>=2 AND each channel deviation>baseline AND min_support met
            AND normalised(MA21) AND confidence_band(MA18) computed
Feeds: all contact + review + social text · timestamps · channel · theme classification · entity tags
Min sample: theme present in >=2 channels above each channel's min-support floor
Baseline period: trailing 8 same-weekday windows per (theme×channel), sale-excluded
Confidence: High if corroboration across >=2 channels + normalised break + non-sarcastic band
Impact: cause→cost link is the bridge [TIER-3 → MB1/MB3]; ships now as the corroborated radar
FP checks: single-channel spike (no corroboration) suppressed; sale-day excluded; sarcasm band routes to senior queue
Routing: insight_type "emerging-issue" → owning function (O-2); action DRAFT + human gate + audit
Honesty line: detection is interaction-only; the rupee figure needs the Phase-2 feed (says so on the tile)
```

### T2-2 — Dark-store operational-failure / outbreak — C-1,C-2,C-5,C-3 → bridge MB1
```
Behaviour type: BURSTY (calm catchment baseline + sharp localised spike)
Formula: catchment order-volume-normalised issue rate breaks its own baseline while peer stores hold flat
Pseudocode: flag if normalised_issue_rate(store) > median+k*IQR AND peer_stores_flat AND corroborated(>=2 channels)
Feeds: delivery-partner chat · tickets · calls · review bursts · dark-store/pincode tag · issue-type
Min sample: >= min-order-floor for the catchment in the window
Baseline period: trailing same-weekday-hours per (dark_store × issue_type), sale-excluded; peer-relative control
Confidence: High if peer stores flat + corroboration + perishable/food-safety language multiplier
Impact: complaint-adjusted GMV-at-risk / contribution-margin per store [TIER-3 → MB1] (#1 bridge)
FP checks: high-volume store generating more raw complaints (normalisation rules out); city-wide surge (peer-relative rules out)
Routing: "dark-store-outbreak" → City/Dark-store Ops (O-2); CX-detected, Ops-actioned seam; DRAFT + approve
Edge cases: hierarchy fallback to city baseline if a new store has no baseline (cold-start); NER quality on store/pincode tags
Honesty line: detection interaction-only; GMV/margin needs MB1 feed
```

### T2-3 — Perishable / expiry radar (FSSAI) — C-5,C-4 → bridge MB2
```
Behaviour type: SPARSE (mostly zero, rare high-impact — precision over recall)
Formula: spoilage/expiry language clusters above catchment baseline; distinct routing to food-safety
Pseudocode: flag if expiry_language_cluster > poisson_rarity_threshold AND dark_store concentrated
Feeds: return-reason text · complaint text · category tag · dark-store tag
Min sample: every non-zero meaningful (SPARSE); concentration check
Confidence: precision-first (a missed spoilage cluster is worse than a false alarm); band shown
Impact: RTO/refund cost + FSSAI risk exposure [TIER-3 → MB2] (node halt + FSSAI shield)
FP checks: isolated single complaint suppressed; requires node concentration
Routing: "perishable-failure" → Food-safety + Hygiene (O-2); DRAFT halt recommendation + approve
Compliance: FSSAI shelf-life/hygiene; cohort/catchment-level (live anchor: Zepto Dharavi suspension Jun 2025)
```

### T2-5 — Seller / brand trust-erosion (+ new-seller watch) — C-6,O-5 → bridge MB4
```
Behaviour type: BURSTY (text-leading-metric early-warning)
Formula: authenticity/defect/misship language clusters on a seller/SKU family ahead of returns/rating
Pseudocode: flag if entity_text_cluster breaks baseline AND velocity > lagging-metric move AND not(review_manipulation per O-5)
Feeds: reviews · return-reason text · tickets · seller/brand tag
Sub-trigger: new seller — monitor first ~200 interactions, flag before the return rate builds
Confidence: guarded against review-manipulation contamination (T2-7); entity-resolution quality is the dependency
Impact: conversion + returns + seller-health "trust tax" [TIER-3 → MB4]; counterfeit liability [TIER-3 → MB5]
Routing: "seller-trust-erosion" → Seller-Brand Partnerships + T&S; action GATED to risk review; DRAFT + approve
```

### T2-10 — Dark-pattern / regulatory-exposure scan — C-7,C-3 → bridge MB10
```
Behaviour type: BURSTY theme (4-source)
Formula: complaint/review clusters match a named instrument (drip pricing, basket sneaking, MRP/expiry, CoO, refund-timeline) vs live fact patterns
Pseudocode: flag if semantic_cluster matches fact_pattern_library AND named_instrument_match AND corroborated
Feeds: complaint/review text · surface/flow reference · dark-pattern classification
Confidence: High on named-instrument match (not a loose keyword); semantic clustering + fact-pattern library
Impact: regulator-ready evidence + refund cost [TIER-3 → MB10]
Compliance: CCPA Dark Patterns 2023 (13 patterns) · CP E-Commerce Rules 2020 · Legal Metrology 2011.
  Verified anchors only: Zepto ₹7 lakh (CCPA order 4 Dec 2025 — drip pricing AND basket sneaking; under NCDRC stay since 20 Jan 2026); PhysicsWallah ₹5 lakh (pre-ticked ₹10 box). DPDP ceiling ₹250 crore/violation.
Routing: "regulatory-exposure" → internal Legal/Compliance ONLY (operator's own breach stays inside); DRAFT + approve + audit
FP checks: keyword-only matches suppressed; requires corroboration + named-instrument match
Honesty line: allegation surfaced from corpus; the confirmed checkout/listing state needs the Phase-2 feed (MB10)
```

### T2-11 — Statutory-grievance & SLA-breach predictor — C-8 → bridge MB22
```
Behaviour type: SPARSE/event (clock-triggered, low FP — trigger is explicit)
Formula: an interaction nears the 48h ack / one-month redressal (CP Rules) or DPDP 90-day erasure (Rule 14) while stalled; regulatory keywords override time-waiting routing
Pseudocode: flag if clock_proximity < threshold AND stall_state across touches; if statutory_keyword present → override queue
Feeds: grievance timestamps · statutory-keyword tags · request type · contact threading
Confidence: high (explicit trigger = clock + keyword); a re-ranking layer ticketing systems lack
Impact: avoided penalty + grievance-handling cost [TIER-3 → MB22]
Compliance: CP E-Commerce Rules 2020; DPDP Rules 2025 (90-day erasure, 72h breach notice, ₹250 crore/violation). The full-coverage audit log IS the compliance feature.
Routing: "statutory-breach" → Nodal/Grievance officer; DRAFT priority alert + audit trail attached + approve
```

### T2-14 — AI-agent / chatbot quality monitor — C-3,O-4 → bridge MB21
```
Behaviour type: DENSE (containment rate) + BURSTY (novel failure pattern)
Formula: new failure pattern / containment-rate drop / cause-fork in bot transcripts breaks baseline
Feeds: bot transcripts · containment/handoff flags · CSAT-after-bot · intent
Confidence: strong detectability on transcript text; reusable across any operator running a CX bot
Impact: quality-adjusted containment cost + downstream trust [TIER-3 → MB21] (containment that backfired)
Routing: "bot-quality" → AI-ops/conversation-design; GATE any prompt/flow change; DRAFT + approve
```

### T2-15 — FCR / repeat-contact root-cause — C-2,C-6 → bridge MB9
```
Behaviour type: DENSE (repeat-rate per intent)
Formula: repeat-contact rate on an intent breaks baseline; cluster the drivers (Pareto)
Feeds: contact threading · resolution status · intent
Confidence: intent-clustering quality; low FP with normalisation. ~30% repeat can hide behind a strong NPS.
Impact: cost-to-serve + downstream churn [TIER-3 → MB9]
Routing: "repeat-cause" → process owner for the intent (NOT back to the contact queue); DRAFT + approve
```

### T2-20 — Complaint-volume-suppression watchdog (the WOW wedge) — C-2,C-9
```
Behaviour type: DENSE inverse-anomaly (a FALLING normalised metric flagged as a warning)
Formula: a drop in contact/ticket volume that, normalised to order volume, coincides with a support-access change (buried entry point, added friction) rather than a genuine quality improvement
Pseudocode: flag if normalised(contact_per_order) drops AND support_access_event present AND not(quality_improvement_corroborated)
Feeds: contact volume · order-linkage key · support-entry-point/version events
Confidence: novel, defensible; only an order-normalised baseline watching access-friction catches it
Impact: silent retention loss [TIER-3 → MB23] (prices the SUPPRESSED contacts — distinct from MB9 which prices repeat)
Compliance: deliberately obstructing complaint access edges into dark-pattern/grievance-obstruction; cohort-level
Routing: "suppression-warning" → CX Ops + Product (flag as a warning, NOT a win); DRAFT + approve
Honesty line: the wedge — the cleanest demonstration a CX metric and a P&L outcome can point opposite ways
```

### Bridge tiles (Phase 2, C-11) — MB1, MB4, MB8, MB17 — `bridge-ready`, never run as live in Phase 1
```
MB1  dark-store complaint cohort ⨝ SLA/ops + GMV feed → complaint-adjusted GMV-at-risk / contribution margin per store. [4-source] #1 hero. Cohort-level.
MB4  seller trust-erosion cohort ⨝ conversion + return + seller-health → seller "trust tax" dollarised.
MB8  refund-friction narrative cohort ⨝ refund-completion lag + 30/60/90-day repeat → which refunds kill repeat vs delay cash.
MB17 defect-severity (text) ⨝ cohort LTV band → economically-rational appeasement. HEAVIEST compliance flag: cohort-banded, transparent, human-approved, proxy-audited; insight permissible, differential action GATED.
Honesty line (all): labelled "bridge-ready (lights up with transaction feed)"; never shown as if it ran on interaction data alone.
```

---

## 6. Edge cases (per unit, from the methodology register §D)

- **Sale contamination** — every baseline is sale/event-excluded (T2-1, T2-2, T2-14 especially; a festival surge must not look like a failure). MB15-style peak windows use the scaling-factor approach.
- **Cold-start cluster** — a new dark-store/seller with no baseline falls back to the city/category parent baseline (T2-2 new store; T2-5 new seller uses the first-~200-interaction onboarding window).
- **Sparse-cell risk** — low-volume SKUs phased to high-volume entities first (T2-6); SPARSE Poisson handling for T2-3/T2-11.
- **Classification drift** — >20% distribution shift trips a stability monitor (theme taxonomy evolves).
- **Alert fatigue** — alerts over budget → multi-layer suppression; correlated alerts at the same time → root-cause grouped (a gateway change firing T2-1 + T2-17 together).
- **Data-quality** — <90% NER completeness on store/pincode tags pre-validates before T2-2/T2-3 fire.
- **Safe-middle dominance / saturation** — minimum-buffer handling so a near-flat metric does not over-alert.

---

## 7. KPI definitions (plain formula + source fields; checked against the persona vocabulary)

| KPI | Formula | Source fields | Persona served | Type |
|---|---|---|---|---|
| Contact-per-order | contacts ÷ orders, per cell | Interaction.order_linkage_key, Order.id | Head of CX | diagnostic (north-star denominator) |
| NPS / CSAT / DSAT | survey/review scores vs baseline | Interaction.sentiment_score, survey | Head of CX | north-star |
| FCR | first-contact-resolved ÷ contacts, per intent | Interaction.resolution_status, intent | Head of CX | north-star |
| Repeat-contact rate | repeat contacts ÷ contacts, per intent | Interaction.contact-threading | Head of CX | north-star |
| SLA breach share | grievances breaching ack/resolution ÷ total | Grievance.statutory_clock, SLA clocks | Head of CX / Nodal | diagnostic |
| Containment / CSAT-after-bot | bot-contained ÷ bot-handled; CSAT post-bot | bot transcripts, CSAT-after-bot | Head of CX / AI-ops | diagnostic |
| Theme/negative-review velocity | Δ(theme or neg-review count)/time, normalised | timestamps, entity tags | Head of CX | diagnostic |
| Statutory-clock exposure | grievances within X of a statutory deadline | Grievance.deadline_at, stall_state | Head of CX / Nodal | diagnostic |
| **Complaint-adjusted GMV-at-risk** `[P2]` | normalised complaint composite × cohort GMV | Signal cohort ⨝ TransactionRow.gmv | P&L owner | wedge / pre-wired |
| **Seller trust-tax** `[P2]` | conversion loss + return cost + seller-health drag | Signal ⨝ conversion/returns/seller-health | P&L owner | wedge |
| **Refund→repeat loss** `[P2]` | repeat-purchase delta by refund experience | Signal ⨝ refund-ledger + 30/60/90 repeat | P&L owner | wedge |
| Avoided penalty `[P2]` | grievance caught pre-NCH × penalty exposure | Signal ⨝ grievance outcomes | Head of CX / Compliance | wedge |

---

## 8. Capability boundary

- **Consumes:** the operator's interaction corpus (owns it at full coverage) and `[Phase 2]` a minimal order/returns/fulfilment/seller-summary feed (read-only, cohort-level).
- **Owns:** the interaction/voice/complaint corpus, the baselines, the insight store, the audit log.
- **Never owns:** the lakehouse / system of record; never auto-fires a customer or compliance action; never files regulatory evidence itself; never joins at identity level. Every action is **draft → human approves → audit-logged**; every AI element carries the sparkle marker; every text card shows a **confidence band, not a verdict**.

**Feeds:** Stage 6 (KPIs + C-/O- codes for the Goal→Capability→UI table), Stage 8 (entities + data shape), Stage 9A (comparison basis), Stage 9B (unit conditions + payload fields).
