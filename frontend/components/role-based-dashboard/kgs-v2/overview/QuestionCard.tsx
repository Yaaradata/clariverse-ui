"use client";

import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { ChevronRight, Handshake, RefreshCw, Wrench } from "lucide-react";
import type { CSSProperties } from "react";
import { SemiGauge } from "@/components/role-based-dashboard/kgs/exec/SemiGauge";
import { CountUp } from "@/components/role-based-dashboard/kgs/shared/CountUp";
import {
  ACCENT,
  K as Accent,
  liftVars,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { AreaTrend2, QUESTION_CHART_H2 } from "../shared/AreaTrend2";
import { InsightBox2 } from "../shared/InsightBox2";

export type OverviewQuestionCard = {
  id: "promise" | "recurring" | "install";
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
  delta: number;
  deltaLabel: string;
  border: "orange" | "teal" | "sky";
  gauges: Array<{ label: string; pct: number }>;
  miniKpis: Array<{ label: string; value: string }>;
  insight: string;
  trend: number[];
  trendEndLabel: string;
  chartCaption: string;
};

const ICONS = {
  promise: Handshake,
  recurring: RefreshCw,
  install: Wrench,
} as const;

const ROUTES: Record<OverviewQuestionCard["id"], V2View> = {
  promise: "promise",
  recurring: "recurring",
  install: "install",
};

function deltaColor(label: string): string {
  const t = label.trim();
  if (/^No change\b/i.test(t) || /^0\b/.test(t)) return Accent.textMut;
  if (/^[-−–]/.test(t)) return Accent.green;
  if (/^\+/.test(t)) return Accent.red;
  return Accent.textMut;
}

/**
 * Same anatomy as v1 kgs/exec/QuestionCard (President ExecutiveTile).
 * Left: count + chart · Right: gauges + mini KPIs · Bottom: LiSN insight.
 */
export function QuestionCard({ card }: { card: OverviewQuestionCard }) {
  const L = useLabel2();
  const K = useV2K();
  const { setView, state } = useDemo2();
  const accent = ACCENT[card.border];
  const Icon = ICONS[card.id];
  const highlighted = card.border === "orange";
  const border = highlighted
    ? `2px solid ${accent}`
    : `1px solid ${withAlpha(accent, 0.25)}`;
  const glow = `0 8px 32px ${withAlpha(accent, 0.082)}`;
  const trendData = card.trend.map((v, i) => ({ x: i + 1, v }));

  return (
    <article
      className="kgs2-lift"
      style={
        {
          position: "relative",
          background: K.elevated,
          border,
          borderRadius: 16,
          padding: "20px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          height: "100%",
          minWidth: 0,
          boxShadow: glow,
          ...liftVars(
            highlighted ? accent : withAlpha(accent, 0.6),
            `0 0 0 2px ${accent}, 0 8px 28px ${withAlpha(accent, 0.133)}`,
          ),
        } as CSSProperties
      }
    >
      <button
        type="button"
        aria-label={L(card.title)}
        onClick={() => setView(ROUTES[card.id])}
        className="kgs2-focus"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          zIndex: 1,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: withAlpha(accent, 0.082),
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={accent} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 15.5,
                fontWeight: 700,
                color: K.text,
                lineHeight: 1.1,
              }}
            >
              {L(card.title)}
            </h3>
            <div
              style={{
                fontSize: 11,
                color: withAlpha(K.text, 0.38),
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.35,
              }}
            >
              {L(card.subtitle)}
            </div>
          </div>
        </div>
        <ChevronRight
          size={22}
          color="#b9b9ba"
          strokeWidth={1.75}
          style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }}
          aria-hidden
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 12,
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            minWidth: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <span
            title={card.deltaLabel}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: K.mono,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              color: deltaColor(card.deltaLabel),
              zIndex: 2,
              pointerEvents: "auto",
            }}
          >
            {card.deltaLabel}
          </span>
          <div style={{ marginBottom: 6, paddingRight: 88 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: K.text,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              <CountUp text={String(card.count)} />
            </div>
            <div style={{ fontSize: 11, color: K.body, marginTop: 4 }}>
              {L(card.countLabel)}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              marginTop: "auto",
              height: QUESTION_CHART_H2,
              minHeight: QUESTION_CHART_H2,
              flexShrink: 0,
            }}
          >
            <AreaTrend2
              key={`${card.id}-${state.period}-${trendData.length}`}
              id={`v2-${card.id}-${state.period}`}
              data={trendData}
              series={[
                {
                  key: "v",
                  label: card.title,
                  color: accent,
                  area: true,
                },
              ]}
              height={QUESTION_CHART_H2}
              strokeColor={accent}
              footerLabel={card.chartCaption}
              showEndLabel={false}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 12,
              minWidth: 0,
              alignItems: "start",
            }}
          >
            {card.gauges.slice(0, 2).map((g) => (
              <SemiGauge
                key={g.label}
                pct={g.pct}
                label={L(g.label)}
                color={accent}
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
            {card.miniKpis.map((s, i) => {
              const numeric = /^[-+~≈≤$£]?[\d.,]+\S*$/.test(L(s.value).trim());
              return (
                <div
                  key={s.label}
                  style={{ textAlign: i === 1 ? "right" : "left", minWidth: 0 }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#b9b9ba",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {L(s.label)}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: accent,
                      fontWeight: 700,
                      fontFamily: numeric ? K.mono : K.font,
                      fontVariantNumeric: "tabular-nums",
                      marginTop: 4,
                      lineHeight: 1.25,
                    }}
                  >
                    {L(s.value)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InsightBox2
        label="LiSN INSIGHT"
        text={L(card.insight)}
        accent={accent}
      />
    </article>
  );
}
