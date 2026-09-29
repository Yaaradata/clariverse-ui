"use client";

import { Sparkles } from "lucide-react";
import { useLabel } from "../shell/DemoProvider";

type InsightBoxProps = {
  label?: string;
  text: string;
  accent: string;
};

export function InsightBox({ label = "LiSN INSIGHT", text, accent }: InsightBoxProps) {
  const L = useLabel();

  return (
    <div
      style={{
        background: `${accent}08`,
        border: `1px solid ${accent}30`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Sparkles size={12} color={accent} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 12.5,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {L(text)}
      </p>
    </div>
  );
}
