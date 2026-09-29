/**
 * One source of truth: every figure shown in more than one place comes from a selector here, reading the one bundle.
 */
import { fmt } from "./format";
import type {
  Bundle,
  ReleasePulse,
  RoutingRow,
  StatusValue,
  Theme,
} from "./types";

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
  group?: string;
  href?: string;
};

/** B7 §4.3: display names for themes on exec pages. */
const LABEL_OVERRIDE: Record<string, string> = {
  app_praise: "Where customers praise us: quick, easy app journeys",
};

/** B7 §4.2: the exec pages lead with complaints closed without resolution; the app fix list is second. */
export const LEAD_THEME = "complaint_handling";
export const RELEASE_LABEL = "New mobile app release: fix list";
/** B7 §4.3: an item is "improving" only with at least 15 items in each half of the window. */
export const MIN_PER_HALF = 15;

export function themeMap(b: Bundle): Record<string, Theme> {
  const m: Record<string, Theme> = {};
  for (const t of b.themes.themes) m[t.id] = t;
  return m;
}

export function releasePulse(b: Bundle): ReleasePulse | null {
  return b.briefing.release_pulse ?? null;
}

/** Overnight routing (internal, illustrative): one list feeds every "Acknowledged" / "Awaiting owner" on screen. */
export function routedList(b: Bundle): RoutingRow[] {
  return b.v3.routing;
}

/** Acknowledgement status of a theme, or undefined when it was not routed. */
export function ackStatus(b: Bundle, theme: string): string | undefined {
  return routedList(b).find((r) => r.theme === theme)?.status;
}

export function trendWords(t: Theme): string {
  const r = t.rise_pct;
  if (r === null || r === undefined)
    return t.trend_mode === "insufficient"
      ? "no trend claimed (mostly from sources that start or change collection mid-window)"
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
    label: LABEL_OVERRIDE[t.id] ?? t.label,
    group: t.group,
    owner: t.owner,
    ownerLabel: t.owner_label,
    rung: t.rung,
    action: status === "improving" ? "Monitor" : t.action,
    status,
    count: t.count,
    why: `${fmt(t.count)} public items, ${trendWords(t)}${esc}.`,
    pillar: t.pillar,
    ackAt: routed?.acknowledged_at ?? undefined,
    ackSystem: routed?.system,
  };
}

export function signalFromRelease(rp: ReleasePulse): SignalItem {
  return {
    id: rp.id,
    label: RELEASE_LABEL,
    group: "App and digital",
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
  const ids = [
    LEAD_THEME,
    ...b.briefing.needs_you.filter((id) => id !== LEAD_THEME),
  ];
  return ids
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
    .filter((r) => r.theme !== LEAD_THEME)
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
    .filter((id) => id !== LEAD_THEME && !routed.has(id) && tm[id])
    .map((id) => signalFromTheme(b, tm[id], "this_week"));
}

/**
 * Improving (B7 §4.3): only real improvements, each with at least 15 items in both halves of the window. Themes whose
 * share of voice fell, then PayZapp on the App Store when its positive share rose, then where customers praise us.
 */
export function improvingItems(b: Bundle): SignalItem[] {
  const out: SignalItem[] = [];
  const falling = b.themes.themes
    .filter(
      (t) =>
        t.trend_mode === "trend_within_window" &&
        t.trend.first_half >= MIN_PER_HALF &&
        t.trend.second_half >= MIN_PER_HALF &&
        (t.trend.change_pct ?? 0) <= -20 &&
        // Real improvement only: the raw count falls too, so a jump in one source's collected volume cannot make a
        // flat theme look like it is improving (review step 5).
        t.trend.second_half <= 0.8 * t.trend.first_half &&
        !["general_dissatisfaction", "offers_deals", "other"].includes(t.id),
    )
    .sort((a, c) => (a.trend.change_pct ?? 0) - (c.trend.change_pct ?? 0));
  for (const t of falling.slice(0, 1)) {
    const s = signalFromTheme(b, t, "improving");
    s.why = `Share of public voice down ${Math.abs(Math.round(t.trend.change_pct ?? 0))}% in the second half of the window, source-weighted; items fell from ${fmt(t.trend.first_half)} to ${fmt(t.trend.second_half)}.`;
    out.push(s);
  }
  const pz = b.storeSeries.apps
    .find((a) => a.app === "PayZapp")
    ?.stores.find((s) => s.store === "appstore");
  if (
    pz?.halves.comparable &&
    (pz.halves.second.share_positive ?? 0) >
      (pz.halves.first.share_positive ?? 0)
  ) {
    out.push({
      id: "payzapp-appstore",
      label: "PayZapp reviews on the App Store",
      group: "Payments",
      owner: "payments",
      ownerLabel: "Payments",
      rung: "Voice",
      action: "Monitor",
      status: "improving",
      count: pz.window.n,
      why: `Positive reviews rose from ${Math.round(pz.halves.first.share_positive ?? 0)}% to ${Math.round(pz.halves.second.share_positive ?? 0)}% between the two halves of the window (${fmt(pz.halves.first.n)} and ${fmt(pz.halves.second.n)} reviews, App Store only).`,
      pillar: "experience",
      href: "/hdfc-pulse/v2/business/payzapp",
    });
  }
  const praise = themeMap(b).app_praise;
  if (praise) {
    const s = signalFromTheme(b, praise, "improving");
    s.why = `${fmt(praise.sentiment.positive)} positive public items in the window.`;
    out.push(s);
  }
  return out.slice(0, 3);
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
  return `/hdfc-pulse/v2/signal/${id}?from=${from}`;
}

export function itemHref(s: SignalItem, from: string): string {
  return s.href ? `${s.href}?from=${from}` : signalHref(s.id, from);
}

/** Themes that are not a pain point (praise, advice, news, catch-alls). */
const NOT_PAIN = [
  "general_dissatisfaction",
  "other",
  "app_praise",
  "service_praise",
  "product_advice",
  "offers_deals",
  "market_news",
];

/** Exec page, satisfaction card: the theme with the most negative items. */
export function topPainTheme(b: Bundle): Theme | undefined {
  return b.themes.themes
    .filter((t) => !NOT_PAIN.includes(t.id))
    .sort((a, c) => c.sentiment.negative - a.sentiment.negative)[0];
}

/** Exec page, market card: the fastest-rising theme. */
export function fastestRiser(b: Bundle): Theme | undefined {
  return b.themes.themes
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score)[0];
}

/** Satisfaction, "What customers are saying": the three largest themes that are not news, offers or catch-alls. */
export function sayingThemes(b: Bundle): Theme[] {
  const skip = ["other", "market_news", "offers_deals", "general_dissatisfaction", "product_advice"];
  return b.themes.themes
    .filter((t) => !skip.includes(t.id))
    .sort((a, c) => c.count - a.count)
    .slice(0, 3);
}
