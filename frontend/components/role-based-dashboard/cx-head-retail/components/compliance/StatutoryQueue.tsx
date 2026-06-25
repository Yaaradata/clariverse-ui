"use client";

import React from "react";
import { STATUTORY_QUEUE, type StatutoryQueueItem } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

function urgencyColor(urgency: StatutoryQueueItem["urgency"]): string {
  if (urgency === "critical") return cssVar("severity-high");
  if (urgency === "high") return cssVar("severity-med");
  return cssVar("text-muted");
}

/** T2-11 — re-ranked by clock proximity; regulation firm-level on the face. */
export function StatutoryQueue({
  onSelect,
}: {
  onSelect: (item: StatutoryQueueItem) => void;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>Statutory-clock queue</div>
        <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 2 }}>
          Re-ranked by clock proximity · {STATUTORY_QUEUE.length} grievances in window
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {STATUTORY_QUEUE.map((row, index) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelect(row)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "14px 4px",
              border: "none",
              borderBottom: index < STATUTORY_QUEUE.length - 1 ? `1px solid ${cssVar("border")}` : "none",
              background: "transparent",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "minmax(120px, 1fr) 1fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="lisn-num"
                style={{ fontSize: 13, fontWeight: 700, color: urgencyColor(row.urgency) }}
              >
                {row.countdown}
              </div>
              <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 4 }}>{row.regulation}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>
                Keyword: &quot;{row.keyword}&quot;
              </div>
              <div style={{ fontSize: 12, color: cssVar("text-secondary"), marginTop: 4 }}>{row.stallState}</div>
            </div>
            <div className="lisn-num" style={{ fontSize: 12, color: cssVar("text-muted"), textAlign: "right" }}>
              {row.touches} touches
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
