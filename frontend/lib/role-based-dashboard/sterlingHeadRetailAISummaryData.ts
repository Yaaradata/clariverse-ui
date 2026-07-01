/**
 * Sterling Bank · head_retail — AI Summary Wall (4 cards) + drill-down modals.
 * Communication-derived only (voice, chat, email, social). Raghu franchise read;
 * engineering / ops fixes route to COO / fraud-ops.
 */

import type { FCIInsight, FCIInsightDetails } from "@/components/FCI/AISummaryWall";

export const STERLING_HEAD_RETAIL_AI_SUMMARY: FCIInsight[] = [
  {
    id: "sb-hr-ai-1",
    severity: "critical",
    category: "system-issue",
    title: "Payment Block Flow Failing Silently",
    message:
      "900 repeat calls from customers whose legitimate payments were declined with no in-app reason given — the block notification is not reaching the customer.",
    trend: "up",
    change: 42,
    metrics: {
      volume: 900,
      volumeLabel: "repeat calls today",
      customerImpact: "Critical",
    },
  },
  {
    id: "sb-hr-ai-2",
    severity: "alert",
    category: "customer-experience",
    title: "Repeat Contact: Chat to Phone Loop",
    message:
      "Customers bouncing between in-app chat and phone support without resolution — 340 cases in a loop pattern, many after failing app security.",
    trend: "up",
    change: 28,
    metrics: {
      volume: 340,
      volumeLabel: "customers in loop",
      customerImpact: "High",
    },
  },
  {
    id: "sb-hr-ai-3",
    severity: "warning",
    category: "sla-breach",
    title: "Reply Delay: Restricted-Account Emails",
    message:
      "Email responses to customers with frozen or restricted accounts exceeding 48 hours while funds are held — 156 high-balance primary customers waiting.",
    trend: "up",
    change: 35,
    metrics: {
      volume: 156,
      volumeLabel: "customers delayed",
      responseTime: ">48 hrs",
      customerImpact: "High",
    },
  },
  {
    id: "sb-hr-ai-4",
    severity: "info",
    category: "product-update",
    title: "High Volume Surge — Easy-Saver Rate Change",
    message:
      "Significant rise in conversation after the Easy-Saver rate change — 2,340 calls and chats today about the new savings rate and eligibility for the replacement saver.",
    trend: "up",
    change: 156,
    metrics: {
      volume: 2_340,
      volumeLabel: "contacts today",
      customerImpact: "Medium",
    },
  },
];

export const STERLING_HEAD_RETAIL_AI_INSIGHT_DETAILS: Record<string, FCIInsightDetails> = {
  "sb-hr-ai-1": {
    rootCause:
      "Legitimate payments are being blocked or declined, but the in-app block notification is not reaching the customer. Payments appear to go through, then fail with no reason shown — so customers call and chat repeatedly, and many escalate to switch-intent. 900 repeat contacts today, +42%.",
    affectedAreas: [
      "Payments",
      "App Notifications",
      "Customer Support",
      "Fraud-Ops Rules",
      "Savings & Easy-Saver",
    ],
    recommendedActions: [
      "Quantify franchise exposure: customers affected, repeat-contact cost-to-serve, and switch-intent in voice — draft for review.",
      "Escalate the silent-notification fix and payment-block rule-tuning to COO / fraud-ops.",
      "Draft proactive customer comms explaining the block and next step — never auto-send, human-approved.",
      "Flag high-balance primary customers in the affected cohort for retention review.",
      "Track containment: monitor repeat-contact and avoidable cost-to-serve until the block rate falls.",
    ],
    estimatedImpact: "Critical",
    timeToResolve: "Immediate — 24–48 hours",
    assignedTo: "Raghu (franchise) · fix routes to COO / fraud-ops",
    priority: "immediate",
    priorityLabel: "Immediate Action",
  },
  "sb-hr-ai-2": {
    rootCause:
      "Customers are bouncing between in-app chat and phone support without resolution — 340 cases in a loop pattern, +28%. Many enter the loop after failing app security and being unable to reach a human, driving avoidable cost-to-serve and frustration.",
    affectedAreas: [
      "In-app Chat",
      "Phone Support",
      "App Security",
      "Customer Support",
      "Agentic-AI Containment",
    ],
    recommendedActions: [
      "Quantify the loop cohort: repeat-contact cost-to-serve and sentiment/switch-intent in voice — draft for review.",
      "Escalate the chat-to-phone handoff and security-recovery fix to COO.",
      "Draft a clear in-app route-to-human step for security-failed sessions — never auto-send.",
      "Identify high-balance primary customers stuck in the loop for priority resolution.",
      "Track containment: monitor loop volume and bot-to-human handoff until the pattern clears.",
    ],
    estimatedImpact: "High",
    timeToResolve: "24–72 hours",
    assignedTo: "Raghu (franchise) · fix routes to COO",
    priority: "high",
    priorityLabel: "Action Needed",
  },
  "sb-hr-ai-3": {
    rootCause:
      "Email responses to customers with frozen or restricted accounts are exceeding 48 hours while funds are held — 156 high-balance primary customers waiting, +35%. The delay during a money-held situation is a Consumer Duty and franchise-retention risk.",
    affectedAreas: [
      "Email Support",
      "Account Restrictions",
      "Frozen Funds",
      "FOS / Consumer Duty",
      "Retention",
    ],
    recommendedActions: [
      "Quantify retention exposure: balance-held primary customers, days waiting, and switch-intent in voice — draft for review.",
      "Escalate the restricted-account email backlog and SLA remediation to COO.",
      "Draft holding comms for affected customers setting expectations and next step — never auto-send.",
      "Prioritise high-balance primary customers in the backlog for retention review.",
      "Track containment: monitor reply-time and FOS / Consumer Duty exposure until within target.",
    ],
    estimatedImpact: "High",
    timeToResolve: "Immediate — 48 hours",
    assignedTo: "Raghu (franchise) · remediation routes to COO",
    priority: "high",
    priorityLabel: "Action Needed",
  },
  "sb-hr-ai-4": {
    rootCause:
      "Conversation volume has risen sharply after the Easy-Saver rate change — 2,340 contacts today, +156% — with customers asking about the new rate, eligibility for the replacement saver, and comparing rates elsewhere. Rate-driven switch-intent is the franchise risk underneath the volume.",
    affectedAreas: [
      "Savings & Easy-Saver",
      "Rate Change",
      "Eligibility",
      "Switch-Intent",
      "Deposits & Primacy",
    ],
    recommendedActions: [
      "Quantify rate-driven switch-intent and deposit-flight signals in voice — draft for review.",
      "Draft clear in-app and email guidance on the new rate and replacement-saver eligibility — never auto-send.",
      "Draft a save-offer for the flight-risk cohort comparing rates in voice — human-approved.",
      "Flag high-balance primary savers questioning the rate for retention review.",
      "Track deposits, primacy and CASS net flows against the rate-change cohort.",
    ],
    estimatedImpact: "Monitor",
    timeToResolve: "This week",
    assignedTo: "Raghu (franchise)",
    priority: "low",
    priorityLabel: "Monitor",
  },
};
