/** Number and label formatting for the NatWest Group pulse: United Kingdom digit grouping, pounds. */

const IN = new Intl.NumberFormat("en-GB");

export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return IN.format(Math.round(n));
}

/** A count short enough for a ring's centre: 1.2m, 628K, 48K; exact below ten thousand. */
export function fmtCompact(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1e6) return `${(n / 1e6).toFixed(1)}m`;
  if (a >= 1e4) return `${Math.round(n / 1e3)}K`;
  return fmt(n);
}

export function fmtPct(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

/** A plain number with a typographic minus, e.g. −54. */
export function fmtNum(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n < 0 ? "−" : ""}${Math.abs(n).toFixed(digits)}`;
}

export function fmtSigned(
  n: number | null | undefined,
  unit = "%",
  digits = 0,
): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const s = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${s}${Math.abs(n).toFixed(digits)}${unit}`;
}

/** Pounds, in millions from £1m: £2.5 million; below that, £12,500. */
export function fmtRupees(n: number): string {
  if (n >= 1e6) return `£${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)} million`;
  return `£${IN.format(n)}`;
}

const MONTHS = [
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
];

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10).split("-").map(Number);
  return `${d[2]} ${MONTHS[d[1] - 1]}`;
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return `${fmtDate(iso)}, ${iso.slice(11, 16)}`;
}

/** "1 Jul–28 Sep" from two ISO dates. */
export function rangeLabel(start: string, end: string): string {
  return `${fmtDate(start)}–${fmtDate(end)}`;
}

/** "1 July to 28 September 2026" from two ISO dates. */
export function rangeLong(start: string, end: string): string {
  const LONG = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const f = (iso: string) => {
    const d = iso.slice(0, 10).split("-").map(Number);
    return `${d[2]} ${LONG[d[1] - 1]}`;
  };
  return `${f(start)} to ${f(end)} ${end.slice(0, 4)}`;
}

/** Trend halves as labels, from the "YYYY-MM-DD to YYYY-MM-DD" strings in the data. */
export function halfLabel(dates: string): string {
  const [a, z] = dates.split(" to ");
  return rangeLabel(a, z);
}

export function weekLabel(week: string): string {
  return fmtDate(week);
}

/** A ring's centre percentage (NW-D92): one decimal below 1% so a small non-zero share never reads as 0%. */
export function ringPct(v: number): string {
  if (v > 0 && v < 1) return `${v.toFixed(1)}%`;
  return `${Math.round(v)}%`;
}
