# Stage 2 — Use-Case-Level Merge (recall-first)

**Project:** LiSN retail / e-commerce category intelligence · **Inputs:** the four Stage 1 mining catalogues (Gemini, GPT, Opus, Perplexity), kept separate · **Run date:** 29 June 2026
**Anchor persona:** Category / Business Head (P&L) + CX / VoC Head (native buyer) · Indian marketplace / quick-commerce · India-primary.

> This is the only stage where ranking happens. Convergence is **recomputed across the four runs** — engines' own self-applied `[N-source]` tags are not trusted. Dedup is strict: two candidates merge only if archetype, signal, user→exec, decision/action, and join-requirement all match; if the workflow or decision differs, they stay as separate near-duplicates. The recall floor is on — every `[single-source — preserve]` and `[long-tail]` gem is carried into the longlist even where it ranks low.

**Convergence ledger (how many of the four runs independently produced the theme):** 4-source = 5 use cases · 3-source = 4 · 2-source = 10 · single-source = 30. Total distinct: **49** (23 substrate-/corpus-side, 26 joins), distilled from 71 mined candidates.

---

## 1. Longlist (exhaustive — nothing pruned)

**Legend.** Bucket: **A** = pipeline case that beats a self-built dashboard (substrate- or corpus-side; cross-domain join not strictly required) · **B** = substrate × customer-voice join ("does not exist today"). Join? Y = requires the substrate×voice join. MVP: **0** deterministic/corpus, ship first · **1** index + cohort-level batch joins · **2** real-time / festival · **3** parked (causal-heavy, cross-domain-heavy, or low feasibility). Source support recomputed across runs.

### A-side — substrate / corpus pipeline cases

| ID | Name | Arch | User → Exec | Support | Join? | MVP | Source IDs | Flags |
|---|---|---|---|---|---|---|---|---|
| MA1 | Return-reason free-text → cause-code distillation (quality/expectation/wrong-item; fixable-vs-intent via GoKwik) | reason-layer | Category → Catalogue/Seller/CX | 3-source | N | 0 | GPT-A1, OPUS-A2, PPLX-A7 | core |
| MA2 | Continuous aspect-sentiment monitor (anti-NPS leading indicator) | leading-indicator | CX → Category | 3-source | N | 0/1 | GEM-A2, GPT-A5, OPUS-A8 | core |
| MA3 | Seller-quality early-warning / trust-risk board with evidence packs | seller-risk | Seller-Brand → T&S/CX | **4-source** | N | 1 | GEM-A4, GPT-A3, OPUS-A7, PPLX-A5 | core |
| MA4 | Dark-pattern / conduct & CX compliance monitor (full-coverage, auditable) | compliance | Compliance/CX → Legal/Growth | **4-source** | N | 1 | GEM-A3, GPT-A6, OPUS-A4, PPLX-A6 | reg-pull |
| MA5 | Listing-compliance gap detector from complaint text (Legal Metrology → listing fix) | compliance-to-catalogue | CX → Cat-Ops/Compliance | 2-source | N | 0/1 | GEM-A6, GPT-A7 | — |
| MA6 | Promo / ad-spend safety guardrail ("do not promote / caution / safe to scale") | spend-quality | Pricing+Category → Growth/Retail-Media | single | (Y-lite) | 1 | GPT-A2 | preserve |
| MA7 | Promo incrementality vs organic cannibalisation (substrate) | spend-quality | Pricing → Category | single | N | 1 | GEM-A9 | preserve, long-tail |
| MA8 | Stockout lost-GMV ranker with wasted-ad-spend overlay (substrate) | opportunity-loss | Category → Ops/Pricing | single | N | 0 | GEM-A7 | preserve |
| MA9 | Return-fee policy impact monitor (serial returner vs AOV) | policy-effect | Category → CX | single | N | 0/1 | GEM-A8 | preserve |
| MA10 | Refund-delay → grievance-escalation early warning (corpus) | escalation | CX → Grievance/Finance | single | N | 1 | GPT-A8 | preserve, reg-pull |
| MA11 | Pre-emptive launch / catalogue-defect detection from early review velocity | leading-indicator | Category → Catalogue/Seller | single | N | 1 | OPUS-A3 | preserve |
| MA12 | Orchestrated-attack vs genuine-defect discriminator (review integrity) | integrity | T&S → Category | single | (Y-lite) | 1/2 | GEM-A5 | preserve |
| MA13 | Catalogue/content-completeness → "not as described" returns | catalogue-quality | Category → Catalogue/PIM | single | N | 1 | OPUS-A6 | preserve |
| MA14 | Null-search → assortment-gap demand signal | unmet-demand | Category → Buying | single | (Y-lite) | 1 | OPUS-A5 | preserve, NEW |
| MA15 | Voice-of-seller churn prediction | seller-retention | Seller-Brand → Category | single | N | 3 | OPUS-A9 | preserve, long-tail |
| MA16 | Seller-dispute legitimacy triage (system-error vs genuine underperformance) | fairness | Seller-Brand → T&S | single | (Y-lite) | 1 | GPT-A9 | preserve, long-tail |
| MA17 | Evidence-package / incident-packet generator with provenance | artifact | CX/Compliance → all | single | N | 0 | PPLX-A4 | preserve, **cross-cutting** |
| MA18 | Auto-adaptive anomaly engine (DENSE / BURSTY / SPARSE baselining) | anomaly-primitive | Category → all | single | N | 0 | OPUS-A1 | preserve, **foundational** |
| MA19 | Multilingual semantic index (cluster by SKU+PIN+seller; Indian-language precision) | corpus-primitive | CX → all | single | N | 1 | PPLX-A2 | preserve, **foundational** |
| MA20 | Configurable-tier real-time monitor (conservative + human-in-loop) | alerting-primitive | Category+CX+T&S → Ops | single | (Y-lite) | 2 | PPLX-A3 | preserve, **foundational** |
| MA21 | Deterministic returns↔order↔seller↔refund-ledger reconciliation backbone | deterministic-join | Category+Ops → Seller/Finance | single | N | 0 | PPLX-A1 | preserve, **foundational** |
| MA22 | Protected-attribute inference guardrail (cohort-safe; insight-permissible/action-gated) | privacy-guardrail | DPO/Reg → Category/CX | 2-source | N | 0 | GPT-B7, OPUS-(principle) | preserve, **cross-cutting** |
| MA23 | Return / RTO / refund anomaly detector, baselined by SKU×seller×geography/PIN (substrate) | anomaly | Category → Ops/Seller | 2-source | N | 0 | GEM-A1, PPLX-A8 | — |

### B-side — substrate × customer-voice joins ("does not exist today")

| ID | Name | Arch | User → Exec | Support | Join? | MVP | Source IDs | Flags |
|---|---|---|---|---|---|---|---|---|
| MB1 | **Operational-anomaly ↔ customer-voice join** (general spine; auto-adaptive baseline; routed owner; provenance) | anomaly-causation | Category → owning fn | **4-source** | Y | 1/2 | GPT-B1, OPUS-B1, PPLX-B1, GEM-B1 | spine |
| MB2 | Real-time conversion/funnel-drop cause-class explanation (UX vs payment vs fulfilment, hourly) | funnel-explanation | Category+Growth → Product/Pay/Ops | 2-source | Y | 2 | GEM-B1, PPLX-B9 | — |
| MB3 | **Return-reason free-text ↔ SKU margin & seller** (contribution-recovery action) | margin-recovery | Category → Catalogue/Seller | 3-source | Y | 1 | OPUS-B2, GEM-B2, GPT-B1 | core |
| MB4 | Return-reason ↔ PIM/sizing-chart auto-correction loop (structural prevention) | corpus→catalogue | Category → Catalogue/PIM | single | Y | 1 | GEM-B2 | preserve |
| MB5 | Returns-text ↔ warehouse pick/pack error ↔ seller return-rate (warehouse-vs-seller fault) | sub-order-cause | Ops+Seller → Category | single | Y | 1 | PPLX-B2 | preserve |
| MB6 | Aspect-sentiment ↔ conversion / returns outcome join (SKU-level) | leading-causation | Category → Catalogue/CX | 2-source | Y | 1 | GPT-B5, OPUS-A8 | — |
| MB7 | Review-manipulation / fake-review ↔ order-velocity + account/listing signals (integrity) | integrity | T&S → Seller/Category | 2-source | Y | 2 | GEM-B5, PPLX-B7 | — |
| MB8 | Counterfeit detection from review text + return-reason co-occurrence | integrity | T&S → Seller/Category | single | Y | 1 | OPUS-B10 | preserve |
| MB9 | **Seller SLA breach ↔ customer-trust-erosion voice** (seller-risk join + evidence; FDI concentration) | seller-risk-causation | Seller-Brand → CX/T&S | 2-source | Y | 1 | GPT-B3, OPUS-B5 | core |
| MB10 | Seller support-cost (agent-time) ↔ seller contribution-margin (true profitability) | profitability | Seller-Brand → Category | single | Y | 3 | GEM-B4 | preserve |
| MB11 | Seller-onboarding-guideline efficacy ↔ "not as described" voice + RTO | policy-efficacy | Seller-Brand → Category | single | Y | 3 | GEM-B8 | preserve |
| MB12 | **UI/checkout behaviour ↔ voice-of-manipulation** (revenue lever as liability; dark-pattern self-audit evidence) | compliance-causation | Compliance → Growth/Category | 3-source | Y | 2 | GEM-B7, GPT-B6, OPUS-B6 | reg-pull |
| MB13 | **Delivery-SLA / RTO breach by pin-code/lane ↔ voice** (logistics vs seller arbitration) | lane-cause | Ops → Category/Seller | 2-source | Y | 1 | GEM-B3, OPUS-B3 | resonance |
| MB14 | Pin-code-level CX-to-RTO join | geo-experience-loss | Ops+Category → CX | single | Y | 1 | OPUS-B8 | preserve |
| MB15 | Return-initiation spike ↔ care-chat defect chatter (early defect-wave / recall signal) | defect-wave | Category → Seller/T&S | single | Y | 2 | GEM-B6 | preserve |
| MB16 | Review/rating cliff on a launch ↔ release/checkout funnel change (launch-regression) | launch-regression | Category → Product/Eng | single | Y | 2 | OPUS-B4 | preserve |
| MB17 | App-store rating ↔ app-release regression join | product-regression | Product/Eng → Category/CX | single | Y | 2 | OPUS-B9 | preserve |
| MB18 | Stockout / promise-date ↔ substitution-frustration (hidden lost demand) | lost-demand | Category+Ops → Supply | single | Y | 1 | GPT-B4 | preserve, q-com |
| MB19 | Promo / ad campaign ↔ post-purchase voice damage (do-not-scale / incrementality closed loop) | spend-protection | Pricing+Category → Growth | 2-source | Y | 1 | GPT-B2, PPLX-B6 | core |
| MB20 | Ad ROAS ↔ verbatim complaint-type attribution | spend-attribution | Pricing+Retail-Media → Category | single | Y | 2 | PPLX-B5 | preserve |
| MB21 | Review/sentiment ↔ promotional impression logs + pricing errors (user-exposure level) | exposure-attribution | Pricing+Category → Growth | single | Y | 3 | PPLX-B4 | preserve |
| MB22 | Refund-delay ↔ grievance/regulatory-exposure + settlement-base reconciliation | escalation-finance | CX/Grievance → Compliance/Finance | single | Y | 2 | GPT-B8 | preserve |
| MB23 | Cohort/category repeat-rate drop ↔ voice reasons (retention-cause) | retention-cause | Category → CX/Growth | single | Y | 3 | GEM-B9 | preserve, long-tail |
| MB24 | CSAT → repeat-buyer causal join (does fixing the complaint lift retention?) | retention-causality | CX → Category/Growth | single | Y | 3 | OPUS-B7 | preserve |
| MB25 | **Festival "real demand vs failure" / low-FP incident detection** (gateway/bot/fraud) ↔ voice corroboration | event-integrity | Category+T&S → Ops/Growth | 2-source | Y | 2 | GPT-B9, PPLX-B8 | core |
| MB26 | Chat/call transcript ↔ exact order + delivery-hop logs (automated remediation) | complaint-to-order | CX → Ops | single | Y | 1/2 | PPLX-B3 | preserve |

**Enabling layers (read across the whole catalogue, not ranked against it).** Four primitives sit *under* most cards and should be specced as infrastructure, not tiles: **MA18** auto-adaptive baselining (the festival false-positive answer; under MB1/MB2/MB13/MB25), **MA19** multilingual semantic index (under every corpus card), **MA21** deterministic returns/order/seller backbone (the MVP-0 spine the harder joins extend), and **MA20** configurable alerting tiers (the cadence-fight resolution). Two cross-cutting guardrails wrap every card: **MA22** protected-attribute / insight-vs-action gate, and **MA17** provenance-stamped evidence packets.

---

## 2. Ranked shortlist (top 12)

Scored 1–5 on **Impact · Underserved · Differentiation (substrate low → interaction mid → join high) · Convergence · MVP-feasibility (inside boundary) · Reg-pull**. Shortlist biased toward joins where scores are close. Order reflects a quick-commerce / marketplace beachhead.

### #1 · MB1 — Operational-anomaly ↔ customer-voice join (the spine)
- **Signal.** Any GMV / funnel / returns / SLA / rating number that moves is named by the co-moving voice anomaly, scored against a regime-aware baseline, with the routed owner attached.
- **Beats a dashboard because.** BI shows the number, VoC shows the sentiment, nobody co-moves them; a substrate-only copilot proves a number moved but never why, where, how much, or who fixes it first.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** Conversion drops 9% against a DENSE baseline while "coupon not applying" mentions surge in the same window → promo-config cause, routed to Pricing, ₹X/hr exposed `[illustrative]`.
- **UI hero.** The **why-it-moved cause statement**, carrying a Category first action and a CX first action on one card.
- **Reg hook.** Insight permissible; differential action gated and audit-logged.
- **Score.** Impact 5 · Underserved 5 · Diff 5 · Convergence 5 · Feasibility 3 · Reg 3. **The only 4-source join; the catalogue's spine. Feasibility is the gate, not the doubt — depends entirely on MA18 baselining.**

### #2 · MB3 — Return-reason free-text ↔ SKU margin & seller
- **Signal.** "Not as described / wrong size / quality" free-text becomes a category-contribution action, with the fixable share separated from buyer-remorse via the GoKwik 60–70%-intent prior.
- **Beats a dashboard because.** Returns platforms read reason *codes*, VoC reads *sentiment*; no production system joins free-text reason → contribution → seller, yet the answer lives in text the operator already holds.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** Returns on a shirt run at 31%; ~64% is intent, but the residual "chest narrow vs chart" fault is ₹6L recoverable contribution if the listing is fixed `[illustrative]`.
- **UI hero.** The **recoverable-margin figure** with the fixable-vs-intent split.
- **Reg hook.** Legal Metrology; TCS net-of-returns; any PIM write human-gated.
- **Score.** Impact 5 · Underserved 4 · Diff 5 · Convergence 4 · Feasibility 4 · Reg 3. **The most MVP-feasible headline join — operator holds the corpus; returns ≈ ₹2 lakh cr makes the prize large.**

### #3 · MA1 — Return-reason cause-code distillation (corpus-side, MVP-0 entry)
- **Signal.** The operator's own return free-text resolves a generic code into ranked, actionable cause codes (size / quality / fake / damage / delay / missing accessory / confusing exchange).
- **Beats a dashboard because.** BI has the rate; the reason layer is the wedge a returns tile cannot supply, and it needs no cross-domain join to ship.
- **Differentiation.** Interaction-visible (becomes MB3 once joined to margin/seller).
- **Best worked example.** Returns rise 18% on a denim cluster; 42% of complaints cite size mismatch, 15% "fabric thinner than photo" → catalogue + seller actions `[illustrative]`.
- **UI hero.** A **cause-code breakdown** beside the rate.
- **Reg hook.** TCS net-of-returns reconciliation.
- **Score.** Impact 4 · Underserved 4 · Diff 3 · Convergence 3 · Feasibility 5 · Reg 2. **Highest feasibility in the catalogue; the clean MVP-0 that de-risks MB3. 3 of 4 engines independently named it.**

### #4 · MA3 — Seller-quality early-warning / trust-risk board with evidence packs
- **Signal.** Seller/SKU problems ranked by *customer-backed* GMV exposure, not raw breach counts, each opening an evidence pack of quotes + affected GMV.
- **Beats a dashboard because.** Account-health tools track cancellation/late-shipment/ODR but lack the customer-language evidence and category-level financial impact category teams need to prioritise.
- **Differentiation.** Interaction-visible (joins seller P&L in MB9).
- **Best worked example.** A long-tail seller's ODR is "near the line" but repeat-contact rate and "seller cancelled after 3 days" quotes put it top of the board, ₹Y exposed `[illustrative]`.
- **UI hero.** The **per-seller evidence pack**.
- **Reg hook.** Fall-back liability; FDI 25% concentration cap and non-discrimination on remediation.
- **Score.** Impact 4 · Underserved 4 · Diff 3 · Convergence 5 · Feasibility 4 · Reg 3. **Strongest convergence among the seller cards (all four engines); evidence pack doubles as a compliance artifact.**

### #5 · MB9 — Seller SLA breach ↔ customer-trust-erosion voice
- **Signal.** A seller's cancellation/late-dispatch rate rises and the customer voice shows the lived trust damage, weighted by affected GMV, flagged against the FDI concentration cap.
- **Beats a dashboard because.** Seller ops and CX are separate systems; account-health tiles cannot show a breach is actually destroying trust.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** A seller's cancellation rate crosses tier baseline while "cancelled after I waited 3 days" quotes cluster → top of the risk board, with a concentration flag at 23% category GMV `[illustrative]`.
- **UI hero.** A **breach-plus-voice seller verdict** with a concentration band.
- **Reg hook.** Fall-back liability; FDI Press Note 2 (25% cap, non-discrimination, RBI annual certificate).
- **Score.** Impact 4 · Underserved 4 · Diff 5 · Convergence 3 · Feasibility 4 · Reg 3. **The join that turns MA3's board from descriptive to causal; high MVP-fit on operator-held seller data.**

### #6 · MA4 — Dark-pattern / conduct & CX compliance monitor (full-coverage, auditable)
- **Signal.** Complaint clusters matching the 13 specified dark patterns, plus grievance-SLA and consent-safe-analytics obligations, surfaced continuously between periodic audits with an immutable trail.
- **Beats a dashboard because.** The 5 June 2025 CCPA self-audit advisory prescribes no method; BI cannot read "I was tricked", and brand-side VoC is not 100%-coverage or auditable. Owning the full corpus + audit log is the asset.
- **Differentiation.** Interaction-visible (becomes MB12 once joined to UI behaviour).
- **Best worked example.** "Couldn't cancel the subscription" mentions climb for two weeks after a loyalty-flow change, packaged with verbatims + timestamps as an audit artifact `[illustrative]`.
- **UI hero.** A **full-coverage audit registry** entry.
- **Reg hook.** Dark Patterns Guidelines 2023; CCPA advisory (notices to 11, 26 self-declarations by Nov 2025); DPDP Rules (G.S.R. 846(E)); SDF audit; ≥1-year retention.
- **Score.** Impact 4 · Underserved 5 · Diff 3 · Convergence 5 · Feasibility 4 · Reg 5. **Highest regulatory pull and 4-source — the card most likely to be bought by Compliance budget rather than category budget. If procurement urgency becomes a ranking axis, this rises to #2–3.**

### #7 · MB12 — UI/checkout behaviour ↔ voice-of-manipulation
- **Signal.** A conversion/AOV lift (false urgency, drip pricing, basket sneaking) co-moves with manipulation-specific complaints — a revenue lever that is actually a liability.
- **Beats a dashboard because.** Product analytics rewards conversion while compliance sees the complaints later; the join makes the celebration auditable in real time.
- **Differentiation.** Requires the join — does not exist today (with a UI-evidence caveat to prove design causality).
- **Best worked example.** A countdown-timer change lifts AOV 7% while "fake urgency" mentions surge → flagged with evidence + timestamp `[illustrative]`.
- **UI hero.** An **audit-ready dark-pattern registry** entry ("the spike that is a liability").
- **Reg hook.** Dark Patterns Guidelines 2023; CCPA 5 June 2025 advisory; E-Commerce Rules 2020 Rule 4(9).
- **Score.** Impact 4 · Underserved 5 · Diff 5 · Convergence 4 · Feasibility 3 · Reg 5. **The compliance join; pairs with MA4. Feasibility capped by the need for UI/session evidence — LiSN supplies evidence + early warning, not an enforcement verdict.**

### #8 · MB13 — Delivery-SLA / RTO breach by pin-code/lane ↔ voice (logistics vs seller arbitration)
- **Signal.** Cancellations/RTO spike in a lane and the lane's own voice decides whether it is a logistics failure or sellers shipping sub-standard goods.
- **Beats a dashboard because.** SLA-by-lane and voice-by-lane live in different systems; the Category Head otherwise arbitrates the standing logistics-vs-seller blame fight on siloed data.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** A metro lane's RTO hits 33% vs a 21% baseline; lane voice is 70% "rider didn't attempt / marked undelivered" → logistics, not seller `[illustrative]`.
- **UI hero.** A **lane blame-resolution verdict**.
- **Reg hook.** Pin-code-level *action* gated (geography proxy); Jan-2026 "10-minute" marketing directive context.
- **Score.** Impact 4 · Underserved 4 · Diff 5 · Convergence 3 · Feasibility 4 · Reg 3. **High buyer resonance — it resolves an org fight the Category Head lives inside; strong quick-commerce fit.**

### #9 · MB19 + MA6 — Promo / ad ↔ post-purchase voice damage ("do-not-scale" guardrail)
- **Signal.** A SKU being scaled with ad/promo spend is operationally unhealthy (deteriorating reviews, rising returns, stockout, seller cancellations) → a "promote / caution / do-not-promote" verdict with the dominant reason.
- **Beats a dashboard because.** Retail-media tools optimise ROAS and rarely penalise post-purchase voice damage; a campaign looks profitable until returns and complaints are joined. This is a category-P&L control, not CX reporting.
- **Differentiation.** Requires the join — does not exist today (MB19); the three-state verdict surface is MA6.
- **Best worked example.** A blender being scaled has ROAS 4.2 but recent reviews turned on "stopped working in a week" and returns are above band → "do not promote", ₹3.4L spend redirected `[illustrative]`.
- **UI hero.** The **three-state promote verdict** with ad-spend-at-risk.
- **Reg hook.** Scaling deceptive-claim SKUs intersects dark-pattern/disclosure risk.
- **Score.** Impact 4 · Underserved 4 · Diff 5 · Convergence 3 · Feasibility 3 · Reg 3. **Retail media is now ~28–31% of platform revenue, so the guardrail guards a large pool; org-seam tension with Retail-Media's ROAS mandate (see tensions).**

### #10 · MB6 — Aspect-sentiment ↔ conversion / returns outcome join
- **Signal.** A recent negative aspect (fake product, wrong shade, poor quality, damaged packaging) co-moves with a conversion dip or return rise on a high-exposure SKU, before the star average moves.
- **Beats a dashboard because.** Rating averages move slowly; PDP analytics and review mining are disconnected, so the conversion bleed is invisible until it is large.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** "Wrong shade" hits 19% of recent reviews on a foundation SKU; conversion −6% while the average holds 4.0★ → ₹Y exposed `[illustrative]`.
- **UI hero.** An **aspect-driven conversion-loss** figure.
- **Reg hook.** Misleading-image/claim exposure if the aspect is a listing defect.
- **Score.** Impact 4 · Underserved 4 · Diff 5 · Convergence 3 · Feasibility 3 · Reg 2. **Turns MA2's monitor into a P&L number; strong across fashion / beauty / electronics / private label.**

### #11 · MB25 — Festival "real demand vs failure" / low-FP incident detection
- **Signal.** During a sale, which spike is genuine demand and which is a failure signal (payment-gateway failure, bot orders, seller fraud) — surfaced while minimising alert fatigue.
- **Beats a dashboard because.** Threshold alerts break on sale days; a substrate-only view cannot tell a genuine surge from a failure surge without the voice anomaly.
- **Differentiation.** Requires the join — does not exist today (and depends on conservative festival-scale baselining).
- **Best worked example.** A 3× order spike on one SKU co-moves with "payment deducted, no order" complaints → failure signal, not demand `[illustrative]`.
- **UI hero.** A **real-vs-failure verdict** with a tier control.
- **Reg hook.** Auditable evidence for any fraud/abuse action.
- **Score.** Impact 4 · Underserved 3 · Diff 5 · Convergence 3 · Feasibility 3 · Reg 3. **Festival concentration (Diwali ≈ ₹50,000 cr in ~10 days) makes peak the highest-stakes window; this is where MA18 baselining + MA20 tiers earn their keep.**

### #12 · MB18 — Stockout / promise-date ↔ substitution-frustration (hidden lost demand)
- **Signal.** High-intent customers complain that preferred SKUs are unavailable or delayed, then switch to a competitor — quantifying demand that is otherwise invisible.
- **Beats a dashboard because.** Lost demand is unobservable unless search, stock, cart, and complaint data are joined; an inventory tile shows the stockout, not the switching it causes.
- **Differentiation.** Requires the join — does not exist today.
- **Best worked example.** A staple is out in two dark-store zones; "ordered from [competitor] instead" mentions spike → ₹1.8L weekly demand bleeding `[illustrative]`.
- **UI hero.** A **hidden-lost-demand figure** with voice proof.
- **Reg hook.** Quick-commerce delivery-promise constraint context.
- **Score.** Impact 4 · Underserved 4 · Diff 5 · Convergence 2 · Feasibility 3 · Reg 2. **Single-source but distinctly quick-commerce; included for beachhead fit despite low convergence — exactly the kind of long-tail the recall floor protects from being averaged out.**

**Just outside the 12 (next strongest):** MB2 (real-time funnel cause-class — high demo value, subset of MB1), MA2 (aspect monitor — the corpus base for MB6), MB5 (warehouse-vs-seller fault — distinctive operational granularity), MB24 (CSAT→repeat causal — high strategic value, low feasibility), MA23 (return/RTO anomaly detector — substrate base for MB3/MB13).

---

## 3. Single-source gems (preserved — each engine's distinct contribution survives)

**From Gemini.** MB4 return-reason → **PIM/sizing-chart auto-correction loop** (the only engine framing structural prevention as a catalogue write); MB10 seller **support-cost-time ↔ contribution-margin** (true seller profitability, "virtually never done"); MB15 **return-initiation ↔ defect-chatter** early recall signal; MB11 **onboarding-guideline efficacy** join; MA7 incrementality-vs-cannibalisation; MA8 stockout lost-GMV + ad-waste; MA9 return-fee policy monitor; MA12 attack-vs-defect discriminator; plus the framings **"Customer Lifetime Margin"** and **reverse logistics as acquisition cost**, and **"semantic projection"** as the defensibility argument.

**From GPT.** MA6 **three-state promo guardrail** ("do not promote / caution / safe to scale" — in the shortlist); MA22 **protected-attribute inference** as a first-class card; MA10 refund-delay → grievance-escalation; MA16 seller-dispute legitimacy triage; MB18 **hidden lost demand** (shortlisted); MB22 refund-delay ↔ reconciliation + settlement-base; plus the **operator-grounded seller anchors** (Amazon ODR < 1%, Flipkart seller-cancellation-rate, seller tiering) and the **TCS-net-of-returns** finance hook.

**From Opus.** MA18 **auto-adaptive DENSE/BURSTY/SPARSE baselining** (the only worked detectability theory — foundational); MA14 **null-search → assortment-gap demand** [NEW]; MB24 **CSAT → repeat-buyer causal** loop (proves CX ROI); MB14 **pin-code CX → RTO**; MB16 **launch-regression** (rating cliff ↔ release); MB17 **app-store ↔ app-release regression**; MB8 **counterfeit from review + return co-occurrence**; MA15 **voice-of-seller churn**; MA13 catalogue-completeness → returns; plus the **GoKwik 60–70%-intent / 20–25%-logistics** RTO split (standing prior), the **domain spine**, the **insight-vs-action** principle, and **voice→GMV as the analog to retail-media's ad→GMV clean-room join** (Forrester: 86% rank attribution top priority).

**From Perplexity.** MB5 **returns-text ↔ warehouse pick/pack error** (the only sub-order fault split); MB26 **transcript ↔ exact order + delivery hops** (automated remediation); MB21 **exposure-level** review ↔ impression-logs + pricing-errors; MB20 **ad ROAS ↔ verbatim complaint** attribution; MA17 **provenance-stamped evidence packet** (cross-cutting artifact); MA19 **multilingual semantic index** (Indian-language precision moat); MA20 **configurable alerting tiers** (cadence-fight resolution); MA21 **deterministic returns↔order↔seller↔ledger backbone** (MVP-0 spine).

---

## 4. Contradictions & tensions (for human resolution — not averaged)

1. **Beachhead boundary `[the decision that most shapes Stage 3].** Ship the headline operational↔voice join (MB1) in the MVP on a *constrained category*, or lead with operational-only + return-reason corpus (MA1/MB3) and park the full social/app-store join in Tier 3? **[ARCH]/[DUAL]** say the join *is* the demo; **[PM]** says the operator-held return text ships first and de-risks everything. Bears directly on whether MB1 or MB3/MA1 anchors v1.
2. **Real-time vs batch.** The live conversion/festival joins (MB1 real-time, MB2, MB25) carry the drama but the highest false-positive risk; **[ARCH]/[PM]** want weekly batch (MA1, MA2, MA3) first. Proposed bridge: **MA20 configurable tiers** + **MA18 baselining**, so real-time is a tier, not a separate product.
3. **Deterministic-first vs embeddings-first.** **[PM]** wants deterministic keys (MA21) before heavy ML; **[ARCH]** wants the semantic index (MA19) early to limit rework. Proposed resolution: ship MA21 as MVP-0 *and* stand up MA19 in parallel as MVP-1, so the real-time monitor inherits both.
4. **Causality honesty.** MB3, MB6, MB23, MB24 must stay **directional** (cohort-level correlation band), against the buyer instinct to read them as proven cause. Standing guard: a correlation-evidence band on every join card + the GoKwik intent/fault split as the returns prior.
5. **Ranking axis — daily pain vs procurement urgency `[open decision].** The rubric carries Reg-pull as one of six axes; if you elevate **procurement urgency** to a co-equal axis, MA4 and MB12 (compliance) climb above some operational joins, because dark-pattern self-audit + DPDP audit obligations may release budget faster than category pain. Flag your call before Stage 3 tiers the catalogue.
6. **Persona first-action tie-break.** The same card serves the Category Head ("fix listing / cull seller / re-price") and the CX Head ("fix journey / pre-empt ticket"). **[DUAL]:** whose action surfaces first on a shared card is a spec decision, not a default.
7. **Promo-guardrail authority.** LiSN's "do not promote" verdict (MB19/MA6) sits between Retail-Media's ROAS mandate and the Category Head. Whose call wins when ROAS is high but voice is bad is an org-seam question to settle before this ships.
8. **Dark-pattern proof gap.** Complaint text (MA4) shows the symptom; proving *design* causality (MB12) may need UI/session evidence from product analytics. Position LiSN as evidence + early warning, not an enforcement verdict.

**Factual reconciliations to close before Stage 3 worked examples cite them:** (a) DPDP Rules notification date — **13 vs 14 Nov 2025** appears across runs (Gazette **G.S.R. 846(E)**); confirm and lock the phased dates. (b) India return-rate band is wide across runs — **15–40% by category, fashion 25–35%, COD RTO 20–40%, blended ≈17%**; pick the anchor figures. (c) 2021 E-Commerce Rules amendment (fall-back liability / flash-sale) status — treated **`[probable / partly unverified]`**; verify before relying on it.

---

## 5. Coverage check (replaces the reconcile stage)

Every theme and archetype present in any engine's Stage 0/1 output is represented in the longlist. Confirmed per engine:

- **Gemini** — return/RTO anomaly → MA23; sentiment cliff → MA2; dark patterns → MA4/MB12; seller quality → MA3/MB9/MB10; attack-vs-defect → MA12/MB7; Legal Metrology → MA5; stockout → MA8; return-fee → MA9; promo cannibalisation → MA7; conversion-dip cause band → MB1/MB2; PIM auto-correction → MB4; RTO arbitration → MB13; support-cost↔margin → MB10; 1-star↔velocity → MB7; return-initiation defect → MB15; spike↔dark-pattern → MB12; onboarding efficacy → MB11; repeat-drop↔voice → MB23. **No gap.**
- **GPT** — voice-confirmed return leakage → MA1/MB3; promo guardrail → MA6/MB19; seller/SKU trust-risk → MA3; hidden lost demand → MB18; sentiment→conversion → MB6; dark-pattern monitor → MA4; disclosure intelligence → MA5; refund-delay escalation → MA10/MB22; seller-dispute triage → MA16; operational↔voice → MB1; promo↔post-purchase → MB19; seller SLA↔trust → MB9; protected-attribute → MA22; festival real-vs-failure → MB25. **No gap.**
- **Opus** — auto-adaptive baselining → MA18; return-reason↔margin → MA1/MB3; launch-defect → MA11; conduct/CX monitoring → MA4; null-search → MA14; completeness → MA13; seller early-warning → MA3; sentiment→returns → MA2/MB6; voice-of-seller churn → MA15; operational↔voice → MB1; delivery-SLA by lane → MB13; launch-regression → MB16; seller↔concentration → MB9; UI↔manipulation → MB12; CSAT→repeat → MB24; pin-code CX→RTO → MB14; app-store↔release → MB17; counterfeit co-occurrence → MB8; voice→GMV positioning → MB1 rationale. **No gap.**
- **Perplexity** — deterministic join → MA21; multilingual index → MA19; configurable tiers → MA20; evidence-packet → MA17; seller playbooks → MA3; content-intervention → MA4; returns root-cause class → MA1; refund-spike-by-seller/PIN → MA23; delivery/mispick↔review → MB1; warehouse pick-error → MB5; transcript↔hop → MB26; exposure-level → MB21; ROAS↔complaint → MB20; promo closed-loop → MB19; fake-review → MB7; festival incident → MB25; conversion hourly → MB2. **No gap.**

**Recall gaps:** none identified. Two items deliberately demoted to enabling-layer status rather than ranked as use cases — MA18 baselining and MA19 multilingual index — because [PM] flags them as capabilities under every card; both are preserved in the longlist and called out as foundational so they are not lost at build.

---

## Gate → Stage 3

Stage 3 turns this merge into the tiered insight-card catalogue — **Tier 1** self-serve descriptive, **Tier 2** proactive anomaly cards (the spine, the UI tiles; every card carries an action), **Tier 3** cross-correlation (parked + tagged) — with an exceed-expectations map and panel calls. The two decisions to settle before I run it: **(5) the ranking axis** (keep impact×underserved, or add procurement urgency — which would lift MA4/MB12), and **(1) the beachhead boundary** (headline join in MVP on a constrained category, vs operational-only + return-reason corpus with the social/app-store join parked in Tier 3). Everything else (real-time vs batch, deterministic vs embeddings) resolves inside the tiering rather than blocking it.
