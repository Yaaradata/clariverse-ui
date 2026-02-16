// Cross-Channel Interaction Breakdown Audit Data
// Tracks cases where tickets/channels were closed but the same issue was raised again in another channel

export interface ChannelStatus {
  channel: "email" | "ticket" | "chat" | "voice" | "social";
  sentiment: number; // 0-5 scale
  sentimentLabel: string; // "Bit Irritated", "Frustrated", "Anger", etc.
  status: "closed" | "active" | "pending";
  statusLabel: string; // "Resolution", "Escalation", "Investigation", "Follow-up", "Consult", "Awareness"
  timestamp: string;
  closedAt?: string; // If status is "closed"
  openedAt?: string; // If status is "active" or "pending"
  pendingAction?: string; // For Unactioned Escalations
  interactions?: Array<{ timestamp: string; action: string }>; // For Escalation Loops
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

// E-commerce (Flipkart) copy overrides — same case structure, order/refund/delivery intent
const FLIPKART_CASE_OVERRIDES: Record<string, { issueType: string; description: string; aiAction: string }> = {
  "1": { issueType: "Refund Not Received", description: "Chat marked refund resolved at 3:45 PM, yet customer sent email at 4:00 PM expressing anger that refund is NOT received.", aiAction: "Link channels in returns workflow and confirm refund credit before closing." },
  "2": { issueType: "Order / Account Security", description: "Email closed as resolved at 10:15 AM, but customer escalated to ticket at 11:30 AM with extreme frustration.", aiAction: "Escalate to security and support. Reopen related channels." },
  "3": { issueType: "Payment / Refund Dispute", description: "Voice call closed payment dispute at 3:30 PM, but customer followed up via chat at 4:45 PM with order evidence.", aiAction: "Verify refund/payment resolution and sync all channels before closure." },
  "4": { issueType: "Coupon / Price Dispute", description: "Ticket closed coupon dispute at 2:00 PM, but customer opened email at 4:00 PM with ongoing concerns.", aiAction: "Review offer terms and provide clear response to prevent escalation." },
  "5": { issueType: "Order Status Update", description: "Chat closed order inquiry at 9:00 AM, but customer called at 11:00 AM with urgent delivery status request.", aiAction: "Update order status across all channels before closing chat." },
  "6": { issueType: "Delivery / OTP Verification", description: "Email closed verification as complete at 3:00 PM, but customer opened ticket at 5:00 PM reporting delivery still pending.", aiAction: "Confirm delivery/OTP completion before closing multiple channels." },
  "7": { issueType: "Refund Amount Discrepancy", description: "Voice call closed refund inquiry at 2:30 PM, but customer sent email at 3:15 PM that refund amount was not corrected.", aiAction: "Verify refund amount and sync channels before closing voice." },
  "8": { issueType: "Payment Failed for Order", description: "Ticket closed payment error at 11:00 AM, but customer started chat at 11:45 AM reporting same payment failure.", aiAction: "Investigate payment failure and sync channels before closing ticket." },
  "9": { issueType: "Wallet Balance Discrepancy", description: "Chat closed wallet inquiry at 9:00 AM, but customer called at 9:30 AM reporting balance still wrong.", aiAction: "Verify wallet balance and sync before closing chat." },
  "10": { issueType: "Refund Statement Error", description: "Email closed refund statement at 4:00 PM, but customer called at 5:30 PM that statement was not corrected.", aiAction: "Confirm refund statement update before closing email." },
  "11": { issueType: "Payment / Checkout Error", description: "Email and chat both closed payment issue as resolved on Nov 2, but same error recurred and customer created new ticket on Nov 3.", aiAction: "Root cause analysis. Recurring payment errors need systemic fix." },
  "12": { issueType: "Account / Login Access", description: "Ticket and email closed account access on Nov 1, but customer called on Nov 2 reporting access still blocked.", aiAction: "Verify account access restored before closing channels." },
  "13": { issueType: "Refund Reversal", description: "Email and chat both closed refund reversal as resolved on Nov 1, but same issue returned requiring ticket on Nov 2.", aiAction: "Investigate why refund reversal was marked resolved when issue persists." },
  "14": { issueType: "Account / Order Hold", description: "Voice and ticket closed account hold on Nov 2, but customer escalated to email on Nov 4 with extreme anger.", aiAction: "Review hold status and provide resolution timeline." },
  "15": { issueType: "Refund / Payment Failed Notification", description: "Customer contacted email, chat, and voice simultaneously about same refund or payment failure within 12 minutes, creating duplicate cases.", aiAction: "Consolidate all channels into single case and assign dedicated agent to prevent duplicate work." },
  "16": { issueType: "Order / Refund Status Inquiry", description: "Customer opened order and refund status in chat, email, and ticket within 20 minutes, creating duplicate interactions.", aiAction: "Link all status inquiries and provide one response to avoid confusion." },
  "17": { issueType: "Replacement / Exchange Request", description: "Customer contacted email, voice, and chat about replacement request within 15 minutes, creating duplicate work.", aiAction: "Consolidate replacement requests and assign single agent." },
  "18": { issueType: "Suspected Fraud / Unauthorised Order", description: "Customer bounced between chat and email - chat closed at 3:45 PM, email at 4:30 PM, but customer returned to chat at 6:00 PM about order being blocked.", aiAction: "Unify case and assign specialist; ensure block reason communicated." },
  "19": { issueType: "Delivery Charge Dispute", description: "Customer bounced between email and chat - email closed at 4:00 PM, chat at 6:00 PM, but customer returned to email at 7:00 PM about unfair charges.", aiAction: "Review delivery charges and provide clear resolution." },
  "20": { issueType: "EMI / Payment Plan", description: "Customer bounced between ticket and voice - ticket closed at 9:00 AM, voice at 11:30 AM, but customer returned to ticket at 2:00 PM about payment plan.", aiAction: "Sync EMI/payment plan status across channels." },
  "21": { issueType: "Account / Order Hold", description: "Customer bounced between chat and email - chat closed at 2:00 PM, email at 4:30 PM, but customer returned to chat at 6:00 PM about account hold.", aiAction: "Resolve hold and communicate consistently." },
  "22": { issueType: "Refund Transfer Delay", description: "Customer bounced between email and voice - email closed at 9:30 AM, voice at 11:30 AM, but customer returned to email at 1:00 PM about delayed refund.", aiAction: "Confirm refund credit and timeline; sync channels." },
  "23": { issueType: "Credit Limit / Buy Now Pay Later", description: "Customer bounced between voice and chat - voice closed at 3:15 PM, chat at 5:30 PM, but customer returned to voice at 7:00 PM about limit denial.", aiAction: "Provide clear eligibility response and sync channels." },
  "24": { issueType: "Payment Method / Card Not Working", description: "Customer bounced between ticket and voice - ticket closed at 1:45 PM, voice at 4:00 PM, but customer returned to ticket at 5:30 PM about payment not working.", aiAction: "Fix payment method issue and confirm across channels." },
  "25": { issueType: "EMI / Payment Not Reflected", description: "Customer bounced between email and voice - email closed at 10:20 AM, voice at 2:30 PM, but customer returned to email at 4:00 PM about payment not reflected.", aiAction: "Verify payment posting and sync channels." },
  "26": { issueType: "Rewards / Cashback Calculation", description: "Customer bounced between chat and ticket - chat closed at 2:30 PM, ticket at 4:45 PM, but customer returned to chat at 6:00 PM about incorrect cashback.", aiAction: "Correct rewards/cashback and communicate clearly." },
  "27": { issueType: "Replacement Delivery", description: "Ticket closed for replacement on Nov 4, but customer sent follow-up email on Nov 5 that remains pending for delivery confirmation.", aiAction: "Confirm replacement delivery and close pending investigation." },
  "28": { issueType: "Refund / Statement Error", description: "Email closed refund/statement on Nov 4, but customer opened ticket that remains pending for back office review.", aiAction: "Review refund correction and update ticket before closing email." },
};

export type PrematureClosureTheme = "default" | "flipkart";

// Generate premature closure risk cases with realistic breakdown patterns
export const generatePrematureClosureCases = (theme: PrematureClosureTheme = "default"): PrematureClosureCase[] => {
  const cases: PrematureClosureCase[] = [];

  // ============================================
  // 1️⃣ INCONSISTENT CLOSURE CASES
  // One channel closed, another active simultaneously (within 2 hours)
  // ============================================

  // Case 1: Chat closed → Email active (near-simultaneous)
  cases.push({
    id: "1",
    customerId: "C-77204",
    issueType: "Credit Card Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 3:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "chat",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 3:45 PM",
        closedAt: "Nov 5, 3:45 PM",
      },
      {
        channel: "email",
        sentiment: 4.2,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 4:00 PM",
        openedAt: "Nov 5, 4:00 PM",
      },
    ],
    aiAction: "Link channels in dispute workflow and launch follow-up audit on closure criteria.",
    description: "Chat marked dispute resolved at 3:45 PM, yet customer sent email at 4:00 PM expressing anger that issue is NOT resolved.",
  });

  // Case 2: Email closed → Ticket active (near-simultaneous)
  cases.push({
    id: "2",
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
        openedAt: "Nov 7, 11:30 AM",
      },
    ],
    aiAction: "Immediately escalate to security team and compliance. Reopen all related channels.",
    description: "Email closed as resolved at 10:15 AM, but customer escalated to ticket at 11:30 AM with extreme frustration.",
  });

  // Case 3: Voice closed → Chat active (near-simultaneous)
  cases.push({
    id: "3",
    customerId: "C-33467",
    issueType: "Transaction Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 3:30 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "voice",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 3:30 PM",
        closedAt: "Nov 6, 3:30 PM",
      },
      {
        channel: "chat",
        sentiment: 3.8,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 4:45 PM",
        openedAt: "Nov 6, 4:45 PM",
      },
    ],
    aiAction: "Review dispute resolution criteria and ensure all transaction details verified before closure.",
    description: "Voice call closed dispute at 3:30 PM, but customer followed up via chat at 4:45 PM with additional transaction evidence.",
  });

  // Case 4: Ticket closed → Email active (near-simultaneous)
  cases.push({
    id: "4",
    customerId: "C-44567",
    issueType: "Fee Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 3, 2:00 PM",
    riskLevel: "low",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 2:00 PM",
        closedAt: "Nov 3, 2:00 PM",
      },
      {
        channel: "email",
        sentiment: 3.2,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 3, 4:00 PM",
        openedAt: "Nov 3, 4:00 PM",
      },
    ],
    aiAction: "Review fee structure and provide clear explanation to prevent further escalation.",
    description: "Ticket closed fee dispute at 2:00 PM, but customer opened email at 4:00 PM with ongoing concerns.",
  });

  // Case 5: Chat closed → Voice active (near-simultaneous)
  cases.push({
    id: "5",
    customerId: "C-55678",
    issueType: "Loan Application Status",
    intentCluster: "Intent cluster",
    timestamp: "Nov 2, 9:00 AM",
    riskLevel: "medium",
    channels: [
      {
        channel: "chat",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 2, 9:00 AM",
        closedAt: "Nov 2, 9:00 AM",
      },
      {
        channel: "voice",
        sentiment: 4.1,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 2, 11:00 AM",
        openedAt: "Nov 2, 11:00 AM",
      },
    ],
    aiAction: "Update loan application status across all channels before closing chat thread.",
    description: "Chat closed loan inquiry at 9:00 AM, but customer called at 11:00 AM with urgent status update request.",
  });

  // Case 6: Email closed → Ticket active (near-simultaneous)
  cases.push({
    id: "6",
    customerId: "C-66789",
    issueType: "Account Verification Delay",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 3:00 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "email",
        sentiment: 2.2,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 3:00 PM",
        closedAt: "Nov 4, 3:00 PM",
      },
      {
        channel: "ticket",
        sentiment: 4.2,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 4, 5:00 PM",
        openedAt: "Nov 4, 5:00 PM",
      },
    ],
    aiAction: "Verify account verification process completion before closing multiple channels.",
    description: "Email closed verification as complete at 3:00 PM, but customer opened ticket at 5:00 PM reporting verification still pending.",
  });

  // Case 7: Voice closed → Email active (near-simultaneous)
  cases.push({
    id: "7",
    customerId: "C-11234",
    issueType: "Loan Payment Discrepancy",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 2:30 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "voice",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 2:30 PM",
        closedAt: "Nov 6, 2:30 PM",
      },
      {
        channel: "email",
        sentiment: 4.3,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 3:15 PM",
        openedAt: "Nov 6, 3:15 PM",
      },
    ],
    aiAction: "Review loan payment processing and verify payment was correctly applied before closing voice channel.",
    description: "Voice call closed loan payment inquiry at 2:30 PM, but customer sent email at 3:15 PM expressing frustration that payment discrepancy was not resolved.",
  });

  // Case 8: Ticket closed → Chat active (near-simultaneous)
  cases.push({
    id: "8",
    customerId: "C-22345",
    issueType: "Debit Card Transaction Error",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 11:00 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.4,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 11:00 AM",
        closedAt: "Nov 5, 11:00 AM",
      },
      {
        channel: "chat",
        sentiment: 4.1,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 11:45 AM",
        openedAt: "Nov 5, 11:45 AM",
      },
    ],
    aiAction: "Investigate debit card transaction error and ensure all channels are synchronized before closing ticket.",
    description: "Ticket closed transaction error at 11:00 AM, but customer started chat at 11:45 AM reporting the same error still occurring.",
  });

  // Case 9: Chat closed → Voice active (near-simultaneous)
  cases.push({
    id: "9",
    customerId: "C-33456",
    issueType: "Account Balance Discrepancy",
    intentCluster: "Intent cluster",
    timestamp: "Nov 7, 9:00 AM",
    riskLevel: "medium",
    channels: [
      {
        channel: "chat",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 7, 9:00 AM",
        closedAt: "Nov 7, 9:00 AM",
      },
      {
        channel: "voice",
        sentiment: 3.9,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 7, 9:30 AM",
        openedAt: "Nov 7, 9:30 AM",
      },
    ],
    aiAction: "Verify account balance calculation and ensure all transactions are properly reflected before closing chat.",
    description: "Chat closed balance inquiry at 9:00 AM, but customer called at 9:30 AM reporting balance discrepancy still exists.",
  });

  // Case 10: Email closed → Voice active (near-simultaneous)
  cases.push({
    id: "10",
    customerId: "C-44567",
    issueType: "Credit Card Statement Error",
    intentCluster: "Intent cluster",
    timestamp: "Nov 3, 4:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.5,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 4:00 PM",
        closedAt: "Nov 3, 4:00 PM",
      },
      {
        channel: "voice",
        sentiment: 4.4,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 3, 5:30 PM",
        openedAt: "Nov 3, 5:30 PM",
      },
    ],
    aiAction: "Review credit card statement correction process and ensure statement is updated before closing email.",
    description: "Email closed statement error at 4:00 PM, but customer called at 5:30 PM with frustration that statement error was not corrected.",
  });

  // ============================================
  // 2️⃣ RECURRENCE AFTER RESOLUTION CASES
  // All channels closed, then new channel opens later (1+ days gap)
  // ============================================

  // Case 11: Email + Chat closed → Ticket opened later (recurrence)
  cases.push({
    id: "11",
    customerId: "C-99234",
    issueType: "Payment Processing Error",
    intentCluster: "Intent cluster",
    timestamp: "Nov 2, 1:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 2, 1:00 PM",
        closedAt: "Nov 2, 1:00 PM",
      },
      {
        channel: "chat",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 2, 1:15 PM",
        closedAt: "Nov 2, 1:15 PM",
      },
      {
        channel: "ticket",
        sentiment: 4.5,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 3, 3:00 PM",
        openedAt: "Nov 3, 3:00 PM",
      },
    ],
    aiAction: "Root cause analysis required. Payment error recurring indicates systemic issue.",
    description: "Email and chat both closed payment issue as resolved on Nov 2, but same error occurred again and customer created new ticket on Nov 3.",
  });

  // Case 12: Ticket + Email closed → Voice opened later (recurrence)
  cases.push({
    id: "12",
    customerId: "C-77890",
    issueType: "Account Access Issue",
    intentCluster: "Intent cluster",
    timestamp: "Nov 1, 1:00 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 1, 1:00 PM",
        closedAt: "Nov 1, 1:00 PM",
      },
      {
        channel: "email",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 1, 2:30 PM",
        closedAt: "Nov 1, 2:30 PM",
      },
      {
        channel: "voice",
        sentiment: 3.9,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 2, 9:00 AM",
        openedAt: "Nov 2, 9:00 AM",
      },
    ],
    aiAction: "Verify account access was actually restored before closing channels.",
    description: "Ticket and email closed account access issue on Nov 1, but customer called on Nov 2 reporting access still blocked.",
  });

  // Case 13: Chat + Email closed → Ticket opened later (recurrence)
  cases.push({
    id: "13",
    customerId: "C-88901",
    issueType: "Transaction Reversal",
    intentCluster: "Intent cluster",
    timestamp: "Nov 1, 10:00 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "chat",
        sentiment: 2.2,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 1, 10:00 AM",
        closedAt: "Nov 1, 10:00 AM",
      },
      {
        channel: "email",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 1, 11:00 AM",
        closedAt: "Nov 1, 11:00 AM",
      },
      {
        channel: "ticket",
        sentiment: 4.3,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 2, 2:00 PM",
        openedAt: "Nov 2, 2:00 PM",
      },
    ],
    aiAction: "Investigate why transaction reversal was marked resolved when issue persists.",
    description: "Email and chat both closed transaction reversal as resolved on Nov 1, but same issue returned requiring ticket escalation on Nov 2.",
  });

  // Case 14: Voice + Ticket closed → Email opened later (recurrence)
  cases.push({
    id: "14",
    customerId: "C-99012",
    issueType: "Account Freeze",
    intentCluster: "Intent cluster",
    timestamp: "Nov 2, 2:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "voice",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 2, 2:00 PM",
        closedAt: "Nov 2, 2:00 PM",
      },
      {
        channel: "ticket",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 2, 3:30 PM",
        closedAt: "Nov 2, 3:30 PM",
      },
      {
        channel: "email",
        sentiment: 4.8,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 4, 4:00 PM",
        openedAt: "Nov 4, 4:00 PM",
      },
    ],
    aiAction: "Immediately review account freeze status and provide resolution timeline.",
    description: "Voice and ticket closed account freeze inquiry on Nov 2, but customer escalated to email on Nov 4 with extreme anger.",
  });

  // ============================================
  // 3️⃣ DUPLICATE INTERACTIONS CASES
  // All channels active simultaneously (within 15-30 minutes)
  // ============================================

  // Case 15: Email + Chat + Voice all active simultaneously
  cases.push({
    id: "15",
    customerId: "C-12345",
    issueType: "Transfer Failed Notification",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 8:00 AM",
    riskLevel: "medium",
    channels: [
      {
        channel: "email",
        sentiment: 3.2,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 8:00 AM",
        openedAt: "Nov 5, 8:00 AM",
      },
      {
        channel: "chat",
        sentiment: 3.5,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 8:05 AM",
        openedAt: "Nov 5, 8:05 AM",
      },
      {
        channel: "voice",
        sentiment: 3.8,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 8:12 AM",
        openedAt: "Nov 5, 8:12 AM",
      },
    ],
    aiAction: "Consolidate all channels into single case and assign dedicated agent to prevent duplicate work.",
    description: "Customer contacted email, chat, and voice simultaneously about same transfer failure within 12 minutes, creating duplicate cases.",
  });

  // Case 16: Chat + Email + Ticket all active simultaneously
  cases.push({
    id: "16",
    customerId: "C-67890",
    issueType: "Balance Inquiry",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 1:00 PM",
    riskLevel: "low",
    channels: [
      {
        channel: "chat",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 4, 1:00 PM",
        openedAt: "Nov 4, 1:00 PM",
      },
      {
        channel: "email",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 4, 1:10 PM",
        openedAt: "Nov 4, 1:10 PM",
      },
      {
        channel: "ticket",
        sentiment: 2.5,
        sentimentLabel: "Bit Irritated",
        status: "active",
        statusLabel: "Follow-up",
        timestamp: "Nov 4, 1:20 PM",
        openedAt: "Nov 4, 1:20 PM",
      },
    ],
    aiAction: "Link all balance inquiry channels and provide unified response to prevent confusion.",
    description: "Customer opened balance inquiry in chat, email, and ticket within 20 minutes, creating duplicate interactions.",
  });

  // Case 17: Email + Voice + Chat all active simultaneously
  cases.push({
    id: "17",
    customerId: "C-23456",
    issueType: "Card Replacement Request",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 10:00 AM",
    riskLevel: "medium",
    channels: [
      {
        channel: "email",
        sentiment: 2.8,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 10:00 AM",
        openedAt: "Nov 6, 10:00 AM",
      },
      {
        channel: "voice",
        sentiment: 3.1,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 10:08 AM",
        openedAt: "Nov 6, 10:08 AM",
      },
      {
        channel: "chat",
        sentiment: 3.3,
        sentimentLabel: "Moderately Concerned",
        status: "active",
        statusLabel: "Investigation",
        timestamp: "Nov 6, 10:15 AM",
        openedAt: "Nov 6, 10:15 AM",
      },
    ],
    aiAction: "Consolidate card replacement requests across all channels and assign single agent.",
    description: "Customer contacted email, voice, and chat about card replacement within 15 minutes, creating duplicate work.",
  });

  // ============================================
  // 4️⃣ ESCALATION LOOPS CASES
  // Channels bouncing back and forth (open → close → reopen pattern)
  // ============================================

  // Case 18: Chat closed → Email active → Email closed → Chat reopened
  cases.push({
    id: "18",
    customerId: "C-34567",
    issueType: "Fraud Alert",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 3:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "chat",
        sentiment: 2.5,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 3:45 PM",
        closedAt: "Nov 4, 3:45 PM",
        interactions: [
          { timestamp: "Nov 4, 3:00 PM", action: "Opened" },
          { timestamp: "Nov 4, 3:45 PM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 5, 6:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "email",
        sentiment: 4.2,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 4:00 PM",
        closedAt: "Nov 4, 4:30 PM",
        interactions: [
          { timestamp: "Nov 4, 4:00 PM", action: "Opened - Customer unsatisfied with chat" },
          { timestamp: "Nov 4, 4:30 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "chat",
        sentiment: 4.7,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 5, 6:00 PM",
        openedAt: "Nov 5, 6:00 PM",
        interactions: [
          { timestamp: "Nov 5, 6:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Fraud alerts require immediate attention. Consolidate all channels and assign dedicated fraud specialist to prevent channel bouncing.",
    description: "Customer bounced between chat and email - chat closed at 3:45 PM, email closed at 4:30 PM, but customer returned to chat at 6:00 PM with escalating frustration about card being blocked.",
  });

  // Case 19: Email closed → Chat active → Chat closed → Email reopened
  cases.push({
    id: "19",
    customerId: "C-78901",
    issueType: "Overdraft Fee Dispute",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 4:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.2,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 4:00 PM",
        closedAt: "Nov 5, 4:00 PM",
        interactions: [
          { timestamp: "Nov 5, 4:00 PM", action: "Opened" },
          { timestamp: "Nov 5, 4:00 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "chat",
        sentiment: 4.1,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 5:30 PM",
        closedAt: "Nov 5, 6:00 PM",
        interactions: [
          { timestamp: "Nov 5, 5:30 PM", action: "Opened - Customer unsatisfied with email" },
          { timestamp: "Nov 5, 6:00 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "email",
        sentiment: 4.9,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 5, 7:00 PM",
        openedAt: "Nov 5, 7:00 PM",
        interactions: [
          { timestamp: "Nov 5, 7:00 PM", action: "Reopened - Customer extremely angry" },
        ],
      },
    ],
    aiAction: "Review overdraft fee policy and consolidate all channels. Provide unified resolution to prevent customer bouncing between channels.",
    description: "Customer bounced between email and chat - email closed at 4:00 PM, chat closed at 6:00 PM, but customer returned to email at 7:00 PM with extreme anger about unfair charges.",
  });

  // Case 20: Ticket closed → Voice active → Voice closed → Ticket reopened
  cases.push({
    id: "20",
    customerId: "C-48152",
    issueType: "Mortgage Rate Lock",
    intentCluster: "Intent cluster",
    timestamp: "Nov 3, 9:00 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.4,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 9:00 AM",
        closedAt: "Nov 3, 9:00 AM",
        interactions: [
          { timestamp: "Nov 3, 9:00 AM", action: "Opened" },
          { timestamp: "Nov 3, 9:00 AM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 3, 2:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "voice",
        sentiment: 4.3,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 11:00 AM",
        closedAt: "Nov 3, 11:30 AM",
        interactions: [
          { timestamp: "Nov 3, 11:00 AM", action: "Opened - Customer called after ticket closed" },
          { timestamp: "Nov 3, 11:30 AM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "ticket",
        sentiment: 4.6,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 3, 2:00 PM",
        openedAt: "Nov 3, 2:00 PM",
        interactions: [
          { timestamp: "Nov 3, 2:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Reopen ticket and assign to compliance QA for premature closure review. Consolidate all channels to prevent customer bouncing.",
    description: "Customer bounced between ticket and voice - ticket closed at 9:00 AM, voice closed at 11:30 AM, but borrower returned to ticket at 2:00 PM with escalating frustration about rate-lock request.",
  });

  // Case 21: Chat closed → Email active → Email closed → Chat reopened
  cases.push({
    id: "21",
    customerId: "C-99012",
    issueType: "Account Freeze",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 2:00 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "chat",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 2:00 PM",
        closedAt: "Nov 4, 2:00 PM",
        interactions: [
          { timestamp: "Nov 4, 2:00 PM", action: "Opened" },
          { timestamp: "Nov 4, 2:00 PM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 4, 6:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "email",
        sentiment: 4.2,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 4:00 PM",
        closedAt: "Nov 4, 4:30 PM",
        interactions: [
          { timestamp: "Nov 4, 4:00 PM", action: "Opened - Customer unsatisfied with chat" },
          { timestamp: "Nov 4, 4:30 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "chat",
        sentiment: 4.8,
        sentimentLabel: "Anger",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 4, 6:00 PM",
        openedAt: "Nov 4, 6:00 PM",
        interactions: [
          { timestamp: "Nov 4, 6:00 PM", action: "Reopened - Customer extremely angry" },
        ],
      },
    ],
    aiAction: "Immediately review account freeze status and consolidate all channels. Provide unified resolution timeline to prevent customer bouncing.",
    description: "Customer bounced between chat and email - chat closed at 2:00 PM, email closed at 4:30 PM, but customer returned to chat at 6:00 PM with extreme anger about account freeze.",
  });

  // Case 22: Email closed → Voice active → Voice closed → Email reopened
  cases.push({
    id: "22",
    customerId: "C-11223",
    issueType: "Wire Transfer Delay",
    intentCluster: "Intent cluster",
    timestamp: "Nov 7, 9:30 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.1,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 7, 9:30 AM",
        closedAt: "Nov 7, 9:30 AM",
        interactions: [
          { timestamp: "Nov 7, 9:30 AM", action: "Opened" },
          { timestamp: "Nov 7, 9:30 AM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 7, 1:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "voice",
        sentiment: 4.3,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 7, 11:00 AM",
        closedAt: "Nov 7, 11:30 AM",
        interactions: [
          { timestamp: "Nov 7, 11:00 AM", action: "Opened - Customer called after email closed" },
          { timestamp: "Nov 7, 11:30 AM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "email",
        sentiment: 4.5,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 7, 1:00 PM",
        openedAt: "Nov 7, 1:00 PM",
        interactions: [
          { timestamp: "Nov 7, 1:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Investigate wire transfer processing delay and consolidate all channels. Provide immediate status update to prevent customer bouncing.",
    description: "Customer bounced between email and voice - email closed at 9:30 AM, voice closed at 11:30 AM, but customer returned to email at 1:00 PM with high frustration about missing funds.",
  });

  // Case 23: Voice closed → Chat active → Chat closed → Voice reopened
  cases.push({
    id: "23",
    customerId: "C-22334",
    issueType: "Credit Limit Increase Request",
    intentCluster: "Intent cluster",
    timestamp: "Nov 6, 3:15 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "voice",
        sentiment: 2.4,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 3:15 PM",
        closedAt: "Nov 6, 3:15 PM",
        interactions: [
          { timestamp: "Nov 6, 3:15 PM", action: "Opened" },
          { timestamp: "Nov 6, 3:15 PM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 6, 7:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "chat",
        sentiment: 4.1,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 6, 5:00 PM",
        closedAt: "Nov 6, 5:30 PM",
        interactions: [
          { timestamp: "Nov 6, 5:00 PM", action: "Opened - Customer unsatisfied with voice" },
          { timestamp: "Nov 6, 5:30 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "voice",
        sentiment: 4.3,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 6, 7:00 PM",
        openedAt: "Nov 6, 7:00 PM",
        interactions: [
          { timestamp: "Nov 6, 7:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Review credit limit increase criteria and consolidate all channels. Provide clear explanation to prevent customer bouncing between channels.",
    description: "Customer bounced between voice and chat - voice closed at 3:15 PM, chat closed at 5:30 PM, but customer returned to voice call at 7:00 PM with frustration about denial.",
  });

  // Case 24: Ticket closed → Voice active → Voice closed → Ticket reopened
  cases.push({
    id: "24",
    customerId: "C-33445",
    issueType: "Debit Card Activation Issue",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 1:45 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "ticket",
        sentiment: 2.2,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 1:45 PM",
        closedAt: "Nov 5, 1:45 PM",
        interactions: [
          { timestamp: "Nov 5, 1:45 PM", action: "Opened" },
          { timestamp: "Nov 5, 1:45 PM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 5, 5:30 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "voice",
        sentiment: 4.5,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 5, 3:30 PM",
        closedAt: "Nov 5, 4:00 PM",
        interactions: [
          { timestamp: "Nov 5, 3:30 PM", action: "Opened - Customer called after ticket closed" },
          { timestamp: "Nov 5, 4:00 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "ticket",
        sentiment: 4.7,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 5, 5:30 PM",
        openedAt: "Nov 5, 5:30 PM",
        interactions: [
          { timestamp: "Nov 5, 5:30 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Verify debit card activation status and consolidate all channels. Provide immediate resolution to prevent customer bouncing between channels.",
    description: "Customer bounced between ticket and voice - ticket closed at 1:45 PM, voice closed at 4:00 PM, but customer returned to ticket at 5:30 PM with high frustration about card not working.",
  });

  // Case 25: Email closed → Voice active → Voice closed → Email reopened
  cases.push({
    id: "25",
    customerId: "C-44556",
    issueType: "Mortgage Payment Processing",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 10:20 AM",
    riskLevel: "high",
    channels: [
      {
        channel: "email",
        sentiment: 2.3,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 10:20 AM",
        closedAt: "Nov 4, 10:20 AM",
        interactions: [
          { timestamp: "Nov 4, 10:20 AM", action: "Opened" },
          { timestamp: "Nov 4, 10:20 AM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 4, 4:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "voice",
        sentiment: 4.4,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 2:00 PM",
        closedAt: "Nov 4, 2:30 PM",
        interactions: [
          { timestamp: "Nov 4, 2:00 PM", action: "Opened - Customer called after email closed" },
          { timestamp: "Nov 4, 2:30 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "email",
        sentiment: 4.6,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 4, 4:00 PM",
        openedAt: "Nov 4, 4:00 PM",
        interactions: [
          { timestamp: "Nov 4, 4:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Review mortgage payment processing and consolidate all channels. Ensure payment was correctly applied to prevent customer bouncing.",
    description: "Customer bounced between email and voice - email closed at 10:20 AM, voice closed at 2:30 PM, but customer returned to email at 4:00 PM with frustration about payment not reflected.",
  });

  // Case 26: Chat closed → Ticket active → Ticket closed → Chat reopened
  cases.push({
    id: "26",
    customerId: "C-55667",
    issueType: "Savings Account Interest Calculation",
    intentCluster: "Intent cluster",
    timestamp: "Nov 3, 2:30 PM",
    riskLevel: "high",
    channels: [
      {
        channel: "chat",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 2:30 PM",
        closedAt: "Nov 3, 2:30 PM",
        interactions: [
          { timestamp: "Nov 3, 2:30 PM", action: "Opened" },
          { timestamp: "Nov 3, 2:30 PM", action: "Closed - Marked Resolved" },
          { timestamp: "Nov 3, 6:00 PM", action: "Reopened by customer" },
        ],
      },
      {
        channel: "ticket",
        sentiment: 4.2,
        sentimentLabel: "Frustrated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 3, 4:15 PM",
        closedAt: "Nov 3, 4:45 PM",
        interactions: [
          { timestamp: "Nov 3, 4:15 PM", action: "Opened - Customer unsatisfied with chat" },
          { timestamp: "Nov 3, 4:45 PM", action: "Closed - Marked Resolved" },
        ],
      },
      {
        channel: "chat",
        sentiment: 4.4,
        sentimentLabel: "Frustrated",
        status: "active",
        statusLabel: "Escalation",
        timestamp: "Nov 3, 6:00 PM",
        openedAt: "Nov 3, 6:00 PM",
        interactions: [
          { timestamp: "Nov 3, 6:00 PM", action: "Reopened - Customer still unhappy" },
        ],
      },
    ],
    aiAction: "Review interest calculation methodology and consolidate all channels. Provide detailed breakdown to prevent customer bouncing between channels.",
    description: "Customer bounced between chat and ticket - chat closed at 2:30 PM, ticket closed at 4:45 PM, but customer returned to chat at 6:00 PM with frustration about incorrect interest amount.",
  });

  // ============================================
  // 5️⃣ UNACTIONED ESCALATIONS CASES
  // One closed, another active with pendingAction flag
  // ============================================

  // Case 27: Ticket closed → Email active with pending action
  cases.push({
    id: "27",
    customerId: "C-45612",
    issueType: "Card Replacement",
    intentCluster: "Intent cluster",
    timestamp: "Nov 5, 1:20 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "ticket",
        sentiment: 1.8,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 5:00 PM",
        closedAt: "Nov 4, 5:00 PM",
      },
      {
        channel: "email",
        sentiment: 3.5,
        sentimentLabel: "Frustrated",
        status: "pending",
        statusLabel: "Investigation",
        timestamp: "Nov 5, 1:20 PM",
        openedAt: "Nov 5, 1:20 PM",
        pendingAction: "PENDING BANK ACTION",
      },
    ],
    aiAction: "Confirm card delivery status and update customer before closing initial ticket.",
    description: "Ticket closed for card replacement on Nov 4, but customer sent follow-up email on Nov 5 that remains pending investigation for delivery confirmation.",
  });

  // Case 28: Email closed → Ticket active with pending action
  cases.push({
    id: "28",
    customerId: "C-23456",
    issueType: "Account Statement Error",
    intentCluster: "Intent cluster",
    timestamp: "Nov 4, 3:00 PM",
    riskLevel: "medium",
    channels: [
      {
        channel: "email",
        sentiment: 2.0,
        sentimentLabel: "Bit Irritated",
        status: "closed",
        statusLabel: "Resolution",
        timestamp: "Nov 4, 3:00 PM",
        closedAt: "Nov 4, 3:00 PM",
      },
      {
        channel: "ticket",
        sentiment: 3.8,
        sentimentLabel: "Frustrated",
        status: "pending",
        statusLabel: "Investigation",
        timestamp: "Nov 4, 4:00 PM",
        openedAt: "Nov 4, 4:00 PM",
        pendingAction: "PENDING BACK OFFICE REVIEW",
      },
    ],
    aiAction: "Review statement correction process and ensure ticket is updated before closing email.",
    description: "Email closed statement error on Nov 4, but customer opened ticket that remains pending without action for back office review.",
  });

  if (theme === "flipkart") {
    return cases.map((c) => {
      const o = FLIPKART_CASE_OVERRIDES[c.id];
      return o ? { ...c, issueType: o.issueType, description: o.description, aiAction: o.aiAction } : c;
    });
  }
  return cases;
};
