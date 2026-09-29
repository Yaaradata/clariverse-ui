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
  // Numbers in mono, words in sans (03 §3B): "1,240" / "$2.3m" vs "fw 4.1 · 3.1×".
  const numeric = /^[-+~≈≤$£]?[\d.,]+\S*$/.test(value.trim());
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
          fontFamily: numeric ? K.mono : K.font,
          fontVariantNumeric: "tabular-nums",
          marginTop: 4,
          lineHeight: 1.3,
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
