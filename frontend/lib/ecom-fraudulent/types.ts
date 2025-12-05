// Fraud Intelligence Dashboard Types
// All data derived from NLP analysis of unstructured communication data

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type Channel = 
  | 'Chat' 
  | 'Email' 
  | 'Tickets' 
  | 'Voice Transcripts' 
  | 'Social Posts';

export type FraudCategory = 
  | 'DNR' 
  | 'Empty Box/Tampering' 
  | 'Wardrobing' 
  | 'Wrong Item Switch'
  | 'Promo Abuse'
  | 'Referral Abuse'
  | 'Coercion'
  | 'Agent Collusion';

export type CoercionType = 
  | 'Legal Threat' 
  | 'Social Shaming' 
  | 'Urgency Pressure';

// Widget 1: Claim Taxonomy
export interface ClaimTaxonomyItem {
  category: string;
  shortLabel: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

// Widget 2: Empty Box Monitor
export interface EmptyBoxIncident {
  id: string;
  ticketId: string;
  itemValue: number;
  itemName: string;
  detectedKeyword: string;
  sentimentScore: number; // -1 to 1
  transcriptSnippet: string;
  channel: Channel;
  timestamp: string;
  riskLevel: Severity;
}

// Widget 3: Agent Collusion Watchlist
export interface AgentCollusionRisk {
  id: string;
  agentName: string;
  agentId: string;
  collusionRiskScore: number; // 0-100
  flaggedPhrase: string;
  outOfPolicyApprovals: number;
  lastFlaggedAt: string;
  department: string;
  transcriptSnippets: string[];
  detectedPatterns: string[];
}

// Widget 4: Fake Escalation Detector
export interface EscalationData {
  type: 'Legitimate' | 'Ghost';
  count: number;
  percentage: number;
}

export interface GhostEscalationDetail {
  id: string;
  ticketId: string;
  customerSentiment: number;
  escalationReason: string;
  actualCustomerTone: string;
  flaggedBy: string;
  timestamp: string;
}

// Widget 5: Coercion & Social Engineering
export interface CoercionAlert {
  id: string;
  type: CoercionType;
  customerId: string;
  threatLevel: Severity;
  detectedPhrase: string;
  transcriptSnippet: string;
  channel: Channel;
  timestamp: string;
  platform?: string; // For social shaming: Twitter, Reddit, etc.
  urgencyIndicator?: string; // For urgency: "Flight to catch", "Birthday", etc.
}

// Widget 6: Promo & Referral Abuse
export interface AbuseKeyword {
  keyword: string;
  frequency: number;
  source: Channel;
  riskWeight: number; // 1-5
  examples: string[];
  firstDetected: string;
  lastDetected: string;
}

// Dashboard Summary Stats
export interface FraudDashboardStats {
  totalAlerts: number;
  criticalAlerts: number;
  highRiskAgents: number;
  activeCoercionCases: number;
  ghostEscalationRate: number;
  lastUpdated: string;
}

// NLP Metadata (for transcript analysis)
export interface NLPMetadata {
  confidence: number;
  model: string;
  processingTime: number;
  keywords: string[];
  entities: string[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

