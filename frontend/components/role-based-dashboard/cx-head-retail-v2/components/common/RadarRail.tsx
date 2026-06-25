"use client";

import React, { useEffect, useState } from "react";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { useManagedInterval } from "../../lib/useManagedInterval";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { InsightCard } from "./InsightCard";
import { cssVar, radius } from "../../theme/tokens";

export type RadarTimeMode = "week" | "intraday";

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

  const ranked = [...signals]
    .filter((s) => !s.suppressed)
    .sort((a, b) => {
      if (a.severity === "critical") return -1;
      if (b.severity === "critical") return 1;
      if (a.severity === "high") return -1;
      if (b.severity === "high") return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>Emerging signals</div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["week", "intraday"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTimeMode(mode)}
              style={{
                padding: "3px 8px",
                borderRadius: radius.pill,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${timeMode === mode ? cssVar("accent") : cssVar("border")}`,
                background: timeMode === mode ? cssVar("accent-soft") : "transparent",
                color: timeMode === mode ? cssVar("text-primary") : cssVar("text-muted"),
              }}
            >
              {mode === "week" ? "WoW" : "Live"}
            </button>
          ))}
        </div>
      </div>

      {timeMode === "intraday" && pulse > 0 ? (
        <div style={{ fontSize: 10, color: cssVar("text-muted"), marginBottom: 6 }}>Cohort refresh</div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {ranked.map((s) => (
          <InsightCard key={s.id} signal={s} onOpen={() => onOpen(s)} />
        ))}
      </div>
    </div>
  );
}

export const RiskSpikeMonitor = RadarRail;
