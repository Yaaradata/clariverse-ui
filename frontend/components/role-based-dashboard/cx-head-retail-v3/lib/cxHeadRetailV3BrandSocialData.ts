export type BrandInfluencerProfile = {
  id: string;
  username: string;
  sentiment: "positive" | "negative" | "neutral";
  karma: number;
  followers: number;
  engagementRate: number;
  watchlist: boolean;
  lastPostSummary: string;
};

export const BRAND_SOCIAL_CHANNELS = ["App Store", "Play Store", "Reddit", "Trustpilot", "X (Twitter)"] as const;
export type BrandSocialChannel = (typeof BRAND_SOCIAL_CHANNELS)[number];

export type BrandFeatureRequest = {
  req: string;
  mentions: number;
  sentiment: number;
  channels: string;
  channelSplit: Record<BrandSocialChannel, number>;
};

export const BRAND_INFLUENCER_WATCHLIST: BrandInfluencerProfile[] = [
  {
    id: "inf-1",
    username: "flipkart_refund_watch",
    sentiment: "negative",
    karma: 214_800,
    followers: 68_400,
    engagementRate: 7.4,
    watchlist: true,
    lastPostSummary: "#NeverDelivered viral thread · 2.4k upvotes on X/Reddit",
  },
  {
    id: "inf-2",
    username: "deal_radar_in",
    sentiment: "negative",
    karma: 118_200,
    followers: 52_100,
    engagementRate: 5.9,
    watchlist: true,
    lastPostSummary: "Checkout fee exposé · 180k views vs Amazon totals",
  },
  {
    id: "inf-3",
    username: "shopper_rights_in",
    sentiment: "negative",
    karma: 86_400,
    followers: 34_800,
    engagementRate: 6.8,
    watchlist: true,
    lastPostSummary: "62% poll: nobody acted after first refund reply",
  },
  {
    id: "inf-4",
    username: "tech_gigabyte",
    sentiment: "positive",
    karma: 64_100,
    followers: 41_200,
    engagementRate: 8.2,
    watchlist: false,
    lastPostSummary: "Praised Click & Collect speed in tier-2 cities",
  },
  {
    id: "inf-5",
    username: "seller_watchdog",
    sentiment: "negative",
    karma: 48_900,
    followers: 28_600,
    engagementRate: 9.1,
    watchlist: true,
    lastPostSummary: "Wrong-SKU photo thread before Big Billion Days",
  },
  {
    id: "inf-6",
    username: "consumer_voice_in",
    sentiment: "negative",
    karma: 31_200,
    followers: 19_400,
    engagementRate: 8.6,
    watchlist: true,
    lastPostSummary: "Refund wait-time scorecard · bottom quartile vs Amazon",
  },
];

export const BRAND_FEATURE_REQUESTS: BrandFeatureRequest[] = [
  {
    req: "Live map order tracking",
    mentions: 312,
    sentiment: 0.74,
    channels: "App Store · Play Store · X (Twitter)",
    channelSplit: { "App Store": 148, "Play Store": 92, Reddit: 38, Trustpilot: 22, "X (Twitter)": 12 },
  },
  {
    req: "Instant UPI refund status",
    mentions: 268,
    sentiment: 0.71,
    channels: "Play Store · Reddit · Trustpilot",
    channelSplit: { "App Store": 54, "Play Store": 102, Reddit: 68, Trustpilot: 32, "X (Twitter)": 12 },
  },
  {
    req: "In-app seller video chat",
    mentions: 224,
    sentiment: 0.68,
    channels: "App Store · X (Twitter) · Reddit",
    channelSplit: { "App Store": 96, "Play Store": 48, Reddit: 52, Trustpilot: 14, "X (Twitter)": 14 },
  },
  {
    req: "EMI breakdown at checkout",
    mentions: 186,
    sentiment: 0.67,
    channels: "App Store · Play Store",
    channelSplit: { "App Store": 88, "Play Store": 62, Reddit: 18, Trustpilot: 10, "X (Twitter)": 8 },
  },
  {
    req: "Schedule delivery slot",
    mentions: 154,
    sentiment: 0.73,
    channels: "Trustpilot · App Store · Reddit",
    channelSplit: { "App Store": 58, "Play Store": 34, Reddit: 28, Trustpilot: 24, "X (Twitter)": 10 },
  },
  {
    req: "Gift wrap + message",
    mentions: 118,
    sentiment: 0.69,
    channels: "X (Twitter) · App Store",
    channelSplit: { "App Store": 44, "Play Store": 22, Reddit: 16, Trustpilot: 12, "X (Twitter)": 24 },
  },
  {
    req: "Wishlist price drop alerts",
    mentions: 102,
    sentiment: 0.72,
    channels: "App Store · Reddit · X (Twitter)",
    channelSplit: { "App Store": 48, "Play Store": 18, Reddit: 22, Trustpilot: 8, "X (Twitter)": 6 },
  },
  {
    req: "Return pickup scheduling",
    mentions: 94,
    sentiment: 0.68,
    channels: "Play Store · Trustpilot · Reddit",
    channelSplit: { "App Store": 20, "Play Store": 38, Reddit: 24, Trustpilot: 8, "X (Twitter)": 4 },
  },
];

export const BRAND_SOCIAL_CHANNEL_COLORS: Record<BrandSocialChannel, string> = {
  "App Store": "#A78BFA",
  "Play Store": "#06B6D4",
  Reddit: "#F97316",
  Trustpilot: "#84CC16",
  "X (Twitter)": "#9CA3AF",
};
