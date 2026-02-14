/**
 * Flipkart Unified Dashboard – e-commerce data adapters.
 * Same types and API as lib/unified/adapters; data is e-commerce specific (orders, returns, delivery, etc.).
 */

export type {
  ChannelKey,
  SystemHealthResponse,
  TrendPointResponse,
  IntentClusterResponse,
  SeverityMatrixResponse,
  CrossChannelActionGridEntry,
  CrossChannelActionGridResponse,
  AISummaryWallResponse,
  AISummaryInsight,
} from "@/lib/unified/adapters";

import type {
  ChannelKey,
  SystemHealthResponse,
  TrendPointResponse,
  IntentClusterResponse,
  SeverityMatrixResponse,
  CrossChannelActionGridResponse,
  AISummaryWallResponse,
} from "@/lib/unified/adapters";

function getCurrentMonthRange(): { start: string; end: string } {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstDay.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
}

function generateSentimentTrend(base: number, delta: number): number[] {
  const points = 12;
  return Array.from({ length: points }, (_, index) => {
    const progress = (index - points + 1) / points;
    const wave = Math.sin(index / 1.6) * 0.3;
    const noise = (Math.random() - 0.5) * 0.25;
    const value = base + progress * delta * 6 + wave + noise;
    return Number(Math.min(Math.max(value, 1), 5).toFixed(2));
  });
}

function generatePercentageTrend(startPct: number, endPct: number): number[] {
  const points = 12;
  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const wave = Math.sin(index / 2) * 2;
    const noise = (Math.random() - 0.5) * 1.5;
    const value = startPct + (endPct - startPct) * progress + wave + noise;
    return Number(Math.max(0, Math.min(100, value)).toFixed(1));
  });
}

export async function fetchSystemHealth(): Promise<SystemHealthResponse[]> {
  const dateRange = getCurrentMonthRange();

  return Promise.resolve([
    {
      channel: "email",
      label: "Email",
      icon: "Mail",
      color: "bg-blue-500",
      total: 612,
      sentiment: 3.5,
      sentimentDelta: -0.1,
      sentimentTrend: generateSentimentTrend(3.5, -0.1),
      urgencyPct: 22.4,
      urgencyStartPct: 20.1,
      urgencyEndPct: 22.4,
      urgencyTrend: generatePercentageTrend(20.1, 22.4),
      slaRisk: 7.2,
      slaRiskStartPct: 6.1,
      slaRiskEndPct: 7.2,
      slaRiskTrend: generatePercentageTrend(6.1, 7.2),
      dateRange,
      unresolved: 198,
      unresolvedCompany: 118,
      unresolvedCustomer: 80,
      unresolvedCompanyPct: 60,
      unresolvedCustomerPct: 40,
      emergingTheme: "Return & refund requests",
    },
    {
      channel: "chat",
      label: "Chat",
      icon: "MessageCircle",
      color: "bg-green-500",
      total: 924,
      sentiment: 3.8,
      sentimentDelta: 0.12,
      sentimentTrend: generateSentimentTrend(3.8, 0.12),
      urgencyPct: 19.2,
      urgencyStartPct: 21.0,
      urgencyEndPct: 19.2,
      urgencyTrend: generatePercentageTrend(21.0, 19.2),
      slaRisk: 2.8,
      slaRiskStartPct: 4.2,
      slaRiskEndPct: 2.8,
      slaRiskTrend: generatePercentageTrend(4.2, 2.8),
      dateRange,
      unresolved: 102,
      unresolvedCompany: 42,
      unresolvedCustomer: 60,
      unresolvedCompanyPct: 41,
      unresolvedCustomerPct: 59,
      emergingTheme: "Order tracking & delivery ETA",
    },
    {
      channel: "ticket",
      label: "Ticket",
      icon: "Ticket",
      color: "bg-purple-500",
      total: 518,
      sentiment: 3.3,
      sentimentDelta: -0.08,
      sentimentTrend: generateSentimentTrend(3.3, -0.08),
      urgencyPct: 35.6,
      urgencyStartPct: 31.2,
      urgencyEndPct: 35.6,
      urgencyTrend: generatePercentageTrend(31.2, 35.6),
      slaRisk: 11.4,
      slaRiskStartPct: 9.8,
      slaRiskEndPct: 11.4,
      slaRiskTrend: generatePercentageTrend(9.8, 11.4),
      dateRange,
      unresolved: 156,
      unresolvedCompany: 92,
      unresolvedCustomer: 64,
      unresolvedCompanyPct: 59,
      unresolvedCustomerPct: 41,
      emergingTheme: "Payment failure & refund delays",
    },
    {
      channel: "social",
      label: "Social",
      icon: "Share2",
      color: "bg-pink-500",
      total: 388,
      sentiment: 3.1,
      sentimentDelta: -0.15,
      sentimentTrend: generateSentimentTrend(3.1, -0.15),
      urgencyPct: 44.2,
      urgencyStartPct: 40.1,
      urgencyEndPct: 44.2,
      urgencyTrend: generatePercentageTrend(40.1, 44.2),
      slaRisk: 14.8,
      slaRiskStartPct: 12.6,
      slaRiskEndPct: 14.8,
      slaRiskTrend: generatePercentageTrend(12.6, 14.8),
      dateRange,
      unresolved: 142,
      unresolvedCompany: 68,
      unresolvedCustomer: 74,
      unresolvedCompanyPct: 48,
      unresolvedCustomerPct: 52,
      emergingTheme: "Delivery & product quality complaints",
    },
    {
      channel: "voice",
      label: "Voice",
      icon: "Mic",
      color: "bg-orange-500",
      total: 267,
      sentiment: 4.0,
      sentimentDelta: 0.06,
      sentimentTrend: generateSentimentTrend(4.0, 0.06),
      urgencyPct: 14.1,
      urgencyStartPct: 15.2,
      urgencyEndPct: 14.1,
      urgencyTrend: generatePercentageTrend(15.2, 14.1),
      slaRisk: 3.9,
      slaRiskStartPct: 4.8,
      slaRiskEndPct: 3.9,
      slaRiskTrend: generatePercentageTrend(4.8, 3.9),
      dateRange,
      unresolved: 28,
      unresolvedCompany: 10,
      unresolvedCustomer: 18,
      unresolvedCompanyPct: 36,
      unresolvedCustomerPct: 64,
      emergingTheme: "Return pickup & replacement",
    },
  ]);
}

export async function fetchTrendData(): Promise<TrendPointResponse[]> {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
  const start = new Date("2025-02-02T00:00:00Z");
  const days = 8;

  const points: TrendPointResponse[] = Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const baseVolume = 350 + index * 22;
    const volumeNoise = () => Math.round((Math.random() - 0.5) * 70);

    const email = baseVolume + volumeNoise();
    const chat = baseVolume + 100 + volumeNoise();
    const ticket = baseVolume / 2.2 + volumeNoise();
    const social = baseVolume / 1.8 + volumeNoise();
    const voice = baseVolume / 2.5 + volumeNoise();

    const sentimentWave = Math.sin(index / 1.4) * 0.7;
    const sentimentNoise = (Math.random() - 0.5) * 0.5;
    const sentiment = clamp(3.3 + sentimentWave + sentimentNoise, 1.4, 4.8);

    return {
      date: date.toISOString().split("T")[0],
      email,
      chat,
      ticket,
      social,
      voice,
      sentiment: Number(sentiment.toFixed(2)),
    };
  });

  return Promise.resolve(points);
}

export async function fetchIntentClusters(): Promise<IntentClusterResponse[]> {
  return Promise.resolve([
    {
      id: "intent-1",
      name: "Order Delivery Delay",
      severity: "critical",
      sentiment: 52,
      urgency: 0.85,
      volume: 1120,
      trend: "rising",
      volumeByChannel: [
        { channel: "email", value: 320 },
        { channel: "chat", value: 280 },
        { channel: "ticket", value: 240 },
        { channel: "social", value: 180 },
        { channel: "voice", value: 100 },
      ],
    },
    {
      id: "intent-2",
      name: "Return & Refund",
      severity: "high",
      sentiment: 58,
      urgency: 0.72,
      volume: 980,
      trend: "rising",
      volumeByChannel: [
        { channel: "email", value: 260 },
        { channel: "chat", value: 220 },
        { channel: "ticket", value: 200 },
        { channel: "social", value: 160 },
        { channel: "voice", value: 140 },
      ],
    },
    {
      id: "intent-3",
      name: "Payment Failed",
      severity: "critical",
      sentiment: 46,
      urgency: 0.88,
      volume: 840,
      trend: "stable",
      volumeByChannel: [
        { channel: "email", value: 220 },
        { channel: "chat", value: 200 },
        { channel: "ticket", value: 180 },
        { channel: "social", value: 140 },
        { channel: "voice", value: 100 },
      ],
    },
    {
      id: "intent-4",
      name: "Wrong / Damaged Item",
      severity: "high",
      sentiment: 44,
      urgency: 0.78,
      volume: 720,
      trend: "rising",
      volumeByChannel: [
        { channel: "email", value: 200 },
        { channel: "chat", value: 170 },
        { channel: "ticket", value: 150 },
        { channel: "social", value: 120 },
        { channel: "voice", value: 80 },
      ],
    },
    {
      id: "intent-5",
      name: "Order Tracking",
      severity: "medium",
      sentiment: 68,
      urgency: 0.48,
      volume: 890,
      trend: "stable",
      volumeByChannel: [
        { channel: "email", value: 180 },
        { channel: "chat", value: 280 },
        { channel: "ticket", value: 140 },
        { channel: "social", value: 160 },
        { channel: "voice", value: 130 },
      ],
    },
    {
      id: "intent-6",
      name: "Cancellation Request",
      severity: "medium",
      sentiment: 62,
      urgency: 0.55,
      volume: 540,
      trend: "falling",
      volumeByChannel: [
        { channel: "email", value: 150 },
        { channel: "chat", value: 140 },
        { channel: "ticket", value: 120 },
        { channel: "social", value: 80 },
        { channel: "voice", value: 50 },
      ],
    },
    {
      id: "intent-7",
      name: "Coupon / Offer Issue",
      severity: "low",
      sentiment: 72,
      urgency: 0.35,
      volume: 420,
      trend: "stable",
      volumeByChannel: [
        { channel: "email", value: 120 },
        { channel: "chat", value: 100 },
        { channel: "ticket", value: 80 },
        { channel: "social", value: 70 },
        { channel: "voice", value: 50 },
      ],
    },
    {
      id: "intent-8",
      name: "Replacement Request",
      severity: "high",
      sentiment: 56,
      urgency: 0.68,
      volume: 650,
      trend: "rising",
      volumeByChannel: [
        { channel: "email", value: 180 },
        { channel: "chat", value: 150 },
        { channel: "ticket", value: 140 },
        { channel: "social", value: 100 },
        { channel: "voice", value: 80 },
      ],
    },
    {
      id: "intent-9",
      name: "Account & Login",
      severity: "medium",
      sentiment: 74,
      urgency: 0.42,
      volume: 380,
      trend: "stable",
      volumeByChannel: [
        { channel: "email", value: 100 },
        { channel: "chat", value: 95 },
        { channel: "ticket", value: 80 },
        { channel: "social", value: 55 },
        { channel: "voice", value: 50 },
      ],
    },
    {
      id: "intent-10",
      name: "Seller / Marketplace Dispute",
      severity: "critical",
      sentiment: 40,
      urgency: 0.82,
      volume: 290,
      trend: "rising",
      volumeByChannel: [
        { channel: "email", value: 90 },
        { channel: "chat", value: 60 },
        { channel: "ticket", value: 80 },
        { channel: "social", value: 40 },
        { channel: "voice", value: 20 },
      ],
    },
  ]);
}

export async function fetchSeverityMatrix(): Promise<SeverityMatrixResponse[]> {
  return Promise.resolve([
    { id: "intent-1", name: "Order Delivery Delay", isiScore: 94, slaRisk: 0.44, actionPending: "company" },
    { id: "intent-2", name: "Return & Refund", isiScore: 88, slaRisk: 0.38, actionPending: "company" },
    { id: "intent-3", name: "Payment Failed", isiScore: 90, slaRisk: 0.42, actionPending: "company" },
    { id: "intent-4", name: "Wrong / Damaged Item", isiScore: 86, slaRisk: 0.36, actionPending: "company" },
    { id: "intent-5", name: "Order Tracking", isiScore: 62, slaRisk: 0.14, actionPending: "customer" },
    { id: "intent-6", name: "Cancellation Request", isiScore: 68, slaRisk: 0.18, actionPending: "company" },
    { id: "intent-7", name: "Coupon / Offer Issue", isiScore: 48, slaRisk: 0.06, actionPending: "customer" },
    { id: "intent-8", name: "Replacement Request", isiScore: 82, slaRisk: 0.32, actionPending: "company" },
    { id: "intent-9", name: "Account & Login", isiScore: 56, slaRisk: 0.10, actionPending: "customer" },
    { id: "intent-10", name: "Seller / Marketplace Dispute", isiScore: 92, slaRisk: 0.46, actionPending: "company" },
  ]);
}

/** Same stage names as Standard Chartered so the shared Cross-Channel Action Grid heatmap shows all rows. */
const ACTION_GRID_STAGES = ["Receive", "Authenticate", "Resolution", "Escalation", "Closure"] as const;

const ACTION_GRID_CHANNELS: ChannelKey[] = ["email", "chat", "ticket", "social", "voice"];

export async function fetchCrossChannelActionGrid(): Promise<CrossChannelActionGridResponse> {
  const entries: Array<{
    stage: string;
    channel: ChannelKey;
    avgDelayHours: number;
    pendingFromCompany: number;
    sentiment: number;
    urgencyRatio: number;
  }> = [];

  for (let stageIndex = 0; stageIndex < ACTION_GRID_STAGES.length; stageIndex++) {
    const stage = ACTION_GRID_STAGES[stageIndex];
    for (let channelIndex = 0; channelIndex < ACTION_GRID_CHANNELS.length; channelIndex++) {
      const channel = ACTION_GRID_CHANNELS[channelIndex];
      entries.push({
        stage,
        channel,
        avgDelayHours: Number((2 + stageIndex * 1.4 + channelIndex * 0.8).toFixed(1)),
        pendingFromCompany: Math.min(0.9, 0.25 + stageIndex * 0.12 + channelIndex * 0.05),
        sentiment: Number((2.2 + (channelIndex % 2 === 0 ? -0.3 : 0.4) - stageIndex * 0.1).toFixed(1)),
        urgencyRatio: Math.min(0.95, 0.3 + stageIndex * 0.16 + channelIndex * 0.04),
      });
    }
  }

  return Promise.resolve({
    entries,
    insights: [
      "Voice channel escalation stage shows longest delay (avg 8.9 hrs) for returns.",
      "Email has highest internal dependency — 65% company-pending (refund approvals).",
      "Chat resolves 38% faster than Ticket; optimize return and order-tracking workflow.",
    ],
  });
}

export async function fetchAISummaryWall(): Promise<AISummaryWallResponse> {
  return Promise.resolve({
    insights: [
      { title: "Top Intent of the Week", description: "Order delivery delay and return-related messages across 3 channels make up 44% of total volume.", tone: "negative" },
      { title: "Action Bottleneck", description: "Refund resolution stage drives 58% of SLA breaches; assign dedicated returns team.", tone: "negative" },
      { title: "Emotional Outlier", description: "Social sentiment dropped 1.2 points yesterday — delivery and product quality complaints.", tone: "negative" },
      { title: "Ownership Gap", description: "Company dependency sits at 68% overall — refund and replacement approvals bottleneck.", tone: "neutral" },
      { title: "Response Velocity", description: "Chat leads with avg latency 1.1 hrs; Email lags at 5.2 hrs for order issues.", tone: "positive" },
      { title: "Cross-Channel Correlation", description: "Return & Refund and Wrong Item overlap across Ticket + Email engagement.", tone: "neutral" },
      { title: "Efficiency Gain", description: "AI automation in return labels and tracking could reduce backlog by 22%.", tone: "positive" },
      { title: "Experience Focus", description: "Payment failure escalations trending up in Social — consider proactive outreach.", tone: "negative" },
    ],
  });
}
