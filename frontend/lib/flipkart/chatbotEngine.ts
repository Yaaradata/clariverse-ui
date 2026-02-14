/**
 * E-commerce CX chatbot engine – answers from real dashboard data.
 * Used by Flipkart CX Simulator; returns exact numbers from intent intelligence, X, Reddit, etc.
 */

import { getEcommerceIntentIntelligenceData } from '@/lib/flipkart/intentIntelligenceData';
import { getXKPIs } from '@/lib/flipkart/social/x';
import { getRedditKPIs } from '@/lib/flipkart/social/reddit';

export type ChatbotResponse = {
  answer: string;
  followUps: string[];
};

/** One section of the full CX summary report (for CX VP / report-style content). */
export type CXSummarySection = {
  title: string;
  content: string;
};

/** Full CX summary built from dashboard data – structured for report-style display, not chat. */
export function getFullCXSummary(): CXSummarySection[] {
  const intent = getEcommerceIntentIntelligenceData();
  const xKpis = getXKPIs();
  const redditKpis = getRedditKPIs();

  const totalUnresolved = intent.clusters.reduce((s, c) => s + c.unresolved, 0);
  const returnsCluster = intent.clusters.find((c) => c.name === 'Returns & Refunds');
  const orderCluster = intent.clusters.find((c) => c.name === 'Order & Delivery');
  const paymentCluster = intent.clusters.find((c) => c.name === 'Payment & Checkout');
  const topPressure = intent.highPressureIntents.slice(0, 5);

  const clusterLines = intent.clusters
    .map(
      (c) =>
        `• ${c.name}: ${c.unresolved} unresolved, pressure ${c.pressureScore}, urgency ${Math.round(c.avgUrgency * 100)}%. Channels: ${c.dominantChannels.join(', ')}.`
    )
    .join('\n');

  const pressureLines = topPressure
    .map((t) => `• ${t.name} – pressure ${t.pressure}, channel: ${t.channel}`)
    .join('\n');

  const conflictLines = intent.conflicts
    .map(
      (c) =>
        `• ${c.intent}: ${c.channels.map((ch) => `${ch.channel}=${ch.status}`).join('; ')}. Fix: ${c.aiFix}`
    )
    .join('\n');

  const recLines = intent.recommendations.map((r) => `• ${r.icon} ${r.text}`).join('\n');

  const xSentiment = xKpis.find((k) => k.id === 'x-rating')?.value ?? '3.8';
  const xReplied = xKpis.find((k) => k.id === 'x-replied')?.value ?? '63%';
  const xResponseTime = xKpis.find((k) => k.id === 'x-response-time')?.value ?? '42m';
  const redditSentiment = redditKpis.find((k) => k.id === 'reddit-rating')?.value ?? '4.1';
  const redditReplied = redditKpis.find((k) => k.id === 'reddit-replied')?.value ?? '71%';

  return [
    {
      title: 'Executive summary',
      content:
        `Total unresolved cases across intent clusters: ${totalUnresolved}. ` +
        `Returns & Refunds leads with ${returnsCluster?.unresolved ?? 618} open cases; Order & Delivery at ${orderCluster?.unresolved ?? 492}; Payment & Checkout at ${paymentCluster?.unresolved ?? 445}. ` +
        `Top pressure intents: ${topPressure.map((t) => t.name).join(', ')}. ` +
        `Social: X sentiment ${xSentiment}, reply rate ${xReplied}; Reddit sentiment ${redditSentiment}, reply rate ${redditReplied}. ` +
        `Priorities: clear refund/return SLA, unify status across channels, and sync delivery ETAs in chat and ticket.`,
    },
    {
      title: 'Key metrics',
      content:
        `• Total unresolved (all clusters): ${totalUnresolved}\n` +
        `• Returns & Refunds: ${returnsCluster?.unresolved ?? 618} | pressure ${returnsCluster?.pressureScore ?? 7.4} | urgency ${Math.round((returnsCluster?.avgUrgency ?? 0.72) * 100)}%\n` +
        `• Order & Delivery: ${orderCluster?.unresolved ?? 492} | pressure ${orderCluster?.pressureScore ?? 6.2}\n` +
        `• Payment & Checkout: ${paymentCluster?.unresolved ?? 445} | pressure ${paymentCluster?.pressureScore ?? 6.8}\n` +
        `• X: sentiment ${xSentiment}, replied ${xReplied}, avg response ${xResponseTime}\n` +
        `• Reddit: sentiment ${redditSentiment}, replied ${redditReplied}`,
    },
    {
      title: 'Intent landscape',
      content:
        clusterLines +
        (returnsCluster?.aiInsight ? `\n\nReturns & Refunds insight: ${returnsCluster.aiInsight}` : '') +
        (orderCluster?.aiInsight ? `\nOrder & Delivery insight: ${orderCluster.aiInsight}` : ''),
    },
    {
      title: 'High-pressure intents',
      content:
        pressureLines +
        '\n\nFocus first on Refund Not Processed and Return Pickup; these drive the most escalation and backlog.',
    },
    {
      title: 'Multi-channel conflicts',
      content:
        conflictLines ||
        'No conflicts flagged in current data. Continue monitoring refund status and delivery ETA consistency across email, chat, and voice.',
    },
    {
      title: 'Social snapshot (X & Reddit)',
      content:
        `X: Average sentiment ${xSentiment} (1–5), replied ${xReplied}, avg response time ${xResponseTime}. ` +
        `Reddit: Sentiment ${redditSentiment}, replied ${redditReplied}. ` +
        'Keep response times and reply rates in check; negative spikes often tie to refund and delivery delays.',
    },
    {
      title: 'Recommendations',
      content: recLines,
    },
    {
      title: 'Priority actions (next 90 minutes)',
      content:
        `1. Returns & Refunds: Prioritise return pickup and refund SLA; address Voice and Ticket volume (${returnsCluster?.unresolved ?? 618} unresolved).\n` +
        `2. High-pressure intents: Execute on Refund Not Processed and Return Pickup; then monitor ${topPressure[2]?.name ?? 'next'}.\n` +
        `3. Order & Delivery: Sync ETA in chat and ticket (${orderCluster?.unresolved ?? 492} open).\n` +
        '4. Unify return/refund status across email, chat, and voice; surface refund status in IVR and chat.\n' +
        '5. Add proactive delivery ETA in app where possible.',
    },
  ];
}

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function getChatbotAnswer(query: string): ChatbotResponse {
  const q = normalizeQuery(query);
  const intent = getEcommerceIntentIntelligenceData();
  const xKpis = getXKPIs();
  const redditKpis = getRedditKPIs();

  // —— Returns & Refunds (dashboard data) ——
  if (q.includes('refund') || q.includes('return') || q.includes('returns and refunds')) {
    const cluster = intent.clusters.find((c) => c.name === 'Returns & Refunds');
    const backlog = cluster?.unresolved ?? 618;
    const pressure = cluster?.pressureScore ?? 7.4;
    const urgency = Math.round((cluster?.avgUrgency ?? 0.72) * 100);
    return {
      answer: `**Returns & Refunds** (from your Intent Intelligence dashboard):\n\n` +
        `• **Unresolved backlog:** ${cluster?.unresolved ?? 618} cases\n` +
        `• **Pressure score:** ${cluster?.pressureScore ?? 7.4}\n` +
        `• **Avg urgency:** ${urgency}%\n` +
        `• **Top subtopics:** ${cluster?.topSubtopics?.join(', ') ?? 'Refund Status, Return Pickup'}\n` +
        `• **Dominant channels:** ${cluster?.dominantChannels?.join(', ') ?? 'Voice, Ticket'}\n\n` +
        `**AI insight:** ${cluster?.aiInsight ?? 'Prioritise return pickup and refund SLA to reduce voice escalation.'}`,
      followUps: [
        'What is the refund status conflict across channels?',
        'Which intents have the highest pressure?',
        'What are the top recommendations for returns?',
        'How is Order & Delivery performing?',
      ],
    };
  }

  // —— High pressure / top intents ——
  if (q.includes('high pressure') || q.includes('highest pressure') || q.includes('top intent')) {
    const top = intent.highPressureIntents.slice(0, 5);
    const lines = top.map((t) => `• **${t.name}** – pressure ${t.pressure}, channel: ${t.channel}`).join('\n');
    return {
      answer: `**Top high-pressure intents** (dashboard data):\n\n${lines}\n\n` +
        `These drive the most escalation and backlog; prioritise Refund Not Processed and Return Pickup.`,
      followUps: [
        'What is the Returns & Refunds backlog?',
        'Which clusters have the most unresolved cases?',
        'What are the multi-channel conflicts?',
        'Give me a summary of all clusters.',
      ],
    };
  }

  // —— Clusters summary ——
  if (q.includes('cluster') || q.includes('intent landscape') || q.includes('summary of cluster')) {
    const lines = intent.clusters
      .map(
        (c) =>
          `• **${c.name}** – ${c.unresolved} unresolved, pressure ${c.pressureScore}, urgency ${Math.round(c.avgUrgency * 100)}%, channels: ${c.dominantChannels.join(', ')}`
      )
      .join('\n');
    return {
      answer: `**Intent clusters** (from dashboard):\n\n${lines}`,
      followUps: [
        'What is the Returns & Refunds backlog?',
        'Which intents have the highest pressure?',
        'What are the critical severity intents?',
        'What do you recommend for refunds?',
      ],
    };
  }

  // —— Conflicts ——
  if (q.includes('conflict') || q.includes('multi-channel') || q.includes('refund status conflict')) {
    const lines = intent.conflicts
      .map(
        (c) =>
          `• **${c.intent}:** ${c.channels.map((ch) => `${ch.channel}=${ch.status}`).join('; ')}\n  Fix: ${c.aiFix}`
      )
      .join('\n\n');
    return {
      answer: `**Multi-channel conflicts** (dashboard):\n\n${lines}`,
      followUps: [
        'What are the top high-pressure intents?',
        'What is the Returns & Refunds backlog?',
        'What are the AI recommendations?',
      ],
    };
  }

  // —— Recommendations ——
  if (q.includes('recommendation') || q.includes('recommend') || q.includes('what to do')) {
    const lines = intent.recommendations.map((r) => `• ${r.icon} ${r.text}`).join('\n');
    return {
      answer: `**AI recommendations** (from dashboard):\n\n${lines}`,
      followUps: [
        'What are the high-pressure intents?',
        'What is the backlog for Returns & Refunds?',
        'Which channels have conflicts?',
      ],
    };
  }

  // —— Severity / critical ——
  if (q.includes('severity') || q.includes('critical') || q.includes('critical intent')) {
    const critical = intent.severityData.filter((s) => s.severity === 'Critical' || s.severity === 'High');
    const lines = critical.map((s) => `• **${s.intent}** – ${s.severity}, pressure ${s.pressure}`).join('\n');
    return {
      answer: `**Critical/High severity intents:**\n\n${lines}`,
      followUps: [
        'What is the refund and return backlog?',
        'What are the top pressure intents?',
        'What do you recommend?',
      ],
    };
  }

  // —— Social / X (Twitter) KPIs ——
  if (q.includes('x ') || q.includes('twitter') || q.includes('social sentiment') || q.includes('x sentiment')) {
    const sentiment = xKpis.find((k) => k.id === 'x-rating');
    const replied = xKpis.find((k) => k.id === 'x-replied');
    const responseTime = xKpis.find((k) => k.id === 'x-response-time');
    const positive = xKpis.find((k) => k.id === 'x-sentiment');
    return {
      answer: `**X (Twitter) dashboard KPIs:**\n\n` +
        `• **Average sentiment:** ${sentiment?.value ?? '3.8'} (1–5 scale) – ${sentiment?.description ?? ''}\n` +
        `• **Replied vs not replied:** ${replied?.value ?? '63%'} – ${replied?.description ?? ''}\n` +
        `• **Average response time:** ${responseTime?.value ?? '42m'} – ${responseTime?.description ?? ''}\n` +
        `• **Positive vs negative:** ${positive?.value ?? '72.4%'} – ${positive?.description ?? ''}`,
      followUps: [
        'What are Reddit KPIs?',
        'What are the top intent clusters?',
        'What needs immediate attention?',
        'Generate my day in 2 minutes.',
      ],
    };
  }

  // —— Reddit KPIs ——
  if (q.includes('reddit')) {
    const sentiment = redditKpis.find((k) => k.id === 'reddit-rating');
    const replied = redditKpis.find((k) => k.id === 'reddit-replied');
    const responseTime = redditKpis.find((k) => k.id === 'reddit-response-time');
    const positive = redditKpis.find((k) => k.id === 'reddit-sentiment');
    return {
      answer: `**Reddit dashboard KPIs:**\n\n` +
        `• **Average sentiment:** ${sentiment?.value ?? '4.1'} – ${sentiment?.description ?? ''}\n` +
        `• **Replied vs not replied:** ${replied?.value ?? '71%'} – ${replied?.description ?? ''}\n` +
        `• **Average response time:** ${responseTime?.value ?? '2.4h'} – ${responseTime?.description ?? ''}\n` +
        `• **Positive vs negative:** ${positive?.value ?? '78.6%'} – ${positive?.description ?? ''}`,
      followUps: [
        'What are X (Twitter) KPIs?',
        'What are the top intent clusters?',
        'What is the refund backlog?',
        'Generate my day in 2 minutes.',
      ],
    };
  }

  // —— Order & Delivery ——
  if (q.includes('order') || q.includes('delivery') || q.includes('order & delivery')) {
    const cluster = intent.clusters.find((c) => c.name === 'Order & Delivery');
    return {
      answer: `**Order & Delivery** (dashboard):\n\n` +
        `• **Unresolved:** ${cluster?.unresolved ?? 492}\n` +
        `• **Pressure score:** ${cluster?.pressureScore ?? 6.2}\n` +
        `• **Avg urgency:** ${Math.round((cluster?.avgUrgency ?? 0.58) * 100)}%\n` +
        `• **Subtopics:** ${cluster?.topSubtopics?.join(', ') ?? 'Delivery Delay, Order Tracking'}\n` +
        `• **Channels:** ${cluster?.dominantChannels?.join(', ') ?? 'Chat, Ticket'}\n\n` +
        `**AI insight:** ${cluster?.aiInsight ?? 'Sync delivery updates into chat and ticket to cut repeat contacts.'}`,
      followUps: [
        'What is the Returns & Refunds backlog?',
        'What are the high-pressure intents?',
        'What are the payment and checkout numbers?',
      ],
    };
  }

  // —— Payment & Checkout ——
  if (q.includes('payment') || q.includes('checkout') || q.includes('cod')) {
    const cluster = intent.clusters.find((c) => c.name === 'Payment & Checkout');
    return {
      answer: `**Payment & Checkout** (dashboard):\n\n` +
        `• **Unresolved:** ${cluster?.unresolved ?? 445}\n` +
        `• **Pressure score:** ${cluster?.pressureScore ?? 6.8}\n` +
        `• **Subtopics:** ${cluster?.topSubtopics?.join(', ') ?? 'Payment Failed, COD Issues'}\n` +
        `• **Channels:** ${cluster?.dominantChannels?.join(', ') ?? 'Chat, Email'}\n\n` +
        `**AI insight:** ${cluster?.aiInsight ?? 'Surface payment failure reasons in-app and retry flows in chat.'}`,
      followUps: [
        'What are the top pressure intents?',
        'What is the refund backlog?',
        'What do you recommend?',
      ],
    };
  }

  // —— Generate day / priorities / immediate attention ——
  if (
    q.includes('generate') ||
    q.includes('day in 2') ||
    q.includes('priorit') ||
    q.includes('immediate') ||
    q.includes('attention') ||
    q.includes('today')
  ) {
    const returnsCluster = intent.clusters.find((c) => c.name === 'Returns & Refunds');
    const orderCluster = intent.clusters.find((c) => c.name === 'Order & Delivery');
    const topPressure = intent.highPressureIntents.slice(0, 3);
    return {
      answer: `**Your day in 2 minutes** (from live dashboard):\n\n` +
        `**Immediate (next 90 min):**\n` +
        `1. **Returns & Refunds** – ${returnsCluster?.unresolved ?? 618} unresolved; prioritise return pickup and refund SLA (Voice/Ticket).\n` +
        `2. **High-pressure intents:** ${topPressure.map((t) => t.name).join(', ')} – focus on Refund Not Processed and Return Pickup first.\n` +
        `3. **Order & Delivery** – ${orderCluster?.unresolved ?? 492} open; sync ETA in chat and ticket.\n\n` +
        `**Key numbers:**\n` +
        `• Returns & Refunds backlog: ${returnsCluster?.unresolved ?? 618}\n` +
        `• Order & Delivery backlog: ${orderCluster?.unresolved ?? 492}\n` +
        `• Top pressure: ${topPressure.map((t) => `${t.name} (${t.pressure})`).join(', ')}\n\n` +
        `**AI recommendations:** Unify return/refund status across email, chat, voice; add proactive ETA in app; surface refund status in IVR and chat.`,
      followUps: [
        'What is the Returns & Refunds backlog?',
        'What are the multi-channel conflicts?',
        'What are X and Reddit KPIs?',
        'What do you recommend for refunds?',
      ],
    };
  }

  // —— Default / overview ——
  const totalUnresolved = intent.clusters.reduce((s, c) => s + c.unresolved, 0);
  return {
    answer: `**CX overview** (from your dashboards):\n\n` +
      `• **Total unresolved (intent clusters):** ${totalUnresolved}\n` +
      `• **Top clusters:** Returns & Refunds (${intent.clusters.find((c) => c.name === 'Returns & Refunds')?.unresolved ?? 618}), Order & Delivery (${intent.clusters.find((c) => c.name === 'Order & Delivery')?.unresolved ?? 492}), Payment & Checkout (${intent.clusters.find((c) => c.name === 'Payment & Checkout')?.unresolved ?? 445})\n` +
      `• **High-pressure intents:** ${intent.highPressureIntents.slice(0, 3).map((t) => t.name).join(', ')}\n` +
      `• **X sentiment:** ${xKpis.find((k) => k.id === 'x-rating')?.value ?? '3.8'}; Replied: ${xKpis.find((k) => k.id === 'x-replied')?.value ?? '63%'}\n` +
      `• **Reddit sentiment:** ${redditKpis.find((k) => k.id === 'reddit-rating')?.value ?? '4.1'}; Replied: ${redditKpis.find((k) => k.id === 'reddit-replied')?.value ?? '71%'}\n\n` +
      `Ask: refunds/returns, high pressure, clusters, X/Reddit KPIs, payment, delivery, or "Generate my day in 2 minutes".`,
    followUps: [
      'What is the Returns & Refunds backlog?',
      'What are the top high-pressure intents?',
      'What are X and Reddit KPIs?',
      'Generate my day in 2 minutes.',
    ],
  };
}

/** Question that triggers the full CX summary report (used as a tag/chip). */
export const SUMMARY_QUESTION = 'Give me a full CX summary across all channels';

/** Follow-up questions shown after the summary report. */
export const SUMMARY_FOLLOW_UPS = [
  'What are the top high-pressure intents?',
  'What are the multi-channel conflicts?',
  'What is the Returns & Refunds backlog?',
  'What do you recommend for refunds?',
  'What are X (Twitter) and Reddit KPIs?',
  'Generate my day in 2 minutes.',
];

export const DEFAULT_ECOMMERCE_QUESTIONS = [
  SUMMARY_QUESTION,
  'What is the Returns & Refunds backlog?',
  'What are the top high-pressure intents?',
  'What are X (Twitter) and Reddit KPIs?',
  'Generate my day in 2 minutes.',
  'What are the multi-channel conflicts?',
  'What do you recommend for refunds?',
  'What is Order & Delivery performance?',
  'What are the critical severity intents?',
];
