import React from "react";
import type { ConfidenceBand as Band } from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { ConfidenceBand } from "./ConfidenceBand";
import { cssVar, radius } from "../../theme/tokens";

/** Thin exec summary — AP-011 / CL-004. Not a wide AI bar (RP-006). */
export function AiExecSummaryBar({
  critical,
  focus,
  stable,
  aiLine,
  aiConfidence = "High",
}: {
  critical: string;
  focus: string;
  stable: string;
  aiLine: string;
  aiConfidence?: Band;
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
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{aiLine}</span>
          <div style={{ marginTop: 6 }}>
            <ConfidenceBand band={aiConfidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
