/**
 * Nuvama · Head of Client Experience — AI Retention / Promise walls.
 * Conversation-derived retention and promise signals for Drill 1 & 2.
 */

import type { FCIInsight, FCIInsightDetails } from "@/components/FCI/AISummaryWall";

export const NUVAMA_D1_RETENTION_AI: FCIInsight[] = [
  {
    id: "d1a1",
    severity: "critical",
    category: "customer-experience",
    title: "South Core-HNI showing relationship-ending language",
    message:
      "'Move my portfolio', 'close account', 'disappointed with returns' concentrated in one region-segment cell, across Voice and WhatsApp.",
    trend: "up",
    change: 42,
    metrics: {
      volume: 47,
      volumeLabel: "clients vs 6 baseline",
      customerImpact: "Critical",
    },
  },
  {
    id: "d1a2",
    severity: "alert",
    category: "customer-experience",
    title: "312 high-value clients have gone quiet",
    message:
      "Previously-active Private and HNI clients with no inbound for 60 days+, whose sentiment was already cooling before the silence.",
    trend: "up",
    change: 28,
    metrics: {
      volume: 312,
      volumeLabel: "clients silent 60d+",
      customerImpact: "High",
    },
  },
  {
    id: "d1a3",
    severity: "warning",
    category: "operational",
    title: "Mass Affluent sentiment slipping fastest",
    message:
      "Negative-sentiment share is highest and rising in Mass Affluent, the largest interaction pool - a volume risk even if per-client value is lower.",
    trend: "up",
    change: 3,
    metrics: {
      volume: 30,
      volumeLabel: "% negative sentiment",
      customerImpact: "Medium",
    },
  },
  {
    id: "d1a4",
    severity: "info",
    category: "product-update",
    title: "Private-UHNI relationships holding",
    message:
      "The top segment retains the healthiest sentiment mix, with exit-intent language rare outside the flagged advisory cluster.",
    trend: "stable",
    metrics: {
      volume: 52,
      volumeLabel: "% positive sentiment",
      customerImpact: "Low",
    },
  },
];

export const NUVAMA_D1_RETENTION_DETAILS: Record<string, FCIInsightDetails> = {
  d1a1: {
    rootCause:
      "Unmet call-back promises and responsiveness complaints compounding in the South Core-HNI book; the language is relationship-ending, not transactional.",
    affectedAreas: ["RM team", "South region", "Retention"],
    recommendedActions: [
      "Draft evidence pack per client - human approves",
      "Prioritise RM call-backs in this cell",
      "Brief regional head on the cluster",
    ],
    estimatedImpact: "Critical - concentrated book at risk of walking",
    timeToResolve: "Immediate - this week",
    assignedTo: "Head of Client Experience",
    priority: "immediate",
    priorityLabel: "Immediate",
  },
  d1a2: {
    rootCause:
      "No proactive trigger fires when an active high-value client goes quiet; the relationship cools unobserved until it is too late to recover.",
    affectedAreas: ["Retention", "RM team", "Digital"],
    recommendedActions: [
      "Flag silent-after-cooling clients to RMs weekly",
      "Draft a re-engagement outreach - human sends",
      "Prioritise those with an unresolved request",
    ],
    estimatedImpact: "High - leading attrition signal across 312 clients",
    timeToResolve: "1-2 weeks",
    assignedTo: "Retention Lead",
    priority: "high",
  },
  d1a3: {
    rootCause:
      "Service model is thinner for Mass Affluent; routine friction goes unresolved and accumulates into detractor sentiment.",
    affectedAreas: ["Service Ops", "Digital"],
    recommendedActions: [
      "Strengthen self-service for this segment",
      "Watch for exit-intent bleed upward",
    ],
    estimatedImpact: "Medium - volume risk in largest pool",
    timeToResolve: "2-4 weeks",
    assignedTo: "Service Ops",
    priority: "medium",
  },
  d1a4: {
    rootCause:
      "Dedicated RM coverage keeps the top book close; the model that works here is the one to extend downward.",
    affectedAreas: ["RM team", "Private"],
    recommendedActions: [
      "Document what is working in Private coverage",
      "Test elements with HNI at-risk cells",
    ],
    estimatedImpact: "Low - healthy core to protect and replicate",
    timeToResolve: "Ongoing",
    assignedTo: "Head of Client Experience",
    priority: "low",
  },
};

export const NUVAMA_D2_PROMISE_AI: FCIInsight[] = [
  {
    id: "d2a1",
    severity: "critical",
    category: "sla-breach",
    title: "Call-back promises breaking on at-risk clients",
    message:
      "24h call-back adherence is 79%, with 9 broken this week - concentrated on the same South Core-HNI clients showing exit-intent language.",
    trend: "up",
    change: 9,
    metrics: {
      volume: 9,
      volumeLabel: "broken this week",
      responseTime: "79% adherence",
      customerImpact: "Critical",
    },
  },
  {
    id: "d2a2",
    severity: "alert",
    category: "customer-experience",
    title: "Detractor verbatims cluster on 'no call back'",
    message:
      "South NPS is 78 vs book 82, and the detractor language is specifically about responsiveness and unmet call-backs - trust, not product.",
    trend: "up",
    change: 7,
    metrics: {
      volume: 78,
      volumeLabel: "South NPS vs book 82",
      customerImpact: "High",
    },
  },
  {
    id: "d2a3",
    severity: "warning",
    category: "compliance",
    title: "Grievance-SLA breaches flagged to Governance",
    message:
      "A small set of grievance-resolution promises breached SLA. CX has flagged these to Governance → CRO - detection and surfacing only.",
    trend: "up",
    change: 12,
    metrics: {
      volumeLabel: "flagged - not owned",
      customerImpact: "Medium",
    },
  },
];

export const NUVAMA_D2_PROMISE_DETAILS: Record<string, FCIInsightDetails> = {
  d2a1: {
    rootCause:
      "Promises made on one channel are invisible on another; there is no single ledger, so commitments slip silently until the client chases.",
    affectedAreas: ["Service Ops", "Branch", "RM team"],
    recommendedActions: [
      "Alert owners at 18h before breach",
      "Outbound the 9 broken promises today",
      "Link promise breaches to the retention queue",
    ],
    estimatedImpact: "Critical - trust erosion on at-risk book",
    timeToResolve: "Immediate - 24-48 hours",
    assignedTo: "Service Ops Lead",
    priority: "immediate",
    priorityLabel: "Immediate",
  },
  d2a2: {
    rootCause:
      "Repeated broken promises convert neutral clients into detractors; the trust cost compounds each time a client has to chase.",
    affectedAreas: ["Service Ops", "Quality", "Retention"],
    recommendedActions: [
      "Proactive status-push on open promises",
      "Recover the flagged detractor cohort",
      "Track sentiment recovery post-fix",
    ],
    estimatedImpact: "High - South NPS gap driven by responsiveness",
    timeToResolve: "1-2 weeks",
    assignedTo: "CX Quality Lead",
    priority: "high",
  },
  d2a3: {
    rootCause:
      "Grievance-SLA breaches can carry regulatory weight; the CX role is to detect early and hand off cleanly to Governance (triage + redressal) — CRO files where required.",
    affectedAreas: ["Governance → CRO", "Grievance Cell"],
    recommendedActions: [
      "Confirm hand-off received by Compliance",
      "Keep CX view to experience metrics",
    ],
    estimatedImpact: "Medium - regulatory hand-off required",
    timeToResolve: "Compliance-owned",
    assignedTo: "Governance → CRO",
    priority: "medium",
    priorityLabel: "Monitor",
  },
};
