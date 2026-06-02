export type FastagQuarter = 1 | 2 | 3 | 4;

export type FastagPeriod = {
  year: number;
  quarter: FastagQuarter;
  /** Calendar month (1–12), must fall within the selected quarter. */
  month: number;
};

export const FASTAG_PERIOD_YEARS = [2024, 2025, 2026] as const;

export const FASTAG_QUARTERS: FastagQuarter[] = [1, 2, 3, 4];

export const FASTAG_MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** First calendar month in each fiscal quarter (Q1 = Jan, …). */
export function monthsInQuarter(quarter: FastagQuarter): number[] {
  const start = (quarter - 1) * 3 + 1;
  return [start, start + 1, start + 2];
}

export function defaultMonthForQuarter(quarter: FastagQuarter): number {
  return monthsInQuarter(quarter)[0];
}

export function clampMonthToQuarter(month: number, quarter: FastagQuarter): number {
  const allowed = monthsInQuarter(quarter);
  if (allowed.includes(month)) return month;
  return allowed[0];
}

export const DEFAULT_FASTAG_PERIOD: FastagPeriod = {
  year: 2026,
  quarter: 2,
  month: 4,
};

export function periodKey(period: FastagPeriod): string {
  return `${period.year}-Q${period.quarter}`;
}

export function periodMonthKey(period: FastagPeriod): string {
  return `${period.year}-Q${period.quarter}-M${period.month}`;
}

export function periodLabel(period: FastagPeriod): string {
  return `${FASTAG_MONTH_LABELS[period.month - 1]} ${period.year}`;
}

export function periodLabelLong(period: FastagPeriod): string {
  return `Q${period.quarter} ${period.year} · ${FASTAG_MONTH_LABELS[period.month - 1]}`;
}

export function isSamePeriod(a: FastagPeriod, b: FastagPeriod): boolean {
  return a.year === b.year && a.quarter === b.quarter && a.month === b.month;
}
