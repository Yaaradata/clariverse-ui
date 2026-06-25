import React from "react";
import { DARK_PATTERN_EVIDENCE } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** T2-10 — named instrument, internal Legal only. */
export function ComplianceEvidenceCard({
  onOpenEvidence,
}: {
  onOpenEvidence: () => void;
}): React.ReactElement {
  const d = DARK_PATTERN_EVIDENCE;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>Dark-pattern exposure</div>
      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{d.honestyLine}</p>

      <div
        style={{
          padding: 12,
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div style={{ fontSize: 11, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>
          Named instrument
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary"), marginTop: 6 }}>{d.instrument}</div>
        <div className="lisn-num" style={{ fontSize: 13, color: cssVar("text-secondary"), marginTop: 8 }}>
          {d.evidenceCount} corroborated complaints
        </div>
        <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 6 }}>Surface: {d.surfaceRef}</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{d.aiVerdict}</span>
      </div>
      <ConfidenceBand band={d.confidence} />

      <button
        type="button"
        onClick={onOpenEvidence}
        style={{
          marginTop: "auto",
          padding: "8px 12px",
          borderRadius: radius.sm,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
          color: cssVar("accent"),
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Open evidence pack → internal Legal only
      </button>

      <DraftActionFooter draftText={d.draftAction} draftKind="prepare" />
    </div>
  );
}
