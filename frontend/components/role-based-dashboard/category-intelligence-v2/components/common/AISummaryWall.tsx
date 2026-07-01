"use client";

import React from "react";
import type { SummaryInsight } from "../../lib/categoryDetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

type InsightVariant = "priority" | "warn" | "neutral" | "action";

function insightVariant(severity: SummaryInsight["severity"], index: number): InsightVariant {
  if (severity === "critical") return "priority";
  if (severity === "high") return "warn";
  if (index === 3) return "action";
  return "neutral";
}

const VARIANT_STYLE: Record<
  InsightVariant,
  { background: string; border: string }
> = {
  priority: {
    background: "rgba(240,96,107,0.07)",
    border: "rgba(240,96,107,0.35)",
  },
  warn: {
    background: "rgba(232,162,61,0.06)",
    border: "rgba(232,162,61,0.35)",
  },
  neutral: {
    background: "#15161b",
    border: cssVar("border"),
  },
  action: {
    background: "#15161b",
    border: cssVar("border"),
  },
};

export function AISummaryWall({
  insights,
  title = "✦ AI summary wall",
  subtitle = "Executive takeaway · ranked by impact",
}: {
  insights: SummaryInsight[];
  title?: string;
  subtitle?: string;
}): React.ReactElement {
  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minHeight: 0,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: space["3"],
        }}
      >
        <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3 }}>
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: type.scale.caption,
              color: cssVar("text-muted"),
              lineHeight: 1.4,
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {insights.map((ins, i) => {
          const variant = insightVariant(ins.severity, i);
          const style = VARIANT_STYLE[variant];
          return (
            <div
              key={ins.title}
              style={{
                background: style.background,
                border: `1px solid ${style.border}`,
                borderRadius: 9,
                padding: "11px 13px",
              }}
            >
              <div style={{ fontSize: type.scale.small, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.35, marginBottom: 3 }}>
                <span style={{ color: cssVar("severity-med"), marginRight: 6 }}>{i + 1}.</span>
                {ins.title}
              </div>
              <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{ins.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
