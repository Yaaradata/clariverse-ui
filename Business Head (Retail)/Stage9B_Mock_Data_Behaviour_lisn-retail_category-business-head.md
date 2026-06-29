# Stage 9B Mock-Data Behaviour — LiSN (Retail / e-commerce) / Category-Business Head

> Phase 4, stage 2 of 2. Inputs: Stage 9A universe + Stage 5 unit library + Stage 7 storyline. This plants the surfaced units the demo turns on — each one genuinely clearing its Stage-5 condition against the 9A basis, each carrying the full payload its drill needs to survive a domain expert's click-through. All rupee magnitudes `[illustrative]`; every AI element carries the ✦ marker; brand rules applied.

---

## 1. Seeded units (situation · magnitude · onset · clears-condition check)

| Card | Situation seeded (deviation from 9A basis) | Magnitude | Onset | Clears its Stage-5 condition? |
|---|---|---|---|---|
| **T2-02** `SKU-AURA-SHIRT` | return rate breaks its band; size-fault verbatims co-elevate | **31% vs 22% band**; 6,000 delivered → 1,860 returns | change-point Tue this week | ✓ rate > p95, excess > 3× band-width, **540 excess returns** ≥ 40 gate, fault-mix skews `RC-SIZE`, control `SKU-DENIM` normal |
| **T2-12** `SKU-NOVA-KURTA` | "colour/shade" negative-share cliff before the star moves; conversion dips | **19% aspect share vs 6% trailing** (band 9%); **conversion −6%**; star steady **4.0★** | slope change ~5 days ago | ✓ Δ-slope > change-point threshold, GMV-exposure high, conversion co-moves, sample sufficient |
| **T2-19** `SKU-STRIDE-SHOE` | spend scaling on an operationally-unhealthy SKU | **ROAS 4.2** but **returns 24% vs 18%** + sentiment slope turned | promo push day 3 | ✓ composite crosses do-not while spend scales; ≥2 inputs unhealthy and corroborate |
| **T2-26** `LANE-DEL-NCR-O` | lane RTO breaks band; delivery-theme voice dominates | **RTO 33% vs 21% band**; **70% delivery-theme** voice | spike Mon, persists | ✓ RTO > p95, voice-theme split decisive, cohort sample ≥ gate, control `LANE-BLR-C` normal |
| **T2-28** `SKU-FEST-BUDS` | sale-window spike co-moving with failure voice | **3× vs sale-scaled baseline**; failure-voice cluster + aligned account signal | sale hour 2 | ✓ spike beyond buffered scaled band **and** failure-voice corroborates **and** account signal aligns (conservative tier) |
| **T2-07** `SELL-QS` (board top row) | seller voice damage > peer-tier baseline, GMV-weighted | complaint-cluster + repeat-contact breach; **23% concentration** | rolling, flagged this week | ✓ cluster persistence > tier median+IQR, GMV-weighted, not a single complaint |
| **T2-15** a kurta model (support) | return-initiation spike co-moving with a care defect theme | early defect-wave, real-time | live | ✓ co-movement on the real-time tier; specific defect theme |
| **T2-17** `SKU-QC-ATTA` (support) | stockout/promise-miss co-moving with switching-intent voice | weekly demand bleed at `DS-HYD-01` | recurring | ✓ availability gap + switching voice co-move |

---

## 2. Unit payloads (the honest card slots)

- **T2-02 ✦** — *Scope:* `SKU-AURA-SHIRT` × `SELL-TF` × `CAT-FAS-SHIRT`. *Honesty line:* **detection = return rate (substrate); verdict = return free-text + reviews** (not "returns-data-only"). *Verdict/attribution:* of 1,860 returns, ~64% `RC-REMORSE` (buyer-intent, **held out**); the residual is a **fixable sizing-chart error** — "chest narrow vs chart" — ~600 units a corrected chart would prevent. *Ruled out:* category-wide fashion lift (control denim 21%, in band); sale-day lift (none this window); warehouse mis-pick (rerouted to T2-04). *Confidence:* **High** — fault-theme skew aligns with a recent chart edit; control normal. *Impact:* **₹6.0L recoverable** = 600 × ₹1,000 contribution `[illustrative]`. *Owner:* Category (Priya) → Catalogue/PIM + Seller-Brand. *Action:* draft PIM sizing-chart fix.
- **T2-12 ✦** — *Scope:* `SKU-NOVA-KURTA` × aspect "colour/shade". *Honesty line:* the join is **directional (correlation band), not proven cause**; aspect extraction across Hinglish/regional is the moat. *Verdict:* the "colour not as shown / fades after wash" aspect rose to **19%** of recent reviews while the **star held 4.0**, co-moving with a **−6% conversion** dip — a leading indicator the average hides. *Confidence:* **Med-High** with the correlation band shown. *Impact:* aspect-driven conversion/return exposure `[illustrative]`. *Owner:* Catalogue + CX. *Action:* draft catalogue/quality fix on the aspect.
- **T2-19 ✦** — *Scope:* `SKU-STRIDE-SHOE` × `SELL-QS` × `PROMO-SHOE-PUSH`. *Honesty line:* composite over substrate + **recent** voice (recency-weighted, not stale reviews). *Verdict:* **do-not-promote** — ROAS looks healthy (4.2) but returns are above band and a "stopped working in a week" cluster turned the sentiment slope; two inputs unhealthy. *Confidence:* **High**. *Impact:* **₹3.4L ad spend redirected** `[illustrative]`. *Owner:* Pricing/Retail-Media (**LiSN advises, Priya decides**, audit-logged). *Action:* pause + redirect.
- **T2-26 ✦** — *Scope:* `LANE-DEL-NCR-O` cohort (cohort-level, not per-customer). *Honesty line:* the verdict is the deciding voice band over the lane, not a per-customer claim. *Verdict:* **logistics, not seller** — RTO 33% vs 21% with **70% "rider didn't attempt / marked undelivered"**; the seller penalty is **held**. *Ruled out:* sale-day lift; mixed-voice ambiguity (share is decisive). *Confidence:* **High**. *Impact:* **₹4.2L lane contribution at risk** `[illustrative]`. *Owner:* Operations (logistics). *Action:* route verdict + the pick/pack **process-gap** to the warehouse map.
- **T2-28 ✦** — *Scope:* `SKU-FEST-BUDS` sale-window cohort. *Honesty line:* the verdict needs the **failure-voice feed**, not order data alone. *Verdict:* **payment-gateway failure, not demand** — the 3× spike co-moves with "payment deducted, no order" and an aligned account signal, against the conservative sale-scaled baseline. *Confidence:* **High** (voice + account signal). *Impact:* GMV/trust at risk in the peak window `[illustrative]`. *Owner:* Trust & Safety + Operations. *Action:* prepare incident packet.
- **T2-07 ✦** — *Scope:* `SELL-QS` (top of board), ranked by customer-backed GMV exposure. *Honesty line:* ranking is corpus-side + seller SLA; the evidence pack is the proof and **doubles as the fall-back-liability artifact**. *Verdict:* ODR is "near the line" but **"cancelled after I waited 3 days"** clusters and a **23% concentration band** put it top. *Confidence:* **High** (cluster + SLA corroborate, T2-08). *Impact:* board total **₹52L GMV at risk across 3 sellers** (top-line exposure, not contribution) `[illustrative]`. *Owner:* Seller-Brand + T&S. *Action:* draft coaching (FDI-non-discrimination-aware, 25%-cap-checked).

---

## 3. Evidence packs (per drill — specific enough to click through)

- **T2-02 drill (decomposition):** cause-code bars (`RC-REMORSE` 64% · `RC-SIZE` 28% · `RC-QUAL` 5% · other 3%); the fixable-vs-intent split bar; the PIM diff (chest understated ~2.5 cm, sizes M–XL); verbatim cluster — *"true to brand but chest is way tighter than the size chart", "had to return, chart says 42 but fits like 40"* `[illustrative]`; resolved order trail (order IDs → return → refund-ledger); ruled-out panel (control denim row).
- **T2-12 drill (leading-indicator):** the aspect negative-share slope vs trailing mix; the conversion overlay (−6%) with the correlation band; verbatims — *"colour is nothing like the photo", "faded after one wash"*; the steady 4.0★ shown beside it to make the "average hides it" point.
- **T2-19 drill (gate):** the composite decomposed (return band, sentiment slope, availability, seller health) against the ROAS gauge; the "stopped working in a week" review cluster (recency-weighted); the spend-at-risk figure.
- **T2-26 drill (adjudication):** the voice-theme split (delivery 70% / product 30%) with the deciding share; the lane RTO vs band; verbatims — *"delivery guy never came, marked as undelivered", "got an OTP message but no attempt"*; the pick/pack-exception subset that branches to the warehouse map; the control lane row.
- **T2-28 drill (verification):** the spike vs the sale-scaled baseline; the failure-voice timeline ("payment deducted, no order received") aligned to the account/fraud signal; **and the suppressed near-miss inline** (`SKU-FEST-TEE` 4×, no failure voice); the conservative tier selector with the confidence band.
- **T2-07 drill (portfolio→contributor):** ranked seller rows → `SELL-QS` breakdown (complaint clusters · repeat-contact · SLA breach · 23% concentration band); the per-seller evidence pack (quotes + affected GMV + resolved order trail) usable as the fall-back-liability artifact.

---

## 4. Storyline (ordered beats → act-now + approve)

1. **S1 Monday view** — contribution **down ₹18L** w/w; the ✦ rail shows the act-on-these, severity-ordered; hover the headline → "~70% of the gap is returns on three SKU clusters". → open the costliest.
2. **S2 wedge (T2-02)** — "**₹6.0L recoverable** on the Aura shirt run"; decomposition shows 64% intent held out, the residual is a fixable sizing chart. → **Draft PIM fix → approve → audit**.
3. **S3 seller board (T2-07)** — "**3 sellers, ₹52L GMV at risk**"; QuickStyle top despite a near-the-line ODR. → **Draft coaching** (gated) **→ approve → audit**.
4. **S4 org-fight (T2-26)** — "Delhi-NCR lane RTO **33% vs 21%** — the voice says logistics"; seller penalty held. → **Route to Operations + the warehouse process-gap → approve → audit**.
5. **S5 festival peak (T2-28)** — "**3× spike** — real or failure?"; failure voice + account signal say payment failure; the **4× tee spike is shown suppressed** beside it. → **Prepare incident packet → T&S + Ops → approve → audit**.
6. **Reveal** — the parked external/social-voice join as "coming next".

---

## 5. Distractors / near-misses / advisory (credibility — the screen is not all-red)

- **Suppressed near-miss (primary):** `SKU-FEST-TEE` — a **4× sale-window spike with no failure voice** → classified **expected demand, suppressed**; shown on S5 to prove the festival detector fires on *failure*, not volume.
- **Suppressed near-threshold:** a shirt at **22.5% vs a 22% band** but **excess < 3× band-width and sample below gate** → held below threshold (proves "thousands of baselines → a few Signals").
- **Advisory (low-confidence, gated):** `LANE-T2-IND` RTO looks elevated but **sparse sample + thin voice** → reads **"advisory — watch"**, carries **no action button** (the boundary working).
- **Distractors (normal):** `SKU-DENIM-CLASSIC` 21% in band; `LANE-BLR-C` 19% in band; `SELL-FW` healthy — none surface.

---

## 6. Draft action artifacts (drafted, never auto-sent; each carries the human gate)

- **T2-02 →** *Draft — Catalogue/PIM:* "Update `SKU-AURA-SHIRT` sizing chart — chest understated ~2.5 cm for M–XL; remap to verified grade rule. Est. **₹6.0L** recoverable contribution." + *Draft — Seller-Brand (TrendFab):* fixable-share note. **Accepted by ⟨Priya Nair⟩ on ⟨date⟩.**
- **T2-07 →** *Draft — Seller-Brand:* "QuickStyle (`SELL-QS`) — coaching on cancellation-after-wait clusters; **concentration 23% (within 25% cap); non-discrimination-checked**." **Accepted by …**
- **T2-19 →** *Draft — Pricing/Retail-Media:* "Pause `PROMO-SHOE-PUSH` on `SKU-STRIDE-SHOE`; redirect **₹3.4L** — returns above band + sentiment slope turned despite ROAS 4.2. LiSN advises; Category Head decides." **Accepted by …**
- **T2-26 →** *Draft — Operations (logistics):* "Lane `LANE-DEL-NCR-O` RTO 33% vs 21%, 70% delivery-theme — investigate last-mile attempts; seller penalty held." + *Draft — warehouse process map:* the pick/pack-exception note. **Accepted by …**
- **T2-28 →** *Prepare incident packet — Trust & Safety + Operations:* "`SKU-FEST-BUDS` 3× spike = payment-gateway failure (deducted, no order) + aligned account signal; conservative tier." **Accepted by …**

No artifact reads "Complete Now" or implies autonomous firing; every label is Draft / Prepare / Route.

---
*Feeds: Stage 10 (the embedded behaviour + storyline Cursor builds), Stage 11 (the units the audit click-tests). Brand rules applied. — End of Phase 4.*
