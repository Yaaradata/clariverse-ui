"use client";

import { meta, monitor, signalById } from "@kgs/lib/data";
import type {
  MonitorCard,
  Role,
  SignalWall as SignalWallData,
  WallCard as WallCardData,
} from "@kgs/types";
import { Sparkles } from "lucide-react";
import { useKgsNav } from "../nav";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { JoinTagRow } from "../shared/JoinTagRow";
import { PnLDestinationTag } from "../shared/PnLDestinationTag";
import { RoutedOwner } from "../shared/RoutedOwner";
import { DomainChip, SeverityChip } from "../shared/SeverityChip";
import { K, SEV, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { DrillChip, isStable } from "./Chips";

const RANK = /^#(\d+) of \d+$/;

/** The monitor card behind a wall card, found by its "#n of 5" rank chip. */
export function monitorCardForWall(
  card: WallCardData,
): MonitorCard | undefined {
  const rank = card.chips.map((c) => RANK.exec(c)?.[1]).find(Boolean);
  return rank ? monitor.cards.find((c) => c.rank === Number(rank)) : undefined;
}

function tintFor(card: WallCardData, linked?: MonitorCard): string {
  if (linked) return SEV[linked.chips.class].color;
  const sev = card.chips.find((c) => /^S[1-4]/.test(c));
  if (sev) return SEV[sev.slice(0, 2) as keyof typeof SEV].color;
  return card.chips.some(isStable) ? K.green : K.textMut;
}

/**
 * WallCard (03 §3C fork): severity-tinted card with chips, title, body, metric, trend and
 * "Open signal →". A ranked card is a signal surface (06 §2 #3), so it also carries the linked
 * signal's compact severity, K/I confidence, first 3 join tags, P&L tag and gate state.
 */
function WallCard({ card, pulse }: { card: WallCardData; pulse: boolean }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const { isApproved } = useDemo();
  const linked = monitorCardForWall(card);
  const signal = linked ? signalById[linked.signalId] : undefined;
  const tone = tintFor(card, linked);
  const approved = Boolean(
    linked?.gateChipAfterApprove && isApproved(linked.signalId),
  );
  const incident = signal?.severity.compact.split(" · ").pop();

  return (
    <article
      className={`kgs-lift${pulse ? " kgs-pulse" : ""}`}
      style={{
        borderRadius: K.radius.card,
        border: `1px solid ${withAlpha(tone, 0.45)}`,
        background: withAlpha(tone, 0.06),
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {linked ? (
          <>
            <DrillChip text={card.chips[0]} />
            <SeverityChip cls={linked.chips.class} word={linked.chips.word} />
            <DomainChip
              domain={linked.chips.domain}
              extra={linked.chips.type}
            />
          </>
        ) : (
          card.chips.map((c) => <DrillChip key={c} text={L(c)} />)
        )}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 800,
          color: K.text,
          lineHeight: 1.3,
        }}
      >
        {L(card.title)}
      </h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.body }}>
        {L(card.body)}
      </p>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: tone,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {L(card.metric)}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: K.textSec }}>
        {L(card.trend)}
      </div>
      {linked && signal ? (
        <>
          <div style={{ fontSize: 12, color: K.body }}>
            <span aria-hidden style={{ color: tone }}>
              {SEV[linked.chips.class].glyph}{" "}
            </span>
            {L(linked.blastRadius)}
            {incident ? ` · ${incident}` : ""}
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
              confidence={signal.confidence}
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
              <PnLDestinationTag text={linked.pnlShort} />
            </span>
          </div>
          <JoinTagRow tags={signal.joinTags} max={3} />
          <GateChip
            wrap
            text={
              approved && linked.gateChipAfterApprove
                ? linked.gateChipAfterApprove
                : L(linked.ownerGate)
            }
            status={approved ? "approved" : "awaiting"}
          />
        </>
      ) : card.confidenceShort ? (
        <ConfidenceMarker short={card.confidenceShort} compact />
      ) : null}
      {card.owner && !linked ? <RoutedOwner role={card.owner as Role} /> : null}
      {card.linkTo && card.linkLabel ? (
        <button
          type="button"
          onClick={() => card.linkTo && go(card.linkTo)}
          className="kgs-focus"
          style={{
            alignSelf: "flex-start",
            background: "transparent",
            border: "none",
            padding: "2px 0",
            color: K.violet400,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {card.linkLabel}
        </button>
      ) : null}
    </article>
  );
}

/** Footer counts in words (04 §3.9): big numeral + class label, outside the scroller. */
function WallFooterCounts({ items }: { items: SignalWallData["footer"] }) {
  const L = useLabel();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: 8,
        paddingTop: 12,
        borderTop: `1px solid ${K.borderLight}`,
      }}
    >
      {items.map((f) => {
        const cls = /^S[1-4]/.exec(f.label)?.[0] as
          | keyof typeof SEV
          | undefined;
        const colour = cls
          ? SEV[cls].color
          : isStable(f.label)
            ? K.green
            : K.textMut;
        return (
          <div key={f.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: f.value > 0 ? colour : K.textMut,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {f.value}
            </div>
            <div style={{ fontSize: 12, color: K.textMut, lineHeight: 1.35 }}>
              {L(f.label)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * SignalWall (03 §3C AISummaryWall → "LiSN Signal Wall"): sparkle header, subtitle, static
 * "Data as of" pill (no live dot), scrolling card stack, footer counts outside the scroller.
 * `pulseClass` briefly pulses the cards of that severity (P-B click).
 */
export function SignalWall({
  wall,
  pulseClass,
  maxHeight = 980,
}: {
  wall: SignalWallData;
  pulseClass?: string | null;
  maxHeight?: number;
}) {
  const L = useLabel();
  return (
    <section
      style={{
        background: K.bg,
        border: `1px solid ${K.border}`,
        borderRadius: K.radius.card,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        height: "100%",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Sparkles
            size={22}
            color={K.violet400}
            aria-hidden
            style={{ marginTop: 2 }}
          />
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: K.text,
              }}
            >
              {wall.title}
            </h2>
            <div style={{ fontSize: 13, color: K.textMut, marginTop: 3 }}>
              {L(wall.subtitle)}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: K.radius.pill,
            border: `1px solid ${K.borderLight}`,
            color: K.textSec,
            whiteSpace: "nowrap",
          }}
        >
          {wall.pill}
        </span>
      </header>
      <div
        className="kgs-wall-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingRight: 4,
        }}
      >
        {wall.cards.map((c) => (
          <WallCard
            key={c.id}
            card={c}
            pulse={Boolean(
              pulseClass &&
                (monitorCardForWall(c)?.chips.class === pulseClass ||
                  c.chips.some((x) => x.startsWith(pulseClass))),
            )}
          />
        ))}
      </div>
      <WallFooterCounts items={wall.footer} />
    </section>
  );
}
