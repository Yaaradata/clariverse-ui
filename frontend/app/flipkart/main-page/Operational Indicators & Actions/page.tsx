"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { UnifiedFiltersBar } from "@/components/unified/filters/UnifiedFiltersBar";
import { SystemHealthRibbon, type SystemHealthMetric } from "@/components/unified/kpi/SystemHealthRibbon";
import { CrossChannelTrendChart } from "@/components/unified/trends/CrossChannelTrendChart";
import { EmotionShockboard } from "@/components/unified/intents/IntentIntelligenceSection";
import { useFlipkartChatbot } from "@/context/FlipkartChatbotContext";
import {
  UnifiedIntelligenceWall,
} from "@/components/unified/intelligence/UnifiedIntelligenceWall";
import { IntentIntelligenceCommandCenter } from "@/components/unified/intelligence/IntentIntelligenceCommandCenter";
import { getEcommerceIntentIntelligenceData } from "@/lib/flipkart/intentIntelligenceData";
import { Target } from "lucide-react";
import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";
import { PrematureClosureRiskCard } from "@/components/unified/intelligence/PrematureClosureRiskCard";
import { FlipkartRiskSpikeMonitor } from "@/components/flipkart";
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
} from "@/lib/flipkart/adapters";
import {
  getEisenhowerThreads,
  generatePriorityResolutionDataForQuadrant,
  type EisenhowerThread,
} from "@/lib/flipkart/api";
import { Button } from "@/components/ui/button";

type DateRange = {
  start: string;
  end: string;
};

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
    id: "channel-analysis",
    label: "Channel Analysis",
    description: "Cross-channel workload & prioritization",
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
    <Card className="border border-(--border) bg-(--card) shadow-lg transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-(--background)">
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
        <CardDescription className="text-gray-400 flex items-center gap-2">
          <span>Focus on critical items first</span>
          <span className="text-[#b90abd]">•</span>
          <span>Thread distribution across priority quadrants</span>
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
                    ? "bg-(--background) ring-2 ring-[#b90abd] shadow-lg"
                    : "bg-(--card) hover:bg-(--background)"
                } ${
                  isLeftColumn ? "lg:border-r lg:border-(--border)" : ""
                } ${isTopRow ? "border-b border-(--border)" : ""}`}
                onClick={() => onQuadrantSelect(quadrant)}
              >
                {hasHighPriorityGlow && (
                  <div className="absolute inset-0 bg-linear-to-br from-[#b90abd]/10 via-[#b90abd]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
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
                    className="relative z-10 mt-4 w-full bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white text-xs"
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

export default function HomePage() {
  // Initialize with current month date range
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
  const { openChatbot } = useFlipkartChatbot();
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
    return () => {
      mounted = false;
    };
  }, []);

  const handleQuadrantSelect = useCallback((channel: ChannelKey, quadrant: string) => {
    setSelectedQuadrants((prev) => {
      const newValue = prev[channel] === quadrant ? null : quadrant;
      // When selecting a quadrant, default to "summary" tab
      if (newValue !== null) {
        setActiveQuadrantTab((tabPrev) => ({ ...tabPrev, [channel]: "summary" }));
      }
      return {
        ...prev,
        [channel]: newValue,
      };
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
      if (base[channel]) {
        base[channel].push(thread);
      }
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
          setDateRange({
            start: today.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0],
          });
          break;
        case "Current Month":
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          setDateRange({
            start: firstDay.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0],
          });
          break;
        case "One Week":
          startDate.setDate(today.getDate() - 7);
          setDateRange({
            start: startDate.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0],
          });
          break;
        case "One Month":
          startDate.setMonth(today.getMonth() - 1);
          setDateRange({
            start: startDate.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0],
          });
          break;
        case "6 Months":
          startDate.setMonth(today.getMonth() - 6);
          setDateRange({
            start: startDate.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0],
          });
          break;
        default:
          break;
      }
    }
  };

  const handleApplyFilters = () => {
    console.log("Applying filters", {
      preset: dateFilterPreset,
      dateRange,
    });
    setAppliedPreset(dateFilterPreset);
    setAppliedRange({ ...dateRange });
    // TODO: trigger refetch with filters
  };


  const handlePrimarySectionSelect = useCallback((sectionId: string) => {
    setActivePrimarySection(sectionId);
  }, []);

  // Generate AI summary insights for a specific quadrant (overall summary, not individual actions)
  const generateQuadrantSummary = useCallback((threads: EisenhowerThread[], quadrant: string, channel: ChannelKey) => {
    const quadrantThreads = threads.filter((thread) => thread.quadrant === quadrant);
    if (quadrantThreads.length === 0) {
      return {
        insights: [
          {
            title: "No Active Items",
            description: `No items currently in ${QUADRANT_LABELS[quadrant]} quadrant for ${CHANNEL_LABELS_MAP[channel]}.`,
            tone: "default" as const,
          },
        ],
      };
    }

    const total = quadrantThreads.length;
    const openCount = quadrantThreads.filter((t) => t.resolution_status === "open").length;
    const inProgressCount = quadrantThreads.filter((t) => t.resolution_status === "in_progress").length;
    const closedCount = quadrantThreads.filter((t) => t.resolution_status === "closed").length;
    const escalatedCount = quadrantThreads.filter((t) => t.escalation_count > 0).length;
    const avgSentiment = quadrantThreads.reduce((sum, t) => sum + t.overall_sentiment, 0) / total;
    const avgBusinessImpact = quadrantThreads.reduce((sum, t) => sum + t.business_impact_score, 0) / total;
    const avgRisk = quadrantThreads.reduce((sum, t) => sum + t.risk_score, 0) / total;

    // Get top topics/subjects
    const topicCounts = quadrantThreads.reduce((acc, thread) => {
      const topic = thread.subject_norm || "Unknown";
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic, count]) => ({ topic, count, percentage: Math.round((count / total) * 100) }));

    // Group by priority
    const priorityGroups = quadrantThreads.reduce((acc, thread) => {
      const priority = thread.priority;
      if (!acc[priority]) acc[priority] = [];
      acc[priority].push(thread);
      return acc;
    }, {} as Record<string, EisenhowerThread[]>);

    const p1Count = priorityGroups["P1"]?.length || 0;
    const p2Count = priorityGroups["P2"]?.length || 0;
    const openRate = (openCount / total) * 100;
    const inProgressRate = (inProgressCount / total) * 100;

    const quadrantLabel = QUADRANT_LABELS[quadrant];
    const insights: Array<{ title: string; description: string; tone: "default" | "info" | "success" | "warning" | "danger" }> = [];

    // Generate overall AI insights based on quadrant type and data patterns
    if (quadrant === "do") {
      // Critical/Urgent quadrant insights
      if (p1Count > 0) {
        insights.push({
          title: "Critical Priority Items",
          description: `${p1Count} P1 items require immediate attention. Average sentiment ${avgSentiment.toFixed(1)} indicates ${avgSentiment > 4.0 ? "high customer frustration" : "moderate concern"}.`,
          tone: p1Count > total * 0.3 ? "danger" : "warning",
        });
      }

      if (escalatedCount > 0) {
        insights.push({
          title: "Escalation Alert",
          description: `${escalatedCount} cases have been escalated (${Math.round((escalatedCount / total) * 100)}% of quadrant). Senior review and specialized handling recommended.`,
          tone: "danger",
        });
      }

      if (openRate > 50) {
        insights.push({
          title: "Action Bottleneck",
          description: `${Math.round(openRate)}% of items remain open. Focus on P1 items first, then batch process similar topics for efficiency.`,
          tone: "warning",
        });
      }

      if (topTopics.length > 0 && topTopics[0].percentage > 30) {
        insights.push({
          title: "Dominant Issue Pattern",
          description: `"${topTopics[0].topic}" accounts for ${topTopics[0].percentage}% of items (${topTopics[0].count} cases). Consider creating a dedicated workflow or template.`,
          tone: "info",
        });
      }

      if (avgSentiment > 4.0) {
        insights.push({
          title: "Sentiment Risk",
          description: `Average sentiment ${avgSentiment.toFixed(1)} indicates elevated customer frustration. Prioritize resolution and consider proactive communication.`,
          tone: "danger",
        });
      } else if (avgSentiment < 2.5) {
        insights.push({
          title: "Positive Trend",
          description: `Average sentiment ${avgSentiment.toFixed(1)} shows customers are generally satisfied. Maintain current resolution quality.`,
          tone: "success",
        });
      }

      if (avgBusinessImpact > 70) {
        insights.push({
          title: "High Business Impact",
          description: `Average business impact score ${Math.round(avgBusinessImpact)} indicates significant revenue or relationship risk. Expedite resolution.`,
          tone: "warning",
        });
      }
    } else if (quadrant === "schedule") {
      insights.push({
        title: "Planned Review Queue",
        description: `${total} items scheduled for review. ${topTopics.length > 0 ? `Top topic: "${topTopics[0].topic}" (${topTopics[0].percentage}%). ` : ""}Batch similar items together for streamlined processing.`,
        tone: "info",
      });

      if (topTopics.length > 0) {
        insights.push({
          title: "Topic Clustering Opportunity",
          description: `Group "${topTopics[0].topic}" items (${topTopics[0].count} cases) for batch review. This could reduce processing time by 30-40%.`,
          tone: "success",
        });
      }
    } else if (quadrant === "delegate") {
      insights.push({
        title: "Delegation Queue",
        description: `${total} items ready for team distribution. ${topTopics.length > 0 ? `Route "${topTopics[0].topic}" (${topTopics[0].count} cases) to specialized team members. ` : ""}Distribute based on expertise and current workload.`,
        tone: "info",
      });

      if (topTopics.length > 0) {
        insights.push({
          title: "Specialization Opportunity",
          description: `"${topTopics[0].topic}" represents ${topTopics[0].percentage}% of delegation queue. Consider assigning dedicated specialist for faster resolution.`,
          tone: "info",
        });
      }
    } else if (quadrant === "delete") {
      insights.push({
        title: "Postponement Queue",
        description: `${total} items marked for later review. Monitor periodically for priority changes. ${closedCount > 0 ? `${closedCount} items already closed. ` : ""}Consider archiving resolved items.`,
        tone: "default",
      });
    }

    // Add general insights applicable to all quadrants
    if (inProgressRate > 40) {
      insights.push({
        title: "Active Processing",
        description: `${Math.round(inProgressRate)}% of items are in progress. Good momentum - maintain current workflow pace.`,
        tone: "success",
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: "Quadrant Overview",
        description: `${total} items in ${quadrantLabel} for ${CHANNEL_LABELS_MAP[channel]}. ${openCount} open, ${inProgressCount} in progress, ${closedCount} closed. Average sentiment ${avgSentiment.toFixed(1)}.`,
        tone: "default",
      });
    }

    return {
      insights: insights.slice(0, 6), // Limit to 6 insights for better readability
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-6 bg-(--background) min-h-screen">
      <UnifiedFiltersBar
        dateFilterPreset={dateFilterPreset}
        dateRange={dateRange}
        onPresetChange={handlePresetChange}
        onDateRangeChange={setDateRange}
        onApply={handleApplyFilters}
        onOpenAI={openChatbot}
      />

      <div className="overflow-x-auto">
        <div className="flex w-full gap-3 rounded-xl border border-(--border) bg-(--card)/80 p-2 backdrop-blur">
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
                    ? "border-[#b90abd]/70 bg-linear-to-r from-[#b90abd]/20 to-[#5332ff]/10 text-white shadow-lg"
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
            <FlipkartRiskSpikeMonitor />
          </section>

          <section id="channel-analysis" className="space-y-6 scroll-mt-20">
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
                    <TabsContent key={channel} value={channel} className="space-y-6">
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
                                      {/* Red underline indicator */}
                                      <div
                                        className="absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ease-in-out"
                                        style={{
                                          width: '50%',
                                          transform: activeQuadrantTab[channel] === 'summary' 
                                            ? 'translateX(0%)' 
                                            : 'translateX(100%)',
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
                                      <div className="py-8 text-center text-sm text-gray-400">No priority data available.</div>
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

          </section>

        </>
      )}

      {activePrimarySection === "channel-analysis" && (
        <section id="channel-analysis-view" className="space-y-6 scroll-mt-20">
          {systemHealth.length > 0 && (
            <SystemHealthRibbon data={systemHealth} explanations={metricExplanations} onChannelSelect={setSelectedIntentId} />
          )}
          {trendData.length > 0 && <CrossChannelTrendChart data={trendData} />}
          <UnifiedIntelligenceWall actionGrid={actionGrid} />
          <CrossChannelToneIntelligenceCard />
          <PrematureClosureRiskCard />
          <EmotionShockboard />
        </section>
      )}

      {activePrimarySection === "intent-analysis" && (
        <section id="intent-analysis" className="space-y-6 scroll-mt-20">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Intents */}
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-purple-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Intents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">127</div>
                <div className="text-xs text-gray-400">Active across 5 channels</div>
              </CardContent>
            </Card>

            {/* High-Severity Intent Count */}
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-red-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">High-Severity Intent Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">23</div>
                <div className="text-xs text-gray-400">
                  <span className="text-red-400">18%</span> of total intents
                </div>
              </CardContent>
            </Card>

            {/* Avg SLA Risk Across Intents */}
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-orange-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>✨</span>
                  <span>Avg SLA Risk Across Intents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">68%</div>
                <div className="text-xs text-gray-400">Above threshold of 60%</div>
              </CardContent>
            </Card>

            {/* Top Intent by Volume */}
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-purple-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Top Intent by Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1 line-clamp-1">Payment Failures</div>
                <div className="text-xs text-gray-400">
                  <span className="text-purple-400">520</span> interactions
                </div>
              </CardContent>
            </Card>

            {/* Fastest-Growing Intent */}
            <Card className="border border-white/10 bg-black/30 shadow-lg hover:border-emerald-500/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>✨</span>
                  <span>Fastest-Growing Intent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1 line-clamp-1">Mortgage Rate Lock</div>
                <div className="text-xs text-gray-400">
                  <span className="text-emerald-400">+42%</span> vs last week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intent Intelligence Command Center - E-commerce data from lib/flipkart */}
          <IntentIntelligenceCommandCenter {...getEcommerceIntentIntelligenceData()} />
        </section>
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
