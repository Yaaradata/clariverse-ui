# Stage 3 — Tiered Insight-Card Catalogue (the buildable centerpiece)

**Project:** LiSN retail / e-commerce category intelligence · **Input:** the Stage 2 merge (49 use cases) · **Run date:** 29 June 2026
**Buyer:** Category / Business Head (P&L) + CX / VoC Head (native) · Indian marketplace / quick-commerce · India-primary.
**Definitions held throughout:** *insight card* = a proactive anomaly + its "so what", surfaced as a UI object · *catalogue / portfolio* = the operator's actual retail business being analysed.

---

## Beachhead decision (confirmed, enforced honestly)

**Tiers 1–2 substrate = the operational event/summary feed + the operator-held, key-attached interaction corpus.** Concretely: order/GMV & funnel events, search/browse logs, catalogue/PIM, inventory/availability, pricing/promo events, fulfilment/delivery-SLA events, returns/RTO + reason codes, cancellation reasons, seller/SLA, payment success/failure — **and** the voice that already carries an order/SKU/seller key: return/cancellation free-text, product reviews & ratings, care tickets/chats, seller-support tickets, Q&A.

**Parked as Tier 3 (never smuggled into Tier 2):** the operational-anomaly ↔ *external / unkeyed* voice join (social — Reddit/X/Instagram, app-store reviews, public real-time sentiment), all cross-system correlations with no shared key, exposure-level attribution, and causal joins.

**Hard constraint applied:** every Tier-1/Tier-2 item is answerable from the chosen substrate alone. Where an insight wants external voice or a key-less correlation, it is tagged `[TIER-3 hook → <merge ID>]` and not built here. This keeps LiSN's wedge — the return-reason→margin/seller join, seller-voice→SLA, review-aspect→conversion — inside the MVP, because those joins are *keyed*; while the hard cross-system join (the demo's drama) stays the deliberately-parked hero.

---

## Tier 1 — Descriptive question taxonomy (self-serve, table-stakes)

The dashboard-grade cuts the buyer assembles by hand or via an analyst round-trip. Specific to Indian marketplace/quick-commerce, not generic BI.

**1. Category P&L & growth.**
- *Growth-vs-plan:* GMV / NMV (checkout value of delivered orders) vs plan, last-year, event-target — by category/sub-category/city. → order & GMV events, plan tables.
- *Profitable growth:* category contribution after returns, reverse-logistics, discounts, payment fees, blended CAC; take-rate / CM1. → order, returns, discount/promo, fee, CAC tables.
- *Share & mix:* category share trajectory; private-label vs marketplace mix; new-vs-repeat GMV split. → order, cohort tables.

**2. Conversion & funnel.**
- *Funnel by step:* visit → PDP → add-to-cart → checkout → order, by category/device/city/sale-vs-normal. → funnel/clickstream events.
- *Search health:* search-to-purchase, zero-result rate, CTR, PDP bounce. → search/browse logs.

**3. Returns & RTO.**
- *Rate & mix:* customer-return + COD RTO rate by SKU/seller/category/pin-code; reason-code distribution; NDR rate. → returns/RTO logs, reason codes, reverse-logistics, delivery events.
- *Cost:* reverse-logistics cost, refunded-commission, write-off, blocked capital by category. → returns + finance tables.

**4. Availability & assortment.**
- *Stockout & fill:* stockout rate, fill-rate, promise-date availability by SKU/zone/dark-store; sell-through / turnover. → inventory, availability, fulfilment events.
- *Demand gaps:* zero-result search themes; high-demand low-availability SKUs. → search logs, demand signals.

**5. Seller & SKU performance.**
- *Seller health:* cancellation rate, late-dispatch, ODR, valid-tracking, seller tier (GMV/fulfilment/return); GMV concentration vs the FDI 25% single-vendor cap. → seller portal, order, returns.
- *SKU health:* velocity, attach-rate, rating distribution, return rate by SKU. → order, catalogue, reviews, returns.

**6. Promo & retail-media.**
- *Spend & return:* ROAS, promo burn, discount depth, attach uplift; retail-media revenue (≈28–31% of platform revenue) by category. → ad-server, promo events, order.

**7. Experience signals (operator-held voice).**
- *Satisfaction & complaints:* review/rating distribution, CSAT, complaint/ticket volume, repeat-contact rate by SKU/seller/category. → reviews, ratings, care tickets, seller-support.

*Tier 1 is where a substrate-only BI tool already half-serves the buyer. It is table-stakes; the differentiation begins at Tier 2.*

---

## Tier 2 — Proactive anomaly insight-card catalogue (the centerpiece)

Every card carries an action — no action, no card. Severity tiers: **S1** act-now / **S2** review-this-week / **S3** watch. All cross-cutting on four primitives (spec as infrastructure, not tiles): **auto-adaptive DENSE/BURSTY/SPARSE baselining** `[OPUS-A1]`, **multilingual semantic index** keyed to SKU+PIN+seller `[PPLX-A2]`, **deterministic returns↔order↔seller↔ledger backbone** `[PPLX-A1]`, **configurable alerting tiers + human-in-loop** `[PPLX-A3]`. Two guardrails wrap every card: **insight-permissible / differential-action-gated** `[MA22]` and **provenance-stamped evidence packets** `[PPLX-A4]`. Nothing auto-fires — LiSN drafts, a human approves, every step is audit-logged.

### Family A — Returns & margin recovery (the wedge)

**T2-01 · Return-reason cause-code shift** — *the why behind a return-rate move, in the customer's words.*
- Signal/trigger: a SKU/seller's dominant return cause-code (size / quality / fake / damage / delay / missing-accessory / confusing-exchange) shifts vs its own baseline.
- Watches: SKU × seller × category × cause-code; fixable-vs-intent split via the GoKwik 60–70%-intent prior.
- Action: route the *fixable* share to catalogue/seller; leave buyer-remorse alone.
- Severity → escalation: S2 → Category + Seller-Brand.
- Audience: Category Head, CX Head. Fields: returns + reason codes + return free-text + order/SKU/seller.
- `[AI]` keep directional (correlation, not proven cause); FP risk low on the code shift, moderate on intent/fault separation.
- Tag: **DIFFERENTIATING**. `[merge MA1]`

**T2-02 · Recoverable-margin return card** — *"returns on this cluster are X above baseline; ₹Y is recoverable if we fix the listing/seller."* `★24×7`
- Signal/trigger: return free-text fault themes co-move with elevated returns on a SKU/seller, scored against baseline.
- Watches: SKU × seller × category × pin-code; contribution at stake; fixable share.
- Action: fix listing / cull seller / re-price — on the fixable share only.
- Severity → escalation: S1 if recoverable contribution > threshold → Category + Seller-Brand.
- Audience: Category Head (CX reads the same card to pre-empt the ticket). Fields: return free-text + SKU contribution + seller + reverse-logistics cost.
- `[AI]` the contribution figure is the trust anchor; FP risk moderate — show the correlation-evidence band.
- `[Compliance]` differential seller action gated; FDI non-discrimination.
- Tag: **WOW** (the hero — returns ≈ ₹2 lakh cr pool). `[merge MB3]`

**T2-03 · Catalogue auto-correction proposal** — *return free-text becomes a proposed PIM/sizing-chart fix that stops the next return.* `★24×7`
- Signal/trigger: free-text consistently contradicts a listing attribute (e.g. "chest narrow vs chart") above a confidence band, tied to elevated returns.
- Watches: SKU × the specific PIM attribute at fault.
- Action: a **drafted PIM update** (sizing remap / attribute correction) for human approval — never auto-written.
- Severity → escalation: S2 → Catalogue/PIM.
- Audience: Category Head, Catalogue team. Fields: return free-text + reviews + PIM/sizing attributes + returns.
- `[AI]` verbatim→PIM-field resolution is the hardest single step and the moat; FP risk if the chart is right and buyers misjudge.
- `[Compliance]` Legal Metrology; PIM write human-gated + audit-logged.
- Tag: **WOW** (Gemini-unique structural prevention; automates the Zaroori-Retail 36%→19% manual process). `[merge MB4]`

**T2-04 · Warehouse-vs-seller return fault split** — *is this "wrong item" a pick/pack error or a seller fault?*
- Signal/trigger: "wrong item / wrong size shipped" return text co-moves with warehouse pick/pack exceptions (→ warehouse) vs a seller return-rate trend (→ seller).
- Watches: SKU × warehouse/dark-store × seller.
- Action: warehouse process fix or seller action — to the correct owner, not a guess.
- Severity → escalation: S2 → Operations or Seller-Brand. Audience: Ops, Seller-Brand, Category. Fields: warehouse pick/pack exceptions + return free-text + seller return-rate.
- `[AI]` warehouse-event linkage is the hard plumbing; FP risk moderate.
- `[Compliance]` do not penalise a seller for a warehouse fault (fair-treatment).
- Tag: **DIFFERENTIATING** (Perplexity-unique sub-order granularity). `[merge MB5]`

**T2-05 · Return / RTO anomaly by SKU × seller × geography** — *a return/RTO cell breaks its own seasonal band.*
- Signal/trigger: return/RTO rate exceeds the cell's regime baseline (fashion sits structurally at 25–40%, so the baseline is category-relative).
- Watches: SKU × seller × pin-code × week-type. Action: hold promotion / seller review on the breaching cell.
- Severity → escalation: S2 (S1 on a sharp regional spike) → Ops/Seller. Audience: Category, Ops. Fields: returns/RTO logs + order + seller + pin-code.
- `[AI]` honest seasonal baselining so Diwali is not flagged as failure; FP risk low if category-relative.
- `[Compliance]` pin-code differential action gated (geography proxy).
- Tag: **TABLE-STAKES → DIFFERENTIATING** (the substrate spine the voice cards attach to). `[merge MA23]`

**T2-06 · Catalogue-completeness → avoidable returns** — *low-completeness listings are generating "not as described" returns.*
- Signal/trigger: low-completeness listings whose "not as described" return text + return rate exceed baseline.
- Watches: listing completeness × the missing attribute × returns. Action: PIM enrichment of the specific gap.
- Severity → escalation: S3 → Catalogue. Audience: Category, Catalogue. Fields: catalogue completeness + return free-text + returns.
- `[AI]` attribute-to-return mapping; FP low. Tag: **DIFFERENTIATING**. `[merge MA13]`

### Family B — Seller quality & trust

**T2-07 · Seller trust-risk board** — *the home surface: seller/SKU problems ranked by customer-backed GMV exposure.* `★24×7`
- Signal/trigger: a seller's customer-voice damage exceeds peer-tier baseline, weighted by affected GMV.
- Watches: seller × tier × category; complaint clusters, repeat-contact rate. Action: open the per-seller **evidence pack**; intervene / coach / suppress.
- Severity → escalation: ranked board; S1 rows → Seller-Brand + T&S. Audience: Seller-Brand, Category, CX. Fields: seller SLA/ODR/cancellation + seller-support + buyer care/reviews keyed to seller.
- `[AI]` seller entity resolution + quote selection; FP low-moderate.
- `[Compliance]` evidence pack doubles as a fall-back-liability artifact; remediation FDI-aware.
- Tag: **DIFFERENTIATING** (4-source convergence — the most-agreed card). `[merge MA3]`

**T2-08 · Seller SLA breach ↔ trust-erosion voice + concentration flag** — *"this breach is destroying trust, and the seller is near the 25% cap."* `★24×7`
- Signal/trigger: SLA breach (cancellation/late-dispatch) co-moves with trust-erosion voice for the same seller; concentration band checked.
- Watches: seller × SLA × trust-language × GMV-concentration. Action: intervention/penalty/suppression that respects the cap and non-discrimination.
- Severity → escalation: S1 → Seller-Brand + Compliance. Audience: Seller-Brand, CX, Compliance. Fields: seller SLA + seller-support + buyer voice + GMV concentration.
- `[AI]` keyed to seller; FP low-moderate.
- `[Compliance]` FDI Press Note 2 (25% cap, non-discrimination, RBI annual certificate); fall-back liability.
- Tag: **WOW** (turns the board causal). `[merge MB9]`

**T2-09 · Counterfeit co-occurrence** — *"fake / not genuine" review language co-occurs with authenticity-coded returns.*
- Signal/trigger: fake-language reviews and authenticity returns co-occur above baseline on a SKU/seller.
- Watches: SKU × seller × authenticity signal. Action: takedown-review / seller suspension proposal.
- Severity → escalation: S1 (safety) → T&S. Audience: T&S, Seller-Brand. Fields: review text + authenticity return reasons + seller.
- `[AI]` co-occurrence model; FP moderate (hyperbole vs genuine).
- `[Compliance]` brand-protection / consumer-safety; fall-back liability; evidence retained.
- Tag: **DIFFERENTIATING** (Opus-unique). `[merge MB8]`

**T2-10 · Fake-review / manipulation integrity** — *a sentiment swing inconsistent with order velocity and tied to suspicious accounts.*
- Signal/trigger: review burst / sentiment swing not matched by order velocity, linked to account signals.
- Watches: SKU × seller × reviewer-account diversity × order velocity. Action: review-takedown / seller investigation.
- Severity → escalation: S2 → T&S. Audience: T&S. Fields: review text/velocity + account signals + order velocity.
- `[AI]` account + velocity features; FP moderate.
- `[Compliance]` review-integrity / unfair-trade-practice. Tag: **DIFFERENTIATING**. `[merge MB7]`

**T2-11 · Seller-dispute legitimacy triage** — *is the seller right, or genuinely underperforming?*
- Signal/trigger: a seller disputes a penalty; reconcile the claim against buyer-voice evidence + SLA truth.
- Watches: seller × SLA × buyer voice. Action: uphold / reverse / coach, with evidence both ways.
- Severity → escalation: S3 (event-triggered) → Seller-Brand/T&S. Audience: Seller-Brand. Fields: seller SLA + seller-support + buyer voice.
- `[AI]` tractable; FP low with good evidence.
- `[Compliance]` FDI fair-treatment-of-sellers. Tag: **DIFFERENTIATING** (long-tail). `[merge MA16]`

### Family C — Conversion, sentiment & launch

**T2-12 · Aspect-sentiment cliff → conversion / returns risk** — *a review aspect turns and drags conversion before the star average moves.* `★24×7`
- Signal/trigger: a negative aspect (fit, fabric, battery, freshness, shade) rises sharply vs its own trailing mix on a high-exposure SKU, co-moving with a conversion dip or return rise.
- Watches: SKU × aspect × conversion/returns × GMV exposure. Action: catalogue/quality fix on the aspect.
- Severity → escalation: S2 (S1 on a hero SKU) → Category + Catalogue. Audience: CX, Category. Fields: reviews/ratings (SKU-keyed) + funnel conversion + returns.
- `[AI]` aspect extraction + Indian-language nuance is the moat; the star average is explicitly *not* the baseline; FP moderate (sarcasm, code-mixing).
- Tag: **WOW** (the anti-NPS card; 3-source monitor + the keyed conversion join). `[merge MA2 + MB6]`

**T2-13 · Pre-emptive launch-defect** — *day-3 reviews foretell a return wave before GMV craters.*
- Signal/trigger: a launch SKU's early rating-distribution/aspect cluster emerges faster than its launch-archetype baseline.
- Watches: launch SKU × early review velocity × rating shape. Action: catalogue fix / seller hold / listing pause pre-peak.
- Severity → escalation: S1 during a launch window → Category + Seller-Brand. Audience: Category, Catalogue. Fields: early reviews/ratings (SKU-keyed) + launch funnel/velocity.
- `[AI]` launch-archetype baselines on sparse early data is the challenge; FP moderate.
- Tag: **DIFFERENTIATING** (Opus-unique leading indicator). `[merge MA11]`

**T2-14 · Attack-vs-defect discriminator** — *a 1-star surge: competitor attack or real product change?*
- Signal/trigger: distinguish low-purchase-linked, low-diversity bursts (attack) from purchase-linked, aspect-specific complaints (defect), cross-checked against silent listing changes.
- Watches: SKU × review velocity × reviewer diversity × listing-change events. Action: takedown-review (attack) or catalogue/seller action (defect).
- Severity → escalation: S1 → T&S or Category. Audience: T&S, Category. Fields: review text/velocity + reviewer signals + order velocity + listing-change events.
- `[AI]` needs reliable listing-change events; FP on genuine virality.
- Tag: **DIFFERENTIATING**. `[merge MA12]`

**T2-15 · Return-initiation ↔ care-chat defect wave** — *returns on a model spike today while care chats discuss the same defect.* `★24×7`
- Signal/trigger: return-initiation spike on a model co-moves in real time with a specific defect theme in care transcripts.
- Watches: model/SKU × return-initiation × care defect theme. Action: delist / quarantine + seller escalation while the wave forms.
- Severity → escalation: S1 (real-time) → Category + T&S. Audience: Category, T&S. Fields: return-initiation events + care transcripts (order/SKU-keyed).
- `[AI]` tractable; FP if defect language is vague; runs on the real-time tier.
- `[Compliance]` product-safety / fall-back liability; evidence retained.
- Tag: **DIFFERENTIATING** (early-recall signal). `[merge MB15]`

### Family D — Availability & demand

**T2-16 · Stockout lost-GMV + wasted-ad-spend** — *a hero SKU is out while marketing still funds traffic to it.*
- Signal/trigger: stockout on a high-demand, ad-backed SKU → quantified lost GMV + wasted spend.
- Watches: SKU × zone × demand × ad-exposure. Action: replenishment / ad-pause.
- Severity → escalation: S2 (S1 in q-com peak) → Ops/Pricing. Audience: Category, Ops. Fields: availability + demand/PDP views + ad-exposure + GMV.
- `[AI]` needs reliable availability + ad-exposure feeds; FP low.
- Tag: **TABLE-STAKES → DIFFERENTIATING** (the ad-waste overlay is the lift). `[merge MA8]`

**T2-17 · Hidden lost demand** — *a stockout is driving brand switching, not just an availability gap.* `★24×7`
- Signal/trigger: stockout/promise-miss co-moves with switching-intent care voice ("switched to X", "promised today, didn't come").
- Watches: SKU × zone × switching-intent voice. Action: replenishment / promise-tightening, priced by the bleed.
- Severity → escalation: S1 in q-com peak → Category + Supply. Audience: Category, Ops. Fields: stock/availability + promise-date + search/cart + care voice (keyed).
- `[AI]` strong joins needed; FP moderate; the "switched to competitor" signal from *care* is keyed (the social version is Tier-3).
- `[TIER-3 hook → MB18-ext]` social substitution-frustration.
- Tag: **DIFFERENTIATING** (quick-commerce signature). `[merge MB18]`

**T2-18 · Null-search assortment-gap demand** — *what customers ask for that we don't stock.*
- Signal/trigger: a zero-result search theme co-occurs with explicit "do you stock…" asks in reviews/Q&A/care.
- Watches: category × geography × unmet-request theme. Action: assortment/buying proposal, demand-sized.
- Severity → escalation: S3 → Buying. Audience: Category, Buying. Fields: search null-results + Q&A/review/care asks (keyed).
- `[AI]` query normalisation + intent clustering; FP low.
- Tag: **DIFFERENTIATING** (Opus-unique `[NEW]`). `[merge MA14]`

### Family E — Promo & spend quality

**T2-19 · Promo "do-not-promote" guardrail** — *"do not scale this SKU — reviews, returns and complaints show trust risk."* `★24×7`
- Signal/trigger: a promoted / about-to-be-promoted SKU crosses into unhealthy territory on a composite (return rate, recent sentiment slope, availability, seller health).
- Watches: SKU × ad/promo spend × the composite health. Action: a three-state verdict — promote / caution / do-not-promote — with the one dominant reason; pause/redirect spend.
- Severity → escalation: S2 (S1 if large spend at risk) → Pricing/Retail-Media. Audience: Pricing, Category, Retail-Media. Fields: ad/promo exposure + ROAS + returns + recent review sentiment + seller health.
- `[AI]` composite weighting and avoiding stale-review penalties is the work; FP moderate.
- `[Compliance]` scaling deceptive-claim SKUs intersects dark-pattern/disclosure risk.
- Tag: **WOW** (guards the ~28–31%-of-revenue retail-media pool; GPT-signature). `[merge MA6 + MB19]`

**T2-20 · Promo incrementality vs organic cannibalisation** — *a discount is lifting reported sales but cannibalising organic full-price demand.*
- Signal/trigger: promoted lift net of cannibalised organic = true incrementality; flag negative-incrementality SKUs.
- Watches: SKU × promo exposure × organic-vs-promoted mix. Action: stop / keep, by margin destroyed.
- Severity → escalation: S2 → Pricing. Audience: Pricing, Category. Fields: promo exposure + order-level margin + organic-vs-promoted + holdout.
- `[AI]` holdout design is the hard part; FP moderate.
- `[Compliance]` drip-pricing / discount-claim honesty.
- Tag: **DIFFERENTIATING**. `[merge MA7]`

**T2-21 · Return-fee policy impact** — *did the ₹15–30 return fee isolate serial returners or quietly tax loyal buyers?*
- Signal/trigger: post-policy divergence — serial-returner volume down (intended) vs broad AOV/conversion down (collateral).
- Watches: returner cohort × AOV × conversion × fee events. Action: keep / tune / rollback.
- Severity → escalation: S2 → Category + CX. Audience: Category, CX. Fields: return-frequency cohorts + AOV + conversion + fee events.
- `[AI]` clean to compute; surfaces the trade-off, does not pick a side.
- Tag: **DIFFERENTIATING** (long-tail; the live margin-vs-CX fight). `[merge MA9]`

### Family F — Conduct, compliance & grievance (reg-pull)

**T2-22 · Dark-pattern complaint monitor** — *manipulation-specific complaints rising between periodic audits.*
- Signal/trigger: complaint clusters matching the 13 specified dark patterns rise in the operator-held care+review corpus tied to a live offer/journey.
- Watches: journey/offer × dark-pattern topic × complaint volume. Action: compliance flag with evidence.
- Severity → escalation: S2 → Legal/Compliance. Audience: Compliance, CX, Growth. Fields: care tickets + reviews (keyed) + offer/journey metadata.
- `[AI]` precision on manipulation language is hard; evidence only, never enforcement.
- `[Compliance]` Dark Patterns Guidelines 2023; CCPA 5 June 2025 advisory (prescribes no method — full-coverage corpus monitoring is the gap).
- `[TIER-3 hook → MB1]` social/forum dark-pattern signal.
- Tag: **DIFFERENTIATING** (reg-pull). `[merge MA4]`

**T2-23 · UI behaviour ↔ voice-of-manipulation** — *"this conversion/AOV spike is a liability."* `★24×7`
- Signal/trigger: a conversion/AOV lift co-moves with a manipulation-complaint surge tied to the same UI element/offer.
- Watches: UI element/offer × conversion/AOV × manipulation complaints. Action: compliance hold with audit-ready evidence.
- Severity → escalation: S1 → Compliance + Growth. Audience: Compliance, Growth, Category. Fields: checkout/UI config + change events + manipulation complaints (keyed).
- `[AI]` linking UI config to complaint language is hard; proving *design* causality may need product-analytics UI/session evidence — LiSN supplies evidence + early warning, not a verdict.
- `[Compliance]` Dark Patterns 2023; CCPA advisory; E-Commerce Rules Rule 4(9).
- Tag: **WOW** (reg-pull; the spike-that-is-a-liability). `[merge MB12]`

**T2-24 · Listing-compliance gap (Legal Metrology)** — *complaints about wrong MRP / missing origin / wrong quantity cluster on a listing.*
- Signal/trigger: disclosure-complaint cluster above baseline on a listing.
- Watches: listing × the specific declaration at fault. Action: listing-fix ticket.
- Severity → escalation: S2 → Cat-Ops/Compliance. Audience: CX, Compliance. Fields: care/reviews/return text (keyed) + listing/SKU.
- `[AI]` straightforward extraction; FP low.
- `[Compliance]` Legal Metrology declarations; FSSAI for grocery/prepared food.
- Tag: **DIFFERENTIATING** (reg-pull). `[merge MA5]`

**T2-25 · Refund-delay → grievance-escalation early warning** — *anger is turning into regulatory exposure before the SLA breaches.* `★24×7`
- Signal/trigger: escalation-language share ("consumer forum", "NCH") rises against baseline, co-located with refund-delay timestamps.
- Watches: refund-delay cohort × escalation language × value. Action: a priority-resolution batch before escalation.
- Severity → escalation: S1 → Grievance/Compliance + Finance. Audience: CX, Compliance. Fields: refund/complaint text + repeat contacts (keyed) + refund-ledger/SLA timestamps.
- `[AI]` escalation-language classifier; FP on rhetorical threats.
- `[Compliance]` E-Commerce Rules grievance timelines.
- `[TIER-3 hook → MB22]` external grievance (NCH/consumer-forum) + GST/TCS settlement-base reconciliation.
- Tag: **DIFFERENTIATING** (reg-pull). `[merge MA10]`

### Family G — Operations & fulfilment (keyed-voice)

**T2-26 · Lane RTO ↔ care-voice arbitration** — *RTO spiked in this lane: logistics failure or sub-standard product?* `★24×7`
- Signal/trigger: an RTO/SLA breach in a lane co-moves with delivery-theme care voice (→ logistics) vs product-theme care voice (→ seller).
- Watches: pin-code/lane × RTO/SLA × care-voice theme; pin-code/cluster CX→RTO as a dimensional cut.
- Action: lane ops escalation or seller review — to the correct owner, ending the standing blame fight.
- Severity → escalation: S1 on a regional spike → Ops + Category. Audience: Ops, Category, Seller-Brand. Fields: RTO/NDR + delivery-SLA by lane + care voice (keyed); cohort-level.
- `[AI]` lane cohort join; sparse care voice in small lanes is the limit; FP moderate.
- `[Compliance]` pin-code differential action gated (geography proxy); insight permissible.
- `[TIER-3 hook → MB13-ext]` social-by-lane.
- Tag: **DIFFERENTIATING** (resolves an org fight). `[merge MB13 + MB14]`

**T2-27 · Complaint ↔ order + delivery-hop auto-remediation** — *a "never delivered, marked delivered" complaint resolves to the failing hop.*
- Signal/trigger: a care complaint deterministically resolves to an order and the failing delivery hop.
- Watches: order × delivery hop × complaint. Action: a drafted automated remediation (refund / re-ship / route fix) for approval.
- Severity → escalation: S2 (S1 on a false-scan pattern) → Ops. Audience: CX, Ops. Fields: care transcripts (order-keyed) + order + delivery-hop logs.
- `[AI]` deterministic transcript→order linkage; FP low-moderate.
- `[Compliance]` grievance-SLA; auditable remediation trail.
- Tag: **DIFFERENTIATING** (Perplexity-unique remediation). `[merge MB26]`

**T2-28 · Festival real-vs-failure incident detection** — *which sale spike is demand, and which is a payment/bot/fraud failure?* `★24×7`
- Signal/trigger: a demand spike with no co-moving failure voice → real; a spike co-moving with "payment deducted, no order" care tickets / fraud signals → failure, against a conservative festival baseline.
- Watches: SKU/payment/funnel spike × care-corroboration × seller-account signals; configurable tier.
- Action: ops/fraud escalation, verified before any step.
- Severity → escalation: S1 (peak) → T&S + Ops. Audience: Category, T&S, Ops. Fields: order/payment/funnel events + care tickets (keyed) + fraud/account signals.
- `[AI]` the festival false-positive problem — conservative thresholds + tiers + baselining are the whole point; runs on the real-time tier.
- `[Compliance]` auditable evidence for any fraud/abuse action.
- `[TIER-3 hook → MB25-ext]` social corroboration.
- Tag: **WOW** (highest-stakes window — Diwali ≈ ₹50,000 cr in ~10 days). `[merge MB25]`

---

## Tier 3 — Cross-domain hooks (parked, tagged only — the extension path)

Each needs external/unkeyed voice or a key-less cross-system correlation, so none is built in v1. The first is the demo hero.

- `[T3 → MB1]` **Operational-anomaly ↔ external-voice join** — a GMV/funnel/SLA number explained by a co-moving *social / app-store / public-sentiment* anomaly (e.g. "checkout dropped while X complains about a hidden fee"). The headline wedge; demo on one constrained category, ship to all only once entity-resolution + cohort-time alignment are trustworthy.
- `[T3 → MB2]` Real-time funnel cause-class explanation against *social* (the keyed-care version ships as part of T2-15/T2-28).
- `[T3 → MB20]` Ad ROAS ↔ verbatim complaint-type attribution (exposure-level).
- `[T3 → MB21]` Review/sentiment ↔ promotional impression logs + pricing errors at user-exposure level.
- `[T3 → MB22]` Refund-delay ↔ external grievance (NCH/consumer-forum) + GST/TCS settlement-base reconciliation.
- `[T3 → MB23]` Cohort/category repeat-rate drop ↔ voice reasons (causal).
- `[T3 → MB24]` CSAT → repeat-buyer causal join (proves CX ROI; needs matched cohorts/holdouts).
- `[T3 → MB10]` Seller support-cost (agent-time) ↔ contribution-margin (needs an agent-time costing layer).
- `[T3 → MB11]` Seller-onboarding-guideline efficacy (periodic policy study).
- `[T3 → MB16 / MB17]` Launch-regression / app-store rating ↔ app-release regression (app-store is external/app-level).
- `[T3 → MB18-ext / MB13-ext]` Social substitution-frustration and social-by-lane extensions of T2-17 / T2-26.

---

## Exceed-expectations map

**TABLE-STAKES (a substrate-only tool half-serves these).** All of Tier 1; T2-05, T2-16. The buyer expects these; they do not win the deal.

**DIFFERENTIATING (the daily working set a competitor cannot easily assemble).** T2-01, T2-04, T2-06, T2-07, T2-09, T2-10, T2-11, T2-13, T2-14, T2-18, T2-20, T2-21, T2-22, T2-24, T2-26, T2-27.

**WOW (makes the buyer stop reading the daily dump).** T2-02, T2-03, T2-08, T2-12, T2-15, T2-17, T2-19, T2-23, T2-25, T2-28 — plus the parked `[T3 → MB1]` external-voice join as the demo hero.

### The nominated "24×7 AI Category + CX Head" set (12 cards)

The credible always-on set that replaces the morning dashboard crawl, spanning the wedge, seller, conversion, promo, compliance, ops and peak:

1. **T2-02** Recoverable-margin return card *(the wedge — ₹Y recoverable, in the customer's words)*
2. **T2-03** Catalogue auto-correction proposal *(stop the next return at source)*
3. **T2-07** Seller trust-risk board *(the home surface)*
4. **T2-08** Seller SLA ↔ trust-erosion + concentration *(the breach that destroys trust)*
5. **T2-12** Aspect-sentiment cliff → conversion/returns *(the anti-NPS leading indicator)*
6. **T2-15** Return-initiation ↔ care-chat defect wave *(real-time recall signal)*
7. **T2-17** Hidden lost demand *(quick-commerce switching, priced)*
8. **T2-19** Promo "do-not-promote" guardrail *(guards retail-media spend)*
9. **T2-23** UI ↔ voice-of-manipulation *(the spike that is a liability)*
10. **T2-25** Refund-delay → grievance escalation *(regulatory early warning)*
11. **T2-26** Lane RTO ↔ care-voice arbitration *(ends the blame fight)*
12. **T2-28** Festival real-vs-failure incident detection *(the peak-window hero)*

---

## Panel calls (lens disagreements as design decisions)

1. **Real-time vs batch `[ARCH] vs [DUAL]`.** Ship batch for the return/seller/sentiment cards (T2-01/02/06/07/12/20); reserve the real-time tier for the four where latency is the value (T2-15, T2-23, T2-26, T2-28), exposed via configurable alerting tiers + human-in-loop so real-time is a *tier*, not a separate product. Auto-adaptive baselining is the gating capability under all of them.
2. **Deterministic-first vs embeddings-first `[PM] vs [ARCH]`.** Ship the deterministic returns↔order↔seller↔ledger backbone as MVP-0 (de-risks T2-01/02/04/05) *and* stand up the multilingual semantic index in parallel as MVP-1 (unlocks T2-12/22/26), so the real-time monitor (MVP-2) inherits both.
3. **Persona first-action on shared cards `[DUAL]`.** T2-02, T2-12, T2-26 serve the Category Head ("fix listing / cull seller / re-price") and the CX Head ("fix journey / pre-empt ticket"). Design a dual-action card with a role-based default ordering, not a single owner.
4. **Promo-guardrail authority `[DUAL] vs commercial`.** T2-19's "do not promote" verdict sits between Retail-Media's ROAS mandate and the Category Head. Decide whose call wins when ROAS is high but voice is bad before it ships — default: LiSN advises, Category Head decides, audit-logged.
5. **Dark-pattern: evidence, not enforcement `[REG]`.** T2-22/T2-23 supply full-coverage auditable evidence + early warning; proving design causality stays with product analytics. Position accordingly so the compliance claim is defensible.
6. **Causality honesty `[ARCH]`.** Every join card (T2-02, T2-12, T2-17, T2-26) carries a correlation-evidence band and stays directional; the GoKwik 60–70%-intent split is the standing prior for returns.

---

## Close

**Top compliance guardrails to design in (not bolt on):**
1. **Insight-permissible / differential-action-gated** on every geography/seller/cohort cut — slicing is fine, differential action (COD restriction, seller down-rank, varied terms) is human-gated + risk-reviewed.
2. **Cohort-level, not identity-level** joins by default (DPDP purpose-limitation, minimisation).
3. **Provenance-stamped evidence packets + immutable audit log** — the asset that satisfies the dark-pattern self-audit (no prescribed method), DPDP SDF audit, and grievance-SLA evidence.
4. **PII redaction + children/consent-safe analytics** (DPDP <18 no profiling, consent, 72-hr breach).
5. **Never auto-fire** — draft + human approve + audit, especially seller suppression, pin-code/COD restriction, and takedowns.
6. **FDI non-discrimination** on seller remediation; the **25% single-vendor concentration cap** as a hard constraint band.

**Open decisions for the team:**
1. Confirm the beachhead — operator-held keyed corpus in Tier 2 (this catalogue), or strict operational-only with all voice in Tier 3.
2. Ranking axis — procurement urgency as a tie-breaker (as applied), or co-equal (which would lift T2-22/23/24/25 above parts of the return/seller spine).
3. Persona first-action default on shared cards.
4. Real-time scope for v1 — confirm the four real-time cards (T2-15/23/26/28).
5. Close the factual reconciliations before build-spec — DPDP Rules date (13 vs 14 Nov 2025, G.S.R. 846(E)), the return-rate anchors (15–40% band), and the 2021 E-Commerce Rules amendment status.
6. Nominate which 5–6 of the 24×7 set go to the build-spec pass next (baseline maths, thresholds, UI, data pipeline — one card per deep pass). Suggested first five: **T2-02, T2-12, T2-19, T2-26, T2-28**.

*Follow-on (separate pass): once the 24×7 set is locked, run the build-spec on the nominated 5–6, then build the UI from the locked tiles.*
