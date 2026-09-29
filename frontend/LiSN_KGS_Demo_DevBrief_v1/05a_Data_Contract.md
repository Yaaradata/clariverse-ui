# 05a · Mock-Data Contract — LiSN × KGS Global Commercial Fire demo

**For:** the data engineer generating mock data, and Ranjit BK wiring it · **v2.1 · 28 Sep 2026** (reconciled with 01, 02, 03, the mock data and Ranjith's lead decisions) · **Companion:** `04_UX_Screens_Copy_Transitions.md`

**Rules**
- Everything here is a **synthetic scenario** `[illustrative]`. Nothing is a finding about any KGS product, firmware, batch, partner or system. Firmware versions, serials, date codes, SKU families, partner IDs, RMA and invoice numbers are all synthetic.
- **FIXED** values must be reproduced exactly (they appear in copy or the talk track). **GEN** values may be generated within the stated constraints.
- **Value figures come only from 02 §2 (V-01…V-14).** They are stored once in `exec.json › valueRegister` and re-exported from `values.ts`; components import them and never recompute or round them differently.
- Never add $ and £; never total unlike exposures.
- Static JSON only. The generated files are in the pack's `mock/` folder (`mock/data/*.json`, `mock/types.ts`, `mock/lib/*.ts`). **In the repo, copy the whole `mock/` folder to `src/mock/kgs/`** (06 §1.2–§1.3, alias `@kgs/*`); wherever this file says `src/data/kgs/`, read `src/mock/kgs/`.
- Brand, platform, firmware, partner, region, place and product-system names are always **tokens** (§3).
- British spelling; "LiSN"; none of "resolve", "root cause", "sentiment", "churn", "predict", "real-time", "index", "crossed a threshold this week".

### v2 changelog
- Removed the question-card index (types, JSON, checks). Cards now carry `count`, a week-on-week delta, "+n in 4 weeks", a severity mix and a `counted[]` list.
- Gauges, Brief, Pulse, card copy, FSM cards and the Applied value strip now use 02's values.
- Added `valueRegister` (V-01…V-14) and `unitCosts` from 02. Exposure method is $750 per excess contact.
- EST4 RMA rate rescaled to ~0.28% with a 0.35% limit.
- UK-EU remit-to/entity baseline is now 30/wk → 81/wk (V-09). Topic totals rescaled.
- EDI cutover is now clean vs control. The `edi-ack-watch` signal is removed.
- Rank order is now fw 4.1 · D-2 · ESD-SE-07 · N-3 · UK-EU.
- W-1 routed 6 Sep 14:38 UTC; chronology updated 23 Sep 10:02.
- Approval timestamp is runtime (live click), not data.
- Anonymise values now follow 03 §6.11 ("Partner P-07", "Region NA-1").
- Channel table keeps 419 / 420 NA Strategic Partners within own baseline.
- ESD-SE-07 friction rises from W16 (lead of ~5 weeks over sell-in).
- Suppressed breakdown now follows V-12 (74 / 58 / 41 / 27 / 12).

### v2.1 (pack review, 28 Sep)
- ESD-SE-07 friction W21–W26 is 40 vs 13 (3.08 → 3.1×); W22 = 5.
- EST4 4.0 weekly rates are derived from contacts ÷ panels (W10, W14, W22 now 2.1; W23 2.2). Headline 6.2 vs 2.0 unchanged.
- Houston switching row 11 vs 3 = 3.7×. P-F caption "about 2%" (23 of 1,151).
- Q2 "CERTIFICATIONS LAPSING ≤30 DAYS" is 186, so "212" means only look-alikes suppressed (V-12) and invoices in dispute (V-08).
- Repo path: copy `mock/` to `src/mock/kgs/` (06).

---

## 1. Conventions

| Item | Convention |
|---|---|
| Window | 26 weeks, Mon 30 Mar – Fri 25 Sep 2026; 130 working days. Week index `W1`…`W26`; `weekStart` = Monday ISO date. |
| Week table | W1 30 Mar · W2 6 Apr · W3 13 Apr · W4 20 Apr · W5 27 Apr · W6 4 May · W7 11 May · W8 18 May · W9 25 May · W10 1 Jun · W11 8 Jun · W12 15 Jun · W13 22 Jun · W14 29 Jun · W15 6 Jul · W16 13 Jul · W17 20 Jul · W18 27 Jul · W19 3 Aug · W20 10 Aug · W21 17 Aug · W22 24 Aug · W23 31 Aug · W24 7 Sep · W25 14 Sep · W26 21 Sep |
| Key dates (FIXED) | fw 4.1 released **2 Sep** · new phrasing first seen **4 Sep** · data as of **25 Sep 2026 18:00 UTC** · last week's digest **18 Sep 2026 18:00 UTC** · cutovers: NA portal **14 Jul** (W16), APAC order management **4 Aug** (W19), EDI mapping **12 Aug** (W20), UK-EU entity **1 Sep** (W23) |
| Above-threshold dates (FIXED, 02 V-11) | cutover **10 Sep** · ESD-SE-07 **11 Sep** · fw 4.1 **16 Sep** · D-2 **18 Sep (07:30 UTC)** · N-3 **22 Sep** |
| Next scheduled reviews (FIXED, 02 V-11) | RMA review **7 Oct** (fw 4.1, D-2) · QBR **15 Oct** (ESD-SE-07) · OTIF report **5 Oct** (N-3) · DSO report **5 Oct** (cutover) |
| Governed watch (FIXED) | W-1 first mention 6 Sep; routed **6 Sep 14:38 UTC**; back-search chronology update **23 Sep 10:02 UTC** (earlier email 19 weeks before) · W-2 first mention **25 Sep 09:14 UTC**, routed **09:21 UTC** |
| Timestamps | ISO 8601 UTC in data; UI "16 Sep 06:10 UTC". **Runtime timestamps** (approval, decision request, "just now") come from `fmtDemoTime(new Date())` → "DD Mon HH:MM UTC" using UTC getters; they are never stored in JSON. |
| Money | `{ amount, currency: 'USD'|'GBP', display, illustrative: true }`; `display` is FIXED text. |
| Rounding | Rates 1 dp; ratios 1 dp with "×"; percentages as shown in 02. |
| Severity | S1 "Life-safety / regulatory" · S2 "Material impact" · S3 "Operational" · S4 "Efficiency" (03 §6.1). Types: cliff · slope · spread · novel. |
| Confidence | level H/M/L/L–M + p; always K (known) vs I (inferred). |

### 1.1 ID conventions (all synthetic)

| Entity | Pattern | Examples |
|---|---|---|
| Signal (route slug) | kebab-case | `fw-4-1`, `dc-d2-2611`, `esd-se-07`, `n3-backorder`, `ukeu-entity-cutover`, `evidence-readiness` (enabler, not a signal above threshold) |
| Signal display ID | `SIG-YYMM-NNN` | `SIG-2609-001` … `SIG-2609-005`; enabler `SIG-2609-E01` |
| Legacy alias | 02 names the hero `A1` | route `/signals/A1` redirects to `/installed-base/signal/fw-4-1` |
| Evidence | `EV-YYMM-NNNN` | `EV-2609-0001` … `EV-2609-0023` |
| RMA | `RMA-S-YYMM-NNNN` | `RMA-S-2609-0142` |
| Panel serial | `E4-S-YYWWNNNN` | `E4-S-25184417`; cohort `E4-S-2403xxxx` to `E4-S-2611xxxx` |
| Date code | `YYWW` | `2611` |
| SKU family | letter-digit | `D-2`, `N-3`, `D-5`, `P-2`, `M-4`, `A-1`, `C-2` |
| Partner | `ESD-{REG}-{NN}` · `DIST-{CC}-{NNN}` · `DLR-{REG}-{NNN}` | `ESD-SE-07`, `DIST-UK-031`, `DLR-NE-118` |
| Invoice | `INV-{CC}-26-{NNNNN}` | `INV-UK-26-10442` |
| Brief / investigation / audit | `IB-2609-004` · `INV-2609-031` · `AUD-2609-NNNN` | |
| Watch item | `W-1`, `W-2` | |

### 1.2 Volume constraints

| Measure | Constraint |
|---|---|
| Interactions, 26 weeks | **233,900** exactly (Σ `weeklyInteractions`) |
| This week (W26) | **9,020** ("~9,000") |
| Per working day | mean ~1,800; range 1,100–2,900; quarter-end peak W13 |
| Channel mix | calls 36% · cases 22% · email 25% · RMA 6% · portal 5% · after-hours 2% · field notes 2% · training 1% · other 1% |
| Funnel | **1,640** clusters / **212** suppressed (V-12: 74 · 58 · 41 · 27 · 12) / **5** above threshold / **2** governed |
| Installed base | EST4 **18,500** panels (hero cohort 6.7%); **6,800** eligible on 4.0; **1,240** on 4.1; **5,560** not yet upgraded; **46** firmware cohorts, **45** in control |
| Partners | ~3,500 accounts; **420** NA ESDs / Strategic Partners (**419** within own baseline); ~180 UK-EU distributors (**14** affected) |
| RMAs | ~9,100 in 26 weeks; NFF 18% |
| Orders | ~410k lines; open backlog ~**$95m** |
| Quality interactions W26 | **5,480** (last week 5,168); trouble cases **1,610** |

---

## 2. TypeScript interfaces (`mock/types.ts` → repo `src/mock/kgs/types.ts`)

```ts
// ---------- primitives ----------
export type ISODate = string;
export type ISODateTime = string;
export type TokenString = string;      // may contain {{kind:key}} tokens (§3)
export type WeekIndex = number;        // 1..26; 27, 28 = ghost weeks for markers

export interface Money { amount: number; currency: 'USD' | 'GBP'; display: string; illustrative: true }

export type Role =
  | 'President' | 'VP Engineering' | 'VP Service & Tech Support' | 'Director Product Quality'
  | 'Quality' | 'Regional GM NA' | 'Regional GM UK-EU' | 'VP Sales' | 'VP Supply Chain'
  | 'CIO / separation PMO' | 'CFO' | 'PSIRT' | 'CLO' | 'Legal' | 'AR' | 'Learning Center manager';

export type QuestionId = 'installed-base' | 'channel' | 'separation';
export type Domain = 'Quality' | 'Channel' | 'Separation' | 'Supply' | 'Safety/Cyber' | 'Enabler';

// ---------- severity / confidence / tags ----------
export type SeverityClass = 'S1' | 'S2' | 'S3' | 'S4';
export type SeverityType = 'cliff' | 'slope' | 'spread' | 'novel';
export interface Severity {
  class: SeverityClass;
  word: 'Life-safety / regulatory' | 'Material impact' | 'Operational' | 'Efficiency';
  domain: Domain;
  type: SeverityType; typeNote: string;               // "Cliff (step at release)"
  blastRadius: { headline: TokenString; note?: TokenString };
  incident: { flag: boolean | 'n/a'; note: string };
  escalationRule?: string;
  compact: TokenString;                               // "S2 ▲ · Cliff · 1,240 panels · Incident off"
}
export type ConfidenceLevel = 'H' | 'M' | 'L' | 'L–M';
export interface Confidence {
  level: ConfidenceLevel; p: number;
  known: { count?: number; label: string };
  inferred: { count?: number; label: string };
  sourceIndependence?: { score: number; partners: number; channels: number; note?: string };
  short: string;                                      // "M 0.70 · K 15 / I 8"
}
export interface JoinTag { key: string; value: TokenString }   // key: BRAND, PLATFORM, FW, REGION, PARTNERS, SITE, CHANNELS, TIME…
export interface PnLDestination {
  primary: string; secondary?: string; compact: string;
  exposure?: { lines: { text: TokenString; valueId?: string }[]; caption?: string; subTiles?: { text: string; valueId?: string }[] };
}
export interface RankFactor { label: string; value: TokenString; weight: number; score: number }

// ---------- value register (02 §2) ----------
export interface ValueItem { id: string; figure: string; method: string; money?: boolean }  // id 'V-01'…'V-14'
export interface UnitCosts { tier1ContactUsd: [number, number]; excessFaultContactUsd: number; breakdown: { label: string; usd: number }[]; detectorReplacementUsd: number }

// ---------- human gate ----------
export type GateStatus = 'draft' | 'awaiting' | 'approved' | 'returned' | 'not_sent';
export interface HumanGate {
  id: string;
  artefactType: 'investigation-brief' | 'known-issue-note' | 'containment-memo' | 'partner-recovery-brief'
    | 'defect-ticket' | 'distributor-notice' | 'dunning-pause' | 'allocation-list' | 'field-change-proposal' | 'evidence-preservation-request';
  status: GateStatus;
  title: TokenString;                     // "Draft investigation brief — awaiting VP Engineering approval"
  chip: string;                           // compact: "Awaiting approval"
  auditLine?: string;
  owner: Role;
  approveEnabledFor: Role[];
  approveLabel?: string;                  // "Approve investigation"
  disabledTooltip?: string;               // "Approval sits with VP Engineering"
  onApprove?: {                           // copy only; timestamp is injected at runtime as {ts}
    title: string;                        // "Investigation approved by VP Engineering · reproduction on candidate configuration"
    auditLine: string;                    // "Approved · investigation opened · audit logged {ts}"
    openLines: string[];                  // "Rollout decision: pending — VP Engineering", "LiSN keeps watching: …"
    chip: string;                         // "Investigation approved"
    toast: { title: string; body: string };   // body contains {ts}
    auditEntry: string;                   // "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)"
    investigationId: string;
  };
  onApproveSecondary?: { gateId: string; title: string };   // known-issue note becomes "Awaiting VP Service & Tech Support approval — not sent"
  decisionRequest?: { buttonLabel: string; doneLabel: string; chip: string; auditEntry: string };  // President-only
}

// ---------- signal ----------
export interface Signal {
  id: string; displayId: string; question: QuestionId; ucIds: string[];
  rank?: number; rankOf?: number; rankScore?: number; rankFactors?: RankFactor[];
  aboveThreshold: boolean;
  aboveSince?: ISODateTime;               // for counts and WoW delta
  title: TokenString; headline: TokenString;
  metric: { display: TokenString; value: number; baseline: number; ratio: number; unit: string; line: TokenString };
  severity: Severity; confidence: Confidence;
  chips?: { icon: string; text: TokenString; ucId?: string; attributionPos?: number }[];
  counterEvidence?: TokenString;
  joinTags: JoinTag[];
  pnl: PnLDestination;
  routing: { owner: Role; cc: Role[]; informed?: Role[]; presidentReason?: string };
  recommendedAction: TokenString;
  gates: HumanGate[];
  evidenceCount?: number;
  nextReview?: { date: ISODate; label: string; leadDays: number };
  drillRoute: string;
}

// ---------- evidence ----------
export type EvidenceChannel = 'call' | 'case' | 'email' | 'rma' | 'afterHours';
export interface EvidenceSnippet {
  id: string; signalId: string; channel: EvidenceChannel;
  channelLabel: 'Call' | 'Case note' | 'Email' | 'RMA narrative' | 'After-hours line';
  partnerId: TokenString; region: TokenString; place: TokenString;
  localDateLabel: string; timestampUtc: ISODateTime;
  text: TokenString; highlight?: string;
  featured: boolean; featuredOrder?: number;
  firmwareSource: 'record' | 'imputed'; imputedFrom?: 'ship date' | 'download log';
  mentionsRollback: boolean; linkedRmaId?: string; note?: string;
}
export interface RMA { id: string; signalId: string; serial: string; partnerId: TokenString; returnedDate: ISODate; disposition: 'NFF'; label: string; linkedEvidenceId: string }
export interface CohortRegionRow { region: TokenString; panels: number; sites: number; partners: number; contacts: number }
export interface Cohort {
  signalId: string; panels: number; sites: number; partners: number; serialRange: string; eligibleNotUpgraded: number;
  regions: CohortRegionRow[]; siteTypes: { type: string; share: number }[]; noSymptom: { panels: number; sites: number };
  exportEnabled: false; exportTooltip: string;
}
export interface AuditEntry { ts: ISODateTime; label: string }

// ---------- series / charts ----------
export interface FirmwareSeriesPoint { week: WeekIndex; weekStart: ISODate; contacts: number; panels: number; rate: number; rateLow: number; rateHigh: number }
export interface FirmwareSeries { label: TokenString; versionRaw: string; colour: string; points: FirmwareSeriesPoint[] }
export interface ChartMarker { week: number; date: ISODate; label: TokenString; style: 'release' | 'threshold' | 'review' | 'cutover' | 'event'; pulse?: boolean }
export interface DateCodeCell { dateCode: string; units: number; ratePer10k: number; relativeRisk: number; inWindow: boolean }

// ---------- exec ----------
export interface Gauge { pct: number; label: string; sub: string; tone: 'green' | 'amber' | 'red' }
export interface MiniKpi { label: string; value: TokenString; caption?: TokenString; money?: boolean }
export interface CountedRow { signalId: string; text: TokenString }
export interface QuestionCardData {
  id: QuestionId; route: string; icon: 'Cpu' | 'Handshake' | 'Split';
  accent: 'orange' | 'teal' | 'sky'; highlighted: boolean;
  title: string; caption: string;
  count: number; countLabel: string;                 // "signals above threshold" | "signal above threshold"
  lastWeekCount: number; deltaLabel: string;         // "+1 vs last week" | "0 vs last week"
  fourWeekLabel: string;                             // "+2 in 4 weeks"
  severityMix: string;                               // "S2 cliff · S2 cliff"
  counted: CountedRow[]; notCounted: string; countedFooter: string;
  gauges: [Gauge, Gauge];
  trend: { kind: 'fw-lineage' | 'partner-dual' | 'cutover-vs-control'; ref: string };   // points into series in other files
  miniKpis: [MiniKpi, MiniKpi];
  insightLabel: 'LiSN INSIGHT'; insight: TokenString;
}
export interface PulseItem { n: 1 | 2 | 3; title: string; text: TokenString; chips: [string, string, string]; linkTo: string; chipAfterApprove?: string }
export interface MonitorCard {
  signalId: string; rank: number; title: TokenString;
  chips: { class: SeverityClass; word: string; domain: Domain; type: string };
  rows: { label: 'SOURCES' | 'COHORT' | 'WINDOW' | 'OWNER'; value: TokenString }[];
  metrics: { label: TokenString; value: string; change?: string }[];
  blastRadius: TokenString; confidenceShort: string; ownerGate: string; pnlShort: string;
  suggestion: TokenString; linkTo: string; gateChipAfterApprove?: string; microStrip?: boolean;
}
export interface SuppressedCard { title: string; rows: { label: string; count: number }[]; footer: string }
export interface AppliedValueTile {
  id: 'AV-1' | 'AV-2' | 'AV-3' | 'AV-4' | 'AV-5' | 'AV-6';
  label: string; value?: string; lines?: TokenString[]; sub: string; money?: boolean;
  methodIds: string[];                   // V-ids or 'count'
  onApprove?: { value: string; sub: string };
}
export interface WatchItem {
  id: 'W-1' | 'W-2'; row: string; secondLine?: string;   // exact 02 strings; no tokens, no platform/firmware/country
  routedAt: ISODateTime; firstMentionAt?: ISODateTime; chronologyUpdatedAt?: ISODateTime;
  confidence: { level: ConfidenceLevel; p: number };
  clock?: { startUtc: ISODateTime; elapsedLabel: string; refsHours: [24, 72]; caption: string };
}
export interface FunnelData { interactions: number; weekApprox: string; candidateClusters: number; suppressed: number; aboveThreshold: number; governed: number; suppressedReasons: { label: string; count: number }[]; suppressedFooter: string }

// ---------- drill-down panels ----------
export interface KpiTile { label: string; value: TokenString; sub?: TokenString; money?: boolean }
export interface TableRow { id?: string; cells: TokenString[]; tone?: (string | null)[]; linkTo?: string }
export interface WallCard { id: string; chips: string[]; title: TokenString; body: TokenString; metric: TokenString; trend: TokenString; linkLabel?: string; linkTo?: string; confidenceShort?: string; owner?: string; spark?: number[] }
export interface SignalWall { title: string; subtitle: string; pill: string; cards: WallCard[]; footer: { value: number; label: string }[] }
export interface DriverBar { label: TokenString; meta: TokenString; value: number; max: number; chip: 'High' | 'Medium' | 'Watch' }
export interface WatchlistCard { chip: string; title: TokenString; age: string; stage: TokenString; blocker: TokenString; tags: TokenString[] }
export interface EnhancedPanel { title: string; badge: string; violetLine: string; right: [string, string]; joinTags?: JoinTag[]; stats: KpiTile[]; driversTitle: string; drivers: DriverBar[]; watchlistTitle: string; watchlist: WatchlistCard[] }
export interface Diagnosis { title: string; main: TokenString; changed: TokenString; decideFirst: TokenString; confidenceShort?: string }
export interface StackedBarDetail { key: string; title: TokenString; chip: string; big: string; bigLabel: string; delta?: string; money?: boolean; grid: { label: string; value: string }[]; insight: TokenString; actionLabel: string; action: TokenString; phrasings: string[]; linkTo?: string }
export interface StackedBar { title: TokenString; stacks: TokenString[]; bars: { key: string; label: string; values: number[]; overlay?: number }[]; details: StackedBarDetail[]; defaultOpen: string }
export interface StableRow { text: TokenString }

export interface InstalledBasePage {
  title: string; subtitle: string; kpis: KpiTile[];
  interactionsTable: { total: number; delta: string; rows: TableRow[]; footnote: TokenString };
  clustersBySeverity: { label: string; caption: string; cliff: number; slope: number; spread: number; novel: number; restricted?: boolean }[];
  lineageMonitor: { title: string; sub: string; weeks: WeekIndex[]; series: { label: TokenString; values: (number | null)[]; colour: string; dashed?: boolean }[]; markers: ChartMarker[] };
  dateCode: { cells: DateCodeCell[]; bracket: string; pChart: number[]; limit: number; current: number; stats: KpiTile[]; confidence: Confidence; owner: string; gate: string; leadLine: string; caption: string };
  emergingPhrasing: TableRow[];
  contactsVsRma: { trouble: number[]; fw41: number[]; rmas: number[]; rmaRate: number[]; limit: number; lineLabel: string; markers: ChartMarker[]; caption: TokenString };
  signalWall: SignalWall; enhanced: EnhancedPanel; diagnosis: Diagnosis;
  symptomStack: StackedBar; stable: { rows: StableRow[]; footer: string };
  lifecycle: TableRow[];                  // P1
}
export interface ChannelPage {
  title: string; subtitle: string; kpis: KpiTile[];
  league: TableRow[];
  partnerTimeline: { partnerId: TokenString; friction: number[]; baseline: number[]; sellIn: number[]; sellInLY: number[]; markers: ChartMarker[]; pins: { week: WeekIndex; text: TokenString }[]; caption: string; valueLine: string; confidenceShort: string; gate: string };
  backorder: StackedBar & { otd: { revised: number; original: number }; consequenceRatio: number[]; leadLine: string };
  certification: { rows: TableRow[]; caption: TokenString };
  switching: TableRow[];
  enhanced: EnhancedPanel; stable: { rows: StableRow[] }; signalWall: SignalWall; diagnosis: Diagnosis;
}
export interface SeparationPage {
  title: string; subtitle: string; kpis: KpiTile[];
  cutoverTimeline: { series: { name: TokenString; values: number[]; dashed?: boolean; colour: string }[]; markers: ChartMarker[]; caption: string };
  scorecard: TableRow[];
  topicStack: StackedBar;
  defectSplit: { faqable: number; defect: number; caption: string };
  gates: HumanGate[];
  enhanced: EnhancedPanel; legacy: { rows: { text: TokenString; chip: string }[]; gate: string };
  signalWall: SignalWall; diagnosis: Diagnosis;
}

// ---------- anonymise / meta / demo ----------
export type TokenKind = 'brand' | 'platform' | 'fw' | 'partner' | 'region' | 'place' | 'term';
export type AnonymiseMap = Record<TokenKind, Record<string, { named: string; anon: string }>>;
export interface Meta {
  title: string; category: string; promise: string;
  dataAsOf: { iso: ISODateTime; label: string }; lastWeekDigest: ISODateTime;
  badge: string; badgeTooltip: string; footer: string;
  breadcrumbs: Record<string, TokenString>;       // "{role}" is a runtime placeholder
  filters: { brand: TokenString[]; region: string[]; period: { value: string; disabled: string[] } };
  weeks: { week: WeekIndex; weekStart: ISODate }[];
  weeklyInteractions: number[];
  channelMix: Record<string, number>;
  demo: { introLine: string; introLine2: string; tagline: string; resetToast: string; watermark: string; anonymisedChip: string };
}
export interface DemoState {                      // runtime only; in memory; reload resets (02 HS-9)
  anonymise: boolean;                             // default false
  viewingAs: 'President' | 'VP Engineering';
  approvals: Record<string, { ts: string }>;      // { 'fw-4-1': { ts: '28 Sep 14:07 UTC' } }
  decisionRequested: Record<string, { ts: string }>;
  drawerOpenedAt?: string;                        // for the "President · just now" audit line
}
export interface AskLisnItem { q: string; a: TokenString; cites: { label: string; evidenceId?: string; route?: string }[] }
```

`fmtDemoTime(d)` = `${d.getUTCDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`. The value is captured once per action; the gate, the audit entry and the toast all use that same string.

---

## 3. Tokens and `anonymise.json` (P0)

### 3.1 Grammar
- Tokens take the form `{{kind:key}}`. Firmware keys are `PLATFORM@version`.
- `fmt(str, anon)` (exported by `mock/lib/label.ts`) resolves each token to its `named` or `anon` value. An unknown token renders its key and logs a console warning. `label(kind, key, anon)` in the same file resolves one key; components use `useLabel()` from `mock/lib/demoState.ts`, which wraps `fmt` for the current mode.
- `{role}` in breadcrumbs is not a token. It is replaced at runtime.

### 3.2 `anonymise.json` (FIXED; 03 §6.11 patterns)

```json
{
  "brand": {
    "Edwards": { "named": "Edwards", "anon": "Brand A" },
    "Kidde Commercial": { "named": "Kidde Commercial", "anon": "Brand B" },
    "Aritech": { "named": "Aritech", "anon": "Brand C" },
    "EMS": { "named": "EMS", "anon": "Brand D" },
    "GST": { "named": "GST", "anon": "Brand E" },
    "AirSense": { "named": "AirSense", "anon": "Brand F" }
  },
  "platform": {
    "EST4": { "named": "EST4", "anon": "Panel platform A" },
    "EST3/EST3X": { "named": "EST3/EST3X", "anon": "Panel platform B" },
    "Edge": { "named": "Edge", "anon": "Panel platform C" },
    "iO": { "named": "iO", "anon": "Panel platform D" },
    "Evolve": { "named": "Evolve", "anon": "Panel platform E" },
    "VM/VS": { "named": "VM/VS", "anon": "Panel platform F" },
    "2X": { "named": "2X", "anon": "Panel platform G" },
    "FireCell": { "named": "FireCell", "anon": "Wireless platform H" },
    "SmartCell": { "named": "SmartCell", "anon": "Wireless platform J" },
    "GST panel family": { "named": "GST panel family", "anon": "Panel platform K" },
    "AirSense aspirating": { "named": "AirSense aspirating", "anon": "Aspirating platform L" },
    "ModuLaser": { "named": "ModuLaser", "anon": "Aspirating platform M" }
  },
  "fw": {
    "EST4@4.0": { "named": "4.0", "anon": "A.4.0" },
    "EST4@4.1": { "named": "4.1", "anon": "A.4.1" },
    "Edge@3.2": { "named": "3.2", "anon": "C.3.2" },
    "2X@7.4": { "named": "7.4", "anon": "G.7.4" },
    "VM/VS@5.1": { "named": "5.1", "anon": "F.5.1" },
    "GST panel family@G-7": { "named": "G-7", "anon": "K.7" }
  },
  "partner": {
    "ESD-SE-02": { "named": "ESD-SE-02", "anon": "Partner P-02" },
    "ESD-SE-07": { "named": "ESD-SE-07", "anon": "Partner P-07" },
    "ESD-SE-11": { "named": "ESD-SE-11", "anon": "Partner P-11" },
    "ESD-SE-14": { "named": "ESD-SE-14", "anon": "Partner P-14" },
    "ESD-SW-03": { "named": "ESD-SW-03", "anon": "Partner P-23" },
    "ESD-SW-09": { "named": "ESD-SW-09", "anon": "Partner P-29" },
    "ESD-SW-12": { "named": "ESD-SW-12", "anon": "Partner P-32" },
    "ESD-CA-04": { "named": "ESD-CA-04", "anon": "Partner P-44" },
    "ESD-CA-06": { "named": "ESD-CA-06", "anon": "Partner P-46" },
    "ESD-MW-05": { "named": "ESD-MW-05", "anon": "Partner P-55" },
    "DLR-NE-118": { "named": "DLR-NE-118", "anon": "Partner P-118" },
    "DLR-W-044": { "named": "DLR-W-044", "anon": "Partner P-144" },
    "DLR-SW-201": { "named": "DLR-SW-201", "anon": "Partner P-201" },
    "DIST-UK-004": { "named": "DIST-UK-004", "anon": "Distributor D-04" },
    "DIST-UK-019": { "named": "DIST-UK-019", "anon": "Distributor D-19" },
    "DIST-UK-031": { "named": "DIST-UK-031", "anon": "Distributor D-31" },
    "DIST-DE-012": { "named": "DIST-DE-012", "anon": "Distributor D-12" },
    "DIST-NL-007": { "named": "DIST-NL-007", "anon": "Distributor D-07" }
  },
  "region": {
    "US-SE": { "named": "US-SE", "anon": "Region NA-1" },
    "US-SW": { "named": "US-SW", "anon": "Region NA-2" },
    "Canada": { "named": "Canada", "anon": "Region NA-3" },
    "US-NE": { "named": "US-NE", "anon": "Region NA-4" },
    "US-MW": { "named": "US-MW", "anon": "Region NA-5" },
    "US-W": { "named": "US-W", "anon": "Region NA-6" },
    "UK-EU": { "named": "UK-EU", "anon": "Region EU-1" },
    "UK": { "named": "UK", "anon": "Country EU-a" },
    "DE": { "named": "DE", "anon": "Country EU-b" },
    "NL": { "named": "NL", "anon": "Country EU-c" },
    "FR": { "named": "FR", "anon": "Country EU-d" },
    "APAC": { "named": "APAC", "anon": "Region AP-1" }
  },
  "place": {
    "Florida": { "named": "Florida", "anon": "State 1" },
    "Texas": { "named": "Texas", "anon": "State 2" },
    "Ontario": { "named": "Ontario", "anon": "Province 1" },
    "Georgia": { "named": "Georgia", "anon": "State 3" },
    "Arizona": { "named": "Arizona", "anon": "State 4" },
    "Alabama": { "named": "Alabama", "anon": "State 5" },
    "Houston": { "named": "Houston", "anon": "Metro 1" }
  },
  "term": {
    "partner-portal": { "named": "Kidde FX", "anon": "partner portal" },
    "mobile-app": { "named": "KESMobile", "anon": "mobile app" },
    "connected": { "named": "ConnectedSafety+", "anon": "connected service" }
  }
}
```
Notes:
- Partner anon labels are unique.
- The "(synthetic)" suffix is plain text in copy, not part of any token.
- W-1 and W-2 contain no tokens.

---

## 4. Files

| File | Contents | Priority |
|---|---|---|
| `meta.json` | title, category, promise, data-as-of, last-week digest, badge, footer, breadcrumbs, filters, weeks, weekly interactions, channel mix, demo strings | P0 |
| `exec.json` | funnel, brief, pulse, question cards, applied value tiles, **valueRegister** + unitCosts + value statements, governed watch, evidence readiness tile | P0 |
| `monitor.json` | `signals[]` (5 + enabler), `cards[]` (5), `suppressedCard` | P0 |
| `signal_fw41.json` | hero signal, lineage, cohort, 23 evidence, RMAs, method, audit, gates, draft brief | P0 |
| `installedBase.json` | `InstalledBasePage` | P0 (lifecycle P1) |
| `channel.json` | `ChannelPage` | P1 |
| `separation.json` | `SeparationPage` | P1 |
| `anonymise.json` | §3.2 | P0 |
| `askLisn.json` | 3 canned Q&A | P2 |

### 4.1 `meta.json` (FIXED)
```json
{
  "title": "Global Commercial Fire — Signals this week",
  "category": "Installed-base early warning",
  "promise": "Hear it at the third call, not the monthly review.",
  "dataAsOf": { "iso": "2026-09-25T18:00:00Z", "label": "Data as of 25 Sep 2026 18:00 UTC" },
  "lastWeekDigest": "2026-09-18T18:00:00Z",
  "badge": "SYNTHETIC SCENARIO — illustrative data, not KGS data",
  "badgeTooltip": "Every figure, firmware version, serial, date code and partner ID on this screen is synthetic. Nothing here is a finding about any KGS product.",
  "footer": "Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved.",
  "breadcrumbs": {
    "/": "Installed-base early warning · Hear it at the third call, not the monthly review.",
    "/installed-base": "Global Commercial Fire · {role} · Installed base · Firmware · Date codes · RMA",
    "/installed-base/signal/fw-4-1": "Global Commercial Fire · {role} · Installed base · {{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)",
    "/channel": "Global Commercial Fire · {role} · Channel · Strategic Partners / ESDs · Backlog",
    "/separation": "Global Commercial Fire · {role} · Separation · Entity · Portal · ERP / EDI · DSO"
  },
  "filters": {
    "brand": ["All", "{{brand:Edwards}}", "{{brand:Kidde Commercial}}", "{{brand:Aritech}}", "{{brand:EMS}}", "{{brand:GST}}", "{{brand:AirSense}}"],
    "region": ["All", "NA", "UK-EU", "MEA", "India", "China", "APAC/AUS", "LatAm"],
    "period": { "value": "26 weeks to 25 Sep 2026", "disabled": ["13 weeks", "52 weeks — Discovery"] }
  },
  "weeklyInteractions": [8666, 8866, 8766, 8966, 8566, 9066, 9166, 8966, 7600, 9266, 9466, 9866, 11400, 8300, 8966, 9266, 9066, 8866, 8965, 9165, 9065, 8765, 8665, 7900, 9265, 9020],
  "channelMix": { "call": 0.36, "case": 0.22, "email": 0.25, "rma": 0.06, "portal": 0.05, "afterHours": 0.02, "fieldNote": 0.02, "training": 0.01, "other": 0.01 },
  "demo": {
    "introLine": "LiSN is reading 233,900 interactions…",
    "introLine2": "1,640 candidate clusters · 212 suppressed · 5 above threshold",
    "tagline": "Hear it at the third call, not the monthly review.",
    "resetToast": "Demo reset",
    "watermark": "Synthetic scenario — not KGS data",
    "anonymisedChip": "ANONYMISED"
  }
}
```

### 4.2 `exec.json` (FIXED)

**funnel, brief, pulse**
```json
{
  "funnel": {
    "interactions": 233900, "weekApprox": "~9,000", "candidateClusters": 1640, "suppressed": 212, "aboveThreshold": 5, "governed": 2,
    "suppressedReasons": [
      { "label": "Quarter-end / seasonal", "count": 74 },
      { "label": "How-to after launch (adoption, not fault)", "count": 58 },
      { "label": "Planned test or drill language", "count": 41 },
      { "label": "Same-site recontacts and duplicates", "count": 27 },
      { "label": "Credit hold, routed to AR", "count": 12 }
    ],
    "suppressedFooter": "Suppression reasons are shown, never hidden."
  },
  "brief": "Five signals above threshold — installed base 2, channel 2, separation 1. All five are with named owners; none has been actioned without approval.",
  "pulse": [
    { "n": 1, "title": "What's critical", "text": "{{platform:EST4}} fw {{fw:EST4@4.1}} (synthetic): 'devices not found after upgrade' at 3.1× panels still on {{fw:EST4@4.0}} — 9 partners, 3 regions, 1,240 panels. Draft brief awaiting VP Engineering.", "chips": ["S2 · Quality", "VP Engineering", "Awaiting approval"], "chipAfterApprove": "Investigation approved", "linkTo": "/installed-base/signal/fw-4-1" },
    { "n": 2, "title": "Where's your focus", "text": "{{region:UK-EU}} remit-to and invoice contacts 2.7× since the 1 Sep entity cutover (control 1.1×): £1.1m in dispute, DSO +6 days at top-10 distributors.", "chips": ["S2 · Separation", "CIO / separation PMO", "Awaiting triage"], "linkTo": "/separation" },
    { "n": 3, "title": "What's stable", "text": "3 of 4 cutovers clean against control. Nuisance-alarm contacts within own baseline for every detector family. 212 look-alikes suppressed.", "chips": ["—", "—", "No action needed"], "linkTo": "/separation" }
  ]
}
```

**questionCards[]** (FIXED)

| Field | Q1 `installed-base` | Q2 `channel` | Q3 `separation` |
|---|---|---|---|
| route · icon · accent · highlighted | `/installed-base` · Cpu · orange · **true** | `/channel` · Handshake · teal · false | `/separation` · Split · **sky** · false |
| title | "Is our installed base healthy?" | "Are we holding our channel?" | "Is the separation costing us?" |
| caption | "Firmware releases · Date-code windows · RMA · Field failures" | "Strategic Partners · Backorder consequence · Certification · Competitor language" | "Entity · Portal · ERP · EDI cutovers against a control region" |
| count · countLabel | 2 · "signals above threshold" | 2 · "signals above threshold" | 1 · "signal above threshold" |
| lastWeekCount · deltaLabel | 2 · "0 vs last week" | 1 · "+1 vs last week" | 1 · "0 vs last week" |
| fourWeekLabel | "+2 in 4 weeks" | "+2 in 4 weeks" | "+1 in 4 weeks" |
| severityMix | "S2 cliff · S2 cliff" | "S2 slope · S2 slope" | "S2 cliff" |
| counted[] | `fw-4-1`: "#1 · fw 4.1 cohort (synthetic) · S2 · Quality · Cliff · above threshold since 16 Sep · VP Engineering" · `dc-d2-2611`: "#2 · D-2 date codes 2611–2614 (synthetic) · S2 · Quality · Cliff · since 18 Sep · Director Product Quality" | `esd-se-07`: "#3 · {{partner:ESD-SE-07}} partner drift (synthetic) · S2 · Channel · Slope · since 11 Sep · Regional GM NA" · `n3-backorder`: "#4 · N-3 backorder consequence (synthetic) · S2 · Supply · Slope · since 22 Sep · VP Supply Chain" | `ukeu-entity-cutover`: "#5 · {{region:UK-EU}} entity cutover · S2 · Separation · Cliff · since 10 Sep · CIO / separation PMO" |
| notCounted | "Not counted: governed S1 watch items (restricted) · 45 firmware cohorts within own baseline · Evidence readiness (enabler)" | "Not counted: 419 NA Strategic Partners within own baseline · 1 order dip during a credit hold (routed to AR)" | "Not counted: NA portal, APAC order management and EDI mapping cutovers — clean vs control" |
| gauge 1 | 98 · "Firmware cohorts in control" · "45 of 46" · green | 99.8 · "NA Strategic Partners within own baseline" · "419 of 420" · green | 75 · "Cutovers clean vs control" · "3 of 4" · amber |
| gauge 2 | 80 · "EST4 RMA rate vs control limit" · "0.28% of 0.35% · in control" · green | 71 · "N-3 OTD vs original promise" · "94% vs revised" · amber | 8 · "UK-EU distributors affected" · "14 of 180" · amber |
| trend | `fw-lineage` → `signal_fw41.json › lineage` | `partner-dual` → `channel.json › partnerTimeline` | `cutover-vs-control` → `separation.json › cutoverTimeline` |
| miniKpis | "TOP SIGNAL" "fw 4.1 (synthetic) · 3.1×" · "PANELS EXPOSED" "1,240" "+5,560 eligible" | "DRIFTING PARTNER" "{{partner:ESD-SE-07}} · 3.1×" · "BACKLOG AT RISK" "$2.3m" "312 lines" (money) | "IN DISPUTE" "£1.1m" "212 invoices" (money) · "DSO, TOP-10 UK-EU" "+6 days" |
| insight | 02 §3.5 Q1 variant A (copy in 04 §2.5) | 02 Q2 variant A | 02 Q3 variant A |

`countedFooter` (all three): "Counted = above its own-baseline threshold at 25 Sep 18:00 UTC. Last week = digest of 18 Sep 18:00 UTC. A count, not a score."

**appliedValue** (FIXED, 02 §4)
```json
{
  "header": "Applied value · this week", "chip": "Synthetic scenario", "link": "How we count",
  "footnote": "Lead time is measured against the review calendar, not against when your teams would otherwise have known. Discovery tests that blind.",
  "tiles": [
    { "id": "AV-1", "label": "Ahead of the review cycle", "value": "21 days", "sub": "median lead vs next scheduled review · 5 signals", "methodIds": ["V-11"] },
    { "id": "AV-2", "label": "Signals routed", "value": "5 → 5 owners", "sub": "+ 2 governed watch items (restricted)", "methodIds": ["count"] },
    { "id": "AV-3", "label": "Decisions pending", "value": "5 awaiting owners", "sub": "7 drafts · 0 sent · 0 automatic actions", "methodIds": ["count"],
      "onApprove": { "value": "4 awaiting owners", "sub": "7 drafts · 1 approved · 0 sent · 0 automatic actions" } },
    { "id": "AV-4", "label": "Exposure in view", "money": true, "lines": ["Warranty & field ≤ $0.5m", "Backlog at risk $2.3m", "Invoices in dispute £1.1m"], "sub": "exposure, not savings · not summed", "methodIds": ["V-02", "V-05", "V-07", "V-08"] },
    { "id": "AV-5", "label": "Contacts avoidable", "money": true, "value": "~430", "sub": "$11k–26k handling cost · if owners approve", "methodIds": ["V-10"] },
    { "id": "AV-6", "label": "Look-alikes suppressed", "value": "212", "sub": "seasonal · how-to after launch · planned tests · credit holds", "methodIds": ["V-12"] }
  ],
  "leadList": [
    { "signalId": "fw-4-1", "crossed": "16 Sep", "review": "7 Oct · monthly RMA review", "lead": 21 },
    { "signalId": "dc-d2-2611", "crossed": "18 Sep", "review": "7 Oct · monthly RMA review", "lead": 19 },
    { "signalId": "esd-se-07", "crossed": "11 Sep", "review": "15 Oct · QBR", "lead": 34 },
    { "signalId": "n3-backorder", "crossed": "22 Sep", "review": "5 Oct · OTIF report", "lead": 13 },
    { "signalId": "ukeu-entity-cutover", "crossed": "10 Sep", "review": "5 Oct · DSO report", "lead": 25 }
  ]
}
```

**valueRegister, unitCosts, valueStatements** (FIXED; copy 02 §1 and §2 verbatim)
- `valueRegister`: 14 items `V-01`…`V-14`. `figure` and `method` are copied **verbatim** from the 02 §2 table (e.g. V-01 figure "Hero exposure to date ≈ $12k", method "Excess contacts = observed 23 − expected on the 4.0 rate (2.0 × 1.24k panels × 3 wks = 7.4) ≈ 16 × $750 fully loaded field cost.").
- `unitCosts`:
```json
{ "tier1ContactUsd": [25, 60], "excessFaultContactUsd": 750,
  "breakdown": [ { "label": "Truck roll", "usd": 450 }, { "label": "Tier-3 escalation", "usd": 150 }, { "label": "NFF return share", "usd": 150 } ],
  "detectorReplacementUsd": 120 }
```
- `valueStatements`: the four strings in 02 §1.
- `neverOnScreen`: "Never on screen: revenue, savings, ROI or payback."

**governedWatch** (FIXED, 02 §10)
```json
{
  "title": "Governed safety & cyber watch", "band": "RESTRICTED", "headline": "2 open watch items (restricted)", "pnl": "P&L: Restricted",
  "items": [
    { "id": "W-1",
      "row": "Safety · S1 watch · single source → awaiting corroboration · routed to Quality + CLO · 6 Sep 14:38 UTC · status: under Quality review · confidence L–M 0.35",
      "secondLine": "Back-search found an earlier related email (19 weeks before), coded 'commissioning' — chronology updated 23 Sep 10:02. Quality decides significance.",
      "firstMentionAt": "2026-09-06T14:31:00Z", "routedAt": "2026-09-06T14:38:00Z", "chronologyUpdatedAt": "2026-09-23T10:02:00Z",
      "confidence": { "level": "L–M", "p": 0.35 } },
    { "id": "W-2",
      "row": "Cyber · S1 candidate · 4 unrelated sites · candidate first mention 25 Sep 09:14 UTC · not in PSIRT queue at detection · routed to PSIRT + CLO 09:21 UTC · confidence L 0.30",
      "firstMentionAt": "2026-09-25T09:14:00Z", "routedAt": "2026-09-25T09:21:00Z",
      "confidence": { "level": "L", "p": 0.30 },
      "clock": { "startUtc": "2026-09-25T09:14:00Z", "elapsedLabel": "8h 46m", "refsHours": [24, 72],
                 "caption": "8h 46m since candidate first mention · 24h / 72h ticks are reference only — PSIRT determines whether awareness has begun." } }
  ],
  "footer": "LiSN does not determine reportability.",
  "modal": "Access limited to Quality, PSIRT and Legal roles. Routed to Quality / PSIRT — human decision. LiSN does not determine reportability."
}
```

**evidenceReadiness** (FIXED, 02 R-Q1-3)
```json
{ "title": "Evidence readiness", "chip": "S4 · Efficiency", "extraChip": "ENABLER",
  "body": "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57%.",
  "label": "Discovery measures this first — on your data.",
  "confidenceShort": "H 0.90 · K blank-field counts / I recoverable share",
  "owners": "Quality · VP Service & Tech Support · CIO", "linkTo": "/installed-base#why-late" }
```
The literal "EST4" in `body` must be written as `{{platform:EST4}}` in JSON (it is shown here as it renders).

### 4.3 `monitor.json` (FIXED)

**signals[]** (summary; the full hero record is in `signal_fw41.json`)

| id | displayId | rank | rankScore | question | ucIds | aboveSince (UTC) | severity | confidence short | owner (cc) | P&L compact | nextReview (lead) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `fw-4-1` | SIG-2609-001 | 1 | 0.84 | installed-base | UC-Q-1, Q-14, Q-15, Q-10 | 2026-09-16T06:10Z | S2 · Quality · cliff | "M 0.70 · K 15 / I 8" | VP Engineering (VP Service & Tech Support) | "Warranty & field" | 7 Oct RMA review (21) |
| `dc-d2-2611` | SIG-2609-002 | 2 | 0.71 | installed-base | UC-Q-2 | 2026-09-18T07:30Z | S2 · Quality · cliff (serial axis) | "M 0.65 · K 22 / I 9" | Director Product Quality (VP Engineering) | "Warranty & containment" | 7 Oct RMA review (19) |
| `esd-se-07` | SIG-2609-003 | 3 | 0.66 | channel | UC-C-1 | 2026-09-11T09:00Z | S2 · Channel · slope | "H on orders (K) · M on friction→orders (I)" | Regional GM NA (VP Service & Tech Support) | "Partner revenue" | 15 Oct QBR (34) |
| `n3-backorder` | SIG-2609-004 | 4 | 0.58 | channel | UC-C-6 | 2026-09-22T09:00Z | S2 · Supply · slope | "H on dates (K) · M on cancellation (I)" | VP Supply Chain (VP Sales) | "Backlog conversion" | 5 Oct OTIF report (13) |
| `ukeu-entity-cutover` | SIG-2609-005 | 5 | 0.52 | separation | UC-C-3 | 2026-09-10T09:00Z | S2 · Separation · cliff | "H on timing (K) · M on cause (I)" | CIO / separation PMO (CFO, Regional GM UK-EU) | "DSO" | 5 Oct DSO report (25) |
| `evidence-readiness` | SIG-2609-E01 | — | — | installed-base | UC-Q-17 | — (aboveThreshold false) | S4 · Enabler · slope | "H 0.90" | Quality | "Warranty (NFF) and containment precision" | — |

Rank factors for `fw-4-1` (FIXED):
- Severity "S2" · weight 0.30 · score 0.80
- "Rate ratio" "3.1×" · 0.20 · 0.90
- "Panels on version" "1,240 (+5,560 eligible)" · 0.20 · 0.85
- "Source independence" "0.78" · 0.15 · 0.78
- "Est. field cost" "≈ $0.15m projected" · 0.15 · 0.86

Σ = 0.836, shown as **0.84**. Popover line: "Rank score 0.84 · next: D-2 date-code window 0.71". Other signals' factors are GEN in the same shape.

**cards[]** — the 5 rows of 04 §2.7 (02 §9.2 copy verbatim). Rows per card:

| id | SOURCES | COHORT | WINDOW | OWNER |
|---|---|---|---|---|
| fw-4-1 | "Calls · Cases · Email · RMA · After-hours" | "{{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)" | "Weeks 1–3 post-release" | "VP Engineering" |
| dc-d2-2611 | "Calls · Cases · RMA" | "Detector family D-2 · date codes 2611–2614 (synthetic)" | "6 weeks" | "Director Product Quality" |
| esd-se-07 | "Calls · Cases · Email · Portal" | "{{partner:ESD-SE-07}} (synthetic) · {{region:US-SE}}" | "6 weeks" | "Regional GM NA" |
| n3-backorder | "Email · Order desk · Calls" | "Notification family N-3 (synthetic) · 11 NA partners" | "Weeks 21–26" | "VP Supply Chain" |
| ukeu-entity-cutover | "Email · Cases · Portal" | "{{region:UK-EU}} · 14 distributors" | "Since 1 Sep" | "CIO / separation PMO" |

`gateChipAfterApprove` on `fw-4-1`: "✓ Investigation approved". `microStrip: true` on `dc-d2-2611`.

**suppressedCard**
```json
{ "title": "212 look-alikes suppressed",
  "rows": [ { "label": "Quarter-end / seasonal", "count": 74 }, { "label": "How-to after launch — adoption, not fault", "count": 58 },
            { "label": "Planned test or drill language", "count": 41 }, { "label": "Same-site recontacts and duplicates", "count": 27 },
            { "label": "Credit hold, routed to AR", "count": 12 } ],
  "footer": "Recall broad, rank severe." }
```

### 4.4 `signal_fw41.json` (FIXED — the hero)

```json
{
  "signal": {
    "id": "fw-4-1", "displayId": "SIG-2609-001", "question": "installed-base",
    "ucIds": ["UC-Q-1", "UC-Q-14", "UC-Q-15", "UC-Q-10"],
    "rank": 1, "rankOf": 5, "rankScore": 0.84, "aboveThreshold": true, "aboveSince": "2026-09-16T06:10:00Z",
    "title": "EST4 fw 4.1 — devices not found after upgrade",
    "headerTitle": "Signal #1 of 5 — firmware 4.1 cohort",
    "headline": "{{platform:EST4}} · firmware {{fw:EST4@4.1}} (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on {{fw:EST4@4.0}}; 9 partners, 3 regions; 1,240 panels on version",
    "subline": "First seen 4 Sep · above threshold since 16 Sep · routed to VP Engineering 16 Sep 06:10 UTC · SIG-2609-001 (synthetic)",
    "metric": { "display": "6.2 vs 2.0", "value": 6.2, "baseline": 2.0, "ratio": 3.1, "unit": "contacts per 1,000 panel-weeks",
      "line": "6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 · same 3 weeks · event-time aligned to each panel's upgrade · Poisson exact p<0.001" },
    "severity": {
      "class": "S2", "word": "Material impact", "domain": "Quality", "type": "cliff", "typeNote": "Cliff (step at release)",
      "blastRadius": { "headline": "Blast radius 1,240 panels · ~610 sites · 9 partners · 3 regions ({{region:US-SE}}, {{region:US-SW}}, {{region:Canada}})", "note": "5,560 eligible panels not yet upgraded" },
      "incident": { "flag": false, "note": "Incident flag: Off — no fire event, injury or dispatch mentioned" },
      "escalationRule": "Any S1 phrase in this cohort routes to Quality immediately.",
      "compact": "S2 ▲ · Cliff · 1,240 panels · Incident off"
    },
    "confidence": { "level": "M", "p": 0.70, "short": "M 0.70 · K 15 / I 8",
      "known": { "count": 15, "label": "cases with firmware in record" },
      "inferred": { "count": 8, "label": "imputed from ship date and download logs" },
      "sourceIndependence": { "score": 0.78, "partners": 9, "channels": 4, "note": "after-hours counted with voice" } },
    "chips": [
      { "icon": "Sparkles", "text": "New phrasing — first seen 4 Sep", "ucId": "UC-Q-14" },
      { "icon": "Repeat", "text": "Workaround spreading: 'rolled back to 4.0' in 5 cases", "ucId": "UC-Q-15" },
      { "icon": "Scale", "text": "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)", "ucId": "UC-Q-10", "attributionPos": 0.3 }
    ],
    "counterEvidence": "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause",
    "joinTags": [
      { "key": "BRAND", "value": "{{brand:Edwards}}" }, { "key": "PLATFORM", "value": "{{platform:EST4}}" },
      { "key": "FW", "value": "{{fw:EST4@4.1}} (synthetic)" }, { "key": "REGION", "value": "{{region:US-SE}} · {{region:US-SW}} · {{region:Canada}}" },
      { "key": "PARTNERS", "value": "9 ESDs" }, { "key": "SITE", "value": "commercial office · education" },
      { "key": "CHANNELS", "value": "calls · cases · email · RMA · after-hours" }, { "key": "TIME", "value": "weeks 1–3 post-release" }
    ],
    "pnl": {
      "primary": "Warranty & field cost", "secondary": "tech-support cost-to-serve",
      "compact": "P&L → Warranty & field cost · ≈ $0.15m proj.",
      "exposure": {
        "lines": [ { "text": "P&L: Warranty & field cost · secondary: tech-support cost-to-serve" },
                   { "text": "To date ≈ $12k · projected ≈ $0.15m over 12 weeks if the rollout continues unchanged", "valueId": "V-01,V-02" } ],
        "caption": "Small because it is week three.",
        "subTiles": [ { "text": "~140 excess contacts avoidable if the rollout is paused at week 3 — decision sits with VP Engineering", "valueId": "V-03" },
                      { "text": "21 days ahead of the scheduled monthly RMA review", "valueId": "V-04" } ]
      }
    },
    "routing": { "owner": "VP Engineering", "cc": ["VP Service & Tech Support"], "informed": ["Quality", "President"],
                 "presidentReason": "President sees this because S2 and blast radius exceed the agreed threshold." },
    "recommendedAction": "Owner to decide: engineering reproduction on the candidate configuration, and whether to pause the staged rollout and download of 4.1.",
    "evidenceCount": 23,
    "nextReview": { "date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "leadDays": 21 },
    "drillRoute": "/installed-base/signal/fw-4-1",
    "gates": [
      {
        "id": "gate-fw41-brief", "artefactType": "investigation-brief", "status": "awaiting",
        "title": "Draft investigation brief — awaiting VP Engineering approval", "chip": "Awaiting approval",
        "auditLine": "Drafted by LiSN 16 Sep 06:10 UTC · routed 06:10 · IB-2609-004 (synthetic)",
        "owner": "VP Engineering", "approveEnabledFor": ["VP Engineering"], "approveLabel": "Approve investigation",
        "disabledTooltip": "Approval sits with VP Engineering",
        "onApprove": {
          "title": "Investigation approved by VP Engineering · reproduction on candidate configuration",
          "auditLine": "Approved · investigation opened · audit logged {ts}",
          "openLines": ["Rollout decision: pending — VP Engineering", "LiSN keeps watching: the 4.1 rate is re-measured daily against 4.0."],
          "chip": "Investigation approved",
          "toast": { "title": "Investigation opened", "body": "Approved by VP Engineering · audit logged {ts} · nothing sent outside LiSN" },
          "auditEntry": "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)",
          "investigationId": "INV-2609-031"
        },
        "onApproveSecondary": { "gateId": "gate-fw41-kin", "title": "Awaiting VP Service & Tech Support approval — not sent" },
        "decisionRequest": { "buttonLabel": "Ask VP Engineering for a decision", "doneLabel": "Decision requested",
                             "chip": "Decision requested by President", "auditEntry": "{ts} · President requested a decision from VP Engineering" }
      },
      { "id": "gate-fw41-kin", "artefactType": "known-issue-note", "status": "not_sent",
        "title": "Draft known-issue note for tech-support agents — not sent", "chip": "Not sent",
        "owner": "VP Service & Tech Support", "approveEnabledFor": ["VP Service & Tech Support"] }
    ],
    "gateFooter": "LiSN aids resolution. Nothing is sent until the owner approves."
  },
  "lineage": "§5.2",
  "cohort": {
    "signalId": "fw-4-1", "panels": 1240, "sites": 610, "partners": 9,
    "serialRange": "E4-S-2403xxxx to E4-S-2611xxxx", "eligibleNotUpgraded": 5560,
    "regions": [
      { "region": "{{region:US-SE}}", "panels": 540, "sites": 262, "partners": 4, "contacts": 11 },
      { "region": "{{region:US-SW}}", "panels": 430, "sites": 214, "partners": 3, "contacts": 8 },
      { "region": "{{region:Canada}}", "panels": 270, "sites": 134, "partners": 2, "contacts": 4 }
    ],
    "siteTypes": [ { "type": "Commercial office", "share": 0.58 }, { "type": "Education", "share": 0.31 }, { "type": "Other", "share": 0.11 } ],
    "noSymptom": { "panels": 412, "sites": 180 },
    "exportEnabled": false, "exportTooltip": "Export disabled in demo"
  },
  "evidence": "§4.4.1",
  "rmas": [
    { "id": "RMA-S-2609-0142", "signalId": "fw-4-1", "serial": "E4-S-25184417", "partnerId": "{{partner:ESD-SE-11}}", "returnedDate": "2026-09-16", "disposition": "NFF", "label": "NFF — no fault found", "linkedEvidenceId": "EV-2609-0008" },
    { "id": "RMA-S-2609-0177", "signalId": "fw-4-1", "serial": "E4-S-26030962", "partnerId": "{{partner:ESD-SW-09}}", "returnedDate": "2026-09-22", "disposition": "NFF", "label": "NFF — no fault found", "linkedEvidenceId": "EV-2609-0019" }
  ],
  "rmaNote": "Two NFF returns in three weeks. Without the join, each closes as 'no fault found' on its own.",
  "method": [
    { "k": "Detector", "v": "Difference-in-differences, event-time aligned; Poisson exact test." },
    { "k": "Trigger", "v": "≥2.5× and ≥3 independent partners." },
    { "k": "Baseline window", "v": "26 weeks, prior version, event-time aligned." },
    { "k": "Knowledge vs inference", "v": "K 15 in record · I 8 imputed (5 ship date, 3 download logs)." },
    { "k": "Source independence", "v": "0.78 · voice incl. after-hours, case, email, RMA." },
    { "k": "Suppressed", "v": "4 how-to questions about new 4.1 features; 2 same-site recontacts." },
    { "k": "Exposure", "v": "V-01 and V-02 method text from 02 §2 (verbatim)." },
    { "k": "Clock", "v": "UTC." }
  ],
  "audit": [
    { "ts": "2026-09-25T07:55:00Z", "label": "25 Sep 07:55 · Viewed by President (weekly digest)" },
    { "ts": "2026-09-22T11:30:00Z", "label": "22 Sep 11:30 · Evidence updated · RMA-S-2609-0177 linked" },
    { "ts": "2026-09-17T14:22:00Z", "label": "17 Sep 14:22 · Viewed by VP Service & Tech Support" },
    { "ts": "2026-09-16T06:10:00Z", "label": "16 Sep 06:10 · Threshold crossed · routed to VP Engineering (owner), cc VP Service & Tech Support · draft investigation brief generated" },
    { "ts": "2026-09-04T16:40:00Z", "label": "4 Sep 16:40 · New phrasing cluster opened" }
  ],
  "auditRuntime": { "drawerOpen": "President · just now" },
  "drawer": { "title": "Evidence · 23", "tabs": ["Snippets 23", "Linked RMAs 2", "Cohort", "Method & audit"],
              "footer": "Every claim links to the interactions behind it. No customer-facing action taken. Synthetic scenario — not KGS data.",
              "sourceLinkTooltip": "Disabled in demo" },
  "draftBrief": "§4.4.2"
}
```
Runtime audit entries (the approval entry, the decision-request entry and "President · just now") are prepended by the UI. They are not stored.

#### 4.4.1 Evidence — 23 records (FIXED)

Invariants: 23 total · 9 partners · US-SE 11 / US-SW 8 / Canada 4 · K 15 / I 8 (5 ship date, 3 download log) · channels: call 7, case 8, email 4, RMA 2, after-hours 2 · rollback mentioned in 5 records across 4 partners · "loop 2/3" named in 6 · before 16 Sep UTC only ESD-SE-07 and ESD-SW-03 appear (so 16 Sep is the third independent partner) · weekly counts W23 1, W24 5, W25 9, W26 8. All `signalId` = `fw-4-1`. `featured` = true for featuredOrder 1–5.

| id | UTC timestamp | local label | channel | partner | region | place | K/I | rollback | featured | text |
|---|---|---|---|---|---|---|---|---|---|---|
| EV-2609-0001 | 2026-09-04T16:40Z | 4 Sep | case | ESD-SE-07 | US-SE | Florida | K | no | — | "Customer site upgraded to {{fw:EST4@4.1}} this morning; loop 2 now shows devices not found. Re-mapped twice, same result." |
| EV-2609-0002 | 2026-09-08T14:05Z | 8 Sep | call | ESD-SW-03 | US-SW | Texas | I (ship date) | no | — | "Panel went to the new firmware and now half the loop is missing on the map." |
| EV-2609-0003 | 2026-09-09T15:20Z | 9 Sep | call | ESD-SE-07 | US-SE | Florida | K | yes | 1 | "After we pushed {{fw:EST4@4.1}} the loop comes back with half the devices missing. Rolled one panel back to {{fw:EST4@4.0}} and it mapped fine." |
| EV-2609-0004 | 2026-09-10T13:48Z | 10 Sep | email | ESD-SW-03 | US-SW | Texas | K | no | — | "Following up — same site, still not mapping after the upgrade. We need this sorted before the occupancy walk-through." |
| EV-2609-0005 | 2026-09-11T16:02Z | 11 Sep | case | ESD-SW-03 | US-SW | Texas | K | no | 2 | "Devices not found after upgrade on loops 2 and 3; mapping stops around 60%. Power-cycled; no change." |
| EV-2609-0006 | 2026-09-11T20:31Z | 11 Sep | call | ESD-SW-03 | US-SW | Texas | I (download log) | no | — | "Second panel this week on {{fw:EST4@4.1}} — loop 3 comes back empty." |
| EV-2609-0007 | 2026-09-16T03:12Z | 15 Sep | email | ESD-CA-04 | Canada | Ontario | I (ship date) | no | 3 | "Third site this month with the same thing after the firmware update — is there a known issue?" · note "Received 15 Sep 23:12 ET = 16 Sep 03:12 UTC · third independent partner" |
| EV-2609-0008 | 2026-09-16T12:40Z | 16 Sep | rma | ESD-SE-11 | US-SE | Georgia | K | no | 4 | "Module returned as suspected failure following panel upgrade. Bench: no fault found." · linkedRmaId RMA-S-2609-0142 |
| EV-2609-0009 | 2026-09-16T17:15Z | 16 Sep | call | ESD-SE-11 | US-SE | Georgia | K | yes | — | "Upgraded two panels at the school; one maps, the other stops partway. Rolled it back to {{fw:EST4@4.0}} for now." |
| EV-2609-0010 | 2026-09-17T15:30Z | 17 Sep | case | ESD-SW-09 | US-SW | Arizona | K | no | — | "Devices not found after upgrade. Loop 1 fine, loops 2 and 3 partial." |
| EV-2609-0011 | 2026-09-17T18:05Z | 17 Sep | call | ESD-SE-14 | US-SE | Alabama | I (ship date) | no | — | "Is there a known issue with the latest {{platform:EST4}} firmware and mapping? Seeing it on a three-loop job." |
| EV-2609-0012 | 2026-09-17T19:44Z | 17 Sep | case | ESD-CA-04 | Canada | Ontario | K | yes | — | "Rolled back to {{fw:EST4@4.0}} and mapping completed. Holding further upgrades at this site." |
| EV-2609-0013 | 2026-09-18T02:10Z | 18 Sep | afterHours | ESD-SE-02 | US-SE | Florida | I (download log) | no | 5 | "Acceptance test with the AHJ tomorrow and the loop won't map since the update." |
| EV-2609-0014 | 2026-09-18T14:26Z | 18 Sep | email | ESD-SE-02 | US-SE | Florida | K | no | — | "Can you confirm whether {{fw:EST4@4.1}} changes how panels with more than two loops are mapped? Two jobs affected." |
| EV-2609-0015 | 2026-09-18T16:50Z | 18 Sep | case | ESD-SE-14 | US-SE | Alabama | K | yes | — | "Mapping stalls around 60% on loop 2 after the update. Rolled back; fine on {{fw:EST4@4.0}}." |
| EV-2609-0016 | 2026-09-21T14:12Z | 21 Sep | call | ESD-SW-12 | US-SW | Texas | K | no | — | "New install went straight to {{fw:EST4@4.1}} — loop won't fully map. Is {{fw:EST4@4.0}} still available to download?" |
| EV-2609-0017 | 2026-09-21T15:38Z | 21 Sep | case | ESD-CA-06 | Canada | Ontario | I (ship date) | no | — | "Devices not found on loop 3 after the update. Same symptom a colleague reported last week." |
| EV-2609-0018 | 2026-09-22T13:05Z | 22 Sep | email | ESD-SE-11 | US-SE | Georgia | K | yes | — | "Third job with the loop mapping issue after {{fw:EST4@4.1}}; rolled this one back to {{fw:EST4@4.0}} as well. Please advise before we upgrade the rest." |
| EV-2609-0019 | 2026-09-22T16:47Z | 22 Sep | rma | ESD-SW-09 | US-SW | Arizona | K | no | — | "Loop module returned after mapping failure post-upgrade. Bench: no fault found." · linkedRmaId RMA-S-2609-0177 |
| EV-2609-0020 | 2026-09-23T15:20Z | 23 Sep | call | ESD-SE-14 | US-SE | Alabama | I (download log) | no | — | "Acceptance test postponed — loop mapping incomplete since the firmware update." |
| EV-2609-0021 | 2026-09-23T18:33Z | 23 Sep | case | ESD-SW-12 | US-SW | Texas | K | no | — | "Building owner asking whether to hold the remaining panels on {{fw:EST4@4.0}} until there is guidance." |
| EV-2609-0022 | 2026-09-24T03:55Z | 23 Sep | afterHours | ESD-CA-06 | Canada | Ontario | I (ship date) | no | — | "Loop won't map after the update and the inspector is booked. What can we do tonight?" |
| EV-2609-0023 | 2026-09-25T14:08Z | 25 Sep | case | ESD-SE-02 | US-SE | Florida | K | no | — | "Devices not found after upgrade on a four-loop panel. Two loops fine, two partial." |

In JSON, `partnerId`, `region`, `place` are tokens (`"{{partner:ESD-SE-07}}"`, `"{{region:US-SE}}"`, `"{{place:Florida}}"`). Channel labels: call → "Call", case → "Case note", email → "Email", rma → "RMA narrative", afterHours → "After-hours line".


#### 4.4.2 `draftBrief` (FIXED; 04 §4.11)
```json
{
  "id": "IB-2609-004",
  "title": "Engineering investigation brief — {{platform:EST4}} firmware {{fw:EST4@4.1}} (synthetic)",
  "meta": "IB-2609-004 (synthetic) · Drafted by LiSN 16 Sep 2026 06:10 UTC · refreshed 25 Sep 18:00 UTC",
  "chipPending": "DRAFT — not sent", "chipApproved": "APPROVED · {ts}",
  "sections": [
    { "h": "1. Summary", "body": "Panels on 4.1 report 'devices not found after upgrade' at 6.2 contacts per 1,000 panel-weeks over their first three weeks, against 2.0 on panels still on 4.0 over the same weeks (3.1×; Poisson exact p<0.001). Severity S2 · cliff at release (2 Sep) · incident flag off. Confidence M 0.70 (K 15 / I 8)." },
    { "h": "2. Excerpts", "body": "23 interactions from 9 partners across calls, cases, email, RMA narratives and the after-hours line. Two linked RMAs returned no fault found (RMA-S-2609-0142, RMA-S-2609-0177). Five installers report rolling back to 4.0. New phrasing first seen 4 Sep; above threshold since 16 Sep at the third independent partner.", "attachFeatured": true },
    { "h": "3. Cohort", "body": "1,240 panels on 4.1 at ~610 sites; {{region:US-SE}} 540, {{region:US-SW}} 430, {{region:Canada}} 270. Serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic). 5,560 eligible panels not yet upgraded." },
    { "h": "4. Configurations & counter-evidence", "body": "Symptom concentrates in configurations with more than two signalling loops. 412 panels on 4.1 at 180 sites show no symptom. Effect persists across certified and uncertified installers (indeterminate below N=15)." },
    { "h": "5. Candidate causes (ranked) — candidate, not cause", "items": [
      "H1 · Loop mapping under 4.1 fails to complete on configurations with more than two signalling loops. For: symptom concentrates in >2-loop configurations; mapping stops around 60%. Against: none yet. Test: bench reproduction on a 3-loop configuration.",
      "H2 · Device database entries on loops 2–3 not carried through the upgrade. For: loops 2 or 3 named in 6 cases; rollback restores mapping. Against: 412 panels on 4.1 show no symptom. Test: compare pre- and post-upgrade device tables.",
      "H3 · Installation practice — upgrade without a re-mapping step. For: none specific. Against: persists across certified and uncertified installers. Test: confirm procedure in 5 cases."
    ], "footer": "LiSN does not determine cause. Engineering decides." },
    { "h": "6. Requested decision", "ordered": [
      "Approve an engineering reproduction on the candidate configuration.",
      "Decide whether to pause the staged rollout and download of 4.1.",
      "Decide whether VP Service & Tech Support may release the draft known-issue note."
    ], "footer": "Regulatory is consulted if a listed configuration is involved." },
    { "h": "7. Approver", "body": "VP Engineering · cc VP Service & Tech Support · informed: Quality, President" }
  ],
  "footer": "Draft generated by LiSN from the evidence above. Nothing has been sent. Synthetic scenario — not KGS data."
}
```

### 4.5 `installedBase.json` (FIXED unless GEN; copy in 04 §3)

| Key | Content |
|---|---|
| title / subtitle | "Is our installed base healthy?" / "Interaction-derived view of the installed base, joined to firmware, date-code and RMA data." |
| `kpis` | "SIGNALS ABOVE THRESHOLD" "2" · "FIRMWARE COHORTS IN CONTROL" "45 / 46" · "EST4 RMA RATE" "0.28% · in control" sub "limit 0.35%" · "FIRMWARE RECORDED ON EST4 TROUBLE CASES" "38%" |
| `interactionsTable` | total 5,480 · "▲ +312 vs last week" · 9 rows as 04 §3.3 (Σ 5,480) |
| `clustersBySeverity` | S1 {novel 1, restricted} · S2 {cliff 2; "2 clusters · 6,040 units"} · S3 {1,3,1,2} · S4 {0,8,2,1} |
| `lineageMonitor` | §5.3; marker {23.4, "2026-09-02", "2 Sep · fw 4.1 released (synthetic)", release}; sub "Each release against its own baseline · 45 of 46 cohorts in control" |
| `dateCode` | §5.4. Bracket: "4.2× adjacent weeks · 4,800 units · 1,900 in stock at 11 distributors (containable)". Stats: "Field replacement exposure up to $0.35m" (money, V-05) · "1,900 units (40%) containable" · "14 share one component lot". Confidence M 0.65 K 22 / I 9. Owner "Director Product Quality (owner) · cc VP Engineering". Gate "Draft containment memo (8D D1–D3 pre-filled) — awaiting Quality approval". Lead line "19 days ahead of the scheduled review". Caption "The aggregate is green by construction. The window is not." |
| `emergingPhrasing` | 6 rows as 04 §3.7 |
| `contactsVsRma` | §5.5; limit 0.35; lineLabel "EST4 RMA rate — in control"; marker {28.3, "2026-10-07", "7 Oct · next monthly RMA review", review} |
| `signalWall` | 4 cards + footer as 04 §3.9; card 1 spark `[1.3, 4.3, 7.4, 6.5]` |
| `enhanced` | 04 §3.10 (badge "Joined with RMA & firmware data"; 6 stats; 5 drivers 62/100, 27/100, 18/100, 9/10, 5/10; 4 watchlist cards) |
| `diagnosis` | 04 §3.11 |
| `symptomStack` | table below; defaultOpen "loop-mapping"; detail as 04 §3.12 |
| `stable` | 3 rows + footer as 04 §3.13 |
| `lifecycle` (P1) | 5 rows as 04 §3.14 (Σ interactions 5,480) |

Symptom stack (FIXED; Σ 1,610):

| key | label | EST4 | EST3 | Edge | 2X | VM/VS | Other | total |
|---|---|---|---|---|---|---|---|---|
| loop-mapping | Loop mapping | 148 | 62 | 71 | 54 | 43 | 34 | 412 |
| node-offline | Node offline | 70 | 48 | 45 | 38 | 35 | 32 | 268 |
| ground-fault | Ground fault | 52 | 44 | 30 | 36 | 33 | 36 | 231 |
| audio-nca | Audio / NCA | 61 | 38 | 22 | 27 | 25 | 25 | 198 |
| upload-download | Upload / download | 49 | 27 | 36 | 22 | 20 | 22 | 176 |
| not-responding | Device not responding | 28 | 20 | 18 | 16 | 14 | 46 | 142 |
| network-redundancy | Network redundancy | 38 | 16 | 14 | 12 | 12 | 12 | 104 |
| battery-power | Battery / power | 14 | 12 | 10 | 9 | 8 | 26 | 79 |

### 4.6 `channel.json` (P1; copy in 04 §5.1)

| Key | Content |
|---|---|
| `kpis` | "SIGNALS ABOVE THRESHOLD 2" · "NA STRATEGIC PARTNERS WITHIN OWN BASELINE 419 / 420" · "N-3 OTD vs ORIGINAL 71% (94% vs revised)" · "CERTIFIED-TECHNICIAN LAPSES, DRIFTING PARTNER 2 of 5" · "BACKLOG AT RISK $2.3m" (sub "2.4% of ~$95m open backlog", money) · "CERTIFICATIONS LAPSING ≤30 DAYS 186 (all partners)" |
| `league` | table below |
| `partnerTimeline` | §5.6. Markers: {16, "2026-07-13", "W16 · friction above own baseline", event} · {22, "2026-08-24", "W22 · 2 certifications lapsed", event} · {24.4, "2026-09-11", "11 Sep · above threshold", threshold}. Pins W21–W26 GEN (one short verbatim each; competitor shown as "[competitor]"). Caption "Friction led sell-in by ~5 weeks. Two backorder cases excluded from the friction score and linked to N-3. 2 of its cases sit in the fw 4.1 cohort." valueLine "$6.4m sell-in in view · ≈ $1.4m / yr gap if −22% persists · $0.9m backlog · 34 days ahead of the 15 Oct QBR". Gate "Partner-recovery brief — awaiting Regional GM approval · no outreach sent". |
| `backorder` | bars below; otd {94, 71}; consequenceRatio W15–W26 `[1.0, 1.1, 0.9, 1.0, 1.1, 1.0, 1.6, 2.1, 2.4, 2.8, 3.0, 3.2]`; leadLine "13 days ahead of the 5 Oct OTIF report"; N-3 detail as 04 §5.1 |
| `certification` | table below; caption "Assigning 18 seats in the October {{platform:EST4}} class to 7 high-load partners would cut ~210 contacts a quarter." |
| `switching` | "{{place:Houston}} metro · [competitor] · 11 vs 3 (3.7×) · top reason: N-3 lead time · S3 WATCH" + 2 GEN rows at 1.2–1.4× "[competitor]" "Below threshold" |
| `enhanced` | badge "Joined with ERP orders, LMS & backlog"; stats as 04 §5.1 C-G; drivers 34, 26, 17, 13, 10 (max 40); watchlist below |
| `stable` | "419 / 420 NA Strategic Partners within own baseline" · "One partner's order dip coincides with a credit hold — routed to AR, not scored as drift." |
| `signalWall`, `diagnosis` | 04 §5.1 C-I, C-J |

Partner league (FIXED). Only ESD-SE-07 is outside baseline among the 420 NA Strategic Partners.

| Partner | Territory | Tier | Friction vs own | Recontact (baseline) | Sell-in vs LY | Certified | Competitor named | Status |
|---|---|---|---|---|---|---|---|---|
| {{partner:ESD-SE-07}} | {{region:US-SE}} | ESD / Strategic Partner | 3.1× | 38% (14%) | −22% | 3 of 5 | 4 calls | S2 · above threshold |
| {{partner:ESD-SW-12}} | {{region:US-SW}} | ESD / Strategic Partner | 1.2× | 16% (15%) | −3% | 6 of 7 | — | Within band |
| {{partner:ESD-MW-05}} | {{region:US-MW}} | ESD / Strategic Partner | 1.1× | 14% (13%) | +1% | 5 of 6 | — | Within band |
| {{partner:ESD-CA-06}} | {{region:Canada}} | ESD / Strategic Partner | 1.2× | 14% (12%) | +2% | 4 of 5 | — | Within band (in Signal #1 cohort) |
| {{partner:DLR-NE-118}} | {{region:US-NE}} | Dealer | 1.8× | 21% (12%) | −6% | 2 of 2 | 2 calls | S3 · watch |
| {{partner:DLR-W-044}} | {{region:US-W}} | Dealer | 1.5× | 17% (13%) | −5% | 1 of 2 | 1 call | S3 · watch |
| {{partner:DIST-UK-031}} | {{region:UK}} | Distributor | 1.6× | 27% (16%) | −3% | 4 of 4 | — | S3 · watch (→ Separation) |

Backorder bars (FIXED; $m; stacks NA / {{region:UK-EU}} / Other; overlay = consequence ratio):

| key | label | NA | UK-EU | Other | total | overlay |
|---|---|---|---|---|---|---|
| N-3 | Notification N-3 (synthetic) | 2.1 | 0.1 | 0.1 | 2.3 | 3.2 |
| D-5 | Detectors D-5 (synthetic) | 0.5 | 0.2 | 0.1 | 0.8 | 1.2 |
| P-2 | Power supplies P-2 (synthetic) | 0.4 | 0.1 | 0.1 | 0.6 | 1.4 |
| M-4 | Modules M-4 (synthetic) | 0.3 | 0.1 | 0.1 | 0.5 | 1.1 |
| A-1 | Aspirating A-1 (synthetic) | 0.2 | 0.1 | 0.1 | 0.4 | 1.0 |
| C-2 | Cabinets C-2 (synthetic) | 0.2 | 0.05 | 0.05 | 0.3 | 0.9 |

Certification table (FIXED; Σ seats 18):

| Partner | Certified techs | Lapsing ≤30d | Contacts per job vs peers | Seats requested |
|---|---|---|---|---|
| {{partner:ESD-SE-07}} | 3 of 5 (2 lapsed W22) | 1 | 2.4× | 2 |
| {{partner:ESD-SW-12}} | 6 of 7 | 2 | 2.1× | 3 |
| {{partner:DLR-NE-118}} | 2 of 2 | 1 | 2.3× | 2 |
| {{partner:ESD-MW-05}} | 5 of 6 | 1 | 1.9× | 3 |
| {{partner:DLR-W-044}} | 1 of 2 | 1 | 2.2× | 2 |
| {{partner:ESD-SE-14}} | 4 of 4 | 1 | 1.8× | 3 |
| {{partner:DLR-SW-201}} | 2 of 3 | 1 | 2.0× | 3 |

Partners-on-watch cards (FIXED):
```json
[
  { "chip": "S2", "title": "{{partner:ESD-SE-07}}", "age": "6 wks", "stage": "Stage: executive intervention", "blocker": "Blocker: 2 open L3 escalations", "tags": ["3 of 5 certified", "$6.4m sell-in"] },
  { "chip": "S3", "title": "{{partner:DLR-NE-118}}", "age": "2 wks", "stage": "Stage: competitive", "blocker": "[competitor] named in 2 calls", "tags": ["Dealer"] },
  { "chip": "S3", "title": "{{partner:DLR-W-044}}", "age": "3 wks", "stage": "Stage: certification", "blocker": "1 of 2 technicians certified", "tags": ["Dealer"] },
  { "chip": "S3", "title": "{{partner:DIST-UK-031}}", "age": "4 wks", "stage": "Stage: invoicing", "blocker": "Invoice entity mismatch → Separation", "tags": ["{{region:UK}}"] }
]
```

### 4.7 `separation.json` (P1; copy in 04 §5.2)

| Key | Content |
|---|---|
| `kpis` | "SIGNALS ABOVE THRESHOLD 1" · "CUTOVERS CLEAN vs CONTROL 3 of 4" · "INVOICES IN DISPUTE £1.1m / 212" (money) · "DSO TOP-10 UK-EU +6 days" sub "≈ £1.0m cash tied up" (money, V-08) · "PORTAL-LOGIN CONTACTS 3.4×" · "EXCESS CONTACTS ~48 / week" (V-09) |
| `cutoverTimeline` | §5.7; markers {16, "2026-07-14", "14 Jul · NA portal", cutover} · {19, "2026-08-04", "4 Aug · APAC order management", cutover} · {20, "2026-08-12", "12 Aug · EDI mapping", cutover} · {23, "2026-09-01", "1 Sep · UK-EU entity", cutover} · {24.3, "2026-09-10", "10 Sep · above threshold", threshold}; caption "2.7× since 1 Sep (30 → 81 a week); control 1.1×. Above threshold since 10 Sep." |
| `scorecard` | NA portal · 14 Jul · 420 ESDs · 1.0× · 1.0× · Clean vs control · CIO / PMO — APAC order management · 4 Aug · 96 distributors · 1.0× · 1.0× · Clean vs control · CIO / PMO — EDI mapping · 12 Aug · 6 EDI distributors · 1.1× · 1.0× · Clean vs control · Order-management lead — {{region:UK-EU}} entity · 1 Sep · 14 distributors · 2.7× · 1.1× · S2 · CIO / CFO / Regional GM UK-EU |
| `topicStack` | table below; stacks UK / DE / NL / FR / Other EU (GEN split ≈ 55 / 20 / 12 / 8 / 5%); defaultOpen "entity-mismatch"; detail as 04 §5.2 S-D |
| `defectSplit` | faqable 118 · defect 180 · caption "FAQ-able contacts go to knowledge fixes; defects go to IT. ~290 contacts avoidable over 6 weeks if fixed." |
| `gates` | "Separation defect ticket — awaiting CIO triage" (defect-ticket, awaiting, owner CIO / separation PMO) · "Distributor notice (corrected remit-to) — awaiting Regional GM UK-EU approval · not sent" (distributor-notice, not_sent) · "Dunning pause on disputed invoices — CFO decision" (dunning-pause, awaiting, owner CFO) |
| `enhanced` | badge "Joined with AR & invoice data"; stats 212 · £1.1m · closed since cutover 64 · avg age 11.2 d · beyond terms 38 · DSO top-10 +6 d; drivers 87 / 51 / 32 / 23 / 19 (Σ 212; shares 41 / 24 / 15 / 11 / 9); aged-dispute cards below |
| `legacy` | 2 rows + gate "Evidence-preservation request — awaiting Legal" as 04 §5.2 S-H |
| `signalWall`, `diagnosis` | 04 §5.2 S-I, S-J |

Topic stack since 1 Sep, W23–W26 (FIXED totals):

| key | label | total | per week (W26) | pre-cutover / wk | ratio |
|---|---|---|---|---|---|
| entity-mismatch | Invoice entity mismatch | 142 | 38 | 14 | 2.7× |
| remit-to | Remit-to / bank details | 102 | 28 | 10 | 2.8× |
| vat | VAT number | 54 | 15 | 6 | 2.5× |
| portal-login | Portal login | 276 | 75 | 22 | 3.4× |
| part-number | Part-number mapping | 53 | 14 | 8 | 1.8× |
| missing-ack | Missing acknowledgement | 24 | 6 | 5 | 1.2× |
| legacy-address | Legacy address bounced | 20 | 5 | 3 | 1.7× |

The first three topics make up "remit-to & entity contacts": 298 since 1 Sep; W26 81/wk vs 30/wk pre-cutover. The entity-mismatch detail panel shows "142" contacts, 87 invoices linked, £0.46m.

Aged-dispute cards (FIXED):
```json
[
  { "chip": "S2", "title": "{{partner:DIST-UK-004}}", "age": "19 d", "stage": "£148k · 23 invoices", "blocker": "Blocker: entity mismatch — awaiting credit note", "tags": ["{{region:UK}}"] },
  { "chip": "S2", "title": "{{partner:DIST-DE-012}}", "age": "16 d", "stage": "£96k · 14 invoices", "blocker": "Blocker: remit-to not recognised", "tags": ["{{region:DE}}"] },
  { "chip": "S3", "title": "{{partner:DIST-NL-007}}", "age": "14 d", "stage": "£71k · 9 invoices", "blocker": "Blocker: part number re-keyed", "tags": ["{{region:NL}}"] },
  { "chip": "S3", "title": "{{partner:DIST-UK-019}}", "age": "12 d", "stage": "£55k · 7 invoices", "blocker": "Blocker: duplicate after re-issue", "tags": ["{{region:UK}}"] }
]
```
Cumulative disputed value (£k) for W22–W26: 95, 240, 520, 810, 1,100. DSO delta for the same weeks: 0, +1, +3, +5, +6.

### 4.8 `askLisn.json` (P2)
```json
[
  { "q": "Why is fw 4.1 ranked above the D-2 date-code window?",
    "a": "Both are S2 cliffs. fw 4.1 scores higher on source independence (0.78 across 9 partners) and its exposure grows with every upgrade; D-2 is partly containable in distributor stock. Rank score 0.84 vs 0.71 — an ordering, not a probability.",
    "cites": [ { "label": "Why ranked here?", "route": "/installed-base/signal/fw-4-1" }, { "label": "Date-code window", "route": "/installed-base#date-code" } ] },
  { "q": "What would raise the confidence on fw 4.1?",
    "a": "Firmware in the case record for the 8 imputed cases, and configuration data on the 412 panels without the symptom. Either moves K up and I down. Engineering reproduction would test H1 directly.",
    "cites": [ { "label": "Method & audit" }, { "label": "EV-2609-0007", "evidenceId": "EV-2609-0007" } ] },
  { "q": "Which partners appear in more than one place?",
    "a": "{{partner:ESD-SE-07}} (partner drift; 2 cases in the fw 4.1 cohort), {{partner:ESD-CA-06}} (fw 4.1 cohort; within band on the partner league) and {{partner:DIST-UK-031}} (channel watch; UK-EU invoicing).",
    "cites": [ { "label": "EV-2609-0003", "evidenceId": "EV-2609-0003" }, { "label": "Partner league", "route": "/channel#esd-se-07" } ] }
]
```

---

## 5. Time series (FIXED; index 0 = W1 unless stated)

### 5.1 Weekly interactions — `meta.json`
`[8666, 8866, 8766, 8966, 8566, 9066, 9166, 8966, 7600, 9266, 9466, 9866, 11400, 8300, 8966, 9266, 9066, 8866, 8965, 9165, 9065, 8765, 8665, 7900, 9265, 9020]` · Σ 233,900.

### 5.2 Hero lineage — `signal_fw41.json › lineage`

**4.0 series (W1–W26)**
- `rate`: **derived**, `contacts ÷ panels × 1,000` to 1 dp (the generator computes it) → `[2.1, 1.9, 1.9, 2.1, 1.8, 2.1, 2.1, 1.8, 2.1, 2.1, 2.1, 2.2, 2.2, 2.1, 2.2, 2.1, 2.2, 1.8, 2.2, 1.9, 1.8, 2.1, 2.2, 1.9, 2.0, 2.0]`
- `panels`: 6,800 for W1–W22, then `[6020, 5650, 5580, 5560]`
- `contacts`: `[14, 13, 13, 14, 12, 14, 14, 12, 14, 14, 14, 15, 15, 14, 15, 14, 15, 12, 15, 13, 12, 14, 13, 11, 11, 11]`

**4.1 series (W23–W26 only)**
- `contacts` `[1, 5, 9, 8]` (Σ 23)
- `panels` `[780, 1150, 1220, 1240]`
- `rate` `[1.3, 4.3, 7.4, 6.5]`

**Bands:** `rateLow = max(0, c − 1.645√c) × 1000 / panels`; `rateHigh = (c + 1 + 1.645√c) × 1000 / panels`, 1 dp.

**Headline metric:** 6.2 = 23 ÷ 1,240 ÷ 3 × 1,000 (event-time); 2.0 on 4.0 over the same weeks (W24–W26: 33 ÷ 16,790 × 1,000 = 1.97).

**EST4 RMA rate % (4-week rolling, W1–W26):** `[0.26, 0.30, 0.27, 0.28, 0.26, 0.26, 0.26, 0.28, 0.28, 0.30, 0.30, 0.28, 0.30, 0.27, 0.30, 0.27, 0.30, 0.27, 0.28, 0.28, 0.26, 0.26, 0.28, 0.29, 0.26, 0.28]` · limit **0.35** · current **0.28** · label "EST4 RMA rate — in control".

**Markers**
```json
[
  { "week": 23.4, "date": "2026-09-02", "label": "2 Sep · fw 4.1 released (synthetic)", "style": "release" },
  { "week": 25.4, "date": "2026-09-16", "label": "16 Sep · threshold crossed — third independent partner", "style": "threshold", "pulse": true },
  { "week": 28.3, "date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "style": "review" }
]
```
Annotation "21 days earlier". Future zone W27–W28.

### 5.3 Lineage monitor (W15–W26) — `installedBase.json`

| Series | Values |
|---|---|
| {{platform:EST4}} 4.1 (syn.) | null ×8, then `[1.3, 4.3, 7.4, 6.5]` |
| {{platform:EST4}} 4.0 (syn.) | `[2.2, 2.1, 2.2, 1.8, 2.2, 1.9, 1.8, 2.1, 2.2, 1.9, 2.0, 2.0]` (= hero W15–W26, derived) |
| {{platform:Edge}} 3.2 (syn.) | `[1.7, 1.5, 1.5, 1.7, 1.5, 1.7, 1.8, 1.6, 1.6, 1.4, 1.5, 1.8]` |
| {{platform:2X}} 7.4 (syn.) | `[2.2, 2.2, 2.4, 2.3, 2.4, 2.3, 2.3, 2.3, 2.5, 2.5, 2.2, 2.5]` |
| {{platform:VM/VS}} 5.1 (syn.) | `[1.9, 1.8, 1.6, 1.6, 2.0, 1.6, 1.6, 1.6, 2.0, 2.0, 1.9, 2.0]` |
| {{platform:GST panel family}} G-7 (syn.) | `[2.3, 2.0, 2.2, 2.3, 2.3, 2.3, 2.3, 2.0, 2.2, 2.4, 2.3, 2.1]` |

### 5.4 D-2 heat strip and p-chart — `installedBase.json › dateCode`

**`ratePer10k`, cells 2601…2626:** `[1.2, 1.1, 1.0, 0.9, 1.4, 1.1, 1.0, 0.9, 1.2, 1.4, 4.4, 4.9, 4.7, 4.4, 1.2, 1.2, 1.4, 0.8, 0.9, 0.9, 0.8, 1.0, 1.1, 0.9, 1.1, 0.8]`
- 2611–2614 are `inWindow`.
- `units` GEN at ~1,200 per week, with the window summing to **4,800**.
- `relativeRisk` = rate ÷ 1.1.

**SKU return rate %:** `[0.22, 0.21, 0.18, 0.19, 0.21, 0.19, 0.21, 0.18, 0.20, 0.21, 0.20, 0.21, 0.22, 0.22, 0.18, 0.20, 0.18, 0.21, 0.19, 0.19, 0.18, 0.18, 0.19, 0.19, 0.20, 0.21]` · limit 0.30.

**Invariants:**
- 31 early-life contacts over 6 weeks; 22 in the window (K 22 serial-verified + I 9 from photos); 14 share a component lot.
- 1,900 units in stock at 11 distributors (40%); 2,900 installed × $120 = $0.35m (V-05).

### 5.5 Contacts ↔ RMA ({{platform:EST4}}, W1–W26) — `installedBase.json › contactsVsRma`
- `trouble`: `[284, 302, 311, 271, 291, 272, 302, 309, 299, 293, 269, 272, 313, 271, 273, 310, 283, 307, 301, 302, 308, 298, 286, 294, 294, 277]`
- `fw41`: 0 for W1–W22, then `[1, 5, 9, 8]`
- `rmas`: `[23, 26, 26, 28, 26, 27, 25, 26, 27, 23, 23, 25, 24, 25, 23, 24, 23, 26, 23, 23, 27, 25, 23, 28, 25, 28]`
- `rmaRate`: as §5.2 · limit 0.35

### 5.6 {{partner:ESD-SE-07}} timeline — `channel.json › partnerTimeline`
- `friction`: `[1, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 3, 3, 4, 3, 3, 5, 5, 7, 7, 8, 8]`
  - W16–W20 mean 3.2 (1.6×, above own baseline, below threshold).
  - W21–W26 Σ **40** (40 ÷ 13 = 3.08 → **3.1×**).
- `baseline`: 2 for all weeks except W25 = 3. W21–W26 Σ **13**.
- `sellIn` ($k/wk): `[246, 234, 266, 246, 245, 227, 216, 216, 229, 269, 263, 226, 213, 232, 265, 230, 247, 219, 260, 241, 205, 198, 190, 186, 182, 176]` — turns down from W21 (~5 weeks after friction).
- `sellInLY`: `[246, 284, 251, 234, 263, 282, 259, 280, 254, 236, 260, 220, 284, 250, 217, 236, 259, 275, 279, 241, 278, 251, 255, 276, 265, 255]`
- Invariant: Σ W19–W26 1,638 / 2,100 − 1 = **−22%**.

### 5.7 Cutover timeline (contacts/week) — `separation.json › cutoverTimeline`
| Series | W1–W22 | W23–W26 |
|---|---|---|
| {{region:UK-EU}} remit-to & entity (orange) | GEN 26–34, mean **30** | `[55, 80, 82, 81]` (W26 2.7×; above threshold 10 Sep, W24) |
| {{region:UK-EU}} portal login (amber) | GEN 19–25, mean **22** | `[51, 74, 76, 75]` (3.4×) |
| Control regions — remit-to & entity (grey dashed) | GEN 36–44, mean **40** | `[42, 43, 44, 45]` (1.1×) |

Excess ~48/week = 30 × (2.7 − 1.1) (V-09). There are no bumps after W16, W19 or W20: those cutovers are clean.

---

## 6. Generator checks (assert in a small test or console check)

1. **Volumes.** Σ `weeklyInteractions` = 233,900 and W26 = 9,020. Q1 interactions table Σ = 5,480, lifecycle Σ = 5,480, symptom stack Σ = 1,610.
2. **Funnel and value.** Funnel = 233,900 / 1,640 / 212 / 5 / 2, and Σ suppressed reasons = 212 (74 / 58 / 41 / 27 / 12). Every figure in `appliedValue`, hero P&L, date-code stats, the channel value line and separation KPIs carries the same number as the matching `valueRegister` figure (V-01…V-14). `unitCosts.excessFaultContactUsd` = 750 = 450 + 150 + 150.
3. **Hero evidence.** 23 records; 9 partners; regional split 11 / 8 / 4; K 15 / I 8 (5 ship date / 3 download log); rollback in 5 records across 4 partners; only ESD-SE-07 and ESD-SW-03 before 2026-09-16T00:00Z; weekly counts [1, 5, 9, 8]; cohort 1,240 panels / 610 sites; 6,800 − 1,240 = 5,560.
4. **Question-card counts.** For each card, `count` = number of `monitor.signals` with that `question` and `aboveThreshold`. `lastWeekCount` = those with `aboveSince` ≤ `meta.lastWeekDigest`. `deltaLabel` = the signed difference ("0" / "+1"). Σ counts = 5 = funnel above-threshold. No field named `index` or `score` exists in any file.
5. **Gauges.** Q1 98 = 45/46 and 80 ≈ 0.28/0.35; Q2 99.8 = 419/420; Q3 75 = 3/4 and 8 ≈ 14/180. EST4 RMA rate W26 = 0.28 and max < 0.35.
6. **Channel.** ESD-SE-07 friction 40 vs baseline 13 (W21–W26; 3.1×); sell-in −22%. League has exactly 1 ESD / Strategic Partner row outside band. Certification seats Σ = 18. Backlog $2.3m = 2.4% of $95m.
7. **Separation.** Dispute drivers Σ = 212. Remit-to & entity W26 81 vs 30 (2.7×). Control 45 vs 40 (1.1×). The first three topic totals sum to 298 = Σ W23–W26 of the remit-to series. Scorecard has 3 "Clean vs control" rows. Defect split 118 + 180 = 298.
8. **Tokens.** No JSON string outside `anonymise.json` contains a raw brand, platform, firmware, partner, region or place name outside `{{…}}`. Grep for `EST4`, `Edwards`, `ESD-`, `DIST-`, `DLR-`, `Florida`, `UK-EU` outside tokens → zero hits. Exceptions: filter option values "NA"/"UK-EU" in `meta.filters.region` and the `key` fields of `anonymise.json`.
9. **Banned strings.** No string contains "resolv", "root cause" (except "LiSN does not determine cause"), "sentiment", "churn", "predict", "real-time", "LisN", "Lisn", "LISN", "index", "crossed a threshold this week", "!". No field or string sums $ and £.
10. **Governed watch and runtime.** W-1 `routedAt` = 2026-09-06T14:38Z and `chronologyUpdatedAt` = 2026-09-23T10:02Z. W-2 routed 7 minutes after first mention. Neither item contains tokens, platform, firmware or country names. No approval timestamp is stored in any JSON (only `{ts}` placeholders).
