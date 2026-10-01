"use client";

import { useV2K } from "@kgs2/lib/demoState";
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
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

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
  const K = useV2K();
  const data = useMemo(
    () =>
      weeks.map((w, i) => ({
        week: w,
        idx: i,
        value: values[i] ?? null,
      })),
    [weeks, values],
  );

  const ys = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  const dataMin = ys.length ? Math.min(...ys, baselineLow) : baselineLow;
  const dataMax = ys.length
    ? Math.max(...ys, baselineHigh, targetPct)
    : baselineHigh;
  const pad = Math.max((dataMax - dataMin) * 0.12, 2);
  const domainMin = Math.max(0, Math.floor(dataMin - pad));
  const domainMax = Math.ceil(dataMax + pad);

  return (
    <div role="img" aria-label={ariaLabel} style={{ height: 260 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <ComposedChart
          data={data}
          margin={{ top: 28, right: 20, bottom: 8, left: 0 }}
        >
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
          />
          <YAxis
            domain={[domainMin, domainMax]}
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
            const short =
              m.label.length > 28 ? `${m.label.slice(0, 26)}…` : m.label;
            return (
              <ReferenceLine
                key={m.label}
                x={w}
                stroke={withAlpha(K.violet400, 0.7)}
                strokeWidth={1}
                label={{
                  value: short,
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
        {markers.map((m) => (
          <span key={m.label}>◆ {m.label}</span>
        ))}
      </div>
    </div>
  );
}
