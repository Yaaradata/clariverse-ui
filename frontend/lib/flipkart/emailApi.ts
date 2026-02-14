/**
 * Flipkart Email Dashboard – same API as @/lib/api for email pages; data is e-commerce themed.
 * Re-exports all api symbols and overrides getEisenhowerThreads + getKPIs with Flipkart data.
 */

import {
  getEisenhowerThreads as getFlipkartEisenhowerThreads,
} from "./api";
import type { KPIData, EisenhowerThread } from "@/lib/api";
import {
  getThreadDetail,
  getThreadsOverTime,
  getSentimentTrend,
  getTopicDistribution,
  getPriorityResolutionData,
  getActionableCards,
  getNetworkGraphData,
  getPredictiveMetrics,
} from "@/lib/api";
import type {
  ThreadDetail,
  ThreadsOverTimeData,
  SentimentTrendData,
  TopicDistributionData,
  PriorityResolutionData,
  ActionableCard,
  NetworkGraphData,
  QuadrantSummary,
} from "@/lib/api";

export type {
  KPIData,
  EisenhowerThread,
  ThreadDetail,
  ThreadsOverTimeData,
  SentimentTrendData,
  TopicDistributionData,
  PriorityResolutionData,
  ActionableCard,
  NetworkGraphData,
  QuadrantSummary,
};

export async function getQuadrantSummaries(): Promise<QuadrantSummary[]> {
  const threads = await getFlipkartEisenhowerThreads();
  const total = threads.length;
  const quadrants = ["do", "schedule", "delegate", "delete"] as const;
  const ctaConfig = {
    do: { text: "Assign Owner", action: "assign" },
    schedule: { text: "Schedule", action: "schedule" },
    delegate: { text: "Escalate", action: "escalate" },
    delete: { text: "Archive", action: "archive" },
  };
  return quadrants.map((quadrant) => {
    const count = threads.filter((t) => t.quadrant === quadrant).length;
    return {
      quadrant,
      count,
      percentage: Math.round((count / total) * 100),
      ctaText: ctaConfig[quadrant].text,
      ctaAction: ctaConfig[quadrant].action,
    };
  });
}

export { generatePriorityResolutionDataForQuadrant } from "./api";

export async function getEisenhowerThreads(): Promise<EisenhowerThread[]> {
  return getFlipkartEisenhowerThreads();
}

export async function getKPIs(): Promise<KPIData> {
  const threads = await getFlipkartEisenhowerThreads();
  const totalThreads = threads.length;
  const closedThreads = threads.filter((t) => t.resolution_status === "closed").length;
  const urgentThreads = threads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
  const criticalIssues = threads.filter((t) => t.priority === "P1").length;
  let customerWaitingCount = threads.filter(
    (t) => t.action_pending_from === "customer" && t.action_pending_status !== "completed"
  ).length;
  if (customerWaitingCount === 0 || customerWaitingCount / totalThreads < 0.05) {
    customerWaitingCount = Math.max(customerWaitingCount, Math.round(totalThreads * 0.15));
  }
  const escalatedThreads = threads.filter((t) => t.escalation_count > 0).length;
  let internalPending = threads.filter(
    (t) => t.action_pending_from === "company" && t.action_pending_status !== "completed"
  ).length;
  if (internalPending === 0 || internalPending / totalThreads < 0.05) {
    internalPending = Math.max(internalPending, Math.round(totalThreads * 0.12));
  }
  const avgSentiment =
    threads.reduce((sum, t) => sum + t.overall_sentiment, 0) / totalThreads;
  const avgResolutionTime =
    threads.reduce((sum, t) => {
      const start = new Date(t.first_message_at).getTime();
      const end = new Date(t.last_message_at).getTime();
      return sum + (end - start) / (1000 * 60 * 60 * 24);
    }, 0) / totalThreads;

  return {
    total_threads: totalThreads,
    total_messages: threads.reduce((sum, t) => sum + (t.participants?.length || 0), 0),
    closed_vs_open_percentage: Math.round((closedThreads / totalThreads) * 100 * 10) / 10,
    avg_resolution_time_days: Math.round(avgResolutionTime * 10) / 10,
    urgent_threads_count: urgentThreads,
    critical_issues_count: criticalIssues,
    customer_waiting_count: customerWaitingCount,
    customer_waiting_percentage: Math.round((customerWaitingCount / totalThreads) * 100 * 10) / 10,
    escalation_rate: Math.round((escalatedThreads / totalThreads) * 100 * 10) / 10,
    sla_breach_risk_percentage: Math.round((escalatedThreads / totalThreads) * 100 * 1.5),
    customer_sentiment_index: Math.round(avgSentiment),
    internal_pending_count: internalPending,
    internal_pending_percentage: Math.round((internalPending / totalThreads) * 100 * 10) / 10,
    threads_by_cluster_subcluster: {
      "Order Issues": { "Delivery Delay": 48, "Tracking": 35, "Cancellation": 28 },
      "Returns & Refunds": { "Refund Status": 42, "Return Pickup": 38, "Wrong Item": 32 },
      "Payment & Checkout": { "Payment Failed": 56, "Coupon": 24, "Wallet": 18 },
      "Account & Support": { "Login": 34, "Profile": 29, "Offers": 41 },
      "Seller & Marketplace": { "Dispute": 28, "Quality": 22, "Delivery": 18 },
    },
    avg_sentiment_weighted: Math.round(avgSentiment),
    open_pct: Math.round(((totalThreads - closedThreads) / totalThreads) * 100 * 10) / 10,
    escalation_count: escalatedThreads,
    business_impact_score: Math.round(
      threads.reduce((sum, t) => sum + t.business_impact_score, 0) / totalThreads
    ),
    risk_score: Math.round(threads.reduce((sum, t) => sum + t.risk_score, 0) / totalThreads),
    sla_compliance_rate: Math.round((100 - (escalatedThreads / totalThreads) * 100) * 10) / 10,
    urgent_unresolved_count: threads.filter(
      (t) =>
        (t.urgency === "critical" || t.urgency === "high") && t.resolution_status !== "closed"
    ).length,
  };
}

export {
  getThreadDetail,
  getThreadsOverTime,
  getSentimentTrend,
  getTopicDistribution,
  getPriorityResolutionData,
  getActionableCards,
  getNetworkGraphData,
  getPredictiveMetrics,
};
