"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { useManagedInterval } from "../../lib/useManagedInterval";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { InsightCard } from "./InsightCard";
import { cssVar, radius } from "../../theme/tokens";

export type RadarTimeMode = "week" | "intraday";

const TIME_MODES: ReadonlyArray<{
  id: RadarTimeMode;
  label: string;
  hint?: string;
}> = [
  {
    id: "week",
    label: "This week vs last",
  },
  {
    id: "intraday",
    label: "Intraday",
    hint: "Last 6h window · live distillation · cohort-level only",
  },
];

function onsetSortKey(onset: string): number {
  if (onset === "This shift") return 0;
  const hours = onset.match(/T−(\d+)h/);
  if (hours) return Number(hours[1]);
  if (onset.includes("week")) return 200;
  return 100;
}

function rankSignals(signals: RadarSignal[], timeMode: RadarTimeMode): RadarSignal[] {
  return [...signals].sort((a, b) => {
    if (a.suppressed && !b.suppressed) return 1;
    if (!a.suppressed && b.suppressed) return -1;
    if (a.severity === "critical" && b.severity !== "critical") return -1;
    if (b.severity === "critical" && a.severity !== "critical") return 1;
    if (timeMode === "intraday") {
      return onsetSortKey(a.onset) - onsetSortKey(b.onset);
    }
    return 0;
  });
}

function RadarTimeToggle({
  activeMode,
  onChange,
}: {
  activeMode: RadarTimeMode;
  onChange: (mode: RadarTimeMode) => void;
}): React.ReactElement {
  const accent = cssVar("accent");

  return (
    <div
      role="group"
      aria-label="Radar time window"
      style={{
        display: "inline-flex",
        padding: 3,
        borderRadius: 10,
        background: `${accent}14`,
        border: `1px solid ${accent}33`,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {TIME_MODES.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            aria-pressed={isActive}
            title={mode.hint}
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.2,
              padding: "6px 12px",
              borderRadius: 7,
              lineHeight: 1,
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              transition: "background 0.15s ease, color 0.15s ease",
              ...(isActive
                ? {
                    background: accent,
                    color: "#ffffff",
                    boxShadow: `0 1px 4px ${accent}55`,
                  }
                : {
                    background: "transparent",
                    color: accent,
                  }),
            }}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

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

  const activeModeMeta = TIME_MODES.find((m) => m.id === timeMode) ?? TIME_MODES[0];
  const ranked = useMemo(() => rankSignals(signals, timeMode), [signals, timeMode]);
  const activeCount = ranked.filter((s) => !s.suppressed).length;

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
        padding: "14px 16px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Emerging-issue radar</div>
          {activeModeMeta.hint ? (
            <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 3, lineHeight: 1.4 }}>
              {activeModeMeta.hint}
            </div>
          ) : null}
        </div>
        <RadarTimeToggle activeMode={timeMode} onChange={setTimeMode} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
          fontSize: 11,
          color: cssVar("text-muted"),
        }}
      >
        <span>
          {activeCount} active signal{activeCount === 1 ? "" : "s"}
          {ranked.length > activeCount ? ` · ${ranked.length - activeCount} suppressed` : ""}
        </span>
        {timeMode === "intraday" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: cssVar("accent") }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: cssVar("positive"),
                boxShadow: `0 0 0 2px ${cssVar("positive")}33`,
              }}
            />
            Live{pulse > 0 ? ` · refresh ${pulse}` : ""}
          </span>
        ) : (
          <span>Corroboration-ranked</span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 4,
          scrollSnapType: "x mandatory",
        }}
      >
        {ranked.map((s) => (
          <div key={`${s.id}-${timeMode}`} style={{ scrollSnapAlign: "start" }}>
            <InsightCard signal={s} timeMode={timeMode} onOpen={() => onOpen(s)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Alias used in some specs. */
export const RiskSpikeMonitor = RadarRail;
