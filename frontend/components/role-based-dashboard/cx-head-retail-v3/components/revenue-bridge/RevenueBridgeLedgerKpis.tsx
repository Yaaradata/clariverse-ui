"use client";

import React from "react";
import {
  REVENUE_BRIDGE_KPIS,
  type RevenueBridgeCoverageStatus,
  type RevenueBridgeKpiConfig,
} from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const ACCENT: Record<RevenueBridgeKpiConfig["id"], string> = {
  impact: cssVar("accent-2"),
  signals: cssVar("accent"),
  readiness: cssVar("severity-med"),
};

function deltaColor(tone: RevenueBridgeKpiConfig["deltaTone"]): string {
  if (tone === "up") return cssVar("positive");
  if (tone === "down") return cssVar("severity-high");
  return cssVar("text-muted");
}

function coverageSummary(status: RevenueBridgeCoverageStatus): string {
  if (status === "done") return "✓";
  if (status === "partial") return "Partial";
  return "—";
}

function supportLine(kpi: RevenueBridgeKpiConfig): string | null {
  if (kpi.id === "readiness" && kpi.coverageItems?.length) {
    return kpi.coverageItems.map((item) => `${item.label} ${coverageSummary(item.status)}`).join(" · ");
  }
  if (kpi.id === "signals" && kpi.signalIds?.length) {
    return kpi.signalIds.join(" · ");
  }
  return kpi.subtitle ?? kpi.primaryLabel ?? null;
}

function SimpleKpiCard({ kpi }: { kpi: RevenueBridgeKpiConfig }): React.ReactElement {
  const accent = ACCENT[kpi.id];
  const support = supportLine(kpi);

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

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: space["2"] }}>
        <div className="lisn-num" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: cssVar("text-primary") }}>
          {kpi.primaryValue}
        </div>
        {kpi.delta ? (
          <span
            className="lisn-num"
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              color: deltaColor(kpi.deltaTone),
              flexShrink: 0,
            }}
          >
            {kpi.delta}
          </span>
        ) : null}
      </div>

      {support ? (
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{support}</div>
      ) : null}

      <div style={{ marginTop: "auto", fontSize: 10, color: cssVar("text-muted") }}>{kpi.footer}</div>
    </article>
  );
}

/** S5 triage KPIs — summary layer above CX→margin bridge and category P&L. */
export function RevenueBridgeLedgerKpis(): React.ReactElement {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: space["2"] }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
        <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>
          Voice → P&L ledger
        </div>
        <div style={{ fontSize: 11, color: cssVar("text-muted") }}>
          Margin bridge + category P&L + relational NPS sit below — not on real-time happiness
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: space["3"], alignItems: "stretch" }}>
        {REVENUE_BRIDGE_KPIS.map((kpi) => (
          <SimpleKpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </section>
  );
}
