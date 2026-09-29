"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";

export type TrendSeries = {
  key: string;
  /** Already rendered through useLabel(). */
  label: string;
  color: string;
  /** Filled area (the signal) vs a plain line (baseline / control). */
  area?: boolean;
  dashed?: boolean;
  axis?: "left" | "right";
};

export type TrendMarker = { x: number; label: string; color: string };

/**
 * Bank ExecutiveTile area chart (HeadOfCreditCardsDashboard.tsx:377-419):
 * one monotone curve + gradient fill. No markers, baselines, ticks or grid.
 */
export function AreaTrend({
  id,
  data: dataProp,
  series,
  height = 88,
  strokeColor,
}: {
  id: string;
  data: Array<Record<string, number | null>>;
  series: TrendSeries[];
  /** Kept for call-site compatibility; ignored (clean chart has no markers). */
  markers?: TrendMarker[];
  height?: number;
  /** Stroke/fill colour (card accent). */
  strokeColor?: string;
}) {
  const reduced = useReducedMotion();
  const [data] = useState(() => dataProp);
  const primary = series.find((s) => s.area) ??
    series[0] ?? {
      key: "v",
      label: "",
      color: K.amber,
      area: true,
    };
  const color = strokeColor ?? primary.color;
  const gradId = `kgs-grad-${id}-${primary.key}`;
  const ys = data
    .map((d) => d[primary.key])
    .filter((v): v is number => typeof v === "number");
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 1;
  const pad = Math.max(0.15 * (maxY - minY), 0.5);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="55%" stopColor={color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" hide />
          <YAxis
            hide
            domain={[() => Math.max(0, minY - pad), () => maxY + pad]}
          />
          <Tooltip
            cursor={false}
            labelFormatter={() => ""}
            contentStyle={{
              background: "rgba(10, 14, 22, 0.96)",
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 11,
              color: K.text,
            }}
          />
          <Area
            type="monotone"
            dataKey={primary.key}
            name={primary.label}
            stroke={color}
            strokeWidth={3}
            fill={`url(#${gradId})`}
            fillOpacity={1}
            dot={false}
            activeDot={{ r: 3.5, fill: color, stroke: color }}
            connectNulls={false}
            isAnimationActive={!reduced}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
