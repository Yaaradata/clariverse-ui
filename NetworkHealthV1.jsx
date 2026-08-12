import React, { useState } from "react";
import {
  Zap, TrendingUp, TrendingDown, Activity, AlertTriangle, MapPin, Truck, Package,
  Tag, User, Sparkles, ChevronRight, Clock, Info, Layers, Building2, RefreshCw,
  ShieldCheck, Gauge, Store, ArrowUpRight, ArrowDownRight, Radio
} from "lucide-react";

/* ================================================================= tokens */
const C = {
  appBg: "#f4f5fb", panel: "#ffffff", panelAlt: "#fafbff",
  border: "#e7e9f3", borderStrong: "#d6d9ea",
  ink: "#1b1e34", ink2: "#585d7d", ink3: "#8a8fac",
  accent: "#4f46e5", accentLine: "#6366f1", accentSoft: "#eef0fe",
};
// HEALTH / STATE palette (severity) — green good, amber watch, red alert
const H = {
  strong:   { label: "Strong",   c: "#16a34a", bg: "#ecfdf3", bd: "#bbf7d0" },
  shifting: { label: "Shifting", c: "#d97706", bg: "#fffbeb", bd: "#fde68a" },
  breaking: { label: "Breaking", c: "#dc2626", bg: "#fef2f2", bd: "#fecaca" },
};
// TRAJECTORY palette (orthogonal to severity) — cool/brand hues
const TRAJ = {
  cliff: { label: "Cliff", c: "#7c3aed", bg: "#f3ecfe", Icon: Zap },
  slope: { label: "Slope", c: "#0891b2", bg: "#e5f6fb", Icon: TrendingUp },
};

/* --------------------------------------------------------------- helpers */
const Pill = ({ children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
    padding: "3px 9px", borderRadius: 999, lineHeight: 1.1, ...style }}>{children}</span>
);

function Delta({ v, bad }) {                     // bad=true → up is red, down is green
  const up = v.startsWith("+");
  const isBad = bad ? up : !up;
  const col = isBad ? "#dc2626" : "#16a34a";
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 12, fontWeight: 800, color: col }}>
      <Arrow size={12} strokeWidth={2.6} />{v}
    </span>
  );
}

function StateTag({ s }) {
  const h = H[s];
  return <Pill style={{ background: h.bg, color: h.c, border: `1px solid ${h.bd}` }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: h.c }} />{h.label}</Pill>;
}

function TrajTag({ t }) {
  const j = TRAJ[t]; const I = j.Icon;
  return <Pill style={{ background: j.bg, color: j.c }}><I size={11} strokeWidth={2.6} />{j.label}</Pill>;
}

function Spark({ data, color, w = 108, h = 30 }) {
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1;
  const pts = data.map((d, i) => [i / (data.length - 1) * w, h - ((d - min) / r) * (h - 4) - 2]);
  const line = pts.map(p => p.join(",")).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const id = "g" + color.replace("#", "");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.18" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

function RateBar({ pct, color }) {
  return (
    <div style={{ height: 6, background: "#eef0f6", borderRadius: 999, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

const Card = ({ children, style, accent }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", ...style }}>
    {accent && <div style={{ height: 3, background: accent }} />}
    <div style={{ padding: "14px 16px" }}>{children}</div>
  </div>
);

const SecTitle = ({ children, sub, right }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
    <div>
      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{children}</div>
      {sub && <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600, marginTop: 1 }}>{sub}</div>}
    </div>
    {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
  </div>
);

/* =================================================================== data */
const TRIAD = [
  {
    q: "Are we keeping our delivery promise?", primary: true,
    value: "91.4", unit: "%", metric: "On-time to promised EDD", delta: "−2.1", bad: true, state: "shifting",
    series: [94.8, 94.2, 93.9, 93.5, 93.1, 92.8, 92.5, 92.2, 92.0, 91.9, 91.6, 91.4], color: "#d97706",
    drivers: [["Forward leg on-time", "95.1%"], ["Last-mile (OFD) on-time", "88.2%"], ["Biggest WoW drop in 60 days", ""]],
  },
  {
    q: "What's breaking — and do we recover it?",
    value: "8.6", unit: "%", metric: "Promise-breach rate (of shipments)", delta: "+1.4", bad: true, state: "breaking",
    series: [6.9, 7.0, 7.2, 7.3, 7.5, 7.6, 7.8, 8.0, 8.1, 8.3, 8.4, 8.6], color: "#dc2626",
    drivers: [["NDR → RTO conversion", "3.2%  +0.4"], ["Re-attempt recovery", "74%  −3"], ["Failed 1st attempt (NDR)", "9.1%"]],
  },
  {
    q: "What's the customer cost?",
    value: "0.043", unit: "", metric: "Contacts per unit (CPU)", delta: "+0.006", bad: true, state: "shifting",
    series: [0.036, 0.037, 0.037, 0.038, 0.038, 0.039, 0.040, 0.040, 0.041, 0.042, 0.042, 0.043], color: "#d97706",
    drivers: [["Delivery-driven contact share", "38%"], ["Relational NPS", "61  −3"], ["WISMO share of contacts", "44%"]],
  },
];

const PATTERNS = [
  { t: "cliff", head: "Hyderabad DH cluster — OFD failures +38% in 3 days",
    body: "Mis-sort at MH → DH; concentrated in Kukatpally (500072). Recovery not keeping up.", blast: "18.4k shipments exposed" },
  { t: "slope", head: "Ecom Express (3P) forward-leg SLA degrading 3 weeks",
    body: "Adherence −9 pts over 21 days across South & West lanes. Systemic, not a spike.", blast: "22k shipments / week" },
  { t: "cliff", head: "Large Appliances — hub dwell time doubled at 3 DHs",
    body: "Oversized handling backlog; dwell 41h vs 19h baseline. Started this week.", blast: "4.3k shipments" },
  { t: "slope", head: "Tier-2 East (Patna, Guwahati) — address-gap NDRs creeping up",
    body: "Unstructured addresses defeating geocoding; first-attempt failures rising slowly.", blast: "6.8k shipments" },
];

const FAILMODES = [
  { name: "Stuck at hub / no scan", share: 31, rate: "2.7%", blast: "41k", delta: "+0.6", t: "slope", color: "#dc2626" },
  { name: "Failed attempt (NDR)", share: 26, rate: "2.2%", blast: "34k", delta: "+0.9", t: "cliff", color: "#dc2626" },
  { name: "Mis-route (wrong DH)", share: 18, rate: "1.5%", blast: "24k", delta: "+0.4", t: "cliff", color: "#d97706" },
  { name: "Address gap", share: 14, rate: "1.2%", blast: "19k", delta: "+0.2", t: "slope", color: "#d97706" },
  { name: "Courier SLA delay (3P)", share: 11, rate: "0.9%", blast: "15k", delta: "+0.5", t: "slope", color: "#d97706" },
];

const HOTSPOTS = {
  Pincode: [
    { name: "Hyderabad · Kukatpally", meta: "500072", rate: 24, share: "9%", blast: "18.4k", delta: "+7.1", t: "cliff", sev: "breaking" },
    { name: "Patna", meta: "800001", rate: 21, share: "4%", blast: "7.9k", delta: "+3.4", t: "slope", sev: "breaking" },
    { name: "Bengaluru · Whitefield", meta: "560066", rate: 17, share: "7%", blast: "14.2k", delta: "+2.3", t: "slope", sev: "shifting" },
    { name: "Delhi NCR · Ghaziabad", meta: "201001", rate: 15, share: "6%", blast: "12.8k", delta: "+1.1", t: "slope", sev: "shifting" },
    { name: "Mumbai · Thane", meta: "400601", rate: 13, share: "5%", blast: "10.1k", delta: "+0.6", t: "slope", sev: "shifting" },
  ],
  Courier: [
    { name: "Ecom Express", meta: "3rd-party", rate: 14, share: "24%", blast: "22k", delta: "+2.1", t: "slope", sev: "breaking" },
    { name: "XpressBees", meta: "3rd-party", rate: 13, share: "12%", blast: "9k", delta: "+0.4", t: "slope", sev: "shifting" },
    { name: "Delhivery", meta: "3rd-party", rate: 12, share: "17%", blast: "15k", delta: "+0.8", t: "slope", sev: "shifting" },
    { name: "eKart · South", meta: "1st-party", rate: 9, share: "15%", blast: "13k", delta: "+1.9", t: "cliff", sev: "shifting" },
    { name: "eKart · North", meta: "1st-party", rate: 7, share: "11%", blast: "10k", delta: "+0.3", t: "slope", sev: "strong" },
  ],
  Category: [
    { name: "Large Appliances", meta: "washing / fridge", rate: 16, share: "19%", blast: "21k", delta: "+3.2", t: "cliff", sev: "breaking" },
    { name: "Furniture", meta: "oversized", rate: 13, share: "12%", blast: "11k", delta: "+0.9", t: "slope", sev: "shifting" },
    { name: "Electronics · Large", meta: "TV / monitor", rate: 10, share: "16%", blast: "17k", delta: "+0.7", t: "slope", sev: "shifting" },
    { name: "Home & Kitchen", meta: "mid-size", rate: 7, share: "14%", blast: "15k", delta: "+0.4", t: "slope", sev: "strong" },
    { name: "Fashion", meta: "small parcel", rate: 5, share: "9%", blast: "8k", delta: "+0.2", t: "slope", sev: "strong" },
  ],
  Seller: [
    { name: "CloudTail", meta: "South FCs", rate: 12, share: "18%", blast: "16k", delta: "+2.4", t: "cliff", sev: "shifting" },
    { name: "Omniverse Retail", meta: "multi-FC", rate: 10, share: "14%", blast: "12k", delta: "+0.8", t: "slope", sev: "shifting" },
    { name: "RetailNet", meta: "West FCs", rate: 9, share: "11%", blast: "10k", delta: "+0.5", t: "slope", sev: "shifting" },
    { name: "Prime Sellers", meta: "North FCs", rate: 9, share: "9%", blast: "8k", delta: "+0.3", t: "slope", sev: "strong" },
    { name: "SuperComNet", meta: "East FCs", rate: 8, share: "8%", blast: "7k", delta: "+0.2", t: "slope", sev: "strong" },
  ],
};

// geo hubs: real-ish lng/lat, volume weight, health state
const HUBS = [
  { n: "Delhi NCR", lng: 77.1, lat: 28.7, v: 3, s: "shifting" },
  { n: "Mumbai", lng: 72.88, lat: 19.08, v: 3, s: "shifting" },
  { n: "Pune", lng: 73.86, lat: 18.52, v: 2, s: "strong" },
  { n: "Ahmedabad", lng: 72.57, lat: 23.03, v: 2, s: "strong" },
  { n: "Jaipur", lng: 75.79, lat: 26.91, v: 1.5, s: "strong" },
  { n: "Indore", lng: 75.86, lat: 22.72, v: 1.5, s: "strong" },
  { n: "Bengaluru", lng: 77.59, lat: 12.97, v: 3, s: "shifting" },
  { n: "Hyderabad", lng: 78.49, lat: 17.39, v: 3.2, s: "breaking" },
  { n: "Chennai", lng: 80.27, lat: 13.08, v: 2.4, s: "strong" },
  { n: "Kochi", lng: 76.27, lat: 9.93, v: 1.4, s: "strong" },
  { n: "Kolkata", lng: 88.36, lat: 22.57, v: 2.4, s: "strong" },
  { n: "Patna", lng: 85.14, lat: 25.59, v: 1.6, s: "shifting" },
  { n: "Lucknow", lng: 80.95, lat: 26.85, v: 1.8, s: "strong" },
  { n: "Guwahati", lng: 91.74, lat: 26.14, v: 1.2, s: "shifting" },
];

/* ============================================================ geo hub map */
function GeoMap() {
  const W = 300, Hh = 320, pad = 24;
  const lngMin = 68, lngMax = 92, latMin = 8, latMax = 32;
  const x = l => pad + (l - lngMin) / (lngMax - lngMin) * (W - 2 * pad);
  const y = l => pad + (latMax - l) / (latMax - latMin) * (Hh - 2 * pad);
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {[70, 75, 80, 85, 90].map(g => (
        <line key={"v" + g} x1={x(g)} y1={pad} x2={x(g)} y2={Hh - pad} stroke="#eef0f6" strokeWidth="1" />
      ))}
      {[12, 18, 24, 30].map(g => (
        <line key={"h" + g} x1={pad} y1={y(g)} x2={W - pad} y2={y(g)} stroke="#eef0f6" strokeWidth="1" />
      ))}
      {HUBS.map(h => {
        const hh = H[h.s], r = 4 + h.v * 3.4;
        return (
          <g key={h.n}>
            <circle cx={x(h.lng)} cy={y(h.lat)} r={r + 4} fill={hh.c} opacity="0.10" />
            <circle cx={x(h.lng)} cy={y(h.lat)} r={r} fill={hh.c} opacity="0.85" stroke="#fff" strokeWidth="1.4" />
            <text x={x(h.lng)} y={y(h.lat) - r - 3} textAnchor="middle"
              style={{ fontSize: 8.5, fontWeight: 700, fill: C.ink2 }}>{h.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ==================================================================== app */
export default function NetworkHealth() {
  const [period, setPeriod] = useState("30d");
  const [dim, setDim] = useState("Pincode");
  const rows = HOTSPOTS[dim];
  const dimIcon = { Pincode: MapPin, Courier: Truck, Category: Tag, Seller: Store };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: C.appBg,
      color: C.ink, minHeight: "100vh" }}>

      {/* -------------------------------------------------------- header */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: C.panel,
        borderBottom: `1px solid ${C.border}`, padding: "11px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
            display: "grid", placeItems: "center" }}><Radio size={17} color="#fff" strokeWidth={2.4} /></div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.2 }}>Delivery Network Health · Control Tower</div>
            <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600, marginTop: -1 }}>Forward-leg · pattern &amp; hotspot view · leadership</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 2, background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
            {["7d", "30d", "90d"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 6, border: "none",
                background: period === p ? C.accent : "transparent", color: period === p ? "#fff" : C.ink2 }}>{p}</button>
            ))}
          </div>
          <Pill style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>
            <Clock size={12} strokeWidth={2.4} /> FDP ~24h · illustrative
          </Pill>
        </div>
      </header>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 22px 40px" }}>

        {/* ------------------------------------------ AI summary band */}
        <div style={{ background: "linear-gradient(180deg,#ffffff,#fafaff)", border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "13px 16px", marginBottom: 16, boxShadow: "0 1px 2px rgba(30,30,60,.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
            <Sparkles size={15} style={{ color: C.accent }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: C.accent, letterSpacing: 0.2 }}>THIS WEEK · WHAT CHANGED</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: C.ink3, fontWeight: 600 }}>vs previous 7 days</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 }}>
            <BandCell icon={TrendingDown} label="Promise adherence"
              value="91.4%" delta="−2.1 pts" bad note="biggest drop in 60 days" />
            <BandCell icon={AlertTriangle} label="Where it hurts most"
              value="Hyderabad DH" delta="3× network breach" bad note="Kukatpally cluster" />
            <BandCell icon={Layers} label="Blast radius (new)"
              value="18.4k" delta="shipments exposed" bad note="this week alone" />
            <BandCell icon={ShieldCheck} label="In flight"
              value="2 + 1" delta="escalations · review" note="hub escalations, courier review" good />
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.accentSoft,
            borderRadius: 9, padding: "10px 12px" }}>
            <Zap size={16} strokeWidth={2.4} style={{ color: C.accent, marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
              <b>1 cliff and 1 slope explain 61% of this week's added breaches.</b> Hyderabad is a <b>cliff</b> — mis-sort
              at MH→DH that spiked 3 days ago. Ecom Express forward-leg SLA is a <b>slope</b> — degrading for 3 weeks.
              The rest is within normal weekly variation.
            </div>
          </div>
        </div>

        {/* ------------------------------------------ executive triad */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
          {TRIAD.map((t, i) => (
            <Card key={i} accent={t.primary ? C.accentLine : H[t.state].c}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: t.primary ? 14 : 13, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{t.q}</div>
                <span style={{ marginLeft: "auto", flexShrink: 0 }}><StateTag s={t.state} /></span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: t.primary ? 40 : 32, fontWeight: 800, letterSpacing: -1, color: C.ink }}>{t.value}</span>
                    <span style={{ fontSize: t.primary ? 20 : 17, fontWeight: 800, color: C.ink3 }}>{t.unit}</span>
                    <Delta v={t.delta} bad={t.bad} />
                  </div>
                  <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600, marginTop: 2 }}>{t.metric}</div>
                </div>
                <Spark data={t.series} color={t.color} w={t.primary ? 120 : 96} h={t.primary ? 40 : 34} />
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
                {t.drivers.map(([k, v], j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: C.ink2 }}>{k}</span>
                    {v && <span style={{ marginLeft: "auto", fontWeight: 700, color: C.ink }}>{v}</span>}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* ----------------- developing patterns  +  failure modes ------ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>

          {/* developing patterns (AI) */}
          <Card accent="#7c3aed" style={{ padding: 0 }}>
            <div style={{ padding: "14px 16px 6px" }}>
              <SecTitle sub="Sudden spikes vs creeping degradation — ranked by added breaches"
                right={<Pill style={{ background: C.accentSoft, color: C.accent }}><Sparkles size={11} /> AI-detected</Pill>}>
                Developing patterns
              </SecTitle>
            </div>
            <div style={{ padding: "0 16px 14px" }}>
              {PATTERNS.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 11, padding: "11px 0",
                  borderTop: i ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}><TrajTag t={p.t} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, lineHeight: 1.35 }}>{p.head}</div>
                    <div style={{ fontSize: 11.5, color: C.ink2, lineHeight: 1.4, marginTop: 3 }}>{p.body}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5,
                      fontSize: 11, fontWeight: 700, color: "#b45309", background: "#fffbeb",
                      border: "1px solid #fde68a", padding: "1px 7px", borderRadius: 999 }}>
                      <Layers size={10} strokeWidth={2.6} /> {p.blast}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* failure modes */}
          <Card accent={C.accentLine}>
            <SecTitle sub="Share of network breaches · rate · shipments exposed">
              What's going wrong (failure modes)
            </SecTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 4 }}>
              {FAILMODES.map((f, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.name}</span>
                    <span style={{ marginLeft: "auto" }}><TrajTag t={f.t} /></span>
                    <Delta v={f.delta} bad />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}><RateBar pct={f.share} color={f.color} /></div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink2, width: 34, textAlign: "right" }}>{f.share}%</span>
                    <span style={{ fontSize: 11, color: C.ink3, fontWeight: 600, width: 78, textAlign: "right" }}>
                      {f.rate} · {f.blast}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ------------------------------ hotspots (the core) + geo map --- */}
        <Card accent="#0891b2" style={{ padding: 0 }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.border}` }}>
            <SecTitle sub="Where the promise is breaking — sliced by dimension · rows drill to matching cases"
              right={
                <div style={{ display: "flex", gap: 3, background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
                  {Object.keys(HOTSPOTS).map(k => {
                    const I = dimIcon[k];
                    return (
                      <button key={k} onClick={() => setDim(k)} style={{
                        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
                        padding: "5px 11px", borderRadius: 6, border: "none",
                        background: dim === k ? C.accent : "transparent", color: dim === k ? "#fff" : C.ink2 }}>
                        <I size={13} strokeWidth={2.2} />{k}
                      </button>
                    );
                  })}
                </div>
              }>
              Hotspots
            </SecTitle>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0 }}>
            {/* ranked list */}
            <div style={{ padding: "6px 8px 10px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", padding: "6px 10px", fontSize: 10, letterSpacing: 0.3,
                textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>
                <span style={{ flex: 1 }}>{dim}</span>
                <span style={{ width: 150 }}>Breach rate</span>
                <span style={{ width: 62, textAlign: "right" }}>Share</span>
                <span style={{ width: 78, textAlign: "right" }}>Blast</span>
                <span style={{ width: 60, textAlign: "right" }}>WoW</span>
                <span style={{ width: 20 }} />
              </div>
              {rows.map((r, i) => {
                const sev = H[r.sev];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 10px", borderRadius: 9,
                    borderTop: `1px solid ${C.border}`, cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.panelAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.name}</span>
                        <TrajTag t={r.t} />
                      </div>
                      <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600, marginTop: 1 }}>{r.meta}</div>
                    </div>
                    <div style={{ width: 150, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1 }}><RateBar pct={r.rate * 4} color={sev.c} /></div>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: sev.c, width: 34 }}>{r.rate}%</span>
                    </div>
                    <span style={{ width: 62, textAlign: "right", fontSize: 12, color: C.ink2, fontWeight: 600 }}>{r.share}</span>
                    <span style={{ width: 78, textAlign: "right", fontSize: 12, color: C.ink, fontWeight: 700 }}>{r.blast}</span>
                    <span style={{ width: 60, textAlign: "right" }}><Delta v={r.delta} bad /></span>
                    <span style={{ width: 20, textAlign: "right" }}><ChevronRight size={15} style={{ color: C.ink3 }} /></span>
                  </div>
                );
              })}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px 2px", fontSize: 11, color: C.ink3, fontWeight: 600 }}>
                <Info size={12} /> Blast = shipments exposed in the selected period. Dimensions stop at seller / category / sub-category.
              </div>
            </div>

            {/* geo map */}
            <div style={{ padding: "10px 14px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                <MapPin size={13} style={{ color: C.ink3 }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink2 }}>Geographic concentration · national</span>
              </div>
              <GeoMap />
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 2 }}>
                {[["strong", "Healthy"], ["shifting", "Watch"], ["breaking", "Breaking"]].map(([k, l]) => (
                  <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, color: C.ink2, fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: H[k].c }} />{l}
                  </span>
                ))}
                <span style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600 }}>· size = shipment volume</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ------------------------------------------------------ band cell part  */
function BandCell({ icon: I, label, value, delta, note, bad, good }) {
  const dcol = good ? "#16a34a" : bad ? "#dc2626" : C.ink2;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, letterSpacing: 0.2,
        textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>
        <I size={13} strokeWidth={2.2} style={{ color: bad ? "#dc2626" : good ? "#16a34a" : C.ink3 }} />{label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: -0.3 }}>{value}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: dcol }}>{delta}</span>
      </div>
      <div style={{ fontSize: 11, color: C.ink3, fontWeight: 500 }}>{note}</div>
    </div>
  );
}
