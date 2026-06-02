"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getBusinessPerformanceForPeriod } from "@/lib/fastag-business-performance/period-data";
import { fmtCr, fmtL, fmtTags } from "@/lib/fastag-business-performance/format";
import { FASTAG_STATE_MAP_DATA, STATE_MAP_BY_CODE } from "@/lib/fastag-business-performance/state-map-data";
import { getPeriodFactors, scaleCr } from "@/lib/fastag-period/scales";
import {
  FastagDrillCanvas,
  FastagDrillInsight,
  FastagDrillSection,
  useFastagDrillTokens,
} from "./fastag-drill-ui";
import { FastagAcquisitionChannelPie } from "./FastagAcquisitionChannelPie";
import { LeakageParetoChart, MovementDecompositionChart } from "./FastagBusinessPerformanceCharts";
import { FastagIndiaStateFilter } from "./FastagIndiaStateFilter";
import { useFastagPeriod } from "./FastagPeriodContext";

type MetricKey = "base" | "volume" | "value" | "revenue";

function metricFormat(key: MetricKey, v: number): string {
  if (key === "base") return fmtTags(v);
  if (key === "volume") return `${v.toFixed(1)}M`;
  if (key === "value") return fmtCr(v);
  return fmtL(v);
}

const BAND_RANK: Record<string, number> = { critical: 0, high: 1, med: 2, low: 3, none: 4 };

const DENSE = true;

export function FastagBusinessPerformanceDrill() {
  const token = useFastagDrillTokens();
  const { period } = useFastagPeriod();
  const bp = useMemo(() => getBusinessPerformanceForPeriod(period), [period]);
  const { waterfall, cashFlow, acquisitionChannels, zones, leakage } = bp;
  const [metric, setMetric] = useState<MetricKey>("base");
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const periodFactors = useMemo(() => getPeriodFactors(period), [period]);
  const visibleStates = useMemo(() => {
    const scaled = FASTAG_STATE_MAP_DATA.map((s) => ({
      ...s,
      txnValueCr: scaleCr(s.txnValueCr, periodFactors.money),
      profitCr: scaleCr(s.profitCr, periodFactors.money),
      lossCr: scaleCr(s.lossCr, periodFactors.money),
    }));
    const sorted = [...scaled].sort((a, b) => BAND_RANK[a.band] - BAND_RANK[b.band] || b.txnValueCr - a.txnValueCr);
    return selectedStateCode ? sorted.filter((s) => s.code === selectedStateCode) : sorted.slice(0, 6);
  }, [selectedStateCode, periodFactors.money]);
  const wfMetric = waterfall[metric];
  const cashTrendMax = useMemo(
    () => Math.max(...cashFlow.weeklyTrend.flatMap((w) => [w.inCr, w.outCr])) * 1.1,
    [cashFlow.weeklyTrend],
  );

  return (
    <FastagDrillCanvas tokens={token} compact={DENSE}>
      <div className="fastag-bp-two-screen">
        {/* —— Screen 1: movement + cash + acquisition —— */}
        <div className="fastag-bp-screen-row">
          <FastagDrillSection
            compact={DENSE}
            index="01"
            title="Movement Decomposition"
            question="Which levers moved headline performance?"
            tokens={token}
          >
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              {(Object.keys(waterfall) as MetricKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMetric(k)}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${metric === k ? token.red : token.border2}`,
                    background: metric === k ? "rgba(255,59,70,.16)" : token.surface,
                    color: metric === k ? token.text : token.dim,
                    padding: "5px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  {waterfall[k].label}
                </button>
              ))}
            </div>
            <MovementDecompositionChart
              compact={DENSE}
              steps={wfMetric.steps}
              metric={metric}
              format={(v) => metricFormat(metric, v)}
              tokens={token}
            />
          </FastagDrillSection>

          <FastagDrillSection
            compact={DENSE}
            index="02"
            title="Cash In & Out"
            question="Wallet float in vs out"
            tokens={token}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {[
                { label: "Opening", value: fmtCr(cashFlow.kpis.openingFloatCr) },
                { label: "Cash in", value: fmtCr(cashFlow.kpis.cashInCr), accent: token.green },
                { label: "Cash out", value: fmtCr(cashFlow.kpis.cashOutCr), accent: token.orange },
                {
                  label: "Closing",
                  value: fmtCr(cashFlow.kpis.closingFloatCr),
                  accent: cashFlow.kpis.netFloatCr < 0 ? token.red : token.green,
                },
              ].map((k) => (
                <div
                  key={k.label}
                  style={{
                    border: `1px solid ${token.border}`,
                    borderRadius: 8,
                    background: token.surface,
                    padding: "8px 10px",
                  }}
                >
                  <div style={{ fontSize: 9, color: token.faint, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: "var(--font-mono)", color: k.accent ?? token.text }}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: token.dim, marginBottom: 6 }}>
              Recharge {cashFlow.kpis.rechargeSuccessPct}% · Float cover {cashFlow.kpis.avgFloatDays}d
              <span style={{ color: token.faint }}> · {cashFlow.weeklyTrendCaption}</span>
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...cashFlow.weeklyTrend]} margin={{ left: 4, right: 8, top: 4, bottom: 0 }} barGap={3}>
                  <CartesianGrid stroke={token.border} vertical={false} />
                  <XAxis dataKey="label" stroke={token.faint} tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }} />
                  <YAxis
                    stroke={token.faint}
                    domain={[0, cashTrendMax]}
                    tick={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                    tickFormatter={(v: number) => `${Math.round(Number(v))}`}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{ background: token.surface2, border: `1px solid ${token.border2}`, borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number, name: string) => [fmtCr(v), name === "inCr" ? "In" : "Out"]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} formatter={(v) => (v === "inCr" ? "In" : "Out")} />
                  <Bar dataKey="inCr" name="inCr" fill={token.green} radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="outCr" name="outCr" fill={token.orange} radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FastagDrillSection>
        </div>

        <div className="fastag-bp-screen-row">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            <FastagDrillSection
              compact={DENSE}
              index="03"
              title="Customer Acquisition Paths"
              question="Digital · Physical · Assisted"
              tokens={token}
            >
              <FastagAcquisitionChannelPie tokens={token} acquisition={acquisitionChannels} compact={DENSE} />
            </FastagDrillSection>

            <FastagDrillSection
              compact={DENSE}
              index="04"
              title="Leakage and Action Priorities"
              question="Where to fix first for ROI"
              tokens={token}
            >
              <LeakageParetoChart compact={DENSE} steps={leakage.steps} opportunities={leakage.opportunities} tokens={token} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                {leakage.opportunities.map((o) => (
                  <div
                    key={o.area}
                    style={{
                      border: `1px solid ${token.border}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      background: token.surface,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{o.area}</span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: o.priority === "CRITICAL" ? "rgba(255,59,70,.2)" : "rgba(255,176,32,.2)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {o.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: token.red, fontFamily: "var(--font-mono)", marginTop: 4 }}>{o.impact}</div>
                    <div style={{ fontSize: 10, color: token.faint, marginTop: 4 }}>{o.action}</div>
                  </div>
                ))}
              </div>
            </FastagDrillSection>
          </div>

          <FastagDrillSection
            compact={DENSE}
            index="05"
            title="Regional Performance"
            question="State-wise RTO / VRN"
            tokens={token}
          >
            <FastagIndiaStateFilter
              tokens={token}
              selectedStateCode={selectedStateCode}
              onSelectState={setSelectedStateCode}
              compact
            />
            <div className="fastag-bp-scroll-y" style={{ marginTop: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["State", "Txn", "Profit", "Loss", "Dormancy", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: h === "State" || h === "Status" ? "left" : "right",
                          color: token.faint,
                          fontSize: 10,
                          fontFamily: "var(--font-mono)",
                          paddingBottom: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleStates.map((s) => (
                    <tr key={s.code} onClick={() => setSelectedStateCode(s.code)} style={{ cursor: "pointer" }}>
                      <td style={{ padding: "6px 0", fontSize: 11, minWidth: 88 }}>{s.name}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11 }}>{fmtCr(s.txnValueCr)}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11, color: token.green }}>
                        {fmtCr(s.profitCr)}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11, color: token.orange }}>
                        {fmtCr(s.lossCr)}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11 }}>{s.dormancyPct}%</td>
                      <td style={{ color: token.dim, fontSize: 10 }}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!selectedStateCode ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {zones.map((z) => (
                  <span
                    key={z.name}
                    style={{
                      fontSize: 10,
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: `1px solid ${token.border}`,
                      fontFamily: "var(--font-mono)",
                      color: token.dim,
                    }}
                  >
                    {z.name} {fmtCr(z.txnValueCr)}
                  </span>
                ))}
              </div>
            ) : null}
          </FastagDrillSection>
        </div>
      </div>

      <FastagDrillInsight
        compact={DENSE}
        tokens={token}
        text={`${wfMetric.read} · ${cashFlow.read.split(".")[0]}. · Top leakage: fleet inactivity & dormant tags — act on Pareto priorities first.`}
      />
    </FastagDrillCanvas>
  );
}
