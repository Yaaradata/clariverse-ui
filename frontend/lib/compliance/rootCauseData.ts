export interface RootCauseCluster {
  cluster: string;
  channels: string[];
  affected: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  summary: string;
}

export const rootCauseData: RootCauseCluster[] = [
  {
    cluster: 'Inconsistent KYC document ask',
    channels: ['Email', 'Chat'],
    affected: 87,
    severity: 'High',
    summary: 'Email allows DL, Chat requires PASSPORT only - causing customer confusion and resubmissions.'
  },
  {
    cluster: 'Conflicting dispute timelines',
    channels: ['Chat', 'Voice', 'Ticket'],
    affected: 134,
    severity: 'Critical',
    summary: 'Agents providing different RBI timeline interpretations (30d vs 45d vs 60d).'
  },
  {
    cluster: 'UPI mandate failures',
    channels: ['Email', 'Chat', 'Social'],
    affected: 298,
    severity: 'High',
    summary: 'NPCI autopay mandate handling differs across channels causing compliance gaps.'
  },
  {
    cluster: 'Re-authentication loops',
    channels: ['Chat', 'Voice'],
    affected: 56,
    severity: 'Medium',
    summary: 'Multiple auth challenges escalating to security risk scenarios.'
  }
];

