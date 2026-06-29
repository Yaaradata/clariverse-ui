# Cursor Build — LiSN (Retail / e-commerce) / Category-Business Head
### Give these passes to Cursor ONE AT A TIME. Confirm each builds clean before pasting the next. Do not paste all at once (a mega-prompt drifts).

> This is the only artifact Cursor receives. It is assembled from the locked Stage 4–9C spec; Cursor invents nothing. **Before handing over, append the locked `Stage9C_Build_Quality_Filter_v1.md` to the end of this file** — it is the governance source the passes reference by ID. Brand rules: "LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" not "cheap"; no exclamation marks; India-primary; e-commerce terms only (returns / RTO / reverse logistics / refund — never "chargeback").

---

## Locked context (applies to every pass)

- **Product / wedge:** LiSN (Fluid CX), retail / e-commerce category-intelligence module. The conduct- and CX-aware brain above the lakehouse — it joins the operator's interaction/voice/complaint corpus to transaction and operational anomalies to name a root cause a transaction-only tool cannot.
- **Boundary (`DOES_NOT_DO`):** consumes the operator's summary tables + event feeds; owns the interaction/voice corpus at full coverage; never owns/rebuilds the lakehouse; **never auto-fires** a customer- or seller-facing action (draft → human approves → audit-logged); never autonomously down-ranks a seller / restricts a pin-code / restricts COD; joins are **cohort-level, never identity-level**; every AI element carries the ✦ sparkle marker.
- **Domain spine (every element must trace it):** Customer Interaction → Signal → Business Issue → Owner → Evidence → Recommended Action. A card showing a number without this chain fails.
- **Primary persona:** Priya Nair, Category / Business Head. Weekly cadence → default comparison **"this week vs last week"** (flips to "today vs the same sale-day baseline" inside a sale window). North-star: category contribution after returns & CAC.
- **Secondary persona:** Head of CX / VoC — same cards, different first action (a persona switch re-ranks the rail and flips the dual-action ordering).
- **Intent:** client sales demo — happy path fully built; 5 screens; the join story unmistakable; numbers tie out; ≥1 suppressed near-miss.
- **Tech target:** Cursor **React / TSX**, multi-file under `frontend/components/role-based-dashboard/`. Permitted: React + the family charting lib (recharts-class) + the family animation approach. **No localStorage / sessionStorage** — all state in app memory.
- **Reference component:** **study `HeadOfCreditCardsDashboard` and match its pattern exactly** — dark canvas + light/dark toggle, collapsible sidebar, `DashboardThemeProvider`, 3 executive tiles, Executive Brief + Pulse strips, AI Risk Spike Monitor (horizontal scroll), Floating AI Day Generator, drill-downs as separate components. Build file: `CategoryIntelligenceDashboard.tsx` (mirror the FASTag precedent `FastagIntelligenceDashboard.tsx`).
- **Theme:** gold / navy accent; **light theme default** for this business-head screen (CF-002); dark available via toggle with verified contrast.

---

## Pass 1 — Foundation (no business logic yet)
**Files:** `CategoryIntelligenceDashboard.tsx` (shell), `state/appState.ts`, `components/` (empty primitives), one global `styles/keyframes` module, `theme/DashboardThemeProvider`.
**Do:** study `HeadOfCreditCardsDashboard`; build `AppShell` (dark canvas + **light/dark toggle, light default**), collapsible sidebar, `DashboardThemeProvider`, gold/navy accent; header cleanup; remove dead-weight/decorative elements (CL-013). Scaffold `AppState` exactly as the Stage 8 shape (`personaId:'category-head'` default, `theme:'light'`, `scope`, `signals[]`, `baselines{}`, `evidencePacks{}`, `kpis{}`, `rail{orderedSignalIds,suppressed}`, `ui{}`, `audit[]`); **no `auto_executed` field** anywhere. Define `@keyframes` **once** in the global module.
**Don't:** add any card, KPI, rail, or data yet; use browser storage.
**Done when:** the shell renders in light and dark, the sidebar collapses, no decorative elements remain, and `AppState` compiles empty.

## Pass 2 — Primary screen S1 · Category Command Centre
**File:** `screens/CategoryCommandCentre.tsx`. Time default: **this week vs last week**.
**Do:** build the **three executive tiles as business questions** (AP-001/AP-002 canonical triad, reused skeleton): **Tile 1 "Is my category profitable after returns and CAC?"** → *category contribution after returns & CAC* (north-star), sparkline this-week-vs-last; **Tile 2 "What returns margin is recoverable?"** → *return/RTO rate + recoverable margin*, drills to S2; **Tile 3 "Which sellers threaten category trust?"** → *seller trust-risk count + conduct sub-flag*, drills to S3. Each tile = score + sparkline + mini gauge + ✦ callout (AP-014), **delta beside the number**, **headline tile largest, top-left** (F-pattern). Build the **Executive Brief strip + Executive Pulse strip** as the thin AI exec-summary band — critical / focus / stable, change-first, one ✦ line (AP-011, CL-004, CF-003). Headline explainability on hover: *"Contribution is ₹18L below last week; ~70% of the gap is returns on three SKU clusters — the costliest is a fixable sizing error, opened on the rail."*
**Don't:** put any matrix/heat-map on S1 (RP-001); encode >2 dimensions per tile (RP-002); use a wide AI bar (RP-006); show a tile value without its delta; fire any action from S1 (triage only — open + Generate-my-week).
**9C IDs:** enforce AP-001/AP-002/AP-011/AP-014/CL-001/CL-004/CL-012/LR-007; avoid RP-001/RP-002/RP-006/CL-013.
**Done when:** the three question tiles render with deltas, the AI band reads change-first, the headline lands in 5 seconds, and Tile 2/3 navigate to `/returns/:signalId` and `/sellers`.

## Pass 3 — Intelligence widgets (rail + day generator + insight cards)
**Files:** `components/RiskSpikeMonitor.tsx`, `components/FloatingAIDayGenerator.tsx`, `components/InsightCard.tsx`; seed data into `state/appState.ts` from the embedded units below.
**Do:** build the **"Today's Category Signal Monitor" (✦)** rail — horizontal-scroll, **severity-ordered (S1>S2>S3)**, each item a **compact ✦ sparkle card** (CL-005/RP-006) carrying the methodology slots: title (short noun phrase) · severity · cohort · **honesty line** · onset · stats · ✦ verdict-with-reason. Surface, in storyline order: **T2-02, T2-26, T2-28, T2-12, T2-19, T2-07**, with **T2-15 / T2-17** as quick-commerce colour, plus the **suppressed near-miss** card. Build the **Floating AI Day Generator (✦)** "Generate my week" that re-ranks the rail. Embed these seeded units (in-memory; numbers are locked — do not change):

```
T2-02 SKU-AURA-SHIRT × SELL-TF — "Recoverable margin on the Aura shirt run" — S1 —
  31% returns vs 22% band; 1,860/6,000; 64% buyer-intent held out; fixable sizing = ~600 units →
  ₹6.0L recoverable; honesty: detection=return rate, verdict=return free-text+reviews; confidence High.
T2-26 LANE-DEL-NCR-O — "Delhi-NCR lane RTO 33% vs 21%" — S1 — 70% delivery-theme voice → logistics
  (seller penalty held); ₹4.2L lane contribution at risk; cohort-level; confidence High.
T2-28 SKU-FEST-BUDS — "Pulse earbuds 3× spike — real or failure?" — S1 — vs sale-scaled baseline +
  "payment deducted, no order" + aligned account signal → payment-gateway failure; conservative tier; High.
T2-12 SKU-NOVA-KURTA — "Nova kurta — colour/shade aspect rising" — S2 — 19% aspect share vs 6% trailing,
  star steady 4.0, conversion −6% (correlation band); honesty: directional join; confidence Med-High.
T2-19 SKU-STRIDE-SHOE × SELL-QS — "Stride shoe — do not promote" — S2 — ROAS 4.2 but returns 24% vs 18%
  + sentiment slope turned → redirect ₹3.4L; LiSN advises, Priya decides; confidence High.
T2-07 SELL-QS — "QuickStyle — seller trust exposure" — S1 — cancel-after-wait clusters + 23% concentration
  (within 25% cap); board total ₹52L GMV at risk across 3 sellers (top-line, NOT added to contribution).
SUPPRESSED — SKU-FEST-TEE — "4× tee spike — expected demand, suppressed" (no failure voice) — shown for credibility.
ADVISORY — LANE-T2-IND — "tier-2 lane RTO — advisory, watch" — sparse sample/thin voice — NO action button.
```
**Don't:** name the rail for live *prediction* (RP-004 — it surfaces detected signals); use "buzz / at risk / watch closely" tags (RP-005 — use quantified labels + a glasses icon for watch); aggregate channel-bound voice into one figure (RP-007); render any AI element without the ✦ marker; let the Day Generator imply it *acts*.
**Done when:** the rail scrolls severity-ordered with the suppressed + advisory cards visible, the advisory card has no action button, every AI element carries ✦, and each card opens its drill **by its own ID**.

## Pass 4 — Hero drill S2 · Recoverable-Margin Returns (the wedge)
**File:** `screens/RecoverableMarginReturns.tsx` (route `/returns/:signalId`).
**Do:** the **decomposition** drill (distinct signature): `InsightCard(T2-02 hero)` + `CauseCodeBreakdown` (RC-REMORSE 64% · RC-SIZE 28% · RC-QUAL 5% · other 3%) + `FixableIntentSplit` (the fixable-vs-intent split as the trust anchor) + `CatalogueCorrectionCard` (PIM diff: chest understated ~2.5 cm, sizes M–XL → drafted remap) + `InsightCard(T2-05 context)` (rate vs category-relative band; control denim 21% in band) + `EvidenceFeed (✦)` (verbatims "chest narrow vs chart" + resolved order trail + provenance). Headline a short noun phrase. **Star the card as integration-dependent** (AP-015 — needs the corpus). `ActionBar`: **Draft PIM sizing-chart fix** (→ Catalogue/PIM) + **Route fixable share to Seller-Brand**; CX secondary "Pre-empt the size-guide ticket". Each action: draft → **approve → "accepted by Priya Nair on <date>"** audit line.
**Don't:** show the honesty line as "returns-data-only" (the recoverable verdict needs the voice — HIGH); show recoverable margin without its method (= fixable-share × excess × contribution); encode >2 dims per card; use a "Complete Now"/autonomous label.
**9C IDs:** enforce CL-001/CL-005/AP-015 + AUTO_REJECT (₹+voice+split+action+owner+"is this real?" badge); avoid RP-002/RP-005 + dishonest-honesty-line.
**Done when:** the decomposition reads fixable-vs-intent, the evidence pack clicks through, the draft PIM fix shows the approve+audit step, and ₹6.0L reconstructs from the parts shown.

## Pass 5 — Hero drills S3 (Seller board) + S4 (Lane arbitration) + Shared drill
**Files:** `screens/SellerTrustRiskBoard.tsx` (`/sellers`), `screens/LaneRtoArbitration.tsx` (`/lanes/:laneId`), `screens/SharedDrill.tsx` (`/signal/:signalId`).
**Do — S3 (portfolio→contributor):** `OwnershipBoard` (reuse the segment-ownership skeleton AP-013, **relabelled for sellers**) ranked by customer-backed GMV exposure → row click → that seller's breakdown (clusters · repeat-contact · SLA breach · **23% concentration band vs the 25% cap**) → `EvidenceFeed` (per-seller pack, doubles as the fall-back-liability artifact). `ActionBar`: **Draft seller coaching** — gated by an FDI-non-discrimination + 25%-cap check **before** drafting.
**Do — S4 (adjudication):** `InsightCard(T2-26 hero)` + `VoiceThemeSplit` (delivery 70% / product 30%, deciding share) + `FaultSplitCard(T2-04)` + `EvidenceFeed` (lane voice cohort-level + orders). `ActionBar`: **Route verdict to Operations** (logistics; seller penalty held) **+ Route the pick/pack process-gap to the warehouse map** (the diamond). Pin-code differential action **gated** (geography proxy).
**Do — Shared drill:** one `DrillPanel` hosting **`AspectCliffPanel` (T2-12, leading-indicator: slope vs trailing mix, NOT the star average, + conversion overlay + correlation band)** | **`PromoHealthGate` (T2-19, gate: composite inputs vs ROAS → promote/caution/do-not)** | **`LostDemandPanel` (T2-17)** by `signatureType`.
**Don't:** render the seller board as an intent×seller matrix or put any matrix on these head screens (RP-001); make a per-customer claim on the lane (cohort-level only); over-claim a component name (RP-004); a bare "trust-risk" tag without the quantified exposure + evidence (RP-005 + AUTO_REJECT).
**Done when:** the board ranks by exposure and drills by `sellerId`, the lane verdict routes to the right owner + the process-gap branch, the shared drill shows three distinct signatures, and every seller-facing draft shows its gate.

## Pass 6 — Festival S5 + states + global polish
**File:** `screens/FestivalIncidentMonitor.tsx` (`/festival/:signalId`, real-time tier); then global.
**Do — S5 (verification):** `RealVsFailureVerdictCard(T2-28)` — the 3× spike vs the **sale-scaled baseline**, the **failure-voice corroboration timeline** + aligned account signal, the **conservative tier selector** with a confidence band, and the **suppressed near-miss (SKU-FEST-TEE 4×, no failure voice) shown inline**; `DefectWaveCard(T2-15)`; `EvidenceFeed`. `ActionBar`: **Prepare incident packet → Trust & Safety + Operations** (verified, human-gated).
**Do — states:** selection/persona default Priya; **persona switch (Category↔CX) re-ranks the rail, flips the dual-action ordering, resets transient `ui` state, and clears all live-rail/day-generator timers** (no stale closures); filter bar = visual re-rank over the seeded set (never fetch); loading = static skeletons; empty = "no Signals above threshold this window" + the suppressed near-miss (never blank mid-demo); error = static, non-blocking; no browser storage.
**Do — global polish:** strip internal codes (T2-##, DENSE/BURSTY/SPARSE), vendor/engine names, and "chargeback" from every card face; deltas beside numbers everywhere; unique SVG gradient ID per chart instance (`grad-${signalId}`); confirm the single global `@keyframes`.
**Don't:** name S5 a "prediction"/"risk monitor" (RP-004); leave an all-red screen (the suppressed case must show); claim order-data-only on the verdict.
**Done when:** the festival verdict shows the suppressed case beside it, a persona switch fully resets the rail + timers, drills animate (global keyframes present), charts render with unique gradient IDs, and no internal code/vendor/“chargeback” appears on any face.

---

## Stage 9C rules — the governance source (apply by ID; full file appended at handover)

**Global enforce (every screen):** question cards → state (CL-001); canonical triad (AP-001/AP-002); thin AI band, change-first (AP-011/CL-004/CF-003); AI insight = compact ✦ sparkle card (CL-005/RP-006); headline largest top-left, deltas beside the number, 5-sec/2-min (review checklist); gauge+sparkline tiles (AP-014); one persona/screen, ≤2-deep (CL-012/LR-007/AP-019); star integration-dependent tiles (AP-015); light default (CF-002); spine traced + ✦ on every AI element + no score without evidence + no autonomous-action label.
**Global reject:** matrix/heat-map on head screens (RP-001; geo national-default AP-009 excepted); >2 dims/card (RP-002); over-claiming names (RP-004); biased "at risk/buzz/watch closely" tags (RP-005); wide AI bar (RP-006); aggregated channel voice (RP-007); decorative elements (CL-013); duplicated metrics; mixed-persona screens; deep head drill; detached deltas; sentence titles; undefined metrics; per-transaction regulatory labels. *Not applied (scoping): RP-003 social-velocity is banking-scoped — the e-commerce review/social voice is in scope; RP-008/RP-009 are CRO/compliance-scoped.*
**AUTO_REJECT (Priya's trust threshold):** a card without **all** of {₹ impact · voice evidence · fixable-vs-intent or correlation band · recommended action · routed owner · the "is this real?" sale-window badge} fails the build.
*(Per-screen/per-component enforce/avoid IDs are folded into each pass above; the locked `Stage9C_Build_Quality_Filter_v1.md` — including the five flagged governance gaps — is appended verbatim at handover.)*

## Engineering guardrails + recurring bug-class checks (verify every pass)
Cursor **MUST NOT**: invent screens/cards/KPIs/logic beyond this spec; change persona/scope/positioning; add or remove widgets outside the locked lists; generate its own data (use only the embedded units); introduce design rules (apply only 9C IDs); use localStorage/sessionStorage; put internal codes/vendor names/domain-wrong terms on a face; auto-fire any action or use an autonomous label; show a verdict/score without evidence + a human approve step.
Cursor **MUST**: build exactly the locked five screens + component tree; reuse components (never duplicate); match `HeadOfCreditCardsDashboard` exactly; render each card from its data and its distinct Stage-7 drill signature; ✦ on every AI element; honour the 9C enforce/avoid IDs; implement the storyline with the human-gate step; keep state in memory.
**Bug-class checks:** `@keyframes` defined once globally (drill slide-ins); unique SVG gradient ID per chart instance; intervals/toasts cleared on unmount **and persona switch**; drill cells route by the **row's own ID**; persona switch resets state. **If anything is missing or contradictory, stop and surface the gap — do not invent a resolution.**

## Definition of done (whole build)
A seller can walk S1 → S2 → S3 → S4 → S5 → the "coming next" reveal with no dead ends; every hero card drills to convincing evidence; numbers tie out across screens (₹18L contribution gap = the margin-side items; ₹52L GMV-at-risk stays a separate top-line figure); the join/differentiation moment is unmistakable; no action looks auto-fired; the suppressed near-miss and the advisory item demonstrate the distillation and the boundary working.

---
*Assembled from locked Stage 4–9C. Feeds Stage 11 (the audit click-tests every hero beat against this prompt + the rulebook checklist). Brand rules applied. — End of Phase 5.*
