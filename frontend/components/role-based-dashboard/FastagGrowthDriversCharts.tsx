"use client";

import { Fragment, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cohortColor, fmtCount, fmtPct } from "@/lib/fastag-growth-drivers/format";
import type { FastagDrillTokens } from "./fastag-drill-ui";

type OnboardingStage = { stage: string; count: number; dropPct: number };
type TrendPoint = { wk: string; rate: number };
type MethodMix = { method: string; pct: number };
type AutoStage = { stage: string; count: number };
type ParetoRow = { reason?: string; issue?: string; pct?: number; score?: number; cumPct: number };
type FailureRow = { reason: string; pct: number };
type JourneyStage = { stage: string; count: number; conversion: number };
type CohortRow = { cohort: string; values: readonly (number | null)[] };
type UsageSlice = { label: string; pct: number; color: "green" | "amber" | "red" };

const TOP_DROP_STAGES = new Set(["First Recharge", "Repeat Usage"]);

function tooltipStyle(t: FastagDrillTokens) {
  return { background: t.surface2, border: `1px solid ${t.border2}`, borderRadius: 8, fontSize: 11 };
}

function ChartShell({
  title,
  subtitle,
  height,
  children,
  t,
}: {
  title: string;
  subtitle?: string;
  height: number;
  children: ReactNode;
  t: FastagDrillTokens;
}) {
  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        borderRadius: 8,
        background: t.surface,
        padding: "8px 10px",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.4 }}>
        {title}
      </div>
      {subtitle ? <div style={{ fontSize: 10, color: t.dim, marginTop: 2, marginBottom: 6 }}>{subtitle}</div> : <div style={{ marginBottom: 6 }} />}
      <div style={{ height, flex: 1, minHeight: height }}>{children}</div>
    </div>
  );
}

function KpiRow({
  items,
  t,
  compact,
}: {
  items: { label: string; value: string; accent?: string }[];
  t: FastagDrillTokens;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: compact ? 6 : 10,
        marginBottom: compact ? 8 : 12,
      }}
    >
      {items.map((k) => (
        <div
          key={k.label}
          style={{
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            background: t.surface2,
            padding: compact ? "8px 10px" : "12px 14px",
          }}
        >
          <div style={{ fontSize: 9, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{k.label}</div>
          <div
            style={{
              fontSize: compact ? 14 : 18,
              fontWeight: 700,
              marginTop: 4,
              fontFamily: "var(--font-mono)",
              color: k.accent ?? t.text,
            }}
          >
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OnboardingFunnelChart({
  stages,
  tokens: t,
  compact = false,
}: {
  stages: readonly OnboardingStage[];
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  const max = stages[0]?.count ?? 1;
  const end = stages[stages.length - 1];
  const overallConv = end ? (end.count / max) * 100 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      <KpiRow
        compact={compact}
        t={t}
        items={[
          { label: "Started", value: fmtCount(max) },
          {
            label: "Repeat usage",
            value: fmtCount(end?.count ?? 0),
            accent: overallConv >= 45 ? t.green : t.orange,
          },
          {
            label: "End-to-end",
            value: fmtPct(overallConv),
            accent: overallConv >= 45 ? t.green : t.red,
          },
        ]}
      />
      <div style={{ display: "grid", gap: compact ? 6 : 8 }}>
        {stages.map((s) => {
          const w = (s.count / max) * 100;
          const isHot = TOP_DROP_STAGES.has(s.stage);
          const barColor = isHot ? t.red : s.dropPct > 11 ? t.orange : t.green;
          return (
            <div key={s.stage}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: isHot ? t.text : t.dim, fontWeight: isHot ? 600 : 400 }}>{s.stage}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: t.text }}>{fmtCount(s.count)}</span>
              </div>
              <div style={{ background: t.surface2, borderRadius: 6, height: compact ? 8 : 10, border: `1px solid ${t.border}` }}>
                <div style={{ width: `${w}%`, height: "100%", borderRadius: 6, background: barColor, transition: "width .2s" }} />
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: s.dropPct ? (s.dropPct >= 15 ? t.red : t.faint) : t.faint,
                  textAlign: "right",
                }}
              >
                {s.dropPct ? `−${s.dropPct}% step drop` : "Entry"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RechargeExperiencePanel({
  successTrend,
  methods,
  autoFunnel,
  failurePareto,
  tokens: t,
  compact = false,
}: {
  successTrend: readonly TrendPoint[];
  methods: readonly MethodMix[];
  autoFunnel: readonly AutoStage[];
  failurePareto: readonly ParetoRow[];
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  const latestSuccess = successTrend[successTrend.length - 1]?.rate ?? 0;
  const autoRate = autoFunnel[0] ? ((autoFunnel[2]?.count ?? 0) / autoFunnel[0].count) * 100 : 0;
  const topFail = failurePareto[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      <KpiRow
        compact={compact}
        t={t}
        items={[
          { label: "Success rate", value: `${latestSuccess.toFixed(1)}%`, accent: latestSuccess >= 92 ? t.green : t.orange },
          { label: "Auto-recharge active", value: fmtPct(autoRate), accent: autoRate >= 28 ? t.green : t.amber },
          { label: "Top failure", value: topFail?.reason ?? topFail?.issue ?? "—", accent: t.red },
        ]}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: compact ? 8 : 10,
        }}
      >
        <ChartShell title="Success trend" height={compact ? 100 : 140} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...successTrend]} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="wk" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
              <YAxis stroke={t.faint} domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={28} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v: number) => [`${v.toFixed(1)}%`, "Success"]} />
              <Line type="monotone" dataKey="rate" stroke={t.green} strokeWidth={2} dot={{ r: 2, fill: t.green }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Method mix" height={compact ? 100 : 140} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...methods]} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="method" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 8 }} interval={0} angle={-12} textAnchor="end" height={36} />
              <YAxis stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={24} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v: number) => [`${v}%`, "Share"]} />
              <Bar dataKey="pct" fill={t.amber} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Auto-recharge funnel" subtitle="Eligible → Active" height={compact ? 88 : 120} t={t}>
          <div style={{ display: "grid", gap: 6, height: "100%", alignContent: "center" }}>
            {autoFunnel.map((x, i) => {
              const max = autoFunnel[0].count;
              const w = (x.count / max) * 100;
              return (
                <div key={x.stage}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.dim }}>
                    <span>{x.stage}</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>{fmtCount(x.count)}</span>
                  </div>
                  <div style={{ marginTop: 4, background: t.surface2, borderRadius: 6, height: 8, border: `1px solid ${t.border}` }}>
                    <div
                      style={{
                        width: `${w}%`,
                        height: "100%",
                        borderRadius: 6,
                        background: i === 0 ? t.faint : i === 1 ? t.amber : t.green,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartShell>
        <ChartShell title="Failure Pareto" height={compact ? 100 : 140} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={[...failurePareto]} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="reason" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 8 }} interval={0} angle={-14} textAnchor="end" height={40} />
              <YAxis yAxisId="l" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={24} unit="%" />
              <YAxis yAxisId="r" orientation="right" domain={[0, 100]} stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={28} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} />
              <Bar yAxisId="l" dataKey="pct" fill={t.orange} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Line yAxisId="r" dataKey="cumPct" stroke={t.red} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </div>
  );
}

export function FirstUsePanel({
  successTrend,
  failures,
  journey,
  tokens: t,
  compact = false,
}: {
  successTrend: readonly TrendPoint[];
  failures: readonly FailureRow[];
  journey: readonly JourneyStage[];
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  const latest = successTrend[successTrend.length - 1]?.rate ?? 0;
  const topFail = failures[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 10 }}>
      <KpiRow
        compact={compact}
        t={t}
        items={[
          { label: "First-toll success", value: `${latest.toFixed(1)}%`, accent: latest >= 88 ? t.green : t.orange },
          { label: "Top blocker", value: topFail?.reason ?? "—", accent: t.red },
          { label: "Repeat from activated", value: fmtPct(journey[journey.length - 1]?.conversion ?? 0), accent: t.amber },
        ]}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: compact ? 8 : 10 }}>
        <ChartShell title="First-toll success" height={compact ? 100 : 130} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...successTrend]} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="wk" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
              <YAxis stroke={t.faint} domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={28} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v: number) => [`${v.toFixed(1)}%`, "Success"]} />
              <Line dataKey="rate" stroke={t.green} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Failure mix" height={compact ? 100 : 130} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...failures]} layout="vertical" margin={{ left: 4, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={t.border} horizontal={false} />
              <XAxis type="number" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} unit="%" />
              <YAxis type="category" dataKey="reason" stroke={t.faint} width={compact ? 72 : 96} tick={{ fontSize: 9, fill: t.dim }} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v: number) => [`${v}%`, "Share"]} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={12}>
                {failures.map((f) => (
                  <Cell key={f.reason} fill={f.pct >= 27 ? t.red : f.pct >= 12 ? t.orange : t.amber} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
      <div>
        <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", marginBottom: 6, textTransform: "uppercase" }}>
          Journey conversion
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${journey.length}, minmax(0, 1fr))`, gap: 6 }}>
          {journey.map((s) => (
            <div
              key={s.stage}
              style={{ border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 8px", background: t.surface2 }}
            >
              <div style={{ fontSize: 10, color: t.dim, lineHeight: 1.2 }}>{s.stage}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>{fmtCount(s.count)}</div>
              <div style={{ marginTop: 6, background: t.surface, borderRadius: 6, height: 6, border: `1px solid ${t.border}` }}>
                <div
                  style={{
                    width: `${s.conversion}%`,
                    height: "100%",
                    borderRadius: 6,
                    background: s.conversion >= 70 ? t.green : s.conversion >= 55 ? t.amber : t.red,
                  }}
                />
              </div>
              <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, color: t.faint }}>{fmtPct(s.conversion)} of start</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RetentionPanel({
  cohorts,
  repeatRecharge,
  repeatTxn,
  usage,
  tokens: t,
  compact = false,
  cohortHover,
  onCohortHover,
}: {
  cohorts: readonly CohortRow[];
  repeatRecharge: readonly { mo: string; rate: number }[];
  repeatTxn: readonly { mo: string; rate: number }[];
  usage: readonly UsageSlice[];
  tokens: FastagDrillTokens;
  compact?: boolean;
  cohortHover: { r: number; c: number } | null;
  onCohortHover: (v: { r: number; c: number } | null) => void;
}) {
  const monthLabels = ["M0", "M1", "M2", "M3", "M4", "M5"];
  const dormant = usage.find((u) => u.label.toLowerCase().includes("dormant"));

  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "1.15fr 0.85fr" : "1.2fr 0.8fr", gap: compact ? 8 : 12, alignItems: "stretch" }}>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, background: t.surface, padding: "8px 10px", minWidth: 0 }}>
        <div style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: 8 }}>
          Cohort retention (M0–M5)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "52px repeat(6, 1fr)", gap: 4 }}>
          <div />
          {monthLabels.map((m) => (
            <div key={m} style={{ textAlign: "center", color: t.faint, fontFamily: "var(--font-mono)", fontSize: 9 }}>
              {m}
            </div>
          ))}
          {cohorts.map((row, rowIdx) => (
            <Fragment key={row.cohort}>
              <div style={{ color: t.dim, fontFamily: "var(--font-mono)", fontSize: 10, display: "flex", alignItems: "center" }}>
                {row.cohort}
              </div>
              {row.values.map((v, colIdx) => (
                <div
                  key={`${row.cohort}-${colIdx}`}
                  onMouseEnter={() => onCohortHover({ r: rowIdx, c: colIdx })}
                  onMouseLeave={() => onCohortHover(null)}
                  style={{
                    height: compact ? 24 : 28,
                    borderRadius: 6,
                    border: `1px solid ${t.border}`,
                    background: cohortColor(v),
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: v === null ? t.faint : t.text,
                    outline: cohortHover?.r === rowIdx || cohortHover?.c === colIdx ? `1px solid ${t.border2}` : "none",
                  }}
                >
                  {v === null ? "—" : `${v}%`}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr auto", gap: compact ? 6 : 8, minWidth: 0 }}>
        <ChartShell title="Repeat recharge" height={compact ? 72 : 88} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...repeatRecharge]} margin={{ left: 0, right: 4, top: 2, bottom: 0 }}>
              <XAxis dataKey="mo" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
              <YAxis stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={24} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} />
              <Line dataKey="rate" stroke={t.amber} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Repeat transactions" height={compact ? 72 : 88} t={t}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...repeatTxn]} margin={{ left: 0, right: 4, top: 2, bottom: 0 }}>
              <XAxis dataKey="mo" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
              <YAxis stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} width={24} unit="%" />
              <Tooltip contentStyle={tooltipStyle(t)} />
              <Line dataKey="rate" stroke={t.green} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 10px", background: t.surface }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: t.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Usage composition</span>
            {dormant ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: t.red }}>{dormant.pct}% dormant</span>
            ) : null}
          </div>
          <div style={{ display: "flex", height: 14, borderRadius: 999, overflow: "hidden", border: `1px solid ${t.border}` }}>
            {usage.map((u) => (
              <div
                key={u.label}
                title={`${u.label} ${u.pct}%`}
                style={{
                  width: `${u.pct}%`,
                  background: u.color === "green" ? t.green : u.color === "amber" ? t.amber : t.red,
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 6, display: "grid", gap: 3 }}>
            {usage.map((u) => (
              <div key={u.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.dim }}>
                <span>{u.label}</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>{u.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrowthBlockerChart({
  pareto,
  tokens: t,
  compact = false,
}: {
  pareto: readonly { issue: string; score: number; cumPct: number }[];
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  const top = pareto[0];
  const chartH = compact ? 150 : 220;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      <KpiRow
        compact={compact}
        t={t}
        items={[
          { label: "#1 blocker", value: top?.issue ?? "—" },
          { label: "Impact score", value: top ? `${top.score}` : "—", accent: t.orange },
          { label: "Top-3 cumulative", value: pareto[2] ? `${pareto[2].cumPct}%` : "—", accent: t.red },
        ]}
      />
      <div style={{ height: chartH }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={[...pareto]} margin={{ left: 8, right: 12, top: 8, bottom: compact ? 4 : 8 }}>
            <CartesianGrid stroke={t.border} vertical={false} />
            <XAxis
              dataKey="issue"
              stroke={t.faint}
              tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
              interval={0}
              angle={compact ? -16 : -12}
              textAnchor="end"
              height={compact ? 44 : 52}
            />
            <YAxis yAxisId="l" stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
            <YAxis yAxisId="r" orientation="right" domain={[0, 100]} stroke={t.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} unit="%" />
            <Tooltip contentStyle={tooltipStyle(t)} />
            <ReferenceLine yAxisId="r" y={80} stroke={t.border2} strokeDasharray="4 4" />
            <Bar yAxisId="l" dataKey="score" fill={t.orange} radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Line yAxisId="r" dataKey="cumPct" stroke={t.red} strokeWidth={2} dot={{ r: 2, fill: t.red }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
