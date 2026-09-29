"use client";

import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K } from "../shared/tokens";

/**
 * Fork of the bank ExecutiveTile bottom stat cells (HeadOfCreditCardsDashboard.tsx:452-493).
 * KGS changes: label ≥11px, value words in sans / numbers in mono (03 §3B), money carries
 * the ILLUSTRATIVE chip and is never coloured green or red.
 */
export function MiniKPI({
  label,
  value,
  caption,
  money,
  accent,
  align = "start",
}: {
  label: string;
  value: string;
  caption?: string;
  money?: boolean;
  accent: string;
  align?: "start" | "end";
}) {
  return (
    <div style={{ textAlign: align === "end" ? "right" : "left", minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          color: K.textMut,
          letterSpacing: "0.06em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: money ? K.text : accent,
          fontWeight: 700,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
          marginTop: 4,
          lineHeight: 1.25,
        }}
      >
        {value}
        {money ? <IllustrativeChip /> : null}
      </div>
      {caption ? (
        <div
          style={{
            fontSize: 11,
            color: K.textMut,
            marginTop: 3,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}
