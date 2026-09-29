"use client";

import type { ChartMarker } from "@kgs/types";
import { useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K, withAlpha } from "../shared/tokens";
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

/** Opt-in copy for `variant="focus"` (Installed Base cohort chart). */
export type LineMonitorFocusCopy = {
  legendFocus: string;
  legendBand: string;
  bandLabel: string;
  releaseLabel: string;
  chips: { text: string; tone: "accent" | "muted" }[];
};

const MARKER_STROKE: Record<
  ChartMarker["style"],
  { stroke: string; dash: string }
> = {
  release: { stroke: K.violet400, dash: "4 4" },
  threshold: { stroke: K.amber, dash: "4 4" },
  review: { stroke: K.textMut, dash: "4 4" },
  cutover: { stroke: K.textMut, dash: "4 4" },
  event: { stroke: K.slate, dash: "4 4" },
};

type Row = Record<string, number | null>;

type FocusRow = {
  week: number;
  focus: number | null;
  bandMin: number | null;
  bandRange: number | null;
  median: number | null;
  bandMax: number | null;
};

function medianOf(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

function buildFocusRows(
  weeks: number[],
  focus: MonitorSeries,
  bandSeries: MonitorSeries[],
): FocusRow[] {
  return weeks.map((w, i) => {
    const cohort: number[] = [];
    for (const s of bandSeries) {
      const v = s.values[i];
      if (v !== null && v !== undefined) cohort.push(v);
    }
    if (!cohort.length) {
      return {
        week: w,
        focus: focus.values[i] ?? null,
        bandMin: null,
        bandRange: null,
        median: null,
        bandMax: null,
      };
    }
    const lo = Math.min(...cohort);
    const hi = Math.max(...cohort);
    return {
      week: w,
      focus: focus.values[i] ?? null,
      bandMin: lo,
      bandRange: hi - lo,
      median: medianOf(cohort),
      bandMax: hi,
    };
  });
}

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

function FocusTooltip({
  active,
  payload,
  label,
  tick,
  focusLabel,
  bandLabel,
}: {
  active?: boolean;
  payload?: { payload?: FocusRow }[];
  label?: number;
  tick: (w: number) => string;
  focusLabel: string;
  bandLabel: string;
}) {
  if (!active || !payload?.length || label === undefined) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: K.textSec,
        maxWidth: 280,
      }}
    >
      <div style={{ fontFamily: K.mono, color: K.textMut, marginBottom: 4 }}>
        {tick(label)}
      </div>
      {row.focus !== null ? (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: K.orange }}>{focusLabel}</span>
          <span style={{ fontFamily: K.mono }}>{row.focus}</span>
        </div>
      ) : null}
      {row.bandMin !== null && row.bandMax !== null ? (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <span style={{ color: K.textMut }}>{bandLabel}</span>
          <span style={{ fontFamily: K.mono }}>
            {row.bandMin}–{row.bandMax}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function FocusMonitor({
  weeks,
  series,
  markers,
  tick,
  height,
  ariaLabel,
  focusCopy,
}: {
  weeks: number[];
  series: MonitorSeries[];
  markers: ChartMarker[];
  tick: (w: number) => string;
  height: number;
  ariaLabel: string;
  focusCopy: LineMonitorFocusCopy;
}) {
  const L = useLabel();
  const reduced = useReducedMotion();

  const focus =
    series.find((s) => s.emphasis) ??
    series.find((s) => !s.dashed && !s.secondary) ??
    series[0];
  const bandSeries = series.filter(
    (s) => !s.emphasis && !s.secondary && !s.dashed && s.key !== focus.key,
  );

  const focusRows = useMemo(
    () => buildFocusRows(weeks, focus, bandSeries),
    // weeks + value arrays are static mock data; recompute when series identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weeks, focus.key, bandSeries.map((s) => s.key).join("|")],
  );

  const lastRow = [...focusRows].reverse().find((r) => r.focus !== null);
  const bandFill = withAlpha(K.slate, 0.28);
  const xTicks = weeks.filter((_, i) => i % 2 === 0);
  const domain: [number, number] = [
    Math.min(weeks[0], ...markers.map((m) => m.week)),
    Math.max(weeks[weeks.length - 1], ...markers.map((m) => m.week)) + 0.3,
  ];
  const bandMidY =
    focusRows[0]?.bandMin != null && focusRows[0]?.bandMax != null
      ? (focusRows[0].bandMin + focusRows[0].bandMax) / 2
      : 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 1, height: 1 }}
        >
          <ComposedChart
            data={focusRows}
            margin={{ top: 36, right: 40, bottom: 4, left: 0 }}
          >
            <XAxis
              dataKey="week"
              type="number"
              domain={domain}
              ticks={xTicks}
              tickFormatter={tick}
              tick={{ fill: K.textMut, fontSize: 12, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              width={28}
              domain={[0, 8]}
              ticks={[0, 4, 8]}
              tick={{ fill: K.textMut, fontSize: 12, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={0} stroke={K.borderLight} strokeWidth={1} />
            <Tooltip
              content={
                <FocusTooltip
                  tick={tick}
                  focusLabel={L(focusCopy.legendFocus)}
                  bandLabel={L(focusCopy.bandLabel)}
                />
              }
              cursor={{ stroke: K.borderLight, strokeWidth: 1.5 }}
              isAnimationActive={false}
            />
            {markers.map((m) => (
              <ReferenceLine
                key={`${m.week}-${focusCopy.releaseLabel}`}
                x={m.week}
                stroke={K.violet400}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: L(focusCopy.releaseLabel),
                  position: "top",
                  fill: K.violet400,
                  fontSize: 11,
                  offset: 6,
                }}
              />
            ))}
            {/* Band: fill to max, then mask below min with panel bg */}
            <Area
              dataKey="bandMax"
              type="linear"
              stroke="none"
              fill={bandFill}
              isAnimationActive={!reduced}
              animationDuration={700}
              connectNulls
            />
            <Area
              dataKey="bandMin"
              type="linear"
              stroke="none"
              fill={K.bg}
              isAnimationActive={!reduced}
              animationDuration={700}
              connectNulls
            />
            <Line
              dataKey="median"
              type="linear"
              stroke={K.slate}
              strokeWidth={1.25}
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={!reduced}
              animationDuration={700}
            />
            <ReferenceLine
              y={bandMidY}
              stroke="transparent"
              label={{
                value: L(focusCopy.bandLabel),
                position: "insideTopLeft",
                fill: K.textMut,
                fontSize: 11,
                offset: 2,
              }}
            />
            <Line
              dataKey="focus"
              type="linear"
              stroke={K.orange}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#fff",
                stroke: K.orange,
                strokeWidth: 2,
              }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              isAnimationActive={!reduced}
              animationDuration={700}
              style={focus.onClick ? { cursor: "pointer" } : undefined}
              onClick={focus.onClick}
            />
            {lastRow && lastRow.focus !== null ? (
              <ReferenceDot
                x={lastRow.week}
                y={lastRow.focus}
                r={0}
                fill="transparent"
                stroke="none"
                label={{
                  value: String(lastRow.focus),
                  position: "right",
                  fill: K.orange,
                  fontSize: 12,
                  fontWeight: 700,
                  offset: 8,
                }}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 16px",
          fontSize: 12,
          color: K.body,
        }}
      >
        <li>
          {focus.onClick ? (
            <button
              type="button"
              onClick={focus.onClick}
              className="kgs-focus"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                padding: 0,
                color: K.text,
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 0,
                  borderTop: `3px solid ${K.orange}`,
                }}
              />
              {L(focusCopy.legendFocus)}
            </button>
          ) : (
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 0,
                  borderTop: `3px solid ${K.orange}`,
                }}
              />
              {L(focusCopy.legendFocus)}
            </span>
          )}
        </li>
        <li>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              aria-hidden
              style={{
                width: 14,
                height: 8,
                borderRadius: 2,
                background: bandFill,
                border: `1px solid ${withAlpha(K.slate, 0.5)}`,
              }}
            />
            {L(focusCopy.legendBand)}
          </span>
        </li>
      </ul>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        {focusCopy.chips.map((c) => (
          <span
            key={c.text}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: K.radius.pill,
              border: `1px solid ${
                c.tone === "accent"
                  ? withAlpha(K.orange, 0.45)
                  : K.borderLight
              }`,
              background:
                c.tone === "accent"
                  ? withAlpha(K.orange, 0.12)
                  : withAlpha(K.slate, 0.08),
              color: c.tone === "accent" ? K.orange : K.textMut,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {L(c.text)}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * LineMonitor (03 §3C): Recharts lines on a numeric week axis, dashed #333 grid, dot markers,
 * reference-line markers labelled in words, legend below. A series with `onClick` is a link
 * (line and legend item). Rows are built once per mount from the static series arrays, so a
 * label change (anonymise) never re-runs the draw-in.
 *
 * `variant="focus"` (Installed Base only): one orange signal line + grey normal-range band.
 * Default (Separation and others) is unchanged.
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
  variant = "default",
  focusCopy,
}: {
  weeks: number[];
  series: MonitorSeries[];
  markers?: ChartMarker[];
  tick: (w: number) => string;
  ticks?: number[];
  height?: number;
  secondaryDomain?: [number, number];
  ariaLabel: string;
  variant?: "default" | "focus";
  focusCopy?: LineMonitorFocusCopy;
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

  if (variant === "focus" && focusCopy) {
    return (
      <FocusMonitor
        weeks={weeks}
        series={series}
        markers={markers}
        tick={tick}
        height={height}
        ariaLabel={ariaLabel}
        focusCopy={focusCopy}
      />
    );
  }

  const hasSecondary = series.some((s) => s.secondary);
  const domain: [number, number] = [
    Math.min(weeks[0], ...markers.map((m) => m.week)),
    Math.max(weeks[weeks.length - 1], ...markers.map((m) => m.week)) + 0.3,
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 1, height: 1 }}
        >
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
