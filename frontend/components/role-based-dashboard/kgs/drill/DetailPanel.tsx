"use client";

import { meta } from "@kgs/lib/data";
import type { StackedBarDetail } from "@kgs/types";
import { X } from "lucide-react";
import { useKgsNav } from "../nav";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { CountUp } from "../shared/CountUp";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { DrillChip } from "./Chips";
import { PanelLabel } from "./Panel";
import { linkedSignal, SignalSurface } from "./SignalSurface";

/** Grid values carry no money flag in the mock; a currency glyph marks them. */
const MONEY = /[$£]/;

/**
 * DetailPanel (03 §3C): title + chip, big figure, KPI grid, LiSN INSIGHT with compact K/I,
 * recommended action (amber until the linked signal is approved, then green), phrasings and
 * "Open signal →". A detail that points at a ranked signal also carries the signal surface.
 */
export function DetailPanel({
  detail,
  onClose,
  footer,
}: {
  detail: StackedBarDetail;
  onClose?: () => void;
  footer?: string;
}) {
  const L = useLabel();
  const { go } = useKgsNav();
  const { isApproved } = useDemo();
  const linked = linkedSignal(detail.linkTo);
  const approved = Boolean(linked && isApproved(linked.card.signalId));
  const tone = approved ? K.green : linked ? K.amber : K.textMut;

  return (
    <aside
      aria-label={L(detail.title)}
      style={{
        background: K.surface,
        border: `1px solid ${K.border}`,
        borderRadius: K.radius.tile,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
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
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3
            style={{ margin: 0, fontSize: 17, fontWeight: 800, color: K.text }}
          >
            {L(detail.title)}
          </h3>
          <DrillChip text={detail.chip} />
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={meta.ui.close}
            className="kgs-focus"
            style={{
              background: "transparent",
              border: "none",
              color: K.textMut,
              cursor: "pointer",
              padding: 2,
            }}
          >
            <X size={16} aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: K.text,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          <CountUp text={L(detail.big)} />
        </span>
        {detail.money ? <IllustrativeChip /> : null}
        <span style={{ fontSize: 14, color: K.textMut }}>
          {L(detail.bigLabel)}
        </span>
        {detail.delta ? (
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: K.textSec,
              fontFamily: K.mono,
            }}
          >
            {L(detail.delta)}
          </span>
        ) : null}
      </div>

      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 8,
        }}
      >
        {detail.grid.map((g) => (
          <div
            key={g.label}
            style={{
              background: K.bg,
              border: `1px solid ${K.border}`,
              borderRadius: K.radius.chip,
              padding: "8px 10px",
            }}
          >
            <dt style={{ fontSize: 12, color: K.textMut }}>{L(g.label)}</dt>
            <dd
              style={{
                margin: "2px 0 0",
                fontSize: 15,
                fontWeight: 700,
                color: K.textSec,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {L(g.value)}
              {MONEY.test(g.value) ? <IllustrativeChip /> : null}
            </dd>
          </div>
        ))}
      </dl>

      {linked ? (
        <SignalSurface
          card={linked.card}
          signal={linked.signal}
          hideConfidence
        />
      ) : null}

      <div
        style={{
          background: K.insight,
          border: `1px solid ${withAlpha(K.violet400, 0.3)}`,
          borderRadius: K.radius.chip,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: K.violet400,
            }}
          >
            {meta.labels.insightLabel}
          </span>
          {linked ? (
            <ConfidenceMarker confidence={linked.signal.confidence} compact />
          ) : null}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.body }}>
          {L(detail.insight)}
        </p>
      </div>

      <div
        style={{
          borderRadius: K.radius.chip,
          border: `1px solid ${withAlpha(tone, 0.4)}`,
          background: withAlpha(tone, 0.08),
          padding: "10px 12px",
          transition: "background 300ms, border-color 300ms",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: approved ? K.green : linked ? K.amber2 : K.textMut,
            marginBottom: 4,
          }}
        >
          {approved ? meta.ui.hero.recommendedApproved : detail.actionLabel}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
          {L(detail.action)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <PanelLabel>{meta.ui.drill.phrasings}</PanelLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {detail.phrasings.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 12,
                padding: "3px 8px",
                borderRadius: K.radius.pill,
                border: `1px solid ${K.chipBorder}`,
                background: K.bg,
                color: K.body,
              }}
            >
              {L(p)}
            </span>
          ))}
        </div>
      </div>

      {footer ? (
        <div style={{ fontSize: 13, color: K.textMut }}>{L(footer)}</div>
      ) : null}

      {detail.linkTo ? (
        <button
          type="button"
          onClick={() => detail.linkTo && go(detail.linkTo)}
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
          {meta.ui.drill.openSignal}
        </button>
      ) : null}
    </aside>
  );
}
