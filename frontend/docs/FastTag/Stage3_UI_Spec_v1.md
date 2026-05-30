# Stage 3 — UI Specification
## Fluid CX × Setu FASTag MVP

**Stage inputs read in full:** `Stage0_FASTag_Issuer_Bank_Dossier_v1.md`, `Stage1_Persona_Definition_v1.md`, `Stage2_Capabilities_DataModel_v1.md`
**This output:** `Stage3_UI_Spec_v1.md` — write inline, user saves and uploads manually
**Locked context:** Vahan Bank · Setu FASTag · 18M tag-in-force · 800K monthly issuance · 22L daily NETC transactions · 65,000 daily interactions (Voice 58% / Chat 22% / Email 8% / Social 5% / 1033 4% / Branch 3%) · Trinetra BPO Hyderabad / Anandam Coimbatore / DigitalReach Bengaluru · Saksham Recovery · Genesys Cloud + Ozonetel · Salesforce CRM
**Product boundary contract:** Fluid CX reads and surfaces; it does not replace CRM/CMS, NPCI dispute switch, IVR, recovery workflow, IO judgement, fraud authentication, or legal review. Every surface where this limit is relevant carries boundary microcopy.

---

## SECTION A — APP STRUCTURE

### Navigation choice: Left rail

The left rail is the correct navigation pattern for this MVP for two reasons. First, both personas scan the screen vertically before acting — a left rail keeps navigation persistent and out of the top-of-screen zone where the Headline Brief and Shift Status Bar must live. Second, a React single-file JSX artifact renders a left-rail layout cleanly using `flex flex-row` without scroll conflict; top tabs would compete for vertical space with the dense operational zones this spec requires.

### Primary screens

- **Setu Intelligence** — HoB primary screen. Default landing when the persona badge is set to Head of Business.
- **Operations Console** — COH primary screen. Default landing when set to Customer Operations Head.

### Shared surfaces (accessed from both primary screens via left rail)

- **Live Alerts** — fires S003, S006, S018, S021, S028. Real-time alert feed accessible to both personas.
- **Plaza Heatmap** — fires S005, S022, S025. Geographic and temporal clustering of plaza-level complaints.
- **IO Evidence Pack** — fires S024, S032, S036. The IO-defensibility queue, assembly viewer, and quarterly pack surface.

Drill-Down and Trend Explorer are not top-level screens. Drill-Down opens as a right-side slide panel from any signal tile. Trend Explorer opens as a full-screen overlay from any trend chart's "Explore →" button. Both satisfy Stage 2 §G's five-surface constraint.

### Persona switcher

Top of the left rail, above navigation items. A compact badge showing initials and role: `RV · HoB` or `SC · COH`. Clicking the badge reveals an inline dropdown with two options: `Head of Business` and `Customer Operations Head`. Selecting switches the primary screen active in the main content area. The active screen item in the left rail highlights with the primary purple (`#7B2FF0`) left border. This is the primary demo toggle.

### Navigation map

```
┌──────────────────────────────────────────────────────────┐
│ LEFT RAIL (240px, persists)   │  MAIN CONTENT AREA        │
│                               │                           │
│  [RV · HoB ▾]  ← persona     │  ┌─ Active Screen ──────┐ │
│  ─────────────────            │  │                      │ │
│  ◆ Setu Intelligence  ←HoB   │  │  HeadlineBrief       │ │
│    Operations Console ←COH   │  │  ActionQueue         │ │
│  ─────────────────            │  │  ChargebackPanel     │ │
│  🔔 Live Alerts               │  │  ChannelQuality      │ │
│  📍 Plaza Heatmap             │  │  SentimentDrift      │ │
│  🛡 IO Evidence Pack          │  │  StrategyTiles       │ │
│  ─────────────────            │  └──────────────────────┘ │
│  ⚙  Settings                  │                           │
│                               │  ► DrillDownPanel          │
│  [Stream live ●]              │    (slides in from right) │
│  Last refresh: 4 min ago      │                           │
└──────────────────────────────────────────────────────────┘

OVERLAY (non-navigable surfaces, launched from within screens):
  TrendExplorer  ← full-screen overlay from any trend chart "Explore →"
  DrillDownPanel ← right-side slide panel from any number/signal tile
```

---

## SECTION B — PRIMARY SCREEN: HEAD OF BUSINESS (HoB)

### B.1 Screen name and purpose

**"Setu Intelligence"** — an executive brief that answers "what is moving this morning and what do I do about it" before the 10:00am ops huddle. Not a dashboard. A brief with provenance.

### B.2 Layout zones

---

```
ZONE B1: "Today's Headline" — top of screen, full width
Component type: HeadlineBrief
What it shows:
  The 3 complaint categories with the largest 12-hour growth vs. the
  8-week baseline, computed at 08:30. Each card shows: category name
  in persona vocabulary ("AVC misread queue", not "vehicle class
  mismatch"), a z-score badge ("3.2× baseline"), the absolute call
  count, and one verbatim de-identified customer phrase from the
  trailing hour. A "last updated" stream indicator (e.g. "Live · 4 min
  ago") runs in the top-right corner of the zone.
Signal IDs drawn from: FCX-FT-S004
Daily Friction moment(s) served:
  Stage 1 / HoB Daily Friction #2 — "8:30am — the MIS pack: what's
  breaking this morning, not yesterday."
Provenance behaviour:
  Each of the three category cards has a single ProvenancePill (count,
  window, confidence, model version) visible on the face of the card.
  Clicking a category card opens the DrillDownPanel showing the 3
  representative snippets + contributing interaction list.
Empty state:
  Green card reading: "No anomalous growth in the last 12 hours —
  baseline holding. Last checked [timestamp]." Only one card, full
  width. In production this is valid signal; in demo it is a useful
  contrast state.
Refresh cadence: Daily-brief (08:30 auto-compute; live stream updates
  the "last updated" indicator continuously; full recompute on
  demand via "Refresh" icon).
```

---

```
ZONE B2: "Action Queue" — left, below B1, ~60% width
Component type: ActionQueue (stacked ActionQueueRows)
What it shows:
  3–5 actionable items sorted by revenue impact today:
    Row 1 (S002): "Annual Pass misses — [N] calls not prompted yesterday"
    Row 2 (S008): "Fleet intent signals — [N] calls waiting for
                  corporate desk routing"
    Row 3 (S010): "CASA cross-sell leads — [N] banking mentions,
                  [N] are non-CASA customers"
  Each row: intent icon, title in persona vocabulary, count, impact
  line, downstream owner label (e.g. "→ Marketing", "→ Corporate
  FASTag desk"), and a "Review" chevron.
Signal IDs drawn from: FCX-FT-S002, FCX-FT-S008, FCX-FT-S010
Daily Friction moment(s) served:
  Stage 1 / HoB Friction #3 — "10:00am ops huddle: what does the
  contact centre actually tell us to do today?"
  Stage 1 / HoB Question #3 — "In how many of yesterday's calls did
  the customer recharge for the third time and the agent did not offer
  the Annual Pass?"
Provenance behaviour:
  Each row has a ProvenancePill on hover: count, time window (trailing
  24h or per-shift), confidence band. Clicking a row opens the
  DrillDownPanel.
Empty state:
  "No outstanding action items · [timestamp]" with a green CheckCircle
  icon. Clean operational state — not "no data", but "nothing to do
  right now."
Refresh cadence: Daily-brief; rows re-sort on incoming data.
```

---

```
ZONE B3: "Chargeback Intelligence" — right, beside B2, ~40% width
Component type: ChargebackIndicator
What it shows:
  Two stacked sub-tiles:

  Sub-tile A (S013 — partial signal):
    "Dispute potential this week — [N] chargeback-eligible calls"
    A micro sparkline (Recharts) of weekly count with a cyan
    "[Conversation-side only. Full chargeback ratio requires
    NPCI feed.]" boundary statement in micro text below the
    number. [INFERRED] badge on the metric.

  Sub-tile B (S001 — churn intent):
    "Churn-intent mentions — [N] calls (trailing 30 days)"
    A mini trend line; "x.x× baseline" badge if above threshold.
    Provenance pill.
Signal IDs drawn from: FCX-FT-S013, FCX-FT-S001
Daily Friction moment(s) served:
  Stage 1 / HoB Friction #4 — "14:30 CS deep-dive: is the QA sample
  representative? What is the chargeback win rate trend?"
  Stage 1 / HoB Question #7 — "Is the churn signal sitting in
  conversations weeks before the tag-closure call?"
Provenance behaviour:
  Both sub-tiles have ProvenancePills. The partial-signal badge
  (amber) is permanently visible on S013 — per Stage 2 §E, metrics
  derived from conversation-side only are labelled [INFERRED].
  Clicking either sub-tile opens the DrillDownPanel.
Empty state:
  "No chargeback-eligible calls detected in the trailing 7 days."
Refresh cadence: Weekly for S013 (sparkline), near-real-time
  for S001 trend badge.
```

---

```
ZONE B4: "Day-1 Channel Quality" — below B2, left ~50% width
Component type: ChannelQualityBar
What it shows:
  A horizontal bar chart (Recharts) of complaint rate per 1,000 tags
  in the first 30 days of tag life, segmented by issuance channel:
  OEM / Dealer / E-com / Branch. A horizontal dotted line marks the
  cohort median. Bars exceeding 1.4× median are coral (#FF7043).
  Channel name is in plain language: "OEM-fitted", "Dealer", "E-com",
  "Branch". No jargon invented; this matches Stage 1 HoB vocabulary.
Signal IDs drawn from: FCX-FT-S007
Daily Friction moment(s) served:
  Stage 1 / HoB Question #1 — "How many of those OEM-fitted tags
  become dispute calls in the first 30 days — and is the channel
  partner the actual root cause?"
Provenance behaviour:
  Hovering over any bar shows ProvenancePill: cohort size, date
  range, confidence band (high/medium/low per cohort size). Clicking
  a bar opens DrillDownPanel filtered to that channel.
Empty state:
  "No 30-day cohort data available yet. This signal updates weekly."
Refresh cadence: Weekly.
```

---

```
ZONE B5: "Sentiment Drift — early warning" — below B3, right ~50% width
Component type: SentimentDriftChart (Recharts LineChart)
What it shows:
  A small multi-line chart (top 3 complaint categories by current
  sentiment z-score). X-axis: trailing 30 days. Y-axis: sentiment
  relative to 8-week baseline (0 = baseline). A shaded band marks the
  ±1σ normal zone. Lines below -1σ sustained are coral. A small legend
  names the categories in persona vocabulary.
Signal IDs drawn from: FCX-FT-S034
Daily Friction moment(s) served:
  Stage 1 / HoB Question #2 — "What did my agent say in the 90
  seconds before the Ombudsman threat?" (sentiment hardens before
  volume rises — this is the early-warning surface)
Provenance behaviour:
  Hovering over any line segment shows: category, date, sentiment
  z-score, interaction count in that day. "Explore →" button opens
  Trend Explorer pre-filtered to that category and time window.
Empty state:
  "Sentiment tracking baseline period. 4 more weeks of data needed
  for the 8-week baseline to stabilise."
Refresh cadence: Daily-brief.
```

---

```
ZONE B6: "Strategy Signals" — bottom strip, full width
Component type: StrategyTileGrid (2-row grid of compact StrategyTiles)
What it shows:
  Six compact tiles in a 3×2 grid, each 1–2 data points + trend arrow:
    Tile 1 (S009): "GNSS / Barrier-Less mentions — [N] this week
                   [awareness / confusion / anxiety] split"
    Tile 2 (S040): "Campaign feedback — [campaign name], [N] inbound
                   refs, sentiment [+/-]"
    Tile 3 (S030): "Annual Pass FAQ gaps — top question: [text]"
    Tile 4 (S037): "Branch handoff friction — [N] 'visit branch'
                   reports this week"
    Tile 5 (S011): "Auto-recharge opt-in rate — [N%] this week
                   [stated intent, not verified]"
    Tile 6 (S032): "IO Quarterly Pack — last assembled [date] ·
                   [N] cases · [% readiness]"
  Each tile is a clickable card. Slower signals — none fire as alerts.
Signal IDs drawn from: FCX-FT-S009, FCX-FT-S040, FCX-FT-S030,
  FCX-FT-S037, FCX-FT-S011, FCX-FT-S032
Daily Friction moment(s) served:
  Stage 1 / HoB Friction #6 — "End of day: CEO note demanding a
  one-pager on GNSS resilience." (S009)
  Stage 1 / HoB Friction #5 — "18:00 PNO/IO response drafting."
  (S032 last-pack date is the readiness signal for HoB)
Provenance behaviour:
  Hovering over any tile shows ProvenancePill. Clicking opens
  DrillDownPanel or the IO Evidence Pack screen depending on tile.
Empty state per tile:
  "No signal this week." Tile displays in low-opacity state;
  never hidden, never removed from the grid.
Refresh cadence: Weekly for S009, S030, S037, S032. Campaign-
  cadence for S040. Hourly for S011.
```

---

```
ZONE B7: "Live Alert Band" — floating right margin (not a zone,
an overlay)
Component type: AlertToast (stacks vertically in right margin)
What it shows:
  When S003 (social flare-up) or S006 (Ombudsman threat) fires, an
  AlertToast appears pinned to the top-right of the Setu Intelligence
  screen. It does NOT interrupt the brief — it sits in the margin.
  Each toast: alert type icon (AlertTriangle in coral), one-line
  description ("Ombudsman threat — Trinetra, 08:14"), interaction
  count, "→ Review" button, dismiss X.
Signal IDs drawn from: FCX-FT-S003, FCX-FT-S006
Daily Friction moment(s) served:
  Stage 1 / HoB Friction #1 — "7:30am social media scan: is the
  tweet a pattern or a one-off?"
  Stage 1 / HoB Question #5 — "Is the Mumbai-Pune spike one plaza
  or one Trinetra shift?"
Provenance behaviour:
  Clicking "→ Review" opens DrillDownPanel with the contributing
  interactions and 3 snippets. From there, ≤2 clicks to Evidence Pack.
Empty state: No toast visible = no live alert. This is the expected
  production state most of the time.
Refresh cadence: Live (<5 min).
```

---

### B.3 Component specifications

---

```
COMPONENT: HeadlineBrief
Purpose: Delivers the HoB's most important signal of the morning in
  ≤60 seconds.
Anatomy:
  - Zone title: "Today's Headline — Top 3 growing this morning"
    (body, grey)
  - "Live · [N] min ago" stream indicator (micro, cyan, right-aligned)
  - 3 category cards side by side (or stacked on narrow viewport):
      - Category name (heading, white)
      - z-score badge (e.g. "3.2× baseline" — coral if >2×, amber
        if 1.5–2×, grey if below threshold but still shown)
      - Absolute count (display size, white)
      - Time window (micro, grey: "last 12 hours")
      - One verbatim de-identified customer phrase (body italic, cyan)
      - ProvenancePill (see ProvenancePill component)
      - "→ Drill down" chevron (micro, right-aligned)
Interaction:
  Clicking the card body opens DrillDownPanel. The card itself does
  not expand inline — the panel is the drill-down surface.
Data binding:
  Signal FCX-FT-S004. Fields: category_name, z_score, interaction_count,
  representative_snippet, confidence_band, model_version, time_window.
State variants:
  - normal: all 3 cards show different categories
  - anomaly-threshold: one or more cards has a coral badge (>2× baseline)
  - empty: single green card (see empty state spec)
  - loading: 3 shimmer cards with pulse animation
```

---

```
COMPONENT: ActionQueueRow
Purpose: One row in the action queue — a single signal with a named
  owner and a next action.
Anatomy:
  - Left: intent icon (lucide-react, 20px, tinted by signal type)
  - Main: title (body, white), sub-text (micro, grey: signal detail
    line in persona vocabulary), downstream owner label (micro,
    lavender: "→ Marketing" / "→ Corporate FASTag desk")
  - Right: count badge (heading, coral if above threshold, white if
    normal), ProvenancePill, "Review" chevron
  - Far right: [INFERRED] or [OBSERVED] badge (micro, amber/cyan)
Interaction:
  Clicking the row opens DrillDownPanel. Hovering shows ProvenancePill
  tooltip. If a row is reviewed, state transitions to "in-progress"
  (amber left border). "Mark resolved" transitions to "acknowledged"
  (grey, collapsed but visible for 24h).
Data binding:
  Signal IDs per row specified in zone. Fields: signal_id, count,
  impact_line, downstream_owner, confidence_band, time_window,
  provenance.
State variants:
  normal | urgent (coral left border, coral count badge) |
  in-progress (amber left border) | acknowledged (grey, collapsed)
```

---

```
COMPONENT: ProvenancePill
Purpose: Universal provenance display — every number on every screen
  must have this.
Anatomy:
  On the face (always visible, micro text):
    "[N] interactions · [window] · [High/Medium/Low]"
  On hover (tooltip, 3 lines):
    Line 1: "[N] interactions in trailing [window]"
    Line 2: "Confidence: [band] — [one-line reason]"
    Line 3: "Model: [classifier name v.version]"
Interaction:
  Hover: tooltip appears. Click: opens DrillDownPanel.
Data binding:
  interaction_count, time_window, confidence_band, confidence_reason,
  model_version_stamp (all from SignalEvent entity per Stage 2 §D.1).
State variants:
  high (cyan text), medium (amber text), low (grey text + warning icon)
```

---

```
COMPONENT: ChargebackIndicator
Purpose: Surfaces the chargeback-eligible dispute trend alongside
  the mandatory partial-signal boundary label.
Anatomy:
  Two stacked sub-tiles within one card:
  Sub-tile A (S013):
    - Label: "Dispute potential — conversation-side only"
    - Number: weekly chargeback-eligible interaction count
    - Sparkline: 12-week weekly Recharts BarChart (mini)
    - [INFERRED] badge (amber, micro)
    - Boundary statement (micro, grey): "Full chargeback ratio
      requires NPCI dispute feed — see Stage 2 §F"
  Sub-tile B (S001):
    - Label: "Churn-intent mentions (30 days)"
    - Number: trailing 30-day count with WoW arrow
    - ProvenancePill
Interaction:
  Each sub-tile clickable → DrillDownPanel.
Data binding:
  S013: weekly_count, sparkline_data, confidence_band
  S001: count_30d, wow_delta, confidence_band
State variants:
  partial-signal (amber outline on S013 sub-tile, permanent)
  above-threshold (coral badge on S001 if ≥1.5× baseline)
```

---

```
COMPONENT: ChannelQualityBar
Purpose: Weekly cohort-level view of Day-1 complaint density by
  issuance channel.
Anatomy:
  - Zone title: "Day-1 Issuance Quality — complaints / 1,000 tags
    in first 30 days"
  - Recharts HorizontalBarChart
  - 4 bars: OEM-fitted / Dealer / E-com / Branch
  - Dotted reference line: cohort median
  - Bars exceeding median ×1.4 coloured coral; others lavender
  - Below chart: "Updated weekly · [date]" in micro
Interaction:
  Hover: shows ProvenancePill per bar (cohort size, confidence).
  Click: DrillDownPanel filtered to that channel.
Data binding:
  S007: channel_name, complaint_rate_per_1000, cohort_median,
  cohort_size, confidence_band.
State variants:
  all-normal (all lavender) | one-flagged (coral bar) |
  multiple-flagged | loading (shimmer) | empty
```

---

```
COMPONENT: SentimentDriftChart
Purpose: Early-warning surface showing sentiment hardening before
  volume rises.
Anatomy:
  - Zone title: "Sentiment drift — vs. 8-week baseline"
  - Recharts LineChart, 30-day x-axis, relative-to-baseline y-axis
  - Shaded band: ±1σ normal zone (lavender opacity)
  - Up to 3 lines, named in persona vocabulary
  - Coral line when a category sustains below -1σ for 5+ days
  - "Explore →" button (small, top-right of chart)
Interaction:
  Line hover: shows category + date + sentiment z-score +
  interaction count. "Explore →" opens Trend Explorer pre-filtered.
Data binding:
  S034: category, sentiment_by_day, baseline_band, z_score_by_day.
State variants:
  normal | hardening-alert (coral line) | baseline-building
  (not enough data — shows amber label instead of chart)
```

---

```
COMPONENT: StrategyTile
Purpose: Compact slow-signal card for HoB strategic signals.
Anatomy:
  - Icon (lucide-react, 16px)
  - Signal label (micro, grey)
  - Primary metric (body, white)
  - Trend arrow (ArrowUpRight / ArrowDownRight, cyan/coral)
  - Boundary label where applicable (micro, amber)
  - ProvenancePill (micro, on face)
Interaction:
  Click: DrillDownPanel or full Evidence Pack screen (per signal).
Data binding:
  Per tile — see Zone B6 data mapping.
State variants:
  normal | above-threshold (coral border) | no-data (opacity 50%,
  "No signal this week") | boundary (amber label)
```

---

```
COMPONENT: AlertToast
Purpose: Non-interrupting live alert overlay for HoB and COH.
Anatomy:
  - AlertTriangle icon (coral, 16px)
  - Type label (micro, coral: "Ombudsman threat" / "Social flare-up" /
    "Queue spike" / "Recharge failure cluster")
  - One-line description (body, white)
  - Interaction count (micro, grey)
  - "→ Review" button (small, purple)
  - Dismiss X (micro, grey)
Interaction:
  "→ Review": opens DrillDownPanel. Dismiss: collapses to a minimal
  badge at the bottom of the right margin (alert history). Badge
  count stays visible.
Data binding:
  S003, S006, S018, S021, S028: signal_id, severity, description,
  interaction_count, timestamp.
State variants:
  live (coral) | acknowledged (grey) | dismissed (badge only)
```

---

### B.4 The 60-second test

8:30am Monday. HoB opens Setu Intelligence. **Zone B1** resolves first: the HeadlineBrief shows three cards. Top card: "AVC misread queue — 3.2× baseline · 94 calls · last 12 hours." A verbatim phrase in cyan italic: *"They charged me for two axles. My car is a Maruti."* HoB knows before the tea cools: this is not noise. Second card: "Blacklist false positive — 2.1× · 61 calls." Third card: "Annual recharge failure — 1.7× · 48 calls." Below, **Zone B2** Action Queue surfaces: "Annual Pass misses — 37 calls not prompted yesterday · → Marketing." HoB recognises both agenda items for the 10am huddle. In the right margin, **Zone B3** shows the dispute-potential sparkline is flat this week; no chargeback emergency. Provenance on the first card: "94 interactions · 12h · High confidence (z-score 3.2, 240-interaction 8-week baseline, ASR confidence ≥0.85) · Classifier v1.4.2." One click to the three customer phrases. Total time: 45 seconds.

---

## SECTION C — PRIMARY SCREEN: CUSTOMER OPERATIONS HEAD (COH)

### C.1 Screen name and purpose

**"Operations Console"** — a real-time operational console that tells COH what needs action this shift, in what order, with the evidence to act. It feels like a floor supervisor's board, not an executive brief.

### C.2 Layout zones

---

```
ZONE C1: "Shift Status Bar" — full-width top strip
Component type: ShiftStatusBar
What it shows:
  A persistent horizontal bar fixed at the top of the console.
  Left section: Active BPO status — three vendor pills side by side
    (Trinetra Hyderabad · Anandam Coimbatore · DigitalReach Bengaluru).
    Each pill shows: current shift (morning/afternoon/night), queue
    depth vs. baseline ("1.4× baseline" in amber), and a health
    indicator dot (green/amber/coral).
  Center section: Live alert badges — one badge per live signal type
    currently active: 🔴 S006 (Ombudsman threats), 🟠 S021 (queue
    spike), 🟠 S028 (recharge failure), 🔴 S018 (Saksham conduct),
    🔴 S003 (social flare). Number inside each badge = count of live
    firings this shift.
  Right section: Stream indicator ("Live · [N] min ago") and current
    time-of-day (relevant for shift context).
Signal IDs drawn from: FCX-FT-S003, FCX-FT-S006, FCX-FT-S018,
  FCX-FT-S021, FCX-FT-S028 (all live / <5 min)
Daily Friction moment(s) served:
  Stage 1 / COH Friction #1 — "8:00am queue handover from Trinetra
  night shift: which categories spiked, what was the overnight
  shift handling?"
Provenance behaviour:
  Clicking any badge opens the Live Alerts full-screen surface
  pre-filtered to that signal. Each vendor pill click opens
  DrillDownPanel for that site's current shift.
Empty state:
  All pills green, no alert badges. "All shifts within baseline" —
  the best state.
Refresh cadence: Live (<5 min).
```

---

```
ZONE C2: "OC 005 Evidence Queue" — left side, top, ~55% width
Component type: DisputeEvidenceQueue
What it shows:
  The most operationally urgent thing on COH's console: dispute-bound
  calls from the current and prior shift with incomplete evidence packs.
  Each row (DisputeEvidenceRow) shows:
    - Time since call ended (bold, coral if >90 min old)
    - 5-element evidence checklist: Plaza ✓/✗, Txn ID ✓/✗, Vehicle
      class ✓/✗, Customer statement ✓/✗, Agent confirmation ✓/✗
      (green tick / coral X / amber partial)
    - BPO vendor + shift label (micro)
    - "Complete Now →" button (coral if urgent, purple if normal)
  Header shows: "[N] dispute-bound calls · [N] complete · [N] at risk
  of code 5225 rejection" — all three counts in distinct colours.
  Zone title: "OC 005 Evidence Pack Queue — chargeback win rate"
  A single boundary line (micro, grey): "Fluid CX captures evidence
  completeness in the call. Dispute filing and NPCI outcome are in
  the dispute system."
Signal IDs drawn from: FCX-FT-S016
Daily Friction moment(s) served:
  Stage 1 / COH Friction #3 — "1:00pm dispute review with the
  NPCI desk: why are my chargebacks getting rejected under code 5225?"
  COH Question #4 — "Which agent cohorts are filing evidence-thin
  disputes, and can I see the actual call where the evidence wasn't
  captured?"
Provenance behaviour:
  Each row has a ProvenancePill. "Complete Now →" button opens the
  DrillDownPanel showing the missing-evidence gaps with the verbatim
  transcript segment and the recommended phrasing.
Empty state:
  Green banner: "All dispute-bound calls have complete evidence packs
  this shift." This is a genuine operational achievement.
Refresh cadence: Near-real-time (<30 min).
```

---

```
ZONE C3: "IO Readiness Queue — Cases at risk" — right side, top,
~45% width
Component type: IOReadinessQueue
What it shows:
  Open and partially-resolved cases sorted by ascending readiness
  score (lowest first = highest risk). Each IOReadinessRow:
    - Case ref (masked: "Case ···-4421")
    - Category in persona vocabulary ("AVC misread", "Recharge
      failure", "Blacklist false positive")
    - Readiness score (0–100) as a progress bar:
        0–49 = coral, 50–74 = amber, 75–100 = green
    - Days since case opened (micro)
    - Days until IO review (bold, coral if <7 days)
    - Gap indicator: "Missing: [list of missing elements]" in micro
    - "Assemble Pack →" button
  Header: "IO Readiness — [N] cases below 70% · 30 June deadline"
  A boundary line: "Fluid CX assembles the evidence record. The IO
  desk makes the finding."
Signal IDs drawn from: FCX-FT-S024, FCX-FT-S036, FCX-FT-S029
Daily Friction moment(s) served:
  Stage 1 / COH Friction #4 — "3:30pm Salesforce backlog: which
  cases will become IO findings and which have evidence gaps I can
  close?"
  COH Question #8 — "Of the partially-resolved cases the IO desk
  will sample, how many have a complete evidence trail today?"
Provenance behaviour:
  Readiness score hover shows the element-by-element breakdown.
  "Assemble Pack →" triggers auto-assembly (S036) and navigates
  to the IO Evidence Pack screen with the newly assembled pack.
Empty state:
  "All open cases have evidence readiness ≥70%." Green tile. Valid
  operational state.
Refresh cadence: Daily-brief (queue refreshes on Salesforce
  case event receipt).
```

---

```
ZONE C4: "BPO Shift Heatmap" — left, middle, ~60% width
Component type: BPOHeatmap
What it shows:
  A 3×3 grid (rows: Trinetra Hyderabad / Anandam Coimbatore /
  DigitalReach Bengaluru; columns: morning / afternoon / night).
  Each cell shows a composite score derived from three sub-scores:
    - Repeat-call rate vs. baseline (S012)
    - FCR proxy (S031)
    - OC 005 completeness rate (S016)
  Cell colour: green (all within baseline), amber (one metric
  flagged), coral (two or more metrics flagged).
  The "Trinetra · Afternoon" cell is named explicitly and highlighted
  when it crosses the threshold — this is COH's named test from Stage 1.
  Below the grid: "Cohort-level view only. Agent-level detail is
  visible to BPO supervisors in coaching sessions."
  Anti-pattern guard: No agent names, no agent-level scores on
  this surface.
Signal IDs drawn from: FCX-FT-S017, FCX-FT-S035
Daily Friction moment(s) served:
  Stage 1 / COH Friction #2 — "10:30am Anandam floor walk:
  the supervisor says 'lots of double-deduction today' — is it
  accurate?"
  COH Question #2 — "Trinetra afternoon handles 40% of FASTag
  voice. Are they driving the repeat-call rate?"
Provenance behaviour:
  Hover on any cell: shows the three sub-scores with their individual
  baselines and z-scores. Click: DrillDownPanel filtered to that
  vendor × shift cohort.
Empty state:
  All cells green. "All BPO cohorts within 30-day baseline."
Refresh cadence: Daily-brief.
```

---

```
ZONE C5: "Repeat-call Rate — FCR by category" — right, middle,
~40% width
Component type: FCRDriftPanel
What it shows:
  A ranked list of the top 5 complaint categories by repeat-call
  rate this week. Each row:
    - Category name (persona vocabulary: "AVC misread", "Recharge
      not reflected", "KYV blacklist", etc.)
    - Repeat-call rate % (body, white)
    - WoW trend arrow (coral if worse, green if better)
    - "Promise-delivery gap" indicator badge: if S014 has fired on
      this category (i.e. agents are promising something they can't
      deliver), the badge shows in amber: "Agent promise gap · [N]"
  Header: "Repeat-call rate — FCR by category"
  A ProvenancePill on the header: "14-day callback window ·
  conversation-side FCR proxy"
Signal IDs drawn from: FCX-FT-S012, FCX-FT-S014, FCX-FT-S031
Daily Friction moment(s) served:
  Stage 1 / COH Friction (all): "What are agents promising on
  the first call that they can't actually deliver?"
  COH Question #1 — "FCR looks fine on paper but customers keep
  calling back within 14 days."
Provenance behaviour:
  Hover on promise-gap badge: shows the promise snippet vs. the
  outcome gap. Click: DrillDownPanel showing the side-by-side
  first-call / callback interaction pair.
Empty state:
  "No repeat-call anomalies this week. FCR tracking at baseline."
Refresh cadence: Daily-brief.
```

---

```
ZONE C6: "Compliance Watch Strip" — bottom-left, full width under
C4/C5, horizontal row
Component type: ComplianceWatchStrip (4 ComplianceTiles side by side)
What it shows:
  4 tiles, each a distinct compliance signal:
    Tile 1 (S015): "Trilingual rule — [N%] compliance today"
      Target: ≥85% per shift. Below target: coral.
    Tile 2 (S020): "Annual Pass eligibility — [N] mis-disclosures
      flagged today"
      Above 0: amber immediately; above 3: coral.
    Tile 3 (S038): "KYV root-cause check — [N%] adherence on
      blacklist calls"
      Below 80%: coral.
    Tile 4 (S018): "Saksham conduct — [N] calls reviewed ·
      [N] flags today"
      Any flag: coral.
  Below the strip: "These are [OBSERVED] signals — present/absent
  measured directly in the conversation."
Signal IDs drawn from: FCX-FT-S015, FCX-FT-S018, FCX-FT-S020,
  FCX-FT-S038
Daily Friction moment(s) served:
  Stage 1 / COH Friction #6 — "Weekly Saksham Recovery conduct
  review: the other 99% of recovery calls — whether any crossed
  the conduct line."
  COH Question #6 — "Is Saksham staying within RBI conduct
  expectations on every call?"
  COH Question #7 — "Are agents correctly disclosing Annual Pass
  is private non-commercial only?"
Provenance behaviour:
  Hover: ProvenancePill. Click: opens Compliance Watch full surface.
  Each compliance tile carries [OBSERVED] badge (cyan).
Empty state per tile:
  "No violations detected today." Green check. This is the target
  state.
Refresh cadence: Daily-brief; Saksham tile near-real-time (<30 min).
```

---

```
ZONE C7: "Operational Signals" — bottom strip, full width
Component type: OperationalSignalGrid (4 compact tiles)
What it shows:
  Four compact signal tiles for slower/weekly operational signals:
    Tile 1 (S019): "Deflectable calls — [N%] of voice volume
      avoidable via IVR today"
    Tile 2 (S025): "1033 forwarded — top plaza: [name] · [N] this
      week"
    Tile 3 (S033): "OVOT repeat-call wave — [N] 'stopped working'
      calls this week"
    Tile 4 (S026/S027): "Used-vehicle + negative-balance clusters
      — [N] this week"
Signal IDs drawn from: FCX-FT-S019, FCX-FT-S025, FCX-FT-S026,
  FCX-FT-S027, FCX-FT-S033
Daily Friction moment(s) served:
  Stage 1 / COH Friction #5 — "6:00pm DigitalReach shift swap:
  is the @-mention clustering into a pattern?" (S025 shows
  1033 forwarded volume as the leading indicator)
Provenance behaviour:
  Hover: ProvenancePill. Click: DrillDownPanel.
Empty state per tile:
  "Within baseline this week." Low-opacity tile.
Refresh cadence: Weekly (daily for S019 given high volume).
```

---

### C.3 Component specifications

---

```
COMPONENT: ShiftStatusBar
Purpose: COH's live floor-situation read, always visible at screen top.
Anatomy:
  - Left: Three vendor pills [Trinetra Hyderabad · AM shift · ●1.4×]
    [Anandam Coimbatore · AM shift · ●0.9×] [DigitalReach · AM · ●1.0×]
    Each pill: vendor name (micro), shift label (micro), queue
    multiplier (body, colour-coded), health dot (green/amber/coral)
  - Center: Alert badge row — per signal type
    [S006 × 1 🔴] [S021 × 0 ●] [S028 × 1 🟠] etc.
    Badges show 0 when no active alerts (visible but muted)
  - Right: "Live · 3 min ago" (micro, cyan)
Interaction:
  Vendor pill click → DrillDownPanel for that site × shift.
  Badge click → Live Alerts screen filtered to that signal.
Data binding:
  S003, S006, S018, S021, S028: live_count, vendor, shift,
  queue_multiplier, signal_type.
State variants:
  all-clear (all green) | watchful (one amber) | incident (coral)
```

---

```
COMPONENT: DisputeEvidenceRow
Purpose: One row in the OC 005 Evidence Queue — one dispute-bound
  call with evidence completeness.
Anatomy:
  - Time elapsed since call (body bold, coral if >90 min)
  - 5-element mini-checklist: plaza ✓/✗ · txn-ID ✓/✗ · class ✓/✗ ·
    customer-statement ✓/✗ · agent-confirmation ✓/✗
    (CheckCircle green / XCircle coral / MinusCircle amber)
  - BPO vendor + shift (micro, grey)
  - "Complete Now →" button (coral if urgency tier 1, purple if tier 2)
Interaction:
  "Complete Now →" opens DrillDownPanel showing: the missing element,
  the verbatim transcript segment, and the recommended agent phrasing
  for each missing element. This is a coaching surface, not
  surveillance.
Data binding:
  S016: interaction_id, time_elapsed, evidence_elements (5-element
  array with present/partial/missing), bpo_site_id, shift_id,
  urgency_tier.
State variants:
  urgent (coral left border) | normal | complete (green, collapsed) |
  loading (shimmer)
```

---

```
COMPONENT: IOReadinessRow
Purpose: One row in the IO Readiness Queue — one case with its
  readiness score and gap list.
Anatomy:
  - Case ref masked (micro, grey: "Case ···-4421")
  - Category in persona vocabulary (body, white)
  - Readiness progress bar (0–100, coral/amber/green per range)
  - Days open + days to IO review (micro, coral if <7 days)
  - Gap list (micro, amber): "Missing: customer statement, outcome"
  - "Assemble Pack →" button (purple)
Interaction:
  "Assemble Pack →" triggers S036 auto-assembly and navigates to
  IO Evidence Pack screen. Row updates to "assembling..." state.
Data binding:
  S024, S036, S029: case_id, category, readiness_score,
  days_open, days_to_io, missing_elements, sla_status.
State variants:
  at-risk (coral) | watchful (amber) | healthy (green) |
  assembling (spinner) | pack-ready (green check)
```

---

```
COMPONENT: BPOHeatmap
Purpose: Shift-level BPO performance grid — cohort view only,
  never agent-level.
Anatomy:
  - 3×3 grid: rows = vendors, columns = shifts
  - Cell content: composite score label ("Within baseline" /
    "1 metric flagged" / "Review needed") + colour fill
  - Row labels: "Trinetra · Hyderabad", "Anandam · Coimbatore",
    "DigitalReach · Bengaluru"
  - Column labels: "Morning", "Afternoon", "Night"
  - Below grid: boundary note: "Cohort-level view. Agent coaching
    visible to BPO supervisors only."
Interaction:
  Cell hover: tooltip with 3 sub-scores (repeat-call, FCR, OC 005
  completeness) + baselines + z-scores.
  Cell click: DrillDownPanel filtered to that vendor × shift cohort.
Data binding:
  S017, S035: vendor, shift, repeat_call_zscore, fcr_zscore,
  evidence_completeness_rate, composite_status.
State variants:
  all-green | one-amber | one-coral | multiple-flagged |
  trinetra-afternoon-highlight (named cell emphasis when S035 fires)
```

---

```
COMPONENT: FCRDriftPanel
Purpose: Repeat-call and FCR tracking by category for COH.
Anatomy:
  - Ranked list, 5 rows
  - Per row: category name, repeat-call %, WoW arrow, promise-gap badge
  - "Promise-delivery gap" badge (amber, micro): fires when S014 has
    identified an agent-promise pattern in this category this week
  - ProvenancePill on the header (count, 14-day window, FCR-proxy
    definition note)
Interaction:
  Row click: DrillDownPanel with promise-vs-delivery side-by-side
  transcript view. "Promise gap" badge click: directly opens the
  coaching insight for that category.
Data binding:
  S012, S014, S031: category, repeat_call_rate, wow_delta,
  promise_gap_count.
State variants:
  normal | promise-gap-detected (amber badge) | fcr-drop (coral row)
```

---

```
COMPONENT: ComplianceTile
Purpose: One compliance signal in the Compliance Watch Strip.
Anatomy:
  - Icon (lucide-react: ShieldCheck for pass, ShieldAlert for fail)
  - Compliance type label (micro, grey)
  - Rate or count (heading, white)
  - vs. target (micro, grey: "Target: ≥85%")
  - WoW indicator arrow
  - [OBSERVED] badge (micro, cyan) — all compliance signals are OBSERVED
Interaction:
  Click: opens Compliance Watch full surface filtered to this signal.
Data binding:
  Per signal: compliance_rate, target, wow_delta, signal_id,
  violation_count.
State variants:
  pass (green icon + white) | warning (amber) | violation (coral) |
  no-data (grey, opacity 50%)
```

---

### C.4 The 60-second test

9:15am Monday, after the ops huddle. COH opens Operations Console. The **ShiftStatusBar** reads: "Trinetra · Afternoon · ●1.0×" — morning shift still running, afternoon started 15 minutes ago. One red badge: `S006 × 2` — two Ombudsman threats this morning. COH notes but does not interrupt the shift. **Zone C2** (OC 005 Queue) shows 7 dispute-bound calls from the last 2 hours with incomplete evidence packs — 3 in coral (>90 min old, approaching the NPCI upload window). COH clicks the top row: the DrillDownPanel opens, shows the transcript, and highlights: "Plaza name not captured — agent confirmed the deduction but did not name the plaza. Suggested phrase: 'Can you confirm the plaza name on your toll slip?'" COH copies the phrase and sends it to the Trinetra supervisor's WhatsApp. **Zone C3** shows 4 cases below 70% readiness, oldest 18 days. Two have "IO review in 6 days" in coral. COH clicks "Assemble Pack →" on the oldest. By second 60, COH has actioned the two most urgent items, with evidence, without a single manual search.

---

## SECTION D — SHARED SURFACES

### D.1 Evidence Pack Viewer

**Screen name:** IO Evidence Pack — also accessible from IO Evidence Pack in left rail.

**Primary persona:** COH (assembly + gap-closure), IO office (review), HoB (read-only, redacted).

---

```
ZONE D1-A: Pack Header — full width, fixed top
Component type: EvidencePackHeader
What it shows:
  - Pack ID + assembled timestamp
  - Case ref (masked + Salesforce case ID)
  - Tag ID (last 4 chars visible: "···-9A3F")
  - Date range of interactions in pack
  - Pack completeness % (progress bar, colour-coded)
  - Chain-of-custody stamp (micro: "Assembled by Fluid CX v2.1.4 ·
    [timestamp]")
  - [IO-Defensible] badge (cyan) when completeness ≥90%
  - Top-right: "Export PDF" button (Download icon), "Flag for IO desk"
    button (ShieldCheck icon)
  - Access log summary: "Last accessed by [role] at [timestamp]"
```

---

```
ZONE D1-B: Interactions panel — left ~40% width
  - Sortable list of all interactions linked to this case
  - Each row: channel icon (Phone/MessageSquare/Mail/Globe),
    timestamp, duration (voice), sentiment badge (cyan/amber/coral),
    agent BPO site (micro, grey)
  - Clicking a row loads the transcript in D1-C
  - Signal events on this interaction shown as small badges
    (e.g. "S006 fired" in coral)
```

---

```
ZONE D1-C: Transcript pane — center ~35% width
  - Full transcript of selected interaction
  - Speaker labels: "Agent" / "Customer" (no agent name on default
    view; visible to supervisor circle + IO office only)
  - Highlighted spans for:
    - Evidence elements captured (green highlight)
    - Evidence elements missing (coral underline)
    - Signal trigger phrases (amber highlight)
    - Compliance check outcomes (colour-coded per check type)
  - PII redaction toggle: "Redacted [default] | Reveal [role-gated]"
  - ASR confidence indicator (voice only): coloured line alongside
    each turn (cyan = high, amber = medium, grey = low)
```

---

```
ZONE D1-D: Evidence rail — right ~25% width
  - Signal Events section: list of all signals that fired on this
    case, each with signal_id, fired_ts, confidence_band,
    model_version_stamp
  - Compliance Checks section: 7 check types with pass/partial/fail
    status and evidence snippet
  - CRM Linkage: Salesforce case ID, status, SLA target vs. actual
  - NPCI Dispute Linkage (if applicable): dispute_id, reason_code,
    filing status (with boundary note: "Dispute outcome in NPCI system")
  - IO Case Linkage: io_case_id if escalated
```

---

### D.2 Compliance Watch

**Primary persona:** COH (action), HoB (read-only via left rail).

**Layout:** Three panels: Compliance Heatmap | Active Breach Queue | RB-IOS Clock.

```
Panel 1: Compliance Heatmap
  5 compliance types (rows: trilingual / TAT promise / recovery
  conduct / Annual Pass eligibility / KYV check) × (BPO site × shift)
  grid. Cell values: compliance rate %. Colour coding per target.
  Signals: S015, S018, S020, S029, S038.

Panel 2: Active Breach Queue
  Live breaches that fired this shift. Each row: compliance type,
  time, call ID (masked), BPO site + shift, recommended action.
  "Notify supervisor" button routes a coaching note (not surveillance).

Panel 3: RB-IOS 30-day Clock
  A calendar/timeline showing open complaints and their 30-day
  reply window deadline. Each case: case ref, days remaining,
  current readiness score (from S024). Cases <7 days in coral.
  Signals: S024, S029, S036.
```

---

### D.3 Trend Explorer

**Accessible from:** Any chart tile's "Explore →" button. Also from Trend Explorer link if added to left rail in Stage 5/7.

```
Layout:
  Top bar: Time-window switcher (24h | 7d | 30d | 90d pill tabs),
    Signal selector (dropdown: all 39 in-scope signals grouped by
    persona), Dimension selector (Plaza / BPO Site / Channel /
    Language / Intent / Issuance Channel).

  Main chart area: Recharts LineChart. Primary line = selected signal
    over time. Shaded band = ±1σ baseline. Secondary lines = dimension
    breakdown (up to 3 dimensions overlaid).

  Bottom: Provenance summary bar: "Showing [N] interactions ·
    [signal_id] · [confidence_band] · [model_version]"
    + "Export data" button.

Interaction:
  Clicking any data point → DrillDownPanel for interactions
  contributing to that data point.
  Changing time window → chart re-renders; baseline band recalculates.
  Adding dimension → new line appears with legend.
```

---

### D.4 Drill-Down Panel

**Triggered by:** Clicking any number, chart line, heatmap cell, or "→ Review" button anywhere in the app. Opens as a right-side slide panel (320px wide, full height, overlays main content without replacing it).

```
Panel anatomy (top to bottom):
  Header:
    - Signal ID + name (micro, grey)
    - ProvenancePill (count + window + confidence band)
    - Close X

  3 Representative Snippets (ALWAYS AT TOP):
    Three interaction cards, each showing:
    - Channel icon + timestamp
    - Verbatim customer/agent exchange (PII-redacted)
    - Why it matched (signal match highlight in amber)
    One snippet per: different plaza / different shift / different
    sentiment level where available.

  Interaction list:
    Scrollable list of all contributing interactions.
    Each row: timestamp, channel icon, sentiment badge, BPO site,
    agent (masked), duration.
    Click any row → transcript opens in-panel (replaces the snippet
    section; back button returns to list).

  Footer:
    "Open Evidence Pack →" button (navigates to D.1, pre-loaded
    with contributing interactions).
    "Explore in Trend Explorer →" button.
    Interaction count + model version stamp (micro, grey).

Interaction: ≤2 clicks from any signal to a full Evidence Pack.
  Click 1: opens DrillDownPanel.
  Click 2: "Open Evidence Pack →" opens IO Evidence Pack viewer.
```

---

## SECTION E — COMPONENT VOCABULARY

Exactly 17 distinct UI components. Each labelled with screen usage, state variants, and implementation type.

| # | Component | Used on | State variants | Type |
|---|---|---|---|---|
| 1 | `HeadlineBrief` | HoB primary | normal / anomaly / empty / loading | Custom |
| 2 | `ActionQueueRow` | HoB + COH | normal / urgent / in-progress / acknowledged | Custom |
| 3 | `ProvenancePill` | All screens (universal) | high / medium / low | Custom |
| 4 | `ChargebackIndicator` | HoB | partial-signal / above-threshold | Custom |
| 5 | `ChannelQualityBar` | HoB | normal / one-flagged / multiple-flagged | Recharts wrapper |
| 6 | `SentimentDriftChart` | HoB + Trend Explorer | normal / hardening / baseline-building | Recharts LineChart |
| 7 | `StrategyTile` | HoB bottom strip | normal / above-threshold / no-data / boundary | Custom |
| 8 | `AlertToast` | HoB + COH (overlay) | live / acknowledged / dismissed | Custom |
| 9 | `ShiftStatusBar` | COH primary (fixed top) | all-clear / watchful / incident | Custom |
| 10 | `DisputeEvidenceRow` | COH OC 005 Queue | urgent / normal / complete / loading | Custom |
| 11 | `IOReadinessRow` | COH IO Queue + Evidence Pack | at-risk / watchful / healthy / assembling | Custom |
| 12 | `BPOHeatmap` | COH + Compliance Watch | all-green / one-amber / one-coral / multiple | Recharts grid |
| 13 | `FCRDriftPanel` | COH | normal / promise-gap / fcr-drop | Custom |
| 14 | `ComplianceTile` | COH Compliance Strip | pass / warning / violation / no-data | Custom |
| 15 | `EvidencePackHeader` | IO Evidence Pack | complete / partial / assembling | Custom |
| 16 | `TranscriptPane` | Evidence Pack + DrillDown | redacted / revealed / highlighted | Custom |
| 17 | `DrillDownPanel` | Universal (slide panel) | loading / loaded / empty | Custom |

*`StrategyTile` and `ComplianceTile` share structural DNA (icon + metric + trend arrow) but are distinct components because their data bindings and interaction behaviours diverge meaningfully.*

---

## SECTION F — VISUAL LANGUAGE

### Colour palette

All Tailwind-compatible hex values. Custom colours registered in Stage 7's Tailwind config via `extend.colors`.

| Role | Hex | Tailwind key | Used for |
|---|---|---|---|
| Primary purple | `#7B2FF0` | `brand-purple` | Primary CTAs, active nav items, persona badge, HoB accent lines |
| Electric cyan | `#00D4FF` | `brand-cyan` | Live stream indicators, [OBSERVED] badges, trend lines at baseline, confidence-high state |
| Coral | `#FF7043` | `brand-coral` | Alerts, urgent action rows, missing evidence elements, above-threshold badges |
| Near-black canvas | `#0D1117` | `brand-canvas` | Primary background on all screens |
| Lavender | `#EEEAF4` | `brand-lavender` | Tile/card backgrounds on dark canvas, readable text on light export |
| Dark navy | `#1A2035` | `brand-navy` | Secondary card backgrounds (between canvas and lavender) [INFERRED] |
| Slate | `#2D3748` | `brand-slate` | Borders, dividers, inactive nav items |
| Success green | `#48BB78` | `brand-green` | Pass/complete states, evidence elements present, all-clear indicators |
| Amber | `#ECC94B` | `brand-amber` | Partial/warning states, medium confidence, [INFERRED] badges, promise-gap |

### Typography

Font family: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif` — available via Google Fonts CDN in Stage 7, falls back to system stack cleanly.

| Scale | Size | Line height | Weight | Tailwind classes | Used for |
|---|---|---|---|---|---|
| Display | 24px | 32px | 700 | `text-2xl font-bold` | Screen titles, headline numbers (z-scores, interaction counts) |
| Heading | 16px | 24px | 600 | `text-base font-semibold` | Zone titles, category names, component headers |
| Body | 14px | 20px | 400 | `text-sm font-normal` | Persona language, signal descriptions, tile content |
| Micro | 12px | 16px | 400 | `text-xs font-normal` | Timestamps, model stamps, metadata, boundary notes, [INFERRED] / [OBSERVED] badges |

*Persona vocabulary must always be set in Body (14px) at minimum — never in micro. The Head of Business reading "AVC misread queue — 3.2× baseline" at 12px is wrong; at 14px it's readable under pressure.*

### Spacing (8px grid)

| Token | Value | Tailwind | Used for |
|---|---|---|---|
| Component internal padding | 12px | `p-3` | Compact tiles (StrategyTile, ComplianceTile) |
| Standard component padding | 16px | `p-4` | Action queue rows, heatmap cells |
| Zone gutter | 16px | `gap-4` | Between zones on any screen |
| Section margin | 24px | `p-6` | Main content area left/right/top margin |
| Left rail width | 240px | `w-60` | Full persona names visible [INFERRED] |
| Left rail collapsed | 60px | `w-15` | Icon-only rail if viewport narrow [INFERRED] |
| DrillDown panel width | 320px | `w-80` | Slides in from right, does not collapse main |

### Icons (lucide-react, all at 16px or 20px)

| Icon | lucide-react name | Used for |
|---|---|---|
| Setu Intelligence nav | `Sparkles` | HoB primary screen |
| Operations Console nav | `Activity` | COH primary screen |
| Live Alerts nav | `Bell` | Alerts surface |
| Plaza Heatmap nav | `MapPin` | Plaza heatmap surface |
| IO Evidence Pack nav | `ShieldCheck` | IO Evidence Pack screen |
| Alert / urgent | `AlertTriangle` | Coral alert states |
| Complete / pass | `CheckCircle` | Green complete states |
| Missing / fail | `XCircle` | Coral missing-evidence states |
| Partial | `MinusCircle` | Amber partial states |
| Drill-down indicator | `ChevronRight` | Rows with drill-down |
| Trend up (adverse) | `TrendingUp` | Rising complaint volume, coral |
| Trend down (good) | `TrendingDown` | Improving rate, green |
| Voice interaction | `Phone` | Channel icons in interaction lists |
| Chat interaction | `MessageSquare` | Channel icons |
| Email interaction | `Mail` | Channel icons |
| Export | `Download` | Export PDF / Brief buttons |
| Ageing / clock | `Clock` | Days-elapsed indicators |
| Social | `Share2` | Social channel icon |

### Dark mode default

The near-black canvas (`#0D1117`) is the default and only mode for all five primary/shared screens. The Evidence Pack viewer offers a "Light view" toggle (lavender `#EEEAF4` background) specifically for the PDF export pathway — a judge or regulator reviewing a printed Evidence Pack reads better on white. The toggle does not persist; closing the pack resets to dark.

---

## SECTION G — INTERACTION PATTERNS

### Drill-down

**Trigger:** Clicking any number, any chart data point, any ActionQueueRow, any heatmap cell, any StrategyTile, any ComplianceTile. There are no non-clickable numbers in this application.

**Behaviour:** The DrillDownPanel slides in from the right edge of the screen (320px wide, full height). The main content area shifts left to accommodate — it does not scroll behind the panel. The panel loads: signal header → ProvenancePill → 3 snippets (always) → scrollable interaction list. Each interaction in the list is clickable and opens the transcript inline within the panel.

**Path to Evidence Pack:** "Open Evidence Pack →" button at the bottom of the DrillDownPanel is always present. Clicking it navigates to the IO Evidence Pack screen and pre-loads with the contributing interactions. This is click 1 → click 2. Maximum 2 clicks from any signal number to a full Evidence Pack. No exceptions.

**Close:** X in the DrillDownPanel header, or clicking outside the panel.

### Time-window switching

**Where available:** SentimentDriftChart (HoB B5), ChargebackIndicator (HoB B3 sparkline), BPOHeatmap (COH C4), Trend Explorer (D.3), any chart tile with "Explore →".

**Control:** Pill-tab switcher reading `24h | 7d | 30d | 90d`. Active pill has white background, inactive pills have slate border.

**Defaults:**
- HoB Setu Intelligence: HeadlineBrief always 12h (fixed — this is the morning-brief window). SentimentDriftChart defaults to 30d. ChargebackIndicator defaults to 7d.
- COH Operations Console: All signals default to current shift (8h context). BPO Heatmap defaults to 7d for comparison.
- Trend Explorer: Defaults to 7d.

**Behaviour on switch:** Chart re-renders with the new time window. Baseline band recalculates. ProvenancePill interaction count updates. Loading shimmer on the chart area during re-render (500ms simulated in prototype).

### Persona switching

**Location:** Top of the left rail — the persona badge `RV · HoB` (or `SC · COH`).

**Trigger:** Clicking the badge.

**Behaviour:** An inline dropdown (not a modal) shows two options: `Head of Business` and `Customer Operations Head`. Selecting a persona:
1. Changes the badge label.
2. Highlights the corresponding primary screen item in the left rail with the `#7B2FF0` left border.
3. Navigates the main content area to that persona's primary screen.
4. In Stage 7 prototype, the transition is an instant re-render (no animation, for demo speed).

**Demo note:** The persona switcher is the primary demo navigation for showing both dashboards in a Swedbank or HDFC meeting. Stage 7 should make it visually prominent — not a settings-buried toggle.

### Filter and dimension breakdown

**Available on:** Trend Explorer (all dimensions), BPOHeatmap (vendor, shift, day), Plaza Heatmap (state, highway, acquirer), DrillDownPanel (channel, BPO site).

**Control:** A filter pill strip below the chart or zone title. Initially empty (= show all). Each dimension is a clickable pill: `+ Add filter`. Clicking opens a compact popover with checkboxes.

**Applied filter state:** Active filter pills display with the dimension name and selected values in coral (`#FF7043` border, white text): e.g. `Plaza: Mumbai-Pune Expressway ×`.

**Clear:** × on each active filter pill clears that dimension. "Clear all" text link clears all.

### Provenance hover/click

**Hover (tooltip):** Every number, percentage, count, or metric on any screen has a tooltip on hover. The tooltip is always 3 lines:
```
Line 1: "[N] interactions · trailing [window]"
Line 2: "Confidence: [High/Medium/Low] — [one-line reason]"
Line 3: "Model: [classifier name] v[version]"
```
The tooltip appears after 300ms hover delay; dismisses on mouse-off.

**Click:** Always opens DrillDownPanel. No number is a dead end. If a number has no contributing interactions to show (rare — usually a gap state), the DrillDownPanel renders the "gap" error state (see §H).

**[INFERRED] vs [OBSERVED] badge:** Appears inline next to the metric value on the face of the tile. Never in the tooltip only — it must be visible without interaction. [INFERRED] = amber; [OBSERVED] = cyan.

### Export

**Evidence Pack export:** "Export PDF" button in the EvidencePackHeader (Zone D1-A). In the prototype, this triggers `window.print()` on the evidence pack layout in light mode — sufficient for demo purposes.

**HoB Morning Brief export:** "Export Brief" button on the HeadlineBrief zone (B1), shown as a small Download icon in the zone's top-right. Clicking produces a single-page snapshot: top-3 categories + action queue + current provenance metadata. In prototype, `window.print()` on a print-optimised layout.

**Brief microcopy below the export button:** "Intelligence in under 30 minutes. Last analysed: [timestamp]." This reinforces the brand promise on the exported document.

### Alert acknowledgement

**States:** `normal → in-progress → acknowledged`

**Transition:**
1. `normal`: the ActionQueueRow or ShiftStatusBar badge is in its default state.
2. User clicks "→ Review": row state transitions to `in-progress` (amber left border, timestamp of review locked in micro below the row: "Under review since [time]").
3. User clicks "Mark Resolved" (revealed after "→ Review" is clicked): row transitions to `acknowledged` (grey, collapsed to one-line summary, check icon).
4. Acknowledged rows remain visible for 24h in a "Resolved today" collapsed section at the bottom of the Action Queue. After 24h, they move to history (accessible via Trend Explorer / signal event log).

**AlertToast lifecycle:** The toast shows, auto-dismisses after 10 minutes if not actioned. On dismiss: collapses to a count badge at the bottom-right corner of the screen. Badge persists until the shift ends. Clicking the badge reopens the Live Alerts screen.

---

## SECTION H — EMPTY, LOADING, AND ERROR STATES

### HoB Setu Intelligence

| State | Zone | Treatment |
|---|---|---|
| **Empty** (HeadlineBrief — no anomalies) | B1 | Single green card, full width: "No anomalous growth in the last 12 hours — baseline holding. Last checked [timestamp]." CheckCircle icon. Not a failure state — a genuinely useful signal. |
| **Empty** (Action Queue — nothing to action) | B2 | "No outstanding action items · [timestamp]." CheckCircle icon, green. |
| **Empty** (StrategyTile — no signal this week) | B6 | Tile renders at 50% opacity with label intact: "No signal this week." Never hidden — the tile is always there so the persona knows the signal exists. |
| **Loading** (initial render or time-window switch) | All zones | Lavender shimmer cards with pulse animation (`animate-pulse` in Tailwind). Left rail shows "Analysing conversations..." with a small cyan spinner. HeadlineBrief zone loads first (highest priority). |
| **Error** (signal classifier fails) | Any zone | Zone title remains. Card interior: "Signal temporarily unavailable · [model stamp] · [error timestamp]" in micro text. Never blank white. Never removes the zone. |
| **Boundary** (S013 — partial signal) | B3 | Permanent amber badge on the tile + one-line boundary microcopy: "Conversation-side only. Full chargeback ratio requires NPCI dispute feed." Always visible, not a hover-only state. |

### COH Operations Console

| State | Zone | Treatment |
|---|---|---|
| **Empty** (OC 005 Queue — all evidence complete) | C2 | Green banner: "All dispute-bound calls have complete evidence packs this shift." Most satisfying state in the console — green and explicit. |
| **Empty** (IO Readiness Queue — all ≥70%) | C3 | "All open cases have readiness ≥70%." Green tile. |
| **Loading** (shift handover — initial render) | C1 loads first | ShiftStatusBar renders in under 1 second (simulated). The rest of the console loads behind it. This priority is important: COH needs the floor picture first. |
| **Error** (Genesys feed unavailable — S021 cannot compute) | C1 alert badge | Badge for S021 shows "Feed unavailable" state: grey with a warning icon. Shift queue depth shows "--×" with tooltip: "Genesys queue feed temporarily unavailable." Never shows a stale number as current. |
| **Boundary** (Saksham conduct — S018) | C6 | ComplianceTile carries a permanent one-line boundary note: "Fluid CX monitors conduct patterns. Fluid CX does not act on Saksham's workflow." In micro text below the tile, always visible. |
| **Loading** (IO Pack assembling — S036) | C3 | IOReadinessRow for the assembling case shows a spinner and "Assembling pack..." status. Takes <30 min; prototype simulates 3-second resolve. |

### Shared surfaces

| Surface | State | Treatment |
|---|---|---|
| Evidence Pack | **Incomplete pack** | Completeness bar shows amber at the actual %. Missing elements listed in D1-D rail with red labels. Does not block access. Shows: "Pack at [N]% completeness — [N] elements missing." |
| Evidence Pack | **PII reveal required** | Full transcript shows redacted spans as `[REDACTED]` placeholders until role-based reveal is triggered. A "Reveal [role-gated]" toggle is visible; clicking it logs the access in ACCESS_LOG. |
| Trend Explorer | **No data for filter combo** | "No interactions match this signal / dimension / window combination." With a "Clear filters" link. Not an error — a valid filter outcome. |
| DrillDown | **Zero contributing interactions** | Rare. Shows: "No contributing interactions available for this signal in this window. The signal computed on aggregated data — individual interactions are not retrievable for this time window." Explains the gap; does not pretend it isn't there. |
| DrillDown | **Gap state (non-conversation data)** | For any signal with a Stage 2 §F gap annotation, the DrillDownPanel footer shows a persistent amber banner: "This signal is [Partial — conversation-side only]. [Description of what's missing and where it lives]. This is documented in Stage 2 §F." |

---

## SECTION I — TRACEABILITY TABLE

Every screen zone mapped to persona, Stage 1 Daily Friction moment, Signal ID(s), and provenance behaviour. All 39 active Signal IDs (S001–S040 excluding S039) appear at least once.

| Screen | Zone | Component | Signal ID(s) | Primary Persona | Stage 1 Daily Friction Moment | Provenance Behaviour |
|---|---|---|---|---|---|---|
| Setu Intelligence | B1 — Today's Headline | HeadlineBrief | S004 | HoB | #2 — 8:30am MIS pack: what's breaking this morning | ProvenancePill on face; click card → DrillDown with 3 snippets |
| Setu Intelligence | B2 — Action Queue (Annual Pass) | ActionQueueRow | S002 | HoB | #3 — 10am ops huddle: what does the floor actually tell us to do | ProvenancePill on hover; click row → DrillDown |
| Setu Intelligence | B2 — Action Queue (Fleet) | ActionQueueRow | S008 | HoB | #3 — 10am ops huddle | ProvenancePill on hover; click → DrillDown |
| Setu Intelligence | B2 — Action Queue (CASA) | ActionQueueRow | S010 | HoB | #3 — 10am ops huddle | ProvenancePill on hover; click → DrillDown |
| Setu Intelligence | B3 — Chargeback Intel (dispute potential) | ChargebackIndicator | S013 | HoB | #4 — 14:30 CS deep-dive: chargeback win rate trend | Partial badge permanent; [INFERRED] badge; click → DrillDown |
| Setu Intelligence | B3 — Chargeback Intel (churn intent) | ChargebackIndicator | S001 | HoB | #4 — 14:30 CS deep-dive | [INFERRED] badge; ProvenancePill; click → DrillDown |
| Setu Intelligence | B4 — Channel Quality | ChannelQualityBar | S007 | HoB | Question #1 — OEM-fitted tags → first 30-day dispute calls | Bar hover shows cohort size + confidence; click bar → DrillDown |
| Setu Intelligence | B5 — Sentiment Drift | SentimentDriftChart | S034 | HoB | #4 — 14:30 CS deep-dive: sentiment hardens before volume | "Explore →" → Trend Explorer; hover data point → count + z-score |
| Setu Intelligence | B6 — Strategy Tiles (GNSS) | StrategyTile | S009 | HoB | Friction #6 — 20:00 CEO one-pager on GNSS resilience | ProvenancePill; click → DrillDown |
| Setu Intelligence | B6 — Strategy Tiles (Campaign) | StrategyTile | S040 | HoB | #3 — 10am ops huddle: what did Marketing's campaign generate | ProvenancePill; [INFERRED] on conversion metric |
| Setu Intelligence | B6 — Strategy Tiles (Annual Pass FAQ) | StrategyTile | S030 | HoB | Question #3 — agent not offering Annual Pass | ProvenancePill; click → DrillDown |
| Setu Intelligence | B6 — Strategy Tiles (Branch handoff) | StrategyTile | S037 | HoB | #5 — 18:00 PNO response: branch-to-FASTag handoff failures | ProvenancePill; click → DrillDown |
| Setu Intelligence | B6 — Strategy Tiles (Auto-recharge) | StrategyTile | S011 | HoB | Question #3 — auto-recharge prompt outcomes | [INFERRED] permanent on face; ProvenancePill |
| Setu Intelligence | B6 — Strategy Tiles (IO Quarterly Pack) | StrategyTile | S032 | HoB | #5 — 18:00 PNO/IO response: readiness to sign off | Pack date + completeness % visible; click → IO Evidence Pack screen |
| Setu Intelligence | B7 — Live Alert overlay | AlertToast | S003, S006 | HoB | #1 — 7:30am social scan: pattern or one-off? | 3 snippets in DrillDown; 2 clicks to Evidence Pack |
| Operations Console | C1 — Shift Status Bar | ShiftStatusBar | S003, S006, S018, S021, S028 | COH | #1 — 8:00am queue handover from Trinetra night shift | Badge click → Live Alerts screen filtered to signal |
| Operations Console | C2 — OC 005 Evidence Queue | DisputeEvidenceRow | S016 | COH | #3 — 1:00pm dispute review: why code 5225 rejections? | Element-level checklist; click → DrillDown with missing-element coaching |
| Operations Console | C3 — IO Readiness Queue | IOReadinessRow | S024, S036, S029 | COH | #4 — 3:30pm Salesforce backlog: which cases will become IO findings | Readiness score breakdown on hover; "Assemble Pack →" triggers S036 |
| Operations Console | C4 — BPO Shift Heatmap | BPOHeatmap | S017, S035 | COH | #2 — 10:30am Anandam floor walk: supervisor gut vs. reality | Cell hover → 3 sub-scores; cell click → DrillDown for cohort |
| Operations Console | C5 — Repeat-call / FCR | FCRDriftPanel | S012, S014, S031 | COH | All COH Friction: what are agents promising they can't deliver | Promise-gap badge → coaching view; row click → side-by-side transcript |
| Operations Console | C6 — Compliance Strip (trilingual) | ComplianceTile | S015 | COH | Question #7 — agents correctly disclosing Annual Pass limits? | [OBSERVED] badge; click → Compliance Watch |
| Operations Console | C6 — Compliance Strip (Annual Pass mis-disclosure) | ComplianceTile | S020 | COH | Question #7 | [OBSERVED] badge; click → Compliance Watch |
| Operations Console | C6 — Compliance Strip (KYV check) | ComplianceTile | S038 | COH | Question #3 — agents running KYV root-cause before unlocking blacklist | [OBSERVED] badge; click → Compliance Watch |
| Operations Console | C6 — Compliance Strip (Saksham conduct) | ComplianceTile | S018 | COH | #6 — weekly Saksham conduct review: other 99% of calls | [OBSERVED] badge; boundary note permanent; click → Compliance Watch |
| Operations Console | C7 — Operational Signals (deflectable calls) | StrategyTile | S019 | COH | Question #3 — what are agents promising they can't deliver (IVR context) | ProvenancePill; click → DrillDown |
| Operations Console | C7 — Operational Signals (1033 forwarded) | StrategyTile | S025 | COH | #5 — 6:00pm DigitalReach shift swap: pattern in plaza mentions | ProvenancePill; click → DrillDown |
| Operations Console | C7 — Operational Signals (OVOT wave) | StrategyTile | S033 | COH | Question #3 — repeat-call wave after auto-deactivation | ProvenancePill; [partial] note on cross-issuer |
| Operations Console | C7 — Operational Signals (negative-balance + transfer) | StrategyTile | S026, S027 | COH | COH Questions #3 — negative-balance recovery complaint clusters | Boundary note for S026 (Saksham workflow out of scope) |
| Live Alerts | Alert feed — Ombudsman threats | AlertToast | S006 | COH (immediate) / HoB | Both: live alert with PNO decision context | 3 snippets + 90s pre-threat context in DrillDown |
| Live Alerts | Alert feed — social flare-up | AlertToast | S003 | HoB / COH | #1 HoB / C1 COH | Plaza attribution in 1 click |
| Live Alerts | Alert feed — queue spike | AlertToast | S021 | COH | C1 — Shift Status Bar / queue spike cross-channel correlation | Queue depth + plaza correlation in DrillDown |
| Live Alerts | Alert feed — recharge failure | AlertToast | S028 | COH, HoB | C1 / B7 overlay | Cluster count + top 3 snippets; boundary note: gateway reconciliation out of scope |
| Plaza Heatmap | Main heatmap | BPOHeatmap (repurposed) | S005, S022, S025 | HoB + COH | #1 HoB / #2 COH | Plaza × time-of-day clustering; hover shows acquirer; click → DrillDown |
| Plaza Heatmap | Secondary overlay — 1033 forwarded density | StrategyTile | S025 | COH | #5 COH — 1033 forwarded calls by plaza | Same heatmap with 1033-source filter; ProvenancePill |
| Plaza Heatmap | Secondary overlay — blacklist false-positive cluster | BPOHeatmap sub-overlay | S022 | COH, HoB | Question #4 COH — why are chargebacks rejected under code 5225 | [partial] note: wallet ledger not joined; customer-claimed only |
| IO Evidence Pack | Evidence Pack header | EvidencePackHeader | S036, S024 | COH / IO office | #4 COH — Salesforce backlog / IO desk handoff | Completeness %, chain-of-custody stamp, export PDF |
| IO Evidence Pack | Interaction list | TranscriptPane | S024, S036 | COH / IO office | #4 COH; #5 HoB | Channel icon, sentiment badge, signal events on row; click → transcript |
| IO Evidence Pack | Evidence rail (signal events + compliance checks) | SignalEventBadge | S015, S016, S018, S020, S024, S029, S036, S038 | COH / IO office | #5 HoB — 18:00 PNO/IO response | Signal_id + confidence + model version; compliance check outcomes |
| IO Evidence Pack | IO quarterly pack tile | EvidencePackHeader | S032 | HoB | #5 HoB — IO quarterly clause-7 series | Last pack date; draft badge; manual review required note |
| Compliance Watch | Heatmap by compliance type | BPOHeatmap (compliance variant) | S015, S018, S020, S029, S038 | COH | #6 COH — weekly Saksham review; all COH compliance questions | [OBSERVED] on all; per-shift violation rate |
| Compliance Watch | RB-IOS 30-day clock | IOReadinessRow | S024, S029 | COH | #4 COH — Salesforce backlog; ₹30L cap exposure | Days remaining to deadline; readiness score per case |
| Trend Explorer | Main chart | SentimentDriftChart | All 39 signals | HoB + COH | Accessible from any "Explore →" button | Full baseline band; dimension breakdown; click data point → DrillDown |
| DrillDown Panel | 3 representative snippets | TranscriptPane | All signals (universal) | Both | Universal — every friction moment | PII-redacted on face; role-based reveal; "Open Evidence Pack →" footer |
| DrillDown Panel | Contributing interaction list | TranscriptPane | All signals | Both | Universal | Every interaction row clickable to full transcript; model stamp in footer |

**Signal coverage check:** All 39 active signals (FCX-FT-S001 through S040, excluding S039 which is in Stage 2 §F Out-of-Scope Register) appear in at least one row above. S039 does not appear — correctly, per boundary contract.

---

*End of Stage 3 output. Feed-forward to Stage 4 (UX Blueprint): the 5-surface app structure in §A is the canvas; Section B zones + B.4 60-second test define the HoB hero surface behaviour; Section C zones + C.4 define the COH operations console behaviour; Section G interaction patterns define every gesture the prototype must support; Section I Traceability Table is the contract between design intent and signal data. Stage 5 (Frontend Architecture) takes §E Component Vocabulary and §F Visual Language as its implementation spec. Stage 7 (Prototype Build) takes all of the above.*