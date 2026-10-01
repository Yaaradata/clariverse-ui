"use client";

import signal from "@kgs2/data/signal_pr01.json";
import { useDemo2, useLabel2, withTs } from "@kgs2/lib/demoState";
import { useEffect, useRef, useState } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { useToast2 } from "../shell/Toast";

const APPROVING_MS = 500;
const SIGNAL_ID = "PR-01";

const outlineBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: K.radius.chip,
  background: "transparent",
  border: `1px solid ${K.borderLight}`,
  color: K.textSec,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

/**
 * Human gate for PR-01: Regional GM can ask for a decision;
 * Operations lead can Approve (nothing is sent).
 */
export function PromiseDecisionPanel({
  onViewDrafts,
  onOpenEvidence,
}: {
  onViewDrafts: () => void;
  onOpenEvidence: () => void;
}) {
  const L = useLabel2();
  const { state, approve, askForDecision, isApproved } = useDemo2();
  const { show } = useToast2();
  const gate = signal.humanGate;
  const approved = isApproved(SIGNAL_ID);
  const ts = state.approvals[SIGNAL_ID]?.ts;
  const asked = Boolean(state.decisionRequested[SIGNAL_ID]);
  const canApprove = gate.approveEnabledFor.includes(state.role);
  const [approving, setApproving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const banner =
    approved && ts
      ? withTs(gate.onApprove.title, ts)
      : asked
        ? gate.decisionRequest.chip
        : L(gate.title);

  const onApprove = () => {
    if (!canApprove || approved || approving) return;
    setApproving(true);
    timer.current = window.setTimeout(() => {
      const stamp = approve(SIGNAL_ID);
      setApproving(false);
      show(
        gate.onApprove.toast.title,
        withTs(gate.onApprove.toast.body, stamp),
      );
    }, APPROVING_MS);
  };

  return (
    <section
      aria-label="Decision panel"
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: K.textMut,
          textTransform: "uppercase",
        }}
      >
        Human gate
      </div>
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: approved
            ? withAlpha(K.green, 0.12)
            : withAlpha(K.amber, 0.1),
          border: `1px solid ${
            approved ? withAlpha(K.green, 0.4) : withAlpha(K.amber, 0.35)
          }`,
          fontSize: 13,
          color: approved ? K.green : K.text,
          lineHeight: 1.45,
          fontWeight: 600,
        }}
      >
        {banner}
        <span
          style={{
            marginLeft: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: K.radius.pill,
            background: approved
              ? withAlpha(K.green, 0.2)
              : withAlpha(K.amber, 0.2),
            color: approved ? K.green : K.amber,
          }}
        >
          {approved
            ? gate.onApprove.chip
            : asked
              ? gate.decisionRequest.chip
              : gate.chip}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <span title={!canApprove ? gate.disabledTooltip : undefined}>
          <button
            type="button"
            className="kgs2-focus"
            aria-disabled={!canApprove || approved}
            disabled={approving}
            onClick={onApprove}
            style={{
              ...outlineBtn,
              background: canApprove && !approved ? K.brandTint : "transparent",
              color: canApprove && !approved ? K.violet300 : K.textMut,
              borderColor:
                canApprove && !approved
                  ? withAlpha(K.violet400, 0.5)
                  : K.borderLight,
              cursor:
                !canApprove || approved
                  ? "not-allowed"
                  : approving
                    ? "wait"
                    : "pointer",
              opacity: !canApprove || approved ? 0.55 : 1,
            }}
          >
            {approving ? "Approving…" : gate.approveLabel}
          </button>
        </span>
        <button
          type="button"
          className="kgs2-focus"
          disabled={asked || approved}
          onClick={() => askForDecision(SIGNAL_ID)}
          style={{
            ...outlineBtn,
            cursor: asked || approved ? "not-allowed" : "pointer",
            opacity: asked || approved ? 0.55 : 1,
          }}
        >
          {asked
            ? gate.decisionRequest.doneLabel
            : gate.decisionRequest.buttonLabel}
        </button>
        <button
          type="button"
          className="kgs2-focus"
          onClick={onViewDrafts}
          style={outlineBtn}
        >
          View drafts
        </button>
        <button
          type="button"
          className="kgs2-focus"
          onClick={onOpenEvidence}
          style={outlineBtn}
        >
          Evidence
        </button>
      </div>
      {!canApprove && !approved ? (
        <div style={{ fontSize: 12, color: K.textMut }}>
          {gate.disabledTooltip}
        </div>
      ) : null}
      {approved && ts ? (
        <div style={{ fontSize: 12, color: K.textMut, fontFamily: K.mono }}>
          {withTs(gate.onApprove.auditEntry, ts)}
        </div>
      ) : null}
    </section>
  );
}
