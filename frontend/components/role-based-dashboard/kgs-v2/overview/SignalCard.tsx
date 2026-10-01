"use client";

import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import {
  K as Accent,
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

export type OverviewSignal = {
  id: string;
  title: string;
  severity: "S2" | "S3" | "S4" | "improving" | string;
  shape: "slope" | "cliff" | null;
  channel: string;
  topIssue: string;
  topIssueSub?: string;
  time: string;
  confidence: string;
  metrics: [SignalMetric, SignalMetric, SignalMetric];
  recommendation: string;
  owner: string;
  pnlTag: string;
  route?: string;
  hero?: boolean;
};

type UrgencyKey = keyof typeof URGENCY;

function urgencyKey(severity: string): UrgencyKey {
  if (severity === "S2") return "critical";
  if (severity === "S4" || severity === "improving") return "watch";
  return "high";
}

function chromeFor(severity: string) {
  const key = urgencyKey(severity);
  const base = URGENCY[key];
  if (severity === "improving") {
    return {
      ...base,
      color: Accent.green,
      glyph: "●",
      word: "IMPROVING",
      showSeverityClass: false,
      glow: false,
      calloutText: "#dcfce7",
      delta: Accent.green,
    };
  }
  return base;
}

/**
 * This week's signals — Field Signal Monitor / SignalMonitorCard anatomy.
 */
export function SignalCard({ signal }: { signal: OverviewSignal }) {
  const L = useLabel2();
  const K = useV2K();
  const { state } = useDemo2();
  const u = chromeFor(signal.severity);
  const tone = u.color;
  const light = state.theme === "light";
  const approvedTs = state.approvals[signal.id]?.ts;
  const cardTip = `Owner: ${signal.owner} · P&L: ${L(signal.pnlTag)}`;
  const pillLabel = u.showSeverityClass
    ? `${u.word} · ${signal.severity}`
    : u.word;
  const metricBg = light ? K.cardInner : "rgba(0,0,0,0.25)";
  const calloutBg = light
    ? withAlpha(tone, 0.12)
    : withAlpha(tone, u.calloutBgA);
  const calloutFg = light ? K.textSec : u.calloutText;

  return (
    <article
      title={cardTip}
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
          {L(signal.title)}
        </div>
        <span
          title={`Confidence ${signal.confidence}`}
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
        <Row label="Channel" value={L(signal.channel)} textColor={K.text} />
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Top Issue
          </span>
          <span style={{ color: K.text, textAlign: "right" }}>
            {L(signal.topIssue)}
          </span>
        </div>
        <Row label="Time" value={L(signal.time)} textColor={K.text} />
      </div>

      <div
        style={{
          marginTop: 14,
          minHeight: 108,
          borderRadius: 12,
          border: `1px solid ${K.borderLight}`,
          background: metricBg,
          padding: 10,
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          flex: 1,
        }}
      >
        {signal.metrics.map((m) => {
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
          border: `1px solid ${withAlpha(tone, light ? 0.45 : u.calloutBorderA)}`,
          background: calloutBg,
          padding: 16,
          fontSize: 12,
          lineHeight: 1.75,
          color: calloutFg,
          fontWeight: light ? 500 : 400,
        }}
      >
        ✨ {L(signal.recommendation)}
      </div>
    </article>
  );
}

function Row({
  label,
  value,
  textColor,
}: {
  label: string;
  value: string;
  textColor: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      <span style={{ color: textColor, textAlign: "right" }}>{value}</span>
    </div>
  );
}
