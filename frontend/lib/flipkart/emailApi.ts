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

/** Flipkart actionable cards: e-commerce titles, descriptions, and distinct next actions per type. */
function generateFlipkartActionableCards(): ActionableCard[] {
  const cardTypes: Array<"top_risk" | "overdue_followup" | "opportunity" | "sla_failure" | "watchlist"> = [
    "top_risk",
    "overdue_followup",
    "opportunity",
    "sla_failure",
    "watchlist",
  ];

  const config: Record<
    string,
    {
      title: string;
      description: string;
      next_action_suggestion: string;
      subject_norm: string;
      defaultPriority: "critical" | "high" | "medium" | "low";
    }
  > = {
    top_risk: {
      title: "High Risk Thread Detected",
      description: "This thread has escalated (return/refund or delivery dispute) and needs immediate attention.",
      next_action_suggestion:
        "Assign to returns/refunds team; respond with refund ETA or delivery resolution within 2 hours. Offer replacement or partial refund if applicable.",
      subject_norm: "Refund not received / Delivery dispute",
      defaultPriority: "high",
    },
    overdue_followup: {
      title: "Overdue Follow-up Required",
      description: "Customer has been waiting for a response for over 24 hours on order or refund.",
      next_action_suggestion:
        "Reply with current order or refund status within 1 hour. If refund is stuck, escalate to payments ops and send proactive SMS with ETA.",
      subject_norm: "Refund status / Order tracking",
      defaultPriority: "critical",
    },
    opportunity: {
      title: "Customer Upsell Opportunity",
      description: "Customer showed interest in similar products or offers based on conversation.",
      next_action_suggestion:
        "Add customer to post-purchase campaign; send personalised offer or product recommendations via email/app within 24 hours.",
      subject_norm: "Product enquiry / Recommendations",
      defaultPriority: "medium",
    },
    sla_failure: {
      title: "SLA Breach Risk",
      description: "Thread is approaching 24h first-response SLA and needs priority handling.",
      next_action_suggestion:
        "Prioritise reply to meet 24h SLA. If return/refund, trigger pickup or refund workflow and confirm to customer with timeline.",
      subject_norm: "Return request / Refund delay",
      defaultPriority: "critical",
    },
    watchlist: {
      title: "VIP / High-Value Customer Thread",
      description: "High-value or repeat customer thread requires priority handling.",
      next_action_suggestion:
        "Assign to priority queue; ensure refund or delivery resolution within 4 hours. Consider goodwill gesture (e.g. coupon or expedited refund).",
      subject_norm: "Priority support / Refund",
      defaultPriority: "critical",
    },
  };

  return cardTypes.map((type, index) => {
    const c = config[type];
    const threadId = [555, 773, 379, 410, 750][index] ?? Math.floor(Math.random() * 1000);
    return {
      id: `card_fk_${type}_${index}`,
      type,
      title: c.title,
      description: c.description,
      priority: c.defaultPriority,
      thread_id: `thread_${threadId}`,
      subject_norm: c.subject_norm,
      participants: [
        { name: "Customer", email: "customer@example.com", type: "customer" },
        { name: "Support Agent", email: "support@flipkart.com", type: "external" },
      ],
      next_action_suggestion: c.next_action_suggestion,
      cta_buttons: [
        { label: "Escalate", action: "escalate", variant: "danger" },
        { label: "Assign Owner", action: "assign_owner", variant: "primary" },
        { label: "Reply", action: "reply", variant: "secondary" },
      ],
      metadata: {
        urgency: c.defaultPriority,
        sentiment: [1, 3, 2, 3, 2][index] ?? Math.round(Math.random() * 4) + 1,
        follow_up_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sla_breach_risk: [11.7, 48.8, 77.1, 47.1, 42.1][index] ?? Math.random() * 100,
      },
    };
  });
}

export async function getActionableCards(): Promise<ActionableCard[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return generateFlipkartActionableCards();
}

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
  getNetworkGraphData,
  getPredictiveMetrics,
};
