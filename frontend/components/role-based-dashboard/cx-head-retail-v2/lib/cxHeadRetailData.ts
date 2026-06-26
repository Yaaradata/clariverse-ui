// Embedded mock universe — Stage 9A + 9B. Numbers tie out across screens.
// Internal signal IDs exist for drill routing only; never shown on card faces.

export type ConfidenceBand = "High" | "Med-High" | "Medium" | "Low";
export type Severity = "critical" | "high" | "medium" | "stable";

export type ExecutiveTileData = {
  id: string;
  breakingIssue: string;
  owner: string;
  severity: Severity;
  primaryValue: string;
  primaryLabel: string;
  delta: string;
  deltaTone: "up" | "down" | "flat" | "warn";
  onset: string;
  channels: string[];
  spark: number[];
  gaugeLabel: string;
  gaugeValue: number;
  recommendedAction: string;
  aiInsight: string;
  confidence: ConfidenceBand;
  drillSignalId?: string;
};

export type DrillSignature =
  | "radar-corroboration"
  | "geo-outbreak"
  | "statutory-queue"
  | "compliance-evidence"
  | "inverse-anomaly"
  | "entity-velocity"
  | "bridge";

export type RadarSignal = {
  id: string;
  title: string;
  severity: Severity;
  cohort: string;
  honestyLine: string;
  onset: string;
  mentions: number;
  signalsDistilled: number;
  channels: { name: string; time: string }[];
  stats: string;
  aiVerdict: string;
  confidence: ConfidenceBand;
  owner: string;
  draftAction: string;
  draftKind: "draft" | "prepare" | "route";
  drillSignature: DrillSignature;
  suppressed?: boolean;
  evidence?: {
    ruledOut: string[];
    snippets?: string[];
  };
};

export type DarkStoreTrend7d = {
  direction: "up" | "down" | "flat";
  delta: string;
  spark: number[];
};

export type DarkStoreNode = {
  id: string;
  label: string;
  city: string;
  issueRate: number;
  baseline: number;
  peerMultiple: number;
  status: "outbreak" | "flat" | "nominal";
  trend7d: DarkStoreTrend7d;
};

export type BridgeGovernance = {
  cohortBanded?: boolean;
  proxyAudited?: boolean;
  differentialGated?: boolean;
  neverAutoApplied?: boolean;
};

export type BridgeTileData = {
  id: string;
  title: string;
  cohort: string;
  bridgeValue: string;
  honestyLine: string;
  signalRef: string;
  starred: boolean;
  confidence: ConfidenceBand;
  aiVerdict: string;
  governance?: BridgeGovernance;
};

export type BridgeEvidencePack = {
  cxCohort: string;
  txnCohort: string;
  joinKey: string;
  cxSignalCount: string;
  txnRowCount: string;
  guardrails: string[];
  confidence: ConfidenceBand;
  aiVerdict: string;
  owner: string;
  businessQuestion: string;
  recommendedAction: string;
  feedScope: string;
};

export type AuditEntry = {
  action: string;
  acceptedBy: string;
  acceptedAt: string;
};

/** Default comparison basis for the command screen (intraday toggle lands in Pass 3). */
export const COMMAND_TIME_COMPARE = "This week vs last";

export const EXEC_SUMMARY = {
  critical: "UPI checkout · D07 spoilage cluster · statutory clock",
  focus: "Seller trust erosion · refund-status repeat · bot containment drop",
  stable: "5 of 8 dark-stores flat · 6 of 8 intents healthy FCR",
  aiLine:
    "Three independent channels corroborate the payment-step failure; peers hold flat on q-commerce spoilage.",
  aiConfidence: "High" as ConfidenceBand,
};

/** CL-004 / AP-011 thin exec bars — one per screen (9C). */
export const QUICK_COMMERCE_SUMMARY = {
  critical: "D07 outbreak · 6× baseline",
  focus: "Perishable cluster · substitution gap",
  stable: "5 of 8 dark-stores flat",
  aiLine: "48 of 50 spoilage complaints trace to one node; seven peer stores hold flat.",
  aiConfidence: "High" as ConfidenceBand,
};

export type DarkStoreKpiBar = {
  label: string;
  pct: number;
  tone: "high" | "med" | "positive";
};

export type DarkStoreKpiCardConfig = {
  id: string;
  eyebrow: "Critical" | "Focus" | "Stable";
  title: string;
  subtitle: string;
  primaryValue: string;
  delta: string;
  deltaTone: "warn" | "down" | "up" | "flat";
  spark: number[];
  /** X-axis day labels — defaults to D1…Dn when omitted. */
  timeline?: string[];
  accent: "high" | "med" | "positive";
  /** Complaint-mix bars per day (D1…D7) — synced to trend pointer. */
  barsByDay: DarkStoreKpiBar[][];
  insight: string;
};

/** Three dark-store KPI cards — outbreak, perishable, peer stability. */
export const DARK_STORE_KPI_CARDS: DarkStoreKpiCardConfig[] = [
  {
    id: "outbreak",
    eyebrow: "Critical",
    title: "Is D07 breaking?",
    subtitle: "Koramangala dark-store · vs own baseline",
    primaryValue: "6×",
    delta: "+4.2 vs 7D",
    deltaTone: "warn",
    spark: [0.9, 1.4, 2.2, 3.1, 4.0, 4.8, 5.4],
    timeline: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    accent: "high",
    barsByDay: [
      [
        { label: "Missing", pct: 0.35, tone: "high" },
        { label: "Spoiled", pct: 0.1, tone: "med" },
        { label: "Late", pct: 0.25, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.38, tone: "high" },
        { label: "Spoiled", pct: 0.14, tone: "med" },
        { label: "Late", pct: 0.22, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.42, tone: "high" },
        { label: "Spoiled", pct: 0.18, tone: "med" },
        { label: "Late", pct: 0.2, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.45, tone: "high" },
        { label: "Spoiled", pct: 0.22, tone: "med" },
        { label: "Late", pct: 0.18, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.48, tone: "high" },
        { label: "Spoiled", pct: 0.26, tone: "med" },
        { label: "Late", pct: 0.17, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.51, tone: "high" },
        { label: "Spoiled", pct: 0.28, tone: "med" },
        { label: "Late", pct: 0.16, tone: "med" },
      ],
      [
        { label: "Missing", pct: 0.54, tone: "high" },
        { label: "Spoiled", pct: 0.3, tone: "med" },
        { label: "Late", pct: 0.16, tone: "med" },
      ],
    ],
    insight:
      "48 of 50 spoilage complaints trace to D07; seven peer dark-stores hold flat in the same catchment window.",
  },
  {
    id: "perishable",
    eyebrow: "Focus",
    title: "Cold-chain at risk?",
    subtitle: "Perishable cluster · FSSAI · one node",
    primaryValue: "48",
    delta: "of 50",
    deltaTone: "flat",
    spark: [12, 18, 22, 28, 35, 42, 48],
    timeline: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    accent: "med",
    barsByDay: [
      [
        { label: "Care chat", pct: 0.45, tone: "med" },
        { label: "Tickets", pct: 0.35, tone: "med" },
        { label: "Reviews", pct: 0.22, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.51, tone: "med" },
        { label: "Tickets", pct: 0.4, tone: "med" },
        { label: "Reviews", pct: 0.26, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.56, tone: "med" },
        { label: "Tickets", pct: 0.44, tone: "med" },
        { label: "Reviews", pct: 0.3, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.61, tone: "med" },
        { label: "Tickets", pct: 0.48, tone: "med" },
        { label: "Reviews", pct: 0.33, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.66, tone: "med" },
        { label: "Tickets", pct: 0.52, tone: "med" },
        { label: "Reviews", pct: 0.36, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.69, tone: "med" },
        { label: "Tickets", pct: 0.55, tone: "med" },
        { label: "Reviews", pct: 0.39, tone: "high" },
      ],
      [
        { label: "Care chat", pct: 0.72, tone: "med" },
        { label: "Tickets", pct: 0.58, tone: "med" },
        { label: "Reviews", pct: 0.41, tone: "high" },
      ],
    ],
    insight:
      "Spoilage language concentrated at D07 — route to food-safety before the warehouse dashboard flags it.",
  },
  {
    id: "peers",
    eyebrow: "Stable",
    title: "Are peers holding?",
    subtitle: "All cities · peer-relative · per 1k orders",
    primaryValue: "5",
    delta: "of 8 flat",
    deltaTone: "up",
    spark: [1, 1, 1, 1, 1, 1, 1],
    timeline: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    accent: "positive",
    barsByDay: [
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
      [
        { label: "BLR peers", pct: 0.67, tone: "positive" },
        { label: "HYD peers", pct: 1, tone: "positive" },
        { label: "DEL peers", pct: 1, tone: "positive" },
      ],
    ],
    insight:
      "Outbreak is node-concentrated, not city-wide — substitution gap is a logic-owner issue, not store floor.",
  },
];

export const COMPLIANCE_SUMMARY = {
  critical: "3 statutory-clock grievances",
  focus: "Dark-pattern exposure · refund-friction cluster",
  stable: "Routing internal until human approves",
  aiLine: "Queue re-ranked by clock proximity; named-instrument evidence stays inside Legal.",
  aiConfidence: "High" as ConfidenceBand,
};

export type ComplianceKpiConfig = {
  id: "clocks" | "nearest" | "darkPattern" | "themes";
  title: string;
  primaryValue: string;
  subtitle?: string;
};

export const COMPLIANCE_KPIS: ComplianceKpiConfig[] = [
  {
    id: "clocks",
    title: "Statutory Clocks in Window",
    primaryValue: "5",
    subtitle: "Inside acknowledgement / erasure window",
  },
  {
    id: "nearest",
    title: "Nearest Deadline",
    primaryValue: "14h",
    subtitle: "DPDP erasure · GRV-0412",
  },
  {
    id: "darkPattern",
    title: "Dark-Pattern Exposure",
    primaryValue: "37",
    subtitle: "Corroborated complaints",
  },
  {
    id: "themes",
    title: "Conduct Themes Active",
    primaryValue: "5",
    subtitle: "Clock · refund · metrology",
  },
];

export type StatutoryClockMilestone = {
  id: string;
  label: string;
  /** Hours remaining on the statutory window when the event occurred. */
  hoursBeforeDeadline: number;
  kind: "filed" | "touch" | "override" | "threshold";
};

export type StatutoryClockRunway = {
  id: string;
  keyword: string;
  regulation: string;
  windowHours: number;
  hoursLeft: number;
  fifoRank: number;
  clockRank: number;
  touches: number;
  stallState: string;
  urgency: "critical" | "high" | "medium";
  overrideNote: string;
  milestones: StatutoryClockMilestone[];
};

/** Runway model for clock-proximity viz — FIFO rank vs regulatory re-rank. */
export const STATUTORY_CLOCK_RUNWAYS: StatutoryClockRunway[] = [
  {
    id: "GRV-0412",
    keyword: "delete my data",
    regulation: "DPDP Rules 2025 · Rule 14",
    windowHours: 72,
    hoursLeft: 14,
    fifoRank: 7,
    clockRank: 1,
    touches: 3,
    stallState: "Stalled across 3 touches",
    urgency: "critical",
    overrideNote: "DPDP erasure keyword overrides FIFO — regulatory risk outranks wait time.",
    milestones: [
      { id: "m1", label: "First touch", hoursBeforeDeadline: 72, kind: "filed" },
      { id: "m2", label: "Follow-up", hoursBeforeDeadline: 36, kind: "touch" },
      { id: "m3", label: "Keyword override", hoursBeforeDeadline: 14, kind: "override" },
    ],
  },
  {
    id: "GRV-0398",
    keyword: "refund not received",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    windowHours: 48,
    hoursLeft: 5,
    fifoRank: 4,
    clockRank: 2,
    touches: 2,
    stallState: "Awaiting first meaningful response",
    urgency: "high",
    overrideNote: "48h acknowledgement clock crossed proximity threshold at T−5h.",
    milestones: [
      { id: "m1", label: "Grievance filed", hoursBeforeDeadline: 48, kind: "filed" },
      { id: "m2", label: "Proximity threshold", hoursBeforeDeadline: 5, kind: "threshold" },
    ],
  },
  {
    id: "GRV-0401",
    keyword: "no response",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    windowHours: 48,
    hoursLeft: 4,
    fifoRank: 2,
    clockRank: 3,
    touches: 4,
    stallState: "Multiple touches — no ack logged",
    urgency: "high",
    overrideNote: "Older in FIFO but inside same acknowledgement window — ranked after DPDP case.",
    milestones: [
      { id: "m1", label: "Filed", hoursBeforeDeadline: 44, kind: "filed" },
      { id: "m2", label: "Second touch", hoursBeforeDeadline: 20, kind: "touch" },
      { id: "m3", label: "Clock re-rank", hoursBeforeDeadline: 4, kind: "threshold" },
    ],
  },
  {
    id: "GRV-0385",
    keyword: "wrong MRP charged",
    regulation: "Legal Metrology (Packaged Commodities) Rules 2011",
    windowHours: 48,
    hoursLeft: 18,
    fifoRank: 5,
    clockRank: 4,
    touches: 2,
    stallState: "Metrology mismatch logged — no pricing correction",
    urgency: "high",
    overrideNote: "Voice corroboration on shelf vs billed MRP — inside 48h grievance window.",
    milestones: [
      { id: "m1", label: "Grievance filed", hoursBeforeDeadline: 48, kind: "filed" },
      { id: "m2", label: "Voice corroboration", hoursBeforeDeadline: 24, kind: "touch" },
    ],
  },
  {
    id: "GRV-0371",
    keyword: "cancelled order refund",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    windowHours: 72,
    hoursLeft: 22,
    fifoRank: 6,
    clockRank: 5,
    touches: 1,
    stallState: "Single touch — refund SLA clock running",
    urgency: "high",
    overrideNote: "Below proximity threshold but inside statutory refund acknowledgement window.",
    milestones: [{ id: "m1", label: "Cancellation filed", hoursBeforeDeadline: 72, kind: "filed" }],
  },
];

/** @deprecated Use STATUTORY_CLOCK_RUNWAYS — kept for KPI spark context. */
export type StatutoryClockVizItem = {
  id: string;
  label: string;
  hoursLeft: number;
  regulation: string;
  keyword: string;
  urgency: "critical" | "high" | "medium";
};

export const STATUTORY_CLOCK_VIZ: StatutoryClockVizItem[] = STATUTORY_CLOCK_RUNWAYS.map((r) => ({
  id: r.id,
  label: r.id,
  hoursLeft: r.hoursLeft,
  regulation: r.regulation,
  keyword: r.keyword,
  urgency: r.urgency,
}));

export type RegulationExposureBar = {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
  sharePct: number;
  urgency: "critical" | "high" | "medium";
  category: "statutory-clock" | "conduct" | "metrology";
  owner: string;
  voiceChannel: string;
};

export const REGULATION_EXPOSURE_BARS: RegulationExposureBar[] = [
  {
    id: "dpdp",
    label: "DPDP Rules 2025",
    shortLabel: "DPDP",
    count: 1,
    sharePct: 92,
    urgency: "critical",
    category: "statutory-clock",
    owner: "Legal · DPO",
    voiceChannel: "Care chat + email",
  },
  {
    id: "ecom",
    label: "E-Commerce Rules 2020",
    shortLabel: "E-Commerce",
    count: 2,
    sharePct: 68,
    urgency: "high",
    category: "statutory-clock",
    owner: "Nodal officer",
    voiceChannel: "Grievance portal",
  },
  {
    id: "lm",
    label: "Legal Metrology (Packaged)",
    shortLabel: "Metrology",
    count: 28,
    sharePct: 44,
    urgency: "medium",
    category: "metrology",
    owner: "Internal Legal",
    voiceChannel: "Reviews + care",
  },
  {
    id: "refund",
    label: "Refund-friction cluster",
    shortLabel: "Refund",
    count: 142,
    sharePct: 52,
    urgency: "high",
    category: "conduct",
    owner: "Refund Ops",
    voiceChannel: "Care + IVR",
  },
  {
    id: "dark",
    label: "Dark-pattern (CCPA ref)",
    shortLabel: "Dark-pattern",
    count: 37,
    sharePct: 58,
    urgency: "high",
    category: "conduct",
    owner: "Legal · Product",
    voiceChannel: "Complaints corpus",
  },
];

/** S3 page copy — headline lives in screen. */
export const COMPLIANCE_PAGE = {
  purpose:
    "Ranked by regulatory risk, not queue age — clock and keyword triggers with audit evidence.",
  sections: {
    clocks: "Clock proximity runway",
    clocksHint: "Top 5 by breach risk — not queue age",
    exposure: "Exposure by instrument",
    exposureHint: "Volume × corroboration matrix · firm-level only",
    conduct: "Conduct signals",
    actions: "Compliance actions",
    actionsHint: "Internal routing only",
  },
};

export const CX_QUALITY_SUMMARY = {
  critical: "Electronics suppression warning",
  focus: "Seller trust · refund-status repeat · bot containment",
  stable: "6 of 8 intents healthy FCR",
  aiLine: "Tickets −18% but contact-per-order flat — support-entry change logged same week.",
  aiConfidence: "Med-High" as ConfidenceBand,
};

export type CxQualityWedgeProof = {
  label: string;
  value: string;
  tone: "positive" | "high" | "med" | "trap" | "muted";
};

export type CxQualityWedgeFace = {
  value: string;
  label: string;
  tag: string;
};

export type CxQualityWedgeCardConfig = {
  id: "good" | "bad" | "inverse";
  eyebrow: string;
  verdict: string;
  accent: "positive" | "high" | "trap";
  dualFace: {
    left: CxQualityWedgeFace;
    right: CxQualityWedgeFace;
  };
  proofs: CxQualityWedgeProof[];
};

/** Three wedge verdict cards — genuinely good · corroborated bad · inverse trap. */
export const CX_QUALITY_WEDGE_CARDS: CxQualityWedgeCardConfig[] = [
  {
    id: "good",
    eyebrow: "What's good",
    verdict: "Baseline intents holding — not everything is breaking.",
    accent: "positive",
    dualFace: {
      left: { value: "6 of 8", label: "Healthy intents", tag: "Coverage" },
      right: { value: "91%", label: "Delivery FCR", tag: "Strongest" },
    },
    proofs: [
      { label: "Delivery", value: "91% FCR", tone: "positive" },
      { label: "Warranty", value: "88% FCR", tone: "positive" },
      { label: "Order status", value: "86% FCR", tone: "positive" },
    ],
  },
  {
    id: "bad",
    eyebrow: "What's bad",
    verdict: "Three corroborated breaks — route cause, not queue depth.",
    accent: "high",
    dualFace: {
      left: { value: "3", label: "Corroborated breaks", tag: "Count" },
      right: { value: "34%", label: "Refund repeat vs p50 22%", tag: "Worst gap" },
    },
    proofs: [
      { label: "Seller trust", value: "Neg-review velocity break", tone: "high" },
      { label: "Refund repeat", value: "34% vs p50 22%", tone: "high" },
      { label: "Bot containment", value: "64%→58% on flow change", tone: "med" },
    ],
  },
  {
    id: "inverse",
    eyebrow: "Seems good but actually bad",
    verdict: "Ticket volume fell — contact-per-order didn't. Warning, not a win.",
    accent: "trap",
    dualFace: {
      left: { value: "−18%", label: "Raw tickets ↓", tag: "Decoy" },
      right: { value: "14.2 /1k", label: "Contact-per-order flat", tag: "Normaliser" },
    },
    proofs: [
      { label: "Access change", value: "Chat buried on PDP · W-1", tone: "trap" },
      { label: "Ruled out", value: "Fewer orders · seasonal dip", tone: "muted" },
      { label: "Status", value: "Warning, not a win", tone: "high" },
    ],
  },
];

export const REVENUE_BRIDGE_SUMMARY = {
  critical: "D07 margin · refund repeat bridges",
  focus: "Seller trust-tax · LTV appeasement (governed)",
  stable: "All four tiles [Phase 2]",
  aiLine: "CX signal cohort joins mock transaction feed at cohort level — pilot ask only.",
  aiConfidence: "Med-High" as ConfidenceBand,
};

export type RevenueBridgeCoverageStatus = "done" | "partial" | "pending";

export type RevenueBridgeImpactBreakdown = {
  bridgeId: string;
  label: string;
  value: string;
  cohort: string;
};

export type RevenueBridgeSignalDetail = {
  id: string;
  title: string;
  value: string;
  cohort: string;
  confidence: string;
};

export type RevenueBridgeCoverageItem = {
  label: string;
  status: RevenueBridgeCoverageStatus;
  detail: string;
};

export type RevenueBridgeKpiConfig = {
  id: "impact" | "signals" | "readiness";
  title: string;
  primaryValue: string;
  primaryLabel: string;
  subtitle?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  footer: string;
  detail?: string;
  breakdown?: RevenueBridgeImpactBreakdown[];
  signalIds?: readonly string[];
  signalDetails?: RevenueBridgeSignalDetail[];
  readyCount?: number;
  totalCount?: number;
  pendingLabel?: string;
  readinessPct?: number;
  coverageItems?: RevenueBridgeCoverageItem[];
  gapNote?: string;
};

export const REVENUE_BRIDGE_KPIS: RevenueBridgeKpiConfig[] = [
  {
    id: "impact",
    title: "Revenue at Risk",
    primaryValue: "₹52.8L / Week",
    primaryLabel: "Revenue Read-through",
    subtitle: "Cohort-level rollup across 4 starred bridges",
    delta: "↑ 12% vs last assessment",
    deltaTone: "up",
    detail: "Normalized to weekly read-through for exec comparison — not live P&L.",
    breakdown: [
      { bridgeId: "MB1", label: "D07 complaint-adjusted margin", value: "₹18.4L / wk", cohort: "Koramangala D07 · missing/spoiled" },
      { bridgeId: "MB4", label: "Seller trust-tax", value: "₹6.2L / mo", cohort: "Electronics seller · earbuds" },
      { bridgeId: "MB8", label: "Refund → repeat loss", value: "₹11.1L / qtr", cohort: "Refund-status intent" },
      { bridgeId: "MB17", label: "Defect-cost vs LTV", value: "₹24.8L / qtr", cohort: "High-LTV defect cohort" },
    ],
    footer: "Based on trusted CX signals",
  },
  {
    id: "signals",
    title: "Voice → P&L Bridges Ready",
    primaryValue: "4 / 17",
    primaryLabel: "Signals Ready for Join",
    subtitle: "Starred bridges with corroborated voice evidence",
    readyCount: 4,
    totalCount: 17,
    signalIds: ["MB1", "MB4", "MB8", "MB17"],
    signalDetails: [
      { id: "MB1", title: "D07 complaint-adjusted margin", value: "₹18.4L / week", cohort: "Q-commerce outbreak", confidence: "High" },
      { id: "MB4", title: "Seller trust-tax", value: "₹6.2L / month", cohort: "Neg-review velocity break", confidence: "Med-High" },
      { id: "MB8", title: "Refund → repeat loss", value: "₹11.1L / quarter", cohort: "34% repeat vs p50 22%", confidence: "High" },
      { id: "MB17", title: "Defect-cost vs LTV", value: "₹24.8L / quarter", cohort: "Proxy-audited · governed", confidence: "Med-High" },
    ],
    pendingLabel: "13 catalogue bridges await cohort map + trust audit",
    footer: "Phase 2 Preview",
  },
  {
    id: "readiness",
    title: "Transaction Feed Readiness",
    primaryValue: "68%",
    primaryLabel: "Order Feed Coverage",
    subtitle: "Read-only pilot scope · no live write-back",
    readinessPct: 68,
    coverageItems: [
      { label: "Orders", status: "done", detail: "Order volume + GMV cohort keys mapped" },
      { label: "Returns", status: "done", detail: "Return/refund events keyed to intent" },
      { label: "Margin", status: "partial", detail: "Complaint-adjusted margin proxy only" },
    ],
    gapNote: "32% gap: live margin feed + seller-level SKU economics still mock",
    footer: "Read-only Pilot Ready",
  },
];

export const REVENUE_BRIDGE_MAPPED_SIGNALS = ["MB1", "MB4", "MB8", "MB17"] as const;

export const REVENUE_BRIDGE_READINESS_PCT = 68;

/** S5 page copy — headline lives in screen; purpose + sections here. */
export const REVENUE_BRIDGE_PAGE = {
  purpose: "Trusted CX signals in cohort rupees when the order feed lands — pilot ask only, never live P&L.",
  aiLine: "Four starred bridges join voice cohorts to a mock transaction feed at cohort level. Human-approved pilot only.",
  aiConfidence: "Med-High" as ConfidenceBand,
  sections: {
    bridges: "Bridge catalogue",
    bridgesHint: "MB1–MB17 · select to preview join",
    actions: "Pilot actions",
    actionsHint: "No live transaction write-back",
  },
};

export const EXECUTIVE_TILES: ExecutiveTileData[] = [
  {
    id: "upi-checkout",
    breakingIssue: "UPI-step checkout failure",
    owner: "Payments",
    severity: "critical",
    primaryValue: "3",
    primaryLabel: "channels corroborating",
    delta: "1,900 mentions → 1 signal",
    deltaTone: "warn",
    onset: "T−6h",
    channels: ["App review", "Care chat", "Social"],
    spark: [2, 3, 2, 4, 5, 6, 7],
    gaugeLabel: "Theme velocity",
    gaugeValue: 74,
    recommendedAction: "Route to Payments today — checkout UPI step failure cluster.",
    aiInsight:
      "Payment-step promise breach across independent channels — not a single-channel blip.",
    confidence: "High",
    drillSignalId: "upi-checkout",
  },
  {
    id: "d07-outbreak",
    breakingIssue: "Koramangala D07 spoilage cluster",
    owner: "City Ops",
    severity: "high",
    primaryValue: "6×",
    primaryLabel: "vs own baseline",
    delta: "48 complaints · 7 peers flat",
    deltaTone: "down",
    onset: "This shift",
    channels: ["Care chat", "Tickets"],
    spark: [1.1, 1.0, 1.2, 2.4, 4.1, 5.8, 6.2],
    gaugeLabel: "Peer-relative issue-rate",
    gaugeValue: 38,
    recommendedAction: "Draft localised ops alert for D07 this shift.",
    aiInsight:
      "Picker/pack/substitution failure at D07 — catchment issue before warehouse dashboard moves.",
    confidence: "High",
    drillSignalId: "d07-outbreak",
  },
  {
    id: "statutory-clock",
    breakingIssue: "Statutory-clock grievances",
    owner: "Legal · Nodal Officer",
    severity: "critical",
    primaryValue: "3",
    primaryLabel: "within 6h of deadline",
    delta: "DPDP erasure leading at T−14h",
    deltaTone: "warn",
    onset: "T−14h closest",
    channels: ["Grievance desk", "Email"],
    spark: [1, 1, 2, 2, 3, 3, 3],
    gaugeLabel: "Statutory exposure",
    gaugeValue: 62,
    recommendedAction:
      "Re-prioritise queue by clock proximity — human approve before external route.",
    aiInsight:
      "Regulatory risk outranks time-waiting — named-instrument evidence stays internal.",
    confidence: "High",
  },
];

export const KPI_RIBBON = [
  { label: "Contact per order", value: "14.2 / 1k", delta: "+0.8 vs last week", tone: "warn" as const },
  { label: "Theme velocity", value: "7 active", delta: "+3 vs last week", tone: "warn" as const },
  { label: "NPS delta", value: "−4 pts", delta: "Electronics-led", tone: "down" as const },
  { label: "CSAT delta", value: "−2.1 pts", delta: "Refund-status drag", tone: "down" as const },
];

export const RADAR_SIGNALS: RadarSignal[] = [
  {
    id: "upi-checkout",
    title: "UPI-step checkout failure",
    severity: "critical",
    cohort: "Checkout funnel · India cohort",
    honestyLine: "Interaction corpus only — order confirmation state needs the Phase-2 feed.",
    onset: "T−6h",
    mentions: 1900,
    signalsDistilled: 1,
    channels: [
      { name: "App review", time: "09:12" },
      { name: "Care chat", time: "09:40" },
      { name: "Social", time: "11:05" },
    ],
    stats: "Normalised theme velocity · 3 independent channels",
    aiVerdict: "Payment-step promise breach — not a single-channel blip.",
    confidence: "High",
    owner: "Payments",
    draftAction: "Draft route to Payments — checkout UPI step failure cluster.",
    draftKind: "draft",
    drillSignature: "radar-corroboration",
    evidence: {
      ruledOut: ["Single-channel decoy suppressed", "No sale-event distortion (calendar excluded)"],
      snippets: [
        "UPI deducted but order stuck on confirming — app review",
        "Payment step spinner since morning — care chat",
        "Anyone else UPI failing at checkout — social",
      ],
    },
  },
  {
    id: "d07-outbreak",
    title: "Koramangala D07 spoilage cluster",
    severity: "high",
    cohort: "Koramangala D07 catchment",
    honestyLine: "GMV/margin figure is bridge-ready — needs the order feed.",
    onset: "This shift",
    mentions: 48,
    signalsDistilled: 1,
    channels: [
      { name: "Care chat", time: "08:20" },
      { name: "Tickets", time: "09:15" },
    ],
    stats: "6× own baseline · peers flat",
    aiVerdict: "Picker/pack/substitution-layer failure at D07 — not city-wide.",
    confidence: "High",
    owner: "City Ops",
    draftAction: "Draft localised ops alert for D07 this shift.",
    draftKind: "draft",
    drillSignature: "geo-outbreak",
  },
  {
    id: "slow-delivery-decoy",
    title: "Slow delivery (single channel)",
    severity: "stable",
    cohort: "Marketplace · one channel",
    honestyLine: "Below corroboration threshold — correctly suppressed.",
    onset: "T−12h",
    mentions: 240,
    signalsDistilled: 0,
    channels: [{ name: "Email", time: "07:30" }],
    stats: "1 channel only — gate not cleared",
    aiVerdict: "Suppressed — fails the ≥2-channel corroboration gate.",
    confidence: "Low",
    owner: "—",
    draftAction: "Monitor only — no route.",
    draftKind: "route",
    drillSignature: "radar-corroboration",
    suppressed: true,
  },
  {
    id: "electronics-suppression",
    title: "Electronics ticket drop — warning",
    severity: "high",
    cohort: "Electronics category",
    honestyLine: "Proven in rupees by the revenue bridge — Phase 2 join.",
    onset: "T−1 week",
    mentions: 0,
    signalsDistilled: 1,
    channels: [
      { name: "Tickets", time: "—" },
      { name: "In-app", time: "Access change logged" },
    ],
    stats: "Tickets −18% · contact-per-order flat",
    aiVerdict: "A warning, not a win — chat entry point moved same week.",
    confidence: "Med-High",
    owner: "CX Ops + Product",
    draftAction:
      "Route → CX Ops + Product (warning). Electronics tickets −18% but contact-per-order flat + chat entry moved. Flagged as a warning, not a win.",
    draftKind: "route",
    drillSignature: "inverse-anomaly",
  },
];

export function getRadarSignalById(id: string): RadarSignal | undefined {
  return RADAR_SIGNALS.find((s) => s.id === id);
}

export function getDarkStoreById(id: string): DarkStoreNode | undefined {
  return DARK_STORES.find((d) => d.id === id);
}

export function getBridgeTileById(id: string): BridgeTileData | undefined {
  return BRIDGE_TILES.find((b) => b.id === id);
}

/** S2 hero headline — SIG-T2-02-001 (id internal only). */
export const QUICK_COMMERCE_HEADLINE = {
  title: "Koramangala D07 issue-rate is 6× its own baseline while peers hold flat.",
  soWhat:
    "A catchment is failing before the warehouse dashboard shows it — normalised to order volume so a busy store does not read as broken.",
  explainability:
    "48 of 50 spoilage complaints trace to one node; seven peer dark-stores hold flat in the same window.",
};

export type OutbreakEvidencePack = {
  storeId: string;
  issueSplit: { missing: number; spoiled: number; late: number };
  snippets: string[];
  ruledOut: string[];
  draftOpsAlert: string;
};

export const OUTBREAK_EVIDENCE: Record<string, OutbreakEvidencePack> = {
  "DS-BLR-D07": {
    storeId: "DS-BLR-D07",
    issueSplit: { missing: 31, spoiled: 17, late: 9 },
    snippets: [
      "Milk packet swollen — delivered warm from Koramangala hub — care chat",
      "Vegetables spoiled before promised slot — ticket",
      "Missing paneer again from same dark-store — care chat",
      "Curd expiry date already passed — app review",
      "Substituted item not what I ordered — ticket",
      "Two items missing from D07 fulfilment — care chat",
    ],
    ruledOut: ["Peers flat (not city-wide)", "No sale event (calendar excluded)", "Normalised per 1k orders"],
    draftOpsAlert:
      "Draft — for approval. D07 Koramangala: missing/spoiled at ~6× baseline this shift, peers flat. Suggested: inspect picker/pack + substitution at D07; localised slot review 6–10pm. Routed to City Ops on approval.",
  },
};

export type QuickCommerceRadarCard = {
  id: string;
  title: string;
  stat: string;
  honestyLine: string;
  aiVerdict: string;
  confidence: ConfidenceBand;
  draftAction: string;
  draftKind: RadarSignal["draftKind"];
  flag?: string;
};

export const PERISHABLE_RADAR: QuickCommerceRadarCard = {
  id: "perishable-d07",
  title: "Perishable spoilage cluster",
  stat: "48 of 50 complaints · one node",
  honestyLine: "SPARSE cluster — node-concentrated; precision-first routing.",
  aiVerdict: "Spoilage language concentrated at D07 — food-safety routing warranted.",
  confidence: "High",
  draftAction: "Route → Food-safety (FSSAI) — inspect cold-chain at D07.",
  draftKind: "route",
  flag: "FSSAI-flagged",
};

export const SUBSTITUTION_RADAR: QuickCommerceRadarCard = {
  id: "substitution-gap",
  title: "Wrong-substitute theme",
  stat: "Rising on care chat · not store floor volume",
  honestyLine: "Process-gap diamond — substitution logic owner, not store Ops.",
  aiVerdict: "Wrong-substitute intent rising — route to the logic owner who sets substitution rules.",
  confidence: "Med-High",
  draftAction: "Route → substitution-logic owner — not the dark-store floor.",
  draftKind: "route",
};

export const PICK_PACK_RADAR: QuickCommerceRadarCard = {
  id: "pick-pack-d07",
  title: "Pick-pack failure spike",
  stat: "6× baseline at D07 · peers flat",
  honestyLine: "Node-local break — picker/pack layer, not city-wide fulfilment drift.",
  aiVerdict: "D07 issue-rate diverging from seven peer dark-stores in the same catchment window.",
  confidence: "High",
  draftAction: "Draft localised ops alert for D07 — inspect pick/pack this shift.",
  draftKind: "draft",
  flag: "D07-local",
};

export const QUICK_COMMERCE_RADAR_CARDS: QuickCommerceRadarCard[] = [
  PERISHABLE_RADAR,
  SUBSTITUTION_RADAR,
  PICK_PACK_RADAR,
];

export const QUICK_COMMERCE_ACTIONS = {
  opsAlert: OUTBREAK_EVIDENCE["DS-BLR-D07"].draftOpsAlert,
  foodSafety: PERISHABLE_RADAR.draftAction,
  substitution: SUBSTITUTION_RADAR.draftAction,
  pickPack: PICK_PACK_RADAR.draftAction,
};

/** S3 hero headline — SIG-T2-11-001 (id internal only). */
export const COMPLIANCE_HEADLINE = {
  title: "3 grievances within 6 hours of a statutory deadline — re-prioritised above time-waiting.",
  soWhat:
    "The queue is ranked by regulatory risk, not by who waited longest — explicit clock and keyword triggers.",
  explainability:
    "Matched to firm-level instruments with auditable evidence counts — routing stays internal until a human approves.",
};

export type StatutoryQueueItem = {
  /** Internal id for drill routing — not shown on card face. */
  id: string;
  countdown: string;
  keyword: string;
  regulation: string;
  touches: number;
  stallState: string;
  auditTrail: string[];
  urgency: "critical" | "high" | "medium";
};

/** Re-ranked by clock proximity — realistic scale (RP-009). */
export const STATUTORY_QUEUE: StatutoryQueueItem[] = [
  {
    id: "GRV-0412",
    countdown: "DPDP erasure −14h",
    keyword: "delete my data",
    regulation: "DPDP Rules 2025 · Rule 14",
    touches: 3,
    stallState: "Stalled across 3 touches",
    auditTrail: [
      "T−72h: first touch logged — no erasure action",
      "T−36h: follow-up — case still open",
      "T−14h: keyword override — re-prioritised above time-waiting",
    ],
    urgency: "critical",
  },
  {
    id: "GRV-0398",
    countdown: "48h acknowledgement −5h",
    keyword: "refund not received",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    touches: 2,
    stallState: "Awaiting first meaningful response",
    auditTrail: ["T−40h: grievance filed", "T−5h: clock proximity threshold crossed"],
    urgency: "high",
  },
  {
    id: "GRV-0401",
    countdown: "48h acknowledgement −4h",
    keyword: "no response",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    touches: 4,
    stallState: "Multiple touches — no ack logged",
    auditTrail: ["T−44h: filed", "T−20h: second touch", "T−4h: re-ranked by clock"],
    urgency: "high",
  },
  {
    id: "GRV-0385",
    countdown: "48h grievance −18h",
    keyword: "wrong MRP charged",
    regulation: "Legal Metrology (Packaged Commodities) Rules 2011",
    touches: 2,
    stallState: "Metrology mismatch logged — no pricing correction",
    auditTrail: ["T−48h: grievance filed", "T−24h: voice corroboration on shelf MRP"],
    urgency: "high",
  },
  {
    id: "GRV-0371",
    countdown: "Refund SLA −22h",
    keyword: "cancelled order refund",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    touches: 1,
    stallState: "Single touch — refund SLA clock running",
    auditTrail: ["T−72h: cancellation grievance filed"],
    urgency: "high",
  },
];

export function getStatutoryItemById(id: string): StatutoryQueueItem | undefined {
  return STATUTORY_QUEUE.find((g) => g.id === id);
}

export const DARK_PATTERN_EVIDENCE = {
  instrument: "CCPA basket-sneaking",
  evidenceCount: 37,
  surfaceRef: "Checkout step 3 — pre-ticked add-on",
  honestyLine:
    "Allegation surfaced from corpus; confirmed checkout state needs the Phase-2 feed.",
  aiVerdict:
    "Named-instrument match to basket-sneaking — auditable evidence count attached.",
  confidence: "High" as ConfidenceBand,
  factPattern: "Aligns with published pre-ticked add-on enforcement pattern",
  draftAction:
    "Regulatory-exposure card → internal Legal only. Evidence pack attached.",
};

export const REFUND_FRICTION_CARD: QuickCommerceRadarCard = {
  id: "refund-friction",
  title: "Refund-friction narrative",
  stat: "Cluster of 142 contacts / week · refund-delay theme",
  honestyLine: "Cohort-level refund-status frustration — normalised to refund contacts.",
  aiVerdict: "Refund-delay narrative growing faster than order growth — route internally first.",
  confidence: "Med-High",
  draftAction: "Route refund cluster → Refund Ops (draft).",
  draftKind: "route",
};

export const MRP_MISMATCH_CARD: QuickCommerceRadarCard = {
  id: "mrp-mismatch",
  title: "Weight / MRP mismatch",
  stat: "28 corroborated mentions · packaged goods",
  honestyLine: "Legal Metrology (Packaged Commodities) Rules — internal Legal review only.",
  aiVerdict: "MRP-on-pack mismatch theme — firm-level instrument, not a loose keyword.",
  confidence: "High",
  draftAction: "Route → internal Legal — packaged commodities fact pattern.",
  draftKind: "route",
};

export const COMPLIANCE_ACTIONS = {
  priorityAlert:
    "Draft priority alert → Nodal officer. GRV nears DPDP erasure clock (−14h), keyword 'delete my data'. Re-prioritised above time-waiting. Audit trail attached.",
  regulatoryCard: DARK_PATTERN_EVIDENCE.draftAction,
  refundFriction: REFUND_FRICTION_CARD.draftAction,
  mrpMismatch: MRP_MISMATCH_CARD.draftAction,
  acknowledgementEscalation:
    "Escalate GRV-0398 & GRV-0401 → Nodal officer. 48h ack window, no response logged.",
};

/** S4 hero headline — SIG-T2-20-001 (id internal only). */
export const CX_QUALITY_HEADLINE = {
  title:
    "Electronics ticket volume fell 18% — but contact-per-order is flat and the chat button moved. A warning, not a win.",
  soWhat:
    "The sharpest CX-vs-P&L seam — a good-looking drop can be silent churn when support access changes in the same week.",
  explainability:
    "Order-normalised contact-per-order holds flat while raw ticket volume falls; support-entry change logged the same week.",
};

export type SuppressionWeekPoint = {
  label: string;
  ticketVolume: number;
  contactPerOrder: number;
  accessChange?: boolean;
};

export type SuppressionEvidencePack = {
  ticketDropPct: string;
  contactPerOrderLabel: string;
  weeklySeries: SuppressionWeekPoint[];
  accessChange: { label: string; when: string; detail: string };
  ruledOut: string[];
  statusVerdict: string;
  draftAction: string;
};

export const SUPPRESSION_EVIDENCE: SuppressionEvidencePack = {
  ticketDropPct: "−18%",
  contactPerOrderLabel: "14.2 / 1k orders (flat)",
  weeklySeries: [
    { label: "W-6", ticketVolume: 118, contactPerOrder: 14.1 },
    { label: "W-5", ticketVolume: 116, contactPerOrder: 14.2 },
    { label: "W-4", ticketVolume: 114, contactPerOrder: 14.1 },
    { label: "W-3", ticketVolume: 112, contactPerOrder: 14.2 },
    { label: "W-2", ticketVolume: 108, contactPerOrder: 14.2 },
    { label: "W-1", ticketVolume: 100, contactPerOrder: 14.2, accessChange: true },
    { label: "W0", ticketVolume: 97, contactPerOrder: 14.2 },
  ],
  accessChange: {
    label: "Support-entry change",
    when: "W-1",
    detail: "Chat buried on PDP — access-change logged",
  },
  ruledOut: [
    "Fewer orders (Electronics order volume flat-to-up)",
    "Seasonal dip (calendar excluded)",
    "Single-channel decoy suppressed",
  ],
  statusVerdict: "Ticket volume fell but contact-per-order did not — not a quality win.",
  draftAction:
    "Route → CX Ops + Product. Tickets −18%, CPO flat, chat entry moved — warning, not a win.",
};

export type CxQualityCard = QuickCommerceRadarCard & {
  gated?: boolean;
  gateLabel?: string;
  integrityNote?: string;
};

export const SELLER_TRUST_CARD: CxQualityCard = {
  id: "audiomax",
  title: "Seller trust-erosion",
  stat: "Neg-review velocity break · earbuds cluster",
  honestyLine: "Integrity-cleared — organic spread, not brigading.",
  aiVerdict:
    "Dead-on-arrival / not-as-described language ahead of star average — seller-health routing warranted.",
  confidence: "Med-High",
  draftAction: "Route → Seller-Brand Partnerships (gated to risk review).",
  draftKind: "route",
  gated: true,
  gateLabel: "Gated to risk review",
  integrityNote: "Integrity guard passed",
  flag: "Integrity-cleared",
};

export type SellerTrustEvidencePack = {
  sellerLabel: string;
  theme: string;
  velocityBreak: string;
  integrityNote: string;
  ruledOut: string[];
  snippets: string[];
  draftAction: string;
};

export const SELLER_TRUST_EVIDENCE: SellerTrustEvidencePack = {
  sellerLabel: "Electronics seller · earbuds SKU family",
  theme: "Dead on arrival / not as described",
  velocityBreak: "Neg-review velocity ahead of category star average",
  integrityNote: "Organic spread · not brigading · integrity guard passed",
  ruledOut: ["Brigading pattern ruled out", "Sale-event distortion excluded", "Single-review outlier suppressed"],
  snippets: [
    "Earbuds dead on arrival — left bud never paired — app review",
    "Not as described — battery life half of listing — ticket",
    "Received used unit in sealed box — care chat",
    "Sound quality nothing like the photos — app review",
  ],
  draftAction: "Route → Seller-Brand Partnerships (gated to risk review).",
};

export const FCR_REPEAT_CARD: CxQualityCard = {
  id: "refund-status-repeat",
  title: "FCR / repeat root-cause",
  stat: "\"refund-status\" repeat-contact 34% vs p50 22%",
  honestyLine: "DENSE break past p95 (31%) — cohort-level, not individual queue depth.",
  aiVerdict: "Refund-status intent driving excess repeats — fix the cause, not the queue.",
  confidence: "High",
  draftAction: "Route cause → process owner for the intent.",
  draftKind: "route",
};

export const BOT_QUALITY_CARD: CxQualityCard = {
  id: "bot-refund-status",
  title: "AI-agent quality monitor",
  stat: "Containment 64%→58% on refund-status after flow change",
  honestyLine: "Below p05 (64%) on a DENSE intent — flow change coincident.",
  aiVerdict: "Bot containment drop on refund-status — route the failing flow, gate any change.",
  confidence: "Med-High",
  draftAction: "Route failing flow → AI-ops (gated).",
  draftKind: "route",
  gated: true,
  gateLabel: "Gated — flow change requires AI-ops sign-off",
};

export const CX_QUALITY_ACTIONS = {
  suppressionWarning: SUPPRESSION_EVIDENCE.draftAction,
  sellerTrust: SELLER_TRUST_CARD.draftAction,
  fcrRepeat: FCR_REPEAT_CARD.draftAction,
  botQuality: BOT_QUALITY_CARD.draftAction,
};

export const DARK_STORES: DarkStoreNode[] = [
  {
    id: "DS-BLR-D07",
    label: "Koramangala D07",
    city: "Bengaluru",
    issueRate: 5.4,
    baseline: 0.9,
    peerMultiple: 6,
    status: "outbreak",
    trend7d: { direction: "up", delta: "+4.2", spark: [0.9, 1.4, 2.2, 3.1, 4.0, 4.8, 5.4] },
  },
  {
    id: "DS-BLR-D12",
    label: "Indiranagar D12",
    city: "Bengaluru",
    issueRate: 1.0,
    baseline: 1.0,
    peerMultiple: 1,
    status: "flat",
    trend7d: { direction: "flat", delta: "±0.0", spark: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  },
  {
    id: "DS-BLR-D19",
    label: "HSR Layout D19",
    city: "Bengaluru",
    issueRate: 0.9,
    baseline: 1.0,
    peerMultiple: 0.9,
    status: "nominal",
    trend7d: { direction: "down", delta: "−0.1", spark: [1.1, 1.0, 1.0, 0.9, 0.9, 0.9, 0.9] },
  },
  {
    id: "DS-HYD-D04",
    label: "Gachibowli D04",
    city: "Hyderabad",
    issueRate: 1.1,
    baseline: 1.0,
    peerMultiple: 1.1,
    status: "flat",
    trend7d: { direction: "up", delta: "+0.1", spark: [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1] },
  },
  {
    id: "DS-HYD-D08",
    label: "Kondapur D08",
    city: "Hyderabad",
    issueRate: 0.8,
    baseline: 1.0,
    peerMultiple: 0.8,
    status: "nominal",
    trend7d: { direction: "down", delta: "−0.2", spark: [1.0, 1.0, 0.9, 0.9, 0.8, 0.8, 0.8] },
  },
  {
    id: "DS-DEL-D02",
    label: "Saket D02",
    city: "Delhi NCR",
    issueRate: 1.0,
    baseline: 1.0,
    peerMultiple: 1,
    status: "flat",
    trend7d: { direction: "flat", delta: "±0.0", spark: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  },
  {
    id: "DS-DEL-D11",
    label: "Gurugram D11",
    city: "Delhi NCR",
    issueRate: 1.2,
    baseline: 1.0,
    peerMultiple: 1.2,
    status: "flat",
    trend7d: { direction: "up", delta: "+0.2", spark: [1.0, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2] },
  },
  {
    id: "DS-MUM-D05",
    label: "Powai D05",
    city: "Mumbai",
    issueRate: 0.9,
    baseline: 1.0,
    peerMultiple: 0.9,
    status: "nominal",
    trend7d: { direction: "down", delta: "−0.1", spark: [1.0, 1.0, 1.0, 0.9, 0.9, 0.9, 0.9] },
  },
];

/** S5 hero headline — voice→P&L reveal (internal ids never on face). */
export const REVENUE_BRIDGE_HEADLINE = {
  title: "The signals you already trust, now in rupees — when the order feed lands.",
  soWhat: "The Phase-2 flip, routed through the CX champion, never around her.",
  explainability:
    "Bridge-ready: the CX signal on the left joins to a minimal order feed on the right at cohort level; lights up with the transaction feed.",
};

export const STARRED_BRIDGE_IDS = ["MB1", "MB4", "MB8", "MB17"] as const;

export type BridgeCatalogueStatus = "ready" | "pending";

export type BridgeCatalogueEntry = {
  id: string;
  title: string;
  status: BridgeCatalogueStatus;
  pendingNote?: string;
};

/** Full MB1–MB17 catalogue — 4 ready for join preview, 13 pending cohort map. */
export const BRIDGE_CATALOGUE: BridgeCatalogueEntry[] = [
  { id: "MB1", title: "D07 complaint-adjusted margin", status: "ready" },
  { id: "MB2", title: "Hyperlocal perishability → node halt", status: "pending", pendingNote: "Geographic concentration + FSSAI join key not mapped." },
  { id: "MB3", title: "Review sentiment drop → conversion → GMV", status: "pending", pendingNote: "Single-SKU confound control awaiting PDP feed." },
  { id: "MB4", title: "Seller trust-tax", status: "ready" },
  { id: "MB5", title: "Counterfeit allegation → gated liability", status: "pending", pendingNote: "Seller payout history join gated to T&S review." },
  { id: "MB6", title: "Return free-text → return codes → margin", status: "pending", pendingNote: "Free-text-to-structured reconciliation not keyed." },
  { id: "MB7", title: "Detractor cohort → repeat / CLV", status: "pending", pendingNote: "Cohort repeat window needs trust audit." },
  { id: "MB8", title: "Refund → repeat loss", status: "ready" },
  { id: "MB9", title: "Repeat-contact → cost-to-serve + churn", status: "pending", pendingNote: "Opex bridge awaits intent × contact-cost feed." },
  { id: "MB10", title: "Dark-pattern allegation → regulator evidence", status: "pending", pendingNote: "Historical checkout-state archive not linked." },
  { id: "MB11", title: "Drip-pricing complaint → net revenue bleed", status: "pending", pendingNote: "Cart-abandonment A/B join not configured." },
  { id: "MB12", title: "OOS complaint → lost GMV", status: "pending", pendingNote: "Stock-out feed counterfactual pending." },
  { id: "MB13", title: "Social virality → refund/RTO + CAC", status: "pending", pendingNote: "Attribution noise — lower-confidence band." },
  { id: "MB14", title: "Policy change → complaint + cancellation cost", status: "pending", pendingNote: "Before/after boundary needs change-owner tag." },
  { id: "MB15", title: "Peak-event → GMV-at-risk", status: "pending", pendingNote: "War-room disambiguation keys not mapped." },
  { id: "MB16", title: "Delivery-promise credibility by zone", status: "pending", pendingNote: "Promise-believability join beyond raw SLA." },
  { id: "MB17", title: "Defect-cost vs LTV appeasement", status: "ready" },
];

export function getBridgeCatalogueEntry(id: string): BridgeCatalogueEntry | undefined {
  return BRIDGE_CATALOGUE.find((e) => e.id === id);
}

export const BRIDGE_ACTIONS = {
  previewJoin:
    "Preview the join (mock feed) — cohort-level split view only. No live transaction action.",
  pilotDataAsk:
    "Frame the pilot data ask for the read-only transaction feed — human-approved pilot only.",
  routeOwner:
    "Route the selected bridge join preview to the owning function for pilot sign-off — no live transaction write-back.",
  prioritiseCatalogue:
    "Prioritise the next pending catalogue bridge for cohort-map and trust-audit work on the Phase 2 backlog.",
  governanceReview:
    "Schedule governance review for differential appeasement bridges before any pilot read-through is shared.",
};

export type BridgePilotAction = {
  id: string;
  draftKind: RadarSignal["draftKind"];
  text: string;
};

export const BRIDGE_PILOT_ACTIONS: BridgePilotAction[] = [
  { id: "preview", draftKind: "prepare", text: BRIDGE_ACTIONS.previewJoin },
  { id: "dataAsk", draftKind: "draft", text: BRIDGE_ACTIONS.pilotDataAsk },
  { id: "route", draftKind: "route", text: BRIDGE_ACTIONS.routeOwner },
  { id: "prioritise", draftKind: "draft", text: BRIDGE_ACTIONS.prioritiseCatalogue },
  { id: "governance", draftKind: "prepare", text: BRIDGE_ACTIONS.governanceReview },
];

export const BRIDGE_TILES: BridgeTileData[] = [
  {
    id: "MB1",
    title: "D07 complaint-adjusted margin",
    cohort: "Koramangala D07 · missing/spoiled",
    bridgeValue: "₹18.4L / week",
    honestyLine: "",
    signalRef: "6× baseline issue-rate · 48 of 50 complaints",
    starred: true,
    confidence: "High",
    aiVerdict: "Q-commerce outbreak cohort joins to complaint-adjusted margin when the order feed lands.",
  },
  {
    id: "MB4",
    title: "Seller trust-tax",
    cohort: "Electronics seller · earbuds cluster",
    bridgeValue: "₹6.2L / month",
    honestyLine: "Bridge-ready — repeat and return cost join.",
    signalRef: "Neg-review velocity break · integrity-cleared",
    starred: true,
    confidence: "Med-High",
    aiVerdict: "Trust-erosion signal joins to conversion drag and return cost on the seller cohort.",
  },
  {
    id: "MB8",
    title: "Refund → repeat loss",
    cohort: "Refund-status intent",
    bridgeValue: "₹11.1L / quarter",
    honestyLine: "Bridge-ready — cohort repeat join.",
    signalRef: "34% repeat vs p50 22%",
    starred: true,
    confidence: "High",
    aiVerdict: "Refund-status repeat root-cause joins to 30/60/90-day repeat loss when the feed lands.",
  },
  {
    id: "MB17",
    title: "Defect-cost vs LTV appeasement",
    cohort: "High-LTV defect cohort",
    bridgeValue: "₹24.8L / quarter",
    honestyLine: "Heaviest governance — differential action gated, never auto-applied.",
    signalRef: "Proxy-audited cohort band",
    starred: true,
    confidence: "Med-High",
    aiVerdict: "Cohort-banded defect cost vs LTV appeasement — proxy-audited, human-approved only.",
    governance: {
      cohortBanded: true,
      proxyAudited: true,
      differentialGated: true,
      neverAutoApplied: true,
    },
  },
];

export const BRIDGE_EVIDENCE: Record<string, BridgeEvidencePack> = {
  MB1: {
    cxCohort: "Koramangala D07 · missing/spoiled (48 of 50 complaints)",
    txnCohort: "Mock order/GMV feed · dark-store + issue-theme keyed",
    joinKey: "store_catchment × issue_theme",
    cxSignalCount: "1 corroborated outbreak signal",
    txnRowCount: "12,400 orders / week (mock)",
    owner: "City / Dark-store Ops + Category",
    businessQuestion: "How much margin is D07 losing to missing/spoiled before Ops sees the ops metric move?",
    recommendedAction: "Approve 90-day read-only order feed keyed on dark-store × issue theme.",
    feedScope: "Orders + returns mapped · complaint-adjusted margin proxy partial until live feed lands.",
    guardrails: [
      "Cohort-level join only — no individual routing",
      "Human-approved pilot data ask — no live feed action",
      "Bridge-ready until transaction feed lands",
    ],
    confidence: "High",
    aiVerdict:
      "6× baseline issue-rate at D07 joins to ₹18.4L/week complaint-adjusted margin [Phase 2].",
  },
  MB4: {
    cxCohort: "Electronics seller · earbuds · neg-review velocity break",
    txnCohort: "Mock conversion + return-cost feed · seller cohort",
    joinKey: "seller_cohort × SKU family",
    cxSignalCount: "1 integrity-cleared trust signal",
    txnRowCount: "8,200 units / month (mock)",
    owner: "Seller-Brand Partnerships + Category",
    businessQuestion: "What is the trust-tax on conversion and returns for this seller cohort?",
    recommendedAction: "Route preview to risk review — never auto-act on seller-health.",
    feedScope: "Conversion + return-cost feed keyed at seller × SKU family level.",
    guardrails: [
      "Cohort-level join only",
      "Gated to risk review — never auto-act on seller-health",
      "Bridge-ready until transaction feed lands",
    ],
    confidence: "Med-High",
    aiVerdict: "Trust-tax joins to ₹6.2L/month conversion + return drag [Phase 2].",
  },
  MB8: {
    cxCohort: "Refund-status intent · 34% repeat vs p50 22%",
    txnCohort: "Mock cohort repeat / LTV feed",
    joinKey: "intent × repeat_window",
    cxSignalCount: "1 FCR/repeat root-cause signal",
    txnRowCount: "41,000 refund contacts / quarter (mock)",
    owner: "Refund / Payments Ops + Growth",
    businessQuestion: "Which refund-status contacts are killing 30/60/90-day repeat vs merely delaying cash?",
    recommendedAction: "Route root-cause fix to process owner — bridge quantifies repeat loss only.",
    feedScope: "Cohort repeat / LTV feed keyed on refund-status intent.",
    guardrails: [
      "Cohort-level join only",
      "Route cause to process owner — bridge quantifies repeat loss",
      "Bridge-ready until transaction feed lands",
    ],
    confidence: "High",
    aiVerdict: "Refund-status repeat break joins to ₹11.1L/quarter repeat loss [Phase 2].",
  },
  MB17: {
    cxCohort: "High-LTV defect cohort · proxy-audited band",
    txnCohort: "Mock defect-cost vs LTV appeasement feed",
    joinKey: "ltv_band × defect_theme",
    cxSignalCount: "1 governance-heavy cohort signal",
    txnRowCount: "2,100 high-LTV defect cases / quarter (mock)",
    owner: "CX Ops + Risk (cohort LTV vs margin)",
    businessQuestion: "Is appeasement on this defect cohort economically rational vs LTV at risk?",
    recommendedAction: "Human-approved pilot only — differential action gated, never auto-applied.",
    feedScope: "Defect-cost vs LTV appeasement feed · proxy-audited cohort band.",
    guardrails: [
      "Cohort-banded — differential action gated",
      "Proxy-audited — never auto-applied",
      "Human-approved pilot only — heaviest governance tier",
      "Bridge-ready until transaction feed lands",
    ],
    confidence: "Med-High",
    aiVerdict:
      "Defect-cost vs LTV appeasement joins to ₹24.8L/quarter [Phase 2] — governance gate required.",
  },
};

export function getBridgeEvidenceById(id: string): BridgeEvidencePack | undefined {
  return BRIDGE_EVIDENCE[id];
}

export const AI_DAY_PROMPTS = [
  "Distil what changed in checkout failures since yesterday",
  "Which dark-store peer set should I compare D07 against?",
  "Frame the pilot data ask for the D07 margin bridge",
  "Summarise statutory-clock exposure in plain language",
  "Why is Electronics ticket volume a warning, not a win?",
];

export function mockAiDayResponse(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("checkout") || l.includes("upi"))
    return "UPI-step failures rose across app reviews (09:12), care chat (09:40) and social (11:05). 1,900 mentions distilled to one corroborated signal. Payments owns the checkout step — draft route is prepared.";
  if (l.includes("d07") || l.includes("dark-store") || l.includes("peer"))
    return "D07 Koramangala reads 6× its own BURSTY baseline on missing/spoiled. Seven peer stores hold flat — the break is local to D07, not Bengaluru-wide. 48 of 50 spoilage complaints trace to this node.";
  if (l.includes("bridge") || l.includes("pilot") || l.includes("data ask"))
    return "Koramangala D07 margin bridge needs a read-only order/GMV feed keyed on dark-store and issue theme. Pilot ask: 90-day cohort join on missing/spoiled at D07 — complaint-adjusted margin available once the feed lands.";
  if (l.includes("statutory") || l.includes("clock"))
    return "Three grievances sit within 6 hours of a statutory deadline. One carries a DPDP erasure keyword — re-prioritised above time-waiting. Draft priority alert to the nodal officer is ready for approval.";
  if (l.includes("electronics") || l.includes("warning") || l.includes("win"))
    return "Electronics tickets fell 18% but contact-per-order is flat. A support-entry change (buried chat button) logged the same week. Route as a warning to CX Ops and Product — not a quality win.";
  return "This week vs last: one emerging checkout theme, one local q-commerce outbreak, three statutory-clock items, and a suppression warning on Electronics. All cohort-level, interaction-first, bridge-ready where rupees matter.";
}
