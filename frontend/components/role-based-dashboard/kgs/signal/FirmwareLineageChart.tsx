"use client";

import { signalFw41 } from "@kgs/lib/data";
import type { ChartMarker } from "@kgs/types";
import {
  Area,
  Bar,
  BarChart,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { dayLabel, fill, int } from "./format";

const { lineage } = signalFw41;
const [S40, S41] = lineage.series;

type Row = {
  week: number;
  weekStart?: string;
  r40?: number;
  band40?: [number, number];
  c40?: number;
  p40?: number;
  r41?: number;
  c41?: number;
  p41?: number;
  rma?: number;
};

const ROWS: Row[] = [
  ...S40.points.map((p, i) => {
    const q = S41.points.find((x) => x.week === p.week);
    return {
      week: p.week,
      weekStart: p.weekStart,
      r40: p.rate,
      band40: [p.rateLow, p.rateHigh] as [number, number],
      c40: p.contacts,
      p40: p.panels,
      r41: q?.rate,
      c41: q?.contacts,
      p41: q?.panels,
      rma: lineage.aggregate.values[i],
    };
  }),
  ...lineage.futureWeeks.map((week) => ({ week })),
];

const X_DOMAIN: [number, number] = [1, 28.5];
const TICKS = ROWS.filter((r) => r.weekStart && r.week % 2 === 1).map(
  (r) => r.week,
);
const TICK_LABEL = new Map(
  ROWS.filter((r) => r.weekStart).map((r) => [
    r.week,
    dayLabel(r.weekStart as string),
  ]),
);
const Y_MAX = Math.ceil(Math.max(...S41.points.map((p) => p.rate))) + 2;
const RMA_DOMAIN: [number, number] = [0, 0.7];
const Y_AXIS_WIDTH = 36;
const PLOT_MARGIN = { top: 8, right: 16, left: 0, bottom: 0 };

const byStyle = (s: ChartMarker["style"]) =>
  lineage.markers.find((m) => m.style === s);
const RELEASE = byStyle("release");
const THRESHOLD = byStyle("threshold");
const REVIEW = byStyle("review");

/** y of the 4.1 line at a fractional week (linear, matching the linear line type). */
function rate41At(week: number): number {
  const pts = S41.points;
  const hi = pts.findIndex((p) => p.week >= week);
  if (hi <= 0) return pts[Math.max(hi, 0)].rate;
  const a = pts[hi - 1];
  const b = pts[hi];
  return a.rate + ((b.rate - a.rate) * (week - a.week)) / (b.week - a.week);
}

const NEUTRAL_300 = "#d4d4d4";
const NEUTRAL_500 = "#737373";
const NEUTRAL_700 = "#404040";
const ORANGE_900 = "#7c2d12";
const MARKER_FADE = "kgs-fade 300ms ease-out 200ms both";

type LabelViewBox = { viewBox?: { x?: number; y?: number } };

/** Marker label right-aligned against its line, on its own row so the three never collide. */
function markerLabel(text: string, row: number, color: string) {
  return ({ viewBox }: LabelViewBox) => (
    <text
      x={(viewBox?.x ?? 0) - 6}
      y={(viewBox?.y ?? 0) + 12 + row * 16}
      textAnchor="end"
      fill={color}
      fontSize={11}
      fontWeight={600}
      style={{ animation: MARKER_FADE }}
    >
      {text}
    </text>
  );
}

type AreaShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type DotShapeProps = { cx?: number; cy?: number };

function ThresholdDot({ cx = 0, cy = 0 }: DotShapeProps) {
  return (
    <g style={{ animation: MARKER_FADE }}>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="none"
        stroke={K.red400}
        strokeWidth={2}
        className="kgs-ping"
      />
      <circle cx={cx} cy={cy} r={4} fill={K.red400} />
    </g>
  );
}

function LineageTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: Row }[];
}) {
  const L = useLabel();
  const row = payload?.[0]?.payload;
  if (!active || !row?.weekStart) return null;
  const segments = L(lineage.tooltipTemplate)
    .split(" · ")
    .filter((s) => row.r41 !== undefined || !s.includes("{rate41}"));
  const text = fill(segments.join(" · "), {
    weekStart: dayLabel(row.weekStart),
    rate41: row.r41?.toFixed(1) ?? "",
    contacts41: row.c41 ?? "",
    panels41: row.p41 !== undefined ? int(row.p41) : "",
    rate40: row.r40?.toFixed(1) ?? "",
    contacts40: row.c40 ?? "",
    panels40: row.p40 !== undefined ? int(row.p40) : "",
    rmaRate: row.rma?.toFixed(2) ?? "",
  });
  return (
    <div
      style={{
        background: K.elevated,
        border: `1px solid ${K.chipBorder}`,
        borderRadius: 8,
        padding: "8px 10px",
        maxWidth: 380,
        fontSize: 12,
        lineHeight: 1.5,
        color: K.textSec,
        fontFamily: K.mono,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </div>
  );
}

function LegendSwatch({
  color,
  dashed = false,
  label,
}: {
  color: string;
  dashed?: boolean;
  label: string;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        aria-hidden
        style={{
          width: 18,
          height: 0,
          borderTop: `${dashed ? 2 : 3}px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      {label}
    </span>
  );
}

/**
 * FirmwareLineageChart (03 §6.8, 04 §4.4): 4.0 line + ribbon, 4.1 line + gradient from W23, the
 * EST4 RMA rate flat on its own hidden axis, release / threshold / review markers, future zone,
 * "21 days earlier" bracket, and a synced "Panels on version" denominator band.
 */
export function FirmwareLineageChart() {
  const L = useLabel();
  const reduced = useReducedMotion();
  const rmaLabel = L(lineage.aggregate.label);
  const [rmaHead, rmaTail] = rmaLabel.split(" — ");

  return (
    <section
      aria-label={L(lineage.title)}
      style={{
        background: K.card,
        borderRadius: K.radius.card,
        padding: "14px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "6px 16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: K.text }}>
          {L(lineage.title)}
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12,
            color: K.body,
          }}
        >
          <LegendSwatch color={NEUTRAL_300} label={L(S40.label)} />
          <LegendSwatch color={K.orange} label={L(S41.label)} />
          <LegendSwatch color={NEUTRAL_500} dashed label={rmaLabel} />
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={ROWS} syncId="kgs-lineage" margin={PLOT_MARGIN}>
            <defs>
              <linearGradient id="kgs-lineage-41" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={K.orange} stopOpacity={0.3} />
                <stop offset="100%" stopColor={K.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              type="number"
              domain={X_DOMAIN}
              ticks={TICKS}
              tickFormatter={(w: number) => TICK_LABEL.get(w) ?? ""}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
              allowDataOverflow
            />
            <YAxis
              yAxisId="rate"
              domain={[0, Y_MAX]}
              width={Y_AXIS_WIDTH}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis yAxisId="rma" hide domain={RMA_DOMAIN} />
            <Tooltip
              content={<LineageTooltip />}
              cursor={{ stroke: K.borderLight, strokeWidth: 1.5 }}
              isAnimationActive={false}
            />

            <ReferenceArea
              yAxisId="rate"
              x1={lineage.futureWeeks[0] - 0.5}
              x2={X_DOMAIN[1]}
              fill="#ffffff"
              fillOpacity={0.03}
              stroke="none"
            />

            <Area
              yAxisId="rate"
              type="linear"
              dataKey="band40"
              stroke="none"
              fill={NEUTRAL_300}
              fillOpacity={0.2}
              isAnimationActive={!reduced}
              animationDuration={900}
              activeDot={false}
            />
            <Line
              yAxisId="rate"
              type="linear"
              dataKey="r40"
              name={L(S40.label)}
              stroke={NEUTRAL_300}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            <Area
              yAxisId="rate"
              type="linear"
              dataKey="r41"
              name={L(S41.label)}
              stroke={K.orange}
              strokeWidth={2.5}
              fill="url(#kgs-lineage-41)"
              fillOpacity={1}
              dot={false}
              connectNulls={false}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            <Line
              yAxisId="rma"
              type="linear"
              dataKey="rma"
              name={rmaLabel}
              stroke={NEUTRAL_500}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={!reduced}
              animationDuration={900}
            />

            {RELEASE ? (
              <ReferenceLine
                yAxisId="rate"
                x={RELEASE.week}
                stroke={K.violet400}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={markerLabel(L(RELEASE.label), 0, K.violet400)}
              />
            ) : null}
            {THRESHOLD ? (
              <ReferenceLine
                yAxisId="rate"
                x={THRESHOLD.week}
                stroke="transparent"
                label={markerLabel(L(THRESHOLD.label), 1, K.red400)}
              />
            ) : null}
            {REVIEW ? (
              <ReferenceLine
                yAxisId="rate"
                x={REVIEW.week}
                stroke={NEUTRAL_500}
                strokeWidth={2}
                strokeDasharray="2 4"
                label={markerLabel(L(REVIEW.label), 2, K.textMut)}
              />
            ) : null}
            <ReferenceArea
              yAxisId="rate"
              x1={lineage.annotation.fromWeek}
              x2={lineage.annotation.toWeek}
              y1={Y_MAX * 0.03}
              y2={Y_MAX * 0.06}
              shape={({
                x = 0,
                y = 0,
                width = 0,
                height = 0,
              }: AreaShapeProps) => (
                <g style={{ animation: MARKER_FADE }}>
                  <path
                    d={`M${x},${y + height} V${y} H${x + width} V${y + height}`}
                    fill="none"
                    stroke={K.textSec}
                    strokeWidth={1.5}
                  />
                  <text
                    x={x + width / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fill={K.textSec}
                    fontSize={12}
                    fontWeight={700}
                  >
                    {lineage.annotation.text}
                  </text>
                </g>
              )}
            />
            {THRESHOLD ? (
              <ReferenceDot
                yAxisId="rate"
                x={THRESHOLD.week}
                y={rate41At(THRESHOLD.week)}
                shape={ThresholdDot}
              />
            ) : null}
            <ReferenceDot
              yAxisId="rma"
              x={S40.points[S40.points.length - 1].week}
              y={lineage.aggregate.current}
              r={0}
              label={({ viewBox }: LabelViewBox) => {
                const x = (viewBox?.x ?? 0) + 6;
                const y = (viewBox?.y ?? 0) - 40;
                return (
                  <g style={{ animation: MARKER_FADE }}>
                    <rect
                      x={x}
                      y={y}
                      width={104}
                      height={34}
                      rx={8}
                      fill={K.elevated}
                      stroke={K.borderLight}
                    />
                    <text x={x + 8} y={y + 14} fill={K.textSec} fontSize={11}>
                      {rmaTail ? `${rmaHead} —` : rmaHead}
                    </text>
                    {rmaTail ? (
                      <text
                        x={x + 8}
                        y={y + 27}
                        fill={K.textSec}
                        fontSize={11}
                        fontWeight={700}
                      >
                        {rmaTail}
                      </text>
                    ) : null}
                  </g>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: Y_AXIS_WIDTH,
            fontSize: 11,
            color: K.textMut,
            lineHeight: 1.2,
            flexShrink: 0,
          }}
        >
          {lineage.denominatorLabel}
        </span>
        <div style={{ flex: 1, minWidth: 0, height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ROWS}
              syncId="kgs-lineage"
              margin={{ ...PLOT_MARGIN, top: 0, left: -8 }}
              barCategoryGap={2}
            >
              <XAxis
                dataKey="week"
                type="number"
                domain={X_DOMAIN}
                hide
                allowDataOverflow
              />
              <YAxis hide />
              <Bar
                dataKey="p40"
                stackId="p"
                fill={NEUTRAL_700}
                barSize={12}
                isAnimationActive={false}
              />
              <Bar
                dataKey="p41"
                stackId="p"
                fill={ORANGE_900}
                barSize={12}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
