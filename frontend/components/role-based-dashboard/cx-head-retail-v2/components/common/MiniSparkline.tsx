import React from "react";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { cssVar } from "../../theme/tokens";

export function MiniSparkline({
  data,
  color,
  height = 44,
}: {
  data: number[];
  color: string;
  height?: number;
}): React.ReactElement {
  const gid = useUniqueGradientId("spark");
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gid})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Half radial dial — AP-014 dial + sparkline pairing on executive tiles. */
export function MiniGauge({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: clamped, fill: color }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 64 }}>
      <div style={{ position: "relative", width: "100%", height: 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} startAngle={180} endAngle={0} innerRadius={22} outerRadius={34} cx="50%" cy="100%">
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={3} background={{ fill: `${cssVar("border")}` }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          className="lisn-num"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            fontSize: 13,
            fontWeight: 800,
            color,
            pointerEvents: "none",
          }}
        >
          {clamped}
        </div>
      </div>
      <div
        style={{
          fontSize: 9,
          color: cssVar("text-muted"),
          textTransform: "uppercase",
          letterSpacing: 0.3,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 72,
        }}
      >
        {label}
      </div>
    </div>
  );
}
