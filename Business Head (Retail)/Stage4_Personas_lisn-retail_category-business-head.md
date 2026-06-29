# Stage 4 Personas — LiSN (Retail / e-commerce) / Category-Business Head

> Phase 3, stage 1 of 5. Inputs: RunConfig (locked) + Stage 3 Insight-Card Catalogue (28 Tier-2 cards). Output binds the persona to the catalogue and sets the demo spine that drives Stage 6 screen selection and Stage 5 card selection. Brand rules applied (British "distil"; "who" not "that"; no exclamation marks; e-commerce terms only).

---

## Primary persona: Priya Nair — Category / Business Head (e-commerce marketplace + quick-commerce)

**Identity and mandate.** Owns a sub-P&L: a category or cluster of sub-categories (run example: **Fashion + a quick-commerce grocery slice**) across the customer × category × SKU × seller × geography × channel grid. Title variants in the market: Category Head, Business Head, Category Leader, Vertical Head, Category GM. Accountable for **profitable GMV** — category contribution after returns and CAC — not gross GMV alone. Reports to a VP/Chief Business Officer; has category managers, a buying/assortment desk, and a category-ops pod reporting in, and works across (does not own) Seller-Brand Partnerships, Pricing/Retail-Media, Operations, Trust & Safety, CX, Compliance, and Finance. The CX / VoC Head is a peer who reads the same signals through an experience lens.

**Day in the life.** Opens LiSN **Monday before the weekly category review**, looks for ~5 minutes, and leaves with a decision about *where to put the team this week*. During a sale window she opens it **daily**; in festival peak she watches **real-time** alerts. Cadence sets the Stage-6 time-travel default → **"this week vs last week"** on the primary view, switching to "today vs the same sale-day baseline" inside a sale window (rule 3). She does not change a date filter to learn whether this week is worse — the comparison is already on the card.

**Top questions** (grouped by cadence; "needs join?" = needs the substrate × customer-voice join):

| # | Question (in her words) | Cadence | Needs join? | Decision it feeds | Action available | Routed exec |
|---|---|---|---|---|---|---|
| Q1 | "Where is my category leaking margin this week, and what is the single costliest fixable problem?" | weekly | **Y** | where to put the team this week | open the recoverable-margin card; route the fixable share | Catalogue/PIM + Seller-Brand |
| Q2 | "Why did returns jump on this SKU/seller — sizing, quality, fake, wrong item — and how much is recoverable vs buyer-remorse?" | weekly | **Y** | fix listing / cull seller / re-price | draft PIM fix / seller review (fixable share only) | Catalogue + Seller-Brand |
| Q3 | "Which sellers are dragging the category's trust and disputes, ranked by the GMV they actually put at risk?" | weekly | N (corpus, seller-keyed) | which sellers to intervene/coach/suppress | open the per-seller evidence pack | Seller-Brand + T&S |
| Q4 | "Is a review aspect turning and quietly dragging conversion before the star average moves?" | weekly | **Y** | catalogue/quality fix on the aspect | draft catalogue/quality action | Catalogue + CX |
| Q5 | "Are we scaling ad/promo spend on a SKU that is operationally unhealthy — should we promote, caution, or not promote?" | daily (campaign) | **Y** | keep / pause / redirect spend | three-state verdict; pause/redirect | Pricing / Retail-Media |
| Q6 | "An RTO spike in this lane — is it logistics or sellers shipping sub-standard goods?" | weekly / real-time on spike | **Y** | escalate to the *correct* owner | lane ops escalation OR seller review | Operations OR Seller-Brand |
| Q7 | "During the sale, which spike is real demand and which is a payment/bot/fraud failure?" | event (festival) | **Y** | verify before escalating | ops/fraud escalation (verified) | Trust & Safety + Operations |
| Q8 | "What is a stockout actually costing me — lost GMV, wasted ad spend, and customers switching to a competitor?" | daily (q-com) | **Y** (switch-voice) | replenish / pause ads / tighten promise | replenishment / ad-pause draft | Operations / Supply |
| Q9 | "What is my true category contribution after returns and CAC, by sub-category/seller/geography?" | monthly | sometimes | where to double-down vs exit | strategic reallocation | self / Finance |
| Q10 | "Where am I exposed to a dark-pattern, grievance, or authenticity finding before a regulator or the press finds it?" | weekly / event | **Y** | flag with evidence before escalation | compliance flag (evidence only) | Compliance / Legal |
| Q11 | "What are customers asking for that we don't stock?" | monthly | **Y** (null-search + asks) | assortment/buying proposal | demand-sized buying proposal | Buying / Assortment |

*Dropped as vanity (no decision behind them for this persona): raw daily GMV-on-plan tickers without a cause; sentiment scores with no outcome join. They live below the fold or in a tooltip, never on the primary view (rule 1, rule 4).*

**KPI vocabulary** (grounded — a sceptic can confirm she is measured on these):
- **North-star:** category contribution after returns & CAC; profitable GMV / CM1.
- **Diagnostic:** return / RTO rate by SKU·seller·pin-code; conversion (funnel by step); ROAS / promo incrementality; seller SLA / ODR / cancellation; stockout / fill-rate; AOV; review-sentiment slope; repeat-buyer / cohort LTV; GMV concentration vs the FDI 25% single-vendor cap.

**Trust threshold** (becomes a per-persona AUTO_REJECT at 9C/11). She will not act on a card unless it carries: **(1)** a quantified ₹ figure — contribution or GMV at risk; **(2)** the customer-voice evidence — a verbatim cluster or ranked cause-code; **(3)** a fixable-vs-intent split (the GoKwik 60–70%-intent prior) **or** a correlation-evidence band on a join; **(4)** one recommended action; **(5)** the routed owner. Plus a **regime-aware "is this real?" badge** so a sale-day spike is visibly distinguished from an incident. A score or rate with no voice evidence and no ₹ behind it fails her bar.

**What this role does NOT want** (remove list, with reasons — removing the wrong-persona widget is a first-class decision):
- **Agent-level / queue-level operational widgets** (FCR, AHT, per-agent containment) — these are the CX/Contact-Centre control room, not a category P&L view.
- **Raw sentiment-drift dashboards with no outcome join** — sentiment is only on her screen when joined to conversion/returns/₹ (Q4); a standalone NPS gauge is a vanity tile for her.
- **The full all-cards data dump** — the catalogue is 28 cards; her primary view shows only today's act-on-these (rule 4), the rest one click away.
- **Identity-level customer detail** — she works at cohort/SKU/seller/lane grain; person-level joins are a boundary violation, not a feature.
- **Compliance worklists / case management** — she sees the *flag* (Q10) and routes it; the worklist belongs to the Compliance screen.

**UI expectation and theme.** Head-level **calm density**, not a breach-first ops room (Prasath's note: business heads dislike dense dark ops screens). Light/dark toggle, with **light offered as default**. Single most important signal **top-left and largest**; 5-second headline; 2-minute full comprehension. Theme accent **gold / navy** (premium, board-adjacent — borrowed from the Head-of-Retail archetype as the closest family room). Every AI element carries the sparkle marker.

---

## Secondary personas (brief context only — sales-demo scope; no full journeys)

- **Head of CX / Voice-of-Customer (the native second buyer).** Owns the interaction corpus and the grievance/CSAT outcome. *Receives* from Priya the same cards read through an experience lens; *hands back* journey fixes and grievance-SLA status. **Different first action on the shared cards:** where Priya "fixes the listing / culls the seller / re-prices", the CX Head "fixes the journey / pre-empts the ticket / closes the grievance." Touches: T2-01, T2-02, T2-12, T2-22, T2-24, T2-25, T2-27. This dual ownership is the reason shared cards (T2-02, T2-12, T2-26) need a **role-based default action ordering**, not a single owner (designed in Stage 7).
- **Seller-Brand Partnerships.** Receives seller trust-risk and SLA-breach cards + evidence packs; remediation must respect FDI non-discrimination and the 25% concentration cap. Touches T2-04, T2-07, T2-08, T2-09, T2-11.
- **Pricing / Promotions / Retail-Media.** Receives the promote/caution/do-not-promote verdict and incrementality cards. Org-seam to settle: who wins when ROAS is high but voice is bad (Stage 7). Touches T2-19, T2-20, T2-21.
- **Operations (City / Dark-store).** Receives lane-arbitration, stockout, and festival-incident routes. Touches T2-04, T2-16, T2-17, T2-26, T2-27, T2-28.
- **Trust & Safety.** Receives counterfeit, fake-review, attack-vs-defect, and festival-fraud routes. Touches T2-09, T2-10, T2-14, T2-15, T2-28.
- **Compliance / Legal.** Receives the conduct/dark-pattern/grievance flags as evidence (never enforcement). Touches T2-22, T2-23, T2-24, T2-25.
- **Buying / Assortment.** Receives the null-search assortment-gap proposal. Touches T2-18.

---

## Persona-to-card map (every Tier-2 card owned; demo spine flagged)

| Card | Name | Owner persona (acts) | Demo-spine? | Routed exec | Needs join? |
|---|---|---|---|---|---|
| T2-01 | Return-reason cause-code shift | Category (+CX) | — | Catalogue/Seller | Y (corpus) |
| **T2-02** | **Recoverable-margin return card** | **Category** (CX reads) | **HERO** | Catalogue + Seller-Brand | **Y** |
| T2-03 | Catalogue auto-correction proposal | Category / Catalogue | ✓ | Catalogue/PIM | Y |
| T2-04 | Warehouse-vs-seller return fault split | Operations / Seller-Brand | — | Operations or Seller-Brand | Y |
| T2-05 | Return/RTO anomaly by SKU×seller×geo | Category / Operations | spine (substrate base) | Operations/Seller | N (substrate) |
| T2-06 | Catalogue-completeness → returns | Category / Catalogue | — | Catalogue | N |
| **T2-07** | **Seller trust-risk board** | **Seller-Brand / Category / CX** | **HOME surface** | Seller-Brand + T&S | N (seller-keyed) |
| T2-08 | Seller SLA ↔ trust-erosion + concentration | Seller-Brand / CX / Compliance | ✓ | Seller-Brand + Compliance | Y |
| T2-09 | Counterfeit co-occurrence | Trust & Safety | — | T&S | Y |
| T2-10 | Fake-review / manipulation integrity | Trust & Safety | — | T&S | Y |
| T2-11 | Seller-dispute legitimacy triage | Seller-Brand | — | Seller-Brand/T&S | Y (light) |
| **T2-12** | **Aspect-sentiment cliff → conversion/returns** | **CX / Category** | **HERO** (anti-NPS) | Catalogue + CX | **Y** |
| T2-13 | Pre-emptive launch-defect | Category / Catalogue | — | Category + Seller-Brand | Y |
| T2-14 | Attack-vs-defect discriminator | Trust & Safety / Category | — | T&S or Category | Y |
| T2-15 | Return-initiation ↔ care-chat defect wave | Category / T&S | spine (real-time) | Category + T&S | Y |
| T2-16 | Stockout lost-GMV + wasted-ad-spend | Category / Operations | — | Operations/Pricing | N (substrate) |
| T2-17 | Hidden lost demand (switching) | Category / Operations | ✓ (q-com) | Category + Supply | Y |
| T2-18 | Null-search assortment-gap demand | Category / Buying | — | Buying | Y (light) |
| **T2-19** | **Promo "do-not-promote" guardrail** | **Pricing / Category / Retail-Media** | **HERO** | Pricing / Retail-Media | **Y** |
| T2-20 | Promo incrementality vs cannibalisation | Pricing / Category | — | Pricing | Y |
| T2-21 | Return-fee policy impact | Category / CX | — | Category + CX | N (substrate) |
| T2-22 | Dark-pattern complaint monitor | Compliance / CX / Growth | — | Compliance/Legal | N (corpus, reg-pull) |
| T2-23 | UI ↔ voice-of-manipulation | Compliance / Growth / Category | — | Compliance + Growth | Y (reg-pull) |
| T2-24 | Listing-compliance gap (Legal Metrology) | CX / Compliance | — | Cat-Ops/Compliance | N (corpus) |
| T2-25 | Refund-delay → grievance escalation | CX / Compliance | — | Grievance + Finance | N (corpus, reg-pull) |
| **T2-26** | **Lane RTO ↔ care-voice arbitration** | **Operations / Category / Seller-Brand** | **HERO** | Operations or Seller-Brand | **Y** |
| T2-27 | Complaint ↔ order + delivery-hop auto-remediation | CX / Operations | — | Operations | Y |
| **T2-28** | **Festival real-vs-failure incident detection** | **Category / T&S / Operations** | **HERO** (peak) | T&S + Operations | **Y** |

**Demo spine (most build attention):** the home surface **T2-07** + the five nominated build-spec cards **T2-02, T2-12, T2-19, T2-26, T2-28**, with the supporting substrate cards T2-05 (the anomaly base the joins attach to) and T2-15/T2-17 as the quick-commerce/real-time colour. The hero beats for the storyline are **T2-02 (the wedge — recoverable margin in the customer's words) → T2-26 (resolves an org fight) → T2-28 (the festival peak)**.

**Persona gaps flagged (raise before Stage 6, do not silently drop):**
- **The parked Tier-3 hero, `[T3 → MB1]` operational-anomaly ↔ external-voice join**, has no Tier-2 owner because it is deliberately not built in v1. For a sales demo it should appear as a **"coming next" reveal / teaser**, not a working screen — confirm whether the storyline ends on it.
- **T2-23 (UI ↔ voice-of-manipulation)** sits across Compliance and Growth, neither of whom is the primary persona. It earns a place only if governance adds the compliance class; otherwise it is a one-click compliance flag off Priya's view, not a screen.

---

## Routing map (who routes what to whom)

```
Priya (Category/Business Head)
  ├─ fixable return share ──────────────▶ Catalogue/PIM + Seller-Brand     (T2-02, T2-03, T2-06)
  ├─ seller trust-risk + evidence pack ─▶ Seller-Brand + Trust & Safety    (T2-07, T2-08)
  ├─ promote/caution/do-not verdict ────▶ Pricing / Retail-Media           (T2-19, T2-20)
  ├─ lane RTO verdict ──────────────────▶ Operations (logistics) OR Seller-Brand  (T2-26)  ← arbitration
  ├─ festival incident (verified) ──────▶ Trust & Safety + Operations      (T2-28, T2-15)
  ├─ aspect cliff ──────────────────────▶ Catalogue + CX                   (T2-12)
  ├─ conduct/dark-pattern/grievance flag ▶ Compliance / Legal              (T2-22…25)  ← evidence only
  ├─ assortment gap ────────────────────▶ Buying / Assortment              (T2-18)
  └─ shared cards (dual action) ────────▶ CX/VoC Head reads the same card, acts on the journey side

Process-gap "diamond" (an interaction reveals another function's operational gap):
  "wrong item shipped" return free-text → warehouse pick/pack process gap → Operations process map (NOT a seller penalty)   (T2-04)
  sizing free-text cluster → a PIM/catalogue attribute gap → Catalogue process map   (T2-03)
```

Every routed action is **draft + human gate + audit log**; nothing auto-fires. Seller-facing remediation is FDI-non-discrimination-aware and checks the 25% concentration band before it is drafted.

---

## Open questions that change Stage 6 screen selection
1. **Storyline ending.** Does the demo end on the parked `[T3 → MB1]` external-voice join as a "coming next" reveal, or stay entirely inside the built Tier-2 set? (Affects whether Screen 5 is a teaser.)
2. **Quick-commerce vs marketplace lead.** The demo can lead Fashion-marketplace (returns/sizing wedge — T2-02) or quick-commerce (hidden lost demand / festival — T2-17/T2-28). Recommend leading with **T2-02** (the most MVP-feasible, operator-held wedge) and peaking on **T2-28**. Confirm the category framing.
3. **Promo-guardrail authority on T2-19.** Whose call wins when ROAS is high but voice is bad — default applied: *LiSN advises, the Category Head decides, audit-logged*. Confirm before Stage 7 designs the action.
4. **Governance class (from RunConfig).** If Compliance is a co-buyer, T2-22/23/24/25 rise to a dedicated conduct screen; if not, they stay one-click flags off the primary view.
