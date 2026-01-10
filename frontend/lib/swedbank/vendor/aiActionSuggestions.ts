export interface AIActionSuggestion {
  id: string;
  headline: string;
  topic: string;
  description: string;
  action: string;
  category: 'Risk' | 'Compliance';
  color: string;
  icon: 'flame' | 'zap' | 'shield' | 'alert' | 'lock' | 'pause' | 'message' | 'file' | 'search' | 'clipboard';
  seenThisWeek?: number;
  mostCommonChannel?: string;
}

export const aiActionSuggestions: AIActionSuggestion[] = [
  {
    id: 'immediate-hold',
    headline: 'URGENT RISK INTERVENTION REQUIRED',
    topic: 'IMMEDIATE HOLD',
    description: 'Voice + Chat report surge of rapid transaction velocity and unusual geographic patterns; high repetition across customers within 24 hrs. AI detects dense clustering of high-severity risk signals including multiple large transactions in short time windows and transactions to high-risk jurisdictions across multi-channel conversations.',
    action: '✨ Action: Suspend all account activity immediately; escalate to risk management team for comprehensive review before any transaction proceeds.',
    category: 'Risk',
    color: '#ef4444',
    icon: 'flame',
    seenThisWeek: 23,
    mostCommonChannel: 'Voice'
  },
  {
    id: 'ofac-review',
    headline: 'SANCTIONS COMPLIANCE ALERT',
    topic: 'OFAC REVIEW',
    description: 'Voice transcripts show mentions of sending money to sanctioned countries; customer references to restricted entities detected across conversations. AI identifies potential matches with sanctioned entities, countries, or individuals based on transaction patterns, customer statements, and geographic indicators within 24 hrs.',
    action: '✨ Action: Trigger mandatory OFAC review before any transaction proceeds; flag account for enhanced due diligence and regulatory reporting if match confirmed.',
    category: 'Compliance',
    color: '#f97316',
    icon: 'shield',
    seenThisWeek: 18,
    mostCommonChannel: 'Voice'
  },
  {
    id: 'sar-trigger',
    headline: 'SUSPICIOUS ACTIVITY PATTERN DETECTED',
    topic: 'SAR TRIGGER',
    description: 'Chat + Email threads show "repeated questions about reporting limits" and "transactions conducted on behalf of others"; multiple restatements before resolution. AI flags strong recurrence of suspicious activity indicators such as transaction structuring and third-party involvement that historically align with reportable activity.',
    action: '✨ Action: Initiate SAR filing process; document all suspicious indicators and customer interactions; escalate to compliance team for regulatory submission.',
    category: 'Compliance',
    color: '#eab308',
    icon: 'zap',
    seenThisWeek: 34,
    mostCommonChannel: 'Chat'
  },
  {
    id: 'ctr-enhancement',
    headline: 'COMPLEX TRANSACTION PATTERN CLUSTER',
    topic: 'CTR ENHANCEMENT',
    description: 'AI detects multiple transactions just below reporting threshold across Voice + Chat channels; transactions involving multiple parties and unusual timing patterns identified. AI flags transaction characteristics that warrant enhanced documentation including multiple parties, unusual timing, or patterns suggesting potential structuring.',
    action: '✨ Action: Enhance Currency Transaction Report data with additional context; flag for regulatory review and document all transaction characteristics for compliance records.',
    category: 'Compliance',
    color: '#22c55e',
    icon: 'file',
    seenThisWeek: 27,
    mostCommonChannel: 'Tickets'
  },
  {
    id: 'fraud-alert',
    headline: 'FRAUDULENT ACTIVITY INDICATORS DETECTED',
    topic: 'FRAUD ALERT',
    description: 'Voice + Chat report surge of unusual account access patterns and transactions inconsistent with customer history; high repetition across accounts within 24 hrs. AI detects dense clustering of behavioral anomalies, account takeover indicators, or transaction patterns consistent with known fraud schemes based on historical data.',
    action: '✨ Action: Flag potential fraudulent activity and trigger enhanced monitoring protocols; verify customer identity and transaction legitimacy before proceeding.',
    category: 'Risk',
    color: '#dc2626',
    icon: 'alert',
    seenThisWeek: 45,
    mostCommonChannel: 'Voice'
  },
  {
    id: 'account-freeze',
    headline: 'CRITICAL ACCOUNT PROTECTION REQUIRED',
    topic: 'ACCOUNT FREEZE',
    description: 'AI identifies confirmed fraudulent activity, regulatory violations, or account takeover across multiple channels; severe risk indicators require comprehensive account protection. Voice + Email threads show escalation signals that necessitate complete account suspension to prevent ongoing fraudulent activity.',
    action: '✨ Action: Completely suspend account access and all transaction capabilities; escalate to security team for comprehensive account protection and investigation.',
    category: 'Risk',
    color: '#991b1b',
    icon: 'lock',
    seenThisWeek: 12,
    mostCommonChannel: 'Tickets'
  },
  {
    id: 'transaction-hold',
    headline: 'TARGETED TRANSACTION VERIFICATION NEEDED',
    topic: 'TRANSACTION HOLD',
    description: 'Chat + Voice show large transaction amounts and transactions to new recipients; unusual transaction types for customer detected. AI identifies specific transaction characteristics that require verification or review, while overall account activity appears normal across channels.',
    action: '✨ Action: Temporarily suspend specific transactions while allowing other account activity to continue; verify transaction legitimacy and customer authorization before proceeding.',
    category: 'Risk',
    color: '#f59e0b',
    icon: 'pause',
    seenThisWeek: 56,
    mostCommonChannel: 'Chat'
  },
  {
    id: 'customer-counseling',
    headline: 'CUSTOMER RISK AWARENESS GAP IDENTIFIED',
    topic: 'CUSTOMER COUNSELING',
    description: 'Voice transcripts show customer mentions of pressure from third parties and confusion about transaction processes; signs of potential scam victimization detected. AI flags customer behavior patterns suggesting lack of awareness about risks, potential scam involvement, or misunderstanding of regulatory requirements.',
    action: '✨ Action: Provide proactive customer education about transaction risks and regulatory requirements; offer scam awareness guidance to prevent future issues and protect customers.',
    category: 'Compliance',
    color: '#3b82f6',
    icon: 'message',
    seenThisWeek: 38,
    mostCommonChannel: 'Voice'
  },
  {
    id: 'edd-review',
    headline: 'ENHANCED DUE DILIGENCE THRESHOLD MET',
    topic: 'EDD REVIEW',
    description: 'AI identifies high-risk customer profile indicators, complex transaction structures, and Politically Exposed Person (PEP) indicators across Email + Chat channels. Customer characteristics, transaction patterns, or risk factors meet Enhanced Due Diligence thresholds based on regulatory guidelines.',
    action: '✨ Action: Trigger Enhanced Due Diligence review processes; conduct deeper investigation and documentation per regulatory requirements for high-risk customers.',
    category: 'Compliance',
    color: '#8b5cf6',
    icon: 'search',
    seenThisWeek: 29,
    mostCommonChannel: 'Email'
  },
  {
    id: 'documentation-request',
    headline: 'DOCUMENTATION GAP DETECTED',
    topic: 'DOCUMENTATION REQUEST',
    description: 'Email + Chat threads show missing or incomplete customer information and inconsistencies in provided documentation; large transactions requiring source of funds identified. AI flags gaps in documentation, inconsistencies in customer information, or regulatory requirements that necessitate additional verification materials.',
    action: '✨ Action: Initiate requests for additional documentation to verify transaction legitimacy and customer identity; ensure all regulatory documentation requirements are met before proceeding.',
    category: 'Compliance',
    color: '#06b6d4',
    icon: 'clipboard',
    seenThisWeek: 41,
    mostCommonChannel: 'Email'
  }
];

export function getAIActionSuggestionById(id: string): AIActionSuggestion | undefined {
  return aiActionSuggestions.find(action => action.id === id);
}

export function getAIActionSuggestionsByCategory(category: 'Risk' | 'Compliance'): AIActionSuggestion[] {
  return aiActionSuggestions.filter(action => action.category === category);
}
