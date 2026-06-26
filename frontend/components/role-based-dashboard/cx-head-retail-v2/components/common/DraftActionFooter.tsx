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
  approveButtonLabel,
  embedded = false,
}: {
  draftText: string;
  draftKind?: RadarSignal["draftKind"];
  approveButtonLabel?: string;
  embedded?: boolean;
}): React.ReactElement {
  const { approveDraft, auditLog } = useDashboardShell();
  const [approved, setApproved] = useState(false);
  const last = auditLog[auditLog.length - 1];
  const kindLabel = KIND_LABEL[draftKind];

  const body = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: embedded ? 8 : 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 120px", minWidth: 0 }}>
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
          <p style={{ margin: embedded ? "4px 0 0" : "6px 0 0", fontSize: embedded ? 12 : 13, color: cssVar("text-secondary"), lineHeight: 1.4 }}>
            {draftText}
          </p>
        </div>

        <button
          type="button"
          disabled={approved}
          onClick={() => {
            approveDraft(`${kindLabel}: ${draftText}`);
            setApproved(true);
          }}
          style={{
            flexShrink: 0,
            padding: embedded ? "7px 12px" : "8px 14px",
            borderRadius: radius.sm,
            border: "none",
            background: approved ? cssVar("positive") : cssVar("accent"),
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: approved ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {approved ? "Accepted — audit logged" : (approveButtonLabel ?? `Approve ${kindLabel.toLowerCase()}`)}
        </button>
      </div>

      {approved && last ? (
        <div style={{ marginTop: embedded ? 6 : 10, fontSize: 11, color: cssVar("text-muted") }}>
          Accepted by {last.acceptedBy} on {last.acceptedAt}
        </div>
      ) : null}
    </>
  );

  if (embedded) return body;

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
      }}
    >
      {body}
    </div>
  );
}
