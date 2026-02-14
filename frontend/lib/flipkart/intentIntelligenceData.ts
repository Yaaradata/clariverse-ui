/**
 * E-commerce intent intelligence data for Flipkart dashboard.
 * Used by IntentIntelligenceCommandCenter for scatter map, clusters, severity, conflicts, and recommendations.
 */

import type { ChannelKey } from "@/lib/flipkart/adapters";

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

const ecommerceScatterData: IntentIntelligenceScatterDatum[] = [
  { id: "1", displayName: "Order Tracking", sentiment: 2.2, urgency: 0.28, backlogPercent: 9, pressureScore: 2.6, dominantChannel: "chat" },
  { id: "2", displayName: "Wishlist & Save", sentiment: 2.4, urgency: 0.25, backlogPercent: 6, pressureScore: 2.2, dominantChannel: "email" },
  { id: "3", displayName: "Coupon / Offer", sentiment: 3.0, urgency: 0.40, backlogPercent: 14, pressureScore: 3.8, dominantChannel: "social" },
  { id: "4", displayName: "Return Pickup", sentiment: 3.8, urgency: 0.62, backlogPercent: 29, pressureScore: 6.5, dominantChannel: "ticket" },
  { id: "5", displayName: "Refund Status", sentiment: 4.0, urgency: 0.72, backlogPercent: 34, pressureScore: 7.2, dominantChannel: "email" },
  { id: "6", displayName: "Wrong Item / Damaged", sentiment: 4.1, urgency: 0.68, backlogPercent: 26, pressureScore: 6.8, dominantChannel: "voice" },
  { id: "7", displayName: "Payment Failed", sentiment: 4.3, urgency: 0.78, backlogPercent: 31, pressureScore: 7.5, dominantChannel: "chat" },
  { id: "8", displayName: "Delivery Delay", sentiment: 4.2, urgency: 0.65, backlogPercent: 28, pressureScore: 6.9, dominantChannel: "ticket" },
  { id: "9", displayName: "Seller Dispute", sentiment: 4.5, urgency: 0.80, backlogPercent: 22, pressureScore: 7.8, dominantChannel: "social" },
  { id: "10", displayName: "Replace Order", sentiment: 4.4, urgency: 0.75, backlogPercent: 25, pressureScore: 7.4, dominantChannel: "voice" },
  { id: "11", displayName: "Refund Not Processed", sentiment: 4.6, urgency: 0.88, backlogPercent: 30, pressureScore: 8.5, dominantChannel: "voice" },
  { id: "12", displayName: "Return Pickup Not Done", sentiment: 4.7, urgency: 0.85, backlogPercent: 27, pressureScore: 8.2, dominantChannel: "voice" },
];

const ecommerceClusters: IntentIntelligenceCluster[] = [
  { id: "1", name: "Returns & Refunds", dominantChannels: ["voice", "ticket"], avgSentiment: 4.4, avgUrgency: 0.72, pressureScore: 7.4, unresolved: 618, topSubtopics: ["Refund Status", "Return Pickup"], aiInsight: "Prioritise return pickup and refund SLA to reduce voice escalation" },
  { id: "2", name: "Order & Delivery", dominantChannels: ["chat", "ticket"], avgSentiment: 4.0, avgUrgency: 0.58, pressureScore: 6.2, unresolved: 492, topSubtopics: ["Delivery Delay", "Order Tracking"], aiInsight: "Sync delivery updates into chat and ticket to cut repeat contacts" },
  { id: "3", name: "Payment & Checkout", dominantChannels: ["chat", "email"], avgSentiment: 4.2, avgUrgency: 0.68, pressureScore: 6.8, unresolved: 445, topSubtopics: ["Payment Failed", "COD Issues"], aiInsight: "Surface payment failure reasons in-app and retry flows in chat" },
  { id: "4", name: "Product & Seller", dominantChannels: ["social", "voice"], avgSentiment: 4.3, avgUrgency: 0.65, pressureScore: 6.5, unresolved: 328, topSubtopics: ["Wrong Item", "Seller Dispute"], aiInsight: "Route seller disputes to dedicated team; carry proof across channels" },
  { id: "5", name: "Account & Offers", dominantChannels: ["email", "social"], avgSentiment: 3.2, avgUrgency: 0.42, pressureScore: 4.1, unresolved: 256, topSubtopics: ["Coupon", "Wishlist"], aiInsight: "Clarify offer T&Cs in email and in-app to reduce confusion" },
  { id: "6", name: "Replace & Exchange", dominantChannels: ["voice", "ticket"], avgSentiment: 4.1, avgUrgency: 0.70, pressureScore: 6.6, unresolved: 189, topSubtopics: ["Replace Order", "Size Exchange"], aiInsight: "One-tap replace in app and carry eligibility into voice/ticket" },
];

const ecommerceSeverityData: IntentIntelligenceSeverity[] = [
  { intent: "Refund Not Processed", severity: "Critical", pressure: 91, owner: "Company" },
  { intent: "Return Pickup Not Done", severity: "High", pressure: 84, owner: "Company" },
  { intent: "Payment Failed", severity: "High", pressure: 78, owner: "Customer" },
  { intent: "Delivery Delay", severity: "Medium", pressure: 62, owner: "Company" },
  { intent: "Order Tracking", severity: "Low", pressure: 28, owner: "Customer" },
];

const ecommerceHighPressureIntents: IntentIntelligenceHighPressure[] = [
  { name: "Refund Not Processed", pressure: 8.5, channel: "voice" },
  { name: "Return Pickup Not Done", pressure: 8.2, channel: "voice" },
  { name: "Seller Dispute", pressure: 7.8, channel: "social" },
  { name: "Refund Status", pressure: 7.2, channel: "email" },
  { name: "Payment Failed", pressure: 7.5, channel: "chat" },
];

const ecommerceConflicts: IntentIntelligenceConflict[] = [
  { intent: "Refund Status", channels: [{ channel: "ticket", status: "Closed" }, { channel: "email", status: "Pending" }, { channel: "voice", status: "Escalated" }], aiFix: "Sync refund status across ticket, email and voice before closing" },
  { intent: "Return Pickup", channels: [{ channel: "chat", status: "Closed" }, { channel: "voice", status: "Open" }], aiFix: "Confirm pickup completion in CRM before marking chat resolved" },
  { intent: "Payment Failed", channels: [{ channel: "email", status: "Open" }, { channel: "chat", status: "Pending" }], aiFix: "Link payment retry and failure reason in both channels" },
];

const ecommerceRecommendations: IntentIntelligenceRecommendation[] = [
  { icon: "🔥", text: "Refund and return pickup SLA driving most voice escalation; prioritise ops." },
  { icon: "⚠️", text: "Unify return/refund status visibility across email, chat and voice." },
  { icon: "⏳", text: "Ticket queue growing for delivery delays—add proactive ETA in app." },
  { icon: "🎧", text: "Voice spikes on \"Refund not processed\"; surface status in IVR and chat." },
  { icon: "🔁", text: "Carry payment failure reason and retry link from email to chat." },
];

const ecommerceInsightWallCards: IntentIntelligenceInsightCard[] = [
  { icon: "🔥", title: "Highest Pressure Cluster", context: "Returns & Refunds", detail: "Voice and ticket dominate backlog at 28%, sentiment 4.4, urgency 72%.", aiInsight: "Prioritise return pickup and refund SLA to reduce voice escalation." },
  { icon: "⚡", title: "Most Volatile Intent", context: "Refund Not Processed", detail: "Sentiment swings +2.2 → -1.5 with 4 escalation spikes per week.", aiInsight: "Surface refund status in email and chat; sync with CRM before closing tickets." },
  { icon: "❌", title: "Multi-Channel Conflict", context: "Refund Status", detail: "Ticket closed; email pending; voice escalated with sentiment 4.5.", aiInsight: "Require refund status sync across ticket, email and voice before closing any channel." },
  { icon: "📊", title: "Backlog Concentration", context: "Returns & Refunds", detail: "618 unresolved, sentiment 4.4, urgency flagged high.", aiInsight: "Expand auto-approval for eligible returns; add ETA in app to cut repeat contacts." },
  { icon: "🏢", title: "Accountability Mismatch", context: "Return Pickup", detail: "Company-owned actions at 65%, sentiment 4.2, backlog trending up.", aiInsight: "Shift pickup scheduling to self-service and carry status into voice and chat." },
  { icon: "🔁", title: "Cross-Channel Escalation Loop", context: "Refund Not Processed", detail: "Email → Chat → Voice loop raises sentiment from 2.2 to 4.6 within 48 hours.", aiInsight: "Inject refund status into chat and proactive email/SMS to prevent escalation." },
];

export function getEcommerceIntentIntelligenceData(): IntentIntelligenceData {
  return {
    scatterData: ecommerceScatterData,
    clusters: ecommerceClusters,
    severityData: ecommerceSeverityData,
    highPressureIntents: ecommerceHighPressureIntents,
    conflicts: ecommerceConflicts,
    recommendations: ecommerceRecommendations,
    insightWallCards: ecommerceInsightWallCards,
  };
}
