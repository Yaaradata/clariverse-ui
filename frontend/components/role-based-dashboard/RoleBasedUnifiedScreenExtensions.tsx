"use client";

import { useMemo } from "react";
import { AIRiskSpikeMonitor, headRetailRiskSpikes } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { CrossChannelTrendChart } from "@/components/unified/trends/CrossChannelTrendChart";
import { SystemHealthRibbon } from "@/components/unified/kpi/SystemHealthRibbon";
import { EisenhowerMatrix } from "@/components/email/EisenhowerMatrix";
import { AIPressureInsightWall } from "@/components/unified/intelligence/AIPressureInsightWall";
import { IntentIntelligenceCommandCenter } from "@/components/unified/intelligence/IntentIntelligenceCommandCenter";
import { EmotionShockboard } from "@/components/unified/intents/IntentIntelligenceSection";
import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";
import { ComplianceInsightsCards } from "@/components/compliance/ComplianceInsightsCards";
import { RetailFCIKPICards } from "./RetailFCIKPICards";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { AISummaryWall } from "@/components/FCI/AISummaryWall";
import { BottleneckHeatmap } from "@/components/email/BottleneckHeatmap";
import { PrematureClosureRiskCard } from "@/components/unified/intelligence/PrematureClosureRiskCard";
import { IntentNetworkGraph } from "@/components/unified/intelligence/IntentNetworkGraph";
import { CustomerEmotion } from "@/components/FCI/CustomerEmotion";
import { ComplianceScoreMeter } from "@/components/compliance/ComplianceScoreMeter";
import { CallCenterRiskHeatMap } from "@/components/compliance/CallCenterRiskHeatMap";
import { ViolationCategoryChart } from "@/components/compliance/ViolationCategoryChart";
import { fciClusters, customerEmotionData } from "@/lib/fci-lib/fciData";
import { complianceScoreData, violationCategoryData } from "@/lib/compliance/complianceData";
import type { EisenhowerThread } from "@/lib/api";
import type { Role } from "@/lib/role-based-dashboard/registry";
import type { LensId } from "@/lib/role-based-dashboard/registry";
import {
  ROLE_BASED_MOCK_CROSS_CHANNEL_ACTION_GRID,
  ROLE_BASED_MOCK_SYSTEM_HEALTH,
  ROLE_BASED_MOCK_TREND,
  ROLE_BASED_SYSTEM_HEALTH_EXPLANATIONS,
} from "@/lib/role-based-dashboard/roleBasedUnifiedMockData";
import {
  showExecSystemHealthRibbon,
  showExecTrendCharts,
  showScreen2Eisenhower,
  showScreen2PressureWall,
  showScreen3ComplianceInsights,
  showScreen3EmotionShockboard,
  showScreen3FciKpis,
  showScreen3IntentCommandCenter,
  showScreen3ToneIntelligence,
  showCroRiskCockpit,
  showCroLobRiskProfiling,
  showCroFinancialCrime,
  showCroConsumerDuty,
  showCroCrossJurisdiction,
  showCroInvestigations,
  showRetailScreen1Cards,
  showRetailValuedCustomers,
  showRetailChannelSentiment,
  showRetailUnifiedIntelligenceWall,
  showRetailIntentHeatmap,
  showContactAgentHealth,
  showContactPromiseAdherence,
  showContactClusterSummary,
} from "@/lib/role-based-dashboard/personaUnifiedConfig";
import {
  CROScreen1Addon,
  CROScreen2Addon,
  CROScreen3FinancialCrime,
  CROScreen4ConsumerDuty,
  CROScreen4Jurisdiction,
  CROScreen5Investigations,
} from "@/components/role-based-dashboard/CROScreenExtensions";
import {
  RetailScreen1Cards,
  RetailScreen2Addon,
  RetailScreen3Addon,
  RetailScreen4IntentHeatmap,
  ContactScreen2AgentHealth,
  ContactScreen3PromiseAdherence,
  ContactScreen4ClusterSummary,
} from "@/components/role-based-dashboard/RetailContactScreenExtensions";
import { UnifiedIntelligenceWall } from "@/components/role-based-dashboard/RetailUnifiedIntelligenceWall";

/** Consistent vertical rhythm between unified blocks (role-based embed). */
const sectionGap = "mt-6 flex flex-col gap-8";

export function RoleBasedUnifiedScreen1Addon({ role }: { role: Role }) {
  const rid = role.id;
  const isRetail = rid === "head_retail";
  return (
    <div className={sectionGap}>
      {isRetail ? (
        <AIRiskSpikeMonitor
          spikes={headRetailRiskSpikes}
          driverContext="EMI resets · fee policy change · HNI churn signals · viral social complaint cluster · iOS app bug"
        />
      ) : (
        <AIRiskSpikeMonitor />
      )}
      {showCroRiskCockpit(rid) ? <CROScreen1Addon /> : null}
      {showExecTrendCharts(rid) ? (
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-3">
          <CrossChannelTrendChart data={ROLE_BASED_MOCK_TREND} />
        </div>
      ) : null}
      {showExecSystemHealthRibbon(rid) ? (
        <div className="max-h-[340px] overflow-y-auto pr-1">
          <SystemHealthRibbon data={ROLE_BASED_MOCK_SYSTEM_HEALTH} explanations={ROLE_BASED_SYSTEM_HEALTH_EXPLANATIONS} />
        </div>
      ) : null}
    </div>
  );
}

export function RoleBasedUnifiedScreen2Addon({ role, threads, activeLob }: { role: Role; threads: EisenhowerThread[]; activeLob?: string }) {
  const rid = role.id;
  const matrixThreads = useMemo(() => threads.slice(0, 400), [threads]);
  return (
    <div className={sectionGap}>
      {showRetailValuedCustomers(rid) ? <RetailScreen2Addon /> : null}
      {showContactAgentHealth(rid) ? <ContactScreen2AgentHealth /> : null}
      {showCroLobRiskProfiling(rid) ? <CROScreen2Addon activeLob={activeLob ?? "retail_banking"} /> : null}
      {showScreen2PressureWall(rid) ? <AIPressureInsightWall /> : null}
      {showScreen2Eisenhower(rid) && matrixThreads.length > 0 ? (
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-4 overflow-x-auto">
          <EisenhowerMatrix data={matrixThreads} onThreadClick={() => {}} />
        </div>
      ) : null}
    </div>
  );
}

export function RoleBasedUnifiedScreen3Addon({ role }: { role: Role }) {
  const rid = role.id;
  return (
    <div className={sectionGap}>
      {showRetailChannelSentiment(rid) ? <RetailScreen3Addon /> : null}
      {showRetailUnifiedIntelligenceWall(rid) ? (
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-4 overflow-x-auto">
          <UnifiedIntelligenceWall actionGrid={ROLE_BASED_MOCK_CROSS_CHANNEL_ACTION_GRID} />
        </div>
      ) : null}
      {showContactPromiseAdherence(rid) ? <ContactScreen3PromiseAdherence /> : null}
      {showCroFinancialCrime(rid) ? <CROScreen3FinancialCrime /> : null}
      {showScreen3IntentCommandCenter(rid) ? (
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-4">
          <IntentIntelligenceCommandCenter />
        </div>
      ) : null}
      {showScreen3EmotionShockboard(rid) ? <EmotionShockboard /> : null}
      {showScreen3ToneIntelligence(rid) ? <CrossChannelToneIntelligenceCard /> : null}
      {showScreen3ComplianceInsights(rid) ? <ComplianceInsightsCards isDarkMode /> : null}
      {showScreen3FciKpis(rid) ? (
        <div className="rounded-xl border border-white/[0.14] overflow-hidden bg-black/20">
          <RetailFCIKPICards isDarkMode />
        </div>
      ) : null}
    </div>
  );
}

export function RoleBasedUnifiedScreen4Addon({
  lens,
  role,
  threads,
}: {
  lens: LensId;
  role: Role;
  threads: EisenhowerThread[];
}) {
  const sliceThreads = useMemo(() => threads.slice(0, 500), [threads]);

  if (lens === "ops") {
    return (
      <div className={sectionGap}>
        {showRetailIntentHeatmap(role.id) ? <RetailScreen4IntentHeatmap /> : null}
        {showContactClusterSummary(role.id) ? <ContactScreen4ClusterSummary /> : null}
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-5 space-y-8">
          <FailureClusters clusters={fciClusters.slice(0, 4)} isDarkMode />
          <AISummaryWall isDarkMode />
          <BottleneckHeatmap threads={sliceThreads} />
        </div>
      </div>
    );
  }

  if (lens === "risk") {
    return (
      <div className={sectionGap}>
        <div className="rounded-xl border border-white/[0.14] bg-black/25 p-5 space-y-8">
          <AIRiskSpikeMonitor />
          <PrematureClosureRiskCard />
          <IntentNetworkGraph />
          <CustomerEmotion data={customerEmotionData} isDarkMode />
        </div>
        {showCroConsumerDuty(role.id) ? <CROScreen4ConsumerDuty /> : null}
      </div>
    );
  }

  return (
    <div className={sectionGap}>
      <div className="rounded-xl border border-white/[0.14] bg-black/25 p-5 space-y-8">
        <ComplianceScoreMeter data={complianceScoreData["24h"]} isDarkMode />
        <ComplianceInsightsCards isDarkMode />
        <CallCenterRiskHeatMap isDarkMode />
        <ViolationCategoryChart data={violationCategoryData["24h"]} isDarkMode />
      </div>
      {showCroCrossJurisdiction(role.id) ? <CROScreen4Jurisdiction /> : null}
    </div>
  );
}

export function RoleBasedUnifiedScreen5Addon({ role }: { role: Role }) {
  if (!showCroInvestigations(role.id)) {
    return null;
  }
  return (
    <div className={sectionGap}>
      <CROScreen5Investigations />
    </div>
  );
}
