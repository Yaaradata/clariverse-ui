"use client";

import { type CSSProperties, type ReactNode, useState } from "react";

/*
 * Head of Credit Cards (V3) — Are we keeping our service promise?
 * Compact executive version:
 * Service Promise Score + Risk Wall
 * Promise Performance Chart + Agent Promise Breakage
 * Service Failure Map + Dispute Recovery Funnel
 * Ownership Board
 * Evidence + Actions
 */

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
  cyan: "#38bdf8",
  purple: "#8b5cf6",
  gold: "#f59e0b",
} as const;

const SEG = {
  HSHF: C.gold,
  HSLF: C.cyan,
  LSHF: C.purple,
  LSLF: C.orange,
} as const;

type SegKey = keyof typeof SEG;

const CH = {
  Voice: C.red,
  Chat: C.orange,
  Email: C.yellow,
  Ticket: C.cyan,
  Social: C.green,
} as const;

type ChKey = keyof typeof CH;

function M({
  children,
  c,
  s = 14,
}: {
  children: ReactNode;
  c?: string;
  s?: number;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--mono), ui-monospace, monospace",
        fontWeight: 700,
        color: c || C.text,
        fontSize: s,
      }}
    >
      {children}
    </span>
  );
}

function Bd({ children, c }: { children: ReactNode; c: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 3,
        background: `${c}18`,
        color: c,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Bx({
  children,
  accent,
  s = {},
}: {
  children: ReactNode;
  accent?: string;
  s?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${accent ? `${accent}30` : C.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        minWidth: 0,
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function Hd({
  children,
  sub,
  badge,
}: {
  children: ReactNode;
  sub?: string;
  badge?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.text }}>
          {children}
        </h3>
        {badge ? <Bd c={C.purple}>{badge}</Bd> : null}
      </div>
      {sub ? (
        <p style={{ fontSize: 11, color: C.muted, margin: "4px 0 0", lineHeight: 1.35 }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function MetricTile({
  label,
  value,
  color = C.text,
  sub,
}: {
  label: string;
  value: ReactNode;
  color?: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: C.dim,
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <M s={20} c={color}>
        {value}
      </M>
      {sub ? <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>{sub}</div> : null}
    </div>
  );
}

function Progress({
  pct,
  color,
  label,
}: {
  pct: number;
  color: string;
  label?: string;
}) {
  return (
    <div title={label} style={{ width: "100%" }}>
      <div
        style={{
          height: 7,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, pct))}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

const SERVICE_SCORE_METRICS = [
  { label: "Promise breach", value: "31%", color: C.red, sub: "+7 pts WoW" },
  { label: "Repeat follow-up", value: "47%", color: C.red, sub: "same issue recontact" },
  { label: "Promise breakage", value: "54%", color: C.red, sub: "agent said, system missed" },
  { label: "Aged cases", value: "43", color: C.orange, sub: "beyond promise window" },
];

const SERVICE_WORRY_ALERTS = [
  {
    sev: "CRITICAL",
    c: C.red,
    msg: "Dispute repeat contact at 47%. Customers are calling back 3–4 times for the same unresolved dispute.",
    action: "Trigger callback queue for repeat-dispute customers today.",
  },
  {
    sev: "CRITICAL",
    c: C.red,
    msg: "43 service cases are aging beyond promised timelines. 14+ day disputes show the highest negative sentiment.",
    action: "Move aged dispute cases to in-house priority review.",
  },
  {
    sev: "CRITICAL",
    c: C.red,
    msg: "Agent-promise breakage up 28% WoW. Customers mention “agent promised” but no follow-through.",
    action: "Audit promise-to-resolution tracking across voice and chat.",
  },
  {
    sev: "ALERT",
    c: C.orange,
    msg: "Fee dispute follow-ups increased 21% WoW. Annual fee and late-fee reversals are driving repeat contacts.",
    action: "Create same-call fee waiver decision path for eligible cardholders.",
  },
  {
    sev: "ALERT",
    c: C.orange,
    msg: "Vendor Beta has the weakest close sentiment. Repeat contacts are 1.8× higher than in-house queue.",
    action: "Cap Vendor Beta to low-complexity dispute cases.",
  },
  {
    sev: "ALERT",
    c: C.orange,
    msg: "Payment and statement confusion generated 2,180 service contacts this week.",
    action: "Add statement explainer and payment-status copy inside app.",
  },
  {
    sev: "WARNING",
    c: C.yellow,
    msg: "Cross-sell during complaint calls created 840 frustrated callbacks this month.",
    action: "Pause upsell scripts until active complaint is resolved.",
  },
] as const;

const PROMISE_PERFORMANCE = [
  { promise: "Card delivery", kept: 92, missed: 8, repeat: 12, type: "kept" },
  { promise: "Card closure", kept: 96, missed: 4, repeat: 8, type: "kept" },
  { promise: "Statement query", kept: 88, missed: 12, repeat: 19, type: "kept" },
  { promise: "Activation / PIN", kept: 84, missed: 16, repeat: 28, type: "watch" },
  { promise: "Callback 24h", kept: 78, missed: 22, repeat: 31, type: "watch" },
  { promise: "Dispute update", kept: 58, missed: 42, repeat: 47, type: "miss" },
  { promise: "Fee waiver", kept: 46, missed: 54, repeat: 38, type: "miss" },
  { promise: "Provisional credit", kept: 62, missed: 38, repeat: 41, type: "miss" },
];

const BROKEN_PROMISES_TOP = [
  { promise: "Fee waiver in next bill", count: 92, color: C.red },
  { promise: "Dispute callback in 24h", count: 64, color: C.red },
  { promise: "Provisional credit by date", count: 48, color: C.orange },
  { promise: "EMI conversion confirmation", count: 32, color: C.orange },
  { promise: "Limit increase decision", count: 18, color: C.yellow },
];

const SERVICE_FAILURES = [
  {
    label: "Dispute follow-up",
    x: 47,
    y: 3620,
    size: 34,
    seg: "HSHF" as SegKey,
    color: C.red,
    repeat: "47%",
    sent: -0.58,
  },
  {
    label: "Fee waiver",
    x: 54,
    y: 1820,
    size: 30,
    seg: "HSHF" as SegKey,
    color: C.red,
    repeat: "54%",
    sent: -0.52,
  },
  {
    label: "Callback missed",
    x: 31,
    y: 1260,
    size: 24,
    seg: "LSLF" as SegKey,
    color: C.orange,
    repeat: "31%",
    sent: -0.46,
  },
  {
    label: "Provisional credit",
    x: 41,
    y: 980,
    size: 26,
    seg: "HSLF" as SegKey,
    color: C.orange,
    repeat: "41%",
    sent: -0.49,
  },
  {
    label: "Statement confusion",
    x: 26,
    y: 780,
    size: 21,
    seg: "LSLF" as SegKey,
    color: C.yellow,
    repeat: "26%",
    sent: -0.44,
  },
  {
    label: "EMI conversion",
    x: 29,
    y: 580,
    size: 20,
    seg: "HSLF" as SegKey,
    color: C.yellow,
    repeat: "29%",
    sent: -0.48,
  },
  {
    label: "Recovery conduct",
    x: 62,
    y: 340,
    size: 25,
    seg: "LSLF" as SegKey,
    color: C.red,
    repeat: "62%",
    sent: -0.74,
  },
];

const DISPUTE_FUNNEL = [
  { stage: "Opened", vol: 1240, avg: "0.4d", sentiment: -0.18, color: C.green, status: "Healthy" },
  { stage: "Evidence", vol: 1820, avg: "4.2d", sentiment: -0.42, color: C.orange, status: "Bottleneck" },
  { stage: "Temp credit", vol: 980, avg: "3.1d", sentiment: -0.38, color: C.yellow, status: "Watch" },
  { stage: "Bank response", vol: 720, avg: "4.8d", sentiment: -0.52, color: C.orange, status: "Watch" },
  { stage: "Decision", vol: 540, avg: "3.7d", sentiment: -0.61, color: C.red, status: "Critical" },
  { stage: "Escalation risk", vol: 8, avg: "30d+", sentiment: -0.78, color: C.red, status: "Risk" },
];

const SEGMENT_FAILURES = [
  {
    seg: "HSHF" as SegKey,
    failures: 1240,
    repeat: "48%",
    broken: "Dispute update",
    risk: "High",
    action: "Route high-value disputes in-house",
  },
  {
    seg: "HSLF" as SegKey,
    failures: 980,
    repeat: "38%",
    broken: "Fee waiver",
    risk: "Medium",
    action: "Same-call waiver decision",
  },
  {
    seg: "LSHF" as SegKey,
    failures: 1620,
    repeat: "44%",
    broken: "Payment support",
    risk: "High",
    action: "Improve self-serve explanations",
  },
  {
    seg: "LSLF" as SegKey,
    failures: 860,
    repeat: "31%",
    broken: "Callback promise",
    risk: "Medium",
    action: "Callback SLA queue",
  },
];

const QUEUE_ROWS = [
  {
    team: "In-house Dispute",
    cases: "90/day",
    repeat: "22%",
    close: "-0.24",
    risk: "Stable",
    color: C.green,
    action: "Keep HSHF cases",
  },
  {
    team: "Vendor Alpha",
    cases: "35/day",
    repeat: "31%",
    close: "-0.38",
    risk: "Watch",
    color: C.orange,
    action: "Low-complexity only",
  },
  {
    team: "Vendor Beta",
    cases: "28/day",
    repeat: "52%",
    close: "-0.56",
    risk: "Critical",
    color: C.red,
    action: "Cap within 48h",
  },
  {
    team: "Recovery Queue",
    cases: "64/day",
    repeat: "41%",
    close: "-0.61",
    risk: "Critical",
    color: C.red,
    action: "QA conduct scripts",
  },
];

const PARTNER_ROWS = [
  {
    partner: "Amazon Pay card",
    complaints: 312,
    status: "Alert",
    color: C.red,
    phrase: "Bank says partner; partner says bank.",
  },
  {
    partner: "Flipkart card",
    complaints: 184,
    status: "Watch",
    color: C.orange,
    phrase: "Refund not credited after return.",
  },
  {
    partner: "Travel co-brand",
    complaints: 142,
    status: "Watch",
    color: C.orange,
    phrase: "Miles not credited after flight.",
  },
  {
    partner: "Online gaming",
    complaints: 268,
    status: "Critical",
    color: C.red,
    phrase: "Unrecognized charges keep coming.",
  },
];

const ESCALATION_METRICS = [
  { label: "Externally escalatable", value: "8", color: C.red, sub: "needs recovery today" },
  { label: "Approaching threshold", value: "23", color: C.orange, sub: "early warning" },
  { label: "Filed this month", value: "14", color: C.text, sub: "active complaints" },
  { label: "Recovery conduct", value: "64", color: C.red, sub: "reputation risk" },
];

const RISK_PIPELINE = [
  {
    label: "Already escalatable",
    value: 8,
    pct: 100,
    color: C.red,
    sub: "past external escalation threshold",
    owner: "Dispute Ops + Legal",
    action: "Resolve today",
  },
  {
    label: "Approaching threshold",
    value: 23,
    pct: 76,
    color: C.orange,
    sub: "21–30 days open",
    owner: "Dispute Ops",
    action: "Early recovery queue",
  },
  {
    label: "High-risk recovery conduct",
    value: 64,
    pct: 64,
    color: C.red,
    sub: "customer conduct complaints",
    owner: "Recovery Ops",
    action: "QA + script audit",
  },
  {
    label: "Filed this month",
    value: 14,
    pct: 46,
    color: C.yellow,
    sub: "active external complaints",
    owner: "Legal + Service",
    action: "Root-cause review",
  },
] as const;

const RECOVERY_CONDUCT_RISKS = [
  { issue: "Settlement promise broken", count: 64, color: C.red },
  { issue: "Calls outside permitted hours", count: 42, color: C.orange },
  { issue: "Abusive language reported", count: 28, color: C.red },
  { issue: "Family member contacted", count: 18, color: C.red },
] as const;

const RISK_ACTION_QUEUE = [
  {
    label: "Same-day closure",
    count: 8,
    color: C.red,
    note: "externally escalatable cases",
  },
  {
    label: "Early warning recovery",
    count: 23,
    color: C.orange,
    note: "approaching escalation window",
  },
  {
    label: "Conduct QA review",
    count: 64,
    color: C.red,
    note: "recovery complaints",
  },
] as const;

const EVIDENCE_SNIPPETS: { ch: ChKey; seg: SegKey; type: string; text: string }[] = [
  {
    ch: "Voice",
    seg: "HSHF",
    type: "AGENT PROMISE",
    text: "Last call agent told me fee will be reversed in next bill. Bill came, fee is still there. This is the third call.",
  },
  {
    ch: "Chat",
    seg: "HSLF",
    type: "PARTNER BLAME",
    text: "Amazon refund issued 20 days back. Bank says it is Amazon’s problem. Amazon says contact bank. I am stuck.",
  },
  {
    ch: "Voice",
    seg: "LSHF",
    type: "AGING DISPUTE",
    text: "Disputed transaction in March. Today is May. No update. I will escalate this now.",
  },
  {
    ch: "Voice",
    seg: "LSLF",
    type: "RECOVERY CONDUCT",
    text: "Your collection agent called my office at 9pm and spoke to my colleague. This is harassment.",
  },
];

const RECOMMENDED_ACTIONS = [
  {
    title: "Resolve 8 externally escalatable cases today",
    owner: "Dispute Ops + Legal",
    impact: "Prevent high-risk service escalation",
    p: "Critical",
    c: C.red,
  },
  {
    title: "Audit promise-to-resolution tracking",
    owner: "Training + QA",
    impact: "Reduce 54% broken-promise rate",
    p: "Critical",
    c: C.red,
  },
  {
    title: "Create same-call fee waiver path",
    owner: "Service Design + Billing Ops",
    impact: "Reduce HSHF churn language",
    p: "High",
    c: C.orange,
  },
  {
    title: "Cap Vendor Beta to low-complexity disputes",
    owner: "Vendor Management",
    impact: "Reduce repeat contact and poor close sentiment",
    p: "High",
    c: C.orange,
  },
];

function ServiceScoreCard() {
  return (
    <Bx accent={C.red} s={{ minHeight: 320 }}>
      <Hd sub="One executive answer: are cardholder service promises being kept?">
        Service Promise Score
      </Hd>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 12 }}>
        <M s={46} c={C.red}>
          58
        </M>
        <span style={{ fontSize: 18, color: C.muted, marginBottom: 8 }}>/ 100</span>
        <Bd c={C.red}>At Risk</Bd>
      </div>

      <p style={{ margin: "0 0 12px", color: C.sub, fontSize: 11, lineHeight: 1.45 }}>
        Service promise is breaking mainly through dispute follow-ups, fee-waiver promises, and callback failures.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        {SERVICE_SCORE_METRICS.map((m) => (
          <MetricTile key={m.label} label={m.label} value={m.value} color={m.color} sub={m.sub} />
        ))}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "8px 10px",
          background: `${C.red}07`,
          borderLeft: `2px solid ${C.red}`,
          borderRadius: "0 5px 5px 0",
        }}
      >
        <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
          ✦ Repeat contact is the strongest failure signal: customers are coming back because the promised next step did not happen.
        </span>
      </div>
    </Bx>
  );
}

function WorryWall() {
  return (
    <Bx
      accent={C.red}
      s={{
        minHeight: 320,
        maxHeight: 480,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: C.text,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 7,
        }}
      >
        ✨ What should you worry about?
      </div>

      <div style={{ flexShrink: 0, marginBottom: 10 }}>
        <M s={30} c={C.red}>
          3
        </M>
        <span style={{ fontSize: 13, color: C.muted }}> critical · </span>
        <M s={30} c={C.orange}>
          3
        </M>
        <span style={{ fontSize: 13, color: C.muted }}> alerts · </span>
        <M s={30} c={C.yellow}>
          1
        </M>
        <span style={{ fontSize: 13, color: C.muted }}> warning</span>
      </div>

      <div
        style={{
          flex: "1 1 0%",
          minHeight: 0,
          overflowY: "auto",
          paddingRight: 8,
          scrollbarGutter: "stable",
        }}
      >
        {SERVICE_WORRY_ALERTS.map((a, idx) => (
          <div
            key={`${a.sev}-${idx}`}
            style={{
              padding: "8px 10px",
              marginBottom: 6,
              background: `${a.c}07`,
              borderLeft: `2px solid ${a.c}`,
              borderRadius: "0 5px 5px 0",
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <Bd c={a.c}>{a.sev}</Bd>
            </div>
            <p style={{ fontSize: 12, color: C.sub, margin: "0 0 4px", lineHeight: 1.45 }}>{a.msg}</p>
            <span style={{ fontSize: 11, color: a.c, fontWeight: 600 }}>→ {a.action}</span>
          </div>
        ))}
      </div>
    </Bx>
  );
}

function PromisePerformanceChart() {
  return (
    <Bx accent={C.purple} s={{ minHeight: 355 }}>
      <Hd sub="Combined view of promises kept vs missed. Repeat contact shows where customers come back.">
        Promise Performance
      </Hd>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {PROMISE_PERFORMANCE.map((p) => {
          const missColor = p.missed >= 40 ? C.red : p.missed >= 20 ? C.orange : C.yellow;
          return (
            <div key={p.promise}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 56px 56px",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: C.text,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.promise}
                </span>

                <div
                  style={{
                    height: 9,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${p.kept}%`,
                      background: p.kept >= 80 ? C.green : C.yellow,
                    }}
                    title={`${p.kept}% kept`}
                  />
                  <div
                    style={{
                      width: `${p.missed}%`,
                      background: missColor,
                    }}
                    title={`${p.missed}% missed`}
                  />
                </div>

                <M s={10} c={p.kept >= 80 ? C.green : C.yellow}>
                  {p.kept}% kept
                </M>

                <M s={10} c={p.repeat >= 35 ? C.red : C.orange}>
                  {p.repeat}% rpt
                </M>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
          paddingTop: 10,
          borderTop: `1px solid ${C.border}`,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 6, borderRadius: 3, background: C.green }} />
          <span style={{ color: C.muted, fontSize: 10 }}>Kept</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 6, borderRadius: 3, background: C.orange }} />
          <span style={{ color: C.muted, fontSize: 10 }}>Watch</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 6, borderRadius: 3, background: C.red }} />
          <span style={{ color: C.muted, fontSize: 10 }}>Missed</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "7px 10px",
          background: `${C.red}07`,
          borderLeft: `2px solid ${C.red}`,
          borderRadius: "0 5px 5px 0",
        }}
      >
        <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
          ✦ Fee waiver and dispute update are the weakest promises. Card closure and delivery are not the main problem.
        </span>
      </div>
    </Bx>
  );
}

function AgentPromiseBreakage() {
  return (
    <Bx accent={C.orange} s={{ minHeight: 355 }}>
      <Hd sub="Agent said it · system did not deliver · customer called back." badge="AI">
        Agent Promise Breakage
      </Hd>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        <MetricTile label="Promises detected" value="342" />
        <MetricTile label="Customer called back" value="184" color={C.red} />
        <MetricTile label="Breakage rate" value="54%" color={C.red} />
        <MetricTile label="WoW change" value="+28%" color={C.red} />
      </div>

      <div
        style={{
          fontSize: 9,
          color: C.dim,
          textTransform: "uppercase",
          fontWeight: 700,
          marginTop: 12,
          marginBottom: 6,
        }}
      >
        Top broken promises
      </div>

      {BROKEN_PROMISES_TOP.map((p) => (
        <div key={p.promise} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: C.sub, flex: 1 }}>{p.promise}</span>
          <div
            style={{
              width: 92,
              height: 6,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(p.count / 92) * 100}%`,
                height: "100%",
                background: p.color,
                borderRadius: 3,
              }}
            />
          </div>
          <M s={10} c={p.color}>
            {p.count}
          </M>
        </div>
      ))}

      <div
        style={{
          marginTop: 10,
          padding: "7px 10px",
          background: `${C.orange}07`,
          borderLeft: `2px solid ${C.orange}`,
          borderRadius: "0 5px 5px 0",
        }}
      >
        <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
          ✦ This is the clearest conversation-derived service failure: promise made, no fulfillment, repeat contact created.
        </span>
      </div>
    </Bx>
  );
}

function ServiceFailureRanking() {
  const maxVol = Math.max(...SERVICE_FAILURES.map((f) => f.y));
  const ranked = [...SERVICE_FAILURES].sort((a, b) => b.y - a.y);

  return (
    <Bx
      accent={C.red}
      s={{ minHeight: 200, maxHeight: 515, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <Hd sub="Ranked by conversation volume, repeat contact, and sentiment impact.">
        Top Service Failures
      </Hd>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: "1 1 0%",
          minHeight: 0,
          overflowY: "auto",
          paddingRight: 6,
          scrollbarGutter: "stable",
        }}
      >
        {ranked.map((f, idx) => {
          const repeatNum = parseInt(f.repeat, 10);
          const repeatColor = repeatNum >= 45 ? C.red : repeatNum >= 35 ? C.orange : C.yellow;
          const volPct = Math.round((f.y / maxVol) * 100);

          return (
            <div
              key={f.label}
              style={{
                padding: "9px 10px",
                borderRadius: 8,
                background: idx < 2 ? `${C.red}08` : "rgba(255,255,255,0.025)",
                border: `1px solid ${idx < 2 ? `${C.red}22` : C.border}`,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 70px 64px 54px",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <M s={13} c={idx < 2 ? C.red : C.muted}>
                  #{idx + 1}
                </M>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f.label}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
                    Segment most affected: <Bd c={SEG[f.seg]}>{f.seg}</Bd>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <M s={11}>{f.y.toLocaleString()}</M>
                  <div style={{ fontSize: 8, color: C.muted }}>conv.</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <M s={11} c={repeatColor}>
                    {f.repeat}
                  </M>
                  <div style={{ fontSize: 8, color: C.muted }}>repeat</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <M s={11} c={f.sent <= -0.55 ? C.red : C.orange}>
                    {f.sent.toFixed(2)}
                  </M>
                  <div style={{ fontSize: 8, color: C.muted }}>sent.</div>
                </div>
              </div>

              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${volPct}%`,
                    height: "100%",
                    background: idx < 2 ? C.red : f.color,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "7px 10px",
          background: `${C.red}07`,
          borderLeft: `2px solid ${C.red}`,
          borderRadius: "0 5px 5px 0",
        }}
      >
        <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
          ✦ Dispute follow-up and fee waiver failures are the biggest service breaks by volume and repeat contact.
          These should drive today&apos;s operations focus.
        </span>
      </div>
    </Bx>
  );
}

function DisputeRecoveryFunnel() {
  return (
    <Bx accent={C.orange} s={{ minHeight: 360 }}>
      <Hd sub="Compact dispute lifecycle. Disputes are one part of the service promise.">
        Dispute Recovery Funnel
      </Hd>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {DISPUTE_FUNNEL.map((s, idx) => {
          const width = 100 - idx * 9;
          return (
            <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: `${width}%`,
                  minWidth: 220,
                  background: `${s.color}10`,
                  borderTop: `1px solid ${s.color}30`,
                  borderRight: `1px solid ${s.color}30`,
                  borderBottom: `1px solid ${s.color}30`,
                  borderLeft: `3px solid ${s.color}`,
                  borderRadius: 8,
                  padding: "8px 10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ color: C.text, fontWeight: 700, fontSize: 11 }}>{s.stage}</span>
                  <Bd c={s.color}>{s.status}</Bd>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 5, flexWrap: "wrap" }}>
                  <span style={{ color: C.sub, fontSize: 10 }}>
                    Vol: <M s={10}>{s.vol.toLocaleString()}</M>
                  </span>
                  <span style={{ color: C.sub, fontSize: 10 }}>
                    Avg: <M s={10}>{s.avg}</M>
                  </span>
                  <span style={{ color: C.sub, fontSize: 10 }}>
                    Sent: <M s={10} c={s.color}>{s.sentiment.toFixed(2)}</M>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "7px 10px",
          background: `${C.orange}07`,
          borderLeft: `2px solid ${C.orange}`,
          borderRadius: "0 5px 5px 0",
        }}
      >
        <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
          ✦ Evidence pending is the operational bottleneck. Sentiment collapses once cases move toward final decision and escalation risk.
        </span>
      </div>
    </Bx>
  );
}

function RiskBreakdownPanel() {
  const maxConduct = Math.max(...RECOVERY_CONDUCT_RISKS.map((r) => r.count));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12 }}>
      <div>
        <div
          style={{
            fontSize: 10,
            color: C.dim,
            textTransform: "uppercase",
            fontWeight: 800,
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          Escalation Pipeline
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RISK_PIPELINE.map((r, idx) => (
            <div
              key={r.label}
              style={{
                background: idx === 0 ? `${C.red}08` : "rgba(255,255,255,0.025)",
                borderTop: `1px solid ${idx === 0 ? `${C.red}25` : C.border}`,
                borderRight: `1px solid ${idx === 0 ? `${C.red}25` : C.border}`,
                borderBottom: `1px solid ${idx === 0 ? `${C.red}25` : C.border}`,
                borderLeft: `3px solid ${r.color}`,
                borderRadius: "0 8px 8px 0",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "46px 1fr 150px",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div>
                  <M s={24} c={r.color}>
                    {r.value}
                  </M>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text,
                      fontWeight: 800,
                      marginBottom: 2,
                    }}
                  >
                    {r.label}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted }}>{r.sub}</div>

                  <div
                    style={{
                      marginTop: 7,
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.pct}%`,
                        height: "100%",
                        background: r.color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    padding: "7px 8px",
                  }}
                >
                  <div style={{ fontSize: 8, color: C.dim, textTransform: "uppercase", fontWeight: 700 }}>
                    Owner
                  </div>
                  <div style={{ fontSize: 10, color: C.sub, fontWeight: 700, marginBottom: 4 }}>{r.owner}</div>
                  <div style={{ fontSize: 9, color: r.color, fontWeight: 700 }}>→ {r.action}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div
            style={{
              fontSize: 10,
              color: C.dim,
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Recovery Conduct Risk
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            {RECOVERY_CONDUCT_RISKS.map((r) => {
              const pct = Math.round((r.count / maxConduct) * 100);

              return (
                <div key={r.issue} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 10, color: C.sub }}>{r.issue}</span>
                    <M s={11} c={r.color}>
                      {r.count}
                    </M>
                  </div>

                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: r.color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 10,
              color: C.dim,
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Today&apos;s Risk Queue
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {RISK_ACTION_QUEUE.map((r) => (
              <div
                key={r.label}
                style={{
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}25`,
                  borderRadius: 8,
                  padding: "10px 10px",
                  minHeight: 104,
                }}
              >
                <M s={24} c={r.color}>
                  {r.count}
                </M>
                <div
                  style={{
                    fontSize: 10,
                    color: C.text,
                    fontWeight: 800,
                    marginTop: 5,
                    lineHeight: 1.25,
                  }}
                >
                  {r.label}
                </div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 4, lineHeight: 1.35 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "8px 10px",
            background: `${C.red}07`,
            borderLeft: `2px solid ${C.red}`,
            borderRadius: "0 5px 5px 0",
          }}
        >
          <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.45 }}>
            ✦ Risk is not only complaint count. The real risk is aging + broken promise + recovery conduct. Same-day
            closure should focus on 8 escalatable cases first.
          </span>
        </div>
      </div>
    </div>
  );
}

type OwnershipLens = "segment" | "queue" | "partner" | "risk";

type OwnershipSeverity = "Critical" | "High" | "Watch" | "Stable";

type OwnershipCard = {
  name: string;
  label: string;
  value: string;
  valueLabel: string;
  severity: OwnershipSeverity;
  color: string;
  owner: string;
  issue: string;
  action: string;
  evidence: string;
  chain: {
    segment: string;
    queue: string;
    partner: string;
    risk: string;
  };
};

type OwnershipLensData = {
  title: string;
  subtitle: string;
  insight: string;
  strongestActions: {
    title: string;
    owner: string;
    impact: string;
    priority: OwnershipSeverity;
    color: string;
  }[];
  cards: OwnershipCard[];
};

const OWNER_LENS_DATA: Record<OwnershipLens, OwnershipLensData> = {
  segment: {
    title: "Segment Ownership",
    subtitle: "Which cardholder segment is being failed by service?",
    insight:
      "HSHF is the highest business-risk segment because repeat dispute follow-up is high and service failure directly impacts spend retention.",
    strongestActions: [
      {
        title: "Route HSHF disputes and service recovery cases in-house",
        owner: "Dispute Ops",
        impact: "Protect high-value cardholders and reduce external escalation risk.",
        priority: "Critical",
        color: C.red,
      },
      {
        title: "Create same-call fee waiver decision path",
        owner: "Billing Ops",
        impact: "Reduce HSLF fee-waiver repeat contacts and broken promise language.",
        priority: "High",
        color: C.orange,
      },
      {
        title: "Auto-escalate missed callback promises",
        owner: "Care Ops",
        impact: "Lower LSLF callback dissatisfaction and repeat follow-up load.",
        priority: "Watch",
        color: C.yellow,
      },
    ],
    cards: [
      {
        name: "HSHF",
        label: "High Spend / High Frequency",
        value: "1,240",
        valueLabel: "failures",
        severity: "Critical",
        color: C.red,
        owner: "Dispute Ops",
        issue: "Dispute update promise is breaking for high-value cardholders.",
        action: "Route HSHF disputes to in-house priority queue.",
        evidence: "“I have called three times and still no dispute update.”",
        chain: {
          segment: "HSHF",
          queue: "Vendor Beta + In-house Dispute",
          partner: "Amazon Pay / Travel co-brand",
          risk: "8 escalatable cases",
        },
      },
      {
        name: "HSLF",
        label: "High Spend / Low Frequency",
        value: "980",
        valueLabel: "failures",
        severity: "High",
        color: C.orange,
        owner: "Billing Ops",
        issue: "Fee waiver and benefit promises are not fulfilled after agent commitment.",
        action: "Create same-call fee waiver decision path.",
        evidence: "“Agent promised the waiver, but the fee is still in the next bill.”",
        chain: {
          segment: "HSLF",
          queue: "Billing Ops",
          partner: "Cashback / reward partners",
          risk: "Fee-value dissatisfaction",
        },
      },
      {
        name: "LSHF",
        label: "Low Spend / High Frequency",
        value: "1,620",
        valueLabel: "failures",
        severity: "High",
        color: C.orange,
        owner: "Digital + Service",
        issue: "Payment status and failed-transaction support are creating repeat contacts.",
        action: "Improve payment-status and failed-transaction self-serve explanations.",
        evidence: "“Payment failed but money is debited. No one is explaining the status.”",
        chain: {
          segment: "LSHF",
          queue: "Digital Service Queue",
          partner: "RuPay / payment network",
          risk: "High contact volume",
        },
      },
      {
        name: "LSLF",
        label: "Low Spend / Low Frequency",
        value: "860",
        valueLabel: "failures",
        severity: "Watch",
        color: C.yellow,
        owner: "Care Ops",
        issue: "Callback promises are not being completed.",
        action: "Create callback SLA queue and auto-alert missed callbacks.",
        evidence: "“Nobody called back even though the agent promised 24 hours.”",
        chain: {
          segment: "LSLF",
          queue: "Care Ops",
          partner: "None",
          risk: "Callback dissatisfaction",
        },
      },
    ],
  },

  queue: {
    title: "Queue Ownership",
    subtitle: "Which internal or outsourced queue is creating repeat contact?",
    insight:
      "Vendor Beta and Recovery Queue are the two ownership hotspots because they combine poor close sentiment with high repeat contact.",
    strongestActions: [
      {
        title: "Cap Vendor Beta to low-complexity cases within 48 hours",
        owner: "Vendor Management",
        impact: "Reduce repeat contact and move high-risk disputes to stronger teams.",
        priority: "Critical",
        color: C.red,
      },
      {
        title: "Keep HSHF and 14+ day disputes in-house",
        owner: "Dispute Ops",
        impact: "Preserve close quality on high-risk queues.",
        priority: "High",
        color: C.orange,
      },
      {
        title: "Run weekly queue-level close sentiment review",
        owner: "Service Ops",
        impact: "Detect queue deterioration before repeat spikes.",
        priority: "Watch",
        color: C.yellow,
      },
    ],
    cards: [
      {
        name: "Vendor Beta",
        label: "Outsourced dispute queue",
        value: "52%",
        valueLabel: "repeat",
        severity: "Critical",
        color: C.red,
        owner: "Vendor Management",
        issue: "Worst repeat-contact rate and weakest close sentiment.",
        action: "Cap to low-complexity cases and move high-risk disputes in-house.",
        evidence: "Close sentiment is -0.56 vs in-house -0.24.",
        chain: {
          segment: "HSHF / HSLF",
          queue: "Vendor Beta",
          partner: "Amazon / Flipkart cases",
          risk: "Repeat contact + escalation",
        },
      },
      {
        name: "Recovery Queue",
        label: "Collections / recovery handling",
        value: "64",
        valueLabel: "conduct complaints",
        severity: "Critical",
        color: C.red,
        owner: "Recovery Ops",
        issue: "Recovery conduct complaints are creating reputation risk.",
        action: "Audit recovery scripts, call timing, and family-contact violations.",
        evidence: "“Collection agent called my office and spoke to my colleague.”",
        chain: {
          segment: "LSLF",
          queue: "Recovery Queue",
          partner: "None",
          risk: "Conduct escalation",
        },
      },
      {
        name: "Vendor Alpha",
        label: "Low-complexity vendor queue",
        value: "31%",
        valueLabel: "repeat",
        severity: "Watch",
        color: C.yellow,
        owner: "Vendor Management",
        issue: "Acceptable only for low-complexity service requests.",
        action: "Keep Vendor Alpha restricted to simple cases.",
        evidence: "Repeat contact is better than Vendor Beta, but weaker than in-house.",
        chain: {
          segment: "HSLF / LSHF",
          queue: "Vendor Alpha",
          partner: "Low-complexity cases",
          risk: "Complexity creep",
        },
      },
      {
        name: "In-house Dispute",
        label: "Best-performing dispute queue",
        value: "22%",
        valueLabel: "repeat",
        severity: "Stable",
        color: C.green,
        owner: "Dispute Ops",
        issue: "Strongest close quality and lowest repeat rate.",
        action: "Keep HSHF, 14+ day, and high-value disputes here.",
        evidence: "In-house close sentiment is -0.24 with the lowest repeat rate.",
        chain: {
          segment: "HSHF",
          queue: "In-house Dispute",
          partner: "High-risk cases",
          risk: "Risk reduction",
        },
      },
    ],
  },

  partner: {
    title: "Partner Ownership",
    subtitle: "Which partner dependency is increasing service failure?",
    insight:
      "Partner blame-shift is a service failure because the cardholder experiences one card brand, not separate partner and bank back offices.",
    strongestActions: [
      {
        title: "Launch joint resolution SOP with major co-brand partners",
        owner: "Partnerships",
        impact: "Reduce partner blame-shift, refund follow-ups, and dispute aging.",
        priority: "High",
        color: C.orange,
      },
      {
        title: "Create shared refund-status visibility for care agents",
        owner: "Partnerships + Care Ops",
        impact: "Cut callback loops caused by missing handoff visibility.",
        priority: "High",
        color: C.orange,
      },
      {
        title: "Publish partner-specific promise wording in scripts",
        owner: "Training + Partnerships",
        impact: "Prevent over-promising on partner-controlled timelines.",
        priority: "Watch",
        color: C.yellow,
      },
    ],
    cards: [
      {
        name: "Amazon Pay card",
        label: "Co-brand refund issue",
        value: "312",
        valueLabel: "complaints",
        severity: "High",
        color: C.orange,
        owner: "Partnerships",
        issue: "Customers are bounced between bank and partner for refund ownership.",
        action: "Create joint refund ownership SOP with partner.",
        evidence: "“Bank says contact Amazon. Amazon says contact bank. I am stuck.”",
        chain: {
          segment: "HSLF",
          queue: "Vendor Beta",
          partner: "Amazon Pay",
          risk: "Partner blame-shift",
        },
      },
      {
        name: "Flipkart card",
        label: "Refund delay",
        value: "184",
        valueLabel: "complaints",
        severity: "Watch",
        color: C.yellow,
        owner: "Partnerships",
        issue: "Refund status visibility is weak between partner and bank.",
        action: "Build shared refund-status view for care agents.",
        evidence: "“Refund not credited after return.”",
        chain: {
          segment: "HSLF",
          queue: "Partner Ops",
          partner: "Flipkart",
          risk: "Refund delay",
        },
      },
      {
        name: "Online gaming merchants",
        label: "Unrecognized charge disputes",
        value: "268",
        valueLabel: "complaints",
        severity: "Critical",
        color: C.red,
        owner: "Dispute Ops",
        issue: "Gaming merchant disputes have high anger and unclear authorization narratives.",
        action: "Create merchant-category dispute playbook.",
        evidence: "“I never played, but charges keep coming.”",
        chain: {
          segment: "LSHF",
          queue: "Dispute Ops",
          partner: "Gaming merchants",
          risk: "Fraud dispute escalation",
        },
      },
      {
        name: "Travel co-brand",
        label: "Miles / benefit credit issue",
        value: "142",
        valueLabel: "complaints",
        severity: "Watch",
        color: C.yellow,
        owner: "Partnerships",
        issue: "Travel benefit crediting is creating premium-value dissatisfaction.",
        action: "Agree benefit-credit SLA and visibility with travel partner.",
        evidence: "“Miles were not credited after the flight.”",
        chain: {
          segment: "HSHF",
          queue: "Partnerships",
          partner: "Travel co-brand",
          risk: "Benefit trust erosion",
        },
      },
    ],
  },

  risk: {
    title: "Escalation Ownership",
    subtitle: "Which risk needs same-day recovery or senior ownership?",
    insight:
      "The immediate risk is not count alone. It is aging plus broken promise plus conduct failure.",
    strongestActions: [
      {
        title: "Close externally escalatable cases today",
        owner: "Dispute Ops + Legal",
        impact: "Prevent external escalation and reduce compensation / reputation risk.",
        priority: "Critical",
        color: C.red,
      },
      {
        title: "Move approaching-threshold cases into 14-day watchlist",
        owner: "Dispute Ops",
        impact: "Intercept risk before it becomes externally escalatable.",
        priority: "High",
        color: C.orange,
      },
      {
        title: "QA audit recovery conduct and call-hour compliance",
        owner: "Recovery Ops",
        impact: "Reduce conduct complaints and reputational escalation.",
        priority: "Critical",
        color: C.red,
      },
    ],
    cards: [
      {
        name: "Externally escalatable",
        label: "Past threshold",
        value: "8",
        valueLabel: "cases",
        severity: "Critical",
        color: C.red,
        owner: "Dispute Ops + Legal",
        issue: "Eight cases need same-day recovery before escalation worsens.",
        action: "Close all eight cases today with legal and dispute ops oversight.",
        evidence: "“No update for more than a month. I will escalate now.”",
        chain: {
          segment: "HSHF / LSHF",
          queue: "Dispute Ops + Legal",
          partner: "Merchant disputes",
          risk: "External escalation",
        },
      },
      {
        name: "Approaching threshold",
        label: "Early warning",
        value: "23",
        valueLabel: "cases",
        severity: "High",
        color: C.orange,
        owner: "Dispute Ops",
        issue: "Cases are approaching escalation window and need early recovery.",
        action: "Move all approaching cases into 14-day watchlist and callback queue.",
        evidence: "“It has been weeks and no one is giving a clear answer.”",
        chain: {
          segment: "HSHF",
          queue: "Dispute Ops",
          partner: "Multiple",
          risk: "Early warning",
        },
      },
      {
        name: "Recovery conduct",
        label: "Reputation risk",
        value: "64",
        valueLabel: "complaints",
        severity: "Critical",
        color: C.red,
        owner: "Recovery Ops",
        issue: "Recovery conduct complaints are creating reputational risk.",
        action: "QA audit recovery scripts, call-hour compliance, and family-contact complaints.",
        evidence: "“Your recovery agent called my office and spoke to my colleague.”",
        chain: {
          segment: "LSLF",
          queue: "Recovery Queue",
          partner: "None",
          risk: "Conduct escalation",
        },
      },
      {
        name: "Filed this month",
        label: "Active external complaints",
        value: "14",
        valueLabel: "active",
        severity: "High",
        color: C.orange,
        owner: "Legal + Service",
        issue: "Filed complaints need root-cause handling, not only case closure.",
        action: "Run root-cause review and feed fixes to Service Ops.",
        evidence: "Filed complaints cluster around dispute aging, fee waiver promises, and partner blame-shift.",
        chain: {
          segment: "Mixed",
          queue: "Legal + Service",
          partner: "Multiple",
          risk: "Active complaints",
        },
      },
    ],
  },
};

function riskColor(severity: OwnershipSeverity) {
  if (severity === "Critical") return C.red;
  if (severity === "High") return C.orange;
  if (severity === "Watch") return C.yellow;
  return C.green;
}

function OwnershipLensTabs({
  lens,
  onChange,
}: {
  lens: OwnershipLens;
  onChange: (lens: OwnershipLens) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
      {(
        [
          ["segment", "Segment"],
          ["queue", "Queue"],
          ["partner", "Partner"],
          ["risk", "Risk"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          style={{
            background: lens === key ? C.purple : "rgba(255,255,255,0.05)",
            color: lens === key ? "#fff" : C.muted,
            border: `1px solid ${lens === key ? C.purple : C.border}`,
            borderRadius: 7,
            padding: "8px 12px",
            fontSize: 10,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function OwnershipItemCard({ item }: { item: OwnershipCard }) {
  const sevColor = riskColor(item.severity);

  return (
    <div
      style={{
        background: `${item.color}07`,
        borderTop: `1px solid ${item.color}28`,
        borderRight: `1px solid ${item.color}28`,
        borderBottom: `1px solid ${item.color}28`,
        boxShadow: `inset 3px 0 0 ${item.color}`,
        borderRadius: 11,
        padding: "12px 13px",
        minHeight: 170,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: C.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.name}
          </div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>{item.label}</div>
        </div>
        <Bd c={sevColor}>{item.severity}</Bd>
      </div>

      <div style={{ marginBottom: 8 }}>
        <M s={24} c={item.color}>
          {item.value}
        </M>
        <span style={{ fontSize: 9, color: C.muted, marginLeft: 5 }}>{item.valueLabel}</span>
      </div>

      <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.4, marginBottom: 8 }}>{item.issue}</div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 9, color: C.muted }}>
          Owner: <strong style={{ color: C.text }}>{item.owner}</strong>
        </div>
        <div style={{ fontSize: 9, color: item.color, fontWeight: 800, marginTop: 4, lineHeight: 1.35 }}>
          → {item.action}
        </div>
      </div>
    </div>
  );
}

function OwnershipLinkedChain({ cards }: { cards: OwnershipCard[] }) {
  const primary = cards[0];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${C.border}`,
        borderRadius: 11,
        padding: "11px 12px",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: C.text, marginBottom: 8 }}>Linked ownership chain</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {[
          ["Segment", primary.chain.segment, C.gold],
          ["Queue", primary.chain.queue, C.red],
          ["Partner", primary.chain.partner, C.orange],
          ["Risk", primary.chain.risk, C.purple],
        ].map(([label, value, color]) => (
          <div
            key={String(label)}
            style={{
              background: `${color}08`,
              border: `1px solid ${color}25`,
              borderRadius: 8,
              padding: "9px 10px",
              minHeight: 66,
            }}
          >
            <div style={{ fontSize: 8, color: C.dim, textTransform: "uppercase", fontWeight: 900 }}>{label}</div>
            <div style={{ fontSize: 10, color: C.text, marginTop: 5, lineHeight: 1.35 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnershipActionPanel({ data }: { data: OwnershipLensData }) {
  const actions = data.strongestActions;
  const topAction = actions[0];

  return (
    <div
      style={{
        background: `${topAction?.color ?? C.purple}07`,
        borderTop: `1px solid ${(topAction?.color ?? C.purple)}28`,
        borderRight: `1px solid ${(topAction?.color ?? C.purple)}28`,
        borderBottom: `1px solid ${(topAction?.color ?? C.purple)}28`,
        boxShadow: `inset 3px 0 0 ${topAction?.color ?? C.purple}`,
        borderRadius: 11,
        padding: "12px 13px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: C.text, marginBottom: 3 }}>Strongest actions</div>
      <div style={{ fontSize: 9, color: C.muted, marginBottom: 10 }}>For selected ownership lens</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0 }}>
        {actions.map((action, idx) => (
          <div
            key={`${action.title}-${idx}`}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderTop: `1px solid ${action.color}28`,
              borderRight: `1px solid ${action.color}28`,
              borderBottom: `1px solid ${action.color}28`,
              boxShadow: `inset 3px 0 0 ${action.color}`,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.text, lineHeight: 1.35 }}>
                {idx + 1}. {action.title}
              </div>
              <Bd c={action.color}>{action.priority}</Bd>
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>
              Owner: <strong style={{ color: C.text }}>{action.owner}</strong>
            </div>
            <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.35 }}>Impact: {action.impact}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "8px 10px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          color: C.sub,
          fontSize: 10,
          lineHeight: 1.45,
        }}
      >
        ✦ This keeps the board action-led instead of becoming a table of observations.
      </div>
    </div>
  );
}

function OwnershipEvidenceStrip({ cards }: { cards: OwnershipCard[] }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: `${C.purple}08`,
        borderLeft: `3px solid ${C.purple}`,
        color: C.sub,
        fontSize: 11,
        lineHeight: 1.5,
      }}
    >
      ✦ <strong style={{ color: C.text }}>Conversation evidence:</strong>{" "}
      {cards
        .slice(0, 2)
        .map((c) => c.evidence)
        .join(" · ")}
    </div>
  );
}

function OwnershipBoard() {
  const [lens, setLens] = useState<OwnershipLens>("segment");
  const data = OWNER_LENS_DATA[lens];

  return (
    <Bx accent={C.purple} s={{ padding: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: C.text }}>Operational Ownership Board</h3>
          <p style={{ fontSize: 11, color: C.muted, margin: "5px 0 0", lineHeight: 1.35 }}>
            Switch between Segment, Queue, Partner, and Risk to see who owns the service recovery.
          </p>
        </div>

        <OwnershipLensTabs lens={lens} onChange={setLens} />
      </div>

      <div
        style={{
          padding: "11px 13px",
          borderRadius: 10,
          background: `${C.purple}08`,
          borderLeft: `3px solid ${C.purple}`,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{data.title}</div>
        <div style={{ fontSize: 10, color: C.sub, marginTop: 3 }}>{data.subtitle}</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>✦ {data.insight}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {data.cards.map((item) => (
              <OwnershipItemCard key={item.name} item={item} />
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            <OwnershipLinkedChain cards={data.cards} />
          </div>
        </div>

        <OwnershipActionPanel data={data} />
      </div>

      <OwnershipEvidenceStrip cards={data.cards} />
    </Bx>
  );
}

function EvidenceCard() {
  return (
    <Bx s={{ minHeight: 320 }}>
      <Hd sub="Anonymised service-promise breach snippets. Only top evidence shown." badge="AI">
        Conversation Evidence
      </Hd>

      {EVIDENCE_SNIPPETS.map((e, i) => (
        <div
          key={`${e.ch}-${e.seg}-${i}`}
          style={{
            padding: "8px 9px",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${C.border}`,
            borderRadius: 5,
            marginBottom: 7,
          }}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
            <Bd c={CH[e.ch]}>{e.ch}</Bd>
            <Bd c={SEG[e.seg]}>{e.seg}</Bd>
            <Bd c={C.red}>{e.type}</Bd>
          </div>
          <p style={{ fontSize: 11, color: C.text, margin: 0, lineHeight: 1.45, fontStyle: "italic" }}>
            “{e.text}”
          </p>
        </div>
      ))}
    </Bx>
  );
}

function ActionCard() {
  return (
    <Bx accent={C.green} s={{ minHeight: 320 }}>
      <Hd sub="Only top actions shown on the executive view.">Recommended Actions</Hd>

      {RECOMMENDED_ACTIONS.map((a) => (
        <div
          key={a.title}
          style={{
            padding: "9px 10px",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            marginBottom: 7,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: C.text, lineHeight: 1.35 }}>{a.title}</span>
            <Bd c={a.c}>{a.p}</Bd>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Owner: {a.owner}</div>
          <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.35 }}>Impact: {a.impact}</div>
        </div>
      ))}
    </Bx>
  );
}

/** Body only — parent supplies DrillPageHeader + shell. */
export function ServicePromiseIndiaDrillBody() {
  return (
    <div
      style={{
        fontFamily: "var(--font), system-ui, sans-serif",
        color: C.text,
        fontSize: 11,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      {/* ROW 1: executive answer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1.22fr)",
          gap: 10,
        }}
      >
        <ServiceScoreCard />
        <WorryWall />
      </div>

      {/* ROW 2: compact promise view */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
          gap: 10,
        }}
      >
        <PromisePerformanceChart />
        <AgentPromiseBreakage />
      </div>

      {/* ROW 3: plots instead of long tables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
          gap: 10,
        }}
      >
        <ServiceFailureRanking />
        <DisputeRecoveryFunnel />
      </div>

      {/* ROW 4: combined ownership board */}
      <OwnershipBoard />

      {/* ROW 5: proof + action */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
          gap: 10,
        }}
      >
        <EvidenceCard />
        <ActionCard />
      </div>
    </div>
  );
}

export default ServicePromiseIndiaDrillBody;