/**
 * v2 surface tokens — dark / light. Accents stay brand-coloured in both modes.
 */

import type { DateRangeId, V2ThemeMode } from "@kgs2/types";
import { K as DarkK } from "@/components/role-based-dashboard/kgs/shared/tokens";

export type { DateRangeId, V2ThemeMode };

export const DATE_RANGE_OPTIONS: Array<{ id: DateRangeId; label: string }> = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export type V2Surface = {
  page: string;
  bg: string;
  surface: string;
  elevated: string;
  card: string;
  cardInner: string;
  insight: string;
  border: string;
  borderLight: string;
  chipBorder: string;
  text: string;
  textSec: string;
  body: string;
  textMut: string;
  focus: string;
  /** Drill panel background (v1 Panel look in dark, white card in light). */
  panel: string;
  /** KPI tile background. */
  tile: string;
  /** Inner card sitting on a panel. */
  inset: string;
  /** Neutral chip / pill background. */
  chip: string;
  /** Panel drop shadow. */
  shadow: string;
  /** Modal / detail scrim. */
  scrim: string;
  /** Chart mark fills (brighter than the text accents in light). */
  amberFill: string;
  greenFill: string;
  /** Hero / theme content block. */
  block: string;
  /** Signal Wall "warning" level. */
  warn: string;
};

const DARK_SURFACE: V2Surface = {
  page: DarkK.page,
  bg: DarkK.bg,
  surface: DarkK.surface,
  elevated: DarkK.elevated,
  card: DarkK.card,
  cardInner: DarkK.cardInner,
  insight: DarkK.insight,
  border: DarkK.border,
  borderLight: DarkK.borderLight,
  chipBorder: DarkK.chipBorder,
  text: DarkK.text,
  textSec: DarkK.textSec,
  body: DarkK.body,
  textMut: DarkK.textMut,
  focus: DarkK.focus,
  panel: DarkK.bg,
  tile: "#131313",
  inset: DarkK.surface,
  chip: "#2a2a2a",
  shadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
  scrim: "rgba(0,0,0,0.35)",
  amberFill: DarkK.amber,
  greenFill: DarkK.green,
  block: DarkK.card,
  warn: "#eab308",
};

const LIGHT_SURFACE: V2Surface = {
  page: "#eef0f3",
  bg: "#e4e7ec",
  surface: "#ffffff",
  elevated: "#ffffff",
  card: "#f7f8fa",
  cardInner: "#eef1f5",
  insight: "#f0f2f5",
  border: "#c9ced6",
  borderLight: "#b8bfc9",
  chipBorder: "#c9ced6",
  text: "#111827",
  textSec: "#1f2937",
  body: "#374151",
  textMut: "#4b5563",
  focus: "0 0 0 2px #fff, 0 0 0 4px #5332ff",
  panel: "#ffffff",
  tile: "#ffffff",
  inset: "#f7f8fa",
  chip: "#e8ebf0",
  shadow: "0 1px 3px rgba(16,24,40,0.08)",
  scrim: "rgba(17,24,39,0.18)",
  amberFill: "#f59e0b",
  greenFill: "#16a34a",
  block: "#ffffff",
  warn: "#a16207",
};

/** Accents darkened for text / marks on light surfaces (WCAG-readable on white). */
const LIGHT_ACCENT = {
  brandSoft: "#4338ca",
  brandTint: "#ece8ff",
  violet300: "#6d28d9",
  violet400: "#7c3aed",
  teal: "#0f766e",
  orange: "#ea580c",
  red: "#dc2626",
  red400: "#dc2626",
  amber: "#b45309",
  amber2: "#d97706",
  yellow300: "#a16207",
  green: "#15803d",
  sky: "#0369a1",
  slate: "#64748b",
};

type Widen<T> = { [P in keyof T]: T[P] extends string ? string : T[P] };

/** Full token bag = surface (themeable) + accents (v1 K in dark, darkened in light). */
export type V2Tokens = Widen<Omit<typeof DarkK, keyof V2Surface>> &
  V2Surface & { mode: V2ThemeMode };

export function tokensFor(mode: V2ThemeMode): V2Tokens {
  if (mode === "light") return { ...DarkK, ...LIGHT_ACCENT, ...LIGHT_SURFACE, mode };
  return { ...DarkK, ...DARK_SURFACE, mode };
}
