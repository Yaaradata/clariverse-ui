/**
 * Period figures (30 Sep review, docs/demo-rebuild/changes_30sep.md): everything the MD's office / Head of CX view and
 * the Cards business-head view show, per period, as written by scripts/hdfc_v3/periods_v3.py from dated records.
 */

export type PeriodId = "brief" | "7d" | "30d" | "all";
export const PERIOD_IDS: PeriodId[] = ["brief", "7d", "30d", "all"];

export type Replies = {
  reviews: number;
  responded: number;
  positive_reviews: number;
  positive_responded: number;
  negative_reviews: number;
  negative_responded: number;
};

export type InternalFigures = {
  volume: number;
  prev_volume: number;
  change_pct: number | null;
  resolved: number;
  /** Open with the bank. A thread waiting on the customer is not open (30 Sep review, K4). */
  open: number;
  /** The bank has sent a resolution or proposed one; the thread is with the customer. */
  waiting_on_customer: number;
  /** Change against the comparison window as it stood at its own end. */
  open_delta: number;
  not_responded_delta: number | null;
  /** Null for the Morning brief: nothing in a 24-hour window can be 48 hours old. */
  open_too_long: number | null;
  not_responded_48h: number | null;
  negative: number;
  escalations: number;
};

export type ChannelFigures = {
  volume: number;
  open: number;
  waiting_on_customer: number;
  not_responded_48h: number | null;
  open_too_long?: number | null;
  resolved?: number;
};

export type PublicFigures = {
  volume: number;
  positive: number;
  negative: number;
  neutral: number;
  positive_share: number | null;
  negative_share: number | null;
  share_method: "source_weighted";
  change_pct: number | null;
  trend_basis: { current: number; previous: number; sources: string[] };
  escalation: number;
  repeat_contact: number;
  responded: Replies;
  high_impact: {
    volume: number;
    positive: number;
    negative: number;
    escalation: number;
    positive_share: number | null;
    negative_share: number | null;
    share_method: "source_weighted";
    responded: Replies;
  };
  source_mix: Record<string, number>;
};

export type PulseList = {
  id: string;
  label: string;
  members: number;
  volume: number;
  prev_volume: number;
  change_pct: number | null;
  open: number;
  waiting_on_customer: number;
  not_responded_48h: number | null;
  open_delta: number;
  not_responded_delta: number | null;
  /** RMs alerted this morning, of the list's customers due an alert. */
  rm: { alerted: number; of: number };
  not_responded_series: { end: string; count: number }[];
  volume_series: { end: string; count: number }[];
  by_channel: Record<string, ChannelFigures>;
};

export type SocialPost = {
  text: string;
  platform: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  engagement: Record<string, number>;
  score: number;
  responded: boolean;
  /** True when the reply is simulated (every source but the Play Store). */
  illustrative: boolean;
};

/** Social pulse (30 Sep review, K2): public voice only; what LisN adds beyond the bank's own systems. */
export type SocialPulse = {
  mentions: number;
  /** Bank replies by source. Play Store is collected (live); the rest are simulated and marked illustrative. */
  by_source: {
    source: string;
    label: string;
    mentions: number;
    responded: number;
    pct: number | null;
    illustrative: boolean;
  }[];
  responded: number;
  response_pct: number | null;
  high_impact: number;
  high_impact_responded: number;
  high_impact_response_pct: number | null;
  posts: SocialPost[];
  good_response: {
    text: string;
    platform: string;
    date: string;
    engagement: Record<string, number>;
    reply: string;
    in_period: boolean;
  } | null;
  rule: string;
};

export type Business = {
  id: string;
  label: string;
  overall_volume: number;
  internal: InternalFigures;
  external: PublicFigures;
  top_issue: {
    id: string;
    label: string;
    count: number;
    source: "public" | "internal";
  } | null;
  anecdote: { summary: string; source_label: string; date: string } | null;
};

export type BriefItem = {
  business: string;
  business_label: string;
  issue?: string;
  status?: "improving" | "stable" | "watch";
  text: string;
};

export type CategoryFigures = {
  internal: Pick<
    InternalFigures,
    | "volume"
    | "resolved"
    | "open"
    | "waiting_on_customer"
    | "open_too_long"
    | "not_responded_48h"
    | "escalations"
    | "change_pct"
  >;
  external: Pick<
    PublicFigures,
    | "volume"
    | "positive"
    | "negative"
    | "negative_share"
    | "escalation"
    | "responded"
    | "high_impact"
    | "change_pct"
  >;
  trend: { end: string; internal: number; external: number }[];
};

export type Category = CategoryFigures & {
  id: string;
  label: string;
  owner: string;
  tat_related: boolean;
  subcategories: (CategoryFigures & { id: string; label: string })[];
};

export type Quote = { summary: string; source_label: string; date: string };
export type ThemeRow = {
  id: string;
  label: string;
  count: number;
  negative: number;
  negative_share: number | null;
  escalation: number;
  share_change_pct: number | null;
  weekly: { end: string; count: number; share: number | null }[];
};
export type TopTheme = { id: string; label: string; count: number };

/** The three MD drill-downs, rebuilt for Cards and the period (changes_30sep.md C4). */
export type CardsHappy = {
  by_source: {
    source: string;
    label: string;
    items: number;
    positive: number;
    neutral: number;
    negative: number;
    net: number | null;
    weight_pct: number;
  }[];
  weekly_net: { end: string; items: number; net: number | null }[];
  saying: (Quote & { id: string; label: string; count: number })[];
  repeat_by_category: {
    id: string;
    label: string;
    internal_repeat: number;
    public_repeat: number;
    contacts: number;
  }[];
  tiers: {
    id: string;
    label: string;
    volume: number;
    positive: number;
    neutral: number;
    negative: number;
    open: number;
  }[];
};
export type CardsMarket = {
  themes: ThemeRow[];
  rising: ThemeRow[];
  reach: {
    volume: number;
    positive: number;
    negative: number;
    by_source: Record<string, number>;
    escalation: number;
    top_themes: TopTheme[];
    responded: Replies;
  };
  safety: {
    public: number;
    public_negative: number;
    public_escalation: number;
    high_impact: number;
    internal: number;
    internal_open: number;
    internal_high_impact: number;
    top: TopTheme[];
  };
};
export type CardsService = {
  ladder: { rung: string; count: number }[];
  public_escalation: number;
  targets: { id: string; label: string; count: number }[];
  closure: {
    internal_requests: number;
    internal_open: number;
    public_intent: number;
    quote: Quote | null;
  };
  cure: { count: number; top: TopTheme[]; quote: Quote | null };
  transparency: { count: number; share: number | null; quote: Quote | null };
  disputes: { stage: string; count: number }[];
  missed_timelines: {
    total: number;
    rows: { id: string; label: string; count: number }[];
  };
  tat_related: { contacts: number; share: number | null; open: number };
  failures: {
    id: string;
    label: string;
    negative: number;
    count: number;
    escalation: number;
  }[];
};

export type CardsPeriod = {
  happy: CardsHappy;
  market_full: CardsMarket;
  service_full: CardsService;
  internal: InternalFigures;
  external: PublicFigures;
  categories: Category[];
  mood: {
    net: number | null;
    net_trend_current: number | null;
    net_trend_previous: number | null;
    items: number;
  };
  market: {
    id: string;
    label: string;
    count: number;
    negative: number;
    share_change_pct: number | null;
  }[];
  service: {
    resolved: number;
    volume: number;
    open_too_long: number | null;
    median_first_response_hours_written: number | null;
    public_service_negative: number;
  };
  friction: {
    id: string;
    label: string;
    repeat_contact_internal: number | null;
    escalation_internal: number;
    escalation_external: number;
    negative_share: number | null;
  }[];
  pillars: {
    id: string;
    label: string;
    count: number;
    net: number | null;
    top: { id: string; label: string; count: number }[];
  }[];
  journey: {
    stage: string;
    volume: number;
    negative_share: number | null;
    repeat_share: number | null;
  }[];
  stores: {
    store: string;
    label: string;
    reviews: number;
    avg_rating: number | null;
    share_positive: number | null;
    share_negative: number | null;
    complaints: { label: string; count: number }[];
    feature_requests: { label: string; count: number }[];
    praised: { label: string; count: number }[];
  }[];
  channels: {
    internal: Record<string, number>;
    external: Record<string, number>;
  };
  tiers: {
    id: string;
    label: string;
    volume: number;
    open: number;
    negative: number;
  }[];
};

export type Period = {
  id: PeriodId;
  label: string;
  short: boolean;
  start: string;
  end: string;
  public_start: string;
  public_end: string;
  compare: string;
  customer_pulse: {
    lists: PulseList[];
    mentions: {
      provenance: "internal";
      total: number;
      responded: number;
      not_responded: number;
      by_list: Record<string, { total: number; responded: number }>;
      rule: string;
    };
    rm: { alerted: number; of: number; as_of: string };
  };
  social_pulse: SocialPulse;
  cx_pulse: {
    overall: {
      total: number;
      internal: number;
      external: number;
      internal_pct: number | null;
      external_pct: number | null;
    };
    internal: InternalFigures & { by_channel: Record<string, ChannelFigures> };
    external: PublicFigures;
  };
  businesses: Business[];
  brief: {
    needs_you: BriefItem[];
    building: BriefItem[];
    improving: BriefItem[];
    rules: string;
  };
  md_mail: {
    total: number;
    rows: { theme: string; label: string; mails: number; resolved: number }[];
  };
  cards: CardsPeriod;
};

export type PeriodsFile = {
  end: string;
  public_end: string;
  default: PeriodId;
  dominance_limit: number;
  source_weights: Record<string, number>;
  periods: Record<PeriodId, Period>;
};

export const CHANNEL_ORDER = [
  "emails",
  "calls",
  "chat",
  "whatsapp",
  "social",
  "branch",
] as const;
export const CHANNEL_LABEL: Record<string, string> = {
  emails: "Emails",
  calls: "Calls",
  chat: "Chat",
  whatsapp: "WhatsApp",
  social: "Social",
  branch: "Branch",
};
