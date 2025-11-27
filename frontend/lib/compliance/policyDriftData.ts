export interface PolicyDrift {
  issue: string;
  desc: string;
  recommendation: string;
}

export const policyDriftData: PolicyDrift[] = [
  {
    issue: 'Policy Drift Identified',
    desc: 'Chat agents quoting 30 days for dispute closure; RBI-mandated period is 45 days.',
    recommendation: 'Force-update canned responses and freeze incorrect templates.'
  },
  {
    issue: 'KYC Checklist Inconsistency',
    desc: 'Email says DL allowed, Chat says PASSPORT only.',
    recommendation: 'Standardize KYC document requirements across all channels immediately.'
  },
  {
    issue: 'Incorrect Loan Closure Fee',
    desc: 'Voice agents providing wrong fee structure vs. documented policy.',
    recommendation: 'Retrain agents and update knowledge base with correct fee schedule.'
  }
];

