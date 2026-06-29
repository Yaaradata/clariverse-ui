# Stage 1 — Per-Source Use-Case Mining

**SOURCE ENGINE: Claude (Opus 4.x)** · LiSN retail / e-commerce category intelligence
**Run against:** `Lisn_Ph1_Retailresearch_Opus_25June26.txt` (Stage 0 report, mined in isolation — not from any merge)
**Panel:** [ARCH] retail data/ML architect · [DUAL] Category + CX lead · [PM] intelligence-platform PM · [REG] consumer-protection adviser
**Recall mandate in force.** Long-tail, single-source and inferred use cases are kept and tagged, never dropped. Ranking happens only at Stage 2.

---

## How this run read the Opus source

Opus is the deepest of the four runs and the only one that gives the build a working **detectability theory**: auto-adaptive baselining across **DENSE / BURSTY / SPARSE** demand regimes so a Diwali spike (Flipkart + Amazon ≈ ₹50,000 cr in ~10 days; off-season daily GMV down 70%+) is not flagged as an incident. It also supplies the sharpest **margin-vs-cause anchor** — GoKwik's finding that **60–70% of RTOs come from low buying intent / customer psychology and only 20–25% from logistics** — which is the empirical basis for deciding whether a return is an *operational* problem or a *voice* problem. Opus is explicit about the **boundary that creates defensibility**: LiSN wins where the answer lives in the customer's words and needs only a thin operational summary to become a P&L story, and *loses* on pure operational optimisation (dynamic pricing, inventory placement, dark-store routing, demand forecasting) that belongs to the lakehouse owner. It carries a domain spine every card must trace — **Customer Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action** — the **insight-permissible / differential-action-gated** compliance principle, and a set of named **single-source gems** (null-search assortment-gap demand; CSAT→repeat-buyer causal join; pin-code CX-to-RTO; app-store rating ↔ app-release regression; counterfeit from review + return co-occurrence; voice-of-seller churn). I have mined the six named never-made joins as the spine and preserved every single-source gem as its own card rather than averaging it into the headline join.

---

## Bucket A — Pipeline use cases that beat a self-built dashboard

### UC-OPUS-A1 — Auto-adaptive anomaly engine (DENSE / BURSTY / SPARSE baselining)
- **Archetype:** substrate-side anomaly distillation (the capability under every card)
- **Bucket:** A
- **Signal:** An operational metric breaks its own *regime-aware* baseline, not a flat threshold — so a sale-day surge is expected, not alarming.
- **Cadence/trigger:** Continuous; sharpest in festival windows.
- **Primary user → routed exec:** Category Head → all routed functions.
- **1. Data aggregation.** Substrate: order/GMV, funnel, returns, stock, seller-SLA event streams. Interaction: none in v1 (this is the baselining layer the voice joins sit on).
- **2. Baseline creation.** Classify each SKU/seller/lane/category into a demand regime — DENSE (high steady volume), BURSTY (sale-driven), SPARSE (long-tail) — and baseline each differently; encode festival concentration and the 70%+ off-season drop as expected structure.
- **3. Dynamic detection.** Flag deviation *relative to the cell's regime baseline*, so a 3× sale-day spike in a BURSTY cell is normal while the same move in a DENSE cell is an incident.
- **4. Distillation.** Suppress regime-expected movement; rank residual anomalies by P&L exposure.
- **5. Surfacing & routing.** Anomaly card with the regime context stated. Human gate on any action. Hero: a **regime-aware "is this real?" badge**.
- **Why it beats a self-built dashboard.** Threshold BI breaks on sale days and drowns the Head in false positives; Opus names this as the single biggest detectability risk and the adoption gate.
- **Differentiation:** substrate-visible (the foundation for every Bucket B join).
- **Worked example.** A DENSE grocery staple drops 18% mid-week against its own regime band → real; a BURSTY apparel SKU spikes 4× on sale day → expected, suppressed `[illustrative]`.
- **Regulatory/governance hook.** None primary; underpins auditable evidence for every downstream card.
- **Feasibility.** [ARCH] owns this; the hard part is regime classification and seasonal honesty. [PM] notes it is a *capability* under every card, not a standalone product — package accordingly. FP risk: this is the whole point.

### UC-OPUS-A2 — Return-reason free-text distillation (corpus-side, pre-join)
- **Archetype:** interaction-side reason-layer distillation
- **Bucket:** A
- **Signal:** The return free-text the operator already holds resolves a generic reason code into a specific, rankable cause.
- **Cadence/trigger:** Weekly; faster on a launch.
- **Primary user → routed exec:** Category Head → Catalogue + Seller-Brand + CX.
- **1. Data aggregation.** Interaction: return free-text + reviews + care chat (all operator-held). Substrate: SKU/seller keys only.
- **2. Baseline creation.** Per SKU/seller: normal return-reason mix; separate intent/psychology returns from product-fault returns using the GoKwik split as a prior.
- **3. Dynamic detection.** A shift in the dominant free-text cause vs baseline, distinguishing "buyer remorse" from "not as described / wrong size / quality".
- **4. Distillation.** Collapse verbatims into ranked causes; tag each as content/seller-fixable vs intent-driven; suppress steady-state.
- **5. Surfacing & routing.** Card: SKU, ranked causes with the fixable share isolated. Draft: catalogue/seller action on the fixable share only. Human gate. Hero: a **fixable-vs-intent return split**.
- **Why it beats a self-built dashboard.** Returns platforms read reason *codes*, VoC reads *sentiment*; neither isolates the content/seller-fixable share that a Category Head can actually act on.
- **Differentiation:** interaction-visible (joins margin/seller in UC-OPUS-B2).
- **Worked example.** On a denim SKU, 64% of returns are intent/psychology (per the GoKwik prior) and 26% are "fabric thinner than photo" — only the 26% is catalogue-actionable `[illustrative]`.
- **Regulatory/governance hook.** TCS computed net of returns; the return base moves settlement.
- **Feasibility.** [ARCH] separating intent from fault is the nuance; keep directional. [DUAL] Category fixes the listing, CX pre-empts the ticket. FP risk: moderate.

### UC-OPUS-A3 — Pre-emptive launch / catalogue-defect detection from voice
- **Archetype:** interaction-side leading-indicator distillation
- **Bucket:** A
- **Signal:** Review-velocity and rating-distribution shift on a new launch foretell a return wave before GMV craters.
- **Cadence/trigger:** Daily during a launch window.
- **Primary user → routed exec:** Category Head → Catalogue + Seller-Brand.
- **1. Data aggregation.** Interaction: early reviews, ratings distribution, Q&A, care chat on the launch SKU. Substrate: launch funnel + sales velocity (light).
- **2. Baseline creation.** Per launch archetype: normal early review velocity and rating-distribution shape in the first N days.
- **3. Dynamic detection.** A rating-distribution skew or aspect cluster emerging faster than the launch archetype baseline.
- **4. Distillation.** Surface the emerging defect aspect; suppress normal launch noise; rank by projected return exposure.
- **5. Surfacing & routing.** Card: launch SKU, the early defect signal, projected return wave. Draft: catalogue fix / seller hold / listing pause. Human gate. Hero: an **early launch-defect alert**.
- **Why it beats a self-built dashboard.** VoC is brand-side and not joined to the operator's launch funnel; the return wave is only visible in BI after it has already happened.
- **Differentiation:** interaction-visible (full join in UC-OPUS-B4).
- **Worked example.** Day-3 of a kettle launch, 1-star share is double the launch baseline and "leaks" dominates aspects → projected 22% return wave flagged pre-peak `[illustrative]`.
- **Regulatory/governance hook.** Product-safety / fall-back liability if the defect is hazardous.
- **Feasibility.** [ARCH] launch-archetype baselines with sparse early data is the challenge. FP risk: moderate. [PM] strong, high-drama demo card.

### UC-OPUS-A4 — Regulatory-grade conduct & CX monitoring from the corpus
- **Archetype:** interaction-side compliance monitor (full-coverage, auditable)
- **Bucket:** A
- **Signal:** Dark-pattern, grievance-SLA, and consent-safe-analytics obligations all demand full-coverage, auditable, explainable evidence the corpus is uniquely placed to supply.
- **Cadence/trigger:** Weekly; real-time around offers and grievance spikes.
- **Primary user → routed exec:** [REG]/Compliance + CX/VoC Head → Legal + Growth.
- **1. Data aggregation.** Interaction: full corpus at 100% coverage (care, reviews, social, app-store, grievance/NCH text) with an immutable audit log. Substrate: offer/journey metadata, grievance-SLA timestamps.
- **2. Baseline creation.** Normal rate per conduct topic (dark-pattern language, grievance-delay language) per journey/offer; consent-safe cohort definitions.
- **3. Dynamic detection.** Topic-cluster surge tied to an offer/journey change or a grievance-SLA breach.
- **4. Distillation.** Keep manipulation/grievance-specific evidence with provenance; suppress generic gripes; assemble an audit-ready registry.
- **5. Surfacing & routing.** Evidence registry: pattern/issue, verbatims, journey, count, timestamp. Draft: compliance flag. Strict human gate. Hero: a **full-coverage audit registry** entry.
- **Why it beats a self-built dashboard.** The 5 June 2025 CCPA self-audit advisory prescribes no methodology; DPDP demands DPIA + independent audit for Significant Data Fiduciaries; neither BI nor brand-side VoC supplies 100%-coverage auditable evidence. Owning the full corpus + audit log is the asset.
- **Differentiation:** interaction-visible (causation join in UC-OPUS-B6).
- **Worked example.** "Couldn't cancel" mentions cluster for two weeks after a loyalty-flow change, packaged with timestamps and verbatims as an audit artifact `[illustrative]`.
- **Regulatory/governance hook.** Dark Patterns Guidelines 2023 (13 patterns); CCPA advisory (notices to 11 platforms, 26 self-declarations by Nov 2025); DPDP Rules (G.S.R. 846(E), 13–14 Nov 2025), children/consent, 72-hour breach, SDF audit; ≥1-year retention even after deletion; ₹250 cr penalty exposure.
- **Feasibility.** [REG] highest-urgency, budget-bearing wedge. [ARCH] PII redaction + provenance at scale. [PM] evidence only, never enforcement.

### UC-OPUS-A5 — Null-search → assortment-gap demand signal `[single, NEW — beyond file]`
- **Archetype:** substrate × interaction unmet-demand surfacing
- **Bucket:** A
- **Signal:** What customers ask for that the platform does not stock — zero-result searches plus "do you have…" in reviews/care.
- **Cadence/trigger:** Weekly/strategic.
- **Primary user → routed exec:** Category Head → Buying/Assortment.
- **1. Data aggregation.** Substrate: search null-result logs, browse queries. Interaction: "do you have / when will you stock…" in reviews, Q&A, care chat.
- **2. Baseline creation.** Per category/geography: normal null-result rate and normal unmet-request themes.
- **3. Dynamic detection.** A null-search theme co-occurring with rising explicit voice requests for the same item/attribute.
- **4. Distillation.** Cluster into named assortment gaps; rank by estimated demand and repeatability.
- **5. Surfacing & routing.** Card: the gap, demand estimate, evidence. Draft: assortment/buying proposal. Human gate. Hero: an **assortment-gap demand card**.
- **Why it beats a self-built dashboard.** Search analytics shows zero-results as a funnel failure; it does not name the *demand* behind them or corroborate it with explicit customer asks — a gap neither BI nor VoC closes.
- **Differentiation:** **requires the join — does not exist today** (placed in A as a demand-surfacing capability; the corroboration is the join).
- **Worked example.** 9,000 null searches for "millet atta 5kg" in a metro cluster co-occur with 140 "do you stock…" asks → quantified assortment gap `[illustrative]`.
- **Regulatory/governance hook.** None primary; cohort-level only.
- **Feasibility.** [ARCH] query normalisation + intent clustering. FP risk: low. [PM] distinctive, buyer-resonant.

### UC-OPUS-A6 — Catalogue/content-completeness score → "not as described" returns `[single]`
- **Archetype:** interaction-side catalogue-quality distillation
- **Bucket:** A
- **Signal:** Listings whose content gaps generate avoidable "not as described" returns.
- **Cadence/trigger:** Weekly.
- **Primary user → routed exec:** Category Head → Catalogue/PIM.
- **1. Data aggregation.** Interaction: "not as described" returns/reviews naming a missing attribute. Substrate: catalogue field-completeness, SKU returns.
- **2. Baseline creation.** Per category: normal completeness and the link between completeness and return rate.
- **3. Dynamic detection.** Low-completeness listings whose "not as described" voice and return rate exceed baseline.
- **4. Distillation.** Map missing attributes to the returns they cause; rank by avoidable-return margin.
- **5. Surfacing & routing.** Card: listing, the missing attribute driving returns, avoidable margin. Draft: PIM enrichment. Human gate. Hero: a **completeness-to-returns** link.
- **Why it beats a self-built dashboard.** A completeness tile is a field-presence check; it does not tie a specific gap to the specific returns it causes in the customer's words.
- **Differentiation:** interaction-visible, projecting onto catalogue.
- **Worked example.** Listings missing a "material" field show 2.3× the "not as described" return rate of complete peers `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology declarations.
- **Feasibility.** [ARCH] attribute-to-return mapping. FP risk: low. [DUAL] both owners act.

### UC-OPUS-A7 — Seller-quality early warning from the seller-support + buyer corpus
- **Archetype:** interaction-side seller risk
- **Bucket:** A
- **Signal:** Negligence/quality themes cluster against a seller in seller-support and buyer voice before SLA thresholds trip.
- **Cadence/trigger:** Weekly; alert on a cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships → Trust & Safety.
- **1. Data aggregation.** Interaction: seller-support tickets + buyer care/reviews keyed to seller ID. Substrate: seller SLA, GMV concentration.
- **2. Baseline creation.** Per seller tier: expected complaint-theme mix and rate.
- **3. Dynamic detection.** Negligence-theme share rising for a seller vs peer baseline.
- **4. Distillation.** Require cluster persistence; rank by GMV exposure and severity; suppress one-offs.
- **5. Surfacing & routing.** Seller-risk card with quote evidence and affected GMV. Draft: review / coaching / visibility hold (FDI-aware). Human gate. Hero: a **seller early-warning pack**.
- **Why it beats a self-built dashboard.** Seller account-health tools track cancellation/late-shipment/ODR but lack customer-language evidence; qualitative negligence is invisible to a rate tile until trust is gone.
- **Differentiation:** interaction-visible (joins SLA + concentration in UC-OPUS-B5).
- **Worked example.** A seller's "counterfeit" theme triples while its ODR is still within range `[illustrative]`.
- **Regulatory/governance hook.** Fall-back liability; FDI 25% concentration cap as a remediation constraint.
- **Feasibility.** [ARCH] seller entity resolution. [REG] evidence pack doubles as compliance artifact.

### UC-OPUS-A8 — Review-sentiment → returns/churn leading indicator
- **Archetype:** interaction-side leading-indicator distillation
- **Bucket:** A
- **Signal:** Sentiment/aspect shift is a leading indicator of returns and churn — but only valuable when joined to those outcomes.
- **Cadence/trigger:** Weekly; alert on a crash.
- **Primary user → routed exec:** CX/VoC Head → Category Head.
- **1. Data aggregation.** Interaction: reviews, ratings, aspect sentiment. Substrate: returns and repeat-rate keys.
- **2. Baseline creation.** Per SKU/brand: normal aspect-sentiment mix; the slow star average is explicitly not the baseline.
- **3. Dynamic detection.** A negative aspect rising sharply against its own trailing mix on an exposed SKU.
- **4. Distillation.** Surface the change in slope, not the level; rank by GMV exposure.
- **5. Surfacing & routing.** Card: SKU, the aspect, trajectory, exposure. Draft: catalogue/quality action. Human gate. Hero: an **aspect-trajectory** signal.
- **Why it beats a self-built dashboard.** NPS/CSAT are lagging and gameable; a continuous aspect monitor catches the cliff days before the headline metric — and Opus stresses this is only valuable when joined to returns/churn outcomes.
- **Differentiation:** interaction-visible (joins outcomes in UC-OPUS-B7).
- **Worked example.** "Battery" negative share rises from 5% to 21% on a wearable in nine days while the 4.1★ rating holds `[illustrative]`.
- **Regulatory/governance hook.** PII redaction; cohort-level reporting.
- **Feasibility.** [ARCH] aspect extraction + Indian-language nuance. FP risk: moderate.

### UC-OPUS-A9 — Voice-of-seller churn prediction `[single, long-tail — preserve]`
- **Archetype:** interaction-side seller-retention predictor
- **Bucket:** A
- **Signal:** Seller-support sentiment and dispute language predict seller churn before the seller leaves.
- **Cadence/trigger:** Monthly/strategic.
- **Primary user → routed exec:** Seller-Brand Partnerships → Head of Category.
- **1. Data aggregation.** Interaction: seller-support tickets, dispute transcripts, seller sentiment. Substrate: seller SLA, payout/dispute history, GMV concentration.
- **2. Baseline creation.** Per seller cohort: normal support-sentiment and dispute profile vs eventual-churn cohorts.
- **3. Dynamic detection.** Rising frustration/dispute language matching a known pre-churn signature.
- **4. Distillation.** Surface at-risk strategic sellers; rank by GMV and assortment criticality.
- **5. Surfacing & routing.** Card: seller, churn-risk signal, evidence. Draft: retention/coaching outreach. Human gate. Hero: a **seller churn-risk** flag.
- **Why it beats a self-built dashboard.** Seller dashboards show breaches, not the frustration trajectory that precedes a strategic seller walking to a zero-commission rival.
- **Differentiation:** interaction-visible.
- **Worked example.** A top-quartile seller's "opaque reconciliation" complaint rate triples over two months, a pre-churn signature `[illustrative]`.
- **Regulatory/governance hook.** FDI non-discrimination on any differential retention terms.
- **Feasibility.** [ARCH] pre-churn signature needs labelled history; FP risk moderate. [PM] strategic, not real-time.

---

## Bucket B — Net-new substrate × customer-voice joins that do not exist today

### UC-OPUS-B1 — Operational-anomaly ↔ customer-voice join, against an auto-adaptive baseline (the headline join)
- **Archetype:** anomaly-causation join
- **Bucket:** B
- **Signal:** A GMV/funnel/SLA/rating anomaly is named by the co-moving voice anomaly, scored against a regime-aware baseline.
- **Cadence/trigger:** Daily; real-time in festival windows.
- **Primary user → routed exec:** Category Head → the owning function; CX/VoC Head reads the same card with a different first action.
- **1. Data aggregation.** Substrate: order/GMV, funnel, returns, stock, seller-SLA anomaly streams. Interaction: reviews, care chat/call, return free-text, social — voice-anomaly streams. Cohort-level, not identity-level.
- **2. Baseline creation.** DENSE/BURSTY/SPARSE regime baselines on the operational side; per-topic baselines on the voice side.
- **3. Dynamic detection (cross-domain).** Time-aligned, cohort-level co-movement of an operational anomaly and a voice anomaly against both baselines.
- **4. Distillation.** Resolve to a single named cause; suppress regime-expected movement and co-incidental noise; rank by P&L exposure. Trace the domain spine end to end.
- **5. Surfacing & routing.** Card: "[number] moved because [voice cause], in [cohort/lane/SKU], costing [GMV/margin], owned by [function]." Correlation-evidence band shown. Draft: routed action. Human gate. Hero: the **why-it-moved cause statement**, with a Category first action and a CX first action on the same card.
- **Why it beats a self-built dashboard.** BI shows the number, VoC shows the sentiment, nobody co-moves them; a substrate-only copilot can show that a number moved but never why. Opus calls this the highest strategic-value, essentially unserved join.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A category's conversion drops 9% against its DENSE baseline while "coupon not applying" mentions surge in the same window → promo-config cause, ₹Y/hr exposed `[illustrative]`.
- **Regulatory/governance hook.** Insight permissible; differential action gated and audit-logged.
- **Feasibility.** [ARCH] trustworthy only with auto-adaptive baselining — the single biggest detectability risk. [PM] the spine under every card. [DUAL] same card, two first actions — whose surfaces first is the spec call. FP risk: high without baselining.

### UC-OPUS-B2 — Return-reason free text ↔ SKU margin & seller (with the GoKwik intent/fault split)
- **Archetype:** structural-margin-recovery join
- **Bucket:** B
- **Signal:** "Not as described / wrong size / quality" free-text becomes a category-contribution action, separated from intent-driven returns.
- **Cadence/trigger:** Weekly; faster on a launch.
- **Primary user → routed exec:** Category Head → Catalogue/PIM + Seller-Brand; CX pre-empts the ticket.
- **1. Data aggregation.** Substrate: return flags, SKU contribution, seller, reverse-logistics cost. Interaction: return free-text + reviews + care chat.
- **2. Baseline creation.** Per SKU/seller: normal return-reason mix; the GoKwik 60–70%-intent / 20–25%-logistics prior to separate psychology returns from product/content faults.
- **3. Dynamic detection (cross-domain).** Free-text fault themes co-moving with elevated returns and the contribution at stake, with the fixable share isolated from buyer-remorse.
- **4. Distillation.** Collapse verbatims into a structural defect; rank by recoverable contribution (fixable share × margin).
- **5. Surfacing & routing.** Card: SKU/seller, the fixable cause, recoverable contribution. Draft: catalogue fix / seller cull / re-price. Human gate. Hero: the **recoverable-margin figure** with the fixable-vs-intent split.
- **Why it beats a self-built dashboard.** Returns ≈ ₹2 lakh cr; the answer lives in free-text + reviews + care chat the operator already holds, and only a thin SKU-margin/seller summary is needed — yet no production system joins free-text reason → contribution → seller.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Returns on a shirt run at 31%; the GoKwik prior puts ~64% as intent, but the residual "chest narrow vs chart" fault is ₹6L recoverable contribution if the listing is fixed `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology; TCS net-of-returns; any PIM write is human-gated.
- **Feasibility.** [ARCH] separating intent from fault is the nuance and the moat. [DUAL] same card, two actions. FP risk: moderate.

### UC-OPUS-B3 — Delivery-SLA breach by pin-code/lane ↔ social & care voice by the same lane
- **Archetype:** lane-level operational-cause join
- **Bucket:** B
- **Signal:** Cancellations/RTO spike in a lane and the lane's voice says whether it is logistics or product.
- **Cadence/trigger:** Operational-weekly; real-time on a lane spike.
- **Primary user → routed exec:** Operations (City/Dark-store) → Category + Seller-Brand.
- **1. Data aggregation.** Substrate: RTO/NDR + delivery-SLA by pin-code/lane. Interaction: social + care voice by the same lane.
- **2. Baseline creation.** Per lane: normal SLA/RTO and normal voice-theme mix.
- **3. Dynamic detection (cross-domain).** SLA breach co-moving with delivery-theme voice (→ logistics) vs product-theme voice (→ seller) in the same lane.
- **4. Distillation.** Route to the correct owner with the deciding voice band; suppress the unsupported blame.
- **5. Surfacing & routing.** Card: lane, the verdict, the co-moving voice, affected GMV. Draft: lane ops escalation or seller review. Human gate (geography-as-proxy aware). Hero: a **lane blame-resolution verdict**.
- **Why it beats a self-built dashboard.** SLA-by-lane and voice-by-lane live in different systems; the lane-level cause is never co-moved in production.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A metro lane's RTO hits 33% vs a 21% baseline; lane voice is 70% "rider didn't attempt / marked undelivered" → logistics, not seller `[illustrative]`.
- **Regulatory/governance hook.** Pin-code-level *action* is gated (geography proxy); insight permissible. Jan-2026 "10-minute" marketing directive context.
- **Feasibility.** [ARCH] lane cohort join, sparse voice in small lanes. FP risk: moderate. [DUAL] resolves the standing org fight.

### UC-OPUS-B4 — Review/rating cliff on a launch ↔ release/checkout funnel change
- **Archetype:** launch-regression join
- **Bucket:** B
- **Signal:** A sentiment/rating cliff on a launch co-moves with a release or checkout funnel change.
- **Cadence/trigger:** Daily during a launch.
- **Primary user → routed exec:** Category Head → Catalogue + Product/Engineering.
- **1. Data aggregation.** Substrate: launch funnel + sales velocity + release/checkout change events. Interaction: reviews, UGC, app-store on the launch SKU.
- **2. Baseline creation.** Per launch archetype: normal rating/velocity curve and funnel stability.
- **3. Dynamic detection (cross-domain).** A rating cliff co-timed with a release/checkout change → regression cause vs a product-defect cause.
- **4. Distillation.** Bind the two streams into one verdict; suppress normal launch noise.
- **5. Surfacing & routing.** Card: launch SKU, the cliff, the co-moving change, the verdict. Draft: rollback / catalogue fix / seller hold. Human gate. Hero: a **launch-regression verdict**.
- **Why it beats a self-built dashboard.** Sentiment cliffs and release/funnel changes are rarely co-moved; the team cannot tell a checkout regression from a product defect without the join.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A launch's rating drops a full star 12 hours after a checkout-flow release; voice cites "couldn't apply launch offer" → regression, not defect `[illustrative]`.
- **Regulatory/governance hook.** None primary; auditable evidence retained.
- **Feasibility.** [ARCH] reliable release-event feed needed. FP risk: moderate.

### UC-OPUS-B5 — Seller-support theme ↔ seller SLA & GMV concentration (FDI 25% cap as constraint)
- **Archetype:** seller-risk + concentration join
- **Bucket:** B
- **Signal:** A seller's support themes co-move with SLA breaches while its GMV share approaches the FDI concentration cap.
- **Cadence/trigger:** Monthly/strategic; alert on a breach cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships → Head of Category + Compliance.
- **1. Data aggregation.** Substrate: seller SLA, GMV concentration (single-vendor share), payout/dispute. Interaction: seller-support + buyer voice keyed to the seller.
- **2. Baseline creation.** Per seller tier: expected SLA + theme profile; the 25% single-vendor GMV cap as a hard constraint band.
- **3. Dynamic detection (cross-domain).** Support-theme + SLA-breach co-movement on a seller whose concentration is rising toward the cap.
- **4. Distillation.** Produce a seller-risk verdict that also flags concentration exposure; suppress isolated breaches.
- **5. Surfacing & routing.** Card: seller, breach + voice + concentration, affected GMV. Draft: remediation that respects the cap and non-discrimination. Human gate. Hero: a **risk-plus-concentration** verdict.
- **Why it beats a self-built dashboard.** Seller-side voice ↔ seller P&L is rarely joined, and the concentration cap is a compliance constraint a CX tile never sees.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A seller at 23% category GMV (near the 25% cap) shows rising "wrong item shipped" voice and SLA misses → remediation must avoid both trust loss and a cap breach `[illustrative]`.
- **Regulatory/governance hook.** FDI Press Note 2 (25% cap, non-discrimination, RBI annual certificate); fall-back liability.
- **Feasibility.** [ARCH] concentration computation + seller resolution. [REG] strong. FP risk: low-moderate.

### UC-OPUS-B6 — UI/checkout behaviour ↔ voice of manipulation (dark-pattern self-audit evidence)
- **Archetype:** compliance causation join
- **Bucket:** B
- **Signal:** A checkout/UI behaviour co-moves with "I was tricked / charged extra" voice — the dark-pattern self-audit evidence the advisory leaves unspecified.
- **Cadence/trigger:** Real-time around offers.
- **Primary user → routed exec:** [REG]/Compliance → Growth + Category.
- **1. Data aggregation.** Substrate: checkout/UI config + change events, conversion/AOV. Interaction: manipulation-language complaint clusters with provenance.
- **2. Baseline creation.** Normal conversion/AOV per offer; normal manipulation-language rate.
- **3. Dynamic detection (cross-domain).** A conversion/AOV lift co-moving with a manipulation-complaint surge tied to the same UI element.
- **4. Distillation.** Separate genuine demand from manipulation-linked lift; retain audit-ready evidence.
- **5. Surfacing & routing.** Registry: the UI element, the complaint pattern, evidence, timestamp. Draft: compliance hold. Strict human gate. Hero: an **audit-ready dark-pattern registry** entry.
- **Why it beats a self-built dashboard.** UI behaviour ↔ voice-of-manipulation is a never-made join; the June-2025 advisory prescribes no method, so full-coverage auditable evidence is exactly the open gap.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A countdown-timer change lifts AOV 7% while "fake urgency" mentions surge → flagged with evidence and timestamp `[illustrative]`.
- **Regulatory/governance hook.** Dark Patterns Guidelines 2023; CCPA advisory; E-Commerce Rules 2020 Rule 4(9).
- **Feasibility.** [REG] highest urgency. [ARCH] linking UI config to complaint language; provenance is the moat. [PM] evidence only.

### UC-OPUS-B7 — CSAT → repeat-buyer causal join (does fixing the complaint lift retention?) `[single]`
- **Archetype:** retention-causality join
- **Bucket:** B
- **Signal:** Whether resolving a complaint type actually lifts repeat purchase — closing the loop VoC never closes.
- **Cadence/trigger:** Strategic-monthly (cohort study, ongoing).
- **Primary user → routed exec:** CX/VoC Head → Category + Growth.
- **1. Data aggregation.** Interaction: complaint type + resolution outcome by cohort. Substrate: repeat-rate / cohort LTV.
- **2. Baseline creation.** Resolved vs unresolved cohorts matched on prior behaviour; normal repeat-rate.
- **3. Dynamic detection (cross-domain).** A resolved-complaint cohort showing a repeat-rate lift over a matched unresolved cohort, attributable to the fix.
- **4. Distillation.** Rank complaint types by retention lift per fix; suppress fixes with no measurable lift.
- **5. Surfacing & routing.** Card: complaint type, measured retention lift, value of fixing it. Draft: prioritise the highest-lift fixes. Human gate. Hero: a **fix-to-retention** value.
- **Why it beats a self-built dashboard.** VoC tools report CSAT; none prove that fixing a specific complaint moves retention and LTV — the causal loop that justifies CX investment to a Category Head.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Resolving "late delivery on first order" lifts 60-day repeat by 4pts vs a matched cohort → high-priority fix `[illustrative]`.
- **Regulatory/governance hook.** Cohort-level; no protected-attribute proxying.
- **Feasibility.** [ARCH] causal design (matching/holdouts) is genuinely hard; keep as directional study. FP risk: high if naive. [DUAL] the card that earns CX its P&L seat.

### UC-OPUS-B8 — Pin-code-level CX-to-RTO join `[single]`
- **Archetype:** geography experience-to-loss join
- **Bucket:** B
- **Signal:** CX failures concentrated in a pin-code co-move with RTO in the same pin-code.
- **Cadence/trigger:** Weekly; alert on a pin-code spike.
- **Primary user → routed exec:** Operations + Category → CX.
- **1. Data aggregation.** Substrate: RTO by pin-code. Interaction: CX complaint themes by pin-code.
- **2. Baseline creation.** Per pin-code: normal RTO and normal CX-theme mix.
- **3. Dynamic detection (cross-domain).** RTO and a CX-failure theme co-rising in the same pin-code.
- **4. Distillation.** Surface the pin-codes where experience is driving RTO; suppress noise.
- **5. Surfacing & routing.** Card: pin-code, RTO, the CX cause, exposure. Draft: cohort-level fix. Human gate (geography proxy aware). Hero: a **pin-code CX→RTO** link.
- **Why it beats a self-built dashboard.** RTO-by-pin-code and CX-by-pin-code are never co-moved; the experience driver of RTO stays hidden.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Three pin-codes show RTO 8pts above baseline co-moving with "address/locality not found" complaints → addressing/serviceability fix `[illustrative]`.
- **Regulatory/governance hook.** Differential pin-code action gated (geography proxy); insight permissible.
- **Feasibility.** [ARCH] sparse voice per pin-code is the limit. FP risk: moderate.

### UC-OPUS-B9 — App-store rating ↔ app-release regression join `[single]`
- **Archetype:** product-regression join
- **Bucket:** B
- **Signal:** An app-store rating drop co-moves with an app release — a regression hurting conversion across categories.
- **Cadence/trigger:** Per release; alert on a rating drop.
- **Primary user → routed exec:** Product/Engineering → Category + CX.
- **1. Data aggregation.** Substrate: app-release events, funnel/conversion. Interaction: app-store reviews + care mentions.
- **2. Baseline creation.** Normal app-store rating velocity and post-release conversion.
- **3. Dynamic detection (cross-domain).** A rating drop + conversion dip co-timed with a release.
- **4. Distillation.** Attribute to the release; surface the offending area; suppress unrelated noise.
- **5. Surfacing & routing.** Card: release, the regression, cross-category conversion impact. Draft: rollback/hotfix. Human gate. Hero: a **release-regression** flag.
- **Why it beats a self-built dashboard.** App-store sentiment and release/funnel data are rarely co-moved; a cross-category conversion regression hides behind category-level dashboards.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A release drops the app rating 0.4 and checkout conversion 5% across categories within 24 hours → regression flagged `[illustrative]`.
- **Regulatory/governance hook.** None primary.
- **Feasibility.** [ARCH] reliable release feed; FP risk low-moderate. [PM] high-leverage, cross-category.

### UC-OPUS-B10 — Counterfeit detection from review text + return-reason co-occurrence `[single]`
- **Archetype:** integrity co-occurrence join
- **Bucket:** B
- **Signal:** Counterfeit risk surfaced where "fake / not genuine" review language co-occurs with authenticity-coded returns on the same SKU/seller.
- **Cadence/trigger:** Weekly; real-time on a cluster.
- **Primary user → routed exec:** Trust & Safety → Seller-Brand + Category.
- **1. Data aggregation.** Interaction: review text ("fake", "not genuine"). Substrate: return reasons coded to authenticity, seller, SKU.
- **2. Baseline creation.** Per category/seller: normal authenticity-complaint and authenticity-return rate.
- **3. Dynamic detection (cross-domain).** Co-occurrence of fake-language reviews and authenticity returns above baseline on a SKU/seller.
- **4. Distillation.** Bind the two signals into a counterfeit-risk score; suppress isolated mentions.
- **5. Surfacing & routing.** Card: SKU/seller, counterfeit-risk score, evidence. Draft: takedown-review / seller suspension proposal. Human gate. Hero: a **counterfeit-risk** verdict.
- **Why it beats a self-built dashboard.** Neither review mining nor return-code analysis alone is decisive; the co-occurrence is what makes counterfeit risk actionable, and it is never joined.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A seller's "fake / not original" reviews co-occur with a spike in authenticity-coded returns on one SKU → counterfeit-likely, routed to Trust & Safety `[illustrative]`.
- **Regulatory/governance hook.** Brand-protection / consumer-safety; fall-back liability; evidence retained.
- **Feasibility.** [ARCH] tractable co-occurrence model. FP risk: moderate (genuine vs hyperbole). [REG] strong.

---

## Panel Notes (Opus run)

**Sharpest disagreements to carry to merge.**
1. **Beachhead boundary (the decision that most shapes Stage 3–8).** [PM] argues the MVP should join only the **return-reason free text the operator already holds** (a Tier-2 corpus the platform owns) and park the full social/app-store corpus join in Tier 3; [ARCH]/[DUAL] argue the headline **operational-anomaly ↔ voice join** is the demo's whole point and must appear, at least on a constrained category, in the MVP. This is the live tension to resolve at the Stage 1→2 (or 2→3) gate.
2. **Detectability as gate, not feature.** [ARCH] holds that nothing ships trustworthily without auto-adaptive (DENSE/BURSTY/SPARSE) baselining; [PM] agrees but warns it is a capability under every card, so it must be packaged as infrastructure, not sold as a tile. Affects how Stage 3 tiers the catalogue.
3. **Causality honesty (B2, B7).** [ARCH] insists return-cause and CSAT→retention claims stay *directional* (correlation, cohort-level), against a buyer instinct to read them as proven cause. Resolution: a correlation-evidence band on every join card; the GoKwik intent/fault split as the standing prior for returns.
4. **Where the budget sits.** [REG] argues the dark-pattern self-audit + DPDP audit obligations make Compliance a budget-bearing buyer alongside the Category Head; the regulatory-grade monitoring card (A4/B6) may rank higher on *procurement urgency* than on daily pain. Test in Stage 2.

**Five strongest UI candidates from this source.**
- The **regime-aware "is this real?" badge** (DENSE/BURSTY/SPARSE) on every anomaly (A1) — the festival-scale trust primitive.
- The **why-it-moved cause statement** with a Category first action and a CX first action on one card (B1) — the org-seam hero.
- The **recoverable-margin figure** with the fixable-vs-intent return split, anchored on the GoKwik prior (B2).
- The **full-coverage audit registry** entry — verbatims + timestamp + provenance — as a compliance artifact (A4/B6).
- The **assortment-gap demand card** from null-search + explicit asks (A5) — a buyer-resonant, distinctive surface.

**Recall note — distinct Opus gems to preserve at merge (do not let consensus drop these).**
- **Auto-adaptive DENSE/BURSTY/SPARSE baselining** — the only worked detectability theory across the four runs; it is the festival false-positive answer and must survive as the catalogue's anomaly primitive.
- The **GoKwik 60–70%-intent / 20–25%-logistics RTO split** — the empirical anchor that separates operational from voice returns (B2); reuse as a standing prior.
- The **domain spine** (Customer Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action) — the trace every card must satisfy.
- The **insight-permissible / differential-action-gated** principle and **cohort-not-identity** default — the compliance backbone for every geography/seller cut.
- The **defensibility line** — wins where the answer lives in the customer's words + a thin operational summary; loses on pure operational optimisation (dynamic pricing, inventory placement, dark-store routing, demand forecasting). This bounds the catalogue honestly.
- The **single-source joins**: null-search assortment-gap demand (A5); CSAT→repeat-buyer causal (B7); pin-code CX→RTO (B8); app-store↔app-release regression (B9); counterfeit from review+return co-occurrence (B10); voice-of-seller churn (A9). Each preserved as its own card.
- **Voice → GMV as the analog to retail-media's ad → GMV clean-room join** (Forrester: 86% of commerce-media decision-makers rank measurement/attribution top priority) — the proof-point that operators already pay for *a* join, and LiSN's is voice→GMV. Keep as the positioning anchor.
- Quantified anchors to reuse: returns ≈ ₹2 lakh cr / blended ≈17% / fashion 25–35% / COD RTO 20–40%; retail-media ₹24,280 cr (2025) with Amazon ₹8,342 cr (≈28%), Flipkart ₹6,310–6,317 cr (≈31%), Myntra ₹914 cr (≈15%); Diwali ₹50,000 cr in ~10 days / off-season −70%.
