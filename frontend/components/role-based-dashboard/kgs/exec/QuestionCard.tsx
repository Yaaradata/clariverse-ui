"use client";

import { exec, monitor } from "@kgs/lib/data";
import type { QuestionCardData } from "@kgs/types";
import { ChevronRight, Cpu, Handshake, Info, Split } from "lucide-react";
import { useKgsNav } from "../nav";
import { Popover } from "../shared/Popover";
import { ACCENT, GAUGE_TONE, K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { AreaTrend } from "./AreaTrend";
import { InsightBox } from "./InsightBox";
import { MiniKPI } from "./MiniKPI";
import { SemiGauge } from "./SemiGauge";
import { trendFor } from "./trends";

const ICONS = { Cpu, Handshake, Split } as const;

/** WhatsCountedPopover (04 §2.5, NEW): the signals behind the count, each linking to it. */
function WhatsCounted({ card }: { card: QuestionCardData }) {
  const L = useLabel();
  const { go } = useKgsNav();
  return (
    <div>
      <div style={{ fontWeight: 700, color: K.text, marginBottom: 8 }}>
        {exec.whatsCountedTitle}
      </div>
      {card.counted.map((row) => {
        const target =
          monitor.cards.find((c) => c.signalId === row.signalId)?.linkTo ??
          card.route;
        return (
          <button
            key={row.signalId}
            type="button"
            onClick={() => go(target)}
            className="kgs-focus"
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: K.surface,
              border: `1px solid ${K.chipBorder}`,
              borderRadius: 8,
              padding: "7px 9px",
              marginBottom: 6,
              color: K.textSec,
              font: "inherit",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {L(row.text)}
          </button>
        );
      })}
      <div style={{ fontSize: 12, color: K.textMut, marginTop: 4 }}>
        {L(card.notCounted)}
      </div>
      <div
        style={{
          fontSize: 12,
          color: K.textMut,
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${K.borderLight}`,
        }}
      >
        {card.countedFooter}
      </div>
    </div>
  );
}

/**
 * Fork of the bank ExecutiveTile (HeadOfCreditCardsDashboard.tsx:214-501).
 * KGS changes: the big number is the count of signals above threshold with a week-on-week
 * delta chip (amber when up, neutral otherwise) — no score, index or "pts"; "What's counted"
 * popover; Q1 orange 2px highlighted, Q2 teal, Q3 sky-400; titles wrap (no ellipsis);
 * "LiSN INSIGHT". Whole card opens the drill view; the ⓘ sits above the card link.
 */
export function QuestionCard({ card }: { card: QuestionCardData }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const accent = ACCENT[card.accent];
  const Icon = ICONS[card.icon];
  const up = card.count > card.lastWeekCount;
  const trend = trendFor(card, L);
  const border = card.highlighted
    ? `2px solid ${accent}`
    : `1px solid ${withAlpha(accent, 0.3)}`;
  const glow = card.highlighted
    ? `0 0 32px ${withAlpha(accent, 0.22)}`
    : `0 8px 32px ${withAlpha(accent, 0.08)}`;

  return (
    <article
      style={{
        position: "relative",
        background: K.elevated,
        border,
        borderRadius: K.radius.card,
        padding: "18px 18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        boxShadow: glow,
        transition: "transform 150ms, box-shadow 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Stretched card link: the whole card opens the drill view. */}
      <button
        type="button"
        aria-label={L(card.title)}
        onClick={() => go(card.route)}
        className="kgs-focus"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: K.radius.card,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          zIndex: 1,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: withAlpha(accent, 0.1),
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={accent} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.25,
            }}
          >
            {L(card.title)}
          </h3>
          <div
            style={{
              fontSize: 12,
              color: K.textMut,
              marginTop: 3,
              lineHeight: 1.35,
            }}
          >
            {L(card.caption)}
          </div>
        </div>
        <ChevronRight
          size={20}
          color="#b9b9ba"
          style={{ flexShrink: 0, opacity: 0.6 }}
          aria-hidden
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: K.text,
                  fontFamily: K.mono,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {card.count}
              </div>
              <div style={{ fontSize: 12, color: K.body, marginTop: 4 }}>
                {card.countLabel}
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: K.mono,
                padding: "2px 7px",
                borderRadius: 6,
                whiteSpace: "nowrap",
                color: up ? K.amber2 : K.textSec,
                background: up ? withAlpha(K.amber, 0.14) : K.surface,
                border: `1px solid ${up ? withAlpha(K.amber, 0.45) : K.chipBorder}`,
              }}
            >
              {card.deltaLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
              fontSize: 12,
              color: K.textMut,
              position: "relative",
              zIndex: 2,
            }}
          >
            <span style={{ fontFamily: K.mono }}>{card.fourWeekLabel}</span>
            <span>·</span>
            <span>{card.severityMix}</span>
            <Popover
              label={exec.whatsCountedTitle}
              trigger={<Info size={14} color={K.textMut} />}
              width={400}
            >
              <WhatsCounted card={card} />
            </Popover>
          </div>
          <div style={{ flex: 1, minHeight: 88, marginTop: 6 }}>
            <AreaTrend
              id={card.id}
              data={trend.data}
              series={trend.series}
              markers={trend.markers}
              height={96}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 10,
            }}
          >
            {card.gauges.map((g) => (
              <SemiGauge
                key={g.label}
                pct={g.pct}
                label={L(g.label)}
                sub={L(g.sub)}
                color={GAUGE_TONE[g.tone]}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 12px",
              padding: "10px 2px 2px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {card.miniKpis.map((m, i) => (
              <MiniKPI
                key={m.label}
                label={L(m.label)}
                value={L(m.value)}
                caption={m.caption ? L(m.caption) : undefined}
                money={m.money}
                accent={accent}
                align={i === 1 ? "end" : "start"}
              />
            ))}
          </div>
        </div>
      </div>

      <InsightBox
        label={card.insightLabel}
        text={L(card.insight)}
        accent={accent}
      />
    </article>
  );
}
