# Stage 1 — Per-Source Use-Case Mining

**SOURCE ENGINE: Gemini (3.1 Pro)** · LiSN retail / e-commerce category intelligence
**Run against:** `Lisn_Ph1_Retailresearch_Gemini_3_1_Pro_25June26.md` (Stage 0 report, mined in isolation — not from any merge)
**Panel:** [ARCH] retail data/ML architect · [DUAL] Category + CX lead · [PM] intelligence-platform PM · [REG] consumer-protection adviser
**Recall mandate in force.** Long-tail, single-source and inferred use cases are kept and tagged, never dropped. Ranking happens only at Stage 2.

---

## How this run read the Gemini source

Gemini frames the Category Head as a **portfolio manager of a low-trust, COD-heavy ecosystem where every interaction carries a direct P&L consequence**, and builds its whole argument on one move: the operator can see *what* moved but the cause lives in an unstructured corpus nobody has joined to the substrate. Its sharpest, most distinctive contributions are (a) the **return-reason → PIM/sizing-chart auto-correction loop** (turn "chest too tight" free-text into a catalogue fix), (b) the **territorial-dispute framing** of an RTO spike (logistics blames the customer, CX blames the seller, the Category Head arbitrates blind), (c) **algorithmic seller-visibility throttling on qualitative negligence** under FDI fall-back liability, and (d) the **"semantic projection"** defensibility argument — own the messy multilingual (Hinglish) NLP, project only thin DPDP-compliant structured insight across the boundary. Gemini also insists NPS is a lagging, gameable metric and that true sentiment must be continuously extracted. I have mined those as the spine and preserved its quieter gems (Customer Lifetime Margin; reverse logistics reclassified as acquisition cost; ONDC/Beckn touching dispute schemas but not sentiment; the Zaroori-Retail manual 36%→19% benchmark as the thing LiSN automates).

---

## Bucket A — Pipeline use cases that beat a self-built dashboard

### UC-GEMINI-A1 — Return / RTO anomaly engine, baselined by SKU × seller × geography
- **Archetype:** substrate-side anomaly distillation
- **Bucket:** A
- **Signal:** A return or RTO rate breaks its own seasonal band for a specific SKU/seller/pin-code, not the category average.
- **Cadence/trigger:** Operational-weekly; alert-real-time on SKU/seller breach.
- **Primary user → routed exec:** Category Head → Head of Operations / Seller-Brand Partnerships.
- **1. Data aggregation.** Substrate: returns + RTO logs, order/GMV tables, reverse-logistics status, seller ledger, pin-code. Interaction: none required for v1 (this is the operational backbone the voice joins later attach to).
- **2. Baseline creation.** Dimensions: SKU × seller × pin-code × category × week-type (sale vs normal). "Normal" = the cell's own trailing return band, not a flat threshold; fashion sits structurally at 25–40% so the baseline must be *category-relative*.
- **3. Dynamic detection.** Flag a cell whose return/RTO rate exceeds its own band by a set deviation, weighted by GMV exposure — UP at 35% last week is only an anomaly if 35% is above *UP's* baseline.
- **4. Distillation.** Suppress sale-day expected lift and chronically high-return categories at their normal level; rank by rupees of contribution at risk, not by raw rate.
- **5. Surfacing & routing.** Card: "Returns on [seller/SKU] in [pin-code] are X above baseline, ₹Y contribution at risk." Recommended action: hold promotion / seller review. Human gate before any seller-facing step. Hero element: a **GMV-at-risk band** beside the rate.
- **Why it beats a self-built dashboard.** A BI tile shows the rate; it does not separate "this is fashion, returns are always 30%" from "this seller just broke trend," and threshold alerts drown the Head on sale days.
- **Differentiation:** substrate-visible (the spine for Bucket B joins).
- **Worked example.** A kurta seller's RTO moves to 34% vs a 22% pin-code baseline; ₹18L contribution exposed across the next sale window `[illustrative]`.
- **Regulatory/governance hook.** Any *differential* seller action triggered here is gated (FDI non-discrimination); insight is free, action is human-approved.
- **Feasibility.** [ARCH] cleanly detectable; hardest part is honest seasonal baselining so Diwali is not flagged as failure. [PM] this is table-stakes and the substrate other cards hang off. FP risk: low if baseline is category-relative. [DUAL] Category wants the rupees; CX wants to know which returns are experience-driven (handled in B).

### UC-GEMINI-A2 — Continuous review-sentiment cliff detector (the anti-NPS)
- **Archetype:** interaction-side anomaly distillation
- **Bucket:** A
- **Signal:** Aspect-level sentiment for a SKU/brand falls off its own curve faster than star-rating averages reveal.
- **Cadence/trigger:** Weekly; real-time on a sentiment crash.
- **Primary user → routed exec:** CX/VoC Head → Category Head.
- **1. Data aggregation.** Interaction: product reviews, ratings, Q&A, care chat, app-store reviews, social — full corpus, Hinglish/regional included. Substrate: SKU/brand keys only, to attach the signal.
- **2. Baseline creation.** Per SKU/brand: normal aspect-sentiment mix (fit, fabric, battery, freshness) and review velocity. Slow-moving star averages are explicitly *not* the baseline.
- **3. Dynamic detection.** Flag an aspect whose negative share rises sharply against its own trailing mix, before the headline rating moves.
- **4. Distillation.** Suppress steady background grumbling; surface only the *change in slope*. Rank by SKU GMV exposure.
- **5. Surfacing & routing.** Card naming the aspect ("fabric" turning on this kurta), the trajectory, and affected GMV. Draft: catalogue-review request. Hero: an **aspect-trajectory sparkline**, not a number.
- **Why it beats a self-built dashboard.** Gemini's point: NPS is lagging and gameable via post-purchase prompts; a satisfaction tile cannot catch an aspect cliff that a continuous-text monitor catches days earlier.
- **Differentiation:** interaction-visible.
- **Worked example.** "Fabric" negative share on a top kurta rises from 6% to 22% of mentions in nine days while the 4.1★ rating barely moves `[illustrative]`.
- **Regulatory/governance hook.** DPDP: corpus processed with PII redaction; cohort-level reporting.
- **Feasibility.** [ARCH] entity resolution and Hinglish parsing are the hard part and the moat. FP risk: moderate (sarcasm, code-mixing). [PM] strong MVP candidate. [DUAL] both owners act on it; whose action shows first is the spec call.

### UC-GEMINI-A3 — Dark-pattern complaint surveillance from the voice corpus
- **Archetype:** interaction-side compliance monitor
- **Bucket:** A
- **Signal:** Complaint clusters matching the 13 specified dark patterns (false urgency, basket sneaking, confirm-shaming, drip pricing) rise in the corpus.
- **Cadence/trigger:** Weekly; real-time around flash sales.
- **Primary user → routed exec:** CX/VoC Head → Legal/Compliance + Growth.
- **1. Data aggregation.** Interaction: care chat, social, app-store, external forums (Gemini's "trick wording at checkout"). Substrate: offer/checkout event metadata to locate the journey.
- **2. Baseline creation.** Normal rate per dark-pattern topic per 10k sessions, per journey/offer.
- **3. Dynamic detection.** Topic-cluster surge above baseline tied to a live offer or checkout change.
- **4. Distillation.** Suppress generic price gripes; keep manipulation-specific language. Rank by complaint volume × offer reach.
- **5. Surfacing & routing.** Evidence card: the pattern, verbatim quotes, the offer/journey, complaint count. Draft: compliance flag. Strict human gate. Hero: a **dark-pattern evidence registry** entry.
- **Why it beats a self-built dashboard.** Compliance audits are periodic and BI cannot read "I was tricked"; the 5 June 2025 CCPA advisory prescribes no method, so full-coverage corpus monitoring is the open gap.
- **Differentiation:** interaction-visible (becomes a join in UC-GEMINI-B7).
- **Worked example.** "Hidden fee / forced add-on" mentions triple within an hour of a flash-sale interface change `[illustrative]`.
- **Regulatory/governance hook.** CCPA Dark Patterns Guidelines 2023; Rule 4(9) pre-ticked-box ban; the auditable trail is itself the product.
- **Feasibility.** [REG] highest-urgency wedge; budget sits in Legal. [ARCH] precision on manipulation language is hard. [PM] ship as evidence, never auto-enforcement.

### UC-GEMINI-A4 — Seller-quality early warning from support-chat negligence signals
- **Archetype:** interaction-side seller risk
- **Bucket:** A
- **Signal:** Qualitative negligence (counterfeit, dangerous defect, "not as described") clusters against a specific seller ID before quantitative thresholds trip.
- **Cadence/trigger:** Weekly; real-time on a counterfeit/safety cluster.
- **Primary user → routed exec:** Seller-Brand Partnerships → Trust & Safety.
- **1. Data aggregation.** Interaction: care chat, reviews, seller-support tickets, social, keyed to seller ID. Substrate: seller SLA, GMV concentration.
- **2. Baseline creation.** Per seller: normal complaint-theme mix and rate vs category peers.
- **3. Dynamic detection.** Negligence-theme share rises sharply for a seller against peer baseline.
- **4. Distillation.** Suppress isolated one-offs; require cluster persistence. Rank by GMV exposure and safety severity.
- **5. Surfacing & routing.** Seller-risk card with quote evidence and affected GMV. Draft: seller review / visibility hold proposal. Human gate (and FDI-aware). Hero: a **seller trust-risk evidence pack**.
- **Why it beats a self-built dashboard.** Gemini: suspension is usually reactive on arbitrary return-rate thresholds; qualitative negligence is invisible to a rate tile until trust is already gone.
- **Differentiation:** interaction-visible (joins seller P&L in UC-GEMINI-B4).
- **Worked example.** Three counterfeit clusters on one seller while its return rate is still "within range" `[illustrative]`.
- **Regulatory/governance hook.** Fall-back liability (E-Commerce Rules 2020); FDI 25% single-vendor cap as a constraint on remediation; algorithmic throttling must be human-gated.
- **Feasibility.** [REG] strong; [ARCH] seller entity resolution is the work; [DUAL] aligned (both want bad sellers caught early).

### UC-GEMINI-A5 — Orchestrated-attack vs genuine-defect discriminator
- **Archetype:** interaction-side integrity classifier
- **Bucket:** A
- **Signal:** A 1-star surge on a hero SKU — is it a competitor attack or a real product change?
- **Cadence/trigger:** Real-time alert.
- **Primary user → routed exec:** Trust & Safety → Category Head.
- **1. Data aggregation.** Interaction: review text/velocity, reviewer-account signals, social. Substrate: order velocity, seller listing-change events.
- **2. Baseline creation.** Normal review velocity and reviewer-diversity profile per SKU.
- **3. Dynamic detection.** Distinguish low-diversity, low-purchase-linked bursts (attack signature) from purchase-linked, aspect-specific complaints (real defect, e.g. fabric changed).
- **4. Distillation.** Separate the two failure modes explicitly; suppress neither, route differently.
- **5. Surfacing & routing.** Card stating which pattern, with the evidence band. Draft: takedown-review (attack) or catalogue/seller action (defect). Human gate. Hero: an **attack-vs-defect verdict** with confidence.
- **Why it beats a self-built dashboard.** A rating tile shows the drop; it cannot tell the Head whether to call Trust & Safety or the seller — Gemini's exact kurta dilemma.
- **Differentiation:** requires substrate + interaction signals together (a light join).
- **Worked example.** A top kurta takes 140 1-star reviews in a day; 80% from accounts with no verified purchase, no aspect specificity → attack-likely `[illustrative]`.
- **Regulatory/governance hook.** Review-integrity / unfair-trade-practice exposure; evidence retained.
- **Feasibility.** [ARCH] doable with account + velocity features; FP risk on genuine viral anger. [PM] strong demo card.

### UC-GEMINI-A6 — Listing-compliance gap detector from complaint text (Legal Metrology)
- **Archetype:** interaction-side compliance-to-catalogue monitor
- **Bucket:** A
- **Signal:** Complaints about missing/incorrect mandatory declarations (MRP, country of origin, net quantity) cluster on specific listings.
- **Cadence/trigger:** Weekly; alert on a spike.
- **Primary user → routed exec:** CX/VoC Head → Category Ops / Compliance.
- **1. Data aggregation.** Interaction: reviews, care chat, returns free-text mentioning "wrong MRP", "no country of origin". Substrate: SKU/listing keys.
- **2. Baseline creation.** Normal disclosure-complaint rate per category/SKU.
- **3. Dynamic detection.** Disclosure-complaint cluster above baseline on a listing.
- **4. Distillation.** Map free-text to the specific declaration at fault; rank by listing reach.
- **5. Surfacing & routing.** Card: the listing, the missing declaration, the evidence. Draft: PIM/listing-fix ticket. Human gate. Hero: a **listing-compliance fix card**.
- **Why it beats a self-built dashboard.** BI shows catalogue completeness as a field-presence check; it cannot detect that the *displayed* value is wrong in the customer's experience, which Legal Metrology penalises and which drives RTOs.
- **Differentiation:** interaction-visible, projecting onto catalogue.
- **Worked example.** 60 "country of origin missing" mentions across a cluster of imported-electronics listings `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology (Packaged Commodities) Rules; Department of Consumer Affairs notice risk.
- **Feasibility.** [REG] clear obligation; [ARCH] straightforward extraction; low FP.

### UC-GEMINI-A7 — Stockout lost-GMV ranker with wasted-spend overlay
- **Archetype:** substrate-side opportunity-loss distillation
- **Bucket:** A
- **Signal:** A high-velocity SKU is unavailable when demand (and ad spend) is highest.
- **Cadence/trigger:** Real-time / daily.
- **Primary user → routed exec:** Category Head → Operations / Pricing.
- **1. Data aggregation.** Substrate: availability/stock events, demand/PDP views, ad-exposure, GMV. Interaction: none in v1.
- **2. Baseline creation.** Expected GMV per SKU per slot given demand and ad pressure.
- **3. Dynamic detection.** Stockout on a high-demand, ad-backed SKU → quantified lost GMV + wasted spend.
- **4. Distillation.** Suppress low-velocity stockouts; rank by lost GMV + ad waste.
- **5. Surfacing & routing.** Card: SKU, lost GMV, wasted ad spend, suggested replenishment/ad-pause. Human gate. Hero: a **lost-GMV + ad-waste pairing**.
- **Why it beats a self-built dashboard.** A stockout tile is binary; it does not price the loss or flag that marketing is funding traffic to an unavailable SKU.
- **Differentiation:** substrate-visible.
- **Worked example.** A hero blender stocks out at peak while ₹2.1L/day of sponsored traffic still routes to it `[illustrative]`.
- **Regulatory/governance hook.** None primary.
- **Feasibility.** [ARCH] needs reliable availability + ad-exposure feeds; [PM] strong, but value rises when joined to "not available" voice (B4-adjacent).

### UC-GEMINI-A8 — Return-fee policy impact monitor (serial returner vs AOV)
- **Archetype:** substrate-side policy-effect distillation
- **Bucket:** A
- **Signal:** After a ₹15–30 return fee is introduced, did it isolate serial returners or depress overall AOV and conversion?
- **Cadence/trigger:** Weekly post-policy.
- **Primary user → routed exec:** Category Head → CX/VoC Head.
- **1. Data aggregation.** Substrate: return frequency cohorts, AOV, conversion, fee events. Interaction: complaint text about the fee (light overlay).
- **2. Baseline creation.** Pre-policy AOV/conversion by returner cohort.
- **3. Dynamic detection.** Post-policy divergence: serial-returner volume down (intended) vs broad AOV/conversion down (collateral).
- **4. Distillation.** Separate intended from collateral effect; surface the trade-off, do not average it.
- **5. Surfacing & routing.** Card stating both effects with magnitudes. Draft: keep/tune/rollback recommendation. Human gate. Hero: an **intended-vs-collateral split**.
- **Why it beats a self-built dashboard.** Gemini's exact question; a single AOV tile hides whether the fee worked or quietly taxed loyal buyers — and the CX view that frictionless returns drive 3× repeat means the collateral risk is real.
- **Differentiation:** substrate-visible with a voice overlay.
- **Worked example.** Serial-returner orders fall 18% but full-price-buyer AOV slips 4% in the same cohort `[illustrative]`.
- **Regulatory/governance hook.** Returns policy as consumer-rights touchpoint.
- **Feasibility.** [DUAL] this is the live margin-vs-CX fight; [ARCH] clean to compute; [PM] good board-level card.

### UC-GEMINI-A9 — Promo incrementality vs organic cannibalisation detector `[long-tail — preserve]`
- **Archetype:** substrate-side spend-quality distillation
- **Bucket:** A
- **Signal:** A discount is lifting reported sales but cannibalising organic full-price demand.
- **Cadence/trigger:** Per campaign / weekly.
- **Primary user → routed exec:** Pricing/Promotions → Category Head.
- **1. Data aggregation.** Substrate: promo exposure, order-level margin, organic vs promoted mix, conversion. Interaction: "coupon trick wording" complaints (overlay).
- **2. Baseline creation.** Expected organic demand without the promo (holdout/seasonality).
- **3. Dynamic detection.** Promoted lift net of cannibalised organic = true incrementality; flag negative-incrementality SKUs.
- **4. Distillation.** Rank by margin destroyed; suppress genuinely incremental promos.
- **5. Surfacing & routing.** Card: promo, true incrementality, margin impact. Draft: stop/keep. Human gate. Hero: an **incrementality-net-of-cannibalisation** figure.
- **Why it beats a self-built dashboard.** ROAS tiles celebrate gross lift; they rarely net out organic cannibalisation, Gemini's "are discounts cannibalising organic sales?"
- **Differentiation:** substrate-visible (joins voice in GPT-style B; kept here as Gemini-grounded).
- **Worked example.** A 20%-off run shows +12% sales but −9% organic full-price in the same SKU set `[illustrative]`.
- **Regulatory/governance hook.** Drip-pricing/discount-claim honesty (CCPA).
- **Feasibility.** [ARCH] holdout design is the hard part; FP risk moderate.

---

## Bucket B — Net-new substrate × customer-voice joins that do not exist today

### UC-GEMINI-B1 — Conversion-dip ↔ concurrent voice-friction cause band (the headline join)
- **Archetype:** funnel-anomaly explanation join
- **Bucket:** B
- **Signal:** A funnel/conversion drop co-moves with a specific friction spike in the corpus in the same window.
- **Cadence/trigger:** Real-time during events; hourly batch otherwise.
- **Primary user → routed exec:** Category Head → Growth / CX / Payments / Pricing.
- **1. Data aggregation.** Substrate: funnel events by category/hour (visit→PDP→ATC→checkout→order). Interaction: care chat, social, app-store, payment/coupon/shipping-fee complaint text.
- **2. Baseline creation.** Conversion band per category × hour-of-day × day-type; voice baseline = normal friction-topic rate per 10k sessions.
- **3. Dynamic detection (cross-domain).** Conversion deviation co-occurring (time-aligned, cohort-level) with a friction topic-cluster surge — "payment failed", "coupon not applying", "shipping fee jumped".
- **4. Distillation.** Suppress expected sale-day dips against baseline; rank by GMV-at-risk × voice volume; resolve to one named cause band.
- **5. Surfacing & routing.** Card: "Checkout on [category] is X below band; the co-moving voice cause is [topic], ₹Y/hr at risk." Draft: route to the owning function. Human gate. Hero: the **Cause band** linking the broken step to the top voice cluster. Correlation-evidence band shown explicitly.
- **Why it beats a self-built dashboard.** BI shows the drop; product teams then spend days parsing tickets to guess why. The join collapses days to minutes.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A 12% checkout drop on electronics at 14:00 co-moves with a 40% surge in "hidden shipping fee" mentions → fee-config cause, ₹Z/hr exposed `[illustrative]`.
- **Regulatory/governance hook.** A conversion *spike* gets the same treatment — if it co-moves with "false urgency" complaints it is a dark-pattern flag, not a win (CCPA).
- **Feasibility.** [ARCH] Gemini's own warning: naive timestamp/fuzzy joins on unauthenticated users yield high false positives — must be cohort-level and baseline-relative. [PM] do not attempt real-time in MVP; weekly batch first. [DUAL] Category wants the rupees, CX wants the journey fix — same card.

### UC-GEMINI-B2 — Return-reason free-text ↔ SKU/PIM attribute, with sizing-chart auto-correction
- **Archetype:** structural return-mitigation join (corpus → catalogue)
- **Bucket:** B
- **Signal:** A generic "Size Issue" return code, decoded from free-text, maps to a specific PIM attribute that can be fixed at source.
- **Cadence/trigger:** Weekly; faster on a launch.
- **Primary user → routed exec:** Category Head → Catalogue/PIM + Seller-Brand.
- **1. Data aggregation.** Substrate: return flags/reason codes, SKU, PIM/sizing attributes, contribution. Interaction: return free-text + reviews ("chest too tight", "runs small").
- **2. Baseline creation.** Per SKU: normal return-reason mix and the gap between coded reason and free-text specifics.
- **3. Dynamic detection (cross-domain).** Free-text consistently contradicts the listing's stated attribute (e.g. chest measurement) above a confidence band, tied to elevated returns.
- **4. Distillation.** Collapse many verbatims into one structural defect; rank by returns-driven margin leakage.
- **5. Surfacing & routing.** Card: SKU, the specific attribute at fault, the verbatim cluster, contribution recovered if fixed. Draft: a **proposed PIM update** (sizing-chart remap) for human approval — never auto-written. Hero: the **return-reason → catalogue-fix loop**.
- **Why it beats a self-built dashboard.** Returns platforms give rigid dropdowns ("Size Issue"); the actionable detail is buried in text. Standard BI cannot map verbatim → exact PIM field. This is Gemini's signature structural fix — stop the next return, do not just process this one.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** 38% of returns on a shirt code "Size Issue"; free-text concentrates on "chest narrow vs chart"; proposed chart remap projects a return drop from 31%→19%, the Zaroori-Retail benchmark, but automated `[illustrative]`.
- **Regulatory/governance hook.** Legal Metrology / "not as described"; the PIM write stays human-gated and audit-logged.
- **Feasibility.** [ARCH] entity resolution verbatim→PIM is the hardest single step and the moat; FP risk if the chart is right and buyers misjudge. [DUAL] Category fixes the listing, CX pre-empts the ticket — same card, two actions.

### UC-GEMINI-B3 — RTO-by-geography ↔ voice: logistics-failure vs sub-standard-product arbitration
- **Archetype:** blame-arbitration join
- **Bucket:** B
- **Signal:** An RTO spike in a region — is it a delivery-partner failure or sellers shipping sub-standard goods that get doorstep-rejected?
- **Cadence/trigger:** Operational-weekly; alert on a regional spike.
- **Primary user → routed exec:** Category Head (arbiter) → Operations vs Seller-Brand.
- **1. Data aggregation.** Substrate: RTO/NDR by pin-code/lane, delivery-attempt logs, seller. Interaction: care calls/chat + social by the same lane ("torn packaging", "wrong item", "rude rider", "damaged").
- **2. Baseline creation.** Per lane: normal RTO and normal complaint-theme mix.
- **3. Dynamic detection (cross-domain).** RTO spike co-moving with delivery-theme voice (→ logistics) vs product-quality-theme voice (→ seller) in the same lane.
- **4. Distillation.** Route to the correct owner with evidence; suppress the unsupported blame.
- **5. Surfacing & routing.** Card stating the verdict (logistics vs seller) with the co-moving voice band and affected GMV. Draft: lane-level ops escalation or seller review. Human gate. Hero: a **blame-resolution verdict**.
- **Why it beats a self-built dashboard.** Gemini's territorial dispute: logistics points at high delivery-attempt data, CX points at angry tickets, and the Head arbitrates blind without the join.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** UP RTO hits 35% vs 22% baseline; co-moving voice is 70% "damaged/torn packaging" → logistics-led, not seller `[illustrative]`.
- **Regulatory/governance hook.** Pin-code-level *action* is gated (geography-as-proxy risk); insight is permissible.
- **Feasibility.** [ARCH] lane-level cohort join is tractable; FP risk if voice is sparse in a lane. [DUAL] resolves the standing org fight — high resonance.

### UC-GEMINI-B4 — Seller support-cost time ↔ seller contribution-margin join
- **Archetype:** true-seller-profitability join
- **Bucket:** B
- **Signal:** A seller's real cost includes the support-agent hours its defects consume — never netted against its margin contribution.
- **Cadence/trigger:** Monthly/strategic.
- **Primary user → routed exec:** Seller-Brand Partnerships → Head of Category.
- **1. Data aggregation.** Substrate: seller GMV, take-rate, contribution, GMV concentration. Interaction: support-ticket volume/time and dispute transcripts attributed to the seller.
- **2. Baseline creation.** Per seller: expected support load for its GMV/category vs actual.
- **3. Dynamic detection (cross-domain).** Sellers whose support-time burden, costed, materially erodes their stated contribution.
- **4. Distillation.** Convert support transcripts into a costed burden; rank by margin actually destroyed.
- **5. Surfacing & routing.** Card: seller, stated contribution vs contribution-after-support-cost, evidence. Draft: coaching / terms / cull proposal (FDI-aware). Human gate. Hero: a **true-contribution figure**.
- **Why it beats a self-built dashboard.** Gemini: this join is "virtually never done", leaving high-maintenance sellers eroding margin invisibly while the seller P&L looks fine.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A seller showing ₹40L contribution consumes support time costing ₹14L, a third of it, invisible in the ledger `[illustrative]`.
- **Regulatory/governance hook.** FDI 25% cap and non-discrimination constrain remediation; differential action human-gated.
- **Feasibility.** [ARCH] attributing agent-time to seller is the hard plumbing. [PM] strong strategic card, not a real-time one.

### UC-GEMINI-B5 — 1-star surge ↔ order velocity + listing-change join (real-time integrity)
- **Archetype:** integrity + cause join
- **Bucket:** B
- **Signal:** A live 1-star surge, cross-checked against order velocity and whether the seller silently changed the listing/fabric.
- **Cadence/trigger:** Real-time.
- **Primary user → routed exec:** Trust & Safety → Category Head.
- **1. Data aggregation.** Substrate: order velocity, seller listing/SKU-attribute change events. Interaction: review text/velocity, reviewer signals, social.
- **2. Baseline creation.** Normal review velocity, reviewer diversity, and listing-stability per SKU.
- **3. Dynamic detection (cross-domain).** A 1-star surge co-timed with a listing/composition change → genuine defect; surge with no change and low purchase-linkage → orchestrated.
- **4. Distillation.** Bind the two streams into one verdict with confidence.
- **5. Surfacing & routing.** Card with the verdict + evidence band. Draft: takedown-review or catalogue/seller action. Human gate. Hero: a **real-time integrity verdict**.
- **Why it beats a self-built dashboard.** Extends A5 with the substrate join (listing-change + velocity) the corpus alone cannot see — Gemini's "did the seller change the fabric without updating the listing?"
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** A kurta's 1-star rate quadruples 36 hours after a silent fabric-field change → defect-led, route to seller `[illustrative]`.
- **Regulatory/governance hook.** Unfair-trade-practice / misleading listing; evidence retained.
- **Feasibility.** [ARCH] needs reliable listing-change events; FP risk on genuine virality.

### UC-GEMINI-B6 — Return-initiation spike ↔ care-chat hardware-defect chatter (real-time recall signal)
- **Archetype:** early-defect-wave join
- **Bucket:** B
- **Signal:** Returns on a specific model spike today while care chats discuss a hardware defect.
- **Cadence/trigger:** Real-time.
- **Primary user → routed exec:** Category Head → Seller-Brand + Trust & Safety.
- **1. Data aggregation.** Substrate: return-initiation events by model, order velocity. Interaction: care-chat/call transcripts mentioning the defect.
- **2. Baseline creation.** Normal return-initiation rate and defect-mention rate per model.
- **3. Dynamic detection (cross-domain).** Co-movement of return-initiation spike and a specific defect theme in real time.
- **4. Distillation.** Confirm a single defect narrative; suppress unrelated returns.
- **5. Surfacing & routing.** Card naming the model, the defect, the projected return wave. Draft: delist/quarantine + seller escalation. Human gate. Hero: an **early defect-wave alert**.
- **Why it beats a self-built dashboard.** A returns tile reports the spike after the fact; the join names the cause while the wave is forming — Gemini's exact smartphone example.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Return-initiation on a phone model jumps 3× by noon; 60% of same-day care chats cite the same overheating defect `[illustrative]`.
- **Regulatory/governance hook.** Product-safety / fall-back liability; auditable evidence.
- **Feasibility.** [ARCH] tractable; FP risk if defect language is vague.

### UC-GEMINI-B7 — Conversion/attachment spike ↔ dark-pattern complaint join (compliance-grade)
- **Archetype:** compliance causation join
- **Bucket:** B
- **Signal:** A conversion or attachment-rate spike co-moves with manipulation-specific complaints — a win that is actually a liability.
- **Cadence/trigger:** Real-time around offers/flash sales.
- **Primary user → routed exec:** Legal/Compliance → Growth + Category.
- **1. Data aggregation.** Substrate: conversion/attachment/AOV events, offer/checkout config. Interaction: dark-pattern complaint clusters (from A3).
- **2. Baseline creation.** Normal conversion/attachment per offer; normal manipulation-complaint rate.
- **3. Dynamic detection (cross-domain).** Positive metric spike co-occurring with a basket-sneaking/false-urgency/forced-action complaint surge tied to the same interface.
- **4. Distillation.** Separate genuine demand from manipulation-driven lift; keep the manipulation-linked evidence.
- **5. Surfacing & routing.** Card: the spike, the co-moving complaint pattern, the offending element, audit-ready evidence. Draft: compliance hold. Strict human gate. Hero: a **"spike that is a liability" flag**.
- **Why it beats a self-built dashboard.** Gemini: a spike can no longer be blindly celebrated; product analytics rewards conversion while compliance sees the complaints later. The join makes the celebration auditable in real time.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Attachment rate jumps 30% on a checkout change while "added something I didn't choose" mentions surge → basket-sneaking flag with evidence `[illustrative]`.
- **Regulatory/governance hook.** CCPA Guidelines 2023 + 5 June 2025 self-audit advisory; the auditable trail proves (or disproves) compliance.
- **Feasibility.** [REG] this is where compliance budget lives. [ARCH] linking UI config to complaint language is hard; [PM] evidence only.

### UC-GEMINI-B8 — Seller-onboarding-guideline efficacy ↔ "not as described" voice + RTO
- **Archetype:** policy-efficacy causal join
- **Bucket:** B
- **Signal:** Did a new seller-onboarding guideline actually reduce "not as described" complaints and the RTOs they cause?
- **Cadence/trigger:** Monthly/strategic, cohorted by onboarding date.
- **Primary user → routed exec:** Seller-Brand Partnerships → Head of Category.
- **1. Data aggregation.** Substrate: seller onboarding-cohort, RTO/return rates. Interaction: "not as described" complaint rate by seller cohort.
- **2. Baseline creation.** Pre-guideline complaint + RTO rates for comparable cohorts.
- **3. Dynamic detection (cross-domain).** Post-guideline cohorts showing (or not) a joint drop in "not as described" voice and RTO vs baseline.
- **4. Distillation.** Attribute the change to the guideline net of seasonality; surface efficacy honestly.
- **5. Surfacing & routing.** Card: guideline, cohort, joint movement in voice + RTO. Draft: keep/strengthen/revise. Human gate. Hero: a **policy-worked-or-not verdict**.
- **Why it beats a self-built dashboard.** BI can trend RTO by cohort but cannot tie it to the *qualitative* "not as described" signal the guideline was meant to fix — Gemini's exact governance question.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Sellers onboarded post-guideline show "not as described" mentions down 27% and RTO down 6pts vs the prior cohort `[illustrative]`.
- **Regulatory/governance hook.** Marketplace duty-of-care; evidence supports FDI/consumer-protection posture.
- **Feasibility.** [ARCH] cohort attribution is the work; FP risk from confounding sale cycles.

### UC-GEMINI-B9 — Cohort/category repeat-rate drop ↔ voice reasons `[long-tail — preserve]`
- **Archetype:** retention-cause join
- **Bucket:** B
- **Signal:** Repeat-purchase rate for a category falls in a specific cohort/geography — and the voice corpus says why.
- **Cadence/trigger:** Strategic-monthly.
- **Primary user → routed exec:** Category Head → CX/VoC + Growth.
- **1. Data aggregation.** Substrate: cohort repeat-rate, category, geography. Interaction: complaint/review themes for the same cohort.
- **2. Baseline creation.** Normal repeat-rate and theme mix per cohort/category/geography.
- **3. Dynamic detection (cross-domain).** Repeat-rate decline co-moving with a rising complaint theme in that cohort.
- **4. Distillation.** Surface the dominant churn-linked theme; suppress noise.
- **5. Surfacing & routing.** Card: cohort, repeat-rate drop, co-moving voice reason. Draft: targeted fix/retention play (cohort-level). Human gate. Hero: a **retention-cause band**.
- **Why it beats a self-built dashboard.** Cohort BI shows the 8% drop; it cannot name the experience reason behind it — Gemini's "ethnic wear repeat dropped 8% in Tier-2, why?"
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example.** Tier-2 ethnic-wear repeat falls 8%; co-moving voice concentrates on "colour faded after one wash" `[illustrative]`.
- **Regulatory/governance hook.** Cohort-level only; no protected-attribute proxying in any resulting action (DPDP).
- **Feasibility.** [ARCH] causal attribution is genuinely hard (correlation ≠ cause); preserve as directional. [DUAL] high resonance for both owners.

---

## Panel Notes (Gemini run)

**Sharpest disagreements to carry to merge.**
1. **[ARCH] vs [DUAL] on the real-time join (B1/B7).** [DUAL] (and the Category Head's behaviour in the source) wants the live conversion/spike→voice explanation in the demo; [ARCH] warns that probabilistic timestamp/fuzzy joins on unauthenticated users produce high false positives and that automated category decisions on such joins are dangerous. Resolution lever: make every cross-domain join **cohort-level, time-aligned, baseline-relative**, and demo it on a constrained category before claiming real-time at festival scale.
2. **[DUAL] internal: margin-extraction vs Customer-Lifetime-Margin (A8, A1).** The return-fee and serial-returner cards sit exactly on Gemini's stated fight — the Category Head taxes returns, the CX Head reclassifies reverse logistics as acquisition cost (frictionless returns → 3× repeat). The product must surface the trade-off, not pick a side.
3. **[REG] vs commercial on where the budget sits (A3/B7).** Gemini's strongest strategic claim is that procurement urgency comes from Legal/Compliance, not the commercial team. The dark-pattern evidence cards may be the wedge even though the return/RTO cards are the daily pain. Worth testing in Stage 2 ranking.
4. **[PM] sequencing.** [PM] insists weekly batch (return-reason, sentiment, seller-quality) ships before any real-time event correlation; [ARCH]/[DUAL] argue the headline operational↔voice join is "the whole point." This is the beachhead-boundary decision flagged for the Stage 2→3 gate.

**Five strongest UI candidates from this source.**
- The **Cause band** (B1) — a funnel break wired to its top co-moving voice cluster with a GMV-at-risk figure.
- The **return-reason → catalogue-fix loop** with a proposed PIM/sizing-chart update awaiting approval (B2).
- The **blame-resolution verdict** for an RTO spike: logistics vs seller, with the deciding voice band (B3).
- The **dark-pattern evidence registry** entry — pattern, verbatims, offer, count — as an audit artifact (A3/B7).
- The **true-contribution figure** for a seller (margin after support-cost burden) (B4).

**Recall note — distinct Gemini gems to preserve at merge (do not let consensus drop these).**
- The **PIM/sizing-chart auto-correction loop** as the concrete structural-return-mitigation mechanism (B2) — Gemini states it most operationally.
- The **support-cost-time ↔ seller-contribution** join (B4) — Gemini is the engine that frames true seller profitability this way.
- The **territorial-dispute arbitration** framing of RTO (B3) — a resonance gem unique to Gemini's narrative.
- **"Customer Lifetime Margin"** as a proposed blended metric and **reverse logistics as acquisition cost** (A8) — keep as a framing the catalogue can sell.
- **Semantic projection** as the defensibility argument (own the Hinglish/multilingual NLP, project thin DPDP-compliant structured insight across the boundary) — Gemini's clearest statement of the moat.
- **ONDC/Beckn touching dispute schemas but not unstructured sentiment** `[single]` — a structural-shift watch item.
- The **Zaroori-Retail 36%→19% manual benchmark** — the human-capital process LiSN automates (anchor for B2's worked example).
