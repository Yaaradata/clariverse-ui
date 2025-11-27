export interface Incident {
  title: string;
  data: string[];
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const incidentData: Incident[] = [
  {
    title: '1️⃣ Suspicious Authentication Pattern',
    data: [
      'Multiple login failures',
      'MFA retries',
      'Repeated OTP requests',
      'Channel switching (Email → Chat → Voice)'
    ],
    action: 'Escalate this customer to Fraud Watch; pattern resembles credential-stuffing.',
    severity: 'critical'
  },
  {
    title: '2️⃣ Regulatory Closure Breach',
    data: [
      'RBI-mandated case closed too early',
      'Resolution violated 48hr timeline',
      'Case reopening required'
    ],
    action: 'Re-open case; resolution violated mandatory RBI closure timeline (48 hrs).',
    severity: 'high'
  },
  {
    title: '3️⃣ Data Leakage Risk',
    data: [
      'PAN shared in Email',
      'Aadhaar mentioned in Chat',
      'Account number in Social media'
    ],
    action: 'Block agent from sharing account-sensitive info; enforce secure-channel deflection.',
    severity: 'critical'
  },
  {
    title: '4️⃣ Misaligned Compliance Response',
    data: [
      'Same query, different answers',
      'Cross-channel inconsistency',
      'Policy drift detected'
    ],
    action: 'Standardize response using compliance template #C-M3 immediately.',
    severity: 'medium'
  },
  {
    title: '5️⃣ Escalation Fraud Indicator',
    data: [
      'Multiple failed Chat attempts',
      'Voice escalation after failures',
      'Social engineering suspected'
    ],
    action: 'Trigger enhanced KYC challenge for this session.',
    severity: 'high'
  }
];

