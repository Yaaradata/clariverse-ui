"use client";

import React, { useState } from "react";

import { useDashboardShell } from "../../lib/DashboardShellContext";
import { useAppState } from "../../state/AppStateContext";
import type { ActionLabel } from "../../state/appState";
import { AiMarker } from "./AiMarker";
import { SectionHeader } from "./ChartPanel";
import { DETAIL_GAP } from "./detailLayout";
import { cssVar, radius, space, type } from "../../theme/tokens";

export interface ActionItem {
  label: ActionLabel;
  text: string;
  routedOwner: string;
  gated?: boolean;
  gateNote?: string;
  signalId: string;
  secondary?: boolean;
}

function DraftActionRow({
  action,
  approved,
  last,
  onApprove,
  layout = "default",
}: {
  action: ActionItem;
  approved: boolean;
  last?: { accepted_by: string; accepted_at: string };
  onApprove: () => void;
  layout?: "default" | "profitability";
}): React.ReactElement {
  if (layout === "profitability") {
    const icon = action.label === "Route" ? "↗" : action.label === "Prepare" ? "◎" : "✎";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "#15161b",
          border: `1px solid ${cssVar("border")}`,
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: cssVar("accent-soft"),
            color: cssVar("accent"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: cssVar("text-muted"),
              textTransform: "uppercase",
            }}
          >
            {action.label}{" "}
            <span style={{ color: cssVar("accent"), margin: "0 4px" }}>·</span> {action.routedOwner}
          </p>
          <p style={{ margin: 0, fontSize: type.scale.small, color: cssVar("text-primary"), lineHeight: 1.4 }}>{action.text}</p>
        </div>
        <button
          type="button"
          disabled={approved || action.gated}
          onClick={onApprove}
          style={{
            flexShrink: 0,
            background: approved ? cssVar("positive") : action.gated ? cssVar("border") : cssVar("accent"),
            color: approved || !action.gated ? "#fff" : cssVar("text-muted"),
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 11,
            fontWeight: 700,
            cursor: approved || action.gated ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {approved ? "Accepted" : "Approve"}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["3"],
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              letterSpacing: 0.5,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
            }}
          >
            <AiMarker size={10} />
            {action.label} → {action.routedOwner}
            {action.secondary ? " (CX path)" : ""}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: type.scale.small, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
            {action.text}
          </p>
          {action.gated && action.gateNote ? (
            <div style={{ fontSize: type.scale.caption, color: cssVar("severity-med"), marginTop: space["2"] }}>{action.gateNote}</div>
          ) : null}
        </div>
        <button
          type="button"
          disabled={approved || action.gated}
          onClick={onApprove}
          style={{
            flexShrink: 0,
            padding: "8px 14px",
            borderRadius: radius.sm,
            border: "none",
            background: approved ? cssVar("positive") : action.gated ? cssVar("border") : cssVar("accent"),
            color: approved || !action.gated ? "#fff" : cssVar("text-muted"),
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            cursor: approved || action.gated ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {approved ? "Accepted — audit logged" : "Approve"}
        </button>
      </div>
      {approved && last ? (
        <div style={{ marginTop: space["2"], fontSize: type.scale.caption, color: cssVar("text-muted") }}>
          Accepted by {last.accepted_by} on {last.accepted_at}
        </div>
      ) : null}
    </div>
  );
}

export function ActionBar({
  actions,
  personaId,
  title = "Recommended actions",
  hint = "Draft only — human approval required",
  layout = "default",
}: {
  actions: ActionItem[];
  personaId?: "category-head" | "cx-voc-head";
  title?: string;
  hint?: string;
  layout?: "default" | "profitability";
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

  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: layout === "profitability" ? 12 : DETAIL_GAP, flex: 1 }}>
      {ordered.map((action, idx) => {
        const approved = approvedIdx.has(idx);
        const last = auditLog.filter((a) => a.signalId === action.signalId).pop();
        return (
          <DraftActionRow
            key={`${action.label}-${action.text}`}
            action={action}
            approved={approved}
            last={last ? { accepted_by: last.accepted_by, accepted_at: last.accepted_at } : undefined}
            onApprove={() => onApprove(idx, action)}
            layout={layout}
          />
        );
      })}
    </div>
  );

  if (layout === "profitability") {
    return (
      <div
        style={{
          background: cssVar("surface"),
          border: `1px solid ${cssVar("border")}`,
          borderRadius: radius.lg,
          padding: space["4"],
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: space["3"],
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: space["3"] }}>
          <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>{title}</div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: cssVar("severity-med"),
              whiteSpace: "nowrap",
            }}
          >
            DRAFT ONLY · HUMAN APPROVAL REQUIRED
          </span>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: space["3"], minWidth: 0 }}>
      <SectionHeader title={title} hint={hint} />
      {body}
    </div>
  );
}
