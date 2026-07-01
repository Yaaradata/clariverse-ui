/**
 * Sterling Bank · head_contact — UK intent labels only (mirrors sterlingHeadRetailServiceData pattern).
 * Counts, scores, and non-intent copy stay aligned with retail_banking/head_contact.
 */

import type { RiskSpike } from "@/components/unified/actions/AIRiskSpikeMonitor";

export type SterlingContactRepeatIntent = {
  intent: string;
  repeats: number;
  share: number;
  color: string;
};

/** Drill 1 — repeat-contact by intent chart */
export const STERLING_HEAD_CONTACT_REPEAT_BY_INTENT: SterlingContactRepeatIntent[] = [
  { intent: "Fee/charge dispute", repeats: 412, share: 31, color: "#EF4444" },
  { intent: "Payment declined", repeats: 248, share: 18, color: "#F59E0B" },
  { intent: "Savings/Easy-Saver query", repeats: 196, share: 15, color: "#FBBF24" },
  { intent: "Card replacement", repeats: 134, share: 10, color: "#22C55E" },
  { intent: "Passcode reset", repeats: 121, share: 9, color: "#06B6D4" },
  { intent: "Account closure", repeats: 87, share: 7, color: "#A78BFA" },
  { intent: "Other", repeats: 134, share: 10, color: "#64748B" },
];

/** Drill 1 — recovery matrix top-intent rows (labels only) */
export const STERLING_HEAD_CONTACT_RECOVERY_TOP_INTENTS = {
  do_now: ["Fee/charge dispute", "Passcode reset", "Payee block loop"],
  schedule: ["Easy-Saver rate query", "Fee explanation", "Tone drift PM shift"],
  delegate: ["Missed callback", "Document upload", "Passcode reset"],
  monitor: ["Balance enquiry", "Duplicate tickets", "Already resolved"],
} as const;

export type SterlingContactRecoveryQuadrantId =
  keyof typeof STERLING_HEAD_CONTACT_RECOVERY_TOP_INTENTS;

/** Screen 1 — AI Risk Spike Monitor operational cards (topIntent labels only) */
export const STERLING_HEAD_CONTACT_OPERATIONAL_RISK_SPIKES: RiskSpike[] = [
  {
    id: "spike-urgency-voice",
    timestamp: "3h ago",
    spikeType: "Urgency Surge",
    magnitude: 34,
    channel: "Voice",
    topIntent: "Passcode reset",
    urgencyBefore: 21,
    urgencyAfter: 55,
    sentimentBefore: 2.2,
    sentimentAfter: 3.9,
    unresolvedBefore: 124,
    unresolvedAfter: 187,
    aiAction:
      "Possible trigger: recent interest-rate adjustment. Enable real-time callback routing and suppress repeat MFA checks.",
    severity: "critical",
    triggerExplanation: "Mortgage/savings rate adjustment",
    correlationConfidence: "High",
  },
  {
    id: "spike-sentiment-chat",
    timestamp: "1h ago",
    spikeType: "Sentiment Crash",
    magnitude: 1.2,
    channel: "Chat",
    topIntent: "Payment declined",
    urgencyBefore: 12,
    urgencyAfter: 31,
    sentimentBefore: 2.8,
    sentimentAfter: 4.0,
    unresolvedBefore: 210,
    unresolvedAfter: 380,
    aiAction:
      "Possible trigger: interest-rate change driving pricing dissatisfaction. Inject payment timeline updates into chatbot and escalate unresolved cases to Ticket.",
    severity: "critical",
    triggerExplanation: "Mortgage/savings rate adjustment",
    correlationConfidence: "High",
  },
  {
    id: "spike-sla-social",
    timestamp: "45m ago",
    spikeType: "SLA Spike",
    magnitude: 19,
    channel: "Social",
    topIntent: "Card blocked",
    slaBefore: 9,
    slaAfter: 28,
    unresolvedBefore: 91,
    unresolvedAfter: 164,
    aiAction:
      "Trigger expedited follow-up for decline disputes; Social backlog expanding rapidly.",
    severity: "moderate",
  },
  {
    id: "spike-unresolved-email",
    timestamp: "4h ago",
    spikeType: "Unresolved Surge",
    magnitude: 140,
    channel: "Email",
    topIntent: "Onboarding/KYC",
    unresolvedBefore: 212,
    unresolvedAfter: 352,
    aiAction:
      "Auto-prioritize KYC documentation in verification queue to prevent compliance delays.",
    severity: "moderate",
  },
  {
    id: "spike-volume-ticket",
    timestamp: "2h ago",
    spikeType: "Volume Surge",
    magnitude: 68,
    channel: "Ticket",
    topIntent: "Fee/charge dispute",
    urgencyBefore: 18,
    urgencyAfter: 36,
    unresolvedBefore: 98,
    unresolvedAfter: 166,
    aiAction:
      "Borrow capacity from Chat agents to triage new dispute tickets for the next 4 hours.",
    severity: "low",
  },
];

/** Drill 3 — SLA leading intents + FCI heatmap (shared UK labels with head_retail) */
export {
  STERLING_HEAD_RETAIL_LEADING_INTENTS as STERLING_HEAD_CONTACT_LEADING_INTENTS,
  STERLING_HEAD_RETAIL_FCI_INTENTS as STERLING_HEAD_CONTACT_FCI_INTENTS,
} from "./sterlingHeadRetailServiceData";
