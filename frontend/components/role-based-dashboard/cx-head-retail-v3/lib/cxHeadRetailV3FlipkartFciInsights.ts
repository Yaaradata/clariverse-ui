import type { FCIInsight, FCIInsightDetails } from "@/components/FCI/AISummaryWall";

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

/** Click-through drill-down for each Flipkart FCI insight card */
export const FLIPKART_FCI_INSIGHT_DETAILS: Record<string, FCIInsightDetails> = {
  "FK-001": {
    rootCause:
      "UPI payments are deducting but orders remain stuck in 'processing' during BBD peak — 1,840 contacts today (+38%). Gateway timeout on mobile checkout is hitting Plus shoppers first; fallback processor not yet enabled on the primary rail.",
    affectedAreas: ["Payments", "Mobile Checkout", "UPI Rail", "Plus Members", "BBD Peak Traffic"],
    recommendedActions: [
      "Enable fallback payment processor before evening BBD surge — escalate to Payments + Tech bridge now.",
      "Push in-app status for deducted-but-not-confirmed orders with auto-refund SLA timer visible.",
      "Route HVHF / Plus shoppers to priority voice queue — 412 at churn risk on payment loop.",
      "Quantify GMV at risk from abandoned carts on failed UPI step — share with category heads.",
      "Monitor repeat-contact rate on payment intent until gateway patch is verified in prod.",
    ],
    estimatedImpact: "Critical — ₹18Cr GMV at risk · 34% repeat contact on payment intent",
    timeToResolve: "Immediate — enable fallback before peak (4–6 hours)",
    assignedTo: "Payments Lead · CX Head escalation",
    priority: "immediate",
    priorityLabel: "Immediate Action",
  },
  "FK-002": {
    rootCause:
      "#NeverDelivered is trending on X and Reddit — 1,588 public mentions (+52%). Shoppers posting delivery proof gaps and comparing Flipkart refund speed unfavourably to Amazon Prime; 412 HVHF accounts amplifying the thread.",
    affectedAreas: ["Social / X", "Reddit", "Last-Mile Delivery", "Refunds", "Brand Trust"],
    recommendedActions: [
      "Activate social crisis playbook — status page + courier comms within 60 minutes.",
      "Prioritise refund resolution for shoppers named in viral threads — retention queue live.",
      "Brief influencer-response team on #NeverDelivered narrative vs Amazon Prime SLA.",
      "Pull pin-code level delivery miss list for WH-East and Whitefield hubs today.",
      "Track mention velocity hourly until hashtag growth falls below +20% WoW.",
    ],
    estimatedImpact: "Critical — PR risk · 28% repeat contact on delivery intent",
    timeToResolve: "Immediate — social response in 60 min; delivery fix 24–48h",
    assignedTo: "Social CX · Last-Mile Ops · CX Head",
    priority: "immediate",
    priorityLabel: "Immediate Action",
  },
  "FK-003": {
    rootCause:
      "WH-East express slots missed — late-delivery contacts up 24% WoW. Koramangala and Whitefield hubs driving repeat chat volume; 1,620 delivery contacts today with 18h average resolution time.",
    affectedAreas: ["WH-East", "Express Delivery", "Koramangala Hub", "Whitefield Hub", "Chat / Voice"],
    recommendedActions: [
      "Add weekend shift at WH-East for express slot clearance before next BBD load.",
      "Send proactive ETA SMS to affected pin codes — reduce inbound 'where is my order' volume.",
      "Escalate courier SLA breach to logistics partner with daily miss-rate dashboard.",
      "Flag Plus members in delayed cohort for retention outreach within 2 hours.",
      "Monitor delivery success rate by hub until express miss rate drops below 8%.",
    ],
    estimatedImpact: "High — 1,620 delivery contacts · delivery success down to 84%",
    timeToResolve: "24–72 hours — staffing + courier comms",
    assignedTo: "Fulfilment Ops · CX Delivery Lead",
    priority: "high",
    priorityLabel: "Action Needed",
  },
  "FK-004": {
    rootCause:
      "Refund status confusion loop — 720 repeat contacts where UPI refund shows pending >72h. Auto-status SMS not sent on 340 cases; shoppers calling back because app still shows 'processing' after bank credit.",
    affectedAreas: ["Refunds Desk", "UPI Refunds", "App Status Page", "Voice / Chat", "Payments"],
    recommendedActions: [
      "Trigger batch SMS for 340 cases missing auto-status update — human-approved template.",
      "Fix refund-status sync between payments rail and order timeline in app.",
      "Prioritise >72h pending UPI refunds in ops queue — target same-day closure.",
      "Add IVR deflection with live refund tracker link before agent queue.",
      "Track repeat-contact rate on refund intent until below 25%.",
    ],
    estimatedImpact: "High — 1,980 refund contacts · 41% repeat rate on refund intent",
    timeToResolve: "48 hours — status sync + SMS batch",
    assignedTo: "Refunds Ops · Payments · CX Head",
    priority: "high",
    priorityLabel: "Action Needed",
  },
  "FK-005": {
    rootCause:
      "Hidden platform fee complaints spiking on Play Store reviews — 540 fee-dispute contacts (+14%). Shoppers see cart total mismatch at checkout; fee line item not surfaced early enough in purchase journey.",
    affectedAreas: ["Checkout UX", "Play Store Reviews", "Pricing Transparency", "App Reviews", "Cart"],
    recommendedActions: [
      "Surface all-in price earlier in checkout — product + fee breakdown before pay step.",
      "Draft Play Store response template for fee-shock reviews — legal review required.",
      "A/B test fee transparency banner on top 5 disputed categories this week.",
      "Route fee disputes to dedicated chat macro — avoid repeat escalation to voice.",
      "Monitor Play Store rating daily until back above 4.2 stars.",
    ],
    estimatedImpact: "Medium — 540 fee disputes · review rating at risk",
    timeToResolve: "1–2 weeks — checkout UX fix + comms",
    assignedTo: "Product · Pricing · CX Policy",
    priority: "medium",
    priorityLabel: "Monitor",
  },
  "FK-006": {
    rootCause:
      "Flipkart Plus early-access traffic driving 18% of HVHF volume — 9,550 interactions today (+3%, stable). Delivery ETA questions dominate; no payment spike yet but capacity watch needed before BBD opens.",
    affectedAreas: ["Flipkart Plus", "HVHF Cohort", "Delivery ETA", "Early Access", "Chat"],
    recommendedActions: [
      "Pre-stage Plus-specific delivery ETA macros for BBD opening hour.",
      "Monitor HVHF sentiment on delivery ETA — alert if negative crosses 35%.",
      "Keep payment rail on watchlist — no action until UPI spike clears FK-001.",
      "Share Plus volume forecast with fulfilment for express slot planning.",
      "Continue standard monitoring — no escalation unless repeat contact rises.",
    ],
    estimatedImpact: "Low — positive Plus engagement · no payment spike detected",
    timeToResolve: "Ongoing monitor through BBD window",
    assignedTo: "Plus CX · Fulfilment planning",
    priority: "low",
    priorityLabel: "Monitor",
  },
};
