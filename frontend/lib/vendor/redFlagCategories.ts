// Red Flag Categories with Actions and Sentiment Data

export interface RedFlagCategory {
  id: string;
  category: string;
  exampleTrigger: string;
  automatedAction: string;
  sentiment: number; // 1-5 scale (1 = Happy, 5 = Frustrated)
  urgency: number; // 0-100%
  occurrences: number;
  trend: 'Rising' | 'Stable' | 'Declining';
  color: string;
}

export interface CategorySentimentData {
  category: string;
  sentiment: number;
  urgency: number;
  occurrences: number;
  trend: 'Rising' | 'Stable' | 'Declining';
  color: string;
  vendors: {
    vendor: string;
    signals: number;
    color: string;
  }[];
}

export const RED_FLAG_CATEGORIES: RedFlagCategory[] = [
  {
    id: 'sanctions',
    category: 'Sanctions',
    exampleTrigger: '"My family in Iran needs..."',
    automatedAction: 'IMMEDIATE HOLD + OFAC Review',
    sentiment: 4.2,
    urgency: 85,
    occurrences: 156,
    trend: 'Rising',
    color: '#ef4444' // Red
  },
  {
    id: 'structuring',
    category: 'Structuring',
    exampleTrigger: '"What\'s the reporting limit?"',
    automatedAction: 'SAR TRIGGER + CTR Enhancement',
    sentiment: 3.8,
    urgency: 72,
    occurrences: 203,
    trend: 'Rising',
    color: '#f97316' // Orange
  },
  {
    id: 'money-mule',
    category: 'Money Mule',
    exampleTrigger: '"Work from home, just transfer what comes in"',
    automatedAction: 'FRAUD ALERT + Account Freeze',
    sentiment: 4.5,
    urgency: 92,
    occurrences: 89,
    trend: 'Rising',
    color: '#eab308' // Yellow
  },
  {
    id: 'scam-victim',
    category: 'Scam Victim',
    exampleTrigger: '"The IRS called and said..."',
    automatedAction: 'TRANSACTION HOLD + Customer Counseling',
    sentiment: 4.8,
    urgency: 88,
    occurrences: 245,
    trend: 'Rising',
    color: '#8b5cf6' // Purple
  },
  {
    id: 'third-party',
    category: 'Third-Party',
    exampleTrigger: '"Sending on behalf of my employer"',
    automatedAction: 'EDD REVIEW + Documentation Request',
    sentiment: 3.2,
    urgency: 55,
    occurrences: 178,
    trend: 'Stable',
    color: '#06b6d4' // Cyan
  }
];

export function getCategorySentimentData(): CategorySentimentData[] {
  return [
    {
      category: 'Sanctions',
      sentiment: 4.2,
      urgency: 85,
      occurrences: 156,
      trend: 'Rising',
      color: '#ef4444',
      vendors: [
        { vendor: 'Omilia', signals: 45, color: '#3B82F6' },
        { vendor: 'LexisNexis', signals: 62, color: '#10B981' },
        { vendor: 'Pindrop', signals: 49, color: '#F97316' }
      ]
    },
    {
      category: 'Structuring',
      sentiment: 3.8,
      urgency: 72,
      occurrences: 203,
      trend: 'Rising',
      color: '#f97316',
      vendors: [
        { vendor: 'Omilia', signals: 78, color: '#3B82F6' },
        { vendor: 'LexisNexis', signals: 35, color: '#10B981' },
        { vendor: 'Pindrop', signals: 90, color: '#F97316' }
      ]
    },
    {
      category: 'Money Mule',
      sentiment: 4.5,
      urgency: 92,
      occurrences: 89,
      trend: 'Rising',
      color: '#eab308',
      vendors: [
        { vendor: 'Omilia', signals: 32, color: '#3B82F6' },
        { vendor: 'LexisNexis', signals: 28, color: '#10B981' },
        { vendor: 'Pindrop', signals: 29, color: '#F97316' }
      ]
    },
    {
      category: 'Scam Victim',
      sentiment: 4.8,
      urgency: 88,
      occurrences: 245,
      trend: 'Rising',
      color: '#8b5cf6',
      vendors: [
        { vendor: 'Omilia', signals: 95, color: '#3B82F6' },
        { vendor: 'LexisNexis', signals: 72, color: '#10B981' },
        { vendor: 'Pindrop', signals: 78, color: '#F97316' }
      ]
    },
    {
      category: 'Third-Party',
      sentiment: 3.2,
      urgency: 55,
      occurrences: 178,
      trend: 'Stable',
      color: '#06b6d4',
      vendors: [
        { vendor: 'Omilia', signals: 68, color: '#3B82F6' },
        { vendor: 'LexisNexis', signals: 55, color: '#10B981' },
        { vendor: 'Pindrop', signals: 55, color: '#F97316' }
      ]
    }
  ];
}

