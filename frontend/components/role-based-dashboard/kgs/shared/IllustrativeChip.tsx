"use client";

import { meta } from "@kgs/lib/data";
import { K } from "./tokens";

/** "ILLUSTRATIVE" micro-chip after every money value (03 §6.4, 04 §1.6). Dashed, neutral. */
export function IllustrativeChip({ title }: { title?: string }) {
  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 6,
        padding: "1px 6px",
        borderRadius: K.radius.caps,
        border: `1px dashed ${K.borderLight}`,
        color: K.textMut,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontFamily: K.font,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      }}
    >
      {meta.labels.illustrativeChip}
    </span>
  );
}
