/**
 * Extended mock + derived metrics for RBI Conduct Intelligence Preview dashboard.
 * Grounded in RBI_Obligation_Control_Register.xlsx (conversation-monitored controls).
 */

import {
  FLUID_ALONE_CONTROLS,
  OBLIGATION_MET_SUMMARIES,
  type ObligationMetSummary,
  type RegisterControl,
} from "./rbiObligationRegister";

export type ExecutiveLens = "L1" | "L2" | "L3" | "L4" | "L5";

export const EXECUTIVE_LENSES = {
  L1: {
    id: "L1" as const,
    title: "Head of Product / Digital",
    focus: "Product design · digital journey · disclosure in product flow",
  },
  L2: {
    id: "L2" as const,
    title: "Head of Customer",
    focus: "Customer outcomes · fair treatment · vulnerable customer protection",
  },
  L3: {
    id: "L3" as const,
    title: "Head of CX",
    focus: "Contact centre execution · complaint handling · agent conduct",
  },
  L4: {
    id: "L4" as const,
    title: "Head of Risk / Compliance",
    focus: "Control framework · regulatory reporting · audit defensibility",
  },
  L5: {
    id: "L5" as const,
    title: "Head of Marketing",
    focus: "Communication · brand · campaign claims · positioning",
  },
} as const;

/** Primary accountable lens per obligation (from register themes). */
export const OBLIGATION_PRIMARY_LENS: Record<string, ExecutiveLens> = {
  "OBL-001": "L3",
  "OBL-002": "L3",
  "OBL-003": "L3",
  "OBL-004": "L3",
  "OBL-005": "L4",
  "OBL-006": "L4",
  "OBL-007": "L4",
  "OBL-008": "L4",
  "OBL-011": "L2",
  "OBL-012": "L2",
  "OBL-014": "L1",
  "OBL-015": "L1",
  "OBL-016": "L2",
  "OBL-017": "L1",
  "OBL-018": "L5",
  "OBL-019": "L1",
  "OBL-024": "L4",
  "OBL-025": "L4",
  "OBL-026": "L5",
  "OBL-027": "L2",
  "OBL-028": "L3",
  "OBL-029": "L3",
  "OBL-030": "L3",
  "OBL-031": "L3",
};

export const REGISTER_STATS = {
  totalObligations: 29,
  interactionMonitorable: 24,
  conversationControls: 37,
  totalControls: 51,
  contactsAnalysed: 314_218,
  conductSignals: 2_006,
  evidenceReadyPct: 83,
  criticalSignals: 47,
  ioExposureCases: 12,
  snippetsPendingReview: 214,
  missingChannelGaps: 18,
} as const;

export type ObligationHealthStatus =
  | "MEETING"
  | "WATCH"
  | "BREACH"
  | "MISSING_DATA";

export function obligationHealth(metPct: number): ObligationHealthStatus {
  if (metPct >= 85) return "MEETING";
  if (metPct >= 70) return "WATCH";
  return "BREACH";
}

export function healthDistribution(
  summaries: readonly ObligationMetSummary[] = OBLIGATION_MET_SUMMARIES,
) {
  const dist = { MEETING: 0, WATCH: 0, BREACH: 0, MISSING_DATA: 3 };
  for (const o of summaries) {
    dist[obligationHealth(o.metPct)] += 1;
  }
  return dist;
}

export type ChannelKey =
  | "inbound_voice"
  | "outbound_voice"
  | "chat"
  | "email"
  | "tickets"
  | "social";

export const CHANNEL_LABELS: Record<ChannelKey, string> = {
  inbound_voice: "Inbound Voice",
  outbound_voice: "Outbound Voice",
  chat: "Chat",
  email: "Email",
  tickets: "Tickets",
  social: "Social",
};

export type ObligationGroupKey =
  | "complaint_capture"
  | "recovery_conduct"
  | "borrower_distress"
  | "cross_sell_consent"
  | "kfs_disclosure"
  | "fraud_dispute"
  | "vendor_conduct"
  | "language_routing";

export const OBLIGATION_GROUPS: ReadonlyArray<{
  key: ObligationGroupKey;
  label: string;
  obligationIds: readonly string[];
  color: string;
}> = [
  {
    key: "complaint_capture",
    label: "Complaint capture & first-90s",
    obligationIds: ["OBL-001", "OBL-002", "OBL-003", "OBL-004"],
    color: "#ef4444",
  },
  {
    key: "recovery_conduct",
    label: "Recovery conduct",
    obligationIds: ["OBL-005", "OBL-006", "OBL-007"],
    color: "#f59e0b",
  },
  {
    key: "borrower_distress",
    label: "Borrower distress & hardship",
    obligationIds: ["OBL-008"],
    color: "#eab308",
  },
  {
    key: "cross_sell_consent",
    label: "Cross-sell & bundling consent",
    obligationIds: ["OBL-016", "OBL-018"],
    color: "#a78bfa",
  },
  {
    key: "kfs_disclosure",
    label: "KFS & disclosure-in-conversation",
    obligationIds: ["OBL-014", "OBL-015", "OBL-017", "OBL-019"],
    color: "#60a5fa",
  },
  {
    key: "fraud_dispute",
    label: "Fraud-victim & dispute quality",
    obligationIds: ["OBL-012"],
    color: "#6366f1",
  },
  {
    key: "vendor_conduct",
    label: "Vendor BPO conduct",
    obligationIds: ["OBL-024", "OBL-025"],
    color: "#14b8a6",
  },
  {
    key: "language_routing",
    label: "Regional language routing",
    obligationIds: ["OBL-028", "OBL-029"],
    color: "#f97316",
  },
];

/** Deterministic channel cell for obligation group × channel. */
export function channelCell(
  group: ObligationGroupKey,
  channel: ChannelKey,
): {
  contacts: number;
  signals: number;
  status: "green" | "amber" | "red" | "grey";
} {
  const applicable: Record<ObligationGroupKey, ChannelKey[]> = {
    complaint_capture: [
      "inbound_voice",
      "outbound_voice",
      "chat",
      "email",
      "tickets",
      "social",
    ],
    recovery_conduct: ["outbound_voice", "inbound_voice"],
    borrower_distress: ["outbound_voice", "inbound_voice", "chat"],
    cross_sell_consent: ["outbound_voice", "inbound_voice", "chat"],
    kfs_disclosure: ["outbound_voice", "chat", "email"],
    fraud_dispute: ["inbound_voice", "tickets", "email"],
    vendor_conduct: ["outbound_voice", "inbound_voice"],
    language_routing: ["inbound_voice", "outbound_voice", "chat"],
  };
  if (!applicable[group].includes(channel)) {
    return { contacts: 0, signals: 0, status: "grey" };
  }
  const seed =
    group.charCodeAt(0) * 17 +
    channel.charCodeAt(0) * 31 +
    channel.length * 13;
  const base =
    channel === "inbound_voice" || channel === "outbound_voice" ? 8200 : 2100;
  const contacts = base + (seed % 9000);
  const rate = 0.018 + (seed % 40) / 2000;
  const signals = Math.max(1, Math.floor(contacts * rate));
  const ratio = signals / contacts;
  const status =
    ratio > 0.035 ? "red" : ratio > 0.022 ? "amber" : "green";
  return { contacts, signals, status };
}

export const CONTACT_REASONS_RICH = [
  {
    reason: "Complaint not logged to CMS",
    volume: 2140,
    obligations: ["OBL-001", "OBL-002"],
    topChannel: "Voice / Chat",
    topSignal: "Complaint marker · no SR match",
    owner: "Head of CX",
    risk: "HIGH" as const,
  },
  {
    reason: "Recovery pressure / threat language",
    volume: 1842,
    obligations: ["OBL-005", "OBL-008"],
    topChannel: "Outbound voice",
    topSignal: "Threat or shaming classifier",
    owner: "Head of Risk / Compliance",
    risk: "CRITICAL" as const,
  },
  {
    reason: "Fraud refund / liability confusion",
    volume: 1480,
    obligations: ["OBL-012"],
    topChannel: "Voice / Tickets",
    topSignal: "Low empathy · weak-auth refusal phrasing",
    owner: "Head of Customer",
    risk: "HIGH" as const,
  },
  {
    reason: "Bundling pressure on salary account",
    volume: 1220,
    obligations: ["OBL-018", "OBL-016"],
    topChannel: "Outbound voice",
    topSignal: "Mandatory bundling script",
    owner: "Head of Marketing",
    risk: "HIGH" as const,
  },
  {
    reason: "Language mismatch routing",
    volume: 1048,
    obligations: ["OBL-029", "OBL-028"],
    topChannel: "Voice / Chat",
    topSignal: "Regional customer → English-only agent",
    owner: "Head of CX",
    risk: "MEDIUM" as const,
  },
  {
    reason: "KFS / cooling-off not read",
    volume: 684,
    obligations: ["OBL-014", "OBL-015"],
    topChannel: "Outbound voice / Chat",
    topSignal: "KFS read-out missing",
    owner: "Head of Product / Digital",
    risk: "MEDIUM" as const,
  },
  {
    reason: "Repeat same-issue contact",
    volume: 1964,
    obligations: ["OBL-030", "OBL-031"],
    topChannel: "Inbound voice",
    topSignal: "Unresolved at close · 14d repeat cluster",
    owner: "Head of CX",
    risk: "HIGH" as const,
  },
  {
    reason: "Bereavement / empathy failure",
    volume: 412,
    obligations: ["OBL-011", "OBL-027"],
    topChannel: "Inbound voice",
    topSignal: "Distress cue · no specialist routing",
    owner: "Head of Customer",
    risk: "HIGH" as const,
  },
] as const;

export const CONTACT_TYPE_COVERAGE = [
  {
    type: "Inbound service calls",
    contacts: 84210,
    obligations: 18,
    signals: 612,
    status: "WATCH" as const,
  },
  {
    type: "Complaint calls",
    contacts: 28420,
    obligations: 6,
    signals: 418,
    status: "BREACH" as const,
  },
  {
    type: "Outbound sales calls",
    contacts: 42180,
    obligations: 8,
    signals: 286,
    status: "WATCH" as const,
  },
  {
    type: "Outbound recovery calls",
    contacts: 31840,
    obligations: 7,
    signals: 412,
    status: "BREACH" as const,
  },
  {
    type: "Feedback calls",
    contacts: 12480,
    obligations: 4,
    signals: 48,
    status: "MEETING" as const,
  },
  {
    type: "Fraud dispute calls",
    contacts: 18620,
    obligations: 3,
    signals: 198,
    status: "BREACH" as const,
  },
  {
    type: "Bereavement / vulnerable",
    contacts: 8420,
    obligations: 5,
    signals: 124,
    status: "WATCH" as const,
  },
  {
    type: "Vendor / BPO handled",
    contacts: 88048,
    obligations: 12,
    signals: 908,
    status: "BREACH" as const,
  },
] as const;

export const SENSITIVE_WIDGETS = [
  {
    label: "Missed complaints",
    count: 312,
    trend: "+18%",
    obligationId: "OBL-001",
    owner: "Head of CX",
    channel: "Voice / Chat",
    color: "#ef4444",
  },
  {
    label: "Recovery threats",
    count: 87,
    trend: "-6%",
    obligationId: "OBL-005",
    owner: "Head of Risk / Compliance",
    channel: "Outbound voice",
    color: "#f59e0b",
  },
  {
    label: "Borrower distress ignored",
    count: 64,
    trend: "+4%",
    obligationId: "OBL-008",
    owner: "Head of Risk / Compliance",
    channel: "Outbound voice",
    color: "#eab308",
  },
  {
    label: "Fraud dispute confusion",
    count: 142,
    trend: "+11%",
    obligationId: "OBL-012",
    owner: "Head of Customer",
    channel: "Voice / Tickets",
    color: "#6366f1",
  },
  {
    label: "Bereavement empathy failure",
    count: 38,
    trend: "-2%",
    obligationId: "OBL-011",
    owner: "Head of Customer",
    channel: "Inbound voice",
    color: "#38bdf8",
  },
  {
    label: "Language mismatch",
    count: 91,
    trend: "Stable",
    obligationId: "OBL-029",
    owner: "Head of CX",
    channel: "Voice / Chat",
    color: "#f97316",
  },
  {
    label: "Bundling pressure",
    count: 264,
    trend: "+22%",
    obligationId: "OBL-018",
    owner: "Head of Marketing",
    channel: "Outbound voice",
    color: "#a78bfa",
  },
  {
    label: "Vendor conduct risk",
    count: 197,
    trend: "+9%",
    obligationId: "OBL-024",
    owner: "Head of Risk / Compliance",
    channel: "BPO sites",
    color: "#14b8a6",
  },
] as const;

/** Top controls for Process · Control Coverage panel (from register). */
export function topControlsByProcess(
  controls: readonly RegisterControl[] = FLUID_ALONE_CONTROLS,
  limit = 12,
): RegisterControl[] {
  const seen = new Set<string>();
  const out: RegisterControl[] = [];
  for (const c of controls) {
    const key = `${c.process}-${c.obligationId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}

export function mainGapForObligation(oblId: string): string {
  const gaps: Record<string, string> = {
    "OBL-001": "Complaint expressed · no CMS SR match",
    "OBL-002": "SR offer missing in first 90 seconds",
    "OBL-003": "Complaint tagged to wrong grievance category",
    "OBL-004": "Nodal / escalation contact not shared when requested",
    "OBL-005": "Threat / shaming language on recovery",
    "OBL-006": "Recovery calls outside permitted hours (08:00–19:00)",
    "OBL-007": "Agent ID / bank / purpose missing at recovery call open",
    "OBL-008": "Hardship pathway not offered after borrower distress cue",
    "OBL-011": "Empathy language below threshold on bereavement calls",
    "OBL-012": "Priority action missing on fraud-victim queue",
    "OBL-014": "KFS read-out not detected on sales calls",
    "OBL-015": "Cooling-off period not mentioned at point of sale",
    "OBL-016": "Suitability / needs check missing before product pitch",
    "OBL-017": "Pre-payment / foreclosure terms not disclosed when asked",
    "OBL-018": "Compulsory bundling / pressure phrasing detected",
    "OBL-019": "Penal charges phrased as penal interest",
    "OBL-024": "Vendor conduct parity below in-house benchmark",
    "OBL-025": "Vendor script adherence below expected standard",
    "OBL-026": "Campaign script deviation detected in outbound calls",
    "OBL-027": "Vulnerable customer left on general queue after detection",
    "OBL-028": "Regional language offer missing at contact open",
    "OBL-029": "Language mismatch detected; delayed re-routing",
    "OBL-030": "Repeat same-issue contact cluster detected",
    "OBL-031": "Unresolved-at-close cue detected",
  };
  if (gaps[oblId]) return gaps[oblId];
  const control = FLUID_ALONE_CONTROLS.find((c) => c.obligationId === oblId);
  return control?.detectionSignal ?? "Conduct gap detected in monitored conversations";
}

export const OUTBOUND_LOCATIONS = [
  {
    id: "LOC-CHN",
    name: "Chennai In-house CC",
    city: "Chennai",
    type: "IN_SOURCE" as const,
    vendor: null,
    calls: 42180,
    purpose: "Sales",
    obligations: 14,
    breaches: 42,
    missingData: 0,
    riskScore: 38,
    topIssue: "KFS read-out gap",
  },
  {
    id: "LOC-PUN-BPO",
    name: "Pune Recovery BPO",
    city: "Pune",
    type: "OUTSOURCE" as const,
    vendor: "Pinnacle Recovery",
    calls: 31840,
    purpose: "Recovery",
    obligations: 9,
    breaches: 87,
    missingData: 2,
    riskScore: 78,
    topIssue: "Threat language + non-borrower contact",
  },
  {
    id: "LOC-MUM",
    name: "Mumbai In-house CC",
    city: "Mumbai",
    type: "IN_SOURCE" as const,
    vendor: null,
    calls: 28420,
    purpose: "Mixed",
    obligations: 16,
    breaches: 31,
    missingData: 1,
    riskScore: 44,
    topIssue: "First-90s SR offer gap",
  },
  {
    id: "LOC-HYD-BPO",
    name: "Hyderabad Sales BPO",
    city: "Hyderabad",
    type: "OUTSOURCE" as const,
    vendor: "Helios BPO",
    calls: 24100,
    purpose: "Sales",
    obligations: 11,
    breaches: 54,
    missingData: 3,
    riskScore: 62,
    topIssue: "Mandatory bundling script",
  },
  {
    id: "LOC-BLR",
    name: "Bengaluru In-house CC",
    city: "Bengaluru",
    type: "IN_SOURCE" as const,
    vendor: null,
    calls: 19840,
    purpose: "Feedback",
    obligations: 8,
    breaches: 12,
    missingData: 0,
    riskScore: 28,
    topIssue: "Campaign script deviation",
  },
  {
    id: "LOC-KOL-BPO",
    name: "Kolkata Language BPO",
    city: "Kolkata",
    type: "OUTSOURCE" as const,
    vendor: "Sutherland East",
    calls: 16420,
    purpose: "Service",
    obligations: 12,
    breaches: 28,
    missingData: 4,
    riskScore: 55,
    topIssue: "Regional language mismatch / missing recording",
  },
] as const;

export const OUTBOUND_PURPOSE_STATS = [
  {
    purpose: "Sales",
    calls: 66280,
    obligations: 12,
    breaches: 186,
    passRate: 74,
    topIssue: "Bundling pressure + KFS read-out missing",
    color: "#a78bfa",
  },
  {
    purpose: "Feedback",
    calls: 12480,
    obligations: 4,
    breaches: 18,
    passRate: 91,
    topIssue: "Campaign script deviation",
    color: "#14b8a6",
  },
  {
    purpose: "Recovery",
    calls: 31840,
    obligations: 9,
    breaches: 142,
    passRate: 68,
    topIssue: "Threat language + non-borrower contact",
    color: "#f59e0b",
  },
] as const;

/** Top obligations monitored per outbound purpose — met % for bar chart. */
export const OUTBOUND_OBLIGATION_MET_BY_PURPOSE = [
  {
    purpose: "Sales",
    obligations: [
      { id: "OBL-014", metPct: 67 },
      { id: "OBL-018", metPct: 74 },
      { id: "OBL-016", metPct: 73 },
      { id: "OBL-015", metPct: 75 },
    ],
  },
  {
    purpose: "Recovery",
    obligations: [
      { id: "OBL-005", metPct: 82 },
      { id: "OBL-006", metPct: 97 },
      { id: "OBL-007", metPct: 88 },
      { id: "OBL-008", metPct: 74 },
    ],
  },
  {
    purpose: "Feedback",
    obligations: [
      { id: "OBL-026", metPct: 70 },
      { id: "OBL-028", metPct: 79 },
      { id: "OBL-031", metPct: 78 },
      { id: "OBL-030", metPct: 84 },
    ],
  },
] as const;

export const OUTBOUND_VIOLATIONS = [
  {
    ts: "2026-05-25T09:14:00",
    location: "Pune Recovery BPO",
    purpose: "Recovery",
    obligationId: "OBL-005",
    signal: "Agent dialled spouse number before borrower",
    severity: "CRITICAL" as const,
  },
  {
    ts: "2026-05-25T08:42:00",
    location: "Hyderabad Sales BPO",
    purpose: "Sales",
    obligationId: "OBL-018",
    signal: "Mandatory Health Insurance bundling script",
    severity: "HIGH" as const,
  },
  {
    ts: "2026-05-24T16:28:00",
    location: "Chennai In-house CC",
    purpose: "Sales",
    obligationId: "OBL-014",
    signal: "KFS not read on personal loan sale",
    severity: "HIGH" as const,
  },
  {
    ts: "2026-05-24T14:05:00",
    location: "Pune Recovery BPO",
    purpose: "Recovery",
    obligationId: "OBL-008",
    signal: "Distress cue ignored; no hardship offer",
    severity: "HIGH" as const,
  },
  {
    ts: "2026-05-24T11:18:00",
    location: "Kolkata Language BPO",
    purpose: "Service",
    obligationId: "OBL-029",
    signal: "Marathi customer held 6 min on English queue",
    severity: "MEDIUM" as const,
  },
] as const;
