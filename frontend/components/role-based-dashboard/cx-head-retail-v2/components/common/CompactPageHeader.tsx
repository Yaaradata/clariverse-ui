import React from "react";
import { cssVar, layout, radius, type } from "../../theme/tokens";

export function CompactPageHeader({
  eyebrow,
  title,
  subtitle,
  badge,
  badgeTone = "neutral",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "neutral" | "warn";
}): React.ReactElement {
  const badgeColor = badgeTone === "warn" ? cssVar("severity-med") : cssVar("text-secondary");

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            letterSpacing: 0.55,
            textTransform: "uppercase",
            color: cssVar("accent"),
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            margin: "6px 0 0",
            fontSize: type.scale.h2,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
            lineHeight: type.leading.snug,
            letterSpacing: -0.2,
            maxWidth: layout.contentMaxWidth - 120,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: type.scale.small,
              color: cssVar("text-muted"),
              lineHeight: 1.35,
              maxWidth: 720,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {badge ? (
        <span
          style={{
            flexShrink: 0,
            padding: "5px 10px",
            borderRadius: radius.pill,
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            color: badgeColor,
            background: badgeTone === "warn" ? `${cssVar("severity-med")}14` : cssVar("surface-raised"),
            border: `1px solid ${badgeTone === "warn" ? `${cssVar("severity-med")}44` : cssVar("border")}`,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function pageShellStyle(): React.CSSProperties {
  return {
    maxWidth: layout.contentMaxWidth,
    margin: "0 auto",
    padding: layout.pagePadding,
    display: "flex",
    flexDirection: "column",
    gap: layout.pageGap,
  };
}
