"use client";

import { Sparkles } from "lucide-react";

type ExecBriefBarProps = {
  text: string;
};

export function ExecBriefBar({ text }: ExecBriefBarProps) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #f59e0b15 0%, transparent 100%)",
        borderLeft: "3px solid #f59e0b",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Sparkles size={14} color="#f59e0b" />
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#f59e0b",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          EXECUTIVE BRIEF
        </span>
      </div>
      <p
        style={{
          fontSize: 13.5,
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
