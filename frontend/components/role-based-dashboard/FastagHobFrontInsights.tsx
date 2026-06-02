"use client";

import { Activity, Sparkles } from "lucide-react";
import type { FastagPalette } from "./FastagIntelligenceDashboard";

type FastagRiskSpike = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  channelMix: string[];
  topIntent: string;
  topIntentSub: string;
  time: string;
  metrics: { label: string; value: string; delta?: string }[];
  aiAction: string;
};

const FASTAG_RISK_SPIKES: FastagRiskSpike[] = [
  {
    id: "wallet-recharge-failure-surge",
    severity: "CRITICAL",
    title: "Wallet Recharge Failure Surge",
    channelMix: ["App", "UPI"],
    topIntent: "Recharge Failed",
    topIntentSub: "Critical impact · Churn risk",
    time: "Last 6h",
    metrics: [
      { label: "Failed recharges", value: "1.2K → 4.8K", delta: "↑ 289%" },
      { label: "Affected wallets", value: "980 → 3.4K", delta: "↑ 247%" },
      { label: "Success ratio", value: "94% → 78%", delta: "−16 pts" },
    ],
    aiAction:
      "Recharge failures concentrated on one UPI handle. Fail over to the backup payment gateway and proactively notify affected wallets today.",
  },
  {
    id: "double-deduction-nh48",
    severity: "CRITICAL",
    title: "Double-Deduction Cluster — NH-48",
    channelMix: ["Voice", "Tickets"],
    topIntent: "Duplicate Toll Charge",
    topIntentSub: "Critical impact · Refund escalation",
    time: "Last 4h",
    metrics: [
      { label: "Dispute intake", value: "34 → 89", delta: "↑ 162%" },
      { label: "Refund exposure", value: "₹21K → ₹47K", delta: "↑ 124%" },
      { label: "Plaza clusters", value: "3 plazas", delta: "NH-48" },
    ],
    aiAction:
      "Reader mis-read pattern at NH-48 plazas (single pass, double charge). Reconcile with the acquirer and auto-refund duplicate charges immediately.",
  },
  {
    id: "blacklist-complaint-trend",
    severity: "HIGH",
    title: "Blacklist Complaint Trending",
    channelMix: ["Social", "App"],
    topIntent: "Tag Blacklisted",
    topIntentSub: "High impact · Reputation risk",
    time: "Last 12h",
    metrics: [
      { label: "Mentions (48h)", value: "1,240 → 4,820", delta: "↑ 289%" },
      { label: "Top hashtag", value: "#FASTagFail", delta: "↑ 287%" },
      { label: "Estimated reach", value: "0.9M → 1.8M", delta: "↑ 100%" },
    ],
    aiAction:
      "Blacklist-on-low-balance narrative is going mainstream on X + Reddit. Publish an auto-recharge FAQ and align influencer comms within 24h.",
  },
  {
    id: "fleet-churn-signals",
    severity: "CRITICAL",
    title: "Fleet Account Churn Signals",
    channelMix: ["Voice", "Email"],
    topIntent: "Account Closure Inquiry",
    topIntentSub: "Critical impact · Retention window",
    time: "Last 72h",
    metrics: [
      { label: "Retention risk", value: "61% → 86%", delta: "↑ 25 pts" },
      { label: "Closure intents", value: "7 → 18", delta: "↑ 157%" },
      { label: "Spend at risk", value: "₹2.7M → ₹4.2M", delta: "↑ 56%" },
    ],
    aiAction:
      "Fleets cite competitor zero-fee recharge and reward erosion. Trigger KAM outreach within 2 hours with pre-approved fee-waiver offers.",
  },
  {
    id: "kyc-backlog",
    severity: "CRITICAL",
    title: "KYC / Re-KYC Verification Backlog",
    channelMix: ["App", "Email"],
    topIntent: "KYC Verification Stall",
    topIntentSub: "Critical impact · Backlog + activation",
    time: "Next 3 days",
    metrics: [
      { label: "At-risk tags", value: "2.7K → 4.3K", delta: "↑ 59%" },
      { label: "Vendor cases", value: "19 → 31", delta: "↑ 63%" },
      { label: "Exposure (est.)", value: "₹1.1L → ₹1.8L", delta: "↑ 61%" },
    ],
    aiAction:
      "Stalled KYC work is concentrated at BPO Vendor Beta. Surge in-house review on the oldest cases and reroute high-value activations off the vendor queue.",
  },
];

const HOB_AI_INSIGHTS = [
  { text: "↑ Spike in AVC mismatch complaints — up 42% vs last week", tone: "urgency" as const },
  { text: "Zone 4 partner issuance failure detected — 18 partners affected", tone: "amber" as const },
  { text: "Repeat callers up 31% for excess toll refund requests", tone: "accent" as const },
];

function severityTone(severity: FastagRiskSpike["severity"], ft: FastagPalette) {
  if (severity === "CRITICAL") return ft.red;
  if (severity === "HIGH") return ft.amber;
  return ft.accent;
}

function AiGeneratedMark({ ft, compact = false }: { ft: FastagPalette; compact?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: compact ? 9 : 10,
        fontWeight: 700,
        color: ft.primary,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <Sparkles size={compact ? 10 : 11} color={ft.primary} />
      {compact ? "AI" : "AI-generated"}
    </span>
  );
}

export function FastagRiskSpikeMonitor({ tokens: T }: { tokens: FastagPalette }) {
  const severityMeta: Record<string, { badge: string; icon: string }> = {
    CRITICAL: { badge: T.red, icon: "🔥" },
    HIGH: { badge: T.amber, icon: "⚠️" },
    MEDIUM: { badge: T.accent, icon: "•" },
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: T.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Activity size={16} color={T.amber} />
          <span>AI Risk Spike Monitor</span>
        </h2>
        <span
          style={{
            fontSize: 10,
            padding: "4px 8px",
            borderRadius: 999,
            background: `${T.red}20`,
            color: `${T.red}dd`,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Operational Alerts
        </span>
        <AiGeneratedMark ft={T} compact />
      </div>
      <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>
        Live detection of sudden sentiment, SLA, volume, and backlog shocks across voice, chat, social, and 1033.
      </p>
      <p style={{ margin: 0, fontSize: 11, color: T.textMut, fontStyle: "italic" }}>
        Drivers: recharge failures · double deductions · blacklist complaints · viral social cluster · KYC backlog
      </p>

      <div
        style={{
          display: "flex",
          width: "100%",
          minWidth: 0,
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          alignItems: "stretch",
        }}
      >
        {FASTAG_RISK_SPIKES.map((spike) => {
          const tone = severityTone(spike.severity, T);
          const sev = severityMeta[spike.severity] ?? severityMeta.MEDIUM;
          return (
            <div
              key={spike.id}
              style={{
                minWidth: 240,
                minHeight: 240,
                flex: "1 1 0",
                borderRadius: 16,
                border: `1px solid ${tone}88`,
                background: `${tone}0c`,
                boxShadow: `0 10px 24px ${tone}33`,
                color: T.textSec,
                padding: "14px 14px 16px",
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{spike.title}</div>
                <span
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
                    border: `1px solid ${sev.badge}66`,
                    background: `${sev.badge}22`,
                    color: `${sev.badge}dd`,
                    flexShrink: 0,
                  }}
                >
                  <span>{sev.icon}</span>
                  <span>{spike.severity}</span>
                </span>
              </div>

              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5, fontSize: 11, color: T.textMut }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Channel</span>
                  <span style={{ color: T.text, textAlign: "right" }}>{spike.channelMix.join(", ")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Top Intent</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: T.text }}>{spike.topIntent}</div>
                    <div style={{ fontSize: 10, color: T.textMut }}>{spike.topIntentSub}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Time</span>
                  <span style={{ color: T.text }}>{spike.time}</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  minHeight: 108,
                  borderRadius: 12,
                  border: `1px solid ${T.borderLight}`,
                  background: T.bg === "#f5f7fa" ? "rgba(26,26,46,0.04)" : "rgba(0,0,0,0.25)",
                  padding: 10,
                  fontSize: 11,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                {spike.metrics.map((m) => (
                  <div key={`${spike.id}-${m.label}`} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: T.textMut }}>{m.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.text, fontWeight: 700 }}>{m.value}</div>
                      {m.delta ? (
                        <div style={{ fontSize: 11, color: T.red, fontWeight: 700 }}>{m.delta}</div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 12,
                  borderRadius: 12,
                  border: `1px solid ${tone}55`,
                  background: `${tone}14`,
                  padding: "12px 14px",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: T.textSec,
                }}
              >
                <Sparkles size={12} color={tone} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                {spike.aiAction}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FastagAiInsightsSection({ tokens: T }: { tokens: FastagPalette }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>AI Insights</h2>
        <AiGeneratedMark ft={T} compact />
      </div>
      <div className="fastag-hob-ai-insights">
        <style>{`
          .fastag-hob-ai-insights {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
          @media (max-width: 900px) {
            .fastag-hob-ai-insights { grid-template-columns: 1fr; }
          }
        `}</style>
        {HOB_AI_INSIGHTS.map((insight) => {
          const accent = insight.tone === "urgency" ? T.urgency : insight.tone === "amber" ? T.amber : T.accent;
          return (
            <div
              key={insight.text}
              style={{
                background: T.elevated,
                border: `1px solid ${T.borderLight}`,
                borderLeft: `3px solid ${accent}`,
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                lineHeight: 1.5,
                color: T.textSec,
              }}
            >
              {insight.text}
            </div>
          );
        })}
      </div>
    </section>
  );
}
