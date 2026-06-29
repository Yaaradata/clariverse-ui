"use client";

import React, { useState } from "react";

import { useDashboardShell } from "../../lib/DashboardShellContext";
import { useAppState } from "../../state/AppStateContext";
import type { ActionLabel } from "../../state/appState";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

export interface ActionItem {
  label: ActionLabel;
  text: string;
  routedOwner: string;
  gated?: boolean;
  gateNote?: string;
  signalId: string;
  secondary?: boolean;
}

export function ActionBar({
  actions,
  personaId,
}: {
  actions: ActionItem[];
  personaId?: "category-head" | "cx-voc-head";
}): React.ReactElement {
  const { approveDraft, auditLog } = useDashboardShell();
  const { appendAudit } = useAppState();
  const [approvedIdx, setApprovedIdx] = useState<Set<number>>(new Set());

  const ordered =
    personaId === "cx-voc-head"
      ? [...actions].sort((a, b) => (a.secondary ? -1 : 1) - (b.secondary ? -1 : 1))
      : actions;

  const onApprove = (idx: number, action: ActionItem) => {
    const accepted_at = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    approveDraft(action.signalId, `${action.label}: ${action.text}`, "Priya Nair");
    appendAudit({
      signalId: action.signalId,
      actionLabel: action.text,
      accepted_by: "Priya Nair",
      accepted_at,
    });
    setApprovedIdx((s) => new Set(s).add(idx));
  };

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <AiMarker size={10} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: cssVar("text-muted"), textTransform: "uppercase" }}>
          Recommended actions — draft only
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ordered.map((action, idx) => {
          const approved = approvedIdx.has(idx);
          const last = auditLog.filter((a) => a.signalId === action.signalId).pop();
          return (
            <div
              key={`${action.label}-${action.text}`}
              style={{
                padding: 12,
                borderRadius: radius.sm,
                border: `1px solid ${cssVar("border")}`,
                background: cssVar("surface"),
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                {action.label} → {action.routedOwner}
                {action.secondary ? " (CX path)" : ""}
              </div>
              <p style={{ margin: "6px 0 10px", fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
                {action.text}
              </p>
              {action.gated && action.gateNote ? (
                <div style={{ fontSize: 11, color: cssVar("severity-med"), marginBottom: 8 }}>{action.gateNote}</div>
              ) : null}
              <button
                type="button"
                disabled={approved || action.gated}
                onClick={() => onApprove(idx, action)}
                style={{
                  padding: "8px 14px",
                  borderRadius: radius.sm,
                  border: "none",
                  background: approved ? cssVar("positive") : action.gated ? cssVar("border") : cssVar("accent"),
                  color: approved || !action.gated ? "#fff" : cssVar("text-muted"),
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: approved || action.gated ? "default" : "pointer",
                }}
              >
                {approved ? "Accepted — audit logged" : `Approve ${action.label.toLowerCase()}`}
              </button>
              {approved && last ? (
                <div style={{ marginTop: 8, fontSize: 11, color: cssVar("text-muted") }}>
                  Accepted by {last.accepted_by} on {last.accepted_at}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
