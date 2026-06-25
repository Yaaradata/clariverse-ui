// theme/tokens.ts
// -----------------------------------------------------------------------------
// LiSN · Fluid CX — Head of Customer Experience room.
// Single source of truth for every colour, spacing, radius and type value used
// in this dashboard. Components must read from CSS custom properties (driven by
// DashboardThemeProvider) or from this module — never hard-code a hex anywhere.
//
// Persona accent: INDIGO / VIOLET, with CORAL / AMBER for severity. Chosen to
// sit beside the rest of the LiSN family (Head of Retail gold-navy, Head of
// Credit Cards cyan, Head of Contact Centre teal-emerald) so the product reads
// as one system with a distinct CX room.
//
// Contrast: dark is the demo default; both themes target WCAG AA for body text
// and large headlines (see CF-002 note in DashboardThemeProvider).
// -----------------------------------------------------------------------------

export type ThemeMode = 'dark' | 'light';

export interface ColorRamp {
  /** App canvas behind everything. */
  bg: string;
  /** Default card / panel surface. */
  surface: string;
  /** Raised surface (hover, popovers, the active sidebar item). */
  surfaceRaised: string;
  /** Hairline borders and dividers. */
  border: string;
  /** Stronger border for focus rings and emphasis. */
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  /** Persona accent (indigo). Primary interactive colour. */
  accent: string;
  /** Persona accent secondary (violet). Gradients, AI marker. */
  accent2: string;
  /** Low-alpha accent wash for selected / AI-tinted backgrounds. */
  accentSoft: string;

  /** Severity ramp — coral (high) → amber (medium). */
  severityHigh: string;
  severityMed: string;
  /** Calm positive / "stable" state. Used sparingly. */
  positive: string;

  /** Focus ring colour (keyboard accessibility). */
  focus: string;
}

const dark: ColorRamp = {
  bg: '#0D0B16',
  surface: '#171327',
  surfaceRaised: '#211B38',
  border: '#2C2545',
  borderStrong: '#3D3460',

  textPrimary: '#F4F2FB',
  textSecondary: '#ABA3CC',
  textMuted: '#736B95',

  accent: '#8B7CF6',
  accent2: '#A78BFA',
  accentSoft: 'rgba(139, 124, 246, 0.14)',

  severityHigh: '#FF6B6B',
  severityMed: '#F6A93B',
  positive: '#4ADE80',

  focus: '#A78BFA',
};

const light: ColorRamp = {
  bg: '#F6F5FC',
  surface: '#FFFFFF',
  surfaceRaised: '#FBFAFE',
  border: '#E6E2F4',
  borderStrong: '#CFC8E8',

  textPrimary: '#1A1530',
  textSecondary: '#4F4870',
  textMuted: '#857DA6',

  accent: '#6D5CE0',
  accent2: '#7C3AED',
  accentSoft: 'rgba(109, 92, 224, 0.10)',

  severityHigh: '#E5484D',
  severityMed: '#C2730F',
  positive: '#1A9F5A',

  focus: '#6D5CE0',
};

export const palette: Record<ThemeMode, ColorRamp> = { dark, light };

// --- Non-colour scales (theme-independent) -----------------------------------

export const space = {
  '0': '0px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
} as const;

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  pill: '999px',
} as const;

// Medium-high density: a compact-but-calm type scale for a head-altitude reader.
export const type = {
  family:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  // Tabular figures for every metric so numbers do not jitter across deltas.
  familyNumeric:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  scale: {
    display: '34px', // headline signal (the one dominant top-left number)
    h1: '24px',
    h2: '19px',
    h3: '16px',
    body: '14px',
    small: '13px',
    caption: '11px',
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
  // Shadows tuned per theme so the dark room does not glow.
  dark: {
    card: '0 1px 0 rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.45)',
    pop: '0 12px 40px rgba(0,0,0,0.55)',
  },
  light: {
    card: '0 1px 2px rgba(26,21,48,0.06), 0 8px 24px rgba(26,21,48,0.06)',
    pop: '0 12px 40px rgba(26,21,48,0.12)',
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

// Layout constants used by the shell.
export const layout = {
  sidebarWidth: 248,
  sidebarCollapsedWidth: 64,
  headerHeight: 60,
  contentMaxWidth: 1440,
  /** V2 — fit primary story in ≤2 viewport scrolls on 1080p. */
  pagePadding: '14px 20px 16px',
  pageGap: 10,
} as const;

/**
 * Flatten a ramp into the `--lisn-*` CSS custom properties the provider writes
 * onto the shell root. Keeping the name map here means there is exactly one
 * place that defines the variable surface.
 */
export function cssVarsFor(mode: ThemeMode): Record<string, string> {
  const c = palette[mode];
  const e = elevation[mode];
  return {
    '--lisn-bg': c.bg,
    '--lisn-surface': c.surface,
    '--lisn-surface-raised': c.surfaceRaised,
    '--lisn-border': c.border,
    '--lisn-border-strong': c.borderStrong,
    '--lisn-text-primary': c.textPrimary,
    '--lisn-text-secondary': c.textSecondary,
    '--lisn-text-muted': c.textMuted,
    '--lisn-accent': c.accent,
    '--lisn-accent-2': c.accent2,
    '--lisn-accent-soft': c.accentSoft,
    '--lisn-severity-high': c.severityHigh,
    '--lisn-severity-med': c.severityMed,
    '--lisn-positive': c.positive,
    '--lisn-focus': c.focus,
    '--lisn-shadow-card': e.card,
    '--lisn-shadow-pop': e.pop,
    '--lisn-font': type.family,
    '--lisn-font-numeric': type.familyNumeric,
  };
}

/** Convenience accessors so component code reads `cssVar('accent')`. */
export const cssVar = (
  name:
    | 'bg'
    | 'surface'
    | 'surface-raised'
    | 'border'
    | 'border-strong'
    | 'text-primary'
    | 'text-secondary'
    | 'text-muted'
    | 'accent'
    | 'accent-2'
    | 'accent-soft'
    | 'severity-high'
    | 'severity-med'
    | 'positive'
    | 'focus'
    | 'shadow-card'
    | 'shadow-pop'
    | 'font'
    | 'font-numeric',
): string => `var(--lisn-${name})`;
