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
}: {
  text: string;
  status: GateStatus;
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
        borderRadius: K.radius.pill,
        border: `1px solid ${withAlpha(c, 0.5)}`,
        background: withAlpha(c, 0.12),
        color,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
