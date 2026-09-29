# 04 · UX, Screens, Copy & Transitions — LiSN × KGS Global Commercial Fire demo

**For:** Ranjit BK (build in Cursor, one day) · **Owner:** YaaraLabs / LiSN · **v2.1 · 28 Sep 2026** (reconciled with 01, 02, 03, the mock data and Ranjith's lead decisions) · **Companion:** `05a_Data_Contract.md`

**How to read this file**
- `P0` must ship tomorrow · `P1` ship if time allows (same day) · `P2` later / polish.
- Strings in "double quotes" are **exact UI copy**. British spelling. "LiSN" only (never uppercase-transformed: a CSS `uppercase` on "LiSN" renders "LISN", which 01 bans; write caps labels as literal "LiSN INSIGHT").
- **Source of truth:** exec-level copy (Brief, Pulse, question cards, Field Signal Monitor cards, Applied value strip) and **every value figure** come from `02_Requirements_Pain_Value.md` (§2 value register V-01…V-14). Visual tokens and component names come from `03_Look_and_Feel_Reference.md`. Panel-level detail is specified here.
- `→ bind:` names a field in `05a_Data_Contract.md`. `{{…}}` inside copy is an anonymisable token (§7.1); render all copy through `fmt(str, anon)`, exported by `mock/lib/label.ts` (in components use `useLabel()` from `mock/lib/demoState.ts`, which wraps it). `label(kind, key, anon)` in the same file resolves a single token key only.
- Every number is `[illustrative]`. Every money figure carries the "ILLUSTRATIVE" micro-chip (03 §6.4). **Never add $ and £; never total unlike exposures.**
- Reuse the bank repo's components. Do not rewrite the design system.

### v2 changelog (what changed from v1 of this file)
1. Question-card big number is now the **count of signals above threshold** with a week-on-week delta; the 0–100 index is removed everywhere. The ⓘ popover is now "What's counted".
2. Gauges, Brief, Pulse, question-card copy, Field Signal Monitor cards and the Applied value strip now use 02's exact strings and figures (V-register). The EST4 RMA rate is now 0.28% vs a 0.35% limit.
3. Field Signal Monitor has 5 signal cards in 02's order (fw 4.1 · D-2 · ESD-SE-07 · N-3 · UK-EU) and ends with a "212 look-alikes suppressed" card. The EDI acknowledgement watch card is removed (02 counts the EDI cutover as clean). Evidence readiness moves to its own tile beside the governed watch.
4. W-1 is routed on first detection, **6 Sep 14:38 UTC**. 23 Sep 10:02 is when the back-search updated its chronology.
5. The approval timestamp is the **live click time**, "DD Mon HH:MM UTC". The same value is used on the gate, in the audit log and in the toast.
6. Anonymise is OFF by default. Watermark and forced anonymise on print/export stay.
7. The logo is a LiSN monogram placeholder. No bank, YaaraLabs "Y", client or partner logos.
8. Wording is "above threshold this week", never "crossed a threshold this week".
9. Borders: Q1 orange highlighted, Q2 teal, Q3 sky-400.
10. Component names now follow 03 (mapping in §0.2).

---

## 0. Visual language and component names

### 0.1 Visual rules
Tokens, colours, radii, type and chip styles: **03 §2 and §6 verbatim**. Additional rules:
- Severity always renders as "S# · word" + glyph (03 §6.1). S1 red "Life-safety / regulatory" · S2 amber "Material impact" · S3 slate "Operational" · S4 grey "Efficiency".
- Direction words: "Rising / Easing / Stable" (03 §5.1). Status chip "WATCH" only as a status.
- Retired strings: 03 §5.1 plus "index", "health score", "crossed a threshold this week", "RMA + firmware enhanced" (v1 name).

### 0.2 Component name mapping (this file → 03)
This file uses 03's names throughout. Mapping from v1 of this file, and for the few pieces 03 does not name:

| v1 name in 04 | 03 name (use this) | Notes |
|---|---|---|
| Left icon rail | `LeftRail` | |
| Header bar | `DrillHeader` | |
| "← Back to Overview" | `BackToOverviewHeader` | |
| Context bar | `ContextBar` | |
| Funnel strip | `FunnelStrip` | |
| Synthetic badge | `SyntheticBadge` | |
| Anonymise toggle | `AnonymiseToggle` | |
| Footer | `FixedFooter` | |
| Executive Brief bar | `ExecBriefBar` | |
| Executive Pulse | `PulseStrip` + `PulseCard` | |
| Question card | `QuestionCard` (+ `ScoreDelta`, `SemiGauge`, `AreaTrend`, `MiniKPI`, `InsightBox`) | |
| Monitor card | `RiskSpikeCard` (+ `MetricBeforeAfter`, `RecommendationBox`) under `SectionHeader` "Field Signal Monitor" | |
| Signal Wall | `AISummaryWall` → "LiSN Signal Wall" (+ `WallCard`, `WallFooterCounts`) | |
| Enhanced panel | `EnhancedPanel` (+ `StuckDriverBars`, `AgedCaseWatchlist`) | |
| Diagnosis box | `DiagnosisBox` | |
| Stacked bar + detail | `StackedBarWithDetailPanel` + `DetailPanel` | |
| `SeverityChip` / `SeverityStrip` | same | |
| `ConfidenceMarker` | same | |
| `JoinTags` | `JoinTagRow` | |
| `PnLTag` + `IllusTag` | `PnLDestinationTag` (includes the "ILLUSTRATIVE" micro-chip) | Standalone money elsewhere uses the same micro-chip (`IllustrativeChip`) |
| `OwnerTag` | `RoutedOwner` | |
| `GateChip` / `HumanGate` | `HumanGateStatus` (+ compact chip) + `ApproveButton` | |
| `RankChip` + popover | `RankChip` + `WhyRankedPopover` | |
| Chips on hero | `SignalChips` | |
| Counter-evidence | `CounterEvidence` | |
| `FirmwareLineageChart`, `DateCodeHeatStrip`, `EvidenceDrawer`, `GovernedWatchTile` (+ `ClockRing`) | same | |
| Empty tile text | `EmptyScope` | |
| Ask-LiSN button | `FloatingAIButton` | |
| `IndexInfo` | **removed** → `WhatsCountedPopover` (NEW, not in 03) | §2.5 |
| `ValueLedger` | **`AppliedValueStrip`** (NEW wrapper around 03 `KpiTile` ×6) + `HowWeCountDrawer` (NEW; reuses `EvidenceDrawer` shell) | §2.6 |
| — | `SuppressedEndCard` (NEW; `RiskSpikeCard` shell, neutral tint) | §2.7 |
| — | `EvidenceReadinessTile` (03 `KpiTile` variant) | §2.9 |
| `DraftPreviewModal` | same (NEW, not in 03) | §4.11 |
| Toast | `DecisionToast` (repo toast or NEW) | |
| Demo menu | `DemoMenu` (NEW) | §7.3 |

---

## 1. Global shell (every route) — P0

### 1.1 Route map

| Route | Screen | Priority | Rail item |
|---|---|---|---|
| `/` | Exec overview — "Global Commercial Fire — Signals this week" | P0 | Overview |
| `/installed-base` | Q1 drill-down — "Is our installed base healthy?" | P0 | Installed base |
| `/installed-base/signal/fw-4-1` | Hero deep-dive (the double-click) | P0 | Installed base (active) |
| `/signals/A1` | Redirect → `/installed-base/signal/fw-4-1` (02 HS-1 names this route) | P0 (one line) | — |
| `/channel` | Q2 drill-down — "Are we holding our channel?" | P1 | Channel |
| `/separation` | Q3 drill-down — "Is the separation costing us?" | P1 | Separation |
| `/signal/:id` | Generic deep-dive for monitor cards 2–5 (`dc-d2-2611`, `esd-se-07`, `n3-backorder`, `ukeu-entity-cutover`) | P2 (P1 fallback: link to the drill-page anchor, e.g. `/channel#esd-se-07`) | inherits parent |

Query params: `?anon=1` forces anonymised mode (P0) · `?intro=0` skips intro (P1).

### 1.2 `LeftRail`
| Order | Icon (lucide) | Tooltip | Route |
|---|---|---|---|
| top | **LiSN monogram placeholder**: 36px tile, `--brand-tint` bg, violet-300 text "Li" (Outfit 800), `title="LiSN"`. Replaces the bank "Y" mark. Remove the two amber placeholder squares. **No client, bank, YaaraLabs or partner logos anywhere.** | "LiSN" | `/` |
| 1 | `Activity` | "Signals this week" | `/` |
| 2 | `Cpu` | "Is our installed base healthy?" | `/installed-base` |
| 3 | `Handshake` | "Are we holding our channel?" | `/channel` |
| 4 | `Split` | "Is the separation costing us?" | `/separation` |
| — | divider | | |
| 5 | `Lock` | "Governed safety & cyber watch (restricted)" | scrolls to the watch tile on `/` |
| bottom | `ArrowLeft` | "Back" | `history.back()` |
| bottom | `SlidersHorizontal` | "Demo controls" | opens `DemoMenu` (§7.3) |

### 1.3 `DrillHeader` (all routes; on `/` too)

| Route | Title | Breadcrumb (exact; `{role}` = "President" or "VP Engineering") |
|---|---|---|
| `/` | "Global Commercial Fire — Signals this week" | "Installed-base early warning · Hear it at the third call, not the monthly review." (02 §1 category + promise) |
| `/installed-base` | "Is our installed base healthy?" | "Global Commercial Fire · {role} · Installed base · Firmware · Date codes · RMA" |
| `/installed-base/signal/fw-4-1` | "Signal #1 of 5 — firmware 4.1 cohort" | "Global Commercial Fire · {role} · Installed base · {{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)" |
| `/channel` | "Are we holding our channel?" | "Global Commercial Fire · {role} · Channel · Strategic Partners / ESDs · Backlog" |
| `/separation` | "Is the separation costing us?" | "Global Commercial Fire · {role} · Separation · Entity · Portal · ERP / EDI · DSO" |

### 1.4 `ContextBar` (sticky, 56px) — P0
| Element | Copy | Behaviour | Priority |
|---|---|---|---|
| Brand | "Brand" + "All ▾" (All + the six brands as tokens) | P0 renders; P1 re-scopes monitor cards and walls by `joinTags.brand`; empty tiles show `EmptyScope` "No signal above threshold in this scope" | P0 / P1 |
| Region | "Region" + "All ▾" ("All", "NA", "UK-EU", "MEA", "India", "China", "APAC/AUS", "LatAm") | same | P0 / P1 |
| Period | "Period" + "26 weeks to 25 Sep 2026 ▾" (others greyed: "13 weeks", "52 weeks — Discovery") | static | P0 |
| Role | "Role" + "President ▾" | global switch P2. The P0 approval path is the local "Viewing as" control on the hero (§4.9). | P2 |
| Data as of | "Data as of 25 Sep 2026 18:00 UTC" | static | P0 |
| Anonymise | `AnonymiseToggle` "Anonymise names" — **default OFF** | §7.1 | P0 |
| Badge | `SyntheticBadge` **"SYNTHETIC SCENARIO — illustrative data, not KGS data"** | always visible; z-index above drawer and modal backdrops; tooltip "Every figure, firmware version, serial, date code and partner ID on this screen is synthetic. Nothing here is a finding about any KGS product." | P0 |

### 1.5 `FixedFooter` — P0
"Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved."

### 1.6 Shared components
Specs are in 03 §6. Behaviour notes specific to this demo:

| Component | Note | Priority |
|---|---|---|
| `SeverityChip` / `SeverityStrip` | 03 §6.1. Compact form on cards: "S2 ▲ · Cliff · 1,240 panels · Incident off". | P0 |
| `ConfidenceMarker` | 03 §6.2. Tooltip: "K = joined, verified records. I = text-extracted or imputed. Kept separate on every signal." | P0 |
| `JoinTagRow` | 03 §6.3, prefix "JOINED ON". | P0 |
| `PnLDestinationTag` | 03 §6.4. Money never green or red. | P0 |
| `RoutedOwner` | 03 §6.5. Roles only. | P0 |
| `HumanGateStatus` + `ApproveButton` | 03 §6.6, with the copy in §4.9 here. | P0 |
| `IllustrativeChip` | the 03 §6.4 "ILLUSTRATIVE" micro-chip, standalone, after every money value | P0 |
| `DecisionToast` | top-right under the ContextBar, 4 s, dismissible | P0 |

---

## 2. Exec overview `/` — P0

### 2.1 Layout (03 §1.3 plus 02 §4 placement)

| # | Region | Component | Grid | Priority |
|---|---|---|---|---|
| A | Header + context | `DrillHeader`, `ContextBar` | 12, sticky | P0 |
| B | Funnel | `FunnelStrip` | 12 | P0 |
| C | ✨ EXECUTIVE BRIEF | `ExecBriefBar` | 12 | P0 |
| D | ✨ EXECUTIVE PULSE | `PulseStrip` (3 × `PulseCard`) | 12 | P0 |
| E | Question cards | 3 × `QuestionCard` | 3 × 4 | P0 |
| F | Applied value · this week | `AppliedValueStrip` (~120px) | 12 | P0 |
| G | Field Signal Monitor | `SectionHeader` + 5 × `RiskSpikeCard` + `SuppressedEndCard` | 12, horizontal scroll | P0 |
| H | Governed watch · Evidence readiness | `GovernedWatchTile` (cols 1–7) · `EvidenceReadinessTile` (cols 8–12) | 12 | P0 |
| I | Ask LiSN | `FloatingAIButton` | fixed | button P0 (tooltip "Ask LiSN (P2 — canned answers)"); panel P2 |
| J | Footer | `FixedFooter` | 12 | P0 |

### 2.2 B · `FunnelStrip` — P0 → bind `exec.json › funnel`
"**233,900** interactions read (26 weeks; ~9,000 this week) · **1,640** candidate clusters · **212** suppressed ⓘ · **5** signals above threshold · **2** governed watch items"
- Hover "212 suppressed" shows a popover "Suppressed this window — not signals" (V-12): "Quarter-end / seasonal · 74" · "How-to after launch (adoption, not fault) · 58" · "Planned test or drill language · 41" · "Same-site recontacts and duplicates · 27" · "Credit hold, routed to AR · 12". Footer: "Suppression reasons are shown, never hidden."
- Click "5 signals above threshold" → scroll to G. Click "2 governed watch items" → scroll to H.

### 2.3 C · `ExecBriefBar` — P0 (02 §3.3 variant A)
Label "✨ EXECUTIVE BRIEF" · "Five signals above threshold — installed base 2, channel 2, separation 1. All five are with named owners; none has been actioned without approval."

### 2.4 D · `PulseStrip` — P0 (02 §3.4 variant A)
Each card has a title, body, and a chip row: **S-class · owner · gate state**. Click opens `linkTo`.

| # | Title | Body (exact) | Chip row | Click |
|---|---|---|---|---|
| 1 | "What's critical" | "EST4 fw 4.1 (synthetic): 'devices not found after upgrade' at 3.1× panels still on 4.0 — 9 partners, 3 regions, 1,240 panels. Draft brief awaiting VP Engineering." | `S2 · Quality` · `VP Engineering` · `Awaiting approval` | `/installed-base/signal/fw-4-1` |
| 2 | "Where's your focus" | "UK-EU remit-to and invoice contacts 2.7× since the 1 Sep entity cutover (control 1.1×): £1.1m in dispute, DSO +6 days at top-10 distributors." | `S2 · Separation` · `CIO / separation PMO` · `Awaiting triage` | `/separation` |
| 3 | "What's stable" | "3 of 4 cutovers clean against control. Nuisance-alarm contacts within own baseline for every detector family. 212 look-alikes suppressed." | `—` · `—` · `No action needed` | `/separation` |

Brand/platform/region names in these strings are tokens in the data (`{{platform:EST4}}`, `{{region:UK-EU}}`).
Replace the bank's orb emojis with a neutral dot plus the word (03 §3B).
After approval (§4.9), card 1's gate chip becomes `Investigation approved`.

### 2.5 E · `QuestionCard` ×3 — P0 (02 §3.5, 03 §5.4 visuals)

Anatomy (03 §3B): header (icon tile, title, sub-caption, chevron) → **`ScoreDelta`** → left `AreaTrend` / right 2 × `SemiGauge` + 2 × `MiniKPI` → `InsightBox`. The whole card is clickable and opens the drill route.

**`ScoreDelta` (new semantics, P0):**
- Big number = **count of signals above threshold** in this domain, 40px/700, tabular.
- Label under it: "signals above threshold" (singular "signal above threshold" when 1).
- **Week-on-week delta chip** (mono, right of the number): "+1 vs last week" / "0 vs last week". "Last week" = the weekly digest of 18 Sep 18:00 UTC. Tone: amber if the delta is positive, neutral otherwise (more signals = attention, not red; 03 §5.4).
- Secondary micro line (02): "+2 in 4 weeks".
- Severity-mix line (03 §5.4), 12px: "S2 cliff · S2 cliff".
- ⓘ opens **`WhatsCountedPopover`** (P0). It replaces the index popover.

| Field | Q1 | Q2 | Q3 |
|---|---|---|---|
| Title | "Is our installed base healthy?" | "Are we holding our channel?" | "Is the separation costing us?" |
| Sub-caption | "Firmware releases · Date-code windows · RMA · Field failures" | "Strategic Partners · Backorder consequence · Certification · Competitor language" | "Entity · Portal · ERP · EDI cutovers against a control region" |
| Icon / border | `Cpu` · **orange, 2px, highlighted glow** (holds the hero) | `Handshake` · teal 1px/30% + faint glow | `Split` · **sky-400** 1px/30% + faint glow |
| Big number | **2** · "signals above threshold" | **2** · "signals above threshold" | **1** · "signal above threshold" |
| WoW delta | "0 vs last week" | "+1 vs last week" | "0 vs last week" |
| 4-week line | "+2 in 4 weeks" | "+2 in 4 weeks" | "+1 in 4 weeks" |
| Severity mix | "S2 cliff · S2 cliff" | "S2 slope · S2 slope" | "S2 cliff" |
| Gauge 1 | **98%** · "Firmware cohorts in control" · "45 of 46" | **99.8%** · "NA Strategic Partners within own baseline" · "419 of 420" | **75%** · "Cutovers clean vs control" · "3 of 4" |
| Gauge 2 | **80%** · "EST4 RMA rate vs control limit" · "0.28% of 0.35% · in control" | **71%** · "N-3 OTD vs original promise" · "94% vs revised" | **8%** · "UK-EU distributors affected" · "14 of 180" |
| Gauge tones (with % text) | green · green | green · amber | amber · amber |
| `AreaTrend` | fw 4.1 vs 4.0 contacts per 1,000 panel-weeks (26 wks), dashed 4.0 baseline, release marker 2 Sep | ESD-SE-07 friction vs sell-in (dual axis) | UK-EU remit-to / entity contacts per week vs control, cutover markers |
| MiniKPI 1 | "TOP SIGNAL" · "fw 4.1 (synthetic) · 3.1×" | "DRIFTING PARTNER" · "ESD-SE-07 · 3.1×" | "IN DISPUTE" · "£1.1m" + `IllustrativeChip` · "212 invoices" |
| MiniKPI 2 | "PANELS EXPOSED" · "1,240" · "+5,560 eligible" | "BACKLOG AT RISK" · "$2.3m" + chip · "312 lines" | "DSO, TOP-10 UK-EU" · "+6 days" |
| `InsightBox` label | "LiSN INSIGHT" | same | same |
| Insight (02 variant A, exact) | "Panels on fw 4.1 report 'devices not found after upgrade' at 6.2 per 1,000 panel-weeks vs 2.0 on 4.0 — 23 contacts from 9 unrelated partners since 4 Sep. Five installers have rolled back to 4.0. The EST4 RMA rate is still inside its control limit." | "ESD-SE-07 friction has run 3.1× its own baseline for six weeks; recontact 38% vs 14%; a competitor named in 4 calls. EST4 sell-in is −22% while territory peers are +4%." | "Since UK-EU invoicing moved to the new KGS entity on 1 Sep, remit-to and entity contacts are 2.7× pre-cutover against 1.1× in the control regions. Top cluster: 'invoice entity doesn't match our PO entity'." |

**`WhatsCountedPopover` (P0)** → bind `questionCards[].counted`. Title "What's counted". It lists each signal with its severity, and each row links to that signal.

| Card | Rows (exact) | "Not counted" line |
|---|---|---|
| Q1 | "#1 · fw 4.1 cohort (synthetic) · S2 · Quality · Cliff · above threshold since 16 Sep · VP Engineering" / "#2 · D-2 date codes 2611–2614 (synthetic) · S2 · Quality · Cliff · since 18 Sep · Director Product Quality" | "Not counted: governed S1 watch items (restricted) · 45 firmware cohorts within own baseline · Evidence readiness (enabler)" |
| Q2 | "#3 · ESD-SE-07 partner drift (synthetic) · S2 · Channel · Slope · since 11 Sep · Regional GM NA" / "#4 · N-3 backorder consequence (synthetic) · S2 · Supply · Slope · since 22 Sep · VP Supply Chain" | "Not counted: 419 NA Strategic Partners within own baseline · 1 order dip during a credit hold (routed to AR)" |
| Q3 | "#5 · UK-EU entity cutover · S2 · Separation · Cliff · since 10 Sep · CIO / separation PMO" | "Not counted: NA portal, APAC order management and EDI mapping cutovers — clean vs control" |

Footer (all three): "Counted = above its own-baseline threshold at 25 Sep 18:00 UTC. Last week = digest of 18 Sep 18:00 UTC. A count, not a score."

### 2.6 F · `AppliedValueStrip` — P0 (02 §4, exact) → bind `exec.json › appliedValue`
- Header: "Applied value · this week" · chip "Synthetic scenario" · right link "How we count" (opens `HowWeCountDrawer`).
- Tiles (reuse `KpiTile`):

| Tile | Label | Value (mono) | Sub-line | Tooltip (method) | Click | On approve (§4.9) |
|---|---|---|---|---|---|---|
| AV-1 | "Ahead of the review cycle" | "21 days" | "median lead vs next scheduled review · 5 signals" | V-11 | popover: the 5 signals with crossing date, review date and lead (19 · 21 · 34 · 13 · 25 days) | — |
| AV-2 | "Signals routed" | "5 → 5 owners" | "+ 2 governed watch items (restricted)" | "Count of signals above threshold, each with exactly one owner" | scroll to G | — |
| AV-3 | "Decisions pending" | "5 awaiting owners" | "7 drafts · 0 sent · 0 automatic actions" | "Gate-state count" | read-only decision queue popover | "4 awaiting owners" · "7 drafts · 1 approved · 0 sent · 0 automatic actions" |
| AV-4 | "Exposure in view" + `IllustrativeChip` | three stacked lines: "Warranty & field ≤ $0.5m" · "Backlog at risk $2.3m" · "Invoices in dispute £1.1m" | "exposure, not savings · not summed" | V-02 + V-05; V-07; V-08 | drawer at those rows | — |
| AV-5 | "Contacts avoidable" + chip | "~430" | "$11k–26k handling cost · if owners approve" | V-10 | drawer | — |
| AV-6 | "Look-alikes suppressed" | "212" | "seasonal · how-to after launch · planned tests · credit holds" | V-12 | same popover as the funnel | — |

- Footnote (exact): "Lead time is measured against the review calendar, not against when your teams would otherwise have known. Discovery tests that blind."
- **`HowWeCountDrawer`** (P0; `EvidenceDrawer` shell, 520px): title "How we count" · `SyntheticBadge` · the four value statements (02 §1) · the unit-cost assumptions (02 §2: "tier-1 contact $25–60", "fully loaded field cost per excess fault contact $750 (truck roll $450 · Tier-3 escalation $150 · NFF return share $150)", "detector field replacement $120 per unit") · the V-01…V-14 table (figure + method, exact from 02 §2) · footer "Never on screen: revenue, savings, ROI or payback."

### 2.7 G · Field Signal Monitor — P0 (02 §9, 03 §3B) → bind `monitor.json`
- `SectionHeader`: `Activity` icon · "Field Signal Monitor" · chip "5 ABOVE THRESHOLD" (neutral/amber) · subtitle (02) "Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner." · italic line (03) "Suppressed: quarter-end order status · Edge how-to after training · planned tests · credit hold (routed to AR)".
- `RiskSpikeCard` anatomy (03): rank + title + `SeverityChip` (full "S2 · Material impact") + domain chip → key/value rows **SOURCES · COHORT · WINDOW · OWNER** → `MetricBeforeAfter` rows → compact `SeverityStrip` line (blast radius + incident) → compact `ConfidenceMarker` + compact `PnLDestinationTag` → compact `HumanGateStatus` chip → `RecommendationBox` labelled **"LiSN suggests · owner decides"** → footer "Open signal →". Tint follows severity (S2 amber). **No enabled action button on any card.**
- Card copy (02 §9.2, exact; tokens in data):

| # | id | Title | Chips | Before → after rows | Blast radius | Confidence | Owner · gate | P&L | LiSN suggests · owner decides | Click |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `fw-4-1` | "EST4 fw 4.1 — devices not found after upgrade" | S2 · Quality · Cliff | "Contacts / 1,000 panel-weeks" "2.0 → 6.2" "3.1×" | "1,240 panels · 9 partners · 3 regions" | "M 0.70 · K 15 / I 8" | "VP Engineering · Awaiting approval" | Warranty & field | "Reproduce on configurations with more than two signalling loops. Owner to decide whether to pause the staged 4.1 rollout." | hero (P0) |
| 2 | `dc-d2-2611` | "Detector family D-2 — early-life failures, date codes 2611–2614" | S2 · Quality · Cliff (serial axis) | "Early-life contacts vs adjacent weeks" "4.2×" · "SKU return rate" "0.21% (limit 0.30%) — in control" | "4,800 units · 1,900 in stock at 11 distributors" | "M 0.65 · K 22 / I 9" | "Director Product Quality · Containment memo awaiting approval" | Warranty & containment | "Sample return and teardown. Quality to decide on quarantine of units still in distributor stock." | `/installed-base#date-code` (P0 anchor) |
| 3 | `esd-se-07` | "ESD-SE-07 — Strategic Partner drift" | S2 · Channel · Slope | "Interactions, 6 wks" "13 → 40" "3.1×" · "Recontact" "14% → 38%" | "$6.4m sell-in · $0.9m backlog" | "H on orders (K) · M on friction→orders (I)" | "Regional GM NA · Recovery brief awaiting approval · no outreach sent" | Partner revenue | "Regional GM visit with a named L3 engineer and two priority EST4 class seats." | `/channel#esd-se-07` (P1) |
| 4 | `n3-backorder` | "Notification family N-3 — backorder consequence" | S2 · Supply · Slope | "Cancel / substitute language" "3.2×" · "OTD" "94% revised / 71% original" | "$2.3m backlog · 312 lines · 11 partners" | "H on dates (K) · M on cancellation (I)" | "VP Supply Chain · Allocation list awaiting approval" | Backlog conversion | "Review allocation with the 4 inspection-critical projects first." | `/channel#backorder` (P1) |
| 5 | `ukeu-entity-cutover` | "UK-EU entity cutover — remit-to and invoice friction" | S2 · Separation · Cliff | "Remit-to contacts vs pre-cutover" "2.7× (control 1.1×)" · "Portal login" "3.4×" | "14 distributors · £1.1m in dispute" | "H on timing (K) · M on cause (I)" | "CIO / separation PMO · Defect ticket awaiting triage" | DSO | "Candidate: PO-entity mapping in the EDI layer — engineering to confirm. CFO to decide on a dunning pause." | `/separation` (P1) |

- Rows SOURCES / COHORT / WINDOW per card: bind `monitor.json › cards[].rows`. Example card 1: "Calls · Cases · Email · RMA · After-hours" / "{{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)" / "Weeks 1–3 post-release" / "VP Engineering".
- Card 2 carries a micro 26-cell date-code strip (8px, 03 §6.9).
- After approval, card 1's gate chip becomes green "✓ Investigation approved".
- **`SuppressedEndCard`** (P0, last in the strip, neutral tint): title "212 look-alikes suppressed" · rows (V-12): "Quarter-end / seasonal 74" · "How-to after launch — adoption, not fault 58" · "Planned test or drill language 41" · "Same-site recontacts and duplicates 27" · "Credit hold, routed to AR 12" · footer "Recall broad, rank severe."

### 2.8 H-left · `GovernedWatchTile` — P0 (03 §6.12, 02 §10) → bind `exec.json › governedWatch`
- Striped header band: `Lock` · "RESTRICTED" · "Governed safety & cyber watch".
- Headline "2 open watch items (restricted)". P&L line: "P&L: Restricted".
- **W-1** (exact, 02): "Safety · S1 watch · single source → awaiting corroboration · routed to Quality + CLO · 6 Sep 14:38 UTC · status: under Quality review · confidence L–M 0.35". Second line: "Back-search found an earlier related email (19 weeks before), coded 'commissioning' — chronology updated 23 Sep 10:02. Quality decides significance."
- **W-2** (exact, 02): "Cyber · S1 candidate · 4 unrelated sites · candidate first mention 25 Sep 09:14 UTC · not in PSIRT queue at detection · routed to PSIRT + CLO 09:21 UTC · confidence L 0.30" + `ClockRing` "8h 46m" with 24h / 72h ticks. Caption: "8h 46m since candidate first mention · 24h / 72h ticks are reference only — PSIRT determines whether awareness has begun."
- Content lines render as redaction bars. **No platform, firmware or country, in either mode.**
- Footer: "**LiSN does not determine reportability.**"
- Click opens a modal: "Access limited to Quality, PSIRT and Legal roles. Routed to Quality / PSIRT — human decision. LiSN does not determine reportability." with button "Close". No hover lift.

### 2.9 H-right · `EvidenceReadinessTile` — P0 (02 R-Q1-3)
- `SeverityChip` "S4 · Efficiency" + chip "ENABLER" · title "Evidence readiness".
- Body (exact): "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57%."
- Label: "Discovery measures this first — on your data."
- Confidence "H 0.90 · K blank-field counts / I recoverable share". Owner "Quality · VP Service & Tech Support · CIO".
- Click → `/installed-base#why-late`.

### 2.10 Ask LiSN — P2
Panel (420px) with 3 canned questions (`askLisn.json`). Header "Ask LiSN" · "Answers cite the interactions behind them. LiSN drafts; people decide."

---

## 3. Q1 drill-down `/installed-base` — P0

`BackToOverviewHeader` · H1 "Is our installed base healthy?" · subtitle (03) "Interaction-derived view of the installed base, joined to firmware, date-code and RMA data."

### 3.1 Layout (03 §1.3 grid, 02 §5 panels)

| Row | Left (cols 1–4) | Middle (cols 5–8) | Right (cols 9–12) |
|---|---|---|---|
| 0 | P-0 `KpiTile` row ×4 (cols 1–12) | | |
| 1 | P-A Interactions read (`KpiTile` + `SegmentTable`) | P-B Clusters by severity (`StackedRatioBar`) | P-G LiSN Signal Wall (`AISummaryWall`, rows 1–3) |
| 2 | P-E New phrasing & emerging failures (`FrictionTable` reuse) | P-C Firmware lineage monitor (`LineMonitor`) | ↑ |
| 3 | P-K What's stable (`Watchlist` reuse, green tint) | P-F Contacts ↔ RMA overlay | ↑ |
| 4 | P-J Trouble conditions by platform (`StackedBarWithDetailPanel`, cols 1–12) | | |
| 5 | P-D Date-code heat strip (`DateCodeHeatStrip`, cols 1–12) | | |
| 6 | P-H Why field issues surface late (`EnhancedPanel`) + P-I `DiagnosisBox` (cols 1–12) | | |
| 7 | P-L Lifecycle stage table (`JourneyStageTable` reuse, cols 1–12) — P1 | | |
| 8 | P-M v2 teaser (locked tile) — P2 | | |

### 3.2 P-0 · KPI tiles — P0 (02 §5, exact order)
"SIGNALS ABOVE THRESHOLD" "2" · "FIRMWARE COHORTS IN CONTROL" "45 / 46" · "EST4 RMA RATE" "0.28% · in control" (sub "limit 0.35%") · "FIRMWARE RECORDED ON EST4 TROUBLE CASES" "38%".

### 3.3 P-A · Interactions read by brand × platform — P0 → `installedBase.json › interactionsTable`
- Big-gradient `KpiTile`: "QUALITY INTERACTIONS · THIS WEEK" · "5,480" · chip "▲ +312 vs last week".
- Table columns: "BRAND · PLATFORM" · "INTERACTIONS" · "WoW" · "RATE vs OWN BASELINE" (ratio printed with "×"; ≥1.2 amber, ≥1.5 orange; 03 §3C).

| Brand · Platform | Interactions | WoW | vs own baseline |
|---|---|---|---|
| {{brand:Edwards}} · {{platform:EST4}} | 1,960 | ▲ 6.8% | 1.3× |
| {{brand:Edwards}} · {{platform:EST3/EST3X}} | 720 | ▼ 1.2% | 1.0× |
| {{brand:Edwards}} · {{platform:Edge}} | 540 | ▲ 2.1% | 1.1× |
| {{brand:Kidde Commercial}} · {{platform:VM/VS}} | 610 | ▼ 0.8% | 1.0× |
| {{brand:Aritech}} · {{platform:2X}} | 470 | ▲ 0.9% | 1.0× |
| {{brand:EMS}} · {{platform:FireCell}} / {{platform:SmartCell}} | 420 | ▲ 1.5% | 1.0× |
| {{brand:GST}} · {{platform:GST panel family}} | 380 | ▼ 2.4% | 0.9× |
| {{brand:AirSense}} · {{platform:AirSense aspirating}} | 190 | ▲ 0.4% | 1.0× |
| Detection devices · D-series (synthetic) | 190 | ▲ 14.0% | 1.4× |

Footnote: "The {{platform:EST4}} row is only 1.3× — the fw 4.1 cohort is 23 contacts inside 1,960. The platform average hides it; the version denominator does not."

### 3.4 P-B · Clusters by severity — P0 → `clustersBySeverity`
Title "Above-baseline clusters by severity" · sub "This week · quality domain · split by type (cliff / slope / spread / novel)". Rows:
- "S1 · Life-safety (governed)" · "1 cluster · contents restricted" · hatched, with lock icon.
- "S2 · Material impact" · "2 clusters · 6,040 units" · cliff 2.
- "S3 · Operational" · "7 clusters" · 1 / 3 / 1 / 2.
- "S4 · Efficiency" · "11 clusters" · 0 / 8 / 2 / 1.

Clicking the S2 bar pulses wall cards 1–2.

### 3.5 P-C · Firmware lineage monitor — P0 → `lineageMonitor`
Title "12-week cohort monitor — contacts per 1,000 panel-weeks" · sub "Each release against its own baseline · 45 of 46 cohorts in control".
Lines W15–W26:
- "{{platform:EST4}} 4.1 (syn.)" orange-500, starts W23
- "{{platform:EST4}} 4.0 (syn.)" neutral-300
- "{{platform:Edge}} 3.2 (syn.)"
- "{{platform:2X}} 7.4 (syn.)"
- "{{platform:VM/VS}} 5.1 (syn.)"
- "{{platform:GST panel family}} G-7 (syn.)"
- aggregate RMA grey dashed

Marker "2 Sep · fw 4.1 released (synthetic)". Clicking the 4.1 line opens the hero.

### 3.6 P-D · `DateCodeHeatStrip` (anchor `#date-code`) — P0 → `dateCode`
Title "Date-code window under a green aggregate" · `SeverityChip` S2 · Quality · chip "Cliff on the serial axis". Cells 2601–2626; window 2611–2614 outlined, bracket "4.2× adjacent weeks · 4,800 units · 1,900 in stock at 11 distributors (containable)". Right: mini p-chart "0.30% limit", dot at 0.21%, caption "SKU return rate 0.21% — inside limit". Stats:
- "Field replacement exposure up to $0.35m" + chip (V-05)
- "1,900 units (40%) containable"
- `ConfidenceMarker` "M 0.65 · K 22 serial-verified · I 9 date codes read from photos"
- "14 share one component lot"
- `RoutedOwner` "Director Product Quality (owner) · cc VP Engineering"
- gate "Draft containment memo (8D D1–D3 pre-filled) — awaiting Quality approval"
- "19 days ahead of the scheduled review" (V-11)

Caption: "The aggregate is green by construction. The window is not."

### 3.7 P-E · New phrasing & emerging failures — P0 → `emergingPhrasing`
Title "New phrasing & emerging failures" · right "9 phrasings merged into 3 signals" · sub "One fault phrased many ways, counted once. What agents code today is shown beside it."

| Phrasing cluster | First seen | Partners | Channels | Coded today as | Status |
|---|---|---|---|---|---|
| "devices not found after upgrade" · "loop comes back half-empty" · "mapping stops around 60%" | 4 Sep | 9 | 4 | "Programming – general" | "SIGNAL #1" |
| "rolled back to 4.0" | 9 Sep | 4 | 2 | "Closed – customer fixed" | "WORKAROUND · on #1" |
| "device not responding" (first 90 days) | 12 Aug | 8 | 3 | "Device – DOA" | "SIGNAL #2" |
| "NAC goes into trouble after drill reset" | 7 Sep | 7 | 3 | "Programming – general" | "WATCH · unsized" |
| "aspirating flow fault after filter change" | 28 Aug | 3 | 2 | "Maintenance" | "WATCH · practice-leaning" |
| "how do I set up …" ({{platform:Edge}}, after training release) | 18 Aug | 14 | 3 | "How-to" | "SUPPRESSED · adoption, not fault" |

### 3.8 P-F · Contacts ↔ RMA overlay — P0 → `contactsVsRma`
Title "Contacts lead, RMAs lag — {{platform:EST4}}".
- Bars: weekly trouble contacts; W23–W26 carry an orange top segment for fw 4.1 (1, 5, 9, 8).
- Line: RMA rate % (4-week rolling), ~0.28%, dashed limit 0.35%, labelled "EST4 RMA rate — in control".
- Ghost zone to 9 Oct with marker "7 Oct · next monthly RMA review".

Caption: "The 23 fw 4.1 contacts are about 2% of {{platform:EST4}} trouble traffic in those weeks. The RMA line has not moved and will not be reviewed until 7 Oct."

### 3.9 P-G · LiSN Signal Wall — P0 → `signalWall`
Header ✨ "LiSN Signal Wall" · subtitle "Signals vs own baseline · data as of 25 Sep 2026 18:00 UTC" · pill "Data as of 25 Sep". Each `WallCard` shows `SeverityChip` + domain chip, compact `ConfidenceMarker` and an owner line.

| # | Chips | Title | Body | Metric | Trend | Link |
|---|---|---|---|---|---|---|
| 1 | "#1 of 5" · S2 · Quality | "fw 4.1 (synthetic) drifting from 4.0 on {{platform:EST4}}" | "Panels on 4.1 report 'devices not found after upgrade' at 6.2 per 1,000 panel-weeks vs 2.0 on 4.0 over the same three weeks. 9 partners, 3 regions; the EST4 RMA rate is inside its limit." | "3.1× own baseline" | "▲ Rising · above threshold since 16 Sep — third independent partner" | "Open signal →" (hero) |
| 2 | "#2 of 5" · S2 · Quality | "Detector D-2, date codes 2611–2614 (synthetic)" | "Early-life 'device not responding' at 4.2× adjacent production weeks; 14 of 22 cases share one component lot. SKU return rate 0.21% vs 0.30% limit." | "1,900 units still in distributor stock" | "▲ Rising · containable" | "Open signal →" (scroll to P-D) |
| 3 | S3 · Operational · "Workaround" | "'Rolled back to 4.0' in 5 cases" | "Installers at 4 partners are rolling panels back to 4.0 to restore mapping. No bulletin advises it. Often the earliest trace of a release regression." | "5 cases · 4 partners" | "Linked to Signal #1" | "Open signal →" |
| 4 | "Easing" · "Suppressed" | "{{platform:Edge}} how-to cluster after training release" | "Tagged adoption, not fault. Kept out of signals; contacts back to baseline in week 26." | "58 how-to clusters suppressed (all domains)" | "▼ Easing" | — |

Footer (`WallFooterCounts`): "0 S1 · Life-safety" (contents governed) · "2 S2 · Material impact" · "1 S3 · Operational" · "1 Easing".

### 3.10 P-H · `EnhancedPanel` "Why field issues surface late" (anchor `#why-late`) — P0 → `enhanced`
- Title "✨ Why field issues surface late" · badge "Joined with RMA & firmware data" · `JoinTagRow` under the subtitle.
- Violet line: "Uses read-only extracts of RMA records, the firmware release log and the panel registry."
- Right: "Data as of 25 Sep 18:00 UTC" / "2 cohorts above threshold".
- StatStrip (6): "Trouble cases this week 1,610" · "Firmware in record 38%" · "Recoverable from text 61% of the rest" · "RMAs with serial / date code 44%" · "NFF share 18%" · "First mention → RMA coded 19 days (median)".
- `StuckDriverBars` "Why signals arrive late":

| Driver | Meta | Bar | Chip |
|---|---|---|---|
| "Firmware not captured on the case" | "62% of EST4 trouble cases · version inferred from text or ship date" | 62/100 | High |
| "Symptom coded to a generic reason" | "27% of loop-mapping contacts coded 'Programming – general'" | 27/100 | High |
| "NFF return with no link back to the calls" | "18% of RMAs · 2 in Signal #1" | 18/100 | Medium |
| "Same fault, different words across partners" | "9 phrasings merged into 1 on Signal #1" | 9/10 | Medium |
| "Fixed locally by rollback — no RMA raised" | "5 cases in Signal #1" | 5/10 | Watch |

- `AgedCaseWatchlist` "Cohorts on watch":

| Chip | Title | Age | Stage | Blocker | Tags |
|---|---|---|---|---|---|
| S2 | "fw 4.1 cohort (synthetic)" | "wk 3" | "Stage: owner decision" | "Blocker: awaiting VP Engineering" | EST4 · 1,240 panels |
| S2 | "D-2 · 2611–2614 (synthetic)" | "wk 6" | "Stage: containment decision" | "Blocker: awaiting Quality" | 1,900 in stock |
| S3 | "'NAC trouble after drill reset'" | "wk 3" | "Stage: taxonomy decision" | "Unsized until joined" | 7 partners |
| S3 | "Aspirating flow after filter change" | "wk 4" | "Stage: attribution" | "Practice-leaning — with Training" | 3 partners |

### 3.11 P-I · `DiagnosisBox` — P0 → `diagnosis`
Title "LiSN evidence summary" (✨ icon; string from `installedBase.json › diagnosis.title`) + compact `ConfidenceMarker` "M 0.70".
- **Main signal:** "A firmware cohort, not a platform problem: {{platform:EST4}} panels on 4.1 (synthetic) report loop-mapping failures at 3.1× panels still on 4.0, across 9 unrelated partners in 3 regions."
- **What changed:** "Release on 2 Sep; new phrasing first seen 4 Sep; above threshold since 16 Sep at the third independent partner; installers have started rolling back to 4.0."
- **Decide first:** "VP Engineering to decide: reproduction on configurations with more than two signalling loops, and whether to pause the 4.1 download — before the 7 Oct RMA review."

### 3.12 P-J · `StackedBarWithDetailPanel` "Trouble conditions by platform" — P0 static / P1 interactive → `symptomStack`
- 8 bars (symptom families), stacked by platform.
- P0: `DetailPanel` open on "Loop mapping". P1: clicking a bar swaps the panel.
- Detail panel for Loop mapping:
  - Title "Loop mapping" + `SeverityChip` S2 · big "412" "contacts" "+14% WoW".
  - Grid: "Panels on version 1,240 (fw 4.1)" · "Partners 118" · "Regions 3 (fw 4.1 cohort)" · "NFF RMAs 2" · "Rolled back 5" · "Repeat contact 22%".
  - "LiSN INSIGHT" + K/I marker: "Loop-mapping contacts are up 14% overall, but the rise sits almost entirely in {{platform:EST4}} panels on 4.1. On every other platform and version the family is at baseline."
  - "RECOMMENDED ACTION — awaiting VP Engineering" (amber until approval, green after): "Open Signal #1 — the cohort, evidence and a draft investigation brief are ready for the owner."
  - "PHRASINGS": "devices not found" · "loop won't map" · "rolled back to 4.0" · "mapping stops ~60%".
  - Link "Open signal →".

### 3.13 P-K · What's stable — P0 (02 R-Q1-4)
Title "What's stable". Rows (green-tinted, word "Stable"):
- "45 / 46 firmware cohorts in control"
- "Nuisance-alarm contacts within own baseline for every detector family"
- "{{platform:Edge}} how-to cluster after training release — adoption, not fault (suppressed)"

Footer: "Shown so you can see what LiSN did not escalate."

### 3.14 P-L · Lifecycle stage table — P1 → `lifecycle`
Caps title "WHERE DOES IT SURFACE? — SIGNAL CONCENTRATION BY LIFECYCLE STAGE". Columns: Interactions (this week) · Repeat contact · NFF share · Signals above threshold (number + ▲ marker).

| Stage | Interactions | Repeat contact | NFF share | Signals |
|---|---|---|---|---|
| Ship & receive | 610 | 12% | — | 0 |
| Install & commission | 1,720 | 24% | — | 1 ▲ |
| Upgrade | 540 | 31% | — | 1 ▲ |
| ITM / inspection | 1,980 | 18% | — | 0 |
| RMA & warranty | 630 | 22% | 18% | 0 |

### 3.15 P-M · v2 teaser — P2
Locked tile "Grow the installed base — EST3→EST4 migration intent (v2)" · "Tell us if you want this next." No numbers.

---

## 4. Hero deep-dive `/installed-base/signal/fw-4-1` — P0 (02 §6, 03 §1.3)

Everything binds to `signal_fw41.json`.

### 4.1 Layout (03 §1.3)
- `DrillHeader`, then `BackToOverviewHeader` labelled "Back to installed base" · `RankChip` "#1 of 5 · Why ranked here? ⓘ" · `SyntheticBadge`.
- H1 headline.
- Metric line.
- `SeverityStrip` (full width).
- Grid, cols 1–8: `FirmwareLineageChart` (h≈340) · `SignalChips` · `CounterEvidence`.
- Grid, cols 9–12: `ConfidenceMarker` · `JoinTagRow` · `PnLDestinationTag` (+ 2 sub-tiles) · `RoutedOwner` · Recommended action · **Decision panel** (`HumanGateStatus` + "Viewing as" control + buttons [Approve investigation] [View draft] [Evidence · 23]).
- `EvidenceDrawer` overlays from the right.

### 4.2 Header block
- `WhyRankedPopover` (02 HS-7): "Severity S2" · "Rate ratio 3.1×" · "Panels on version 1,240 (+5,560 eligible)" · "Source independence 0.78" · "Est. field cost ≈ $0.15m projected" + chip. Composite line: "Rank score 0.84 · next: D-2 date-code window 0.71". Footnote: "Ranking = severity × rate ratio × panels on version × source independence × est. field cost. The score orders signals; it is not a probability."
- **H1 (02 HS-3, exact):** "{{platform:EST4}} · firmware {{fw:EST4@4.1}} (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on {{fw:EST4@4.0}}; 9 partners, 3 regions; 1,240 panels on version". Anonymised: "Panel platform A · firmware A.4.1 (synthetic) — …".
- **Metric line (exact):** "6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 · same 3 weeks · event-time aligned to each panel's upgrade · Poisson exact p<0.001".
- Sub-line: "First seen 4 Sep · above threshold since 16 Sep · routed to VP Engineering 16 Sep 06:10 UTC · SIG-2609-001 (synthetic)".

### 4.3 `SeverityStrip` (02 HS-4, exact)
- Segments: "S2 · Quality" · "Cliff (step at release)" · "Blast radius 1,240 panels · ~610 sites · 9 partners · 3 regions ({{region:US-SE}}, {{region:US-SW}}, {{region:Canada}}) · 5,560 eligible panels not yet upgraded" · "Incident flag: Off — no fire event, injury or dispatch mentioned".
- Rule line: "Any S1 phrase in this cohort routes to Quality immediately."

### 4.4 `FirmwareLineageChart` (03 §6.8 visuals, 02 HS-3 copy)
- 26 weeks (30 Mar – 25 Sep) plus a future zone to 9 Oct.
- 4.0: neutral-300 line with 20% ribbon ("4.0 (prior)").
- 4.1: orange-500 line with gradient fill, from W23.
- Denominator band at the bottom: "Panels on version".
- Aggregate: grey dashed flat line, labelled **"EST4 RMA rate — in control"**.
- Markers (exact): "2 Sep · fw 4.1 released (synthetic)" · "16 Sep · threshold crossed — third independent partner" (ReferenceDot, 2 pulses) · "7 Oct · next monthly RMA review". Annotation between the last two: "21 days earlier".
- Tooltip: "Week of {weekStart} · 4.1: {rate} per 1,000 panel-weeks ({contacts} contacts / {panels} panels) · 4.0: {rate} ({contacts} / {panels}) · EST4 RMA rate {rmaRate}%".

### 4.5 `SignalChips` + `CounterEvidence` (02 HS-5, exact)
- Chips: "New phrasing — first seen 4 Sep" · "Workaround spreading: 'rolled back to 4.0' in 5 cases" · "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)". The third chip carries a product ↔ practice attribution bar with the dot at 30%.
- Counter-evidence (collapsed by default): "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause".

### 4.6 Right column: confidence, joins, cohort
- `ConfidenceMarker` (exact): "M 0.70 · K 15 cases with firmware in record · I 8 imputed from ship date and download logs · Source independence 0.78 (9 partners, 4 channels)".
- `JoinTagRow`: BRAND {{brand:Edwards}} · PLATFORM {{platform:EST4}} · FW {{fw:EST4@4.1}} (synthetic) · REGION {{region:US-SE}} · {{region:US-SW}} · {{region:Canada}} · PARTNERS 9 ESDs · SITE commercial office · education · CHANNELS calls · cases · email · RMA · after-hours · TIME weeks 1–3 post-release.
- Cohort mini-table (optional in the right column; full version in the drawer):

| Region | Panels | Sites | Partners | Contacts |
|---|---|---|---|---|
| US-SE | 540 | 262 | 4 | 11 |
| US-SW | 430 | 214 | 3 | 8 |
| Canada | 270 | 134 | 2 | 4 |
| **Total** | **1,240** | **610** | **9** | **23** |

### 4.7 `PnLDestinationTag` (02 HS-10, exact)
- "P&L: Warranty & field cost · secondary: tech-support cost-to-serve".
- "To date ≈ $12k · projected ≈ $0.15m over 12 weeks if the rollout continues unchanged" + chip.
- Caption: "Small because it is week three."
- Sub-tiles: "~140 excess contacts avoidable if the rollout is paused at week 3 — decision sits with VP Engineering" · "21 days ahead of the scheduled monthly RMA review".
- Each figure has a tooltip with its V-01…V-04 method (02 §2). "Method ⓘ" opens the drawer's Method tab.

### 4.8 `RoutedOwner` + Recommended action
- "Routed to **VP Engineering** (owner) · cc VP Service & Tech Support" · "President sees this because S2 and blast radius exceed the agreed threshold."
- Recommended action (exact): "Owner to decide: engineering reproduction on the candidate configuration, and whether to pause the staged rollout and download of 4.1."

### 4.9 Decision panel: `HumanGateStatus` + `ApproveButton` — P0 (02 HS-8, HS-9, 03 §6.6)
Title "Decision". **Demo state is in memory only; a page reload resets it** (02 HS-9). The "Reset demo" control does the same.

**Time format:** `fmtDemoTime(new Date())` → "DD Mon HH:MM UTC" from UTC getters, e.g. "28 Sep 14:07 UTC". It is captured **once**, at the moment of the click. The same string is used on the gate, in the audit line and in the toast.

**Pending state (default)**
- `HumanGateStatus` `awaiting`, exact: **"Draft investigation brief — awaiting VP Engineering approval"**.
- Audit line: "Drafted by LiSN 16 Sep 06:10 UTC · routed 06:10 · IB-2609-004 (synthetic)".
- Second line (`not_sent`): "Draft known-issue note for tech-support agents — not sent".
- Local segmented control (02 HS-9): **"Viewing as: President | VP Engineering"**. Selecting VP Engineering changes "President" to "VP Engineering" in the breadcrumb.
- Buttons:
  - `ApproveButton` "Approve investigation". As President it is disabled (`Lock`), tooltip **"Approval sits with VP Engineering"**. As VP Engineering it is enabled.
  - "View draft" (opens §4.11).
  - "Evidence · 23".
- President-only action (P0, 02 HS-8): "Ask VP Engineering for a decision". Clicking it adds the chip "Decision requested by President" and the audit line "{ts} · President requested a decision from VP Engineering". Nothing is sent outside the demo. The button then disables with the label "Decision requested".

**Approve (VP Engineering view)**
1. Spinner + "Approving…" (500 ms). Capture `ts = fmtDemoTime(now)`.
2. State `approved` (amber → green morph, check icon). Title (02): **"Investigation approved by VP Engineering · reproduction on candidate configuration"**.
3. Audit line under the title: **"Approved · investigation opened · audit logged {ts}"**.
4. The line "Rollout decision: pending — VP Engineering" stays open. LiSN never decides it.
5. The known-issue note becomes: "Awaiting VP Service & Tech Support approval — not sent".
6. A new line appears: "LiSN keeps watching: the 4.1 rate is re-measured daily against 4.0."
7. `DecisionToast`: title "Investigation opened" · body "Approved by VP Engineering · audit logged {ts} · nothing sent outside LiSN".
8. Evidence drawer audit tab: prepend "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)".
9. Knock-on updates: Pulse card 1 chip → "Investigation approved"; FSM card 1 chip → "✓ Investigation approved"; AV-3 → "4 awaiting owners"; P-J recommended-action box turns green.
10. Switching back to President keeps the approved state.

- Footer (always): "LiSN aids resolution. Nothing is sent until the owner approves."
- No "sent" or "notified" wording anywhere.

### 4.10 `EvidenceDrawer` — P0 (03 §6.7) → `evidence`, `rmas`, `cohort`, `method`, `audit`
Right overlay, 520px. Header "Evidence · 23" + `SyntheticBadge` + ×. Tabs (03): **"Snippets 23" · "Linked RMAs 2" · "Cohort" · "Method & audit"**.

**Snippets**
- The 5 featured snippets are pinned under "Featured", then "All 23".
- Each card shows: channel icon · "Call · {{partner:ESD-SE-07}} · {{place:Florida}} · 9 Sep" · a K/I pill · quote with the matched phrase highlighted · "Open source interaction" (disabled, tooltip "Disabled in demo").
- Featured snippets (exact; source §10.4):
  1. "After we pushed {{fw:EST4@4.1}} the loop comes back with half the devices missing. Rolled one panel back to {{fw:EST4@4.0}} and it mapped fine." — Call · ESD-SE-07 · Florida · 9 Sep · K
  2. "Devices not found after upgrade on loops 2 and 3; mapping stops around 60%. Power-cycled; no change." — Case note · ESD-SW-03 · Texas · 11 Sep · K
  3. "Third site this month with the same thing after the firmware update — is there a known issue?" — Email · ESD-CA-04 · Ontario · 15 Sep · I. Note: "Received 15 Sep 23:12 ET = 16 Sep 03:12 UTC · third independent partner"
  4. "Module returned as suspected failure following panel upgrade. Bench: no fault found." — RMA narrative · ESD-SE-11 · Georgia · 16 Sep · K
  5. "Acceptance test with the AHJ tomorrow and the loop won't map since the update." — After-hours line · ESD-SE-02 · Florida · 18 Sep · I

**Linked RMAs**
- "RMA-S-2609-0142 · NFF · 16 Sep · ESD-SE-11 · serial E4-S-25184417 (synthetic)"
- "RMA-S-2609-0177 · NFF · 22 Sep · ESD-SW-09 · serial E4-S-26030962 (synthetic)"
- Note: "Two NFF returns in three weeks. Without the join, each closes as 'no fault found' on its own."

**Cohort**
- "1,240 panels on fw 4.1 · serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic)", the region table, "Eligible not yet upgraded: 5,560".
- "Export list" button, disabled, tooltip "Export disabled in demo".

**Method & audit**
- Detector: "Difference-in-differences, event-time aligned; Poisson exact test".
- Trigger: "≥2.5× and ≥3 independent partners".
- Baseline window: "26 weeks, prior version, event-time aligned".
- K vs I: "K 15 in record · I 8 imputed (5 ship date, 3 download logs)".
- Source independence: "0.78 · voice incl. after-hours, case, email, RMA".
- Suppressed: "4 how-to questions about new 4.1 features; 2 same-site recontacts".
- Exposure: V-01 and V-02 text from 02 §2.
- Clock: "UTC".
- Audit log, newest first:
  - prepended live entries: "President · just now" is added when the drawer first opens (02 HS-6); approval and decision-request lines appear after those actions.
  - "25 Sep 07:55 · Viewed by President (weekly digest)"
  - "22 Sep 11:30 · Evidence updated · RMA-S-2609-0177 linked"
  - "17 Sep 14:22 · Viewed by VP Service & Tech Support"
  - "16 Sep 06:10 · Threshold crossed · routed to VP Engineering (owner), cc VP Service & Tech Support · draft investigation brief generated"
  - "4 Sep 16:40 · New phrasing cluster opened"

Footer (sticky): "Every claim links to the interactions behind it. No customer-facing action taken. Synthetic scenario — not KGS data."

### 4.11 `DraftPreviewModal` "View draft" — P0 → `draftBrief`
- 760px modal, read-only.
- Header chip "DRAFT — not sent" (after approval: "APPROVED · {ts}"), `SyntheticBadge`, ×.
- Title "Engineering investigation brief — {{platform:EST4}} firmware {{fw:EST4@4.1}} (synthetic)".
- Meta "IB-2609-004 (synthetic) · Drafted by LiSN 16 Sep 2026 06:10 UTC · refreshed 25 Sep 18:00 UTC".
- Sections cover both 02 HS-8 and the lead's list:
  1. **Summary (signal)**: rate, ratio, severity, confidence.
  2. **Excerpts (evidence)**: 5 featured snippets and 2 NFF RMAs.
  3. **Cohort**: panels by region, serial range, 5,560 eligible.
  4. **Configurations & counter-evidence**: ">2 signalling loops concentrates the symptom; 412 panels at 180 sites show none".
  5. **Candidate causes (ranked) — candidate, not cause**:
     - H1 "Loop mapping under 4.1 fails to complete on configurations with more than two signalling loops"
     - H2 "Device database entries on loops 2–3 not carried through the upgrade"
     - H3 "Installation practice — upgrade without a re-mapping step (weakened: persists across certified and uncertified installers)"
     - Each hypothesis has For / Against / Test lines (from 05a). Footer "LiSN does not determine cause. Engineering decides."
  6. **Requested decision**: "1. Approve an engineering reproduction on the candidate configuration." · "2. Decide whether to pause the staged rollout and download of 4.1." · "3. Decide whether VP Service & Tech Support may release the draft known-issue note." · "Regulatory is consulted if a listed configuration is involved."
  7. **Approver**: "VP Engineering · cc VP Service & Tech Support · informed: Quality, President".
- Footer: "Draft generated by LiSN from the evidence above. Nothing has been sent. Synthetic scenario — not KGS data."

---

## 5. Q2 and Q3 drill-downs — P1

Both clone the Q1 skeleton.

### 5.1 Q2 `/channel` — "Are we holding our channel?" → `channel.json`
Subtitle: "Strategic Partner and distributor friction against each partner's own baseline — joined to sell-in, backlog and certification."

| Panel | Component | Content (exact where quoted) |
|---|---|---|
| C-0 KPI tiles (02 §7) | `KpiTile` ×4 + 2 | "SIGNALS ABOVE THRESHOLD 2" · "NA STRATEGIC PARTNERS WITHIN OWN BASELINE 419 / 420" · "N-3 OTD vs ORIGINAL 71% (94% vs revised)" · "CERTIFIED-TECHNICIAN LAPSES, DRIFTING PARTNER 2 of 5" · + "BACKLOG AT RISK $2.3m" (2.4% of ~$95m open backlog) · "CERTIFICATIONS LAPSING ≤30 DAYS 186 (all partners)" |
| C-B Partner league vs own baseline (anchor `#esd-se-07`) | `RankingsTable` reuse | Columns: PARTNER · TERRITORY · TIER · FRICTION vs OWN · RECONTACT · SELL-IN vs LY · CERTIFIED · COMPETITOR NAMED · STATUS. Rows in 05a §4.6. Only ESD-SE-07 is outside baseline among NA Strategic Partners (419/420 hold); the others are "Within band" or dealer/distributor S3 watch. Row click drives C-C. |
| C-C Partner timeline | `LineMonitor` / dual axis | Title "{{partner:ESD-SE-07}} — friction vs sell-in (synthetic)". Stream = weekly interactions vs baseline band; line = EST4 sell-in vs last year (dashed). Markers "W16 · friction above own baseline", "W22 · 2 certifications lapsed", "11 Sep · above threshold". Evidence pins W21–W26. Caption (02): "Friction led sell-in by ~5 weeks. Two backorder cases excluded from the friction score and linked to N-3. 2 of its cases sit in the fw 4.1 cohort." Value line: "$6.4m sell-in in view · ≈ $1.4m / yr gap if −22% persists · $0.9m backlog · 34 days ahead of the 15 Oct QBR" + chip. `ConfidenceMarker` "H on orders and certifications (K) · M on friction→orders (I)". Gate: "Partner-recovery brief — awaiting Regional GM approval · no outreach sent". |
| C-D Backorder consequence (anchor `#backorder`) | `StackedBarWithDetailPanel` | Title "Backlog at risk by SKU family". Toggle "vs revised promise / vs original promise" (header flips "OTD 94%" ↔ "OTD 71%"). Detail panel default N-3: "Notification family N-3 (synthetic)" S2 · Supply · big "$2.3m" "backlog at risk" + chip · grid "Lines pushed ≥3 wks 312" · "Partners 11" · "Projects with inspection ≤30 days 4" · "OTD vs revised 94%" · "OTD vs original 71%" · "Consequence language 3.2×" · LiSN INSIGHT "Cancel and substitute language started rising in week 21, before OTD against revised promise dates moved at all." · RECOMMENDED ACTION — awaiting VP Supply Chain: "Allocation priority list — awaiting Supply Chain approval · no partner messages sent." · PHRASINGS "cancel" · "substitute" · "project delay" · "inspection date" · "liquidated damages". Value line: "13 days ahead of the 5 Oct OTIF report". |
| C-E Certification gap | `SegmentTable` | Title "Certification gap vs support load". Caption "Assigning 18 seats in the October {{platform:EST4}} class to 7 high-load partners would cut ~210 contacts a quarter." |
| C-F Switching language | small table | Title "Switching language — competitor names redacted". Row "{{place:Houston}} metro · [competitor] · 11 vs 3 (3.7×) · top reason: N-3 lead time" chip S3 WATCH; 2 below-threshold rows. |
| C-G `EnhancedPanel` "Why partners drift" | | Badge "Joined with ERP orders, LMS & backlog" · StatStrip "Signals above threshold 2" · "Sell-in in view $6.4m" · "Backlog at risk $2.3m" · "Recontact (drifting partner) 38%" · "Certified lapses 2 of 5" · "Look-alike routed to AR 1". `StuckDriverBars`: "Open technical escalations" 34% High · "Backorder without a revised date" 26% High · "Certified technicians lapsed" 17% Medium · "Competitor quote named" 13% Medium · "Invoice / portal friction after cutover" 10% Watch (→ Separation). `AgedCaseWatchlist` "Partners on watch" (05a). |
| C-H "What's stable / suppressed" (02 R-Q2-4) | `Watchlist` green | "419 / 420 NA Strategic Partners within own baseline" · "One partner's order dip coincides with a credit hold — routed to AR, not scored as drift." |
| C-I LiSN Signal Wall | `AISummaryWall` | (1) "#3 of 5" S2 ESD-SE-07 drift · (2) "#4 of 5" S2 N-3 backorder · (3) S3 WATCH switching language in {{place:Houston}} metro · (4) "Suppressed" credit-hold dip routed to AR. Footer "0 S1 · 2 S2 · 1 S3 · 1 Suppressed". |
| C-J `DiagnosisBox` | | **Main signal:** "One Strategic Partner, not the channel: {{partner:ESD-SE-07}} is drifting against its own baseline while territory peers grow." **What changed:** "Friction above own baseline from week 16 and 3.1× for six weeks; recontacts 38% vs 14%; two of five certified technicians lapsed in week 22; a competitor named in four calls; EST4 sell-in −22% vs last year." **Decide first:** "Regional GM NA to decide on the draft partner-recovery brief — GM visit, named L3 engineer, two priority class seats. No outreach has been sent." |

### 5.2 Q3 `/separation` — "Is the separation costing us?" → `separation.json`
Subtitle: "What distributors experience after each entity, portal, ERP and EDI cutover — against a control region not yet cut over."

| Panel | Component | Content |
|---|---|---|
| S-0 KPI tiles (02 §8) | `KpiTile` ×4 + 2 | "SIGNALS ABOVE THRESHOLD 1" · "CUTOVERS CLEAN vs CONTROL 3 of 4" · "INVOICES IN DISPUTE £1.1m / 212" + chip · "DSO TOP-10 UK-EU +6 days" (sub "≈ £1.0m cash tied up") · + "PORTAL-LOGIN CONTACTS 3.4×" · "EXCESS CONTACTS ~48 / week" |
| S-B Cutover timeline | `LineMonitor` + markers | Title "Friction by cutover — affected region vs control". Lines: "{{region:UK-EU}} remit-to & entity contacts" (orange), "{{region:UK-EU}} portal login" (amber), "Control regions — remit-to & entity" (grey dashed). Markers "14 Jul · NA portal" · "4 Aug · APAC order management" · "12 Aug · EDI mapping" · "1 Sep · UK-EU entity". Caption "2.7× since 1 Sep (30 → 81 a week); control 1.1×. Above threshold since 10 Sep." |
| S-C Cutover scorecard | `ServiceBreaksTable` reuse | Columns CUTOVER · DATE · AFFECTED · FRICTION vs PRE · CONTROL · STATUS · OWNER. NA portal 14 Jul · 420 ESDs · 1.0× · 1.0× · "Clean vs control" · CIO / PMO. APAC order management 4 Aug · 96 distributors · 1.0× · 1.0× · "Clean vs control". EDI mapping 12 Aug · 6 EDI distributors · 1.1× · 1.0× · "Clean vs control". UK-EU entity 1 Sep · 14 distributors · 2.7× · 1.1× · S2 · CIO / CFO / Regional GM UK-EU. |
| S-D Topic × country | `StackedBarWithDetailPanel` | Title "Separation contacts by topic — {{region:UK-EU}}, since 1 Sep". Topics and 4-week totals in 05a. Default detail "Invoice entity mismatch": S2 · big "142" "contacts since 1 Sep" · grid "Distributors 14" · "Invoices linked 87" · "Value £0.46m" + chip · "Repeat contact 41%" · "Avg age 12.4 d" · "Control 1.1×" · LiSN INSIGHT "Most contacts quote an invoice entity that does not match the entity on the distributor's PO. The pattern starts on 1 Sep and is absent in the control regions." · RECOMMENDED ACTION — awaiting CIO triage: "Separation defect ticket — candidate: PO-entity mapping in the EDI layer (engineering to confirm)." · PHRASINGS "invoice entity doesn't match our PO" · "new bank details" · "which entity do we pay" · "credit note" · "re-issue". |
| S-E Defect vs communicated change (02 R-Q3-3) | split bar | "Expected, communicated change (FAQ-able) 118" · "Defect (wrong entity, lost acknowledgement) 180" · caption "FAQ-able contacts go to knowledge fixes; defects go to IT. ~290 contacts avoidable over 6 weeks if fixed." |
| S-F Gates (02 R-Q3-4) | `HumanGateStatus` ×3 | "Separation defect ticket — awaiting CIO triage" · "Distributor notice (corrected remit-to) — awaiting Regional GM UK-EU approval · not sent" · "Dunning pause on disputed invoices — CFO decision". Send buttons disabled with the owner named. |
| S-G `EnhancedPanel` "Why invoices go into dispute" | | Badge "Joined with AR & invoice data". StatStrip: "Disputed invoices 212" · "Value £1.1m" · "Closed since cutover 64" · "Avg age 11.2 d" · "Beyond terms 38" · "DSO top-10 +6 d". `StuckDriverBars`: "Invoice entity ≠ PO entity" 41% · 87 High · "Remit-to bank details not recognised" 24% · 51 High · "Part number re-keyed — price mismatch" 15% · 32 Medium · "Duplicate after re-issue" 11% · 23 Medium · "VAT number mismatch" 9% · 19 Watch. `AgedCaseWatchlist` "Aged disputes" (05a). |
| S-H Legacy residue | `Watchlist` | "31% of {{region:Canada}} partners' training enquiries still use the legacy address · forwarding ends in 45 days" S3 · "Repository retiring 31 Dec holds 1,840 interactions linked to 12 active signals" S3 · gate "Evidence-preservation request — awaiting Legal". |
| S-I LiSN Signal Wall | | (1) "#5 of 5" S2 UK-EU entity cutover · (2) S3 legacy address residue · (3) "Clean vs control" NA portal, APAC OM and EDI mapping. Footer "0 S1 · 1 S2 · 1 S3 · 3 Clean". |
| S-J `DiagnosisBox` | | **Main signal:** "One cutover, not the programme: friction is concentrated in the 14 distributors on the new {{region:UK-EU}} entity." **What changed:** "Since 1 Sep, remit-to and entity contacts 2.7× (control 1.1×) and portal logins 3.4×; 212 invoices, £1.1m, in dispute; top cluster 'invoice entity doesn't match our PO entity'." **Decide first:** "CIO to triage the draft separation defect ticket (candidate: PO-entity mapping in the EDI layer — engineering to confirm). CFO to decide on a dunning pause for the 212 disputed invoices." |

---

## 6. Transitions & motion (03 §4 timings govern)

| Element | Motion | Priority |
|---|---|---|
| Route change | enter: opacity 0→1 + y 8→0, 220ms `cubic-bezier(.2,.8,.2,1)`; exit 150ms | P0 |
| Panel stagger | children fade up 6px, 40ms stagger, max 8 | P1 |
| Card hover | translateY −2px, border → accent/60, glow +50%, 150ms | P0 |
| Count-up (signal counts, funnel, KPIs, 6.2 / 2.0) | first mount 700ms easeOut; `tabular-nums` | P0 |
| Gauges / bars | grow from 0, 600ms, 100ms after count-up starts | P0 |
| Chart draw-in | 900ms; lineage ribbons left → right; markers fade in after 200ms; threshold dot pings twice | P0 |
| Chip pulse ("5 ABOVE THRESHOLD", "New phrasing") | scale 1 → 1.04 → 1, once, 400ms | P1 |
| Evidence / How-we-count drawer | slide in x 100% → 0, 240ms `cubic-bezier(.32,.72,0,1)`; close 180ms; backdrop `bg-black/50`; Esc closes; focus trap | P0 |
| Popovers (What's counted, Why ranked, Suppressed) | scale .98 → 1 + fade, 150ms | P0 |
| Detail panel swap | crossfade 150ms | P1 |
| Approval | spinner 500ms → amber → green morph 300ms → check draw 250ms → audit line slides in 200ms → toast slides in 200ms (4s) | P0 |
| Anonymise | text crossfade 150ms; watermark fades in 200ms | P0 |
| Strip | scroll-snap, 32px ghost arrows, right-edge fade mask | P0 |

Rules:
- `prefers-reduced-motion`: opacity only.
- No bounces or springs.
- Never delay reading a number by more than 0.7s.

### 6.1 Intro (optional) — P1
- ≤1.5s, once per page load, skipped by `?intro=0` or any click.
- Skeletons plus the mono line "LiSN is reading 233,900 interactions…" (counts up). Then "1,640 candidate clusters · 212 suppressed · 5 above threshold". Tagline "Hear it at the third call, not the monthly review."

### 6.2 Presenter shortcuts — P2

| Key | Action |
|---|---|
| `A` | Anonymise |
| `E` | Evidence drawer |
| `P` | View draft |
| `V` | Toggle "Viewing as" |
| `0` `1` `2` `3` | Routes |
| `H` | Hero |
| `Shift+R` | Reset |
| `Esc` | Close |
| `→` `←` | Talk-track steps |

Talk-track steps (wording: "above threshold this week"):
1. `/`: badge + funnel ("five signals above threshold this week").
2. Q1 card.
3. Hero: 16 Sep marker.
4. Severity strip, confidence, counter-evidence.
5. Drawer, snippet 1.
6. Decision panel.
7. Viewing as VP Engineering.
8. Approve.
9. Back to `/`: FSM cards 3 and 2.
10. Card 5, then governed tile.
11. Evidence readiness tile.

---

## 7. Demo-mode controls — P0

### 7.1 Anonymise
- **Default OFF** in the live session (named, with the badge and footer visible). `?anon=1` forces it on.
- All copy passes through `fmt(str, anon)` (`mock/lib/label.ts`; `useLabel()` in components), which resolves `{{kind:key}}` tokens from `anonymise.json` (05a §3). This includes chart text, tooltips, breadcrumbs and `<title>`.
- Named values follow 03 §6.11: Edwards → "Brand A" · EST4 → "Panel platform A" · fw 4.1 → "A.4.1" · ESD-SE-07 → "Partner P-07" · US-SE → "Region NA-1" · Florida → "State 1".
- When ON: an "ANONYMISED" chip appears next to the badge, and a diagonal watermark "Synthetic scenario — not KGS data" (6% white, −30°) is shown.
- **Print / export:** on `beforeprint` force ON, then restore on `afterprint`. The named mode cannot be exported.
- The governed tile carries no tokens at all.

### 7.2 Synthetic badge
Always visible: ContextBar, hero header, drawer header, modal header.

### 7.3 `DemoMenu` (rail bottom)
- "Reset demo": clears approvals and decision requests, sets Viewing as → President and anonymise → OFF (unless `?anon=1`), closes overlays, goes to `/`, toast "Demo reset". — P0
- "Replay intro". — P1
- "Anonymise names" (mirror of the toggle). — P0
- Footer: "Demo controls — not part of the product."
- No persistence beyond the page (reload = reset, 02 HS-9).

---

## 8. Priorities and build order

### 8.1 Summary
| Priority | Scope |
|---|---|
| **P0** | Shell: LiSN monogram, rail, header, ContextBar, badge, footer, DemoMenu. `fmt` + anonymise. Exec: funnel, brief, pulse, 3 QuestionCards with counts + WoW + What's counted, AppliedValueStrip + HowWeCountDrawer, FSM 5 cards + suppressed card, GovernedWatchTile + modal, EvidenceReadinessTile. Q1: P-0 to P-K, with P-J static. Hero: all of §4, including Viewing as, Approve (live timestamp), "Ask VP Engineering", toast and knock-on updates. Evidence drawer. Draft modal. Core motion. `/signals/A1` redirect. |
| **P1** | Q2, Q3 · P-J bar interaction · P-L lifecycle table · functional filters · intro · print-forces-anonymise · panel stagger. |
| **P2** | Ask LiSN panel · global role switcher · `/signal/:id` generic deep-dive · shortcuts and talk-track stepper · v2 teaser · cohort map. |

### 8.2 Build order (≈10 h)
| Slot | Work | Done when |
|---|---|---|
| 0:00–0:45 | Branch repo. Copy the whole `mock/` folder into `src/mock/kgs/` (06 §1.2). It already contains `types.ts`, `data/*.json`, `lib/values.ts` (the single values module 02 asks for), `lib/data.ts` (typed barrel), `lib/label.ts` (`fmt`, `fmtDemoTime`) and `lib/demoState.ts` (`DemoProvider`, `useDemo`, `useLabel`). Sweep retired strings. | Boots on KGS data |
| 0:45–1:30 | Shell + `fmt` + watermark + LiSN monogram | Anonymise swaps every token on `/` |
| 1:30–3:45 | Exec overview incl. AppliedValueStrip, HowWeCountDrawer, SuppressedEndCard, EvidenceReadinessTile | §2 copy matches 02 exactly |
| 3:45–5:45 | Hero + decision panel + approval flow | `/` → card 1 → hero → approve updates hero, FSM card, Pulse chip and AV-3; reload resets |
| 5:45–6:45 | EvidenceDrawer + DraftPreviewModal | 23 snippets; audit shows live entries |
| 6:45–8:15 | Q1 drill-down | Wall card 1 and 4.1 line open the hero |
| 8:15–8:45 | Motion + QA §8.3 | Checklist passes |
| 8:45–10:00 | P1: Q2 and Q3 | Diagnosis box and one detail panel each |

### 8.3 QA checklist
- Badge visible everywhere, including over the drawer and the modal.
- Zero hits in UI strings for: "resolv", "root cause" (except "LiSN does not determine cause"), "LisN", "Lisn", "LISN", "FCI", "Conversation AI", "sentiment", "churn", "CSAT", "NPS", "cards", "predict", "real-time", "cheap", "!", "index", "crossed a threshold this week".
- No element sums $ and £. AV-4 shows three separate lines.
- Anonymise ON leaves no real brand, platform, partner, region or place name in DOM text, SVG text or `<title>`.
- Every signal surface shows severity class + type + blast radius + incident (compact on cards), K/I confidence, owner, gate, and P&L.
- The approval timestamp is identical on the gate, the audit log and the toast. Reload resets.
- W-1 shows 6 Sep 14:38 routing and the 23 Sep chronology update. Neither watch item shows a platform, firmware or country.
- Q1 border is orange highlighted, Q2 teal, Q3 sky-400. No logos other than the LiSN monogram.

---

## 9. Residual inconsistencies with 01 / 02 / 03 — settled in pack review (28 Sep)

The pack precedence rule (see `00_README_START_HERE.md`): 04 + 05a + the generated mock data are the source of truth for screens, panel-level copy, data and behaviour; 02 for value figures (V-01…V-14) and exec-level copy; 03 for visual tokens and components only. The items below were fixed in 02 and 03 so the files now agree. Details: `REVIEW_NOTES.md`.

1. 03 ExecBriefBar copy now uses 02 §3.3 A ("above threshold").
2. 03 §5.4 deltas now show the true WoW ("0 / +1 / 0 vs last week") plus 02's "+n in 4 weeks".
3. 03 §5.4 gauges, captions, MiniKPIs and insights now follow 02 §3.5.
4. 03 §6.6 approved copy and the "Approve investigation" label follow 02 HS-9 with the live timestamp.
5. 03 §6.12 routes W-1 on 6 Sep 14:38 UTC; 23 Sep 10:02 is the chronology update.
6. 02 HS-6 now lists 4 drawer tabs; 02 HS-11 uses the 05a anonymise labels ("Partner P-07", "Region NA-1").
7. 02 §3.5 borders: Q1 orange highlighted, Q2 teal, Q3 sky-400.
8. DiagnosisBox: title "LiSN evidence summary" (mock), rows "Main signal / What changed / Decide first" in 02, 03, 04 and the mock.
9. 02 HS-8 draft sections are all present in §4.11 (no change needed).
10. Wall link is "Open signal →" in 02, 03, 04 and the mock.
11. 03 §3C wall footer now points to the per-page footers in the mock.
