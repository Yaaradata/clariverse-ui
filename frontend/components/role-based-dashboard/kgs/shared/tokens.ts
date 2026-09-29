/**
 * KGS visual tokens (03 §2) as an inline-style object, matching how the bank Head-of-Cards
 * demo is styled (HEAD_CREDIT_CARDS_DEFAULT_THEME, HeadOfCreditCardsDashboard.tsx:44).
 * No Tailwind extension (BUILD_PLAN D9). Muted text raised to #a3a3a3 for screen-share
 * contrast (06 §2 accessibility).
 */
import type { Domain, SeverityClass } from "@kgs/types";

export const K = {
  page: "#010101",
  bg: "#0d0d0d",
  surface: "#151515",
  elevated: "#1a1a1a",
  card: "#252525",
  cardInner: "#2c2c2c",
  insight: "#181818",
  border: "#1f1f1f",
  borderLight: "#393939",
  chipBorder: "#2a2a2a",

  text: "#ffffff",
  textSec: "#e8e9e9",
  body: "#cdcdcd",
  textMut: "#a3a3a3",

  brand: "#5332ff",
  brandSoft: "#b6a6ff",
  brandTint: "#2b2646",
  violet300: "#c4b5fd",
  violet400: "#a78bfa",
  teal: "#00e5c8",
  orange: "#f97316",
  red: "#ef4444",
  red400: "#f87171",
  amber: "#f59e0b",
  amber2: "#fbbf24",
  yellow300: "#fde047",
  green: "#22c55e",
  sky: "#38bdf8",
  slate: "#94a3b8",

  font: "var(--font), system-ui, sans-serif",
  mono: "var(--mono), ui-monospace, monospace",

  radius: { card: 16, tile: 12, chip: 8, caps: 6, pill: 999 },
  focus: "0 0 0 2px #000, 0 0 0 4px #a78bfa",
} as const;

/** Severity colour + glyph (03 §6.1). The word always comes from data (severity.word / chips.word). */
export const SEV: Record<SeverityClass, { color: string; glyph: string }> = {
  S1: { color: K.red, glyph: "◆" },
  S2: { color: K.amber, glyph: "▲" },
  S3: { color: K.slate, glyph: "●" },
  S4: { color: K.textMut, glyph: "―" },
};

/** Domain dot colours (03 §6.1). */
export const DOMAIN_COLOR: Record<Domain, string> = {
  Quality: K.orange,
  Channel: K.teal,
  Separation: K.sky,
  Supply: K.violet300,
  "Safety/Cyber": K.red400,
  Enabler: K.textMut,
};

/** Question-card accents: Q1 orange, Q2 teal, Q3 sky-400 (00 §7). */
export const ACCENT: Record<"orange" | "teal" | "sky", string> = {
  orange: K.orange,
  teal: K.teal,
  sky: K.sky,
};

export const GAUGE_TONE: Record<"green" | "amber" | "red", string> = {
  green: K.green,
  amber: K.amber,
  red: K.red,
};

export function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
