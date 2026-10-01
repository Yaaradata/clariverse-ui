/**
 * Period math for KGS v2 overview — all overview figures flow through here.
 * Data as of 25 Sep 2026. W1 = 27 Jun–3 Jul … W13 = 19–25 Sep.
 */

import type { DateRangeId } from "@kgs2/types";
import series from "../data/series.json";

export type PeriodId = DateRangeId;

/** Inclusive week indices (0-based) for the active period. */
export function weekSlice(period: PeriodId): { start: number; end: number } {
  switch (period) {
    case "7d":
      return { start: 12, end: 12 };
    case "30d":
      return { start: 9, end: 12 };
    case "90d":
      return { start: 0, end: 12 };
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

/** Previous equal window. 90d has no prior window in series — use prev90 for those. */
export function prevWeekSlice(
  period: PeriodId,
): { start: number; end: number } | null {
  switch (period) {
    case "7d":
      return { start: 11, end: 11 };
    case "30d":
      return { start: 5, end: 8 };
    case "90d":
      return null;
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

function slice(values: number[], start: number, end: number): number[] {
  return values.slice(start, end + 1);
}

export function sumP(values: number[], period: PeriodId): number {
  const { start, end } = weekSlice(period);
  return slice(values, start, end).reduce((a, b) => a + b, 0);
}

export function avgP(values: number[], period: PeriodId): number {
  const { start, end } = weekSlice(period);
  const xs = slice(values, start, end);
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function lastP(values: number[]): number {
  return values[values.length - 1] ?? 0;
}

/** Average over the previous equal window, or null when no prior window. */
export function prevAvgP(values: number[], period: PeriodId): number | null {
  const prev = prevWeekSlice(period);
  if (!prev) return null;
  const xs = slice(values, prev.start, prev.end);
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function prevSumP(values: number[], period: PeriodId): number | null {
  const prev = prevWeekSlice(period);
  if (!prev) return null;
  return slice(values, prev.start, prev.end).reduce((a, b) => a + b, 0);
}

/** Previous equal-window sum (counts) or average (rates). Null for 90d. */
export function prevP(
  values: number[],
  period: PeriodId,
  kind: "sum" | "avg" = "sum",
): number | null {
  return kind === "avg" ? prevAvgP(values, period) : prevSumP(values, period);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round0(n: number): number {
  return Math.round(n);
}

/** Largest-remainder split of `total` across `weights`. */
export function splitByWeights(total: number, weights: number[]): number[] {
  const wSum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (total * w) / wSum);
  const floors = raw.map((x) => Math.floor(x));
  let rem = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < order.length && rem > 0; k++) {
    out[order[k].i] += 1;
    rem -= 1;
  }
  return out;
}

export type ChartKind = "count" | "pct";

/**
 * Chart points for overview mini charts.
 * Always weekly anchors — never a linear day-slide (that looked like a steep diagonal).
 * - 7d: last 5 weeks (W9–W13) for shape around the latest week
 * - 30d: weekly W10–W13 (4 points)
 * - 90d: 13 weekly points
 */
export function chartPoints(
  values: number[],
  period: PeriodId,
  kind: ChartKind,
): number[] {
  const map = (v: number) => (kind === "pct" ? round1(v) : round0(v));

  if (period === "7d") {
    return values.slice(Math.max(0, values.length - 5)).map(map);
  }

  if (period === "30d") {
    return values.slice(9, 13).map(map);
  }

  return values.map(map);
}

export function chartCaption(period: PeriodId): string {
  switch (period) {
    case "7d":
      return "5 wks";
    case "30d":
      return "4 wks";
    case "90d":
      return "13 weeks";
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

export function vsLabel(period: PeriodId): string {
  switch (period) {
    case "7d":
      return "vs prior 7d";
    case "30d":
      return "vs prior 30d";
    case "90d":
      return "vs prior 90d";
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

/** Short delta for the question-card header (avoids overlap with the big number). */
export function vsLabelShort(period: PeriodId): string {
  switch (period) {
    case "7d":
      return "vs 7d";
    case "30d":
      return "vs 30d";
    case "90d":
      return "vs 90d";
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

export function timeLabel(period: PeriodId): string {
  switch (period) {
    case "7d":
      return "Last 7 days";
    case "30d":
      return "Last 30 days";
    case "90d":
      return "Last 90 days";
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

export function signalsHeading(period: PeriodId): string {
  switch (period) {
    case "7d":
      return "This week's signals";
    case "30d":
      return "Last 30 days' signals";
    case "90d":
      return "Last 90 days' signals";
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

/** Returning theme contacts = licence + order status + device addressing. */
export function returningThemeContacts(): number[] {
  return series.licenceContacts.map(
    (v, i) => v + series.orderStatusContacts[i] + series.deviceAddrContacts[i],
  );
}

export { series };
