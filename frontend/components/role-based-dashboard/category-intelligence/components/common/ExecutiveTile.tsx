import React from "react";

import type { ExecutiveTileData } from "../../lib/categoryCommandData";
import { AiMarker } from "./AiMarker";
import { MiniGauge, MiniSparkline } from "./MiniSparkline";
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
  explainability,
}: {
  tile: ExecutiveTileData;
  onClick?: () => void;
  isPrimary?: boolean;
  explainability?: string;
}): React.ReactElement {
  const accent = cssVar("accent");
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={isPrimary && explainability ? explainability : undefined}
      style={{
        textAlign: "left",
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: "18px 18px 14px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 228,
        boxShadow: cssVar("shadow-card"),
        width: "100%",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.35 }}>
        {tile.title}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span
          className="lisn-cat-num"
          style={{
            fontSize: isPrimary ? 38 : 34,
            fontWeight: 800,
            color: cssVar("text-primary"),
            lineHeight: 1,
          }}
        >
          {tile.primaryValue}
        </span>
        <span className="lisn-cat-num" style={{ fontSize: 12, fontWeight: 600, color: deltaColor(tile.deltaTone) }}>
          {tile.delta}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8, alignItems: "end" }}>
        <MiniSparkline data={tile.spark} color={accent} height={48} gradientKey={tile.id} />
        <MiniGauge value={tile.gaugeValue} label={tile.gaugeLabel} color={accent} />
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          borderRadius: radius.md,
          background: cssVar("accent-soft"),
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <AiMarker size={12} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: accent,
              textTransform: "uppercase",
            }}
          >
            AI insight
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
          {tile.aiInsight}
        </p>
      </div>
    </Tag>
  );
}
