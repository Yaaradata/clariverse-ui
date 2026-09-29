"use client";

import type { Severity } from "@kgs/types";
import { useLabel } from "../shell/DemoProvider";
import { DomainChip, SeverityChip } from "./SeverityChip";
import { K, SEV } from "./tokens";

/**
 * SeverityStrip (03 §6.1, 02 HS-4). Full: class + word, domain, type, blast radius, incident
 * flag and the escalation rule. Compact: the data's one-line `compact` string.
 */
export function SeverityStrip({
  severity,
  compact = false,
}: {
  severity: Severity;
  compact?: boolean;
}) {
  const L = useLabel();
  if (compact) {
    return (
      <div
        style={{
          fontSize: 12,
          color: K.body,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span aria-hidden style={{ color: SEV[severity.class].color }}>
          ■
        </span>
        {L(severity.compact)}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px 12px",
        padding: "10px 12px",
        borderRadius: K.radius.tile,
        border: `1px solid ${K.borderLight}`,
        background: K.surface,
        fontSize: 13,
        color: K.body,
      }}
    >
      <SeverityChip cls={severity.class} word={severity.word} />
      <DomainChip domain={severity.domain} />
      <span>{severity.typeNote}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>
        {L(severity.blastRadius.headline)}
      </span>
      {severity.blastRadius.note ? (
        <span style={{ color: K.textMut }}>{L(severity.blastRadius.note)}</span>
      ) : null}
      <span>{severity.incident.note}</span>
      {severity.escalationRule ? (
        <span style={{ color: K.textMut, fontStyle: "italic" }}>
          {severity.escalationRule}
        </span>
      ) : null}
    </div>
  );
}
