export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type Channel = 
  | 'Chat' 
  | 'Voice' 
  | 'Voice (Inbound)' 
  | 'Voice (Outbound)'
  | 'Email' 
  | 'Ticket' 
  | 'Social Media';

export interface Insight {
  id: string;
  title: string;
  severity: Severity;
  channels: Channel[];
  domain: string;
  detected_at: string;
  affected_interactions: number;
  issue: string;
  root_cause: string;
  corrective_action: string;
}

