"use client";

import React from "react";
import { RELATIONAL_NPS } from "../../lib/cxHeadRetailV3MarginBridgeData";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { cssVar, radius, space } from "../../theme/tokens";

/** Periodic / strategic Relational NPS — lives on Voice→P&L, not real-time happiness. */
export function RelationalNpsTile(): React.ReactElement {
  const n = RELATIONAL_NPS;

  return (
    <section
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("accent-2")}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
      aria-label="Relational NPS"
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: cssVar("accent-2"),
            }}
          >
            {n.cadence}
          </div>
          <h3 style={{ margin: `${space["1"]} 0 0`, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
            Relational NPS
          </h3>
          <p style={{ margin: `${space["1"]} 0 0`, fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.35 }}>
            {n.period} · relocated from {n.relocatedFrom}
          </p>
        </div>
        <ConfidenceBand band={n.confidence} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="lisn-num" style={{ fontSize: 36, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
          {n.score}
        </span>
        <span
          className="lisn-num"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: n.deltaPts < 0 ? cssVar("severity-high") : cssVar("positive"),
          }}
        >
          {n.deltaPts > 0 ? "+" : ""}
          {n.deltaPts} pts
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6 }}>
        {(
          [
            { label: "Promoters", value: n.promotersPct, tone: cssVar("positive") },
            { label: "Passives", value: n.passivesPct, tone: cssVar("text-muted") },
            { label: "Detractors", value: n.detractorsPct, tone: cssVar("severity-high") },
          ] as const
        ).map((row) => (
          <div
            key={row.label}
            style={{
              padding: "8px 10px",
              borderRadius: radius.sm,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>
              {row.label}
            </div>
            <div className="lisn-num" style={{ fontSize: 16, fontWeight: 800, color: row.tone, marginTop: 2 }}>
              {row.value}%
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
        {n.byValueTier.map((tier) => (
          <div
            key={tier.tier}
            style={{
              padding: "6px 8px",
              borderRadius: radius.sm,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted") }}>{tier.tier}</div>
            <div className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: cssVar("text-primary") }}>
              {tier.score}
            </div>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{n.note}</p>
    </section>
  );
}
