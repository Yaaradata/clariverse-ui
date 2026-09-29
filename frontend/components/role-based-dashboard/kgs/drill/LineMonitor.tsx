"use client";

import type { ChartMarker } from "@kgs/types";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

export type MonitorSeries = {
  key: string;
  label: string;
  colour: string;
  values: (number | null)[];
  dashed?: boolean;
  /** Second (hidden-scale) axis, e.g. an RMA rate % beside contact rates. */
  secondary?: boolean;
  /** Emphasised line (the signal); others are drawn muted. */
  emphasis?: boolean;
  /** Makes the line and its legend item a link. */
  onClick?: () => void;
};

const MARKER_STROKE: Record<
  ChartMarker["style"],
  { stroke: string; dash: string }
> = {
  release: { stroke: K.violet400, dash: "4 4" },
  threshold: { stroke: K.amber, dash: "4 4" },
  review: { stroke: K.textMut, dash: "2 4" },
  cutover: { stroke: K.textMut, dash: "4 4" },
  event: { stroke: K.slate, dash: "4 4" },
};

type Row = Record<string, number | null>;

function MonitorTooltip({
  active,
  payload,
  label,
  tick,
  series,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number | null }[];
  label?: number;
  tick: (w: number) => string;
  series: MonitorSeries[];
}) {
  if (!active || !payload?.length || label === undefined) return null;
  const byKey = new Map(series.map((s) => [s.key, s]));
  return (
    <div
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: K.textSec,
        maxWidth: 320,
      }}
    >
      <div style={{ fontFamily: K.mono, color: K.textMut, marginBottom: 4 }}>
        {tick(label)}
      </div>
      {payload
        .filter((p) => p.value !== null && p.value !== undefined)
        .map((p) => {
          const s = byKey.get(String(p.dataKey));
          return s ? (
            <div
              key={s.key}
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: s.colour }}>{s.label}</span>
              <span style={{ fontFamily: K.mono }}>{p.value}</span>
            </div>
          ) : null;
        })}
    </div>
  );
}

/**
 * LineMonitor (03 §3C): Recharts lines on a numeric week axis, dashed #333 grid, dot markers,
 * reference-line markers labelled in words, legend below. A series with `onClick` is a link
 * (line and legend item). Rows are built once per mount from the static series arrays, so a
 * label change (anonymise) never re-runs the draw-in.
 */
export function LineMonitor({
  weeks,
  series,
  markers = [],
  tick,
  ticks,
  height = 240,
  secondaryDomain,
  ariaLabel,
}: {
  weeks: number[];
  series: MonitorSeries[];
  markers?: ChartMarker[];
  tick: (w: number) => string;
  ticks?: number[];
  height?: number;
  secondaryDomain?: [number, number];
  ariaLabel: string;
}) {
  const L = useLabel();
  const reduced = useReducedMotion();
  const [rows] = useState<Row[]>(() =>
    weeks.map((w, i) => {
      const r: Row = { week: w };
      for (const s of series) r[s.key] = s.values[i] ?? null;
      return r;
    }),
  );
  const hasSecondary = series.some((s) => s.secondary);
  const domain: [number, number] = [
    Math.min(weeks[0], ...markers.map((m) => m.week)),
    Math.max(weeks[weeks.length - 1], ...markers.map((m) => m.week)) + 0.3,
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 44, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              stroke="#333"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              type="number"
              domain={domain}
              ticks={ticks ?? weeks}
              tickFormatter={tick}
              tick={{ fill: K.textMut, fontSize: 12, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="main"
              width={36}
              tick={{ fill: K.textMut, fontSize: 12, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
            />
            {hasSecondary ? (
              <YAxis
                yAxisId="secondary"
                hide
                domain={secondaryDomain ?? [0, "auto"]}
              />
            ) : null}
            <Tooltip
              content={<MonitorTooltip tick={tick} series={series} />}
              cursor={{ stroke: K.borderLight, strokeWidth: 1.5 }}
              isAnimationActive={false}
            />
            {markers.map((m, i) => {
              const s = MARKER_STROKE[m.style];
              return (
                <ReferenceLine
                  key={`${m.week}-${m.label}`}
                  yAxisId="main"
                  x={m.week}
                  stroke={s.stroke}
                  strokeWidth={1.5}
                  strokeDasharray={s.dash}
                  label={{
                    value: L(m.label),
                    position: "top",
                    fill: s.stroke,
                    fontSize: 11,
                    offset: 6 + (i % 3) * 13,
                  }}
                />
              );
            })}
            {series.map((s) => (
              <Line
                key={s.key}
                yAxisId={s.secondary ? "secondary" : "main"}
                dataKey={s.key}
                type="linear"
                stroke={s.colour}
                strokeWidth={s.emphasis ? 3 : 2}
                strokeOpacity={s.emphasis || s.secondary ? 1 : 0.75}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                dot={
                  s.dashed
                    ? false
                    : {
                        r: s.emphasis ? 4 : 3,
                        fill: "#fff",
                        stroke: s.colour,
                        strokeWidth: 2,
                      }
                }
                activeDot={{ r: 5 }}
                connectNulls={false}
                isAnimationActive={!reduced}
                animationDuration={900}
                style={s.onClick ? { cursor: "pointer" } : undefined}
                onClick={s.onClick}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 14px",
          fontSize: 12,
          color: K.body,
        }}
      >
        {series.map((s) => {
          const swatch = (
            <span
              aria-hidden
              style={{
                width: 14,
                height: 0,
                borderTop: `${s.emphasis ? 3 : 2}px ${s.dashed ? "dashed" : "solid"} ${s.colour}`,
              }}
            />
          );
          return (
            <li key={s.key}>
              {s.onClick ? (
                <button
                  type="button"
                  onClick={s.onClick}
                  className="kgs-focus"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: s.emphasis ? K.text : K.body,
                    fontWeight: s.emphasis ? 700 : 400,
                    fontSize: 12,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    textDecoration: s.emphasis ? "underline" : undefined,
                    textUnderlineOffset: 3,
                  }}
                >
                  {swatch}
                  {s.label}
                </button>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {swatch}
                  {s.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
