export const onboardingFunnel = [
  { stage: "Application Started", count: 420_000, dropPct: 0 },
  { stage: "KYC Completed", count: 357_000, dropPct: 15 },
  { stage: "Tag Issued", count: 332_000, dropPct: 7 },
  { stage: "Tag Delivered / Mapped", count: 298_000, dropPct: 10 },
  { stage: "First Recharge", count: 251_000, dropPct: 16 },
  { stage: "First Toll Txn", count: 223_000, dropPct: 11 },
  { stage: "Repeat Usage", count: 178_000, dropPct: 20 },
] as const;

export const rechargeSuccessTrend = [
  { wk: "W1", rate: 94.2 },
  { wk: "W2", rate: 93.8 },
  { wk: "W3", rate: 92.6 },
  { wk: "W4", rate: 91.4 },
  { wk: "W5", rate: 90.9 },
  { wk: "W6", rate: 91.7 },
] as const;

export const rechargeMethods = [
  { method: "UPI", pct: 47 },
  { method: "Auto-recharge", pct: 21 },
  { method: "Wallet", pct: 14 },
  { method: "Net banking", pct: 12 },
  { method: "Partner-assisted", pct: 6 },
] as const;

export const autoRechargeFunnel = [
  { stage: "Eligible", count: 1_250_000 },
  { stage: "Opted-in", count: 412_000 },
  { stage: "Active", count: 318_000 },
] as const;

export const rechargeFailurePareto = [
  { reason: "Gateway timeout", pct: 38, cumPct: 38 },
  { reason: "Insufficient balance", pct: 24, cumPct: 62 },
  { reason: "UPI mandate decline", pct: 16, cumPct: 78 },
  { reason: "Session expired", pct: 12, cumPct: 90 },
  { reason: "Bank downtime", pct: 7, cumPct: 97 },
  { reason: "Other", pct: 3, cumPct: 100 },
] as const;

export const firstTollSuccessTrend = [
  { wk: "W1", rate: 88.1 },
  { wk: "W2", rate: 87.4 },
  { wk: "W3", rate: 86.9 },
  { wk: "W4", rate: 88.0 },
  { wk: "W5", rate: 89.2 },
] as const;

export const firstUseFailures = [
  { reason: "Tag not detected", pct: 31 },
  { reason: "Low balance", pct: 27 },
  { reason: "Mapping issue", pct: 18 },
  { reason: "Recharge pending", pct: 12 },
  { reason: "Blacklisted tag", pct: 8 },
  { reason: "Toll exception", pct: 4 },
] as const;

export const firstUseJourney = [
  { stage: "Activated", count: 298_000 },
  { stage: "First toll attempt", count: 264_000 },
  { stage: "Successful first toll", count: 223_000 },
  { stage: "Repeat toll use", count: 178_000 },
] as const;

export const retentionCohorts = [
  { cohort: "Jan", values: [100, 71, 63, 58, 54, 51] },
  { cohort: "Feb", values: [100, 73, 65, 60, 56, null] },
  { cohort: "Mar", values: [100, 70, 61, 55, null, null] },
  { cohort: "Apr", values: [100, 74, 66, null, null, null] },
  { cohort: "May", values: [100, 76, null, null, null, null] },
  { cohort: "Jun", values: [100, null, null, null, null, null] },
] as const;

export const repeatRechargeTrend = [
  { mo: "Jan", rate: 49 },
  { mo: "Feb", rate: 52 },
  { mo: "Mar", rate: 54 },
  { mo: "Apr", rate: 56 },
  { mo: "May", rate: 59 },
  { mo: "Jun", rate: 61 },
] as const;

export const repeatTxnTrend = [
  { mo: "Jan", rate: 55 },
  { mo: "Feb", rate: 57 },
  { mo: "Mar", rate: 58 },
  { mo: "Apr", rate: 60 },
  { mo: "May", rate: 62 },
  { mo: "Jun", rate: 64 },
] as const;

export const usageComposition = [
  { label: "Active repeat", pct: 58, color: "green" },
  { label: "Low-frequency", pct: 26, color: "amber" },
  { label: "Dormant", pct: 16, color: "red" },
] as const;

export const issueMatrix = [
  { issue: "Recharge failed", customers: 96_000, activations: 31_000, repeat: 64_000, growth: "High", severity: "Critical", owner: "Payments" },
  { issue: "Low balance not alerted", customers: 88_000, activations: 12_000, repeat: 71_000, growth: "High", severity: "High", owner: "CRM / Notifications" },
  { issue: "Tag not detected", customers: 74_000, activations: 22_000, repeat: 49_000, growth: "High", severity: "High", owner: "Tolling Ops" },
  { issue: "KYC pending", customers: 63_000, activations: 58_000, repeat: 5_000, growth: "Medium", severity: "Medium", owner: "Onboarding" },
  { issue: "Tag not mapped", customers: 41_000, activations: 28_000, repeat: 13_000, growth: "Medium", severity: "High", owner: "Fulfilment" },
  { issue: "Tag not delivered", customers: 34_000, activations: 30_000, repeat: 4_000, growth: "Medium", severity: "Medium", owner: "Logistics" },
  { issue: "Support delay", customers: 27_000, activations: 6_000, repeat: 22_000, growth: "Medium", severity: "Medium", owner: "Support" },
  { issue: "Blacklisted tag", customers: 19_000, activations: 9_000, repeat: 11_000, growth: "Medium", severity: "High", owner: "Risk" },
  { issue: "Wrong toll deduction", customers: 12_000, activations: 1_000, repeat: 14_000, growth: "Low", severity: "High", owner: "Disputes" },
] as const;

export const growthBlockerPareto = [
  { issue: "Recharge failed", score: 34, cumPct: 34 },
  { issue: "Low balance not alerted", score: 23, cumPct: 57 },
  { issue: "Tag not detected", score: 18, cumPct: 75 },
  { issue: "KYC pending", score: 9, cumPct: 84 },
  { issue: "Tag not mapped", score: 7, cumPct: 91 },
  { issue: "Others", score: 9, cumPct: 100 },
] as const;

