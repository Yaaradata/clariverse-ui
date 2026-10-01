"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { K, withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

type Marker = { weekIndex: number; label: string };

/** Hero chart: North weekly %, baseline band 84–91, 90% target, event markers. */
export function HeroPromiseChart({
  weeks,
  values,
  baselineLow,
  baselineHigh,
  targetPct,
  markers,
  ariaLabel,
}: {
  weeks: string[];
  values: number[];
  baselineLow: number;
  baselineHigh: number;
  targetPct: number;
  markers: Marker[];
  ariaLabel: string;
}) {
  const data = useMemo(
    () =>
      weeks.map((w, i) => ({
        week: w,
        idx: i,
        value: values[i] ?? null,
      })),
    [weeks, values],
  );

  return (
    <div role="img" aria-label={ariaLabel} style={{ height: 300 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <ComposedChart data={data} margin={{ top: 28, right: 20, bottom: 8, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
          />
          <YAxis
            domain={[60, 100]}
            ticks={[60, 70, 80, 90, 100]}
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: K.elevated,
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number | string) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`${n}%`, "Promise kept"];
            }}
          />
          <ReferenceArea
            y1={baselineLow}
            y2={baselineHigh}
            fill={withAlpha(K.slate, 0.28)}
            strokeOpacity={0}
          />
          <ReferenceLine
            y={targetPct}
            stroke={K.textMut}
            strokeDasharray="4 4"
            label={{
              value: `${targetPct}% target`,
              fill: K.textMut,
              fontSize: 11,
              position: "insideTopRight",
            }}
          />
          {markers.map((m) => {
            const w = weeks[m.weekIndex];
            if (!w) return null;
            return (
              <ReferenceLine
                key={m.label}
                x={w}
                stroke={withAlpha(K.violet400, 0.7)}
                strokeWidth={1}
                label={{
                  value: m.label,
                  fill: K.violet300,
                  fontSize: 10,
                  position: "top",
                }}
              />
            );
          })}
          <Line
            type="monotone"
            dataKey="value"
            stroke={K.orange}
            strokeWidth={2.5}
            dot={{ r: 3, fill: K.orange, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 14px",
          marginTop: 8,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <span>
          <span style={{ color: K.orange }}>━</span> North promise kept
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 8,
              background: withAlpha(K.slate, 0.35),
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          Baseline {baselineLow}–{baselineHigh}%
        </span>
        <span>— — {targetPct}% target</span>
      </div>
    </div>
  );
}
