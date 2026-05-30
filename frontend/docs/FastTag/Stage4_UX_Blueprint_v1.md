Let me verify Stage 3 is in Drive before starting.All three input files confirmed in Drive. Stage 1, 2, and 3 are in context from this session. Producing Stage 4 now.

---

# Stage 4 — UX Blueprint (Prototype-Ready)
## Fluid CX × Setu FASTag MVP

**Stage inputs confirmed:** `Stage1_Persona_Definition_v1.md`, `Stage2_Capabilities_DataModel_v1.md`, `Stage3_UI_Spec_v1.md`
**This output:** `Stage4_UX_Blueprint_v1.md` — write inline, user saves and uploads manually
**Locked context:** Vahan Bank · Setu FASTag · 18M tag-in-force · 800K monthly issuance · 22L daily NETC transactions · 65,000 daily interactions · Voice 58% / Chat 22% / Email 8% / Social 5% / 1033 4% / Branch 3% · Trinetra BPO Hyderabad (voice primary) / Anandam Customer Solutions Coimbatore (voice secondary) / DigitalReach Bengaluru (chat + social) · Saksham Recovery Services · Genesys Cloud + Ozonetel CCaaS · Salesforce Financial Services Cloud CRM
**Product boundary contract:** Fluid CX reads and surfaces; it does not replace CRM/CMS, NPCI dispute switch, IVR, recovery workflow, IO judgement, fraud authentication, or legal review. Boundary states must say plainly what is out of scope and why.
**Design principles inherited from Stage 3 §4:** Anchor to Daily Friction · Action before observation · Provenance one click away · Persona vocabulary on face · Anti-patterns forbidden · 30-minute promise visible · Boundary statements where necessary.

---

## SECTION A — SCREEN INVENTORY AND ROUTING

Eight screens total. Two persona-primary, four navigable shared surfaces, and two non-navigable overlay surfaces (Drill-Down Panel and Trend Explorer) that launch from within any screen. Stage 5 routes to the first six; the last two are state-managed within the app shell.

| Screen ID | Screen Name (UI label) | Persona Primary | Reached From | Default Time Window |
|---|---|---|---|---|
| SCR-HOB-01 | Setu Intelligence | HoB | App entry (HoB persona) · Left rail · Persona switcher | HeadlineBrief: fixed 12h · SentimentDriftChart: 30d · ChargebackIndicator: 7d |
| SCR-COH-01 | Operations Console | COH | App entry (COH persona) · Left rail · Persona switcher | ShiftStatusBar: current shift (8h) · BPOHeatmap: 7d · IOReadinessQueue: all-open |
| SCR-SHR-01 | Live Alerts | Shared | Left rail (Bell icon) · AlertToast "→ Review" click · ShiftStatusBar badge click | Current shift (live) |
| SCR-SHR-02 | Plaza Heatmap | Shared | Left rail (MapPin icon) · S005 or S022 or S025 DrillDown "See on map →" | 24h |
| SCR-SHR-03 | IO Evidence Pack | Shared | Left rail (ShieldCheck icon) · IOReadinessRow "Assemble Pack →" · DrillDown "Open Evidence Pack →" · StrategyTile S032 click | Case-scoped (all-time for the selected case) |
| SCR-SHR-04 | Drill-Down Panel | Shared (overlay) | Any clickable number, chart point, queue row, heatmap cell on any screen | Inherits parent screen's active time window |
| SCR-SHR-05 | Compliance Watch | Shared | Left rail (optional) · ComplianceTile click on SCR-COH-01 C6 | Current shift |
| SCR-SHR-06 | Trend Explorer | Shared (overlay) | "Explore →" button on SentimentDriftChart (SCR-HOB-01 B5), BPOHeatmap (SCR-COH-01 C4), or any chart tile with trend capacity | 7d |

**Routing note for Stage 5:** SCR-SHR-04 and SCR-SHR-06 are not route-based screens. SCR-SHR-04 is a right-slide panel injected into the app shell (persistent layout). SCR-SHR-06 is a full-viewport overlay that sits above the current screen. Neither triggers a URL change in the prototype.

---

## SECTION B — SCREEN STATE MACHINES

---

```
SCREEN: SCR-HOB-01  —  Setu Intelligence
Persona primary: HoB
Daily Friction moment(s) served:
  Friction #1 — 7:30am social scan (AlertToast)
  Friction #2 — 8:30am MIS pack (HeadlineBrief, Zone B1)
  Friction #3 — 10:00am ops huddle agenda (Action Queue, Zone B2)
  Friction #4 — 14:30 CS deep-dive (Chargeback Intel, Zone B3;
    Sentiment Drift, Zone B5)
  Friction #6 — 20:00 CEO one-pager demand (StrategyTiles, Zone B6)

INITIAL STATE
Screen resolves in two phases. Phase 1 (0–500ms): HeadlineBrief
(Zone B1) renders first — three category cards appear with shimmer
placeholders. Phase 2 (500–1000ms): all remaining zones resolve.

On a demo-day morning, the default populated state reads:
  Zone B1 (HeadlineBrief):
    Card 1: "AVC misread queue · 3.2× baseline · 94 calls · 12h"
      Verbatim snippet (cyan italic): "Charged two axles. My car is
      a Maruti. This is not right." — Genesys, Voice, 07:51
    Card 2: "Blacklist false positive · 2.1× baseline · 61 calls"
      Snippet: "My balance shows ₹280. Why is the tag blacklisted?"
    Card 3: "Recharge not reflected · 1.7× baseline · 48 calls"
      Snippet: "Debited from PhonePe but the FASTag app shows zero."
    Stream indicator: "Live · 4 min ago"

  Zone B2 (Action Queue):
    Row 1 [S002]: "Annual Pass misses — 37 calls not prompted
      yesterday · → Marketing" [INFERRED]
    Row 2 [S008]: "Fleet intent — 12 conversations ready for
      corporate desk routing · → Corporate FASTag desk" [INFERRED]
    Row 3 [S010]: "Banking interest — 18 mentions, 11 are
      non-CASA customers · → Branch banking" [INFERRED]

  Zone B3 (Chargeback Intel):
    S013 sub-tile: "Dispute potential — 146 chargeback-eligible
      calls this week · conversation-side only" [INFERRED] +
      partial badge amber
    S001 sub-tile: "Churn-intent — 23 mentions · last 30 days ·
      0.8× baseline" (within range, no alert)

  Zone B4 (Channel Quality): OEM-fitted bar at 1.6× cohort median,
    coral. Dealer at 1.1×. E-com and Branch within range.

  Zone B5 (Sentiment Drift): "AVC misread queue" line sitting at
    −1.8σ for 6 days — coral. Two other lines within the shaded
    band.

  Zone B6 (Strategy Tiles): All 6 tiles populated. GNSS tile:
    "14 mentions this week · 57% confusion." Campaign tile: "No
    active campaign." IO Quarterly: "Last pack: 42 days ago ·
    186 cases · 71% readiness."

STATES THIS SCREEN CAN BE IN

STATE: LOADING
  All zone cards show lavender shimmer pulse (animate-pulse in
  Tailwind). Left rail shows "Analysing conversations..." with a
  small rotating cyan spinner next to the stream indicator.
  HeadlineBrief zone renders first at 500ms; remaining zones at
  1000ms. Duration: 800ms simulated.

STATE: POPULATED — DEFAULT
  The primary state on all normal operating mornings.
  At least one HeadlineBrief card above the z=1.5 threshold.
  Action Queue has 1–5 rows. No live alerts in the right margin.
  All StrategyTiles show data.

STATE: POPULATED — URGENT
  [ADDED IN STAGE 4 — reason: Stage 3 specced AlertToast as
  a floating overlay; this state names the screen state when
  one or more live alerts are active]
  One or more AlertToasts are visible in the right margin.
  The AlertToast for S006 (Ombudsman threat) takes the highest
  z-index and appears in coral. The main brief content is
  NOT obscured — the toasts stack in the right margin only.
  The HeadlineBrief "Live" indicator flashes once when a new
  alert fires (single 500ms pulse, then stable).

STATE: POPULATED — QUIET DAY
  HeadlineBrief cards all below z=1.5. Cards render in muted
  lavender with grey z-score text. The zone title changes to:
  "Today's Headline — baseline holding."
  Action Queue may still show items (e.g. Annual Pass misses
  are daily, not anomaly-based).
  Useful in demo to show contrast: "On a quiet day, here's
  what you see — on a busy day, here's what fires."

STATE: EMPTY
  First-install / no interaction data yet.
  HeadlineBrief shows a single card: "Baseline building — Fluid CX
  is analysing your first interactions. Intelligence begins when
  the 8-week baseline reaches 3 weeks of data."
  Action Queue shows: "Action items will appear as signals develop."
  StrategyTiles render at 30% opacity with "Tracking…" labels.

STATE: ERROR — DATA JOIN MISSING
  Triggered when the Salesforce join is unavailable. S007
  (Channel Quality) and S010 (CASA cross-sell) cannot compute.
  Affected zones render with an amber "Data join temporarily
  unavailable" label in micro text at the bottom of the zone.
  The zone title is preserved; the data inside is replaced with
  an honest gap message. The rest of the screen remains functional.
  Specific copy for Zone B4: "Channel Quality — Salesforce join
  unavailable · last successful: [timestamp]"

STATE: BOUNDARY — S013 PARTIAL
  This is a permanent characteristic of the S013 sub-tile in
  Zone B3, not a screen-level state. The partial badge is
  always present. No screen-level state change needed.

TRANSITIONS

Trigger: App load (persona = HoB) or persona switcher selects HoB
  From → To: [App Entry / SCR-COH-01] → SCR-HOB-01 LOADING
  Behaviour: HeadlineBrief resolves at 500ms; full resolution at
    1000ms. No route animation for demo speed.

Trigger: HeadlineBrief card click
  From → To: POPULATED-DEFAULT → SCR-SHR-04 (DrillDown Panel opens)
  Behaviour: Panel slides in from right in 250ms ease-out.
    Main content does NOT shift. Focus moves to first element
    in the panel (signal title heading).

Trigger: ActionQueueRow "Review →" click
  From → To: POPULATED-DEFAULT → SCR-SHR-04 (DrillDown Panel)
  Behaviour: Same as above. Row transitions to in-progress
    state (amber left border) simultaneously.

Trigger: SentimentDriftChart "Explore →" click
  From → To: POPULATED-DEFAULT → SCR-SHR-06 (Trend Explorer overlay)
  Behaviour: Full-viewport overlay fades in over the screen
    in 200ms. The underlying screen remains rendered (not
    unmounted). Pre-filtered to S034, 30d window.

Trigger: StrategyTile S032 click (IO Quarterly Pack)
  From → To: POPULATED-DEFAULT → SCR-SHR-03 (IO Evidence Pack,
    list view)
  Behaviour: Full route change. 150ms fade-in on the new screen.

Trigger: AlertToast "→ Review" click (S006 or S003)
  From → To: POPULATED-URGENT → SCR-SHR-04 (DrillDown Panel)
  Behaviour: Panel slides in pre-loaded with the alert's
    contributing interactions. Toast transitions to
    "acknowledged" amber state.

Trigger: Persona switcher — "Customer Operations Head"
  From → To: SCR-HOB-01 → SCR-COH-01
  Behaviour: Instant re-render. Left rail active item changes.
    No animation for demo speed.

Trigger: Left rail "Live Alerts" click
  From → To: POPULATED-URGENT → SCR-SHR-01
  Behaviour: Full route change. 150ms fade-in.

Trigger: Simulated T+45s (demo rhythm)
  From → To: POPULATED-DEFAULT → POPULATED-URGENT
  Behaviour: AlertToast slides down from top-right corner in
    200ms. ShiftStatusBar S006 badge increments. "Live"
    stream indicator pulses once.

MICRO-INTERACTIONS

HeadlineBrief cards:
  Hover: Card background shifts from brand-navy to a lighter
    shade (#242B3D) [INFERRED — dark navy variant]. ProvenancePill
    tooltip appears after 300ms: "[94] interactions · trailing 12h ·
    Confidence: High — z=3.2, 8-week baseline, 240-interaction
    baseline, ASR ≥0.85 · Model: intent-classifier v1.4.2"
  Click: Panel opens (see Transitions).

ActionQueueRow:
  Hover: Row background shifts to brand-navy. Downstream owner
    label brightens from grey to lavender. "Review →" chevron
    animates right 2px.
  Click: Row immediately shows amber left border (1px, brand-amber)
    and a "Reviewing since [time]" micro label appears.
  "Mark Resolved" (revealed after "Review →"): Row collapses in
    200ms. Moves to "Resolved today" collapsed section at queue
    bottom.

ChannelQualityBar:
  Hover over coral bar (OEM-fitted): Tooltip shows cohort detail:
    "OEM-fitted · 1,240 tags · 22 complaints / 1,000 · 1.6× median"
    + confidence band: "High — n=1,240"
  Click: DrillDown panel opens, filtered to OEM channel.

SentimentDriftChart:
  Hover over any line point: Crosshair appears (Recharts default).
    Tooltip: "[Category] · [date] · sentiment z-score: -1.8 ·
    [N] interactions that day"
  "Explore →" button (top-right of chart): Opens Trend Explorer.
    Button highlights with brand-purple background on hover.

StrategyTile:
  Hover: Tile border brightens from brand-slate to brand-purple.
    ProvenancePill tooltip appears.
  Click: Routes to DrillDown or IO Evidence Pack depending on tile.

AlertToast:
  "→ Review": Opens DrillDown pre-loaded. Toast transitions to
    acknowledged (grey, stays in margin).
  "×" dismiss: Toast collapses in 150ms, leaves a count badge
    at the bottom-right of the screen.

Stream indicator ("Live · 4 min ago"):
  Every 60 seconds in demo, the timestamp increments by 1 minute
  simulating the live feed (T: "4 min ago" → "5 min ago" etc.).
  If a new signal fires, it resets to "Updated just now" for 5s,
  then resumes incrementing.

DEMO RHYTHM

T+0s:    Screen loads in POPULATED-DEFAULT. Founder says: "At 8:30
          this morning, Setu Intelligence has already processed the
          overnight and the first two hours of the day's calls."

T+20s:   Founder hovers over HeadlineBrief card 1 (AVC misread
          queue). ProvenancePill tooltip appears. Founder says:
          "Every number has its evidence right here — 94 calls,
          12-hour window, the model that produced it."

T+45s:   [SIMULATED EVENT] AlertToast fires — S006 Ombudsman threat:
          "Ombudsman threat · Trinetra Hyderabad · 09:03am · 1 call"
          in coral. Founder: "And while we're looking at the brief,
          a customer just threatened to call 14448. That's the
          RBI Banking Ombudsman."

T+90s:   Founder clicks the AVC misread card → DrillDown panel
          opens. Demo moves to SCR-SHR-04.

T+5min:  [After returning from Evidence Pack] Founder points to
          Sentiment Drift chart: "The AVC misread category's customer
          tone has been hardening for 6 days — before the volume
          spike hit." Clicks "Explore →" → Trend Explorer.

T+7min:  [After Trend Explorer] Stream indicator shows "Updated
          1 min ago" — the headline brief has recalculated since
          the demo started. Founder: "This is the 30-minute promise.
          You're never looking at yesterday."

COPY DECISIONS

Screen left-rail label:   "Setu Intelligence"
Zone B1 title:            "Today's Headline — top 3 growing this morning"
Zone B2 title:            "What needs your attention today"
Zone B3 title:            "Chargeback win rate — leading indicators"
Zone B4 title:            "Day-1 issuance quality — complaints / 1,000 tags"
Zone B5 title:            "Sentiment drift — vs. 8-week baseline"
Zone B6 title:            "Strategy signals"
Stream indicator:         "Live · [N] min ago" / "Updated just now"

Action Queue rows:
  S002: "Annual Pass misses — [N] calls not prompted [yesterday /
        this shift] · → Marketing"
  S008: "Fleet intent — [N] conversations ready for corporate
        desk routing · → Corporate FASTag desk"
  S010: "Banking interest — [N] mentions, [N] are non-CASA
        customers · → Branch banking"

S013 boundary (permanent, Zone B3):
  "Conversation-side only. Full chargeback ratio requires NPCI
  dispute feed — see Scope."

S011 [INFERRED] label:
  "[INFERRED] opt-in stated in call — actual enablement requires
  wallet feed"

Empty state (Zone B1):
  "Baseline holding — no anomalous signals in the last 12 hours.
  Last checked [timestamp]."

Empty state (Zone B2):
  "No outstanding action items · [timestamp]"

StrategyTile GNSS label:
  "GNSS / Barrier-Less pulse — [N] mentions this week"

StrategyTile IO Quarterly:
  "IO Quarterly Pack — last assembled [date] · [N] cases ·
  [N%] readiness"

Error state (Zone B4, Salesforce join unavailable):
  "Channel quality — Salesforce join temporarily unavailable ·
  last data: [timestamp]"
```

---

```
SCREEN: SCR-COH-01  —  Operations Console
Persona primary: COH
Daily Friction moment(s) served:
  Friction #1 — 8:00am queue handover from Trinetra night shift
    (ShiftStatusBar, Zone C1; BPOHeatmap, Zone C4)
  Friction #2 — 10:30am Anandam floor walk
    (BPOHeatmap, Zone C4; FCRDriftPanel, Zone C5)
  Friction #3 — 1:00pm dispute review with NPCI desk
    (OC 005 Evidence Queue, Zone C2)
  Friction #4 — 3:30pm Salesforce case backlog review
    (IO Readiness Queue, Zone C3)
  Friction #5 — 6:00pm DigitalReach shift swap
    (ShiftStatusBar badge for S003, Zone C1)
  Friction #6 — weekly Saksham conduct review
    (Compliance Strip tile S018, Zone C6)

INITIAL STATE
ShiftStatusBar (Zone C1) resolves at 500ms — the floor status
picture is the highest-priority load. All other zones resolve
at 1000ms.

On a demo-day shift:
  Zone C1 (ShiftStatusBar):
    Trinetra Hyderabad · Morning · 1.0× (green dot)
    Anandam Coimbatore · Morning · 0.9× (green dot)
    DigitalReach Bengaluru · Day · 1.1× (green dot)
    Alert badges: [S006 × 1 🔴] [S021 × 0 ●] [S028 × 0 ●]
                  [S018 × 0 ●] [S003 × 0 ●]
    Stream: "Live · 2 min ago"

  Zone C2 (OC 005 Evidence Queue):
    Header: "OC 005 Evidence Pack Queue — 7 dispute-bound calls
      · 4 complete · 3 at risk of code 5225 rejection"
    Row 1 [coral, 112 min]: Plaza ✗ · Txn-ID ✓ · Class ✗ ·
      Statement ✓ · Agent ✓ · "Complete Now →" (coral)
    Row 2 [coral, 94 min]: Plaza ✓ · Txn-ID ✗ · Class ✓ ·
      Statement ✗ · Agent ✓ · "Complete Now →" (coral)
    Row 3 [coral, 91 min]: Plaza ✗ · Txn-ID ✓ · Class ✓ ·
      Statement ✗ · Agent ✓ · "Complete Now →" (coral)
    Rows 4–7: amber or complete, non-urgent.
    Boundary line: "Fluid CX captures evidence completeness in the
    call. Dispute filing and NPCI outcome are in the dispute system."

  Zone C3 (IO Readiness Queue):
    Header: "IO Readiness — 4 cases below 70% · 30 June deadline"
    Row 1: Case ···-4421 · AVC misread · 38% · 18 days open ·
      6 days to IO review [coral] · "Assemble Pack →"
    Row 2: Case ···-7803 · Recharge not reflected · 52% · 12 days ·
      14 days to IO review [amber]
    Row 3: Case ···-2219 · Blacklist false positive · 61% · 7 days
    Row 4: Case ···-5534 · KYV mismatch · 64% · 22 days
    Boundary line: "Fluid CX assembles the evidence record. The IO
    desk makes the finding."

  Zone C4 (BPO Heatmap):
    Trinetra · Morning: green · Trinetra · Afternoon: coral
      (OC 005 completeness rate at 78%, below 90% threshold)
    Anandam · Morning: amber (FCR dipping) · Afternoon: green
    DigitalReach · Day: green
    Below grid: "Cohort-level view only. Agent coaching visible
    to BPO supervisors in sessions."

  Zone C5 (FCR Drift):
    Top: AVC misread · 18% repeat-call rate · +4pp WoW ↑ [coral]
      [Promise-gap badge amber: "Agent promise gap · 8 callbacks"]
    2nd: Recharge not reflected · 14% · +1pp ↑ [amber]
    3rd: Blacklist false positive · 12% · stable
    4th: KYV mismatch · 9% · -1pp ↓ [green]
    5th: Annual Pass confusion · 7% · stable

  Zone C6 (Compliance Strip):
    S015 Trilingual: "82% compliance today · Target: ≥85%" [amber]
    S020 Annual Pass eligibility: "2 mis-disclosures today" [coral]
    S038 KYV root-cause: "91% adherence today · Target: ≥80%"
      [green]
    S018 Saksham conduct: "0 flags today · 14 calls reviewed"
      [green]
    [OBSERVED] badge on all 4 tiles.
    Boundary below S018: "Fluid CX monitors conduct patterns. Fluid
    CX does not act on Saksham's workflow."

  Zone C7 (Operational Signals):
    S019 Deflectable: "31% of voice volume · avoidable via IVR"
    S025 1033 forwarded: "Top plaza: NH-48 Bengaluru · 9 calls
      this week"
    S033 OVOT wave: "43 'stopped working' calls this week"
    S026/S027 Recovery + Transfer: "12 negative-balance + 8
      used-vehicle calls this week"

STATES THIS SCREEN CAN BE IN

STATE: LOADING
  ShiftStatusBar resolves at 500ms with real-looking vendor pills
  (vendor names always render; queue metrics shimmer until resolved).
  All other zones shimmer. COH always sees the floor picture first.

STATE: POPULATED — DEFAULT
  Normal operating shift. Alert badges in C1 show ≤2 live signals.
  C2 has some incomplete calls but no crisis. C3 has cases but
  with >7 days to IO review. BPO Heatmap shows 0–2 flagged cells.

STATE: POPULATED — URGENT
  One or more of: S006 count >0 (Ombudsman threat live) in C1 badge;
  S028 count >0 (recharge failure cluster); S018 Saksham flag;
  S021 queue spike. The ShiftStatusBar changes the affected vendor
  pill to coral background. The relevant C1 badge pulses once
  (animation) then holds its coral state.

STATE: SHIFT-HANDOVER
  [ADDED IN STAGE 4 — reason: COH's most critical daily friction
  is the 8:00am handover; this state represents the first 10 minutes
  of a new shift before the new shift's data has accumulated]
  ShiftStatusBar shows the prior shift's final metrics in grey
  ("Night shift ended 8 min ago") alongside the new shift's
  incoming queue in live colour. C2 shows dispute-bound calls
  inherited from the night shift (aged out from previous hours).
  C4 heatmap shows "Night shift data" label on prior rows with
  reduced opacity while the morning shift cells accumulate.
  Useful in demo to show the handover moment viscerally.

STATE: EMPTY — BOTH QUEUES CLEAN
  [Shown as the target/aspirational state in demo]
  C2: "All dispute-bound calls have complete evidence packs this
    shift." Green banner, CheckCircle.
  C3: "All open cases have readiness ≥70%." Green banner.
  This state is demo-valuable: show it as "here's what success looks
  like — and here's how you build toward it."

STATE: ERROR — GENESYS FEED UNAVAILABLE
  S021 cannot compute (queue-spike correlation needs Genesys feed).
  ShiftStatusBar queue depth shows "--×" with amber warning icon and
  tooltip: "Genesys queue feed temporarily unavailable — showing last
  known values from [timestamp]."
  The rest of the console functions normally.

TRANSITIONS

Trigger: App load (persona = COH) or persona switcher selects COH
  From → To: [Entry / SCR-HOB-01] → SCR-COH-01 LOADING
  Behaviour: ShiftStatusBar resolves first (500ms). Rest at 1000ms.

Trigger: C2 DisputeEvidenceRow "Complete Now →"
  From → To: POPULATED-DEFAULT → SCR-SHR-04 (DrillDown)
  Behaviour: Panel slides in from right, 250ms ease-out. Pre-loaded
    with the specific dispute call's missing-element coaching view.
    Row transitions to in-progress (amber left border).

Trigger: C3 IOReadinessRow "Assemble Pack →"
  From → To: POPULATED-DEFAULT → SCR-SHR-03 (IO Evidence Pack,
    ASSEMBLING state)
  Behaviour: Full route change. New screen opens in ASSEMBLING state
    (3s simulated assembly animation). After 3s, transitions to
    PACK-VIEW with the assembled pack. The IOReadinessRow on the
    COH screen updates to "pack-ready" state on return.

Trigger: C4 BPO Heatmap cell click
  From → To: POPULATED-DEFAULT → SCR-SHR-04 (DrillDown)
  Behaviour: Panel slides in pre-filtered to that vendor × shift
    cohort. Shows the 3 representative snippets from that cell.

Trigger: C6 ComplianceTile click
  From → To: POPULATED-DEFAULT → SCR-SHR-05 (Compliance Watch)
  Behaviour: Full route change. 150ms fade-in. Pre-filtered to
    the clicked compliance type.

Trigger: C1 S006 badge click
  From → To: POPULATED-URGENT → SCR-SHR-01 (Live Alerts)
  Behaviour: Full route change. 150ms fade-in. Pre-filtered to
    S006 signals.

Trigger: Simulated T+30s after persona switch (demo rhythm)
  From → To: POPULATED-DEFAULT → one new DisputeEvidenceRow in C2
  Behaviour: New row inserts at the top of C2 with a subtle flash
    animation (300ms brand-purple border flash, then coral border
    if urgent). Row count in C2 header increments.

Trigger: Simulated T+4min (demo rhythm — Saksham conduct alert)
  From → To: POPULATED-DEFAULT → POPULATED-URGENT (C6 S018 tile
    changes from green to coral; C1 badge [S018 × 1] appears)
  Behaviour: C6 Saksham tile flashes once (500ms coral border),
    settles into coral state. C1 S018 badge increments with a
    brief pulse.

MICRO-INTERACTIONS

ShiftStatusBar vendor pills:
  Hover: Shows tooltip with 3 sub-metrics: queue depth vs. baseline,
    average AHT this shift, top complaint category in last hour.
  Click: Opens DrillDown panel pre-filtered to that site × shift.

DisputeEvidenceRow:
  Hover: Row background shifts to brand-navy. Checklist icons
    for missing elements gain a subtle coral glow.
  Click on "Complete Now →": DrillDown panel opens.
  "Complete Now →" button has a micro-animation: the button text
    shifts right by 2px on hover (ChevronRight leaning).

IOReadinessRow:
  Hover: Readiness progress bar animates a slight brightening of its
    fill colour. Tooltip appears with element-by-element checklist.
  "Assemble Pack →" hover: Button background shifts from brand-slate
    to brand-purple. Click routes to SCR-SHR-03.

BPO Heatmap cells:
  Hover: Cell lifts slightly (box-shadow increase, 150ms). Tooltip
    shows 3 sub-scores with baselines and z-scores.
  Click: DrillDown opens for that cohort.
  Coral cells have a subtle pulse animation (4s loop, very low
    amplitude) to draw eye during demo.

FCRDriftPanel rows:
  Hover: Row highlights. ProvenancePill tooltip appears.
  Promise-gap badge hover: Tooltip shows: "8 callbacks referenced
    'your agent told me' — click to see the promise-vs-delivery
    gap for this category."
  Click: DrillDown opens with promise-vs-delivery view.

ComplianceTile:
  Hover: Tile border shifts from brand-slate to brand-purple.
    Tooltip: compliance rate + target + [N] violations today.
  Click: Routes to SCR-SHR-05.

DEMO RHYTHM

T+0s after persona switch:  COH Console loads. Founder says: "The
  Customer Operations Head's view is completely different — this is
  an operations console, not an executive brief. Everything here is
  about what needs action this shift."

T+15s:  Founder points to Zone C2: "Three dispute-bound calls from
  the last two hours are missing evidence for NPCI. If these
  don't get completed before the upload window, they get rejected
  under code 5225."

T+30s:  [SIMULATED EVENT] New DisputeEvidenceRow appears at top of
  C2 — a fourth at-risk call arrives. Row flashes briefly and
  settles coral. C2 header count updates from 7 → 8. Founder:
  "And one just came in."

T+60s:  Founder clicks the oldest row "Complete Now →". DrillDown
  opens with coaching view.

T+2min:  Founder navigates to C3, clicks "Assemble Pack →" for
  Case ···-4421. Demo moves to SCR-SHR-03 ASSEMBLING state.

T+4min:  [SIMULATED EVENT] C6 S018 Saksham tile flips from green to
  coral. C1 badge [S018 × 1] appears. Founder: "A Saksham Recovery
  call just flagged — aggressive language detected. Before Fluid CX,
  this would surface only when the customer filed a complaint."

T+5min:  Founder clicks S018 tile → Compliance Watch. Demo moves to
  SCR-SHR-05.

COPY DECISIONS

Screen left-rail label:   "Operations Console"
Zone C1 title:            [No title — ShiftStatusBar is self-labelling]
Zone C2 title:            "OC 005 Evidence Pack Queue — chargeback
                           win rate"
Zone C2 header count:     "[N] dispute-bound calls · [N] complete ·
                           [N] at risk of code 5225 rejection"
Zone C3 title:            "IO Readiness — [N] cases below 70% ·
                           30 June deadline"
Zone C4 title:            "BPO shift performance — cohort view"
Zone C4 footer:           "Cohort-level view only. Agent coaching
                           visible to BPO supervisors in sessions."
Zone C5 title:            "Repeat-call rate — FCR by category"
Zone C6 title:            "Compliance watch — [date]"
[OBSERVED] badge label:   "[OBSERVED]"

DisputeEvidenceRow urgency label:
  "> 90 min — NPCI upload window at risk"

IOReadinessRow deadline labels:
  "6 days to IO review" (coral)
  "14 days to IO review" (amber)
  "22 days to IO review" (white)

BPO Heatmap flagged cell tooltip:
  "Trinetra · Afternoon · OC 005 completeness: 78%
  (below 90% target) · z=1.6 vs. 30-day baseline ·
  Repeat-call rate: +1.2pp above baseline"

Saksham conduct boundary (Zone C6):
  "Fluid CX monitors conduct patterns. Fluid CX does not act
  on Saksham's workflow."

Empty C2 state:
  "All dispute-bound calls have complete evidence packs this shift."

Empty C3 state:
  "All open cases have evidence readiness ≥70%."

Shift-handover state label (C1):
  "Night shift ended [N] min ago · Morning shift accumulating"
```

---

```
SCREEN: SCR-SHR-01  —  Live Alerts
Persona primary: Shared (COH immediate; HoB notified)
Daily Friction moment(s) served:
  HoB Friction #1 — 7:30am social scan: is the tweet a pattern?
  COH Friction #1 — 8:00am: what spiked on the night shift?

INITIAL STATE
A vertically scrolling feed of all signal events that have fired
in the current shift, sorted by severity (coral first) then by
recency. Each card is a full-detail AlertCard (not the mini-toast).
Pre-filtered to the signal type that launched it (e.g. S006 if
the user clicked the S006 badge from C1).

Default populated: 3 alert cards visible.
  Card 1 [S006, coral]: "Ombudsman threat · Trinetra Hyderabad ·
    Morning shift · 09:03am · 1 interaction · High confidence"
    Verbatim excerpt: "I will call 14448 right now. This is
    the third time."
    Agent: "[BPO-site: Trinetra · Shift: Morning]" (name redacted)
    90s before the threat: "Agent said: 'The refund will be
    processed in 3–5 working days.'"
    Action button: "Route to Senior Agent" (COH scope)
    Provenance: 1 interaction · current shift · High ·
      paraphrase-classifier v2.1.0

  Card 2 [S021, amber]: "Queue spike + plaza pattern ·
    NH-4 Mumbai-Pune Expressway · 08:00–08:30 ·
    48 interactions · 2.1× queue baseline"
    Snippet: "'Charged for two axles at Khopoli plaza'"
    Provenance: 48 interactions · 30 min · High

  Card 3 [S028, amber]: "Recharge failure cluster ·
    PhonePe gateway · 07:45–08:15 · 23 interactions"
    Snippet: "'Debited ₹200 but tag not recharged'"
    Provenance: 23 interactions · 30 min · High

STATES

STATE: LOADING
  Feed skeleton (3 shimmer cards).

STATE: POPULATED — WITH LIVE ALERTS
  Primary state. Alerts sorted by severity then recency.
  Filter pills at top of feed: [All] [Ombudsman] [Queue spike]
    [Recharge failure] [Social flare] [Saksham conduct]
  Active filter pill highlighted coral.

STATE: POPULATED — QUIET
  No live signals this shift. Single card in green:
    "No alerts this shift · [N] interactions processed ·
    Baseline holding since [shift-start-time]."
  Subtext: "Last alert: [date/time] · [signal name]"
  Useful in demo to contrast: "Here's what quiet looks like."

STATE: POPULATED — SAKSHAM CONDUCT (sub-state)
  [ADDED IN STAGE 4 — reason: S018 Saksham alerts have a distinct
  layout requirement — they carry a boundary note and cannot route
  to "supervisor action" like BPO calls because Saksham is external]
  Alert card has coral border. Action button replaced with:
    "Route to Compliance" (not "Notify supervisor")
  Boundary note on the card: "Fluid CX does not act on Saksham's
  workflow. This pattern has been flagged for Compliance review."

TRANSITIONS

Trigger: Alert card "View in DrillDown" click
  From → To: Any state → SCR-SHR-04 (DrillDown)
  Behaviour: DrillDown panel slides in with the specific
    alert's interaction.

Trigger: Alert card "See on Plaza Heatmap" (S021)
  From → To: POPULATED → SCR-SHR-02 (Plaza Heatmap)
  Behaviour: Full route change. Plaza Heatmap pre-filtered to
    the plaza named in the alert.

Trigger: Alert card "Acknowledge" button
  From → To: POPULATED → Card transitions to acknowledged state
    (grey, collapsed). Feed re-sorts remaining active alerts.

Trigger: Filter pill click
  From → To: POPULATED → re-filtered view (no route change)
  Behaviour: Feed re-renders with only the matching signal type.
    Filter pill gets coral background. Animation: cards fade
    out in 150ms, new filter results fade in 150ms.

MICRO-INTERACTIONS

Alert card hover: Card shadow increases; "View in DrillDown"
  button reveals from hidden to visible (opacity 0 → 1, 150ms).

Acknowledge button: Collapses the card in 300ms. Moves to
  "Acknowledged today" section at bottom of feed.

Filter pills: Active state gets coral outline and white text.
  Switching filters triggers a smooth cross-fade of the feed
  content (150ms).

DEMO RHYTHM

This screen is typically visited reactively (in response to an
alert firing), not as a starting point. In the demo, it's
visited at T+45s when the AlertToast is clicked.

COPY DECISIONS

Screen title (left rail):   "Live Alerts"
No-alert state:             "No alerts this shift · [N] interactions
                             processed · Baseline holding since
                             [shift-start-time]."
Ombudsman alert header:     "Ombudsman threat · [BPO site] ·
                             [shift] · [time] · [N] interaction"
Ombudsman 90s-before label: "90 seconds before the threat:"
Saksham boundary on card:   "Fluid CX does not act on Saksham's
                             workflow. Flagged for Compliance review."
Acknowledge button:         "Acknowledge"
Feed section label:         "Acknowledged today" (collapsed section)
```

---

```
SCREEN: SCR-SHR-02  —  Plaza Heatmap
Persona primary: Shared (HoB strategy decision · COH operational surge)
Daily Friction moment(s) served:
  HoB Question #5 — "Is Mumbai-Pune a pattern or one Trinetra shift?"
  COH Friction #2 — "Is the Anandam supervisor's gut accurate
    about which plaza is spiking?"

INITIAL STATE
A grid heatmap: plazas on Y-axis (top-N by complaint volume,
sorted descending), time-of-day on X-axis (hourly buckets, 00:00–
23:00). Default view: 24h window, top-20 plazas by interaction
volume. Colour scale: green → amber → coral by complaint density
relative to per-plaza baseline.

Today's notable cell: NH-4 / Mumbai-Pune Expressway / 08:00–09:00
→ coral (AVC misread cluster, 3.2× baseline, 48 interactions).

Filter strip at top: [State ▾] [Highway ▾] [Acquirer ▾]
  [Complaint type ▾] [Time window: 24h | 7d | 30d | 90d]

Each heatmap cell displays: interaction count (if ≥5) as a micro
number overlay.

STATES

STATE: LOADING
  Grid skeleton with shimmer rows and columns.

STATE: LOADED — NORMAL DAY
  Scattered amber cells; no coral. Useful contrast state.

STATE: LOADED — INCIDENT
  One or more cells coral. The incident cells have a subtle pulse
  animation (very low amplitude, 3s loop). Founder points to these
  during demo to say: "The heatmap shows you it's always been that
  plaza, always that hour."

STATE: FILTERED
  User has applied one or more filter pills. Active filters shown
  as coral-border pills. Grid re-renders to the filtered subset.
  A "Clear filters" link appears in the filter strip.

STATE: DRILL-DOWN-FROM-ALERT
  Launched from an alert or DrillDown with a specific plaza + time
  pre-selected. The matching cell is highlighted with a brand-purple
  border. Surrounding cells provide context.

TRANSITIONS

Trigger: Heatmap cell click
  From → To: LOADED → SCR-SHR-04 (DrillDown)
  Behaviour: DrillDown panel slides in, pre-filtered to that
    plaza × hour with the interactions that contributed to
    the cell colour.

Trigger: Cell hover
  From → To: No state change
  Behaviour: Tooltip appears showing: plaza name, acquirer,
    interaction count, complaint density × baseline,
    top-2 grievance types, ProvenancePill.

Trigger: Filter pill change
  From → To: LOADED → FILTERED
  Behaviour: Grid re-renders with 150ms cross-fade. Active pills
    persist. "Clear filters" link appears.

Trigger: Time-window pill change
  From → To: LOADED → LOADED (re-rendered for new window)
  Behaviour: Grid cells re-colour with 300ms ease. ProvenancePill
    interaction counts update.

MICRO-INTERACTIONS

Cell hover: Tooltip as above. Cell border lightens from transparent
  to a thin brand-purple outline.
Cell click: DrillDown opens (see Transitions).
Coral cells: subtle pulse animation. On hover, pulse pauses.
Acquirer annotation: cells where the plaza is acquired by Vahan
  Bank itself show a small "★" icon — visual distinction for
  cases where the bank controls the acquirer side.

DEMO RHYTHM

T+1min (after AlertToast shows NH-4 Mumbai-Pune spike):
  Founder navigates to Plaza Heatmap. The NH-4 / 08:00 cell is
  coral and pulsing. Founder says: "The heatmap tells us it's
  specifically the morning rush hour, specifically NH-4. Now the
  question is: is it the acquirer's AVC sensor, or is it our
  Trinetra agents not capturing the evidence?"
  Founder clicks the cell → DrillDown opens with the 3 snippets
  and the drill-down to confirm it's AVC misread, not agent error.

COPY DECISIONS

Screen title:       "Plaza Heatmap"
Filter strip:       "Filter by: [State ▾] [Highway ▾]
                    [Acquirer ▾] [Complaint type ▾]"
Cell tooltip:       "[Plaza name] · [Acquirer] · [N] interactions ·
                    [X×] baseline · Top: [grievance-type-1],
                    [grievance-type-2]"
Acquirer star:      "★ Vahan Bank acquirer"
Empty filter state: "No plazas match this filter combination.
                    Try clearing one filter."
```

---

```
SCREEN: SCR-SHR-03  —  IO Evidence Pack
Persona primary: COH (assembly + gap closure) · IO office (review) ·
  HoB (read-only, redacted view)
Daily Friction moment(s) served:
  COH Friction #4 — 3:30pm Salesforce backlog: which cases will
    become IO findings before 30 June?
  HoB Friction #5 — 18:00 PNO/IO response: the 4-hour case-assembly
    problem

INITIAL STATE
When reached from the left rail: List view showing all open/
partially-resolved cases sorted by readiness score ascending.

When reached from IOReadinessRow "Assemble Pack →": Pack view
for the specific case in ASSEMBLING state.

List view default (demo day):
  4 cases below 70% readiness, shown first.
  Header: "IO Evidence Pack — [N] open cases · [N] below 70%
    readiness · 30 June deadline"
  Each row: case ref (masked), category, readiness bar, days
    open, days to IO review, "Open Pack →" or "Assemble Pack →".

STATES

STATE: LIST-VIEW
  Default for left-rail entry. All open cases with readiness
  scores. Sortable by readiness (default asc), days open, category.

STATE: ASSEMBLING
  Reached from "Assemble Pack →". Shows a full-screen loading
  state for the specific case:
    Pack ID displayed.
    A progress animation showing 5 assembly steps:
      "Retrieving interactions... ✓" (instant)
      "Linking complaint case... ✓" (500ms)
      "Running compliance checks... [spinner]" (1000ms)
      "Extracting evidence elements... ✓" (500ms)
      "Finalising chain of custody... ✓" (500ms)
    Total simulated assembly: 3 seconds.
  After 3s: transitions to PACK-VIEW.

STATE: PACK-VIEW
  The assembled pack for one case. Four-zone layout per Stage 3
  §D.1: EvidencePackHeader, Interactions list, TranscriptPane,
  Evidence rail.

  EvidencePackHeader:
    Pack ID: "PACK-2026-0427-4421"
    Assembled: "[today's date and time]"
    Case: "Case ···-4421 · Salesforce SF-FT-00004421"
    Tag: "···-9A3F"
    Date range: "[N] days"
    Completeness: 87% [amber progress bar] — 2 elements missing
    Chain-of-custody: "Assembled by Fluid CX v2.1.4 · [timestamp]"
    [IO-Defensible] badge: amber (because <90%)
    Buttons: "Export PDF" · "Flag for IO desk"

  Interactions list (left panel):
    8 interactions listed. Channel icons: 5 × Phone (coral/amber
    sentiment) · 2 × MessageSquare (amber) · 1 × Mail (neutral).
    Signal event badges on 3 of them: "S006 fired" (red dot).

  TranscriptPane (center): Default shows the most recent voice
    interaction. Compliance violations highlighted in coral.
    Missing evidence elements underlined in coral dashes.

  Evidence rail (right):
    Signal Events: 3 events listed (S006 × 2, S022 × 1).
    Compliance Checks: 7 rows. AVC misread evidence: PARTIAL.
      Trilingual rule: PASS. TAT promise: PASS. KYV check: FAIL.
    CRM Linkage: "SF-FT-00004421 · partially_resolved ·
      SLA target: [date] · SLA actual: breached"
    NPCI Dispute: "DISP-2026-03-4421 · filed · reason: 5001 ·
      status: pending" [boundary: "Dispute outcome in NPCI system"]

STATE: PACK-VIEW — COMPLETE
  Completeness ≥90%. [IO-Defensible] badge turns cyan. Header
  progress bar turns green. "Export PDF" button brightens.

STATE: PACK-VIEW — INCOMPLETE
  Completeness <70%. [IO-Defensible] badge is amber. Missing
  elements list is prominent in the Evidence rail. An orange
  banner at the top of the pack: "This pack has [N] missing
  elements. The IO desk may request additional evidence."

STATE: QUARTERLY-PACK-VIEW
  Reached from HoB StrategyTile S032. Shows the auto-assembled
  quarterly pack: category summary, evidence-trail completeness
  across all [N] cases in the quarter. Draft state — manual review
  required before submission. Header: "Q[N] FY26 IO Complaint
  Pattern Analysis — DRAFT · Awaiting HoB + IO office endorsement."

TRANSITIONS

Trigger: List-view "Assemble Pack →" click
  From → To: LIST-VIEW → ASSEMBLING → PACK-VIEW
  Behaviour: Full-screen assembly animation (3s). Then pack view
    reveals with a 200ms fade-in.

Trigger: List-view "Open Pack →" (already assembled)
  From → To: LIST-VIEW → PACK-VIEW (instant, already computed)
  Behaviour: 150ms fade-in.

Trigger: Interaction list row click
  From → To: PACK-VIEW → PACK-VIEW (TranscriptPane updates)
  Behaviour: TranscriptPane cross-fades to the new interaction's
    transcript in 200ms.

Trigger: "Export PDF" click
  From → To: PACK-VIEW → print dialog (client-side)
  Behaviour: Screen switches to light mode (lavender background)
    for print layout. Browser print dialog opens.

Trigger: "Flag for IO desk" click
  From → To: PACK-VIEW → PACK-VIEW (button state change)
  Behaviour: Button changes to "Flagged ✓" in green. A timestamp
    is added to the evidence rail: "Flagged for IO desk at [time]."

MICRO-INTERACTIONS

Interaction list row hover: Row highlights. Sentiment badge tooltip
  shows: "[N] turns · [sentiment score] · [top signal fired]"
Click: TranscriptPane slides to show that interaction's content
  (200ms cross-fade).

TranscriptPane evidence highlighting:
  Green underline: evidence element captured.
  Coral dashed underline: evidence element missing.
  Amber highlight: signal trigger phrase.
  Hovering over a highlighted span: tooltip explains the element
    type and its role in the NPCI OC 005 / IO defensibility.

"PII Redacted" toggle: clicking "Reveal" (role-gated in production;
  unrestricted in demo prototype for demo purposes):
  Redacted spans animate from "[REDACTED]" → revealed text in
  150ms (a brief blur-to-sharp effect).

Chain-of-custody stamp hover: Tooltip shows full list of Fluid CX
  components and model versions used in assembly.

DEMO RHYTHM

T+2min (after DrillDown): Founder clicks "Open Evidence Pack →"
  from the DrillDown panel. Routes to this screen in PACK-VIEW
  (already assembled for demo). Founder says: "The evidence pack
  — every interaction for this case, the signal events that fired,
  the compliance checks, the NPCI dispute linkage — assembled in
  one place."

T+2m30s: Founder points to the completeness bar: "87% — two
  elements missing. The KYV check wasn't run before the unlock.
  And one interaction didn't capture the plaza name. We know
  exactly what's missing before the IO desk does."

T+3min: Founder clicks "Export PDF". Brief switch to light mode
  for print. Founder: "This is what you hand to the IO desk.
  Not a manual assembly — a chain-of-custody stamped pack,
  built from the conversation data itself."

COPY DECISIONS

Screen title (left rail):         "IO Evidence Pack"
List view header:                 "IO Evidence Pack — [N] open
                                  cases · [N] below 70% ·
                                  30 June deadline"
Assembly steps:
  Step 1: "Retrieving interactions..."
  Step 2: "Linking complaint case..."
  Step 3: "Running compliance checks..."
  Step 4: "Extracting evidence elements..."
  Step 5: "Finalising chain of custody..."
Assembly complete:                "Pack assembled · 87% complete"

Pack header [IO-Defensible] badge variants:
  ≥90%: "[IO-Defensible ✓]" cyan
  70–89%: "[IO-Defensible — partial]" amber
  <70%: "[Evidence gaps — review required]" coral

NPCI boundary in Evidence rail:   "Dispute outcome in NPCI dispute
                                  system — not modifiable via
                                  Fluid CX."
IO judgement boundary:            "The IO desk makes the finding.
                                  Fluid CX assembles the record."
KYV check FAIL label:             "KYV root-cause check — not
                                  conducted before blacklist
                                  unlock (S038)"

Quarterly pack draft label:       "Q[N] FY26 IO Complaint Pattern
                                  Analysis — DRAFT · Awaiting
                                  endorsement before submission"
```

---

```
SCREEN: SCR-SHR-04  —  Drill-Down Panel
Persona primary: Shared (overlay panel, launched from any screen)
Daily Friction moment(s) served: Universal — every friction moment
  in Stage 1 ends at "I need to see the actual interactions."
  This screen IS the trust mechanism of the platform.

INITIAL STATE
A right-side slide panel (320px wide, full viewport height)
that overlays the current screen without replacing it. Opens from
the right edge with a 250ms ease-out animation.

On open from HeadlineBrief Card 1 (AVC misread, demo day):
  Header:
    Signal badge: "FCX-FT-S004 — AVC misread queue" (micro, grey)
    ProvenancePill: "94 interactions · trailing 12h · High confidence
      · Classifier: intent-classifier v1.4.2"
    Close X (top-right of panel)

  3 Representative Snippets (ALWAYS FIRST):
    Snippet 1 [Voice, Trinetra, 07:51]:
      "Customer: 'They charged me for two axles. My car is a Maruti.
      This is not right.' Agent: 'I understand, sir. I'll raise
      a dispute.' [Matched: AVC misread intent, vehicle-class
      mismatch phrase]"
    Snippet 2 [Voice, Anandam, 08:14]:
      "Customer: 'Khopoli plaza ne galat charge kiya. Mere car ka
      weight class 4 hai, 6 nahi.' [Matched: AVC misread, Hindi,
      plaza: NH-4 / Khopoli]"
    Snippet 3 [Chat, DigitalReach, 08:32]:
      "Customer: 'My FASTag shows car class 6 but it should be 4.
      I've called twice already.' [Matched: AVC misread + repeat
      caller S012]"

  Separator: "94 contributing interactions · Trailing 12 hours"

  Interaction list (scrollable):
    Each row: [channel icon] [timestamp] [sentiment badge]
      [BPO site, micro] [duration, micro] [signal badge if any]
    Row 1: 📞 07:51 · [Coral sentiment] · Trinetra · 4m32s ·
      [S004 fired]
    Row 2: 📞 07:54 · [Amber sentiment] · Trinetra · 3m18s
    Row 3: 💬 08:02 · [Amber sentiment] · DigitalReach · n/a
    ... (94 total, scrollable)

  Footer (fixed):
    "Open Evidence Pack →" (brand-purple button)
    "Explore in Trend Explorer →" (text link)
    Model stamp: "intent-classifier v1.4.2 · 12h window"

STATES

STATE: LOADING
  Panel slides in with a shimmer placeholder for the snippets
  and interaction list. Header loads immediately (it's fast).
  Simulated: 500ms.

STATE: OPEN — SIGNAL-VIEW
  Default after load. Signal header + ProvenancePill + 3 snippets +
  interaction list.

STATE: OPEN — TRANSCRIPT-VIEW
  User has clicked an interaction row. The top of the panel
  (below the header) switches to show the full transcript for
  that interaction. A "← Back to interactions" link appears.
  3 snippets are hidden (replaced by transcript). Interaction
  list scrolls into background.

STATE: OPEN — COACHING-VIEW
  [ADDED IN STAGE 4 — reason: Stage 3 §B.3 specified the
  DisputeEvidenceRow "Complete Now →" should open a coaching
  view with missing elements and recommended phrasing; this
  is a distinct panel state not explicitly named in Stage 3]
  Reached from: C2 DisputeEvidenceRow "Complete Now →"
  Shows: the specific dispute call's 5-element checklist with
    present/missing flags, the verbatim transcript segment where
    each missing element *should* have been captured, and the
    recommended agent phrasing for each:
      "Plaza name — Missing.
        Agent said: 'I'll raise a dispute.'
        Should have said: 'Can you confirm the toll plaza name
        from your transaction SMS?'"
  Footer: same as SIGNAL-VIEW.

STATE: OPEN — PROMISE-GAP-VIEW
  [ADDED IN STAGE 4 — reason: Stage 3 §C.3 FCRDriftPanel spec
  requires a "side-by-side first-call/callback" view; this is the
  panel state for it]
  Reached from: FCRDriftPanel promise-gap badge click.
  Shows: Two-column layout (side by side):
    Left: First call transcript excerpt — "Agent said: 'Your refund
      will be in 3-5 working days.'" [S014 promise-detected, amber
      highlight]
    Right: Callback transcript excerpt — "Customer said: 'Your
      agent told me 3-5 days. It's been 8 days.'" [promise-recall,
      amber highlight]
    Gap label: "Promise made [date/time] — [N] days ago.
      Outcome: no refund processed (Salesforce status: open)"
  This is the single most powerful coaching moment in the product.

STATE: EMPTY
  When the panel is opened but there are no contributing interactions
  (rare, usually a data join issue):
    "No contributing interactions available for this signal in
    this window." with a "Clear filters →" link.

STATE: GAP-STATE
  When the signal has a Stage 2 §F gap annotation:
    Amber banner at panel top: "This signal is [Partial —
    conversation-side only]. [One-line description of what the
    NPCI/wallet feed would add.] See Stage 2 §F for the full
    gap register."

TRANSITIONS

Trigger: Interaction row click
  From → To: SIGNAL-VIEW → TRANSCRIPT-VIEW
  Behaviour: TranscriptPane cross-fades into panel body in 200ms.
    "← Back" link appears.

Trigger: "← Back" link click
  From → To: TRANSCRIPT-VIEW → SIGNAL-VIEW
  Behaviour: Transcript fades out, snippet + list fades in, 200ms.

Trigger: "Open Evidence Pack →" button
  From → To: Any open state → SCR-SHR-03 (PACK-VIEW)
  Behaviour: Panel closes (slides right, 200ms). Full route change
    to SCR-SHR-03. 150ms fade-in.

Trigger: "Explore in Trend Explorer →" link
  From → To: Any open state → SCR-SHR-06 (Trend Explorer overlay)
  Behaviour: Panel closes. Trend Explorer overlay fades in,
    pre-filtered to the current signal and the parent screen's
    time window.

Trigger: Close X or click-outside-panel
  From → To: Any open state → panel closes
  Behaviour: Panel slides right off screen in 200ms. Parent screen
    content re-enters full width.

MICRO-INTERACTIONS

3 Snippets:
  Each snippet card: hover → card background brightens to
  brand-navy-light. The "Matched:" annotation highlights in
  brand-cyan on hover.
  Click snippet: transitions to TRANSCRIPT-VIEW for that
    specific interaction, scrolled to the matched phrase.

Interaction list rows:
  Hover: row background shifts to brand-navy. Sentiment badge
    gains a subtle glow matching its colour.
  Click: TRANSCRIPT-VIEW state.

"Open Evidence Pack →" button:
  Hover: button background transitions from brand-purple to a
    slightly lighter purple (#9B59F3) [INFERRED]. ChevronRight
    icon slides right 2px.

DEMO RHYTHM

This panel is the trust mechanism — the "show me the evidence"
moment. It is visited at T+90s (from HeadlineBrief) and again
at T+60s from COH (DisputeEvidenceRow). In both cases, the
founder should dwell on the 3 snippets for 15–20 seconds.

The three snippets should feel like a news headline and its lede:
  "Here's the signal. Here's why we believe it. Here are the voices."

COPY DECISIONS

Panel header signal badge:  "FCX-FT-S[###] — [Signal Name]"
ProvenancePill:             "[N] interactions · trailing [window] ·
                             [Confidence] · [Classifier v.version]"
Back link:                  "← Back to interactions"
Snippet match annotation:   "[Matched: [intent type], [detail]]"
TRANSCRIPT-VIEW label:      "Full transcript — [channel] ·
                             [timestamp] · [BPO site]"
Coaching view missing label: "[Element] — Missing."
Coaching view should label:  "Should have said:"
Promise-gap gap label:       "Promise made [datetime] — [N] days
                              ago. Outcome: [Salesforce status]"
Footer model stamp:          "[classifier-name] v[version] ·
                              [time-window] window"
Empty state:                 "No contributing interactions available
                              for this signal in this window."
Gap state banner:            "Partial signal — conversation-side
                              only. [One-line gap description]."
```

---

```
SCREEN: SCR-SHR-05  —  Compliance Watch
Persona primary: COH (action) · HoB (read-only)
Daily Friction moment(s) served:
  COH Friction #6 — Saksham weekly conduct review
  COH Question #6 — Is Saksham inside RBI conduct limits?
  COH Question #7 — Are agents correctly disclosing Annual Pass
    eligibility?

INITIAL STATE
Three-panel layout:
  Left (40%): Compliance Heatmap — 5 compliance types × 9 shift
    cells (3 vendors × 3 shifts). Default view: today.
  Center (35%): Active Breach Queue — live compliance violations
    this shift, in descending severity.
  Right (25%): RB-IOS 30-day Clock — open cases approaching
    the 30-day reply window deadline.

On demo day:
  Left panel: Annual Pass eligibility row (S020): 2 amber cells
    (Trinetra morning + Anandam morning). Trilingual row (S015):
    1 coral cell (Trinetra morning, 78% compliance vs. 85% target).
    All other cells green.
  Center panel: 2 active breaches listed — 1 S020 (Annual Pass
    mis-disclosure, Anandam Coimbatore, Morning, 09:17am),
    1 S015 (Trilingual violation, Trinetra, 09:03am).
  Right panel: 4 cases on the clock. Case ···-4421: 6 days
    remaining [coral]. Case ···-7803: 14 days [amber].

STATES

STATE: LOADING
  Three-panel skeleton shimmer.

STATE: POPULATED — NORMAL (some violations, manageable)
  The default operational state.

STATE: POPULATED — URGENT (Saksham conduct flagged)
  [ADDED IN STAGE 4 — reason: Saksham conduct flags have a
  materially different severity and response path than BPO
  compliance violations; they warrant a distinct visual state]
  S018 row in the compliance heatmap shows coral. A banner at
  the top of the center panel (above the breach queue):
    "SAKSHAM CONDUCT ALERT — [N] call(s) flagged this shift.
    Routed to Compliance. [See details →]"
  Boundary note below the banner:
    "Fluid CX does not act on Saksham's workflow.
    This pattern has been escalated to Compliance."

STATE: ALL-COMPLIANT (aspirational/demo-contrast)
  All heatmap cells green. Center panel shows: "No compliance
  violations this shift." Right panel clock still shows case
  deadlines. Useful as target state.

TRANSITIONS

Trigger: Heatmap cell click
  From → To: Any state → SCR-SHR-04 (DrillDown, compliance view)
  Behaviour: Panel slides in filtered to that compliance type ×
    vendor × shift. Shows the specific interactions where the
    violation was detected.

Trigger: Breach Queue "View call →" click
  From → To: Any state → SCR-SHR-04 (Transcript-View)
  Behaviour: Panel opens directly in Transcript-View for the
    specific violation interaction.

Trigger: RB-IOS Clock case click
  From → To: Any state → SCR-SHR-03 (PACK-VIEW for that case)
  Behaviour: Full route change. 150ms fade-in.

MICRO-INTERACTIONS

Heatmap cell hover: Tooltip shows: compliance type, rate today,
  target, [N] violations today, z-score vs. 30-day baseline.

Coral cell pulse animation: same as Plaza Heatmap (very low
  amplitude, 4s loop). Pauses on hover.

Breach Queue rows:
  Each row: compliance type, timestamp, BPO site + shift, excerpt.
  Hover: row highlights.
  Click: "View call →" opens DrillDown in Transcript-View.

DEMO RHYTHM

T+4min (after Saksham conduct alert fires on SCR-COH-01):
  Founder navigates to Compliance Watch. The S018 row is now coral.
  The banner reads: "SAKSHAM CONDUCT ALERT — 1 call flagged this
  shift." Founder: "This is the call Saksham made at 2:15pm. The
  customer's employer was mentioned. That's a conduct violation
  under RBI guidelines. Before Fluid CX, you'd find out about this
  call when the customer filed a complaint."
  Founder clicks the heatmap cell → DrillDown opens with the
  verbatim excerpt.

COPY DECISIONS

Screen title:           "Compliance Watch"
Saksham banner:         "SAKSHAM CONDUCT ALERT — [N] call(s)
                         flagged this shift. Routed to Compliance."
Saksham boundary:       "Fluid CX does not act on Saksham's
                         workflow. Pattern escalated to Compliance."
Heatmap row labels:     "Trilingual rule (RBI 30 Sep 2024)"
                        "Annual Pass eligibility (IHMCL)"
                        "KYV root-cause check"
                        "TAT promise compliance"
                        "Saksham conduct (RBI guidelines)"
All [OBSERVED] badges:  "[OBSERVED]"
All-compliant state:    "No compliance violations this shift."
RB-IOS clock label:     "RB-IOS 30-day reply window"
6-days-remaining:       "6 days — act now"
```

---

```
SCREEN: SCR-SHR-06  —  Trend Explorer
Persona primary: Shared (overlay — launches from any chart's
  "Explore →" button)
Daily Friction moment(s) served:
  HoB Friction #4 — "14:30: the QA sample — is it representative?"
    (here they can see the full trend, not the brief)
  COH Friction #2 — "10:30: supervisor's gut — is it accurate?"
    (BPO-dimension breakdown)

INITIAL STATE
A full-viewport overlay (z-index: above everything). Opens with a
200ms fade-in. Pre-filtered to the signal and time window that
triggered it.

On launch from SentimentDriftChart (S034, demo day):
  Signal selector: "S034 — Sentiment drift by category"
  Time window: 30d (inherited from parent chart)
  Dimension: None (single aggregated line)

  Chart (full width, Recharts LineChart):
    X-axis: trailing 30 days
    Y-axis: sentiment relative to 8-week baseline (−3σ to +3σ)
    Primary line: "AVC misread queue" — coral, sitting at −1.8σ
    Shaded band: ±1σ normal zone (lavender, 20% opacity)
    Baseline reference line: 0 (dashed, grey)

  Top controls:
    Time window pills: [24h | 7d | 30d | 90d] — 30d active
    Signal selector dropdown: all 39 in-scope signals, grouped
      by HoB / COH / Shared.
    Add dimension: [+ Plaza] [+ BPO site] [+ Channel]
      [+ Language] [+ Intent]
    Close × (top-right)

  Bottom: ProvenancePill bar: "[N] interactions · [window] ·
    [Confidence] · [Model version]" (full-width, fixed at bottom)

STATES

STATE: LOADING
  Chart area shows shimmer. Controls and provenance bar load first.

STATE: POPULATED — SINGLE-LINE
  Default after launch. One signal, no dimension breakdown.
  Baseline band visible. Chart can be read in one scan.

STATE: POPULATED — DIMENSIONED
  User has added 1–3 dimensions. Multiple lines appear on the
  chart, each labelled. Legend below chart.

STATE: POPULATED — ANOMALY-HIGHLIGHTED
  If the current signal + window shows a sustained anomaly (z <−1.5
  or >+1.5 for ≥5 days), the anomalous period is shaded in coral
  opacity on the chart. A small annotation box appears on the chart
  at the start of the anomaly: "Anomaly detected from [date]"

STATE: EMPTY — NO DATA FOR FILTER
  "No interactions match this signal / dimension / window.
  Try clearing a dimension or extending the time window."
  "Clear all filters" link.

TRANSITIONS

Trigger: Data point click on chart
  From → To: Any state → DrillDown panel opens (SCR-SHR-04)
  Behaviour: The Trend Explorer overlay stays open (behind the
    DrillDown panel). DrillDown opens for the interactions
    contributing to that specific data point's signal event.
    User can close DrillDown and return to Trend Explorer.

Trigger: Close ×
  From → To: Any state → overlay closes (parent screen resumes)
  Behaviour: 200ms fade-out. Parent screen is unchanged.

Trigger: Add dimension
  From → To: SINGLE-LINE → DIMENSIONED
  Behaviour: New lines animate in over 300ms. Legend appears.

Trigger: Time-window pill change
  From → To: Any state → re-rendered for new window
  Behaviour: Chart lines animate to new values over 300ms.
    Baseline band recalculates. ProvenancePill interaction
    count updates.

MICRO-INTERACTIONS

Chart data point hover:
  Crosshair appears. Recharts tooltip: "[Date] · [Signal value]
    · [N] interactions that day"
  Click: DrillDown panel.

Dimension pill:
  Hover: "Add [dimension name] breakdown" tooltip.
  Click: New line appears with 300ms ease.

Time-window pill:
  Active: white background, selected.
  Click: chart re-animates to new window (300ms ease).

Anomaly annotation:
  Hover: tooltip shows start date, duration, and peak z-score.

DEMO RHYTHM

T+6min (in longer demo):
  Founder clicks "Explore →" from SentimentDriftChart. Trend
  Explorer overlays the HoB screen. Shows the 30-day AVC misread
  sentiment trend. Founder: "The hardening started 6 days ago —
  before the volume spike hit this morning. This is the signal
  that arrives before the MIS pack."
  Founder adds dimension: [+ BPO site]. Three lines appear:
  Trinetra in coral (steeper decline), Anandam in amber, DigitalReach
  in green. Founder: "And when we break it by BPO site — it's
  Trinetra's calls where the sentiment is hardening. Not Anandam.
  That tells COH where to focus coaching this week."
  Founder closes → returns to HoB screen.

COPY DECISIONS

Screen title (overlay header): "Trend Explorer"
Close label:                   "Close Trend Explorer"
Add dimension pills:           "+ Plaza" / "+ BPO site" /
                               "+ Channel" / "+ Language" /
                               "+ Intent"
Dimension applied:             "[Dimension name] ×" (with × to
                               remove)
Anomaly annotation:            "Anomaly from [date] — [N] days ·
                               peak z=[value]"
Provenance bar:                "[N] interactions · [window] ·
                               [Confidence] · [Model v.version]"
Empty state:                   "No interactions match this
                               combination. Clear a dimension or
                               extend the time window."
```

---

## SECTION C — USER FLOWS (DEMO STORYLINES)

---

```
STORYLINE 1: "The 8:30am Monday Morning"
Pitched to: Head of Business (HoB)
Demonstrates: Intelligence in under 30 minutes — from 65,000
  calls to a boardroom-ready ops huddle agenda.
Starts on: SCR-HOB-01, POPULATED-DEFAULT (demo day morning state)

STEPS

1. Founder opens SCR-HOB-01.
   → Screen shows HeadlineBrief with 3 cards: AVC misread 3.2×,
     Blacklist false positive 2.1×, Recharge not reflected 1.7×.
   → Stream indicator: "Live · 4 min ago"
   → What persona learns: "Something is moving on AVC misread
     calls this morning — and I can see it at 8:30am before
     my ops huddle."

2. Founder hovers over HeadlineBrief card 1 (AVC misread).
   → ProvenancePill tooltip appears: "94 interactions · 12h ·
     High confidence (z=3.2, 8-week baseline, ASR ≥0.85) ·
     Classifier: intent-classifier v1.4.2"
   → What persona learns: "This isn't an AI guess. 94 calls,
     the model that produced it, the baseline it's measured
     against. I can walk into the 10am meeting with this."

3. Founder clicks the card.
   → DrillDown panel slides in (SCR-SHR-04, SIGNAL-VIEW).
     Three snippets visible. Snippet 2 is in Hindi.
   → What persona learns: "The calls are from multiple sites,
     multiple languages. The pattern is real and cross-vendor —
     not one Trinetra agent having a bad morning."

4. Founder clicks Snippet 1 to open the transcript.
   → Panel transitions to TRANSCRIPT-VIEW. Agent's utterance
     "I'll raise a dispute" is highlighted in coral as a
     missing-evidence marker (plaza name not captured).
   → What persona learns: "And here's why the chargeback win
     rate is slipping — the call itself didn't capture the
     plaza name. The NPCI upload is going to fail under
     code 5225."

5. Founder clicks "Open Evidence Pack →".
   → Routes to SCR-SHR-03 PACK-VIEW. Case ···-4421 assembled,
     87% completeness. Missing: plaza name, KYV check.
   → What persona learns: "The case file exists. The IO desk can
     see what was captured and what wasn't. Before 30 June,
     I need to close these gaps."

6. Founder clicks "Export PDF".
   → Print dialog opens in light mode.
   → What persona learns: "This is the Monday review deck.
     Not a PowerPoint rebuilt from last week's MIS —
     a chain-of-custody stamped pack from this morning's calls."

ENDS WITH
The HoB sees a chain-of-custody stamped evidence pack for the
AVC misread case that was assembled from this morning's
conversations — in under 30 minutes of the calls landing.

WHY THIS LANDS
"This is the moment the HoB realises they have been walking into
the 10am ops huddle with yesterday's data for two years, while the
floor was producing real intelligence every hour."
```

---

```
STORYLINE 2: "Stop Bleeding on Code 5225"
Pitched to: Customer Operations Head (COH)
Demonstrates: The chargeback win rate is being destroyed one
  missing plaza name at a time — and Fluid CX fixes it at the
  point of the call.
Starts on: SCR-COH-01, POPULATED-DEFAULT (Zone C2 showing 3
  urgent dispute rows)

STEPS

1. Founder opens SCR-COH-01 after persona switch.
   → ShiftStatusBar: all green. Zone C2 header: "7 dispute-bound
     calls · 4 complete · 3 at risk of code 5225 rejection."
   → What persona learns: "The ops console tells me immediately
     what's at risk this shift — not when I pull the weekly
     chargeback report."

2. [SIMULATED EVENT at T+30s] New row appears in C2 header
   updates to "8 dispute-bound calls · 4 complete · 4 at risk."
   → What persona learns: "A call just ended. It's in the
     evidence queue in under 30 minutes."

3. Founder clicks the oldest coral row "Complete Now →".
   → DrillDown panel opens in COACHING-VIEW.
     Shows: 5-element checklist. Plaza ✗ · Txn-ID ✓ · Class ✗ ·
     Statement ✓ · Agent ✓.
     Verbatim excerpt: "Agent said: 'I'll raise a dispute for
     the overcharge.'"
     Coaching line: "Should have said: 'Can you confirm the
     toll plaza name from your transaction SMS?'"
   → What persona learns: "The agent handled the call well —
     they just didn't ask one question. And that one missing
     question is what NPCI will reject the chargeback on."

4. Founder clicks Snippet 1 to open transcript.
   → Full transcript shows agent's utterances. The coral dashed
     underlines mark where the plaza name should have appeared.
   → What persona learns: "I can see exactly where in the
     conversation the gap opened. This isn't a QA rubric
     score — it's the actual call, highlighted."

5. Founder closes DrillDown, points to Zone C4 BPO Heatmap.
   → Trinetra Afternoon cell is coral: OC 005 completeness 78%.
   → What persona learns: "It's Trinetra's afternoon shift where
     the completeness rate is below threshold. Not the morning
     shift. I know exactly what to tell the supervisor at
     Trinetra this afternoon."

6. Founder clicks the Trinetra Afternoon cell.
   → DrillDown opens filtered to that cohort. Snippet 1 is from
     Trinetra Afternoon, confirmed.
   → What persona learns: "8 dispute-eligible calls from that
     shift this week. 78% evidence completeness. The coaching
     brief writes itself."

ENDS WITH
COH has a per-shift, per-vendor evidence-completeness number —
and the specific missing element (plaza name) — derived from
100% of calls, not 1–3% QA sampling.

WHY THIS LANDS
"This is the moment the COH realises they've been governing a
₹4–8 crore annual leakage problem with a random sample."
```

---

```
STORYLINE 3: "The 30 June or the ₹30 Lakh Fine"
Pitched to: Both personas in sequence
Demonstrates: IO-defensible evidence trails assembled in real
  time — not 4 hours per case before the RBI Ombudsman deadline.
Starts on: SCR-COH-01, Zone C3 IO Readiness Queue

STEPS

1. Founder on SCR-COH-01, points to Zone C3.
   → IO Readiness Queue shows Case ···-4421: 38% readiness,
     6 days to IO review [coral].
   → What persona learns: "This case has been open 18 days.
     The IO desk will review it in 6. Today the evidence trail
     is only 38% complete."

2. Founder clicks "Assemble Pack →" for Case ···-4421.
   → Routes to SCR-SHR-03, ASSEMBLING state.
     Assembly animation plays (5 steps, 3 seconds).
   → What persona learns: "What used to take 4 hours — searching
     recordings, pulling Salesforce notes, assembling timelines —
     takes 3 seconds."

3. Pack-view loads: 87% completeness.
   → Header shows: chain-of-custody stamp, model version.
   → Evidence rail shows: 3 signal events (S006 × 2, S022 × 1).
   → What persona learns: "Every signal that fired on this customer
     is in the pack. The IO desk can see what was happening in
     the conversation."

4. Founder points to the KYV check compliance result: FAIL.
   → Evidence rail: "KYV root-cause check — not conducted before
     blacklist unlock (S038)"
   → What persona learns: "And it tells us exactly why the
     evidence trail is incomplete. The agent unlocked the
     blacklist without running the KYV check — that's the
     gap that the IO desk would have found in their review."

5. Persona switch to HoB. Navigate to SCR-SHR-03 IO Evidence
   Pack, list view.
   → Header: "IO Evidence Pack — 186 open cases ·
     47 below 70% readiness · 30 June deadline"
   → What persona learns: "At a glance — 47 cases where I'm
     exposed to an IO finding. Not when the IO desk tells me
     on 30 June."

6. Founder clicks StrategyTile S032 "IO Quarterly Pack" from
   SCR-HOB-01. Routes to QUARTERLY-PACK-VIEW.
   → Header: "Q4 FY26 IO Complaint Pattern Analysis — DRAFT ·
     Awaiting endorsement"
   → What persona learns: "The quarterly pack the IO Directions
     require under Clause 7 — auto-assembled from the signal
     spine. I endorse it, not build it."

ENDS WITH
Both personas see the IO-defensibility surface: COH has the
case-level readiness queue; HoB has the portfolio view and the
quarterly pack. The ₹30 lakh per-case consequential-loss cap
of RB-IOS 2026 is a number both personas understand.

WHY THIS LANDS
"This is the moment they realise the IO deadline on 30 June is
no longer an operations scramble — it's a button press."
```

---

```
STORYLINE 4: "The Social Fire at 7:30am"
Pitched to: Head of Business (HoB) — real-time context for the
  PNO call decision
Demonstrates: Pattern detection at 7:30am — before the CEO's
  PA knows.
Starts on: SCR-HOB-01, POPULATED-DEFAULT
  (AlertToast fires at T+45s in the demo rhythm)

STEPS

1. Founder on SCR-HOB-01. After 45 seconds:
   → [SIMULATED EVENT] AlertToast slides in from top-right:
     "Social flare-up · NH-4 Mumbai-Pune Expressway ·
     08:04am · 21 mentions · 3.4× baseline · [negative
     sentiment cluster]"
   → What persona learns: "21 mentions in 60 minutes, 3.4×
     baseline. This is above my threshold. The question is:
     is it the acquirer's AVC sensor, or is it going to be
     in my contact centre too?"

2. Founder clicks "→ Review" on the AlertToast.
   → DrillDown opens (SCR-SHR-04, SIGNAL-VIEW for S003).
     3 snippets: 2 Twitter/X, 1 Instagram. All mentioning
     "wrong class", "Khopoli plaza", "NH-4".
   → What persona learns: "All three snippets name the same
     plaza. This is not random dissatisfaction — it's a
     specific acquirer event at one location."

3. Founder clicks "See on Plaza Heatmap" button in the DrillDown.
   → Routes to SCR-SHR-02, Plaza Heatmap. NH-4 / 08:00–09:00
     cell is coral. Adjacent hour cells are amber.
   → What persona learns: "The heatmap confirms it. NH-4,
     morning rush. Three distinct complaint types in that cell:
     AVC misread, double deduction, tag not read. This is
     an acquirer-side outage at the Khopoli plaza."

4. Founder hovers over the coral cell.
   → Tooltip: "NH-4 / Khopoli · Acquirer: ABC Bank ·
     48 interactions · 3.2× baseline · Top: AVC misread (31),
     Double deduction (11), Tag not read (6)"
   → What persona learns: "I now know the acquirer. ABC Bank
     is responsible for that plaza. I'm calling the PNO
     with a data point, not a Twitter screenshot."

5. Founder returns to SCR-HOB-01. AlertToast is now in
   acknowledged state (grey in margin). The HeadlineBrief
   shows "AVC misread queue" as card 1 — confirming the plaza
   event is now reflected in the brief.
   → What persona learns: "The signal is now in my brief.
     When I walk into the 10am huddle, this is agenda item 1."

ENDS WITH
HoB has made the PNO call decision in under 90 seconds — with
acquirer attribution, plaza name, and a screenshot of the heatmap
rather than a guess from a viral tweet.

WHY THIS LANDS
"This is the moment they understand the difference between social
listening and signal intelligence. Social listening told them
the tweet happened. Fluid CX told them it's a specific acquirer's
AVC sensor at a specific plaza — before the CEO's PA flagged it."
```

---

```
STORYLINE 5: "What Trinetra's Afternoon Shift Is Hiding"
Pitched to: Customer Operations Head (COH)
Demonstrates: The specific BPO-shift question COH has been unable
  to answer with 1% QA sampling — answered with evidence.
Starts on: SCR-COH-01, POPULATED-DEFAULT (BPO Heatmap Zone C4
  showing Trinetra Afternoon cell in coral)

STEPS

1. Founder on SCR-COH-01. Zone C4 BPO Heatmap is visible.
   Trinetra Afternoon cell is coral.
   → What persona learns: "My QA scores for Trinetra's afternoon
     shift look acceptable on the 1% sample. But the Fluid CX
     heatmap is telling me that shift is the worst performer
     across three metrics."

2. Founder clicks the Trinetra Afternoon cell.
   → DrillDown opens (SCR-SHR-04, SIGNAL-VIEW).
     ProvenancePill: "1,842 interactions this week · Trinetra
     Hyderabad · Afternoon shift · Composite score flagged"
     3 snippets — all showing the same pattern: agent unlocks
     the blacklist without asking about vehicle class. In Hindi,
     Tamil, and English.
   → What persona learns: "1,842 calls. Not a 1% sample — all of
     them. And the pattern in all three languages is: the agent
     removes the blacklist without running the KYV check. That's
     why repeat-call rate is climbing."

3. Founder points to FCR Drift Panel (Zone C5).
   AVC misread row: 18% repeat-call rate, +4pp WoW. Promise-gap
   badge: "Agent promise gap · 8 callbacks."
   → What persona learns: "8 callbacks in the last 7 days where
     the customer said 'your agent told me' — and the promise
     wasn't delivered. The repeat-call rate isn't a mystery.
     It's specific, traceable promises."

4. Founder clicks the promise-gap badge.
   → DrillDown opens in PROMISE-GAP-VIEW. Two columns: first call
     (agent: "Your tag will work fine now"), callback 3 days later
     (customer: "Your agent said it was fixed. It's still
     blacklisted at every plaza.").
   → What persona learns: "The agent said it was fixed. It wasn't.
     We can see both sides of the gap. This is what I bring to
     the Trinetra supervisor meeting on Thursday — not a QA
     rubric score. An actual call pair."

5. Founder navigates to SCR-SHR-06 Trend Explorer.
   Adds [+ BPO site] dimension. Shows Trinetra Afternoon line
   dropping versus Anandam and DigitalReach lines.
   → What persona learns: "The trend is clear. Trinetra afternoon
     has been on a 3-week decline. This is a coaching priority,
     not a vendor-contract conversation. Yet."

ENDS WITH
COH has the specific coaching brief for Trinetra's afternoon
supervisor: cohort-level evidence, the promise-gap pair, and
the trend line. Not a surveillance dossier — a coaching brief
built from 100% of calls.

WHY THIS LANDS
"This is the moment the COH realises that 'we only QA 1% of calls'
has been costing them 4 percentage points on the repeat-call rate
— with the fix one supervisor coaching session away."
```

---

## SECTION D — EMPTY, LOADING, ERROR, AND BOUNDARY STATES

| Screen ID | State | What Renders | Copy | Why this matters for the demo |
|---|---|---|---|---|
| SCR-HOB-01 | LOADING | Shimmer cards on all zones; HeadlineBrief zone resolves first at 500ms | "Analysing conversations..." with cyan spinner in left rail | Shows the platform is *computing*, not just fetching — reinforces the 30-minute intelligence promise |
| SCR-HOB-01 | EMPTY — no anomalies | Single green card, full width, in Zone B1 | "Baseline holding — no anomalous signals in the last 12 hours. Last checked [timestamp]." | Useful contrast: "On a quiet morning, here's what you see — and notice the stream indicator is still live." |
| SCR-HOB-01 | EMPTY — Action Queue | Single green row in Zone B2 | "No outstanding action items · [timestamp]" | Shows the queue is real-time and goal-oriented — when nothing is needed, it says so clearly |
| SCR-HOB-01 | ERROR — Salesforce join | Zone B4 (Channel Quality) and zone B2 S010 row show amber gap notices; rest functions | "[Zone title] — Salesforce join temporarily unavailable · last data: [timestamp]" | Demonstrates honest error handling: the product doesn't pretend the data is there; it tells you exactly what's missing and when the join last worked |
| SCR-HOB-01 | BOUNDARY — S013 partial | Permanent amber "partial" badge on S013 sub-tile in Zone B3; boundary microcopy always visible | "Conversation-side only. Full chargeback ratio requires NPCI dispute feed." | Critical for trust: shows the product knows what it doesn't know. A senior banker will probe this; having an honest answer builds credibility |
| SCR-COH-01 | LOADING | ShiftStatusBar resolves at 500ms (vendor names and shift labels appear; queue metrics shimmer). Other zones shimmer. | "Analysing conversations..." | ShiftStatusBar-first loading is the right priority: COH needs the floor picture before everything else |
| SCR-COH-01 | EMPTY — C2 clean | Green banner in Zone C2 | "All dispute-bound calls have complete evidence packs this shift." with CheckCircle | The most important achievable operational state — show it as the goal; makes the problem in the default demo state feel more urgent |
| SCR-COH-01 | EMPTY — C3 clean | Green banner in Zone C3 | "All open cases have evidence readiness ≥70%." | Same as C2 — the target state makes the risk in the default state visceral |
| SCR-COH-01 | SHIFT-HANDOVER | C1 shows prior-shift data in grey alongside current-shift incoming; C4 shows "Night shift data" labelled rows at reduced opacity | "Night shift ended [N] min ago · Morning shift accumulating" | Shows the handover moment — the exact Daily Friction moment from Stage 1 Friction #1 |
| SCR-COH-01 | ERROR — Genesys feed | C1 queue depth shows "--×" with amber warning icon; S021 cannot compute | "Genesys queue feed temporarily unavailable — last values from [timestamp]" | Reinforces that the platform integrates real systems; gaps are named and timed |
| SCR-COH-01 | BOUNDARY — Saksham | C6 Saksham tile permanent boundary note below tile | "Fluid CX monitors conduct patterns. Fluid CX does not act on Saksham's workflow." | Demos the product boundary clearly to a COH who might wonder "can I tell Saksham to retrain agents?" |
| SCR-SHR-01 | EMPTY — quiet shift | Single green card | "No alerts this shift · [N] interactions processed · Baseline holding since [shift-start-time]. Last alert: [date/time] · [signal name]." | Showing the last-alert timestamp demonstrates the platform has been running continuously |
| SCR-SHR-01 | BOUNDARY — Saksham conduct alert | Coral banner above breach queue | "Fluid CX does not act on Saksham's workflow. This pattern has been escalated to Compliance." | Prevents the demo audience from asking "what does it do with this?" — answers proactively |
| SCR-SHR-02 | LOADING | Grid skeleton shimmer (row + column labels render first) | — | Row/column labels first shows the structure before the data |
| SCR-SHR-02 | EMPTY — filter no result | Empty grid with a clear-filters call to action | "No plazas match this filter combination. Clear a filter to see data." | Normal UX hygiene; shows filtering works |
| SCR-SHR-03 | ASSEMBLING | Full-screen 5-step assembly animation (3s) | Step labels: "Retrieving interactions... ✓" / "Linking complaint case... ✓" / "Running compliance checks..." / "Extracting evidence elements... ✓" / "Finalising chain of custody... ✓" | The animation is the value demonstration — 4 hours of manual work in 3 seconds, narrated by the steps themselves |
| SCR-SHR-03 | PACK — INCOMPLETE | Amber completeness bar; orange banner at top of pack | "This pack has [N] missing elements. The IO desk may request additional evidence. [View gaps →]" | Shows what gap-closure work looks like; the COH can see exactly what to close in 72 hours |
| SCR-SHR-03 | BOUNDARY — NPCI | Permanent in evidence rail alongside dispute linkage | "Dispute outcome in NPCI dispute system — not modifiable via Fluid CX." | Clear scope statement; prevents the demo question "can Fluid CX file the dispute for me?" |
| SCR-SHR-03 | BOUNDARY — IO judgement | Permanent note in evidence rail header | "The IO desk makes the finding. Fluid CX assembles the record." | Reiterates the product boundary in the most important context (the IO evidence pack itself) |
| SCR-SHR-04 | LOADING | Panel slides in with shimmer; signal header and ProvenancePill render first | — | Signal header first because that's the signal identity — the rest is evidence |
| SCR-SHR-04 | EMPTY — no interactions | Empty panel with explanation | "No contributing interactions available for this signal in this window." with "Clear filters →" | Prevents an embarrassing blank panel; explains what happened |
| SCR-SHR-04 | GAP-STATE | Amber banner at top of panel | "Partial signal — conversation-side only. [One-line gap description]. Full capability requires [system join]." | Maintains trust — even in the DrillDown, the partial-data boundary is visible |
| SCR-SHR-05 | ALL-COMPLIANT | All heatmap cells green; empty breach queue | "No compliance violations this shift." | The aspirational target state; shows what "success" looks like on this surface |
| SCR-SHR-06 | LOADING | Chart area shimmer; controls render first | — | Controls first because the user may change filters before the chart loads |
| SCR-SHR-06 | EMPTY — filter combo | Empty chart area; clear-filters CTA | "No interactions match this combination. Clear a dimension or extend the time window." | Standard UX for filter-no-result |

---

## SECTION E — TRANSITIONS AND ANIMATIONS

**Drill-down expansion.** When the persona clicks any number, chart point, queue row, or heatmap cell, the DrillDown panel slides in from the right edge of the viewport in **250ms with a cubic-bezier ease-out** (`ease-out` in CSS, or `cubic-bezier(0.0, 0.0, 0.2, 1.0)` for a Material-style ease). The panel overlays the main content — the main content does NOT compress or shift. Focus management: on panel open, keyboard focus moves to the close button (first focusable element); on close, focus returns to the element that triggered it. In React JSX, this is implemented as a fixed-position div with a `translateX` transform, toggled via a CSS class.

**Evidence Pack open.** From the DrillDown panel's "Open Evidence Pack →" button: (1) the DrillDown panel closes with a **200ms ease-in slide to the right**, simultaneously (2) the app navigates to SCR-SHR-03 with a **150ms fade-in** (`opacity: 0 → 1`). The user experiences a rapid two-step close/open that feels like a purposeful forward navigation rather than a popup. From the "Assemble Pack →" button on the IO Readiness Queue (SCR-COH-01 C3): full route change with the ASSEMBLING state's 3-second assembly animation playing on arrival — this is intentionally slow and dramatised.

**Persona switching.** The demo toggle between HoB and COH views is an **instant re-render** — no animation. The active left-rail item changes (purple left-border highlight transitions in 100ms). The main content area re-renders immediately. Speed here serves the demo: founders need to switch personas fluidly during a meeting without a distracting screen wipe. In React JSX: a context variable controls which persona's primary screen renders; switching sets the variable and triggers a re-render.

**Time-window switching.** When the user clicks a time-window pill (24h / 7d / 30d / 90d), the chart re-renders its data over **300ms** using Recharts' built-in animation (`isAnimationActive={true}`, `animationDuration={300}`). The baseline band fades out and re-renders for the new window in the same 300ms. The ProvenancePill interaction count updates with a brief number-change animation (100ms colour flash from white → cyan → white). The visual effect should feel like turning a dial, not reloading a page.

**Alert firing live.** When a simulated new signal fires during dwell (the demo rhythm timer events), the AlertToast enters from the top-right corner with a **200ms ease-in slide-down** followed by a **brief coral border pulse** (500ms, opacity cycling from 100% → 50% → 100%). On SCR-COH-01, the ShiftStatusBar badge for the relevant signal increments simultaneously with a **300ms scale pulse** (scale 1 → 1.2 → 1.0). This animation is intentionally noticeable — the persona should look up from what they're doing and say "what was that?"

**Acknowledge action.** When the persona clicks "Review →" on an ActionQueueRow or DisputeEvidenceRow, the row **immediately** transitions to in-progress state (150ms background colour transition from transparent → brand-amber-10% opacity). The row does not move or collapse — it stays in place with the amber left border. When "Mark Resolved" is clicked, the row collapses over **200ms** (height from natural → 0, opacity 100% → 0), and the collapsed row slots into a "Resolved today" section at the bottom of the queue with a **100ms accordion-style** reveal. The queue count in the header decrements simultaneously.

---

## SECTION F — THE RHYTHM OF THE DEMO

A 7-minute demo session. The prototype must feel like it is running live — signals arriving, data updating, the 30-minute promise made visible without the founder having to say "imagine this updates every 30 minutes." Specify the simulated event timeline below. All timed events are implemented as `setTimeout` calls in the prototype's mock-data layer (Stage 6/7).

**T+0s:** User lands on SCR-HOB-01 in POPULATED-DEFAULT state. HeadlineBrief shows three cards. The stream indicator reads "Live · 4 min ago." Founder describes the morning brief scenario. The demo begins.

**T+20s:** Founder hovers over HeadlineBrief card 1. ProvenancePill tooltip appears. Founder points to the model version stamp. "Every number on this screen can tell you exactly what produced it."

**T+45s:** **[SIMULATED EVENT]** — AlertToast slides in from the top-right corner. Content: "Ombudsman threat · Trinetra Hyderabad · Morning shift · 1 call · High confidence." The stream indicator briefly shows "Updated just now" (5s), then resumes incrementing. This event fires regardless of what the founder is doing on screen — it demonstrates the live-stream nature of the platform viscerally.

**T+90s:** Founder clicks the AlertToast "→ Review." DrillDown panel slides in with the Ombudsman-threat signal. Founder reads the 90s-before-the-threat excerpt. Then clicks a snippet to open the transcript. Then "Open Evidence Pack →" — navigates to SCR-SHR-03.

**T+2min:** On SCR-SHR-03. Assembly animation plays if reached via "Assemble Pack →". Pack view shows 87% completeness. Founder points to the KYV check FAIL and the chain-of-custody stamp. "4 hours of manual case assembly — in 3 seconds."

**T+3min:** Persona switch to COH. SCR-COH-01 loads. ShiftStatusBar resolves first. Founder points to C2 OC 005 queue header: "3 at risk of code 5225 rejection."

**T+3m30s:** **[SIMULATED EVENT]** — New DisputeEvidenceRow appears in C2. Row flashes brand-purple for 300ms, settles coral. Header count increments: "4 at risk." Founder: "One just came in." This event fires once, on the COH screen, 30 seconds after the persona switch.

**T+4min:** Founder clicks the oldest coral row "Complete Now →". DrillDown opens in COACHING-VIEW. Founder reads the coaching prompt. "This is how you close the code 5225 gap."

**T+4m30s:** **[SIMULATED EVENT]** — C1 S018 badge increments from 0 → 1. C6 Saksham tile flips from green to coral, pulses once. Founder: "A Saksham Recovery call just flagged for aggressive language. Before Fluid CX, you find out about this when the customer files a complaint."

**T+5min:** Founder clicks the S018 badge in C1 → navigates to SCR-SHR-01 (Live Alerts) showing the Saksham conduct alert card. Then clicks "View call →" → DrillDown opens with the verbatim violation excerpt. "There it is."

**T+5m30s:** Founder navigates to Compliance Watch (SCR-SHR-05). Points to the coral cell in the Saksham row. Clicks the heatmap cell → DrillDown shows the specific violation interaction.

**T+6m30s:** Persona switch back to HoB. Clicks "Explore →" on SentimentDriftChart → Trend Explorer overlay opens. Founder adds BPO site dimension. Three lines appear. Trinetra in coral. "The sentiment hardening is Trinetra — not Anandam."

**T+7min:** **[SIMULATED EVENT — optional, for extended demos]** — HeadlineBrief stream indicator resets from "Live · 7 min ago" back to "Updated just now" (simulating a new computation cycle). The card 1 count increments slightly (94 → 97 calls). "Still computing. Still surfacing. Not when the regulator calls — 30 minutes after the conversation ends."

---

## SECTION G — HANDOFF SPECIFICATION TO STAGE 5

### Screen routing requirements

Stage 5 must wire 6 routable screens and 2 overlay surfaces:

```
ROUTABLE (URL or React Router routes):
  / or /hob          → SCR-HOB-01 (Setu Intelligence)
  /coh               → SCR-COH-01 (Operations Console)
  /alerts            → SCR-SHR-01 (Live Alerts)
  /plaza-heatmap     → SCR-SHR-02 (Plaza Heatmap)
  /evidence-pack     → SCR-SHR-03 (IO Evidence Pack, list view)
  /evidence-pack/:id → SCR-SHR-03 (IO Evidence Pack, pack view)
  /compliance        → SCR-SHR-05 (Compliance Watch)

OVERLAY SURFACES (no URL change, React state/context):
  DrillDown Panel    → SCR-SHR-04 (right-slide overlay)
  Trend Explorer     → SCR-SHR-06 (full-viewport overlay)
```

For the single-file Claude Artifact prototype (Stage 7), routing is implemented via React state (a `currentScreen` variable) rather than React Router, since there is no router available in the Artifact environment. All "routes" are state changes.

### State model implications

**Screen-local state:** Every screen manages its own zone content (populated/loading/empty/error/boundary). State is local to the screen component.

**Cross-screen shared state:**
- `persona`: `'HoB' | 'COH'` — determines which primary screen renders and which version of shared signals are shown. This is the persona switcher's state.
- `activeDrillDown`: `{ signalId, filters } | null` — shared across all screens because DrillDown can be launched from any screen.
- `activeAlerts`: `Array<AlertEvent>` — the live alerts list. Shared between SCR-SHR-01 and the AlertToast overlay on both primary screens.
- `evidencePackAssembling`: `{ caseId, progress } | null` — tracks the assembly animation state for SCR-SHR-03.

**Timer-driven state (demo rhythm — `setTimeout` or `setInterval`):**
Four simulated events must fire on timers in the prototype:
1. `T+45s`: Fire `AlertToast` for S006 on the HoB screen.
2. `T+30s after persona switch to COH`: Insert new `DisputeEvidenceRow` in C2.
3. `T+4m30s from session start` (or `T+90s after COH screen loads`): Increment S018 badge in C1; flip Saksham tile to coral.
4. `T+7m` (optional extended demo): Increment HeadlineBrief call count and reset stream indicator.

Stage 6 mock data must include the simulated-event payloads as named data fixtures that the timer callbacks can dispatch. Stage 7 wires the timers.

### Component reuse signals

The following Stage 3 components appear on multiple screens and must be implemented as **shared React components** in Stage 5:

| Component | Appears on |
|---|---|
| `ProvenancePill` | All 6 screens + both overlays — the most widely shared component |
| `AlertToast` | SCR-HOB-01 (overlay), SCR-COH-01 (C1 badge), SCR-SHR-01 (full card) |
| `ActionQueueRow` | SCR-HOB-01 (B2), SCR-COH-01 (C2, C3) |
| `IOReadinessRow` | SCR-COH-01 (C3), SCR-SHR-03 (list view) |
| `StrategyTile` | SCR-HOB-01 (B6), SCR-COH-01 (C7), SCR-SHR-05 (as ComplianceTile variant) |
| `DrillDownPanel` | Shared overlay launched from all 6 screens |
| `TranscriptPane` | SCR-SHR-03 (Evidence Pack center), SCR-SHR-04 (DrillDown TRANSCRIPT-VIEW) |

### Mock-data shape implications

Stage 6 must produce JSON fixtures with this general shape. Stage 5 will formalise the TypeScript types; these are the semantic requirements:

```
headline_brief: {
  signals: [
    { signal_id, category_label, z_score, interaction_count,
      baseline_multiplier, time_window, representative_snippet,
      confidence_band, confidence_reason, model_version }
    // ×3 items
  ],
  last_updated_min_ago: number
}

action_queue: [
  { signal_id, title, count, impact_line, downstream_owner,
    inference_or_observed, state, provenance: { count, window,
    confidence_band, model_version } }
]

dispute_evidence_queue: [
  { interaction_id, minutes_elapsed, evidence_elements: {
    plaza: bool, txn_id: bool, vehicle_class: bool,
    customer_statement: bool, agent_confirmation: bool },
    bpo_site, shift, urgency_tier, provenance }
]

io_readiness_queue: [
  { case_id_masked, category, readiness_score, days_open,
    days_to_io_review, missing_elements: string[],
    salesforce_status, provenance }
]

bpo_heatmap: {
  cells: [
    { vendor, shift, repeat_call_rate, fcr_proxy, oc005_completeness,
      composite_status, z_scores: { repeat_call, fcr, oc005 } }
  ]
}

signal_events_for_alerts: [
  { signal_id, severity, description, interaction_count, timestamp,
    bpo_site, shift, verbatim_excerpt, provenance }
]

evidence_pack: {
  pack_id, assembled_ts, case_id_masked, tag_last4, date_range,
  completeness_percent, missing_elements: string[],
  chain_of_custody: { component, version, timestamp },
  interactions: [
    { interaction_id, channel, timestamp, duration, sentiment,
      bpo_site, shift, has_transcript: bool, signal_events: [],
      compliance_check_outcomes: [] }
  ],
  evidence_rail: {
    signal_events: [], compliance_checks: [],
    crm_linkage: {}, npci_dispute_linkage: {}
  }
}

demo_events: [
  { fire_at_ms: 45000, event_type: 'alert_toast',
    payload: { signal_id: 'FCX-FT-S006', ... } },
  { fire_at_ms: 'COH_LOAD+30000', event_type: 'new_dispute_row',
    payload: { ... } },
  { fire_at_ms: 270000, event_type: 'saksham_conduct_flag',
    payload: { signal_id: 'FCX-FT-S018', ... } }
]
```

### Performance constraints

Single-file React JSX artifact, must render in Claude Artifact preview with these hard constraints:
- **No external API calls** — all data from mock fixtures in-file or in Stage 6 JSON.
- **Recharts + lucide-react only** for charts and icons — no D3, no other charting library.
- **No localStorage or sessionStorage** — all state in React useState/useReducer.
- **Simulated timers via `useEffect` + `setTimeout`** — the demo rhythm fires without any backend.
- **Single `App` component** with a `currentScreen` state variable managing routing — not React Router.
- **No canvas elements** — all charts via Recharts SVG.
- **Tailwind utility classes** — no custom CSS files (single-file constraint). Extended colours (`brand-purple`, `brand-cyan`, `brand-coral`, `brand-canvas`, `brand-lavender`, `brand-navy`, `brand-slate`, `brand-green`, `brand-amber`) must be defined in the Tailwind `extend.colors` object within the config at the top of the file, or implemented as hardcoded hex values in className strings. In a single-file Artifact, the latter approach is more practical.
- **Persona switch must be instant** — no async operations on persona switch. All data for both personas is loaded in the initial mock-data fixture.
- **DrillDown panel state must not lose context on persona switch** — if a DrillDown is open when the persona switches, it should close cleanly (the persona switch dismisses any open overlay).

---

*End of Stage 4 output. Feed-forward to Stage 5 (Frontend Architecture): Section A screen IDs and routing requirements are the component-tree root. Section B state machines are the state-management specification. Section C storylines are the interaction acceptance tests. Section E transitions are the animation spec. Section F demo rhythm events are the `setTimeout` payloads Stage 6 must deliver and Stage 7 must wire. Section G handoff block is the input to Stage 5's technical design.*