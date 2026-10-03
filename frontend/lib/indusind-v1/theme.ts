/**
 * IndusInd · light and dark themes, copied from the earlier LisN demo. Every colour in components/indusind-v1 is a CSS
 * variable (`C` in primitives.tsx points at these), so one attribute on <html> switches the whole demo. Light keeps the
 * same five meanings (red, amber, green, cyan, violet) in darker shades that stay readable on white.
 *
 * The variables are scoped to `.lisn-v2`; the layout of /indusind-v1 injects them, so other routes are never affected.
 */

export const THEME_KEY = "lisn-v2-theme";
export type ThemeName = "dark" | "light";

const DARK: Record<string, string> = {
  bg: "#0d0d0d",
  surface: "#111112",
  card: "#0f0f10",
  "card-alt": "#151515",
  border: "#1f1f1f",
  "border-light": "#2f2f33",
  text: "#ffffff",
  "text-sec": "#d6d9d8",
  "text-mut": "#939394",
  "text-dim": "#7e7f80",
  track: "#1f1f1f",
  inner: "#2a2a2a",
  accent: "#f59e0b",
  green: "#22c55e",
  red: "#ef4444",
  amber: "#f59e0b",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  brand: "#5332FF",
  "brand-ink": "#b7a6ff",
  neutral: "#4b5563",
  header: "rgba(11,11,12,0.94)",
  tooltip: "rgba(12,12,14,0.96)",
  hover: "rgba(255,255,255,0.04)",
  "series-1": "#7dd3fc",
  "series-2": "#38bdf8",
  "series-3": "#0284c7",
  "series-4": "#c4b5fd",
  "series-5": "#8b5cf6",
  "series-6": "#6d28d9",
};

const LIGHT: Record<string, string> = {
  bg: "#f4f5f8",
  surface: "#ffffff",
  card: "#ffffff",
  "card-alt": "#f7f8fa",
  border: "#e2e5eb",
  "border-light": "#cfd4dc",
  text: "#0f172a",
  "text-sec": "#334155",
  "text-mut": "#5b6474",
  "text-dim": "#6b7280",
  track: "#e6e9ef",
  inner: "#dde1e8",
  accent: "#b45309",
  green: "#15803d",
  red: "#dc2626",
  amber: "#b45309",
  cyan: "#0369a1",
  violet: "#6d28d9",
  brand: "#4f2ee8",
  "brand-ink": "#4f2ee8",
  neutral: "#9ca3af",
  header: "rgba(255,255,255,0.94)",
  tooltip: "rgba(255,255,255,0.98)",
  hover: "rgba(15,23,42,0.05)",
  // At least 3:1 on white, so the legend labels (drawn in the series colour) stay readable.
  "series-1": "#0284c7",
  "series-2": "#0369a1",
  "series-3": "#0c4a6e",
  "series-4": "#8b5cf6",
  "series-5": "#6d28d9",
  "series-6": "#4c1d95",
};

const block = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, v]) => `--v2-${k}:${v};`)
    .join("");

/** The stylesheet the V2 layout serves: dark by default, light when <html data-lisn-theme="light">. */
export const THEME_CSS = `
.lisn-v2{${block(DARK)}color-scheme:dark;}
html[data-lisn-theme="light"] .lisn-v2{${block(LIGHT)}color-scheme:light;}
html[data-lisn-theme="light"] body{background:${LIGHT.bg};}
`;

/** Runs before first paint, so a saved light theme never flashes dark. */
export const THEME_BOOT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-lisn-theme",t);}catch(e){}`;

export const v = (name: string) => `var(--v2-${name})`;
