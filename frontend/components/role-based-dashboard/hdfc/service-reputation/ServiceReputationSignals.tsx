"use client";

import { Minus, TrendingUp } from "lucide-react";
import type { ServiceReputationSnapshot } from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";
import { useDashboardTheme } from "../../DashboardThemeContext";
import { LiveModelledPill, statusChipStyle } from "./LiveModelledPill";
import { SRPanel, boxBorder, borderSides } from "./SRPanel";

type Watch = ServiceReputationSnapshot["high_reach_watch"];
type Momentum = ServiceReputationSnapshot["reputation_momentum"];
type Wider = ServiceReputationSnapshot["wider_reputation_signals"];

export function HighReachWatchPanel({ data }: { data: Watch }) {
  const T = useDashboardTheme();
  return (
    <SRPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.red}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.voices.map((v, i) => (
          <div
            key={`${v.name}-${v.handle_context}-${i}`}
            style={{
              background: T.surface,
              ...boxBorder(T.borderLight),
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>
                  {v.name}
                </div>
                <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>
                  {v.handle_context}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <LiveModelledPill source={v.source} compact />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: T.text,
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {v.reach}
                  </span>
                  <span style={statusChipStyle(v.status)}>{v.status}</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: T.textSec }}>
              {v.engagement}
            </div>
            <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.45 }}>
              <strong style={{ color: T.text }}>Why it matters:</strong> {v.why}
            </div>
          </div>
        ))}
      </div>
    </SRPanel>
  );
}

function vocTrendLabel(kind: string): { label: string; tone: "up" | "stable" } {
  const k = kind.toLowerCase();
  if (k === "emerged" || k === "accelerating" || k === "rising") {
    return { label: "Rising", tone: "up" };
  }
  return { label: "Stable", tone: "stable" };
}

/**
 * VoC-style ranked complaint-phrase list (layout mirrors VoC Friction Drivers).
 * Data from reputation_momentum — HDFC Head of CX only.
 */
export function RisingServiceNarrativesPanel({ data }: { data: Momentum }) {
  const T = useDashboardTheme();
  const accent = T.purple || "#a78bfa";

  return (
    <SRPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={accent}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
      fill
      headerRight={<LiveModelledPill source="live" />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 420,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {data.topics.map((topic, index) => {
          const trend = vocTrendLabel(topic.growth_kind);
          const trendColor = trend.tone === "up" ? T.red : T.textMut;
          return (
            <div
              key={topic.label}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: T.surface,
                ...boxBorder(T.borderLight),
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${accent}28`,
                  color: accent,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    lineHeight: 1.45,
                  }}
                >
                  &ldquo;{topic.phrase}&rdquo;
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: `${T.amber}18`,
                      color: T.amber,
                      ...boxBorder(`${T.amber}40`),
                    }}
                  >
                    {topic.label}
                  </span>
                  <LiveModelledPill source={topic.source} compact />
                  <span style={{ fontSize: 10.5, color: T.textMut, fontWeight: 600 }}>
                    {topic.main_channel}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 11.5, color: T.textMut }}>
                    {topic.occurrences.toLocaleString("en-IN")} occurrences
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: accent,
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {topic.share_pct.toFixed(1)}%
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: trendColor,
                    }}
                  >
                    {trend.tone === "up" ? (
                      <TrendingUp size={12} color={trendColor} />
                    ) : (
                      <Minus size={12} color={trendColor} />
                    )}
                    {trend.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.note ? (
        <div style={{ fontSize: 10.5, color: T.textMut, marginTop: 10, lineHeight: 1.4 }}>
          {data.note}
        </div>
      ) : null}
    </SRPanel>
  );
}

export function WiderReputationSignalsPanel({ data }: { data: Wider }) {
  const T = useDashboardTheme();
  const ordered = [...data.cards].sort((a, b) => {
    if (a.key === "competitor_comparison") return -1;
    if (b.key === "competitor_comparison") return 1;
    return 0;
  });

  return (
    <SRPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.purple}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
    >
      <div
        className="sr-wider-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {ordered.map((card) => {
          const isCompetitor = card.key === "competitor_comparison";
          const accent = isCompetitor ? T.red : T.borderLight;
          return (
            <div
              key={card.key}
              style={{
                background: isCompetitor ? `${T.red}10` : T.surface,
                ...borderSides(
                  isCompetitor ? `3px solid ${T.red}` : `1px solid ${T.borderLight}`,
                  `1px solid ${accent}`,
                  `1px solid ${accent}`,
                  isCompetitor ? `3px solid ${T.red}` : `1px solid ${T.borderLight}`,
                ),
                borderRadius: 12,
                padding: "14px 16px",
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
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.6,
                    color: isCompetitor ? T.red : T.text,
                  }}
                >
                  {card.title}
                </div>
                <LiveModelledPill source={card.source} compact />
              </div>
              <span style={statusChipStyle(card.status)}>{card.status}</span>
              <div>
                <span
                  style={{
                    fontSize: isCompetitor ? 32 : 26,
                    fontWeight: 800,
                    color: T.text,
                    fontFamily: "var(--mono)",
                    lineHeight: 1,
                  }}
                >
                  {card.headline}
                </span>
                <div
                  style={{
                    fontSize: 12,
                    color: T.textSec,
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {card.headline_unit}
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.textMut }}>{card.movement}</div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.45 }}>
                <strong style={{ color: T.text }}>Frame:</strong> {card.frame}
              </div>
              <div style={{ fontSize: 12, color: T.textSec }}>
                <strong style={{ color: T.text }}>Strongest channel:</strong>{" "}
                {card.strongest_channel}
              </div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.45 }}>
                <strong style={{ color: T.text }}>Why it matters:</strong>{" "}
                {card.why_it_matters}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .sr-wider-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </SRPanel>
  );
}
