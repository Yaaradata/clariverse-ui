/**
 * IndusInd · page payload types. The payloads are written by scripts/build_indusind.py (data/out/indusind_v1/); every
 * figure carries its register, L2 or L3 id and its layer, and nothing is computed in the browser.
 */

export type Layer = "L1" | "L2" | "L3";
export type WindowId = "week" | "w4" | "w13";
export type ViewId = "ceo" | "cx";

/** One figure. L1 values are null while IND-D1 is missing: display is then "pending verification". */
export type Fig = {
  id: string;
  layer: Layer;
  tag?: string;
  label?: string;
  period?: string;
  basis?: string;
  note?: string;
  status?: string;
  value: number | null;
  display: string;
  pending?: boolean;
  source?: string | null;
  source_date?: string | null;
  delta?: number | null;
  delta_display?: string;
};

/** A peer rate-card date (verified page), shown as a dated item, never as a rate change. */
export type CardDate = Fig & { date: string; page_date: string; kind: string };

export type NotLoaded = {
  layer: "L2";
  tag: string;
  loaded: false;
  text: string;
  what: string;
};

/** Public voice (L2) from the scrape, core-licence sources only. */
export type Theme =
  | { thin: true; text: string; what: string }
  | {
      thin: false;
      theme: string;
      label: string;
      paraphrase: string;
      count: Fig;
      share: Fig;
    };

export type VoiceBlock = {
  /** Escalation count below the minimum items shows the thin state. */
  layer: "L2";
  tag: string;
  loaded: true;
  thin: boolean;
  text: string;
  items: Fig;
  by_source: (Fig & { share: number })[];
  escalation: Fig & { thin?: boolean };
  responded: (Fig & { n: number; n_display: string }) | null;
  clipped_from?: string | null;
  /** The period the public figures cover: the window, or "since 10 Aug" when Play starts inside it. */
  period: string;
  theme: Theme;
  footnotes: string[];
  negative?: Fig;
};

export type VoiceLine = {
  topic: string;
  label: string;
  fig: Fig;
  thin: boolean;
};

export type CardVoice = {
  layer: "L2";
  tag: string;
  loaded: true;
  scope: string;
  text: string;
  period: string;
  items: Fig;
  lines: VoiceLine[];
  thin: boolean;
  theme?: Theme;
  switching?: Fig;
  switching_thin?: boolean;
  footnotes: string[];
};

export type Rating = Fig & {
  store: string;
  ratings: number | null;
  ratings_display: string;
  as_of: string;
};

export type Sens = {
  id: string;
  layer: "L1";
  label: string;
  derived: true;
  /** The arithmetic in words (labels and periods, never ids). */
  formula_text: string;
  inputs: Fig[];
  value: number | null;
  display: string;
  pending: boolean;
  basis_note: string;
  caveat: string;
};

export type Trend = {
  id: string;
  layer: "L3";
  unit: string;
  points: { end: string; value: number | null }[];
};

export type Action = {
  action_id: string;
  card_id: string;
  owner_role: string;
  scope: string;
  ask: string;
  cost_cap_cr: number | null;
  cost_cap_note: string | null;
  success_measure: string;
  review_date: string;
  status: string;
  approver_role: string;
  approved_at: string | null;
  evidence_version: string;
};

export type Common = {
  bank: string;
  freeze: string;
  freeze_provisional: boolean;
  windows: { id: WindowId; label: string }[];
  default_window: WindowId;
  views: { id: ViewId; label: string }[];
  businesses: { id: string; label: string }[];
  watermark: string;
  footer: string;
  pulse_caption: string;
  pending: string;
  not_loaded: string;
  sensitivity_footer: string;
  l2_not_enough: string;
  /** Definitions shown behind an (i). */
  defs: Record<string, string>;
};

export type InsideBlock = Record<
  | "received_index"
  | "change"
  | "resolved"
  | "open"
  | "waiting"
  | "over_30"
  | "escalated"
  | "io"
  | "escalation_language",
  Fig
> & { trend: Trend };

export type OmbudsmanBlock = Record<
  "brink" | "eligible" | "unhappy" | "awaiting_io" | "at_risk",
  Fig
>;

export type ChannelRow = {
  id: string;
  label: string;
  share: Fig;
  resolved: Fig;
  open: Fig;
  waiting: Fig;
  over_30: Fig;
};

export type TitlePart = { text?: string; fig?: Fig };

export type Card = {
  id: string;
  title: string;
  title_parts: TitlePart[];
  what: Fig[];
  peers: Fig[];
  peers_held: boolean;
  /** The peer chip, each bank named: "Federal 5.21% · Yes 5.4% (cost of deposits)". */
  peer_chip?: Fig | null;
  /** The peer the brief names when the core peers do not apply (Card C: AU vehicle book). */
  peer_held_label?: string | null;
  voice: CardVoice;
  inside: { text: string; figures?: Fig[] };
  sensitivity: Sens[];
  exposure: string | null;
  owner: string;
  with: string;
  action: Action;
  module: string | null;
};

export type BusinessRow = {
  id: string;
  label: string;
  next: boolean;
  outside_only?: boolean;
  inside: { received_index: Fig; open: Fig; over_30: Fig } | null;
  outside: VoiceBlock;
  theme: Theme;
  money: Fig[];
  module: string | null;
};

export type HomeWindow = {
  pulse: Record<
    string,
    {
      inside: InsideBlock;
      contacts: { index: Fig; negative: Fig };
      channels: ChannelRow[];
      ombudsman: OmbudsmanBlock;
    }
  >;
  outside: VoiceBlock & {
    rating: Rating | null;
    trend: Trend & { starts: string | null };
    before: { from: string; to: string; items: Fig } | null;
  };
  doing: {
    savings: Fig[];
    outflow_index: Fig & { trend: Trend };
    closures_index: Fig;
    app_deposits: Fig;
  };
  risk_by_business: { id: string; label: string; share: Fig }[];
  rows: BusinessRow[];
  cards: Card[];
  /** Public items not tied to one business: shown under the table, not as a row. */
  unassigned?: Fig;
  quiet: (Fig & { text: string; passed: boolean }) | null;
};

export type Home = {
  quarter: { items: Fig[]; chips: Sens[] };
  windows: Record<WindowId, HomeWindow>;
  improving: Fig[];
  horizon: { id: string; label: string; date: Fig; countdown: string | null }[];
  peer_moves: { items: CardDate[]; empty: string };
  owners: {
    card: string;
    owner: string;
    action: string;
    status: string;
    age_days: number;
    approver: string;
  }[];
};

export type AskBank = {
  questions: {
    id: string;
    q: string;
    page: string;
    answer: string;
    figures: Fig[];
  }[];
  fallback: string;
  fallback_look: string[];
};
