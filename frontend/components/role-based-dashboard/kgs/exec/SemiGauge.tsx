"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

type SemiGaugeProps = {
  pct: number;
  label: string;
  sub: string;
  tone: "green" | "amber" | "red";
};

export function SemiGauge({ pct, label, sub, tone }: SemiGaugeProps) {
  const color = tone === "green" ? "#4ade80" : tone === "amber" ? "#fbbf24" : "#f87171";
  const data = [{ value: Math.max(0, Math.min(100, pct)), fill: color }];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        gap: 6,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 58 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={32}
            outerRadius={46}
            cx="50%"
            cy="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: "#39393990" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 2,
            transform: "translateX(-50%)",
            fontSize: 14,
            fontWeight: 800,
            color,
            fontFamily: "var(--mono, monospace)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#b9b9ba",
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          whiteSpace: "normal",
          lineHeight: 1.2,
          minHeight: 30,
          paddingTop: 2,
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#737373",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {sub}
      </div>
    </div>
  );
}
