"use client";

import React from "react";

import type { CategorySignalView } from "../../lib/seedData";
import { getSignalsForRail, severityRank } from "../../lib/seedData";
import { useAppState } from "../../state/AppStateContext";
import { AiMarker } from "./AiMarker";
import { InsightCard } from "./InsightCard";
import { cssVar } from "../../theme/tokens";

export function RiskSpikeMonitor({
  onOpenSignal,
}: {
  onOpenSignal: (signal: CategorySignalView) => void;
}): React.ReactElement {
  const { state } = useAppState();
  const signals = getSignalsForRail(state.rail.orderedSignalIds).sort((a, b) => {
    if (a.suppressed && !b.suppressed) return 1;
    if (!a.suppressed && b.suppressed) return -1;
    if (a.advisory && !b.advisory) return 1;
    return severityRank(a.severity) - severityRank(b.severity);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <AiMarker />
        <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>
          Today&apos;s Category Signal Monitor
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x mandatory",
        }}
      >
        {signals.map((s) => (
          <div key={s.signalId} style={{ scrollSnapAlign: "start" }}>
            <InsightCard
              signal={s}
              onOpen={s.suppressed || s.advisory ? undefined : () => onOpenSignal(s)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
