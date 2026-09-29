"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { roleLabel, withTs } from "@kgs/lib/label";
import { useEffect, useRef, useState } from "react";
import { ApproveButton, type ApproveState } from "../shared/ApproveButton";
import { GateChip } from "../shared/GateChip";
import { HumanGateStatus } from "../shared/HumanGateStatus";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { useToast } from "../shell/Toast";
import { HERO_ID } from "./format";

const APPROVING_MS = 500;
const { signal, drawer } = signalFw41;
const BRIEF = signal.gates.find(
  (g) => g.artefactType === "investigation-brief",
);
const NOTE = signal.gates.find((g) => g.artefactType === "known-issue-note");

const outline = {
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
  whiteSpace: "nowrap",
} as const;

/** Local "Viewing as: President | VP Engineering" segmented control (02 HS-9). */
function ViewingAsSwitch() {
  const { state, setViewingAs } = useDemo();
  const { viewingAs, viewingAsOptions } = meta.ui.hero;
  return (
    <fieldset
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        margin: 0,
        padding: 0,
        border: "none",
        minWidth: 0,
      }}
    >
      <legend
        style={{
          float: "left",
          padding: 0,
          marginRight: 10,
          color: K.textMut,
        }}
      >
        {viewingAs}
      </legend>
      <div
        style={{
          display: "inline-flex",
          padding: 3,
          gap: 3,
          borderRadius: K.radius.chip,
          background: K.surface,
          border: `1px solid ${K.chipBorder}`,
        }}
      >
        {viewingAsOptions.map((role) => {
          const on = state.viewingAs === role;
          return (
            <button
              key={role}
              type="button"
              aria-pressed={on}
              onClick={() => setViewingAs(role)}
              className="kgs-focus"
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: "none",
                background: on ? K.brandTint : "transparent",
                color: on ? K.violet300 : K.textSec,
                fontSize: 13,
                fontWeight: on ? 700 : 500,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {roleLabel(role, state.anonymise)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Decision panel (04 §4.9, 02 HS-8/HS-9, 03 §6.6). Approve is live only for the gate owner. The
 * click calls approve(), which captures the "DD Mon HH:MM UTC" stamp once; the 500ms "Approving…"
 * beat is shown before the approved state and the toast, which read that same stored stamp.
 */
export function DecisionPanel({
  onViewDraft,
  onOpenEvidence,
}: {
  onViewDraft: () => void;
  onOpenEvidence: () => void;
}) {
  const L = useLabel();
  const { state, approve, requestDecision } = useDemo();
  const { show } = useToast();
  const [approving, setApproving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  if (!BRIEF?.onApprove) return null;
  const onApprove = BRIEF.onApprove;
  const hero = meta.ui.hero;
  const approval = state.approvals[HERO_ID];
  const request = state.decisionRequested[HERO_ID];
  const approved = Boolean(approval) && !approving;
  const isOwner = BRIEF.approveEnabledFor.includes(state.viewingAs);
  const asPresident = state.viewingAs === "President";

  const buttonState: ApproveState = approving
    ? "pending"
    : approval
      ? "done"
      : isOwner
        ? "ready"
        : "locked";

  const handleApprove = () => {
    if (approval || approving) return;
    const ts = approve(HERO_ID);
    setApproving(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setApproving(false);
      show(onApprove.toast.title, withTs(onApprove.toast.body, ts));
    }, APPROVING_MS);
  };

  return (
    <section
      id="decision"
      aria-labelledby="kgs-decision-title"
      style={{
        background: K.card,
        borderRadius: K.radius.card,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <h2
          id="kgs-decision-title"
          style={{ margin: 0, fontSize: 17, fontWeight: 800, color: K.text }}
        >
          {hero.decision}
        </h2>
        <ViewingAsSwitch />
      </div>

      <HumanGateStatus
        status={approved ? "approved" : "awaiting"}
        title={L(approved ? onApprove.title : BRIEF.title)}
        auditLine={
          approved && approval
            ? withTs(onApprove.auditLine, approval.ts)
            : BRIEF.auditLine
        }
      >
        {request && BRIEF.decisionRequest ? (
          <>
            <GateChip text={BRIEF.decisionRequest.chip} status="awaiting" />
            <div
              style={{
                fontSize: 13,
                color: K.textMut,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {withTs(BRIEF.decisionRequest.auditEntry, request.ts)}
            </div>
          </>
        ) : null}
        {approved
          ? onApprove.openLines.map((line) => (
              <div
                key={line}
                className="kgs-slide"
                style={{ fontSize: 13, color: K.textSec, lineHeight: 1.45 }}
              >
                {L(line)}
              </div>
            ))
          : null}
      </HumanGateStatus>

      {NOTE ? (
        <HumanGateStatus
          status="not_sent"
          title={
            approved && BRIEF.onApproveSecondary
              ? BRIEF.onApproveSecondary.title
              : L(NOTE.title)
          }
        />
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <ApproveButton
          state={buttonState}
          label={BRIEF.approveLabel ?? ""}
          pendingLabel={hero.approving}
          doneLabel={hero.approved}
          lockedTooltip={BRIEF.disabledTooltip ?? ""}
          onApprove={handleApprove}
        />
        <button
          type="button"
          onClick={onViewDraft}
          className="kgs-focus"
          style={outline}
        >
          {hero.viewDraft}
        </button>
        <button
          type="button"
          onClick={onOpenEvidence}
          className="kgs-focus"
          style={outline}
        >
          {drawer.title}
        </button>
      </div>

      {asPresident && !approval && BRIEF.decisionRequest ? (
        <button
          type="button"
          disabled={Boolean(request)}
          onClick={() => requestDecision(HERO_ID)}
          className="kgs-focus"
          style={{
            ...outline,
            alignSelf: "flex-start",
            color: request ? K.textMut : K.violet400,
            borderColor: request ? K.chipBorder : K.violet400,
            cursor: request ? "default" : "pointer",
          }}
        >
          {request
            ? BRIEF.decisionRequest.doneLabel
            : BRIEF.decisionRequest.buttonLabel}
        </button>
      ) : null}

      <div
        style={{
          fontSize: 12,
          color: K.textMut,
          paddingTop: 10,
          borderTop: `1px solid ${K.borderLight}`,
        }}
      >
        {signal.gateFooter}
      </div>
    </section>
  );
}
