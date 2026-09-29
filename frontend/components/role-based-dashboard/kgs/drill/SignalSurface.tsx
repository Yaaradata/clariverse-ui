"use client";

import { meta, monitor, signalById } from "@kgs/lib/data";
import type { MonitorCard, Signal } from "@kgs/types";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { JoinTagRow } from "../shared/JoinTagRow";
import { PnLDestinationTag } from "../shared/PnLDestinationTag";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";

/** The monitor card (and its signal) a panel points at, matched on the shared `linkTo`. */
export function linkedSignal(
  linkTo?: string,
): { card: MonitorCard; signal: Signal } | undefined {
  const card = linkTo
    ? monitor.cards.find((c) => c.linkTo === linkTo)
    : undefined;
  const signal = card ? signalById[card.signalId] : undefined;
  return card && signal ? { card, signal } : undefined;
}

/**
 * The signal-surface contract (06 §2 #3) below a panel's own copy: compact K/I confidence,
 * P&L destination, first 3 join tags and the owner's gate state (swapped once approved).
 */
export function SignalSurface({
  card,
  signal,
  confidenceShort,
  hideConfidence = false,
  hideGate = false,
}: {
  card: MonitorCard;
  signal: Signal;
  confidenceShort?: string;
  /** The panel already shows these (its own K/I marker or a more specific gate). */
  hideConfidence?: boolean;
  hideGate?: boolean;
}) {
  const L = useLabel();
  const { isApproved } = useDemo();
  const approved = Boolean(
    card.gateChipAfterApprove && isApproved(card.signalId),
  );
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px 10px",
        }}
      >
        {hideConfidence ? null : (
          <ConfidenceMarker
            confidence={signal.confidence}
            short={confidenceShort}
            compact
          />
        )}
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
      <JoinTagRow tags={signal.joinTags} max={3} />
      {hideGate ? null : (
        <GateChip
          wrap
          text={
            approved && card.gateChipAfterApprove
              ? card.gateChipAfterApprove
              : L(card.ownerGate)
          }
          status={approved ? "approved" : "awaiting"}
        />
      )}
    </>
  );
}
