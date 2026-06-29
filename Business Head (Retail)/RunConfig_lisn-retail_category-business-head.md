# RunConfig — LiSN (Retail / e-commerce) / Category-Business Head

> Resolved Phase 0 configuration for this run. Phases 1–2 are already complete: the Stage 3 Insight-Card Catalogue is locked in Drive. This file is the seed every Stage 4–11 artifact reads. Two slots are **inferred** from the locked research framing and flagged `[inferred — confirm]`; everything else is grounded in the Stage 0–3 artifacts and the product profile.

```
## PRODUCT                      (<- product-profiles/fluid-lisn.md)
PRODUCT_FAMILY:   Fluid / LiSN
PRODUCT_NAME:     LiSN
PRODUCT_MODULE:   Retail / e-commerce category intelligence (marketplace + quick-commerce)
POSITIONING_WEDGE: the conduct- and CX-aware brain above the lakehouse — it joins the operator's
   interaction/voice/complaint corpus to transaction and operational anomalies to name a root cause a
   transaction-only copilot cannot. Owns 100% of voice/chat/reviews/returns-text/social; sits as an
   intelligence layer above the lakehouse, never a replacement for it.
PRODUCT_BOUNDARY: consumes the operator's summary tables + event feeds (order/GMV, funnel, returns/RTO,
   inventory, pricing/promo, fulfilment-SLA, seller-SLA, ad-server, payments); owns the interaction/voice
   corpus at full coverage; never owns or rebuilds the core lakehouse.
DOES_NOT_DO:
   - never auto-fires a customer- or seller-facing action — drafts it, a human approves, every step audit-logged
   - never autonomously down-ranks/suppresses a seller, restricts a pin-code, or restricts COD
   - cross-domain joins are cohort-level, never identity-level
   - every AI-generated element carries the sparkle/AI marker

## DOMAIN                       (<- onboarded from research; no pre-filled retail-ecommerce profile)
DOMAIN:            Indian retail / e-commerce marketplace + quick-commerce category intelligence
TARGET_ORG_TYPE:   large Indian marketplace / quick-commerce operator (Flipkart, Amazon India, Meesho,
                   Myntra, Nykaa, Blinkit, Zepto, Instamart class)
GEOGRAPHY:         India-primary; global reference Amazon / Instacart / DoorDash
KEY_ENTITIES:      category/sub-category · SKU · seller · order · customer cohort · pin-code/lane ·
                   dark-store/warehouse · promo/campaign · return/RTO · review/rating · care ticket/chat/call ·
                   refund ledger
DATA_SUBSTRATE:    order/GMV & funnel events · search/browse logs · catalogue/PIM · inventory/availability ·
                   pricing/promo events · fulfilment/delivery-SLA events · returns/RTO + reason codes ·
                   cancellation reasons · seller/SLA · payment success/failure · ad-server (impressions →
                   attributed GMV) · GST/TCS settlement (GSTR-8, net-of-returns)
INTERACTION_CORPUS (join asset, owned 100%): return/cancellation free-text · product reviews & ratings ·
                   care call transcripts (IVR/voice) · care chat · email/tickets · seller-support tickets ·
                   Q&A · app-store reviews · social/UGC · National Consumer Helpline / grievance text
KPI_SET:           GMV & growth-vs-plan; net revenue / take-rate / contribution margin (CM1); category
                   contribution after returns & CAC; market/category share; conversion (funnel by step);
                   AOV/basket; return/RTO rate; sell-through/turnover; stockout/availability/fill; attachment;
                   active sellers / GMV concentration (FDI 25% cap); repeat-buyer / cohort LTV; ad revenue /
                   ROAS / promo incrementality (retail media ≈28–31% of platform revenue); NPS/CSAT/review
                   sentiment; seller churn/dispute/SLA breach; counterfeit/quality-complaint/policy-violation rate
REGULATORY_ANCHORS: Dark Patterns Guidelines 2023 (13 patterns) + CCPA self-audit advisory 5 Jun 2025;
                   Consumer Protection (E-Commerce) Rules 2020 (Rule 4(9) consent; grievance SLA; fall-back
                   liability); DPDP Act 2023 + DPDP Rules 2025 (G.S.R. 846(E)); Legal Metrology (Packaged
                   Commodities) Rules; GST TCS s.52 (net-of-returns; GSTR-8); FDI Press Note 2 of 2018
                   (25% single-vendor cap; non-discrimination); ONDC IGM
                   [reconcile before worked examples cite: DPDP Rules date 13 vs 14 Nov 2025; return-rate band
                   15–40%; 2021 E-Commerce Rules amendment status]

## PERSONA                      (<- onboarded; Category/Business Head e-commerce not pre-filled)
PRIMARY_PERSONA:   Category / Business Head (e-commerce marketplace / quick-commerce) — sub-P&L owner
SECONDARY_PERSONAS: Head of CX / Voice-of-Customer (native second buyer — same join, different first action)
ROUTED_EXECS:      Seller-Brand Partnerships · Category Ops / Catalogue / PIM · Pricing / Promotions /
                   Retail-Media · Operations (City / Dark-store) · Trust & Safety · Compliance / Legal ·
                   Finance · Buying / Assortment
DECISION_CADENCE:  weekly primary ("this week vs last week") + daily during sale windows + real-time alerts
                   in festival peak
DAILY_JOB:         opens the tool Monday pre-review and during sale windows; reads the morning "act-on-these"
                   rail; decides where to put the team this week, which seller/SKU to fix, which promo to pull
TOP_QUESTIONS:     see Stage 4 (grouped real-time / weekly / monthly / event-triggered)
SUCCESS_METRICS:   north-star = category contribution after returns & CAC, profitable GMV;
                   diagnostic = return/RTO rate by SKU/seller, conversion, ROAS / promo incrementality,
                   seller SLA/ODR, stockout, review sentiment
TRUST_THRESHOLD:   a card must carry (1) quantified ₹ impact — contribution / GMV at risk; (2) the customer-voice
                   evidence — verbatim or ranked cause-code; (3) a fixable-vs-intent split or correlation-evidence
                   band; (4) a recommended action; (5) the routed owner — plus a regime-aware "is this real?"
                   badge so a sale-day spike is not mistaken for an incident
UI_EXPECTATION:    head-level calm density; light/dark toggle (business head may prefer light); single most
                   important signal top-left and largest; 5-second headline, 2-minute full comprehension;
                   NOT a dense ops control room; theme accent gold/navy (premium, board-adjacent)

## PROTOTYPE                    (<- prototype-intents/sales-demo.md)   [inferred — confirm]
PROTOTYPE_INTENT:  client-facing sales demo (to a prospective marketplace / quick-commerce operator)
BUILD_TARGET:      Cursor React prototype
DEMO_STORYLINE_STYLE: 2–3 hero anomalies, each resolving into an "act now + approve" moment; build from the
                   most differentiating beat (return-reason → recoverable-margin join), peak at the festival
                   real-vs-failure hero
MOCK_DATA_DEPTH:   shallow-but-vivid; numbers tie out across screens; ≥1 suppressed near-miss for credibility
SCREEN_COUNT_TARGET: 3–5

## GOVERNANCE                   (<- governance-profiles/executive + cx)   [inferred — confirm]
PERSONA_CLASS:     executive (+ cx)
GOVERNANCE_FILES:  loaded at Stage 9C from the executive + cx governance profiles
PERSONA_ALTITUDE:  head (C-suite-adjacent) — density by seniority (CL-012) → calmer head density
GOVERNANCE_PRODUCT_KEY: "Fluid (Banking CX / VoC)"   (product-profile mapping: CX / VoC / Retail module → this key)
PRODUCT_CONTEXT_ROW:    Fluid (Banking CX / VoC)

## RESEARCH
ENGINES:           Claude/Opus · Gemini 3.1 Pro · GPT-5.5 · Perplexity
STAGE3_CATALOGUE:  Lisn_Ph1_Stage3_InsightCardCatalogue.md  (Drive: Category/Business Head ▸ Merged & Product_Catalogue)
                   — 28 Tier-2 cards across 7 families; 12-card "24×7 AI Category+CX Head" set

## ANALYSIS                     (resolved from the PRODUCT profile — not authored per run)
ANALYSIS_METHOD:   anomaly detection + auto-adaptive baselining (DENSE / BURSTY / SPARSE) over the
                   interaction-and-substrate corpus; a surfaced unit is an *anomaly / signal*
METHODOLOGY_FILE:  product-methodologies/fluid-lisn-analysis-method.md   (Stage 5 loads this)
DOMAIN_SPINE:      Customer Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action
COMPONENT_VOCABULARY: KPI/executive tile · AI insight card · evidence feed · action queue · journey/conversion
                   funnel · executive brief strip · executive pulse strip · AI risk-spike monitor (horizontal
                   scroll) · floating AI day-generator · drill-down screen (separate component) · OwnershipBoard
                   with card-type filter bar
BRAND_RULES:       "LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" not
                   "cheap"; no exclamation marks; India primary; e-commerce-correct terms only (returns / RTO /
                   reverse logistics — never "chargeback")
```

## Two inferred slots to confirm (they change Phase 3–5 shape)
1. **PROTOTYPE_INTENT = sales-demo.** The entire Stage 0–3 framing — "the buyer", the "WOW" tier, the nominated demo hero, the "24×7 AI Category+CX Head" replacing the morning crawl — reads as a sales demo to a prospective marketplace operator. If this is instead an **internal-mvp** (a tool LiSN runs for its own analysts) or a **board-demo**, the screen count, storyline style, and mock-data depth shift; flag it now.
2. **GOVERNANCE = executive (+ cx).** Primary persona is a P&L head (executive altitude); the CX/VoC Head is the native second buyer (cx altitude). If the buying budget actually sits in Compliance (the research flags this as plausible — dark-pattern self-audit + DPDP), the governance class would add **compliance** and lift the conduct cards (T2-22/23/24/25) up the screen order.

If both stand, I proceed as configured.
