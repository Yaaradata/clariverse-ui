"use client";

import type { Domain, SeverityClass } from "@kgs/types";
import { DOMAIN_COLOR, K, SEV, withAlpha } from "./tokens";

/** "S# · word" + glyph, never colour alone (03 §6.1). Word comes from data. */
export function SeverityChip({
  cls,
  word,
  compact = false,
}: {
  cls: SeverityClass;
  word?: string;
  compact?: boolean;
}) {
  const s = SEV[cls];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: K.radius.pill,
        border: `1px solid ${withAlpha(s.color, 0.55)}`,
        background: withAlpha(s.color, 0.14),
        color: cls === "S4" ? K.textSec : s.color,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden>{s.glyph}</span>
      {compact || !word ? cls : `${cls} · ${word}`}
    </span>
  );
}

/** Domain chip: coloured dot + word (03 §6.1). */
export function DomainChip({
  domain,
  extra,
}: {
  domain: Domain;
  extra?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: K.radius.pill,
        border: `1px solid ${K.chipBorder}`,
        background: K.surface,
        color: K.textSec,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: DOMAIN_COLOR[domain],
        }}
      />
      {extra ? `${domain} · ${extra}` : domain}
    </span>
  );
}
