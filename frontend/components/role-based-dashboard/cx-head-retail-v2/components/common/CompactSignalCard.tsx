import React from "react";
import type { ConfidenceBand } from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

/** Dense metric card — stat + one AI line; actions live in drill. */
export function CompactSignalCard({
  title,
  stat,
  aiLine,
  flag,
  flagTone = "med",
  onAction,
  actionLabel = "Drill →",
}: {
  title: string;
  stat: string;
  aiLine: string;
  flag?: string;
  flagTone?: "med" | "accent";
  onAction?: () => void;
  actionLabel?: string;
}): React.ReactElement {
  const flagColor = flagTone === "accent" ? cssVar("accent") : cssVar("severity-med");

  return (
    <div
      style={{
        padding: 12,
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "flex-start" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.25 }}>{title}</div>
        {flag ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: radius.pill,
              background: `${flagColor}18`,
              color: flagColor,
              textTransform: "uppercase",
              letterSpacing: 0.35,
              flexShrink: 0,
            }}
          >
            {flag}
          </span>
        ) : null}
      </div>
      <div className="lisn-num" style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>
        {stat}
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "flex-start", flex: 1 }}>
        <AiMarker size={11} />
        <span
          style={{
            fontSize: 11,
            color: cssVar("text-secondary"),
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {aiLine}
        </span>
      </div>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            alignSelf: "flex-start",
            marginTop: 2,
            padding: "4px 8px",
            borderRadius: radius.sm,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
            color: cssVar("accent"),
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
