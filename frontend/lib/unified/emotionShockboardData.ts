export interface EmotionShockboardEntry {
  channel: string;
  label: string;
  positive: number;
  negative: number;
  topPositive: string[];
  topNegative: string[];
}

const DEFAULT_BARS: EmotionShockboardEntry[] = [
  {
    channel: "email",
    label: "Email",
    positive: 310,
    negative: 380,
    topPositive: [
      "Account Verification Success",
      "Transaction Confirmation",
      "Service Appreciation",
    ],
    topNegative: [
      "Billing Discrepancies",
      "Account Access Issues",
      "Payment Processing Delays",
    ],
  },
  {
    channel: "voice",
    label: "Voice",
    positive: 330,
    negative: 480,
    topPositive: [
      "Mortgage Rate Lock Support",
      "Premium Service Upgrade",
      "Quick Resolution Appreciation",
    ],
    topNegative: [
      "Underwriting Delays",
      "Call Wait Times",
      "Service Escalation Issues",
    ],
  },
  {
    channel: "social",
    label: "Social",
    positive: 270,
    negative: 320,
    topPositive: [
      "Digital Innovation Praise",
      "Customer Service Recognition",
      "Product Feature Appreciation",
    ],
    topNegative: [
      "Credit Card Dispute Delays",
      "Public Complaint Escalation",
      "Service Outage Frustration",
    ],
  },
  {
    channel: "chat",
    label: "Chat",
    positive: 220,
    negative: 210,
    topPositive: [
      "Account Access Reset Success",
      "Instant Support Resolution",
      "Automated Flow Appreciation",
    ],
    topNegative: [
      "Chat Response Delays",
      "Technical Support Issues",
      "Information Inconsistency",
    ],
  },
  {
    channel: "ticket",
    label: "Ticket",
    positive: 310,
    negative: 380,
    topPositive: [
      "Issue Resolution Satisfaction",
      "Follow-up Communication",
      "Problem Resolution Appreciation",
    ],
    topNegative: [
      "Ticket Resolution Delays",
      "Status Update Gaps",
      "Multiple Ticket Escalations",
    ],
  },
];

// Flipkart e-commerce: order, delivery, refund, return, payment clusters for hover tooltips
const FLIPKART_BARS: EmotionShockboardEntry[] = [
  {
    channel: "email",
    label: "Email",
    positive: 310,
    negative: 380,
    topPositive: [
      "Order Confirmation & Tracking",
      "Refund Processed Success",
      "Delivery Update Appreciation",
    ],
    topNegative: [
      "Refund Delays",
      "Order / Delivery Status Confusion",
      "Payment & Coupon Issues",
    ],
  },
  {
    channel: "voice",
    label: "Voice",
    positive: 330,
    negative: 480,
    topPositive: [
      "Quick Refund / Replacement Resolution",
      "Delivery Reschedule Success",
      "Order Support Appreciation",
    ],
    topNegative: [
      "Delivery Delays & OTP Issues",
      "Call Wait Times",
      "Return Pickup & Refund Escalation",
    ],
  },
  {
    channel: "social",
    label: "Social",
    positive: 270,
    negative: 320,
    topPositive: [
      "Product & App Reviews",
      "Customer Service Recognition",
      "Offers & Sale Appreciation",
    ],
    topNegative: [
      "Refund / Return Complaints",
      "Public Delivery Complaints",
      "Seller & Quality Issues",
    ],
  },
  {
    channel: "chat",
    label: "Chat",
    positive: 220,
    negative: 210,
    topPositive: [
      "Order Tracking Resolution",
      "Instant Refund Status",
      "Return Pickup Confirmation",
    ],
    topNegative: [
      "Chat Response Delays",
      "Refund / Replacement Confusion",
      "Wrong Item & Exchange Requests",
    ],
  },
  {
    channel: "ticket",
    label: "Ticket",
    positive: 310,
    negative: 380,
    topPositive: [
      "Issue Resolution Satisfaction",
      "Follow-up on Refund / Delivery",
      "Replacement & Return Closure",
    ],
    topNegative: [
      "Ticket Resolution Delays",
      "Refund Status Update Gaps",
      "Multiple Channel Escalations",
    ],
  },
];

export type EmotionShockboardTheme = "default" | "flipkart";

export function getEmotionShockboardData(theme: EmotionShockboardTheme = "default"): EmotionShockboardEntry[] {
  return theme === "flipkart" ? FLIPKART_BARS : DEFAULT_BARS;
}

