"use client";

import { TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ServiceReputationSnapshot } from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";
import {
  formatChannelScore,
  formatDelta,
} from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";
import { useDashboardTheme } from "../../DashboardThemeContext";
import { LiveModelledPill, statusChipStyle } from "./LiveModelledPill";
import { SRPanel, boxBorder, borderSides } from "./SRPanel";

type Score = ServiceReputationSnapshot["service_reputation_score"];
type Wall = ServiceReputationSnapshot["ai_summary_wall"];
type Channels = ServiceReputationSnapshot["channel_scores"];

export function ServiceReputationScorePanel({ data }: { data: Score }) {
  const T = useDashboardTheme();
  const trend = data.trend_8w.map((p) => ({ w: p.week, v: p.value }));

  return (
    <SRPanel
      title={data.label}
      subtitle="Composite public service reputation · 8-week trend"
      accentColor={T.amber}
      ai
      aiModel={data.index_badge.replace(/^AI ·\s*/i, "")}
      fill
      headerRight={<LiveModelledPill source={data.source} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 260px) minmax(240px, 1fr)",
          gap: 16,
          alignItems: "stretch",
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: T.amber,
              fontFamily: "var(--mono)",
              lineHeight: 1,
            }}
          >
            {data.score}
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.textMut,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            out of {data.out_of}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 800,
              color: T.red,
              fontFamily: "var(--mono)",
              marginTop: 6,
            }}
          >
            <TrendingDown size={12} />
            {data.delta_pts} pts {data.delta_label}
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 4, lineHeight: 1.45 }}>
            <strong style={{ color: T.text }}>Verdict:</strong> {data.verdict}
          </div>
        </div>
        <div style={{ minHeight: 160, flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={160}>
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="hdfc-sr-score" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.amber} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={T.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="w" stroke={T.textMut} fontSize={10} />
              <YAxis domain={[40, 70]} stroke={T.textMut} fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,14,22,0.96)",
                  border: `1px solid ${T.borderLight}`,
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(value) => [`${value} / 100`, "Score"]}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={T.amber}
                strokeWidth={2.5}
                fill="url(#hdfc-sr-score)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SRPanel>
  );
}

export function ServiceReputationAIWall({ data }: { data: Wall }) {
  const T = useDashboardTheme();
  const accentFor = (rank: number) =>
    rank === 1 ? T.red : rank === 2 ? T.amber : T.blue;

  return (
    <SRPanel
      title="AI Summary Wall"
      subtitle={data.subtitle}
      accentColor={T.amber}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.insights.map((ins) => {
          const c = accentFor(ins.rank);
          return (
            <div
              key={ins.rank}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "10px 12px",
                borderRadius: 10,
                background: `${c}10`,
                ...borderSides(
                  `1px solid ${c}30`,
                  `1px solid ${c}30`,
                  `1px solid ${c}30`,
                  `3px solid ${c}`,
                ),
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: T.text,
                    lineHeight: 1.3,
                  }}
                >
                  {ins.rank}. {ins.title}
                </div>
                <LiveModelledPill source={ins.source} compact />
              </div>
              <div style={{ fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>
                {ins.body}
              </div>
            </div>
          );
        })}
      </div>
    </SRPanel>
  );
}

export function ChannelScoreCards({ data }: { data: Channels }) {
  const T = useDashboardTheme();
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.7,
          textTransform: "uppercase",
          color: T.textMut,
          marginBottom: 10,
        }}
      >
        {data.title}
      </div>
      <div
        className="sr-channel-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {data.channels.map((ch) => {
          const chip = statusChipStyle(ch.status);
          return (
            <div
              key={ch.channel}
              style={{
                background: T.elevated,
                ...boxBorder(T.borderLight),
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 6,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: T.text,
                    lineHeight: 1.25,
                  }}
                >
                  {ch.channel}
                </div>
                <LiveModelledPill source={ch.source} compact />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: T.text,
                    fontFamily: "var(--mono)",
                    lineHeight: 1,
                  }}
                >
                  {formatChannelScore(ch.metric_type, ch.score)}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 11,
                    fontWeight: 800,
                    color: T.red,
                    fontFamily: "var(--mono)",
                  }}
                >
                  <TrendingDown size={11} />
                  {formatDelta(ch.delta)}
                </span>
              </div>
              <span style={chip}>{ch.status}</span>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.4 }}>
                <strong style={{ color: T.text }}>Top:</strong> {ch.top_theme}
              </div>
              <div style={{ fontSize: 11, color: T.textMut, lineHeight: 1.4 }}>
                {ch.context}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .sr-channel-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .sr-channel-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
