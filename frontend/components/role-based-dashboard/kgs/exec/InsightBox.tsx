"use client";

import { Sparkles } from "lucide-react";

/**
 * LiSN insight — ConversationAICallout density (HeadOfCreditCardsDashboard.tsx:173)
 * with the literal "LiSN INSIGHT" label (no CSS uppercase on LiSN).
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
        padding: "14px 16px",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <Sparkles size={12} color={accent} aria-hidden />
        <span
          style={{
            fontSize: 10,
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
          fontSize: 12.5,
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
