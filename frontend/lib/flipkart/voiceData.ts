/**
 * Flipkart Voice Dashboard – e-commerce call center data and ₹ (INR) only.
 * Same API as @/lib/voiceData; content is returns, refunds, delivery, orders; all amounts in INR.
 */

import type {
  GranularComplianceScore,
  Violation,
  KPIData,
  IntentDistribution,
  IssueHeatmapData,
  AgentPerformance,
  HighRiskCall,
  SkillGapData,
  CoachingTicket,
  CallListItem,
  CallDetail,
  ComplianceItem,
} from "@/lib/voiceData";

export type {
  ComplianceItem,
  Violation,
  ComplianceCategoryBreakdown,
  GranularComplianceScore,
  KPIData,
  IntentDistribution,
  IssueHeatmapData,
  AgentPerformance,
  HighRiskCall,
  SkillGapData,
  CoachingTicket,
  CallDetail,
  CallListItem,
} from "@/lib/voiceData";

// ---------- E-commerce compliance (consumer protection, recording consent, return/refund policy) ----------

export function getGranularComplianceScore(): GranularComplianceScore {
  return {
    overallScore: 87.5,
    lastUpdated: new Date().toISOString(),
    byRegulation: {
      consentDisclosure: {
        label: "Consent & Recording Disclosure",
        regulatoryReference: "Consumer Protection & Data Privacy",
        score: 84,
        weight: 0.3,
        violations: 4,
        criticalViolations: 2,
        trend: [80, 81, 82, 83, 83.5, 84, 84],
        transcriptSignals: [
          "Recording disclosure stated within 10s",
          "Purpose of call recording explained",
          "Rights & retention period communicated",
        ],
        focusAreas: [
          { label: "Recording disclosure within 10s", score: 78 },
          { label: "Legal basis explained", score: 82 },
          { label: "Data rights mentioned", score: 86 },
        ],
      },
      identityVerification: {
        label: "Order & Identity Verification",
        regulatoryReference: "E-commerce Order Verification",
        score: 89,
        weight: 0.25,
        violations: 3,
        criticalViolations: 0,
        trend: [86, 87, 87.5, 88, 88.5, 89, 89],
        transcriptSignals: [
          "Order ID or registered mobile verified before sharing details",
          "Delivery address confirmed where required",
          "Return/refund eligibility checked",
        ],
        focusAreas: [
          { label: "Order verification before status share", score: 90 },
          { label: "Address/contact confirmation", score: 87 },
          { label: "Return eligibility check", score: 82 },
        ],
      },
      sanctionsHandling: {
        label: "Policy & Prohibited Activity",
        regulatoryReference: "Marketplace Policy",
        score: 91,
        weight: 0.2,
        violations: 1,
        criticalViolations: 0,
        trend: [88, 88.5, 89, 89.5, 90, 90.5, 91],
        transcriptSignals: [
          "Prohibited items/activity declined",
          "Customer informed of policy rationale",
          "Escalation to trust & safety where needed",
        ],
        focusAreas: [
          { label: "Policy breach mentions declined", score: 94 },
          { label: "Explanation of policy", score: 90 },
          { label: "Escalation confirmation", score: 88 },
        ],
      },
      suitabilityAndAdvice: {
        label: "Return & Refund Policy Disclosure",
        regulatoryReference: "Consumer Rights & Refund Policy",
        score: 86,
        weight: 0.25,
        violations: 2,
        criticalViolations: 1,
        trend: [84, 84.5, 85, 85.5, 86, 86, 86],
        transcriptSignals: [
          "Return window and eligibility stated",
          "Refund timeline and method explained",
          "Cancellation and complaint rights stated",
        ],
        focusAreas: [
          { label: "Return window stated", score: 88 },
          { label: "Refund timeline & method", score: 84 },
          { label: "Right-to-cancel reminder", score: 83 },
        ],
      },
    },
    financialRisk: {
      totalPotentialFines: 50_000_000,
      expectedLoss: 8_000_000,
      worstCaseScenario: 50_000_000,
      currency: "INR",
    },
    riskLevel: "high",
    riskFactors: [
      {
        factor: "Recording consent missed at call opening",
        transcriptCue: "Agent begins order details before saying 'This call may be recorded...'",
        impact: 20_000_000,
        urgency: "immediate",
      },
      {
        factor: "Order verification skipped before sharing status",
        transcriptCue: "Agent discusses delivery/refund without confirming order ID or mobile",
        impact: 12_000_000,
        urgency: "high",
      },
      {
        factor: "Refund policy not stated on return request",
        transcriptCue: "Customer asks for return; agent does not state window or refund timeline",
        impact: 5_000_000,
        urgency: "medium",
      },
    ],
  };
}

export function getViolations(): Violation[] {
  const agentNames = ["Priya Sharma", "Rahul Verma", "Anita Reddy", "Vikram Singh", "Sneha Patel"];
  const agentIds = ["agent_fk_001", "agent_fk_002", "agent_fk_003", "agent_fk_004", "agent_fk_005"];

  return [
    {
      violationId: "viol_fk_001",
      callId: "call_fk_1001",
      agentId: agentIds[0],
      agentName: agentNames[0],
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      category: "CONSENT",
      subCategory: "missing_recording_disclosure",
      regulation: "Consumer data – recording disclosure & purpose notice",
      severity: "critical",
      severityReason: "Agent collected order/mobile details before informing customer of recording",
      financialImpact: {
        potentialFine: 20_000_000,
        currency: "INR",
        fineCalculation: "Consumer protection penalty estimate",
        probability: 15,
        expectedLoss: 3_000_000,
      },
      evidence: {
        transcriptExcerpt:
          "Agent: 'Can I have your order ID?' Customer: 'Is this call recorded?' Agent: 'Yes.' [Disclosure after data request]",
        timestamp: 12,
        fullTranscript: [
          { speaker: "agent", text: "Thank you for calling Flipkart support, Priya speaking.", timestamp: 0 },
          { speaker: "customer", text: "Hi, I need to check my return status.", timestamp: 4 },
          { speaker: "agent", text: "Sure, can I have your order ID?", timestamp: 8, violation: true },
          { speaker: "customer", text: "Before that, is this call recorded?", timestamp: 12 },
          { speaker: "agent", text: "Yes, for quality and training.", timestamp: 13 },
          { speaker: "system", text: "Recording disclosure triggered after data request.", timestamp: 16, violation: true },
        ],
      },
      remediation: {
        required: true,
        action: "Coach agent to state recording disclosure and purpose before asking order/mobile. Enable pre-call script.",
        deadline: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
        responsibleTeam: "Quality & Training",
        status: "pending",
      },
      reporting: { reportable: false, regulator: "", reportDeadline: "", reported: false },
      customerNotification: { required: false, deadline: "", notified: false },
      recurrence: { isRecurring: true, occurrenceCount: 3, pattern: "Agent often misses consent in first 10 seconds" },
    },
    {
      violationId: "viol_fk_002",
      callId: "call_fk_1002",
      agentId: agentIds[1],
      agentName: agentNames[1],
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      category: "IDENTITY",
      subCategory: "order_verification_skipped",
      regulation: "Order verification before sharing status or refund",
      severity: "high",
      severityReason: "Agent shared refund status without confirming order ID or registered mobile",
      financialImpact: {
        potentialFine: 10_000_000,
        currency: "INR",
        fineCalculation: "Policy breach and dispute risk estimate",
        probability: 20,
        expectedLoss: 2_000_000,
      },
      evidence: {
        transcriptExcerpt:
          "Agent: 'Your refund of ₹2,499 will be credited in 5–7 days.' [No order ID or OTP verified]",
        timestamp: 65,
        fullTranscript: [
          { speaker: "agent", text: "Flipkart support, Rahul here. How can I help?", timestamp: 0 },
          { speaker: "customer", text: "I want to know my refund status.", timestamp: 6 },
          { speaker: "agent", text: "Let me check… your refund of ₹2,499 will be in your account in 5–7 days.", timestamp: 12, violation: true },
          { speaker: "customer", text: "You didn’t verify my order or mobile.", timestamp: 18 },
          { speaker: "agent", text: "You’re right. Can you share the order ID or the mobile number on the account?", timestamp: 20 },
          { speaker: "system", text: "Order verification completed after refund info disclosed.", timestamp: 22, violation: true },
        ],
      },
      remediation: {
        required: true,
        action: "Reinforce order/mobile verification before sharing any order or refund details.",
        deadline: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
        responsibleTeam: "Quality",
        status: "pending",
      },
      reporting: { reportable: false, regulator: "", reportDeadline: "", reported: false },
      customerNotification: { required: false, deadline: "", notified: false },
      recurrence: { isRecurring: false, occurrenceCount: 1, pattern: "Isolated incident" },
    },
    {
      violationId: "viol_fk_003",
      callId: "call_fk_1003",
      agentId: agentIds[2],
      agentName: agentNames[2],
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      category: "SUITABILITY",
      subCategory: "refund_policy_not_stated",
      regulation: "Consumer rights – return window and refund policy disclosure",
      severity: "critical",
      severityReason: "Agent processed return request without stating return window, eligibility, or refund timeline",
      financialImpact: {
        potentialFine: 10_000_000,
        currency: "INR",
        fineCalculation: "Consumer protection estimate",
        probability: 20,
        expectedLoss: 2_000_000,
      },
      evidence: {
        transcriptExcerpt:
          "Agent: 'I’ll raise the return.' Customer: 'When will I get the refund?' Agent: 'Soon.' [No timeline or policy stated]",
        timestamp: 205,
        fullTranscript: [
          { speaker: "agent", text: "Thanks for waiting, Anita from Flipkart. How can I help?", timestamp: 0 },
          { speaker: "customer", text: "I want to return my order, wrong size.", timestamp: 9 },
          { speaker: "agent", text: "I’ll raise the return for you.", timestamp: 30, violation: true },
          { speaker: "customer", text: "When will I get the refund?", timestamp: 38 },
          { speaker: "agent", text: "Soon, once we receive the product.", timestamp: 41, violation: true },
          { speaker: "system", text: "Return/refund policy and timeline not stated.", timestamp: 55, violation: true },
        ],
      },
      remediation: {
        required: true,
        action: "Ensure agents state return window, eligibility, and refund timeline (e.g. 7–10 days) on every return call.",
        deadline: new Date(Date.now() + 1 * 24 * 3600000).toISOString(),
        responsibleTeam: "Quality",
        status: "in_progress",
      },
      reporting: { reportable: false, regulator: "", reportDeadline: "", reported: false },
      customerNotification: { required: false, deadline: "", notified: false },
      recurrence: { isRecurring: false, occurrenceCount: 1, pattern: "First occurrence" },
    },
    {
      violationId: "viol_fk_004",
      callId: "call_fk_1004",
      agentId: agentIds[0],
      agentName: agentNames[0],
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      category: "IDENTITY",
      subCategory: "delivery_address_not_confirmed",
      regulation: "Delivery address confirmation for redelivery/change",
      severity: "high",
      severityReason: "Agent scheduled redelivery without confirming current address",
      financialImpact: {
        potentialFine: 2_500_000,
        currency: "INR",
        fineCalculation: "Operational and dispute risk",
        probability: 18,
        expectedLoss: 450_000,
      },
      evidence: {
        transcriptExcerpt:
          "Customer: 'I’ve moved, can you deliver to new address?' Agent: 'Sure, we’ll update it.' [No address read-back or verification]",
        timestamp: 140,
        fullTranscript: [
          { speaker: "agent", text: "Priya here. How can I help?", timestamp: 0 },
          { speaker: "customer", text: "I’ve moved. Can you deliver to my new address?", timestamp: 22, violation: true },
          { speaker: "agent", text: "Sure, we’ll update the address for this order.", timestamp: 27, violation: true },
          { speaker: "system", text: "Address change without read-back or verification.", timestamp: 36, violation: true },
        ],
      },
      remediation: {
        required: true,
        action: "Confirm and read back new address; verify via OTP or registered mobile before updating.",
        deadline: new Date(Date.now() + 1 * 24 * 3600000).toISOString(),
        responsibleTeam: "Operations",
        status: "in_progress",
      },
      reporting: { reportable: false, regulator: "", reportDeadline: "", reported: false },
      customerNotification: { required: false, deadline: "", notified: false },
      recurrence: { isRecurring: true, occurrenceCount: 2, pattern: "Address updates without verification" },
    },
    {
      violationId: "viol_fk_005",
      callId: "call_fk_1005",
      agentId: agentIds[3],
      agentName: agentNames[3],
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      category: "SUITABILITY",
      subCategory: "cancellation_rights_not_stated",
      regulation: "Consumer rights – cancellation and refund eligibility",
      severity: "medium",
      severityReason: "Agent processed cancellation without stating eligibility window or refund policy",
      financialImpact: {
        potentialFine: 5_000_000,
        currency: "INR",
        fineCalculation: "Consumer protection estimate",
        probability: 15,
        expectedLoss: 750_000,
      },
      evidence: {
        transcriptExcerpt:
          "Agent: 'I’ll cancel the order.' Customer: 'Will I get full refund?' Agent: 'Yes.' [No policy or timeline stated]",
        timestamp: 190,
        fullTranscript: [
          { speaker: "agent", text: "Vikram here. How can I help?", timestamp: 0 },
          { speaker: "customer", text: "I want to cancel my order, I ordered by mistake.", timestamp: 12 },
          { speaker: "agent", text: "I’ll cancel it for you.", timestamp: 24 },
          { speaker: "customer", text: "Will I get full refund?", timestamp: 28 },
          { speaker: "agent", text: "Yes.", timestamp: 32, violation: true },
          { speaker: "system", text: "Cancellation rights and refund timeline not stated.", timestamp: 42, violation: true },
        ],
      },
      remediation: {
        required: true,
        action: "State cancellation eligibility (e.g. before shipment) and refund timeline (e.g. 7–10 days) on every cancellation.",
        deadline: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
        responsibleTeam: "Quality",
        status: "pending",
      },
      reporting: { reportable: false, regulator: "", reportDeadline: "", reported: false },
      customerNotification: { required: false, deadline: "", notified: false },
      recurrence: { isRecurring: false, occurrenceCount: 1, pattern: "Isolated incident" },
    },
  ];
}

export function getKPIData(): KPIData {
  return {
    overallTeamQAScore: { value: 87.5, trend: [82, 84, 85, 86, 87, 87.5, 87.5] },
    complianceAdherence: { value: 92.3, breakdown: { fully: 75, partial: 20, non: 5 } },
    euComplianceScore: getGranularComplianceScore(),
    customerEmotionIndex: { value: 3.8, trend: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8] },
    highRiskCallsCount: { value: 12, trend: "down" },
    averageHandlingTime: { value: 342, hourly: [320, 345, 350, 340, 335, 330, 325, 340] },
    silenceSmoothnessScore: { value: 8.2, trend: [7.5, 7.8, 8.0, 8.1, 8.2, 8.2, 8.2] },
    fraudProtocolAccuracy: { value: 94.5 },
    agentsNeedingCoaching: { value: 6 },
    escalationRiskScore: { value: 23.5 },
    totalCallsHandled: { value: 1247, trend: [1100, 1150, 1180, 1200, 1220, 1235, 1247] },
    firstCallResolutionRate: { value: 78.5, resolved: 979, unresolved: 268 },
    fraudDisputeCount: { value: 34, breakdown: { fraud: 18, dispute: 16 } },
  };
}

export function getIntentDistribution(): IntentDistribution[] {
  return [
    { intent: "Order Tracking", percentage: 28, count: 349 },
    { intent: "Return Request", percentage: 18, count: 224 },
    { intent: "Refund Status", percentage: 15, count: 187 },
    { intent: "Delivery Issue", percentage: 14, count: 175 },
    { intent: "Payment Issue", percentage: 10, count: 125 },
    { intent: "Product Complaint", percentage: 8, count: 100 },
    { intent: "Cancellation", percentage: 5, count: 62 },
    { intent: "Other", percentage: 2, count: 25 },
  ];
}

export function getTeamHeatmap(): IssueHeatmapData[] {
  const intents = [
    "Order Tracking",
    "Return Request",
    "Refund Status",
    "Delivery Issue",
    "Payment Issue",
    "Product Complaint",
  ];
  return intents.map((intent) => ({
    intent,
    complianceDeviation: Math.random() * 30 + 5,
    toneProblems: Math.random() * 25 + 3,
    silence: Math.random() * 20 + 2,
    incorrectInfo: Math.random() * 35 + 4,
    emotionalSpikes: Math.random() * 40 + 5,
    escalationRisk: Math.random() * 25 + 3,
  }));
}

export function getAgentLeaderboard(): AgentPerformance[] {
  const agents = [
    { name: "Priya Sharma", id: "agent_fk_001" },
    { name: "Rahul Verma", id: "agent_fk_002" },
    { name: "Anita Reddy", id: "agent_fk_003" },
    { name: "Vikram Singh", id: "agent_fk_004" },
    { name: "Sneha Patel", id: "agent_fk_005" },
    { name: "Arjun Nair", id: "agent_fk_006" },
    { name: "Kavya Iyer", id: "agent_fk_007" },
    { name: "Rohan Kapoor", id: "agent_fk_008" },
  ];
  return agents
    .map((agent, idx) => ({
      agentId: agent.id,
      agentName: agent.name,
      qaScore: 85 + Math.random() * 15,
      complianceScore: 88 + Math.random() * 12,
      aht: 280 + Math.random() * 120,
      sentimentHandling: 3.5 + Math.random() * 1.5,
      issues: idx < 3 ? ["Tone inconsistency", "Long pauses"] : [],
      severity: (idx < 2 ? "high" : idx < 4 ? "medium" : "low") as "high" | "medium" | "low",
    }))
    .sort((a, b) => b.qaScore - a.qaScore);
}

export function getHighRiskCalls(): HighRiskCall[] {
  const categories = ["Angry Customer", "Compliance Error", "Incorrect Info", "Silence Issue", "Escalation Risk"];
  const intents = ["Return Request", "Refund Status", "Delivery Issue", "Order Tracking"];
  const agentNames = [
    "Priya Sharma",
    "Rahul Verma",
    "Anita Reddy",
    "Vikram Singh",
    "Sneha Patel",
    "Arjun Nair",
    "Kavya Iyer",
    "Rohan Kapoor",
  ];
  return Array.from({ length: 8 }, (_, i) => {
    const category = categories[i % categories.length];
    const baseEmotion = category === "Angry Customer" ? 3.5 : category === "Compliance Error" ? 2.8 : 2.2;
    const emotionTimeline = Array.from(
      { length: 20 },
      (_, j) =>
        Math.max(
          0,
          Math.min(
            5,
            baseEmotion +
              Math.sin(j / 3) * 1.2 +
              (j / 20) * 0.5 +
              (Math.random() * 0.6 - 0.3)
          )
        )
    );
    return {
      callId: `call_fk_${1000 + i}`,
      intent: intents[i % intents.length],
      riskCategory: category,
      agentName: agentNames[i % agentNames.length],
      riskScore: 65 + Math.random() * 35,
      emotionTimeline,
      complianceMisses:
        i % 2 === 0
          ? ["Order verification", "Privacy disclaimer"]
          : ["Return/refund policy disclosure"],
      aiExplanation: `Customer showed frustration during ${intents[i % intents.length].toLowerCase()}. Agent missed required disclosure or verification step.`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

export function getSkillGapData(): SkillGapData[] {
  return [
    { skill: "Empathy", expected: 90, current: 85 },
    { skill: "Product & Policy Knowledge", expected: 95, current: 88 },
    { skill: "Return/Refund Handling", expected: 98, current: 92 },
    { skill: "Clarity of Explanation", expected: 92, current: 87 },
    { skill: "Process Accuracy", expected: 95, current: 90 },
    { skill: "Listening Skill", expected: 90, current: 86 },
    { skill: "Tone Stability", expected: 88, current: 82 },
  ];
}

export function getCoachingTickets(): CoachingTicket[] {
  return [
    {
      agentId: "agent_fk_002",
      agentName: "Rahul Verma",
      problemSummary: "Repeated compliance misses in return and refund calls",
      severity: "high",
      lastIssues: ["Missed order verification", "Incorrect return policy script", "Tone inconsistency"],
      recommendedTraining: "Return & Refund Policy & Compliance Workshop",
    },
    {
      agentId: "agent_fk_005",
      agentName: "Sneha Patel",
      problemSummary: "Low empathy scores in delivery complaint calls",
      severity: "medium",
      lastIssues: ["Poor emotional recognition", "Rushed responses"],
      recommendedTraining: "Empathy & Customer Communication",
    },
    {
      agentId: "agent_fk_006",
      agentName: "Arjun Nair",
      problemSummary: "High AHT and silence issues",
      severity: "medium",
      lastIssues: ["Long pauses", "Unclear explanations"],
      recommendedTraining: "Efficiency & Clarity Training",
    },
  ];
}

export function getCallList(): CallListItem[] {
  const agentNames = [
    "Priya Sharma",
    "Rahul Verma",
    "Anita Reddy",
    "Vikram Singh",
    "Sneha Patel",
    "Arjun Nair",
    "Kavya Iyer",
    "Rohan Kapoor",
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    callId: `call_fk_${2000 + i}`,
    agentName: agentNames[i % agentNames.length],
    intent: ["Order Tracking", "Return Request", "Refund Status", "Delivery Issue"][i % 4],
    riskScore: 30 + Math.random() * 70,
    sentiment: Array.from({ length: 15 }, () => Math.random() * 2 - 1),
    timestamp: new Date(Date.now() - i * 1800000).toISOString(),
  })).sort((a, b) => b.riskScore - a.riskScore);
}

const ECOMMERCE_TRANSCRIPTS: Record<string, Array<{ speaker: "agent" | "customer"; text: string; timestamp: number }>> = {
  "Refund Status": [
    { speaker: "agent", text: "Thank you for calling Flipkart. How can I help you today?", timestamp: 0 },
    { speaker: "customer", text: "I returned my order last week. When will I get my refund of ₹3,499?", timestamp: 4 },
    { speaker: "agent", text: "I’ll need to verify. Can you share your order ID or the mobile number on the account?", timestamp: 12 },
    { speaker: "customer", text: "Order ID is OD123456789, mobile ends in 8765.", timestamp: 18 },
    { speaker: "agent", text: "Thank you. The return was received. Your refund of ₹3,499 will be credited within 7–10 business days to the original payment method.", timestamp: 25 },
    { speaker: "customer", text: "Okay. So by next Friday?", timestamp: 32 },
    { speaker: "agent", text: "Yes, typically by then. You’ll get an SMS once it’s processed.", timestamp: 38 },
    { speaker: "customer", text: "Thanks.", timestamp: 45 },
  ],
  "Return Request": [
    { speaker: "agent", text: "Thank you for calling Flipkart. How can I help?", timestamp: 0 },
    { speaker: "customer", text: "I want to return my order—wrong size. I paid ₹1,899.", timestamp: 3 },
    { speaker: "agent", text: "I can help. For returns, we have a 10-day window from delivery. Can I have your order ID?", timestamp: 8 },
    { speaker: "customer", text: "Yes, it’s OD987654321.", timestamp: 12 },
    { speaker: "agent", text: "I’ve raised the return. Pickup will be scheduled within 2–3 days. Refund will be processed 7–10 days after we receive the product.", timestamp: 18 },
    { speaker: "customer", text: "Will I get full ₹1,899 back?", timestamp: 25 },
    { speaker: "agent", text: "Yes, full refund to the original payment method once the item is received and verified.", timestamp: 30 },
    { speaker: "customer", text: "Thank you.", timestamp: 38 },
  ],
  "Delivery Issue": [
    { speaker: "agent", text: "Thank you for calling Flipkart. How can I help you today?", timestamp: 0 },
    { speaker: "customer", text: "My order was supposed to arrive yesterday. Tracking hasn’t updated in 2 days.", timestamp: 3 },
    { speaker: "agent", text: "Can I have your order ID to check?", timestamp: 8 },
    { speaker: "customer", text: "OD555666777.", timestamp: 12 },
    { speaker: "agent", text: "I see the order is at the nearest hub. There was a slight delay. It should be out for delivery tomorrow. You’ll get an SMS with the delivery slot.", timestamp: 18 },
    { speaker: "customer", text: "Can I get a partial refund for the delay?", timestamp: 25 },
    { speaker: "agent", text: "I’ve noted the delay. If it doesn’t arrive by tomorrow, we can look at compensation as per our policy. I’ll follow up if needed.", timestamp: 30 },
    { speaker: "customer", text: "Okay, thanks.", timestamp: 38 },
  ],
  "Order Tracking": [
    { speaker: "agent", text: "Thank you for calling Flipkart. How can I help?", timestamp: 0 },
    { speaker: "customer", text: "I want to know where my order is. I ordered 3 days ago.", timestamp: 3 },
    { speaker: "agent", text: "Can you share your order ID or registered mobile?", timestamp: 7 },
    { speaker: "customer", text: "Mobile ends in 4321.", timestamp: 12 },
    { speaker: "agent", text: "Your order OD111222333 is shipped and will reach you by Friday. Current status: in transit to your city.", timestamp: 18 },
    { speaker: "customer", text: "Can I get the delivery person’s number?", timestamp: 22 },
    { speaker: "agent", text: "The number will be shared via SMS on the day of delivery. You can also see it in the app under Order Details.", timestamp: 28 },
    { speaker: "customer", text: "Thanks.", timestamp: 35 },
  ],
};

export function getCallDetail(callId: string): CallDetail {
  const highRiskCalls = getHighRiskCalls();
  const callList = getCallList();
  const matchingCall =
    highRiskCalls.find((c) => c.callId === callId) || callList.find((c) => c.callId === callId);
  const agentName = matchingCall?.agentName || "Priya Sharma";
  const callType = matchingCall?.intent || "Order Tracking";
  const transcript = ECOMMERCE_TRANSCRIPTS[callType] || ECOMMERCE_TRANSCRIPTS["Order Tracking"];
  const duration = transcript[transcript.length - 1]?.timestamp || 342;

  const violationsForCall = getViolations().filter((v) => v.callId === callId);
  const potentialFines = violationsForCall.reduce((s, v) => s + v.financialImpact.potentialFine, 0);
  const expectedLoss = violationsForCall.reduce((s, v) => s + v.financialImpact.expectedLoss, 0);

  const complianceChecklist: ComplianceItem[] = [
    {
      id: "ord_verify_001",
      category: "KYC",
      regulation: "Order verification before sharing status",
      item: "Order/Identity Verification",
      passed: !(matchingCall && "complianceMisses" in matchingCall && matchingCall.complianceMisses?.includes("Order verification")),
      details: {
        timestamp: 12,
        method: "verbal",
        scriptVersion: "OrderVerify_v1",
        language: "en",
        evidence: { transcriptExcerpt: "Agent confirms order ID or mobile before sharing details", confidence: 95 },
      },
      severity: "high",
      financialImpact: { potentialFine: 5_000_000, currency: "INR", fineCalculation: "Policy breach estimate" },
      remediation: { required: true, action: "Verify order/mobile before sharing status or refund", deadline: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), status: "pending" },
    },
    {
      id: "consent_001",
      category: "GDPR",
      regulation: "Recording consent & purpose",
      item: "Recording Consent",
      passed: false,
      details: {
        timestamp: 0,
        method: "not_obtained",
        scriptVersion: "Consent_v1",
        language: "en",
        evidence: { transcriptExcerpt: transcript[0]?.text || "Agent: Thank you for calling...", confidence: 98 },
      },
      severity: "critical",
      financialImpact: { potentialFine: 20_000_000, currency: "INR", fineCalculation: "Consumer data penalty estimate" },
      remediation: { required: true, action: "State recording disclosure at start of call", deadline: new Date(Date.now() + 1 * 24 * 3600000).toISOString(), status: "pending" },
    },
    {
      id: "return_policy_001",
      category: "Local_Regulation",
      regulation: "Return/refund policy disclosure",
      item: "Return & Refund Policy",
      passed: !(matchingCall && "complianceMisses" in matchingCall && matchingCall.complianceMisses?.includes("Return/refund policy disclosure")),
      details: {
        timestamp: 18,
        method: "verbal",
        scriptVersion: "ReturnPolicy_v1",
        language: "en",
        evidence: { transcriptExcerpt: "Agent states return window and refund timeline", confidence: 90 },
      },
      severity: "high",
      financialImpact: { potentialFine: 5_000_000, currency: "INR", fineCalculation: "Consumer rights estimate" },
      remediation: { required: true, action: "State return window and refund timeline on return/refund calls", deadline: new Date(Date.now() + 3 * 24 * 3600000).toISOString(), status: "pending" },
    },
    {
      id: "privacy_001",
      category: "GDPR",
      regulation: "Privacy and data use",
      item: "Privacy Disclaimer",
      passed: true,
      details: {
        timestamp: 5,
        method: "verbal",
        scriptVersion: "Privacy_v1",
        language: "en",
        evidence: { transcriptExcerpt: "Your information is used only for this request.", confidence: 85 },
      },
      severity: "medium",
      financialImpact: { potentialFine: 10_000_000, currency: "INR", fineCalculation: "Data protection estimate" },
      remediation: { required: false, action: "Provide privacy disclaimer where needed", deadline: new Date(Date.now() + 5 * 24 * 3600000).toISOString(), status: "completed" },
    },
  ];

  return {
    callId,
    agentName,
    customerId: "cust_fk_12345",
    timestamp: matchingCall?.timestamp || new Date().toISOString(),
    duration,
    emotionTimeline: Array.from({ length: Math.ceil(duration / 6.84) }, (_, i) => ({
      time: i * 6.84,
      emotion: Math.max(0, Math.min(5, 2.5 + Math.sin(i / 5) * 1.5 + (Math.random() * 1.5 - 0.75))),
    })),
    silenceTimeline: Array.from({ length: Math.ceil(duration / 40) }, (_, i) => ({ time: i * 40, duration: 2 + Math.random() * 5 })),
    complianceChecklist,
    violations: violationsForCall,
    speakingRatio: { agent: 45, customer: 55 },
    transcript,
    aiSummary:
      matchingCall && "aiExplanation" in matchingCall
        ? matchingCall.aiExplanation
        : "Call transcript analysis complete. Review recommended for quality assurance.",
    recommendedAction:
      matchingCall && "riskCategory" in matchingCall
        ? matchingCall.riskCategory === "Compliance Error"
          ? "Review compliance protocols. Agent needs retraining on order verification and return/refund policy."
          : matchingCall.riskCategory === "Angry Customer"
            ? "Review de-escalation and empathy. Consider training on handling frustrated customers."
            : "Review call for quality and provide feedback to agent."
        : "Review call for quality and provide feedback to agent.",
    financialRisk: { potentialFines: potentialFines, expectedLoss: expectedLoss, currency: "INR" },
  };
}

export function getTrendData() {
  return {
    qaTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 82 + i * 0.8 + Math.random() * 2 })),
    complianceTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 88 + i * 0.6 + Math.random() * 2 })),
    emotionTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 3.2 + i * 0.08 + Math.random() * 0.2 })),
    fraudTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 92 + i * 0.4 + Math.random() * 2 })),
    escalationTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 25 - i * 0.5 + Math.random() * 3 })),
    coachingTrend: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, value: 8 - i * 0.3 + Math.random() * 1 })),
  };
}

export function getTeamHealthData() {
  return {
    qaScore: 87.5,
    qaBreakdown: {
      empathy: 85,
      compliance: 92,
      tone: 88,
      resolution: 86,
      listening: 89,
    },
    qaTrend: [82, 84, 85, 86, 87, 87.5, 87.5],
    complianceData: {
      kycRate: 95,
      identityConfirmation: 93,
      fraudScript: 94,
      regulatoryStatement: 91,
      privacyDisclaimer: 96,
      violations: 12,
    },
    emotionData: {
      positive: 45,
      neutral: 35,
      negative: 20,
      timeline: Array.from({ length: 24 }, (_, i) => Math.sin(i / 3) * 0.3 + 0.5),
    },
    escalationData: {
      riskScore: 23.5,
      callsAtRisk: 12,
      agentsInvolved: ["Rahul Verma", "Sneha Patel", "Arjun Nair"],
      topCauses: ["Policy disclosure miss", "Tone issues", "Long silence"],
      trend: [28, 26, 25, 24, 23.5, 23.5, 23.5],
    },
  };
}
