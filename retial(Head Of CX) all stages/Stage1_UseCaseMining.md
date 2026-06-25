# LiSN Retail · Phase 1 · Stage 1 — Per-Source Use-Case Mining
## Source: **GPT-5 (ChatGPT-5.5 Thinking)** (`Lisn_Ph1_Retailresearch_CHATGPT-5_5_21June26.md`) · IDs keyed `UC-GPT5-*`

> One catalogue, one source. Recall-first: long-tail, inferred and single-source items are kept, not ranked away. Ranking happens only at the Stage 2 merge.

---

### Method note (kept identical to the Opus and Gemini mining docs so the three merge mechanically)
- **Stage identity.** Skill **Stage 1 — per-source use-case mining**, run against the raw GPT-5 report (never a merge). The context dump's older "Stage 2 = mine" label is the same step.
- **Inverted Phase-1 substrate.** **Bucket A** = ships-in-pilot CX cards on the interaction corpus (`CX-only (ships in pilot)`, maps to the source's **F1**); **Bucket B** = net-new interaction × transaction joins (`bridge-ready (lights up with transaction feed)`, maps to the source's **F2**).
- **Join-ready schema mandatory on every card:** CX signal · join tags (SKU · category · seller/brand · geography · channel · time) · named P&L destination · bridge status.
- **Source tags.** No `[N-source]` convergence tags here — convergence is recomputed across all four engines at Stage 2. Within this file: provenance per card; `[single]`, `[long-tail — preserve]`, `[NEW — beyond file]`, `[illustrative]` per conventions.
- **Panel:** consensus of (1) AI architect, retail data/ML; (2) CX/VoC Head **+** Category/Business Head (dual lens, tension surfaced); (3) Senior PM, LiSN; (4) Regulation & consumer-protection adviser.
- **Brand:** LiSN · British "distil" · "who" not "that" · "cost-efficient at scale" · no exclamation marks · India primary. (GOV/NOV/GMV kept as the source's q-commerce finance anchors.)

### ⚠ Cross-source status against the Opus and Gemini runs (carry to Stage 2)
1. **FTC click-to-cancel — now resolvable.** GPT-5 states the FTC "click-to-cancel" rule was **vacated in 2025** — agreeing with Opus (Eighth Circuit, 8 July 2025) and contradicting Gemini's "live template" framing. With 2 of 3 runs aligned on *vacated, not in force*, treat this as **settled at merge**: directional signal only, not enforceable India-relevant law. Gemini's framing is the imprecise minority.
2. **DPDP — three complementary characterizations; union them, do not pick one.** Opus: delete personal data within 3 years of last interaction (2 crore+ users) + 72-hour breach notification + ₹250 crore cap. Gemini: 1-year minimum log retention + 90-day grievance SLA + the retention-vs-minimisation `[conflict]`. **GPT-5: the consent standard (free, specific, informed, unconditional, unambiguous; withdrawal as easy as giving) + phased commencement — immediate for some provisions, one year for Rule 4, eighteen months for several others.** These are mostly *different provisions of the same Act/Rules*, not contradictions. The merge must assemble the full DPDP picture from all three, not adopt one engine's.
3. **Zepto ₹7 lakh fine cause — still open.** GPT-5 discusses CCPA dark patterns and the June 2025 self-audit directive but does **not** attribute the specific Zepto fine to a cause, so it does not resolve the Opus (MRP/checkout) vs Gemini (Zepto Pass subscription auto-select) conflict. Resolve at merge via the primary CCPA order text.

### Citation-quality note (source hierarchy)
GPT-5's inline citations are opaque `turn…` tool-call tokens (e.g. "citeturn39view1") that **do not resolve to named sources** in the text — treat them as artifacts, not citations. The *prose* anchors, by contrast, are stated and verifiable and should be re-checked against primary sources at merge: India e-retail ~$60 bn GMV; q-commerce >2/3 of e-grocery orders, ~1/10 of e-retail spend, >40% CAGR to 2030; Blinkit >2,200 stores (Apr 2026); Swiggy Instamart 1,136 dark stores (Jan 2026), +316 in a quarter (Q4 FY25); NCH/PIB refund grievances (8,919 grievances + ₹3.69 crore, 25 Apr–30 Jun 2025; 3,594 + ₹1.34 crore, July 2025); BIS IS 19000:2022; FSSAI 3 Dec 2024 + July 2025 advisories; country-of-origin filter effective 1 July 2027. Vendor claims are tagged `[marketing-grade]` (GPT-5 is careful here).

---

### How this run read the source
GPT-5 is the most market- and regulation-anchored of the three runs, grounded in real India figures (the $60 bn e-retail base, Blinkit/Instamart store counts, NCH grievance volumes) and the most rigorous methodological discipline. Two ideas recur and define the run. **First, denominator normalisation** — "50 angry complaints means something very different in a micro-zone with 500 orders versus one with 25,000" — applied as the primary false-positive control (order-volume-normalised baselines, day-of-week/promotion baselines, minimum-support thresholds, multilingual topic consolidation, and required cross-channel corroboration before escalation). **Second, a blunt PM filter** — "if a question cannot terminate in a tagged economic owner or metric later, it is interesting but not productised" — which is why the run insists every card carry a canonical schema (issue taxonomy, confidence score, severity score, affected-entity tags, time window, explicit target metric). It converges hard with Opus and Gemini on the dark-store, seller/SKU-trust, agent/bot and dark-pattern cards, but contributes distinct gems: refund-friction → 30/60/90-day repeat, the medicine-compliance and weight/pack long-tail cards, delivery-promise *credibility* (the point where a promise becomes "experientially unbelievable", not merely an SLA breach), catalogue-disclosure → CX damage, and a complaint → formal-grievance (NCH) escalation-prediction bridge. It also supplies two pieces of unusually useful intelligence: the **Gorgias "partial exception"** competitive flag (the closest market analogue to the wedge — revenue attribution + live order/inventory context, still narrower than a true marketplace join) and the most explicit **canonical card-schema** spec. Thin spots: the `turn` citation artifacts above; several bridges are inference pending the feed; vendor claims tagged `[marketing-grade]`.

### Card index
**Bucket A — ships in pilot (interaction corpus):** A1 dark-store operational outbreak · A2 seller/SKU trust erosion · A3 refund-friction & promise-breaker · A4 policy-confusion & app-flow regression · A5 agent & bot misfire · A6 medicine-compliance exception · A7 weight-and-pack / MRP mismatch · A8 cross-channel corroborated emerging-issue detector · A9 theme-velocity-vs-order-growth detector.
**Bucket B — bridge-ready (interaction × transaction join):** B1 complaint-adjusted GMV-at-risk by dark store · B2 seller/SKU trust tax · B3 refund-friction → 30/60/90-day repeat loss · B4 dark-pattern short-term conversion vs long-term cost (net) · B5 delivery-promise credibility by zone · B6 catalogue-disclosure non-compliance → CX damage · B7 bot-containment → seller/category trust damage · B8 complaint → NCH/formal-grievance escalation prediction.

---

# BUCKET A — pipeline cards that beat a self-built dashboard (interaction corpus, `CX-only (ships in pilot)`)

### UC-GPT5-A1 — Dark-store operational outbreak card
- **Archetype:** denominator-normalised geographic outbreak detection + cross-channel corroboration.
- **Bucket:** A · **Source basis:** F1-1 (explicit, "highest-impact, least-served").
- **Signal:** bursts in "missing item", "wrong item", "poor replacement", "expired/spoiled", "late order", "refund not received" language by city, pincode cluster, delivery slot and — where resolvable — dark-store catchment.
- **Cadence/trigger:** hourly-to-daily control tower; live break alert.
- **Primary user → routed exec:** CX/VoC Head → City / Dark-store Ops (CX-detected, Ops-actioned).
- **Join-ready schema:** Join tags: dark-store · city/pincode · delivery-slot · SKU · category · time · P&L destination: refund rate + order-completion loss + repeat-rate loss + dark-store contribution-margin leakage · Bridge status: `CX-only (ships in pilot)`, join-ready to fulfilment/GOV (→ B1).
1. **Data aggregation** — interaction inputs: tickets, calls, chats, reviews, return/cancellation text carrying the QC issue taxonomy. *(Transaction slot: order counts per catchment, fulfilment/SLA, GOV/contribution margin — B1.)*
2. **Baseline creation** — dimensions: catchment × issue-type × slot × time; "normal" = **order-volume-normalised** complaints-per-order per catchment; seasonality: day-of-week, promotion windows.
3. **Dynamic detection** — a catchment's normalised issue rate breaks its own baseline while peers hold flat, **with cross-channel corroboration** (≥2 of tickets/calls/chats/reviews/social) required before escalation.
4. **Distillation** — suppress city-wide effects and sub-minimum-support bursts; rank by normalised deviation × issue severity (spoiled/wrong > late).
5. **Surfacing & routing** — exec sees the few catchments driving the outbreak, by issue-type, with a draft Ops escalation; action: investigate store/shift/picker process; draft artifact: Ops ticket; human gate: Ops lead confirms; **hero element: the catchment outbreak map (normalised, peer-relative)**.
- **Why it beats a self-built dashboard:** traditional CX tools see generic sentiment; warehouse dashboards miss the semantics and may show flat SLA while "missing coriander" complaints rise from picker/pack/substitution causes the corpus catches first.
- **Differentiation:** interaction-visible (ships now); the GOV/margin join → B1.
- **Worked example:** overnight, "spoiled product" + "missing item" language spikes across a Hyderabad pincode cluster at ~6× the catchment's baseline complaints-per-order while neighbouring catchments hold flat `[illustrative]`; corroboration across tickets, calls and one review burst clears the escalation bar; routed to City Ops within the shift.
- **Regulatory/governance hook:** spoiled/expired bursts carry FSSAI exposure (3 Dec 2024 + July 2025 advisories); cohort/catchment-level, never identity-level.
- **Feasibility (panel):** data needed — reliable catchment/pincode tagging on interactions. Hardest part — recovering the dark-store catchment when the customer does not name it. False-positive risk — medium (the normalisation + corroboration is the control). Disagreement — minimal; all lenses rate it a hero. *(Strong 3-source convergence: Opus A2 + Gemini B1 + this — assess at merge.)*

### UC-GPT5-A2 — Seller/SKU trust erosion card
- **Archetype:** marketplace trust-failure clustering from text (early-warning layer).
- **Bucket:** A · **Source basis:** F1-2 (explicit).
- **Signal:** "counterfeit", "duplicate", "wrong specification", "defective on arrival", "used/open box", "missing accessories", "product not as described" language across complaints, reviews and calls.
- **Cadence/trigger:** daily break alert; weekly seller-cohort review.
- **Primary user → routed exec:** CX/VoC Head → Seller-Brand Partnerships + Trust & Safety.
- **Join-ready schema:** Join tags: SKU/variant · listing cluster · seller · brand · category · geography · time · P&L destination: conversion loss + return-rate lift + seller-health + listing-suppression risk + ad-yield loss · Bridge status: `CX-only (ships in pilot)`, join-ready to seller-performance denominators (→ B2).
1. **Data aggregation** — interaction inputs: review bursts + support transcripts + call language by listing cluster. *(Transaction slot: seller-performance/account-health denominators, conversion, returns — B2.)*
2. **Baseline creation** — dimensions: listing-cluster × seller × trust-theme × time; "normal" = cluster/seller baseline + category-peer rate; seasonality: post-sale return waves.
3. **Dynamic detection** — a trust-theme breaks the listing-cluster baseline with **minimum support by listing cluster** and review-burst-plus-transcript corroboration.
4. **Distillation** — suppress one-off angry reviews and category-wide effects; rank by emerging-risk velocity × theme severity (counterfeit/authenticity first).
5. **Surfacing & routing** — exec sees a ranked emerging-trust-erosion list by listing cluster with sample evidence + a draft seller action; action: seller review / quality audit; draft artifact: Seller-Success note; human gate: T&S confirms; **hero element: the listing-cluster trust-erosion leaderboard (emerging, not lagging)**.
- **Why it beats a self-built dashboard:** seller-performance systems track authenticity/dissatisfaction/returns structurally but lag; the unstructured early-warning layer is missing.
- **Differentiation:** interaction-visible (ships now); the seller-P&L join → B2.
- **Worked example:** a fast-growing SKU family from one seller accumulates "used/open box" + "missing accessories" + "not as described" language across reviews and transcripts, meeting minimum support by listing cluster, before the seller's structured defect rate visibly moves `[illustrative]`; routed to Seller-Success + T&S.
- **Regulatory/governance hook:** marketplace product-liability + seller-disclosure (E-Commerce Rules); BIS IS 19000:2022 review-integrity for the review side; insight permissible, seller action gated.
- **Feasibility (panel):** data needed — clean listing-cluster/seller tagging. Hardest part — separating seller-quality from logistics damage. False-positive risk — medium-high (drops once fused with denominators). Disagreement — Category fears flagging a strategic seller; Compliance insists evidence precedes action. *(3-source convergence: Opus A3/B12 + Gemini B4 + this — assess at merge.)*

### UC-GPT5-A3 — Refund-friction & promise-breaker card
- **Archetype:** refund-narrative anomaly with consumer-protection exposure. **GPT-5 gem (refund-friction as a standalone CX-native card).**
- **Bucket:** A · **Source basis:** F1-3 (explicit).
- **Signal:** "refund initiated but not received", "asked to wait again", "coupon instead of cash", "replacement forced", "no response after cancellation".
- **Cadence/trigger:** daily ageing + exception queues; weekly structural causes.
- **Primary user → routed exec:** CX/VoC Head → Refund/Payments Ops + Compliance.
- **Join-ready schema:** Join tags: refund reason · seller · payment mode · order-value band · category · geo · time · P&L destination: refund leakage + support cost + chargeback exposure + repeat-purchase loss · Bridge status: `CX-only (ships in pilot)`, join-ready to refund-ageing/completion (→ B3).
1. **Data aggregation** — interaction inputs: refund/cancellation narratives, repeated "promised but not received" contacts. *(Transaction slot: refund ageing, payment-failure exceptions, completion lag — B3.)*
2. **Baseline creation** — dimensions: refund-reason × payment-mode × seller × value-band × time; "normal" = baseline refund-friction rate; seasonality: post-sale/festival refund waves.
3. **Dynamic detection** — refund-friction language breaks baseline (acutely after a policy or payment change).
4. **Distillation** — suppress steady-state refund chatter; rank by friction volume × value-band × compliance severity.
5. **Surfacing & routing** — exec sees the refund-friction cluster by reason/seller/payment-mode + a draft remediation; action: clear the ageing/exception path; draft artifact: refund-ops worklist; human gate: Refund Ops confirms; **hero element: the "refund promise broken" exception tile**.
- **Why it beats a self-built dashboard:** ticket queues age linearly and do not read the narrative that a refund was promised, deferred, or swapped for a coupon — the clearest India bridge from service failure to spend reduction.
- **Differentiation:** interaction-visible (ships now); the refund-completion + repeat join → B3.
- **Worked example:** "refund initiated but not received" and "coupon instead of cash" language spikes against baseline `[illustrative]`; given e-commerce led NCH refund grievances (8,919 grievances, ₹3.69 crore, 25 Apr–30 Jun 2025), this is routed as both a CX and a compliance-exposure incident.
- **Regulatory/governance hook:** CP E-Commerce Rules 2020 (48-hour acknowledgement, one-month redressal, refund execution for accepted refunds); NCH real-time forwarding raises the stakes; audit-logged.
- **Feasibility (panel):** data needed — refund-narrative coverage. Hardest part — distinguishing genuine refund failure from impatience. False-positive risk — low-medium. Disagreement — `[conflict]` CX prefers rapid goodwill refunds; the P&L owner worries about fraud and reimbursement discipline (B3 dollarises which refund experiences actually cost repeat purchase).

### UC-GPT5-A4 — Policy-confusion & app-flow regression card
- **Archetype:** post-change dark-pattern / forced-action regression detection.
- **Bucket:** A · **Source basis:** F1-4 (explicit).
- **Signal:** "cannot cancel", "hidden charge", "auto-added", "why is this pre-selected", "forced subscription", "where is seller info", "why can I not return this now" — especially after app updates, fee changes or sale events.
- **Cadence/trigger:** event-triggered on a release/fee/policy change; continuous baseline.
- **Primary user → routed exec:** CX/VoC Head → Product + Legal/Compliance.
- **Join-ready schema:** Join tags: app version/surface · campaign/promo · journey step · category · geography · cohort · time · P&L destination: checkout conversion + cancellation + refund cost + complaint volume + repeat-rate damage · Bridge status: `CX-only (ships in pilot)`, join-ready to conversion/cancellation (→ B4).
1. **Data aggregation** — interaction inputs: dark-pattern/forced-action language with app-version/surface metadata. *(Transaction slot: checkout conversion, cancellation, accepted refunds — B4.)*
2. **Baseline creation** — dimensions: journey-step × app-version × pattern × category; "normal" = baseline dark-pattern-language rate per surface; seasonality: sale windows.
3. **Dynamic detection** — dark-pattern language breaks baseline coincident with a release/fee/policy change (the regression signature).
4. **Distillation** — suppress chronic hyperbole; rank by deviation × release coincidence × regulatory severity.
5. **Surfacing & routing** — exec sees the regression tied to the change + the consumer-protection meaning + a draft Product/Legal brief; action: roll-back/fix; draft artifact: regression + compliance brief; human gate: Product + Legal confirm; **hero element: the "post-release dark-pattern regression" tile**.
- **Why it beats a self-built dashboard:** product analytics see abandonment and conversion but not the consumer-protection *meaning* of the behaviour, which customers narrate clearly in text.
- **Differentiation:** interaction-visible (ships now); the net conversion-vs-cost join → B4.
- **Worked example:** after an app release, "why is this pre-selected" / "cannot cancel" / "auto-added" language spikes against baseline `[illustrative]`, flagged as a candidate forced-action / basket-sneaking regression to Product + Legal before it shows in abandonment.
- **Regulatory/governance hook:** CCPA Dark Patterns 2023 (13 patterns; notified 30 Nov 2023; June 2025 self-audit directive); never auto-fires.
- **Feasibility (panel):** data needed — app-version/surface on the complaint. Hardest part — reliable version/surface attribution. False-positive risk — low-medium (release-coincidence is the control). Disagreement — minimal at detection. *(Convergence: Gemini A2/A5 + Opus A4 + this — assess at merge.)*

### UC-GPT5-A5 — Agent & bot misfire card
- **Archetype:** automation/agent quality-failure detection.
- **Bucket:** A · **Source basis:** F1-5 (explicit).
- **Signal:** contradictory answers, unresolved closures, agent rudeness, repeat-contact after bot resolution, DSAT linked to automation rather than the original issue.
- **Cadence/trigger:** daily; live on a quality-failure cluster.
- **Primary user → routed exec:** CX/VoC Head → CX Ops / conversation-design + AI-ops.
- **Join-ready schema:** Join tags: bot flow/intent · queue/agent/bot · category · seller/geo · channel · time · P&L destination: contact-deflection quality + cost-saved-vs-reintroduced + retention + seller/category trust · Bridge status: `CX-only (ships in pilot)`, join-ready to deflection-cost + trust outcomes (→ B7).
1. **Data aggregation** — interaction inputs: bot + human transcripts, closure/reopen events, repeat-contact after "resolution", DSAT attribution. *(Transaction slot: deflection-cost ledger + downstream trust outcomes — B7.)*
2. **Baseline creation** — dimensions: intent × flow × agent/bot × outcome; "normal" = baseline reopen/repeat per intent; seasonality: post-deploy drift.
3. **Dynamic detection** — an intent/flow shows reopen, repeat-after-bot-resolution, rudeness or automation-attributed DSAT above baseline (a "fast but incomplete" resolution).
4. **Distillation** — suppress known-hard intents; rank by reintroduced-work volume × cost.
5. **Surfacing & routing** — exec sees the misfiring flow + sample transcripts + a draft fix; action: patch flow/prompt or coach; draft artifact: conversation-design/QA note; human gate: owner confirms; **hero element: the "containment quality, not containment count" tile**.
- **Why it beats a self-built dashboard:** QA tools score containment; this surfaces where "fast" resolutions are incomplete or bots merely defer work.
- **Differentiation:** interaction-visible (ships now); the cost-saved-vs-reintroduced + trust join → B7.
- **Worked example:** a bot flow marks a cluster "resolved", but the same intent shows repeat contact + automation-attributed DSAT + agent-rudeness flags within 24 hours `[illustrative]`; surfaced as a containment-quality failure, not a win.
- **Regulatory/governance hook:** auditable automated-handling quality supports DPDP/E-Commerce explainability; cohort-level.
- **Feasibility (panel):** data needed — transcripts + reopen/repeat linkage + version tags. Hardest part — attributing DSAT to automation vs the underlying issue. False-positive risk — low-medium. Disagreement — `[conflict]` CX wants quality containment; the business head may weight automation savings until the join (B7) proves the hidden rework. *(Convergence: Opus A13 + Gemini A4 + this — assess at merge.)*

### UC-GPT5-A6 — Medicine-compliance exception card
- **Archetype:** regulated-category compliance-exception scan. `[single]` · `[long-tail — preserve]` · **GPT-5 gem.**
- **Bucket:** A · **Source basis:** F1-6 (explicit long-tail, source-flagged `[single]`).
- **Signal:** complaint language implying unlawful or poorly-controlled medicine delivery, prescription-verification gaps, or unlicensed sale.
- **Cadence/trigger:** continuous; immediate on a compliance-exception cluster.
- **Primary user → routed exec:** CX/VoC Head → Compliance + Pharmacy/Category lead.
- **Join-ready schema:** Join tags: SKU/drug · seller/pharmacy · city/dark-store · time · P&L destination: regulatory exposure + forced takedowns + inventory-withdrawal cost · Bridge status: `CX-only (ships in pilot)`.
1. **Data aggregation** — interaction inputs: complaint/chat text referencing medicine delivery without verification, prescription issues, unlicensed-sale patterns. *(Transaction slot: prescription-verification logs + licence status.)*
2. **Baseline creation** — dimensions: drug/category × seller × geo × time; "normal" = baseline medicine-complaint profile; seasonality: minimal.
3. **Dynamic detection** — medicine-compliance language clusters above baseline or matches an unlawful-sale pattern.
4. **Distillation** — suppress routine medicine queries; rank by regulatory severity × cluster size.
5. **Surfacing & routing** — exec sees the compliance-exception cluster + a draft Compliance escalation; action: investigate/takedown; draft artifact: regulatory-exception note; human gate: Compliance confirms; **hero element: the "regulated-category exception" flag**.
- **Why it beats a self-built dashboard:** generic CX tools have no regulated-category lens; this isolates a high-consequence exception before a regulator does.
- **Differentiation:** interaction-visible (ships now).
- **Worked example:** complaint language implies a prescription medicine shipped without verification, or an unlicensed-sale pattern `[illustrative]`; surfaced to Compliance as a regulatory-exception card — destination later: forced takedowns and inventory withdrawal.
- **Regulatory/governance hook:** drug/pharmacy regulation + consumer-protection; high-sensitivity, audit-logged, human-gated.
- **Feasibility (panel):** data needed — medicine-complaint language coverage. Hardest part — precision (false accusations are high-consequence). False-positive risk — medium (the reason it is exception-only + human-gated). Disagreement — Compliance rates it high-value given quick-commerce pharmacy expansion; architect notes thin precedent (`[single]`).

### UC-GPT5-A7 — Weight-and-pack / MRP mismatch card
- **Archetype:** quantity/pricing-disclosure complaint scan. `[single]` · `[long-tail — preserve]`.
- **Bucket:** A · **Source basis:** F1-7 (explicit long-tail, source-flagged `[single]`).
- **Signal:** "short quantity", "wrong size", "MRP mismatch", "weight anomaly" language.
- **Cadence/trigger:** daily; weekly category review.
- **Primary user → routed exec:** CX/VoC Head → Catalogue + Legal Metrology compliance + Seller.
- **Join-ready schema:** Join tags: SKU · seller · category · pack/quantity · time · P&L destination: refund leakage + Legal Metrology exposure + listing-quality cost · Bridge status: `CX-only (ships in pilot)`, join-ready to weight-anomaly/return codes.
1. **Data aggregation** — interaction inputs: short-quantity/MRP/weight complaint text, return-reason narratives. *(Transaction slot: structured weight-anomaly rate, MRP/listing data, returns — Amazon/Flipkart track weight-anomaly structurally.)*
2. **Baseline creation** — dimensions: SKU × seller × pack/quantity × time; "normal" = baseline quantity/MRP complaint rate; seasonality: festival.
3. **Dynamic detection** — quantity/MRP/weight language breaks the SKU/seller baseline.
4. **Distillation** — suppress one-offs; rank by deviation × Legal Metrology severity × refund cost.
5. **Surfacing & routing** — exec sees the SKU/seller quantity-mismatch cluster + a draft catalogue/compliance fix; action: listing/MRP/seller correction; draft artifact: Legal Metrology note; human gate: Catalogue/Compliance confirms; **hero element: the "MRP / weight mismatch" listing-quality tile**.
- **Why it beats a self-built dashboard:** the early language signal ("short quantity / MRP mismatch") sits in the corpus before the structured weight-anomaly rate moves.
- **Differentiation:** interaction-visible (ships now); the weight-anomaly/return-code join is the extension.
- **Worked example:** "short quantity" and "MRP mismatch" language clusters on a grocery SKU `[illustrative]`; flagged for Legal Metrology exposure and listing-quality review.
- **Regulatory/governance hook:** Legal Metrology (manufacturer details, net quantity, MRP, best-before; e-commerce declaration regime); SKU-level.
- **Feasibility (panel):** data needed — quantity/MRP complaint coverage. Hardest part — separating customer expectation from genuine mismatch. False-positive risk — medium. Disagreement — PM notes overlap with the return-text radar (Opus A5); Compliance wants it standalone for the Legal Metrology audit trail. *(Partial convergence: Opus A5 — assess at merge.)*

### UC-GPT5-A8 — Cross-channel corroborated emerging-issue detector
- **Archetype:** novel-emergence detection gated by cross-channel corroboration. `[NEW — beyond file]` (from §B-daily + §F-intro).
- **Bucket:** A · **Source basis:** mined from §B-daily ("which new complaint clusters show up simultaneously in tickets, calls, chats, reviews, and social") + §F-intro (cross-channel corroboration as the FP control).
- **Signal:** a new complaint cluster appearing simultaneously across ≥2 independent channels.
- **Cadence/trigger:** continuous; real-time break alert + daily digest.
- **Primary user → routed exec:** CX/VoC Head → the owning function for the theme.
- **Join-ready schema:** Join tags: issue theme · channel · SKU/seller/geo when extractable · time · P&L destination: cost-to-serve + GMV-at-risk · Bridge status: `CX-only (ships in pilot)`.
1. **Data aggregation** — interaction inputs: tickets, calls, chats, reviews, social, with channel tags. *(Transaction slot: order volume to normalise.)*
2. **Baseline creation** — dimensions: theme × channel × entity × time; "normal" = each theme's per-channel baseline; seasonality: day-of-week, promotions.
3. **Dynamic detection** — a theme breaks baseline in ≥2 channels near-simultaneously (corroboration is the confidence gate; embedding/multivariate methods on good baselines).
4. **Distillation** — suppress single-channel noise, sub-minimum-support and seasonal spikes; rank by velocity × breadth-of-channels × tagged GMV-at-risk.
5. **Surfacing & routing** — exec sees one ranked card per corroborated emerging theme + a draft routing note; action: assign owner; draft artifact: routing note; human gate: exec confirms; **hero element: the "corroborated across channels" emerging tile**.
- **Why it beats a self-built dashboard:** single-channel tools see one slice; this requires cross-channel corroboration before escalating, raising signal quality the way no single source can.
- **Differentiation:** interaction-visible (ships now).
- **Worked example:** a "payment deducted, order not confirmed" cluster appears simultaneously in tickets, chat and X within hours `[illustrative]`; corroboration across ≥2 channels plus an order-normalised baseline clears the escalation bar; distilled to one ranked card.
- **Regulatory/governance hook:** full-coverage auditable corpus is itself the compliance posture; never auto-fires.
- **Feasibility (panel):** data needed — unified ingestion + channel tagging. Hardest part — cross-channel theme alignment (same issue, different vocabulary). False-positive risk — medium (corroboration is the control). Disagreement — architect favours the corroboration gate for exec trust; CX wants sensitivity. *(Strong convergence: Opus A1; Gemini's distributed detectors — assess at merge.)*

### UC-GPT5-A9 — Theme-velocity-vs-order-growth detector
- **Archetype:** denominator-normalised growth-relative anomaly (the run's signature). `[NEW — beyond file]` (from §B-weekly). **GPT-5 gem.**
- **Bucket:** A · **Source basis:** mined from §B-weekly ("which issue themes rose faster than order growth").
- **Signal:** a complaint theme whose growth outpaces order growth (not raw volume).
- **Cadence/trigger:** weekly business review.
- **Primary user → routed exec:** CX/VoC Head → Category + the theme owner.
- **Join-ready schema:** Join tags: issue theme · category · seller/geo · time · P&L destination: GMV-at-risk (normalised) + cost-to-serve · Bridge status: `CX-only (ships in pilot)`, join-ready to order/GOV for full dollarisation (→ B1).
1. **Data aggregation** — interaction inputs: theme volumes by category/seller/geo. *(Transaction slot: order/GOV growth for the same dimension — B1.)*
2. **Baseline creation** — dimensions: theme × category × time; "normal" = theme growth indexed to order growth; seasonality: promotion-adjusted.
3. **Dynamic detection** — a theme's growth rate exceeds the order growth rate for its dimension (the theme is genuinely worsening, not just scaling with the business).
4. **Distillation** — suppress themes growing in line with orders; rank by growth-gap × severity.
5. **Surfacing & routing** — exec sees the themes outpacing growth (and, importantly, those *not* — suppressing false alarms) + a draft action; action: investigate the outpacing theme; draft artifact: review note; human gate: Category confirms; **hero element: the "growing faster than we grew" gauge**.
- **Why it beats a self-built dashboard:** raw-volume dashboards alarm whenever the business scales; only an order-normalised view distinguishes a worsening theme from a bigger business.
- **Differentiation:** interaction-visible (ships now); full dollarisation → B1.
- **Worked example:** "late order" complaints in a city grow 30% week-on-week, but orders grew 28% — so the theme is suppressed; meanwhile "wrong replacement" grows 22% on flat orders and is escalated `[illustrative]`. The card asks not "is the number up" but "is it up faster than we grew".
- **Regulatory/governance hook:** none material; cohort-level.
- **Feasibility (panel):** data needed — order-growth normaliser by dimension. Hardest part — clean dimension alignment between themes and order counts. False-positive risk — low (this *is* a false-positive control). Disagreement — PM rates this the discipline that makes every other card credible to the P&L owner.

---

# BUCKET B — net-new interaction × transaction joins (`bridge-ready (lights up with transaction feed)`) — THE DIFFERENTIATOR

> Each states the join that does not exist today, why it is impossible without LiSN, and a correlation-evidence band. In Phase 1 these ship as tagged, join-ready tiles (visible, not built); they light up when the transaction feed arrives.

### UC-GPT5-B1 — Complaint-adjusted GMV-at-risk by dark store
- **Archetype:** denominator-normalised complaint composite → dollarised dark-store risk ("the purest q-commerce differentiator").
- **Bucket:** B · **Source basis:** F2-1 (explicit, "strongest bridge card").
- **Signal:** a denominator-normalised composite of complaint volume, negative sentiment, repeat contact and escalation for missing/wrong/expired/late/refund issues (from A1/A9).
- **Cadence/trigger:** hourly-to-daily; live during peak.
- **Primary user → routed exec:** CX/VoC Head → City/Dark-store Ops + Category (P&L: dark-store contribution margin).
- **Join-ready schema:** Join tags: dark-store · city/cluster/pincode · hour/day · category · channel · time · P&L destination: GOV/NOV at risk + refund/compensation outflow + repeat purchase + dark-store contribution margin · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: the normalised complaint composite by catchment (A1). Transaction: order counts, GOV/NOV, contribution margin, refund/compensation outflow by catchment.
2. **Baseline creation** — dimensions: catchment × issue × time; "normal" = each catchment's joint complaint + economic baseline; seasonality: peak windows.
3. **Dynamic detection** — the normalised complaint composite is **joined to the catchment's economic weight**, separating an economically trivial noisy zone from a margin-threatening failure mode in a high-value catchment.
4. **Distillation** — suppress low-value/low-order catchments; rank by GMV-at-risk × margin exposure.
5. **Surfacing & routing** — exec sees the catchment, the dollarised risk + a draft Ops intervention; **correlation-evidence band: high** if catchment/order keys are recoverable; action: fix the store/shift; draft artifact: Ops + margin brief; human gate: Ops lead confirms; **hero element: the "complaint-adjusted GMV-at-risk" dark-store card**.
- **Why impossible without the join:** interaction tools say a zone is noisy; finance/warehouse tools say a zone is big or unprofitable; only the join says whether a complaint burst is economically trivial or a margin-threatening failure in a high-value catchment.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** a catchment shows a normalised complaint composite ~4× baseline; joined to GOV/NOV and contribution margin, LiSN shows the burst sits in a high-value catchment threatening dark-store contribution margin, not a trivial zone `[illustrative]`.
- **Regulatory/governance hook:** spoiled/expired components carry FSSAI exposure; catchment/cohort-level.
- **Feasibility (panel):** data needed — catchment-keyed GOV/margin. Hardest part — catchment/order-key recovery. False-positive risk — low-medium. Disagreement — all lenses nominate this the strongest q-commerce bridge. *(Strong 3-source convergence: Opus B2 + Gemini B1 + this — likely the #1 cross-engine card at merge.)*

### UC-GPT5-B2 — Seller/SKU trust tax
- **Archetype:** trust-failure join → conversion/returns/seller-health dollarisation.
- **Bucket:** B · **Source basis:** F2-2 (explicit).
- **Signal:** anomalies in authenticity, defect, misshipment, missing-parts or misleading-listing complaints and reviews (from A2).
- **Cadence/trigger:** weekly; event-aligned on a trust-erosion burst.
- **Primary user → routed exec:** CX/VoC Head → Seller-Brand Partnerships + Category (P&L: conversion, returns, seller-health).
- **Join-ready schema:** Join tags: SKU/variant · listing cluster · seller · brand · category · geography · time · P&L destination: conversion + return-complaint rate + seller-health score + listing-suppression probability + seller-churn risk · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: trust-failure clusters (A2). Transaction: conversion, return rate, seller-performance/health, listing exposure.
2. **Baseline creation** — dimensions: listing-cluster × seller × time; "normal" = cluster/seller joint complaint + economic baseline; seasonality: post-sale.
3. **Dynamic detection** — a trust-failure cluster is **joined to the seller-performance denominators**, revealing whether it is concentrated in a strategic seller or fast-growing SKU family.
4. **Distillation** — suppress diffuse low-support clusters; rank by attributed conversion/returns impact × seller strategic value.
5. **Surfacing & routing** — exec sees the dollarised trust tax + a draft seller action; **correlation-evidence band: medium-high** (drops sharply once fused with denominators); action: seller remediation / listing review (gated); draft artifact: seller evidence pack; human gate: human + risk review; **hero element: the "trust tax" seller card (conversion + returns + churn risk)**.
- **Why impossible without the join:** CX-only systems cannot tell whether a one-star cluster is in a strategic seller or fast-growing SKU; transaction-only systems cannot explain why conversion and returns moved.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** a one-star review cluster joins to the seller's conversion + return-complaint rate + seller-health, revealing concentration in a strategic, fast-growing SKU family `[illustrative]`, quantifying the conversion/returns trust tax and a listing-suppression/seller-churn risk.
- **Regulatory/governance hook:** marketplace product-liability + seller-disclosure; BIS review-integrity; action gated to risk review.
- **Feasibility (panel):** data needed — seller-performance denominators. Hardest part — defensible evidence before any seller action. False-positive risk — low-medium. Disagreement — Category fears flagging a strategic seller; Compliance insists evidence precedes action. *(3-source convergence: Opus B12 + Gemini B4 + this — assess at merge.)*

### UC-GPT5-B3 — Refund-friction → 30/60/90-day repeat-purchase loss
- **Archetype:** refund-experience join → retained-revenue causal bridge (short outcome window). **GPT-5 gem.**
- **Bucket:** B · **Source basis:** F2-3 (explicit, "most direct causal bridge from service pain to retained revenue").
- **Signal:** refund-ageing complaints, repeated "promised but not received" narratives, repeat contact after cancellation/return (from A3).
- **Cadence/trigger:** weekly; cohort outcome tracking at 30/60/90 days.
- **Primary user → routed exec:** CX/VoC Head → Refund/Payments Ops + Growth (P&L: 30/60/90-day repeat).
- **Join-ready schema:** Join tags: seller · payment mode · order-value band · cohort · category · channel · time · P&L destination: cash-outflow timing + support cost + chargeback risk + 30/60/90-day repeat purchase · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: refund-friction narratives (A3). Transaction: actual refund-completion lag, payment-failure exceptions, the cohort's 30/60/90-day repeat.
2. **Baseline creation** — dimensions: refund-experience × cohort × time; "normal" = matched-cohort repeat baseline; seasonality: post-sale.
3. **Dynamic detection** — a refund-friction experience is **time-aligned** with the cohort's subsequent repeat collapse vs a matched cohort whose refunds completed cleanly.
4. **Distillation** — suppress small-n cohorts and cases where repeat holds; rank by attributed repeat loss × value.
5. **Surfacing & routing** — exec sees which refund experiences *destroy* future demand vs merely delay cash + a draft fix; **correlation-evidence band: high** (short window, direct); action: fix the destructive refund path; draft artifact: retained-revenue business case; human gate: Refund Ops/Growth confirm; **hero element: the "which refunds kill repeat" card**.
- **Why impossible without the join:** complaint systems prove frustration, finance systems prove the refund happened; only the join shows which refund experiences destroy future demand rather than merely delay cash return.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** refund-ageing + "promised but not received" narratives join to actual completion lag and 30/60/90-day repeat `[illustrative]`; LiSN shows which refund experiences collapse repeat (destroy demand) vs which merely delay cash (repeat holds).
- **Regulatory/governance hook:** CP Rules refund execution + NCH exposure; cohort-level.
- **Feasibility (panel):** data needed — refund-completion + cohort repeat. Hardest part — cohort matching at cohort grain. False-positive risk — low-medium. Disagreement — `[conflict]` resolution: this dollarises the A3 goodwill-vs-discipline debate. *(Adjacent to Opus B8 (repeat-contact→opex); GPT-5's is refund-specific with the 30/60/90-day window — assess at merge.)*

### UC-GPT5-B4 — Dark-pattern short-term conversion vs long-term complaint cost (net)
- **Archetype:** net-economics join (conversion gain vs refund/complaint/trust drag).
- **Bucket:** B · **Source basis:** F2-4 (explicit).
- **Signal:** spikes in wording around hidden charges, pre-selection, forced action, cancellation friction, misleading urgency (from A4).
- **Cadence/trigger:** event-aligned on a checkout/UX change.
- **Primary user → routed exec:** CX/VoC Head → Product + Growth + Legal (P&L: net checkout conversion vs downstream cost).
- **Join-ready schema:** Join tags: app version/surface · campaign/promo · journey step · category · geography · cohort · time · P&L destination: checkout conversion + cancellation + accepted refunds + NCH complaints + repeat-rate damage · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: dark-pattern language (A4). Transaction: checkout conversion, cancellation, accepted refunds, NCH-complaint linkage.
2. **Baseline creation** — dimensions: surface/version × journey-step × cohort × time; "normal" = pre-change conversion + complaint baseline; seasonality: controlled by the change boundary.
3. **Dynamic detection** — a conversion lift is **time-aligned** with rising dark-pattern complaints, cancellations, accepted refunds and NCH complaints — the net is computed.
4. **Distillation** — suppress unrelated moves; rank by net (conversion gain − refund/complaint/trust drag).
5. **Surfacing & routing** — exec sees the net verdict — profitable conversion vs pulled-forward revenue with drag + a draft roll-back/keep recommendation; **correlation-evidence band: medium-high** (clean change boundary); action: keep/adjust/roll-back; draft artifact: net-economics + compliance brief; human gate: Product + Legal confirm; **hero element: the "net, not gross" conversion card**.
- **Why impossible without the join:** product analytics celebrate conversion lift; CX monitoring only shows anger; only the join computes whether the interface lifted profitable conversion or pulled revenue forward and created refund/complaint/trust drag.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** a checkout change lifts conversion ~6% but joins to a rise in "hidden charge" complaints, accepted refunds, NCH complaints and a repeat-rate dip; the net shows the interface pulled revenue forward and created drag exceeding the gain `[illustrative]`.
- **Regulatory/governance hook:** CCPA dark patterns + NCH exposure; route to Legal.
- **Feasibility (panel):** data needed — conversion/cancellation/refund/NCH linkage + change boundary. Hardest part — isolating the change from concurrent effects. False-positive risk — low-medium. Disagreement — `[conflict]` this is where CX and growth/P&L disagree most visibly; the net framing is the arbiter. *(Convergence: Gemini B3 (drip-pricing→cart-abandonment); GPT-5's net framing is distinct — assess at merge.)*

### UC-GPT5-B5 — Delivery-promise credibility by zone
- **Archetype:** promise-believability join (beyond raw SLA). **GPT-5 gem.**
- **Bucket:** B · **Source basis:** F2-5 (explicit).
- **Signal:** late-order and "delivered/not received" complaints, ETA mistrust, repeated delivery follow-ups.
- **Cadence/trigger:** daily by zone; live during disruption.
- **Primary user → routed exec:** CX/VoC Head → City/Dark-store Ops + Category (P&L: completion rate, cost per order, repeat).
- **Join-ready schema:** Join tags: promised-ETA band · actual-delivery band · dark-store · city/pincode · channel · time · P&L destination: completion rate + redelivery/compensation cost + repeat purchase + cost per order · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: late-order/ETA-mistrust/"not received" complaints + repeated follow-ups. Transaction: promised vs actual ETA bands, completion, redelivery/compensation by zone.
2. **Baseline creation** — dimensions: zone × promised-vs-actual ETA × time; "normal" = the zone's joint promise-credibility baseline; seasonality: weather/peak.
3. **Dynamic detection** — the complaint/ETA-mistrust signal is **joined to the promised-vs-actual gap**, flagging zones where the promise has become experientially unbelievable (not merely where SLA breached).
4. **Distillation** — suppress isolated late orders; rank by credibility-gap × zone economic weight.
5. **Surfacing & routing** — exec sees the zones where the ETA promise is no longer believed + a draft promise/Ops fix; **correlation-evidence band: medium-high**; action: adjust the promise or fix fulfilment; draft artifact: promise-credibility brief; human gate: Ops confirms; **hero element: the "promise no longer believed" zone tile**.
- **Why impossible without the join:** fulfilment dashboards know actual times but not when the promise becomes experientially unbelievable; interaction data knows the trust break but not whether it is concentrated in the zones who matter economically.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** "delivered but not received" + ETA-mistrust + repeated follow-ups join to promised-vs-actual ETA bands by dark-store `[illustrative]`, flagging the zones where the promise has become experientially unbelievable and tying it to completion rate, cost per order and repeat.
- **Regulatory/governance hook:** delivery-promise + grievance timelines (CP Rules); cohort/zone-level.
- **Feasibility (panel):** data needed — promised + actual ETA bands by zone. Hardest part — modelling "experientially unbelievable" beyond a raw SLA number. False-positive risk — medium. Disagreement — PM rates the credibility framing a distinct, defensible signal vs SLA; architect notes it needs both promise and actual data. *(Loosely converges with Opus B2/B11 + Gemini B8 — GPT-5's promise-credibility angle is distinct — assess at merge.)*

### UC-GPT5-B6 — Catalogue-disclosure non-compliance → CX damage
- **Archetype:** disclosure-compliance join → revenue/returns dollarisation. **GPT-5 gem.**
- **Bucket:** B · **Source basis:** F2-6 (explicit).
- **Signal:** complaints/review language about missing country of origin, unclear best-before date, incorrect pack/quantity, or misleading product claims.
- **Cadence/trigger:** weekly; event-aligned on a disclosure issue.
- **Primary user → routed exec:** CX/VoC Head → Catalogue + Compliance + Seller (P&L: conversion drag, returns, refund liability).
- **Join-ready schema:** Join tags: imported flag · SKU · seller · category · city · time · P&L destination: conversion drag + return-rate lift + refund liability + compliance-remediation cost · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: disclosure-confusion complaint/review text. Transaction/catalogue: imported flag, affected SKUs, conversion, returns.
2. **Baseline creation** — dimensions: disclosure-issue × SKU/seller × time; "normal" = baseline disclosure-complaint + the compliant listing state; seasonality: minimal.
3. **Dynamic detection** — disclosure-confusion language is **joined to the affected SKUs/imported flag**, quantifying which non-compliance pockets are already dragging conversion and lifting returns.
4. **Distillation** — suppress isolated queries; rank by attributed conversion drag × compliance exposure.
5. **Surfacing & routing** — exec sees the non-compliance pockets hurting trust/revenue + a draft catalogue/compliance fix; **correlation-evidence band: medium**; action: listing correction; draft artifact: catalogue-compliance brief; human gate: Catalogue/Compliance confirm; **hero element: the "disclosure gap → revenue drag" card**.
- **Why impossible without the join:** compliance teams can test a page, catalogue teams know affected SKUs, CX hears the confusion — only the bridge quantifies which non-compliance pockets are already hurting shopper trust and revenue.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** "missing country of origin" / "unclear best-before" / "wrong pack" language joins to the imported flag + affected SKUs `[illustrative]`, quantifying conversion drag and return lift — ahead of the country-of-origin filter requirement (effective 1 July 2027).
- **Regulatory/governance hook:** Legal Metrology disclosure + the imported-goods country-of-origin filter; SKU/seller-level.
- **Feasibility (panel):** data needed — catalogue/imported-flag + conversion/returns. Hardest part — mapping confusion language to the specific disclosure gap. False-positive risk — low-medium. Disagreement — minimal; clean compliance-to-revenue story.

### UC-GPT5-B7 — Bot-containment → seller/category trust damage
- **Archetype:** containment-quality join (cheap interaction damages high-value entity). `[single]`.
- **Bucket:** B · **Source basis:** F2-7 (explicit, source-flagged `[single]` + `[marketing-grade]` on QA claims).
- **Signal:** tickets technically "resolved" by bot or low-touch agent, followed by review deterioration or social escalation on the same seller/SKU cohort (from A5).
- **Cadence/trigger:** weekly; event-aligned on a containment-then-deterioration pattern.
- **Primary user → routed exec:** CX/VoC Head → CX Ops + Seller-Brand Partnerships (P&L: cost saved vs buyer loss, seller-health).
- **Join-ready schema:** Join tags: bot flow/intent · seller · SKU/category · channel · time · P&L destination: cost-saved-vs-buyer-loss + repeat purchase + seller-health damage · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: bot-"resolved" clusters + subsequent review/social deterioration on the same cohort (A5). Transaction: deflection-cost saved, seller-health, repeat.
2. **Baseline creation** — dimensions: bot-flow × seller/category × outcome × time; "normal" = baseline post-containment trajectory; seasonality: post-deploy.
3. **Dynamic detection** — a bot-contained cluster is **time-aligned** with downstream review deterioration/social escalation on a high-value seller/category.
4. **Distillation** — suppress benign containment; rank by (buyer loss + seller-trust damage − cost saved).
5. **Surfacing & routing** — exec sees the cheap-containment-that-cost-more cases + a draft routing-policy fix; **correlation-evidence band: low-medium** (`[single]`, lagged); action: re-route high-value intents to human; draft artifact: routing-policy note; human gate: CX Ops confirms; **hero element: the "containment that backfired" card**.
- **Why impossible without the join:** QA tools score containment but cannot, on their own, prove that the low-cost interaction damaged a high-value category or important seller.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** tickets "resolved" by a bot flow join to subsequent review deterioration + social escalation on the same seller/SKU cohort `[illustrative]`; LiSN shows the low-cost interaction damaged a high-value category — cost saved vs buyer loss.
- **Regulatory/governance hook:** auditable automated-handling quality (DPDP/E-Commerce explainability); cohort-level.
- **Feasibility (panel):** data needed — containment + downstream trust outcomes + seller value. Hardest part — attributing deterioration to the bot interaction specifically. False-positive risk — medium (`[single]`). Disagreement — `[conflict]` business weights automation savings until this proves the hidden loss. *(Convergence: Opus A13 + Gemini A4 + this — assess at merge.)*

### UC-GPT5-B8 — Complaint → NCH/formal-grievance escalation prediction
- **Archetype:** regulatory-escalation prediction join. `[NEW — beyond file]` (from §A NCH anchor + §C never-made-joins "app-flow complaints → later NCH complaints"). **GPT-5 gem.**
- **Bucket:** B · **Source basis:** mined from §A (NCH forwards real-time complaint data to convergence partners; e-commerce tops refund grievances) + §C ("app-flow complaints to … later NCH complaints").
- **Signal:** in-app complaint / app-flow / refund language patterns that historically precede formal NCH or consumer-court escalation.
- **Cadence/trigger:** continuous; alert on a high-escalation-risk pattern.
- **Primary user → routed exec:** CX/VoC Head → Compliance + the offending function (P&L: regulatory exposure, forced-refund liability).
- **Join-ready schema:** Join tags: issue theme · journey step · seller/SKU · city · cohort · time · P&L destination: regulatory exposure + forced-refund liability + grievance-handling cost · Bridge status: `bridge-ready`.
1. **Data aggregation** — interaction: in-app complaint/app-flow/refund language. Transaction/compliance: the operator's formal-grievance (NCH/consumer-court) outcomes + refund-resolution data.
2. **Baseline creation** — dimensions: theme × journey-step × outcome × time; "normal" = baseline escalation-to-formal-grievance rate per theme; seasonality: post-sale/regulatory-cycle.
3. **Dynamic detection** — an in-app pattern matches the historical signature of complaints that became formal NCH/consumer-court grievances (the predictive join).
4. **Distillation** — suppress low-escalation-risk themes; rank by predicted-escalation probability × penalty/liability exposure.
5. **Surfacing & routing** — exec sees the in-app complaints most likely to become regulatory exposure + a draft pre-emptive resolution; **correlation-evidence band: medium** (predictive, lagged outcomes); action: resolve before it becomes a formal grievance; draft artifact: pre-emptive-resolution + compliance note; human gate: Compliance confirms; **hero element: the "catch it before it becomes an NCH grievance" card**.
- **Why impossible without the join:** the interaction corpus shows brewing anger; the formal-grievance system shows escalations; only joining them predicts which in-app complaints will become regulatory exposure, enabling pre-emptive resolution.
- **Differentiation:** requires the join — does not exist today.
- **Worked example:** refund and app-flow language patterns that historically preceded NCH escalation are joined to the operator's formal-grievance outcomes `[illustrative]`; LiSN predicts which current in-app complaints will escalate (NCH forwards real-time complaint data to convergence partners), enabling pre-emptive resolution.
- **Regulatory/governance hook:** CP E-Commerce Rules + NCH/CCPA exposure; the auditable, human-gated, pre-emptive posture is the compliance feature.
- **Feasibility (panel):** data needed — formal-grievance outcome history to train the signature. Hardest part — obtaining/labelling the escalation outcomes. False-positive risk — medium. Disagreement — Compliance rates it high-value given NCH's live forwarding; architect notes it depends on the operator surfacing formal-grievance outcomes.

---

# Panel Notes

### Sharpest disagreements (GPT-5's framing; partly convergent with the prior runs)
1. **Pain density vs economically localised causality (§A `[conflict]`, the run's central tension).** CX acts on pain density, escalation risk and speed of deterioration — wanting full-coverage anomaly spotting before full attribution; the P&L owner acts only on signal already tagged to seller/SKU/zone and terminated in a named metric (GOV, contribution margin, returns, repeat). **Call:** this is exactly why every Bucket A card carries join tags + a named P&L destination — the join-ready discipline converts CX "heat" into P&L "action". (Convergent with Gemini and Opus Note 1; GPT-5 states it most economically — "so many VoC programmes produce heat but not action".)
2. **Earlier action on weaker evidence vs stronger localisation+dollarisation before acting (synthesis `[conflict]`).** CX wants to act early to protect trust; the P&L owner wants confidence first. **Call:** denominator normalisation + cross-channel corroboration + minimum-support thresholds form a *tunable confidence dial*, so one card serves CX (lower threshold, faster) and the P&L owner (higher threshold, dollarised) — the threshold is the knob, not a different product.
3. **Refund goodwill vs reimbursement discipline (F1-3 `[conflict]`).** CX prefers rapid goodwill refunds; the P&L owner worries about fraud, seller recovery and reimbursement discipline. **Call:** A3 surfaces the refund-friction signal; B3 dollarises which refund experiences actually destroy repeat purchase — letting the business distinguish goodwill-worth-paying from leakage. (Connects to Gemini's buyer-fraud tension A8/B2.)
4. **Automation savings vs hidden rework (F1-5/B7 `[conflict]`).** The business head initially weights bot-containment savings; CX wants quality containment. **Call:** the agent/bot misfire card + the bot-containment-harms-trust bridge make the hidden rework and seller-trust damage visible, so containment is scored on quality-adjusted cost, not raw deflection.

### Cross-source resolution & open items (for Stage 2)
- **FTC click-to-cancel — RESOLVED.** Opus + GPT-5 both state it was vacated (Eighth Circuit, 8 July 2025); Gemini's "live template" framing is the imprecise minority. Treat as settled: directional signal only.
- **DPDP — UNION, do not pick.** Three complementary characterizations (Opus 3-year deletion + 72-hour breach; Gemini 1-year retention + 90-day grievance; GPT-5 consent standard + phased commencement / 1yr Rule 4 / 18mo). The merge must assemble the full picture.
- **Zepto fine cause — STILL OPEN.** GPT-5 is silent; the Opus (MRP/checkout) vs Gemini (Zepto Pass subscription) conflict stands; resolve via the primary CCPA order text.
- **Competitive flag — Gorgias "partial exception".** GPT-5 uniquely names Gorgias as the closest market analogue to the wedge (explicit revenue attribution + live order/inventory context), still narrower than a true marketplace × q-commerce join across seller/SKU/store/pincode/profit. Carry into the positioning/defensibility analysis — the one to watch.

### Convergence map (for computing `[N-source]` tags at the Stage 2 merge)
- **Dark-store outbreak / complaint-adjusted GMV-at-risk:** Opus A2/B2 + Gemini B1 + **GPT5 A1/B1** → strongest 3-source convergence; likely the #1 cross-engine card.
- **Seller/SKU trust (erosion + tax):** Opus A3/B12 + Gemini B4 + **GPT5 A2/B2** → 3-source.
- **Agent/bot misfire (+ containment-harms-trust bridge):** Opus A13 + Gemini A4 + **GPT5 A5/B7** → 3-source.
- **Dark-pattern / app-flow regression (+ net conversion bridge):** Opus A4/B5 + Gemini A2/A5/B3 + **GPT5 A4/B4** → 3-source (sub-variations).
- **Statutory grievance / refund-compliance SLA:** Opus A12 + Gemini A1 + **GPT5 A3** → 3-source.
- **Cross-channel emerging-issue radar:** Opus A1 + **GPT5 A8** (+ Gemini's distributed detectors) → 2–3-source.
- **OOS / availability → lost GMV:** Opus B7 + Gemini B9 + **GPT5 A1/B1 (composite includes missing/OOS)** → 2–3-source.
- **Refund-friction → repeat loss:** **GPT5 A3/B3** leads; Opus B8 adjacent → 1–2-source (GPT-5 sharpest).

### Five strongest UI candidates (GPT-5's lens)
1. **B1 — Complaint-adjusted GMV-at-risk by dark store** — "the purest q-commerce differentiator"; the dollarised dark-store tile.
2. **A1 — Dark-store operational outbreak card** — the interaction-only control-tower hero.
3. **B3 — Refund-friction → 30/60/90-day repeat loss** — the short-window causal bridge (most direct service-pain → retained-revenue).
4. **A3 — Refund-friction & promise-breaker card** — the NCH-anchored refund control-tower tile.
5. **B2 — Seller/SKU trust tax** — the marketplace trust-dollarisation tile.

### Recall note — this source's distinct gems to preserve at the Stage 2 merge
*(Items a consensus merge could average away; this run is the one carrying them.)*
- **The denominator-normalisation discipline** (complaints-per-order; themes rising faster than order growth — A9; the B1 composite) — GPT-5's signature; the most rigorous false-positive-control framing across the runs.
- **A3/B3 refund-friction → 30/60/90-day repeat loss** — the sharpest refund bridge: "which refund experiences destroy future demand vs merely delay cash".
- **A6 medicine-compliance exception card** `[single]` — the pharmacy/quick-commerce regulatory gem.
- **A7 weight-and-pack / MRP mismatch** `[single]` — with the Legal Metrology + structural weight-anomaly-rate anchor.
- **B5 delivery-promise *credibility* by zone** — the "experientially unbelievable promise" framing (beyond raw SLA).
- **B6 catalogue-disclosure non-compliance → CX damage** — the imported-flag / country-of-origin (1 July 2027) revenue-drag bridge.
- **B8 complaint → NCH/formal-grievance escalation prediction** — "catch it before it becomes a regulatory grievance", anchored in NCH real-time forwarding.
- **The Gorgias "partial exception"** competitive intelligence + the most explicit **canonical card-schema** spec (issue taxonomy · confidence · severity · entity tags · time window · target metric).
- **Real market/grievance anchors** — $60 bn e-retail; q-commerce >2/3 e-grocery, ~1/10 e-retail, >40% CAGR; Blinkit >2,200 (Apr 2026); Instamart 1,136 (Jan 2026), +316/quarter; NCH 8,919 + ₹3.69 cr (Apr–Jun 2025), 3,594 + ₹1.34 cr (July 2025); BIS IS 19000:2022; FTC fake-review rule (AI-generated reviews); country-of-origin filter 1 July 2027.

---

### Counts
- **Bucket A (ships in pilot):** 9 cards (A1–A9). Minimum 8 — exceeded.
- **Bucket B (bridge-ready):** 8 cards (B1–B8). Minimum 8 — met.
- Folded to avoid near-duplicates: the resolution-quality/reopen signal sits inside A5 rather than a separate card; the CSAT/DSAT-moment → repeat bridge converges with Opus B4 and is recorded as a convergence item rather than a duplicate card; beyond-F2 bridges that converge with already-mined Opus/Gemini cards are flagged in the convergence map rather than re-created.

### Gate — decisions that shape Stage 2 (merge)
1. **Three of four sources are now mined** (Opus + Gemini + GPT-5); the Stage 2 merge needs **Perplexity** before convergence tags are final, but the convergence map above already shows the cross-engine spine forming (dark-store, seller-trust, agent/bot, dark-pattern, grievance-SLA).
2. **Resolve / union the cross-source items at merge:** FTC status (resolved — vacated); DPDP (union the three characterizations); Zepto-fine cause (open — use primary CCPA order text).
3. **Carry the competitive flag** (Gorgias partial exception) and the **canonical card-schema spec** into the catalogue/positioning stages.
4. **Preserve the recall-note gems** through the merge's single-source-gems track — A6, A7, A9, B3, B5, B6, B8, the denominator-normalisation discipline and the Gorgias flag are the long tail this run uniquely contributes.
