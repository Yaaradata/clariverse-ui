/**
 * Flipkart Trustpilot – e-commerce dashboard data only.
 * Same API as @/lib/api getTrustpilotDashboard / getTrustpilotEnhancedDashboard; content is order/delivery/returns/product focused.
 */

import type {
  TrustpilotFilters,
  TrustpilotDashboardData,
  TrustpilotEnhancedDashboardData,
  TrustpilotCluster,
  TrustpilotReview,
} from "@/lib/api";

export async function getTrustpilotDashboard(filters?: TrustpilotFilters): Promise<TrustpilotDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    kpis: {
      totalReviews: 1247,
      avgRating: 4.2,
      negativeReviewsPercent: 18.5,
      trendingSentiment: "down",
      urgencyPercent: 32.4,
    },
    clusterVolume: [
      { cluster: "Delivery & Fulfilment", positive: 52, negative: 178, neutral: 26 },
      { cluster: "Returns & Refunds", positive: 88, negative: 132, neutral: 34 },
      { cluster: "Product & Catalog", positive: 96, negative: 165, neutral: 42 },
      { cluster: "Payment & Checkout", positive: 74, negative: 118, neutral: 27 },
      { cluster: "Seller & Support", positive: 81, negative: 143, neutral: 38 },
      { cluster: "App & Experience", positive: 109, negative: 56, neutral: 21 },
    ],
    topicBubbles: [
      { topic: "Delivery Delays", volume: 212, sentiment: -0.74, aiSummary: "High volume of late deliveries and tracking not updating during peak sale" },
      { topic: "Refund Delays", volume: 184, sentiment: -0.69, aiSummary: "Customers report refund pending for 2+ weeks after return pickup" },
      { topic: "Return Pickup Experience", volume: 167, sentiment: -0.52, aiSummary: "Pickup scheduling and delay complaints driving negative reviews" },
      { topic: "Product Quality Mismatch", volume: 141, sentiment: -0.47, aiSummary: "Received wrong item or quality not as described" },
      { topic: "Order Tracking Accuracy", volume: 129, sentiment: -0.63, aiSummary: "Tracking stuck or not updating; customers unable to see delivery status" },
      { topic: "Checkout & Payment Issues", volume: 118, sentiment: -0.58, aiSummary: "Payment failures and coupon application errors at checkout" },
      { topic: "Seller Communication", volume: 96, sentiment: -0.28, aiSummary: "Slow or unclear seller responses on order and return queries" },
      { topic: "Customer Support Wait", volume: 102, sentiment: -0.45, aiSummary: "Long wait times and unresolved escalations" },
      { topic: "Fast Delivery Praise", volume: 88, sentiment: 0.61, aiSummary: "Positive feedback on next-day delivery and packaging" },
      { topic: "Easy Returns Praise", volume: 76, sentiment: 0.54, aiSummary: "Smooth return pickup and quick refund experience" },
      { topic: "Deals & Offers", volume: 64, sentiment: 0.48, aiSummary: "Customers appreciate Big Billion and flash sale deals" },
      { topic: "App Experience", volume: 71, sentiment: 0.42, aiSummary: "Shout-outs for search, wishlist, and order history UX" },
    ],
    trendData: [
      { date: "2024-10-01", reviewVolume: 45, sentiment: 0.65 },
      { date: "2024-10-08", reviewVolume: 52, sentiment: 0.58 },
      { date: "2024-10-15", reviewVolume: 48, sentiment: 0.52 },
      { date: "2024-10-22", reviewVolume: 61, sentiment: 0.48 },
      { date: "2024-10-29", reviewVolume: 55, sentiment: 0.42 },
      { date: "2024-11-05", reviewVolume: 67, sentiment: 0.38 },
    ],
    aiInsights: [
      {
        id: "tp-fk-1",
        title: "Delivery Delays mentions up 41% week-over-week",
        description: "Post-sale spike in late delivery and tracking-not-updating complaints in metro and tier-1",
        action: "Coordinate with logistics, fix tracking API, and push in-app banner for affected orders",
        severity: "critical",
        impact: "41% of all negative mentions cite delivery or tracking issues",
      },
      {
        id: "tp-fk-2",
        title: "Refund Delays concentrated after return pickup",
        description: "Sentiment dropped 22 points where refund status stays pending 2+ weeks",
        action: "Audit refund pipeline, expedite stuck refunds, add in-app refund status",
        severity: "high",
        impact: "184 refund-related reviews in last 7 days",
      },
      {
        id: "tp-fk-3",
        title: "Fast Delivery and Easy Returns trending positive",
        description: "Customers highlight next-day delivery and smooth return flow in metro cities",
        action: "Amplify in owned channels and seller briefings",
        severity: "low",
        impact: "Positive sentiment +18 points on Trustpilot",
      },
      {
        id: "tp-fk-4",
        title: "Product Mismatch and Wrong Item rising",
        description: "Wrong size/item delivered and unclear replacement flow driving confusion",
        action: "Tighten warehouse QC and improve replacement flow visibility",
        severity: "medium",
        impact: "96 reviews referencing wrong product or quality mismatch this month",
      },
    ],
    actionFunnel: [
      { topic: "Delivery Delays", urgency: "critical", resolutionStatus: "open", resolvedPercent: 18, count: 178 },
      { topic: "Refund Delays", urgency: "high", resolutionStatus: "in_progress", resolvedPercent: 34, count: 145 },
      { topic: "Return Pickup Experience", urgency: "high", resolutionStatus: "open", resolvedPercent: 22, count: 132 },
      { topic: "Product Quality Mismatch", urgency: "medium", resolutionStatus: "in_progress", resolvedPercent: 41, count: 96 },
      { topic: "Order Tracking Accuracy", urgency: "high", resolutionStatus: "in_progress", resolvedPercent: 28, count: 118 },
      { topic: "Easy Returns Praise", urgency: "low", resolutionStatus: "resolved", resolvedPercent: 86, count: 76 },
    ],
    clusters: [
      "Delivery Delays",
      "Refund Delays",
      "Return Pickup Experience",
      "Order Tracking Accuracy",
      "Product Quality Mismatch",
      "Checkout & Payment Issues",
    ],
  };
}

export async function getTrustpilotEnhancedDashboard(filters?: TrustpilotFilters): Promise<TrustpilotEnhancedDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const clusters: TrustpilotCluster[] = [
    {
      cluster_id: "DEL_001",
      cluster_name: "Delivery & Fulfilment",
      volume: 1465,
      percentage: 28,
      sentiment: { positive: 0.18, neutral: 0.22, negative: 0.50, mixed: 0.10 },
      urgency: "HIGH",
      priority: "CUSTOMER_SATISFACTION",
      trend: { "7d_change": 0.15, direction: "UP" },
      avg_resolution_time_days: 2.3,
      response_rate: 0.76,
      fake_review_rate: 0.02,
      subclusters: [
        {
          subcluster_id: "DEL_001_A",
          name: "Late Delivery",
          volume: 456,
          percentage: 31,
          urgency: "CRITICAL",
          ai_summary: "Delivery beyond promised EDD; customers frustrated with no proactive communication",
          sentiment: { positive: 0.05, neutral: 0.15, negative: 0.75, mixed: 0.05 },
          ai_insights: [
            { type: "EMERGING_CRISIS", message: "Volume +145% vs yesterday – possible logistics bottleneck", confidence: 0.94 },
            { type: "TREND", message: "Peak sale backlog – align with ops on EDD updates", confidence: 0.87 },
          ],
        },
        {
          subcluster_id: "DEL_001_B",
          name: "Tracking Not Updating",
          volume: 389,
          percentage: 27,
          urgency: "HIGH",
          ai_summary: "Order tracking stuck after dispatch; customers unable to see real-time status",
          sentiment: { positive: 0.10, neutral: 0.20, negative: 0.65, mixed: 0.05 },
          ai_insights: [{ type: "TREND", message: "Steady increase over past week – fix tracking API", confidence: 0.82 }],
        },
        {
          subcluster_id: "DEL_001_C",
          name: "Packaging & Handover",
          volume: 620,
          percentage: 42,
          urgency: "MEDIUM",
          ai_summary: "Mixed feedback on packaging quality and delivery handover experience",
          sentiment: { positive: 0.30, neutral: 0.30, negative: 0.35, mixed: 0.05 },
        },
      ],
      ai_insights: [
        { type: "EMERGING_CRISIS", message: "Volume +145% vs yesterday – possible logistics bottleneck", confidence: 0.94 },
        { type: "TREND", message: "Peak sale backlog – align with ops on EDD updates", confidence: 0.87 },
      ],
    },
    {
      cluster_id: "REF_001",
      cluster_name: "Returns & Refunds",
      volume: 1234,
      percentage: 24,
      sentiment: { positive: 0.12, neutral: 0.18, negative: 0.65, mixed: 0.05 },
      urgency: "CRITICAL",
      priority: "REVENUE_IMPACT",
      trend: { "7d_change": 0.45, direction: "UP" },
      avg_resolution_time_days: 1.8,
      response_rate: 0.82,
      fake_review_rate: 0.01,
      subclusters: [
        {
          subcluster_id: "REF_001_A",
          name: "Refund Delays",
          volume: 567,
          percentage: 46,
          urgency: "CRITICAL",
          ai_summary: "Refund pending 2+ weeks after return pickup; payment pipeline backlog",
          sentiment: { positive: 0.05, neutral: 0.10, negative: 0.80, mixed: 0.05 },
          ai_insights: [
            { type: "EMERGING_CRISIS", message: "Refund pipeline delay – urgent ops and finance alignment", confidence: 0.96 },
          ],
        },
        {
          subcluster_id: "REF_001_B",
          name: "Return Pickup Delays",
          volume: 423,
          percentage: 34,
          urgency: "HIGH",
          ai_summary: "Pickup scheduling delays and no-show; customers want faster pickup",
          sentiment: { positive: 0.08, neutral: 0.15, negative: 0.72, mixed: 0.05 },
        },
        {
          subcluster_id: "REF_001_C",
          name: "Return Policy Clarity",
          volume: 244,
          percentage: 20,
          urgency: "MEDIUM",
          ai_summary: "Confusion on eligible items and return window; improve in-app copy",
          sentiment: { positive: 0.20, neutral: 0.25, negative: 0.50, mixed: 0.05 },
        },
      ],
      ai_insights: [
        { type: "EMERGING_CRISIS", message: "Refund pipeline delay – urgent ops and finance alignment", confidence: 0.96 },
        { type: "OPPORTUNITY", message: "Faster refund SLA could recover significant NPS – prioritise", confidence: 0.91 },
      ],
    },
    {
      cluster_id: "CS_001",
      cluster_name: "Customer Support",
      volume: 987,
      percentage: 19,
      sentiment: { positive: 0.35, neutral: 0.25, negative: 0.35, mixed: 0.05 },
      urgency: "MEDIUM",
      priority: "CUSTOMER_SATISFACTION",
      trend: { "7d_change": -0.12, direction: "DOWN" },
      avg_resolution_time_days: 3.1,
      response_rate: 0.71,
      fake_review_rate: 0.03,
      subclusters: [
        {
          subcluster_id: "CS_001_A",
          name: "Response Delays",
          volume: 456,
          percentage: 46,
          urgency: "HIGH",
          ai_summary: "Support response times exceeding SLA; backlog on post-sale queries",
          sentiment: { positive: 0.15, neutral: 0.20, negative: 0.60, mixed: 0.05 },
        },
        {
          subcluster_id: "CS_001_B",
          name: "Resolution Quality",
          volume: 531,
          percentage: 54,
          urgency: "MEDIUM",
          ai_summary: "Mixed feedback on resolution effectiveness and follow-up",
          sentiment: { positive: 0.50, neutral: 0.30, negative: 0.15, mixed: 0.05 },
          ai_insights: [
            { type: "OPPORTUNITY", message: "15 reviews waiting for response – average 8h delay vs 18h avg", confidence: 0.88 },
          ],
        },
      ],
      ai_insights: [
        { type: "OPPORTUNITY", message: "15 reviews waiting for response – average 8h delay vs 18h avg", confidence: 0.88 },
      ],
    },
    {
      cluster_id: "PROD_001",
      cluster_name: "Product & Catalog",
      volume: 856,
      percentage: 16,
      sentiment: { positive: 0.28, neutral: 0.22, negative: 0.45, mixed: 0.05 },
      urgency: "HIGH",
      priority: "CUSTOMER_SATISFACTION",
      trend: { "7d_change": 0.23, direction: "UP" },
      avg_resolution_time_days: 4.2,
      response_rate: 0.65,
      fake_review_rate: 0.02,
      subclusters: [
        {
          subcluster_id: "PROD_001_A",
          name: "Wrong Item / Quality",
          volume: 389,
          percentage: 45,
          urgency: "HIGH",
          ai_summary: "Wrong product or size delivered; quality not as described",
          sentiment: { positive: 0.10, neutral: 0.15, negative: 0.70, mixed: 0.05 },
        },
        {
          subcluster_id: "PROD_001_B",
          name: "Catalog & Search",
          volume: 312,
          percentage: 36,
          urgency: "MEDIUM",
          ai_summary: "Search relevance and filter feedback; discovery experience",
          sentiment: { positive: 0.20, neutral: 0.25, negative: 0.50, mixed: 0.05 },
        },
        {
          subcluster_id: "PROD_001_C",
          name: "Deals & Offers",
          volume: 155,
          percentage: 19,
          urgency: "LOW",
          ai_summary: "Positive feedback on deals and coupon experience",
          sentiment: { positive: 0.60, neutral: 0.30, negative: 0.05, mixed: 0.05 },
        },
      ],
      ai_insights: [
        { type: "TREND", message: "Wrong item reports increasing – prioritise warehouse QC", confidence: 0.85 },
      ],
    },
    {
      cluster_id: "PAY_001",
      cluster_name: "Payment & Checkout",
      volume: 432,
      percentage: 8,
      sentiment: { positive: 0.15, neutral: 0.20, negative: 0.60, mixed: 0.05 },
      urgency: "MEDIUM",
      priority: "REVENUE_IMPACT",
      trend: { "7d_change": 0.08, direction: "UP" },
      avg_resolution_time_days: 2.5,
      response_rate: 0.58,
      fake_review_rate: 0.04,
      subclusters: [
        {
          subcluster_id: "PAY_001_A",
          name: "Payment Failures",
          volume: 267,
          percentage: 62,
          urgency: "HIGH",
          ai_summary: "Checkout payment failures and coupon not applied",
          sentiment: { positive: 0.05, neutral: 0.10, negative: 0.80, mixed: 0.05 },
        },
        {
          subcluster_id: "PAY_001_B",
          name: "Checkout UX",
          volume: 165,
          percentage: 38,
          urgency: "MEDIUM",
          ai_summary: "Feedback on checkout flow and address selection",
          sentiment: { positive: 0.25, neutral: 0.30, negative: 0.40, mixed: 0.05 },
        },
      ],
      ai_insights: [
        { type: "OPPORTUNITY", message: "Payment and coupon clarity could reduce cart abandonment", confidence: 0.82 },
      ],
    },
    {
      cluster_id: "OTH_001",
      cluster_name: "Other",
      volume: 260,
      percentage: 5,
      sentiment: { positive: 0.40, neutral: 0.30, negative: 0.25, mixed: 0.05 },
      urgency: "LOW",
      priority: "INTERNAL_PROCESS",
      trend: { "7d_change": -0.05, direction: "DOWN" },
      avg_resolution_time_days: 1.5,
      response_rate: 0.85,
      fake_review_rate: 0.01,
      subclusters: [],
      ai_insights: [],
    },
  ];

  const reviews: TrustpilotReview[] = [];
  clusters.forEach((cluster) => {
    cluster.subclusters.forEach((subcluster) => {
      const reviewCount = Math.min(subcluster.volume, 10);
      for (let i = 0; i < reviewCount; i++) {
        const isNegative = subcluster.sentiment.negative > 0.5;
        reviews.push({
          review_id: `REV_${cluster.cluster_id}_${subcluster.subcluster_id}_${i}`,
          rating: isNegative ? (Math.random() > 0.5 ? 1 : 2) : Math.random() > 0.3 ? 4 : 5,
          text: `${subcluster.ai_summary} Review ${i + 1}: ${isNegative ? "Very disappointed. " : "Great experience! "}${subcluster.name} – needs attention.`,
          posted_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          cluster_id: cluster.cluster_id,
          subcluster_id: subcluster.subcluster_id,
          reviewer: {
            name: `User${Math.floor(Math.random() * 1000)}`,
            verified_purchase: Math.random() > 0.3,
            review_count: Math.floor(Math.random() * 50) + 1,
            helpful_percentage: Math.floor(Math.random() * 40) + 60,
            is_influencer: Math.random() > 0.9,
            influencer_reach: Math.random() > 0.9 ? Math.floor(Math.random() * 50000) + 10000 : undefined,
          },
          metadata: {
            urgency: subcluster.urgency,
            priority: cluster.priority,
            resolution_status: Math.random() > 0.6 ? "PENDING" : Math.random() > 0.5 ? "RESOLVED" : "REQUIRES_INTERVENTION",
            action_pending: Math.random() > 0.4,
            action_pending_from: Math.random() > 0.5 ? "SUPPORT_TEAM" : "MANAGEMENT",
            follow_up_required: Math.random() > 0.6,
            follow_up_date: Math.random() > 0.6 ? new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000).toISOString() : undefined,
            follow_up_reason: Math.random() > 0.6 ? "Initial response pending – SLA breach in 4h" : undefined,
            next_action_suggestion: `Respond with escalation to ${subcluster.name.toLowerCase()} team`,
            overall_sentiment: isNegative ? "NEGATIVE" : Math.random() > 0.5 ? "POSITIVE" : "NEUTRAL",
            sentiment_confidence: Math.floor(Math.random() * 20) + 80,
            authenticity_confidence: Math.floor(Math.random() * 10) + 90,
            summary: subcluster.ai_summary,
          },
          helpful_votes: Math.floor(Math.random() * 50) + 5,
          not_helpful_votes: Math.floor(Math.random() * 10),
          review_views: Math.floor(Math.random() * 500) + 100,
        });
      }
    });
  });

  return {
    metadata: {
      last_updated: new Date().toISOString(),
      update_frequency_seconds: 60,
      total_reviews: 5234,
      trustscore: 4.2,
      response_rate: 0.87,
      avg_response_time_hours: 18,
      reputation_risk_score: 4.2,
      clv_at_risk: 2300000,
      unresolved_alerts: 12,
      fake_reviews_flagged: 3,
      top_complaint: "Delivery & Fulfilment",
      top_complaint_percentage: 28,
    },
    clusters,
    reviews,
  };
}
