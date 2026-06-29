// theme/tokens.ts — LiSN Category Intelligence · gold / navy accent (light default).

export type ThemeMode = "light" | "dark";

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
  bg: "#0A1220",
  surface: "#0E1830",
  surfaceRaised: "#142040",
  border: "#1A2D50",
  borderStrong: "#243A60",
  textPrimary: "#E2E8F0",
  textSecondary: "#94A3B8",
  textMuted: "#5E718A",
  accent: "#EAB308",
  accent2: "#1E3A5F",
  accentSoft: "rgba(234, 179, 8, 0.14)",
  severityHigh: "#EF4444",
  severityMed: "#F59E0B",
  positive: "#22C55E",
  focus: "#EAB308",
};

const light: ColorRamp = {
  bg: "#F8F7F4",
  surface: "#FFFFFF",
  surfaceRaised: "#F3F2EF",
  border: "#E2E0DA",
  borderStrong: "#D4D1C9",
  textPrimary: "#1A1A1A",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  accent: "#B8860B",
  accent2: "#1E3A5F",
  accentSoft: "rgba(184, 134, 11, 0.12)",
  severityHigh: "#DC2626",
  severityMed: "#D97706",
  positive: "#16A34A",
  focus: "#B8860B",
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

export const layout = {
  sidebarWidth: 248,
  sidebarCollapsedWidth: 64,
  headerHeight: 60,
  contentMaxWidth: 1440,
} as const;

export const z = {
  floating: 50,
  drill: 40,
} as const;

export function cssVarsFor(mode: ThemeMode): Record<string, string> {
  const c = palette[mode];
  const e = elevation[mode];
  return {
    "--lisn-cat-bg": c.bg,
    "--lisn-cat-surface": c.surface,
    "--lisn-cat-surface-raised": c.surfaceRaised,
    "--lisn-cat-border": c.border,
    "--lisn-cat-border-strong": c.borderStrong,
    "--lisn-cat-text-primary": c.textPrimary,
    "--lisn-cat-text-secondary": c.textSecondary,
    "--lisn-cat-text-muted": c.textMuted,
    "--lisn-cat-accent": c.accent,
    "--lisn-cat-accent-2": c.accent2,
    "--lisn-cat-accent-soft": c.accentSoft,
    "--lisn-cat-severity-high": c.severityHigh,
    "--lisn-cat-severity-med": c.severityMed,
    "--lisn-cat-positive": c.positive,
    "--lisn-cat-focus": c.focus,
    "--lisn-cat-shadow-card": e.card,
    "--lisn-cat-shadow-pop": e.pop,
    "--lisn-cat-font": type.family,
    "--lisn-cat-font-numeric": type.familyNumeric,
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
): string => `var(--lisn-cat-${name})`;
