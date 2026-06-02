"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WaterfallStep } from "@/lib/fastag-business-performance/data";
import type { FastagDrillTokens } from "./fastag-drill-ui";

type MetricKey = "base" | "volume" | "value" | "revenue";

type MovementProps = {
  steps: WaterfallStep[];
  metric: MetricKey;
  format: (v: number) => string;
  tokens: FastagDrillTokens;
  compact?: boolean;
};

type LeakageProps = {
  steps: WaterfallStep[];
  opportunities: readonly {
    area: string;
    impact: string;
    affected: string;
    priority: string;
    action: string;
  }[];
  tokens: FastagDrillTokens;
  compact?: boolean;
};

function parseImpactL(impact: string): number {
  const m = impact.match(/([\d.]+)/);
  return m ? Number.parseFloat(m[1]) : 0;
}

function formatSigned(metric: MetricKey, delta: number, format: (v: number) => string): string {
  const abs = format(Math.abs(delta));
  return delta >= 0 ? `+${abs}` : `−${abs}`;
}

export function MovementDecompositionChart({ steps, metric, format, tokens: t, compact = false }: MovementProps) {
  const { opening, closing, levers, netDelta } = useMemo(() => {
    const openingStep = steps.find((s) => s.l === "Opening" && s.t === "total");
    const closingStep = steps.find((s) => s.l === "Current" && s.t === "total");
    const leverSteps = steps.filter((s) => s.t === "inc" || s.t === "dec");
    const openVal = openingStep?.t === "total" ? openingStep.value : 0;
    const closeVal = closingStep?.t === "total" ? closingStep.value : 0;
    return {
      opening: openVal,
      closing: closeVal,
      netDelta: closeVal - openVal,
      levers: leverSteps.map((s) => {
        const delta = s.t === "inc" || s.t === "dec" ? s.delta : 0;
        return {
          name: s.l,
          value: s.t === "inc" ? delta : -delta,
          type: s.t as "inc" | "dec",
        };
      }),
    };
  }, [steps]);

  const xMax = useMemo(() => Math.max(...levers.map((l) => Math.abs(l.value)), 1) * 1.15, [levers]);

  const leverHeight = compact ? Math.max(108, levers.length * 26) : Math.max(200, levers.length * 44);
  const kpiPad = compact ? "8px 10px" : "12px 14px";
  const kpiFont = compact ? 16 : 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: compact ? 6 : 10,
        }}
      >
        <div style={{ border: `1px solid ${t.border}`, borderRadius: compact ? 8 : 12, background: t.surface2, padding: kpiPad }}>
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Opening
          </div>
          <div style={{ fontSize: kpiFont, fontWeight: 700, marginTop: compact ? 4 : 6, fontFamily: "var(--font-mono)", color: t.text }}>
            {format(opening)}
          </div>
        </div>
        <div
          style={{
            border: `1px solid ${netDelta >= 0 ? t.green : t.red}55`,
            borderRadius: compact ? 8 : 12,
            background: netDelta >= 0 ? "rgba(45,212,167,.08)" : "rgba(255,59,70,.08)",
            padding: kpiPad,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Net change</div>
          <div
            style={{
              fontSize: kpiFont,
              fontWeight: 700,
              marginTop: compact ? 4 : 6,
              fontFamily: "var(--font-mono)",
              color: netDelta >= 0 ? t.green : t.red,
            }}
          >
            {formatSigned(metric, netDelta, format)}
          </div>
        </div>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: compact ? 8 : 12, background: t.surface2, padding: kpiPad }}>
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Current
          </div>
          <div style={{ fontSize: kpiFont, fontWeight: 700, marginTop: compact ? 4 : 6, fontFamily: "var(--font-mono)", color: t.text }}>
            {format(closing)}
          </div>
        </div>
      </div>

      <div>
        {!compact ? (
          <div style={{ color: t.faint, fontSize: 11, fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Lever contribution · green = uplift · orange = drag
          </div>
        ) : null}
        <div style={{ height: leverHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={levers} margin={{ left: 8, right: 24, top: 4, bottom: 4 }} barCategoryGap="18%">
              <CartesianGrid stroke={t.border} horizontal={false} />
              <XAxis
                type="number"
                domain={[-xMax, xMax]}
                stroke={t.faint}
                tick={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                tickFormatter={(v) => format(Math.abs(Number(v)))}
              />
              <YAxis type="category" dataKey="name" width={118} stroke={t.faint} tick={{ fontSize: 11, fill: t.dim }} />
              <Tooltip
                contentStyle={{ background: t.surface2, border: `1px solid ${t.border2}`, borderRadius: 10 }}
                formatter={(v: number) => [formatSigned(metric, v, format), "Impact"]}
              />
              <ReferenceLine x={0} stroke={t.border2} strokeWidth={2} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {levers.map((row) => (
                  <Cell key={row.name} fill={row.value >= 0 ? t.green : t.orange} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function LeakageParetoChart({ steps, opportunities, tokens: t, compact = false }: LeakageProps) {
  const { expected, actual, gap, pareto } = useMemo(() => {
    const expectedStep = steps.find((s) => s.l === "Expected Revenue");
    const actualStep = steps.find((s) => s.l === "Actual Revenue");
    const exp = expectedStep?.t === "total" ? expectedStep.value : 0;
    const act = actualStep?.t === "total" ? actualStep.value : 0;

    const sorted = [...opportunities]
      .map((o) => ({ name: o.area, impactL: parseImpactL(o.impact), priority: o.priority }))
      .sort((a, b) => b.impactL - a.impactL);
    const total = sorted.reduce((s, r) => s + r.impactL, 0) || 1;
    let running = 0;
    const paretoRows = sorted.map((row) => {
      running += row.impactL;
      return { ...row, cumPct: Math.round((running / total) * 100) };
    });

    return { expected: exp, actual: act, gap: exp - act, pareto: paretoRows };
  }, [steps, opportunities]);

  const chartH = compact ? 150 : 280;
  const kpiPad = compact ? "8px 10px" : "12px 14px";
  const kpiFont = compact ? 16 : 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: compact ? 6 : 10,
        }}
      >
        <div style={{ border: `1px solid ${t.border}`, borderRadius: compact ? 8 : 12, background: t.surface2, padding: kpiPad }}>
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Expected revenue</div>
          <div style={{ fontSize: kpiFont, fontWeight: 700, marginTop: compact ? 4 : 6, fontFamily: "var(--font-mono)", color: t.text }}>INR {expected}L</div>
        </div>
        <div
          style={{
            border: `1px solid ${t.red}55`,
            borderRadius: compact ? 8 : 12,
            background: "rgba(255,59,70,.08)",
            padding: kpiPad,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Revenue gap</div>
          <div style={{ fontSize: kpiFont, fontWeight: 700, marginTop: compact ? 4 : 6, fontFamily: "var(--font-mono)", color: t.red }}>INR {gap}L</div>
        </div>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: compact ? 8 : 12, background: t.surface2, padding: kpiPad }}>
          <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Actual revenue</div>
          <div style={{ fontSize: kpiFont, fontWeight: 700, marginTop: compact ? 4 : 6, fontFamily: "var(--font-mono)", color: t.text }}>INR {actual}L</div>
        </div>
      </div>

      <div>
        {!compact ? (
          <div style={{ color: t.faint, fontSize: 11, fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Leakage Pareto · bars = INR impact · line = cumulative %
          </div>
        ) : null}
        <div style={{ height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pareto} margin={{ left: 8, right: 12, top: 8, bottom: compact ? 4 : 8 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="name" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} interval={0} angle={compact ? -18 : -12} textAnchor="end" height={compact ? 48 : 56} />
              <YAxis yAxisId="left" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 10 }} unit="L" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ background: t.surface2, border: `1px solid ${t.border2}`, borderRadius: 10 }}
                formatter={(v: number, name: string) =>
                  name === "cumPct" ? [`${v}%`, "Cumulative"] : [`INR ${v}L`, "Impact"]
                }
              />
              <Bar yAxisId="left" dataKey="impactL" name="impactL" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {pareto.map((row) => (
                  <Cell
                    key={row.name}
                    fill={row.priority === "CRITICAL" ? t.red : row.priority === "HIGH" ? t.orange : t.amber}
                  />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumPct" name="cumPct" stroke={t.green} strokeWidth={2} dot={{ r: 3, fill: t.green }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
