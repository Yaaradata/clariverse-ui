/**
 * Sterling Bank · head_retail — Customer Happiness drill-down content only.
 * Communication-derived intents (voice, chat, email, social/reviews) — no transaction joins.
 */

import type { FCICluster } from "@/lib/fci-lib/fciData";

export type SterlingHappinessIntentRow = {
  intent: string;
  share: number;
  sentiment: number;
  delta: number;
  sampleQuote: string;
};

export type SterlingHappinessDrillContent = {
  drillSub: string;
  panelSubtitle: string;
  segmentMeta: {
    hv: { label: string; count: string; note: string };
    lv: { label: string; count: string; note: string };
  };
  failureClusters: FCICluster[];
  hvIntents: SterlingHappinessIntentRow[];
  lvIntents: SterlingHappinessIntentRow[];
  commonIntents: { intent: string; hv: number; lv: number }[];
};

/** What's Failing? — Starling restriction / closure / payment-block themes */
const STERLING_HEAD_RETAIL_FAILURE_CLUSTERS: FCICluster[] = [
  {
    id: "sb-hr-1",
    category: "Account freeze / restriction — no reason",
    count: 2120,
    trend: 14.8,
    severity: "High Impact",
    examples: [
      "Account frozen the moment I paid money in — no explanation in app or email",
      "Restriction applied after inbound faster payment with no letter or chat reason",
      "Trustpilot reviewer cites 'no longer able to access funds' after pay-in",
    ],
    affectedCustomers: 1842,
    businessImpact: "Reputation spike on Trustpilot and X — Consumer Duty transparency gap on restriction reasons",
    totalInteractions: 7120,
    avgResolutionTime: "3.1 hours",
    topChannels: [
      { channel: "Voice", percentage: 32 },
      { channel: "Chat", percentage: 28 },
      { channel: "Email", percentage: 14 },
      { channel: "Social Media", percentage: 18 },
      { channel: "Ticket", percentage: 8 },
    ],
    topics: [
      "Pay-in freeze",
      "No reason given",
      "Restriction letter",
      "FOS quote",
      "Trustpilot thread",
      "In-app chat escalation",
    ],
    nextActionSuggestion:
      "Draft in-app restriction reason disclosure aligned to FCA Consumer Duty — propose only, never auto-send",
    processError: 68,
    productKnowledgeGap: 32,
  },
  {
    id: "sb-hr-2",
    category: "Payment blocked despite available balance",
    count: 1880,
    trend: 11.4,
    severity: "High Impact",
    examples: [
      "Card declined at retailer though balance shows in Spaces",
      "Outbound faster payment blocked — chat agent cannot see block code",
      "Play Store review: 'wouldn't let me spend my own money'",
    ],
    affectedCustomers: 1624,
    businessImpact: "Payment-block complaints concentrate on Android and Trustpilot — repeat contacts before social escalation",
    totalInteractions: 5840,
    avgResolutionTime: "2.6 hours",
    topChannels: [
      { channel: "Chat", percentage: 30 },
      { channel: "Voice", percentage: 26 },
      { channel: "App", percentage: 22 },
      { channel: "Social Media", percentage: 14 },
      { channel: "Email", percentage: 8 },
    ],
    topics: [
      "Card declined",
      "Payment blocked",
      "Spaces balance",
      "Faster payment hold",
      "Merchant decline",
      "Chat reason chase",
    ],
    nextActionSuggestion:
      "Draft payment-block explanation script for chat and voice — Distil-tagged phrases only; propose only",
    processError: 61,
    productKnowledgeGap: 39,
  },
  {
    id: "sb-hr-3",
    category: "Savings interest removed / saver rejected",
    count: 1710,
    trend: 18.2,
    severity: "High Impact",
    examples: [
      "Interest gone — rejected for the new saver product in the same conversation thread",
      "Email and chat both cite eligibility change with no prior notice",
      "Reddit thread on r/UKPersonalFinance compares rate removal across challengers",
    ],
    affectedCustomers: 1488,
    businessImpact: "Savings-rate discourse driving Trustpilot volume — not balance-at-risk, pure voice-of-customer",
    totalInteractions: 4920,
    avgResolutionTime: "2.4 hours",
    topChannels: [
      { channel: "Voice", percentage: 28 },
      { channel: "Email", percentage: 24 },
      { channel: "Chat", percentage: 22 },
      { channel: "Social Media", percentage: 16 },
      { channel: "App", percentage: 10 },
    ],
    topics: [
      "Rate removed",
      "Saver rejected",
      "Eligibility letter",
      "Interest gone",
      "Product switch",
      "FOS amplifier",
    ],
    nextActionSuggestion:
      "Draft proactive rate-change notification copy for chat and email — propose only",
    processError: 54,
    productKnowledgeGap: 46,
  },
  {
    id: "sb-hr-4",
    category: 'Account closure — "no longer welcome"',
    count: 1490,
    trend: 9.8,
    severity: "High Impact",
    examples: [
      "Closure email with no explanation — customer quotes letter verbatim on X",
      "Chat ended after security loop — account closed same day",
      "Trustpilot: 'no longer welcome and no one will tell me why'",
    ],
    affectedCustomers: 1312,
    businessImpact: "Closure-without-explanation themes amplified on social — FOS decision summaries reposted",
    totalInteractions: 4180,
    avgResolutionTime: "2.9 hours",
    topChannels: [
      { channel: "Email", percentage: 30 },
      { channel: "Chat", percentage: 26 },
      { channel: "Voice", percentage: 22 },
      { channel: "Social Media", percentage: 16 },
      { channel: "Ticket", percentage: 6 },
    ],
    topics: [
      "No longer welcome",
      "Closure letter",
      "No explanation",
      "Security loop",
      "FOS decision",
      "Trustpilot spike",
    ],
    nextActionSuggestion:
      "Draft closure communication review with Legal — Consumer Duty transparency; propose only",
    processError: 58,
    productKnowledgeGap: 42,
  },
  {
    id: "sb-hr-5",
    category: "App & Spaces technical errors",
    count: 1320,
    trend: 8.6,
    severity: "Medium",
    examples: [
      "Cannot move money between Spaces — app shows generic error",
      "Android update loop stops outbound transfers",
      "App Store praise for UX but Play Store threads cite Spaces transfer failures",
    ],
    affectedCustomers: 1184,
    businessImpact: "Technical-error mentions split by store — app praised, Android friction on Spaces",
    totalInteractions: 3640,
    avgResolutionTime: "2.2 hours",
    topChannels: [
      { channel: "App", percentage: 38 },
      { channel: "Chat", percentage: 28 },
      { channel: "Voice", percentage: 18 },
      { channel: "Social Media", percentage: 10 },
      { channel: "Email", percentage: 6 },
    ],
    topics: [
      "Spaces transfer",
      "App error code",
      "Android update",
      "Balance not updating",
      "In-app chat",
      "Play Store review",
    ],
    nextActionSuggestion:
      "Route Spaces-error transcripts to product triage queue — communication tags only; propose only",
    processError: 72,
    productKnowledgeGap: 28,
  },
  {
    id: "sb-hr-6",
    category: "Security lockout / cannot reach a human",
    count: 1210,
    trend: 7.4,
    severity: "Medium",
    examples: [
      "Stuck in app security loop — chat bot closes session before handoff",
      "Could not pass selfie check, then account restricted",
      "Customer cites #StuckWithBot in social post after three chat attempts",
    ],
    affectedCustomers: 1068,
    businessImpact: "Security lockout loops drive chat repeat rate — human escalation gap in app chat",
    totalInteractions: 3280,
    avgResolutionTime: "3.4 hours",
    topChannels: [
      { channel: "Chat", percentage: 42 },
      { channel: "App", percentage: 26 },
      { channel: "Voice", percentage: 18 },
      { channel: "Email", percentage: 8 },
      { channel: "Social Media", percentage: 6 },
    ],
    topics: [
      "Selfie check fail",
      "Bot loop",
      "Chat handoff",
      "Security questions",
      "Device change",
      "Account restricted",
    ],
    nextActionSuggestion:
      "Draft live-chat human escalation path for security lockout — propose only, never auto-send",
    processError: 64,
    productKnowledgeGap: 36,
  },
  {
    id: "sb-hr-7",
    category: "Sole-trader / SME onboarding rejection",
    count: 1040,
    trend: 6.2,
    severity: "Medium",
    examples: [
      "Cannot open sole-trader account without already trading — Reddit megathread",
      "Business chat cites proof-of-trading loop with no clear checklist",
      "Trustpilot SME reviewer quotes 'can't open without already trading'",
    ],
    affectedCustomers: 892,
    businessImpact: "SME onboarding rejection discourse on Reddit and Trustpilot — communication-only signal",
    totalInteractions: 2840,
    avgResolutionTime: "2.8 hours",
    topChannels: [
      { channel: "Chat", percentage: 34 },
      { channel: "Email", percentage: 28 },
      { channel: "Voice", percentage: 20 },
      { channel: "Social Media", percentage: 12 },
      { channel: "App", percentage: 6 },
    ],
    topics: [
      "Sole-trader proof",
      "Already trading",
      "Business onboarding",
      "Document loop",
      "SME chat",
      "Reddit SME thread",
    ],
    nextActionSuggestion:
      "Draft sole-trader onboarding checklist for chat and email — propose only",
    processError: 48,
    productKnowledgeGap: 52,
  },
  {
    id: "sb-hr-8",
    category: "Faster payment delay / funds not received",
    count: 970,
    trend: -2.4,
    severity: "Medium",
    examples: [
      "Inbound faster payment missing after 24 hours — status not visible in app",
      "Sender bank confirms sent — recipient sees no credit in chat transcript",
      "Email chase loop with no tracking reference in reply",
    ],
    affectedCustomers: 824,
    businessImpact: "Inbound payment delay mentions flat week-on-week — status visibility gap in comms",
    totalInteractions: 2460,
    avgResolutionTime: "2.0 hours",
    topChannels: [
      { channel: "Chat", percentage: 32 },
      { channel: "Voice", percentage: 28 },
      { channel: "Email", percentage: 22 },
      { channel: "App", percentage: 12 },
      { channel: "Social Media", percentage: 6 },
    ],
    topics: [
      "Faster payment delay",
      "Funds not received",
      "Tracking reference",
      "Sender confirmed",
      "Inbound credit",
      "Status in app",
    ],
    nextActionSuggestion:
      "Draft faster-payment status messaging for chat templates — propose only",
    processError: 56,
    productKnowledgeGap: 44,
  },
  {
    id: "sb-hr-9",
    category: "Review & social escalation",
    count: 860,
    trend: 16.6,
    severity: "Medium",
    examples: [
      "Customer posts Trustpilot review after unresolved restriction chat",
      "X thread amplified by UK personal-finance account — verbatim quote from chat",
      "FOS decision summary reposted with matching complaint phrases",
    ],
    affectedCustomers: 748,
    businessImpact: "Public escalation after chat/voice — reputation harm before formal complaint",
    totalInteractions: 2120,
    avgResolutionTime: "4.2 hours",
    topChannels: [
      { channel: "Social Media", percentage: 44 },
      { channel: "Email", percentage: 22 },
      { channel: "Chat", percentage: 18 },
      { channel: "Voice", percentage: 12 },
      { channel: "Ticket", percentage: 4 },
    ],
    topics: [
      "Trustpilot post",
      "X escalation",
      "Reddit thread",
      "FOS amplifier",
      "Hashtag repost",
      "Chat verbatim",
    ],
    nextActionSuggestion:
      "Monitor Distil-matched public quotes against open chat cases — propose outreach script only",
    processError: 42,
    productKnowledgeGap: 58,
  },
  {
    id: "sb-hr-10",
    category: "Consumer Duty / FOS transparency query",
    count: 640,
    trend: 5.4,
    severity: "Low",
    examples: [
      "Customer asks what FCA Consumer Duty means for unexplained restriction",
      "Email requests FOS referral path after closure letter",
      "Chat agent cannot cite fair-value wording for savings rate removal",
    ],
    affectedCustomers: 584,
    businessImpact: "Regulatory-language queries in voice and email — training gap on approved wording",
    totalInteractions: 1680,
    avgResolutionTime: "1.8 hours",
    topChannels: [
      { channel: "Voice", percentage: 34 },
      { channel: "Email", percentage: 30 },
      { channel: "Chat", percentage: 24 },
      { channel: "Social Media", percentage: 8 },
      { channel: "Ticket", percentage: 4 },
    ],
    topics: [
      "Consumer Duty",
      "FOS referral",
      "Fair value",
      "Restriction rights",
      "Closure appeal",
      "Approved wording",
    ],
    nextActionSuggestion:
      "Draft approved Consumer Duty phrasing pack for voice and chat — Legal review required; propose only",
    processError: 38,
    productKnowledgeGap: 62,
  },
];

const STERLING_HEAD_RETAIL_HV_INTENTS: SterlingHappinessIntentRow[] = [
  {
    intent: "Account freeze after pay-in",
    share: 24,
    sentiment: -0.62,
    delta: -0.16,
    sampleQuote: "Frozen the moment I paid money in — no one will say why.",
  },
  {
    intent: "Payment blocked on large transfer",
    share: 19,
    sentiment: -0.58,
    delta: -0.12,
    sampleQuote: "Blocked a normal payment though the balance is there.",
  },
  {
    intent: "Savings interest removed",
    share: 16,
    sentiment: -0.54,
    delta: -0.14,
    sampleQuote: "Interest gone — rejected for the new saver.",
  },
  {
    intent: 'Account closure — "no longer welcome"',
    share: 13,
    sentiment: -0.66,
    delta: -0.11,
    sampleQuote: "No longer welcome, and no explanation in the letter.",
  },
  {
    intent: "Security lockout escalation",
    share: 10,
    sentiment: -0.48,
    delta: -0.08,
    sampleQuote: "Couldn't pass app security, then they closed the chat.",
  },
  {
    intent: "FOS / Consumer Duty complaint",
    share: 8,
    sentiment: -0.52,
    delta: -0.09,
    sampleQuote: "I've asked for the FOS path twice in email.",
  },
  {
    intent: "Spaces transfer error",
    share: 6,
    sentiment: -0.34,
    delta: -0.05,
    sampleQuote: "Can't move money out of my Spaces.",
  },
  {
    intent: "SME account restriction",
    share: 4,
    sentiment: -0.44,
    delta: -0.06,
    sampleQuote: "Business account restricted after a single large invoice payment.",
  },
];

const STERLING_HEAD_RETAIL_LV_INTENTS: SterlingHappinessIntentRow[] = [
  {
    intent: "Account freeze — no reason",
    share: 26,
    sentiment: -0.58,
    delta: -0.14,
    sampleQuote: "Woke up to a frozen account with no message in the app.",
  },
  {
    intent: "Payment declined everyday",
    share: 21,
    sentiment: -0.64,
    delta: -0.15,
    sampleQuote: "Declined at the shop though I had money in Spaces.",
  },
  {
    intent: "App security / bot loop",
    share: 17,
    sentiment: -0.56,
    delta: -0.11,
    sampleQuote: "Stuck with the bot — can't reach a human.",
  },
  {
    intent: "Savings rate / saver rejection",
    share: 12,
    sentiment: -0.46,
    delta: -0.10,
    sampleQuote: "Applied for the saver — instantly rejected online.",
  },
  {
    intent: "Faster payment not received",
    share: 9,
    sentiment: -0.38,
    delta: -0.04,
    sampleQuote: "Sender says sent — I still have nothing after two days.",
  },
  {
    intent: "Sole-trader onboarding block",
    share: 6,
    sentiment: -0.42,
    delta: -0.07,
    sampleQuote: "Can't open sole-trader without already trading.",
  },
  {
    intent: "Spaces / app error",
    share: 5,
    sentiment: -0.28,
    delta: -0.03,
    sampleQuote: "App error when moving between pots.",
  },
  {
    intent: "Trustpilot / social escalation",
    share: 4,
    sentiment: -0.72,
    delta: -0.18,
    sampleQuote: "Posting on Trustpilot because chat went nowhere.",
  },
];

const STERLING_HEAD_RETAIL_COMMON_INTENTS = [
  { intent: "Account freeze", hv: -0.62, lv: -0.58 },
  { intent: "Payment declined", hv: -0.58, lv: -0.64 },
  { intent: "Savings interest removed", hv: -0.54, lv: -0.46 },
  { intent: "Security lockout", hv: -0.48, lv: -0.56 },
  { intent: "Account closure", hv: -0.66, lv: -0.52 },
  { intent: "App / Spaces error", hv: -0.34, lv: -0.28 },
];

export const STERLING_HEAD_RETAIL_HAPPINESS: SterlingHappinessDrillContent = {
  drillSub:
    "How happy are customers across voice, chat, email and social — restriction, payment-block and closure themes Distil extracts from complaint text alone.",
  panelSubtitle:
    "What higher-balance and mass-retail customers are contacting about — restriction, payment-block and closure themes from voice and chat (last 30 days)",
  segmentMeta: {
    hv: {
      label: "Higher-balance customers",
      count: "412K accounts",
      note: "Primary-account · £10K+ balances",
    },
    lv: {
      label: "Mass-retail customers",
      count: "3.19M accounts",
      note: "App-first · everyday banking",
    },
  },
  failureClusters: STERLING_HEAD_RETAIL_FAILURE_CLUSTERS,
  hvIntents: STERLING_HEAD_RETAIL_HV_INTENTS,
  lvIntents: STERLING_HEAD_RETAIL_LV_INTENTS,
  commonIntents: STERLING_HEAD_RETAIL_COMMON_INTENTS,
};
