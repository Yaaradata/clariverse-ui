"use client";

import type { StackedBar } from "@kgs/types";
import { type ReactNode, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { DetailPanel } from "./DetailPanel";

/** Stack colours by position; the first stack is the one the signal sits in. */
const STACK_COLOURS = [
  K.orange,
  K.violet400,
  K.sky,
  K.teal,
  K.slate,
  "#737373",
];

type Row = Record<string, number | string>;

function StackTooltip({
  active,
  payload,
  label,
  stacks,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number }[];
  label?: string;
  stacks: string[];
}) {
  const L = useLabel();
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: K.textSec,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>
        {label ? L(label) : null}
      </div>
      {payload.map((p) => {
        const i = Number(String(p.dataKey).slice(1));
        return (
          <div
            key={String(p.dataKey)}
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: STACK_COLOURS[i % STACK_COLOURS.length] }}>
              {stacks[i]}
            </span>
            <span style={{ fontFamily: K.mono }}>{p.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * StackedBarWithDetailPanel (03 §3C): bars stacked by segment with the legend in a bordered
 * box, and the DetailPanel for the selected bar beside the chart. Static on `defaultOpen`
 * unless `interactive` (P1): then a bar click selects it and × closes the panel.
 */
export function StackedBarWithDetailPanel({
  data,
  ariaLabel,
  unit,
  controls,
  detailFooter,
  interactive = false,
}: {
  data: StackedBar;
  ariaLabel: string;
  unit?: string;
  controls?: ReactNode;
  detailFooter?: string;
  interactive?: boolean;
}) {
  const L = useLabel();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(data.defaultOpen);
  const [rows] = useState<Row[]>(() =>
    data.bars.map((b) => {
      const r: Row = { key: b.key, label: b.label };
      b.values.forEach((v, i) => {
        r[`s${i}`] = v;
      });
      return r;
    }),
  );
  const stacks = data.stacks.map((s) => L(s));
  const detail = data.details.find((d) => d.key === selected);
  const select = (index: number) => {
    if (interactive) setSelected(data.bars[index]?.key ?? null);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: detail
          ? "minmax(0, 1.5fr) minmax(300px, 1fr)"
          : "minmax(0, 1fr)",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {controls}
        <div role="img" aria-label={ariaLabel} style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid
                stroke="#333"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                interval={0}
                tickFormatter={(v: string) => L(v)}
                tick={{ fill: K.textMut, fontSize: 11 }}
                axisLine={{ stroke: K.borderLight }}
                tickLine={false}
              />
              <YAxis
                width={40}
                tick={{ fill: K.textMut, fontSize: 12, fontFamily: K.mono }}
                axisLine={false}
                tickLine={false}
                label={
                  unit
                    ? {
                        value: L(unit),
                        angle: -90,
                        position: "insideLeft",
                        fill: K.textMut,
                        fontSize: 11,
                        dy: 50,
                      }
                    : undefined
                }
              />
              <Tooltip
                content={<StackTooltip stacks={stacks} />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                isAnimationActive={false}
              />
              {data.stacks.map((s, i) => (
                <Bar
                  key={s}
                  dataKey={`s${i}`}
                  stackId="a"
                  fill={STACK_COLOURS[i % STACK_COLOURS.length]}
                  fillOpacity={i === 0 ? 1 : 0.7}
                  isAnimationActive={!reduced}
                  animationDuration={900}
                  onClick={(_, index) => select(index)}
                  style={interactive ? { cursor: "pointer" } : undefined}
                >
                  {rows.map((r) => (
                    <Cell
                      key={String(r.key)}
                      stroke={r.key === selected ? "#fff" : undefined}
                      strokeWidth={r.key === selected ? 2 : 0}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul
          style={{
            margin: 0,
            padding: "8px 12px",
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 14px",
            fontSize: 12,
            color: K.body,
            border: `1px solid ${K.border}`,
            borderRadius: K.radius.chip,
          }}
        >
          {stacks.map((s, i) => (
            <li
              key={data.stacks[i]}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: STACK_COLOURS[i % STACK_COLOURS.length],
                  opacity: i === 0 ? 1 : 0.7,
                }}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>
      {detail ? (
        <DetailPanel
          key={detail.key}
          detail={detail}
          footer={detailFooter}
          onClose={interactive ? () => setSelected(null) : undefined}
        />
      ) : null}
    </div>
  );
}
