import type { ConfidenceBand } from "./cxHeadRetailData";

/** Base-wide happy rate — all shoppers. Never recompute on HV-only. */
export const HAPPINESS_BASE_WIDE = {
  happyRate: 63,
  contactsScored: "62.1K",
  measuredSharePct: 72,
  inferredSharePct: 28,
  confidence: "Med-High" as ConfidenceBand,
  note: "Base-wide across all shoppers — Plus and mass. Not filtered to high-value.",
} as const;

export type ValueLens = "hv" | "lv";

export type ValueReachCell = {
  id: string;
  value: "hv" | "lv";
  reach: "low" | "high";
  title: string;
  action: string;
  detail: string;
  shoppers: string;
  gmvAtRisk: string;
};

/** Value × reach 2×2 — HV leads action; LV is managed, never dropped. */
export const VALUE_REACH_CELLS: ValueReachCell[] = [
  {
    id: "hv-low",
    value: "hv",
    reach: "low",
    title: "White-glove recovery",
    action: "Personal outreach · Plus retention desk",
    detail: "High-GMV / Plus with low social amplification — recover privately before cancel.",
    shoppers: "284 Plus · 1.1K high-GMV",
    gmvAtRisk: "₹18.4 Cr",
  },
  {
    id: "hv-high",
    value: "hv",
    reach: "high",
    title: "Top priority",
    action: "Executive war-room · public + private recovery",
    detail: "High-value shoppers with review/social virality — act first; blast radius is material.",
    shoppers: "96 Plus · viral review cluster",
    gmvAtRisk: "₹24.8 Cr",
  },
  {
    id: "lv-low",
    value: "lv",
    reach: "low",
    title: "Automate / Deflect",
    action: "Bot + self-serve · no agent queue by default",
    detail: "Mass volume, low influence — contain with automation; do not drop from the base-wide view.",
    shoppers: "4.2K standard",
    gmvAtRisk: "₹3.1 Cr",
  },
  {
    id: "lv-high",
    value: "lv",
    reach: "high",
    title: "Watch — viral / detractor signal",
    action: "Social listen · suppress brigading · route if spreads",
    detail: "Low-value but high reach — manage as a signal; never remove from the operating picture.",
    shoppers: "620 · X / review amplifiers",
    gmvAtRisk: "₹6.2 Cr",
  },
];

/** Segment knowledge table — ranked by revenue at risk (GMV Cr × churn %) in the hub table. */
export type HappinessSegmentKey =
  | "active"
  | "occasional"
  | "loyal"
  | "seasonal"
  | "reactivated"
  | "dormant"
  | "frequent";

export type HappinessSegmentRow = {
  key: HappinessSegmentKey;
  label: string;
  valueLens: ValueLens;
  interactions: number;
  wowDelta: number;
  sentiment: number;
  /** Average order value (₹). */
  aov: number;
  /** Contacts per unit (units, not orders). */
  cpu: number;
  /** Average transaction value (₹). */
  atv: number;
  /** Lifetime value score (0–100) — defines customer lifetime value. */
  ltv: number;
  resolutionRate: number;
  /** Ranking metric — ₹ Cr GMV exposed. */
  gmvAtRiskCr: number;
  color: string;
  /** Supporting CX scores (moved from the left score list into the segment table). */
  csat: number;
  /** Customer effort /5 — lower is better. */
  ease: number;
  churn: number;
  fcr: number;
  retention: number;
  /** Sentiment mix % — must sum to 100. */
  happy: number;
  neutral: number;
  unhappy: number;
  /** Segment-specific AI insight shown when the row is selected. */
  aiInsight: string;
  /** AI insight confidence score (0–100). */
  aiConfidence: number;
};

export const HAPPINESS_SEGMENT_ROWS: HappinessSegmentRow[] = [
  {
    key: "active",
    label: "Active customer",
    valueLens: "lv",
    interactions: 22_571,
    wowDelta: 3.4,
    sentiment: 0.16,
    aov: 1_180,
    cpu: 2.1,
    atv: 1_040,
    ltv: 64,
    resolutionRate: 45,
    gmvAtRiskCr: 22.4,
    color: "#159B94",
    csat: 79,
    ease: 3.4,
    churn: 7.6,
    fcr: 58,
    retention: 86,
    happy: 34,
    neutral: 36,
    unhappy: 30,
    aiInsight:
      "Active buyers drive ~36% of contacts this window with volume still rising — they are the operating centre of CX load. CPU flags first-pass friction on delivery ETA; each miss forces a repeat contact and softens sentiment. Tighten first-pass resolve on delivery ETA before peak sale load, or Active will flood the queue and drag the index.",
    aiConfidence: 86,
  },
  {
    key: "occasional",
    label: "Occasional buyer",
    valueLens: "hv",
    interactions: 11_285,
    wowDelta: -0.6,
    sentiment: 0.03,
    aov: 1_640,
    cpu: 1.4,
    atv: 1_480,
    ltv: 58,
    resolutionRate: 38,
    gmvAtRiskCr: 18.2,
    color: "#3B82C4",
    csat: 76,
    ease: 3.5,
    churn: 8.2,
    fcr: 52,
    retention: 81,
    happy: 28,
    neutral: 34,
    unhappy: 38,
    aiInsight:
      "Occasional buyers are cooling (−0.6%) even while AOV stays healthy at ₹1,640 — value is intact, intent is not. Resolution at 38% is the leak: refund and return cases stall and kill the next-order window. Route Occasional refund/return cases to the priority queue now to protect the next purchase before they go quiet.",
    aiConfidence: 81,
  },
  {
    key: "loyal",
    label: "Loyal customer",
    valueLens: "hv",
    interactions: 9_673,
    wowDelta: 2.1,
    sentiment: 0.08,
    aov: 2_850,
    cpu: 0.8,
    atv: 2_620,
    ltv: 88,
    resolutionRate: 58,
    gmvAtRiskCr: 42.0,
    color: "#5B4BE0",
    csat: 88,
    ease: 2.6,
    churn: 3.8,
    fcr: 72,
    retention: 96,
    happy: 48,
    neutral: 30,
    unhappy: 22,
    aiInsight:
      "Loyal customers hold ₹42 Cr GMV exposed with the best AOV (₹2,850) and lowest CPU (0.8) in the base. A single refund SLA miss here turns high-value advocates into silence faster than any other segment. Guard refund SLA for Loyal with white-glove handling this week — no exceptions on delayed credit or pickup.",
    aiConfidence: 92,
  },
  {
    key: "seasonal",
    label: "Seasonal buyer",
    valueLens: "lv",
    interactions: 4_837,
    wowDelta: 0.8,
    sentiment: 0.05,
    aov: 1_420,
    cpu: 1.6,
    atv: 1_290,
    ltv: 52,
    resolutionRate: 34,
    gmvAtRiskCr: 12.1,
    color: "#7A8BD0",
    csat: 74,
    ease: 3.6,
    churn: 9.1,
    fcr: 48,
    retention: 78,
    happy: 30,
    neutral: 32,
    unhappy: 38,
    aiInsight:
      "Seasonal buyers spike into contact around festival windows (+0.8%) and will do so again on the next sale. ATV at ₹1,290 means the risk is volume and queue load, not margin — unprepared capacity will break FCR. Prep capacity and scripted refund paths before the next sale so Seasonal contacts resolve on first touch.",
    aiConfidence: 78,
  },
  {
    key: "reactivated",
    label: "Reactivated customer",
    valueLens: "hv",
    interactions: 2_687,
    wowDelta: 4.2,
    sentiment: 0.11,
    aov: 1_980,
    cpu: 1.1,
    atv: 1_760,
    ltv: 72,
    resolutionRate: 51,
    gmvAtRiskCr: 14.8,
    color: "#3AA97A",
    csat: 84,
    ease: 2.9,
    churn: 5.4,
    fcr: 66,
    retention: 90,
    happy: 40,
    neutral: 33,
    unhappy: 27,
    aiInsight:
      "Reactivated shoppers are the fastest-growing cohort (+4.2%) with a strong ATV of ₹1,760 — the win is real. First-week friction after return is what pushes them dormant again and wastes the reactivation spend. Lock the win with post-purchase nurture within 7 days of return — before first-week friction undoes it.",
    aiConfidence: 84,
  },
  {
    key: "dormant",
    label: "Dormant customer",
    valueLens: "lv",
    interactions: 3_210,
    wowDelta: -0.3,
    sentiment: -0.12,
    aov: 980,
    cpu: 0.4,
    atv: 860,
    ltv: 34,
    resolutionRate: 29,
    gmvAtRiskCr: 6.4,
    color: "#94A0B2",
    csat: 61,
    ease: 4.1,
    churn: 14.2,
    fcr: 36,
    retention: 62,
    happy: 18,
    neutral: 28,
    unhappy: 54,
    aiInsight:
      "Dormant customers stay quiet on contacts but land 54% unhappy when they do engage — sentiment is toxic on contact. GMV exposure is low versus Active and Occasional, so burning CX capacity here has a poor return. Use light-touch win-back only; keep voice and chat capacity on Active and Occasional until those queues clear.",
    aiConfidence: 74,
  },
  {
    key: "frequent",
    label: "Frequent buyer",
    valueLens: "lv",
    interactions: 7_840,
    wowDelta: 1.6,
    sentiment: 0.09,
    aov: 1_520,
    cpu: 1.3,
    atv: 1_380,
    ltv: 68,
    resolutionRate: 47,
    gmvAtRiskCr: 16.5,
    color: "#0D9488",
    csat: 81,
    ease: 3.1,
    churn: 6.2,
    fcr: 61,
    retention: 89,
    happy: 36,
    neutral: 34,
    unhappy: 30,
    aiInsight:
      "Frequent buyers still keep order cadence, but effort spikes hard whenever delivery ETA slips on the reorder path. One friction hit on ETA or refund status is enough to turn habit into Occasional and cut lifetime frequency. Protect the reorder path now — ETA promises must stick, or Frequent volume will migrate to Occasional.",
    aiConfidence: 83,
  },
];

export function segmentsRankedByGmvAtRisk(
  rows: readonly HappinessSegmentRow[] = HAPPINESS_SEGMENT_ROWS,
): HappinessSegmentRow[] {
  return [...rows].sort((a, b) => b.gmvAtRiskCr - a.gmvAtRiskCr);
}

/**
 * Revenue at risk (₹ Cr) = GMV exposed (₹ Cr) × churn %.
 * Same commercial unit as GMV — ranks by money at risk, not raw churn rate.
 */
export function segmentRevenueAtRiskCr(
  row: Pick<HappinessSegmentRow, "churn" | "gmvAtRiskCr">,
): number {
  return Math.round(row.gmvAtRiskCr * (row.churn / 100) * 100) / 100;
}

/** @deprecated Use segmentRevenueAtRiskCr — kept for call-site migration. */
export function segmentRevenueAtRiskInr(
  row: Pick<HappinessSegmentRow, "churn" | "gmvAtRiskCr" | "ltv" | "interactions">,
): number {
  return segmentRevenueAtRiskCr(row);
}

export function segmentsRankedByRevenueAtRisk(
  rows: readonly HappinessSegmentRow[] = HAPPINESS_SEGMENT_ROWS,
): HappinessSegmentRow[] {
  return [...rows].sort((a, b) => segmentRevenueAtRiskCr(b) - segmentRevenueAtRiskCr(a));
}
