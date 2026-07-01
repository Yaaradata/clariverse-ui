"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CONTRIBUTION_TREND,
  COMPLAINT_THEMES,
  GAP_DRIVERS,
  GAP_DRIVER_BREAKDOWN,
  GAP_TOTAL_LAKHS,
  PNL_BRIDGE,
  PIM_CORRECTION_STEPS,
  RETURN_CAUSE_CHART,
  RETURN_RATE_TREND,
  SELLER_TRUST_TREND,
  SUBCATEGORY_PERFORMANCE,
} from "../../lib/categoryDetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";
import { ChartPanel } from "../common/ChartPanel";
import { CHART_INNER_HEIGHT, CHART_PANEL_HEIGHT } from "../common/detailLayout";

const tip = {
  contentStyle: {
    background: "#141414",
    border: "1px solid #262626",
    borderRadius: 8,
    fontSize: 12,
    color: "#FAFAFA",
  },
  labelStyle: { color: "#A3A3A3" },
};

const PLAN_COLOR = "#4FD17A";
const ACTUAL_COLOR = "#8B7CF6";
const SHORTFALL_COLOR = "#F0606B";

type ContributionChartPoint = {
  week: string;
  actual: number;
  plan: number;
  shortfall: [number, number];
  gapLakh: number;
};

const contributionChartData: ContributionChartPoint[] = CONTRIBUTION_TREND.map((d) => ({
  ...d,
  shortfall: [d.actual, d.plan],
  gapLakh: Math.round((d.plan - d.actual) * 100),
}));

const nowContribution = contributionChartData[contributionChartData.length - 1]!;

function formatCr(value: number): string {
  return `₹${value.toFixed(2)} Cr`;
}

function formatGapLakh(lakh: number): string {
  return lakh <= 0 ? "On plan" : `₹${lakh}L below`;
}

function contributionMean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

const contributionAvgActual = contributionMean(contributionChartData.map((d) => d.actual));
const contributionAvgPlan = contributionMean(contributionChartData.map((d) => d.plan));
const contributionAvgGapLakh = Math.round((contributionAvgPlan - contributionAvgActual) * 100);
const actualVsAvgLakh = Math.round((nowContribution.actual - contributionAvgActual) * 100);
const planVsAvgLakh = Math.round((nowContribution.plan - contributionAvgPlan) * 100);
const gapVsAvgLakh = nowContribution.gapLakh - contributionAvgGapLakh;

function formatTrackDelta(lakh: number, invert = false): { text: string; color: string } {
  if (lakh === 0) {
    return { text: "On 6-wk avg", color: cssVar("text-muted") };
  }
  const worse = invert ? lakh > 0 : lakh < 0;
  const arrow = lakh < 0 ? "▼" : "▲";
  return {
    text: `${arrow} ${Math.abs(lakh)}L vs avg`,
    color: worse ? SHORTFALL_COLOR : PLAN_COLOR,
  };
}

const CONTRIBUTION_KPI_CHIPS = [
  {
    label: "Actual now",
    value: formatCr(nowContribution.actual),
    valueColor: ACTUAL_COLOR,
    accent: ACTUAL_COLOR,
    avgLabel: `6-wk avg ${formatCr(contributionAvgActual)}`,
    track: formatTrackDelta(actualVsAvgLakh),
    emphasis: false,
  },
  {
    label: "Plan now",
    value: formatCr(nowContribution.plan),
    valueColor: cssVar("text-primary"),
    accent: PLAN_COLOR,
    avgLabel: `6-wk avg ${formatCr(contributionAvgPlan)}`,
    track: formatTrackDelta(planVsAvgLakh),
    emphasis: false,
  },
  {
    label: "Shortfall",
    value: formatGapLakh(nowContribution.gapLakh),
    valueColor: SHORTFALL_COLOR,
    accent: SHORTFALL_COLOR,
    avgLabel: `Avg gap ₹${contributionAvgGapLakh}L`,
    track: formatTrackDelta(gapVsAvgLakh, true),
    emphasis: true,
  },
] as const;

function ContributionKpiStrip(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        overflow: "hidden",
        marginBottom: space["4"],
        flexShrink: 0,
      }}
    >
      {CONTRIBUTION_KPI_CHIPS.map((chip, index) => (
        <div
          key={chip.label}
          style={{
            padding: `${space["3"]} ${space["4"]}`,
            borderLeft: index > 0 ? `1px solid ${cssVar("border")}` : undefined,
            borderTop: `3px solid ${chip.accent}`,
            background: chip.emphasis ? "rgba(240,96,107,0.07)" : undefined,
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 0,
            minHeight: 88,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: chip.accent,
                flexShrink: 0,
                boxShadow: chip.emphasis ? `0 0 8px ${chip.accent}88` : undefined,
              }}
            />
            <span
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: chip.accent,
              }}
            >
              {chip.label}
            </span>
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 26,
              fontWeight: 800,
              lineHeight: type.leading.tight,
              color: chip.valueColor,
              letterSpacing: "-0.02em",
            }}
          >
            {chip.value}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: space["2"],
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontSize: type.scale.caption,
                color: cssVar("text-muted"),
                lineHeight: type.leading.snug,
                minWidth: 0,
              }}
            >
              {chip.avgLabel}
            </span>
            <span
              className="lisn-num"
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                color: chip.track.color,
                background: `${chip.track.color}1A`,
                border: `1px solid ${chip.track.color}33`,
                padding: "3px 8px",
                borderRadius: radius.pill,
                whiteSpace: "nowrap",
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              {chip.track.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContributionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; payload: ContributionChartPoint }[];
  label?: string;
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 12,
        minWidth: 168,
      }}
    >
      <div style={{ color: "#A3A3A3", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: ACTUAL_COLOR }}>Actual</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {formatCr(row.actual)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: PLAN_COLOR }}>Plan</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {formatCr(row.plan)}
          </span>
        </div>
        <div
          style={{
            marginTop: 4,
            paddingTop: 8,
            borderTop: "1px solid #262626",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span style={{ color: SHORTFALL_COLOR }}>Gap vs plan</span>
          <span className="lisn-num" style={{ color: SHORTFALL_COLOR, fontWeight: 700 }}>
            {formatGapLakh(row.gapLakh)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContributionDot({
  cx,
  cy,
  index,
  dataKey,
}: {
  cx?: number;
  cy?: number;
  index?: number;
  dataKey?: string;
}): React.ReactElement | null {
  if (cx === undefined || cy === undefined || index === undefined) return null;

  const isNow = index === contributionChartData.length - 1;
  const isPlan = dataKey === "plan";
  const color = isPlan ? PLAN_COLOR : ACTUAL_COLOR;
  const r = isNow ? 5 : 3.5;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      stroke="#0A0A0A"
      strokeWidth={isNow ? 2 : 1.5}
    />
  );
}

function ContributionChartLegend(): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: type.scale.caption,
        color: cssVar("text-secondary"),
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 16, height: 2, background: ACTUAL_COLOR, display: "inline-block" }} />
        Actual
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 16,
            height: 0,
            borderTop: `2px dashed ${PLAN_COLOR}`,
            display: "inline-block",
          }}
        />
        Plan
      </span>
    </div>
  );
}

export function ContributionTrendChart(): React.ReactElement {
  return (
    <ChartPanel
      title="Contribution vs plan"
      subtitle="₹ Cr · 6-week trend · ₹18L below plan at close"
      subtitlePlacement="header"
      headerEnd={<ContributionChartLegend />}
    >
      <ContributionKpiStrip />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={contributionChartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="contributionActualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACTUAL_COLOR} stopOpacity={0.42} />
              <stop offset="100%" stopColor={ACTUAL_COLOR} stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="contributionShortfallFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SHORTFALL_COLOR} stopOpacity={0.38} />
              <stop offset="100%" stopColor={SHORTFALL_COLOR} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: cssVar("text-secondary"), fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: cssVar("border") }}
            tickLine={false}
          />
          <YAxis
            domain={[2.38, 2.64]}
            ticks={[2.4, 2.45, 2.5, 2.55, 2.6]}
            tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<ContributionTooltip />} cursor={{ stroke: cssVar("border"), strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="shortfall"
            name="Shortfall band"
            stroke="none"
            fill="url(#contributionShortfallFill)"
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={ACTUAL_COLOR}
            fill="url(#contributionActualFill)"
            strokeWidth={2.75}
            dot={<ContributionDot dataKey="actual" />}
            activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: ACTUAL_COLOR }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="plan"
            name="Plan"
            stroke={PLAN_COLOR}
            strokeDasharray="7 5"
            strokeWidth={2.25}
            dot={<ContributionDot dataKey="plan" />}
            activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: PLAN_COLOR }}
            isAnimationActive={false}
          />
        </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

const GAP_DRIVER_DETAILS: Record<(typeof GAP_DRIVERS)[number]["driver"], string> = {
  Returns: "Fashion sub-category · Aura shirt sizing is the largest fixable SKU.",
  Logistics: "Reverse pickup and last-mile cost on high-return SKUs.",
  "Promo / CAC": "Weekend promo ROAS below target on acquisition spend.",
};

const gapMaxLakhs = Math.max(...GAP_DRIVERS.map((d) => d.lakhs));

export function GapDriverChart(): React.ReactElement {
  const defaultIdx = GAP_DRIVERS.findIndex((d) => d.driver === "Returns");
  const [activeIdx, setActiveIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const activeDriver = GAP_DRIVERS[activeIdx]!;
  const activeSegments = GAP_DRIVER_BREAKDOWN[activeDriver.driver];

  const segmentSplit = activeSegments
    .map((segment) => ({
      ...segment,
      sharePct: Math.round((segment.lakhs / activeDriver.lakhs) * 100),
    }))
    .sort((a, b) => b.lakhs - a.lakhs);

  const topSegment = segmentSplit[0]!;

  return (
    <ChartPanel
      title="Finding gaps"
      subtitle="Shortfall drivers · stacked breakdown · click row for detail"
      subtitlePlacement="header"
      headerEnd={
        <span
          className="lisn-num"
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            color: SHORTFALL_COLOR,
            background: `${SHORTFALL_COLOR}1A`,
            border: `1px solid ${SHORTFALL_COLOR}33`,
            padding: "4px 10px",
            borderRadius: radius.pill,
            whiteSpace: "nowrap",
          }}
        >
          ₹{GAP_TOTAL_LAKHS}L total gap
        </span>
      }
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: space["4"],
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: space["3"], justifyContent: "center" }}>
          {GAP_DRIVERS.map((d, idx) => {
            const active = activeIdx === idx;
            const barWidthPct = (d.lakhs / gapMaxLakhs) * 100;
            const segments = GAP_DRIVER_BREAKDOWN[d.driver];

            return (
              <button
                key={d.driver}
                type="button"
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: space["2"],
                  padding: "10px 12px",
                  borderRadius: radius.md,
                  background: active ? `${d.fill}0D` : cssVar("surface-raised"),
                  border: `1px solid ${active ? `${d.fill}44` : cssVar("border")}`,
                  borderLeft: `3px solid ${active ? d.fill : cssVar("border")}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space["2"] }}>
                  <span
                    style={{
                      fontSize: type.scale.caption,
                      fontWeight: active ? type.weight.bold : type.weight.semibold,
                      color: active ? cssVar("text-primary") : cssVar("text-secondary"),
                    }}
                  >
                    {d.driver}
                  </span>
                  <span className="lisn-num" style={{ fontSize: type.scale.caption, fontWeight: 700, color: cssVar("text-muted") }}>
                    {d.rupee} · {d.pct}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
                  <div
                    style={{
                      width: `${barWidthPct}%`,
                      minWidth: 48,
                      height: 22,
                      display: "flex",
                      borderRadius: radius.sm,
                      overflow: "hidden",
                      border: `1px solid ${cssVar("border")}`,
                      flexShrink: 0,
                    }}
                  >
                    {segments.map((segment) => {
                      const segmentPct = (segment.lakhs / d.lakhs) * 100;
                      return (
                        <div
                          key={segment.label}
                          title={`${segment.label}: ₹${segment.lakhs}L`}
                          style={{
                            width: `${segmentPct}%`,
                            background: segment.fill,
                            minWidth: segmentPct > 8 ? undefined : 2,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 148,
            maxWidth: 188,
            flexShrink: 0,
            padding: space["3"],
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Gap split
          </span>
          <div
            className="lisn-num"
            style={{
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1,
              color: activeDriver.fill,
              marginBottom: space["1"],
            }}
          >
            {activeDriver.rupee}
          </div>
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginBottom: space["2"] }}>
            {activeDriver.driver}
          </div>
          {segmentSplit.map((segment) => (
            <div key={segment.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: cssVar("text-secondary") }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: segment.fill }} />
                  {segment.label}
                </span>
                <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-primary") }}>
                  ₹{segment.lakhs}L
                </span>
              </div>
              <div style={{ height: 6, borderRadius: radius.pill, background: cssVar("border"), overflow: "hidden" }}>
                <div style={{ width: `${segment.sharePct}%`, height: "100%", background: segment.fill, borderRadius: radius.pill }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: space["1"], lineHeight: 1.4 }}>
            Top: <strong style={{ color: topSegment.fill }}>{topSegment.label}</strong> · {topSegment.sharePct}%
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          marginTop: space["2"],
          padding: "10px 12px",
          borderRadius: radius.md,
          background: `${activeDriver.fill}0D`,
          border: `1px solid ${activeDriver.fill}40`,
          borderLeft: `3px solid ${activeDriver.fill}`,
        }}
      >
        <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: activeDriver.fill, marginBottom: 4 }}>
          {activeDriver.driver} · {activeDriver.rupee} ({activeDriver.pct}% of gap)
        </div>
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {GAP_DRIVER_DETAILS[activeDriver.driver]}
        </div>
      </div>
    </ChartPanel>
  );
}

export function SubCategoryTable(): React.ReactElement {
  return (
    <ChartPanel title="Sub-category scorecard" subtitle="Contribution ₹ Cr · return rate vs band" subtitlePlacement="header">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: type.scale.small }}>
        <thead>
          <tr>
            {["Sub-category", "Actual", "Plan", "Returns", "Status"].map((h, i) => (
              <th
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: cssVar("text-muted"),
                  textTransform: "uppercase",
                  textAlign: i === 0 ? "left" : i === 4 ? "center" : "right",
                  padding: "0 8px 10px",
                  borderBottom: `1px solid ${cssVar("border")}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUBCATEGORY_PERFORMANCE.map((row) => {
            const returnColor =
              row.returnRate > 22 ? "#F0606B" : row.returnRate > 12 ? "#E8A23D" : "#4FD17A";
            const pill =
              row.status === "breach"
                ? { label: "Breach", bg: "rgba(240,96,107,0.16)", color: "#F0606B" }
                : row.status === "watch"
                  ? { label: "Watch", bg: "rgba(232,162,61,0.16)", color: "#E8A23D" }
                  : { label: "On plan", bg: "rgba(79,209,122,0.16)", color: "#4FD17A" };
            return (
              <tr key={row.name}>
                <td style={{ padding: "12px 8px", borderBottom: `1px solid ${cssVar("border")}`, fontWeight: 600 }}>
                  {row.name}
                </td>
                <td
                  className="lisn-num"
                  style={{
                    padding: "12px 8px",
                    borderBottom: `1px solid ${cssVar("border")}`,
                    textAlign: "right",
                    color: cssVar("text-secondary"),
                  }}
                >
                  ₹{row.contribution.toFixed(2)} Cr
                </td>
                <td
                  className="lisn-num"
                  style={{
                    padding: "12px 8px",
                    borderBottom: `1px solid ${cssVar("border")}`,
                    textAlign: "right",
                    color: cssVar("text-secondary"),
                  }}
                >
                  ₹{row.plan.toFixed(2)} Cr
                </td>
                <td
                  className="lisn-num"
                  style={{
                    padding: "12px 8px",
                    borderBottom: `1px solid ${cssVar("border")}`,
                    textAlign: "right",
                    fontWeight: 700,
                    color: returnColor,
                  }}
                >
                  {row.returnRate}%
                </td>
                <td style={{ padding: "12px 8px", borderBottom: `1px solid ${cssVar("border")}`, textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      padding: "4px 10px",
                      borderRadius: 999,
                      minWidth: 64,
                      background: pill.bg,
                      color: pill.color,
                    }}
                  >
                    {pill.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ChartPanel>
  );
}

const PNL_DEDUCTION_COLORS = ["#F0606B", "#E8A23D", "#C45C5C", "#9B8FD4"] as const;

export function PnlBridgeChart(): React.ReactElement {
  const gross = PNL_BRIDGE.find((s) => s.type === "start")!;
  const contribution = PNL_BRIDGE.find((s) => s.type === "end")!;
  const deductions = PNL_BRIDGE.filter((s) => s.type === "neg");
  const maxDeduction = Math.max(...deductions.map((d) => Math.abs(d.value)));
  const totalLeakage = deductions.reduce((sum, d) => sum + Math.abs(d.value), 0);
  const retentionPct = Math.round((contribution.value / gross.value) * 100);

  return (
    <ChartPanel title="P&L bridge to contribution" subtitle="₹ Lakhs · gross GMV to net contribution" subtitlePlacement="header">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["3"],
          padding: "10px 12px",
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: ACTUAL_COLOR, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Gross GMV
          </div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: cssVar("text-primary") }}>
            ₹{gross.value}L
          </div>
        </div>
        <div style={{ fontSize: 18, color: cssVar("text-muted"), flexShrink: 0 }}>→</div>
        <div style={{ textAlign: "right", minWidth: 0 }}>
          <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: PLAN_COLOR, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Contribution
          </div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: PLAN_COLOR }}>
            ₹{contribution.value}L
          </div>
        </div>
        <span
          className="lisn-num"
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            color: PLAN_COLOR,
            background: `${PLAN_COLOR}18`,
            border: `1px solid ${PLAN_COLOR}33`,
            borderRadius: radius.pill,
            padding: "4px 10px",
            flexShrink: 0,
          }}
        >
          {retentionPct}% retained
        </span>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: space["2"],
          marginTop: space["1"],
          paddingLeft: 14,
          borderLeft: `2px solid ${cssVar("border")}`,
        }}
      >
        <div
          style={{
            fontSize: type.scale.caption,
            color: cssVar("text-muted"),
            marginBottom: 2,
            paddingLeft: space["2"],
          }}
        >
          −₹{totalLeakage}L deductions from gross
        </div>
        {deductions.map((step, idx) => {
          const amount = Math.abs(step.value);
          const widthPct = Math.round((amount / maxDeduction) * 100);
          const color = PNL_DEDUCTION_COLORS[idx] ?? SHORTFALL_COLOR;
          return (
            <div
              key={step.step}
              style={{
                display: "grid",
                gridTemplateColumns: "88px 52px 1fr",
                alignItems: "center",
                gap: space["2"],
                padding: "6px 8px",
                borderRadius: radius.sm,
                background: `${color}08`,
              }}
            >
              <span style={{ fontSize: type.scale.caption, fontWeight: type.weight.semibold, color: cssVar("text-secondary") }}>
                {step.step}
              </span>
              <span className="lisn-num" style={{ fontSize: type.scale.caption, fontWeight: 800, color, textAlign: "right" }}>
                −₹{amount}L
              </span>
              <div style={{ height: 5, borderRadius: radius.pill, background: cssVar("border"), overflow: "hidden" }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    borderRadius: radius.pill,
                    background: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          flexShrink: 0,
          marginTop: space["2"],
          padding: "8px 12px",
          borderRadius: radius.md,
          background: `${PLAN_COLOR}0D`,
          border: `1px solid ${PLAN_COLOR}33`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: space["3"],
        }}
      >
        <span style={{ fontSize: type.scale.caption, color: cssVar("text-secondary") }}>
          Net after all deductions
        </span>
        <span className="lisn-num" style={{ fontSize: type.scale.body, fontWeight: 800, color: PLAN_COLOR }}>
          ₹{contribution.value}L contribution
        </span>
      </div>
    </ChartPanel>
  );
}

type ReturnRateChartPoint = {
  week: string;
  rate: number;
  band: number;
  breachBand: [number, number];
  breachPts: number;
};

const returnRateChartData: ReturnRateChartPoint[] = RETURN_RATE_TREND.map((d) => ({
  ...d,
  breachBand: [d.band, d.rate],
  breachPts: Math.max(0, d.rate - d.band),
}));

const nowReturnRate = returnRateChartData[returnRateChartData.length - 1]!;

function formatPct(value: number): string {
  return `${value}%`;
}

function formatBreachPts(pts: number): string {
  return pts <= 0 ? "On band" : `${pts} pts above`;
}

const returnAvgRate = contributionMean(returnRateChartData.map((d) => d.rate));
const returnAvgBand = contributionMean(returnRateChartData.map((d) => d.band));
const returnAvgBreachPts = Math.round((returnAvgRate - returnAvgBand) * 10) / 10;
const rateVsAvgPts = Math.round((nowReturnRate.rate - returnAvgRate) * 10) / 10;
const bandVsAvgPts = Math.round((nowReturnRate.band - returnAvgBand) * 10) / 10;
const breachVsAvgPts = Math.round((nowReturnRate.breachPts - returnAvgBreachPts) * 10) / 10;

function formatTrackDeltaPts(pts: number, higherIsWorse: boolean): { text: string; color: string } {
  if (pts === 0) {
    return { text: "On 6-wk avg", color: cssVar("text-muted") };
  }
  const worse = higherIsWorse ? pts > 0 : pts < 0;
  const arrow = pts < 0 ? "▼" : "▲";
  const display = Number.isInteger(pts) ? `${Math.abs(pts)}` : `${Math.abs(pts).toFixed(1)}`;
  return {
    text: `${arrow} ${display} pts vs avg`,
    color: worse ? SHORTFALL_COLOR : PLAN_COLOR,
  };
}

const RETURN_RATE_KPI_CHIPS = [
  {
    label: "Rate now",
    value: formatPct(nowReturnRate.rate),
    valueColor: ACTUAL_COLOR,
    accent: ACTUAL_COLOR,
    avgLabel: `6-wk avg ${formatPct(Math.round(returnAvgRate * 10) / 10)}`,
    track: formatTrackDeltaPts(rateVsAvgPts, true),
    emphasis: false,
  },
  {
    label: "Band now",
    value: formatPct(nowReturnRate.band),
    valueColor: cssVar("text-primary"),
    accent: PLAN_COLOR,
    avgLabel: `6-wk avg ${formatPct(Math.round(returnAvgBand * 10) / 10)}`,
    track: formatTrackDeltaPts(bandVsAvgPts, false),
    emphasis: false,
  },
  {
    label: "Above band",
    value: formatBreachPts(nowReturnRate.breachPts),
    valueColor: SHORTFALL_COLOR,
    accent: SHORTFALL_COLOR,
    avgLabel: `Avg gap ${returnAvgBreachPts} pts`,
    track: formatTrackDeltaPts(breachVsAvgPts, true),
    emphasis: true,
  },
] as const;

function ReturnRateKpiStrip(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        overflow: "hidden",
        marginBottom: space["4"],
        flexShrink: 0,
      }}
    >
      {RETURN_RATE_KPI_CHIPS.map((chip, index) => (
        <div
          key={chip.label}
          style={{
            padding: `${space["3"]} ${space["4"]}`,
            borderLeft: index > 0 ? `1px solid ${cssVar("border")}` : undefined,
            borderTop: `3px solid ${chip.accent}`,
            background: chip.emphasis ? "rgba(240,96,107,0.07)" : undefined,
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 0,
            minHeight: 88,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: chip.accent,
                flexShrink: 0,
                boxShadow: chip.emphasis ? `0 0 8px ${chip.accent}88` : undefined,
              }}
            />
            <span
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: chip.accent,
              }}
            >
              {chip.label}
            </span>
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 26,
              fontWeight: 800,
              lineHeight: type.leading.tight,
              color: chip.valueColor,
              letterSpacing: "-0.02em",
            }}
          >
            {chip.value}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: space["2"],
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontSize: type.scale.caption,
                color: cssVar("text-muted"),
                lineHeight: type.leading.snug,
                minWidth: 0,
              }}
            >
              {chip.avgLabel}
            </span>
            <span
              className="lisn-num"
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                color: chip.track.color,
                background: `${chip.track.color}1A`,
                border: `1px solid ${chip.track.color}33`,
                padding: "3px 8px",
                borderRadius: radius.pill,
                whiteSpace: "nowrap",
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              {chip.track.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReturnRateTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; payload: ReturnRateChartPoint }[];
  label?: string;
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 12,
        minWidth: 168,
      }}
    >
      <div style={{ color: "#A3A3A3", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: ACTUAL_COLOR }}>Return rate</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {formatPct(row.rate)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: PLAN_COLOR }}>Category band</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {formatPct(row.band)}
          </span>
        </div>
        <div
          style={{
            marginTop: 4,
            paddingTop: 8,
            borderTop: "1px solid #262626",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span style={{ color: SHORTFALL_COLOR }}>Above band</span>
          <span className="lisn-num" style={{ color: SHORTFALL_COLOR, fontWeight: 700 }}>
            {formatBreachPts(row.breachPts)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReturnRateDot({
  cx,
  cy,
  index,
  dataKey,
}: {
  cx?: number;
  cy?: number;
  index?: number;
  dataKey?: string;
}): React.ReactElement | null {
  if (cx === undefined || cy === undefined || index === undefined) return null;

  const isNow = index === returnRateChartData.length - 1;
  const isBand = dataKey === "band";
  const color = isBand ? PLAN_COLOR : ACTUAL_COLOR;
  const r = isNow ? 5 : 3.5;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      stroke="#0A0A0A"
      strokeWidth={isNow ? 2 : 1.5}
    />
  );
}

function ReturnRateChartLegend(): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: type.scale.caption,
        color: cssVar("text-secondary"),
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 16, height: 2, background: ACTUAL_COLOR, display: "inline-block" }} />
        Return rate
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 16,
            height: 0,
            borderTop: `2px dashed ${PLAN_COLOR}`,
            display: "inline-block",
          }}
        />
        Category band
      </span>
    </div>
  );
}

export function ReturnRateTrendChart(): React.ReactElement {
  return (
    <ChartPanel
      title="Return rate vs category band"
      subtitle="% · 6-week trend · 9 pts above band at close"
      subtitlePlacement="header"
      headerEnd={<ReturnRateChartLegend />}
    >
      <ReturnRateKpiStrip />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={returnRateChartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="returnRateFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACTUAL_COLOR} stopOpacity={0.42} />
              <stop offset="100%" stopColor={ACTUAL_COLOR} stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="returnBreachFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SHORTFALL_COLOR} stopOpacity={0.38} />
              <stop offset="100%" stopColor={SHORTFALL_COLOR} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: cssVar("text-secondary"), fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: cssVar("border") }}
            tickLine={false}
          />
          <YAxis
            domain={[20, 33]}
            ticks={[22, 24, 26, 28, 30, 32]}
            tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={32}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<ReturnRateTooltip />} cursor={{ stroke: cssVar("border"), strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="breachBand"
            name="Above-band band"
            stroke="none"
            fill="url(#returnBreachFill)"
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="Return rate"
            stroke={ACTUAL_COLOR}
            fill="url(#returnRateFill)"
            strokeWidth={2.75}
            dot={<ReturnRateDot dataKey="rate" />}
            activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: ACTUAL_COLOR }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="band"
            name="Category band"
            stroke={PLAN_COLOR}
            strokeDasharray="7 5"
            strokeWidth={2.25}
            dot={<ReturnRateDot dataKey="band" />}
            activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: PLAN_COLOR }}
            isAnimationActive={false}
          />
        </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

const RETURN_CAUSE_DETAILS: Record<
  (typeof RETURN_CAUSE_CHART)[number]["label"],
  { recoverable: boolean; body: string }
> = {
  "Buyer remorse": {
    recoverable: false,
    body: "64% of above-band volume — excluded from recoverable math. Buyer-intent bucket held out of the ₹6.0L trust anchor.",
  },
  "Fixable sizing": {
    recoverable: true,
    body: "28% cause attribution · 36% of excess cohort meets fixable criteria. PIM chart remap on M–L sizes unlocks the recoverable window.",
  },
  Quality: {
    recoverable: false,
    body: "5% share — route to seller QA; minor vs sizing-led spike. Not in this week's recoverable calculation.",
  },
  Other: {
    recoverable: false,
    body: "3% miscellaneous — monitor only; no action in the current recoverable plan.",
  },
};

const FIXABLE_SHARE_PCT = 36;
const BUYER_INTENT_HELD_PCT = 64;

function returnCauseDonutGradient(): string {
  let cursor = 0;
  const stops = RETURN_CAUSE_CHART.map((d) => {
    const start = cursor;
    cursor += (d.pct / 100) * 360;
    return `${d.fill} ${start}deg ${cursor}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export function ReturnCauseRecoverableChart(): React.ReactElement {
  const defaultIdx = RETURN_CAUSE_CHART.findIndex((d) => d.label === "Fixable sizing");
  const [activeIdx, setActiveIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const activeCause = RETURN_CAUSE_CHART[activeIdx]!;
  const activeDetail = RETURN_CAUSE_DETAILS[activeCause.label];

  return (
    <ChartPanel
      title="Excess return mix & recoverable gate"
      subtitle="Cause attribution above band · 36% fixable → ₹6.0L"
      subtitlePlacement="header"
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: space["5"],
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            borderRadius: "50%",
            background: returnCauseDonutGradient(),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 0 1px ${cssVar("border")}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <span className="lisn-num" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: ACTUAL_COLOR }}>
              ₹6.0L
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: cssVar("text-muted"),
              }}
            >
              recoverable
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200, flex: 1, maxWidth: 280 }}>
          {RETURN_CAUSE_CHART.map((d, idx) => {
            const active = activeIdx === idx;
            const detail = RETURN_CAUSE_DETAILS[d.label];
            return (
              <button
                key={d.label}
                type="button"
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: type.scale.caption,
                  color: cssVar("text-secondary"),
                  background: active ? `${d.fill}0D` : "transparent",
                  border: active ? `1px solid ${d.fill}33` : "1px solid transparent",
                  borderRadius: radius.md,
                  padding: "6px 8px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                <span
                  style={{
                    flex: 1,
                    fontWeight: active ? type.weight.bold : type.weight.regular,
                    color: active ? cssVar("text-primary") : cssVar("text-secondary"),
                  }}
                >
                  {d.label}
                </span>
                {detail.recoverable ? (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: ACTUAL_COLOR,
                      background: `${ACTUAL_COLOR}1A`,
                      border: `1px solid ${ACTUAL_COLOR}33`,
                      padding: "2px 6px",
                      borderRadius: radius.pill,
                      flexShrink: 0,
                    }}
                  >
                    Recoverable
                  </span>
                ) : d.label === "Buyer remorse" ? (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: cssVar("text-muted"),
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${cssVar("border")}`,
                      padding: "2px 6px",
                      borderRadius: radius.pill,
                      flexShrink: 0,
                    }}
                  >
                    Held out
                  </span>
                ) : null}
                <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-muted"), minWidth: 32, textAlign: "right" }}>
                  {d.pct}%
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 168,
            maxWidth: 220,
            flexShrink: 0,
            padding: space["3"],
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Recoverable gate
          </span>
          <div
            style={{
              display: "flex",
              height: 12,
              borderRadius: radius.pill,
              overflow: "hidden",
              border: `1px solid ${cssVar("border")}`,
            }}
          >
            <div style={{ width: `${FIXABLE_SHARE_PCT}%`, background: ACTUAL_COLOR }} />
            <div style={{ flex: 1, background: "#2a2a2e" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: cssVar("text-secondary") }}>
            <span>
              <strong style={{ color: ACTUAL_COLOR }}>{FIXABLE_SHARE_PCT}%</strong> fixable
            </span>
            <span>
              <strong style={{ color: cssVar("text-muted") }}>{BUYER_INTENT_HELD_PCT}%</strong> held out
            </span>
          </div>
          <div style={{ fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.45, marginTop: space["1"] }}>
            {FIXABLE_SHARE_PCT}% × 1,860 excess × ₹890 unit contrib →{" "}
            <strong style={{ color: ACTUAL_COLOR }}>₹6.0L</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          marginTop: space["2"],
          padding: "10px 12px",
          borderRadius: radius.md,
          background: `${activeCause.fill}0D`,
          border: `1px solid ${activeCause.fill}40`,
          borderLeft: `3px solid ${activeCause.fill}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: activeCause.fill }}>
            {activeCause.label} · {activeCause.pct}% of above-band volume
          </span>
          {activeDetail.recoverable ? (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: ACTUAL_COLOR,
              }}
            >
              → Recoverable path
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {activeDetail.body}
        </div>
      </div>
    </ChartPanel>
  );
}

export function PimCorrectionTimeline(): React.ReactElement {
  const steps = PIM_CORRECTION_STEPS;
  const doneCount = steps.filter((s) => s.status === "done").length;
  const progressPct = Math.round((doneCount / steps.length) * 100);
  const pendingStep = steps.find((s) => s.status === "pending");

  return (
    <ChartPanel
      title="Correction timeline"
      subtitle="PIM sizing-chart fix · category-wide publish path"
      subtitlePlacement="header"
      headerEnd={
        <span
          className="lisn-num"
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            color: PLAN_COLOR,
            background: `${PLAN_COLOR}1A`,
            border: `1px solid ${PLAN_COLOR}33`,
            padding: "4px 10px",
            borderRadius: radius.pill,
            whiteSpace: "nowrap",
          }}
        >
          {doneCount} of {steps.length} complete
        </span>
      }
    >
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
          }}
        >
          <span>Publish progress</span>
          <span className="lisn-num" style={{ color: ACTUAL_COLOR }}>
            {progressPct}%
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: radius.pill,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {steps.map((s) => (
            <div
              key={s.step}
              style={{
                flex: 1,
                background: s.status === "done" ? ACTUAL_COLOR : "transparent",
                borderRight: `1px solid ${cssVar("border")}`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: space["2"],
          minHeight: 0,
          paddingTop: space["2"],
        }}
      >
        {steps.map((s, i) => {
          const isDone = s.status === "done";
          const isPending = s.status === "pending";
          const nodeColor = isDone ? ACTUAL_COLOR : isPending ? SHORTFALL_COLOR : cssVar("text-muted");

          return (
            <div
              key={s.step}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: space["2"],
                minWidth: 0,
                position: "relative",
              }}
            >
              {i < steps.length - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    top: 15,
                    left: "calc(50% + 16px)",
                    right: "calc(-50% + 16px)",
                    height: 2,
                    background: isDone ? ACTUAL_COLOR : cssVar("border"),
                    zIndex: 0,
                  }}
                />
              ) : null}

              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isDone ? `${ACTUAL_COLOR}22` : isPending ? `${SHORTFALL_COLOR}14` : cssVar("surface-raised"),
                  border: `2px solid ${nodeColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: isPending ? `0 0 0 4px ${SHORTFALL_COLOR}18` : undefined,
                  flexShrink: 0,
                }}
              >
                {isDone ? (
                  <span style={{ color: ACTUAL_COLOR, fontSize: 14, fontWeight: 800, lineHeight: 1 }}>✓</span>
                ) : (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: SHORTFALL_COLOR,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "8px 6px",
                  borderRadius: radius.md,
                  background: isPending ? "rgba(240,96,107,0.07)" : cssVar("surface-raised"),
                  border: `1px solid ${isPending ? `${SHORTFALL_COLOR}40` : cssVar("border")}`,
                  borderTop: `3px solid ${isPending ? SHORTFALL_COLOR : isDone ? ACTUAL_COLOR : cssVar("border")}`,
                  minHeight: 72,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: isPending ? SHORTFALL_COLOR : isDone ? ACTUAL_COLOR : cssVar("text-muted"),
                    marginBottom: 4,
                  }}
                >
                  {isDone ? "Done" : "Pending"}
                </div>
                <div
                  style={{
                    fontSize: type.scale.caption,
                    fontWeight: type.weight.bold,
                    color: cssVar("text-primary"),
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {s.step}
                </div>
                <div style={{ fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.35 }}>
                  {s.when}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 9,
                    fontWeight: 700,
                    color: cssVar("text-secondary"),
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${cssVar("border")}`,
                    borderRadius: radius.pill,
                    padding: "2px 8px",
                    display: "inline-block",
                  }}
                >
                  {s.owner}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pendingStep ? (
        <div
          style={{
            flexShrink: 0,
            padding: "10px 12px",
            borderRadius: radius.md,
            background: `${SHORTFALL_COLOR}0D`,
            border: `1px solid ${SHORTFALL_COLOR}40`,
            borderLeft: `3px solid ${SHORTFALL_COLOR}`,
          }}
        >
          <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: SHORTFALL_COLOR, marginBottom: 4 }}>
            Gate · {pendingStep.step}
          </div>
          <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
            Seller-Brand notification is the last step before chart publish — blocks closing the ₹6.0L recoverable window this week.
          </div>
        </div>
      ) : null}
    </ChartPanel>
  );
}

type SellerTrustChartPoint = {
  week: string;
  seller: number;
  band: number;
  gapBand: [number, number];
  gapPts: number;
};

const sellerTrustChartData: SellerTrustChartPoint[] = SELLER_TRUST_TREND.map((d) => ({
  week: d.week,
  seller: d.quickStyle,
  band: d.category,
  gapBand: [d.quickStyle, d.category],
  gapPts: Math.max(0, d.category - d.quickStyle),
}));

const nowSellerTrust = sellerTrustChartData[sellerTrustChartData.length - 1]!;

function formatTrustScore(value: number): string {
  return `${value}`;
}

function formatTrustGap(pts: number): string {
  return pts <= 0 ? "On par" : `${pts} pts below`;
}

const sellerAvgTrust = contributionMean(sellerTrustChartData.map((d) => d.seller));
const sellerAvgBand = contributionMean(sellerTrustChartData.map((d) => d.band));
const sellerAvgGapPts = Math.round((sellerAvgBand - sellerAvgTrust) * 10) / 10;
const sellerVsAvgPts = Math.round((nowSellerTrust.seller - sellerAvgTrust) * 10) / 10;
const sellerBandVsAvgPts = Math.round((nowSellerTrust.band - sellerAvgBand) * 10) / 10;
const sellerGapVsAvgPts = Math.round((nowSellerTrust.gapPts - sellerAvgGapPts) * 10) / 10;

function formatTrustTrackDelta(pts: number, lowerIsWorse: boolean): { text: string; color: string } {
  if (pts === 0) {
    return { text: "On 6-wk avg", color: cssVar("text-muted") };
  }
  const worse = lowerIsWorse ? pts < 0 : pts > 0;
  const arrow = pts < 0 ? "▼" : "▲";
  const display = Number.isInteger(pts) ? `${Math.abs(pts)}` : `${Math.abs(pts).toFixed(1)}`;
  return {
    text: `${arrow} ${display} pts vs avg`,
    color: worse ? SHORTFALL_COLOR : PLAN_COLOR,
  };
}

const SELLER_TRUST_KPI_CHIPS = [
  {
    label: "QuickStyle now",
    value: formatTrustScore(nowSellerTrust.seller),
    valueColor: SHORTFALL_COLOR,
    accent: SHORTFALL_COLOR,
    avgLabel: `6-wk avg ${Math.round(sellerAvgTrust * 10) / 10}`,
    track: formatTrustTrackDelta(sellerVsAvgPts, true),
    emphasis: true,
  },
  {
    label: "Category avg",
    value: formatTrustScore(nowSellerTrust.band),
    valueColor: cssVar("text-primary"),
    accent: PLAN_COLOR,
    avgLabel: `6-wk avg ${Math.round(sellerAvgBand * 10) / 10}`,
    track: formatTrustTrackDelta(sellerBandVsAvgPts, false),
    emphasis: false,
  },
  {
    label: "Below avg",
    value: formatTrustGap(nowSellerTrust.gapPts),
    valueColor: SHORTFALL_COLOR,
    accent: SHORTFALL_COLOR,
    avgLabel: `Avg gap ${sellerAvgGapPts} pts`,
    track: formatTrustTrackDelta(sellerGapVsAvgPts, false),
    emphasis: false,
  },
] as const;

function SellerTrustKpiStrip(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        overflow: "hidden",
        marginBottom: space["4"],
        flexShrink: 0,
      }}
    >
      {SELLER_TRUST_KPI_CHIPS.map((chip, index) => (
        <div
          key={chip.label}
          style={{
            padding: `${space["3"]} ${space["4"]}`,
            borderLeft: index > 0 ? `1px solid ${cssVar("border")}` : undefined,
            borderTop: `3px solid ${chip.accent}`,
            background: chip.emphasis ? "rgba(240,96,107,0.07)" : undefined,
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 0,
            minHeight: 88,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: chip.accent,
                flexShrink: 0,
                boxShadow: chip.emphasis ? `0 0 8px ${chip.accent}88` : undefined,
              }}
            />
            <span
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: chip.accent,
              }}
            >
              {chip.label}
            </span>
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 26,
              fontWeight: 800,
              lineHeight: type.leading.tight,
              color: chip.valueColor,
              letterSpacing: "-0.02em",
            }}
          >
            {chip.value}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: space["2"],
              marginTop: "auto",
            }}
          >
            <span style={{ fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: type.leading.snug, minWidth: 0 }}>
              {chip.avgLabel}
            </span>
            <span
              className="lisn-num"
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                color: chip.track.color,
                background: `${chip.track.color}1A`,
                border: `1px solid ${chip.track.color}33`,
                padding: "3px 8px",
                borderRadius: radius.pill,
                whiteSpace: "nowrap",
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              {chip.track.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SellerTrustTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; payload: SellerTrustChartPoint }[];
  label?: string;
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div style={{ background: "#141414", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", fontSize: 12, minWidth: 168 }}>
      <div style={{ color: "#A3A3A3", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: SHORTFALL_COLOR }}>QuickStyle</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {row.seller}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: PLAN_COLOR }}>Category avg</span>
          <span className="lisn-num" style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {row.band}
          </span>
        </div>
        <div style={{ marginTop: 4, paddingTop: 8, borderTop: "1px solid #262626", display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: SHORTFALL_COLOR }}>Below avg</span>
          <span className="lisn-num" style={{ color: SHORTFALL_COLOR, fontWeight: 700 }}>
            {formatTrustGap(row.gapPts)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SellerTrustDot({
  cx,
  cy,
  index,
  dataKey,
}: {
  cx?: number;
  cy?: number;
  index?: number;
  dataKey?: string;
}): React.ReactElement | null {
  if (cx === undefined || cy === undefined || index === undefined) return null;
  const isNow = index === sellerTrustChartData.length - 1;
  const isBand = dataKey === "band";
  const color = isBand ? PLAN_COLOR : SHORTFALL_COLOR;
  const r = isNow ? 5 : 3.5;
  return <circle cx={cx} cy={cy} r={r} fill={color} stroke="#0A0A0A" strokeWidth={isNow ? 2 : 1.5} />;
}

function SellerTrustChartLegend(): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: type.scale.caption, color: cssVar("text-secondary") }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 16, height: 2, background: SHORTFALL_COLOR, display: "inline-block" }} />
        QuickStyle
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 16, height: 0, borderTop: `2px dashed ${PLAN_COLOR}`, display: "inline-block" }} />
        Category avg
      </span>
    </div>
  );
}

export function SellerTrustTrendChart(): React.ReactElement {
  return (
    <ChartPanel
      title="Trust score vs category"
      subtitle="Indexed score · 6-week trend · 31 pts below category at close"
      subtitlePlacement="header"
      headerEnd={<SellerTrustChartLegend />}
    >
      <SellerTrustKpiStrip />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sellerTrustChartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="sellerTrustFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SHORTFALL_COLOR} stopOpacity={0.35} />
                <stop offset="100%" stopColor={SHORTFALL_COLOR} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="sellerTrustGapFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SHORTFALL_COLOR} stopOpacity={0.28} />
                <stop offset="100%" stopColor={SHORTFALL_COLOR} stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: cssVar("text-secondary"), fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: cssVar("border") }}
              tickLine={false}
            />
            <YAxis
              domain={[38, 82]}
              ticks={[42, 50, 58, 66, 74]}
              tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<SellerTrustTooltip />} cursor={{ stroke: cssVar("border"), strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="gapBand"
              stroke="none"
              fill="url(#sellerTrustGapFill)"
              isAnimationActive={false}
              legendType="none"
              tooltipType="none"
            />
            <Area
              type="monotone"
              dataKey="seller"
              stroke={SHORTFALL_COLOR}
              fill="url(#sellerTrustFill)"
              strokeWidth={2.75}
              dot={<SellerTrustDot dataKey="seller" />}
              activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: SHORTFALL_COLOR }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="band"
              stroke={PLAN_COLOR}
              strokeDasharray="7 5"
              strokeWidth={2.25}
              dot={<SellerTrustDot dataKey="band" />}
              activeDot={{ r: 6, stroke: "#0A0A0A", strokeWidth: 2, fill: PLAN_COLOR }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

type ComplaintThemeKey = "quickStyle" | "trendForge" | "metroEx";

const COMPLAINT_SELLERS: { key: ComplaintThemeKey; label: string; fill: string }[] = [
  { key: "quickStyle", label: "QuickStyle", fill: "#FF6B6B" },
  { key: "trendForge", label: "TrendForge", fill: "#F6A93B" },
  { key: "metroEx", label: "MetroEx", fill: "#8B7CF6" },
];

const COMPLAINT_THEME_FILLS: Record<(typeof COMPLAINT_THEMES)[number]["theme"], string> = {
  "Cancel-after-wait": "#FF6B6B",
  "Sizing dispute": "#F6A93B",
  "Late dispatch": "#8B7CF6",
};

const COMPLAINT_THEME_DETAILS: Record<(typeof COMPLAINT_THEMES)[number]["theme"], string> = {
  "Cancel-after-wait":
    "QuickStyle accounts for 66% of cancel-after-wait volume — primary coaching target for Seller-Brand.",
  "Sizing dispute": "TrendForge leads sizing disputes — monitor separately from conduct coaching.",
  "Late dispatch": "MetroEx dominates late-dispatch complaints — dispatch SLA watch, not top trust risk.",
};

const complaintThemeTotals = COMPLAINT_THEMES.map((row) => {
  const total = row.quickStyle + row.trendForge + row.metroEx;
  return {
    theme: row.theme,
    fill: COMPLAINT_THEME_FILLS[row.theme],
    total,
    row,
  };
});

const complaintGrandTotal = complaintThemeTotals.reduce((sum, d) => sum + d.total, 0);
const complaintMaxThemeTotal = Math.max(...complaintThemeTotals.map((d) => d.total));

function ComplaintSellerLegend(): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: type.scale.caption, color: cssVar("text-secondary") }}>
      {COMPLAINT_SELLERS.map((seller) => (
        <span key={seller.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: seller.fill }} />
          {seller.label}
        </span>
      ))}
    </div>
  );
}

export function ComplaintThemeChart(): React.ReactElement {
  const defaultIdx = complaintThemeTotals.findIndex((d) => d.theme === "Cancel-after-wait");
  const [activeIdx, setActiveIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const activeTheme = complaintThemeTotals[activeIdx]!;
  const activePct = Math.round((activeTheme.total / complaintGrandTotal) * 100);

  const sellerSplit = COMPLAINT_SELLERS.map((seller) => {
    const value = activeTheme.row[seller.key];
    return {
      ...seller,
      value,
      sharePct: Math.round((value / activeTheme.total) * 100),
    };
  }).sort((a, b) => b.value - a.value);

  const topSeller = sellerSplit[0]!;

  return (
    <ChartPanel
      title="Complaint theme mix"
      subtitle="Indexed volume · stacked by seller · click row for detail"
      subtitlePlacement="header"
      headerEnd={<ComplaintSellerLegend />}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: space["4"],
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: space["3"], justifyContent: "center" }}>
          {complaintThemeTotals.map((d, idx) => {
            const active = activeIdx === idx;
            const themePct = Math.round((d.total / complaintGrandTotal) * 100);
            const barWidthPct = (d.total / complaintMaxThemeTotal) * 100;

            return (
              <button
                key={d.theme}
                type="button"
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: space["2"],
                  padding: "10px 12px",
                  borderRadius: radius.md,
                  background: active ? `${d.fill}0D` : cssVar("surface-raised"),
                  border: `1px solid ${active ? `${d.fill}44` : cssVar("border")}`,
                  borderLeft: `3px solid ${active ? d.fill : cssVar("border")}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space["2"] }}>
                  <span
                    style={{
                      fontSize: type.scale.caption,
                      fontWeight: active ? type.weight.bold : type.weight.semibold,
                      color: active ? cssVar("text-primary") : cssVar("text-secondary"),
                    }}
                  >
                    {d.theme}
                  </span>
                  <span className="lisn-num" style={{ fontSize: type.scale.caption, fontWeight: 700, color: cssVar("text-muted") }}>
                    {d.total} · {themePct}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
                  <div
                    style={{
                      width: `${barWidthPct}%`,
                      minWidth: 48,
                      height: 22,
                      display: "flex",
                      borderRadius: radius.sm,
                      overflow: "hidden",
                      border: `1px solid ${cssVar("border")}`,
                      flexShrink: 0,
                    }}
                  >
                    {COMPLAINT_SELLERS.map((seller) => {
                      const value = d.row[seller.key];
                      if (value === 0) return null;
                      const segmentPct = (value / d.total) * 100;
                      return (
                        <div
                          key={seller.key}
                          title={`${seller.label}: ${value}`}
                          style={{
                            width: `${segmentPct}%`,
                            background: seller.fill,
                            minWidth: segmentPct > 8 ? undefined : 2,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space["2"],
            minWidth: 148,
            maxWidth: 188,
            flexShrink: 0,
            padding: space["3"],
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Seller split
          </span>
          <div
            className="lisn-num"
            style={{
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1,
              color: activeTheme.fill,
              marginBottom: space["1"],
            }}
          >
            {activeTheme.total}
          </div>
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginBottom: space["2"] }}>
            {activeTheme.theme}
          </div>
          {sellerSplit.map((seller) => (
            <div key={seller.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: cssVar("text-secondary") }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: seller.fill }} />
                  {seller.label}
                </span>
                <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-primary") }}>
                  {seller.value}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: radius.pill, background: cssVar("border"), overflow: "hidden" }}>
                <div style={{ width: `${seller.sharePct}%`, height: "100%", background: seller.fill, borderRadius: radius.pill }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: space["1"], lineHeight: 1.4 }}>
            Top: <strong style={{ color: topSeller.fill }}>{topSeller.label}</strong> · {topSeller.sharePct}%
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          marginTop: space["2"],
          padding: "10px 12px",
          borderRadius: radius.md,
          background: `${activeTheme.fill}0D`,
          border: `1px solid ${activeTheme.fill}40`,
          borderLeft: `3px solid ${activeTheme.fill}`,
        }}
      >
        <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: activeTheme.fill, marginBottom: 4 }}>
          {activeTheme.theme} · {activeTheme.total} indexed ({activePct}% of complaints)
        </div>
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {COMPLAINT_THEME_DETAILS[activeTheme.theme]}
        </div>
      </div>
    </ChartPanel>
  );
}
