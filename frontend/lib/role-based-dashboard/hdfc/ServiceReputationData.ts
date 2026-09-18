/**
 * Typed loader — HDFC Head of CX · Service Reputation drill.
 * Route: /role-based/hdfc/head_of_cx (drill 1 only).
 *
 * All UI reads from this module. Window + channel filters share one snapshot
 * today; drop per-window / per-channel payloads into the maps later.
 */
import raw from "./service_reputation_data.json";

export type DateWindow = string;
export type ChannelName = string;
export type SourceKind = "live" | "modelled" | "live+modelled" | string;

export type ServiceReputationSnapshot = {
  view: string;
  title: string;
  subtitle: string;
  persona: string;
  date_windows: DateWindow[];
  active_window: DateWindow;
  channel_filter: ChannelName[];
  service_reputation_score: {
    label: string;
    index_badge: string;
    score: number;
    out_of: number;
    delta_pts: number;
    delta_label: string;
    source: SourceKind;
    trend_8w: { week: string; value: number }[];
    verdict: string;
  };
  ai_summary_wall: {
    badge: string;
    subtitle: string;
    insights: {
      rank: number;
      source: SourceKind;
      title: string;
      body: string;
    }[];
  };
  channel_scores: {
    title: string;
    channels: {
      channel: string;
      source: SourceKind;
      metric_type: "stars" | "sentiment" | string;
      score: number;
      delta: number;
      status: string;
      top_theme: string;
      context: string;
      volume?: number;
    }[];
  };
  service_reputation_themes: {
    title: string;
    badge: string;
    subtitle: string;
    note?: string;
    themes: {
      theme: string;
      value: number;
      source: string;
      sentiment: string;
    }[];
    footer: string;
  };
  app_play_service_decay: {
    title: string;
    badge: string;
    subtitle: string;
    source: SourceKind;
    series: {
      week: string;
      service_complaints: number;
      star_rating: number;
    }[];
    footer: string;
  };
  high_reach_watch: {
    title: string;
    badge: string;
    subtitle: string;
    voices: {
      name: string;
      source: SourceKind;
      handle_context: string;
      reach: string;
      engagement: string;
      status: string;
      why: string;
    }[];
  };
  reputation_momentum: {
    title: string;
    badge: string;
    subtitle: string;
    note?: string;
    topics: {
      label: string;
      /** Customer-voice phrase shown in the VoC list */
      phrase: string;
      growth_kind: "emerged" | "accelerating" | "rising" | string;
      mentions_aug: number | null;
      mentions_sep: number | null;
      growth_pct: number | null;
      occurrences: number;
      share_pct: number;
      source: SourceKind;
      sentiment: string;
      main_channel: string;
      frame: string;
    }[];
  };
  wider_reputation_signals: {
    title: string;
    badge: string;
    subtitle: string;
    cards: {
      key: string;
      title: string;
      source: SourceKind;
      status: string;
      headline: string;
      headline_unit: string;
      movement: string;
      frame: string;
      strongest_channel: string;
      why_it_matters: string;
    }[];
  };
};

const BASE = raw as ServiceReputationSnapshot;

const windowsByKey: Record<string, ServiceReputationSnapshot> = Object.fromEntries(
  BASE.date_windows.map((w) => [w, { ...BASE, active_window: w }]),
);

export function getServiceReputationWindows(): DateWindow[] {
  return [...BASE.date_windows];
}

export function getDefaultServiceReputationWindow(): DateWindow {
  return BASE.active_window;
}

export function getServiceReputationChannels(): ChannelName[] {
  return [...BASE.channel_filter];
}

/**
 * Resolve snapshot for window (+ optional channel highlight).
 * Channel filter is UI state today; swap in per-channel datasets later.
 */
export function getServiceReputationSnapshot(
  window: DateWindow = BASE.active_window,
  _channel: ChannelName | "all" = "all",
): ServiceReputationSnapshot {
  return windowsByKey[window] ?? { ...BASE, active_window: window };
}

/** Normalize any source string to live | modelled for the shared pill. */
export function resolveSourceKind(
  source: SourceKind | undefined,
): "live" | "modelled" {
  if (!source) return "modelled";
  const s = String(source).toLowerCase();
  if (s === "live" || s.startsWith("live")) return "live";
  if (s.includes("x") || s.includes("reddit")) {
    // theme tags like "X", "Reddit", "X+Reddit" count as live provenance
    if (s === "x" || s === "reddit" || s.includes("x+") || s.includes("+reddit")) {
      return "live";
    }
  }
  if (s === "modelled" || s.includes("modelled")) return "modelled";
  // live+modelled composite on the score → show as live for the pill (dominant live narrative)
  if (s.includes("live")) return "live";
  return "modelled";
}

export function formatChannelScore(
  metricType: string,
  score: number,
): string {
  if (metricType === "stars") return score.toFixed(1);
  if (metricType === "sentiment") return score.toFixed(2);
  return String(score);
}

export function formatDelta(delta: number): string {
  if (delta === 0) return "0";
  const abs = Math.abs(delta);
  const body =
    Number.isInteger(abs) || abs >= 1
      ? String(abs)
      : abs.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return delta > 0 ? `+${body}` : `−${body}`;
}

export type NarrativeTopic =
  ServiceReputationSnapshot["reputation_momentum"]["topics"][number];

/** Display model for Rising Service Narratives growth column. */
export function narrativeGrowthView(topic: NarrativeTopic): {
  kindLabel: string;
  kindTone: "emerged" | "accelerating" | "rising";
  primary: string;
  secondary: string | null;
  barFrom: number;
  barTo: number;
  hasVolume: boolean;
} {
  const kind = String(topic.growth_kind ?? "rising").toLowerCase();
  const aug = topic.mentions_aug;
  const sep = topic.mentions_sep;
  const hasVolume =
    typeof aug === "number" && typeof sep === "number" && Number.isFinite(aug) && Number.isFinite(sep);

  if (kind === "emerged") {
    if (hasVolume) {
      return {
        kindLabel: "Emerged",
        kindTone: "emerged",
        primary: `${aug} → ${sep}`,
        secondary: "New this period",
        barFrom: aug as number,
        barTo: sep as number,
        hasVolume: true,
      };
    }
    return {
      kindLabel: "Emerged",
      kindTone: "emerged",
      primary: "New theme",
      secondary: "No Aug baseline",
      barFrom: 0,
      barTo: 0,
      hasVolume: false,
    };
  }

  if (kind === "accelerating" && hasVolume) {
    const pct =
      typeof topic.growth_pct === "number" ? `+${topic.growth_pct}%` : "Accelerating";
    return {
      kindLabel: "Accelerating",
      kindTone: "accelerating",
      primary: pct,
      secondary: `${aug} → ${sep} mentions`,
      barFrom: aug as number,
      barTo: sep as number,
      hasVolume: true,
    };
  }

  return {
    kindLabel: "Rising",
    kindTone: "rising",
    primary: "Rising",
    secondary: "Directional · volume TBD",
    barFrom: 0,
    barTo: 0,
    hasVolume: false,
  };
}

export const STATUS_CHIP_COLOR: Record<string, string> = {
  NEGATIVE: "#ef4444",
  DECLINING: "#f59e0b",
  WEAK: "#f59e0b",
  WATCH: "#f59e0b",
  POSITIVE: "#22c55e",
};
