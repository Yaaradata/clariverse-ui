"use client";

import React from "react";
import { SUPPRESSION_EVIDENCE } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { MiniSparkline } from "../common/MiniSparkline";
import { cssVar, radius } from "../../theme/tokens";

/** V3 restores V1 suppression watchdog alongside V2 wedge cards — inverse-anomaly guardrail. */
export function SuppressionWatchdogCard({
  onOpenDrill,
}: {
  onOpenDrill: () => void;
}): React.ReactElement {
  const e = SUPPRESSION_EVIDENCE;
  const ticketSeries = e.weeklySeries.map((p) => p.ticketVolume);
  const cpoSeries = e.weeklySeries.map((p) => p.contactPerOrder);

  return (
    <div
      style={{
        padding: 18,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("severity-high")}44`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>Suppression watchdog</div>
          <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 2 }}>
            Inverse anomaly · Electronics category
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: radius.pill,
            background: `${cssVar("severity-high")}18`,
            color: cssVar("severity-high"),
            textTransform: "uppercase",
            letterSpacing: 0.4,
            flexShrink: 0,
          }}
        >
          Warning, not a win
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div
            className="lisn-num"
            style={{ fontSize: 22, fontWeight: 800, color: cssVar("severity-high"), lineHeight: 1.1 }}
          >
            Tickets {e.ticketDropPct}
          </div>
          <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 4 }}>Raw ticket volume · 7-week window</div>
          <div style={{ marginTop: 8 }}>
            <MiniSparkline data={ticketSeries} color={cssVar("severity-high")} height={48} />
          </div>
        </div>
        <div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.1 }}>
            {e.contactPerOrderLabel}
          </div>
          <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 4 }}>Order-normalised — flat</div>
          <div style={{ marginTop: 8 }}>
            <MiniSparkline data={cpoSeries} color={cssVar("accent")} height={48} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "10px 12px",
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px dashed ${cssVar("severity-med")}66`,
          fontSize: 12,
          color: cssVar("text-secondary"),
        }}
      >
        <span style={{ fontWeight: 700, color: cssVar("severity-med") }}>{e.accessChange.label}</span>
        {" · "}
        {e.accessChange.detail}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{e.statusVerdict}</span>
      </div>
      <ConfidenceBand band="Med-High" />

      <button
        type="button"
        onClick={onOpenDrill}
        style={{
          padding: "8px 12px",
          borderRadius: radius.sm,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
          color: cssVar("accent"),
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
          alignSelf: "flex-start",
        }}
      >
        Open inverse-anomaly drill → falling line + normalised overlay
      </button>

      <DraftActionFooter draftText={e.draftAction} draftKind="route" />
    </div>
  );
}
