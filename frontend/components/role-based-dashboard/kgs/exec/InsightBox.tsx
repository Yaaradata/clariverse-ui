"use client";

import { Sparkles } from "lucide-react";

/**
 * Fork of the bank ConversationAICallout (HeadOfCreditCardsDashboard.tsx:173).
 * KGS changes: label is the literal "LiSN INSIGHT" from data (no CSS uppercase on LiSN),
 * body text ≥13px.
 */
export function InsightBox({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.35)",
        borderRadius: 10,
        padding: "12px 14px",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <Sparkles size={12} color={accent} aria-hidden />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
