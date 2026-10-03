/** IndusInd · formatting. Indian digit grouping; one date format throughout (1 Oct 2026). Copied from the earlier LisN demo. */

const IN = new Intl.NumberFormat("en-IN");

export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return IN.format(Math.round(n));
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

/** "2026-09-25" → "25 Sep 2026". */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
