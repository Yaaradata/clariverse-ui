/**
 * Flipkart Play Store – e-commerce review data only.
 * Same API as @/lib/social/playstore; topics and alerts are order/delivery/returns/product focused.
 */

export type {
  PlayStoreKPI,
  PlayStoreViralityTopic,
  PlayStoreReviewAlert,
  PlayStoreModerationDataset,
  PlayStoreModerationAreaPoint,
  PlayStoreSentimentLevelTimelinePoint,
  PlayStoreTopicVolumeSplitEntry,
  PlayStoreSentimentLevelKey,
  PlayStoreReviewTrendTopic,
} from "@/lib/social/playstore";

export {
  PLAYSTORE_SENTIMENT_LEVELS,
} from "@/lib/social/playstore";

import type {
  PlayStoreKPI,
  PlayStoreViralityTopic,
  PlayStoreReviewAlert,
  PlayStoreModerationDataset,
  PlayStoreModerationAreaPoint,
  PlayStoreSentimentLevelTimelinePoint,
  PlayStoreTopicVolumeSplitEntry,
  PlayStoreSentimentLevelKey,
  PlayStoreReviewTrendTopic,
} from "@/lib/social/playstore";

export function getPlayStoreKPIs(): PlayStoreKPI[] {
  return [
    {
      id: "playstore-rating",
      label: "Average Rating",
      value: "4.3",
      change: -0.2,
      trend: "down",
      description: "7-day rolling average for shopping app experience",
    },
    {
      id: "playstore-replied",
      label: "Replied vs Not Replied",
      value: "72%",
      change: -3,
      trend: "down",
      description: "218 reviews need responses – prioritize negative reviews.",
    },
    {
      id: "playstore-response-time",
      label: "Avg Response Time",
      value: "4.2h",
      change: 1.1,
      trend: "up",
      description: "Response time above target – optimize workflow.",
    },
    {
      id: "playstore-negative",
      label: "Negative Reviews",
      value: "22%",
      change: -4.2,
      trend: "down",
      description: "156 negative reviews need attention – focus on top issues.",
    },
  ];
}

export function getPlayStoreViralityTopics(): PlayStoreViralityTopic[] {
  return [
    { name: "Order tracking accuracy", reviewVolume: 186, star1: 14, star2: 24, star3: 32, star4: 52, star5: 64, helpfulVotes: 12_100 },
    { name: "Delivery delay complaints", reviewVolume: 168, star1: 38, star2: 42, star3: 36, star4: 28, star5: 24, helpfulVotes: 10_840 },
    { name: "Return pickup experience", reviewVolume: 152, star1: 32, star2: 36, star3: 34, star4: 28, star5: 22, helpfulVotes: 9_620 },
    { name: "Refund processing speed", reviewVolume: 141, star1: 44, star2: 38, star3: 28, star4: 18, star5: 13, helpfulVotes: 8_940 },
    { name: "Product quality mismatch", reviewVolume: 128, star1: 36, star2: 34, star3: 28, star4: 18, star5: 12, helpfulVotes: 8_120 },
    { name: "Checkout & payment flow", reviewVolume: 118, star1: 22, star2: 28, star3: 30, star4: 22, star5: 16, helpfulVotes: 7_460 },
    { name: "Wishlist & cart sync", reviewVolume: 108, star1: 12, star2: 20, star3: 28, star4: 28, star5: 20, helpfulVotes: 6_780 },
    { name: "Search and filters", reviewVolume: 98, star1: 10, star2: 18, star3: 26, star4: 26, star5: 18, helpfulVotes: 6_120 },
    { name: "Seller communication", reviewVolume: 92, star1: 28, star2: 30, star3: 20, star4: 10, star5: 4, helpfulVotes: 5_780 },
    { name: "App performance & crashes", reviewVolume: 84, star1: 24, star2: 26, star3: 18, star4: 10, star5: 6, helpfulVotes: 5_120 },
  ];
}

export function getPlayStoreReviewAlerts(): PlayStoreReviewAlert[] {
  return [
    {
      id: "ps-fk-alert-001",
      title: "Delivery status not updating",
      category: "performance",
      rating: 2,
      sentimentTag: "critical",
      summary: "Order tracking stuck on 'Shipped' for days; customers unable to get real-time delivery updates.",
      recommendedAction: "Fix tracking API and push in-app banner for affected orders; respond to Play Store with ETA.",
      reviewSnippet: "Tracking never updated after dispatch. Had to call customer care to know my order reached the hub.",
      deviceContext: "Samsung Galaxy A54 • App v8.2",
      androidVersion: "Android 14",
      reviewCount: 41,
    },
    {
      id: "ps-fk-alert-002",
      title: "Refund not credited after return",
      category: "payments",
      rating: 1,
      sentimentTag: "critical",
      summary: "Customers report refund pending for 2+ weeks after return pickup confirmed.",
      recommendedAction: "Audit refund pipeline and expedite stuck refunds; add in-app status for refund timeline.",
      reviewSnippet: "Return was picked up 15 days ago but refund still showing pending. This is unacceptable.",
      deviceContext: "OnePlus 11 • Build v8.2.1",
      androidVersion: "Android 13",
      reviewCount: 56,
    },
    {
      id: "ps-fk-alert-003",
      title: "Wrong product delivered",
      category: "performance",
      rating: 2,
      sentimentTag: "high",
      summary: "Multiple reviews cite receiving wrong item or size; replacement/return flow unclear.",
      recommendedAction: "Tighten warehouse QC and improve replacement flow visibility in app.",
      reviewSnippet: "Got wrong size. Replacement option was confusing and support took 3 days to respond.",
      deviceContext: "Xiaomi 13 • Build v8.2",
      androidVersion: "Android 13",
      reviewCount: 18,
    },
    {
      id: "ps-fk-alert-004",
      title: "Quick delivery and packaging praise",
      category: "accessibility",
      rating: 5,
      sentimentTag: "medium",
      summary: "Users appreciate next-day delivery and secure packaging in tier-1 cities.",
      recommendedAction: "Amplify positive feedback in Play Store listing and social proof.",
      reviewSnippet: "Super fast delivery and product was well packed. Ordering again.",
      deviceContext: "Pixel 6a • Build v8.2",
      androidVersion: "Android 13",
      reviewCount: 29,
    },
  ];
}

export function getPlayStoreModerationDataset(): PlayStoreModerationDataset {
  return {
    summaries: [
      {
        key: "moderation",
        label: "Quality & Trust Moderation",
        totalTopics: 3,
        totalReviews: 1_145,
        totalHelpfulVotes: 418,
        dominantSentiment: "level4",
        topics: [
          { name: "Delivery delay complaints", totalReviews: 428, helpfulVotes: 156, dominantSentiment: "level5" },
          { name: "Refund delay escalation", totalReviews: 376, helpfulVotes: 148, dominantSentiment: "level4" },
          { name: "Product mismatch reports", totalReviews: 341, helpfulVotes: 114, dominantSentiment: "level3" },
        ],
      },
      {
        key: "feature",
        label: "Feature Requests & Enhancements",
        totalTopics: 3,
        totalReviews: 1_012,
        totalHelpfulVotes: 312,
        dominantSentiment: "level2",
        topics: [
          {
            name: "Better order filters",
            totalReviews: 372,
            helpfulVotes: 118,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "date range", weight: 10 },
              { term: "status filter", weight: 9 },
              { term: "search orders", weight: 8 },
            ],
          },
          {
            name: "Wishlist sharing",
            totalReviews: 336,
            helpfulVotes: 102,
            dominantSentiment: "level3",
            wordCloud: [
              { term: "share list", weight: 9 },
              { term: "gift ideas", weight: 8 },
              { term: "collaborate", weight: 7 },
            ],
          },
          {
            name: "Multi-address management",
            totalReviews: 304,
            helpfulVotes: 92,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "default address", weight: 9 },
              { term: "edit address", weight: 8 },
              { term: "work home", weight: 7 },
            ],
          },
        ],
      },
      {
        key: "appreciation",
        label: "Customer Appreciation Highlights",
        totalTopics: 3,
        totalReviews: 864,
        totalHelpfulVotes: 274,
        dominantSentiment: "level1",
        topics: [
          {
            name: "Fast delivery praise",
            totalReviews: 292,
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
            totalReviews: 286,
            helpfulVotes: 92,
            dominantSentiment: "level1",
            wordCloud: [
              { term: "pickup scheduled", weight: 10 },
              { term: "refund quick", weight: 9 },
              { term: "no hassle", weight: 8 },
            ],
          },
          {
            name: "Deals and offers",
            totalReviews: 286,
            helpfulVotes: 84,
            dominantSentiment: "level2",
            wordCloud: [
              { term: "big billion", weight: 9 },
              { term: "discount", weight: 8 },
              { term: "coupon", weight: 7 },
            ],
          },
        ],
      },
    ],
  };
}

export function getPlayStoreModerationAreaData(): PlayStoreModerationAreaPoint[] {
  return [
    { level: "1 • Happy", moderation: 8, feature: 34, appreciation: 78 },
    { level: "2 • Bit Irritated", moderation: 14, feature: 30, appreciation: 0 },
    { level: "3 • Moderately Concerned", moderation: 24, feature: 20, appreciation: 0 },
    { level: "4 • Anger", moderation: 32, feature: 10, appreciation: 0 },
    { level: "5 • Frustrated", moderation: 22, feature: 6, appreciation: 0 },
  ];
}

const ECOMMERCE_LEVEL_TOPICS: Record<PlayStoreSentimentLevelKey, Array<{ topic: string; helpfulMultiplier: number }>> = {
  level1: [
    { topic: "Fast delivery praise", helpfulMultiplier: 0.58 },
    { topic: "Easy returns experience", helpfulMultiplier: 0.52 },
    { topic: "Deals and offers", helpfulMultiplier: 0.5 },
    { topic: "Packaging quality", helpfulMultiplier: 0.46 },
  ],
  level2: [
    { topic: "Order filters feedback", helpfulMultiplier: 0.45 },
    { topic: "Wishlist improvements", helpfulMultiplier: 0.42 },
    { topic: "Search suggestions", helpfulMultiplier: 0.4 },
    { topic: "Recommendations relevance", helpfulMultiplier: 0.38 },
  ],
  level3: [
    { topic: "Tracking accuracy", helpfulMultiplier: 0.36 },
    { topic: "Checkout flow", helpfulMultiplier: 0.34 },
    { topic: "Seller ratings display", helpfulMultiplier: 0.33 },
    { topic: "Price change alerts", helpfulMultiplier: 0.32 },
  ],
  level4: [
    { topic: "Delivery delay frustration", helpfulMultiplier: 0.31 },
    { topic: "Return pickup delays", helpfulMultiplier: 0.3 },
    { topic: "Wrong item delivered", helpfulMultiplier: 0.29 },
  ],
  level5: [
    { topic: "Refund not received", helpfulMultiplier: 0.32 },
    { topic: "Tracking not updating", helpfulMultiplier: 0.31 },
    { topic: "Customer support wait", helpfulMultiplier: 0.3 },
  ],
};

export function getPlayStoreSentimentLevelTimeline(): PlayStoreSentimentLevelTimelinePoint[] {
  const today = new Date();
  return Array.from({ length: 14 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    const reviewVolume = Math.max(600, Math.round(820 + Math.sin(index * 0.33) * 120 + Math.cos(index * 0.2) * 80));
    const macroPulse = Math.sin((index / 13) * Math.PI) * 0.1;
    const latePulse = Math.cos(((index / 13) * Math.PI) + 1) * 0.07;
    const volatility = Math.sin(index * 0.55) * 0.035;

    let level1Share = 0.34 + macroPulse * 0.45 + volatility * -0.2;
    let level2Share = 0.28 + macroPulse * -0.33 + volatility * 0.35;
    let level3Share = 0.22 + macroPulse * 0.16 + latePulse * -0.18;
    let level4Share = 0.10 + macroPulse * -0.1 + volatility * 0.24;
    let level5Share = 0.06 + macroPulse * 0.07 + latePulse * 0.18;

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

    const shares: Record<PlayStoreSentimentLevelKey, number> = {
      level1: level1Share,
      level2: level2Share,
      level3: level3Share,
      level4: level4Share,
      level5: level5Share,
    };

    const levelCounts: Record<PlayStoreSentimentLevelKey, number> = {
      level1: Math.round(reviewVolume * shares.level1),
      level2: Math.round(reviewVolume * shares.level2),
      level3: Math.round(reviewVolume * shares.level3),
      level4: Math.round(reviewVolume * shares.level4),
      level5: Math.round(reviewVolume * shares.level5),
    };

    const topicsByLevel: Record<PlayStoreSentimentLevelKey, PlayStoreReviewTrendTopic[]> = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
    };

    (Object.keys(levelCounts) as PlayStoreSentimentLevelKey[]).forEach((levelKey) => {
      const templates = ECOMMERCE_LEVEL_TOPICS[levelKey];
      const first = templates[(index + templates.length) % templates.length];
      const second = templates[(index + 1 + templates.length) % templates.length];
      const third = templates[(index + 2 + templates.length) % templates.length];
      const pool = levelCounts[levelKey];
      const firstReviews = Math.max(18, Math.round(pool * 0.58));
      const secondReviews = Math.max(12, Math.round(pool * 0.28));
      const thirdReviews = Math.max(0, pool - firstReviews - secondReviews);

      const buildHelpful = (reviews: number, mult: number) => Math.max(10, Math.round(reviews * mult));
      const arr: PlayStoreReviewTrendTopic[] = [];
      if (firstReviews > 0) arr.push({ topic: first.topic, reviews: firstReviews, helpfulVotes: buildHelpful(firstReviews, first.helpfulMultiplier) });
      if (secondReviews > 0) arr.push({ topic: second.topic, reviews: secondReviews, helpfulVotes: buildHelpful(secondReviews, second.helpfulMultiplier) });
      if (thirdReviews > 0) arr.push({ topic: third.topic, reviews: thirdReviews, helpfulVotes: buildHelpful(thirdReviews, third.helpfulMultiplier * 0.9) });
      topicsByLevel[levelKey] = arr;
    });

    return {
      date: date.toISOString().split("T")[0],
      level1: Math.round(level1Share * 1000) / 10,
      level2: Math.round(level2Share * 1000) / 10,
      level3: Math.round(level3Share * 1000) / 10,
      level4: Math.round(level4Share * 1000) / 10,
      level5: Math.round(level5Share * 1000) / 10,
      reviewVolume,
      topicsByLevel,
    };
  });
}

const PLAYSTORE_TOPIC_VOLUME_SPLIT: PlayStoreTopicVolumeSplitEntry[] = [
  { name: "Order tracking accuracy", volume: 52, sentiment: "negative" },
  { name: "Delivery delay complaints", volume: 48, sentiment: "negative" },
  { name: "Refund processing speed", volume: 45, sentiment: "negative" },
  { name: "Return pickup experience", volume: 42, sentiment: "negative" },
  { name: "Product quality mismatch", volume: 40, sentiment: "negative" },
  { name: "Fast delivery praise", volume: 38, sentiment: "positive" },
  { name: "Easy returns experience", volume: 36, sentiment: "positive" },
  { name: "Checkout & payment flow", volume: 34, sentiment: "negative" },
  { name: "Deals and offers", volume: 32, sentiment: "positive" },
  { name: "Seller communication", volume: 30, sentiment: "negative" },
  { name: "Wishlist & cart sync", volume: 28, sentiment: "positive" },
  { name: "Search and filters", volume: 26, sentiment: "negative" },
  { name: "Packaging quality", volume: 24, sentiment: "positive" },
  { name: "App performance & crashes", volume: 22, sentiment: "negative" },
  { name: "Recommendations relevance", volume: 20, sentiment: "positive" },
  { name: "Price drop alerts", volume: 18, sentiment: "positive" },
  { name: "Multi-address management", volume: 16, sentiment: "negative" },
  { name: "Gift wrap option", volume: 14, sentiment: "positive" },
  { name: "Order history export", volume: 12, sentiment: "negative" },
  { name: "Live chat support", volume: 10, sentiment: "positive" },
];

export function getPlayStoreTopicVolumeSplit(): PlayStoreTopicVolumeSplitEntry[] {
  return [...PLAYSTORE_TOPIC_VOLUME_SPLIT];
}
