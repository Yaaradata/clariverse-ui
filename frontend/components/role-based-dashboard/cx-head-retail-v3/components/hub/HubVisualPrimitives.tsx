"use client";

import React from "react";
import { AiMarker } from "../common/AiMarker";
import { cssVar, radius } from "../../theme/tokens";

/** Uppercase section label — matches DrillPanel `Section` titles. */
export function HubMicroLabel({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.55,
        textTransform: "uppercase",
        color: cssVar("text-muted"),
      }}
    >
      {children}
    </span>
  );
}

/** Left-accent panel — IntentGroupCard / StatutoryQueueDrill pattern. */
export function HubAccentPanel({
  children,
  accent = cssVar("accent"),
  highlight = false,
}: {
  children: React.ReactNode;
  accent?: string;
  highlight?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: radius.md,
        background: highlight ? `linear-gradient(90deg, ${accent}12 0%, transparent 70%)` : cssVar("surface-raised"),
        borderTop: `1px solid ${accent}30`,
        borderRight: `1px solid ${highlight ? `${accent}30` : cssVar("border")}`,
        borderBottom: `1px solid ${highlight ? `${accent}30` : cssVar("border")}`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      {children}
    </div>
  );
}

/** Summary chip strip — HVvsLVIntentPanel `summaryChips` pattern. */
export function HubSummaryChip({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: radius.pill,
        background: `${color}12`,
        border: `1px solid ${color}35`,
      }}
    >
      <HubMicroLabel>{label}</HubMicroLabel>
      <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color }}>
        {value}
      </span>
    </div>
  );
}

/** AI callout — DrillPanel `AiLine` pattern. */
export function HubAiCallout({ children, tone = "accent" }: { children: React.ReactNode; tone?: "accent" | "risk" }): React.ReactElement {
  const color = tone === "risk" ? cssVar("severity-high") : cssVar("accent");
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "10px 12px",
        background: tone === "risk" ? `${color}10` : cssVar("accent-soft"),
        borderRadius: radius.md,
        border: `1px solid ${color}28`,
      }}
    >
      <AiMarker size={14} />
      <span style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

/** Glowing row dot — IntentRowCard marker. */
export function HubRowDot({ color }: { color: string }): React.ReactElement {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 0 3px ${color}22`,
        flexShrink: 0,
      }}
    />
  );
}

export function HubStatusPill({
  label,
  color,
}: {
  label: string;
  color: string;
}): React.ReactElement {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.45,
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: radius.pill,
        color,
        background: `${color}16`,
        border: `1px solid ${color}40`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
