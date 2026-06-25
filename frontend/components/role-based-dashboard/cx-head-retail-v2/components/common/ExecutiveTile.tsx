import React from "react";
import type { ExecutiveTileData } from "../../lib/cxHeadRetailData";
import { MiniGauge, MiniSparkline } from "./MiniSparkline";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

function deltaColor(tone: ExecutiveTileData["deltaTone"]): string {
  if (tone === "down" || tone === "warn") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

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
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        textAlign: "left",
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.md,
        padding: "12px 12px 10px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 138,
        boxShadow: cssVar("shadow-card"),
        width: "100%",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>{tile.title}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          className="lisn-num"
          style={{
            fontSize: isPrimary ? 30 : 26,
            fontWeight: 800,
            color: cssVar("text-primary"),
            lineHeight: 1,
          }}
        >
          {tile.primaryValue}
        </span>
        <span className="lisn-num" style={{ fontSize: 11, fontWeight: 600, color: deltaColor(tile.deltaTone) }}>
          {tile.delta}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 64px", gap: 6, alignItems: "end" }}>
        <MiniSparkline data={tile.spark} color={accent} height={36} />
        <MiniGauge value={tile.gaugeValue} label={tile.gaugeLabel} color={accent} />
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: 5,
          alignItems: "flex-start",
          paddingTop: 4,
        }}
      >
        <AiMarker size={10} />
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: cssVar("text-muted"),
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
    </Tag>
  );
}
