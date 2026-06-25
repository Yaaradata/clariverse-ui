import React from "react";
import type { ConfidenceBand } from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

/** Dense exec triad — one optional AI line, no confidence band on the face. */
export function AiExecSummaryBar({
  critical,
  focus,
  stable,
  aiLine,
}: {
  critical: string;
  focus: string;
  stable: string;
  aiLine?: string;
  aiConfidence?: ConfidenceBand;
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
        padding: "8px 12px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {sections.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: s.color,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: cssVar("text-secondary"),
                marginTop: 2,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
      {aiLine ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 6,
            paddingTop: 6,
            borderTop: `1px solid ${cssVar("border")}`,
          }}
        >
          <AiMarker size={11} />
          <span
            style={{
              fontSize: 11,
              color: cssVar("text-muted"),
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {aiLine}
          </span>
        </div>
      ) : null}
    </div>
  );
}
