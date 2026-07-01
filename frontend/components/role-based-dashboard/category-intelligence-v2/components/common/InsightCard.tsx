import React from "react";

import type { CategorySignalView } from "../../lib/seedData";
import { AiMarker } from "./AiMarker";
import { cssVar, radius, space, type } from "../../theme/tokens";

function severityColor(sev: CategorySignalView["severity"]): string {
  if (sev === "S1") return cssVar("severity-high");
  if (sev === "S2") return cssVar("severity-med");
  return cssVar("text-muted");
}

export function InsightCard({
  signal,
  variant = "rail",
  onOpen,
}: {
  signal: CategorySignalView;
  variant?: "rail" | "hero";
  onOpen?: () => void;
}): React.ReactElement {
  const muted = signal.suppressed;
  const advisory = signal.advisory;
  const Tag = onOpen && !muted && !advisory ? "button" : "div";

  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      onClick={onOpen}
      className={variant === "hero" ? "lisn-anim-scale" : undefined}
      style={{
        flex: variant === "rail" ? "0 0 300px" : undefined,
        width: variant === "hero" ? "100%" : undefined,
        textAlign: "left",
        background: muted ? "transparent" : cssVar("surface"),
        border: `1px solid ${muted ? cssVar("border") : cssVar("border-strong")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        cursor: onOpen && !muted && !advisory ? "pointer" : "default",
        opacity: muted ? 0.6 : 1,
        display: "flex",
        flexDirection: "column",
        gap: space["2"],
        boxShadow: muted ? "none" : cssVar("shadow-card"),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: variant === "hero" ? type.scale.h3 : type.scale.small, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3 }}>
          {signal.title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            color: severityColor(signal.severity),
            letterSpacing: 0.4,
            flexShrink: 0,
          }}
        >
          {signal.severity}
          {advisory ? " · watch" : ""}
        </span>
      </div>

      {signal.regimeBadge ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: cssVar("accent-2"),
            background: cssVar("accent-soft"),
            padding: "2px 8px",
            borderRadius: radius.pill,
            width: "fit-content",
          }}
        >
          {signal.regimeBadge}
        </span>
      ) : null}

      <div style={{ fontSize: 11, color: cssVar("text-muted") }}>{signal.cohort}</div>
      <div style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{signal.honestyLine}</div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
        <span style={{ color: cssVar("text-muted") }}>Onset {signal.onset}</span>
        <span className="lisn-num" style={{ color: cssVar("accent"), fontWeight: 600 }}>
          {signal.impactRupee}
        </span>
      </div>

      <div style={{ fontSize: 12, color: cssVar("text-secondary") }}>{signal.stats}</div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{signal.aiVerdict}</span>
      </div>

      {signal.integrationDependent ? (
        <div style={{ fontSize: 11, color: cssVar("severity-med") }}>★ Integration-dependent — needs voice corpus</div>
      ) : null}

      {signal.confidence ? (
        <div style={{ fontSize: 10, color: cssVar("text-muted") }}>Confidence: {signal.confidence}</div>
      ) : null}
    </Tag>
  );
}
