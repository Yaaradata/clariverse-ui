"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  TRUST_DRIVERS,
  TRUST_RAG,
  TRUST_RANGES,
  TRUST_TOTAL_COMPLAINTS,
  TOP_TRUST_DRIVER,
  getTrustPulse,
  sortDriversBySeverity,
  type TrustRangeKey,
  type TrustRagLevel,
} from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { useAnimatedNumber, usePrefersReducedMotion } from "../../lib/useAnimatedNumber";
import { SpikySparkline } from "../common/MiniSparkline";
import { ConfidenceChip } from "../common/ConfidenceBand";
import { cssVar, radius, space, type } from "../../theme/tokens";

const nf = new Intl.NumberFormat("en-IN");
const fmt = (n: number): string => nf.format(Math.round(n));
const fmtK = (n: number): string => (Math.abs(n) >= 1000 ? `${Math.round(n / 1000)} K` : fmt(n));
const TRUST_TARGET = 80;

function useMountReveal(delay = 0): React.CSSProperties {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const timeout = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, reducedMotion]);

  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.55s ease, transform 0.55s ease",
  };
}

/** Compact KPI number scale — headline without oversized display type */
const kpiType = {
  gaugeScore: 40,
  hero: 22,
  stat: 14,
  sub: 12,
} as const;

function ragColor(rag: TrustRagLevel): string {
  switch (rag) {
    case "good":
      return cssVar("positive");
    case "watch":
      return cssVar("severity-med");
    case "high":
    case "crit":
      return cssVar("severity-high");
    default: {
      const _exhaustive: never = rag;
      return _exhaustive;
    }
  }
}

/** Arc fill from score — 72 at target gap reads amber, not critical red */
function trustGaugeColor(value: number): string {
  if (value >= TRUST_TARGET) return cssVar("positive");
  if (value >= 65) return cssVar("severity-med");
  return cssVar("severity-high");
}

function trendColor(value: number, goodWhenDown: boolean): string {
  const isGood = goodWhenDown ? value <= 0 : value >= 0;
  return isGood ? cssVar("positive") : cssVar("severity-high");
}

function KpiStatLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }): React.ReactElement {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: "0.40px",
        textTransform: "uppercase",
        color: cssVar("text-muted"),
        marginBottom: 15,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function KpiCardTitle({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.25 }}>
      {children}
    </span>
  );
}

function KpiShell({
  accent,
  title,
  signal,
  body,
  meta,
  footer,
  compact = false,
  bodyAlign = "center",
}: {
  accent: string;
  title: React.ReactNode;
  signal?: React.ReactNode;
  body: React.ReactNode;
  meta?: React.ReactNode;
  footer?: React.ReactNode;
  compact?: boolean;
  bodyAlign?: "start" | "center";
}): React.ReactElement {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateRows: compact ? "auto 1fr" : "auto 1fr auto auto",
        minHeight: compact ? 0 : 210,
        height: "100%",
        padding: compact ? `${space["3"]} ${space["3"]} ${space["3"]}` : `${space["3"]} ${space["4"]} ${space["3"]}`,
        borderRadius: radius.lg,
        background: `linear-gradient(160deg, ${cssVar("surface-raised")} 0%, ${cssVar("surface")} 55%)`,
        border: `1px solid ${cssVar("border")}`,
        borderTop: `1px solid ${accent}55`,
        boxShadow: cssVar("shadow-card"),
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)`,
        }}
      />
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["2"],
          minHeight: 22,
          marginBottom: bodyAlign === "start" ? space["1"] : compact ? space["2"] : space["2"],
          paddingLeft: 2,
        }}
      >
        {typeof title === "string" ? <KpiCardTitle>{title}</KpiCardTitle> : title}
        {signal}
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: compact || bodyAlign === "start" ? "flex-start" : "center",
          minHeight: 0,
          paddingLeft: 2,
          flex: 1,
        }}
      >
        {body}
      </div>

      {!compact && meta ? (
        <div style={{ marginTop: space["2"], paddingLeft: 2 }}>
          {meta}
        </div>
      ) : compact ? null : (
        <div />
      )}

      {!compact && footer ? (
        <footer
          style={{
            marginTop: space["3"],
            paddingTop: space["3"],
            borderTop: `1px solid ${cssVar("border")}`,
            paddingLeft: 2,
          }}
        >
          {footer}
        </footer>
      ) : null}
    </article>
  );
}

function KpiTrend({
  value,
  periodLabel,
  goodWhenDown = true,
  suffix = "%",
}: {
  value: number;
  periodLabel: string;
  goodWhenDown?: boolean;
  suffix?: string;
}): React.ReactElement {
  const up = value >= 0;
  const color = trendColor(value, goodWhenDown);
  const TrendIcon = up ? TrendingUp : TrendingDown;

  return (
    <span
      className="lisn-num"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        fontWeight: type.weight.bold,
        color,
        padding: "3px 7px",
        borderRadius: radius.pill,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        lineHeight: 1,
      }}
    >
      <TrendIcon size={11} strokeWidth={2.5} />
      {up ? "+" : ""}
      {value}
      {suffix}
      <span style={{ color: cssVar("text-muted"), fontWeight: type.weight.semibold }}>{periodLabel}</span>
    </span>
  );
}

function MetaPair({
  left,
  right,
  stacked = false,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  stacked?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: stacked ? "1fr" : "1fr 1fr",
        gap: space["2"],
        padding: "8px 10px",
        borderRadius: radius.sm,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
      }}
    >
      <div style={{ minWidth: 0 }}>{left}</div>
      <div
        style={{
          minWidth: 0,
          ...(stacked
            ? { borderTop: `1px solid ${cssVar("border")}`, paddingTop: space["2"] }
            : { borderLeft: `1px solid ${cssVar("border")}`, paddingLeft: space["2"] }),
        }}
      >
        {right}
      </div>
    </div>
  );
}

function MetaStat({
  label,
  value,
  color,
  valueSize,
}: {
  label: string;
  value: string;
  color?: string;
  valueSize?: number;
}): React.ReactElement {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.35px", textTransform: "uppercase", color: cssVar("text-muted"), marginBottom: 4 }}>
        {label}
      </div>
      <div
        className="lisn-num"
        style={{
          fontSize: valueSize ?? type.scale.small,
          fontWeight: type.weight.bold,
          color: color ?? cssVar("text-primary"),
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/** Trust Index 2×2 stat tile — primary value scale (matches Gap to target) */
const statTileValue = {
  valueSize: 22,
  valueWeight: 700,
  valueLineHeight: 1.2,
} as const;

/** Top Trust Breaker side rail — compact stack inside inner card */
const breakerSideValue = {
  valueSize: 17,
  valueWeight: 700,
  valueLineHeight: 1.3,
} as const;

function BreakerSideStat({
  label,
  value,
  color = cssVar("text-primary"),
  bordered = false,
}: {
  label: string;
  value: string;
  color?: string;
  bordered?: boolean;
}): React.ReactElement {
  return (
    <div style={bordered ? { borderTop: `1px solid ${cssVar("border")}`, paddingTop: 6 } : undefined}>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 900,
          letterSpacing: "0.35px",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <span
        className="lisn-num"
        style={{
          fontSize: breakerSideValue.valueSize,
          fontWeight: breakerSideValue.valueWeight,
          color,
          lineHeight: breakerSideValue.valueLineHeight,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function BreakerHowToDeal({ text }: { text: string }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        marginTop: 10,
        padding: "10px 12px",
        background: cssVar("accent-soft"),
        borderRadius: radius.md,
        border: `1px solid ${cssVar("accent")}28`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Sparkles size={14} strokeWidth={2.4} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("accent-2"),
            marginBottom: 4,
            lineHeight: 1.2,
          }}
        >
          AI · How to deal
        </div>
        <div style={{ marginBottom: 4 }}>
          <ConfidenceChip conf={90} small />
        </div>
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45, fontWeight: 500 }}>{text}</span>
      </div>
    </div>
  );
}

function TrustIndexAiInsight({ text }: { text: string }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        marginTop: 0,
        padding: "8px 10px",
        background: cssVar("accent-soft"),
        borderRadius: radius.md,
        border: `1px solid ${cssVar("accent")}28`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Sparkles size={13} strokeWidth={2.4} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("accent-2"),
            marginBottom: 3,
            lineHeight: 1.2,
          }}
        >
          AI Insight
        </div>
        <div style={{ marginBottom: 3 }}>
          <ConfidenceChip conf={91} small />
        </div>
        <span style={{ fontSize: 11.5, color: cssVar("text-secondary"), lineHeight: 1.4, fontWeight: 500 }}>{text}</span>
      </div>
    </div>
  );
}

function BreakerSideMetrics({
  contacts,
  repeatContactRate,
}: {
  contacts: string;
  repeatContactRate: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        padding: "6px 9px 7px",
        borderRadius: radius.sm,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        minWidth: 0,
        marginTop: -12,
      }}
    >
      <BreakerSideStat label="Contacts" value={contacts} />
      <BreakerSideStat label="Repeat rate" value={repeatContactRate} color={cssVar("severity-med")} bordered />
    </div>
  );
}

function BreakerShareMetric({
  share,
  wow,
  periodLabel,
}: {
  share: number;
  wow: number;
  periodLabel: string;
}): React.ReactElement {
  const up = wow >= 0;
  const trendTone = trendColor(wow, true);
  const TrendIcon = up ? TrendingUp : TrendingDown;
  const animatedShare = useAnimatedNumber(share, { duration: 950, delay: 180 });
  const revealStyle = useMountReveal(140);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5, minWidth: 0, width: "100%", marginLeft: 16, ...revealStyle }}>
      <span
        className="lisn-num"
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: cssVar("text-primary"),
          lineHeight: 1,
        }}
      >
        {animatedShare}%
      </span>
      <span style={{ fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.2 }}>of trust complaints</span>
      <span
        className="lisn-num"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          lineHeight: 1.25,
          whiteSpace: "nowrap",
        }}
      >
        <TrendIcon size={12} strokeWidth={2.5} color={trendTone} />
        <span style={{ color: trendTone, fontWeight: type.weight.bold }}>
          {up ? "+" : ""}
          {wow}%
        </span>
        <span style={{ color: cssVar("text-muted"), fontWeight: type.weight.semibold }}>{periodLabel}</span>
      </span>
    </div>
  );
}

function TrustOutcomeSignalRow({
  label,
  value,
  delta,
  spark,
  decimals = 2,
  goodWhenUp = true,
  revealDelay = 200,
  isLast = false,
  suffix = "",
  labelSub,
}: {
  label: string;
  value: number;
  delta: number;
  spark: readonly number[];
  decimals?: number;
  goodWhenUp?: boolean;
  revealDelay?: number;
  isLast?: boolean;
  suffix?: string;
  labelSub?: string;
}): React.ReactElement {
  const trendTone = trendColor(delta, !goodWhenUp);
  const animatedValue = useAnimatedNumber(value, { duration: 900, delay: revealDelay, decimals });
  const revealStyle = useMountReveal(revealDelay);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(76px, auto) minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 12,
        padding: "11px 0",
        borderBottom: isLast ? undefined : `1px solid ${cssVar("border")}`,
        minWidth: 0,
        ...revealStyle,
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          fontSize: 12,
          fontWeight: 600,
          color: cssVar("text-primary"),
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        <span>{label}</span>
        {labelSub ? <span>{labelSub}</span> : null}
      </span>
      <div style={{ minWidth: 0, height: 36, padding: "0 4px" }}>
        <SpikySparkline data={[...spark]} color={trendTone} height={36} strokeWidth={2.4} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "flex-end", minWidth: 52 }}>
        <span
          className="lisn-num"
          style={{ fontSize: 18, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}
        >
          {animatedValue.toFixed(decimals)}
          {suffix}
        </span>
        <span className="lisn-num" style={{ fontSize: 10, fontWeight: 600, color: trendTone, lineHeight: 1 }}>
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(decimals)}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function StatTileDetail({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ fontSize: 9.5, color: cssVar("text-muted"), lineHeight: 1.3, marginTop: 3 }}>{children}</div>
  );
}

function StatTileTrendDetail({
  value,
  periodLabel,
  goodWhenDown = true,
}: {
  value: number;
  periodLabel: string;
  goodWhenDown?: boolean;
}): React.ReactElement {
  const up = value >= 0;
  const color = trendColor(value, goodWhenDown);
  const TrendIcon = up ? TrendingUp : TrendingDown;

  return (
    <StatTileDetail>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <TrendIcon size={10} strokeWidth={2.5} color={color} />
        <span style={{ color, fontWeight: type.weight.semibold }}>
          {up ? "+" : ""}
          {value}%
        </span>
        <span>{periodLabel}</span>
      </span>
    </StatTileDetail>
  );
}

function DetailMetaStat({
  label,
  value,
  detail,
  color,
  valueSize,
  valueWeight,
  valueLineHeight,
  valueTrend,
  labelMarginBottom,
}: {
  label: string;
  value: string;
  detail?: string;
  color?: string;
  valueSize?: number;
  valueWeight?: number;
  valueLineHeight?: number;
  valueTrend?: { value: number; periodLabel: string; goodWhenDown?: boolean };
  labelMarginBottom?: number;
}): React.ReactElement {
  const resolvedValueSize = valueSize ?? statTileValue.valueSize;
  const resolvedValueWeight = valueWeight ?? statTileValue.valueWeight;
  const resolvedValueLineHeight = valueLineHeight ?? statTileValue.valueLineHeight;
  const resolvedColor = color ?? cssVar("text-primary");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minWidth: 0,
        width: "100%",
        gap: 2,
      }}
    >
      <KpiStatLabel
        style={{
          marginBottom: labelMarginBottom ?? 2,
          letterSpacing: "0.3px",
          fontWeight: 700,
        }}
      >
        {label}
      </KpiStatLabel>
      <span
        className="lisn-num"
        style={{
          fontSize: resolvedValueSize,
          fontWeight: resolvedValueWeight,
          color: resolvedColor,
          lineHeight: resolvedValueLineHeight,
          maxWidth: "100%",
        }}
      >
        {value}
      </span>
      {valueTrend ? (
        <StatTileTrendDetail
          value={valueTrend.value}
          periodLabel={valueTrend.periodLabel}
          goodWhenDown={valueTrend.goodWhenDown ?? true}
        />
      ) : detail ? (
        <StatTileDetail>{detail}</StatTileDetail>
      ) : null}
    </div>
  );
}

function TrustIndexStatTile({
  label,
  value,
  detail,
  color,
  valueSize,
  valueWeight,
  valueLineHeight,
  valueTrend,
  revealDelay,
}: {
  label: string;
  value: string;
  detail?: string;
  color?: string;
  valueSize?: number;
  valueWeight?: number;
  valueLineHeight?: number;
  valueTrend?: { value: number; periodLabel: string; goodWhenDown?: boolean };
  revealDelay: number;
}): React.ReactElement {
  const revealStyle = useMountReveal(revealDelay);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8px 10px",
        borderRadius: radius.sm,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
        ...revealStyle,
      }}
    >
      <DetailMetaStat
        label={label}
        value={value}
        detail={detail}
        color={color}
        valueSize={valueSize ?? kpiType.stat}
        valueWeight={valueWeight}
        valueLineHeight={valueLineHeight}
        valueTrend={valueTrend}
      />
    </div>
  );
}

function TrustIndexStatGrid({
  gap,
  accent,
  currentState,
  targetPct,
  customersImpacted,
  totalComplaints,
  periodLabel,
  rangeDelta,
  customersDelta,
  cliffCount,
}: {
  gap: number;
  accent: string;
  currentState: string;
  targetPct: number;
  customersImpacted: number;
  totalComplaints: number;
  periodLabel: string;
  rangeDelta: string;
  customersDelta: number;
  cliffCount: number;
}): React.ReactElement {
  const animatedCustomers = useAnimatedNumber(customersImpacted, { duration: 900, delay: 260 });
  const animatedContacts = useAnimatedNumber(totalComplaints, { duration: 900, delay: 320 });
  void gap;
  void accent;
  void currentState;
  void targetPct;

  const items: {
    label: string;
    value: string;
    detail?: string;
    color?: string;
    valueTrend?: { value: number; periodLabel: string; goodWhenDown?: boolean };
    valueSize?: number;
    valueWeight?: number;
    valueLineHeight?: number;
    revealDelay: number;
  }[] = [
    {
      label: "Customers Impacted",
      value: fmtK(animatedCustomers),
      color: cssVar("accent"),
      valueTrend: { value: customersDelta, periodLabel: rangeDelta },
      revealDelay: 120,
      ...statTileValue,
    },
    {
      label: "Cliff events live",
      value: String(cliffCount),
      detail: cliffCount > 0 ? "Browse cliff cards below" : "No live cliffs",
      color: cliffCount > 0 ? cssVar("severity-high") : cssVar("positive"),
      revealDelay: 180,
      ...statTileValue,
    },
    {
      label: "Top severity",
      value: TOP_TRUST_DRIVER.label,
      detail: `Blast ${TOP_TRUST_DRIVER.blastRadius} · ${TOP_TRUST_DRIVER.cliffOrSlope}`,
      color: cssVar("severity-high"),
      revealDelay: 240,
      valueSize: 13,
      valueWeight: 700,
      valueLineHeight: 1.25,
    },
    {
      label: "Safe Contacts",
      value: fmt(animatedContacts),
      detail: periodLabel,
      color: cssVar("text-primary"),
      revealDelay: 300,
      ...statTileValue,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gridTemplateRows: "auto auto",
        gap: space["2"],
        width: "100%",
        alignContent: "start",
      }}
    >
      {items.map((item) => (
        <TrustIndexStatTile
          key={item.label}
          label={item.label}
          value={item.value}
          detail={item.detail}
          color={item.color}
          valueSize={item.valueSize}
          valueWeight={item.valueWeight}
          valueLineHeight={item.valueLineHeight}
          valueTrend={item.valueTrend}
          revealDelay={item.revealDelay}
        />
      ))}
    </div>
  );
}

function arcPoint(fraction: number): { x: number; y: number } {
  const angle = Math.PI * (1 - fraction);
  return { x: 100 + 80 * Math.cos(angle), y: 98 - 80 * Math.sin(angle) };
}

/** Inner L-bracket tick on the arc — marks prior level just before target */
function arcPriorBracketPath(fraction: number): string {
  const angle = Math.PI * (1 - fraction);
  const cx = 100;
  const cy = 98;
  const r = 80;
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);

  const nux = (cx - x) / (Math.hypot(cx - x, cy - y) || 1);
  const nuy = (cy - y) / (Math.hypot(cx - x, cy - y) || 1);
  const tux = -Math.sin(angle);
  const tuy = Math.cos(angle);

  const anchor = { x: x + nux * 6, y: y + nuy * 6 };
  const inward = { x: anchor.x + nux * 9, y: anchor.y + nuy * 9 };
  const alongArc = { x: inward.x - tux * 8, y: inward.y - tuy * 8 };

  return `M ${anchor.x} ${anchor.y} L ${inward.x} ${inward.y} L ${alongArc.x} ${alongArc.y}`;
}

function TrustIndexGauge({
  value,
  prior,
  delta,
  targetPct,
}: {
  value: number;
  prior: number;
  delta: number;
  targetPct: number;
}): React.ReactElement {
  const gradientId = useUniqueGradientId("trust-kpi-gauge");
  const trackId = useUniqueGradientId("trust-kpi-track");
  const animatedValue = useAnimatedNumber(value, { duration: 1100, delay: 80 });
  const animatedTargetPct = useAnimatedNumber(targetPct, { duration: 850, delay: 420 });
  const revealStyle = useMountReveal(40);
  const c = trustGaugeColor(animatedValue);
  const targetPt = arcPoint(TRUST_TARGET / 100);
  const scaleMarks = [0, 50, TRUST_TARGET, 100];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: space["2"], ...revealStyle }}>
      <svg viewBox="0 0 200 118" width="100%" height="auto" style={{ display: "block", maxHeight: 160 }} role="img" aria-label={`Trust Index ${animatedValue}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c} stopOpacity={0.7} />
            <stop offset="100%" stopColor={c} />
          </linearGradient>
          <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={cssVar("border")} />
            <stop offset="100%" stopColor={`${cssVar("text-muted")}55`} />
          </linearGradient>
        </defs>
        <path d="M 20 98 A 80 80 0 0 1 180 98" fill="none" stroke={`url(#${trackId})`} strokeWidth="12" strokeLinecap="round" pathLength="100" opacity={0.9} />
        <path
          d="M 20 98 A 80 80 0 0 1 180 98"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${animatedValue} 100`}
        />
        {scaleMarks.map((mark) => {
          const pt = arcPoint(mark / 100);
          return (
            <g key={mark}>
              <line x1={pt.x} x2={pt.x} y1={pt.y - 5} y2={pt.y + 5} stroke={cssVar("text-muted")} strokeWidth="1" opacity={0.45} />
              <text x={pt.x} y={pt.y + (mark === 50 ? -12 : 16)} textAnchor="middle" className="lisn-num" style={{ fontSize: 7.5, fontWeight: 600, fill: cssVar("text-muted") }}>
                {mark}
              </text>
            </g>
          );
        })}
        <path
          d={arcPriorBracketPath(prior / 100)}
          fill="none"
          stroke={cssVar("text-muted")}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <circle cx={targetPt.x} cy={targetPt.y} r={4} fill={cssVar("positive")} />
        <text
          x={targetPt.x + 12}
          y={targetPt.y - 16}
          textAnchor="middle"
          style={{ fontSize: 7, fontWeight: 700, fill: cssVar("positive"), letterSpacing: "0.5px" }}
        >
          TARGET
        </text>
        <text
          x="100"
          y="80"
          textAnchor="middle"
          className="lisn-num"
          style={{ fontSize: kpiType.gaugeScore, fontWeight: 820, fill: cssVar("text-primary"), letterSpacing: "-0.02em" }}
        >
          {animatedValue}
        </text>
        <text x="100" y="94" textAnchor="middle" style={{ fontSize: 9, fontWeight: 600, fill: cssVar("text-muted") }}>
          / 100 composite
        </text>
        <text x="100" y="108" textAnchor="middle" className="lisn-num" style={{ fontSize: 9, fontWeight: 700, fill: cssVar("severity-med") }}>
          {delta > 0 ? "+" : ""}
          {delta} vs prior ({prior})
        </text>
      </svg>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: space["2"],
          padding: "2px 4px 0",
          alignItems: "start",
        }}
      >
        <div style={{ textAlign: "center", minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              color: cssVar("text-muted"),
              lineHeight: 1.2,
            }}
          >
            Max Target
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: cssVar("positive"),
              marginTop: 3,
              lineHeight: 1.2,
            }}
          >
            {animatedTargetPct}%
          </div>
        </div>
        <div style={{ textAlign: "center", borderLeft: `1px solid ${cssVar("border")}`, minWidth: 0, paddingLeft: 6 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              color: cssVar("text-muted"),
              lineHeight: 1.2,
            }}
          >
            Validation
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: cssVar("severity-med"),
              marginTop: 3,
              lineHeight: 1.25,
            }}
          >
            CSAT · NPS pending
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustIndexRiskCard({
  trustIndex,
  trustDelta,
  trustRag,
  insight,
  modelConfidence,
  cliffCount,
  rangeLabel,
  rangeDelta,
  periodLabel,
  totalComplaints,
  customersImpacted,
  customersDelta,
}: {
  trustIndex: number;
  trustDelta: number;
  trustRag: TrustRagLevel;
  insight: string;
  modelConfidence: number;
  cliffCount: number;
  rangeLabel: string;
  rangeDelta: string;
  periodLabel: string;
  totalComplaints: number;
  customersImpacted: number;
  customersDelta: number;
}): React.ReactElement {
  const accent = ragColor(trustRag);
  const gap = TRUST_TARGET - trustIndex;
  const prior = trustIndex - trustDelta;
  const targetPct = Math.round((trustIndex / TRUST_TARGET) * 100);

  return (
    <KpiShell
      accent={accent}
      compact
      title="Trust Index & signal level"
      signal={
        <div style={{ display: "flex", alignItems: "center", gap: space["2"], flexWrap: "wrap", justifyContent: "flex-end" }}>
          <KpiTrend value={trustDelta} periodLabel={rangeLabel} suffix=" pts" goodWhenDown={false} />
          <ConfidenceChip conf={modelConfidence} small />
        </div>
      }
      body={
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            flex: 1,
            minHeight: 184,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: `${space["2"]} ${space["3"]} ${space["2"]} 0`,
              borderRight: `1px solid ${cssVar("border")}`,
              minWidth: 0,
            }}
          >
            <TrustIndexGauge
              value={trustIndex}
              prior={prior}
              delta={trustDelta}
              targetPct={targetPct}
            />
          </div>
          <div
            style={{
              padding: `${space["1"]} 0 ${space["2"]} ${space["2"]}`,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 8,
            }}
          >
            <TrustIndexStatGrid
              gap={gap}
              accent={accent}
              currentState={TRUST_RAG[trustRag].label}
              targetPct={targetPct}
              customersImpacted={customersImpacted}
              totalComplaints={totalComplaints}
              periodLabel={periodLabel}
              rangeDelta={rangeDelta}
              customersDelta={customersDelta}
              cliffCount={cliffCount}
            />
            <TrustIndexAiInsight text={insight} />
          </div>
        </div>
      }
    />
  );
}

function AnimatedKpiColumn({ children, delay }: { children: React.ReactNode; delay: number }): React.ReactElement {
  const revealStyle = useMountReveal(delay);
  return <div style={{ ...revealStyle, height: "100%", minWidth: 0 }}>{children}</div>;
}

export function TrustPulseKpiCards({ range }: { range: TrustRangeKey }): React.ReactElement {
  const R = TRUST_RANGES[range];
  const pulse = getTrustPulse(range);
  const scale = (n: number): number => n * R.f;
  const trustRag = pulse.trustRag;
  const topBreaker = sortDriversBySeverity(TRUST_DRIVERS)[0] ?? TOP_TRUST_DRIVER;
  const TopBreakerIcon = topBreaker.icon;
  const breakerComplaints = scale(topBreaker.complaints);
  const impacted = pulse.customersImpacted;
  const totalComplaints = scale(TRUST_TOTAL_COMPLAINTS);
  const animatedBreakerContacts = useAnimatedNumber(breakerComplaints, { duration: 900, delay: 240 });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(228px, 1fr))",
        gap: space["3"],
        alignItems: "stretch",
      }}
    >
      <div style={{ gridColumn: "span 2", minWidth: 0 }}>
        <AnimatedKpiColumn delay={0}>
          <TrustIndexRiskCard
            trustIndex={pulse.trustIndex}
            trustDelta={pulse.trustDelta}
            trustRag={trustRag}
            insight={pulse.insight}
            modelConfidence={pulse.modelConfidence}
            cliffCount={pulse.cliffCount}
            rangeLabel={R.delta}
            rangeDelta={R.delta}
            periodLabel={R.period}
            totalComplaints={totalComplaints}
            customersImpacted={impacted}
            customersDelta={pulse.customersDelta}
          />
        </AnimatedKpiColumn>
      </div>

      <AnimatedKpiColumn delay={90}>
        <KpiShell
          accent={cssVar("severity-high")}
          title="Top Trust Breaker"
          signal={<ConfidenceChip conf={topBreaker.confidence} small />}
          bodyAlign="start"
          body={
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 25, lineHeight: 2.5 }}>
                <div
                  style={{
                    width: "1.35em",
                    height: "1.35em",
                    borderRadius: 10,
                    background: `linear-gradient(145deg, ${cssVar("severity-high")}24, ${cssVar("severity-high")}08)`,
                    border: `1px solid ${cssVar("severity-high")}45`,
                    boxShadow: `0 6px 16px ${cssVar("severity-high")}16`,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <TopBreakerIcon size={30} color={cssVar("severity-high")} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    minWidth: 0,
                    flex: "1 1 0%",
                    fontWeight: 800,
                    color: cssVar("text-primary"),
                    whiteSpace: "nowrap",
                  }}
                >
                  {topBreaker.label}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.12fr) minmax(0, 0.88fr)",
                  alignItems: "start",
                  columnGap: 12,
                  marginTop: 4,
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <BreakerShareMetric
                  share={pulse.topBreakerShare}
                  wow={pulse.topBreakerWow}
                  periodLabel={R.delta}
                />
                <BreakerSideMetrics
                  contacts={fmt(animatedBreakerContacts)}
                  repeatContactRate={`${topBreaker.repeat}×`}
                />
              </div>
              <BreakerHowToDeal text={topBreaker.next} />
            </div>
          }
        />
      </AnimatedKpiColumn>

      <AnimatedKpiColumn delay={160}>
        <KpiShell
          accent={cssVar("accent-2")}
          title="Trust outcome signals"
          bodyAlign="start"
          body={
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <TrustOutcomeSignalRow
                label="Sentiment"
                value={pulse.sentimentScore}
                delta={pulse.sentimentDelta}
                spark={pulse.sentimentSpark}
                revealDelay={200}
              />
              <TrustOutcomeSignalRow
                label="Resolution"
                value={pulse.resolutionScore}
                delta={pulse.resolutionDelta}
                spark={pulse.resolutionSpark}
                revealDelay={260}
              />
              <TrustOutcomeSignalRow
                label="CSAT"
                value={pulse.csatScore}
                delta={pulse.csatDelta}
                spark={pulse.csatSpark}
                decimals={1}
                revealDelay={320}
              />
              <TrustOutcomeSignalRow
                label="Repeat-contact"
                labelSub="Rate"
                value={pulse.repeatContactRate}
                delta={pulse.repeatContactDelta}
                spark={pulse.repeatContactSpark}
                decimals={1}
                suffix="×"
                goodWhenUp={false}
                revealDelay={380}
                isLast
              />
            </div>
          }
        />
      </AnimatedKpiColumn>
    </div>
  );
}
