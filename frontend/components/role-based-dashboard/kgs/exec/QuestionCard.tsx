"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type QuestionCardProps = {
  icon: ReactNode;
  title: string;
  caption: string;
  count: string;
  countLabel: string;
  delta: string;
  deltaLabel: string;
  fourWeekLabel: string;
  severityMix: string;
  linkTo: string;
  borderColor: string;
  glowColor: string;
  children: ReactNode;
};

export function QuestionCard({
  icon,
  title,
  caption,
  count,
  countLabel,
  delta,
  deltaLabel,
  fourWeekLabel,
  severityMix,
  linkTo,
  borderColor,
  glowColor,
  children,
}: QuestionCardProps) {
  const isAmber = deltaLabel.startsWith("+");

  return (
    <Link
      href={linkTo}
      style={{
        textDecoration: "none",
        display: "block",
        background: "#0d0d0d",
        border: `2px solid ${borderColor}`,
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: glowColor,
        transition: "transform 0.15s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${borderColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 12, color: "#939394" }}>{caption}</div>
          </div>
        </div>
        <ChevronRight size={20} color="#939394" style={{ flexShrink: 0, marginTop: 8 }} />
      </div>

      {/* Score Delta */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "var(--mono, monospace)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {count}
        </div>
        <div style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 6 }}>{countLabel}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--mono, monospace)",
              color: isAmber ? "#f59e0b" : "#a3a3a3",
              padding: "2px 8px",
              borderRadius: 6,
              background: isAmber ? "#f59e0b20" : "#2a2a2a",
            }}
          >
            {delta}
          </span>
          <span style={{ fontSize: 13, color: "#939394" }}>{deltaLabel}</span>
        </div>
        <div style={{ fontSize: 11, color: "#737373" }}>{fourWeekLabel}</div>
        <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 6 }}>{severityMix}</div>
      </div>

      {/* Content slot (chart + gauges + insight) */}
      {children}
    </Link>
  );
}
