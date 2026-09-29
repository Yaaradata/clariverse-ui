"use client";

import { monitor } from "@kgs/lib/data";
import { K } from "../shared/tokens";

/** SuppressedEndCard (04 §2.7, NEW): last card in the strip, neutral tint, V-12 reasons. */
export function SuppressedEndCard() {
  const c = monitor.suppressedCard;
  return (
    <article
      style={{
        minWidth: 280,
        flex: "0 0 280px",
        scrollSnapAlign: "start",
        borderRadius: K.radius.card,
        border: `1px solid ${K.borderLight}`,
        background: K.surface,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: K.text }}>
        {c.title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {c.rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 13,
              color: K.body,
            }}
          >
            <span>{r.label}</span>
            <span
              style={{
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                color: K.text,
              }}
            >
              {r.count.toLocaleString("en-GB")}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "auto",
          fontSize: 12,
          color: K.textMut,
          fontStyle: "italic",
        }}
      >
        {c.footer}
      </div>
    </article>
  );
}
