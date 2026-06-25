import React from "react";
import type { RadarSignal } from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { ConfidenceBand } from "./ConfidenceBand";
import { cssVar, radius } from "../../theme/tokens";

function severityColor(sev: RadarSignal["severity"]): string {
  if (sev === "critical") return cssVar("severity-high");
  if (sev === "high") return cssVar("severity-med");
  if (sev === "stable") return cssVar("text-muted");
  return cssVar("positive");
}

/** Honest card slots — RP-004 / RP-007 per-channel corroboration, never blended. */
export function InsightCard({
  signal,
  onOpen,
}: {
  signal: RadarSignal;
  onOpen: () => void;
}): React.ReactElement {
  const muted = signal.suppressed;
  const funnel =
    signal.signalsDistilled > 0
      ? `${signal.mentions.toLocaleString("en-IN")} mentions → ${signal.signalsDistilled} signal`
      : `${signal.mentions.toLocaleString("en-IN")} mentions → suppressed`;

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={muted}
      style={{
        flex: "0 0 312px",
        textAlign: "left",
        background: muted ? "transparent" : cssVar("surface"),
        border: `1px solid ${muted ? cssVar("border") : cssVar("border-strong")}`,
        borderRadius: radius.lg,
        padding: "14px 16px",
        cursor: muted ? "default" : "pointer",
        opacity: muted ? 0.55 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: muted ? "none" : cssVar("shadow-card"),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3 }}>
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
        </span>
      </div>

      <div style={{ fontSize: 11, color: cssVar("text-muted") }}>{signal.cohort}</div>
      <div style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{signal.honestyLine}</div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
        <span style={{ color: cssVar("text-muted") }}>Onset {signal.onset}</span>
        <span className="lisn-num" style={{ color: cssVar("accent"), fontWeight: 600 }}>
          {funnel}
        </span>
      </div>

      <div style={{ fontSize: 12, color: cssVar("text-secondary") }}>{signal.stats}</div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: cssVar("text-muted"), marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
          Corroboration per channel
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {signal.channels.map((ch) => (
            <span
              key={`${ch.name}-${ch.time}`}
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: radius.pill,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                color: cssVar("text-secondary"),
              }}
            >
              {ch.name}
              {ch.time !== "—" ? ` · ${ch.time}` : ""}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{signal.aiVerdict}</span>
      </div>

      <ConfidenceBand band={signal.confidence} />
    </button>
  );
}
