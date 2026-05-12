"use client";

import { ArrowLeft } from "lucide-react";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useId,
  useState,
} from "react";

import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";
import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
} from "./DashboardThemeContext";

const COLORS = {
  bg: "#070707",
  card: "#0d0d0d",
  card2: "#121212",
  inset: "#1a1a1a",
  border: "#242424",
  border2: "#3a3a3a",
  text: "#ffffff",
  muted: "#939394",
  dim: "#6b7280",
  purple: "#5332FF",
  red: "#ef4444",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#38bdf8",
  blue: "#60a5fa",
} as const;

const severityColor = {
  Critical: COLORS.red,
  High: COLORS.amber,
  Watch: COLORS.yellow,
  Good: COLORS.green,
  Improving: COLORS.green,
  Working: COLORS.green,
  New: COLORS.purple,
  Pending: COLORS.dim,
  "Needs owner": COLORS.red,
} as const;

type SeverityKey = keyof typeof severityColor;

function cx(...items: Array<string | false | null | undefined>): string {
  return items.filter(Boolean).join(" ");
}

function list<T>(value: ReadonlyArray<T> | null | undefined): T[] {
  return value?.length ? [...value] : [];
}

function colorFor(severity: string): string {
  if (severity in severityColor) {
    return severityColor[severity as SeverityKey];
  }
  return COLORS.purple;
}

const headlineSignals = [
  {
    id: "funding",
    severity: "Critical" as const,
    title: "First funding is the trust break",
    outcome: "Money-access anxiety",
    impact: "214 contacts, 43 past promise, 18 closure-intent signals",
    insight:
      "Customers are not only asking when the transfer clears. They are asking whether their money is safe because available balance, hold period, and support explanation do not align.",
    chain: [
      { label: "Account activity", value: "First deposit hold" },
      { label: "Voice", value: "Where is my money?" },
      { label: "Chat", value: "Balance looks wrong" },
      { label: "Ticket", value: "No owner after 48h" },
      { label: "Risk", value: "Complaint language" },
    ],
    metrics: [
      "91% confidence",
      "+18% repeat",
      "14d oldest",
      "$1.8M balance affected",
    ],
  },
  {
    id: "auth",
    severity: "High" as const,
    title: "Trusted-device recovery is forcing support dependency",
    outcome: "Digital self-service failure",
    impact: "86 auth calls, 31 loops, 41 failed auth events",
    insight:
      "Phone-change and OTP issues are not isolated login failures. They create multi-contact loops because the recovery path requires the unavailable trusted device.",
    chain: [
      { label: "Auth event", value: "OTP failure" },
      { label: "Voice", value: "New phone" },
      { label: "Ticket", value: "Verification pending" },
      { label: "Email", value: "Generic reset note" },
      { label: "Risk", value: "Blocked access" },
    ],
    metrics: [
      "87% confidence",
      "31 loops",
      "+9 complaint phrases",
      "3.1 contacts/case",
    ],
  },
  {
    id: "handoff",
    severity: "High" as const,
    title: "Case context is not traveling across channels",
    outcome: "Repeat-contact loop",
    impact: "142 repeat contacts, 4 channels, 23 complaint phrases",
    insight:
      "Customers are re-explaining the same issue across voice, chat, email, and tickets. The failure is not a single interaction; it is lack of persistent case ownership.",
    chain: [
      { label: "Voice", value: "Explained once" },
      { label: "Chat", value: "Explained again" },
      { label: "Email", value: "Different answer" },
      { label: "Ticket", value: "No continuity" },
      { label: "Risk", value: "Escalation intent" },
    ],
    metrics: [
      "84% confidence",
      "142 repeats",
      "4 channels",
      "27% likely repeat",
    ],
  },
] as const;

type HeadlineSignal = (typeof headlineSignals)[number];

function chainFromSignal(
  signal: HeadlineSignal,
): Array<{ label: string; value: string }> {
  return signal.chain.map((n) => ({ label: n.label, value: n.value }));
}

function metricsFromSignal(signal: HeadlineSignal): string[] {
  return [...signal.metrics];
}

const channelSignals = [
  {
    channel: "Voice",
    count: "42.8K",
    share: "55% of interactions",
    issue: "money-access anxiety",
    phrase: "I need to know when this clears",
    severity: "Critical" as const,
    trend: [38, 44, 52, 58, 65, 73, 80, 30],
    delta: "+18% WoW",
    topDispute: "First-deposit hold / available balance",
    disputeCount: "214 cases",
    repeat: "47% repeat",
    owner: "Deposit Ops",
    sentiment: "-0.61",
  },
  {
    channel: "Chat",
    count: "18.4K",
    share: "24% of interactions",
    issue: "balance confusion",
    phrase: "available balance does not match",
    severity: "High" as const,
    trend: [40, 36, 42, 38, 45, 41, 48, 52],
    delta: "+11% WoW",
    topDispute: "Balance display mismatch",
    disputeCount: "163 cases",
    repeat: "31% repeat",
    owner: "CX Ops",
    sentiment: "-0.44",
  },
  {
    channel: "Email",
    count: "9.7K",
    share: "13% of interactions",
    issue: "generic replies",
    phrase: "same answer, no date",
    severity: "High" as const,
    trend: [30, 30, 32, 31, 34, 35, 36, 43],
    delta: "+9% WoW",
    topDispute: "No clear ETA after escalation",
    disputeCount: "88 cases",
    repeat: "39% repeat",
    owner: "Email Ops",
    sentiment: "-0.49",
  },
  {
    channel: "Tickets",
    count: "6.2K",
    share: "8% of interactions",
    issue: "owner gap",
    phrase: "pending back office",
    severity: "Critical" as const,
    trend: [22, 25, 33, 31, 44, 48, 55, 10],
    delta: "+22% WoW",
    topDispute: "No owner after 48 hours",
    disputeCount: "142 cases",
    repeat: "52% repeat",
    owner: "Back Office Ops",
    sentiment: "-0.57",
  },
] as const;

const bestCalls = [
  {
    rank: 1,
    score: 94,
    severity: "Good" as const,
    title: "Funds-hold call converted frustration into wait confidence",
    reason:
      "Agent explained current vs available balance, gave the exact clearing window, and confirmed follow-up.",
    pattern: "Replicate for first-deposit confusion.",
    proof: "Voice + ticket match",
    evidence: "48 similar calls",
  },
  {
    rank: 2,
    score: 91,
    severity: "Good" as const,
    title: "Trusted-device reset handled without bounce-back",
    reason:
      "Agent verified identity once and stayed with the customer until the next step was visible.",
    pattern: "Replicate for phone-change and OTP recovery.",
    proof: "Voice + auth-event match",
    evidence: "31 similar loops",
  },
  {
    rank: 3,
    score: 88,
    severity: "Good" as const,
    title: "Rate shopper retained after app limitation concern",
    reason:
      "Agent acknowledged limitations and reframed the account as savings-first, not checking replacement.",
    pattern: "Replicate when APY attraction meets transfer concern.",
    proof: "Voice + chat match",
    evidence: "22 similar calls",
  },
];

const worstCalls = [
  {
    rank: 1,
    score: 22,
    severity: "Critical" as const,
    title: "Blocked-account issue repeated across four contacts",
    reason:
      "Customer moved chat to phone to email to supervisor without one accountable owner.",
    pattern: "Fix owner gap for multi-contact account-access cases.",
    proof: "3-day loop, 4 contacts",
    evidence: "31 similar loops",
  },
  {
    rank: 2,
    score: 28,
    severity: "Critical" as const,
    title: "Funds-availability answer sounded like policy, not help",
    reason:
      "Agent gave a generic hold explanation but no customer-specific availability date.",
    pattern:
      "Fix scripts that explain policy without resolving the customer question.",
    proof: "Voice + email match",
    evidence: "56 similar calls",
  },
  {
    rank: 3,
    score: 34,
    severity: "High" as const,
    title: "Fraud case required customer to re-explain everything",
    reason:
      "Case number existed, but context was not carried into the next interaction.",
    pattern: "Fix case-continuity between fraud notes and frontline support.",
    proof: "Voice + case-note match",
    evidence: "19 similar calls",
  },
];

type CallRow = (typeof bestCalls)[number] | (typeof worstCalls)[number];

type RecoveryVerdict = "No movement" | "Improving" | "Working" | "New baseline";

type RecoveryBoardItem = {
  id: string;
  insight: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  status: RecoveryVerdict;
  detected: string;
  customerPain: string;
  interventionSignal: string;
  howWeKnow: readonly string[];
  target: string;
  measured: string;
  confidence: number;
  progress: number;
  beforeStrip: string;
  afterStrip: string;
  verdict: RecoveryVerdict;
};

const recoveryBoard: readonly RecoveryBoardItem[] = [
  {
    id: "funding-copy",
    severity: "Critical",
    insight: "Funds-availability message",
    status: "No movement",
    detected: "214 contacts",
    customerPain: "“I cannot access my money”",
    interventionSignal: "No confirmed workflow change detected in customer-facing explanation (observed recovery signal only).",
    howWeKnow: [
      "Repeat contact still 47%",
      "Unresolved language unchanged",
      "Available-balance confusion still rising",
    ],
    target: "repeat calls -30%",
    measured: "0% movement",
    confidence: 91,
    progress: 18,
    beforeStrip: "214 contacts · 47% repeat · −0.61 sentiment",
    afterStrip: "214 contacts · 47% repeat · −0.60 sentiment",
    verdict: "No movement",
  },
  {
    id: "auth-route",
    severity: "High",
    insight: "Trusted-device recovery route",
    status: "Improving",
    detected: "31 loops",
    customerPain: "“I changed my phone and cannot get back in”",
    interventionSignal: "Observed recovery signal: change in recovery language and lower repeat-contact loops (not workflow-confirmed).",
    howWeKnow: [
      "Repeat loops down 29%",
      "Lockout phrases down 18%",
      "“Cannot get back in” mentions down 24%",
    ],
    target: "loops -25%",
    measured: "loops -29%",
    confidence: 87,
    progress: 62,
    beforeStrip: "31 loops · 3.1 contacts/case · −0.54 sentiment",
    afterStrip: "22 loops · 2.2 contacts/case · −0.38 sentiment",
    verdict: "Improving",
  },
  {
    id: "single-owner",
    severity: "Good",
    insight: "Single-owner repeat-contact rule",
    status: "Working",
    detected: "142 repeats",
    customerPain: "“I keep getting a different answer”",
    interventionSignal: "Observed recovery signal: case-context language improved across follow-up contacts.",
    howWeKnow: [
      "Repeat contacts down 27%",
      "“Already explained” mentions down 21%",
      "Reopened tickets down 16%",
    ],
    target: "repeats -20%",
    measured: "repeats -27%",
    confidence: 84,
    progress: 74,
    beforeStrip: "142 repeats · 39% repeat · −0.49 sentiment",
    afterStrip: "104 repeats · 28% repeat · −0.32 sentiment",
    verdict: "Working",
  },
  {
    id: "fraud-context",
    severity: "Watch",
    insight: "Fraud case continuity",
    status: "New baseline",
    detected: "19 cases",
    customerPain: "“I have a case number but nobody has the history”",
    interventionSignal: "Baseline created from conversation pattern; no movement window yet (observed recovery signal only).",
    howWeKnow: [
      "Repeat history phrases detected",
      "Case-number mentions detected",
      "Escalation language detected",
    ],
    target: "handoffs -20%",
    measured: "baseline pending",
    confidence: 78,
    progress: 28,
    beforeStrip: "19 cases · 4.2 contacts/case · −0.57 sentiment",
    afterStrip: "Baseline pending",
    verdict: "New baseline",
  },
];

type RecoveryItem = RecoveryBoardItem;

function verdictSeverity(v: RecoveryVerdict): string {
  switch (v) {
    case "No movement":
      return "Critical";
    case "Improving":
      return "High";
    case "Working":
      return "Good";
    case "New baseline":
      return "Watch";
  }
}

type RiskLayerCard = {
  title: string;
  serviceDispute: string;
  customerIntent: string;
  regulatoryLanes: readonly string[];
  evidenceVolume: string;
  sourceEvidence: readonly string[];
  whyItMatters: string;
  urgency: string;
  severity: "Critical" | "High" | "Watch" | "Good";
};

const riskPulseHeader = {
  score: 67,
  status: "Elevated",
  mainExposure: "Money access + transfer dispute + no-answer patterns",
  whyItMatters:
    "Customer cannot access money, repeats contact, and starts using complaint language.",
  activeLanes: [
    "CFPB complaint watch",
    "UDAAP watch",
    "Reg E review",
    "Vulnerable customer review",
  ] as const,
  urgencyChips: ["CFPB 15d / 60d", "Reg E clock may apply", "UDAAP harm + unclear terms"] as const,
} as const;

const riskLayerCards: readonly RiskLayerCard[] = [
  {
    title: "Money Access / Funds Availability",
    serviceDispute: "Deposit hold / transfer availability",
    customerIntent: "“I cannot access my money”",
    regulatoryLanes: ["CFPB complaint watch", "UDAAP watch"],
    evidenceVolume: "214 contacts · 47% repeat · 43 overdue cases",
    sourceEvidence: ["Voice", "Chat", "Tickets"],
    whyItMatters: "Monetary harm + unclear explanation + repeat contact can become complaint risk.",
    urgency: "48h watch",
    severity: "Critical",
  },
  {
    title: "Transfer Error / EFT Dispute",
    serviceDispute: "Failed transfer / cancelled transfer / wrong amount",
    customerIntent: "“The transfer failed or the money moved incorrectly”",
    regulatoryLanes: ["Reg E review"],
    evidenceVolume: "31 tickets · 11 complaint notes · 18 clarification requests",
    sourceEvidence: ["Tickets", "Complaint notes", "Email"],
    whyItMatters: "EFT error-resolution timelines may apply.",
    urgency: "Reg E clock",
    severity: "High",
  },
  {
    title: "Account Access / Lockout",
    serviceDispute: "OTP / trusted-device / phone-change recovery",
    customerIntent: "“I am locked out and need access”",
    regulatoryLanes: ["CFPB complaint watch", "Vulnerable customer review"],
    evidenceVolume: "86 auth calls · 31 repeat loops · 7 vulnerable-customer cues",
    sourceEvidence: ["Voice", "Chat", "Case notes"],
    whyItMatters: "Access failure becomes serious when the customer cannot reach funds.",
    urgency: "Same-day review",
    severity: "High",
  },
  {
    title: "Payment / Collection Pressure",
    serviceDispute: "Payment website failure / payoff confusion / collection pressure",
    customerIntent: "“I tried to pay but the system failed”",
    regulatoryLanes: ["UDAAP watch", "FDCPA watch — where collection conduct applies"],
    evidenceVolume: "27 calls · 18 emails · 9 collection-pressure phrases",
    sourceEvidence: ["Voice", "Email", "Complaint notes"],
    whyItMatters: "Customer may be penalized for a bank-side payment or communication failure.",
    urgency: "Weekly review",
    severity: "Watch",
  },
];

const riskEscalationQueue = [
  { id: "e1", label: "Money-access cluster", detail: "47% repeat + complaint-intent language rising" },
  { id: "e2", label: "Reg E documentation", detail: "Clarification requests without clear resolution clock" },
  { id: "e3", label: "Lockout + funds need", detail: "Same-day vulnerable cue + auth loop" },
] as const;

type PublicTrendItem = {
  title: string;
  meta: string;
  signal: string;
};

type ThemeBar = { label: string; pct: number };

type SeveritySlice = { label: string; pct: number };

type PublicVoiceChannel = {
  id: string;
  channel: string;
  score: string;
  metric: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  dominantIssue: string;
  sentimentSkew: string;
  publicVolume: string;
  internalEchoSummary: string;
  themeBreakdown: readonly ThemeBar[];
  trendingItems: readonly PublicTrendItem[];
  echoBox: {
    external: string;
    internal: string;
    businessRead: string;
  };
  severityMix: readonly SeveritySlice[];
  positiveSignal?: { title: string; body: string };
};

const publicChannels: readonly PublicVoiceChannel[] = [
  {
    id: "trustpilot",
    channel: "Trustpilot",
    score: "1.5",
    metric: "125 reviews",
    severity: "Critical",
    dominantIssue: "Payment process, funds access, and inconsistent support answers",
    sentimentSkew: "Negative skew",
    publicVolume: "125 public reviews",
    internalEchoSummary: "214 contacts cite funds availability, access, or unclear timelines",
    themeBreakdown: [
      { label: "Funds / account access", pct: 34 },
      { label: "Poor customer service", pct: 28 },
      { label: "Inconsistent information", pct: 22 },
      { label: "Long response times", pct: 16 },
    ],
    trendingItems: [
      {
        title: "Funds withdrawn, unavailable for days",
        meta: "1 star · recent review",
        signal: "money-access anxiety",
      },
      {
        title: "Phone number change blocks account access",
        meta: "1 star · multi-contact story",
        signal: "trusted-device recovery",
      },
      {
        title: "No clear explanation after deposit closure",
        meta: "complaint-language",
        signal: "formal escalation risk",
      },
    ],
    echoBox: {
      external:
        "Trustpilot reviewers repeatedly cite payment process friction, funds access, and slow or contradictory support answers.",
      internal:
        "Voice + chat + tickets show 214 related contacts; repeat pressure clusters around availability wording and hold timing.",
      businessRead:
        "Public pain matches internal first-funding and access confusion — treat as one trust thread, not a separate “reviews” problem.",
    },
    severityMix: [
      { label: "Critical", pct: 42 },
      { label: "High", pct: 31 },
      { label: "Watch", pct: 18 },
      { label: "Positive", pct: 9 },
    ],
    positiveSignal: {
      title: "Positive signal to protect",
      body: "Verified acquisition stories still mention rate value — keep APY story aligned with funds-availability reality.",
    },
  },
  {
    id: "play",
    channel: "Play Store",
    score: "3.0",
    metric: "457+ reviews",
    severity: "High",
    dominantIssue: "Transfer hold + app sign-out + support gap",
    sentimentSkew: "Negative skew",
    publicVolume: "457+ public ratings (Google Play)",
    internalEchoSummary: "214 contacts on transfer availability · 86 auth events tied to device / OTP",
    themeBreakdown: [
      { label: "Transfer hold", pct: 38 },
      { label: "App sign-out / access", pct: 26 },
      { label: "Support gap", pct: 19 },
      { label: "Trusted device / OTP", pct: 12 },
      { label: "Other", pct: 5 },
    ],
    trendingItems: [
      {
        title: "Initial transfer on hold",
        meta: "3 stars · helpful votes",
        signal: "deposit-hold expectation",
      },
      {
        title: "Transfer cancelled and account locked",
        meta: "1 star · helpful votes",
        signal: "transfer-out anxiety",
      },
      {
        title: "Trusted device and OTP friction",
        meta: "review cluster",
        signal: "digital recovery friction",
      },
    ],
    echoBox: {
      external: "Customers say transfers are held, cancelled, or unclear in the public store narrative.",
      internal:
        "Voice + chat + tickets show 214 related contacts and strong repeat pressure on available balance and hold explanations.",
      businessRead: "First-funding confusion is visible publicly and internally — close the loop on one narrative, not two.",
    },
    severityMix: [
      { label: "Critical", pct: 38 },
      { label: "High", pct: 33 },
      { label: "Watch", pct: 21 },
      { label: "Positive", pct: 8 },
    ],
    positiveSignal: {
      title: "Positive signal to protect",
      body: "Play listing still advertises trusted device, OTP, password reset, and transfers — keep in-app reality aligned with review promises.",
    },
  },
  {
    id: "appstore",
    channel: "App Store",
    score: "4.1",
    metric: "1.8K ratings",
    severity: "Good",
    dominantIssue: "Transfer friction after otherwise strong onboarding",
    sentimentSkew: "Balanced · positive skew on value",
    publicVolume: "1.8K ratings (App Store)",
    internalEchoSummary: "Positive onboarding signal; transfer concern still appears in 1-star clusters",
    themeBreakdown: [
      { label: "High-yield praise", pct: 36 },
      { label: "Biometrics / sign-in", pct: 24 },
      { label: "Trusted device flows", pct: 22 },
      { label: "Transfer friction", pct: 18 },
    ],
    trendingItems: [
      {
        title: "Positive HYS account experience",
        meta: "5 stars",
        signal: "strength to protect",
      },
      {
        title: "Double-draw transfer issue",
        meta: "1 star · detailed review",
        signal: "payment-routing risk",
      },
      {
        title: "High rate, but access concern",
        meta: "1 star · detailed review",
        signal: "promise vs access",
      },
    ],
    echoBox: {
      external: "App Store narrative praises rate and app polish while a minority of reviews spike on transfer and access fear.",
      internal:
        "Internal onboarding sentiment is warmer than Trustpilot / Play — watch for divergence after first funding.",
      businessRead: "Protect the App Store strength while fixing transfer clarity — do not let negative channels define the whole story.",
    },
    severityMix: [
      { label: "Critical", pct: 12 },
      { label: "High", pct: 24 },
      { label: "Watch", pct: 28 },
      { label: "Positive", pct: 36 },
    ],
    positiveSignal: {
      title: "Positive signal to protect",
      body: "App Store shows Openbank U.S. at 4.1 with 1.8K ratings — materially stronger than Trustpilot / Play; lead recovery work, not panic.",
    },
  },
  {
    id: "reddit",
    channel: "Reddit",
    score: "8",
    metric: "top thread votes",
    severity: "Watch",
    dominantIssue: "HYSA evaluation · money held · rate vs reliability",
    sentimentSkew: "Mixed · consideration-stage friction",
    publicVolume: "High-engagement threads (votes as proxy)",
    internalEchoSummary: "Consideration-stage friction and funds-access escalation language in threads",
    themeBreakdown: [
      { label: "HYSA evaluation", pct: 33 },
      { label: "Money held narrative", pct: 29 },
      { label: "Rate vs reliability", pct: 22 },
      { label: "Other", pct: 16 },
    ],
    trendingItems: [
      {
        title: "Openbank HYSA evaluation thread",
        meta: "many comments",
        signal: "consideration-stage friction",
      },
      {
        title: "Openbank is holding my money",
        meta: "regulator comments",
        signal: "funds-access escalation",
      },
      {
        title: "Is Openbank any good?",
        meta: "mixed thread",
        signal: "market trust comparison",
      },
    ],
    echoBox: {
      external: "Reddit amplifies “held money” and comparison shopping before commit — high emotion, partial context.",
      internal:
        "Internal queues echo availability and hold language during the same consideration window for digital-first prospects.",
      businessRead: "Treat Reddit as early-warning on promise-vs-access, not as full-funnel truth.",
    },
    severityMix: [
      { label: "Critical", pct: 22 },
      { label: "High", pct: 28 },
      { label: "Watch", pct: 38 },
      { label: "Positive", pct: 12 },
    ],
  },
  {
    id: "bbb",
    channel: "BBB",
    score: "Not rated",
    metric: "Openbank file · HQ 1.03/5 (69)",
    severity: "Critical",
    dominantIssue: "Formal complaint visibility + access / payoff anxiety (HQ signal)",
    sentimentSkew: "Negative on HQ aggregate · profile not rated",
    publicVolume: "BBB business file + 69 HQ reviews (separate signals)",
    internalEchoSummary: "Escalation language on access, payoff errors, and handoff failures aligns with HQ review themes",
    themeBreakdown: [
      { label: "Access to money", pct: 32 },
      { label: "Payment / payoff errors", pct: 26 },
      { label: "No-notice changes", pct: 20 },
      { label: "Support handoff failure", pct: 22 },
    ],
    trendingItems: [
      {
        title: "Paperless statement emails to non-customer",
        meta: "04/23/2026 · 1 star",
        signal: "wrong-recipient / unsubscribe failure",
      },
      {
        title: "Card cancelled and deposit hold left account unusable",
        meta: "04/22/2026 · 1 star",
        signal: "fraud action + funds availability confusion",
      },
      {
        title: "Locked out and cannot access money",
        meta: "02/12/2026 · 1 star",
        signal: "push notification / account access failure",
      },
    ],
    echoBox: {
      external:
        "BBB-facing narratives emphasize identity verification, withdrawal access, and complaint response visibility — distinct from app-store tone.",
      internal:
        "Internal notes on formal complaints and access blocks correlate with HQ review themes; keep BBB response cadence visible to frontline.",
      businessRead: "Profile credibility and HQ aggregate both matter — address the formal file and the operational themes separately.",
    },
    severityMix: [
      { label: "Critical", pct: 44 },
      { label: "High", pct: 29 },
      { label: "Watch", pct: 19 },
      { label: "Positive", pct: 8 },
    ],
  },
];

function themeBarColor(idx: number, accent: string): string {
  const palette = [accent, COLORS.amber, COLORS.cyan, COLORS.purple, COLORS.dim];
  return palette[idx % palette.length] ?? accent;
}

function SeverityMixBars({
  items,
}: {
  items: readonly { label: string; pct: number }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Review severity mix</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((s) => {
          const c = colorFor(s.label === "Positive" ? "Good" : s.label === "Watch" ? "Watch" : s.label === "Critical" ? "Critical" : "High");
          return (
            <div key={s.label} className="rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-center">
              <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">{s.label}</p>
              <p className="mt-0.5 text-lg font-black tabular-nums" style={{ color: c }}>
                {s.pct}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExternalThemeBars({
  items,
  accent,
}: {
  items: readonly ThemeBar[];
  accent: string;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">External theme breakdown</p>
      <div className="space-y-2">
        {items.map((t, i) => (
          <div key={t.label} className="grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_2.5rem_6.5rem] sm:items-center">
            <span className="truncate text-[11px] font-semibold text-zinc-300">{t.label}</span>
            <span className="text-right text-[11px] font-black tabular-nums text-zinc-400 sm:text-left">{t.pct}%</span>
            <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:col-span-1">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${t.pct}%`, background: themeBarColor(i, accent) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({
  children,
  severity = "Watch",
}: {
  children: ReactNode;
  severity?: string;
}) {
  const color = colorFor(severity);
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}14`,
      }}
    >
      {children}
    </span>
  );
}

function ShellCard({
  title,
  subtitle,
  accent = COLORS.border,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border bg-[#0d0d0d] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
      style={{
        borderColor: COLORS.border,
        borderTopColor: accent,
        borderTopWidth: 3,
      }}
    >
      <div className="mb-3 shrink-0">
        <h3 className="text-sm font-black text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-snug text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SignalStory({
  active,
  setActive,
}: {
  active: HeadlineSignal;
  setActive: Dispatch<SetStateAction<HeadlineSignal>>;
}) {
  const current = active ?? headlineSignals[0];
  const color = colorFor(current.severity);
  const chain = chainFromSignal(current);
  const metrics = metricsFromSignal(current);

  return (
    <ShellCard
      title="✨Today’s Arc · cross-channel pattern"
      subtitle="Pattern switcher and selected pattern view sit side by side so the story changes visibly on click."
      accent={color}
      className="min-h-[470px]"
    >
      <div className="grid h-full gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-[#151515] p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Pattern switcher
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Choose the arc to brief today.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {headlineSignals.map((signal, index) => {
              const signalColor = colorFor(signal.severity);
              const selected = signal.id === current.id;
              return (
                <button
                  key={signal.id}
                  type="button"
                  onClick={() => setActive(signal)}
                  className="w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5"
                  style={{
                    borderColor: selected ? `${signalColor}88` : COLORS.border2,
                    background: selected ? `${signalColor}12` : COLORS.inset,
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-black"
                        style={{
                          color: signalColor,
                          background: `${signalColor}18`,
                        }}
                      >
                        {index + 1}
                      </span>
                      <Pill severity={signal.severity}>{signal.severity}</Pill>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: signalColor }}
                      aria-hidden
                    />
                  </div>
                  <p className="text-sm font-black leading-tight text-white">
                    {signal.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {signal.impact}
                  </p>
                  <div className="mt-2 rounded-xl border border-white/10 bg-black/25 p-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Briefing angle
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-zinc-300">
                      {signal.outcome}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-black/20 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill severity={current.severity}>{current.severity}</Pill>
              </div>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                Selected pattern view
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                ✨Detected pattern
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-white">
                  {current.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {current.insight}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                  Executive readout
                </p>
                <p
                  className="mt-2 text-2xl font-black leading-tight"
                  style={{ color }}
                >
                  {current.outcome}
                </p>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-zinc-400">
                  {current.impact}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#151515] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                  Signal trail
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  How the same customer pain travels across systems and
                  channels.
                </p>
              </div>

            </div>

            <div className="grid gap-2 md:grid-cols-5">
              {chain.map((node, index) => (
                <div
                  key={`${node.label}-${node.value}`}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-black"
                      style={{ color, background: `${color}18` }}
                    >
                      {index + 1}
                    </span>
                    {index < chain.length - 1 ? (
                      <span className="text-lg text-zinc-600" aria-hidden>
                        ›
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-zinc-600">
                        END
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                    {node.label}
                  </p>
                  <p className="mt-1 text-xs font-black leading-tight text-white">
                    {node.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                key={metric}
                className="rounded-2xl border border-white/10 bg-black/25 p-3"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                  {index === 0
                    ? "Confidence"
                    : index === 1
                      ? "Movement"
                      : index === 2
                        ? "Age"
                        : "Exposure"}
                </p>
                <p className="mt-1 text-sm font-black text-white">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

function sentimentSparklineColor(sentimentStr: string): string {
  const n = Number(sentimentStr);
  if (Number.isNaN(n)) {
    return COLORS.purple;
  }
  // Negative CSAT-style scores: closer to zero / positive is better.
  if (n >= -0.38) {
    return COLORS.green;
  }
  if (n >= -0.55) {
    return COLORS.amber;
  }
  return COLORS.red;
}

type SparkPt = { x: number; y: number };

function sparkCoordsFromValues(
  data: number[],
  width: number,
  yTop: number,
  yBottom: number,
): SparkPt[] {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1e-6, max - min);
  return data.map((value, index) => ({
    x: data.length <= 1 ? width / 2 : (index / (data.length - 1)) * width,
    y: yBottom - ((value - min) / range) * (yBottom - yTop),
  }));
}

/** Smooth top edge (cubic segments), Catmull-style control points at joints. */
function sparkSmoothTopPath(coords: SparkPt[]): string {
  if (coords.length === 0) {
    return "";
  }
  if (coords.length === 1) {
    const { x, y } = coords[0];
    return `M 0,${y} L 100,${y}`;
  }
  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function MicroSparkline({
  values = [],
  color = COLORS.purple,
  title = "Sentiment trend",
}: {
  values?: readonly number[];
  color?: string;
  title?: string;
}) {
  const gradId = useId().replace(/:/g, "");
  const data = list(values).length > 0 ? list(values) : [0, 0];
  const yTop = 5;
  const yBottom = 32;
  const baseline = 37;
  const coords = sparkCoordsFromValues(data, 100, yTop, yBottom);
  const topPath = sparkSmoothTopPath(coords);
  const firstX = coords[0]?.x ?? 0;
  const lastX = coords[coords.length - 1]?.x ?? 100;
  const lastY = coords[coords.length - 1]?.y ?? yBottom;
  const areaPath =
    topPath.length > 0
      ? `${topPath} L ${lastX},${baseline} L ${firstX},${baseline} Z`
      : "";

  return (
    <svg
      viewBox="0 0 100 40"
      className="h-10 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.42" />
          <stop offset="45%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath ? (
        <path
          d={areaPath}
          fill={`url(#${gradId})`}
          fillOpacity={1}
          stroke="none"
          strokeWidth={0}
        />
      ) : null}
      {topPath ? (
        <path
          d={topPath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      <circle cx={lastX} cy={lastY} r="2.6" fill={color} stroke="#0a0a0a" strokeWidth="0.6" />
    </svg>
  );
}

function MiniBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const width = Math.max(8, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </span>
        <span className="text-[10px] font-black text-zinc-300">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ChannelConstellation() {
  return (
    <ShellCard
      title="Internal Voice Constellation"
      subtitle="Primary data layer with micro-trends, top service dispute, repeat pressure, sentiment, and owner by channel."
      accent={COLORS.cyan}
      className="min-h-[600px]"
    >
      <div className="max-h-[min(578px,calc(100dvh-4rem))] overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]">
        <div className="grid gap-3">
          {channelSignals.map((item) => {
            const c = colorFor(item.severity);
            const repeatValue = Number(
              String(item.repeat).match(/[0-9]+/)?.[0] ?? 0,
            );
            const sentimentValue = Math.min(
              90,
              Math.max(20, Math.round(Math.abs(Number(item.sentiment)) * 100)),
            );

            return (
              <div
                key={item.channel}
                className="rounded-2xl border bg-[#151515] p-3"
                style={{ borderColor: `${c}44` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                      {item.channel}
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <p className="text-xl font-black text-white">
                        {item.count}
                      </p>
                      <p className="pb-1 text-[10px] font-bold text-zinc-500">
                        {item.share}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Pill severity={item.severity}>{item.issue}</Pill>
                    <p
                      className="mt-1 text-[10px] font-black"
                      style={{ color: c }}
                    >
                      {item.delta}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/25 p-2.5">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Sentiment trend
                    </p>
                    <p className="text-[10px] font-black text-zinc-500">
                      last 8 intervals
                    </p>
                  </div>
                  <MicroSparkline
                    values={item.trend}
                    color={sentimentSparklineColor(item.sentiment)}
                    title={`${item.channel}: sentiment trend (last 8 intervals)`}
                  />
                </div>

                <div className="mt-2 rounded-xl border border-white/10 bg-black/25 p-2.5">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                    Top service dispute
                  </p>
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <p className="text-xs font-black leading-tight text-white">
                      {item.topDispute}
                    </p>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-black text-zinc-300">
                      {item.disputeCount}
                    </span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <MiniBar label="Repeat" value={repeatValue} color={c} />
                  <MiniBar
                    label="Neg. sentiment"
                    value={sentimentValue}
                    color={c}
                  />
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-300">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Customer language
                    </p>
                    <p className="mt-1">{item.phrase}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-300">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Owner
                    </p>
                    <p className="mt-1">{item.owner}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ShellCard>
  );
}

function CallsColumn({
  title,
  subtitle,
  data,
  accent,
}: {
  title: string;
  subtitle: string;
  data: readonly CallRow[];
  accent: string;
}) {
  return (
    <ShellCard title={title} subtitle={subtitle} accent={accent}>
      <div className="space-y-2">
        {data.map((call) => {
          const c = colorFor(call.severity);
          return (
            <div
              key={call.rank}
              className="rounded-2xl border bg-[#151515] p-3"
              style={{ borderColor: `${c}44` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black"
                  style={{ color: c, background: `${c}18` }}
                >
                  {call.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill severity={call.severity}>{call.score}</Pill>
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      AI call score
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-black leading-tight text-white">
                    {call.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                    {call.reason}
                  </p>
                  <div className="mt-2 rounded-xl border border-white/10 bg-black/25 p-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Pattern
                    </p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {call.pattern}
                    </p>
                  </div>
                  <div className="mt-2 grid gap-2 text-[11px] font-semibold md:grid-cols-2">
                    <span className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-400">
                      {call.proof}
                    </span>
                    <span className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-300">
                      {call.evidence}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ShellCard>
  );
}

function RecoveryRoom() {
  const [active, setActive] = useState<RecoveryItem>(recoveryBoard[0]);
  const color = colorFor(active.severity);
  const how = list(active.howWeKnow);

  return (
    <ShellCard
      title="Customer Pain Recovery"
      subtitle="Did the customer signal actually improve? Observed recovery from conversations — not a task tracker."
      accent={color}
    >
      <p className="mb-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[11px] font-semibold leading-relaxed text-zinc-400">
        Recovery is measured from customer-signal movement: repeat contact, unresolved language, sentiment, reopen rate, and
        complaint-intent phrases.{" "}
        <span className="font-black text-zinc-500">Observed recovery signal</span> unless workflow / ticket / CRM confirms an
        intervention.
      </p>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,260px)_1fr]">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Pain themes</p>
          <div className="space-y-2">
            {list(recoveryBoard).map((item) => {
              const itemColor = colorFor(verdictSeverity(item.verdict));
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item)}
                  className="w-full rounded-2xl border p-3 text-left transition-colors"
                  style={{
                    borderColor: selected ? `${itemColor}88` : COLORS.border2,
                    background: selected ? `${itemColor}12` : COLORS.inset,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-black leading-tight text-white">{item.insight}</p>
                    <Pill severity={verdictSeverity(item.status)}>{item.status}</Pill>
                  </div>
                  <p className="mt-1.5 text-[10px] font-semibold text-zinc-500">
                    Detected: <span className="text-zinc-400">{item.detected}</span>
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.progress}%`, background: itemColor }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] font-black uppercase tracking-wide text-zinc-600">
                    Verdict: <span style={{ color: itemColor }}>{item.verdict}</span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="flex min-h-0 min-w-0 max-h-[min(72vh,680px)] flex-col gap-3 overflow-y-auto overscroll-y-contain rounded-2xl border bg-[#121212] p-4 pr-3 [scrollbar-gutter:stable]"
          style={{ borderColor: `${color}55` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Selected pain detail</p>
              <h4 className="mt-1 text-lg font-black text-white">{active.insight}</h4>
            </div>
            <Pill severity={verdictSeverity(active.verdict)}>{active.verdict}</Pill>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Customer pain</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-zinc-100">{active.customerPain}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Intervention signal</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-zinc-300">{active.interventionSignal}</p>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">How we know</p>
            <ul className="mt-2 space-y-1.5">
              {how.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-500" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Target movement</p>
              <p className="mt-1 text-sm font-black text-white">{active.target}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Measured movement</p>
              <p className="mt-1 text-sm font-black" style={{ color }}>
                {active.measured}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Recovery confidence</p>
              <p className="mt-1 text-sm font-black tabular-nums text-white">{active.confidence}%</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Signal movement strip</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-[9px] font-black uppercase text-zinc-600">Before</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-300">{active.beforeStrip}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-zinc-600">After</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-300">{active.afterStrip}</p>
              </div>
              <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${color}44`, background: `${color}0d` }}>
                <p className="text-[9px] font-black uppercase text-zinc-500">Verdict</p>
                <p className="mt-1 text-sm font-black" style={{ color: colorFor(verdictSeverity(active.verdict)) }}>
                  {active.verdict}
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-snug text-zinc-500">
                  {active.verdict === "No movement"
                    ? "Customer signal flat — no observed reduction in pain markers yet."
                    : active.verdict === "Improving"
                      ? "Repeat, lockout language, and contacts-per-case are moving in the right direction."
                      : active.verdict === "Working"
                        ? "Repeat and reopen signals beat target; sustain conversation patterns that caused the lift."
                        : "Baseline window only — compare future intervals before calling recovery."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

function PublicVoiceWall() {
  const [selectedPublicChannel, setSelectedPublicChannel] = useState<PublicVoiceChannel>(
    publicChannels[0],
  );
  const active = selectedPublicChannel;
  const color = colorFor(active.severity);
  const trending = list(active.trendingItems).slice(0, 3);
  const themes = list(active.themeBreakdown);
  const mix = list(active.severityMix);

  return (
    <ShellCard
      title="Public Voice Wall"
      subtitle="External reputation pulse across Trustpilot, Play Store, App Store, Reddit, and BBB — the only public-grounding surface in this room."
      accent={color}
    >
      <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,280px)_1fr] xl:items-start">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Channel rail</p>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
            {publicChannels.map((channel) => {
              const chColor = colorFor(channel.severity);
              const selected = channel.id === active.id;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSelectedPublicChannel(channel)}
                  className="rounded-2xl border p-3 text-left transition-colors"
                  style={{
                    borderColor: selected ? `${chColor}88` : COLORS.border2,
                    background: selected ? `${chColor}12` : COLORS.inset,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      {channel.channel}
                    </p>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: chColor }} aria-hidden />
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-xl font-black tabular-nums leading-none" style={{ color: chColor }}>
                      {channel.score}
                    </p>
                    <p className="max-w-[55%] text-right text-[10px] font-bold leading-snug text-zinc-400">
                      {channel.metric}
                    </p>
                  </div>
                  <p className="mt-2 truncate text-[10px] font-semibold text-zinc-500">{channel.dominantIssue}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 min-w-0 max-h-[min(72vh,680px)] overflow-y-auto overscroll-y-contain space-y-4 rounded-2xl border border-white/10 bg-[#121212] p-4 pr-3 [scrollbar-gutter:stable]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
              Selected channel intelligence
            </p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xl font-black text-white">{active.channel}</h4>
                <p className="mt-1 text-[11px] font-bold text-zinc-400">
                  {active.score}
                  {active.id === "bbb" ? "" : " rating"} · {active.metric}
                </p>
                <p className="mt-2 text-xs font-semibold leading-snug text-zinc-300">
                  <span className="font-black text-zinc-500">Dominant external issue: </span>
                  {active.dominantIssue}
                </p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-400">
                  <span className="font-black text-zinc-500">Internal echo: </span>
                  {active.internalEchoSummary}
                </p>
              </div>
              <Pill severity={active.severity}>{active.severity}</Pill>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">External signal summary</p>
            <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { k: "Dominant theme", v: active.dominantIssue },
                { k: "Sentiment skew", v: active.sentimentSkew },
                { k: "Public volume", v: active.publicVolume },
                { k: "Internal echo", v: active.internalEchoSummary },
              ].map((row) => (
                <div key={row.k} className="rounded-xl border border-white/10 bg-black/25 px-2.5 py-2">
                  <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">{row.k}</p>
                  <p className="mt-1 line-clamp-3 text-[11px] font-semibold leading-snug text-zinc-200">{row.v}</p>
                </div>
              ))}
            </div>
          </div>

          <ExternalThemeBars items={themes} accent={color} />
          <SeverityMixBars items={mix} />

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Top trending public items</p>
            <ol className="mt-2 space-y-2">
              {trending.map((post, idx) => (
                <li
                  key={post.title}
                  className="rounded-xl border border-white/10 bg-black/25 p-3"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-black tabular-nums text-zinc-500">{idx + 1}.</span>
                    <h5 className="min-w-0 flex-1 text-sm font-black leading-tight text-white">{post.title}</h5>
                  </div>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">{post.meta}</p>
                  <p className="mt-2 text-[11px] font-bold" style={{ color }}>
                    Signal: {post.signal}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="rounded-xl border p-3"
            style={{ borderColor: `${color}44`, background: `${color}0d` }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Public voice → internal echo</p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-300">
              <span className="font-black text-zinc-500">External signal: </span>
              {active.echoBox.external}
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-300">
              <span className="font-black text-zinc-500">Internal echo: </span>
              {active.echoBox.internal}
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-200">
              <span className="font-black text-zinc-500">Business read: </span>
              {active.echoBox.businessRead}
            </p>
          </div>

          {active.positiveSignal ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300/90">
                {active.positiveSignal.title}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-zinc-300">{active.positiveSignal.body}</p>
            </div>
          ) : null}
        </div>
      </div>
    </ShellCard>
  );
}

function RiskLayer() {
  const lanes = list(riskPulseHeader.activeLanes);
  const urgencyChips = list(riskPulseHeader.urgencyChips);

  return (
    <ShellCard
      title="Risk Signal Layer"
      subtitle="What service disputes are becoming regulatory exposure?"
      accent={COLORS.red}
      className="flex min-h-[668px] max-h-[min(72vh,820px)] flex-col overflow-hidden"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-2 [scrollbar-gutter:stable]">
        <div className="space-y-3">
          <div className="grid gap-3 rounded-2xl border border-red-500/35 bg-red-500/5 p-3 lg:grid-cols-[minmax(0,7.5rem)_1fr] lg:items-start">
            <div className="flex flex-col items-start gap-1.5 border-b border-white/10 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-3">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">Risk pulse</p>
              <p className="text-3xl font-black tabular-nums leading-none text-white">
                {riskPulseHeader.score}
                <span className="text-xs font-bold text-zinc-500"> /100</span>
              </p>
              <Pill severity="High">{riskPulseHeader.status}</Pill>
            </div>
            <div className="min-w-0 space-y-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Main exposure</p>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-zinc-100">{riskPulseHeader.mainExposure}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Why it matters</p>
                <p className="mt-0.5 text-[11px] font-semibold leading-snug text-zinc-400">{riskPulseHeader.whyItMatters}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Active lanes</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {lanes.map((lane) => (
                    <span
                      key={lane}
                      className="rounded-full border border-red-500/45 bg-black/45 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-100/95"
                    >
                      {lane}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Regulatory urgency</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {urgencyChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-bold text-zinc-400"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Service dispute → exposure</p>
            {list(riskLayerCards).map((risk) => {
              const c = colorFor(risk.severity);
              return (
                <div
                  key={risk.title}
                  className="rounded-2xl border p-3.5"
                  style={{ borderColor: `${c}55`, background: `${c}0c` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="min-w-0 flex-1 text-sm font-black leading-tight text-white">{risk.title}</h4>
                    <span
                      className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-300"
                      style={{ borderColor: `${c}55`, background: `${c}14` }}
                    >
                      {risk.urgency}
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">Customer intent</p>
                  <p className="mt-0.5 text-xs font-semibold italic text-zinc-300">{risk.customerIntent}</p>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">Service dispute</p>
                  <p className="mt-0.5 text-xs font-semibold text-zinc-200">{risk.serviceDispute}</p>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">Exposure lane</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {list(risk.regulatoryLanes).map((lane) => (
                      <span
                        key={lane}
                        className="rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide"
                        style={{ borderColor: `${c}66`, color: c, background: `${c}12` }}
                      >
                        {lane}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">Evidence volume</p>
                  <p className="mt-0.5 text-xs font-bold tabular-nums text-zinc-200">{risk.evidenceVolume}</p>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">Source evidence</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {list(risk.sourceEvidence).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 border-t border-white/10 pt-2 text-[11px] font-semibold leading-snug text-zinc-400">
                    <span className="font-black text-zinc-600">Why this matters: </span>
                    {risk.whyItMatters}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Escalation queue</p>
            <ul className="mt-2 space-y-2">
              {list(riskEscalationQueue).map((q) => (
                <li key={q.id} className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                  <span className="font-black text-white">{q.label}</span>
                  <span className="min-w-0 text-right font-semibold text-zinc-400">{q.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

/** Main signal-room UI (stateful). Wrapped by `OpenbankInsightExecutiveDashboard` for role-based routing. */
export function OpenbankCXSignalRoom() {
  const [activeSignal, setActiveSignal] = useState<HeadlineSignal>(
    headlineSignals[0],
  );

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(83,50,255,.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-[1840px] min-w-0 space-y-4 px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-8">
            <SignalStory active={activeSignal} setActive={setActiveSignal} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <ChannelConstellation />
          </div>
        </div>

        <div className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 lg:col-span-6">
            <CallsColumn
              title="✨Top 3 Best Calls"
              subtitle="Excellence patterns to replicate across internal teams."
              data={bestCalls}
              accent={COLORS.green}
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <CallsColumn
              title="✨Top 3 Worst Calls"
              subtitle="Failure patterns to fix without turning this into agent prep."
              data={worstCalls}
              accent={COLORS.red}
            />
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-12 gap-4">
          <div className="col-span-12 min-h-0 xl:col-span-7">
            <RecoveryRoom />
          </div>
          <div className="col-span-12 min-h-0 xl:col-span-5">
            <RiskLayer />
          </div>
        </div>

        <PublicVoiceWall />
      </div>
    </div>
  );
}

const OPENBANK_FALLBACK_THEME: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#070707",
  surface: "#121212",
  card: "#0d0d0d",
  elevated: "#1a1a1a",
  border: "#242424",
  borderLight: "#3a3a3a",
};

export type OpenbankInsightExecutiveDashboardProps = {
  industryName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

const TIME_WINDOWS = ["Today", "7 Days", "30 Days"] as const;
type TimeWindow = (typeof TIME_WINDOWS)[number];

export function OpenbankInsightExecutiveDashboard({
  industryName: _industryName,
  industryColor,
  onExit,
  theme,
}: OpenbankInsightExecutiveDashboardProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("Today");

  return (
    <DashboardThemeProvider value={theme ?? OPENBANK_FALLBACK_THEME}>
      <div className="min-h-screen w-full min-w-0 bg-[#070707]">
        <header className="relative w-full min-w-0 border-b border-white/10 bg-[#070707]">
          <div className="mx-auto w-full max-w-[1840px] min-w-0 px-4 py-3">
            <div className="flex w-full min-w-0 flex-col items-stretch gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:gap-10">
              <button
                type="button"
                onClick={onExit}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-xl border border-white/15 bg-white/[0.06] py-2 pr-3 pl-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 md:self-auto"
                style={{ borderLeftWidth: 3, borderLeftColor: industryColor }}
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                Back
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Openbank CX Signal Room
                </h1>
                <p className="mx-auto mt-2 max-w-5xl text-sm leading-relaxed text-zinc-400">
                  A daily intelligence room for customer trust: internal calls,
                  chats, emails, tickets, account activity, risk language, and
                  one public-voice validation layer.
                </p>
              </div>

              <div className="grid w-full max-w-sm shrink-0 grid-cols-3 gap-1.5 self-center rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 sm:max-w-[280px] md:w-[min(100%,280px)] md:max-w-none">
                {TIME_WINDOWS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTimeWindow(item)}
                    className={cx(
                      "rounded-xl px-3 py-2 text-xs font-black transition",
                      item === timeWindow
                        ? "bg-violet-600 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        <OpenbankCXSignalRoom />
      </div>
    </DashboardThemeProvider>
  );
}

export default OpenbankInsightExecutiveDashboard;
