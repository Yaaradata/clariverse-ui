/**
 * HDFC Head of CX — Service delivery drill copy (India / RBI).
 * Layout and numbers match retail ServiceFulfilment; labels/copy only.
 * Mounted only from /role-based/hdfc/head_of_cx → "Can the engine deliver?"
 */

export type HdfcLeadingIntentRow = {
  intent: string;
  pct: number;
  vol: number;
};

export type HdfcLaggingIntentRow = {
  intent: string;
  pct: number;
  vol: number;
  reason: string;
};

export type HdfcSlaMatrixRow = {
  intent: string;
  Voice: number;
  Chat: number;
  Email: number;
  "App SS": number;
};

export type HdfcFciIntentColumn = {
  id: string;
  label: string;
  shortLabel: string;
};

export type HdfcFcrChannelRow = {
  ch: string;
  actual: number;
  last: number;
  target: number;
};

/** SLA Performance Overview — TOP INTENTS */
export const HDFC_SERVICE_LEADING_INTENTS: HdfcLeadingIntentRow[] = [
  { intent: "Balance enquiry", pct: 97, vol: 1_240 },
  { intent: "Card activation", pct: 95, vol: 830 },
  { intent: "Autopay setup", pct: 94, vol: 610 },
  { intent: "Statement request", pct: 93, vol: 520 },
  { intent: "PIN reset", pct: 92, vol: 480 },
];

/** SLA Performance Overview — BOTTLENECK */
export const HDFC_SERVICE_LAGGING_INTENTS: HdfcLaggingIntentRow[] = [
  {
    intent: "Re-KYC refresh",
    pct: 41,
    vol: 612,
    reason: "Source-of-funds / re-KYC docs stalled in manual review queue.",
  },
  {
    intent: "Account freeze release",
    pct: 53,
    vol: 340,
    reason: "Cyber-freeze and lien complaints exceed release capacity.",
  },
  {
    intent: "Fee dispute resolution",
    pct: 58,
    vol: 295,
    reason: "Cross-channel case ID mismatch causes duplicates.",
  },
];

/** FCR Intelligence — channel labels (Social/X → X) */
export const HDFC_SERVICE_FCR_CHANNELS: HdfcFcrChannelRow[] = [
  { ch: "Voice", actual: 74, last: 78, target: 80 },
  { ch: "Chat", actual: 62, last: 66, target: 75 },
  { ch: "Email", actual: 58, last: 61, target: 70 },
  { ch: "X", actual: 41, last: 48, target: 60 },
  { ch: "App SS", actual: 89, last: 86, target: 85 },
];

/** SLA Heatmap (Intent × channel) */
export const HDFC_SERVICE_SLA_MATRIX: HdfcSlaMatrixRow[] = [
  { intent: "Card Replace", Voice: 92, Chat: 94, Email: 88, "App SS": 98 },
  { intent: "Balance Query", Voice: 88, Chat: 90, Email: 82, "App SS": 99 },
  { intent: "Fee Dispute", Voice: 64, Chat: 58, Email: 54, "App SS": 72 },
  { intent: "EMI", Voice: 72, Chat: 68, Email: 65, "App SS": 80 },
  { intent: "Onboarding KYC", Voice: 69, Chat: 72, Email: 70, "App SS": 76 },
  { intent: "Acct Closure", Voice: 81, Chat: 76, Email: 74, "App SS": 83 },
];

/** FCI heatmap — column labels only (ids unchanged for score lookup) */
export const HDFC_SERVICE_FCI_INTENTS: HdfcFciIntentColumn[] = [
  { id: "accountAccess", label: "Account Access & Security", shortLabel: "ACCOUNT ACCESS" },
  { id: "transactionDisputes", label: "Transaction Disputes & Fraud", shortLabel: "DISPUTES & FRAUD" },
  { id: "creditCard", label: "Credit Card Services", shortLabel: "CREDIT CARD" },
  { id: "loanMortgage", label: "Loan & EMI", shortLabel: "LOAN & EMI" },
  { id: "feeComplaints", label: "Fee Complaints & Waivers", shortLabel: "FEE COMPLAINTS" },
  { id: "digitalBanking", label: "Digital Banking & Technology", shortLabel: "DIGITAL BANKING" },
  { id: "branchATM", label: "Branch & ATM Services", shortLabel: "BRANCH & ATM" },
  { id: "investment", label: "Investment & Wealth", shortLabel: "INVESTMENT" },
  { id: "directDeposit", label: "Salary Account & Autopay", shortLabel: "SALARY & AUTOPAY" },
  { id: "accountClosure", label: "Account Closure & Changes", shortLabel: "ACCOUNT CLOSURE" },
];
