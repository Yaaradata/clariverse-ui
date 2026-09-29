# 03 · Look & Feel Reference — KGS Commercial Fire demo (reuse the bank demo's design system)

**For:** Ranjit BK, building in Cursor on the existing Vercel repo.
**Rule zero:** do **not** rewrite the design system. Find the existing component, copy it, rename props and data. Build a new component only for the items in §6, and build it from the tokens in §2.
**Scope of this file (pack precedence rule):** 03 is the source of truth for **visual tokens and component anatomy only**. Its example copy and figures are illustrative; exact copy, figures and behaviour come from 04 + 05a + the mock data, and exec-level copy and value figures from 02. The KGS build uses a **LiSN monogram placeholder** ("Li") in the rail, with no bank, YaaraLabs, client or partner logos.

**Where the numbers come from:** measured from the seven reference renders in `/home/claude/kgs/demo_ref/`. The PDFs embed 2560 px-wide JPEG captures (html2canvas at 2× of a **1280 px CSS viewport**). All px values below are **CSS px** (native ÷ 2). Hex values were sampled from the JPEGs, so they are ±2–3 per channel. They snap cleanly to the **Tailwind default palette**, so the repo almost certainly uses stock Tailwind colours plus a few custom ones. **Where the repo's `tailwind.config` / CSS variables disagree with this file, the repo wins.**

Quick "find in repo" strings for Cursor (to locate each component fast):
`"EXECUTIVE BRIEF"`, `"EXECUTIVE PULSE"`, `"What's critical"`, `"CONVERSATION AI"`, `"AI Risk Spike Monitor"`, `"OPERATIONAL ALERTS"`, `"Back to Overview"`, `"AI Summary Wall"`, `"Real-time FCI intelligence"`, `"Click for details"`, `"Vulnerable Watchlist"`, `"Strain & Friction"`, `"DOMINANT TOPICS"`, `"Brand Promise Gap"`, `"Momentum Hashtags"`, `"Influential Engagement"`, `"Rankings & Reviews"`, `"AI note"`, `"Card-system enhanced"`, `"Aged Case Watchlist"`, `"AI Dispute Diagnosis"`, `"Dispute Recovery Funnel"`, `HSHF`, `fontFamily`, `font-mono`.

Note: the logo mark in the rail is a **"Y"** (YaaraLabs), not a "V".

---

## 1. Page anatomy

### 1.1 Exec overview (bank reference, 1280 px viewport)

```
┌──────┬─────────────────────────────────────────────────────────────────────────────┐
│ RAIL │  p-4 (16px) page padding · bg #000                                           │
│ 76px │ ┌─────────────────────────────────────────────────────────────────────────┐ │
│      │ │ ✨ EXECUTIVE BRIEF (amber caps)                                   ~67px │ │ ExecBriefBar
│ [Y]  │ │ one-line summary, 16px                                                  │ │
│ ──── │ └─────────────────────────────────────────────────────────────────────────┘ │
│ [■]  │  gap 12px                                                                   │
│ [■]  │ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ ──── │ │ ✨ EXECUTIVE PULSE                                               ~134px │ │ PulseStrip
│ ▌[∿] │ │ ┌ 1. 🔴 What's critical ┐ ┌ 2. 🎯 Where's your focus ┐ ┌ 3. 🟢 stable ┐   │ │ 3 × PulseCard (1fr each)
│ [◎]  │ │ └───────────────────────┘ └──────────────────────────┘ └──────────────┘   │ │
│ [⬡]  │ └─────────────────────────────────────────────────────────────────────────┘ │
│ [▭]  │ ┌──── QuestionCard ────┐ ┌──── QuestionCard ────┐ ┌──── QuestionCard ────┐  │ grid-cols-3 gap-3
│      │ │[icon] Title        > │ │ (highlighted: 2px    │ │                      │  │ each ~382 × 445px
│ [←]  │ │ sub · caption        │ │  orange border+glow) │ │                      │  │
│      │ │ 68      -4 pts       │ │                      │ │                      │  │
│      │ │ ┌AreaTrend┐ ◠61% ◠24%│ │                      │ │                      │  │ left ~45%: score + area
│      │ │ │         │ ─────────│ │                      │ │                      │  │ right ~55%: 2 gauges,
│      │ │ │         │ KPI  KPI │ │                      │ │                      │  │ divider, 2 MiniKPIs
│      │ │ └─────────┘          │ │                      │ │                      │  │
│      │ │ ┌ InsightBox ──────┐ │ │                      │ │                      │  │ bottom ~30%
│      │ │ └──────────────────┘ │ │                      │ │                      │  │
│      │ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘  │
│      │  ∿ AI Risk Spike Monitor [OPERATIONAL ALERTS]                               │ SectionHeader
│      │  description · italic "Drivers: …"                                          │
│      │ ┌RiskSpike┐┌RiskSpike┐┌RiskSpike┐┌RiskSpike┐┌RiskSp→ (overflow-x scroll)     │ 240px wide cards, gap 12
│      │ │title chip│ …                                                              │ ~470px tall
│      │ │CHANNEL   │                                                                │
│      │ │TOP INTENT│                                                                │
│      │ │TIME      │                                                                │
│      │ │[metrics] │                                                                │
│      │ │[✨ reco] │                                                                │
│      │ └──────────┘                                                                │
│      │                                                         (FloatingAIButton ●)│ fixed bottom-right
└──────┴─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Drill-down page (bank reference)

```
┌──────┬─────────────────────────────────────────────────────────────────────────────┐
│ RAIL │ HEADER BAR  h≈80px · bg #252525 · border-b #393939                           │ DrillHeader
│      │  "Are cardholders satisfied with their journey?"   (20px bold)              │
│      │  "Credit Cards · Head of Credit Cards · Lifecycle · Journey · Retention"    │ breadcrumb 15px
│      ├─────────────────────────────────────────────────────────────────────────────┤
│      │ [← Back to Overview]  H1 question (≈36px, 800)                              │ BackToOverviewHeader
│      │  197×49px button      subtitle (≈18px, neutral-200)                         │
│      │ ┌─── Panel ────┐ ┌─── Panel ────┐ ┌─── AI Summary Wall ─┐                    │ grid-cols-3 gap-3
│      │ │ KPI + table  │ │ stacked bars │ │ (row-span-2)        │                    │ panels bg #0d0d0d
│      │ └──────────────┘ └──────────────┘ │                     │                    │ border #1f1f1f r=16
│      │ ┌─── Panel ────┐ ┌─── Panel ────┐ │                     │                    │
│      │ │ Top Intent   │ │ LineMonitor  │ │ footer counts       │                    │
│      │ └──────────────┘ └──────────────┘ └─────────────────────┘                    │
│      │ ┌─── Watchlist ┐ ┌─ Strain&Friction ┐                                         │
│      │ └──────────────┘ └──────────────────┘                                         │
│      │ ┌──────────── StackedBarWithDetailPanel (col-span-3) ───────────────────────┐ │
│      │ │ chart ~55%                              │ DetailPanel ~45%                  │ │
│      │ └─────────────────────────────────────────────────────────────────────────────┘ │
│      │ ┌──────────── JourneyStageTable (col-span-3) ────────────────────────────────┐ │
└──────┴─────────────────────────────────────────────────────────────────────────────┘
```
Other two drill-downs use the same shell with different grids:
- **Market page:** full-width `PromiseGapTable` → 2-col (`MomentumTile` grid 2×3 | `EngagementCard` list) → full-width `RankingsTable` + `AINote`.
- **Service page:** 2-col (`SLA KpiTile` 2×2 + table | Closure KpiTile 2×2 + table) → full-width `EnhancedPanel` (stat strip of 6 → left 2/3 `StuckDriverBars` + chip groups, right 1/3 `AgedCaseWatchlist` → full-width `DiagnosisBox`) → 2-col (`RankedFailureList` | `Funnel`).

### 1.3 KGS target layouts (what to build)

**Exec overview — "Global Commercial Fire — Signals this week"** (P0)
```
┌──────┬─────────────────────────────────────────────────────────────────────────────┐
│ RAIL │ ContextBar h56: Brand[All▾] Region[All▾] Period[26 wks to 25 Sep 2026▾]       │ NEW
│      │   Data as of 25 Sep 2026 18:00 UTC · [Anonymise ○] · [SYNTHETIC SCENARIO…]   │
│      │ FunnelStrip h36: 233,900 read · 1,640 clusters · 212 suppressed ⓘ ·           │ NEW
│      │   5 signals above threshold · 2 governed watch items                          │
│      │ ExecBriefBar  ✨ EXECUTIVE BRIEF                                              │ reuse
│      │ PulseStrip   1 What's critical │ 2 Where's your focus │ 3 What's stable      │ reuse
│      │ QuestionCard Q1 (highlighted)  │ QuestionCard Q2      │ QuestionCard Q3      │ reuse, re-skinned
│      │ AppliedValueStrip h~120: Applied value · this week (6 KpiTiles) + How we count │ NEW (04 §2.6)
│      │ ∿ Field Signal Monitor [5 ABOVE THRESHOLD]                                    │ reuse RiskSpikeCard
│      │ ┌Signal #1 hero┐┌#2 date-code┐┌#3 partner┐┌#4 backorder┐┌#5 carve-out┐ →    │ + SeverityStrip mini
│      │ └──────────────┘└────────────┘└──────────┘└────────────┘└────────────┘ [212]│ + GateStatus mini
│      │ ┌ GovernedWatchTile (restricted) ─────┐ ┌ Evidence readiness (S4) ────────┐  │ NEW | reuse KpiTile
│      │ └─────────────────────────────────────┘ └─────────────────────────────────┘  │
│      │ FixedFooter h24: "Synthetic scenario for illustration; …"                      │ NEW
└──────┴─────────────────────────────────────────────────────────────────────────────┘
```

**Q1 drill-down — "Is our installed base healthy?"** (P0; indicative sketch — the build grid is 04 §3.1)
```
DrillHeader: "Is our installed base healthy?" · "Global Commercial Fire · President · Installed base · Firmware · Date codes · RMA"
[← Back to Overview]  H1 + subtitle "Interaction-derived view of the installed base, joined to firmware, date-code and RMA data."
┌ Panel: Interactions read (KpiTile big number + platform table) ┐┌ Panel: Firmware cohorts vs own baseline (StackedRatioBars) ┐┌ AI Summary Wall → "LiSN Signal Wall" (row-span-2) ┐
┌ Panel: Top trouble conditions (Top Intent reuse)              ┐┌ Panel: FirmwareLineageChart mini (LineMonitor reuse)     ┐│  WallCard × n, footer S1/S2/Easing counts        │
┌ Panel: Watchlist → "Cohorts on watch"                         ┐┌ Panel: "Strain & Friction" → "Rework & repeat signals"   ┐└───────────────────────────────────────────────────┘
┌──────── StackedBarWithDetailPanel: "Trouble conditions by platform" + DetailPanel (click bar) ─────────────────────────────┐
┌──────── DateCodeHeatStrip + mini p-chart (NEW) ──────────────────────────────────────────────────────────────────────────┐
┌──────── JourneyStageTable → "Lifecycle stage" table: Ship · Install/commission · ITM · Upgrade · RMA ─────────────────────┐
```

**Signal deep-dive — hero "EST4 · firmware 4.1 (synthetic)"** (P0; the double-click)
```
DrillHeader: "Signal #1 of 5 — firmware 4.1 cohort" · breadcrumb "… · Installed base · EST4 · fw 4.1 (synthetic)"
[← Back to installed base]  RankChip "#1 of 5 · Why ranked here? ⓘ"   SyntheticBadge
H1 headline (28–32px, 2 lines max)
SeverityStrip ────────────────────────────────────────────────────────────────────────────── full width
┌ grid-cols-12 ───────────────────────────────────────────────────────────────────────────────────────┐
│ cols 1–8: FirmwareLineageChart (h≈340) + metric line "6.2 vs 2.0 per 1,000 panel-weeks"         │
│           SignalChips row · CounterEvidence (collapsible)                                         │
│ cols 9–12: ConfidenceMarker · JoinTagRow · PnLDestinationTag · RoutedOwner · Recommended action  │
│           HumanGateStatus (prominent, amber) + [Approve (disabled, lock)] [View draft] [Evidence·23]│
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
EvidenceDrawer: right overlay 520px, full height (slides in over cols 9–12)
FixedFooter
```

---

## 2. Design tokens (estimated)

### 2.1 Colour — surfaces and text

| Token | Hex (sampled) | Tailwind nearest | Used for |
|---|---|---|---|
| `--bg-page` | `#010101` | `black` / `neutral-950` | page background (true black) |
| `--bg-rail` | `#252525` | `neutral-800` (#262626) | left rail, drill-down header bar |
| `--bg-card` (exec) | `#252525` | `neutral-800` | Exec Brief, Pulse, Question cards |
| `--bg-card-inner` | `#2c2c2c` | `neutral-800`+`white/[.03]` | Pulse sub-cards, nav icon tiles |
| `--bg-insight` | `#181818` | `neutral-900` (#171717) | InsightBox inside question cards |
| `--bg-panel` (drill) | `#0d0d0d` | `neutral-950` (#0a0a0a) | all drill-down panels, back button |
| `--bg-subtle` | `#131313`–`#151515` | `white/[.03]` on panel | KPI tiles, tables, inactive tabs |
| `--bg-raised` | `#1a1a1a` | `neutral-900` | DetailPanel KPI grid, topic chips, Live chip |
| `--bg-card-hover` | `#2e2e2e` (exec) / `#161616` (drill) | +`white/[.04]` | hover (not visible in stills; recommended) |
| `--border` | `#393939` | `neutral-700/60` or `white/10` | exec cards, rail divider, header bottom |
| `--border-panel` | `#1f1f1f` | `white/[.07]` | drill panels, table row lines |
| `--border-chip` | `#2a2a2a` | `neutral-800` | neutral chips |
| `--text-primary` | `#ffffff` / `#e9ebea` | `white` / `neutral-100` | titles, big numbers, values |
| `--text-body` | `#cdcdcd` | `neutral-300` | insight body copy |
| `--text-secondary` | `#a3a3a3`–`#bababa` | `neutral-400` | labels (CHANNEL, gauge labels), table values |
| `--text-muted` | `#949494` | `neutral-400/500` | table headers, legends, subtitles on drill |
| `--text-faint` | `#737373` / `#6b7280` | `neutral-500` / `gray-500` | card sub-captions, micro labels — **too dim for screen-share, see §7** |

### 2.2 Colour — brand and accents

| Token | Hex | Tailwind | Where seen |
|---|---|---|---|
| `--brand` | `#5332ff` | custom (indigo/violet) | active-nav bar, accent left borders, TOTAL column |
| `--brand-gradient` | `#5b31ff → #7037f5` | custom → `violet-600` | big number "53,740"; Strained-conversations bar |
| `--brand-soft` | `#b6a6ff` | ≈`violet-300` | Pulse card titles "1. What's critical" |
| `--brand-tint` | `#2b2646` | `violet-950/60` | logo tile, active nav item bg |
| `--violet` | `#8b5cf6` | `violet-500` | "AI" badges, LSHF series, Co-branded chip, AI note bar |
| `--purple` | `#a855f7` | `purple-500` | DiagnosisBox left bar; EnhancedPanel border `#422460` (purple-500/30) |
| `--teal` | `#00e5c8` | custom (brighter than teal-400) | Q1 card icon, "CONVERSATION AI" label + bar |
| `--teal-2` | `#14b8a6` | `teal-500` | chart series HSLF |
| `--orange` | `#f97316` | `orange-500` | highlighted card border, Q2 accents, series LSLF |
| `--red` | `#ef4444` | `red-500` | CRITICAL, negative deltas, area trends, High Impact badge |
| `--red-soft` | `#ffa3ae` / `#fee4e5` | `rose-300` / `red-100` | "↑171%" rise text; text inside red reco boxes |
| `--amber` | `#f59e0b` | `amber-500` | EXECUTIVE BRIEF label, HIGH, AI INSIGHT label, gauges on Q3 |
| `--amber-soft` | `#fbbf24` | `amber-400` | "Card-system enhanced" badge text, emerging chips |
| `--yellow` | `#eab308` | `yellow-500` | WATCH, MEDIUM |
| `--green` | `#22c55e` | `green-500` | RECOMMENDATION label, Positive, Live dot, Healthy |
| `--emerald` | `#10b981` | `emerald-500` | WoW ▲, "+1,842 vs last week" |
| `--sky` | `#38bdf8` | `sky-400` | "Business" portfolio chip |
| `--gray-label` | `#9ca3af` | `gray-400` | NEUTRAL label |

### 2.3 Tinted surfaces (the "glass" boxes) — recipe: `bg-{c}/[.08–.12]` + `border-{c}/40–50`

| Box | bg | border | label/text |
|---|---|---|---|
| InsightBox (teal) | `#181818` | left 3px `--teal` (rounded) | label `#00e6c9` |
| InsightBox (orange/red) | `#181818` | left 3px `--orange` / `--red` | label same colour |
| AI INSIGHT (detail panel) | `#1f190d` | `#6a470d` (amber-500/40) | label `#f59e0b`, body neutral-100 |
| RECOMMENDATION | `#101b13` | `#16572d` (green-500/35) | label `#22c55e` |
| RiskSpike reco box (red) | `#230b0b` | `#742322` | text `#fee4e5` |
| RiskSpike card (red) | `#0c0304` (→ `#120606` at bottom) | `#832525` (red-500/50) | — |
| RiskSpike card (amber) | `#100903` | `#8c5707` (amber-500/50) | — |
| AI note | `#13121a` | left 3px `#8b5cf6` | label `#8b5cf6` |
| DiagnosisBox | `#17111f` | `#3f245b` + left 3px `#a855f7` | bold lead-ins white |
| EnhancedPanel | `#0b0a0f` | `#422460` | badge bg `#2b2412`, text `#fbbf24` |
| Exec Brief card | `#252525` | `#342d23` (amber-500/15) | — |
| Q card borders | `#252525` bg | teal `#1c554e` · orange **2px** `#f97316` · red `#572d2e` | — |
| Watchlist rows | segment tint (`amber-500/10` etc.) | segment/40 | — |
| Funnel stage (healthy/bottleneck) | `#0d1812` / `#1a160d` | green/amber 30% + left 3px solid | — |

### 2.4 Severity / status chips (bank)

| Chip | Style | bg | text | border |
|---|---|---|---|---|
| `CRITICAL` (spike card) | pill, caps, 12px bold, tracking-wider, 🔥 icon | `#2b0d0d` | `#d53d3c` | `#792322` |
| `HIGH` (spike card) | pill, caps, ⚠ icon | amber-950/60 | `#f59e0b` | amber-500/50 |
| `CRITICAL` / `HIGH` / `MEDIUM` (table "Importance") | rounded-md, caps, 14px bold, no border | `#221212` / `#231b0e` / `#231d0d` | red-500 / amber-500 / yellow-500 | none |
| `Critical` / `High` / `Watch` / `Bottleneck` (drill tables, KPI tiles) | pill, sentence case, 13–14px bold | `#2e1a19` / `#302513` / yellow-950 / `#302513` | red-500 / amber-500 / yellow-500 / amber-500 | none |
| `High Impact` (DetailPanel) | rounded-md **solid** | `#ef4444` | white | none |
| `NEGATIVE` / `POSITIVE` / `NEUTRAL` | text-only caps label, 13px bold, tracking-wider | none | red-500 / green-500 / gray-400 | none (outlined variant: red-500/60 border) |
| `ALERT` / `CRITICAL` (wall card) | rounded-md caps | orange-500/20 / red-500/20 | orange-500 / red-500 | none |
| `Live` | pill | `#1a1a1a` | neutral-200 | none; 8px dot green-500 |
| `AI` badge | rounded-md | violet-500/15 | `#8b5cf6` | none (or violet-500/40 with sparkle icon) |

### 2.5 Glows, gradients, shadows

- **Highlighted question card:** `border-2 border-orange-500` + outer glow `box-shadow: 0 0 32px 0 rgb(249 115 22 / .22)` (glow visibly fades ~40px below the card).
- **Non-highlighted question cards:** 1px border in accent at ~30% (`teal-400/30`, `red-500/30`) + faint glow `0 0 24px rgb(accent / .08)`.
- **RiskSpike cards:** `bg-gradient-to-b from-red-950/30 to-black/80` (effectively `#0c0304` → `#120606`), border accent/50, no drop shadow.
- **AreaTrend fill:** vertical gradient from accent at ~35% (`#5c2e2e` at top) to transparent (`#292524`) — Recharts `<linearGradient>` with stopOpacity 0.35 → 0.
- **FloatingAIButton:** 56px circle, `bg-gradient-to-br from-[#c29764] to-[#724ed2]` (amber-tan → violet), dark sparkle icon `#0a0d14`, glow `0 0 28px rgb(245 158 11 / .35)`.
- **Big number gradient text:** `bg-gradient-to-r from-[#5332ff] to-[#7c3aed] bg-clip-text text-transparent`.
- **Drop shadows:** essentially none on flat panels; depth comes from border + surface step (#000 → #0d0d0d → #131313 → #1a1a1a).

### 2.6 Radii, borders, spacing

| Token | Value | Where |
|---|---|---|
| `radius-2xl` | 16px | Question cards, drill panels, RiskSpike cards |
| `radius-xl` | 12px | Exec Brief / Pulse containers, KPI tiles, inner boxes, back button, tabs, DetailPanel |
| `radius-lg` | 8px | Pulse sub-cards, table containers, chips (rect) |
| `radius-md` | 6px | caps chips in tables, High Impact, AI badge |
| `radius-full` | pill | severity pills, topic chips, segment chips, Live chip, gauges ends |
| Border width | 1px default; **2px** on the highlighted card; **3px** left accent bars | |
| Spacing | 4-pt scale; page padding 16; grid gap 12; panel padding 16–20; inner box padding 12–16; row height in tables 40 (drill) / 36 (dense) | |
| Rail | 76px wide; logo tile 36px; nav tiles 24px icon in 48px hit area; active row 64px tall with 3px left bar | |
| Drill header bar | 80px tall | |

### 2.7 Typography

Families: **Outfit** (geometric sans; glyph shapes match — round bowls, flat-terminal "t", the hooked "1" in "-11pts") for all text; a **monospace for metrics** — glyphs match **JetBrains Mono** (check `fontFamily.mono` in the repo). Some table numerals ("286", "218") render in a heavier humanist sans (possibly Lato/system fallback) — treat as Outfit 700.

| Role | Size / line-height | Weight | Case / tracking | Colour | Example |
|---|---|---|---|---|---|
| Page H1 (drill) | 36px / 1.1 | 800 | sentence | white | "Are cardholders satisfied with their journey?" |
| Header-bar title | 20px | 700 | sentence | white | top bar |
| Breadcrumb | 15px | 400 | " · " separators | neutral-200 | "Credit Cards · Head of Credit Cards · …" |
| Section title (panel) | 18–20px | 700–800 | sentence | white | "AI Summary Wall", "Brand Promise Gap" |
| Card title (question) | 18px | 700 | sentence | white | truncates with "…" (fix, §7) |
| Card sub-caption | 14px | 400 | " · " separators | neutral-500 | "Satisfaction · Closure Risk · Top Pain" |
| Big score | 36–40px | 700 | tabular | white | "68" |
| Big hero number | 36px | 800 | gradient | brand gradient | "53,740" |
| Momentum big % | 40px | 700 | — | white | "287%" |
| Delta (score) | 16–18px **mono** | 500 | — | red-500 | "-4 pts" |
| Label caps | 11–12px | 600 | UPPERCASE, tracking-wider | neutral-400 | "TOTAL INTERACTIONS", "CHANNEL" |
| Brief/Pulse label | 14px | 700 | UPPERCASE, tracking-[.12em] | amber-500 | "✨ EXECUTIVE BRIEF" |
| Body | 14–16px / 1.6 | 400 | sentence | neutral-300 | InsightBox, wall text |
| MiniKPI value | 16px **mono** | 700 | — | white / accent | "PIN Reset", "18 accounts" |
| Chip | 12–14px | 700 | caps or sentence | per chip | |
| Micro | 9–10px (bank) → **use 11px min** | 500 | UPPERCASE | gray-500 | "TOPIC CLUSTER", "CHURN SIGNALS" |
| Table header | 11–12px | 600 | UPPERCASE, tracking-wide | neutral-400 | "SEGMENT", "WoW" |
| Table cell | 14px (sans) / 13px (mono for channel splits) | 400–600 | — | neutral-100 | |

Suggested Tailwind extension (only if the repo lacks it; otherwise map to its names):
```ts
// tailwind.config.ts → theme.extend
colors: {
  lisn: {
    page:'#000000', rail:'#252525', card:'#252525', cardInner:'#2c2c2c', insight:'#181818',
    panel:'#0d0d0d', subtle:'#141414', raised:'#1a1a1a',
    border:'#393939', borderPanel:'#1f1f1f', borderChip:'#2a2a2a',
    brand:'#5332ff', brandSoft:'#b6a6ff', brandTint:'#2b2646', teal:'#00e5c8',
  },
  sev: { s1:'#ef4444', s2:'#f59e0b', s3:'#94a3b8', s4:'#737373' },
},
fontFamily: { sans:['Outfit','ui-sans-serif','system-ui'], mono:['JetBrains Mono','ui-monospace'] },
boxShadow: {
  'glow-orange':'0 0 32px 0 rgb(249 115 22 / .22)',
  'glow-teal':'0 0 24px 0 rgb(0 229 200 / .10)',
  'glow-amber':'0 0 28px 0 rgb(245 158 11 / .35)',
  drawer:'-24px 0 48px -12px rgb(0 0 0 / .8)',
},
```

---

## 3. Component inventory (existing → KGS reuse)

Legend for "Reuse in KGS": **EX** = Exec overview · **Q1** installed base · **Q2** channel · **Q3** separation · **SD** = Signal deep-dive.

### A. Shell and navigation

**LeftRail** — 76px fixed column, `#252525`, right border `#393939`. Top: logo tile ("Y", violet on `#2b2646`, 1px `brand/40` border, r=12). Two amber placeholder squares (24px, `amber-900/40` fill, `amber-600/50` border — looks like org/tenant slots). Divider. Nav: Overview (activity/pulse icon), Q1 (target), Q2 (shield), Q3 (credit card). Back-arrow button lower down.
States: default (icon neutral-400 on `#3a3a3a` tile), active (row bg `#2b2646`, 3px left bar `#5332ff`, icon violet). Data: `{id, icon, route, label}[]`.
KGS: keep. Logo tile → **LiSN monogram placeholder** "Li" (violet-300 on `#2b2646`, `title="LiSN"`). Icons (04 §1.2) → Overview `Activity`, Q1 `Cpu`, Q2 `Handshake`, Q3 `Split`, then `Lock` for the governed watch; add Signal deep-dive under Q1 (no own icon; Q1 stays active). Remove the two amber squares; no client, bank or partner logos. Add `title` tooltips (rail has no labels).

**DrillHeader** — 80px bar at top of drill pages: question (20px/700) + breadcrumb (15px, " · "). KGS: breadcrumb `"Global Commercial Fire · President · Installed base · Firmware · Date codes · RMA"` (Q1), `"… · Channel · Strategic Partners / ESDs · Backlog"` (Q2), `"… · Separation · Entity · Portal · ERP / EDI · DSO"` (Q3), `"… · Installed base · EST4 · fw 4.1 (synthetic)"` (SD). **Q1 Q2 Q3 SD.**

**BackToOverviewHeader** — outlined button (197×49, `#0d0d0d`, 1px `#393939`, r=12, ← icon + 18px/600 "Back to Overview") left of H1 (36px/800) and subtitle (18px, neutral-200). States: hover → bg `#1a1a1a`, border `#4a4a4a`. KGS: identical; on SD the label is "Back to installed base" (or "Back to this week" per spec §10.7 when promoted from the exec). **Q1 Q2 Q3 SD.**

**FloatingAIButton** — 56px gradient circle, bottom-right fixed, amber glow, sparkle icon. Bank: presumably opens an AI chat. KGS: P2 "Ask LiSN" canned panel; until then keep it visible but open a small popover "Ask LiSN — canned questions in this demo". **EX Q1 Q2 Q3 SD.**

**Tabs / filter pills** — rounded-xl (12), 14px/700, count badge (mono, rounded-md `#211809` or `#1f1f1f`). Active = accent border (amber on Brand Promise Gap / Rankings; violet on Influential Engagement) + accent-tinted bg (`#2c1f0c`); inactive = `#131313` + `#1f1f1f` border, neutral-200 text. Data: `{id,label,count}[]`. KGS: filter by brand / platform / region / partner tier (§5). **Q1 Q2 Q3.**

**Chips / badges** — see §2.4. Also neutral outline chips (`#1a1a1a`, `#2a2a2a` border, pill, 14px) for DOMINANT TOPICS; accent-outline rect chips (r=8, 1px accent/60, accent-tinted bg) for brands/products ("One Key", "Active Cash"); segment pills (HSHF amber, HSLF teal, LSHF violet, LSLF orange: text accent, bg accent/10, border accent/30). KGS: product chips → platform/brand chips; segment pills → region/partner-tier pills (§5).

### B. Exec overview

**ExecBriefBar** — full-width card (`#252525`, border amber/15, r=12, p≈16). Label "✨ EXECUTIVE BRIEF" (14px/700 caps amber-500, sparkle emoji/icon) + one line 16px neutral-100. Data: `{summary: string}`.
KGS copy (02 §3.3 A; exact): `"Five signals above threshold — installed base 2, channel 2, separation 1. All five are with named owners; none has been actioned without approval."` **EX.**

**PulseCard** (×3 inside **PulseStrip**) — container like ExecBrief ("✨ EXECUTIVE PULSE"); three sub-cards (`#2c2c2c`, 1px `#393939`, r=8, p≈12): title row `"1. 🔴 What's critical"` (violet-300 `#b6a6ff`, 16px/700, coloured orb emoji) + 2-line body 16px/600 white. Data: `{index, tone:'critical'|'focus'|'stable', title, body}`.
KGS (copy in 02 §3.4 A / 04 §2.4): 1 "What's critical" → hero signal one-liner; 2 "Where's your focus" → UK-EU carve-out; 3 "What's stable". Each card has a chip row S-class · owner · gate state. Replace the red/green orb emojis with a neutral dot + word — never colour alone. **EX.**

**QuestionCard** — the core tile. Anatomy (top→bottom): header (40px icon tile r=12 with accent/15 bg + accent icon; title 18px/700; sub-caption 14px neutral-500; chevron `>` right, neutral-500) → **ScoreDelta** (big number 40px/700 + mono delta right-aligned in the left half) → two-column body: left **AreaTrend** (~45% width, ~170px tall, no axes), right 2 × **SemiGauge** + divider + 2 × **MiniKPI** → **InsightBox** at bottom.
States: default; highlighted (2px orange border + glow; one card only = "focus"); hover (recommended: lift −2px, border to accent/60, chevron to white). Whole card clickable → drill route.
Data:
```ts
type QuestionCard = { id:'q1'|'q2'|'q3'; icon:LucideIcon; accent:'orange'|'teal'|'sky';
  title:string; caption:string; highlighted?:boolean;
  big:{value:string; unit?:string; delta:string; deltaTone:'up-bad'|'down-bad'|'neutral'};
  trend:{week:string; value:number; baseline?:number}[];
  gauges:[Gauge,Gauge]; kpis:[MiniKPI,MiniKPI]; insight:{label:string; text:string}; route:string };
```
KGS: **EX** (three cards). See §5.4 for score semantics and suggested values.

**ScoreDelta** — big number + delta in mono. KGS: delta chip "+1 vs last week" / "0 vs last week" (not "pts"), plus a micro line "+n in 4 weeks"; tone by meaning, not by sign.

**SemiGauge** — 180° arc, ~74px wide, 10px stroke, track `#303030`, fill accent (red/amber), round cap; % centred (16px/700 accent); label under (12px caps neutral-400, 2 lines max). Data `{label, pct, tone}`. KGS: gauge labels and values from 02 §3.5 (§5.4). **EX; also usable in KpiTiles.**

**AreaTrend** — Recharts `AreaChart`, `type="monotone"`, 2.5px stroke accent, gradient fill, no grid/axes, ~12–26 points. KGS: plot rate vs **own baseline** — add a dashed neutral-500 baseline line (only change). **EX, Q1 panels.**

**MiniKPI** — label caps 12px neutral-400 (may wrap to 2 lines) → value mono 16px/700 (white or accent) → micro caps 9–10px gray-500 ("TOPIC CLUSTER", "CHURN SIGNALS") or a tag chip (`AGING DETECT`, `ROOT CAUSE` on `#323232`, r=6). KGS: value text in **sans** when it is words, mono only for numbers (the bank's "Dispute follow-up" wraps badly in mono). Rename "ROOT CAUSE" tag → "CANDIDATE CAUSE" or remove (no root-cause claims). **EX.**

**InsightBox** — `#181818`, r=12, 3px accent left bar, label row (TV/monitor icon + "CONVERSATION AI" 13px/700 caps tracking-wider accent) + 15px/1.6 body neutral-300 (4 lines). KGS: label → **"LiSN INSIGHT"** (icon: sparkle or `Radar`). Body = 02 §3.5 variant A (it carries the baseline comparison; the owner is on the chip row and the drill-down). **EX, Q1–Q3 panel footers.**

**SectionHeader (Risk Spike Monitor)** — icon (activity, amber) + 22px/800 title + chip "OPERATIONAL ALERTS" (red caps on `#1f0d0d`, pill) → description 15px neutral-400 → italic "Drivers: … · …" 15px neutral-500. KGS: `"∿ Field Signal Monitor"` + chip `"5 ABOVE THRESHOLD"` (neutral/amber, not red) → `"Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner."` (02 §1) → italic `"Suppressed: quarter-end order status · Edge how-to after training · planned tests · credit hold (routed to AR)"`. **EX.**

**RiskSpikeCard** (+ **MetricBeforeAfter** + **RecommendationBox**) — 240×~470, r=16, red- or amber-tinted near-black gradient, accent/50 border. Anatomy: title 18px/800 (2–3 lines) + severity pill top-right → key/value rows (CHANNEL / TOP INTENT (+ muted impact line) / TIME; label caps neutral-400 left, value right-aligned white 15px) → metrics box (`#090303`, 1px `#393939`, r=16; rows: label neutral-300 left, `312 → 847` bold right + `↑ 171%` rose-300 under) → reco box (`#230b0b`, `#742322` border, r=16, "✨" + 15px `#fee4e5`).
Container: `flex gap-3 overflow-x-auto` with a purple-ish scrollbar thumb (`#452d4f`).
Data:
```ts
type SpikeCard = { id:string; title:string; severity:SevClass; domain:Domain;
  rows:{label:string; value:string; sub?:string}[];
  metrics:{label:string; before:string; after:string; change:string}[];
  recommendation:string; route?:string };
```
KGS: **EX Field Signal Monitor** — 5 cards: hero (fw 4.1), date-code D-2, ESD-SE-07 drift, N-3 backorder, UK-EU cutover. Changes: replace the severity pill with **SeverityChip S1–S4 + domain**; rows → `SOURCES` (Calls, Cases, RMA), `COHORT` (EST4 · fw 4.1 (synthetic)), `WINDOW` (Weeks 1–3 post-release); metrics → vs own baseline (`2.0 → 6.2 per 1,000 panel-weeks ↑ 3.1×`); add a compact **HumanGateStatus** chip (amber, e.g. "VP Engineering · Awaiting approval"); the reco box becomes **RecommendationBox "LiSN suggests · owner decides"** (neutral/amber, an owner-addressed suggestion, never a "do this" command); add a one-line P&L tag and ConfidenceMarker (compact) above it; footer link "Open signal →". Card tint follows severity (S2 amber tint), not domain. Card 6 is a neutral `SuppressedEndCard` "212 look-alikes suppressed".

### C. Drill-down panels

**Panel** (base) — `#0d0d0d`, 1px `#1f1f1f`, r=16, p=16–20; title 18–20px/800 + optional icon/AI badge + subtitle 14px neutral-400; optional right-slot (e.g. "All segments", "Last sync: 15 min ago"). Variant: **accent-left** (3px `--brand` or amber left border — "Sentiment by Relationship Value", "Vulnerable Watchlist").

**KpiTile** — `#131313`, 1px `#1f1f1f`, r=12, p=16: caps label 12px/600 neutral-400 → value 28–32px/800 white → sub 13px neutral-400 (e.g. "+18% WoW") + status pill bottom-right. Variant: **big-gradient** ("TOTAL INTERACTIONS 53,740" with emerald delta chip `▲ +1,842 vs last week`, emerald-500 on emerald-950/60, pill, 1px emerald/30). Variant: **StatStrip** (6 cells in one bordered row, dividers `#1f1f1f`, 12px labels in sentence case). Data `{label,value,sub?,status?}`.
KGS: "Interactions read (26 wks)" `233,900`; SLA-style tiles for Q3 ("Invoices in dispute £1.1m", "DSO top-10 +6 days", "Remit-to contacts 2.7× vs control 1.1×", "Portal-login contacts 3.4×"); Q2 ("Backlog at risk $2.3m", "Lines pushed ≥3 wks 312", "OTD vs revised 94%", "OTD vs original 71%"). **Q1 Q2 Q3.**

**SegmentTable** — inside panel; table container `#151515`, r=12, header 12px caps neutral-400, rows 40px, dividers `#1f1f1f`; first column a segment pill; WoW col `▲ 2.1%` emerald / `▼ 0.8%` red; score column coloured by threshold. KGS: rows = platforms (EST4, EST3X, Edge, iO, …) or regions; columns = `INTERACTIONS · WoW · RATE vs OWN BASELINE` (04 §3.3). Colour the ratio (≥1.2× amber, ≥1.5× orange, per 04) **and** print the "×". **Q1 Q2.**

**StackedSentimentBar** — rows of 3-segment horizontal bars (green/amber/red, 32px tall, r=8, % labels centred 14px/700 black-on-colour), right-aligned meta ("$184M · 312 accts"), legend dots. KGS: sentiment is **not allowed** (spec §10.7 "Deliberately NOT on the screen"). Reuse the component as **StackedRatioBar**: share of a cohort's contacts by type (e.g. "Loop mapping · Device not found · Other") or K/I split per cohort. **Q1 (firmware cohorts), Q2 (partner tiers).**

**TopIntent** — big red count "16 identified", a single segmented bar (4 colours with counts), 2×2 legend, "INTENT VOLUME BY SEGMENT" 4 mini tiles with ringed numbers. KGS: "Top trouble conditions — 14 identified": Loop mapping, Ground fault, Communication fault, Device not responding; mini tiles by region. **Q1.**

**LineMonitor** — Recharts `LineChart`, 12 weeks (`W-10 … Now`), 4 series with dot markers (r=4, white centre), one series dashed violet, dashed grid `#333`, axis ticks 14px neutral-400, legend dots below. KGS: "12-week cohort monitor — contacts per 1,000 panel-weeks" (fw 4.0, 4.1, 3.x lineage, aggregate RMA grey dashed). Also basis for **FirmwareLineageChart** (§6). **Q1 Q2 Q3.**

**AISummaryWall** + **WallCard** + **WallFooterCounts** — tall panel (row-span-2): header (sparkle icon, 20px/800 title, subtitle "Real-time FCI intelligence", `Live` pill with green dot) → vertically scrolling stack (thin violet scrollbar) of WallCards: tinted by severity (`#2c1414` + `#8e2c2d` border for critical; orange-tinted for alert), r=16; icon tile (48px, severity/20) left; chips row (`CRITICAL` + neutral category chip with icon "Journey Outcome"); title 18px/800; body 15px neutral-300; metric line in accent ("HSHF down 28 points"); trend line with ↗ icon bold accent; "Click for details →" 14px accent; chevron top-right. Footer: 3 big numerals (40px/800: red "1 Critical", orange "2 Warnings", green "1 Improving"), labels 15px neutral-400.
KGS: rename → **"LiSN Signal Wall"**, subtitle `"Signals vs own baseline · data as of 25 Sep 2026 18:00 UTC"`; `Live` → `"Data as of 25 Sep"` (it is a static demo — do not claim real-time). Chips → SeverityChip + Domain chip. Link "Click for details →" → **"Open signal →"**. Footer counts per page from the mock (Q1: `0 S1 · Life-safety · 2 S2 · Material impact · 1 S3 · Operational · 1 Easing`, with class text). Each card gets compact ConfidenceMarker + owner line. **Q1 Q2 Q3.**

**Watchlist** — panel with amber left accent: rows tinted by segment (`amber-500/8` bg, `/30` border, r=8): "HSHF · 2 customers" + pill `High`/`Medium`; "AI" badge top-right. KGS: **"Cohorts on watch"** (Q1: "fw 4.1 · 1,240 panels", "D-2 date codes 2611–2614 · 4,800 units"); **"Partners on watch"** (Q2: "ESD-SE-07 (synthetic) · 3.1×"). Pills → SeverityChip. **Q1 Q2.**

**FrictionTable** ("Strain & Friction") — progress bar (brand gradient, "Strained Conversations 34.2%", "+2.1% vs last") + dense table (signals × segments, coloured by segment, TOTAL in brand violet). KGS: **"Rework & repeat signals"** — rows: Repeat contact, Truck roll mentioned, NFF return, Workaround ("rolled back"), columns by region; TOTAL. **Q1 Q2.**

**StackedBarWithDetailPanel** — full-width panel: left ~55% Recharts stacked `BarChart` (4 series, no gaps between bars, rotated 30° x labels 13px, dashed grid, legend in bordered box r=12 below); right ~45% **DetailPanel** (`#0d0d0d`, 1px `#2a2a2a`, r=16, p=20): title 22px/500 + `High Impact` solid chip → big count 44px/800 red + "cases" + `+12.5%` red → KPI mini-grid (`#1a1a1a`, r=12, 3 cols × 2 rows: label 14px neutral-400, value 18px/800 white or accent) → **AI INSIGHT** box (amber) → **RECOMMENDATION** box (green) → "DOMINANT TOPICS" caps label + pill chips → close ×.
States: no bar selected (panel shows first/top bar by default), bar selected (bar gets 2px white outline, panel content crossfades), closed (panel collapses; chart expands to full width).
KGS: **Q1 "Trouble conditions by platform"** (stacked by region or by channel); DetailPanel title "Loop mapping" + SeverityChip S2 (replace "High Impact"); KPI grid per 04 §3.12: Panels on version, Partners, Regions, NFF RMAs, Rolled back, Repeat contact; AI INSIGHT → **"LiSN INSIGHT"** with K/I marker; RECOMMENDATION → **"RECOMMENDED ACTION — awaiting VP Engineering"** (keep green only after approval; use neutral/amber before); DOMINANT TOPICS → **"PHRASINGS"** ("devices not found", "loop won't map", "rolled back to 4.0", "mapping stops ~60%"). Add a "Open signal →" link to SD. **Q1 (P0), Q2/Q3 (P1).**

**JourneyStageTable** — full-width, caps title "WHERE IS THE STRUGGLE? — PAIN CONCENTRATION BY JOURNEY STAGE", table in `#151515` r=12, stage names bold white, numbers mono, % cells colour-graded green→amber→red. KGS: **"WHERE DOES IT SURFACE? — SIGNAL CONCENTRATION BY LIFECYCLE STAGE"**: Ship & receive · Install & commission · Upgrade · ITM / inspection · RMA & warranty; columns: Interactions · Repeat contact · NFF share · Signals above threshold. Show the number plus a ▲/● marker (not colour only). **Q1.**

**PromiseGapTable** (with tabs) — full-width: icon + title + `AI` badge + subtitle; Tabs (with counts); columns WE PROMISE (bold + muted sub) · WHERE IT BREAKS (body + italic muted evidence line) · AFFECTED CARD BRANDS (rect chips) · VOLUME + CHANNELS (big 28px/700 number + mono 13px channel split) · SENTIMENT IMPACT (mono red) · IMPORTANCE (caps chip). Amber-tinted panel border.
KGS: **Q2 "Channel Promise Gap"** or **Q3 "Separation Promise Gap"**: WE PROMISE ("Order status on the portal", "One remit-to per invoice", "Part numbers unchanged after cutover", "Partner login works day one") · WHERE IT BREAKS · AFFECTED ENTITIES/SYSTEMS (chips: "UK-EU entity", "NA portal", "EDI mapping") · VOLUME + CHANNELS · **RATE vs OWN BASELINE** (replaces sentiment impact; mono, e.g. `2.7×`) · SEVERITY (SeverityChip). Tabs: All · NA · UK-EU · APAC. **Q2 Q3.**

**MomentumTile** — `#141414` r=16 tiles in a 2×3 grid: "#Hashtag" 18px/700 + tone label caps (NEGATIVE red / POSITIVE green / NEUTRAL gray) → 40px/700 "287%" + "Growth · 4,820 posts" → 15px neutral-400 description. KGS: hashtags/social are out of scope (no public-forum data in v1). Reuse as **"New phrasing"** tiles (UC-Q-14): `"rolled back to 4.0"` · first seen 9 Sep · 5 cases · 4 partners (04 §3.7); tone label → **RISING / NEW / EASING** in words. **Q1 (optional P1).**

**EngagementCard** (Influential Engagement) — filter tabs with counts; cards (`#141414` r=16): source line, handle 20px/800, followers + reach metrics, topic title, body, product chips; right column severity (`HIGH` caps chip, `NEGATIVE` outline chip), metric, action in amber ("Watch closely"). KGS: social is out; reuse as **"Partner voice"** cards for Q2: partner ID (synthetic) · territory · tier; metrics: interactions vs baseline, recontact %, sell-in vs last year; action line → routed owner + gate state. **Q2.**

**RankingsTable + AINote** — table of site/category/portfolio/our card/RANK MOVE (`#3 → #6` red mono + "down 3")/#1 competitor/why it moved/internal echo (count + italic quote)/impact chip; AINote (violet left bar, `#13121a`, "AI note" 13px violet label). KGS: competitor names are **out** (spec). Reuse the table shape for **Q2 "Partner league vs own baseline"** (partner · territory · tier · sell-in move · friction ratio · certifications lapsed · internal echo · severity). **AINote → "LiSN note"** is reusable everywhere. **Q2 Q3.**

**SLA KpiTiles** (2×2) + **ServiceBreaksTable** — see KpiTile + table. KGS: **Q3** "Cutover friction" 2×2 and a table "Cutover breaks": Cutover (NA portal 14 Jul · EDI mapping 12 Aug · APAC OM 4 Aug · UK-EU entity 1 Sep) · Severity · Contacts · vs control · Aging · Main blocker. **Q3.**

**EnhancedPanel** ("card-system enhanced") — full-width panel with violet-tinted bg `#0b0a0f` and `purple-500/30` border; title with sparkle + badge **"Card-system enhanced"** (amber-400 on `#2b2412`, pill); subtitle; violet-300 line "Requires dispute case, queue, document status, … feeds."; right meta "Last sync: 15 min ago / 43 beyond SLA". **This is the join pattern — LiSN's differentiator.** KGS: badge text → **"Joined: RMA · firmware · order data"** (or per panel: "Joined with RMA & firmware master", "Joined with ERP order lines", "Joined with AR / invoice data"); violet line → `"Uses read-only extracts of RMA records, firmware release log and panel registry. [illustrative]"`. Put **JoinTagRow** directly under the subtitle. **Q1 (fw × RMA), Q2 (orders), Q3 (AR/DSO), SD.**

**StuckDriverBars** ("Why cases are stuck") — rows: bold title + pill right; meta line "128 cases · 34% of beyond-SLA · 3.8d avg delay"; full-width 8px progress bar (track `#19181d`, fill severity colour, r=full). KGS: Q3 "Why invoices are disputed" (Remit-to mismatch, Entity name on PO, Part-number cross-ref, Portal login) / Q1 "Where the cohort differs" (loops >2, site type, certified vs uncertified installer). **Q1 Q3.**

**ChipGroups** ("Dispute type signal") — "Routine" (green-tinted pills `#0d2116`/`#124b2a`/`#baf8d1`) vs "Emerging" (amber-tinted pills, text amber-400, "+31%"). KGS: "Known and handled" vs "New since cutover / since release". **Q1 Q3.**

**AgedCaseWatchlist** — cards (`#131313`, 3px severity left bar, r=12): severity pill + bold title, age right (`12d`, severity colour, 20px/800); "Stage: …", "Blocker: …" (label neutral-400, value white 600); chips row (segment + product, amber-tinted). KGS: **Q3 "Aged disputes"** (invoice disputes > 30 days), **Q2 "Aged backorder lines"**, and — important — the **GovernedWatchTile** borrows this row anatomy. **Q2 Q3.**

**DiagnosisBox** ("✨ AI Dispute Diagnosis") — `#17111f`, 3px purple left bar, border purple/30, r=12; title 16px/800; three columns: **Main reason:** · **What changed:** · **Fix first:** (bold lead-in white, body neutral-200 14px). KGS: title from the mock (`diagnosis.title` = **"LiSN evidence summary"**) with lead-ins **"Main signal:"** · **"What changed:"** · **"Decide first:"** (lead decision; no "Main reason"/"Fix first" — those imply root cause and auto-action). Add ConfidenceMarker (compact) in the title row. **Q1 Q2 Q3 SD.**

**RankedFailureList** ("Top Service Failures") — rows (`#18100e`, `#441a1b` border, r=12): `#1` red 20px/800 · title bold · "Segment most affected: [pill]" · right metrics trio (value 18px/800 + micro label: conv. / repeat / sent.) · full-width progress bar. KGS: **"Top signals by expected field cost"** or "Top trouble conditions": metrics → contacts · ×baseline · panels; drop "sent.". **Q1 Q2.**

**Funnel** ("Dispute Recovery Funnel") — stacked stage rows that **narrow** (each ~92% of the previous width), tinted by status (green Healthy / amber Bottleneck / yellow Watch / red Critical) with 3px left bar, stage name bold, meta "Vol · Avg · Sent", status pill right; footer note (amber left bar). KGS: **Q2 "Order-to-install funnel"** (Order · Allocated · Shipped · Installed · Commissioned) or **Q3 "Invoice-to-cash"** (Invoiced · Received · Matched · Disputed · Paid); meta → `Vol · Avg days · ×baseline`. Also reuse the same visual for the **FunnelStrip** logic on EX (interactions → clusters → suppressed → signals). **Q2 Q3.**

---

## 4. Interaction patterns and transitions

Observed or implied in the bank demo:

| Pattern | Where | Behaviour to keep |
|---|---|---|
| Drill via card | QuestionCard chevron / whole card | Click → route `/q1` etc.; rail item becomes active |
| Back to Overview | drill pages | returns to `/` and restores scroll position (in memory; no browser storage — 06 rules) |
| Horizontal scroll strip | Risk Spike Monitor | `overflow-x-auto`, cards clipped at the right edge (signals "more") |
| Tabs / filters with counts | Promise Gap, Rankings, Engagement | client-side filter; counts update |
| Bar click → detail side panel | Repeat-contact chart | selects a bar, fills DetailPanel, × closes |
| Live dot | AI Summary Wall | green dot + "Live" pill |
| "Click for details →" | Wall cards | opens detail (implied) |
| Chevron on wall cards | Wall cards | same as above |
| Floating AI | all | opens assistant (implied) |

Recommended transitions (subtle, executive; use framer-motion if the repo has it, otherwise CSS; wrap all in `prefers-reduced-motion: reduce` → no transform, opacity only):

| Element | Motion | Timing |
|---|---|---|
| Card hover (QuestionCard, SpikeCard, WallCard, tiles) | `translateY(-2px)`, border → accent/60, glow +50% | 150ms `ease-out` |
| Route change (EX ↔ drill ↔ SD) | enter: opacity 0→1 + `y: 8→0`; exit: opacity 1→0 | enter 220ms `cubic-bezier(.2,.8,.2,1)`, exit 150ms |
| Drill from card (P2 polish) | shared `layoutId` on card title → page H1 | 250ms |
| Panel stagger on page enter | children fade-up 6px | 40ms stagger, max 8 items |
| Number count-up (big numbers, KPI values) | 0 → value on first mount only; on filter change animate from previous value | 700ms `easeOut` first mount, 300ms on change; `tabular-nums` so width never jumps |
| Gauge / progress bars | stroke/width grow from 0 | 600ms `easeOut`, 100ms after count-up starts |
| Evidence drawer | slide from right `x: 100% → 0` + backdrop `bg-black/50` fade | 240ms `cubic-bezier(.32,.72,0,1)`; close 180ms; Esc and backdrop click close |
| Detail side panel content swap | crossfade | 150ms |
| Live/threshold marker | `animate-ping` ring on the dot | Live dot: 2s loop; threshold marker on the lineage chart: 2 pulses then stop |
| Chip pulse ("New phrasing", "5 ABOVE THRESHOLD") | single soft scale 1→1.04→1 on mount | 400ms, once |
| Approval transition (SD) | button → spinner (500ms) → gate chip morphs amber→green (colour crossfade) + check icon draw + audit line slides in under it | 300ms morph, 250ms check, 200ms line |
| Anonymise toggle | text crossfade on every swapped label | 150ms |
| Tile promotion into hero (spec §10.7, P2) | `layout` animation | 300ms |
| Horizontal strip | add `scroll-snap-type:x mandatory`, left/right 32px ghost arrow buttons, right-edge fade mask `linear-gradient(to right, #000 92%, transparent)` | smooth scroll |

No bounces, no spring overshoot, no confetti. Motion should never delay reading a number by more than ~0.7s — the presenter is talking over it.

---

## 5. Renames and removals for KGS

### 5.1 Global strings

| Bank string | KGS replacement |
|---|---|
| "CONVERSATION AI" | **"LiSN INSIGHT"** |
| "AI INSIGHT" (DetailPanel) | **"LiSN INSIGHT"** |
| "AI note" | **"LiSN note"** |
| "AI Summary Wall" · "Real-time FCI intelligence" | **"LiSN Signal Wall"** · "Signals vs own baseline · data as of 25 Sep 2026 18:00 UTC" |
| "FCI" (anywhere) | remove |
| "AI Risk Spike Monitor" · "OPERATIONAL ALERTS" | **"Field Signal Monitor"** · "5 ABOVE THRESHOLD" |
| "✨ AI Dispute Diagnosis" | **"LiSN evidence summary"** (title per mock `diagnosis.title`) |
| "Main reason / What changed / Fix first" | **"Main signal / What changed / Decide first"** |
| "RECOMMENDATION" | **"RECOMMENDED ACTION"** + gate state beside it |
| "Card-system enhanced" | **"Joined: RMA · firmware · orders"** (panel-specific) |
| "Live" pill | "Data as of 25 Sep" (static) |
| "Click for details →" | "Open signal →" |
| "Back to Overview" | keep; SD uses "Back to installed base" |
| "Credit Cards · Head of Credit Cards · …" | "Global Commercial Fire · President · …" |
| "conversations" (unit) | "interactions" (calls, cases, emails, RMA narratives) |
| "customers", "cardholders", "accounts" | installers, partners / ESDs, distributors, sites, panels |
| "resolved", "resolves" | "aids resolution" (never "resolves") |
| "ROOT CAUSE" tag | "CANDIDATE CAUSE" |
| "churn", "NPS", "CSAT", "sentiment", "#hashtags", "WoW" sentiment scores | removed; use rate vs own baseline, repeat contact, NFF share, OTD, DSO |
| "High Impact" | SeverityChip ("S2 · Material impact") |
| "Critical / High / Watch / Medium" | S1 / S2 / S3 / S4 with words (§6.1). Keep "Watch" only as a **status** ("on watch"), in yellow. |
| "Positive / Negative / Neutral" | **"Easing / Rising / Stable"** (direction vs baseline, in words) |
| competitor names, social handles, review sites | removed |
| "Merchant XYZ", "MCC 7995", "$21K loss exposure" | synthetic IDs: "ESD-SE-07 (synthetic)", "fw 4.1 (synthetic)", "D-2 date codes 2611–2614" |

### 5.2 Segment chips (HSHF/HSLF/LSHF/LSLF) → KGS dimensions
Keep the four-colour pill system (amber, teal, violet, orange) but change what it encodes. Pick **one** dimension per view and put it in the chart legend:

| View | Dimension | Pills (colour) |
|---|---|---|
| Q1 installed base | Region | NA (amber) · UK-EU (teal) · APAC (violet) · MEA/India (orange) |
| Q1 platform filter tabs | Platform | EST4 · EST3X · Edge · iO · Evolve · AirSense (tabs, not colours) |
| Q2 channel | Partner tier | Strategic Partner / ESD (amber) · Distributor (teal) · Dealer (violet) · Integrator (orange) |
| Q3 separation | Cutover | NA portal · EDI mapping · APAC OM · UK-EU entity (tabs) |
| Brand chips (rect, outlined) | Brand | Edwards · Kidde Commercial · Aritech · EMS · GST · AirSense |
| Anonymised mode | all | per `anonymise.json` (05a §3.2): "Region NA-1", "Partner P-07", "Brand A–F", "Panel platform A"; tier names stay as they are |

Keep brand **chips** neutral-outlined (no brand colours), so no colour carries brand identity.

### 5.3 Portfolio chips (Standalone amber / Co-branded violet / Business sky)
→ Site type or channel: Commercial office · Education · Healthcare · Data centre (reuse amber/violet/sky/teal outline chips).

### 5.4 Score semantics on the QuestionCards
Spec §10.7 rules out sentiment/CSAT/NPS-style scores. **Decided:** the big number is the **count of signals above threshold in this domain** plus a week-on-week delta — honest, countable, and it matches the brief line. Keep the visual weight. **Copy and figures below are 02 §3.5 / 04 §2.5 (source of truth); this table only restates them for the visual mapping.**

| | Q1 "Is our installed base healthy?" | Q2 "Are we holding our channel?" | Q3 "Is the separation costing us?" |
|---|---|---|---|
| Caption | "Firmware releases · Date-code windows · RMA · Field failures" | "Strategic Partners · Backorder consequence · Certification · Competitor language" | "Entity · Portal · ERP · EDI cutovers against a control region" |
| Accent / border | orange, **highlighted** (hero lives here) | teal | sky-400 (red is reserved for S1) |
| Big number | `2` signals · "0 vs last week" · "+2 in 4 weeks" | `2` signals · "+1 vs last week" · "+2 in 4 weeks" | `1` signal · "0 vs last week" · "+1 in 4 weeks" |
| Severity mix line (new, under the number) | "S2 cliff · S2 cliff" | "S2 slope · S2 slope" | "S2 cliff" |
| AreaTrend | fw 4.1 contacts per 1,000 panel-weeks, with dashed baseline | ESD-SE-07 friction vs own baseline | UK-EU remit-to contacts vs control region |
| Gauge 1 | "Firmware cohorts in control" 98% (45 of 46) | "NA Strategic Partners within own baseline" 99.8% (419 of 420) | "Cutovers clean vs control" 75% (3 of 4) |
| Gauge 2 | "EST4 RMA rate vs control limit" 80% (0.28% of 0.35% · in control) | "N-3 OTD vs original promise" 71% (94% vs revised) | "UK-EU distributors affected" 8% (14 of 180) |
| MiniKPI 1 | TOP SIGNAL · "fw 4.1 (synthetic) · 3.1×" | DRIFTING PARTNER · "ESD-SE-07 · 3.1×" | IN DISPUTE · "£1.1m" · 212 invoices |
| MiniKPI 2 | PANELS EXPOSED · "1,240" · +5,560 eligible | BACKLOG AT RISK · "$2.3m" · 312 lines | DSO, TOP-10 UK-EU · "+6 days" |
| LiSN INSIGHT | 02 §3.5 Q1 variant A (exact) | 02 §3.5 Q2 variant A (exact) | 02 §3.5 Q3 variant A (exact) |

All figures `[illustrative]`; money values render with a visible "illustrative" micro-tag (§6.4). Delta tone: more signals = amber (attention), not red.

---

## 6. New components the KGS demo needs (native to the system)

Shared type:
```ts
type SevClass = 'S1'|'S2'|'S3'|'S4';
type Domain = 'Quality'|'Channel'|'Separation'|'Supply'|'Safety/Cyber';
type GateState = 'draft'|'awaiting'|'approved'|'returned'|'not_sent';
type Confidence = { level:'H'|'M'|'L'; score:number; known:number; inferred:number; sourceIndependence?:number; note?:string };
```

### 6.1 SeverityChip and SeverityStrip
**SeverityChip** — pill, 13px/700, **always "S# · word"**, plus a shape glyph so it survives greyscale:

| Class | Word | Glyph | bg | border | text |
|---|---|---|---|---|---|
| S1 | "Life-safety / regulatory" | ◆ filled | `red-500/15` | `red-500/60` | `red-400` |
| S2 | "Material impact" | ▲ filled | `amber-500/15` | `amber-500/50` | `amber-400` |
| S3 | "Operational" | ● filled | `slate-400/15` | `slate-400/40` | `slate-300` |
| S4 | "Efficiency" | ― | `neutral-500/15` | `neutral-500/40` | `neutral-300` |

Compact variant (cards, tables): "S2" only + glyph, with the word in `title`/tooltip — allowed only where the full word appears elsewhere on the same card. Domain chip sits right of it: neutral outline pill with a 6px dot (Quality orange · Channel teal · Separation sky · Supply violet-300 · Safety/Cyber red-400) and the word.

**SeverityStrip** — a single row inside a `#131313` bar (r=12, 1px `#1f1f1f`, h≈56, p 12/16), segments separated by 1px `#2a2a2a` dividers; each segment = caps label 11px neutral-400 over value 15px/700 white:
`[SeverityChip S2 · Material impact][Domain: Quality] | TYPE ▟ Cliff — step at release | BLAST RADIUS 1,240 panels · ~610 sites · 9 partners · 3 regions (+5,560 eligible not yet upgraded) | INCIDENT ○ Off — no fire event, injury or dispatch mentioned`
Second line (13px neutral-400): `"Any S1 phrase in this cohort routes to Quality immediately."`
- Type icons: **Cliff** = step glyph (lucide `ChartNoAxesColumnIncreasing` or a custom 16px SVG step ▁▇), **Slope** = ramp glyph (`TrendingUp`). Always with the word.
- Incident flag: Off = hollow circle + "Off" neutral; On = filled red-500 circle + "On" + red-400 text. Never colour alone.
- Compact variant for SpikeCards/WallCards: `S2 ▲ · Cliff · 1,240 panels · Incident off` on one line, 13px.
Placement: SD (full, directly under H1); EX SpikeCards (compact); Q1–Q3 WallCards and DetailPanel (compact).

### 6.2 ConfidenceMarker (K vs I split)
Looks like a KpiTile cousin. Full variant (SD right column, ~w-full of 4 cols):
- Row 1: caps label "CONFIDENCE" + level pill **"M 0.70"** (neutral pill; level also shown as **3 pips**: H ●●●, M ●●○, L ●○○ — shape-coded, not colour-coded) + "ⓘ How this is set".
- Row 2: split bar, 10px tall, r=full: **Known** segment solid `neutral-200`, **Inferred** segment hatched (`repeating-linear-gradient(135deg, #737373 0 4px, transparent 4px 8px)`) with 1px `#737373` outline; widths proportional (15 : 8).
- Row 3 legend (13px): "■ **K 15** known — firmware in the record · ▨ **I 8** inferred — from ship date and download logs".
- Row 4: "Source independence **0.78** · 9 partners · 4 channels".
Compact variant (cards): `M 0.70 · K 15 / I 8` with a 48px mini split bar.
Rule: inferred values anywhere in the UI render in *italic* with a dotted underline and "(inferred)" in the tooltip.
Placement: SD, every SpikeCard, WallCard, DetailPanel header, DiagnosisBox title, QuestionCard insight (compact).

### 6.3 JoinTagRow
Wrap-row of key/value chips (r=8, `#1a1a1a`, 1px `#2a2a2a`, h 26, 12px): key in neutral-500 caps 11px, value neutral-100 600 — e.g. `BRAND Edwards` `PLATFORM EST4` `FW 4.1 (synthetic)` `REGION US-SE · US-SW · Canada` `PARTNERS 9 ESDs` `SITE commercial office · education` `CHANNELS calls · cases · email · RMA · after-hours` `TIME weeks 1–3 post-release`. Prefix icon: `Link2` (neutral-400) with caps label "JOINED ON". Overflow: show 5, then `+3` chip that expands inline. In anonymised mode values swap (Edwards → Brand A, EST4 → Panel platform A, fw 4.1 → A.4.1).
Placement: SD (under ConfidenceMarker), EnhancedPanel subtitles, DetailPanel (replaces nothing — add under KPI grid), SpikeCard (first 3 tags only).

### 6.4 PnLDestinationTag
Inline block (r=12, `#131313`, 1px `#1f1f1f`, p 12): caps label "P&L DESTINATION" → value 16px/700 **"Warranty & field cost"** + secondary 13px neutral-400 "also: tech-support cost-to-serve" → exposure line mono 15px: `≈ $12k to date · ≈ $0.15m projected (12 wks)` + micro chip **`ILLUSTRATIVE`** (10–11px caps, neutral-400, 1px dashed `#4a4a4a`, r=4) → caption italic 13px neutral-400 `"Small because it is week three."` + "Method ⓘ" (opens drawer "Method & audit" tab). Icon: `Landmark` or `Wallet` neutral-300 (money is not good/bad — no green/red).
Compact (cards): `P&L → Warranty & field cost · ≈ $0.15m proj. [ILLUSTRATIVE]`.
Other destinations: Q2 "Backlog conversion / OTIF", "Partner sell-in"; Q3 "DSO / working capital", "Cost-to-serve".
Placement: SD, every SpikeCard, DetailPanel, QuestionCard (optional under insight).

### 6.5 RoutedOwner (small, pairs with the gate)
Row: 28px circle with role initials ("VE") on `#2b2646` violet-300 text → "Routed to **VP Engineering** (owner) · cc VP Service & Tech Support" 14px → micro 12px neutral-400 "President sees this because S2 and blast radius exceed the agreed threshold." Roles only — no names.

### 6.6 HumanGateStatus + ApproveButton
**HumanGateStatus** — the most prominent block on SD; styled like the AI INSIGHT box but keyed to gate state; r=12, p 16, 3px left bar:

| State | bg / border / bar | Icon | Title copy |
|---|---|---|---|
| `draft` | `#131313` / `#2a2a2a` / neutral-500 | `FileText` | "Draft investigation brief — not yet routed" |
| `awaiting` | `#1f190d` / amber-500/40 / amber-500 | `Clock` | **"Draft investigation brief — awaiting VP Engineering approval"** |
| `approved` | `#101b13` / green-500/35 / green-500 | `CheckCircle2` | "Investigation approved by VP Engineering · reproduction on candidate configuration" + audit line "Approved · investigation opened · audit logged {ts}" ({ts} = live click time, 04 §4.9) |
| `returned` | `#131313` / neutral / neutral-400 | `Undo2` | "Returned by VP Engineering — more evidence requested" |
| `not_sent` (secondary line) | inline | `CircleSlash` neutral-400 | "Draft known-issue note for tech-support agents — not sent" |

Under the title: 13px neutral-400 audit line ("Drafted by LiSN 16 Sep 06:10 UTC · routed 06:10 · IB-2609-004 (synthetic)"). Footer text (always): `"LiSN aids resolution. Nothing is sent until the owner approves."`
**ApproveButton** states:
- *Disabled (President view, default):* bg `#1a1a1a`, border `#2a2a2a`, text neutral-500, `Lock` icon, cursor not-allowed; tooltip **"Approval sits with VP Engineering"**; label "Approve investigation". Use `aria-disabled`, not `disabled`, so the tooltip shows on hover and focus.
- *Enabled (when "Viewing as: VP Engineering" is selected on the decision panel):* brand gradient bg (`#5332ff → #7c3aed`), white text, hover brightness 110%.
- *Loading:* spinner, label "Approving…" (500ms).
- *Done:* green outline, `Check` icon, "Approved" (disabled).
Secondary buttons (outline, like Back button): "View draft", **"Evidence · 23"** (opens drawer). There is **no** "Send", "Auto-fix" or "Notify partners" button anywhere.
Presenter affordance for the P0 "approval transition": the local segmented control **"Viewing as: President | VP Engineering"** on the decision panel (04 §4.9). The global role switch in the ContextBar is P2. Compact gate chip for cards: amber pill `⏱ Awaiting approval` / green `✓ Investigation approved` / neutral `Draft`.

### 6.7 EvidenceDrawer
Right overlay, **520px**, full height, z above content; `#0d0d0d`, left border `#1f1f1f`, `shadow-drawer`; backdrop `bg-black/50`. Header (sticky, 64px): "Evidence · 23" 20px/800 + SyntheticBadge (small) + × close. Tabs (existing Tabs style, violet active): **Snippets 23 · Linked RMAs 2 · Cohort · Method & audit** (5 featured snippets pinned first).
- *Snippet card* (`#131313`, r=12, p 14): top row = channel icon (`Phone` call, `FileText` case, `Mail` email, `RotateCcw` RMA, `Moon` after-hours) + "Call · ESD-SE-07 · Florida · 9 Sep" 13px neutral-400 + K/I pill ("K" solid neutral / "I" hatched) right; quote 15px/1.6 neutral-100 in curly quotes; matched phrase highlighted `bg-violet-500/20` + 1px bottom border violet-400 (e.g. "rolled one panel back to 4.0"); footer link "Open source interaction" (disabled, tooltip "Disabled in demo").
- *Linked RMAs:* rows `RMA-S-2609-0142` mono · "NFF" chip neutral · date.
- *Cohort:* "1,240 panels on fw 4.1 · serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic)" + disabled "Export list".
- *Method & audit:* detector, baseline window, event-time alignment note, K vs I per case, "who viewed and when" list.
Footer (sticky): "Every claim links to the interactions behind it. No customer-facing action taken. Synthetic scenario — not KGS data."
Use exact snippet copy from `signal_fw41.json` (04 §4.10). Placement: SD (P0); also openable from SpikeCard "Evidence · n" link and DetailPanel.

### 6.8 FirmwareLineageChart ("lineage river")
Panel content, h≈340 (SD) / 180 (Q1 mini). Recharts `ComposedChart`, 26 weekly points (30 Mar – 25 Sep 2026), y = contacts per 1,000 panel-weeks:
- fw 4.0 line: neutral-300, 2px, with a 20%-opacity ribbon (±band) — "4.0 (prior)".
- fw 4.1 line: orange-500, 2.5px, area fill gradient orange/30→0, starts at release week.
- Aggregate EST4 RMA rate: neutral-500 **dashed** 1.5px, flat; right-end label chip "EST4 RMA rate — in control" (neutral pill; the state is in words, not green colour alone).
- Denominator: bottom band (h 40) of bars = panels on each version (neutral-700 for 4.0, orange-900 for 4.1), axis label "Panels on version".
- `ReferenceLine` x=2 Sep, violet-400 dashed, label "2 Sep · fw 4.1 released (synthetic)".
- `ReferenceDot` 16 Sep on 4.1 line: 8px red-400 dot + ping ring (2 pulses) + label "16 Sep · threshold crossed — third independent partner".
- Future zone after 25 Sep shaded `white/[.03]`; `ReferenceLine` 7 Oct dotted neutral-500 "7 Oct · next monthly RMA review"; annotation "21 days earlier".
- Tooltip (`#1a1a1a`, 1px `#2a2a2a`, r=8, mono values), template per 04 §4.4, e.g. W25: "Week of 14 Sep · 4.1: 7.4 per 1,000 panel-weeks (9 contacts / 1,220 panels) · 4.0: 2.0 (11 / 5,580) · EST4 RMA rate 0.26%".
- Metric line above chart (02 HS-3, exact): `6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 · same 3 weeks · event-time aligned to each panel's upgrade · Poisson exact p<0.001`.
Placement: SD (full), Q1 LineMonitor slot (mini), EX Q1 AreaTrend (sparkline form).

### 6.9 DateCodeHeatStrip (+ mini p-chart)
Panel, h≈200. Left 65%: one row of 26 cells (date codes YYWW 2601–2626), cell 24×40, r=4, gap 2; fill = sequential single-hue orange (`orange-500` at 8% → 90% opacity) by early-life contact rate ratio vs adjacent production weeks; window **2611–2614** outlined 2px white with a bracket above labelled **"4.2× adjacent weeks · 4,800 units · 1,900 in stock at 11 distributors (containable)"**; x labels every 2nd code, 11px mono. Hover a cell: tooltip with code, units, contacts, ratio. Right 35%: mini p-chart — SKU return rate line (neutral-300) with dashed control limit (neutral-500, labelled "0.30% limit") and current 0.21% dot; caption "SKU return rate 0.21% — inside limit" (the "green aggregate" point, stated in words). Title: "Date-code window under a green aggregate". Chips: SeverityChip S2 · Quality · "Cliff on the serial axis".
Placement: Q1 (P0/P1), EX SpikeCard #2 (micro 26-cell strip, 8px tall).

### 6.10 SyntheticBadge and watermark
Persistent pill in the ContextBar right end **and** on SD header and EvidenceDrawer header: `FlaskConical` icon + **"SYNTHETIC SCENARIO — illustrative data, not KGS data"**, 12px/800 caps tracking-wide, text `yellow-300`, bg `yellow-500/10`, 1px **dashed** `yellow-500/50`, pill. Dashed border distinguishes it from any severity chip. Always visible (sticky ContextBar). **Watermark** (anonymised/export mode): fixed full-screen overlay, `pointer-events:none`, repeated diagonal text "Synthetic scenario — not KGS data" at 6% white, −30°. **FixedFooter** (24px, `#0d0d0d`, top border `#1f1f1f`, 12px neutral-400, centred): "Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved."

### 6.11 AnonymiseToggle
In ContextBar: label "Anonymise names" 13px neutral-300 + switch (36×20, track `#2a2a2a` off / `--brand` on, knob white). When on: a small chip "ANONYMISED" (neutral outline) appears next to the SyntheticBadge; all brand/platform/partner/region strings pass through a single helper, `fmt(str, anon)` from `mock/lib/label.ts` (in components: `useLabel()`), backed by `anonymise.json` (Edwards→"Brand A", EST4→"Panel platform A", fw 4.1→"A.4.1", ESD-SE-07→"Partner P-07", US-SE→"Region NA-1"); watermark on. Text swaps crossfade 150ms. **Default OFF** in the live, narrated session; forced **on** for print/export; named mode not exportable.

### 6.12 GovernedWatchTile (restricted)
Tile like a Panel but visibly different: 1px `red-500/30` border, header band 32px with a subtle diagonal stripe (`repeating-linear-gradient(45deg, #1a0f0f 0 6px, #140c0c 6px 12px)`) holding `Lock` icon + caps **"RESTRICTED"** + "Governed safety & cyber watch". Body: headline 18px/800 "2 open watch items (restricted)"; two rows in AgedCaseWatchlist anatomy (3px red left bar):
- W-1 · SeverityChip S1 · "Safety" · status "Single source → awaiting corroboration" · "Routed to Quality + CLO · 6 Sep 14:38 UTC" · second line "chronology updated 23 Sep 10:02" (back-search) · confidence compact "L–M 0.35". Exact row copy: 02 §10.1 / 04 §2.8.
- W-2 · S1 candidate · "Cyber" · "Candidate awareness timestamp 25 Sep 09:14 UTC" · "Routed to PSIRT + CLO · 09:21" · **ClockRing** (40px ring, elapsed arc neutral-200 over `#2a2a2a` track, ticks at 24h and 72h labelled "reference only — PSIRT determines whether awareness has begun"; centre mono "8h 46m") · confidence "L 0.30".
Content lines (what, where, platform) are rendered as redaction bars (`#2a2a2a` blocks, r=4) — **never a platform name, in either mode**. Footer 13px neutral-300: **"LiSN does not determine reportability."** Click → modal (r=16, `#0d0d0d`): "Access limited to Quality, PSIRT and Legal roles. Routed to Quality/PSIRT — human decision. LiSN does not determine reportability." with one button "Close". No hover lift (it is not a drill target).
Placement: EX (beside Evidence readiness, below the monitor), and a slim version in Q1 right column.

### 6.13 Small supporting pieces (from spec §10)
- **ContextBar** — 56px, `#0d0d0d`, bottom border `#1f1f1f`; filter selects styled as inactive Tabs with ▾ (Brand · Region · Period · Role — the Role switch is P2); "Data as of 25 Sep 2026 18:00 UTC" 13px neutral-400; AnonymiseToggle; SyntheticBadge. Sticky top.
- **FunnelStrip** — 36px row, 13px: "233,900 interactions read (26 weeks; ~9,000 this week) · 1,640 candidate clusters · **212 suppressed ⓘ** · **5 signals above threshold** · 2 governed watch items"; numbers mono 600; hover on "suppressed" → popover list with counts (V-12: Quarter-end / seasonal 74 · How-to after launch 58 · Planned test or drill language 41 · Same-site recontacts and duplicates 27 · Credit hold, routed to AR 12).
- **RankChip + WhyRankedPopover** — pill "#1 of 5" (brand-tint bg, violet-300 text) + link "Why ranked here?" → popover listing factors with small bars: severity × rate ratio × panels on version × source independence × est. field cost.
- **SignalChips** — outline pills with icon: `Sparkles` "New phrasing — first seen 4 Sep" · `Repeat` "Workaround spreading: 'rolled back to 4.0' in 5 cases" · `Scale` "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)".
- **CounterEvidence** — collapsible row (chevron), neutral box: "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause."
- **EmptyScope** — inside any tile: centred 14px neutral-400 "No signal above threshold in this scope" with a dashed `#2a2a2a` border. Never blank.

---

## 7. Accessibility and legibility for screen-share

1. **Minimum sizes (CSS px at 1280–1440 viewport):** body 15px, labels 12px, **micro 11px minimum** (the bank uses ~9px for "TOPIC CLUSTER"/"CHURN SIGNALS" — raise it), table cells 14px, chips 12px bold. Big numbers ≥ 36px. Present at 1440–1920 with browser zoom 110–125% so the far end of a Zoom/Teams share (often 720p) still reads.
2. **Contrast:** `#737373` on `#252525` = 3.2:1 and `#6b7280` on `#252525` = 3.2:1 — fail for small text. Use `neutral-400 #a3a3a3` (6.1:1) or lighter for anything read aloud; keep `#737373` only for decorative micro text on `#0d0d0d` (4.1:1). `#5332ff` text on `#0d0d0d` = 3.0:1 — use it for bars/fills only; use violet-400 `#a78bfa` (7.1:1) for violet text. Red-500 text on `#252525` = 4.1:1 → use red-400 `#f87171` (5.5:1) for small red text on exec cards.
3. **Never colour-only severity:** every severity carries "S#" + word + glyph; direction carries ▲/▼ + word; incident flag carries "On/Off"; gauge colours are backed by the % text; heat strip window is outlined and labelled with the ratio. Avoid red-vs-green as the only contrast (≈8% of men).
4. **Numbers:** `font-variant-numeric: tabular-nums` on all metrics; mono only for numbers and IDs, sans for words (fixes the bank's wrapped mono "Dispute follow-up").
5. **No truncated titles on the exec cards:** the bank truncates "Are cardholders satisfied with thei…" — allow 2 lines; KGS titles are shorter anyway.
6. **Screen-share compression:** avoid meaning in 1px hairlines or 10%-opacity tints alone; keep thin 300-weight fonts out; chart strokes ≥ 2px; dashed lines ≥ 1.5px with 4/4 dash.
7. **Motion:** respect `prefers-reduced-motion`; no auto-scrolling strips; count-ups finish within 0.7s.
8. **Focus and keyboard:** visible focus ring `ring-2 ring-violet-400 ring-offset-2 ring-offset-black` on cards, tabs, buttons; Esc closes drawer/modal; drawer traps focus; disabled Approve still focusable so its tooltip shows.
9. **Copy discipline visible on screen:** "LiSN" spelling, British spelling ("prioritise", "organisation"), no exclamation marks, `[illustrative]` tag on money values, "(synthetic)" on every firmware version, serial range, date code, SKU family and partner ID.

---

## Appendix — component × screen matrix (build order)

| Component | EX | Q1 | Q2 | Q3 | SD | Priority |
|---|---|---|---|---|---|---|
| LeftRail, DrillHeader, BackToOverviewHeader | ● | ● | ● | ● | ● | P0 reuse |
| ContextBar, FunnelStrip, SyntheticBadge, AnonymiseToggle, FixedFooter | ● | ● | ● | ● | ● | P0 new |
| ExecBriefBar, PulseStrip | ● | | | | | P0 reuse |
| QuestionCard (+ScoreDelta, SemiGauge, AreaTrend, MiniKPI, InsightBox) | ● | | | | | P0 reuse |
| RiskSpikeCard → Field Signal card (+ SeverityStrip compact, gate chip, P&L compact) | ● | | | | | P0 reuse+new |
| GovernedWatchTile (+ClockRing) | ● | ○ | | | | P0 new |
| KpiTile, SegmentTable, TopIntent, LineMonitor, Watchlist, FrictionTable | | ● | ○ | ○ | | P0 (Q1) / P1 |
| AISummaryWall → LiSN Signal Wall | | ● | ● | ● | | P0 (Q1) |
| StackedBarWithDetailPanel | | ● | ○ | ○ | | P0 (Q1) |
| DateCodeHeatStrip | ○ | ● | | | | P1 |
| JourneyStageTable → Lifecycle stage table | | ● | | | | P1 |
| SeverityStrip (full), ConfidenceMarker, JoinTagRow, PnLDestinationTag, RoutedOwner, HumanGateStatus + ApproveButton, EvidenceDrawer, FirmwareLineageChart, RankChip, SignalChips, CounterEvidence | | | | | ● | P0 new |
| PromiseGapTable, EngagementCard→Partner voice, RankingsTable→Partner league, Funnel | | | ● | ● | | P1 |
| SLA KpiTiles, EnhancedPanel, StuckDriverBars, ChipGroups, AgedCaseWatchlist, DiagnosisBox, RankedFailureList | | ○ | ○ | ● | ○ | P1 |
| MomentumTile → New phrasing | | ○ | | | | P2 |
| FloatingAIButton → Ask LiSN | ● | ● | ● | ● | ● | P2 |

● primary use · ○ optional reuse.
