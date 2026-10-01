"use client";

import { useV2K } from "@kgs2/lib/demoState";
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
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

type Series = {
  id: string;
  name: string;
  values: number[];
  fixMarkers: number[];
  returnMarkers: number[];
};

/** Theme timeline: weekly contacts · ◆ fix / ▲ return large + labelled. */
export function ThemeTimelineChart({
  weeks,
  series,
  height = 220,
}: {
  weeks: string[];
  series: Series[];
  height?: number;
}) {
  const K = useV2K();
  const COLOURS = [K.orange, K.violet400, K.green, K.sky, K.teal];
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
    <div
      role="img"
      aria-label="Theme timeline weekly contacts"
      style={{ height, position: "relative" }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <LineChart
          data={data}
          margin={{ top: 28, right: 16, bottom: 4, left: 0 }}
        >
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
              color: K.text,
            }}
            labelStyle={{ color: K.text, fontWeight: 700 }}
            cursor={{ stroke: withAlpha(K.text, 0.35), strokeWidth: 1 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: K.textMut }} />
          {series.map((s, si) => {
            const color = COLOURS[si % COLOURS.length];
            return (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.name}
                stroke={color}
                strokeWidth={2.5}
                isAnimationActive={false}
                dot={(props) => {
                  const { cx, cy, index } = props;
                  if (cx == null || cy == null || index == null) {
                    return <g key={`empty-${s.id}-${index ?? 0}`} />;
                  }
                  const m = markerMap.get(s.id);
                  if (m?.fix.has(index)) {
                    return (
                      <g key={`f-${s.id}-${index}`}>
                        <text
                          x={cx}
                          y={cy - 14}
                          textAnchor="middle"
                          fill={color}
                          fontSize={16}
                          fontWeight={800}
                        >
                          ◆
                        </text>
                        <text
                          x={cx}
                          y={cy - 28}
                          textAnchor="middle"
                          fill={color}
                          fontSize={10}
                          fontWeight={700}
                        >
                          fix
                        </text>
                      </g>
                    );
                  }
                  if (m?.ret.has(index)) {
                    return (
                      <g key={`r-${s.id}-${index}`}>
                        <text
                          x={cx}
                          y={cy - 14}
                          textAnchor="middle"
                          fill={K.orange}
                          fontSize={16}
                          fontWeight={800}
                        >
                          ▲
                        </text>
                        <text
                          x={cx}
                          y={cy - 28}
                          textAnchor="middle"
                          fill={K.orange}
                          fontSize={10}
                          fontWeight={700}
                        >
                          return
                        </text>
                      </g>
                    );
                  }
                  return (
                    <circle
                      key={`d-${s.id}-${index}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill={color}
                    />
                  );
                }}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 4,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <span>
          <span style={{ color: K.orange, fontWeight: 800 }}>◆</span> fix
        </span>
        <span>
          <span style={{ color: K.orange, fontWeight: 800 }}>▲</span> return
        </span>
      </div>
    </div>
  );
}
