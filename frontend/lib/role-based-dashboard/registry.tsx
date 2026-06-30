import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  Crown,
  Globe,
  Headphones,
  Landmark,
  Lock,
  Radio,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { STERLING_BANK_INDUSTRY_ID } from "./sterlingBankIndustry";

export { STERLING_BANK_INDUSTRY_ID };

export const T = {
  bg: "#04080f",
  surface: "#0a1220",
  card: "#0e1830",
  elevated: "#142040",
  border: "#1a2d50",
  borderLight: "#243a60",
  cyan: "#06b6d4",
  cyanGlow: "rgba(6,182,212,0.12)",
  gold: "#eab308",
  goldGlow: "rgba(234,179,8,0.12)",
  green: "#22c55e",
  greenGlow: "rgba(34,197,94,0.1)",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,0.1)",
  amber: "#f59e0b",
  amberGlow: "rgba(245,158,11,0.1)",
  purple: "#a78bfa",
  purpleGlow: "rgba(167,139,250,0.1)",
  blue: "#3b82f6",
  blueGlow: "rgba(59,130,246,0.1)",
  text: "#e2e8f0",
  textSec: "#94a3b8",
  textMut: "#5e718a",
  white: "#fff",
};

export const INDUSTRIES = [
  {
    id: "retail_banking",
    name: "Retail Banking",
    icon: Landmark,
    color: "#06b6d4",
    desc: "Deposits, savings, loans, mortgage, branches, contact centres",
    roles: [
      {
        id: "ceo",
        name: "CEO / Managing Director",
        icon: Crown,
        sub: "Enterprise-wide promise health across all LOBs",
        defaultLens: "ops",
        primaryTile: null,
      },
      {
        id: "coo",
        name: "COO",
        icon: Briefcase,
        sub: "Operational efficiency, SLA compliance, workforce, Eisenhower priorities",
        defaultLens: "ops",
        primaryTile: 1,
      },
      {
        id: "cro",
        name: "CRO / Chief Risk Officer",
        icon: Shield,
        sub: "Fraud signals, regulatory exposure, compliance health",
        defaultLens: "risk",
        primaryTile: 2,
      },
      {
        id: "head_retail",
        name: "Head of Retail Banking",
        icon: Building2,
        sub: "Deposits, loans, branches — service promise + complaints",
        defaultLens: "ops",
        primaryTile: 0,
      },
      {
        id: "head_cx",
        name: "Head of Customer Experience",
        icon: Headphones,
        sub: "NPS, sentiment, effort, journeys, social perception",
        defaultLens: "ops",
        primaryTile: 0,
      },
      {
        id: "head_compliance",
        name: "Head of Compliance",
        icon: Lock,
        sub: "CFPB/OCC risk, audit readiness, complaint aging",
        defaultLens: "compliance",
        primaryTile: 2,
      },
      {
        id: "head_contact",
        name: "Head of Contact Centre",
        icon: Users,
        sub: "Per-contact CX · service-driven brand · ops & workforce",
        defaultLens: "ops",
        primaryTile: 0,
      },
    ],
  },
  {
    id: "sterling_bank",
    name: "Sterling Bank",
    icon: Building2,
    color: "#3b82f6",
    desc: "Deposits, loans, branches, contact centres — service promise & CX",
    roles: [
      {
        id: "head_retail",
        name: "Head of Retail Banking",
        icon: Building2,
        sub: "Deposits, loans, branches — service promise + complaints",
        defaultLens: "ops",
        primaryTile: 0,
      },
      {
        id: "head_contact",
        name: "Head of Contact Centre",
        icon: Users,
        sub: "Per-contact CX · service-driven brand · ops & workforce",
        defaultLens: "ops",
        primaryTile: 0,
      },
    ],
  },
  {
    id: "credit_cards",
    name: "Credit Cards",
    icon: CreditCard,
    color: "#eab308",
    desc: "Card portfolio, disputes, fraud, rewards, collections",
    roles: [
      {
        id: "ceo",
        name: "CEO / MD",
        icon: Crown,
        sub: "Card portfolio health — promise, stability, risk",
      },
      {
        id: "head_cards",
        name: "Head of Credit Cards",
        icon: CreditCard,
        sub: "Executive view · portfolio tiles · AI risk spike monitor · day generator",
      },
      {
        id: "cards_portfolio",
        name: "Cards Portfolio Manager",
        icon: BarChart3,
        sub: "LiSN morning brief · transaction × voice joins · routed anomaly signals",
      },
      {
        id: "cards_portfolio_v2",
        name: "Cards Portfolio Manager (v2)",
        icon: BarChart3,
        sub: "Transactions & offers · blockers & problems · 2 drilldowns · AI Analyst",
      },
      {
        id: "head_fraud",
        name: "Head of Fraud",
        icon: Shield,
        sub: "CNP patterns, MCC clustering, merchant breaches",
      },
      {
        id: "head_compliance",
        name: "Head of Compliance",
        icon: Lock,
        sub: "Reg E/Z, Visa/MC chargeback, CFPB risk",
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: ShoppingCart,
    color: "#22c55e",
    desc: "Marketplace, seller quality, fulfilment, returns, support",
    roles: [
      {
        id: "ceo",
        name: "CEO / MD",
        icon: Crown,
        sub: "Marketplace health, satisfaction, stability",
      },
      {
        id: "business_head",
        name: "Business Head",
        icon: Briefcase,
        sub: "Category P&L, returns margin, seller trust",
      },
      {
        id: "head_cx",
        name: "Head of CX",
        icon: Headphones,
        sub: "Contact volume, refunds, delivery complaints",
      },
      {
        id: "head_cx_retail",
        name: "Head of CX (Retail)",
        icon: Building2,
        sub: "Fluid CX — store pickup, delivery, returns, omnichannel",
        defaultLens: "ops",
        primaryTile: 0,
      },
      {
        id: "head_cx_retail_v2",
        name: "Head of CX (Retail) · V2",
        icon: Building2,
        sub: "Compact Fluid CX — UI refresh",
        defaultLens: "ops",
        primaryTile: 0,
      },
      {
        id: "head_marketplace",
        name: "Head of Marketplace",
        icon: BarChart3,
        sub: "Seller scorecards, fulfilment, returns",
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: ShieldCheck,
    color: "#a78bfa",
    desc: "Claims, policy servicing, agent quality, compliance",
    roles: [
      {
        id: "ceo",
        name: "CEO / MD",
        icon: Crown,
        sub: "Claims health, servicing quality, exposure",
      },
      {
        id: "head_claims",
        name: "Head of Claims",
        icon: BarChart3,
        sub: "Cycle time, adjuster quality, fraud, SLA",
      },
    ],
  },
  {
    id: "openbank",
    name: "Openbank",
    icon: Globe,
    color: "#ec0000",
    desc: "US digital banking · CX intelligence · money access, recovery, and public voice",
    roles: [
      {
        id: "ceo_insight",
        icon: Crown,
        sub: "Trust brief · public voice · fix progress — CX Command Center",
        defaultLens: "ops",
        primaryTile: null,
      },
    ],
  },
  {
    id: "rbi_conduct",
    name: "RBI Conduct Intelligence",
    icon: ShieldCheck,
    color: "#14b8a6",
    desc:
      "Post-Nov 2025 RBI rulebook · obligation coverage · outbound conduct · contact-centre intelligence",
    roles: [
      {
        id: "head_product_digital",
        name: "Head of Product / Digital (L1)",
        icon: Target,
        sub: "Digital journey · KFS · disclosure-in-conversation · product-flow conduct",
        defaultLens: "compliance",
        primaryTile: null,
      },
      {
        id: "cro_conduct",
        name: "CRO / Chief Conduct Officer (L4)",
        icon: Shield,
        sub: "Regulatory exposure · vendor governance · 30-Jun & 1-Jul 2026 deadlines",
        defaultLens: "risk",
        primaryTile: null,
      },
      {
        id: "head_cx",
        name: "Head of CX (L3)",
        icon: Headphones,
        sub: "Daily worklist · missed complaints · first-90s adherence · repeat / FCR",
        defaultLens: "ops",
        primaryTile: null,
      },
      {
        id: "cco_customer",
        name: "Chief Customer Officer (L2)",
        icon: Users,
        sub: "Vulnerable care · bereavement · borrower distress · bundling pressure",
        defaultLens: "ops",
        primaryTile: null,
      },
      {
        id: "io_office",
        name: "Internal Ombudsman (L5)",
        icon: Lock,
        sub: "Escalations · IO referrals · RB-IOS exposure pre-screen",
        defaultLens: "compliance",
        primaryTile: null,
      },
      {
        id: "board_nrc",
        name: "Board / NRC (L1)",
        icon: Crown,
        sub: "Board pack · top-5 grounds engine · disclosure-in-conversation",
        defaultLens: "compliance",
        primaryTile: null,
      },
    ],
  },
  {
    id: "fastag",
    name: "FASTag",
    icon: Radio,
    color: "#7B2FF0",
    desc:
      "Setu FASTag · 18M TIF · BPO governance · plaza leakage · IO defensibility",
    roles: [
      {
        id: "head_business",
        name: "Head of Business",
        icon: Crown,
        sub: "Morning brief · issuance health · excess toll refunds · IO readiness · corridor risk",
        defaultLens: "ops",
        primaryTile: null,
      },
      {
        id: "head_cx",
        name: "Head of CX (Customer Operations)",
        icon: Headphones,
        sub: "Operations Console · shift handover · BPO heatmap · OC 005 evidence · Saksham conduct",
        defaultLens: "ops",
        primaryTile: null,
      },
    ],
  },
  {
    id: "nuvama",
    name: "Nuvama",
    icon: BarChart3,
    color: "#0B4F8A",
    desc: "Wealth advisory · broking · asset management · HNI client servicing",
    roles: [
      {
        id: "head_client_experience",
        name: "Head of Client Experience",
        icon: Headphones,
        sub: "Client sentiment · RM service quality · advisory journeys · escalation & retention",
        defaultLens: "ops",
        primaryTile: 0,
      },
    ],
  },
];

// ═══════════════════════════
// ROLE-SPECIFIC DATA FOR RETAIL BANKING
// ═══════════════════════════
export const ROLE_DATA = {
  ceo: {
    tiles: [
      {
        title: "Promise Health",
        score: 74,
        color: T.cyan,
        icon: Target,
        sub: "CX + Sentiment + Effort + Accuracy",
        insight:
          "Reward satisfaction dropped 12 pts — program change backlash. 412 calls mentioned competitor offers. Onboarding drop-off at 18% from KYC lag.",
        kpis: [
          { l: "CX Composite", v: "72" },
          { l: "Sentiment", v: "0.58" },
          { l: "Effort", v: "3.2" },
          { l: "FCR", v: "74%" },
        ],
      },
      {
        title: "Operational Stability",
        score: 68,
        color: T.gold,
        icon: Activity,
        sub: "Volume vs Capacity + SLA Risk",
        insight:
          "Volume exceeded capacity 32% between 9–11 AM. BPO evidence collection 2.7× slower. Dispute backlog grew 8% this week.",
        kpis: [
          { l: "Vol vs Cap", v: "112%" },
          { l: "SLA", v: "87%" },
          { l: "Backlog", v: "1,847" },
          { l: "Avg Res.", v: "6.8d" },
        ],
      },
      {
        title: "Risk Exposure",
        score: 58,
        color: T.red,
        icon: Shield,
        sub: "Fraud + Regulatory + Reputation",
        insight:
          "Fraud cluster in FL — 23 calls match social engineering script. 7 complaints at >60% CFPB escalation. Merchant breach: 1,247 cards exposed.",
        kpis: [
          { l: "Fraud Signals", v: "69" },
          { l: "Reg Risk", v: "7" },
          { l: "Social Vel.", v: "3.4×" },
          { l: "Breach", v: "1,247" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Customer Promise Score",
        v: "76",
        delta: -2,
        target: "> 80",
        st: "amber",
      },
      {
        l: "Complaint Volume",
        v: "312",
        delta: +28,
        target: "< 250",
        st: "red",
      },
      {
        l: "First Contact Resolution",
        v: "74%",
        delta: -3,
        target: "> 80%",
        st: "red",
      },
      {
        l: "Onboarding Drop-off",
        v: "18%",
        delta: +2,
        target: "< 12%",
        st: "amber",
      },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
    ],
    insights: [
      "Onboarding delays and complaint spike driven by KYC processing lag — API latency increased 3× since Tuesday.",
      "FCR drop concentrated in HELOC product — agents lack rate-lookup tool access after system update.",
    ],
    eisenhower: {
      do: [
        "KYC API fix — 18% onboarding drop",
        "HELOC rate-lookup restoration",
      ],
      plan: ["BPO quality review", "Agent training on fees"],
      delegate: ["3 branch ATM outages", "Social media viral post response"],
      monitor: ["Quarterly report formatting", "Dashboard updates"],
    },
  },
  coo: {
    tiles: [
      {
        title: "Promise Health",
        score: 74,
        color: T.cyan,
        icon: Target,
        sub: "CX + Sentiment + Effort + Accuracy",
        insight:
          "FCR at 74% — below 80% target for 3rd week. Root cause: HELOC tool down + new fee confusion across 7 agents.",
        kpis: [
          { l: "CX Composite", v: "72" },
          { l: "FCR", v: "74%" },
          { l: "Effort", v: "3.2" },
          { l: "Repeat Rate", v: "22%" },
        ],
      },
      {
        title: "Operational Stability",
        score: 62,
        color: T.red,
        icon: Activity,
        sub: "Volume · Capacity · Throughput · SLA",
        insight:
          "Staffing gap: 12 agents short in 10–12 PM window. BPO 2.7× slower on evidence collection. Backlog age: 312 cases >48h and growing 8%/week.",
        kpis: [
          { l: "Vol vs Cap", v: "112%" },
          { l: "SLA", v: "87%" },
          { l: "AHT", v: "8.3m" },
          { l: "Backlog >48h", v: "312" },
        ],
      },
      {
        title: "Risk Exposure",
        score: 64,
        color: T.amber,
        icon: Shield,
        sub: "Fraud + Regulatory + Reputation",
        insight:
          "7 complaints approaching CFPB deadline. Social velocity at 3.4× baseline — reward backlash spreading.",
        kpis: [
          { l: "Fraud Signals", v: "69" },
          { l: "SLA Breach", v: "43" },
          { l: "Social Vel.", v: "3.4×" },
          { l: "Unactioned", v: "3" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Volume vs Capacity",
        v: "112%",
        delta: +8,
        target: "< 100%",
        st: "red",
      },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
      {
        l: "Avg Handle Time",
        v: "8.3m",
        delta: +0.8,
        target: "< 8 min",
        st: "amber",
      },
      {
        l: "Agent Utilisation",
        v: "94%",
        delta: +3,
        target: "< 88%",
        st: "red",
      },
      {
        l: "Backlog Age (>48h)",
        v: "312",
        delta: +47,
        target: "< 100",
        st: "red",
      },
    ],
    insights: [
      "Volume exceeded capacity by 32% between 9–11 AM — driven by KYC API failure generating 340 extra calls.",
      "BPO Vendor Beta evidence collection step is 2.7× slower than in-house, eroding representment win rate to 38%.",
      "Staffing gap: 12 agents short in 10AM–12PM window. Recommend overflow activation before 9:45 AM.",
    ],
    eisenhower: {
      do: [
        "Activate 12 overflow agents before 9:45 AM",
        "BPO evidence collection SLA escalation",
      ],
      plan: [
        "Agent cross-training for HELOC queries",
        "Workforce model recalibration",
      ],
      delegate: [
        "ATM outage customer redirect",
        "Statement confusion FAQ update",
      ],
      monitor: ["Evening shift overtime costs", "New hire pipeline status"],
    },
  },
  cro: {
    tiles: [
      {
        title: "Risk Appetite & Consumer Duty",
        score: 76,
        color: T.cyan,
        icon: Target,
        sub: "Risk Appetite · FCA Consumer Duty · SMCR",
        insight:
          "Risk appetite score 76/100 — Consumer Duty pillar 4 (Harm Prevention) at 73%, dragging overall. SMCR clean but 3 CRO findings open. FCA Consumer Duty becoming global standard.",
        kpis: [
          { l: "Risk Appetite", v: "76" },
          { l: "Consumer Duty", v: "82%" },
          { l: "SMCR Breaches", v: "0" },
          { l: "Open Findings", v: "3" },
        ],
      },
      {
        title: "Financial Crime & AML",
        score: 58,
        color: T.red,
        icon: Shield,
        sub: "SAR Pipeline · AML · Fraud · Money Laundering",
        insight:
          "47 open SARs — 12 new this week. Third-party coaching detected in 18 calls (FL cluster). Source-of-funds compliance at 76% — well below 95% target. Conversation-derived risk profiles flagging organised pattern.",
        kpis: [
          { l: "Open SARs", v: "47" },
          { l: "AML Alerts/day", v: "34" },
          { l: "Fraud Signals", v: "69" },
          { l: "SOF Compliance", v: "76%" },
        ],
      },
      {
        title: "Vulnerable Customer & Conduct",
        score: 64,
        color: T.amber,
        icon: Activity,
        sub: "Vulnerability Detection · Mis-selling · Conduct Risk",
        insight:
          "234 vulnerable customers flagged — 81% confirmed. 26 mis-selling flags across LOBs. 6% of mortgage renewal calls missed vulnerability signals. Conversation intelligence detecting what agents miss.",
        kpis: [
          { l: "Vulnerable Flags", v: "234" },
          { l: "Mis-sell Risk", v: "26" },
          { l: "Detection Rate", v: "94.2%" },
          { l: "Agent Gaps", v: "7" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "SAR Pipeline (Open)",
        v: "47",
        delta: +12,
        target: "< 30",
        st: "red",
      },
      {
        l: "Consumer Duty Score",
        v: "82%",
        delta: -3,
        target: "> 90%",
        st: "amber",
      },
      {
        l: "Fraud Detection Rate",
        v: "82%",
        delta: -3,
        target: "> 90%",
        st: "red",
      },
      {
        l: "Vulnerable Customer Detection",
        v: "94.2%",
        delta: +3.1,
        target: "> 95%",
        st: "amber",
      },
      {
        l: "Mis-selling / Conduct Flags",
        v: "26",
        delta: +8,
        target: "0",
        st: "red",
      },
    ],
    insights: [
      "Third-party coaching detected in 18 calls (FL cluster) — NLP flagged scripted responses during KYC. Conversation-derived risk profiles correlating with dormant account reactivation. SAR filing required within 24h.",
      "Consumer Duty pillar 4 (Harm Prevention) at 73% — 7 mis-selling flags from collections scripts + 6% vulnerability protocol bypasses on mortgage renewals. FCA regulatory risk imminent.",
      "Cross-jurisdictional gap: APAC operations below UK Consumer Duty standard — highest jurisdiction controls must apply. 3 compliance gaps identified in APAC + US.",
    ],
    eisenhower: {
      do: [
        "File SARs for 18 FL coaching-flagged accounts",
        "Halt collections script variant A — RESPA + UDAAP",
      ],
      plan: [
        "Consumer Duty pillar 4 remediation plan",
        "Cross-jurisdiction compliance alignment",
      ],
      delegate: [
        "Vulnerability tool UX fix (reduce clicks)",
        "AML training refresh for 7 agents below threshold",
      ],
      monitor: ["SMCR exposure tracking", "Insurance claims fraud trend"],
    },
  },
  cards_portfolio: {
    tiles: [
      {
        title: "How are my transactions & offers doing?",
        score: 64,
        color: T.cyan,
        icon: Target,
        sub: "Spend, offers, yield & reward economics",
        insight:
          "Offer incrementality vs a matched control flags two net-negative offers (₹1.3 Cr reallocatable); the RuPay-on-UPI mix shift is compressing interchange yield ~₹1.2 Cr while GMV holds, and one category turned reward-negative — all judged against each cell's own seasonal baseline.",
        kpis: [
          { l: "Spend vs base", v: "+6.2%" },
          { l: "Offers to kill", v: "2" },
          { l: "Yield leak", v: "₹1.2 Cr" },
          { l: "Reward-neg", v: "+1 cat" },
        ],
      },
      {
        title: "Where are my blockers & problems today?",
        score: 58,
        color: T.amber,
        icon: Activity,
        sub: "Declines, fraud-rule, token gaps, roll & 30+7 clock",
        insight:
          "Decline taxonomy splits today's spike as a token break (₹2.4 Cr, 62% curable); fraud-rule R-77 stepped approval down 13 pts; tokenised CNP is approving below non-tokenised; and Batch #4471 risks ₹93 L CAC against the RBI 30+7 closure clock.",
        kpis: [
          { l: "Recoverable", v: "₹2.4 Cr" },
          { l: "Approval drop", v: "−13 pts" },
          { l: "CAC @ Risk", v: "₹93 L" },
          { l: "Token gap", v: "1 path" },
        ],
      },
      {
        title: "Transaction × voice — the LiSN join",
        score: 60,
        color: T.purple,
        icon: Sparkles,
        sub: "LiSN ONLY · the join nobody else makes — cause + ₹ with the alert",
        insight:
          "Decline-spike ↔ 'payment-failed' voice on one timeline names the cause same-morning; a fraud-rule misfire is confirmed in voice within 2h; hardship language leads the 0→30 roll by ~2 weeks; and 4 late-fee cases sit inside the 30-day IO clock. A join no self-built dashboard makes.",
        kpis: [
          { l: "Live joins", v: "15" },
          { l: "Voice lead", v: "~2 wks" },
          { l: "IO clock", v: "4 cases" },
          { l: "Recoverable", v: "₹2.4 Cr" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Curable-Decline Recovery (today)",
        v: "₹2.4 Cr",
        delta: +12,
        target: "capture",
        st: "amber",
      },
      {
        l: "Approval-Rate Drop",
        v: "−18 pts",
        delta: -18,
        target: "0",
        st: "red",
      },
      {
        l: "Ombudsman-Clock Cases",
        v: "4",
        delta: +3,
        target: "0",
        st: "red",
      },
      {
        l: "Weak-Auth Exposure",
        v: "₹6–9L",
        delta: +6,
        target: "0",
        st: "red",
      },
      {
        l: "Voice→Roll Lead-time",
        v: "~2 wks",
        delta: 0,
        target: "early",
        st: "amber",
      },
    ],
    insights: [
      "Transactions & offers (txn-only): two offers run net-negative vs control (₹1.3 Cr reallocatable) and the RuPay-on-UPI shift is compressing interchange yield ~₹1.2 Cr while GMV holds.",
      "Blockers & problems (txn-only): today's decline spike is a token break (₹2.4 Cr, 62% curable); fraud-rule R-77 stepped approval −13 pts; Batch #4471 risks ₹93 L CAC on the 30+7 clock.",
      "Transaction × voice (LiSN only): the decline-spike ↔ voice join names the cause same-morning, a fraud-rule misfire is confirmed in 2h, and hardship leads the 0→30 roll by ~2 weeks — a join no self-built dashboard makes.",
    ],
    eisenhower: {
      do: [
        "Route the CoFT re-tokenisation fix to Ops; approve the recovery nudge draft",
        "Re-open 4 late-fee cases before the IO decision window closes",
      ],
      plan: [
        "Scope weak-auth feed before committing the liability monitor to MVP",
        "Fair-offer hardship outreach for the genuine-hardship sub-segment",
      ],
      delegate: [
        "Brief resolution queue Q-07 on the late-fee misconfiguration",
        "Co-brand retention draft for the attrition cohort",
      ],
      monitor: [
        "Fraud-rule R-77 rollback impact on good-customer declines",
        "Activation curve vs the 30+7 closure clock for batch #4471",
      ],
    },
  },
  head_retail: {
    tiles: [
      {
        title: "Are our Customers happy?",
        score: 72,
        color: T.amber,
        icon: Target,
        sub: "HV vs LV Happiness · Top Pain · Churn Risk",
        insight:
          "32% flagged unhappy, mostly on mortgage servicing & fee confusion. Low-value: 81% happy. 3 HNI at 72–89% churn probability. Top driver of unhappiness: EMI failures (31%), fee confusion (24%).",
        kpis: [
          { l: "HV Happy", v: "68%" },
          { l: "LV Happy", v: "81%" },
          { l: "Top Pain", v: "EMI 31%" },
          { l: "Churn Risk", v: "3 HNI" },
        ],
      },
      {
        title: "Is the Brand at risk?",
        score: 64,
        color: T.amber,
        icon: Shield,
        sub: "Channel Sentiment · Key Insights · Trustpilot",
        insight:
          "Below 0.65 target. Best channel: App Store (0.71). Worst: Social/X (0.41) driven by fee complaints. Trustpilot dropped to 3.2 from 3.8. Key this week: 2 new product features surfaced from customer conversations.",
        kpis: [
          { l: "Sentiment", v: "0.58" },
          { l: "Trustpilot", v: "3.2 ▼" },
          { l: "Best Channel", v: "App 0.71" },
          { l: "Key Insights", v: "2 new" },
        ],
      },
      {
        title: "How is our Service delivery?",
        score: 68,
        color: T.gold,
        icon: Activity,
        sub: "Best vs Worst SLA · Trend · Bottleneck",
        insight:
          "Best: Card Replacement at 91% SLA. Worst: Fee Dispute at 64% — avg 3.2 days vs 1-day target. Overall SLA trending down 6% this week. Root cause: KYC API delays blocking 580 applications and slowing dispute resolution.",
        kpis: [
          { l: "Best SLA", v: "91%" },
          { l: "Worst SLA", v: "64%" },
          { l: "Trend", v: "▼ −6%" },
          { l: "Bottleneck", v: "KYC" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "High-Value Customer Calls",
        v: "312",
        delta: +28,
        target: "< 250",
        st: "red",
      },
      {
        l: "Cross-Channel Sentiment",
        v: "0.58",
        delta: -0.08,
        target: "> 0.65",
        st: "red",
      },
      {
        l: "Intent SLA Compliance (Avg)",
        v: "77%",
        delta: -6,
        target: "> 90%",
        st: "red",
      },
      {
        l: "Social Virality Index",
        v: "3.4×",
        delta: +1.2,
        target: "< 1.5×",
        st: "red",
      },
      {
        l: "HNI Churn Probability (Top 3)",
        v: "72–89%",
        delta: +12,
        target: "< 30%",
        st: "red",
      },
    ],
    insights: [
      "High-value customers calling mostly about mortgage servicing (31%) and fee confusion (24%) — these are the biggest pain points driving churn risk.",
      "Cross-channel sentiment at 0.58 — Trustpilot dropped 0.6 pts, 4 viral X posts about 'hidden fees'. Brand reputation risk escalating.",
      "Fee Dispute intent has worst SLA at 64% — avg resolution 3.2 days vs 1-day target. KYC API bottleneck blocking 580 onboarding applications.",
    ],
    eisenhower: {
      do: [
        "Proactive outreach to 3 HNI churn risks ($1.2M combined deposits)",
        "Fee Dispute SLA remediation — 3.2 day avg is 3× target",
      ],
      plan: [
        "KYC API bottleneck fix — 580 abandoned apps",
        "Cross-channel sentiment recovery plan",
      ],
      delegate: [
        "Trustpilot response strategy",
        "Social media viral post containment",
      ],
      monitor: [
        "Intent heat map for emerging patterns",
        "Channel-specific concern trends",
      ],
    },
  },
  sterling_head_retail: {
    tiles: [
      {
        title: "Are we leaking deposits at the door?",
        score: 61,
        color: T.amber,
        icon: Target,
        sub: "Savings declines · HV outflow · no-reason gap",
        insight:
          "57% of savings applicants declined with no reason — FOS upheld a conflicting-explanation case. HV savers withdrawing ~£310K/wk. Draft reason-code disclosure review — never auto-send.",
        kpis: [
          { l: "Avg balance", v: "£4,241" },
          { l: "Declined, no reason", v: "57%" },
          { l: "HV savers hit", v: "[CONFIRM]" },
          { l: "Est. £ leak/wk", v: "£310K" },
        ],
      },
      {
        title: "Is our deposit base flying out?",
        score: 58,
        color: T.red,
        icon: Shield,
        sub: "Interest flight · primacy · CASS outflow",
        insight:
          "ARPAU £302→£275. 'Moving to Chase/Monzo/Nationwide' in voice before balances clear. Switch intent leads CASS by ~3 months. Draft save-offer for flight-risk cohort.",
        kpis: [
          { l: "ARPAU", v: "£275 ▼" },
          { l: "Retail primacy", v: "35%" },
          { l: "CASS net", v: "net loss" },
          { l: "£/wk leaving", v: "£[CONFIRM]" },
        ],
      },
      {
        title: "Are we losing viable new customers?",
        score: 63,
        color: T.amber,
        icon: Activity,
        sub: "Onboarding block · viable rejected · growth lost",
        insight:
          "Post-fine KYC suppressing viable acquisition — ~£2.3M growth lost and viable-but-rejected CX worsening. Escalate KYC-criteria calibration to CRO; Raghu's slice = growth lost + experience of viable-rejected.",
        kpis: [
          { l: "Growth lost", v: "£2.3M" },
          { l: "Viable rejected", v: "↑ rising" },
          { l: "SME when eased", v: "3× openings" },
          { l: "CX harm", v: "decline gap" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "ARPAU (£/active user)",
        v: "£275",
        delta: -27,
        target: "> £302",
        st: "red",
      },
      {
        l: "Retail primacy",
        v: "35%",
        delta: -3,
        target: "> 40%",
        st: "red",
      },
      {
        l: "CASS net flows",
        v: "net loss",
        delta: -1,
        target: "net gain",
        st: "red",
      },
      {
        l: "Savings decline (no-reason)",
        v: "57%",
        delta: +9,
        target: "< 20%",
        st: "red",
      },
      {
        l: "SME primacy",
        v: "56%",
        delta: +2,
        target: "> 60%",
        st: "amber",
      },
    ],
    insights: [
      "Deposits leak at acquisition (savings declines, no reason given) and fly at retention (interest-removal flight to Chase/Monzo/Nationwide) — ARPAU £302→£275, net CASS losses.",
      "Switching intent appears in voice ~3 months before provider-level CASS data — primacy erosion is visible now, not at quarter-end.",
      "Post-fine KYC tightening suppresses viable acquisition; CFO confirms SME openings tripled in April once eased. SME deepening via MTD/Ember (compulsory 6 Apr 2026, >£50k) is the live growth front.",
    ],
    eisenhower: {
      do: [
        "Draft save-offer for flight-risk deposit cohort (never auto-send)",
        "Draft reason-code disclosure review for high-balance savings declines",
      ],
      plan: [
        "Escalate KYC-criteria calibration to CRO — Raghu tracks growth lost + viable-rejected CX",
        "Easy-Saver fast-track for flight-risk savers",
      ],
      delegate: [
        "SME MTD/Ember stalled-adopter guidance + accountant-referral play",
        "Route rule-tuning to fraud-ops; track containment cost-to-serve here",
      ],
      monitor: [
        "CASS net flows vs switching-intent voice (3-month lead)",
        "Primacy decay among salaried/primary relationships",
      ],
    },
  },
  head_cx: {
    tiles: [
      {
        title: "Promise Health",
        score: 72,
        color: T.cyan,
        icon: Target,
        sub: "Customer Sentiment + Effort + Journeys",
        insight:
          "Sentiment crossed below 0.60 threshold — 2nd consecutive week. Repeat contact rate at 22%. Customer effort score 3.2 (above 3.0 target).",
        kpis: [
          { l: "NPS", v: "+38" },
          { l: "Sentiment", v: "0.58" },
          { l: "Effort Score", v: "3.2" },
          { l: "Repeat Rate", v: "22%" },
        ],
      },
      {
        title: "Operational Stability",
        score: 68,
        color: T.gold,
        icon: Activity,
        sub: "Channel Health + Resolution Quality",
        insight:
          "Social channel sentiment at 0.41 — dragged by reward backlash. Voice channel FCR at 74%. Chat containment steady at 62%.",
        kpis: [
          { l: "FCR", v: "74%" },
          { l: "CSAT", v: "81%" },
          { l: "Chat Contain", v: "62%" },
          { l: "Abandon Rate", v: "8.2%" },
        ],
      },
      {
        title: "Risk Exposure",
        score: 60,
        color: T.amber,
        icon: Shield,
        sub: "Reputation + Churn + Social Virality",
        insight:
          "3 high-value customers at 72–89% churn probability. Social velocity 3.4× baseline. Complaint-to-social conversion rate at 4.2%.",
        kpis: [
          { l: "Churn Risk", v: "3 HNI" },
          { l: "Social Vel.", v: "3.4×" },
          { l: "Cmpl→Social", v: "4.2%" },
          { l: "App Rating", v: "4.1 ▼" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Net Promoter Score",
        v: "+38",
        delta: -6,
        target: "> 44",
        st: "red",
      },
      {
        l: "Customer Sentiment",
        v: "0.58",
        delta: -0.08,
        target: "> 0.65",
        st: "red",
      },
      {
        l: "Customer Effort Score",
        v: "3.2",
        delta: +0.3,
        target: "< 3.0",
        st: "amber",
      },
      {
        l: "Repeat Contact Rate",
        v: "22%",
        delta: +4,
        target: "< 15%",
        st: "red",
      },
      {
        l: "Complaint-to-Social Rate",
        v: "4.2%",
        delta: +1.1,
        target: "< 2%",
        st: "red",
      },
    ],
    insights: [
      "NPS dropped 6 points in 4 weeks. Root cause: 67% of detractors mention 'fee confusion' or 'transferred too many times'.",
      "3 high-value customers (combined deposits $1.2M) showing escalating frustration + competitor mentions. Churn probability 72–89%.",
      "Complaint-to-social conversion at 4.2% — customers who file complaints are posting on social within 48h at 2× prior rate.",
    ],
    eisenhower: {
      do: [
        "Proactive RM outreach to 3 HNI churn risks",
        "Social response to reward backlash post",
      ],
      plan: [
        "IVR redesign — 40% drop-off at step 3",
        "Cross-channel journey mapping rollout",
      ],
      delegate: ["App store review response", "FAQ content update"],
      monitor: ["Sentiment trend recovery", "NPS survey response rate"],
    },
  },
  head_compliance: {
    tiles: [
      {
        title: "Promise Health",
        score: 74,
        color: T.cyan,
        icon: Target,
        sub: "Compliance + Regulatory Adherence",
        insight:
          "Compliance health at 91% — Cards unit dragging at 88%. Recording consent compliance at 99.2% but 0.8% miss rate = 240 calls/month at risk.",
        kpis: [
          { l: "Compliance", v: "91%" },
          { l: "Consent Rate", v: "99.2%" },
          { l: "Script Adhere", v: "94%" },
          { l: "Audit Trail", v: "88%" },
        ],
      },
      {
        title: "Operational Stability",
        score: 68,
        color: T.gold,
        icon: Activity,
        sub: "Complaint SLAs + Documentation",
        insight:
          "43 disputes approaching Reg E deadline. 312 open complaints — 28 new this week. Documentation gaps at 12%.",
        kpis: [
          { l: "Reg E Cases", v: "43" },
          { l: "Complaints", v: "312" },
          { l: "Doc Gaps", v: "12%" },
          { l: "SLA Breach", v: "7" },
        ],
      },
      {
        title: "Risk Exposure",
        score: 48,
        color: T.red,
        icon: Shield,
        sub: "CFPB + UDAAP + State Regulations",
        insight:
          "7 complaints at >60% CFPB escalation probability. 6 UDAAP / mis-selling referrals from collections. PEP screening gaps detected on 3 onboarding calls.",
        kpis: [
          { l: "CFPB Risk", v: "7" },
          { l: "UDAAP Flags", v: "6" },
          { l: "PEP Gaps", v: "3" },
          { l: "State Reg.", v: "96%" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Compliance Health Score",
        v: "91%",
        delta: -1,
        target: "> 95%",
        st: "amber",
      },
      {
        l: "CFPB Escalation Risk",
        v: "7 cases",
        delta: +3,
        target: "0",
        st: "red",
      },
      {
        l: "Recording Consent Miss",
        v: "0.8%",
        delta: +0.1,
        target: "0%",
        st: "amber",
      },
      {
        l: "UDAAP / Mis-selling Flags",
        v: "6",
        delta: +4,
        target: "0",
        st: "red",
      },
      {
        l: "Documentation Completeness",
        v: "88%",
        delta: -2,
        target: "> 95%",
        st: "red",
      },
    ],
    insights: [
      "7 complaints have >60% probability of CFPB escalation — all in overdraft fee and loan servicing categories. Immediate prioritisation required.",
      "6 UDAAP flags from outbound collections on rate-reset mortgage accounts — script does not meet RESPA timing requirements.",
      "PEP screening not triggered on 3 onboarding calls this week — process gap in digital-to-voice handoff.",
    ],
    eisenhower: {
      do: [
        "Prioritise 7 CFPB-risk complaints — response within 24h",
        "Halt collections script variant A — RESPA non-compliant",
      ],
      plan: [
        "PEP screening process fix for digital handoff",
        "Documentation completeness audit",
      ],
      delegate: [
        "State regulation compliance refresh training",
        "Consent disclosure script update",
      ],
      monitor: ["Compliance score trend by unit", "Regulatory exam calendar"],
    },
  },
  head_contact: {
    // sterling_bank/head_contact resolves here via resolveRoleDataKey() — same as retail_banking/head_contact.
    tiles: [
      {
        title: "Are contacts ending well?",
        score: 72,
        color: T.cyan,
        icon: Target,
        sub: "Per-interaction outcome quality",
        insight:
          "Post-CSAT 87% and FCR 78% remain under pressure as repeat-contact rises to 14%. Sentiment-at-close is softening, signaling avoidable poor endings across voice and chat.",
        kpis: [
          { l: "Post-CSAT", v: "87%" },
          { l: "FCR", v: "78%" },
          { l: "Repeat Contact", v: "14%" },
          { l: "Sentiment@Close", v: "72%" },
        ],
      },
      {
        title: "Is service hurting our reputation?",
        score: 62,
        color: T.amber,
        icon: Shield,
        sub: "Brand & regulatory exposure from CC failures",
        insight:
          "Service-driven complaint spillover is rising across Trustpilot, App Store, and X. CFPB-risk cases and escalation velocity indicate contact-center issues are now visible as brand risk.",
        kpis: [
          { l: "Open Complaints", v: "247" },
          { l: "CFPB-risk Cases", v: "18" },
          { l: "Escalation", v: "12%" },
          { l: "Social Spillover", v: "38%" },
        ],
      },
      {
        title: "Can the engine deliver?",
        score: 60,
        color: T.red,
        icon: Activity,
        sub: "Workforce, SLA, BPO, capacity",
        insight:
          "SLA 80/20 is running below target at 76/22 with 6.4% abandon and 42s ASA. BPO drag and avoidable contacts continue to drive weekly cost-at-risk and workforce stress.",
        kpis: [
          { l: "SL 80/20", v: "76/22" },
          { l: "Abandon", v: "6.4%" },
          { l: "Sched Adherence", v: "91%" },
          { l: "Occupancy", v: "88%" },
        ],
      },
    ],
    lobKpis: [
      {
        l: "Post-Contact CSAT",
        v: "78%",
        delta: -4,
        target: "> 85%",
        st: "amber",
      },
      {
        l: "Repeat Contact Rate",
        v: "22%",
        delta: +4,
        target: "< 15%",
        st: "red",
      },
      {
        l: "Service-Driven Brand Sentiment",
        v: "0.46",
        delta: -0.09,
        target: "> 0.65",
        st: "red",
      },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
      {
        l: "BPO vs In-house FCR Gap",
        v: "19 pts",
        delta: +6,
        target: "< 5 pts",
        st: "red",
      },
    ],
    insights: [
      "Per-contact resolution quality eroding: 22% repeat-contact rate + 7% premature closure. Fee Dispute and HELOC clusters account for 49% of repeats — playbooks/macros missing.",
      "Service-driven brand decay is concentrated on X and App reviews. 4 viral posts about hold-time + 68 'no one answered' app reviews suggest staffing-gap visibility on the outside.",
      "BPO Vendor Beta is the top operational risk — 19pt FCR gap, 38% dispute win-rate vs 71% in-house. Evidence-collection step 4 days slower; representment training missing.",
    ],
    eisenhower: {
      do: [
        "Activate 12 overflow agents before 9:45 AM peak",
        "BPO Vendor Beta QA escalation — 38% win rate unacceptable",
      ],
      plan: [
        "Repeat-contact playbook for Fee + HELOC clusters",
        "Evening-shift tone coaching rollout",
      ],
      delegate: [
        "Service-only response macros for App / Trustpilot",
        "Recording-consent script audit (240 calls/mo at risk)",
      ],
      monitor: [
        "Premature-closure trend by channel",
        "Cross-centre health parity gaps",
      ],
    },
  },
};
// ═══════════════════════════
// LOB-SPECIFIC KPI DATA (Screen 2 onward)
// ═══════════════════════════
export const LOB_DATA: Record<
  string,
  {
    label: string;
    kpis: {
      l: string;
      v: string;
      delta: number;
      target: string;
      st: "red" | "amber" | "green";
    }[];
    insights: string[];
    eisenhower: {
      do: string[];
      plan: string[];
      delegate: string[];
      monitor: string[];
    };
  }
> = {
  retail_banking: {
    label: "Retail Banking",
    kpis: [
      {
        l: "Customer Promise Score",
        v: "76",
        delta: -2,
        target: "> 80",
        st: "amber",
      },
      {
        l: "Complaint Volume",
        v: "312",
        delta: +28,
        target: "< 250",
        st: "red",
      },
      {
        l: "First Contact Resolution",
        v: "74%",
        delta: -3,
        target: "> 80%",
        st: "red",
      },
      {
        l: "Onboarding Drop-off",
        v: "18%",
        delta: +2,
        target: "< 12%",
        st: "amber",
      },
      { l: "SLA Compliance", v: "87%", delta: -4, target: "> 95%", st: "red" },
    ],
    insights: [
      "Onboarding delays and complaint spike driven by KYC processing lag — API latency increased 3× since Tuesday.",
      "FCR drop concentrated in HELOC product — agents lack rate-lookup tool access after system update.",
      "EMI failure complaints up 22% MoM — rate-reset mortgage cohort over-indexes.",
    ],
    eisenhower: {
      do: [
        "KYC API fix — 18% onboarding drop",
        "HELOC rate-lookup restoration",
      ],
      plan: ["BPO quality review", "Agent training on fees"],
      delegate: ["3 branch ATM outages", "Social media viral post response"],
      monitor: ["Quarterly report formatting", "Dashboard updates"],
    },
  },
  cards_business: {
    label: "Cards Business",
    kpis: [
      {
        l: "Transaction Success Rate",
        v: "97.2%",
        delta: -0.8,
        target: "> 99%",
        st: "red",
      },
      {
        l: "Fraud Detection Rate",
        v: "82%",
        delta: -3,
        target: "> 90%",
        st: "red",
      },
      {
        l: "Dispute Volume",
        v: "1,247",
        delta: +189,
        target: "< 800",
        st: "red",
      },
      {
        l: "Authorization Latency",
        v: "340ms",
        delta: +80,
        target: "< 200ms",
        st: "red",
      },
      {
        l: "Complaint Rate",
        v: "2.8%",
        delta: +0.6,
        target: "< 1.5%",
        st: "amber",
      },
    ],
    insights: [
      "Merchant breach exposed 1,247 cards — reissuance at 68%. Fraud cluster in FL targeting seniors with social engineering scripts.",
      "Authorization latency spiked 80ms after payment gateway update — retry anomalies at 2,340.",
      "Dispute volume up 24% — MCC 7995 (gaming) category driving 40% of new disputes.",
    ],
    eisenhower: {
      do: [
        "FL fraud cluster — proactive freeze on 127 accounts",
        "Payment gateway rollback assessment",
      ],
      plan: [
        "Merchant breach full reissuance",
        "MCC 7995 dispute pattern investigation",
      ],
      delegate: [
        "Chargeback documentation backlog",
        "Rewards program complaint triage",
      ],
      monitor: ["Card testing pattern evolution", "Competitor rate changes"],
    },
  },
  insurance: {
    label: "Insurance",
    kpis: [
      {
        l: "Claims Processing Time",
        v: "14.2d",
        delta: +3.1,
        target: "< 10d",
        st: "red",
      },
      {
        l: "Claim Rejection Rate",
        v: "18%",
        delta: +4,
        target: "< 12%",
        st: "red",
      },
      {
        l: "Policy Issuance TAT",
        v: "3.8d",
        delta: +0.9,
        target: "< 2d",
        st: "amber",
      },
      {
        l: "Customer Complaint Rate",
        v: "3.1%",
        delta: +0.7,
        target: "< 2%",
        st: "amber",
      },
      {
        l: "Persistency / Renewal Rate",
        v: "78%",
        delta: -4,
        target: "> 85%",
        st: "red",
      },
    ],
    insights: [
      "Claims processing backlog grew 31% — adjuster capacity gap in auto claims after storm season surge.",
      "Claim rejection rate spiked due to documentation gaps in digital-first submissions — 62% of rejections are re-submittable.",
      "Persistency dropped 4 pts — renewal reminders not triggered for 1,200 policies due to CRM sync failure.",
    ],
    eisenhower: {
      do: [
        "CRM sync fix — 1,200 renewal reminders pending",
        "Adjuster overtime for storm claims backlog",
      ],
      plan: [
        "Digital submission documentation guide",
        "Claims automation pilot expansion",
      ],
      delegate: [
        "Policy issuance template updates",
        "Complaint categorisation review",
      ],
      monitor: ["Renewal rate recovery trend", "Adjuster quality scores"],
    },
  },
};

// LOB-specific KPIs for Screen 3–5 drill-down
export const LOB_DRILL_KPIS: Record<
  string,
  { label: string; kpis: { n: string; v: string; a: string | null }[] }[]
> = {
  mortgage_loans: [
    {
      label: "Mortgage / Loans",
      kpis: [
        { n: "Loan Servicing Call Rate", v: "4.2/1K", a: "Above 3.6 target" },
        {
          n: "EMI Failure Complaint Rate",
          v: "2.1%",
          a: "Customer contacts about failed payments",
        },
        { n: "EMI Complaint Volume", v: "67", a: "▲22% MoM" },
        { n: "Mis-selling / Policy Flags", v: "14", a: "Fair lending queue" },
      ],
    },
  ],
  insurance_lob: [
    {
      label: "Insurance LOB",
      kpis: [
        {
          n: "Mis-selling Flags",
          v: "11",
          a: "Policy suitability issues — from interactions",
        },
        {
          n: "High-Value Claim Escalation",
          v: "23",
          a: "Risk of regulatory action",
        },
        {
          n: "Regulatory Complaint Escalation",
          v: "68%",
          a: "Probability rising",
        },
      ],
    },
  ],
  // CRO-specific drill-down KPIs (Shridar insights: Financial Crime + Consumer Duty + AML)
  cro_financial_crime: [
    {
      label: "Financial Crime & AML",
      kpis: [
        { n: "SAR Pipeline (Open)", v: "47", a: "12 new this week" },
        {
          n: "Third-Party Coaching Flags",
          v: "18",
          a: "FL cluster — organised pattern",
        },
        {
          n: "Source of Funds Compliance",
          v: "76%",
          a: "Below 95% — 7 agents failing",
        },
        { n: "PEP Screening Gaps", v: "3", a: "Digital-to-voice handoff miss" },
        {
          n: "Transaction Monitoring Alerts",
          v: "34/day",
          a: "▲89% vs baseline",
        },
      ],
    },
  ],
  cro_consumer_duty: [
    {
      label: "Consumer Duty (FCA)",
      kpis: [
        {
          n: "Harm Prevention Score",
          v: "73%",
          a: "Below 80% — regulatory risk",
        },
        {
          n: "Vulnerable Customer Protocol",
          v: "94%",
          a: "6% bypass rate on mortgages",
        },
        { n: "Mis-selling Flags", v: "26", a: "7 from collections scripts" },
        { n: "Fair Value Gaps", v: "3 products", a: "Fee transparency issues" },
        {
          n: "SMCR Accountability Gaps",
          v: "3 findings",
          a: "CRO-owned remediation",
        },
      ],
    },
  ],
  cro_cross_jurisdiction: [
    {
      label: "Cross-Jurisdiction Compliance",
      kpis: [
        { n: "UK Compliance", v: "94%", a: null },
        { n: "EU Compliance", v: "87%", a: "Conduct gap identified" },
        { n: "APAC Compliance", v: "72%", a: "Consumer Duty + Privacy gaps" },
        { n: "US Compliance", v: "81%", a: "Consumer Duty gap" },
        { n: "Highest-Jurisdiction Delta", v: "22pts", a: "UK vs APAC spread" },
      ],
    },
  ],
  // Head of Retail Banking — valuable customer pain points + intent SLA
  retail_valuable_customers: [
    {
      label: "High-Value Customer Pain Points",
      kpis: [
        {
          n: "Mortgage Servicing Calls (HV)",
          v: "97",
          a: "31% of all HV calls",
        },
        {
          n: "Fee Confusion Calls (HV)",
          v: "75",
          a: "24% — fee policy change",
        },
        { n: "Onboarding Delays (HV)", v: "56", a: "18% — KYC bottleneck" },
        { n: "HELOC Rate Queries (HV)", v: "48", a: "15% — tool offline" },
        {
          n: "Account Closure Requests (HV)",
          v: "36",
          a: "12% — competitor offers",
        },
      ],
    },
    {
      label: "Intent-Based SLA Tracking",
      kpis: [
        {
          n: "Mortgage Servicing SLA",
          v: "72%",
          a: "28% breached — avg 2.1 days",
        },
        {
          n: "Fee Dispute SLA",
          v: "64%",
          a: "Worst — avg 3.2 days vs 1-day target",
        },
        {
          n: "Account Closure SLA",
          v: "81%",
          a: "19% breached — retention attempts",
        },
        { n: "Card Replacement SLA", v: "91%", a: "On track" },
      ],
    },
  ],
  retail_channel_sentiment: [
    {
      label: "Channel-Specific Concerns",
      kpis: [
        {
          n: "Social (X/Twitter) — Viral Risk",
          v: "4 posts",
          a: "Hidden fees trending — 3.4× velocity",
        },
        {
          n: "Trustpilot — Rating Drop",
          v: "3.2 ★",
          a: "▼0.6 in 4 weeks — fee complaints",
        },
        {
          n: "App Store — Feature Requests",
          v: "68 reviews",
          a: "'Budgeting tool' most requested",
        },
        {
          n: "Voice — Repeat Callers",
          v: "22%",
          a: "Fee confusion + transfer loops",
        },
        {
          n: "Email — Unresolved Backlog",
          v: "143",
          a: "47 > 48h old — mortgage queries",
        },
      ],
    },
  ],
  // Head of Contact Centre — per-contact CX, service-reputation, ops & workforce
  contact_experience: [
    {
      label: "Per-Contact Quality",
      kpis: [
        { n: "Post-Contact CSAT", v: "78%", a: "▼4 vs 85% target" },
        {
          n: "First Contact Resolution",
          v: "74%",
          a: "Below 80% — HELOC + Fee gaps",
        },
        {
          n: "Repeat Contact Rate",
          v: "22%",
          a: "Fee 31% · HELOC 18% of repeats",
        },
        {
          n: "Premature Closure Rate",
          v: "7%",
          a: "Voice + Chat — flagged by AI",
        },
        { n: "Tone Drift Flags", v: "18%", a: "Evening shift concentrated" },
      ],
    },
  ],
  contact_service_reputation: [
    {
      label: "Service-Driven Brand Signals",
      kpis: [
        {
          n: "Trustpilot (Service Mentions)",
          v: "3.1 ★",
          a: "▼0.5 in 4 weeks",
        },
        {
          n: "X — Viral Service Posts",
          v: "4",
          a: "'On hold' theme · 3.4× velocity",
        },
        {
          n: "App Store — Service Reviews",
          v: "68",
          a: "'No one answered' / 'rude agent'",
        },
        {
          n: "Reddit — Service Threads",
          v: "12",
          a: "IVR-loop and callback failures",
        },
        {
          n: "Service Sentiment (Cross-channel)",
          v: "0.46",
          a: "Below 0.65 target",
        },
      ],
    },
  ],
  contact_service_operations: [
    {
      label: "Operational Delivery",
      kpis: [
        { n: "SLA Compliance", v: "87%", a: "▼4 — 3rd week below 95%" },
        { n: "Average Handle Time", v: "8.3 min", a: "▲0.8 min vs target" },
        { n: "Abandonment Rate", v: "8.2%", a: "Peak 9–11 AM" },
        { n: "Callback SLA", v: "68%", a: "32% callbacks missed/late" },
        { n: "Recording Consent Miss", v: "0.8%", a: "~240 calls/mo at risk" },
      ],
    },
    {
      label: "In-house vs Outsourced",
      kpis: [
        { n: "In-house FCR", v: "81%", a: "Stable — target 85%" },
        { n: "BPO (Outsourced) FCR", v: "62%", a: "▼8% — evidence collection" },
        { n: "BPO AHT", v: "11.1 min", a: "73% above in-house" },
        {
          n: "BPO Dispute Win Rate",
          v: "38%",
          a: "vs 71% in-house — critical gap",
        },
        {
          n: "Cross-Centre Health (Below)",
          v: "3 centres",
          a: "Mumbai · Manila · Manchester",
        },
      ],
    },
    {
      label: "Workforce & Coaching",
      kpis: [
        { n: "Staffing Gap", v: "12 short", a: "10–11 AM peak window" },
        {
          n: "Agent Utilisation",
          v: "94%",
          a: "Above 88% target — burnout risk",
        },
        { n: "QA Score", v: "78%", a: "Below 85% benchmark" },
        { n: "Coaching Tickets Open", v: "23", a: "AI-generated this week" },
        { n: "New Hire Ramp", v: "14 agents", a: "4 weeks to ready" },
      ],
    },
  ],
};

export type ScreenId = 1 | 2 | 3 | 4 | 5;
export type LensId = "ops" | "risk" | "compliance";
export type Industry = (typeof INDUSTRIES)[number];
export type Role = Industry["roles"][number];
export type RoleDashboardData = (typeof ROLE_DATA)["ceo"];
export type LobDataEntry = (typeof LOB_DATA)["retail_banking"];

<<<<<<< Updated upstream
=======
export const STERLING_BANK_INDUSTRY_ID = "sterling_bank" as const;
export const NUVAMA_INDUSTRY_ID = "nuvama" as const;

>>>>>>> Stashed changes
/** Industries that reuse retail-banking role dashboards (Sterling fork — customize per industry later). */
export function usesRetailBankingDashboard(industryId: string): boolean {
  return industryId === "retail_banking" || industryId === STERLING_BANK_INDUSTRY_ID;
}

/** Display label: registry `name` when present, otherwise title-cased role id. */
export function roleDisplayName(role: Role): string {
  if ("name" in role && typeof role.name === "string" && role.name.length > 0) {
    return role.name;
  }
  return role.id
    .split("_")
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

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
