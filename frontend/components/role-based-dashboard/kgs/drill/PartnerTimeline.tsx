"use client";

import { channel, meta } from "@kgs/lib/data";
import type { ChartMarker } from "@kgs/types";
import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { axisWords, fill } from "../signal/format";
import { Panel } from "./Panel";

const PT = channel.partnerTimeline;
const P = channel.panelCopy["C-C"];
const TICK_EVERY = 4;

const MARKER_STROKE: Record<ChartMarker["style"], string> = {
  release: K.violet400,
  threshold: K.amber,
  review: K.textMut,
  cutover: K.textMut,
  event: K.slate,
};

type Row = {
  week: number;
  friction: number;
  baseline: number;
  sellIn: number;
  sellInLY: number;
};

const SERIES = [
  { key: "friction", colour: K.orange, dashed: false, band: false },
  { key: "baseline", colour: K.slate, dashed: false, band: true },
  { key: "sellIn", colour: K.teal, dashed: false, band: false },
  { key: "sellInLY", colour: K.teal, dashed: true, band: false },
] as const;

function TimelineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload?: Row }[];
  label?: number;
}) {
  const L = useLabel();
  const row = payload?.[0]?.payload;
  if (!active || !row || label === undefined) return null;
  const pin = PT.pins.find((p) => p.week === label);
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
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontFamily: K.mono, color: K.textMut }}>
        {fill(meta.ui.drill.week, { n: label })}
      </div>
      {SERIES.map((s, i) => (
        <div
          key={s.key}
          style={{ display: "flex", gap: 10, justifyContent: "space-between" }}
        >
          <span style={{ color: s.colour }}>
            {L(meta.ui.drill.partnerLegend[i] ?? "")}
          </span>
          <span style={{ fontFamily: K.mono }}>{row[s.key]}</span>
        </div>
      ))}
      {pin ? (
        <div style={{ marginTop: 4, color: K.body, fontStyle: "italic" }}>
          “{L(pin.text)}”
        </div>
      ) : null}
    </div>
  );
}

/**
 * PartnerTimeline (04 §5.1 C-C, LineMonitor fork): the partner's weekly interactions over its
 * own baseline band on the left axis; sell-in against last year (dashed) on the right axis.
 * Evidence pins sit on the friction line; hovering a week shows the pinned interaction.
 */
export function PartnerTimeline() {
  const L = useLabel();
  const reduced = useReducedMotion();
  const [rows] = useState<Row[]>(() =>
    PT.friction.map((f, i) => ({
      week: i + 1,
      friction: f,
      baseline: PT.baseline[i] ?? 0,
      sellIn: PT.sellIn[i] ?? 0,
      sellInLY: PT.sellInLY[i] ?? 0,
    })),
  );
  const lastWeek = rows.length;
  const [frictionAxis, sellInAxis] = axisWords(L(P.unit ?? ""));
  const ticks = rows
    .map((r) => r.week)
    .filter((w) => w === 1 || w % TICK_EVERY === 0 || w === lastWeek);

  return (
    <Panel title={L(P.title)} sub={L(P.sub ?? "")}>
      <div role="img" aria-label={L(P.title)} style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rows}
            margin={{ top: 44, right: 4, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              stroke="#333"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              type="number"
              domain={[0.5, lastWeek + 0.5]}
              ticks={ticks}
              tickFormatter={(w: number) => fill(meta.ui.drill.week, { n: w })}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="friction"
              width={44}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              label={{
                value: frictionAxis,
                angle: -90,
                position: "insideLeft",
                fill: K.textMut,
                fontSize: 10,
                dy: 50,
              }}
            />
            <YAxis
              yAxisId="sellIn"
              orientation="right"
              width={44}
              domain={[0, "auto"]}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
              label={{
                value: sellInAxis,
                angle: 90,
                position: "insideRight",
                fill: K.textMut,
                fontSize: 10,
                dy: -90,
              }}
            />
            {PT.markers.map((m, i) => (
              <ReferenceLine
                key={m.label}
                yAxisId="friction"
                x={m.week}
                stroke={MARKER_STROKE[m.style]}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: L(m.label),
                  position: "top",
                  fill: MARKER_STROKE[m.style],
                  fontSize: 11,
                  offset: 6 + (i % 3) * 13,
                }}
              />
            ))}
            <Tooltip
              content={<TimelineTooltip />}
              cursor={{ stroke: K.borderLight, strokeWidth: 1.5 }}
              isAnimationActive={false}
            />
            <Area
              yAxisId="friction"
              dataKey="baseline"
              type="linear"
              stroke={K.slate}
              strokeOpacity={0.6}
              fill={K.slate}
              fillOpacity={0.18}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            <Line
              yAxisId="sellIn"
              dataKey="sellInLY"
              type="linear"
              stroke={K.teal}
              strokeOpacity={0.6}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            <Line
              yAxisId="sellIn"
              dataKey="sellIn"
              type="linear"
              stroke={K.teal}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            <Line
              yAxisId="friction"
              dataKey="friction"
              type="linear"
              stroke={K.orange}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={!reduced}
              animationDuration={900}
            />
            {PT.pins.map((p) => (
              <ReferenceDot
                key={p.week}
                yAxisId="friction"
                x={p.week}
                y={PT.friction[p.week - 1] ?? 0}
                r={5}
                fill={K.violet400}
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}
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
          gap: "6px 14px",
          fontSize: 12,
          color: K.body,
        }}
      >
        {SERIES.map((s, i) => (
          <li
            key={s.key}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              aria-hidden
              style={
                s.band
                  ? {
                      width: 14,
                      height: 8,
                      borderRadius: 1,
                      background: s.colour,
                      opacity: 0.4,
                    }
                  : {
                      width: 14,
                      height: 0,
                      borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.colour}`,
                    }
              }
            />
            {L(meta.ui.drill.partnerLegend[i] ?? "")}
          </li>
        ))}
      </ul>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
        {L(PT.caption)}
      </p>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: K.text,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {L(PT.valueLine)}
        <IllustrativeChip />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <ConfidenceMarker short={PT.confidenceShort} compact />
        <GateChip text={L(PT.gate)} status="awaiting" wrap />
      </div>
    </Panel>
  );
}
