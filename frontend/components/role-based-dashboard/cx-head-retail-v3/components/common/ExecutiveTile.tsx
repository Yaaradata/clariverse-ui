import React from "react";
import { ArrowRight } from "lucide-react";
import type { ExecutiveTileData } from "../../lib/cxHeadRetailData";
import { MiniSparkline } from "./MiniSparkline";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

function deltaColor(tone: ExecutiveTileData["deltaTone"]): string {
  if (tone === "down" || tone === "warn") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

function severityColor(severity: ExecutiveTileData["severity"]): string {
  if (severity === "critical") return cssVar("severity-high");
  if (severity === "high") return cssVar("severity-med");
  return cssVar("text-muted");
}

/** Command-centre breaking card — compact footprint, no dead vertical space. */
export function ExecutiveTile({
  tile,
  onClick,
  isPrimary = false,
}: {
  tile: ExecutiveTileData;
  onClick?: () => void;
  isPrimary?: boolean;
}): React.ReactElement {
  const accent = cssVar("accent");
  const sevColor = severityColor(tile.severity);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        textAlign: "left",
        background: cssVar("surface"),
        border: `1px solid ${isPrimary ? `${sevColor}44` : cssVar("border")}`,
        borderRadius: radius.lg,
        padding: "12px 12px 11px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: cssVar("shadow-card"),
        width: "100%",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ minWidth: 0, flex: 1, lineHeight: 1.25 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>
            {tile.breakingIssue}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginLeft: 6,
              verticalAlign: "middle",
              padding: "2px 6px",
              borderRadius: radius.pill,
              background: `${sevColor}14`,
              border: `1px solid ${sevColor}33`,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: sevColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.35,
                textTransform: "uppercase",
                color: sevColor,
              }}
            >
              {tile.severity}
            </span>
          </span>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right", lineHeight: 1.3, fontSize: 10, color: cssVar("text-muted") }}>
          <div>
            Owner <strong style={{ color: accent, fontWeight: 700 }}>{tile.owner}</strong>
          </div>
          <div style={{ marginTop: 1 }}>Onset {tile.onset}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span
            className="lisn-num"
            style={{
              fontSize: isPrimary ? 32 : 28,
              fontWeight: 800,
              color: cssVar("text-primary"),
              lineHeight: 1,
            }}
          >
            {tile.primaryValue}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: cssVar("text-secondary") }}>{tile.primaryLabel}</span>
        </div>
        <div className="lisn-num" style={{ fontSize: 10, color: deltaColor(tile.deltaTone), fontWeight: 600, lineHeight: 1.3 }}>
          {tile.delta}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tile.channels.map((ch) => (
            <span
              key={ch}
              style={{
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: radius.pill,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                color: cssVar("text-muted"),
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      <MiniSparkline data={tile.spark} color={sevColor} height={36} />

      <div
        style={{
          padding: "6px 8px",
          borderRadius: radius.sm,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          display: "flex",
          alignItems: "flex-start",
          gap: 5,
        }}
      >
        <ArrowRight size={11} style={{ color: accent, flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 10.5, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.35 }}>
          {tile.recommendedAction}
        </span>
      </div>

      <div
        style={{
          padding: "7px 9px",
          borderRadius: radius.sm,
          background: cssVar("accent-soft"),
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          <AiMarker size={10} style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: accent,
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Why flagged
            </div>
            <p style={{ margin: 0, fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.35 }}>
              {tile.aiInsight}
            </p>
          </div>
        </div>
      </div>
    </Tag>
  );
}
