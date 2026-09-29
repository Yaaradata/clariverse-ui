"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type AreaTrendProps = {
  data: Array<{ week: string; value: number | null }>;
  color: string;
  baselineY?: number;
};

export function AreaTrend({ data, color, baselineY }: AreaTrendProps) {
  return (
    <div style={{ width: "100%", height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#737373", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          {baselineY !== undefined ? (
            <line
              x1="0%"
              x2="100%"
              y1={`${100 - baselineY}%`}
              y2={`${100 - baselineY}%`}
              stroke="#737373"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ) : null}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#gradient-${color})`}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
