import { PainHealthData } from './types';

export const painHealthData: PainHealthData = {
  customerPainIndex: {
    score: 72,
    label: 'High',
    trend: 5,
    trendDirection: 'up',
    components: {
      csat: 3.2,
      negativeSentiment: 28,
      repeatContactRate: 12,
      escalationRate: 8.5,
      avgDaysToResolve: 2.7,
    },
  },
  painVolume: {
    percentage: 18,
    totalCases: 6421,
    sparklineData: [12, 14, 13, 16, 15, 18, 17, 19, 18, 20, 18, 17],
    breakdown: {
      deliveryPromiseBroken: 2840,
      refundDelay: 1605,
      wrongDamagedItem: 1284,
      returnReplacementFriction: 692,
    },
  },
  severePainIncidents: {
    totalCases: 348,
    breakdown: [
      { category: 'Refund Delay', percentage: 42, count: 146 },
      { category: 'Delivery Mess', percentage: 36, count: 125 },
      { category: 'Account Issues', percentage: 22, count: 77 },
    ],
    criteria: [
      'Escalated + Negative Sentiment',
      'Repeat Contacts ≥3 for same order',
      'Social escalation mentioned (Twitter/X/social media)',
    ],
  },
  repeatContactRate: {
    percentage: 12,
    trend: 3,
    trendDirection: 'up',
    trendlineData: [8, 9, 8.5, 10, 9.5, 11, 10.5, 12, 11.5, 12],
    ordersAffected: 4287,
  },
  timeInPain: {
    avgDays: 2.7,
    trend: 0.3,
    trendDirection: 'up',
    buckets: [
      { label: '<1 day', count: 2145, percentage: 28, isHighlighted: false },
      { label: '1-2 days', count: 2680, percentage: 35, isHighlighted: false },
      { label: '2-5 days', count: 1985, percentage: 26, isHighlighted: false },
      { label: '>5 days', count: 842, percentage: 11, isHighlighted: true },
    ],
  },
  lastUpdated: new Date().toISOString(),
};

// Helper functions
export const getPainLevelColor = (score: number): { bg: string; text: string; glow: string } => {
  if (score >= 75) return { bg: '#ef4444', text: '#FFFFFF', glow: 'rgba(239, 68, 68, 0.4)' };
  if (score >= 50) return { bg: '#f97316', text: '#FFFFFF', glow: 'rgba(249, 115, 22, 0.4)' };
  if (score >= 25) return { bg: '#eab308', text: '#000000', glow: 'rgba(234, 179, 8, 0.4)' };
  return { bg: '#22c55e', text: '#FFFFFF', glow: 'rgba(34, 197, 94, 0.4)' };
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

