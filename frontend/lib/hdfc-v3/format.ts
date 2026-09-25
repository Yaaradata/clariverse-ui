/** Number and label formatting for the LisN HDFC demo. Indian digit grouping, rupees in lakh and crore. */

const IN = new Intl.NumberFormat("en-IN");

export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return IN.format(Math.round(n));
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

/** ₹ in lakh or crore, e.g. 2,50,00,000 → ₹2.5 crore. */
export function fmtRupees(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} crore`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} lakh`;
  return `₹${IN.format(n)}`;
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

export function weekLabel(week: string): string {
  return fmtDate(week);
}
