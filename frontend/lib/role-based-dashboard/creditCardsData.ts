// ═══════════════════════════════════════════════════════════════════
// HEAD OF CREDIT CARDS — DATA MODEL
// Framing: CX Promise Command Center (per Ranjith + Somya feedback)
// Channels: Email · Voice · Chat · Social · Tickets
// Lenses:  External (market perception) vs Internal (operations bubble-up)
// ═══════════════════════════════════════════════════════════════════

export const CREDIT_CARD_CHANNELS = ["Email", "Voice", "Chat", "Social", "Tickets"] as const;
export type CreditCardChannel = (typeof CREDIT_CARD_CHANNELS)[number];

// ─────────────────────────────────────────────────────────────
// CX PROMISE — 5 DIMENSIONS × 5 CHANNELS
// Sowmya: "ownership, emotional connection, quality, effort minimization
// is applicable to each channel. Drill downs should be each channel with
// individual scores. Command center is a weighted average."
// ─────────────────────────────────────────────────────────────
export const CX_PROMISE_DIMENSIONS = [
  { id: "ownership", label: "Ownership", desc: "Does the cardholder feel someone owns their issue end-to-end?" },
  { id: "emotion", label: "Emotional Connection", desc: "Empathy, tone, trust during card moments." },
  { id: "quality", label: "Quality of Resolution", desc: "Was the dispute / fraud / reward actually resolved correctly?" },
  { id: "effort", label: "Effort Minimization", desc: "How hard did the cardholder have to work to get a resolution?" },
  { id: "retention", label: "Retention Confidence", desc: "Post-resolution intent to keep and use the card." },
] as const;

// Per-channel FCI scores (0–100). Drives the weighted command-center score.
export const CX_PROMISE_FCI_BY_CHANNEL: Record<
  CreditCardChannel,
  { ownership: number; emotion: number; quality: number; effort: number; retention: number }
> = {
  Email:   { ownership: 72, emotion: 68, quality: 74, effort: 61, retention: 70 },
  Voice:   { ownership: 78, emotion: 71, quality: 73, effort: 58, retention: 68 },
  Chat:    { ownership: 74, emotion: 79, quality: 77, effort: 82, retention: 76 },
  Social:  { ownership: 52, emotion: 56, quality: 48, effort: 44, retention: 47 },
  Tickets: { ownership: 69, emotion: 64, quality: 66, effort: 55, retention: 63 },
};

export const CHANNEL_WEIGHTS: Record<CreditCardChannel, number> = {
  Email: 0.20, Voice: 0.28, Chat: 0.22, Social: 0.12, Tickets: 0.18,
};

// Card-specific volume signal feeding the channel strip.
export type ChannelPulse = {
  channel: CreditCardChannel;
  sentiment: number;           // 0–1
  volume: number;              // weekly interactions
  backlog: number;             // currently unresolved
  effort: number;              // 1–5 CES
  topIntent: string;           // dominant card intent in this channel
  resolutionDays: number;      // avg days to close the card intent
};

export const CREDIT_CARD_CHANNEL_PULSE: ChannelPulse[] = [
  { channel: "Email",   sentiment: 0.61, volume: 1_480, backlog: 204, effort: 3.3, topIntent: "Dispute evidence & chargeback follow-up", resolutionDays: 4.6 },
  { channel: "Voice",   sentiment: 0.57, volume: 2_195, backlog: 121, effort: 3.8, topIntent: "Fraud claim · Card decline / block", resolutionDays: 2.1 },
  { channel: "Chat",    sentiment: 0.66, volume: 2_650, backlog:  76, effort: 2.7, topIntent: "Reward redemption · Limit increase", resolutionDays: 1.3 },
  { channel: "Social",  sentiment: 0.49, volume:   980, backlog:  93, effort: 4.1, topIntent: "Annual fee / reward devaluation outrage", resolutionDays: 2.9 },
  { channel: "Tickets", sentiment: 0.59, volume: 1_740, backlog: 287, effort: 3.5, topIntent: "Chargeback lifecycle · Replacement dispatch", resolutionDays: 6.8 },
];

// ─────────────────────────────────────────────────────────────
// WEIGHTED COMMAND-CENTER SCORE (transparent formula)
// Ranjith: "we need to think of a score for that and an average / weighted
// average would be the command center score. Transparent so a head can see
// why the 76 is what it is."
// ─────────────────────────────────────────────────────────────
function computeWeightedChannelScore(channel: CreditCardChannel): number {
  const fci = CX_PROMISE_FCI_BY_CHANNEL[channel];
  const avg = (fci.ownership + fci.emotion + fci.quality + fci.effort + fci.retention) / 5;
  return Math.round(avg);
}

function computeOverallPromiseScore(): number {
  const weighted = CREDIT_CARD_CHANNELS.reduce((sum, ch) => {
    return sum + computeWeightedChannelScore(ch) * CHANNEL_WEIGHTS[ch];
  }, 0);
  return Math.round(weighted);
}

export const CREDIT_CARD_CHANNEL_SCORES: { channel: CreditCardChannel; score: number; weight: number; status: "green" | "amber" | "red" }[] =
  CREDIT_CARD_CHANNELS.map((ch) => {
    const score = computeWeightedChannelScore(ch);
    const status: "green" | "amber" | "red" = score >= 72 ? "green" : score >= 60 ? "amber" : "red";
    return { channel: ch, score, weight: CHANNEL_WEIGHTS[ch], status };
  });

export const CREDIT_CARD_PROMISE_SCORE = {
  score: computeOverallPromiseScore(),
  weekDelta: -2,
  target: 80,
  narrative:
    "Promise score of 68 is dragged almost entirely by Social (51) — reward-devaluation chatter and fee-shock posts. Chat and Voice are holding. Tickets is amber because chargeback lifecycle is clogging at evidence collection.",
  formula:
    "Channel Score = avg(Ownership, Emotion, Quality, Effort, Retention). Promise = Σ (ChannelScore × ChannelWeight).",
};

// ─────────────────────────────────────────────────────────────
// 3 CLICKABLE PILLARS (Level-1 only, strict 2-level UX)
// ─────────────────────────────────────────────────────────────
export type PillarCard = {
  id: "customer_card_journey" | "market_reputation" | "fraud_fulfillment";
  title: string;
  sub: string;
  score: number;
  status: "green" | "amber" | "red";
  trend: string;
  topSignal: string;
  kpis: { label: string; value: string }[];
  aiInsight: string; // ✨ AI
};

export const CREDIT_CARD_PILLARS: PillarCard[] = [
  {
    id: "customer_card_journey",
    title: "Are cardholders satisfied with their journey?",
    sub: "Satisfaction · FCI · Journey moments",
    score: 71,
    status: "amber",
    trend: "▼ 2 pts WoW",
    topSignal: "Redemption & statement clarity dragging Voice + Social",
    kpis: [
      { label: "FCI Avg",          value: "71" },
      { label: "Worst Moment",     value: "Redeem" },
      { label: "Journey NPS",      value: "+38" },
      { label: "HV Cardholder Happy", value: "68%" },
    ],
    aiInsight: "✨ AI: 42% of detractors mention unclear reward redemption rules; premium travel cohort over-indexes.",
  },
  {
    id: "market_reputation",
    title: "What is the market saying about us?",
    sub: "Brand perception · Review sites · Social virality · Influencers",
    score: 62,
    status: "amber",
    trend: "▼ 4 pts WoW",
    topSignal: "NerdWallet rank dropped #2→#3 on Platinum Travel",
    kpis: [
      { label: "Brand Sentiment",  value: "0.52" },
      { label: "Review Sites Avg", value: "#4" },
      { label: "Influencer Pos %", value: "38%" },
      { label: "Viral Posts 7d",   value: "4" },
    ],
    aiInsight: "✨ AI: Reward devaluation narrative concentrated on Platinum Travel variant — 3.4× social velocity.",
  },
  {
    id: "fraud_fulfillment",
    title: "Are we keeping our service promise?",
    sub: "Service promise · Dispute · Fraud · SLA · Workforce throughput",
    score: 69,
    status: "amber",
    trend: "▼ 3 pts WoW",
    topSignal: "BPO Beta representment win-rate collapsed to 38%",
    kpis: [
      { label: "Dispute Backlog",      value: "1,847" },
      { label: "Fraud Loss bps",       value: "11.2" },
      { label: "Avg Resolution",       value: "3.6 d" },
      { label: "Reopen Rate",          value: "18%" },
    ],
    aiInsight: "✨ AI: 18% of reopened disputes share the same evidence-gap pattern — BPO Beta chargebacks.",
  },
];

// ─────────────────────────────────────────────────────────────
// TOP CARD PROCESSES — resolution time (Sowmya: "fastest / avg / slowest
// across channels based on conversations")
// ─────────────────────────────────────────────────────────────
export type ProcessResolution = {
  process: string;
  fastest: number; // days
  avg: number;     // days
  slowest: number; // days
  volume: number;  // weekly
  dominantChannel: CreditCardChannel;
  attention: "pay_attention" | "watch" | "ignore";
};

export const CREDIT_CARD_PROCESS_RESOLUTION: ProcessResolution[] = [
  { process: "Fraud Claim (CNP)",              fastest: 0.6, avg: 2.8,  slowest: 8.4,  volume: 412, dominantChannel: "Voice",   attention: "pay_attention" },
  { process: "Billing / Chargeback Dispute",   fastest: 0.8, avg: 3.6,  slowest: 10.2, volume: 689, dominantChannel: "Tickets", attention: "pay_attention" },
  { process: "Reward Redemption Issue",        fastest: 0.3, avg: 1.7,  slowest: 6.2,  volume: 524, dominantChannel: "Chat",    attention: "watch" },
  { process: "Annual Fee Waiver",              fastest: 0.2, avg: 1.4,  slowest: 5.6,  volume: 186, dominantChannel: "Voice",   attention: "watch" },
  { process: "Credit Limit Increase",          fastest: 0.3, avg: 2.2,  slowest: 7.9,  volume: 271, dominantChannel: "Chat",    attention: "watch" },
  { process: "Card Activation / Decline Fix",  fastest: 0.1, avg: 0.8,  slowest: 3.4,  volume: 348, dominantChannel: "Voice",   attention: "ignore" },
  { process: "Replacement / Lost-Stolen",      fastest: 0.2, avg: 1.3,  slowest: 4.4,  volume: 233, dominantChannel: "Voice",   attention: "watch" },
  { process: "Statement Clarification",        fastest: 0.1, avg: 0.9,  slowest: 4.1,  volume: 301, dominantChannel: "Email",   attention: "ignore" },
];

// ─────────────────────────────────────────────────────────────
// EXTERNAL vs INTERNAL LENS (Somya: "externally where you stand,
// internally how you are doing — are those two matching up?")
// ─────────────────────────────────────────────────────────────
export const CREDIT_CARD_EXTERNAL_VS_INTERNAL = {
  external: [
    { label: "Social Sentiment",               value: "0.52",   status: "red",   context: "Reward backlash + fee posts" },
    { label: "Review-Site Avg Rank",           value: "#4",     status: "amber", context: "NerdWallet · Bankrate · WalletHub" },
    { label: "Influencer Positive Share",      value: "38%",    status: "amber", context: "4 of 10 creators positive" },
    { label: "Comparison-Site Top-5 Presence", value: "3 / 5",  status: "amber", context: "Lost travel #2 slot" },
    { label: "Brand NPS (consumer panel)",     value: "+28",    status: "amber", context: "Down 6 pts in 4 weeks" },
  ],
  internal: [
    { label: "CX Promise Score (weighted)",    value: "68",     status: "amber", context: "Social drags overall mix" },
    { label: "Dispute First-Time Closure",     value: "69%",    status: "red",   context: "31% reopen / re-route" },
    { label: "Fraud Triage < 2h",              value: "91%",    status: "green", context: "Voice fraud desk holds" },
    { label: "Workforce Throughput Index",     value: "82",     status: "amber", context: "BPO Beta below threshold" },
    { label: "Avg Card-Intent Resolution",     value: "3.6 d",  status: "amber", context: "Chargeback pulling up" },
  ],
  mismatch:
    "Internal ops are delivering 68 but external perception is stuck at 52. The gap is narrative, not operational — customers haven't been told what improved on disputes & fraud.",
};

// ─────────────────────────────────────────────────────────────
// PRIORITY QUEUE — top acts for the head of credit cards this week
// ─────────────────────────────────────────────────────────────
export const CREDIT_CARD_PRIORITY_QUEUE = [
  { intent: "Rewards Redemption Failure",        owner: "Rewards Ops",    channel: "Social",  severity: "High",   eta: "48h", impact: "Protects Platinum Travel NPS" },
  { intent: "Chargeback Re-open Loop",           owner: "Chargeback Team", channel: "Tickets", severity: "High",   eta: "72h", impact: "Recovers $890K rep. losses" },
  { intent: "Card Decline False Positive",       owner: "Fraud Ops",       channel: "Voice",   severity: "High",   eta: "24h", impact: "Reduces churn + social blowback" },
  { intent: "Statement Merchant-Name Confusion", owner: "Servicing Ops",   channel: "Email",   severity: "Medium", eta: "5d",  impact: "Cuts 2,800 calls/month" },
  { intent: "Credit Limit Increase Delay",       owner: "Risk Policy",     channel: "Chat",    severity: "Medium", eta: "5d",  impact: "Unlocks holiday spend" },
] as const;

// ═══════════════════════════════════════════════════════════════════
// DRILL 1 — CUSTOMER CARD JOURNEY
// ═══════════════════════════════════════════════════════════════════
export const CUSTOMER_CARD_JOURNEY_DATA = {
  // Cardholder lifecycle stages × channel FCI
  rail: [
    { stage: "Apply & KYC",     Email: 74, Voice: 72, Chat: 83, Social: 58, Tickets: 71 },
    { stage: "Issue & Activate",Email: 78, Voice: 76, Chat: 85, Social: 61, Tickets: 74 },
    { stage: "First Spend",     Email: 72, Voice: 70, Chat: 80, Social: 56, Tickets: 69 },
    { stage: "Statement",       Email: 68, Voice: 64, Chat: 75, Social: 52, Tickets: 66 },
    { stage: "Rewards Redeem",  Email: 61, Voice: 58, Chat: 71, Social: 47, Tickets: 60 },
    { stage: "Dispute / Fraud", Email: 60, Voice: 63, Chat: 70, Social: 44, Tickets: 54 },
    { stage: "Renewal",         Email: 69, Voice: 67, Chat: 74, Social: 55, Tickets: 65 },
  ],

  // Decline + Dispute friction index per channel (0–100, higher = worse)
  declineDispute: [
    { channel: "Email",   declineFriction: 29, disputeFriction: 41 },
    { channel: "Voice",   declineFriction: 36, disputeFriction: 44 },
    { channel: "Chat",    declineFriction: 21, disputeFriction: 33 },
    { channel: "Social",  declineFriction: 42, disputeFriction: 51 },
    { channel: "Tickets", declineFriction: 34, disputeFriction: 46 },
  ],

  // Rewards + billing confusion — top-intent share
  billingDrivers: [
    { topic: "Reward redemption math mismatch", share: 31, exampleChannel: "Chat" },
    { topic: "Annual fee value confusion",      share: 22, exampleChannel: "Voice" },
    { topic: "Merchant descriptor mismatch",    share: 18, exampleChannel: "Email" },
    { topic: "Interest / APR surprise",         share: 16, exampleChannel: "Voice" },
    { topic: "Late-fee dispute",                share: 13, exampleChannel: "Tickets" },
  ],

  // HV vs LV happiness split per card product
  hvVsLv: [
    { product: "Platinum Travel", hv: 62, lv: 78 },
    { product: "CashBack Max",    hv: 74, lv: 82 },
    { product: "Business Elite",  hv: 70, lv: 79 },
    { product: "Student Card",    hv: 76, lv: 84 },
  ],

  // Weekly Promise score trajectory
  promiseTimeline: [
    { week: "W1", score: 74, event: "Baseline" },
    { week: "W2", score: 73, event: "Reward change rolled out" },
    { week: "W3", score: 71, event: "Social chatter spikes" },
    { week: "W4", score: 70, event: "Influencer takedown video" },
    { week: "W5", score: 71, event: "Servicing playbook revised" },
  ],

  // FCI breakdown across 5 dimensions averaged cross-channel
  fciBreakdown: [
    { dim: "Ownership",             score: 69, best: "Voice",  worst: "Social"  },
    { dim: "Emotional Connection",  score: 68, best: "Chat",   worst: "Social"  },
    { dim: "Quality of Resolution", score: 68, best: "Chat",   worst: "Social"  },
    { dim: "Effort Minimization",   score: 60, best: "Chat",   worst: "Social"  },
    { dim: "Retention Confidence",  score: 65, best: "Chat",   worst: "Social"  },
  ],

  aiInsights: {
    rootCause:
      "✨ AI Why: Journey drops sharpest at Rewards Redemption. Root cause = rule-change comms missed Social + High-Value cohort. 42% of detractors quote redemption math.",
    nextBestActions:
      "✨ AI Action: (1) Social FAQ + creator outreach for redemption rules. (2) Voice script adds redemption walk-through at first dispute. (3) Pre-emptive email to 18k HV Platinum Travel holders within 72h.",
    predicted:
      "✨ AI Prediction: If Social redemption narrative is not corrected in 7 days, Journey NPS will slide −4 pts more and Platinum Travel renewal intent drops ~5%.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// DRILL 2 — MARKET REPUTATION  (Ranjith: "Social has to be included.
// Brands doing well, influencers recommending, comparison sites top-5.")
// ═══════════════════════════════════════════════════════════════════
export const MARKET_REPUTATION_DATA = {
  // Per card-product external vs internal scorecard
  brandScoreboard: [
    { brand: "Platinum Travel", external: 52, internal: 72, delta: -20, status: "red",   note: "NerdWallet dropped #2→#3 on reward devaluation narrative." },
    { brand: "CashBack Max",    external: 74, internal: 78, delta:  -4, status: "amber", note: "CompetitorY 5% unlimited offer threatening heavy-spenders." },
    { brand: "Business Elite",  external: 68, internal: 74, delta:  -6, status: "amber", note: "Strong internal, low influencer coverage vs. competitors." },
    { brand: "Student Card",    external: 80, internal: 82, delta:  -2, status: "green", note: "Best external perception. Strong TikTok creator presence." },
  ],

  // Comparison sites — Ranjith specifically called these out
  rankingPanel: [
    { site: "NerdWallet",     category: "Best Travel Cards",    rank: 3,  prev: 2, change: "down", top5: true  },
    { site: "Bankrate",       category: "Best Cashback",        rank: 5,  prev: 4, change: "down", top5: true  },
    { site: "The Points Guy", category: "Best Business Cards",  rank: 4,  prev: 5, change: "up",   top5: true  },
    { site: "WalletHub",      category: "Best No-Fee Cards",    rank: 7,  prev: 6, change: "down", top5: false },
    { site: "CreditKarma",    category: "Best Student Cards",   rank: 2,  prev: 2, change: "same", top5: true  },
    { site: "Forbes Advisor", category: "Best Overall Rewards", rank: 6,  prev: 4, change: "down", top5: false },
  ],

  // Social virality and hashtag momentum
  socialMomentum: [
    { week: "W1", positive: 260, negative: 210, viralPosts: 1 },
    { week: "W2", positive: 240, negative: 260, viralPosts: 2 },
    { week: "W3", positive: 225, negative: 295, viralPosts: 3 },
    { week: "W4", positive: 252, negative: 278, viralPosts: 4 },
  ],

  topHashtags: [
    { tag: "#RewardDevaluation",  volume: 3_420, stance: "negative", reach: "2.1M" },
    { tag: "#AnnualFeeNotWorth",  volume: 2_180, stance: "negative", reach: "1.4M" },
    { tag: "#StudentCardWin",     volume: 1_640, stance: "positive", reach: "890K"  },
    { tag: "#CashBackMaxChamp",   volume: 1_120, stance: "positive", reach: "620K"  },
    { tag: "#CardDeclinedAgain",  volume:   940, stance: "negative", reach: "480K"  },
  ],

  // Influencer + analyst watchlist
  influencerWatch: [
    { name: "@CreditCardGuru",    platform: "YouTube",    reach: "1.2M", stance: "Negative", topic: "Platinum Travel reward devaluation"         },
    { name: "@FinanceBro",        platform: "TikTok",     reach: "840K", stance: "Positive", topic: "Student Card top recommendation"           },
    { name: "@FinanceInfluencer", platform: "Twitter/X",  reach: "84K",  stance: "Negative", topic: "\"CompetitorY cashback is better\""        },
    { name: "@PointsDaily",       platform: "YouTube",    reach: "640K", stance: "Neutral",  topic: "Business Elite travel-protection review"   },
    { name: "r/CreditCards",      platform: "Reddit",     reach: "3.4K upv", stance: "Negative", topic: "Point-devaluation math thread"         },
    { name: "@CardLens",          platform: "Instagram",  reach: "1.1M", stance: "Positive", topic: "CashBack Max real-world test"              },
  ],

  // External ↔ Internal linkage: which ops gap feeds which external story
  opsLinkage: [
    { external: "Reward devaluation narrative",   internalGap: "Offer change comms skipped HV cohort", channels: "Social + Email", externalImpact: 34 },
    { external: "Chargeback delay complaints",    internalGap: "Ticket SLA misses on BPO Beta",         channels: "Tickets + Voice", externalImpact: 27 },
    { external: "Card decline anxiety posts",     internalGap: "Fraud false-positive rules too tight",  channels: "Voice + Social",  externalImpact: 19 },
    { external: "Annual-fee value backlash",      internalGap: "Loyalty save-desk offers not activated", channels: "Voice + Chat",   externalImpact: 14 },
  ],

  // Sentiment trend vs competitor average
  sentimentTrend: [
    { w: "W1", ours: 0.68, comp: 0.62 },
    { w: "W2", ours: 0.65, comp: 0.65 },
    { w: "W3", ours: 0.58, comp: 0.68 },
    { w: "W4", ours: 0.52, comp: 0.71 },
  ],

  aiInsights: {
    earlyWarning:
      "✨ AI Early Warning: Platinum Travel has 72% probability of trending-topic spike on Twitter/X in 5 days driven by @CreditCardGuru video + Reddit thread compounding.",
    narrativeActions:
      "✨ AI Narrative Actions: (1) Reach @PointsDaily with data on retained travel protections. (2) Push servicing success stats into earned-media kit. (3) Trigger 30-sec creator brief countering devaluation math.",
    competitiveMove:
      "✨ AI Competitive Move: CompetitorY's 5% unlimited hit our 412 heavy-spenders on Voice. Pre-emptive match-offer on high-risk 1,850 IDs recovers ~$2.4M revenue.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// DRILL 3 — FRAUD & FULFILLMENT
// Sowmya: "how fast are they solving, throughput of a team / channel /
// person — complexity and throughput are the two factors."
// ═══════════════════════════════════════════════════════════════════
export const FRAUD_FULFILLMENT_DATA = {
  // Card-specific intent resolution velocity (already defined at top-level,
  // reproduced here to keep the drill self-contained for charting)
  resolutionVelocity: CREDIT_CARD_PROCESS_RESOLUTION,

  // Dispute + fraud case lifecycle funnel
  caseLifecycle: [
    { stage: "Intake / Open",         cases: 1_847, slaPct: 94, status: "green" },
    { stage: "Triage & Assign",       cases: 1_620, slaPct: 88, status: "green" },
    { stage: "Investigate & Evidence", cases: 1_080, slaPct: 71, status: "amber" },
    { stage: "Merchant Representment", cases:   740, slaPct: 58, status: "red"   },
    { stage: "Resolve + Provisional",  cases:   910, slaPct: 82, status: "amber" },
    { stage: "Reopen / Reversal",      cases:   164, slaPct: 46, status: "red"   },
  ],

  // Channel × SLA × backlog pressure matrix
  slaBacklog: [
    { channel: "Email",   sla: 79, backlog: 204, aging48h: 47, severity: "amber" },
    { channel: "Voice",   sla: 88, backlog: 121, aging48h: 18, severity: "green" },
    { channel: "Chat",    sla: 91, backlog:  76, aging48h:  9, severity: "green" },
    { channel: "Social",  sla: 72, backlog:  93, aging48h: 31, severity: "amber" },
    { channel: "Tickets", sla: 75, backlog: 287, aging48h: 98, severity: "red"   },
  ],

  // Fraud type distribution + loss impact
  fraudTypes: [
    { name: "CNP (Card-Not-Present)", pct: 52, lossBps: 6.8, trend: "up"     },
    { name: "Friendly Fraud",         pct: 18, lossBps: 2.1, trend: "up"     },
    { name: "ATO (Takeover)",         pct: 14, lossBps: 1.2, trend: "stable" },
    { name: "Counterfeit",            pct:  9, lossBps: 0.7, trend: "down"   },
    { name: "Lost / Stolen",          pct:  7, lossBps: 0.4, trend: "stable" },
  ],

  // Workforce — throughput × complexity (teams: in-house vs BPO)
  throughputComplexity: [
    { team: "In-House A",  cases: 42, complexity: 78, quality: 94, winRate: 71, costPerCase: "$18" },
    { team: "In-House B",  cases: 38, complexity: 71, quality: 89, winRate: 68, costPerCase: "$21" },
    { team: "BPO Alpha",   cases: 31, complexity: 49, quality: 76, winRate: 52, costPerCase: "$13" },
    { team: "BPO Beta",    cases: 28, complexity: 44, quality: 68, winRate: 38, costPerCase: "$11" },
  ],

  // Escalation + reopen risk per channel
  escalationRisk: [
    { channel: "Email",   risk: 32, driver: "Evidence back-and-forth" },
    { channel: "Voice",   risk: 27, driver: "Handoff to chargeback" },
    { channel: "Chat",    risk: 18, driver: "Authentication fails" },
    { channel: "Social",  risk: 41, driver: "Public escalation → regulator" },
    { channel: "Tickets", risk: 46, driver: "Representment SLA miss" },
  ],

  // "Areas to pay attention / watch / ignore" matrix (Ranjith feedback)
  attentionMatrix: [
    { topic: "BPO Beta chargeback representment",  bucket: "pay_attention", reason: "Win-rate 38% vs 71% in-house — $890K/qtr lost" },
    { topic: "Fraud false-positive tuning",         bucket: "pay_attention", reason: "Social posts on wrong declines rising" },
    { topic: "Reward redemption rules clarity",    bucket: "pay_attention", reason: "Drives 42% of CX detractor mentions" },
    { topic: "Limit-increase SLA on Chat",         bucket: "watch",          reason: "Holiday-spend window approaching" },
    { topic: "Replacement card dispatch",          bucket: "watch",          reason: "Stable but reliant on 1 carrier" },
    { topic: "Activation desk volume",             bucket: "ignore",         reason: "Hitting SLA. Auto-ivr covering 82%" },
    { topic: "Statement-date reminders",           bucket: "ignore",         reason: "Already at 96% SLA — no action" },
  ],

  aiInsights: {
    optimizer:
      "✨ AI Fulfillment Optimizer: Reroute 12% of Ticket chargeback queue into Chat-assisted evidence collection. Predicted: −0.9d cycle, +7 pts representment win-rate.",
    whatIf:
      "✨ AI What-If: If BPO Beta quality lifts from 68→82, Promise score moves 68→73 in 14 days and reopen rate drops 18%→11%.",
    fraudPattern:
      "✨ AI Fraud Pattern: MCC 7995 (gaming) CNP cluster tests $1–$5 then escalates to $200–$800. 89 cards match pattern in last 24h; velocity limit saves est. $47K/week.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// AI COMMAND BRIEF (level-1 hero bottom section)
// ═══════════════════════════════════════════════════════════════════
export const CREDIT_CARD_AI_COMMAND_BRIEF = {
  headline: "✨ AI Command Brief — Credit Cards, This Week",
  bullets: [
    "Promise score stuck at 68 because Social (51) is single-handedly dragging a weighted mix that is otherwise amber-to-green.",
    "Chargeback evidence-collection step on Tickets channel is the #1 internal gap amplifying the external reward-devaluation narrative.",
    "Platinum Travel brand has a 20-pt external-vs-internal gap. Internal ops are delivering — customers aren't being told.",
    "BPO Beta representment win-rate at 38% vs. 71% in-house; $890K/qtr avoidable loss concentrated in one vendor.",
  ],
  recommendedFocus: [
    { action: "Rewards-redemption narrative fix on Social", eta: "48h", owner: "Marketing + Servicing" },
    { action: "BPO Beta chargeback evidence SOP rework",   eta: "5d",  owner: "Chargeback Ops" },
    { action: "Creator outreach for Platinum Travel",      eta: "72h", owner: "Brand + PR" },
  ],
};
