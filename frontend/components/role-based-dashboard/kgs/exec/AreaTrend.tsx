"use client";

import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
 * Fork of the bank ExecutiveTile area chart (HeadOfCreditCardsDashboard.tsx:377-419).
 * KGS changes: numeric week axis (fractional markers), optional dashed baseline /
 * control line and second axis, no "pts" tooltip. Values are passed through as data.
 */
export function AreaTrend({
  id,
  data,
  series,
  markers = [],
  height = 96,
}: {
  id: string;
  data: Array<Record<string, number | null>>;
  series: TrendSeries[];
  markers?: TrendMarker[];
  height?: number;
}) {
  const hasRight = series.some((s) => s.axis === "right");
  const xs = data.map((d) => d.x ?? 0);
  const domain: [number, number] = [
    Math.min(...xs),
    Math.max(...xs, ...markers.map((m) => m.x)),
  ];

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
        >
          <defs>
            {series
              .filter((s) => s.area)
              .map((s) => (
                <linearGradient
                  key={s.key}
                  id={`kgs-grad-${id}-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.42} />
                  <stop offset="55%" stopColor={s.color} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
          </defs>
          <XAxis dataKey="x" type="number" domain={domain} hide />
          <YAxis yAxisId="left" hide domain={[0, "dataMax"]} />
          {hasRight ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              hide
              domain={[0, "dataMax"]}
            />
          ) : null}
          <Tooltip
            cursor={false}
            labelFormatter={() => ""}
            contentStyle={{
              background: "rgba(10, 14, 22, 0.96)",
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 12,
              color: K.text,
            }}
          />
          {markers.map((m) => (
            <ReferenceLine
              key={`${m.x}-${m.label}`}
              yAxisId="left"
              x={m.x}
              stroke={m.color}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              ifOverflow="extendDomain"
            />
          ))}
          {series.map((s) =>
            s.area ? (
              <Area
                key={s.key}
                yAxisId={s.axis ?? "left"}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={3}
                fill={`url(#kgs-grad-${id}-${s.key})`}
                fillOpacity={1}
                dot={false}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
              />
            ) : (
              <Line
                key={s.key}
                yAxisId={s.axis ?? "left"}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                dot={false}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
