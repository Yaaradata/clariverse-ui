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
  totalInteractions?: number;
  avgResolutionTime?: string;
  topChannels?: {
    channel: string;
    percentage: number;
  }[];
  topics?: string[];
  nextActionSuggestion?: string;
  // Root cause breakdown
  processError?: number;        // Percentage due to process/system issues
  productKnowledgeGap?: number; // Percentage due to agent knowledge gaps
  // Channel breakdown for root causes
  processErrorByChannel?: { channel: string; count: number; percentage: number }[];
  productKnowledgeGapByChannel?: { channel: string; count: number; percentage: number }[];
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

// Bank of America Dominant Cluster Labels with Topics
export const fciClusters: FCICluster[] = [
  {
    id: '1',
    category: 'Account Access & Security',
    count: 2847,
    trend: 12.5,
    severity: 'High Impact',
    examples: [
      'Customer unable to access Online Banking after password reset',
      'SafePass authentication failures during login attempts',
      'Account lockout after multiple incorrect password entries',
      'Mobile app login issues with biometric authentication'
    ],
    affectedCustomers: 2156,
    businessImpact: 'High friction in digital adoption, increased call volume, security concerns',
    totalInteractions: 8234,
    avgResolutionTime: '2.8 hours',
    topChannels: [
      { channel: 'Voice', percentage: 38 },
      { channel: 'Chat', percentage: 32 },
      { channel: 'Email', percentage: 18 },
      { channel: 'Ticket', percentage: 12 }
    ],
    topics: ['Online ID', 'Password Reset', 'Account Lockout', 'SafePass Authentication', 'Security Alerts', 'App Login'],
    nextActionSuggestion: 'Implement self-service password reset via Erica and reduce SafePass friction with trusted device recognition',
    processError: 72,
    productKnowledgeGap: 28,
    processErrorByChannel: [
      { channel: 'Email', count: 12, percentage: 18 },
      { channel: 'Chat', count: 18, percentage: 26 },
      { channel: 'Ticket', count: 22, percentage: 32 },
      { channel: 'Voice', count: 14, percentage: 20 },
      { channel: 'Social', count: 3, percentage: 4 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 8, percentage: 22 },
      { channel: 'Chat', count: 12, percentage: 34 },
      { channel: 'Ticket', count: 6, percentage: 17 },
      { channel: 'Voice', count: 7, percentage: 20 },
      { channel: 'Social', count: 2, percentage: 7 }
    ]
  },
  {
    id: '2',
    category: 'Transaction Disputes & Fraud',
    count: 2134,
    trend: 8.7,
    severity: 'High Impact',
    examples: [
      'Unauthorized debit card charges not recognized by customer',
      'Fraud claim processing delays exceeding 10 business days',
      'Identity theft cases requiring immediate card replacement',
      'Zero liability disputes for compromised card numbers'
    ],
    affectedCustomers: 1823,
    businessImpact: 'Revenue loss from chargebacks, customer trust erosion, regulatory scrutiny',
    totalInteractions: 6542,
    avgResolutionTime: '5.2 hours',
    topChannels: [
      { channel: 'Voice', percentage: 45 },
      { channel: 'Email', percentage: 25 },
      { channel: 'Ticket', percentage: 18 },
      { channel: 'Chat', percentage: 12 }
    ],
    topics: ['Unauthorized Charges', 'Fraud Claims', 'Debit Disputes', 'Identity Theft', 'Zero Liability', 'Stolen Card'],
    nextActionSuggestion: 'Deploy real-time fraud alerts with one-click dispute filing and expedite provisional credit for confirmed fraud',
    processError: 45,
    productKnowledgeGap: 55,
    processErrorByChannel: [
      { channel: 'Email', count: 14, percentage: 22 },
      { channel: 'Chat', count: 8, percentage: 12 },
      { channel: 'Ticket', count: 24, percentage: 38 },
      { channel: 'Voice', count: 16, percentage: 25 },
      { channel: 'Social', count: 2, percentage: 3 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 18, percentage: 25 },
      { channel: 'Chat', count: 16, percentage: 22 },
      { channel: 'Ticket', count: 12, percentage: 17 },
      { channel: 'Voice', count: 22, percentage: 30 },
      { channel: 'Social', count: 4, percentage: 6 }
    ]
  },
  {
    id: '3',
    category: 'Credit Card Services',
    count: 1876,
    trend: -2.3,
    severity: 'High Impact',
    examples: [
      'BankAmericard rewards not posting correctly to account',
      'Customized Cash category changes not reflecting',
      'Premium Rewards redemption issues at partner merchants',
      'Credit line increase requests pending without response'
    ],
    affectedCustomers: 1432,
    businessImpact: 'Reduced card usage, lost interchange revenue, competitive switching',
    totalInteractions: 5234,
    avgResolutionTime: '3.1 hours',
    topChannels: [
      { channel: 'Chat', percentage: 42 },
      { channel: 'Voice', percentage: 28 },
      { channel: 'Email', percentage: 18 },
      { channel: 'Social Media', percentage: 12 }
    ],
    topics: ['BankAmericard Rewards', 'Customized Cash', 'Premium Rewards', 'Travel Rewards', 'Credit Line', 'APR Changes'],
    nextActionSuggestion: 'Auto-resolve rewards posting delays and provide proactive CLI decisions via mobile app notifications',
    processError: 35,
    productKnowledgeGap: 65,
    processErrorByChannel: [
      { channel: 'Email', count: 8, percentage: 15 },
      { channel: 'Chat', count: 10, percentage: 19 },
      { channel: 'Ticket', count: 18, percentage: 35 },
      { channel: 'Voice', count: 13, percentage: 25 },
      { channel: 'Social', count: 3, percentage: 6 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 22, percentage: 28 },
      { channel: 'Chat', count: 24, percentage: 30 },
      { channel: 'Ticket', count: 8, percentage: 10 },
      { channel: 'Voice', count: 20, percentage: 26 },
      { channel: 'Social', count: 5, percentage: 6 }
    ]
  },
  {
    id: '4',
    category: 'Loan & Mortgage Inquiries',
    count: 1654,
    trend: 15.2,
    severity: 'High Impact',
    examples: [
      'Home loan application status unclear after 30 days',
      'Mortgage refinance rate lock expiration concerns',
      'Auto loan payoff amount discrepancies',
      'Loan modification request documentation confusion'
    ],
    affectedCustomers: 1287,
    businessImpact: 'Lost lending revenue, customer attrition to competitors, NPS impact',
    totalInteractions: 4567,
    avgResolutionTime: '6.5 hours',
    topChannels: [
      { channel: 'Voice', percentage: 48 },
      { channel: 'Email', percentage: 28 },
      { channel: 'Ticket', percentage: 15 },
      { channel: 'Chat', percentage: 9 }
    ],
    topics: ['Home Loans', 'Mortgage Refinance', 'Auto Loans', 'Personal Loans', 'Rate Options', 'Loan Modification'],
    nextActionSuggestion: 'Implement real-time loan status tracker in mobile app and assign dedicated loan specialists for complex cases',
    processError: 30,
    productKnowledgeGap: 70,
    processErrorByChannel: [
      { channel: 'Email', count: 10, percentage: 20 },
      { channel: 'Chat', count: 6, percentage: 12 },
      { channel: 'Ticket', count: 20, percentage: 40 },
      { channel: 'Voice', count: 12, percentage: 24 },
      { channel: 'Social', count: 2, percentage: 4 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 28, percentage: 32 },
      { channel: 'Chat', count: 15, percentage: 17 },
      { channel: 'Ticket', count: 10, percentage: 11 },
      { channel: 'Voice', count: 32, percentage: 36 },
      { channel: 'Social', count: 3, percentage: 4 }
    ]
  },
  {
    id: '5',
    category: 'Fee Complaints & Waivers',
    count: 1432,
    trend: 6.8,
    severity: 'Medium',
    examples: [
      'Overdraft fee charged despite Preferred Rewards status',
      'Monthly maintenance fee on account with qualifying balance',
      'NSF charges for delayed ACH posting',
      'Wire transfer fee waiver request denied'
    ],
    affectedCustomers: 1156,
    businessImpact: 'Fee revenue at risk, CFPB complaint exposure, relationship damage',
    totalInteractions: 3892,
    avgResolutionTime: '1.8 hours',
    topChannels: [
      { channel: 'Chat', percentage: 38 },
      { channel: 'Voice', percentage: 32 },
      { channel: 'Social Media', percentage: 18 },
      { channel: 'Email', percentage: 12 }
    ],
    topics: ['Overdraft Fees', 'Monthly Maintenance', 'NSF Charges', 'ATM Fees', 'Wire Fees', 'Expedited Delivery'],
    nextActionSuggestion: 'Enable proactive fee waiver for Preferred Rewards members and auto-refund first-time NSF incidents',
    processError: 68,
    productKnowledgeGap: 32,
    processErrorByChannel: [
      { channel: 'Email', count: 16, percentage: 18 },
      { channel: 'Chat', count: 22, percentage: 25 },
      { channel: 'Ticket', count: 28, percentage: 32 },
      { channel: 'Voice', count: 18, percentage: 21 },
      { channel: 'Social', count: 4, percentage: 4 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 10, percentage: 24 },
      { channel: 'Chat', count: 14, percentage: 34 },
      { channel: 'Ticket', count: 5, percentage: 12 },
      { channel: 'Voice', count: 10, percentage: 24 },
      { channel: 'Social', count: 3, percentage: 6 }
    ]
  },
  {
    id: '6',
    category: 'Digital Banking & Technology',
    count: 1287,
    trend: -5.4,
    severity: 'Medium',
    examples: [
      'Mobile app crashing during check deposit',
      'Erica assistant providing incorrect balance information',
      'Zelle payment showing as pending for 3+ days',
      'Bill Pay scheduled payment failed without notification'
    ],
    affectedCustomers: 987,
    businessImpact: 'Digital adoption decline, increased branch/call volume, competitive disadvantage',
    totalInteractions: 3456,
    avgResolutionTime: '2.4 hours',
    topChannels: [
      { channel: 'Chat', percentage: 45 },
      { channel: 'Ticket', percentage: 25 },
      { channel: 'Voice', percentage: 18 },
      { channel: 'Social Media', percentage: 12 }
    ],
    topics: ['Mobile App', 'Erica Assistant', 'Zelle Payments', 'Bill Pay', 'Mobile Deposit', 'Online Statements'],
    nextActionSuggestion: 'Deploy in-app issue reporting with auto-escalation and improve Erica response accuracy for common issues',
    processError: 82,
    productKnowledgeGap: 18,
    processErrorByChannel: [
      { channel: 'Email', count: 8, percentage: 12 },
      { channel: 'Chat', count: 28, percentage: 42 },
      { channel: 'Ticket', count: 20, percentage: 30 },
      { channel: 'Voice', count: 8, percentage: 12 },
      { channel: 'Social', count: 3, percentage: 4 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 6, percentage: 20 },
      { channel: 'Chat', count: 10, percentage: 33 },
      { channel: 'Ticket', count: 5, percentage: 17 },
      { channel: 'Voice', count: 7, percentage: 23 },
      { channel: 'Social', count: 2, percentage: 7 }
    ]
  },
  {
    id: '7',
    category: 'Branch & ATM Services',
    count: 987,
    trend: 3.2,
    severity: 'Medium',
    examples: [
      'Financial center appointment availability limited',
      'ATM card retained without clear reason',
      'Cardless ATM withdrawal failures with app',
      'Notary service wait times exceeding 45 minutes'
    ],
    affectedCustomers: 756,
    businessImpact: 'Poor in-person experience, branch efficiency issues, accessibility concerns',
    totalInteractions: 2678,
    avgResolutionTime: '3.8 hours',
    topChannels: [
      { channel: 'Voice', percentage: 52 },
      { channel: 'Chat', percentage: 25 },
      { channel: 'Ticket', percentage: 15 },
      { channel: 'Email', percentage: 8 }
    ],
    topics: ['Financial Center', 'ATM Locations', 'Appointment Booking', 'Teller Services', 'Cardless ATM', 'Notary Service'],
    nextActionSuggestion: 'Enable real-time appointment booking via Erica and deploy ATM card return process for retained cards',
    processError: 55,
    productKnowledgeGap: 45,
    processErrorByChannel: [
      { channel: 'Email', count: 6, percentage: 14 },
      { channel: 'Chat', count: 10, percentage: 22 },
      { channel: 'Ticket', count: 16, percentage: 36 },
      { channel: 'Voice', count: 10, percentage: 22 },
      { channel: 'Social', count: 3, percentage: 6 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 8, percentage: 18 },
      { channel: 'Chat', count: 12, percentage: 27 },
      { channel: 'Ticket', count: 8, percentage: 18 },
      { channel: 'Voice', count: 14, percentage: 32 },
      { channel: 'Social', count: 2, percentage: 5 }
    ]
  },
  {
    id: '8',
    category: 'Investment & Wealth',
    count: 876,
    trend: -1.8,
    severity: 'Medium',
    examples: [
      'Merrill Lynch account access separate from banking',
      'Merrill Edge trade execution delays during market hours',
      'Preferred Rewards tier calculation including investments',
      'IRA contribution limit clarification needed'
    ],
    affectedCustomers: 654,
    businessImpact: 'AUM at risk, wealth client attrition, cross-sell opportunity loss',
    totalInteractions: 2345,
    avgResolutionTime: '4.5 hours',
    topChannels: [
      { channel: 'Voice', percentage: 48 },
      { channel: 'Email', percentage: 28 },
      { channel: 'Chat', percentage: 15 },
      { channel: 'Ticket', percentage: 9 }
    ],
    topics: ['Merrill Lynch', 'Merrill Edge', 'Preferred Rewards', 'Portfolio Review', 'IRAs/401k', 'Advisory Services'],
    nextActionSuggestion: 'Unify Merrill and banking login experience and provide dedicated wealth concierge for Platinum clients',
    processError: 25,
    productKnowledgeGap: 75,
    processErrorByChannel: [
      { channel: 'Email', count: 5, percentage: 16 },
      { channel: 'Chat', count: 4, percentage: 13 },
      { channel: 'Ticket', count: 12, percentage: 39 },
      { channel: 'Voice', count: 8, percentage: 26 },
      { channel: 'Social', count: 2, percentage: 6 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 26, percentage: 30 },
      { channel: 'Chat', count: 18, percentage: 21 },
      { channel: 'Ticket', count: 10, percentage: 12 },
      { channel: 'Voice', count: 28, percentage: 32 },
      { channel: 'Social', count: 4, percentage: 5 }
    ]
  },
  {
    id: '9',
    category: 'Direct Deposit & Payroll',
    count: 765,
    trend: 4.5,
    severity: 'Low',
    examples: [
      'Payroll direct deposit not reflecting on expected date',
      'Routing number confusion for external transfers',
      'ACH transfer delays beyond 3 business days',
      'Payment holds on large incoming deposits'
    ],
    affectedCustomers: 567,
    businessImpact: 'Primary account relationship at risk, payroll provider churn, cash flow concerns',
    totalInteractions: 1987,
    avgResolutionTime: '2.2 hours',
    topChannels: [
      { channel: 'Chat', percentage: 42 },
      { channel: 'Voice', percentage: 35 },
      { channel: 'Email', percentage: 15 },
      { channel: 'Ticket', percentage: 8 }
    ],
    topics: ['Payroll Deposit', 'Routing Number', 'Direct Deposit', 'Deposit Delays', 'ACH Transfers', 'Payment Holds'],
    nextActionSuggestion: 'Provide real-time deposit tracking and proactive notifications for expected payroll timing',
    processError: 65,
    productKnowledgeGap: 35,
    processErrorByChannel: [
      { channel: 'Email', count: 12, percentage: 20 },
      { channel: 'Chat', count: 18, percentage: 30 },
      { channel: 'Ticket', count: 16, percentage: 27 },
      { channel: 'Voice', count: 10, percentage: 17 },
      { channel: 'Social', count: 4, percentage: 6 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 10, percentage: 22 },
      { channel: 'Chat', count: 14, percentage: 30 },
      { channel: 'Ticket', count: 6, percentage: 13 },
      { channel: 'Voice', count: 14, percentage: 30 },
      { channel: 'Social', count: 2, percentage: 5 }
    ]
  },
  {
    id: '10',
    category: 'Account Closure & Changes',
    count: 543,
    trend: 7.1,
    severity: 'Low',
    examples: [
      'Account closure process taking longer than 7 days',
      'Upgrade to Preferred Rewards not reflecting benefits',
      'Joint account addition requiring branch visit',
      'Beneficiary designation update complexity'
    ],
    affectedCustomers: 423,
    businessImpact: 'Customer attrition, relationship value loss, process inefficiency',
    totalInteractions: 1456,
    avgResolutionTime: '5.8 hours',
    topChannels: [
      { channel: 'Voice', percentage: 45 },
      { channel: 'Email', percentage: 28 },
      { channel: 'Ticket', percentage: 18 },
      { channel: 'Chat', percentage: 9 }
    ],
    topics: ['Close Account', 'Account Upgrade', 'Preferred Rewards', 'Product Switch', 'Joint Account', 'Beneficiary Designation'],
    nextActionSuggestion: 'Enable digital account modifications and deploy retention offers for closure intent detection',
    processError: 58,
    productKnowledgeGap: 42,
    processErrorByChannel: [
      { channel: 'Email', count: 14, percentage: 22 },
      { channel: 'Chat', count: 8, percentage: 13 },
      { channel: 'Ticket', count: 22, percentage: 35 },
      { channel: 'Voice', count: 16, percentage: 25 },
      { channel: 'Social', count: 3, percentage: 5 }
    ],
    productKnowledgeGapByChannel: [
      { channel: 'Email', count: 12, percentage: 25 },
      { channel: 'Chat', count: 10, percentage: 21 },
      { channel: 'Ticket', count: 8, percentage: 17 },
      { channel: 'Voice', count: 15, percentage: 31 },
      { channel: 'Social', count: 3, percentage: 6 }
    ]
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


