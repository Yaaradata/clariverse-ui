"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, ChevronDown, Megaphone, Radio, ShieldAlert, TrendingUp, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BrandFeatureRequest,
  BrandInfluencerProfile,
  BrandRiskDrill,
  BrandRiskTop,
  CompetitorBuzzDetail,
  HubChannelSpec,
  HubTimelinePoint,
  SpreadMapNode,
  SpreadMapRing,
} from "../../lib/cxHeadRetailV3HubCards";
import {
  BRAND_SOCIAL_CHANNEL_COLORS,
  BRAND_SOCIAL_CHANNELS,
} from "../../lib/cxHeadRetailV3BrandSocialData";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { hubChartAxis, hubChartTooltip } from "./HubChartPrimitives";
import { HubMicroLabel, HubStatusPill, HubSummaryChip } from "./HubVisualPrimitives";
import { cssVar, radius } from "../../theme/tokens";

const BUZZ_COLORS = ["#E11D48", "#EA580C", "#F59E0B", "#A3A3A3"];
const QUALITY_COLORS = ["#E11D48", "#EA580C", "#F59E0B", "#737373", "#A855F7"];
const CHANNEL_RISK_META: Record<string, { label: string; dot: string; mentions: number }> = {
  "Social/X": { label: "X (Twitter)", dot: "#9CA3AF", mentions: 3_650 },
  "Live Chat": { label: "Play Store", dot: "#06B6D4", mentions: 1_240 },
  Reviews: { label: "Trustpilot", dot: "#84CC16", mentions: 1_880 },
  Email: { label: "Reddit", dot: "#F97316", mentions: 920 },
  "App Store": { label: "App Store", dot: "#A78BFA", mentions: 1_560 },
};

const SENTIMENT_TARGET = 0.65;

function channelRiskMeta(name: string): { label: string; dot: string; mentions: number } {
  return CHANNEL_RISK_META[name] ?? { label: name, dot: cssVar("text-muted"), mentions: 0 };
}

function sentimentScoreColor(score: number): string {
  if (score >= SENTIMENT_TARGET) return cssVar("positive");
  if (score >= 0.5) return cssVar("severity-med");
  return cssVar("severity-high");
}

function sentimentTrendColor(score: number, delta: number): string {
  if (delta >= 0 && score >= SENTIMENT_TARGET) return cssVar("positive");
  return cssVar("severity-high");
}

function ChannelRiskSparkline({
  data,
  color,
  gradientId,
  activeIndex,
  onActiveIndexChange,
}: {
  data: number[];
  color: string;
  gradientId: string;
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
}): React.ReactElement {
  const chartData = useMemo(() => data.map((v, i) => ({ i, v })), [data]);

  return (
    <div style={{ width: "100%", height: 34, minWidth: 0, cursor: "crosshair" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 2, left: 2, bottom: 0 }}
          onMouseMove={(state) => {
            const idx = state?.activeTooltipIndex;
            if (typeof idx === "number") onActiveIndexChange(idx);
          }}
          onMouseLeave={() => onActiveIndexChange(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Tooltip
            content={() => null}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 3", opacity: 0.85 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: cssVar("text-primary"), strokeWidth: 1.5 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type ChannelRiskRowData = {
  name: string;
  label: string;
  dot: string;
  mentions: number;
  values: number[];
  current: number;
};

function ChannelRiskRow({
  row,
  dayLabels,
  showBorder,
}: {
  row: ChannelRiskRowData;
  dayLabels: string[];
  showBorder: boolean;
}): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const displayIndex = activeIndex ?? row.values.length - 1;
  const displayValue = row.values[displayIndex] ?? row.current;
  const startValue = row.values[0] ?? displayValue;
  const delta = displayValue - startValue;
  const scoreColor = sentimentScoreColor(displayValue);
  const trendColor = sentimentTrendColor(displayValue, delta);
  const periodLabel = activeIndex != null ? (dayLabels[activeIndex] ?? `Pt ${activeIndex + 1}`) : "over 6wks";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(108px, 128px) minmax(0, 1fr) minmax(64px, 72px)",
        gap: 10,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: showBorder ? `1px solid ${cssVar("border")}` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7, minWidth: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: row.dot, flexShrink: 0, marginTop: 5 }} />
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.25 }}>{row.label}</span>
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 3, lineHeight: 1.2 }}>
            Total mentions{" "}
            <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
              {row.mentions.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <ChannelRiskSparkline
        data={row.values}
        color={trendColor}
        gradientId={`channel-risk-${row.name.replace(/\W/g, "")}`}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="lisn-num" style={{ fontSize: 17, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
          {displayValue.toFixed(2)}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: trendColor, marginTop: 2, lineHeight: 1.2 }}>
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(2)} {periodLabel}
        </div>
      </div>
    </div>
  );
}

export function BrandChannelSentimentVisual({
  channels,
  timeline,
}: {
  channels: HubChannelSpec[];
  timeline: HubTimelinePoint[];
}): React.ReactElement {
  const channelDays = useMemo(
    () => timeline.filter((point) => point.rightPanel.kind === "channels"),
    [timeline],
  );

  const rows = useMemo(
    () =>
      channels
        .map((channel) => {
          const values = channelDays.map((point) => {
            const match =
              point.rightPanel.kind === "channels"
                ? point.rightPanel.channels.find((item) => item.name === channel.name)
                : undefined;
            return match?.v ?? channel.v;
          });
          const meta = channelRiskMeta(channel.name);

          return {
            name: channel.name,
            label: meta.label,
            dot: meta.dot,
            mentions: meta.mentions,
            values,
            current: channel.v,
          };
        })
        .sort((a, b) => (a.values[a.values.length - 1] ?? a.current) - (b.values[b.values.length - 1] ?? b.current)),
    [channels, channelDays],
  );

  const dayLabels = useMemo(() => channelDays.map((point) => point.label), [channelDays]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {rows.map((row, index) => (
        <ChannelRiskRow key={row.name} row={row} dayLabels={dayLabels} showBorder={index < rows.length - 1} />
      ))}
    </div>
  );
}

const TREND_META = {
  Rising: { label: "Rising", color: cssVar("severity-high"), ring: 88 },
  Watch: { label: "Watch", color: cssVar("severity-med"), ring: 55 },
  Stable: { label: "Stable", color: cssVar("positive"), ring: 28 },
} as const;

type FraudTrend = keyof typeof TREND_META;

function parseCount(value: string): number {
  return Number.parseInt(value.replace(/,/g, ""), 10) || 0;
}

function formatMentions(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString();
}

function severityColor(severity: BrandRiskTop["severity"]): string {
  if (severity === "Critical") return cssVar("severity-high");
  if (severity === "Rising") return cssVar("severity-med");
  return cssVar("positive");
}

function severityScore(severity: BrandRiskTop["severity"]): number {
  if (severity === "Critical") return 92;
  if (severity === "Rising") return 68;
  return 34;
}

function fraudTrendMeta(trend: string): (typeof TREND_META)[FraudTrend] {
  if (trend in TREND_META) return TREND_META[trend as FraudTrend];
  return TREND_META.Stable;
}

function fraudAxisLabel(type: string): string {
  if (type.toLowerCase().includes("refund")) return "REFUND FRAUD";
  if (type.toLowerCase().includes("fake")) return "FAKE SELLER";
  if (type.toLowerCase().includes("empty")) return "EMPTY BOX";
  if (type.toLowerCase().includes("account")) return "ACCOUNT MISUSE";
  return type.toUpperCase();
}

function fraudDisplayLabel(type: string): string {
  if (type.toLowerCase().includes("refund")) return "Refund fraud";
  if (type.toLowerCase().includes("fake")) return "Fake seller";
  if (type.toLowerCase().includes("empty")) return "Empty box";
  if (type.toLowerCase().includes("account")) return "Account misuse";
  return type;
}

function bubbleSize(count: number, max: number): number {
  const ratio = max > 0 ? count / max : 0;
  return Math.round(44 + ratio * 52);
}

/** Fraud signals — radar concern map + status legend */
export function FraudRiskVisual({ fraud }: { fraud: BrandRiskDrill["fraud"] }): React.ReactElement {
  const rows = useMemo(
    () =>
      fraud.map((item) => {
        const meta = fraudTrendMeta(item.trend);
        return {
          axis: fraudAxisLabel(item.type),
          label: fraudDisplayLabel(item.type),
          level: meta.ring,
          trend: meta.label,
          color: meta.color,
          fullType: item.type,
        };
      }),
    [fraud],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", height: 240, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={rows}>
            <PolarGrid stroke={cssVar("border")} />
            <PolarAngleAxis
              dataKey="axis"
              tick={{
                fontSize: 10,
                fontWeight: 700,
                fill: cssVar("text-muted"),
                letterSpacing: 0.45,
              }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip
              {...hubChartTooltip}
              formatter={(_v, _n, item) => {
                const payload = item?.payload as (typeof rows)[number] | undefined;
                return [payload?.trend ?? "", payload?.fullType ?? ""];
              }}
            />
            <Radar
              dataKey="level"
              stroke={cssVar("severity-high")}
              fill={cssVar("severity-high")}
              fillOpacity={0.22}
              strokeWidth={2}
              isAnimationActive={false}
              dot={(props) => {
                const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: (typeof rows)[number] };
                if (cx == null || cy == null || !payload) return null;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={payload.color}
                    stroke={cssVar("surface")}
                    strokeWidth={2}
                  />
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
        {rows.map((row, index) => (
          <div
            key={row.fullType}
            style={{
              display: "grid",
              gridTemplateColumns: "10px minmax(0, 1fr) auto",
              gap: 10,
              alignItems: "center",
              padding: "11px 0",
              borderBottom: index < rows.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.3 }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: row.color, textTransform: "uppercase", letterSpacing: 0.35, flexShrink: 0 }}>
              {row.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const VOICE_RANK_COLORS = ["#E11D48", "#EA580C", "#EAB308", "#A855F7", "#06B6D4"] as const;

const VOICE_RING_LABEL: Record<SpreadMapRing, string> = {
  internal: "Internal",
  reviews: "Reviews",
  social: "Social",
  viral: "Viral",
};

const VOICE_SEVERITY_LABEL: Record<SpreadMapNode["severity"], string> = {
  critical: "Critical risk",
  high: "Elevated",
  muted: "Internal only",
};

/** Top public themes — simple #1–#5 ranked list */
export function PublicVoiceRankVisual({ nodes }: { nodes: BrandRiskDrill["spreadMap"] }): React.ReactElement {
  const ranked = useMemo(() => {
    const visible = [...nodes]
      .filter((node) => node.label.trim().length > 0 && node.severity !== "muted")
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
    const totalVolume = visible.reduce((sum, node) => sum + node.volume, 0);

    return visible.map((node, index) => ({
      ...node,
      rank: index + 1,
      color: VOICE_RANK_COLORS[index] ?? cssVar("text-muted"),
      share: totalVolume > 0 ? Math.round((node.volume / totalVolume) * 100) : 0,
    }));
  }, [nodes]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        height: "100%",
        justifyContent: "space-between",
        gap: 6,
      }}
    >
      {ranked.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: radius.md,
            background: `${item.color}0c`,
            border: `1px solid ${item.color}35`,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.md,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(145deg, ${item.color}33 0%, ${item.color}18 100%)`,
              border: `2px solid ${item.color}`,
              boxShadow: `0 0 14px ${item.color}30`,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, color: item.color, letterSpacing: -0.3 }}>#{item.rank}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", lineHeight: 1.3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: item.color,
                      textTransform: "uppercase",
                      letterSpacing: 0.35,
                      padding: "2px 7px",
                      borderRadius: radius.pill,
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    {VOICE_RING_LABEL[item.ring]}
                  </span>
                </div>
              </div>
              <span className="lisn-num" style={{ fontSize: 16, fontWeight: 800, color: item.color, flexShrink: 0, lineHeight: 1.2 }}>
                {item.volume.toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 7 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: radius.pill,
                  color: item.color,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}40`,
                }}
              >
                {item.share}% share
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: radius.pill,
                  color: item.severity === "critical" ? cssVar("severity-high") : cssVar("severity-med"),
                  background: item.severity === "critical" ? `${cssVar("severity-high")}14` : `${cssVar("severity-med")}14`,
                  border: `1px solid ${item.severity === "critical" ? `${cssVar("severity-high")}44` : `${cssVar("severity-med")}44`}`,
                }}
              >
                {VOICE_SEVERITY_LABEL[item.severity]}
              </span>
              {item.voiceQuote ? (
                <>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fontStyle: "italic",
                      color: cssVar("text-secondary"),
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                      maxWidth: "100%",
                    }}
                  >
                    &ldquo;{item.voiceQuote}&rdquo;
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const SPREAD_RING_RADIUS: Record<SpreadMapRing, number> = {
  internal: 54,
  reviews: 96,
  social: 134,
  viral: 168,
};

const SPREAD_RING_LABELS: { ring: SpreadMapRing; label: string; angle: number }[] = [
  { ring: "internal", label: "INTERNAL", angle: 228 },
  { ring: "reviews", label: "REVIEWS", angle: 318 },
  { ring: "social", label: "SOCIAL", angle: 48 },
  { ring: "viral", label: "VIRAL · PUBLIC", angle: 138 },
];

const SPREAD_MAP_SIZE = 400;
const SPREAD_MAP_CENTER = SPREAD_MAP_SIZE / 2;

const SPREAD_SEVERITY_COLOR: Record<SpreadMapNode["severity"], string> = {
  critical: cssVar("severity-high"),
  high: cssVar("severity-med"),
  muted: cssVar("text-muted"),
};

function spreadNodeRadius(volume: number, maxVolume: number): number {
  const ratio = maxVolume > 0 ? volume / maxVolume : 0;
  return Math.round(9 + ratio * 22);
}

function spreadPolarPoint(cx: number, cy: number, radius: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function spreadTextAnchor(angleDeg: number): "start" | "middle" | "end" {
  const angle = ((angleDeg % 360) + 360) % 360;
  if (angle > 30 && angle < 150) return "start";
  if (angle > 210 && angle < 330) return "end";
  return "middle";
}

const SPREAD_RING_DETAIL: Record<SpreadMapRing, string> = {
  internal: "Internal care & ops chatter",
  reviews: "App store & review surfaces",
  social: "Social platforms",
  viral: "Viral public spread",
};

const SPREAD_SEVERITY_LABEL: Record<SpreadMapNode["severity"], string> = {
  critical: "Critical public risk",
  high: "Elevated watch",
  muted: "Internal only",
};

function spreadNodeKey(node: SpreadMapNode): string {
  return `${node.ring}-${node.angle}`;
}

function SpreadMapTooltip({
  node,
  totalVolume,
  leftPct,
  topPct,
}: {
  node: SpreadMapNode & { color: string; share: number };
  totalVolume: number;
  leftPct: number;
  topPct: number;
}): React.ReactElement {
  const title = node.label || "Internal chatter signal";
  const flipAbove = topPct > 62;

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: flipAbove ? "translate(-50%, calc(-100% - 14px))" : "translate(-50%, 14px)",
        zIndex: 4,
        minWidth: 196,
        maxWidth: 240,
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        border: `1px solid ${node.color}55`,
        boxShadow: `0 10px 28px rgba(0,0,0,0.45), 0 0 0 1px ${node.color}22`,
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.35, marginBottom: 6 }}>{title}</div>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
          <span style={{ color: cssVar("text-muted") }}>Mentions</span>
          <span className="lisn-num" style={{ fontWeight: 800, color: node.color }}>
            {node.volume.toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
          <span style={{ color: cssVar("text-muted") }}>Share</span>
          <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
            {node.share}% of {totalVolume.toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
          <span style={{ color: cssVar("text-muted") }}>Reach</span>
          <span style={{ fontWeight: 700, color: cssVar("text-secondary"), textAlign: "right" }}>{SPREAD_RING_DETAIL[node.ring]}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
          <span style={{ color: cssVar("text-muted") }}>Risk</span>
          <span style={{ fontWeight: 800, color: node.color }}>{SPREAD_SEVERITY_LABEL[node.severity]}</span>
        </div>
      </div>
      {node.detail ? (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${cssVar("border")}`, fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {node.detail}
        </div>
      ) : null}
    </div>
  );
}

/** Spread map — radial reach from internal to viral/public */
export function SpreadMapVisual({
  nodes,
  severity,
}: {
  nodes: BrandRiskDrill["spreadMap"];
  severity: BrandRiskTop["severity"];
}): React.ReactElement {
  const glowFilterId = useUniqueGradientId("spread-glow");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const cx = SPREAD_MAP_CENTER;
  const cy = SPREAD_MAP_CENTER;
  const totalVolume = nodes.reduce((sum, n) => sum + n.volume, 0);
  const maxVolume = Math.max(...nodes.map((n) => n.volume), 1);
  const severityTint = severityColor(severity);

  const plotted = useMemo(
    () =>
      nodes.map((node) => {
        const point = spreadPolarPoint(cx, cy, SPREAD_RING_RADIUS[node.ring], node.angle);
        const r = spreadNodeRadius(node.volume, maxVolume);
        const labelPoint = spreadPolarPoint(cx, cy, SPREAD_RING_RADIUS[node.ring] + r + 16, node.angle);
        const share = totalVolume > 0 ? Math.round((node.volume / totalVolume) * 100) : 0;
        return {
          ...node,
          ...point,
          r,
          share,
          key: spreadNodeKey(node),
          color: SPREAD_SEVERITY_COLOR[node.severity],
          labelPoint,
          textAnchor: spreadTextAnchor(node.angle),
          displayLabel: node.label || (node.severity === "muted" ? "" : node.label),
        };
      }),
    [nodes, maxVolume, totalVolume, cx, cy],
  );

  const hovered = plotted.find((node) => node.key === hoveredKey) ?? null;
  const hasHover = hoveredKey != null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          minHeight: 0,
          maxHeight: 360,
          aspectRatio: "1 / 1",
          margin: "0 auto",
          alignSelf: "stretch",
        }}
      >
        <svg
          viewBox={`0 0 ${SPREAD_MAP_SIZE} ${SPREAD_MAP_SIZE}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block" }}
        >
          <defs>
            <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={cssVar("severity-high")} floodOpacity="0.55" />
            </filter>
            <radialGradient id={`${glowFilterId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={severityTint} stopOpacity={0.12} />
              <stop offset="100%" stopColor={severityTint} stopOpacity={0} />
            </radialGradient>
          </defs>

          <circle cx={cx} cy={cy} r={SPREAD_RING_RADIUS.viral + 8} fill={`url(#${glowFilterId}-bg)`} />

          {[...SPREAD_RING_LABELS].reverse().map(({ ring }) => (
            <circle
              key={`band-${ring}`}
              cx={cx}
              cy={cy}
              r={SPREAD_RING_RADIUS[ring]}
              fill={ring === "viral" ? `${cssVar("severity-high")}06` : ring === "social" ? `${cssVar("severity-med")}05` : `${cssVar("text-muted")}04`}
            />
          ))}

          {SPREAD_RING_LABELS.map(({ ring, label, angle }) => {
            const radius = SPREAD_RING_RADIUS[ring];
            const labelPoint = spreadPolarPoint(cx, cy, radius + 12, angle);
            const ringActive = hovered?.ring === ring;
            return (
              <g key={ring}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={ringActive ? cssVar("accent") : cssVar("border-strong")}
                  strokeWidth={ringActive ? 1.75 : 1.15}
                  strokeDasharray={ring === "internal" ? undefined : "5 6"}
                  opacity={hasHover && !ringActive ? 0.45 : 0.95}
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor={spreadTextAnchor(angle)}
                  fill={ringActive ? cssVar("text-primary") : cssVar("text-muted")}
                  fontSize={9}
                  fontWeight={700}
                  letterSpacing={0.9}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {plotted.map((node) => {
            const active = hoveredKey === node.key;
            const dimmed = hasHover && !active;
            return (
              <line
                key={`line-${node.key}`}
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={active ? node.color : cssVar("border")}
                strokeWidth={active ? 1.75 : 1}
                opacity={dimmed ? 0.18 : active ? 0.85 : 0.4}
              />
            );
          })}

          <circle cx={cx} cy={cy} r={30} fill={`${severityTint}28`} stroke={severityTint} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={22} fill="none" stroke={`${severityTint}55`} strokeWidth={1} strokeDasharray="3 4" />
          <text x={cx} y={cy - 3} textAnchor="middle" fill={cssVar("text-primary")} fontSize={10} fontWeight={800} letterSpacing={0.6}>
            FLIPKART
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle" fill={severityTint} fontSize={9} fontWeight={800} letterSpacing={0.8}>
            {severity.toUpperCase()}
          </text>

          {plotted.map((node) => {
            const active = hoveredKey === node.key;
            const dimmed = hasHover && !active;
            return (
              <g
                key={node.key}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredKey(node.key)}
                onMouseLeave={() => setHoveredKey(null)}
                opacity={dimmed ? 0.35 : 1}
              >
                <circle cx={node.x} cy={node.y} r={node.r + 14} fill="transparent" />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + (active ? 10 : 7)}
                  fill={node.color}
                  opacity={node.severity === "muted" ? 0.12 : active ? 0.28 : 0.16}
                  style={{ filter: active ? `url(#${glowFilterId})` : undefined }}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + (active ? 2 : 0)}
                  fill={node.color}
                  stroke={active ? cssVar("text-primary") : cssVar("surface")}
                  strokeWidth={active ? 2 : 1.5}
                  opacity={node.severity === "muted" ? 0.7 : 1}
                />
                {node.displayLabel && (!hasHover || active) ? (
                  <>
                    <text
                      x={node.labelPoint.x}
                      y={node.labelPoint.y - 4}
                      textAnchor={node.textAnchor}
                      fill={cssVar("text-primary")}
                      fontSize={active ? 10.5 : 9.5}
                      fontWeight={700}
                    >
                      {node.displayLabel}
                    </text>
                    <text
                      x={node.labelPoint.x}
                      y={node.labelPoint.y + 9}
                      textAnchor={node.textAnchor}
                      fill={node.color}
                      fontSize={9}
                      fontWeight={800}
                    >
                      {node.volume.toLocaleString()}
                    </text>
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>

        {hovered ? (
          <SpreadMapTooltip
            node={hovered}
            totalVolume={totalVolume}
            leftPct={(hovered.x / SPREAD_MAP_SIZE) * 100}
            topPct={(hovered.y / SPREAD_MAP_SIZE) * 100}
          />
        ) : null}
      </div>
    </div>
  );
}

/** Public buzz — composition strip + sized bubble cluster */
export function PublicBuzzVisual({ themes }: { themes: BrandRiskDrill["buzzThemes"] }): React.ReactElement {
  const parsed = useMemo(
    () =>
      themes.map((t, idx) => ({
        ...t,
        count: parseCount(t.mentions),
        color: BUZZ_COLORS[idx] ?? cssVar("text-muted"),
      })),
    [themes],
  );

  const total = parsed.reduce((sum, t) => sum + t.count, 0);
  const max = Math.max(...parsed.map((t) => t.count), 1);
  const viralShare = total > 0 ? Math.round((parsed.filter((t) => t.viral).reduce((s, t) => s + t.count, 0) / total) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <HubSummaryChip label="Total mentions" value={formatMentions(total)} color={cssVar("severity-high")} />
        <HubSummaryChip label="Viral share" value={`${viralShare}%`} color={cssVar("severity-med")} />
      </div>

      <div>
        <HubMicroLabel>Public conversation mix</HubMicroLabel>
        <div
          style={{
            display: "flex",
            height: 14,
            borderRadius: radius.pill,
            overflow: "hidden",
            marginTop: 8,
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          {parsed.map((t) => (
            <div
              key={t.theme}
              title={`${t.theme}: ${t.mentions}`}
              style={{
                width: `${total > 0 ? (t.count / total) * 100 : 0}%`,
                background: t.color,
                opacity: t.viral ? 1 : 0.72,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {parsed.map((t) => (
            <div key={t.theme} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: cssVar("text-secondary") }}>
                {t.theme}{" "}
                <span className="lisn-num" style={{ fontWeight: 700, color: t.color }}>
                  {Math.round((t.count / total) * 100)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <HubMicroLabel>Mention gravity · size = volume</HubMicroLabel>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            minHeight: 168,
            padding: "12px 8px",
            marginTop: 8,
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          {parsed.map((t) => {
            const size = bubbleSize(t.count, max);
            return (
              <div
                key={t.theme}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: size + 8,
                }}
              >
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, ${t.color}cc 0%, ${t.color}55 100%)`,
                    border: `2px solid ${t.color}`,
                    boxShadow: t.viral ? `0 0 18px ${t.color}55` : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span className="lisn-num" style={{ fontSize: size > 70 ? 14 : 11, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.1 }}>
                    {t.mentions}
                  </span>
                  {t.viral ? (
                    <Zap
                      size={12}
                      color="#fff"
                      style={{ position: "absolute", top: 4, right: 4, filter: `drop-shadow(0 0 4px ${t.color})` }}
                    />
                  ) : null}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-primary"), textAlign: "center", maxWidth: size + 16, lineHeight: 1.25 }}>
                  {t.theme}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompetitorPullRing({ score, color }: { score: number; color: string }): React.ReactElement {
  const size = 72;
  const stroke = 7;
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  const dash = c * (score / 100);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={cssVar("border")} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
          {score}
        </span>
      </div>
    </div>
  );
}

/** Competitor buzz — pull rings + inline drill-down */
export function CompetitorBuzzVisual({ competitors }: { competitors: BrandRiskDrill["competitor"] }): React.ReactElement {
  const [expandedName, setExpandedName] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, height: "100%" }}>
      {competitors.map((c) => {
        const color = c.comparativeBuzz >= 70 ? cssVar("severity-high") : cssVar("severity-med");
        const expanded = expandedName === c.name;

        return (
          <div
            key={c.name}
            style={{
              flex: expanded ? "0 0 auto" : 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${expanded ? `${color}44` : cssVar("border")}`,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setExpandedName(expanded ? null : c.name)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                flex: expanded ? "0 0 auto" : 1,
                padding: "8px 10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <CompetitorPullRing score={c.comparativeBuzz} color={color} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>{c.name}</span>
                  <ArrowRight size={14} color={cssVar("text-muted")} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("severity-med") }}>{c.theme}</span>
                </div>
                <div style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
                  <span style={{ color: cssVar("text-muted"), fontWeight: 600 }}>Risk to Flipkart: </span>
                  {c.flipkartComparison}
                </div>
              </div>

              <ChevronDown
                size={16}
                color={cssVar("text-muted")}
                style={{
                  flexShrink: 0,
                  marginTop: 4,
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 160ms ease",
                }}
              />
            </button>

            {expanded ? <CompetitorBuzzDrill detail={c.detail} accent={color} competitor={c.name} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function CompetitorBuzzDrill({
  detail,
  accent,
  competitor,
}: {
  detail: CompetitorBuzzDetail;
  accent: string;
  competitor: string;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "0 14px 14px",
        borderTop: `1px solid ${cssVar("border")}`,
        background: `${accent}06`,
      }}
    >
      <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <HubMicroLabel>Shopper shift</HubMicroLabel>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{detail.shopperShift}</p>
        </div>

        <div>
          <HubMicroLabel>Channel signals · where comparison is spreading</HubMicroLabel>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {detail.channelSignals.map((signal) => {
              const trendColor =
                signal.trend === "Rising"
                  ? cssVar("severity-high")
                  : signal.trend === "Watch"
                    ? cssVar("severity-med")
                    : cssVar("text-muted");

              return (
                <div
                  key={`${competitor}-${signal.surface}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "7px 10px",
                    borderRadius: radius.sm,
                    background: cssVar("surface"),
                    border: `1px solid ${cssVar("border")}`,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>{signal.surface}</span>
                  <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-secondary") }}>
                    {signal.mentions}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: trendColor, textTransform: "uppercase", letterSpacing: 0.35 }}>
                    {signal.trend}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <HubMicroLabel>Voice of shopper · comparison quotes</HubMicroLabel>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {detail.shopperQuotes.map((quote) => (
              <div
                key={quote}
                style={{
                  padding: "8px 10px",
                  borderRadius: radius.sm,
                  borderLeft: `3px solid ${accent}`,
                  background: cssVar("surface"),
                  fontSize: 12,
                  fontStyle: "italic",
                  color: cssVar("text-primary"),
                  lineHeight: 1.4,
                }}
              >
                &ldquo;{quote}&rdquo;
              </div>
            ))}
          </div>
        </div>

        <div>
          <HubMicroLabel>Flipkart weakness exposed</HubMicroLabel>
          <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.45 }}>
            {detail.flipkartWeakness}
          </p>
        </div>

        <div
          style={{
            padding: "10px 12px",
            borderRadius: radius.md,
            background: cssVar("accent-soft"),
            border: `1px solid ${cssVar("accent")}33`,
          }}
        >
          <HubMicroLabel>Recommended action</HubMicroLabel>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{detail.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
}

/** Quality issues — donut share + legend */
export function QualityTrustVisual({ quality }: { quality: BrandRiskDrill["quality"] }): React.ReactElement {
  const glowFilterId = useUniqueGradientId("quality-glow");

  const rows = useMemo(() => {
    const parsed = quality
      .map((q, idx) => ({
        issue: q.issue,
        count: parseCount(q.complaints),
        fill: QUALITY_COLORS[idx] ?? cssVar("text-muted"),
      }))
      .sort((a, b) => b.count - a.count);

    const total = parsed.reduce((sum, q) => sum + q.count, 0);

    return parsed.map((q) => ({
      ...q,
      share: total > 0 ? Math.round((q.count / total) * 100) : 0,
    }));
  }, [quality]);

  const total = rows.reduce((sum, q) => sum + q.count, 0);
  const pieData = rows.map((q) => ({ name: q.issue, value: q.count, fill: q.fill }));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 20,
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", height: 200, position: "relative", minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={QUALITY_COLORS[0]} floodOpacity="0.3" />
              </filter>
            </defs>
            <Pie
              data={[{ name: "track", value: total || 1 }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="88%"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              cornerRadius={3}
              stroke="rgba(0,0,0,0.35)"
              strokeWidth={2}
              isAnimationActive={false}
              style={{ filter: `url(#${glowFilterId})` }}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip {...hubChartTooltip} formatter={(v) => [formatMentions(Number(v)), "Mentions"]} />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
            {total.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginTop: 4,
            }}
          >
            Quality mentions
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
        {rows.map((row, index) => (
          <div
            key={row.issue}
            style={{
              display: "grid",
              gridTemplateColumns: "12px minmax(0, 1fr) auto auto",
              gap: 10,
              alignItems: "center",
              padding: "12px 0",
              borderBottom: index < rows.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 2, background: row.fill, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.3 }}>{row.issue}</span>
            <span className="lisn-num" style={{ fontSize: 15, fontWeight: 800, color: cssVar("text-primary"), flexShrink: 0 }}>
              {row.count.toLocaleString()}
            </span>
            <span className="lisn-num" style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-muted"), minWidth: 36, textAlign: "right", flexShrink: 0 }}>
              {row.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function influencerSentimentColor(sentiment: BrandInfluencerProfile["sentiment"]): string {
  switch (sentiment) {
    case "positive":
      return cssVar("positive");
    case "negative":
      return cssVar("severity-high");
    case "neutral":
      return cssVar("text-muted");
    default: {
      const _exhaustive: never = sentiment;
      return _exhaustive;
    }
  }
}

function influencerSentimentLabel(sentiment: BrandInfluencerProfile["sentiment"]): string {
  switch (sentiment) {
    case "positive":
      return "▲ Positive posts trending";
    case "negative":
      return "▼ Negative posts trending";
    case "neutral":
      return "→ Neutral post trend";
    default: {
      const _exhaustive: never = sentiment;
      return _exhaustive;
    }
  }
}

function featureBarColor(sentiment: number): string {
  if (sentiment >= 0.72) return cssVar("positive");
  if (sentiment >= 0.66) return "#06B6D4";
  return cssVar("severity-med");
}

function FeatureRequestTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: BrandFeatureRequest }[];
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const total = Math.max(row.mentions, 1);

  return (
    <div
      style={{
        minWidth: 220,
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: cssVar("text-primary"), marginBottom: 4, lineHeight: 1.35 }}>
        {row.req}
      </div>
      <div style={{ fontSize: 10, color: cssVar("text-muted"), marginBottom: 8 }}>
        Mentions by channel · total {row.mentions.toLocaleString()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {BRAND_SOCIAL_CHANNELS.map((ch) => {
          const count = row.channelSplit[ch] ?? 0;
          const pct = ((count / total) * 100).toFixed(1);
          const color = BRAND_SOCIAL_CHANNEL_COLORS[ch];
          return (
            <div key={ch} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: cssVar("text-secondary") }}>{ch}</span>
              </div>
              <span className="lisn-num" style={{ fontSize: 10, fontWeight: 700, color }}>
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Influencer & watchlist — compact account cards (head_retail pattern) */
export function InfluencerWatchlistVisual({
  influencers,
}: {
  influencers: BrandRiskDrill["influencers"];
}): React.ReactElement {
  const rows = useMemo(
    () => [...influencers].sort((a, b) => b.followers - a.followers),
    [influencers],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: 300,
        overflowY: "auto",
        paddingRight: 2,
      }}
    >
      {rows.map((profile) => {
        const sentimentColor = influencerSentimentColor(profile.sentiment);

        return (
          <div
            key={profile.id}
            style={{
              padding: "9px 10px",
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${profile.watchlist ? `${cssVar("severity-high")}30` : cssVar("border")}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3 }}>
                  u/{profile.username}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: sentimentColor, marginTop: 2, lineHeight: 1.3 }}>
                  {influencerSentimentLabel(profile.sentiment)}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.45 }}>
                <div className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
                  {profile.karma.toLocaleString()} karma
                </div>
                <div className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
                  {profile.followers.toLocaleString()} followers
                </div>
              </div>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.4 }}>
              {profile.lastPostSummary}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 6,
                fontSize: 10,
                color: cssVar("text-muted"),
              }}
            >
              <span className="lisn-num" style={{ fontWeight: 600 }}>
                Engagement rate: {profile.engagementRate}%
              </span>
              {profile.watchlist ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: cssVar("severity-high"),
                    textTransform: "uppercase",
                    letterSpacing: 0.35,
                  }}
                >
                  Watch closely
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Top feature requests — horizontal bar chart (head_retail pattern) */
export function TopFeatureRequestsVisual({
  featureRequests,
}: {
  featureRequests: BrandRiskDrill["featureRequests"];
}): React.ReactElement {
  const chartData = useMemo(
    () => [...featureRequests].sort((a, b) => b.mentions - a.mentions),
    [featureRequests],
  );

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" {...hubChartAxis} stroke={cssVar("border")} tick={{ fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="req"
            {...hubChartAxis}
            stroke={cssVar("border")}
            width={148}
            tick={{ fontSize: 10, fill: cssVar("text-muted") }}
          />
          <Tooltip content={<FeatureRequestTooltip />} />
          <Bar dataKey="mentions" name="Mentions" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {chartData.map((row) => (
              <Cell key={row.req} fill={featureBarColor(row.sentiment)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Brand severity — radial gauge + signal ribbon */
export function BrandSeverityScorecard({ brand }: { brand: BrandRiskTop }): React.ReactElement {
  const color = severityColor(brand.severity);
  const score = severityScore(brand.severity);
  const isCritical = brand.severity === "Critical";

  const gaugeData = [{ name: "Risk", value: score, fill: color }];
  const items = [
    { icon: Megaphone, label: "Top theme", value: brand.topTheme, accent: cssVar("severity-high") },
    { icon: ShieldAlert, label: "Trust", value: brand.trustSignal, accent: cssVar("severity-med") },
    { icon: TrendingUp, label: "Fraud", value: brand.fraudSignal, accent: cssVar("severity-high") },
    { icon: Radio, label: "Spread", value: brand.spread, accent: cssVar("severity-med") },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)",
        gap: 16,
        alignItems: "stretch",
        padding: "16px 18px",
        borderRadius: radius.lg,
        background: `linear-gradient(135deg, ${color}10 0%, ${cssVar("surface-raised")} 55%)`,
        border: `1px solid ${color}35`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <HubMicroLabel>Risk dial</HubMicroLabel>
        <div style={{ width: "100%", height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="100%"
              innerRadius="58%"
              outerRadius="100%"
              barSize={14}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar background={{ fill: cssVar("border") }} dataKey="value" cornerRadius={8} isAnimationActive={false} />
              <Tooltip {...hubChartTooltip} formatter={(v) => [`${v}/100`, "Risk load"]} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ textAlign: "center", marginTop: -28 }}>
          <div className="lisn-num" style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>
            {brand.severity}
          </div>
          {isCritical ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6 }}>
              <AlertTriangle size={13} color={color} />
              <HubStatusPill label="Going public" color={color} />
            </span>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, alignContent: "center" }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                padding: "12px 14px",
                borderRadius: radius.md,
                background: cssVar("surface"),
                border: `1px solid ${cssVar("border")}`,
                borderLeft: `3px solid ${item.accent}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <Icon size={13} color={item.accent} />
                <HubMicroLabel>{item.label}</HubMicroLabel>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.4 }}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
