import type { FastagPeriod } from "./types";
import { monthsInQuarter, periodKey } from "./types";

export type PeriodFactors = {
  tags: number;
  money: number;
  volume: number;
  growth: number;
  issues: number;
  health: number;
};

const BASE: PeriodFactors = {
  tags: 1,
  money: 1,
  volume: 1,
  growth: 1,
  issues: 1,
  health: 1,
};

/** Illustrative quarter-over-quarter shape for HoB mock data. */
const FACTORS: Record<string, PeriodFactors> = {
  "2024-Q1": { tags: 0.88, money: 0.86, volume: 0.87, growth: 0.85, issues: 1.12, health: 0.92 },
  "2024-Q2": { tags: 0.9, money: 0.89, volume: 0.9, growth: 0.88, issues: 1.08, health: 0.94 },
  "2024-Q3": { tags: 0.93, money: 0.92, volume: 0.93, growth: 0.91, issues: 1.04, health: 0.96 },
  "2024-Q4": { tags: 0.95, money: 0.94, volume: 0.95, growth: 0.94, issues: 1.02, health: 0.98 },
  "2025-Q1": { tags: 0.97, money: 0.96, volume: 0.97, growth: 0.96, issues: 1.0, health: 1.0 },
  "2025-Q2": { tags: 0.99, money: 0.98, volume: 0.99, growth: 0.98, issues: 0.98, health: 1.01 },
  "2025-Q3": { tags: 1.01, money: 1.0, volume: 1.01, growth: 1.0, issues: 0.96, health: 1.03 },
  "2025-Q4": { tags: 1.03, money: 1.02, volume: 1.03, growth: 1.03, issues: 0.94, health: 1.05 },
  "2026-Q1": { tags: 1.05, money: 1.04, volume: 1.05, growth: 1.05, issues: 0.92, health: 1.07 },
  "2026-Q2": { tags: 1.07, money: 1.06, volume: 1.07, growth: 1.07, issues: 0.9, health: 1.09 },
  "2026-Q3": { tags: 1.09, money: 1.08, volume: 1.09, growth: 1.09, issues: 0.88, health: 1.11 },
  "2026-Q4": { tags: 1.11, money: 1.1, volume: 1.11, growth: 1.11, issues: 0.86, health: 1.13 },
};

function blendFactors(base: PeriodFactors, multiplier: number): PeriodFactors {
  return {
    tags: base.tags * multiplier,
    money: base.money * multiplier,
    volume: base.volume * multiplier,
    growth: base.growth * multiplier,
    issues: base.issues * multiplier,
    health: base.health * multiplier,
  };
}

/** Quarter baseline with a slight lift across months within the quarter (illustrative). */
export function getPeriodFactors(period: FastagPeriod): PeriodFactors {
  const base = FACTORS[periodKey(period)] ?? BASE;
  const months = monthsInQuarter(period.quarter);
  const idx = Math.max(0, months.indexOf(period.month));
  const monthMultiplier = 0.985 + idx * 0.015;
  return blendFactors(base, monthMultiplier);
}

export function roundN(n: number, decimals = 0): number {
  const m = 10 ** decimals;
  return Math.round(n * m) / m;
}

export function scaleCount(n: number, factor: number): number {
  return Math.round(n * factor);
}

export function scaleCr(n: number, factor: number): number {
  return roundN(n * factor, 2);
}

export function clampPct(n: number): number {
  return Math.min(100, Math.max(0, roundN(n, 1)));
}
