/**
 * Flipkart Unified Dashboard – API for Eisenhower threads and priority resolution.
 * getEisenhowerThreads returns e-commerce themed threads; rest re-exported from @/lib/api.
 */

import type { EisenhowerThread } from "@/lib/api";

export type { EisenhowerThread, PriorityResolutionData } from "@/lib/api";
export { generatePriorityResolutionDataForQuadrant } from "@/lib/api";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const ecommerceSubjects = [
  "Order delivery delayed",
  "Refund not received",
  "Payment failed at checkout",
  "Wrong item delivered",
  "Return pickup not scheduled",
  "Replacement request pending",
  "Coupon not applied",
  "Order tracking not updating",
  "Damaged product received",
  "Cancellation not processed",
  "Seller not responding",
  "Delivery address change",
  "Multiple items missing",
  "Refund amount incorrect",
  "Exchange request",
  "Order status inquiry",
  "Payment method issue",
  "Wallet balance not reflecting",
  "Promotion not applicable",
  "Invoice not received",
];

// Priority-specific topic pools so "Topics by Priority" shows distinct intents per P1–P5 (no repetition)
const TOPICS_BY_PRIORITY: Record<string, string[]> = {
  P1: [
    "SLA breach risk",
    "Refund escalation",
    "Payment dispute",
    "Delivery failure",
    "Return not picked",
    "Wrong item delivered",
  ],
  P2: [
    "Order tracking",
    "Return request",
    "Refund delay",
    "Delivery delay",
    "Cancellation pending",
    "Replacement request",
  ],
  P3: [
    "Product enquiry",
    "Exchange request",
    "Coupon issue",
    "Invoice request",
    "Seller query",
    "Warranty claim",
  ],
  P4: [
    "General enquiry",
    "Feedback",
    "Recommendation",
    "Order history",
    "Account update",
    "Promotion enquiry",
  ],
  P5: [
    "Newsletter",
    "Wishlist",
    "Rating request",
    "FAQ",
    "Info only",
    "Archive",
  ],
};
const ecommerceClusters = [
  "Order Issues",
  "Returns & Refunds",
  "Payment & Checkout",
  "Delivery & Logistics",
  "Seller & Marketplace",
  "Account & Offers",
];
const channels: Array<"email" | "chat" | "ticket" | "social" | "voice"> = [
  "email",
  "chat",
  "ticket",
  "social",
  "voice",
];
const urgencies: Array<"critical" | "high" | "medium" | "low"> = [
  "critical",
  "high",
  "medium",
  "low",
];
const actionPendingFrom: Array<"customer" | "company"> = ["customer", "company"];
const assignedTo = ["Rahul M.", "Priya S.", "Amit K.", "Neha R.", "Vikram D.", "Anjali P."];
const nextActions = [
  "Schedule return pickup within 2 hours",
  "Escalate to returns team",
  "Send replacement tracking",
  "Update customer on refund status",
  "Close after delivery confirmation",
  "Assign to payments specialist",
  "Verify warehouse stock",
  "Process refund to original payment",
  "Coordinate with seller",
  "Send coupon for next order",
];

const targetCounts = { do: 12, schedule: 35, delegate: 500, delete: 1457 };
let quadrantCounts = { do: 0, schedule: 0, delegate: 0, delete: 0 };

function generateFlipkartEisenhowerThreads(): EisenhowerThread[] {
  quadrantCounts = { do: 0, schedule: 0, delegate: 0, delete: 0 };
  const threads: EisenhowerThread[] = [];
  const baseSeed = 54321;

  for (let i = 0; i < 2004; i++) {
    const seed = baseSeed + i;
    const business_impact_score = seededRandom(seed) * 100;
    const priority =
      i < targetCounts.do
        ? (i % 2 === 0 ? "P1" : "P2")
        : i < targetCounts.do + targetCounts.schedule
          ? (i % 2 === 0 ? "P2" : "P3")
          : i < targetCounts.do + targetCounts.schedule + targetCounts.delegate
            ? (i % 2 === 0 ? "P3" : "P4")
            : (i % 2 === 0 ? "P4" : "P5");
    const urgency = urgencies[Math.floor(seededRandom(seed + 2) * urgencies.length)];
    const overall_sentiment = Math.round(seededRandom(seed + 3) * 4) + 1;
    const follow_up_required = seededRandom(seed + 4) > 0.6;
    const escalation_count = Math.floor(seededRandom(seed + 5) * 3);
    const sla_compliance_rate = seededRandom(seed + 6) * 100;
    const pool = TOPICS_BY_PRIORITY[priority] ?? TOPICS_BY_PRIORITY.P5;
    const topic = pool[Math.floor(seededRandom(seed + 7) * pool.length)];
    const dominantCluster =
      ecommerceClusters[Math.floor(seededRandom(seed + 7.5) * ecommerceClusters.length)];
    const actionPending =
      actionPendingFrom[Math.floor(seededRandom(seed + 8) * actionPendingFrom.length)];
    const channel = channels[Math.floor(seededRandom(seed + 8.5) * channels.length)];
    const assigned = assignedTo[Math.floor(seededRandom(seed + 9) * assignedTo.length)];
    const nextAction = nextActions[Math.floor(seededRandom(seed + 10) * nextActions.length)];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const randomDaysAgo = Math.floor(seededRandom(seed + 11) * 30);
    const randomHoursAgo = Math.floor(seededRandom(seed + 12) * 24);
    const firstMessageAt = new Date(startDate);
    firstMessageAt.setDate(firstMessageAt.getDate() + randomDaysAgo);
    const lastMessageAt = new Date(firstMessageAt);
    lastMessageAt.setHours(lastMessageAt.getHours() + randomHoursAgo);

    const importance_score = Math.min(
      business_impact_score / 100 +
        (priority === "P1" ? 0.3 : priority === "P2" ? 0.2 : priority === "P3" ? 0.1 : 0) +
        (overall_sentiment <= 2 ? 0.15 : 0) +
        (follow_up_required ? 0.1 : 0) +
        escalation_count * 0.05,
      1
    );
    const urgency_flag =
      (urgency === "critical" ? 1 : urgency === "high" ? 0.8 : urgency === "medium" ? 0.5 : 0.2) +
      (100 - sla_compliance_rate) / 100 * 0.3 +
      Math.min(escalation_count * 0.2, 0.5) +
      (follow_up_required ? 0.2 : 0);

    let quadrant: "do" | "schedule" | "delegate" | "delete";
    if (quadrantCounts.do < targetCounts.do) quadrant = "do";
    else if (quadrantCounts.schedule < targetCounts.schedule) quadrant = "schedule";
    else if (quadrantCounts.delegate < targetCounts.delegate) quadrant = "delegate";
    else quadrant = "delete";
    quadrantCounts[quadrant]++;

    threads.push({
      thread_id: `fk_thread_${i + 1}`,
      subject_norm: ecommerceSubjects[i % ecommerceSubjects.length],
      channel,
      participants: [
        { type: "customer", name: `Customer ${i + 1}`, email: `customer${i + 1}@example.com` },
        { type: "external", name: "Support Agent", email: "support@flipkart.com" },
      ],
      resolution_status: "open",
      priority,
      urgency,
      importance_score: Number(importance_score.toFixed(2)),
      urgency_flag: urgency_flag > 0.6 ? 1 : 0,
      quadrant,
      business_impact_score,
      risk_score: seededRandom(seed + 15) * 100,
      escalation_count,
      follow_up_required,
      overall_sentiment,
      next_action_suggestion: nextAction,
      action_pending_from: actionPending,
      action_pending_status: ["pending", "in_progress", "completed", "overdue"][
        Math.floor(seededRandom(seed + 14) * 4)
      ] as "pending" | "in_progress" | "completed" | "overdue",
      assigned_to: assigned,
      owner: assigned,
      topic,
      dominant_cluster_name: dominantCluster,
      first_message_at: firstMessageAt.toISOString(),
      last_message_at: lastMessageAt.toISOString(),
    });
  }

  return threads;
}

export async function getEisenhowerThreads(): Promise<EisenhowerThread[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateFlipkartEisenhowerThreads();
}
