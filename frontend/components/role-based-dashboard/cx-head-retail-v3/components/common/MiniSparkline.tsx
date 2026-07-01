"use client";

import React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { cssVar } from "../../theme/tokens";
import { RetailTrendAreaChart } from "./RetailTrendAreaChart";

export function MiniSparkline({
  data,
  color,
  height = 44,
  yPadBelow = 6,
  yPadAbove = 4,
}: {
  data: number[];
  color: string;
  height?: number;
  yPadBelow?: number;
  yPadAbove?: number;
}): React.ReactElement {
  const trendData = data.map((v, i) => ({ w: `D${i + 1}`, v }));

  return (
    <RetailTrendAreaChart
      data={trendData}
      stroke={color}
      minHeight={height}
      yPadBelow={yPadBelow}
      yPadAbove={yPadAbove}
      gradientKey="spark"
    />
  );
}

/** Half radial dial — AP-014 dial + sparkline pairing on executive tiles. */
export function MiniGauge({
  value,
  label,
  topLabel,
  bottomLabel,
  color,
  suffix = "",
  compact = false,
}: {
  value: number;
  label: string;
  topLabel?: string;
  bottomLabel?: string;
  color: string;
  suffix?: string;
  compact?: boolean;
}): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  const gaugeData = [{ name: label, value: clamped, fill: color }];
  const chartHeight = compact ? 48 : 54;
  const innerRadius = compact ? 22 : 32;
  const outerRadius = compact ? 34 : 46;
  const topSlotHeight = 14;
  const bottomSlotHeight = 22;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 1 : 2,
        minWidth: 0,
        width: "100%",
      }}
    >
      <div
        style={{
          height: topSlotHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: cssVar("text-muted"),
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {topLabel ?? label}
      </div>
      <div style={{ position: "relative", width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={gaugeData}
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cx="50%"
            cy="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={compact ? 3 : 4} background={{ fill: `${cssVar("border")}` }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          className="lisn-num"
          style={{
            position: "absolute",
            left: "50%",
            bottom: compact ? 0 : 2,
            transform: "translateX(-50%)",
            fontSize: compact ? 12 : 14,
            fontWeight: 800,
            color,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {clamped}
          {suffix}
        </div>
      </div>
      {bottomLabel ? (
        <div
          style={{
            height: bottomSlotHeight,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            fontSize: 9,
            color: cssVar("text-muted"),
            textTransform: "uppercase",
            letterSpacing: 0.28,
            textAlign: "center",
            lineHeight: 1.15,
            width: "100%",
          }}
        >
          {bottomLabel}
        </div>
      ) : null}
    </div>
  );
}
