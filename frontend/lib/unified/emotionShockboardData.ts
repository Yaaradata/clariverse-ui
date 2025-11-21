export interface EmotionShockboardEntry {
  channel: string;
  label: string;
  positive: number;
  negative: number;
  topPositive: string[];
  topNegative: string[];
}

export function getEmotionShockboardData(): EmotionShockboardEntry[] {
  return [
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
}

