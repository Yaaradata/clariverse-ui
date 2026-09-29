"use client";

import type { GateStatus } from "@kgs/types";
import { K, withAlpha } from "./tokens";

const TONE: Record<GateStatus, string> = {
  draft: K.textMut,
  awaiting: K.amber,
  approved: K.green,
  returned: K.slate,
  not_sent: K.textMut,
};

/** Compact HumanGateStatus chip (03 §6.6): amber awaiting, green approved, neutral otherwise. */
export function GateChip({
  text,
  status,
  wrap = false,
}: {
  text: string;
  status: GateStatus;
  /** Allow long owner·gate strings to wrap inside narrow cards. */
  wrap?: boolean;
}) {
  const c = TONE[status];
  const color =
    status === "approved"
      ? K.green
      : status === "awaiting"
        ? K.amber2
        : K.textSec;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: wrap ? K.radius.chip : K.radius.pill,
        border: `1px solid ${withAlpha(c, 0.5)}`,
        background: withAlpha(c, 0.12),
        color,
        whiteSpace: wrap ? "normal" : "nowrap",
        alignSelf: "flex-start",
        lineHeight: 1.35,
      }}
    >
      {text}
    </span>
  );
}
