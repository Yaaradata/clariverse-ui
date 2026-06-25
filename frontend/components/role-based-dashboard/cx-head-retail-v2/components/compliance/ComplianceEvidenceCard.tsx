import React from "react";
import { DARK_PATTERN_EVIDENCE } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { cssVar, radius } from "../../theme/tokens";

export function ComplianceEvidenceCard({
  onOpenEvidence,
}: {
  onOpenEvidence: () => void;
}): React.ReactElement {
  const d = DARK_PATTERN_EVIDENCE;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "100%",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Dark-pattern risk</div>

      <div
        style={{
          padding: 10,
          borderRadius: radius.sm,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{d.instrument}</div>
        <div className="lisn-num" style={{ fontSize: 12, color: cssVar("text-secondary"), marginTop: 4 }}>
          {d.evidenceCount} complaints · {d.surfaceRef}
        </div>
      </div>

      <div style={{ display: "flex", gap: 5, alignItems: "flex-start", flex: 1 }}>
        <AiMarker size={11} />
        <span style={{ fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.35 }}>{d.aiVerdict}</span>
      </div>

      <button
        type="button"
        onClick={onOpenEvidence}
        style={{
          alignSelf: "flex-start",
          padding: "4px 8px",
          borderRadius: radius.sm,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
          color: cssVar("accent"),
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Evidence →
      </button>
    </div>
  );
}
