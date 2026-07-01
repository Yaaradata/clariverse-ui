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

/* ── Profitability ───────────────────────────────────────────── */

export const PROFITABILITY_KPIS: DetailKpi[] = [
  { label: "Contribution", value: "₹2.42 Cr", sub: "This week" },
  { label: "vs plan", value: "68%", sub: "▼ 12 pts", accent: "#FF6B6B" },
  { label: "Gap", value: "₹18L", sub: "vs last week", accent: "#FF6B6B" },
  { label: "Gross GMV", value: "₹3.18 Cr", sub: "Before deductions" },
];

export const CONTRIBUTION_TREND = [
  { week: "W-5", actual: 2.58, plan: 2.6 },
  { week: "W-4", actual: 2.55, plan: 2.6 },
  { week: "W-3", actual: 2.52, plan: 2.58 },
  { week: "W-2", actual: 2.48, plan: 2.55 },
  { week: "W-1", actual: 2.45, plan: 2.52 },
  { week: "Now", actual: 2.42, plan: 2.6 },
];

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
    { label: "Fashion", lakhs: 8.8, fill: "#F0606B" },
    { label: "Electronics", lakhs: 2.2, fill: "#E8A23D" },
    { label: "Home", lakhs: 1.6, fill: "#8B7CF6" },
  ],
  Logistics: [
    { label: "Reverse pickup", lakhs: 2.0, fill: "#E8A23D" },
    { label: "Last-mile", lakhs: 1.2, fill: "#F6A93B" },
  ],
  "Promo / CAC": [
    { label: "Weekend promo", lakhs: 1.4, fill: "#8B7CF6" },
    { label: "Blended CAC", lakhs: 0.8, fill: "#4FD17A" },
  ],
};

export const SUBCATEGORY_PERFORMANCE = [
  { name: "Fashion", contribution: 0.92, plan: 1.05, returnRate: 31, status: "breach" as const },
  { name: "Grocery", contribution: 0.78, plan: 0.76, returnRate: 8, status: "ok" as const },
  { name: "Electronics", contribution: 0.45, plan: 0.48, returnRate: 14, status: "watch" as const },
  { name: "Home", contribution: 0.27, plan: 0.26, returnRate: 11, status: "ok" as const },
];

export const PNL_BRIDGE = [
  { step: "Gross GMV", value: 318, type: "start" as const },
  { step: "Returns", value: -48, type: "neg" as const },
  { step: "Logistics", value: -22, type: "neg" as const },
  { step: "Discounts", value: -18, type: "neg" as const },
  { step: "CAC", value: -12, type: "neg" as const },
  { step: "Contribution", value: 242, type: "end" as const },
];

export const PROFITABILITY_INSIGHTS: SummaryInsight[] = [
  {
    severity: "critical",
    title: "Returns explain most of the ₹18L gap",
    body: "Fashion sub-category drives 70% of the shortfall — Aura shirt is the largest fixable SKU.",
  },
  {
    severity: "high",
    title: "Contribution ≠ gross GMV",
    body: "Headline is net of returns, reverse logistics, discounts, and blended CAC.",
  },
  {
    severity: "medium",
    title: "Grocery holds plan",
    body: "Fill-rate and promo ROAS in band — protect stable sub-category spend.",
  },
  {
    severity: "medium",
    title: "Next best action",
    body: "Fix Aura sizing chart before the weekend promo wave.",
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
