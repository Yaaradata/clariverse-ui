/**
 * Banking intent intelligence data for Standard Chartered (and other bank dashboards).
 * Used by IntentIntelligenceCommandCenter for scatter map, clusters, severity, conflicts, and recommendations.
 */

import type { ChannelKey } from "@/lib/unified/adapters";

export type IntentIntelligenceScatterDatum = {
  id: string;
  displayName: string;
  sentiment: number;
  urgency: number;
  backlogPercent: number;
  pressureScore: number;
  dominantChannel: ChannelKey;
  clusterId?: string;
};

export type IntentIntelligenceCluster = {
  id: string;
  name: string;
  dominantChannels: ChannelKey[];
  avgSentiment: number;
  avgUrgency: number;
  pressureScore: number;
  unresolved: number;
  topSubtopics: string[];
  aiInsight: string;
};

export type IntentIntelligenceSeverity = {
  intent: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  pressure: number;
  owner: "Company" | "Customer";
};

export type IntentIntelligenceHighPressure = {
  name: string;
  pressure: number;
  channel: ChannelKey;
};

export type IntentIntelligenceConflict = {
  intent: string;
  channels: Array<{ channel: ChannelKey; status: string }>;
  aiFix: string;
};

export type IntentIntelligenceRecommendation = {
  icon: string;
  text: string;
};

/** One card in the AI Pressure Insight Wall (column 3) */
export type IntentIntelligenceInsightCard = {
  icon: string;
  title: string;
  context: string;
  detail: string;
  aiInsight: string;
};

export type IntentIntelligenceData = {
  scatterData: IntentIntelligenceScatterDatum[];
  clusters: IntentIntelligenceCluster[];
  severityData: IntentIntelligenceSeverity[];
  highPressureIntents: IntentIntelligenceHighPressure[];
  conflicts: IntentIntelligenceConflict[];
  recommendations: IntentIntelligenceRecommendation[];
  insightWallCards: IntentIntelligenceInsightCard[];
};

const bankingScatterData: IntentIntelligenceScatterDatum[] = [
  { id: "1", displayName: "Rewards Redemption", sentiment: 2.3, urgency: 0.35, backlogPercent: 11, pressureScore: 3.4, dominantChannel: "email" },
  { id: "2", displayName: "Account Inquiry", sentiment: 2.6, urgency: 0.30, backlogPercent: 8, pressureScore: 2.8, dominantChannel: "chat" },
  { id: "3", displayName: "Statement Request", sentiment: 3.3, urgency: 0.45, backlogPercent: 15, pressureScore: 4.2, dominantChannel: "ticket" },
  { id: "4", displayName: "Payment Timeout", sentiment: 3.8, urgency: 0.65, backlogPercent: 31, pressureScore: 6.8, dominantChannel: "chat" },
  { id: "5", displayName: "Billing Question", sentiment: 3.9, urgency: 0.68, backlogPercent: 28, pressureScore: 6.5, dominantChannel: "email" },
  { id: "6", displayName: "Card Activation", sentiment: 4.0, urgency: 0.58, backlogPercent: 22, pressureScore: 5.9, dominantChannel: "chat" },
  { id: "7", displayName: "Transaction Inquiry", sentiment: 4.2, urgency: 0.70, backlogPercent: 25, pressureScore: 7.1, dominantChannel: "ticket" },
  { id: "8", displayName: "KYC Resubmission", sentiment: 4.2, urgency: 0.60, backlogPercent: 27, pressureScore: 6.2, dominantChannel: "email" },
  { id: "9", displayName: "Credit Card Dispute", sentiment: 4.4, urgency: 0.75, backlogPercent: 18, pressureScore: 7.6, dominantChannel: "social" },
  { id: "10", displayName: "Debit Card Replacement", sentiment: 4.5, urgency: 0.88, backlogPercent: 24, pressureScore: 8.3, dominantChannel: "voice" },
  { id: "11", displayName: "Mortgage Rate Lock", sentiment: 4.6, urgency: 0.85, backlogPercent: 22, pressureScore: 8.9, dominantChannel: "voice" },
  { id: "12", displayName: "Digital Account Recovery", sentiment: 4.7, urgency: 0.90, backlogPercent: 23, pressureScore: 8.6, dominantChannel: "voice" },
];

const bankingClusters: IntentIntelligenceCluster[] = [
  { id: "1", name: "Payment Failures & Disputes", dominantChannels: ["voice", "social"], avgSentiment: 4.3, avgUrgency: 0.69, pressureScore: 7.1, unresolved: 742, topSubtopics: ["ACH Reversal", "Payment Timeout"], aiInsight: "Re-route authentication to Chat to decompress Voice escalations" },
  { id: "2", name: "Mortgage & Lending Journey", dominantChannels: ["chat", "voice"], avgSentiment: 4.2, avgUrgency: 0.58, pressureScore: 6.5, unresolved: 529, topSubtopics: ["Rate Lock", "Application Status"], aiInsight: "Sync underwriting updates into omni-channel timeline" },
  { id: "3", name: "Identity & Security Access", dominantChannels: ["email", "voice"], avgSentiment: 4.0, avgUrgency: 0.63, pressureScore: 6.2, unresolved: 418, topSubtopics: ["Account Recovery", "KYC Resubmission"], aiInsight: "Standardize document ask templates and pre-verify submissions" },
  { id: "4", name: "Billing & Statement Questions", dominantChannels: ["email", "ticket"], avgSentiment: 3.7, avgUrgency: 0.46, pressureScore: 5.0, unresolved: 332, topSubtopics: ["Fee Clarification", "Rewards Redemption"], aiInsight: "Automate fee-waiver eligibility and self-service statements" },
  { id: "5", name: "Card Access & Replacement", dominantChannels: ["voice", "ticket"], avgSentiment: 4.4, avgUrgency: 0.73, pressureScore: 7.9, unresolved: 388, topSubtopics: ["Debit Replacement", "Fraud Verification"], aiInsight: "Carry fraud verification across channel hops" },
  { id: "6", name: "Loan Application Status", dominantChannels: ["chat", "social"], avgSentiment: 3.4, avgUrgency: 0.51, pressureScore: 5.2, unresolved: 203, topSubtopics: ["Status Updates", "Document Upload"], aiInsight: "Proactive status pushes could reduce call deflection" },
];

const bankingSeverityData: IntentIntelligenceSeverity[] = [
  { intent: "Payment Failures", severity: "Critical", pressure: 92, owner: "Company" },
  { intent: "Mortgage Delays", severity: "High", pressure: 86, owner: "Company" },
  { intent: "Account Access", severity: "Medium", pressure: 64, owner: "Customer" },
  { intent: "Billing Questions", severity: "Medium", pressure: 58, owner: "Company" },
  { intent: "Rewards Redemption", severity: "Low", pressure: 32, owner: "Customer" },
];

const bankingHighPressureIntents: IntentIntelligenceHighPressure[] = [
  { name: "Mortgage Rate Lock", pressure: 8.9, channel: "voice" },
  { name: "Digital Account Recovery", pressure: 8.6, channel: "voice" },
  { name: "Debit Card Replacement", pressure: 8.3, channel: "voice" },
  { name: "Credit Card Dispute", pressure: 7.6, channel: "social" },
  { name: "Payment Timeout", pressure: 6.8, channel: "chat" },
];

const bankingConflicts: IntentIntelligenceConflict[] = [
  { intent: "Payment Timeout", channels: [{ channel: "email", status: "Closed" }, { channel: "chat", status: "Pending" }, { channel: "voice", status: "Escalated" }], aiFix: "Require CRM timeline acknowledgment before close" },
  { intent: "Mortgage Rate Lock", channels: [{ channel: "ticket", status: "Closed" }, { channel: "voice", status: "Escalated" }], aiFix: "Reopen ticket and assign to compliance QA" },
  { intent: "Credit Card Dispute", channels: [{ channel: "chat", status: "Closed" }, { channel: "email", status: "Open" }, { channel: "social", status: "Open" }], aiFix: "Link channels in dispute workflow and launch follow-up audit" },
];

const bankingRecommendations: IntentIntelligenceRecommendation[] = [
  { icon: "🔥", text: "Resolve Payment Failures first; Voice backlog up 22%." },
  { icon: "⚠️", text: "Unify KYC document requests across channels." },
  { icon: "⏳", text: "Ticket queue delay rising—initiate auto-triage." },
  { icon: "🎧", text: "Voice escalation loops detected for \"Rate Lock\"." },
  { icon: "🔁", text: "Carry security verification across channels." },
];

const bankingInsightWallCards: IntentIntelligenceInsightCard[] = [
  { icon: "🔥", title: "Highest Pressure Cluster", context: "Payment Failures", detail: "Voice dominates backlog at 22%, sentiment 4.3, urgency 0.69.", aiInsight: "Re-route authentication into Chat to reduce Voice escalations and cut handle time." },
  { icon: "⚡", title: "Most Volatile Intent", context: "KYC Resubmission", detail: "Sentiment swings +2.1 → -1.4 with 3 escalation spikes per week.", aiInsight: "Standardize document requirements; surface checklist in Email and Chat concurrently." },
  { icon: "❌", title: "Multi-Channel Conflict", context: "Payment Timeout", detail: "Ticket shows closed; Chat pending customer; Voice escalated with sentiment 4.6.", aiInsight: "Require CRM timeline acknowledgment before agents close any related channel thread." },
  { icon: "📊", title: "Backlog Concentration", context: "Billing Issues", detail: "426 unresolved, sentiment 4.0, urgency flagged high.", aiInsight: "Expand automated refund approval thresholds for P2 tickets to relieve backlog." },
  { icon: "🏢", title: "Accountability Mismatch", context: "Account Recovery", detail: "Company-owned actions at 68%, sentiment 4.5, backlog trending upward.", aiInsight: "Shift low-risk resets to self-service scheduling with biometric verification." },
  { icon: "🔁", title: "Cross-Channel Escalation Loop", context: "Mortgage Rate Lock", detail: "Email → Chat → Voice loop raises sentiment from 2.4 to 4.6 within 48 hours.", aiInsight: "Inject underwriting updates into Chat transcripts and proactive email digests." },
];

export function getBankingIntentIntelligenceData(): IntentIntelligenceData {
  return {
    scatterData: bankingScatterData,
    clusters: bankingClusters,
    severityData: bankingSeverityData,
    highPressureIntents: bankingHighPressureIntents,
    conflicts: bankingConflicts,
    recommendations: bankingRecommendations,
    insightWallCards: bankingInsightWallCards,
  };
}
