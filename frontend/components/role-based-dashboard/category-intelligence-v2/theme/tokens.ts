// theme/tokens.ts — LiSN Fluid CX palette (aligned with Head of CX V3).

export type ThemeMode = "dark" | "light";

export interface ColorRamp {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  severityHigh: string;
  severityMed: string;
  positive: string;
  focus: string;
}

const dark: ColorRamp = {
  bg: "#000000",
  surface: "#0A0A0A",
  surfaceRaised: "#141414",
  border: "#262626",
  borderStrong: "#333333",
  textPrimary: "#FAFAFA",
  textSecondary: "#A3A3A3",
  textMuted: "#6B6B6B",
  accent: "#8B7CF6",
  accent2: "#A78BFA",
  accentSoft: "rgba(139, 124, 246, 0.14)",
  severityHigh: "#FF6B6B",
  severityMed: "#F6A93B",
  positive: "#4ADE80",
  focus: "#A78BFA",
};

const light: ColorRamp = {
  bg: "#F6F5FC",
  surface: "#FFFFFF",
  surfaceRaised: "#FBFAFE",
  border: "#E6E2F4",
  borderStrong: "#CFC8E8",
  textPrimary: "#1A1530",
  textSecondary: "#4F4870",
  textMuted: "#857DA6",
  accent: "#6D5CE0",
  accent2: "#7C3AED",
  accentSoft: "rgba(109, 92, 224, 0.10)",
  severityHigh: "#E5484D",
  severityMed: "#C2730F",
  positive: "#1A9F5A",
  focus: "#6D5CE0",
};

export const palette: Record<ThemeMode, ColorRamp> = { dark, light };

export const space = {
  "0": "0px",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "8": "32px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  pill: "999px",
} as const;

export const type = {
  family:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  familyNumeric:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  scale: {
    display: "34px",
    h1: "24px",
    h2: "19px",
    h3: "16px",
    body: "14px",
    small: "13px",
    caption: "11px",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  leading: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
  },
} as const;

export const elevation = {
  dark: {
    card: "0 1px 0 rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.45)",
    pop: "0 12px 40px rgba(0,0,0,0.55)",
  },
  light: {
    card: "0 1px 2px rgba(26,21,48,0.06), 0 8px 24px rgba(26,21,48,0.06)",
    pop: "0 12px 40px rgba(26,21,48,0.12)",
  },
} as const;

export const z = {
  base: 0,
  sidebar: 20,
  header: 30,
  drill: 40,
  floating: 50,
  toast: 60,
} as const;

export const layout = {
  sidebarWidth: 248,
  sidebarCollapsedWidth: 64,
  headerHeight: 60,
  contentMaxWidth: 1440,
} as const;

export function cssVarsFor(mode: ThemeMode): Record<string, string> {
  const c = palette[mode];
  const e = elevation[mode];
  return {
    "--lisn-bg": c.bg,
    "--lisn-surface": c.surface,
    "--lisn-surface-raised": c.surfaceRaised,
    "--lisn-border": c.border,
    "--lisn-border-strong": c.borderStrong,
    "--lisn-text-primary": c.textPrimary,
    "--lisn-text-secondary": c.textSecondary,
    "--lisn-text-muted": c.textMuted,
    "--lisn-accent": c.accent,
    "--lisn-accent-2": c.accent2,
    "--lisn-accent-soft": c.accentSoft,
    "--lisn-severity-high": c.severityHigh,
    "--lisn-severity-med": c.severityMed,
    "--lisn-positive": c.positive,
    "--lisn-focus": c.focus,
    "--lisn-shadow-card": e.card,
    "--lisn-shadow-pop": e.pop,
    "--lisn-font": type.family,
    "--lisn-font-numeric": type.familyNumeric,
  };
}

export const cssVar = (
  name:
    | "bg"
    | "surface"
    | "surface-raised"
    | "border"
    | "border-strong"
    | "text-primary"
    | "text-secondary"
    | "text-muted"
    | "accent"
    | "accent-2"
    | "accent-soft"
    | "severity-high"
    | "severity-med"
    | "positive"
    | "focus"
    | "shadow-card"
    | "shadow-pop"
    | "font"
    | "font-numeric",
): string => `var(--lisn-${name})`;
