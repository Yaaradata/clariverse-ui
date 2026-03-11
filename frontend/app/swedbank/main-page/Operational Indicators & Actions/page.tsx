"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { UnifiedFiltersBar } from "@/components/unified/filters/UnifiedFiltersBar";
import { SystemHealthRibbon, type SystemHealthMetric } from "@/components/unified/kpi/SystemHealthRibbon";
import { CrossChannelTrendChart } from "@/components/unified/trends/CrossChannelTrendChart";
import { EmotionShockboard } from "@/components/unified/intents/IntentIntelligenceSection";
import { AIDayGeneratorChat } from "@/components/unified/AIDayGeneratorChat";
import {
  UnifiedIntelligenceWall,
} from "@/components/unified/intelligence/UnifiedIntelligenceWall";
import { IntentIntelligenceCommandCenter } from "@/components/unified/intelligence/IntentIntelligenceCommandCenter";
import { AIPressureInsightWall } from "@/components/unified/intelligence/AIPressureInsightWall";
import { Target } from "lucide-react";
import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";
import { PrematureClosureRiskCard } from "@/components/unified/intelligence/PrematureClosureRiskCard";
import { AIRiskSpikeMonitor, bankingRiskSpikes } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { DailyDigestCard } from "@/components/email/DailyDigestCard";
import { PriorityResolutionChart } from "@/components/email/PriorityResolutionChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchIntentClusters,
  fetchSeverityMatrix,
  fetchSystemHealth,
  fetchTrendData,
  fetchCrossChannelActionGrid,
  fetchAISummaryWall,
  type IntentClusterResponse,
  type SeverityMatrixResponse,
  type SystemHealthResponse,
  type TrendPointResponse,
  type ChannelKey,
  type CrossChannelActionGridResponse,
  type AISummaryWallResponse,
} from "@/lib/unified/adapters";
import {
  getEisenhowerThreads,
  generatePriorityResolutionDataForQuadrant,
  type EisenhowerThread,
} from "@/lib/swedbank/api";
import { Button } from "@/components/ui/button";
import { FCIKPICards } from "@/components/FCI/FCIKPICards";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { SmartAgentActionList } from "@/components/FCI/SmartAgentActionList";
import { IntentScoreHeatmap } from "@/components/FCI/IntentScoreHeatmap";
import { fciKPIData, fciClusters } from "@/lib/swedbank/fci-lib/fciData";
import { agentActionData } from "@/lib/swedbank/fci-lib/fciAdvancedData";

type DateRange = {
  start: string;
  end: string;
};

type InsightTone = "default" | "info" | "success" | "warning" | "danger";
interface Insight {
  title: string;
  description: string;
  tone: InsightTone;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const PRESET_CONFIGS: Record<string, { volume: number; urgency: number; sentimentShift: number }> = {
  All: { volume: 1, urgency: 1, sentimentShift: 0 },
  "Current day": { volume: 0.18, urgency: 1.15, sentimentShift: -3 },
  "One Week": { volume: 0.35, urgency: 1.1, sentimentShift: -1.5 },
  "One Month": { volume: 0.6, urgency: 1.0, sentimentShift: 0 },
  "6 Months": { volume: 1.2, urgency: 0.9, sentimentShift: 1.5 },
};

const CHANNEL_LABELS_MAP: Record<ChannelKey, string> = {
  email: "Email",
  chat: "Chat",
  ticket: "Ticket",
  social: "Social",
  voice: "Voice",
};

const CHANNEL_TABS: ChannelKey[] = ["email", "chat", "ticket", "social", "voice"];

const PRIMARY_SECTION_TABS = [
  {
    id: "operational-indicators",
    label: "Operational Indicators & Actions",
    description: "Health, trends, and guided actions",
  },
  {
    id: "failed-customer-interaction",
    label: "Customer Analysis",
    description: "Customer behaviour, severity & recommendations",
  },
  {
    id: "channel-analysis",
    label: "Channel Analysis",
    description: "Cross-channel workload & prioritization",
  },
  {
    id: "workforce-performance",
    label: "Workforce Performance",
    description: "Intent heatmap & agent training",
  },
  {
    id: "intent-analysis",
    label: "Intent Analysis",
    description: "Intent clusters, severity & insights",
  },
];

const INITIAL_QUADRANT_STATE: Record<ChannelKey, string | null> = CHANNEL_TABS.reduce(
  (acc, channel) => ({ ...acc, [channel]: null }),
  {} as Record<ChannelKey, string | null>,
);

const QUADRANT_LABELS: Record<string, string> = {
  do: "Do - Now",
  schedule: "Schedule - Later",
  delegate: "Delegate - Team",
  delete: "Postpone",
};
const QUADRANT_DESCRIPTIONS: Record<string, string> = {
  do: "Important & Urgent",
  schedule: "Important, Not Urgent",
  delegate: "Not Important, Urgent",
  delete: "Not Important, Not Urgent",
};

const QUADRANT_COLORS: Record<string, { dot: string; badge: string }> = {
  do: { dot: "bg-red-500", badge: "border-red-500" },
  schedule: { dot: "bg-yellow-500", badge: "border-yellow-500" },
  delegate: { dot: "bg-[#5332ff]", badge: "border-[#5332ff]" },
  delete: { dot: "bg-gray-500", badge: "border-gray-500" },
};

const QUADRANT_ORDER: Array<"do" | "schedule" | "delegate" | "delete"> = [
  "do",
  "schedule",
  "delegate",
  "delete",
];

// ─────────────────────────────────────────────────────────────────────────────
// AI SUMMARY WALL — 4 distinct analytical voices, one per quadrant
// ─────────────────────────────────────────────────────────────────────────────

const CHANNEL_UNIT: Record<string, string> = {
  email: "threads", chat: "conversations", ticket: "tickets",
  social: "mentions", voice: "calls",
};
const CHANNEL_VERB: Record<string, string> = {
  email: "reply to", chat: "respond to", ticket: "resolve",
  social: "address", voice: "follow up on",
};

function topTopicsFrom(threads: EisenhowerThread[], n = 3) {
  const counts: Record<string, number> = {};
  threads.forEach((t) => {
    const key = t.topic || t.subject_norm || t.dominant_cluster_name || "Other";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([topic, count]) => ({ topic, count, pct: Math.round((count / threads.length) * 100) }));
}

function avgOf(threads: EisenhowerThread[], key: keyof EisenhowerThread): number {
  if (!threads.length) return 0;
  return threads.reduce((s, t) => s + (t[key] as number), 0) / threads.length;
}

function oldestDaysProxy(threads: EisenhowerThread[]): number {
  const maxRisk = Math.max(...threads.map((t) => t.risk_score));
  return Math.round((maxRisk / 100) * 21);
}

// ── DO: Triage / crisis analyst ───────────────────────────────────────────────
function buildDoInsights(threads: EisenhowerThread[], channel: string): { insights: Insight[]; detailsSummary: string } {
  const unit = CHANNEL_UNIT[channel] ?? "items";
  const verb = CHANNEL_VERB[channel] ?? "handle";
  const total = threads.length;

  if (total === 0) {
    return {
      insights: [{ title: "All clear — no critical items", description: `The Do Now queue for ${channel} is empty. No immediate triage required.`, tone: "success" }],
      detailsSummary: "Do Now: 0 items.",
    };
  }

  const open = threads.filter((t) => t.resolution_status === "open");
  const inProg = threads.filter((t) => t.resolution_status === "in_progress");
  const escalated = threads.filter((t) => t.escalation_count > 0);
  const p1 = threads.filter((t) => t.priority === "P1");
  const highRisk = threads.filter((t) => t.risk_score >= 75);
  const avgSentiment = avgOf(threads, "overall_sentiment");
  const avgImpact = avgOf(threads, "business_impact_score");
  const topTopics = topTopicsFrom(threads);
  const oldestDays = oldestDaysProxy(threads);
  const insights: Insight[] = [];

  const criticalPct = Math.round((p1.length / total) * 100);
  insights.push({
    title: `🔴 ${p1.length} critical contact${p1.length !== 1 ? "s" : ""} need immediate ${verb === "reply to" ? "a reply" : "action"}`,
    description: `${p1.length} P1 ${unit} (${criticalPct}% of queue) require same-session handling. ${open.length} remain fully open and ${inProg.length} are in progress. Avg. business impact: ${Math.round(avgImpact)}/100 — do not defer.`,
    tone: p1.length > 10 ? "danger" : "warning",
  });

  if (escalated.length > 0) {
    const escPct = Math.round((escalated.length / total) * 100);
    const escTopics = topTopicsFrom(escalated, 2);
    insights.push({
      title: `⚠️ ${escalated.length} active escalation${escalated.length !== 1 ? "s" : ""} (${escPct}% of queue)`,
      description: escTopics.length > 0
        ? `Escalated ${unit} cluster around "${escTopics[0].topic}" (${escTopics[0].pct}%)${escTopics[1] ? ` and "${escTopics[1].topic}" (${escTopics[1].pct}%)` : ""}. Route to senior agents immediately — unresolved escalations compound sentiment decay at ~0.3 pts/hour.`
        : `${escalated.length} escalated ${unit} require senior-agent routing. Each hour without resolution increases churn probability by an estimated 12%.`,
      tone: "danger",
    });
  }

  if (avgSentiment >= 3.8) {
    insights.push({
      title: "Customer frustration above threshold",
      description: `Avg. sentiment ${avgSentiment.toFixed(1)}/5 (${avgSentiment >= 4.5 ? "Frustrated" : "Anger"} band). Customers at this level are 3× more likely to churn within 7 days. Prioritise empathetic, resolution-first ${unit} — avoid template responses.`,
      tone: "danger",
    });
  } else if (avgSentiment >= 2.8) {
    insights.push({
      title: "Elevated tension detected in queue",
      description: `Sentiment at ${avgSentiment.toFixed(1)}/5 signals moderate-to-high frustration. Proactive acknowledgment before resolution reduces escalation rate by ~20% in comparable queues.`,
      tone: "warning",
    });
  }

  if (oldestDays >= 3) {
    insights.push({
      title: `SLA clock ticking — oldest exposure ~${oldestDays} day${oldestDays !== 1 ? "s" : ""}`,
      description: `${highRisk.length} ${unit} carry risk scores ≥ 75/100. If unresolved today, ~${Math.round(highRisk.length * 0.6)} are projected to breach SLA. Consider a dedicated sprint or surge assignment to clear the backlog before EOD.`,
      tone: highRisk.length >= 5 ? "danger" : "warning",
    });
  }

  if (topTopics.length > 0 && topTopics[0].pct >= 20) {
    insights.push({
      title: `Playbook trigger: "${topTopics[0].topic}"`,
      description: `"${topTopics[0].topic}" accounts for ${topTopics[0].pct}% of Do-Now ${unit} (${topTopics[0].count} items). A pre-approved response template could cut avg. handle-time by 35–50% for this cluster. Check if a macro exists; if not, flag to QA for creation.`,
      tone: "info",
    });
  }

  if (inProg.length > 0) {
    const inProgPct = Math.round((inProg.length / total) * 100);
    insights.push({
      title: "In-progress momentum check",
      description: `${inProg.length} ${unit} (${inProgPct}%) are already being worked. Confirm agents aren't stalling — ${unit} in-progress > 4 hrs without update should be re-triaged or escalated.`,
      tone: inProgPct > 50 ? "success" : "info",
    });
  }

  return {
    insights: insights.slice(0, 3),
    detailsSummary: `Do Now (${channel}): ${total} ${unit} — ${open.length} open, ${escalated.length} escalated, avg. sentiment ${avgSentiment.toFixed(1)}/5.`,
  };
}

// ── SCHEDULE: Capacity planner ────────────────────────────────────────────────
function buildScheduleInsights(threads: EisenhowerThread[], channel: string): { insights: Insight[]; detailsSummary: string } {
  const unit = CHANNEL_UNIT[channel] ?? "items";
  const total = threads.length;

  if (total === 0) {
    return {
      insights: [{ title: "Schedule queue is clear", description: `No ${unit} pending planned review for ${channel}. Capacity is available for overflow from other quadrants.`, tone: "success" }],
      detailsSummary: "Schedule: 0 items.",
    };
  }

  const p2 = threads.filter((t) => t.priority === "P2");
  const p3 = threads.filter((t) => t.priority === "P3");
  const closed = threads.filter((t) => t.resolution_status === "closed");
  const open = threads.filter((t) => t.resolution_status === "open");
  const avgRisk = avgOf(threads, "risk_score");
  const avgImpact = avgOf(threads, "business_impact_score");
  const topTopics = topTopicsFrom(threads);
  const batchSize = total <= 30 ? total : total <= 100 ? Math.round(total / 3) : Math.round(total / 5);
  const estimatedDays = Math.ceil(total / (batchSize * 2));
  const insights: Insight[] = [];

  insights.push({
    title: `📅 ${total} ${unit} queued for planned review`,
    description: `Important but not time-critical. At a pace of ${batchSize} ${unit}/batch (×2/day), this clears in ~${estimatedDays} working day${estimatedDays !== 1 ? "s" : ""}. ${closed.length > 0 ? `${closed.length} (${Math.round((closed.length / total) * 100)}%) already resolved without escalation — strong execution signal.` : "None resolved yet; first batch should focus on P2 items."}`,
    tone: "info",
  });


  if (topTopics.length >= 2) {
    insights.push({
      title: "Topic-based batching recommended",
      description: `Top clusters: "${topTopics[0].topic}" (${topTopics[0].pct}%), "${topTopics[1].topic}" (${topTopics[1].pct}%)${topTopics[2] ? `, "${topTopics[2].topic}" (${topTopics[2].pct}%)` : ""}. Batching by topic cuts avg. resolution time 20–30% vs. random assignment. Route each cluster to a topic-familiar agent.`,
      tone: "success",
    });
  }

  const openRate = Math.round((open.length / total) * 100);
  if (openRate > 70) {
    insights.push({
      title: "Capacity gap — rebalancing needed",
      description: `${openRate}% of scheduled ${unit} are still open. If agent availability is constrained, temporarily move the lowest-impact P3 cluster to Postpone and focus scheduled capacity on P2-first resolution.`,
      tone: "warning",
    });
  } else {
    insights.push({
      title: "Queue on track — maintain throughput",
      description: `${100 - openRate}% of scheduled ${unit} are progressing or resolved. No redistribution needed. Use remaining capacity to review aging P2 items before the next business day.`,
      tone: "success",
    });
  }

  if (avgRisk >= 40) {
    insights.push({
      title: `SLA window: ~${Math.round(48 - (avgRisk / 100) * 24)} hrs before exposure`,
      description: `Avg. risk ${Math.round(avgRisk)}/100 — this queue has roughly ${Math.round(48 - (avgRisk / 100) * 24)} hrs before items cross into SLA-breach territory. Schedule review sessions now to stay ahead of the curve.`,
      tone: avgRisk >= 65 ? "warning" : "info",
    });
  }

  return {
    insights: insights.slice(0, 3),
    detailsSummary: `Schedule (${channel}): ${total} ${unit} — ${p2.length} P2, ${p3.length} P3, avg. risk ${Math.round(avgRisk)}/100.`,
  };
}

// ── DELEGATE: Routing & distribution specialist ───────────────────────────────
function buildDelegateInsights(threads: EisenhowerThread[], channel: string): { insights: Insight[]; detailsSummary: string } {
  const unit = CHANNEL_UNIT[channel] ?? "items";
  const total = threads.length;

  if (total === 0) {
    return {
      insights: [{ title: "Delegation queue empty", description: `No ${unit} pending routing for ${channel}. Team capacity is available for cross-channel support.`, tone: "success" }],
      detailsSummary: "Delegate: 0 items.",
    };
  }

  const open = threads.filter((t) => t.resolution_status === "open");
  const inProg = threads.filter((t) => t.resolution_status === "in_progress");
  const escalated = threads.filter((t) => t.escalation_count > 0);
  const avgSentiment = avgOf(threads, "overall_sentiment");
  const avgImpact = avgOf(threads, "business_impact_score");
  const topTopics = topTopicsFrom(threads, 4);
  const topTopicPct = topTopics[0]?.pct ?? 0;
  const isConcentrated = topTopicPct >= 30;
  const isFragmented = topTopics.length >= 4 && topTopics[3].pct >= 10;
  const assignedRate = Math.round((inProg.length / total) * 100);
  const insights: Insight[] = [];

  insights.push({
    title: `🔀 ${total} ${unit} ready for team distribution`,
    description: `Urgent but low-ownership — route to available agents by expertise. ${open.length} unassigned, ${inProg.length} in progress. Avg. business impact ${Math.round(avgImpact)}/100. Mis-routing here wastes capacity without significant customer risk, but correct routing improves throughput measurably.`,
    tone: "info",
  });

  if (isConcentrated && topTopics[0]) {
    insights.push({
      title: `Specialisation win: "${topTopics[0].topic}"`,
      description: `${topTopics[0].pct}% of this queue (${topTopics[0].count} ${unit}) is "${topTopics[0].topic}". Routing to a dedicated owner cuts avg. handle-time ~35% vs. generalist assignment. No specialist? This is a training signal for team development.`,
      tone: "success",
    });
  } else if (isFragmented) {
    insights.push({
      title: "Fragmented queue — multi-skill routing required",
      description: `Topics spread evenly: ${topTopics.map((t) => `"${t.topic}" ${t.pct}%`).join(", ")}. No single specialist covers this queue. Use round-robin with topic tagging so agents self-select their strongest areas.`,
      tone: "info",
    });
  }

  if (avgSentiment >= 3.5) {
    insights.push({
      title: "Moderate frustration — match agent EQ",
      description: `Avg. sentiment ${avgSentiment.toFixed(1)}/5. Customers are irritated even in this lower-importance tier. Prioritise high de-escalation agents for assignment. A poor first reply can push these into the Do-Now queue next cycle.`,
      tone: "warning",
    });
  } else {
    insights.push({
      title: "Sentiment stable — standard routing applies",
      description: `Avg. sentiment ${avgSentiment.toFixed(1)}/5 is within normal range. SLA-based routing is appropriate. Personalised responses are still recommended over templates.`,
      tone: "default",
    });
  }

  if (assignedRate < 30) {
    insights.push({
      title: "⚡ Low assignment rate — push to team now",
      description: `Only ${assignedRate}% of delegated ${unit} are in progress. ${open.length} sitting unassigned. Use bulk-assignment rules or a morning standup to distribute before the queue ages into higher-priority territory.`,
      tone: "warning",
    });
  } else {
    insights.push({
      title: `Assignment coverage: ${assignedRate}% in flight`,
      description: `${assignedRate}% of delegated ${unit} are actively in progress. Routing is working — focus on throughput and handoff quality. Spot-check ~${Math.min(5, Math.ceil(inProg.length * 0.1))} in-progress items for resolution quality before closing.`,
      tone: "success",
    });
  }

  const channelTip: Record<string, string> = {
    email: "Use inbox rules or shared-mailbox labels to auto-sort by topic before agents pick up.",
    chat: "Configure chat routing groups by skill tag so agents in the right group pick up matching conversations automatically.",
    ticket: "Apply ticket views filtered by topic cluster; agents work their specialisation queue without manual sorting.",
    social: "Assign by platform origin (Twitter vs. Facebook vs. Instagram) before applying topic routing.",
    voice: "Pre-screen voicemails by topic using IVR data; route to the right team queue before callback assignment.",
  };

  return {
    insights: insights.slice(0, 3),
    detailsSummary: `Delegate (${channel}): ${total} ${unit} — ${open.length} unassigned, ${escalated.length} with escalation history.`,
  };
}

// ── DELETE / POSTPONE: Data analyst & archivist ───────────────────────────────
function buildDeleteInsights(threads: EisenhowerThread[], channel: string): { insights: Insight[]; detailsSummary: string } {
  const unit = CHANNEL_UNIT[channel] ?? "items";
  const total = threads.length;

  if (total === 0) {
    return {
      insights: [{ title: "Postpone queue is empty", description: `No ${unit} in the low-priority backlog for ${channel}. Nothing to archive or defer.`, tone: "success" }],
      detailsSummary: "Postpone: 0 items.",
    };
  }

  const closed = threads.filter((t) => t.resolution_status === "closed");
  const open = threads.filter((t) => t.resolution_status === "open");
  const medRisk = threads.filter((t) => t.risk_score >= 30 && t.risk_score < 60);
  const avgSentiment = avgOf(threads, "overall_sentiment");
  const avgRisk = avgOf(threads, "risk_score");
  const topTopics = topTopicsFrom(threads, 4);
  const archiveCandidates = threads.filter((t) => t.resolution_status === "closed" || t.risk_score < 20).length;
  const insights: Insight[] = [];

  if (archiveCandidates >= 5) {
    insights.push({
      title: `🗑️ ${archiveCandidates} ${unit} are archive-ready`,
      description: `${archiveCandidates} ${unit} (closed or risk < 20/100) can be safely archived without operational impact. Clearing them reduces queue noise and improves signal quality for trend reporting. Run a bulk-archive action after a final spot-check.`,
      tone: "info",
    });
  }


  if (medRisk.length > 0) {
    insights.push({
      title: `⏱️ ${medRisk.length} mid-risk ${unit} need re-evaluation in 2–4 weeks`,
      description: `${medRisk.length} deferred ${unit} carry risk scores 30–60/100. Postpone is appropriate now but re-evaluate periodically. If risk scores climb above 60, promote to Schedule or Do-Now before SLA exposure compounds.`,
      tone: medRisk.length > total * 0.3 ? "warning" : "info",
    });
  }

  if (avgSentiment >= 3.0) {
    insights.push({
      title: "Deferred ≠ forgotten — consider an acknowledgment",
      description: `Avg. sentiment ${avgSentiment.toFixed(1)}/5 in this queue. Even postponed ${unit} involve real customers. A lightweight automated acknowledgment prevents these from generating follow-up contacts or social noise. Effort: low. Risk reduction: moderate.`,
      tone: "info",
    });
  } else {
    insights.push({
      title: "Low sentiment pressure — safe to defer",
      description: `Avg. sentiment ${avgSentiment.toFixed(1)}/5. Customers in this queue are not actively frustrated. Deferral carries minimal churn risk at current sentiment levels. Re-verify in next monthly review.`,
      tone: "success",
    });
  }

  return {
    insights: insights.slice(0, 3),
    detailsSummary: `Postpone (${channel}): ${total} ${unit} — ${closed.length} resolved, ${archiveCandidates} archive-ready, avg. risk ${Math.round(avgRisk)}/100.`,
  };
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
function generateQuadrantSummary(
  threads: EisenhowerThread[],
  quadrant: string,
  channel: string,
): { insights: { title: string; description: string; tone: InsightTone }[]; detailsSummary: string } {
  const quadrantThreads = threads.filter((t) => t.quadrant === quadrant);
  switch (quadrant) {
    case "do":       return buildDoInsights(quadrantThreads, channel);
    case "schedule": return buildScheduleInsights(quadrantThreads, channel);
    case "delegate": return buildDelegateInsights(quadrantThreads, channel);
    case "delete":   return buildDeleteInsights(quadrantThreads, channel);
    default:
      return { insights: [{ title: "No analysis available", description: "Unknown quadrant.", tone: "default" }], detailsSummary: "" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function computeCustomConfig(range: DateRange): { volume: number; urgency: number; sentimentShift: number } {
  const start = range.start ? new Date(range.start) : null;
  const end = range.end ? new Date(range.end) : null;

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { volume: 1, urgency: 1, sentimentShift: 0 };
  }

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
  const normalized = clamp(diffDays / 30, 0.1, 2);

  const volume = clamp(normalized, 0.15, 1.5);
  let urgency = 1;
  if (diffDays <= 2) urgency = 1.25;
  else if (diffDays <= 7) urgency = 1.12;
  else if (diffDays >= 60) urgency = 0.85;

  let sentimentShift = 0;
  if (diffDays <= 3) sentimentShift = -2;
  else if (diffDays >= 90) sentimentShift = 2;

  return { volume, urgency, sentimentShift };
}

function getPresetConfig(preset: string, range: DateRange) {
  if (preset === "Custom") {
    return computeCustomConfig(range);
  }
  return PRESET_CONFIGS[preset] ?? PRESET_CONFIGS.All;
}

function rebalanceChannelVolumes(
  desiredTotal: number,
  channels: { channel: ChannelKey; value: number }[],
): { channel: ChannelKey; value: number }[] {
  if (channels.length === 0) return channels;

  const adjusted = [...channels];
  const total = adjusted.reduce((sum, entry) => sum + entry.value, 0);
  const delta = desiredTotal - total;

  if (delta === 0) return adjusted;

  let targetIndex = 0;
  if (delta < 0) {
    const largestValue = Math.max(...adjusted.map((entry) => entry.value));
    targetIndex = adjusted.findIndex((entry) => entry.value === largestValue);
  }

  adjusted[targetIndex] = {
    ...adjusted[targetIndex],
    value: Math.max(1, adjusted[targetIndex].value + delta),
  };

  return adjusted;
}

function transformIntentClusters(
  clusters: IntentClusterResponse[],
  preset: string,
  range: DateRange,
): IntentClusterResponse[] {
  const { volume, urgency, sentimentShift } = getPresetConfig(preset, range);

  return clusters.map((cluster) => {
    const scaledVolume = Math.max(10, Math.round(cluster.volume * volume));
    const scaledUrgency = clamp(cluster.urgency * urgency, 0, 1);
    const scaledSentiment = clamp(cluster.sentiment + sentimentShift, 35, 95);

    const scaledChannels = rebalanceChannelVolumes(
      scaledVolume,
      cluster.volumeByChannel.map((entry) => ({
        channel: entry.channel,
        value: Math.max(1, Math.round(entry.value * volume)),
      })),
    );

    return {
      ...cluster,
      sentiment: scaledSentiment,
      urgency: scaledUrgency,
      volume: scaledVolume,
      volumeByChannel: scaledChannels,
    };
  });
}

function EisenhowerSummaryCard({
  channel,
  threads,
  selectedQuadrant,
  onQuadrantSelect,
}: {
  channel: ChannelKey;
  threads: EisenhowerThread[];
  selectedQuadrant: string | null;
  onQuadrantSelect: (quadrant: string) => void;
}) {
  const total = threads.length || 1;

  const quadrantStats = QUADRANT_ORDER.map((quadrant) => {
    const count = threads.filter((thread) => thread.quadrant === quadrant).length;
    const rawPercentage = (count / total) * 100;
    const percentage = rawPercentage < 1 && rawPercentage > 0 ? Number(rawPercentage.toFixed(1)) : Math.round(rawPercentage);

    return {
      quadrant,
      count,
      percentage,
      label: QUADRANT_LABELS[quadrant],
      description: QUADRANT_DESCRIPTIONS[quadrant],
      colors: QUADRANT_COLORS[quadrant],
    };
  });

  const activeQuadrant = selectedQuadrant;

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-[#b90abd]" />
            {CHANNEL_LABELS_MAP[channel]} • Eisenhower Quadrant Distribution
          </CardTitle>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#b90abd]/10 border border-[#b90abd]/30 rounded-md">
            <span className="text-sm">✨</span>
            <span className="text-xs text-[#b90abd] font-medium">AI Priority Analysis</span>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Thread distribution across priority quadrants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {quadrantStats.map(({ quadrant, count, percentage, label, description, colors }) => {
            const isSelected = activeQuadrant === quadrant;
            const isLeftColumn = quadrant === "do" || quadrant === "delegate";
            const isTopRow = quadrant === "do" || quadrant === "schedule";
            const hasHighPriorityGlow = quadrant === "do" && count > 500;

            return (
              <div
                key={`${channel}-${quadrant}`}
                className={`relative rounded-lg p-5 cursor-pointer transition-all duration-200 text-center ${
                  isSelected
                    ? "bg-[color:var(--background)] ring-2 ring-[#b90abd] shadow-lg"
                    : "bg-[color:var(--card)] hover:bg-[color:var(--background)]"
                } ${
                  isLeftColumn ? "lg:border-r lg:border-[color:var(--border)]" : ""
                } ${isTopRow ? "border-b border-[color:var(--border)]" : ""}`}
                onClick={() => onQuadrantSelect(quadrant)}
              >
                {hasHighPriorityGlow && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b90abd]/10 via-[#b90abd]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
                )}
                <div className="relative z-10 flex items-center justify-center mb-3 gap-2">
                  {hasHighPriorityGlow && <span className="text-sm animate-pulse">✨</span>}
                  <div className={`w-3.5 h-3.5 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-semibold text-gray-200">{label}</span>
                </div>
                <div className="relative z-10 text-3xl font-bold text-white mb-1">{count}</div>
                <div className="relative z-10 text-xs text-gray-400 mb-3">{percentage}%</div>
                <div className="relative z-10 text-xs text-gray-500">{description}</div>

                {quadrant === "do" && count > 0 && (
                  <Button
                    className="relative z-10 mt-4 w-full bg-gradient-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white text-xs"
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuadrantSelect("do");
                    }}
                  >
                    <span className="mr-2">◎</span>
                    Work on Top Priority →
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerAnalysisSection() {
  const isDarkMode = true;

  return (
    <section id="failed-customer-interaction" className="space-y-6 scroll-mt-20">
      <div className="mb-6">
        <FCIKPICards data={fciKPIData} isDarkMode={isDarkMode} />
      </div>
      <div
        className="rounded-2xl mb-6"
        style={{
          backgroundColor: isDarkMode ? "#0d0d0d" : "#FFFFFF",
          border: `1px solid ${isDarkMode ? "#1f1f1f" : "#E5E5E5"}`,
        }}
      >
        <FailureClusters clusters={fciClusters} isDarkMode={isDarkMode} />
      </div>
    </section>
  );
}

function WorkforcePerformanceSection() {
  const isDarkMode = true;

  return (
    <section id="workforce-performance" className="space-y-6 scroll-mt-20">
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          backgroundColor: isDarkMode ? "#0d0d0d" : "#FFFFFF",
          border: `1px solid ${isDarkMode ? "#1f1f1f" : "#E5E5E5"}`,
        }}
      >
        <IntentScoreHeatmap isDarkMode={isDarkMode} />
      </div>
      <div
        className="rounded-2xl mb-6"
        style={{
          backgroundColor: isDarkMode ? "#0d0d0d" : "#FFFFFF",
          border: `1px solid ${isDarkMode ? "#1f1f1f" : "#E5E5E5"}`,
        }}
      >
        <SmartAgentActionList data={agentActionData} isDarkMode={isDarkMode} />
      </div>
    </section>
  );
}

export default function HomePage() {
  const getCurrentMonthRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  };

  const [dateFilterPreset, setDateFilterPreset] = useState<string>("Current Month");
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange());
  const [activePrimarySection, setActivePrimarySection] = useState<string>(PRIMARY_SECTION_TABS[0].id);

  const [systemHealth, setSystemHealth] = useState<SystemHealthMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendPointResponse[]>([]);
  const [intentClusters, setIntentClusters] = useState<IntentClusterResponse[]>([]);
  const [allIntentClusters, setAllIntentClusters] = useState<IntentClusterResponse[]>([]);
  const [appliedPreset, setAppliedPreset] = useState<string>("Current Month");
  const [appliedRange, setAppliedRange] = useState<DateRange>(getCurrentMonthRange());
  const [severityMatrix, setSeverityMatrix] = useState<SeverityMatrixResponse[]>([]);
  const [metricExplanations, setMetricExplanations] = useState<Record<string, string>>({});

  const [actionGrid, setActionGrid] = useState<CrossChannelActionGridResponse | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummaryWallResponse | null>(null);

  const [eisenhowerThreads, setEisenhowerThreads] = useState<EisenhowerThread[]>([]);
  const [activeEisenhowerChannel, setActiveEisenhowerChannel] = useState<ChannelKey>("email");
  const [selectedQuadrants, setSelectedQuadrants] = useState<Record<ChannelKey, string | null>>(() => ({
    ...INITIAL_QUADRANT_STATE,
  }));
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<Record<ChannelKey, "summary" | "details">>(() =>
    CHANNEL_TABS.reduce((acc, channel) => ({ ...acc, [channel]: "summary" as const }), {} as Record<ChannelKey, "summary" | "details">)
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [health, trend, clusters, matrix, actionGridData, aiSummaryData, eisenhowerThreadsData] = await Promise.all([
        fetchSystemHealth(),
        fetchTrendData(),
        fetchIntentClusters(),
        fetchSeverityMatrix(),
        fetchCrossChannelActionGrid(),
        fetchAISummaryWall(),
        getEisenhowerThreads(),
      ]);

      if (!mounted) return;

      const mappedHealth = health.map<SystemHealthMetric>((item: SystemHealthResponse) => ({
        channel: item.channel,
        label: item.label,
        icon: item.icon as SystemHealthMetric["icon"],
        color: item.color,
        total: item.total,
        sentiment: item.sentiment,
        sentimentDelta: item.sentimentDelta,
        sentimentTrend: item.sentimentTrend,
        urgencyPct: item.urgencyPct,
        urgencyTrend: item.urgencyTrend,
        urgencyStartPct: item.urgencyStartPct,
        urgencyEndPct: item.urgencyEndPct,
        slaRisk: item.slaRisk,
        slaRiskTrend: item.slaRiskTrend,
        slaRiskStartPct: item.slaRiskStartPct,
        slaRiskEndPct: item.slaRiskEndPct,
        dateRange: item.dateRange,
        unresolved: item.unresolved,
        unresolvedCompany: item.unresolvedCompany,
        unresolvedCustomer: item.unresolvedCustomer,
        unresolvedCompanyPct: item.unresolvedCompanyPct,
        unresolvedCustomerPct: item.unresolvedCustomerPct,
        emergingTheme: item.emergingTheme,
      }));

      const explanationMap: Record<string, string> = {};
      mappedHealth.forEach((metric) => {
        const direction = metric.sentimentDelta >= 0 ? "up" : "down";
        const delta = Math.abs(metric.sentimentDelta).toFixed(2);
        explanationMap[metric.channel] = `${metric.label} sentiment sits at ${metric.sentiment.toFixed(1)} (${getSentimentLabel(metric.sentiment)}) with sentiment trending ${direction} ${delta}. Urgent workload is ${metric.urgencyPct}% and ${metric.unresolved} items remain unresolved, exposing ${metric.slaRisk}% SLA risk.`;
      });

      setSystemHealth(mappedHealth);
      setMetricExplanations(explanationMap);
      setTrendData(trend);
      setAllIntentClusters(clusters);
      setSeverityMatrix(matrix);
      setActionGrid(actionGridData);
      setAiSummary(aiSummaryData);
      setEisenhowerThreads(eisenhowerThreadsData);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleQuadrantSelect = useCallback((channel: ChannelKey, quadrant: string) => {
    setSelectedQuadrants((prev) => {
      const newValue = prev[channel] === quadrant ? null : quadrant;
      if (newValue !== null) {
        setActiveQuadrantTab((tabPrev) => ({ ...tabPrev, [channel]: "summary" }));
      }
      return { ...prev, [channel]: newValue };
    });
  }, []);

  useEffect(() => {
    if (allIntentClusters.length === 0) return;
    setIntentClusters(transformIntentClusters(allIntentClusters, appliedPreset, appliedRange));
  }, [allIntentClusters, appliedPreset, appliedRange]);

  useEffect(() => {
    if (intentClusters.length === 0) {
      setSelectedIntentId(null);
      return;
    }
    setSelectedIntentId((prev) =>
      prev && intentClusters.some((cluster) => cluster.id === prev) ? prev : intentClusters[0].id,
    );
  }, [intentClusters]);

  const threadsByChannel = useMemo<Record<ChannelKey, EisenhowerThread[]>>(() => {
    const base = CHANNEL_TABS.reduce((acc, channel) => {
      acc[channel] = [];
      return acc;
    }, {} as Record<ChannelKey, EisenhowerThread[]>);

    eisenhowerThreads.forEach((thread) => {
      const channel = thread.channel as ChannelKey;
      if (base[channel]) base[channel].push(thread);
    });

    return base;
  }, [eisenhowerThreads]);

  const handlePresetChange = (value: string) => {
    setDateFilterPreset(value);
    if (value !== "Custom") {
      const today = new Date();
      const startDate = new Date(today);
      switch (value) {
        case "All":
          setDateRange({ start: "", end: "" });
          break;
        case "Current day":
          setDateRange({ start: today.toISOString().split("T")[0], end: today.toISOString().split("T")[0] });
          break;
        case "Current Month":
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          setDateRange({ start: firstDay.toISOString().split("T")[0], end: today.toISOString().split("T")[0] });
          break;
        case "One Week":
          startDate.setDate(today.getDate() - 7);
          setDateRange({ start: startDate.toISOString().split("T")[0], end: today.toISOString().split("T")[0] });
          break;
        case "One Month":
          startDate.setMonth(today.getMonth() - 1);
          setDateRange({ start: startDate.toISOString().split("T")[0], end: today.toISOString().split("T")[0] });
          break;
        case "6 Months":
          startDate.setMonth(today.getMonth() - 6);
          setDateRange({ start: startDate.toISOString().split("T")[0], end: today.toISOString().split("T")[0] });
          break;
        default:
          break;
      }
    }
  };

  const handleApplyFilters = () => {
    setAppliedPreset(dateFilterPreset);
    setAppliedRange({ ...dateRange });
  };

  const handlePrimarySectionSelect = useCallback((sectionId: string) => {
    setActivePrimarySection(sectionId);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-6 bg-[var(--background)] min-h-screen">
      <UnifiedFiltersBar
        dateFilterPreset={dateFilterPreset}
        dateRange={dateRange}
        onPresetChange={handlePresetChange}
        onDateRangeChange={setDateRange}
        onApply={handleApplyFilters}
        onOpenAI={() => setIsChatOpen(true)}
      />

      <div className="overflow-x-auto">
        <div className="flex w-full gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-2 backdrop-blur">
          {PRIMARY_SECTION_TABS.map((tab) => {
            const isActive = activePrimarySection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handlePrimarySectionSelect(tab.id)}
                className={`flex min-w-[240px] flex-1 flex-col rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-[#b90abd]/70 bg-gradient-to-r from-[#b90abd]/20 to-[#5332ff]/10 text-white shadow-lg"
                    : "border-white/5 bg-black/20 text-gray-300 hover:border-[#b90abd]/40 hover:text-white"
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-wide">{tab.label}</span>
                <span className="text-xs text-gray-400">{tab.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activePrimarySection === "operational-indicators" && (
        <>
          <section id="operational-indicators" className="space-y-6 scroll-mt-20">
            <AIRiskSpikeMonitor spikes={bankingRiskSpikes} />
            {eisenhowerThreads.length > 0 && (
              <Tabs
                value={activeEisenhowerChannel}
                onValueChange={(value: string) => setActiveEisenhowerChannel(value as ChannelKey)}
                className="space-y-6"
              >
                <TabsList className="flex flex-wrap gap-2 bg-transparent">
                  {CHANNEL_TABS.map((channel) => {
                    const count = threadsByChannel[channel].length;
                    return (
                      <TabsTrigger
                        key={channel}
                        value={channel}
                        className="rounded-md border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-wide text-gray-200 data-[state=active]:bg-[#b90abd]/20 data-[state=active]:text-white"
                      >
                        {CHANNEL_LABELS_MAP[channel]}
                        <span className="ml-2 text-[11px] text-gray-400">{count}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {CHANNEL_TABS.map((channel) => {
                  const channelThreads = threadsByChannel[channel];
                  const channelQuadrant = selectedQuadrants[channel];
                  const quadrantData = channelQuadrant
                    ? generatePriorityResolutionDataForQuadrant(channelThreads, channelQuadrant)
                    : [];

                  return (
                    <TabsContent key={channel} value={channel} className="space-y-6 mt-2">
                      <div className="space-y-4">
                        {channelQuadrant ? (
                          <div className="grid gap-4 lg:grid-cols-2">
                            <EisenhowerSummaryCard
                              channel={channel}
                              threads={channelThreads}
                              selectedQuadrant={channelQuadrant}
                              onQuadrantSelect={(quadrant) => handleQuadrantSelect(channel, quadrant)}
                            />

                            <Card className="border border-(--border) bg-(--card) shadow-lg transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-(--background)">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="flex items-center gap-2 text-white">
                                    <Target className="h-5 w-5 text-[#b90abd]" />
                                    Priority Resolution Matrix
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuadrantSelect(channel, channelQuadrant)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    Close
                                  </Button>
                                </div>
                                <CardDescription className="text-gray-400">
                                  {CHANNEL_LABELS_MAP[channel]} • {QUADRANT_LABELS[channelQuadrant] ?? channelQuadrant}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Tabs
                                  value={activeQuadrantTab[channel]}
                                  onValueChange={(value) =>
                                    setActiveQuadrantTab((prev) => ({ ...prev, [channel]: value as "summary" | "details" }))
                                  }
                                  className="w-full"
                                >
                                  <div className="relative mb-4">
                                    <TabsList className="grid w-full grid-cols-2 relative bg-transparent border-b border-white/10">
                                      <TabsTrigger
                                        value="summary"
                                        className="text-xs relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-gray-400 rounded-none border-0"
                                      >
                                        ✨ AI Summary Wall
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="details"
                                        className="text-xs relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-gray-400 rounded-none border-0"
                                      >
                                        Details
                                      </TabsTrigger>
                                      <div
                                        className="absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ease-in-out"
                                        style={{
                                          width: "50%",
                                          transform:
                                            activeQuadrantTab[channel] === "summary" ? "translateX(0%)" : "translateX(100%)",
                                        }}
                                      />
                                    </TabsList>
                                  </div>
                                  <TabsContent value="summary" className="space-y-0">
                                    {(() => {
                                      const summary = generateQuadrantSummary(channelThreads, channelQuadrant, channel);
                                      return (
                                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                          {summary.insights.map((insight, idx) => {
                                            const toneClasses: Record<string, string> = {
                                              default: "border-white/10 bg-black/40",
                                              info: "border-indigo-400/30 bg-indigo-500/10",
                                              success: "border-emerald-400/30 bg-emerald-500/10",
                                              warning: "border-amber-400/30 bg-amber-500/10",
                                              danger: "border-rose-400/30 bg-rose-500/10",
                                            };
                                            return (
                                              <div
                                                key={`${insight.title}-${idx}`}
                                                className={`rounded-xl border p-4 ${toneClasses[insight.tone]} space-y-1`}
                                              >
                                                <div className="text-sm font-semibold text-white">{insight.title}</div>
                                                <div className="text-xs text-gray-300">{insight.description}</div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      );
                                    })()}
                                  </TabsContent>
                                  <TabsContent value="details" className="mt-0">
                                    {quadrantData.length > 0 ? (
                                      <PriorityResolutionChart
                                        data={quadrantData}
                                        threads={channelThreads}
                                        selectedQuadrant={channelQuadrant}
                                      />
                                    ) : (
                                      <div className="py-8 text-center text-sm text-gray-400">
                                        No priority data available.
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <EisenhowerSummaryCard
                            channel={channel}
                            threads={channelThreads}
                            selectedQuadrant={channelQuadrant}
                            onQuadrantSelect={(quadrant) => handleQuadrantSelect(channel, quadrant)}
                          />
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
            <DailyDigestCard
              kpiData={null}
              threads={eisenhowerThreads}
              additionalTasks={[
                {
                  id: "mortgage-rate-lock-surge",
                  title: "Mortgage rate-lock inquiries surge (+34%)",
                  subtitle: "Review pending lock requests before expiry — many customers near deadline",
                  priority: "P1",
                  channel: "voice",
                  quadrant: "do",
                  topic: "Lending & Housing",
                  actionTag: "Reply immediately",
                },
                {
                  id: "refinancing-eligibility-wave",
                  title: "Refinancing eligibility check wave",
                  subtitle: "Batch eligibility reviews and prep response templates for common scenarios",
                  priority: "P2",
                  channel: "email",
                  quadrant: "schedule",
                  topic: "Lending & Housing",
                  actionTag: "Block time this week",
                },
              ]}
            />
          </section>

          <AIDayGeneratorChat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </>
      )}

      {activePrimarySection === "channel-analysis" && (
        <section id="channel-analysis-view" className="space-y-6 scroll-mt-20">

          {systemHealth.length > 0 && (
            <SystemHealthRibbon data={systemHealth} explanations={metricExplanations} onChannelSelect={setSelectedIntentId} />
          )}
          {trendData.length > 0 && <CrossChannelTrendChart data={trendData} />}
          <UnifiedIntelligenceWall actionGrid={actionGrid} />
          <PrematureClosureRiskCard />
          <CrossChannelToneIntelligenceCard />
          <EmotionShockboard />
        </section>
      )}

      {activePrimarySection === "intent-analysis" && (
        <section id="intent-analysis" className="space-y-6 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-purple-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Intents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">127</div>
                <div className="text-xs text-gray-400">Active across 5 channels</div>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-red-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">High-Severity Intent Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">23</div>
                <div className="text-xs text-gray-400"><span className="text-red-400">18%</span> of total intents</div>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-orange-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>✨</span><span>Avg SLA Risk Across Intents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">68%</div>
                <div className="text-xs text-gray-400">Above threshold of 60%</div>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-purple-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Top Intent by Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1 line-clamp-1">Payment Failures</div>
                <div className="text-xs text-gray-400"><span className="text-purple-400">520</span> interactions</div>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-emerald-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>✨</span><span>Fastest-Growing Intent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1 line-clamp-1">Mortgage Rate Lock</div>
                <div className="text-xs text-gray-400"><span className="text-emerald-400">+42%</span> vs last week</div>
              </CardContent>
            </Card>
          </div>
          <AIPressureInsightWall />
          <IntentIntelligenceCommandCenter />
        </section>
      )}

      {activePrimarySection === "failed-customer-interaction" && (
        <CustomerAnalysisSection />
      )}

      {activePrimarySection === "workforce-performance" && (
        <WorkforcePerformanceSection />
      )}
    </div>
  );
}

function getSentimentLabel(value: number) {
  if (value < 1.5) return "Happy";
  if (value < 2.5) return "Bit Irritated";
  if (value < 3.5) return "Moderately Concerned";
  if (value < 4.5) return "Anger";
  return "Frustrated";
}