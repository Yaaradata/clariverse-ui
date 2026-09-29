"use client";

import { meta, monitor, signalById } from "@kgs/lib/data";
import type { MonitorCard } from "@kgs/types";
import { useKgsNav } from "../nav";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { JoinTagRow } from "../shared/JoinTagRow";
import { PnLDestinationTag } from "../shared/PnLDestinationTag";
import { DomainChip, SeverityChip } from "../shared/SeverityChip";
import { SeverityStrip } from "../shared/SeverityStrip";
import { K, SEV, withAlpha } from "../shared/tokens";
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
  const approved = Boolean(
    card.gateChipAfterApprove && isApproved(card.signalId),
  );

  return (
    <article
      style={{
        minWidth: 300,
        maxWidth: 320,
        flex: "0 0 300px",
        scrollSnapAlign: "start",
        borderRadius: K.radius.card,
        border: `1px solid ${withAlpha(tone, 0.5)}`,
        background: withAlpha(tone, 0.05),
        boxShadow: `0 10px 24px ${withAlpha(tone, 0.12)}`,
        color: K.textSec,
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
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
          gridTemplateColumns: "auto 1fr",
          gap: "4px 10px",
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
            <dd style={{ margin: 0, color: K.text, textAlign: "right" }}>
              {L(r.value)}
            </dd>
          </div>
        ))}
      </dl>

      <MetricBeforeAfter
        rows={card.metrics.map((m) => ({ ...m, label: L(m.label) }))}
      />
      {card.microStrip ? <DateCodeMicroStrip /> : null}

      <div style={{ fontSize: 12, color: K.body }}>{L(card.blastRadius)}</div>
      {signal ? <SeverityStrip severity={signal.severity} compact /> : null}
      <ConfidenceMarker
        confidence={signal?.confidence}
        short={card.confidenceShort}
        compact
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: K.textMut,
        }}
      >
        <span>{meta.ui.pnl}</span>
        <PnLDestinationTag text={card.pnlShort} />
      </div>
      {signal ? <JoinTagRow tags={signal.joinTags} max={3} /> : null}
      <div>
        <GateChip
          text={
            approved && card.gateChipAfterApprove
              ? card.gateChipAfterApprove
              : L(card.ownerGate)
          }
          status={approved ? "approved" : "awaiting"}
        />
      </div>

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
