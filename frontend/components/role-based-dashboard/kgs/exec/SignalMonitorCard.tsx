"use client";

import { meta, monitor, signalById } from "@kgs/lib/data";
import type { MonitorCard } from "@kgs/types";
import { useKgsNav } from "../nav";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { JoinTagRow } from "../shared/JoinTagRow";
import { MoneyText } from "../shared/MoneyText";
import { PnLDestinationTag } from "../shared/PnLDestinationTag";
import { DomainChip, SeverityChip } from "../shared/SeverityChip";
import { K, liftVars, SEV, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { DateCodeMicroStrip } from "./DateCodeMicroStrip";
import { MetricBeforeAfter } from "./MetricBeforeAfter";
import { RecommendationBox } from "./RecommendationBox";

/**
 * Fork of the bank spike card (HeadOfCreditCardsDashboard.tsx:626-735), "RiskSpikeCard" in 03.
 * KGS changes: rank + SeverityChip (full word) + domain chip; SOURCES / COHORT / WINDOW /
 * OWNER rows; metrics vs own baseline; compact severity, K/I confidence, P&L, join tags and
 * gate chip (the full signal contract, 06 §2 #3); "LiSN suggests · owner decides";
 * "Open signal →". Tint follows severity. No action button.
 */
export function SignalMonitorCard({ card }: { card: MonitorCard }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const { isApproved } = useDemo();
  const signal = signalById[card.signalId];
  const tone = SEV[card.chips.class].color;
  // Incident flag text = last segment of the data's compact severity ("… · Incident off").
  const incident = signal?.severity.compact.split(" · ").pop() ?? "";
  const approved = Boolean(
    card.gateChipAfterApprove && isApproved(card.signalId),
  );

  return (
    <article
      className="kgs-lift"
      style={{
        minWidth: 360,
        maxWidth: 360,
        flex: "0 0 360px",
        scrollSnapAlign: "start",
        borderRadius: K.radius.card,
        border: `1px solid ${withAlpha(tone, 0.5)}`,
        background: withAlpha(tone, 0.05),
        boxShadow: `0 10px 24px ${withAlpha(tone, 0.12)}`,
        ...liftVars(
          withAlpha(tone, 0.6),
          `0 10px 36px ${withAlpha(tone, 0.18)}`,
        ),
        color: K.textSec,
        padding: "12px 14px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span
          style={{
            fontFamily: K.mono,
            fontSize: 12,
            fontWeight: 800,
            color: K.textMut,
            paddingTop: 2,
          }}
        >
          #{card.rank}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: K.text,
            lineHeight: 1.3,
          }}
        >
          {L(card.title)}
        </h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <SeverityChip cls={card.chips.class} word={card.chips.word} />
        <DomainChip domain={card.chips.domain} extra={card.chips.type} />
      </div>

      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          gap: "3px 10px",
          fontSize: 12,
        }}
      >
        {card.rows.map((r) => (
          <div key={r.label} style={{ display: "contents" }}>
            <dt
              style={{
                color: K.textMut,
                letterSpacing: "0.06em",
                fontSize: 11,
                fontWeight: 600,
                paddingTop: 1,
              }}
            >
              {r.label}
            </dt>
            <dd style={{ margin: 0, color: K.text }}>{L(r.value)}</dd>
          </div>
        ))}
      </dl>

      <MetricBeforeAfter
        rows={card.metrics.map((m) => ({ ...m, label: L(m.label) }))}
      />
      {card.microStrip ? <DateCodeMicroStrip /> : null}

      {/* Compact severity line: class + type + blast radius + incident flag (04 §2.7). */}
      <div
        style={{
          fontSize: 12,
          color: K.body,
          display: "flex",
          gap: 6,
          alignItems: "baseline",
        }}
      >
        <span aria-hidden style={{ color: tone }}>
          {SEV[card.chips.class].glyph}
        </span>
        <span>
          <MoneyText text={card.blastRadius} />
          {incident ? ` · ${incident}` : ""}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px 10px",
        }}
      >
        <ConfidenceMarker
          confidence={signal?.confidence}
          short={card.confidenceShort}
          compact
        />
        <span
          style={{
            display: "inline-flex",
            gap: 6,
            fontSize: 12,
            color: K.textMut,
          }}
        >
          {meta.ui.pnl}
          <PnLDestinationTag text={card.pnlShort} />
        </span>
      </div>
      {signal ? <JoinTagRow tags={signal.joinTags} max={3} /> : null}
      <GateChip
        wrap
        text={
          approved && card.gateChipAfterApprove
            ? card.gateChipAfterApprove
            : L(card.ownerGate)
        }
        status={approved ? "approved" : "awaiting"}
      />

      <RecommendationBox
        label={meta.labels.recommendationLabel}
        text={L(card.suggestion)}
      />

      <button
        type="button"
        onClick={() => go(card.linkTo)}
        className="kgs-focus"
        style={{
          marginTop: "auto",
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          padding: "4px 0",
          color: K.violet400,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {monitor.section.cardFooterLink}
      </button>
    </article>
  );
}
