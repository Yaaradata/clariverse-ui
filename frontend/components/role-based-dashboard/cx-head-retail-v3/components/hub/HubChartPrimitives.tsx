"use client";

import React from "react";
import { cssVar, radius } from "../../theme/tokens";

export const hubChartTooltip = {
  contentStyle: {
    background: cssVar("surface-raised"),
    border: `1px solid ${cssVar("border")}`,
    borderRadius: radius.sm,
    fontSize: 12,
    color: cssVar("text-primary"),
  },
  labelStyle: { color: cssVar("text-muted") },
  itemStyle: { color: cssVar("text-primary") },
};

export const hubChartAxis = {
  tick: { fontSize: 11, fill: cssVar("text-muted") },
  axisLine: false as const,
  tickLine: false as const,
};

export function HubChartLegend({
  items,
}: {
  items: { label: string; value: string; color: string }[];
}): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: cssVar("text-secondary"), flex: 1 }}>{item.label}</span>
          <span className="lisn-num" style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
