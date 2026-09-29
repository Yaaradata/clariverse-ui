"use client";

import { exec } from "@kgs/lib/data";
import type { SeverityClass } from "@kgs/types";
import { useKgsNav } from "../nav";
import { SeverityChip } from "../shared/SeverityChip";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/** EvidenceReadinessTile (04 §2.9): enabler; opens Q1 at #why-late. */
export function EvidenceReadinessTile() {
  const L = useLabel();
  const { go } = useKgsNav();
  const e = exec.evidenceReadiness;
  // Chip text in data is "S4 · Efficiency": class + word.
  const [cls, word] = e.chip.split(" · ");

  return (
    <button
      type="button"
      onClick={() => go(e.linkTo)}
      className="kgs-focus"
      style={{
        textAlign: "left",
        width: "100%",
        height: "100%",
        borderRadius: K.radius.card,
        border: `1px solid ${K.borderLight}`,
        background: K.elevated,
        color: K.textSec,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <SeverityChip cls={cls as SeverityClass} word={word} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            padding: "3px 8px",
            borderRadius: 999,
            border: `1px solid ${K.borderLight}`,
            color: K.textMut,
          }}
        >
          {e.extraChip}
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: K.text }}>
        {e.title}
      </h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{L(e.body)}</p>
      <div style={{ fontSize: 14, fontWeight: 700, color: K.violet300 }}>
        {e.label}
      </div>
      <div
        style={{
          marginTop: "auto",
          fontSize: 12,
          color: K.textMut,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <span style={{ fontFamily: K.mono }}>{e.confidenceShort}</span>
        <span>{e.owners}</span>
      </div>
    </button>
  );
}
