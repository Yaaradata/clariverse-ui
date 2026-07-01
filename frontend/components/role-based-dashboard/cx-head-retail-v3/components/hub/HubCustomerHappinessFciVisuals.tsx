"use client";

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CUSTOMER_RELATIONSHIP_TIERS,
  CUSTOMER_WHATS_FAILING,
  WHATS_FAILING_CHANNEL_COLORS,
  WHATS_FAILING_CHANNELS,
  WHATS_FAILING_SEGMENT_COLORS,
  WHATS_FAILING_SEGMENTS,
  type RelationshipValueTier,
} from "../../lib/cxHeadRetailV3CustomerFciData";
import { hubChartAxis, hubChartTooltip } from "./HubChartPrimitives";
import { DetailSection } from "./HubDetailPrimitives";
import { cssVar, radius } from "../../theme/tokens";

type WhatsFailingView = "channel" | "segment";

const SENTIMENT_LEGEND = [
  { label: "Happy", color: cssVar("positive") },
  { label: "Neutral", color: cssVar("severity-med") },
  { label: "Unhappy", color: cssVar("severity-high") },
] as const;

function ViewToggle({
  view,
  onChange,
}: {
  view: WhatsFailingView;
  onChange: (view: WhatsFailingView) => void;
}): React.ReactElement {
  const options: { id: WhatsFailingView; label: string }[] = [
    { id: "channel", label: "By Channel" },
    { id: "segment", label: "By Customer Segment" },
  ];

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = view === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            style={{
              padding: "5px 12px",
              borderRadius: radius.pill,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${active ? cssVar("accent") : cssVar("border")}`,
              background: active ? cssVar("accent") : cssVar("surface-raised"),
              color: active ? "#fff" : cssVar("text-secondary"),
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function WhatsFailingLegend({ view }: { view: WhatsFailingView }): React.ReactElement {
  const items =
    view === "channel"
      ? WHATS_FAILING_CHANNELS.map((key) => ({ key, color: WHATS_FAILING_CHANNEL_COLORS[key] }))
      : WHATS_FAILING_SEGMENTS.map((key) => ({ key, color: WHATS_FAILING_SEGMENT_COLORS[key] }));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 14px", marginTop: 8 }}>
      {items.map((item) => (
        <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: cssVar("text-muted"), fontWeight: 600 }}>{item.key}</span>
        </div>
      ))}
    </div>
  );
}

function WhatsFailingChart({ view }: { view: WhatsFailingView }): React.ReactElement {
  const chartData = useMemo(
    () =>
      [...CUSTOMER_WHATS_FAILING]
        .sort((a, b) => b.total - a.total)
        .map((row) => ({
          name: row.shortName,
          total: row.total,
          ...(view === "channel" ? row.byChannel : row.bySegment),
        })),
    [view],
  );

  return (
    <>
      <div style={{ width: "100%", height: 248 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              {...hubChartAxis}
              stroke={cssVar("border")}
              interval={0}
              angle={-32}
              textAnchor="end"
              height={62}
              tick={{ fontSize: 9, fill: cssVar("text-muted") }}
            />
            <YAxis {...hubChartAxis} stroke={cssVar("border")} width={36} tick={{ fontSize: 10 }} />
            <Tooltip
              {...hubChartTooltip}
              formatter={(value, name) => [Number(value).toLocaleString(), String(name)]}
            />
            {view === "channel"
              ? WHATS_FAILING_CHANNELS.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="failures"
                    fill={WHATS_FAILING_CHANNEL_COLORS[key]}
                    isAnimationActive={false}
                  />
                ))
              : WHATS_FAILING_SEGMENTS.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="failures"
                    fill={WHATS_FAILING_SEGMENT_COLORS[key]}
                    isAnimationActive={false}
                  />
                ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <WhatsFailingLegend view={view} />
    </>
  );
}

/** Section wrapper — title row carries view toggle */
export function WhatsFailingSection(): React.ReactElement {
  const [view, setView] = useState<WhatsFailingView>("channel");

  return (
    <DetailSection
      premium
      fill
      title="What's Failing?"
      trailing={<ViewToggle view={view} onChange={setView} />}
    >
      <WhatsFailingChart view={view} />
    </DetailSection>
  );
}

function formatTierInteractions(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toLocaleString();
}

function SegmentPill({ tier }: { tier: RelationshipValueTier }): React.ReactElement {
  return (
    <span
      title={tier.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3px 10px",
        borderRadius: radius.pill,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.35,
        color: tier.color,
        background: `${tier.color}18`,
        border: `1px solid ${tier.color}55`,
        flexShrink: 0,
      }}
    >
      {tier.shortLabel}
    </span>
  );
}

function SentimentSplitBar({
  happy,
  neutral,
  unhappy,
}: {
  happy: number;
  neutral: number;
  unhappy: number;
}): React.ReactElement {
  const segments = [
    { pct: happy, color: cssVar("positive"), text: "#000" },
    { pct: neutral, color: cssVar("severity-med"), text: "#000" },
    { pct: unhappy, color: cssVar("severity-high"), text: "#fff" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: 18,
        borderRadius: radius.sm,
        overflow: "hidden",
        background: cssVar("border"),
      }}
    >
      {segments.map((seg, index) => (
        <div
          key={index}
          style={{
            width: `${seg.pct}%`,
            background: seg.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: seg.pct >= 12 ? undefined : 0,
          }}
        >
          {seg.pct >= 12 ? (
            <span className="lisn-num" style={{ fontSize: 9, fontWeight: 800, color: seg.text }}>
              {seg.pct}%
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Sentiment by relationship value — HV/LV × HF/LF segments + GMV at stake */
export function SentimentRelationshipValueVisual(): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {CUSTOMER_RELATIONSHIP_TIERS.map((tier) => (
        <div key={tier.id}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <SegmentPill tier={tier} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: cssVar("text-secondary"),
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tier.label}
              </span>
            </div>
            <span className="lisn-num" style={{ fontSize: 10, color: cssVar("text-muted"), flexShrink: 0 }}>
              {tier.gmv} · {formatTierInteractions(tier.interactions)} int.
            </span>
          </div>
          <SentimentSplitBar happy={tier.happy} neutral={tier.neutral} unhappy={tier.unhappy} />
        </div>
      ))}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 12px",
          paddingTop: 8,
          borderTop: `1px solid ${cssVar("border")}`,
        }}
      >
        {SENTIMENT_LEGEND.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
            <span style={{ fontSize: 10, color: cssVar("text-muted"), fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
