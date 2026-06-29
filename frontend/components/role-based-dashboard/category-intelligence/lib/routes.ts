// lib/routes.ts — locked five-screen set (Stage 8 route map).

import {
  BarChart3,
  LayoutDashboard,
  Package,
  Radio,
  Store,
  type LucideIcon,
} from "lucide-react";

export type ScreenId =
  | "command-centre"
  | "returns-margin"
  | "seller-trust"
  | "lane-rto"
  | "festival-monitor";

export interface ScreenRoute {
  id: ScreenId;
  label: string;
  shortLabel: string;
  purpose: string;
  icon: LucideIcon;
}

export const SCREENS: ScreenRoute[] = [
  {
    id: "command-centre",
    label: "Category Command Centre",
    shortLabel: "Command",
    purpose: "What should I act on this week?",
    icon: LayoutDashboard,
  },
  {
    id: "returns-margin",
    label: "Recoverable-Margin Returns",
    shortLabel: "Returns",
    purpose: "Returns are a content/seller problem — ₹ recoverable in the customer's words.",
    icon: Package,
  },
  {
    id: "seller-trust",
    label: "Seller Trust-Risk Board",
    shortLabel: "Sellers",
    purpose: "Sellers ranked by customer-backed GMV exposure.",
    icon: Store,
  },
  {
    id: "lane-rto",
    label: "Lane RTO Arbitration",
    shortLabel: "Lanes",
    purpose: "Logistics vs seller — the voice decides.",
    icon: BarChart3,
  },
  {
    id: "festival-monitor",
    label: "Festival Incident Monitor",
    shortLabel: "Festival",
    purpose: "Real demand vs payment/bot/fraud failure.",
    icon: Radio,
  },
];

export const DEFAULT_SCREEN: ScreenId = "command-centre";

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];

export type DrillRouteKind =
  | "returns"
  | "sellers"
  | "lanes"
  | "festival"
  | "signal";

export interface DrillTarget {
  kind: DrillRouteKind;
  itemId: string;
}
