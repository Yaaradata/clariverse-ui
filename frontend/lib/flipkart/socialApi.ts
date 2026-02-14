/**
 * Flipkart Social Dashboard – same API as @/lib/api and @/lib/social for social pages.
 * Re-exports for consistent imports; same UI, data can be e-commerce themed in overrides later.
 */
export {
  getTrustpilotDashboard,
  getTrustpilotEnhancedDashboard,
  type TrustpilotDashboardData,
  type TrustpilotEnhancedDashboardData,
  type TrustpilotFilters,
  type TrustpilotCluster,
  type TrustpilotReview,
} from "@/lib/api";
export {
  getTrustpilotTopicVolumeSplit,
  buildTrustpilotInsights,
  SENTIMENT_LEVELS,
  expandToDailyDates,
  type TrustpilotTopicVolumeSplitEntry,
} from "@/lib/social/trustpilot/trustpilotInsights";
export { getXTopicVolumeSplit, type XTopicVolumeSplitEntry } from "@/lib/social/x";
export { getRedditTopicVolumeSplit, type RedditTopicVolumeSplitEntry } from "@/lib/social/reddit";
export { getPlayStoreTopicVolumeSplit, type PlayStoreTopicVolumeSplitEntry } from "@/lib/social/playstore";
export { getAppStoreTopicVolumeSplit, type AppStoreTopicVolumeSplitEntry } from "@/lib/social/appstore";
