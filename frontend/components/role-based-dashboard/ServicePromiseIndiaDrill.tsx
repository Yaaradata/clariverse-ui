"use client";

import { type CSSProperties, type ReactNode, useMemo, useState } from "react";

/*
 * Head of Credit Cards (V3) — Are we keeping our service promise?
 * Compact executive version:
 * Service Promise Score + Risk Wall
 * Service Failure Map + Dispute Recovery Funnel
 * Ownership Board
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

type SegmentKey = "HSHF" | "HSLF" | "LSHF" | "LSLF";
type CardKind = "standalone" | "cobrand";

type Category =
  | "all"
  | "cashback"
  | "rewards"
  | "intro_apr"
  | "travel"
  | "balance_transfer"
  | "no_annual_fee"
  | "business";

type SegmentMetric = {
  failures: number;
  repeat: number;
  sentiment: number;
  topIssue: string;
  owner: string;
};

type CardProduct = {
  name: string;
  kind: CardKind;
  partner?: string;
  categories: Exclude<Category, "all">[];
  bySegment: Record<SegmentKey, SegmentMetric>;
};

const SEGMENT_LABEL: Record<SegmentKey, string> = {
  HSHF: "High Spend / High Frequency",
  HSLF: "High Spend / Low Frequency",
  LSHF: "Low Spend / High Frequency",
  LSLF: "Low Spend / Low Frequency",
};

const SEGMENT_COLOR: Record<SegmentKey, string> = {
  HSHF: C.gold,
  HSLF: C.cyan,
  LSHF: C.purple,
  LSLF: C.orange,
};

const CATEGORY_ORDER: Category[] = [
  "all",
  "cashback",
  "rewards",
  "intro_apr",
  "travel",
  "balance_transfer",
  "no_annual_fee",
  "business",
];

const CATEGORY_LABEL: Record<Category, string> = {
  all: "All cards",
  cashback: "Cash back",
  rewards: "Rewards",
  intro_apr: "0% intro APR",
  travel: "Travel",
  balance_transfer: "Balance transfer",
  no_annual_fee: "No annual fee",
  business: "Business",
};

const KIND_LABEL: Record<CardKind, string> = {
  standalone: "Standalone",
  cobrand: "Co-brand",
};

const KIND_COLOR: Record<CardKind, string> = {
  standalone: C.gold,
  cobrand: C.purple,
};

/**
 * Wells Fargo-style product naming.
 * Metrics are demo/simulated conversation-derived service failure metrics.
 * The important modeling rule:
 * - standalone = bank-owned SLA path
 * - cobrand = partner + bank SLA path
 */
const CARD_PRODUCTS: CardProduct[] = [
  {
    name: "Active Cash Card",
    kind: "standalone",
    categories: ["cashback", "no_annual_fee", "balance_transfer"],
    bySegment: {
      HSHF: { failures: 180, repeat: 32, sentiment: -0.41, topIssue: "Cash-back posting delay", owner: "Billing Ops" },
      HSLF: { failures: 220, repeat: 38, sentiment: -0.45, topIssue: "Statement bonus dispute", owner: "Billing Ops" },
      LSHF: { failures: 320, repeat: 41, sentiment: -0.46, topIssue: "Failed transaction status", owner: "Service Ops" },
      LSLF: { failures: 240, repeat: 35, sentiment: -0.43, topIssue: "Callback missed", owner: "Care Ops" },
    },
  },
  {
    name: "Attune Card",
    kind: "standalone",
    categories: ["cashback", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 70, repeat: 28, sentiment: -0.38, topIssue: "Lifestyle MCC dispute", owner: "Billing Ops" },
      HSLF: { failures: 95, repeat: 32, sentiment: -0.41, topIssue: "Bonus posting delay", owner: "Billing Ops" },
      LSHF: { failures: 140, repeat: 36, sentiment: -0.43, topIssue: "Failed merchant transaction", owner: "Service Ops" },
      LSLF: { failures: 85, repeat: 26, sentiment: -0.36, topIssue: "Callback missed", owner: "Care Ops" },
    },
  },
  {
    name: "Autograph Card",
    kind: "standalone",
    categories: ["rewards", "travel", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 240, repeat: 42, sentiment: -0.48, topIssue: "3X category miscoded", owner: "Rewards Ops" },
      HSLF: { failures: 195, repeat: 39, sentiment: -0.45, topIssue: "Bonus point shortfall", owner: "Rewards Ops" },
      LSHF: { failures: 165, repeat: 34, sentiment: -0.42, topIssue: "Redemption stuck", owner: "Service Ops" },
      LSLF: { failures: 110, repeat: 28, sentiment: -0.38, topIssue: "Statement query", owner: "Care Ops" },
    },
  },
  {
    name: "Autograph Journey Card",
    kind: "standalone",
    categories: ["travel", "rewards"],
    bySegment: {
      HSHF: { failures: 280, repeat: 38, sentiment: -0.44, topIssue: "Travel insurance aging", owner: "Dispute Ops" },
      HSLF: { failures: 145, repeat: 35, sentiment: -0.43, topIssue: "Travel credit not posted", owner: "Rewards Ops" },
      LSHF: { failures: 60, repeat: 28, sentiment: -0.36, topIssue: "Travel category mismatch", owner: "Service Ops" },
      LSLF: { failures: 22, repeat: 22, sentiment: -0.32, topIssue: "Statement clarity", owner: "Care Ops" },
    },
  },
  {
    name: "Reflect Card",
    kind: "standalone",
    categories: ["intro_apr", "balance_transfer", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 95, repeat: 31, sentiment: -0.42, topIssue: "Balance transfer fee dispute", owner: "Billing Ops" },
      HSLF: { failures: 280, repeat: 49, sentiment: -0.54, topIssue: "Intro APR end confusion", owner: "Billing Ops" },
      LSHF: { failures: 220, repeat: 44, sentiment: -0.51, topIssue: "BT credit posting", owner: "Billing Ops" },
      LSLF: { failures: 165, repeat: 36, sentiment: -0.45, topIssue: "Late fee on transfer balance", owner: "Care Ops" },
    },
  },
  {
    name: "Signify Business Cash Card",
    kind: "standalone",
    categories: ["business", "cashback", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 165, repeat: 38, sentiment: -0.45, topIssue: "Business cash-back tier dispute", owner: "Business Service Ops" },
      HSLF: { failures: 140, repeat: 35, sentiment: -0.43, topIssue: "Statement bonus query", owner: "Business Service Ops" },
      LSHF: { failures: 230, repeat: 41, sentiment: -0.47, topIssue: "Failed B2B transaction", owner: "Business Service Ops" },
      LSLF: { failures: 95, repeat: 28, sentiment: -0.38, topIssue: "Statement clarity", owner: "Care Ops" },
    },
  },

  {
    name: "One Key Card",
    kind: "cobrand",
    partner: "Expedia / Hotels.com / Vrbo",
    categories: ["travel", "rewards", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 260, repeat: 49, sentiment: -0.56, topIssue: "OneKeyCash posting delay", owner: "Partnerships + Rewards Ops" },
      HSLF: { failures: 190, repeat: 44, sentiment: -0.5, topIssue: "Travel booking credit dispute", owner: "Partnerships" },
      LSHF: { failures: 120, repeat: 36, sentiment: -0.43, topIssue: "Partner refund status", owner: "Partner Recovery Queue" },
      LSLF: { failures: 58, repeat: 29, sentiment: -0.37, topIssue: "Benefit explanation", owner: "Care Ops" },
    },
  },
  {
    name: "One Key+ Card",
    kind: "cobrand",
    partner: "Expedia / Hotels.com / Vrbo",
    categories: ["travel", "rewards"],
    bySegment: {
      HSHF: { failures: 210, repeat: 47, sentiment: -0.54, topIssue: "Gold / Platinum tier benefit gap", owner: "Partnerships" },
      HSLF: { failures: 135, repeat: 41, sentiment: -0.48, topIssue: "Annual travel benefit not visible", owner: "Partnerships" },
      LSHF: { failures: 80, repeat: 32, sentiment: -0.41, topIssue: "Travel credit posting", owner: "Service Ops" },
      LSLF: { failures: 30, repeat: 24, sentiment: -0.34, topIssue: "Statement clarity", owner: "Care Ops" },
    },
  },
  {
    name: "Choice Privileges Mastercard",
    kind: "cobrand",
    partner: "Choice Hotels",
    categories: ["travel", "rewards", "no_annual_fee", "balance_transfer"],
    bySegment: {
      HSHF: { failures: 142, repeat: 41, sentiment: -0.49, topIssue: "Hotel benefit not applied", owner: "Partnerships" },
      HSLF: { failures: 110, repeat: 38, sentiment: -0.46, topIssue: "Bonus night dispute", owner: "Partnerships" },
      LSHF: { failures: 65, repeat: 30, sentiment: -0.4, topIssue: "Reward booking error", owner: "Service Ops" },
      LSLF: { failures: 24, repeat: 22, sentiment: -0.32, topIssue: "Statement query", owner: "Care Ops" },
    },
  },
  {
    name: "Choice Privileges Select Mastercard",
    kind: "cobrand",
    partner: "Choice Hotels",
    categories: ["travel", "rewards"],
    bySegment: {
      HSHF: { failures: 120, repeat: 39, sentiment: -0.46, topIssue: "Elite status crediting", owner: "Partnerships" },
      HSLF: { failures: 88, repeat: 34, sentiment: -0.43, topIssue: "Annual stay bonus", owner: "Partnerships" },
      LSHF: { failures: 35, repeat: 26, sentiment: -0.36, topIssue: "Reward booking issue", owner: "Service Ops" },
      LSLF: { failures: 12, repeat: 18, sentiment: -0.28, topIssue: "Statement clarity", owner: "Care Ops" },
    },
  },
  {
    name: "Bilt Mastercard",
    kind: "cobrand",
    partner: "Bilt Rewards",
    categories: ["rewards", "travel", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 175, repeat: 43, sentiment: -0.49, topIssue: "Rent-day points posting", owner: "Partnerships + Rewards Ops" },
      HSLF: { failures: 132, repeat: 37, sentiment: -0.44, topIssue: "Transfer partner delay", owner: "Partnerships" },
      LSHF: { failures: 98, repeat: 33, sentiment: -0.41, topIssue: "Merchant earn mismatch", owner: "Service Ops" },
      LSLF: { failures: 44, repeat: 27, sentiment: -0.35, topIssue: "Benefit FAQ confusion", owner: "Care Ops" },
    },
  },
  {
    name: "BJ's One Mastercard",
    kind: "cobrand",
    partner: "BJ's Wholesale Club",
    categories: ["cashback", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 125, repeat: 36, sentiment: -0.44, topIssue: "Club cash-back tier dispute", owner: "Partnerships" },
      HSLF: { failures: 108, repeat: 34, sentiment: -0.42, topIssue: "Warehouse bonus not posted", owner: "Partnerships" },
      LSHF: { failures: 155, repeat: 38, sentiment: -0.45, topIssue: "Checkout earn mismatch", owner: "Service Ops" },
      LSLF: { failures: 72, repeat: 29, sentiment: -0.37, topIssue: "Statement clarity", owner: "Care Ops" },
    },
  },
  {
    name: "BJ's One+ Mastercard",
    kind: "cobrand",
    partner: "BJ's Wholesale Club",
    categories: ["cashback", "rewards", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 98, repeat: 33, sentiment: -0.41, topIssue: "Plus-tier earn dispute", owner: "Partnerships" },
      HSLF: { failures: 86, repeat: 31, sentiment: -0.39, topIssue: "Annual perk visibility", owner: "Partnerships" },
      LSHF: { failures: 118, repeat: 35, sentiment: -0.43, topIssue: "Gas / dining category coding", owner: "Service Ops" },
      LSLF: { failures: 54, repeat: 26, sentiment: -0.34, topIssue: "Callback on partner query", owner: "Care Ops" },
    },
  },
  {
    name: "Concur Business Mastercard",
    kind: "cobrand",
    partner: "Concur / SAP",
    categories: ["business", "rewards", "no_annual_fee"],
    bySegment: {
      HSHF: { failures: 142, repeat: 40, sentiment: -0.47, topIssue: "Expense sync failure", owner: "Business Service Ops" },
      HSLF: { failures: 128, repeat: 37, sentiment: -0.44, topIssue: "Corporate policy mismatch", owner: "Business Service Ops" },
      LSHF: { failures: 188, repeat: 42, sentiment: -0.48, topIssue: "Receipt dispute aging", owner: "Business Service Ops" },
      LSLF: { failures: 62, repeat: 28, sentiment: -0.36, topIssue: "Travel charge clarification", owner: "Care Ops" },
    },
  },
];

function filterByCategory(products: CardProduct[], category: Category) {
  if (category === "all") return products;
  return products.filter((p) => p.categories.includes(category));
}

function severityFor(repeat: number) {
  if (repeat >= 45) return { label: "Critical", color: C.red };
  if (repeat >= 35) return { label: "High", color: C.orange };
  if (repeat >= 25) return { label: "Watch", color: C.yellow };
  return { label: "Stable", color: C.green };
}

function repeatColor(n: number) {
  if (n >= 45) return C.red;
  if (n >= 35) return C.orange;
  if (n >= 25) return C.yellow;
  return C.green;
}

function sentimentColor(n: number) {
  if (n <= -0.55) return C.red;
  if (n <= -0.45) return C.orange;
  if (n <= -0.35) return C.yellow;
  return C.green;
}

function aggregateSegment(products: CardProduct[], segment: SegmentKey) {
  let totalFailures = 0;
  let weightedRepeat = 0;
  let weightedSentiment = 0;
  let cobrandFailures = 0;
  let standaloneFailures = 0;

  let topDriver: {
    cardName: string;
    issue: string;
    failures: number;
    kind: CardKind;
    owner: string;
  } | null = null;

  for (const product of products) {
    const metric = product.bySegment[segment];

    totalFailures += metric.failures;
    weightedRepeat += metric.repeat * metric.failures;
    weightedSentiment += metric.sentiment * metric.failures;

    if (product.kind === "cobrand") cobrandFailures += metric.failures;
    else standaloneFailures += metric.failures;

    if (!topDriver || metric.failures > topDriver.failures) {
      topDriver = {
        cardName: product.name,
        issue: metric.topIssue,
        failures: metric.failures,
        kind: product.kind,
        owner: metric.owner,
      };
    }
  }

  const repeat = totalFailures ? weightedRepeat / totalFailures : 0;
  const sentiment = totalFailures ? weightedSentiment / totalFailures : 0;
  const cobrandPct = totalFailures ? Math.round((cobrandFailures / totalFailures) * 100) : 0;
  const standalonePct = 100 - cobrandPct;

  return {
    totalFailures,
    repeat,
    sentiment,
    cobrandFailures,
    standaloneFailures,
    cobrandPct,
    standalonePct,
    topDriver,
  };
}

const SEGMENT_KEYS: SegmentKey[] = ["HSHF", "HSLF", "LSHF", "LSLF"];

type ProductDriverRow = {
  product: CardProduct;
  totalFailures: number;
  repeat: number;
  sentiment: number;
  topIssue: string;
  owner: string;
};

function getTopProductDrivers(products: CardProduct[], limit: number): ProductDriverRow[] {
  const rows: ProductDriverRow[] = products.map((product) => {
    let totalFailures = 0;
    let weightedRepeat = 0;
    let weightedSentiment = 0;
    let maxSegFailures = -1;
    let topSeg: SegmentKey = "HSHF";

    for (const seg of SEGMENT_KEYS) {
      const m = product.bySegment[seg];
      totalFailures += m.failures;
      weightedRepeat += m.repeat * m.failures;
      weightedSentiment += m.sentiment * m.failures;
      if (m.failures > maxSegFailures) {
        maxSegFailures = m.failures;
        topSeg = seg;
      }
    }

    const metric = product.bySegment[topSeg];

    return {
      product,
      totalFailures,
      repeat: totalFailures ? weightedRepeat / totalFailures : 0,
      sentiment: totalFailures ? weightedSentiment / totalFailures : 0,
      topIssue: metric.topIssue,
      owner: metric.owner,
    };
  });

  return rows
    .filter((r) => r.totalFailures > 0)
    .sort((a, b) => b.totalFailures - a.totalFailures)
    .slice(0, limit);
}

function categoryFitLabels(product: CardProduct): string {
  return product.categories.map((c) => CATEGORY_LABEL[c]).join(", ");
}

function executiveInsight(
  category: Category,
  filteredProducts: CardProduct[],
  coBrandShare: number,
  standaloneShare: number,
): string {
  const label = CATEGORY_LABEL[category];
  const drivers = getTopProductDrivers(filteredProducts, 1)[0];
  let worstSeg: SegmentKey = "HSHF";
  let worstFailures = -1;
  for (const seg of SEGMENT_KEYS) {
    const agg = aggregateSegment(filteredProducts, seg);
    if (agg.totalFailures > worstFailures) {
      worstFailures = agg.totalFailures;
      worstSeg = seg;
    }
  }

  const mixLead =
    coBrandShare > standaloneShare
      ? `Co-brand-led mix (${coBrandShare}% co-brand vs ${standaloneShare}% standalone)`
      : coBrandShare < standaloneShare
        ? `Standalone-led mix (${standaloneShare}% standalone vs ${coBrandShare}% co-brand)`
        : `Balanced co-brand / standalone (${coBrandShare}% / ${standaloneShare}%)`;

  const driverPhrase = drivers
    ? `${drivers.product.name} drives volume (${drivers.topIssue}).`
    : "No drivers in this slice.";

  return `${label}: ${mixLead}. ${driverPhrase} Highest failure load sits in ${worstSeg} (${SEGMENT_LABEL[worstSeg]}).`;
}

function Th({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "9px 12px",
        fontSize: 9,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: C.dim,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  muted,
  colSpan,
}: {
  children: ReactNode;
  align?: "left" | "right";
  muted?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        textAlign: align,
        padding: "11px 12px",
        fontSize: 11,
        color: muted ? C.muted : C.sub,
        verticalAlign: "middle",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {children}
    </td>
  );
}

function MixBar({ cobrandPct }: { cobrandPct: number }) {
  const standalonePct = 100 - cobrandPct;

  return (
    <div style={{ minWidth: 150 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          fontSize: 9,
          color: C.muted,
          marginBottom: 5,
          fontWeight: 800,
        }}
      >
        <span>
          Co-brand <M s={9} c={C.purple}>{cobrandPct}%</M>
        </span>
        <span>
          Standalone <M s={9} c={C.gold}>{standalonePct}%</M>
        </span>
      </div>

      <div
        style={{
          height: 6,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ width: `${cobrandPct}%`, background: C.purple }} />
        <div style={{ width: `${standalonePct}%`, background: C.gold }} />
      </div>
    </div>
  );
}

function CategoryFilterBar({
  category,
  onChange,
  counts,
}: {
  category: Category;
  onChange: (category: Category) => void;
  counts: Record<Category, number>;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {CATEGORY_ORDER.map((key) => {
        const active = key === category;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 11px",
              borderRadius: 8,
              border: `1px solid ${active ? C.purple : C.border}`,
              background: active ? C.purple : "rgba(255,255,255,0.025)",
              color: active ? "#fff" : C.sub,
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span>{CATEGORY_LABEL[key]}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                fontFamily: "var(--mono), ui-monospace, monospace",
                color: active ? "rgba(255,255,255,0.85)" : C.muted,
                background: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.05)",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SegmentOwnershipTable({ products }: { products: CardProduct[] }) {
  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 11,
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(255,255,255,0.025)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>Segment ownership</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 720 }}>
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>

          <thead>
            <tr style={{ background: "rgba(255,255,255,0.015)" }}>
              <Th>Segment</Th>
              <Th>Risk</Th>
              <Th align="right">Failures</Th>
              <Th>Co-brand / Standalone</Th>
              <Th align="right">Repeat</Th>
              <Th align="right">Sentiment</Th>
              <Th>Top driver</Th>
              <Th>Owner</Th>
            </tr>
          </thead>

          <tbody>
            {SEGMENT_KEYS.map((segment) => {
              const aggregate = aggregateSegment(products, segment);
              const severity = severityFor(aggregate.repeat);
              const accent = SEGMENT_COLOR[segment];

              return (
                <tr key={segment}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 3,
                          height: 32,
                          borderRadius: 2,
                          background: accent,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ color: C.text, fontWeight: 900, fontSize: 11 }}>{segment}</div>
                        <div style={{ color: C.muted, fontSize: 9, marginTop: 1 }}>
                          {SEGMENT_LABEL[segment]}
                        </div>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <Bd c={severity.color}>{severity.label}</Bd>
                  </Td>

                  <Td align="right">
                    <M s={12} c={accent}>
                      {aggregate.totalFailures.toLocaleString()}
                    </M>
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>failures</div>
                  </Td>

                  <Td>
                    <MixBar cobrandPct={aggregate.cobrandPct} />
                  </Td>

                  <Td align="right">
                    <M s={11} c={repeatColor(aggregate.repeat)}>
                      {aggregate.repeat.toFixed(0)}%
                    </M>
                  </Td>

                  <Td align="right">
                    <M s={11} c={sentimentColor(aggregate.sentiment)}>
                      {aggregate.sentiment.toFixed(2)}
                    </M>
                  </Td>

                  <Td>
                    {aggregate.topDriver ? (
                      <div>
                        <div style={{ color: C.sub, fontSize: 10, lineHeight: 1.35, marginBottom: 4 }}>
                          <span style={{ color: C.text, fontWeight: 800 }}>
                            {aggregate.topDriver.cardName}
                          </span>
                          {" — "}
                          {aggregate.topDriver.issue}
                        </div>
                        <Bd c={KIND_COLOR[aggregate.topDriver.kind]}>
                          {KIND_LABEL[aggregate.topDriver.kind]}
                        </Bd>
                      </div>
                    ) : (
                      <span style={{ color: C.muted }}>—</span>
                    )}
                  </Td>

                  <Td>
                    {aggregate.topDriver ? (
                      <span style={{ color: C.sub, fontSize: 10, lineHeight: 1.35 }}>
                        {aggregate.topDriver.owner}
                      </span>
                    ) : (
                      <span style={{ color: C.muted }}>—</span>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopCardDriversTable({
  products,
  category,
}: {
  products: CardProduct[];
  category: Category;
}) {
  const rows = getTopProductDrivers(products, 5);

  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 11,
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(255,255,255,0.025)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>Top card drivers</div>
        <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
          Top 5 products by total service failures in {CATEGORY_LABEL[category]}.
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 680 }}>
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>

          <thead>
            <tr style={{ background: "rgba(255,255,255,0.015)" }}>
              <Th>Card product</Th>
              <Th>Type</Th>
              <Th>Category fit</Th>
              <Th align="right">Failures</Th>
              <Th align="right">Repeat</Th>
              <Th align="right">Sentiment</Th>
              <Th>Top issue</Th>
              <Th>Owner</Th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <Td colSpan={8} muted>
                  No products in this category.
                </Td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.product.name}>
                  <Td>
                    <div style={{ color: C.text, fontWeight: 800, fontSize: 11 }}>{row.product.name}</div>
                    {row.product.partner ? (
                      <div style={{ color: C.muted, fontSize: 8, marginTop: 2 }}>{row.product.partner}</div>
                    ) : null}
                  </Td>
                  <Td>
                    <Bd c={KIND_COLOR[row.product.kind]}>{KIND_LABEL[row.product.kind]}</Bd>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 9, color: C.muted, lineHeight: 1.35 }}>
                      {categoryFitLabels(row.product)}
                    </span>
                  </Td>
                  <Td align="right">
                    <M s={11} c={C.text}>
                      {row.totalFailures.toLocaleString()}
                    </M>
                  </Td>
                  <Td align="right">
                    <M s={11} c={repeatColor(row.repeat)}>{row.repeat.toFixed(0)}%</M>
                  </Td>
                  <Td align="right">
                    <M s={11} c={sentimentColor(row.sentiment)}>{row.sentiment.toFixed(2)}</M>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.35 }}>{row.topIssue}</span>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 10, color: C.sub, lineHeight: 1.35 }}>{row.owner}</span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OwnershipBoard() {
  const [category, setCategory] = useState<Category>("cashback");

  const productCounts = useMemo<Record<Category, number>>(() => {
    const counts = {} as Record<Category, number>;

    for (const key of CATEGORY_ORDER) {
      counts[key] = filterByCategory(CARD_PRODUCTS, key).length;
    }

    return counts;
  }, []);

  const filteredProducts = useMemo(
    () => filterByCategory(CARD_PRODUCTS, category),
    [category],
  );

  const portfolioTotal = useMemo(() => {
    return filteredProducts.reduce((sum, product) => {
      return (
        sum +
        product.bySegment.HSHF.failures +
        product.bySegment.HSLF.failures +
        product.bySegment.LSHF.failures +
        product.bySegment.LSLF.failures
      );
    }, 0);
  }, [filteredProducts]);

  const coBrandFailures = useMemo(() => {
    return filteredProducts
      .filter((p) => p.kind === "cobrand")
      .reduce((sum, product) => {
        return (
          sum +
          product.bySegment.HSHF.failures +
          product.bySegment.HSLF.failures +
          product.bySegment.LSHF.failures +
          product.bySegment.LSLF.failures
        );
      }, 0);
  }, [filteredProducts]);

  const coBrandShare = portfolioTotal ? Math.round((coBrandFailures / portfolioTotal) * 100) : 0;
  const standaloneShare = 100 - coBrandShare;

  const aiInsight = useMemo(
    () => executiveInsight(category, filteredProducts, coBrandShare, standaloneShare),
    [category, filteredProducts, coBrandShare, standaloneShare],
  );

  return (
    <Bx accent={C.purple} s={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: C.text }}>
            Operational Ownership Board
          </h3>
          <p style={{ fontSize: 11, color: C.muted, margin: "5px 0 0", lineHeight: 1.4 }}>
            Category-filtered segment ownership with Co-branded vs Standalone split.
          </p>
        </div>

        <div style={{ minWidth: 220, textAlign: "right" }}>
          <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.06em" }}>
            Portfolio in scope
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 6, marginTop: 2 }}>
            <M s={18}>{portfolioTotal.toLocaleString()}</M>
            <span style={{ fontSize: 10, color: C.muted }}>service failures</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
            Co-brand <M s={10} c={C.purple}>{coBrandShare}%</M> · Standalone{" "}
            <M s={10} c={C.gold}>{standaloneShare}%</M>
          </div>
        </div>
      </div>

      <CategoryFilterBar category={category} onChange={setCategory} counts={productCounts} />

      <div
        style={{
          marginTop: 10,
          padding: "8px 11px",
          borderRadius: 10,
          background: `${C.purple}08`,
          borderLeft: `3px solid ${C.purple}`,
          color: C.sub,
          fontSize: 11,
          lineHeight: 1.45,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 900, color: C.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          AI insight ·{" "}
        </span>
        {aiInsight}
      </div>

      <div style={{ marginTop: 10 }}>
        <SegmentOwnershipTable products={filteredProducts} />
      </div>

      <div style={{ marginTop: 10 }}>
        <TopCardDriversTable products={filteredProducts} category={category} />
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "8px 10px",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          fontSize: 10,
          color: C.muted,
          lineHeight: 1.45,
        }}
      >
        Standalone failures are usually bank-owned SLA paths. Co-branded failures need joint bank + partner ownership.
      </div>
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

      {/* ROW 2: plots instead of long tables */}
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

      {/* ROW 3: combined ownership board */}
      <OwnershipBoard />
    </div>
  );
}

export default ServicePromiseIndiaDrillBody;