"use client";

import React from "react";
import { SUPPRESSION_EVIDENCE } from "../../lib/cxHeadRetailData";
import { MiniSparkline } from "../common/MiniSparkline";
import { cssVar, radius } from "../../theme/tokens";

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
        padding: 12,
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("severity-high")}44`,
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>
          Suppression watchdog
        </div>
        <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("severity-high"), marginTop: 4 }}>
          Tickets {e.ticketDropPct}
        </div>
        <MiniSparkline data={ticketSeries} color={cssVar("severity-high")} height={32} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: cssVar("text-muted") }}>Contact / order</div>
        <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("text-primary"), marginTop: 4 }}>
          {e.contactPerOrderLabel}
        </div>
        <MiniSparkline data={cpoSeries} color={cssVar("accent")} height={32} />
      </div>
      <button
        type="button"
        onClick={onOpenDrill}
        style={{
          padding: "8px 12px",
          borderRadius: radius.sm,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
          color: cssVar("accent"),
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Drill →
      </button>
    </div>
  );
}
