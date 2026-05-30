\# Stage 5 — Frontend \& Data Architecture

\## Fluid CX × Setu FASTag MVP



\*\*Stage inputs confirmed:\*\* `Stage2\_Capabilities\_DataModel\_v1.md`, `Stage3\_UI\_Spec\_v1.md`, `Stage4\_UX\_Blueprint\_v1.md`

\*\*Output:\*\* `Stage5\_Frontend\_Architecture\_v1.md` — write inline, user saves and uploads manually

\*\*Locked context:\*\* Vahan Bank · Setu FASTag · 18M tag-in-force · 800K monthly issuance · 22L daily NETC transactions · 65,000 daily interactions · Voice 58% / Chat 22% / Email 8% / Social 5% / 1033 4% / Branch 3% · Trinetra BPO Hyderabad / Anandam Customer Solutions Coimbatore / DigitalReach Bengaluru · Saksham Recovery · Genesys Cloud + Ozonetel · Salesforce CRM

\*\*Product boundary contract:\*\* Fluid CX reads and surfaces; it does not replace CRM/CMS, NPCI dispute switch, IVR, recovery workflow, IO judgement, fraud authentication, or legal review.

\*\*Design principles:\*\* Anchor to Daily Friction · Action before observation · Provenance one click away · Persona vocabulary on face · Anti-patterns forbidden · 30-minute promise visible · Boundary statements where necessary.

\*\*Demo rhythm anchor (Stage 4 §F):\*\* T+0 HoB loads → T+45s S006 alert fires → T+3m persona switch to COH → T+3m30s new dispute row → T+4m30s Saksham conduct flag → T+7m stream refresh.



\---



\## SECTION A — ARCHITECTURE OVERVIEW



\*\*Component tree shape.\*\* The tree is shallow and wide by design: `<App>` owns the `AppContextProvider` (global state via `useReducer`), which wraps a `<Shell>`. The `<Shell>` renders a fixed `<Sidebar>` (left rail with `<PersonaSwitcher>` and `<NavItems>`), a `<TopBar>` (stream indicator), and the `<ScreenRouter>`. The `<ScreenRouter>` renders one of eight screen components based on `currentScreenId`. On top of everything, two overlay components — `<DrillDownPanel>` and `<TrendExplorer>` — float in fixed position and are controlled by `drillDownTarget` and `trendExplorerTarget` in global state. This means no route changes, no DOM unmounting on persona switch — just state mutations and conditional renders.



\*\*State partitioning.\*\* Global state (a single `useReducer` context) owns: current persona, current screen, screen history stack, simulated clock (integer seconds), stream paused flag, fired-event tracking, action queue items, active alerts, acknowledged signals, drill-down and evidence pack targets, and active filters. Screen-local state owns only what is ephemeral within a screen visit: hovered cells, expanded rows, local time window overrides, and selected interaction IDs in the transcript pane. This avoids over-lifting; switching screens discards screen-local state intentionally.



\*\*Demo rhythm implementation.\*\* A single `useSimulatedStream()` custom hook, called once at the `<App>` root level. It runs a `setInterval(tick, 1000)` that dispatches `ADVANCE\_CLOCK` each second, subject to the `isStreamPaused` flag. A separate `useEffect` watches `simulatedClock` and fires pending `SIMULATED\_STREAM` events by comparing `event.atSecond <= simulatedClock \&\& !state.firedEventIds.has(event.eventId)`. Fired events mutate global state (inserting rows, incrementing badges, flipping tile colours) — the screens react reactively. Stage 7 must call `useSimulatedStream()` in `<App>` and nowhere else.



\*\*Mock-data architecture.\*\* All data is declared as `const` objects at the top of the file, loaded at module parse time. No `fetch()`, no async loading, no `useEffect` data-fetching. A thin selector layer (`getSignalEvent(id)`, `getInteractionsForSignal(signalId)`, `getEvidencePack(caseId)`) abstracts the raw constants so Stage 7 code never imports raw arrays directly. Stage 6 populates these constants; Stage 7 wires selectors to components.



\*\*What this is not.\*\* Not a real-time stream. Not a production app. Not persisted — state resets on reload. Not multi-user. The entire demo lives in a single 2,400–2,500 line JSX file that the Claude Artifact preview renders in its iframe. Every architectural decision is constrained by that ceiling.



\---



\## SECTION B — COMPONENT TREE



Components ordered root-down. Total: 46 components.



\---



```

COMPONENT: <App>

Type: layout (root)

Parent: none

Children: <AppContextProvider>

Props: none

State (local): none

Subscribes to: nothing (owns the context)

Stage 3 component: N/A (root)

Stage 4 screens: all

File-position hint: late (last component declared, export default)

Notes: Renders <AppContextProvider> which wraps <Shell> and mounts

&#x20; useSimulatedStream(). Single render tree.

```



```

COMPONENT: <AppContextProvider>

Type: layout (context wrapper)

Parent: <App>

Children: <Shell>, <DrillDownPanel>, <TrendExplorer>

Props: { children: ReactNode }

State (local): none — owns AppContext via useReducer

Subscribes to: nothing (provides context)

Stage 3 component: N/A

Stage 4 screens: all

File-position hint: mid (context declared in Section 4)

Notes: Calls useSimulatedStream() here. Provides AppContext.

&#x20; DrillDownPanel and TrendExplorer are siblings of Shell in this

&#x20; tree so they can overlay Shell's content via fixed positioning.

```



```

COMPONENT: <Shell>

Type: layout

Parent: <AppContextProvider>

Children: <Sidebar>, <TopBar>, <ScreenRouter>

Props: none

State (local): none

Subscribes to: currentPersona, currentScreenId

Stage 3 component: App Shell (Stage 3 §A)

Stage 4 screens: all

File-position hint: late (Section 9)

Notes: flex flex-row h-screen overflow-hidden bg-\[#0D1117]

```



```

COMPONENT: <Sidebar>

Type: layout

Parent: <Shell>

Children: <PersonaSwitcher>, <NavItems>, <StreamIndicator>

Props: none

State (local): none

Subscribes to: currentPersona, currentScreenId

Stage 3 component: Left rail (Stage 3 §A)

Stage 4 screens: all

File-position hint: late (Section 9)

Notes: w-60 flex flex-col bg-\[#0D1117] border-r border-\[#2D3748]

&#x20; h-full. Fixed left; not scrollable.

```



```

COMPONENT: <PersonaSwitcher>

Type: widget

Parent: <Sidebar>

Children: none (inline dropdown via local state)

Props: none

State (local): { isOpen: boolean }

Subscribes to: currentPersona

Stage 3 component: Persona switcher (Stage 3 §A, §G)

Stage 4 screens: all (global control)

File-position hint: late (Section 9)

Notes: Dispatches SET\_PERSONA action. The dropdown is a simple

&#x20; conditional render — not a modal or portal. Persona switch also

&#x20; dispatches SET\_SCREEN to the persona's default landing.

```



```

COMPONENT: <NavItems>

Type: widget

Parent: <Sidebar>

Children: <NavItem> × 7 (one per navigable screen)

Props: none

State (local): none

Subscribes to: currentScreenId

Stage 3 component: Left rail navigation (Stage 3 §A)

Stage 4 screens: all

File-position hint: late (Section 9)

```



```

COMPONENT: <NavItem>

Type: atom

Parent: <NavItems>

Children: none

Props: { screenId: string, label: string, icon: LucideIcon,

&#x20; badge?: number }

State (local): none

Subscribes to: currentScreenId (derives isActive)

Stage 3 component: Left rail nav item

Stage 4 screens: all

File-position hint: late (Section 9)

Notes: Dispatches SET\_SCREEN on click. isActive drives purple

&#x20; left-border: border-l-2 border-\[#7B2FF0]

```



```

COMPONENT: <StreamIndicator>

Type: atom

Parent: <Sidebar>

Children: none

Props: none

State (local): none

Subscribes to: simulatedClock, isStreamPaused

Stage 3 component: Stream indicator ("Live · N min ago")

Stage 4 screens: all

File-position hint: late (Section 9)

Notes: Derives "N min ago" from simulatedClock. Pause button

&#x20; dispatches TOGGLE\_STREAM\_PAUSE. This is the founder's

&#x20; mid-demo pause control.

```



```

COMPONENT: <TopBar>

Type: layout

Parent: <Shell>

Children: none (inline persona badge + last-updated text)

Props: none

State (local): none

Subscribes to: currentPersona, simulatedClock

Stage 3 component: TopBar (Stage 3 §A)

Stage 4 screens: all

File-position hint: late (Section 9)

Notes: Small h-12 bar at top of main content area showing current

&#x20; persona name + stream status. h-12 fixed; main content scrolls below.

```



```

COMPONENT: <ScreenRouter>

Type: layout

Parent: <Shell>

Children: one of the 6 screen components at a time

Props: none

State (local): none

Subscribes to: currentScreenId

Stage 3 component: N/A (routing logic)

Stage 4 screens: all (switch between them)

File-position hint: late (Section 9)

Notes: switch(currentScreenId) → renders one screen component.

&#x20; This is the entire routing mechanism.

```



```

COMPONENT: <HoBPrimary>

Type: screen

Parent: <ScreenRouter>

Children: <HeadlineBrief>, <ActionQueue>, <ChargebackIndicator>,

&#x20; <ChannelQualityBar>, <SentimentDriftChart>, <StrategyTileGrid>

Props: none

State (local): none

Subscribes to: actionQueueItems, activeAlerts, currentTimeWindow,

&#x20; acknowledgedSignals

Stage 3 component: B1–B7 zones of Setu Intelligence

Stage 4 screens: SCR-HOB-01

File-position hint: late (Section 13)

Notes: grid layout. Zones B1 full-width; B2+B3 side-by-side;

&#x20; B4+B5 side-by-side; B6 full-width. Also renders AlertToast

&#x20; overlay (right-margin fixed stack) when activeAlerts has items.

```



```

COMPONENT: <COHPrimary>

Type: screen

Parent: <ScreenRouter>

Children: <ShiftStatusBar>, <DisputeEvidenceQueue>,

&#x20; <IOReadinessQueue>, <BPOHeatmapWidget>, <FCRDriftPanel>,

&#x20; <ComplianceStrip>, <OperationalSignals>

Props: none

State (local): none

Subscribes to: disputeEvidenceQueue, ioReadinessQueue, activeAlerts,

&#x20; bpoHeatmapData, fcrData, complianceData

Stage 3 component: C1–C7 zones of Operations Console

Stage 4 screens: SCR-COH-01

File-position hint: late (Section 13)

```



```

COMPONENT: <LiveAlerts>

Type: screen

Parent: <ScreenRouter>

Children: <AlertCard> × N, filter pills

Props: none

State (local): { activeFilter: string | null }

Subscribes to: activeAlerts

Stage 3 component: SCR-SHR-01 full-detail alert feed

Stage 4 screens: SCR-SHR-01

File-position hint: late (Section 12)

```



```

COMPONENT: <PlazaHeatmapScreen>

Type: screen

Parent: <ScreenRouter>

Children: filter pills, heatmap grid

Props: none

State (local): { hoveredCell: {plaza, hour} | null,

&#x20; localFilters: Filters }

Subscribes to: plazaHeatmapData, activeFilters

Stage 3 component: SCR-SHR-02 Plaza Heatmap

Stage 4 screens: SCR-SHR-02

File-position hint: late (Section 12)

```



```

COMPONENT: <IOEvidencePackScreen>

Type: screen

Parent: <ScreenRouter>

Children: <EvidencePackHeader>, <InteractionsList>,

&#x20; <TranscriptPane>, <EvidenceRail>

Props: none

State (local): { selectedInteractionId: string | null,

&#x20; viewMode: 'list' | 'pack', assemblyStep: number,

&#x20; isAssembling: boolean, lightModeForPrint: boolean }

Subscribes to: evidencePackTarget, ioReadinessQueue

Stage 3 component: SCR-SHR-03 IO Evidence Pack

Stage 4 screens: SCR-SHR-03

File-position hint: late (Section 12)

Notes: assemblyStep and isAssembling drive the 3-second

&#x20; assembly animation. useEffect with sequential setTimeout

&#x20; calls at 0ms, 500ms, 1000ms, 1500ms, 2000ms.

```



```

COMPONENT: <ComplianceWatchScreen>

Type: screen

Parent: <ScreenRouter>

Children: <ComplianceHeatmap>, <BreachQueue>,

&#x20; <RBIOSClockWidget>

Props: none

State (local): { selectedComplianceType: string | null }

Subscribes to: complianceData, activeAlerts

Stage 3 component: SCR-SHR-05 Compliance Watch

Stage 4 screens: SCR-SHR-05

File-position hint: late (Section 12)

```



```

COMPONENT: <DrillDownPanel>

Type: overlay (fixed-position)

Parent: <AppContextProvider>

Children: <SnippetCard> × 3, <InteractionListItem> × N,

&#x20; <TranscriptPane> (when in transcript-view)

Props: none

State (local): { panelState: PanelState, selectedInteractionId: string | null }

&#x20; where PanelState = 'signal-view' | 'transcript-view' | 'coaching-view'

&#x20;   | 'promise-gap-view' | 'loading' | 'empty'

Subscribes to: drillDownTarget

Stage 3 component: DrillDownPanel (Stage 3 §E, §D.4)

Stage 4 screens: SCR-SHR-04 (overlay on all screens)

File-position hint: late (Section 11)

Notes: Renders null when drillDownTarget is null. Fixed right-0

&#x20; w-80 h-full z-50. Slide animation via CSS transform +

&#x20; transition: translateX from 100% to 0%. Backdrop does not

&#x20; close the panel (click-outside is not implemented in MVP

&#x20; to reduce event-handler complexity).

```



```

COMPONENT: <TrendExplorer>

Type: overlay (full-viewport)

Parent: <AppContextProvider>

Children: time-window pills, signal selector, dimension pills,

&#x20; <TrendChart>

Props: none

State (local): { localSignalId: string, localTimeWindow: TimeWindow,

&#x20; activeDimensions: string\[] }

Subscribes to: trendExplorerTarget (signalId + prefilter)

Stage 3 component: SCR-SHR-06 Trend Explorer

Stage 4 screens: SCR-SHR-06 (overlay on all screens)

File-position hint: late (Section 11)

Notes: Renders null when trendExplorerTarget is null. Fixed

&#x20; inset-0 z-40 bg-\[#0D1117]. fade-in via opacity transition.

```



```

COMPONENT: <HeadlineBrief>

Type: widget

Parent: <HoBPrimary>

Children: <HeadlineCard> × 3

Props: { categories: HeadlineCategory\[] }

State (local): none

Subscribes to: headlineBriefData (derived from signalEvents)

Stage 3 component: HeadlineBrief (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B1

File-position hint: mid (Section 10)

Notes: categories pre-sorted by z\_score descending. Three

&#x20; <HeadlineCard> side-by-side in a flex row.

```



```

COMPONENT: <HeadlineCard>

Type: widget (sub-component of HeadlineBrief)

Parent: <HeadlineBrief>

Children: <ProvenancePill>

Props: { category: HeadlineCategory, onClick: () => void }

State (local): { isHovered: boolean }

Subscribes to: nothing

Stage 3 component: HeadlineBrief card (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B1

File-position hint: mid (Section 10)

Notes: onClick dispatches OPEN\_DRILL\_DOWN with signalId='FCX-FT-S004'

&#x20; and filterCategory=category.categoryId.

```



```

COMPONENT: <ActionQueue>

Type: widget

Parent: <HoBPrimary>

Children: <ActionQueueRow> × N

Props: { items: ActionQueueItem\[] }

State (local): none

Subscribes to: actionQueueItems (HoB-relevant subset)

Stage 3 component: Action Queue (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B2

File-position hint: mid (Section 10)

```



```

COMPONENT: <ActionQueueRow>

Type: atom (shared)

Parent: <ActionQueue>, <DisputeEvidenceQueue>, <IOReadinessQueue>

Children: <ChannelIcon> (optional), <SignalBadge>

Props: { item: ActionQueueItem | DisputeEvidenceItem | IOReadinessItem,

&#x20; onReview: () => void, onResolve: () => void, variant:

&#x20; 'action' | 'dispute' | 'io-readiness' }

State (local): { rowState: 'normal' | 'in-progress' | 'acknowledged' }

Subscribes to: acknowledgedSignals

Stage 3 component: ActionQueueRow, DisputeEvidenceRow, IOReadinessRow

Stage 4 screens: SCR-HOB-01, SCR-COH-01

File-position hint: mid (Section 8)

Notes: The single most-reused component. variant prop controls

&#x20; which sub-layout renders: action (icon + title + owner),

&#x20; dispute (5-element checklist), io-readiness (readiness bar +

&#x20; days remaining).

```



```

COMPONENT: <ChargebackIndicator>

Type: widget

Parent: <HoBPrimary>

Children: two sub-tiles (S013 + S001), each with mini Recharts chart

Props: none

State (local): none

Subscribes to: chargebackData, churnIntentData

Stage 3 component: ChargebackIndicator (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B3

File-position hint: mid (Section 10)

Notes: S013 sub-tile has permanent amber "partial" badge.

&#x20; Mini sparkline via Recharts AreaChart with simplified axes.

```



```

COMPONENT: <ChannelQualityBar>

Type: widget

Parent: <HoBPrimary>

Children: Recharts BarChart (horizontal)

Props: none

State (local): none

Subscribes to: channelQualityData

Stage 3 component: ChannelQualityBar (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B4

File-position hint: mid (Section 10)

Notes: Recharts BarChart with layout="vertical". Bar fill

&#x20; is conditional: coral if complaint rate > 1.4x median,

&#x20; else lavender. Reference line at cohort median.

```



```

COMPONENT: <SentimentDriftChart>

Type: widget

Parent: <HoBPrimary>

Children: Recharts LineChart + "Explore →" button

Props: none

State (local): none

Subscribes to: sentimentDriftData, currentTimeWindow

Stage 3 component: SentimentDriftChart (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B5

File-position hint: mid (Section 10)

Notes: "Explore →" dispatches OPEN\_TREND\_EXPLORER with

&#x20; signalId='FCX-FT-S034'. Recharts Area for baseline band

&#x20; (fill opacity 0.15) + Lines for categories.

```



```

COMPONENT: <StrategyTileGrid>

Type: widget

Parent: <HoBPrimary>

Children: <StrategyTile> × 6

Props: none

State (local): none

Subscribes to: strategyTilesData

Stage 3 component: StrategyTileGrid (Stage 3 §B.3)

Stage 4 screens: SCR-HOB-01 Zone B6

File-position hint: mid (Section 10)

```



```

COMPONENT: <StrategyTile>

Type: atom (shared)

Parent: <StrategyTileGrid>, <OperationalSignals>

Children: <SignalBadge> (optional), lucide icon

Props: { tile: StrategyTileData, onClick: () => void }

State (local): none

Subscribes to: nothing

Stage 3 component: StrategyTile (Stage 3 §E)

Stage 4 screens: SCR-HOB-01, SCR-COH-01

File-position hint: mid (Section 8)

```



```

COMPONENT: <AlertToast>

Type: atom (shared, floating)

Parent: <HoBPrimary>, <COHPrimary> (rendered inside each

&#x20; as position:fixed right-0 top-16 z-30 stack)

Children: lucide AlertTriangle icon

Props: { alert: AlertEvent, onReview: () => void,

&#x20; onDismiss: () => void }

State (local): { dismissed: boolean }

Subscribes to: nothing (receives alert as prop)

Stage 3 component: AlertToast (Stage 3 §E)

Stage 4 screens: SCR-HOB-01 (overlay), SCR-COH-01 (overlay)

File-position hint: mid (Section 8)

Notes: CSS: fixed right-4 flex flex-col gap-2. Each toast

&#x20; slides in via a translateY animation on mount (CSS keyframes

&#x20; defined in a <style> tag at top of file — single-file

&#x20; artifact approach).

```



```

COMPONENT: <ShiftStatusBar>

Type: widget

Parent: <COHPrimary>

Children: <BPOSiteTag> × 3, <AlertBadge> × 5

Props: none

State (local): none

Subscribes to: bpoShiftStatus, activeAlerts, simulatedClock

Stage 3 component: ShiftStatusBar (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C1

File-position hint: mid (Section 10)

```



```

COMPONENT: <DisputeEvidenceQueue>

Type: widget

Parent: <COHPrimary>

Children: <ActionQueueRow variant="dispute"> × N

Props: none

State (local): none

Subscribes to: disputeEvidenceQueue

Stage 3 component: DisputeEvidenceQueue (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C2

File-position hint: mid (Section 10)

```



```

COMPONENT: <IOReadinessQueue>

Type: widget

Parent: <COHPrimary>

Children: <ActionQueueRow variant="io-readiness"> × N

Props: none

State (local): none

Subscribes to: ioReadinessQueue

Stage 3 component: IOReadinessQueue (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C3

File-position hint: mid (Section 10)

```



```

COMPONENT: <BPOHeatmapWidget>

Type: widget

Parent: <COHPrimary>

Children: CSS grid of <HeatmapCell> × 9

Props: none

State (local): { hoveredCell: {vendor, shift} | null }

Subscribes to: bpoHeatmapData

Stage 3 component: BPOHeatmap (Stage 3 §E, §C.3)

Stage 4 screens: SCR-COH-01 Zone C4, SCR-SHR-05

File-position hint: mid (Section 10)

Notes: 3×3 CSS grid. No Recharts — pure div layout with

&#x20; colour coding. tooltip on hover via local hoveredCell state.

```



```

COMPONENT: <HeatmapCell>

Type: atom

Parent: <BPOHeatmapWidget>

Children: none

Props: { cell: HeatmapCellData, onHover: (cell) => void,

&#x20; onClick: () => void }

State (local): none

Subscribes to: nothing

Stage 3 component: BPOHeatmap cell

Stage 4 screens: SCR-COH-01, SCR-SHR-05

File-position hint: mid (Section 8)

Notes: Background colour derived from composite score:

&#x20; green < 1.3×, amber 1.3–1.7×, coral > 1.7×. Pulse animation

&#x20; via CSS class when status='critical'.

```



```

COMPONENT: <FCRDriftPanel>

Type: widget

Parent: <COHPrimary>

Children: <FCRDriftRow> × 5

Props: none

State (local): none

Subscribes to: fcrDriftData

Stage 3 component: FCRDriftPanel (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C5

File-position hint: mid (Section 10)

```



```

COMPONENT: <ComplianceStrip>

Type: widget

Parent: <COHPrimary>

Children: <ComplianceTile> × 4

Props: none

State (local): none

Subscribes to: complianceData, activeAlerts

Stage 3 component: ComplianceWatchStrip (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C6

File-position hint: mid (Section 10)

```



```

COMPONENT: <ComplianceTile>

Type: atom

Parent: <ComplianceStrip>, <ComplianceHeatmap>

Children: lucide ShieldCheck or ShieldAlert icon

Props: { tile: ComplianceTileData, onClick: () => void }

State (local): none

Subscribes to: nothing

Stage 3 component: ComplianceTile (Stage 3 §E)

Stage 4 screens: SCR-COH-01, SCR-SHR-05

File-position hint: mid (Section 8)

```



```

COMPONENT: <OperationalSignals>

Type: widget

Parent: <COHPrimary>

Children: <StrategyTile> × 4

Props: none

State (local): none

Subscribes to: operationalSignalsData

Stage 3 component: OperationalSignalGrid (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01 Zone C7

File-position hint: mid (Section 10)

```



```

COMPONENT: <EvidencePackHeader>

Type: widget

Parent: <IOEvidencePackScreen>

Children: progress bar, chain-of-custody stamp, export button

Props: { pack: EvidencePack }

State (local): none

Subscribes to: nothing

Stage 3 component: EvidencePackHeader (Stage 3 §D.1, §E)

Stage 4 screens: SCR-SHR-03

File-position hint: mid (Section 10)

Notes: "Export PDF" triggers lightModeForPrint = true on

&#x20; parent, then window.print(). A <style> media="print"

&#x20; block in the file inverts background for printing.

```



```

COMPONENT: <InteractionsList>

Type: widget

Parent: <IOEvidencePackScreen>, <DrillDownPanel>

Children: <InteractionListItem> × N

Props: { interactions: Interaction\[], selectedId: string | null,

&#x20; onSelect: (id: string) => void }

State (local): none

Subscribes to: nothing

Stage 3 component: Interactions list (Stage 3 §D.1)

Stage 4 screens: SCR-SHR-03, SCR-SHR-04

File-position hint: mid (Section 10)

```



```

COMPONENT: <InteractionListItem>

Type: atom

Parent: <InteractionsList>

Children: <ChannelIcon>, <SignalBadge> (optional)

Props: { interaction: Interaction, isSelected: boolean,

&#x20; onClick: () => void }

State (local): none

Subscribes to: nothing

Stage 3 component: Interaction list row (Stage 3 §D.1)

Stage 4 screens: SCR-SHR-03, SCR-SHR-04

File-position hint: mid (Section 8)

```



```

COMPONENT: <TranscriptPane>

Type: widget

Parent: <IOEvidencePackScreen>, <DrillDownPanel>

Children: inline spans with highlight styles

Props: { interaction: Interaction | null,

&#x20; highlightType: 'evidence' | 'compliance' | 'signal' }

State (local): none

Subscribes to: nothing

Stage 3 component: TranscriptPane (Stage 3 §E)

Stage 4 screens: SCR-SHR-03, SCR-SHR-04

File-position hint: mid (Section 10)

Notes: Transcript text contains pre-marked spans via a

&#x20; simple parsing function that wraps tagged substrings in

&#x20; <mark> elements with appropriate colour classes.

```



```

COMPONENT: <EvidenceRail>

Type: widget

Parent: <IOEvidencePackScreen>

Children: signal event list, compliance check list,

&#x20; CRM linkage block, NPCI boundary note

Props: { pack: EvidencePack }

State (local): none

Subscribes to: nothing

Stage 3 component: Evidence rail (Stage 3 §D.1)

Stage 4 screens: SCR-SHR-03

File-position hint: mid (Section 10)

```



```

COMPONENT: <SnippetCard>

Type: atom

Parent: <DrillDownPanel>

Children: <ChannelIcon>

Props: { snippet: RepresentativeSnippet, index: 1 | 2 | 3,

&#x20; onClick: () => void }

State (local): { isHovered: boolean }

Subscribes to: nothing

Stage 3 component: 3 representative snippets (Stage 3 §D.4)

Stage 4 screens: SCR-SHR-04

File-position hint: mid (Section 8)

Notes: Always exactly 3 rendered. index prop drives the

&#x20; "1 of 3" label. The snippet text is truncated to 120 chars

&#x20; with a "..." expand-on-hover behaviour.

```



```

COMPONENT: <ProvenancePill>

Type: atom (universal — most-used component in the entire app)

Parent: <HeadlineCard>, <ActionQueueRow>, <SnippetCard>,

&#x20; <StrategyTile>, <ComplianceTile>, and any component that

&#x20; surfaces a numbered metric

Children: tooltip div (conditionally rendered via isHovered)

Props: { count: number, window: string, confidence: ConfidenceBand,

&#x20; confidenceReason: string, modelVersion: string }

State (local): { isHovered: boolean }

Subscribes to: nothing

Stage 3 component: ProvenancePill (Stage 3 §E)

Stage 4 screens: all

File-position hint: early (Section 6 — declared before anything

&#x20; that uses it)

Notes: On hover, renders a 3-line tooltip div via

&#x20; position:absolute z-50 bg-\[#1A2035] p-3 rounded-lg shadow-xl.

&#x20; The tooltip is rendered as a sibling div in a position:relative

&#x20; wrapper, not a portal — acceptable for single-file MVP.

```



```

COMPONENT: <SignalBadge>

Type: atom

Parent: <ActionQueueRow>, <InteractionListItem>, many others

Children: none

Props: { signalId: string, severity: 'info' | 'warn' | 'alert' }

State (local): none

Subscribes to: nothing

Stage 3 component: SignalBadge (Stage 3 §E)

Stage 4 screens: multiple

File-position hint: early (Section 6)

Notes: Small coloured pill: FCX-FT-S### abbreviated to "S###".

&#x20; Severity drives colour: info=slate, warn=amber, alert=coral.

```



```

COMPONENT: <ChannelIcon>

Type: atom

Parent: <ActionQueueRow>, <InteractionListItem>, <SnippetCard>

Children: lucide icon

Props: { channel: 'voice' | 'chat' | 'email' | 'social' | '1033'

&#x20; | 'complaint' }

State (local): none

Subscribes to: nothing

Stage 3 component: ChannelIcon (Stage 3 §E, §F)

Stage 4 screens: multiple

File-position hint: early (Section 6)

Notes: voice→Phone, chat→MessageSquare, email→Mail,

&#x20; social→Share2, 1033→Phone (with "1033" label), complaint→FileText

```



```

COMPONENT: <ObservedInferredBadge>

Type: atom

Parent: <ActionQueueRow>, <ComplianceTile>, <ChargebackIndicator>

Children: none

Props: { type: 'observed' | 'inferred' | 'partial' }

State (local): none

Subscribes to: nothing

Stage 3 component: \[OBSERVED] / \[INFERRED] badge (Stage 3 §E, §G)

Stage 4 screens: multiple

File-position hint: early (Section 6)

Notes: observed=cyan text "\[OBSERVED]", inferred=amber "\[INFERRED]",

&#x20; partial=amber "\[Partial — conversation-side]"

```



```

COMPONENT: <ReadinessProgressBar>

Type: atom

Parent: <ActionQueueRow variant="io-readiness">,

&#x20; <IOReadinessRow>, <EvidencePackHeader>

Children: none

Props: { score: number, width?: string }

State (local): none

Subscribes to: nothing

Stage 3 component: Readiness bar (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01, SCR-SHR-03

File-position hint: early (Section 6)

Notes: 0-49=coral, 50-74=amber, 75-100=green. CSS transition

&#x20; on width for the assembly animation.

```



```

COMPONENT: <TrendChart>

Type: widget

Parent: <TrendExplorer>

Children: Recharts LineChart

Props: { signalId: string, timeWindow: TimeWindow,

&#x20; dimensions: string\[] }

State (local): none

Subscribes to: nothing (derived from mock data via selector)

Stage 3 component: TrendChart (Stage 3 §E, §D.3)

Stage 4 screens: SCR-SHR-06

File-position hint: mid (Section 10)

Notes: Recharts AreaChart for the baseline band (one Area with

&#x20; opacity 0.15) + LineChart Lines for each dimension.

&#x20; ResponsiveContainer wrapping essential.

```



```

COMPONENT: <AlertCard>

Type: widget

Parent: <LiveAlerts>

Children: <ChannelIcon>, <SnippetCard> (one snippet),

&#x20; action button

Props: { alert: AlertEvent, onViewDrillDown: () => void,

&#x20; onAcknowledge: () => void }

State (local): none

Subscribes to: nothing

Stage 3 component: Alert card (Stage 3 §D.1, SCR-SHR-01)

Stage 4 screens: SCR-SHR-01

File-position hint: mid (Section 10)

```



```

COMPONENT: <ComplianceHeatmap>

Type: widget

Parent: <ComplianceWatchScreen>

Children: CSS grid of <HeatmapCell> variants for compliance

Props: none

State (local): { hoveredCell: {complianceType, vendor, shift} | null }

Subscribes to: complianceData

Stage 3 component: Compliance heatmap (Stage 3 §D.2)

Stage 4 screens: SCR-SHR-05

File-position hint: mid (Section 10)

```



```

COMPONENT: <BreachQueue>

Type: widget

Parent: <ComplianceWatchScreen>

Children: breach item rows

Props: none

State (local): none

Subscribes to: activeAlerts (compliance-type subset)

Stage 3 component: Active Breach Queue (Stage 3 §D.2)

Stage 4 screens: SCR-SHR-05

File-position hint: mid (Section 10)

```



```

COMPONENT: <RBIOSClockWidget>

Type: widget

Parent: <ComplianceWatchScreen>

Children: IOReadinessRow × N (cases near deadline)

Props: none

State (local): none

Subscribes to: ioReadinessQueue (filtered to <14 days)

Stage 3 component: RB-IOS 30-day Clock (Stage 3 §D.2)

Stage 4 screens: SCR-SHR-05

File-position hint: mid (Section 10)

```



```

COMPONENT: <BPOSiteTag>

Type: atom

Parent: <ShiftStatusBar>, <ActionQueueRow>

Children: health dot div

Props: { vendor: 'Trinetra' | 'Anandam' | 'DigitalReach',

&#x20; shift: 'morning' | 'afternoon' | 'night',

&#x20; queueMultiplier: number, status: 'normal' | 'watchful' | 'incident' }

State (local): none

Subscribes to: nothing

Stage 3 component: Vendor pill (Stage 3 §C.3)

Stage 4 screens: SCR-COH-01

File-position hint: early (Section 6)

```



\---



\## SECTION C — STATE MODEL



\### C.1 Global state



```javascript

// AppContext: single useReducer, provided via createContext



const initialState = {

&#x20; currentPersona: 'HoB',           // 'HoB' | 'COH'

&#x20; currentScreenId: 'SCR-HOB-01',  // string

&#x20; screenHistory: \[],                // string\[] — last 5 screenIds

&#x20; simulatedClock: 0,               // integer seconds since demo start

&#x20; isStreamPaused: false,           // boolean — pause control

&#x20; firedEventIds: new Set(),        // Set<string> — prevents re-firing

&#x20; acknowledgedSignals: new Set(),  // Set<string> — signalEventIds

&#x20; activeAlerts: \[],                // AlertEvent\[] — live alerts on screen

&#x20; actionQueueItems: \[],            // ActionQueueItem\[] — HoB action queue

&#x20; disputeEvidenceQueue: \[],        // DisputeEvidenceItem\[] — COH C2

&#x20; ioReadinessQueue: \[],            // IOReadinessItem\[] — COH C3

&#x20; bpoAlertState: {                 // badge counts for ShiftStatusBar

&#x20;   s006: 0, s021: 0, s028: 0, s018: 0, s003: 0

&#x20; },

&#x20; drillDownTarget: null,           // { signalId, filterContext } | null

&#x20; trendExplorerTarget: null,       // { signalId, prefilter } | null

&#x20; evidencePackTarget: null,        // string (caseId) | null

&#x20; activeFilters: {},               // Partial<Filters>

&#x20; currentTimeWindow: '7d',         // TimeWindow

&#x20; streamRefreshTimestamp: null,    // number | null — drives "Updated just now"

};



// Reducer actions — exhaustive list:

// SET\_PERSONA           { persona: 'HoB' | 'COH' }

// SET\_SCREEN            { screenId: string }

// GO\_BACK               {} — pops screenHistory

// ADVANCE\_CLOCK         {} — simulatedClock++

// TOGGLE\_STREAM\_PAUSE   {} — flips isStreamPaused

// FIRE\_EVENT            { event: SimulatedEvent } — dispatched by hook

// INSERT\_ACTION\_ITEM    { item: ActionQueueItem }

// INSERT\_DISPUTE\_ROW    { item: DisputeEvidenceItem }

// UPDATE\_ALERT\_BADGE    { signalKey: string, increment: number }

// PUSH\_ACTIVE\_ALERT     { alert: AlertEvent }

// ACKNOWLEDGE\_SIGNAL    { signalEventId: string }

// DISMISS\_ALERT         { alertId: string }

// OPEN\_DRILL\_DOWN       { target: DrillDownTarget }

// CLOSE\_DRILL\_DOWN      {}

// OPEN\_TREND\_EXPLORER   { target: TrendExplorerTarget }

// CLOSE\_TREND\_EXPLORER  {}

// OPEN\_EVIDENCE\_PACK    { caseId: string }

// CLOSE\_EVIDENCE\_PACK   {}

// SET\_FILTER            { key: string, value: any }

// SET\_TIME\_WINDOW       { window: TimeWindow }

// SET\_STREAM\_REFRESH    {} — triggers "Updated just now" display

// MARK\_EVENT\_FIRED      { eventId: string }

```



\*\*Reducer shape note.\*\* All state updates are immutable: spread-copy the state object and replace affected arrays/objects. Do NOT mutate. For Sets (`firedEventIds`, `acknowledgedSignals`), create a new Set from the spread of the old one and add/delete members.



\### C.2 Screen-local state



State that lives in each screen component's `useState` — not lifted:



| Screen | Local state | Why not global |

|---|---|---|

| `HoBPrimary` | none | all data comes from global context |

| `COHPrimary` | none | same |

| `DrillDownPanel` | `panelState`, `selectedInteractionId` | ephemeral panel navigation; resets on close |

| `TrendExplorer` | `localSignalId`, `localTimeWindow`, `activeDimensions` | ephemeral overlay state; resets on close |

| `IOEvidencePackScreen` | `selectedInteractionId`, `viewMode`, `assemblyStep`, `isAssembling`, `lightModeForPrint` | assembly animation state is transient; print mode is ephemeral |

| `PlazaHeatmapScreen` | `hoveredCell`, `localFilters` | hover is pure visual; local filter override for the screen |

| `ComplianceWatchScreen` | `selectedComplianceType` | screen-only filter |

| `LiveAlerts` | `activeFilter` | screen-only filter |

| `BPOHeatmapWidget` | `hoveredCell` | tooltip state |

| `HeadlineBrief` | none | data from global; interactions handled via onClick |

| `StrategyTile` | `isHovered` | tooltip visibility only |

| `ProvenancePill` | `isHovered` | tooltip visibility only |



\### C.3 Simulated stream state



The stream is a constant array declared at the top of the file (Section 3 in the single-file structure). The `useSimulatedStream()` hook reads global state (`simulatedClock`, `isStreamPaused`, `firedEventIds`) and dispatches `FIRE\_EVENT` for any pending events.



```javascript

// SimulatedEvent shape

{

&#x20; eventId: string,      // unique ID to prevent re-firing

&#x20; atSecond: number,     // real-time seconds from demo start

&#x20; type: 'alert\_toast' | 'insert\_dispute\_row' | 'update\_bpo\_badge'

&#x20;      | 'insert\_action\_item' | 'stream\_refresh',

&#x20; persona\_context: 'HoB' | 'COH' | null,  // null = fires on any screen

&#x20; payload: object       // event-type-specific data

}



// SIMULATED\_STREAM constant (the 12-event demo rhythm):

\[

&#x20; { eventId: 'E001', atSecond: 45,  type: 'alert\_toast',

&#x20;   persona\_context: 'HoB',

&#x20;   payload: { signalId: 'FCX-FT-S006', severity: 'alert',

&#x20;     description: 'Ombudsman threat · Trinetra Hyderabad · 09:03am · 1 call' } },



&#x20; { eventId: 'E002', atSecond: 60,  type: 'stream\_refresh',

&#x20;   persona\_context: null, payload: {} },



&#x20; { eventId: 'E003', atSecond: 180, type: 'insert\_dispute\_row',

&#x20;   persona\_context: 'COH',

&#x20;   payload: { item: { /\* dispute row, plaza missing \*/ } } },



&#x20; { eventId: 'E004', atSecond: 195, type: 'update\_bpo\_badge',

&#x20;   persona\_context: 'COH',

&#x20;   payload: { signalKey: 's016', increment: 1 } },



&#x20; { eventId: 'E005', atSecond: 270, type: 'alert\_toast',

&#x20;   persona\_context: 'COH',

&#x20;   payload: { signalId: 'FCX-FT-S018', severity: 'alert',

&#x20;     description: 'Saksham conduct flag · Call at 14:15 · 1 violation' } },



&#x20; { eventId: 'E006', atSecond: 275, type: 'update\_bpo\_badge',

&#x20;   persona\_context: 'COH',

&#x20;   payload: { signalKey: 's018', increment: 1 } },



&#x20; { eventId: 'E007', atSecond: 300, type: 'stream\_refresh',

&#x20;   persona\_context: null, payload: {} },



&#x20; { eventId: 'E008', atSecond: 360, type: 'insert\_action\_item',

&#x20;   persona\_context: 'HoB',

&#x20;   payload: { item: { signalId: 'FCX-FT-S002', title: 'Annual Pass misses',

&#x20;     count: 40, delta: '+3 since morning brief' } } },



&#x20; { eventId: 'E009', atSecond: 420, type: 'stream\_refresh',

&#x20;   persona\_context: null, payload: {} },



&#x20; { eventId: 'E010', atSecond: 450, type: 'alert\_toast',

&#x20;   persona\_context: 'HoB',

&#x20;   payload: { signalId: 'FCX-FT-S003', severity: 'warn',

&#x20;     description: 'Social flare · NH-4 Mumbai-Pune · 08:04am · 21 mentions · 3.4× baseline' } },



&#x20; { eventId: 'E011', atSecond: 540, type: 'insert\_dispute\_row',

&#x20;   persona\_context: 'COH',

&#x20;   payload: { item: { /\* second new dispute row \*/ } } },



&#x20; { eventId: 'E012', atSecond: 600, type: 'stream\_refresh',

&#x20;   persona\_context: null, payload: {} },

]

```



\---



\## SECTION D — ROUTING AND VIEW SWITCHING



\*\*No React Router.\*\* All navigation is a `currentScreenId` state mutation via `SET\_SCREEN` action.



\*\*Screen IDs as constants:\*\*

```javascript

const SCREEN\_IDS = {

&#x20; HOB\_PRIMARY:     'SCR-HOB-01',

&#x20; COH\_PRIMARY:     'SCR-COH-01',

&#x20; LIVE\_ALERTS:     'SCR-SHR-01',

&#x20; PLAZA\_HEATMAP:   'SCR-SHR-02',

&#x20; IO\_EVIDENCE:     'SCR-SHR-03',

&#x20; COMPLIANCE:      'SCR-SHR-05',

};



const PERSONA\_DEFAULT\_SCREENS = {

&#x20; HoB: 'SCR-HOB-01',

&#x20; COH: 'SCR-COH-01',

};

```



\*\*`<ScreenRouter>` logic:\*\*

```javascript

function ScreenRouter() {

&#x20; const { state } = useAppContext();

&#x20; switch(state.currentScreenId) {

&#x20;   case 'SCR-HOB-01': return <HoBPrimary />;

&#x20;   case 'SCR-COH-01': return <COHPrimary />;

&#x20;   case 'SCR-SHR-01': return <LiveAlerts />;

&#x20;   case 'SCR-SHR-02': return <PlazaHeatmapScreen />;

&#x20;   case 'SCR-SHR-03': return <IOEvidencePackScreen />;

&#x20;   case 'SCR-SHR-05': return <ComplianceWatchScreen />;

&#x20;   default: return <HoBPrimary />;

&#x20; }

}

```



\*\*Persona switching:\*\*

```javascript

// SET\_PERSONA reducer case:

case 'SET\_PERSONA':

&#x20; return {

&#x20;   ...state,

&#x20;   currentPersona: action.persona,

&#x20;   currentScreenId: PERSONA\_DEFAULT\_SCREENS\[action.persona],

&#x20;   screenHistory: \[...state.screenHistory.slice(-4), state.currentScreenId],

&#x20;   drillDownTarget: null,   // close any open overlay

&#x20;   trendExplorerTarget: null,

&#x20; };

```



\*\*Overlays (DrillDown + TrendExplorer):\*\*

```javascript

// Rendered in AppContextProvider, above Shell in the DOM.

// Controlled entirely by drillDownTarget and trendExplorerTarget.

// When null → renders null (no DOM nodes).

// When set → renders fixed overlay on top of Shell.

// No route change, no URL change, no history entry.

```



\*\*Back affordance (screenHistory):\*\*

```javascript

// GO\_BACK reducer case:

case 'GO\_BACK':

&#x20; if (state.screenHistory.length === 0) return state;

&#x20; const prev = state.screenHistory\[state.screenHistory.length - 1];

&#x20; return {

&#x20;   ...state,

&#x20;   currentScreenId: prev,

&#x20;   screenHistory: state.screenHistory.slice(0, -1),

&#x20; };

```



\*\*Drill-down and evidence pack targets are NOT routes.\*\* They are global state fields. When `drillDownTarget` is set, `<DrillDownPanel>` renders as a fixed overlay. When `evidencePackTarget` is set AND `currentScreenId === 'SCR-SHR-03'`, the evidence pack screen shows that specific pack. Navigating to SCR-SHR-03 without an `evidencePackTarget` shows the list view.



\---



\## SECTION E — MOCK-DATA CONTRACT



Stage 6 must produce these JSON shapes. All fields are required unless marked `optional`. Volumes noted per entity.



\---



```

ENTITY: Interaction

Stage 2 entity: Interaction (§D.1)

JSON shape:

{

&#x20; interactionId: string,           // "INT-001" format

&#x20; channel: 'voice' | 'chat' | 'email' | 'social' | '1033' | 'complaint',

&#x20; startTs: string,                 // ISO 8601 e.g. "2026-01-20T07:51:00+05:30"

&#x20; endTs: string,

&#x20; durationSeconds: number,         // voice only; 0 for chat/email

&#x20; languageDetected: string,        // 'hindi' | 'english' | 'tamil' | 'telugu'

&#x20;                                  // | 'marathi' | 'kannada' | 'gujarati'

&#x20; agentId: string,                 // links to Agent entity

&#x20; bpoSiteId: string,               // 'trinetra-hyd' | 'anandam-cbe' | 'digitalreach-blr'

&#x20; shift: 'morning' | 'afternoon' | 'night',

&#x20; customerId: string,              // optional (links to Customer)

&#x20; tagId: string,                   // optional

&#x20; sentimentScore: number,          // -1.0 to 1.0

&#x20; sentimentLabel: 'negative' | 'neutral' | 'positive',

&#x20; primaryIntent: string,           // e.g. 'avc\_mismatch\_dispute'

&#x20; transcriptText: string,          // 300-600 words, realistic mock

&#x20; transcriptAnnotations: \[         // markup for display in TranscriptPane

&#x20;   {

&#x20;     start: number,               // character offset

&#x20;     end: number,

&#x20;     type: 'evidence\_present' | 'evidence\_missing' | 'signal\_trigger'

&#x20;           | 'compliance\_violation',

&#x20;     label: string,               // e.g. "Plaza name — captured"

&#x20;   }

&#x20; ],

&#x20; signalEventIds: string\[],        // which SignalEvents this contributed to

&#x20; complianceCheckResults: \[

&#x20;   { checkType: string, outcome: 'pass' | 'partial' | 'fail',

&#x20;     evidenceSnippet: string }

&#x20; ]

}



Volume: 40 detailed records (enough for all drill-downs in the 5 storylines)

Distribution: 16 voice (Trinetra morning/afternoon), 8 voice (Anandam morning),

&#x20; 6 chat (DigitalReach), 4 social (X/Twitter), 4 email, 2 recovery voice (Saksham)

Realism anchor: 65,000 daily / 24h = \~2,700/hour. These 40 represent

&#x20; a curated sample for the demo's drill-down surfaces, not the full stream.

&#x20; Signal-level aggregates (for charts) are separate pre-computed constants.

```



\---



```

ENTITY: Customer

Stage 2 entity: Customer (§D.1)

JSON shape:

{

&#x20; customerId: string,

&#x20; maskedPhone: string,             // "XXXXXX1234"

&#x20; casaStatus: 'yes' | 'no',

&#x20; kycStatus: 'verified' | 'pending' | 'mismatch',

&#x20; registeredState: string,         // e.g. "Maharashtra"

&#x20; registeredLanguage: string,

&#x20; firstTagActivationDate: string,  // ISO date

&#x20; tagIds: string\[],                // linked Tag entities

}



Volume: 25 records (one per unique customer in the 40 interactions)

Distribution: mix of states matching Stage 1 geography — MH, KA, TN,

&#x20; NCT, GJ, UP, AP, TS.

```



\---



```

ENTITY: Tag

Stage 2 entity: Tag (§D.1)

JSON shape:

{

&#x20; tagId: string,                    // "NETC-" + 8 hex chars

&#x20; customerId: string,

&#x20; vrn: string,                      // "MH01AB1234" format

&#x20; tagClass: number,                 // 4 (private LMV) | 5 | 6 | 7 (commercial)

&#x20; issuanceChannel: 'oem' | 'dealer' | 'e-com' | 'branch',

&#x20; issuancePartnerId: string,        // optional

&#x20; activationDate: string,

&#x20; status: 'active' | 'blacklisted' | 'closed' | 'hotlisted',

&#x20; walletBalanceLast: number,        // ₹ amount

&#x20; lastRechargeTs: string,

&#x20; annualPassFlag: 'yes' | 'no' | 'ineligible',

&#x20; kyvStatus: 'verified' | 'pending' | 'mismatch',

}



Volume: 25 records (matching Customer.tagIds)

Distribution: 18 tagClass=4 (private), 7 tagClass=5-7 (commercial).

&#x20; 3 with kyvStatus='mismatch' (drives AVC misread signals).

&#x20; 2 with status='blacklisted' (drives S022 signals).

```



\---



```

ENTITY: Plaza

Stage 2 entity: Plaza (§D.1)

JSON shape:

{

&#x20; plazaId: string,                  // "PZ-" + NHAI format

&#x20; plazaName: string,                // e.g. "NH-4 Khopoli"

&#x20; state: string,

&#x20; highwayId: string,                // "NH-4" | "NH-48" | "NH-8" etc.

&#x20; acquirerId: string,

&#x20; isSetuAcquirerPlaza: boolean,

&#x20; avgDailyTransactions: number,

&#x20; npciTop50Flag: boolean,

}



Volume: 20 records (top plazas by complaint volume in mock data)

Distribution: 5 in Maharashtra (NH-4, NH-48), 4 in Karnataka (NH-48, NH-44),

&#x20; 3 in TN, 3 in NCT, 2 in GJ, 3 spread. 1 plaza flagged as coral

&#x20; (NH-4 Khopoli) for the S003/S005 storyline.

```



\---



```

ENTITY: Acquirer

Stage 2 entity: Acquirer (§D.1)

JSON shape:

{

&#x20; acquirerId: string,

&#x20; acquirerName: string,             // fictional: "Nexus Bank" | "Primus Bank" etc.

&#x20; npciRoutingCode: string,

}



Volume: 6 records (enough to cover all 20 plazas)

```



\---



```

ENTITY: Dispute

Stage 2 entity: Dispute (§D.1)

JSON shape:

{

&#x20; disputeId: string,

&#x20; npciReferenceId: string,          // "NPCI-DISP-" + 10 chars

&#x20; tagId: string,

&#x20; plazaId: string,

&#x20; transactionId: string,

&#x20; transactionTs: string,

&#x20; transactionAmount: number,        // ₹

&#x20; reasonCode: string,               // "5001" | "5225" | "3207" etc.

&#x20; filedTs: string,

&#x20; status: 'filed' | 'won' | 'rejected\_5225' | 'auto\_rejected\_3207' | 'pending',

&#x20; evidencePackRef: string,          // optional

&#x20; originatingInteractionId: string, // optional — the call that raised it

}



Volume: 15 records

Distribution: 4 with status='rejected\_5225' (drives OC 005 storyline),

&#x20; 3 'pending', 3 'won', 3 'filed', 2 'auto\_rejected\_3207'.

```



\---



```

ENTITY: ComplaintCase

Stage 2 entity: ComplaintCase (§D.1)

JSON shape:

{

&#x20; caseId: string,                   // "SF-FT-000XXXXX"

&#x20; customerId: string,

&#x20; tagId: string,

&#x20; openedTs: string,

&#x20; status: 'open' | 'in\_progress' | 'resolved' | 'partially\_resolved'

&#x20;         | 'proposed\_rejection' | 'closed',

&#x20; category: string,                 // persona vocabulary: "AVC misread"

&#x20; subCategory: string,

&#x20; slaTargetTs: string,

&#x20; slaActualTs: string | null,

&#x20; slaStatus: 'within' | 'breached' | 'at\_risk',

&#x20; assignedAgentId: string,

&#x20; ombudsmanFlag: boolean,

&#x20; resolutionSummary: string | null,

}



Volume: 15 records

Distribution: 4 status='partially\_resolved' (IO Readiness Queue — below 70%),

&#x20; 3 'open', 3 'in\_progress', 3 'resolved', 2 'proposed\_rejection'.

&#x20; 4 with slaStatus='breached' (for the refund SLA storyline).

```



\---



```

ENTITY: IOCase

Stage 2 entity: IOCase (§D.1)

JSON shape:

{

&#x20; ioCaseId: string,

&#x20; complaintCaseId: string,

&#x20; openedTs: string,

&#x20; ioReviewTs: string | null,

&#x20; status: 'under\_review' | 'partially\_resolved' | 'fully\_resolved'

&#x20;         | 'escalated\_to\_rbi\_ombudsman',

&#x20; evidencePackRef: string | null,

&#x20; ioFindingSummary: string | null,

}



Volume: 5 records (linked to the 5 highest-risk ComplaintCases)

```



\---



```

ENTITY: Agent

Stage 2 entity: Agent (§D.1)

JSON shape:

{

&#x20; agentId: string,

&#x20; codename: string,                 // "TH-042" style — NO real names

&#x20; bpoSiteId: string,

&#x20; shift: 'morning' | 'afternoon' | 'night',

&#x20; languagesSupported: string\[],

&#x20; tenureMonths: number,

&#x20; qaScoreRolling30d: number,        // 0-100

&#x20; scoreVisibilityScope: 'supervisor\_circle\_only',

}



Volume: 12 records (3-4 per BPO site, 2 shifts covered)

Distribution: 5 Trinetra (2 morning, 3 afternoon), 4 Anandam,

&#x20; 3 DigitalReach. No agent names — only codenames.

```



\---



```

ENTITY: BPOSite

Stage 2 entity: BPOSite (§D.1)

JSON shape:

{

&#x20; bpoSiteId: 'trinetra-hyd' | 'anandam-cbe' | 'digitalreach-blr',

&#x20; vendorName: 'Trinetra BPO' | 'Anandam Customer Solutions'

&#x20;             | 'DigitalReach',

&#x20; location: 'Hyderabad' | 'Coimbatore' | 'Bengaluru',

&#x20; channelScope: string\[],           // \['voice'] | \['chat', 'social']

&#x20; capacityFte: number,

}



Volume: 3 records (exactly as specified in Stage 1 §3)

```



\---



```

ENTITY: RecoveryAssignment

Stage 2 entity: RecoveryAssignment (§D.1)

JSON shape:

{

&#x20; assignmentId: string,

&#x20; tagId: string,

&#x20; customerId: string,

&#x20; sakshamAgentCodename: string,     // "SK-07" style

&#x20; assignedTs: string,

&#x20; negativeBalanceAmount: number,    // ₹

&#x20; balanceAgeDays: number,

&#x20; latestRecoveryCallId: string,     // links to Interaction

}



Volume: 6 records (sufficient for S018 and S026 signals)

Distribution: 2 flagged for conduct review (drives S018 demo event).

```



\---



```

ENTITY: SignalEvent

Stage 2 entity: SignalEvent (§D.1) / E.1 Provenance shape

JSON shape:

{

&#x20; signalEventId: string,           // "SE-FCX-FT-S004-001"

&#x20; signalId: string,                // "FCX-FT-S004"

&#x20; firedAt: string,                 // ISO timestamp

&#x20; windowStart: string,

&#x20; windowEnd: string,

&#x20; contributingInteractionIds: string\[],  // subset of Interaction IDs

&#x20; representativeSnippets: \[

&#x20;   {

&#x20;     interactionId: string,

&#x20;     channel: string,

&#x20;     snippetText: string,         // 120-180 chars, realistic, de-identified

&#x20;     language: string,

&#x20;     matchAnnotation: string,     // "\[Matched: AVC misread intent, plaza: NH-4 Khopoli]"

&#x20;     redactionApplied: boolean,

&#x20;   },

&#x20;   // EXACTLY 3 items — the spec is non-negotiable (Stage 3 §D.4)

&#x20; ],

&#x20; confidenceBand: 'high' | 'medium' | 'low',

&#x20; confidenceReason: string,        // one line, e.g. "z=3.2, 94-interaction window,

&#x20;                                  //   8-week baseline, ASR confidence ≥0.85"

&#x20; detectionModelVersion: string,   // "intent-classifier v1.4.2"

&#x20; recommendedAction: string,       // "Escalate to PNO; confirm with NPCI dispute team"

&#x20; actionOwner: string,             // "HoB" | "COH" | "NPCI dispute team" etc.

&#x20; linkedCaseIds: string\[],

&#x20; linkedDisputeIds: string\[],

&#x20; severity: 'info' | 'warn' | 'alert',

&#x20; // Pre-computed aggregates for chart rendering:

&#x20; aggregates: {

&#x20;   totalCount: number,

&#x20;   zScore: number,

&#x20;   baselineCount: number,

&#x20;   trendData: \[{ date: string, count: number, baseline: number }],

&#x20;   // 30 data points for the trailing 30d window

&#x20; }

}



Volume: 20 records (one per key signal visible in the demo — the 20 most

&#x20; relevant from FCX-FT-S004, S006, S016, S017, S018, S022, S024,

&#x20; S028, etc.)

Realism anchor: Each SignalEvent represents a signal firing, not an

&#x20; individual interaction. The contributingInteractionIds links back to

&#x20; the detailed Interaction records.

```



\---



```

ENTITY: EvidencePack  \[composite, not a Stage 2 base entity — assembled view]

Stage 2 entity: EVIDENCE\_PACK schema (§D.3)

JSON shape:

{

&#x20; packId: string,                  // "PACK-2026-0427-4421"

&#x20; assembledTs: string,

&#x20; trigger: 'case\_id' | 'tag\_id' | 'ad\_hoc',

&#x20; triggerId: string,

&#x20; caseIdMasked: string,            // "Case ···-4421"

&#x20; salesforceCaseId: string,        // "SF-FT-00004421"

&#x20; tagLast4: string,                // "9A3F"

&#x20; dateRangeStart: string,

&#x20; dateRangeEnd: string,

&#x20; completenessPercent: number,     // 0-100

&#x20; missingElements: string\[],       // e.g. \["plaza\_name", "kyv\_check"]

&#x20; chainOfCustody: {

&#x20;   fluidCxVersion: string,        // "v2.1.4"

&#x20;   assembledBy: string,           // "evidence-pack-assembler"

&#x20;   asrModel: string,              // "whisper-medium-indic v3.2"

&#x20;   classifiers: string\[],         // \["intent-classifier v1.4.2", ...]

&#x20;   assembledAt: string,

&#x20; },

&#x20; interactions: Interaction\[],     // 5-8 full Interaction records

&#x20; signalEvents: SignalEvent\[],     // 2-4 signal events on this case

&#x20; complianceChecks: \[

&#x20;   { checkType: string, outcome: 'pass' | 'partial' | 'fail',

&#x20;     evidenceSnippet: string, reviewedAt: string | null }

&#x20; ],

&#x20; crmLinkage: {

&#x20;   caseId: string, status: string,

&#x20;   slaTargetTs: string, slaActualTs: string | null, slaStatus: string

&#x20; },

&#x20; npciDisputeLinkage: {            // optional

&#x20;   disputeId: string, npciReferenceId: string,

&#x20;   reasonCode: string, status: string,

&#x20;   evidenceUploadedTs: string | null

&#x20; } | null,

&#x20; ioCaseLinkage: {                 // optional

&#x20;   ioCaseId: string, status: string

&#x20; } | null,

}



Volume: 5 records (covering the 4 highest-risk IOReadiness cases + 1

&#x20; for the Storyline 1 Evidence Pack demo)

Realism anchors:

&#x20; - Case ···-4421: completeness=87%, missing=\['plaza\_name', 'kyv\_check'],

&#x20;   6 days to IO review \[used in Storyline 3]

&#x20; - Case ···-7803: completeness=52%, missing multiple elements

&#x20; - Case ···-2219: completeness=61%

&#x20; - Case ···-5534: completeness=64%

&#x20; - Case ···-HOB1: completeness=87%, used in Storyline 1 AVC misread

```



\---



```

ENTITY: Pre-computed chart data  \[not a Stage 2 entity — frontend convenience]

JSON shape:

{

&#x20; headlineBriefData: \[

&#x20;   { categoryId: string, categoryLabel: string,

&#x20;     zScore: number, interactionCount: number, baselineCount: number,

&#x20;     representativeSnippet: string, signalEventId: string,

&#x20;     confidenceBand: string, modelVersion: string }

&#x20;   // exactly 3 items

&#x20; ],

&#x20; channelQualityData: \[

&#x20;   { channel: 'OEM-fitted' | 'Dealer' | 'E-com' | 'Branch',

&#x20;     complaintsPerThousand: number, cohortSize: number,

&#x20;     cohortMedian: number, flagged: boolean }

&#x20; ],

&#x20; sentimentDriftData: \[

&#x20;   { date: string, avcMisread: number, blacklistFalsePositive: number,

&#x20;     rechargeFailure: number, baseline\_upper: number, baseline\_lower: number }

&#x20;   // 30 items (30-day trailing)

&#x20; ],

&#x20; bpoHeatmapData: \[

&#x20;   { vendor: string, shift: string,

&#x20;     repeatCallRate: number, repeatCallZScore: number,

&#x20;     fcrProxy: number, fcrZScore: number,

&#x20;     oc005Completeness: number, oc005ZScore: number,

&#x20;     compositeStatus: 'normal' | 'watchful' | 'critical' }

&#x20;   // 9 items (3×3 grid)

&#x20; ],

&#x20; fcrDriftData: \[

&#x20;   { category: string, repeatCallRate: number,

&#x20;     wowDelta: number, hasPromiseGap: boolean, promiseGapCount: number }

&#x20;   // 5 items

&#x20; ],

&#x20; plazaHeatmapGrid: \[

&#x20;   { plazaId: string, plazaName: string, hour: number,

&#x20;     interactionCount: number, densityMultiplier: number,

&#x20;     grievanceTypes: string\[] }

&#x20;   // up to 200 items (20 plazas × 10 active hours)

&#x20; ],

&#x20; strategyTilesData: {

&#x20;   gnss: { count: number, awarenessPercent: number, confusionPercent: number,

&#x20;           anxietyPercent: number },

&#x20;   campaignFeedback: { campaignName: string, inboundCount: number,

&#x20;           sentimentLabel: string },

&#x20;   annualPassFaq: { topQuestion: string, weeklyCount: number },

&#x20;   branchHandoff: { weeklyCount: number },

&#x20;   autoRechargeOptIn: { weeklyRate: number },

&#x20;   ioQuarterly: { lastPackDate: string, caseCount: number,

&#x20;           readinessPercent: number }

&#x20; },

&#x20; complianceData: {

&#x20;   trilingual: { todayRate: number, target: number, wowDelta: number,

&#x20;           violations: number },

&#x20;   annualPassEligibility: { todayMisDisclosures: number, wowDelta: number },

&#x20;   kyvRootCause: { todayAdherenceRate: number, target: number },

&#x20;   sakshams18: { flagsToday: number, callsReviewed: number },

&#x20;   heatmapCells: \[

&#x20;     { complianceType: string, vendor: string, shift: string,

&#x20;       rate: number, target: number, status: 'pass'|'warn'|'fail' }

&#x20;   ]

&#x20; },

&#x20; chargebackData: {

&#x20;   weeklyCount: number, wowDelta: number,

&#x20;   sparklineData: \[{ week: string, count: number }] // 12 items

&#x20; },

&#x20; churnIntentData: { count30d: number, baselineMultiplier: number,

&#x20;   trendData: \[{ date: string, count: number }] }

}



Volume: Single object; all arrays sized for the demo.

Notes: This is Stage 7's primary data source for chart rendering.

&#x20; Stage 6 generates it alongside the entity arrays.

```



\---



```

ENTITY: SimulatedStream  \[the demo rhythm constant]

JSON shape:

SimulatedEvent\[]  — 12 events as defined in Section C.3 above.

Volume: exactly 12 events for a 10-minute demo window.

Distribution: see SIMULATED\_STREAM constant in Section C.3.

Notes: Stage 6 reviews the event payloads for realism and populates

&#x20; the payload.item fields with actual mock data records.

```



\---



\## SECTION F — SIMULATED-EVENT ENGINE



\### `useSimulatedStream()` hook



```javascript

// Called ONCE in AppContextProvider. Not in any screen component.



function useSimulatedStream() {

&#x20; const { state, dispatch } = useAppContext();



&#x20; // Tick the clock at 1s real-time = 1s simulated time

&#x20; useEffect(() => {

&#x20;   if (state.isStreamPaused) return;

&#x20;   const id = setInterval(() => {

&#x20;     dispatch({ type: 'ADVANCE\_CLOCK' });

&#x20;   }, 1000);

&#x20;   return () => clearInterval(id);

&#x20; }, \[state.isStreamPaused, dispatch]);



&#x20; // Fire pending events

&#x20; useEffect(() => {

&#x20;   const pending = SIMULATED\_STREAM.filter(

&#x20;     e => e.atSecond <= state.simulatedClock

&#x20;       \&\& !state.firedEventIds.has(e.eventId)

&#x20;   );

&#x20;   pending.forEach(event => {

&#x20;     dispatch({ type: 'FIRE\_EVENT', payload: event });

&#x20;   });

&#x20; }, \[state.simulatedClock, dispatch]);

&#x20; // Note: state.firedEventIds is NOT in the dependency array —

&#x20; // we rely on the reducer to guard against double-fire via the

&#x20; // MARK\_EVENT\_FIRED action inside FIRE\_EVENT.

}

```



\### FIRE\_EVENT reducer case



```javascript

case 'FIRE\_EVENT': {

&#x20; const { event } = action.payload;

&#x20; if (state.firedEventIds.has(event.eventId)) return state; // guard



&#x20; const newFiredIds = new Set(state.firedEventIds);

&#x20; newFiredIds.add(event.eventId);



&#x20; let updates = { firedEventIds: newFiredIds };



&#x20; switch (event.type) {

&#x20;   case 'alert\_toast': {

&#x20;     const alert = buildAlertFromEvent(event); // helper using mock data

&#x20;     updates.activeAlerts = \[alert, ...state.activeAlerts].slice(0, 10);

&#x20;     break;

&#x20;   }

&#x20;   case 'insert\_dispute\_row': {

&#x20;     updates.disputeEvidenceQueue = \[

&#x20;       event.payload.item,

&#x20;       ...state.disputeEvidenceQueue,

&#x20;     ];

&#x20;     break;

&#x20;   }

&#x20;   case 'update\_bpo\_badge': {

&#x20;     updates.bpoAlertState = {

&#x20;       ...state.bpoAlertState,

&#x20;       \[event.payload.signalKey]:

&#x20;         (state.bpoAlertState\[event.payload.signalKey] || 0)

&#x20;         + event.payload.increment,

&#x20;     };

&#x20;     break;

&#x20;   }

&#x20;   case 'insert\_action\_item': {

&#x20;     updates.actionQueueItems = \[

&#x20;       event.payload.item,

&#x20;       ...state.actionQueueItems,

&#x20;     ];

&#x20;     break;

&#x20;   }

&#x20;   case 'stream\_refresh': {

&#x20;     updates.streamRefreshTimestamp = state.simulatedClock;

&#x20;     break;

&#x20;   }

&#x20; }



&#x20; return { ...state, ...updates };

}

```



\### Clock speed



\*\*Real-time 1:1\*\* (1 second of wall time = 1 second of simulated time). This means the T+45s Ombudsman alert fires \~45 real seconds after the demo starts. Founders present live — this is realistic for a 5-7 minute demo. The accelerated-clock alternative (5× speed) is specified here as a comment in the constant for Stage 7 to toggle:



```javascript

const CLOCK\_SPEED\_MULTIPLIER = 1; // Set to 5 for accelerated demo

// In useSimulatedStream: setInterval(..., 1000 / CLOCK\_SPEED\_MULTIPLIER)

```



\### Stream indicator display



```javascript

// In StreamIndicator component:

const minutesAgo = Math.floor(

&#x20; (state.simulatedClock - (state.streamRefreshTimestamp ?? 0)) / 60

);

const label = minutesAgo === 0

&#x20; ? 'Updated just now'

&#x20; : `Live · ${minutesAgo} min ago`;

```



\### Pause/resume



`<StreamIndicator>` renders a pause button (⏸ icon) when `!isStreamPaused`, a play button (▶ icon) when `isStreamPaused`. Click dispatches `TOGGLE\_STREAM\_PAUSE`. The `useSimulatedStream` hook's `setInterval` respects the paused state via its dependency array — when `isStreamPaused` becomes `true`, the effect returns its cleanup and no new interval is set.



\### Visual feedback when an event fires



When a `FIRE\_EVENT` dispatch resolves and `activeAlerts` gains a new item:

\- `<HoBPrimary>` and `<COHPrimary>` both render the `activeAlerts` array as a stack of `<AlertToast>` components in a fixed right-margin div.

\- Each `<AlertToast>` has an entrance animation: `@keyframes slideDown` defined in a `<style>` tag — `transform: translateY(-20px) → translateY(0)` over 200ms.

\- When a `bpoAlertState` badge increments, `<ShiftStatusBar>` re-renders with the new count. The badge component applies a CSS pulse class for 300ms (using a `useEffect` that adds and removes a class after a timeout).



\### \[INFERRED] — pulse animation implementation



Since Tailwind's JIT is not available in Claude Artifacts (only pre-defined base-stylesheet classes work), custom animations are implemented via an inline `<style>` block at the top of the file:



```javascript

// At the very top of the file, inside the JSX of <App>:

<style>{`

&#x20; @keyframes slideDown {

&#x20;   from { transform: translateY(-16px); opacity: 0; }

&#x20;   to   { transform: translateY(0);     opacity: 1; }

&#x20; }

&#x20; @keyframes pulse {

&#x20;   0%,100% { transform: scale(1); }

&#x20;   50%     { transform: scale(1.2); }

&#x20; }

&#x20; @keyframes shimmer {

&#x20;   0%   { background-position: -200% 0; }

&#x20;   100% { background-position:  200% 0; }

&#x20; }

&#x20; .animate-slide-down { animation: slideDown 200ms ease-out; }

&#x20; .animate-badge-pulse { animation: pulse 300ms ease-in-out; }

&#x20; .shimmer {

&#x20;   background: linear-gradient(90deg,

&#x20;     #1A2035 25%, #242B3D 50%, #1A2035 75%);

&#x20;   background-size: 200% 100%;

&#x20;   animation: shimmer 1.5s infinite;

&#x20; }

&#x20; @media print {

&#x20;   body { background: #EEEAF4 !important; color: #0D1117 !important; }

&#x20;   .no-print { display: none !important; }

&#x20;   .print-only { display: block !important; }

&#x20; }

`}</style>

```



\---



\## SECTION G — VISUAL IMPLEMENTATION SPEC



\### Colour tokens (Tailwind arbitrary values)



All custom colours use Tailwind's arbitrary value syntax `bg-\[#hex]`, `text-\[#hex]`, `border-\[#hex]`. The YaaraLabs palette is not in Tailwind's default palette, so arbitrary values are the only option in a single-file artifact without a config file.



| Token | Hex | Tailwind class | Signals |

|---|---|---|---|

| Canvas | `#0D1117` | `bg-\[#0D1117]` | Primary background — all screens |

| Dark navy (card bg) | `#1A2035` | `bg-\[#1A2035]` | All tile/card backgrounds |

| Slate (border/divider) | `#2D3748` | `border-\[#2D3748]` | All borders, dividers, inactive nav |

| Brand purple | `#7B2FF0` | `bg-\[#7B2FF0]` `text-\[#7B2FF0]` `border-\[#7B2FF0]` | Primary CTA buttons, active nav, progress fills |

| Cyan | `#00D4FF` | `text-\[#00D4FF]` `border-\[#00D4FF]` | Live indicators, \[OBSERVED] badge, stream indicator, trend lines at baseline |

| Coral | `#FF7043` | `text-\[#FF7043]` `bg-\[#FF7043]` `border-\[#FF7043]` | Alerts, urgent rows, missing evidence, z-score >2×, code 5225 |

| Lavender | `#EEEAF4` | `bg-\[#EEEAF4]` `text-\[#EEEAF4]` | Evidence pack print mode bg; subtitle text |

| Success green | `#48BB78` | `text-\[#48BB78]` | Pass/complete states, all-clear indicators |

| Amber | `#ECC94B` | `text-\[#ECC94B]` `border-\[#ECC94B]` | \[INFERRED] badge, partial signals, watchful states, 1.3–1.7× baseline |

| Light navy (hover) | `#242B3D` | `bg-\[#242B3D]` | Hover state for cards and rows |

| White | `#FFFFFF` | `text-white` | Primary text on dark backgrounds |

| Grey | `#718096` | `text-gray-500` | Secondary/micro text, metadata |



\### Typography



Four fixed class strings — used consistently throughout:



```javascript

const T = {

&#x20; display: 'text-2xl font-bold text-white',

&#x20; heading:  'text-base font-semibold text-white',

&#x20; body:     'text-sm text-white',

&#x20; micro:    'text-xs text-gray-500',

};

// Usage: <h2 className={T.display}>94</h2>

// These constants live in the CONSTANTS section (Section 2 of the file)

```



\### Spacing



Canonical patterns — not deviated from without explicit reason:



| Usage | Tailwind classes |

|---|---|

| Compact tile internal padding | `p-3` (12px) |

| Standard component internal padding | `p-4` (16px) |

| Screen content outer padding | `px-6 py-4` (24px / 16px) |

| Zone gutter (between zones) | `gap-4` (16px) |

| Section gutter (between major sections) | `gap-6` (24px) |

| Sidebar width | `w-60` (240px) |

| DrillDown panel width | `w-80` (320px) |

| TopBar height | `h-12` (48px) |



\### Canonical component class strings



```javascript

// ACTION QUEUE ROW (normal state)

const CLS\_QUEUE\_ROW\_NORMAL =

&#x20; 'flex items-center gap-3 p-4 rounded-lg bg-\[#1A2035] ' +

&#x20; 'border border-\[#2D3748] hover:border-\[#7B2FF0] ' +

&#x20; 'hover:bg-\[#242B3D] cursor-pointer transition-all duration-150';



// ACTION QUEUE ROW (urgent — coral left border)

const CLS\_QUEUE\_ROW\_URGENT =

&#x20; 'flex items-center gap-3 p-4 rounded-lg bg-\[#1A2035] ' +

&#x20; 'border-l-2 border-l-\[#FF7043] border-y border-r border-\[#2D3748] ' +

&#x20; 'cursor-pointer transition-all duration-150';



// HEADLINE CARD

const CLS\_HEADLINE\_CARD =

&#x20; 'p-4 rounded-xl bg-\[#1A2035] border border-\[#2D3748] ' +

&#x20; 'cursor-pointer hover:border-\[#00D4FF] hover:bg-\[#242B3D] ' +

&#x20; 'transition-all duration-150 flex-1';



// KPI TILE (strategy tile, operational signal tile)

const CLS\_KPI\_TILE =

&#x20; 'p-3 rounded-lg bg-\[#1A2035] border border-\[#2D3748] ' +

&#x20; 'cursor-pointer hover:border-\[#7B2FF0] transition-all duration-150';



// SIGNAL BADGE

const CLS\_SIGNAL\_BADGE\_ALERT = 'text-xs px-2 py-0.5 rounded-full ' +

&#x20; 'bg-\[#FF7043]/20 text-\[#FF7043] border border-\[#FF7043]/30';

const CLS\_SIGNAL\_BADGE\_WARN  = 'text-xs px-2 py-0.5 rounded-full ' +

&#x20; 'bg-\[#ECC94B]/20 text-\[#ECC94B] border border-\[#ECC94B]/30';

const CLS\_SIGNAL\_BADGE\_INFO  = 'text-xs px-2 py-0.5 rounded-full ' +

&#x20; 'bg-\[#2D3748] text-gray-400 border border-\[#2D3748]';



// DRILL-DOWN PANEL (fixed overlay)

const CLS\_DRILL\_DOWN\_PANEL =

&#x20; 'fixed right-0 top-0 h-full w-80 bg-\[#0D1117] ' +

&#x20; 'border-l border-\[#2D3748] shadow-2xl z-50 ' +

&#x20; 'overflow-y-auto flex flex-col';



// EVIDENCE PACK HEADER

const CLS\_EVIDENCE\_HEADER =

&#x20; 'p-6 bg-\[#1A2035] border-b border-\[#2D3748]';



// PRIMARY BUTTON

const CLS\_BTN\_PRIMARY =

&#x20; 'px-4 py-2 rounded-lg bg-\[#7B2FF0] text-white text-sm ' +

&#x20; 'font-medium hover:bg-\[#9B59F3] transition-colors duration-150 ' +

&#x20; 'cursor-pointer';



// SECONDARY BUTTON / TEXT LINK

const CLS\_BTN\_SECONDARY =

&#x20; 'px-3 py-1.5 rounded-md bg-transparent text-\[#7B2FF0] ' +

&#x20; 'text-sm hover:bg-\[#7B2FF0]/10 transition-colors duration-150 ' +

&#x20; 'cursor-pointer';

```



\### Dark mode discipline



All screens use the dark canvas (`#0D1117`). The single light-mode exception is the Evidence Pack print mode: when `lightModeForPrint=true`, the `<IOEvidencePackScreen>` wraps its content in a `bg-\[#EEEAF4] text-\[#0D1117]` container and triggers `window.print()`. The `@media print` CSS block in the `<style>` tag handles the browser print layout. The Trend Explorer overlay is dark (it overlays the dark screen). The Drill-Down panel is dark.



\---



\## SECTION H — LIBRARY AND IMPORT INVENTORY



\### Required imports (exact syntax for Stage 7)



```javascript

import React, {

&#x20; useState, useReducer, useEffect, useMemo,

&#x20; useCallback, useContext, createContext, useRef

} from 'react';



import {

&#x20; LineChart, Line,

&#x20; BarChart, Bar,

&#x20; AreaChart, Area,

&#x20; XAxis, YAxis, CartesianGrid, Tooltip, Legend,

&#x20; ResponsiveContainer, Cell, ReferenceLine

} from 'recharts';



import {

&#x20; Sparkles, Activity, Bell, MapPin, ShieldCheck,

&#x20; AlertTriangle, CheckCircle, XCircle, MinusCircle,

&#x20; ChevronRight, ChevronLeft, TrendingUp, TrendingDown,

&#x20; Phone, MessageSquare, Mail, Share2,

&#x20; Download, Clock, User, Plus, Filter, X,

&#x20; RefreshCw, Pause, Play, Shield, FileText

} from 'lucide-react';

```



`useRef` is \[INFERRED] — needed for the print trigger and for stable setTimeout references.



`ReferenceLine` (Recharts) \[INFERRED] — needed for the cohort median reference line in `<ChannelQualityBar>`.



`Shield`, `FileText` \[INFERRED] — needed for compliance and complaint channel icons not specified in Stage 3 §F but required for the Compliance Watch screen.



\### shadcn/ui imports



None required. The component vocabulary from Stage 3 §E is fully implementable with Tailwind arbitrary values and the component class strings above. Importing shadcn/ui would add significant line overhead and dependency risk in a single-file artifact. Stage 7 should not import shadcn/ui.



\### Forbidden (absolute — will break the artifact)



```

localStorage          // not available in Claude Artifact sandbox

sessionStorage        // same

fetch()               // no external calls

axios / superagent    // same

React Router          // not importable

Redux / Zustand       // not importable

Date.now()            // OK to use; avoid new Date() for timezone reasons

&#x20;                     //   use the simulatedClock for all time display

window.location       // do not use for routing

document.cookie       // not available

```



\### Line budget awareness



The single-file ceiling is \~2,400–2,500 lines. Approximate allocation:



| Section | Estimated lines |

|---|---|

| 1. Imports | 30 |

| 2. Constants (colours, IDs, class strings, typography) | 100 |

| 3. Mock data (pre-computed chart data, signal events, interactions sample) | 400 |

| 4. Context + reducer | 160 |

| 5. Custom hooks (useSimulatedStream, useAppContext) | 60 |

| 6. Atoms (8 components × \~25 lines) | 200 |

| 7. Shared widgets (ActionQueueRow, StrategyTile, etc. × 8 × \~40 lines) | 320 |

| 8. Zone widgets (HeadlineBrief, DisputeEvidenceQueue, etc. × 10 × \~40 lines) | 400 |

| 9. Overlay screens (DrillDownPanel, TrendExplorer × 2 × \~100 lines) | 200 |

| 10. Shared screens (LiveAlerts, PlazaHeatmap, IOEvidencePack, ComplianceWatch × 4 × \~80 lines) | 320 |

| 11. Primary screens (HoBPrimary, COHPrimary × 2 × \~100 lines) | 200 |

| 12. Shell + App (Sidebar, TopBar, ScreenRouter, Shell, App × \~120 lines) | 120 |

| \*\*Total\*\* | \*\*\~2,510\*\* |



This is within ceiling if mock data is kept lean (pre-computed aggregates rather than full interaction arrays). Stage 7 must actively manage line budget. If over budget, the first cut is expanding mock data arrays inline — move those to a `MOCK\_DATA` constant object at the top and keep arrays short.



\---



\## SECTION I — SINGLE-FILE STRUCTURE



The file is navigated by section comments. Stage 7 must follow this order.



```javascript

// ============================================================

// SECTION 1: IMPORTS

// ============================================================

// React hooks, Recharts, lucide-react

// (see Section H for exact import syntax)



// ============================================================

// SECTION 2: CONSTANTS

// ============================================================

// Colour tokens (as hex strings — used in CLS\_ strings)

// Typography constants (T.display, T.heading, T.body, T.micro)

// Screen ID constants (SCREEN\_IDS object)

// Signal ID constants (SIGNAL\_IDS object)

// Time window constants

// Canonical component class strings (CLS\_\* constants)

// Persona default screen map



// ============================================================

// SECTION 3: MOCK DATA

// ============================================================

// Pre-computed chart data (headlineBriefData, bpoHeatmapData,

//   sentimentDriftData, channelQualityData, fcrDriftData,

//   plazaHeatmapGrid, strategyTilesData, complianceData,

//   chargebackData)

// Signal events (MOCK\_SIGNAL\_EVENTS — 20 records)

// Evidence packs (MOCK\_EVIDENCE\_PACKS — 5 records)

// Interactions sample (MOCK\_INTERACTIONS — 40 records)

// BPO sites (MOCK\_BPO\_SITES — 3 records)

// Initial queue state (INITIAL\_ACTION\_QUEUE\_ITEMS,

//   INITIAL\_DISPUTE\_EVIDENCE\_QUEUE, INITIAL\_IO\_READINESS\_QUEUE)



// ============================================================

// SECTION 4: SIMULATED STREAM

// ============================================================

// SIMULATED\_STREAM constant — 12 events

// buildAlertFromEvent() helper



// ============================================================

// SECTION 5: CONTEXT AND REDUCER

// ============================================================

// AppContext = createContext()

// initialState object

// appReducer(state, action) — full switch/case

// AppContextProvider component (calls useSimulatedStream)

// useAppContext() convenience hook



// ============================================================

// SECTION 6: CUSTOM HOOKS

// ============================================================

// useSimulatedStream() — the demo rhythm engine

// getSignalEvent(signalId) — selector

// getInteractionsForSignal(signalId) — selector

// getEvidencePack(caseId) — selector



// ============================================================

// SECTION 7: ATOMS

// ============================================================

// ProvenancePill

// SignalBadge

// ObservedInferredBadge

// ChannelIcon

// BPOSiteTag

// ReadinessProgressBar

// HeatmapCell

// NavItem



// ============================================================

// SECTION 8: SHARED WIDGET COMPONENTS

// ============================================================

// ActionQueueRow (variant prop — most-reused)

// SnippetCard

// InteractionListItem

// StrategyTile

// ComplianceTile

// AlertCard

// AlertToast



// ============================================================

// SECTION 9: ZONE WIDGETS — HOB

// ============================================================

// HeadlineBrief + HeadlineCard

// ActionQueue

// ChargebackIndicator

// ChannelQualityBar

// SentimentDriftChart

// StrategyTileGrid



// ============================================================

// SECTION 10: ZONE WIDGETS — COH

// ============================================================

// ShiftStatusBar

// DisputeEvidenceQueue

// IOReadinessQueue

// BPOHeatmapWidget

// FCRDriftPanel

// ComplianceStrip

// OperationalSignals



// ============================================================

// SECTION 11: SHARED SCREEN WIDGETS

// ============================================================

// EvidencePackHeader

// InteractionsList

// TranscriptPane

// EvidenceRail

// ComplianceHeatmap

// BreachQueue

// RBIOSClockWidget

// TrendChart



// ============================================================

// SECTION 12: OVERLAY SCREENS

// ============================================================

// DrillDownPanel (fixed-right overlay)

// TrendExplorer (full-viewport overlay)



// ============================================================

// SECTION 13: SHARED NAVIGABLE SCREENS

// ============================================================

// LiveAlerts (SCR-SHR-01)

// PlazaHeatmapScreen (SCR-SHR-02)

// IOEvidencePackScreen (SCR-SHR-03)

// ComplianceWatchScreen (SCR-SHR-05)



// ============================================================

// SECTION 14: PRIMARY SCREENS

// ============================================================

// HoBPrimary (SCR-HOB-01) — demo hero surface

// COHPrimary (SCR-COH-01) — operations console



// ============================================================

// SECTION 15: SHELL AND APP ROOT

// ============================================================

// PersonaSwitcher

// NavItems

// StreamIndicator

// Sidebar

// TopBar

// ScreenRouter

// Shell

// App — renders <style> block + <AppContextProvider>

// export default App;

```



\---



\## SECTION J — HANDOFF TO STAGE 6 AND STAGE 7



\### To Stage 6 (Mock Data Generation)



\*\*Read Stage 5 §E in full before generating any data.\*\* The JSON shapes are the binding contract.



\*\*Priority 1 — the data Stage 7 cannot render without:\*\*

1\. `headlineBriefData` — 3 items. AVC misread (z=3.2, 94 calls), Blacklist false positive (z=2.1, 61 calls), Recharge not reflected (z=1.7, 48 calls). Snippet text must be in English, Hindi, and Tamil respectively.

2\. `INITIAL\_DISPUTE\_EVIDENCE\_QUEUE` — 7 items matching Stage 4 §B SCR-COH-01 initial state (3 coral, 4 non-urgent). Row 1: plaza ✗, class ✗; Row 2: txn-id ✗, statement ✗.

3\. `INITIAL\_IO\_READINESS\_QUEUE` — 4 items. Case ···-4421 at 38%, 6 days; Case ···-7803 at 52%, 14 days; Case ···-2219 at 61%, 22 days; Case ···-5534 at 64%, 9 days.

4\. `MOCK\_EVIDENCE\_PACKS` — 5 packs per §E. Case ···-4421 must have 8 interactions, 87% completeness, missing elements \['plaza\_name', 'kyv\_check'].

5\. `MOCK\_SIGNAL\_EVENTS` — 20 records. FCX-FT-S004 must include 3 snippets in English/Hindi/Tamil. FCX-FT-S006 must include the 90-seconds-before-threat transcript segment.



\*\*Priority 2 — chart data:\*\*

6\. `bpoHeatmapData` — 9 cells. Trinetra Afternoon must be `compositeStatus: 'critical'` (OC005 completeness 78%).

7\. `sentimentDriftData` — 30 daily records. AVC misread line at −1.8σ for the last 6 days.

8\. `plazaHeatmapGrid` — NH-4 Khopoli at 08:00–09:00 must be `densityMultiplier: 3.2`.



\*\*Snippet text requirements:\*\*

\- Every `representativeSnippet.snippetText` must be 120–180 characters of realistic de-identified FASTag complaint dialogue.

\- Language distribution across 40 interactions: 16 English, 12 Hindi, 5 Tamil, 4 Telugu, 3 Marathi. Transliterated romanisation is acceptable for non-English snippets (not required to use Devanagari/Tamil script in the prototype).

\- Match the FASTag complaint taxonomy from Stage 0 §4.3: AVC misread ("charged two axles, car is a Maruti"), double deduction ("charged twice at Khopoli"), recharge not reflected ("debited ₹200 from PhonePe but wallet shows zero"), blacklist despite sufficient balance ("balance shows ₹280 but tag blocked").



\*\*`simulatedStream` event payloads:\*\*

\- Event E003 payload.item must be a complete `DisputeEvidenceItem` with `evidenceElements: {plaza: false, txnId: true, vehicleClass: false, customerStatement: true, agentConfirmation: true}` — this is the fourth at-risk row.

\- Event E005 payload must reference a real `interactionId` from `MOCK\_INTERACTIONS` (a Saksham recovery call with aggressive language in the `transcriptAnnotations`).



\### To Stage 7 (Prototype Build)



\*\*Read Stage 5 in full before writing any code.\*\* Then read Stage 4 §C (the 5 storylines) — these are the acceptance tests.



\*\*Hard requirements:\*\*

1\. The file must be single JSX, ≤2,500 lines, renderable in a Claude Artifact preview.

2\. Import only what is listed in Section H. No additional imports.

3\. Follow the file structure in Section I exactly — section comments must be present.

4\. The `SIMULATED\_STREAM` constant from Section C.3 drives the demo. All 12 events must fire correctly.

5\. All 5 storylines from Stage 4 §C must be walkable end-to-end without errors.

6\. Every signal on screen must reach provenance in ≤2 clicks (click 1: any number → DrillDown; click 2: "Open Evidence Pack →" → SCR-SHR-03).

7\. The Evidence Pack "Export PDF" button must trigger `window.print()` after switching the pack to light mode.



\*\*Line budget management:\*\*

\- If the file exceeds 2,500 lines: first cut is collapsing MOCK\_INTERACTIONS to 15 records (keep the 5 used in Evidence Packs + 10 for drill-downs). Second cut is simplifying the PlazaHeatmapScreen (replace grid with a 10-cell table). Do NOT cut the DrillDownPanel, Evidence Pack viewer, or the SimulatedStream engine — these are the core value demonstration.



\*\*The 60-second test (Stage 3 §B.4) is the first thing to verify:\*\*

Open the artifact on the HoB screen. Wait 45 seconds. The S006 AlertToast must appear. Click it. DrillDown panel must slide in with 3 snippets. Click "Open Evidence Pack →". Evidence pack must load with 87% completeness and the chain-of-custody stamp. Total: under 90 seconds.



\*\*Anti-patterns to avoid in implementation:\*\*

\- No agent names anywhere — only codenames (TH-042, SK-07 style).

\- No leaderboard-style ranking in the BPO heatmap.

\- Saksham conduct tile must always render the boundary note.

\- S013 partial badge must always be visible in ChargebackIndicator.

\- The BPO heatmap must say "Cohort-level view only" in its footer.



\---



\*End of Stage 5 output. Feed-forward to Stage 6: §E is the data contract, §C.3 SIMULATED\_STREAM is the demo event list that Stage 6 populates with realistic payloads. Feed-forward to Stage 7: §I is the file structure, §H is the import inventory, §F is the event engine, §G is the Tailwind class patterns, and Stage 4 §C is the acceptance test suite.\*

