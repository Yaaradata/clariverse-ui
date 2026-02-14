/**
 * Flipkart Reddit social data – e-commerce only.
 * Re-exports types and non–banking-specific logic from @/lib/social/reddit,
 * overrides KPIs, community signals, moderation alerts, influencers, virality topics,
 * topic volume split, and compliance dataset with e-commerce copy.
 */

export type {
  RedditTrendDirection,
  RedditKPI,
  RedditSentimentBreakdown,
  RedditMomentumType,
  RedditTrendingThread,
  RedditCommunitySignal,
  RedditModerationAlert,
  RedditInfluencer,
  RedditViralityTopic,
  RedditComplianceFeatureTopic,
  RedditComplianceFeatureSummary,
  RedditComplianceFeatureDataset,
  RedditSentimentAreaPoint,
  RedditSentimentLevelTimelinePoint,
  RedditTopicVolumeSplitEntry,
} from '@/lib/social/reddit';
export {
  REDDIT_SENTIMENT_LEVELS,
  type RedditSentimentLevelKey,
} from '@/lib/social/reddit';

import type {
  RedditKPI,
  RedditSentimentBreakdown,
  RedditCommunitySignal,
  RedditModerationAlert,
  RedditInfluencer,
  RedditViralityTopic,
  RedditComplianceFeatureDataset,
  RedditSentimentAreaPoint,
  RedditSentimentLevelTimelinePoint,
  RedditTopicVolumeSplitEntry,
} from '@/lib/social/reddit';
import {
  getRedditComplianceFeatureAreaData,
  getRedditSentimentLevelTimeline,
} from '@/lib/social/reddit';

export function getRedditKPIs(): RedditKPI[] {
  return [
    {
      id: 'reddit-rating',
      label: 'Average Sentiment',
      value: '4.1',
      change: 0.3,
      trend: 'up',
      description: 'Weighted sentiment score (1-5 scale) across shopping and e-commerce subreddits',
    },
    {
      id: 'reddit-replied',
      label: 'Replied vs Not Replied',
      value: '71%',
      change: 9,
      trend: 'up',
      description: '156 threads need responses – prioritize high-upvote posts',
    },
    {
      id: 'reddit-response-time',
      label: 'Average Response Time',
      value: '2.4h',
      change: -0.6,
      trend: 'up',
      description: 'Response time within target – maintain playbooks',
    },
    {
      id: 'reddit-sentiment',
      label: 'Positive vs Negative',
      value: '78.6%',
      change: 3.1,
      trend: 'up',
      description: '94 negative threads need attention – focus on top issues',
    },
  ];
}

export function getRedditSentimentBreakdown(): RedditSentimentBreakdown[] {
  return [
    { topic: 'Delivery delays', positive: 22, neutral: 18, negative: 60, change: -7 },
    { topic: 'Returns and refunds', positive: 35, neutral: 24, negative: 41, change: 5 },
    { topic: 'Mobile app crashes', positive: 14, neutral: 20, negative: 66, change: -3 },
    { topic: 'Sale and deals', positive: 62, neutral: 28, negative: 10, change: 11 },
    { topic: 'Payment and checkout', positive: 18, neutral: 32, negative: 50, change: -2 },
  ];
}

export function getRedditCommunitySignals(): RedditCommunitySignal[] {
  return [
    {
      subreddit: 'r/IndianShopping',
      signalLabel: 'Trustpilot spillover',
      momentumType: 'risk',
      growthPercent: 31,
      trend: 'up',
      change: 8,
      threadVolume: 186,
      insight: 'Cross-platform amplification of negative Trustpilot reviews into shopping subreddits.',
      topMentions: ['trustpilot', 'delivery', 'customer-care'],
    },
    {
      subreddit: 'r/Flipkart',
      signalLabel: 'E-commerce chatter',
      momentumType: 'neutral',
      growthPercent: 19,
      trend: 'flat',
      change: 0,
      threadVolume: 142,
      insight: 'Stable volume around deals, delivery, and returns discussions.',
      topMentions: ['sale', 'delivery', 'refund'],
    },
    {
      subreddit: 'r/IndiaEcommerce',
      signalLabel: 'CX advocacy',
      momentumType: 'advocacy',
      growthPercent: 27,
      trend: 'up',
      change: 6,
      threadVolume: 96,
      insight: 'Positive stories about quick resolution and delivery driving advocacy.',
      topMentions: ['support', 'delivery', 'app'],
    },
    {
      subreddit: 'r/OnlineShopping',
      signalLabel: 'Fraud and scams',
      momentumType: 'risk',
      growthPercent: 12,
      trend: 'down',
      change: -4,
      threadVolume: 58,
      insight: 'Reduction in phishing and scam complaints after awareness posts.',
      topMentions: ['phishing', 'scam', 'verified'],
    },
  ];
}

export function getRedditModerationAlerts(): RedditModerationAlert[] {
  return [
    {
      id: 'alert-1',
      topic: 'Refund and return delay AMA',
      type: 'compliance',
      severity: 'high',
      author: 'Flipkart Support',
      handle: 'u/FlipkartOps',
      verified: true,
      detectedAt: 'Today',
      firstDetected: '08:40 IST',
      impactedCommunities: 7,
      impressions: 94000,
      upvotes: 5200,
      comments: 860,
      trending: 'yes',
      responseWindow: 'Respond within 12h',
      summary: 'High traction AMA on refund and return SLAs versus policy.',
      recommendedAction: 'Coordinate with ops & publish refund status explainer within 12 hours.',
      flaggedCount: 37,
    },
    {
      id: 'alert-2',
      topic: 'Suspicious discount DM campaign',
      type: 'fraud',
      severity: 'critical',
      author: 'Ecom Watch',
      handle: 'u/ecomwatch',
      verified: false,
      detectedAt: 'Today',
      firstDetected: '07:55 IST',
      impactedCommunities: 5,
      impressions: 128000,
      upvotes: 7800,
      comments: 1360,
      trending: 'yes',
      responseWindow: 'Immediate response required',
      summary: 'Users receiving phishing DMs impersonating Flipkart support.',
      recommendedAction: 'Push warning sticky across r/Flipkart and alert fraud response.',
      flaggedCount: 22,
    },
    {
      id: 'alert-3',
      topic: 'Return pickup backlog',
      type: 'support',
      severity: 'medium',
      author: 'Customer Care',
      handle: 'u/FlipkartCare',
      verified: false,
      detectedAt: 'Yesterday',
      firstDetected: '19:20 IST',
      impactedCommunities: 3,
      impressions: 41000,
      upvotes: 2100,
      comments: 540,
      trending: 'no',
      responseWindow: 'Respond within 24h',
      summary: 'Customers complaining about return pickup wait times and reschedule slots.',
      recommendedAction: 'Escalate to CX ops; provide reschedule link & moderator update.',
      flaggedCount: 18,
    },
    {
      id: 'alert-4',
      topic: 'Payment failed at checkout megathread',
      type: 'support',
      severity: 'high',
      author: 'Shopper Voices',
      handle: 'u/shoppervoices',
      verified: true,
      detectedAt: 'Today',
      firstDetected: '09:05 IST',
      impactedCommunities: 6,
      impressions: 76000,
      upvotes: 4600,
      comments: 980,
      trending: 'yes',
      responseWindow: 'Respond within 8h',
      summary: 'Shoppers reporting repeated payment failures and COD issues after app update.',
      recommendedAction: 'Issue product update comment, collect payment method logs, share status.',
      flaggedCount: 29,
    },
    {
      id: 'alert-5',
      topic: 'Delivery ETA accuracy discussion',
      type: 'compliance',
      severity: 'medium',
      author: 'Logistics Ops',
      handle: 'u/FlipkartLogistics',
      verified: false,
      detectedAt: 'Today',
      firstDetected: '06:45 IST',
      impactedCommunities: 4,
      impressions: 52000,
      upvotes: 3100,
      comments: 720,
      trending: 'no',
      responseWindow: 'Respond within 18h',
      summary: 'Thread questioning delivery ETA accuracy and slot changes.',
      recommendedAction: 'Provide policy clarification with regional timelines and escalate to comms.',
      flaggedCount: 16,
    },
  ];
}

export function getRedditInfluencers(): RedditInfluencer[] {
  return [
    {
      id: 'infl-1',
      username: 'ShopIndia',
      karma: 58200,
      followers: 4200,
      sentiment: 'advocate',
      lastPostSummary: 'Shared positive walkthrough of same-day delivery and easy returns.',
      engagementRate: 4.2,
      watchlist: false,
    },
    {
      id: 'infl-2',
      username: 'SupportSkeptic',
      karma: 31210,
      followers: 1900,
      sentiment: 'detractor',
      lastPostSummary: 'Highlighting refund delay and support response time issues.',
      engagementRate: 5.8,
      watchlist: true,
    },
    {
      id: 'infl-3',
      username: 'DealHunter',
      karma: 22110,
      followers: 2500,
      sentiment: 'advocate',
      lastPostSummary: 'Promoting sale hauls and price drop alerts.',
      engagementRate: 3.9,
      watchlist: false,
    },
  ];
}

export function getRedditViralityTopics(): RedditViralityTopic[] {
  return [
    { name: 'Delivery delays', viralityScore: 512, highImpactThreads: 186, level1: 6, level2: 12, level3: 28, level4: 32, level5: 22 },
    { name: 'Return pickup backlog', viralityScore: 468, highImpactThreads: 154, level1: 8, level2: 15, level3: 26, level4: 29, level5: 22 },
    { name: 'Refund delay friction', viralityScore: 437, highImpactThreads: 132, level1: 5, level2: 11, level3: 24, level4: 31, level5: 29 },
    { name: 'Sale success stories', viralityScore: 372, highImpactThreads: 118, level1: 34, level2: 28, level3: 22, level4: 10, level5: 6 },
    { name: 'Mobile app stability', viralityScore: 341, highImpactThreads: 104, level1: 12, level2: 21, level3: 30, level4: 24, level5: 13 },
    { name: 'Seller dispute queues', viralityScore: 296, highImpactThreads: 97, level1: 10, level2: 19, level3: 27, level4: 25, level5: 19 },
    { name: 'Payment and COD transparency', viralityScore: 284, highImpactThreads: 91, level1: 9, level2: 18, level3: 25, level4: 26, level5: 22 },
    { name: 'Deals and coupons', viralityScore: 244, highImpactThreads: 78, level1: 31, level2: 26, level3: 23, level4: 12, level5: 8 },
    { name: 'App bug reports', viralityScore: 218, highImpactThreads: 72, level1: 14, level2: 20, level3: 29, level4: 22, level5: 15 },
    { name: 'Order tracking tips', viralityScore: 198, highImpactThreads: 65, level1: 37, level2: 29, level3: 21, level4: 9, level5: 4 },
  ];
}

const REDDIT_TOPIC_VOLUME_SPLIT: RedditTopicVolumeSplitEntry[] = [
  { name: 'Delivery & ETA', volume: 46, sentiment: 'negative' },
  { name: 'Refund & Return', volume: 42, sentiment: 'negative' },
  { name: 'Return Pickup', volume: 37, sentiment: 'negative' },
  { name: 'Product Quality', volume: 32, sentiment: 'positive' },
  { name: 'App Bug Reports', volume: 30, sentiment: 'negative' },
  { name: 'Same-Day Delivery', volume: 28, sentiment: 'positive' },
  { name: 'Cancellation', volume: 27, sentiment: 'negative' },
  { name: 'Sale & Coupons', volume: 25, sentiment: 'positive' },
  { name: 'Pricing & Offers', volume: 24, sentiment: 'positive' },
  { name: 'Replace Order', volume: 23, sentiment: 'negative' },
  { name: 'Seller Disputes', volume: 22, sentiment: 'negative' },
  { name: 'Order Tracking', volume: 21, sentiment: 'positive' },
  { name: 'Payment Failed', volume: 20, sentiment: 'negative' },
  { name: 'Recommendations', volume: 19, sentiment: 'positive' },
  { name: 'Account & Login', volume: 18, sentiment: 'negative' },
  { name: 'App Experience', volume: 17, sentiment: 'positive' },
  { name: 'Support Response', volume: 16, sentiment: 'negative' },
  { name: 'COD Issues', volume: 15, sentiment: 'negative' },
  { name: 'Unboxing & Reviews', volume: 14, sentiment: 'positive' },
  { name: 'Wishlist & Cart', volume: 13, sentiment: 'negative' },
];

export function getRedditTopicVolumeSplit(): RedditTopicVolumeSplitEntry[] {
  return REDDIT_TOPIC_VOLUME_SPLIT;
}

export function getRedditComplianceFeatureDataset(): RedditComplianceFeatureDataset {
  return {
    summaries: [
      {
        key: 'moderation',
        label: 'Moderation Hotspots',
        totalTopics: 3,
        totalThreads: 1_420,
        totalHelpfulVotes: 408,
        dominantSentiment: 'level5',
        topics: [
          { name: 'Refund and return delay AMA', totalThreads: 520, helpfulVotes: 152, dominantSentiment: 'level5' },
          { name: 'Payment and checkout fatigue', totalThreads: 470, helpfulVotes: 138, dominantSentiment: 'level4' },
          { name: 'Return pickup wait times', totalThreads: 430, helpfulVotes: 118, dominantSentiment: 'level4' },
        ],
      },
      {
        key: 'feature',
        label: 'Feature Requests & Enhancements',
        totalTopics: 3,
        totalThreads: 1_060,
        totalHelpfulVotes: 346,
        dominantSentiment: 'level2',
        topics: [
          {
            name: 'Order tracking and ETA',
            totalThreads: 360,
            helpfulVotes: 118,
            dominantSentiment: 'level2',
            wordCloud: [
              { term: 'tracking', weight: 10 },
              { term: 'ETA', weight: 9 },
              { term: 'SMS alert', weight: 8 },
            ],
          },
          {
            name: 'Return and refund status',
            totalThreads: 340,
            helpfulVotes: 112,
            dominantSentiment: 'level3',
            wordCloud: [
              { term: 'pickup', weight: 9 },
              { term: 'refund status', weight: 8 },
              { term: 'reschedule', weight: 7 },
            ],
          },
          {
            name: 'Wishlist and price alerts',
            totalThreads: 360,
            helpfulVotes: 116,
            dominantSentiment: 'level1',
            wordCloud: [
              { term: 'price drop', weight: 9 },
              { term: 'back in stock', weight: 8 },
              { term: 'wishlist', weight: 7 },
            ],
          },
        ],
      },
      {
        key: 'appreciation',
        label: 'Community Appreciation Highlights',
        totalTopics: 3,
        totalThreads: 820,
        totalHelpfulVotes: 284,
        dominantSentiment: 'level1',
        topics: [
          {
            name: 'Delivery and support wins',
            totalThreads: 290,
            helpfulVotes: 102,
            dominantSentiment: 'level1',
            wordCloud: [
              { term: 'on time', weight: 10 },
              { term: 'quick resolve', weight: 9 },
              { term: 'thank you', weight: 8 },
            ],
          },
          {
            name: 'Support hero shout-outs',
            totalThreads: 268,
            helpfulVotes: 96,
            dominantSentiment: 'level1',
            wordCloud: [
              { term: 'overnight fix', weight: 9 },
              { term: 'proactive dm', weight: 8 },
              { term: 'thank you thread', weight: 7 },
            ],
          },
          {
            name: 'Sale and deals impact',
            totalThreads: 262,
            helpfulVotes: 86,
            dominantSentiment: 'level2',
            wordCloud: [
              { term: 'big billion', weight: 9 },
              { term: 'deal', weight: 8 },
              { term: 'haul', weight: 7 },
            ],
          },
        ],
      },
    ],
  };
}

export {
  getRedditComplianceFeatureAreaData,
  getRedditSentimentLevelTimeline,
};
