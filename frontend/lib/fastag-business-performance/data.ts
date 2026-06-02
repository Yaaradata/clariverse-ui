export type WaterfallStep =
  | { l: string; t: "total"; value: number }
  | { l: string; t: "inc" | "dec"; delta: number };

export type WaterfallMetric = {
  label: string;
  unit: string;
  steps: WaterfallStep[];
  read: string;
};

export const waterfall: Record<"base" | "volume" | "value" | "revenue", WaterfallMetric> = {
  base: {
    label: "Active Tag Base",
    unit: "tags",
    steps: [
      { l: "Opening", t: "total", value: 2_500_000 },
      { l: "New Activations", t: "inc", delta: 172_000 },
      { l: "Reactivated", t: "inc", delta: 38_000 },
      { l: "Dormant Shift", t: "dec", delta: 205_000 },
      { l: "Closed Tags", t: "dec", delta: 27_000 },
      { l: "Current", t: "total", value: 2_478_000 },
    ],
    read: "Net active base declined by 22K. New and reactivated tags were strong, but dormancy migration outpaced inflow.",
  },
  volume: {
    label: "Txn Volume",
    unit: "M",
    steps: [
      { l: "Opening", t: "total", value: 11.6 },
      { l: "New Activations", t: "inc", delta: 0.8 },
      { l: "Reactivated", t: "inc", delta: 0.3 },
      { l: "Dormant Shift", t: "dec", delta: 1.1 },
      { l: "Closed Tags", t: "dec", delta: 0.4 },
      { l: "Current", t: "total", value: 11.2 },
    ],
    read: "Daily volume looks stable at 11.2M, yet underlying quality softened as dormant transitions removed 1.1M daily transactions.",
  },
  value: {
    label: "Txn Value",
    unit: "Cr",
    steps: [
      { l: "Opening", t: "total", value: 248 },
      { l: "New Activations", t: "inc", delta: 22 },
      { l: "Reactivated", t: "inc", delta: 6 },
      { l: "Dormant Shift", t: "dec", delta: 31 },
      { l: "Closed Tags", t: "dec", delta: 7 },
      { l: "Current", t: "total", value: 238 },
    ],
    read: "Value throughput is down INR 10Cr period-on-period; dormancy movement alone contributed a INR 31Cr drag.",
  },
  revenue: {
    label: "Fee Revenue",
    unit: "L",
    steps: [
      { l: "Opening", t: "total", value: 168 },
      { l: "New Activations", t: "inc", delta: 14 },
      { l: "Reactivated", t: "inc", delta: 4 },
      { l: "Dormant Shift", t: "dec", delta: 19 },
      { l: "Closed Tags", t: "dec", delta: 12 },
      { l: "Current", t: "total", value: 155 },
    ],
    read: "Fee revenue closed at INR 155L. Closed-tag churn remains the biggest pressure on recurring monetization.",
  },
};

/** Wallet float bridge — cash entering vs leaving the FASTag book (HoB view). */
export const cashFlow = {
  periodLabel: "Last 7 days · issuer book",
  kpis: {
    openingFloatCr: 842,
    cashInCr: 186,
    cashOutCr: 210,
    closingFloatCr: 818,
    netFloatCr: -24,
    rechargeSuccessPct: 94.2,
    avgFloatDays: 3.8,
  },
  inflows: [
    { label: "UPI / app recharge", amountCr: 98.4, wowPct: 12 },
    { label: "Corporate & fleet loads", amountCr: 41.8, wowPct: 8 },
    { label: "Annual pass & top-ups", amountCr: 28.6, wowPct: 31 },
    { label: "Plaza / dealer cash load", amountCr: 12.2, wowPct: -4 },
    { label: "Security deposit (new tag)", amountCr: 5.0, wowPct: 2 },
  ],
  outflows: [
    { label: "Toll plaza debits (NETC)", amountCr: 171.6, wowPct: 3 },
    { label: "Refunds & chargebacks", amountCr: 21.8, wowPct: 48 },
    { label: "Issuer fees & adjustments", amountCr: 9.4, wowPct: 1 },
    { label: "Tag closure payout", amountCr: 4.2, wowPct: -6 },
    { label: "Failed-txn reversals", amountCr: 3.0, wowPct: 22 },
  ],
  /** First four calendar weeks of the selected month (labels applied in period-data). */
  weeklyTrend: [
    { label: "W1", inCr: 178, outCr: 185 },
    { label: "W2", inCr: 182, outCr: 190 },
    { label: "W3", inCr: 175, outCr: 198 },
    { label: "W4", inCr: 186, outCr: 210 },
  ],
  read: "Cash out ran INR 24Cr ahead of cash in this week. Toll debits are steady, but refunds (+48% WoW) and recharge settlement lag are compressing wallet float — prioritize UPI gateway stability and double-deduction remediation.",
} as const;

export const channels = [
  { name: "Online", issued: 38_000, activation: 88, txnValueCr: 2.8, dormancy: 9 },
  { name: "Corporate", issued: 12_000, activation: 92, txnValueCr: 4.1, dormancy: 7 },
  { name: "Fleet", issued: 9_000, activation: 91, txnValueCr: 3.6, dormancy: 8 },
  { name: "Branch", issued: 52_000, activation: 79, txnValueCr: 2.1, dormancy: 14 },
  { name: "Toll Plaza", issued: 44_000, activation: 71, txnValueCr: 1.9, dormancy: 17 },
  { name: "Partner", issued: 95_000, activation: 54, txnValueCr: 2.4, dormancy: 27 },
  { name: "Dealer", issued: 71_000, activation: 49, txnValueCr: 1.5, dormancy: 31 },
] as const;

export type AcquisitionModeId = "digital" | "physical" | "assisted";
export type GrowthSignal = "scale" | "protect" | "improve";

export type AcquisitionSubChannel = {
  id: string;
  label: string;
  sharePct: number;
  activations: number;
  activationRate: number;
  firstTxn30d: number;
  revPerTag: number;
  wowPct: number;
  growthScore: number;
  signal: GrowthSignal;
};

export type AcquisitionMode = {
  id: AcquisitionModeId;
  label: string;
  color: string;
  sharePct: number;
  activations: number;
  activationRate: number;
  firstTxn30d: number;
  revPerTag: number;
  wowPct: number;
  growthScore: number;
  signal: GrowthSignal;
  insight: string;
  children: AcquisitionSubChannel[];
};

/** How customers arrive — grouped by Digital / Physical / Assisted (HoB growth lens). */
export const acquisitionChannels = {
  periodLabel: "Last 7 days · new activations",
  totalActivations: 321_000,
  read: "Digital drives 42% of activations with the best activation-to-first-txn path — scale bank app and NETC redirect. Physical volume is high but toll-plaza POS and showroom need quality guardrails. Assisted paths add volume but dealer-assisted still over-indexes on dormant tags.",
  modes: [
    {
      id: "digital",
      label: "Digital",
      color: "#6366f1",
      sharePct: 42,
      activations: 134_820,
      activationRate: 91,
      firstTxn30d: 86,
      revPerTag: 168,
      wowPct: 14,
      growthScore: 88,
      signal: "scale",
      insight: "Self-serve digital paths convert fastest and retain best — prioritize app and payments-app journeys.",
      children: [
        { id: "bank-website", label: "Bank website", sharePct: 12, activations: 38_520, activationRate: 89, firstTxn30d: 84, revPerTag: 152, wowPct: 9, growthScore: 82, signal: "scale" },
        { id: "bank-app", label: "Bank app", sharePct: 18, activations: 57_780, activationRate: 94, firstTxn30d: 90, revPerTag: 186, wowPct: 18, growthScore: 92, signal: "scale" },
        { id: "payments-app", label: "Payments app", sharePct: 8, activations: 25_680, activationRate: 90, firstTxn30d: 85, revPerTag: 164, wowPct: 22, growthScore: 86, signal: "scale" },
        { id: "netc-redirect", label: "NETC redirect", sharePct: 4, activations: 12_840, activationRate: 87, firstTxn30d: 82, revPerTag: 141, wowPct: 11, growthScore: 79, signal: "protect" },
      ],
    },
    {
      id: "physical",
      label: "Physical",
      color: "#f59e0b",
      sharePct: 38,
      activations: 121_980,
      activationRate: 76,
      firstTxn30d: 68,
      revPerTag: 118,
      wowPct: 6,
      growthScore: 71,
      signal: "protect",
      insight: "Branch and plaza footfall bring volume — tighten first-txn nudges at point of sale.",
      children: [
        { id: "bank-branch", label: "Bank branch", sharePct: 14, activations: 44_940, activationRate: 81, firstTxn30d: 74, revPerTag: 128, wowPct: 4, growthScore: 74, signal: "protect" },
        { id: "toll-plaza-pos", label: "Toll plaza POS", sharePct: 16, activations: 51_360, activationRate: 72, firstTxn30d: 64, revPerTag: 102, wowPct: 7, growthScore: 68, signal: "improve" },
        { id: "dealer-showroom", label: "Dealer showroom", sharePct: 8, activations: 25_680, activationRate: 74, firstTxn30d: 66, revPerTag: 112, wowPct: 5, growthScore: 70, signal: "protect" },
      ],
    },
    {
      id: "assisted",
      label: "Assisted",
      color: "#10b981",
      sharePct: 20,
      activations: 64_200,
      activationRate: 58,
      firstTxn30d: 49,
      revPerTag: 72,
      wowPct: 3,
      growthScore: 54,
      signal: "improve",
      insight: "Assisted channels inflate issuance — dealer-assisted needs activation coaching before more spend.",
      children: [
        { id: "dealer-assisted", label: "Dealer-assisted", sharePct: 9, activations: 28_890, activationRate: 52, firstTxn30d: 44, revPerTag: 61, wowPct: 2, growthScore: 48, signal: "improve" },
        { id: "agent-assisted", label: "Agent-assisted", sharePct: 6, activations: 19_260, activationRate: 61, firstTxn30d: 52, revPerTag: 78, wowPct: 4, growthScore: 58, signal: "improve" },
        { id: "care-assisted", label: "Customer care / support-assisted", sharePct: 5, activations: 16_050, activationRate: 64, firstTxn30d: 55, revPerTag: 84, wowPct: 6, growthScore: 62, signal: "protect" },
      ],
    },
  ] satisfies AcquisitionMode[],
} as const;

export const zones = [
  { name: "South", hub: "BLR · CHN · HYD", txnValueCr: 6.2, dormancy: "Low", status: "Scale further", rag: "green" },
  { name: "West", hub: "MUM · PUN · AHM", txnValueCr: 5.8, dormancy: "Med-High", status: "Protect value", rag: "amber" },
  { name: "North", hub: "DEL · JAI · LKO", txnValueCr: 4.4, dormancy: "High", status: "Improve activation", rag: "red" },
  { name: "East", hub: "KOL · BBS", txnValueCr: 2.9, dormancy: "Medium", status: "Build base", rag: "amber" },
  { name: "Central", hub: "BHO · NAG", txnValueCr: 2.1, dormancy: "High", status: "Revisit strategy", rag: "red" },
] as const;

export const leakage = {
  steps: [
    { l: "Expected Revenue", t: "total" as const, value: 210 },
    { l: "Dormant Tags", t: "dec" as const, delta: 18 },
    { l: "Recharge Failures", t: "dec" as const, delta: 9 },
    { l: "Failed Txns", t: "dec" as const, delta: 6 },
    { l: "Fleet Inactivity", t: "dec" as const, delta: 22 },
    { l: "Actual Revenue", t: "total" as const, value: 155 },
  ],
  opportunities: [
    { area: "Fleet inactivity", impact: "INR 22L", affected: "12 accounts", priority: "CRITICAL", action: "Dedicated RM follow-up and re-onboarding" },
    { area: "Dormant tags", impact: "INR 18L", affected: "12,400 users", priority: "HIGH", action: "Targeted reactivation campaign" },
    { area: "Recharge failures", impact: "INR 9L", affected: "4,800 users", priority: "HIGH", action: "Payment-flow and gateway fix" },
    { area: "Failed transactions", impact: "INR 6L", affected: "3,100 users", priority: "MEDIUM", action: "Retry logic and routing improvement" },
  ],
};
