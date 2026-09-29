"use client";

import { Sparkles } from "lucide-react";

/**
 * LiSN insight callout — Conversation AI density (left accent bar, compact body)
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
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
