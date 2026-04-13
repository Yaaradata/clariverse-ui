import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  Crown,
  Headphones,
  Landmark,
  Lock,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Target,
  Users,
} from "lucide-react";

export const T = {
  bg: "#04080f", surface: "#0a1220", card: "#0e1830",
  elevated: "#142040", border: "#1a2d50", borderLight: "#243a60",
  cyan: "#06b6d4", cyanGlow: "rgba(6,182,212,0.12)",
  gold: "#eab308", goldGlow: "rgba(234,179,8,0.12)",
  green: "#22c55e", greenGlow: "rgba(34,197,94,0.1)",
  red: "#ef4444", redGlow: "rgba(239,68,68,0.1)",
  amber: "#f59e0b", amberGlow: "rgba(245,158,11,0.1)",
  purple: "#a78bfa", purpleGlow: "rgba(167,139,250,0.1)",
  blue: "#3b82f6", blueGlow: "rgba(59,130,246,0.1)",
  text: "#e2e8f0", textSec: "#94a3b8", textMut: "#5e718a", white: "#fff",
};

export const INDUSTRIES = [
  { id: "retail_banking", name: "Retail Banking", icon: Landmark, color: "#06b6d4", desc: "Deposits, savings, loans, mortgage, branches, contact centres",
    roles: [
      { id: "ceo", name: "CEO / Managing Director", icon: Crown, sub: "Enterprise-wide promise health across all LOBs", defaultLens: "ops", primaryTile: null },
      { id: "coo", name: "COO", icon: Briefcase, sub: "Operational efficiency, SLA compliance, workforce, Eisenhower priorities", defaultLens: "ops", primaryTile: 1 },
      { id: "cro", name: "CRO / Chief Risk Officer", icon: Shield, sub: "Fraud signals, regulatory exposure, compliance health", defaultLens: "risk", primaryTile: 2 },
      { id: "head_retail", name: "Head of Retail Banking", icon: Building2, sub: "Deposits, loans, branches — service promise + complaints", defaultLens: "ops", primaryTile: 0 },
      { id: "head_cx", name: "Head of Customer Experience", icon: Headphones, sub: "NPS, sentiment, effort, journeys, social perception", defaultLens: "ops", primaryTile: 0 },
      { id: "head_compliance", name: "Head of Compliance", icon: Lock, sub: "CFPB/OCC risk, audit readiness, complaint aging", defaultLens: "compliance", primaryTile: 2 },
      { id: "head_contact", name: "Head of Contact Centre", icon: Users, sub: "Volume, AHT, FCR, agent performance, BPO, staffing", defaultLens: "ops", primaryTile: 1 },
    ]
  },
  { id: "credit_cards", name: "Credit Cards", icon: CreditCard, color: "#eab308", desc: "Card portfolio, disputes, fraud, rewards, collections",
    roles: [
      { id: "ceo", name: "CEO / MD", icon: Crown, sub: "Card portfolio health — promise, stability, risk" },
      { id: "head_cards", name: "Head of Credit Cards", icon: CreditCard, sub: "P&L, disputes, rewards, competitive intelligence" },
      { id: "head_fraud", name: "Head of Fraud", icon: Shield, sub: "CNP patterns, MCC clustering, merchant breaches" },
      { id: "head_compliance", name: "Head of Compliance", icon: Lock, sub: "Reg E/Z, Visa/MC chargeback, CFPB risk" },
    ]
  },
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart, color: "#22c55e", desc: "Marketplace, seller quality, fulfilment, returns, support",
    roles: [
      { id: "ceo", name: "CEO / MD", icon: Crown, sub: "Marketplace health, satisfaction, stability" },
      { id: "head_cx", name: "Head of CX", icon: Headphones, sub: "Contact volume, refunds, delivery complaints" },
      { id: "head_marketplace", name: "Head of Marketplace", icon: BarChart3, sub: "Seller scorecards, fulfilment, returns" },
    ]
  },
  { id: "insurance", name: "Insurance", icon: ShieldCheck, color: "#a78bfa", desc: "Claims, policy servicing, agent quality, compliance",
    roles: [
      { id: "ceo", name: "CEO / MD", icon: Crown, sub: "Claims health, servicing quality, exposure" },
      { id: "head_claims", name: "Head of Claims", icon: BarChart3, sub: "Cycle time, adjuster quality, fraud, SLA" },
    ]
  },
];

// ═══════════════════════════
// ROLE-SPECIFIC DATA FOR RETAIL BANKING
// ═══════════════════════════
export const ROLE_DATA = {
  ceo: {
    tiles: [
      { title: "Promise Health", score: 74, color: T.cyan, icon: Target, sub: "CX + Sentiment + Effort + Accuracy", insight: "Reward satisfaction dropped 12 pts — program change backlash. 412 calls mentioned competitor offers. Onboarding drop-off at 18% from KYC lag.", kpis: [{ l: "CX Composite", v: "72" }, { l: "Sentiment", v: "0.58" }, { l: "Effort", v: "3.2" }, { l: "FCR", v: "74%" }] },
      { title: "Operational Stability", score: 68, color: T.gold, icon: Activity, sub: "Volume vs Capacity + SLA Risk", insight: "Volume exceeded capacity 32% between 9–11 AM. BPO evidence collection 2.7× slower. Dispute backlog grew 8% this week.", kpis: [{ l: "Vol vs Cap", v: "112%" }, { l: "SLA", v: "87%" }, { l: "Backlog", v: "1,847" }, { l: "Avg Res.", v: "6.8d" }] },
      { title: "Risk Exposure", score: 58, color: T.red, icon: Shield, sub: "Fraud + Regulatory + Reputation", insight: "Fraud cluster in FL — 23 calls match social engineering script. 7 complaints at >60% CFPB escalation. Merchant breach: 1,247 cards exposed.", kpis: [{ l: "Fraud Signals", v: "69" }, { l: "Reg Risk", v: "7" }, { l: "Social Vel.", v: "3.4×" }, { l: "Breach", v: "1,247" }] },
    ],
    lobKpis: [
      { l: "Customer Promise Score", v: "76", delta: -2, target: "> 80", st: "amber" },
      { l: "Complaint Volume", v: "312", delta: +28, target: "< 250", st: "red" },
      { l: "First Contact Resolution", v: "74%", delta: -3, target: "> 80%", st: "red" },
      { l: "Onboarding Drop-off", v: "18%", delta: +2, target: "< 12%", st: "amber" },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
    ],
    insights: [
      "Onboarding delays and complaint spike driven by KYC processing lag — API latency increased 3× since Tuesday.",
      "FCR drop concentrated in HELOC product — agents lack rate-lookup tool access after system update.",
    ],
    eisenhower: { do: ["KYC API fix — 18% onboarding drop", "HELOC rate-lookup restoration"], plan: ["BPO quality review", "Agent training on fees"], delegate: ["3 branch ATM outages", "Social media viral post response"], monitor: ["Quarterly report formatting", "Dashboard updates"] },
  },
  coo: {
    tiles: [
      { title: "Promise Health", score: 74, color: T.cyan, icon: Target, sub: "CX + Sentiment + Effort + Accuracy", insight: "FCR at 74% — below 80% target for 3rd week. Root cause: HELOC tool down + new fee confusion across 7 agents.", kpis: [{ l: "CX Composite", v: "72" }, { l: "FCR", v: "74%" }, { l: "Effort", v: "3.2" }, { l: "Repeat Rate", v: "22%" }] },
      { title: "Operational Stability", score: 62, color: T.red, icon: Activity, sub: "Volume · Capacity · Throughput · SLA", insight: "Staffing gap: 12 agents short in 10–12 PM window. BPO 2.7× slower on evidence collection. Backlog age: 312 cases >48h and growing 8%/week.", kpis: [{ l: "Vol vs Cap", v: "112%" }, { l: "SLA", v: "87%" }, { l: "AHT", v: "8.3m" }, { l: "Backlog >48h", v: "312" }] },
      { title: "Risk Exposure", score: 64, color: T.amber, icon: Shield, sub: "Fraud + Regulatory + Reputation", insight: "7 complaints approaching CFPB deadline. Social velocity at 3.4× baseline — reward backlash spreading.", kpis: [{ l: "Fraud Signals", v: "69" }, { l: "SLA Breach", v: "43" }, { l: "Social Vel.", v: "3.4×" }, { l: "Unactioned", v: "3" }] },
    ],
    lobKpis: [
      { l: "Volume vs Capacity", v: "112%", delta: +8, target: "< 100%", st: "red" },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
      { l: "Avg Handle Time", v: "8.3m", delta: +0.8, target: "< 8 min", st: "amber" },
      { l: "Agent Utilisation", v: "94%", delta: +3, target: "< 88%", st: "red" },
      { l: "Backlog Age (>48h)", v: "312", delta: +47, target: "< 100", st: "red" },
    ],
    insights: [
      "Volume exceeded capacity by 32% between 9–11 AM — driven by KYC API failure generating 340 extra calls.",
      "BPO Vendor Beta evidence collection step is 2.7× slower than in-house, eroding representment win rate to 38%.",
      "Staffing gap: 12 agents short in 10AM–12PM window. Recommend overflow activation before 9:45 AM.",
    ],
    eisenhower: { do: ["Activate 12 overflow agents before 9:45 AM", "BPO evidence collection SLA escalation"], plan: ["Agent cross-training for HELOC queries", "Workforce model recalibration"], delegate: ["ATM outage customer redirect", "Statement confusion FAQ update"], monitor: ["Evening shift overtime costs", "New hire pipeline status"] },
  },
  cro: {
    tiles: [
      { title: "Risk Appetite & Consumer Duty", score: 76, color: T.cyan, icon: Target, sub: "Risk Appetite · FCA Consumer Duty · SMCR", insight: "Risk appetite score 76/100 — Consumer Duty pillar 4 (Harm Prevention) at 73%, dragging overall. SMCR clean but 3 CRO findings open. FCA Consumer Duty becoming global standard.", kpis: [{ l: "Risk Appetite", v: "76" }, { l: "Consumer Duty", v: "82%" }, { l: "SMCR Breaches", v: "0" }, { l: "Open Findings", v: "3" }] },
      { title: "Financial Crime & AML", score: 58, color: T.red, icon: Shield, sub: "SAR Pipeline · AML · Fraud · Money Laundering", insight: "47 open SARs — 12 new this week. Third-party coaching detected in 18 calls (FL cluster). Source-of-funds compliance at 76% — well below 95% target. Conversation-derived risk profiles flagging organised pattern.", kpis: [{ l: "Open SARs", v: "47" }, { l: "AML Alerts/day", v: "34" }, { l: "Fraud Signals", v: "69" }, { l: "SOF Compliance", v: "76%" }] },
      { title: "Vulnerable Customer & Conduct", score: 64, color: T.amber, icon: Activity, sub: "Vulnerability Detection · Mis-selling · Conduct Risk", insight: "234 vulnerable customers flagged — 81% confirmed. 26 mis-selling flags across LOBs. 6% of mortgage renewal calls missed vulnerability signals. Conversation intelligence detecting what agents miss.", kpis: [{ l: "Vulnerable Flags", v: "234" }, { l: "Mis-sell Risk", v: "26" }, { l: "Detection Rate", v: "94.2%" }, { l: "Agent Gaps", v: "7" }] },
    ],
    lobKpis: [
      { l: "SAR Pipeline (Open)", v: "47", delta: +12, target: "< 30", st: "red" },
      { l: "Consumer Duty Score", v: "82%", delta: -3, target: "> 90%", st: "amber" },
      { l: "Fraud Detection Rate", v: "82%", delta: -3, target: "> 90%", st: "red" },
      { l: "Vulnerable Customer Detection", v: "94.2%", delta: +3.1, target: "> 95%", st: "amber" },
      { l: "Mis-selling / Conduct Flags", v: "26", delta: +8, target: "0", st: "red" },
    ],
    insights: [
      "Third-party coaching detected in 18 calls (FL cluster) — NLP flagged scripted responses during KYC. Conversation-derived risk profiles correlating with dormant account reactivation. SAR filing required within 24h.",
      "Consumer Duty pillar 4 (Harm Prevention) at 73% — 7 mis-selling flags from collections scripts + 6% vulnerability protocol bypasses on mortgage renewals. FCA regulatory risk imminent.",
      "Cross-jurisdictional gap: APAC operations below UK Consumer Duty standard — highest jurisdiction controls must apply. 3 compliance gaps identified in APAC + US.",
    ],
    eisenhower: { do: ["File SARs for 18 FL coaching-flagged accounts", "Halt collections script variant A — RESPA + UDAAP"], plan: ["Consumer Duty pillar 4 remediation plan", "Cross-jurisdiction compliance alignment"], delegate: ["Vulnerability tool UX fix (reduce clicks)", "AML training refresh for 7 agents below threshold"], monitor: ["SMCR exposure tracking", "Insurance claims fraud trend"] },
  },
  head_retail: {
    tiles: [
      { title: "Valuable Customer Health", score: 72, color: T.cyan, icon: Target, sub: "High-Value Segment · Pain Points · Retention Risk", insight: "312 high-value customers called this week — 68% about mortgage servicing & HELOC. Top pain: EMI failures (31%), fee confusion (24%), onboarding delays (18%). 3 HNI at 72–89% churn probability.", kpis: [{ l: "HV Calls", v: "312" }, { l: "Top Pain", v: "EMI 31%" }, { l: "Churn Risk", v: "3 HNI" }, { l: "Retention", v: "94.2%" }] },
      { title: "Brand & Reputation Risk", score: 64, color: T.amber, icon: Shield, sub: "Cross-Channel Sentiment · Social Virality · Trustpilot", insight: "Cross-channel sentiment at 0.58 — below 0.65 threshold. Social virality 3.4× baseline on fee complaints. Trustpilot score dropped to 3.2 (was 3.8). 4 posts trending on X about 'hidden fees'.", kpis: [{ l: "Sentiment", v: "0.58" }, { l: "Social Vel.", v: "3.4×" }, { l: "Trustpilot", v: "3.2 ▼" }, { l: "Viral Posts", v: "4" }] },
      { title: "Intent SLA & Bottlenecks", score: 68, color: T.gold, icon: Activity, sub: "Intent-Based SLA Tracking · Process Bottlenecks", insight: "4 top intents tracked: Mortgage Servicing (SLA 72%), Fee Dispute (SLA 64%), Account Closure (SLA 81%), Card Replacement (SLA 91%). Fee Dispute SLA worst — avg 3.2 days vs 1-day target. KYC bottleneck driving 580 abandoned applications.", kpis: [{ l: "Mortgage SLA", v: "72%" }, { l: "Fee Dispute", v: "64%" }, { l: "Acct Close", v: "81%" }, { l: "Card Replace", v: "91%" }] },
    ],
    lobKpis: [
      { l: "High-Value Customer Calls", v: "312", delta: +28, target: "< 250", st: "red" },
      { l: "Cross-Channel Sentiment", v: "0.58", delta: -0.08, target: "> 0.65", st: "red" },
      { l: "Intent SLA Compliance (Avg)", v: "77%", delta: -6, target: "> 90%", st: "red" },
      { l: "Social Virality Index", v: "3.4×", delta: +1.2, target: "< 1.5×", st: "red" },
      { l: "HNI Churn Probability (Top 3)", v: "72–89%", delta: +12, target: "< 30%", st: "red" },
    ],
    insights: [
      "High-value customers calling mostly about mortgage servicing (31%) and fee confusion (24%) — these are the biggest pain points driving churn risk.",
      "Cross-channel sentiment at 0.58 — Trustpilot dropped 0.6 pts, 4 viral X posts about 'hidden fees'. Brand reputation risk escalating.",
      "Fee Dispute intent has worst SLA at 64% — avg resolution 3.2 days vs 1-day target. KYC API bottleneck blocking 580 onboarding applications.",
    ],
    eisenhower: { do: ["Proactive outreach to 3 HNI churn risks ($1.2M combined deposits)", "Fee Dispute SLA remediation — 3.2 day avg is 3× target"], plan: ["KYC API bottleneck fix — 580 abandoned apps", "Cross-channel sentiment recovery plan"], delegate: ["Trustpilot response strategy", "Social media viral post containment"], monitor: ["Intent heat map for emerging patterns", "Channel-specific concern trends"] },
  },
  head_cx: {
    tiles: [
      { title: "Promise Health", score: 72, color: T.cyan, icon: Target, sub: "Customer Sentiment + Effort + Journeys", insight: "Sentiment crossed below 0.60 threshold — 2nd consecutive week. Repeat contact rate at 22%. Customer effort score 3.2 (above 3.0 target).", kpis: [{ l: "NPS", v: "+38" }, { l: "Sentiment", v: "0.58" }, { l: "Effort Score", v: "3.2" }, { l: "Repeat Rate", v: "22%" }] },
      { title: "Operational Stability", score: 68, color: T.gold, icon: Activity, sub: "Channel Health + Resolution Quality", insight: "Social channel sentiment at 0.41 — dragged by reward backlash. Voice channel FCR at 74%. Chat containment steady at 62%.", kpis: [{ l: "FCR", v: "74%" }, { l: "CSAT", v: "81%" }, { l: "Chat Contain", v: "62%" }, { l: "Abandon Rate", v: "8.2%" }] },
      { title: "Risk Exposure", score: 60, color: T.amber, icon: Shield, sub: "Reputation + Churn + Social Virality", insight: "3 high-value customers at 72–89% churn probability. Social velocity 3.4× baseline. Complaint-to-social conversion rate at 4.2%.", kpis: [{ l: "Churn Risk", v: "3 HNI" }, { l: "Social Vel.", v: "3.4×" }, { l: "Cmpl→Social", v: "4.2%" }, { l: "App Rating", v: "4.1 ▼" }] },
    ],
    lobKpis: [
      { l: "Net Promoter Score", v: "+38", delta: -6, target: "> 44", st: "red" },
      { l: "Customer Sentiment", v: "0.58", delta: -0.08, target: "> 0.65", st: "red" },
      { l: "Customer Effort Score", v: "3.2", delta: +0.3, target: "< 3.0", st: "amber" },
      { l: "Repeat Contact Rate", v: "22%", delta: +4, target: "< 15%", st: "red" },
      { l: "Complaint-to-Social Rate", v: "4.2%", delta: +1.1, target: "< 2%", st: "red" },
    ],
    insights: [
      "NPS dropped 6 points in 4 weeks. Root cause: 67% of detractors mention 'fee confusion' or 'transferred too many times'.",
      "3 high-value customers (combined deposits $1.2M) showing escalating frustration + competitor mentions. Churn probability 72–89%.",
      "Complaint-to-social conversion at 4.2% — customers who file complaints are posting on social within 48h at 2× prior rate.",
    ],
    eisenhower: { do: ["Proactive RM outreach to 3 HNI churn risks", "Social response to reward backlash post"], plan: ["IVR redesign — 40% drop-off at step 3", "Cross-channel journey mapping rollout"], delegate: ["App store review response", "FAQ content update"], monitor: ["Sentiment trend recovery", "NPS survey response rate"] },
  },
  head_compliance: {
    tiles: [
      { title: "Promise Health", score: 74, color: T.cyan, icon: Target, sub: "Compliance + Regulatory Adherence", insight: "Compliance health at 91% — Cards unit dragging at 88%. Recording consent compliance at 99.2% but 0.8% miss rate = 240 calls/month at risk.", kpis: [{ l: "Compliance", v: "91%" }, { l: "Consent Rate", v: "99.2%" }, { l: "Script Adhere", v: "94%" }, { l: "Audit Trail", v: "88%" }] },
      { title: "Operational Stability", score: 68, color: T.gold, icon: Activity, sub: "Complaint SLAs + Documentation", insight: "43 disputes approaching Reg E deadline. 312 open complaints — 28 new this week. Documentation gaps at 12%.", kpis: [{ l: "Reg E Cases", v: "43" }, { l: "Complaints", v: "312" }, { l: "Doc Gaps", v: "12%" }, { l: "SLA Breach", v: "7" }] },
      { title: "Risk Exposure", score: 48, color: T.red, icon: Shield, sub: "CFPB + UDAAP + State Regulations", insight: "7 complaints at >60% CFPB escalation probability. 6 UDAAP / mis-selling referrals from collections. PEP screening gaps detected on 3 onboarding calls.", kpis: [{ l: "CFPB Risk", v: "7" }, { l: "UDAAP Flags", v: "6" }, { l: "PEP Gaps", v: "3" }, { l: "State Reg.", v: "96%" }] },
    ],
    lobKpis: [
      { l: "Compliance Health Score", v: "91%", delta: -1, target: "> 95%", st: "amber" },
      { l: "CFPB Escalation Risk", v: "7 cases", delta: +3, target: "0", st: "red" },
      { l: "Recording Consent Miss", v: "0.8%", delta: +0.1, target: "0%", st: "amber" },
      { l: "UDAAP / Mis-selling Flags", v: "6", delta: +4, target: "0", st: "red" },
      { l: "Documentation Completeness", v: "88%", delta: -2, target: "> 95%", st: "red" },
    ],
    insights: [
      "7 complaints have >60% probability of CFPB escalation — all in overdraft fee and loan servicing categories. Immediate prioritisation required.",
      "6 UDAAP flags from outbound collections on rate-reset mortgage accounts — script does not meet RESPA timing requirements.",
      "PEP screening not triggered on 3 onboarding calls this week — process gap in digital-to-voice handoff.",
    ],
    eisenhower: { do: ["Prioritise 7 CFPB-risk complaints — response within 24h", "Halt collections script variant A — RESPA non-compliant"], plan: ["PEP screening process fix for digital handoff", "Documentation completeness audit"], delegate: ["State regulation compliance refresh training", "Consent disclosure script update"], monitor: ["Compliance score trend by unit", "Regulatory exam calendar"] },
  },
  head_contact: {
    tiles: [
      { title: "Agent Health (In-house vs Outsourced)", score: 68, color: T.cyan, icon: Target, sub: "Insourced · Outsourced · Cross-Centre Performance", insight: "In-house agents: FCR 81%, AHT 6.4m, CSAT 87%. Outsourced (BPO Beta): FCR 62%, AHT 11.1m, CSAT 68%. BPO representment win rate collapsed to 38% vs 71% in-house. 3 centres below performance threshold.", kpis: [{ l: "In-house FCR", v: "81%" }, { l: "BPO FCR", v: "62%" }, { l: "Centre Gap", v: "3 below" }, { l: "BPO Quality", v: "68%" }] },
      { title: "Promise Adherence", score: 64, color: T.amber, icon: Activity, sub: "Receiving · Authenticating · Escalating · Resolution", insight: "Receiving: 94% calls answered within SLA. Authenticating: 12% fail at ID verification — KYC handoff broken. Escalating: 3 unactioned escalations >4h. Cross-sell during complaints destroying CSAT — policy breach.", kpis: [{ l: "Receiving", v: "94%" }, { l: "Auth Pass", v: "88%" }, { l: "Escalation", v: "3 stuck" }, { l: "Promise", v: "72%" }] },
      { title: "Developing Issues & Root Causes", score: 60, color: T.red, icon: Shield, sub: "Intent Spikes · Cluster Summary · Root Causes", insight: "Fee Dispute intent spiked 3.2× in 48h — root cause: hidden fee policy change. Mortgage Servicing cluster: 67% mention 'transferred too many times'. Agent ID 2847: 34 calls with incorrect overdraft info. Evening shift tone flags at 18%.", kpis: [{ l: "Intent Spike", v: "3.2×" }, { l: "Top Cluster", v: "Fee 67%" }, { l: "Tone Flags", v: "18%" }, { l: "Root Causes", v: "4 active" }] },
    ],
    lobKpis: [
      { l: "In-house Agent FCR", v: "81%", delta: -1, target: "> 85%", st: "amber" },
      { l: "Outsourced (BPO) FCR", v: "62%", delta: -8, target: "> 80%", st: "red" },
      { l: "Promise Adherence Score", v: "72%", delta: -5, target: "> 90%", st: "red" },
      { l: "Cross-Centre Health (Below Threshold)", v: "3 centres", delta: +2, target: "0", st: "red" },
      { l: "Intent Spike Alerts (Active)", v: "4", delta: +2, target: "< 2", st: "red" },
    ],
    insights: [
      "BPO Vendor Beta: FCR at 62% vs 81% in-house — representment win rate 38% vs 71%. Evidence collection step taking 4 extra days. Root cause: insufficient training on new dispute framework.",
      "Promise adherence broken at authentication step — 12% fail rate due to KYC API handoff failure. 3 escalations unactioned >4h. Policy breach: cross-selling during active complaints.",
      "Fee Dispute intent spiked 3.2× — cluster analysis shows 67% mention 'transferred too many times'. Agent 2847: 34 incorrect overdraft calls. Evening shift tone flags at 18%.",
    ],
    eisenhower: { do: ["BPO vendor Beta performance review — 38% win rate unacceptable", "Fix authentication handoff — 12% fail rate"], plan: ["Cross-centre health parity programme", "Evening shift tone-coaching rollout"], delegate: ["IVR step-3 escape hatch", "FAQ script update for new fees"], monitor: ["Intent spike trends (Fee Dispute cluster)", "New hire ramp-up progress"] },
  },
};
// ═══════════════════════════
// LOB-SPECIFIC KPI DATA (Screen 2 onward)
// ═══════════════════════════
export const LOB_DATA: Record<string, { label: string; kpis: { l: string; v: string; delta: number; target: string; st: "red" | "amber" | "green" }[]; insights: string[]; eisenhower: { do: string[]; plan: string[]; delegate: string[]; monitor: string[] } }> = {
  retail_banking: {
    label: "Retail Banking",
    kpis: [
      { l: "Customer Promise Score", v: "76", delta: -2, target: "> 80", st: "amber" },
      { l: "Complaint Volume", v: "312", delta: +28, target: "< 250", st: "red" },
      { l: "First Contact Resolution", v: "74%", delta: -3, target: "> 80%", st: "red" },
      { l: "Onboarding Drop-off", v: "18%", delta: +2, target: "< 12%", st: "amber" },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
    ],
    insights: [
      "Onboarding delays and complaint spike driven by KYC processing lag — API latency increased 3× since Tuesday.",
      "FCR drop concentrated in HELOC product — agents lack rate-lookup tool access after system update.",
      "EMI failure complaints up 22% MoM — rate-reset mortgage cohort over-indexes.",
    ],
    eisenhower: { do: ["KYC API fix — 18% onboarding drop", "HELOC rate-lookup restoration"], plan: ["BPO quality review", "Agent training on fees"], delegate: ["3 branch ATM outages", "Social media viral post response"], monitor: ["Quarterly report formatting", "Dashboard updates"] },
  },
  cards_business: {
    label: "Cards Business",
    kpis: [
      { l: "Transaction Success Rate", v: "97.2%", delta: -0.8, target: "> 99%", st: "red" },
      { l: "Fraud Detection Rate", v: "82%", delta: -3, target: "> 90%", st: "red" },
      { l: "Dispute Volume", v: "1,247", delta: +189, target: "< 800", st: "red" },
      { l: "Authorization Latency", v: "340ms", delta: +80, target: "< 200ms", st: "red" },
      { l: "Complaint Rate", v: "2.8%", delta: +0.6, target: "< 1.5%", st: "amber" },
    ],
    insights: [
      "Merchant breach exposed 1,247 cards — reissuance at 68%. Fraud cluster in FL targeting seniors with social engineering scripts.",
      "Authorization latency spiked 80ms after payment gateway update — retry anomalies at 2,340.",
      "Dispute volume up 24% — MCC 7995 (gaming) category driving 40% of new disputes.",
    ],
    eisenhower: { do: ["FL fraud cluster — proactive freeze on 127 accounts", "Payment gateway rollback assessment"], plan: ["Merchant breach full reissuance", "MCC 7995 dispute pattern investigation"], delegate: ["Chargeback documentation backlog", "Rewards program complaint triage"], monitor: ["Card testing pattern evolution", "Competitor rate changes"] },
  },
  insurance: {
    label: "Insurance",
    kpis: [
      { l: "Claims Processing Time", v: "14.2d", delta: +3.1, target: "< 10d", st: "red" },
      { l: "Claim Rejection Rate", v: "18%", delta: +4, target: "< 12%", st: "red" },
      { l: "Policy Issuance TAT", v: "3.8d", delta: +0.9, target: "< 2d", st: "amber" },
      { l: "Customer Complaint Rate", v: "3.1%", delta: +0.7, target: "< 2%", st: "amber" },
      { l: "Persistency / Renewal Rate", v: "78%", delta: -4, target: "> 85%", st: "red" },
    ],
    insights: [
      "Claims processing backlog grew 31% — adjuster capacity gap in auto claims after storm season surge.",
      "Claim rejection rate spiked due to documentation gaps in digital-first submissions — 62% of rejections are re-submittable.",
      "Persistency dropped 4 pts — renewal reminders not triggered for 1,200 policies due to CRM sync failure.",
    ],
    eisenhower: { do: ["CRM sync fix — 1,200 renewal reminders pending", "Adjuster overtime for storm claims backlog"], plan: ["Digital submission documentation guide", "Claims automation pilot expansion"], delegate: ["Policy issuance template updates", "Complaint categorisation review"], monitor: ["Renewal rate recovery trend", "Adjuster quality scores"] },
  },
};

// LOB-specific KPIs for Screen 3–5 drill-down
export const LOB_DRILL_KPIS: Record<string, { label: string; kpis: { n: string; v: string; a: string | null }[] }[]> = {
  mortgage_loans: [
    { label: "Mortgage / Loans", kpis: [
      { n: "Loan Servicing Call Rate", v: "4.2/1K", a: "Above 3.6 target" },
      { n: "EMI Failure Rate", v: "2.1%", a: "Repayment failures rising" },
      { n: "EMI Complaint Volume", v: "67", a: "▲22% MoM" },
      { n: "Delinquency Rate (30+ DPD)", v: "1.8%", a: "Rate-reset cohort" },
      { n: "Mis-selling / Policy Flags", v: "14", a: "Fair lending queue" },
    ]},
  ],
  insurance_lob: [
    { label: "Insurance LOB", kpis: [
      { n: "Claims Leakage / Fraud", v: "3.2%", a: "Above 2% threshold" },
      { n: "Underwriting Exception Rate", v: "8.4%", a: "▲2.1% in 6 weeks" },
      { n: "Mis-selling Flags", v: "11", a: "Policy suitability issues" },
      { n: "High-Value Claim Escalation", v: "23", a: "Risk of regulatory action" },
      { n: "Regulatory Complaint Escalation", v: "68%", a: "Probability rising" },
    ]},
  ],
  // CRO-specific drill-down KPIs (Shridar insights: Financial Crime + Consumer Duty + AML)
  cro_financial_crime: [
    { label: "Financial Crime & AML", kpis: [
      { n: "SAR Pipeline (Open)", v: "47", a: "12 new this week" },
      { n: "Third-Party Coaching Flags", v: "18", a: "FL cluster — organised pattern" },
      { n: "Source of Funds Compliance", v: "76%", a: "Below 95% — 7 agents failing" },
      { n: "PEP Screening Gaps", v: "3", a: "Digital-to-voice handoff miss" },
      { n: "Transaction Monitoring Alerts", v: "34/day", a: "▲89% vs baseline" },
    ]},
  ],
  cro_consumer_duty: [
    { label: "Consumer Duty (FCA)", kpis: [
      { n: "Harm Prevention Score", v: "73%", a: "Below 80% — regulatory risk" },
      { n: "Vulnerable Customer Protocol", v: "94%", a: "6% bypass rate on mortgages" },
      { n: "Mis-selling Flags", v: "26", a: "7 from collections scripts" },
      { n: "Fair Value Gaps", v: "3 products", a: "Fee transparency issues" },
      { n: "SMCR Accountability Gaps", v: "3 findings", a: "CRO-owned remediation" },
    ]},
  ],
  cro_cross_jurisdiction: [
    { label: "Cross-Jurisdiction Compliance", kpis: [
      { n: "UK Compliance", v: "94%", a: null },
      { n: "EU Compliance", v: "87%", a: "Conduct gap identified" },
      { n: "APAC Compliance", v: "72%", a: "Consumer Duty + Privacy gaps" },
      { n: "US Compliance", v: "81%", a: "Consumer Duty gap" },
      { n: "Highest-Jurisdiction Delta", v: "22pts", a: "UK vs APAC spread" },
    ]},
  ],
  // Head of Retail Banking — valuable customer pain points + intent SLA
  retail_valuable_customers: [
    { label: "High-Value Customer Pain Points", kpis: [
      { n: "Mortgage Servicing Calls (HV)", v: "97", a: "31% of all HV calls" },
      { n: "Fee Confusion Calls (HV)", v: "75", a: "24% — fee policy change" },
      { n: "Onboarding Delays (HV)", v: "56", a: "18% — KYC bottleneck" },
      { n: "HELOC Rate Queries (HV)", v: "48", a: "15% — tool offline" },
      { n: "Account Closure Requests (HV)", v: "36", a: "12% — competitor offers" },
    ]},
    { label: "Intent-Based SLA Tracking", kpis: [
      { n: "Mortgage Servicing SLA", v: "72%", a: "28% breached — avg 2.1 days" },
      { n: "Fee Dispute SLA", v: "64%", a: "Worst — avg 3.2 days vs 1-day target" },
      { n: "Account Closure SLA", v: "81%", a: "19% breached — retention attempts" },
      { n: "Card Replacement SLA", v: "91%", a: "On track" },
    ]},
  ],
  retail_channel_sentiment: [
    { label: "Channel-Specific Concerns", kpis: [
      { n: "Social (X/Twitter) — Viral Risk", v: "4 posts", a: "Hidden fees trending — 3.4× velocity" },
      { n: "Trustpilot — Rating Drop", v: "3.2 ★", a: "▼0.6 in 4 weeks — fee complaints" },
      { n: "App Store — Feature Requests", v: "68 reviews", a: "'Budgeting tool' most requested" },
      { n: "Voice — Repeat Callers", v: "22%", a: "Fee confusion + transfer loops" },
      { n: "Email — Unresolved Backlog", v: "143", a: "47 > 48h old — mortgage queries" },
    ]},
  ],
  // Head of Contact Centre — agent segmentation + promise adherence
  contact_agent_health: [
    { label: "In-house vs Outsourced Agent Performance", kpis: [
      { n: "In-house FCR", v: "81%", a: "Stable — target 85%" },
      { n: "In-house AHT", v: "6.4 min", a: "Within target" },
      { n: "BPO (Outsourced) FCR", v: "62%", a: "▼8% — evidence collection gaps" },
      { n: "BPO AHT", v: "11.1 min", a: "73% above in-house" },
      { n: "BPO Win Rate (Disputes)", v: "38%", a: "vs 71% in-house — critical gap" },
    ]},
    { label: "Cross-Centre Health Monitor", kpis: [
      { n: "Centre A (London) Health", v: "92%", a: null },
      { n: "Centre B (Manchester) Health", v: "78%", a: "Staffing gap — 8 agents short" },
      { n: "Centre C (BPO Mumbai) Health", v: "64%", a: "Quality + AHT breach" },
      { n: "Centre D (BPO Manila) Health", v: "71%", a: "Authentication pass-rate low" },
      { n: "Centre E (Edinburgh) Health", v: "86%", a: "Evening shift tone concern" },
    ]},
  ],
  contact_promise_adherence: [
    { label: "Promise Adherence by Stage", kpis: [
      { n: "Receiving (Answer SLA)", v: "94%", a: "6% missed in 9–11 AM peak" },
      { n: "Authenticating (ID Verify)", v: "88%", a: "12% fail — KYC handoff broken" },
      { n: "Escalating (Timely Transfer)", v: "76%", a: "3 unactioned > 4h — policy breach" },
      { n: "Resolving (FCR)", v: "74%", a: "HELOC queries driving failures" },
      { n: "Following Up (Callback SLA)", v: "68%", a: "32% callbacks missed/late" },
    ]},
  ],
};

export type ScreenId = 1 | 2 | 3 | 4 | 5;
export type LensId = "ops" | "risk" | "compliance";
export type Industry = (typeof INDUSTRIES)[number];
export type Role = Industry["roles"][number];
export type RoleDashboardData = (typeof ROLE_DATA)["ceo"];
export type LobDataEntry = (typeof LOB_DATA)["retail_banking"];

export function getIndustryById(id: string): Industry | null {
  return INDUSTRIES.find((i) => i.id === id) ?? null;
}

export function resolveIndustryAndRole(
  industryId: string,
  roleId: string,
): { industry: Industry; role: Role } | null {
  const industry = getIndustryById(industryId);
  if (!industry) return null;
  const role = industry.roles.find((r) => r.id === roleId) ?? null;
  if (!role) return null;
  return { industry, role };
}
