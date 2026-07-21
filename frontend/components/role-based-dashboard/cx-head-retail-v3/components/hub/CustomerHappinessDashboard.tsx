"use client";

import React, { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Minus,
  Sparkles,
  Star,
} from "lucide-react";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import {
  HAPPINESS_DATA,
  HAPPINESS_PERIODS,
  getFlipkartFciClustersForRange,
  getHappinessSegmentRows,
  getRfmSegmentsForRange,
  RFM_ZONES,
  type HappinessPeriodKey,
  type RfmId,
} from "../../lib/cxHeadRetailV3CustomerHappinessData";
import {
  segmentsRankedByGmvAtRisk,
  type HappinessSegmentKey,
  type HappinessSegmentRow,
} from "../../lib/cxHeadRetailV3HappinessLensData";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { cssVar, radius } from "../../theme/tokens";
import { ConfidenceChip } from "../common/ConfidenceBand";

function failCustomerSegments(rows: HappinessSegmentRow[]) {
  return rows.map((row) => ({
    label: row.label,
    color: row.color,
    weight: row.interactions,
  }));
}

const nf = new Intl.NumberFormat("en-IN");
function formatInt(n: number): string {
  return nf.format(Math.round(n));
}

function band(v: number): string {
  if (v >= 70) return cssVar("positive");
  if (v >= 55) return cssVar("severity-med");
  return cssVar("severity-high");
}

/** Higher is better (NPS, CSAT %, AOV, ATV, resolution %, GMV). */
function ragHigher(v: number, good: number, ok: number): string {
  if (v >= good) return cssVar("positive");
  if (v >= ok) return cssVar("severity-med");
  return cssVar("severity-high");
}

/** Lower is better (CES /5, CPU). */
function ragLower(v: number, good: number, ok: number): string {
  if (v <= good) return cssVar("positive");
  if (v <= ok) return cssVar("severity-med");
  return cssVar("severity-high");
}

function scoreValueColor(label: string, value: number): string {
  switch (label) {
    case "Happiness Index":
    case "Customer Loyalty Index":
      return band(value);
    case "Net Promoter Score":
      return ragHigher(value, 50, 30);
    case "Customer Satisfaction":
      return ragHigher(value, 80, 70);
    case "Customer Effort Score":
      return ragLower(value, 2.5, 3.5);
    case "Customer Churn Rate":
      return ragLower(value, 5, 8);
    case "Repeat Purchase Rate":
      return ragHigher(value, 40, 30);
    default:
      return cssVar("text-primary");
  }
}

function fmtDelta(d: number): string {
  if (d > 0) return `+${d}`;
  if (d < 0) return `${d}`;
  return "0";
}

function Delta({
  value,
  invert = false,
  suffix = "",
  size = 12.5,
}: {
  value: number;
  invert?: boolean;
  suffix?: string;
  size?: number;
}): React.ReactElement {
  const good = value > 0 ? !invert : value < 0 ? invert : null;
  const color = value === 0 ? cssVar("text-muted") : good ? cssVar("positive") : cssVar("severity-high");
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        color,
        fontSize: size,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        fontFamily: cssVar("font-numeric"),
      }}
    >
      <Icon size={size + 1.5} strokeWidth={2.4} />
      {fmtDelta(value).replace(/[+-]/, "")}
      {suffix}
    </span>
  );
}

function Card({
  children,
  style,
  primary = false,
  onMouseLeave,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  primary?: boolean;
  onMouseLeave?: () => void;
}): React.ReactElement {
  return (
    <div
      onMouseLeave={onMouseLeave}
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: 16,
        padding: 18,
        position: "relative",
        boxShadow: primary ? cssVar("shadow-pop") : cssVar("shadow-card"),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardQ({
  children,
  hint,
  star,
}: {
  children: React.ReactNode;
  hint?: string;
  star?: boolean;
}): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 14.5,
          fontWeight: 650,
          color: cssVar("text-primary"),
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h3>
      {star ? (
        <Star size={13} fill={cssVar("severity-med")} color={cssVar("severity-med")} />
      ) : hint ? (
        <span title={hint} style={{ display: "inline-flex", color: cssVar("text-muted"), cursor: "help" }}>
          <Info size={13.5} />
        </span>
      ) : null}
    </div>
  );
}

function SectionHeader({
  num,
  title,
  sub,
  right,
  showLine = false,
}: {
  num: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  showLine?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        margin: "26px 2px 14px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", minWidth: 0 }}>
        <span
          className="lisn-num"
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            fontFamily: cssVar("font-numeric"),
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            fontVariantNumeric: "tabular-nums",
            color: cssVar("accent-2"),
            background: "transparent",
            borderRadius: 12,
            border: `2px solid ${cssVar("accent")}`,
            boxShadow: cssVar("shadow-card"),
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 18.5,
            fontWeight: 650,
            letterSpacing: "-0.02em",
            color: cssVar("text-primary"),
          }}
        >
          {title}
        </h2>
        {sub ? <span style={{ fontSize: 12, color: cssVar("text-muted") }}>{sub}</span> : null}
        {showLine ? <div style={{ flex: 1, borderBottom: `1px solid ${cssVar("border")}`, alignSelf: "flex-end", marginBottom: 6 }} /> : null}
      </div>
      {right ? <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{right}</div> : null}
    </div>
  );
}

type RfmHeatMode = "monetary" | "revenue";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function RfmHeatMatrix({
  selected,
  heatMode,
  onSelect,
  period,
}: {
  selected: RfmId;
  heatMode: RfmHeatMode;
  onSelect: (id: RfmId) => void;
  period: HappinessPeriodKey;
}): React.ReactElement {
  const rfmSegments = getRfmSegmentsForRange(period);
  const byRF = new Map(rfmSegments.map((s) => [`${s.R}-${s.F}`, s]));
  const maxRev = Math.max(...rfmSegments.map((s) => s.rev), 1);
  const recencyRows = [5, 4, 3, 2, 1];
  const frequencyCols = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 8, alignItems: "stretch" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        Recency → recent
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px repeat(5, minmax(0, 1fr))",
            gap: 5,
          }}
        >
          <div />
          {frequencyCols.map((f) => (
            <div
              key={`f-${f}`}
              style={{
                textAlign: "center",
                fontSize: 10,
                fontWeight: 700,
                color: cssVar("text-muted"),
                fontFamily: cssVar("font-numeric"),
              }}
            >
              F{f}
            </div>
          ))}

          {recencyRows.map((r) => (
            <React.Fragment key={`row-${r}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  color: cssVar("text-muted"),
                  fontFamily: cssVar("font-numeric"),
                }}
              >
                R{r}
              </div>
              {frequencyCols.map((f) => {
                const seg = byRF.get(`${r}-${f}`);
                if (!seg) {
                  return (
                    <div
                      key={`${r}-${f}`}
                      style={{
                        minHeight: 58,
                        borderRadius: 10,
                        border: `1px dashed ${cssVar("border")}`,
                        background: `${cssVar("surface-raised")}`,
                        opacity: 0.45,
                      }}
                    />
                  );
                }
                const on = selected === seg.id;
                const intensity =
                  heatMode === "monetary" ? seg.M / 5 : Math.max(0.22, seg.rev / maxRev);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => onSelect(seg.id)}
                    title={`${seg.name} · R${seg.R} F${seg.F} M${seg.M} · ${seg.rev}% rev`}
                    style={{
                      minHeight: 58,
                      borderRadius: 10,
                      border: on ? `2px solid ${seg.color}` : `1px solid ${seg.color}55`,
                      background: hexToRgba(seg.color, on ? 0.42 : 0.14 + intensity * 0.38),
                      boxShadow: on ? `0 0 0 1px ${seg.color}66` : "none",
                      cursor: "pointer",
                      padding: "8px 8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "left",
                      fontFamily: "inherit",
                      color: "inherit",
                      transition: "transform 120ms ease, box-shadow 120ms ease",
                      transform: on ? "scale(1.02)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: on ? cssVar("text-primary") : seg.color,
                        lineHeight: 1.15,
                      }}
                    >
                      {seg.name}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        fontFamily: cssVar("font-numeric"),
                        fontVariantNumeric: "tabular-nums",
                        color: cssVar("text-primary"),
                        lineHeight: 1,
                      }}
                    >
                      {heatMode === "monetary" ? `M${seg.M}` : `${seg.rev}%`}
                    </span>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
          }}
        >
          Frequency → more often
        </div>
      </div>
    </div>
  );
}

function RfmBreakdownKpis({
  selected,
  period,
}: {
  selected: RfmId;
  period: HappinessPeriodKey;
}): React.ReactElement {
  const rfmSegments = getRfmSegmentsForRange(period);
  const s = rfmSegments.find((seg) => seg.id === selected) ?? rfmSegments[0];
  const zone = RFM_ZONES[s.zone];

  const cards: Array<{ label: string; value: string; sub?: string; accent?: string }> = [
    { label: "Recency", value: `${s.R}/5`, sub: "How recent", accent: s.color },
    { label: "Frequency", value: `${s.F}/5`, sub: "How often", accent: s.color },
    { label: "Monetary", value: `${s.M}/5`, sub: "Spend depth", accent: s.color },
    { label: "Avg CLV", value: s.clv, sub: "Lifetime value" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{s.name}</span>
          <span style={{ fontSize: 11, color: cssVar("text-muted"), whiteSpace: "nowrap" }}>RFM breakdown</span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: zone.color,
            background: `${zone.color}22`,
            padding: "3px 8px",
            borderRadius: radius.pill,
            flexShrink: 0,
          }}
        >
          {zone.label}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              borderTop: `3px solid ${c.accent ?? s.color}`,
              borderRadius: 10,
              padding: "10px 11px",
              minHeight: 72,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: cssVar("text-muted"),
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 18,
                fontWeight: 800,
                fontFamily: cssVar("font-numeric"),
                fontVariantNumeric: "tabular-nums",
                color: c.accent ?? cssVar("text-primary"),
                lineHeight: 1.15,
              }}
            >
              {c.value}
            </div>
            {c.sub ? (
              <div style={{ marginTop: 4, fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.3 }}>{c.sub}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const RFM_TO_CUSTOMER_SEGMENT: Record<RfmId, HappinessSegmentKey> = {
  champions: "loyal",
  loyal: "loyal",
  potential: "frequent",
  new: "occasional",
  attention: "occasional",
  atrisk: "reactivated",
  cantlose: "loyal",
  hibernating: "dormant",
};

/** Weight mix for how an RFM cohort splits across customer segments (relative; scaled to RFM rev%). */
const RFM_SHARE_WEIGHTS: Record<RfmId, Record<HappinessSegmentKey, number>> = {
  champions: {
    loyal: 42,
    active: 18,
    frequent: 16,
    occasional: 8,
    reactivated: 6,
    seasonal: 6,
    dormant: 4,
  },
  loyal: {
    loyal: 48,
    active: 20,
    frequent: 12,
    occasional: 7,
    reactivated: 5,
    seasonal: 5,
    dormant: 3,
  },
  potential: {
    loyal: 10,
    active: 22,
    frequent: 36,
    occasional: 14,
    reactivated: 8,
    seasonal: 6,
    dormant: 4,
  },
  new: {
    loyal: 4,
    active: 18,
    frequent: 10,
    occasional: 40,
    reactivated: 12,
    seasonal: 10,
    dormant: 6,
  },
  attention: {
    loyal: 8,
    active: 20,
    frequent: 14,
    occasional: 28,
    reactivated: 14,
    seasonal: 10,
    dormant: 6,
  },
  atrisk: {
    loyal: 10,
    active: 14,
    frequent: 10,
    occasional: 12,
    reactivated: 34,
    seasonal: 12,
    dormant: 8,
  },
  cantlose: {
    loyal: 38,
    active: 16,
    frequent: 14,
    occasional: 10,
    reactivated: 10,
    seasonal: 8,
    dormant: 4,
  },
  hibernating: {
    loyal: 4,
    active: 8,
    frequent: 6,
    occasional: 12,
    reactivated: 10,
    seasonal: 12,
    dormant: 48,
  },
};

/** Split `total` across keys by weight so values are integers and sum exactly to `total`. */
function allocateSharePct(
  weights: Record<HappinessSegmentKey, number>,
  total: number,
  order: HappinessSegmentKey[],
): Record<HappinessSegmentKey, number> {
  const weightSum = order.reduce((s, k) => s + (weights[k] ?? 0), 0) || 1;
  const raw = order.map((k) => ({ key: k, exact: ((weights[k] ?? 0) / weightSum) * total }));
  const floored = raw.map((r) => ({ key: r.key, value: Math.floor(r.exact), frac: r.exact - Math.floor(r.exact) }));
  let remainder = total - floored.reduce((s, r) => s + r.value, 0);
  floored
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach((r) => {
      if (remainder <= 0) return;
      const hit = floored.find((f) => f.key === r.key);
      if (hit) {
        hit.value += 1;
        remainder -= 1;
      }
    });
  return Object.fromEntries(floored.map((r) => [r.key, r.value])) as Record<HappinessSegmentKey, number>;
}

function SentimentBySegmentPanel({
  selectedRfmId,
  rfmRevPct,
  linkedSegmentKey,
  rfmColor,
  onSelectSegment,
  period,
}: {
  selectedRfmId: RfmId;
  /** Selected RFM cell % (e.g. Champions 26) — Share(%) rows split this total. */
  rfmRevPct: number;
  linkedSegmentKey: HappinessSegmentKey;
  rfmColor: string;
  onSelectSegment: (key: HappinessSegmentKey) => void;
  period: HappinessPeriodKey;
}): React.ReactElement {
  const rows = segmentsRankedByGmvAtRisk(getHappinessSegmentRows(period));
  const shareBySegment = allocateSharePct(
    RFM_SHARE_WEIGHTS[selectedRfmId],
    rfmRevPct,
    rows.map((r) => r.key),
  );

  return (
    <Card style={{ borderLeft: `3px solid ${rfmColor}`, padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${cssVar("border")}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: cssVar("text-primary") }}>
            Sentiment by Customer Segment
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px", flexShrink: 0, justifyContent: "flex-end", alignItems: "center" }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: cssVar("text-muted"),
              }}
            >
              Share(%)
            </span>
            {(
              [
                ["Happy", cssVar("positive")],
                ["Neutral", cssVar("severity-med")],
                ["Unhappy", cssVar("severity-high")],
              ] as const
            ).map(([label, color]) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 600, color: cssVar("text-muted") }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {rows.map((seg, idx) => {
          const linked = seg.key === linkedSegmentKey;
          const sharePct = shareBySegment[seg.key] ?? 0;
          return (
            <button
              key={seg.key}
              type="button"
              onClick={() => onSelectSegment(seg.key)}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(110px, 0.85fr) 48px minmax(0, 1.5fr)",
                columnGap: 10,
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 16px",
                border: "none",
                borderTop: idx === 0 ? "none" : `1px solid ${cssVar("border")}`,
                borderLeft: linked ? `3px solid ${seg.color}` : "3px solid transparent",
                background: linked ? `${seg.color}16` : "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "inherit",
                textAlign: "left",
                flex: 1,
                minHeight: 72,
              }}
              title={`${seg.label} · ${sharePct}% of ${rfmRevPct}% RFM share · ${seg.happy}% happy · ₹${seg.gmvAtRiskCr} Cr GMV`}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: cssVar("text-primary"),
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  fontFamily: cssVar("font-numeric"),
                  fontVariantNumeric: "tabular-nums",
                  color: linked ? rfmColor : cssVar("text-primary"),
                  textAlign: "right",
                }}
              >
                {sharePct}%
              </span>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    height: 22,
                    borderRadius: 7,
                    overflow: "hidden",
                    background: cssVar("border"),
                  }}
                >
                  {(
                    [
                      [seg.happy, cssVar("positive"), "#04140a"],
                      [seg.neutral, cssVar("severity-med"), "#1a1205"],
                      [seg.unhappy, cssVar("severity-high"), "#fff"],
                    ] as const
                  ).map(([pct, color, ink]) => (
                    <div
                      key={color}
                      style={{
                        width: `${pct}%`,
                        background: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: pct >= 14 ? undefined : 0,
                      }}
                    >
                      {pct >= 14 ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            fontFamily: cssVar("font-numeric"),
                            color: ink,
                          }}
                        >
                          {pct}%
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function RfmInteractiveBoard({
  selected,
  onSelect,
  period,
}: {
  selected: RfmId;
  onSelect: (id: RfmId) => void;
  period: HappinessPeriodKey;
}): React.ReactElement {
  const rfmSegments = getRfmSegmentsForRange(period);
  const rfm = rfmSegments.find((s) => s.id === selected) ?? rfmSegments[0];
  const linkedSegmentKey = RFM_TO_CUSTOMER_SEGMENT[rfm.id];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 14, alignItems: "stretch" }}>
      <Card style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
        <RfmHeatMatrix selected={selected} heatMode="revenue" onSelect={onSelect} period={period} />
        <div style={{ borderTop: `1px solid ${cssVar("border")}`, paddingTop: 14 }}>
          <RfmBreakdownKpis selected={selected} period={period} />
        </div>
      </Card>

      <SentimentBySegmentPanel
        selectedRfmId={rfm.id}
        rfmRevPct={rfm.rev}
        linkedSegmentKey={linkedSegmentKey}
        rfmColor={rfm.color}
        period={period}
        onSelectSegment={(key) => {
          const match = rfmSegments.find((s) => RFM_TO_CUSTOMER_SEGMENT[s.id] === key);
          if (match) onSelect(match.id);
        }}
      />
    </div>
  );
}

const AI_INSIGHT_FOOTER_HEIGHT = 96;

function AiInsightFooter({
  label,
  labelColor,
  insight,
  confidence,
  pinBottom = true,
}: {
  label?: string;
  labelColor?: string;
  insight: string;
  /** Model confidence score (0–100). Shown instead of a segment/score label when provided. */
  confidence?: number;
  pinBottom?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        flexShrink: 0,
        height: AI_INSIGHT_FOOTER_HEIGHT,
        boxSizing: "border-box",
        marginTop: pinBottom ? "auto" : 0,
        padding: "12px 16px",
        background: cssVar("accent-soft"),
        borderTop: `1px solid ${cssVar("border")}`,
        borderBottom: pinBottom ? undefined : `1px solid ${cssVar("border")}`,
        borderRadius: 0,
      }}
    >
      <Sparkles size={13} strokeWidth={2.4} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0, flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 4,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: cssVar("accent-2"),
              lineHeight: 1.2,
            }}
          >
            AI Insight
          </span>
          {confidence != null ? <ConfidenceChip conf={confidence} /> : null}
          {confidence == null && label && labelColor ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: radius.pill,
                background: `${labelColor}18`,
                color: labelColor,
                border: `1px solid ${labelColor}40`,
              }}
            >
              {label}
            </span>
          ) : null}
        </div>
        <span
          style={{
            flex: 1,
            fontSize: 12,
            color: cssVar("text-secondary"),
            lineHeight: 1.4,
            fontWeight: 500,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textAlign: "justify",
          }}
        >
          {insight}
        </span>
      </div>
    </div>
  );
}

function TotalInteractionsPanel({
  period,
}: {
  period: HappinessPeriodKey;
}): React.ReactElement {
  const deltaLabel = HAPPINESS_PERIODS[period].delta;
  const rows = segmentsRankedByGmvAtRisk(getHappinessSegmentRows(period)).filter(
    (r) => r.key !== "dormant" && r.key !== "frequent",
  );
  const [selectedKey, setSelectedKey] = useState<HappinessSegmentKey>(rows[0]?.key ?? "loyal");
  const selected = rows.find((r) => r.key === selectedKey) ?? rows[0];
  const totalVolume = rows.reduce((sum, r) => sum + r.interactions, 0);
  const tableCols = "1.45fr 1.15fr 0.65fr 0.75fr 0.5fr 0.75fr 0.7fr 0.55fr 0.65fr";

  const headerCell = (label: string, title?: string): React.ReactElement => (
    <span
      key={label}
      title={title}
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.05em",
        color: cssVar("text-muted"),
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: title ? "help" : undefined,
      }}
    >
      {label}
    </span>
  );

  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%", padding: 0, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tableCols,
            columnGap: 10,
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 16px",
            background: cssVar("surface-raised"),
            borderBottom: `1px solid ${cssVar("border")}`,
          }}
        >
          {headerCell("SEGMENT")}
          {headerCell("INTERACTIONS", "Count and share of total contacts")}
          {headerCell("ACTIVE", `Active change ${deltaLabel}`)}
          {headerCell("AOV", "Average order value")}
          {headerCell("CPU", "Contacts per unit (units, not orders)")}
          {headerCell("ATV", "Average transaction value")}
          {headerCell("LTV", "Lifetime value score (0–100) — defines customer lifetime value")}
          {headerCell("RES.", "Resolution rate")}
          {headerCell("GMV", "GMV exposed (₹ Cr)")}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {rows.map((row, idx) => {
            const share = Math.round((row.interactions / totalVolume) * 1000) / 10;
            const isFlat = Math.abs(row.wowDelta) < 0.05;
            const isUp = row.wowDelta > 0;
            const deltaColor = isFlat ? cssVar("text-muted") : isUp ? cssVar("positive") : cssVar("severity-high");
            const arrow = isFlat ? "●" : isUp ? "▲" : "▼";
            const isSelected = row.key === selectedKey;
            const aovColor = ragHigher(row.aov, 2000, 1400);
            const cpuColor = ragLower(row.cpu, 1.2, 2.0);
            const atvColor = ragHigher(row.atv, 1800, 1200);
            const ltvColor = band(row.ltv);
            const resColor = ragHigher(row.resolutionRate, 50, 35);
            const gmvColor = ragHigher(row.gmvAtRiskCr, 25, 15);
            const metricStyle: React.CSSProperties = {
              fontSize: 12.5,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              fontFamily: cssVar("font-numeric"),
              whiteSpace: "nowrap",
            };

            return (
              <button
                key={row.key}
                type="button"
                onClick={() => setSelectedKey(row.key)}
                style={{
                  display: "grid",
                  gridTemplateColumns: tableCols,
                  columnGap: 10,
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border: "none",
                  borderTop: idx === 0 ? "none" : `1px solid ${cssVar("border")}`,
                  borderLeft: isSelected ? `3px solid ${row.color}` : "3px solid transparent",
                  background: isSelected ? `${row.color}14` : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  color: "inherit",
                  flex: 1,
                  minHeight: 52,
                }}
                title={`${row.label} · LTV score ${row.ltv} · AOV ₹${formatInt(row.aov)} · CPU ${row.cpu}`}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: radius.pill,
                    background: `${row.color}18`,
                    color: row.color,
                    border: `1px solid ${row.color}40`,
                    width: "fit-content",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 5,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: cssVar("font-numeric"),
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>
                    {formatInt(row.interactions)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: cssVar("text-muted") }}>({share}%)</span>
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    color: deltaColor,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 9 }}>{arrow}</span>
                  {Math.abs(row.wowDelta).toFixed(1)}%
                </span>
                <span style={{ ...metricStyle, color: aovColor }}>₹{formatInt(row.aov)}</span>
                <span style={{ ...metricStyle, color: cpuColor }} title="Contacts per unit (units, not orders)">
                  {row.cpu.toFixed(1)}
                </span>
                <span style={{ ...metricStyle, color: atvColor }}>₹{formatInt(row.atv)}</span>
                <span style={{ ...metricStyle, color: ltvColor }} title="Lifetime value score — defines customer lifetime value">
                  {row.ltv}
                </span>
                <span style={{ ...metricStyle, color: resColor }}>{row.resolutionRate}%</span>
                <span style={{ ...metricStyle, color: gmvColor, fontWeight: 800 }}>₹{row.gmvAtRiskCr}</span>
              </button>
            );
          })}
        </div>

        {selected ? (
          <AiInsightFooter insight={selected.aiInsight} confidence={selected.aiConfidence} />
        ) : null}
      </div>
    </Card>
  );
}

export function CustomerHappinessDashboard({
  period,
}: {
  period: HappinessPeriodKey;
}): React.ReactElement {
  const { mode } = useTheme();
  const [rfmSel, setRfmSel] = useState<RfmId>("champions");
  const [selectedScore, setSelectedScore] = useState("Happiness Index");
  const [failViewMode, setFailViewMode] = useState<"channel" | "customerSegment">("channel");
  const isDark = mode === "dark";

  const failViewToggle = (
    <div style={{ display: "flex", gap: 8 }}>
      {(
        [
          { id: "channel" as const, label: "By Channel" },
          { id: "customerSegment" as const, label: "By Customer Segment" },
        ] as const
      ).map((tab) => {
        const active = failViewMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFailViewMode(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              background: active ? "#5332FF" : isDark ? "#1a1a1a" : "#FFFFFF",
              color: active ? "#FFFFFF" : isDark ? "#D6D9D8" : "#4a4a4a",
              border: `1px solid ${active ? "#5332FF" : isDark ? "#2a2a2a" : "#E5E5E5"}`,
              boxShadow: active ? "0 2px 8px rgba(83, 50, 255, 0.3)" : "none",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const d = HAPPINESS_DATA[period];
  const meta = HAPPINESS_PERIODS[period];
  const segmentRows = getHappinessSegmentRows(period);
  const fciClusters = getFlipkartFciClustersForRange(period);
  const refundDriver = d.composite.find((c) => c.k === "Returns & refunds")?.s ?? 54;
  const lapsingScore = d.cohorts.find((c) => c.id === "lapsing")?.score ?? 45;

  const metricRows: Array<{
    label: string;
    value: number | string;
    delta: number;
    suffix?: string;
    invertDelta?: boolean;
    aiInsight: string;
  }> = [
    {
      label: "Happiness Index",
      value: d.headline.score,
      delta: d.headline.delta,
      suffix: "/100",
      aiInsight: `Happiness Index is ${d.headline.delta >= 0 ? "up" : "down"} ${Math.abs(d.headline.delta)} pts ${meta.delta}, but refund turnaround is the drag (${d.exec.magnitude}). Lapsing buyers (score ${lapsingScore}) concentrate the pain — act on refund SLA before loyalty softens.`,
    },
    {
      label: "Net Promoter Score",
      value: d.headline.nps,
      delta: d.headline.npsD,
      aiInsight: `NPS at ${d.headline.nps} (${d.headline.npsD > 0 ? "+" : ""}${d.headline.npsD} ${meta.delta}) — promoters rise on Plus delivery wins, but detractors cluster on refund lag. Fix post-pickup refund SLA to convert passive buyers into promoters.`,
    },
    {
      label: "Customer Satisfaction",
      value: d.headline.csat,
      delta: d.headline.csatD,
      suffix: "%",
      aiInsight: `CSAT at ${d.headline.csat}% is soft${d.headline.csatD < 0 ? ` (${d.headline.csatD} pt ${meta.delta})` : ""} with dissatisfaction concentrated in returns and refunds (driver score ${refundDriver}). Prioritise refund confirmation within 24h of pickup scan.`,
    },
    {
      label: "Customer Effort Score",
      value: d.headline.ease,
      delta: d.headline.easeD,
      suffix: "/5",
      aiInsight: `Effort score ${d.headline.ease}/5 (${d.headline.easeD > 0 ? "+" : ""}${d.headline.easeD} ${meta.delta}) — customers still work too hard on refund status and delivery ETA. Self-serve refund tracking and proactive ETA pushes will cut repeat contacts fastest.`,
    },
    {
      label: "Customer Loyalty Index",
      value: d.headline.loyalty,
      delta: d.headline.loyaltyD,
      suffix: "/100",
      aiInsight: `Loyalty Index at ${d.headline.loyalty} (${d.headline.loyaltyD > 0 ? "+" : ""}${d.headline.loyaltyD} ${meta.delta}) holds on Top and Strong, but Priority and Risk cells are slipping on recency. Protect high-GMV cohorts before churn rate reverses.`,
    },
    {
      label: "Customer Churn Rate",
      value: d.headline.churn,
      delta: d.headline.churnD,
      suffix: "%",
      invertDelta: true,
      aiInsight: `Churn at ${d.headline.churn}% (${d.headline.churnD > 0 ? "+" : ""}${d.headline.churnD} pts ${meta.delta}) — improvement is fragile. Lapsing buyers and refund-pain cohorts drive exits. Trigger retention outreach on the 2nd refund complaint within 14 days.`,
    },
    {
      label: "Repeat Purchase Rate",
      value: d.headline.repeatPurchase,
      delta: d.headline.repeatD,
      suffix: "%",
      aiInsight: `Repeat purchase at ${d.headline.repeatPurchase}% (${d.headline.repeatD > 0 ? "+" : ""}${d.headline.repeatD} ${meta.delta}) — Active and Seasonal segments lift frequency, but Occasional buyers stall after a bad delivery. Win-back offers should target post-incident recovery within 7 days.`,
    },
  ];

  const selectedScoreRow = metricRows.find((r) => r.label === selectedScore) ?? metricRows[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: cssVar("font"), color: cssVar("text-primary") }}>
      {/* Scores read — no section number (page headline covers the question) */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(0, 2fr)", gap: 14, alignItems: "stretch" }}>
        <Card
          primary
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            height: "100%",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 18px 0", flex: 1, minHeight: 0 }}>
            <CardQ hint={`Weighted average of delivery, returns, support, product & sentiment · ${meta.period}.`}>
              How happy are they right now?
            </CardQ>
            <div>
              {metricRows.map((row, i) => {
                const isSelected = row.label === selectedScore;
                return (
                  <button
                    key={row.label}
                    type="button"
                    onClick={() => setSelectedScore(row.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "8px 8px",
                      margin: 0,
                      border: "none",
                      borderLeft: isSelected ? `3px solid ${cssVar("accent")}` : "3px solid transparent",
                      borderBottom: i < metricRows.length - 1 ? `1px solid ${cssVar("border")}` : "none",
                      background: isSelected ? cssVar("accent-soft") : "transparent",
                      borderRadius: isSelected ? radius.sm : 0,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      color: "inherit",
                    }}
                    title={`Select ${row.label} for AI insight`}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: isSelected ? cssVar("text-primary") : cssVar("text-muted"),
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    >
                      {row.label}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 7 }}>
                      <b
                        style={{
                          fontSize: 17,
                          fontFamily: cssVar("font-numeric"),
                          fontVariantNumeric: "tabular-nums",
                          color: scoreValueColor(row.label, Number(row.value)),
                        }}
                      >
                        {row.value}
                        {row.suffix ?? ""}
                      </b>
                      <Delta value={row.delta} invert={row.invertDelta} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AiInsightFooter
            label={selectedScoreRow.label}
            labelColor={cssVar("accent-2")}
            insight={selectedScoreRow.aiInsight}
          />
        </Card>

        <TotalInteractionsPanel period={period} />
      </div>

      {/* 01 · RFM */}
      <SectionHeader num="01" title="How do customers score on RFM?" />
      <RfmInteractiveBoard selected={rfmSel} onSelect={setRfmSel} period={period} />

      {/* 02 · What's failing */}
      <SectionHeader num="02" title="What's Failing to the Customer" right={failViewToggle} />
      <FailureClusters
        key={period}
        clusters={fciClusters}
        isDarkMode={isDark}
        showTitle={false}
        showViewModeTabs={false}
        viewMode={failViewMode}
        onViewModeChange={setFailViewMode}
        customerSegments={failCustomerSegments(segmentRows)}
      />

    </div>
  );
}
