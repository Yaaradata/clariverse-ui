"use client";

import React from "react";
import {
  ESCALATION_SLA_MODEL_NOTE,
  ESCALATION_SLA_TRIAD,
  type EscalationSlaMetric,
} from "../../lib/cxHeadRetailV3EscalationData";
import { cssVar, radius, space } from "../../theme/tokens";

function statusColor(status: EscalationSlaMetric["status"]): string {
  switch (status) {
    case "in":
      return cssVar("positive");
    case "watch":
      return cssVar("severity-med");
    case "breach":
      return cssVar("severity-high");
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function SlaTile({ metric }: { metric: EscalationSlaMetric }): React.ReactElement {
  const tone = statusColor(metric.status);
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${tone}`,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: cssVar("text-muted") }}>
        {metric.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
        <span className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: tone, lineHeight: 1 }}>
          {metric.value}
        </span>
        <span style={{ fontSize: 12, color: cssVar("text-muted") }}>{metric.unit}</span>
      </div>
      <div style={{ fontSize: 11, color: cssVar("text-secondary"), marginTop: 6 }}>
        Target {metric.target}
      </div>
      <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 4, lineHeight: 1.35 }}>{metric.note}</div>
    </div>
  );
}

/** Time-to-Detect · Resolve · Contain — our operational taxonomy. */
export function EscalationSlaTriad(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: space["3"] }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
          Escalation SLA triad
        </h3>
        <p style={{ margin: `${space["1"]} 0 0`, fontSize: 12, color: cssVar("text-muted"), lineHeight: 1.4 }}>
          {ESCALATION_SLA_MODEL_NOTE}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {ESCALATION_SLA_TRIAD.map((metric) => (
          <SlaTile key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
