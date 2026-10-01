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
import { useReducedMotion } from "@/components/role-based-dashboard/kgs/shared/motion";
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";

export type TrendSeries2 = {
  key: string;
  label: string;
  color: string;
  area?: boolean;
};

/** Matches v1 AreaTrend / head_cards ExecutiveTile chart height. */
export const QUESTION_CHART_H2 = 150;

/**
 * v2 AreaTrend — one series, gradient fill, end value labelled,
 * y-axis fitted to the data (not forced through 0).
 */
export function AreaTrend2({
  id,
  data: dataProp,
  series,
  height = QUESTION_CHART_H2,
  strokeColor,
  footerLabel = "13 wks",
  endSuffix = "",
}: {
  id: string;
  data: Array<Record<string, number | null>>;
  series: TrendSeries2[];
  height?: number;
  strokeColor?: string;
  footerLabel?: string;
  /** Appended to the end-value label (e.g. "%"). */
  endSuffix?: string;
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
  const gradId = `kgs2-grad-${id}-${primary.key}`;
  const lastIdx = data.length - 1;
  const ys = data
    .map((d) => d[primary.key])
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 1;
  const pad = Math.max((maxY - minY) * 0.18, maxY * 0.04, 1);
  const domainMin = Math.max(0, minY - pad);
  const domainMax = maxY + pad;
  const endVal = ys.length ? ys[ys.length - 1] : null;

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
          margin={{ top: 10, right: 28, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" hide />
          <YAxis hide domain={[domainMin, domainMax]} />
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
      {endVal != null ? (
        <span
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            color,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {Number.isInteger(endVal) ? endVal : endVal.toFixed(1)}
          {endSuffix}
        </span>
      ) : null}
    </div>
  );
}
