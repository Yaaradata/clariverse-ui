  "use client";

  import { type CSSProperties, type ReactNode } from "react";

  const C = {
    card: "#0d0d0d",
    border: "#1f1f1f",
    text: "#ffffff",
    sub: "#d6d9d8",
    muted: "#939394",
    dim: "#737373",
    red: "#ef4444",
    orange: "#f59e0b",
    yellow: "#eab308",
    green: "#22c55e",
  } as const;

  type Severity = "Critical" | "High" | "Watch" | "Healthy" | "Below target" | "Bottleneck";

  type Metric = {
    label: string;
    value: string;
    delta: string;
    status: Severity;
  };

  type SlaFailureRow = {
    promiseBroken: string;
    breached: number;
    repeat: string;
    aging: string;
    bottleneck: string;
    owner: string;
    action: string;
    severity: "Critical" | "High" | "Watch";
  };

  type ClosureRetentionRow = {
    closureDriver: string;
    closureCalls: number;
    saveRate: string;
    segmentHit: string;
    topCard: string;
    owner: string;
    action: string;
    severity: "Critical" | "High" | "Watch";
  };

  type BadgeStatus = Severity | "Rising" | "Stable" | "Expected" | "Emerging";

  const SLA_METRICS: Metric[] = [
    { label: "Breached promises", value: "1,284", delta: "+18% WoW", status: "Critical" },
    { label: "Beyond promise window", value: "43", delta: "14+ days open", status: "High" },
    { label: "Repeat after breach", value: "47%", delta: "up from 39%", status: "High" },
    { label: "Top bottleneck", value: "Vendor Beta", delta: "Evidence collection", status: "Bottleneck" },
  ];

  const CLOSURE_METRICS: Metric[] = [
    { label: "Closure intent calls", value: "418", delta: "+22% WoW", status: "Critical" },
    { label: "Retained Percentage", value: "61%", delta: "target 70%", status: "Below target" },
    { label: "Unresolved Cases", value: "163", delta: "high risk", status: "High" },
    { label: "HSHF at risk", value: "18", delta: "premium accounts", status: "Critical" },
  ];

  const SLA_FAILURE_ROWS: SlaFailureRow[] = [
    { promiseBroken: "Dispute update", breached: 362, repeat: "47%", aging: "43 overdue", bottleneck: "Evidence collection", owner: "Dispute Ops", action: "Route aged cases in-house", severity: "Critical" },
    { promiseBroken: "Fee waiver decision", breached: 182, repeat: "54%", aging: "12 overdue", bottleneck: "Approval dependency", owner: "Billing Ops", action: "Create same-call waiver path", severity: "High" },
    { promiseBroken: "Callback promise", breached: 126, repeat: "31%", aging: "18 missed", bottleneck: "Callback queue", owner: "Care Ops", action: "Stand up callback SLA queue", severity: "High" },
    { promiseBroken: "Provisional credit", breached: 98, repeat: "41%", aging: "9 overdue", bottleneck: "Credit posting delay", owner: "Dispute Ops", action: "Prioritize credit-posting cases", severity: "High" },
    { promiseBroken: "Statement query", breached: 78, repeat: "26%", aging: "6 overdue", bottleneck: "Statement explanation", owner: "Billing Ops", action: "Add clearer app copy", severity: "Watch" },
  ];

  const CLOSURE_RETENTION_ROWS: ClosureRetentionRow[] = [
    { closureDriver: "Annual fee not worth it", closureCalls: 142, saveRate: "52%", segmentHit: "HSHF", topCard: "Autograph Journey", owner: "Retention Ops", action: "Fee-value recovery offer", severity: "Critical" },
    { closureDriver: "Reward not posted", closureCalls: 118, saveRate: "57%", segmentHit: "HSHF / HSLF", topCard: "Active Cash / One Key", owner: "Rewards Ops", action: "Reward visibility fix", severity: "High" },
    { closureDriver: "Dispute unresolved", closureCalls: 86, saveRate: "44%", segmentHit: "HSHF", topCard: "Active Cash / Reflect", owner: "Dispute Ops", action: "Priority closure-save queue", severity: "Critical" },
    { closureDriver: "Better competitor card", closureCalls: 51, saveRate: "63%", segmentHit: "HSLF", topCard: "Autograph / Bilt", owner: "Product Marketing", action: "Competitor rebuttal script", severity: "Watch" },
    { closureDriver: "Callback missed", closureCalls: 37, saveRate: "48%", segmentHit: "LSLF", topCard: "Multiple", owner: "Care Ops", action: "Callback recovery queue", severity: "High" },
  ];

  const TOP_SERVICE_FAILURES_ROWS = [
    { label: "Dispute follow-up", conv: 3628, repeat: "47%", sentiment: "-0.58", segment: "HSHF", severity: "Critical" as const },
    { label: "Fee waiver", conv: 1820, repeat: "54%", sentiment: "-0.52", segment: "HSHF", severity: "High" as const },
    { label: "Callback missed", conv: 1260, repeat: "31%", sentiment: "-0.46", segment: "LSLF", severity: "High" as const },
    { label: "Provisional credit", conv: 980, repeat: "41%", sentiment: "-0.49", segment: "HSLF", severity: "High" as const },
    { label: "Statement confusion", conv: 780, repeat: "26%", sentiment: "-0.44", segment: "LSLF", severity: "Watch" as const },
  ];

  const DISPUTE_FUNNEL_ROWS = [
    { stage: "Opened", vol: "1,240", avg: "0.4d", sentiment: "-0.18", status: "Healthy" as Severity },
    { stage: "Evidence", vol: "1,820", avg: "4.2d", sentiment: "-0.42", status: "Bottleneck" as Severity },
    { stage: "Temp credit", vol: "980", avg: "3.1d", sentiment: "-0.38", status: "Watch" as Severity },
    { stage: "Bank response", vol: "720", avg: "4.8d", sentiment: "-0.52", status: "Watch" as Severity },
    { stage: "Decision", vol: "540", avg: "3.7d", sentiment: "-0.61", status: "Critical" as Severity },
    { stage: "Escalation risk", vol: "8", avg: "30d+", sentiment: "-0.78", status: "Critical" as Severity },
  ];

  const DISPUTE_WHY_METRICS: Array<{ label: string; value: string; delta: string; status: BadgeStatus }> = [
    { label: "New disputes", value: "1,240", delta: "+14% WoW", status: "Rising" },
    { label: "Resolved", value: "860", delta: "69% resolution", status: "Watch" },
    { label: "Pending", value: "1,820", delta: "4.2d avg age", status: "Bottleneck" },
    { label: "Beyond SLA", value: "43", delta: "14+ days open", status: "Critical" },
    { label: "Resolving", value: "62%", delta: "moving forward", status: "Stable" },
    { label: "Cycling", value: "28%", delta: "reopened / repeat contact", status: "High" },
  ];

  // Required real feeds:
  // - caseId, disputeId, caseStatus, disputeStage, reasonCode, createdAt, dueAt, updatedAt, daysOpen, beyondSla
  // - documentStatus, merchantResponseStatus, provisionalCreditStatus, ownerQueue, vendor, cardProduct
  // - customerSegment, repeatContacts
  const DISPUTE_SLA_ROOT_CAUSES = [
    { cause: "Customer evidence pending", count: 128, share: "34%", avgDelay: "3.8d", owner: "CX Ops", action: "Trigger evidence reminder flow", severity: "Critical" as const },
    { cause: "Merchant / acquirer response wait", count: 96, share: "26%", avgDelay: "5.1d", owner: "Partnerships", action: "Escalate aged merchant waits", severity: "High" as const },
    { cause: "Internal review backlog", count: 74, share: "20%", avgDelay: "2.9d", owner: "Dispute Ops", action: "Reroute HSHF aged cases", severity: "High" as const },
    { cause: "Posting-system exception", count: 48, share: "13%", avgDelay: "4.6d", owner: "Card Systems", action: "Reconcile failed postings", severity: "Critical" as const },
    { cause: "Approval / review delay", count: 26, share: "7%", avgDelay: "2.1d", owner: "Billing Ops", action: "Same-day approval queue", severity: "Watch" as const },
  ];

const ROUTINE_TYPES = [
  { type: "Duplicate charge", volume: 286, trend: "+4%", status: "Expected" as BadgeStatus },
  { type: "Incorrect amount", volume: 214, trend: "+2%", status: "Expected" as BadgeStatus },
  { type: "Subscription cancellation", volume: 188, trend: "+7%", status: "Watch" as BadgeStatus },
  { type: "Refund not posted", volume: 176, trend: "+9%", status: "Watch" as BadgeStatus },
];

const EMERGING_TYPES = [
  { type: "Credit not processed", volume: 96, trend: "+31%", status: "Emerging" as BadgeStatus },
  { type: "Digital wallet duplicate debit", volume: 74, trend: "+28%", status: "Emerging" as BadgeStatus },
  { type: "Co-brand reward reversal", volume: 62, trend: "+24%", status: "Emerging" as BadgeStatus },
  { type: "Merchant says bank / bank says merchant", volume: 58, trend: "+22%", status: "Emerging" as BadgeStatus },
];

const DISPUTE_TYPE_SIGNALS = { routine: ROUTINE_TYPES, emerging: EMERGING_TYPES };

  const AGED_CASE_WATCHLIST = [
    { theme: "Refund not posted", stage: "Merchant response wait", age: "12d", blocker: "Acquirer response pending", segment: "HSHF", card: "One Key Card", severity: "Critical" as const },
    { theme: "Credit not processed", stage: "Internal review", age: "9d", blocker: "Posting exception", segment: "HSLF", card: "Active Cash Card", severity: "High" as const },
    { theme: "Duplicate debit", stage: "Evidence pending", age: "8d", blocker: "Customer proof not uploaded", segment: "LSHF", card: "Autograph Card", severity: "Watch" as const },
    { theme: "Reward reversal dispute", stage: "Partner validation", age: "14d", blocker: "Co-brand confirmation pending", segment: "HSHF", card: "Choice Privileges Select Mastercard", severity: "Critical" as const },
  ];

  const td: CSSProperties = { padding: "7px 8px", borderBottom: `1px solid ${C.border}`, color: C.sub, fontSize: 10, verticalAlign: "middle", lineHeight: 1.25 };

  function severityColor(status: Severity) {
    if (status === "Critical") return C.red;
    if (status === "High" || status === "Bottleneck" || status === "Below target") return C.orange;
    if (status === "Watch") return C.yellow;
    return C.green;
  }

  function badgeColor(status: BadgeStatus) {
    if (status === "Critical") return C.red;
    if (status === "High" || status === "Bottleneck" || status === "Below target" || status === "Emerging") return C.orange;
    if (status === "Watch" || status === "Rising") return C.yellow;
    return C.green;
  }

  function Bx({ children }: { children: ReactNode }) {
    return (
      <section style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 16, padding: 14, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </section>
    );
  }

  function Bd({ children, c }: { children: ReactNode; c: string }) {
    return <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 999, background: `${c}20`, color: c }}>{children}</span>;
  }

  function MetricBlock({ metric }: { metric: Metric }) {
    const c = severityColor(metric.status);
    return (
      <div style={{ background: "rgba(255,255,255,0.025)", borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px" }}>
        <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em" }}>{metric.label}</div>
        <div style={{ marginTop: 4, fontSize: 20, fontWeight: 800, color: metric.status === "Healthy" ? C.green : C.text, lineHeight: 1.1 }}>{metric.value}</div>
        <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: C.muted }}>{metric.delta}</span>
          <Bd c={c}>{metric.status}</Bd>
        </div>
      </div>
    );
  }

  function Table({ children }: { children: ReactNode }) {
    return (
      <div style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxHeight: 292, overflowY: "auto" }}>{children}</div>
      </div>
    );
  }

  function SLAFailuresCard() {
    return (
      <Bx>
        <header style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>SLA Failures</h3>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 11 }}>Service promises breached by timeline, repeat contact, and bottleneck owner.</p>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>{SLA_METRICS.map((m) => <MetricBlock key={m.label} metric={m} />)}</div>
        <div style={{ marginTop: 10, marginBottom: 6, fontSize: 12, fontWeight: 800, color: C.text }}>Service promise breaks</div>
        <Table>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead><tr style={{ background: "rgba(255,255,255,0.015)" }}>{["Promise broken", "Impact", "Breached", "Repeat", "Aging", "Main bottleneck"].map((h) => <th key={h} style={{ textAlign: "left", padding: "7px 8px", fontSize: 9, color: C.dim, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>{SLA_FAILURE_ROWS.map((r) => <tr key={r.promiseBroken}><td style={td}>{r.promiseBroken}</td><td style={td}><Bd c={severityColor(r.severity)}>{r.severity}</Bd></td><td style={td}>{r.breached}</td><td style={td}>{r.repeat}</td><td style={td}>{r.aging}</td><td style={td}>{r.bottleneck}</td></tr>)}</tbody>
          </table>
        </Table>
      </Bx>
    );
  }

  function CardClosureRetentionCard() {
    return (
      <Bx>
        <header style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>Card Closure / Retention</h3>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 11 }}>Closure intent, save rate, and top drivers behind cardholders asking to leave.</p>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>{CLOSURE_METRICS.map((m) => <MetricBlock key={m.label} metric={m} />)}</div>
        <div style={{ marginTop: 10, marginBottom: 6, fontSize: 12, fontWeight: 800, color: C.text }}>Closure drivers</div>
        <Table>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead><tr style={{ background: "rgba(255,255,255,0.015)" }}>{["Closure driver", "Impact", "Closure calls", "Save rate", "Segment hit", "Top card/product"].map((h) => <th key={h} style={{ textAlign: "left", padding: "7px 8px", fontSize: 9, color: C.dim, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>{CLOSURE_RETENTION_ROWS.map((r) => <tr key={r.closureDriver}><td style={td}>{r.closureDriver}</td><td style={td}><Bd c={severityColor(r.severity)}>{r.severity}</Bd></td><td style={td}>{r.closureCalls}</td><td style={td}>{r.saveRate}</td><td style={td}>{r.segmentHit}</td><td style={td}>{r.topCard}</td></tr>)}</tbody>
          </table>
        </Table>
      </Bx>
    );
  }

  function TopServiceFailuresCard() {
    const maxConv = Math.max(...TOP_SERVICE_FAILURES_ROWS.map((r) => r.conv));
    return (
      <Bx>
        <header style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>Top Service Failures</h3>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 11 }}>Ranked by conversation volume, repeat contact, and sentiment impact.</p>
        </header>
        <div style={{ display: "grid", gap: 8 }}>
          {TOP_SERVICE_FAILURES_ROWS.map((r, idx) => {
            const sevColor = severityColor(r.severity);
            const width = Math.round((r.conv / maxConv) * 100);
            return (
              <div key={r.label} style={{ borderTop: `1px solid ${idx < 2 ? `${C.red}33` : C.border}`, borderRight: `1px solid ${idx < 2 ? `${C.red}33` : C.border}`, borderBottom: `1px solid ${idx < 2 ? `${C.red}33` : C.border}`, borderLeft: `1px solid ${idx < 2 ? `${C.red}33` : C.border}`, borderRadius: 8, padding: "8px 10px", background: idx < 2 ? `${C.red}0D` : "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "20px 1fr 58px 44px 44px", alignItems: "center", gap: 8 }}>
                  <span style={{ color: idx < 2 ? C.red : C.muted, fontWeight: 800, fontSize: 12 }}>#{idx + 1}</span>
                  <div>
                    <div style={{ color: C.text, fontWeight: 700, fontSize: 11 }}>{r.label}</div>
                    <div style={{ color: C.muted, fontSize: 9, marginTop: 2 }}>Segment most affected: <Bd c={r.segment === "HSHF" ? C.orange : C.yellow}>{r.segment}</Bd></div>
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ color: C.text, fontWeight: 800, fontSize: 11 }}>{r.conv.toLocaleString()}</div><div style={{ color: C.muted, fontSize: 8 }}>conv.</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ color: sevColor, fontWeight: 800, fontSize: 11 }}>{r.repeat}</div><div style={{ color: C.muted, fontSize: 8 }}>repeat</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ color: C.orange, fontWeight: 800, fontSize: 11 }}>{r.sentiment}</div><div style={{ color: C.muted, fontSize: 8 }}>sent.</div></div>
                </div>
                <div style={{ marginTop: 6, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ width: `${width}%`, height: "100%", background: idx < 2 ? C.red : sevColor, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, padding: "7px 10px", background: `${C.red}0D`, borderLeft: `2px solid ${C.red}`, borderRadius: "0 5px 5px 0", color: C.sub, fontSize: 10, lineHeight: 1.45 }}>
          ✦ Dispute follow-up and fee waiver failures are the biggest service breaks by volume and repeat contact. These should drive today&apos;s operations focus.
        </div>
      </Bx>
    );
  }

  function DisputeRecoveryFunnelCard() {
    return (
      <Bx>
        <header style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>Dispute Recovery Funnel</h3>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 11 }}>Compact dispute lifecycle. Disputes are one part of the service promise.</p>
        </header>
        <div style={{ display: "grid", gap: 7 }}>
          {DISPUTE_FUNNEL_ROWS.map((r, idx) => {
            const color = severityColor(r.status);
            const width = 100 - idx * 9;
            return (
              <div key={r.stage} style={{ width: `${width}%`, minWidth: 220, borderTop: `1px solid ${color}30`, borderRight: `1px solid ${color}30`, borderBottom: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "8px 10px", background: `${color}10` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span style={{ color: C.text, fontWeight: 700, fontSize: 11 }}>{r.stage}</span>
                  <Bd c={color}>{r.status}</Bd>
                </div>
                <div style={{ marginTop: 5, display: "flex", gap: 10, color: C.sub, fontSize: 10 }}>
                  <span>Vol: {r.vol}</span><span>Avg: {r.avg}</span><span>Sent: {r.sentiment}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, padding: "7px 10px", background: `${C.orange}0D`, borderLeft: `2px solid ${C.orange}`, borderRadius: "0 5px 5px 0", color: C.sub, fontSize: 10, lineHeight: 1.45 }}>
          ✦ Evidence pending is the operational bottleneck. Sentiment collapses once cases move toward final decision and escalation risk.
        </div>
      </Bx>
    );
  }

  function WhyDisputesBreachSLA() {
    const maxRoot = Math.max(...DISPUTE_SLA_ROOT_CAUSES.map((r) => r.count));
    return (
      <section style={{ background: "#0b0b0f", borderTop: "1px solid rgba(168,85,247,0.35)", borderRight: "1px solid rgba(168,85,247,0.35)", borderBottom: "1px solid rgba(168,85,247,0.35)", borderLeft: "1px solid rgba(168,85,247,0.35)", borderRadius: 16, padding: 14, marginTop: 12 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>✨ Why Disputes Breach SLA</h3>
              <span title="Requires dispute case, document status, queue owner, due date, and card-product feeds." style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 999, color: "#fbbf24", background: "rgba(251,191,36,0.14)" }}>✨ Card-system enhanced</span>
            </div>
            <p style={{ margin: "5px 0 0", fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
              Dispute-stage visibility, aging reasons, and stuck-case ownership - enabled with card-system / dispute-platform data.
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 10, color: "#bfa9ff" }}>
              * Enabled when card-system, dispute-case, document-status, and queue feeds are connected.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2" style={{ marginTop: 10 }}>
          {DISPUTE_WHY_METRICS.map((m) => (
            <div key={m.label} style={{ background: "rgba(255,255,255,0.025)", borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px" }}>
              <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em" }}>{m.label}</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{m.value}</div>
              <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: C.muted }}>{m.delta}</span>
                <Bd c={badgeColor(m.status)}>{m.status}</Bd>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3" style={{ marginTop: 12 }}>
          <div style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 8 }}>Why beyond SLA?</div>
            <div style={{ display: "grid", gap: 7 }}>
              {DISPUTE_SLA_ROOT_CAUSES.map((r) => {
                const width = Math.round((r.count / maxRoot) * 100);
                return (
                  <div key={r.cause} style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `2px solid ${badgeColor(r.severity)}`, borderRadius: 8, padding: "7px 8px", background: "rgba(255,255,255,0.015)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{r.cause}</div>
                      <Bd c={badgeColor(r.severity)}>{r.severity}</Bd>
                    </div>
                    <div style={{ marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 9, color: C.muted }}>
                      <span>Count: <strong style={{ color: C.sub }}>{r.count}</strong></span>
                      <span>Share: <strong style={{ color: C.sub }}>{r.share}</strong></span>
                      <span>Avg delay: <strong style={{ color: C.sub }}>{r.avgDelay}</strong></span>
                    </div>
                    <div style={{ marginTop: 3, fontSize: 9, color: C.muted }}>Owner: <strong style={{ color: C.sub }}>{r.owner}</strong> · Action: <strong style={{ color: C.sub }}>{r.action}</strong></div>
                    <div style={{ marginTop: 5, height: 5, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ width: `${width}%`, height: "100%", borderRadius: 4, background: badgeColor(r.severity) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 8 }}>Routine vs Emerging dispute types</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 8px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.sub, marginBottom: 5 }}>Routine</div>
                {DISPUTE_TYPE_SIGNALS.routine.map((r) => (
                  <div key={r.type} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 6, fontSize: 9, color: C.muted, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.sub }}>{r.type}</span><span>{r.volume}</span><Bd c={badgeColor(r.status)}>{r.status}</Bd>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(245,158,11,0.4)", borderRight: "1px solid rgba(245,158,11,0.4)", borderBottom: "1px solid rgba(245,158,11,0.4)", borderLeft: "1px solid rgba(245,158,11,0.4)", borderRadius: 8, padding: "7px 8px", background: "rgba(245,158,11,0.07)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#fbbf24", marginBottom: 5 }}>Emerging</div>
                {DISPUTE_TYPE_SIGNALS.emerging.map((r) => (
                  <div key={r.type} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 6, fontSize: 9, color: C.muted, padding: "4px 0", borderBottom: `1px solid rgba(245,158,11,0.25)` }}>
                    <span style={{ color: C.sub }}>{r.type}</span><span>{r.trend}</span><Bd c={badgeColor(r.status)}>{r.status}</Bd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>Aged Case Watchlist</div>
              <Bd c="#fbbf24">✨ Card-system enhanced</Bd>
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 8, lineHeight: 1.35 }}>
              Closest to breach or already beyond SLA - enabled with dispute-case and card-system data.
            </div>
            <div style={{ display: "grid", gap: 7 }}>
              {AGED_CASE_WATCHLIST.map((r) => (
                <div key={`${r.theme}-${r.stage}`} style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `2px solid ${badgeColor(r.severity)}`, borderRadius: 8, padding: "7px 8px", background: "rgba(255,255,255,0.015)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{r.theme}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: badgeColor(r.severity), fontWeight: 800 }}>{r.age}</span>
                      <Bd c={badgeColor(r.severity)}>{r.severity}</Bd>
                    </div>
                  </div>
                  <div style={{ marginTop: 2, fontSize: 9, color: C.muted }}>Stage: <strong style={{ color: C.sub }}>{r.stage}</strong></div>
                  <div style={{ marginTop: 2, fontSize: 9, color: C.muted }}>Blocker: <strong style={{ color: C.sub }}>{r.blocker}</strong></div>
                  <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Bd c={C.yellow}>{r.segment}</Bd>
                    <Bd c={C.orange}>{r.card}</Bd>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(168,85,247,0.08)", borderLeft: "2px solid #a855f7" }}>
          <div style={{ fontSize: 10, color: C.text, fontWeight: 800, marginBottom: 4 }}>✨ AI Dispute Diagnosis</div>
          <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
            <div><strong>Main reason:</strong> Overdue disputes are not caused by volume alone; most are stuck in customer evidence wait and merchant/acquirer response.</div>
            <div><strong>What changed:</strong> Cycling rose to 28%, driven by reopened dispute follow-ups and provisional-credit confusion.</div>
            <div><strong>Fix first:</strong> Route HSHF aged disputes in-house, trigger evidence reminders, and escalate merchant-wait cases older than 5 days.</div>
          </div>
        </div>
      </section>
    );
  }

function WhyDisputesBreachSLAControlStrip() {
  const maxRoot = Math.max(...DISPUTE_SLA_ROOT_CAUSES.map((r) => r.count));
  return (
    <section style={{ background: "#0b0b0f", borderTop: "1px solid rgba(168,85,247,0.35)", borderRight: "1px solid rgba(168,85,247,0.35)", borderBottom: "1px solid rgba(168,85,247,0.35)", borderLeft: "1px solid rgba(168,85,247,0.35)", borderRadius: 16, padding: 14, marginTop: 12 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>✨ Why Disputes Breach SLA</h3>
            <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 999, color: "#fbbf24", background: "rgba(251,191,36,0.14)" }}>Card-system enhanced</span>
          </div>
          <p style={{ margin: "5px 0 0", fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
            Dispute-stage visibility, aging reasons, and stuck-case signals - enabled with card-system / dispute-platform data.
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 10, color: "#bfa9ff", lineHeight: 1.35 }}>
            Requires dispute case, queue, document status, merchant response, due-date, and card-product feeds.
          </p>
        </div>
        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 10, color: C.muted }}>Last sync: 15 min ago</div>
          <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>43 beyond SLA</div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.015)" }}>
        {DISPUTE_WHY_METRICS.map((m) => (
          <div key={m.label} style={{ padding: "9px 10px", borderRight: m.label === "Cycling" ? "none" : `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.dim, fontWeight: 700 }}>{m.label}</div>
            <div style={{ marginTop: 3, fontSize: 19, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{m.value}</div>
            <div style={{ marginTop: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, color: C.muted }}>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>Why cases are stuck</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2, marginBottom: 7 }}>Top drivers of beyond-SLA disputes</div>
          <div style={{ display: "grid", gap: 7 }}>
            {DISPUTE_SLA_ROOT_CAUSES.map((r) => {
              const width = Math.round((r.count / maxRoot) * 100);
              return (
                <div key={r.cause}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{r.cause}</div>
                    <Bd c={badgeColor(r.severity)}>{r.severity}</Bd>
                  </div>
                  <div style={{ marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap", fontSize: 9, color: C.muted }}>
                    <span>{r.count} cases</span><span>{r.share} of beyond-SLA</span><span>{r.avgDelay} avg delay</span>
                  </div>
                  <div style={{ marginTop: 5, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ width: `${width}%`, height: "100%", borderRadius: 4, background: badgeColor(r.severity) }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 6 }}>Dispute type signal</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 5 }}>Routine</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ROUTINE_TYPES.map((r) => (
                    <span key={r.type} style={{ fontSize: 9, color: "#bbf7d0", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "2px 7px" }}>
                      {r.type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 5 }}>Emerging</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {EMERGING_TYPES.map((r) => (
                    <span key={r.type} style={{ fontSize: 9, color: "#fbbf24", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 999, padding: "2px 7px" }}>
                      {r.type} {r.trend}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>Aged Case Watchlist</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2, marginBottom: 8 }}>Closest to breach or already beyond SLA</div>
          <div style={{ display: "grid", gap: 7 }}>
            {AGED_CASE_WATCHLIST.map((r) => (
              <div key={`${r.theme}-${r.stage}`} style={{ borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${badgeColor(r.severity)}`, borderRadius: 8, padding: "7px 8px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Bd c={badgeColor(r.severity)}>{r.severity}</Bd>
                    <div style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{r.theme}</div>
                  </div>
                  <span style={{ fontSize: 12, color: badgeColor(r.severity), fontWeight: 800 }}>{r.age}</span>
                </div>
                <div style={{ marginTop: 2, fontSize: 9, color: C.muted }}>Stage: <strong style={{ color: C.sub }}>{r.stage}</strong></div>
                <div style={{ marginTop: 2, fontSize: 9, color: C.muted }}>Blocker: <strong style={{ color: C.sub }}>{r.blocker}</strong></div>
                <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Bd c={C.yellow}>{r.segment}</Bd>
                  <Bd c={C.orange}>{r.card}</Bd>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 10, background: "rgba(168,85,247,0.07)", borderTop: "1px solid rgba(168,85,247,0.28)", borderRight: "1px solid rgba(251,191,36,0.24)", borderBottom: "1px solid rgba(168,85,247,0.28)", borderLeft: "2px solid #a855f7" }}>
        <div style={{ fontSize: 10, color: C.text, fontWeight: 800, marginBottom: 4 }}>✨ AI Dispute Diagnosis</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 10, fontSize: 9, color: C.sub, lineHeight: 1.4 }}>
          <div><strong>Main reason:</strong> Most overdue disputes are stuck in customer evidence wait and merchant/acquirer response.</div>
          <div><strong>What changed:</strong> Cycling rose to 28%, driven by reopened dispute follow-ups and provisional-credit confusion.</div>
          <div><strong>Fix first:</strong> Route HSHF aged disputes in-house, trigger evidence reminders, and escalate merchant-wait cases older than 5 days.</div>
        </div>
      </div>
    </section>
  );
}

  export function ServicePromiseIndiaDrillBody() {
    return (
      <div style={{ fontFamily: "var(--font), system-ui, sans-serif", color: C.text, fontSize: 11, minWidth: 0 }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <SLAFailuresCard />
          <CardClosureRetentionCard />
        </div>
      <WhyDisputesBreachSLAControlStrip />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3" style={{ marginTop: 12 }}>
          <TopServiceFailuresCard />
          <DisputeRecoveryFunnelCard />
        </div>
      </div>
    );
  }

  export default ServicePromiseIndiaDrillBody;