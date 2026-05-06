"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CustomerCardJourneyV3Drill,
  FraudAndFulfillmentV3Drill,
  MarketReputationV3Drill,
} from "./CreditCardsV3DrillDownScreens";
import { DashboardThemeProvider, useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";
import {
  V3_AI_DAY_PROMPTS,
  V3_RISK_SPIKES,
  V3_TILES,
  severityTone,
  type V3Tile,
} from "@/lib/role-based-dashboard/creditCardsV3Data";
import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";

/** Aligned with Head of Retail unified drill (unified nav): #0d0d0d canvas, #1f1f1f / #393939 borders, zinc body text. */
const HEAD_CREDIT_CARDS_V3_DEFAULT_THEME: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#0d0d0d",
  surface: "#151515",
  card: "#0d0d0d",
  elevated: "#1a1a1a",
  border: "#1f1f1f",
  borderLight: "#393939",
  text: "#ffffff",
  textSec: "#e8e9e9",
  textMut: "#939394",
};

type V3DrillId = "customer_card_journey" | "market_reputation" | "fraud_fulfillment";

export type HeadOfCreditCardsV3DashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

function toneToColor(tone: "red" | "amber" | "gold" | "green", T: DashboardThemeTokens) {
  if (tone === "red") return T.red;
  if (tone === "amber") return T.amber;
  if (tone === "gold") return T.gold;
  return T.green;
}

/** Low-alpha tint for card chrome / AI panel (keeps per-tile accent from hex). */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  return null;
}

function withAlpha(hex: string, a: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${a})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

/** Area chart stroke/fill from net D1→D6: up = green, roughly flat = amber, down = red. */
function trendLineColorFromSpark(spark: V3Tile["spark"], T: DashboardThemeTokens): string {
  const diff = spark[spark.length - 1] - spark[0];
  const flatBand = 1;
  if (diff > flatBand) return T.green;
  if (diff < -flatBand) return T.red;
  return T.amber;
}

function MiniHalfGauge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: clamped, fill: color }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0, gap: 6 }}>
      <div style={{ position: "relative", width: "100%", height: 58 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} startAngle={180} endAngle={0} innerRadius={32} outerRadius={46} cx="50%" cy="100%">
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#39393990" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 2,
            transform: "translateX(-50%)",
            fontSize: 14,
            fontWeight: 800,
            color,
            fontFamily: "var(--mono)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {clamped}%
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "rgb(185, 185, 186)",
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          whiteSpace: "normal",
          overflow: "visible",
          lineHeight: 1.2,
          minHeight: 30,
          paddingTop: 2,
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Compact Conversation AI block — matches Credit Cards executive prototype (left bar only, dense copy). */
function ConversationAICallout({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.35)",
        borderRadius: 10,
        padding: "14px 16px",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="1" y="4" width="14" height="10" rx="2" stroke={accent} strokeWidth="1.2" fill="none" />
          <path d="M4 1L8 4L12 1" stroke={accent} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Conversation AI
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TILE  —  shared anatomy, matches Head of Retail Banking pattern
// ═══════════════════════════════════════════════════════════════════
const V3_TREND_Y_PAD: Record<V3Tile["id"], { below: number; above: number }> = {
  customer_card_journey: { below: 6, above: 4 },
  market_reputation: { below: 6, above: 4 },
  fraud_fulfillment: { below: 8, above: 5 },
};

function ExecutiveTile({ tile, onOpen }: { tile: V3Tile; onOpen: () => void }) {
  const T = useDashboardTheme();
  const visualTone = tile.id === "customer_card_journey" ? "#00e5c8" : tile.id === "market_reputation" ? "#f97316" : "#ef4444";
  const trendData = tile.spark.map((v, i) => ({ w: `D${i + 1}`, v }));
  const trendPad = V3_TREND_Y_PAD[tile.id];
  const tileIcon = tile.id === "customer_card_journey" ? Target : tile.id === "market_reputation" ? Shield : Activity;
  const TileIcon = tileIcon;

  type KeyStat = {
    label: string;
    value: string;
    sub: string;
    /** When set, overrides default value color for this cell */
    valueColor?: string;
    /** Per-cell horizontal alignment inside the 2-col row */
    align?: "start" | "end";
    /** Muted sub-label in a pill (Fraud & Fulfillment style) */
    subPill?: boolean;
    /** Optional footnote below sub (sentence case, not uppercased) */
    footnote?: string;
  };

  const compactMeta: Record<
    V3Tile["id"],
    {
      micro: string;
      leftGauge: { label: string; value: number; sub: string };
      rightGauge: { label: string; value: number; sub: string };
      bottomLeft: KeyStat;
      bottomRight: KeyStat;
    }
  > = {
    customer_card_journey: {
      micro: "Satisfaction · Closure Risk · Top Pain",
      leftGauge: { label: "High Spend ", value: 61, sub: "resolution quality" },
      rightGauge: { label: "Low Spend", value: 24, sub: "at-risk share" },
      bottomLeft: { label: "Top Pain", value: "PIN Reset", sub: "topic cluster" },
      bottomRight: {
        label: "HSHF at-risk",
        value: "18 accounts",
        sub: "churn signals",
        valueColor: "#ef4444"
      },
    },
    market_reputation: {
      micro: "Standalone vs co-brand · Rankings · Social echo",
      leftGauge: { label: "Standalone", value: 54, sub: "rank + narrative pressure" },
      rightGauge: { label: "Co-branded", value: 63, sub: "partner + review risk" },
      bottomLeft: { label: "Competitor Mentions ", value: "+142% WoW", sub: "entity extract" },
      bottomRight: { label: "Social Driver", value: "#RewardScam", sub: "hashtag vol" },
    },
    fraud_fulfillment: {
      micro: "Dispute resolution · Repeat contact · Service recovery",
      leftGauge: { label: "Resolved in Promise", value: 42, sub: "resolution SLA" },
      rightGauge: { label: "Repeat Contact", value: 47, sub: "same issue callbacks" },
      bottomLeft: {
        label: "Beyond Promise",
        value: "43 overdue",
        sub: "AGING DETECT",
        valueColor: "#ef4444",
        align: "start",
        subPill: true,
      },
      bottomRight: {
        label: "Top Service Break",
        value: "Dispute follow-up",
        sub: "ROOT CAUSE",
        valueColor: "#f97316",
        align: "end",
        subPill: true,
      },
    },
  };
  const m = compactMeta[tile.id];

  const trendLineColor = trendLineColorFromSpark(tile.spark, T);

  const defaultTileShadow = `0 8px 32px ${withAlpha(visualTone, 0.082)}`;
  const hoverTileShadow = `0 0 0 2px ${visualTone}, 0 8px 28px ${withAlpha(visualTone, 0.133)}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: "left",
        background: T.elevated,
        border: `1px solid ${withAlpha(visualTone, 0.25)}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        cursor: "pointer",
        transition: "all 0.25s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        minWidth: 0,
        boxShadow: defaultTileShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = hoverTileShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = defaultTileShadow;
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, paddingRight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: withAlpha(visualTone, 0.082),
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <TileIcon size={18} color={visualTone} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15.5,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {tile.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.38)",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.35,
              }}
            >
              {m.micro}
            </div>
          </div>
        </div>
        <ChevronRight size={22} color="#b9b9ba" style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }} strokeWidth={1.75} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: 12, flex: 1, minHeight: 0, alignItems: "stretch" }}>
        <div style={{ minWidth: 0, position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ position: "absolute", top: 0, right: 0, fontSize: 13, color: tile.delta < 0 ? "#ef4444" : "#22c55e", fontWeight: 700, fontFamily: "var(--mono)" }}>
            {tile.delta >= 0 ? "+" : ""}{tile.delta} pts
          </span>
          <div style={{ marginBottom: 6, paddingRight: 64 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", fontFamily: "var(--mono)", lineHeight: 1 }}>{tile.score}</div>
          </div>
          <div style={{ width: "100%", flex: 1, minHeight: 88 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`compact-grad-${tile.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendLineColor} stopOpacity={0.42} />
                    <stop offset="55%" stopColor={trendLineColor} stopOpacity={0.16} />
                    <stop offset="100%" stopColor={trendLineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="w" hide />
                <YAxis
                  hide
                  domain={[
                    (min: number) => Math.max(0, min - trendPad.below),
                    (max: number) => max + trendPad.above,
                  ]}
                />
                <RechartsTooltip
                  cursor={false}
                  labelFormatter={(label) => `${label}`}
                  formatter={(value) => [`${Number(value ?? 0)} pts`, "Score"]}
                  contentStyle={{
                    background: "rgba(10, 14, 22, 0.96)",
                    border: `1px solid ${T.borderLight}`,
                    borderRadius: 8,
                    fontSize: 11,
                    color: T.text,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={trendLineColor}
                  strokeWidth={3}
                  fill={`url(#compact-grad-${tile.id})`}
                  fillOpacity={1}
                  dot={false}
                  activeDot={{ r: 3.5, fill: trendLineColor, stroke: trendLineColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12, minWidth: 0, alignItems: "start" }}>
            {[m.leftGauge, m.rightGauge].map((g) => (
              <MiniHalfGauge
                key={g.label}
                label={g.label}
                value={g.value}
                color={
                  g.label === "Positive Resolution" ||
                  g.label === "Resolution Quality" ||
                  g.label === "Follow-up Rate" ||
                  g.label === "Resolved in Promise" ||
                  g.label === "Repeat Contact"
                    ? T.amber
                    : trendLineColor
                }
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 12px",
              alignItems: "start",
              padding: "12px 4px 4px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {[m.bottomLeft, m.bottomRight].map((b) => {
              const valueColor =
                b.valueColor ??
                (b.label === "Top Pain" ? "#ffffff" : b.label.includes("At Risk") ? "#ef4444" : visualTone);
              return (
                <div key={b.label} style={{ textAlign: b.align === "end" ? "right" : "left" }}>
                  <div style={{ fontSize: 11, color: "#b9b9ba", textTransform: "uppercase", letterSpacing: 0.4 }}>{b.label}</div>
                  <div
                    style={{
                      fontSize: 14,
                      color: valueColor,
                      fontWeight: 700,
                      fontFamily: "var(--mono)",
                      marginTop: 4,
                      lineHeight: 1.25,
                    }}
                  >
                    {b.value}
                  </div>
                  {b.subPill ? (
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: 8,
                        color: "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                        marginTop: 6,
                        letterSpacing: 0.05,
                        fontWeight: 600,
                        background: "rgba(255, 255, 255, 0.06)",
                        padding: "3px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {b.sub}
                    </div>
                  ) : (
                    <div style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", marginTop: 4 }}>{b.sub}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConversationAICallout text={tile.aiInsight} accent={visualTone} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AI RISK SPIKE MONITOR
// ═══════════════════════════════════════════════════════════════════
function AIRiskSpikeMonitor() {
  const T = useDashboardTheme();
  const severityMeta: Record<string, { badge: string; icon: string }> = {
    CRITICAL: { badge: T.red, icon: "🔥" },
    HIGH: { badge: T.amber, icon: "⚠️" },
    MEDIUM: { badge: T.cyan, icon: "•" },
  };
  const spikeCardMeta: Record<
    string,
    {
      topIntent: string;
      topIntentSub: string;
      time: string;
      metrics: { label: string; value: string; delta?: string }[];
      callout: string;
    }
  > = {
    "merchant-xyz": {
      topIntent: "Card Transaction Dispute",
      topIntentSub: "Critical impact · Chargeback risk",
      time: "Last 6h",
      metrics: [
        { label: "Dispute intake", value: "312 → 847", delta: "↑ 171%" },
        { label: "Cards impacted", value: "412 → 847", delta: "↑ 106%" },
        { label: "Chargeback ratio", value: "1.1% → 2.4%", delta: "↑ 1.3 pts" },
      ],
      callout:
        "Double-charge pattern concentrated on Merchant XYZ. Freeze recurring authorizations and complete batch reissue today to contain dispute spillover.",
    },
    "hni-churn": {
      topIntent: "Account Closure Inquiry",
      topIntentSub: "Critical impact · Retention window open",
      time: "Last 72h",
      metrics: [
        { label: "Retention risk", value: "61% → 86%", delta: "↑ 25 pts" },
        { label: "Closure intents", value: "7 → 18", delta: "↑ 157%" },
        { label: "Spend at risk", value: "$2.7M → $4.2M", delta: "↑ 56%" },
      ],
      callout:
        "HSHFs are citing CompetitorY cashback and reward-value erosion. Trigger RM outreach within 2 hours with pre-approved retention offers.",
    },
    "reward-devaluation": {
      topIntent: "Rewards Value Complaint",
      topIntentSub: "High impact · Reputation risk",
      time: "Last 12h",
      metrics: [
        { label: "Mentions (48h)", value: "1,240 → 4,820", delta: "↑ 289%" },
        { label: "Top hashtag", value: "#RewardScam", delta: "↑ 287%" },
        { label: "Estimated reach", value: "0.9M → 1.8M", delta: "↑ 100%" },
      ],
      callout:
        "Reward devaluation narrative is now mainstream across X + Reddit. Publish transparent points FAQ and align influencer comms inside 24h.",
    },
    "cnp-mcc-7995": {
      topIntent: "Unauthorized Card Transaction",
      topIntentSub: "Critical impact · Fraud escalation",
      time: "Last 4h",
      metrics: [
        { label: "Fraud alerts", value: "34 → 89", delta: "↑ 162%" },
        { label: "Weekly loss exposure", value: "$21K → $47K", delta: "↑ 124%" },
        { label: "Risky MCC", value: "7995 gaming clusters" },
      ],
      callout:
        "Card-testing pattern is accelerating (small auth then large hit). Enforce step-up 3DS and throttle MCC 7995 velocity immediately.",
    },
    "bpo-evidence-bottleneck": {
      topIntent: "Evidence Collection Stall",
      topIntentSub: "Critical impact · Backlog + repeat contact",
      time: "Next 3 days",
      metrics: [
        { label: "At-risk disputes", value: "27 → 43", delta: "↑ 59%" },
        { label: "Vendor Beta cases", value: "19 → 31", delta: "↑ 63%" },
        { label: "Exposure (est.)", value: "$112K → $180K", delta: "↑ 61%" },
      ],
      callout:
        "Stalled evidence work is concentrated at BPO Vendor Beta. Surge in-house review on the oldest cases and reroute high-complexity work off the vendor queue.",
    },
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color={T.gold} />
          <span>AI Risk Spike Monitor</span>
        </h2>
        <span
          style={{
            fontSize: 10,
            padding: "4px 8px",
            borderRadius: 999,
            background: `${T.red}20`,
            color: `${T.red}dd`,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Operational Alerts
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>
        Live detection of sudden sentiment, SLA, urgency, volume, and backlog shocks across channels.
      </p>
      <p style={{ margin: 0, fontSize: 11, color: T.textMut, fontStyle: "italic" }}>
        Drivers: EMI resets · fee policy change · HNI churn signals · viral social complaint cluster · iOS app bug
      </p>

      <div style={{ display: "flex", width: "100%", minWidth: 0, gap: 12, overflowX: "auto", paddingBottom: 8, alignItems: "stretch" }}>
        {V3_RISK_SPIKES.map((spike) => {
          const tone = toneToColor(severityTone(spike.severity), T);
          const sev = severityMeta[spike.severity] ?? severityMeta.MEDIUM;
          const meta = spikeCardMeta[spike.id] ?? {
            topIntent: spike.metric,
            topIntentSub: "High impact",
            time: "Last 4h",
            metrics: [{ label: "Confidence", value: `${spike.confidence}%` }],
            callout: spike.aiAction,
          };
          return (
            <div
              key={spike.id}
              style={{
                minWidth: 240,
                minHeight: 240,
                flex: "1 1 0",
                borderRadius: 16,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: `${tone}88`,
                background: `${tone}0c`,
                boxShadow: `0 10px 24px ${tone}33`,
                color: T.textSec,
                padding: "14px 14px 16px",
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: T.text }}>
                  <span>{spike.title}</span>
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: 999,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: `${sev.badge}66`,
                    background: `${sev.badge}22`,
                    color: `${sev.badge}dd`,
                  }}
                >
                  <span>{sev.icon}</span>
                  <span>{spike.severity}</span>
                </span>
              </div>

              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5, fontSize: 11, color: T.textMut }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Channel</span>
                  <span style={{ color: T.text }}>{spike.channelMix.join(", ")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Top Intent</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: T.text }}>{meta.topIntent}</div>
                    <div style={{ fontSize: 10, color: T.textMut }}>{meta.topIntentSub}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Time</span>
                  <span style={{ color: T.text }}>{meta.time}</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  minHeight: 108,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: `${T.borderLight}`,
                  background: "rgba(0,0,0,0.25)",
                  padding: 10,
                  fontSize: 11,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                {meta.metrics.map((m) => (
                  <div key={`${spike.id}-${m.label}`} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: T.textMut }}>{m.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.text, fontWeight: 700 }}>{m.value}</div>
                      {m.delta ? <div style={{ fontSize: 11, color: "#fda4af", fontWeight: 700 }}>{m.delta}</div> : null}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 20,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: `${T.red}66`,
                  background: `${T.red}1a`,
                  padding: 16,
                  fontSize: 12,
                  lineHeight: 1.75,
                  color: "#ffe4e6",
                }}
              >
                ✨ {meta.callout}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FLOATING AI DAY GENERATOR
// ═══════════════════════════════════════════════════════════════════
function FloatingAIDayGenerator({ hidden = false }: { hidden?: boolean }) {
  const T = useDashboardTheme();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);

  if (hidden) return null;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setPrompt("");
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `✨ Based on current conversation data across Voice, Chat, Email, Social, and Tickets:\n\n${mockAIAnswer(text)}`,
        },
      ]);
      setBusy(false);
    }, 900);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="✨ AI Day Generator — Ask anything about your card portfolio"
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: "none",
            background: `linear-gradient(135deg, ${T.gold} 0%, ${T.cyan} 100%)`,
            color: "#0a0d14",
            boxShadow: `0 12px 30px ${T.gold}55`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <Sparkles size={22} />
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 420,
            maxHeight: "78vh",
            background: T.elevated,
            border: `1px solid ${T.gold}55`,
            borderRadius: 16,
            boxShadow: `0 24px 60px rgba(0,0,0,0.55)`,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: `linear-gradient(135deg, ${T.gold}22 0%, ${T.cyan}15 100%)`,
              borderBottom: `1px solid ${T.borderLight}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color={T.gold} />
              <div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 800 }}>AI Day Generator</div>
                <div style={{ fontSize: 10, color: T.textMut }}>Head of Credit Cards · card-specific</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", color: T.textSec, cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <>
                <div style={{ fontSize: 11, color: T.textMut, marginBottom: 4 }}>
                  Ask me about your portfolio — I have listening access across Voice, Chat, Email, Social, and Tickets.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {V3_AI_DAY_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      style={{
                        textAlign: "left",
                        background: T.surface,
                        borderTop: `1px solid ${T.border}`,
                        borderRight: `1px solid ${T.border}`,
                        borderBottom: `1px solid ${T.border}`,
                        borderLeft: `2px solid ${T.gold}`,
                        color: T.textSec,
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        cursor: "pointer",
                        lineHeight: 1.4,
                      }}
                    >
                      <Sparkles size={10} color={T.gold} style={{ marginRight: 5, marginBottom: -1 }} />
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === "user" ? `${T.cyan}15` : `${T.gold}10`,
                  border: `1px solid ${m.role === "user" ? T.cyan : T.gold}40`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontSize: 11.5,
                  color: T.text,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontSize: 9, color: m.role === "user" ? T.cyan : T.gold, marginBottom: 3, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {m.role === "user" ? "You" : "AI"}
                </div>
                {m.text}
              </div>
            ))}
            {busy && (
              <div style={{ fontSize: 11, color: T.textMut, display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={11} className="spin" />
                <span>Synthesising conversation data…</span>
              </div>
            )}
          </div>

          <div style={{ padding: 10, borderTop: `1px solid ${T.borderLight}`, display: "flex", gap: 6 }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(prompt);
              }}
              placeholder="Ask about fraud, disputes, churn, rankings…"
              style={{
                flex: 1,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: T.text,
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => send(prompt)}
              style={{
                background: T.gold,
                border: "none",
                borderRadius: 8,
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#0a0d14",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Mock AI response generator — matches the credit-card domain prompts
function mockAIAnswer(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("hni") && l.includes("churn"))
    return "5 HNIs hold combined $4.2M annual spend and are above 70% churn probability. HNI-2891 ($142K, 92%) is the hottest — mentioned CompetitorY in 3 calls this month and spend is ▼67%. Suggest RM call today, waive annual fee, and reward gesture.";
  if (l.includes("representment") || l.includes("38%"))
    return "Friendly-fraud representment sits at 38% because BPO Vendor Beta handles the low-complexity queue but their quality score is 68 — they are missing device-fingerprint + 3DS evidence on reason code 4837. In-house teams hit 78%. Fix: cap Beta to < $200 cases.";
  if (l.includes("merchant"))
    return "Merchant XYZ has 847 disputes this week (double-charge theme). MCC 7995 gaming has 321 and is at 1.8% chargeback ratio — breaching the 1% Visa threshold. Recommend Visa DMP enrollment for both plus pre-emptive policy for Telecom Recurring (auto-renewal theme).";
  if (l.includes("reward") && l.includes("social"))
    return "#RewardScam is up +287% WoW with 4,820 posts and 1.8M impressions on X. Reddit r/CreditCards thread has 3,400 upvotes. 67 retention calls in 48h referenced the change. @CreditCardGuru's YouTube video (2.1K upvotes) is amplifying.";
  if (l.includes("nerdwallet") || l.includes("ranking"))
    return "NerdWallet Cashback dropped #2 → #4 — overtaken by CompetitorY Freedom Unlimited. Review copy cites the reward devaluation announcement. Bankrate Travel dropped #4 → #5, overtaken by Chase Sapphire Reserve on lounge-access reviews.";
  if (l.includes("deadline") || l.includes("provisional") || l.includes("evidence queue"))
    return "43 disputes are within 3 days of breaching our internal evidence SLA — about $180K estimated exposure. 31 of 43 are stuck at BPO Vendor Beta's evidence-collection stage. Prioritise the oldest cases in-house; reroute complex work from Vendor Beta.";
  if (l.includes("competitor"))
    return "CompetitorY (412 mentions, 8.2/10 threat) leads the retention-call chatter — 'their 5% cashback is better'. Amex Gold (287) dominates dining-reward mentions, Chase Sapphire (184) dominates travel-insurance mentions.";
  if (l.includes("brand") && l.includes("gap"))
    return "Brand Promise Score is 58/100. Two SEVERE gaps: Zero Fraud Liability (8 public denials cited — regulated promise exposure) and Best-in-Class Rewards (#RewardScam at 4,820 posts). Zero Fraud Liability is the higher-urgency PR risk.";
  if (l.includes("summarise") || l.includes("posture") || l.includes("bullets"))
    return "1) Cardholder journey (68) — Platinum Travel dragging; activation PIN-loop + reward confusion lead.\n2) Market buzz (61) — NerdWallet downgrade + #RewardScam viral on X/Reddit; @CreditCardGuru amplifying.\n3) Disputes & fraud (58) — 43 cases stuck in evidence backlog; BPO Vendor Beta representment win rate 38%.";
  if (l.includes("vendor beta") || l.includes("bpo"))
    return "Yes — cap or cut. Vendor Beta bills $12/case but true cost is $73/case after lost representments. That is $890K/quarter in avoidable losses. Route > $200 cases in-house. Beta works only for the low-complexity queue if their quality stays ≥ 80.";
  return "✨ Synthesising from your conversation data: I can answer this specifically if you rephrase with a card product or channel. Try the suggested prompts on the left.";
}

// ═══════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════
export function HeadOfCreditCardsV3Dashboard({
  industryName,
  roleName,
  industryColor,
  onExit,
  theme,
}: HeadOfCreditCardsV3DashboardProps) {
  const T = theme ?? HEAD_CREDIT_CARDS_V3_DEFAULT_THEME;
  const [activeDrill, setActiveDrill] = useState<V3DrillId | null>(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const SIDEBAR_W_EXPANDED = 268;
  const SIDEBAR_W_COLLAPSED = 76;
  const sidebarW = sidebarHover ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  const content = useMemo(() => {
    if (activeDrill === "customer_card_journey") return <CustomerCardJourneyV3Drill onBack={() => setActiveDrill(null)} />;
    if (activeDrill === "market_reputation") return <MarketReputationV3Drill onBack={() => setActiveDrill(null)} />;
    if (activeDrill === "fraud_fulfillment") return <FraudAndFulfillmentV3Drill onBack={() => setActiveDrill(null)} />;
    return <ExecutiveView onOpenDrill={setActiveDrill} />;
  }, [activeDrill]);

  const activeScreenMeta =
    activeDrill === "customer_card_journey"
      ? {
          label: "Are cardholders satisfied with their journey?",
          sub: "Lifecycle · Journey · Retention",
        }
      : activeDrill === "market_reputation"
        ? {
            label: "What is the market saying about us?",
            sub: "Brand · Rankings · Social Signals",
          }
        : activeDrill === "fraud_fulfillment"
          ? {
              label: "Are we keeping our service promise?",
              sub: "Disputes · Risk · Recovery",
            }
          : { label: "Executive View", sub: "Promise · Stability · Risk" };

  return (
    <DashboardThemeProvider value={T}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: T.bg,
          color: T.text,
          fontFamily: "var(--font), system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        <aside
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          style={{
            width: sidebarW,
            minWidth: sidebarW,
            transition: "width 0.22s ease, min-width 0.22s ease",
            borderRight: `1px solid ${T.borderLight}`,
            background: T.elevated,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 5,
          }}
        >
          <div
            style={{
              padding: sidebarHover ? "18px 16px" : "14px 10px",
              borderBottom: `1px solid ${T.borderLight}`,
              textAlign: sidebarHover ? "left" : "center",
            }}
          >
            {sidebarHover ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.cyan, letterSpacing: 2.5, textTransform: "uppercase" }}>Yaaralabs</div>
                <div style={{ fontSize: 13, color: T.textMut, marginTop: 2 }}>Fluid Intelligence</div>
              </>
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  margin: "0 auto",
                  borderRadius: 10,
                  background: T.cyanGlow,
                  border: `1px solid ${T.cyan}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: T.cyan,
                  fontFamily: "var(--mono)",
                }}
                title="Yaaralabs · Fluid Intelligence"
              >
                Y
              </div>
            )}
          </div>
          <div
            style={{
              padding: sidebarHover ? "12px 14px" : "10px 8px",
              borderBottom: `1px solid ${T.borderLight}`,
              display: "flex",
              flexDirection: "column",
              gap: sidebarHover ? 8 : 6,
              alignItems: sidebarHover ? "stretch" : "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: sidebarHover ? "flex-start" : "center" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${industryColor}25`,
                  border: `1px solid ${industryColor}60`,
                  flexShrink: 0,
                }}
              />
              {sidebarHover ? <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{industryName}</span> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: sidebarHover ? "flex-start" : "center" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${industryColor}20`,
                  border: `1px solid ${industryColor}50`,
                  flexShrink: 0,
                }}
              />
              {sidebarHover ? <span style={{ fontSize: 13, fontWeight: 600, color: T.cyan }}>{roleName}</span> : null}
            </div>
          </div>
          <div style={{ padding: sidebarHover ? "10px 8px" : "8px 6px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {[
              { id: "executive", label: "Executive View", icon: Activity },
              {
                id: "customer_card_journey",
                label: "Are cardholders satisfied with their journey?",
                icon: Target,
              },
              { id: "market_reputation", label: "What is the market saying about us?", icon: Shield },
              { id: "fraud_fulfillment", label: "Are we keeping our service promise?", icon: CreditCard },
            ].map((item) => {
              const active = (activeDrill ?? "executive") === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveDrill(item.id === "executive" ? null : (item.id as V3DrillId))}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: active ? T.cyanGlow : "transparent",
                    color: active ? T.text : T.textSec,
                    borderRadius: 8,
                    padding: sidebarHover ? "8px 10px" : "10px 8px",
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: sidebarHover ? 8 : 0,
                    cursor: "pointer",
                    borderLeft: active ? `3px solid ${T.cyan}` : "3px solid transparent",
                    justifyContent: sidebarHover ? "flex-start" : "center",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: active ? T.cyanGlow : `${T.textMut}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={11} color={active ? T.cyan : T.textMut} />
                  </div>
                  {sidebarHover ? <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{item.label}</span> : null}
                </button>
              );
            })}
          </div>
          <div style={{ padding: sidebarHover ? "10px 12px" : "10px 8px", borderTop: `1px solid ${T.borderLight}` }}>
            <button
              type="button"
              onClick={onExit}
              style={{
                width: "100%",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                background: T.surface,
                color: T.textSec,
                padding: sidebarHover ? "8px 14px" : "10px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: sidebarHover ? 6 : 0,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={12} />
              {sidebarHover ? "Change Role" : null}
            </button>
          </div>
        </aside>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: activeDrill ? "hidden" : "auto",
          }}
        >
          <div
            style={{
              padding: activeDrill ? "12px 24px" : "10px 24px 0",
              borderBottom: activeDrill ? `1px solid ${T.borderLight}` : "none",
              background: activeDrill ? T.elevated : "transparent",
            }}
          >
            {activeDrill ? (
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.01em" }}>
                  {activeScreenMeta.label}
                </h1>
                <div style={{ fontSize: 14, color: T.textSec, marginTop: 4, lineHeight: 1.45 }}>
                  {industryName} · {roleName} · {activeScreenMeta.sub}
                </div>
              </div>
            ) : null}
          </div>
          <main
            style={{
              flex: 1,
              minWidth: 0,
              padding: activeDrill ? "16px 18px 20px" : 16,
              overflowY: activeDrill ? "auto" : "visible",
              overflowX: "hidden",
              position: "relative",
            }}
          >
            {!activeDrill ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    background: T.elevated,
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: `1px solid ${T.borderLight}`,
                    boxShadow: `0 0 0 1px ${T.amber}12 inset`,
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) auto", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                      <span style={{ fontSize: 13, color: T.amber }}>✨</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.amber, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Executive Brief
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 7, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontSize: 13.5, color: T.textSec, lineHeight: 1.4 }}>
                      All three executive signals weakened this week, with service promise showing the sharpest
                      deterioration.
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {[
                        { label: "Satisfaction", delta: -4 },
                        { label: "Market", delta: -8 },
                        { label: "Service promise", delta: -11 },
                      ].map((m) => {
                        const tone = m.delta <= -8 ? T.red : m.delta < 0 ? T.amber : T.green;
                        const direction = m.delta < 0 ? "↓" : m.delta > 0 ? "↑" : "•";
                        return (
                          <span
                            key={m.label}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              color: tone,
                              border: `1px solid ${tone}50`,
                              background: `${tone}18`,
                              borderRadius: 999,
                              padding: "6px 10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span style={{ color: T.textSec }}>{m.label}</span>
                            <span>{direction}</span>
                            <span>{m.delta > 0 ? `+${m.delta}` : m.delta} pts</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: T.elevated,
                    borderRadius: 10,
                    padding: "12px 14px",
                    borderLeft: `3px solid ${T.amber}`,
                    border: `1px solid ${T.borderLight}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                    <span style={{ fontSize: 13, color: T.amber }}>✨</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.amber, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Executive Pulse
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                    {[
                      { q: "What is broken?", main: "🔴 18 HSHF accounts: churn signals detected - activation friction #1 journey detractor, retention window open", support: "", pill: "Critical", tone: T.red },
                      { q: "How bad is it?",  main: "🎯 Dispute repeat contact at 47%, up from 39% WoW with 43 cases aging beyond promise window", support: "", pill: "High severity", tone: T.amber },
                      { q: "How do we fix it?",  main: "🟡 Co-branded at 63% vs standalone 54% - gap stable, monitoring #RewardScam movement", support: "", pill: "Monitoring", tone: T.cyan },
                    ].map((item, idx) => (
                      <div
                        key={item.q}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${T.borderLight}`,
                          borderRadius: 8,
                          padding: "9px 10px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#b7a6ff" }}>
                            {idx + 1}. {item.q}
                          </div>
                          <span style={{ fontSize: 12, color: item.tone }}></span>
                        </div>
                        <div style={{ fontSize: 13.5, color: T.textSec, lineHeight: 1.35, fontWeight: 600 }}>{item.main}</div>
                        {item.support ? <div style={{ fontSize: 11.5, color: T.textMut, lineHeight: 1.35 }}>{item.support}</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {content}
            <FloatingAIDayGenerator hidden={!!activeDrill} />
          </main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXECUTIVE VIEW
// ═══════════════════════════════════════════════════════════════════
function ExecutiveView({ onOpenDrill }: { onOpenDrill: (d: V3DrillId) => void }) {
  const T = useDashboardTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* 3 Tiles */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        {V3_TILES.map((tile) => (
          <ExecutiveTile key={tile.id} tile={tile} onOpen={() => onOpenDrill(tile.id)} />
        ))}
      </section>

      {/* AI Risk Spike Monitor */}
      <AIRiskSpikeMonitor />

    </div>
  );
}
