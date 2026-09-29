/**
 * LiSN × KGS Global Commercial Fire demo — mock-data types.
 *
 * Part A reproduces 05a_Data_Contract.md §2 member-for-member (same names, same
 * optionality, same unions). Comments are added; nothing is renamed.
 * Part B adds the file-level wrappers that 05a §4 describes in prose but does not
 * type (exec.json, monitor.json, signal_fw41.json, the page files). Every Part B
 * interface extends or composes Part A types; none changes a Part A member.
 *
 * Everything here describes a SYNTHETIC SCENARIO. Nothing is a finding about any
 * KGS product, firmware, batch, partner or system.
 *
 * In the Next.js repo this file lives at src/mock/kgs/types.ts (06 §1.3; 05a names src/data/kgs/).
 */

/* =====================================================================
 * PART A — 05a §2 (verbatim members)
 * ===================================================================== */

// ---------- primitives ----------
/** "2026-09-25" */
export type ISODate = string;
/** "2026-09-25T18:00:00Z" (always UTC in data) */
export type ISODateTime = string;
/** Display copy that may contain {{kind:key}} tokens (05a §3). Render through fmt(). */
export type TokenString = string;
/** 1..26; 27, 28 = ghost weeks for markers */
export type WeekIndex = number;

/** Money value. `display` is FIXED text; never add USD and GBP. */
export interface Money {
  amount: number;
  currency: "USD" | "GBP";
  display: string;
  illustrative: true;
}

/** Roles only — the demo never names people. */
export type Role =
  | "President"
  | "VP Engineering"
  | "VP Service & Tech Support"
  | "Director Product Quality"
  | "Quality"
  | "Regional GM NA"
  | "Regional GM UK-EU"
  | "VP Sales"
  | "VP Supply Chain"
  | "CIO / separation PMO"
  | "CFO"
  | "PSIRT"
  | "CLO"
  | "Legal"
  | "AR"
  | "Learning Center manager";

export type QuestionId = "installed-base" | "channel" | "separation";
export type Domain =
  | "Quality"
  | "Channel"
  | "Separation"
  | "Supply"
  | "Safety/Cyber"
  | "Enabler";

// ---------- severity / confidence / tags ----------
export type SeverityClass = "S1" | "S2" | "S3" | "S4";
export type SeverityType = "cliff" | "slope" | "spread" | "novel";
/** Rendered as text, never colour alone (02 HS-4). */
export interface Severity {
  class: SeverityClass;
  word:
    | "Life-safety / regulatory"
    | "Material impact"
    | "Operational"
    | "Efficiency";
  domain: Domain;
  type: SeverityType;
  typeNote: string; // "Cliff (step at release)"
  blastRadius: { headline: TokenString; note?: TokenString };
  incident: { flag: boolean | "n/a"; note: string };
  escalationRule?: string;
  compact: TokenString; // "S2 ▲ · Cliff · 1,240 panels · Incident off"
}
export type ConfidenceLevel = "H" | "M" | "L" | "L–M";
/** Known (joined, verified records) vs Inferred (text-extracted or imputed), always kept separate. */
export interface Confidence {
  level: ConfidenceLevel;
  p: number;
  known: { count?: number; label: string };
  inferred: { count?: number; label: string };
  sourceIndependence?: {
    score: number;
    partners: number;
    channels: number;
    note?: string;
  };
  short: string; // "M 0.70 · K 15 / I 8"
}
/** key: BRAND, PLATFORM, FW, REGION, PARTNERS, SITE, CHANNELS, TIME… */
export interface JoinTag {
  key: string;
  value: TokenString;
}
/** Where the signal lands on the P&L. Money inside `exposure` is illustrative. */
export interface PnLDestination {
  primary: string;
  secondary?: string;
  compact: string;
  exposure?: {
    lines: { text: TokenString; valueId?: string }[];
    caption?: string;
    subTiles?: { text: string; valueId?: string }[];
  };
}
/** One row of the "Why ranked here?" popover. weight × score sums to Signal.rankScore. */
export interface RankFactor {
  label: string;
  value: TokenString;
  weight: number;
  score: number;
}

// ---------- value register (02 §2) ----------
/** id 'V-01'…'V-14'. figure and method are 02 §2 verbatim. */
export interface ValueItem {
  id: string;
  figure: string;
  method: string;
  money?: boolean;
}
export interface UnitCosts {
  tier1ContactUsd: [number, number];
  excessFaultContactUsd: number;
  breakdown: { label: string; usd: number }[];
  detectorReplacementUsd: number;
}

// ---------- human gate ----------
export type GateStatus =
  | "draft"
  | "awaiting"
  | "approved"
  | "returned"
  | "not_sent";
/**
 * A draft artefact and the person who must approve it. LiSN drafts; people approve.
 * `{ts}` inside onApprove / decisionRequest copy is replaced at runtime with
 * fmtDemoTime(new Date()) captured once per click. It is never stored in JSON.
 */
export interface HumanGate {
  id: string;
  artefactType:
    | "investigation-brief"
    | "known-issue-note"
    | "containment-memo"
    | "partner-recovery-brief"
    | "defect-ticket"
    | "distributor-notice"
    | "dunning-pause"
    | "allocation-list"
    | "field-change-proposal"
    | "evidence-preservation-request";
  status: GateStatus;
  title: TokenString; // "Draft investigation brief — awaiting VP Engineering approval"
  chip: string; // compact: "Awaiting approval"
  auditLine?: string;
  owner: Role;
  approveEnabledFor: Role[];
  approveLabel?: string; // "Approve investigation"
  disabledTooltip?: string; // "Approval sits with VP Engineering"
  onApprove?: {
    // copy only; timestamp is injected at runtime as {ts}
    title: string; // "Investigation approved by VP Engineering · reproduction on candidate configuration"
    auditLine: string; // "Approved · investigation opened · audit logged {ts}"
    openLines: string[]; // "Rollout decision: pending — VP Engineering", "LiSN keeps watching: …"
    chip: string; // "Investigation approved"
    toast: { title: string; body: string }; // body contains {ts}
    auditEntry: string; // "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)"
    investigationId: string;
  };
  onApproveSecondary?: { gateId: string; title: string }; // known-issue note becomes "Awaiting VP Service & Tech Support approval — not sent"
  decisionRequest?: {
    buttonLabel: string;
    doneLabel: string;
    chip: string;
    auditEntry: string;
  }; // President-only
}

// ---------- signal ----------
/** A signal above (or, for the enabler, below) threshold. Route slug = id. */
export interface Signal {
  id: string;
  displayId: string;
  question: QuestionId;
  ucIds: string[];
  rank?: number;
  rankOf?: number;
  rankScore?: number;
  rankFactors?: RankFactor[];
  aboveThreshold: boolean;
  aboveSince?: ISODateTime; // for counts and WoW delta
  title: TokenString;
  headline: TokenString;
  metric: {
    display: TokenString;
    value: number;
    baseline: number;
    ratio: number;
    unit: string;
    line: TokenString;
  };
  severity: Severity;
  confidence: Confidence;
  chips?: {
    icon: string;
    text: TokenString;
    ucId?: string;
    attributionPos?: number;
  }[];
  counterEvidence?: TokenString;
  joinTags: JoinTag[];
  pnl: PnLDestination;
  routing: {
    owner: Role;
    cc: Role[];
    informed?: Role[];
    presidentReason?: string;
  };
  recommendedAction: TokenString;
  gates: HumanGate[];
  evidenceCount?: number;
  nextReview?: { date: ISODate; label: string; leadDays: number };
  drillRoute: string;
}

// ---------- evidence ----------
export type EvidenceChannel = "call" | "case" | "email" | "rma" | "afterHours";
/** One source interaction behind a signal. firmwareSource 'record' = K, 'imputed' = I. */
export interface EvidenceSnippet {
  id: string;
  signalId: string;
  channel: EvidenceChannel;
  channelLabel:
    | "Call"
    | "Case note"
    | "Email"
    | "RMA narrative"
    | "After-hours line";
  partnerId: TokenString;
  region: TokenString;
  place: TokenString;
  localDateLabel: string;
  timestampUtc: ISODateTime;
  text: TokenString;
  highlight?: string;
  featured: boolean;
  featuredOrder?: number;
  firmwareSource: "record" | "imputed";
  imputedFrom?: "ship date" | "download log";
  mentionsRollback: boolean;
  linkedRmaId?: string;
  note?: string;
}
export interface RMA {
  id: string;
  signalId: string;
  serial: string;
  partnerId: TokenString;
  returnedDate: ISODate;
  disposition: "NFF";
  label: string;
  linkedEvidenceId: string;
}
export interface CohortRegionRow {
  region: TokenString;
  panels: number;
  sites: number;
  partners: number;
  contacts: number;
}
export interface Cohort {
  signalId: string;
  panels: number;
  sites: number;
  partners: number;
  serialRange: string;
  eligibleNotUpgraded: number;
  regions: CohortRegionRow[];
  siteTypes: { type: string; share: number }[];
  noSymptom: { panels: number; sites: number };
  exportEnabled: false;
  exportTooltip: string;
}
export interface AuditEntry {
  ts: ISODateTime;
  label: string;
}

// ---------- series / charts ----------
/** rate = contacts per 1,000 panel-weeks; rateLow/rateHigh = 90% Poisson band (05a §5.2). */
export interface FirmwareSeriesPoint {
  week: WeekIndex;
  weekStart: ISODate;
  contacts: number;
  panels: number;
  rate: number;
  rateLow: number;
  rateHigh: number;
}
export interface FirmwareSeries {
  label: TokenString;
  versionRaw: string;
  colour: string;
  points: FirmwareSeriesPoint[];
}
/** week may be fractional (23.4 = Wed of W23) or a ghost week (27, 28). */
export interface ChartMarker {
  week: number;
  date: ISODate;
  label: TokenString;
  style: "release" | "threshold" | "review" | "cutover" | "event";
  pulse?: boolean;
}
export interface DateCodeCell {
  dateCode: string;
  units: number;
  ratePer10k: number;
  relativeRisk: number;
  inWindow: boolean;
}

// ---------- exec ----------
export interface Gauge {
  pct: number;
  label: string;
  sub: string;
  tone: "green" | "amber" | "red";
}
export interface MiniKpi {
  label: string;
  value: TokenString;
  caption?: TokenString;
  money?: boolean;
}
export interface CountedRow {
  signalId: string;
  text: TokenString;
}
/** Big number = count of signals above threshold (never a score or index). */
export interface QuestionCardData {
  id: QuestionId;
  route: string;
  icon: "Cpu" | "Handshake" | "Split";
  accent: "orange" | "teal" | "sky";
  highlighted: boolean;
  title: string;
  caption: string;
  count: number;
  countLabel: string; // "signals above threshold" | "signal above threshold"
  lastWeekCount: number;
  deltaLabel: string; // "+1 vs last week" | "0 vs last week"
  fourWeekLabel: string; // "+2 in 4 weeks"
  severityMix: string; // "S2 cliff · S2 cliff"
  counted: CountedRow[];
  notCounted: string;
  countedFooter: string;
  gauges: [Gauge, Gauge];
  trend: {
    kind: "fw-lineage" | "partner-dual" | "cutover-vs-control";
    ref: string;
  }; // points into series in other files
  miniKpis: [MiniKpi, MiniKpi];
  insightLabel: "LiSN INSIGHT";
  insight: TokenString;
}
export interface PulseItem {
  n: 1 | 2 | 3;
  title: string;
  text: TokenString;
  chips: [string, string, string];
  linkTo: string;
  chipAfterApprove?: string;
}
/** Field Signal Monitor card (bank "RiskSpikeCard" shell). No enabled action button. */
export interface MonitorCard {
  signalId: string;
  rank: number;
  title: TokenString;
  chips: { class: SeverityClass; word: string; domain: Domain; type: string };
  rows: {
    label: "SOURCES" | "COHORT" | "WINDOW" | "OWNER";
    value: TokenString;
  }[];
  metrics: { label: TokenString; value: string; change?: string }[];
  blastRadius: TokenString;
  confidenceShort: string;
  ownerGate: string;
  pnlShort: string;
  suggestion: TokenString;
  linkTo: string;
  gateChipAfterApprove?: string;
  microStrip?: boolean;
}
export interface SuppressedCard {
  title: string;
  rows: { label: string; count: number }[];
  footer: string;
}
export interface AppliedValueTile {
  id: "AV-1" | "AV-2" | "AV-3" | "AV-4" | "AV-5" | "AV-6";
  label: string;
  value?: string;
  lines?: TokenString[];
  sub: string;
  money?: boolean;
  methodIds: string[]; // V-ids or 'count'
  onApprove?: { value: string; sub: string };
}
/** Governed watch row. Exact 02 strings; no tokens, no platform/firmware/country. */
export interface WatchItem {
  id: "W-1" | "W-2";
  row: string;
  secondLine?: string; // exact 02 strings; no tokens, no platform/firmware/country
  routedAt: ISODateTime;
  firstMentionAt?: ISODateTime;
  chronologyUpdatedAt?: ISODateTime;
  confidence: { level: ConfidenceLevel; p: number };
  clock?: {
    startUtc: ISODateTime;
    elapsedLabel: string;
    refsHours: [24, 72];
    caption: string;
  };
}
export interface FunnelData {
  interactions: number;
  weekApprox: string;
  candidateClusters: number;
  suppressed: number;
  aboveThreshold: number;
  governed: number;
  suppressedReasons: { label: string; count: number }[];
  suppressedFooter: string;
}

// ---------- drill-down panels ----------
export interface KpiTile {
  label: string;
  value: TokenString;
  sub?: TokenString;
  money?: boolean;
}
/** tone: one entry per cell ('amber' | 'orange' | 'green' | 'red' | 'neutral' | null). */
export interface TableRow {
  id?: string;
  cells: TokenString[];
  tone?: (string | null)[];
  linkTo?: string;
}
export interface WallCard {
  id: string;
  chips: string[];
  title: TokenString;
  body: TokenString;
  metric: TokenString;
  trend: TokenString;
  linkLabel?: string;
  linkTo?: string;
  confidenceShort?: string;
  owner?: string;
  spark?: number[];
}
export interface SignalWall {
  title: string;
  subtitle: string;
  pill: string;
  cards: WallCard[];
  footer: { value: number; label: string }[];
}
export interface DriverBar {
  label: TokenString;
  meta: TokenString;
  value: number;
  max: number;
  chip: "High" | "Medium" | "Watch";
}
export interface WatchlistCard {
  chip: string;
  title: TokenString;
  age: string;
  stage: TokenString;
  blocker: TokenString;
  tags: TokenString[];
}
/** The bank demo's "card-system enhanced" pattern: interactions joined to operational data. */
export interface EnhancedPanel {
  title: string;
  badge: string;
  violetLine: string;
  right: [string, string];
  joinTags?: JoinTag[];
  stats: KpiTile[];
  driversTitle: string;
  drivers: DriverBar[];
  watchlistTitle: string;
  watchlist: WatchlistCard[];
}
export interface Diagnosis {
  title: string;
  main: TokenString;
  changed: TokenString;
  decideFirst: TokenString;
  confidenceShort?: string;
}
export interface StackedBarDetail {
  key: string;
  title: TokenString;
  chip: string;
  big: string;
  bigLabel: string;
  delta?: string;
  money?: boolean;
  grid: { label: string; value: string }[];
  insight: TokenString;
  actionLabel: string;
  action: TokenString;
  phrasings: string[];
  linkTo?: string;
}
export interface StackedBar {
  title: TokenString;
  stacks: TokenString[];
  bars: { key: string; label: string; values: number[]; overlay?: number }[];
  details: StackedBarDetail[];
  defaultOpen: string;
}
export interface StableRow {
  text: TokenString;
}

export interface InstalledBasePage {
  title: string;
  subtitle: string;
  kpis: KpiTile[];
  interactionsTable: {
    total: number;
    delta: string;
    rows: TableRow[];
    footnote: TokenString;
  };
  clustersBySeverity: {
    label: string;
    caption: string;
    cliff: number;
    slope: number;
    spread: number;
    novel: number;
    restricted?: boolean;
  }[];
  lineageMonitor: {
    title: string;
    sub: string;
    weeks: WeekIndex[];
    series: {
      label: TokenString;
      values: (number | null)[];
      colour: string;
      dashed?: boolean;
    }[];
    markers: ChartMarker[];
  };
  dateCode: {
    cells: DateCodeCell[];
    bracket: string;
    pChart: number[];
    limit: number;
    /** 03 §6.9 control-limit label (repo copy addition). */
    limitLabel: string;
    current: number;
    stats: KpiTile[];
    confidence: Confidence;
    owner: string;
    gate: string;
    leadLine: string;
    caption: string;
  };
  emergingPhrasing: TableRow[];
  contactsVsRma: {
    trouble: number[];
    fw41: number[];
    rmas: number[];
    rmaRate: number[];
    limit: number;
    lineLabel: string;
    markers: ChartMarker[];
    caption: TokenString;
  };
  signalWall: SignalWall;
  enhanced: EnhancedPanel;
  diagnosis: Diagnosis;
  symptomStack: StackedBar;
  stable: { rows: StableRow[]; footer: string };
  lifecycle: TableRow[]; // P1
}
export interface ChannelPage {
  title: string;
  subtitle: string;
  kpis: KpiTile[];
  league: TableRow[];
  partnerTimeline: {
    partnerId: TokenString;
    friction: number[];
    baseline: number[];
    sellIn: number[];
    sellInLY: number[];
    markers: ChartMarker[];
    pins: { week: WeekIndex; text: TokenString }[];
    caption: string;
    valueLine: string;
    confidenceShort: string;
    gate: string;
  };
  backorder: StackedBar & {
    otd: { revised: number; original: number };
    consequenceRatio: number[];
    leadLine: string;
  };
  certification: { rows: TableRow[]; caption: TokenString };
  switching: TableRow[];
  enhanced: EnhancedPanel;
  stable: { rows: StableRow[] };
  signalWall: SignalWall;
  diagnosis: Diagnosis;
}
export interface SeparationPage {
  title: string;
  subtitle: string;
  kpis: KpiTile[];
  cutoverTimeline: {
    series: {
      name: TokenString;
      values: number[];
      dashed?: boolean;
      colour: string;
    }[];
    markers: ChartMarker[];
    caption: string;
  };
  scorecard: TableRow[];
  topicStack: StackedBar;
  defectSplit: { faqable: number; defect: number; caption: string };
  gates: HumanGate[];
  enhanced: EnhancedPanel;
  legacy: { rows: { text: TokenString; chip: string }[]; gate: string };
  signalWall: SignalWall;
  diagnosis: Diagnosis;
}

// ---------- anonymise / meta / demo ----------
export type TokenKind =
  | "brand"
  | "platform"
  | "fw"
  | "partner"
  | "region"
  | "place"
  | "term";
/** anonymise.json — { kind: { key: { named, anon } } } */
export type AnonymiseMap = Record<
  TokenKind,
  Record<string, { named: string; anon: string }>
>;
export interface Meta {
  title: string;
  category: string;
  promise: string;
  dataAsOf: { iso: ISODateTime; label: string };
  lastWeekDigest: ISODateTime;
  badge: string;
  badgeTooltip: string;
  footer: string;
  breadcrumbs: Record<string, TokenString>; // "{role}" is a runtime placeholder
  filters: {
    brand: TokenString[];
    region: string[];
    period: { value: string; disabled: string[] };
  };
  weeks: { week: WeekIndex; weekStart: ISODate }[];
  weeklyInteractions: number[];
  channelMix: Record<string, number>;
  demo: {
    introLine: string;
    introLine2: string;
    tagline: string;
    resetToast: string;
    watermark: string;
    anonymisedChip: string;
  };
}
/** Runtime only; in memory; reload resets (02 HS-9). See lib/demoState.ts. */
export interface DemoState {
  // runtime only; in memory; reload resets (02 HS-9)
  anonymise: boolean; // default false
  viewingAs: "President" | "VP Engineering";
  approvals: Record<string, { ts: string }>; // { 'fw-4-1': { ts: '28 Sep 14:07 UTC' } }
  decisionRequested: Record<string, { ts: string }>;
  drawerOpenedAt?: string; // for the "President · just now" audit line
}
export interface AskLisnItem {
  q: string;
  a: TokenString;
  cites: { label: string; evidenceId?: string; route?: string }[];
}

/* =====================================================================
 * PART B — file-level wrappers (additions; see README_mock.md › Decisions)
 * ===================================================================== */

/** Fixed UI labels from 02 §1 (replacements for the bank demo's labels). */
export interface UiLabels {
  insightLabel: string;
  monitorTitle: string;
  monitorSubtitle: string;
  recommendationLabel: string;
  wallLabel: string;
  diagnosisLabel: string;
  diagnosisRows: [string, string, string];
  askButtonTooltip: string;
  illustrativeChip: string;
  confidenceTooltip: string;
  joinTagPrefix: string;
}

/** One working day of interactions (sums to meta.weeklyInteractions per week). */
export interface DailyInteractions {
  date: ISODate;
  week: WeekIndex;
  count: number;
}

/** Shell copy added in the repo copy of meta.json, verbatim from 04 (not in the pack mock). */
export interface ShellCopy {
  source: string;
  rail: {
    monogram: string;
    logo: string;
    overview: string;
    watch: string;
    back: string;
    demoControls: string;
  };
  contextBar: {
    brand: string;
    region: string;
    period: string;
    role: string;
    anonymise: string;
  };
  funnel: {
    interactions: string;
    weekNote: string;
    clusters: string;
    suppressed: string;
    above: string;
    governed: string;
    popoverTitle: string;
  };
  appliedValue: Record<string, string>;
  demoMenu: {
    reset: string;
    replayIntro: string;
    anonymise: string;
    footer: string;
  };
  emptyScope: string;
  close: string;
  pnl: string;
  hero: HeroCopy;
  drill: DrillCopy;
}

/** Fixed drill-down labels (04 §0.1, §3, §5; 03 §3C). `{x}` placeholders are filled from data. */
export interface DrillCopy {
  source: string;
  back: string;
  severityWords: Record<SeverityClass, Severity["word"]>;
  clusterTypes: [string, string, string, string];
  stable: string;
  phrasings: string;
  openSignal: string;
  week: string;
  dateCodeTooltip: string;
  fw41Segment: TokenString;
  partnerLegend: [string, string, TokenString, string];
}

/** Fixed hero labels (04 §4, 06 Steps 9–12). `{x}` placeholders are filled from data numbers. */
export interface HeroCopy {
  source: string;
  back: string;
  attribution: [string, string];
  counterEvidence: string;
  sourceIndependence: string;
  cohortColumns: [string, string, string, string, string];
  cohortTotal: string;
  method: string;
  routedTo: string;
  ownerSuffix: string;
  recommendedPending: string;
  recommendedApproved: string;
  decision: string;
  viewingAs: string;
  viewingAsOptions: DemoState["viewingAs"][];
  viewDraft: string;
  approving: string;
  approved: string;
  sourceLink: string;
  inferredTooltip: string;
  rmaSerial: string;
  synthetic: string;
  cohortHeadline: string;
  eligible: string;
  exportList: string;
  auditLog: string;
}

/** meta.json */
export interface MetaFile extends Meta {
  descriptor: string;
  labels: UiLabels;
  dailyInteractions: DailyInteractions[];
  ui: ShellCopy;
}

/** One row of the AV-1 popover (lead vs next scheduled review, V-11). */
export interface LeadListItem {
  signalId: string;
  crossed: string;
  review: string;
  lead: number;
}
export interface AppliedValue {
  header: string;
  chip: string;
  link: string;
  footnote: string;
  tiles: AppliedValueTile[];
  leadList: LeadListItem[];
}
export interface GovernedWatch {
  title: string;
  band: "RESTRICTED";
  headline: string;
  pnl: string;
  items: WatchItem[];
  footer: string;
  modal: string;
}
export interface EvidenceReadiness {
  title: string;
  chip: string;
  extraChip: string;
  body: TokenString;
  label: string;
  confidenceShort: string;
  owners: string;
  linkTo: string;
}
/** Money register: typed money values with their V-id, for IllustrativeChip + method tooltip. Never summed across currencies. */
export interface MoneyEntry extends Money {
  valueId: string;
  label: string;
}
/** "How we count" drawer copy (04 §2.6). */
export interface HowWeCount {
  title: string;
  unitCostLines: string[];
  footer: string;
}
/** exec.json */
export interface ExecFile {
  funnel: FunnelData;
  brief: TokenString;
  briefLabel: string;
  pulseLabel: string;
  pulse: [PulseItem, PulseItem, PulseItem];
  questionCards: [QuestionCardData, QuestionCardData, QuestionCardData];
  whatsCountedTitle: string;
  appliedValue: AppliedValue;
  valueRegister: ValueItem[];
  unitCosts: UnitCosts;
  valueStatements: string[];
  neverOnScreen: string;
  howWeCount: HowWeCount;
  money: Record<string, MoneyEntry>;
  governedWatch: GovernedWatch;
  evidenceReadiness: EvidenceReadiness;
}

/** monitor.json */
export interface MonitorFile {
  section: {
    title: string;
    chip: string;
    subtitle: string;
    suppressedLine: string;
    cardFooterLink: string;
  };
  signals: Signal[];
  cards: MonitorCard[];
  suppressedCard: SuppressedCard;
}

/** The hero adds header copy and whyRanked text to the Signal shape. */
export interface HeroSignal extends Signal {
  headerTitle: string;
  subline: TokenString;
  gateFooter: string;
  whyRanked: { title: string; line: string; footnote: string };
}
/** Aggregate (flat grey) line drawn on the lineage chart. */
export interface AggregateLine {
  label: TokenString;
  unit: string;
  values: number[];
  limit: number;
  current: number;
}
/** signal_fw41.json › lineage (05a §5.2). */
export interface HeroLineage {
  title: string;
  series: [FirmwareSeries, FirmwareSeries]; // [0] = 4.0 (prior), [1] = 4.1
  aggregate: AggregateLine;
  markers: ChartMarker[];
  annotation: { text: string; fromWeek: number; toWeek: number };
  futureWeeks: WeekIndex[];
  denominatorLabel: string;
  tooltipTemplate: string;
  headlineCheck: {
    contacts: number;
    panels: number;
    weeks: number;
    rate: number;
    baselineRate: number;
  };
}
export interface MethodRow {
  k: string;
  v: string;
}
export interface DraftBriefSection {
  h: string;
  body?: TokenString;
  items?: TokenString[];
  ordered?: TokenString[];
  footer?: string;
  attachFeatured?: boolean;
}
export interface DraftBrief {
  id: string;
  title: TokenString;
  meta: string;
  chipPending: string;
  chipApproved: string;
  sections: DraftBriefSection[];
  footer: string;
}
/** signal_fw41.json */
export interface SignalFw41File {
  signal: HeroSignal;
  lineage: HeroLineage;
  cohort: Cohort;
  evidence: EvidenceSnippet[];
  rmas: RMA[];
  rmaNote: string;
  method: MethodRow[];
  audit: AuditEntry[];
  auditRuntime: { drawerOpen: string };
  drawer: {
    title: string;
    tabs: string[];
    footer: string;
    sourceLinkTooltip: string;
    featuredHeading: string;
    allHeading: string;
  };
  draftBrief: DraftBrief;
}

/** Static panel copy (titles, subtitles, column headers) keyed by 04 panel id. */
export interface PanelCopy {
  title: TokenString;
  sub?: TokenString;
  right?: string;
  columns?: string[];
  footer?: string;
  unit?: string;
  anchor?: string;
}

/** installedBase.json */
export interface InstalledBaseFile extends InstalledBasePage {
  panelCopy: Record<string, PanelCopy>;
}
/** channel.json */
export interface ChannelFile extends ChannelPage {
  panelCopy: Record<string, PanelCopy>;
}
export interface TopicTotal {
  key: string;
  label: string;
  total: number;
  perWeekW26: number;
  preCutoverPerWeek: number;
  ratio: number;
}
/** separation.json */
export interface SeparationFile extends SeparationPage {
  panelCopy: Record<string, PanelCopy>;
  topicTotals: TopicTotal[];
  disputeTrend: {
    weeks: WeekIndex[];
    cumulativeGbpK: number[];
    dsoDeltaDays: number[];
    currency: "GBP";
  };
}
