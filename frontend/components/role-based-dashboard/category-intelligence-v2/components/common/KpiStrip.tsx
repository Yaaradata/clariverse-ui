"use client";

import React from "react";
import type { DetailKpi } from "../../lib/categoryDetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";
import { DETAIL_GAP } from "./detailLayout";

export function KpiStrip({ items }: { items: DetailKpi[] }): React.ReactElement {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: DETAIL_GAP,
        alignItems: "stretch",
      }}
    >
      {items.map((kpi) => {
        const accent = kpi.accent ?? cssVar("accent");
        return (
          <article
            key={kpi.label}
            style={{
              background: cssVar("surface"),
              border: `1px solid ${cssVar("border")}`,
              borderTop: `2px solid ${accent}`,
              borderRadius: radius.lg,
              padding: `${space["3"]} ${space["4"]}`,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: space["2"],
            }}
          >
            <div
              style={{
                fontSize: type.scale.caption,
                fontWeight: type.weight.bold,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {kpi.label}
            </div>
            <div className="lisn-num" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: cssVar("text-primary") }}>
              {kpi.value}
            </div>
            {kpi.sub ? (
              <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{kpi.sub}</div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
