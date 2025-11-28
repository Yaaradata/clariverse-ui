// Compliance Dashboard Data Types and Sample Data

export type TimeFilter = '24h' | '7d' | '30d';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Region = 'APAC' | 'India' | 'Europe' | 'Americas' | 'MEA';
export type RiskCategory = 'fraud' | 'operational' | 'reputation' | 'third-party' | 'cyber';
export type ViolationCategory = 'KYC' | 'Script Violation' | 'Data Privacy' | 'AML' | 'Consent' | 'PCI-DSS';

export interface ComplianceScore {
  value: number;
  trend: number;
  previousValue: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export interface ViolationData {
  category: ViolationCategory;
  count: number;
  trend: number;
  severity: Severity;
  percentage: number;
}

export interface ComplianceIssue {
  id: string;
  issue: string;
  category: ViolationCategory;
  agentId: string;
  agentName: string;
  severity: Severity;
  region: Region;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  repeatOffense: boolean;
}

export interface ComplianceInsight {
  id: string;
  message: string;
  type: 'warning' | 'alert' | 'info' | 'critical';
  category: ViolationCategory | RiskCategory;
  change?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: Severity;
  region: Region;
  timestamp: string;
  impactedAgents: number;
  impactedCustomers: number;
  status: 'active' | 'monitoring' | 'resolved';
}

export interface ComplianceMetrics {
  totalViolations: number;
  resolvedToday: number;
  pendingReview: number;
  criticalIssues: number;
  avgResolutionTime: string;
  complianceRate: number;
}

// Sample Data
export const complianceScoreData: Record<TimeFilter, ComplianceScore> = {
  '24h': {
    value: 87.5,
    trend: -2.3,
    previousValue: 89.8,
    rating: 'good'
  },
  '7d': {
    value: 85.2,
    trend: 1.8,
    previousValue: 83.4,
    rating: 'good'
  },
  '30d': {
    value: 82.7,
    trend: 3.5,
    previousValue: 79.2,
    rating: 'fair'
  }
};

export const violationCategoryData: Record<TimeFilter, ViolationData[]> = {
  '24h': [
    { category: 'KYC', count: 45, trend: 20, severity: 'high', percentage: 32 },
    { category: 'Script Violation', count: 38, trend: -5, severity: 'medium', percentage: 27 },
    { category: 'Data Privacy', count: 28, trend: 15, severity: 'critical', percentage: 20 },
    { category: 'AML', count: 15, trend: -10, severity: 'high', percentage: 11 },
    { category: 'Consent', count: 10, trend: 8, severity: 'medium', percentage: 7 },
    { category: 'PCI-DSS', count: 5, trend: 0, severity: 'low', percentage: 3 }
  ],
  '7d': [
    { category: 'KYC', count: 312, trend: 18, severity: 'high', percentage: 30 },
    { category: 'Script Violation', count: 287, trend: -3, severity: 'medium', percentage: 28 },
    { category: 'Data Privacy', count: 198, trend: 12, severity: 'critical', percentage: 19 },
    { category: 'AML', count: 124, trend: -8, severity: 'high', percentage: 12 },
    { category: 'Consent', count: 78, trend: 5, severity: 'medium', percentage: 7 },
    { category: 'PCI-DSS', count: 41, trend: 2, severity: 'low', percentage: 4 }
  ],
  '30d': [
    { category: 'KYC', count: 1245, trend: 22, severity: 'high', percentage: 31 },
    { category: 'Script Violation', count: 1089, trend: -2, severity: 'medium', percentage: 27 },
    { category: 'Data Privacy', count: 756, trend: 15, severity: 'critical', percentage: 19 },
    { category: 'AML', count: 498, trend: -12, severity: 'high', percentage: 12 },
    { category: 'Consent', count: 312, trend: 8, severity: 'medium', percentage: 8 },
    { category: 'PCI-DSS', count: 145, trend: 3, severity: 'low', percentage: 3 }
  ]
};

export const complianceIssuesData: ComplianceIssue[] = [
  {
    id: 'CI-001',
    issue: 'Customer identity verification skipped during high-value transaction',
    category: 'KYC',
    agentId: 'AGT-2451',
    agentName: 'Michael Chen',
    severity: 'critical',
    region: 'APAC',
    timestamp: '2024-01-15T09:23:00Z',
    status: 'open',
    repeatOffense: false
  },
  {
    id: 'CI-002',
    issue: 'Script deviation during risk disclosure - missing mandatory statements',
    category: 'Script Violation',
    agentId: 'AGT-1823',
    agentName: 'Sarah Williams',
    severity: 'high',
    region: 'Europe',
    timestamp: '2024-01-15T08:45:00Z',
    status: 'investigating',
    repeatOffense: true
  },
  {
    id: 'CI-003',
    issue: 'Customer data shared with unauthorized third-party vendor',
    category: 'Data Privacy',
    agentId: 'AGT-3012',
    agentName: 'James Rodriguez',
    severity: 'critical',
    region: 'Americas',
    timestamp: '2024-01-15T07:30:00Z',
    status: 'open',
    repeatOffense: false
  },
  {
    id: 'CI-004',
    issue: 'Suspicious transaction pattern not flagged for AML review',
    category: 'AML',
    agentId: 'AGT-2789',
    agentName: 'Priya Sharma',
    severity: 'high',
    region: 'India',
    timestamp: '2024-01-15T06:15:00Z',
    status: 'investigating',
    repeatOffense: true
  },
  {
    id: 'CI-005',
    issue: 'Recording consent not obtained before call recording started',
    category: 'Consent',
    agentId: 'AGT-1456',
    agentName: 'Emma Johnson',
    severity: 'medium',
    region: 'Europe',
    timestamp: '2024-01-15T05:50:00Z',
    status: 'resolved',
    repeatOffense: false
  },
  {
    id: 'CI-006',
    issue: 'Same agent repeated script violation - 3rd occurrence this week',
    category: 'Script Violation',
    agentId: 'AGT-1823',
    agentName: 'Sarah Williams',
    severity: 'high',
    region: 'Europe',
    timestamp: '2024-01-15T04:20:00Z',
    status: 'open',
    repeatOffense: true
  },
  {
    id: 'CI-007',
    issue: 'BPO vendor downloading customer financial data without authorization',
    category: 'Data Privacy',
    agentId: 'BPO-VN-089',
    agentName: 'Vendor: TechServe Asia',
    severity: 'critical',
    region: 'APAC',
    timestamp: '2024-01-15T03:10:00Z',
    status: 'open',
    repeatOffense: false
  },
  {
    id: 'CI-008',
    issue: 'KYC document verification bypassed for VIP customer',
    category: 'KYC',
    agentId: 'AGT-3456',
    agentName: 'David Kim',
    severity: 'high',
    region: 'APAC',
    timestamp: '2024-01-15T02:45:00Z',
    status: 'investigating',
    repeatOffense: false
  }
];

export const complianceInsightsData: ComplianceInsight[] = [
  {
    id: 'INS-001',
    message: 'KYC complaints are up by 20% compared to last week',
    type: 'warning',
    category: 'KYC',
    change: 20,
    trend: 'up'
  },
  {
    id: 'INS-002',
    message: 'Agent AGT-1823 (Sarah Williams) repeated 2 violations in script compliance',
    type: 'alert',
    category: 'Script Violation',
    trend: 'up'
  },
  {
    id: 'INS-003',
    message: 'BPO Vendor TechServe Asia downloading sensitive data - immediate review required',
    type: 'critical',
    category: 'third-party',
    trend: 'up'
  },
  {
    id: 'INS-004',
    message: 'Data privacy violations trending down by 8% in EMEA region',
    type: 'info',
    category: 'Data Privacy',
    change: -8,
    trend: 'down'
  },
  {
    id: 'INS-005',
    message: 'AML alert response time improved by 15% after process update',
    type: 'info',
    category: 'AML',
    change: -15,
    trend: 'down'
  },
  {
    id: 'INS-006',
    message: 'Consent violations spiking in European operations - GDPR risk',
    type: 'warning',
    category: 'Consent',
    change: 12,
    trend: 'up'
  }
];

export const riskAlertsData: RiskAlert[] = [
  {
    id: 'RA-001',
    title: 'Potential Fraud Pattern Detected',
    description: 'Unusual transaction approval patterns from APAC region - 15 high-value transactions bypassed verification',
    category: 'fraud',
    severity: 'critical',
    region: 'APAC',
    timestamp: '2024-01-15T09:00:00Z',
    impactedAgents: 3,
    impactedCustomers: 15,
    status: 'active'
  },
  {
    id: 'RA-002',
    title: 'Cyber Security Breach Attempt',
    description: 'Multiple failed login attempts detected on agent workstations - potential credential stuffing attack',
    category: 'cyber',
    severity: 'high',
    region: 'India',
    timestamp: '2024-01-15T08:30:00Z',
    impactedAgents: 12,
    impactedCustomers: 0,
    status: 'active'
  },
  {
    id: 'RA-003',
    title: 'Tier 1 Customer Complaint - HNI',
    description: 'High-net-worth customer filed formal complaint about unauthorized data access',
    category: 'reputation',
    severity: 'critical',
    region: 'Europe',
    timestamp: '2024-01-15T07:45:00Z',
    impactedAgents: 1,
    impactedCustomers: 1,
    status: 'active'
  },
  {
    id: 'RA-004',
    title: 'Third-Party Vendor Non-Compliance',
    description: 'BPO vendor TechServe Asia failed data handling audit - immediate contract review required',
    category: 'third-party',
    severity: 'high',
    region: 'APAC',
    timestamp: '2024-01-15T06:20:00Z',
    impactedAgents: 45,
    impactedCustomers: 2340,
    status: 'monitoring'
  },
  {
    id: 'RA-005',
    title: 'Operational System Outage',
    description: 'Compliance monitoring pools down in Americas region - real-time monitoring affected',
    category: 'operational',
    severity: 'high',
    region: 'Americas',
    timestamp: '2024-01-15T05:15:00Z',
    impactedAgents: 156,
    impactedCustomers: 0,
    status: 'active'
  },
  {
    id: 'RA-006',
    title: 'Social Media Brand Risk',
    description: 'Negative sentiment spike on Twitter regarding data breach claims - PR response needed',
    category: 'reputation',
    severity: 'medium',
    region: 'Americas',
    timestamp: '2024-01-15T04:30:00Z',
    impactedAgents: 0,
    impactedCustomers: 0,
    status: 'monitoring'
  },
  {
    id: 'RA-007',
    title: 'Fraud Ring Activity',
    description: 'Coordinated fraudulent account opening attempts detected from MEA region',
    category: 'fraud',
    severity: 'critical',
    region: 'MEA',
    timestamp: '2024-01-15T03:00:00Z',
    impactedAgents: 0,
    impactedCustomers: 28,
    status: 'active'
  }
];

export const complianceMetricsData: Record<TimeFilter, ComplianceMetrics> = {
  '24h': {
    totalViolations: 141,
    resolvedToday: 87,
    pendingReview: 42,
    criticalIssues: 12,
    avgResolutionTime: '2.4 hrs',
    complianceRate: 87.5
  },
  '7d': {
    totalViolations: 1040,
    resolvedToday: 892,
    pendingReview: 98,
    criticalIssues: 50,
    avgResolutionTime: '4.2 hrs',
    complianceRate: 85.2
  },
  '30d': {
    totalViolations: 4045,
    resolvedToday: 3678,
    pendingReview: 245,
    criticalIssues: 122,
    avgResolutionTime: '5.8 hrs',
    complianceRate: 82.7
  }
};

// Utility functions
export const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    default: return '#939394';
  }
};

export const getRiskCategoryIcon = (category: RiskCategory): string => {
  switch (category) {
    case 'fraud': return '🚨';
    case 'cyber': return '🔐';
    case 'operational': return '⚙️';
    case 'reputation': return '📢';
    case 'third-party': return '🤝';
    default: return '⚠️';
  }
};

export const getRegionFlag = (region: Region): string => {
  switch (region) {
    case 'APAC': return '🌏';
    case 'India': return '🇮🇳';
    case 'Europe': return '🇪🇺';
    case 'Americas': return '🌎';
    case 'MEA': return '🌍';
    default: return '🌐';
  }
};

export const getScoreRatingColor = (rating: ComplianceScore['rating']): string => {
  switch (rating) {
    case 'excellent': return '#22c55e';
    case 'good': return '#3b82f6';
    case 'fair': return '#eab308';
    case 'poor': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#939394';
  }
};

