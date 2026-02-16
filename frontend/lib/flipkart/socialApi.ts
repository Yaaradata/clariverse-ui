/**
 * Flipkart Social Dashboard – e-commerce data for Trustpilot, App Store, Play Store.
 * Trustpilot/App/Play use Flipkart-specific modules; X/Reddit and shared helpers from @/lib/social.
 */
export {
  getTrustpilotDashboard,
  getTrustpilotEnhancedDashboard,
} from "@/lib/flipkart/social/trustpilotDashboard";
export type {
  TrustpilotDashboardData,
  TrustpilotEnhancedDashboardData,
  TrustpilotFilters,
  TrustpilotCluster,
  TrustpilotReview,
} from "@/lib/api";
export {
  getTrustpilotTopicVolumeSplit,
  ECOMMERCE_TOPICS,
} from "@/lib/flipkart/social/trustpilotInsights";
export type { TrustpilotTopicVolumeSplitEntry } from "@/lib/social/trustpilot/trustpilotInsights";
export {
  buildTrustpilotInsights,
  SENTIMENT_LEVELS,
  expandToDailyDates,
} from "@/lib/social/trustpilot/trustpilotInsights";
export { getXTopicVolumeSplit, type XTopicVolumeSplitEntry } from "@/lib/social/x";
export { getRedditTopicVolumeSplit, type RedditTopicVolumeSplitEntry } from "@/lib/social/reddit";
export { getPlayStoreTopicVolumeSplit, type PlayStoreTopicVolumeSplitEntry } from "@/lib/flipkart/social/playstore";
export { getAppStoreTopicVolumeSplit, type AppStoreTopicVolumeSplitEntry } from "@/lib/flipkart/social/appstore";
