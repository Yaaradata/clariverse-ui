/**
 * Flipkart X (Twitter) social data – e-commerce only.
 * Re-exports types and non–banking-specific logic from @/lib/social/x,
 * overrides KPIs, virality topics, topic volume split, creators, hashtags,
 * trending posts, response alerts, and compliance dataset with e-commerce copy.
 */

export type {
  Trend,
  XKPI,
  XSentimentPoint,
  XHashtagTrend,
  XConversationCluster,
  XTrendingPost,
  XTopTweet,
  XResponseAlert,
  XCreatorWatch,
  XViralityTopic,
  XFeatureWordCloudEntry,
  XFeatureTopic,
  XFeatureSummary,
  XComplianceFeatureDataset,
  XSentimentAreaPoint,
  XSentimentLevelTimelinePoint,
  XTopicVolumeSplitEntry,
} from '@/lib/social/x';
export {
  X_SENTIMENT_LEVELS,
  type XViralitySentimentLevel,
} from '@/lib/social/x';

import type {
  XKPI,
  XHashtagTrend,
  XConversationCluster,
  XTrendingPost,
  XResponseAlert,
  XCreatorWatch,
  XViralityTopic,
  XComplianceFeatureDataset,
  XSentimentAreaPoint,
  XSentimentLevelTimelinePoint,
  XTopicVolumeSplitEntry,
} from '@/lib/social/x';
import {
  getXSentimentTimeline,
  getXComplianceFeatureAreaData,
  getXSentimentLevelTimeline,
} from '@/lib/social/x';

export function getXKPIs(): XKPI[] {
  return [
    {
      id: 'x-rating',
      label: 'Average Sentiment',
      value: '3.8',
      change: -0.2,
      trend: 'down',
      description: 'Weighted sentiment score (1-5 scale) across shopping and e-commerce mentions',
    },
    {
      id: 'x-replied',
      label: 'Replied vs Not Replied',
      value: '63%',
      change: 5,
      trend: 'down',
      description: '284 mentions need responses – prioritize critical complaints',
    },
    {
      id: 'x-response-time',
      label: 'Average Response Time',
      value: '42m',
      change: -8,
      trend: 'up',
      description: 'Response time within target – maintain playbooks',
    },
    {
      id: 'x-sentiment',
      label: 'Positive vs Negative',
      value: '72.4%',
      change: -1.6,
      trend: 'down',
      description: '189 negative posts need attention – focus on top issues',
    },
  ];
}

export function getXHashtagTrends(): XHashtagTrend[] {
  return [
    {
      hashtag: '#DeliveryDelays',
      growthPercent: 42,
      volume: 1280,
      sentiment: 'negative',
      summary: 'Delivery and shipment delay complaints trending across metro cities.',
    },
    {
      hashtag: '#GreatDeals',
      growthPercent: 31,
      volume: 940,
      sentiment: 'positive',
      summary: 'Shoppers sharing sale hauls and product recommendations.',
    },
    {
      hashtag: '#RefundIssues',
      growthPercent: 18,
      volume: 760,
      sentiment: 'negative',
      summary: 'Customers venting about refund and return processing delays.',
    },
    {
      hashtag: '#FlipkartApp',
      growthPercent: 12,
      volume: 620,
      sentiment: 'neutral',
      summary: 'App updates and feature requests around cart and checkout.',
    },
  ];
}

export function getXConversationClusters(): XConversationCluster[] {
  return [
    {
      topic: 'Delivery reliability',
      share: 28,
      growth: 9,
      summary: 'Delivery and ETA chatter concentrated on metro and tier-2 cities.',
    },
    {
      topic: 'Returns and refunds',
      share: 18,
      growth: -4,
      summary: 'Return pickup and refund timelines compared with other marketplaces.',
    },
    {
      topic: 'Payment and checkout',
      share: 22,
      growth: 6,
      summary: 'COD and payment failure issues driving support conversations.',
    },
    {
      topic: 'Deals and recommendations',
      share: 14,
      growth: 11,
      summary: 'Positive momentum around sale events and product discovery.',
    },
  ];
}

export function getXTrendingPosts(): XTrendingPost[] {
  return [
    {
      id: 'tweet-1',
      author: 'Priya S',
      handle: '@priyashops',
      verified: true,
      text: 'Day 3 waiting on my order from Flipkart. Tracking stuck at "Out for delivery". Anyone else? #DeliveryDelays',
      impressions: 1_800_000,
      likes: 12400,
      reposts: 3800,
      sentiment: 'negative',
      postedAt: '2h ago',
    },
    {
      id: 'tweet-2',
      author: 'Deal Hunter',
      handle: '@dealhunter_in',
      verified: false,
      text: 'Big Basket sale haul – prices were insane. Flipkart next? 🛒 #GreatDeals',
      impressions: 920000,
      likes: 8800,
      reposts: 2100,
      sentiment: 'positive',
      postedAt: '5h ago',
    },
    {
      id: 'tweet-3',
      author: 'Support Voices',
      handle: '@supportvoices',
      verified: false,
      text: 'Refund pending for 10 days. No response from support. Escalating. #RefundIssues',
      impressions: 640000,
      likes: 5200,
      reposts: 1700,
      sentiment: 'negative',
      postedAt: '8h ago',
    },
  ];
}

export function getXResponseAlerts(): XResponseAlert[] {
  return [
    {
      id: 'resp-1',
      topic: 'Delivery delay',
      urgency: 'critical',
      summary: 'Verified shopping influencer detailing delayed deliveries and missing ETA updates.',
      recommendedAction: 'Publish holding statement within 30 minutes and DM with ops timeline.',
      impactedHandles: 46,
      firstDetected: 'Today · 08:15 IST',
      author: 'Shop Talk India',
      handle: '@shoptalkin',
      verified: true,
      starRating: 2,
      sentimentLevel: 5,
      viralityScore: 612,
      trending: 'Yes',
      likes: 6300,
      reposts: 2100,
      impressions: 1240000,
    },
    {
      id: 'resp-2',
      topic: 'Refund delays',
      urgency: 'high',
      summary: 'Customers flagging refund and return pickup delays after policy update.',
      recommendedAction: 'Ship status explainer thread + DM top handles with timeline.',
      impactedHandles: 31,
      firstDetected: 'Today · 09:40 IST',
      author: 'Support Voices',
      handle: '@supportvoices',
      verified: false,
      starRating: 1,
      sentimentLevel: 4,
      viralityScore: 488,
      trending: 'Yes',
      likes: 5200,
      reposts: 1700,
      impressions: 640000,
    },
    {
      id: 'resp-3',
      topic: 'Return pickup backlash',
      urgency: 'high',
      summary: 'Customers comparing return pickup SLAs and calling out missed slots.',
      recommendedAction: 'Post pickup roadmap + direct traffic to self-service reschedule.',
      impactedHandles: 24,
      firstDetected: 'Today · 07:55 IST',
      author: 'Consumer Watch',
      handle: '@consumerwatch_in',
      verified: false,
      starRating: 2,
      sentimentLevel: 4,
      viralityScore: 352,
      trending: 'No',
      likes: 3700,
      reposts: 950,
      impressions: 520000,
    },
    {
      id: 'resp-4',
      topic: 'Payment failure transparency',
      urgency: 'medium',
      summary: 'Shoppers asking for clearer payment failure reasons and retry guidance.',
      recommendedAction: 'Coordinate with payments + publish thread linking help centre.',
      impactedHandles: 18,
      firstDetected: 'Yesterday · 19:30 IST',
      author: 'Ecom Pulse',
      handle: '@ecompulse',
      verified: false,
      starRating: 3,
      sentimentLevel: 3,
      viralityScore: 241,
      trending: 'No',
      likes: 2100,
      reposts: 480,
      impressions: 310000,
    },
    {
      id: 'resp-5',
      topic: 'App release feedback',
      urgency: 'medium',
      summary: 'Beta users posting crash clips and requesting patch timeline.',
      recommendedAction: 'Acknowledge bugs, share ticket ID, and pin status updates.',
      impactedHandles: 21,
      firstDetected: 'Today · 06:05 IST',
      author: 'App Beta Watch',
      handle: '@AppBetaWatch',
      verified: false,
      starRating: 3,
      sentimentLevel: 3,
      viralityScore: 198,
      trending: 'No',
      likes: 1800,
      reposts: 520,
      impressions: 286000,
    },
  ];
}

export function getXCreatorWatchlist(): XCreatorWatch[] {
  return [
    {
      id: 'creator-1',
      name: 'Consumer Watch',
      handle: '@consumerwatch_in',
      followers: 128000,
      avgEngagement: 5.6,
      sentiment: 'critic',
      lastPost: 'Thread comparing return and refund experiences across marketplaces.',
      watchStatus: 'engage',
    },
    {
      id: 'creator-2',
      name: 'Deal Hunter',
      handle: '@dealhunter_in',
      followers: 98000,
      avgEngagement: 7.1,
      sentiment: 'ally',
      lastPost: 'Live unboxing and first impressions of latest sale picks.',
      watchStatus: 'sustain',
    },
    {
      id: 'creator-3',
      name: 'Ecom Pulse',
      handle: '@ecompulse',
      followers: 156000,
      avgEngagement: 4.3,
      sentiment: 'critic',
      lastPost: 'Tweetstorm about delivery and logistics transparency.',
      watchStatus: 'monitor',
    },
  ];
}

const X_TOPIC_VOLUME_SPLIT: XTopicVolumeSplitEntry[] = [
  { name: 'Delivery & ETA', volume: 52, sentiment: 'negative' },
  { name: 'Refund & Return', volume: 49, sentiment: 'negative' },
  { name: 'Payment Failed', volume: 47, sentiment: 'negative' },
  { name: 'Product Quality', volume: 43, sentiment: 'positive' },
  { name: 'Same-Day Delivery', volume: 41, sentiment: 'positive' },
  { name: 'Seller Disputes', volume: 39, sentiment: 'negative' },
  { name: 'Sale & Coupons', volume: 37, sentiment: 'positive' },
  { name: 'Return Pickup', volume: 35, sentiment: 'negative' },
  { name: 'App Experience', volume: 33, sentiment: 'positive' },
  { name: 'Replace Order', volume: 32, sentiment: 'negative' },
  { name: 'Order Tracking', volume: 31, sentiment: 'positive' },
  { name: 'Pricing & Offers', volume: 30, sentiment: 'positive' },
  { name: 'Account & Login', volume: 29, sentiment: 'negative' },
  { name: 'Cancellation', volume: 28, sentiment: 'negative' },
  { name: 'Recommendations', volume: 27, sentiment: 'positive' },
  { name: 'Wishlist & Cart', volume: 26, sentiment: 'positive' },
  { name: 'COD Issues', volume: 25, sentiment: 'negative' },
  { name: 'Grocery & Fresh', volume: 24, sentiment: 'positive' },
  { name: 'Support Response', volume: 23, sentiment: 'negative' },
  { name: 'Unboxing & Reviews', volume: 22, sentiment: 'positive' },
];

export function getXTopicVolumeSplit(): XTopicVolumeSplitEntry[] {
  return X_TOPIC_VOLUME_SPLIT;
}

export function getXViralityTopics(): XViralityTopic[] {
  return [
    { name: 'Mobile App Crashes', viralityScore: 512, views: 1_820_000, likes: 28_400, level1: 4, level2: 9, level3: 18, level4: 31, level5: 38 },
    { name: 'Delivery Delays', viralityScore: 486, views: 1_540_000, likes: 25_100, level1: 6, level2: 12, level3: 24, level4: 26, level5: 32 },
    { name: 'Refund Not Processed', viralityScore: 434, views: 1_180_000, likes: 21_200, level1: 5, level2: 11, level3: 22, level4: 28, level5: 34 },
    { name: 'Return Pickup Backlog', viralityScore: 371, views: 920_000, likes: 17_400, level1: 8, level2: 14, level3: 26, level4: 24, level5: 28 },
    { name: 'Payment Failed at Checkout', viralityScore: 298, views: 760_000, likes: 13_800, level1: 10, level2: 19, level3: 31, level4: 22, level5: 18 },
    { name: 'Seller Dispute', viralityScore: 276, views: 684_000, likes: 12_900, level1: 12, level2: 18, level3: 28, level4: 24, level5: 18 },
    { name: 'Sale & Deals Momentum', viralityScore: 232, views: 548_000, likes: 10_400, level1: 32, level2: 26, level3: 22, level4: 13, level5: 7 },
    { name: 'Order Tracking Shoutouts', viralityScore: 208, views: 482_000, likes: 9_400, level1: 36, level2: 28, level3: 18, level4: 12, level5: 6 },
    { name: 'Product Quality Praise', viralityScore: 196, views: 438_000, likes: 8_800, level1: 44, level2: 24, level3: 18, level4: 9, level5: 5 },
    { name: 'Account & Login Issues', viralityScore: 182, views: 396_000, likes: 7_600, level1: 14, level2: 22, level3: 29, level4: 20, level5: 15 },
  ];
}

export function getXComplianceFeatureDataset(): XComplianceFeatureDataset {
  return {
    summaries: [
      {
        key: 'compliance',
        label: 'Concern Hotspots',
        totalTopics: 3,
        totalPosts: 1_680,
        totalHelpfulVotes: 460,
        dominantSentiment: { key: 'level5', label: 'Frustrated' },
        topics: [
          { name: 'Delivery and ETA delays', totalPosts: 620, helpfulVotes: 180, dominantSentiment: { key: 'level5', label: 'Frustrated', value: 54 } },
          { name: 'Refund and return delays', totalPosts: 540, helpfulVotes: 160, dominantSentiment: { key: 'level4', label: 'Anger', value: 42 } },
          { name: 'Return pickup backlog', totalPosts: 520, helpfulVotes: 120, dominantSentiment: { key: 'level4', label: 'Anger', value: 36 } },
        ],
      },
      {
        key: 'feature',
        label: 'Feature Requests & Enhancements',
        totalTopics: 3,
        totalPosts: 1_120,
        totalHelpfulVotes: 320,
        dominantSentiment: { key: 'level2', label: 'Bit Irritated' },
        topics: [
          {
            name: 'Smarter order tracking',
            totalPosts: 380,
            helpfulVotes: 110,
            dominantSentiment: { key: 'level2', label: 'Bit Irritated', value: 41 },
            wordCloud: [
              { term: 'ETA accuracy', weight: 10 },
              { term: 'SMS alerts', weight: 9 },
              { term: 'delivery slot', weight: 8 },
              { term: 'tracking link', weight: 7 },
            ],
          },
          {
            name: 'Return and refund status',
            totalPosts: 360,
            helpfulVotes: 102,
            dominantSentiment: { key: 'level3', label: 'Moderately Concerned', value: 38 },
            wordCloud: [
              { term: 'pickup schedule', weight: 9 },
              { term: 'refund ETA', weight: 8 },
              { term: 'return label', weight: 7 },
              { term: 'exchange', weight: 6 },
            ],
          },
          {
            name: 'Wishlist and cart sync',
            totalPosts: 380,
            helpfulVotes: 108,
            dominantSentiment: { key: 'level1', label: 'Happy', value: 46 },
            wordCloud: [
              { term: 'price drop alert', weight: 9 },
              { term: 'back in stock', weight: 8 },
              { term: 'cart save', weight: 7 },
              { term: 'multi-device', weight: 6 },
            ],
          },
        ],
      },
      {
        key: 'appreciation',
        label: 'Customer Appreciation Highlights',
        totalTopics: 3,
        totalPosts: 880,
        totalHelpfulVotes: 292,
        dominantSentiment: { key: 'level1', label: 'Supportive' },
        topics: [
          {
            name: 'Quick support resolution',
            totalPosts: 310,
            helpfulVotes: 108,
            dominantSentiment: { key: 'level1', label: 'Supportive', value: 52 },
            wordCloud: [
              { term: 'chat support', weight: 10 },
              { term: 'callback', weight: 9 },
              { term: 'thank you', weight: 8 },
            ],
          },
          {
            name: 'Sale and delivery wins',
            totalPosts: 284,
            helpfulVotes: 94,
            dominantSentiment: { key: 'level1', label: 'Supportive', value: 48 },
            wordCloud: [
              { term: 'on time delivery', weight: 9 },
              { term: 'packaging', weight: 8 },
              { term: 'deal of the day', weight: 7 },
            ],
          },
          {
            name: 'App and UX praise',
            totalPosts: 286,
            helpfulVotes: 90,
            dominantSentiment: { key: 'level2', label: 'Curious', value: 36 },
            wordCloud: [
              { term: 'easy checkout', weight: 8 },
              { term: 'smooth app', weight: 8 },
              { term: 'dark mode', weight: 7 },
            ],
          },
        ],
      },
    ],
  };
}

export {
  getXSentimentTimeline,
  getXComplianceFeatureAreaData,
  getXSentimentLevelTimeline,
};
