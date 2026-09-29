"use client";

import { CheckCircle2, Clock, FileText } from "lucide-react";

type GateState = "awaiting" | "approved" | "draft" | "not_sent" | "requested";

type GateChipProps = {
  state: GateState;
  text: string;
};

export function GateChip({ state, text }: GateChipProps) {
  const config = {
    awaiting: {
      icon: Clock,
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.5)",
      text: "#fbbf24",
    },
    approved: {
      icon: CheckCircle2,
      bg: "rgba(34, 197, 94, 0.15)",
      border: "rgba(34, 197, 94, 0.5)",
      text: "#4ade80",
    },
    draft: {
      icon: FileText,
      bg: "rgba(115, 115, 115, 0.15)",
      border: "rgba(115, 115, 115, 0.4)",
      text: "#a3a3a3",
    },
    not_sent: {
      icon: FileText,
      bg: "rgba(115, 115, 115, 0.15)",
      border: "rgba(115, 115, 115, 0.4)",
      text: "#a3a3a3",
    },
    requested: {
      icon: Clock,
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.5)",
      text: "#fbbf24",
    },
  }[state];

  const Icon = config.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 999,
        background: config.bg,
        border: `1px solid ${config.border}`,
        fontSize: 13,
        fontWeight: 700,
        color: config.text,
      }}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}
