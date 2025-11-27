export interface InvestigationCase {
  caseId: string;
  riskType: string;
  channels: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  sentiment: string;
  action: string;
}

export const investigationData: InvestigationCase[] = [
  {
    caseId: 'C-83921',
    riskType: 'KYC Document Mismatch',
    channels: ['Ticket', 'Email'],
    severity: 'High',
    sentiment: 'Frustrated',
    action: 'Re-extract OCR from docs → mismatch detected → assign to verification officer.'
  },
  {
    caseId: 'C-84562',
    riskType: 'Fraud/Multiple OTP',
    channels: ['Chat', 'Voice'],
    severity: 'Critical',
    sentiment: 'Neutral',
    action: 'Enhanced KYC challenge required; possible credential compromise.'
  },
  {
    caseId: 'C-84890',
    riskType: 'UPI Dispute Breach',
    channels: ['Email', 'Ticket'],
    severity: 'High',
    sentiment: 'Angry',
    action: 'Escalate to Nodal Officer; NPCI timeline exceeded.'
  }
];

