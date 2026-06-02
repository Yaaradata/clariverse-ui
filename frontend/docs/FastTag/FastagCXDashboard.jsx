import React from "react";

/**
 * FASTag — Head of Customer Experience (CX) Executive Dashboard
 * Same executive board layout, re-pointed for CX:
 *   Executive Pulse → 3 score panels (gauges + Conversation AI) → AI Risk Spike Monitor
 *
 * Panels map to the CX questions:
 *   1. Where are customers struggling in the FASTag journey?
 *   2. Are we resolving customer issues within SLA?
 *   3. Which issues recur even after support has responded?
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
    text: "1 in 3 new users stall at KYC / tag-affixing — onboarding friction is the #1 journey detractor, frustration sentiment climbing",
  },
  {
    n: "2.", dot: C.amber, title: "Where's your focus",
    text: "Refund-dispute resolution breaching SLA at 34%, up from 26% WoW; 56 double-deduction cases aging past the promise window",
  },
  {
    n: "3.", dot: C.green, title: "What's stable / on-track",
    text: "App-channel CSAT steady at 4.1/5 vs IVR 3.4 — self-serve deflection holding, monitoring #FASTagFail movement",
  },
];

const PANELS = [
  {
    title: "Where are customers struggling in the journey?",
    sub: "Onboarding · Recharge · Disputes",
    score: 64, delta: "-5 pts", deltaColor: C.red,
    spark: [72, 64, 68, 58, 62, 52, 56, 48, 52, 44, 46],
    gauges: [
      { v: 43, label: "High Effort", color: C.red },
      { v: 57, label: "Self-Served", color: C.green },
    ],
    metrics: [
      { label: "Top Friction Point", value: "KYC Stall", sub: "Journey Stage", valueColor: C.text },
      { label: "Worst Stage", value: "Activation", sub: "Drop-off Detect", valueColor: C.red },
    ],
    conv: "412 onboarding conversations are stuck on KYC + tag-affixing, the steepest drop-off in the journey. Wallet-recharge failure is the #2 friction point. Customer-effort score rose to 43% high-effort, up from 36% WoW — activation is where customers struggle most.",
    accent: C.red,
  },
  {
    title: "Are we resolving issues within SLA?",
    sub: "Resolution · FCR · Queue Age",
    score: 58, delta: "-7 pts", deltaColor: C.red,
    spark: [74, 66, 70, 60, 64, 54, 58, 50, 54, 46, 48],
    gauges: [
      { v: 61, label: "Within SLA", color: C.amber },
      { v: 48, label: "First Contact", color: C.red },
    ],
    metrics: [
      { label: "Beyond SLA", value: "56 cases", sub: "Ageing Detect", valueColor: C.amber },
      { label: "Slowest Queue", value: "Refunds", sub: "Root Cause", valueColor: C.red },
    ],
    conv: "Within-SLA resolution slipped to 61%, with first-contact resolution at just 48%. Refund / double-deduction disputes are the slowest queue, now averaging 78h vs a 48h promise. Voice is the worst-performing channel; backlog ageing is the leading SLA breach driver.",
    accent: C.amber,
  },
  {
    title: "Which issues recur after support responds?",
    sub: "Reopens · Repeat Contact · Root Cause",
    score: 55, delta: "-10 pts", deltaColor: C.red,
    spark: [40, 48, 44, 56, 52, 62, 58, 68, 64, 74, 70],
    gauges: [
      { v: 29, label: "Reopen Rate", color: C.red },
      { v: 44, label: "Repeat Contact", color: C.amber },
    ],
    metrics: [
      { label: "Top Repeat Issue", value: "Double Deduct", sub: "Recurrence", valueColor: C.red },
      { label: "Reopened (7d)", value: "312 tickets", sub: "Not Fixed", valueColor: C.red },
    ],
    conv: "Reopen rate climbed to 29% — double-deduction refunds and blacklist-on-low-balance lead recurrence. 312 tickets reopened in 7 days because the root cause (refund not reversed, recharge not reflected) is not closed at first response, driving repeat contact and CSAT erosion.",
    accent: C.red,
  },
];

const ALERTS = [
  {
    title: "Onboarding Drop-off Spike", level: "CRITICAL", levelColor: C.red,
    channel: "App, Web", intent: "KYC / Activation Stall", intentSub: "Critical impact · Journey drop-off", time: "Last 6h",
    rows: [
      { k: "Stalled activations", a: "240", b: "760", d: "+217%" },
      { k: "Drop-off rate", a: "18%", b: "34%", d: "+16 pts" },
      { k: "Avg steps to fail", a: "3", b: "5", d: "+67%" },
    ],
    ai: "Drop-off concentrated at the document-upload step. Trim the KYC flow, add an assisted-onboarding nudge, and trigger a retry reminder within the hour.",
  },
  {
    title: "Refund Dispute SLA Breach", level: "CRITICAL", levelColor: C.red,
    channel: "Voice, Tickets", intent: "Double-Charge Refund", intentSub: "Critical impact · Promise breach", time: "Last 4h",
    rows: [
      { k: "Breached cases", a: "22", b: "56", d: "+154%" },
      { k: "Avg case age", a: "36h", b: "78h", d: "+117%" },
      { k: "Refund exposure", a: "₹21K", b: "₹47K", d: "+124%" },
    ],
    ai: "Refund queue is ageing past the 48h promise. Escalate to a dedicated pod, auto-acknowledge open cases, and pre-approve refunds under threshold.",
  },
  {
    title: "Repeat-Contact / Reopen Surge", level: "HIGH", levelColor: C.amber,
    channel: "Voice, App, Email", intent: "Issue Reopened", intentSub: "High impact · Root cause unfixed", time: "Last 12h",
    rows: [
      { k: "Reopen rate", a: "19%", b: "29%", d: "+10 pts" },
      { k: "Reopened tickets", a: "180", b: "312", d: "+73%" },
      { k: "Top reopen reason", a: "", b: "Refund not reversed", d: "+58%" },
    ],
    ai: "Reopens are driven by refunds not actually reversed at first contact. Add a verification step before closure and route recurring cases to a root-cause squad.",
  },
  {
    title: "Negative Sentiment Cluster", level: "CRITICAL", levelColor: C.red,
    channel: "Social, App Reviews", intent: "Frustration / Blacklist Complaint", intentSub: "Critical impact · CSAT risk", time: "Last 12h",
    rows: [
      { k: "Negative mentions", a: "1,240", b: "4,820", d: "+289%" },
      { k: "Top hashtag", a: "", b: "#FASTagFail", d: "+287%" },
      { k: "Sentiment score", a: "-0.3", b: "-0.6", d: "-0.3 pts" },
    ],
    ai: "Blacklist-on-low-balance frustration is going viral on X + app stores. Publish a transparent auto-recharge FAQ and seed proactive comms within 24h.",
  },
  {
    title: "IVR Containment Collapse", level: "CRITICAL", levelColor: C.red,
    channel: "IVR, Voice", intent: "Self-Serve Deflection Fail", intentSub: "Critical impact · Cost + effort", time: "Next 24h",
    rows: [
      { k: "IVR containment", a: "64%", b: "41%", d: "-23 pts" },
      { k: "Agent spillover", a: "2.7K", b: "4.3K", d: "+59%" },
      { k: "Avg handle time", a: "4.1m", b: "6.4m", d: "+56%" },
    ],
    ai: "The IVR recharge flow is breaking and dumping callers to agents. Fix the recharge node, add an estimated-wait callback, and surface a self-serve top-up shortcut.",
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
export default function FastagCXDashboard() {
  return (
    <div className="ft-root">
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />

      {/* EXECUTIVE PULSE */}
      <div className="ft-label" style={{ color: C.amber, fontWeight: 700, fontSize: 11, marginBottom: 10 }}>
        ⚡ EXECUTIVE PULSE · FASTAG CX
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
        Drivers: onboarding drop-off · refund SLA breach · ticket reopens · viral sentiment · IVR containment fail
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {ALERTS.map((a, i) => <AlertCard key={i} a={a} />)}
      </div>
    </div>
  );
}
