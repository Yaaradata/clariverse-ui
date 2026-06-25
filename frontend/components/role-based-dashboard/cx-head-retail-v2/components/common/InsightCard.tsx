import React from "react";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

function severityColor(sev: RadarSignal["severity"]): string {
  if (sev === "critical") return cssVar("severity-high");
  if (sev === "high") return cssVar("severity-med");
  if (sev === "stable") return cssVar("text-muted");
  return cssVar("positive");
}

/** Compact radar card — channels + stat only; detail in drill. */
export function InsightCard({
  signal,
  onOpen,
}: {
  signal: RadarSignal;
  onOpen: () => void;
}): React.ReactElement {
  const muted = signal.suppressed;

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={muted}
      style={{
        width: "100%",
        textAlign: "left",
        background: muted ? "transparent" : cssVar("surface"),
        border: `1px solid ${muted ? cssVar("border") : cssVar("border-strong")}`,
        borderRadius: radius.md,
        padding: "10px 12px",
        cursor: muted ? "default" : "pointer",
        opacity: muted ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: muted ? "none" : cssVar("shadow-card"),
        minHeight: 108,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: cssVar("text-primary"),
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {signal.title}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            color: severityColor(signal.severity),
            letterSpacing: 0.35,
            flexShrink: 0,
          }}
        >
          {signal.severity}
        </span>
      </div>

      <div className="lisn-num" style={{ fontSize: 11, fontWeight: 600, color: cssVar("accent") }}>
        {signal.stats}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto" }}>
        {signal.channels.slice(0, 3).map((ch) => (
          <span
            key={`${ch.name}-${ch.time}`}
            style={{
              fontSize: 10,
              padding: "2px 6px",
              borderRadius: radius.pill,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              color: cssVar("text-muted"),
            }}
          >
            {ch.name}
          </span>
        ))}
      </div>
    </button>
  );
}
