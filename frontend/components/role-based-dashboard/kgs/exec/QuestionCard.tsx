"use client";

import type { QuestionCardData } from "@kgs/types";
import { ChevronRight, Cpu, Handshake, Split } from "lucide-react";
import type { CSSProperties } from "react";
import { useKgsNav } from "../nav";
import { CountUp } from "../shared/CountUp";
import { ACCENT, GAUGE_TONE, K, liftVars, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { AreaTrend, QUESTION_CHART_H } from "./AreaTrend";
import { InsightBox } from "./InsightBox";
import { SemiGauge } from "./SemiGauge";
import { trendFor } from "./trends";

const ICONS = { Cpu, Handshake, Split } as const;

/** More signals = worse: "+" red (head_cards −pts red), "0" muted, "−" green. */
function fourWeekDeltaColor(label: string): string {
  const t = label.trim();
  if (/^0\b/.test(t)) return K.textMut;
  if (/^[-−–]/.test(t)) return K.green;
  if (/^\+/.test(t)) return K.red;
  return K.textMut;
}

/**
 * Bank ExecutiveTile anatomy (HeadOfCreditCardsDashboard.tsx:214) with KGS count,
 * accent borders and LiSN insight. Compact fields drive the overview face.
 */
export function QuestionCard({ card }: { card: QuestionCardData }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const accent = ACCENT[card.accent];
  const Icon = ICONS[card.icon];
  const trend = trendFor(card, L);
  const c = card.compact;
  const subtitle = c?.subtitle ?? card.caption;
  const caption = c?.caption ?? card.countLabel;
  const gauges =
    c?.gauges ?? card.gauges.map((g) => ({ pct: g.pct, label: g.label }));
  const insight = c?.insight ?? card.insightShort ?? card.insight;
  const border = card.highlighted
    ? `2px solid ${accent}`
    : `1px solid ${withAlpha(accent, 0.25)}`;
  const glow = `0 8px 32px ${withAlpha(accent, 0.082)}`;

  return (
    <article
      className="kgs-lift"
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
            card.highlighted ? accent : withAlpha(accent, 0.6),
            `0 0 0 2px ${accent}, 0 8px 28px ${withAlpha(accent, 0.133)}`,
          ),
        } as CSSProperties
      }
    >
      <button
        type="button"
        aria-label={L(card.title)}
        onClick={() => go(card.route)}
        className="kgs-focus"
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
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              {L(card.title)}
            </h3>
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
              {L(subtitle)}
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
              color: fourWeekDeltaColor(card.fourWeekLabel),
              zIndex: 2,
              pointerEvents: "auto",
            }}
          >
            {card.fourWeekLabel}
          </span>
          <div style={{ marginBottom: 6, paddingRight: 88 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#ffffff",
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              <CountUp text={card.count} />
            </div>
            <div style={{ fontSize: 11, color: K.body, marginTop: 4 }}>
              {caption}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              marginTop: "auto",
              height: QUESTION_CHART_H,
              minHeight: QUESTION_CHART_H,
              flexShrink: 0,
            }}
          >
            <AreaTrend
              id={card.id}
              data={trend.data}
              series={trend.series.filter((s) => s.area)}
              height={QUESTION_CHART_H}
              strokeColor={accent}
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
            {gauges.map((g, i) => (
              <SemiGauge
                key={g.label}
                pct={g.pct}
                label={L(g.label)}
                color={c ? accent : GAUGE_TONE[card.gauges[i]?.tone ?? "green"]}
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
            {(
              c?.stats ??
              card.miniKpis.map((m) => ({
                label: m.label,
                value: m.value,
                tag: m.caption,
              }))
            ).map((s, i) => {
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
                  {s.tag ? (
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
                      {L(s.tag)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InsightBox label={card.insightLabel} text={L(insight)} accent={accent} />
    </article>
  );
}
