"use client";

import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import {
  K,
  URGENCY,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

export type SignalMetric = {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
  deltaTone?: "risk" | "opportunity";
};

/** Compact face matching v1 SignalMonitorCard / MonitorCardCompact. */
export type OverviewSignalCompact = {
  title: string;
  channel: string;
  topIssue: string;
  topIssueSub?: string;
  time: string;
  severityWord: string;
  metrics: [SignalMetric, SignalMetric, SignalMetric];
  callout: string;
};

export type OverviewSignal = {
  id: string;
  title: string;
  severity: string;
  severityType: string;
  owner: string;
  pnlTag: string;
  confidence: string;
  hero?: boolean;
  channelMix: Record<string, number>;
  topIntent: string;
  timeWindow: string;
  beforeAfter: { before: string; after: string };
  recommendation: string;
  compact: OverviewSignalCompact;
};

const SIGNAL_ROUTE: Record<string, V2View> = {
  "PR-01": "promiseHero",
  "PR-02": "promise",
  "RC-01": "recurringTheme",
  "RC-03": "recurring",
  "IN-01": "install",
};

function urgencyFor(severity: string): keyof typeof URGENCY {
  if (severity === "S2") return "critical";
  if (severity === "S4" || severity === "improving") return "watch";
  return "high";
}

/**
 * This week's signals card — v1 SignalMonitorCard anatomy.
 */
export function SignalCard({ signal }: { signal: OverviewSignal }) {
  const L = useLabel2();
  const { state, setView } = useDemo2();
  const c = signal.compact;
  const urgency = urgencyFor(signal.severity);
  const u = URGENCY[urgency];
  const tone = u.color;
  const approvedTs = state.approvals[signal.id]?.ts;
  const route = SIGNAL_ROUTE[signal.id] ?? "overview";
  const pillLabel = u.showSeverityClass
    ? `${u.word} · ${signal.severity}`
    : u.word;
  const confTip = `Confidence ${signal.confidence}`;

  return (
    <button
      type="button"
      onClick={() => setView(route)}
      className="kgs2-focus"
      style={{
        width: 252,
        minWidth: 252,
        maxWidth: 252,
        minHeight: 280,
        flex: "0 0 252px",
        borderRadius: 16,
        border: `1px solid ${withAlpha(tone, u.borderA)}`,
        background: withAlpha(tone, u.bgA),
        boxShadow: u.glow ? `0 10px 24px ${withAlpha(tone, u.glowA)}` : "none",
        color: K.textSec,
        padding: "14px 14px 16px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: K.text,
            lineHeight: 1.3,
            minWidth: 0,
          }}
        >
          {L(c.title)}
        </div>
        <span
          title={confTip}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 999,
            border: `1px solid ${withAlpha(tone, u.pillBorderA)}`,
            background: withAlpha(tone, u.pillBgA),
            color: `${tone}dd`,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden>{u.glyph}</span>
          <span>{pillLabel}</span>
        </span>
      </div>

      {approvedTs && signal.id === "PR-01" ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            color: K.green,
          }}
        >
          Action approved · {approvedTs}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <Row label="Channel" value={L(c.channel)} />
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Top Issue
          </span>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: K.text }}>{L(c.topIssue)}</div>
            {c.topIssueSub ? (
              <div style={{ fontSize: 10, color: K.textMut }}>
                {L(c.topIssueSub)}
              </div>
            ) : null}
          </div>
        </div>
        <Row label="Time" value={L(c.time)} />
      </div>

      <div
        style={{
          marginTop: 14,
          minHeight: 108,
          borderRadius: 12,
          border: `1px solid ${K.borderLight}`,
          background: "rgba(0,0,0,0.25)",
          padding: 10,
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          flex: 1,
        }}
      >
        {c.metrics.map((m) => {
          const deltaColor = m.deltaTone === "opportunity" ? K.green : u.delta;
          return (
            <div
              key={m.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ color: K.textMut }}>{L(m.label)}</span>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: K.text,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {L(m.value)}
                </div>
                {m.delta ? (
                  <div
                    style={{
                      fontSize: 11,
                      color: deltaColor,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {L(m.delta)}
                  </div>
                ) : null}
                {m.sub ? (
                  <div
                    style={{
                      fontSize: 10,
                      color: K.textMut,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {L(m.sub)}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          borderRadius: 12,
          border: `1px solid ${withAlpha(tone, u.calloutBorderA)}`,
          background: withAlpha(tone, u.calloutBgA),
          padding: 16,
          fontSize: 12,
          lineHeight: 1.75,
          color: u.calloutText,
        }}
      >
        ✨ {L(c.callout)}
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      <span style={{ color: K.text, textAlign: "right" }}>{value}</span>
    </div>
  );
}
