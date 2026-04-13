import type { SystemHealthMetric } from "@/components/unified/kpi/SystemHealthRibbon";

const dr = { start: "2026-04-01", end: "2026-04-09" };

function metric(
  channel: SystemHealthMetric["channel"],
  label: string,
  icon: SystemHealthMetric["icon"],
  color: string,
  total: number,
): SystemHealthMetric {
  return {
    channel,
    label,
    icon,
    color,
    total,
    sentiment: 2.4 + (channel === "email" ? 0.3 : 0),
    sentimentDelta: -0.2,
    sentimentTrend: [2.6, 2.5, 2.4, 2.45, 2.4],
    urgencyPct: 28 + (channel === "voice" ? 12 : 0),
    urgencyTrend: [22, 24, 26, 27, 28],
    urgencyStartPct: 22,
    urgencyEndPct: 32,
    slaRisk: 14 + (channel === "ticket" ? 8 : 0),
    slaRiskTrend: [10, 11, 12, 13, 14],
    slaRiskStartPct: 10,
    slaRiskEndPct: 18,
    dateRange: dr,
    unresolved: 180 + (channel === "chat" ? 40 : 0),
    unresolvedCompany: 90,
    unresolvedCustomer: 90,
    unresolvedCompanyPct: 50,
    unresolvedCustomerPct: 50,
    emergingTheme: "Rate-change & fee confusion",
  };
}

export const ROLE_BASED_MOCK_SYSTEM_HEALTH: SystemHealthMetric[] = [
  metric("email", "Email", "Mail", "#60a5fa", 1240),
  metric("chat", "Chat", "MessageCircle", "#34d399", 1580),
  metric("ticket", "Ticket", "Ticket", "#a855f7", 920),
  metric("social", "Social", "Share2", "#f472b6", 640),
  metric("voice", "Voice", "Mic", "#f97316", 1320),
];

export const ROLE_BASED_MOCK_TREND = [
  { date: "2026-04-03", email: 120, chat: 90, ticket: 70, social: 45, voice: 110, sentiment: 2.5 },
  { date: "2026-04-04", email: 132, chat: 95, ticket: 72, social: 48, voice: 115, sentiment: 2.45 },
  { date: "2026-04-05", email: 128, chat: 102, ticket: 68, social: 52, voice: 108, sentiment: 2.4 },
  { date: "2026-04-06", email: 145, chat: 110, ticket: 75, social: 55, voice: 122, sentiment: 2.35 },
  { date: "2026-04-07", email: 138, chat: 105, ticket: 80, social: 50, voice: 118, sentiment: 2.3 },
  { date: "2026-04-08", email: 150, chat: 112, ticket: 82, social: 58, voice: 125, sentiment: 2.28 },
  { date: "2026-04-09", email: 142, chat: 108, ticket: 78, social: 54, voice: 120, sentiment: 2.25 },
];

export const ROLE_BASED_SYSTEM_HEALTH_EXPLANATIONS: Record<string, string> = Object.fromEntries(
  ROLE_BASED_MOCK_SYSTEM_HEALTH.map((m) => [
    m.channel,
    `${m.label}: sentiment ${m.sentiment.toFixed(1)}, urgency ${m.urgencyPct}%, SLA risk ${m.slaRisk}%.`,
  ]),
);
