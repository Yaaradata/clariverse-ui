import React from "react";

import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

/** Thin exec summary — AP-011 / CL-004. Not a wide AI bar (RP-006). */
export function AiExecSummaryBar({
  critical,
  focus,
  stable,
  aiLine,
}: {
  critical: string;
  focus: string;
  stable: string;
  aiLine: string;
}): React.ReactElement {
  const sections = [
    { label: "Critical", value: critical, color: cssVar("severity-high") },
    { label: "Focus", value: focus, color: cssVar("severity-med") },
    { label: "Stable", value: stable, color: cssVar("positive") },
  ];

  return (
    <div
      style={{
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
        padding: "10px 14px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: cssVar("text-muted"), marginBottom: 8 }}>
        EXECUTIVE BRIEF
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {sections.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.55,
                color: s.color,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 12.5, color: cssVar("text-secondary"), marginTop: 3, lineHeight: 1.35 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${cssVar("border")}`,
        }}
      >
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{aiLine}</span>
      </div>
    </div>
  );
}
