// Stable customer journey data for cross-channel escalation visualization
// Using seeded random for consistent data across reloads

export interface JourneyStep {
  channel: "email" | "ticket" | "chat" | "voice";
  timestamp: string;
  escalated: boolean;
  sentiment: number; // Old sentiment for backward compatibility (-1 to 1)
  sentimentScore: number; // 1-5 scale for tooltip (1=calm, 5=frustrated)
  duration?: number;
  subtopics: string[]; // 3-4 EU banking subtopics
  messageCount?: number; // Number of messages/threads for this step
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  originChannel: "email" | "ticket" | "chat" | "voice";
  journey: JourneyStep[];
  totalEscalations: number;
  finalChannel: "email" | "ticket" | "chat" | "voice";
  aiSuggestion: string;
  aiSummary: string; // Comprehensive summary based on all channel interactions
  nextActionSuggestion: string; // AI-generated next action recommendation
  severity: "high" | "medium" | "low";
}

const CHANNELS: ("email" | "ticket" | "chat" | "voice")[] = ["email", "ticket", "chat", "voice"];

// Seeded random number generator for consistent data
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  random(): number {
    return this.next();
  }
}

// Generate AI Summary based on journey data
function generateAISummary(
  journey: JourneyStep[],
  customerId: string,
  originChannel: string,
  finalChannel: string
): string {
  const channels = journey.map(step => step.channel);
  const allSubtopics = journey.flatMap(step => step.subtopics);
  const sentimentProgression = journey.map(step => step.sentimentScore);
  const avgSentiment = sentimentProgression.reduce((a, b) => a + b, 0) / sentimentProgression.length;
  const finalSentiment = sentimentProgression[sentimentProgression.length - 1];
  
  // Identify main topics
  const mainTopics = [...new Set(allSubtopics)].slice(0, 3).join(", ");
  
  // Determine escalation pattern
  const escalated = journey.some(step => step.escalated);
  const channelSequence = channels.join(" → ");
  
  // Generate context-aware summary
  let summary = `Customer ${customerId} initiated contact via ${originChannel} regarding ${mainTopics}. `;
  
  if (journey.length > 1) {
    summary += `The interaction progressed through ${journey.length} channels (${channelSequence}), `;
  }
  
  if (sentimentProgression[0] <= 2 && finalSentiment >= 4) {
    summary += `with sentiment escalating from calm (${sentimentProgression[0]}/5) to frustrated (${finalSentiment}/5). `;
  } else if (finalSentiment >= 4) {
    summary += `with consistently high frustration levels (${finalSentiment}/5). `;
  }
  
  if (escalated) {
    summary += `The issue escalated to ${finalChannel} channel, indicating urgent resolution needs. `;
  }
  
  // Add channel-specific insights
  const uniqueChannels = new Set(channels);
  if (uniqueChannels.size > 1) {
    summary += `Customer utilized ${uniqueChannels.size} different communication channels, suggesting the issue required multiple touchpoints. `;
  }
  
  summary += `Key concerns included: ${allSubtopics.slice(0, 4).join(", ")}. `;
  summary += `Average sentiment across journey: ${avgSentiment.toFixed(1)}/5, indicating ${avgSentiment >= 3.5 ? "significant" : avgSentiment >= 2.5 ? "moderate" : "minimal"} customer dissatisfaction.`;
  
  return summary;
}

// Generate Next Action Suggestion based on journey data
function generateNextActionSuggestion(
  journey: JourneyStep[],
  finalChannel: string,
  finalSentiment: number
): string {
  const escalated = journey.some(step => step.escalated);
  const finalStep = journey[journey.length - 1];
  const mainTopics = finalStep.subtopics.join(", ");
  
  let suggestion = "";
  
  if (finalSentiment >= 4 && escalated) {
    // High urgency escalation
    suggestion = `URGENT: Immediately assign senior support specialist to ${finalChannel} channel. `;
    suggestion += `Customer sentiment at ${finalSentiment}/5 requires executive escalation. `;
    suggestion += `Focus on: ${mainTopics}. `;
    suggestion += `Provide proactive status updates every 2 hours. `;
    suggestion += `Consider compensation offer to prevent churn. `;
    suggestion += `Schedule follow-up call within 24 hours to ensure resolution.`;
  } else if (finalSentiment >= 3) {
    // Moderate concern
    suggestion = `Assign dedicated support agent to ${finalChannel} channel. `;
    suggestion += `Address concerns: ${mainTopics}. `;
    suggestion += `Provide clear timeline for resolution. `;
    suggestion += `Monitor sentiment closely and escalate if no improvement in 48 hours.`;
  } else {
    // Lower priority
    suggestion = `Continue monitoring ${finalChannel} channel interactions. `;
    suggestion += `Ensure timely responses to prevent escalation. `;
    suggestion += `Proactively address: ${mainTopics}. `;
    suggestion += `Consider proactive outreach to confirm satisfaction.`;
  }
  
  // Add channel-specific recommendations
  if (finalChannel === "voice") {
    suggestion += ` Schedule callback within 4 hours for personalized resolution.`;
  } else if (finalChannel === "ticket") {
    suggestion += ` Update ticket status and provide detailed resolution plan.`;
  } else if (finalChannel === "email") {
    suggestion += ` Send acknowledgment email with case reference and expected resolution time.`;
  } else if (finalChannel === "chat") {
    suggestion += ` Ensure live agent availability for immediate response.`;
  }
  
  return suggestion;
}

// Generate stable customer journeys with fixed seed
// Ensures all channels have escalations and minimum 3 steps per journey
export const generateCustomerJourneys = (): CustomerJourney[] => {
  const journeys: CustomerJourney[] = [];
  const issues = [
    "Billing discrepancy",
    "Product feature request",
    "Service outage",
    "Refund processing delay",
    "Account access problem",
    "Product defect",
    "Password reset",
    "Billing error",
    "Technical support",
    "Account verification",
  ];

  // Use fixed seed for consistent data
  const rng = new SeededRandom(12345);

  // EU Retail Banking Problem Themes - Each journey follows one problem theme
  // Subtopics progress from inquiry → concern → escalation, all relating to the same core problem
  const problemThemes = [
    {
      theme: "Account Access Issue",
      initial: ["Login attempt failed", "Password reset request", "Account locked", "Two-factor authentication"],
      intermediate: ["Still cannot access account", "Security verification needed", "Account unlock request", "Access denied"],
      escalation: ["Account security breach concern", "Formal access complaint", "Regulatory access violation", "Urgent account recovery"]
    },
    {
      theme: "Card Transaction Dispute",
      initial: ["Unauthorized transaction query", "Card payment inquiry", "Merchant charge question", "Transaction not recognized"],
      intermediate: ["Transaction investigation needed", "Chargeback request submitted", "Payment dispute initiated", "Fraud concern raised"],
      escalation: ["Fraud claim filed", "Regulatory complaint submitted", "Financial compensation demand", "Card cancellation request"]
    },
    {
      theme: "Account Balance Discrepancy",
      initial: ["Balance mismatch inquiry", "Transaction history request", "Statement discrepancy", "Missing transaction query"],
      intermediate: ["Transaction still missing", "Processing delay concern", "Account reconciliation needed", "Balance error investigation"],
      escalation: ["Financial error claim", "Regulatory investigation request", "Compensation claim", "Account statement correction"]
    },
    {
      theme: "Card Activation Problem",
      initial: ["Card not working", "PIN reset request", "Card delivery inquiry", "Activation issue"],
      intermediate: ["Card still blocked", "Activation failed again", "Security verification pending", "Card unblock request"],
      escalation: ["Card replacement urgent", "Service failure complaint", "Regulatory breach claim", "New card delivery demand"]
    },
    {
      theme: "Transfer Payment Issue",
      initial: ["Transfer inquiry", "Payment processing delay", "Recipient verification", "SEPA transfer question"],
      intermediate: ["Transfer failed notification", "Payment stuck in processing", "Processing error investigation", "Transfer retry needed"],
      escalation: ["Transfer reversal request", "Financial loss claim", "Regulatory complaint", "Urgent payment resolution"]
    },
    {
      theme: "Account Verification Delay",
      initial: ["Identity verification inquiry", "Document upload question", "KYC process status", "Account opening delay"],
      intermediate: ["Verification still pending", "Additional documents requested", "Review delay concern", "Verification status update"],
      escalation: ["Verification failure appeal", "Account restriction complaint", "Regulatory compliance issue", "Account access demand"]
    },
    {
      theme: "Banking Fee Dispute",
      initial: ["Unexpected fee charge", "Fee explanation request", "Billing inquiry", "Monthly fee question"],
      intermediate: ["Fee dispute submitted", "Chargeback request filed", "Refund inquiry initiated", "Fee calculation error"],
      escalation: ["Fee refund demand", "Compensation claim", "Regulatory fee violation", "Service credit request"]
    },
    {
      theme: "Digital Banking Access",
      initial: ["Mobile app login issue", "Online banking access problem", "Technical error report", "App functionality question"],
      intermediate: ["App still not working", "Access denied repeatedly", "System error persists", "Technical support needed"],
      escalation: ["System outage complaint", "Critical access needed", "Service failure claim", "Priority technical support"]
    },
    {
      theme: "Direct Debit Problem",
      initial: ["Direct debit setup inquiry", "Recurring payment question", "Authorization issue", "Mandate verification"],
      intermediate: ["Direct debit failed", "Payment rejected", "Authorization problem", "Mandate cancellation"],
      escalation: ["Financial loss claim", "Regulatory breach complaint", "Compensation demand", "Direct debit cancellation"]
    },
    {
      theme: "Account Closure Issue",
      initial: ["Account closure request", "Fund transfer inquiry", "Balance confirmation", "Closure process question"],
      intermediate: ["Closure delayed", "Transfer pending", "Balance discrepancy", "Closure status update"],
      escalation: ["Account closure dispute", "Fund recovery claim", "Regulatory complaint", "Urgent closure request"]
    }
  ];

  // Predefined paths to ensure all channels get escalations
  // Format: [origin, intermediate1, intermediate2 (optional), finalEscalation]
  // Some paths have 3 steps, some have 4 steps
  const predefinedPaths: Array<{
    steps: Array<"email" | "ticket" | "chat" | "voice">;
  }> = [
    { steps: ["email", "chat", "ticket"] },                    // 1: email → chat → ticket (3 steps)
    { steps: ["email", "chat", "voice", "ticket"] },           // 2: email → chat → voice → ticket (4 steps)
    { steps: ["email", "ticket", "chat"] },                   // 3: email → ticket → chat (3 steps)
    { steps: ["ticket", "email", "voice"] },                   // 4: ticket → email → voice (3 steps)
    { steps: ["ticket", "chat", "voice", "ticket"] },           // 5: ticket → chat → voice → ticket (4 steps)
    { steps: ["ticket", "voice", "email"] },                   // 6: ticket → voice → email (3 steps)
    { steps: ["chat", "email", "voice", "ticket"] },           // 7: chat → email → voice → ticket (4 steps)
    { steps: ["chat", "ticket", "voice"] },                    // 8: chat → ticket → voice (3 steps)
    { steps: ["chat", "voice", "chat"] },                      // 9: chat → voice → chat (3 steps)
    { steps: ["voice", "email", "chat", "ticket"] },            // 10: voice → email → chat → ticket (4 steps)
  ];

  // Distribution ensures all channels have escalations:
  // - Email escalations: 1 (path 6)
  // - Ticket escalations: 3 (paths 1, 5, 7)
  // - Chat escalations: 1 (path 3)
  // - Voice escalations: 1 (path 8)
  // Mix of 3-step and 4-step journeys

  for (let i = 1; i <= 10; i++) {
    const customerId = `CUST-${String(i).padStart(3, "0")}`;
    const path = predefinedPaths[i - 1];
    const steps = path.steps;
    const originChannel = steps[0];
    const finalChannel = steps[steps.length - 1];
    
    const journey: JourneyStep[] = [];
    const startTime = new Date(2024, 0, 15 + i, 8, 0);
    
    // Get problem theme for this customer - ensures same problem throughout journey
    // Subtopics progress from initial inquiry → intermediate concern → escalation demand
    const problemTheme = problemThemes[(i - 1) % problemThemes.length];
    const initialTopicSet = problemTheme.initial;
    const intermediateTopicSet = problemTheme.intermediate;
    const escalationTopicSet = problemTheme.escalation;
    
    // Step 1: Origin - Sentiment 1-2 (calm, initial inquiry)
    const originSentiment = Math.floor(rng.random() * 2) + 1; // 1-2
    // Generate message count based on channel type
    const originMessageCount = originChannel === "email" 
      ? Math.floor(rng.random() * 5) + 2 // 2-6 email threads
      : originChannel === "chat"
      ? Math.floor(rng.random() * 15) + 5 // 5-19 chat messages
      : originChannel === "voice"
      ? Math.floor(rng.random() * 7) + 18 // 18-24 voice messages (min 18)
      : Math.floor(rng.random() * 4) + 1; // 1-4 ticket threads
    // Set duration for voice channel (10-20 minutes)
    const originDuration = originChannel === "voice" 
      ? Math.floor(rng.random() * 11) + 10 // 10-20 minutes
      : undefined;
    journey.push({
      channel: originChannel,
      timestamp: startTime.toISOString(),
      escalated: false,
      sentiment: 0.1 + rng.random() * 0.3, // Keep old sentiment for compatibility
      sentimentScore: originSentiment,
      duration: originDuration,
      subtopics: initialTopicSet,
      messageCount: originMessageCount,
    });

    let currentSentiment = originSentiment;
    let currentTime = startTime.getTime();

    // Function to get realistic time difference based on channel transition
    const getTimeDifference = (
      fromChannel: "email" | "ticket" | "chat" | "voice",
      toChannel: "email" | "ticket" | "chat" | "voice",
      isEscalation: boolean = false
    ): number => {
      // Base time differences in hours (more realistic)
      // Format: { fromChannel: { toChannel: [minHours, maxHours] } }
      const timeMatrix: Record<string, Record<string, [number, number]>> = {
        email: {
          chat: [3, 8],      // Email to chat: 3-8 hours (customer waits for email response, then switches to chat)
          voice: [4, 12],     // Email to voice: 4-12 hours (longer wait, then calls)
          ticket: [6, 24],    // Email to ticket: 6-24 hours (formal escalation takes longer)
        },
        chat: {
          email: [1, 4],      // Chat to email: 1-4 hours (quick follow-up via email)
          voice: [0.5, 2],    // Chat to voice: 30 min - 2 hours (immediate escalation)
          ticket: [2, 8],     // Chat to ticket: 2-8 hours (escalation after chat session)
        },
        voice: {
          email: [2, 6],      // Voice to email: 2-6 hours (follow-up documentation)
          chat: [1, 3],       // Voice to chat: 1-3 hours (quick follow-up)
          ticket: [4, 12],    // Voice to ticket: 4-12 hours (formal escalation)
        },
        ticket: {
          email: [1, 4],      // Ticket to email: 1-4 hours (quick response)
          chat: [0.5, 2],     // Ticket to chat: 30 min - 2 hours (immediate support)
          voice: [1, 3],      // Ticket to voice: 1-3 hours (personal call)
        },
      };

      // If escalation, reduce time (more urgent)
      const baseRange = timeMatrix[fromChannel]?.[toChannel] || [2, 6];
      let [minHours, maxHours] = baseRange;
      
      if (isEscalation) {
        // Escalations are faster - reduce by 30-50%
        minHours = Math.max(0.5, minHours * 0.5);
        maxHours = Math.max(1, maxHours * 0.7);
      }

      // Add some randomness within the range
      const hours = minHours + (rng.random() * (maxHours - minHours));
      return Math.round(hours * 60) * 60 * 1000; // Convert to milliseconds
    };

    // Intermediate steps (1 or 2 steps depending on path length)
    // For 3-step: steps.length = 3, so this loop runs once (stepIdx = 1)
    // For 4-step: steps.length = 4, so this loop runs twice (stepIdx = 1, 2)
    const numIntermediateSteps = steps.length - 2; // Total steps minus origin and final
    
    for (let intermediateIdx = 0; intermediateIdx < numIntermediateSteps; intermediateIdx++) {
      const stepIdx = intermediateIdx + 1; // stepIdx in the steps array (1 or 2)
      const fromChannel = steps[stepIdx - 1];
      const toChannel = steps[stepIdx];
      const timeDiff = getTimeDifference(fromChannel, toChannel, false);
      currentTime += timeDiff;
      
      // Sentiment should increase with each intermediate step (growing concern)
      const sentimentIncrease = intermediateIdx === 0 ? 1 : 0.5; // First intermediate gets +1, second gets +0.5
      const minStepSentiment = Math.min(Math.ceil(currentSentiment + sentimentIncrease), 4);
      const maxStepSentiment = 4;
      const stepSentiment = Math.min(
        minStepSentiment + Math.floor(rng.random() * (maxStepSentiment - minStepSentiment + 1)),
        4
      );
      currentSentiment = stepSentiment;
      
      // Generate message count based on channel type
      const stepMessageCount = steps[stepIdx] === "email" 
        ? Math.floor(rng.random() * 5) + 2 // 2-6 email threads
        : steps[stepIdx] === "chat"
        ? Math.floor(rng.random() * 15) + 5 // 5-19 chat messages
        : steps[stepIdx] === "voice"
        ? Math.floor(rng.random() * 7) + 18 // 18-24 voice messages (min 18)
        : Math.floor(rng.random() * 4) + 1; // 1-4 ticket threads
      // Set duration for voice channel (10-20 minutes)
      const stepDuration = steps[stepIdx] === "voice" 
        ? Math.floor(rng.random() * 11) + 10 // 10-20 minutes
        : undefined;
      // Use intermediate subtopics for intermediate steps - same problem, progressing concern
      journey.push({
        channel: steps[stepIdx],
        timestamp: new Date(currentTime).toISOString(),
        escalated: false,
        sentiment: 0.1 + rng.random() * 0.2, // Keep old sentiment for compatibility
        sentimentScore: currentSentiment,
        duration: stepDuration,
        subtopics: intermediateTopicSet, // Same problem theme, but intermediate level subtopics
        messageCount: stepMessageCount,
      });
    }

    // Final step: Escalation - Sentiment should be highest (frustrated/urgent)
    const lastIntermediateChannel = steps[steps.length - 2];
    const escalationTimeDiff = getTimeDifference(lastIntermediateChannel, finalChannel, true);
    currentTime += escalationTimeDiff;
    const minEscalationSentiment = Math.min(currentSentiment + 1, 5);
    const escalationSentiment = Math.max(minEscalationSentiment, 4); // Always at least 4 for escalation
    // Generate message count for final escalation step
    const finalMessageCount = finalChannel === "email" 
      ? Math.floor(rng.random() * 5) + 2 // 2-6 email threads
      : finalChannel === "chat"
      ? Math.floor(rng.random() * 15) + 5 // 5-19 chat messages
      : finalChannel === "voice"
      ? Math.floor(rng.random() * 7) + 18 // 18-24 voice messages (min 18)
      : Math.floor(rng.random() * 4) + 1; // 1-4 ticket threads
    // Set duration for voice channel (10-20 minutes), undefined for other channels
    const finalDuration = finalChannel === "voice" 
      ? Math.floor(rng.random() * 11) + 10 // 10-20 minutes
      : undefined;
    // Final step uses escalation subtopics - same problem theme, but urgent/escalation level
    journey.push({
      channel: finalChannel,
      timestamp: new Date(currentTime).toISOString(),
      escalated: true,
      sentiment: -0.1 - rng.random() * 0.4, // Keep old sentiment for compatibility
      sentimentScore: escalationSentiment,
      duration: finalDuration,
      subtopics: escalationTopicSet, // Same problem theme, but escalation level subtopics
      messageCount: finalMessageCount,
    });

    // Verify journey length matches expected steps
    if (journey.length !== steps.length) {
      console.error(`Journey length mismatch for customer ${customerId}: expected ${steps.length}, got ${journey.length}`);
    }

    // All journeys have escalation on final step
    const totalEscalations = 1;
    const severity = "high";
    const issue = issues[i - 1];
    const journeyLength = journey.length;
    
    const aiSuggestion = `Customer escalated through ${journeyLength} channels. Issue: ${issue}. Urgent: Immediate attention required.`;

    // Generate AI Summary based on journey data
    const aiSummary = generateAISummary(journey, customerId, originChannel, finalChannel);
    
    // Generate Next Action Suggestion based on journey data
    const nextActionSuggestion = generateNextActionSuggestion(journey, finalChannel, escalationSentiment);

    journeys.push({
      id: String(i),
      customerId,
      originChannel,
      journey,
      totalEscalations,
      finalChannel: finalChannel,
      aiSuggestion,
      aiSummary,
      nextActionSuggestion,
      severity,
    });
  }
  
  // Debug: Log journey lengths
  console.log('Journey lengths:', journeys.map(j => ({ customer: j.customerId, steps: j.journey.length, path: j.journey.map(s => s.channel).join(' → ') })));

  return journeys;
};

