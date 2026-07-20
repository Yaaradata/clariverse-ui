"use client";

import React from "react";
import { Lock, Headphones, Share2 } from "lucide-react";
import {
  ESCALATION_SOURCE_LANES,
  type EscalationSourceLane,
  type EscalationSourceLaneId,
} from "../../lib/cxHeadRetailV3EscalationData";
import { cssVar, radius, space } from "../../theme/tokens";

function laneIcon(id: EscalationSourceLaneId): React.ReactElement {
  const size = 16;
  const color = cssVar("accent-2");
  switch (id) {
    case "social":
      return <Share2 size={size} color={color} aria-hidden />;
    case "ceo-office":
      return <Lock size={size} color={color} aria-hidden />;
    case "internal-helpdesk":
      return <Headphones size={size} color={color} aria-hidden />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function SourceLaneCard({ lane }: { lane: EscalationSourceLane }): React.ReactElement {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderTop: `2px solid ${cssVar("accent")}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.sm,
            background: cssVar("accent-soft"),
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {laneIcon(lane.id)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: cssVar("text-primary") }}>{lane.title}</div>
          <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 2, lineHeight: 1.35 }}>
            {lane.subtitle}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
          {lane.openCount}
        </span>
        <span style={{ fontSize: 11, color: cssVar("text-muted") }}>open</span>
      </div>

      {lane.socialChannels ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: cssVar("text-muted") }}>
            Per-channel virality — never merged
          </div>
          {lane.socialChannels.map((ch) => (
            <div
              key={ch.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto auto",
                gap: 8,
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: radius.sm,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>{ch.label}</span>
              <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: cssVar("accent-2") }} title="Virality index — this channel only">
                V {ch.viralityIndex}
              </span>
              <span className="lisn-num" style={{ fontSize: 11, color: cssVar("text-muted") }}>
                {ch.mentions.toLocaleString("en-IN")} · {ch.deltaPct > 0 ? "+" : ""}
                {ch.deltaPct}%
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {lane.note ? (
        <div style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{lane.note}</div>
      ) : null}

      <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: "auto" }}>Owner · {lane.owner}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("accent-2"), lineHeight: 1.35 }}>{lane.nextAction}</div>
    </div>
  );
}

/** Three explicit escalation source lanes — Social · CEO-office · Internal helpdesk. */
export function EscalationSourcePanel(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: space["3"] }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
          Where are escalations coming from?
        </h3>
        <p style={{ margin: `${space["1"]} 0 0`, fontSize: 12, color: cssVar("text-muted"), lineHeight: 1.4 }}>
          Three labelled lanes. Social virality is valid in retail — keep it per-channel.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, alignItems: "stretch" }}>
        {ESCALATION_SOURCE_LANES.map((lane) => (
          <SourceLaneCard key={lane.id} lane={lane} />
        ))}
      </div>
    </div>
  );
}
