"use client";

import React from "react";
import { STATUTORY_QUEUE, type StatutoryQueueItem } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

function urgencyColor(urgency: StatutoryQueueItem["urgency"]): string {
  if (urgency === "critical") return cssVar("severity-high");
  if (urgency === "high") return cssVar("severity-med");
  return cssVar("text-muted");
}

export function StatutoryQueue({
  onSelect,
}: {
  onSelect: (item: StatutoryQueueItem) => void;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        height: "100%",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), marginBottom: 8 }}>
        Statutory queue · {STATUTORY_QUEUE.length}
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
              padding: "8px 2px",
              border: "none",
              borderBottom: index < STATUTORY_QUEUE.length - 1 ? `1px solid ${cssVar("border")}` : "none",
              background: "transparent",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "minmax(100px, 0.9fr) 1fr auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              className="lisn-num"
              style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(row.urgency) }}
            >
              {row.countdown}
            </div>
            <div style={{ fontSize: 11, color: cssVar("text-secondary"), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              &quot;{row.keyword}&quot;
            </div>
            <div className="lisn-num" style={{ fontSize: 10, color: cssVar("text-muted") }}>
              {row.touches}×
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
