import type { ConfidenceBand } from "./cxHeadRetailData";

/** Social platforms in scope — WhatsApp excluded (helpdesk / care channel, not social virality). */
export const ESCALATION_SOCIAL_CHANNELS = [
  { id: "facebook", label: "Facebook", viralityIndex: 72, mentions: 1840, deltaPct: 18 },
  { id: "instagram", label: "Instagram", viralityIndex: 81, mentions: 2460, deltaPct: 24 },
  { id: "linkedin", label: "LinkedIn", viralityIndex: 44, mentions: 390, deltaPct: 6 },
  { id: "x", label: "X", viralityIndex: 91, mentions: 3120, deltaPct: 38 },
] as const;

export type EscalationSourceLaneId = "social" | "ceo-office" | "internal-helpdesk";

export type EscalationSourceLane = {
  id: EscalationSourceLaneId;
  title: string;
  subtitle: string;
  openCount: number;
  owner: string;
  nextAction: string;
  /** Per-channel signals only on social — never rolled into one virality number. */
  socialChannels?: typeof ESCALATION_SOCIAL_CHANNELS;
  note?: string;
};

export const ESCALATION_SOURCE_LANES: EscalationSourceLane[] = [
  {
    id: "social",
    title: "Social",
    subtitle: "FB · Insta · LinkedIn · X — WhatsApp excluded",
    openCount: 47,
    owner: "Brand / Social response",
    nextAction: "Contain narrative on X + Instagram first — do not treat as ticket close",
    socialChannels: ESCALATION_SOCIAL_CHANNELS,
    note: "Virality stays per-channel. No merged social score.",
  },
  {
    id: "ceo-office",
    title: "CEO-office",
    subtitle: "Data only · thread locked",
    openCount: 6,
    owner: "CEO desk · CX liaison",
    nextAction: "Surface evidence pack — no outbound from this lane without desk unlock",
    note: "Read-path only. Thread is locked; CX cannot reply from this surface.",
  },
  {
    id: "internal-helpdesk",
    title: "Internal helpdesk",
    subtitle: "Repeat-contact threshold · ≥3 contacts / 7d",
    openCount: 128,
    owner: "Care Ops / Process owner",
    nextAction: "Route top repeat intents to process owners — threshold is the trigger",
    note: "Triggered when the same shopper crosses the repeat-contact threshold.",
  },
];

/** Our operational taxonomy — not an industry SLA standard. */
export type EscalationSlaMetric = {
  id: "detect" | "resolve" | "contain";
  label: string;
  value: string;
  unit: string;
  target: string;
  status: "in" | "watch" | "breach";
  note: string;
};

export const ESCALATION_SLA_TRIAD: EscalationSlaMetric[] = [
  {
    id: "detect",
    label: "Time-to-Detect",
    value: "18",
    unit: "min",
    target: "≤ 30 min",
    status: "in",
    note: "Signal → queue visibility",
  },
  {
    id: "resolve",
    label: "Time-to-Resolve",
    value: "14.2",
    unit: "h",
    target: "≤ 12 h",
    status: "breach",
    note: "Case close on helpdesk / CEO-unlocked threads only",
  },
  {
    id: "contain",
    label: "Time-to-Contain",
    value: "42",
    unit: "min",
    target: "≤ 60 min",
    status: "in",
    note: "Social = narrative correction, not case resolution",
  },
];

export const ESCALATION_SLA_MODEL_NOTE =
  "Our operational taxonomy. Social handling is containment / narrative-correction — not case resolution.";

export type EscalationClusterItem = {
  id: string;
  rank: number;
  problem: string;
  sourceLane: EscalationSourceLaneId;
  channels: string[];
  shoppers: number;
  gmvExposed: string;
  steerCoAsk: string;
  confidence: ConfidenceBand;
};

/** Top problem statements for SteerCo — clustered, not raw ticket dumps. */
export const ESCALATION_TOP10_CLUSTERS: EscalationClusterItem[] = [
  {
    id: "esc-01",
    rank: 1,
    problem: "UPI checkout failure amplified on X during BBD hour",
    sourceLane: "social",
    channels: ["X", "Instagram"],
    shoppers: 1840,
    gmvExposed: "₹18.4 Cr",
    steerCoAsk: "Payments + Brand — joint containment window before evening peak",
    confidence: "High",
  },
  {
    id: "esc-02",
    rank: 2,
    problem: "Never-delivered cluster with #NeverDelivered spillover",
    sourceLane: "social",
    channels: ["X", "Facebook", "Instagram"],
    shoppers: 960,
    gmvExposed: "₹6.2 Cr",
    steerCoAsk: "Logistics last-mile hold + social response pack",
    confidence: "High",
  },
  {
    id: "esc-03",
    rank: 3,
    problem: "Refund-not-credited repeats crossing helpdesk threshold",
    sourceLane: "internal-helpdesk",
    channels: ["Chat", "Voice", "Email"],
    shoppers: 1280,
    gmvExposed: "₹4.1 Cr",
    steerCoAsk: "Payments ledger owner — clear aged prepaid mismatches",
    confidence: "Med-High",
  },
  {
    id: "esc-04",
    rank: 4,
    problem: "CEO-desk threads on counterfeit electronics sellers",
    sourceLane: "ceo-office",
    channels: ["CEO-office"],
    shoppers: 42,
    gmvExposed: "₹2.8 Cr",
    steerCoAsk: "Unlock evidence for Trust & Safety — no public reply from CX",
    confidence: "High",
  },
  {
    id: "esc-05",
    rank: 5,
    problem: "LinkedIn HNI complaint on Plus delivery promise break",
    sourceLane: "social",
    channels: ["LinkedIn"],
    shoppers: 28,
    gmvExposed: "₹1.9 Cr",
    steerCoAsk: "Plus retention desk — white-glove before social reply",
    confidence: "Med-High",
  },
  {
    id: "esc-06",
    rank: 6,
    problem: "Instagram reel cluster on damaged dark-store grocery",
    sourceLane: "social",
    channels: ["Instagram"],
    shoppers: 410,
    gmvExposed: "₹0.9 Cr",
    steerCoAsk: "Q-commerce city ops — D07 packaging QA, narrative contain",
    confidence: "Med-High",
  },
  {
    id: "esc-07",
    rank: 7,
    problem: "Repeat OTP / login failures hitting helpdesk threshold",
    sourceLane: "internal-helpdesk",
    channels: ["App", "Chat"],
    shoppers: 740,
    gmvExposed: "₹0.6 Cr",
    steerCoAsk: "Platform auth owner — Jio OTP path",
    confidence: "Medium",
  },
  {
    id: "esc-08",
    rank: 8,
    problem: "Facebook group brigading ruled out — organic fee-shock posts",
    sourceLane: "social",
    channels: ["Facebook"],
    shoppers: 220,
    gmvExposed: "₹1.1 Cr",
    steerCoAsk: "Pricing disclosure fix — contain, do not debate fees in-thread",
    confidence: "Med-High",
  },
  {
    id: "esc-09",
    rank: 9,
    problem: "CEO-office lock on account-takeover cohort",
    sourceLane: "ceo-office",
    channels: ["CEO-office"],
    shoppers: 16,
    gmvExposed: "₹3.4 Cr",
    steerCoAsk: "Trust & Safety — data-only until desk unlocks reply path",
    confidence: "High",
  },
  {
    id: "esc-10",
    rank: 10,
    problem: "Helpdesk repeats on return-pickup no-shows",
    sourceLane: "internal-helpdesk",
    channels: ["Chat", "Voice"],
    shoppers: 560,
    gmvExposed: "₹0.8 Cr",
    steerCoAsk: "Reverse-logistics owner — pickup SLA reset",
    confidence: "Medium",
  },
];
