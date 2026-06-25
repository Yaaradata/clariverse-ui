# LiSN Retail · Phase 1 · Stage 2 — Use-Case-Level Merge (recall-first)
## Sources merged: **Opus · Gemini · GPT-5 · Perplexity** (four engine runs) · merged IDs `MA*` (Bucket A) / `MB*` (Bucket B)

> Merge **use-case candidates**, never research. Inputs were the four per-source Stage 1 catalogues, kept separate. Recall before precision — a near-duplicate is carried, never collapsed; a single-source card that is commercially interesting is preserved, never averaged away. Ranking happens **only here**, on a complete longlist, and never prunes it.

---

### Method note (so Stage 3 inherits the framing)
- **Stage identity.** Skill **Stage 2 — use-case-level merge**. This is the only place a cross-engine map is needed; there is no separate reconcile step and nothing here was mined from a compressed map — each engine's raw Stage 1 catalogue was read in full.
- **Inverted Phase-1 substrate (carried from mining).** **Bucket A** = cards deliverable on the interaction corpus today → bridge status `CX-only (ships in pilot)`. **Bucket B** = net-new interaction × transaction joins → bridge status `bridge-ready (lights up with transaction feed)`. In this inverted frame the deduplication key's "needs the substrate × voice join" reads as **"needs the transaction feed?"** — No for Bucket A, Yes for Bucket B.
- **Convergence recomputed, not inherited.** `[N-source]` tags below were recomputed against what actually appears across the four runs — engines' own self-applied tags were not trusted (conventions §2).
- **Perplexity arrived in research-report form, not the mined Bucket-A/B template.** Its discrete use cases (F1-1…F1-5, F2-1…F2-5, plus the A-section KPI→P&L bridges and C-section never-made-joins) were extracted and mapped into the merge. Its substance is fully captured; several Perplexity items carry research-grade framing rather than the full pipeline template (aggregation → baseline → detection → distillation → routing) and would reach card-grade with a light mining pass. This is a **process** note, not a recall gap (see Coverage check §A).
- **Brand:** LiSN · British "distil" · "who" not "that" · "cost-efficient at scale" · no exclamation marks · India primary.

### The cross-engine spine at a glance (where the four runs genuinely converge)
| Merged card | Convergence | Constituent source cards |
|---|---|---|
| **MB1** Dark-store complaint → SLA/ops → GMV/contribution-margin | **[4-source]** | Opus B2 · GPT5 B1 · Gemini B1 · Perplexity F2-2 |
| **MA6** Statutory-grievance & SLA breach predictor | **[4-source]** | Opus A12 · Gemini A1 · GPT5 A3 · Perplexity A3/B2 |
| **MA4** Dark-pattern / regulatory-exposure (theme) | **[4-source theme]** | Opus A4 · Perplexity F1-3 (+ Gemini A2 · GPT5 A4 as the regression flavour MA5) |
| **MA2** Dark-store operational-failure (interaction-side) | **[3-source]** | Opus A2 · GPT5 A1 · Perplexity B1 (Gemini bridge-side) |
| **MA12** AI-agent / chatbot quality monitor | **[3-source]** | Opus A13 · Gemini A4 · GPT5 A5 |
| **MA5** Post-release dark-pattern / UX regression detector | **[3-source]** | Gemini A2 · Gemini A5 · GPT5 A4 |
| **MB4** Seller/SKU trust-tax bridge | **[3-source]** | GPT5 B2 · Perplexity F2-1 · Opus B3 (partial) |
| **MB15** Peak-event → operational/seller cause → GMV-at-risk | **[3-source]** | Opus B11 · Gemini B8 · Perplexity B3-event |
| **MA1** Cross-channel emerging-issue radar (spine) | **[3-source]** | Opus A1 · GPT5 A8 · Perplexity F1-1/F1-2 |

Everything else is 2-source, or a preserved single-source gem (15 of them — the long tail this merge exists to protect).

---

# 1 · LONGLIST — the complete merged use-case universe (exhaustive; never pruned)

Columns: **ID · Name · Archetype · Primary user → routed exec · Source support · Geo · Needs txn feed? · Source IDs · MVP suitability · Flags**

## Bucket A — `CX-only (ships in pilot)` · interaction corpus (22 distinct use cases)

| ID | Name | Archetype | User → exec | Support | Geo | Txn feed? | Source IDs | MVP | Flags |
|---|---|---|---|---|---|---|---|---|---|
| **MA1** | Cross-channel corroborated emerging-issue radar (spine / home tile) | Novel-emergence detection + distillation + routing | CX/VoC Head → owning function | [3-source] | India | No | Opus A1 · GPT5 A8 · Perp F1-1/F1-2 | Ships now — hardest part: cross-source theme alignment | Spine card · latency bar US Pat 7,899,769 |
| **MA2** | Dark-store operational-failure / outbreak card | Denominator-normalised geographic anomaly + cross-channel corroboration | CX/VoC Head → City/Dark-store Ops | [3-source] | India (q-comm) | No | Opus A2 · GPT5 A1 · Perp B1 | Ships now | CX-detected, Ops-actioned (org seam) |
| **MA3** | Seller/brand quality & trust-erosion card (+ new-seller-onboarding watch) | Entity-level early-warning from text before structured metric moves | CX/VoC Head → Seller-Brand Partnerships + T&S | [2-source] (+1 sub) | India | No | Opus A3 · GPT5 A2 · Perp F1-4 (sub) | Ships now | New-seller watch [single — Perp] preserved |
| **MA4** | Dark-pattern / regulatory-exposure scan (substantive, continuous) | Compliance-pattern detection → named instrument + auditable evidence | CX/VoC Head → Legal/Compliance | [2-source] (theme 4) | India + global ref | No | Opus A4 · Perp F1-3 | Ships now | Compliance hero · may surface operator's own breach |
| **MA5** | Post-release app-flow / dark-pattern & UX-confusion regression detector | Release-event-triggered emergent-confusion / regression detection | CX/VoC Head → Product (+ Legal) | [3-source] | India | No | Gemini A2 · Gemini A5 · GPT5 A4 | Ships now | App-version-correlation = the FP control; UX-navigation sub-variant noted |
| **MA6** | Statutory-grievance & SLA breach predictor (procedural clock + DPDP 90-day) | Obligation-clock monitoring with breach-risk alerting | CX/VoC Head → Nodal/Grievance officer | **[4-source]** | India | No | Opus A12 · Gemini A1 · GPT5 A3 · Perp A3/B2 | Ships now | High-certainty · routing-override on regulatory keywords |
| **MA7** | Refund-friction / promise-breaker radar | Refund-narrative anomaly with consumer-protection exposure | CX/VoC Head → Refund/Payments Ops + Compliance | [2-source] | India | No | GPT5 A3 · Perp A6 | Ships now | GPT-5 gem · NCH-anchored |
| **MA8** | Cancellation / return-reason free-text radar | Early-cause detection from free text ahead of structured codes | CX/VoC Head → Category + Catalogue/Seller | [2-source] | India | No | Opus A5 · Perp C1/F2-3 (signal-side) | Ships now | Text leads codes |
| **MA9** | Weight-and-pack / MRP-mismatch card (Legal Metrology) | Quantity/pricing-disclosure complaint scan | CX/VoC Head → Catalogue + Legal Metrology + Seller | [single→2] | India | No | GPT5 A7 · Perp E6 | Ships now | [single-source — preserve] · sub-variant of MA8, distinct regulator |
| **MA10** | Per-SKU / per-seller rating-velocity break detector | Velocity anomaly on a single entity (before star average moves) | CX/VoC Head → Category + Seller/Catalogue | [2-source] | India | No | Opus A7 · Perp A5 | Ships now | Fires on velocity not lagging average |
| **MA11** | Social-virality early-warning + regulator-relevant pattern | Real-time external-channel detection, asymmetric-cost framing | CX/VoC Head → PR/Brand + Legal | [2-source] | India + global ref | No | Opus A8 · Perp A7 | Ships now | **Highest FP risk of any card** · strictest threshold + human gate |
| **MA12** | AI-agent / chatbot quality & emerging-failure monitor | Automation-health anomaly (novel failure / containment-quality / cause-fork) | CX/VoC Head → AI-ops / conversation-design | [3-source] | India | No | Opus A13 · Gemini A4 · GPT5 A5 | Ships now | High cross-retailer reuse |
| **MA13** | Perishable / expiry-complaint radar (FSSAI-anchored) | Category-specific compliance-and-quality clustering | CX/VoC Head → Dark-store hygiene + Food-safety | [2-source standalone] | India (q-comm) | No | Opus A9 · Perp E5/B1 | Ships now | [long-tail — preserve] · distinct FSSAI routing |
| **MA14** | Substitution-failure complaint radar (q-commerce) | Failure-mode clustering routed to a non-obvious owner | CX/VoC Head → Catalogue / substitution-logic owner | [single-source] | India (q-comm) | No | Opus A11 | Ships thin now (stronger as a bridge) | [single-source — preserve] · routes to logic owner, not store Ops |
| **MA15** | Complaint-volume-suppression watchdog (the "good metric is bad" card) | Inverse-anomaly — a *falling* metric flagged as a warning | CX/VoC Head → CX Ops + Product | [single-source] | India | No | Gemini A7 | Ships now | [single-source — preserve] · **the sharpest CX-vs-P&L seam articulation** |
| **MA16** | Buyer-fraud claim-pattern detector | Abuse-pattern detection on claims, human-gated | CX/VoC Head → Trust & Safety / Ops | [single-source] | India | No | Gemini A8 | Ships now | [single-source — preserve] · **compliance-sensitive** · review-only, never auto-deny |
| **MA17** | Review-manipulation / bot-bombing / fake-review detector | Integrity-protection anomaly on public sentiment | CX/VoC Head → T&S + Marketing/PR | [2-source] | India + global ref | No | Gemini A9 · Perp F1-5 | Ships now | [long-tail — preserve] · guards MA3/MA10 from contamination |
| **MA18** | Vernacular sarcasm & neutral-sentiment classifier | Semantic-quality classification + routing | CX/VoC Head → routing engine (senior vs automation) | [single-source] | India | No | Gemini A3 | Ships now | [single-source — preserve] · the multilingual-accuracy ceiling (~90.69% binary); cross-cuts every text card |
| **MA19** | Payment-failure ("deducted, not confirmed") detector | High-severity transaction-failure emergent detection | CX/VoC Head → Payments + CX (reconciliation) | [single-source] | India | No | Gemini A6 | Ships now | [single-source — preserve] · theme recurs as a radar instance in Opus A1 / GPT5 A8 |
| **MA20** | Medicine-compliance exception card | Regulated-category compliance-exception scan | CX/VoC Head → Compliance + Pharmacy/Category | [single-source] | India (q-comm) | No | GPT5 A6 | Ships now | [single-source — preserve] · pharmacy/q-commerce gem |
| **MA21** | Theme-velocity-vs-order-growth detector | Denominator-normalised growth-relative anomaly | CX/VoC Head → Category + theme owner | [single-source] | India | No | GPT5 A9 | Ships now | [single-source — preserve] · the FP-control discipline that makes every card credible to the P&L owner; shared with Perp Pattern-2 |
| **MA22** | FCR / repeat-contact root-cause card | Repeat-driver clustering + process-owner routing | CX/VoC Head → process owner for the intent | [2-source] | India | No | Opus A6 · Perp A4 | Ships now | Pareto tile · ~30% repeat can hide behind strong NPS |

## Bucket B — `bridge-ready (lights up with transaction feed)` · interaction × transaction join (24 distinct use cases)

> In Phase 1 these ship as **tagged, join-ready tiles** (visible, never smuggled in as if they ran on interaction data alone). MVP column = feasibility of the join once the feed arrives.

| ID | Name | Archetype | User → exec (P&L) | Support | Geo | Txn feed? | Source IDs | MVP | Flags |
|---|---|---|---|---|---|---|---|---|---|
| **MB1** | Dark-store complaint-anomaly → SLA/ops → GMV/contribution-margin | Operational-failure attribution to margin (the q-comm bridge hero) | CX/VoC Head → City/Dark-store Ops + Category (margin, reorder) | **[4-source]** | India (q-comm) | Yes | Opus B2 · GPT5 B1 · Gemini B1 · Perp F2-2 | High once keyed | **#1 cross-engine card** · "purest q-commerce differentiator" |
| **MB2** | Hyperlocal perishability failure → node halt + FSSAI shield | Geographic-concentration join → operational halt + regulatory shield | CX/VoC Head → Dark-store Ops + Food-safety (RTO, FSSAI risk) | [2-source standalone] | India (q-comm) | Yes | Gemini B1 · Opus A9/B2 | High when concentration sharp | Hero "48 of 50 from one node"; distinct decision (halt) + regulator (FSSAI) |
| **MB3** | Review-rating/sentiment drop → conversion → GMV | Cross-domain causal attribution (voice → revenue), single-SKU | CX/VoC Head → Category/Growth (conversion, GMV) | [2-source] | India | Yes | Opus B1 · Perp F2-4 | Medium-high (confound control) | Cleanest "voice explains GMV" story · 0.5★ → 3–5% conversion |
| **MB4** | Seller/SKU trust-tax bridge | Trust-failure join → conversion/returns/seller-health dollarisation | CX/VoC Head → Seller-Brand Partnerships + Category | [3-source] | India | Yes | GPT5 B2 · Perp F2-1 · Opus B3 (partial) | Medium-high | Action gated to risk review |
| **MB5** | Counterfeit / not-as-described → seller payout/history → gated liability action | Authenticity allegation → seller-transaction evidence → gated action (brand-vs-rogue-seller) | CX/VoC Head → T&S + Seller + Legal (liability, payout) | [2-source] | India | Yes | Opus B12 · Gemini B4 | Medium | **Differential action — human + risk review** · Gemini's brand-vs-rogue-seller disambiguation |
| **MB6** | Cancellation/return free-text → return codes → category sourcing / listing-quality + seller-health | Free-text-to-structured reconciliation with margin attribution | CX/VoC Head → Category + Seller-Brand Partnerships | [2-source] | India | Yes | Opus B3 · Perp F2-3 | High | Best worked example (sizing fix → 2,200 fewer returns/mo) |
| **MB7** | Complaint/detractor cohort → repeat-purchase / CLV | Cohort voice → retention/CLV attribution (the Bain logic) | CX/VoC Head → Growth/Retention + Category | [2-source] | India | Yes | Opus B4 · Perp A2 | Medium (lagged, cohort) | **Cohort-level only** (conventions §6) · carries Bain/Dell economics |
| **MB8** | Refund-friction → 30/60/90-day repeat-purchase loss | Refund-experience join → retained-revenue causal bridge (short window) | CX/VoC Head → Refund/Payments Ops + Growth | [single-source, strong] | India | Yes | GPT5 B3 (Opus B8 adjacent) | High (short, direct) | **GPT-5 gem** · "which refunds kill repeat vs merely delay cash" |
| **MB9** | Repeat-contact intent → cost-to-serve + downstream churn → opex + retention | Repeat-driver → opex-and-retention quantification (bridge of MA22) | CX/VoC Head → CX Ops + Growth | [2-source] | India | Yes | Opus B8 · Perp A4 | Medium | The business case that justifies acting on MA22 |
| **MB10** | Dark-pattern allegation → confirmed checkout/listing state → regulator-ready evidence + refund cost | Allegation → actual-state proof → regulator-ready evidence + cost | CX/VoC Head → Legal/Compliance | [2-source] | India | Yes | Opus B5 · Perp E2/F1-3 (bridge) | Medium (historical UX state) | Compliance bridge · PhysicsWallah fact pattern |
| **MB11** | Drip-pricing / fee complaint → conversion/cart-abandonment → revenue-bleed (net) | Dark-pattern complaint → conversion-loss proof / net economics | CX/VoC Head → Product + Pricing + Legal | [2-source] | India | Yes | Gemini B3 · GPT5 B4 | Medium-high (clean A/B) | "your fee bleeds more than it earns" + GPT-5 "net not gross" |
| **MB12** | OOS / availability complaint → stock-out feed → lost GMV (+ review-compounding) | Availability-gap complaint → lost-sales quantification | CX/VoC Head → Category + Supply/Replenishment | [2-source] | India | Yes | Opus B7 · Gemini B9 | Medium (counterfactual) | Gemini's "OOS does double damage" (lost sale + future PDP suppression) |
| **MB13** | Social-virality spike → refund/RTO + acquisition cost | Virality → financial-impact attribution (CMO/CFO visibility) | CX/VoC Head → Brand/Finance | [2-source] | India | Yes | Opus B6 · Perp F2-5 | Low-medium (attribution noise) | [weak-evidence] each · ship later, lower-confidence band |
| **MB14** | Price/packaging/policy change → complaint+cancellation → conversion/cancellation cost | Controlled before/after attribution of an operator-side decision | CX/VoC Head → change owner (Pricing/Catalogue/Policy) + Category | [single-source] | India | Yes | Opus B10 | Medium-high (clean boundary) | [single-source — preserve] · "did our own change hurt us" |
| **MB15** | Peak-event (sale/festival/launch/weather) → operational/seller cause → GMV-at-risk | Peak-window disambiguation (surge vs genuine failure) | CX/VoC Head → War-room: Ops + Seller + Category | [3-source] | India | Yes | Opus B11 · Gemini B8 · Perp B3-event | Medium (peak noise) | Incl. Gemini weather-appeasement economics (cross-ref MB17) |
| **MB16** | Delivery-promise credibility by zone | Promise-believability join (beyond raw SLA) | CX/VoC Head → City/Dark-store Ops + Category | [single-source] | India (q-comm) | Yes | GPT5 B5 | Medium-high | **GPT-5 gem** · "promise no longer believed" ≠ SLA breach |
| **MB17** | Defect-cost-vs-LTV differential appeasement | Voice-severity × customer-value join → economically-rational action | CX/VoC Head → CX Ops + Risk (cohort LTV vs margin) | [single-source] | India | Yes | Gemini B2 | Low-medium (gated) | **Gemini gem · heaviest compliance flag in the catalogue** |
| **MB18** | Silent-friction reorder suppression ("don't delist, fix the pump") | Chronic-low-volume voice join → demand-forecasting correction | CX/VoC Head → Category + FMCG brand/seller | [single-source] | India | Yes | Gemini B5 | Medium (faint signal) | **Gemini gem** · saves a profitable line a txn-only view kills |
| **MB19** | Device-based price-discrimination audit | Cross-channel outrage join → margin-vs-toxicity monitor | CX/VoC Head → Pricing + Legal + Brand | [single-source] | India | Yes | Gemini B6 | Medium (vs A/B noise) | **Gemini gem** [weak-evidence] · audits a deliberate P&L lever (politically charged) |
| **MB20** | Geographic-vs-catalogue concentration-disambiguation engine | The reusable concentration-resolution mechanism (node-vs-network) | CX/VoC Head → Ops *or* Category/Brand (routing fork) | [single-source] | India | Yes | Gemini B7 | Medium-high (NER quality) | **Gemini gem** · the reusable cross-retailer IP behind MB1/MB2/MB5 |
| **MB21** | Bot-containment → seller/category trust damage | Containment-quality join (cheap interaction damages high-value entity) | CX/VoC Head → CX Ops + Seller-Brand Partnerships | [single-source] | India | Yes | GPT5 B7 | Low-medium | **GPT-5 gem** [weak-evidence] · "containment that backfired" (bridge of MA12) |
| **MB22** | Complaint → NCH/formal-grievance escalation prediction | Regulatory-escalation prediction join | CX/VoC Head → Compliance + offending function | [single-source] | India | Yes | GPT5 B8 (+ Perp NCH anchor) | Medium (needs outcome labels) | **GPT-5 gem** · "catch it before it becomes an NCH grievance" |
| **MB23** | Support-suppression → silent-retention-loss | The inverse-metric conflict, quantified as a bridge | CX/VoC Head → Product + Growth (LTV vs Opex saved) | [single-source] | India | Yes | Gemini B10 | Medium | **Gemini gem** · proves MA15's suspicion (prices *suppressed* contacts, vs MB9 *repeat*) |
| **MB24** | Catalogue-disclosure non-compliance → CX damage | Disclosure-compliance join → revenue/returns dollarisation | CX/VoC Head → Catalogue + Compliance + Seller | [single-source] | India | Yes | GPT5 B6 (+ Perp GS1/E6) | Medium | **GPT-5 gem** · imported-flag / country-of-origin (1 Jul 2027) revenue drag |

**Longlist totals:** 22 Bucket A + 24 Bucket B = **46 distinct merged use cases.** 15 are single-source and explicitly preserved.

---

# 2 · RANKED SHORTLIST (top 12)

Scored 1–5 on **Impact · Underserved-ness · Differentiation** (substrate-visible low → interaction-visible mid → **join-does-not-exist** high) **· Cross-engine convergence · MVP feasibility** (inside the platform boundary) **· Regulatory pull**. Per the scoring rule the shortlist is biased toward join cards where scores are close; it is balanced across the **pilot spine (Bucket A, ships now)** and the **wedge (Bucket B, tagged tiles that win the expansion)**. Where a single-source gem ranks below its strategic weight, that is noted — raw convergence under-scores exactly the long tail the recall mandate protects.

---

### 1 · MB1 — Dark-store complaint-anomaly → SLA/ops → GMV / contribution-margin · **27/30** · Bucket B
- **Signal:** a denominator-normalised dark-store complaint composite (missing/wrong/expired/late/refund) time-aligns with an SLA-breach + cost spike in ops telemetry.
- **Why it beats a dashboard:** the complaint corpus and the SLA/ops telemetry live in different orgs; joined at signal level they explain a reorder-rate and margin movement neither side can see alone. Interaction tools say a zone is noisy; finance/warehouse tools say a zone is big — only the join says whether a burst is economically trivial or a margin-threatening failure in a high-value catchment.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** "Dark store D07, Koramangala is destroying ₹X in contribution margin per week because its 6pm–10pm slot generates 40% more repeat contacts than the city average" `[illustrative]` (Perplexity's framing; Q-commerce monthly churn 47.35%, 30–50% lower 180-day LTV for unresolved issues).
- **Named UI hero:** the **"complaint-adjusted GMV-at-risk" dark-store card** (store × issue-type, dollarised).
- **Regulatory hook:** spoiled/expired components carry FSSAI exposure; catchment/cohort-level, never identity-level.
- **Score:** Impact 5 · Underserved 5 · Differentiation 5 · Convergence 5 (4-source, the only one) · MVP 3 (bridge-ready) · Regulatory 4.

### 2 · MA2 — Dark-store operational-failure / outbreak card · **26/30** · Bucket A (ships now)
- **Signal:** a catchment's order-volume-normalised issue rate breaks its own baseline while peers hold flat, with cross-channel corroboration before escalation.
- **Why it beats a dashboard:** complaints sit in the helpdesk, not in Ops; no self-built ops dashboard ingests the complaint corpus at signal level or baselines per store. Warehouse dashboards show flat SLA while "missing coriander" complaints rise from picker/pack/substitution causes the corpus catches first.
- **Differentiation:** interaction-visible, ships now (3); the GMV/margin join is MB1.
- **Best worked example:** "spoiled product" + "missing item" language spikes across a Hyderabad pincode cluster at ~6× the catchment's baseline complaints-per-order while neighbours hold flat `[illustrative]`; corroboration across tickets, calls and one review burst clears the bar; routed to City Ops within the shift.
- **Named UI hero:** the **catchment outbreak map** (normalised, peer-relative heat tile).
- **Regulatory hook:** spoiled/expired bursts carry FSSAI exposure; cohort/catchment-level.
- **Score:** Impact 5 · Underserved 4 · Differentiation 3 · Convergence 5 (3-source) · MVP 5 · Regulatory 4. *The interaction-side anchor of the pilot's q-commerce story; MB1 is its bridge.*

### 3 · MA6 — Statutory-grievance & SLA breach predictor · **26/30** · Bucket A (ships now)
- **Signal:** an interaction approaches the 48-hour acknowledgement or the DPDP data-request clock while stalled across touches; regulatory keywords ("legal action", "delete my data") override time-waiting routing.
- **Why it beats a dashboard:** ticketing systems queue linearly by time-waiting and do not parse text for statutory risk; this re-prioritises by financial/regulatory risk with full-coverage auditable evidence.
- **Differentiation:** interaction-visible, ships now (3).
- **Best worked example:** a "delete my data" request stalls across three touches near the DPDP clock while a separate cluster nears the 48-hour acknowledgement limit `[illustrative]`; LiSN overrides routing and drafts a priority alert to the compliance queue.
- **Named UI hero:** the **"approaching statutory breach" priority tile** that overrides time-waiting routing.
- **Regulatory hook:** CP E-Commerce Rules 2020 (48-hour / one-month); DPDP Rules 2025 (90-day grievance); the NCH convergence-partner reporting obligation makes audit-logged handling the deliverable. *(DPDP penalty figure carries an open conflict — see §4.)*
- **Score:** Impact 4 · Underserved 4 · Differentiation 3 · Convergence 5 (4-source) · MVP 5 · Regulatory 5. *Highest-certainty card; the compliance trust-builder.*

### 4 · MA4 — Dark-pattern / regulatory-exposure scan (substantive) · **26/30** · Bucket A (ships now)
- **Signal:** complaint/review clusters mapping to a specific regulatory instrument (drip pricing, basket sneaking, MRP/expiry, country-of-origin, refund-timeline), matched against live enforced fact patterns.
- **Why it beats a dashboard:** keyword filters miss novel patterns and cannot assemble defensible full-coverage evidence; this maps emergent allegations to live enforcement patterns and produces an auditable trail.
- **Differentiation:** interaction-visible, ships now (3).
- **Best worked example:** complaints alleging a pre-ticked add-on at checkout cluster and map to the CCPA basket-sneaking pattern — exactly the **PhysicsWallah** fact pattern (pre-ticked ₹10 box, ≈₹2.47 crore from 21,36,962 users, 63.9% opted out, ₹5 lakh penalty, 1 June 2026); LocalCircles found 21 of 26 "dark-pattern-free" self-declarations still showed them.
- **Named UI hero:** the **"regulatory-exposure" card** with the named instrument + auditable evidence count.
- **Regulatory hook:** CCPA Dark Patterns 2023 (13 patterns) · CP E-Commerce Rules · Legal Metrology · dark patterns cost Indian consumers ~₹28,000 crore/yr; routes to Legal, never external.
- **Score:** Impact 4 · Underserved 5 · Differentiation 3 · Convergence 5 (4-source theme) · MVP 4 · Regulatory 5. *Pairs with the regression detector MA5 and the evidence bridge MB10.*

### 5 · MB4 — Seller/SKU trust-tax bridge · **26/30** · Bucket B
- **Signal:** a trust-failure cluster (authenticity/defect/misship/not-as-described, from MA3) joins to seller-performance denominators, revealing whether it sits in a strategic seller or fast-growing SKU family.
- **Why it beats a dashboard:** CX-only systems cannot tell whether a one-star cluster is in a strategic seller; transaction-only systems cannot explain why conversion and returns moved.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** a one-star cluster joins to the seller's conversion + return-complaint rate + seller-health, revealing concentration in a strategic SKU family `[illustrative]`, quantifying the conversion/returns "trust tax" and a listing-suppression / seller-churn risk; Perplexity dollarises: return cost ₹180–240/unit × at-risk volume + GMV at risk from review suppression.
- **Named UI hero:** the **"trust tax" seller card** (conversion + returns + churn risk).
- **Regulatory hook:** marketplace product-liability + seller-disclosure; BIS IS 19000:2022 review-integrity; action gated to risk review.
- **Score:** Impact 5 · Underserved 5 · Differentiation 5 · Convergence 5 (3-source) · MVP 3 · Regulatory 3.

### 6 · MB10 — Dark-pattern allegation → confirmed checkout/listing state → regulator evidence + refund cost · **26/30** · Bucket B
- **Signal:** complaints alleging drip pricing / expiry-not-shown / MRP mismatch (from MA4) join to the offending checkout/listing state at the alleged time and the refund ledger.
- **Why it beats a dashboard:** the allegation is in the corpus, the offending state is in transaction/UX logs; the join produces auditable, regulator-ready evidence — LiSN drafts, human approves, all logged.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** the pre-ticked-box allegations join to the actual checkout state and the refund ledger, producing regulator-ready evidence and a quantified refund cost — the PhysicsWallah fact pattern made provable.
- **Named UI hero:** the **"allegation → confirmed-state → cost" evidence card**.
- **Regulatory hook:** CCPA Dark Patterns 2023 + Legal Metrology + CP Rules; can document the operator's own breach (route to Legal, never external).
- **Score:** Impact 4 · Underserved 5 · Differentiation 5 · Convergence 4 (3-source) · MVP 3 · Regulatory 5.

### 7 · MB2 — Hyperlocal perishability failure → node halt + FSSAI shield · **24/30** · Bucket B
- **Signal:** a "rotten / warm / expired" refund-text spike is geographically concentrated to a single dark-store node once joined to the dark-store tag and refrigeration telemetry.
- **Why it beats a dashboard:** an isolated CX tool sees 50 vegetable complaints and logs a generic supplier ticket; only the node tag reveals 48 of 50 came from one node where the freezer failed overnight, enabling an immediate localised halt.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** ~300 "rotten/smells/warm" complaints in two hours; the dark-store tag reveals 48 of 50 from a single Bengaluru node with an overnight freezer failure `[illustrative]`; LiSN drafts an immediate perishable-fulfilment halt, averting forced refunds and FSSAI exposure under the 45-day / 30%-shelf-life directive (Zepto Dharavi licence suspension, June 2025).
- **Named UI hero:** the **"48 of 50 from one node" perishability tile**.
- **Regulatory hook:** FSSAI shelf-life/hygiene; the draft-then-human-approve halt is the compliance feature.
- **Score:** Impact 4 · Underserved 4 · Differentiation 5 · Convergence 3 (2-source standalone) · MVP 3 · Regulatory 5. *Distinct from MB1 by decision (halt) and regulator (FSSAI); Gemini's most vivid hero.*

### 8 · MB8 — Refund-friction → 30/60/90-day repeat-purchase loss · **24/30** · Bucket B
- **Signal:** refund-ageing complaints and repeated "promised but not received" narratives (from MA7) join to actual refund-completion lag and the cohort's 30/60/90-day repeat.
- **Why it beats a dashboard:** complaint systems prove frustration, finance proves the refund happened; only the join shows which refund experiences **destroy** future demand rather than merely **delay** cash.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** refund-ageing + "coupon instead of cash" narratives join to completion lag and 30/60/90-day repeat `[illustrative]`; LiSN separates refunds that collapse repeat from those where repeat holds — anchored to NCH e-commerce refund grievances (8,919 grievances, ₹3.69 crore, 25 Apr–30 Jun 2025).
- **Named UI hero:** the **"which refunds kill repeat" card**.
- **Regulatory hook:** CP Rules refund execution + NCH exposure; cohort-level.
- **Score:** Impact 5 · Underserved 5 · Differentiation 5 · Convergence 2 (GPT-5 gem, single-strong) · MVP 3 · Regulatory 4. *Convergence under-scores it — the sharpest refund bridge of the four runs; resolves the goodwill-vs-discipline tension with a number.*

### 9 · MA1 — Cross-channel corroborated emerging-issue radar (spine) · **24/30** · Bucket A (ships now)
- **Signal:** a new theme breaks its own baseline across ≥2 independent channels near-simultaneously (cross-channel corroboration is the confidence gate).
- **Why it beats a dashboard:** single-channel tools see only their own slice; a self-built view cannot fuse the full corpus, baseline per-theme, or distil thousands of mentions to the few worth an exec's attention — 93% of CX leaders report fragmented feedback.
- **Differentiation:** interaction-visible, ships now (3); the cause→cost link is the Bucket B extension.
- **Best worked example:** an "app crashes at the UPI payment step" theme breaks across app-store reviews, care chat and X inside a ~6-hour window `[illustrative]`; LiSN distils ~1,900 raw mentions to one ranked card, inside the ~1-day window US Patent 7,899,769 claims and earlier than any single-channel tool.
- **Named UI hero:** the **"emerging now" ranked tile** (raw-mentions → signals ratio shown).
- **Regulatory hook:** full-coverage (not sampled) corpus + audit log is itself the compliance posture; never auto-fires.
- **Score:** Impact 5 · Underserved 5 · Differentiation 3 · Convergence 4 (3-source) · MVP 4 · Regulatory 3. *Score is mid because it is interaction-only and broad, but it is the **product's face** — the home tile every other card lives inside.*

### 10 · MB3 — Review-rating/sentiment drop → conversion → GMV · **21/30** · Bucket B
- **Signal:** a SKU rating/sentiment break (from MA10) time-aligns with a conversion decline for that SKU beyond its joint baseline.
- **Why it beats a dashboard:** CX sees the 3.6 stars; Growth sees the conversion dip; only joining them attributes the specific GMV movement to the specific review cause.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** an earbud rating break (dead-on-arrival batch) time-aligns with a measurable add-to-cart→purchase conversion drop `[illustrative]`; a 0.5★ drop can suppress conversion 3–5% on a high-GMV SKU.
- **Named UI hero:** the **"review → GMV" attribution card**.
- **Regulatory hook:** SKU/cohort-level; no protected-attribute proxy.
- **Score:** Impact 4 · Underserved 4 · Differentiation 5 · Convergence 3 (2-source) · MVP 3 · Regulatory 2. *The most legible "voice explains GMV" single-SKU story for the expansion narrative.*

### 11 · MA15 — Complaint-volume-suppression watchdog · **21/30** · Bucket A (ships now)
- **Signal:** a drop in complaint/ticket volume that coincides with a support-access change (a buried entry point, added friction) rather than a genuine quality improvement.
- **Why it beats a dashboard:** every conventional CX dashboard celebrates a ticket-volume drop; only a baseline normalised to order volume, watching for access-friction, can flag a good-looking number as silent churn.
- **Differentiation:** interaction-visible but a novel inverse-anomaly (4).
- **Best worked example:** weekly ticket volume in a category falls ~18% `[illustrative]`, but the drop coincides with a support-entry-point change that buried the chat button; LiSN flags it as a warning, not a win.
- **Named UI hero:** the **"falling metric, rising risk" alert** — the rare card that flags a number that looks good.
- **Regulatory hook:** deliberately obstructing complaint access edges into dark-pattern / grievance-obstruction; cohort-level.
- **Score:** Impact 4 · Underserved 5 · Differentiation 4 · Convergence 1 (single, Gemini) · MVP 4 · Regulatory 3. *Single-source, so under-scored — but this is **the cleanest articulation of the CX-vs-P&L seam across all four runs**, and the seam is the wedge. Its bridge is MB23. Strategic inclusion.*

### 12 · MB17 — Defect-cost-vs-LTV differential appeasement · **22/30** · Bucket B
- **Signal:** a minor packaging-damage complaint (semantic severity "annoyed but usable") joins to the customer's LTV band, producing a proportionate-appeasement recommendation.
- **Why it beats a dashboard:** the CX system cannot calculate LTV; the transaction system cannot gauge the nuanced severity of the text — only the join sizes a proportionate response.
- **Differentiation:** requires the join — does not exist today (5).
- **Best worked example:** a "dented cereal box, product fine" complaint joins to purchase frequency; for a high-LTV repeat buyer LiSN drafts a 100% refund, for a low-LTV/high-return account a polite partial credit `[illustrative]`.
- **Named UI hero:** the **"economically rational appeasement" card**.
- **Regulatory hook:** **the heaviest compliance flag in the catalogue (conventions §8)** — differential treatment by customer value risks fair-treatment/discrimination concerns and may proxy a protected attribute; cohort-banded, transparent, human-approved, with the low-LTV edge under heaviest scrutiny. Insight permissible; differential action gated.
- **Score:** Impact 4 · Underserved 5 · Differentiation 5 · Convergence 1 (single, Gemini) · MVP 2 (gated) · Regulatory 5. *Included for differentiation and as the catalogue's compliance stress-test; its MVP/convergence are low by design.*

**Runners-up (strong, just below the line):** **MA21** theme-velocity-vs-order-growth (19 — the FP-control discipline that makes every card credible to the P&L owner; arguably belongs in the build spine as plumbing rather than a tile) · **MA12** AI-agent quality monitor (21 — 3-source, high cross-retailer reuse) · **MA3** seller trust-erosion (22 — the interaction-side anchor for MB4/MB5) · **MB11** drip-pricing → revenue-bleed (net) (the cleanest revenue-proof fee bridge) · **MB6** return-text → category sourcing (the best-quantified worked example in the set).

---

# 3 · SINGLE-SOURCE GEMS (preserved — never averaged away)

*The long tail this merge exists to protect. Each is one run only; each is commercially interesting; none is dropped to consensus.*

**Gemini (the richest single-source contributor):**
- **MA15 — Complaint-volume-suppression watchdog** — the rare card that flags a *good-looking* metric as a warning; the sharpest CX-vs-P&L seam articulation.
- **MA16 — Buyer-fraud claim-pattern detector** — abuse-pattern on claims, review-only, never auto-deny; plus the proof-mechanism tension (unboxing photo, packing-station weight).
- **MA18 — Vernacular sarcasm & neutral-sentiment classifier** — GloVe+BERT triage, the "warm soup, 5 stars" example, and the honest ~88.9–90.69% binary / weak-neutral ceiling. Cross-cuts every text card.
- **MA19 — Payment-failure ("deducted, not confirmed") detector** — high-severity, gateway-change-correlated; the theme recurs elsewhere only as a radar instance.
- **MB17 — Defect-cost-vs-LTV differential appeasement** — commercially sharp, compliance-heaviest.
- **MB18 — Silent-friction reorder suppression** — "don't delist, fix the pump"; saves a profitable line a transaction-only view would kill.
- **MB19 — Device-based price-discrimination audit** — the ₹35-Android-vs-₹64-iOS margin-vs-toxicity monitor [weak-evidence].
- **MB20 — Geographic-vs-catalogue concentration-disambiguation engine** — the reusable "node vs network" routing IP behind MB1/MB2/MB5.
- **MB23 — Support-suppression → silent-retention-loss** — the bridge that proves MA15; prices *suppressed* contacts (vs MB9, which prices *repeat* contacts).

**GPT-5:**
- **MA20 — Medicine-compliance exception card** — the pharmacy/quick-commerce regulatory gem.
- **MA21 — Theme-velocity-vs-order-growth detector** — the denominator-normalisation discipline ("is it up faster than we grew"); the most rigorous false-positive-control framing across the runs.
- **MB8 — Refund-friction → 30/60/90-day repeat loss** — the sharpest refund bridge ("which refunds kill repeat vs merely delay cash").
- **MB16 — Delivery-promise credibility by zone** — the "experientially unbelievable promise" framing (beyond raw SLA).
- **MB21 — Bot-containment → seller/category trust damage** — "containment that backfired" [weak-evidence].
- **MB22 — Complaint → NCH/formal-grievance escalation prediction** — "catch it before it becomes a regulatory grievance", anchored in NCH real-time forwarding.
- **MB24 — Catalogue-disclosure non-compliance → CX damage** — imported-flag / country-of-origin (1 July 2027) revenue-drag bridge.

**Opus:**
- **MA14 — Substitution-failure complaint radar** — routes to the *substitution-logic owner*, not store Ops (an easily-lost distinction).
- **MB14 — Price/packaging/policy change → complaint+cancellation movement** — the controlled before/after "did our own change hurt us"; a causal logic distinct from every other bridge.
- *(MA9 weight/MRP and MA13 perishable-FSSAI are 2-source after the merge but Opus is the run that made each a standalone card with its distinct regulator and routing — preserved.)*

**Perplexity:**
- **MA3 sub-variant — new-seller-onboarding quality watch** (F1-4) — monitor the first ~200 interactions for a new seller and flag quality/description anomalies before the return rate builds; a distinct trigger (onboarding) inside the seller-trust card.
- *(Perplexity's strongest contributions are quantified anchors and the competitive landscape rather than novel standalone cards — carried in §5.)*

---

# 4 · CONTRADICTIONS & TENSIONS (surfaced for human resolution — not averaged)

## 4a · Factual / regulatory conflicts (resolve before they appear on any compliance card)

1. **Zepto ₹7 lakh dark-pattern fine — cause UNRESOLVED.** Opus: checkout design flouting MRP / dark-pattern rules. Gemini: auto-selecting the "Zepto Pass" subscription at checkout (basket sneaking → mandated app redesign). GPT-5: discusses CCPA dark patterns but does **not** attribute the specific fine. Perplexity: silent on the specific cause. All agree on ₹7 lakh, checkout, dark-pattern, trade-press-grade. **Resolution: verify against the primary CCPA order text before MA4/MB10 cite it.** `[unresolved-conflict]`
2. **DPDP — UNION the characterisations, do not pick one.** The four runs describe *different provisions of the same Act/Rules*: Opus (delete personal data within 3 years of last interaction · 72-hour breach notification · penalty cap) · Gemini (minimum 1-year log retention · 90-day grievance SLA · plus its own retention-vs-minimisation `[conflict]`) · GPT-5 (consent standard: free/specific/informed/unconditional/unambiguous, withdrawal as easy as giving · phased commencement — immediate / 1yr for Rule 4 / 18mo for several) · Perplexity (Data Fiduciary/Processor framing · granular purpose-specific consent · bundled consent prohibited). **Assemble the full picture from all four.**
   - **New conflict the fourth source surfaces — DPDP penalty ceiling:** Gemini states **up to ₹250 crore**; Perplexity states **up to ₹500 crore** for serious DPDPA violations. The Act's maximum is ₹250 crore per instance; the ₹500 crore figure is likely an aggregate or an imprecision. **Verify against the primary text; do not put an unverified penalty number on a customer-facing or regulator-facing card.** `[unresolved-conflict]`
3. **FTC "click-to-cancel" — status RESOLVED as directional-only, with a 2-2 split on framing.** Opus and GPT-5 state it was **vacated** (Eighth Circuit, 8 July 2025; only in ANPRM revival from 30 Jan 2026 — not in force). Gemini presents it as a "live template" and Perplexity describes it as "effective 2024" — both reflect the **pre-vacatur** status. The precise, more recent dating wins on recency + source hierarchy. **Resolution: treat as not-in-force, a directional signal only, not enforceable India-relevant law.** India ref points stay the domestic instruments (CCPA dark patterns, CP Rules). *(FTC fake-review rule, August 2024, is a separate, non-conflicting anchor cited by GPT-5 and Perplexity.)*

## 4b · Design / org tensions (the design calls — carry into Stage 3)

1. **CX north-star vs P&L bridge (the NPS tension) — surfaced by all four runs.** CX treats NPS/CSAT as the goal; the P&L owner treats it as a lagging proxy and wants the revenue bridge. **Call:** ship the CX card now (Bucket A) but pre-wire the named P&L destination on every card, so the *same* tile serves both seats — the seam **is** the wedge. Gemini states it most sharply as the inverse-metric (MA15 / MB23); a CX-only build with no P&L slot is the failure mode this whole exercise designs against.
2. **The QC org seam — CX-detected, Ops-actioned (Opus).** MA2/MB1 cross an org boundary (CX detects, Ops acts). This is a political risk, not only a technical one. **Call:** treat "CX-detected, Ops-actioned" as a reusable pattern and design routing + human gate to respect the seam, not bypass it.
3. **Beachhead honesty (Opus, conventions §7).** The differentiator (the Bucket B joins) is exactly what Phase 1 does *not* ship. **Call:** Bucket B ships as **bridge-ready tiles** — visible, tagged, never smuggled into the pilot as if it ran on interaction data alone.
4. **False-positive asymmetry on social/virality (Opus).** MA11/MB13 carry the highest FP rate of any card (sarcasm, brigading, bots), yet virality cost is asymmetric. **Call:** the strictest distillation threshold of the set + a mandatory human gate on the social cards; sequence MB13 later, lower-confidence band.
5. **Trust vs buyer-fraud on refunds (Gemini, GPT-5).** CX wants no-questions refunds (trust); the P&L owner wants proof mechanisms (curb fraud, protect razor-thin grocery margins). **Call:** MA16 surfaces claim-pattern anomalies for human review with proportionate proof, never auto-denies; MB8 dollarises which refund experiences actually cost repeat purchase; MB17's differential appeasement is the economic resolution.
6. **Differential appeasement vs fair-treatment (Gemini — heaviest compliance, conventions §8).** The LTV-rational protocol (MB17) is commercially elegant but risks discrimination concerns if value bands proxy a protected attribute. **Call:** cohort-banded, transparent, human-approved; the low-LTV/fraud edge under heaviest scrutiny; insight permissible, differential action gated and the bands reviewed for proxy risk.
7. **DPDP retention vs data-minimisation (Gemini; Perplexity Wave-2 sequencing).** A year of chats full of addresses, phone numbers and payment issues is a toxic liability. **Call:** federated NER-tagging must redact PII before long-term storage (extract the CX value, not the raw liability); Perplexity's resolution — Phase 1 anchors on review + ticket + return text (PII fields redacted), voice/chat added in Wave 2 under the compliance framework — is the pragmatic sequencing. This exact posture is the DPDP compliance *feature*.
8. **Act-early-on-weaker-evidence vs dollarise-first (GPT-5).** CX wants to act early to protect trust; the P&L owner wants confidence first. **Call:** denominator normalisation + cross-channel corroboration + minimum-support thresholds form a **tunable confidence dial** — one card serves CX (lower threshold, faster) and the P&L owner (higher threshold, dollarised). The threshold is the knob, not a different product.
9. **Automation savings vs hidden rework (GPT-5).** The business head weights bot-containment savings; CX wants quality containment. **Call:** MA12 + MB21 make the hidden rework and seller-trust damage visible, so containment is scored on quality-adjusted cost, not raw deflection.
10. **Anomaly FP control in sparse long-tail cells (Perplexity).** Per-cell baselines (seller × category × geo × time) risk sparse-data noise in long-tail cells. **Call:** phased rollout — high-volume cells first (top sellers × top categories × metro geographies), 3σ + semantic coherence required, human approval mandatory before any seller action.

---

# 5 · COVERAGE CHECK (replaces the old reconcile stage)

**Every theme and archetype that appears in any engine's output also appears in the longlist.** Per-engine reconciliation:

- **Opus (12A / 11B):** A1→MA1 · A2→MA2 · A3→MA3 · A4→MA4 · A5→MA8 · A6→MA22 · A7→MA10 · A8→MA11 · A9→MA13 · A11→MA14 · A12→MA6 · A13→MA12 · B1→MB3 · B2→MB1 · B3→MB6 · B4→MB7 · B5→MB10 · B6→MB13 · B7→MB12 · B8→MB9 · B10→MB14 · B11→MB15 · B12→MB5. **No gap.**
- **Gemini (9A / 10B):** A1→MA6 · A2→MA5 · A3→MA18 · A4→MA12 · A5→MA5 · A6→MA19 · A7→MA15 · A8→MA16 · A9→MA17 · B1→MB2 · B2→MB17 · B3→MB11 · B4→MB5 · B5→MB18 · B6→MB19 · B7→MB20 · B8→MB15 · B9→MB12 · B10→MB23. **No gap.**
- **GPT-5 (9A / 8B):** A1→MA2 · A2→MA3 · A3→MA7 · A4→MA5 · A5→MA12 · A6→MA20 · A7→MA9 · A8→MA1 · A9→MA21 · B1→MB1 · B2→MB4 · B3→MB8 · B4→MB11 · B5→MB16 · B6→MB24 · B7→MB21 · B8→MB22. **No gap.**
- **Perplexity (F1-1…5 / F2-1…5 + A-KPIs):** F1-1→MA1 · F1-2→MA1 · F1-3→MA4 · F1-4→MA3 (sub) · F1-5→MA17 · F2-1→MB4 · F2-2→MB1 · F2-3→MB6 · F2-4→MB3 · F2-5→MB13 · A-section KPI→P&L bridges folded into MA10/MA22/MB3/MB7 · C never-made-joins = the join definitions of MB1/MB3/MB4/MB6 · E1–E8 regulatory anchors carried in §5b. **No thematic gap.**

**Recall-gap statement:** there is **no thematic recall gap** — every distinct opportunity from all four runs is on the longlist. The one caveat is **process-level**: Perplexity's contribution arrived as a Stage 0 research report rather than the mined Bucket-A/B card template, so its items carry research-grade framing. If Stage 3 wants Perplexity's gems at full card-grade (notably the new-seller-onboarding watch and the GS1-anchored disclosure bridge), run a one-pass mining of the Perplexity file against the Stage 1 template before tiering. The substance is already captured here.

## 5b · Carry-forward intelligence (not use cases — preserved for Stage 3 catalogue, positioning, and build)

- **Competitive / defensibility (the two named analogues to watch):**
  - **Gorgias "partial exception" (GPT-5)** — the closest market analogue to the wedge (explicit revenue attribution + live order/inventory context), still narrower than a true marketplace × q-commerce join across seller/SKU/store/pincode/profit. The one to watch.
  - **EdgeTier Sonar (Perplexity)** — the closest global real-time contact-centre anomaly-detection reference, not India-deployed and with no transaction join or dark-store layer. Plus the full landscape (Sprinklr FY26 $857M · Verint · Uniphore, IDC MarketScape Leader 2025 · NICE CXone · CallMiner · Zendesk/Freshdesk/Gorgias · Medallia · Chattermill · Quantum Metric · GS1 India · Unicommerce · Syphoon) — **none joins the interaction signal to the SKU/seller/P&L layer.** The join gap is structural, not a feature gap.
- **Architecture (the buildable substrate):**
  - **Federated NER-tagging / AI-SIEM frame (Gemini)** — extract SKU/seller/location entities from text, emit structured dimensional tags at ingest, pass downstream for the lakehouse join; autoencoder baselines, telecom-fault-prediction analogy. The most concrete buildable architecture across the runs.
  - **Per-cell baseline + deviation, dimensional tagging at source, human-approves/audit-logged, interaction-first/transaction-join-ready (Perplexity Patterns 1–4)** — T-digest-style streaming per (seller × category × geo × time) cell; the "10% in fashion Tier-2 Monday is normal, the same in electronics Mumbai Thursday is an anomaly" framing.
  - **Denominator-normalisation + canonical card-schema (GPT-5)** — complaints-per-order; cross-channel corroboration; minimum-support thresholds; and the explicit card schema **issue taxonomy · confidence · severity · entity tags · time window · target metric** — adopt as the build template for every Tier-2 card.
  - **Latency benchmark + method (Opus)** — US Patent 7,899,769 (~1-day emerging-issue alert) as the bar to beat; Kakde & Chaudhuri LDA log-likelihood scan (arXiv 1607.07745) as a named method.
- **Detectability ceiling (honest limits to design around):** the Blinkit/Zepto/JioMart sentiment study (~88.9–90.69% binary accuracy, **hard failure on neutral and sarcasm**) — the only quantified accuracy bound; present confidence bands, not guarantees (this is why MA18 exists). Fake-review models (CNN/RNN/Transformer) are production-mature per the Cambridge Core survey.
- **Quantified India anchors to reuse verbatim (grounding for the catalogue):** e-commerce complaints 4,45,960 in FY23-24 (36.1% of all consumer complaints, doubled from 2020-21; Flipkart ~1.6 lakh NCH) · ₹180–240 per ticket / per RTO reverse-logistics unit · 30–50% lower 180-day LTV for unresolved first-90-day issues · RTO 6.2%→7.3% (2024), COD RTO 25–40% vs prepaid 5–10%, fashion RTO 22% avg / 35–45% worst quartile · GS1 India ₹5,000 crore/yr product-data loss, ₹1,900 crore/yr return-related cost (each 1pp RTO ≈ ₹190 crore) · q-commerce monthly churn 47.35% · dark patterns ≈ ₹28,000 crore/yr consumer harm · NCH 1,004 convergence partners · live enforcement (PhysicsWallah ₹5 lakh / Case CCPA-2/94/2025-CCPA; Zepto ₹7 lakh; FSSAI 8,143 FY25 inspections, 526 non-compliant; LocalCircles 21 of 26) · market scale ($60 bn e-retail; q-commerce >2/3 of e-grocery, ~1/10 of e-retail spend, >40% CAGR to 2030; Blinkit >2,200 stores Apr 2026; Swiggy Instamart 1,136 dark-stores Jan 2026, +316/quarter) · BIS IS 19000:2022 · country-of-origin filter effective 1 July 2027.

---

# 6 · GATE — decisions that shape Stage 3 (the tiered insight-card catalogue)

Stage 2 is complete: a 46-card longlist (nothing pruned), a ranked top-12, 15 preserved single-source gems, the factual conflicts and design tensions surfaced, and a clean coverage check. Before Stage 3 tiers this into **Tier 1** (self-serve descriptive) / **Tier 2** (proactive anomaly cards — the spine, the UI tiles) / **Tier 3** (the full transaction join — Phase 2, tagged not built), confirm:

1. **The pilot spine vs the bridge-tagged tiles.** Tier 2 ships on the interaction corpus — proposed spine from the shortlist: **MA1 (home tile) · MA2 · MA6 · MA4 · MA12 · MA15** (the inverse-metric wedge), with **MA21** as the FP-control plumbing under all of them. The Bucket B heroes (**MB1 · MB4 · MB10 · MB8 · MB17**) become **Tier 3 bridge-ready tiles** — visible in the pilot UI, lighting up when the transaction feed lands. Confirm this split, or re-weight (for example, whether the social card MA11 / MB13 belongs in the pilot at all given its FP profile).
2. **Resolve the two open conflicts before they reach a card.** The **Zepto fine cause** and the **DPDP penalty ceiling (₹250 crore vs ₹500 crore)** must be verified against primary texts before MA4 / MA6 / MB10 cite any figure — a regulator-facing card cannot carry an unverified number. The FTC item is settled (directional-only).
3. **Adopt GPT-5's canonical card-schema as the Tier-2 build template** (issue taxonomy · confidence · severity · entity tags · time window · target metric), layered on the mandatory join-ready schema (CX signal · join tags · named P&L destination · bridge status). Confirm so every Tier-2 card is specced identically.
4. **Confirm the shortlist (or adjust the ranking)** — in particular whether the three single-source gems carried above their raw score (**MA15, MB8, MB17**) stay in the nominated set, since convergence scoring structurally under-weights exactly the long tail the recall mandate protects.

On confirmation, Stage 3 produces the Tier 1/2/3 catalogue with an exceed-expectations map and panel calls; the build-spec pass then specs the nominated 5–6 cards one deep pass each.
