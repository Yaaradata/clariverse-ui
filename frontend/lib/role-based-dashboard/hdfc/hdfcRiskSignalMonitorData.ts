/**
 * HDFC Head of CX — AI Risk Signal Monitor cards.
 * Route: /role-based/hdfc/head_of_cx only.
 */

export type HdfcSignalSeverity = "critical" | "high" | "watch";

export type HdfcRiskSignal = {
  id: string;
  title: string;
  severity: HdfcSignalSeverity;
  /** Primary feed tag; optional second tag renders as amber pill */
  feeds: [string] | [string, string];
  cohort: string;
  time: string;
  /** Exactly 4 metric rows; last two are Route and Status */
  metrics: [[string, string], [string, string], [string, string], [string, string]];
  insight: string;
};

export const HDFC_RISK_SIGNALS: HdfcRiskSignal[] = [
  {
    id: "recovery-conduct",
    title: "Recovery-Agent Conduct Breach",
    severity: "critical",
    feeds: ["X + COMPLAINTS FEED"],
    cohort: "Collections · card dues",
    time: "Rising since 01 Sep · 09:40 IST",
    metrics: [
      ["Complaint threads", "0 → 13"],
      ["Severe cases", "1 data-leak + threat"],
      ["Route", "Vigilance & Legal"],
      ["Status", "RBI Fair-Practices exposure"],
    ],
    insight:
      "Recovery-agent and loan-spam complaints newly spiking; one case has shared customer data + a threat, escalating to the Ombudsman. Suppress on first opt-out and audit the agency before it becomes a regulatory event.",
  },
  {
    id: "swiggy-migration",
    title: "Swiggy-Card Migration Backlash",
    severity: "critical",
    feeds: ["REDDIT FEED"],
    cohort: "Swiggy card holders",
    time: "This week · 09:40 IST",
    metrics: [
      ["High-reach threads", "3 (854/549/341 ↑)"],
      ["Migration posts", "25"],
      ["Route", "Product & Comms"],
      ["Status", "Public narrative forming"],
    ],
    insight:
      "Forced migration to Swiggy ORNGE/BLCK dominates card discussion; ~15–20% is positive (finally get the core card), the rest reads as 'forced'. Publish a migration FAQ before the narrative hardens.",
  },
  {
    id: "cross-border-fraud",
    title: "Cross-Border Fraud Cluster",
    severity: "critical",
    feeds: ["X FRAUD FEED"],
    cohort: "International card use",
    time: "Within 4h · 12:15 IST",
    metrics: [
      ["Exposure", "₹2.4L + ₹10L"],
      ["Pattern", "zero-OTP / coerced-OTP"],
      ["Route", "Fraud-ops"],
      ["Status", "RBI limited-liability review"],
    ],
    insight:
      "Zero-OTP cross-border fraud and a coerced-OTP (armed-abduction) case are public with RBI-circular deadlines. Treat coerced OTP as non-voluntary; open a same-day dispute queue before the reversal-SLA runs out.",
  },
  {
    id: "account-lockout",
    title: "Account-Lockout Urgency Spike",
    severity: "high",
    feeds: ["X + COMPLAINTS FEED"],
    cohort: "Cyber / AML lien holds · Voice",
    time: "3h ago · 09:40 IST",
    metrics: [
      ["Urgency", "21% → 55% (+34)"],
      ["Accounts held", "8 (up to 3 yrs)"],
      ["Route", "Conduct & Ops"],
      ["Status", "IO-unreachable, funds locked"],
    ],
    insight:
      "Account-lockout urgency spiking on cyber/AML holds against genuine accounts; 68% bank-owned. Release undisputed funds where permissible and enable a self-service unblock path.",
  },
  {
    id: "payment-failure",
    title: "Payment-Failure Sentiment Crash",
    severity: "high",
    feeds: ["X FEED"],
    cohort: "UPI + autopay users · Chat",
    time: "1h ago · since app upgrade",
    metrics: [
      ["Sentiment", "2.8 → 4.0 (anger)"],
      ["Error", "U30YC · post-upgrade"],
      ["Route", "Payments & Product"],
      ["Status", "Ombudsman cited"],
    ],
    insight:
      "UPI/autopay failures since the app upgrade are crashing chat sentiment; business users are citing the Ombudsman. Confirm a real fix date and inject payment-status + reversal-SLA into the bot.",
  },
  {
    id: "rekyc-surge",
    title: "Re-KYC Unresolved Surge",
    severity: "high",
    feeds: ["COMPLAINTS + OPS FEED"],
    cohort: "Re-KYC / onboarding · Email",
    time: "4h ago · 3-day SLA",
    metrics: [
      ["Unresolved", "212 → 352 (+140)"],
      ["Backlog", "612 past SLA"],
      ["Route", "KYC-ops"],
      ["Status", "NetBanking cut mid-re-KYC"],
    ],
    insight:
      "Re-KYC resubmission backlog surging; NetBanking cut mid-verification is generating repeats. Auto-prioritise re-KYC and restore read access during the refresh.",
  },
  {
    id: "dispute-volume",
    title: "Dispute-Ticket Volume Surge",
    severity: "high",
    feeds: ["COMPLAINTS FEED"],
    cohort: "Fraud + fee disputes · Ticket",
    time: "2h ago · 09:40 IST",
    metrics: [
      ["Volume", "98 → 166 (+68)"],
      ["Drivers", "fraud + AMB/fee"],
      ["Route", "Dispute-ops"],
      ["Status", "Ombudsman exposure"],
    ],
    insight:
      "Dispute-status tickets surging on fraud and AMB/fee disputes with app-vs-branch conflicts. Borrow chat capacity for 4h and enforce a single case ID across channels.",
  },
  {
    id: "competitor-switch",
    title: "Competitor-Switching Signal",
    severity: "watch",
    feeds: ["REDDIT FEED"],
    cohort: "Card-switching intent",
    time: "This week · 09:40 IST",
    metrics: [
      ["Benchmark", "55% name a rival"],
      ["Top rivals", "ICICI 24 · Axis 21 · SBI 18"],
      ["Route", "Retention & Product"],
      ["Status", "Observation only"],
    ],
    insight:
      "One in two HDFC card posts benchmarks against ICICI/Axis/SBI, with 'moving to X' threads rising. Advisory only — route to retention/product as a competitive-loss signal.",
  },
];
