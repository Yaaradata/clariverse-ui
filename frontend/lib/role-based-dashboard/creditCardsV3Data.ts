// ═══════════════════════════════════════════════════════════════════════════
// HEAD OF CREDIT CARDS — executive dashboard mock data
// Built to the "Head of Credit Cards Dashboard — Design Ideas & Component
// Blueprint" spec. Mirrors the Head of Retail Banking pattern exactly:
//   • 2-layer drill-down
//   • 3 Overview tiles  → AI Risk Spike Monitor → Floating AI Day Generator
//   • 3 drill-downs × 6–7 components each, 3-column layout, row 7 full-width
//   • Every component carries a ✨ AI flavor
// Data sources: Email · Voice · Chat · Social · Tickets — ONLY.
// ═══════════════════════════════════════════════════════════════════════════

export const V3_CHANNELS = ["Voice", "Chat", "Email", "Social", "Tickets"] as const;
export type V3Channel = (typeof V3_CHANNELS)[number];

// ───────────────────────────────────────────────────────────────────────────
// Journey drill — Top Intent by NPS segment (click HSHF / HSLF / LSHF / LSLF)
// ───────────────────────────────────────────────────────────────────────────

export const V3_JOURNEY_INTENT_SEGMENT_KEYS = ["HSHF", "HSLF", "LSHF", "LSLF"] as const;
export type V3JourneyIntentSegmentKey = (typeof V3_JOURNEY_INTENT_SEGMENT_KEYS)[number];

export type V3JourneyTopIntentSlice = {
  /** Headline next to “identified” */
  identifiedCount: number;
  /** Four intents: stacked bar segments + legend (credit-card themes) */
  intents: readonly { label: string; count: number; color: string }[];
};

/** All segments combined — default view */
export const V3_JOURNEY_TOP_INTENT_AGGREGATE: V3JourneyTopIntentSlice = {
  identifiedCount: 16,
  intents: [
    { label: "Mobile wallet & card login", count: 13, color: "#ef4444" },
    { label: "Authorizations & merchant declines", count: 10, color: "#f59e0b" },
    { label: "Fees, APR & billing disputes", count: 9, color: "#06b6d4" },
    { label: "Premium travel & RM servicing", count: 5, color: "#22c55e" },
  ],
};

export const V3_JOURNEY_TOP_INTENT_BY_SEGMENT: Record<V3JourneyIntentSegmentKey, V3JourneyTopIntentSlice> = {
  HSHF: {
    identifiedCount: 21,
    intents: [
      { label: "Points posting & partner transfers", count: 9, color: "#ef4444" },
      { label: "Annual fee & retention offers", count: 6, color: "#f59e0b" },
      { label: "Travel credits & lounge access", count: 4, color: "#06b6d4" },
      { label: "Concierge / RM response SLAs", count: 2, color: "#22c55e" },
    ],
  },
  HSLF: {
    identifiedCount: 14,
    intents: [
      { label: "Activation & digital PIN / OTP", count: 5, color: "#ef4444" },
      { label: "Credit limit & CLI requests", count: 4, color: "#f59e0b" },
      { label: "Cash-back category & merchant codes", count: 3, color: "#06b6d4" },
      { label: "Autopay & statement timing", count: 2, color: "#22c55e" },
    ],
  },
  LSHF: {
    identifiedCount: 19,
    intents: [
      { label: "Fraud blocks & CNP declines", count: 8, color: "#ef4444" },
      { label: "Chargebacks & dispute evidence", count: 6, color: "#f59e0b" },
      { label: "Payment allocation & promo APR", count: 3, color: "#06b6d4" },
      { label: "Co-brand benefit fulfillment", count: 2, color: "#22c55e" },
    ],
  },
  LSLF: {
    identifiedCount: 11,
    intents: [
      { label: "E-statement & paperless access", count: 4, color: "#ef4444" },
      { label: "Replacement card & emboss errors", count: 3, color: "#f59e0b" },
      { label: "Rewards portal & login recovery", count: 2, color: "#06b6d4" },
      { label: "General IVR / queue holds", count: 2, color: "#22c55e" },
    ],
  },
};

/** Ring badge counts under “Intent volume by segment” */
export const V3_JOURNEY_INTENT_SEGMENT_RING_COUNTS: Record<V3JourneyIntentSegmentKey, number> = {
  HSHF: 3,
  HSLF: 5,
  LSHF: 4,
  LSLF: 4,
};

// ───────────────────────────────────────────────────────────────────────────
// 3 EXECUTIVE TILES  (Screen 1)
// ───────────────────────────────────────────────────────────────────────────
export type V3Tile = {
  id: "customer_card_journey" | "market_reputation" | "fraud_fulfillment";
  title: string;
  subtitle: string;
  score: number;
  delta: number;
  deltaLabel: string;
  status: "green" | "amber" | "red";
  /** Six daily points (D1…D6, D6 = now); shape matches Head of Retail — wavy, not monotonic. */
  spark: readonly [number, number, number, number, number, number];
  subMetrics: { label: string; value: string }[];
  aiInsight: string;        // ✨ AI 2–3 sentence narrative
};

export const V3_TILES: V3Tile[] = [
  {
    id: "customer_card_journey",
    title: "Are cardholders satisfied with their journey?",
    subtitle:
      "Satisfaction from activation through loyalty vs. the experience we promised.",
    score: 68,
    delta: -4,
    deltaLabel: "▼ 4 pts WoW",
    status: "amber",
    spark: [72, 64, 71, 66, 69, 68],
    subMetrics: [
      { label: "Top pain",       value: "Reward Redeem" },
      { label: "HNI at-risk",    value: "$4.2M spend" },
      { label: "Best channel",   value: "Chat 0.72" },
      { label: "Worst channel",  value: "Social 0.49" },
    ],
    aiInsight:
      "341 activation conversations are stuck on PIN / OTP reset. Closure intent is 24%, up from 18% WoW. 18 HSHF cardholders are flagged, making activation friction the #1 journey detractor.",
  },
  {
    id: "market_reputation",
    title: "What is the market saying about us?",
    subtitle: "Reviewers, influencers, and social echo — our cards and competitors.",
    score: 61,
    delta: -8,
    deltaLabel: "▼ 8 pts WoW",
    status: "red",
    spark: [69, 58, 66, 62, 64, 61],
    subMetrics: [
      { label: "NerdWallet rank", value: "#4 (was #2)" },
      { label: "#RewardScam",     value: "+287% posts" },
      { label: "Influencer neg",  value: "3 of 5" },
      { label: "Media reach",     value: "6.4M (neg)" },
    ],
    aiInsight:
      "NerdWallet/Bankrate mentions: +142% WoW across 89 chats. Social/X at 0.41, worst channel. #RewardScam volume: +287% WoW. @CreditCardGuru takedown echoed in 34 conversations.",
  },
  {
    id: "fraud_fulfillment",
    title: "Are we keeping our service promise?",
    subtitle:
      "Dispute resolution, repeat contact, and service recovery.",
    score: 58,
    delta: -11,
    deltaLabel: "▼ 11 pts WoW",
    status: "red",
    spark: [69, 56, 63, 60, 61, 58],
    subMetrics: [
      { label: "Open disputes", value: "1,847" },
      { label: "Repr. win",     value: "38%" },
      { label: "Evidence backlog", value: "43 cases" },
      { label: "Fraud loss",    value: "$312K/wk" },
    ],
    aiInsight:
      "Service promise score fell because dispute follow-up, fee-waiver decisions, and callback misses are driving repeat contact. 43 disputes are beyond promise window; evidence collection is the leading delay.",
  },
];

// ───────────────────────────────────────────────────────────────────────────
// AI RISK SPIKE MONITOR  (below the 3 tiles)
// ───────────────────────────────────────────────────────────────────────────
export type V3Spike = {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "WATCH";
  channelMix: V3Channel[];
  metric: string;
  trigger: string;          // ✨ AI-classified reason the spike fired
  aiAction: string;         // recommended action
  confidence: number;       // 0–100
};

export const V3_RISK_SPIKES: V3Spike[] = [
  {
    id: "merchant-xyz",
    title: "Merchant XYZ Dispute Surge",
    severity: "CRITICAL",
    channelMix: ["Voice", "Chat"],
    metric: "847 cardholders impacted",
    trigger:
      "Single merchant double-charging 847 cardholders; Voice + Chat flooded with \"I didn't make this purchase\" in the last 6 hours.",
    aiAction: "Freeze recurring authorizations for Merchant XYZ · batch reissue 100%",
    confidence: 94,
  },
  {
    id: "cnp-mcc-7995",
    title: "CNP Fraud Cluster — MCC 7995",
    severity: "CRITICAL",
    channelMix: ["Voice", "Tickets"],
    metric: "89 cards flagged · $47K/wk exposure",
    trigger:
      "Gaming merchant category pattern detected: $1–$5 test transactions followed by $200–$800 hits. 23 voice calls mention \"I got a text code I didn't request\".",
    aiAction: "Throttle MCC 7995 velocity · step-up 3DS for affected BINs",
    confidence: 91,
  },
  {
    id: "reward-devaluation",
    title: "Reward Devaluation Trending",
    severity: "HIGH",
    channelMix: ["Social", "Voice"],
    metric: "1.8M impressions · 67 retention calls (48h)",
    trigger:
      "#RewardScam reaching 1.8M impressions; Reddit r/CreditCards thread at 3,400 upvotes; 67 retention calls in 48h referencing point value change.",
    aiAction: "Publish point-value FAQ · brief creator partners within 24h",
    confidence: 88,
  },
  {
    id: "hni-churn",
    title: "HSHF Churn Signals",
    severity: "CRITICAL",
    channelMix: ["Voice", "Tickets"],
    metric: "5 HSHF · $4.2M combined annual spend",
    trigger:
      "5 high spend high frequency cardholders (combined $4.2M annual spend) actively expressing closure intent. 3 cited CompetitorY's 5% cashback in retention calls.",
    aiAction: "Assign RM outreach today · pre-approve retention offers",
    confidence: 96,
  },
  {
    id: "bpo-evidence-bottleneck",
    title: "Dispute Evidence Queue Backlog",
    severity: "CRITICAL",
    channelMix: ["Tickets", "Email"],
    metric: "43 high-priority cases stalled in evidence collection",
    trigger:
      "43 disputes stuck 3+ days in evidence collection; BPO Vendor Beta accounts for 31 — customers citing repeated follow-ups and no resolution path.",
    aiAction: "Surge in-house review on stalled cases · reroute complex work off Vendor Beta",
    confidence: 99,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// ✨ AI DAY GENERATOR — card-specific starter prompts
// ───────────────────────────────────────────────────────────────────────────
export const V3_AI_DAY_PROMPTS: string[] = [
  "Which HNI cardholders are at churn risk this week and why?",
  "Why is Friendly-Fraud representment win rate at 38% — what's causing it?",
  "Which merchants are driving the most dispute volume this week?",
  "What reward topics are spiking on social right now?",
  "Where is our NerdWallet ranking slipping and who's overtaking us?",
  "Which dispute stages are taking longest to clear this week?",
  "Which competitors are our customers mentioning most in retention calls?",
  "Where is our brand promise gap widest this week?",
  "Summarise today's card-ops posture for me in 3 bullets",
  "What does the Workforce console say about Vendor Beta — should we cut them?",
];

// ═══════════════════════════════════════════════════════════════════════════
// DRILL 1 — Cardholder Journey Health Command Center (primary drill UI)
// Conversation-signal mock data: NLP tags, not core-system numbers.
// ═══════════════════════════════════════════════════════════════════════════

export type V3HeatLevel = "L" | "M" | "H";

export const V3_JOURNEY_COMMAND = {
  health: {
    score: 62,
    max: 100,
    status: "At Risk" as const,
    drivers: [
      { id: "activation", label: "Activation Friction", score: 71, meaning: "Are new cardholders able to start using the card smoothly?" },
      { id: "usage", label: "Usage Confidence", score: 58, meaning: "Are customers facing declines, app issues, payment failures?" },
      { id: "value", label: "Value Perception", score: 49, meaning: "Do customers feel rewards, fees, benefits are worth it?" },
      { id: "retention", label: "Retention Risk", score: 43, meaning: "Are customers showing closure / downgrade / switch intent?" },
    ],
  },
  aiDiagnosis: {
    primaryIssue:
      "Cardholders are not questioning the product itself; they are questioning whether card benefits are reliable and visible when it matters.",
    whatChanged: "Rewards and cashback complaints increased 18.5% in the last 30 days. Churn language is strongest in Premium and Cashback segments.",
    businessRisk:
      "High-value customers mention annual fee, lounge access, and reward dilution in the same conversation threads — value-perception risk, not only service delay.",
    action:
      "Fix reward-status visibility, prepare retention scripts for fee-waiver moments, and prioritise callback for dispute cases with repeat contact.",
  },
  whereBreaking: [
    { stage: "Applied / Onboarded", conv: 4_120, negPct: 22, repeatPct: 12, mainPain: "KYC / doc follow-up" },
    { stage: "Card Delivered", conv: 2_180, negPct: 28, repeatPct: 18, mainPain: "Delayed card / wrong address" },
    { stage: "Activated", conv: 3_420, negPct: 36, repeatPct: 31, mainPain: "PIN setup / OTP failure" },
    { stage: "First Spend", conv: 4_980, negPct: 41, repeatPct: 27, mainPain: "Card declined" },
    { stage: "Regular Usage", conv: 9_860, negPct: 32, repeatPct: 22, mainPain: "Limit / app controls" },
    { stage: "Rewards / Billing", conv: 8_740, negPct: 48, repeatPct: 34, mainPain: "Cashback missing" },
    { stage: "Dispute / Support", conv: 5_620, negPct: 52, repeatPct: 47, mainPain: "Slow dispute update" },
    { stage: "Retention / Closure", conv: 1_240, negPct: 68, repeatPct: 39, mainPain: "Annual fee not worth it" },
  ],
  frictionMap: {
    rows: [
      { issue: "Activation / PIN", Voice: "H" as V3HeatLevel, Chat: "H" as V3HeatLevel, Email: "L" as V3HeatLevel, Ticket: "M" as V3HeatLevel, Social: "L" as V3HeatLevel },
      { issue: "Card Declines", Voice: "H" as V3HeatLevel, Chat: "M" as V3HeatLevel, Email: "L" as V3HeatLevel, Ticket: "M" as V3HeatLevel, Social: "M" as V3HeatLevel },
      { issue: "Rewards Missing", Voice: "M" as V3HeatLevel, Chat: "H" as V3HeatLevel, Email: "M" as V3HeatLevel, Ticket: "H" as V3HeatLevel, Social: "H" as V3HeatLevel },
      { issue: "Annual Fee", Voice: "H" as V3HeatLevel, Chat: "M" as V3HeatLevel, Email: "M" as V3HeatLevel, Ticket: "L" as V3HeatLevel, Social: "M" as V3HeatLevel },
      { issue: "Dispute Delay", Voice: "H" as V3HeatLevel, Chat: "H" as V3HeatLevel, Email: "H" as V3HeatLevel, Ticket: "H" as V3HeatLevel, Social: "M" as V3HeatLevel },
      { issue: "Closure Intent", Voice: "H" as V3HeatLevel, Chat: "M" as V3HeatLevel, Email: "L" as V3HeatLevel, Ticket: "M" as V3HeatLevel, Social: "H" as V3HeatLevel },
    ],
    channels: ["Voice", "Chat", "Email", "Ticket", "Social"] as const,
  },
  frictionInsight:
    "Rewards complaints concentrate in chat and social. Dispute delays are high across all service channels — pattern points to process and visibility, not a single team.",
  churnRadar: [
    { segment: "Premium / HNI", closure: "3.8%", downgrade: "5.4%", competitor: 142, risk: "High" as const },
    { segment: "Travel Cards", closure: "4.6%", downgrade: "3.9%", competitor: 98, risk: "Medium" as const },
    { segment: "Cashback Cards", closure: "6.2%", downgrade: "2.1%", competitor: 186, risk: "High" as const },
    { segment: "Starter / Mass", closure: "9.4%", downgrade: "1.2%", competitor: 74, risk: "Medium" as const },
  ],
  churnPhrases: [
    "cancel my card",
    "annual fee not worth it",
    "switching to another card",
    "downgrade my card",
    "better cashback elsewhere",
  ],
  benefitTrust: [
    { area: "Cashback", sentiment: "Negative" as const, complaints: 1_420, mainIssue: "Cashback not posted" },
    { area: "Reward Points", sentiment: "Negative" as const, complaints: 980, mainIssue: "Redemption failure" },
    { area: "Lounge Access", sentiment: "Negative" as const, complaints: 620, mainIssue: "Access denied" },
    { area: "Offers / Coupons", sentiment: "Neutral" as const, complaints: 440, mainIssue: "Eligibility confusion" },
    { area: "Fee Waiver", sentiment: "Negative" as const, complaints: 760, mainIssue: "Waiver not applied" },
    { area: "EMI Offers", sentiment: "Neutral" as const, complaints: 390, mainIssue: "Conversion confusion" },
  ],
  usageConfidence: [
    { issue: "Card declined", conversations: 2_840, sentiment: -0.56, repeatPct: 31 },
    { issue: "International transaction blocked", conversations: 920, sentiment: -0.42, repeatPct: 26 },
    { issue: "Contactless not working", conversations: 540, sentiment: -0.34, repeatPct: 18 },
    { issue: "Limit blocked / reduced", conversations: 1_180, sentiment: -0.49, repeatPct: 29 },
    { issue: "App card controls failed", conversations: 760, sentiment: -0.38, repeatPct: 24 },
    { issue: "OTP / authentication failure", conversations: 1_460, sentiment: -0.51, repeatPct: 35 },
  ],
  disputeTrust: {
    disputeConversations: 5_620,
    repeatContactPct: 47,
    agingMentions: 43,
    negSentimentPct: 52,
    topFraudType: "Friendly fraud",
    mainComplaint: "No status update",
    aiNote:
      "Repeat contact on disputes increased from 39% to 47%. Cardholders are upset about lack of visibility after opening a case — not only the fraud event itself.",
  },
  unhappinessTree: {
    label: "Cardholder Unhappiness",
    children: [
      {
        label: "Usage Failure",
        children: [
          { label: "Card declined" },
          { label: "OTP / PIN failed" },
          { label: "App card controls not working" },
        ],
      },
      {
        label: "Value Perception",
        children: [
          { label: "Cashback missing" },
          { label: "Reward points expired" },
          { label: "Lounge access denied" },
          { label: "Annual fee not justified" },
        ],
      },
      {
        label: "Billing Confusion",
        children: [
          { label: "Statement not understood" },
          { label: "EMI conversion issue" },
          { label: "Late fee dispute" },
        ],
      },
      {
        label: "Fraud / Dispute",
        children: [
          { label: "Unauthorized transaction" },
          { label: "Dispute aging" },
          { label: "No update from support" },
        ],
      },
      {
        label: "Retention Risk",
        children: [
          { label: "Cancel card" },
          { label: "Switch to competitor" },
          { label: "Downgrade card" },
        ],
      },
    ],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DRILL 1 — Interactive “Journey Health” command center (selection-driven)
// Conversation-signal mock data only. Keys used by `CustomerCardJourneyV3Drill`.
// ═══════════════════════════════════════════════════════════════════════════

export type V3JourneyDrillStageId =
  | "activation"
  | "first_spend"
  | "usage"
  | "rewards_billing"
  | "disputes"
  | "retention";

export type V3JourneySignalId =
  | "cashback_missing"
  | "reward_redemption"
  | "annual_fee"
  | "fee_waiver"
  | "statement_confusion"
  | "closure_intent";

export const V3_JOURNEY_HEATMAP_CHANNELS = ["Voice", "Chat", "Email", "Ticket", "Social"] as const;
export type V3JourneyHeatmapChannel = (typeof V3_JOURNEY_HEATMAP_CHANNELS)[number];

export const V3_JOURNEY_SIGNAL_LABELS: Record<V3JourneySignalId, string> = {
  cashback_missing: "Cashback missing",
  reward_redemption: "Reward redemption",
  annual_fee: "Annual fee",
  fee_waiver: "Fee waiver",
  statement_confusion: "Statement confusion",
  closure_intent: "Closure intent",
};

export type V3JourneySegmentLens = "all" | "premium" | "travel" | "cashback" | "starter";
export type V3JourneyPainTab = "benefits" | "usage" | "billing" | "disputes" | "retention";

export type V3JourneyCellDetail = {
  conversations: number;
  repeatPct: number;
  topPhrase: string;
  worstSegment: string;
  churnPct: string;
};

export type V3JourneyStageInteractive = {
  id: V3JourneyDrillStageId;
  shortLabel: string;
  health: "Good" | "Watch" | "At Risk" | "Critical";
  conversations: number;
  negPct: number;
  repeatPct: number;
  deepDive: {
    summary: string;
    churnLangPct: number;
    mainPain: string;
    worstSegment: string;
  };
  ai: {
    mainIssue: string;
    whatChanged: string;
    whoImpacted: string;
    action: string;
  };
  heatmap: Record<V3JourneySignalId, Record<V3JourneyHeatmapChannel, V3HeatLevel>>;
  cellDetails: Partial<Record<string, V3JourneyCellDetail>>;
  churnPanel: {
    closureIntent: string;
    downgradeIntent: string;
    competitorMentions: number;
    annualFeeFrustration: "Low" | "Medium" | "High";
    risk: "High" | "Medium" | "Low";
    phrases: string[];
  };
  churnByLens: Partial<
    Record<
      Exclude<V3JourneySegmentLens, "all">,
      {
        closureIntent: string;
        downgradeIntent: string;
        competitorMentions: number;
        annualFeeFrustration: "Low" | "Medium" | "High";
        risk: "High" | "Medium" | "Low";
      }
    >
  >;
  painDrivers: Record<
    V3JourneyPainTab,
    { driver: string; conversations: number; sentiment: string; repeat: string; churn: string }[]
  >;
  evidence: { channel: string; segment: string; tone: string; quote: string }[];
  recommended: { action: string; owner: string; impact: string; priority: "High" | "Medium" | "Low" }[];
};

export const V3_JOURNEY_INTERACTIVE_DEFAULT_STAGE: V3JourneyDrillStageId = "rewards_billing";
export const V3_JOURNEY_INTERACTIVE_DEFAULT_SIGNAL: V3JourneySignalId = "cashback_missing";
export const V3_JOURNEY_INTERACTIVE_DEFAULT_CHANNEL: V3JourneyHeatmapChannel = "Chat";

const H = "H" as const;
const M = "M" as const;
const L = "L" as const;

function cell(
  conversations: number,
  repeatPct: number,
  topPhrase: string,
  worstSegment: string,
  churnPct: string,
): V3JourneyCellDetail {
  return { conversations, repeatPct, topPhrase, worstSegment, churnPct };
}

/** Mock detail when a cell has no explicit entry (still feels conversation-derived). */
export function v3JourneyFallbackCellDetail(
  stage: Pick<V3JourneyStageInteractive, "conversations" | "negPct">,
  signalLabel: string,
  channel: string,
): V3JourneyCellDetail {
  const base = Math.max(120, Math.round(stage.conversations * 0.02 + stage.negPct * 8));
  return {
    conversations: base,
    repeatPct: Math.min(52, 18 + Math.round(stage.negPct / 3)),
    topPhrase: `${signalLabel.toLowerCase()} — mixed phrasing`,
    worstSegment: "Cashback Cards",
    churnPct: `${(4 + stage.negPct / 20).toFixed(1)}%`,
  };
}

export const V3_JOURNEY_INTERACTIVE_STAGES: readonly V3JourneyStageInteractive[] = [
  {
    id: "activation",
    shortLabel: "Activation",
    health: "Good",
    conversations: 3_420,
    negPct: 36,
    repeatPct: 31,
    deepDive: {
      summary:
        "PIN and OTP friction clusters in chat and voice — cardholders are willing to activate but authentication flows break trust early.",
      churnLangPct: 2.1,
      mainPain: "PIN setup / OTP failure",
      worstSegment: "Starter / Mass",
    },
    ai: {
      mainIssue: "Authentication loops are the dominant early-journey failure mode in conversations.",
      whatChanged: "OTP non-delivery mentions are up 9% WoW in chat transcripts.",
      whoImpacted: "New cardholders and mass-segment digital-first applicants.",
      action: "Fix SMS gateway cutover + add in-app OTP fallback; monitor Vendor Beta IVR scripts.",
    },
    heatmap: {
      cashback_missing: { Voice: L, Chat: L, Email: L, Ticket: L, Social: L },
      reward_redemption: { Voice: L, Chat: M, Email: L, Ticket: M, Social: L },
      annual_fee: { Voice: L, Chat: L, Email: M, Ticket: L, Social: L },
      fee_waiver: { Voice: M, Chat: M, Email: L, Ticket: M, Social: L },
      statement_confusion: { Voice: L, Chat: M, Email: M, Ticket: M, Social: L },
      closure_intent: { Voice: M, Chat: L, Email: L, Ticket: M, Social: L },
    },
    cellDetails: {
      "reward_redemption|Chat": cell(510, 29, "“points not visible after activation”", "Travel Cards", "3.1%"),
      "fee_waiver|Voice": cell(380, 33, "“waive fee if card not working”", "Premium / HNI", "2.4%"),
    },
    churnPanel: {
      closureIntent: "1.2%",
      downgradeIntent: "0.8%",
      competitorMentions: 42,
      annualFeeFrustration: "Low",
      risk: "Low",
      phrases: ["“SMS code never arrives”", "“can’t verify for activation”", "“app keeps asking for PIN”"],
    },
    churnByLens: {
      premium: { closureIntent: "0.7%", downgradeIntent: "0.5%", competitorMentions: 18, annualFeeFrustration: "Low", risk: "Low" },
      travel: { closureIntent: "1.0%", downgradeIntent: "0.9%", competitorMentions: 24, annualFeeFrustration: "Low", risk: "Low" },
      cashback: { closureIntent: "1.4%", downgradeIntent: "1.0%", competitorMentions: 31, annualFeeFrustration: "Medium", risk: "Medium" },
      starter: { closureIntent: "2.1%", downgradeIntent: "1.2%", competitorMentions: 38, annualFeeFrustration: "Medium", risk: "Medium" },
    },
    painDrivers: {
      benefits: [
        { driver: "Welcome bonus not showing", conversations: 620, sentiment: "Negative", repeat: "28%", churn: "1.2%" },
        { driver: "Lounge not linked post-activation", conversations: 410, sentiment: "Negative", repeat: "22%", churn: "0.8%" },
        { driver: "App shows wrong reward tier", conversations: 380, sentiment: "Negative", repeat: "19%", churn: "0.9%" },
        { driver: "Offer code rejected at first spend", conversations: 290, sentiment: "Neutral", repeat: "15%", churn: "0.5%" },
      ],
      usage: [
        { driver: "OTP / PIN failure at activation", conversations: 1_120, sentiment: "Negative", repeat: "35%", churn: "2.0%" },
        { driver: "App link expired", conversations: 540, sentiment: "Negative", repeat: "27%", churn: "1.4%" },
        { driver: "IVR loop", conversations: 480, sentiment: "Negative", repeat: "31%", churn: "1.1%" },
        { driver: "KYC re-prompt", conversations: 360, sentiment: "Negative", repeat: "24%", churn: "0.9%" },
      ],
      billing: [
        { driver: "First charge before card arrived", conversations: 220, sentiment: "Negative", repeat: "18%", churn: "0.4%" },
        { driver: "EMI not selectable at checkout", conversations: 180, sentiment: "Neutral", repeat: "14%", churn: "0.3%" },
        { driver: "Fee displayed before use", conversations: 150, sentiment: "Neutral", repeat: "12%", churn: "0.2%" },
      ],
      disputes: [
        { driver: "Not activated but charged", conversations: 90, sentiment: "Negative", repeat: "22%", churn: "0.2%" },
        { driver: "Duplicate KYC case", conversations: 70, sentiment: "Negative", repeat: "19%", churn: "0.1%" },
      ],
      retention: [
        { driver: "Want to cancel before first use", conversations: 140, sentiment: "Negative", repeat: "26%", churn: "2.0%" },
        { driver: "Competitor signup bonus comparison", conversations: 110, sentiment: "Negative", repeat: "18%", churn: "0.5%" },
      ],
    },
    evidence: [
      { channel: "Chat", segment: "Starter / Mass", tone: "Negative", quote: "“I entered OTP five times. Still not activated. This is a joke.”" },
      { channel: "Voice", segment: "Travel Cards", tone: "Negative", quote: "“The IVR said success but the app still shows inactive.”" },
      { channel: "Ticket", segment: "Premium / HNI", tone: "Repeat contact", quote: "“Second ticket — your agent promised activation in 2h.”" },
    ],
    recommended: [
      { action: "Ship OTP + app handoff fix with product + digital", owner: "Digital + Cards Product", impact: "Cut early-drop activation loops", priority: "High" },
      { action: "Retrain chat macros for activation failure triage", owner: "Service Design", impact: "Lower repeat + protect Month-1 NPS", priority: "Medium" },
      { action: "IVR A/B: shorter PIN path to agent", owner: "Voice Platform", impact: "Reduce voice abandon", priority: "Medium" },
    ],
  },
  {
    id: "first_spend",
    shortLabel: "First Spend",
    health: "Watch",
    conversations: 4_980,
    negPct: 41,
    repeatPct: 27,
    deepDive: {
      summary: "First swipe failures concentrate on declines and MCC blocks — value promise feels broken at the exact moment of trial.",
      churnLangPct: 3.4,
      mainPain: "Card declined",
      worstSegment: "Travel Cards",
    },
    ai: {
      mainIssue: "First-transaction confidence is the top drop-off; declines dominate transcript themes.",
      whatChanged: "Cross-border and fuel MCC block mentions are up 11% in 30 days on chat.",
      whoImpacted: "Travel and cashback segments seeing international controls messaging.",
      action: "Tune risk messaging at checkout, expand contactless limit education, and fast-track re-try for clean customers.",
    },
    heatmap: {
      cashback_missing: { Voice: M, Chat: M, Email: L, Ticket: M, Social: M },
      reward_redemption: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      annual_fee: { Voice: M, Chat: M, Email: M, Ticket: L, Social: M },
      fee_waiver: { Voice: M, Chat: M, Email: M, Ticket: M, Social: L },
      statement_confusion: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      closure_intent: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
    },
    cellDetails: {
      "cashback_missing|Ticket": cell(480, 31, "“declined and lost cashback on first txn”", "Cashback Cards", "3.2%"),
    },
    churnPanel: {
      closureIntent: "2.8%",
      downgradeIntent: "1.6%",
      competitorMentions: 64,
      annualFeeFrustration: "Medium",
      risk: "Medium",
      phrases: ["“card declined at restaurant”", "“first payment failed”", "“embarrassed at the counter”"],
    },
    churnByLens: {
      premium: { closureIntent: "2.0%", downgradeIntent: "1.1%", competitorMentions: 28, annualFeeFrustration: "High", risk: "Medium" },
      travel: { closureIntent: "3.1%", downgradeIntent: "1.9%", competitorMentions: 44, annualFeeFrustration: "Medium", risk: "Medium" },
      cashback: { closureIntent: "3.4%", downgradeIntent: "1.2%", competitorMentions: 51, annualFeeFrustration: "Low", risk: "Medium" },
      starter: { closureIntent: "3.8%", downgradeIntent: "1.4%", competitorMentions: 58, annualFeeFrustration: "Low", risk: "High" },
    },
    painDrivers: {
      benefits: [
        { driver: "First-spend offer not applied", conversations: 720, sentiment: "Negative", repeat: "32%", churn: "2.1%" },
        { driver: "MCC cashback exclusion surprise", conversations: 540, sentiment: "Negative", repeat: "27%", churn: "1.6%" },
        { driver: "Reward accrual delay", conversations: 410, sentiment: "Negative", repeat: "24%", churn: "1.2%" },
      ],
      usage: [
        { driver: "Card declined (first txn)", conversations: 1_240, sentiment: "Negative", repeat: "31%", churn: "2.2%" },
        { driver: "International block on first travel swipe", conversations: 620, sentiment: "Negative", repeat: "28%", churn: "1.4%" },
        { driver: "Contactless fail at POS", conversations: 380, sentiment: "Negative", repeat: "22%", churn: "0.9%" },
        { driver: "Wallet provisioning delay", conversations: 340, sentiment: "Negative", repeat: "20%", churn: "0.8%" },
      ],
      billing: [
        { driver: "EMI not offered at first txn", conversations: 260, sentiment: "Neutral", repeat: "16%", churn: "0.4%" },
        { driver: "Fee charged before reward posts", conversations: 190, sentiment: "Negative", repeat: "18%", churn: "0.3%" },
      ],
      disputes: [
        { driver: "Fraud block on first spend", conversations: 210, sentiment: "Negative", repeat: "24%", churn: "0.2%" },
      ],
      retention: [
        { driver: "Wants competitor card after decline", conversations: 160, sentiment: "Negative", repeat: "21%", churn: "1.1%" },
      ],
    },
    evidence: [
      { channel: "Chat", segment: "Cashback Cards", tone: "Negative", quote: "“First purchase declined. I almost walked out.”" },
      { channel: "Social", segment: "Travel Cards", tone: "Negative", quote: "“Booked a trip — first charge blocked abroad.”" },
    ],
    recommended: [
      { action: "Add first-decline in-app re-try + plain-language MCC copy", owner: "Risk + Digital", impact: "Rescue first-spend success rate", priority: "High" },
    ],
  },
  {
    id: "usage",
    shortLabel: "Usage",
    health: "At Risk",
    conversations: 9_860,
    negPct: 32,
    repeatPct: 22,
    deepDive: {
      summary: "Ongoing control and limit surprises — customers can spend but do not feel in control, driving repeat service load.",
      churnLangPct: 2.2,
      mainPain: "Limit / app controls",
      worstSegment: "Premium / HNI",
    },
    ai: {
      mainIssue: "Perceived capricious blocks reduce confidence even when fraud controls are “correct” by policy.",
      whatChanged: "In-app “limit reduced” + “controls off” language spiked 14% in tickets and chat.",
      whoImpacted: "Premium and travel segments with high velocity patterns.",
      action: "Ship proactive limit-explain nudges; add same-day unfreeze path; tune VIP routing on repeat control fails.",
    },
    heatmap: {
      cashback_missing: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      reward_redemption: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      annual_fee: { Voice: M, Chat: M, Email: M, Ticket: L, Social: M },
      fee_waiver: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      statement_confusion: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      closure_intent: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
    },
    cellDetails: {
      "statement_confusion|Email": cell(420, 23, "“don’t know available limit in app”", "Premium / HNI", "2.0%"),
    },
    churnPanel: {
      closureIntent: "1.6%",
      downgradeIntent: "1.4%",
      competitorMentions: 98,
      annualFeeFrustration: "Medium",
      risk: "Medium",
      phrases: ["“limit dropped for no reason”", "“card blocked while travelling”", "“app won’t let me turn on international”"],
    },
    churnByLens: {
      premium: { closureIntent: "1.1%", downgradeIntent: "1.8%", competitorMentions: 44, annualFeeFrustration: "High", risk: "Medium" },
      travel: { closureIntent: "1.8%", downgradeIntent: "1.2%", competitorMentions: 36, annualFeeFrustration: "Low", risk: "Medium" },
      cashback: { closureIntent: "1.4%", downgradeIntent: "1.0%", competitorMentions: 52, annualFeeFrustration: "Low", risk: "Medium" },
      starter: { closureIntent: "2.0%", downgradeIntent: "0.8%", competitorMentions: 40, annualFeeFrustration: "Low", risk: "Low" },
    },
    painDrivers: {
      benefits: [
        { driver: "Top-of-wallet offer drift", conversations: 540, sentiment: "Neutral", repeat: "18%", churn: "0.6%" },
      ],
      usage: [
        { driver: "Limit reduced mid-cycle", conversations: 1_180, sentiment: "Negative", repeat: "29%", churn: "1.1%" },
        { driver: "International block", conversations: 920, sentiment: "Negative", repeat: "26%", churn: "0.8%" },
        { driver: "App card controls fail", conversations: 760, sentiment: "Negative", repeat: "24%", churn: "0.7%" },
        { driver: "Contactless reliability", conversations: 540, sentiment: "Negative", repeat: "18%", churn: "0.4%" },
      ],
      billing: [
        { driver: "Unrecognised merchant names", conversations: 380, sentiment: "Negative", repeat: "20%", churn: "0.3%" },
      ],
      disputes: [
        { driver: "Fraud false-positive frustration", conversations: 290, sentiment: "Negative", repeat: "22%", churn: "0.2%" },
      ],
      retention: [
        { driver: "Competitor spend migration language", conversations: 170, sentiment: "Negative", repeat: "16%", churn: "0.5%" },
      ],
    },
    evidence: [
      { channel: "Email", segment: "Premium / HNI", tone: "Negative", quote: "“I’m abroad — the app still shows a lower limit than the RM told me.”" },
    ],
    recommended: [
      { action: "Same-day unfreeze for verified customers + VIP queue", owner: "Risk + Service", impact: "Reduce HNI control churn language", priority: "High" },
    ],
  },
  {
    id: "rewards_billing",
    shortLabel: "Rewards / Billing",
    health: "At Risk",
    conversations: 8_740,
    negPct: 48,
    repeatPct: 34,
    deepDive: {
      summary:
        "Customers are not rejecting the card itself; they are questioning whether promised benefits are reliable when statements and accrual lag.",
      churnLangPct: 6.2,
      mainPain: "Cashback missing",
      worstSegment: "Cashback Cards",
    },
    ai: {
      mainIssue: "Rewards and fee-value complaints are driving retention risk in conversation threads.",
      whatChanged: "Rewards complaints +18.5% in 30 days on mixed channels; churn language clusters in Premium and Cashback.",
      whoImpacted: "Premium and Cashback cardholders; strongest in chat and social voice.",
      action: "Fix reward-status visibility, update fee-waiver scripts, and trigger callbacks for repeat contacts on benefit gaps.",
    },
    heatmap: {
      cashback_missing: { Voice: H, Chat: H, Email: M, Ticket: M, Social: H },
      reward_redemption: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      annual_fee: { Voice: H, Chat: M, Email: M, Ticket: L, Social: M },
      fee_waiver: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      statement_confusion: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      closure_intent: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
    },
    cellDetails: {
      "cashback_missing|Chat": cell(620, 42, "“cashback not credited”", "Cashback Cards", "6.2%"),
      "cashback_missing|Social": cell(480, 38, "“better cashback elsewhere”", "Cashback Cards", "5.8%"),
      "annual_fee|Voice": cell(720, 36, "“annual fee not worth it”", "Premium / HNI", "4.1%"),
    },
    churnPanel: {
      closureIntent: "6.2%",
      downgradeIntent: "2.1%",
      competitorMentions: 186,
      annualFeeFrustration: "High",
      risk: "High",
      phrases: ["“cashback not credited”", "“annual fee not worth it”", "“better cashback elsewhere”", "“want to close this card”"],
    },
    churnByLens: {
      premium: { closureIntent: "3.8%", downgradeIntent: "2.0%", competitorMentions: 112, annualFeeFrustration: "High", risk: "High" },
      travel: { closureIntent: "4.1%", downgradeIntent: "1.6%", competitorMentions: 78, annualFeeFrustration: "High", risk: "High" },
      cashback: { closureIntent: "6.2%", downgradeIntent: "1.1%", competitorMentions: 142, annualFeeFrustration: "Medium", risk: "High" },
      starter: { closureIntent: "7.0%", downgradeIntent: "0.9%", competitorMentions: 64, annualFeeFrustration: "Low", risk: "Medium" },
    },
    painDrivers: {
      benefits: [
        { driver: "Cashback not posted", conversations: 1_420, sentiment: "Negative", repeat: "34%", churn: "6.2%" },
        { driver: "Reward redemption failed", conversations: 980, sentiment: "Negative", repeat: "29%", churn: "4.8%" },
        { driver: "Lounge access denied", conversations: 620, sentiment: "Negative", repeat: "21%", churn: "3.4%" },
        { driver: "Fee waiver not applied", conversations: 760, sentiment: "Negative", repeat: "26%", churn: "7.1%" },
      ],
      usage: [
        { driver: "MCC exclusions on earn", conversations: 640, sentiment: "Negative", repeat: "25%", churn: "2.0%" },
        { driver: "Offer eligibility mismatch", conversations: 520, sentiment: "Negative", repeat: "22%", churn: "1.2%" },
      ],
      billing: [
        { driver: "Statement not understood", conversations: 880, sentiment: "Negative", repeat: "28%", churn: "1.5%" },
        { driver: "EMI conversion issue", conversations: 390, sentiment: "Negative", repeat: "20%", churn: "0.6%" },
        { driver: "Late fee surprise", conversations: 340, sentiment: "Negative", repeat: "24%", churn: "0.5%" },
      ],
      disputes: [
        { driver: "Provisional credit not explained", conversations: 210, sentiment: "Negative", repeat: "19%", churn: "0.2%" },
      ],
      retention: [
        { driver: "Value-for-fee language", conversations: 640, sentiment: "Negative", repeat: "31%", churn: "4.2%" },
        { driver: "Competitor bonus comparison", conversations: 420, sentiment: "Negative", repeat: "24%", churn: "2.0%" },
      ],
    },
    evidence: [
      { channel: "Chat", segment: "Cashback Cards", tone: "Negative", quote: "“Cashback still not credited after 45 days. I want to close this card.”" },
      { channel: "Voice", segment: "Premium / HNI", tone: "Negative", quote: "“Annual fee is too high if lounge access keeps failing.”" },
      { channel: "Ticket", segment: "Dispute", tone: "Repeat contact", quote: "“Third time asking for an update. No one is telling me the status.”" },
    ],
    recommended: [
      { action: "Fix reward-status visibility in app (accrual + clear dates)", owner: "Cards Product + Digital", impact: "Reduce reward-related repeat contact", priority: "High" },
      { action: "Update fee-waiver and cashback agent scripts (same call)", owner: "Service Design", impact: "Stabilise retention conversations at fee moments", priority: "High" },
      { action: "Callback queue: repeat-contact cardholders in benefit-fail threads", owner: "Collections-lite / Care", impact: "Stop churn language escalation", priority: "High" },
    ],
  },
  {
    id: "disputes",
    shortLabel: "Disputes",
    health: "Critical",
    conversations: 5_620,
    negPct: 52,
    repeatPct: 47,
    deepDive: {
      summary:
        "The dispute journey is a visibility crisis — cardholders are less angry at the charge than at silence after opening a case.",
      churnLangPct: 2.0,
      mainPain: "No status update",
      worstSegment: "Cashback Cards",
    },
    ai: {
      mainIssue: "Repeat contact on disputes is eroding trust; lack of case visibility outweighs the fraud type itself in transcripts.",
      whatChanged: "Repeat contact on disputes 39% → 47% in 60 days; aging mentions in tickets stable-high.",
      whoImpacted: "Cashback and premium segments; ticket + chat heavy.",
      action: "Prioritise status-milestone messaging; same-tier callback for 3+ touchpoints; unstick evidence queue bottlenecks.",
    },
    heatmap: {
      cashback_missing: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      reward_redemption: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      annual_fee: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      fee_waiver: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      statement_confusion: { Voice: H, Chat: H, Email: H, Ticket: H, Social: M },
      closure_intent: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
    },
    cellDetails: {
      "statement_confusion|Ticket": cell(1_120, 47, "“still no update on dispute”", "Cashback Cards", "2.1%"),
      "closure_intent|Chat": cell(480, 39, "“close my card if you can’t help”", "Travel Cards", "1.8%"),
    },
    churnPanel: {
      closureIntent: "1.1%",
      downgradeIntent: "0.9%",
      competitorMentions: 54,
      annualFeeFrustration: "Low",
      risk: "High",
      phrases: ["“no one tells me the status”", "“third follow-up on dispute”", "“where is my provisional credit”", "“case still open for weeks”"],
    },
    churnByLens: {
      premium: { closureIntent: "0.7%", downgradeIntent: "0.6%", competitorMentions: 22, annualFeeFrustration: "Low", risk: "High" },
      travel: { closureIntent: "0.9%", downgradeIntent: "0.8%", competitorMentions: 18, annualFeeFrustration: "Low", risk: "High" },
      cashback: { closureIntent: "1.2%", downgradeIntent: "0.7%", competitorMentions: 28, annualFeeFrustration: "Low", risk: "High" },
      starter: { closureIntent: "1.4%", downgradeIntent: "0.5%", competitorMentions: 14, annualFeeFrustration: "Low", risk: "Medium" },
    },
    painDrivers: {
      benefits: [
        { driver: "Provisional credit not visible", conversations: 420, sentiment: "Negative", repeat: "31%", churn: "0.4%" },
      ],
      usage: [
        { driver: "Card still blocked after dispute", conversations: 380, sentiment: "Negative", repeat: "28%", churn: "0.3%" },
      ],
      billing: [
        { driver: "Double charge on statement", conversations: 520, sentiment: "Negative", repeat: "26%", churn: "0.2%" },
        { driver: "Merchant name mismatch in dispute", conversations: 410, sentiment: "Negative", repeat: "24%", churn: "0.1%" },
      ],
      disputes: [
        { driver: "No status update (core)", conversations: 1_240, sentiment: "Negative", repeat: "47%", churn: "1.2%" },
        { driver: "Dispute aging language", conversations: 820, sentiment: "Negative", repeat: "38%", churn: "0.8%" },
        { driver: "Evidence request loop", conversations: 640, sentiment: "Negative", repeat: "35%", churn: "0.4%" },
        { driver: "Friendly-fraud label upset", conversations: 480, sentiment: "Negative", repeat: "29%", churn: "0.2%" },
      ],
      retention: [
        { driver: "Close card if dispute not resolved", conversations: 360, sentiment: "Negative", repeat: "33%", churn: "1.4%" },
      ],
    },
    evidence: [
      { channel: "Ticket", segment: "Cashback", tone: "Repeat contact", quote: "“Case open 24 days. Still no one assigned. This is ridiculous.”" },
      { channel: "Chat", segment: "Premium", tone: "Negative", quote: "“I don’t want points — I want someone to read my dispute.”" },
    ],
    recommended: [
      { action: "Status milestone bot + 48h nudge on inactivity", owner: "Dispute Ops", impact: "Cut repeat on evidence queue", priority: "High" },
      { action: "Callback for 3+ contact disputes", owner: "Care Leads", impact: "Stabilise trust during aging window", priority: "High" },
    ],
  },
  {
    id: "retention",
    shortLabel: "Retention",
    health: "Critical",
    conversations: 1_240,
    negPct: 68,
    repeatPct: 39,
    deepDive: {
      summary: "End-of-lifecycle value fights — annual fee, competitor cashback, and downgrade language dominate, often after reward or dispute disappointment.",
      churnLangPct: 7.0,
      mainPain: "Annual fee not worth it",
      worstSegment: "Starter / Mass",
    },
    ai: {
      mainIssue: "Closure and downgrade language ties fee perception to broken benefit promises, not to generic service NPS.",
      whatChanged: "“Want to close” and “not worth the fee” co-occur with rewards topics in 41% of threads.",
      whoImpacted: "Starter and cashback cohorts; premium where lounge/reward under-delivered first.",
      action: "Run targeted save paths: fee-waiver for clean disputes; retention scripts tied to accrual visibility.",
    },
    heatmap: {
      cashback_missing: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      reward_redemption: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      annual_fee: { Voice: H, Chat: H, Email: M, Ticket: M, Social: H },
      fee_waiver: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      statement_confusion: { Voice: M, Chat: M, Email: M, Ticket: M, Social: M },
      closure_intent: { Voice: H, Chat: M, Email: M, Ticket: M, Social: H },
    },
    cellDetails: {
      "closure_intent|Social": cell(320, 44, "“public post before closing”", "Travel Cards", "4.0%"),
      "annual_fee|Chat": cell(480, 36, "“fee not worth benefits”", "Starter / Mass", "6.0%"),
    },
    churnPanel: {
      closureIntent: "9.4%",
      downgradeIntent: "1.2%",
      competitorMentions: 74,
      annualFeeFrustration: "High",
      risk: "High",
      phrases: ["“cancel my card”", "“annual fee not worth it”", "“better cashback elsewhere”", "“downgrade my card”"],
    },
    churnByLens: {
      premium: { closureIntent: "3.8%", downgradeIntent: "5.4%", competitorMentions: 142, annualFeeFrustration: "High", risk: "High" },
      travel: { closureIntent: "4.6%", downgradeIntent: "3.9%", competitorMentions: 98, annualFeeFrustration: "High", risk: "Medium" },
      cashback: { closureIntent: "6.2%", downgradeIntent: "2.1%", competitorMentions: 186, annualFeeFrustration: "High", risk: "High" },
      starter: { closureIntent: "9.4%", downgradeIntent: "1.2%", competitorMentions: 74, annualFeeFrustration: "Medium", risk: "Medium" },
    },
    painDrivers: {
      benefits: [
        { driver: "Perceived benefit dilution", conversations: 280, sentiment: "Negative", repeat: "33%", churn: "5.0%" },
      ],
      usage: [
        { driver: "No longer top-of-wallet", conversations: 190, sentiment: "Negative", repeat: "24%", churn: "3.0%" },
      ],
      billing: [
        { driver: "Fee charged after cancel request", conversations: 140, sentiment: "Negative", repeat: "28%", churn: "2.0%" },
      ],
      disputes: [
        { driver: "Unresolved case before close", conversations: 220, sentiment: "Negative", repeat: "36%", churn: "1.0%" },
      ],
      retention: [
        { driver: "Cancel / downgrade request", conversations: 640, sentiment: "Negative", repeat: "39%", churn: "7.0%" },
        { driver: "Competitor sign-up offer", conversations: 420, sentiment: "Negative", repeat: "24%", churn: "4.0%" },
        { driver: "Social escalation before close", conversations: 180, sentiment: "Negative", repeat: "31%", churn: "2.0%" },
      ],
    },
    evidence: [
      { channel: "Voice", segment: "Starter", tone: "Negative", quote: "“I’m done — fee is a joke if rewards never work.”" },
      { channel: "Social", segment: "Travel", tone: "Negative", quote: "“Switched. Their lounge + earn actually posts.”" },
    ],
    recommended: [
      { action: "Trigger fee-waiver / gesture offers on dispute-aftermath saves", owner: "Retention", impact: "Lift save rate on at-risk HNI", priority: "High" },
      { action: "Same-day downgrade path vs hard cancel", owner: "Product", impact: "Reduce full churn", priority: "Medium" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// DRILL 1  —  LEGACY / REFERENCE  (earlier 7-tile spec — data retained)
// ═══════════════════════════════════════════════════════════════════════════

// 1.1  Lifecycle Funnel Monitor
export const V3_LIFECYCLE_FUNNEL = [
  { stage: "Application",         count: 18_420, target: 18_000, pctOfPrev: 100, dropReason: null },
  { stage: "Approved",            count:  7_002, target:  7_740, pctOfPrev:  38, dropReason: "KYC lag · 420 emails cite 'documents delayed'" },
  { stage: "Activated (EMOB)",    count:  4_062, target:  5_000, pctOfPrev:  58, dropReason: "412 voice calls cite app activation loop error" },
  { stage: "First Transaction",   count:  3_088, target:  3_700, pctOfPrev:  76, dropReason: "PIN reset confusion in 32% of chats" },
  { stage: "Sustained Usage",     count:  2_010, target:  2_500, pctOfPrev:  65, dropReason: "Reward-value confusion drops top-of-wallet" },
  { stage: "Renewed / Retained",  count:  1_808, target:  2_200, pctOfPrev:  90, dropReason: "HNI closure intent in 18 Infinia holders" },
];
export const V3_FUNNEL_AI =
  "✨ Early Month-on-Book activation fell from 71% to 58% this week — 412 voice calls cite app activation loop error. Fix the activation SMS wording within 24h to recover Month-1 activation.";

// 1.2  Sentiment by Card Product
export const V3_SENTIMENT_BY_PRODUCT = [
  { product: "Infinia / Private Reserve", happy: 54, neutral: 28, unhappy: 18, accounts:   42_000, annualSpendBn: "$1.8B",  wowDelta: -3 },
  { product: "Platinum Travel",           happy: 42, neutral: 24, unhappy: 34, accounts:  186_000, annualSpendBn: "$2.6B",  wowDelta: -8 },
  { product: "Cashback / Everyday",       happy: 71, neutral: 18, unhappy: 11, accounts:  412_000, annualSpendBn: "$1.9B",  wowDelta: +1 },
  { product: "Student / Starter",         happy: 78, neutral: 16, unhappy:  6, accounts:   94_000, annualSpendBn: "$0.3B",  wowDelta: +2 },
  { product: "Co-branded (Airline+Retail)",happy: 61, neutral: 23, unhappy: 16, accounts:  138_000, annualSpendBn: "$1.1B",  wowDelta: -4 },
];
export const V3_SENTIMENT_AI =
  "✨ Platinum Travel at 42% happy — dragged by lounge-access complaints (48%) and insurance claim confusion (31%). Infinia unchanged; Cashback up 1 pt.";

// 1.3  ✨ AI Journey Narrative
export const V3_JOURNEY_NARRATIVE = {
  refreshedAt: "2 minutes ago",
  confidence: 92,
  paragraphs: [
    "This week the Platinum Travel journey is under pressure.",
    "341 customers are stuck at Activation due to the PIN-reset loop · 18 HNI Infinia cardholders expressed closure intent in the last 72 hours · Early Month-on-Book activation rate dropped 13 points to 58%.",
    "Root cause: third-party card-printing delay (Vendor Beta carrier) plus confusing activation SMS copy pushed since Tuesday's marketing refresh.",
    "Recommended priority: fix activation SMS wording within 24h to restore Month-1 activation rate; trigger RM outreach on the 18 Infinia closure intents today.",
  ],
  citedSources: ["call-4471", "chat-91203", "ticket-DSP-47102", "call-4502", "email-RegE-882"],
};

// 1.4  HNI Cardholder Watchlist
export const V3_HNI_WATCHLIST = [
  { id: "HNI-2891", annualSpend: "$142K", churnPct: 92, signals: ["Reward decline frustration", "CompetitorY mention ×3", "Spend ▼ 67%"], action: "RM call today" },
  { id: "HNI-1044", annualSpend: "$118K", churnPct: 88, signals: ["Auto-pay cancelled", "Distrust language flagged", "2 unresolved disputes"], action: "RM call + waive annual fee" },
  { id: "HNI-3320", annualSpend: "$96K",  churnPct: 84, signals: ["Closure language on call", "Reddit public post", "Lounge access denied"], action: "RM call + gesture" },
  { id: "HNI-4871", annualSpend: "$72K",  churnPct: 78, signals: ["Annual fee objection ×2", "Competitor Amex Gold mention"], action: "Pre-emptive fee waiver" },
  { id: "HNI-2210", annualSpend: "$54K",  churnPct: 74, signals: ["Reward redemption fail ×2", "Silence on last call"], action: "Reward gesture" },
];
export const V3_HNI_SUMMARY = "$4.2M combined annual spend at 70%+ churn risk";

// 1.5  Top Journey Pain Points
export const V3_JOURNEY_PAINS = [
  { rank: 1, topic: "Dispute Resolution Delay",        volume: 340, growth: +38, stage: "Servicing",   sampleQuote: "\"Still waiting on my provisional credit 12 days later\"" },
  { rank: 2, topic: "Reward Redemption Confusion",     volume: 218, growth: +12, stage: "Utilisation", sampleQuote: "\"My points disappeared overnight\"" },
  { rank: 3, topic: "Fraud Alert / Card Block",        volume: 194, growth:  +8, stage: "Servicing",   sampleQuote: "\"My card keeps getting declined at gas stations\"" },
  { rank: 4, topic: "Merchant Name Not Recognised",    volume: 156, growth:  +4, stage: "Utilisation", sampleQuote: "\"What is 'XYZ*CORP' on my statement?\"" },
  { rank: 5, topic: "PIN Reset Loop at Activation",    volume: 142, growth: +62, stage: "Activation",  sampleQuote: "\"The SMS code never arrives\"" },
  { rank: 6, topic: "Annual Fee Value Objection",      volume: 118, growth: +18, stage: "Retention",   sampleQuote: "\"Why am I paying this fee when CompetitorY is free?\"" },
  { rank: 7, topic: "Lounge Access Denied",            volume:  94, growth: +24, stage: "Utilisation", sampleQuote: "\"Showed them my Platinum card and they said not accepted\"" },
];

// 1.6  Channel Mix per Lifecycle Stage (heatmap %)
export const V3_CHANNEL_MIX = [
  { stage: "Apply",     Voice: 22, Chat: 34, Email: 18, Social:  6, Tickets: 20, anomaly: null },
  { stage: "Activate",  Voice: 42, Chat: 38, Email:  6, Social:  4, Tickets: 10, anomaly: "Voice 42% — PIN reset confusion" },
  { stage: "Utilise",   Voice: 24, Chat: 46, Email: 14, Social:  6, Tickets: 10, anomaly: null },
  { stage: "Dispute",   Voice: 36, Chat: 38, Email:  8, Social:  4, Tickets: 14, anomaly: "Chat up 22→38% · agent handoff quality dropping" },
  { stage: "Retention", Voice: 48, Chat: 12, Email: 28, Social:  4, Tickets:  8, anomaly: null },
  { stage: "Close",     Voice: 32, Chat:  8, Email: 16, Social: 28, Tickets: 16, anomaly: "Social +164% · 3 HNIs posted publicly before closing" },
];

// 1.7  Retention & Winback Pulse (full-width)
export const V3_RETENTION_WINBACK = {
  saveRate: 62,
  weeklyTrend: [55, 58, 60, 61, 62, 63, 62],
  byOfferType: [
    { offer: "Fee waiver",         saved: 22, pct: 22 },
    { offer: "Reward top-up",      saved: 68, pct: 68 },
    { offer: "Rate reduction",     saved: 41, pct: 41 },
    { offer: "RM engagement (HNI)",saved: 84, pct: 84 },
    { offer: "Product upgrade",    saved: 36, pct: 36 },
  ],
  winbackAttempts: 412,
  winbackSuccess: 88,
  retainedLTV: "$58K avg",
  lostLTV: "$41K avg",
  topWinningPhrases: [
    "\"Let me see what special offer I can pull for you today\"",
    "\"I can credit your account for the inconvenience\"",
    "\"Your relationship with us goes back 7 years — let me escalate this\"",
  ],
  topFailingPhrases: [
    "\"Unfortunately that's our policy\"",
    "\"I can put you through to our retention team\" (handoff adds 3 min)",
    "\"The system is showing no offers available\"",
  ],
  aiNarrative:
    "✨ Reward-top-up saved 68% of retention calls this week · Waive-annual-fee only 22%. RM engagement on HNIs remains the highest-yield save at 84%. Retrain agents on the 3 failing phrases — they are costing ~18 saves/week.",
};

// ═══════════════════════════════════════════════════════════════════════════
// DRILL 2  —  MARKET REPUTATION  (7 components)
// ═══════════════════════════════════════════════════════════════════════════

// 2.1  Comparison-Site Rank Tracker
export const V3_COMPARISON_RANKS = [
  { site: "NerdWallet",      category: "Cashback",      rank: 4, prev: 2, top1: "CompetitorY Freedom",  score: "4.2/5 ▼ 4.5", aiNote: "Downgrade cites reward devaluation announcement." },
  { site: "Bankrate",        category: "Travel",        rank: 5, prev: 4, top1: "Chase Sapphire Res.",  score: "4.1/5 ▼ 4.3", aiNote: "Pointed to lounge-access complaints in Trustpilot." },
  { site: "The Points Guy",  category: "Premium",       rank: 4, prev: 5, top1: "Amex Platinum",        score: "85/100 ▲ 82", aiNote: "Improved on travel protection changes." },
  { site: "WalletHub",       category: "No-Fee",        rank: 7, prev: 6, top1: "Discover it Cashback", score: "3.9/5 ▼ 4.1", aiNote: "Slipped on mobile-app rating weight change." },
  { site: "Forbes Advisor",  category: "Overall Rewards",rank: 6, prev: 4, top1: "Amex Gold",           score: "4.0/5 ▼ 4.2", aiNote: "Reward-program change cited in updated review." },
  { site: "CreditKarma",     category: "Student",       rank: 2, prev: 2, top1: "Discover it Student",  score: "4.4/5 ─",     aiNote: "Stable. Student segment remains our strongest." },
];

// 2.1b  Rankings & Reviews — card-brand / portfolio intelligence (market drill)

export type RankingLens = "all" | "standalone" | "cobrand" | "business";
export type RankingImpact = "Critical" | "High" | "Medium" | "Positive";
export type RankDirection = "down" | "up" | "flat";

export type RankingReviewRow = {
  lens: Exclude<RankingLens, "all">;
  site: string;
  siteSource: "Review site" | "Comparison site";
  category: string;
  ourCard: string;
  currentRank: number;
  previousRank: number;
  direction: RankDirection;
  competitorRankOne: string;
  competitorScore?: string;
  reason: string;
  internalEcho: number;
  echoLabel: string;
  impact: RankingImpact;
};

export const RANKING_LENS_LABEL: Record<RankingLens, string> = {
  all: "All cards",
  standalone: "Standalone",
  cobrand: "Co-branded",
  business: "Business",
};

export const RANKING_LENS_ORDER: RankingLens[] = ["all", "standalone", "cobrand", "business"];

export const RANKING_AI_SUMMARY_BY_LENS: Record<RankingLens, string> = {
  all:
    "External ranking movement is strongest in cash rewards, co-brand travel, and hotel rewards. Internal echo confirms customers are repeating comparison-site narratives in conversations.",
  standalone:
    "Standalone ranking pressure is led by Active Cash reward-value comparisons and Reflect APR clarity.",
  cobrand:
    "Co-branded ranking pressure is driven by travel credits, hotel reward-night visibility, and partner-benefit fulfillment.",
  business:
    "Business ranking pressure is lower volume but tied to expense sync and statement export clarity.",
};

export const RANKING_REVIEW_ROWS: RankingReviewRow[] = [
  {
    lens: "standalone",
    site: "NerdWallet",
    siteSource: "Review site",
    category: "Cash rewards",
    ourCard: "Active Cash",
    currentRank: 4,
    previousRank: 2,
    direction: "down",
    competitorRankOne: "Chase Freedom Unlimited",
    competitorScore: "4.5/5",
    reason: "Downgrade cites reward-value comparison and delayed cash-back posting complaints.",
    internalEcho: 89,
    echoLabel: "customers mention better cash-back cards",
    impact: "High",
  },
  {
    lens: "standalone",
    site: "WalletHub",
    siteSource: "Comparison site",
    category: "0% intro APR",
    ourCard: "Reflect",
    currentRank: 6,
    previousRank: 3,
    direction: "down",
    competitorRankOne: "Citi Simplicity",
    competitorScore: "4.4/5",
    reason: "Review update calls out APR expiry clarity and balance-transfer fee confusion.",
    internalEcho: 74,
    echoLabel: "calls mention APR surprise and transfer fee confusion",
    impact: "High",
  },
  {
    lens: "standalone",
    site: "The Points Guy",
    siteSource: "Review site",
    category: "Travel rewards",
    ourCard: "Autograph Journey",
    currentRank: 4,
    previousRank: 5,
    direction: "up",
    competitorRankOne: "Amex Platinum",
    competitorScore: "85/100",
    reason: "Improved travel-earning value and protection coverage mentioned in updated review.",
    internalEcho: 31,
    echoLabel: "positive travel-value mentions in reviews and social",
    impact: "Positive",
  },
  {
    lens: "standalone",
    site: "Forbes Advisor",
    siteSource: "Comparison site",
    category: "Everyday rewards",
    ourCard: "Autograph",
    currentRank: 5,
    previousRank: 4,
    direction: "down",
    competitorRankOne: "Amex Gold",
    competitorScore: "4.6/5",
    reason: "Competitor reward positioning is clearer for dining, travel, and everyday spend.",
    internalEcho: 46,
    echoLabel: "customers ask whether Autograph value is still competitive",
    impact: "Medium",
  },
  {
    lens: "cobrand",
    site: "Bankrate",
    siteSource: "Review site",
    category: "Flexible travel rewards",
    ourCard: "One Key+",
    currentRank: 5,
    previousRank: 4,
    direction: "down",
    competitorRankOne: "Chase Sapphire Preferred",
    competitorScore: "4.3/5",
    reason: "Travel credit and partner-benefit fulfillment complaints cited in comparison update.",
    internalEcho: 64,
    echoLabel: "customers mention travel credit not posted",
    impact: "High",
  },
  {
    lens: "cobrand",
    site: "NerdWallet",
    siteSource: "Review site",
    category: "Hotel rewards",
    ourCard: "Choice Privileges Select",
    currentRank: 6,
    previousRank: 4,
    direction: "down",
    competitorRankOne: "Marriott Bonvoy Boundless",
    competitorScore: "4.4/5",
    reason: "Hotel point posting delay and reward-night eligibility confusion reduced ranking.",
    internalEcho: 58,
    echoLabel: "hotel points missing themes in conversations",
    impact: "High",
  },
  {
    lens: "cobrand",
    site: "WalletHub",
    siteSource: "Comparison site",
    category: "Rent rewards",
    ourCard: "Bilt",
    currentRank: 3,
    previousRank: 3,
    direction: "flat",
    competitorRankOne: "Capital One Venture",
    competitorScore: "4.3/5",
    reason: "Ranking held, but review comments flag partner-transfer complexity.",
    internalEcho: 42,
    echoLabel: "customers mention transfer rules are hard to understand",
    impact: "Medium",
  },
  {
    lens: "cobrand",
    site: "Credit Karma",
    siteSource: "Comparison site",
    category: "Merchant cash rewards",
    ourCard: "BJ's One+",
    currentRank: 7,
    previousRank: 5,
    direction: "down",
    competitorRankOne: "Costco Anywhere Visa",
    competitorScore: "4.2/5",
    reason: "Merchant-linked reward crediting and statement visibility complaints increased.",
    internalEcho: 53,
    echoLabel: "BJ's reward crediting delay mentioned in chats",
    impact: "High",
  },
  {
    lens: "business",
    site: "Forbes Advisor",
    siteSource: "Comparison site",
    category: "Business cash rewards",
    ourCard: "Signify Business Cash",
    currentRank: 4,
    previousRank: 5,
    direction: "up",
    competitorRankOne: "Capital One Spark Cash",
    competitorScore: "4.5/5",
    reason: "Improved cash-back bonus positioning and no-annual-fee value.",
    internalEcho: 22,
    echoLabel: "positive mentions from small business cardholders",
    impact: "Positive",
  },
  {
    lens: "business",
    site: "Business Insider",
    siteSource: "Review site",
    category: "Expense management",
    ourCard: "Concur Business",
    currentRank: 6,
    previousRank: 4,
    direction: "down",
    competitorRankOne: "Ramp Business Card",
    competitorScore: "4.6/5",
    reason: "Expense sync reliability and receipt workflow clarity lag competitor tools.",
    internalEcho: 37,
    echoLabel: "business users mention manual reconciliation effort",
    impact: "Medium",
  },
];

const RANKING_IMPACT_ORDER: Record<RankingImpact, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Positive: 3,
};

export function getSortedRankingReviewRows(lens: RankingLens): RankingReviewRow[] {
  const base = lens === "all" ? [...RANKING_REVIEW_ROWS] : RANKING_REVIEW_ROWS.filter((r) => r.lens === lens);
  return base.sort((a, b) => {
    const ia = RANKING_IMPACT_ORDER[a.impact];
    const ib = RANKING_IMPACT_ORDER[b.impact];
    if (ia !== ib) return ia - ib;
    const dropA = a.currentRank - a.previousRank;
    const dropB = b.currentRank - b.previousRank;
    if (dropB !== dropA) return dropB - dropA;
    return b.internalEcho - a.internalEcho;
  });
}

export const RANKING_LENS_ROW_COUNTS: Record<RankingLens, number> = {
  all: RANKING_REVIEW_ROWS.length,
  standalone: RANKING_REVIEW_ROWS.filter((r) => r.lens === "standalone").length,
  cobrand: RANKING_REVIEW_ROWS.filter((r) => r.lens === "cobrand").length,
  business: RANKING_REVIEW_ROWS.filter((r) => r.lens === "business").length,
};

// 2.2  Social Sentiment by Channel (score + 6-week sparkline)
export const V3_SOCIAL_SENTIMENT = [
  { channel: "App Store",   score: 0.58, delta6w: -0.12, spark: [0.70, 0.68, 0.65, 0.63, 0.60, 0.58], worst: "\"App crashes when viewing rewards\"" },
  { channel: "Play Store",  score: 0.61, delta6w: -0.09, spark: [0.70, 0.68, 0.65, 0.64, 0.62, 0.61], worst: "\"Activation screen loops forever\"" },
  { channel: "Trustpilot",  score: 0.54, delta6w: -0.15, spark: [0.69, 0.64, 0.60, 0.58, 0.56, 0.54], worst: "\"Customer service reads from scripts\"" },
  { channel: "Reddit",      score: 0.42, delta6w: -0.21, spark: [0.63, 0.58, 0.54, 0.50, 0.46, 0.42], worst: "\"They devalued my points with no warning\"" },
  { channel: "X (Twitter)", score: 0.38, delta6w: -0.24, spark: [0.62, 0.56, 0.52, 0.48, 0.42, 0.38], worst: "\"#RewardScam — my 180K points are now worth half\"" },
];
export const V3_SOCIAL_AI =
  "✨ X sentiment collapsing fastest — #RewardScam hashtag driving 68% of negative posts. Reddit close behind; both Tier-1 customer forums for premium cards.";

// 2.4  Competitor Mention Monitor (from OUR voice/chat/social)
export const V3_COMPETITORS = [
  { name: "CompetitorY Freedom Unlimited", mentions: 412, threat: 8.2, context: "\"their 5% cashback is better\"", growth: "+38%" },
  { name: "Amex Gold",                     mentions: 287, threat: 6.4, context: "\"dining rewards are stronger\"", growth: "+14%" },
  { name: "Chase Sapphire Reserve",        mentions: 184, threat: 5.8, context: "\"travel insurance is reliable\"", growth:  "+9%" },
  { name: "Discover it",                   mentions: 142, threat: 4.1, context: "\"no annual fee, simple\"",        growth: "+22%" },
  { name: "Citi Double Cash",              mentions:  96, threat: 3.6, context: "\"2% flat is simpler\"",           growth:  "+6%" },
  { name: "Capital One Venture",           mentions:  71, threat: 3.1, context: "\"transfer partners are better\"", growth:  "+4%" },
];

// 2.5  Momentum Hashtags (market drill — scrollable grid)
export type V3MomentumHashtag = {
  tag: string;
  stance: "negative" | "positive" | "neutral";
  growth: string;
  volume: number;
  context: string;
};

export const V3_MOMENTUM_HASHTAGS: V3MomentumHashtag[] = [
  {
    tag: "#RewardScam",
    stance: "negative",
    growth: "287%",
    volume: 4_820,
    context:
      "Spiking after rewards-program update · most posts cite surprise point devaluation and weaker transfer ratios.",
  },
  {
    tag: "#ChargedTwice",
    stance: "negative",
    growth: "164%",
    volume: 3_610,
    context:
      "Duplicate-authorization and merchant-hold complaints · amplified after wallet-app outage threads last week.",
  },
  {
    tag: "#TravelPerks",
    stance: "positive",
    growth: "142%",
    volume: 2_190,
    context:
      "Feature shout-outs on lounge access and travel credits · SMB owners comparing issuer perks on X and Reddit.",
  },
  {
    tag: "#CardReplacement",
    stance: "neutral",
    growth: "98%",
    volume: 1_870,
    context:
      "Mix of praise for fast re-issue and frustration over courier delays · volume roughly flat vs prior week.",
  },
  {
    tag: "#BalanceTransfer",
    stance: "negative",
    growth: "76%",
    volume: 1_420,
    context:
      "Intro APR end-date confusion · heavy skew toward first-cycle-after-promo complaints on Trustpilot mirrors.",
  },
  {
    tag: "#CashbackFlex",
    stance: "positive",
    growth: "58%",
    volume: 1_120,
    context:
      "Competitor campaigns triggering “why is earning capped here?” threads · organic advocacy from heavy cashback users.",
  },
];

// 2.5b  Influential Engagement — cross-channel external sentiment intelligence

export type EngagementChannel =
  | "all"
  | "app_store"
  | "play_store"
  | "reddit"
  | "trustpilot"
  | "x";

export type EngagementImpact = "Severe" | "High" | "Medium" | "Low";
export type EngagementSentiment = "Negative" | "Mixed" | "Positive";
export type EngagementCardKind = "standalone" | "cobrand" | "business";

export type EngagementAffectedCard = {
  name: string;
  kind: EngagementCardKind;
};

export type EngagementItem = {
  channel: Exclude<EngagementChannel, "all">;
  source: string;
  sourceType: string;
  topic: string;
  narrative: string;
  metrics: {
    primary: string;
    secondary: string;
    tertiary?: string;
  };
  engagementLabel: string;
  engagementRate?: string;
  sentiment: EngagementSentiment;
  impact: EngagementImpact;
  action: string;
  affectedCards: EngagementAffectedCard[];
};

export const ENGAGEMENT_CHANNEL_LABEL: Record<EngagementChannel, string> = {
  all: "All",
  app_store: "App Store",
  play_store: "Play Store",
  reddit: "Reddit",
  trustpilot: "Trustpilot",
  x: "X",
};

export const ENGAGEMENT_CHANNEL_ORDER: EngagementChannel[] = [
  "all",
  "app_store",
  "play_store",
  "reddit",
  "trustpilot",
  "x",
];

export const INFLUENTIAL_ENGAGEMENT_ITEMS: EngagementItem[] = [
  {
    channel: "reddit",
    source: "r/churning_daily",
    sourceType: "Reddit community",
    topic: "Reward transfer value criticism",
    narrative:
      "Megathread says reward-transfer ratios are weakening; comments mention Bilt, One Key, and Choice Privileges.",
    metrics: {
      primary: "890k members",
      secondary: "8.7k upvotes · 4.2k comments",
      tertiary: "18 active threads this week",
    },
    engagementLabel: "High discussion velocity",
    engagementRate: "6.2%",
    sentiment: "Negative",
    impact: "Severe",
    action: "Watch closely",
    affectedCards: [
      { name: "Bilt", kind: "cobrand" },
      { name: "One Key", kind: "cobrand" },
      { name: "Choice Privileges", kind: "cobrand" },
    ],
  },
  {
    channel: "reddit",
    source: "u/card_teardowns",
    sourceType: "Reddit creator",
    topic: "Digital wallet and card decline complaints",
    narrative:
      "Side-by-side card comparison flagged mobile-wallet declines after an OS patch and cited support backlog.",
    metrics: {
      primary: "218k karma",
      secondary: "312k followers",
      tertiary: "1.6k comments on latest teardown",
    },
    engagementLabel: "Creator post spreading",
    engagementRate: "4.8%",
    sentiment: "Negative",
    impact: "High",
    action: "Monitor",
    affectedCards: [
      { name: "Active Cash", kind: "standalone" },
      { name: "Autograph", kind: "standalone" },
      { name: "Bilt", kind: "cobrand" },
    ],
  },
  {
    channel: "x",
    source: "@CreditCardGuru",
    sourceType: "X creator",
    topic: "Reward posting delay",
    narrative:
      "Thread says reward credits are taking too long to appear after eligible purchases.",
    metrics: {
      primary: "420k followers",
      secondary: "1.8k likes · 420 replies · 210 reposts",
      tertiary: "96k views",
    },
    engagementLabel: "High repost spread",
    engagementRate: "3.9%",
    sentiment: "Negative",
    impact: "High",
    action: "Watch closely",
    affectedCards: [
      { name: "Active Cash", kind: "standalone" },
      { name: "One Key", kind: "cobrand" },
      { name: "Bilt", kind: "cobrand" },
    ],
  },
  {
    channel: "x",
    source: "@TravelPointsLab",
    sourceType: "X creator",
    topic: "Travel credit not posted",
    narrative:
      "Creator thread says premium travel benefits are unclear after booking and statement close.",
    metrics: {
      primary: "310k followers",
      secondary: "940 likes · 188 replies · 122 reposts",
      tertiary: "51k views",
    },
    engagementLabel: "Travel-card audience engaged",
    engagementRate: "2.8%",
    sentiment: "Negative",
    impact: "High",
    action: "Respond with clarity",
    affectedCards: [
      { name: "Autograph Journey", kind: "standalone" },
      { name: "One Key+", kind: "cobrand" },
      { name: "Choice Select", kind: "cobrand" },
    ],
  },
  {
    channel: "app_store",
    source: "Wells Fargo Mobile",
    sourceType: "App Store listing",
    topic: "Card login and OTP failure",
    narrative:
      "Recent reviews mention login loops, OTP delays, and difficulty seeing card reward status.",
    metrics: {
      primary: "4.7★ rating",
      secondary: "2.1M ratings",
      tertiary: "380 recent card-related reviews this week",
    },
    engagementLabel: "Review spike",
    engagementRate: "31% negative recent reviews",
    sentiment: "Negative",
    impact: "High",
    action: "Escalate digital issue",
    affectedCards: [
      { name: "Active Cash", kind: "standalone" },
      { name: "Reflect", kind: "standalone" },
      { name: "Autograph", kind: "standalone" },
    ],
  },
  {
    channel: "play_store",
    source: "Wells Fargo Mobile",
    sourceType: "Play Store listing",
    topic: "Payment and authorization failure",
    narrative:
      "Android reviews cite failed payment attempts, card control issues, and delayed transaction status.",
    metrics: {
      primary: "4.6★ rating",
      secondary: "1.8M reviews",
      tertiary: "420 recent negative reviews",
    },
    engagementLabel: "Negative review velocity",
    engagementRate: "34% negative recent reviews",
    sentiment: "Negative",
    impact: "High",
    action: "Escalate app-card controls",
    affectedCards: [
      { name: "Active Cash", kind: "standalone" },
      { name: "Autograph", kind: "standalone" },
      { name: "BJ's One", kind: "cobrand" },
    ],
  },
  {
    channel: "trustpilot",
    source: "Wells Fargo Credit Cards",
    sourceType: "Trustpilot profile",
    topic: "Fee clarity and dispute delay",
    narrative:
      "Recent reviews mention fee confusion, unresolved disputes, and unclear refund timelines.",
    metrics: {
      primary: "2.2★ rating",
      secondary: "4,820 reviews",
      tertiary: "112 new reviews this week",
    },
    engagementLabel: "Reputation risk rising",
    engagementRate: "68% negative recent reviews",
    sentiment: "Negative",
    impact: "Severe",
    action: "Urgent review",
    affectedCards: [
      { name: "Reflect", kind: "standalone" },
      { name: "Active Cash", kind: "standalone" },
      { name: "One Key", kind: "cobrand" },
    ],
  },
  {
    channel: "trustpilot",
    source: "Choice co-brand reviews",
    sourceType: "Trustpilot / review-site cluster",
    topic: "Hotel points not credited",
    narrative:
      "Review cluster says Choice points and reward-night eligibility are not visible after stays.",
    metrics: {
      primary: "2.8★ rating cluster",
      secondary: "1,140 related reviews",
      tertiary: "74 new negative mentions this week",
    },
    engagementLabel: "Partner-benefit complaint cluster",
    engagementRate: "54% negative recent reviews",
    sentiment: "Negative",
    impact: "High",
    action: "Partner escalation",
    affectedCards: [
      { name: "Choice Privileges", kind: "cobrand" },
      { name: "Choice Select", kind: "cobrand" },
    ],
  },
];

const ENGAGEMENT_IMPACT_ORDER: Record<EngagementImpact, number> = {
  Severe: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

function engagementRateSortKey(rate?: string): number {
  if (!rate) return 0;
  const m = rate.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

export function getInfluentialEngagementItems(channel: EngagementChannel): EngagementItem[] {
  const base =
    channel === "all"
      ? [...INFLUENTIAL_ENGAGEMENT_ITEMS]
      : INFLUENTIAL_ENGAGEMENT_ITEMS.filter((item) => item.channel === channel);
  return base.sort((a, b) => {
    const ia = ENGAGEMENT_IMPACT_ORDER[a.impact];
    const ib = ENGAGEMENT_IMPACT_ORDER[b.impact];
    if (ia !== ib) return ia - ib;
    return engagementRateSortKey(b.engagementRate) - engagementRateSortKey(a.engagementRate);
  });
}

// 2.6  Media Monitor + Review Sites
export const V3_MEDIA = [
  { outlet: "Bloomberg",  headline: "Premium card rewards face scrutiny as fees rise", reach: "2.4M", tone: "Negative", topic: "Reward devaluation" },
  { outlet: "NerdWallet", headline: "Best cashback card 2026",                          reach: "840K", tone: "Negative", topic: "We were downgraded" },
  { outlet: "WSJ",        headline: "Chargeback volume hits 146M industry-wide",        reach: "1.8M", tone: "Neutral",  topic: "Industry backdrop" },
  { outlet: "Reuters",    headline: "Issuers tighten CNP fraud rules ahead of holiday", reach: "1.1M", tone: "Neutral",  topic: "Fraud · CNP" },
  { outlet: "FT",         headline: "Loyalty-program inflation hits cardholders",       reach:  "920K",tone: "Negative", topic: "Reward value" },
];
export const V3_REVIEWS = [
  { site: "Trustpilot", stars: 2, text: "\"Worst customer service I've ever experienced with a bank\"" },
  { site: "Trustpilot", stars: 4, text: "\"Great travel benefits but reward program just got worse\"" },
  { site: "BBB",        stars: 1, text: "\"Filed complaint — waited 45 days for dispute resolution\"" },
  { site: "Trustpilot", stars: 5, text: "\"Student card saved me during college — thank you\"" },
];
export const V3_MEDIA_PULSE = { score: 42, weight: "Negative-weighted by reach" };

// 2.7  ✨ Brand Promise Gap — portfolio lens (Head of Credit Cards executive view)

export type BrandPromiseLens = "all" | "standalone" | "cobrand" | "business";

export type BrandPromiseImportance = "Critical" | "High" | "Moderate" | "Watch";

export type BrandPromiseCard = {
  shortName: string;
  fullName: string;
  lens: Exclude<BrandPromiseLens, "all">;
  partner?: string;
};

/** Channel mix as percentages (sum 100) for Voice · Chat · Social · Email · Ticket display. */
export type BrandPromiseChannelPct = {
  voice: number;
  chat: number;
  social: number;
  email: number;
  ticket: number;
};

export type BrandPromiseGapRow = {
  id: string;
  portfolioLens: Exclude<BrandPromiseLens, "all">;
  promiseCategory: string;
  promise: string;
  whereItBreaks: string;
  evidenceNote: string;
  cards: BrandPromiseCard[];
  volume: number;
  channelsPct: BrandPromiseChannelPct;
  negativeSentiment: number;
  importance: BrandPromiseImportance;
};

export const BRAND_PROMISE_LENS_LABEL: Record<BrandPromiseLens, string> = {
  all: "All cards",
  standalone: "Standalone",
  cobrand: "Co-branded",
  business: "Business",
};

export const BRAND_PROMISE_LENS_ORDER: BrandPromiseLens[] = ["all", "standalone", "cobrand", "business"];

const BPC = {
  activeCash: {
    shortName: "Active Cash",
    fullName: "Wells Fargo Active Cash® Card",
    lens: "standalone" as const,
  },
  reflect: {
    shortName: "Reflect",
    fullName: "Reflect® Card",
    lens: "standalone" as const,
  },
  autograph: {
    shortName: "Autograph",
    fullName: "Autograph® Card",
    lens: "standalone" as const,
  },
  autographJourney: {
    shortName: "Autograph Journey",
    fullName: "Autograph Journey℠ Card",
    lens: "standalone" as const,
  },
  attune: {
    shortName: "Attune",
    fullName: "Attune® Card",
    lens: "standalone" as const,
  },
  /** Co-branded: Expedia / Hotels.com / Vrbo — flexible travel rewards (public lineup). */
  oneKey: {
    shortName: "One Key",
    fullName: "One Key™ Card",
    lens: "cobrand" as const,
    partner: "Expedia, Hotels.com, Vrbo — flexible travel rewards",
  },
  /** Co-branded: premium travel benefits tier. */
  oneKeyPlus: {
    shortName: "One Key+",
    fullName: "One Key+™ Card",
    lens: "cobrand" as const,
    partner: "Expedia, Hotels.com, Vrbo — premium travel benefits",
  },
  /** Co-branded: Choice Hotels® — faster reward nights. */
  choice: {
    shortName: "Choice Privileges",
    fullName: "Choice Privileges® Mastercard®",
    lens: "cobrand" as const,
    partner: "Choice Hotels® — faster reward nights",
  },
  /** Co-branded: elevated hotel rewards. */
  choiceSelect: {
    shortName: "Choice Select",
    fullName: "Choice Privileges® Select Mastercard®",
    lens: "cobrand" as const,
    partner: "Choice Hotels® — elevated hotel rewards",
  },
  signify: {
    shortName: "Signify Business Cash",
    fullName: "Signify Business Cash® Card",
    lens: "business" as const,
  },
} satisfies Record<string, BrandPromiseCard>;

const BRAND_PROMISE_GAP_STANDALONE: BrandPromiseGapRow[] = [
  {
    id: "st-auth",
    portfolioLens: "standalone",
    promiseCategory: "Card payments",
    promise: "Seamless card authorization",
    whereItBreaks:
      "Customers say valid card transactions are being declined or failing at payment.",
    evidenceNote: "Card decline language appears across voice, chat, and app review snippets.",
    cards: [BPC.activeCash, BPC.attune, BPC.autograph, BPC.reflect],
    volume: 218,
    channelsPct: { voice: 38, chat: 26, social: 22, email: 7, ticket: 7 },
    negativeSentiment: -0.49,
    importance: "Critical",
  },
  {
    id: "st-rewards-vis",
    portfolioLens: "standalone",
    promiseCategory: "Cash rewards",
    promise: "Real-time cash rewards visibility",
    whereItBreaks:
      "Customers say cash rewards are delayed, missing, or unclear after purchases.",
    evidenceNote: "Reward posting complaints appear after statement close.",
    cards: [BPC.activeCash],
    volume: 196,
    channelsPct: { voice: 35, chat: 32, social: 18, email: 8, ticket: 7 },
    negativeSentiment: -0.52,
    importance: "Critical",
  },
  {
    id: "st-apr",
    portfolioLens: "standalone",
    promiseCategory: "Low intro APR",
    promise: "Low intro APR confidence",
    whereItBreaks:
      "Customers are confused by promo APR end dates, balance transfer timing, and interest changes.",
    evidenceNote: "Repeat-contact themes spike after first billing cycles.",
    cards: [BPC.reflect, BPC.activeCash],
    volume: 158,
    channelsPct: { voice: 42, chat: 28, social: 18, email: 6, ticket: 6 },
    negativeSentiment: -0.44,
    importance: "High",
  },
  {
    id: "st-travel-value",
    portfolioLens: "standalone",
    promiseCategory: "Flexible travel rewards",
    promise: "Everyday travel reward value",
    whereItBreaks:
      "Customers say point categories and reward value are harder to understand than advertised.",
    evidenceNote: "Review-site and servicing language both mention reward-value confusion.",
    cards: [BPC.autograph, BPC.autographJourney],
    volume: 124,
    channelsPct: { voice: 30, chat: 22, social: 28, email: 10, ticket: 10 },
    negativeSentiment: -0.43,
    importance: "High",
  },
];

const BRAND_PROMISE_GAP_COBRAND: BrandPromiseGapRow[] = [
  {
    id: "cb-travel-ben",
    portfolioLens: "cobrand",
    promiseCategory: "Partner travel benefits",
    promise: "Partner travel benefit fulfillment",
    whereItBreaks:
      "Customers say OneKeyCash, travel credits, and partner booking benefits are not posting clearly.",
    evidenceNote: "Expedia / Hotels.com / Vrbo handoff complaints create partner blame-shift.",
    cards: [BPC.oneKey, BPC.oneKeyPlus],
    volume: 286,
    channelsPct: { voice: 28, chat: 24, social: 26, email: 11, ticket: 11 },
    negativeSentiment: -0.48,
    importance: "Critical",
  },
  {
    id: "cb-hotel",
    portfolioLens: "cobrand",
    promiseCategory: "Hotel rewards",
    promise: "Hotel reward night reliability",
    whereItBreaks:
      "Customers say hotel points and reward-night eligibility are not visible after stay completion.",
    evidenceNote: "Choice Hotels benefit complaints appear in public reviews and internal conversations.",
    cards: [BPC.choice, BPC.choiceSelect],
    volume: 221,
    channelsPct: { voice: 32, chat: 20, social: 24, email: 12, ticket: 12 },
    negativeSentiment: -0.47,
    importance: "High",
  },
  {
    id: "cb-onekeycash",
    portfolioLens: "cobrand",
    promiseCategory: "OneKeyCash",
    promise: "OneKeyCash earn and redemption clarity",
    whereItBreaks:
      "Customers say OneKeyCash accrual on Expedia, Hotels.com, and Vrbo does not match what they see at checkout or on the statement.",
    evidenceNote: "Earning-rule and portal-handoff complaints cluster on One Key vs One Key+ benefit tiers.",
    cards: [BPC.oneKey, BPC.oneKeyPlus],
    volume: 188,
    channelsPct: { voice: 26, chat: 22, social: 32, email: 10, ticket: 10 },
    negativeSentiment: -0.39,
    importance: "Moderate",
  },
  {
    id: "cb-choice-bonus",
    portfolioLens: "cobrand",
    promiseCategory: "Choice Hotels rewards",
    promise: "Bonus points and elite earn path clarity",
    whereItBreaks:
      "Customers say welcome bonus night math and 5x/10x earn on stays are hard to reconcile with what posts after checkout.",
    evidenceNote: "Disputes spike when bonus offers and participating-property lists do not match frontline expectations.",
    cards: [BPC.choice, BPC.choiceSelect],
    volume: 166,
    channelsPct: { voice: 40, chat: 30, social: 18, email: 6, ticket: 6 },
    negativeSentiment: -0.41,
    importance: "High",
  },
];

const BRAND_PROMISE_GAP_BUSINESS: BrandPromiseGapRow[] = [
  {
    id: "biz-cash",
    portfolioLens: "business",
    promiseCategory: "Business cash rewards",
    promise: "Business cash rewards simplicity",
    whereItBreaks:
      "Business cardholders say cash reward posting and statement visibility are not clear enough.",
    evidenceNote: "Business servicing conversations cite reconciliation friction.",
    cards: [BPC.signify],
    volume: 121,
    channelsPct: { voice: 44, chat: 36, social: 12, email: 4, ticket: 4 },
    negativeSentiment: -0.42,
    importance: "High",
  },
  {
    id: "biz-expense",
    portfolioLens: "business",
    promiseCategory: "Expense management",
    promise: "Business expense management",
    whereItBreaks:
      "Customers say expense sync, statement export, and receipt matching are not as automatic as expected.",
    evidenceNote: "Tool-sync complaints are concentrated in Concur-linked conversations.",
    cards: [BPC.signify],
    volume: 88,
    channelsPct: { voice: 36, chat: 40, social: 14, email: 5, ticket: 5 },
    negativeSentiment: -0.44,
    importance: "High",
  },
  {
    id: "biz-statement",
    portfolioLens: "business",
    promiseCategory: "Statement clarity",
    promise: "Business statement clarity",
    whereItBreaks: "Customers say business statements are not easy to export or reconcile.",
    evidenceNote: "Finance admin users mention manual cleanup effort.",
    cards: [BPC.signify],
    volume: 96,
    channelsPct: { voice: 38, chat: 34, social: 16, email: 6, ticket: 6 },
    negativeSentiment: -0.36,
    importance: "Moderate",
  },
];

const BRAND_PROMISE_GAP_ALL_SOURCE: BrandPromiseGapRow[] = [
  ...BRAND_PROMISE_GAP_STANDALONE,
  ...BRAND_PROMISE_GAP_COBRAND,
  ...BRAND_PROMISE_GAP_BUSINESS,
];

const IMPORTANCE_ORDER: Record<BrandPromiseImportance, number> = {
  Critical: 0,
  High: 1,
  Moderate: 2,
  Watch: 3,
};

function sortBrandPromiseGapRows(rows: BrandPromiseGapRow[]): BrandPromiseGapRow[] {
  return [...rows].sort((a, b) => {
    const ia = IMPORTANCE_ORDER[a.importance];
    const ib = IMPORTANCE_ORDER[b.importance];
    if (ia !== ib) return ia - ib;
    if (b.volume !== a.volume) return b.volume - a.volume;
    return a.negativeSentiment - b.negativeSentiment;
  });
}

const BRAND_PROMISE_GAP_ALL_SORTED = sortBrandPromiseGapRows(BRAND_PROMISE_GAP_ALL_SOURCE);

export function getBrandPromiseGapRows(lens: BrandPromiseLens): BrandPromiseGapRow[] {
  if (lens === "all") return BRAND_PROMISE_GAP_ALL_SORTED;
  return sortBrandPromiseGapRows(BRAND_PROMISE_GAP_ALL_SOURCE.filter((r) => r.portfolioLens === lens));
}

export const V3_BRAND_PROMISE_LENS_ROW_COUNTS: Record<BrandPromiseLens, number> = {
  all: BRAND_PROMISE_GAP_ALL_SOURCE.length,
  standalone: BRAND_PROMISE_GAP_STANDALONE.length,
  cobrand: BRAND_PROMISE_GAP_COBRAND.length,
  business: BRAND_PROMISE_GAP_BUSINESS.length,
};

export const V3_MARKET_RANKS_INSIGHT = {
  before: "✦ 4 of 6 tracked sites downgraded us this month. Average rank drop: ",
  highlight: "1.8 positions",
} as const;

/** Keys for channel dots / sparkline rows (market reputation top row). */
export type V3MarketChannelKey =
  | "app_store"
  | "play_store"
  | "reddit"
  | "trustpilot"
  | "x";

export const V3_MARKET_CHANNEL_DOT: Record<V3MarketChannelKey, string> = {
  app_store: "#9333ea",
  play_store: "#0891b2",
  reddit: "#b45309",
  trustpilot: "#65a30d",
  x: "#64748b",
};

export const V3_MARKET_CHANNEL_LABEL: Record<V3MarketChannelKey, string> = {
  app_store: "App Store",
  play_store: "Play Store",
  reddit: "Reddit",
  trustpilot: "Trustpilot",
  x: "X (Twitter)",
};

// ─── Market reputation — Top Topics / Friction by card type (Standalone vs Co-brand) ───

export type CardTypeLens = "all" | "standalone" | "cobrand";

export type CardKind = "standalone" | "cobrand";

export type TopicCard = {
  shortName: string;
  kind: CardKind;
};

/** Product positioning tags used to validate topic ↔ card relevance */
export type MarketCardCategory =
  | "cashback"
  | "rewards"
  | "travel"
  | "premium_travel"
  | "cross_border"
  | "no_annual_fee"
  | "balance_transfer"
  | "intro_apr"
  | "fee_clarity"
  | "payments"
  | "app_access"
  | "service"
  | "business"
  | "expense_sync"
  | "partner_benefits"
  | "hotel_booking"
  | "refund"
  | "hotel_rewards"
  | "partner_transfer"
  | "merchant_rewards"
  | "rent_rewards";

export type CardCatalogItem = {
  shortName: string;
  fullName: string;
  kind: CardKind;
  categories: readonly MarketCardCategory[];
};

const V3_MARKET_CARD_CATALOG_LIST: readonly CardCatalogItem[] = [
  {
    shortName: "Active Cash",
    fullName: "Active Cash Card",
    kind: "standalone",
    categories: ["cashback", "no_annual_fee", "balance_transfer", "payments", "app_access", "service"],
  },
  {
    shortName: "Attune",
    fullName: "Attune Card",
    kind: "standalone",
    categories: ["cashback", "rewards", "no_annual_fee", "payments", "app_access", "service"],
  },
  {
    shortName: "Autograph",
    fullName: "Autograph Card",
    kind: "standalone",
    categories: ["rewards", "travel", "no_annual_fee", "cross_border", "payments", "app_access", "service"],
  },
  {
    shortName: "Autograph Journey",
    fullName: "Autograph Journey Card",
    kind: "standalone",
    categories: ["travel", "rewards", "premium_travel", "cross_border", "service"],
  },
  {
    shortName: "Reflect",
    fullName: "Reflect Card",
    kind: "standalone",
    categories: ["intro_apr", "balance_transfer", "fee_clarity", "payments", "app_access", "service"],
  },
  {
    shortName: "Signify Business Cash",
    fullName: "Signify Business Cash Card",
    kind: "standalone",
    categories: ["business", "cashback", "no_annual_fee", "payments", "service"],
  },
  {
    shortName: "One Key",
    fullName: "One Key Card",
    kind: "cobrand",
    categories: ["travel", "rewards", "partner_benefits", "hotel_booking", "refund", "service"],
  },
  {
    shortName: "One Key+",
    fullName: "One Key+ Card",
    kind: "cobrand",
    categories: ["travel", "rewards", "premium_travel", "partner_benefits", "hotel_booking", "refund", "fee_clarity", "service"],
  },
  {
    shortName: "Choice Privileges",
    fullName: "Choice Privileges Mastercard",
    kind: "cobrand",
    categories: ["travel", "rewards", "hotel_rewards", "partner_benefits", "balance_transfer", "refund", "fee_clarity", "no_annual_fee", "service"],
  },
  {
    shortName: "Choice Select",
    fullName: "Choice Privileges Select Mastercard",
    kind: "cobrand",
    categories: ["travel", "rewards", "premium_travel", "hotel_rewards", "partner_benefits", "service"],
  },
  {
    shortName: "Bilt",
    fullName: "Bilt Mastercard",
    kind: "cobrand",
    categories: ["rewards", "rent_rewards", "travel", "partner_transfer", "balance_transfer", "no_annual_fee", "fee_clarity", "app_access", "service"],
  },
  {
    shortName: "BJ's One",
    fullName: "BJ's One Mastercard",
    kind: "cobrand",
    categories: ["cashback", "intro_apr", "balance_transfer", "no_annual_fee", "merchant_rewards", "refund", "payments", "service"],
  },
  {
    shortName: "BJ's One+",
    fullName: "BJ's One+ Mastercard",
    kind: "cobrand",
    categories: ["cashback", "rewards", "no_annual_fee", "merchant_rewards", "partner_benefits", "refund", "payments", "service"],
  },
  {
    shortName: "Concur Business",
    fullName: "Concur Business Mastercard",
    kind: "cobrand",
    categories: ["business", "rewards", "expense_sync", "no_annual_fee", "service"],
  },
] as const;

export const V3_MARKET_CARD_CATALOG = V3_MARKET_CARD_CATALOG_LIST;

export const V3_MARKET_CARD_CATALOG_BY_SHORT: ReadonlyMap<string, CardCatalogItem> = new Map(
  V3_MARKET_CARD_CATALOG_LIST.map((c) => [c.shortName, c]),
);

export function cardMatchesTopic(
  card: CardCatalogItem,
  allowedCategories: readonly MarketCardCategory[],
): boolean {
  return card.categories.some((category) => allowedCategories.includes(category));
}

/** Resolve author-listed card shorts through catalog + topic categories; apply All / ST / CB lens. No fallback fillers. */
export function getMarketResolvedCards(
  row: { cardShortNames: readonly string[]; allowedCategories: readonly MarketCardCategory[] },
  lens: CardTypeLens,
): TopicCard[] {
  const out: TopicCard[] = [];
  const seen = new Set<string>();
  for (const sn of row.cardShortNames) {
    const catalogCard = V3_MARKET_CARD_CATALOG_BY_SHORT.get(sn);
    if (!catalogCard || !cardMatchesTopic(catalogCard, row.allowedCategories)) continue;
    if (seen.has(sn)) continue;
    seen.add(sn);
    if (lens === "standalone" && catalogCard.kind !== "standalone") continue;
    if (lens === "cobrand" && catalogCard.kind !== "cobrand") continue;
    out.push({ shortName: catalogCard.shortName, kind: catalogCard.kind });
  }
  return out;
}

export function marketRowHasRelevantCardsForLens(
  row: { cardShortNames: readonly string[]; allowedCategories: readonly MarketCardCategory[] },
  lens: CardTypeLens,
): boolean {
  return getMarketResolvedCards(row, lens).length > 0;
}

export type MarketTopic = {
  topic: string;
  totalMentions: number;
  wow: number;
  riskScore: number;
  dominantCategory: string;
  allowedCategories: readonly MarketCardCategory[];
  cardShortNames: readonly string[];
  standaloneMentions: number;
  cobrandMentions: number;
};

export type FrictionDriver = {
  phrase: string;
  linkedTopic: string;
  totalMentions: number;
  sharePct: number;
  allowedCategories: readonly MarketCardCategory[];
  cardShortNames: readonly string[];
  standaloneMentions: number;
  cobrandMentions: number;
};

export type V3MarketTopicRow = MarketTopic & {
  mentionsColor: "red" | "orange" | "yellow";
  wowColor: "red" | "orange" | "green";
  channels: readonly V3MarketChannelKey[];
};

export type V3FrictionDriverRow = FrictionDriver & {
  badgeTone: "red" | "orange";
  channels: readonly V3MarketChannelKey[];
};

export function getMentionsByLens(
  item: Pick<MarketTopic, "totalMentions" | "standaloneMentions" | "cobrandMentions">,
  lens: CardTypeLens,
): number {
  if (lens === "standalone") return item.standaloneMentions;
  if (lens === "cobrand") return item.cobrandMentions;
  return item.totalMentions;
}

export function getCardsByLens(cards: readonly TopicCard[], lens: CardTypeLens): TopicCard[] {
  if (lens === "standalone") return cards.filter((c) => c.kind === "standalone");
  if (lens === "cobrand") return cards.filter((c) => c.kind === "cobrand");
  return [...cards];
}

export function getCardMix(item: Pick<MarketTopic, "standaloneMentions" | "cobrandMentions">): {
  standalonePct: number;
  cobrandPct: number;
} {
  const total = item.standaloneMentions + item.cobrandMentions;
  return {
    standalonePct: total ? Math.round((item.standaloneMentions / total) * 100) : 0,
    cobrandPct: total ? Math.round((item.cobrandMentions / total) * 100) : 0,
  };
}

export const V3_MARKET_CARD_TYPE_SUBTEXT =
  "Breaks external narrative by Standalone vs Co-branded card products.";

export const V3_MARKET_CARD_TYPE_INSIGHTS: Record<CardTypeLens, string> = {
  all: "Card declines, reward posting, refund status, and fee/APR clarity dominate the external narrative. Travel and partner-benefit complaints skew co-branded; APR and fee clarity skew standalone.",
  standalone:
    "Standalone card risk is led by card declines, cash-back posting, APR/fee clarity, balance transfer confusion, and digital card controls.",
  cobrand:
    "Co-branded card risk is led by travel credits, hotel points, partner refunds, reward posting, and merchant/co-brand fulfillment.",
};

/** Credit-card journey / product themes only — no generic banking-app labels */
export const V3_MARKET_TOPIC_ROWS: readonly V3MarketTopicRow[] = [
  {
    topic: "Card Authorization Failures",
    totalMentions: 218,
    wow: 17,
    riskScore: 21.8,
    dominantCategory: "Authorization",
    allowedCategories: ["payments", "service"],
    cardShortNames: ["Active Cash", "Attune", "Autograph", "Reflect", "BJ's One", "BJ's One+", "One Key"],
    standaloneMentions: 128,
    cobrandMentions: 90,
    mentionsColor: "red",
    wowColor: "red",
    channels: ["app_store", "play_store", "reddit", "trustpilot", "x"],
  },
  {
    topic: "Reward Posting Delays",
    totalMentions: 196,
    wow: 14,
    riskScore: 19.6,
    dominantCategory: "Rewards",
    allowedCategories: ["cashback", "rewards", "merchant_rewards", "partner_benefits"],
    cardShortNames: [
      "Active Cash",
      "Attune",
      "Autograph",
      "Autograph Journey",
      "One Key",
      "Choice Privileges",
      "Bilt",
      "BJ's One",
      "BJ's One+",
    ],
    standaloneMentions: 72,
    cobrandMentions: 124,
    mentionsColor: "red",
    wowColor: "red",
    channels: ["app_store", "reddit", "trustpilot", "x"],
  },
  {
    topic: "Fee & APR Transparency",
    totalMentions: 158,
    wow: 13,
    riskScore: 15.8,
    dominantCategory: "Fees & APR",
    allowedCategories: ["fee_clarity", "intro_apr", "no_annual_fee", "premium_travel"],
    cardShortNames: ["Reflect", "Active Cash", "Autograph Journey", "Bilt", "One Key+", "Choice Privileges"],
    standaloneMentions: 91,
    cobrandMentions: 67,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["app_store", "trustpilot", "x", "reddit"],
  },
  {
    topic: "Dispute & Refund Delays",
    totalMentions: 142,
    wow: 11,
    riskScore: 14.2,
    dominantCategory: "Disputes",
    allowedCategories: ["refund", "payments", "service"],
    cardShortNames: ["Active Cash", "Reflect", "Autograph", "One Key", "Choice Privileges", "BJ's One", "BJ's One+"],
    standaloneMentions: 58,
    cobrandMentions: 84,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["trustpilot", "x", "reddit", "play_store"],
  },
  {
    topic: "Travel Benefit Fulfillment",
    totalMentions: 124,
    wow: 9,
    riskScore: 12.4,
    dominantCategory: "Travel benefits",
    allowedCategories: ["travel", "premium_travel", "hotel_rewards", "partner_benefits"],
    cardShortNames: ["Autograph", "Autograph Journey", "One Key", "One Key+", "Choice Privileges", "Choice Select", "Bilt"],
    standaloneMentions: 28,
    cobrandMentions: 96,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["play_store", "x", "reddit", "trustpilot"],
  },
  {
    topic: "Balance Transfer Clarity",
    totalMentions: 108,
    wow: 12,
    riskScore: 10.8,
    dominantCategory: "Balance transfer",
    allowedCategories: ["balance_transfer", "intro_apr", "fee_clarity"],
    cardShortNames: ["Reflect", "Active Cash", "BJ's One", "Choice Privileges", "Bilt"],
    standaloneMentions: 52,
    cobrandMentions: 56,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["app_store", "trustpilot", "reddit"],
  },
  {
    topic: "Digital Card Controls",
    totalMentions: 96,
    wow: 10,
    riskScore: 9.6,
    dominantCategory: "Digital card",
    allowedCategories: ["app_access", "payments"],
    cardShortNames: ["Active Cash", "Attune", "Autograph", "Reflect", "Bilt", "One Key", "BJ's One"],
    standaloneMentions: 58,
    cobrandMentions: 38,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["app_store", "play_store", "reddit", "x"],
  },
  {
    topic: "International Card Usage",
    totalMentions: 88,
    wow: 6,
    riskScore: 8.8,
    dominantCategory: "International",
    allowedCategories: ["travel", "cross_border", "premium_travel"],
    cardShortNames: ["Autograph", "Autograph Journey", "One Key", "One Key+", "Choice Privileges", "Choice Select", "Bilt"],
    standaloneMentions: 22,
    cobrandMentions: 66,
    mentionsColor: "orange",
    wowColor: "red",
    channels: ["play_store", "reddit", "trustpilot", "x"],
  },
];

export const V3_MARKET_FRICTION_ROWS: readonly V3FrictionDriverRow[] = [
  {
    phrase: "My card was declined again",
    linkedTopic: "Card Authorization Failures",
    totalMentions: 142,
    sharePct: 17,
    allowedCategories: ["payments", "service"],
    cardShortNames: ["Active Cash", "Attune", "Autograph", "BJ's One"],
    standaloneMentions: 86,
    cobrandMentions: 56,
    badgeTone: "red",
    channels: ["trustpilot", "reddit"],
  },
  {
    phrase: "Cash-back is still not posted",
    linkedTopic: "Reward Posting Delays",
    totalMentions: 94,
    sharePct: 11,
    allowedCategories: ["cashback", "merchant_rewards"],
    cardShortNames: ["Active Cash", "Attune", "Signify Business Cash", "BJ's One", "BJ's One+"],
    standaloneMentions: 52,
    cobrandMentions: 42,
    badgeTone: "red",
    channels: ["trustpilot", "reddit"],
  },
  {
    phrase: "Points are not showing",
    linkedTopic: "Reward Posting Delays",
    totalMentions: 112,
    sharePct: 13,
    allowedCategories: ["rewards", "partner_benefits", "hotel_rewards"],
    cardShortNames: ["Autograph", "Autograph Journey", "One Key", "Choice Privileges", "Bilt"],
    standaloneMentions: 34,
    cobrandMentions: 78,
    badgeTone: "orange",
    channels: ["app_store", "reddit", "trustpilot"],
  },
  {
    phrase: "Why did my APR change?",
    linkedTopic: "Fee & APR Transparency",
    totalMentions: 88,
    sharePct: 10,
    allowedCategories: ["fee_clarity", "intro_apr", "no_annual_fee", "premium_travel"],
    cardShortNames: ["Reflect", "Active Cash", "Autograph Journey", "Bilt", "One Key+", "Choice Privileges"],
    standaloneMentions: 48,
    cobrandMentions: 40,
    badgeTone: "orange",
    channels: ["app_store", "trustpilot", "x"],
  },
  {
    phrase: "Balance transfer is not reflected",
    linkedTopic: "Balance Transfer Clarity",
    totalMentions: 82,
    sharePct: 9,
    allowedCategories: ["balance_transfer", "intro_apr"],
    cardShortNames: ["Reflect", "Active Cash", "BJ's One", "Choice Privileges", "Bilt"],
    standaloneMentions: 44,
    cobrandMentions: 38,
    badgeTone: "orange",
    channels: ["app_store", "trustpilot"],
  },
  {
    phrase: "Still waiting on my refund",
    linkedTopic: "Dispute & Refund Delays",
    totalMentions: 76,
    sharePct: 9,
    allowedCategories: ["refund", "payments", "service"],
    cardShortNames: ["Active Cash", "One Key", "Choice Privileges", "BJ's One"],
    standaloneMentions: 22,
    cobrandMentions: 54,
    badgeTone: "red",
    channels: ["x", "reddit", "play_store"],
  },
  {
    phrase: "Travel credit not posted",
    linkedTopic: "Travel Benefit Fulfillment",
    totalMentions: 79,
    sharePct: 9,
    allowedCategories: ["travel", "premium_travel", "partner_benefits"],
    cardShortNames: ["Autograph Journey", "Autograph", "One Key+", "Choice Select"],
    standaloneMentions: 20,
    cobrandMentions: 59,
    badgeTone: "orange",
    channels: ["play_store", "x"],
  },
  {
    phrase: "Hotel points are missing",
    linkedTopic: "Travel Benefit Fulfillment",
    totalMentions: 71,
    sharePct: 8,
    allowedCategories: ["hotel_rewards", "partner_benefits", "travel"],
    cardShortNames: ["Choice Privileges", "Choice Select", "One Key", "One Key+"],
    standaloneMentions: 0,
    cobrandMentions: 71,
    badgeTone: "orange",
    channels: ["reddit", "trustpilot", "x"],
  },
  {
    phrase: "Apple Pay card is not working",
    linkedTopic: "Digital Card Controls",
    totalMentions: 62,
    sharePct: 8,
    allowedCategories: ["app_access", "payments"],
    cardShortNames: ["Active Cash", "Autograph", "Bilt", "One Key", "BJ's One"],
    standaloneMentions: 28,
    cobrandMentions: 34,
    badgeTone: "orange",
    channels: ["app_store", "play_store", "reddit"],
  },
  {
    phrase: "Card failed while travelling",
    linkedTopic: "International Card Usage",
    totalMentions: 58,
    sharePct: 6,
    allowedCategories: ["travel", "cross_border"],
    cardShortNames: ["Autograph", "Autograph Journey", "One Key", "One Key+", "Choice Privileges", "Choice Select", "Bilt"],
    standaloneMentions: 16,
    cobrandMentions: 42,
    badgeTone: "orange",
    channels: ["play_store", "x", "reddit"],
  },
];

export const V3_EXECUTIVE_DIAGNOSIS_MARKET = [
  {
    label: "Main narrative" as const,
    value:
      "#RewardScam + influencer content are driving external collapse. NerdWallet/Bankrate downgrades add credibility to the negative story.",
    tone: "red" as const,
  },
  {
    label: "What changed" as const,
    value:
      "Reward program update 3 weeks ago. @CreditCardGuru video (2.1K Reddit upvotes) turned internal discontent into public narrative.",
    tone: "orange" as const,
  },
  {
    label: "Who is impacted" as const,
    value: "Premium and Travel cardholders. Echo rate: 24% of conversations. Churn in echo convos: 2.3× baseline.",
    tone: "yellow" as const,
  },
  {
    label: "Recommended action" as const,
    value:
      "Publish reward-value FAQ. Brief RMs on HNI talking points. Engage @FinanceBro counter-narrative. Fix Zero Fraud Liability gap urgently.",
    tone: "green" as const,
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// DRILL 3  —  FRAUD AND FULFILLMENT  (6 components)
// ═══════════════════════════════════════════════════════════════════════════

// 3.1  Dispute & Chargeback Cockpit
export const V3_DISPUTE_COCKPIT = {
  kpis: {
    openDisputes: 1_847,
    winRate: 38,
    avgAgeDays: 6.8,
    openDelta: +82,
    winDelta: -4,
    ageDelta: +0.6,
  },
  byStage: [
    { stage: "Intake",             count:  492, dwellDays: 0.4, flag: false },
    { stage: "Evidence Collection",count:  618, dwellDays: 3.2, flag: true },
    { stage: "Representment",      count:  410, dwellDays: 2.1, flag: false },
    { stage: "Decision",           count:  327, dwellDays: 1.1, flag: false },
  ],
  volumeByChannel: [
    { channel: "Voice",   count: 720 },
    { channel: "Chat",    count: 412 },
    { channel: "Email",   count: 321 },
    { channel: "App",     count: 298 },
    { channel: "Tickets", count:  96 },
  ],
  sparkWinRate: [47, 45, 44, 42, 40, 39, 38],
  aiNarrative:
    "✨ Backlog cleared 8% this week — but friendly-fraud wins still at 38% (industry 45%). BPO Vendor Beta pulling the average down. Unusual dispute velocity from Merchant XYZ started 36h ago.",
};

// 3.2  ✨ Fraud Pattern Detection
export const V3_FRAUD_PATTERNS = [
  { id: 1, name: "CNP Gaming MCC 7995",           confidence: 94, cardsAffected:    89, lossPerWeek: "$47K",  action: "Throttle MCC velocity" },
  { id: 2, name: "Merchant XYZ Breach Cascade",   confidence: 91, cardsAffected: 1_247, lossPerWeek: "$312K", action: "Batch reissue 68% → 100%" },
  { id: 3, name: "Household Friendly-Fraud Ring", confidence: 78, cardsAffected:    34, lossPerWeek: "$28K",  action: "Enhanced evidence collection" },
  { id: 4, name: "Contactless Transit Fraud",     confidence: 72, cardsAffected:    23, lossPerWeek: "$8K",   action: "Lower tap limit in metros" },
];

// 3.3  Process Resolution Time  (Sowmya's specific ask)
export const V3_PROCESS_TIMES = [
  { intent: "Card Activation",              fastest: 0.1,  avg: 0.4,  slowest: 1.2,  unit: "h", channel: "Voice/IVR" },
  { intent: "Balance Enquiry",              fastest: 0.1,  avg: 0.3,  slowest: 0.8,  unit: "h", channel: "Chat" },
  { intent: "Credit Limit Change",          fastest: 0.3,  avg: 2.2,  slowest: 7.9,  unit: "d", channel: "Chat" },
  { intent: "PIN Reset",                    fastest: 0.2,  avg: 0.9,  slowest: 3.1,  unit: "h", channel: "Voice" },
  { intent: "Dispute — 1st Touch",          fastest: 0.8,  avg: 2.4,  slowest: 6.2,  unit: "d", channel: "Tickets" },
  { intent: "Friendly-Fraud Representment", fastest: 4.2,  avg: 8.4,  slowest: 18.1, unit: "d", channel: "Tickets" },
  { intent: "Fraud Claim (CNP)",            fastest: 0.6,  avg: 2.8,  slowest: 8.4,  unit: "d", channel: "Voice" },
];
export const V3_PROCESS_AI =
  "✨ Friendly-fraud representment slowest has worsened from 14d to 18d — BPO handoff adding 4 days. Route > $200 representments in-house immediately.";

// 3.4  Reason Code × Win Rate Matrix
export const V3_REASON_CODES = [
  { code: "10.4 (Visa) Other Fraud — CNP",                cases: 342, winPct: 41, industry: 45, delta: -4, trend: "▼", winningEvidence: "Device fingerprint + AVS match + 3DS data" },
  { code: "4853 (MC) Cardholder Dispute Goods/Services",  cases: 268, winPct: 52, industry: 52, delta:  0, trend: "─", winningEvidence: "Proof of delivery + merchant response" },
  { code: "11.3 (Visa) No Authorization",                 cases: 156, winPct: 72, industry: 65, delta: +7, trend: "▲", winningEvidence: "Authorization log + card-present data" },
  { code: "13.1 (Visa) Merchandise Not Received",         cases: 124, winPct: 48, industry: 55, delta: -7, trend: "▼", winningEvidence: "Tracking + signature confirmation" },
  { code: "4837 (MC) No Cardholder Authorization",        cases:  98, winPct: 38, industry: 58, delta: -20, trend: "▼▼", winningEvidence: "3DS + device fingerprint (often missing)" },
  { code: "12.5 (Visa) Incorrect Amount",                 cases:  62, winPct: 68, industry: 70, delta: -2, trend: "─", winningEvidence: "Receipt + merchant statement" },
];

// 3.5  Merchant Risk Heatmap
export const V3_MERCHANT_RISK = [
  { merchant: "MERCHANT XYZ",          risk: "Alert",     disputes: 847, theme: "double-charge",              cbRatio: 2.4, mcc: "5734" },
  { merchant: "SUBSCRIPTION_APP_23",   risk: "Watch",     disputes: 184, theme: "I cancelled weeks ago",      cbRatio: 1.1, mcc: "5818" },
  { merchant: "MCC 7995 (Gaming)",     risk: "Breaching", disputes: 321, theme: "CNP fraud dominant",         cbRatio: 1.8, mcc: "7995" },
  { merchant: "AIRLINE_COBRAND_PARTNER",risk: "Watch",    disputes: 142, theme: "refund delay",               cbRatio: 0.9, mcc: "4511" },
  { merchant: "RIDESHARE_X",           risk: "Low",       disputes:  94, theme: "tip confusion",              cbRatio: 0.6, mcc: "4121" },
  { merchant: "TELECOM_RECURRING",     risk: "Alert",     disputes: 118, theme: "unauthorized auto-renewal",  cbRatio: 1.4, mcc: "4814" },
  { merchant: "HOTEL_CHAIN_PREMIUM",   risk: "Watch",     disputes:  82, theme: "incidental hold disputes",   cbRatio: 0.8, mcc: "7011" },
  { merchant: "STREAMING_SERVICE",     risk: "Low",       disputes:  68, theme: "price increase surprise",    cbRatio: 0.5, mcc: "4899" },
  { merchant: "GROCERY_MEGA",          risk: "Low",       disputes:  42, theme: "",                           cbRatio: 0.3, mcc: "5411" },
  { merchant: "GAS_STATION_CHAIN",     risk: "Low",       disputes:  38, theme: "pre-auth confusion",         cbRatio: 0.4, mcc: "5541" },
];
export const V3_MERCHANT_AI =
  "✨ 3 merchants above 1% CB ratio — recommend Visa Dispute Monitoring Program enrollment for MCC 7995 and MERCHANT XYZ. Telecom Recurring is the surprise — unauthorized auto-renewal theme.";

// 3.6  ✨ Workforce & BPO Throughput Console (full-width)
export const V3_WORKFORCE = [
  { team: "In-house Dispute Team A", casesPerDay: 48, complexity: "High", quality: 94, winPct: 78, billing: "$22",  truth: "$22",  note: "Benchmark team." },
  { team: "In-house Dispute Team B", casesPerDay: 42, complexity: "High", quality: 89, winPct: 71, billing: "$21",  truth: "$21",  note: "Solid · training on new reason codes." },
  { team: "BPO Vendor Alpha",        casesPerDay: 35, complexity: "Med",  quality: 82, winPct: 58, billing: "$14",  truth: "$28",  note: "OK for mid-complexity queue." },
  { team: "BPO Vendor Beta",         casesPerDay: 28, complexity: "Low",  quality: 68, winPct: 38, billing: "$12",  truth: "$73",  note: "$890K/qtr LOST in representments." },
];
export const V3_WORKFORCE_AI =
  "✨ BPO Vendor Beta saves $10/case in billing but costs $890K/quarter in lost representments. Recommendation: cap Vendor Beta to the low-complexity queue within 48h; route any dispute > $200 to in-house.";

// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════
export function severityTone(sev: "CRITICAL" | "HIGH" | "WATCH"): "red" | "amber" | "gold" {
  return sev === "CRITICAL" ? "red" : sev === "HIGH" ? "amber" : "gold";
}

export function gapTone(gap: string): "green" | "amber" | "red" {
  if (gap === "NONE") return "green";
  if (gap === "MODERATE") return "amber";
  return "red";
}

export function riskTone(r: "Low" | "Watch" | "Alert" | "Breaching"): "green" | "amber" | "red" {
  if (r === "Low") return "green";
  if (r === "Watch") return "amber";
  return "red";
}
