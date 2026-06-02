import React from "react";

/**
 * FASTag — Head of Business Executive Dashboard
 * Mirrors the Credit Card executive board layout:
 *   Executive Pulse → 3 score panels (gauges + Conversation AI) → AI Risk Spike Monitor
 *
 * Self-contained: no external CSS framework required. All styling is inline /
 * injected via a <style> tag so the file can be dropped into any React app.
 */

/* ----------------------------- THEME TOKENS ----------------------------- */
const C = {
  bg: "#0a0a0c",
  panel: "#121215",
  panelAlt: "#171719",
  card: "#141417",
  border: "rgba(255,255,255,0.07)",
  borderSoft: "rgba(255,255,255,0.04)",
  text: "#f4f4f6",
  textDim: "#9a9aa3",
  textFaint: "#6b6b73",
  red: "#ff4d52",
  redDeep: "#b21f24",
  amber: "#f5a623",
  amberDeep: "#a86c0a",
  green: "#34d399",
  blue: "#4aa8ff",
};

/* ------------------------------ STYLE BLOCK ----------------------------- */
const styleTag = `
  .ft-root *{box-sizing:border-box;}
  .ft-root{
    background:radial-gradient(1200px 600px at 20% -10%, rgba(255,77,82,0.06), transparent 60%),
               radial-gradient(1000px 500px at 90% 0%, rgba(245,166,35,0.05), transparent 55%),
               ${C.bg};
    color:${C.text};
    font-family:"Segoe UI", "Helvetica Neue", Arial, sans-serif;
    min-height:100vh; padding:18px 20px 40px; letter-spacing:.1px;
  }
  .ft-panel{ background:linear-gradient(180deg, ${C.panelAlt}, ${C.panel});
    border:1px solid ${C.border}; border-radius:16px; }
  .ft-faint{ color:${C.textFaint}; }
  .ft-dim{ color:${C.textDim}; }
  .ft-label{ font-size:10px; letter-spacing:1.4px; text-transform:uppercase; color:${C.textFaint}; }
  .ft-chev{ color:${C.textFaint}; transition:.2s; }
  .ft-scorecard:hover .ft-chev{ color:${C.text}; transform:translateX(2px); }
  .ft-alert{ background:linear-gradient(180deg, ${C.card}, #0f0f12);
    border:1px solid ${C.border}; border-radius:14px; padding:16px 16px 14px;
    position:relative; overflow:hidden; }
  .ft-alert:before{ content:""; position:absolute; inset:0 0 auto 0; height:2px;
    background:linear-gradient(90deg, var(--ac), transparent); opacity:.8; }
  .ft-badge{ font-size:9.5px; font-weight:700; letter-spacing:.6px; padding:4px 8px;
    border-radius:6px; display:inline-flex; align-items:center; gap:5px; }
  .ft-row{ display:flex; justify-content:space-between; align-items:center; }
  .ft-divider{ height:1px; background:${C.borderSoft}; margin:12px 0; }
  .ft-metricrow{ display:flex; justify-content:space-between; align-items:flex-start; padding:9px 0; }
  .ft-up{ color:${C.red}; font-size:11px; font-weight:600; }
  .ft-aibox{ border:1px solid ${C.borderSoft}; border-radius:11px; padding:12px 13px;
    background:linear-gradient(180deg, rgba(255,255,255,0.015), transparent); }
  .ft-conv-strip{ position:relative; }
  .ft-conv-strip:before{ content:""; position:absolute; left:0; top:6px; bottom:6px; width:2px;
    border-radius:2px; background:linear-gradient(180deg, var(--ac), transparent); }
  @keyframes ftpulse{0%,100%{opacity:.5}50%{opacity:1}}
  .ft-dot{ width:8px; height:8px; border-radius:50%; display:inline-block; animation:ftpulse 2.2s infinite; }
`;

/* ------------------------------- HELPERS -------------------------------- */
// Semi-circular gauge
function Gauge({ value, label, color }) {
  const r = 26, cx = 32, cy = 32, sw = 6;
  const a0 = Math.PI, a1 = 0; // 180° -> 0°
  const ang = a0 - (value / 100) * (a0 - a1);
  const pt = (a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  const [sx, sy] = pt(a0);
  const [ex, ey] = pt(a1);
  const [vx, vy] = pt(ang);
  const big = value > 50 ? 1 : 0;
  return (
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <svg width="64" height="40" viewBox="0 0 64 40">
        <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${big} 1 ${vx} ${vy}`}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <text x="32" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>
          {value}%
        </text>
      </svg>
      <div className="ft-label" style={{ marginTop: 2 }}>{label}</div>
    </div>
  );
}

// Smooth area sparkline
function Spark({ data, color, w = 220, h = 70 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const sx = w / (data.length - 1);
  const y = (v) => h - 6 - ((v - min) / (max - min || 1)) * (h - 14);
  const pts = data.map((v, i) => [i * sx, y(v)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cxm = (x0 + x1) / 2;
    d += ` C ${cxm} ${y0}, ${cxm} ${y1}, ${x1} ${y1}`;
  }
  const id = "g" + color.replace(/[^a-z0-9]/gi, "");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* ------------------------------- DATA ----------------------------------- */
const PULSE = [
  {
    n: "1.", dot: C.red, title: "What's critical",
    text: "12 fleet operator accounts: recharge-failure spike detected — wallet auto-debit friction #1 churn driver, retention window open",
  },
  {
    n: "2.", dot: C.amber, title: "Where's your focus",
    text: "Double-deduction disputes at 38%, up from 29% WoW with 56 cases breaching the refund-promise window",
  },
  {
    n: "3.", dot: C.green, title: "What's stable / on-track",
    text: "Bank-issued tags at 71% vs app-issued 29% — channel mix stable, monitoring #FASTagFail movement",
  },
];

const PANELS = [
  {
    title: "How is the overall FASTag business performing?",
    sub: "Toll Volume · Active Tags · Collection",
    score: 72, delta: "-3 pts", deltaColor: C.red,
    spark: [40, 52, 44, 60, 50, 66, 58, 70, 62, 74, 66],
    gauges: [
      { v: 84, label: "Active Tags", color: C.red },
      { v: 16, label: "Dormant", color: C.amber },
    ],
    metrics: [
      { label: "Top Volume Driver", value: "Highway Toll", sub: "Lane Category", valueColor: C.text },
      { label: "Fleets At-Risk", value: "12 accounts", sub: "Churn Signals", valueColor: C.red },
    ],
    conv: "Daily toll transactions held at 11.2M but the recharge-to-transaction ratio slipped this week. Dormant tags rose to 16%, up from 12% WoW. 12 fleet accounts are flagged, making wallet-recharge friction the #1 business detractor.",
    accent: C.red,
  },
  {
    title: "What is driving FASTag growth?",
    sub: "Acquisition · Recharge · Highway Mix",
    score: 66, delta: "+4 pts", deltaColor: C.green,
    spark: [30, 38, 34, 46, 42, 52, 48, 58, 54, 64, 60],
    gauges: [
      { v: 58, label: "New Tags", color: C.amber },
      { v: 71, label: "Repeat Recharge", color: C.green },
    ],
    metrics: [
      { label: "Growth Driver", value: "Annual Pass", sub: "+126% WoW", valueColor: C.green, up: true },
      { label: "Top Segment", value: "Commercial", sub: "Vehicle Class", valueColor: C.text },
    ],
    conv: "Tag acquisition is led by new vehicle sales and the ₹3,000 Annual Pass launch, now 18% of fresh activations. Auto-recharge enrolment grew +31% WoW. Commercial-vehicle volume and GNSS-corridor pilots are the strongest forward growth levers.",
    accent: C.amber,
  },
  {
    title: "Are customer & partner issues affecting growth?",
    sub: "Complaints · Resolution · Partner SLA",
    score: 59, delta: "-9 pts", deltaColor: C.red,
    spark: [70, 60, 66, 52, 58, 46, 50, 40, 44, 36, 38],
    gauges: [
      { v: 51, label: "Resolved in SLA", color: C.amber },
      { v: 44, label: "Repeat Contact", color: C.red },
    ],
    metrics: [
      { label: "Beyond SLA", value: "56 overdue", sub: "Ageing Detect", valueColor: C.amber, up: false },
      { label: "Top Issue", value: "Double Deduct", sub: "Root Cause", valueColor: C.red },
    ],
    conv: "Service score fell because double-deduction refunds, blacklist-on-low-balance disputes, and acquirer reconciliation delays are driving repeat contact. 56 disputes are beyond the refund window; partner-side plaza reconciliation is the leading delay.",
    accent: C.red,
  },
];

const ALERTS = [
  {
    title: "Wallet Recharge Failure Surge", level: "CRITICAL", levelColor: C.red,
    channel: "App, UPI", intent: "Recharge Failed", intentSub: "Critical impact · Churn risk", time: "Last 6h",
    rows: [
      { k: "Failed recharges", a: "1.2K", b: "4.8K", d: "+289%" },
      { k: "Affected wallets", a: "980", b: "3.4K", d: "+247%" },
      { k: "Success ratio", a: "94%", b: "78%", d: "-16 pts" },
    ],
    ai: "Recharge failures concentrated on one UPI handle. Fail over to the backup payment gateway and proactively notify affected wallets today.",
  },
  {
    title: "Double-Deduction Cluster — NH-48", level: "CRITICAL", levelColor: C.red,
    channel: "Voice, Tickets", intent: "Duplicate Toll Charge", intentSub: "Critical impact · Refund escalation", time: "Last 4h",
    rows: [
      { k: "Dispute intake", a: "34", b: "89", d: "+162%" },
      { k: "Refund exposure", a: "₹21K", b: "₹47K", d: "+124%" },
      { k: "Plaza clusters", a: "—", b: "3 plazas", d: "NH-48" },
    ],
    ai: "Reader mis-read pattern at NH-48 plazas (single pass, double charge). Reconcile with the acquirer and auto-refund duplicate charges immediately.",
  },
  {
    title: "Blacklist Complaint Trending", level: "HIGH", levelColor: C.amber,
    channel: "Social, App", intent: "Tag Blacklisted", intentSub: "High impact · Reputation risk", time: "Last 12h",
    rows: [
      { k: "Mentions (48h)", a: "1,240", b: "4,820", d: "+289%" },
      { k: "Top hashtag", a: "", b: "#FASTagFail", d: "+287%" },
      { k: "Estimated reach", a: "0.9M", b: "1.8M", d: "+100%" },
    ],
    ai: "Blacklist-on-low-balance narrative is going mainstream on X + Reddit. Publish an auto-recharge FAQ and align influencer comms within 24h.",
  },
  {
    title: "Fleet Account Churn Signals", level: "CRITICAL", levelColor: C.red,
    channel: "Voice, Email", intent: "Account Closure Inquiry", intentSub: "Critical impact · Retention window", time: "Last 72h",
    rows: [
      { k: "Retention risk", a: "61%", b: "86%", d: "+25 pts" },
      { k: "Closure intents", a: "7", b: "18", d: "+157%" },
      { k: "Spend at risk", a: "₹2.7M", b: "₹4.2M", d: "+56%" },
    ],
    ai: "Fleets are citing CompetitorY zero-fee recharge and reward erosion. Trigger KAM outreach within 2 hours with pre-approved fee-waiver offers.",
  },
  {
    title: "KYC / Re-KYC Verification Backlog", level: "CRITICAL", levelColor: C.red,
    channel: "App, Email", intent: "KYC Verification Stall", intentSub: "Critical impact · Backlog + activation", time: "Next 3 days",
    rows: [
      { k: "At-risk tags", a: "2.7K", b: "4.3K", d: "+59%" },
      { k: "Vendor cases", a: "19", b: "31", d: "+63%" },
      { k: "Exposure (est.)", a: "₹1.1L", b: "₹1.8L", d: "+61%" },
    ],
    ai: "Stalled KYC work is concentrated at BPO Vendor Beta. Surge in-house review on the oldest cases and reroute high-value activations off the vendor queue.",
  },
];

/* ----------------------------- SUB-VIEWS -------------------------------- */
function PulseItem({ item, last }) {
  return (
    <div style={{
      flex: 1, padding: "16px 22px",
      borderRight: last ? "none" : `1px solid ${C.borderSoft}`,
    }}>
      <div className="ft-row" style={{ justifyContent: "flex-start", gap: 8, marginBottom: 8 }}>
        <span style={{ color: C.amber, fontWeight: 700, fontSize: 12 }}>{item.n}</span>
        <span className="ft-dot" style={{ background: item.dot }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{item.title}</span>
      </div>
      <div className="ft-dim" style={{ fontSize: 12, lineHeight: 1.5 }}>{item.text}</div>
    </div>
  );
}

function ScorePanel({ p }) {
  return (
    <div className="ft-panel ft-scorecard" style={{ flex: 1, padding: "18px 20px", minWidth: 0 }}>
      {/* header */}
      <div className="ft-row" style={{ marginBottom: 4 }}>
        <div className="ft-row" style={{ justifyContent: "flex-start", gap: 10 }}>
          <span style={{
            width: 26, height: 26, borderRadius: 8, display: "grid", placeItems: "center",
            background: "rgba(255,77,82,0.12)", color: p.accent, fontSize: 14,
          }}>◎</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.title}</div>
            <div className="ft-label" style={{ marginTop: 3 }}>{p.sub}</div>
          </div>
        </div>
        <span className="ft-chev" style={{ fontSize: 18 }}>›</span>
      </div>

      {/* score + gauges */}
      <div className="ft-row" style={{ alignItems: "flex-start", marginTop: 14 }}>
        <div>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1 }}>{p.score}</div>
        </div>
        <div className="ft-row" style={{ gap: 8, alignItems: "flex-start" }}>
          <span style={{ color: p.deltaColor, fontSize: 13, fontWeight: 600, marginRight: 6, marginTop: 6 }}>{p.delta}</span>
          {p.gauges.map((g, i) => <Gauge key={i} value={g.v} label={g.label} color={g.color} />)}
        </div>
      </div>

      {/* sparkline + metrics */}
      <div className="ft-row" style={{ alignItems: "flex-end", marginTop: 8 }}>
        <div style={{ flex: 1, maxWidth: 230 }}>
          <Spark data={p.spark} color={p.accent} />
        </div>
        <div style={{ display: "flex", gap: 26, paddingLeft: 16 }}>
          {p.metrics.map((m, i) => (
            <div key={i} style={{ textAlign: "right" }}>
              <div className="ft-label">{m.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.valueColor, marginTop: 4 }}>{m.value}</div>
              <div className="ft-faint" style={{ fontSize: 10, marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* conversation AI */}
      <div className="ft-aibox ft-conv-strip" style={{ marginTop: 14, "--ac": p.accent }}>
        <div className="ft-label" style={{ display: "flex", alignItems: "center", gap: 6, color: p.accent, marginBottom: 7, paddingLeft: 8 }}>
          <span>▦</span> CONVERSATION AI
        </div>
        <div className="ft-dim" style={{ fontSize: 11.5, lineHeight: 1.55, paddingLeft: 8 }}>{p.conv}</div>
      </div>
    </div>
  );
}

function AlertCard({ a }) {
  return (
    <div className="ft-alert" style={{ "--ac": a.levelColor, flex: 1, minWidth: 0 }}>
      <div className="ft-row" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, paddingRight: 8 }}>{a.title}</div>
        <span className="ft-badge" style={{
          color: a.levelColor, background: `${a.levelColor}1f`, border: `1px solid ${a.levelColor}55`,
        }}>⬡ {a.level}</span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div className="ft-row" style={{ marginBottom: 8 }}>
          <span className="ft-label">Channel</span>
          <span style={{ fontSize: 11.5, fontWeight: 600 }}>{a.channel}</span>
        </div>
        <div className="ft-row" style={{ alignItems: "flex-start" }}>
          <span className="ft-label">Top Intent</span>
          <span style={{ textAlign: "right" }}>
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>{a.intent}</span>
            <div className="ft-faint" style={{ fontSize: 9.5, marginTop: 2 }}>{a.intentSub}</div>
          </span>
        </div>
        <div className="ft-row" style={{ marginTop: 8 }}>
          <span className="ft-label">Time</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: a.levelColor }}>{a.time}</span>
        </div>
      </div>

      <div className="ft-divider" />

      {a.rows.map((r, i) => (
        <div className="ft-metricrow" key={i} style={{ borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <span className="ft-dim" style={{ fontSize: 11.5 }}>{r.k}</span>
          <span style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>
              {r.a && <span className="ft-faint" style={{ fontWeight: 400 }}>{r.a} → </span>}{r.b}
            </div>
            <div className="ft-up">↑ {r.d}</div>
          </span>
        </div>
      ))}

      <div className="ft-aibox ft-conv-strip" style={{ marginTop: 12, "--ac": a.levelColor }}>
        <div className="ft-dim" style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 8 }}>
          <span style={{ color: a.levelColor, marginRight: 4 }}>✦</span>{a.ai}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- ROOT ----------------------------------- */
export default function FastagDashboard() {
  return (
    <div className="ft-root">
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />

      {/* EXECUTIVE PULSE */}
      <div className="ft-label" style={{ color: C.amber, fontWeight: 700, fontSize: 11, marginBottom: 10 }}>
        ⚡ EXECUTIVE PULSE · FASTAG
      </div>
      <div className="ft-panel" style={{ display: "flex", marginBottom: 22 }}>
        {PULSE.map((item, i) => (
          <PulseItem key={i} item={item} last={i === PULSE.length - 1} />
        ))}
      </div>

      {/* THREE SCORE PANELS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 26, flexWrap: "wrap" }}>
        {PANELS.map((p, i) => <ScorePanel key={i} p={p} />)}
      </div>

      {/* AI RISK SPIKE MONITOR */}
      <div className="ft-row" style={{ justifyContent: "flex-start", gap: 12, marginBottom: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>⩘ AI Risk Spike Monitor</span>
        <span className="ft-badge" style={{ color: C.amber, background: `${C.amber}1f`, border: `1px solid ${C.amber}55` }}>
          OPERATIONAL ALERTS
        </span>
      </div>
      <div className="ft-faint" style={{ fontSize: 11.5, marginBottom: 4 }}>
        Live detection of sudden sentiment, SLA, volume, and backlog shocks across channels.
      </div>
      <div className="ft-faint" style={{ fontSize: 11, fontStyle: "italic", marginBottom: 16 }}>
        Drivers: recharge failures · double deductions · blacklist complaints · viral social cluster · KYC backlog
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {ALERTS.map((a, i) => <AlertCard key={i} a={a} />)}
      </div>
    </div>
  );
}
