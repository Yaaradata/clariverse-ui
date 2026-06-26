"use client";

import React from "react";
import { COMPLIANCE_KPIS, type ComplianceKpiConfig } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const ACCENT: Record<ComplianceKpiConfig["id"], string> = {
  clocks: cssVar("severity-high"),
  nearest: cssVar("accent-2"),
  darkPattern: cssVar("accent"),
  themes: cssVar("severity-med"),
};

function ComplianceKpiCard({ kpi }: { kpi: ComplianceKpiConfig }): React.ReactElement {
  const accent = ACCENT[kpi.id];

  return (
    <article
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
        {kpi.title}
      </div>

      <div className="lisn-num" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: cssVar("text-primary") }}>
        {kpi.primaryValue}
      </div>

      {kpi.subtitle ? (
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{kpi.subtitle}</div>
      ) : null}
    </article>
  );
}

/** S3 triage KPIs — statutory clocks and conduct exposure. */
export function ComplianceKpiCards(): React.ReactElement {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: space["3"], alignItems: "stretch" }}>
      {COMPLIANCE_KPIS.map((kpi) => (
        <ComplianceKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}
