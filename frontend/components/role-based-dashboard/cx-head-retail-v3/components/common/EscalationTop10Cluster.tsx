"use client";

import React from "react";
import {
  ESCALATION_TOP10_CLUSTERS,
  type EscalationClusterItem,
  type EscalationSourceLaneId,
} from "../../lib/cxHeadRetailV3EscalationData";
import { ConfidenceBand } from "./ConfidenceBand";
import { cssVar, radius, space } from "../../theme/tokens";

function laneLabel(id: EscalationSourceLaneId): string {
  switch (id) {
    case "social":
      return "Social";
    case "ceo-office":
      return "CEO-office";
    case "internal-helpdesk":
      return "Helpdesk";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function ClusterRow({ item }: { item: EscalationClusterItem }): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "36px minmax(0, 1.6fr) 88px minmax(100px, 0.9fr) 72px minmax(0, 1.2fr)",
        gap: 10,
        alignItems: "center",
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
      }}
    >
      <span className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: cssVar("text-muted") }}>
        #{item.rank}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3 }}>
          {item.problem}
        </div>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 3 }}>
          {item.channels.join(" · ")} — per-channel, not merged
        </div>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          color: cssVar("accent-2"),
          background: cssVar("accent-soft"),
          borderRadius: radius.pill,
          padding: "3px 8px",
          width: "fit-content",
        }}
      >
        {laneLabel(item.sourceLane)}
      </span>
      <div>
        <div className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("text-primary") }}>
          {item.shoppers.toLocaleString("en-IN")}
        </div>
        <div style={{ fontSize: 9, color: cssVar("text-muted") }}>shoppers</div>
      </div>
      <div className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: cssVar("severity-high") }}>
        {item.gmvExposed}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: cssVar("accent-2"), lineHeight: 1.35 }}>
          {item.steerCoAsk}
        </div>
        <div style={{ marginTop: 4 }}>
          <ConfidenceBand band={item.confidence} />
        </div>
      </div>
    </div>
  );
}

/** Top escalation clusters as SteerCo problem statements. */
export function EscalationTop10Cluster(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: space["3"] }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
          Top 10 escalation clusters — SteerCo
        </h3>
        <p style={{ margin: `${space["1"]} 0 0`, fontSize: 12, color: cssVar("text-muted"), lineHeight: 1.4 }}>
          Problem statements for decision — not a merged virality score. Channel list stays explicit on each row.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px minmax(0, 1.6fr) 88px minmax(100px, 0.9fr) 72px minmax(0, 1.2fr)",
          gap: 10,
          padding: "0 12px 6px",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        <span>#</span>
        <span>Problem</span>
        <span>Lane</span>
        <span>Shoppers</span>
        <span>GMV</span>
        <span>SteerCo ask</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ESCALATION_TOP10_CLUSTERS.map((item) => (
          <ClusterRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
