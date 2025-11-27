// FCI Dashboard Data Types and Sample Data

export interface FCIKPIData {
  overallFCIRate: {
    value: number;
    trend: number;
    description: string;
  };
  preventableFCIPercent: {
    value: number;
    trend: number;
    description: string;
  };
  repeatContactRate: {
    value: number;
    trend: number;
    description: string;
  };
  unresolvedCasePercent: {
    value: number;
    trend: number;
    description: string;
  };
  businessImpactEstimate: {
    value: number;
    trend: number;
    description: string;
    currency: string;
  };
  highRiskCustomersImpacted: number;
}

export interface FCICluster {
  id: string;
  category: string;
  count: number;
  trend: number;
  severity: 'High Impact' | 'Medium' | 'Low';
  examples: string[];
  affectedCustomers: number;
  businessImpact: string;
}

export interface CustomerEmotionData {
  negativeSentimentPercent: number;
  sentimentTrend: number;
  frustrationSignals: {
    escalations: number;
    longHandlingTimeCases: number;
    interruptions: number;
    highAgitationCalls: number;
  };
  complaintReopenHeat: number;
  topAngerDrivers: {
    driver: string;
    frequency: number;
    exampleQuote: string;
  }[];
  frustratedQuotes: string[];
}

export interface AIAction {
  id: string;
  type: 'Process Fix' | 'Agent Skills Enhancement' | 'Proactive Alert';
  title: string;
  description: string;
  estimatedFCIReduction: number;
  impactOnTrustScore: number;
  timeToImplement: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

// Sample Data
export const fciKPIData: FCIKPIData = {
  overallFCIRate: {
    value: 18.5,
    trend: -2.3,
    description: '% of conversations where intended customer outcome failed'
  },
  preventableFCIPercent: {
    value: 62.0,
    trend: 1.2,
    description: 'Failures caused by agent/process gaps'
  },
  repeatContactRate: {
    value: 24.3,
    trend: -0.8,
    description: 'Customer returns for same unresolved issue'
  },
  unresolvedCasePercent: {
    value: 15.7,
    trend: 0.5,
    description: 'Failures that never closed properly'
  },
  businessImpactEstimate: {
    value: 2450000,
    trend: -5.2,
    description: 'Loss driven due to failed interactions',
    currency: 'USD'
  },
  highRiskCustomersImpacted: 342
};

export const fciClusters: FCICluster[] = [
  {
    id: '1',
    category: 'Authentication and access issues',
    count: 1247,
    trend: 8.3,
    severity: 'High Impact',
    examples: [
      'Multiple login failures',
      'MFA retry loops',
      'Account lockouts',
      'Password reset failures'
    ],
    affectedCustomers: 892,
    businessImpact: 'High customer frustration, potential churn'
  },
  {
    id: '2',
    category: 'Dispute resolution delays',
    count: 856,
    trend: -3.1,
    severity: 'High Impact',
    examples: [
      'Chargeback disputes unresolved',
      'Refund processing delays',
      'Transaction disputes pending',
      'Billing error corrections'
    ],
    affectedCustomers: 623,
    businessImpact: 'Regulatory compliance risk, customer trust erosion'
  },
  {
    id: '3',
    category: 'Charges/fees confusion',
    count: 643,
    trend: 5.7,
    severity: 'Medium',
    examples: [
      'Hidden fee complaints',
      'Unexpected charges',
      'Fee structure unclear',
      'Billing transparency issues'
    ],
    affectedCustomers: 512,
    businessImpact: 'Customer satisfaction decline'
  },
  {
    id: '4',
    category: 'Card declines / blocking',
    count: 521,
    trend: 12.4,
    severity: 'High Impact',
    examples: [
      'Legitimate transactions blocked',
      'False fraud alerts',
      'Card activation failures',
      'Payment processing errors'
    ],
    affectedCustomers: 398,
    businessImpact: 'Revenue loss, customer experience degradation'
  },
  {
    id: '5',
    category: 'KYC document rejections',
    count: 389,
    trend: -1.8,
    severity: 'Medium',
    examples: [
      'Document format issues',
      'OCR extraction failures',
      'Verification delays',
      'Resubmission loops'
    ],
    affectedCustomers: 287,
    businessImpact: 'Onboarding friction, compliance delays'
  }
];

export const customerEmotionData: CustomerEmotionData = {
  negativeSentimentPercent: 34.2,
  sentimentTrend: 2.1,
  frustrationSignals: {
    escalations: 456,
    longHandlingTimeCases: 723,
    interruptions: 312,
    highAgitationCalls: 189
  },
  complaintReopenHeat: 67,
  topAngerDrivers: [
    {
      driver: 'Repeated authentication requests',
      frequency: 234,
      exampleQuote: '"I\'ve verified my identity three times already!"'
    },
    {
      driver: 'Long wait times without resolution',
      frequency: 189,
      exampleQuote: '"I\'ve been waiting for 2 hours and still no answer"'
    },
    {
      driver: 'Inconsistent information across channels',
      frequency: 156,
      exampleQuote: '"Chat said one thing, email said another"'
    },
    {
      driver: 'Unexpected fees or charges',
      frequency: 134,
      exampleQuote: '"Why am I being charged this? No one told me!"'
    },
    {
      driver: 'Case closed without resolution',
      frequency: 112,
      exampleQuote: '"You closed my ticket but my problem isn\'t fixed!"'
    }
  ],
  frustratedQuotes: [
    '"This is the third time I\'m calling about the same issue!"',
    '"I\'m extremely frustrated with your service"',
    '"Why does it take so long to resolve a simple problem?"',
    '"I\'m considering switching to a competitor"',
    '"This is unacceptable customer service"'
  ]
};

export const aiActions: AIAction[] = [
  {
    id: '1',
    type: 'Process Fix',
    title: 'Auto-resolve simple charge disputes',
    description: 'Implement automated resolution for low-value disputes (<$50) with clear transaction history',
    estimatedFCIReduction: 18,
    impactOnTrustScore: 12,
    timeToImplement: '2-3 weeks',
    priority: 'High',
    category: 'Automation'
  },
  {
    id: '2',
    type: 'Process Fix',
    title: 'Add proactive callback for high-risk cases',
    description: 'Automatically schedule callbacks for cases that exceed SLA thresholds',
    estimatedFCIReduction: 15,
    impactOnTrustScore: 18,
    timeToImplement: '3-4 weeks',
    priority: 'High',
    category: 'Proactive Service'
  },
  {
    id: '3',
    type: 'Agent Skills Enhancement',
    title: 'Coaching needed for empathy and product knowledge',
    description: 'Targeted training for help desk teams showing high negative sentiment scores',
    estimatedFCIReduction: 22,
    impactOnTrustScore: 25,
    timeToImplement: '4-6 weeks',
    priority: 'High',
    category: 'Training'
  },
  {
    id: '4',
    type: 'Agent Skills Enhancement',
    title: 'Negative sentiment linked to specific help desk teams',
    description: 'Team 3 and Team 7 show 40% higher negative sentiment - require immediate intervention',
    estimatedFCIReduction: 28,
    impactOnTrustScore: 30,
    timeToImplement: '2-3 weeks',
    priority: 'High',
    category: 'Team Performance'
  },
  {
    id: '5',
    type: 'Proactive Alert',
    title: 'Spike in repeat disputes in credit cards',
    description: 'Detected 45% increase in credit card dispute reopenings - investigate root cause',
    estimatedFCIReduction: 12,
    impactOnTrustScore: 15,
    timeToImplement: '1 week',
    priority: 'Medium',
    category: 'Monitoring'
  },
  {
    id: '6',
    type: 'Proactive Alert',
    title: 'Overnight backlog causing resolution delays',
    description: 'Cases processed during off-hours show 3x longer resolution times',
    estimatedFCIReduction: 10,
    impactOnTrustScore: 8,
    timeToImplement: '2 weeks',
    priority: 'Medium',
    category: 'Operations'
  }
];

