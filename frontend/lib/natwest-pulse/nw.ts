/**
 * NatWest Group pulse: types of data/out/natwest_pulse/natwest.json and the client-safe helpers (window and brand in
 * the URL). The server loader is lib/natwest-pulse/natwest.ts; pages pass each component only the block it renders
 * (HL-01).
 */

export const NW_BASE = "/natwest-pulse/v1";

export type WindowId = "week" | "w4" | "w13";
export type BrandId = "all" | "natwest" | "rbs" | "ulster";
export const WINDOW_IDS: WindowId[] = ["week", "w4", "w13"];
export const BRAND_IDS: BrandId[] = ["all", "natwest", "rbs", "ulster"];
export const DEFAULT_WINDOW: WindowId = "w4";

export type NwWindow = {
  id: WindowId;
  label: string;
  days: number;
  start: string;
  end: string;
};
export type Option = { id: string; label: string };
export type Point = { x: string; v: number | null };

export type GroupBlock = {
  customers: number;
  contacts: number;
  contacts_change_pct: number | null;
  negative_pct: number | null;
  negative_delta: number | null;
  repeat_pct: number | null;
  repeat_delta: number | null;
  complaints: number;
  complaints_change_pct: number | null;
  complaints_per_100k: number | null;
  upheld_pct: number | null;
  closed_3d_pct: number | null;
  upheld_delta: number | null;
  closed_3d_delta: number | null;
  trend: Point[];
};

export type SegmentRow = {
  id: string;
  label: string;
  customers: number;
  contacts: number;
  negative_pct: number | null;
  repeat_pct: number | null;
  negative_delta: number | null;
  complaints: number;
  complaints_per_100k: number | null;
  complaints_delta_pct: number | null;
  upheld_pct: number | null;
  cora_leakage_pct: number | null;
};

export type ChannelRow = {
  id: string;
  label: string;
  volume: number;
  negative: number;
  repeat: number;
  resolved: number;
  negative_pct: number | null;
  repeat_pct: number | null;
  resolved_pct: number | null;
  volume_change_pct: number | null;
  negative_delta: number | null;
  repeat_delta: number | null;
  resolved_delta: number | null;
  trend: Point[];
};
export type ThemeCount = {
  id: string;
  label: string;
  negative: number;
  volume: number;
};
export type ChannelBlock = {
  rows: ChannelRow[];
  overall_contacts: {
    volume: number;
    negative_pct: number | null;
    repeat_pct: number | null;
    resolved_pct: number | null;
  };
  top_themes: Record<string, ThemeCount[]>;
};

export type CoraAgg = {
  conversations: number;
  resolved: number;
  back_call: number;
  back_complaint: number;
  resolved_pct?: number | null;
  leakage_pct: number | null;
};
export type CoraJourney = CoraAgg & {
  id: string;
  label: string;
  product: string;
  owner: string;
  leakage_delta: number | null;
};
export type CoraBlock = CoraAgg & {
  leakage_delta: number | null;
  journeys: CoraJourney[];
  by_product: (CoraAgg & { id: string; label: string })[];
  by_segment: (CoraAgg & { id: string; label: string })[];
  trend: Point[];
};

export type FosRow = {
  id: string;
  label: string;
  within: number;
  clock_running: number;
  eligible: number;
  referred: number;
  pending: number;
  at_risk: number;
  total: number;
};
export type FosBlock = {
  as_at: string;
  states: { id: string; label: string; sub: string; count: number }[];
  total: number;
  pending: number;
  at_risk: number;
  by_product: FosRow[];
  by_brand: FosRow[];
  by_theme: FosRow[];
  flows: {
    received: number;
    final_responses: number;
    on_time: number;
    on_time_pct: number | null;
    referred: number;
  };
  psd_pending: number;
};

export type DutyOutcome = {
  id: string;
  label: string;
  negative_pct: number | null;
  complaints: number;
  segments: {
    segment: string;
    label: string;
    contacts: number;
    negative_pct: number | null;
    complaints: number;
    complaints_per_100k: number;
  }[];
  top_themes: { id: string; label: string; complaints: number }[];
  evidence: string[];
};

export type LedgerRow = {
  id: string;
  label: string;
  register: string;
  measured: number;
  met: number;
  outside: number;
  met_pct: number | null;
};

export type AgentsBlock = {
  triage: {
    id: string;
    label: string;
    triaged: number;
    released: number;
    held: number;
    blocked: number;
    repeat: number;
    repeat_pct: number | null;
    complaints: number;
    complaints_per_10k: number | null;
    fos: number;
  }[];
  letters: {
    id: string;
    label: string;
    letters: number;
    repeat: number;
    repeat_pct: number | null;
    referred: number;
    referred_pct: number | null;
  }[];
};

export type ProductTheme = {
  id: string;
  label: string;
  owner: string;
  outcome: string;
  contacts: number;
  negative_pct: number | null;
  complaints: number;
  complaints_change_pct: number | null;
  contacts_change_pct: number | null;
};
export type ProductBlock = {
  id: string;
  label: string;
  owner: string;
  contacts: number;
  negative_pct: number | null;
  negative_delta: number | null;
  complaints: number;
  upheld_pct: number | null;
  closed_3d_pct: number | null;
  complaints_change_pct: number | null;
  themes: ProductTheme[];
  mover: ProductTheme | null;
};

export type BriefItem = {
  id: string;
  label: string;
  headline: string;
  theme: string;
  owner: string;
  outcome: string;
  complaints: number;
  complaints_change_pct: number | null;
  negative_pct: number | null;
  action: string;
};

export type JourneyBlock = CoraAgg & {
  id: string;
  label: string;
  product: string;
  owner: string;
  outcome: string;
  trend: Point[];
  by_brand: (CoraAgg & { id: string; label: string })[];
  by_segment: (CoraAgg & { id: string; label: string })[];
  calls: number;
  complaints: number;
  complaints_upheld_pct: number | null;
};

export type BrandColumn = {
  id: string;
  label: string;
  customers: number;
  complaints: number;
  complaints_per_100k: number | null;
  upheld_pct: number | null;
  closed_3d_pct: number | null;
  negative_pct: number | null;
  repeat_pct: number | null;
  cora_leakage_pct: number | null;
  fos_eligible: number;
  fos_at_risk: number;
  login_contacts: number;
};

export type Slice = {
  group: GroupBlock;
  segments: SegmentRow[];
  channel: ChannelBlock;
  cora: CoraBlock;
  fos: FosBlock;
  duty: DutyOutcome[];
  ledger: LedgerRow[];
  agents: AgentsBlock;
  products: Record<string, ProductBlock>;
  brief: BriefItem[];
  journeys: Record<string, JourneyBlock>;
  brand?: { brands: BrandColumn[] };
};

export type NwDoc = {
  freeze: string;
  freeze_label: string;
  window: { start: string; end: string };
  windows: NwWindow[];
  default_window: WindowId;
  brands: Option[];
  segments: Option[];
  channels: Option[];
  products: (Option & { owner: string })[];
  outcomes: Option[];
  fos_states: (Option & { sub: string })[];
  journeys: (Option & { product: string })[];
  slices: Record<string, Slice>;
};

export type RegisterEntry = {
  id: string;
  label: string;
  value: string;
  basis: string;
  source_title: string | null;
  url: string | null;
  date: string | null;
  status: string;
};
export type Peer = {
  id: string;
  label: string;
  benchmark: boolean;
  figures: null | Record<string, string>;
  status: string;
};

export type SourceRow = {
  id: string;
  label: string;
  loaded: boolean;
  files: number;
  items: number;
};

export type AskQA = {
  id: string;
  q: string;
  answer: string;
  table?: { head: string[]; rows: string[][] };
  link?: { label: string; href: string };
  bound: string[];
};

/** What the shell needs from the data, nothing more. */
export type NwFrame = {
  freezeLabel: string;
  scopeNote: string;
  window: NwWindow;
  windows: NwWindow[];
  brand: Option;
  brands: Option[];
  w: WindowId;
  b: BrandId;
  publicLoaded: boolean;
};

/** A page link that keeps the window and brand selection. */
export function nwHref(path: string, w: WindowId, b: BrandId): string {
  const href = path.startsWith("/") ? path : `${NW_BASE}/${path}`;
  const q = new URLSearchParams();
  if (w !== DEFAULT_WINDOW) q.set("w", w);
  if (b !== "all") q.set("b", b);
  const s = q.toString();
  return s ? `${href}${href.includes("?") ? "&" : "?"}${s}` : href;
}

export const fmtN = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : n.toLocaleString("en-GB");
export const fmtP = (n: number | null | undefined, d = 1) =>
  n === null || n === undefined ? "—" : `${n.toFixed(d)}%`;
export const fmtSignedPts = (n: number | null | undefined) =>
  n === null || n === undefined
    ? null
    : `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)} pts`;
export const fmtSignedPct = (n: number | null | undefined) =>
  n === null || n === undefined
    ? null
    : `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(0)}%`;
/** Compact count for big tiles: 4.92m, 13,835. */
export const fmtBig = (n: number | null | undefined) =>
  n === null || n === undefined
    ? "—"
    : n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(2)}m`
      : n >= 100_000
        ? `${(n / 1000).toFixed(0)}k`
        : n.toLocaleString("en-GB");

export function rangeText(start: string, end: string): string {
  const f = (s: string) => {
    const d = new Date(`${s}T00:00:00Z`);
    return `${d.getUTCDate()} ${d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })}`;
  };
  return `${f(start)} – ${f(end)} 2026`;
}

/** "vs last week" or "vs previous 4 weeks": the comparison window behind every delta. */
export function vsPrev(label: string) {
  return label === "This week" ? "vs last week" : "vs previous 4 weeks";
}
