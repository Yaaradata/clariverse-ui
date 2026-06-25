# Stage 8 — Frontend Architecture — LiSN (Retail/E-commerce CX)

> **Phase 3, stage 5 of 5.** Input: Stage 6 + Stage 7. Defines the component tree, routing, and state/data shape so Cursor builds one coherent app. Gives Stage 9C named components to attach rule IDs to, and pre-states the constraints that head off recurring bugs. No styling values here (governed at 9C). Brand: LiSN · India primary.

---

## 1. Component tree (props + feeding Stage-5 entity each)

**Primitives (structural only — styled at 9C):**
- `AppShell` — collapsible sidebar + header + content slot. Props: `screens[]`, `activeScreen`.
- `DashboardThemeProvider` — dark canvas + **light/dark toggle**; the violet/indigo "voice" accent token (value set at 9C).
- `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar` (screen + time-comparison).

**Data components (only those the screens use):**
- `ExecutiveTile` — props `{title, primaryNumber, sparkline, delta, aiCallout}`. Feeds: rolled-up Signal severities. (3 per S1.)
- `InsightCard` — the monitor-rail anomaly card; renders the Stage-6 honest slots (title/severity/cohort/**honestyLine**/onset/stats/**aiVerdict**/**confidenceBand**/bridgeStatus). Props `{signal}`. Feeds: `Signal`.
- `RadarRail` — horizontal scroll of ranked `InsightCard`s with the raw-mentions→signals ratio. Feeds: ranked `Signal[]` (O-1).
- `OutbreakMap` — peer-relative, normalised catchment map; nodes route by `dark_store_id`. Feeds: `Signal` (C-5) + `Baseline`.
- `StatutoryQueue` — worklist re-ranked by clock proximity; each row a countdown + keyword + audit trail. Feeds: `Grievance` + `Signal` (C-8).
- `ComplianceEvidenceCard` — named-instrument + evidence count + surface ref. Feeds: `Signal` (C-7) + `EvidencePack`.
- `SuppressionWatchdogCard` — the inverse-anomaly card (falling line shown red + normalised overlay + access-change marker). Feeds: `Signal` (C-9).
- `SellerTrustCard`, `FcrRepeatCard`, `BotQualityCard` — entity/quality cards. Feeds: `Signal` (C-6/C-2/O-4).
- `BridgeReadyTile` — **starred** integration-dependent tile (AP-015); split CX-signal ⨝ mock-feed → dollarised number; carries the "bridge-ready (lights up with transaction feed)" label. Feeds: `Signal.tier3_bridge_id` + `[mock] TransactionRow`.
- `DrillPanel` — slide-in panel that renders the **distinct Stage-7 drill signature** for the selected card type (7 variants, switched on `signal.type`). Feeds: `Signal` + `EvidencePack`.
- `Sparkline`, `Gauge` — compact KPI viz (each with a **unique SVG gradient ID per instance**).

**Intelligence components (each carries the sparkle marker):**
- `AiExecSummaryBar` — thin, 3 sections (Critical/Focus/Stable) + 1 AI line (AP-011). Feeds: distilled `Signal` summary.
- `RiskSpikeMonitor` — the radar rail's elevated-severity strip (reuses `RadarRail`).
- `FloatingAIDayGenerator` — the AI-analyst widget over the insight store; persists across screens.
- `AiMarker` (sparkle) + `ConfidenceBand` — primitives composed into every AI element.
- `DraftActionFooter` — the human-gate footer ("Draft / Prepare / Route" + approve + "accepted by X on date Y"); never an auto-fire label.

**Screen components (one per Stage-6 screen, composed from the above):**
- `CXCommandScreen` (S1) = AiExecSummaryBar + 3×ExecutiveTile + RadarRail + FloatingAIDayGenerator.
- `QuickCommerceHealthScreen` (S2) = OutbreakMap + perishable InsightCard + substitution InsightCard + BridgeReadyTile(MB1).
- `ComplianceConductScreen` (S3) = StatutoryQueue + ComplianceEvidenceCard + refund InsightCard + MRP InsightCard.
- `CXQualityWedgeScreen` (S4) = SuppressionWatchdogCard (headline) + SellerTrustCard + FcrRepeatCard + BotQualityCard.
- `RevenueBridgeScreen` (S5) = 4×BridgeReadyTile (MB1/MB4/MB8/MB17).

---

## 2. Route table

| Screen | Route | Notes |
|---|---|---|
| CX Command | `/` | **default landing** |
| Quick-Commerce Health | `/quick-commerce` | |
| Compliance & Conduct | `/compliance` | |
| CX Quality & the Wedge | `/cx-quality` | |
| Revenue Bridge | `/revenue-bridge` | bridge-ready tiles |

- **Drill routes by the item's own ID** — `DrillPanel` opens on `signal.id` / `dark_store_id` / `grievance.id`, **never a shared constant** (pre-empts the "all cells → one drill" bug).
- **Persona/screen switch resets state** — active drill, filters, and live-rail timers reset on navigation (single-persona build, but the reset rule still applies to the live radar rail).

---

## 3. State & data shape (in-memory only — NO browser storage)

```
appState = {
  activeScreen, theme: 'dark'|'light', timeComparison: 'wow'|'intraday',
  signals: Signal[],                 // Stage 9B seeded units (the insight store)
  baselines: Baseline[],             // Stage 9A comparison basis (per cell)
  evidencePacks: { [signalId]: EvidencePack },   // drill resolves from here
  grievances: Grievance[],           // statutory queue
  mockTransactionFeed: TransactionRow[],         // [Phase 2] bridge join — clearly mock
  auditLog: AuditLogEntry[],         // appended on each approve
  activeDrill: { signalId | null },
  draftActions: DraftAction[]        // drafted, awaiting approve
}
```
- Seeded units (9B) live in `signals`; the comparison basis (9A) in `baselines`; evidence packs keyed by `signalId` so drills resolve; the bridge join reads `mockTransactionFeed` (labelled mock). Approvals append to `auditLog` in memory.

---

## 4. Shared primitives vs governed styling
- Structural primitives named above: `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`, spacing-scale placeholders, the accent token slot.
- **No typography/colour/spacing values set here** — those are applied at 9C from the governance rulebook. This stage names the primitives the rules will style.

---

## 5. Reference-component match
**Match `HeadOfCreditCardsDashboard` structure exactly:** dark canvas + light/dark toggle, collapsible sidebar, `DashboardThemeProvider`, three executive tiles, AI exec-summary bar, AI Risk Spike Monitor, Floating AI Day Generator, drill-downs as separate components. Stage 10 turns this into a "study and match" instruction for Cursor.

---

## 6. Tech constraints
- **Build target:** Cursor React/TSX prototype; multi-file (one screen component per file + a shared components folder). Reference path convention: `frontend/components/role-based-dashboard/CXVoCHeadDashboard.tsx` (+ drill components).
- **Permitted libs:** React + hooks; lightweight charting (recharts or inline SVG); lucide-react icons; Tailwind core utilities only. No heavy orchestration.
- **Bug-class pre-emptions (structural):**
  - a **single global `@keyframes`** block for the `DrillPanel` slide-in (define once);
  - a **unique SVG gradient ID per chart instance** (no duplicate IDs when `Sparkline`/`Gauge` repeat);
  - **intervals/timers cleared on unmount and on screen switch** (the live radar rail);
  - **drill routes by row ID**, never a shared constant;
  - **no localStorage/sessionStorage** (artifacts break) — app memory only.

**Feeds:** Stage 9C (named components for rule mapping), Stage 10 (the structural contract Cursor builds from).
