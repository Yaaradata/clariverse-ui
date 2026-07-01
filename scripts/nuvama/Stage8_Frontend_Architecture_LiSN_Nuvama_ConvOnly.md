# Stage 8 — Frontend Architecture (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage8_Frontend_Architecture_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 8.

> **Inputs.** Stage 6 + Stage 7 (conversation-only). The structural contract Cursor builds from. **Reference: match `CreditCardsV3DrillDownScreens` (drill screens) + `head_retail` (service-promise + complaints command view); not `HeadOfCreditCardsDashboard`.** **Conversation data only; no book/₹.** Structure only — styling at 9C. Every Stage-6 card maps to a named reusable component.

---

## Component tree
**Primitives:** `DashboardThemeProvider` (light default), `AppShell`/`CollapsibleSidebar`, `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`.

**Data components (props → feeding conversation entity):**
| Component | Props (high level) | Renders | Feeds from |
|---|---|---|---|
| `ExecutiveTile` | label, value, delta, basis | KPI tile (NPS / complaint-escalation / promise-adherence) | `NPS_Response`, `Complaint`, `ServicePromise` |
| `ServicePromisePanel` | made, kept, broken, overdue, byBranch[] | head_retail service-promise block | `ServicePromise` |
| `ComplaintsPanel` | themes[], escalation, atrRisk | head_retail complaints block | `Complaint` |
| `AttritionRiskRail` + `InsightCard` | signals[]{title, severity, cohort, dataSourceHonestyLine, timeOnset, stats, aiVerdict ✦} | the ✦ "act on these" rail | `Signal` (O-1) |
| `EvidenceDrillPanel` | signalId → {excerpts[], engagementTrend, ruledOut[], confidence, recommendedAction} | S2 attrition drill | `Signal.themeEvidence`, `Interaction` |
| `ServicePromiseLedger` | promises[]{source, followUp, status} | promise drill | `ServicePromise`, `Interaction` |
| `ComplaintHeatmapMatrix` | cells[branch×theme], **routeByCellId** | complaint cell drill | `Complaint` |
| `NPSDecompositionPanel` | score, themeClusters[], complaintCategories[] | S3 | `NPS_Response`, `Complaint` |
| `SuitabilityWorklist` | items[], selectedItem{missingLanguageEvidence, ruledOut[]}, actions(accept/return/route) | S4 | `Signal` (O-3), `Interaction` |
| `DrillPanel` | generic container the five drill signatures mount into | — | — |

*(Removed: ConversionFunnel, any AUM/portfolio component — book-dependent.)*

**Intelligence components (✦):** `AIRiskSpikeMonitor` (the attrition rail), `ExecutiveBrief`, `ExecutivePulse`, `FloatingAIDayGenerator` (NL over the insight store).

**Screen components:**
- `CommandView` (S1) — composed like `head_retail`: header + 3× `ExecutiveTile` + `ServicePromisePanel` + `ComplaintsPanel` + `AttritionRiskRail` + `FilterBar` + `FloatingAIDayGenerator`.
- `AttritionEvidenceDrill` (S2) — `EvidenceDrillPanel` in `DrillPanel`.
- `CXServiceLens` (S3) — `NPSDecompositionPanel` + `ComplaintHeatmapMatrix`.
- `SuitabilityWorklistScreen` (S4) — `SuitabilityWorklist` + boundary banner.

---

## Route table
| Screen | Route | Notes |
|---|---|---|
| Command View | `/` | **default** |
| Attrition Evidence Drill | `/attrition/:cohortId` | by `cohortId` |
| Service-promise drill | `/promises/:cohortId` | by `cohortId` |
| Complaint cell drill | `/complaints/:cellId` | **by `cellId`** (fixes "all cells → one drill") |
| NPS theme drill | `/nps/:themeId` | by `themeId` |
| Suitability worklist item | `/suitability/:itemId` | by `itemId` |

- **Drill by the item's own id, never a shared constant.** Lens/route switch **resets transient state + timers**.

## State / data shape (in-memory only — NO browser storage)
```
AppState {
  filters: { segment, rmEwm, region, channel, tenure },
  comparisonBasis: { window:'WoW'|'MoM', baselineStore },   // conversation baselines (DENSE/BURSTY/SPARSE)
  cohorts: Cohort[],                                         // no AUM
  signals: Signal[],                                         // seeded conversation units
  evidencePacks: { [signalId]: {excerpts[], engagementTrend, ruledOut[], confidence, recommendedAction} },
  kpis: { nps, csat, complaintRate, escalationRate, promiseAdherence, attritionLanguagePrevalence, suitabilityCoverage },
  selected: { cohortId?, cellId?, themeId?, itemId? },
  governance: { draftActions: Action[], auditLog: AuditEvent[] }
}
```
Seeded signals in `signals[]`; baselines in `comparisonBasis`; evidence in `evidencePacks` keyed by `signalId`. Actions append a draft then an approval event; suitability worklist is maker-checker. **No book fields.**

## Shared primitives vs governed styling
Name the primitives (`DashboardThemeProvider`, `AppShell`, `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`) for 9C to style. **No colour/spacing/typography values here.**

## Reference match
**Match `CreditCardsV3DrillDownScreens` (drill structure) and `role-based/retail_banking/head_retail` (command view) exactly** — study both in the repo; swap in the conversation content. **Not** `HeadOfCreditCardsDashboard`.

## Tech constraints
React/TSX, multi-file; recharts, lucide-react (✦), Tailwind; **no `localStorage`/`sessionStorage`**; **one global `@keyframes`**; **unique SVG gradient id per chart instance**; **timers cleared on unmount + lens-switch** (the attrition rail); **drill by id**.

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
