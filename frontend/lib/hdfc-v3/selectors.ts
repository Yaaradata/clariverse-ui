/**
 * One source of truth: every figure shown in more than one place comes from a selector here, reading the one bundle.
 */
import { fmt } from "./format";
import type { Bundle, ReleasePulse, StatusValue, Theme } from "./types";

export type { ReleasePulse };

export type SignalItem = {
  id: string;
  label: string;
  owner: string;
  ownerLabel: string;
  rung: string;
  action: string;
  status: StatusValue;
  count: number;
  why: string;
  pillar: string;
  ackAt?: string;
  ackSystem?: string;
};

export function themeMap(b: Bundle): Record<string, Theme> {
  const m: Record<string, Theme> = {};
  for (const t of b.themes.themes) m[t.id] = t;
  return m;
}

export function releasePulse(b: Bundle): ReleasePulse | null {
  return b.briefing.release_pulse ?? null;
}

type Routed = {
  theme: string;
  owner: string;
  acknowledged_at: string;
  system: string;
};

export function routedList(b: Bundle): Routed[] {
  return ((b.internal as { routed?: Routed[] }).routed ?? []) as Routed[];
}

export function trendWords(t: Theme): string {
  const r = t.rise_pct;
  if (r === null || r === undefined)
    return t.trend_mode === "insufficient"
      ? "no trend claimed (mostly September-only app exports)"
      : "no earlier period to compare";
  const dir = r >= 0 ? "up" : "down";
  if (t.trend_mode === "vs_baseline")
    return `${dir} ${Math.abs(Math.round(r))}% vs baseline`;
  return `${dir} ${Math.abs(Math.round(r))}% in the second half of the window`;
}

export function signalFromTheme(
  b: Bundle,
  t: Theme,
  statusOverride?: StatusValue,
): SignalItem {
  const routed = routedList(b).find((r) => r.theme === t.id);
  const status: StatusValue = statusOverride ?? (routed ? "routed" : t.status);
  const esc = t.escalation_count
    ? `; ${fmt(t.escalation_count)} with escalation language`
    : "";
  return {
    id: t.id,
    label: t.label,
    owner: t.owner,
    ownerLabel: t.owner_label,
    rung: t.rung,
    action: status === "improving" ? "Monitor" : t.action,
    status,
    count: t.count,
    why: `${fmt(t.count)} public items, ${trendWords(t)}${esc}.`,
    pillar: t.pillar,
    ackAt: routed?.acknowledged_at,
    ackSystem: routed?.system,
  };
}

export function signalFromRelease(rp: ReleasePulse): SignalItem {
  return {
    id: rp.id,
    label: rp.label,
    owner: rp.owner,
    ownerLabel: rp.owner_label,
    rung: rp.rung,
    action: rp.action,
    status: "needs_you",
    count: rp.count,
    why: `${fmt(rp.count)} negative reviews of the new HDFC Bank app in the window; ${Math.round(rp.share_positive ?? 0)}% of ${fmt(
      rp.n_reviews,
    )} reviews are positive.`,
    pillar: rp.pillar,
  };
}

export function needsYou(b: Bundle): SignalItem[] {
  const tm = themeMap(b);
  const rp = releasePulse(b);
  return b.briefing.needs_you
    .map((id) =>
      id === "release-pulse" && rp
        ? signalFromRelease(rp)
        : tm[id]
          ? signalFromTheme(b, tm[id], "needs_you")
          : null,
    )
    .filter((x): x is SignalItem => x !== null)
    .slice(0, 3);
}

export function routedItems(b: Bundle): SignalItem[] {
  const tm = themeMap(b);
  return routedList(b)
    .map((r) =>
      tm[r.theme] ? signalFromTheme(b, tm[r.theme], "routed") : null,
    )
    .filter((x): x is SignalItem => x !== null)
    .slice(0, 3);
}

export function thisWeekItems(b: Bundle): SignalItem[] {
  const tm = themeMap(b);
  const routed = new Set(routedList(b).map((r) => r.theme));
  return b.briefing.this_week
    .filter((id) => !routed.has(id) && tm[id])
    .map((id) => signalFromTheme(b, tm[id], "this_week"));
}

export function improvingItems(b: Bundle): SignalItem[] {
  const tm = themeMap(b);
  return b.briefing.improving
    .filter((id) => tm[id])
    .map((id) => {
      const t = tm[id];
      const s = signalFromTheme(b, t, "improving");
      if (id === "app_praise" || id === "service_praise") {
        s.why = `${fmt(t.sentiment.positive)} positive public items in the window.`;
      }
      return s;
    })
    .slice(0, 2);
}

const RUNG_WEIGHT: Record<string, number> = {
  Voice: 0,
  Repeat: 1,
  Grievance: 2,
  "MD's office": 3,
  IO: 4,
  "RBI Ombudsman": 5,
  Public: 6,
};

/** Actions to take: needs you first, then routed and this week. MD's office view weights reputation and regulatory rungs. */
export function actions(
  b: Bundle,
  view: "mds-office" | "head-cx",
): SignalItem[] {
  const list = [...needsYou(b), ...routedItems(b), ...thisWeekItems(b)];
  if (view === "mds-office") {
    const [first, ...rest] = list;
    const sorted = rest.sort(
      (a, c) => (RUNG_WEIGHT[c.rung] ?? 0) - (RUNG_WEIGHT[a.rung] ?? 0),
    );
    return [first, ...sorted].filter(Boolean).slice(0, 3);
  }
  return list.slice(0, 5);
}

export function publicTotal(b: Bundle): number {
  return b.themes.total_items;
}

export function signalHref(id: string, from: string): string {
  return `/hdfc-v3/signal/${id}?from=${from}`;
}
