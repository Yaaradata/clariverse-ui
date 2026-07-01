/**
 * Sterling Bank · head_retail — Service delivery drill-down intent labels only.
 * Communication-derived intents (voice, chat, email, social) — scores/counts unchanged.
 */

export type SterlingLeadingIntentRow = {
  intent: string;
  pct: number;
  vol: number;
};

export type SterlingSlaMatrixRow = {
  intent: string;
  Voice: number;
  Chat: number;
  Email: number;
  "App SS": number;
};

export type SterlingFciIntentColumn = {
  id: string;
  label: string;
  shortLabel: string;
};

/** SLA Performance Overview — Leading Intents list */
export const STERLING_HEAD_RETAIL_LEADING_INTENTS: SterlingLeadingIntentRow[] = [
  { intent: "Balance Enquiry", pct: 97, vol: 1_240 },
  { intent: "Card Activation", pct: 95, vol: 830 },
  { intent: "Direct Debit Setup", pct: 94, vol: 610 },
  { intent: "Statement Request", pct: 93, vol: 520 },
  { intent: "Passcode Reset", pct: 92, vol: 480 },
];

/** FCI heatmap — column intent labels (ids unchanged for score lookup) */
export const STERLING_HEAD_RETAIL_FCI_INTENTS: SterlingFciIntentColumn[] = [
  { id: "accountAccess", label: "Account Access & Security", shortLabel: "ACCOUNT ACCESS" },
  { id: "transactionDisputes", label: "Fraud & Scam", shortLabel: "FRAUD & SCAM" },
  { id: "creditCard", label: "Card Replacement", shortLabel: "CARD REPLACEMENT" },
  { id: "loanMortgage", label: "Payment Declined", shortLabel: "PAYMENT DECLINED" },
  { id: "feeComplaints", label: "Fee & Charge Queries", shortLabel: "FEE & CHARGES" },
  { id: "digitalBanking", label: "Spaces & App Support", shortLabel: "SPACES & APP" },
  { id: "branchATM", label: "Account Freeze", shortLabel: "ACCOUNT FREEZE" },
  { id: "investment", label: "Savings & Easy-Saver", shortLabel: "SAVINGS" },
  { id: "directDeposit", label: "Direct Debit & Standing Orders", shortLabel: "DIRECT DEBIT" },
  { id: "accountClosure", label: "Account Closure & Switching", shortLabel: "CLOSURE" },
];

/** SLA Heatmap — row intent labels */
export const STERLING_HEAD_RETAIL_SLA_MATRIX: SterlingSlaMatrixRow[] = [
  { intent: "Card Replacement", Voice: 92, Chat: 94, Email: 88, "App SS": 98 },
  { intent: "Balance Enquiry", Voice: 88, Chat: 90, Email: 82, "App SS": 99 },
  { intent: "Fee & Charge Queries", Voice: 64, Chat: 58, Email: 54, "App SS": 72 },
  { intent: "Payment Declined", Voice: 72, Chat: 68, Email: 65, "App SS": 80 },
  { intent: "Onboarding & KYC", Voice: 69, Chat: 72, Email: 70, "App SS": 76 },
  { intent: "Account Closure & Switching", Voice: 81, Chat: 76, Email: 74, "App SS": 83 },
];
