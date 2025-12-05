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

// Sample Pain Clusters Data
export const painClustersData: PainCluster[] = [
  // DO NOW - High Impact, High Strain
  {
    id: 'pc-001',
    title: 'Delivery delay – Metro cities',
    journeyStage: 'In-Transit',
    location: 'Mumbai, Delhi, Bangalore',
    impactScore: 87,
    strainScore: 82,
    metrics: {
      dsatPercent: 34,
      negativeSentimentPercent: 21,
      ordersTouched: 8300,
      refundCancelRate: 12,
      backlogTickets: 2340,
      repeatContactRate: 17,
      escalationRate: 8.5,
      avgDaysToResolve: 3.2,
      fcrRate: 58,
    },
    channelMix: { chat: 45, voice: 30, email: 15, social: 10 },
    contacts: 8300,
    aiSummary: 'Delivery delays in In-Transit stage for Metro cities are driving 21% of all negative contacts this week. 17% repeat contact rate with 8.3K orders impacted. Primary causes: courier partner capacity issues and traffic congestion during peak hours.',
    suggestedActions: [
      'Escalate to logistics team for immediate capacity review',
      'Enable proactive delay notifications to affected customers',
      'Activate backup courier partners in high-volume zones',
      'Deploy customer care blitz for high-value affected orders',
    ],
    sentimentBreakdown: { positive: 18, neutral: 61, negative: 21 },
    disruptionBreakdown: { weather: 15, infrastructure: 55, socioPolitical: 5, operational: 25 },
    isTopPain: true,
  },
  {
    id: 'pc-002',
    title: 'Rider no-show – Tier-1 cities',
    journeyStage: 'Delivery Day',
    location: 'Tier-1 Cities',
    impactScore: 91,
    strainScore: 78,
    metrics: {
      dsatPercent: 42,
      negativeSentimentPercent: 28,
      ordersTouched: 4200,
      refundCancelRate: 18,
      backlogTickets: 1890,
      repeatContactRate: 24,
      escalationRate: 12.3,
      avgDaysToResolve: 2.8,
      fcrRate: 42,
    },
    channelMix: { chat: 35, voice: 45, email: 10, social: 10 },
    contacts: 4200,
    aiSummary: 'Rider no-show incidents in Tier-1 cities causing 28% negative sentiment. High escalation rate at 12.3% with 24% customers making repeat contacts. Issue linked to delivery partner attendance and route optimization failures.',
    suggestedActions: [
      'Implement real-time rider tracking alerts for customers',
      'Review delivery partner performance metrics',
      'Auto-reschedule failed deliveries within 4-hour window',
      'Offer compensation credits for repeated no-shows',
    ],
    sentimentBreakdown: { positive: 12, neutral: 60, negative: 28 },
    disruptionBreakdown: { weather: 10, infrastructure: 20, socioPolitical: 5, operational: 65 },
    isTopPain: true,
  },
  {
    id: 'pc-003',
    title: 'Wrong item delivered',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 85,
    strainScore: 71,
    metrics: {
      dsatPercent: 48,
      negativeSentimentPercent: 32,
      ordersTouched: 3100,
      refundCancelRate: 45,
      backlogTickets: 1450,
      repeatContactRate: 31,
      escalationRate: 15.2,
      avgDaysToResolve: 4.5,
      fcrRate: 35,
    },
    channelMix: { chat: 40, voice: 35, email: 20, social: 5 },
    contacts: 3100,
    aiSummary: 'Wrong item deliveries driving highest DSAT at 48% with 45% refund/cancel rate. 31% repeat contact as customers struggle with exchange process. Root cause: warehouse picking errors and SKU mislabeling.',
    suggestedActions: [
      'Audit warehouse picking accuracy in top error locations',
      'Implement barcode verification at dispatch',
      'Fast-track replacement for verified wrong-item cases',
      'Reduce exchange process steps from 5 to 2',
    ],
    sentimentBreakdown: { positive: 8, neutral: 60, negative: 32 },
    isTopPain: true,
  },
  // SCHEDULE - High Impact, Lower Strain
  {
    id: 'pc-004',
    title: 'Return window confusion',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 72,
    strainScore: 45,
    metrics: {
      dsatPercent: 25,
      negativeSentimentPercent: 18,
      ordersTouched: 5600,
      refundCancelRate: 22,
      backlogTickets: 890,
      repeatContactRate: 14,
      escalationRate: 5.8,
      avgDaysToResolve: 2.1,
      fcrRate: 68,
    },
    channelMix: { chat: 55, voice: 20, email: 20, social: 5 },
    contacts: 5600,
    aiSummary: 'Customers confused about return eligibility windows and category-specific policies. 18% negative sentiment driven by policy clarity issues. Most contacts resolved on first attempt (68% FCR) but volume is high.',
    suggestedActions: [
      'Add return eligibility checker in order tracking page',
      'Simplify return policy communication in delivery SMS',
      'Create visual return timeline in app order details',
      'Train agents on category-specific return exceptions',
    ],
    sentimentBreakdown: { positive: 35, neutral: 47, negative: 18 },
  },
  {
    id: 'pc-005',
    title: 'Refund delay complaints',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 78,
    strainScore: 52,
    metrics: {
      dsatPercent: 31,
      negativeSentimentPercent: 24,
      ordersTouched: 4800,
      refundCancelRate: 8,
      backlogTickets: 1120,
      repeatContactRate: 19,
      escalationRate: 7.2,
      avgDaysToResolve: 3.8,
      fcrRate: 52,
    },
    channelMix: { chat: 50, voice: 25, email: 20, social: 5 },
    contacts: 4800,
    aiSummary: 'Refund processing delays causing 24% negative sentiment. Average resolution taking 3.8 days vs promised 5-7 days, but customer expectation is 2-3 days. High repeat contact as customers check status.',
    suggestedActions: [
      'Implement real-time refund status tracking in app',
      'Send proactive refund milestone notifications',
      'Identify and fix payment gateway delays',
      'Offer instant credit option for repeat customers',
    ],
    sentimentBreakdown: { positive: 22, neutral: 54, negative: 24 },
  },
  {
    id: 'pc-006',
    title: 'COD to prepaid conversion issues',
    journeyStage: 'Order Placed',
    location: 'Tier-2, Tier-3',
    impactScore: 65,
    strainScore: 38,
    metrics: {
      dsatPercent: 22,
      negativeSentimentPercent: 15,
      ordersTouched: 3200,
      refundCancelRate: 35,
      backlogTickets: 540,
      repeatContactRate: 11,
      escalationRate: 4.2,
      avgDaysToResolve: 1.5,
      fcrRate: 75,
    },
    channelMix: { chat: 60, voice: 15, email: 15, social: 10 },
    contacts: 3200,
    aiSummary: 'Customers in Tier-2/3 cities facing issues converting COD orders to prepaid for faster delivery. 35% cancel when conversion fails. UPI payment failures and OTP delays are primary blockers.',
    suggestedActions: [
      'Add retry mechanism for failed UPI payments',
      'Extend OTP validity window for slow networks',
      'Offer alternative payment methods on failure',
      'Create offline payment collection option',
    ],
    sentimentBreakdown: { positive: 42, neutral: 43, negative: 15 },
  },
  // DELEGATE - Lower Impact, High Strain
  {
    id: 'pc-007',
    title: 'Address clarification calls',
    journeyStage: 'In-Transit',
    location: 'Tier-2, Tier-3',
    impactScore: 48,
    strainScore: 72,
    metrics: {
      dsatPercent: 15,
      negativeSentimentPercent: 12,
      ordersTouched: 6800,
      refundCancelRate: 5,
      backlogTickets: 2100,
      repeatContactRate: 8,
      escalationRate: 2.1,
      avgDaysToResolve: 0.8,
      fcrRate: 85,
    },
    channelMix: { chat: 25, voice: 65, email: 5, social: 5 },
    contacts: 6800,
    aiSummary: 'High volume of address clarification calls from delivery partners in Tier-2/3 cities. Low customer impact (12% negative) but consuming significant agent time. Most resolved quickly (0.8 days avg).',
    suggestedActions: [
      'Implement automated address verification at checkout',
      'Add landmark and alternate phone in address form',
      'Enable driver-customer direct chat for clarifications',
      'Create address standardization ML model',
    ],
    sentimentBreakdown: { positive: 52, neutral: 36, negative: 12 },
  },
  {
    id: 'pc-008',
    title: 'Order status enquiries',
    journeyStage: 'In-Transit',
    location: 'Pan India',
    impactScore: 42,
    strainScore: 68,
    metrics: {
      dsatPercent: 12,
      negativeSentimentPercent: 9,
      ordersTouched: 12500,
      refundCancelRate: 2,
      backlogTickets: 1850,
      repeatContactRate: 6,
      escalationRate: 1.5,
      avgDaysToResolve: 0.3,
      fcrRate: 92,
    },
    channelMix: { chat: 70, voice: 15, email: 10, social: 5 },
    contacts: 12500,
    aiSummary: 'Large volume of "where is my order" queries despite tracking available. 9% negative sentiment, mostly neutral enquiries. High FCR at 92% but volume is straining chat capacity.',
    suggestedActions: [
      'Enhance push notifications for status updates',
      'Add estimated delivery time countdown in app',
      'Deploy chatbot for status queries with live tracking',
      'Reduce tracking page load time for better UX',
    ],
    sentimentBreakdown: { positive: 45, neutral: 46, negative: 9 },
  },
  {
    id: 'pc-009',
    title: 'Invoice and GST requests',
    journeyStage: 'Post-Delivery',
    location: 'B2B Customers',
    impactScore: 35,
    strainScore: 65,
    metrics: {
      dsatPercent: 18,
      negativeSentimentPercent: 14,
      ordersTouched: 4200,
      refundCancelRate: 1,
      backlogTickets: 1650,
      repeatContactRate: 22,
      escalationRate: 3.8,
      avgDaysToResolve: 2.5,
      fcrRate: 55,
    },
    channelMix: { chat: 35, voice: 20, email: 40, social: 5 },
    contacts: 4200,
    aiSummary: 'B2B customers requesting GST invoices and tax documents. 22% repeat contact due to delays in invoice generation. Email-heavy channel mix. Low customer impact but high operational load.',
    suggestedActions: [
      'Auto-generate GST invoice at order completion',
      'Add invoice download in order history section',
      'Create bulk invoice request feature for B2B',
      'Integrate with accounting software APIs',
    ],
    sentimentBreakdown: { positive: 38, neutral: 48, negative: 14 },
  },
  // POSTPONE - Lower Impact, Lower Strain
  {
    id: 'pc-010',
    title: 'Feature enquiry – low-value SKUs',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 28,
    strainScore: 32,
    metrics: {
      dsatPercent: 8,
      negativeSentimentPercent: 6,
      ordersTouched: 2800,
      refundCancelRate: 3,
      backlogTickets: 380,
      repeatContactRate: 5,
      escalationRate: 1.2,
      avgDaysToResolve: 0.5,
      fcrRate: 88,
    },
    channelMix: { chat: 75, voice: 10, email: 10, social: 5 },
    contacts: 2800,
    aiSummary: 'Pre-purchase queries about product features for low-value items. Very low negative sentiment at 6%. Mostly chat-based with high FCR. Low priority as it doesn\'t impact orders significantly.',
    suggestedActions: [
      'Enhance product description pages',
      'Add FAQ section for common product queries',
      'Enable community Q&A on product pages',
      'Improve product comparison features',
    ],
    sentimentBreakdown: { positive: 58, neutral: 36, negative: 6 },
  },
  {
    id: 'pc-011',
    title: 'Wishlist and save for later',
    journeyStage: 'Pre-Order',
    location: 'Pan India',
    impactScore: 22,
    strainScore: 25,
    metrics: {
      dsatPercent: 5,
      negativeSentimentPercent: 4,
      ordersTouched: 1800,
      refundCancelRate: 0,
      backlogTickets: 220,
      repeatContactRate: 3,
      escalationRate: 0.5,
      avgDaysToResolve: 0.2,
      fcrRate: 95,
    },
    channelMix: { chat: 80, voice: 5, email: 10, social: 5 },
    contacts: 1800,
    aiSummary: 'Queries about wishlist functionality and price drop alerts. Minimal negative sentiment at 4%. Quick resolution with 95% FCR. Enhancement opportunity rather than pain point.',
    suggestedActions: [
      'Improve wishlist sync across devices',
      'Add price drop notification feature',
      'Enable wishlist sharing functionality',
      'Create "back in stock" alerts',
    ],
    sentimentBreakdown: { positive: 65, neutral: 31, negative: 4 },
  },
  {
    id: 'pc-012',
    title: 'Loyalty points enquiry',
    journeyStage: 'Post-Delivery',
    location: 'Pan India',
    impactScore: 32,
    strainScore: 28,
    metrics: {
      dsatPercent: 10,
      negativeSentimentPercent: 8,
      ordersTouched: 2200,
      refundCancelRate: 1,
      backlogTickets: 320,
      repeatContactRate: 7,
      escalationRate: 1.8,
      avgDaysToResolve: 0.8,
      fcrRate: 82,
    },
    channelMix: { chat: 65, voice: 15, email: 15, social: 5 },
    contacts: 2200,
    aiSummary: 'Customers enquiring about SuperCoins balance and redemption. 8% negative sentiment around point expiry concerns. Low strain with good FCR at 82%.',
    suggestedActions: [
      'Add SuperCoins dashboard in account section',
      'Send expiry reminders 7 days before',
      'Simplify redemption flow at checkout',
      'Create points earning explainer',
    ],
    sentimentBreakdown: { positive: 55, neutral: 37, negative: 8 },
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

