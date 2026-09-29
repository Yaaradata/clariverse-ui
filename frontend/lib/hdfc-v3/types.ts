/** Shapes of data/out/app/*.json and data/seed/*.json (produced by scripts/aggregate.py, insights.py, seed_internal.py). */

export type Prov = "public" | "internal" | "joined";
export type StatusValue =
  | "needs_you"
  | "this_week"
  | "watching"
  | "routed"
  | "improving";
export type View = "mds-office" | "head-cx";

export type Weekly = { week: string; count: number };
export type Halves = {
  mode: "trend_within_window";
  first_half: number;
  second_half: number;
  change_pct: number | null;
  first_half_dates: string;
  second_half_dates: string;
};
export type VsBaseline = {
  mode: "vs_baseline";
  window_items: number;
  baseline_items: number;
  window_share: number;
  baseline_share: number;
  change_pct: number | null;
  streams: string[];
};

export type Theme = {
  id: string;
  label: string;
  group: string;
  pillar: string;
  owner: string;
  owner_label: string;
  business: string;
  definition: string;
  count: number;
  count_group_companies: number;
  primary_count: number;
  by_source: Record<string, number>;
  by_business: Record<string, number>;
  sentiment: { positive: number; neutral: number; negative: number };
  share_negative: number | null;
  escalation_count: number;
  share_escalation: number | null;
  repeat_count: number;
  status_seeking_count: number;
  promise_break_count: number;
  closure_intent_count: number;
  weekly: Weekly[];
  weekly_all: Weekly[];
  trend: Halves;
  vs_baseline: VsBaseline | null;
  trend_mode: "vs_baseline" | "trend_within_window" | "insufficient";
  basis_share: number;
  rise_pct: number | null;
  first_seen: string | null;
  latest: string | null;
  rung: string;
  exemplars: string[];
  last_day_count: number;
  score: number;
  status: StatusValue;
  action: string;
};

export type Pillar = {
  id: string;
  label: string;
  count: number;
  sentiment: { positive: number; neutral: number; negative: number };
  net_sentiment: number | null;
  net_first_half: number | null;
  net_second_half: number | null;
  net_change_pts: number | null;
  top_themes: { id: string; label: string; count: number }[];
};

export type ThemesFile = {
  scope: string;
  total_items: number;
  basis_items: number;
  weeks: string[];
  themes: Theme[];
  pillars: Pillar[];
};

export type FlagStat = {
  count: number;
  share: number | null;
  weekly: Weekly[];
  trend: Halves;
  top_themes: { id: string; label: string; count: number }[];
  exemplars: string[];
};

export type SignalsFile = {
  scope: string;
  total_items: number;
  flags: Record<string, FlagStat> & {
    switching: {
      count: number;
      to_other_bank: number;
      from_other_bank: number;
      note: string;
    };
  };
  promise_by_request_type: {
    request_type: string;
    count: number;
    status_seeking: number;
    repeat_share: number | null;
    median_days_elapsed: number | null;
    owner: string;
    top_theme: string;
    exemplars: string[];
  }[];
  transparency_gap: {
    count: number;
    share: number | null;
    by_request_type: { request_type: string; count: number }[];
    exemplars: string[];
  };
  escalation_by_target: { target: string; rung: string; count: number }[];
  ladder_public: {
    voice_negative: number;
    repeat: number;
    escalation_language: number;
    public_posts_with_escalation: number;
    rbi_or_ombudsman_mentions: number;
    climb_themes: { id: string; label: string; count: number }[];
  };
  voices_with_reach: {
    id: string;
    who: string;
    reach: number;
    theme: string;
    theme_label: string;
    owner: string;
    escalation: boolean;
    created_at: string;
  }[];
  closure_intent: {
    count: number;
    drivers: { id: string; label: string; count: number }[];
    exemplars: string[];
  };
  cure_watch: {
    count: number;
    by_theme: { id: string; label: string; count: number }[];
    exemplars: string[];
  };
  by_business: {
    business: string;
    count: number;
    repeat: number;
    escalation: number;
    negative: number;
  }[];
};

export type RatingSummary = {
  n: number;
  ratings: Record<string, number>;
  avg_rating: number;
  share_positive: number | null;
  share_negative: number | null;
};

export type FixItem = {
  issue: string;
  theme: string;
  count: number;
  owner: string;
  first_seen_version: string | null;
  latest_version_seen: string | null;
  example_ids: string[];
  feature_asks: string[];
};

export type AppPulse = {
  app: string;
  entity: string;
  group_company: boolean;
  business: string;
  streams: {
    stream: string;
    records: number;
    earliest: string;
    latest: string;
    mode: string;
    full_window: boolean;
    window_first: string | null;
  }[];
  mode: "vs_baseline" | "trend_within_window";
  window: RatingSummary | null;
  baseline: RatingSummary | null;
  trend: Halves | null;
  weekly_avg_rating: { week: string; n: number; avg_rating: number }[];
  top_issues: {
    id: string;
    label: string;
    count: number;
    exemplars: string[];
  }[];
  versions: ({ version: string } & RatingSummary)[];
  praise_exemplars: string[];
  fix_list: FixItem[];
};

export type AppPulseFile = { apps: AppPulse[]; note: string };

export type MoodFile = {
  definition: string;
  value: number | null;
  window_average: number;
  delta_pts: number | null;
  baseline_label: string;
  n_items: number;
  daily: {
    date: string;
    n: number;
    positive: number;
    negative: number;
    net: number;
    net_7d: number | null;
  }[];
};

export type Evidence = {
  id: string;
  source: string;
  source_label: string;
  created_at: string;
  url: string;
  summary: string;
  redacted_text: string;
  title: string | null;
  app_name: string | null;
  app_version: string | null;
  rating: number | null;
  themes: string[];
  sentiment: string;
  owner: string;
  entity: string;
};

export type ReleasePulse = {
  id: string;
  label: string;
  app: string;
  owner: string;
  owner_label: string;
  pillar: string;
  rung: string;
  action: string;
  status: StatusValue;
  count: number;
  n_reviews: number;
  share_positive: number | null;
  avg_rating: number;
  ranks_top: boolean;
  largest_other_theme: number;
  old_app_avg: number | null;
  old_app_n: number;
  new_app_avg: number | null;
  new_app_n: number;
  fix_list: FixItem[];
  versions: ({ version: string } & RatingSummary)[];
  exemplars: string[];
  praise_exemplars: string[];
  daily_negative: { date: string; count: number }[];
  coverage: string[];
  trend_label: string;
};

export type Briefing = {
  needs_you: string[];
  this_week: string[];
  improving: string[];
  since_830: {
    theme: string;
    label: string;
    count: number;
    owner: string;
    owner_label: string;
    exemplars: string[];
  }[];
  since_830_total: number;
  since_830_from: string;
  top_riser: string | null;
  routing: {
    owner: string;
    owner_label: string;
    themes: { id: string; label: string; count: number; status: StatusValue }[];
    total: number;
  }[];
  release_pulse: ReleasePulse | null;
  ranking_rule: string;
};

export type Meta = {
  as_of: string;
  brief_date: string;
  brief_label: string;
  brief_time: string;
  window: { start: string; end: string };
  provenance: Record<Prov, string>;
  scope_note: string;
  records: {
    total: number;
    by_source: Record<string, number>;
    window: number;
    bank_on_topic_window: number;
    group_on_topic_window: number;
    classified_by: Record<string, number>;
  };
  bank_by_source: Record<string, number>;
  trend_basis_streams: string[];
  baseline_streams: string[];
  coverage_notes: string[];
  icici_available: boolean;
};

export type AskEntry = {
  id: string;
  prompt: string;
  keywords: string[];
  answer: string;
  evidence: string[];
  links: { label: string; href: string }[];
};
export type AskFile = { prompts: AskEntry[]; fallback: string };

export type Internal = Record<string, unknown>;

export type Bundle = {
  themes: ThemesFile;
  signals: SignalsFile;
  pulse: AppPulseFile;
  mood: MoodFile;
  briefing: Briefing;
  meta: Meta;
  evidence: Record<string, Evidence>;
  ask: AskFile;
  internal: Internal;
  joined: Internal;
  products: ProductsFile;
  storeSeries: StoreSeriesFile;
  responses: ResponsesFile;
  v3: InternalV3;
};

/* ---------------------------------------------------------------- V3 (B7) */

export type ProductId =
  | "cards"
  | "payzapp"
  | "accounts"
  | "personal_loans"
  | "home_loans"
  | "auto_loans"
  | "insurance"
  | "digital";

export type PublicProductRow = {
  id: ProductId;
  label: string;
  owner: string;
  module: string | null;
  count: number;
  negative: number;
  escalation: number;
  repeat: number;
  promise_break_mentions: number;
  share_negative: number | null;
  trend_change_pct: number | null;
  top_issue: { id: string; label: string; negative: number } | null;
  issues: {
    id: string;
    label: string;
    count: number;
    negative: number;
    escalation: number;
  }[];
};

export type ProductsFile = {
  note: string;
  loan_split: Record<string, number>;
  rows: PublicProductRow[];
  excluded: Record<string, number>;
  total_rows: number;
  total_items: number;
  reconciles: boolean;
  trend_rule: string;
};

export type StoreSummary = {
  n: number;
  avg_rating: number | null;
  share_negative: number | null;
  share_positive: number | null;
};

export type StoreSeries = {
  store: "appstore" | "playstore";
  store_label: string;
  records: number;
  export_start: string;
  export_end: string;
  starts_mid_window: boolean;
  window: StoreSummary;
  halves: { first: StoreSummary; second: StoreSummary; comparable: boolean };
  weekly: ({ week: string } & StoreSummary)[];
  versions: ({ version: string } & StoreSummary)[];
  by_major: Record<string, StoreSummary>;
  replies: number;
};

export type StoreSeriesFile = {
  rule: string;
  apps: { app: string; stores: StoreSeries[] }[];
};

export type ReplyStats = {
  reviews: number;
  responded: number;
  responded_pct: number | null;
  open: number;
  open_pct: number | null;
  open_too_long: number;
  open_too_long_pct_of_open: number | null;
  median_reply_hours: number | null;
  replied_within_48h: number;
  redirect_only: number;
  redirect_only_pct_of_replied: number | null;
};

export type ResponsesFile = {
  definition: string;
  scope_note: string;
  replies_available: boolean;
  reviews_in_scope: number;
  all: ReplyStats;
  negative: ReplyStats;
  by_app: Record<string, ReplyStats>;
  responded: number | null;
  open_too_long: number | null;
  pending_note: string;
};

export type Dial = {
  total: number;
  closed: number;
  closed_or_responded: number;
  open: number;
  open_too_long: number;
  closed_or_responded_pct: number | null;
  open_pct: number | null;
  open_too_long_pct_of_open: number | null;
};

export type DeliverableStats = {
  measured: number;
  met: number;
  outside: number;
  met_pct: number | null;
  open_within: number;
};

export type InternalProductRow = Dial & {
  id: ProductId;
  label: string;
  negative: number;
  high_impact: number;
  deliverables: DeliverableStats;
  negative_weekly: Weekly[];
  negative_change_pct: number | null;
  top_issue: { id: string; label: string; negative: number } | null;
  by_channel: Record<string, number>;
};

export type CohortRow = {
  id: string;
  label: string;
  source: string;
  customers: number;
  interactions: number;
  customers_with_open_issue: number;
  open: number;
  open_over_5h: number;
  open_over_24h: number;
  open_too_long: number;
  negative: number;
  negative_by_channel: Record<string, number>;
  products_affected: Record<string, number>;
  rm_should_know: number;
  rm_notified_today: number;
  added_this_week: number;
  added_this_week_by_lisn: number;
};

export type TrailStep = {
  at: string;
  product: ProductId;
  product_label: string;
  team: string;
  theme: string;
  theme_label: string;
  summary: string;
  flag_set: boolean;
  flag_follows: boolean;
  event: boolean;
  id: string | null;
  channel: string;
  channel_label: string;
  sender: "customer" | "proxy" | null;
  sentiment: string | null;
  status: "open" | "closed" | null;
  first_response_at?: string | null;
  deliverable_due?: string;
  breached?: boolean;
  high_impact: string[];
};

export type Persona = {
  masked_id: string;
  persona: string;
  descriptor: string;
  segment: string;
  cohorts: string[];
  products: ProductId[];
  rm_id: string | null;
  proxy_contacts: number;
  rm_notified: boolean;
  story?: boolean;
  cohort_added_at?: string;
  cohort_added_by?: string;
  latest: { at: string; channel: string; product: ProductId; summary: string };
  open: number;
  oldest_open_hours: number | null;
  trail: TrailStep[];
};

export type LedgerRow = DeliverableStats & {
  id: string;
  label: string;
  tat_label: string;
  source: "rbi" | "bank";
  source_note: string | null;
  compensation: string;
  total: number;
  open_too_long: number;
  themes: string[];
  products: (DeliverableStats & {
    product: ProductId;
    label: string;
    total: number;
    open_too_long: number;
  })[];
};

export type EscalationEmail = {
  id: string;
  received_at: string;
  sender: "customer" | "proxy";
  product: ProductId;
  product_label: string;
  theme: string;
  theme_label: string;
  language: string;
  subject: string;
  body: string;
  backend_status: string;
  bucket: string;
  bucket_label: string;
  draft_reply?: string;
};

export type InternalV3 = {
  label: string;
  note: string;
  now: string;
  window: { start: string; end: string };
  sample: { customers: number; interactions: number; bot_calls: number };
  dials: Dial;
  products: InternalProductRow[];
  channels: (Dial & { channel: string; label: string; negative: number })[];
  cohorts: CohortRow[];
  high_impact: {
    total: number;
    open: number;
    open_too_long: number;
    reasons: { id: string; label: string; count: number }[];
    by_product: Record<string, number>;
  };
  customer_memory: {
    customers_with_signals: number;
    multi_product: number;
    negative_in_two_or_more_products: number;
    with_open_issue: number;
    with_open_too_long: number;
    priority_among_them: number;
    pairs: { pair: string; customers: number }[];
  };
  deliverables: LedgerRow[];
  cards_issues: {
    theme: string;
    label: string;
    interactions: number;
    negative: number;
    open: number;
    open_too_long: number;
    deliverable: string;
    deliv_met_pct: number | null;
    public_mentions: number;
    public_negative: number;
  }[];
  personas: Persona[];
  bot_calls: {
    total: number;
    resolved: number;
    unresolved: number;
    follow_up_after_unresolved: number;
    priority_unresolved: number;
    by_reason: { reason: string; calls: number; resolved: number }[];
  };
  rm: { should_know: number; notified_today: number; rule: string };
  triage: {
    total: number;
    buckets: { id: string; label: string; count: number }[];
    manual_minutes_per_email: number;
    assisted_minutes_per_email: number;
    baseline_days_to_resolve: number;
    projected_days_to_resolve: number;
  };
  emails: EscalationEmail[];
  channel_labels: Record<string, string>;
  high_impact_labels: Record<string, string>;
  qa: { theme_mix_pass: boolean; reconcile_pass: boolean };
};
