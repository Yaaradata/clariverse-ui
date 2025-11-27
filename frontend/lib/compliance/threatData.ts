export interface Threat {
  icon: string;
  message: string;
  highlight: string;
  context: string;
}

export const threatData: Threat[] = [
  {
    icon: '⚠️',
    message: 'KYC resubmission failures spiking in Email →',
    highlight: '390 pending',
    context: '(RBI KYC norms breach risk)'
  },
  {
    icon: '🚨',
    message: 'UPI Autopay disputes rising in Chat →',
    highlight: '67% unresolved',
    context: '(NPCI mandate risk)'
  },
  {
    icon: '❗',
    message: 'FRAUD escalation loop in Voice →',
    highlight: 'repeated OTP attempts',
    context: '(possible account takeover)'
  }
];

