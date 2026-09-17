"use client";

/**
 * HDFC Head of CX — AI Risk Signal Monitor
 * Today's-Signal-Monitor card template; India / RBI signals only.
 * Route: /role-based/hdfc/head_of_cx
 */
import {
  HDFC_RISK_SIGNALS,
  type HdfcSignalSeverity,
} from "@/lib/role-based-dashboard/hdfc/hdfcRiskSignalMonitorData";

const GOLD = "#eab308";
const MUTED = "#8c8c95";
const TEXT = "#f5f5f5";
const INSET = "#191919";
const INNER = "#333333";
const CARD_BG = "#121212";
const MONO = "var(--mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)";

const SEV: Record<
  HdfcSignalSeverity,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    edge: string;
    glow: string;
  }
> = {
  critical: {
    label: "Critical",
    color: "#ff5050",
    bg: "#5a1f1f",
    border: "#9d3030",
    edge: "#8a2b2b",
    glow: "0 0 18px rgba(223, 22, 22, 0.35)",
  },
  high: {
    label: "High",
    color: "#f59e0b",
    bg: "#3a2e0b",
    border: "#765c12",
    edge: "#9a6b12",
    glow: "0 0 16px rgba(245, 158, 11, 0.28)",
  },
  watch: {
    label: "Watch",
    color: GOLD,
    bg: "#3a3208",
    border: "#766012",
    edge: "#8a7010",
    glow: "0 0 14px rgba(234, 179, 8, 0.25)",
  },
};

const SIGNAL_COUNT = HDFC_RISK_SIGNALS.length;
const ROUTED_COUNT = HDFC_RISK_SIGNALS.filter((s) => s.severity !== "watch").length;
const WATCH_COUNT = HDFC_RISK_SIGNALS.filter((s) => s.severity === "watch").length;

export default function HdfcAiRiskSignalMonitor() {
  return (
    <div style={{ marginTop: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            color: GOLD,
            fontSize: 13,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          AI Risk Signal Monitor
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            border: `1px solid ${INNER}`,
            background: INSET,
            color: MUTED,
            borderRadius: 999,
            padding: "6px 12px",
          }}
        >
          {SIGNAL_COUNT} signals · {ROUTED_COUNT} routed · {WATCH_COUNT} watch
        </span>
        <span style={{ fontSize: 10, color: "#6b6b73", letterSpacing: ".04em" }}>
          scroll for all →
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 14,
          alignItems: "stretch",
        }}
      >
        {HDFC_RISK_SIGNALS.map((signal) => {
          const sv = SEV[signal.severity];
          return (
            <div
              key={signal.id}
              style={{
                flex: "0 0 380px",
                width: 380,
                minHeight: 452,
                background: CARD_BG,
                border: `1px solid ${sv.edge}`,
                borderLeft: `3px solid ${sv.edge}`,
                boxShadow: sv.glow,
                borderRadius: 14,
                padding: "16px 16px 14px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 10,
                  minHeight: 40,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.25,
                    fontWeight: 900,
                    color: TEXT,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {signal.title}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    fontWeight: 900,
                    borderRadius: 999,
                    padding: "5px 10px",
                    whiteSpace: "nowrap",
                    color: sv.color,
                    background: sv.bg,
                    border: `1px solid ${sv.border}`,
                    flexShrink: 0,
                  }}
                >
                  {sv.label}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 10,
                  alignItems: "center",
                  minHeight: 24,
                  flexShrink: 0,
                }}
              >
                {signal.feeds.map((feed, i) => (
                  <span
                    key={feed}
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 999,
                      color: i === 0 ? MUTED : GOLD,
                      background: i === 0 ? INSET : `${GOLD}14`,
                      border: `1px solid ${i === 0 ? INNER : `${GOLD}40`}`,
                    }}
                  >
                    {feed}
                  </span>
                ))}
              </div>

              <div style={{ flexShrink: 0, marginBottom: 10 }}>
                {(
                  [
                    ["Cohort", signal.cohort],
                    ["Time", signal.time],
                  ] as const
                ).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "76px 1fr",
                      gap: 10,
                      marginBottom: 6,
                      fontSize: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        color: MUTED,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        fontWeight: 900,
                        fontSize: 10,
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        textAlign: "right",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: INSET,
                  border: `1px solid ${INNER}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  boxSizing: "border-box",
                  flex: 1,
                  minHeight: 124,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 9,
                }}
              >
                {signal.metrics.map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.25fr 1fr",
                      gap: 10,
                      fontSize: 12,
                      color: "#bfbfc6",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ lineHeight: 1.3 }}>{k}</span>
                    <b
                      style={{
                        textAlign: "right",
                        color: "#fff",
                        fontFamily: MONO,
                        lineHeight: 1.3,
                        fontWeight: 800,
                      }}
                    >
                      {v}
                    </b>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 12,
                  background: "#2d2414",
                  border: "1px solid #5a4314",
                  borderRadius: 9,
                  padding: "11px 13px",
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: "#fff",
                  fontWeight: 700,
                  minHeight: 92,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <span>✨ {signal.insight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
