// Advanced FCI Components Data Types and Sample Data

// Component A: Resolution Effectiveness Monitor
export interface ResolutionQualityData {
  fcrRate: number;
  reopenRate: number;
  trendData: {
    date: string;
    fcrRate: number;
    reopenRate: number;
    isForecast?: boolean;
  }[];
  alerts: {
    category: string;
    reopenRate: number;
    threshold: number;
    detected: boolean;
  }[];
  aiRecommendation: {
    title: string;
    description: string;
    action: string;
  } | null;
  trainingLink: string;
  annotations?: {
    date: string;
    label: string;
    type: 'event' | 'milestone';
  }[];
}

// Component B: Knowledge & Accuracy Log
export interface KnowledgeAccuracyData {
  topics: {
    topic: string;
    errorRate: number;
    totalInteractions: number;
    failedInteractions: number;
    processErrors: number;
    knowledgeGaps: number;
  }[];
  alerts: {
    topic: string;
    errorRate: number;
    threshold: number;
    detected: boolean;
  }[];
  aiRecommendation: {
    title: string;
    description: string;
    action: string;
  } | null;
  trainingLink: string;
}

// Component C: Avoidable Escalation Split-Bar
export interface EscalationData {
  totalEscalations: number;
  confidenceGapPercent: number;
  processRequirementPercent: number;
  confidenceGapCount: number;
  processRequirementCount: number;
  weakPhrases: {
    phrase: string;
    count: number;
    context: string;
  }[];
  alerts: {
    confidenceGapThreshold: number;
    detected: boolean;
  };
  aiRecommendation: {
    title: string;
    description: string;
    action: string;
    coaching: string;
  } | null;
  trainingLink: string;
}

// Component D: Empathy & Tone Analyzer
export interface EmpathyToneData {
  sentimentScore: number;
  relationalPercent: number;
  transactionalPercent: number;
  relationalKeywords: {
    keyword: string;
    count: number;
  }[];
  transactionalKeywords: {
    keyword: string;
    count: number;
  }[];
  alerts: {
    transactionalThreshold: number;
    detected: boolean;
  };
  aiRecommendation: {
    title: string;
    description: string;
    action: string;
  } | null;
  trainingLink: string;
}

// Component E: Smart Agent Action List
export interface AgentActionData {
  agents: {
    agentId: string;
    agentName: string;
    primaryFailureMode: string;
    failureCount: number;
    behavioralPattern: string;
    aiSuggestedIntervention: string;
    trainingModule: string;
  }[];
}

// Component F: FCI Pillar Performance Treemap
export interface PillarTreemapData {
  pillars: {
    pillar: string;
    category: string;
    volume: number;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    trend: 'Worsening' | 'Improving' | 'Stable';
    alerts: {
      detected: boolean;
      type: string;
      description: string;
    }[];
    aiRecommendation: {
      title: string;
      description: string;
      action: string;
    } | null;
    trainingLink: string;
  }[];
}

// Component G: Three-Pane Audit Workbench
export interface AuditWorkbenchData {
  transcript: {
    timestamp: string;
    speaker: 'Agent' | 'Customer';
    text: string;
    highlight: 'success' | 'failure' | 'risk' | null;
    tooltip?: string;
  }[];
  diagnosis: {
    nonResolution: 'pass' | 'fail' | 'risk';
    tat: 'pass' | 'fail' | 'risk';
    repeatContact: 'pass' | 'fail' | 'risk';
    incorrectInformation: 'pass' | 'fail' | 'risk';
    escalation: 'pass' | 'fail' | 'risk';
    sla: 'pass' | 'fail' | 'risk';
    failedFromCustomer: 'pass' | 'fail' | 'risk';
  };
  nextBestAction: {
    headline: string;
    context: string;
    quickFixScript: string;
    trainingLink: string;
  };
}

// Sample Data
export const resolutionQualityData: ResolutionQualityData = {
  fcrRate: 72.5,
  reopenRate: 18.3,
  trendData: [
    { date: 'Week 1', fcrRate: 68.5, reopenRate: 22.3 },
    { date: 'Week 2', fcrRate: 71.2, reopenRate: 19.8 },
    { date: 'Week 3', fcrRate: 69.8, reopenRate: 21.1 },
    { date: 'Week 4', fcrRate: 73.4, reopenRate: 17.5 },
    { date: 'Week 5', fcrRate: 70.9, reopenRate: 19.2 },
    { date: 'Week 6', fcrRate: 74.1, reopenRate: 16.8 },
    { date: 'Week 7', fcrRate: 72.5, reopenRate: 18.3 },
    { date: 'Week 8', fcrRate: 75.2, reopenRate: 15.9 }
  ],
  alerts: [
    {
      category: 'Credit Card Dispute',
      reopenRate: 42.5,
      threshold: 40,
      detected: true
    },
    {
      category: 'Wire Transfer',
      reopenRate: 35.2,
      threshold: 40,
      detected: false
    }
  ],
  aiRecommendation: {
    title: 'Process Gap Detected',
    description: "40% of 'Dispute' tickets are re-opened. The AI detects missing 'Affidavit' forms in the initial reply.",
    action: "Deploy a mandatory 'Checklist Popup' for agents when closing Dispute tickets to ensure the form is attached."
  },
  trainingLink: 'Get it Right - Demonstrating Accuracy'
};

export const knowledgeAccuracyData: KnowledgeAccuracyData = {
  topics: [
    {
      topic: 'Wire Transfers',
      errorRate: 28.5,
      totalInteractions: 450,
      failedInteractions: 128,
      processErrors: 45,
      knowledgeGaps: 83
    },
    {
      topic: 'Fee Reversals',
      errorRate: 22.3,
      totalInteractions: 380,
      failedInteractions: 85,
      processErrors: 32,
      knowledgeGaps: 53
    },
    {
      topic: 'App Login',
      errorRate: 18.7,
      totalInteractions: 520,
      failedInteractions: 97,
      processErrors: 28,
      knowledgeGaps: 69
    },
    {
      topic: 'Account Closure',
      errorRate: 15.2,
      totalInteractions: 290,
      failedInteractions: 44,
      processErrors: 18,
      knowledgeGaps: 26
    },
    {
      topic: 'Card Activation',
      errorRate: 12.8,
      totalInteractions: 610,
      failedInteractions: 78,
      processErrors: 25,
      knowledgeGaps: 53
    }
  ],
  alerts: [
    {
      topic: 'Wire Transfers',
      errorRate: 28.5,
      threshold: 25,
      detected: true
    }
  ],
  aiRecommendation: {
    title: 'Knowledge Gap',
    description: 'Agents are misquoting wire transfer limits.',
    action: "Push a 'Flash Update' notification to the agent desktop toolbar clarifying the $5,000 daily limit."
  },
  trainingLink: 'Get it Right - Use Resources'
};

export const escalationData: EscalationData = {
  totalEscalations: 456,
  confidenceGapPercent: 42.3,
  processRequirementPercent: 57.7,
  confidenceGapCount: 193,
  processRequirementCount: 263,
  weakPhrases: [
    {
      phrase: "I don't have the authority",
      count: 87,
      context: 'Email threads, Chat, Voice transcripts'
    },
    {
      phrase: "I'm not sure about that",
      count: 56,
      context: 'Chat, Voice transcripts'
    },
    {
      phrase: "Let me transfer you to someone who can help",
      count: 34,
      context: 'Voice transcripts, Chat'
    },
    {
      phrase: "That's not my department",
      count: 16,
      context: 'Email threads, Chat'
    }
  ],
  alerts: {
    confidenceGapThreshold: 40,
    detected: true
  },
  aiRecommendation: {
    title: 'Ownership Failure',
    description: "Agents are using 'Weak Words' to justify unnecessary transfers. 40% of escalations could be resolved by the agent.",
    action: "Coach agent to replace 'I don't have the authority' with 'Let me bring a colleague on the line who can further assist us' to maintain ownership.",
    coaching: 'Specific Coaching: Coach agent to replace weak language with ownership phrases'
  },
  trainingLink: 'Confidence through Strong Words (Page 5) - Focus on Alternate Suggestions column'
};

export const empathyToneData: EmpathyToneData = {
  sentimentScore: 0.35,
  relationalPercent: 20,
  transactionalPercent: 80,
  relationalKeywords: [
    { keyword: 'I understand', count: 234 },
    { keyword: 'Frustrating', count: 189 },
    { keyword: 'Together', count: 156 },
    { keyword: 'Support', count: 298 }
  ],
  transactionalKeywords: [
    { keyword: 'Policy', count: 456 },
    { keyword: 'Required', count: 389 },
    { keyword: 'No', count: 267 },
    { keyword: 'Procedure', count: 198 }
  ],
  alerts: {
    transactionalThreshold: 80,
    detected: true
  },
  aiRecommendation: {
    title: 'Tone Alert',
    description: "The team is sounding robotic. Customer sentiment drops when agents use words like 'Policy' more than 3 times.",
    action: "Instruct team to use the 'Mirroring' technique—repeat the customer's specific concern before stating the policy."
  },
  trainingLink: 'Act with Empathy - Mirroring'
};

export const agentActionData: AgentActionData = {
  agents: [
    {
      agentId: 'A001',
      agentName: 'John Doe',
      primaryFailureMode: 'Repeat Contact (High)',
      failureCount: 23,
      behavioralPattern: 'Agent jumps to solutions without asking "Clarifying Questions", causing the customer to call back',
      aiSuggestedIntervention: 'Assign "Discover & Clarify" Module',
      trainingModule: 'Discover & Clarify'
    },
    {
      agentId: 'A002',
      agentName: 'Jane Smith',
      primaryFailureMode: 'Incorrect Information',
      failureCount: 18,
      behavioralPattern: 'Agent guessing answers instead of using tools',
      aiSuggestedIntervention: 'Assign "Demonstrating Accuracy" Module',
      trainingModule: 'Demonstrating Accuracy'
    },
    {
      agentId: 'A003',
      agentName: 'Mike Wilson',
      primaryFailureMode: 'Escalation (High)',
      failureCount: 31,
      behavioralPattern: 'Agent using phrases like "I don\'t have authority" frequently',
      aiSuggestedIntervention: 'Assign "Confidence through Strong Words" Module',
      trainingModule: 'Confidence through Strong Words'
    },
    {
      agentId: 'A004',
      agentName: 'Sarah Jones',
      primaryFailureMode: 'Failed from Customer',
      failureCount: 15,
      behavioralPattern: 'Transactional tone (cold/robotic) detected',
      aiSuggestedIntervention: 'Assign "Relational vs. Transactional" Module',
      trainingModule: 'Relational vs. Transactional'
    },
    {
      agentId: 'A005',
      agentName: 'David Brown',
      primaryFailureMode: 'SLA Breach',
      failureCount: 12,
      behavioralPattern: 'Delays in "Engage" phase, failing to discover quickly',
      aiSuggestedIntervention: 'Assign "Types of Questions" Module',
      trainingModule: 'Types of Questions'
    }
  ]
};

export const pillarTreemapData: PillarTreemapData = {
  pillars: [
    {
      pillar: 'GET IT RIGHT',
      category: 'Incorrect Information',
      volume: 456,
      severity: 'Critical',
      trend: 'Worsening',
      alerts: [
        {
          detected: true,
          type: 'Incorrect Info',
          description: 'AI detects agents guessing answers instead of using tools'
        }
      ],
      aiRecommendation: {
        title: 'Knowledge Gap',
        description: 'Agents guessing answers instead of using tools',
        action: "Suggest assigning 'Demonstrating Accuracy' module (Page 11). Remind agents to use the 'Type Text' feature to take notes."
      },
      trainingLink: 'Demonstrating Accuracy (Page 11)'
    },
    {
      pillar: 'GET IT RIGHT',
      category: 'Non-resolution',
      volume: 389,
      severity: 'High',
      trend: 'Stable',
      alerts: [],
      aiRecommendation: null,
      trainingLink: 'Demonstrating Accuracy (Page 11)'
    },
    {
      pillar: 'GET IT RIGHT',
      category: 'Repeat Contact',
      volume: 523,
      severity: 'High',
      trend: 'Worsening',
      alerts: [],
      aiRecommendation: null,
      trainingLink: 'Demonstrating Accuracy (Page 11)'
    },
    {
      pillar: 'TAKE OWNERSHIP',
      category: 'Escalation',
      volume: 456,
      severity: 'Critical',
      trend: 'Worsening',
      alerts: [
        {
          detected: true,
          type: 'Escalation',
          description: "AI detects phrases like 'I don't have authority'"
        }
      ],
      aiRecommendation: {
        title: 'Confidence Issue',
        description: "AI detects phrases like 'I don't have authority'",
        action: "Suggest assigning 'Confidence through Strong Words' (Page 5). Coach agents to replace 'I don't have authority' with 'Let me bring a colleague on...'."
      },
      trainingLink: 'Confidence through Strong Words (Page 5)'
    },
    {
      pillar: 'ACT WITH EMPATHY',
      category: 'Failed from Customer',
      volume: 312,
      severity: 'High',
      trend: 'Worsening',
      alerts: [
        {
          detected: true,
          type: 'Failed from Customer',
          description: "AI detects 'Transactional' tone (cold/robotic)"
        }
      ],
      aiRecommendation: {
        title: 'Tone Mismatch',
        description: "AI detects 'Transactional' tone (cold/robotic)",
        action: "Suggest assigning 'Relational vs. Transactional' (Page 8). Coach team to use Inclusive Language like 'Folks/Friends' instead of formal jargon."
      },
      trainingLink: 'Relational vs. Transactional (Page 8)'
    },
    {
      pillar: 'MAKE IT EASY',
      category: 'TAT',
      volume: 267,
      severity: 'Medium',
      trend: 'Stable',
      alerts: [],
      aiRecommendation: null,
      trainingLink: 'Types of Questions (Page 3)'
    },
    {
      pillar: 'MAKE IT EASY',
      category: 'SLA',
      volume: 198,
      severity: 'Medium',
      trend: 'Worsening',
      alerts: [
        {
          detected: true,
          type: 'SLA',
          description: "AI detects delays in 'Engage' phase"
        }
      ],
      aiRecommendation: {
        title: 'Process Slowdown',
        description: "AI detects delays in 'Engage' phase",
        action: "Suggest reviewing 'Types of Questions'. Agents are failing to 'Engage and Discover' quickly."
      },
      trainingLink: 'Types of Questions (Page 3)'
    }
  ]
};

export const auditWorkbenchData: AuditWorkbenchData = {
  transcript: [
    {
      timestamp: '10:23:15',
      speaker: 'Customer',
      text: "I've been trying to resolve this dispute for over a week now.",
      highlight: null
    },
    {
      timestamp: '10:23:28',
      speaker: 'Agent',
      text: "I understand your frustration. Let me check your account details.",
      highlight: 'success',
      tooltip: 'Good use of empathy phrase "I understand"'
    },
    {
      timestamp: '10:24:12',
      speaker: 'Agent',
      text: "I don't have the authority to process this type of dispute. Let me transfer you to our supervisor.",
      highlight: 'failure',
      tooltip: 'Escalation Risk: Agent used weak language (See "Take Ownership" pillar)'
    },
    {
      timestamp: '10:24:45',
      speaker: 'Customer',
      text: "This is the third time I'm being transferred!",
      highlight: 'risk',
      tooltip: 'Repeat contact indicator detected'
    },
    {
      timestamp: '10:25:02',
      speaker: 'Agent',
      text: "I apologize for the inconvenience. Let me see what I can do to help you right now.",
      highlight: 'success'
    },
    {
      timestamp: '10:25:18',
      speaker: 'Agent',
      text: "Actually, I can help you with this. Let me process your dispute request.",
      highlight: 'success'
    },
    {
      timestamp: '10:26:30',
      speaker: 'Customer',
      text: "Thank you! That's exactly what I needed.",
      highlight: null
    },
    {
      timestamp: '10:26:45',
      speaker: 'Agent',
      text: "You're welcome! Is there anything else I can help you with today?",
      highlight: 'success',
      tooltip: 'Proper closing phrase used'
    }
  ],
  diagnosis: {
    nonResolution: 'pass',
    tat: 'pass',
    repeatContact: 'risk',
    incorrectInformation: 'pass',
    escalation: 'fail',
    sla: 'pass',
    failedFromCustomer: 'pass'
  },
  nextBestAction: {
    headline: 'Top Failure: Escalation',
    context: 'Agent transferred immediately after using weak language "I don\'t have the authority"',
    quickFixScript: "Coach agent to use 'I can certainly help you...' instead of transferring immediately.",
    trainingLink: 'Confidence through Strong Words'
  }
};

// Call Transcript Interface and Data
export interface CallMessage {
  id: string;
  timestamp: string;
  duration?: string;
  speaker: 'agent' | 'customer';
  name: string;
  message: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tone?: string;
}

export interface CallTranscript {
  callId: string;
  agentId: string;
  agentName: string;
  customerId: string;
  customerName: string;
  channel: 'voice' | 'chat' | 'email';
  duration: string;
  startTime: string;
  endTime: string;
  topic: string;
  resolution: 'resolved' | 'unresolved' | 'escalated';
  qualityScore: number;
  fciScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  messages: CallMessage[];
}

// Call Transcript Data Map - One per agent
export const callTranscriptMap: Record<string, CallTranscript> = {
  'AGT001': {
    callId: 'CALL-2025-11-28-001',
    agentId: 'AGT001',
    agentName: 'Michael Thompson',
    customerId: 'CUST-12345',
    customerName: 'Robert Patterson',
    channel: 'voice',
    duration: '5m 10s',
    startTime: '2025-11-28 09:15:00',
    endTime: '2025-11-28 09:20:10',
    topic: 'Debit Card Declined - Fraud Alert',
    resolution: 'escalated',
    qualityScore: 62.4,
    fciScore: 34.8,
    sentiment: 'negative',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Michael Thompson', message: 'Thank you for calling Premier Bank. This is Michael. I see you\'re calling about a card decline issue. Is that correct?', sentiment: 'positive', tone: 'professional' },
      { id: 'm2', timestamp: '0:15', speaker: 'customer', name: 'Robert Patterson', message: 'Yes! My debit card was declined at the grocery store this morning. But I have plenty of money in my account. This is ridiculous.', sentiment: 'negative', tone: 'frustrated' },
      { id: 'm3', timestamp: '0:35', speaker: 'agent', name: 'Michael Thompson', message: 'I can see where that would be frustrating. Let me check your account here. Can you verify the last four digits of your debit card?', sentiment: 'positive', tone: 'basic' },
      { id: 'm4', timestamp: '0:48', speaker: 'customer', name: 'Robert Patterson', message: '5847. And I just used it successfully at the ATM two hours before that.', sentiment: 'negative', tone: 'irritated' },
      { id: 'm5', timestamp: '1:05', speaker: 'agent', name: 'Michael Thompson', message: 'I see here that our fraud detection system flagged multiple transactions as unusual. So it blocked the grocery store transaction. It\'s a safety measure.', sentiment: 'neutral', tone: 'transactional' },
      { id: 'm6', timestamp: '1:28', speaker: 'customer', name: 'Robert Patterson', message: 'But I\'ve been banking with you for eight years. Your system should recognize my spending patterns by now. Couldn\'t an agent review this before blocking my card?', sentiment: 'negative', tone: 'angry' },
      { id: 'm7', timestamp: '1:50', speaker: 'agent', name: 'Michael Thompson', message: 'I understand, but fraud prevention is automatic. I can see the card is currently active now. You should be able to use it again.', sentiment: 'neutral', tone: 'dismissive' },
      { id: 'm8', timestamp: '2:10', speaker: 'customer', name: 'Robert Patterson', message: 'Active but not at the store. The damage is done - I was embarrassed in front of everyone. What compensation do I get for this?', sentiment: 'negative', tone: 'demanding' },
      { id: 'm9', timestamp: '2:32', speaker: 'agent', name: 'Michael Thompson', message: 'I\'m sorry you had that experience. Let me have our Fraud Investigation team review this. They can escalate if there\'s an issue with our system.', sentiment: 'positive', tone: 'apologetic' },
      { id: 'm10', timestamp: '2:50', speaker: 'customer', name: 'Robert Patterson', message: 'When will they contact me? I need answers today, not next week.', sentiment: 'negative', tone: 'urgent' },
      { id: 'm11', timestamp: '3:10', speaker: 'agent', name: 'Michael Thompson', message: 'They typically respond within 24 to 48 hours. They\'ll call you at the number on file.', sentiment: 'neutral', tone: 'informational' },
      { id: 'm12', timestamp: '3:28', speaker: 'customer', name: 'Robert Patterson', message: 'That\'s not good enough. Can\'t you just fix this now?', sentiment: 'negative', tone: 'insistent' },
      { id: 'm13', timestamp: '3:48', speaker: 'agent', name: 'Michael Thompson', message: 'I don\'t have the authorization to override the fraud system. The best I can do is flag your account as a priority review.', sentiment: 'neutral', tone: 'helpless' },
      { id: 'm14', timestamp: '4:05', speaker: 'customer', name: 'Robert Patterson', message: 'This is poor service. I want to speak with a supervisor about your fraud detection policy.', sentiment: 'negative', tone: 'very angry' },
      { id: 'm15', timestamp: '4:22', speaker: 'agent', name: 'Michael Thompson', message: 'I can transfer you to our supervisor right now. They can provide more details about our fraud protection procedures.', sentiment: 'positive', tone: 'accommodating' },
      { id: 'm16', timestamp: '4:38', speaker: 'customer', name: 'Robert Patterson', message: 'Yes, do that. And make sure they know about this terrible experience.', sentiment: 'negative', tone: 'resigned' },
      { id: 'm17', timestamp: '4:55', speaker: 'agent', name: 'Michael Thompson', message: 'I\'ve added all details to your account. Transferring you now. Thank you for your patience.', sentiment: 'positive', tone: 'professional' },
      { id: 'm18', timestamp: '5:10', speaker: 'customer', name: 'Robert Patterson', message: 'Alright.', sentiment: 'negative', tone: 'curt' }
    ]
  },
  'AGT002': {
    callId: 'CALL-2025-11-28-002',
    agentId: 'AGT002',
    agentName: 'Robert Kim',
    customerId: 'CUST-98765',
    customerName: 'Steven Wallace',
    channel: 'voice',
    duration: '4m 35s',
    startTime: '2025-11-28 14:22:15',
    endTime: '2025-11-28 14:26:50',
    topic: 'Loan Application Denial',
    resolution: 'unresolved',
    qualityScore: 58.9,
    fciScore: 42.1,
    sentiment: 'negative',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Robert Kim', message: 'Thank you for calling Premier Bank. This is Robert. I\'m calling regarding your home equity line of credit application.', sentiment: 'positive', tone: 'professional' },
      { id: 'm2', timestamp: '0:15', speaker: 'customer', name: 'Steven Wallace', message: 'Hi Robert. Yes, I applied two weeks ago. Have you made a decision?', sentiment: 'neutral', tone: 'hopeful' },
      { id: 'm3', timestamp: '0:28', speaker: 'agent', name: 'Robert Kim', message: 'I have. Unfortunately, your application has been denied. Your debt-to-income ratio is too high.', sentiment: 'neutral', tone: 'direct' },
      { id: 'm4', timestamp: '0:42', speaker: 'customer', name: 'Steven Wallace', message: 'What? But I have perfect payment history with you. I\'ve been banking here for twelve years.', sentiment: 'negative', tone: 'shocked' },
      { id: 'm5', timestamp: '1:00', speaker: 'agent', name: 'Robert Kim', message: 'I understand, but our underwriting guidelines consider total debt obligations. Your current debt is 68 percent of your gross income.', sentiment: 'neutral', tone: 'factual' },
      { id: 'm6', timestamp: '1:22', speaker: 'customer', name: 'Steven Wallace', message: 'But that\'s manageable. I can easily service more debt. Why won\'t you take my payment history into account?', sentiment: 'negative', tone: 'frustrated' },
      { id: 'm7', timestamp: '1:42', speaker: 'agent', name: 'Robert Kim', message: 'It is considered. However, our policy requires a debt-to-income ratio below 60 percent for HELOC approval.', sentiment: 'neutral', tone: 'policy-focused' },
      { id: 'm8', timestamp: '2:05', speaker: 'customer', name: 'Steven Wallace', message: 'So what do I need to do? Pay down my existing debt more quickly?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm9', timestamp: '2:22', speaker: 'agent', name: 'Robert Kim', message: 'That would help. If you can reduce your debt-to-income ratio to below 60 percent, you can reapply in six months.', sentiment: 'positive', tone: 'helpful' },
      { id: 'm10', timestamp: '2:40', speaker: 'customer', name: 'Steven Wallace', message: 'Six months? I need access to that credit line now for home renovations. Is there any exception or alternative?', sentiment: 'negative', tone: 'urgent' },
      { id: 'm11', timestamp: '3:00', speaker: 'agent', name: 'Robert Kim', message: 'Let me check if there are any alternative products. You might qualify for a personal line of credit with a lower limit.', sentiment: 'positive', tone: 'exploratory' },
      { id: 'm12', timestamp: '3:20', speaker: 'customer', name: 'Steven Wallace', message: 'What would that limit be?', sentiment: 'neutral', tone: 'interested' },
      { id: 'm13', timestamp: '3:35', speaker: 'agent', name: 'Robert Kim', message: 'Based on your current profile, around $15,000 at 8.5 percent APR. The HELOC would have been at 6.2 percent.', sentiment: 'neutral', tone: 'comparative' },
      { id: 'm14', timestamp: '3:58', speaker: 'customer', name: 'Steven Wallace', message: 'That\'s much less and more expensive. This is really disappointing. I feel like I\'m being punished for my income situation.', sentiment: 'negative', tone: 'resigned' },
      { id: 'm15', timestamp: '4:20', speaker: 'agent', name: 'Robert Kim', message: 'I understand the frustration. These are risk management standards. Would you like me to send you the details on the personal LOC?', sentiment: 'neutral', tone: 'transactional' },
      { id: 'm16', timestamp: '4:35', speaker: 'customer', name: 'Steven Wallace', message: 'Yes, send them. But I\'ll probably shop around. Your rates aren\'t competitive anyway.', sentiment: 'negative', tone: 'angry' }
    ]
  },
  'AGT003': {
    callId: 'CALL-2025-11-28-003',
    agentId: 'AGT003',
    agentName: 'Jennifer Walsh',
    customerId: 'CUST-54321',
    customerName: 'Linda Michaels',
    channel: 'voice',
    duration: '3m 25s',
    startTime: '2025-11-28 10:45:00',
    endTime: '2025-11-28 10:48:25',
    topic: 'Direct Deposit Setup Issue',
    resolution: 'resolved',
    qualityScore: 65.7,
    fciScore: 31.2,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Jennifer Walsh', message: 'Good morning! Thank you for calling Premier Bank. My name is Jennifer. How are you doing today?', sentiment: 'positive', tone: 'warm' },
      { id: 'm2', timestamp: '0:10', speaker: 'customer', name: 'Linda Michaels', message: 'Hi Jennifer, I need to set up direct deposit for my new job. Can you help me with that?', sentiment: 'positive', tone: 'friendly' },
      { id: 'm3', timestamp: '0:22', speaker: 'agent', name: 'Jennifer Walsh', message: 'Absolutely! That\'s great you have a new job. I can get that set up for you right now. Congratulations!', sentiment: 'positive', tone: 'warm' },
      { id: 'm4', timestamp: '0:38', speaker: 'customer', name: 'Linda Michaels', message: 'Thank you! I start on Monday and need it active.', sentiment: 'positive', tone: 'eager' },
      { id: 'm5', timestamp: '0:52', speaker: 'agent', name: 'Jennifer Walsh', message: 'Perfect timing. Let me get your account up here. I\'ll need your routing number and account number to give to HR.', sentiment: 'positive', tone: 'organized' },
      { id: 'm6', timestamp: '1:10', speaker: 'customer', name: 'Linda Michaels', message: 'I have it right here. Routing is 021100361 and account is 987654321.', sentiment: 'neutral', tone: 'informative' },
      { id: 'm7', timestamp: '1:28', speaker: 'agent', name: 'Jennifer Walsh', message: 'Perfect! Got it. By the way, did you know direct deposits usually post within one business day?', sentiment: 'positive', tone: 'informative' },
      { id: 'm8', timestamp: '1:45', speaker: 'customer', name: 'Linda Michaels', message: 'That\'s wonderful! I\'ve heard good things about your bank from my new manager.', sentiment: 'positive', tone: 'complimentary' },
      { id: 'm9', timestamp: '2:00', speaker: 'agent', name: 'Jennifer Walsh', message: 'That\'s so nice to hear! We pride ourselves on making banking convenient. Your direct deposit is all set.', sentiment: 'positive', tone: 'proud' },
      { id: 'm10', timestamp: '2:18', speaker: 'customer', name: 'Linda Michaels', message: 'Is there anything else I should know about my account?', sentiment: 'positive', tone: 'engaged' },
      { id: 'm11', timestamp: '2:35', speaker: 'agent', name: 'Jennifer Walsh', message: 'Just to remind you, we offer fraud protection and account alerts at no extra cost. You can set those up in our app.', sentiment: 'positive', tone: 'helpful' },
      { id: 'm12', timestamp: '2:55', speaker: 'customer', name: 'Linda Michaels', message: 'Great! I\'ll do that tonight. Thank you so much, Jennifer!', sentiment: 'positive', tone: 'grateful' },
      { id: 'm13', timestamp: '3:10', speaker: 'agent', name: 'Jennifer Walsh', message: 'You\'re very welcome! Welcome to Premier Bank and congrats again on the new job. We\'re glad to have you!', sentiment: 'positive', tone: 'warm' },
      { id: 'm14', timestamp: '3:25', speaker: 'customer', name: 'Linda Michaels', message: 'Thanks Jennifer, have a great day!', sentiment: 'positive', tone: 'satisfied' }
    ]
  },
  'AGT004': {
    callId: 'CALL-2025-11-28-004',
    agentId: 'AGT004',
    agentName: 'David Martinez',
    customerId: 'CUST-11111',
    customerName: 'Kevin Price',
    channel: 'voice',
    duration: '6m 05s',
    startTime: '2025-11-28 11:30:00',
    endTime: '2025-11-28 11:36:05',
    topic: 'ACH Transfer Failed',
    resolution: 'unresolved',
    qualityScore: 71.2,
    fciScore: 28.5,
    sentiment: 'neutral',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'David Martinez', message: 'Welcome to Premier Bank, this is David. How can I assist you today?', sentiment: 'neutral', tone: 'professional' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Kevin Price', message: 'Hi David, I sent an ACH transfer to my mortgage servicer two days ago but it still shows as pending. Should it be processed by now?', sentiment: 'neutral', tone: 'concerned' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'David Martinez', message: 'Let me look into that for you. Can I get your account number ending in?', sentiment: 'neutral', tone: 'professional' },
      { id: 'm4', timestamp: '0:45', speaker: 'customer', name: 'Kevin Price', message: '5592. The transfer was for $2,400 to First American Mortgage.', sentiment: 'neutral', tone: 'specific' },
      { id: 'm5', timestamp: '1:00', speaker: 'agent', name: 'David Martinez', message: 'I see your account. I found the ACH transaction. It shows status as "Pending Origination." ACH transfers can take up to three business days.', sentiment: 'neutral', tone: 'factual' },
      { id: 'm6', timestamp: '1:22', speaker: 'customer', name: 'Kevin Price', message: 'But today is the third day. The payment is due tomorrow and if it doesn\'t arrive, I\'ll be late.', sentiment: 'negative', tone: 'worried' },
      { id: 'm7', timestamp: '1:42', speaker: 'agent', name: 'David Martinez', message: 'I understand your concern. Sometimes batching processes can cause delays. Let me check with our ACH department to see if I can expedite this.', sentiment: 'positive', tone: 'helpful' },
      { id: 'm8', timestamp: '2:05', speaker: 'customer', name: 'Kevin Price', message: 'How long will that take? And if it\'s late, can you contact the mortgage servicer on my behalf?', sentiment: 'negative', tone: 'requesting' },
      { id: 'm9', timestamp: '2:25', speaker: 'agent', name: 'David Martinez', message: 'The ACH department can usually respond within an hour. However, I\'m not able to contact your servicer directly. You\'d need to do that.', sentiment: 'neutral', tone: 'explanatory' },
      { id: 'm10', timestamp: '2:48', speaker: 'customer', name: 'Kevin Price', message: 'So if I reach out to them now, can I tell them the bank is working on it?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm11', timestamp: '3:05', speaker: 'agent', name: 'David Martinez', message: 'Yes, you can give them this reference number. It shows we initiated the transfer on the correct date.', sentiment: 'positive', tone: 'helpful' },
      { id: 'm12', timestamp: '3:22', speaker: 'customer', name: 'Kevin Price', message: 'Okay. What\'s the reference number?', sentiment: 'neutral', tone: 'ready' },
      { id: 'm13', timestamp: '3:35', speaker: 'agent', name: 'David Martinez', message: 'It\'s ACH-2025-1128-947382. I\'ll also send this to you via email immediately.', sentiment: 'positive', tone: 'organized' },
      { id: 'm14', timestamp: '3:52', speaker: 'customer', name: 'Kevin Price', message: 'Thank you. When will you know for certain if it went through?', sentiment: 'neutral', tone: 'seeking clarity' },
      { id: 'm15', timestamp: '4:10', speaker: 'agent', name: 'David Martinez', message: 'By end of business today, the transaction should either post or a rejection reason will appear in our system.', sentiment: 'neutral', tone: 'informative' },
      { id: 'm16', timestamp: '4:28', speaker: 'customer', name: 'Kevin Price', message: 'And if it gets rejected?', sentiment: 'negative', tone: 'anxious' },
      { id: 'm17', timestamp: '4:42', speaker: 'agent', name: 'David Martinez', message: 'If rejected, it will be returned to your account and we\'ll investigate the reason. You can then resubmit or use wire transfer.', sentiment: 'neutral', tone: 'procedural' },
      { id: 'm18', timestamp: '5:05', speaker: 'customer', name: 'Kevin Price', message: 'Wire transfer costs money though, right?', sentiment: 'negative', tone: 'frustrated' },
      { id: 'm19', timestamp: '5:20', speaker: 'agent', name: 'David Martinez', message: 'Yes, it\'s $25 for outgoing domestic wire transfers. But ACH is typically free. I\'ll monitor your account today.', sentiment: 'neutral', tone: 'factual' },
      { id: 'm20', timestamp: '5:40', speaker: 'customer', name: 'Kevin Price', message: 'Okay. Can you call me if there\'s an issue before business closes?', sentiment: 'neutral', tone: 'requesting' },
      { id: 'm21', timestamp: '5:58', speaker: 'agent', name: 'David Martinez', message: 'I can add a priority note, but call-back is not automated. I recommend checking your account online or calling back.', sentiment: 'neutral', tone: 'professional' }
    ]
  },
  'AGT005': {
    callId: 'CALL-2025-11-28-005',
    agentId: 'AGT005',
    agentName: 'Amanda Foster',
    customerId: 'CUST-22222',
    customerName: 'Rachel Garcia',
    channel: 'voice',
    duration: '4m 20s',
    startTime: '2025-11-28 13:10:00',
    endTime: '2025-11-28 13:14:20',
    topic: 'Credit Score Dispute',
    resolution: 'resolved',
    qualityScore: 78.3,
    fciScore: 22.1,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Amanda Foster', message: 'Hello, and welcome to Premier Bank! My name is Amanda. What can I help you with today?', sentiment: 'positive', tone: 'warm' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Rachel Garcia', message: 'Hi Amanda. I got a loan denial from another bank and they mentioned it was due to inaccuracies on my credit report. Can you help me understand that?', sentiment: 'neutral', tone: 'concerned' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'Amanda Foster', message: 'Of course! I\'d be happy to help. Credit accuracy is important. Do you have a copy of your credit report handy?', sentiment: 'positive', tone: 'supportive' },
      { id: 'm4', timestamp: '0:48', speaker: 'customer', name: 'Rachel Garcia', message: 'I pulled it yesterday. It shows accounts I closed years ago as still open and carrying balances.', sentiment: 'negative', tone: 'frustrated' },
      { id: 'm5', timestamp: '1:08', speaker: 'agent', name: 'Amanda Foster', message: 'That\'s definitely concerning and likely an error with the credit bureaus. Those should be marked as closed. You have rights under the FCRA to dispute these.', sentiment: 'positive', tone: 'knowledgeable' },
      { id: 'm6', timestamp: '1:32', speaker: 'customer', name: 'Rachel Garcia', message: 'What does FCRA mean? And how do I dispute it?', sentiment: 'neutral', tone: 'seeking help' },
      { id: 'm7', timestamp: '1:50', speaker: 'agent', name: 'Amanda Foster', message: 'It\'s the Fair Credit Reporting Act. You can file a dispute with the three credit bureaus - Equifax, Experian, and TransUnion. We also have resources to help.', sentiment: 'positive', tone: 'educational' },
      { id: 'm8', timestamp: '2:15', speaker: 'customer', name: 'Rachel Garcia', message: 'That sounds complicated. What\'s the easiest way?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm9', timestamp: '2:30', speaker: 'agent', name: 'Amanda Foster', message: 'You can dispute online through their websites, but I\'d recommend certified mail for documentation. I can email you a template letter we provide.', sentiment: 'positive', tone: 'helpful' },
      { id: 'm10', timestamp: '2:52', speaker: 'customer', name: 'Rachel Garcia', message: 'How long does it take for them to investigate?', sentiment: 'neutral', tone: 'questioning' },
      { id: 'm11', timestamp: '3:08', speaker: 'agent', name: 'Amanda Foster', message: 'Usually 30 days by law. Once corrected, you can reapply for the loan with the updated report. How many accounts show incorrectly?', sentiment: 'positive', tone: 'thorough' },
      { id: 'm12', timestamp: '3:28', speaker: 'customer', name: 'Rachel Garcia', message: 'Three accounts. But one of them is showing a late payment I know didn\'t happen.', sentiment: 'negative', tone: 'upset' },
      { id: 'm13', timestamp: '3:48', speaker: 'agent', name: 'Amanda Foster', message: 'Include that in your dispute - request copies of account statements proving payment. We can help with disputes affecting your Premier Bank accounts too.', sentiment: 'positive', tone: 'advocating' },
      { id: 'm14', timestamp: '4:10', speaker: 'customer', name: 'Rachel Garcia', message: 'This is so helpful, Amanda. I feel more confident about handling this now.', sentiment: 'positive', tone: 'grateful' },
      { id: 'm15', timestamp: '4:20', speaker: 'agent', name: 'Amanda Foster', message: 'Great! I\'m sending you that template now. Feel free to call back if you have questions. We\'re here to help!', sentiment: 'positive', tone: 'supportive' }
    ]
  },
  'AGT006': {
    callId: 'CALL-2025-11-28-006',
    agentId: 'AGT006',
    agentName: 'Kevin O\'Brien',
    customerId: 'CUST-33333',
    customerName: 'David Cooper',
    channel: 'voice',
    duration: '4m 50s',
    startTime: '2025-11-28 15:40:00',
    endTime: '2025-11-28 15:44:50',
    topic: 'Mobile Check Deposit Issue',
    resolution: 'unresolved',
    qualityScore: 68.1,
    fciScore: 35.4,
    sentiment: 'negative',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Thank you for calling Premier Bank. This is Kevin. What\'s your issue today?', sentiment: 'neutral', tone: 'professional' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'David Cooper', message: 'Hi Kevin, I submitted a check deposit through your mobile app yesterday but it still shows as pending. How long does this take?', sentiment: 'neutral', tone: 'questioning' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Mobile deposits usually process within 24 hours. Is it still pending after 24 hours?', sentiment: 'neutral', tone: 'basic' },
      { id: 'm4', timestamp: '0:48', speaker: 'customer', name: 'David Cooper', message: 'It\'s been almost 36 hours now. And I need this money because I have bills due today.', sentiment: 'negative', tone: 'urgent' },
      { id: 'm5', timestamp: '1:08', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Hmm. Let me look into that. What\'s the check amount?', sentiment: 'neutral', tone: 'uncertain' },
      { id: 'm6', timestamp: '1:22', speaker: 'customer', name: 'David Cooper', message: 'It\'s $850. A refund check from my employer for overpaid taxes.', sentiment: 'neutral', tone: 'informative' },
      { id: 'm7', timestamp: '1:38', speaker: 'agent', name: 'Kevin O\'Brien', message: 'I\'m not finding anything unusual. Can you check if the deposit actually went through? Sometimes the image doesn\'t upload correctly.', sentiment: 'neutral', tone: 'dismissive' },
      { id: 'm8', timestamp: '1:58', speaker: 'customer', name: 'David Cooper', message: 'I can see it in the app. It clearly says "Deposit Pending" with a timestamp. I uploaded both front and back of the check.', sentiment: 'negative', tone: 'frustrated' },
      { id: 'm9', timestamp: '2:20', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Sometimes there are backend delays. Just wait a few more hours and it should clear.', sentiment: 'neutral', tone: 'unsympathetic' },
      { id: 'm10', timestamp: '2:38', speaker: 'customer', name: 'David Cooper', message: 'A few more hours? I need the money NOW. Can you manually process it or escalate this?', sentiment: 'negative', tone: 'demanding' },
      { id: 'm11', timestamp: '2:58', speaker: 'agent', name: 'Kevin O\'Brien', message: 'I don\'t have the ability to manually process mobile deposits. That goes through an automated system.', sentiment: 'neutral', tone: 'helpless' },
      { id: 'm12', timestamp: '3:18', speaker: 'customer', name: 'David Cooper', message: 'So you can\'t help me at all? Who can?', sentiment: 'negative', tone: 'angry' },
      { id: 'm13', timestamp: '3:35', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Let me check with our technical team. Hold on.', sentiment: 'neutral', tone: 'apologetic' },
      { id: 'm14', timestamp: '3:52', speaker: 'customer', name: 'David Cooper', message: 'How long will this take?', sentiment: 'negative', tone: 'impatient' },
      { id: 'm15', timestamp: '4:08', speaker: 'agent', name: 'Kevin O\'Brien', message: 'It should be just a couple minutes. I\'ll check the backend system now.', sentiment: 'neutral', tone: 'tentative' },
      { id: 'm16', timestamp: '4:25', speaker: 'customer', name: 'David Cooper', message: 'I\'ve been patient but this is ridiculous. Do you have a supervisor available?', sentiment: 'negative', tone: 'very angry' },
      { id: 'm17', timestamp: '4:42', speaker: 'agent', name: 'Kevin O\'Brien', message: 'Yes, I can transfer you. But I really do apologize for this experience.', sentiment: 'positive', tone: 'apologetic' },
      { id: 'm18', timestamp: '4:50', speaker: 'customer', name: 'David Cooper', message: 'Just transfer me please.', sentiment: 'negative', tone: 'resigned' }
    ]
  },
  'AGT007': {
    callId: 'CALL-2025-11-28-007',
    agentId: 'AGT007',
    agentName: 'Sarah Chen',
    customerId: 'CUST-44444',
    customerName: 'Maria Garcia',
    channel: 'voice',
    duration: '4m 10s',
    startTime: '2025-11-28 09:50:00',
    endTime: '2025-11-28 09:54:10',
    topic: 'Fraudulent Transaction Report',
    resolution: 'resolved',
    qualityScore: 82.5,
    fciScore: 18.9,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Sarah Chen', message: 'Good morning! Thank you for calling Premier Bank. My name is Sarah. How can I help you today?', sentiment: 'positive', tone: 'warm' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Maria Garcia', message: 'Hi Sarah, I need to report unauthorized transactions on my account. There\'s been fraud.', sentiment: 'negative', tone: 'worried' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'Sarah Chen', message: 'I\'m sorry to hear that. Your security is our top priority. Let me get your account up and we\'ll handle this right away.', sentiment: 'positive', tone: 'empathetic' },
      { id: 'm4', timestamp: '0:52', speaker: 'customer', name: 'Maria Garcia', message: 'There are three charges totaling $1,500 from an online retailer I\'ve never used. They happened overnight.', sentiment: 'negative', tone: 'alarmed' },
      { id: 'm5', timestamp: '1:15', speaker: 'agent', name: 'Sarah Chen', message: 'I see those transactions. I\'m flagging them as fraudulent now and initiating a full dispute. Let me freeze this card immediately.', sentiment: 'positive', tone: 'protective' },
      { id: 'm6', timestamp: '1:35', speaker: 'customer', name: 'Maria Garcia', message: 'Good. What happens next?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm7', timestamp: '1:50', speaker: 'agent', name: 'Sarah Chen', message: 'I\'ve blocked the card to prevent further charges. A replacement will ship within 3 business days. You\'re protected - we\'ll conduct a full investigation.', sentiment: 'positive', tone: 'reassuring' },
      { id: 'm8', timestamp: '2:15', speaker: 'customer', name: 'Maria Garcia', message: 'When will I get my money back?', sentiment: 'neutral', tone: 'hopeful' },
      { id: 'm9', timestamp: '2:30', speaker: 'agent', name: 'Sarah Chen', message: 'We typically credit you provisionally within 24-48 hours while we investigate. Most fraud claims are resolved within 7-10 business days.', sentiment: 'positive', tone: 'informative' },
      { id: 'm10', timestamp: '2:55', speaker: 'customer', name: 'Maria Garcia', message: 'Will I definitely get it back?', sentiment: 'neutral', tone: 'concerned' },
      { id: 'm11', timestamp: '3:10', speaker: 'agent', name: 'Sarah Chen', message: 'With unauthorized transactions, yes. Federal law protects you from fraud liability. I\'ll email you a detailed summary of our investigation steps.', sentiment: 'positive', tone: 'confident' },
      { id: 'm12', timestamp: '3:35', speaker: 'customer', name: 'Maria Garcia', message: 'Thank you Sarah. I really appreciate how quickly you handled this.', sentiment: 'positive', tone: 'grateful' },
      { id: 'm13', timestamp: '3:50', speaker: 'agent', name: 'Sarah Chen', message: 'You\'re welcome! Your safety matters to us. If you have any questions during the investigation, call back anytime. We\'re here for you.', sentiment: 'positive', tone: 'warm' },
      { id: 'm14', timestamp: '4:10', speaker: 'customer', name: 'Maria Garcia', message: 'Will do. Thanks again, Sarah!', sentiment: 'positive', tone: 'satisfied' }
    ]
  },
  'AGT008': {
    callId: 'CALL-2025-11-28-008',
    agentId: 'AGT008',
    agentName: 'James Rodriguez',
    customerId: 'CUST-55555',
    customerName: 'Thomas Bennett',
    channel: 'voice',
    duration: '5m 25s',
    startTime: '2025-11-28 16:15:00',
    endTime: '2025-11-28 16:20:25',
    topic: 'Overdraft Protection Setup',
    resolution: 'resolved',
    qualityScore: 74.8,
    fciScore: 26.3,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'James Rodriguez', message: 'Hello, this is James Rodriguez from Premier Bank. Thank you for calling. What can I help you with today?', sentiment: 'positive', tone: 'professional' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Thomas Bennett', message: 'Hi James, I\'d like to set up overdraft protection on my checking account. I\'m worried about unexpected fees.', sentiment: 'neutral', tone: 'practical' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'James Rodriguez', message: 'That\'s a smart move. Overdraft protection can save you money. I have a couple of options for you.', sentiment: 'positive', tone: 'supportive' },
      { id: 'm4', timestamp: '0:52', speaker: 'customer', name: 'Thomas Bennett', message: 'What are my options?', sentiment: 'neutral', tone: 'curious' },
      { id: 'm5', timestamp: '1:08', speaker: 'agent', name: 'James Rodriguez', message: 'You can link your savings account as backup, or set up an overdraft line of credit. The savings account transfer is free - no fees at all.', sentiment: 'positive', tone: 'transparent' },
      { id: 'm6', timestamp: '1:32', speaker: 'customer', name: 'Thomas Bennett', message: 'What about the line of credit option?', sentiment: 'neutral', tone: 'questioning' },
      { id: 'm7', timestamp: '1:48', speaker: 'agent', name: 'James Rodriguez', message: 'That\'s a $500 limit that you pay interest on only when you use it. It\'s 18% APR. Most people prefer the savings transfer - no cost, no interest.', sentiment: 'positive', tone: 'advisory' },
      { id: 'm8', timestamp: '2:15', speaker: 'customer', name: 'Thomas Bennett', message: 'Savings transfer sounds perfect. How quickly can that be set up?', sentiment: 'positive', tone: 'ready' },
      { id: 'm9', timestamp: '2:30', speaker: 'agent', name: 'James Rodriguez', message: 'Immediately! I can link your accounts right now over the phone. It\'s active within minutes.', sentiment: 'positive', tone: 'efficient' },
      { id: 'm10', timestamp: '2:48', speaker: 'customer', name: 'Thomas Bennett', message: 'That\'s great! Do it.', sentiment: 'positive', tone: 'satisfied' },
      { id: 'm11', timestamp: '3:00', speaker: 'agent', name: 'James Rodriguez', message: 'Confirmed. Your savings account is now linked as overdraft protection for your checking. You\'re all set.', sentiment: 'positive', tone: 'reassuring' },
      { id: 'm12', timestamp: '3:18', speaker: 'customer', name: 'Thomas Bennett', message: 'Perfect! How much will I be charged if I use it?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm13', timestamp: '3:35', speaker: 'agent', name: 'James Rodriguez', message: 'Zero! Using the savings transfer protection is completely free. You\'re only paying the funds from your savings account.', sentiment: 'positive', tone: 'clear' },
      { id: 'm14', timestamp: '3:55', speaker: 'customer', name: 'Thomas Bennett', message: 'Excellent! This will definitely give me peace of mind.', sentiment: 'positive', tone: 'grateful' },
      { id: 'm15', timestamp: '4:12', speaker: 'agent', name: 'James Rodriguez', message: 'That\'s exactly why we offer it! You\'re covered now. Anything else I can help with today?', sentiment: 'positive', tone: 'warm' },
      { id: 'm16', timestamp: '4:28', speaker: 'customer', name: 'Thomas Bennett', message: 'No, that\'s it. Thanks so much!', sentiment: 'positive', tone: 'satisfied' },
      { id: 'm17', timestamp: '4:40', speaker: 'agent', name: 'James Rodriguez', message: 'Thank you for banking with us! Have a great day!', sentiment: 'positive', tone: 'professional' }
    ]
  },
  'AGT009': {
    callId: 'CALL-2025-11-28-009',
    agentId: 'AGT009',
    agentName: 'Emily Parker',
    customerId: 'CUST-66666',
    customerName: 'Diane Hamilton',
    channel: 'voice',
    duration: '3m 45s',
    startTime: '2025-11-28 14:05:00',
    endTime: '2025-11-28 14:08:45',
    topic: 'Savings Account Opening',
    resolution: 'resolved',
    qualityScore: 80.2,
    fciScore: 20.7,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Emily Parker', message: 'Good afternoon! Thank you for calling Premier Bank. This is Emily. How can I help you today?', sentiment: 'positive', tone: 'professional' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Diane Hamilton', message: 'Hi Emily! I want to open a high-yield savings account. I\'ve heard you have competitive rates.', sentiment: 'positive', tone: 'enthusiastic' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'Emily Parker', message: 'Absolutely! You heard right. Our high-yield savings currently offers 4.5% APY. Let me get you started right now.', sentiment: 'positive', tone: 'engaging' },
      { id: 'm4', timestamp: '0:52', speaker: 'customer', name: 'Diane Hamilton', message: 'Wow! That\'s much better than my current bank. How do I start?', sentiment: 'positive', tone: 'interested' },
      { id: 'm5', timestamp: '1:10', speaker: 'agent', name: 'Emily Parker', message: 'It\'s super easy. I can open it over the phone with you. I just need your basic information and initial deposit.', sentiment: 'positive', tone: 'friendly' },
      { id: 'm6', timestamp: '1:30', speaker: 'customer', name: 'Diane Hamilton', message: 'Perfect. I want to start with $5,000.', sentiment: 'positive', tone: 'ready' },
      { id: 'm7', timestamp: '1:48', speaker: 'agent', name: 'Emily Parker', message: 'Great! $5,000 is a perfect start. At 4.5% APY, you\'ll earn about $225 per year just for saving. Let me gather some information.', sentiment: 'positive', tone: 'informative' },
      { id: 'm8', timestamp: '2:12', speaker: 'customer', name: 'Diane Hamilton', message: 'That\'s fantastic! I definitely want this.', sentiment: 'positive', tone: 'eager' },
      { id: 'm9', timestamp: '2:28', speaker: 'agent', name: 'Emily Parker', message: 'I love your enthusiasm! Your account is all set. We can transfer your $5,000 deposit right now from your other bank.', sentiment: 'positive', tone: 'efficient' },
      { id: 'm10', timestamp: '2:50', speaker: 'customer', name: 'Diane Hamilton', message: 'How long does that take?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm11', timestamp: '3:05', speaker: 'agent', name: 'Emily Parker', message: 'Usually 3-5 business days. In the meantime, you can start using your new account. Would you like our mobile app?', sentiment: 'positive', tone: 'helpful' },
      { id: 'm12', timestamp: '3:28', speaker: 'customer', name: 'Diane Hamilton', message: 'Yes! Send me the link. Thank you so much!', sentiment: 'positive', tone: 'grateful' },
      { id: 'm13', timestamp: '3:45', speaker: 'agent', name: 'Emily Parker', message: 'Perfect! You\'ll get an email with everything. Welcome to Premier Bank!', sentiment: 'positive', tone: 'warm' }
    ]
  },
  'AGT010': {
    callId: 'CALL-2025-11-28-010',
    agentId: 'AGT010',
    agentName: 'Lisa Wang',
    customerId: 'CUST-77777',
    customerName: 'Jessica Martinez',
    channel: 'voice',
    duration: '4m 00s',
    startTime: '2025-11-28 12:30:00',
    endTime: '2025-11-28 12:34:00',
    topic: 'Advanced Product Knowledge',
    resolution: 'resolved',
    qualityScore: 79.6,
    fciScore: 24.2,
    sentiment: 'positive',
    messages: [
      { id: 'm1', timestamp: '0:00', speaker: 'agent', name: 'Lisa Wang', message: 'Hello, this is Lisa Wang from Premier Bank. Welcome! What brings you to us today?', sentiment: 'positive', tone: 'warm' },
      { id: 'm2', timestamp: '0:12', speaker: 'customer', name: 'Jessica Martinez', message: 'Hi Lisa, I\'m interested in opening a CD, but I have questions about the different terms available.', sentiment: 'neutral', tone: 'curious' },
      { id: 'm3', timestamp: '0:32', speaker: 'agent', name: 'Lisa Wang', message: 'Excellent choice! CDs are a great way to grow your savings with guaranteed rates. Let me walk you through our options.', sentiment: 'positive', tone: 'educational' },
      { id: 'm4', timestamp: '0:55', speaker: 'customer', name: 'Jessica Martinez', message: 'What terms do you offer?', sentiment: 'neutral', tone: 'direct' },
      { id: 'm5', timestamp: '1:10', speaker: 'agent', name: 'Lisa Wang', message: 'We have 3, 6, 12, 24, and 60-month terms. Longer terms typically have higher APY. Currently, a 12-month CD is 4.75% APY, and a 60-month is 5.10%.', sentiment: 'positive', tone: 'detailed' },
      { id: 'm6', timestamp: '1:38', speaker: 'customer', name: 'Jessica Martinez', message: 'What\'s the difference between the rates, and which should I choose?', sentiment: 'neutral', tone: 'seeking guidance' },
      { id: 'm7', timestamp: '1:58', speaker: 'agent', name: 'Lisa Wang', message: 'Great question. The longer you commit, the higher the rate. If you won\'t need the money for 5 years, the 60-month makes sense. If you want flexibility sooner, 12-month is solid.', sentiment: 'positive', tone: 'consultative' },
      { id: 'm8', timestamp: '2:25', speaker: 'customer', name: 'Jessica Martinez', message: 'What happens if I need the money before the CD matures?', sentiment: 'neutral', tone: 'practical' },
      { id: 'm9', timestamp: '2:42', speaker: 'agent', name: 'Lisa Wang', message: 'You can withdraw, but there\'s an early withdrawal penalty. For example, a 60-month CD has a 6-month interest penalty. So you\'d lose 6 months of interest if you withdraw early.', sentiment: 'positive', tone: 'transparent' },
      { id: 'm10', timestamp: '3:10', speaker: 'customer', name: 'Jessica Martinez', message: 'That makes sense. I have $25,000 I don\'t think I\'ll need for a few years. The 36-month might be perfect.', sentiment: 'positive', tone: 'deciding' },
      { id: 'm11', timestamp: '3:30', speaker: 'agent', name: 'Lisa Wang', message: 'Perfect choice! Our 36-month CD is currently at 4.95% APY. On $25,000, that would earn approximately $4,000 in interest over 3 years.', sentiment: 'positive', tone: 'supportive' },
      { id: 'm12', timestamp: '3:55', speaker: 'customer', name: 'Jessica Martinez', message: 'That\'s great! Let\'s open it. What do I need to do?', sentiment: 'positive', tone: 'ready' },
      { id: 'm13', timestamp: '4:00', speaker: 'agent', name: 'Lisa Wang', message: 'I can set this up for you right now online. Your CD will be funded within 24 hours. You\'ll love the guaranteed growth!', sentiment: 'positive', tone: 'efficient' }
    ]
  }
};

// Default call transcript data (backward compatibility)
export const callTranscriptData = callTranscriptMap['AGT002'];

// Helper function to get call transcript by agent ID
export const getCallTranscriptByAgentId = (agentId: string): CallTranscript | undefined => {
  return callTranscriptMap[agentId];
};

// Helper function to get all agent IDs
export const getAllAgentIds = (): string[] => {
  return Object.keys(callTranscriptMap);
};

// Helper function to check if agent has call transcript
export const hasCallTranscript = (agentId: string): boolean => {
  return agentId in callTranscriptMap;
};

