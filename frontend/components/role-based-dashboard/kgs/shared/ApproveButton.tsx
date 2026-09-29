"use client";

import { Check, Loader2, Lock } from "lucide-react";
import { useId, useState } from "react";
import { K, withAlpha } from "./tokens";

export type ApproveState = "locked" | "ready" | "pending" | "done";

function look(state: ApproveState) {
  switch (state) {
    case "locked":
      return {
        background: K.elevated,
        border: `1px solid ${K.chipBorder}`,
        color: "#737373",
        cursor: "not-allowed",
      };
    case "ready":
      return {
        background: "linear-gradient(90deg, #5332ff, #7c3aed)",
        border: "1px solid transparent",
        color: K.text,
        cursor: "pointer",
      };
    case "pending":
      return {
        background: "linear-gradient(90deg, #5332ff, #7c3aed)",
        border: "1px solid transparent",
        color: K.text,
        cursor: "progress",
      };
    case "done":
      return {
        background: withAlpha(K.green, 0.08),
        border: `1px solid ${withAlpha(K.green, 0.6)}`,
        color: K.green,
        cursor: "default",
      };
    default: {
      const never: never = state;
      return never;
    }
  }
}

/**
 * ApproveButton (03 §6.6). Locked uses `aria-disabled` (not `disabled`) so it stays focusable and
 * its tooltip naming the owner shows on hover and on keyboard focus; clicks are ignored.
 */
export function ApproveButton({
  state,
  label,
  pendingLabel,
  doneLabel,
  lockedTooltip,
  onApprove,
}: {
  state: ApproveState;
  label: string;
  pendingLabel: string;
  doneLabel: string;
  lockedTooltip: string;
  onApprove: () => void;
}) {
  const tipId = useId();
  const [tip, setTip] = useState(false);
  const locked = state === "locked";
  const Icon =
    state === "locked"
      ? Lock
      : state === "pending"
        ? Loader2
        : state === "done"
          ? Check
          : null;
  const text =
    state === "pending" ? pendingLabel : state === "done" ? doneLabel : label;

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-disabled={state !== "ready" || undefined}
        aria-describedby={locked ? tipId : undefined}
        disabled={state === "done"}
        onClick={() => {
          if (state === "ready") onApprove();
        }}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        onFocus={() => setTip(true)}
        onBlur={() => setTip(false)}
        className="kgs-focus"
        style={{
          ...look(state),
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 14px",
          borderRadius: K.radius.chip,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "background 300ms, color 300ms, border-color 300ms",
        }}
      >
        {Icon ? (
          <Icon
            size={15}
            aria-hidden
            className={state === "pending" ? "kgs-spin" : undefined}
          />
        ) : null}
        {text}
      </button>
      {locked ? (
        <span
          id={tipId}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            zIndex: 65,
            whiteSpace: "nowrap",
            background: K.elevated,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 12,
            color: K.textSec,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            opacity: tip ? 1 : 0,
            visibility: tip ? "visible" : "hidden",
            transition: "opacity 150ms",
            pointerEvents: "none",
          }}
        >
          {lockedTooltip}
        </span>
      ) : null}
    </span>
  );
}
