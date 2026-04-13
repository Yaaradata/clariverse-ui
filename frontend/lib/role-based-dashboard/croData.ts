/**
 * CRO (Chief Risk Officer) persona-specific data — driven by Shridar meeting insights.
 *
 * Key themes from Shridar (CRO, UK):
 * 1. Financial Crime / AML is the easiest entry point for risk/compliance buyers
 * 2. Customer risk profiling from conversation data is extremely valuable
 * 3. FCA Consumer Duty + SMCR — becoming global regulations
 * 4. Vulnerable customer detection from conversation signals
 * 5. Two value props: (a) risk profile of customer, (b) is org doing right thing for customer
 * 6. Insurance claims (20k/day, 3-9 month resolution) — interaction data is gold
 * 7. Cross-jurisdictional compliance — highest jurisdiction controls apply everywhere
 */

// ═══════════════════════════
// SCREEN 1 — Executive Risk Cockpit KPIs
// ═══════════════════════════
export const CRO_EXEC_KPIS = {
  riskAppetite: { label: "Risk Appetite Score", value: "76", max: 100, status: "amber" as const, delta: -4, trend: [82, 80, 79, 78, 76] },
  consumerDuty: { label: "Consumer Duty Compliance", value: "82%", status: "amber" as const, delta: -3, trend: [88, 87, 85, 84, 82] },
  finCrimeIndex: { label: "Financial Crime Risk", value: "HIGH", status: "red" as const, numericValue: 72, trend: [55, 58, 62, 68, 72] },
  vulnerableDetection: { label: "Vulnerable Customer Detection", value: "94.2%", status: "green" as const, delta: +3.1, trend: [88, 89, 91, 92, 94.2] },
  openSars: { label: "Open SARs Pipeline", value: "47", status: "red" as const, delta: +12, breakdown: { detected: 23, underReview: 12, filed: 8, acknowledged: 4 } },
  regulatoryFindings: { label: "Regulatory Findings", value: "3", status: "amber" as const, delta: +1 },
  smcrBreaches: { label: "SMCR Breaches", value: "0", status: "green" as const, delta: 0 },
};

// ═══════════════════════════
// SCREEN 2 — Risk by LOB
// ═══════════════════════════
export const CRO_LOB_RISK_DATA: Record<string, {
  label: string;
  riskScore: number;
  customerRiskDistribution: { low: number; medium: number; high: number; critical: number };
  conversationRiskHeatmap: { day: string; hours: number[]; }[];
  kpis: { l: string; v: string; delta: number; target: string; st: "red" | "amber" | "green" }[];
  pressureInsights: string[];
}> = {
  retail_banking: {
    label: "Retail Banking",
    riskScore: 67,
    customerRiskDistribution: { low: 62, medium: 24, high: 11, critical: 3 },
    conversationRiskHeatmap: [
      { day: "Mon", hours: [2, 3, 5, 8, 7, 4, 3, 2] },
      { day: "Tue", hours: [1, 2, 4, 7, 8, 5, 3, 2] },
      { day: "Wed", hours: [2, 4, 6, 9, 8, 6, 4, 3] },
      { day: "Thu", hours: [1, 3, 5, 7, 6, 4, 3, 2] },
      { day: "Fri", hours: [3, 5, 7, 9, 8, 7, 5, 4] },
    ],
    kpis: [
      { l: "Fraud Detection Rate", v: "82%", delta: -3, target: "> 90%", st: "red" },
      { l: "Vulnerable Customer Flags", v: "234", delta: +28, target: "< 180", st: "red" },
      { l: "Consumer Duty Score", v: "82%", delta: -3, target: "> 90%", st: "amber" },
      { l: "SAR Filing Rate", v: "47", delta: +12, target: "< 30", st: "red" },
      { l: "AML Procedure Adherence", v: "87%", delta: +4, target: "> 95%", st: "amber" },
    ],
    pressureInsights: [
      "Insurance claims showing 3× frustration signals in week 4-8 resolution range — conversation data reveals adjuster communication gaps.",
      "Cards: 'fraud dispute' intent up 41% — correlates with new merchant category codes. Conversation-derived risk profiles flagging 23 new high-risk customers.",
      "Retail: vulnerable customer signals spike on mortgage renewal calls — 89 financial distress indicators detected this week.",
    ],
  },
  cards_business: {
    label: "Cards Business",
    riskScore: 58,
    customerRiskDistribution: { low: 54, medium: 28, high: 14, critical: 4 },
    conversationRiskHeatmap: [
      { day: "Mon", hours: [3, 4, 6, 9, 8, 5, 4, 3] },
      { day: "Tue", hours: [2, 3, 5, 8, 9, 6, 4, 3] },
      { day: "Wed", hours: [4, 5, 7, 10, 9, 7, 5, 4] },
      { day: "Thu", hours: [2, 4, 6, 8, 7, 5, 4, 3] },
      { day: "Fri", hours: [4, 6, 8, 10, 9, 8, 6, 5] },
    ],
    kpis: [
      { l: "CNP Fraud Rate", v: "3.8%", delta: +1.2, target: "< 2%", st: "red" },
      { l: "Social Engineering Calls", v: "23", delta: +8, target: "< 10", st: "red" },
      { l: "ATO Attempts", v: "89", delta: +34, target: "< 50", st: "red" },
      { l: "Dispute-to-Fraud Ratio", v: "18%", delta: +4, target: "< 12%", st: "amber" },
      { l: "Merchant Breach Exposure", v: "1,247", delta: +389, target: "< 500", st: "red" },
    ],
    pressureInsights: [
      "FL fraud cluster — 23 calls match social engineering script targeting seniors. 4 ATO succeeded before detection.",
      "MCC 7995 (gaming) driving 40% of new disputes — conversation analysis reveals common script patterns.",
      "Card testing patterns detected on 89 cards — conversation-derived risk profiles correlating with transaction anomalies.",
    ],
  },
  insurance: {
    label: "Insurance",
    riskScore: 61,
    customerRiskDistribution: { low: 58, medium: 26, high: 12, critical: 4 },
    conversationRiskHeatmap: [
      { day: "Mon", hours: [2, 3, 4, 7, 6, 4, 3, 2] },
      { day: "Tue", hours: [1, 2, 5, 8, 7, 5, 3, 2] },
      { day: "Wed", hours: [3, 4, 6, 9, 8, 6, 4, 3] },
      { day: "Thu", hours: [2, 3, 5, 7, 6, 4, 3, 2] },
      { day: "Fri", hours: [3, 5, 7, 10, 9, 7, 5, 4] },
    ],
    kpis: [
      { l: "Claims Fraud Detection", v: "76%", delta: -5, target: "> 85%", st: "red" },
      { l: "Claims Leakage Rate", v: "3.2%", delta: +0.8, target: "< 2%", st: "red" },
      { l: "Mis-selling Flags", v: "11", delta: +4, target: "0", st: "red" },
      { l: "Vulnerable Claimant Flags", v: "67", delta: +18, target: "< 40", st: "red" },
      { l: "Regulatory Complaint Risk", v: "68%", delta: +8, target: "< 50%", st: "red" },
    ],
    pressureInsights: [
      "20K claims/day with 3-9 month resolution — interaction data reveals frustration peaking at week 4 and week 12.",
      "Adjuster communication gaps causing 31% of re-opened claims — conversation analysis shows missing empathy cues.",
      "11 mis-selling flags from policy servicing calls — agents recommending unsuitable add-ons to vulnerable customers.",
    ],
  },
};

// ═══════════════════════════
// SCREEN 3 — Financial Crime & AML Signals
// ═══════════════════════════
export const CRO_FINANCIAL_CRIME_SIGNALS = {
  sarPipeline: {
    detected: 23,
    underReview: 12,
    filed: 8,
    acknowledged: 4,
    totalValue: "£2.4M",
  },
  fraudPatternClusters: [
    { category: "Identity Theft", count: 34, trend: +12, severity: "critical" as const },
    { category: "Card Not Present", count: 89, trend: +23, severity: "high" as const },
    { category: "Account Takeover", count: 23, trend: +8, severity: "critical" as const },
    { category: "Synthetic Identity", count: 12, trend: +5, severity: "high" as const },
    { category: "Mule Accounts", count: 7, trend: +3, severity: "medium" as const },
  ],
  amlConversationSignals: [
    { signal: "Unusual urgency in transaction", count: 34, severity: "high" as const },
    { signal: "Third-party coaching detected", count: 18, severity: "critical" as const },
    { signal: "Structuring language patterns", count: 12, severity: "critical" as const },
    { signal: "Evasive / inconsistent responses", count: 28, severity: "high" as const },
    { signal: "Reluctance on source of funds", count: 15, severity: "high" as const },
    { signal: "Multiple identity references", count: 8, severity: "medium" as const },
  ],
  agentAmlCompliance: {
    kycScriptAdherence: { value: 87, target: 95, status: "amber" as const },
    idVerification: { value: 94, target: 98, status: "amber" as const },
    pepCheckCompletion: { value: 91, target: 100, status: "amber" as const },
    sourceOfFundsAsked: { value: 76, target: 95, status: "red" as const },
    agentsBelowThreshold: 7,
  },
  riskSpikes: [
    { metric: "Card Fraud", before: "2.1%", after: "3.8%", change: "+81%", severity: "critical" as const, action: "Proactive freeze on 127 accounts in FL cluster" },
    { metric: "Synthetic ID", before: "5/wk", after: "12/wk", change: "+140%", severity: "high" as const, action: "Enhanced verification for new account openings" },
    { metric: "Mule Accounts", before: "2/wk", after: "7/wk", change: "+250%", severity: "high" as const, action: "Flag dormant accounts with sudden activity spikes" },
    { metric: "AML Alerts", before: "18/day", after: "34/day", change: "+89%", severity: "critical" as const, action: "Deploy enhanced transaction monitoring rules" },
  ],
};

// ═══════════════════════════
// SCREEN 4 — Consumer Duty & Regulatory Compliance
// ═══════════════════════════
export const CRO_CONSUMER_DUTY = {
  pillars: [
    { name: "Fair Value", score: 84, trend: [88, 87, 86, 85, 84], status: "amber" as const, issues: ["Fee transparency gaps in 3 product lines", "12 fair lending referrals pending review"] },
    { name: "Understanding", score: 79, trend: [85, 84, 82, 80, 79], status: "amber" as const, issues: ["Jargon complexity above threshold in 18% of calls", "Terms explanation rate below 80% for insurance products"] },
    { name: "Support", score: 91, trend: [89, 89, 90, 90, 91], status: "green" as const, issues: ["Accessibility improvements showing positive results"] },
    { name: "Harm Prevention", score: 73, trend: [78, 77, 76, 74, 73], status: "red" as const, issues: ["7 mis-selling flags from collections scripts", "Vulnerable customer protocols not followed in 6% of cases"] },
  ],
  vulnerableCustomerDetection: {
    totalFlagged: 234,
    confirmed: 189,
    falsePositive: 45,
    confirmationRate: 81,
    signals: [
      { type: "Financial distress", count: 89, icon: "💰" },
      { type: "Health / bereavement", count: 42, icon: "🏥" },
      { type: "Cognitive difficulty", count: 31, icon: "🧠" },
      { type: "Language barrier", count: 28, icon: "🗣️" },
      { type: "Age-related vulnerability", count: 23, icon: "👤" },
      { type: "Domestic abuse indicators", count: 16, icon: "⚠️" },
    ],
    trend: "↑ 18% vs last month — improved detection, not increased vulnerability",
  },
  misSellingRisk: [
    { category: "Wrong product recommended", count: 7, severity: "critical" as const },
    { category: "Unsuitable advice given", count: 4, severity: "critical" as const },
    { category: "Incomplete risk disclosure", count: 12, severity: "high" as const },
    { category: "Pressure tactics detected", count: 3, severity: "critical" as const },
    { category: "Fee confusion caused by agent", count: 18, severity: "medium" as const },
  ],
};

export const CRO_CROSS_JURISDICTION = {
  matrix: [
    { jurisdiction: "UK", consumerDuty: "met", aml: "met", dataPrivacy: "met", conduct: "met", outsourcing: "gap" },
    { jurisdiction: "EU", consumerDuty: "met", aml: "met", dataPrivacy: "met", conduct: "gap", outsourcing: "gap" },
    { jurisdiction: "APAC", consumerDuty: "gap", aml: "met", dataPrivacy: "gap", conduct: "gap", outsourcing: "gap" },
    { jurisdiction: "US", consumerDuty: "gap", aml: "met", dataPrivacy: "gap", conduct: "met", outsourcing: "met" },
  ] as { jurisdiction: string; consumerDuty: string; aml: string; dataPrivacy: string; conduct: string; outsourcing: string }[],
  categories: ["Consumer Duty", "AML", "Data Privacy", "Conduct", "Outsourcing"],
};

export const CRO_SMCR_ACCOUNTABILITY = [
  { role: "CRO", name: "Shridar K.", openFindings: 3, riskLevel: "high" as const, areas: ["AML detection gap", "SAR filing delays", "Consumer Duty pillar 4"] },
  { role: "MLRO", name: "James P.", openFindings: 1, riskLevel: "medium" as const, areas: ["PEP screening process gap"] },
  { role: "COO", name: "Sarah M.", openFindings: 0, riskLevel: "low" as const, areas: [] },
  { role: "CCO", name: "Priya D.", openFindings: 2, riskLevel: "medium" as const, areas: ["Recording consent miss rate", "Collections script UDAAP"] },
  { role: "Head of Cards", name: "Alex T.", openFindings: 2, riskLevel: "high" as const, areas: ["Merchant breach response", "Card testing pattern"] },
];

// ═══════════════════════════
// SCREEN 5 — Investigation & Action
// ═══════════════════════════
export const CRO_INVESTIGATIONS = [
  {
    id: "CASE-2847",
    severity: "critical" as const,
    title: "Potential mis-selling of PPI on credit cards",
    what: "AI detected pressure language + unsuitable product recommendation in 4 calls from Agent KP-12. Collections script variant A does not meet RESPA timing requirements.",
    where: { channel: "Cards Business → Outbound Sales", region: "National", agent: "Agent KP-12" },
    why: ["Conversation analysis detected pressure tactics in 4/12 calls this week", "Product suitability check bypassed — customer income data not verified", "Script variant A timing violates RESPA requirements"],
    impact: { exposure: "£120K", customers: 48, smcrOwner: "Head of Cards", regulatoryRisk: "CFPB escalation >60%" },
    evidence: { conversations: 4, flaggedPhrases: 12, riskScore: 89 },
    actions: [
      { type: "immediate" as const, text: "Suspend agent pending investigation" },
      { type: "immediate" as const, text: "Halt collections script variant A" },
      { type: "escalate" as const, text: "Escalate to compliance for SMCR review" },
      { type: "remediation" as const, text: "Customer remediation — 48 affected accounts" },
      { type: "regulatory" as const, text: "File SAR if fraud indicators confirmed" },
    ],
  },
  {
    id: "CASE-2851",
    severity: "high" as const,
    title: "Cluster of vulnerable customers not identified in mortgage renewals",
    what: "6% of mortgage renewal calls this week showed vulnerable customer signals that were not flagged by agents. Financial distress indicators present in conversation data but vulnerability protocol not triggered.",
    where: { channel: "Retail Banking → Mortgage Renewals", region: "National", agent: "Multiple (8 agents)" },
    why: ["Agent training on vulnerability indicators incomplete — 8 agents below competency threshold", "System vulnerability flag tool requires 3 extra clicks — agents bypassing", "Rate-reset mortgage cohort showing elevated distress signals"],
    impact: { exposure: "£85K regulatory fine risk", customers: 34, smcrOwner: "CRO", regulatoryRisk: "FCA Consumer Duty breach" },
    evidence: { conversations: 34, flaggedPhrases: 67, riskScore: 74 },
    actions: [
      { type: "immediate" as const, text: "Mandatory vulnerability refresher for 8 agents" },
      { type: "immediate" as const, text: "Retrospective review of 34 flagged conversations" },
      { type: "escalate" as const, text: "UX fix for vulnerability flag tool (reduce clicks)" },
      { type: "remediation" as const, text: "Proactive outreach to 34 customers with support options" },
    ],
  },
  {
    id: "CASE-2853",
    severity: "high" as const,
    title: "AML conversation signals — third-party coaching detected",
    what: "NLP detected third-party coaching patterns in 18 customer calls this week. Customers appeared to be receiving real-time instruction during KYC verification and account opening processes.",
    where: { channel: "Retail Banking → Account Opening", region: "Florida cluster", agent: "Multiple channels" },
    why: ["Third-party voice detected in background on 12/18 calls", "Scripted responses to security questions — unusual word patterns", "Correlation with dormant account reactivation in same region"],
    impact: { exposure: "£340K potential money laundering", customers: 18, smcrOwner: "MLRO", regulatoryRisk: "SAR filing required" },
    evidence: { conversations: 18, flaggedPhrases: 43, riskScore: 92 },
    actions: [
      { type: "immediate" as const, text: "File SARs for 18 flagged accounts" },
      { type: "immediate" as const, text: "Enhanced verification for FL account openings" },
      { type: "escalate" as const, text: "Refer to financial crime investigation unit" },
      { type: "regulatory" as const, text: "Notify FCA within 24h if organised crime suspected" },
    ],
  },
];

export const CRO_AI_CHAT_SUGGESTIONS = [
  "Show me all vulnerable customer cases from this week",
  "What's my SMCR exposure across lines of business?",
  "Draft talking points for the FCA Consumer Duty review",
  "Compare AML detection rates: this quarter vs last",
  "Which agents are below KYC compliance threshold?",
  "Summarise financial crime trends across jurisdictions",
  "Generate SAR filing draft for CASE-2853",
  "What is our Consumer Duty pillar 4 gap analysis?",
];

/** Assistant replies for quick prompts; indices match CRO_AI_CHAT_SUGGESTIONS. */
export const CRO_AI_CHAT_RESPONSES: string[] = [
  "This week we surfaced 234 vulnerable-customer conversations (▲28 vs prior week). Top drivers: financial distress on mortgage renewals (89), health or bereavement mentions (54), and capability / language barriers (41). Highest concentration: voice, 10:00–14:00. Recommend routing the top 40 cases to specialist teams and refreshing agent cue cards for distress language.",
  "SMCR snapshot: Open findings sit with Head of Retail Banking (3), Head of Cards (2), and MLRO office (1). Retail: Consumer Duty documentation gaps; Cards: dispute reopen velocity; MLRO: SAR quality review backlog. Escalate the Cards items first due to regulatory deadline in 9 days.",
  "Talking points — Consumer Duty (FCA): (1) Fair value — fee-related complaints vs product benchmarks weekly. (2) Consumer understanding — QA jargon reduction in progress; target 90% plain-language score by Q3. (3) Consumer support — channel accessibility and callback SLA on the exec dashboard. (4) Avoiding harm — vulnerable-customer detection and coaching documented for audit. Position conversation analytics as evidence of monitoring, not a replacement for policy.",
  "AML detection: This quarter’s model-assisted alert rate is +12% vs last quarter; true-positive rate improved ~4 pts after NLP phrase tuning on KYC calls. Transaction monitoring still drives most alerts; conversation-derived alerts grew fastest (+34%) on third-party coaching and source-of-funds evasion patterns.",
  "Agents below KYC threshold: 6 agents under 85% on combined KYC script adherence, ID verification, PEP, and SoF. Worst gaps: ID verification (3 agents) and SoF prompts (4). Suggest targeted coaching this week and a second QA sample before month-end.",
  "Cross-jurisdiction: UK Consumer Duty and AML expectations remain the binding standard for shared processes. EU: strong on data privacy; APAC hub: outsourcing controls lag UK on two categories. US: conduct risk elevated on dispute scripts. Prioritise harmonising customer-understanding disclosures and AML call scripts where UK is strictest.",
  "SAR draft — CASE-2853: Subject: Suspicious activity — structured deposits below reporting threshold with inconsistent SoF narrative. Summary: Customer referenced third-party coaching during authentication; three calls in 72h with conflicting employment details. Recommend filing with conversation excerpts and TM alerts attached. Final filing requires MLRO sign-off.",
  "Pillar 4 (Avoiding harm): Vulnerable-customer confirmation rate is strong, but mis-selling risk indicators rose ~18% month-on-month in cards and insurance handoffs. Root themes: rushed suitability language and cross-sell during complaint calls. Pair conversation flags with QA calibration and a 2-week coaching sprint on complaint-path selling.",
];
