"use client";

import React, { useState } from "react";
import {
  PERFECT_ORDER_FACTORS,
  PERFECT_ORDER_NEXT_ACTION,
  PERFECT_ORDER_RATE,
  PERFECT_ORDER_VERTICALS,
  type PerfectOrderVertical,
} from "../../lib/cxHeadRetailV3LifecycleMatrixData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** Perfect Order Rate — anchored on the 4-factor industry standard. */
export function PerfectOrderCard(): React.ReactElement {
  const [vertical, setVertical] = useState<PerfectOrderVertical>("electronics");
  const config = PERFECT_ORDER_VERTICALS.find((v) => v.id === vertical) ?? PERFECT_ORDER_VERTICALS[1];

  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>
          Is Perfect Order holding?
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
          Anchored on the 4-factor standard (on-time × complete × damage-free × accurate-docs). Discovery /
          checkout are our extension beyond that core.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
          {PERFECT_ORDER_RATE}%
        </span>
        <span style={{ fontSize: 11, color: cssVar("text-muted") }}>POR · composite</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {PERFECT_ORDER_FACTORS.map((f) => {
          const gap = f.target - f.rate;
          const tone = gap <= 1 ? cssVar("positive") : gap <= 3 ? cssVar("severity-med") : cssVar("severity-high");
          return (
            <div
              key={f.id}
              style={{
                padding: "7px 8px",
                borderRadius: radius.sm,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>
                {f.label}
              </div>
              <div className="lisn-num" style={{ fontSize: 15, fontWeight: 800, color: tone, marginTop: 2 }}>
                {f.rate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 9, color: cssVar("text-muted") }}>target {f.target}%</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {PERFECT_ORDER_VERTICALS.map((v) => {
          const active = v.id === vertical;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVertical(v.id)}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: radius.pill,
                border: active ? `1px solid ${cssVar("accent")}` : `1px solid ${cssVar("border")}`,
                background: active ? cssVar("accent-soft") : cssVar("surface-raised"),
                color: active ? cssVar("accent-2") : cssVar("text-muted"),
                cursor: "pointer",
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: "8px 10px",
          borderRadius: radius.sm,
          border: `1px dashed ${cssVar("border")}`,
          fontSize: 11,
          color: cssVar("text-secondary"),
          lineHeight: 1.4,
        }}
      >
        <strong style={{ color: cssVar("text-primary") }}>{config.label} failure criteria:</strong>{" "}
        {config.failureCriteria}
        <div style={{ marginTop: 4, fontSize: 10, color: cssVar("text-muted") }}>{config.extensionNote}</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          Damage-free is the binding constraint this week — on-time alone would read healthy.
        </span>
      </div>
      <ConfidenceBand band="Med-High" />
      <DraftActionFooter draftText={PERFECT_ORDER_NEXT_ACTION} draftKind="route" />
    </div>
  );
}
