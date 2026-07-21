"use client";

import React from "react";
import { Bot, ChevronRight } from "lucide-react";
import type { HubCardRightPanel, HubJourneyCardData } from "../../lib/cxHeadRetailV3HubCards";
import { hubActiveIndexForRange, hubHeroDelta, hubTrendWindow } from "../../lib/cxHeadRetailV3HubCards";
import type { TrustRangeKey } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { TRUST_PULSE } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";
import { ConfidenceChip } from "./ConfidenceBand";
import { MiniGauge } from "./MiniSparkline";
import { RetailTrendAreaChart } from "./RetailTrendAreaChart";
import { cssVar, radius } from "../../theme/tokens";

function channelBarColor(v: number): string {
  if (v >= 0.65) return cssVar("positive");
  if (v >= 0.55) return cssVar("severity-med");
  return cssVar("severity-high");
}

function ChannelBars({ channels }: { channels: Extract<HubCardRightPanel, { kind: "channels" }>["channels"] }): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 6 }}>
      {channels.map((ch) => {
        const barColor = channelBarColor(ch.v);
        return (
          <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 10, color: cssVar("text-muted"), width: 58, flexShrink: 0 }}>{ch.name}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${barColor}20` }}>
              <div style={{ height: "100%", width: `${ch.v * 100}%`, background: barColor, borderRadius: 3 }} />
            </div>
            <span className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: barColor, width: 28, textAlign: "right" }}>
              {ch.v.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function GaugePanel({
  gauges,
  stats,
}: Pick<Extract<HubCardRightPanel, { kind: "gauges" }>, "gauges" | "stats">): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8, alignItems: "start" }}>
        {gauges.map((g) => (
          <MiniGauge
            key={g.label}
            label={g.label}
            topLabel={g.topLabel}
            bottomLabel={g.bottomLabel}
            value={g.value}
            color={g.color}
            suffix={g.suffix}
            displayValue={g.displayValue}
            showMeter={g.showMeter}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: stats.length === 1 ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "4px 14px",
          alignItems: "start",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</div>
            <div
              className="lisn-num"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: s.color ?? cssVar("text-primary"),
                whiteSpace: "nowrap",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustSeverityPanel({
  cliffCount,
  topCliff,
  incidentRate,
  topBreaker,
}: Extract<HubCardRightPanel, { kind: "trustSeverity" }>): React.ReactElement {
  const animatedCliffs = useAnimatedNumber(cliffCount, { duration: 700, delay: 40 });
  const animatedIncident = useAnimatedNumber(incidentRate, { duration: 700, delay: 60, decimals: 1 });

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>Top cliff</div>
        <div className="lisn-num" style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary"), marginTop: 2 }}>
          {topCliff}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "6px 12px",
            marginTop: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>
              Cliffs live
            </div>
            <div className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("severity-high"), marginTop: 2 }}>
              {animatedCliffs}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>
              Incident
            </div>
            <div className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("text-primary"), marginTop: 2 }}>
              {animatedIncident}%
            </div>
          </div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>Push to</div>
        <div className="lisn-num" style={{ fontSize: 13, fontWeight: 700, color: cssVar("accent-2"), marginTop: 2 }}>
          {topBreaker}
        </div>
      </div>
    </div>
  );
}

function RightPanel({ panel }: { panel: HubCardRightPanel }): React.ReactElement {
  switch (panel.kind) {
    case "channels":
      return <ChannelBars channels={panel.channels} />;
    case "trustSeverity":
      return <TrustSeverityPanel {...panel} />;
    case "gauges":
      return <GaugePanel gauges={panel.gauges} stats={panel.stats} />;
    default: {
      const _exhaustive: never = panel;
      return _exhaustive;
    }
  }
}

const INSIGHT_LINE_COUNT = 4;
const INSIGHT_FONT_SIZE = 15;
const INSIGHT_LINE_HEIGHT = 1.55;

function ConversationInsightLines({ text }: { text: string }): React.ReactElement {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, INSIGHT_LINE_COUNT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {lines.map((line, index) => (
        <p
          key={`insight-line-${index}`}
          style={{
            margin: 0,
            fontSize: INSIGHT_FONT_SIZE,
            lineHeight: INSIGHT_LINE_HEIGHT,
            color: cssVar("text-secondary"),
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export function HubJourneyCard({
  card,
  onClick,
  range = "7D",
}: {
  card: HubJourneyCardData;
  onClick: () => void;
  range?: TrustRangeKey;
}): React.ReactElement {
  const Icon = card.icon;
  const activeIndex = hubActiveIndexForRange(card.timeline.length, range);
  const point = card.timeline[activeIndex] ?? card.timeline[card.timeline.length - 1];
  const trendSlice = hubTrendWindow(card.timeline, range, activeIndex);
  const trendData = trendSlice.map((t) => ({ w: t.label, v: t.heroValue }));
  const { text: heroDelta, positive: deltaPositive } = hubHeroDelta(card.timeline, activeIndex);
  const deltaColor = deltaPositive ? cssVar("positive") : cssVar("severity-high");
  const animatedHero = useAnimatedNumber(point.heroValue, { duration: 750, delay: 20 });

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        textAlign: "left",
        background: cssVar("surface"),
        border: `1px solid ${card.sparkColor}40`,
        borderRadius: radius.lg,
        padding: "24px 22px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 0,
        width: "100%",
        boxShadow: String(cssVar("shadow-card")),
        transition: "box-shadow 0.2s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${card.sparkColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = String(cssVar("shadow-card"));
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${card.iconColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Icon size={18} color={card.iconColor} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.25 }}>{card.title}</div>
            <div style={{ fontSize: 14, color: cssVar("text-muted"), lineHeight: 1.4, marginTop: 2 }}>{card.subtitle}</div>
          </div>
        </div>
        <ChevronRight size={36} color={cssVar("text-muted")} style={{ flexShrink: 0, opacity: 0.5 }} strokeWidth={1.75} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "stretch",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
          <span
            className="lisn-num"
            style={{ position: "absolute", top: 0, right: 0, fontSize: 13, color: deltaColor, fontWeight: 700 }}
          >
            {heroDelta}
          </span>
          <div style={{ marginBottom: 6, paddingRight: 64 }}>
            <div className="lisn-num" style={{ fontSize: 34, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
              {animatedHero}
            </div>
          </div>
          <div style={{ width: "100%", flex: 1, minHeight: 96 }}>
            <RetailTrendAreaChart
              data={trendData}
              stroke={card.sparkColor}
              yPadBelow={card.sparkYPadBelow ?? 6}
              yPadAbove={card.sparkYPadAbove ?? 4}
              gradientKey={`hub-${card.id}`}
            />
          </div>
        </div>
        <RightPanel panel={point.rightPanel} />
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${cssVar("severity-med")}10 0%, ${card.iconColor}08 38%)`,
          border: `1px solid ${cssVar("severity-med")}28`,
          borderLeft: `4px solid ${cssVar("severity-med")}`,
          borderRadius: radius.md,
          padding: "10px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Bot size={11} color={cssVar("severity-med")} />
            <span style={{ fontSize: 12, fontWeight: 700, color: cssVar("severity-med"), letterSpacing: 0.5, textTransform: "uppercase" }}>
              Conversation AI
            </span>
          </div>
          {card.id === "trust" ? <ConfidenceChip conf={TRUST_PULSE.modelConfidence} small /> : null}
        </div>
        <ConversationInsightLines text={point.conversationInsight} />
      </div>
    </button>
  );
}
