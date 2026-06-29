# Stage 1 — Per-Source Use-Case Mining

**SOURCE ENGINE: Perplexity** · LiSN retail / e-commerce category intelligence
**Run against:** `Lisn_Ph1_Retailresearch_Perplexity_25June26.txt` (Stage 0 report, mined in isolation — not from any merge)
**Panel:** [ARCH] retail data/ML architect · [DUAL] Category + CX lead · [PM] intelligence-platform PM · [REG] consumer-protection adviser
**Recall mandate in force.** Long-tail, single-source and inferred use cases are kept and tagged, never dropped. Ranking happens only at Stage 2.

---

## How this run read the Perplexity source

Perplexity is the most operationally granular run and the most explicit about **engineering provenance**. Its distinctive contributions are (a) joins that reach *below* the order line into operations — **returns-text ↔ warehouse pick/pack error ↔ seller return-rate**, and **chat/call transcript ↔ the exact order and delivery hops** so a complaint can drive automated remediation; (b) two finer correlation targets the other runs miss — **review spikes ↔ promotional impression logs + real-time pricing errors at the user-exposure level**, and **ad ROAS ↔ verbatim complaint attribution**; and (c) a strong **evidence-package / incident-packet** framing — authoritative mappings from voice evidence to order IDs and seller accounts, with provenance metadata, so every output is "audibly linked" and defensible for compliance. Perplexity also flags a build-relevant truth the others underweight: **Western-trained VoC models underperform on Indian languages and mixed-English**, making a multilingual semantic index a precision moat, not a nicety. Its MVP ladder is **deterministic-first** (MVP0 rule-based joins on operator-held keys → MVP1 multilingual semantic index clustering by SKU+PIN+seller → MVP2 real-time embeddings+rule ensemble with conservative thresholds and human-in-the-loop), and it argues for **configurable alerting tiers** to resolve the architect-vs-business cadence fight. I have mined the operational-granularity joins and the provenance framing as the spine and preserved the configurable-tier and multilingual-precision points as their own cards.

---

## Bucket A — Pipeline use cases that beat a self-built dashboard

### UC-PPLX-A1 — Deterministic returns-reason ↔ order ↔ seller ↔ refund-ledger join (MVP0)
- **Archetype:** substrate-side deterministic join with provenance
- **Bucket:** A
- **Signal:** Operator-held keys (return reason, order ID, seller ID, refund ledger) are linked deterministically — no ML required — to deliver weekly remediation tickets.
- **Cadence/trigger:** Weekly batch; daily during events.
- **Primary user → routed exec:** Category Head + Operations → Seller-Brand + Finance.
- **1. Data aggregation.** Substrate: return-reason records, order tables, seller ledger, refund ledger — all operator-held, deterministically joinable. Interaction: return free-text where present.
- **2. Baseline creation.** Per seller/SKU: normal return rate and refund cycle; the order→refund-ledger reconciliation is the known-easy join used as the backbone.
- **3. Dynamic detection.** A seller/SKU whose return + refund pattern breaks its own trend, with the order trail fully resolved.
- **4. Distillation.** Suppress steady-state; rank by refund value and seller exposure.
- **5. Surfacing & routing.** Weekly ticket: seller/SKU, the resolved order trail, refund impact. Draft: ops remediation. Human gate. Hero: a **fully-resolved order trail** with provenance.
- **Why it beats a self-built dashboard.** Most BI stops at aggregate return rates; the deterministic order-trail join with provenance is what makes a ticket *actionable* for ops and finance, not just informative.
- **Differentiation:** substrate-visible (deterministic foundation; the voice joins build on it).
- **Worked example.** A seller's refund value breaks trend; 40 orders traced to a single SKU/return-reason, ₹1.1L refunds with a clean provenance trail `[illustrative]`.
- **Regulatory/governance hook.** Refund-duty and reconciliation (TCS net-of-returns) auditability.
- **Feasibility.** [PM] the pragmatic MVP — deterministic before heavy ML. [ARCH] clean keys make this low-risk. FP risk: low.

### UC-PPLX-A2 — Multilingual semantic index: cluster reviews/chat by SKU + PIN + seller (MVP1)
- **Archetype:** interaction-side semantic distillation (precision moat)
- **Bucket:** A
- **Signal:** Reviews and chat transcripts — in Indian languages and mixed-English — clustered reliably by SKU, pin-code, and seller.
- **Cadence/trigger:** Weekly; near-real-time as the index matures.
- **Primary user → routed exec:** CX/VoC Head → Category + Seller-Brand.
- **1. Data aggregation.** Interaction: reviews, ratings, care chat/call transcripts, social, app-store — multilingual. Substrate: SKU/PIN/seller keys.
- **2. Baseline creation.** Per SKU+PIN+seller cluster: normal complaint-theme mix and volume, with language-aware embeddings.
- **3. Dynamic detection.** A complaint cluster rising above its baseline for a specific SKU+PIN+seller cell.
- **4. Distillation.** Collapse multilingual verbatims into one theme; rank by GMV/seller exposure.
- **5. Surfacing & routing.** Card: the cluster, theme, evidence in original language + gloss. Draft: routed action. Human gate. Hero: a **multilingual complaint cluster** keyed to SKU+PIN+seller.
- **Why it beats a self-built dashboard.** Western-trained VoC tools lose precision on Hinglish and regional languages; a purpose-built multilingual index is the precision the operator cannot buy off the shelf — and the join keys (SKU+PIN+seller) make it operational, not a sentiment dashboard.
- **Differentiation:** interaction-visible (the substrate keys turn it into joins downstream).
- **Worked example.** A "leaking bottle" cluster in two languages concentrates on one seller's SKU across three pin-codes `[illustrative]`.
- **Regulatory/governance hook.** PII redaction; DPDP-safe processing; cohort-level reporting.
- **Feasibility.** [ARCH] the embeddings/semantic-index layer and Indian-language accuracy are the moat and the hard part. [PM] MVP1. FP risk: moderate (code-mixing, sarcasm).

### UC-PPLX-A3 — Configurable-tier real-time anomaly monitor (conservative + human-in-loop) (MVP2)
- **Archetype:** substrate × interaction real-time monitor with tunable sensitivity
- **Bucket:** A
- **Signal:** Festival-window monitoring whose alert sensitivity is configurable by role, with human verification before action.
- **Cadence/trigger:** Real-time, festival windows.
- **Primary user → routed exec:** Category Head + CX + Trust & Safety → Ops / Growth.
- **1. Data aggregation.** Substrate: order/payment/funnel/inventory event streams. Interaction: real-time complaint/care/social anomaly via the semantic index.
- **2. Baseline creation.** Per metric/topic: conservative thresholds for festival scale; configurable tiers (architect-conservative vs business-earlier-noisier).
- **3. Dynamic detection.** An anomaly crosses the *selected* tier's threshold, with a voice corroboration check.
- **4. Distillation.** Suppress below-tier movement; route only verified incidents; rank by exposure.
- **5. Surfacing & routing.** Card: the incident, its tier, the corroborating voice. Draft: ops/fraud action. Mandatory human verification before any step. Hero: a **tier selector** with a confidence band.
- **Why it beats a self-built dashboard.** A fixed-threshold dashboard either drowns the Head on sale days or misses real incidents; configurable tiers + human-in-loop resolve the architect-vs-business cadence fight that a static tile cannot.
- **Differentiation:** substrate + interaction, with tunable sensitivity (the join is in UC-PPLX-B8).
- **Worked example.** Ops runs the conservative tier during peak; the Category Head runs an earlier tier for sentiment, each verified before action `[illustrative]`.
- **Regulatory/governance hook.** Auditable verification step for any consumer-affecting action.
- **Feasibility.** [ARCH] embeddings + rule ensemble + threshold tuning. [DUAL] the tier control is the compromise. FP risk: managed by tier + human gate.

### UC-PPLX-A4 — Evidence-package / incident-packet generator with provenance
- **Archetype:** interaction-side artifact assembly (compliance-grade)
- **Bucket:** A
- **Signal:** Every surfaced issue ships as a reproducible incident package — voice evidence mapped to order IDs and seller accounts, with provenance metadata.
- **Cadence/trigger:** On every routed card; on demand for compliance.
- **Primary user → routed exec:** CX/VoC + Compliance → Seller-Brand / Trust & Safety / Legal.
- **1. Data aggregation.** Interaction: verbatim evidence with source + timestamp. Substrate: the resolved order/seller mapping.
- **2. Baseline creation.** A package schema: evidence, mapping, provenance, recommended action.
- **3. Dynamic detection.** Triggered by any anomaly card needing a defensible evidence trail.
- **4. Distillation.** Select the minimal sufficient evidence with full provenance; suppress redundant verbatims.
- **5. Surfacing & routing.** The incident packet attached to the card. Draft: the recommended action. Human gate. Hero: the **provenance-stamped incident packet**.
- **Why it beats a self-built dashboard.** BI cannot produce a human-verifiable evidence packet that links voice to order IDs and seller accounts; this reproducibility is what makes remediation and compliance defensible.
- **Differentiation:** interaction-visible, joined to the order/seller mapping.
- **Worked example.** A seller-suspension proposal ships with 12 verbatims, the order trail, and timestamps — reproducible end to end `[illustrative]`.
- **Regulatory/governance hook.** Audit-export aligned with DPDP and consumer rules; legal-grade metadata.
- **Feasibility.** [REG] this is the compliance asset. [ARCH] provenance plumbing across systems. FP risk: low.

### UC-PPLX-A5 — Seller performance & root-cause playbooks
- **Archetype:** interaction-side seller risk + remediation workflow
- **Bucket:** A
- **Signal:** Seller SLA breaches tied to verbatim complaints and return reasons, packaged with an automated remediation workflow.
- **Cadence/trigger:** Weekly; alert on a breach cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships → Trust & Safety / CX.
- **1. Data aggregation.** Substrate: seller SLA, cancellation, return rate. Interaction: verbatim complaints + return reasons keyed to the seller.
- **2. Baseline creation.** Per seller tier: expected SLA + complaint profile.
- **3. Dynamic detection.** A seller whose SLA breach + verbatim-complaint cluster exceeds peer baseline.
- **4. Distillation.** Produce a root-cause + a recommended remediation playbook; suppress isolated breaches.
- **5. Surfacing & routing.** Card: seller, root cause, the playbook. Draft: remediation workflow (coaching/penalty/suppression). Human gate (FDI-aware). Hero: a **seller root-cause playbook**.
- **Why it beats a self-built dashboard.** Seller dashboards show breaches without the verbatim cause or a remediation path; the playbook turns a metric into an action sequence.
- **Differentiation:** interaction-visible, joined to seller SLA (extends in UC-PPLX-B2).
- **Worked example.** A seller's late-dispatch breach maps to "packed wrong size" verbatims → a relabel-and-QC remediation playbook `[illustrative]`.
- **Regulatory/governance hook.** Fall-back liability; FDI non-discrimination on remediation.
- **Feasibility.** [PM] strong, workflow-oriented. [ARCH] seller resolution. FP risk: low-moderate.

### UC-PPLX-A6 — Auditable content-based intervention monitor
- **Archetype:** interaction-side compliance monitor
- **Bucket:** A
- **Signal:** Problematic listings, deceptive claims, and dark-pattern experiments surfaced with evidence trails for compliance.
- **Cadence/trigger:** Weekly; real-time on offers.
- **Primary user → routed exec:** Legal/Compliance → Growth + Category.
- **1. Data aggregation.** Interaction: complaint text on deceptive claims, dark-pattern language. Substrate: listing/offer/journey metadata.
- **2. Baseline creation.** Normal rate per problematic-content topic per listing/offer.
- **3. Dynamic detection.** A topic cluster rising on a listing/offer, with an evidence trail assembled.
- **4. Distillation.** Keep claim/manipulation-specific evidence; suppress generic gripes; build a registry.
- **5. Surfacing & routing.** Registry: the listing/offer, the issue, evidence trail. Draft: compliance flag. Strict human gate. Hero: an **evidence-trail registry** entry.
- **Why it beats a self-built dashboard.** Rule-based compliance systems do not ingest continuous complaints as early warnings; the evidence trail is what makes an intervention defensible.
- **Differentiation:** interaction-visible (causation joins in UC-PPLX-B4/B6).
- **Worked example.** "Price shown was higher at checkout" mentions cluster on a promoted listing within hours `[illustrative]`.
- **Regulatory/governance hook.** Dark Patterns Guidelines 2023; E-Commerce Rules 2020; CCPA advisory.
- **Feasibility.** [REG] high. [ARCH] evidence assembly. [PM] evidence only.

### UC-PPLX-A7 — Returns root-cause classifier (quality vs expectation-mismatch vs wrong item)
- **Archetype:** interaction-side reason-layer distillation
- **Bucket:** A
- **Signal:** Elevated returns on a SKU resolved into quality vs expectation-mismatch vs wrong-item, from return reasons + review text + seller QC.
- **Cadence/trigger:** Weekly.
- **Primary user → routed exec:** Category Head → Catalogue + Seller-Brand.
- **1. Data aggregation.** Interaction: return free-text + review text. Substrate: return reasons, seller QC signals, warehouse picks.
- **2. Baseline creation.** Per SKU: normal return-cause mix across the three classes.
- **3. Dynamic detection.** A class shift vs baseline (e.g. "wrong item" rising → a pick/pack issue; "expectation mismatch" rising → a listing issue).
- **4. Distillation.** Assign each return to a class with confidence; rank by the actionable share.
- **5. Surfacing & routing.** Card: SKU, the dominant class, the owner it implies. Draft: catalogue / seller / warehouse action. Human gate. Hero: a **three-class return verdict**.
- **Why it beats a self-built dashboard.** A return-rate tile cannot separate a warehouse pick error from a listing-expectation gap; the class drives a different owner and fix.
- **Differentiation:** interaction-visible (the warehouse join is UC-PPLX-B2).
- **Worked example.** Returns on a SKU are 50% "wrong item" → a pick/pack root cause, routed to the warehouse not the seller `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology where expectation-mismatch is a disclosure gap.
- **Feasibility.** [ARCH] class confidence + QC signal fusion. FP risk: moderate.

### UC-PPLX-A8 — Real-time refund/returns-spike-by-seller-or-PIN detector
- **Archetype:** substrate × light-voice anomaly detection
- **Bucket:** A
- **Signal:** A refund/returns spike concentrated on a specific seller or pin-code, surfaced as it forms.
- **Cadence/trigger:** Real-time / daily.
- **Primary user → routed exec:** Operations + Category → Seller-Brand.
- **1. Data aggregation.** Substrate: returns/refund logs by seller/pin-code, delivery-partner statuses. Interaction: chat/voice complaint spike (corroboration).
- **2. Baseline creation.** Per seller/pin-code: normal refund/return rate.
- **3. Dynamic detection.** A seller/pin-code refund spike above baseline, optionally corroborated by a complaint spike.
- **4. Distillation.** Suppress steady-state; rank by refund value and exposure.
- **5. Surfacing & routing.** Card: seller/pin-code, the spike, corroborating voice. Draft: ops/seller escalation. Human gate. Hero: a **spike-with-corroboration** alert.
- **Why it beats a self-built dashboard.** A returns dashboard reports the rate after the fact; the real-time seller/PIN spike with voice corroboration catches it while it is forming — Perplexity's exact daily question.
- **Differentiation:** substrate-visible with a voice overlay.
- **Worked example.** One pin-code's refund rate doubles within hours, corroborated by "package damaged on arrival" chats `[illustrative]`.
- **Regulatory/governance hook.** Pin-code-level *action* gated; insight permissible.
- **Feasibility.** [ARCH] fast aggregation + corroboration. FP risk: low-moderate.

---

## Bucket B — Net-new substrate × customer-voice joins that do not exist today

### UC-PPLX-B1 — Operational-anomaly ↔ voice-anomaly join (delivery/mispick ↔ review spike, exact SKU + seller)
- **Archetype:** anomaly-causation join (highest impact)
- **Bucket:** B
- **Signal:** Delivery-attempt failures and warehouse mis-picks linked to sudden negative-review spikes for the exact SKU and seller location.
- **Cadence/trigger:** Daily; real-time during events.
- **Primary user → routed exec:** Category Head + Operations → Seller-Brand + CX.
- **1. Data aggregation.** Substrate: fulfilment/delivery-attempt events, warehouse pick/pack exceptions, stockouts, pricing errors, seller ledger. Interaction: reviews, complaints, chats, returns text, social.
- **2. Baseline creation.** Per SKU + seller-location: normal operational event rate and normal negative-review rate.
- **3. Dynamic detection (cross-domain).** An operational anomaly (delivery failure / mis-pick / pricing error) co-moving with a negative-review/complaint spike for the same SKU + seller location.
- **4. Distillation.** Resolve to a single named cause with provenance; suppress co-incidental noise; rank by churn/return/GMV exposure.
- **5. Surfacing & routing.** Card: the operational cause, the co-moving voice, the exact SKU/seller-location, exposure. Draft: targeted seller remediation. Human gate. Hero: a **cause-to-voice incident packet**.
- **Why it beats a self-built dashboard.** Operational telemetry and voice live in different systems; current tooling rarely connects them reliably or auditably, so the root cause (fulfilment, pick/pack, delivery) is never named with evidence.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A dark-store's mis-pick rate on one SKU co-moves with a negative-review spike from the same delivery zone → pick/pack root cause, ₹Y churn exposure `[illustrative]`.
- **Regulatory/governance hook.** Insight permissible; differential action gated; provenance retained.
- **Feasibility.** [ARCH] needs the voice index + an operational-event feed; cohort-level. FP risk: high without baselining. [PM] highest-impact, MVP-defining. [DUAL] same card, two first actions.

### UC-PPLX-B2 — Returns-text ↔ warehouse pick/pack error ↔ seller return-rate trend
- **Archetype:** sub-order operational-cause join
- **Bucket:** B
- **Signal:** Free-text return reasons linked to warehouse pick/pack exceptions and a seller's return-rate trend — separating a warehouse fault from a seller fault.
- **Cadence/trigger:** Weekly; alert on a SKU spike.
- **Primary user → routed exec:** Operations + Seller-Brand → Category.
- **1. Data aggregation.** Substrate: warehouse pick/pack exception logs, seller return-rate trend, SKU. Interaction: return free-text ("wrong item", "wrong size shipped").
- **2. Baseline creation.** Per SKU/warehouse/seller: normal pick-error rate and normal return-text mix.
- **3. Dynamic detection (cross-domain).** Return-text "wrong item" co-moving with a warehouse pick/pack exception (→ warehouse) vs co-moving with a seller return-rate trend (→ seller).
- **4. Distillation.** Attribute the return to warehouse vs seller; suppress the unsupported owner.
- **5. Surfacing & routing.** Card: SKU, the verdict (warehouse vs seller), evidence. Draft: warehouse process fix or seller action. Human gate. Hero: a **warehouse-vs-seller fault verdict**.
- **Why it beats a self-built dashboard.** Free-text reasons are rarely linked reliably to pick/pack exceptions in the warehouse events table — Perplexity calls this an often-never-made join; the fault owner is otherwise guessed.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** "Wrong item received" returns on a SKU co-move with a labelled pick-exception batch in one warehouse → warehouse fault, not seller `[illustrative]`.
- **Regulatory/governance hook.** Reconciliation; fair-treatment of the seller (do not penalise for a warehouse fault).
- **Feasibility.** [ARCH] warehouse-event linkage is the hard plumbing. FP risk: moderate. [PM] high-value, operational.

### UC-PPLX-B3 — Chat/call transcript complaint ↔ exact order + delivery-hop logs (automated remediation)
- **Archetype:** complaint-to-order resolution join
- **Bucket:** B
- **Signal:** A voice complaint linked to the exact order and its delivery hops, precise enough to drive automated remediation.
- **Cadence/trigger:** Real-time / daily.
- **Primary user → routed exec:** CX/VoC Head → Operations.
- **1. Data aggregation.** Interaction: care chat/call transcripts. Substrate: the exact order record + delivery-hop logs.
- **2. Baseline creation.** Per route/hop: normal complaint linkage and normal hop performance.
- **3. Dynamic detection (cross-domain).** A complaint deterministically resolved to an order and the failing delivery hop.
- **4. Distillation.** Surface the failing hop with the complaint evidence; suppress unresolved/ambiguous cases.
- **5. Surfacing & routing.** Card: the order, the failing hop, the complaint. Draft: an automated remediation (refund/re-ship/route fix) for approval. Human gate. Hero: a **complaint-to-hop resolution**.
- **Why it beats a self-built dashboard.** Voice transcripts sit in contact-centre systems and are seldom joined to the exact order and delivery hops in a way that supports automated remediation — so resolution stays manual.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A "never delivered, marked delivered" call resolves to an order whose last hop shows a false delivery scan → auto-refund proposed `[illustrative]`.
- **Regulatory/governance hook.** Grievance-SLA; auditable remediation trail.
- **Feasibility.** [ARCH] deterministic transcript→order linkage. FP risk: low-moderate. [PM] strong, workflow-enabling.

### UC-PPLX-B4 — Review spikes ↔ promotional impression logs + real-time pricing errors (user-exposure level)
- **Archetype:** exposure-level attribution join
- **Bucket:** B
- **Signal:** Review-sentiment changes mapped to *which users saw what promo or price change* and which listings were actually affected.
- **Cadence/trigger:** Per campaign; real-time on a pricing error.
- **Primary user → routed exec:** Pricing/Promotions + Category → Growth.
- **1. Data aggregation.** Substrate: promotional impression logs (user-exposure), pricing-change/error events, affected listings. Interaction: review spikes, complaint text.
- **2. Baseline creation.** Per promo/listing: normal review/complaint rate among exposed users.
- **3. Dynamic detection (cross-domain).** A review/complaint spike concentrated among users exposed to a specific promo or price change.
- **4. Distillation.** Attribute the sentiment shift to the exposure; suppress unexposed noise.
- **5. Surfacing & routing.** Card: the promo/price change, the exposed-user sentiment shift, affected listings. Draft: fix/rollback. Human gate. Hero: an **exposure-level attribution** band.
- **Why it beats a self-built dashboard.** Mapping sentiment changes to which users saw what promo/price change is often missing; without exposure-level linkage the cause is inferred, not proven.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A pricing error shown to one exposure segment co-moves with "price changed at checkout" complaints from that exact segment `[illustrative]`.
- **Regulatory/governance hook.** Drip-pricing / dark-pattern exposure; consent-aware processing.
- **Feasibility.** [ARCH] exposure-log linkage at user level is heavy and privacy-sensitive (cohort-level by default). FP risk: moderate.

### UC-PPLX-B5 — Ad ROAS ↔ verbatim complaint attribution
- **Archetype:** spend-quality attribution join
- **Bucket:** B
- **Signal:** Retail-media clicks/impressions linked to the verbatim complaint *types* they generate — not just to sales.
- **Cadence/trigger:** Per campaign; weekly.
- **Primary user → routed exec:** Pricing/Promotions + Retail-Media → Category.
- **1. Data aggregation.** Substrate: ad/promo exposure, ROAS, conversion. Interaction: verbatim complaint types tied to the advertised SKU/cohort.
- **2. Baseline creation.** Per campaign: normal complaint-type mix among converted users.
- **3. Dynamic detection (cross-domain).** A campaign whose conversions carry a rising complaint type (e.g. "not as advertised") above baseline.
- **4. Distillation.** Attribute complaint types to the campaign; rank by downstream damage vs ROAS.
- **5. Surfacing & routing.** Card: campaign, ROAS, the complaint-type damage. Draft: pause/adjust. Human gate. Hero: a **ROAS-minus-complaint-damage** view.
- **Why it beats a self-built dashboard.** Retail-media systems report clicks/impressions; linking that to complaint types in free text is rare, so a campaign looks profitable while seeding "not as advertised" anger.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A campaign with ROAS 4.5 shows "not as advertised" complaints rising among its converters → adjusted creative/targeting `[illustrative]`.
- **Regulatory/governance hook.** Misleading-advertising / disclosure exposure.
- **Feasibility.** [ARCH] attribution of complaints to the ad cohort. FP risk: moderate.

### UC-PPLX-B6 — Promo / price-change → voice + incrementality closed loop
- **Archetype:** spend-protection causal join
- **Bucket:** B
- **Signal:** Negative sentiment and return patterns attributed to specific promotions or price errors, closing the loop on promo quality.
- **Cadence/trigger:** Per campaign; weekly.
- **Primary user → routed exec:** Pricing/Promotions + Category → Growth.
- **1. Data aggregation.** Substrate: promo exposure, order-level profitability, returns. Interaction: returns text + sentiment tied to the promo.
- **2. Baseline creation.** Per promo: expected incrementality and normal post-promo sentiment/returns.
- **3. Dynamic detection (cross-domain).** A promo with negative incrementality *and* a co-moving negative-sentiment/return pattern.
- **4. Distillation.** Bind margin impact + voice damage into one promo verdict; suppress healthy promos.
- **5. Surfacing & routing.** Card: promo, true incrementality, the voice/return damage. Draft: stop/keep/adjust. Human gate. Hero: a **promo margin-and-voice verdict**.
- **Why it beats a self-built dashboard.** Connecting which promotional exposures caused negative reviews/returns is poorly supported; ROAS tiles miss the margin-and-trust damage together.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A discount run shows −7% incrementality and a co-moving "felt misled by the offer" cluster → stop `[illustrative]`.
- **Regulatory/governance hook.** Drip-pricing / discount-claim honesty (CCPA).
- **Feasibility.** [ARCH] holdout design + voice attribution. FP risk: moderate.

### UC-PPLX-B7 — Fake-review / manipulation ↔ order-velocity anomaly + seller-account signals
- **Archetype:** integrity join
- **Bucket:** B
- **Signal:** Listings experiencing fake reviews or review-sentiment manipulation, detected by joining the review corpus to order-velocity anomalies and seller-account signals.
- **Cadence/trigger:** Real-time; weekly sweep.
- **Primary user → routed exec:** Trust & Safety → Seller-Brand + Category.
- **1. Data aggregation.** Interaction: review text/velocity, reviewer-account signals. Substrate: order-velocity anomalies, seller-account signals.
- **2. Baseline creation.** Per SKU/seller: normal review velocity, reviewer diversity, and order-velocity relationship.
- **3. Dynamic detection (cross-domain).** A review-sentiment swing or fake-review burst inconsistent with order velocity and tied to suspicious seller-account signals.
- **4. Distillation.** Bind the signals into a manipulation-risk verdict; suppress organic bursts.
- **5. Surfacing & routing.** Card: SKU/seller, manipulation-risk, evidence. Draft: review-takedown / seller investigation. Human gate. Hero: a **manipulation-risk verdict**.
- **Why it beats a self-built dashboard.** Review mining alone cannot tell manipulation from genuine sentiment; the join to order velocity and account signals is what makes it decisive — Perplexity's exact event-triggered question.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A listing's 5-star burst has no matching order velocity and traces to linked new accounts → manipulation-likely `[illustrative]`.
- **Regulatory/governance hook.** Review-integrity / unfair-trade-practice; evidence retained.
- **Feasibility.** [ARCH] account + velocity features. FP risk: moderate. [REG] strong.

### UC-PPLX-B8 — Festival-scale low-FP incident detection (gateway failure / bot orders / seller fraud)
- **Archetype:** event-integrity join
- **Bucket:** B
- **Signal:** True incidents during peak — payment-gateway failures, bot-driven fake orders, seller fraud — surfaced while minimising alert fatigue.
- **Cadence/trigger:** Real-time, festival windows.
- **Primary user → routed exec:** Trust & Safety + Operations → Category + Growth.
- **1. Data aggregation.** Substrate: payment success/failure, order-velocity, bot/fraud signals, seller-account signals. Interaction: real-time complaint/care/social anomaly.
- **2. Baseline creation.** Conservative festival-scale baselines; configurable tiers; voice corroboration as a second key.
- **3. Dynamic detection (cross-domain).** An operational incident (gateway failure / bot orders / fraud) corroborated by a co-moving voice anomaly, against a conservative baseline.
- **4. Distillation.** Suppress expected sale-day movement; route only corroborated incidents; rank by GMV/trust risk.
- **5. Surfacing & routing.** Card: the incident, the corroborating voice, the tier. Draft: ops/fraud escalation. Mandatory human verification. Hero: a **corroborated-incident** alert.
- **Why it beats a self-built dashboard.** Festivals amplify both impact and noise; a static-threshold view drowns in false alarms, while voice corroboration + conservative tiers surface the true incident.
- **Differentiation:** **requires the join — does not exist today** (and depends on conservative festival-scale baselining).
- **Worked example.** A payment-gateway failure shows as a checkout-drop spike corroborated by "payment failed, money debited" complaints → real incident, escalated `[illustrative]`.
- **Regulatory/governance hook.** Auditable evidence for any fraud/abuse action.
- **Feasibility.** [ARCH] conservative thresholds + ensemble; this is the festival false-positive problem. [DUAL] tiers are the compromise. FP risk: the whole point.

### UC-PPLX-B9 — Conversion-drop hour-over-hour ↔ UX / payment / fulfilment + complaint-spike join
- **Archetype:** funnel-anomaly explanation join
- **Bucket:** B
- **Signal:** An hour-over-hour conversion drop named as a UX, payment, or fulfilment issue via the co-moving complaint spike.
- **Cadence/trigger:** Real-time / hourly.
- **Primary user → routed exec:** Category Head + Growth → Product / Payments / Operations.
- **1. Data aggregation.** Substrate: order funnel by hour, payment-gateway errors, fulfilment status. Interaction: chat/complaint spikes.
- **2. Baseline creation.** Conversion band per category × hour vs same-hour yesterday/day-type.
- **3. Dynamic detection (cross-domain).** A conversion drop co-moving with a complaint spike that classifies the cause as UX vs payment vs fulfilment.
- **4. Distillation.** Resolve to one cause class; suppress expected variation; rank by GMV-at-risk.
- **5. Surfacing & routing.** Card: the drop, the cause class, the co-moving complaints, GMV-at-risk. Draft: route to the owning function. Human gate. Hero: a **cause-class verdict** for the drop.
- **Why it beats a self-built dashboard.** A funnel tile shows the drop; it cannot classify it as UX vs payment vs fulfilment without the co-moving voice — Perplexity's exact daily/real-time question.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Conversion drops 11% this hour vs same-hour yesterday; co-moving "payment failed" complaints classify it as a payment issue → routed to Payments `[illustrative]`.
- **Regulatory/governance hook.** A conversion *spike* gets the same treatment for dark-pattern risk.
- **Feasibility.** [ARCH] hourly baseline + cause-class model; cohort-level. FP risk: moderate. [PM] strong real-time card.

---

## Panel Notes (Perplexity run)

**Sharpest disagreements to carry to merge.**
1. **Deterministic-first vs embeddings-first.** [PM] favours phased MVPs starting with deterministic joins on operator-held keys (returns-reason ↔ order ↔ seller ↔ ledger) before heavy ML; [ARCH] wants the embeddings/semantic-index architecture earlier to limit rework. Resolution lever: ship the deterministic join as MVP0 *and* stand up the semantic index in parallel as MVP1, so the real-time monitor (MVP2) inherits both.
2. **Alert sensitivity (the cadence fight).** [ARCH] wants conservative thresholds to avoid false positives at festival scale; [DUAL] (Category+CX) wants earlier, noisier signals to enable fast remediation. Perplexity's own resolution — **configurable alerting tiers** with human-in-the-loop — is the design call to carry forward (UC-PPLX-A3/B8).
3. **Compliance cost vs speed.** [REG] treats auditability and provenance as non-negotiable even if they slow rollout; business leads push for rapid deployment. The evidence-packet card (A4) turns this from a tax into a product asset.
4. **Causality from text.** Perplexity is comfortable with directional joins but defaults to **provenance + human verification** as the guard, rather than claiming proven cause — consistent with the other engines' correlation-band stance.

**Five strongest UI candidates from this source.**
- The **provenance-stamped incident packet** — voice mapped to order IDs + seller accounts, reproducible end to end (A4) — the compliance-and-remediation hero.
- The **warehouse-vs-seller fault verdict** for a return, from pick/pack exceptions + return text (B2).
- The **complaint-to-hop resolution** that drives an automated remediation draft (B3).
- The **configurable tier selector** with a confidence band on the real-time monitor (A3/B8).
- The **cause-class verdict** (UX / payment / fulfilment) for an hour-over-hour conversion drop (B9).

**Recall note — distinct Perplexity gems to preserve at merge (do not let consensus drop these).**
- **Sub-order operational-granularity joins** — returns-text ↔ **warehouse pick/pack error** (B2) and transcript ↔ **exact order + delivery hops** (B3). Perplexity is the only engine reaching below the order line; these enable automated remediation and a warehouse-vs-seller fault split the others cannot make.
- **Exposure-level attribution** — review/sentiment ↔ **promotional impression logs + pricing errors at the user-exposure level** (B4), and **ad ROAS ↔ verbatim complaint attribution** (B5). Finer correlation targets than the other runs' campaign-level joins.
- The **evidence-package / incident-packet with provenance** framing (A4) — "audibly linked," authoritative voice→order/seller mappings; the clearest statement of the compliance-grade artifact.
- **Multilingual / mixed-English precision as a moat** (A2) — Western-trained VoC models underperform on Indian languages; a purpose-built multilingual semantic index is a differentiator, not a feature.
- **Configurable alerting tiers + human-in-the-loop** (A3/B8) — the concrete resolution to the architect-vs-business cadence fight; carry as a product primitive.
- The **deterministic-first MVP ladder** (MVP0 deterministic keys → MVP1 multilingual semantic index by SKU+PIN+seller → MVP2 real-time embeddings+rule ensemble) — Stage-3 sequencing input that pairs with GPT's and Opus's ladders.
- The **order → refund-ledger reconciliation** as the known-easy backbone (A1) — the deterministic spine the harder joins extend.
