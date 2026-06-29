export type DeltaTone = "up" | "down" | "warn" | "flat";

export interface ExecutiveTileData {
  id: string;
  title: string;
  primaryValue: string;
  delta: string;
  deltaTone: DeltaTone;
  spark: number[];
  gaugeValue: number;
  gaugeLabel: string;
  aiInsight: string;
  drillScreen?: "returns-margin" | "seller-trust";
  drillSignalId?: string;
}

export const COMMAND_TIME_COMPARE = "This week vs last week";

export const HEADLINE_EXPLAINABILITY =
  "Contribution is ₹18L below last week; ~70% of the gap is returns on three SKU clusters — the costliest is a fixable sizing error, opened on the rail.";

export const EXEC_BRIEF = {
  critical: "Contribution down ₹18L — returns on Aura shirt run drive ~70% of the gap.",
  focus: "Delhi-NCR lane RTO 33% vs 21% band — logistics voice leads.",
  stable: "Quick-commerce grocery slice contribution holds vs last week.",
  aiLine:
    "The recoverable sizing error on SKU-AURA-SHIRT is the single highest-ROI fix this week — voice confirms a PIM chart mismatch, not buyer remorse.",
};

export const EXEC_PULSE = {
  critical: "Where is margin leaking?",
  focus: "Which lane or seller owns the next ₹4L+ at risk?",
  stable: "What can wait until after the weekly review?",
  answers: {
    critical: "Fashion returns cluster — fixable sizing on Aura shirt.",
    focus: "NCR outbound lane + QuickStyle seller concentration.",
    stable: "Grocery fill-rate and promo ROAS on in-band SKUs.",
  },
};

export const EXECUTIVE_TILES: ExecutiveTileData[] = [
  {
    id: "profitable-growth",
    title: "Is my category profitable after returns and CAC?",
    primaryValue: "₹2.42 Cr",
    delta: "▼ ₹18L vs last week",
    deltaTone: "down",
    spark: [2.58, 2.55, 2.52, 2.5, 2.48, 2.45, 2.42],
    gaugeValue: 68,
    gaugeLabel: "Contribution",
    aiInsight:
      "Not gross GMV — contribution after returns, reverse logistics, discounts, and blended CAC. The gap is fixable if returns on three SKU clusters are addressed.",
  },
  {
    id: "returns-recoverable",
    title: "What returns margin is recoverable?",
    primaryValue: "₹6.0L",
    delta: "31% return rate · ▲ 9 pts vs band",
    deltaTone: "warn",
    spark: [22, 23, 25, 27, 28, 30, 31],
    gaugeValue: 72,
    gaugeLabel: "Recoverable",
    aiInsight:
      "Return/RTO rate breached the 22% category band; ~36% of excess returns are fixable sizing — not buyer remorse.",
    drillScreen: "returns-margin",
    drillSignalId: "T2-02",
  },
  {
    id: "seller-trust",
    title: "Which sellers threaten category trust?",
    primaryValue: "3 sellers",
    delta: "₹52L GMV at risk · conduct flag on",
    deltaTone: "warn",
    spark: [1, 1, 2, 2, 2, 3, 3],
    gaugeValue: 58,
    gaugeLabel: "Trust risk",
    aiInsight:
      "Ranked by customer-backed GMV exposure — cancel-after-wait clusters and concentration near the 25% FDI cap.",
    drillScreen: "seller-trust",
    drillSignalId: "T2-07",
  },
];
