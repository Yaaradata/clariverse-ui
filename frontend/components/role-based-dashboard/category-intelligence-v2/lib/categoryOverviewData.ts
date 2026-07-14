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
    heroValue: "−₹39.6 Cr",
    heroDelta: "Spend 103.7% of rev",
    deltaPositive: false,
    spark: [12, 5, 0, -8, -22, -31, -39.6],
    sparkColor: "#E879A0",
    gauges: [
      { label: "Returns", value: 24, color: "#E8A23D" },
      { label: "CAC", value: 21, color: "#8B7CF6" },
    ],
    stats: [
      { label: "Rev pool", value: "₹1,058 Cr" },
      { label: "Returns+CAC", value: "46%", color: "#FF6B6B" },
    ],
    insightPoints: [
      "Spend crosses the revenue line — contribution below zero.",
      "Returns ₹258 Cr + CAC ₹224 Cr are 46% of spend.",
      "Cut return clusters and inefficient CAC before the next wave.",
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
