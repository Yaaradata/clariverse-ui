"use client";

import React, { useEffect, useState } from "react";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { useManagedInterval } from "../../lib/useManagedInterval";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { InsightCard } from "./InsightCard";
import { cssVar, radius } from "../../theme/tokens";

export type RadarTimeMode = "week" | "intraday";

/** T2-1 emerging-issue rail — horizontal ranked cards, per-channel corroboration (RP-007). */
export function RadarRail({
  signals,
  onOpen,
}: {
  signals: RadarSignal[];
  onOpen: (signal: RadarSignal) => void;
}): React.ReactElement {
  const { activeScreen } = useNavigation();
  const { themeKey } = useTheme();
  const [timeMode, setTimeMode] = useState<RadarTimeMode>("week");
  const [pulse, setPulse] = useState(0);

  // Reset intraday pulse when leaving command screen or toggling theme/mode.
  useEffect(() => {
    setPulse(0);
  }, [activeScreen, timeMode, themeKey]);

  useManagedInterval(
    () => {
      if (activeScreen === "command-centre" && timeMode === "intraday") {
        setPulse((p) => p + 1);
      }
    },
    activeScreen === "command-centre" && timeMode === "intraday" ? 4000 : null,
    [activeScreen, timeMode, themeKey],
  );

  const ranked = [...signals].sort((a, b) => {
    if (a.suppressed && !b.suppressed) return 1;
    if (!a.suppressed && b.suppressed) return -1;
    if (a.severity === "critical") return -1;
    if (b.severity === "critical") return 1;
    return 0;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Emerging-issue radar</div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["week", "intraday"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTimeMode(mode)}
              style={{
                padding: "4px 10px",
                borderRadius: radius.pill,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${timeMode === mode ? cssVar("accent") : cssVar("border")}`,
                background: timeMode === mode ? cssVar("accent-soft") : "transparent",
                color: timeMode === mode ? cssVar("text-primary") : cssVar("text-muted"),
              }}
            >
              {mode === "week" ? "This week vs last" : "Intraday"}
            </button>
          ))}
        </div>
      </div>

      {timeMode === "intraday" && pulse > 0 && (
        <div style={{ fontSize: 11, color: cssVar("text-muted"), marginBottom: 8 }}>
          Live distillation refresh · cohort-level only
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x mandatory",
        }}
      >
        {ranked.map((s) => (
          <div key={s.id} style={{ scrollSnapAlign: "start" }}>
            <InsightCard signal={s} onOpen={() => onOpen(s)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Alias used in some specs. */
export const RiskSpikeMonitor = RadarRail;
