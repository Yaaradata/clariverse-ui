"use client";

import React from "react";
import {
  CX_MARGIN_GLOBAL_EVIDENCE,
  CX_TO_MARGIN_BRIDGE,
} from "../../lib/cxHeadRetailV3MarginBridgeData";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { cssVar, radius, space } from "../../theme/tokens";

/** Returns-rate → reverse logistics + lost GMV → CM1/CM2/CM3 compression. */
export function CxToMarginBridge(): React.ReactElement {
  const m = CX_TO_MARGIN_BRIDGE;

  return (
    <section
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("accent")}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
      aria-label="CX to margin bridge"
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
            CX → margin bridge
          </h3>
          <p style={{ margin: `${space["1"]} 0 0`, fontSize: 12, color: cssVar("text-muted"), lineHeight: 1.4 }}>
            Returns-rate → reverse-logistics cost + lost GMV → CM compression
          </p>
        </div>
        <ConfidenceBand band={m.confidence} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: cssVar("text-muted") }}>
            Returns rate
          </div>
          <div className="lisn-num" style={{ fontSize: 24, fontWeight: 800, color: cssVar("severity-high"), marginTop: 4 }}>
            {m.returnsRatePct.toFixed(1)}%
          </div>
          <div className="lisn-num" style={{ fontSize: 11, color: cssVar("severity-high"), marginTop: 2 }}>
            +{m.returnsRateDeltaPp.toFixed(1)} pp vs prior
          </div>
        </div>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: cssVar("text-muted") }}>
            Reverse logistics
          </div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, color: cssVar("text-primary"), marginTop: 4 }}>
            {m.reverseLogisticsCostInr}
          </div>
          <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 2 }}>Cost load</div>
        </div>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: cssVar("text-muted") }}>
            Lost GMV
          </div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, color: cssVar("text-primary"), marginTop: 4 }}>
            {m.lostGmvInr}
          </div>
          <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 2 }}>Forgone sales</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
          CM ladder compression
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {m.cmLadder.map((step) => (
            <div
              key={step.id}
              style={{
                padding: "10px 12px",
                borderRadius: radius.md,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                borderTop: `2px solid ${step.deltaBps < -100 ? cssVar("severity-high") : cssVar("severity-med")}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary") }}>{step.label}</div>
              <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 2, lineHeight: 1.3 }}>{step.definition}</div>
              <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("text-primary"), marginTop: 6 }}>
                {step.ratePct.toFixed(1)}%
              </div>
              <div className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: cssVar("severity-high"), marginTop: 2 }}>
                {step.deltaBps} bps
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{m.compressionNote}</p>

      <div
        style={{
          padding: "8px 10px",
          borderRadius: radius.sm,
          background: `${cssVar("accent")}10`,
          border: `1px solid ${cssVar("accent")}33`,
          fontSize: 11,
          color: cssVar("text-secondary"),
          lineHeight: 1.4,
        }}
      >
        <strong style={{ color: cssVar("text-primary") }}>Evidence (global):</strong> {CX_MARGIN_GLOBAL_EVIDENCE.returnsToMargin}{" "}
        {CX_MARGIN_GLOBAL_EVIDENCE.returnCostShare}
        <div style={{ marginTop: 4, color: cssVar("text-muted") }}>{CX_MARGIN_GLOBAL_EVIDENCE.inrNote}</div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("accent-2"), lineHeight: 1.35 }}>{m.nextAction}</div>
    </section>
  );
}
