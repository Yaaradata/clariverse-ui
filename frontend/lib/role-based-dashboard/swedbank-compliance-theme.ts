/**
 * Visual tokens aligned with `app/swedbank/compliance-fci` (Yaara purple accent, dark neutrals).
 * Shapes match `T` from `@/lib/role-based-dashboard/registry` for RoleDashboardView.
 */

import type { CardOpsThemeTokens } from "@/components/role-based-dashboard/CardOpsDashboard";
import type { DashboardThemeTokens } from "@/components/role-based-dashboard/DashboardThemeContext";

const accent = "#5332FF";

export const SWEDBANK_DASHBOARD_THEME: DashboardThemeTokens = {
  bg: "#010101",
  surface: "#1a1a1a",
  card: "#1a1a1a",
  elevated: "#252525",
  border: "#2a2a2a",
  borderLight: "#393939",
  cyan: accent,
  cyanGlow: "rgba(83, 50, 255, 0.15)",
  gold: "#E8B931",
  goldGlow: "rgba(232, 185, 49, 0.12)",
  green: "#22c55e",
  greenGlow: "rgba(34, 197, 94, 0.12)",
  red: "#ef4444",
  redGlow: "rgba(239, 68, 68, 0.12)",
  amber: "#f59e0b",
  amberGlow: "rgba(245, 158, 11, 0.12)",
  purple: "#9b85ff",
  purpleGlow: "rgba(155, 133, 255, 0.12)",
  blue: "#5b8cff",
  blueGlow: "rgba(91, 140, 255, 0.12)",
  text: "#ffffff",
  /** Brighter than legacy Swedbank UI text for WCAG-friendly contrast on #010101 / #1a1a1a. */
  textSec: "#e8e9e9",
  textMut: "#b9b9ba",
  white: "#fff",
};

/** Card ops dashboard uses extra teal keys (same file-local shape as CardOpsDashboard). */
export const SWEDBANK_CARD_OPS_THEME: CardOpsThemeTokens = {
  ...SWEDBANK_DASHBOARD_THEME,
  teal: "#7c6adb",
  tealGlow: "rgba(124, 106, 219, 0.14)",
};
