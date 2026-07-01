import type { FCIInsight } from "@/components/FCI/AISummaryWall";

/** Flipkart CX Head — AI insight wall for customer happiness drill-down */
export const FLIPKART_FCI_INSIGHTS: FCIInsight[] = [
  {
    id: "FK-001",
    severity: "critical",
    category: "system-issue",
    title: "UPI checkout step failing at peak",
    message:
      "1,840 contacts today on UPI deducted-but-order-stuck — Payments gateway patch pending before evening BBD traffic",
    trend: "up",
    change: 38,
    metrics: {
      volume: 1840,
      volumeLabel: "contacts today",
      customerImpact: "Critical",
      repeatRate: 34,
    },
  },
  {
    id: "FK-002",
    severity: "critical",
    category: "customer-experience",
    title: "#NeverDelivered trending on X / Reddit",
    message:
      "Viral hashtag crossing into news cycle — 412 HVHF shoppers comparing refund speed vs Amazon Prime",
    trend: "up",
    change: 52,
    metrics: {
      volume: 1588,
      volumeLabel: "public mentions",
      customerImpact: "Critical",
      repeatRate: 28,
    },
  },
  {
    id: "FK-003",
    severity: "alert",
    category: "sla-breach",
    title: "WH-East backlog · Express slots missed",
    message:
      "Late-delivery contacts up 24% WoW — Koramangala & Whitefield hubs driving repeat chat volume",
    trend: "up",
    change: 24,
    metrics: {
      volume: 1620,
      volumeLabel: "delivery contacts",
      responseTime: "18h avg",
      customerImpact: "High",
    },
  },
  {
    id: "FK-004",
    severity: "alert",
    category: "customer-experience",
    title: "Refund status confusion loop",
    message:
      "720 repeat contacts where UPI refund shows pending >72h — auto-status SMS not sent on 340 cases",
    trend: "up",
    change: 19,
    metrics: {
      volume: 1980,
      volumeLabel: "refund contacts",
      customerImpact: "High",
      repeatRate: 41,
    },
  },
  {
    id: "FK-005",
    severity: "warning",
    category: "operational",
    title: "Hidden platform fee · checkout shock",
    message:
      "Review-site spike on unexpected fees — shoppers flagging total mismatch vs cart on Play Store",
    trend: "up",
    change: 14,
    metrics: {
      volume: 540,
      volumeLabel: "fee disputes",
      customerImpact: "Medium",
    },
  },
  {
    id: "FK-006",
    severity: "info",
    category: "product-update",
    title: "Flipkart Plus early-access traffic",
    message:
      "Plus members driving 18% of HVHF volume — delivery ETA questions dominate, no payment spike yet",
    trend: "stable",
    change: 3,
    metrics: {
      volume: 9550,
      volumeLabel: "HVHF interactions",
      customerImpact: "Low",
    },
  },
];
