import React from "react";
import { ArrowRight } from "lucide-react";
import type { ExecutiveTileData } from "../../lib/cxHeadRetailData";
import { MiniGauge, MiniSparkline } from "./MiniSparkline";
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

/** Command-centre breaking card — compact; same footprint as original triad tile. */
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
        padding: "14px 14px 12px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 228,
        boxShadow: cssVar("shadow-card"),
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.35,
              textTransform: "uppercase",
              color: sevColor,
              padding: "2px 6px",
              borderRadius: radius.pill,
              background: `${sevColor}18`,
              flexShrink: 0,
            }}
          >
            {tile.severity}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: cssVar("text-primary"),
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tile.breakingIssue}
          </span>
        </div>
        <span style={{ fontSize: 10, color: cssVar("text-muted"), flexShrink: 0, lineHeight: 1.3, textAlign: "right" }}>
          Owner{" "}
          <strong style={{ color: accent, fontWeight: 700 }}>{tile.owner}</strong>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span
          className="lisn-num"
          style={{ fontSize: isPrimary ? 34 : 30, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}
        >
          {tile.primaryValue}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: cssVar("text-secondary") }}>{tile.primaryLabel}</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          fontSize: 10,
          flexWrap: "wrap",
          marginTop: -2,
        }}
      >
        <span className="lisn-num" style={{ color: deltaColor(tile.deltaTone), fontWeight: 600 }}>
          {tile.delta}
        </span>
        <span style={{ color: cssVar("text-muted") }}>Onset {tile.onset}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tile.channels.map((ch) => (
          <span
            key={ch}
            style={{
              fontSize: 9,
              padding: "1px 5px",
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 64px", gap: 6, alignItems: "end" }}>
        <MiniSparkline data={tile.spark} color={accent} height={34} />
        <MiniGauge value={tile.gaugeValue} label={tile.gaugeLabel} color={accent} compact />
      </div>

      <div
        style={{
          padding: "5px 8px",
          borderRadius: radius.sm,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <ArrowRight size={11} style={{ color: accent, flexShrink: 0, marginTop: 2 }} />
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: cssVar("text-primary"),
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tile.recommendedAction}
        </span>
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "7px 9px",
          borderRadius: radius.md,
          background: cssVar("accent-soft"),
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          <AiMarker size={10} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 0.45,
                  color: accent,
                  textTransform: "uppercase",
                }}
              >
                Why flagged
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: cssVar("text-secondary"),
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tile.aiInsight}
            </p>
          </div>
        </div>
      </div>
    </Tag>
  );
}
