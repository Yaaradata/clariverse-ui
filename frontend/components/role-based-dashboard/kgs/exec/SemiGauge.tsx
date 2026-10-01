"use client";

import { useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";

/** Gauges grow 100ms after the count-ups start (04 §6). */
const GROW_DELAY_MS = 100;

/**
 * Bank MiniHalfGauge (HeadOfCreditCardsDashboard.tsx:109) — % + one label, no sub-row.
 */
export function SemiGauge({
  pct,
  label,
  color,
  labelColor,
}: {
  pct: number;
  label: string;
  /** Optional; ignored on the overview tile (no sub-row). */
  sub?: string;
  color: string;
  /** Gauge caption colour — defaults to muted grey. */
  labelColor?: string;
}) {
  const reduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, pct));
  const [data] = useState(() => [{ value: clamped, fill: color }]);

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
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 1, height: 1 }}
        >
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
              isAnimationActive={!reduced}
              animationBegin={GROW_DELAY_MS}
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
          color: labelColor ?? "rgb(185, 185, 186)",
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          whiteSpace: "normal",
          overflow: "visible",
          lineHeight: 1.2,
          minHeight: 30,
          paddingTop: 2,
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          fontWeight: labelColor ? 600 : 400,
        }}
      >
        {label}
      </div>
    </div>
  );
}
