"use client";

import { monitor } from "@kgs/lib/data";
import { K } from "../shared/tokens";

/** SuppressedEndCard (04 §2.7): last card in the strip, neutral tint, same size as peers. */
export function SuppressedEndCard() {
  const c = monitor.suppressedCard;
  return (
    <article
      style={{
        minWidth: 280,
        minHeight: 240,
        flex: "0 0 280px",
        scrollSnapAlign: "start",
        borderRadius: 16,
        border: `1px solid ${K.borderLight}`,
        background: K.surface,
        padding: "14px 14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontSize: 12,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: K.text }}>
        {c.title}
      </h3>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}
      >
        {c.rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 12,
              color: K.body,
            }}
          >
            <span>{r.label}</span>
            <span
              style={{
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                color: K.text,
                fontWeight: 700,
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
