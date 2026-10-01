"use client";

import { useDemo2, useV2K } from "@kgs2/lib/demoState";
import { Sparkles } from "lucide-react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

/**
 * Theme-aware LiSN insight — matches v1 InsightBox density/size.
 */
export function InsightBox2({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: string;
}) {
  const K = useV2K();
  const { state } = useDemo2();
  const light = state.theme === "light";

  return (
    <div
      style={{
        background: light ? withAlpha(accent, 0.1) : "rgba(0,0,0,0.35)",
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
          color: light ? K.textSec : "rgba(255,255,255,0.78)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
