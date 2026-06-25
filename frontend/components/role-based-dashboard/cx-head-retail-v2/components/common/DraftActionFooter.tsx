import React, { useState } from "react";
import { useDashboardShell } from "../../lib/DashboardShellContext";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

const KIND_LABEL: Record<RadarSignal["draftKind"], string> = {
  draft: "Draft",
  prepare: "Prepare",
  route: "Route",
};

export function DraftActionFooter({
  draftText,
  draftKind = "draft",
}: {
  draftText: string;
  draftKind?: RadarSignal["draftKind"];
}): React.ReactElement {
  const { approveDraft, auditLog } = useDashboardShell();
  const [approved, setApproved] = useState(false);
  const last = auditLog[auditLog.length - 1];
  const kindLabel = KIND_LABEL[draftKind];

  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 16px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: cssVar("text-muted"),
          textTransform: "uppercase",
        }}
      >
        <AiMarker size={10} />
        {kindLabel} — for approval
      </div>
      <p style={{ margin: "8px 0 12px", fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
        {draftText}
      </p>
      <button
        type="button"
        disabled={approved}
        onClick={() => {
          approveDraft(`${kindLabel}: ${draftText}`);
          setApproved(true);
        }}
        style={{
          padding: "8px 14px",
          borderRadius: radius.sm,
          border: "none",
          background: approved ? cssVar("positive") : cssVar("accent"),
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          cursor: approved ? "default" : "pointer",
        }}
      >
        {approved ? "Accepted — audit logged" : `Approve ${kindLabel.toLowerCase()}`}
      </button>
      {approved && last && (
        <div style={{ marginTop: 10, fontSize: 11, color: cssVar("text-muted") }}>
          Accepted by {last.acceptedBy} on {last.acceptedAt}
        </div>
      )}
    </div>
  );
}
