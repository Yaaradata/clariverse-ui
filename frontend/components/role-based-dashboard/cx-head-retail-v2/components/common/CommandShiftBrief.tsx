import React from "react";
import { cssVar, radius, type } from "../../theme/tokens";

export type ShiftBriefKpi = {
  label: string;
  value: string;
  delta: string;
  tone: "warn" | "down" | "up" | "flat";
};

function kpiToneColor(tone: ShiftBriefKpi["tone"]): string {
  if (tone === "warn" || tone === "down") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

/** Unified shift brief — triad and KPI strip in one surface. */
export function CommandShiftBrief({
  critical,
  focus,
  stable,
  kpis,
}: {
  critical: string;
  focus: string;
  stable: string;
  kpis: ShiftBriefKpi[];
}): React.ReactElement {
  const triad = [
    { label: "Critical", value: critical, color: cssVar("severity-high") },
    { label: "Focus", value: focus, color: cssVar("severity-med") },
    { label: "Stable", value: stable, color: cssVar("positive") },
  ];

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div style={{ padding: "12px 16px", borderRight: `1px solid ${cssVar("border")}` }}>
          {triad.map((row, index) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "6px 0",
                borderLeft: `3px solid ${row.color}`,
                paddingLeft: 10,
                marginBottom: index < triad.length - 1 ? 4 : 0,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: row.color,
                  flexShrink: 0,
                  minWidth: 52,
                }}
              >
                {row.label}
              </span>
              <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignContent: "stretch",
          }}
        >
          {kpis.map((k, index) => (
            <div
              key={k.label}
              style={{
                padding: "10px 14px",
                borderRight: index % 2 === 0 ? `1px solid ${cssVar("border")}` : undefined,
                borderBottom: index < 2 ? `1px solid ${cssVar("border")}` : undefined,
              }}
            >
              <div style={{ fontSize: 10, color: cssVar("text-muted"), fontWeight: 600 }}>{k.label}</div>
              <div
                className="lisn-num"
                style={{
                  fontSize: 14,
                  fontWeight: type.weight.bold,
                  color: cssVar("text-primary"),
                  marginTop: 4,
                  lineHeight: 1.35,
                }}
              >
                {k.value}{" "}
                <span style={{ fontSize: 11, fontWeight: 600, color: kpiToneColor(k.tone) }}>({k.delta})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
