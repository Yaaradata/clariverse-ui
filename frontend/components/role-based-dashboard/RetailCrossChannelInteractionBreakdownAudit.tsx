"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  CircleCheckBig,
  MessageSquare,
  UserX,
  Mail,
  Ticket,
  Phone,
  Clock,
} from "lucide-react";

type Severity = "critical" | "high";

export type CrossChannelAuditBreakdownId = "escalation-resolved" | "duplicate" | "loops" | "unactioned";

type BreakdownCard = {
  id: CrossChannelAuditBreakdownId;
  title: string;
  count: number;
  severity: Severity;
  severityLabel: string;
  priorities: { label: string; count: number; bg: string }[];
  impacts: string[];
};

const BREAKDOWN_CARDS: BreakdownCard[] = [
  {
    id: "escalation-resolved",
    title: "Escalation after resolved",
    count: 12,
    severity: "critical",
    severityLabel: "Critical",
    priorities: [
      { label: "P1", count: 9, bg: "rgb(239, 68, 68)" },
      { label: "P2", count: 3, bg: "rgb(249, 115, 22)" },
    ],
    impacts: [
      "43% of escalations caused by agents closing tickets without checking other active channels.",
      "Agents close cases based on customer acknowledgment, not backend system verification.",
    ],
  },
  {
    id: "duplicate",
    title: "Duplicate Interactions",
    count: 3,
    severity: "high",
    severityLabel: "High",
    priorities: [
      { label: "P2", count: 2, bg: "rgb(249, 115, 22)" },
      { label: "P3", count: 1, bg: "rgb(234, 179, 8)" },
    ],
    impacts: [
      "Customers contact multiple channels simultaneously when response time exceeds 10 minutes.",
      "Multiple agents working same case without coordination provide conflicting information.",
    ],
  },
  {
    id: "loops",
    title: "Escalation Loops",
    count: 9,
    severity: "critical",
    severityLabel: "Critical",
    priorities: [
      { label: "P1", count: 8, bg: "rgb(239, 68, 68)" },
      { label: "P2", count: 1, bg: "rgb(249, 115, 22)" },
    ],
    impacts: [
      "Agents transfer issues between channels instead of escalating to specialists, creating loops.",
      "Customer sentiment deteriorates from 2.3 to 4.8 with each bounce across channels.",
    ],
  },
  {
    id: "unactioned",
    title: "Unactioned Escalations",
    count: 2,
    severity: "high",
    severityLabel: "High",
    priorities: [{ label: "P2", count: 2, bg: "rgb(249, 115, 22)" }],
    impacts: [
      "Agents close one channel while related channel remains pending, leaving issues unresolved.",
      "Cases marked \"Pending Review\" lack follow-up, forcing customers to reopen via new channels.",
    ],
  },
];

type TagVariant = "pink" | "red" | "yellow" | "blue";

type IncidentTag = { label: string; variant: TagVariant };

type PillKind = "resolved" | "issue" | "pending";

type PillIconName = "check" | "msg" | "mail" | "phone" | "ticket" | "clock" | "userx";

type IncidentPill = {
  kind: PillKind;
  icons: PillIconName[];
  channel: string;
  sentiment: string;
  stage: string;
};

type Incident = {
  id: string;
  /** Which breakdown summary card this row belongs to (drives drill-down filter). */
  breakdownId: CrossChannelAuditBreakdownId;
  tags: IncidentTag[];
  title: string;
  date: string;
  closedSummary: string;
  activeSummary: string;
  narrative: string;
  action: string;
  pills: IncidentPill[];
};

const INCIDENTS: Incident[] = [
  {
    id: "1",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-77204", variant: "blue" },
    ],
    title: "Credit Card Dispute",
    date: "Nov 5, 3:00 PM",
    closedSummary: "Chat closed at 2.3 (Bit Irritated)",
    activeSummary: "Active on email (Anger)",
    narrative:
      "Chat marked dispute resolved at 3:45 PM, yet customer sent email at 4:00 PM expressing anger that issue is NOT resolved.",
    action: "Link channels in dispute workflow and launch follow-up audit on closure criteria.",
    pills: [
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.3 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "mail"], channel: "email", sentiment: "4.2 ANGER", stage: "Investigation" },
    ],
  },
  {
    id: "2",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-52891", variant: "blue" },
    ],
    title: "Account Security Breach",
    date: "Nov 7, 10:15 AM",
    closedSummary: "Email closed at 2.8 (Moderately Concerned)",
    activeSummary: "Active on ticket (Anger)",
    narrative:
      "Email closed as resolved at 10:15 AM, but customer escalated to ticket at 11:30 AM with extreme frustration.",
    action: "Immediately escalate to security team and compliance. Reopen all related channels.",
    pills: [
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.8 MODERATELY CONCERNED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "ticket"], channel: "ticket", sentiment: "4.8 ANGER", stage: "Escalation" },
    ],
  },
  {
    id: "3",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-33467", variant: "blue" },
    ],
    title: "Transaction Dispute",
    date: "Nov 6, 3:30 PM",
    closedSummary: "Voice closed at 2.0 (Bit Irritated)",
    activeSummary: "Active on chat (Frustrated)",
    narrative:
      "Voice call closed dispute at 3:30 PM, but customer followed up via chat at 4:45 PM with additional transaction evidence.",
    action: "Review dispute resolution criteria and ensure all transaction details verified before closure.",
    pills: [
      { kind: "resolved", icons: ["check", "phone"], channel: "voice", sentiment: "2.0 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "msg"], channel: "chat", sentiment: "3.8 FRUSTRATED", stage: "Investigation" },
    ],
  },
  {
    id: "4",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-11234", variant: "blue" },
    ],
    title: "Loan Payment Discrepancy",
    date: "Nov 6, 2:30 PM",
    closedSummary: "Voice closed at 2.1 (Bit Irritated)",
    activeSummary: "Active on email (Frustrated)",
    narrative:
      "Voice call closed loan payment inquiry at 2:30 PM, but customer sent email at 3:15 PM expressing frustration that payment discrepancy was not resolved.",
    action: "Review loan payment processing and verify payment was correctly applied before closing voice channel.",
    pills: [
      { kind: "resolved", icons: ["check", "phone"], channel: "voice", sentiment: "2.1 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "mail"], channel: "email", sentiment: "4.3 FRUSTRATED", stage: "Investigation" },
    ],
  },
  {
    id: "5",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-22345", variant: "blue" },
    ],
    title: "Debit Card Transaction Error",
    date: "Nov 5, 11:00 AM",
    closedSummary: "Ticket closed at 2.4 (Bit Irritated)",
    activeSummary: "Active on chat (Frustrated)",
    narrative:
      "Ticket closed transaction error at 11:00 AM, but customer started chat at 11:45 AM reporting the same error still occurring.",
    action: "Investigate debit card transaction error and ensure all channels are synchronized before closing ticket.",
    pills: [
      { kind: "resolved", icons: ["check", "ticket"], channel: "ticket", sentiment: "2.4 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "msg"], channel: "chat", sentiment: "4.1 FRUSTRATED", stage: "Investigation" },
    ],
  },
  {
    id: "6",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-33456", variant: "blue" },
    ],
    title: "Account Balance Discrepancy",
    date: "Nov 7, 9:00 AM",
    closedSummary: "Chat closed at 2.0 (Bit Irritated)",
    activeSummary: "Active on voice (Frustrated)",
    narrative:
      "Chat closed balance inquiry at 9:00 AM, but customer called at 9:30 AM reporting balance discrepancy still exists.",
    action: "Verify account balance calculation and ensure all transactions are properly reflected before closing chat.",
    pills: [
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.0 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "phone"], channel: "voice", sentiment: "3.9 FRUSTRATED", stage: "Investigation" },
    ],
  },
  {
    id: "7",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-44567", variant: "blue" },
    ],
    title: "Credit Card Statement Error",
    date: "Nov 3, 4:00 PM",
    closedSummary: "Email closed at 2.5 (Bit Irritated)",
    activeSummary: "Active on voice (Frustrated)",
    narrative:
      "Email closed statement error at 4:00 PM, but customer called at 5:30 PM with frustration that statement error was not corrected.",
    action: "Review credit card statement correction process and ensure statement is updated before closing email.",
    pills: [
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.5 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "phone"], channel: "voice", sentiment: "4.4 FRUSTRATED", stage: "Escalation" },
    ],
  },
  {
    id: "8",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-99234", variant: "blue" },
    ],
    title: "Payment Processing Error",
    date: "Nov 2, 1:00 PM",
    closedSummary: "Email closed at 2.0 (Bit Irritated)",
    activeSummary: "Active on ticket (Frustrated)",
    narrative:
      "Email and chat both closed payment issue as resolved on Nov 2, but same error occurred again and customer created new ticket on Nov 3.",
    action: "Root cause analysis required. Payment error recurring indicates systemic issue.",
    pills: [
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.0 BIT IRRITATED", stage: "Resolution" },
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.1 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "ticket"], channel: "ticket", sentiment: "4.5 FRUSTRATED", stage: "Escalation" },
    ],
  },
  {
    id: "9",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-88901", variant: "blue" },
    ],
    title: "Transaction Reversal",
    date: "Nov 1, 10:00 AM",
    closedSummary: "Chat closed at 2.2 (Bit Irritated)",
    activeSummary: "Active on ticket (Frustrated)",
    narrative:
      "Email and chat both closed transaction reversal as resolved on Nov 1, but same issue returned requiring ticket escalation on Nov 2.",
    action: "Investigate why transaction reversal was marked resolved when issue persists.",
    pills: [
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.2 BIT IRRITATED", stage: "Resolution" },
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.3 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "ticket"], channel: "ticket", sentiment: "4.3 FRUSTRATED", stage: "Escalation" },
    ],
  },
  {
    id: "10",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-99012", variant: "blue" },
    ],
    title: "Account Freeze",
    date: "Nov 2, 2:00 PM",
    closedSummary: "Voice closed at 2.0 (Bit Irritated)",
    activeSummary: "Active on email (Anger)",
    narrative:
      "Voice and ticket closed account freeze inquiry on Nov 2, but customer escalated to email on Nov 4 with extreme anger.",
    action: "Immediately review account freeze status and provide resolution timeline.",
    pills: [
      { kind: "resolved", icons: ["check", "phone"], channel: "voice", sentiment: "2.0 BIT IRRITATED", stage: "Resolution" },
      { kind: "resolved", icons: ["check", "ticket"], channel: "ticket", sentiment: "2.1 BIT IRRITATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "mail"], channel: "email", sentiment: "4.8 ANGER", stage: "Escalation" },
    ],
  },
  {
    id: "11",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-34567", variant: "blue" },
    ],
    title: "Fraud Alert",
    date: "Nov 4, 3:00 PM",
    closedSummary: "Chat closed at 2.5 (Bit Irritated)",
    activeSummary: "Active on chat (Frustrated)",
    narrative:
      "Customer bounced between chat and email — chat closed at 3:45 PM, email closed at 4:30 PM, but customer returned to chat at 6:00 PM with escalating frustration about card being blocked.",
    action:
      "Fraud alerts require immediate attention. Consolidate all channels and assign dedicated fraud specialist to prevent channel bouncing.",
    pills: [
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.5 BIT IRRITATED", stage: "Resolution" },
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "4.2 FRUSTRATED", stage: "Resolution" },
      { kind: "issue", icons: ["userx", "msg"], channel: "chat", sentiment: "4.7 FRUSTRATED", stage: "Escalation" },
    ],
  },
  {
    id: "12",
    breakdownId: "escalation-resolved",
    tags: [
      { label: "Premature Closure Risk", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-23456", variant: "blue" },
    ],
    title: "Account Statement Error",
    date: "Nov 4, 3:00 PM",
    closedSummary: "Email closed at 2.0 (Bit Irritated)",
    activeSummary: "Active on ticket (Frustrated)",
    narrative:
      "Email closed statement error on Nov 4, but customer opened ticket that remains pending without action for back office review.",
    action: "Review statement correction process and ensure ticket is updated before closing email.",
    pills: [
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.0 BIT IRRITATED", stage: "Resolution" },
      {
        kind: "pending",
        icons: ["clock", "ticket"],
        channel: "ticket",
        sentiment: "3.8 FRUSTRATED",
        stage: "Investigation • Pending bank action",
      },
    ],
  },
  {
    id: "dup-1",
    breakdownId: "duplicate",
    tags: [
      { label: "Duplicate Interaction", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-50101", variant: "blue" },
    ],
    title: "Mortgage rate lock — parallel threads",
    date: "Nov 8, 9:12 AM",
    closedSummary: "Chat agent responding (in progress)",
    activeSummary: "Email thread opened 6 min later with same intent",
    narrative:
      "Customer started chat at 9:06 AM; first response ETA >12 min. Opened email at 9:12 AM — two agents now answering the same rate-lock question with different fee quotes.",
    action: "Merge threads under one case ID and assign single specialist; publish queue-time SLA on digital entry points.",
    pills: [
      { kind: "issue", icons: ["msg", "clock"], channel: "chat", sentiment: "3.2 FRUSTRATED", stage: "Queue" },
      { kind: "issue", icons: ["mail", "userx"], channel: "email", sentiment: "3.6 FRUSTRATED", stage: "New thread" },
    ],
  },
  {
    id: "dup-2",
    breakdownId: "duplicate",
    tags: [
      { label: "Duplicate Interaction", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-50102", variant: "blue" },
    ],
    title: "Card replacement — voice + ticket",
    date: "Nov 7, 4:40 PM",
    closedSummary: "IVR ticket auto-created",
    activeSummary: "Customer still on voice with different agent",
    narrative:
      "While still on hold, customer filed web ticket for expedited card ship; voice agent was unaware and quoted standard 7-day delivery.",
    action: "Surface active voice session on ticket workspace; block duplicate ship requests until consolidated.",
    pills: [
      { kind: "issue", icons: ["phone", "clock"], channel: "voice", sentiment: "2.9 BIT IRRITATED", stage: "Hold" },
      { kind: "issue", icons: ["ticket", "userx"], channel: "ticket", sentiment: "3.1 FRUSTRATED", stage: "Expedite" },
    ],
  },
  {
    id: "dup-3",
    breakdownId: "duplicate",
    tags: [
      { label: "Duplicate Interaction", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-50103", variant: "blue" },
    ],
    title: "Wire recall — social + chat",
    date: "Nov 6, 11:20 AM",
    closedSummary: "Social DM acknowledged by bot",
    activeSummary: "Chat escalated to human same minute",
    narrative:
      "Customer DM’d X support and opened chat simultaneously; bot on social promised “team will call” while chat agent said “no outbound calls for wire recalls.”",
    action: "Unify messaging templates across social and chat; route social DMs into same queue as authenticated chat.",
    pills: [
      { kind: "issue", icons: ["msg", "userx"], channel: "social", sentiment: "4.0 FRUSTRATED", stage: "Bot handoff" },
      { kind: "issue", icons: ["msg", "userx"], channel: "chat", sentiment: "4.2 FRUSTRATED", stage: "Human" },
    ],
  },
  {
    id: "loop-1",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60101", variant: "blue" },
    ],
    title: "Chargeback — chat → email → chat",
    date: "Nov 8, 2:00 PM",
    closedSummary: "Three handoffs in 48h",
    activeSummary: "Customer back on chat (4th agent)",
    narrative:
      "Each agent transferred “to the team that handles disputes” without creating a specialist case; customer repeated card details four times.",
    action: "Mandatory specialist queue after first dispute transfer; freeze channel bouncing with warm transfer checklist.",
    pills: [
      { kind: "issue", icons: ["msg", "userx"], channel: "chat", sentiment: "4.1 FRUSTRATED", stage: "Transfer 1" },
      { kind: "issue", icons: ["mail", "msg"], channel: "email", sentiment: "4.4 FRUSTRATED", stage: "Transfer 3" },
    ],
  },
  {
    id: "loop-2",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60102", variant: "blue" },
    ],
    title: "HELOC draw — voice ↔ ticket ping-pong",
    date: "Nov 7, 10:00 AM",
    closedSummary: "Voice says “open a ticket”",
    activeSummary: "Ticket says “call voice for draw limit”",
    narrative:
      "Customer cycled twice between voice and ticket; both channels referenced outdated draw limits from different knowledge articles.",
    action: "Single source of truth for draw limits; add “last verified by” stamp on agent scripts.",
    pills: [
      { kind: "issue", icons: ["phone", "ticket"], channel: "voice", sentiment: "3.7 FRUSTRATED", stage: "Round 2" },
      { kind: "issue", icons: ["ticket", "phone"], channel: "ticket", sentiment: "4.0 FRUSTRATED", stage: "Round 2" },
    ],
  },
  {
    id: "loop-3",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-60103", variant: "blue" },
    ],
    title: "Rewards clawback — email chain split",
    date: "Nov 6, 8:30 AM",
    closedSummary: "Two ticket IDs for same promo",
    activeSummary: "Back office reassigned twice",
    narrative:
      "Tickets merged incorrectly; customer received conflicting “resolved” emails while points were still negative.",
    action: "Automated merge detection on customer ID + promo code; supervisor review before second closure.",
    pills: [
      { kind: "resolved", icons: ["check", "mail"], channel: "email", sentiment: "2.4 BIT IRRITATED", stage: "False resolve" },
      { kind: "issue", icons: ["userx", "ticket"], channel: "ticket", sentiment: "4.1 FRUSTRATED", stage: "Reopened" },
    ],
  },
  {
    id: "loop-4",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60104", variant: "blue" },
    ],
    title: "App login — chat bot → human → bot",
    date: "Nov 5, 6:15 PM",
    closedSummary: "Session reset mid-flow",
    activeSummary: "Customer re-triaged from P2 to P4 twice",
    narrative:
      "Bot escalated to human; human closed as “reset app”; bot greeted customer again with generic password flow, losing fraud context.",
    action: "Persist fraud context across bot sessions; suppress bot takeover for 24h after human fraud touch.",
    pills: [
      { kind: "issue", icons: ["msg", "msg"], channel: "chat", sentiment: "4.3 FRUSTRATED", stage: "Bot loop" },
    ],
  },
  {
    id: "loop-5",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60105", variant: "blue" },
    ],
    title: "International wire — compliance ↔ retail",
    date: "Nov 4, 3:45 PM",
    closedSummary: "Retail transferred to compliance",
    activeSummary: "Compliance sent customer back to retail branch",
    narrative:
      "Customer told to visit branch; branch scanned docs and sent back to phone compliance — same day, same missing field on form.",
    action: "Branch tablet shows live compliance checklist; block handoff until mandatory fields complete.",
    pills: [
      { kind: "issue", icons: ["phone", "ticket"], channel: "compliance", sentiment: "4.2 FRUSTRATED", stage: "Bounce" },
      { kind: "pending", icons: ["clock", "mail"], channel: "branch", sentiment: "3.5 FRUSTRATED", stage: "Docs" },
    ],
  },
  {
    id: "loop-6",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-60106", variant: "blue" },
    ],
    title: "Auto-pay failure — ticket ↔ chat",
    date: "Nov 3, 1:10 PM",
    closedSummary: "Ticket marked awaiting customer",
    activeSummary: "Customer used chat — not linked to ticket",
    narrative:
      "Chat agent could not see ticket notes; closed chat as “customer unresponsive” while customer was replying on ticket thread.",
    action: "Cross-channel timeline on customer profile for all agents.",
    pills: [
      { kind: "issue", icons: ["ticket", "msg"], channel: "ticket", sentiment: "3.9 FRUSTRATED", stage: "Stale" },
      { kind: "resolved", icons: ["check", "msg"], channel: "chat", sentiment: "2.8 BIT IRRITATED", stage: "Mis-closed" },
    ],
  },
  {
    id: "loop-7",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60107", variant: "blue" },
    ],
    title: "Merchant dispute — social escalations",
    date: "Nov 2, 5:00 PM",
    closedSummary: "Public thread + private DM",
    activeSummary: "Two teams responding out of sync",
    narrative:
      "Social team offered goodwill credit in DM while disputes team denied claim on email — customer posted screenshot publicly.",
    action: "Single owner for public + private social; lock offers until dispute status synced.",
    pills: [
      { kind: "issue", icons: ["msg", "mail"], channel: "social", sentiment: "4.6 ANGER", stage: "Public" },
      { kind: "issue", icons: ["mail", "userx"], channel: "email", sentiment: "4.5 ANGER", stage: "Private" },
    ],
  },
  {
    id: "loop-8",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "MEDIUM RISK", variant: "yellow" },
      { label: "Customer C-60108", variant: "blue" },
    ],
    title: "Safe deposit — branch queue → phone",
    date: "Nov 1, 11:30 AM",
    closedSummary: "Branch queue overflow",
    activeSummary: "Phone agent re-queued to branch scheduling",
    narrative:
      "Customer waited at branch, gave up, called phone, was booked into same branch next week without capacity check — loop repeated.",
    action: "Real-time branch capacity API for phone schedulers.",
    pills: [
      { kind: "issue", icons: ["phone", "clock"], channel: "voice", sentiment: "3.4 FRUSTRATED", stage: "Re-queue" },
      { kind: "pending", icons: ["clock", "ticket"], channel: "branch", sentiment: "3.2 FRUSTRATED", stage: "Booking" },
    ],
  },
  {
    id: "loop-9",
    breakdownId: "loops",
    tags: [
      { label: "Escalation Loop", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-60109", variant: "blue" },
    ],
    title: "Fraud block — chat ↔ voice ↔ chat",
    date: "Oct 31, 7:00 PM",
    closedSummary: "After-hours pattern",
    activeSummary: "Customer still locked out next morning",
    narrative:
      "Night chat transferred to voice IVR; IVR dropped call; morning chat started fresh with no fraud case linkage — three auth cycles.",
    action: "Sticky case ID for fraud locks across IVR drops; SMS deep link to resume chat with context.",
    pills: [
      { kind: "issue", icons: ["msg", "phone", "msg"], channel: "mixed", sentiment: "4.7 ANGER", stage: "Overnight" },
    ],
  },
  {
    id: "ua-1",
    breakdownId: "unactioned",
    tags: [
      { label: "Unactioned Escalation", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-70101", variant: "blue" },
    ],
    title: "Regulatory letter — P1 SLA breached",
    date: "Nov 5, 9:00 AM",
    closedSummary: "Escalated to “Executive review” queue",
    activeSummary: "No owner assigned 72h+",
    narrative:
      "Ticket sat in generic executive queue with no routing rule; customer’s lawyer emailed twice with no acknowledgement logged.",
    action: "Auto-assign regulatory subtype to compliance lead; SLA clock visible on queue dashboard.",
    pills: [
      { kind: "pending", icons: ["clock", "ticket"], channel: "ticket", sentiment: "4.5 FRUSTRATED", stage: "No owner" },
    ],
  },
  {
    id: "ua-2",
    breakdownId: "unactioned",
    tags: [
      { label: "Unactioned Escalation", variant: "pink" },
      { label: "HIGH RISK", variant: "red" },
      { label: "Customer C-70102", variant: "blue" },
    ],
    title: "Vulnerable customer flag — warm transfer lost",
    date: "Nov 3, 2:00 PM",
    closedSummary: "Warm transfer promised to specialist",
    activeSummary: "Specialist queue never picked up",
    narrative:
      "Flagged call dropped at transfer; CRM vulnerability note did not reopen proactive callback — customer called back next day in distress.",
    action: "Callback automation when warm transfer fails; reopen vulnerable flag on dropped transfer.",
    pills: [
      { kind: "issue", icons: ["phone", "userx"], channel: "voice", sentiment: "4.6 ANGER", stage: "Dropped xfer" },
      { kind: "pending", icons: ["clock", "phone"], channel: "callback", sentiment: "—", stage: "Never scheduled" },
    ],
  },
];

function tagClass(v: TagVariant) {
  switch (v) {
    case "pink":
      return "bg-pink-500/20 border-pink-400/40 text-pink-100";
    case "red":
      return "bg-red-500/20 border-red-400/40 text-red-100";
    case "yellow":
      return "bg-yellow-500/20 border-yellow-400/40 text-yellow-100";
    case "blue":
      return "bg-blue-500/20 border-blue-400/40 text-blue-100";
    default:
      return "";
  }
}

function PillIcon({ name }: { name: PillIconName }) {
  const common = "h-4 w-4 shrink-0";
  switch (name) {
    case "check":
      return <CircleCheckBig className={`${common} text-green-400`} aria-hidden />;
    case "msg":
      return <MessageSquare className={`${common} text-green-300`} aria-hidden />;
    case "mail":
      return <Mail className={`${common} text-blue-300`} aria-hidden />;
    case "phone":
      return <Phone className={`${common} text-red-300`} aria-hidden />;
    case "ticket":
      return <Ticket className={`${common} text-purple-300`} aria-hidden />;
    case "clock":
      return <Clock className={`${common} text-yellow-400`} aria-hidden />;
    case "userx":
      return <UserX className={`${common} text-red-400`} aria-hidden />;
    default:
      return null;
  }
}

function ChannelPillRow({ pill }: { pill: IncidentPill }) {
  const wrap =
    pill.kind === "resolved"
      ? "border-green-400/30 bg-green-500/10"
      : pill.kind === "pending"
        ? "border-yellow-400/30 bg-yellow-500/10"
        : "border-red-400/30 bg-red-500/10";
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${wrap}`}>
      {pill.icons.map((ic, i) => (
        <PillIcon key={`${pill.channel}-${i}-${ic}`} name={ic} />
      ))}
      <div className="text-xs">
        <div className="font-semibold uppercase text-white">{pill.channel}</div>
        <div className="text-gray-300">{pill.sentiment}</div>
        <div className="text-[10px] uppercase text-gray-400">{pill.stage}</div>
      </div>
    </div>
  );
}

const AUDIT_LIST_SUBTITLE: Record<CrossChannelAuditBreakdownId, string> = {
  "escalation-resolved": "Spots closure conflicts across channels for the same active banking intent.",
  duplicate: "Same customer intent handled in parallel across channels without a single case owner.",
  loops: "Repeated transfers or channel hops without resolution — customer retraces the same path.",
  unactioned: "Escalations that breached internal ownership or SLA without a recorded next action.",
};

const breakdownCardClassName =
  "rounded-lg border border-(--border) bg-(--card) text-[color:var(--card-foreground)] border border-white/10 bg-[rgba(15,15,15,0.8)] p-4 cursor-pointer transition-colors hover:bg-[rgba(15,15,15,0.9)] h-full flex flex-col text-left w-full";

function severityBadgeClass(severity: Severity) {
  const tone =
    severity === "critical"
      ? "bg-red-500/20 border-red-400/40 text-red-100"
      : "bg-orange-500/20 border-orange-400/40 text-orange-100";
  return `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 ${tone}`;
}

export function RetailCrossChannelInteractionBreakdownAudit() {
  const [showAuditList, setShowAuditList] = useState(true);
  const [selectedBreakdownId, setSelectedBreakdownId] = useState<CrossChannelAuditBreakdownId>("escalation-resolved");

  const selectedCard = BREAKDOWN_CARDS.find((c) => c.id === selectedBreakdownId) ?? BREAKDOWN_CARDS[0];
  const filteredIncidents = INCIDENTS.filter((inc) => inc.breakdownId === selectedBreakdownId);

  return (
    <div className="rounded-lg border border-(--border) bg-(--card) text-[color:var(--card-foreground)] border border-white/10 bg-black/30 p-6 shadow-lg">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" aria-hidden />
          <h2 className="text-2xl font-bold text-white">Cross-Channel Interaction Breakdown Audit</h2>
        </div>
        <p className="text-sm text-gray-400">
          Spots closure conflicts across channels for the same active banking intent.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Breakdown Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BREAKDOWN_CARDS.map((card) => (
            <div key={card.id} className="relative h-full">
              <button
                type="button"
                aria-pressed={selectedBreakdownId === card.id}
                className={`${breakdownCardClassName} ${selectedBreakdownId === card.id ? "ring-2 ring-yellow-400/45 ring-offset-2 ring-offset-black/40" : ""}`}
                onClick={() => {
                  setSelectedBreakdownId(card.id);
                  setShowAuditList(true);
                }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1 text-sm font-semibold text-white">{card.title}</h4>
                    <div className="text-2xl font-bold text-white">{card.count}</div>
                  </div>
                  <div className={severityBadgeClass(card.severity)}>{card.severityLabel}</div>
                </div>
                <div className="mt-3 border-t border-white/10 pt-3 mb-3">
                  <div className="mb-2 text-[10px] uppercase tracking-wide text-gray-400">Priority Distribution</div>
                  <div className="grid grid-cols-4 gap-2">
                    {card.priorities.map((p) => (
                      <div key={p.label} className="flex flex-col items-center">
                        <div
                          className="mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: p.bg }}
                        >
                          {p.count}
                        </div>
                        <span className="text-[9px] text-gray-400">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="mb-2 text-[10px] uppercase tracking-wide text-gray-400">Business Impact</div>
                  <div className="space-y-2">
                    {card.impacts.map((text, i) => (
                      <div
                        key={`${card.id}-impact-${i}`}
                        className="flex items-start gap-2 p-2 rounded-lg border border-pink-500/30 bg-rose-500/10"
                      >
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-400" aria-hidden />
                        <p className="text-[11px] leading-relaxed text-gray-200">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAuditList ? (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-white">{selectedCard.title}</h3>
              <p className="text-sm text-gray-400">{AUDIT_LIST_SUBTITLE[selectedBreakdownId]}</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
              aria-label="Close audit list"
              onClick={() => setShowAuditList(false)}
            >
              <X className="h-5 w-5 text-gray-400" aria-hidden />
            </button>
          </div>
          <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className="rounded-lg border border-purple-500/30 bg-[rgba(15,15,15,0.9)] p-6 text-[color:var(--card-foreground)]"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {inc.tags.map((t) => (
                    <div
                      key={t.label}
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tagClass(t.variant)}`}
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <h4 className="mb-2 text-lg font-semibold text-white">{inc.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="uppercase">Intent cluster</span>
                    <span>•</span>
                    <span>{inc.date}</span>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
                  <div className="text-gray-300">{inc.closedSummary}</div>
                  <div className="text-gray-300">{inc.activeSummary}</div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">{inc.narrative}</p>
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-400/20 bg-yellow-500/10 p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" aria-hidden />
                  <div className="text-sm text-yellow-100">
                    <span className="font-semibold">Action:</span> {inc.action}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {inc.pills.map((pill, idx) => (
                    <ChannelPillRow key={`${inc.id}-${idx}`} pill={pill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="text-sm font-medium text-yellow-400/90 underline-offset-2 hover:underline"
          onClick={() => setShowAuditList(true)}
        >
          Show audit list
        </button>
      )}
    </div>
  );
}
