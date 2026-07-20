"use client";

import React from "react";
import { cssVar, radius } from "../../theme/tokens";

/** Faint global benchmark band behind a measured rate. */
export function BenchmarkBandTrack({
  value,
  low,
  high,
  tag = "global",
  label,
  goodWhenHigher = true,
}: {
  value: number;
  low: number;
  high: number;
  tag?: string;
  label: string;
  goodWhenHigher?: boolean;
}): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  const bandLeft = Math.max(0, Math.min(100, low));
  const bandWidth = Math.max(0, Math.min(100 - bandLeft, high - low));
  const inBand = value >= low && value <= high;
  const tone = inBand
    ? cssVar("positive")
    : goodWhenHigher
      ? value < low
        ? cssVar("severity-high")
        : cssVar("severity-med")
      : value > high
        ? cssVar("severity-high")
        : cssVar("severity-med");

  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-primary") }}>{label}</span>
        <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: tone }}>
          {value}%
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: radius.pill,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          overflow: "hidden",
        }}
        title={`${tag} band ${low}–${high}%`}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: `${bandLeft}%`,
            width: `${bandWidth}%`,
            top: 0,
            bottom: 0,
            background: `${cssVar("accent")}22`,
            borderLeft: `1px dashed ${cssVar("accent")}55`,
            borderRight: `1px dashed ${cssVar("accent")}55`,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            width: `${clamped}%`,
            top: 0,
            bottom: 0,
            background: `linear-gradient(90deg, ${tone}55, ${tone})`,
            borderRadius: radius.pill,
          }}
        />
      </div>
      <div style={{ fontSize: 9, color: cssVar("text-muted"), marginTop: 3 }}>
        {tag} band {low}–{high}%
      </div>
    </div>
  );
}
