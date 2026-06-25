"use client";

import React from "react";
import { MiniSparkline } from "./MiniSparkline";
import { cssVar, radius, type } from "../../theme/tokens";

export type KpiRibbonItem = {
  label: string;
  value: string;
  delta: string;
  tone: "warn" | "down" | "up" | "flat";
  spark?: number[];
};

function toneColor(tone: KpiRibbonItem["tone"]): string {
  if (tone === "warn" || tone === "down") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

/** Compact KPI strip with inline sparklines — replaces text-heavy ribbon. */
export function KpiSparkRibbon({ items }: { items: KpiRibbonItem[] }): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: 8,
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
      }}
    >
      {items.map((k) => (
        <div key={k.label} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: cssVar("text-muted"), fontWeight: 600, letterSpacing: 0.3 }}>
            {k.label}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
            <span
              className="lisn-num"
              style={{ fontSize: 16, fontWeight: type.weight.bold, color: cssVar("text-primary") }}
            >
              {k.value}
            </span>
            <span className="lisn-num" style={{ fontSize: 10, fontWeight: 600, color: toneColor(k.tone) }}>
              {k.delta}
            </span>
          </div>
          {k.spark && k.spark.length > 1 ? (
            <div style={{ marginTop: 4, height: 28 }}>
              <MiniSparkline data={k.spark} color={toneColor(k.tone)} height={28} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
