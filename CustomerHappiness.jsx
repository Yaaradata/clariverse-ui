import React, { useState, useMemo } from "react";
import {
  Sparkles, ArrowUpRight, ArrowDownRight, ArrowRight, Minus, Info, Star,
  MessageSquareText, Gauge, Crown, RefreshCw, AlertTriangle, Wallet
} from "lucide-react";

/* ============================================================================
   "Are our customers happy?"  —  Head of CX command center (marketplace)
   01 Happiness read · 02 RFM · 03 Lifecycle states · 04 Value & profitability

   Governance: question-framed exec cards · thin AI exec band · compact VoC
   sparkle (AI differentiator kept above the fold) · one period selector
   cascades to every widget · defensible / score-traceable numbers · neutral
   labels where possible (RFM canonical names anchored to their R/F/M rule) ·
   scatter/quadrant + waterfall used for two-dimension & value-leak questions ·
   every visual sized to its data.
   ========================================================================== */

/* ----------------------------- design tokens ----------------------------- */
const T = {
  canvas: "#F6F7F9", surface: "#FFFFFF", surfaceSubtle: "#FBFBFD",
  ink: "#12151C", ink2: "#3A414E", muted: "#6B7382", faint: "#99A0AD",
  line: "#E7E9EF", lineSoft: "#EEF0F5",
  brand: "#5B4BE0", brandSoft: "#EEECFC", brandInk: "#3B2FB0",
  good: "#10935A", goodSoft: "#E4F4EC",
  warn: "#C7860B", warnSoft: "#FBF0DA",
  bad: "#D84C4C", badSoft: "#FBE7E7",
};
const band = (v) => (v >= 70 ? T.good : v >= 55 ? T.warn : T.bad);
const bandSoft = (v) => (v >= 70 ? T.goodSoft : v >= 55 ? T.warnSoft : T.badSoft);

/* entity palettes (kept separate from the green/amber/red change palette) */
const COHORT_COLOR = { new: "#3B82C4", repeat: "#159B94", plus: "#7A5BE0", lapsing: "#94A0B2" };

/* --------------------------------- data ---------------------------------- */
const PERIODS = {
  WoW: { key: "WoW", label: "vs last week", short: "wk", scale: 1 },
  MoM: { key: "MoM", label: "vs last month", short: "mo", scale: 3.2 },
  QoQ: { key: "QoQ", label: "vs last quarter", short: "qtr", scale: 8 },
};

const DATA = {
  WoW: {
    interactions: "842K",
    headline: { score: 68, delta: +2, nps: 46, npsD: +3, csat: 82, csatD: -1, ease: 3.2, easeD: +0.1 },
    spark: [63, 64, 63, 65, 66, 65, 67, 68],
    composite: [
      { k: "Product satisfaction", w: 18, s: 80 }, { k: "Support resolution", w: 20, s: 72 },
      { k: "Delivery experience", w: 28, s: 71 }, { k: "Overall sentiment", w: 12, s: 63 },
      { k: "Returns & refunds", w: 22, s: 54 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 66, delta: +1, share: 31 },
      { id: "repeat", name: "Repeat", score: 70, delta: +2, share: 38 },
      { id: "plus", name: "Plus / loyal", score: 77, delta: 0, share: 22 },
      { id: "lapsing", name: "Lapsing", score: 45, delta: -4, share: 9 },
    ],
    exec: { shifting: "Refund turnaround after return pickup", magnitude: "Refund-linked complaints up 18% wk/wk; drags the index ~6 pts", affected: "Lapsing & at-risk value segments", doing: "Auto-refund on pickup scan piloting in 3 hubs" },
  },
  MoM: {
    interactions: "3.6M",
    headline: { score: 69, delta: +1, nps: 45, npsD: +1, csat: 83, csatD: +1, ease: 3.2, easeD: 0 },
    spark: [66, 67, 66, 68, 67, 69, 68, 69],
    composite: [
      { k: "Product satisfaction", w: 18, s: 81 }, { k: "Support resolution", w: 20, s: 74 },
      { k: "Delivery experience", w: 28, s: 72 }, { k: "Overall sentiment", w: 12, s: 64 },
      { k: "Returns & refunds", w: 22, s: 56 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 67, delta: +2, share: 31 },
      { id: "repeat", name: "Repeat", score: 71, delta: +1, share: 38 },
      { id: "plus", name: "Plus / loyal", score: 78, delta: +1, share: 22 },
      { id: "lapsing", name: "Lapsing", score: 47, delta: -2, share: 9 },
    ],
    exec: { shifting: "Refund turnaround after return pickup", magnitude: "Refund-linked complaints up 9% mo/mo; below target", affected: "Lapsing value segments", doing: "Auto-refund on pickup scan piloting in 3 hubs" },
  },
  QoQ: {
    interactions: "10.4M",
    headline: { score: 67, delta: +3, nps: 44, npsD: +4, csat: 82, csatD: +2, ease: 3.1, easeD: +0.2 },
    spark: [61, 62, 64, 63, 65, 66, 66, 67],
    composite: [
      { k: "Product satisfaction", w: 18, s: 79 }, { k: "Support resolution", w: 20, s: 71 },
      { k: "Delivery experience", w: 28, s: 70 }, { k: "Overall sentiment", w: 12, s: 62 },
      { k: "Returns & refunds", w: 22, s: 53 },
    ],
    cohorts: [
      { id: "new", name: "New buyers", score: 65, delta: +3, share: 30 },
      { id: "repeat", name: "Repeat", score: 69, delta: +2, share: 38 },
      { id: "plus", name: "Plus / loyal", score: 76, delta: +2, share: 23 },
      { id: "lapsing", name: "Lapsing", score: 44, delta: -1, share: 9 },
    ],
    exec: { shifting: "Returns & refunds experience", magnitude: "Post-purchase is the biggest drag on the index this quarter", affected: "Lapsing & at-risk value segments", doing: "Refund-SLA program + return-pickup routing rebuild underway" },
  },
};

const VOC = { theme: "Refund lag after the item is already picked up", quote: "You collected the product on Monday — why is my money still not back?", sent: { app: 41, social: 33, support: 37 } };

/* 02 — RFM segments (canonical names, anchored to R/F/M scores) */
const RFM = [
  { id: "champions", name: "Champions", R: 5, F: 5, M: 5, share: 9, rev: 26, clv: "₹41k", color: "#5B4BE0", note: "Recent, frequent, top spenders — your advocates. Reward & ask for referrals." },
  { id: "loyal", name: "Loyal", R: 4, F: 5, M: 4, share: 13, rev: 21, clv: "₹19k", color: "#159B94", note: "Consistent repeat buyers just below Champions. Upsell adjacent categories." },
  { id: "potential", name: "Potential Loyalists", R: 5, F: 3, M: 3, share: 15, rev: 13, clv: "₹8.5k", color: "#3B82C4", note: "Recent buyers starting to repeat. Nurture the 2nd–3rd order." },
  { id: "new", name: "New Customers", R: 5, F: 1, M: 2, share: 16, rev: 6, clv: "₹2.1k", color: "#4CA6E8", note: "First order just placed. Onboard hard toward a second purchase." },
  { id: "attention", name: "Need Attention", R: 3, F: 3, M: 3, share: 11, rev: 9, clv: "₹6.2k", color: "#B0894A", note: "Above-average once, recency slipping. Timely offer before they cool." },
  { id: "atrisk", name: "At Risk", R: 2, F: 4, M: 4, share: 9, rev: 11, clv: "₹12k", color: "#D98A3D", note: "Were valuable & frequent, now overdue. Personalised win-back." },
  { id: "cantlose", name: "Can't Lose Them", R: 1, F: 5, M: 5, share: 4, rev: 9, clv: "₹22k", color: "#C24D6E", note: "Best customers gone quiet. Highest win-back priority — call them." },
  { id: "hibernating", name: "Hibernating", R: 2, F: 1, M: 1, share: 8, rev: 3, clv: "₹1.4k", color: "#94A0B2", note: "Low recency & frequency. Light-touch reactivation only." },
];

/* 03 — lifecycle / purchase-frequency states */
const LIFECYCLE = [
  { id: "active", name: "Active customer", def: "Purchased within the active window.", count: "2.90M", share: 42, delta: +1.1, color: "#159B94" },
  { id: "occasional", name: "Occasional buyer", def: "Purchases infrequently but remains active.", count: "1.45M", share: 21, delta: -0.6, color: "#3B82C4" },
  { id: "loyal", name: "Loyal customer", def: "Repeated purchases over an extended period.", count: "1.24M", share: 18, delta: +0.4, color: "#5B4BE0" },
  { id: "seasonal", name: "Seasonal buyer", def: "Purchases during predictable periods.", count: "0.62M", share: 9, delta: +0.2, color: "#7A8BD0" },
  { id: "reactivated", name: "Reactivated customer", def: "Returned after lapsing or churning.", count: "0.34M", share: 5, delta: +0.9, color: "#3AA97A" },
  { id: "dormant", name: "Dormant customer", def: "Inactive for a longer period.", count: "0.35M", share: 5, delta: +0.3, color: "#94A0B2" },
];
const FLOWS = [
  { from: "New", to: "Active", count: "+61K", good: true, states: ["active"] },
  { from: "Active", to: "Occasional", count: "52K", good: false, states: ["active", "occasional"] },
  { from: "Occasional", to: "Dormant", count: "28K", good: false, states: ["occasional", "dormant"] },
  { from: "Dormant", to: "Reactivated", count: "+34K", good: true, states: ["dormant", "reactivated"] },
];

/* 04 — value & profitability */
const WATERFALL = [
  { label: "Gross revenue", val: 1000, type: "total" },
  { label: "Product cost", val: -620, type: "cost" },
  { label: "Fulfilment & returns", val: -120, type: "cost" },
  { label: "Cost-to-serve", val: -70, type: "cost" },
  { label: "Promotions & incentives", val: -85, type: "cost" },
  { label: "Contribution margin", val: 105, type: "result" },
];
const VALUE_TIERS = [
  { id: "vip", name: "VIP / Champions", tier: "Top decile", aov: "₹2,850", freq: "9.2 / yr", clv: "₹41k", base: 8, contrib: 34, flag: "accretive", color: "#5B4BE0" },
  { id: "core", name: "Core high-value", tier: "HVC", aov: "₹1,640", freq: "4.1 / yr", clv: "₹14k", base: 27, contrib: 41, flag: "accretive", color: "#159B94" },
  { id: "fullprice", name: "Occasional full-price", tier: "Low cost-to-serve", aov: "₹1,180", freq: "1.8 / yr", clv: "₹4.2k", base: 45, contrib: 31, flag: "accretive", color: "#3B82C4" },
  { id: "dilutive", name: "Promotion-dependent", tier: "Margin-dilutive", aov: "₹2,100", freq: "6.5 / yr", clv: "−₹1.1k", base: 12, contrib: -6, flag: "dilutive", color: "#C24D6E" },
];

/* ------------------------------ small helpers ---------------------------- */
const fmtDelta = (d) => (d > 0 ? `+${d}` : d < 0 ? `${d}` : `0`);
function Delta({ value, invert = false, suffix = "", size = 12.5 }) {
  const good = value > 0 ? !invert : value < 0 ? invert : null;
  const color = value === 0 ? T.muted : good ? T.good : T.bad;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color, fontSize: size, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
      <Icon size={size + 1.5} strokeWidth={2.4} />{fmtDelta(value).replace(/[+-]/, "")}{suffix}
    </span>
  );
}
function polar(cx, cy, r, valPct) { const a = Math.PI * (1 - valPct / 100); return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }; }
function arcPath(cx, cy, r, vStart, vEnd) { const s = polar(cx, cy, r, vStart), e = polar(cx, cy, r, vEnd); return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`; }

function HappinessGauge({ value }) {
  const cx = 130, cy = 118, r = 96, sw = 15;
  const n = polar(cx, cy, r - 24, value);
  return (
    <svg viewBox="0 0 260 140" width="100%" style={{ display: "block" }} aria-label={`Happiness index ${value}`}>
      <path d={arcPath(cx, cy, r, 0, 55)} stroke={T.bad} strokeWidth={sw} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d={arcPath(cx, cy, r, 55, 70)} stroke={T.warn} strokeWidth={sw} fill="none" />
      <path d={arcPath(cx, cy, r, 70, 100)} stroke={T.good} strokeWidth={sw} fill="none" strokeLinecap="round" opacity={0.9} />
      <line x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={T.ink} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={7} fill={T.ink} /><circle cx={cx} cy={cy} r={3} fill={T.surface} />
      <text x={cx} y={cy - 34} textAnchor="middle" fontSize="46" fontWeight="700" fill={T.ink} fontFamily="'Space Grotesk',sans-serif" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</text>
      <text x={cx} y={cy - 15} textAnchor="middle" fontSize="12.5" fill={T.muted} fontWeight="500">/ 100</text>
    </svg>
  );
}
function Sparkline({ points, color = T.brand, w = 108, h = 30 }) {
  const min = Math.min(...points), max = Math.max(...points), rng = max - min || 1, step = w / (points.length - 1);
  const dd = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - ((p - min) / rng) * (h - 6) - 3).toFixed(1)}`).join(" ");
  const lx = w, ly = h - ((points[points.length - 1] - min) / rng) * (h - 6) - 3;
  return (<svg width={w} height={h} style={{ display: "block", overflow: "visible" }}><path d={dd} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /><circle cx={lx} cy={ly} r={2.6} fill={color} /></svg>);
}

/* ------------------------------- shell bits ------------------------------ */
function Card({ children, style, primary = false, onMouseLeave }) {
  return (
    <div onMouseLeave={onMouseLeave} style={{
      background: T.surface, border: `1px solid ${T.line}`, borderRadius: 16, padding: 18, position: "relative",
      boxShadow: primary ? "0 1px 2px rgba(18,21,28,.04), 0 8px 24px -12px rgba(91,75,224,.18)" : "0 1px 2px rgba(18,21,28,.035)", ...style,
    }}>{children}</div>
  );
}
function CardQ({ children, hint, star }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 650, color: T.ink, letterSpacing: "-0.01em" }}>{children}</h3>
      {star ? <Star size={13} fill={T.warn} color={T.warn} /> : hint ? <span title={hint} style={{ display: "inline-flex", color: T.faint, cursor: "help" }}><Info size={13.5} /></span> : null}
    </div>
  );
}
function SectionHeader({ num, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, margin: "26px 2px 12px" }}>
      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: T.brand, background: T.brandSoft, borderRadius: 8, padding: "3px 9px", letterSpacing: ".04em" }}>{num}</span>
      <h2 style={{ margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18.5, fontWeight: 650, letterSpacing: "-0.02em", color: T.ink }}>{title}</h2>
      {sub && <span style={{ fontSize: 12, color: T.faint, marginBottom: 2 }}>{sub}</span>}
      <div style={{ flex: 1, borderBottom: `1px solid ${T.line}`, marginBottom: 6 }} />
    </div>
  );
}

/* ---- 02: RFM bubble quadrant ---- */
function RFMQuadrant({ selected, onSelect }) {
  const W = 440, H = 300, padL = 44, padR = 18, padT = 16, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const fx = (F) => padL + ((F - 0.5) / 5) * plotW;
  const fy = (R) => padT + ((5.5 - R) / 5) * plotH;
  const maxShare = Math.max(...RFM.map((s) => s.share));
  const rad = (share) => 10 + Math.sqrt(share / maxShare) * 26;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* quadrant guides */}
      <line x1={fx(3)} y1={padT} x2={fx(3)} y2={padT + plotH} stroke={T.lineSoft} strokeWidth={1} strokeDasharray="4 4" />
      <line x1={padL} y1={fy(3)} x2={padL + plotW} y2={fy(3)} stroke={T.lineSoft} strokeWidth={1} strokeDasharray="4 4" />
      {/* axes */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={T.line} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={T.line} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={T.muted}>Frequency  →</text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fontSize="11" fontWeight="600" fill={T.muted} transform={`rotate(-90 14 ${padT + plotH / 2})`}>Recency  →</text>
      {/* bubbles */}
      {RFM.map((s) => {
        const on = selected === s.id, r = rad(s.share);
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
            <circle cx={fx(s.F)} cy={fy(s.R)} r={r} fill={s.color} fillOpacity={on ? 0.9 : 0.24} stroke={s.color} strokeWidth={on ? 2.5 : 1.5} />
            <text x={fx(s.F)} y={fy(s.R) + r + 11} textAnchor="middle" fontSize="9.5" fontWeight={on ? 700 : 600} fill={on ? s.color : T.muted}>{s.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---- 04: value waterfall ---- */
function Waterfall() {
  const W = 470, H = 260, padL = 8, padR = 8, padT = 26, padB = 46;
  const plotW = W - padL - padR, plotH = H - padT - padB, max = 1000;
  const barW = plotW / WATERFALL.length - 12;
  const y = (v) => padT + plotH - (v / max) * plotH;
  let run = 0; const bars = [];
  WATERFALL.forEach((s, i) => {
    const x = padL + i * (plotW / WATERFALL.length) + 6;
    let top, bottom, color;
    if (s.type === "total") { top = 0; bottom = s.val; color = T.ink2; }
    else if (s.type === "result") { top = 0; bottom = s.val; color = T.brand; }
    else { top = run; bottom = run + s.val; color = "#D8846A"; }
    const yTop = y(Math.max(top, bottom)), hgt = Math.abs(y(top) - y(bottom));
    bars.push({ ...s, x, yTop, hgt, barW, color, runBefore: run });
    if (s.type === "cost") run += s.val; else if (s.type === "total") run = s.val;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {bars.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y={b.yTop} width={b.barW} height={Math.max(2, b.hgt)} rx={3} fill={b.color} fillOpacity={b.type === "cost" ? 0.85 : 1} />
          <text x={b.x + b.barW / 2} y={b.yTop - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={b.type === "cost" ? "#B4573A" : b.color} style={{ fontVariantNumeric: "tabular-nums" }}>
            {b.val > 0 && b.type !== "total" && b.type !== "result" ? "" : b.val < 0 ? "−" : ""}₹{Math.abs(b.val)}
          </text>
          <text x={b.x + b.barW / 2} y={H - 26} textAnchor="middle" fontSize="9.3" fontWeight="600" fill={T.muted}>
            {b.label.split(" ").slice(0, 2).join(" ")}
          </text>
          {b.label.split(" ").length > 2 && <text x={b.x + b.barW / 2} y={H - 15} textAnchor="middle" fontSize="9.3" fontWeight="600" fill={T.muted}>{b.label.split(" ").slice(2).join(" ")}</text>}
          {i < bars.length - 1 && bars[i + 1].type === "cost" && (
            <line x1={b.x + b.barW} y1={y(b.type === "total" ? b.val : b.runBefore + b.val)} x2={bars[i + 1].x} y2={y(b.type === "total" ? b.val : b.runBefore + b.val)} stroke={T.faint} strokeWidth={1} strokeDasharray="3 3" />
          )}
        </g>
      ))}
      <text x={padL} y={12} fontSize="10.5" fill={T.faint} fontWeight="600">₹ Cr · this period</text>
    </svg>
  );
}

/* ================================ APP ==================================== */
export default function CustomerHappiness() {
  const [period, setPeriod] = useState("WoW");
  const [cohort, setCohort] = useState("all");
  const [hoverComposite, setHoverComposite] = useState(false);
  const [rfmSel, setRfmSel] = useState("champions");
  const [lifeSel, setLifeSel] = useState("active");

  const d = DATA[period];
  const P = PERIODS[period];
  const pd = (base) => { const v = base * P.scale; return Math.round(v * 10) / 10; }; // period-scaled delta
  const topDriver = [...d.composite].sort((a, b) => b.s - a.s)[0];
  const dragDriver = [...d.composite].sort((a, b) => a.s - b.s)[0];
  const rfm = RFM.find((s) => s.id === rfmSel);
  const life = LIFECYCLE.find((s) => s.id === lifeSel);
  const maxLifeShare = Math.max(...LIFECYCLE.map((s) => s.share));

  return (
    <div style={{ background: T.canvas, minHeight: "100%", fontFamily: "'Inter',system-ui,sans-serif", color: T.ink, padding: "22px 24px 34px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        .hx-hover { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .hx-hover:hover { transform: translateY(-2px); }
        .hx-seg { transition: all .15s ease; }
        .hx-fade { animation: hxUp .5s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes hxUp { from {opacity:0; transform:translateY(8px);} to {opacity:1; transform:none;} }
        @keyframes hxPulse { 0%,100%{opacity:.55;} 50%{opacity:1;} }
        .hx-spark-dot { animation: hxPulse 2.4s ease-in-out infinite; }
        .hx-scroll::-webkit-scrollbar{width:7px;} .hx-scroll::-webkit-scrollbar-thumb{background:${T.line};border-radius:8px;}
        @media (prefers-reduced-motion: reduce){ .hx-fade,.hx-spark-dot,.hx-hover{animation:none;transition:none;} }
      `}</style>

      <div style={{ maxWidth: 1220, margin: "0 auto" }}>

        {/* ---------- header ---------- */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: T.brandInk, background: T.brandSoft, padding: "4px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, letterSpacing: ".02em", marginBottom: 9 }}>
              <Sparkles size={13} className="hx-spark-dot" /> CX INTELLIGENCE · VOICE OF CUSTOMER
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em" }}>Are our customers happy?</h1>
            <div style={{ marginTop: 5, fontSize: 13, color: T.muted }}>Live read across <b style={{ color: T.ink2 }}>{d.interactions}</b> interactions · Marketplace · <b style={{ color: T.ink2 }}>Head of CX</b></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: 4 }}>
            {Object.values(PERIODS).map((p) => {
              const on = period === p.key;
              return <button key={p.key} onClick={() => setPeriod(p.key)} className="hx-seg" style={{ border: "none", cursor: "pointer", padding: "7px 13px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: on ? T.ink : "transparent", color: on ? "#fff" : T.muted, fontFamily: "inherit" }}>{p.key}</button>;
            })}
          </div>
        </div>

        {/* ---------- AI exec-summary band ---------- */}
        <div className="hx-fade" style={{ background: `linear-gradient(90deg, ${T.brandSoft}, #F6F5FE 60%, ${T.surface})`, border: "1px solid #E3E0FA", borderRadius: 14, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 132 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: T.brand, display: "grid", placeItems: "center", flexShrink: 0 }}><Sparkles size={16} color="#fff" /></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.brandInk, lineHeight: 1.15 }}>AI reads<br />the last {P.short}</span>
          </div>
          {[["What's shifting", d.exec.shifting], ["How much", d.exec.magnitude], ["Who's affected", d.exec.affected]].map(([k, v]) => (
            <div key={k} style={{ flex: "1 1 150px", minWidth: 140, borderLeft: "1px solid #E3E0FA", paddingLeft: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", color: T.faint, textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.35, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
          <div style={{ flex: "1 1 180px", minWidth: 170, background: T.surface, border: "1px solid #E3E0FA", borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", color: T.brandInk, textTransform: "uppercase", marginBottom: 3 }}>What we're doing</div>
            <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.35, fontWeight: 600 }}>{d.exec.doing}</div>
          </div>
        </div>

        {/* ================= 01 · Happiness read ================= */}
        <SectionHeader num="01" title="Are our customers happy?" sub="composite happiness, by cohort, in their own words" />
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr 1fr", gap: 14 }}>

          {/* headline gauge */}
          <Card primary className="hx-fade hx-hover" onMouseLeave={() => setHoverComposite(false)}>
            <CardQ hint="Weighted average of delivery, returns, support, product & sentiment.">How happy are they right now?</CardQ>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 6, alignItems: "center" }}>
              <div style={{ position: "relative" }} onMouseEnter={() => setHoverComposite(true)}>
                <HappinessGauge value={d.headline.score} />
                <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: band(d.headline.score) }}>Happiness Index</span><Delta value={d.headline.delta} />
                </div>
                {hoverComposite && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 12px", boxShadow: "0 12px 30px -8px rgba(18,21,28,.22)", zIndex: 5 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 7 }}>How the {d.headline.score} is built</div>
                    {d.composite.map((c) => (
                      <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: T.ink2, width: 118, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.k}</span>
                        <div style={{ flex: 1, height: 6, background: T.lineSoft, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${c.s}%`, height: "100%", background: band(c.s), borderRadius: 4 }} /></div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: band(c.s), width: 20, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{c.s}</span>
                        <span style={{ fontSize: 9.5, color: T.faint, width: 28, textAlign: "right" }}>{c.w}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {[["NPS", d.headline.nps, d.headline.npsD, ""], ["CSAT", d.headline.csat, d.headline.csatD, "%"], ["Ease of resolution", d.headline.ease, d.headline.easeD, "/5"]].map(([k, v, dd, sfx]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
                    <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{k}</span>
                    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 7 }}>
                      <b style={{ fontSize: 17, fontFamily: "'Space Grotesk',sans-serif", fontVariantNumeric: "tabular-nums" }}>{v}{sfx}</b><Delta value={dd} />
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>8-{P.short} trend</span><Sparkline points={d.spark} color={band(d.headline.score)} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1, background: T.goodSoft, borderRadius: 9, padding: "7px 10px" }}>
                <div style={{ fontSize: 10, color: T.good, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>Lifting</div>
                <div style={{ fontSize: 12, color: T.ink, fontWeight: 600, marginTop: 1 }}>{topDriver.k} · {topDriver.s}</div>
              </div>
              <div style={{ flex: 1, background: T.badSoft, borderRadius: 9, padding: "7px 10px" }}>
                <div style={{ fontSize: 10, color: T.bad, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>Dragging</div>
                <div style={{ fontSize: 12, color: T.ink, fontWeight: 600, marginTop: 1 }}>{dragDriver.k} · {dragDriver.s}</div>
              </div>
            </div>
          </Card>

          {/* cohorts */}
          <Card className="hx-fade hx-hover">
            <CardQ hint="Same Happiness Index computed per cohort; share-weighted average reconciles to the headline.">Who's happy — who's slipping?</CardQ>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 2 }}>
              {d.cohorts.map((c) => {
                const on = cohort === c.id;
                return (
                  <button key={c.id} onClick={() => setCohort(on ? "all" : c.id)} className="hx-seg" style={{ textAlign: "left", cursor: "pointer", border: `1.5px solid ${on ? COHORT_COLOR[c.id] : "transparent"}`, background: on ? "#fff" : "transparent", borderRadius: 10, padding: "6px 8px", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 3, background: COHORT_COLOR[c.id] }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</span>
                        <span style={{ fontSize: 10.5, color: T.faint }}>{c.share}%</span>
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                        <b style={{ fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", color: band(c.score), fontVariantNumeric: "tabular-nums" }}>{c.score}</b><Delta value={c.delta} size={11.5} />
                      </span>
                    </div>
                    <div style={{ height: 7, background: T.lineSoft, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${c.score}%`, height: "100%", background: COHORT_COLOR[c.id] }} /></div>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 10, lineHeight: 1.4 }}>Lapsing buyers are the drag — their unhappiness concentrates in returns &amp; refunds.</div>
          </Card>

          {/* VoC sparkle (AI differentiator, kept above the fold) */}
          <Card className="hx-fade hx-hover" style={{ background: `linear-gradient(180deg, ${T.brandSoft}22, ${T.surface} 42%)` }}>
            <CardQ star>What are customers telling us?</CardQ>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.brandSoft, color: T.brandInk, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
              <Sparkles size={12} className="hx-spark-dot" /> AI-surfaced theme
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 650, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{VOC.theme}</div>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 12, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 11, padding: "10px 12px" }}>
              <MessageSquareText size={16} color={T.brand} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.45, fontStyle: "italic" }}>“{VOC.quote}”</div>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em", color: T.faint, textTransform: "uppercase", margin: "14px 0 8px" }}>Sentiment by channel</div>
            {[["App reviews", VOC.sent.app], ["Social", VOC.sent.social], ["Support", VOC.sent.support]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                <span style={{ fontSize: 11.5, color: T.ink2, width: 78, fontWeight: 500 }}>{k}</span>
                <div style={{ flex: 1, height: 7, background: T.lineSoft, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${v}%`, height: "100%", background: band(v), borderRadius: 4 }} /></div>
                <b style={{ fontSize: 11.5, color: band(v), width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{v}%</b>
              </div>
            ))}
          </Card>
        </div>

        {/* ================= 02 · RFM ================= */}
        <SectionHeader num="02" title="How do customers score on RFM?" sub="recency × frequency × monetary — bubble size = share of base" />
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
          <Card className="hx-fade">
            <CardQ hint="Segments plotted by average Recency and Frequency; monetary shown on select.">Where does the base sit on recency &amp; frequency?</CardQ>
            <RFMQuadrant selected={rfmSel} onSelect={setRfmSel} />
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 4 }}>Tap a segment for its R/F/M rule. Remaining ~15% are Lost / long-inactive — see 03.</div>
          </Card>

          <Card className="hx-fade" style={{ borderTop: `3px solid ${rfm.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ width: 11, height: 11, borderRadius: 4, background: rfm.color }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{rfm.name}</h3>
            </div>
            <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.45, marginBottom: 14 }}>{rfm.note}</div>
            {[["Recency", rfm.R], ["Frequency", rfm.F], ["Monetary", rfm.M]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <span style={{ fontSize: 11.5, color: T.muted, width: 68, fontWeight: 500 }}>{k}</span>
                <div style={{ flex: 1, display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => <div key={n} style={{ flex: 1, height: 9, borderRadius: 3, background: n <= v ? rfm.color : T.lineSoft }} />)}
                </div>
                <b style={{ fontSize: 12.5, color: rfm.color, width: 16, textAlign: "right" }}>{v}</b>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {[["% of base", `${rfm.share}%`], ["% of revenue", `${rfm.rev}%`], ["Avg CLV", rfm.clv]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, background: T.surfaceSubtle, border: `1px solid ${T.lineSoft}`, borderRadius: 10, padding: "9px 10px" }}>
                  <div style={{ fontSize: 10, color: T.faint, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em" }}>{k}</div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 12, lineHeight: 1.4 }}>
              Champions + Loyal = {RFM[0].share + RFM[1].share}% of the base but {RFM[0].rev + RFM[1].rev}% of revenue. Can't-Lose + At-Risk together hold {RFM[5].rev + RFM[6].rev}% of revenue and are slipping on recency.
            </div>
          </Card>
        </div>

        {/* ================= 03 · Lifecycle states ================= */}
        <SectionHeader num="03" title="What lifecycle state are they in?" sub="distinct purchase-frequency segments and how they move" />
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
          <Card className="hx-fade">
            <CardQ hint="Share of the base in each state; delta is movement this period.">How is the base distributed across states?{lifeSel !== "active" ? "" : ""}</CardQ>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LIFECYCLE.map((s) => {
                const on = lifeSel === s.id;
                return (
                  <button key={s.id} onClick={() => setLifeSel(s.id)} className="hx-seg" style={{ textAlign: "left", cursor: "pointer", border: `1.5px solid ${on ? s.color : "transparent"}`, background: on ? "#fff" : "transparent", borderRadius: 10, padding: "7px 9px", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s.name}</span>
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
                        <b style={{ fontSize: 13.5, fontFamily: "'Space Grotesk',sans-serif", fontVariantNumeric: "tabular-nums" }}>{s.count}</b>
                        <span style={{ fontSize: 11, color: T.faint, width: 30, textAlign: "right" }}>{s.share}%</span>
                        <Delta value={pd(s.delta)} suffix="%" size={11} invert={s.id === "dormant"} />
                      </span>
                    </div>
                    <div style={{ height: 8, background: T.lineSoft, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(s.share / maxLifeShare) * 100}%`, height: "100%", background: s.color, borderRadius: 4 }} /></div>
                    {on && <div style={{ fontSize: 11, color: T.muted, marginTop: 7 }}>{s.def}</div>}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="hx-fade">
            <CardQ hint="Net customers moving between states this period.">Where are customers moving?</CardQ>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {FLOWS.map((f, i) => {
                const lit = f.states.includes(lifeSel);
                const col = f.good ? T.good : T.bad;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 11px", borderRadius: 11, border: `1px solid ${lit ? col : T.lineSoft}`, background: lit ? (f.good ? T.goodSoft : T.badSoft) : T.surfaceSubtle }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.ink2 }}>{f.from}</span>
                    <ArrowRight size={15} color={col} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.ink2 }}>{f.to}</span>
                    <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13.5, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>
                      {f.good ? <RefreshCw size={13} /> : <ArrowDownRight size={14} />}{f.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, background: T.goodSoft, border: `1px solid ${T.good}22`, borderRadius: 11, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: T.good, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em", marginBottom: 2 }}>Net win-back</div>
              <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.4 }}>Reactivation (+34K) is outrunning fresh dormancy (+28K) — the base is net-retaining, but the active→occasional cool-off (52K) is the watch item.</div>
            </div>
          </Card>
        </div>

        {/* ================= 04 · Value & profitability ================= */}
        <SectionHeader num="04" title="What are these customers actually worth?" sub="gross revenue ≠ customer value — value after returns, service & promotions" />
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 14 }}>
          <Card className="hx-fade">
            <CardQ hint="Where gross revenue erodes into contribution margin.">From gross revenue to contribution margin</CardQ>
            <Waterfall />
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <div style={{ flex: 1, background: T.surfaceSubtle, border: `1px solid ${T.lineSoft}`, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ fontSize: 10, color: T.faint, fontWeight: 600, textTransform: "uppercase" }}>Gross margin</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>38%</div>
              </div>
              <div style={{ flex: 1, background: T.brandSoft, border: `1px solid #E3E0FA`, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ fontSize: 10, color: T.brandInk, fontWeight: 600, textTransform: "uppercase" }}>Contribution margin</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: T.brand }}>10.5%</div>
              </div>
              <div style={{ flex: 1.4, background: T.warnSoft, border: `1px solid ${T.warn}22`, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ fontSize: 10, color: T.warn, fontWeight: 600, textTransform: "uppercase" }}>Biggest leak</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>Returns + promotions erase most of the gross margin.</div>
              </div>
            </div>
          </Card>

          <Card className="hx-fade">
            <CardQ hint="Ranked by contribution margin, not gross spend.">Who actually carries the margin?</CardQ>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {VALUE_TIERS.map((t) => {
                const dilutive = t.flag === "dilutive";
                return (
                  <div key={t.id} style={{ border: `1px solid ${dilutive ? T.bad + "44" : T.lineSoft}`, background: dilutive ? T.badSoft : T.surfaceSubtle, borderRadius: 11, padding: "10px 11px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        {t.id === "vip" ? <Crown size={14} color={t.color} /> : dilutive ? <AlertTriangle size={14} color={T.bad} /> : <Wallet size={14} color={t.color} />}
                        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{t.name}</span>
                        <span style={{ fontSize: 10, color: T.faint, background: T.surface, border: `1px solid ${T.lineSoft}`, borderRadius: 6, padding: "1px 6px" }}>{t.tier}</span>
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: dilutive ? T.bad : T.good }}>{t.contrib > 0 ? "+" : ""}{t.contrib}% contrib</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[["AOV", t.aov], ["Frequency", t.freq], ["CLV", t.clv]].map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: 9.5, color: T.faint, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: dilutive && k === "CLV" ? T.bad : T.ink, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                        </div>
                      ))}
                      <div style={{ marginLeft: "auto", alignSelf: "center", fontSize: 10.5, color: T.faint }}>{t.base}% of base</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: T.ink2, marginTop: 11, lineHeight: 1.45, background: T.brandSoft, borderRadius: 10, padding: "9px 11px" }}>
              <b>The trap:</b> promotion-dependent buyers post the highest AOV (₹2,100) and look like whales — but returns + coupons make them <b style={{ color: T.bad }}>margin-dilutive</b>. High spend ≠ high value.
            </div>
          </Card>
        </div>

        {/* ---------- method footer ---------- */}
        <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 11, color: T.faint }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Gauge size={13} /> <b style={{ color: T.muted, fontWeight: 600 }}>Happiness Index</b> = weighted avg of delivery (28), returns (22), support (20), product (18), sentiment (12).</span>
          <span>RFM segments anchored to R/F/M scores. Value ranked by contribution margin, not gross spend.</span>
          <span>One period selector governs every widget.</span>
        </div>
      </div>
    </div>
  );
}
