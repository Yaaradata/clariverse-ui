"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { K } from "../shared/tokens";

/**
 * Fork of the bank MiniHalfGauge (HeadOfCreditCardsDashboard.tsx:109).
 * KGS changes: % text comes from data (never recomputed), label + sub-line in sentence
 * case at ≥11px, tabular numerals.
 */
export function SemiGauge({
  pct,
  label,
  sub,
  color,
}: {
  pct: number;
  label: string;
  sub: string;
  color: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const data = [{ name: label, value: clamped, fill: color }];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        gap: 4,
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
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: "#39393990" }}
              isAnimationActive
              animationDuration={600}
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
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
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
          fontSize: 11,
          color: K.body,
          textAlign: "center",
          lineHeight: 1.25,
          minHeight: 28,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: K.textMut,
          textAlign: "center",
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {sub}
      </div>
    </div>
  );
}
