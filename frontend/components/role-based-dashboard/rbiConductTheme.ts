import type { CSSProperties } from "react";

export const RBI_ACCENT = {
  teal: "#14b8a6",
  indigo: "#6366f1",
  purple: "#a78bfa",
  red: "#ef4444",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#38bdf8",
  blue: "#60a5fa",
  saffron: "#f97316",
  muted: "#939394",
} as const;

export type RbiAccent = typeof RBI_ACCENT;

export function getRbiThemeVars(isDark: boolean): CSSProperties {
  if (isDark) {
    return {
      "--rbi-bg": "#070707",
      "--rbi-card": "#0d0d0d",
      "--rbi-inset": "#1a1a1a",
      "--rbi-border": "#242424",
      "--rbi-text": "#ffffff",
      "--rbi-text-secondary": "#d4d4d8",
      "--rbi-text-muted": "#a1a1aa",
      "--rbi-text-dim": "#71717a",
      "--rbi-subtle-bg": "rgba(0,0,0,0.25)",
      "--rbi-header": "rgba(7,7,7,0.95)",
      "--rbi-sidebar": "rgba(10,10,10,0.98)",
      "--rbi-table-head": "rgba(0,0,0,0.4)",
      "--rbi-table-head-sticky": "#0a0a0a",
      "--rbi-shell-shadow": "rgba(0,0,0,0.85)",
      "--rbi-hover": "rgba(255,255,255,0.04)",
      "--rbi-chip-bg": "rgba(255,255,255,0.06)",
      "--rbi-border-subtle": "rgba(255,255,255,0.14)",
      "--rbi-gradient-coverage-from": "rgba(30,27,75,0.5)",
      "--rbi-gradient-outbound-from": "rgba(69,26,3,0.4)",
      "--rbi-radial-a": "rgba(20,184,166,0.14)",
      "--rbi-radial-b": "rgba(99,102,241,0.10)",
    } as CSSProperties;
  }

  return {
    "--rbi-bg": "#f4f4f5",
    "--rbi-card": "#ffffff",
    "--rbi-inset": "#f1f5f9",
    "--rbi-border": "#e4e4e7",
    "--rbi-text": "#18181b",
    "--rbi-text-secondary": "#3f3f46",
    "--rbi-text-muted": "#52525b",
    "--rbi-text-dim": "#71717a",
    "--rbi-subtle-bg": "rgba(0,0,0,0.03)",
    "--rbi-header": "rgba(255,255,255,0.95)",
    "--rbi-sidebar": "rgba(255,255,255,0.98)",
    "--rbi-table-head": "rgba(0,0,0,0.04)",
    "--rbi-table-head-sticky": "#fafafa",
    "--rbi-shell-shadow": "rgba(0,0,0,0.08)",
    "--rbi-hover": "rgba(0,0,0,0.04)",
    "--rbi-chip-bg": "rgba(0,0,0,0.03)",
    "--rbi-border-subtle": "rgba(0,0,0,0.1)",
    "--rbi-gradient-coverage-from": "rgba(99,102,241,0.08)",
    "--rbi-gradient-outbound-from": "rgba(245,158,11,0.08)",
    "--rbi-radial-a": "rgba(20,184,166,0.08)",
    "--rbi-radial-b": "rgba(99,102,241,0.06)",
  } as CSSProperties;
}

export const RBI_THEME_STORAGE_KEY = "rbi-conduct-theme";
