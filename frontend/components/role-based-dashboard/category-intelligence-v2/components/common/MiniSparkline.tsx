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
  gradientKey = "spark",
}: {
  data: number[];
  color: string;
  height?: number;
  gradientKey?: string;
}): React.ReactElement {
  const gid = useUniqueGradientId(gradientKey);
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

export function MiniGauge({
  value,
  label,
  color,
  compact = false,
}: {
  value: number;
  label: string;
  color: string;
  compact?: boolean;
}): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: clamped, fill: color }];
  const chartHeight = compact ? 48 : 52;
  const innerRadius = 22;
  const outerRadius = 34;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 1 : 2,
        minWidth: compact ? 0 : 72,
        width: "100%",
        height: compact ? 62 : undefined,
        justifyContent: "flex-end",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cx="50%"
            cy="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={3} background={{ fill: cssVar("border") }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          className="lisn-num"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            fontSize: compact ? 12 : 13,
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
          letterSpacing: 0.28,
          textAlign: "center",
          lineHeight: 1.15,
          width: "100%",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {label}
      </div>
    </div>
  );
}
