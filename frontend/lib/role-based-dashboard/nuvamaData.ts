/**
 * LiSN / Fluid CX · Nuvama — CONVERSATION-ONLY mock universe + seeded signals (Stages 9A/9B).
 * Drop-in replacement for nuvamaData.ts.
 *
 * HARD RULE: NO book/transaction data anywhere — no AUM, NNM, flows, redemptions, holdings,
 * proposal-funding, revenue, or ₹ impact. Every figure derives from the interaction corpus
 * (calls, WhatsApp, service, app, email, complaints, NPS/CSAT). Impact is expressed in
 * conversation terms (clients, interactions, promises, missing disclosures), never rupees.
 * All figures illustrative.
 */

export type NuvamaLens = "wealth" | "cx" | "risk";
export type Severity = "high" | "med" | "low";
export type Confidence = "High" | "Med" | "Low";
export type ComparisonWindow = "WoW" | "MoM";

export type ConvCard = "ATTRITION" | "PROMISE" | "COMPLAINT" | "NPS" | "SUITABILITY";

export type NuvamaCohort = {
  id: string;
  label: string;
  segment: string;
  region: string;
  channel: string;
  tenure: string;
  clientCount: number;
  interactionCount: number; // monthly, conversation-only
};

export type NuvamaSignal = {
  id: string;
  card: ConvCard;
  title: string;
  severity: Severity;
  confidence: Confidence;
  cohortId?: string;
  cellId?: string;
  region?: string;
  branch?: string;
  impactLabel: string; // conversation terms
  impactValue: string; // conversation terms — never ₹
  owner: string;
  honestyLine: string;
  explainability: string;
  recommendedAction: string;
  timeOnset: string;
  stats: { label: string; baseline: string; actual: string }[];
  makerChecker?: boolean;
};

export type EvidencePack = {
  interactionSnippets: { theme: string; excerpt: string }[];
  engagementDelta: { label: string; value: string }[]; // conversation-only (replaces bookDelta)
  ruledOut: string[];
  confidence: Confidence;
  recommendedAction: string;
  promiseStats?: { made: number; kept: number; broken: number; overdue: number };
  nps?: { score: number; baseline: number; themes: string[]; atrDueDays: number };
};

export type SuitabilityItem = {
  id: string;
  signalId: string;
  cohortId: string;
  title: string;
  severity: Severity;
  missingRatePer1000: number; // conversation-only (replaces aumCr)
  missingLanguageEvidence: string;
  disclosureContext: string; // conversation-framed (replaces riskBandMismatch)
  ruledOut: string[];
  status: "pending" | "accepted" | "returned";
};

export type HeatmapCell = {
  id: string;
  branch: string;
  theme: string;
  complaintRate: number;
  baselineRate: number;
  escalationRate: number; // % escalated (conversation-only; replaces aumAtRiskCr)
  atrDueDays: number;
  severity: Severity;
};

export type ServicePromiseRow = {
  branch: string;
  made: number;
  kept: number;
  broken: number;
  overdue: number;
};

export type NpsThemeCluster = {
  id: string;
  label: string;
  cohortIds: string[];
  sampleVerbatim: string;
};

export type PromiseLedgerEntry = {
  id: string;
  cohortId: string;
  promiseType: "callback" | "document" | "resolution";
  sourceInteraction: string;
  followUpInteraction: string;
  status: "kept" | "broken" | "overdue";
};

export type AuditEvent = {
  id: string;
  action: string;
  target: string;
  status: "draft" | "accepted";
  by?: string;
  at?: string;
};

export const NUAMA_EXPLAINABILITY: Record<string, string> = {
  "SIG-001":
    "Flagged because this cohort's call and chat language shifted from growth to liquidity/anxiety over the last 6 weeks and engagement fell — 47 clients now using exit language, up from 6. Market-wide and seasonal moves ruled out. From conversation only; no book data used.",
  "SIG-003":
    "Promises made on calls in this branch — callbacks and statements — are not being referenced as completed in later conversations: 12 overdue and 9 broken versus an ~88% adherence baseline.",
  "SIG-004":
    "Surfaced for review because advisory calls in this cohort lack mandated risk/disclosure language — about 8 per 1,000 versus ~0 baseline. Prioritised for human adjudication, not an AI verdict; documented exceptions ruled out.",
  "SIG-005":
    "Segment NPS moved to 78 from ~85, traced to a delayed-reporting + performance-concern theme cluster in South branches; SCORES ATR due in 9 days.",
};

export const NUAMA_COHORTS: NuvamaCohort[] = [
  { id: "CH-01", label: "West · Core HNI · RM-direct", segment: "Core HNI", region: "West", channel: "RM-direct", tenure: "3–7y", clientCount: 480, interactionCount: 1200 },
  { id: "CH-02", label: "West · Senior HNI · RM-direct", segment: "Senior HNI", region: "West", channel: "RM-direct", tenure: "7y+", clientCount: 210, interactionCount: 720 },
  { id: "CH-03", label: "West · Emerging HNI · Digital+RM", segment: "Emerging HNI", region: "West", channel: "Digital+RM", tenure: "<3y", clientCount: 760, interactionCount: 1400 },
  { id: "CH-04", label: "North · Core HNI · RM-direct", segment: "Core HNI", region: "North", channel: "RM-direct", tenure: "3–7y", clientCount: 430, interactionCount: 1050 },
  { id: "CH-05", label: "North · Senior HNI · RM-direct", segment: "Senior HNI", region: "North", channel: "RM-direct", tenure: "7y+", clientCount: 160, interactionCount: 560 },
  { id: "CH-06", label: "North · Core HNI · EWM", segment: "Core HNI", region: "North", channel: "EWM", tenure: "3–7y", clientCount: 540, interactionCount: 760 },
  { id: "CH-07", label: "South · Core HNI · RM-direct", segment: "Core HNI", region: "South", channel: "RM-direct", tenure: "3–7y", clientCount: 510, interactionCount: 1300 },
  { id: "CH-08", label: "South · Senior HNI · RM-direct", segment: "Senior HNI", region: "South", channel: "RM-direct", tenure: "7y+", clientCount: 190, interactionCount: 640 },
  { id: "CH-09", label: "South · Emerging HNI · Digital+RM", segment: "Emerging HNI", region: "South", channel: "Digital+RM", tenure: "<3y", clientCount: 820, interactionCount: 1500 },
  { id: "CH-10", label: "East · Core HNI · RM-direct", segment: "Core HNI", region: "East", channel: "RM-direct", tenure: "3–7y", clientCount: 300, interactionCount: 820 },
  { id: "CH-11", label: "East · Core HNI · EWM", segment: "Core HNI", region: "East", channel: "EWM", tenure: "3–7y", clientCount: 360, interactionCount: 540 },
  { id: "CH-12", label: "West · Senior HNI · RM-direct", segment: "Senior HNI", region: "West", channel: "RM-direct", tenure: "7y+", clientCount: 140, interactionCount: 470 },
];

export const NUAMA_SIGNALS: NuvamaSignal[] = [
  {
    id: "SIG-001",
    card: "ATTRITION",
    title: "Attrition-risk language — South Core HNI",
    severity: "high",
    confidence: "High",
    cohortId: "CH-07",
    impactLabel: "Clients using exit language",
    impactValue: "47 (was 6)",
    owner: "Market Head (South)",
    honestyLine: "from conversation only — an early-warning signal, not a confirmed redemption; no book data used",
    explainability: NUAMA_EXPLAINABILITY["SIG-001"],
    recommendedAction: "Route cohort to Market Head",
    timeOnset: "~6 weeks ago",
    stats: [
      { label: "Exit-language clients", baseline: "~6 (p50)", actual: "47" },
      { label: "Repeat-contact rate", baseline: "8% p50", actual: "19%" },
      { label: "Talk-listen ratio", baseline: "0.9 p50", actual: "1.6 (RM talking more)" },
    ],
  },
  {
    id: "SIG-002",
    card: "ATTRITION",
    title: "Attrition-risk language — North Core HNI · EWM",
    severity: "med",
    confidence: "Med",
    cohortId: "CH-06",
    impactLabel: "Clients using exit language",
    impactValue: "~14 (advisory)",
    owner: "EWM lead / North Market Head",
    honestyLine: "EWM partner-voice partial — treat as advisory; conversation-only",
    explainability:
      "Mild rise in liquidity/anxiety language with reduced engagement; EWM-intermediated channel has partial voice coverage, so confidence is lower.",
    recommendedAction: "Route to EWM lead (draft)",
    timeOnset: "~3 weeks ago",
    stats: [
      { label: "Exit-language clients", baseline: "~5 (p50)", actual: "~14" },
      { label: "Repeat-contact rate", baseline: "7% p50", actual: "11%" },
      { label: "Voice coverage", baseline: "92% RM-direct", actual: "partial EWM" },
    ],
  },
  {
    id: "SIG-003",
    card: "PROMISE",
    title: "Service-promise breaks — Bengaluru (BR-S1)",
    severity: "high",
    confidence: "High",
    cohortId: "CH-07",
    branch: "BR-S1 Bengaluru",
    impactLabel: "Promises overdue / broken",
    impactValue: "12 / 9",
    owner: "Branch / Service owner",
    honestyLine: "from what was committed and later referenced on calls",
    explainability: NUAMA_EXPLAINABILITY["SIG-003"],
    recommendedAction: "Route to branch / service owner (draft)",
    timeOnset: "This week",
    stats: [
      { label: "Adherence", baseline: "~88% kept", actual: "84% kept" },
      { label: "Overdue", baseline: "low", actual: "12" },
      { label: "Broken", baseline: "low", actual: "9" },
    ],
  },
  {
    id: "SIG-004",
    card: "SUITABILITY",
    title: "Suitability-language gap — South advisory",
    severity: "high",
    confidence: "High",
    cohortId: "CH-07",
    impactLabel: "Advisory calls missing disclosure",
    impactValue: "8 / 1,000",
    owner: "CRO / Compliance",
    honestyLine: "detects whether the mandated disclosure was said; does not assess the client's holdings — conversation-only",
    explainability: NUAMA_EXPLAINABILITY["SIG-004"],
    recommendedAction: "Route to CRO worklist (maker-checker)",
    timeOnset: "Surfaced from attrition flow",
    makerChecker: true,
    stats: [
      { label: "Missing-disclosure rate", baseline: "0–1 / 1,000", actual: "~8 / 1,000" },
      { label: "Product discussed", baseline: "—", actual: "AIF / PMS" },
      { label: "Documented exception", baseline: "expected", actual: "none on call" },
    ],
  },
  {
    id: "SIG-005",
    card: "NPS",
    title: "NPS drag — South delayed reporting + performance concern",
    severity: "med",
    confidence: "High",
    region: "South",
    impactLabel: "NPS delta",
    impactValue: "−7 pts",
    owner: "CX",
    honestyLine: "score from survey; root cause from conversation themes",
    explainability: NUAMA_EXPLAINABILITY["SIG-005"],
    recommendedAction: "Route theme to CX owner (draft)",
    timeOnset: "This week vs last",
    stats: [
      { label: "Segment NPS", baseline: "~85", actual: "78" },
      { label: "Themes", baseline: "—", actual: "2 clusters" },
      { label: "SCORES ATR", baseline: "21 days", actual: "due in 9 days" },
    ],
  },
  {
    id: "SIG-006",
    card: "COMPLAINT",
    title: "Complaint heat — Bengaluru × delayed reporting",
    severity: "med",
    confidence: "High",
    cellId: "CELL-BRS1-DELREP",
    impactLabel: "Complaint cell",
    impactValue: "above baseline; ATR 9d",
    owner: "CX / Ops",
    honestyLine: "complaint rate vs branch×theme baseline",
    explainability: "Cell complaint rate is above its BURSTY baseline with escalation rising; concentrated in South cohorts.",
    recommendedAction: "Route by cell to CX / ops process owner",
    timeOnset: "This week",
    stats: [
      { label: "Complaint rate", baseline: "2.1% baseline", actual: "4.2%" },
      { label: "Branch", baseline: "—", actual: "BR-S1 Bengaluru" },
      { label: "Theme", baseline: "—", actual: "Delayed reporting" },
    ],
  },
];

export const NUAMA_EVIDENCE: Record<string, EvidencePack> = {
  "SIG-001": {
    interactionSnippets: [
      { theme: "Liquidity & capital protection", excerpt: "Cohort review calls shifted from growth goals to liquidity and capital-protection language over six weeks." },
      { theme: "Access & deposit migration", excerpt: "Repeated 'can I access funds / move to deposits' queries on calls and WhatsApp; talk-listen ratio rose — RMs talking more, listening less." },
      { theme: "Intent shift", excerpt: "Growth-to-anxiety language ratio breached the cohort's DENSE p95 band." },
    ],
    engagementDelta: [
      { label: "Exit-language prevalence", value: "~9% of clients (was ~1.2%)" },
      { label: "Repeat-contact rate", value: "19% (was 8%)" },
      { label: "Talk-listen ratio", value: "1.6 (RM talking more)" },
    ],
    ruledOut: [
      "Peer cohorts CH-01 (West) and CH-04 (North) stable — not market-wide",
      "No market-event window active",
      "Not a seasonal pattern for this cohort",
    ],
    confidence: "High",
    recommendedAction: "Route to Market Head (South) — Sandeep Chakraborti",
  },
  "SIG-003": {
    interactionSnippets: [
      { theme: "Callbacks committed", excerpt: "RMs committed to callbacks and statement dispatch on calls; later conversations show these were not completed." },
      { theme: "Repeat chase", excerpt: "Clients re-contacting on the same unmet request — a repeat-contact signal tied to broken promises." },
    ],
    engagementDelta: [
      { label: "Promise adherence", value: "84% kept (was ~88%)" },
      { label: "Overdue", value: "12 promises" },
      { label: "Broken", value: "9 promises" },
    ],
    ruledOut: ["Not a volume spike week", "Not concentrated in one RM only"],
    confidence: "High",
    recommendedAction: "Route to branch / service owner (draft)",
    promiseStats: { made: 142, kept: 121, broken: 9, overdue: 12 },
  },
  "SIG-004": {
    interactionSnippets: [
      { theme: "Missing disclosure language", excerpt: "About 8 advisory calls per 1,000 in this cohort lack the mandated risk/disclosure language for the product discussed." },
      { theme: "No documented exception", excerpt: "No documented suitability exception referenced on the call." },
    ],
    engagementDelta: [
      { label: "Missing-disclosure rate", value: "~8 / 1,000 (was ~0–1)" },
      { label: "Product discussed", value: "AIF / PMS" },
      { label: "Concentration", value: "Elevated in CH-07 / CH-08 advisory calls" },
    ],
    ruledOut: ["No documented suitability exception on the call", "Not a sophisticated-investor declaration on record"],
    confidence: "High",
    recommendedAction: "Route to CRO / Compliance worklist — maker-checker required",
  },
  "SIG-005": {
    interactionSnippets: [
      { theme: "Delayed reporting", excerpt: "Theme cluster in South branches — statement and reporting timeliness raised repeatedly on calls." },
      { theme: "Performance concern", excerpt: "Performance-concern verbatims rising in the same cohorts." },
    ],
    engagementDelta: [
      { label: "Segment NPS", value: "78 vs ~85 baseline" },
      { label: "Complaint escalation", value: "rising in South" },
      { label: "SCORES ATR", value: "due in 9 days" },
    ],
    ruledOut: ["West/North NPS within band", "No survey-method change this cycle"],
    confidence: "High",
    recommendedAction: "Route theme to CX owner / business head (draft)",
    nps: { score: 78, baseline: 85, themes: ["delayed reporting", "performance concern"], atrDueDays: 9 },
  },
};

export const NUAMA_SUITABILITY_ITEMS: SuitabilityItem[] = [
  {
    id: "RISK-001",
    signalId: "SIG-004",
    cohortId: "CH-07",
    title: "Missing disclosure language — AIF discussion",
    severity: "high",
    missingRatePer1000: 8,
    missingLanguageEvidence: "8/1,000 advisory calls lack mandated risk/disclosure language (O-3 detection).",
    disclosureContext: "High-risk product (AIF) discussed without the mandated risk/disclosure language on the call.",
    ruledOut: ["No documented exception on the call", "No sophisticated-investor declaration on record"],
    status: "pending",
  },
  {
    id: "RISK-002",
    signalId: "SIG-004",
    cohortId: "CH-08",
    title: "PMS discussion without disclosure articulation",
    severity: "high",
    missingRatePer1000: 5,
    missingLanguageEvidence: "Pitch calls for this Senior-HNI cohort lack suitability articulation.",
    disclosureContext: "PMS (high-risk) discussed without disclosure articulation — concentration elevated.",
    ruledOut: ["No documented exception", "Not a market-timing caveat on the call"],
    status: "pending",
  },
];

export const NUAMA_HEATMAP: HeatmapCell[] = [
  { id: "CELL-BRS1-DELREP", branch: "BR-S1 Bengaluru", theme: "Delayed reporting", complaintRate: 4.2, baselineRate: 2.1, escalationRate: 18, atrDueDays: 9, severity: "high" },
  { id: "CELL-BRS2-PERF", branch: "BR-S2 Chennai", theme: "Performance concern", complaintRate: 3.1, baselineRate: 2.4, escalationRate: 11, atrDueDays: 15, severity: "med" },
  { id: "CELL-BRN1-FEE", branch: "BR-N1 Delhi", theme: "Fee/charges clarity", complaintRate: 2.8, baselineRate: 2.5, escalationRate: 7, atrDueDays: 17, severity: "low" },
  { id: "CELL-BRW1-SVC", branch: "BR-W1 Mumbai", theme: "Service responsiveness", complaintRate: 2.6, baselineRate: 2.3, escalationRate: 6, atrDueDays: 19, severity: "low" },
];

export const NUAMA_SERVICE_PROMISES: ServicePromiseRow[] = [
  { branch: "BR-S1 Bengaluru", made: 142, kept: 121, broken: 9, overdue: 12 },
  { branch: "BR-S2 Chennai", made: 118, kept: 109, broken: 4, overdue: 5 },
  { branch: "BR-N1 Delhi", made: 134, kept: 126, broken: 3, overdue: 5 },
  { branch: "BR-W1 Mumbai", made: 156, kept: 148, broken: 3, overdue: 5 },
];

/** Stage 10 — NPS theme clusters (route by themeId). All illustrative. */
export const NUAMA_NPS_THEMES: NpsThemeCluster[] = [
  {
    id: "THEME-DELREP",
    label: "Delayed reporting",
    cohortIds: ["CH-07", "CH-08", "CH-09"],
    sampleVerbatim:
      "Statement and reporting timeliness raised repeatedly on calls in South branches — tied to CELL-BRS1-DELREP complaint heat.",
  },
  {
    id: "THEME-PERF",
    label: "Performance concern",
    cohortIds: ["CH-08"],
    sampleVerbatim: "Performance-concern verbatims rising in Senior-HNI South cohorts on review calls.",
  },
];

/** Stage 10 — promise ledger for /promises/:cohortId drill. All illustrative. */
export const NUAMA_PROMISE_LEDGER: PromiseLedgerEntry[] = [
  {
    id: "PROM-001",
    cohortId: "CH-07",
    promiseType: "callback",
    sourceInteraction: "RM committed to callback within 24 hours on recorded advisory call.",
    followUpInteraction: "Client re-contacted five days later — no reference to a completed callback.",
    status: "overdue",
  },
  {
    id: "PROM-002",
    cohortId: "CH-07",
    promiseType: "document",
    sourceInteraction: "Statement dispatch promised by end of week on service call.",
    followUpInteraction: "Later WhatsApp thread shows client still chasing the same statement.",
    status: "broken",
  },
  {
    id: "PROM-003",
    cohortId: "CH-07",
    promiseType: "resolution",
    sourceInteraction: "Resolution on fee query committed within 48 hours.",
    followUpInteraction: "Follow-up call references fee issue as still open.",
    status: "broken",
  },
  {
    id: "PROM-004",
    cohortId: "CH-07",
    promiseType: "callback",
    sourceInteraction: "RM scheduled portfolio review callback.",
    followUpInteraction: "Subsequent call opens with completed review — promise kept.",
    status: "kept",
  },
];

// Conversation-only executive KPIs (no book figures).
export const NUAMA_KPI_STRIP = {
  nps: { value: "85", delta: "−1 WoW", tag: "north-star" as const },
  complaintEscalation: { value: "6.4%", delta: "+1.2 pts WoW", tag: "diagnostic" as const },
  promiseAdherence: { value: "88%", delta: "−3 pts WoW", tag: "north-star" as const },
};

export const NUAMA_EXECUTIVE_BRIEF =
  "South Core-HNI is the signal to act on this week — 47 clients are using exit and liquidity language on calls, up from 6, six weeks before anything would show in the book. Peer West/North cohorts are stable, so this is cohort-specific, not market-wide.";

export const NUAMA_EXECUTIVE_PULSE = [
  { label: "What's critical", main: "47 South Core-HNI clients using exit/liquidity language — up from 6; engagement falling", tone: "critical" as const },
  { label: "Where to focus", main: "Bengaluru service promises: 12 overdue, 9 broken vs an ~88% baseline", tone: "focus" as const },
  { label: "What's stable", main: "West/North peer cohorts steady — no market-wide tone shift this week", tone: "stable" as const },
];

export const NUAMA_AI_PROMPTS = [
  "Which cohorts are showing exit/attrition language this week, and what did clients say?",
  "Where are service promises being broken or running overdue?",
  "What suitability-language gaps surfaced from the South cohorts?",
  "Summarise the South NPS drag and SCORES ATR exposure.",
  "Which peer cohorts ruled out a market-wide tone shift for CH-07?",
];

export function cohortById(id: string): NuvamaCohort | undefined {
  return NUAMA_COHORTS.find((c) => c.id === id);
}

export function signalById(id: string): NuvamaSignal | undefined {
  return NUAMA_SIGNALS.find((s) => s.id === id);
}

export function npsThemeById(id: string): NpsThemeCluster | undefined {
  return NUAMA_NPS_THEMES.find((t) => t.id === id);
}

export function attritionSignalForCohort(cohortId: string): NuvamaSignal | undefined {
  return NUAMA_SIGNALS.find((s) => s.card === "ATTRITION" && s.cohortId === cohortId);
}

export function generateNuvamaAIResponse(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("exit") || l.includes("attrition") || l.includes("leak") || l.includes("cohort"))
    return "CH-07 (South Core HNI, RM-direct) is the signal to act on — 47 clients using exit/liquidity language on calls, up from 6, with repeat-contact at 19% and the RM talk-listen ratio rising. CH-06 (North, EWM) is secondary and advisory only (partial voice coverage). Peers CH-01 and CH-04 are stable, so it is cohort-specific. From conversation only — not a confirmed redemption.";
  if (l.includes("promise") || l.includes("callback") || l.includes("service"))
    return "Bengaluru (BR-S1): 12 promises overdue and 9 broken versus an ~88% adherence baseline — callbacks and statement dispatch committed on calls but not referenced as completed later. Route a draft to the branch/service owner.";
  if (l.includes("suitability") || l.includes("cro") || l.includes("disclosure") || l.includes("gap"))
    return "SIG-004 surfaced from the CH-07 attrition flow — about 8 advisory calls per 1,000 lack mandated risk/disclosure language for the product discussed, with no documented exception on the call. This is surveillance prioritisation for CRO maker-checker, not an AI verdict. It detects whether the disclosure was said; it does not read holdings.";
  if (l.includes("nps") || l.includes("scores") || l.includes("atr"))
    return "South segment NPS is 78 vs ~85 baseline. Delayed-reporting and performance-concern themes are driving it; SCORES ATR is due in 9 days on related complaints. Score is from the survey; root cause is from conversation themes.";
  if (l.includes("peer") || l.includes("ruled") || l.includes("market"))
    return "CH-01 (West) and CH-04 (North) language is within band — ruling out a market-wide tone shift. No active market-event window for CH-07.";
  if (l.includes("summar"))
    return "1) South attrition-risk language — 47 clients, route to Sandeep Chakraborti.\n2) Bengaluru service promises — 12 overdue / 9 broken.\n3) Suitability-language gap — ~8/1,000 advisory calls, route to CRO (maker-checker).\n4) South NPS drag — delayed reporting, ATR in 9 days.";
  return "✦ Ask about attrition-risk language, service promises, suitability-language gaps, or NPS themes — I distil the conversation insight store for these cohorts only. No book data is used.";
}
