"use client";

import { useEffect, useState } from "react";
import { SystemHealthRibbon, type SystemHealthMetric } from "@/components/unified/kpi/SystemHealthRibbon";
import {
  ToneDriftWall,
  UnifiedIntelligenceWall,
} from "@/components/unified/intelligence/UnifiedIntelligenceWall";
import { EmotionShockboard, ResolutionIntegrityMonitor } from "@/components/unified/intents/IntentIntelligenceSection";
import { CrossChannelTrendChart } from "@/components/unified/trends/CrossChannelTrendChart";
import { fetchTrendData, type TrendPointResponse } from "@/lib/flipkart/adapters";
import { fetchSystemHealth, type SystemHealthResponse } from "@/lib/flipkart/adapters";
import { fetchCrossChannelActionGrid, type CrossChannelActionGridResponse } from "@/lib/flipkart/adapters";
import { AIRiskSpikeMonitor } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";

export default function ChannelAnalysisPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetric[]>([]);
  const [metricExplanations, setMetricExplanations] = useState<Record<string, string>>({});
  const [trendData, setTrendData] = useState<TrendPointResponse[]>([]);
  const [actionGrid, setActionGrid] = useState<CrossChannelActionGridResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [health, trend, actionGridData] = await Promise.all([
        fetchSystemHealth(),
        fetchTrendData(),
        fetchCrossChannelActionGrid(),
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
      setActionGrid(actionGridData);
      setIsLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading channel analysis data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen">
      {systemHealth.length > 0 && (
        <SystemHealthRibbon data={systemHealth} explanations={metricExplanations} />
      )}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b90abd]">Channel Analysis</p>
        <h1 className="text-3xl font-bold text-white">Cross-Channel Resolution Intelligence</h1>
        <p className="text-sm text-gray-400">
          Monitor tone drift, closure risk, emotion shocks, and resolution integrity across Email, Chat, Ticket, Social, and Voice.
        </p>
      </div>

      <AIRiskSpikeMonitor />

      {trendData.length > 0 && (
        <CrossChannelTrendChart data={trendData} />
      )}

      <CrossChannelToneIntelligenceCard />

      <UnifiedIntelligenceWall actionGrid={actionGrid} />

      <ToneDriftWall />
      <EmotionShockboard />
      <ResolutionIntegrityMonitor />
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