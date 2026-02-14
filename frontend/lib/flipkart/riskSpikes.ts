/**
 * Flipkart AI Risk Spike Monitor – e-commerce operational alerts.
 * Same shape as AIRiskSpikeMonitor RiskSpike; intents and actions are e-commerce specific.
 */

export type FlipkartRiskSpike = {
  id: string;
  timestamp: string;
  spikeType: "Sentiment Crash" | "Urgency Surge" | "SLA Spike" | "Unresolved Surge" | "Volume Surge";
  magnitude: number;
  channel: "Email" | "Chat" | "Ticket" | "Social" | "Voice";
  topIntent: string;
  sentimentBefore?: number;
  sentimentAfter?: number;
  urgencyBefore?: number;
  urgencyAfter?: number;
  unresolvedBefore?: number;
  unresolvedAfter?: number;
  slaBefore?: number;
  slaAfter?: number;
  aiAction: string;
  severity: "critical" | "moderate" | "low";
};

export const flipkartRiskSpikes: FlipkartRiskSpike[] = [
  {
    id: "spike-urgency-voice",
    timestamp: "3h ago",
    spikeType: "Urgency Surge",
    magnitude: 32,
    channel: "Voice",
    topIntent: "Return Pickup Not Done",
    urgencyBefore: 19,
    urgencyAfter: 51,
    sentimentBefore: 2.1,
    sentimentAfter: 3.8,
    unresolvedBefore: 98,
    unresolvedAfter: 156,
    aiAction: "Enable real-time return pickup scheduling and notify logistics for priority slots.",
    severity: "critical",
  },
  {
    id: "spike-sentiment-chat",
    timestamp: "1h ago",
    spikeType: "Sentiment Crash",
    magnitude: 1.1,
    channel: "Chat",
    topIntent: "Payment Failed at Checkout",
    urgencyBefore: 14,
    urgencyAfter: 33,
    sentimentBefore: 2.7,
    sentimentAfter: 3.9,
    unresolvedBefore: 185,
    unresolvedAfter: 342,
    aiAction: "Inject payment retry and alternative payment options into chatbot; escalate failed orders to Ticket.",
    severity: "critical",
  },
  {
    id: "spike-sla-social",
    timestamp: "45m ago",
    spikeType: "SLA Spike",
    magnitude: 18,
    channel: "Social",
    topIntent: "Order Not Delivered",
    slaBefore: 8,
    slaAfter: 26,
    unresolvedBefore: 76,
    unresolvedAfter: 148,
    aiAction: "Trigger expedited follow-up for delivery disputes; Social backlog expanding rapidly.",
    severity: "moderate",
  },
  {
    id: "spike-unresolved-email",
    timestamp: "4h ago",
    spikeType: "Unresolved Surge",
    magnitude: 128,
    channel: "Email",
    topIntent: "Refund Not Processed",
    unresolvedBefore: 198,
    unresolvedAfter: 326,
    aiAction: "Auto-prioritize refund verification in finance queue to prevent compliance and NPS impact.",
    severity: "moderate",
  },
  {
    id: "spike-volume-ticket",
    timestamp: "2h ago",
    spikeType: "Volume Surge",
    magnitude: 72,
    channel: "Ticket",
    topIntent: "Wrong Item Received",
    urgencyBefore: 22,
    urgencyAfter: 38,
    unresolvedBefore: 112,
    unresolvedAfter: 184,
    aiAction: "Borrow capacity from Chat agents to triage replacement and return tickets for the next 4 hours.",
    severity: "low",
  },
];
