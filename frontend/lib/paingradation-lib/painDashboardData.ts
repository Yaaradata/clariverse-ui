// Pain Gradation Dashboard Data Types and Sample Data

export interface OverallPainHealthData {
  customerPainIndex: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  csat?: number; // CSAT if available
  negativeSentimentPercent: number; // % negative / very negative sentiment
  repeatContactRate: number;
  escalationRate: number;
  avgDaysToResolve: number; // Avg. days to resolve painful intents (refund, delivery delay)
}

export interface JourneyStage {
  stage: string;
  painScore: number;
  cases: number;
  percentage: number;
  color: string;
}

export interface PainByJourneyStageData {
  stages: JourneyStage[];
  totalCases: number;
}

export interface CustomerType {
  type: string;
  sentimentScore: number;
  cases: number;
  percentage: number;
  color: string;
  description?: string;
  sentimentBreakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface SentimentByCustomerTypeData {
  overallSentiment: number;
  customerTypes: CustomerType[];
  positiveFactors: string[];
  negativeFactors: string[];
}

export interface TransportationDisruptionCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface TransportationDisruptionAlertData {
  totalDisruptions: number;
  categories: TransportationDisruptionCategory[];
  lastWeekComparison?: string;
}

// Sample Data
export const overallPainHealthData: OverallPainHealthData = {
  customerPainIndex: 72,
  trend: 5,
  trendDirection: 'up',
  csat: 4.1,
  negativeSentimentPercent: 23,
  repeatContactRate: 12,
  escalationRate: 6.2,
  avgDaysToResolve: 2.3,
};

export const painByJourneyStageData: PainByJourneyStageData = {
  totalCases: 40700,
  stages: [
    {
      stage: 'Pre-Order',
      painScore: 15,
      cases: 3700,
      percentage: 9,
      color: '#5332FF',
    },
    {
      stage: 'Order Placed',
      painScore: 22,
      cases: 8400,
      percentage: 20,
      color: '#B90ABD',
    },
    {
      stage: 'In-Transit',
      painScore: 35,
      cases: 13900,
      percentage: 33,
      color: '#f97316',
    },
    {
      stage: 'Delivery Day',
      painScore: 45,
      cases: 8600,
      percentage: 21,
      color: '#ef4444',
    },
    {
      stage: 'Post-Delivery',
      painScore: 28,
      cases: 6100,
      percentage: 15,
      color: '#10b981',
    },
  ],
};

export const sentimentByCustomerTypeData: SentimentByCustomerTypeData = {
  overallSentiment: 68,
  customerTypes: [
    {
      type: 'Value-conscious consumers',
      sentimentScore: 62,
      cases: 12488,
      percentage: 40,
      color: '#10b981',
      description: 'This segment prioritizes affordability and seeks deals and discounts. Flipkart targets them with price-sensitive campaigns and budget-friendly product offerings.',
      sentimentBreakdown: {
        positive: 62,
        neutral: 28,
        negative: 10,
      },
    },
    {
      type: 'Tech-savvy millennials',
      sentimentScore: 74,
      cases: 10704,
      percentage: 25,
      color: '#06b6d4',
      description: 'This segment is comfortable with online shopping and uses mobile devices extensively. Flipkart focuses on a mobile-first experience and leverages social media marketing to reach them.',
      sentimentBreakdown: {
        positive: 74,
        neutral: 16,
        negative: 10,
      },
    },
    {
      type: 'Fashion-conscious individuals',
      sentimentScore: 66,
      cases: 8920,
      percentage: 20,
      color: '#f59e0b',
      description: 'This segment is interested in trendy clothing and accessories. Flipkart caters to them through partnerships with fashion brands and targeted marketing campaigns.',
      sentimentBreakdown: {
        positive: 66,
        neutral: 19,
        negative: 15,
      },
    },
    {
      type: 'Home & Grocery shoppers',
      sentimentScore: 70,
      cases: 3568,
      percentage: 15,
      color: '#ef4444',
      description: 'This segment seeks convenience and variety in everyday essentials. Flipkart offers them a wide selection of products and hassle-free delivery options.',
      sentimentBreakdown: {
        positive: 70,
        neutral: 18,
        negative: 12,
      },
    },
  ],
  positiveFactors: ['Quick resolution', 'Agent helpfulness', 'Easy returns'],
  negativeFactors: ['Wait times', 'Transfer issues', 'Delivery delays'],
};

export const transportationDisruptionAlertData: TransportationDisruptionAlertData = {
  totalDisruptions: 6251,
  categories: [
    {
      category: 'Weather & Environment',
      count: 1563,
      percentage: 25,
      color: '#3b82f6',
      description: '(Natural climate-related disruptions impacting mobility & parcel safety)',
    },
    {
      category: 'Infrastructure & Traffic',
      count: 2500,
      percentage: 40,
      color: '#f97316',
      description: '(Road network, routing and urban congestion challenges)',
    },
    {
      category: 'Socio-Political & Security',
      count: 938,
      percentage: 15,
      color: '#ef4444',
      description: '(Human-driven disruptions affecting delivery safety & continuity)',
    },
    {
      category: 'Operational & Human',
      count: 1250,
      percentage: 20,
      color: '#22c55e',
      description: '(Internal workforce, tech, vehicle & customer-behavior issues)',
    },
  ],
};

// CX Pain Priority Board Types and Data
export type JourneyStageType = 'Pre-Order' | 'Order Placed' | 'In-Transit' | 'Delivery Day' | 'Post-Delivery';
export type PriorityColumn = 'do-now' | 'schedule' | 'delegate' | 'postpone';

export interface PainClusterMetrics {
  dsatPercent: number;
  negativeSentimentPercent: number;
  ordersTouched: number;
  refundCancelRate: number;
  backlogTickets: number;
  repeatContactRate: number;
  escalationRate: number;
  avgDaysToResolve: number;
  fcrRate: number;
}

export interface ChannelMix {
  chat: number;
  voice: number;
  email: number;
  social: number;
}

export interface PainCluster {
  id: string;
  title: string;
  journeyStage: JourneyStageType;
  location?: string;
  impactScore: number;
  strainScore: number;
  metrics: PainClusterMetrics;
  channelMix: ChannelMix;
  contacts: number;
  aiSummary: string;
  suggestedActions: string[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  disruptionBreakdown?: {
    weather: number;
    infrastructure: number;
    socioPolitical: number;
    operational: number;
  };
  isTopPain?: boolean;
}

export interface PriorityColumnConfig {
  id: PriorityColumn;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Priority Column Configurations
export const priorityColumns: PriorityColumnConfig[] = [
  {
    id: 'do-now',
    title: 'Do',
    subtitle: 'Now',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    subtitle: 'Later',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  {
    id: 'delegate',
    title: 'Delegate',
    subtitle: 'Team',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    id: 'postpone',
    title: 'Postpone',
    subtitle: '',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
];

// Journey Stage Colors
export const journeyStageColors: Record<JourneyStageType, string> = {
  'Pre-Order': '#5332FF',
  'Order Placed': '#B90ABD',
  'In-Transit': '#f97316',
  'Delivery Day': '#ef4444',
  'Post-Delivery': '#10b981',
};

// Sample Pain Clusters Data - Short names for e-commerce with matching quadrant totals
// DO-NOW: 12, SCHEDULE: 35, DELEGATE: 500, POSTPONE: 1457
export const painClustersData: PainCluster[] = [
  // DO NOW - High Impact, High Strain (Total: 12)
  // 6 clusters: Payment Failure, Refund Delay, Delivery Miss, Rider No-Show, Order Not-Placed, App Outage
  {
    id: 'pc-001',
    title: 'Payment Failure',
    journeyStage: 'Order Placed',
    location: 'Pan India',
    impactScore: 95,
    strainScore: 92,
    metrics: {
      dsatPercent: 45,
      negativeSentimentPercent: 38,
      ordersTouched: 3,
      refundCancelRate: 28,
      backlogTickets: 2,
      repeatContactRate: 22,
      escalationRate: 12.5,
      avgDaysToResolve: 1.2,
      fcrRate: 45,
    },
    channelMix: { chat: 50, voice: 35, email: 10, social: 5 },
    contacts: 3,
    aiSummary: 'Payment failures blocking orders. Gateway timeouts and UPI failures causing immediate escalations.',
    suggestedActions: [
      'Escalate to payment gateway team',
      'Enable fallback payment options',
      'Auto-retry failed transactions',
    ],
    sentimentBreakdown: { positive: 10, neutral: 52, negative: 38 },
    isTopPain: true,
  },
  {
    id: 'pc-002',
    title: 'Refund Delay',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 92,
    strainScore: 88,
    metrics: {
      dsatPercent: 42,
      negativeSentimentPercent: 35,
      ordersTouched: 2,
      refundCancelRate: 15,
      backlogTickets: 1,
      repeatContactRate: 28,
      escalationRate: 10.2,
      avgDaysToResolve: 4.5,
      fcrRate: 38,
    },
    channelMix: { chat: 45, voice: 40, email: 10, social: 5 },
    contacts: 2,
    aiSummary: 'Critical refund delays causing high escalations. Immediate finance team intervention needed.',
    suggestedActions: [
      'Fast-track pending refunds',
      'Send proactive status updates',
      'Escalate to finance team',
    ],
    sentimentBreakdown: { positive: 8, neutral: 57, negative: 35 },
    isTopPain: true,
  },
  {
    id: 'pc-003',
    title: 'Delivery Miss',
    journeyStage: 'Delivery Day',
    location: 'Metro Cities',
    impactScore: 90,
    strainScore: 85,
    metrics: {
      dsatPercent: 48,
      negativeSentimentPercent: 32,
      ordersTouched: 2,
      refundCancelRate: 22,
      backlogTickets: 1,
      repeatContactRate: 25,
      escalationRate: 11.5,
      avgDaysToResolve: 2.8,
      fcrRate: 42,
    },
    channelMix: { chat: 40, voice: 45, email: 10, social: 5 },
    contacts: 2,
    aiSummary: 'Missed deliveries on promised date causing high DSAT. Logistics capacity issue.',
    suggestedActions: [
      'Reschedule priority delivery',
      'Offer compensation/credits',
      'Alert logistics operations',
    ],
    sentimentBreakdown: { positive: 12, neutral: 56, negative: 32 },
    isTopPain: true,
  },
  {
    id: 'pc-004',
    title: 'Rider No-Show',
    journeyStage: 'Delivery Day',
    location: 'Tier-1 Cities',
    impactScore: 88,
    strainScore: 82,
    metrics: {
      dsatPercent: 42,
      negativeSentimentPercent: 28,
      ordersTouched: 2,
      refundCancelRate: 18,
      backlogTickets: 1,
      repeatContactRate: 24,
      escalationRate: 12.3,
      avgDaysToResolve: 2.8,
      fcrRate: 42,
    },
    channelMix: { chat: 35, voice: 45, email: 10, social: 10 },
    contacts: 2,
    aiSummary: 'Rider no-show incidents causing high escalation. Delivery partner attendance issues.',
    suggestedActions: [
      'Reassign to available rider',
      'Auto-reschedule delivery',
      'Offer compensation credits',
    ],
    sentimentBreakdown: { positive: 12, neutral: 60, negative: 28 },
    isTopPain: true,
  },
  {
    id: 'pc-005',
    title: 'Order Not-Placed',
    journeyStage: 'Order Placed',
    location: 'Pan India',
    impactScore: 86,
    strainScore: 80,
    metrics: {
      dsatPercent: 38,
      negativeSentimentPercent: 30,
      ordersTouched: 2,
      refundCancelRate: 0,
      backlogTickets: 1,
      repeatContactRate: 20,
      escalationRate: 8.5,
      avgDaysToResolve: 0.5,
      fcrRate: 55,
    },
    channelMix: { chat: 55, voice: 30, email: 10, social: 5 },
    contacts: 2,
    aiSummary: 'Orders failing to place despite payment. Cart/checkout system errors.',
    suggestedActions: [
      'Check system health immediately',
      'Manual order placement',
      'Escalate to tech team',
    ],
    sentimentBreakdown: { positive: 15, neutral: 55, negative: 30 },
    isTopPain: true,
  },
  {
    id: 'pc-006',
    title: 'App Outage',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 85,
    strainScore: 78,
    metrics: {
      dsatPercent: 35,
      negativeSentimentPercent: 28,
      ordersTouched: 1,
      refundCancelRate: 0,
      backlogTickets: 1,
      repeatContactRate: 18,
      escalationRate: 7.2,
      avgDaysToResolve: 0.2,
      fcrRate: 60,
    },
    channelMix: { chat: 60, voice: 25, email: 5, social: 10 },
    contacts: 1,
    aiSummary: 'App/website outage preventing access. Critical infrastructure issue.',
    suggestedActions: [
      'Escalate to DevOps immediately',
      'Post status update on social',
      'Enable backup access options',
    ],
    sentimentBreakdown: { positive: 10, neutral: 62, negative: 28 },
    isTopPain: true,
  },
  // SCHEDULE - High Impact, Lower Strain (Total: 35)
  // 6 clusters: Policy Confusion, Return Friction, Offer Confusion, App UX Issues, Search Friction, Tracking Clarity
  {
    id: 'pc-007',
    title: 'Policy Confusion',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 75,
    strainScore: 48,
    metrics: {
      dsatPercent: 25,
      negativeSentimentPercent: 18,
      ordersTouched: 8,
      refundCancelRate: 12,
      backlogTickets: 4,
      repeatContactRate: 14,
      escalationRate: 5.8,
      avgDaysToResolve: 2.1,
      fcrRate: 68,
    },
    channelMix: { chat: 55, voice: 20, email: 20, social: 5 },
    contacts: 8,
    aiSummary: 'Customers confused about return/exchange policies. Documentation unclear.',
    suggestedActions: [
      'Simplify policy documentation',
      'Add policy FAQ section',
      'Create visual policy guides',
    ],
    sentimentBreakdown: { positive: 35, neutral: 47, negative: 18 },
  },
  {
    id: 'pc-008',
    title: 'Return Friction',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 72,
    strainScore: 45,
    metrics: {
      dsatPercent: 28,
      negativeSentimentPercent: 20,
      ordersTouched: 7,
      refundCancelRate: 22,
      backlogTickets: 3,
      repeatContactRate: 16,
      escalationRate: 6.2,
      avgDaysToResolve: 2.5,
      fcrRate: 62,
    },
    channelMix: { chat: 50, voice: 25, email: 20, social: 5 },
    contacts: 7,
    aiSummary: 'Return process too complex. Customers struggling with return initiation.',
    suggestedActions: [
      'Streamline return flow',
      'Add one-click return option',
      'Improve pickup scheduling',
    ],
    sentimentBreakdown: { positive: 30, neutral: 50, negative: 20 },
  },
  {
    id: 'pc-009',
    title: 'Offer Confusion',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 70,
    strainScore: 42,
    metrics: {
      dsatPercent: 22,
      negativeSentimentPercent: 15,
      ordersTouched: 6,
      refundCancelRate: 8,
      backlogTickets: 3,
      repeatContactRate: 12,
      escalationRate: 4.5,
      avgDaysToResolve: 1.2,
      fcrRate: 72,
    },
    channelMix: { chat: 60, voice: 15, email: 15, social: 10 },
    contacts: 6,
    aiSummary: 'Promo codes and offers not applying correctly. Terms unclear to customers.',
    suggestedActions: [
      'Clarify offer terms upfront',
      'Fix promo code validation',
      'Add offer eligibility checker',
    ],
    sentimentBreakdown: { positive: 38, neutral: 47, negative: 15 },
  },
  {
    id: 'pc-010',
    title: 'App UX Issues',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 68,
    strainScore: 40,
    metrics: {
      dsatPercent: 20,
      negativeSentimentPercent: 14,
      ordersTouched: 5,
      refundCancelRate: 5,
      backlogTickets: 2,
      repeatContactRate: 10,
      escalationRate: 3.8,
      avgDaysToResolve: 1.0,
      fcrRate: 75,
    },
    channelMix: { chat: 65, voice: 10, email: 15, social: 10 },
    contacts: 5,
    aiSummary: 'App navigation and usability issues. Checkout flow causing friction.',
    suggestedActions: [
      'Conduct UX audit',
      'Simplify checkout steps',
      'Fix reported UI bugs',
    ],
    sentimentBreakdown: { positive: 40, neutral: 46, negative: 14 },
  },
  {
    id: 'pc-011',
    title: 'Search Friction',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 65,
    strainScore: 38,
    metrics: {
      dsatPercent: 18,
      negativeSentimentPercent: 12,
      ordersTouched: 5,
      refundCancelRate: 3,
      backlogTickets: 2,
      repeatContactRate: 8,
      escalationRate: 2.5,
      avgDaysToResolve: 0.8,
      fcrRate: 80,
    },
    channelMix: { chat: 70, voice: 10, email: 10, social: 10 },
    contacts: 5,
    aiSummary: 'Product search not returning relevant results. Filter options limited.',
    suggestedActions: [
      'Improve search algorithm',
      'Add more filter options',
      'Enable voice search',
    ],
    sentimentBreakdown: { positive: 42, neutral: 46, negative: 12 },
  },
  {
    id: 'pc-012',
    title: 'Tracking Clarity',
    journeyStage: 'In-Transit',
    location: 'Pan India',
    impactScore: 62,
    strainScore: 35,
    metrics: {
      dsatPercent: 15,
      negativeSentimentPercent: 10,
      ordersTouched: 4,
      refundCancelRate: 2,
      backlogTickets: 2,
      repeatContactRate: 6,
      escalationRate: 2.0,
      avgDaysToResolve: 0.5,
      fcrRate: 85,
    },
    channelMix: { chat: 75, voice: 10, email: 10, social: 5 },
    contacts: 4,
    aiSummary: 'Order tracking updates unclear or delayed. Customers want more visibility.',
    suggestedActions: [
      'Add real-time tracking map',
      'Send proactive updates',
      'Show delivery ETA clearly',
    ],
    sentimentBreakdown: { positive: 45, neutral: 45, negative: 10 },
  },
  // DELEGATE - Lower Impact, High Strain (Total: 500)
  // 6 clusters: Callback Pending, Address Issue, Courier Delay, Rider Behavior, WISMO, Slot Reschedule
  {
    id: 'pc-013',
    title: 'Callback Pending',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 45,
    strainScore: 78,
    metrics: {
      dsatPercent: 18,
      negativeSentimentPercent: 14,
      ordersTouched: 100,
      refundCancelRate: 3,
      backlogTickets: 45,
      repeatContactRate: 15,
      escalationRate: 4.2,
      avgDaysToResolve: 1.5,
      fcrRate: 55,
    },
    channelMix: { chat: 30, voice: 55, email: 10, social: 5 },
    contacts: 100,
    aiSummary: 'Customers awaiting promised callbacks. Follow-up queue growing.',
    suggestedActions: [
      'Clear callback backlog',
      'Assign to outbound team',
      'Send status SMS updates',
    ],
    sentimentBreakdown: { positive: 35, neutral: 51, negative: 14 },
  },
  {
    id: 'pc-014',
    title: 'Address Issue',
    journeyStage: 'In-Transit',
    location: 'Tier-2, Tier-3',
    impactScore: 48,
    strainScore: 75,
    metrics: {
      dsatPercent: 15,
      negativeSentimentPercent: 12,
      ordersTouched: 95,
      refundCancelRate: 5,
      backlogTickets: 40,
      repeatContactRate: 8,
      escalationRate: 2.1,
      avgDaysToResolve: 0.8,
      fcrRate: 85,
    },
    channelMix: { chat: 25, voice: 65, email: 5, social: 5 },
    contacts: 95,
    aiSummary: 'Address clarification calls consuming agent time. Quick resolution but high volume.',
    suggestedActions: [
      'Delegate to field ops',
      'Enable driver-customer chat',
      'Add landmark verification',
    ],
    sentimentBreakdown: { positive: 52, neutral: 36, negative: 12 },
  },
  {
    id: 'pc-015',
    title: 'Courier Delay',
    journeyStage: 'In-Transit',
    location: 'Pan India',
    impactScore: 42,
    strainScore: 72,
    metrics: {
      dsatPercent: 14,
      negativeSentimentPercent: 11,
      ordersTouched: 90,
      refundCancelRate: 4,
      backlogTickets: 38,
      repeatContactRate: 7,
      escalationRate: 1.8,
      avgDaysToResolve: 0.5,
      fcrRate: 88,
    },
    channelMix: { chat: 65, voice: 20, email: 10, social: 5 },
    contacts: 90,
    aiSummary: 'Minor courier delays within acceptable range. Delegate to logistics team.',
    suggestedActions: [
      'Assign to logistics support',
      'Send proactive delay SMS',
      'Monitor for patterns',
    ],
    sentimentBreakdown: { positive: 48, neutral: 41, negative: 11 },
  },
  {
    id: 'pc-016',
    title: 'Rider Behavior',
    journeyStage: 'Delivery Day',
    location: 'Pan India',
    impactScore: 40,
    strainScore: 70,
    metrics: {
      dsatPercent: 16,
      negativeSentimentPercent: 13,
      ordersTouched: 80,
      refundCancelRate: 2,
      backlogTickets: 35,
      repeatContactRate: 5,
      escalationRate: 3.5,
      avgDaysToResolve: 1.2,
      fcrRate: 75,
    },
    channelMix: { chat: 40, voice: 45, email: 10, social: 5 },
    contacts: 80,
    aiSummary: 'Delivery partner behavior complaints. Delegate to last-mile operations.',
    suggestedActions: [
      'Escalate to rider ops',
      'Log for partner review',
      'Offer apology credit',
    ],
    sentimentBreakdown: { positive: 38, neutral: 49, negative: 13 },
  },
  {
    id: 'pc-017',
    title: 'WISMO',
    journeyStage: 'In-Transit',
    location: 'Pan India',
    impactScore: 38,
    strainScore: 68,
    metrics: {
      dsatPercent: 10,
      negativeSentimentPercent: 8,
      ordersTouched: 75,
      refundCancelRate: 1,
      backlogTickets: 30,
      repeatContactRate: 5,
      escalationRate: 1.2,
      avgDaysToResolve: 0.2,
      fcrRate: 92,
    },
    channelMix: { chat: 75, voice: 12, email: 8, social: 5 },
    contacts: 75,
    aiSummary: 'Where-Is-My-Order queries. High volume but easily resolved via chatbot.',
    suggestedActions: [
      'Route to automated bot',
      'Enable self-service tracking',
      'Push proactive updates',
    ],
    sentimentBreakdown: { positive: 50, neutral: 42, negative: 8 },
  },
  {
    id: 'pc-018',
    title: 'Slot Reschedule',
    journeyStage: 'Delivery Day',
    location: 'Pan India',
    impactScore: 35,
    strainScore: 65,
    metrics: {
      dsatPercent: 12,
      negativeSentimentPercent: 9,
      ordersTouched: 60,
      refundCancelRate: 2,
      backlogTickets: 25,
      repeatContactRate: 6,
      escalationRate: 1.5,
      avgDaysToResolve: 0.3,
      fcrRate: 90,
    },
    channelMix: { chat: 70, voice: 15, email: 10, social: 5 },
    contacts: 60,
    aiSummary: 'Delivery slot change requests. Delegate to scheduling team.',
    suggestedActions: [
      'Enable self-service reschedule',
      'Route to slot management',
      'Confirm new slot via SMS',
    ],
    sentimentBreakdown: { positive: 52, neutral: 39, negative: 9 },
  },
  // POSTPONE - Lower Impact, Lower Strain (Total: 1457)
  // 5 clusters: Packaging Feedback, Feature Request, UI Preference, Notification Noise, Wishlist Ideas
  {
    id: 'pc-019',
    title: 'Packaging Feedback',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 28,
    strainScore: 30,
    metrics: {
      dsatPercent: 8,
      negativeSentimentPercent: 6,
      ordersTouched: 350,
      refundCancelRate: 1,
      backlogTickets: 25,
      repeatContactRate: 3,
      escalationRate: 0.8,
      avgDaysToResolve: 0.5,
      fcrRate: 92,
    },
    channelMix: { chat: 70, voice: 10, email: 15, social: 5 },
    contacts: 350,
    aiSummary: 'Feedback about packaging quality. Suggestions for eco-friendly options.',
    suggestedActions: [
      'Log for product review',
      'Add to feedback database',
      'Share with packaging team',
    ],
    sentimentBreakdown: { positive: 55, neutral: 39, negative: 6 },
  },
  {
    id: 'pc-020',
    title: 'Feature Request',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 25,
    strainScore: 28,
    metrics: {
      dsatPercent: 5,
      negativeSentimentPercent: 4,
      ordersTouched: 320,
      refundCancelRate: 0,
      backlogTickets: 20,
      repeatContactRate: 2,
      escalationRate: 0.5,
      avgDaysToResolve: 0.3,
      fcrRate: 95,
    },
    channelMix: { chat: 75, voice: 5, email: 15, social: 5 },
    contacts: 320,
    aiSummary: 'New feature suggestions from customers. Enhancement ideas for product team.',
    suggestedActions: [
      'Log in feature backlog',
      'Thank customer for input',
      'Share with product team',
    ],
    sentimentBreakdown: { positive: 62, neutral: 34, negative: 4 },
  },
  {
    id: 'pc-021',
    title: 'UI Preference',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 22,
    strainScore: 25,
    metrics: {
      dsatPercent: 6,
      negativeSentimentPercent: 5,
      ordersTouched: 290,
      refundCancelRate: 0,
      backlogTickets: 18,
      repeatContactRate: 2,
      escalationRate: 0.4,
      avgDaysToResolve: 0.2,
      fcrRate: 96,
    },
    channelMix: { chat: 80, voice: 5, email: 10, social: 5 },
    contacts: 290,
    aiSummary: 'UI/UX preferences and suggestions. Color, layout, font preferences.',
    suggestedActions: [
      'Add to UX research notes',
      'Thank for feedback',
      'Share with design team',
    ],
    sentimentBreakdown: { positive: 58, neutral: 37, negative: 5 },
  },
  {
    id: 'pc-022',
    title: 'Notification Noise',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 20,
    strainScore: 22,
    metrics: {
      dsatPercent: 7,
      negativeSentimentPercent: 5,
      ordersTouched: 260,
      refundCancelRate: 0,
      backlogTickets: 15,
      repeatContactRate: 3,
      escalationRate: 0.6,
      avgDaysToResolve: 0.2,
      fcrRate: 94,
    },
    channelMix: { chat: 78, voice: 5, email: 12, social: 5 },
    contacts: 260,
    aiSummary: 'Too many notifications complaint. Preference for notification frequency.',
    suggestedActions: [
      'Guide to notification settings',
      'Log preference feedback',
      'Review notification rules',
    ],
    sentimentBreakdown: { positive: 52, neutral: 43, negative: 5 },
  },
  {
    id: 'pc-023',
    title: 'Wishlist Ideas',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 18,
    strainScore: 20,
    metrics: {
      dsatPercent: 4,
      negativeSentimentPercent: 3,
      ordersTouched: 237,
      refundCancelRate: 0,
      backlogTickets: 12,
      repeatContactRate: 2,
      escalationRate: 0.3,
      avgDaysToResolve: 0.2,
      fcrRate: 97,
    },
    channelMix: { chat: 82, voice: 3, email: 10, social: 5 },
    contacts: 237,
    aiSummary: 'Wishlist feature enhancement ideas. Price alerts, sharing, sync requests.',
    suggestedActions: [
      'Log feature suggestions',
      'Acknowledge input',
      'Add to product backlog',
    ],
    sentimentBreakdown: { positive: 65, neutral: 32, negative: 3 },
  },
];

// Helper function to categorize pain clusters
export function categorizePainCluster(cluster: PainCluster, threshold: number = 60): PriorityColumn {
  const { impactScore, strainScore } = cluster;
  
  if (impactScore >= threshold && strainScore >= threshold) {
    return 'do-now';
  } else if (impactScore >= threshold && strainScore < threshold) {
    return 'schedule';
  } else if (impactScore < threshold && strainScore >= threshold) {
    return 'delegate';
  } else {
    return 'postpone';
  }
}

// Get clusters by priority column
export function getClustersByPriority(clusters: PainCluster[], column: PriorityColumn, threshold: number = 60): PainCluster[] {
  return clusters.filter(cluster => categorizePainCluster(cluster, threshold) === column);
}

