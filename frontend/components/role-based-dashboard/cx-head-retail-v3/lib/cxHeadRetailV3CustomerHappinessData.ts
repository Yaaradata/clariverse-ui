/** Mock data for "Are our customers happy?" — Head of CX command center. */

import type { TrustRangeKey } from "./cxHeadRetailV3TrustBreakdownData";
import type { HappinessSegmentKey, HappinessSegmentRow } from "./cxHeadRetailV3HappinessLensData";
import { HAPPINESS_SEGMENT_ROWS } from "./cxHeadRetailV3HappinessLensData";
import type { FCICluster } from "@/lib/fci-lib/fciData";
import { FLIPKART_FCI_CLUSTERS } from "./cxHeadRetailV3FlipkartFciClusters";

/** Aligns with header timeframe toggles (24H / 7D / 30D). */
export type HappinessPeriodKey = TrustRangeKey;

export type HappinessPeriodMeta = {
  key: HappinessPeriodKey;
  label: string;
  short: string;
  /** Volume scale vs 7D baseline. */
  scale: number;
  /** Delta label shown on KPIs / ACTIVE column. */
  delta: string;
  period: string;
};

export const HAPPINESS_PERIODS: Record<HappinessPeriodKey, HappinessPeriodMeta> = {
  "24H": {
    key: "24H",
    label: "vs previous day",
    short: "24H",
    scale: 0.16,
    delta: "vs prev day",
    period: "last 24 hours",
  },
  "7D": {
    key: "7D",
    label: "vs last week",
    short: "7D",
    scale: 1,
    delta: "WoW",
    period: "this week",
  },
  "30D": {
    key: "30D",
    label: "vs last month",
    short: "30D",
    scale: 3.7,
    delta: "MoM",
    period: "last 30 days",
  },
};

/** Period deltas: spikier on 24H, smoother on 30D vs the 7D baseline. */
export function happinessDeltaMult(range: HappinessPeriodKey): number {
  switch (range) {
    case "24H":
      return 0.42;
    case "7D":
      return 1;
    case "30D":
      return 0.88;
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

export function scaleHappinessCount(n: number, range: HappinessPeriodKey): number {
  return Math.max(0, Math.round(n * HAPPINESS_PERIODS[range].scale));
}

export function scaleHappinessDelta(pct: number, range: HappinessPeriodKey): number {
  return Math.round(pct * happinessDeltaMult(range) * 10) / 10;
}

export function scaleHappinessCr(n: number, range: HappinessPeriodKey): number {
  const scaled = n * HAPPINESS_PERIODS[range].scale;
  if (scaled < 1) return Math.round(scaled * 100) / 100;
  return Math.round(scaled * 10) / 10;
}

export type CompositeDriver = { k: string; w: number; s: number };
export type CohortId = "new" | "repeat" | "plus" | "lapsing";
export type CohortRow = { id: CohortId; name: string; score: number; delta: number; share: number };
export type ExecBand = { shifting: string; magnitude: string; affected: string; doing: string };

export type PeriodSlice = {
  interactions: string;
  /** Numeric contact volume for animated count-up. */
  interactionsN: number;
  headline: {
    score: number;
    delta: number;
    nps: number;
    npsD: number;
    csat: number;
    csatD: number;
    ease: number;
    easeD: number;
    loyalty: number;
    loyaltyD: number;
    churn: number;
    churnD: number;
    repeatPurchase: number;
    repeatD: number;
    /** First-contact resolution %. */
    fcr: number;
    fcrD: number;
    /** Customer retention %. */
    retention: number;
    retentionD: number;
  };
  spark: number[];
  /** NPS trend for headline KPI sparkline. */
  npsSpark: number[];
  /** Repeat-purchase % trend for headline KPI sparkline. */
  repeatSpark: number[];
  /** Loyalty index trend for headline KPI sparkline. */
  loyaltySpark: number[];
  composite: CompositeDriver[];
  cohorts: CohortRow[];
  exec: ExecBand;
};

/** Distinct operating reads per header timeframe — not a simple rescale of one slice. */
export const HAPPINESS_DATA: Record<HappinessPeriodKey, PeriodSlice> = {
  "24H": {
    interactions: "9.9K",
    interactionsN: 9_937,
    headline: {
      score: 66,
      delta: -1.2,
      nps: 44,
      npsD: -2,
      csat: 77,
      csatD: -1.4,
      ease: 3.1,
      easeD: -0.1,
      loyalty: 69,
      loyaltyD: -0.6,
      churn: 7.6,
      churnD: 0.3,
      repeatPurchase: 36,
      repeatD: -0.8,
      fcr: 56,
      fcrD: -1.8,
      retention: 84,
      retentionD: -0.4,
    },
    spark: [68, 67, 66, 65, 66, 64, 65, 66],
    npsSpark: [47, 46, 45, 44, 45, 43, 44, 44],
    repeatSpark: [38, 37, 37, 36, 37, 35, 36, 36],
    loyaltySpark: [70, 70, 69, 69, 70, 68, 69, 69],
    composite: [
      { k: "Product satisfaction", w: 18, s: 78 },
      { k: "Support resolution", w: 20, s: 70 },
      { k: "Delivery experience", w: 28, s: 68 },
      { k: "Overall sentiment", w: 12, s: 61 },
      { k: "Returns & refunds", w: 22, s: 51 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 64, delta: -1, share: 33 },
      { id: "repeat", name: "Repeat", score: 68, delta: 0, share: 37 },
      { id: "plus", name: "Plus / loyal", score: 76, delta: -1, share: 21 },
      { id: "lapsing", name: "Lapsing", score: 42, delta: -3, share: 9 },
    ],
    exec: {
      shifting: "Overnight refund status silence after pickup",
      magnitude: "Refund-linked contacts up 8% vs yesterday; index −1.2 pts in-session",
      affected: "Active + Occasional shoppers contacting after evening pickup",
      doing: "Auto-refund SMS on pickup scan live in 2 hubs tonight",
    },
  },
  "7D": {
    interactions: "62.1K",
    interactionsN: 62_103,
    headline: {
      score: 68,
      delta: 2,
      nps: 46,
      npsD: 3,
      csat: 79,
      csatD: -1,
      ease: 3.2,
      easeD: 0.1,
      loyalty: 71,
      loyaltyD: 1.4,
      churn: 7.3,
      churnD: -0.4,
      repeatPurchase: 38,
      repeatD: 1.2,
      fcr: 58,
      fcrD: 1.1,
      retention: 85,
      retentionD: 0.6,
    },
    spark: [63, 64, 63, 65, 66, 65, 67, 68],
    npsSpark: [42, 43, 42, 44, 45, 44, 45, 46],
    repeatSpark: [35, 36, 35, 36, 37, 37, 38, 38],
    loyaltySpark: [68, 69, 68, 70, 70, 70, 71, 71],
    composite: [
      { k: "Product satisfaction", w: 18, s: 80 },
      { k: "Support resolution", w: 20, s: 72 },
      { k: "Delivery experience", w: 28, s: 71 },
      { k: "Overall sentiment", w: 12, s: 63 },
      { k: "Returns & refunds", w: 22, s: 54 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 66, delta: 1, share: 31 },
      { id: "repeat", name: "Repeat", score: 70, delta: 2, share: 38 },
      { id: "plus", name: "Plus / loyal", score: 77, delta: 0, share: 22 },
      { id: "lapsing", name: "Lapsing", score: 45, delta: -4, share: 9 },
    ],
    exec: {
      shifting: "Refund turnaround after return pickup",
      magnitude: "Refund-linked complaints up 18% WoW; drags the index ~6 pts",
      affected: "Lapsing & at-risk value segments",
      doing: "Auto-refund on pickup scan piloting in 3 hubs",
    },
  },
  "30D": {
    interactions: "230K",
    interactionsN: 229_782,
    headline: {
      score: 67,
      delta: 1.1,
      nps: 45,
      npsD: 1.5,
      csat: 80,
      csatD: 0.4,
      ease: 3.15,
      easeD: 0.05,
      loyalty: 70,
      loyaltyD: 0.8,
      churn: 7.1,
      churnD: -0.2,
      repeatPurchase: 37,
      repeatD: 0.6,
      fcr: 59,
      fcrD: 0.5,
      retention: 86,
      retentionD: 0.3,
    },
    spark: [64, 65, 66, 65, 67, 66, 68, 67],
    npsSpark: [43, 44, 44, 43, 45, 44, 46, 45],
    repeatSpark: [35, 36, 36, 35, 37, 36, 38, 37],
    loyaltySpark: [68, 69, 69, 68, 70, 69, 71, 70],
    composite: [
      { k: "Product satisfaction", w: 18, s: 79 },
      { k: "Support resolution", w: 20, s: 71 },
      { k: "Delivery experience", w: 28, s: 70 },
      { k: "Overall sentiment", w: 12, s: 62 },
      { k: "Returns & refunds", w: 22, s: 53 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 65, delta: 1, share: 30 },
      { id: "repeat", name: "Repeat", score: 69, delta: 1, share: 38 },
      { id: "plus", name: "Plus / loyal", score: 76, delta: 1, share: 23 },
      { id: "lapsing", name: "Lapsing", score: 44, delta: -2, share: 9 },
    ],
    exec: {
      shifting: "Returns & refunds experience across the month",
      magnitude: "Post-purchase drag persists MoM; refund SLA still below Amazon parity",
      affected: "Occasional + Risk RFM cells over the full month",
      doing: "Refund-SLA program + return-pickup routing rebuild underway",
    },
  },
};

/** Segment ACTIVE / volume overlays on top of 7D baseline rows. */
const SEGMENT_RANGE_OVERLAY: Record<
  HappinessPeriodKey,
  Partial<
    Record<
      HappinessSegmentKey,
      {
        deltaAdj: number;
        resAdj: number;
        unhappyAdj: number;
        aovAdj?: number;
        atvAdj?: number;
        cpuAdj?: number;
        ltvAdj?: number;
      }
    >
  >
> = {
  "24H": {
    active: { deltaAdj: -1.8, resAdj: -3, unhappyAdj: 4, aovAdj: -40, atvAdj: -30, cpuAdj: 0.2, ltvAdj: -2 },
    occasional: { deltaAdj: -0.9, resAdj: -2, unhappyAdj: 3, aovAdj: -60, atvAdj: -50, cpuAdj: 0.1, ltvAdj: -3 },
    loyal: { deltaAdj: -0.4, resAdj: -1, unhappyAdj: 2, aovAdj: -80, atvAdj: -70, cpuAdj: 0.1, ltvAdj: -1 },
    seasonal: { deltaAdj: 0.6, resAdj: -2, unhappyAdj: 2, aovAdj: 30, atvAdj: 20, cpuAdj: 0.1, ltvAdj: -2 },
    reactivated: { deltaAdj: 1.2, resAdj: -1, unhappyAdj: 1, aovAdj: 40, atvAdj: 30, cpuAdj: -0.1, ltvAdj: 1 },
    dormant: { deltaAdj: -0.2, resAdj: -2, unhappyAdj: 3, aovAdj: -20, atvAdj: -15, cpuAdj: 0.1, ltvAdj: -2 },
    frequent: { deltaAdj: -0.5, resAdj: -2, unhappyAdj: 2, aovAdj: -30, atvAdj: -25, cpuAdj: 0.2, ltvAdj: -2 },
  },
  "7D": {},
  "30D": {
    active: { deltaAdj: -0.4, resAdj: 1, unhappyAdj: -1, aovAdj: 50, atvAdj: 40, cpuAdj: -0.1, ltvAdj: 1 },
    occasional: { deltaAdj: 0.3, resAdj: 1, unhappyAdj: -1, aovAdj: 40, atvAdj: 35, cpuAdj: -0.1, ltvAdj: 2 },
    loyal: { deltaAdj: 0.2, resAdj: 2, unhappyAdj: -2, aovAdj: 90, atvAdj: 80, cpuAdj: -0.05, ltvAdj: 1 },
    seasonal: { deltaAdj: -0.3, resAdj: 0, unhappyAdj: 1, aovAdj: -20, atvAdj: -15, cpuAdj: 0, ltvAdj: 0 },
    reactivated: { deltaAdj: -0.8, resAdj: 1, unhappyAdj: 0, aovAdj: 60, atvAdj: 50, cpuAdj: -0.05, ltvAdj: 2 },
    dormant: { deltaAdj: 0.1, resAdj: 0, unhappyAdj: 1, aovAdj: 10, atvAdj: 10, cpuAdj: 0, ltvAdj: 1 },
    frequent: { deltaAdj: 0.2, resAdj: 1, unhappyAdj: -1, aovAdj: 35, atvAdj: 30, cpuAdj: -0.1, ltvAdj: 1 },
  },
};

export function getHappinessSegmentRows(range: HappinessPeriodKey = "7D"): HappinessSegmentRow[] {
  const overlay = SEGMENT_RANGE_OVERLAY[range];
  return HAPPINESS_SEGMENT_ROWS.map((row) => {
    const o = overlay[row.key];
    const interactions = scaleHappinessCount(row.interactions, range);
    const wowDelta = scaleHappinessDelta(row.wowDelta + (o?.deltaAdj ?? 0), range);
    const resolutionRate = Math.max(
      5,
      Math.min(95, Math.round(row.resolutionRate + (o?.resAdj ?? 0))),
    );
    const unhappyAdj = o?.unhappyAdj ?? 0;
    let unhappy = Math.max(5, Math.min(80, row.unhappy + unhappyAdj));
    let happy = Math.max(5, Math.min(80, row.happy - Math.round(unhappyAdj / 2)));
    let neutral = 100 - happy - unhappy;
    if (neutral < 5) {
      const deficit = 5 - neutral;
      neutral = 5;
      if (happy >= unhappy) happy = Math.max(5, happy - deficit);
      else unhappy = Math.max(5, unhappy - deficit);
      neutral = 100 - happy - unhappy;
    }
    return {
      ...row,
      interactions,
      wowDelta,
      aov: Math.max(100, Math.round(row.aov + (o?.aovAdj ?? 0))),
      atv: Math.max(100, Math.round(row.atv + (o?.atvAdj ?? 0))),
      cpu: Math.round(Math.max(0.1, row.cpu + (o?.cpuAdj ?? 0)) * 10) / 10,
      ltv: Math.max(5, Math.min(99, Math.round(row.ltv + (o?.ltvAdj ?? 0)))),
      resolutionRate,
      gmvAtRiskCr: scaleHappinessCr(row.gmvAtRiskCr, range),
      happy,
      neutral,
      unhappy,
      aiConfidence: Math.max(
        60,
        Math.min(96, row.aiConfidence + (range === "24H" ? -4 : range === "30D" ? 2 : 0)),
      ),
    };
  });
}

/** Headline interaction volume — same universe as the segment table for the period. */
export function getHappinessInteractionsN(range: HappinessPeriodKey = "7D"): number {
  return getHappinessSegmentRows(range).reduce((sum, row) => sum + row.interactions, 0);
}

export const HAPPINESS_VOC = {
  theme: "Refund lag after the item is already picked up",
  quote: "You collected the product on Monday — why is my money still not back?",
  sent: { app: 41, social: 33, support: 37 },
} as const;

/** Entity palette — kept separate from green/amber/red change palette. */
export const COHORT_COLOR: Record<CohortId, string> = {
  new: "#3B82C4",
  repeat: "#159B94",
  plus: "#7A5BE0",
  lapsing: "#94A0B2",
};

export type RfmId =
  | "champions"
  | "loyal"
  | "potential"
  | "new"
  | "attention"
  | "atrisk"
  | "cantlose"
  | "hibernating";

export type RfmValueTier = "hvhf" | "hvlf" | "lvhf" | "lvlf";

export type RfmZone = "protect" | "grow" | "rescue" | "monitor";

export type RfmSegment = {
  id: RfmId;
  name: string;
  R: number;
  F: number;
  M: number;
  share: number;
  rev: number;
  clv: string;
  color: string;
  note: string;
  zone: RfmZone;
  valueTier: RfmValueTier;
  aiInsight: string;
  action: string;
  dimensionInsights: {
    Recency: string;
    Frequency: string;
    Monetary: string;
  };
};

export const RFM_ZONES: Record<
  RfmZone,
  { label: string; question: string; color: string }
> = {
  protect: {
    label: "Protect",
    question: "Who must we keep happy?",
    color: "#159B94",
  },
  grow: {
    label: "Grow",
    question: "Who can we deepen?",
    color: "#3B82C4",
  },
  rescue: {
    label: "Rescue",
    question: "Who is slipping away?",
    color: "#C24D6E",
  },
  monitor: {
    label: "Monitor",
    question: "Who is quiet but not urgent?",
    color: "#94A0B2",
  },
};

export const RFM_SEGMENTS: RfmSegment[] = [
  {
    id: "champions",
    name: "Top",
    R: 5,
    F: 5,
    M: 5,
    share: 11,
    rev: 27,
    clv: "₹41k",
    color: "#5B4BE0",
    zone: "protect",
    valueTier: "hvhf",
    note: "Recent, frequent, top spenders — your advocates. Reward & ask for referrals.",
    aiInsight:
      "Top is 11% of base but 27% of revenue. Happiness holds; protect refund SLA — one bad post-purchase loop here costs ~₹41k CLV.",
    action: "Trigger referral ask + priority refund lane for Top this week.",
    dimensionInsights: {
      Recency: "Recency 5/5 — still shopping this week. Keep ETA promises tight; delay is the only fast way to lose them.",
      Frequency: "Frequency 5/5 — highest order cadence. Bundle cross-category offers on the 3rd order this month.",
      Monetary: "Monetary 5/5 — top basket value. Route damaged-premium SKUs to white-glove recovery before escalation.",
    },
  },
  {
    id: "loyal",
    name: "Strong",
    R: 4,
    F: 5,
    M: 4,
    share: 15,
    rev: 21,
    clv: "₹19k",
    color: "#159B94",
    zone: "protect",
    valueTier: "hvhf",
    note: "Consistent repeat buyers just below Top. Upsell adjacent categories.",
    aiInsight:
      "Strong + Top = 26% of base and 48% of revenue. Strong is one missed delight away from Risk — watch return friction.",
    action: "Push category adjacency offers to Strong; audit return pickup SLA in their top 3 cities.",
    dimensionInsights: {
      Recency: "Recency 4/5 — slight cool-off vs Top. A timely win-back coupon in 7 days lifts reorder odds.",
      Frequency: "Frequency 5/5 — strong cadence. Protect subscription / Plus renewal touchpoints.",
      Monetary: "Monetary 4/5 — room to grow AOV. Attach warranty / Plus on carts above ₹2,500.",
    },
  },
  {
    id: "potential",
    name: "Growing",
    R: 5,
    F: 3,
    M: 3,
    share: 16,
    rev: 13,
    clv: "₹8.5k",
    color: "#3B82C4",
    zone: "grow",
    valueTier: "lvhf",
    note: "Recent buyers starting to repeat. Nurture the 2nd–3rd order.",
    aiInsight:
      "Growing is recent but not yet habitual. Second-order completion in 14 days is the growth lever — effort score friction kills the loop.",
    action: "Deploy 2nd-order nudge within 10 days of first delivery confirmation.",
    dimensionInsights: {
      Recency: "Recency 5/5 — hot window now. Contact within 48h of delivery to lock the next intent.",
      Frequency: "Frequency 3/5 — the gap to Strong. Remove checkout friction on reorder path.",
      Monetary: "Monetary 3/5 — mid baskets. Suggest bundles that lift AOV without raising effort.",
    },
  },
  {
    id: "new",
    name: "Starter",
    R: 5,
    F: 1,
    M: 2,
    share: 18,
    rev: 6,
    clv: "₹2.1k",
    color: "#4CA6E8",
    zone: "grow",
    valueTier: "lvlf",
    note: "First order just placed. Onboard hard toward a second purchase.",
    aiInsight:
      "Starter is 18% of base but only 6% of revenue. First-delivery anxiety and refund confusion drive early churn — onboard before day 7.",
    action: "Send delivery confidence + easy-return guide within 24h of first order.",
    dimensionInsights: {
      Recency: "Recency 5/5 — brand-new. First impression is delivery + packaging + support tone.",
      Frequency: "Frequency 1/5 — one order only. Second purchase in 21 days is the success metric.",
      Monetary: "Monetary 2/5 — trial baskets. Don't oversell; reduce effort on the first return if needed.",
    },
  },
  {
    id: "attention",
    name: "Watch",
    R: 3,
    F: 3,
    M: 3,
    share: 12,
    rev: 9,
    clv: "₹6.2k",
    color: "#B0894A",
    zone: "rescue",
    valueTier: "lvhf",
    note: "Above-average once, recency slipping. Timely offer before they cool.",
    aiInsight:
      "Watch is slipping on recency while still mid-value. A timely offer in the next 5 days beats a later win-back campaign.",
    action: "Trigger mid-funnel win-back offer; suppress if open complaint exists.",
    dimensionInsights: {
      Recency: "Recency 3/5 — slipping. This is the last cheap intervention window.",
      Frequency: "Frequency 3/5 — still in habit range. Don't let them drop to Quiet.",
      Monetary: "Monetary 3/5 — average spend. Pair offer with a friction fix, not discount alone.",
    },
  },
  {
    id: "atrisk",
    name: "Risk",
    R: 2,
    F: 4,
    M: 4,
    share: 10,
    rev: 11,
    clv: "₹12k",
    color: "#D98A3D",
    zone: "rescue",
    valueTier: "hvlf",
    note: "Were valuable & frequent, now overdue. Personalised win-back.",
    aiInsight:
      "Risk still holds 11% of revenue with weak recency. Personalised win-back beats blast SMS — refund pain is the #1 stated reason for pause.",
    action: "Personalised outreach from CX + apology credit if last contact was refund-related.",
    dimensionInsights: {
      Recency: "Recency 2/5 — overdue. Call / WhatsApp within 48h for HV baskets.",
      Frequency: "Frequency 4/5 — historically strong. Habit can return if trust is repaired.",
      Monetary: "Monetary 4/5 — high value at stake. Prioritise over Quiet in the queue.",
    },
  },
  {
    id: "cantlose",
    name: "Priority",
    R: 1,
    F: 5,
    M: 5,
    share: 5,
    rev: 9,
    clv: "₹22k",
    color: "#C24D6E",
    zone: "rescue",
    valueTier: "hvlf",
    note: "Best buyers gone quiet. Highest win-back priority — call them.",
    aiInsight:
      "Priority is only 5% of base but 9% of revenue with Recency 1. Highest win-back priority — treat as a retention war-room queue.",
    action: "Assign human callback today; waive return friction; track 14-day reactivation.",
    dimensionInsights: {
      Recency: "Recency 1/5 — cold. Every day without contact raises permanent churn odds.",
      Frequency: "Frequency 5/5 — were your best cadence buyers. Prove the break was operational, not intentional.",
      Monetary: "Monetary 5/5 — ₹22k CLV. Cost of a callback is trivial vs loss.",
    },
  },
  {
    id: "hibernating",
    name: "Quiet",
    R: 2,
    F: 1,
    M: 1,
    share: 13,
    rev: 4,
    clv: "₹1.4k",
    color: "#94A0B2",
    zone: "monitor",
    valueTier: "lvlf",
    note: "Low recency & frequency. Light-touch reactivation only.",
    aiInsight:
      "Quiet is low revenue share — light-touch only. Don't burn CX capacity here while Priority and Risk are open.",
    action: "Low-cost email / app push only; suppress if contact centre load is high.",
    dimensionInsights: {
      Recency: "Recency 2/5 — quiet. Monitor; don't escalate to voice.",
      Frequency: "Frequency 1/5 — rare buyers. Reactivation ROI is thin.",
      Monetary: "Monetary 1/5 — low stakes. Cap incentive cost.",
    },
  },
];

/** RFM revenue share by timeframe — each overlay sums to 100. */
const RFM_REV_OVERLAY: Record<HappinessPeriodKey, Partial<Record<RfmId, number>>> = {
  "24H": {
    champions: 29,
    loyal: 20,
    potential: 12,
    new: 7,
    attention: 8,
    atrisk: 11,
    cantlose: 10,
    hibernating: 3,
  },
  "7D": {},
  "30D": {
    champions: 25,
    loyal: 22,
    potential: 14,
    new: 5,
    attention: 10,
    atrisk: 10,
    cantlose: 8,
    hibernating: 6,
  },
};

export function getRfmSegmentsForRange(range: HappinessPeriodKey = "7D"): RfmSegment[] {
  const overlay = RFM_REV_OVERLAY[range];
  return RFM_SEGMENTS.map((s) => {
    const rev = overlay[s.id] ?? s.rev;
    return {
      ...s,
      rev,
      clv:
        range === "24H"
          ? s.clv.replace(/(\d+(?:\.\d+)?)/, (_, n: string) => {
              const v = Number(n) * 0.92;
              return v >= 10 ? String(Math.round(v)) : v.toFixed(1);
            })
          : range === "30D"
            ? s.clv.replace(/(\d+(?:\.\d+)?)/, (_, n: string) => {
                const v = Number(n) * 1.04;
                return v >= 10 ? String(Math.round(v)) : v.toFixed(1);
              })
            : s.clv,
    };
  });
}

export function getFlipkartFciClustersForRange(range: HappinessPeriodKey = "7D"): FCICluster[] {
  return FLIPKART_FCI_CLUSTERS.map((c) => ({
    ...c,
    count: scaleHappinessCount(c.count, range),
    affectedCustomers: scaleHappinessCount(c.affectedCustomers, range),
    totalInteractions: c.totalInteractions
      ? scaleHappinessCount(c.totalInteractions, range)
      : undefined,
    trend: scaleHappinessDelta(c.trend, range),
  }));
}

export function rfmSegmentsForValueTier(tier: RfmValueTier): RfmSegment[] {
  return RFM_SEGMENTS.filter((s) => s.valueTier === tier);
}

export function rfmSegmentsInZone(zone: RfmZone): RfmSegment[] {
  return RFM_SEGMENTS.filter((s) => s.zone === zone);
}

export type LifecycleId =
  | "active"
  | "occasional"
  | "loyal"
  | "seasonal"
  | "reactivated"
  | "dormant"
  | "frequent";

export type LifecycleState = {
  id: LifecycleId;
  name: string;
  def: string;
  count: string;
  share: number;
  delta: number;
  color: string;
};

export const LIFECYCLE_STATES: LifecycleState[] = [
  {
    id: "active",
    name: "Active customer",
    def: "Purchased within the active window.",
    count: "2.90M",
    share: 42,
    delta: 1.1,
    color: "#159B94",
  },
  {
    id: "occasional",
    name: "Occasional buyer",
    def: "Purchases infrequently but remains active.",
    count: "1.45M",
    share: 21,
    delta: -0.6,
    color: "#3B82C4",
  },
  {
    id: "loyal",
    name: "Loyal customer",
    def: "Repeated purchases over an extended period.",
    count: "1.24M",
    share: 18,
    delta: 0.4,
    color: "#5B4BE0",
  },
  {
    id: "seasonal",
    name: "Seasonal buyer",
    def: "Purchases during predictable periods.",
    count: "0.62M",
    share: 9,
    delta: 0.2,
    color: "#7A8BD0",
  },
  {
    id: "reactivated",
    name: "Reactivated customer",
    def: "Returned after lapsing or churning.",
    count: "0.34M",
    share: 5,
    delta: 0.9,
    color: "#3AA97A",
  },
  {
    id: "dormant",
    name: "Dormant customer",
    def: "Inactive for a longer period.",
    count: "0.35M",
    share: 5,
    delta: 0.3,
    color: "#94A0B2",
  },
  {
    id: "frequent",
    name: "Frequent buyer",
    def: "High purchase cadence without yet reaching loyal.",
    count: "0.86M",
    share: 12,
    delta: 0.7,
    color: "#0D9488",
  },
];

export type LifecycleFlow = {
  from: string;
  to: string;
  count: string;
  good: boolean;
  states: LifecycleId[];
};

export const LIFECYCLE_FLOWS: LifecycleFlow[] = [
  { from: "New", to: "Active", count: "+61K", good: true, states: ["active"] },
  { from: "Active", to: "Frequent", count: "44K", good: true, states: ["active", "frequent"] },
  { from: "Frequent", to: "Loyal", count: "31K", good: true, states: ["frequent", "loyal"] },
  { from: "Active", to: "Occasional", count: "52K", good: false, states: ["active", "occasional"] },
  { from: "Occasional", to: "Seasonal", count: "19K", good: false, states: ["occasional", "seasonal"] },
  { from: "Occasional", to: "Dormant", count: "28K", good: false, states: ["occasional", "dormant"] },
  { from: "Dormant", to: "Reactivated", count: "+34K", good: true, states: ["dormant", "reactivated"] },
];

export type WaterfallStep = {
  label: string;
  val: number;
  type: "total" | "cost" | "result";
};

export const VALUE_WATERFALL: WaterfallStep[] = [
  { label: "Gross revenue", val: 1000, type: "total" },
  { label: "Product cost", val: -620, type: "cost" },
  { label: "Fulfilment & returns", val: -120, type: "cost" },
  { label: "Cost-to-serve", val: -70, type: "cost" },
  { label: "Promotions & incentives", val: -85, type: "cost" },
  { label: "Contribution margin", val: 105, type: "result" },
];

export type ValueTierFlag = "accretive" | "dilutive";

export type ValueTier = {
  id: string;
  name: string;
  tier: string;
  aov: string;
  freq: string;
  clv: string;
  base: number;
  contrib: number;
  flag: ValueTierFlag;
  color: string;
};

export const VALUE_TIERS: ValueTier[] = [
  {
    id: "vip",
    name: "VIP / Champions",
    tier: "Top decile",
    aov: "₹2,850",
    freq: "9.2 / yr",
    clv: "₹41k",
    base: 8,
    contrib: 34,
    flag: "accretive",
    color: "#5B4BE0",
  },
  {
    id: "core",
    name: "Core high-value",
    tier: "HVC",
    aov: "₹1,640",
    freq: "4.1 / yr",
    clv: "₹14k",
    base: 27,
    contrib: 41,
    flag: "accretive",
    color: "#159B94",
  },
  {
    id: "fullprice",
    name: "Occasional full-price",
    tier: "Low cost-to-serve",
    aov: "₹1,180",
    freq: "1.8 / yr",
    clv: "₹4.2k",
    base: 45,
    contrib: 31,
    flag: "accretive",
    color: "#3B82C4",
  },
  {
    id: "dilutive",
    name: "Promotion-dependent",
    tier: "Margin-dilutive",
    aov: "₹2,100",
    freq: "6.5 / yr",
    clv: "−₹1.1k",
    base: 12,
    contrib: -6,
    flag: "dilutive",
    color: "#C24D6E",
  },
];
