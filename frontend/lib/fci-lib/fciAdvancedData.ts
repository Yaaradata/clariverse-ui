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

