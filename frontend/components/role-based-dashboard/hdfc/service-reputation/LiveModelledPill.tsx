"use client";

import type { CSSProperties } from "react";
import type { SourceKind } from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";

type Props = {
  source: SourceKind | undefined;
  compact?: boolean;
};

/** Provenance pills removed for HDFC Head of CX — keep export so call sites stay valid. */
export function LiveModelledPill(_props: Props) {
  return null;
}

export function statusChipStyle(status: string): CSSProperties {
  const map: Record<string, string> = {
    NEGATIVE: "#ef4444",
    DECLINING: "#f59e0b",
    WEAK: "#f59e0b",
    WATCH: "#f59e0b",
    POSITIVE: "#22c55e",
  };
  const color = map[status.toUpperCase()] ?? "#94a3b8";
  return {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color,
    padding: "3px 8px",
    borderRadius: 999,
    background: `${color}18`,
    borderTop: `1px solid ${color}45`,
    borderRight: `1px solid ${color}45`,
    borderBottom: `1px solid ${color}45`,
    borderLeft: `1px solid ${color}45`,
    whiteSpace: "nowrap",
  };
}
