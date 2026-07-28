"use client";

import React, { useState } from "react";
import { Cpu, Home, MapPin, Shirt, ShoppingBasket, type LucideIcon } from "lucide-react";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { AISummaryWall } from "@/components/FCI/AISummaryWall";
import {
  HAPPINESS_PERIODS,
  getFlipkartFciClustersForRange,
  getHappinessSegmentRows,
  getRfmSegmentsForRange,
  RFM_ZONES,
  type HappinessPeriodKey,
  type RfmId,
  type RfmSegment,
} from "../../lib/cxHeadRetailV3CustomerHappinessData";
import {
  segmentRevenueAtRiskCr,
  segmentsRankedByGmvAtRisk,
  segmentsRankedByRevenueAtRisk,
  type HappinessSegmentKey,
  type HappinessSegmentRow,
} from "../../lib/cxHeadRetailV3HappinessLensData";
import { getHappinessSegmentInsights } from "../../lib/cxHeadRetailV3HappinessSegmentInsights";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { cssVar, radius } from "../../theme/tokens";
import { HappinessHeadlineKpiCards } from "./HappinessHeadlineKpiCards";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

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

/** Format ₹ Cr for GMV / revenue-at-risk columns. */
function formatCr(n: number): string {
  const v = Math.round(n * 100) / 100;
  const shown = v % 1 !== 0 ? v.toFixed(1) : String(Math.round(v));
  return `₹${shown}`;
}

/** Compact K / M label used in the page headline. */
export function formatCompactInteractions(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 10 ? Math.round(m) : (Math.round(m * 10) / 10).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return formatInt(n);
}

/** Higher is better (NPS, CSAT %, AOV, ATV, resolution %). */
function ragHigher(v: number, good: number, ok: number): string {
  if (v >= good) return cssVar("positive");
  if (v >= ok) return cssVar("severity-med");
  return cssVar("severity-high");
}

/** Lower is better (CES /5, CPU, revenue at risk). */
function ragLower(v: number, good: number, ok: number): string {
  if (v <= good) return cssVar("positive");
  if (v <= ok) return cssVar("severity-med");
  return cssVar("severity-high");
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

function RfmHeatCell({
  seg,
  on,
  intensity,
  heatMode,
  onSelect,
}: {
  seg: RfmSegment;
  on: boolean;
  intensity: number;
  heatMode: RfmHeatMode;
  onSelect: (id: RfmId) => void;
}): React.ReactElement {
  const animatedRev = useAnimatedNumber(seg.rev, { duration: 900, delay: 40 });
  const animatedM = useAnimatedNumber(seg.M, { duration: 800, delay: 40 });
  return (
    <button
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
        {heatMode === "monetary" ? `M${animatedM}` : `${animatedRev}%`}
      </span>
    </button>
  );
}

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
                  <RfmHeatCell
                    key={seg.id}
                    seg={seg}
                    on={on}
                    intensity={intensity}
                    heatMode={heatMode}
                    onSelect={onSelect}
                  />
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

function parseClvNumber(clv: string): number {
  const match = /([\d.]+)/.exec(clv);
  return match ? Number(match[1]) : 0;
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
  const animatedR = useAnimatedNumber(s.R, { duration: 850, delay: 40 });
  const animatedF = useAnimatedNumber(s.F, { duration: 850, delay: 60 });
  const animatedM = useAnimatedNumber(s.M, { duration: 850, delay: 80 });
  const clvN = parseClvNumber(s.clv);
  const animatedClv = useAnimatedNumber(clvN, {
    duration: 900,
    delay: 100,
    decimals: clvN % 1 !== 0 ? 1 : 0,
  });
  const clvSuffix = /k/i.test(s.clv) ? "k" : "";

  const cards: Array<{ label: string; value: React.ReactNode; sub?: string; accent?: string }> = [
    { label: "Recency", value: `${animatedR}/5`, sub: "How recent", accent: s.color },
    { label: "Frequency", value: `${animatedF}/5`, sub: "How often", accent: s.color },
    { label: "Monetary", value: `${animatedM}/5`, sub: "Spend depth", accent: s.color },
    {
      label: "Avg CLV",
      value: `₹${clvN % 1 !== 0 ? animatedClv.toFixed(1) : animatedClv}${clvSuffix}`,
      sub: "Lifetime value",
    },
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
  // Top (R5F5) — recent, frequent, high spend → Loyal / Active / Frequent dominate
  champions: {
    loyal: 44,
    active: 20,
    frequent: 15,
    reactivated: 8,
    occasional: 7,
    seasonal: 4,
    dormant: 2,
  },
  // Strong (R4F5) — consistent repeats just below Top
  loyal: {
    loyal: 46,
    active: 22,
    frequent: 14,
    occasional: 6,
    reactivated: 5,
    seasonal: 5,
    dormant: 2,
  },
  // Growing (R5F3) — recent, building habit
  potential: {
    frequent: 34,
    active: 24,
    occasional: 16,
    reactivated: 10,
    loyal: 8,
    seasonal: 5,
    dormant: 3,
  },
  // Starter (R5F1) — first-order / trial
  new: {
    occasional: 38,
    active: 22,
    seasonal: 12,
    reactivated: 10,
    frequent: 8,
    dormant: 6,
    loyal: 4,
  },
  // Watch (R3F3) — mid value, recency slipping
  attention: {
    occasional: 30,
    active: 22,
    frequent: 16,
    reactivated: 12,
    seasonal: 10,
    loyal: 6,
    dormant: 4,
  },
  // Risk (R2F4) — were valuable, now overdue
  atrisk: {
    reactivated: 36,
    occasional: 16,
    active: 14,
    frequent: 12,
    seasonal: 10,
    loyal: 8,
    dormant: 4,
  },
  // Priority (R1F5) — best buyers gone cold
  cantlose: {
    loyal: 40,
    reactivated: 18,
    frequent: 14,
    active: 12,
    occasional: 8,
    seasonal: 5,
    dormant: 3,
  },
  // Quiet (R2F1) — low recency & frequency
  hibernating: {
    dormant: 50,
    occasional: 16,
    seasonal: 14,
    reactivated: 8,
    active: 6,
    frequent: 4,
    loyal: 2,
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

/**
 * Proportional tracks — extra width is shared across columns so gaps stay even
 * instead of dumping into the name column alone.
 */
const RFM_SEGMENT_COLS =
  "minmax(100px, 1.35fr) minmax(52px, 0.55fr) minmax(48px, 0.5fr) minmax(96px, 0.95fr) minmax(108px, 1.1fr)";
const RFM_SEGMENT_GAP = 10;
const RFM_SEGMENT_PAD_X = 14;

const TOP_CATEGORY_META: Record<string, { color: string; Icon: LucideIcon }> = {
  Electronics: { color: "#8B7CF8", Icon: Cpu },
  Fashion: { color: "#5B9FD4", Icon: Shirt },
  Grocery: { color: "#3DBF9A", Icon: ShoppingBasket },
  Home: { color: "#A78BFA", Icon: Home },
};

const TOP_SELLER_META: Record<
  HappinessSegmentRow["topSeller"],
  { color: string; ink: string }
> = {
  Flipkart: { color: "#2874F0", ink: "#ffffff" },
  Marketplace: { color: "#F59E0B", ink: "#1a1205" },
};

function TopCategoryMark({ category }: { category: string }): React.ReactElement {
  const meta = TOP_CATEGORY_META[category] ?? { color: cssVar("accent"), Icon: ShoppingBasket };
  const { color, Icon } = meta;

  return (
    <span
      title={`Top category · ${category}`}
      aria-label={`Top category ${category}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 9,
        flexShrink: 0,
        background: `linear-gradient(145deg, ${color}40 0%, ${color}18 100%)`,
        border: `1px solid ${color}66`,
        boxShadow: `inset 0 1px 0 ${color}33`,
      }}
    >
      <Icon size={18} strokeWidth={2.2} color={color} />
    </span>
  );
}

function TopSellingPlaceMark({
  place,
}: {
  place: HappinessSegmentRow["topSellingPlace"];
}): React.ReactElement {
  return (
    <span
      title={`Top selling place · ${place.pinCode}, ${place.state}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        width: "100%",
      }}
    >
      <MapPin
        size={13}
        strokeWidth={2.4}
        color={cssVar("severity-med")}
        style={{ flexShrink: 0 }}
        aria-hidden
      />
      <span style={{ display: "inline-flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span
          className="lisn-num"
          style={{
            fontSize: 12,
            fontWeight: 800,
            fontFamily: cssVar("font-numeric"),
            fontVariantNumeric: "tabular-nums",
            color: cssVar("text-primary"),
            lineHeight: 1.15,
            letterSpacing: "0.02em",
          }}
        >
          {place.pinCode}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: cssVar("text-muted"),
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {place.state}
        </span>
      </span>
    </span>
  );
}

function TopSellerLabel({
  seller,
}: {
  seller: HappinessSegmentRow["topSeller"];
}): React.ReactElement {
  const { color, ink } = TOP_SELLER_META[seller];

  return (
    <span
      title={`Top seller · ${seller}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 20,
        padding: "0 9px",
        borderRadius: radius.pill,
        background: color,
        color: ink,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.02em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        border: "none",
        boxShadow: "none",
        width: "fit-content",
      }}
    >
      {seller}
    </span>
  );
}

function rfmSegmentCell(align: "start" | "center"): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: align === "center" ? "center" : "flex-start",
    minWidth: 0,
    width: "100%",
  };
}

function SentimentSegmentRow({
  seg,
  idx,
  linked,
  holdsShare,
  sharePct,
  rfmRevPct,
  rfmColor,
}: {
  seg: HappinessSegmentRow;
  idx: number;
  /** Primary customer segment mapped from the selected RFM cell. */
  linked: boolean;
  /** This row carries share % of the selected RFM cohort. */
  holdsShare: boolean;
  sharePct: number;
  rfmRevPct: number;
  rfmColor: string;
}): React.ReactElement {
  const animatedShare = useAnimatedNumber(sharePct, { duration: 900, delay: 40 + idx * 25 });
  const emphasized = linked || holdsShare;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: RFM_SEGMENT_COLS,
        columnGap: RFM_SEGMENT_GAP,
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: `12px ${RFM_SEGMENT_PAD_X}px`,
        borderTop: idx === 0 ? "none" : `1px solid ${cssVar("border")}`,
        borderLeft: linked
          ? `3px solid ${rfmColor}`
          : holdsShare
            ? `3px solid ${rfmColor}66`
            : "3px solid transparent",
        background: linked ? `${rfmColor}18` : holdsShare ? `${rfmColor}0c` : "transparent",
        opacity: emphasized ? 1 : 0.55,
        fontFamily: "inherit",
        color: "inherit",
        textAlign: "left",
        flex: 1,
        minHeight: 58,
        transition: "background 180ms ease, border-color 180ms ease, opacity 180ms ease",
      }}
      title={`${seg.label} · ${sharePct}% of ${rfmRevPct}% RFM revenue · ${seg.topCategory} · ${seg.topSellingPlace.pinCode}, ${seg.topSellingPlace.state} · ${seg.topSeller}`}
    >
      <div style={rfmSegmentCell("start")}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: emphasized ? 700 : 600,
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

      <div style={rfmSegmentCell("center")}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            fontFamily: cssVar("font-numeric"),
            fontVariantNumeric: "tabular-nums",
            color: cssVar("text-primary"),
            lineHeight: 1,
          }}
          title="Share of selected RFM revenue"
        >
          {animatedShare}%
        </span>
      </div>

      <div style={rfmSegmentCell("center")}>
        <TopCategoryMark category={seg.topCategory} />
      </div>

      <div style={rfmSegmentCell("start")}>
        <TopSellerLabel seller={seg.topSeller} />
      </div>

      <div style={rfmSegmentCell("start")}>
        <TopSellingPlaceMark place={seg.topSellingPlace} />
      </div>
    </div>
  );
}

function SentimentBySegmentPanel({
  selectedRfmId,
  rfmRevPct,
  linkedSegmentKey,
  rfmColor,
  period,
}: {
  selectedRfmId: RfmId;
  /** Selected RFM cell % (e.g. Champions 26) — Share(%) rows split this total. */
  rfmRevPct: number;
  linkedSegmentKey: HappinessSegmentKey;
  rfmColor: string;
  period: HappinessPeriodKey;
}): React.ReactElement {
  const rows = segmentsRankedByGmvAtRisk(getHappinessSegmentRows(period));
  const shareBySegment = allocateSharePct(
    RFM_SHARE_WEIGHTS[selectedRfmId],
    rfmRevPct,
    rows.map((r) => r.key),
  );
  const visibleRows = [...rows]
    .filter((r) => (shareBySegment[r.key] ?? 0) > 0)
    .sort((a, b) => (shareBySegment[b.key] ?? 0) - (shareBySegment[a.key] ?? 0));

  const headerLabel = (align: "start" | "center"): React.CSSProperties => ({
    ...rfmSegmentCell(align),
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    color: cssVar("text-muted"),
    whiteSpace: "nowrap",
  });

  return (
    <Card style={{ borderLeft: `3px solid ${rfmColor}`, padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: RFM_SEGMENT_COLS,
          columnGap: RFM_SEGMENT_GAP,
          alignItems: "center",
          padding: `14px ${RFM_SEGMENT_PAD_X}px 12px`,
          borderBottom: `1px solid ${cssVar("border")}`,
          borderLeft: "3px solid transparent",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 13.5,
            fontWeight: 700,
            color: cssVar("text-primary"),
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Segments
        </h3>
        <span title="Share of selected RFM revenue" style={headerLabel("center")}>
          Rev(%)
        </span>
        <span title="Dominant category driving RFM revenue" style={headerLabel("center")}>
          Top Cat.
        </span>
        <span title="Dominant fulfilment source — Flipkart or Marketplace" style={headerLabel("start")}>
          Top Seller
        </span>
        <span title="Highest-GMV selling pin code and state" style={headerLabel("start")}>
          Top Selling
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {visibleRows.map((seg, idx) => {
          const sharePct = shareBySegment[seg.key] ?? 0;
          return (
            <SentimentSegmentRow
              key={seg.key}
              seg={seg}
              idx={idx}
              linked={seg.key === linkedSegmentKey}
              holdsShare={sharePct > 0}
              sharePct={sharePct}
              rfmRevPct={rfmRevPct}
              rfmColor={rfmColor}
            />
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
      />
    </div>
  );
}

function SegmentTableRow({
  row,
  idx,
  totalVolume,
  tableCols,
  rowHeight,
}: {
  row: HappinessSegmentRow;
  idx: number;
  totalVolume: number;
  tableCols: string;
  rowHeight: number;
}): React.ReactElement {
  const shareExact = totalVolume > 0 ? (row.interactions / totalVolume) * 100 : 0;
  const shareTarget = Math.round(shareExact * 10) / 10;
  const share = useAnimatedNumber(shareTarget, { duration: 900, delay: 60 + idx * 30, decimals: 1 });
  const wowAbs = useAnimatedNumber(Math.abs(row.wowDelta), { duration: 850, delay: 70 + idx * 30, decimals: 1 });
  const cpu = useAnimatedNumber(row.cpu, { duration: 900, delay: 90 + idx * 30, decimals: 1 });
  const csat = useAnimatedNumber(row.csat, { duration: 900, delay: 95 + idx * 30 });
  const fcr = useAnimatedNumber(row.fcr, { duration: 900, delay: 110 + idx * 30 });
  const aov = useAnimatedNumber(row.aov, { duration: 900, delay: 115 + idx * 30 });
  const atv = useAnimatedNumber(row.atv, { duration: 900, delay: 118 + idx * 30 });
  const ltv = useAnimatedNumber(row.ltv, { duration: 900, delay: 120 + idx * 30 });
  const gmv = useAnimatedNumber(row.gmvAtRiskCr, {
    duration: 950,
    delay: 122 + idx * 30,
    decimals: row.gmvAtRiskCr % 1 !== 0 ? 1 : 0,
  });
  const revAtRiskTarget = segmentRevenueAtRiskCr(row);
  const revAtRisk = useAnimatedNumber(revAtRiskTarget, {
    duration: 950,
    delay: 124 + idx * 30,
    decimals: revAtRiskTarget % 1 !== 0 ? 1 : 0,
  });

  const isFlat = Math.abs(row.wowDelta) < 0.05;
  const isUp = row.wowDelta > 0;
  const deltaColor = isFlat ? cssVar("text-muted") : isUp ? cssVar("positive") : cssVar("severity-high");
  const arrow = isFlat ? "●" : isUp ? "▲" : "▼";
  const cpuColor = ragLower(row.cpu, 1.2, 2.0);
  const csatColor = ragHigher(row.csat, 80, 70);
  const fcrColor = ragHigher(row.fcr, 70, 55);
  /** AOV / ATV shown as ₹ Cr (same ₹X.X pattern as GMV). */
  const aovCr = row.aov / 1000;
  const atvCr = row.atv / 1000;
  const aovColor = ragHigher(aovCr, 2.0, 1.4);
  const atvColor = ragHigher(atvCr, 1.8, 1.2);
  const ltvColor = ragHigher(row.ltv, 75, 55);
  /** Higher GMV / ₹ at risk is worse exposure. */
  const gmvColor = ragLower(row.gmvAtRiskCr, 12, 22);
  const revColor = ragLower(revAtRiskTarget, 0.8, 1.5);
  const metricStyle: React.CSSProperties = {
    fontSize: 12.5,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    fontFamily: cssVar("font-numeric"),
    whiteSpace: "nowrap",
    textAlign: "center",
    display: "block",
    width: "100%",
    cursor: "help",
  };
  const aovShown = (aov / 1000).toFixed(1);
  const atvShown = (atv / 1000).toFixed(1);
  const gmvShown = row.gmvAtRiskCr % 1 !== 0 ? gmv.toFixed(1) : String(gmv);
  const revShown = revAtRiskTarget % 1 !== 0 ? revAtRisk.toFixed(1) : String(Math.round(revAtRisk));
  const wowSign = row.wowDelta > 0 ? "+" : row.wowDelta < 0 ? "−" : "";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: tableCols,
        columnGap: 10,
        alignItems: "center",
        justifyItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 16px",
        borderTop: idx === 0 ? "none" : `1px solid ${cssVar("border")}`,
        borderLeft: "3px solid transparent",
        background: "transparent",
        height: rowHeight,
        minHeight: rowHeight,
        flexShrink: 0,
      }}
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
          justifySelf: "start",
        }}
        title={row.label}
      >
        {row.label}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 6,
          fontVariantNumeric: "tabular-nums",
          fontFamily: cssVar("font-numeric"),
          whiteSpace: "nowrap",
          cursor: "help",
        }}
        title={`Share ${shareExact}% · ${formatInt(row.interactions)} contacts · change ${wowSign}${Math.abs(row.wowDelta)}%`}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>
          {share.toFixed(1)}%
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 600,
            color: deltaColor,
          }}
        >
          <span style={{ fontSize: 9 }}>{arrow}</span>
          {wowAbs.toFixed(1)}%
        </span>
      </span>
      <span style={{ ...metricStyle, color: csatColor }} title={`CSAT ${row.csat}%`}>
        {csat}%
      </span>
      <span style={{ ...metricStyle, color: fcrColor }} title={`FCR ${row.fcr}%`}>
        {fcr}%
      </span>
      <span
        style={{ ...metricStyle, color: aovColor, fontWeight: 800 }}
        title={`AOV ₹${aovCr} Cr (₹${formatInt(row.aov)})`}
      >
        {formatCr(Number(aovShown))}
      </span>
      <span
        style={{ ...metricStyle, color: atvColor, fontWeight: 800 }}
        title={`ATV ₹${atvCr} Cr (₹${formatInt(row.atv)})`}
      >
        {formatCr(Number(atvShown))}
      </span>
      <span style={{ ...metricStyle, color: ltvColor }} title={`LTV score ${row.ltv}/100`}>
        {ltv}
      </span>
      <span style={{ ...metricStyle, color: cpuColor }} title={`CPU ${row.cpu}`}>
        {cpu.toFixed(1)}
      </span>
      <span
        style={{ ...metricStyle, color: gmvColor, fontWeight: 800 }}
        title={`GMV ₹${row.gmvAtRiskCr} Cr`}
      >
        {formatCr(Number(gmvShown))}
      </span>
      <span
        style={{ ...metricStyle, color: revColor, fontWeight: 800 }}
        title={`Rev at risk ₹${revAtRiskTarget} Cr (GMV ₹${row.gmvAtRiskCr} Cr × churn ${row.churn}%)`}
      >
        {formatCr(Number(revShown))}
      </span>
    </div>
  );
}

function TotalInteractionsPanel({
  period,
}: {
  period: HappinessPeriodKey;
}): React.ReactElement {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const deltaLabel = HAPPINESS_PERIODS[period].delta;
  const rows = segmentsRankedByRevenueAtRisk(getHappinessSegmentRows(period));
  const totalVolume = rows.reduce((sum, r) => sum + r.interactions, 0);
  const { insights, details } = getHappinessSegmentInsights(period);
  const tableCols = "1.25fr 0.85fr 0.4fr 0.4fr 0.55fr 0.55fr 0.4fr 0.35fr 0.5fr 0.75fr";
  const SEGMENT_ROW_H = 56;

  const headerCell = (
    label: string,
    title?: string,
    align: "center" | "start" = "center",
  ): React.ReactElement => (
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
        textAlign: align,
        width: "100%",
        justifySelf: align,
        cursor: title ? "help" : undefined,
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
      <Card
        style={{
          flex: "1 1 0",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "visible",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tableCols,
            columnGap: 10,
            alignItems: "center",
            justifyItems: "center",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 16px",
            background: cssVar("surface-raised"),
            borderBottom: `1px solid ${cssVar("border")}`,
            flexShrink: 0,
          }}
        >
          {headerCell("SEGMENT", undefined, "start")}
          {headerCell(
            "INTERACTIONS",
            `Share of total contacts and active change ${deltaLabel}`,
          )}
          {headerCell("CSAT", "Customer Satisfaction")}
          {headerCell("FCR", "First Contact Resolution")}
          {headerCell("AOV (₹ cr)", "Average order value (₹ Cr)")}
          {headerCell("ATV (₹ cr)", "Average transaction value (₹ Cr)")}
          {headerCell("LTV", "Lifetime value score (0–100) — not used in Rev at risk")}
          {headerCell("CPU", "Contacts per unit (units, not orders)")}
          {headerCell("GMV (₹ cr)", "GMV exposed (₹ Cr)")}
          {headerCell("REV AT RISK (₹ cr)", "Revenue at risk (₹ Cr) = GMV exposed × churn %")}
        </div>

        <div style={{ background: cssVar("surface") }}>
          {rows.map((row, idx) => (
            <SegmentTableRow
              key={row.key}
              row={row}
              idx={idx}
              totalVolume={totalVolume}
              tableCols={tableCols}
              rowHeight={SEGMENT_ROW_H}
            />
          ))}
        </div>
      </Card>

      {/* AI Summary Wall — parallel to table; compact, no subtitle strip. */}
      <div
        style={{
          flex: "0 0 340px",
          minWidth: 280,
          maxWidth: 380,
          position: "relative",
          alignSelf: "stretch",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <AISummaryWall
            data={insights}
            insightDetailsMap={details}
            isDarkMode={isDark}
            height="100%"
            showSeveritySummary={false}
            compact
          />
        </div>
      </div>
    </div>
  );
}

export function CustomerHappinessDashboard({
  period,
}: {
  period: HappinessPeriodKey;
}): React.ReactElement {
  const { mode } = useTheme();
  const [rfmSel, setRfmSel] = useState<RfmId>("champions");
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

  const segmentRows = getHappinessSegmentRows(period);
  const fciClusters = getFlipkartFciClustersForRange(period);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: cssVar("font"), color: cssVar("text-primary") }}>
      <HappinessHeadlineKpiCards period={period} />

      <div style={{ marginTop: 14 }}>
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
