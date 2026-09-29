"use client";

import { Activity } from "lucide-react";
import { useLabel } from "../shell/DemoProvider";

type SectionHeaderProps = {
  icon?: typeof Activity;
  iconColor?: string;
  title: string;
  chip?: string;
  chipColor?: string;
  subtitle: string;
  suppressedNote?: string;
};

export function SectionHeader({
  icon: Icon,
  iconColor = "#f59e0b",
  title,
  chip,
  chipColor = "#a3a3a3",
  subtitle,
  suppressedNote,
}: SectionHeaderProps) {
  const L = useLabel();

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        {Icon ? <Icon size={20} color={iconColor} /> : null}
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {chip ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 999,
              background: chipColor === "#fbbf24" ? "rgba(245, 158, 11, 0.15)" : "#2a2a2a",
              border: `1px solid ${chipColor === "#fbbf24" ? "rgba(245, 158, 11, 0.5)" : "#3f3f46"}`,
              color: chipColor,
            }}
          >
            {chip}
          </span>
        ) : null}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#a3a3a3",
          lineHeight: 1.55,
          maxWidth: "80%",
        }}
      >
        {L(subtitle)}
      </div>
      {suppressedNote ? (
        <div
          style={{
            fontSize: 13,
            color: "#737373",
            fontStyle: "italic",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {L(suppressedNote)}
        </div>
      ) : null}
    </div>
  );
}
