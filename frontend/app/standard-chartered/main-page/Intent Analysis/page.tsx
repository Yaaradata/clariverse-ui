"use client";

import { IntentOverlapPanel, PressureConstellationWall } from "@/components/unified/intelligence/UnifiedIntelligenceWall";
import { IntentIntelligenceCommandCenter } from "@/components/unified/intelligence/IntentIntelligenceCommandCenter";
import { getBankingIntentIntelligenceData } from "@/lib/unified/intentIntelligenceData";

export default function IntentAnalysisPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b90abd]">Intent Analysis</p>
        <h1 className="text-3xl font-bold text-white">Cross-Channel Intent Intelligence</h1>
        <p className="text-sm text-gray-400">
          Deep dive into overlapping intents and AI-clustered pressure patterns to understand where customer journeys compress or stall.
        </p>
      </div>

      {/* Intent Intelligence Command Center - Banking data from lib/unified */}
      <IntentIntelligenceCommandCenter {...getBankingIntentIntelligenceData()} />

      {/* Existing components below */}
      <IntentOverlapPanel />
      <PressureConstellationWall />
    </div>
  );
}

