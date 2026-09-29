import { signalFw41 } from "@kgs/lib/data";

export const HERO_ID = signalFw41.signal.id;

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

/** Replace `{key}` placeholders in a copy template with data values. */
export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
}

/** Plain integer from data, en-GB grouping ("1,240"). */
export function int(n: number): string {
  return n.toLocaleString("en-GB");
}

/** "2026-09-16" → "16 Sep", from UTC getters (a fixed data date, never "now"). */
export function dayLabel(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
