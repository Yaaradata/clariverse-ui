"use client";

import Link from "next/link";
import { SeverityChip } from "../shared/SeverityChip";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { RoutedOwner } from "../shared/RoutedOwner";
import { useLabel } from "../shell/DemoProvider";

type EvidenceReadinessTileProps = {
  severity: "S4";
  chip: string;
  title: string;
  body: string;
  label: string;
  confidence: {
    level: "M";
    value: number;
    known: number;
    inferred: number;
  };
  owner: string;
  cc: string;
  linkTo: string;
};

export function EvidenceReadinessTile({
  severity,
  chip,
  title,
  body,
  label,
  confidence,
  owner,
  cc,
  linkTo,
}: EvidenceReadinessTileProps) {
  const L = useLabel();

  return (
    <Link
      id="evidence-readiness"
      href={linkTo}
      style={{
        scrollMarginTop: 80,
        gridColumn: "span 5",
        textDecoration: "none",
        display: "block",
        background: "#0d0d0d",
        border: "1px solid #3f3f46",
        borderRadius: 16,
        padding: "20px 18px",
        transition: "transform 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#52525b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#3f3f46";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <SeverityChip cls={severity} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "4px 8px",
            borderRadius: 6,
            background: "#a78bfa20",
            border: "1px solid #a78bfa50",
            color: "#a78bfa",
          }}
        >
          {chip}
        </span>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
        {L(title)}
      </h3>

      <div style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.6, marginBottom: 16 }}>
        {L(body)}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#a3a3a3",
          fontStyle: "italic",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        {L(label)}
      </div>

      <div style={{ marginBottom: 16 }}>
        <ConfidenceMarker
          level={confidence.level}
          value={confidence.value}
          known={confidence.known}
          inferred={confidence.inferred}
          compact
        />
      </div>

      <RoutedOwner owner={owner} cc={cc} />
    </Link>
  );
}
