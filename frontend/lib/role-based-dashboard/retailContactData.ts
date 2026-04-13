/**
 * Mock data for Head of Retail Banking and Head of Contact Centre persona extensions.
 * Restructured per Ranjith/Soumya feedback:
 *  - Retail: valuable customers, pain points, brand risk, channel sentiment, intent SLA
 *  - Contact: outsourced vs insourced, cross-centre, promise adherence, clusters
 */

// ═══════════════════════════
// HEAD OF RETAIL BANKING
// ═══════════════════════════

/** Valuable customer segmentation — why high-value customers are calling */
export const RETAIL_VALUABLE_CUSTOMER_SEGMENTS = [
  { segment: "High-Value (>£100K)", calls: 312, topIntent: "Mortgage Servicing", churnRisk: 14, sentiment: 0.52 },
  { segment: "Mid-Value (£25K–100K)", calls: 847, topIntent: "Fee Dispute", churnRisk: 8, sentiment: 0.61 },
  { segment: "Low-Value (<£25K)", calls: 2134, topIntent: "Card Replacement", churnRisk: 3, sentiment: 0.72 },
];

/** Why high-value customers are calling — pain point breakdown */
export const RETAIL_HV_PAIN_POINTS = [
  { intent: "Mortgage Servicing", pct: 31, calls: 97, avgResolution: "2.1 days", slaHit: 72, severity: "critical" as const },
  { intent: "Fee Confusion", pct: 24, calls: 75, avgResolution: "3.2 days", slaHit: 64, severity: "critical" as const },
  { intent: "Onboarding Delays", pct: 18, calls: 56, avgResolution: "1.8 days", slaHit: 78, severity: "high" as const },
  { intent: "HELOC Rate Query", pct: 15, calls: 48, avgResolution: "0.4 days", slaHit: 88, severity: "medium" as const },
  { intent: "Account Closure", pct: 12, calls: 36, avgResolution: "1.5 days", slaHit: 81, severity: "high" as const },
];

/** Brand & reputation risk across channels */
export const RETAIL_CHANNEL_SENTIMENT = [
  { channel: "Voice", sentiment: 0.64, volume: 1840, trend: -0.03, topConcern: "Transfer loops & fee confusion" },
  { channel: "Social (X)", sentiment: 0.41, volume: 312, trend: -0.12, topConcern: "4 viral posts about hidden fees" },
  { channel: "Trustpilot", sentiment: 0.38, volume: 186, trend: -0.08, topConcern: "Rating dropped 3.8→3.2 in 4 weeks" },
  { channel: "App Store", sentiment: 0.71, volume: 68, trend: +0.02, topConcern: "Budgeting tool most requested" },
  { channel: "Email", sentiment: 0.56, volume: 423, trend: -0.05, topConcern: "143 unresolved >48h — mortgage queries" },
  { channel: "Chat", sentiment: 0.62, volume: 567, trend: -0.01, topConcern: "Containment at 62% — complex queries escape" },
];

/** Intent-based SLA tracking — closed vs not-closed with SLA target */
export const RETAIL_INTENT_SLA = [
  { intent: "Mortgage Servicing", closed: 70, notClosed: 27, slaTarget: 90, avgDays: 2.1 },
  { intent: "Fee Dispute", closed: 48, notClosed: 27, slaTarget: 90, avgDays: 3.2 },
  { intent: "Account Closure", closed: 29, notClosed: 7, slaTarget: 85, avgDays: 1.5 },
  { intent: "Card Replacement", closed: 164, notClosed: 16, slaTarget: 95, avgDays: 0.3 },
];

/** Process bottleneck data */
export const RETAIL_BOTTLENECKS = [
  { process: "KYC API Verification", avgDelay: "4.2h", impacted: 580, rootCause: "API latency 3× since Tuesday", severity: "critical" as const },
  { process: "Fee Dispute Resolution", avgDelay: "3.2 days", impacted: 75, rootCause: "Manual review queue backlog", severity: "critical" as const },
  { process: "Mortgage Servicing Query", avgDelay: "2.1 days", impacted: 97, rootCause: "HELOC tool offline + agent knowledge gap", severity: "high" as const },
  { process: "Escalation Routing", avgDelay: "4.1h", impacted: 34, rootCause: "IVR step-3 drop-off at 40%", severity: "medium" as const },
];

/** Intent heat map data (moved to head_retail per feedback) */
export const RETAIL_INTENT_HEATMAP = [
  { intent: "Mortgage Servicing", mon: 22, tue: 18, wed: 31, thu: 26, fri: 19, sat: 8, sun: 4, trend: "rising" as const },
  { intent: "Fee Dispute", mon: 8, tue: 12, wed: 24, thu: 41, fri: 38, sat: 14, sun: 6, trend: "spike" as const },
  { intent: "Card Replacement", mon: 28, tue: 25, wed: 30, thu: 27, fri: 32, sat: 18, sun: 12, trend: "stable" as const },
  { intent: "Account Closure", mon: 6, tue: 8, wed: 7, thu: 5, fri: 12, sat: 4, sun: 2, trend: "stable" as const },
  { intent: "Onboarding Help", mon: 14, tue: 18, wed: 22, thu: 16, fri: 12, sat: 6, sun: 3, trend: "rising" as const },
  { intent: "HELOC Rate Query", mon: 10, tue: 8, wed: 14, thu: 12, fri: 18, sat: 4, sun: 2, trend: "rising" as const },
];

// ═══════════════════════════
// HEAD OF CONTACT CENTRE
// ═══════════════════════════

/** Outsourced vs insourced agent health comparison */
export const CONTACT_AGENT_SEGMENTS = [
  { type: "In-house", agents: 124, fcr: 81, aht: 6.4, csat: 87, quality: 84, tone: 94 },
  { type: "BPO Mumbai", agents: 68, fcr: 58, aht: 12.2, csat: 64, quality: 61, tone: 82 },
  { type: "BPO Manila", agents: 52, fcr: 66, aht: 10.1, csat: 72, quality: 68, tone: 88 },
];

/** Cross-centre health monitor */
export const CONTACT_CENTRE_HEALTH = [
  { centre: "London (HQ)", health: 92, staffing: 100, fcr: 84, aht: 5.8, risk: "low" as const },
  { centre: "Manchester", health: 78, staffing: 88, fcr: 76, aht: 7.2, risk: "medium" as const },
  { centre: "Edinburgh", health: 86, staffing: 95, fcr: 80, aht: 6.6, risk: "low" as const },
  { centre: "BPO Mumbai", health: 64, staffing: 82, fcr: 58, aht: 12.2, risk: "high" as const },
  { centre: "BPO Manila", health: 71, staffing: 90, fcr: 66, aht: 10.1, risk: "medium" as const },
];

/** Promise adherence stages */
export const CONTACT_PROMISE_STAGES = [
  { stage: "Receiving", score: 94, target: 98, detail: "6% missed in 9–11 AM peak window" },
  { stage: "Authenticating", score: 88, target: 95, detail: "12% fail — KYC handoff broken" },
  { stage: "Understanding", score: 82, target: 90, detail: "Intent misclassification on complex queries" },
  { stage: "Resolving", score: 74, target: 85, detail: "HELOC + fee queries driving failures" },
  { stage: "Escalating", score: 76, target: 90, detail: "3 unactioned >4h — policy breach" },
  { stage: "Following Up", score: 68, target: 85, detail: "32% callbacks missed or late" },
];

/** Developing issues — intent spikes with context */
export const CONTACT_INTENT_SPIKES = [
  { intent: "Fee Dispute", spike: 3.2, period: "48h", rootCause: "Hidden fee policy change not communicated to agents", cluster: "67% mention 'transferred too many times'", severity: "critical" as const },
  { intent: "Mortgage Servicing", spike: 1.8, period: "1 week", rootCause: "HELOC tool offline — agents improvising", cluster: "42% repeat callers", severity: "high" as const },
  { intent: "Card Block/Unblock", spike: 2.1, period: "72h", rootCause: "Fraud alert batch triggered 340 false positives", cluster: "89% resolved on first call", severity: "medium" as const },
  { intent: "Onboarding", spike: 1.6, period: "3 days", rootCause: "KYC API 3× latency — 580 abandoned apps", cluster: "Digital-to-voice handoff failures", severity: "high" as const },
];

/** Cluster summary (moved to contact centre per feedback) */
export const CONTACT_CLUSTER_SUMMARY = [
  { cluster: "Fee Confusion", size: 187, sentiment: 0.38, topPhrase: "hidden fees / not told about charges", resolution: "42%", action: "Agent script update + proactive fee disclosure" },
  { cluster: "Transfer Loop", size: 134, sentiment: 0.34, topPhrase: "transferred too many times / keep explaining", resolution: "38%", action: "IVR escape hatch + warm transfer protocol" },
  { cluster: "Mortgage Distress", size: 89, sentiment: 0.29, topPhrase: "can't afford / rate went up / struggling", resolution: "56%", action: "Vulnerable customer protocol trigger" },
  { cluster: "System Outage Impact", size: 76, sentiment: 0.44, topPhrase: "app not working / can't log in", resolution: "78%", action: "Proactive SMS notification on known outages" },
  { cluster: "Collections Tone", size: 52, sentiment: 0.22, topPhrase: "aggressive / threatening / rude", resolution: "31%", action: "Evening shift coaching + script review" },
];
