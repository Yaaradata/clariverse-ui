import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ============================================================================
   LiSN · Anxiety Intelligence — Flipkart Marketplace CX
   Head of CX (Suresh) primary; CX-Ops variant on Screen 2.
   Self-contained. Hand-rolled SVG visuals (no chart lib) so it drops straight
   into Cursor / Next.js. Design rules cited inline map to the build spec.
   ============================================================================ */

/* ----------------------------------- DATA ----------------------------------- */

const fmt = (n) => Number(n).toLocaleString("en-IN"); // lakh grouping, on-brand

// Headline metrics per period. Structural breakdowns derive from these so the
// period selector genuinely cascades (global period rule).
const PERIODS = {
  today: {
    label: "Today", freshDefault: "nrt",
    index: 84, conf: 84, state: "break", trend: [58, 61, 60, 66, 71, 74, 79, 84],
    high: 12400, scored: 47800, contained: 3100, deltaIndex: +9,
    ipd: 91.2, ipdDelta: -1.4, breachUnits: 4210,
    cov: 72, ttc: 41, ttContact: 68, funnelNotified: 9300, funnelAvoided: 6900,
    optOut: 1.9, overComms: 0.4,
    driverPct: 62, driverConf: 79,
    negTotal: 18600, quad: { ml: 4200, mh: 6900, bl: 2300, bh: 5200 }, splitConf: 82,
  },
  "7d": {
    label: "7 days", freshDefault: "nrt",
    index: 76, conf: 88, state: "shift", trend: [62, 70, 74, 69, 73, 77, 76],
    high: 81400, scored: 312000, contained: 22600, deltaIndex: -3,
    ipd: 92.6, ipdDelta: +0.8, breachUnits: 23100,
    cov: 74, ttc: 44, ttContact: 71, funnelNotified: 60200, funnelAvoided: 44900,
    optOut: 2.1, overComms: 0.5,
    driverPct: 58, driverConf: 84,
    negTotal: 121400, quad: { ml: 28800, mh: 43200, bl: 15600, bh: 33800 }, splitConf: 86,
  },
  "30d": {
    label: "30 days", freshDefault: "daily",
    index: 71, conf: 90, state: "shift", trend: [66, 69, 73, 72, 70, 68, 71],
    high: 341000, scored: 1290000, contained: 96500, deltaIndex: -5,
    ipd: 93.1, ipdDelta: +1.9, breachUnits: 92800,
    cov: 76, ttc: 47, ttContact: 74, funnelNotified: 259000, funnelAvoided: 195000,
    optOut: 2.0, overComms: 0.4,
    driverPct: 55, driverConf: 88,
    negTotal: 512000, quad: { ml: 122000, mh: 181000, bl: 66000, bh: 143000 }, splitConf: 88,
  },
};

// Proportional splits (share of high-anxiety units) — derive counts from `high`.
const NODE_SPLIT = [
  { key: "Last-mile", prop: 0.55, curve: "steepest" },
  { key: "In-transit", prop: 0.25, curve: "moderate" },
  { key: "Returns", prop: 0.125, curve: "moderate" },
  { key: "Installation", prop: 0.075, curve: "shallow" },
];

const REGION_SPLIT = [
  { key: "East", prop: 0.62, hub: "Kolkata WH", pos: { l: 74, t: 40 } },
  { key: "North", prop: 0.18, hub: "Delhi Hub", pos: { l: 44, t: 14 } },
  { key: "West", prop: 0.1, hub: "Bhiwandi", pos: { l: 24, t: 52 } },
  { key: "South", prop: 0.1, hub: "Bengaluru", pos: { l: 46, t: 82 } },
];

// Reliability (KNOWLEDGE) by category — order-state fact, ~stable across periods.
const CAT_RELIABILITY = [
  { k: "Fashion", v: 95.2 },
  { k: "Mobiles", v: 93.1 },
  { k: "Grocery", v: 90.0 },
  { k: "Large Appliances", v: 86.4 },
  { k: "Furniture", v: 82.7 },
];

// Screen 2 — rolled-up incident clusters (live queue; not per-unit).
const CLUSTERS = [
  { id: "CL-2207", label: "IPD breach · stuck-at-hub", region: "East · Kolkata WH", node: "Last-mile",
    units: 2140, band: "High", conf: 86, rel: "Breached",
    tmpl: "Honest re-promise + revised ETA", ch: ["App", "WhatsApp"], sla: 735,
    evidence: ["IPD 04 Jul missed by 2d 6h", "Shipment stuck-at-hub 41h", "Prior repeat-contact on 312 units"] },
  { id: "CL-2213", label: "Failed delivery marked, no attempt", region: "North · Delhi Hub", node: "Last-mile",
    units: 980, band: "High", conf: 81, rel: "Breached",
    tmpl: "Re-attempt schedule + slot pick", ch: ["WhatsApp", "SMS"], sla: 1410,
    evidence: ["Attempt-failed flag with 0s geo-dwell", "IPD miss 1d 3h", "COD orders 61%"] },
  { id: "CL-2219", label: "In-transit delay · BBD load", region: "West · Bhiwandi", node: "In-transit",
    units: 1760, band: "Building", conf: 68, rel: "Met",
    tmpl: "Proactive status reassurance (no breach)", ch: ["App"], sla: 2280,
    carve: true,
    evidence: ["Committed 7-day SLA intact (Day 4)", "Customer-desired 3-day expectation gap", "Hub load 1.8× baseline"] },
  { id: "CL-2224", label: "Return pickup tech-failure", region: "South · Bengaluru", node: "Returns",
    units: 540, band: "High", conf: 79, rel: "Breached",
    tmpl: "Return re-initiation + confirmation", ch: ["App", "WhatsApp"], sla: 540,
    evidence: ["Return-creation API failure code RT-503", "Pickup unscheduled 2d", "High-value electronics 44%"] },
  { id: "CL-2231", label: "Installation pending > 48h", region: "East · Large Appliances", node: "Installation",
    units: 410, band: "Building", conf: 63, rel: "Met",
    tmpl: "Installation slot confirmation", ch: ["SMS"], sla: 3120,
    carve: true,
    evidence: ["Delivered on-time (IPD met)", "Installation SLA Day 2 of 3", "Brand-visit pending flag"] },
  { id: "CL-2238", label: "Embargo hold · regional disruption", region: "West · Jalna", node: "In-transit",
    units: 260, band: "Building", conf: 61, rel: "Met",
    tmpl: "Regional disruption honest notice", ch: ["App"], sla: 2820,
    carve: true,
    evidence: ["Embargo flag active on lane", "IPD not yet breached", "Weather advisory in region"] },
  { id: "CL-2244", label: "Open-box delivery pending", region: "North · Mobiles", node: "Last-mile",
    units: 320, band: "High", conf: 77, rel: "Breached",
    tmpl: "OBD slot + agent ETA", ch: ["WhatsApp"], sla: 1080,
    evidence: ["OBD required, agent unassigned", "IPD miss 18h", "Prepaid high-value 92%"] },
];

// Screen 3 — quadrant cell semantics (operating grid A3).
const QUAD_CELLS = {
  ml: { name: "Healthy — no action", tone: "strong", x: 0, y: 1,
        note: "Promise kept, low anxiety.", drivers: [["On-time last-mile", 48], ["Prepaid, in-SLA", 31], ["Standard grocery", 21]] },
  mh: { name: "Proactive reassurance — carve OUT of trust", tone: "shift", x: 1, y: 1,
        note: "Promise kept, customer anxious (7-vs-3-day). Contain, don't resolve.",
        drivers: [["In-transit, SLA intact", 44], ["BBD hub load", 33], ["Desired-faster-than-promised", 23]] },
  bl: { name: "Pre-empt — honest re-promise before they notice", tone: "info", x: 0, y: 0,
        note: "Reliability slipping, anxiety not yet built.", drivers: [["Silent IPD slip", 52], ["Installation SLA drift", 27], ["Return schedule lag", 21]] },
  bh: { name: "Trust erosion + hot escalation", tone: "break", x: 1, y: 0,
        note: "Promise broken and anxiety high. Resolve fast + route to accountability.",
        drivers: [["IPD miss + stuck-at-hub", 46], ["Failed attempt, no re-attempt", 29], ["Refund not credited", 25]] },
};

const CLIFF_EVENTS = [
  { k: "Item missing", v: 41 }, { k: "Counterfeit suspicion", v: 22 }, { k: "Account takeover", v: 7 },
];
const SLOPE_EVENTS = [
  { k: "Delivery delayed", v: 6200 }, { k: "Refund not credited", v: 2400 },
  { k: "Wrong item on replacement", v: 1600 }, { k: "Damaged on arrival", v: 1100 }, { k: "Hidden fee at checkout", v: 720 },
];

// Screen 4 — top-10 problem statements (pattern → escalation), contribution %.
const TOP10 = [
  { s: "Delivery delayed past committed date, no proactive update", c: 22, kind: "slope", state: "break", chronic: true },
  { s: "Refund not credited after return picked up", c: 15, kind: "slope", state: "break", chronic: true },
  { s: "Wrong / again item delivered on replacement", c: 11, kind: "slope", state: "shift" },
  { s: "Installation not scheduled within SLA", c: 9, kind: "slope", state: "shift" },
  { s: "Failed delivery marked without a real attempt", c: 8, kind: "slope", state: "shift", chronic: true },
  { s: "Open-box delivery denied at doorstep", c: 7, kind: "slope", state: "shift" },
  { s: "COD amount mismatch at delivery", c: 6, kind: "slope", state: "shift" },
  { s: "Return pickup repeatedly rescheduled", c: 6, kind: "slope", state: "shift" },
  { s: "Hidden fee / price change vs listing", c: 5, kind: "slope", state: "shift" },
  { s: "Counterfeit suspicion on branded item", c: 3, kind: "cliff", state: "break", chronic: false },
];

const CONTRIB = {
  Channel: [["Voice", 62], ["Chat", 24], ["Email", 14]],
  Region: [["East", 41], ["North", 24], ["South", 19], ["West", 16]],
  Stage: [["Post-delivery", 58], ["In-transit", 27], ["Pre-ship", 15]],
};

const IMPERFECTIONS = [
  { title: "Jalna in-transit embargo — escalation creep +38% w/w", kind: "inference", conf: 74,
    evidence: "12 escalations in 5 days on a lane with no prior pattern; all embargo-tagged." },
  { title: "Kolkata WH open-box mis-tag — new failure code appearing", kind: "knowledge",
    evidence: "8 tickets, identical WH + SKU class + OBD flag. Deterministic — same signature." },
];

// Node drill breakdowns (Screen 1 → PIN / Category / Marketplace).
const NODE_DRILL = {
  "Last-mile": {
    pin: [["700001 · Kolkata GPO", 1240, 88], ["800001 · Patna", 980, 84], ["834001 · Ranchi", 760, 82], ["110001 · Delhi", 640, 79], ["560001 · Bengaluru", 420, 74]],
    category: [["Large Appliances", 2010, 87], ["Mobiles", 1680, 83], ["Furniture", 1240, 81], ["Fashion", 980, 71], ["Grocery", 610, 66]],
    market: [["Marketplace (3P sellers)", 4620, 85], ["Flipkart (1P / F-Assured)", 2230, 74]],
  },
  "In-transit": {
    pin: [["431203 · Jalna lane", 640, 71], ["421302 · Bhiwandi", 560, 69], ["781001 · Guwahati", 420, 67], ["700001 · Kolkata", 380, 66]],
    category: [["Large Appliances", 1120, 72], ["Furniture", 820, 70], ["Mobiles", 640, 66], ["Fashion", 520, 61]],
    market: [["Marketplace (3P sellers)", 1980, 70], ["Flipkart (1P / F-Assured)", 1120, 64]],
  },
  "Returns": {
    pin: [["560001 · Bengaluru", 410, 79], ["500001 · Hyderabad", 360, 76], ["600001 · Chennai", 300, 74]],
    category: [["Mobiles", 620, 80], ["Large Appliances", 480, 77], ["Fashion", 450, 68]],
    market: [["Marketplace (3P sellers)", 1010, 78], ["Flipkart (1P / F-Assured)", 540, 71]],
  },
  "Installation": {
    pin: [["700001 · Kolkata", 280, 64], ["110001 · Delhi", 240, 62], ["380001 · Ahmedabad", 180, 61]],
    category: [["Large Appliances", 620, 66], ["Furniture", 280, 62]],
    market: [["Marketplace (3P sellers)", 560, 65], ["Flipkart (1P / F-Assured)", 340, 60]],
  },
};

/* --------------------------------- HELPERS --------------------------------- */

const STATE_META = {
  strong: { label: "Strong", color: "var(--green)", tint: "var(--green-t)" },
  shift: { label: "Shifting", color: "var(--amber)", tint: "var(--amber-t)" },
  break: { label: "Breaking", color: "var(--red)", tint: "var(--red-t)" },
  info: { label: "Watch", color: "var(--blue)", tint: "var(--blue-t)" },
};
const bandColor = (b) => (b === "High" ? "var(--red)" : b === "Building" ? "var(--amber)" : b === "Critical" ? "var(--red)" : "var(--green)");

/* ---------------------------------- ICONS ---------------------------------- */
// Vector-only, consistent 1.7 stroke (no emoji as icons — skill rule).
function Icon({ name, size = 18, color = "currentColor", fill = "none", style }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill, stroke: color, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "spark": return (<svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>);
    case "dial": return (<svg {...p}><path d="M4 15a8 8 0 1 1 16 0" /><path d="M12 15l4-3.5" /><circle cx="12" cy="15" r="1.3" fill={color} stroke="none" /></svg>);
    case "queue": return (<svg {...p}><path d="M4 6h16M4 12h16M4 18h10" /></svg>);
    case "quadrant": return (<svg {...p}><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M12 4v16M4 12h16" /></svg>);
    case "layers": return (<svg {...p}><path d="M12 4l8 4-8 4-8-4 8-4z" /><path d="M4 12l8 4 8-4" /><path d="M4 16l8 4 8-4" /></svg>);
    case "chevron": return (<svg {...p}><path d="M9 6l6 6-6 6" /></svg>);
    case "bolt": return (<svg {...p}><path d="M13 3L5 13h6l-1 8 8-11h-6l1-7z" fill={fill === "none" ? "none" : fill} /></svg>);
    case "route": return (<svg {...p}><path d="M6 19V9a3 3 0 0 1 3-3h6" /><path d="M13 3l4 3-4 3" /><circle cx="6" cy="20" r="1.4" fill={color} stroke="none" /></svg>);
    case "star": return (<svg {...p}><path d="M12 3l2.6 5.6 6.1.6-4.6 4 1.4 6-5.5-3.2L6 19.8l1.4-6-4.6-4 6.1-.6z" /></svg>);
    case "check": return (<svg {...p}><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>);
    case "measured": return (<svg {...p}><circle cx="12" cy="12" r="8" /><path d="M8.5 12.2l2.4 2.4L15.8 9.5" /></svg>);
    case "alert": return (<svg {...p}><path d="M12 4l9 15H3l9-15z" /><path d="M12 10v4M12 17h.01" /></svg>);
    case "clock": return (<svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 1.8" /></svg>);
    case "up": return (<svg {...p}><path d="M12 19V6M6 11l6-6 6 6" /></svg>);
    case "down": return (<svg {...p}><path d="M12 5v13M6 13l6 6 6-6" /></svg>);
    case "x": return (<svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
    case "filter": return (<svg {...p}><path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" /></svg>);
    case "pin": return (<svg {...p}><path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z" /><circle cx="12" cy="11" r="2" /></svg>);
    case "arrow": return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    default: return null;
  }
}

/* -------------------------------- PRIMITIVES ------------------------------- */

function InferenceBadge({ conf, small }) {
  // The signature device: violet = "predicted", always carries confidence. (RP-004/005)
  return (
    <span className="badge-inf" style={small ? { fontSize: 10, padding: "1px 6px" } : undefined}>
      <Icon name="spark" size={small ? 10 : 11} color="var(--violet)" />
      <span className="mono">{conf}%</span>
    </span>
  );
}
function KnowledgeTag({ small }) {
  return (
    <span className="ktag" style={small ? { fontSize: 10, padding: "1px 6px" } : undefined}>
      <Icon name="measured" size={small ? 10 : 11} color="var(--text2)" />
      measured
    </span>
  );
}
function StatePill({ state }) {
  const m = STATE_META[state];
  return (
    <span className="pill" style={{ color: m.color, background: m.tint, borderColor: m.color + "44" }}>
      <span className="dot" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}
function Delta({ v, unit = "", invert = false, size = 12 }) {
  const good = invert ? v < 0 : v > 0;
  const up = v > 0;
  const color = v === 0 ? "var(--muted)" : good ? "var(--green)" : "var(--red)";
  return (
    <span className="mono" style={{ color, fontSize: size, display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 600 }}>
      <Icon name={up ? "up" : "down"} size={size} color={color} />
      {Math.abs(v)}{unit}
    </span>
  );
}
function StarFlag() {
  // Integration-dependent tile marker (AP-015) — Flipkart data access unresolved.
  return (
    <span className="starflag" title="Integration-dependent — pending Flipkart data access (IPD flags / WMS / production cubes)">
      <Icon name="star" size={11} color="var(--amber)" fill="var(--amber)" />
    </span>
  );
}

function Dial({ value, color, size = 128, stroke = 11, unit = "", label }) {
  const r = size / 2 - stroke / 2 - 2;
  const c = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          pathLength="100" strokeDasharray={`${Math.max(0, Math.min(100, value))} 100`}
          transform={`rotate(-90 ${c} ${c})`} style={{ transition: "stroke-dasharray .6s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: size * 0.28, fontWeight: 600, lineHeight: 1, color: "var(--text)" }}>
          {value}<span style={{ fontSize: size * 0.13, color: "var(--text2)" }}>{unit}</span>
        </div>
        {label && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</div>}
      </div>
    </div>
  );
}

function Sparkline({ data, color, w = 132, h = 38 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((d, i) => [ (i / (data.length - 1)) * (w - 6) + 3, h - 5 - ((d - min) / rng) * (h - 12) ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `3,${h - 3} ${line} ${w - 3},${h - 3}`;
  const last = pts[pts.length - 1];
  const gid = "spg" + color.replace(/[^a-z]/gi, "");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.22" /><stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

function BaselineBars({ rows, max, color, unit = "" }) {
  // Horizontal bars-to-baseline (journey node / category). ≤2 dims (RP-002).
  const m = max || Math.max(...rows.map((r) => r.v));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {rows.map((r) => (
        <div key={r.k} style={{ display: "grid", gridTemplateColumns: "108px 1fr 62px", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>{r.k}</span>
          <div className="track"><div className="fill" style={{ width: `${(r.v / m) * 100}%`, background: r.c || color }} /></div>
          <span className="mono" style={{ fontSize: 12, textAlign: "right", color: "var(--text)" }}>{fmt(r.v)}{unit}</span>
        </div>
      ))}
    </div>
  );
}

function Funnel({ flagged, notified, avoided }) {
  const stages = [
    { k: "Flagged", v: flagged, c: "var(--amber)" },
    { k: "Notified", v: notified, c: "var(--blue)" },
    { k: "Contact avoided", v: avoided, c: "var(--green)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {stages.map((s, i) => (
        <div key={s.k}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>{s.k}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--text)" }}>{fmt(s.v)}</span>
          </div>
          <div className="track" style={{ height: 10 }}>
            <div className="fill" style={{ width: `${(s.v / flagged) * 100}%`, background: s.c }} />
          </div>
          {i < stages.length - 1 && (
            <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: "right" }}>
              → {Math.round((stages[i + 1].v / s.v) * 100)}% kept
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContribBar({ label, pct, color = "var(--blue)" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 44px", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: "var(--text2)" }}>{label}</span>
      <div className="track"><div className="fill" style={{ width: `${pct}%`, background: color }} /></div>
      <span className="mono" style={{ fontSize: 12, textAlign: "right", color: "var(--text)" }}>{pct}%</span>
    </div>
  );
}

function SLATimer({ seconds }) {
  const [t, setT] = useState(seconds);
  useEffect(() => { setT(seconds); }, [seconds]);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x <= 0 ? 0 : x - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const over = t <= 0;
  const urgent = t > 0 && t < 600;
  const warn = t >= 600 && t < 1500;
  const color = over || urgent ? "var(--red)" : warn ? "var(--amber)" : "var(--green)";
  const mm = String(Math.floor(t / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return (
    <span className={"sla mono" + (urgent && !over ? " pulse" : "")} style={{ color, borderColor: color + "44", background: color + "18" }}>
      <Icon name="clock" size={12} color={color} />
      {over ? "OVERDUE" : `${mm}:${ss}`}
    </span>
  );
}

/* --------------------------------- QUADRANT -------------------------------- */
function Quadrant({ data, active, onCell }) {
  const S = 300, pad = 34;
  const inner = S - pad * 2;
  const maxV = Math.max(...Object.values(data));
  const cells = [
    { id: "bh", cx: pad + inner * 0.75, cy: pad + inner * 0.25 },
    { id: "mh", cx: pad + inner * 0.75, cy: pad + inner * 0.75 },
    { id: "bl", cx: pad + inner * 0.25, cy: pad + inner * 0.25 },
    { id: "ml", cx: pad + inner * 0.25, cy: pad + inner * 0.75 },
  ];
  const toneColor = (t) => STATE_META[t].color;
  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      {/* cell tints */}
      {cells.map((c) => {
        const meta = QUAD_CELLS[c.id];
        const isA = active === c.id;
        const qx = c.cx < S / 2 ? pad : S / 2;
        const qy = c.cy < S / 2 ? pad : S / 2;
        return (
          <g key={c.id} style={{ cursor: "pointer" }} onClick={() => onCell(c.id)}>
            <rect x={qx} y={qy} width={inner / 2} height={inner / 2}
              fill={toneColor(meta.tone)} opacity={isA ? 0.16 : 0.05}
              stroke={isA ? toneColor(meta.tone) : "transparent"} strokeWidth="1.5" rx="4" />
          </g>
        );
      })}
      {/* axes */}
      <line x1={S / 2} y1={pad} x2={S / 2} y2={S - pad} stroke="var(--line2)" strokeWidth="1" />
      <line x1={pad} y1={S / 2} x2={S - pad} y2={S / 2} stroke="var(--line2)" strokeWidth="1" />
      {/* bubbles */}
      {cells.map((c) => {
        const v = data[c.id];
        const meta = QUAD_CELLS[c.id];
        const r = 14 + Math.sqrt(v / maxV) * 30;
        return (
          <g key={"b" + c.id} style={{ cursor: "pointer" }} onClick={() => onCell(c.id)}>
            <circle cx={c.cx} cy={c.cy} r={r} fill={toneColor(meta.tone)} opacity={active === c.id ? 0.9 : 0.62}
              stroke={toneColor(meta.tone)} strokeWidth="1.5" style={{ transition: "r .3s" }} />
            <text x={c.cx} y={c.cy + 4} textAnchor="middle" fontSize="12" fontFamily="'JetBrains Mono'" fontWeight="600" fill="#0B1220">{fmt(v)}</text>
          </g>
        );
      })}
      {/* axis labels */}
      <text x={pad} y={pad - 12} fontSize="10" fill="var(--muted)" fontFamily="Inter" fontWeight="600">RELIABILITY BREACHED ↑</text>
      <text x={pad} y={S - 12} fontSize="10" fill="var(--muted)" fontFamily="Inter" fontWeight="600">RELIABILITY MET ↓</text>
      <text x={S - pad} y={S - 12} fontSize="10" fill="var(--muted)" fontFamily="Inter" fontWeight="600" textAnchor="end">ANXIETY HIGH →</text>
    </svg>
  );
}

/* ---------------------------------- CARD ----------------------------------- */
function Card({ children, style, className = "", pad = 18 }) {
  return <div className={"card " + className} style={{ padding: pad, ...style }}>{children}</div>;
}
function QCard({ question, verdict, verdictState, kind, conf, star, action, onAction, primary, children }) {
  return (
    <Card className={primary ? "primary" : ""} style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="qtitle disp">{question}</span>
          {star && <StarFlag />}
        </div>
        <StatePill state={verdictState} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "5px 0 12px" }}>
        <span className="verdict">{verdict}</span>
        {kind === "inference" ? <InferenceBadge conf={conf} small /> : <KnowledgeTag small />}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      {action && (
        <button className="btn action" onClick={onAction}>
          {action} <Icon name="arrow" size={14} />
        </button>
      )}
    </Card>
  );
}

/* --------------------------------- CHROME ---------------------------------- */
const NAV = [
  { id: 1, name: "Anxiety Command", icon: "dial", persona: "Head of CX", alt: "head", plane: "Hot" },
  { id: 2, name: "Containment Queue", icon: "queue", persona: "CX-Ops", alt: "ops", plane: "Hot" },
  { id: 3, name: "Reliability vs Anxiety", icon: "quadrant", persona: "Head of CX", alt: "head", plane: "Both" },
  { id: 4, name: "Escalation Patterns", icon: "layers", persona: "Steer-co prep", alt: "head", plane: "Cold" },
];

function Sidebar({ screen, setScreen }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark disp">LiSN</div>
        <div className="brand-sub">Anxiety Intelligence</div>
      </div>
      <div className="client-chip">
        <span className="dot" style={{ background: "var(--blue)" }} />
        Flipkart · Marketplace CX
      </div>
      <nav className="nav">
        {NAV.map((n) => (
          <button key={n.id} className={"navitem" + (screen === n.id ? " on" : "")} onClick={() => setScreen(n.id)}>
            <Icon name={n.icon} size={17} color={screen === n.id ? "var(--text)" : "var(--text2)"} />
            <span className="navmeta">
              <span className="navname">{n.name}</span>
              <span className="navpersona">{n.persona} · {n.alt}</span>
            </span>
            <span className={"planetag " + n.plane.toLowerCase()}>{n.plane}</span>
          </button>
        ))}
      </nav>
      <div className="legend">
        <div className="legend-title">Signal legend</div>
        <div className="legend-row"><KnowledgeTag small /><span>Order-state fact — rendered plain</span></div>
        <div className="legend-row"><InferenceBadge conf={"n"} small /><span>Predicted — confidence shown</span></div>
        <div className="legend-row"><StarFlag /><span>Needs Flipkart data access</span></div>
      </div>
    </aside>
  );
}

function TopBar({ screen, period, setPeriod, fresh, setFresh }) {
  const n = NAV.find((x) => x.id === screen);
  const questions = {
    1: "Are customers about to contact us? · Are we keeping our promise? · Are we containing in time?",
    2: "Which incidents do I act on now — and with what message?",
    3: "How much negative signal is anxiety-noise vs a real trust breach?",
    4: "Which patterns keep generating escalations — what goes to the top-10?",
  }[screen];
  return (
    <header className="topbar">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 className="disp screen-title">{n.name}</h1>
          <span className="persona-chip">{n.persona}</span>
        </div>
        <p className="screen-q">{questions}</p>
      </div>
      <div className="controls">
        <div className="fresh">
          <button className={"seg" + (fresh === "nrt" ? " on" : "")} onClick={() => setFresh("nrt")}>
            <span className="live-dot" /> Near-real-time
          </button>
          <button className={"seg" + (fresh === "daily" ? " on" : "")} onClick={() => setFresh("daily")}>Daily</button>
        </div>
        <div className="period">
          <Icon name="filter" size={14} color="var(--text2)" />
          {Object.keys(PERIODS).map((k) => (
            <button key={k} className={"seg" + (period === k ? " on" : "")} onClick={() => setPeriod(k)}>{PERIODS[k].label}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- BAND ----------------------------------- */
function AIBand({ d, fresh }) {
  const stamp = fresh === "nrt" ? "as of ~45 min ago · hot plane" : "as of 06:00 IST · daily plane";
  return (
    <div className="aiband">
      <div className="band-seg">
        <span className="band-lab">What's building</span>
        <span className="band-val">Delivery-delay anxiety, last-mile</span>
      </div>
      <div className="band-div" />
      <div className="band-seg">
        <span className="band-lab">How bad</span>
        <span className="band-val">
          <span className="mono">{fmt(d.high)}</span> units High <InferenceBadge conf={d.conf} small />
        </span>
      </div>
      <div className="band-div" />
      <div className="band-seg">
        <span className="band-lab">Who's affected</span>
        <span className="band-val">East hubs — Kolkata, Patna, Ranchi</span>
      </div>
      <div className="band-div" />
      <div className="band-seg ai">
        <span className="band-lab ai"><Icon name="spark" size={12} color="var(--violet)" /> AI · what to do next</span>
        <span className="band-val ai">Fire containment in East now — anxiety cresting, contact window ~{d.ttContact} min.</span>
      </div>
      <div className="band-stamp mono">{stamp}</div>
    </div>
  );
}

/* --------------------------------- MODALS ---------------------------------- */
function NodeDrill({ node, count, onClose }) {
  const [tab, setTab] = useState("pin");
  const dd = NODE_DRILL[node] || NODE_DRILL["Last-mile"];
  const rows = dd[tab];
  const tabs = [["pin", "PIN code"], ["category", "Category"], ["market", "Marketplace vs Flipkart"]];
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="disp" style={{ fontSize: 16, fontWeight: 600 }}>{node} · anxiety drill</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              <span className="mono">{fmt(count)}</span> high-anxiety units · Vinodh's drill: by PIN / category / marketplace
            </div>
          </div>
          <button className="iconbtn" aria-label="Close drill" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="tabs">
          {tabs.map(([k, l]) => (
            <button key={k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <BaselineBars rows={rows.map((r) => ({ k: r[0], v: r[1] }))} color="var(--red)" />
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Deeper than this routes to CX-Ops (exec screens ≤ 2 deep · AP-019).</span>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- TOASTS --------------------------------- */
function Toasts({ items }) {
  return (
    <div className="toaststack">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <Icon name="check" size={15} color="var(--green)" />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* =============================== SCREEN 1 ================================== */
function Screen1({ d, fresh, toast }) {
  const [drill, setDrill] = useState(null);
  const nodeRows = NODE_SPLIT.map((n) => ({ k: n.key, v: Math.round(d.high * n.prop) }));
  const catRows = CAT_RELIABILITY.map((c) => ({ k: c.k, v: c.v }));
  const maxRel = 100;

  return (
    <div className="screen">
      <AIBand d={d} fresh={fresh} />

      {/* Canonical triad — same skeleton, anxiety metrics inside (AP-002) */}
      <div className="triad">
        <QCard primary question="Are customers about to contact us?" verdict={`${STATE_META[d.state].label} — a contact wave is forming`}
          verdictState={d.state} kind="inference" conf={d.conf} star
          action="Fire containment batch" onAction={() => toast(`Containment batch queued — ${fmt(Math.round(d.high * 0.62))} units, East hubs`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dial value={d.index} color={STATE_META[d.state].color} label="index" />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Anxiety &amp; Contact Pressure</span>
                <Delta v={d.deltaIndex} />
              </div>
              <Sparkline data={d.trend} color={STATE_META[d.state].color} w={150} />
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8, lineHeight: 1.5 }}>
                <span className="mono" style={{ color: "var(--text)" }}>{fmt(d.high)}</span> units in High band ·
                p(contact) <span className="mono" style={{ color: "var(--text)" }}>0.71</span>
              </div>
            </div>
          </div>
        </QCard>

        <QCard question="Are we keeping our promise?" verdict={d.ipd >= 92 ? "Strong — promise largely intact" : "Shifting — promise slipping in pockets"}
          verdictState={d.ipd >= 92 ? "strong" : "shift"} kind="knowledge" star
          action="Route breach cohort to resolution" onAction={() => toast(`${fmt(d.breachUnits)} IPD-breach units routed to resolution`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dial value={d.ipd} color={d.ipd >= 92 ? "var(--green)" : "var(--amber)"} unit="%" label="IPD-met" />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Reliability = did we do what we committed</span>
                <Delta v={d.ipdDelta} unit="%" />
              </div>
              <Sparkline data={[93.9, 93.1, 92.6, 92.0, 91.8, 91.5, d.ipd]} color={d.ipd >= 92 ? "var(--green)" : "var(--amber)"} w={150} />
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8, lineHeight: 1.5 }}>
                <span className="mono" style={{ color: "var(--text)" }}>{fmt(d.breachUnits)}</span> breach units — anchors the anxiety-vs-trust split
              </div>
            </div>
          </div>
        </QCard>

        <QCard question="Are we containing in time?" verdict={d.ttc < d.ttContact ? "Strong — ahead of the contact window" : "Shifting — containment lagging"}
          verdictState={d.ttc < d.ttContact ? "strong" : "shift"} kind="knowledge" star
          action="Review opt-out / over-comms" onAction={() => toast(`Opt-out ${d.optOut}% · over-comms ${d.overComms}% — within guardrail`)}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 34, fontWeight: 600, color: "var(--green)", lineHeight: 1 }}>{d.cov}<span style={{ fontSize: 15, color: "var(--text2)" }}>%</span></div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.3 }}>coverage</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="statline"><span>Time-to-contain</span><span className="mono" style={{ color: "var(--green)" }}>{d.ttc} min</span></div>
              <div className="statline"><span>Time-to-contact (untreated)</span><span className="mono" style={{ color: "var(--text)" }}>{d.ttContact} min</span></div>
              <div className="statline"><span>Headroom</span><span className="mono" style={{ color: "var(--green)" }}>+{d.ttContact - d.ttc} min</span></div>
            </div>
          </div>
        </QCard>
      </div>

      {/* Detail tiles — directly under each parent, same L→R order (tile↔drill rule) */}
      <div className="triad">
        <Card>
          <div className="tile-head">
            <span className="tile-title">Anxiety by journey node <StarFlag /></span>
            <InferenceBadge conf={d.conf} small />
          </div>
          <p className="tile-sub">Click a node to drill by PIN / category / marketplace</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {NODE_SPLIT.map((n) => {
              const v = Math.round(d.high * n.prop);
              const mx = Math.round(d.high * NODE_SPLIT[0].prop);
              return (
                <button key={n.key} className="nodebar" onClick={() => setDrill({ node: n.key, count: v })}>
                  <span style={{ fontSize: 12, color: "var(--text2)", width: 92, textAlign: "left" }}>{n.key}</span>
                  <div className="track"><div className="fill" style={{ width: `${(v / mx) * 100}%`, background: n.key === "Last-mile" ? "var(--red)" : "var(--amber)" }} /></div>
                  <span className="mono" style={{ fontSize: 12, width: 58, textAlign: "right", color: "var(--text)" }}>{fmt(v)}</span>
                  <Icon name="chevron" size={13} color="var(--muted)" />
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="tile-head">
            <span className="tile-title">Promise-met by category <StarFlag /></span>
            <KnowledgeTag small />
          </div>
          <p className="tile-sub">IPD-met % — order-state fact</p>
          <BaselineBars rows={catRows} max={maxRel} color="var(--green)" unit="%" />
        </Card>

        <Card>
          <div className="tile-head">
            <span className="tile-title">Containment funnel <StarFlag /></span>
            <KnowledgeTag small />
          </div>
          <p className="tile-sub">flagged → notified → contact-avoided</p>
          <Funnel flagged={d.high} notified={d.funnelNotified} avoided={d.funnelAvoided} />
          <div className="guardrail">
            <span>Opt-out guardrail</span>
            <span className="mono" style={{ color: d.optOut < 3 ? "var(--green)" : "var(--red)" }}>{d.optOut}% <span style={{ color: "var(--muted)" }}>/ 3% cap</span></span>
          </div>
        </Card>
      </div>

      {/* Geo (national default) + compact AI sparkle card (RP-006: sparkle, not a bar) */}
      <div className="geo-row">
        <Card>
          <div className="tile-head">
            <span className="tile-title">Hub / region anxiety <StarFlag /></span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="scale-legend"><span className="sw" style={{ background: "var(--amber)" }} /> building <span className="sw" style={{ background: "var(--red)" }} /> high</span>
              <InferenceBadge conf={d.conf} small />
            </span>
          </div>
          <p className="tile-sub">National view · defaulting to all India</p>
          <GeoHeat high={d.high} />
        </Card>

        <div className="ai-sparkle">
          <div className="sparkle-head"><Icon name="spark" size={15} color="var(--violet)" /> <span>AI insight</span> <InferenceBadge conf={d.driverConf} small /></div>
          <div className="sparkle-body">
            <span className="mono" style={{ color: "var(--violet)", fontSize: 22, fontWeight: 600 }}>{d.driverPct}%</span> of high-anxiety units trace to one driver:
            <div className="sparkle-driver">IPD breach + stuck-at-hub, East region</div>
          </div>
          <button className="btn ghost sm" onClick={() => toast("East IPD-breach cohort opened in containment queue")}>Open in queue <Icon name="arrow" size={13} /></button>
        </div>
      </div>

      {drill && <NodeDrill node={drill.node} count={drill.count} onClose={() => setDrill(null)} />}
    </div>
  );
}

function GeoHeat({ high }) {
  return (
    <div className="geomap">
      <div className="compass">N</div>
      {REGION_SPLIT.map((r) => {
        const v = Math.round(high * r.prop);
        const intensity = r.prop; // 0..1
        const col = intensity > 0.4 ? "var(--red)" : intensity > 0.15 ? "var(--amber)" : "var(--blue)";
        return (
          <div key={r.key} className="regiontile" style={{ left: `${r.pos.l}%`, top: `${r.pos.t}%`, borderColor: col + "66", background: col + "1f" }}>
            <div className="region-dot" style={{ background: col, boxShadow: `0 0 0 4px ${col}22` }} />
            <div className="region-name">{r.key}</div>
            <div className="mono region-val" style={{ color: col }}>{fmt(v)}</div>
            <div className="region-hub">{r.hub}</div>
          </div>
        );
      })}
    </div>
  );
}

/* =============================== SCREEN 2 ================================== */
function Screen2({ d, fresh, toast }) {
  const [open, setOpen] = useState(null);
  const totalUnits = CLUSTERS.reduce((a, c) => a + c.units, 0);
  const breachedClusters = CLUSTERS.filter((c) => c.rel === "Breached").length;
  return (
    <div className="screen">
      {/* ops summary + guardrail top-right */}
      <div className="ops-summary">
        <div className="ops-stat"><span className="ops-num mono">{CLUSTERS.length}</span><span className="ops-lab">active clusters</span></div>
        <div className="ops-stat"><span className="ops-num mono">{fmt(totalUnits)}</span><span className="ops-lab">units in queue</span></div>
        <div className="ops-stat"><span className="ops-num mono" style={{ color: "var(--red)" }}>{breachedClusters}</span><span className="ops-lab">reliability breached</span></div>
        <div style={{ flex: 1 }} />
        <div className="guard-widget">
          <div className="guard-title">Over-communication guardrail</div>
          <div className="guard-row">
            <span>Opt-out rate</span>
            <div className="track" style={{ width: 90 }}><div className="fill" style={{ width: `${(d.optOut / 3) * 100}%`, background: "var(--green)" }} /></div>
            <span className="mono" style={{ color: "var(--green)" }}>{d.optOut}%</span>
          </div>
          <div className="guard-row">
            <span>Over-comms flags</span>
            <div className="track" style={{ width: 90 }}><div className="fill" style={{ width: `${(d.overComms / 3) * 100}%`, background: "var(--green)" }} /></div>
            <span className="mono" style={{ color: "var(--green)" }}>{d.overComms}%</span>
          </div>
          <div className="guard-note">Deflection ≠ quality loss — must stay under 3% cap</div>
        </div>
      </div>

      <Card pad={0} className="queue">
        <div className="qrow qhead">
          <span>Cluster</span><span>Journey node</span><span>Units</span><span>Anxiety</span><span>Reliability</span><span>Recommended action</span><span>SLA</span><span></span>
        </div>
        <div className="scroll queue-body">
          {CLUSTERS.map((c) => (
            <React.Fragment key={c.id}>
              <div className={"qrow" + (c.carve ? " carve" : "") + (open === c.id ? " open" : "")}>
                <span>
                  <span className="clab">{c.label}</span>
                  <span className="csub mono">{c.id} · {c.region}</span>
                </span>
                <span className="mono ndtag">{c.node}</span>
                <span className="mono">{fmt(c.units)}</span>
                <span><span className="miniband" style={{ color: bandColor(c.band), borderColor: bandColor(c.band) + "55", background: bandColor(c.band) + "18" }}>{c.band}</span> <InferenceBadge conf={c.conf} small /></span>
                <span>{c.rel === "Breached"
                  ? <span className="reltag break"><Icon name="alert" size={11} color="var(--red)" /> Breached</span>
                  : <span className="reltag met"><Icon name="check" size={11} color="var(--green)" /> Met</span>} <KnowledgeTag small /></span>
                <span>
                  <span className="tmpl">{c.tmpl}</span>
                  <span className="chans">{c.ch.map((x) => <span key={x} className="chan">{x}</span>)}</span>
                  {c.carve && <span className="carvetag">anxiety-only · carve out of trust</span>}
                </span>
                <span><SLATimer seconds={c.sla} /></span>
                <span className="qactions">
                  <button className="btn tiny primary" onClick={() => toast(`Containment fired — ${c.tmpl} → ${c.ch.join(" + ")} · ${fmt(c.units)} units`)}>Approve &amp; fire</button>
                  <button className="btn tiny ghost" onClick={() => toast(`${c.id} escalated to accountable pre-order team`)}>Escalate</button>
                  <button className="iconbtn sm" aria-label="Show evidence" onClick={() => setOpen(open === c.id ? null : c.id)}>
                    <Icon name="chevron" size={14} style={{ transform: open === c.id ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                  </button>
                </span>
              </div>
              {open === c.id && (
                <div className="qexpand">
                  <div className="evi-title">Evidence behind the score — confirmed order-state only</div>
                  <div className="evi-grid">
                    {c.evidence.map((e, i) => (
                      <div key={i} className="evi"><Icon name="measured" size={13} color="var(--text2)" /> {e}</div>
                    ))}
                  </div>
                  <div className="promsg">
                    <span className="promsg-lab">Re-promise preview (generated from confirmed fields):</span>
                    <span className="promsg-txt">"{c.rel === "Met"
                      ? `Your order is on track — committed by its original date. We're moving it now; here's live status.`
                      : `We missed the promised date on your order. Revised delivery scheduled — here's your new ETA and a slot to confirm.`}"</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <p className="foot-note">Rolled up to cluster — never per-unit (roll-up rule prevents alert spam). Re-promise text is constrained to confirmed order-state so containment can't manufacture a future reliability breach.</p>
    </div>
  );
}

/* =============================== SCREEN 3 ================================== */
function Screen3({ d, toast }) {
  const [cell, setCell] = useState("bh");
  const meta = QUAD_CELLS[cell];
  const anxietyOnly = d.quad.ml + d.quad.mh;
  const breach = d.quad.bl + d.quad.bh;
  const pctAnx = Math.round((anxietyOnly / d.negTotal) * 100);
  const pctBreach = 100 - pctAnx;
  return (
    <div className="screen">
      {/* headline split — the answer to Syed */}
      <Card className="split-hero">
        <div className="split-lab">Of <span className="mono">{fmt(d.negTotal)}</span> negative signals this period:</div>
        <div className="split-bars">
          <div className="split-seg" style={{ width: `${pctAnx}%`, background: "var(--amber)" }}>
            <span className="mono">{pctAnx}%</span> anxiety-only <span className="split-sub">promise kept</span>
          </div>
          <div className="split-seg" style={{ width: `${pctBreach}%`, background: "var(--red)" }}>
            <span className="mono">{pctBreach}%</span> reliability breach
          </div>
        </div>
        <div className="split-method">
          <Icon name="measured" size={12} color="var(--muted)" />
          Method: weighted derivation — <span style={{ color: "var(--text2)" }}>reliability_met</span> (measured, order-state) × <span style={{ color: "var(--violet)" }}>anxiety_score</span> (inference), confidence-weighted.
          <InferenceBadge conf={d.splitConf} small />
        </div>
      </Card>

      <div className="s3grid">
        {/* Hero: reliability × anxiety 2×2 (cf. approved sentiment×volume quadrant AP-018) */}
        <Card>
          <div className="tile-head">
            <span className="tile-title">Reliability × Anxiety <StarFlag /></span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>bubble = negative-signal volume · click a cell</span>
          </div>
          <Quadrant data={d.quad} active={cell} onCell={setCell} />
          <div className="cell-detail" style={{ borderColor: STATE_META[meta.tone].color + "44", background: STATE_META[meta.tone].tint }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="disp" style={{ fontWeight: 600, color: STATE_META[meta.tone].color }}>{meta.name}</span>
              <span className="mono" style={{ color: "var(--text)" }}>{fmt(d.quad[cell])} signals</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text2)", margin: "5px 0 10px" }}>{meta.note}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3 }}>Top drivers of this cell</span>
              {meta.drivers.map(([k, v]) => (
                <ContribBar key={k} label={k} pct={v} color={STATE_META[meta.tone].color} />
              ))}
            </div>
            <button className="btn ghost sm" style={{ marginTop: 12 }}
              onClick={() => cell === "mh"
                ? toast(`${fmt(d.quad.mh)} anxiety-only signals carved OUT of the trust index`)
                : toast(`${fmt(d.quad[cell])} signals routed for review`)}>
              {cell === "mh" ? "Carve out of trust index" : cell === "bh" ? "Route to accountability" : "Review cohort"} <Icon name="arrow" size={13} />
            </button>
          </div>
        </Card>

        <div className="s3side">
          {/* consumer-sentiment summary */}
          <Card>
            <div className="tile-head"><span className="tile-title">Consumer-sentiment summary</span><InferenceBadge conf={78} small /></div>
            <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.6, margin: "6px 0 0" }}>
              Negative sentiment concentrates in <b style={{ color: "var(--text)" }}>delivery-delay</b> — a <b style={{ color: "var(--amber)" }}>slope</b> event, largely anxiety-driven with the promise still intact.
              <b style={{ color: "var(--red)" }}> Counterfeit</b> and <b style={{ color: "var(--red)" }}>item-missing</b> are <b style={{ color: "var(--red)" }}>cliff</b> events — low volume but trust-critical.
            </p>
          </Card>

          {/* cliff vs slope — retail trust model (RP-003/007: not virality/buzz) */}
          <Card>
            <div className="tile-head"><span className="tile-title">Cliff vs slope events</span><span style={{ fontSize: 11, color: "var(--muted)" }}>incident-rate × network-effect</span></div>
            <div className="cliffslope">
              <div>
                <div className="cs-lab break"><Icon name="alert" size={12} color="var(--red)" /> Cliff — bypass scoring → Critical</div>
                {CLIFF_EVENTS.map((e) => (
                  <div key={e.k} className="cs-row"><span>{e.k}</span><span className="mono" style={{ color: "var(--red)" }}>{e.v}</span></div>
                ))}
              </div>
              <div className="cs-div" />
              <div>
                <div className="cs-lab shift"><Icon name="down" size={12} color="var(--amber)" /> Slope — scored, contain-able</div>
                {SLOPE_EVENTS.slice(0, 4).map((e) => (
                  <div key={e.k} className="cs-row"><span>{e.k}</span><span className="mono" style={{ color: "var(--text2)" }}>{fmt(e.v)}</span></div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================== SCREEN 4 ================================== */
function Screen4({ d, toast }) {
  const [sel, setSel] = useState(0);
  const [dim, setDim] = useState("Channel");
  const scale = d.negTotal / 18600; // escalation counts scale with period
  return (
    <div className="screen">
      <div className="s4grid">
        {/* Top-10 problem statements — Vinodh's steering-committee artifact */}
        <Card pad={0}>
          <div className="tile-head" style={{ padding: "16px 18px 10px" }}>
            <span className="tile-title">Top-10 problem statements <StarFlag /></span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>what escalations are about · click to break down</span>
          </div>
          <div className="scroll top10">
            {TOP10.map((t, i) => (
              <button key={i} className={"t10row" + (sel === i ? " on" : "")} onClick={() => setSel(i)}>
                <span className="t10rank mono">{i + 1}</span>
                <span className="t10body">
                  <span className="t10stmt">{t.s}
                    {t.chronic && <span className="chronic">chronic</span>}
                    {t.kind === "cliff" && <span className="clifftag">cliff · trust-critical</span>}
                  </span>
                  <span className="t10bar"><span className="t10fill" style={{ width: `${(t.c / 22) * 100}%`, background: t.state === "break" ? "var(--red)" : "var(--amber)" }} /></span>
                </span>
                <span className="mono t10pct">{t.c}%</span>
                <StatePill state={t.state} />
              </button>
            ))}
          </div>
        </Card>

        <div className="s4side">
          {/* Contribution analysis (roll-up, not per-slice alerts) */}
          <Card>
            <div className="tile-head">
              <span className="tile-title">Contribution analysis</span>
              <KnowledgeTag small />
            </div>
            <div className="dimtabs">
              {Object.keys(CONTRIB).map((k) => (
                <button key={k} className={"dimtab" + (dim === k ? " on" : "")} onClick={() => setDim(k)}>{k}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
              {CONTRIB[dim].map(([k, v]) => <ContribBar key={k} label={k} pct={v} color="var(--blue)" />)}
            </div>
            <p className="tile-sub" style={{ marginTop: 10 }}>Rolls up to 100% under the parent — no per-slice spam.</p>
          </Card>

          {/* Emerging-imperfection flag — the Jalna mechanism */}
          <Card>
            <div className="tile-head"><span className="tile-title">Emerging-imperfection candidates</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {IMPERFECTIONS.map((im, i) => (
                <div key={i} className="imp">
                  <div className="imp-head">
                    <span className="imp-title">{im.title}</span>
                    {im.kind === "inference" ? <InferenceBadge conf={im.conf} small /> : <KnowledgeTag small />}
                  </div>
                  <div className="imp-evi"><Icon name="measured" size={12} color="var(--muted)" /> {im.evidence}</div>
                  <div className="imp-actions">
                    <button className="btn tiny ghost" onClick={() => toast(`"${im.title.split(" — ")[0]}" flagged as emerging imperfection`)}>Flag as imperfection</button>
                    <button className="btn tiny ghost" onClick={() => toast("Routed to accountable pre-order team")}>Route to team</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* selected top-10 breakdown */}
      <Card>
        <div className="tile-head">
          <span className="tile-title">Breakdown · {TOP10[sel].s}</span>
          <button className="btn tiny primary" onClick={() => toast(`"${TOP10[sel].s}" added to steering-committee top-10`)}>Add to steer-co top-10 <Icon name="arrow" size={12} /></button>
        </div>
        <div className="brk-grid">
          {Object.entries(CONTRIB).map(([dimName, rows]) => (
            <div key={dimName}>
              <div className="brk-lab">{dimName}</div>
              {rows.map(([k, v]) => <ContribBar key={k} label={k} pct={v} color="var(--violet)" />)}
            </div>
          ))}
          <div>
            <div className="brk-lab">Linked escalations</div>
            <div className="mono" style={{ fontSize: 30, fontWeight: 600, color: "var(--text)" }}>{fmt(Math.round(TOP10[sel].c * 84 * scale))}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>this period · {TOP10[sel].kind === "cliff" ? "cliff — trust-critical" : "slope — contain-able"}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================================== APP =================================== */
export default function App() {
  const [screen, setScreen] = useState(1);
  const [period, setPeriod] = useState("today");
  const [fresh, setFresh] = useState("nrt");
  const [toasts, setToasts] = useState([]);
  const d = PERIODS[period];

  // Freshness defaults to the plane of the screen (hot → NRT, cold → Daily).
  const goScreen = useCallback((id) => {
    setScreen(id);
    const plane = NAV.find((n) => n.id === id).plane;
    if (plane === "Hot") setFresh("nrt");
    if (plane === "Cold") setFresh("daily");
  }, []);

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <div className="wrap">
      <style>{CSS}</style>
      <Sidebar screen={screen} setScreen={goScreen} />
      <main className="main">
        <TopBar screen={screen} period={period} setPeriod={setPeriod} fresh={fresh} setFresh={setFresh} />
        <div className="scroll content">
          {screen === 1 && <Screen1 d={d} fresh={fresh} toast={toast} />}
          {screen === 2 && <Screen2 d={d} fresh={fresh} toast={toast} />}
          {screen === 3 && <Screen3 d={d} toast={toast} />}
          {screen === 4 && <Screen4 d={d} toast={toast} />}
        </div>
      </main>
      <Toasts items={toasts} />
    </div>
  );
}

/* ================================== CSS =================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg:#0B1220; --bg2:#0E1626; --surface:#121A2B; --surface2:#161F35; --raise:#1C2740;
  --line:#243350; --line2:#2E3E5E;
  --text:#E8EDF7; --text2:#9AA7C2; --muted:#5F6E8C;
  --green:#3DD6A0; --red:#FF5C72; --amber:#F5A524; --violet:#A78BFA; --blue:#5B8DEF;
  --green-t:rgba(61,214,160,.13); --red-t:rgba(255,92,114,.13); --amber-t:rgba(245,165,36,.14);
  --violet-t:rgba(167,139,250,.14); --blue-t:rgba(91,141,239,.14);
  --radius:14px; --radius-sm:10px;
}
*{box-sizing:border-box;}
.wrap{
  display:flex; min-height:100vh; height:100vh; overflow:hidden;
  font-family:'Inter',system-ui,sans-serif; color:var(--text);
  background:
    radial-gradient(1200px 600px at 80% -10%, rgba(91,141,239,.06), transparent 60%),
    radial-gradient(900px 500px at 10% 110%, rgba(167,139,250,.05), transparent 60%),
    var(--bg);
  -webkit-font-smoothing:antialiased;
}
.mono{font-family:'JetBrains Mono',monospace; font-variant-numeric:tabular-nums;}
.disp{font-family:'Space Grotesk',sans-serif;}
button{font-family:inherit; cursor:pointer; border:none; background:none; color:inherit;}
:focus-visible{outline:2px solid var(--blue); outline-offset:2px; border-radius:6px;}
::selection{background:rgba(91,141,239,.3);}
@media (prefers-reduced-motion:reduce){*{transition:none!important; animation:none!important;}}

/* scrollbars */
.scroll{overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--line2) transparent;}
.scroll::-webkit-scrollbar{width:9px; height:9px;}
.scroll::-webkit-scrollbar-thumb{background:var(--line2); border-radius:6px; border:2px solid var(--bg);}
.scroll::-webkit-scrollbar-track{background:transparent;}

/* ---------- sidebar ---------- */
.sidebar{width:236px; flex-shrink:0; background:var(--bg2); border-right:1px solid var(--line);
  display:flex; flex-direction:column; padding:20px 14px;}
.brand{padding:0 8px 4px;}
.brand-mark{font-size:26px; font-weight:700; letter-spacing:-0.5px; background:linear-gradient(90deg,#fff,#A9BEEA); -webkit-background-clip:text; background-clip:text; color:transparent;}
.brand-sub{font-size:11px; color:var(--violet); letter-spacing:1.4px; text-transform:uppercase; font-weight:600; margin-top:-1px;}
.client-chip{display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--text2);
  background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:7px 10px; margin:14px 4px 16px;}
.dot{width:7px; height:7px; border-radius:50%; flex-shrink:0;}
.nav{display:flex; flex-direction:column; gap:4px;}
.navitem{display:flex; align-items:center; gap:11px; padding:10px 10px; border-radius:10px; text-align:left; transition:background .16s, transform .16s; position:relative;}
.navitem:hover{background:var(--surface);}
.navitem.on{background:var(--surface2); box-shadow:inset 0 0 0 1px var(--line2);}
.navitem.on::before{content:""; position:absolute; left:0; top:9px; bottom:9px; width:3px; border-radius:3px; background:var(--violet);}
.navmeta{display:flex; flex-direction:column; flex:1; min-width:0;}
.navname{font-size:13px; font-weight:600; color:var(--text); line-height:1.2;}
.navpersona{font-size:10.5px; color:var(--muted); margin-top:1px;}
.planetag{font-size:8.5px; font-weight:700; letter-spacing:.4px; padding:2px 5px; border-radius:5px; text-transform:uppercase;}
.planetag.hot{color:var(--red); background:var(--red-t);}
.planetag.cold{color:var(--blue); background:var(--blue-t);}
.planetag.both{color:var(--violet); background:var(--violet-t);}
.legend{margin-top:auto; padding:14px 10px 4px; border-top:1px solid var(--line);}
.legend-title{font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:9px; font-weight:600;}
.legend-row{display:flex; align-items:center; gap:8px; font-size:11px; color:var(--text2); margin-bottom:8px; line-height:1.3;}

/* ---------- main ---------- */
.main{flex:1; display:flex; flex-direction:column; min-width:0;}
.topbar{display:flex; justify-content:space-between; align-items:flex-start; gap:16px;
  padding:18px 26px 16px; border-bottom:1px solid var(--line); background:rgba(11,18,32,.6); backdrop-filter:blur(8px);}
.screen-title{font-size:21px; font-weight:600; letter-spacing:-0.3px;}
.persona-chip{font-size:11px; color:var(--text2); background:var(--surface); border:1px solid var(--line); padding:3px 9px; border-radius:20px; font-weight:500;}
.screen-q{font-size:12px; color:var(--muted); margin:4px 0 0;}
.controls{display:flex; align-items:center; gap:12px; flex-shrink:0;}
.fresh,.period{display:flex; align-items:center; gap:2px; background:var(--surface); border:1px solid var(--line); border-radius:9px; padding:3px;}
.period{gap:0; padding-left:8px;}
.seg{font-size:11.5px; padding:6px 11px; border-radius:7px; color:var(--text2); font-weight:500; transition:all .16s; display:flex; align-items:center; gap:5px; white-space:nowrap;}
.seg:hover{color:var(--text);}
.seg.on{background:var(--raise); color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,.3);}
.live-dot{width:6px; height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 0 3px rgba(61,214,160,.2); animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}

.content{flex:1; padding:22px 26px 40px;}
.screen{display:flex; flex-direction:column; gap:16px; max-width:1320px; margin:0 auto;}

/* ---------- card ---------- */
.card{background:linear-gradient(180deg,var(--surface),var(--bg2)); border:1px solid var(--line); border-radius:var(--radius);
  box-shadow:0 1px 2px rgba(0,0,0,.2);}
.card.primary{border-color:var(--red)33; box-shadow:0 0 0 1px rgba(255,92,114,.12), 0 8px 24px rgba(0,0,0,.25);}
.qtitle{font-size:14px; font-weight:600; color:var(--text); letter-spacing:-0.2px; line-height:1.25;}
.verdict{font-size:12px; color:var(--text2);}
.statline{display:flex; justify-content:space-between; font-size:12px; color:var(--text2);}

/* pills / badges */
.pill{display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:3px 9px; border-radius:20px; border:1px solid; white-space:nowrap;}
.badge-inf{display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:600; color:var(--violet);
  background:var(--violet-t); border:1px solid rgba(167,139,250,.3); padding:2px 7px; border-radius:6px; white-space:nowrap;}
.ktag{display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:500; color:var(--text2);
  background:rgba(154,167,194,.08); border:1px solid var(--line2); padding:2px 7px; border-radius:6px; white-space:nowrap;}
.starflag{display:inline-flex; align-items:center; cursor:help;}

/* action button */
.btn{display:inline-flex; align-items:center; justify-content:center; gap:6px; font-size:12px; font-weight:600;
  padding:8px 13px; border-radius:9px; transition:all .16s; border:1px solid transparent;}
.btn.action{margin-top:14px; width:100%; background:var(--surface2); border-color:var(--line2); color:var(--text); justify-content:space-between;}
.btn.action:hover{background:var(--raise); border-color:var(--blue)55; color:#fff;}
.btn.primary{background:var(--blue); color:#0B1220;}
.btn.primary:hover{background:#6f9bf3; box-shadow:0 4px 14px rgba(91,141,239,.35);}
.btn.ghost{background:var(--surface); border-color:var(--line2); color:var(--text2);}
.btn.ghost:hover{color:var(--text); border-color:var(--blue)55;}
.btn.sm{font-size:11px; padding:6px 10px;}
.btn.tiny{font-size:10.5px; padding:5px 9px; border-radius:7px;}
.iconbtn{display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px; color:var(--text2); transition:all .16s; border:1px solid transparent;}
.iconbtn:hover{background:var(--surface2); color:var(--text);}
.iconbtn.sm{width:26px; height:26px;}

/* layout groups */
.triad{display:grid; grid-template-columns:repeat(3,1fr); gap:14px;}
.geo-row{display:grid; grid-template-columns:1fr 300px; gap:14px;}
.tile-head{display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:3px;}
.tile-title{font-size:13px; font-weight:600; color:var(--text); display:inline-flex; align-items:center; gap:6px;}
.tile-sub{font-size:11px; color:var(--muted); margin:2px 0 13px;}
.track{height:8px; background:var(--raise); border-radius:5px; overflow:hidden; flex:1;}
.fill{height:100%; border-radius:5px; transition:width .5s cubic-bezier(.4,0,.2,1);}
.guardrail{display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text2);
  margin-top:12px; padding-top:10px; border-top:1px solid var(--line);}

.nodebar{display:flex; align-items:center; gap:10px; width:100%; padding:5px 6px; border-radius:8px; transition:background .16s;}
.nodebar:hover{background:var(--surface2);}

/* AI band */
.aiband{display:flex; align-items:center; gap:0; background:linear-gradient(90deg, rgba(167,139,250,.08), var(--surface) 40%);
  border:1px solid var(--line); border-left:3px solid var(--violet); border-radius:var(--radius); padding:12px 18px; position:relative; flex-wrap:wrap;}
.band-seg{display:flex; flex-direction:column; gap:3px; padding:0 18px;}
.band-seg:first-child{padding-left:0;}
.band-div{width:1px; align-self:stretch; background:var(--line2); margin:2px 0;}
.band-lab{font-size:10px; text-transform:uppercase; letter-spacing:.6px; color:var(--muted); font-weight:600; display:flex; align-items:center; gap:5px;}
.band-lab.ai{color:var(--violet);}
.band-val{font-size:13px; color:var(--text); font-weight:500; display:flex; align-items:center; gap:7px;}
.band-val.ai{color:#D4C6FA;}
.band-seg.ai{flex:1; min-width:240px;}
.band-stamp{position:absolute; top:8px; right:14px; font-size:9.5px; color:var(--muted);}

/* AI sparkle card */
.ai-sparkle{background:linear-gradient(160deg, rgba(167,139,250,.12), var(--bg2)); border:1px solid rgba(167,139,250,.3);
  border-radius:var(--radius); padding:16px; display:flex; flex-direction:column; gap:12px;}
.sparkle-head{display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--violet);}
.sparkle-head span{color:var(--violet);}
.sparkle-body{font-size:12.5px; color:var(--text2); line-height:1.55;}
.sparkle-driver{margin-top:8px; font-size:13px; color:var(--text); font-weight:600; background:var(--violet-t); border:1px solid rgba(167,139,250,.25); border-radius:8px; padding:9px 11px;}

/* geo */
.geomap{position:relative; height:230px; border-radius:10px;
  background:radial-gradient(circle at 55% 45%, rgba(91,141,239,.05), transparent 65%); border:1px dashed var(--line2); margin-top:2px;}
.compass{position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--muted); font-weight:700;}
.regiontile{position:absolute; transform:translate(-50%,-50%); width:118px; border:1px solid; border-radius:10px; padding:9px 11px; backdrop-filter:blur(2px);}
.region-dot{position:absolute; top:-5px; right:-5px; width:10px; height:10px; border-radius:50%;}
.region-name{font-size:12px; font-weight:600; color:var(--text);}
.region-val{font-size:16px; font-weight:600; line-height:1.1;}
.region-hub{font-size:10px; color:var(--muted); margin-top:1px;}
.scale-legend{font-size:10px; color:var(--muted); display:inline-flex; align-items:center; gap:5px;}
.sw{width:9px; height:9px; border-radius:2px; display:inline-block;}

/* ---------- screen 2 queue ---------- */
.ops-summary{display:flex; align-items:center; gap:24px; padding:4px 2px;}
.ops-stat{display:flex; flex-direction:column;}
.ops-num{font-size:24px; font-weight:600; color:var(--text); line-height:1;}
.ops-lab{font-size:10.5px; color:var(--muted); text-transform:uppercase; letter-spacing:.4px; margin-top:3px;}
.guard-widget{background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:11px 14px; min-width:280px;}
.guard-title{font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; color:var(--muted); font-weight:600; margin-bottom:8px;}
.guard-row{display:flex; align-items:center; gap:9px; font-size:11.5px; color:var(--text2); margin-bottom:6px;}
.guard-row span:first-child{width:104px;}
.guard-row .mono{width:38px; text-align:right;}
.guard-note{font-size:10px; color:var(--muted); margin-top:4px; font-style:italic;}

.queue{overflow:hidden;}
.queue-body{max-height:calc(100vh - 300px);}
.qrow{display:grid; grid-template-columns:2.4fr 1fr .7fr 1.2fr 1.2fr 2.2fr .9fr 1.8fr; gap:12px; align-items:center;
  padding:12px 18px; border-bottom:1px solid var(--line); font-size:12px; transition:background .14s;}
.qrow:hover{background:var(--surface2);}
.qhead{background:var(--bg2); font-size:10px; text-transform:uppercase; letter-spacing:.5px; color:var(--muted); font-weight:600; position:sticky; top:0; z-index:2;}
.qhead:hover{background:var(--bg2);}
.qrow.carve{background:rgba(245,165,36,.04);}
.qrow.open{background:var(--surface2);}
.clab{display:block; font-weight:600; color:var(--text); font-size:12.5px; line-height:1.3;}
.csub{display:block; font-size:10px; color:var(--muted); margin-top:2px;}
.ndtag{font-size:11px; color:var(--text2);}
.miniband{font-size:10.5px; font-weight:600; padding:2px 7px; border-radius:5px; border:1px solid;}
.reltag{display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600;}
.reltag.break{color:var(--red);}
.reltag.met{color:var(--green);}
.tmpl{display:block; color:var(--text); font-weight:500; line-height:1.3;}
.chans{display:flex; gap:4px; margin-top:4px;}
.chan{font-size:9.5px; color:var(--blue); background:var(--blue-t); border:1px solid rgba(91,141,239,.25); padding:1px 6px; border-radius:5px;}
.carvetag{display:inline-block; font-size:9.5px; color:var(--amber); margin-top:4px; font-weight:600;}
.sla{display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:600; padding:4px 9px; border-radius:7px; border:1px solid;}
.sla.pulse{animation:pulse 1.4s infinite;}
.qactions{display:flex; align-items:center; gap:6px; justify-content:flex-end;}
.qexpand{padding:14px 18px 16px; background:var(--bg2); border-bottom:1px solid var(--line);}
.evi-title{font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; color:var(--muted); font-weight:600; margin-bottom:9px;}
.evi-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:12px;}
.evi{display:flex; align-items:flex-start; gap:7px; font-size:12px; color:var(--text2); background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:8px 10px; line-height:1.4;}
.promsg{background:var(--surface); border:1px solid var(--line2); border-radius:8px; padding:10px 12px; font-size:12px;}
.promsg-lab{color:var(--muted); font-size:10.5px; text-transform:uppercase; letter-spacing:.4px; font-weight:600; display:block; margin-bottom:4px;}
.promsg-txt{color:var(--text); font-style:italic; line-height:1.5;}
.foot-note{font-size:11px; color:var(--muted); line-height:1.5; margin:0; padding:0 2px;}

/* ---------- screen 3 ---------- */
.split-hero{padding:18px 20px;}
.split-lab{font-size:13px; color:var(--text2); margin-bottom:10px;}
.split-bars{display:flex; gap:4px; height:44px; border-radius:9px; overflow:hidden;}
.split-seg{display:flex; align-items:center; gap:7px; padding:0 14px; color:#0B1220; font-size:13px; font-weight:600; min-width:0; transition:width .5s;}
.split-seg .mono{font-size:18px;}
.split-sub{font-size:10.5px; opacity:.72; font-weight:500;}
.split-method{display:flex; align-items:center; gap:7px; flex-wrap:wrap; font-size:11.5px; color:var(--muted); margin-top:11px; line-height:1.5;}
.s3grid{display:grid; grid-template-columns:1.15fr 1fr; gap:14px; align-items:start;}
.s3side{display:flex; flex-direction:column; gap:14px;}
.cell-detail{border:1px solid; border-radius:10px; padding:13px 15px; margin-top:14px; transition:all .25s;}
.cliffslope{display:flex; gap:14px;}
.cliffslope>div{flex:1;}
.cs-div{width:1px; background:var(--line); flex:none;}
.cs-lab{font-size:11px; font-weight:600; display:flex; align-items:center; gap:5px; margin-bottom:9px;}
.cs-lab.break{color:var(--red);}
.cs-lab.shift{color:var(--amber);}
.cs-row{display:flex; justify-content:space-between; font-size:12px; color:var(--text2); padding:4px 0; border-bottom:1px solid var(--line);}
.cs-row:last-child{border-bottom:none;}

/* ---------- screen 4 ---------- */
.s4grid{display:grid; grid-template-columns:1.3fr 1fr; gap:14px; align-items:start;}
.s4side{display:flex; flex-direction:column; gap:14px;}
.top10{max-height:440px;}
.t10row{display:grid; grid-template-columns:26px 1fr 44px 90px; gap:11px; align-items:center; width:100%; text-align:left;
  padding:11px 18px; border-bottom:1px solid var(--line); transition:background .14s;}
.t10row:hover{background:var(--surface2);}
.t10row.on{background:var(--surface2); box-shadow:inset 3px 0 0 var(--violet);}
.t10rank{font-size:13px; color:var(--muted); font-weight:600;}
.t10body{min-width:0;}
.t10stmt{display:block; font-size:12.5px; color:var(--text); font-weight:500; line-height:1.35; margin-bottom:6px;}
.chronic{font-size:9px; color:var(--red); background:var(--red-t); border:1px solid rgba(255,92,114,.25); padding:1px 5px; border-radius:4px; margin-left:7px; font-weight:600; text-transform:uppercase; letter-spacing:.3px;}
.clifftag{font-size:9px; color:var(--amber); background:var(--amber-t); border:1px solid rgba(245,165,36,.25); padding:1px 5px; border-radius:4px; margin-left:7px; font-weight:600;}
.t10bar{display:block; height:6px; background:var(--raise); border-radius:4px; overflow:hidden;}
.t10fill{display:block; height:100%; border-radius:4px;}
.t10pct{font-size:13px; font-weight:600; color:var(--text); text-align:right;}
.dimtabs,.tabs{display:flex; gap:4px; background:var(--bg2); border:1px solid var(--line); border-radius:8px; padding:3px; margin:6px 0 12px;}
.dimtab,.tab{flex:1; font-size:11.5px; padding:6px; border-radius:6px; color:var(--text2); font-weight:500; transition:all .14s;}
.dimtab.on,.tab.on{background:var(--raise); color:var(--text);}
.imp{background:var(--bg2); border:1px solid var(--line); border-radius:10px; padding:12px 13px;}
.imp-head{display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:7px;}
.imp-title{font-size:12.5px; font-weight:600; color:var(--text); line-height:1.35;}
.imp-evi{font-size:11.5px; color:var(--text2); display:flex; align-items:flex-start; gap:6px; line-height:1.45; margin-bottom:10px;}
.imp-actions{display:flex; gap:7px;}
.brk-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:14px;}
.brk-lab{font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; color:var(--muted); font-weight:600; margin-bottom:11px;}

/* ---------- modal ---------- */
.scrim{position:fixed; inset:0; background:rgba(6,10,20,.66); backdrop-filter:blur(3px); z-index:50;
  display:flex; align-items:center; justify-content:center; padding:24px; animation:fade .18s;}
@keyframes fade{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--surface); border:1px solid var(--line2); border-radius:16px; padding:22px; width:min(560px,100%);
  box-shadow:0 24px 70px rgba(0,0,0,.55); animation:rise .22s cubic-bezier(.2,.8,.2,1);}
@keyframes rise{from{transform:translateY(14px); opacity:0;}to{transform:translateY(0); opacity:1;}}
.modal-head{display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;}
.modal-foot{display:flex; justify-content:space-between; align-items:center; margin-top:18px; padding-top:14px; border-top:1px solid var(--line);}

/* ---------- toasts ---------- */
.toaststack{position:fixed; bottom:22px; right:22px; z-index:60; display:flex; flex-direction:column; gap:9px;}
.toast{display:flex; align-items:center; gap:10px; background:var(--raise); border:1px solid var(--line2); border-left:3px solid var(--green);
  border-radius:10px; padding:12px 15px; font-size:12.5px; color:var(--text); box-shadow:0 12px 34px rgba(0,0,0,.45);
  animation:slidein .24s cubic-bezier(.2,.8,.2,1); max-width:360px;}
@keyframes slidein{from{transform:translateX(30px); opacity:0;}to{transform:translateX(0); opacity:1;}}

/* ---------- responsive ---------- */
@media (max-width:1120px){
  .triad{grid-template-columns:1fr;}
  .geo-row,.s3grid,.s4grid{grid-template-columns:1fr;}
  .evi-grid,.brk-grid{grid-template-columns:1fr 1fr;}
  .qrow{grid-template-columns:2fr 1fr .8fr 1.4fr 2fr 1.4fr; }
  .qrow>span:nth-child(5),.qrow>span:nth-child(7){display:none;}
}
@media (max-width:760px){
  .sidebar{display:none;}
}
`;
