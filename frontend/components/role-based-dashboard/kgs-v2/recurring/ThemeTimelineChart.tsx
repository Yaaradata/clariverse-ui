"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";

type Series = {
  id: string;
  name: string;
  values: number[];
  fixMarkers: number[];
  returnMarkers: number[];
};

const COLOURS = [K.orange, K.violet400, K.green];

/** Theme timeline: weekly contacts for top themes with ◆ fix / ▲ return markers. */
export function ThemeTimelineChart({
  weeks,
  series,
}: {
  weeks: string[];
  series: Series[];
}) {
  const data = useMemo(() => {
    return weeks.map((w, i) => {
      const row: Record<string, string | number | null> = { week: w };
      for (const s of series) {
        row[s.id] = s.values[i] ?? null;
      }
      return row;
    });
  }, [weeks, series]);

  const markerMap = useMemo(() => {
    const map = new Map<string, { fix: Set<number>; ret: Set<number> }>();
    for (const s of series) {
      map.set(s.id, {
        fix: new Set(s.fixMarkers),
        ret: new Set(s.returnMarkers),
      });
    }
    return map;
  }, [series]);

  return (
    <div role="img" aria-label="Theme timeline weekly contacts" style={{ height: 280 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <LineChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: K.elevated,
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: K.textMut }} />
          {series.map((s, si) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              name={s.name}
              stroke={COLOURS[si % COLOURS.length]}
              strokeWidth={2}
              isAnimationActive={false}
              dot={(props) => {
                const { cx, cy, index } = props;
                if (cx == null || cy == null || index == null) return null;
                const m = markerMap.get(s.id);
                if (m?.fix.has(index)) {
                  return (
                    <text
                      key={`f-${s.id}-${index}`}
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill={COLOURS[si % COLOURS.length]}
                      fontSize={12}
                      fontWeight={700}
                    >
                      ◆
                    </text>
                  );
                }
                if (m?.ret.has(index)) {
                  return (
                    <text
                      key={`r-${s.id}-${index}`}
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill={K.orange}
                      fontSize={12}
                      fontWeight={700}
                    >
                      ▲
                    </text>
                  );
                }
                return (
                  <circle
                    key={`d-${s.id}-${index}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={COLOURS[si % COLOURS.length]}
                  />
                );
              }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 6,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <span>◆ fix</span>
        <span>▲ return</span>
      </div>
    </div>
  );
}
