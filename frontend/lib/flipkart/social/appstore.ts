/**
 * Flipkart App Store – e-commerce review data only.
 * Same API as @/lib/social/appstore; topics and alerts are order/delivery/returns/product focused.
 */

export type {
  AppStoreKPI,
  AppStoreViralityTopic,
  AppStoreReviewAlert,
  AppStoreModerationDataset,
  AppStoreModerationAreaPoint,
  AppStoreSentimentLevelTimelinePoint,
  AppStoreTopicVolumeSplitEntry,
  AppStoreSentimentLevelKey,
  AppStoreReviewTrendTopic,
} from "@/lib/social/appstore";

export {
  APPSTORE_SENTIMENT_LEVELS,
  APPSTORE_RATING_LEVELS,
} from "@/lib/social/appstore";

import type {
  AppStoreKPI,
  AppStoreViralityTopic,
  AppStoreReviewAlert,
  AppStoreModerationDataset,
  AppStoreModerationAreaPoint,
  AppStoreSentimentLevelTimelinePoint,
  AppStoreTopicVolumeSplitEntry,
  AppStoreSentimentLevelKey,
  AppStoreReviewTrendTopic,
} from "@/lib/social/appstore";

export function getAppStoreKPIs(): AppStoreKPI[] {
  return [
    {
      id: "appstore-rating",
      label: "Average Rating",
      value: "4.6",
      change: 0.2,
      trend: "up",
      description: "Rolling 30-day average rating for shopping app experience",
    },
    {
      id: "appstore-replied",
      label: "Replied vs Not Replied",
      value: "68%",
      change: 5,
      trend: "down",
      description: "142 reviews need responses – prioritize negative reviews.",
    },
    {
      id: "appstore-response-time",
      label: "Avg Response Time",
      value: "3.8h",
      change: -0.4,
      trend: "down",
      description: "Response time within target – maintain playbooks.",
    },
    {
      id: "appstore-negative",
      label: "Negative Reviews",
      value: "84.2%",
      change: 2.1,
      trend: "up",
      description: "67 negative reviews need attention – focus on top issues.",
    },
  ];
}

export function getAppStoreViralityTopics(): AppStoreViralityTopic[] {
  return [
    { name: "Order tracking reliability", reviewVolume: 192, star1: 12, star2: 22, star3: 28, star4: 58, star5: 72, helpfulVotes: 12_400 },
    { name: "Delivery delay frustration", reviewVolume: 168, star1: 44, star2: 38, star3: 32, star4: 28, star5: 26, helpfulVotes: 10_950 },
    { name: "Return and refund experience", reviewVolume: 154, star1: 36, star2: 34, star3: 30, star4: 28, star5: 26, helpfulVotes: 9_780 },
    { name: "Product quality vs description", reviewVolume: 142, star1: 32, star2: 30, star3: 28, star4: 26, star5: 26, helpfulVotes: 8_620 },
    { name: "Checkout and payment flow", reviewVolume: 128, star1: 18, star2: 26, star3: 30, star4: 28, star5: 26, helpfulVotes: 7_540 },
    { name: "Wishlist and cart sync", reviewVolume: 118, star1: 10, star2: 20, star3: 28, star4: 30, star5: 30, helpfulVotes: 6_880 },
    { name: "Search and discovery", reviewVolume: 108, star1: 8, star2: 16, star3: 26, star4: 28, star5: 30, helpfulVotes: 5_420 },
    { name: "Seller ratings and trust", reviewVolume: 98, star1: 24, star2: 26, star3: 22, star4: 14, star5: 12, helpfulVotes: 4_760 },
    { name: "Deals and offers visibility", reviewVolume: 92, star1: 6, star2: 12, star3: 22, star4: 26, star5: 26, helpfulVotes: 4_120 },
    { name: "App performance and crashes", reviewVolume: 84, star1: 22, star2: 24, star3: 20, star4: 10, star5: 8, helpfulVotes: 3_560 },
  ];
}

export function getAppStoreReviewAlerts(): AppStoreReviewAlert[] {
  return [
    {
      id: "appstore-fk-alert-1",
      title: "Refund not received after return",
      category: "payments",
      rating: 2,
      sentimentTag: "critical",
      summary: "Customers report refund pending for 2+ weeks after return pickup; payment team escalation needed.",
      recommendedAction: "Audit refund pipeline, expedite stuck refunds, and add in-app refund status; respond to App Store with ETA.",
      reviewSnippet: "Return was accepted 12 days ago but money not credited. Support says wait 7 more days.",
      deviceContext: "iPhone 15 Pro · iOS 17.3",
      iosVersion: "iOS 17.3",
      reviewCount: 46,
    },
    {
      id: "appstore-fk-alert-2",
      title: "Order tracking not updating",
      category: "performance",
      rating: 3,
      sentimentTag: "high",
      summary: "Tracking status stuck after dispatch; users unable to see delivery progress.",
      recommendedAction: "Fix tracking API and push in-app banner for affected orders; update App Store response template.",
      reviewSnippet: "Tracking never moved from 'Shipped'. Had to call to know it was out for delivery.",
      deviceContext: "iPhone 14 · Always-on display",
      iosVersion: "iOS 17.2",
      reviewCount: 31,
    },
    {
      id: "appstore-fk-alert-3",
      title: "Wrong item delivered",
      category: "security",
      rating: 2,
      sentimentTag: "medium",
      summary: "Multiple reports of wrong product or size; replacement flow unclear.",
      recommendedAction: "Tighten warehouse QC; improve replacement flow and in-app messaging.",
      reviewSnippet: "Received different size. Replacement option was confusing. Took 4 days to get resolution.",
      deviceContext: "iPad Air · iPadOS 17.1",
      iosVersion: "iPadOS 17.1",
      reviewCount: 24,
    },
    {
      id: "appstore-fk-alert-4",
      title: "Quick delivery and packaging",
      category: "accessibility",
      rating: 5,
      sentimentTag: "medium",
      summary: "Users praise next-day delivery and packaging in metro cities.",
      recommendedAction: "Amplify in App Store listing and social proof.",
      reviewSnippet: "Super fast delivery, well packed. Will order again.",
      deviceContext: "iPhone SE · iOS 16.7",
      iosVersion: "iOS 16.7",
      reviewCount: 18,
    },
  ];
}

export function getAppStoreModerationDataset(): AppStoreModerationDataset {
  return {
    summaries: [
      {
        key: "moderation",
        label: "Quality & Trust Moderation",
        totalTopics: 3,
        totalReviews: 1_004,
        totalHelpfulVotes: 382,
        dominantSentiment: "level4",
        topics: [
          { name: "Delivery delay complaints", totalReviews: 368, helpfulVotes: 138, dominantSentiment: "level5" },
          { name: "Refund delay escalation", totalReviews: 332, helpfulVotes: 132, dominantSentiment: "level4" },
          { name: "Product mismatch reports", totalReviews: 304, helpfulVotes: 112, dominantSentiment: "level3" },
        ],
      },
      {
        key: "feature",
        label: "Feature Requests & Enhancements",
        totalTopics: 3,
        totalReviews: 1_508,
        totalHelpfulVotes: 422,
        dominantSentiment: "level2",
        topics: [
          {
            name: "Better order filters",
            totalReviews: 548,
            helpfulVotes: 158,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "date range", weight: 10 },
              { term: "status", weight: 9 },
              { term: "search orders", weight: 8 },
            ],
          },
          {
            name: "Wishlist sharing",
            totalReviews: 498,
            helpfulVotes: 146,
            dominantSentiment: "level3",
            wordCloud: [
              { term: "share list", weight: 9 },
              { term: "gift ideas", weight: 8 },
              { term: "collaborate", weight: 7 },
            ],
          },
          {
            name: "Price drop alerts",
            totalReviews: 462,
            helpfulVotes: 118,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "wishlist", weight: 9 },
              { term: "notify", weight: 8 },
              { term: "discount", weight: 7 },
            ],
          },
        ],
      },
      {
        key: "appreciation",
        label: "Customer Appreciation Highlights",
        totalTopics: 3,
        totalReviews: 812,
        totalHelpfulVotes: 286,
        dominantSentiment: "level1",
        topics: [
          {
            name: "Fast delivery praise",
            totalReviews: 276,
            helpfulVotes: 98,
            dominantSentiment: "level1",
            wordCloud: [
              { term: "next day", weight: 11 },
              { term: "on time", weight: 10 },
              { term: "packaging", weight: 9 },
            ],
          },
          {
            name: "Easy returns experience",
            totalReviews: 262,
            helpfulVotes: 94,
            dominantSentiment: "level1",
            wordCloud: [
              { term: "pickup", weight: 10 },
              { term: "refund quick", weight: 9 },
              { term: "no hassle", weight: 8 },
            ],
          },
          {
            name: "Deals and offers",
            totalReviews: 274,
            helpfulVotes: 94,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "big billion", weight: 10 },
              { term: "discount", weight: 9 },
              { term: "coupon", weight: 8 },
            ],
          },
        ],
      },
    ],
  };
}

export function getAppStoreModerationAreaData(): AppStoreModerationAreaPoint[] {
  return [
    { level: "1 • Happy", moderation: 8, feature: 35, appreciation: 78 },
    { level: "2 • Bit Irritated", moderation: 14, feature: 30, appreciation: 0 },
    { level: "3 • Moderately Concerned", moderation: 24, feature: 18, appreciation: 0 },
    { level: "4 • Anger", moderation: 32, feature: 11, appreciation: 0 },
    { level: "5 • Frustrated", moderation: 22, feature: 6, appreciation: 0 },
  ];
}

const ECOMMERCE_LEVEL_TOPICS: Record<AppStoreSentimentLevelKey, Array<{ topic: string; helpfulMultiplier: number }>> = {
  level1: [
    { topic: "Fast delivery praise", helpfulMultiplier: 0.55 },
    { topic: "Easy returns experience", helpfulMultiplier: 0.52 },
    { topic: "Deals and offers", helpfulMultiplier: 0.48 },
    { topic: "Packaging quality", helpfulMultiplier: 0.46 },
  ],
  level2: [
    { topic: "Order filters feedback", helpfulMultiplier: 0.47 },
    { topic: "Wishlist improvements", helpfulMultiplier: 0.44 },
    { topic: "Search suggestions", helpfulMultiplier: 0.42 },
    { topic: "Recommendations relevance", helpfulMultiplier: 0.39 },
  ],
  level3: [
    { topic: "Tracking accuracy", helpfulMultiplier: 0.41 },
    { topic: "Checkout flow", helpfulMultiplier: 0.38 },
    { topic: "Seller ratings display", helpfulMultiplier: 0.36 },
    { topic: "Price change alerts", helpfulMultiplier: 0.35 },
  ],
  level4: [
    { topic: "Delivery delay frustration", helpfulMultiplier: 0.34 },
    { topic: "Return pickup delays", helpfulMultiplier: 0.32 },
    { topic: "Wrong item delivered", helpfulMultiplier: 0.31 },
  ],
  level5: [
    { topic: "Refund not received", helpfulMultiplier: 0.33 },
    { topic: "Tracking not updating", helpfulMultiplier: 0.32 },
    { topic: "Customer support wait", helpfulMultiplier: 0.31 },
  ],
};

export function getAppStoreSentimentLevelTimeline(): AppStoreSentimentLevelTimelinePoint[] {
  const today = new Date();

  return Array.from({ length: 14 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));

    const reviewVolume = Math.max(620, Math.round(860 + Math.sin(index * 0.34) * 140 + Math.cos(index * 0.19) * 90));

    const macroPulse = Math.sin((index / 13) * Math.PI) * 0.12;
    const latePulse = Math.cos(((index / 13) * Math.PI) + 0.9) * 0.08;
    const volatility = Math.sin(index * 0.58) * 0.04 + Math.cos(index * 0.41) * 0.035;

    let level1Share = 0.33 + macroPulse * 0.5 + volatility * -0.25;
    let level2Share = 0.28 + macroPulse * -0.35 + volatility * 0.4;
    let level3Share = 0.22 + macroPulse * 0.18 + latePulse * -0.2;
    let level4Share = 0.11 + macroPulse * -0.12 + volatility * 0.28;
    let level5Share = 0.06 + macroPulse * 0.08 + latePulse * 0.22;

    const minShare = 0.015;
    level1Share = Math.max(minShare, level1Share);
    level2Share = Math.max(minShare, level2Share);
    level3Share = Math.max(minShare, level3Share);
    level4Share = Math.max(minShare, level4Share);
    level5Share = Math.max(minShare, level5Share);

    const totalShare = level1Share + level2Share + level3Share + level4Share + level5Share;
    level1Share /= totalShare;
    level2Share /= totalShare;
    level3Share /= totalShare;
    level4Share /= totalShare;
    level5Share = 1 - (level1Share + level2Share + level3Share + level4Share);

    const toPercent = (share: number) => parseFloat((share * 100).toFixed(1));

    const shares: Record<AppStoreSentimentLevelKey, number> = {
      level1: level1Share,
      level2: level2Share,
      level3: level3Share,
      level4: level4Share,
      level5: level5Share,
    };

    const levelCounts: Record<AppStoreSentimentLevelKey, number> = {
      level1: Math.round(reviewVolume * shares.level1),
      level2: Math.round(reviewVolume * shares.level2),
      level3: Math.round(reviewVolume * shares.level3),
      level4: Math.round(reviewVolume * shares.level4),
      level5: Math.round(reviewVolume * shares.level5),
    };

    const assignedTotal = levelCounts.level1 + levelCounts.level2 + levelCounts.level3 + levelCounts.level4 + levelCounts.level5;
    if (assignedTotal !== reviewVolume) {
      levelCounts.level1 += reviewVolume - assignedTotal;
    }

    const topicsByLevel: Record<AppStoreSentimentLevelKey, AppStoreReviewTrendTopic[]> = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
    };

    (Object.keys(topicsByLevel) as AppStoreSentimentLevelKey[]).forEach((levelKey) => {
      const templates = ECOMMERCE_LEVEL_TOPICS[levelKey];
      const first = templates[(index + templates.length) % templates.length];
      const second = templates[(index + 1 + templates.length) % templates.length];
      const third = templates[(index + 2 + templates.length) % templates.length];
      const pool = levelCounts[levelKey];
      const primaryShare = levelKey === "level1" ? 0.52 : levelKey === "level5" ? 0.68 : 0.58;
      const secondaryShare = levelKey === "level4" ? 0.24 : 0.28;
      let firstReviews = Math.max(18, Math.round(pool * primaryShare));
      let secondReviews = Math.max(14, Math.round(pool * secondaryShare));
      let thirdReviews = Math.max(0, pool - firstReviews - secondReviews);
      if (thirdReviews < 0) {
        secondReviews += thirdReviews;
        thirdReviews = 0;
      }
      if (secondReviews < 0) {
        firstReviews += secondReviews;
        secondReviews = 0;
      }

      const buildHelpful = (reviews: number, mult: number) => Math.max(10, Math.round(reviews * mult));
      const arr: AppStoreReviewTrendTopic[] = [];
      if (firstReviews > 0) arr.push({ topic: first.topic, reviews: firstReviews, helpfulVotes: buildHelpful(firstReviews, first.helpfulMultiplier) });
      if (secondReviews > 0) arr.push({ topic: second.topic, reviews: secondReviews, helpfulVotes: buildHelpful(secondReviews, second.helpfulMultiplier) });
      if (thirdReviews > 0) arr.push({ topic: third.topic, reviews: thirdReviews, helpfulVotes: buildHelpful(thirdReviews, third.helpfulMultiplier * 0.9) });
      topicsByLevel[levelKey] = arr;
    });

    return {
      date: date.toISOString().split("T")[0],
      level1: toPercent(level1Share),
      level2: toPercent(level2Share),
      level3: toPercent(level3Share),
      level4: toPercent(level4Share),
      level5: toPercent(level5Share),
      reviewVolume,
      topicsByLevel,
    };
  });
}

const APPSTORE_TOPIC_VOLUME_SPLIT: AppStoreTopicVolumeSplitEntry[] = [
  { name: "Order tracking reliability", volume: 50, sentiment: "negative" },
  { name: "Delivery delay frustration", volume: 46, sentiment: "negative" },
  { name: "Refund not received", volume: 44, sentiment: "negative" },
  { name: "Return and refund experience", volume: 42, sentiment: "negative" },
  { name: "Product quality vs description", volume: 40, sentiment: "negative" },
  { name: "Fast delivery praise", volume: 38, sentiment: "positive" },
  { name: "Easy returns experience", volume: 36, sentiment: "positive" },
  { name: "Checkout and payment flow", volume: 34, sentiment: "negative" },
  { name: "Deals and offers", volume: 32, sentiment: "positive" },
  { name: "Seller ratings and trust", volume: 30, sentiment: "negative" },
  { name: "Wishlist and cart sync", volume: 28, sentiment: "positive" },
  { name: "Search and discovery", volume: 26, sentiment: "negative" },
  { name: "Packaging quality", volume: 24, sentiment: "positive" },
  { name: "App performance and crashes", volume: 22, sentiment: "negative" },
  { name: "Recommendations relevance", volume: 20, sentiment: "positive" },
  { name: "Price drop alerts", volume: 18, sentiment: "positive" },
  { name: "Multi-address management", volume: 16, sentiment: "negative" },
  { name: "Gift wrap option", volume: 14, sentiment: "positive" },
  { name: "Order history export", volume: 12, sentiment: "negative" },
  { name: "Live chat support", volume: 10, sentiment: "positive" },
];

export function getAppStoreTopicVolumeSplit(): AppStoreTopicVolumeSplitEntry[] {
  return [...APPSTORE_TOPIC_VOLUME_SPLIT];
}
