"use client";

import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { cssVar } from "../../theme/tokens";

export type RetailTrendPoint = { w: string; v: number };

type TrendTooltipProps = TooltipContentProps<number, string> & {
  data: RetailTrendPoint[];
  onIndexChange?: (index: number | null) => void;
};

function TrendTooltip({ active, payload, label, data, onIndexChange }: TrendTooltipProps): React.ReactElement | null {
  const index = useMemo(() => {
    if (!active || label == null) return -1;
    return data.findIndex((point) => point.w === label);
  }, [active, label, data]);

  useLayoutEffect(() => {
    if (!onIndexChange) return;
    onIndexChange(active && index >= 0 ? index : null);
  }, [active, index, onIndexChange]);

  if (!active || !payload?.length || index < 0) return null;

  const value = Number(payload[0]?.value ?? 0);

  return (
    <div
      style={{
        background: "rgba(10,14,22,0.96)",
        border: `1px solid ${cssVar("border")}`,
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 11,
        color: cssVar("text-primary"),
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div>
        Score : <span className="lisn-num">{value}</span> pts
      </div>
    </div>
  );
}

/** Area sparkline — pixel-match to Head of Retail (`RoleDashboardView` retail tiles). */
export function RetailTrendAreaChart({
  data,
  stroke,
  yPadBelow = 6,
  yPadAbove = 4,
  minHeight = 96,
  gradientKey = "retail-trend",
  onActiveIndexChange,
}: {
  data: RetailTrendPoint[];
  stroke: string;
  yPadBelow?: number;
  yPadAbove?: number;
  minHeight?: number;
  gradientKey?: string;
  onActiveIndexChange?: (index: number | null) => void;
}): React.ReactElement {
  const gid = useUniqueGradientId(gradientKey);
  const interactive = onActiveIndexChange != null;
  const lastIndexRef = useRef<number | null>(null);

  const handleIndexChange = useCallback(
    (index: number | null) => {
      if (!onActiveIndexChange) return;
      if (lastIndexRef.current === index) return;
      lastIndexRef.current = index;
      onActiveIndexChange(index);
    },
    [onActiveIndexChange],
  );

  const handleMove = useCallback(
    (state: { activeTooltipIndex?: number | string | null; activeIndex?: number | string | null }) => {
      if (!interactive) return;
      const raw = state.activeTooltipIndex ?? state.activeIndex;
      if (raw == null || raw === "") {
        handleIndexChange(null);
        return;
      }
      const idx = Number(raw);
      if (!Number.isNaN(idx) && idx >= 0) handleIndexChange(idx);
    },
    [interactive, handleIndexChange],
  );

  const tooltipContent = useCallback(
    (props: TooltipContentProps<number, string>) => (
      <TrendTooltip {...props} data={data} onIndexChange={interactive ? handleIndexChange : undefined} />
    ),
    [data, handleIndexChange, interactive],
  );

  return (
    <div
      style={{ width: "100%", flex: 1, minHeight, height: minHeight, cursor: interactive ? "crosshair" : undefined }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          onMouseMove={interactive ? handleMove : undefined}
          onMouseLeave={interactive ? () => handleIndexChange(null) : undefined}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.42} />
              <stop offset="55%" stopColor={stroke} stopOpacity={0.16} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="w" hide />
          <YAxis
            hide
            domain={[
              (min: number) => Math.max(0, min - yPadBelow),
              (max: number) => max + yPadAbove,
            ]}
          />
          <Tooltip
            content={tooltipContent}
            cursor={{ stroke, strokeWidth: 1, strokeDasharray: "4 3", opacity: 0.7 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={3}
            fill={`url(#${gid})`}
            fillOpacity={1}
            dot={false}
            activeDot={{
              r: 3.5,
              fill: stroke,
              stroke,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
