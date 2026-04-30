// ═══════════════════════════════════════════════════════════════════════════
// HEAD OF CREDIT CARDS — V3
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
// 3 EXECUTIVE TILES  (Screen 1)
// ───────────────────────────────────────────────────────────────────────────
export type V3TileChannelSentiment = { channel: V3Channel; score: number };
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
  channelSentiment: V3TileChannelSentiment[];
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
    channelSentiment: [
      { channel: "Voice",   score: 0.57 },
      { channel: "Chat",    score: 0.72 },
      { channel: "Email",   score: 0.61 },
      { channel: "Social",  score: 0.49 },
      { channel: "Tickets", score: 0.59 },
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
    channelSentiment: [
      { channel: "Voice",   score: 0.55 },
      { channel: "Chat",    score: 0.58 },
      { channel: "Email",   score: 0.54 },
      { channel: "Social",  score: 0.41 },
      { channel: "Tickets", score: 0.56 },
    ],
    aiInsight:
      "NerdWallet/Bankrate mentions: +142% WoW across 89 chats. Social/X at 0.41, worst channel. #RewardScam volume: +287% WoW. @CreditCardGuru takedown echoed in 34 conversations.",
  },
  {
    id: "fraud_fulfillment",
    title: "Are we keeping our service promise?",
    subtitle:
      "Speed, accuracy, and fairness on fraud, disputes, regulatory commitments, and recovery.",
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
    channelSentiment: [
      { channel: "Voice",   score: 0.53 },
      { channel: "Chat",    score: 0.61 },
      { channel: "Email",   score: 0.52 },
      { channel: "Social",  score: 0.44 },
      { channel: "Tickets", score: 0.47 },
    ],
    aiInsight:
      "Dispute repeat contact: 47%, up from 39% WoW. 43 conversations cite evidence-collection delays. Evidence collection stage: 3.2× more negative contacts. BPO Vendor Beta is the bottleneck.",
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

// 2.3  ✨ Influencer & Watchlist Monitor
export const V3_INFLUENCER_WATCH = [
  { name: "@CreditCardGuru",  platform: "YouTube",   reach: "1.2M",  stance: "Negative", velocity: "▲",
    summary: "\"Reward devaluation deep-dive\" video · 2.1K Reddit upvotes", action: "Escalate to PR" },
  { name: "@FinanceBro",      platform: "TikTok",    reach: "840K",  stance: "Positive", velocity: "─",
    summary: "Student Card top pick video · 180K views",                    action: "Engage (amplifier)" },
  { name: "@ThePointsGuy",    platform: "YouTube",   reach: "640K",  stance: "Negative", velocity: "▲",
    summary: "\"CompetitorY's Platinum > ours\" in 3 posts this week",      action: "Escalate to PR" },
  { name: "r/CreditCards",    platform: "Reddit",    reach: "3.4K upv", stance: "Negative", velocity: "▲",
    summary: "Point-devaluation math thread pinned · 412 comments",          action: "Watch Closely" },
  { name: "@CardLens",        platform: "Instagram", reach: "1.1M",  stance: "Positive", velocity: "▲",
    summary: "CashBack Max real-world test reel · 312K views",               action: "Engage (amplifier)" },
];

// 2.4  Competitor Mention Monitor (from OUR voice/chat/social)
export const V3_COMPETITORS = [
  { name: "CompetitorY Freedom Unlimited", mentions: 412, threat: 8.2, context: "\"their 5% cashback is better\"", growth: "+38%" },
  { name: "Amex Gold",                     mentions: 287, threat: 6.4, context: "\"dining rewards are stronger\"", growth: "+14%" },
  { name: "Chase Sapphire Reserve",        mentions: 184, threat: 5.8, context: "\"travel insurance is reliable\"", growth:  "+9%" },
  { name: "Discover it",                   mentions: 142, threat: 4.1, context: "\"no annual fee, simple\"",        growth: "+22%" },
  { name: "Citi Double Cash",              mentions:  96, threat: 3.6, context: "\"2% flat is simpler\"",           growth:  "+6%" },
  { name: "Capital One Venture",           mentions:  71, threat: 3.1, context: "\"transfer partners are better\"", growth:  "+4%" },
];

// 2.5  Hashtag & Topic Momentum (2×2 grid)
export const V3_HASHTAGS = [
  { tag: "#RewardScam",      growth: "+287%", volume: 4_820, stance: "Negative", context: "Spike after program update",    quote: "\"My 180K points are now worth half\"" },
  { tag: "#ChargedTwice",    growth: "+164%", volume: 3_610, stance: "Negative", context: "Merchant XYZ breach amplifying", quote: "\"I didn't make this purchase\"" },
  { tag: "#MetalCardFlex",   growth:  "+58%", volume: 1_120, stance: "Positive", context: "Premium card design UGC",        quote: "\"The heft on this metal card\"" },
  { tag: "#CashbackKing",    growth:  "+42%", volume:   890, stance: "Positive", context: "Customer brags about rewards",   quote: "\"Made $1,200 back this year\"" },
];

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

// 2.7  ✨ Brand Promise Gap (full-width)
export const V3_BRAND_PROMISE_GAP = {
  compositeScore: 58,
  gaps: [
    { promise: "24×7 Concierge",              reality: "Average wait 47 min — Reddit evidence in 18 posts",             gap: "WIDE",     evidenceCount: 18 },
    { promise: "Real-time Reward Tracking",   reality: "Delay mentioned in 94 calls this week",                          gap: "MODERATE", evidenceCount: 94 },
    { promise: "Zero Fraud Liability",        reality: "8 customers quoted denial of coverage — public posts",           gap: "SEVERE",   evidenceCount:  8 },
    { promise: "Premium Airport Lounge",      reality: "4.2★ Trustpilot — lounge quality holds",                         gap: "NONE",     evidenceCount:  0 },
    { promise: "Best-in-Class Rewards",       reality: "#RewardScam trending · 287% growth · 4,820 negative posts",      gap: "SEVERE",   evidenceCount: 4_820 },
    { promise: "Dedicated Relationship Manager", reality: "HNI RM response time > 48h in 12 of 18 Infinia cases",          gap: "MODERATE", evidenceCount: 12 },
  ],
  aiNarrative:
    "✨ Brand Promise Score at 58/100. Two SEVERE gaps — Zero Fraud Liability and Best-in-Class Rewards — are driving 72% of the external narrative collapse. Zero Fraud Liability is the more urgent PR exposure because it contradicts a regulated promise.",
};

// Market reputation drill (V2 layout): command strip, echo, evidence — static demo data
export const V3_MARKET_REPUTATION_COMMAND = [
  { label: "Brand Promise Score", value: "58", unit: "/ 100", sub: "2 SEVERE gaps detected", tone: "orange" as const },
  { label: "External Sentiment", value: "-0.42", unit: "", sub: "▼ -0.18 in 6 weeks", tone: "red" as const },
  { label: "Internal Echo Rate", value: "24%", unit: "", sub: "of customer convos cite external", tone: "cyan" as const },
  { label: "Narrative Velocity", value: "+287%", unit: "WoW", sub: "#RewardScam acceleration", tone: "red" as const },
] as const;

export const V3_ECHO_TRACKER = [
  {
    source: "#RewardScam on X + Reddit",
    narrative: "Reward devaluation — points worth less",
    echoCount: "412",
    channels: "Voice (38%), Chat (42%), Social (20%)",
    churnPct: "8.4%",
    velocity: "+287% WoW",
    phrase: "my points are worth half now",
  },
  {
    source: "NerdWallet + Bankrate ranking drops",
    narrative: "Ranking downgrade — why pay premium for #4 card?",
    echoCount: "89",
    channels: "Chat (62%), Voice (28%), Email (10%)",
    churnPct: "5.2%",
    velocity: "+142% WoW",
    phrase: "saw on NerdWallet we dropped to #4",
  },
  {
    source: "@CreditCardGuru YouTube video",
    narrative: "Influencer takedown — reward math debunked",
    echoCount: "34",
    channels: "Voice (44%), Chat (38%), Social (18%)",
    churnPct: "9.1%",
    velocity: "+180% WoW",
    phrase: "that YouTuber was right about the rewards",
  },
  {
    source: "CompetitorY marketing push",
    narrative: "Competitor comparison — better cashback cited",
    echoCount: "186",
    channels: "Voice (52%), Chat (32%), Email (16%)",
    churnPct: "6.8%",
    velocity: "+38% WoW",
    phrase: "switching to CompetitorY, their cashback is better",
  },
  {
    source: "Reddit r/CreditCards thread",
    narrative: "Zero Fraud Liability questioned — denial stories",
    echoCount: "42",
    channels: "Ticket (48%), Voice (32%), Chat (20%)",
    churnPct: "7.1%",
    velocity: "+64% WoW",
    phrase: "Reddit says they denied fraud claims",
  },
] as const;

export const V3_ECHO_SUMMARY = {
  totalEcho: "763",
  totalConversations: "41,280",
  penetrationPct: "1.8%",
  echoToChurn: "14.2%",
  baselineChurn: "6.2%",
  fastestLabel: "#RewardScam",
  fastestDetail: "+287% WoW, 412 convos",
  highestChurnLabel: "@CreditCardGuru",
  highestChurnDetail: "9.1% churn in echo convos",
  liftMultiple: "2.3×",
} as const;

export const V3_MARKET_RANKS_INSIGHT = {
  before: "✦ 4 of 6 tracked sites downgraded us this month. Average rank drop: ",
  highlight: "1.8 positions",
} as const;

export const V3_CONVERSATION_EVIDENCE_MARKET = [
  {
    channel: "CHAT",
    segment: "PREMIUM",
    sentiment: "NEGATIVE" as const,
    text: "I checked NerdWallet and we're #4 now? I'm paying ₹5,500 annual fee for a #4 card?",
  },
  {
    channel: "VOICE",
    segment: "HNI / INFINIA",
    sentiment: "NEGATIVE" as const,
    text: "My RM hasn't responded in 48 hours. Reddit thread says your rewards are devalued. I'm looking at Amex Gold.",
  },
  {
    channel: "SOCIAL",
    segment: "CASHBACK",
    sentiment: "NEGATIVE" as const,
    text: "#RewardScam — my 180K points are now worth half what they were last year.",
  },
  {
    channel: "TICKET",
    segment: "TRAVEL",
    sentiment: "NEGATIVE" as const,
    text: "Third review site to downgrade you this month. Why should I keep paying the travel card fee?",
  },
  {
    channel: "VOICE",
    segment: "STARTER",
    sentiment: "NEUTRAL" as const,
    text: "My friend showed me a YouTube video about your card. Is it true the cashback changed?",
  },
] as const;

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

export const V3_MARKET_REPUTATION_ACTIONS = [
  {
    title: "Publish transparent reward-value FAQ",
    owner: "Cards Product + Marketing",
    impact: "Counter #RewardScam narrative with data",
    priority: "High" as const,
  },
  {
    title: "Brief RM team on HNI talking points",
    owner: "Wealth / Relationship",
    impact: "Stabilize Infinia closure intent",
    priority: "High" as const,
  },
  {
    title: "Engage positive influencer counter-narrative",
    owner: "Marketing / PR",
    impact: "Amplify @FinanceBro, @CardLens",
    priority: "Medium" as const,
  },
  {
    title: "Fix Zero Fraud Liability promise gap",
    owner: "Legal + Claims Ops",
    impact: "Urgent — contradicts regulated promise",
    priority: "Critical" as const,
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
