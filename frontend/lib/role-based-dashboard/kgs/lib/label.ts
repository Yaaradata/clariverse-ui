/**
 * label.ts — token rendering for the LiSN × KGS demo (framework-free).
 *
 * All copy in data/*.json may contain {{kind:key}} tokens (05a §3). Render every
 * string through fmt() so the Anonymise toggle swaps names everywhere: DOM text,
 * chart labels, tooltips, breadcrumbs and <title>.
 *
 *   fmt('{{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)', false) -> 'EST4 · fw 4.1 (synthetic)'
 *   fmt('{{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)', true)  -> 'Panel platform A · fw A.4.1 (synthetic)'
 *
 * React components normally use useLabel() from ./demoState, which reads the
 * current anonymise flag for you.
 */
import anonymise from "../data/anonymise.json";
import type { AnonymiseMap, Role, TokenKind } from "../types";

const MAP = anonymise as AnonymiseMap;
const TOKEN = /\{\{(brand|platform|fw|partner|region|place|term):([^{}]+)\}\}/g;
const warned = new Set<string>();

/** Resolve one token by kind and key. Unknown keys render the key and warn once. */
export function label(kind: TokenKind, key: string, anon: boolean): string {
  const entry = MAP[kind]?.[key];
  if (!entry) {
    const id = `${kind}:${key}`;
    if (!warned.has(id)) {
      warned.add(id);
      console.warn(`[fmt] unknown token {{${id}}}`);
    }
    return key;
  }
  return anon ? entry.anon : entry.named;
}

/** Resolve every {{kind:key}} token in a string. Non-token text is returned unchanged. */
export function fmt(str: string, anon: boolean): string {
  return str.replace(TOKEN, (_m, kind: TokenKind, key: string) =>
    label(kind, key, anon),
  );
}

/**
 * Role-typed fields (routing.owner / cc / informed, gate.owner / approveEnabledFor) hold the
 * literal Role value, e.g. 'Regional GM UK-EU'. Render them through roleLabel() so a role
 * that names a region anonymises like the rest of the copy ('Regional GM Region EU-1').
 */
export function roleLabel(role: Role, anon: boolean): string {
  return fmt(role.replace(/\bUK-EU\b/, "{{region:UK-EU}}"), anon);
}

/** Replace the runtime {role} placeholder used in breadcrumbs (05a §3.1). */
export function withRole(str: string, role: string): string {
  return str.split("{role}").join(role);
}

/** Replace the runtime {ts} placeholder used by gates, audit entries and toasts. */
export function withTs(str: string, ts: string): string {
  return str.split("{ts}").join(ts);
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
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "DD Mon HH:MM UTC" from UTC getters (05a §1). Capture it ONCE per click and use
 * the same string on the gate, in the audit log and in the toast.
 */
export function fmtDemoTime(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}
