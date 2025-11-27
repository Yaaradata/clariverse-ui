export interface KPI {
  label: string;
  value: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  desc: string;
}

export const kpiData: KPI[] = [
  { 
    label: 'Regulatory Risk Score', 
    value: '72/100', 
    status: 'high', 
    desc: 'Weighted RCA across channels' 
  },
  { 
    label: 'KYC Compliance Rate', 
    value: '85%', 
    status: 'medium', 
    desc: 'Cases processed per RBI rules' 
  },
  { 
    label: 'Dispute Closure Compliance', 
    value: '67%', 
    status: 'high', 
    desc: 'Within NPCI/RBI limits' 
  },
  { 
    label: 'Fraud Escalation Count', 
    value: '143', 
    status: 'critical', 
    desc: 'Suspicious auth patterns' 
  },
  { 
    label: 'Data Leakage Attempts', 
    value: '28', 
    status: 'medium', 
    desc: 'Insecure data transmission' 
  },
  { 
    label: 'Channel Misalignment Index', 
    value: '3.8', 
    status: 'medium', 
    desc: 'Response inconsistency' 
  }
];

