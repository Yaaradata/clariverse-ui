/** Number and label formatting for the Swedbank pulse (SW-D02): digit grouping, Swedish kronor shown as kr, no decimals. */

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

/** Kronor (SW-D02), in millions from 1m kr: 2.5 million kr; below that, 12,500 kr. No decimals below a million. */
export function fmtRupees(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)} million kr`;
  return `${IN.format(Math.round(n))} kr`;
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

/**
 * SW-D03: the pipeline holds every time in UTC; screens show Swedish time (CET/CEST). An ISO string with a time part is
 * moved to Europe/Stockholm wall-clock ("2026-11-17T07:45:00"); a bare date is left as it is.
 */
const STHLM = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function toLocal(iso: string): string {
  if (iso.length <= 10 || !/(?:[zZ]|[+-]\d\d:?\d\d)$/.test(iso)) return iso;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  const parts = Object.fromEntries(STHLM.formatToParts(t).map((x) => [x.type, x.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00`;
}

/** "17 Nov" (Swedish time). */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = toLocal(iso).slice(0, 10).split("-").map(Number);
  return `${d[2]} ${MONTHS[d[1] - 1]}`;
}

/** "17 Nov, 07:45" (Swedish time). */
export function fmtTime(iso: string): string {
  return toLocal(iso).slice(11, 16);
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return `${fmtDate(iso)}, ${fmtTime(iso)}`;
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
