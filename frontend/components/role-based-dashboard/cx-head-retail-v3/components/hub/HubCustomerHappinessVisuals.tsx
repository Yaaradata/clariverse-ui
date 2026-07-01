"use client";

import React, { useMemo } from "react";
import { ArrowRight, Clock, UserCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  CallingReasonRow,
  CallerSegmentRow,
  CustomerHappinessDrill,
  CustomerHappinessTop,
  JourneyBreakStep,
  SentimentSplit,
  WhoCallingSnapshot,
} from "../../lib/cxHeadRetailV3HubCards";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { HubAccentPanel, HubAiCallout, HubMicroLabel, HubStatusPill, HubSummaryChip } from "./HubVisualPrimitives";
import { hubChartAxis, hubChartTooltip } from "./HubChartPrimitives";
import { cssVar, radius } from "../../theme/tokens";

const SENT_POS = "#34d399";
const SENT_NEU = "#a3a3a3";
const SENT_NEG = "#ff6b6b";

const CHANNEL_COLORS: Record<string, string> = {
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "App reviews": "#8B7CF6",
  Social: "#06b6d4",
};

function parsePct(share: string): number {
  return Number.parseFloat(share.replace("%", "")) || 0;
}

function parseCount(text: string): number {
  const match = text.match(/[\d,]+/);
  if (!match) return 0;
  return Number.parseInt(match[0].replace(/,/g, ""), 10) || 0;
}

function parseVolume(text: string): number {
  const cleaned = text.trim().replace(/,/g, "");
  const kMatch = cleaned.match(/^([\d.]+)\s*K$/i);
  if (kMatch) return Math.round(Number.parseFloat(kMatch[1]) * 1000);
  const mMatch = cleaned.match(/^([\d.]+)\s*M$/i);
  if (mMatch) return Math.round(Number.parseFloat(mMatch[1]) * 1_000_000);
  return parseCount(text);
}

const JOURNEY_STATUS_COLOR: Record<JourneyBreakStep["status"], string> = {
  breaking: cssVar("severity-high"),
  watch: cssVar("severity-med"),
  ok: cssVar("positive"),
};

const JOURNEY_STATUS_LABEL: Record<JourneyBreakStep["status"], string> = {
  breaking: "Breaking",
  watch: "Watch",
  ok: "OK",
};

const JOURNEY_ACTION_LABEL: Record<JourneyBreakStep["status"], string> = {
  breaking: "Fix now",
  watch: "Monitor",
  ok: "Stable",
};

function SentimentStatTile({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.45,
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        {label}
      </div>
      <div
        className="lisn-num"
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: color ?? cssVar("text-primary"),
          marginTop: 4,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div style={{ fontSize: 11, color: cssVar("text-secondary"), marginTop: 4, lineHeight: 1.35 }}>{sub}</div>
      ) : null}
    </div>
  );
}

/** Donut pie chart — sentiment split */
export function SentimentVisual({ sentiment }: { sentiment: SentimentSplit }): React.ReactElement {
  const { positive, neutral, negative, changeLabel, risingAlert, contactsScored } = sentiment;
  const glowFilterId = useUniqueGradientId("sentiment-glow");

  const netSentiment = positive - negative;
  const voicedShare = 100 - neutral;
  const posNegRatio = negative > 0 ? (positive / negative).toFixed(1) : "—";
  const dominant = positive >= neutral && positive >= negative ? "Positive" : negative >= neutral ? "Negative" : "Neutral";

  const pieData = useMemo(
    () => [
      { name: "Positive", value: positive, fill: SENT_POS },
      { name: "Neutral", value: neutral, fill: SENT_NEU },
      { name: "Negative", value: negative, fill: SENT_NEG },
    ],
    [positive, neutral, negative],
  );

  const legendItems = [
    {
      label: "Positive",
      value: `${positive}%`,
      color: SENT_POS,
      note: dominant === "Positive" ? "Largest share" : `${positive - negative >= 0 ? "+" : ""}${positive - negative} vs negative`,
    },
    {
      label: "Neutral",
      value: `${neutral}%`,
      color: SENT_NEU,
      note: "Passive / unscored",
    },
    {
      label: "Negative",
      value: `${negative}%`,
      color: SENT_NEG,
      note: dominant === "Negative" ? "Largest share" : changeLabel,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 20,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ width: "100%", height: 172, position: "relative", minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={SENT_NEG} floodOpacity="0.35" />
                </filter>
              </defs>
              <Pie
                data={[{ name: "track", value: 100 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="54%"
                outerRadius="86%"
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
                innerRadius="54%"
                outerRadius="86%"
                paddingAngle={3}
                cornerRadius={4}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={2}
                isAnimationActive={false}
                style={{ filter: `url(#${glowFilterId})` }}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...hubChartTooltip} formatter={(v) => [`${v}%`, "Share"]} />
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
            <span className="lisn-num" style={{ fontSize: 26, fontWeight: 800, color: SENT_NEG, lineHeight: 1 }}>
              {negative}%
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.45, marginTop: 2 }}>
              Negative
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            justifyContent: "center",
            minWidth: 0,
            width: "100%",
            border: `1px solid ${cssVar("border")}`,
            borderRadius: radius.md,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 8,
              padding: "8px 12px",
              background: cssVar("surface-raised"),
              borderBottom: `1px solid ${cssVar("border")}`,
            }}
          >
            <HubMicroLabel>Sentiment</HubMicroLabel>
            <HubMicroLabel>Share</HubMicroLabel>
          </div>
          {legendItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 8,
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: index < legendItems.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 3, paddingLeft: 16 }}>{item.note}</div>
              </div>
              <span className="lisn-num" style={{ fontSize: 17, fontWeight: 800, color: item.color, flexShrink: 0 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, width: "100%" }}>
        <SentimentStatTile
          label="Contacts scored"
          value={contactsScored ?? "—"}
          sub="Across voice, chat, reviews"
        />
        <SentimentStatTile
          label="Net sentiment"
          value={`${netSentiment >= 0 ? "+" : ""}${netSentiment} pts`}
          sub="Positive minus negative share"
          color={netSentiment >= 0 ? SENT_POS : SENT_NEG}
        />
        <SentimentStatTile
          label="Voiced opinion"
          value={`${voicedShare}%`}
          sub={`${neutral}% stayed neutral`}
        />
        <SentimentStatTile
          label="Pos : Neg ratio"
          value={`${posNegRatio} : 1`}
          sub={changeLabel}
          color={SENT_NEG}
        />
      </div>

      {risingAlert ? <HubAiCallout tone="risk">{risingAlert}</HubAiCallout> : null}
    </div>
  );
}

const SENTIMENT_LEGEND = [
  { color: "#34d399", label: "Positive" },
  { color: "#fbbf24", label: "Neutral" },
  { color: "#ff073a", label: "Negative" },
] as const;

const CALLER_TABLE_COLS = "72px minmax(88px,1fr) 72px 72px 64px";

function formatInteractions(value: number): string {
  return value.toLocaleString("en-US");
}

function sentimentColor(score: number): string {
  if (score <= 0.05) return cssVar("severity-med");
  if (score <= 0.1) return cssVar("positive");
  return cssVar("severity-high");
}

function wowMeta(delta: number): { color: string; arrow: string } {
  if (Math.abs(delta) < 0.05) return { color: cssVar("text-muted"), arrow: "●" };
  if (delta > 0) return { color: cssVar("positive"), arrow: "▲" };
  return { color: cssVar("severity-high"), arrow: "▼" };
}

function CallerSegmentTableRow({ row, index }: { row: CallerSegmentRow; index: number }): React.ReactElement {
  const wow = wowMeta(row.wowDelta);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: CALLER_TABLE_COLS,
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderTop: index === 0 ? undefined : `1px solid ${cssVar("border")}`,
      }}
      title={`${row.key.toUpperCase()} · ${formatInteractions(row.interactions)} interactions · WoW ${row.wowDelta > 0 ? "+" : ""}${row.wowDelta.toFixed(1)}% · Sentiment ${row.sentiment.toFixed(2)} · FCI ${row.fciRate}%`}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 800,
          padding: "3px 8px",
          borderRadius: radius.pill,
          background: `${row.color}18`,
          color: row.color,
          border: `1px solid ${row.color}40`,
          width: "max-content",
        }}
      >
        {row.key.toUpperCase()}
      </span>
      <span className="lisn-num" style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>
        {formatInteractions(row.interactions)}
      </span>
      <span className="lisn-num" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: wow.color, paddingLeft: 6 }}>
        <span style={{ fontSize: 9 }}>{wow.arrow}</span>
        {Math.abs(row.wowDelta).toFixed(1)}%
      </span>
      <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: sentimentColor(row.sentiment) }}>
        {row.sentiment.toFixed(2)}
      </span>
      <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("text-primary") }}>
        {row.fciRate}%
      </span>
    </div>
  );
}

/** HV/LV × HF/LF segment table — total interactions + per-segment WoW, sentiment, FCI. */
export function CustomerSegmentVisual({ whoCalling }: { whoCalling: WhoCallingSnapshot }): React.ReactElement {
  const tableHeaders = ["SEGMENT", "INTERACTIONS", "WoW", "SENTIMENT", "FCI RATE"] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <HubMicroLabel>Total interactions</HubMicroLabel>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            <span
              className="lisn-num"
              style={{
                fontSize: 30,
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatInteractions(whoCalling.totalInteractions)}
            </span>
            <span
              className="lisn-num"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: radius.pill,
                fontSize: 10.5,
                fontWeight: 700,
                color: cssVar("positive"),
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.35)",
              }}
            >
              ▲ {whoCalling.lastWeekDeltaLabel} vs last week
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {SENTIMENT_LEGEND.map((item) => (
            <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, color: cssVar("text-muted") }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          border: `1px solid ${cssVar("border")}`,
          borderRadius: radius.md,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: CALLER_TABLE_COLS,
            alignItems: "center",
            gap: 12,
            padding: "8px 12px",
            background: cssVar("surface-raised"),
            borderBottom: `1px solid ${cssVar("border")}`,
          }}
        >
          {tableHeaders.map((header) => (
            <span
              key={header}
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: cssVar("text-muted"),
                paddingLeft: header === "WoW" ? 6 : 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {header}
            </span>
          ))}
        </div>

        {whoCalling.segments.map((row, index) => (
          <CallerSegmentTableRow key={row.key} row={row} index={index} />
        ))}
      </div>
    </div>
  );
}

function CallingReasonList({
  title,
  rows,
  accent,
  totalVolume,
}: {
  title: string;
  rows: CallingReasonRow[];
  accent: string;
  totalVolume: string;
}): React.ReactElement {
  return (
    <div
      style={{
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.md,
        overflow: "hidden",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
          padding: "10px 12px",
          background: cssVar("surface-raised"),
          borderBottom: `1px solid ${cssVar("border")}`,
        }}
      >
        <HubMicroLabel>{title}</HubMicroLabel>
        <span className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-muted") }}>
          {totalVolume} contacts
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((row, index) => {
          const rowAccent = index === 0 ? accent : index === 1 ? cssVar("severity-med") : cssVar("text-muted");
          const trendColor = row.trendRisk ? cssVar("severity-high") : row.trend.startsWith("−") ? cssVar("positive") : cssVar("text-muted");

          return (
            <div
              key={row.label}
              style={{
                padding: "10px 12px",
                borderBottom: index < rows.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
                background: index === 0 ? `linear-gradient(90deg, ${rowAccent}08 0%, transparent 70%)` : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  className="lisn-num"
                  style={{
                    minWidth: 34,
                    height: 28,
                    padding: "0 8px",
                    borderRadius: radius.pill,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    color: rowAccent,
                    background: `${rowAccent}18`,
                    border: `1px solid ${rowAccent}35`,
                    flexShrink: 0,
                  }}
                >
                  #{index + 1}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3 }}>{row.label}</div>
                      <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 3 }}>
                        <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
                          {row.volume}
                        </span>{" "}
                        contacts · AHT {row.aht}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="lisn-num" style={{ fontSize: 18, fontWeight: 800, color: rowAccent, lineHeight: 1 }}>
                        {row.share}
                      </div>
                      <div className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: trendColor, marginTop: 3 }}>
                        {row.trend}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 6 }}>
                    Repeat contact{" "}
                    <span className="lisn-num" style={{ fontWeight: 800, color: parsePct(row.repeatPct) >= 30 ? cssVar("severity-high") : cssVar("text-secondary") }}>
                      {row.repeatPct}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WhyCallingVisual({ drill }: { drill: CustomerHappinessDrill }): React.ReactElement {
  const intentVolume = drill.intents.reduce((sum, row) => sum + parseVolume(row.volume), 0);
  const frictionVolume = drill.friction.reduce((sum, row) => sum + parseVolume(row.volume), 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      <CallingReasonList
        title="Top intents"
        rows={drill.intents}
        accent={cssVar("severity-high")}
        totalVolume={`${intentVolume >= 1000 ? `${(intentVolume / 1000).toFixed(1)}K` : intentVolume.toLocaleString()}`}
      />
      <CallingReasonList
        title="Top friction"
        rows={drill.friction}
        accent={cssVar("severity-med")}
        totalVolume={`${frictionVolume >= 1000 ? `${(frictionVolume / 1000).toFixed(1)}K` : frictionVolume.toLocaleString()}`}
      />
    </div>
  );
}

/** Journey breakpoint map — lane cards in funnel order */
export function JourneyStatusVisual({ steps }: { steps: CustomerHappinessDrill["journeyBreaks"] }): React.ReactElement {
  const breakingCount = steps.filter((s) => s.status === "breaking").length;
  const watchCount = steps.filter((s) => s.status === "watch").length;
  const brokenContacts = steps
    .filter((s) => s.status === "breaking")
    .reduce((sum, s) => sum + parseVolume(s.contacts), 0);
  const brokenContactsLabel =
    brokenContacts >= 1000 ? `${(brokenContacts / 1000).toFixed(1)}K` : brokenContacts.toLocaleString();
  const maxContacts = Math.max(...steps.map((s) => parseVolume(s.contacts)), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <HubSummaryChip label="Breaking" value={String(breakingCount)} color={cssVar("severity-high")} />
        <HubSummaryChip label="Watch" value={String(watchCount)} color={cssVar("severity-med")} />
        <HubSummaryChip label="Contacts in broken stages" value={brokenContactsLabel} color={cssVar("text-secondary")} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 6,
          overflowX: "auto",
          padding: "2px 0 4px",
        }}
      >
        {steps.map((stage, index) => {
          const color = JOURNEY_STATUS_COLOR[stage.status];
          const trendColor = stage.trendRisk
            ? cssVar("severity-high")
            : stage.trend.startsWith("−")
              ? cssVar("positive")
              : cssVar("text-muted");
          const loadPct = Math.max(18, Math.round((parseVolume(stage.contacts) / maxContacts) * 100));

          return (
            <React.Fragment key={stage.step}>
              <div
                style={{
                  flex: "1 1 0",
                  minWidth: 108,
                  maxWidth: 140,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: radius.md,
                  border: `1px solid ${stage.status === "breaking" ? `${color}45` : cssVar("border")}`,
                  background:
                    stage.status === "breaking"
                      ? `linear-gradient(180deg, ${color}14 0%, ${cssVar("surface-raised")} 55%)`
                      : cssVar("surface-raised"),
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 4, background: color, opacity: stage.status === "ok" ? 0.45 : 1 }} />
                <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3 }}>{stage.step}</div>
                    {stage.status !== "ok" ? (
                      <div style={{ marginTop: 5 }}>
                        <HubStatusPill label={JOURNEY_STATUS_LABEL[stage.status]} color={color} />
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>
                      {stage.contacts}
                    </div>
                    <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 3 }}>
                      {stage.journeyShare} of journey load
                    </div>
                  </div>

                  <div
                    style={{
                      height: 5,
                      borderRadius: radius.pill,
                      background: cssVar("border"),
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${loadPct}%`,
                        height: "100%",
                        borderRadius: radius.pill,
                        background: color,
                        opacity: stage.status === "ok" ? 0.5 : 1,
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginTop: "auto" }}>
                    <span className="lisn-num" style={{ fontSize: 10, fontWeight: 700, color: trendColor }}>
                      {stage.trend}
                    </span>
                    {stage.status === "breaking" ? (
                      <HubStatusPill label={JOURNEY_ACTION_LABEL[stage.status]} color={color} />
                    ) : null}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight size={14} color={cssVar("text-muted")} style={{ flexShrink: 0, alignSelf: "center" }} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/** Horizontal bar chart — channel complaint volume */
export function ChannelImpactVisual({
  channels,
  headline,
}: {
  channels: CustomerHappinessDrill["channels"];
  headline: string;
}): React.ReactElement {
  const volume = headline.replace(" affected shoppers today", "");
  const data = useMemo(
    () =>
      channels
        .map((c) => ({
          name: c.name,
          count: parseCount(c.mentions),
          fill: CHANNEL_COLORS[c.name] ?? cssVar("accent"),
          mentions: c.mentions,
        }))
        .sort((a, b) => b.count - a.count),
    [channels],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <HubMicroLabel>Affected shoppers today</HubMicroLabel>
        <div className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: cssVar("text-primary"), marginTop: 4 }}>
          {volume}
        </div>
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={cssVar("border")} horizontal={false} />
            <XAxis type="number" {...hubChartAxis} />
            <YAxis type="category" dataKey="name" width={76} {...hubChartAxis} />
            <Tooltip
              {...hubChartTooltip}
              formatter={(_, __, item) => {
                const payload = item?.payload as (typeof data)[number] | undefined;
                return [payload?.mentions ?? "", "Mentions"];
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16} isAnimationActive={false}>
              {data.map((row) => (
                <Cell key={row.name} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Bar chart — incident response snapshot + action tiles */
export function IncidentActionVisual({ drill }: { drill: CustomerHappinessDrill }): React.ReactElement {
  const b = drill.breaking;
  const escalated = b.escalatedToBackend === "Yes";
  const [whereFrom, whereTo] = b.where.split(" → ");
  const hoursActive = parseCount(b.activeSince) || 4;

  const responseData = useMemo(
    () => [
      { metric: "Hours active", value: hoursActive, fill: cssVar("severity-med"), max: 24 },
      { metric: "Escalated", value: escalated ? 100 : 20, fill: escalated ? cssVar("severity-high") : cssVar("positive") },
      { metric: "Backend routed", value: escalated ? 100 : 0, fill: cssVar("accent") },
    ],
    [hoursActive, escalated],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <HubAccentPanel accent={cssVar("severity-high")} highlight>
        <HubMicroLabel>Active incident</HubMicroLabel>
        <div style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.4, marginTop: 8 }}>{b.what}</div>
      </HubAccentPanel>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <HubMicroLabel>Where</HubMicroLabel>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: radius.pill,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{whereFrom}</span>
          <ArrowRight size={13} color={cssVar("severity-med")} />
          <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("severity-med") }}>{whereTo ?? b.where}</span>
        </div>
      </div>

      <div>
        <HubMicroLabel>Response status</HubMicroLabel>
        <div style={{ width: "100%", height: 120, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={cssVar("border")} vertical={false} />
              <XAxis dataKey="metric" {...hubChartAxis} interval={0} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip {...hubChartTooltip} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40} isAnimationActive={false}>
                {responseData.map((row) => (
                  <Cell key={row.metric} fill={row.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        <HubAccentPanel accent={cssVar("accent")}>
          <UserCheck size={14} color={cssVar("accent")} style={{ marginBottom: 6 }} />
          <HubMicroLabel>Owner</HubMicroLabel>
          <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), marginTop: 4, lineHeight: 1.35 }}>{b.owner}</div>
        </HubAccentPanel>
        <HubAccentPanel accent={cssVar("severity-med")}>
          <Clock size={14} color={cssVar("severity-med")} style={{ marginBottom: 6 }} />
          <HubMicroLabel>Active</HubMicroLabel>
          <div className="lisn-num" style={{ fontSize: 15, fontWeight: 800, color: cssVar("severity-med"), marginTop: 4 }}>
            {b.activeSince}
          </div>
        </HubAccentPanel>
        <HubAccentPanel accent={escalated ? cssVar("severity-high") : cssVar("positive")} highlight={escalated}>
          <HubMicroLabel>Escalated</HubMicroLabel>
          <div style={{ marginTop: 6 }}>
            <HubStatusPill label={escalated ? "Yes" : "No"} color={escalated ? cssVar("severity-high") : cssVar("positive")} />
          </div>
        </HubAccentPanel>
      </div>
    </div>
  );
}
