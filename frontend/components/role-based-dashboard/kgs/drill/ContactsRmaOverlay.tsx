"use client";

import { installedBase, meta } from "@kgs/lib/data";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { fill } from "../signal/format";
import { Panel } from "./Panel";

const CR = installedBase.contactsVsRma;
const P = installedBase.panelCopy["P-F"];
const DAY_MS = 86_400_000;
const TICK_EVERY = 4;

type Row = {
  week: number;
  base: number;
  fw41: number;
  trouble: number;
  rate: number;
};

/** Week position of a date, measured from the review marker (which carries both). */
function weekOf(iso: string): number {
  const anchor = CR.markers[0];
  if (!anchor) return 0;
  const days = (Date.parse(iso) - Date.parse(anchor.date)) / DAY_MS;
  return anchor.week + days / 7;
}

function OverlayTooltip({
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
  const [contactsLabel, rateLabel] = meta.ui.drill.rmaAxes;
  return (
    <div
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: K.textSec,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontFamily: K.mono, color: K.textMut }}>
        {fill(meta.ui.drill.week, { n: label })}
      </div>
      <div>
        {contactsLabel}:{" "}
        <span style={{ fontFamily: K.mono }}>{row.trouble}</span>
      </div>
      {row.fw41 > 0 ? (
        <div style={{ color: K.orange }}>
          {L(meta.ui.drill.fw41Segment)}:{" "}
          <span style={{ fontFamily: K.mono }}>{row.fw41}</span>
        </div>
      ) : null}
      <div>
        {rateLabel}: <span style={{ fontFamily: K.mono }}>{row.rate}</span>
      </div>
    </div>
  );
}

/**
 * ContactsRmaOverlay (04 §3.8): weekly trouble contacts with the fw 4.1 share as an orange
 * top segment, the RMA rate on a second axis under its dashed limit, and a ghost zone up to the
 * next monthly review. Both axes are labelled in words.
 */
export function ContactsRmaOverlay() {
  const L = useLabel();
  const [rows] = useState<Row[]>(() =>
    CR.trouble.map((t, i) => ({
      week: i + 1,
      base: t - (CR.fw41[i] ?? 0),
      fw41: CR.fw41[i] ?? 0,
      trouble: t,
      rate: CR.rmaRate[i] ?? 0,
    })),
  );
  const lastWeek = rows.length;
  const ghostEnd = weekOf(CR.ghostUntil);
  const limitText =
    installedBase.kpis.find((k) => k.sub?.startsWith("limit"))?.sub ?? "";
  const [contactsLabel, rateLabel] = meta.ui.drill.rmaAxes;
  const ticks = rows
    .map((r) => r.week)
    .filter((w) => w === 1 || w % TICK_EVERY === 0 || w === lastWeek);
  const legend = [
    { key: "c", label: contactsLabel, colour: "#737373", bar: true },
    {
      key: "f",
      label: L(meta.ui.drill.fw41Segment),
      colour: K.orange,
      bar: true,
    },
    { key: "r", label: L(CR.lineLabel), colour: K.green, bar: false },
    { key: "l", label: limitText, colour: K.textMut, bar: false, dashed: true },
  ];

  return (
    <Panel title={L(P.title)} sub={L(P.unit ?? "")}>
      <div role="img" aria-label={L(P.title)} style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rows}
            margin={{ top: 30, right: 4, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              stroke="#333"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              type="number"
              domain={[0.5, ghostEnd]}
              ticks={ticks}
              tickFormatter={(w: number) => fill(meta.ui.drill.week, { n: w })}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="contacts"
              width={44}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
              label={{
                value: contactsLabel,
                angle: -90,
                position: "insideLeft",
                fill: K.textMut,
                fontSize: 10,
                dy: 60,
              }}
            />
            <YAxis
              yAxisId="rate"
              orientation="right"
              width={44}
              domain={[0, Math.max(CR.limit, ...CR.rmaRate) * 1.4]}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={false}
              tickLine={false}
              label={{
                value: rateLabel,
                angle: 90,
                position: "insideRight",
                fill: K.textMut,
                fontSize: 10,
                dy: -70,
              }}
            />
            <ReferenceArea
              yAxisId="contacts"
              x1={lastWeek + 0.5}
              x2={ghostEnd}
              fill="#ffffff"
              fillOpacity={0.04}
              strokeOpacity={0}
            />
            {CR.markers.map((m) => (
              <ReferenceLine
                key={m.label}
                yAxisId="contacts"
                x={m.week}
                stroke={K.textMut}
                strokeDasharray="2 4"
                label={{
                  value: L(m.label),
                  position: "insideTopRight",
                  fill: K.textMut,
                  fontSize: 11,
                  offset: -22,
                }}
              />
            ))}
            <ReferenceLine
              yAxisId="rate"
              y={CR.limit}
              stroke={K.textMut}
              strokeDasharray="4 4"
            />
            <Tooltip
              content={<OverlayTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              isAnimationActive={false}
            />
            <Bar
              yAxisId="contacts"
              dataKey="base"
              stackId="c"
              fill="#737373"
              fillOpacity={0.55}
              barSize={7}
              animationDuration={900}
            />
            <Bar
              yAxisId="contacts"
              dataKey="fw41"
              stackId="c"
              fill={K.orange}
              barSize={7}
              animationDuration={900}
            />
            <Line
              yAxisId="rate"
              dataKey="rate"
              type="linear"
              stroke={K.green}
              strokeWidth={2}
              dot={false}
              animationDuration={900}
            />
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
        {legend.map((l) => (
          <li
            key={l.key}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              aria-hidden
              style={
                l.bar
                  ? {
                      width: 8,
                      height: 10,
                      borderRadius: 1,
                      background: l.colour,
                    }
                  : {
                      width: 14,
                      height: 0,
                      borderTop: `2px ${l.dashed ? "dashed" : "solid"} ${l.colour}`,
                    }
              }
            />
            {l.label}
          </li>
        ))}
      </ul>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
        {L(CR.caption)}
      </p>
    </Panel>
  );
}
