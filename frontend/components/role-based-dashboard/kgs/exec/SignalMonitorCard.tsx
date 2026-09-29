"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type SignalMonitorCardProps = {
  rank: string;
  title: string;
  severity: ReactNode;
  domain: ReactNode;
  sources: string;
  cohort: string;
  window: string;
  owner: string;
  metrics: Array<{ label: string; value: string; change?: string }>;
  severityCompact: string;
  confidenceShort: string;
  pnlShort: string;
  joinTags: string[];
  gateChip: ReactNode;
  suggestion: string;
  linkTo: string;
  microStrip?: ReactNode;
};

export function SignalMonitorCard({
  rank,
  title,
  severity,
  domain,
  sources,
  cohort,
  window,
  owner,
  metrics,
  severityCompact,
  confidenceShort,
  pnlShort,
  joinTags,
  gateChip,
  suggestion,
  linkTo,
  microStrip,
}: SignalMonitorCardProps) {
  return (
    <div
      style={{
        minWidth: 240,
        flex: "1 1 0",
        background: "linear-gradient(135deg, #1a1000 0%, #0d0d0d 100%)",
        border: "1px solid #f59e0b80",
        borderRadius: 16,
        padding: "18px 16px 16px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 24px rgba(245, 158, 11, 0.14)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.05em" }}>
          {rank}
        </div>
        <div style={{ display: "flex", gap: 6 }}>{severity}{domain}</div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: 14 }}>
        {title}
      </div>

      {/* Meta rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14, fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#939394" }}>SOURCES</span>
          <span style={{ color: "#e8e9e9", fontFamily: "var(--mono, monospace)" }}>{sources}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#939394" }}>COHORT</span>
          <span style={{ color: "#e8e9e9" }}>{cohort}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#939394" }}>WINDOW</span>
          <span style={{ color: "#e8e9e9" }}>{window}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#939394" }}>OWNER</span>
          <span style={{ color: "#e8e9e9" }}>{owner}</span>
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          background: "#131313",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: "12px 13px",
          marginBottom: 14,
        }}
      >
        {metrics.map((metric, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: idx < metrics.length - 1 ? 8 : 0 }}>
            <span style={{ fontSize: 12, color: "#939394" }}>{metric.label}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", fontFamily: "var(--mono, monospace)" }}>
                {metric.value}
              </div>
              {metric.change ? (
                <div style={{ fontSize: 11, color: "#fca5a5", fontFamily: "var(--mono, monospace)" }}>
                  {metric.change}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {microStrip ? <div style={{ marginBottom: 12 }}>{microStrip}</div> : null}

      {/* Compact severity, confidence, P&L */}
      <div style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 8 }}>{severityCompact}</div>
      <div style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 8 }}>{confidenceShort}</div>
      <div style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 12 }}>{pnlShort}</div>

      {/* Join tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#939394", fontWeight: 700, letterSpacing: "0.05em" }}>
          JOINED ON
        </span>
        {joinTags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: 6,
              background: "#2a2a2a",
              color: "#a3a3a3",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Gate chip */}
      <div style={{ marginBottom: 12 }}>{gateChip}</div>

      {/* Suggestion */}
      <div
        style={{
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.05em", marginBottom: 6 }}>
          LiSN SUGGESTS · OWNER DECIDES
        </div>
        <div style={{ fontSize: 12, color: "#e8e9e9", lineHeight: 1.5 }}>{suggestion}</div>
      </div>

      {/* Footer link */}
      <Link
        href={linkTo}
        style={{
          fontSize: 13,
          color: "#a78bfa",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Open signal →
      </Link>
    </div>
  );
}
