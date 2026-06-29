# Stage 1 — Per-Source Use-Case Mining

**SOURCE ENGINE: GPT-5.5 Thinking** · LiSN retail / e-commerce category intelligence
**Run against:** `Lisn_Ph1_Retailresearch_GPT_25June26.txt` (Stage 0 report, mined in isolation — not from any merge)
**Panel:** [ARCH] retail data/ML architect · [DUAL] Category + CX lead · [PM] intelligence-platform PM · [REG] consumer-protection adviser
**Recall mandate in force.** Long-tail, single-source and inferred use cases are kept and tagged, never dropped. Ranking happens only at Stage 2.

---

## How this run read the GPT source

GPT's organising idea is **"voice-confirmed operational leakage"**: the Category Head is a mini-P&L owner, the substrate already shows the rate, and LiSN's job is to own the *reason layer* and push structured cause codes back into category BI. Two contributions are distinctively GPT's. First, the **promo/ad-spend safety guardrail** — a "do not promote / promote with caution / safe to scale" verdict on every promoted SKU, because retail media (~₹15,573 cr in FY25 across Amazon/Flipkart/Myntra) optimises ROAS while ignoring downstream review/return damage. Second, a **seller/SKU trust-risk board** that ranks problems by *customer-backed* exposure, grounded in real operator metrics (Amazon ODR < 1%, Flipkart's seller-cancellation-rate definition, seller tiering by GMV/fulfilment/return). GPT is also the only run that elevates **protected-attribute inference** to a use case in its own right (segmentation that risks DPDP/consumer-protection exposure), and it gives the crispest worked-example grammar ("returns rose 18% for this SKU cluster; 42% of related complaints mention size mismatch"). Its explicit MVP ladder (return-reason → seller/SKU trust-risk → promo guardrail → regulatory early-warning) is preserved as sequencing input for Stage 3, not as ranking here.

---

## Bucket A — Pipeline use cases that beat a self-built dashboard

### UC-GPT-A1 — Voice-confirmed return / cancellation reason layer (cause codes into BI)
- **Archetype:** interaction-side reason-layer distillation
- **Bucket:** A
- **Signal:** Returns/cancellations rise on a SKU cluster and the corpus resolves the *why* into structured cause codes (size, quality, fake, damage, delay, missing accessory, confusing exchange).
- **Cadence/trigger:** Daily/weekly; alert during events.
- **Primary user → routed exec:** Category Head → Catalogue + Seller-Brand + CX.
- **1. Data aggregation.** Substrate: return/cancellation logs, order, SKU, seller, GMV exposure. Interaction: return free-text, reviews, care chats/calls.
- **2. Baseline creation.** Per SKU cluster/seller: normal return rate and normal cause-code mix; NMV-style (delivered-order) exposure as the denominator.
- **3. Dynamic detection.** Return-rate breach co-located with a shift in the dominant cause code vs baseline.
- **4. Distillation.** Collapse verbatims into ranked cause codes; suppress steady-state returns; rank by contribution at risk.
- **5. Surfacing & routing.** Card: cluster, ranked cause codes with %, GMV exposure, owner. Draft: catalogue/seller/CX action. Human gate. Hero: a **cause-code breakdown** beside the rate. (GPT's MVP #1.)
- **Why it beats a self-built dashboard.** BI has the rate; VoC has the reason; few production systems join them at SKU/seller/category level. The reason layer is the wedge a returns tile cannot supply.
- **Differentiation:** interaction-visible (becomes the headline join in UC-GPT-B1).
- **Worked example.** Returns rise 18% on a denim cluster; 42% of related complaints cite size mismatch, a further 15% "fabric thinner than photo" → catalogue + seller actions, ₹Y exposed `[illustrative]`.
- **Regulatory/governance hook.** TCS (s.52 CGST) is computed net of returns, so the return base also moves settlement — a returns-to-finance reconciliation hook.
- **Feasibility.** [ARCH] warns against over-claiming causality from text alone; keep directional. [PM] this is MVP #1. [DUAL] Category fixes listing/seller, CX pre-empts the ticket. FP risk: moderate.

### UC-GPT-A2 — Promo / ad-spend safety guardrail ("do not promote / caution / safe to scale")
- **Archetype:** substrate × interaction spend-quality gate
- **Bucket:** A
- **Signal:** A SKU being scaled with ad/promo spend is operationally unhealthy — poor recent reviews, high returns, stockout risk, seller cancellations, or a complaint spike.
- **Cadence/trigger:** Daily during campaigns.
- **Primary user → routed exec:** Pricing/Promotions + Category Head → Growth / Retail-Media.
- **1. Data aggregation.** Substrate: ad/promo exposure, ROAS, returns, stock, seller SLA, conversion. Interaction: recent review sentiment, care-contact spikes, return free-text.
- **2. Baseline creation.** Per SKU: a composite "promotability" health baseline across return rate, recent sentiment slope, availability, seller health.
- **3. Dynamic detection.** A promoted/about-to-be-promoted SKU crosses into unhealthy territory on the composite.
- **4. Distillation.** One verdict per SKU — promote / caution / do-not-promote — with the dominant reason; suppress healthy SKUs.
- **5. Surfacing & routing.** Card: SKU, verdict, the one reason, ad spend at risk. Draft: pause/scale recommendation. Human gate. Hero: the **three-state promote verdict**. (GPT's MVP #3.)
- **Why it beats a self-built dashboard.** Retail-media tools optimise ROAS and rarely penalise for post-purchase voice damage; a campaign looks profitable until returns and complaints are joined. This is a category-P&L guardrail, not CX reporting.
- **Differentiation:** substrate-visible composite enriched by interaction signal (the join deepens it in UC-GPT-B2).
- **Worked example.** A blender being scaled has ROAS 4.2 but recent reviews turned on "stopped working in a week" and returns are above band → "do not promote", ₹3.4L spend redirected `[illustrative]`.
- **Regulatory/governance hook.** Scaling a SKU with deceptive-claim complaints intersects dark-pattern/disclosure exposure.
- **Feasibility.** [ARCH] composite weighting and avoiding stale-review penalties is the work. [PM] high-value, MVP #3. [DUAL] aligned (margin + trust both protected). FP risk: moderate.

### UC-GPT-A3 — Seller / SKU trust-risk board with evidence packs
- **Archetype:** interaction-side seller/SKU risk ranking
- **Bucket:** A
- **Signal:** Seller/SKU problems ranked by *customer-backed* impact on GMV, returns, repeat, and complaints — not by raw breach counts.
- **Cadence/trigger:** Weekly; alert on a seller breach cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships + Category Head → Trust & Safety / CX.
- **1. Data aggregation.** Substrate: seller cancellation, late dispatch, ODR, valid tracking, GMV, return rate. Interaction: complaint clusters, repeat-contact rate, quotes, sentiment.
- **2. Baseline creation.** Per seller tier (GMV/fulfilment/return): expected breach + complaint profile.
- **3. Dynamic detection.** Sellers/SKUs whose customer-voice damage exceeds peer baseline, weighted by affected GMV and category exposure.
- **4. Distillation.** Produce a ranked board; each row carries an evidence pack (issue clusters, quotes, affected GMV). Suppress noise-level breaches.
- **5. Surfacing & routing.** Board + per-seller **evidence pack**. Draft: intervention/penalty/coaching/suppression proposal. Human gate (FDI-aware). Hero: the **evidence pack** itself. (GPT's MVP #2.)
- **Why it beats a self-built dashboard.** Seller account-health tools track cancellation/late-shipment/ODR but lack customer-language evidence and category-level financial impact; category teams need customer-backed prioritisation of which seller problems actually hurt P&L.
- **Differentiation:** interaction-visible, joined to seller P&L (extends in UC-GPT-B3).
- **Worked example.** A long-tail seller's ODR is "near the line" but repeat-contact rate and "seller cancelled after 3 days" quotes put it top of the board with ₹Y category GMV exposed `[illustrative]`.
- **Regulatory/governance hook.** Fall-back liability; FDI 25% concentration cap and non-discrimination on remediation.
- **Feasibility.** [ARCH] seller entity resolution + quote selection. [PM] MVP #2. [REG] evidence pack doubles as compliance artifact.

### UC-GPT-A4 — Stockout & promise-date frustration → hidden lost demand
- **Archetype:** substrate × interaction lost-demand surfacing
- **Bucket:** A
- **Signal:** Stockouts/promise-date misses that are actually driving brand switching and failed missions, not just an availability gap.
- **Cadence/trigger:** Real-time/daily; sharper in quick commerce and events.
- **Primary user → routed exec:** Category Head + Operations → Supply/Planning.
- **1. Data aggregation.** Substrate: stock/availability, promise-date, search, cart. Interaction: "not available during sale", "promised today, didn't come" frustration text.
- **2. Baseline creation.** Per SKU/zone: normal stockout and normal complaint-frustration rate.
- **3. Dynamic detection.** Stockouts/promise-misses co-moving with switching-intent voice → quantified hidden lost demand.
- **4. Distillation.** Suppress low-impact stockouts; rank by lost-demand signal strength × GMV.
- **5. Surfacing & routing.** Card: SKU/zone, lost-demand estimate, the voice evidence. Draft: replenishment/promise-tightening. Human gate. Hero: a **hidden-lost-demand figure** with voice proof.
- **Why it beats a self-built dashboard.** Lost demand is hard to observe; inventory dashboards show the stockout, customer voice shows which stockouts cause switching and complaints.
- **Differentiation:** substrate + interaction (full join in UC-GPT-B4).
- **Worked example.** A grocery staple stocks out in two dark-store zones; "switched to [competitor]" mentions spike → estimated ₹1.8L weekly demand bleeding `[illustrative]`.
- **Regulatory/governance hook.** Quick-commerce delivery-promise constraint (the Jan-2026 "10-minute" marketing directive context).
- **Feasibility.** [ARCH] needs strong search/cart/inventory joins. FP risk: moderate. [PM] strong q-com card.

### UC-GPT-A5 — Review-sentiment → conversion-risk (aspect to funnel)
- **Archetype:** interaction-side leading-indicator distillation
- **Bucket:** A
- **Signal:** Recent review aspects (fake product, poor quality, wrong shade, damaged packaging) are damaging conversion before the rating average moves.
- **Cadence/trigger:** Weekly; alert on a sentiment crash.
- **Primary user → routed exec:** Category Head → Catalogue + CX.
- **1. Data aggregation.** Interaction: recent reviews, ratings, aspect sentiment. Substrate: PDP conversion by SKU.
- **2. Baseline creation.** Per SKU: normal aspect-sentiment mix and normal conversion; rating *average* explicitly excluded as too slow.
- **3. Dynamic detection.** A negative aspect rising recently, mapped to a SKU carrying high sales exposure but a softening conversion trend.
- **4. Distillation.** Surface the aspect and the exposure; suppress slow-moving averages and low-exposure SKUs.
- **5. Surfacing & routing.** Card: SKU, the damaging aspect, exposure, conversion trend. Draft: catalogue/quality action. Human gate. Hero: an **aspect-to-conversion risk** indicator.
- **Why it beats a self-built dashboard.** Rating averages move slowly; PDP analytics and review mining are usually disconnected, so the conversion bleed is invisible until it is large.
- **Differentiation:** interaction-visible, projecting onto conversion (full join in UC-GPT-B5).
- **Worked example.** "Wrong shade" rises to 19% of recent reviews on a foundation SKU while its average holds 4.0★ and conversion drifts down 6% `[illustrative]`.
- **Regulatory/governance hook.** Misleading-image/claim exposure if the aspect is a listing defect.
- **Feasibility.** [ARCH] aspect extraction + funnel join. FP risk: moderate. [PM] strong, fashion/beauty/electronics.

### UC-GPT-A6 — Dark-pattern & misleading-commerce complaint monitor
- **Archetype:** interaction-side compliance monitor
- **Bucket:** A
- **Signal:** Complaint patterns matching specified dark patterns (false urgency, basket sneaking, forced action, subscription trap, drip pricing) rise continuously between periodic audits.
- **Cadence/trigger:** Weekly; real-time on offers.
- **Primary user → routed exec:** Legal/Compliance → Growth + Category.
- **1. Data aggregation.** Interaction: care, social, app-store, grievance text. Substrate: journey/offer/checkout metadata (and a caveat — UI/session evidence may be needed to *prove* design causality).
- **2. Baseline creation.** Normal rate per dark-pattern topic per journey/offer.
- **3. Dynamic detection.** Topic-cluster surge tied to a journey/offer change.
- **4. Distillation.** Keep manipulation-specific language with evidence; suppress generic gripes; build an issue registry.
- **5. Surfacing & routing.** Card/registry: the pattern, evidence, journey, complaint volume. Draft: compliance flag. Strict human gate. Hero: the **dark-pattern issue registry**.
- **Why it beats a self-built dashboard.** Compliance audits are periodic; complaints are continuous; the 5 June 2025 self-audit advisory turns this into an auditable obligation with no prescribed method.
- **Differentiation:** interaction-visible (causation join in UC-GPT-B6).
- **Worked example.** "Couldn't cancel the subscription" mentions climb for two weeks after a loyalty-flow change `[illustrative]`.
- **Regulatory/governance hook.** Dark Patterns Guidelines 2023 (13 patterns); CCPA advisory; E-Commerce Rules 2020.
- **Feasibility.** [REG] high urgency. [ARCH] proving design causality from text alone is the gap (hence the UI-evidence caveat). [PM] evidence only.

### UC-GPT-A7 — Regulatory disclosure intelligence (Legal Metrology complaints → listing)
- **Archetype:** interaction-side compliance-to-catalogue monitor
- **Bucket:** A
- **Signal:** Complaints about misleading quantity, wrong MRP, missing origin, wrong details, or expiry cluster on listings.
- **Cadence/trigger:** Weekly; alert on a spike.
- **Primary user → routed exec:** CX/VoC Head → Category Ops / Compliance.
- **1. Data aggregation.** Interaction: reviews, care, return free-text naming a declaration fault. Substrate: SKU/listing keys.
- **2. Baseline creation.** Normal disclosure-complaint rate per category/SKU.
- **3. Dynamic detection.** Disclosure-complaint cluster above baseline on a listing.
- **4. Distillation.** Map to the specific declaration; rank by listing reach.
- **5. Surfacing & routing.** Card: listing, the missing/incorrect declaration, evidence. Draft: listing-fix ticket. Human gate. Hero: a **disclosure-fix card**.
- **Why it beats a self-built dashboard.** Compliance systems are rule-based and do not ingest complaints as early warnings; the displayed-value error is only visible in customer experience.
- **Differentiation:** interaction-visible.
- **Worked example.** "Expiry already passed" mentions cluster on a packaged-foods listing within 24 hours `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology declarations; consumer-affairs notice risk; FSSAI for grocery/prepared food.
- **Feasibility.** [REG] clear obligation; [ARCH] simple extraction; low FP.

### UC-GPT-A8 — Refund-delay → grievance-escalation early warning
- **Archetype:** interaction-side escalation predictor
- **Bucket:** A
- **Signal:** Refund delays are tipping into formal grievance/regulatory-escalation language before the SLA breach is visible in ops.
- **Cadence/trigger:** Daily; alert on a surge.
- **Primary user → routed exec:** CX/VoC Head → Grievance/Compliance + Finance.
- **1. Data aggregation.** Interaction: refund/complaint text, repeat contacts, escalation phrasing ("consumer forum", "NCH"). Substrate: refund-ledger/SLA timestamps.
- **2. Baseline creation.** Normal refund-complaint rate and escalation-language share.
- **3. Dynamic detection.** Escalation-language share rising against baseline, co-located with refund-delay timestamps.
- **4. Distillation.** Surface the pre-escalation cohort; suppress resolved cases; rank by escalation risk × value.
- **5. Surfacing & routing.** Card: the cohort, the refund-delay pattern, the escalation signal. Draft: priority-resolution batch. Human gate. Hero: a **pre-escalation watch** queue.
- **Why it beats a self-built dashboard.** Ops sees the SLA after it breaches; the corpus shows anger turning into regulatory exposure earlier, where it is still cheap to fix.
- **Differentiation:** interaction-visible (joins regulatory exposure in UC-GPT-B8).
- **Worked example.** Refund-delay complaints with "consumer forum" language triple over a long weekend on a high-value cluster `[illustrative]`.
- **Regulatory/governance hook.** E-Commerce Rules 2020 grievance timelines; refund-duty exposure.
- **Feasibility.** [ARCH] escalation-language classifier; FP risk on rhetorical threats. [REG] strong.

### UC-GPT-A9 — Seller-dispute legitimacy triage `[long-tail — preserve]`
- **Archetype:** interaction-side fairness classifier
- **Bucket:** A
- **Signal:** A seller disputing a penalty — is the system wrong, or is seller performance genuinely poor?
- **Cadence/trigger:** Event-triggered (seller escalation).
- **Primary user → routed exec:** Seller-Brand Partnerships → Trust & Safety.
- **1. Data aggregation.** Substrate: seller SLA/cancellation/ODR, penalty events. Interaction: seller-support tickets + the buyer voice tied to that seller.
- **2. Baseline creation.** Peer-tier expected performance and dispute profile.
- **3. Dynamic detection.** Reconcile the seller's claim against buyer-voice evidence and SLA truth → "system error" vs "genuine underperformance".
- **4. Distillation.** Produce a triage verdict with evidence; suppress the unsupported side.
- **5. Surfacing & routing.** Card: dispute, verdict, evidence both ways. Draft: uphold/reverse/coach. Human gate. Hero: a **dispute-triage verdict**.
- **Why it beats a self-built dashboard.** Seller dashboards show the breach but not whether the buyer experience supports the penalty; the join settles the dispute fairly.
- **Differentiation:** requires substrate + interaction (a light join).
- **Worked example.** A seller disputes a late-dispatch penalty; buyer voice shows the delays are real and repeated → uphold, with quotes `[illustrative]`.
- **Regulatory/governance hook.** FDI non-discrimination and fair-treatment-of-sellers duty.
- **Feasibility.** [ARCH] tractable; [DUAL] resonant for seller relations; FP risk low with good evidence.

---

## Bucket B — Net-new substrate × customer-voice joins that do not exist today

### UC-GPT-B1 — Operational anomaly ↔ customer-voice anomaly (the core never-made join)
- **Archetype:** anomaly-causation join
- **Bucket:** B
- **Signal:** A GMV/returns/stock/SLA/conversion anomaly is named by the co-moving voice anomaly.
- **Cadence/trigger:** Daily; real-time during events.
- **Primary user → routed exec:** Category Head → the owning function (CX/Growth/Ops/Seller/Pricing).
- **1. Data aggregation.** Substrate: order/GMV, returns, stock, seller SLA, funnel — as anomaly streams. Interaction: reviews, care chat/call, return text, social — as voice-anomaly streams.
- **2. Baseline creation.** Each operational metric and each voice topic carries its own baseline (per SKU/seller/cluster/day-type).
- **3. Dynamic detection (cross-domain).** Time-aligned, cohort-level co-movement of an operational anomaly and a voice anomaly (return spike ↔ "size chart wrong"; stockout ↔ "not available during sale"; seller-cancellation ↔ "cancelled after waiting"; conversion drop ↔ recent sentiment deterioration).
- **4. Distillation.** Resolve to a single named cause; suppress co-incidental noise; rank by P&L exposure.
- **5. Surfacing & routing.** Card: "[number] moved because [voice cause], concentrated in [sellers/cities], costing [GMV/margin], owned by [function]." Correlation-evidence band shown. Draft: routed action. Human gate. Hero: the **why-it-moved cause statement**.
- **Why it beats a self-built dashboard.** Operational and interaction data live in different systems, owners, and identifiers — the join is rarely made in production. A substrate-only copilot says "return rate increased"; LiSN says why, where, how much, and who fixes it first.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** GPT's grammar: returns +18% on a SKU cluster; 42% of related complaints mention size mismatch; recent reviews mention misleading images; seller cancellation also above benchmark → catalogue + seller + CX `[illustrative]`.
- **Regulatory/governance hook.** Insight permissible; differential action gated and audit-logged.
- **Feasibility.** [ARCH] identifiers rarely link cleanly; keep cohort-level and resist over-claiming causality. [PM] the spine under every other card. FP risk: high without baselining. [DUAL] same card, two first actions.

### UC-GPT-B2 — Promo/ad campaign ↔ bad post-purchase experience (do-not-scale join)
- **Archetype:** spend-protection join
- **Bucket:** B
- **Signal:** A category is scaling ad spend on a SKU cluster whose reviews are deteriorating and returns are rising.
- **Cadence/trigger:** Daily during campaigns.
- **Primary user → routed exec:** Pricing/Promotions + Category Head → Retail-Media / Growth.
- **1. Data aggregation.** Substrate: campaign/ad/promo spend, ROAS, returns, conversion. Interaction: deteriorating review sentiment, care-contact spikes, return reasons.
- **2. Baseline creation.** Per SKU: normal post-purchase voice + return profile relative to ad pressure.
- **3. Dynamic detection (cross-domain).** Rising ad spend co-moving with deteriorating voice/returns on the same SKU cluster.
- **4. Distillation.** Convert into a do-not-scale signal with the dominant downstream-damage reason; suppress healthy spend.
- **5. Surfacing & routing.** Card: SKU, spend trajectory, the downstream-damage evidence, "do not scale". Draft: pause/redirect. Human gate. Hero: a **spend-vs-damage join**.
- **Why it beats a self-built dashboard.** Ad ROAS dashboards rarely ingest text complaints or care transcripts; a campaign can look profitable until returns, complaints, and review damage are joined.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Ad spend on an apparel cluster rises 30% week-on-week while "fabric not as shown" complaints and returns climb in lockstep → ₹4.1L redirected `[illustrative]`.
- **Regulatory/governance hook.** Scaling deceptive-claim SKUs intersects dark-pattern/disclosure risk.
- **Feasibility.** [ARCH] attribution of voice to the promoted cohort. FP risk: moderate. [PM] strong, MVP #3 territory.

### UC-GPT-B3 — Seller SLA breach ↔ customer trust erosion
- **Archetype:** seller-risk causation join
- **Bucket:** B
- **Signal:** A seller's cancellation/late-dispatch rate rises and customer voice shows the lived trust damage ("seller cancelled after 3 days").
- **Cadence/trigger:** Weekly; alert on a breach cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships → CX / Trust & Safety.
- **1. Data aggregation.** Substrate: seller cancellation, late dispatch, ODR, GMV. Interaction: buyer care/reviews tied to that seller, repeat contacts.
- **2. Baseline creation.** Per seller tier: expected breach + trust-language profile.
- **3. Dynamic detection (cross-domain).** SLA breach co-moving with trust-erosion voice for the same seller, weighted by affected GMV.
- **4. Distillation.** Bind breach + voice into a seller-risk verdict with evidence; suppress isolated breaches.
- **5. Surfacing & routing.** Seller-risk card + evidence (quotes, issue clusters, affected GMV, category exposure). Draft: intervention/penalty/suppression. Human gate (FDI-aware). Hero: a **breach-plus-voice seller verdict**.
- **Why it beats a self-built dashboard.** Seller ops and CX are usually separate; account-health tools lack the customer-language evidence that shows a breach is actually destroying trust.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A seller's cancellation rate crosses tier baseline while "cancelled after I waited 3 days" quotes cluster → top of the risk board, ₹Y exposed `[illustrative]`.
- **Regulatory/governance hook.** Fall-back liability; FDI concentration cap as a remediation constraint.
- **Feasibility.** [ARCH] seller entity resolution. [REG] evidence pack is also a compliance artifact. FP risk: low-moderate.

### UC-GPT-B4 — Stockout/promise-date anomaly ↔ substitution frustration (hidden lost demand)
- **Archetype:** lost-demand join
- **Bucket:** B
- **Signal:** High-intent customers complain that preferred SKUs are unavailable/delayed, then switch to a competitor.
- **Cadence/trigger:** Real-time/daily; event-sharpened.
- **Primary user → routed exec:** Category Head + Operations → Supply/Planning.
- **1. Data aggregation.** Substrate: stock/availability, promise-date, search, cart. Interaction: "unavailable", "switched to X", "promised today, didn't come".
- **2. Baseline creation.** Per SKU/zone: normal availability and normal switching-intent voice.
- **3. Dynamic detection (cross-domain).** Stockout/promise-miss co-moving with switching-intent voice → hidden lost demand quantified from text + availability.
- **4. Distillation.** Rank by lost-demand signal × GMV; suppress low-impact stockouts.
- **5. Surfacing & routing.** Card: SKU/zone, lost-demand estimate, switching evidence. Draft: replenishment/promise tightening. Human gate. Hero: a **lost-demand-with-proof** figure.
- **Why it beats a self-built dashboard.** Lost demand is often invisible unless search, stock, cart, and complaint data are joined; GPT's "hidden lost demand from text + availability".
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A staple is out in two zones; "ordered from [competitor] instead" mentions spike → ₹1.8L weekly demand bleeding, two SKUs `[illustrative]`.
- **Regulatory/governance hook.** Quick-commerce delivery-promise constraint context.
- **Feasibility.** [ARCH] strong joins needed; FP risk moderate. [PM] strong q-com card.

### UC-GPT-B5 — Review sentiment ↔ conversion suppression at SKU/funnel
- **Archetype:** leading-indicator causation join
- **Bucket:** B
- **Signal:** PDP conversion drops because recent reviews mention fake product, poor quality, wrong shade, or damaged packaging.
- **Cadence/trigger:** Weekly; alert on a sentiment crash with sales exposure.
- **Primary user → routed exec:** Category Head → Catalogue + CX.
- **1. Data aggregation.** Interaction: recent aspect sentiment. Substrate: PDP conversion, sales exposure.
- **2. Baseline creation.** Per SKU: normal aspect mix and normal conversion; averages excluded.
- **3. Dynamic detection (cross-domain).** A recent negative aspect co-moving with a conversion dip on a high-exposure SKU.
- **4. Distillation.** Surface aspect + exposure + conversion delta; suppress slow averages.
- **5. Surfacing & routing.** Card: SKU, aspect, conversion impact, GMV exposure. Draft: catalogue/quality fix. Human gate. Hero: an **aspect-driven conversion-loss** figure.
- **Why it beats a self-built dashboard.** Aspect-level sentiment is rarely joined to funnel metrics; the conversion bleed stays hidden behind a stable star average.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** "Wrong shade" hits 19% of recent reviews on a foundation SKU; conversion −6% while the average holds 4.0★ → ₹Y exposed `[illustrative]`.
- **Regulatory/governance hook.** Misleading-image/claim exposure.
- **Feasibility.** [ARCH] aspect + funnel join. FP risk moderate. [PM] strong.

### UC-GPT-B6 — Dark-pattern UI ↔ revenue-driving pattern complaint join
- **Archetype:** compliance causation join
- **Bucket:** B
- **Signal:** A UI pattern that lifts conversion (false urgency, drip pricing) is generating manipulation complaints — revenue and regulatory risk in tension.
- **Cadence/trigger:** Real-time around offers.
- **Primary user → routed exec:** Legal/Compliance → Growth + Category.
- **1. Data aggregation.** Substrate: conversion/AOV, offer/checkout config. Interaction: dark-pattern complaint clusters (from A6); UI/session evidence where available.
- **2. Baseline creation.** Normal conversion per offer; normal manipulation-complaint rate.
- **3. Dynamic detection (cross-domain).** Conversion lift co-moving with a manipulation-complaint surge tied to the same UI element.
- **4. Distillation.** Separate genuine demand from manipulation-linked lift; keep the evidence.
- **5. Surfacing & routing.** Card/registry: the pattern, the UI element, evidence, complaint volume. Draft: compliance hold. Strict human gate. Hero: an **auditable dark-pattern registry** entry.
- **Why it beats a self-built dashboard.** Product analytics rewards conversion while compliance sees complaints later; full-coverage, auditable monitoring of deceptive-design signals is the gap.
- **Differentiation:** **requires the join — does not exist today** (with a UI-evidence caveat to prove design causality).
- **Worked example.** A countdown-timer change lifts conversion 8% while "fake urgency / item wasn't actually selling out" mentions surge → flagged with evidence `[illustrative]`.
- **Regulatory/governance hook.** Dark Patterns Guidelines 2023; CCPA 5 June 2025 advisory; E-Commerce Rules 2020.
- **Feasibility.** [REG] high. [ARCH] proving causality from text needs UI/session evidence. [PM] evidence only.

### UC-GPT-B7 — Protected-attribute inference guardrail (cohort-safe segmentation)
- **Archetype:** compliance-as-a-join (privacy guardrail)
- **Bucket:** B
- **Signal:** Category teams want demographic/geographic segmentation that risks inferring protected attributes from voice or proxying them via geography.
- **Cadence/trigger:** Continuous (a guardrail under every other card).
- **Primary user → routed exec:** [REG]/DPO → Category + CX.
- **1. Data aggregation.** Interaction: voice corpus (which can reveal sensitive personal data unintentionally). Substrate: segmentation/geography requested.
- **2. Baseline creation.** A policy baseline of permissible cohort cuts vs cuts that proxy a protected attribute.
- **3. Dynamic detection (cross-domain).** Flag any insight or proposed action whose cohort/geography slice could proxy a protected attribute or that infers sensitive data from text.
- **4. Distillation.** Separate *insight* (often permissible) from *differential action* (gated); apply redaction/minimisation; aggregate.
- **5. Surfacing & routing.** Guardrail banner on the affected card: "insight permissible, action gated". Draft: risk-review routing. Mandatory human + risk review. Hero: a **protected-attribute guardrail** state.
- **Why it beats a self-built dashboard.** No BI tile separates a permissible insight from a discriminatory action; GPT is explicit that text can reveal sensitive data and that DPDP/consumer-protection risk rises with naive segmentation.
- **Differentiation:** **requires the join — does not exist today** (it is the join's safety layer).
- **Worked example.** A "restrict COD for pin-code X" proposal is auto-flagged as geography-proxy risk and routed to risk review before any action `[illustrative]`.
- **Regulatory/governance hook.** DPDP 2023/Rules 2025 (children, consent, minimisation); FDI non-discrimination; consumer-protection fair-treatment.
- **Feasibility.** [REG] essential and differentiating. [ARCH] PII redaction + proxy detection. [PM] makes every other card shippable. FP risk: deliberately conservative.

### UC-GPT-B8 — Refund-delay ↔ grievance / regulatory-exposure + reconciliation join
- **Archetype:** escalation + finance join
- **Bucket:** B
- **Signal:** Refund delays co-move with grievance escalation and also move the TCS/settlement base.
- **Cadence/trigger:** Daily; alert on a surge.
- **Primary user → routed exec:** CX/Grievance → Compliance + Finance.
- **1. Data aggregation.** Substrate: refund ledger/SLA, return/cancellation, GSTR-8/TCS base. Interaction: escalation-language complaint clusters (from A8).
- **2. Baseline creation.** Normal refund-delay rate, escalation-language share, and return-driven settlement base.
- **3. Dynamic detection (cross-domain).** Refund-delay co-moving with escalation language *and* an abnormal return/cancellation move in the settlement base.
- **4. Distillation.** Surface the regulatory-exposure cohort and the reconciliation impact together; suppress resolved cases.
- **5. Surfacing & routing.** Card: the escalation cohort + the settlement-base impact. Draft: priority resolution + finance reconciliation flag. Human gate. Hero: an **exposure-plus-reconciliation** pairing.
- **Why it beats a self-built dashboard.** Compliance and finance see these separately; the join shows that the same refund-delay cluster is both a grievance risk and a settlement-base movement.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Refund-delay escalations spike post-sale while return-driven TCS base shifts materially in the same cluster `[illustrative]`.
- **Regulatory/governance hook.** E-Commerce Rules grievance timelines; GST TCS (s.52) net-of-returns; GSTR-8 monthly.
- **Feasibility.** [ARCH] finance-feed join is extra plumbing. [REG] strong. FP risk: low.

### UC-GPT-B9 — Festival "real demand vs failure signal" discriminator
- **Archetype:** event-integrity join
- **Bucket:** B
- **Signal:** During a sale, which spike is genuine demand and which is a failure signal (payment failure, bot orders, seller fraud)?
- **Cadence/trigger:** Real-time, festival windows.
- **Primary user → routed exec:** Category Head + Trust & Safety → Ops / Growth.
- **1. Data aggregation.** Substrate: order/payment/funnel spikes, seller-account signals. Interaction: real-time complaint/care/social anomaly.
- **2. Baseline creation.** Auto-adaptive, day-type-aware baselines so a sale-day spike is expected, not flagged.
- **3. Dynamic detection (cross-domain).** A demand spike with no co-moving failure voice → real; a spike co-moving with payment-failure/fraud voice → failure signal.
- **4. Distillation.** Label each spike; suppress expected sale-day movement; rank failure signals by GMV/trust risk.
- **5. Surfacing & routing.** Card: the spike, its label, the deciding voice band. Draft: ops/fraud escalation. Human gate. Hero: a **real-vs-failure verdict**.
- **Why it beats a self-built dashboard.** Threshold alerts break on sale days; a substrate-only view cannot tell a genuine surge from a failure surge without the voice anomaly.
- **Differentiation:** **requires the join — does not exist today** (and depends on festival-scale baselining).
- **Worked example.** A 3× order spike on one SKU co-moves with "payment deducted, no order" complaints → failure signal, not demand `[illustrative]`.
- **Regulatory/governance hook.** Auditable evidence for any fraud/abuse action.
- **Feasibility.** [ARCH] this is the festival false-positive problem; baselining is the gating capability. [PM] notes it is a capability under many cards, not a standalone product. FP risk: the whole point.

---

## Panel Notes (GPT run)

**Sharpest disagreements to carry to merge.**
1. **[ARCH] vs [DUAL] on causality from text (A1/B1).** [ARCH] repeatedly warns against over-claiming causality from text alone; [DUAL] argues a strong *directional* explanation tied to GMV/return exposure is already action-worthy. Resolution lever: surface a correlation-evidence band on every join card and keep claims directional, never deterministic.
2. **Promo guardrail authority (A2/B2).** GPT positions the "do not promote" verdict as a category-P&L control, which puts LiSN between Retail-Media's ROAS optimisation and the Category Head. Whose call wins when ROAS is high but voice is bad is an org-seam decision to flag for Stage 3.
3. **Dark-pattern proof gap (A6/B6).** GPT is candid that complaint text shows the *symptom* but proving *design* causality may need UI/session evidence from product analytics — i.e. LiSN supplies evidence and early warning, not an enforcement verdict. Important boundary for the compliance cards.
4. **MVP ladder vs recall.** GPT hands a clean sequence (return-reason → seller/SKU trust-risk → promo guardrail → regulatory early-warning). Treat as sequencing input for Stage 3; do not let it pre-rank the longlist at Stage 2.

**Five strongest UI candidates from this source.**
- The **three-state promote verdict** (promote / caution / do-not-promote) with the one dominant reason and ad-spend-at-risk (A2).
- The **seller/SKU trust-risk board** where every row opens an **evidence pack** of quotes + affected GMV (A3/B3).
- The **why-it-moved cause statement** for any operational anomaly, with the routed owner (B1).
- The **protected-attribute guardrail** state — "insight permissible, action gated" — sitting on top of segmentation cards (B7).
- The **real-vs-failure verdict** for festival spikes (B9).

**Recall note — distinct GPT gems to preserve at merge (do not let consensus drop these).**
- The **"do not promote / promote with caution / safe to scale"** guardrail as a named, three-state category-P&L control (A2/B2) — GPT's signature contribution.
- **Protected-attribute inference as a first-class use case** (B7) — only GPT elevates the privacy guardrail to a card rather than a footnote.
- **Operator-grounded seller metrics** (Amazon ODR < 1%, Flipkart seller-cancellation-rate definition, seller tiering by GMV/fulfilment/return) as baseline anchors for the seller-risk cards.
- The **TCS-net-of-returns reconciliation hook** (A1/B8) — GPT ties returns to the settlement base and GSTR-8, a finance angle the others under-weight.
- The **MVP ladder** (return-reason → seller/SKU trust-risk → promo guardrail → regulatory early-warning) as Stage-3 sequencing input.
- The **worked-example grammar** ("rose 18%; 42% mention size mismatch; reviews mention misleading images; seller cancellation above benchmark") — reuse as the house style for join cards.
- **ONDC IGM (Issue & Grievance Management)** as the cross-network complaint-intelligence surface `[single]`.
