// Premature Closure Risk Audit Data
// Tracks cases where tickets/channels were closed but the same issue was raised again in another channel

export interface ChannelStatus {
  channel: "email" | "ticket" | "chat" | "voice" | "social";
  sentiment: number; // 0-5 scale
  sentimentLabel: string; // "Bit Irritated", "Frustrated", "Anger", etc.
  status: "closed" | "active" | "pending";
  statusLabel: string; // "Resolution", "Escalation", "Investigation", "Follow-up", "Consult", "Awareness"
  timestamp: string;
  closedAt?: string; // If status is "closed"
}

export interface PrematureClosureCase {
  id: string;
  customerId: string;
  issueType: string;
  intentCluster: string;
  timestamp: string;
  riskLevel: "high" | "medium" | "low";
  channels: ChannelStatus[];
  aiAction: string;
  description: string;
}

// Sentiment label mapping
const getSentimentLabel = (score: number): string => {
  if (score <= 1.5) return "Calm";
  if (score <= 2.5) return "Bit Irritated";
  if (score <= 3.5) return "Moderately Concerned";
  if (score <= 4.5) return "Frustrated";
  return "Anger";
};

// Generate premature closure risk cases
export const generatePrematureClosureCases = (): PrematureClosureCase[] => {
  const cases: PrematureClosureCase[] = [];

  // High Risk Case 1
  cases.push({
    id: "1",
    customerId: "C-48152",
    issueType: "Mortgage Rate Lock",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 2:22 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 2:22 PM",
        closedAt: "Nov 6, 2:22 PM",
      },
      {
        channel: "voice",
        sentiment: 4.6,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 6, 2:45 PM",
      },
    ],
    aiAction: "Reopen ticket and assign to compliance QA for premature closure review.",
    description: "Ticket closed while borrower escalated the same rate-lock request via voice with declining sentiment.",
  });

  // Medium Risk Case 2
  cases.push({
    id: "2",
    customerId: "C-77204",
    issueType: "Credit Card Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 7:10 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "chat",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 7:10 PM",
        closedAt: "Nov 5, 7:10 PM",
      },
      {
        channel: "email",
        sentiment: 4.2,
        sentimentLabel: "Anger",
        status: "pending",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 8:30 PM",
      },
      {
        channel: "social",
        sentiment: 4.5,
        sentimentLabel: "Frustrated",
        status: "pending",
        statusLabel: "Awareness",
        timestamp: "Nov 6, 9:15 AM",
      },
    ],
    aiAction: "Link channels in dispute workflow and launch follow-up audit on closure criteria.",
    description: "Chat marked dispute resolved, yet customer continues via email and social with unresolved sentiment and company pending actions.",
  });

  // Low Risk Case 3
  cases.push({
    id: "3",
    customerId: "C-19338",
    issueType: "Premier Package Upgrade",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 4:45 PM",
    riskLevel: "low",
    channels: [
      {
        channel: "voice",
        sentiment: 1.5,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Consult",
        timestamp: "Nov 4, 4:45 PM",
        closedAt: "Nov 4, 4:45 PM",
      },
      {
        channel: "email",
        sentiment: 2.9,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 4, 5:20 PM",
      },
    ],
    aiAction: "Sync concierge checklist completion before voice agents declare upgrade closed.",
    description: "Voice agent confirmed upgrade, yet concierge email follow-up still active with outstanding onboarding tasks.",
  });

  // High Risk Case 4
  cases.push({
    id: "4",
    customerId: "C-52891",
    issueType: "Account Security Breach",
    intentCluster: "Intent cluster",
    timestamp: "Nov 7, 10:15 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.8,
        sentimentLabel: "Moderately Concerned",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 7, 10:15 AM",
        closedAt: "Nov 7, 10:15 AM",
      },
      {
        channel: "ticket",
        sentiment: 4.8,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 7, 11:30 AM",
      },
      {
        channel: "voice",
        sentiment: 5.0,
        sentimentLabel: "Anger",
        status: "pending",
        statusLabel: "Investigation",
        timestamp: "Nov 7, 2:00 PM",
      },
    ],
    aiAction: "Immediately escalate to security team and compliance. Reopen all related channels for coordinated investigation.",
    description: "Email closed as resolved, but customer escalated to ticket and voice with extreme frustration about ongoing security concerns.",
  });

  // Medium Risk Case 5
  cases.push({
    id: "5",
    customerId: "C-33467",
    issueType: "Transaction Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 3:30 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "chat",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 3:30 PM",
        closedAt: "Nov 6, 3:30 PM",
      },
      {
        channel: "email",
        sentiment: 3.8,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 4:45 PM",
      },
    ],
    aiAction: "Review dispute resolution criteria and ensure all transaction details verified before closure.",
    description: "Chat closed dispute, but customer followed up via email with additional transaction evidence requiring investigation.",
  });

  // Low Risk Case 6
  cases.push({
    id: "6",
    customerId: "C-45612",
    issueType: "Card Replacement",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 1:20 PM",
    riskLevel: "low",
    channels: [
      {
        channel: "ticket",
        sentiment: 1.8,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 1:20 PM",
        closedAt: "Nov 5, 1:20 PM",
      },
      {
        channel: "email",
        sentiment: 2.2,
        sentimentLabel: "Bit Irritated",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 5, 2:00 PM",
      },
    ],
    aiAction: "Confirm card delivery status and update customer before closing initial ticket.",
    description: "Ticket closed for card replacement, but customer sent follow-up email to confirm delivery timeline.",
  });

  return cases;
};

