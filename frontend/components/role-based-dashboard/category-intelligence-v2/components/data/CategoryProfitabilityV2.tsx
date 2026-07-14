// @ts-nocheck — ported from CategoryProfitability_v2.jsx prototype; typed gradually.
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

/**
 * CATEGORY PROFITABILITY — v2 panels embedded in CategoryProfitabilityScreen.
 * Persona: Category Business Head (marketplace P&L owner).
 */

/* ----------------------------------------------------------------------------------
   DESIGN TOKENS — aligned to category-intelligence / CX V3 (not navy prototype)
---------------------------------------------------------------------------------- */
const C = {
  bg: "#000000",
  panel: "#0A0A0A",
  panel2: "#0A0A0A",
  elev: "#141414",
  line: "#262626",
  line2: "#262626",
  tPri: "#FAFAFA",
  tSec: "#A3A3A3",
  tMut: "#6B6B6B",
  green: "#4ADE80",
  greenD: "#22C55E",
  red: "#FF6B6B",
  redD: "#F0606B",
  amber: "#F6A93B",
  amberD: "#E8A23D",
  violet: "#8B7CF6",
  violetD: "#A78BFA",
  cyan: "#7DD3FC",
  slate: "#5B6478",
};

const F = {
  disp: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const CAT_HUE = {
  mobiles: "#7DD3FC",
  appliances: "#8B7CF6",
  fashion: "#F0606B",
  beauty: "#A78BFA",
  home: "#4ADE80",
  footwear: "#F6A93B",
};

const EASE = "cubic-bezier(.22,1,.36,1)";
const REDUCE =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------------------------------------------------------------
   MODEL — raw drivers per category (ratios are of GMV unless noted)
---------------------------------------------------------------------------------- */
const RAW = [
  { key: "mobiles",   name: "Mobiles & Electronics", gmv: 3850, ret: 0.09, take: 0.065, adRev: 0.018, fwd: 0.022, rev: 0.12, wo: 0.05, pay: 0.019, pkg: 0.005, cac: 42, aov: 13200 },
  { key: "appliances",name: "Large Appliances",      gmv: 1420, ret: 0.07, take: 0.080, adRev: 0.012, fwd: 0.045, rev: 0.22, wo: 0.09, pay: 0.017, pkg: 0.006, cac: 28, aov: 24500 },
  { key: "fashion",   name: "Fashion & Apparel",     gmv: 1680, ret: 0.30, take: 0.200, adRev: 0.026, fwd: 0.055, rev: 0.09, wo: 0.08, pay: 0.025, pkg: 0.011, cac: 74, aov: 1150 },
  { key: "beauty",    name: "Beauty & Personal Care",gmv: 640,  ret: 0.14, take: 0.220, adRev: 0.032, fwd: 0.065, rev: 0.11, wo: 0.15, pay: 0.023, pkg: 0.014, cac: 22, aov: 680 },
  { key: "home",      name: "Home & Kitchen",        gmv: 910,  ret: 0.16, take: 0.150, adRev: 0.020, fwd: 0.050, rev: 0.13, wo: 0.10, pay: 0.022, pkg: 0.010, cac: 31, aov: 1450 },
  { key: "footwear",  name: "Footwear",              gmv: 520,  ret: 0.26, take: 0.190, adRev: 0.022, fwd: 0.060, rev: 0.10, wo: 0.09, pay: 0.024, pkg: 0.010, cac: 27, aov: 1320 },
];

function computeCat(c, retOverride) {
  const ret = retOverride != null ? retOverride : c.ret;
  const returns = c.gmv * ret;
  const nmv = c.gmv - returns;
  const commission = nmv * c.take;
  const adRev = c.gmv * c.adRev;
  const revenue = commission + adRev;
  const fwd = c.gmv * c.fwd;
  const revLog = returns * c.rev;
  const writeoff = returns * c.wo;
  const pay = c.gmv * c.pay;
  const pkg = c.gmv * c.pkg;
  const returnsCost = revLog + writeoff;
  const otherCost = fwd + pay + pkg;
  const cost = fwd + revLog + writeoff + pay + pkg + c.cac;
  const cm = revenue - cost;
  const cmPct = cm / nmv;
  const orders = (c.gmv * 1e7) / c.aov;
  return { ...c, ret, returns, nmv, commission, adRev, revenue, fwd, revLog, writeoff, pay, pkg, returnsCost, otherCost, cost, cm, cmPct, orders };
}

function buildModel(fashionRet) {
  const cats = RAW.map((c) => computeCat(c, c.key === "fashion" ? fashionRet : null));
  const sum = (f) => cats.reduce((a, c) => a + f(c), 0);
  const T = {
    gmv: sum((c) => c.gmv),
    returns: sum((c) => c.returns),
    nmv: sum((c) => c.nmv),
    commission: sum((c) => c.commission),
    adRev: sum((c) => c.adRev),
    revenue: sum((c) => c.revenue),
    fwd: sum((c) => c.fwd),
    revLog: sum((c) => c.revLog),
    writeoff: sum((c) => c.writeoff),
    pay: sum((c) => c.pay),
    pkg: sum((c) => c.pkg),
    cac: sum((c) => c.cac),
    returnsCost: sum((c) => c.returnsCost),
    otherCost: sum((c) => c.otherCost),
    cost: sum((c) => c.cost),
    cm: sum((c) => c.cm),
  };
  T.cmPct = T.cm / T.nmv;
  T.retRate = T.returns / T.gmv;
  T.revPctGmv = T.revenue / T.gmv;
  T.negCount = cats.filter((c) => c.cm < 0).length;
  return { cats, T };
}

/* ----------------------------------------------------------------------------------
   FORMATTERS
---------------------------------------------------------------------------------- */
const MINUS = "\u2212";
const grp = (n, d) => Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
const cr = (v, d = 1) => `${v < 0 ? MINUS : ""}\u20B9${grp(v, d)} Cr`;
const crc = (v, d = 1) => `${v < 0 ? MINUS : ""}${grp(v, d)}`;
const pct = (v, d = 1) => `${v < 0 ? MINUS : ""}${(Math.abs(v) * 100).toFixed(d)}%`;
const clampP = (f) => Math.max(0, Math.min(100, f * 100));

function verdictOf(cmPct) {
  if (cmPct >= 0.03) return { t: "Profitable", c: C.green, bg: "rgba(62,213,152,0.13)" };
  if (cmPct >= 0) return { t: "Thin", c: C.amber, bg: "rgba(245,165,36,0.13)" };
  return { t: "Bleeding", c: C.red, bg: "rgba(251,113,133,0.13)" };
}

/* ----------------------------------------------------------------------------------
   MOTION HOOK — count-up that re-animates when target changes
---------------------------------------------------------------------------------- */
function useCountUp(target, dur = 720) {
  const [val, setVal] = useState(REDUCE ? target : 0);
  const prev = useRef(REDUCE ? target : 0);
  useEffect(() => {
    if (REDUCE) { setVal(target); prev.current = target; return; }
    const from = prev.current, to = target;
    let raf = 0, start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(from + (to - from) * e);
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

/* ----------------------------------------------------------------------------------
   PRIMITIVES
---------------------------------------------------------------------------------- */
function Card({ children, style, pad = 16 }: { children: React.ReactNode; style?: React.CSSProperties; pad?: number }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, color = C.tMut }) {
  return <div style={{ font: `600 11px ${F.mono}`, letterSpacing: "0.14em", textTransform: "uppercase", color }}>{children}</div>;
}

function Pill({ text, color, bg }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `600 11.5px ${F.mono}`, letterSpacing: "0.04em", color, background: bg, border: `1px solid ${color}44`, padding: "3px 9px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color }} />
      {text}
    </span>
  );
}

function Delta({ value, unit = "cr", goodUp = true }) {
  const up = value >= 0;
  const good = up === goodUp;
  const color = good ? C.green : C.red;
  const arrow = up ? "\u25B2" : "\u25BC";
  const txt = unit === "cr" ? `\u20B9${grp(Math.abs(value), 1)} Cr` : unit === "pp" ? `${(Math.abs(value) * 100).toFixed(1)}pp` : `${(Math.abs(value) * 100).toFixed(1)}%`;
  return <span style={{ font: `600 10.5px ${F.mono}`, color }}>{arrow} {txt}</span>;
}

/* Animated horizontal meter (grows on mount, transitions on value change) */
function Meter({ frac, color, ghost = 0, ghostColor = C.amber, h = 9, delay = 0 }) {
  const [w, setW] = useState(REDUCE ? clampP(frac) : 0);
  const [gw, setGw] = useState(REDUCE ? clampP(ghost) : 0);
  useEffect(() => {
    const id = requestAnimationFrame(() => { setW(clampP(frac)); setGw(clampP(ghost)); });
    return () => cancelAnimationFrame(id);
  }, [frac, ghost]);
  return (
    <div style={{ position: "relative", height: h, background: "rgba(148,163,184,0.10)", borderRadius: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: color, borderRadius: h, transition: REDUCE ? "none" : `width 720ms ${EASE} ${delay}ms` }} />
      {ghost > 0 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${w}%`, width: `${gw}%`, background: `repeating-linear-gradient(135deg, ${ghostColor}55 0 5px, ${ghostColor}22 5px 10px)`, transition: REDUCE ? "none" : `left 720ms ${EASE} ${delay}ms, width 720ms ${EASE} ${delay}ms` }} />
      )}
    </div>
  );
}

/* Zero-centred meter for a signed value */
function DivergingMeter({ frac, scale, h = 9 }) {
  const half = Math.max(-1, Math.min(1, frac / scale)) * 50; // -50..50
  const pos = frac >= 0;
  const [w, setW] = useState(REDUCE ? Math.abs(half) : 0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(Math.abs(half)));
    return () => cancelAnimationFrame(id);
  }, [half]);
  const col = pos ? C.green : C.red;
  return (
    <div style={{ position: "relative", height: h, background: "rgba(148,163,184,0.10)", borderRadius: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: -1, bottom: -1, width: 1.5, background: "rgba(148,163,184,0.45)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, [pos ? "left" : "right"]: "50%", width: `${w}%`, background: col, transition: REDUCE ? "none" : `width 720ms ${EASE}` }} />
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   DEPLETION RIBBON — the signature graph: where each ₹ of revenue goes,
   and whether spend crosses the revenue line after returns & CAC.
---------------------------------------------------------------------------------- */
function DepletionRibbon({ T }) {
  const MAXR = 1.16; // full-scale = 116% of revenue, so the 100% line sits inside the track
  const segs = [
    { key: "ret", label: "Returns", v: T.returnsCost / T.revenue, color: C.amber },
    { key: "cac", label: "CAC", v: T.cac / T.revenue, color: C.violet },
    { key: "opex", label: "Other opex", v: T.otherCost / T.revenue, color: C.slate },
  ];
  let cum = 0;
  segs.forEach((s) => { s.start = cum; cum += s.v; });
  const costTotal = cum;
  const cmFrac = 1 - costTotal;           // signed: <0 means spend crosses the line
  const pos = cmFrac >= 0;
  const markL = (1 / MAXR) * 100;         // revenue = 100% marker
  const costEndL = (costTotal / MAXR) * 100;
  const H = 22;

  const tr = REDUCE ? "none" : `left 720ms ${EASE}, width 720ms ${EASE}`;

  return (
    <div>
      {/* legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        {[["Returns", C.amber], ["CAC", C.violet], ["Other opex", C.slate], [pos ? "Contribution kept" : "Over the line", pos ? C.green : C.red]].map(([l, c]) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `500 11px ${F.mono}`, color: C.tSec }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c }} /> {l}
          </span>
        ))}
      </div>

      {/* the bar */}
      <div style={{ position: "relative", height: H, borderRadius: 6, background: "rgba(148,163,184,0.08)", overflow: "visible" }}>
        {/* cost segments */}
        {segs.map((s) => (
          <div key={s.key} title={`${s.label} · ${pct(s.v, 1)} of revenue`}
            style={{ position: "absolute", top: 0, bottom: 0, left: `${(s.start / MAXR) * 100}%`, width: `${(s.v / MAXR) * 100}%`, background: s.color, transition: tr,
                     borderRight: "1px solid rgba(7,11,20,0.55)" }}>
            {s.v / MAXR > 0.11 && (
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", font: `600 10.5px ${F.mono}`, color: s.key === "opex" ? C.tPri : "#0A0F1C", whiteSpace: "nowrap" }}>
                {s.label} {pct(s.v, 0)}
              </span>
            )}
          </div>
        ))}

        {/* deficit (spend beyond revenue) OR kept contribution (gap up to revenue) */}
        {pos ? (
          <div title={`Contribution kept · ${cr(T.cm)}`}
            style={{ position: "absolute", top: 0, bottom: 0, left: `${costEndL}%`, width: `${markL - costEndL}%`,
                     background: `repeating-linear-gradient(135deg, ${C.green}66 0 6px, ${C.green}22 6px 12px)`, transition: tr }} />
        ) : (
          <div title={`Spend over revenue · ${cr(T.cm)}`}
            style={{ position: "absolute", top: -2, bottom: -2, left: `${markL}%`, width: `${costEndL - markL}%`,
                     background: `repeating-linear-gradient(135deg, ${C.red} 0 6px, ${C.redD} 6px 12px)`, borderRadius: "0 4px 4px 0", transition: tr,
                     boxShadow: `0 0 0 1px ${C.red}` }} />
        )}

        {/* revenue = 100% marker */}
        <div style={{ position: "absolute", top: -8, bottom: -8, left: `${markL}%`, width: 0, borderLeft: `1.5px dashed ${C.tSec}` }} />
        <div style={{ position: "absolute", top: -24, left: `${markL}%`, transform: "translateX(-50%)", font: `600 9.5px ${F.mono}`, letterSpacing: "0.08em", color: C.tSec, whiteSpace: "nowrap" }}>
          REVENUE 100%
        </div>
      </div>

      {/* punch-line caption */}
      <div style={{ marginTop: 26, font: `400 12.5px/1.5 ${F.body}`, color: C.tSec }}>
        {pos ? (
          <>Spend held to <b style={{ color: C.tPri }}>{pct(costTotal, 1)}</b> of revenue — it stops short of the line, leaving <b style={{ color: C.green }}>{cr(T.cm)}</b> in contribution.</>
        ) : (
          <>Spend runs to <b style={{ color: C.tPri }}>{pct(costTotal, 1)}</b> of revenue — it <b style={{ color: C.red }}>crosses the revenue line</b>, so contribution lands at <b style={{ color: C.red }}>{cr(T.cm)}</b>. Returns and CAC are {pct((T.returnsCost + T.cac) / T.revenue, 0)} of that spend.</>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   KPI TILE — value counts up, meter grows; both re-animate on scenario toggle
---------------------------------------------------------------------------------- */
function KpiTile({ label, raw, fmt, valueColor = C.tPri, meter, readout, caption, delta, scenario, i }) {
  const v = useCountUp(raw);
  return (
    <div className="kpi" style={{ padding: "16px 18px", borderRight: `1px solid ${C.line2}`, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <Eyebrow>{label}</Eyebrow>
        <span style={{ minHeight: 14 }}>{scenario ? <span style={{ font: `600 10px ${F.mono}`, color: C.violet }}>▲ proj</span> : delta}</span>
      </div>
      <div style={{ font: `600 23px ${F.disp}`, color: valueColor, letterSpacing: "-0.01em", lineHeight: 1 }}>{fmt(v)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ flex: 1 }}>{React.cloneElement(meter, { delay: REDUCE ? 0 : 90 * i })}</div>
        <span style={{ width: 42, textAlign: "right", font: `600 11px ${F.mono}`, color: C.tSec, flex: "none" }}>{readout}</span>
      </div>
      <div style={{ font: `500 10.5px ${F.mono}`, color: C.tMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{caption}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   CM BAND METER — where the portfolio sits on Bleeding / Thin / Profitable
---------------------------------------------------------------------------------- */
function CmBandMeter({ cmPct }) {
  const lo = -0.03, hi = 0.06, span = hi - lo;
  const X = (v) => ((v - lo) / span) * 100;
  const [x, setX] = useState(REDUCE ? X(cmPct) : X(lo));
  useEffect(() => { const id = requestAnimationFrame(() => setX(X(cmPct))); return () => cancelAnimationFrame(id); }, [cmPct]);
  const zones = [
    { from: lo, to: 0, color: C.red, label: "Bleeding" },
    { from: 0, to: 0.03, color: C.amber, label: "Thin" },
    { from: 0.03, to: hi, color: C.green, label: "Profitable" },
  ];
  return (
    <div>
      <div style={{ position: "relative", height: 12, borderRadius: 6, overflow: "hidden", display: "flex" }}>
        {zones.map((z) => (
          <div key={z.label} style={{ width: `${((z.to - z.from) / span) * 100}%`, background: z.color, opacity: 0.28 }} />
        ))}
        {/* zero line */}
        <div style={{ position: "absolute", left: `${X(0)}%`, top: -2, bottom: -2, width: 1, background: "rgba(234,240,251,0.5)" }} />
        {/* marker */}
        <div style={{ position: "absolute", left: `${x}%`, top: -3, bottom: -3, width: 3, background: C.tPri, borderRadius: 2, transform: "translateX(-50%)", transition: REDUCE ? "none" : `left 720ms ${EASE}`, boxShadow: "0 0 0 2px rgba(7,11,20,0.6)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
        {zones.map((z) => (
          <span key={z.label} style={{ font: `600 9.5px ${F.mono}`, letterSpacing: "0.06em", textTransform: "uppercase", color: z.color, opacity: 0.9 }}>{z.label}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ font: `500 9px ${F.mono}`, color: C.tMut }}>{pct(lo, 0)}</span>
        <span style={{ font: `500 9px ${F.mono}`, color: C.tMut }}>0</span>
        <span style={{ font: `500 9px ${F.mono}`, color: C.tMut }}>+{pct(hi, 0)}</span>
      </div>
    </div>
  );
}

/* Compact 6-dot category health strip */
function HealthDots({ cats }) {
  const order = [...cats].sort((a, b) => a.cmPct - b.cmPct);
  const counts = order.reduce((a, c) => { const v = verdictOf(c.cmPct).t; a[v] = (a[v] || 0) + 1; return a; }, {});
  return (
    <div>
      <div style={{ display: "flex", gap: 5 }}>
        {order.map((c) => {
          const v = verdictOf(c.cmPct);
          return <div key={c.key} title={`${c.name} · ${cr(c.cm)} (${pct(c.cmPct)})`} style={{ flex: 1, height: 9, borderRadius: 3, background: v.c, opacity: 0.9 }} />;
        })}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {[["Bleeding", C.red], ["Thin", C.amber], ["Profitable", C.green]].map(([l, col]) => (
          <span key={l} style={{ font: `600 10px ${F.mono}`, color: col }}>{counts[l] || 0} {l}</span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   WATERFALL — Revenue → Contribution Margin (absolute ₹ bridge)
---------------------------------------------------------------------------------- */
function Waterfall({ T }) {
  const W = 980, H = 372, mL = 60, mR = 24, mT = 30, mB = 64;
  const pw = W - mL - mR, ph = H - mT - mB;
  const yMin = -100, yMax = 1160, yr = yMax - yMin;
  const Y = (v) => mT + ((yMax - v) / yr) * ph;

  const steps = [
    { key: "rev", label: "Revenue", kind: "total", v: T.revenue },
    { key: "fwd", label: "Fwd\nlogistics", kind: "cost", v: -T.fwd },
    { key: "rlog", label: "Reverse\nlogistics", kind: "ret", v: -T.revLog },
    { key: "wo", label: "Returns\nwrite-off", kind: "ret", v: -T.writeoff },
    { key: "pay", label: "Payment\n& COD", kind: "cost", v: -T.pay },
    { key: "pkg", label: "Packaging", kind: "cost", v: -T.pkg },
    { key: "cac", label: "CAC", kind: "cac", v: -T.cac },
    { key: "cm", label: "Contribution\nmargin", kind: "total", v: T.cm },
  ];
  let run = 0;
  const bars = steps.map((s) => {
    if (s.kind === "total") { run = s.v; return { ...s, from: 0, to: s.v }; }
    const from = run; const to = run + s.v; run = to; return { ...s, from, to };
  });

  const n = steps.length, slot = pw / n, bw = Math.min(66, slot * 0.56);
  const X = (i) => mL + slot * i + slot / 2;
  const fillOf = (k, v) => k === "total" ? (v >= 0 ? C.green : C.red) : k === "ret" ? C.amber : k === "cac" ? C.violet : C.slate;
  const grid = [0, 250, 500, 750, 1000];
  const bandRet = { x: mL + slot * 2, w: slot * 2 };
  const bandCac = { x: mL + slot * 6, w: slot * 1 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Waterfall from marketplace revenue to contribution margin" style={{ display: "block" }}>
      <rect x={bandRet.x} y={mT} width={bandRet.w} height={ph} fill={C.amber} opacity="0.05" />
      <rect x={bandCac.x} y={mT} width={bandCac.w} height={ph} fill={C.violet} opacity="0.06" />
      <text x={bandRet.x + bandRet.w / 2} y={mT + 12} textAnchor="middle" style={{ font: `600 9.5px ${F.mono}`, letterSpacing: "0.16em", fill: C.amber, opacity: 0.85 }}>RETURNS DRAG</text>
      <text x={bandCac.x + bandCac.w / 2} y={mT + 12} textAnchor="middle" style={{ font: `600 9.5px ${F.mono}`, letterSpacing: "0.16em", fill: C.violet, opacity: 0.9 }}>CAC</text>
      {grid.map((g) => (
        <g key={g}>
          <line x1={mL} x2={W - mR} y1={Y(g)} y2={Y(g)} stroke={g === 0 ? C.line : C.line2} strokeWidth={g === 0 ? 1.4 : 1} />
          <text x={mL - 10} y={Y(g) + 3.5} textAnchor="end" style={{ font: `500 10px ${F.mono}`, fill: C.tMut }}>{grp(g, 0)}</text>
        </g>
      ))}
      <text x={mL - 44} y={mT + ph / 2} transform={`rotate(-90 ${mL - 44} ${mT + ph / 2})`} textAnchor="middle" style={{ font: `600 10px ${F.mono}`, letterSpacing: "0.12em", fill: C.tMut }}>₹ CRORE</text>
      {bars.slice(0, -1).map((b, i) => (
        <line key={"c" + i} x1={X(i) + bw / 2} x2={X(i + 1) - bw / 2} y1={Y(b.to)} y2={Y(b.to)} stroke={C.line} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
      ))}
      {bars.map((b, i) => {
        const isTotal = b.kind === "total";
        const top = isTotal ? Math.max(0, b.to) : Math.max(b.from, b.to);
        const bot = isTotal ? Math.min(0, b.to) : Math.min(b.from, b.to);
        const y = Y(top), h = Math.max(2, Y(bot) - Y(top));
        const fill = fillOf(b.kind, b.to);
        const labelStr = isTotal ? crc(b.to, b.to === T.cm ? 1 : 0) : crc(b.v, b.v > -100 ? 1 : 0);
        const negTotal = isTotal && b.to < 0;
        const labelY = negTotal ? Y(bot) + 15 : y - 8;
        return (
          <g key={b.key}>
            <rect x={X(i) - bw / 2} y={y} width={bw} height={h} rx={3.5} fill={fill} opacity={isTotal ? 0.95 : 0.9} />
            {isTotal && <rect x={X(i) - bw / 2} y={y} width={bw} height={h} rx={3.5} fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />}
            <text x={X(i)} y={labelY} textAnchor="middle" style={{ font: `600 11px ${F.mono}`, fill: isTotal ? fill : C.tPri }}>{labelStr}</text>
            {b.label.split("\n").map((ln, k) => (
              <text key={k} x={X(i)} y={H - mB + 18 + k * 12} textAnchor="middle" style={{ font: `${isTotal ? 600 : 500} 10.5px ${F.body}`, fill: isTotal ? C.tPri : C.tSec }}>{ln}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------------------------------------------------------------
   QUADRANT — Return rate (x) vs Contribution margin % (y), bubble = GMV
---------------------------------------------------------------------------------- */
function Quadrant({ cats }) {
  const W = 560, H = 400, mL = 54, mR = 26, mT = 26, mB = 54;
  const pw = W - mL - mR, ph = H - mT - mB;
  const xMax = 0.34, yLo = -0.06, yHi = 0.07;
  const X = (v) => mL + (v / xMax) * pw;
  const Y = (v) => mT + ((yHi - v) / (yHi - yLo)) * ph;
  const maxG = Math.max(...cats.map((c) => c.gmv));
  const R = (g) => 9 + (Math.sqrt(g) / Math.sqrt(maxG)) * 24;
  const xTicks = [0, 0.1, 0.2, 0.3];
  const yTicks = [-0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Return rate versus contribution margin percent by category" style={{ display: "block" }}>
      <rect x={mL} y={mT} width={pw} height={Y(0) - mT} fill={C.green} opacity="0.04" />
      <rect x={mL} y={Y(0)} width={pw} height={mT + ph - Y(0)} fill={C.red} opacity="0.05" />
      <text x={mL + 8} y={mT + 15} style={{ font: `600 9.5px ${F.mono}`, letterSpacing: "0.12em", fill: C.green, opacity: 0.8 }}>PROFITABLE</text>
      <text x={mL + 8} y={mT + ph - 8} style={{ font: `600 9.5px ${F.mono}`, letterSpacing: "0.12em", fill: C.red, opacity: 0.8 }}>BLEEDING</text>
      {yTicks.map((t) => (
        <g key={"y" + t}>
          <line x1={mL} x2={W - mR} y1={Y(t)} y2={Y(t)} stroke={t === 0 ? C.line : C.line2} strokeWidth={t === 0 ? 1.4 : 1} />
          <text x={mL - 8} y={Y(t) + 3} textAnchor="end" style={{ font: `500 9.5px ${F.mono}`, fill: C.tMut }}>{pct(t, 0)}</text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={"x" + t}>
          <line x1={X(t)} x2={X(t)} y1={mT} y2={mT + ph} stroke={C.line2} strokeWidth="1" />
          <text x={X(t)} y={mT + ph + 16} textAnchor="middle" style={{ font: `500 9.5px ${F.mono}`, fill: C.tMut }}>{pct(t, 0)}</text>
        </g>
      ))}
      <text x={mL + pw / 2} y={H - 6} textAnchor="middle" style={{ font: `600 10px ${F.body}`, fill: C.tSec }}>Return rate  →</text>
      <text x={16} y={mT + ph / 2} transform={`rotate(-90 16 ${mT + ph / 2})`} textAnchor="middle" style={{ font: `600 10px ${F.body}`, fill: C.tSec }}>Contribution margin %  ↑</text>
      {cats.map((c) => {
        const cx = X(c.ret), cy = Y(c.cmPct), r = R(c.gmv);
        const good = c.cm >= 0, col = good ? C.green : C.red;
        const rightEdge = c.ret > 0.2;
        const lx = rightEdge ? cx - r - 6 : cx + r + 6;
        const anchor = rightEdge ? "end" : "start";
        return (
          <g key={c.key}>
            <circle cx={cx} cy={cy} r={r} fill={col} opacity="0.16" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="1.6" />
            <circle cx={cx} cy={cy} r={3} fill={col} />
            <text x={lx} y={cy - 1} textAnchor={anchor} style={{ font: `600 11px ${F.body}`, fill: C.tPri }}>{c.name.split(" ")[0]}</text>
            <text x={lx} y={cy + 11} textAnchor={anchor} style={{ font: `500 9.5px ${F.mono}`, fill: C.tSec }}>{pct(c.cmPct)} · {pct(c.ret, 0)} ret</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------------------------------------------------------------
   DRAG BARS — Returns cost vs CAC per category
---------------------------------------------------------------------------------- */
function DragBars({ cats }) {
  const rows = [...cats].sort((a, b) => (b.returnsCost + b.cac) - (a.returnsCost + a.cac));
  const maxV = Math.max(...cats.map((c) => Math.max(c.returnsCost, c.cac)));
  const Bar = ({ v, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 15 }}>
      <div style={{ flex: 1 }}><Meter frac={v / maxV} color={color} h={8} /></div>
      <div style={{ width: 46, textAlign: "right", font: `600 10.5px ${F.mono}`, color: C.tPri }}>{crc(v)}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((c) => (
        <div key={c.key} style={{ display: "grid", gridTemplateColumns: "128px 1fr", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: CAT_HUE[c.key], flex: "none" }} />
            <span style={{ font: `500 12px ${F.body}`, color: C.tSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name.split(" ")[0]}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Bar v={c.returnsCost} color={C.amber} />
            <Bar v={c.cac} color={C.violet} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   CATEGORY TABLE
---------------------------------------------------------------------------------- */
function CategoryTable({ cats }) {
  const [sortKey, setSortKey] = useState("cm");
  const [dir, setDir] = useState("asc");
  const maxAbs = Math.max(...cats.map((c) => Math.abs(c.cm)));

  const sorted = useMemo(() => {
    const arr = [...cats];
    arr.sort((a, b) => {
      const av = sortKey === "name" ? a.name : a[sortKey];
      const bv = sortKey === "name" ? b.name : b[sortKey];
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [cats, sortKey, dir]);

  const onSort = (k) => {
    if (k === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setDir(k === "name" ? "asc" : "desc"); }
  };

  const cols = [
    { k: "name", label: "Category", align: "left" },
    { k: "gmv", label: "GMV", align: "right" },
    { k: "ret", label: "Return %", align: "right" },
    { k: "nmv", label: "NMV", align: "right" },
    { k: "revenue", label: "Revenue", align: "right" },
    { k: "returnsCost", label: "Returns cost", align: "right" },
    { k: "cac", label: "CAC", align: "right" },
    { k: "cm", label: "Contribution", align: "right" },
    { k: "cmPct", label: "CM %", align: "right" },
    { k: "_v", label: "Verdict", align: "left" },
  ];

  const caret = (k) => (k === sortKey ? (dir === "asc" ? " ▲" : " ▼") : "");
  const th = { font: `600 10.5px ${F.mono}`, letterSpacing: "0.06em", textTransform: "uppercase", color: C.tMut, padding: "0 14px 12px", cursor: "pointer", whiteSpace: "nowrap" };
  const td = { font: `500 13px ${F.mono}`, color: C.tPri, padding: "13px 14px", whiteSpace: "nowrap" };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.line}` }}>
            {cols.map((c) => (
              <th key={c.k} className="hdr" onClick={() => c.k !== "_v" && onSort(c.k)} style={{ ...th, textAlign: c.align, cursor: c.k === "_v" ? "default" : "pointer" }}>
                {c.label}{c.k !== "_v" && caret(c.k)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => {
            const v = verdictOf(c.cmPct);
            const pos = c.cm >= 0;
            return (
              <tr key={c.key} className="row" style={{ borderBottom: `1px solid ${C.line2}` }}>
                <td style={{ ...td }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 999, background: CAT_HUE[c.key], flex: "none" }} />
                    <span style={{ font: `600 13px ${F.body}`, color: C.tPri }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ ...td, textAlign: "right" }}>{grp(c.gmv, 0)}</td>
                <td style={{ ...td, textAlign: "right", color: c.ret >= 0.25 ? C.amber : C.tPri }}>{pct(c.ret, 0)}</td>
                <td style={{ ...td, textAlign: "right", color: C.tSec }}>{grp(c.nmv, 0)}</td>
                <td style={{ ...td, textAlign: "right" }}>{grp(c.revenue, 1)}</td>
                <td style={{ ...td, textAlign: "right", color: C.amber }}>{grp(c.returnsCost, 1)}</td>
                <td style={{ ...td, textAlign: "right", color: C.violet }}>{grp(c.cac, 0)}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                    <div style={{ position: "relative", width: 88, height: 8, background: "rgba(148,163,184,0.10)", borderRadius: 4, flex: "none" }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(148,163,184,0.3)" }} />
                      {pos ? (
                        <div style={{ position: "absolute", left: "50%", top: 0, height: 8, width: `${(c.cm / maxAbs) * 50}%`, background: C.green, borderRadius: 4 }} />
                      ) : (
                        <div style={{ position: "absolute", right: "50%", top: 0, height: 8, width: `${(Math.abs(c.cm) / maxAbs) * 50}%`, background: C.red, borderRadius: 4 }} />
                      )}
                    </div>
                    <span style={{ font: `600 13px ${F.mono}`, color: pos ? C.green : C.red, width: 62, textAlign: "right" }}>{cr(c.cm)}</span>
                  </div>
                </td>
                <td style={{ ...td, textAlign: "right", color: pos ? C.green : C.red, fontWeight: 600 }}>{pct(c.cmPct)}</td>
                <td style={{ ...td }}><Pill text={v.t} color={v.c} bg={v.bg} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   LEVER CARD (interactive what-if) — before→after as a mini meter
---------------------------------------------------------------------------------- */
function LeverCard({ base, fixed, scenario, setScenario }) {
  const bF = base.cats.find((c) => c.key === "fashion");
  const fF = fixed.cats.find((c) => c.key === "fashion");
  const swing = fF.cm - bF.cm;

  const Flip = ({ label, from, to }) => {
    const scale = Math.max(Math.abs(from), Math.abs(to)) * 1.15 || 1;
    return (
      <div style={{ minWidth: 190 }}>
        <Eyebrow>{label}</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 8, font: `600 15px ${F.mono}`, margin: "6px 0 8px" }}>
          <span style={{ color: C.tMut }}>{cr(from)}</span>
          <span style={{ color: C.tMut }}>→</span>
          <span style={{ color: to >= 0 ? C.green : C.red }}>{cr(to)}</span>
        </div>
        <DivergingMeter frac={(scenario ? to : from) / scale} scale={1} />
      </div>
    );
  };

  return (
    <Card pad={18} style={{ background: C.elev, borderColor: `${C.violet}55` }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ maxWidth: 520 }}>
          <Eyebrow color={C.violet}>Biggest lever</Eyebrow>
          <div style={{ font: `700 19px ${F.disp}`, color: C.tPri, marginTop: 8, letterSpacing: "-0.02em" }}>
            Cut Fashion returns 30% → 22%
          </div>
          <p style={{ font: `400 13px/1.6 ${F.body}`, color: C.tSec, margin: "8px 0 0" }}>
            Returns outweigh CAC ({cr(base.T.returnsCost, 0)} vs {cr(base.T.cac, 0)}), and each return also strips earned
            commission. An 8-point cut recovers <b style={{ color: C.tPri }}>{cr(swing, 1)}</b> and flips the portfolio to{" "}
            <b style={{ color: C.green }}>{cr(fixed.T.cm, 1)}</b>.
          </p>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
          <Flip label="Fashion CM" from={bF.cm} to={fF.cm} />
          <Flip label="Portfolio CM" from={base.T.cm} to={fixed.T.cm} />
          <button
            onClick={() => setScenario(!scenario)}
            aria-pressed={scenario}
            style={{
              cursor: "pointer",
              border: `1px solid ${scenario ? C.green : C.violet}`,
              borderRadius: 10,
              background: scenario ? "rgba(74,222,128,0.12)" : "rgba(139,124,246,0.14)",
              color: scenario ? C.green : C.violet,
              font: `600 13px ${F.body}`,
              padding: "12px 18px",
              transition: `all 150ms ease`,
              minWidth: 168,
            }}
          >
            {scenario ? "✓ Scenario applied" : "Apply this fix →"}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------------
   ROOT — embeddable panels for CategoryProfitabilityScreen
---------------------------------------------------------------------------------- */
export function CategoryProfitabilityV2Content(): React.ReactElement {
  const [scenario, setScenario] = useState(false);
  const base = useMemo(() => buildModel(null), []);
  const fixed = useMemo(() => buildModel(0.22), []);
  const active = scenario ? fixed : base;
  const { cats, T } = active;

  const profitable = T.cm >= 0;
  const verdictColor = profitable ? C.green : C.red;

  const heroCm = useCountUp(T.cm);
  const heroPct = useCountUp(T.cmPct);

  const styles = `
    .cpv2-root, .cpv2-root * { box-sizing: border-box; }
    .cpv2-root { -webkit-font-smoothing: antialiased; }
    .cpv2-root .row { transition: background 120ms ease; }
    .cpv2-root .row:hover { background: rgba(148,163,184,0.05); }
    .cpv2-root .hdr:hover { color: ${C.tSec}; }
    .cpv2-root .kpi { transition: background 140ms ease; }
    .cpv2-root .kpi:hover { background: rgba(148,163,184,0.035); }
    .cpv2-root button:focus-visible, .cpv2-root .hdr:focus-visible { outline: 2px solid ${C.cyan}; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .cpv2-root * { transition: none !important; } }
    @media (max-width: 900px) {
      .cpv2-root .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .cpv2-root .kpi { border-right: none !important; }
      .cpv2-root .two-col { grid-template-columns: 1fr !important; }
      .cpv2-root .verdict-grid { grid-template-columns: 1fr !important; }
    }
  `;

  const gap = 20;

  return (
    <div className="cpv2-root" style={{ color: C.tPri, fontFamily: F.body }}>
      <style>{styles}</style>

      {scenario ? (
        <div
          style={{
            marginBottom: gap,
            border: `1px solid ${C.violet}55`,
            background: "rgba(139,124,246,0.10)",
            borderRadius: 12,
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            font: `500 12.5px ${F.body}`,
            color: C.tPri,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: C.violet }} />
          Projected economics — Fashion returns set to 22% (from 30%). Numbers below are a forecast, not actuals.
        </div>
      ) : null}

      {/* Verdict */}
      <Card pad={0} style={{ overflow: "hidden", marginBottom: gap }}>
        <div
          style={{
            height: 3,
            background: profitable
              ? `linear-gradient(90deg, ${C.greenD}, ${C.green})`
              : `linear-gradient(90deg, ${C.redD}, ${C.amber})`,
          }}
        />
        <div className="verdict-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 0 }}>
          <div style={{ padding: "24px 26px", borderRight: `1px solid ${C.line2}` }}>
            <Eyebrow color={verdictColor}>Verdict · Profitable after returns &amp; CAC?</Eyebrow>
            <div style={{ font: `700 22px/1.25 ${F.disp}`, color: C.tPri, margin: "11px 0 0", letterSpacing: "-0.02em" }}>
              {profitable ? (
                <>
                  Yes — but razor-thin, at <span style={{ color: C.green }}>{cr(T.cm)}</span>.
                </>
              ) : (
                <>
                  No. The portfolio is <span style={{ color: C.red }}>contribution-negative</span> — {T.negCount} of{" "}
                  {cats.length} categories bleed.
                </>
              )}
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                <Eyebrow>Portfolio position</Eyebrow>
                <span style={{ font: `600 11px ${F.mono}`, color: verdictColor }}>{pct(T.cmPct)} of NMV</span>
              </div>
              <CmBandMeter cmPct={T.cmPct} />
            </div>
          </div>
          <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            <div>
              <Eyebrow>Portfolio contribution margin</Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
                <span style={{ font: `700 36px ${F.disp}`, color: verdictColor, letterSpacing: "-0.03em" }}>{cr(heroCm)}</span>
                <span style={{ font: `600 15px ${F.mono}`, color: verdictColor }}>{pct(heroPct)}</span>
              </div>
              <div style={{ font: `500 11px ${F.mono}`, color: C.tMut, marginTop: 4 }}>of {cr(T.nmv, 0)} net merchandise value</div>
            </div>
            <div>
              <Eyebrow>Category health</Eyebrow>
              <div style={{ marginTop: 9 }}>
                <HealthDots cats={cats} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Waterfall */}
      <Card style={{ marginBottom: gap }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
          <div>
            <Eyebrow>Absolute ₹ bridge</Eyebrow>
            <div style={{ font: `600 17px ${F.disp}`, color: C.tPri, marginTop: 6 }}>Revenue → contribution margin</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {[
              ["Revenue", C.green],
              ["Returns drag", C.amber],
              ["CAC", C.violet],
              ["Other cost", C.slate],
              ["Margin", C.red],
            ].map(([l, c]) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `500 11px ${F.mono}`, color: C.tSec }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c }} /> {l}
              </span>
            ))}
          </div>
        </div>
        <Waterfall T={T} />
      </Card>

      {/* Quadrant + drag bars */}
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap, marginBottom: gap }}>
        <Card>
          <Eyebrow>The relationship</Eyebrow>
          <div style={{ font: `600 17px ${F.disp}`, color: C.tPri, margin: "6px 0 4px" }}>Returns rate vs contribution margin</div>
          <p style={{ font: `400 12.5px/1.55 ${F.body}`, color: C.tSec, margin: "0 0 8px" }}>
            High returns cluster in the bleeding zone. Appliances is the exception — low returns, still negative: a{" "}
            <b style={{ color: C.tPri }}>logistics</b> problem, not a returns one. Bubble = GMV.
          </p>
          <Quadrant cats={cats} />
        </Card>
        <Card>
          <Eyebrow>The two forces</Eyebrow>
          <div style={{ font: `600 17px ${F.disp}`, color: C.tPri, margin: "6px 0 4px" }}>Returns cost vs CAC, per category</div>
          <p style={{ font: `400 12.5px/1.55 ${F.body}`, color: C.tSec, margin: "0 0 16px" }}>
            Returns cost beats CAC in every category. Fix returns before CAC.
          </p>
          <div style={{ display: "flex", gap: 18, marginBottom: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `600 11px ${F.mono}`, color: C.amber }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: C.amber }} /> Returns cost
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `600 11px ${F.mono}`, color: C.violet }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: C.violet }} /> CAC
            </span>
          </div>
          <DragBars cats={cats} />
        </Card>
      </div>

      {/* Category table */}
      <Card style={{ marginBottom: gap }}>
        <Eyebrow>Category scorecard</Eyebrow>
        <div style={{ font: `600 17px ${F.disp}`, color: C.tPri, margin: "6px 0 14px" }}>Contribution by category</div>
        <CategoryTable cats={cats} />
      </Card>

      {/* Lever */}
      <div style={{ marginBottom: gap }}>
        <LeverCard base={base} fixed={fixed} scenario={scenario} setScenario={setScenario} />
      </div>

      <div style={{ font: `400 11.5px/1.7 ${F.body}`, color: C.tMut, borderTop: `1px solid ${C.line2}`, paddingTop: 16 }}>
        <b style={{ color: C.tSec, fontWeight: 600 }}>Contribution margin:</b> marketplace revenue (commission on NMV +
        advertising) − forward logistics − reverse logistics − returns write-offs − payment/COD − packaging − allocated
        CAC. Fixed platform, tech and people costs excluded — a contribution view for category decisions, not a
        fully-loaded P&amp;L. Figures are illustrative MTD (Jun 2026), ₹ Crore.
      </div>
    </div>
  );
}
