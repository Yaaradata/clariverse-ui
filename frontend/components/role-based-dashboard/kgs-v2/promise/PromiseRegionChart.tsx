"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { K, withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

type RegionSeries = {
  regionId: string;
  region: string;
  values: number[];
};

/** North coloured line; other regions as a grey min–max band; 90% target. */
export function PromiseRegionChart({
  weeks,
  series,
  targetPct,
  northLabel,
}: {
  weeks: string[];
  series: RegionSeries[];
  targetPct: number;
  northLabel: string;
}) {
  const data = useMemo(() => {
    const north = series.find((s) => s.regionId === "North");
    const others = series.filter((s) => s.regionId !== "North");
    return weeks.map((w, i) => {
      const vals = others.map((s) => s.values[i] ?? 0);
      const bandMin = vals.length ? Math.min(...vals) : null;
      const bandMax = vals.length ? Math.max(...vals) : null;
      return {
        week: w,
        north: north?.values[i] ?? null,
        bandMin,
        bandMax,
        bandBase: bandMin,
        bandSpan:
          bandMin != null && bandMax != null ? bandMax - bandMin : null,
      };
    });
  }, [weeks, series]);

  return (
    <div role="img" aria-label={`${northLabel} promise kept weekly`} style={{ height: 280 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} strokeDasharray="0" vertical={false} />
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
            labelStyle={{ color: K.text }}
            formatter={(value: number | string, name: string) => {
              if (name === "bandSpan" || name === "bandBase") return [null, null];
              const n = typeof value === "number" ? value : Number(value);
              if (Number.isNaN(n)) return [value, name];
              return [`${n}%`, name === "north" ? northLabel : name];
            }}
          />
          <Area
            type="monotone"
            dataKey="bandBase"
            stackId="band"
            stroke="none"
            fill="transparent"
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="bandSpan"
            stackId="band"
            stroke="none"
            fill={withAlpha(K.slate, 0.35)}
            isAnimationActive={false}
            name="Other regions"
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
          <Line
            type="monotone"
            dataKey="north"
            stroke={K.orange}
            strokeWidth={2.5}
            dot={{ r: 3, fill: K.orange, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
            name={northLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
