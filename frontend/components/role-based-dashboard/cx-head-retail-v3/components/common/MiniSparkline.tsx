"use client";

import React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";
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

/** Jagged line spark — sharp linear segments, no area fill. */
export function SpikySparkline({
  data,
  color,
  height = 32,
  strokeWidth = 2.25,
  viewBox,
}: {
  data: number[];
  color: string;
  height?: number;
  strokeWidth?: number;
  /** Override SVG viewBox (default `0 0 120 {height}`). */
  viewBox?: string;
}): React.ReactElement {
  const width = 120;
  const padX = 4;
  const padY = 5;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = padX + (i / Math.max(data.length - 1, 1)) * plotW;
      const y = padY + (1 - (v - min) / range) * plotH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={viewBox ?? `0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 3px ${color}55)` }}
      />
    </svg>
  );
}

/** Half radial dial — AP-014 dial + sparkline pairing on executive tiles. */
function splitDisplayValue(raw: string | undefined): { target: number; decimals: number; suffix: string } | null {
  if (!raw) return null;
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(raw.trim());
  if (!match) return null;
  const numStr = match[1] ?? "0";
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;
  return { target: Number(numStr), decimals, suffix: match[2] ?? "" };
}

export function MiniGauge({
  value,
  label,
  topLabel,
  bottomLabel,
  color,
  suffix = "",
  displayValue,
  showMeter = true,
  compact = false,
}: {
  value: number;
  label: string;
  topLabel?: string;
  bottomLabel?: string;
  color: string;
  suffix?: string;
  displayValue?: string;
  showMeter?: boolean;
  compact?: boolean;
}): React.ReactElement {
  const parsedDisplay = splitDisplayValue(displayValue);
  const animatedMeter = useAnimatedNumber(value, { duration: 700, delay: 40 });
  const animatedDisplay = useAnimatedNumber(parsedDisplay?.target ?? value, {
    duration: 700,
    delay: 40,
    decimals: parsedDisplay?.decimals ?? 0,
  });

  const clamped = Math.max(0, Math.min(100, animatedMeter));
  const gaugeData = [{ name: label, value: clamped, fill: color }];
  const chartHeight = compact ? 48 : 54;
  const innerRadius = compact ? 22 : 32;
  const outerRadius = compact ? 34 : 46;
  const topSlotHeight = 14;
  const bottomSlotHeight = 22;
  const centerText = parsedDisplay
    ? `${animatedDisplay}${parsedDisplay.suffix}`
    : `${Math.round(clamped)}${suffix}`;

  const labelStyle: React.CSSProperties = {
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
  };

  const bottomStyle: React.CSSProperties = {
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
  };

  if (!showMeter) {
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
        {/* Spacer matches Happy top label slot so PER HOUR still lines up with RATE */}
        <div style={{ height: topSlotHeight, width: "100%", flexShrink: 0 }} aria-hidden />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: chartHeight,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
              textAlign: "center",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {topLabel ?? label}
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: compact ? 12 : 14,
              fontWeight: 800,
              color,
              whiteSpace: "nowrap",
              lineHeight: 1,
              paddingBottom: compact ? 0 : 2,
            }}
          >
            {centerText}
          </div>
        </div>
        {bottomLabel ? <div style={bottomStyle}>{bottomLabel}</div> : null}
      </div>
    );
  }

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
      <div style={labelStyle}>{topLabel ?? label}</div>
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
            <RadialBar
              dataKey="value"
              cornerRadius={compact ? 3 : 4}
              background={{ fill: `${cssVar("border")}` }}
              isAnimationActive={false}
            />
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
          {centerText}
        </div>
      </div>
      {bottomLabel ? <div style={bottomStyle}>{bottomLabel}</div> : null}
    </div>
  );
}
