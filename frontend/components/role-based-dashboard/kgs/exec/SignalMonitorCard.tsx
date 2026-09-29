"use client";

import { meta, monitor, signalById } from "@kgs/lib/data";
import type { MonitorCard as MonitorCardData } from "@kgs/types";
import { useKgsNav } from "../nav";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { MONEY } from "../shared/MoneyText";
import { PnLDestinationTag } from "../shared/PnLDestinationTag";
import { Popover } from "../shared/Popover";
import { SeverityChip } from "../shared/SeverityChip";
import { K, liftVars, SEV, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { MetricBeforeAfter } from "./MetricBeforeAfter";
import { RecommendationBox } from "./RecommendationBox";

const chipStyle = {
  fontSize: 11,
  padding: "2px 7px",
  borderRadius: 6,
  border: `1px solid ${K.chipBorder}`,
  background: K.surface,
  color: K.body,
  whiteSpace: "nowrap" as const,
  fontFamily: "inherit",
};

/**
 * Compact Field Signal Monitor card — bank AI Risk Spike anatomy with the KGS signal
 * contract in a one-line footer (severity tooltip, owner·gate, confidence, P&L, joined-on).
 */
export function SignalMonitorCard({ card }: { card: MonitorCardData }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const { isApproved } = useDemo();
  const signal = signalById[card.signalId];
  const tone = SEV[card.chips.class].color;
  const incident = signal?.severity.compact.split(" · ").pop() ?? "";
  const approved = Boolean(
    card.gateChipAfterApprove && isApproved(card.signalId),
  );
  const title = L(card.titleShort ?? card.title);
  const metrics = card.metricsCompact ?? card.metrics;
  const suggestion = L(card.suggestionShort ?? card.suggestion);
  const ownerGate =
    approved && card.gateChipAfterApprove
      ? card.gateChipAfterApprove
      : L(card.ownerGateShort ?? card.ownerGate);

  const infoRows = (
    [
      {
        label: "SOURCES",
        value:
          card.sourcesShort ??
          card.rows.find((r) => r.label === "SOURCES")?.value ??
          "",
      },
      {
        label: "COHORT",
        value: card.rows.find((r) => r.label === "COHORT")?.value ?? "",
      },
      {
        label: "WINDOW",
        value: card.rows.find((r) => r.label === "WINDOW")?.value ?? "",
      },
    ] as const
  ).filter((r) => r.value);

  const joinTags = signal?.joinTags.slice(0, 3) ?? [];
  const sevTooltip = [
    L(card.blastRadius),
    MONEY.test(card.blastRadius) ? "ILLUSTRATIVE" : null,
    incident,
    signal?.severity.incident.note,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className="kgs-lift"
      style={{
        minWidth: 280,
        minHeight: 240,
        flex: "0 0 280px",
        scrollSnapAlign: "start",
        borderRadius: 16,
        border: `1px solid ${withAlpha(tone, 0.53)}`,
        background: withAlpha(tone, 0.05),
        boxShadow: `0 10px 24px ${withAlpha(tone, 0.2)}`,
        ...liftVars(
          withAlpha(tone, 0.6),
          `0 10px 36px ${withAlpha(tone, 0.18)}`,
        ),
        color: K.textSec,
        padding: "14px 14px 16px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            minWidth: 0,
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: K.mono,
              fontSize: 12,
              fontWeight: 800,
              color: K.textMut,
              paddingTop: 2,
              flexShrink: 0,
            }}
          >
            #{card.rank}
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </div>
        <span title={sevTooltip} style={{ flexShrink: 0 }}>
          <SeverityChip cls={card.chips.class} word={card.chips.word} />
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          fontSize: 12,
          color: K.textMut,
        }}
      >
        {infoRows.map((r) => (
          <div
            key={r.label}
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <span
              style={{
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {r.label}
            </span>
            <span style={{ color: K.text, textAlign: "right" }}>
              {L(r.value)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, flex: 1, display: "flex", minHeight: 108 }}>
        <div style={{ width: "100%" }}>
          <MetricBeforeAfter rows={[...metrics]} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <RecommendationBox
          label={meta.labels.recommendationLabel}
          text={suggestion}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
        }}
      >
        <GateChip
          text={ownerGate}
          status={approved ? "approved" : "awaiting"}
        />
        <ConfidenceMarker
          confidence={signal?.confidence}
          short={card.confidenceCompact ?? card.confidenceShort}
          compact
        />
        <span
          style={{
            ...chipStyle,
            display: "inline-flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          {meta.ui.pnl}
          <PnLDestinationTag text={card.pnlShort} />
          {MONEY.test(card.blastRadius) ? <IllustrativeChip /> : null}
        </span>
        {joinTags.length ? (
          <Popover
            label="Joined on"
            width={280}
            trigger={
              <span
                style={{ ...chipStyle, color: K.violet400, fontWeight: 700 }}
              >
                Joined on ({joinTags.length})
              </span>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {joinTags.map((t) => (
                <div key={`${t.key}-${t.value}`}>
                  <span style={{ color: K.textMut }}>{t.key}</span> {L(t.value)}
                </div>
              ))}
            </div>
          </Popover>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => go(card.linkTo)}
        className="kgs-focus"
        style={{
          marginTop: 10,
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
