import type { LucideIcon } from "lucide-react";
import { Compass, Package, TrendingUp } from "lucide-react";
import type { TimeRangeKey } from "../components/common/TimeRangeSelector";
import type { ScreenId } from "./routes";

export type OverviewPulseItem = {
  q: string;
  main: string;
};

/**
 * Executive pulse by timeframe — Business Head category intelligence.
 * 24H → same-day fire · 7D → weekly operating rhythm · 30D → structural share/LTV
 */
export const OVERVIEW_EXEC_PULSE_BY_RANGE: Record<TimeRangeKey, readonly OverviewPulseItem[]> = {
  "24H": [
    {
      q: "🔴 What's critical",
      main: "NCR delivery-SLA breach spiked overnight — ₹4.2 Cr LTV exposed today. Fashion share still lagging market open.",
    },
    {
      q: "🎯 Where's your focus",
      main: "Appliance A-SKU OOS climbed to 11% in last 24h — ₹6 Cr incremental lost demand. Escalate replenishment before evening peak.",
    },
    {
      q: "🟢 What's stable / on-track",
      main: "Large Appliances & BGMH holding plan today · grocery fill-rate in band outside mid-price gaps.",
    },
  ],
  "7D": [
    {
      q: "🔴 What's critical",
      main: "Losing category share — GMV up 6.4% while the market runs 11.2%. Fashion + Grocery are the drag.",
    },
    {
      q: "🎯 Where's your focus",
      main: "A-SKU stockouts and delivery-SLA churn — ₹128 Cr demand lost, ₹96 Cr forward LTV exposed.",
    },
    {
      q: "🟢 What's stable / on-track",
      main: "Repeat base holds 58% of GMV · Large Appliances & BGMH ahead of plan.",
    },
  ],
  "30D": [
    {
      q: "🔴 What's critical",
      main: "Share down 3.1 pts MoM — Fashion growth halved vs market. Structural mid-band selection gap, not a one-week blip.",
    },
    {
      q: "🎯 Where's your focus",
      main: "₹128 Cr lost demand + ₹96 Cr LTV at risk this month — stockouts and first-delivery CX own most of the gap.",
    },
    {
      q: "🟢 What's stable / on-track",
      main: "Repeat GMV mix steady at 58% · Appliances & BGMH still ahead of 30D plan.",
    },
  ],
};

export const OVERVIEW_EXEC_PULSE = OVERVIEW_EXEC_PULSE_BY_RANGE["7D"];

export function getOverviewExecPulse(range: TimeRangeKey): readonly OverviewPulseItem[] {
  return OVERVIEW_EXEC_PULSE_BY_RANGE[range];
}

export type HubSectorRow = {
  name: string;
  gmvGrowth: string;
  gmvShare: string;
};

export type GrowthSharePanel = {
  growing: HubSectorRow;
  losing: HubSectorRow;
  neutral: HubSectorRow;
  lastQuarterGmv: string;
  currentQuarterGmv: string;
  quarterImprovement: string;
  quarterImprovementTone: "bad" | "good" | "muted";
  gmvPool: string;
  shareDelta: string;
  newGmvPct: string;
  repeatGmvPct: string;
  marketGrowth: string;
};

export type HubJourneyCardData = {
  id: string;
  title: string;
  subtitle: string;
  /** When set, card navigates into a detail screen. */
  targetScreen?: ScreenId;
  drillSignalId?: string;
  icon: LucideIcon;
  iconColor: string;
  heroValue: string;
  heroDelta: string;
  deltaTone: "bad" | "muted" | "good";
  spark: number[];
  sparkColor: string;
  gauges: { label: string; value: number; color: string; topLabel?: string }[];
  stats: { label: string; value: string; color?: string }[];
  /** Growth & share card only — sector + QoQ GMV panel. */
  growthPanel?: GrowthSharePanel;
  /** Primary blocker under the metric strip. */
  bottleneck?: string;
  /** Conversation AI block — one string per line (CX Retail pattern). */
  conversationInsight: string;
};

type HubCardFace = Pick<
  HubJourneyCardData,
  "heroValue" | "heroDelta" | "deltaTone" | "spark" | "gauges" | "stats" | "conversationInsight" | "growthPanel" | "bottleneck"
>;

const GROWTH_PANEL_BY_RANGE: Record<TimeRangeKey, GrowthSharePanel> = {
  "24H": {
    growing: { name: "Gadgets", gmvGrowth: "+1.1%", gmvShare: "18% GMV" },
    losing: { name: "Fashion", gmvGrowth: "19.0%", gmvShare: "22% GMV" },
    neutral: { name: "Electronics", gmvGrowth: "10.0%", gmvShare: "14% GMV" },
    lastQuarterGmv: "+4.1%",
    currentQuarterGmv: "+6.4%",
    quarterImprovement: "+2.3 pts vs LQ",
    quarterImprovementTone: "good",
    gmvPool: "₹38 Cr",
    shareDelta: "−0.2 pts",
    newGmvPct: "40%",
    repeatGmvPct: "60%",
    marketGrowth: "+0.8%",
  },
  "7D": {
    growing: { name: "Gadgets", gmvGrowth: "+14.2%", gmvShare: "18% GMV" },
    losing: { name: "Fashion", gmvGrowth: "19.0%", gmvShare: "22% GMV" },
    neutral: { name: "Electronics", gmvGrowth: "10.1%", gmvShare: "14% GMV" },
    lastQuarterGmv: "+4.1%",
    currentQuarterGmv: "+6.4%",
    quarterImprovement: "+2.3 pts vs LQ",
    quarterImprovementTone: "good",
    gmvPool: "₹1,058 Cr",
    shareDelta: "−3.1 pts",
    newGmvPct: "42%",
    repeatGmvPct: "58%",
    marketGrowth: "+11.2%",
  },
  "30D": {
    growing: { name: "Gadgets", gmvGrowth: "+13.5%", gmvShare: "18% GMV" },
    losing: { name: "Fashion", gmvGrowth: "19.0%", gmvShare: "22% GMV" },
    neutral: { name: "Electronics", gmvGrowth: "10.9%", gmvShare: "14% GMV" },
    lastQuarterGmv: "+4.1%",
    currentQuarterGmv: "+5.8%",
    quarterImprovement: "+1.7 pts vs LQ",
    quarterImprovementTone: "good",
    gmvPool: "₹4,210 Cr",
    shareDelta: "−3.1 pts",
    newGmvPct: "41%",
    repeatGmvPct: "59%",
    marketGrowth: "+10.9%",
  },
};

const HUB_CARD_BASE: HubJourneyCardData[] = [
  {
    id: "growth-share",
    title: "Where is my category growing — and where am I losing it?",
    subtitle: "GMV vs market · sector mix · QoQ improvement",
    targetScreen: "category-profitability",
    icon: TrendingUp,
    iconColor: "#3fb6f2",
    heroValue: "+6.4%",
    heroDelta: "Market +11.2% · ceding share",
    deltaTone: "bad",
    spark: [38, 30, 25, 24, 27, 33, 38],
    sparkColor: "#f472b6",
    gauges: [
      { topLabel: "Growing", label: "of GMV", value: 18, color: "#2ecc71" },
      { topLabel: "Falling", label: "of GMV", value: 22, color: "#f8556a" },
    ],
    stats: [
      { label: "GMV pool", value: "₹1,058 Cr" },
      { label: "Share Δ", value: "−3.1 pts", color: "#f8556a" },
    ],
    growthPanel: GROWTH_PANEL_BY_RANGE["7D"],
    bottleneck: "Fashion mid-band assortment",
    conversationInsight:
      "Growing: Gadgets ahead of market. Falling: Fashion trails plan.\nNeutral: Electronics holds flat vs category mix.\nRepeat carries most GMV — new-buyer acquisition remains the soft spot.",
  },
  {
    id: "availability-gaps",
    title: "How much demand am I losing to stockouts and gaps?",
    subtitle: "A-SKU fill · search hit · pin coverage",
    icon: Package,
    iconColor: "#f5a623",
    heroValue: "₹128 Cr",
    heroDelta: "lost demand · recoverable",
    deltaTone: "muted",
    spark: [46, 44, 40, 34, 27, 20, 15],
    sparkColor: "#f8556a",
    gauges: [
      { label: "A-SKU fill%", value: 89, color: "#f5a623" },
      { label: "Search hit%", value: 82, color: "#f8556a" },
    ],
    stats: [
      { label: "Top gap", value: "Appliances" },
      { label: "Pin coverage", value: "84%" },
    ],
    bottleneck: "A-SKU replenishment lag",
    conversationInsight:
      "₹128 Cr in demand fell through — 60% (₹77 Cr) from A-SKU stockouts, not weak demand.\nNearly 1 in 5 searches returns nothing — mid-price assortment gaps.\n84% pin-code coverage; tier-2 serviceability unlocks ~₹20 Cr.",
  },
  {
    id: "retention-cx",
    title: "Which experiences are costing me repeat customers?",
    subtitle: "Repeat rate · retention · delivery SLA",
    targetScreen: "lane-rto",
    icon: Compass,
    iconColor: "#8b5cf6",
    heroValue: "₹96 Cr",
    heroDelta: "forward LTV exposed",
    deltaTone: "bad",
    spark: [22, 24, 27, 31, 36, 41, 46],
    sparkColor: "#8b5cf6",
    gauges: [
      { label: "Repeat rate%", value: 34, color: "#f8556a" },
      { label: "Retention%", value: 73, color: "#f5a623" },
    ],
    stats: [
      { label: "Repeat Δ", value: "−4 pts", color: "#f8556a" },
      { label: "Top theme", value: "Delivery SLA" },
    ],
    bottleneck: "First-delivery SLA",
    conversationInsight:
      "Repeat rate down 4 pts QoQ — first-delivery experience leads the churn signal.\nReturns-experience friction is the #2 driver, ahead of price.\nFixing the top-2 CX themes protects ~₹96 Cr in forward LTV.",
  },
];

const HUB_FACES_BY_RANGE: Record<TimeRangeKey, Record<string, HubCardFace>> = {
  "24H": {
    "growth-share": {
      heroValue: "+0.3%",
      heroDelta: "Market +0.8% · same-day lag",
      deltaTone: "bad",
      spark: [36, 34, 33, 32, 31, 30, 29],
      gauges: [
        { topLabel: "Growing", label: "of GMV", value: 18, color: "#2ecc71" },
        { topLabel: "Falling", label: "of GMV", value: 22, color: "#f8556a" },
      ],
      stats: [
        { label: "GMV today", value: "₹38 Cr" },
        { label: "Share Δ", value: "−0.2 pts", color: "#f8556a" },
      ],
      growthPanel: GROWTH_PANEL_BY_RANGE["24H"],
      bottleneck: "Fashion same-day drag",
      conversationInsight:
        "Growing today: Gadgets. Falling: Fashion open drag.\nNeutral: Electronics flat same-day.\nRepeat-led GMV holds; paid new-buyer soft overnight.",
    },
    "availability-gaps": {
      heroValue: "₹6.1 Cr",
      heroDelta: "lost demand · last 24h",
      deltaTone: "muted",
      spark: [28, 30, 32, 35, 38, 42, 46],
      gauges: [
        { label: "A-SKU fill%", value: 86, color: "#f5a623" },
        { label: "Search hit%", value: 79, color: "#f8556a" },
      ],
      stats: [
        { label: "Top gap", value: "Appliances" },
        { label: "Pin coverage", value: "84%" },
      ],
      bottleneck: "A-SKU overnight OOS",
      conversationInsight:
        "Overnight A-SKU OOS drove most of ₹6.1 Cr lost demand.\nSearch no-result rate up 2 pts on mid-price staples.\nReplenishment lag — escalate supply before evening peak.",
    },
    "retention-cx": {
      heroValue: "₹4.2 Cr",
      heroDelta: "LTV exposed · NCR SLA",
      deltaTone: "bad",
      spark: [30, 32, 34, 36, 39, 42, 46],
      gauges: [
        { label: "Repeat rate%", value: 33, color: "#f8556a" },
        { label: "Retention%", value: 72, color: "#f5a623" },
      ],
      stats: [
        { label: "SLA breach", value: "19%", color: "#f8556a" },
        { label: "Top theme", value: "Delivery SLA" },
      ],
      bottleneck: "NCR lane SLA",
      conversationInsight:
        "NCR lane SLA is today's top churn signal — ₹4.2 Cr LTV exposed.\nFirst-delivery complaints dominate care voice overnight.\nRoute to ops before the evening dispatch window.",
    },
  },
  "7D": {
    "growth-share": {
      heroValue: "+6.4%",
      heroDelta: "Market +11.2% · ceding share",
      deltaTone: "bad",
      spark: [38, 30, 25, 24, 27, 33, 38],
      gauges: [
        { topLabel: "Growing", label: "of GMV", value: 18, color: "#2ecc71" },
        { topLabel: "Falling", label: "of GMV", value: 22, color: "#f8556a" },
      ],
      stats: [
        { label: "GMV pool", value: "₹1,058 Cr" },
        { label: "Share Δ", value: "−3.1 pts", color: "#f8556a" },
      ],
      growthPanel: GROWTH_PANEL_BY_RANGE["7D"],
      bottleneck: "Fashion mid-band assortment",
      conversationInsight:
        "Growing: Gadgets ahead of market. Falling: Fashion trails plan.\nNeutral: Electronics holds vs category mix.\nRepeat carries 58% of GMV — new-buyer acquisition is the soft spot.",
    },
    "availability-gaps": {
      heroValue: "₹128 Cr",
      heroDelta: "lost demand · recoverable",
      deltaTone: "muted",
      spark: [46, 44, 40, 34, 27, 20, 15],
      gauges: [
        { label: "A-SKU fill%", value: 89, color: "#f5a623" },
        { label: "Search hit%", value: 82, color: "#f8556a" },
      ],
      stats: [
        { label: "Top gap", value: "Appliances" },
        { label: "Pin coverage", value: "84%" },
      ],
      bottleneck: "A-SKU replenishment lag",
      conversationInsight:
        "₹128 Cr in demand fell through — 60% (₹77 Cr) from A-SKU stockouts, not weak demand.\nNearly 1 in 5 searches returns nothing — mid-price assortment gaps.\n84% pin-code coverage; tier-2 serviceability unlocks ~₹20 Cr.",
    },
    "retention-cx": {
      heroValue: "₹96 Cr",
      heroDelta: "forward LTV exposed",
      deltaTone: "bad",
      spark: [22, 24, 27, 31, 36, 41, 46],
      gauges: [
        { label: "Repeat rate%", value: 34, color: "#f8556a" },
        { label: "Retention%", value: 73, color: "#f5a623" },
      ],
      stats: [
        { label: "Repeat Δ", value: "−4 pts", color: "#f8556a" },
        { label: "Top theme", value: "Delivery SLA" },
      ],
      bottleneck: "First-delivery SLA",
      conversationInsight:
        "Repeat rate down 4 pts QoQ — first-delivery experience leads the churn signal.\nReturns-experience friction is the #2 driver, ahead of price.\nFixing the top-2 CX themes protects ~₹96 Cr in forward LTV.",
    },
  },
  "30D": {
    "growth-share": {
      heroValue: "+5.8%",
      heroDelta: "Market +10.9% · −3.1 pts MoM",
      deltaTone: "bad",
      spark: [42, 40, 38, 36, 35, 34, 33],
      gauges: [
        { topLabel: "Growing", label: "of GMV", value: 18, color: "#2ecc71" },
        { topLabel: "Falling", label: "of GMV", value: 22, color: "#f8556a" },
      ],
      stats: [
        { label: "GMV pool", value: "₹4,210 Cr" },
        { label: "Share Δ", value: "−3.1 pts", color: "#f8556a" },
      ],
      growthPanel: GROWTH_PANEL_BY_RANGE["30D"],
      bottleneck: "Fashion selection gap",
      conversationInsight:
        "Growing MoM: Gadgets. Falling: Fashion mid-band selection gap.\nNeutral: Electronics holds structural mix.\nMerchandising + assortment program owns the 30D gap.",
    },
    "availability-gaps": {
      heroValue: "₹412 Cr",
      heroDelta: "lost demand · 30D recoverable",
      deltaTone: "muted",
      spark: [52, 48, 44, 40, 36, 32, 28],
      gauges: [
        { label: "A-SKU fill%", value: 88, color: "#f5a623" },
        { label: "Search hit%", value: 81, color: "#f8556a" },
      ],
      stats: [
        { label: "Top gap", value: "Appliances" },
        { label: "Pin coverage", value: "83%" },
      ],
      bottleneck: "Mid-price assortment gaps",
      conversationInsight:
        "Month-long A-SKU gaps compound to ₹412 Cr lost demand.\nSearch gaps persist in mid-price staples — assortment, not seasonality.\nTier-2 pin coverage still unlocks ~₹60 Cr at 30D scale.",
    },
    "retention-cx": {
      heroValue: "₹310 Cr",
      heroDelta: "forward LTV · MoM exposure",
      deltaTone: "bad",
      spark: [18, 22, 26, 30, 34, 40, 46],
      gauges: [
        { label: "Repeat rate%", value: 35, color: "#f8556a" },
        { label: "Retention%", value: 71, color: "#f5a623" },
      ],
      stats: [
        { label: "Repeat Δ", value: "−3 pts", color: "#f8556a" },
        { label: "Top theme", value: "Delivery SLA" },
      ],
      bottleneck: "First-delivery friction",
      conversationInsight:
        "30D repeat softens on first-delivery friction — not price.\nReturns experience remains #2 churn theme across the month.\nFixing top-2 CX themes protects ~₹310 Cr forward LTV.",
    },
  },
};

export const HUB_JOURNEY_CARDS: HubJourneyCardData[] = HUB_CARD_BASE;

export function getHubJourneyCards(range: TimeRangeKey): HubJourneyCardData[] {
  const faces = HUB_FACES_BY_RANGE[range];
  return HUB_CARD_BASE.map((card) => {
    const face = faces[card.id];
    return face ? { ...card, ...face } : card;
  });
}
