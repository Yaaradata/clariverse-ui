"use client";

import React from "react";
import { cssVar, radius } from "../../theme/tokens";

export function MetricRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}): React.ReactElement {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 8, alignItems: "start" }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: cssVar("text-muted"),
          letterSpacing: 0.45,
          textTransform: "uppercase",
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: valueColor ?? cssVar("text-primary"), lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  );
}

export function SeverityPill({ severity }: { severity: "Critical" | "Rising" | "Stable" }): React.ReactElement {
  const color =
    severity === "Critical"
      ? cssVar("severity-high")
      : severity === "Rising"
        ? cssVar("severity-med")
        : cssVar("positive");
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color,
        padding: "3px 8px",
        borderRadius: radius.pill,
        border: `1px solid ${color}55`,
        background: `${color}18`,
      }}
    >
      {severity}
    </span>
  );
}

export function DetailSection({
  title,
  subtitle,
  children,
  premium = false,
  fill = false,
  trailing,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  premium?: boolean;
  fill?: boolean;
  trailing?: React.ReactNode;
}): React.ReactElement {
  return (
    <section
      style={{
        background: premium
          ? `linear-gradient(165deg, ${cssVar("surface")} 0%, ${cssVar("surface-raised")} 100%)`
          : cssVar("surface"),
        border: `1px solid ${premium ? `${cssVar("border-strong")}` : cssVar("border")}`,
        borderRadius: radius.lg,
        padding: premium ? "20px 22px" : "16px 18px",
        boxShadow: premium ? "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px rgba(0,0,0,0.22)" : undefined,
        ...(fill ? { height: "100%", display: "flex", flexDirection: "column" } : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: premium ? 16 : 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: premium ? 14 : 13,
              fontWeight: 700,
              color: cssVar("text-primary"),
              letterSpacing: premium ? 0.15 : 0.2,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
          {subtitle ? (
            <p style={{ margin: premium ? "6px 0 0" : "4px 0 0", fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {trailing ? <div style={{ flexShrink: 0 }}>{trailing}</div> : null}
      </div>
      {fill ? <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>{children}</div> : children}
    </section>
  );
}

export function DetailTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}): React.ReactElement {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: cssVar("text-muted"),
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  borderBottom: `1px solid ${cssVar("border")}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, ci) => (
                <td
                  key={`${row[0]}-${ci}`}
                  style={{
                    padding: "10px",
                    color: ci === 0 ? cssVar("text-primary") : cssVar("text-secondary"),
                    fontWeight: ci === 0 ? 600 : 500,
                    borderBottom: `1px solid ${cssVar("border")}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function JourneyBreakRow({
  step,
  status,
}: {
  step: string;
  status: "breaking" | "watch" | "ok";
}): React.ReactElement {
  const color =
    status === "breaking"
      ? cssVar("severity-high")
      : status === "watch"
        ? cssVar("severity-med")
        : cssVar("positive");
  const label = status === "breaking" ? "Breaking" : status === "watch" ? "Watch" : "OK";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{step}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}
