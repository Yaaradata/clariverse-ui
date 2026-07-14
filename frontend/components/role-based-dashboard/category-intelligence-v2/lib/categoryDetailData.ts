export type SummaryInsight = {
  severity: "critical" | "high" | "medium";
  title: string;
  body: string;
};

export type DetailKpi = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
};

/* ── Profitability ─────────────────────────────────────────────
 * Spend-vs-revenue pool: marketplace revenue = 100%.
 * Returns 24% + CAC 21% + opex 55% + over 3.7% = 103.7% → contribution −₹39.6 Cr.
 */

export const PROFITABILITY_KPIS: DetailKpi[] = [
  { label: "Marketplace rev", value: "₹1,058 Cr", sub: "Revenue pool = 100%" },
  { label: "Spend / revenue", value: "103.7%", sub: "Crosses the line", accent: "#FF6B6B" },
  { label: "Returns cost", value: "₹258 Cr", sub: "24% of revenue", accent: "#E8A23D" },
  { label: "Contribution", value: "−₹39.6 Cr", sub: "Below zero", accent: "#F0606B" },
];

/** Horizontal spend bar vs marketplace revenue line. */
export const SPEND_VS_REVENUE = {
  revenuePoolCr: 1058,
  spendPctOfRevenue: 103.7,
  contributionCr: -39.6,
  returnsAndCacShareOfSpend: 46,
  segments: [
    { id: "returns", label: "Returns", pctOfRevenue: 24, legendPct: 24, amountCr: 258, color: "#E8A23D" },
    { id: "cac", label: "CAC", pctOfRevenue: 21, legendPct: 21, amountCr: 224, color: "#8B7CF6" },
    /** Legend shows ~58% opex load (55 under-line + 3.7 over). */
    { id: "opex", label: "Other opex", pctOfRevenue: 55, legendPct: 58, amountCr: 582, color: "#5B6478" },
    { id: "over", label: "Over the line", pctOfRevenue: 3.7, legendPct: null, amountCr: 39, color: "#E879A0", hatched: true },
  ],
} as const;

/** Drivers behind each spend-bar segment — shown when the bar is clicked. */
export const SPEND_SEGMENT_BREAKDOWN: Record<
  (typeof SPEND_VS_REVENUE.segments)[number]["id"],
  { label: string; amountCr: number; sharePct: number; note: string }[]
> = {
  returns: [
    { label: "Fashion sizing", amountCr: 148, sharePct: 57, note: "Aura shirt + apparel chart gaps" },
    { label: "Electronics DOA", amountCr: 62, sharePct: 24, note: "Seller QC failures on inbound" },
    { label: "Home mismatch", amountCr: 48, sharePct: 19, note: "Fit / colour expectation miss" },
  ],
  cac: [
    { label: "Paid acquisition", amountCr: 118, sharePct: 53, note: "ROAS below band on Fashion" },
    { label: "Promo / weekend", amountCr: 64, sharePct: 29, note: "Discount-led traffic, weak contribution" },
    { label: "Retargeting", amountCr: 42, sharePct: 18, note: "High frequency, low conversion lift" },
  ],
  opex: [
    { label: "Fulfilment & last-mile", amountCr: 246, sharePct: 42, note: "Cost-to-serve on high-return lanes" },
    { label: "Platform & tech", amountCr: 174, sharePct: 30, note: "Fixed + variable infra load" },
    { label: "Seller / content ops", amountCr: 162, sharePct: 28, note: "Catalogue, PIM, support overhead" },
  ],
  over: [
    { label: "Returns overage", amountCr: 18, sharePct: 46, note: "Fashion returns past plan band" },
    { label: "CAC overage", amountCr: 14, sharePct: 36, note: "Acquisition spend not earning" },
    { label: "Opex spill", amountCr: 7, sharePct: 18, note: "Reverse logistics on RTO spikes" },
  ],
};

export type SpendMetricTone = "neutral" | "positive" | "warn" | "critical";

export type SpendMetricCard = {
  id: string;
  label: string;
  value: string;
  valueColor?: string;
  delta: string;
  deltaTone: "up-good" | "up-bad" | "down-good" | "down-bad";
  barPct: number;
  barColor: string;
  barLabel: string;
  detail: string;
  /** Trailing hatch share on the metric bar (e.g. returned % of GMV). */
  barHatchPct?: number;
  barHatchColor?: string;
};

export const SPEND_METRIC_CARDS: SpendMetricCard[] = [
  {
    id: "gmv",
    label: "GMV",
    value: "₹9,020 Cr",
    delta: "▲ 3.2%",
    deltaTone: "up-good",
    barPct: 100,
    barColor: "#7DD3FC",
    barLabel: "100%",
    detail: "Gross demand · funnel top",
  },
  {
    id: "nmv",
    label: "Net of returns",
    value: "₹7,700 Cr",
    delta: "▲ 3.6%",
    deltaTone: "up-good",
    barPct: 85,
    barColor: "#4FD17A",
    barLabel: "85%",
    detail: "14.6% returned to shelf",
    barHatchPct: 15,
    barHatchColor: "#8B6914",
  },
  {
    id: "marketplace",
    label: "Marketplace rev",
    value: "₹1,058 Cr",
    delta: "▲ 2.9%",
    deltaTone: "up-good",
    barPct: 11.7,
    barColor: "#4FD17A",
    barLabel: "11.7%",
    detail: "Take rate on GMV",
  },
  {
    id: "returns",
    label: "Returns cost",
    value: "₹258 Cr",
    valueColor: "#E8A23D",
    delta: "▲ ₹9.4 Cr",
    deltaTone: "up-bad",
    barPct: 24,
    barColor: "#E8A23D",
    barLabel: "24%",
    detail: "Of revenue",
  },
  {
    id: "cac",
    label: "Total CAC",
    value: "₹224 Cr",
    valueColor: "#8B7CF6",
    delta: "▲ ₹14.0 Cr",
    deltaTone: "up-bad",
    barPct: 21,
    barColor: "#8B7CF6",
    barLabel: "21%",
    detail: "Of revenue",
  },
  {
    id: "contribution",
    label: "Contribution",
    value: "−₹39.6 Cr",
    valueColor: "#E879A0",
    delta: "▲ ₹11.2 Cr",
    deltaTone: "up-bad",
    barPct: 3.7,
    barColor: "#E879A0",
    barLabel: "−0.5%",
    detail: "Margin of NMV · below zero",
  },
];

/** Demand cascade steps + leakage between stages + AI takeaways. */
export const DEMAND_CASCADE = {
  headline: "GMV → net → take rate",
  gmvCr: 9020,
  nmvCr: 7700,
  marketplaceCr: 1058,
  returnLeakCr: 1320,
  returnLeakPct: 14.6,
  takeRatePct: 11.7,
  takeOnNmvPct: 13.7,
  steps: [
    {
      id: "gmv",
      label: "GMV",
      value: "₹9,020 Cr",
      delta: "▲ 3.2%",
      deltaTone: "up-good" as const,
      barPct: 100,
      barColor: "#7DD3FC",
      shareLabel: "100% of demand",
      detail: "Gross merchandise · all categories MTD",
      signal: "Demand is growing, but conversion to contribution is not.",
    },
    {
      id: "nmv",
      label: "Net of returns",
      value: "₹7,700 Cr",
      delta: "▲ 3.6%",
      deltaTone: "up-good" as const,
      barPct: 85.4,
      barColor: "#4FD17A",
      barHatchPct: 14.6,
      barHatchColor: "#8B6914",
      shareLabel: "85.4% of GMV",
      detail: "₹1,320 Cr returned to shelf · Fashion leads leakage",
      signal: "Return leak is the largest cut before take-rate economics.",
    },
    {
      id: "marketplace",
      label: "Marketplace rev",
      value: "₹1,058 Cr",
      delta: "▲ 2.9%",
      deltaTone: "up-good" as const,
      barPct: 11.7,
      barColor: "#4FD17A",
      shareLabel: "11.7% take on GMV",
      detail: "13.7% of NMV · commission + ads on delivered value",
      signal: "Take rate holds, but spend already exceeds this pool.",
    },
  ],
  leaks: [
    {
      id: "return-leak",
      label: "Return leakage",
      from: "GMV",
      to: "Net of returns",
      amount: "₹1,320 Cr",
      pct: "14.6%",
      tone: "warn" as const,
      note: "Fashion sizing + RTO inflate reverse cost into the spend dial.",
    },
    {
      id: "take-capture",
      label: "Take-rate capture",
      from: "Net of returns",
      to: "Marketplace rev",
      amount: "₹1,058 Cr",
      pct: "13.7% of NMV",
      tone: "neutral" as const,
      note: "Only this pool funds returns cost, CAC, and opex.",
    },
  ],
  insights: [
    {
      severity: "critical" as const,
      title: "14.6% of GMV never becomes NMV",
      body: "₹1,320 Cr returns to shelf before take rate — Fashion sizing is the fixable cluster.",
    },
    {
      severity: "high" as const,
      title: "Take rate cannot fund current spend",
      body: "Marketplace rev ₹1,058 Cr is the 100% pool; spend already runs to 103.7% of it.",
    },
    {
      severity: "medium" as const,
      title: "Next best action",
      body: "Cut return leak first — every point of Fashion return rate recovered expands the revenue pool before CAC cuts.",
    },
  ],
};

export const GAP_TOTAL_LAKHS = 18;

export const GAP_DRIVERS = [
  { driver: "Returns", pct: 70, rupee: "₹12.6L", lakhs: 12.6, fill: "#F0606B" },
  { driver: "Logistics", pct: 18, rupee: "₹3.2L", lakhs: 3.2, fill: "#E8A23D" },
  { driver: "Promo / CAC", pct: 12, rupee: "₹2.2L", lakhs: 2.2, fill: "#8B7CF6" },
] as const;

export const GAP_DRIVER_BREAKDOWN: Record<
  (typeof GAP_DRIVERS)[number]["driver"],
  { label: string; lakhs: number; fill: string }[]
> = {
  Returns: [
    { label: "Fashion sizing", lakhs: 8.8, fill: "#F0606B" },
    { label: "Electronics DOA", lakhs: 2.2, fill: "#E8A23D" },
    { label: "Home mismatch", lakhs: 1.6, fill: "#8B7CF6" },
  ],
  Logistics: [
    { label: "Reverse pickup", lakhs: 2.0, fill: "#E8A23D" },
    { label: "Last-mile RTO", lakhs: 1.2, fill: "#F6A93B" },
  ],
  "Promo / CAC": [
    { label: "Weekend promo ROAS", lakhs: 1.4, fill: "#8B7CF6" },
    { label: "Paid acquisition CAC", lakhs: 0.8, fill: "#A78BFA" },
  ],
};

export type SubCategoryRow = {
  name: string;
  contribution: number;
  plan: number;
  returnRate: number;
  /** Blended CAC attributed to sub-category, ₹ lakhs */
  cacLakhs: number;
  status: "breach" | "watch" | "ok";
};

/** Actuals sum ₹2.42 Cr · plans sum ₹2.60 Cr · CAC sums ₹6.0L */
export const SUBCATEGORY_PERFORMANCE: SubCategoryRow[] = [
  { name: "Fashion", contribution: 0.92, plan: 1.05, returnRate: 31, cacLakhs: 2.8, status: "breach" },
  { name: "Grocery", contribution: 0.78, plan: 0.76, returnRate: 8, cacLakhs: 1.1, status: "ok" },
  { name: "Electronics", contribution: 0.45, plan: 0.48, returnRate: 14, cacLakhs: 1.4, status: "watch" },
  { name: "Home", contribution: 0.27, plan: 0.31, returnRate: 11, cacLakhs: 0.7, status: "watch" },
];

/** 318 − 48 − 14 − 8 − 6 = 242 (₹ lakhs) */
export const PNL_BRIDGE = [
  { step: "Gross GMV", value: 318, type: "start" as const },
  { step: "Returns", value: -48, type: "neg" as const },
  { step: "Rev. logistics", value: -14, type: "neg" as const },
  { step: "Discounts", value: -8, type: "neg" as const },
  { step: "Blended CAC", value: -6, type: "neg" as const },
  { step: "Contribution", value: 242, type: "end" as const },
];

export const PROFITABILITY_INSIGHTS: SummaryInsight[] = [
  {
    severity: "critical",
    title: "Spend crosses the revenue line — contribution −₹39.6 Cr",
    body: "Spend is 103.7% of marketplace revenue (₹1,058 Cr). Returns + CAC are 46% of that spend.",
  },
  {
    severity: "high",
    title: "Returns cost ₹258 Cr (24% of revenue)",
    body: "▲ ₹9.4 Cr vs prior — the largest single drag past the revenue line.",
  },
  {
    severity: "medium",
    title: "CAC ₹224 Cr and rising",
    body: "▲ ₹14.0 Cr — acquisition spend is not earning enough contribution to stay under 100%.",
  },
  {
    severity: "medium",
    title: "Next best action",
    body: "Cut Fashion promo CAC and fix return clusters before the next demand wave.",
  },
];

/* ── Returns ─────────────────────────────────────────────────── */

export const RETURNS_KPIS: DetailKpi[] = [
  { label: "Recoverable", value: "₹6.0L", sub: "This week", accent: "#8B7CF6" },
  { label: "Return rate", value: "31%", sub: "Band 22%", accent: "#FF6B6B" },
  { label: "Fixable share", value: "36%", sub: "Of excess returns" },
  { label: "Units affected", value: "~600", sub: "Fixable cohort" },
];

export const RETURN_RATE_TREND = [
  { week: "W-5", rate: 22, band: 22 },
  { week: "W-4", rate: 23, band: 22 },
  { week: "W-3", rate: 25, band: 22 },
  { week: "W-2", rate: 27, band: 22 },
  { week: "W-1", rate: 29, band: 22 },
  { week: "Now", rate: 31, band: 22 },
];

export const RETURN_CAUSE_CHART = [
  { label: "Buyer remorse", pct: 64, fill: "#6B7280" },
  { label: "Fixable sizing", pct: 28, fill: "#8B7CF6" },
  { label: "Quality", pct: 5, fill: "#F6A93B" },
  { label: "Other", pct: 3, fill: "#4B5563" },
];

export const RECOVERABLE_BUILDUP = [
  { label: "Excess units", value: 1860 },
  { label: "Fixable share", value: 36 },
  { label: "Unit contrib.", value: 890 },
  { label: "Recoverable", value: 600000 },
];

export const RETURNS_INSIGHTS: SummaryInsight[] = [
  {
    severity: "critical",
    title: "Chart mismatch — not buyer remorse",
    body: "Core sizes dominate sizing returns; category chart measurements understate actual fit.",
  },
  {
    severity: "high",
    title: "Highest-ROI fix this week",
    body: "PIM remap drafted — Catalogue owns publish; Seller-Brand route ready.",
  },
  {
    severity: "medium",
    title: "Hold buyer-intent bucket",
    body: "64% remorse returns stay out of the recoverable calculation.",
  },
  {
    severity: "medium",
    title: "Next best action",
    body: "Publish PIM remap on M–L sizes and surface fit advisory before weekend traffic.",
  },
];

export type PimCorrectionStepStatus = "done" | "pending";

export const PIM_CORRECTION_STEPS: {
  step: string;
  when: string;
  owner: string;
  status: PimCorrectionStepStatus;
}[] = [
  { step: "Voice flagged", when: "Tue 09:40", owner: "LiSN", status: "done" },
  { step: "PIM diff drafted", when: "Wed 11:00", owner: "Catalogue", status: "done" },
  { step: "Seller notified", when: "Pending", owner: "Seller-Brand", status: "pending" },
];

export type ReturnsEvidenceChannel = "voice" | "chat" | "email";

export type ReturnsChannelEvidenceItem = {
  quote: string;
  meta: string;
};

export type ReturnsChannelEvidence = {
  channel: ReturnsEvidenceChannel;
  label: string;
  count: number;
  sharePct: number;
  color: string;
  theme: string;
  items: ReturnsChannelEvidenceItem[];
};

export const RETURNS_CHANNEL_EVIDENCE: ReturnsChannelEvidence[] = [
  {
    channel: "voice",
    label: "Voice",
    count: 42,
    sharePct: 58,
    color: "#8B7CF6",
    theme: "Return calls · sizing language",
    items: [
      {
        quote: "Chest feels narrow vs the size chart — ordered M, fits like S.",
        meta: "Return IVR · Tue 09:40 · 2m 14s",
      },
      {
        quote: "Chart says 40 inch chest, garment measures about 37.",
        meta: "Outbound care call · Wed 10:22 · 3m 02s",
      },
    ],
  },
  {
    channel: "chat",
    label: "Chat",
    count: 28,
    sharePct: 32,
    color: "#4FD17A",
    theme: "In-app care · return initiation",
    items: [
      {
        quote: "Size M is too tight on chest — your chart shows 40 in but this feels like 37.",
        meta: "Care chat · Size return · Tue 11:15",
      },
      {
        quote: "Want exchange for L but worried same issue — measurements don't match label.",
        meta: "Care chat · Exchange request · Tue 14:08",
      },
    ],
  },
  {
    channel: "email",
    label: "Email",
    count: 11,
    sharePct: 10,
    color: "#E8A23D",
    theme: "Return requests · written reason",
    items: [
      {
        quote: "Fabric quality fine but sizing off by ~2 cm on chest — attaching photos.",
        meta: "Return email · Tue 16:44",
      },
      {
        quote: "Returning — size chart inaccurate vs garment measurements across sizes.",
        meta: "Return email · Wed 08:30",
      },
    ],
  },
];

/* ── Seller trust ────────────────────────────────────────────── */

export const SELLER_KPIS: DetailKpi[] = [
  { label: "At-risk GMV", value: "₹60L", sub: "4 sellers", accent: "#F6A93B" },
  { label: "Top exposure", value: "QuickStyle", sub: "₹22L GMV" },
  { label: "Concentration", value: "23%", sub: "25% FDI cap" },
  { label: "Conduct flag", value: "Active", sub: "Cancel-after-wait", accent: "#FF6B6B" },
];

export const SELLER_EXPOSURE = [
  { seller: "QuickStyle", gmv: 22, complaints: 48, trust: 42, fill: "#FF6B6B", cluster: "Cancel-after-wait", concentrationPct: 23 },
  { seller: "TrendForge", gmv: 18, complaints: 31, trust: 58, fill: "#F6A93B", cluster: "Sizing dispute", concentrationPct: 19 },
  { seller: "MetroEx", gmv: 12, complaints: 22, trust: 64, fill: "#8B7CF6", cluster: "Late dispatch", concentrationPct: 12 },
  { seller: "UrbanWeave", gmv: 8, complaints: 15, trust: 55, fill: "#4FD17A", cluster: "Quality / packaging", concentrationPct: 8 },
];

export const SELLER_GMV_AT_RISK_LAKHS = 60;
export const SELLER_FDI_CAP_PCT = 25;
export const SELLER_TOP_CONCENTRATION_PCT = 23;

export type SellerCoachingStepStatus = "done" | "pending";

export const SELLER_COACHING_STEPS: {
  step: string;
  when: string;
  owner: string;
  status: SellerCoachingStepStatus;
}[] = [
  { step: "Voice flagged", when: "Mon 08:15", owner: "LiSN", status: "done" },
  { step: "Coaching draft", when: "Tue 14:30", owner: "Seller-Brand", status: "done" },
  { step: "Script sent", when: "Pending", owner: "QuickStyle", status: "pending" },
];

export const SELLER_CHANNEL_EVIDENCE: ReturnsChannelEvidence[] = [
  {
    channel: "voice",
    label: "Voice",
    count: 34,
    sharePct: 52,
    color: "#8B7CF6",
    theme: "Care calls · cancel-after-wait",
    items: [
      {
        quote: "Cancelled after I waited 3 days for dispatch.",
        meta: "Care IVR · Mon 08:15 · 1m 48s",
      },
      {
        quote: "Seller accepted order then cancelled — no explanation.",
        meta: "Outbound care · Tue 09:22 · 2m 31s",
      },
    ],
  },
  {
    channel: "chat",
    label: "Chat",
    count: 22,
    sharePct: 31,
    color: "#4FD17A",
    theme: "In-app care · order status",
    items: [
      {
        quote: "Why was my order cancelled after waiting? No update for 3 days.",
        meta: "Care chat · Cancel complaint · Mon 11:40",
      },
      {
        quote: "Accepted then cancelled — need this escalated to the seller.",
        meta: "Care chat · Repeat contact · Tue 10:05",
      },
    ],
  },
  {
    channel: "email",
    label: "Email",
    count: 11,
    sharePct: 17,
    color: "#F6A93B",
    theme: "Reviews · seller conduct",
    items: [
      {
        quote: "Accepted my order, kept me waiting, then cancelled without reason.",
        meta: "Product review · QuickStyle · Mon 18:20",
      },
      {
        quote: "Third time this month — dispatch SLA clearly not met.",
        meta: "Escalation email · Tue 08:55",
      },
    ],
  },
];

export const SELLER_TRUST_TREND = [
  { week: "W-5", quickStyle: 72, category: 78 },
  { week: "W-4", quickStyle: 68, category: 77 },
  { week: "W-3", quickStyle: 58, category: 76 },
  { week: "W-2", quickStyle: 52, category: 75 },
  { week: "W-1", quickStyle: 46, category: 74 },
  { week: "Now", quickStyle: 42, category: 73 },
];

export const COMPLAINT_THEMES = [
  { theme: "Cancel-after-wait", quickStyle: 38, trendForge: 12, metroEx: 8 },
  { theme: "Sizing dispute", quickStyle: 6, trendForge: 22, metroEx: 4 },
  { theme: "Late dispatch", quickStyle: 4, trendForge: 8, metroEx: 18 },
];

export const SELLER_INSIGHTS: SummaryInsight[] = [
  {
    severity: "critical",
    title: "Rank by customer-backed GMV",
    body: "QuickStyle leads at ₹22L — cancel-after-wait clusters in care + reviews.",
  },
  {
    severity: "high",
    title: "Coaching draft ready",
    body: "Dispatch SLA script prepared — Seller-Brand owns send within 24h.",
  },
  {
    severity: "medium",
    title: "FDI cap check passed",
    body: "23% concentration within 25% non-discrimination threshold.",
  },
  {
    severity: "medium",
    title: "Next best action",
    body: "Send coaching script to QuickStyle before weekend dispatch window.",
  },
];
