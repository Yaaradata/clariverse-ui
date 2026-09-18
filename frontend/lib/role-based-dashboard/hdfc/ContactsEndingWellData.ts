/**
 * Typed loader for HDFC Head of CX — "Are contacts ending well?"
 * Route: /role-based/hdfc/head_of_cx (drill 0 only).
 *
 * All UI reads from this module — no inline metric literals in components.
 * Window filters share one snapshot today; swap windowsByKey later without refactor.
 */
import raw from "./contacts_ending_well_data.json";

export type DateWindow = string;

export type SignalStatus = "red" | "amber" | "green";

export type MatrixCell = {
  v: number;
  status: SignalStatus;
};

export type QualityMatrixRow = {
  channel: string;
  icon: string;
  post_csat: MatrixCell;
  fcr: MatrixCell;
  repeat: MatrixCell;
  premature: MatrixCell;
  tone_drift: MatrixCell;
};

export type ClosureCategory = {
  category: string;
  total: number;
  by_channel: Record<string, number>;
  worst_channel: string;
  repeat_pct: number;
  premature_pct: number;
  tone_drift_pct: number;
  issue: string;
  recommended_fix: string;
};

export type RepeatIntent = {
  intent: string;
  repeats: number;
  color: string;
};

export type RecoveryQuadrant = {
  key: string;
  label: string;
  axis: string;
  count: number;
  descriptor: string;
  items: string[];
};

export type ContactsEndingWellSnapshot = {
  view: string;
  title: string;
  subtitle: string;
  persona: string;
  date_windows: DateWindow[];
  active_window: DateWindow;
  contact_health_score: {
    label: string;
    index_badge: string;
    score: number;
    out_of: number;
    delta_pts: number;
    delta_label: string;
    composite_of: string[];
    trend_12w: { week: string; value: number }[];
    verdict: string;
  };
  ai_summary_wall: {
    badge: string;
    subtitle: string;
    insights: { rank: number; title: string; body: string }[];
  };
  kpis: {
    key: string;
    label: string;
    value: number;
    unit: string;
    target: string;
    delta: number;
    status: SignalStatus;
  }[];
  quality_matrix: {
    title: string;
    subtitle: string;
    signals: string[];
    targets: Record<string, string>;
    rows: QualityMatrixRow[];
    hotspot: string;
  };
  closure_diagnostics: {
    title: string;
    badge: string;
    subtitle: string;
    channel_legend: string[];
    categories: ClosureCategory[];
  };
  repeat_contact_mining: {
    title: string;
    badge: string;
    subtitle: string;
    intents: RepeatIntent[];
    top2_share_pct: number;
    footer: string;
    flag: string;
  };
  recovery_priority_matrix: {
    title: string;
    badge: string;
    subtitle: string;
    quadrants: RecoveryQuadrant[];
    selected: {
      quadrant: string;
      top_reason: string;
      top_intents: string[];
      recommended_action: string;
    };
  };
};

const BASE = raw as ContactsEndingWellSnapshot;

/** Future: per-window payloads. Today every window maps to the same snapshot. */
const windowsByKey: Record<string, ContactsEndingWellSnapshot> = Object.fromEntries(
  BASE.date_windows.map((w) => [w, { ...BASE, active_window: w }]),
);

export function getContactsEndingWellWindows(): DateWindow[] {
  return [...BASE.date_windows];
}

export function getDefaultContactsEndingWellWindow(): DateWindow {
  return BASE.active_window;
}

/**
 * Resolve snapshot for the active date window.
 * Drop a real per-window dataset into `windowsByKey` later — callers stay unchanged.
 */
export function getContactsEndingWellSnapshot(
  window: DateWindow = BASE.active_window,
): ContactsEndingWellSnapshot {
  return windowsByKey[window] ?? { ...BASE, active_window: window };
}

/** Persona chrome line for HDFC Head of CX (spec override; not US-bank wording). */
export const HDFC_HEAD_OF_CX_PERSONA_LINE =
  "HDFC · Head of CX · Promise · Stability · Risk";

export const CLOSURE_CHANNEL_COLORS: Record<string, string> = {
  Chat: "#22d3ee",
  Email: "#a78bfa",
  Ticket: "#f59e0b",
  Voice: "#60a5fa",
};

export const INTENT_COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  cyan: "#06b6d4",
  purple: "#a78bfa",
  gray: "#64748b",
};

export const STATUS_COLOR: Record<SignalStatus, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
};

export const QUADRANT_COLOR: Record<string, string> = {
  do_now: "#ef4444",
  schedule: "#f59e0b",
  delegate: "#06b6d4",
  monitor: "#64748b",
};

export type MatrixSignalKey =
  | "post_csat"
  | "fcr"
  | "repeat"
  | "premature"
  | "tone_drift";

export const MATRIX_SIGNAL_KEYS: MatrixSignalKey[] = [
  "post_csat",
  "fcr",
  "repeat",
  "premature",
  "tone_drift",
];
