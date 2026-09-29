"use client";

import { ChartNoAxesColumnIncreasing, TrendingUp } from "lucide-react";
import { SeverityChip } from "./SeverityChip";
import { DomainChip } from "./DomainChip";
import { useLabel } from "../shell/DemoProvider";

type SeverityStripProps = {
  severity: {
    class: "S1" | "S2" | "S3" | "S4";
    domain: "Quality" | "Channel" | "Separation" | "Supply" | "Safety/Cyber";
    type: "Cliff" | "Slope";
    blastRadius: string;
    incident: "On" | "Off";
    escalationRule?: string;
  };
  variant?: "full" | "compact";
};

export function SeverityStrip({ severity, variant = "full" }: SeverityStripProps) {
  const L = useLabel();

  if (variant === "compact") {
    return (
      <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.6 }}>
        <SeverityChip cls={severity.class} compact /> · {severity.type} ·{" "}
        {L(severity.blastRadius)} · Incident {severity.incident.toLowerCase()}
      </div>
    );
  }

  const TypeIcon = severity.type === "Cliff" ? ChartNoAxesColumnIncreasing : TrendingUp;

  return (
    <div
      style={{
        background: "#131313",
        border: "1px solid #1f1f1f",
        borderRadius: 12,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Main row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Severity + Domain */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SeverityChip cls={severity.class} />
          <DomainChip domain={severity.domain} />
        </div>

        <div style={{ width: 1, height: 24, background: "#2a2a2a" }} />

        {/* Type */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#a3a3a3",
              textTransform: "uppercase",
            }}
          >
            TYPE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
            <TypeIcon size={16} />
            {severity.type} — {severity.type === "Cliff" ? "step at release" : "ramp"}
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: "#2a2a2a" }} />

        {/* Blast Radius */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#a3a3a3",
              textTransform: "uppercase",
            }}
          >
            BLAST RADIUS
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
            {L(severity.blastRadius)}
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: "#2a2a2a" }} />

        {/* Incident */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#a3a3a3",
              textTransform: "uppercase",
            }}
          >
            INCIDENT
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700 }}>
            {severity.incident === "Off" ? (
              <>
                <span style={{ fontSize: 18, color: "#a3a3a3" }}>○</span>
                <span style={{ color: "#a3a3a3" }}>Off</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 18, color: "#ef4444" }}>●</span>
                <span style={{ color: "#f87171" }}>On</span>
              </>
            )}
            <span style={{ fontSize: 13, fontWeight: 400, color: "#a3a3a3" }}>
              — {severity.incident === "Off" ? "no fire event, injury or dispatch mentioned" : "fire event detected"}
            </span>
          </div>
        </div>
      </div>

      {/* Escalation rule */}
      {severity.escalationRule ? (
        <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.5 }}>
          {L(severity.escalationRule)}
        </div>
      ) : null}
    </div>
  );
}
