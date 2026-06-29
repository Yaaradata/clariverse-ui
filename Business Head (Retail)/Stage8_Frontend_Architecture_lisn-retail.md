# Stage 8 Frontend Architecture — LiSN (Retail / e-commerce)

> Phase 3, stage 5 of 5 (closes Phase 3). Inputs: Stage 6 (five screens) + Stage 7 (flows, eight drill signatures, dual-action ordering, the diamond). Output is the structural contract the Stage 10 build prompt is assembled from: a named component tree, routing, and an in-memory data shape so Cursor builds one coherent app, not a pile of loose screens. **No styling values here** — typography/colour/spacing are governed and applied at 9C. Brand rules applied; every intelligence component carries the ✦ AI marker.

---

## 1. Component tree (every Stage-6 card maps to a named, reusable component)

**Primitives (structural; 9C styles them):**
- `AppShell` — dark canvas + light/dark toggle + collapsible sidebar + `DashboardThemeProvider`.
- `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`, `BackToHub` (return-to-Command-Centre control), `AiMarker` (the ✦ slot).

**Data components** (component → props/inputs → feeding Stage-5 entity/unit):
- `ExecutiveTile` → `{title, value, delta(this-week-vs-last), sparklineSeries, gaugeValue, aiCallout, drillRoute}` → KPI from **C-10 / C-2 / C-3 / C-7**.
- `InsightCard` → `{signal, variant: 'rail'|'hero', onOpen}` → **Signal** entity (methodology §G slots: title/severity/cohort/honesty-line/time/stats/✦verdict).
- `Sparkline` → `{series}`; `Gauge` → `{value, band}`.
- `CauseCodeBreakdown` → `{rankedCauses[], onSelect}` → **T2-01 / O-2** (S2).
- `FixableIntentSplit` → `{fixableShare, intentShare}` → the GoKwik-prior split bar (S2).
- `CatalogueCorrectionCard` → `{pimAttribute, draftedRemap}` → **T2-03** (S2).
- `OwnershipBoard` (composes `FilterBar`) → `{sellerRows[]{seller,tier,gmvExposure,complaintCluster,repeatContact,concentrationBand}, onRowOpen}` → **T2-07 / C-7 / O-4** (S3).
- `SellerSlaTrustCard` → `{slaBreach, trustErosionVoice, concentrationFlag}` → **T2-08** (S3).
- `DisputeTriageList` (worklist) → `{items[], onSelect, onResolve}` → **T2-11** (S3).
- `VoiceThemeSplit` → `{deliveryThemeShare, productThemeShare, verdictOwner, confidenceBand}` → **T2-26 / O-5** (S4).
- `FaultSplitCard` → `{warehouseShare, sellerShare, pickPackException}` → **T2-04** (S4).
- `RealVsFailureVerdictCard` → `{spikeSeries, saleScaledBaseline, failureVoiceTimeline, accountSignal, tierSelector, verdict, suppressedNearMiss}` → **T2-28 / C-8 / O-6** (S5).
- `DefectWaveCard` → `{returnInitiationSpike, careDefectTheme}` → **T2-15** (S5).
- `AspectCliffPanel` → `{aspectSlope, trailingMix, conversionCoMovement, correlationBand}` → **T2-12 / O-3** (shared drill).
- `PromoHealthGate` → `{compositeInputs{returnBand,sentimentSlope,availability,sellerHealth}, roas, verdict}` → **T2-19 / C-6** (shared drill).
- `LostDemandPanel` → `{lostGMV, adWaste, switchingVoice}` → **T2-17 / C-5 / O-7** (shared drill).
- `EvidenceFeed` ✦ → `{verbatims[], resolvedOrderTrail[], provenance}` → **O-8** (every drill; doubles as the fall-back-liability artifact on S3).
- `DrillPanel` → `{signalId, signatureType: 'A'..'H'}` — the Layer-2 container that composes the signature-specific panel + `EvidenceFeed` + `ActionBar`. The eight signatures (Stage 7 §2) are variants, not eight separate containers.
- `ActionBar` → `{actions[]{label:'Draft'|'Prepare'|'Route', routedOwner, gated?, onApprove}, advisoryMode, personaOrder}` — renders the draft/route actions with the human-gate + audit; `advisoryMode` hides actions for Low-confidence Signals; `personaOrder` sets the dual-action primary/secondary (Stage 7 §3).

**Intelligence components (✦ AI marker):**
- `ExecutiveBriefStrip` → `{critical, focus, stable}` (S1).
- `ExecutivePulseStrip` → `{critical, focus, stable}` (S1).
- `RiskSpikeMonitor` ("Today's Category Signal Monitor", horizontal scroll) → `{signals[] severity-ordered, onOpenSignal}` (S1).
- `FloatingAIDayGenerator` → `{onGenerate}` — "Generate my week" re-ranks the rail (S1, floating).

**Screen components (one per Stage-6 screen):**
- `CategoryCommandCentre` (S1) = 3× `ExecutiveTile` + `ExecutiveBriefStrip` + `ExecutivePulseStrip` + `RiskSpikeMonitor` + `FloatingAIDayGenerator`.
- `RecoverableMarginReturns` (S2) = `InsightCard`(T2-02 hero) + `CauseCodeBreakdown` + `FixableIntentSplit` + `CatalogueCorrectionCard` + `InsightCard`(T2-05 context) + `EvidenceFeed` + `ActionBar`.
- `SellerTrustRiskBoard` (S3) = `OwnershipBoard` + `SellerSlaTrustCard` + `DisputeTriageList` + `EvidenceFeed` + `ActionBar`.
- `LaneRtoArbitration` (S4) = `InsightCard`(T2-26 hero) + `VoiceThemeSplit` + `FaultSplitCard` + `EvidenceFeed` + `ActionBar` (process-gap route).
- `FestivalIncidentMonitor` (S5) = `RealVsFailureVerdictCard` + `DefectWaveCard` + `EvidenceFeed` + `ActionBar` (real-time tier).
- `SharedDrill` = `DrillPanel` hosting `AspectCliffPanel` | `PromoHealthGate` | `LostDemandPanel` by `signatureType`, + `EvidenceFeed` + `ActionBar` (for rail Signals T2-12 / T2-19 / T2-17).

---

## 2. Route table

| Screen | Route | Notes |
|---|---|---|
| `CategoryCommandCentre` (S1) | `/` | **default route for the Category/Business Head** |
| `RecoverableMarginReturns` (S2) | `/returns/:signalId` | drill from Tile-2 / rail T2-02 |
| `SellerTrustRiskBoard` (S3) | `/sellers` | a row opens that seller's evidence pack **in-panel** (Layer 2 is not a new route) |
| `LaneRtoArbitration` (S4) | `/lanes/:laneId` | drill from rail T2-26 |
| `FestivalIncidentMonitor` (S5) | `/festival/:signalId` | drill from rail T2-28 (real-time tier) |
| `SharedDrill` | `/signal/:signalId` | `signatureType` resolved from the Signal (T2-12 / T2-19 / T2-17) |

- **Drill routes carry the specific item's ID** (`signalId` / `sellerId` / `laneId`) — never a shared constant (pre-empts the "all cells → one drill" bug).
- **Persona switch.** `personaId` lives at the top of state. Switching (Category ↔ CX/VoC) **re-ranks the rail**, **flips the `ActionBar` dual-action ordering**, and **resets all transient UI** (`selectedSignalId`, `openDrill`, `dayGeneratorActive`) and **clears the live-rail timers** — no card, drill, or route from the prior persona persists (pre-empts the persona-switch-not-resetting bug).
- **Two layers only:** every drill is Layer 2; "deeper" content is the `EvidenceFeed` within the same drill, never a third route (rule 5).

---

## 3. State / data shape (in-memory only — no browser storage)

```ts
AppState {
  personaId: 'category-head' | 'cx-voc-head'         // default 'category-head'
  theme: 'light' | 'dark'                            // default 'light' (business head; rule 6)
  scope: { category, laneId, window: 'normal' | 'sale' }
  signals: Signal[]                                  // the seeded units (Stage 9A/9B)
  baselines: { [cellId]: BaselineCell }              // the COMPARISON BASIS lives here
  evidencePacks: { [signalId]: EvidencePack }        // verbatims + resolved order trail + provenance
  kpis: { contribution, returnRate, recoverableMargin, sellerRisk, conductFlag }   // S1 tiles
  rail: { orderedSignalIds: string[], suppressed: Signal[] }   // includes the suppressed near-miss
  ui: { selectedSignalId, openDrill, dayGeneratorActive }      // transient; cleared on persona switch
  audit: AuditEntry[]                                // { signalId, actionLabel, accepted_by, accepted_at } append-only
}

Signal {
  signalId, cardId, title, severity, behaviourType, cohortId, baselineCellId,
  deviationStat, onsetTs, causeClass, confidence, impactValue, ruledOut[],
  honestyLine, ownerPersona, signatureType: 'A'..'H', actions: Action[]
}
Action { actionLabel: 'Draft'|'Prepare'|'Route', routedOwner, gated: boolean, status: 'draft'|'accepted'|'dismissed' }
```

- Seeded units resolve from `signals`; their comparison basis from `baselines[baselineCellId]`; their evidence from `evidencePacks[signalId]` — so `DrillPanel` always resolves by ID.
- **No `auto_executed` field exists** on `Action`. On approve, append an `AuditEntry` and set `status: 'accepted'` (the "accepted by Priya Nair on <date>" line). Advisory (Low-confidence) Signals carry no actionable `Action`.

---

## 4. Shared primitives vs governed styling

Structural primitives named here for 9C to style: `AppShell`, `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`, `BackToHub`, `AiMarker`, plus spacing-scale **placeholders**. **No typography, colour, or spacing values are set in this stage** — they are the governance layer's to apply (gold/navy accent, density, contrast), keeping structure (here) separate from visual rules (9C).

---

## 5. Reference-component match

Match **`HeadOfCreditCardsDashboard`** structure exactly: dark canvas + light/dark toggle, collapsible sidebar, `DashboardThemeProvider`, 3 executive tiles, Executive Brief + Pulse strips, AI Risk Spike Monitor (horizontal scroll), Floating AI Day Generator, drill-downs as separate components. File-path precedent (FASTag): `frontend/components/role-based-dashboard/FastagIntelligenceDashboard.tsx` → here `frontend/components/role-based-dashboard/CategoryIntelligenceDashboard.tsx`. Stage 10 turns this into a "study `HeadOfCreditCardsDashboard` and match its pattern" instruction for Cursor.

---

## 6. Tech constraints

- **Build target:** Cursor React / TSX prototype. **Multi-file** under `role-based-dashboard/` — one file per screen component, a shared `components/` for the reusable data + intelligence components, and a single `state/` module holding `AppState` + the seeded data.
- **Permitted libs:** React + the family's charting lib (match the reference build — recharts-class) + the family's animation approach. **No `localStorage` / `sessionStorage`** (artifacts break) — all state in app memory for the session.
- **Bug-class pre-emptions (structural):**
  - a **single global source of `@keyframes`** (one definition module; never per-component duplicates);
  - a **unique SVG gradient ID per chart instance** — derive `gradientId = \`grad-${signalId}\`` (or the row's ID) so repeated charts never collide on duplicate IDs;
  - **all intervals/timers** (the live rail, the Day-Generator) **cleared on unmount and on persona switch** — no stale closures or leaked timers.

---
*Feeds: Stage 9C (named components to hang governance rule IDs on), Stage 10 (the structural contract Cursor builds from). Brand rules applied. — End of Phase 3.*
