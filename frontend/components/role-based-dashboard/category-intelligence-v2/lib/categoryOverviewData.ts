import type { LucideIcon } from "lucide-react";
import { Package, Store, TrendingUp } from "lucide-react";
import type { ScreenId } from "./routes";

export const OVERVIEW_EXEC_PULSE = [
  {
    q: "🔴 What's critical",
    main: "Fashion returns — ₹6.0L recoverable if sizing chart is fixed this week",
  },
  {
    q: "🎯 Where's your focus",
    main: "NCR lane RTO and QuickStyle seller — ₹4L+ each before weekly review",
  },
  {
    q: "🟢 What's stable / on-track",
    main: "Grocery fill-rate in band · promo ROAS healthy on in-band SKUs",
  },
] as const;

export type HubJourneyCardData = {
  id: string;
  title: string;
  targetScreen: ScreenId;
  drillSignalId?: string;
  icon: LucideIcon;
  iconColor: string;
  heroValue: string | number;
  heroDelta: string;
  deltaPositive: boolean;
  spark: number[];
  sparkColor: string;
  gauges: { label: string; value: number; color: string }[];
  stats: { label: string; value: string; color?: string }[];
  insightPoints: readonly [string, string, string];
  isPrimary?: boolean;
};

export const HUB_JOURNEY_CARDS: HubJourneyCardData[] = [
  {
    id: "profitable-growth",
    title: "Is my category profitable after returns and CAC?",
    targetScreen: "category-profitability",
    icon: TrendingUp,
    iconColor: "#8B7CF6",
    heroValue: "₹2.42 Cr",
    heroDelta: "▼ 12 pts vs plan",
    deltaPositive: false,
    spark: [2.58, 2.55, 2.52, 2.5, 2.48, 2.45, 2.42],
    sparkColor: "#8B7CF6",
    gauges: [
      { label: "Grocery", value: 82, color: "#4ADE80" },
      { label: "Gap share", value: 70, color: "#FF6B6B" },
    ],
    stats: [
      { label: "Shortfall", value: "₹18L" },
      { label: "SKU clusters", value: "3", color: "#F6A93B" },
    ],
    insightPoints: [
      "Triage Fashion promo before the weekend wave.",
      "Headline is net contribution — not gross GMV.",
      "Returns drive 70% of the ₹18L gap — Aura shirt is top fixable SKU.",
    ],
    isPrimary: true,
  },
  {
    id: "returns-recoverable",
    title: "What returns margin is recoverable?",
    targetScreen: "returns-margin",
    drillSignalId: "T2-02",
    icon: Package,
    iconColor: "#FF6B6B",
    heroValue: "₹6.0L",
    heroDelta: "at stake",
    deltaPositive: false,
    spark: [22, 23, 25, 27, 28, 30, 31],
    sparkColor: "#FF6B6B",
    gauges: [
      { label: "Rate", value: 31, color: "#FF6B6B" },
      { label: "Fixable", value: 36, color: "#F6A93B" },
    ],
    stats: [
      { label: "Top driver", value: "Sizing chart", color: "#FF6B6B" },
      { label: "Units", value: "~600" },
    ],
    insightPoints: [
      "Publish category sizing remap for Catalogue.",
      "Reviews cite the size guide — not buyer remorse.",
      "Fashion return rate at 31% — ~600 units recoverable this week.",
    ],
  },
  {
    id: "seller-trust",
    title: "Which sellers threaten category trust?",
    targetScreen: "seller-trust",
    drillSignalId: "T2-07",
    icon: Store,
    iconColor: "#F6A93B",
    heroValue: 4,
    heroDelta: "flagged",
    deltaPositive: false,
    spark: [1, 1, 2, 2, 3, 3, 4],
    sparkColor: "#F6A93B",
    gauges: [
      { label: "Trust", value: 42, color: "#FF6B6B" },
      { label: "Cap used", value: 23, color: "#8B7CF6" },
    ],
    stats: [
      { label: "GMV risk", value: "₹60L", color: "#FF6B6B" },
      { label: "Theme", value: "Cancel-wait" },
    ],
    insightPoints: [
      "Send coaching script to Seller-Brand.",
      "Ranked by care + review voice — not ticket volume.",
      "QuickStyle leads cancel-wait — 4 sellers, ₹60L GMV at risk.",
    ],
  },
];
