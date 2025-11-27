export interface RiskHeatmapData {
  riskTypes: string[];
  channels: string[];
  riskScores: { [key: string]: number[] };
}

export const riskHeatmapData: RiskHeatmapData = {
  riskTypes: [
    'KYC failure',
    'Dispute resolution failure',
    'Fraud patterns',
    'Security breach',
    'Data leakage',
    'RBI timeline breach',
    'NPCI/UPI mandate non-compliance',
    'Misleading/incorrect communication'
  ],
  channels: ['Email', 'Chat', 'Voice', 'Ticket', 'Social'],
  riskScores: {
    'KYC failure': [45, 67, 23, 89, 34],
    'Dispute resolution failure': [78, 56, 90, 45, 67],
    'Fraud patterns': [90, 88, 95, 67, 45],
    'Security breach': [34, 56, 78, 23, 12],
    'Data leakage': [56, 78, 45, 67, 89],
    'RBI timeline breach': [89, 67, 78, 90, 45],
    'NPCI/UPI mandate non-compliance': [67, 89, 45, 78, 56],
    'Misleading/incorrect communication': [45, 67, 56, 78, 89]
  }
};

