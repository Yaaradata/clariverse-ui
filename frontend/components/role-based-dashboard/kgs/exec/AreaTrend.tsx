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

/** Matches head_cards ExecutiveTile chart fill under the left column. */
export const QUESTION_CHART_H = 150;

/**
 * Bank ExecutiveTile area chart — monotone curve, accent gradient, end-dot,
 * "12 wks" footer. No end-value label, markers, baselines, ticks or grid.
 */
export function AreaTrend({
  id,
  data: dataProp,
  series,
  height = QUESTION_CHART_H,
  strokeColor,
  footerLabel = "12 wks",
}: {
  id: string;
  data: Array<Record<string, number | null>>;
  series: TrendSeries[];
  /** Kept for call-site compatibility; ignored. */
  markers?: TrendMarker[];
  height?: number;
  /** Stroke/fill colour (card accent). */
  strokeColor?: string;
  /** Kept for call-site compatibility; end-value labels are not rendered. */
  endLabel?: string;
  footerLabel?: string;
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
  const lastIdx = data.length - 1;
  const ys = data
    .map((d) => d[primary.key])
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const maxY = ys.length ? Math.max(...ys) : 1;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        minHeight: height,
        flexShrink: 0,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" hide />
          <YAxis hide domain={[0, maxY * 1.1]} />
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
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            fillOpacity={1}
            connectNulls
            isAnimationActive={!reduced}
            animationDuration={900}
            activeDot={{ r: 3.5, fill: color, stroke: color }}
            dot={(props: { cx?: number; cy?: number; index?: number }) => {
              const { cx, cy, index } = props;
              if (index !== lastIdx || cx == null || cy == null) {
                return <g key={`dot-${index ?? 0}`} />;
              }
              return (
                <circle
                  key="end-dot"
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  stroke={color}
                />
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          fontSize: 11,
          color: K.textMut,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {footerLabel}
      </span>
    </div>
  );
}
