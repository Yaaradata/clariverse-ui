"use client";

/**
 * Cards Portfolio Manager — ✨ AI Risk Spike Monitor (portfolio edition).
 *
 * Same lean structure as the CX AIRiskSpikeMonitor (title + severity badge,
 * three meta rows, a compact metrics box, one ✨ insight line) — but with
 * CARDS-PORTFOLIO data: decline / approval-rate / auth-liability / ombudsman /
 * roll-rate shocks. No urgency / sentiment / SLA / unresolved metrics.
 *
 * Each spike is joined to the voice corpus, so the cause + the owning exec sit
 * in the ✨ line. Cohort-level, consent-clean. Rendered on the cards_portfolio
 * Screen-1 overview (below the three lens tiles) via RoleBasedUnifiedScreen1Addon.
 */

const JH = {
  card: "#0d0d0d",
  inset: "#141414",
  border: "#1f1f1f",
  borderInner: "#2a2a2a",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#7e7f80",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  gold: "#eab308",
} as const;

type Severity = "critical" | "high" | "watch";
type DeltaIntent = "bad" | "good" | "neutral";

type Metric = { label: string; value?: string; delta?: string; intent?: DeltaIntent };

type CardsSpike = {
  id: string;
  title: string;
  severity: Severity;
  cohort: string;
  voiceSignal: string;
  timestamp: string;
  metrics: Metric[];
  insight: string;
};

const sevMeta: Record<Severity, { label: string; color: string; dot: string }> = {
  critical: { label: "Critical", color: JH.red, dot: "🔥" },
  high: { label: "High", color: JH.amber, dot: "⚠️" },
  watch: { label: "Watch", color: JH.gold, dot: "🔔" },
};

const intentColor: Record<DeltaIntent, string> = {
  bad: JH.red,
  good: JH.green,
  neutral: JH.muted,
};

export const cardsPortfolioRiskSpikes: CardsSpike[] = [
  {
    id: "cps-decline-hni",
    title: "Decline Spike",
    severity: "critical",
    cohort: "Premium HNI · CNP",
    voiceSignal: "Payment failed ×4",
    timestamp: "Since 11:00",
    metrics: [
      { label: "Decline Rate", value: "8% → 26%", delta: "+18 pts", intent: "bad" },
      { label: "Spend at Risk", value: "₹2.4 Cr", intent: "bad" },
      { label: "Curable Share", value: "62%", intent: "good" },
    ],
    insight: "CoFT re-tokenisation break — not behaviour. ₹2.4 Cr recoverable; route fix to Ops.",
  },
  {
    id: "cps-approval-r77",
    title: "Approval-Rate Drop",
    severity: "critical",
    cohort: "3+yr customers · POS+CNP",
    voiceSignal: "Card blocked ×3",
    timestamp: "Within 2h",
    metrics: [
      { label: "Approval Rate", value: "94% → 81%", delta: "−13 pts", intent: "bad" },
      { label: "Good-Cust Blocks", delta: "+210%", intent: "bad" },
      { label: "Switch-Intent", delta: "+180%", intent: "bad" },
    ],
    insight: "Fraud rule R-77 over-blocks good customers before the KPI moves. Recommend same-day rollback to Fraud.",
  },
  {
    id: "cps-auth-liability",
    title: "Auth-Liability Cluster",
    severity: "high",
    cohort: "Merchant path M-12 · CNP",
    voiceSignal: "No-OTP complaints ×31",
    timestamp: "Last 24h",
    metrics: [
      { label: "Weak-Auth Auths", value: "47", intent: "bad" },
      { label: "Issuer Exposure", value: "₹6–9 L", intent: "bad" },
      { label: "Liability", value: "full-comp", intent: "neutral" },
    ],
    insight: "Missing dynamic factor (Auth Directions 2025) — systemic gap. Route to Compliance.",
  },
  {
    id: "cps-ombudsman-clock",
    title: "Ombudsman Clock",
    severity: "high",
    cohort: "Co-brand X · queue Q-07",
    voiceSignal: "Incorrect late fee ×3",
    timestamp: "This week",
    metrics: [
      { label: "IO-Clock Cases", value: "4", delta: "< 30 days", intent: "bad" },
      { label: "Queue Rejection", value: "41%", delta: "vs 12%", intent: "bad" },
      { label: "Root Cause", value: "billing config", intent: "neutral" },
    ],
    insight: "Re-open the 4 cases before the 30-day IO window closes. Route to Conduct.",
  },
  {
    id: "cps-roll-rate",
    title: "Roll-Rate Inflection",
    severity: "watch",
    cohort: "Sourcing vintage Q2-24",
    voiceSignal: "Hardship voice ×1.9",
    timestamp: "2-week lead",
    metrics: [
      { label: "Projected Roll", value: "+9 bps", delta: "5–20 band", intent: "bad" },
      { label: "Voice Lead-time", value: "~2 wks", intent: "neutral" },
      { label: "Treatment", value: "advisory", intent: "neutral" },
    ],
    insight: "Voice leads the bureau roll by ~2 weeks. Advisory, fair-offer only; route to Risk.",
  },
];

function SpikeCard({ spike }: { spike: CardsSpike }) {
  const sev = sevMeta[spike.severity];
  return (
    <div
      style={{
        minWidth: "15rem",
        flex: "1 1 0",
        background: JH.card,
        border: `1px solid ${sev.color}`,
        borderRadius: 16,
        padding: "18px 16px 16px",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 8px 24px ${sev.color}14`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: JH.text, lineHeight: 1.2 }}>{spike.title}</div>
        <span
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: sev.color,
            background: `${sev.color}1c`,
            border: `1px solid ${sev.color}55`,
            borderRadius: 999,
            padding: "2px 9px",
          }}
        >
          <span style={{ fontSize: 10, lineHeight: 1 }}>{sev.dot}</span>
          {sev.label}
        </span>
      </div>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
        <MetaRow label="Cohort" value={spike.cohort} />
        <MetaRow label="Voice Signal" value={spike.voiceSignal} />
        <MetaRow label="Time" value={spike.timestamp} />
      </div>

      <div
        style={{
          marginTop: 16,
          border: `1px solid ${JH.borderInner}`,
          background: JH.inset,
          borderRadius: 12,
          padding: "13px 13px",
          display: "flex",
          flexDirection: "column",
          gap: 11,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {spike.metrics.map((m, i) => {
          const c = intentColor[m.intent ?? "neutral"];
          return (
            <div key={`${m.label}-${i}`} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 12, color: JH.muted }}>{m.label}</span>
              <div style={{ textAlign: "right" }}>
                {m.value ? <div style={{ fontSize: 13, fontWeight: 700, color: JH.text, fontFamily: "var(--mono), ui-monospace, monospace" }}>{m.value}</div> : null}
                {m.delta ? <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "var(--mono), ui-monospace, monospace" }}>{m.delta}</div> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          border: `1px solid ${sev.color}40`,
          background: `${sev.color}10`,
          borderRadius: 12,
          padding: "12px 13px",
          fontSize: 12,
          lineHeight: 1.6,
          color: JH.sub,
        }}
      >
        <span style={{ color: JH.gold }}>✨ </span>
        {spike.insight}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: JH.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ fontSize: 12, color: JH.text, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export function CardsRiskSpikeMonitor({ spikes = cardsPortfolioRiskSpikes }: { spikes?: CardsSpike[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: JH.text, margin: 0 }}>✨ AI Risk Spike Monitor</h2>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: JH.red, background: `${JH.red}1c`, border: `1px solid ${JH.red}44`, borderRadius: 999, padding: "3px 9px" }}>
          Portfolio Alerts
        </span>
      </div>
      <p style={{ fontSize: 11.5, color: JH.muted, margin: 0, lineHeight: 1.5 }}>
        Live detection of decline, approval-rate, auth-liability, ombudsman-clock and roll-rate shocks across the card portfolio — each joined to the voice corpus.
      </p>
      <div style={{ display: "flex", width: "100%", minWidth: 0, gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "stretch" }}>
        {spikes.map((spike) => (
          <SpikeCard key={spike.id} spike={spike} />
        ))}
      </div>
    </div>
  );
}

export default CardsRiskSpikeMonitor;
