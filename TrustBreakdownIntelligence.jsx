import React, { useState, useMemo, useRef } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer, Cell,
} from "recharts";
import {
  Shield, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown, Database,
  Sparkles, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight, Users,
  MessageSquare, Phone, Mail, AtSign, ChevronDown, Info, Activity, MapPin,
  Truck, Tag, Target, Layers, BadgeCheck, Flame, Zap, RefreshCw,
} from "lucide-react";

/* ============================================================================
   Trust Breakdown Intelligence  ·  Head of CX console (retail / Flipkart demo)
   Signature system: KNOWLEDGE vs INFERENCE is a first-class visual language.
     - Measured (direct data)  -> neutral, solid, database mark
     - Inferred (AI synthesis) -> violet identity + explicit confidence %
   Risk severity is a *separate* dimension: RAG + icon + label (never blended
   with the confidence language). Every panel resolves to an action.
   ========================================================================== */

const t = {
  ink: "#0F1729", ink2: "#1E293B", body: "#334155", muted: "#64748B", faint: "#94A3B8",
  canvas: "#EDF0F6", panel: "#FFFFFF", panel2: "#F8FAFC",
  border: "#E3E8F0", borderStrong: "#CBD5E1",
  brand: "#2A2F8F", brandSoft: "#EDEFFA",
  infer: "#6D3BF5", inferSoft: "#F2ECFE", inferBorder: "#DDD0FB",
  good: "#0F8A6B", goodSoft: "#E4F5F0",
  watch: "#B7791F", watchSoft: "#FBF3E1",
  high: "#C2410C", highSoft: "#FBEDE4",
  crit: "#B42318", critSoft: "#FBEAE8",
};

const RAG = {
  good: { c: t.good, s: t.goodSoft, label: "Healthy" },
  watch: { c: t.watch, s: t.watchSoft, label: "Watch" },
  high: { c: t.high, s: t.highSoft, label: "Elevated" },
  crit: { c: t.crit, s: t.critSoft, label: "Critical" },
};

const FONTS =
  "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const BODYF = "'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const MONO =
  "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

const nf = new Intl.NumberFormat("en-IN");
const fmt = (n) => nf.format(Math.round(n));

/* ---------------------------------------------------------------- data ----- */

const DRIVERS = [
  { id: "damaged", label: "Damaged Product", icon: AlertTriangle,
    complaints: 12840, wow: 18, sentNeg: 71, conf: 92, repeat: 2.4, type: "slope",
    incident: 3.1, blast: 55,
    meaning: "Customers doubt product quality and fulfilment reliability.",
    next: "Drill damage by category & pincode, then route the top-5 pincodes to Supply Chain." },
  { id: "refund", label: "Refund Not Credited", icon: RefreshCw,
    complaints: 6540, wow: 22, sentNeg: 78, conf: 90, repeat: 2.1, type: "slope",
    incident: 1.6, blast: 78,
    meaning: "Customers feel their money is unsafe — the fastest trust eroder.",
    next: "Validate refund-status mismatch between comms and the payment ledger → Payments." },
  { id: "wrong", label: "Wrong Item Received", icon: Layers,
    complaints: 8120, wow: 11, sentNeg: 64, conf: 89, repeat: 1.9, type: "slope",
    incident: 2.0, blast: 42,
    meaning: "Fulfilment feels unreliable; erodes confidence at scale.",
    next: "Re-check seller-to-catalog SKU mapping for flagged sellers → Marketplace." },
  { id: "hidden", label: "Hidden Platform Fee", icon: Tag,
    complaints: 4210, wow: 31, sentNeg: 68, conf: 85, repeat: 1.4, type: "slope",
    incident: 1.1, blast: 48,
    meaning: "Customers feel misled when fees surface late in checkout.",
    next: "Review fee-communication clarity at the checkout step → Product / Pricing." },
  { id: "never", label: "Never Delivered", icon: Truck,
    complaints: 3180, wow: 14, sentNeg: 82, conf: 91, repeat: 2.6, type: "slope",
    incident: 0.9, blast: 70,
    meaning: "Severe fulfilment failure; high anxiety before contact even lands.",
    next: "Trace the non-delivery cohort and fire proactive re-promise notifications." },
  { id: "counterfeit", label: "Counterfeit Concern", icon: ShieldAlert,
    complaints: 640, wow: 9, sentNeg: 88, conf: 94, repeat: 1.2, type: "cliff",
    incident: 0.18, blast: 92,
    meaning: "Authenticity doubt with regulatory exposure in consumables.",
    next: "Trigger a seller compliance review for baby-food & consumable SKUs → Trust & Safety." },
  { id: "ato", label: "Account Takeover", icon: Shield,
    complaints: 210, wow: 6, sentNeg: 95, conf: 96, repeat: 1.1, type: "cliff",
    incident: 0.06, blast: 96,
    meaning: "Immediate financial-trust collapse — a true cliff event.",
    next: "Escalate flagged accounts and wallet activity → Fraud / Security." },
  { id: "missing", label: "Item Missing in Order", icon: Target,
    complaints: 1120, wow: 8, sentNeg: 85, conf: 93, repeat: 1.5, type: "cliff",
    incident: 0.3, blast: 84,
    meaning: "Customer feels cheated when a paid item is absent from the box.",
    next: "Reconcile shipment manifests for affected SKUs → Ops." },
];

const CUTS = {
  damaged: {
    verdict:
      "Damage is concentrated in Mobiles & Appliances, driven by marketplace sellers on the Ekart-North route into Tier-2 pincodes. Route a packaging + handling audit to Supply Chain for the top 5 pincodes.",
    conf: 92,
    category: [["Mobiles", 34], ["Appliances", 28], ["Furniture", 18], ["Fashion", 12], ["Others", 8]],
    seller: [["Marketplace seller", 68], ["Flipkart-fulfilled", 32]],
    region: [["Jaipur · 302012", 14], ["Lucknow · 226010", 12], ["Patna · 800001", 11], ["Kanpur · 208001", 9], ["Nagpur · 440002", 8]],
    path: [["Ekart · North", 45], ["Partner-A", 31], ["Partner-B", 24]],
    segment: [["High-frequency", 31], ["New users", 28], ["High-value", 22], ["Occasional", 19]],
    channel: [["Chat", 40], ["Voice", 28], ["Email", 18], ["Social", 14]],
  },
  refund: {
    verdict:
      "Refund failures cluster on prepaid orders where the ledger shows 'processed' but the customer sees no credit. Validate the status mismatch and expose a proactive refund ETA before customers escalate.",
    conf: 90,
    category: [["Fashion", 30], ["Mobiles", 26], ["Grocery", 20], ["Appliances", 14], ["Others", 10]],
    seller: [["Marketplace seller", 61], ["Flipkart-fulfilled", 39]],
    region: [["Delhi · 110001", 15], ["Mumbai · 400001", 13], ["Bengaluru · 560001", 12], ["Hyderabad · 500001", 9], ["Pune · 411001", 7]],
    path: [["UPI / prepaid", 58], ["Card", 27], ["Wallet", 15]],
    segment: [["High-value", 34], ["High-frequency", 27], ["New users", 22], ["Occasional", 17]],
    channel: [["Email", 36], ["Chat", 33], ["Voice", 21], ["Social", 10]],
  },
  wrong: {
    verdict:
      "Wrong-item spikes track to catalog/SKU mapping errors from a small set of fashion sellers. Re-verify SKU-to-catalog mapping for flagged sellers before the pattern scales.",
    conf: 89,
    category: [["Fashion", 41], ["Mobiles", 19], ["Home", 16], ["Appliances", 14], ["Others", 10]],
    seller: [["Marketplace seller", 74], ["Flipkart-fulfilled", 26]],
    region: [["Kolkata · 700001", 13], ["Chennai · 600001", 12], ["Ahmedabad · 380001", 11], ["Surat · 395001", 9], ["Indore · 452001", 8]],
    path: [["Ekart · East", 39], ["Partner-A", 34], ["Partner-C", 27]],
    segment: [["New users", 33], ["High-frequency", 26], ["Occasional", 22], ["High-value", 19]],
    channel: [["Chat", 44], ["Voice", 24], ["Email", 20], ["Social", 12]],
  },
  hidden: {
    verdict:
      "Fee complaints rise where platform / handling fees appear only on the final payment screen. Surface fees earlier in the funnel and review checkout copy with Product / Pricing.",
    conf: 85,
    category: [["Grocery", 33], ["Fashion", 24], ["Mobiles", 21], ["Home", 13], ["Others", 9]],
    seller: [["Marketplace seller", 52], ["Flipkart-fulfilled", 48]],
    region: [["Bengaluru · 560001", 14], ["Pune · 411001", 12], ["Delhi · 110001", 11], ["Mumbai · 400001", 10], ["Jaipur · 302012", 7]],
    path: [["Checkout screen", 63], ["Cart page", 24], ["Post-order", 13]],
    segment: [["Occasional", 31], ["New users", 29], ["High-frequency", 23], ["High-value", 17]],
    channel: [["Social", 34], ["Chat", 31], ["Email", 22], ["Voice", 13]],
  },
  never: {
    verdict:
      "Non-delivery concentrates on long-haul lanes with repeated 'out for delivery' loops. Trace the cohort and fire proactive re-promise notifications — this is an anxiety-mitigation win CX owns directly.",
    conf: 91,
    category: [["Appliances", 29], ["Furniture", 24], ["Mobiles", 21], ["Fashion", 16], ["Others", 10]],
    seller: [["Marketplace seller", 57], ["Flipkart-fulfilled", 43]],
    region: [["Patna · 800001", 16], ["Guwahati · 781001", 13], ["Ranchi · 834001", 11], ["Lucknow · 226010", 10], ["Bhopal · 462001", 8]],
    path: [["Long-haul lane", 61], ["Ekart · North", 22], ["Partner-B", 17]],
    segment: [["New users", 35], ["High-value", 26], ["High-frequency", 21], ["Occasional", 18]],
    channel: [["Voice", 38], ["Chat", 30], ["Email", 20], ["Social", 12]],
  },
  counterfeit: {
    verdict:
      "Low volume but high blast radius and regulatory weight, focused on baby-food & consumables from a few sellers. Trigger a compliance-grade seller review immediately — treat as a cliff event.",
    conf: 94,
    category: [["Baby & food", 44], ["Beauty", 22], ["Health", 18], ["Electronics", 10], ["Others", 6]],
    seller: [["Marketplace seller", 91], ["Flipkart-fulfilled", 9]],
    region: [["Delhi · 110006", 17], ["Mumbai · 400002", 14], ["Kolkata · 700007", 12], ["Chennai · 600003", 10], ["Surat · 395003", 8]],
    path: [["3rd-party seller", 86], ["Reseller", 9], ["Import", 5]],
    segment: [["New users", 30], ["High-frequency", 27], ["High-value", 25], ["Occasional", 18]],
    channel: [["Social", 41], ["Email", 27], ["Chat", 21], ["Voice", 11]],
  },
  ato: {
    verdict:
      "Rare but catastrophic to trust: unauthorised logins followed by wallet / gift-card use. Escalate flagged accounts and freeze wallet movement with Fraud / Security — resolution speed is everything.",
    conf: 96,
    category: [["Wallet / GC", 52], ["High-value SKUs", 28], ["Electronics", 12], ["Others", 8]],
    seller: [["Marketplace seller", 34], ["Flipkart-fulfilled", 66]],
    region: [["Bengaluru · 560001", 19], ["Delhi · 110001", 16], ["Mumbai · 400001", 14], ["Hyderabad · 500001", 9], ["Pune · 411001", 7]],
    path: [["Unknown device", 71], ["SIM-swap signal", 18], ["Credential reuse", 11]],
    segment: [["High-value", 44], ["High-frequency", 29], ["Occasional", 15], ["New users", 12]],
    channel: [["Voice", 46], ["Email", 28], ["Chat", 18], ["Social", 8]],
  },
  missing: {
    verdict:
      "Paid items absent from multi-unit orders, concentrated on a specific fulfilment centre. Reconcile shipment manifests for the affected SKUs with Ops before repeat contacts build.",
    conf: 93,
    category: [["Mobiles", 31], ["Beauty", 24], ["Grocery", 19], ["Fashion", 16], ["Others", 10]],
    seller: [["Marketplace seller", 46], ["Flipkart-fulfilled", 54]],
    region: [["Hyderabad · 500001", 15], ["Chennai · 600001", 13], ["Bengaluru · 560001", 12], ["Kochi · 682001", 9], ["Vizag · 530001", 8]],
    path: [["FC-South-2", 58], ["Ekart · South", 26], ["Partner-A", 16]],
    segment: [["High-frequency", 32], ["High-value", 27], ["New users", 24], ["Occasional", 17]],
    channel: [["Chat", 39], ["Voice", 29], ["Email", 21], ["Social", 11]],
  },
};

const SEGMENTS = [
  { label: "High-value customers", affected: 8400, drop: 6, conf: 88,
    note: "Repeat buyers hit by damage / refund issues — the costliest to lose." },
  { label: "High-frequency customers", affected: 14200, drop: 9, conf: 87,
    note: "Volume backbone showing rising negative signals week over week." },
  { label: "New customers (first order)", affected: 11800, drop: 12, conf: 86,
    note: "First-order failures that can prevent a second purchase entirely." },
  { label: "Category-loyal (Mobiles)", affected: 6900, drop: 8, conf: 85,
    note: "Loyal mobile buyers repeatedly facing delivery / quality issues." },
];

const EVIDENCE = [
  { src: "Chat", icon: MessageSquare, quote: "This is the second time I received a damaged product.", tag: "Mobiles · High-frequency" },
  { src: "Voice", icon: Phone, quote: "I don't trust Flipkart delivery anymore.", tag: "Appliances · High-value" },
  { src: "Email", icon: Mail, quote: "Refund is still not credited, this feels like fraud.", tag: "Payments · New user" },
  { src: "Social", icon: AtSign, quote: "Received a broken item again — never buying from Flipkart.", tag: "Reach ≈ 24k impressions" },
];

const ACTIONS = [
  { issue: "Damage rising in Appliances & Mobiles", cause: "68% marketplace, Ekart-North, Tier-2 pincodes",
    team: "Supply Chain / Packaging", action: "Audit packaging & handling for the top 5 pincodes.", kind: "Route" },
  { issue: "Refund-not-credited spike (+22% WoW)", cause: "Status mismatch: comms vs payment ledger",
    team: "Payments / CX", action: "Validate mismatch; expose a proactive refund ETA.", kind: "Route" },
  { issue: "Wrong-item spike in Fashion", cause: "Seller / catalog SKU-mapping errors",
    team: "Marketplace / Catalog", action: "Re-verify SKU-to-catalog mapping for flagged sellers.", kind: "Route" },
  { issue: "Counterfeit concern in Baby & consumables", cause: "High severity + regulatory exposure",
    team: "Trust & Safety / Compliance", action: "Trigger a seller compliance review.", kind: "Escalate" },
  { issue: "Hidden-fee complaints (+31% WoW)", cause: "Fees disclosed late in checkout",
    team: "Product / Pricing", action: "Review fee-communication clarity at checkout.", kind: "Route" },
  { issue: "Never-delivered cohort, high anxiety", cause: "Long-haul lanes; contact not yet raised",
    team: "CX — owned lever", action: "Fire proactive re-promise notifications before contact.", kind: "Act now" },
];

const RANGES = {
  "24H": { f: 0.16, delta: "vs prev day", period: "last 24 hours" },
  "7D": { f: 1, delta: "WoW", period: "this week" },
  "30D": { f: 3.7, delta: "MoM", period: "last 30 days" },
};

/* ------------------------------------------------------------- primitives -- */

function Measured({ small }) {
  return (
    <span className="tbi-chip chip-measured" style={{ fontSize: small ? 10 : 11 }}>
      <Database size={small ? 10 : 11} strokeWidth={2.4} /> Measured
    </span>
  );
}

function Inferred({ conf, small, hl }) {
  return (
    <span
      className={"tbi-chip chip-inferred" + (hl ? " chip-inferred--hl" : "")}
      style={{ fontSize: small ? 10 : 11 }}
      title="Model inference — treat as probabilistic, not fact"
    >
      <Sparkles size={small ? 10 : 11} strokeWidth={2.4} /> Inferred
      <b style={{ fontFamily: MONO, fontWeight: 600, letterSpacing: "-0.02em" }}>{conf}%</b>
    </span>
  );
}

function Delta({ value, good = "down", suffix = "%", label }) {
  const up = value >= 0;
  const isGood = good === "down" ? !up : up;
  const c = isGood ? t.good : t.high;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: c, fontWeight: 700, fontSize: 12.5 }}>
      <Icon size={14} strokeWidth={2.6} />
      <span style={{ fontFamily: MONO }}>{up ? "+" : ""}{value}{suffix}</span>
      {label && <span style={{ color: t.faint, fontWeight: 600, fontSize: 11 }}>{label}</span>}
    </span>
  );
}

function Confidence({ v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: t.inferSoft, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: t.infer, borderRadius: 99 }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: t.infer }}>{v}%</span>
    </div>
  );
}

function Eyebrow({ n, children, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3 }}>
      <span style={{
        fontFamily: MONO, fontSize: 11, fontWeight: 600, color: t.brand,
        background: t.brandSoft, borderRadius: 6, padding: "2px 7px", letterSpacing: "0.02em",
      }}>{n}</span>
      {Icon && <Icon size={14} color={t.muted} strokeWidth={2.2} />}
      <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.muted }}>
        {children}
      </span>
    </div>
  );
}

function SectionHead({ n, icon, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
      <div style={{ minWidth: 260 }}>
        <Eyebrow n={n} icon={icon}>{sub}</Eyebrow>
        <h2 style={{ margin: 0, fontFamily: FONTS, fontSize: 20, fontWeight: 700, color: t.ink, letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

function RankedBars({ rows, accent = t.brand }) {
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div style={{ display: "grid", gap: 9 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, color: t.body, fontWeight: 500 }}>{k}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: t.ink2, fontWeight: 600 }}>{v}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: t.panel2, border: `1px solid ${t.border}`, overflow: "hidden" }}>
              <div style={{ width: `${(v / max) * 100}%`, height: "100%", background: accent, borderRadius: 99 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SplitBar({ rows }) {
  const [a, b] = rows;
  return (
    <div>
      <div style={{ display: "flex", height: 30, borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}` }}>
        <div style={{ width: `${a[1]}%`, background: t.high, display: "flex", alignItems: "center", paddingLeft: 8 }}>
          <span style={{ color: "#fff", fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{a[1]}%</span>
        </div>
        <div style={{ width: `${b[1]}%`, background: t.brand, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
          <span style={{ color: "#fff", fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{b[1]}%</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
        <span style={{ fontSize: 11.5, color: t.body, display: "inline-flex", alignItems: "center", gap: 5 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: t.high }} />{a[0]}
        </span>
        <span style={{ fontSize: 11.5, color: t.body, display: "inline-flex", alignItems: "center", gap: 5 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: t.brand }} />{b[0]}
        </span>
      </div>
    </div>
  );
}

function CutTile({ icon: Icon, title, children }) {
  return (
    <div className="tbi-card" style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon size={14} color={t.muted} strokeWidth={2.2} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: t.ink2 }}>{title}</span>
        </div>
        <Measured small />
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- gauge ------ */

function TrustGauge({ value, rag }) {
  const c = RAG[rag].c;
  return (
    <svg viewBox="0 0 200 116" width="100%" style={{ maxWidth: 220, display: "block" }} role="img"
         aria-label={`Trust Index ${value} out of 100, ${RAG[rag].label} risk`}>
      <path d="M 18 104 A 84 84 0 0 1 182 104" fill="none" stroke={t.border} strokeWidth="14" strokeLinecap="round" pathLength="100" />
      <path d="M 18 104 A 84 84 0 0 1 182 104" fill="none" stroke={c} strokeWidth="14" strokeLinecap="round"
            pathLength="100" strokeDasharray={`${value} 100`} />
      <text x="100" y="86" textAnchor="middle" style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, fill: t.ink }}>{value}</text>
      <text x="100" y="104" textAnchor="middle" style={{ fontFamily: BODYF, fontSize: 11, fontWeight: 600, fill: t.faint }}>/ 100</text>
    </svg>
  );
}

/* ------------------------------------------------------------ scatter ------ */

const IX = 1.2, BY = 65;
function classify(d) {
  if (d.blast >= BY && d.incident < IX) return "cliff";
  if (d.blast >= BY && d.incident >= IX) return "hotspot";
  if (d.blast < BY && d.incident >= IX) return "ops";
  return "monitor";
}
const QUAD = {
  cliff: { c: t.high, s: "#FBEDE466", label: "Cliff risk", note: "Rare · high blast radius" },
  hotspot: { c: t.crit, s: "#FBEAE866", label: "Trust breakdown hotspot", note: "Frequent · high blast radius" },
  ops: { c: t.brand, s: "#EDEFFA66", label: "Operational issue", note: "Frequent · lower blast radius" },
  monitor: { c: t.good, s: "#E4F5F066", label: "Monitor", note: "Rare · lower blast radius" },
};

function ScatterTip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const q = QUAD[classify(d)];
  return (
    <div style={{ background: "#fff", border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 12px", boxShadow: "0 12px 30px rgba(15,23,41,.14)", maxWidth: 220 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, marginBottom: 4 }}>{d.label}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: q.c, marginBottom: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: q.c }} /> {q.label}
      </div>
      <div style={{ display: "grid", gap: 3, fontSize: 11.5, color: t.body }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>Complaints</span><b style={{ fontFamily: MONO }}>{fmt(d.complaints)}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>Incident / 1k</span><b style={{ fontFamily: MONO }}>{d.incident}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>Blast radius</span><b style={{ fontFamily: MONO }}>{d.blast}</b></div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- app -------- */

export default function App() {
  const [range, setRange] = useState("7D");
  const [sel, setSel] = useState("damaged");
  const [hl, setHl] = useState(false);
  const deepRef = useRef(null);

  const R = RANGES[range];
  const scale = (n) => n * R.f;

  const driver = DRIVERS.find((d) => d.id === sel);
  const cut = CUTS[sel];

  const trust = 72;
  const trustRag = "high";
  const topBreaker = [...DRIVERS].sort((a, b) => b.complaints - a.complaints)[0];
  const customersImpacted = 48200;

  const chartData = useMemo(() => DRIVERS.map((d) => ({ ...d, complaints: scale(d.complaints) })), [range]);

  const pick = (id) => {
    setSel(id);
    setTimeout(() => deepRef.current && deepRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const NAV = [
    ["s1", "Trust pulse"], ["s2", "Why trust breaks"], ["s3", "Cliff vs slope"],
    ["s4", "Driver deep-dive"], ["s5", "Segments"], ["s6", "Evidence"], ["s7", "Actions"],
  ];

  return (
    <div className="tbi-root" style={{ background: t.canvas, color: t.body, fontFamily: BODYF, minHeight: "100%" }}>
      <style>{CSS}</style>

      {/* ============ top bar ============ */}
      <header className="tbi-bar">
        <div className="tbi-bar-in">
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: t.brand, display: "grid", placeItems: "center", boxShadow: "0 2px 8px rgba(42,47,143,.35)" }}>
                <ShieldCheck size={17} color="#fff" strokeWidth={2.4} />
              </div>
              <div style={{ lineHeight: 1.1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS, fontSize: 12, fontWeight: 800, color: t.ink, letterSpacing: "-0.01em" }}>clariverse</div>
                <div style={{ fontSize: 10, color: t.faint, fontWeight: 600 }}>Fluid CX</div>
              </div>
            </div>
            <div style={{ width: 1, height: 26, background: t.border }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FONTS, fontSize: 14.5, fontWeight: 700, color: t.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Trust Breakdown Intelligence
              </div>
              <div style={{ fontSize: 11, color: t.muted, fontWeight: 500 }}>
                Head of CX · Flipkart Retail
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="tbi-sync">
              <span className="tbi-dot" /> Synced 12 min ago · 30-min lag
            </div>
            <div className="tbi-seg">
              {Object.keys(RANGES).map((k) => (
                <button key={k} className={"tbi-seg-b" + (range === k ? " on" : "")} onClick={() => setRange(k)}>{k}</button>
              ))}
            </div>
            <button className={"tbi-toggle" + (hl ? " on" : "")} onClick={() => setHl((v) => !v)}
                    title="Emphasise every inferred signal on the page">
              <Sparkles size={13} strokeWidth={2.4} /> Highlight inferred
            </button>
          </div>
        </div>

        <nav className="tbi-nav">
          {NAV.map(([id, label]) => (
            <button key={id} className="tbi-nav-b" onClick={() => goto(id)}>{label}</button>
          ))}
        </nav>
      </header>

      <main className="tbi-main">
        {/* signal legend — teaches the signature system once */}
        <div className="tbi-legend">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, color: t.muted, letterSpacing: "0.04em" }}>
            <Info size={14} strokeWidth={2.2} /> READ EVERY NUMBER AS
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Measured />
              <span style={{ fontSize: 12, color: t.body }}>Straight from interaction data — a fact.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Inferred conf={91} />
              <span style={{ fontSize: 12, color: t.body }}>AI synthesis — probabilistic, shown with confidence.</span>
            </div>
          </div>
        </div>

        {/* ============ S1 · Trust pulse ============ */}
        <section id="s1" className="tbi-sec">
          <SectionHead n="01" icon={Activity} sub={`Executive pulse · ${R.period}`}
            title="Is customer trust weakening — and where?"
            right={<span className="tbi-demo">Illustrative demo data</span>} />

          {/* verdict */}
          <div className="tbi-verdict">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: RAG[trustRag].s, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <ShieldAlert size={18} color={RAG[trustRag].c} strokeWidth={2.3} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: RAG[trustRag].c }}>Verdict</span>
                  <Inferred conf={91} hl={hl} />
                </div>
                <p style={{ margin: 0, fontFamily: FONTS, fontSize: 15.5, lineHeight: 1.5, color: t.ink, fontWeight: 500 }}>
                  Trust is eroding on a <b style={{ color: RAG[trustRag].c }}>steep slope</b>, led by damaged-product and refund
                  complaints. No <b>cliff event</b> is active — but counterfeit signals in consumables warrant a compliance check now.
                </p>
              </div>
            </div>
          </div>

          <div className="grid-kpi">
            {/* Trust index — inferred */}
            <div className="tbi-card tbi-kpi kpi-infer">
              <div className="kpi-top">
                <span className="kpi-label">Trust Index</span>
                <Inferred conf={91} small hl={hl} />
              </div>
              <div style={{ display: "grid", placeItems: "center", padding: "2px 0" }}>
                <TrustGauge value={trust} rag={trustRag} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Delta value={-4} good="up" suffix=" pts" label={R.delta} />
                <span className="kpi-foot">of 20 trust attributes</span>
              </div>
            </div>

            {/* Risk level — RAG */}
            <div className="tbi-card tbi-kpi">
              <div className="kpi-top"><span className="kpi-label">Trust Risk Level</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: RAG[trustRag].s, color: RAG[trustRag].c, alignSelf: "flex-start", padding: "7px 12px", borderRadius: 9, fontWeight: 800, fontSize: 16, fontFamily: FONTS }}>
                  <Flame size={17} strokeWidth={2.4} /> Elevated
                </div>
                <div className="tbi-ragscale">
                  {["good", "watch", "high", "crit"].map((k) => (
                    <div key={k} style={{ flex: 1, height: 6, borderRadius: 99, background: k === trustRag ? RAG[k].c : RAG[k].s }} />
                  ))}
                </div>
                <span className="kpi-foot">Low · Watch · <b style={{ color: RAG[trustRag].c }}>Elevated</b> · Critical</span>
              </div>
            </div>

            {/* Top breaker — knowledge */}
            <div className="tbi-card tbi-kpi">
              <div className="kpi-top"><span className="kpi-label">Top Trust Breaker</span><Measured small /></div>
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: t.highSoft, display: "grid", placeItems: "center" }}>
                    <AlertTriangle size={16} color={t.high} strokeWidth={2.3} />
                  </div>
                  <span style={{ fontFamily: FONTS, fontSize: 16, fontWeight: 700, color: t.ink, letterSpacing: "-0.01em" }}>Damaged Product</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
                  <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: t.ink }}>41%</span>
                  <span className="kpi-foot">of trust complaints</span>
                </div>
                <div style={{ marginTop: 4 }}><Delta value={18} good="down" label={R.delta} /></div>
              </div>
            </div>

            {/* Customers impacted — knowledge */}
            <div className="tbi-card tbi-kpi">
              <div className="kpi-top"><span className="kpi-label">Customers Impacted</span><Measured small /></div>
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: t.brandSoft, display: "grid", placeItems: "center" }}>
                    <Users size={16} color={t.brand} strokeWidth={2.3} />
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: "-0.02em" }}>{fmt(scale(customersImpacted))}</span>
                </div>
                <div style={{ marginTop: 12 }}><Delta value={12} good="down" label={R.delta} /></div>
                <span className="kpi-foot" style={{ display: "block", marginTop: 4 }}>unique customers / orders, {R.period}</span>
              </div>
            </div>

            {/* Model confidence — meta */}
            <div className="tbi-card tbi-kpi kpi-infer">
              <div className="kpi-top"><span className="kpi-label">Model Confidence</span></div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: t.infer, letterSpacing: "-0.02em" }}>91</span>
                  <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: t.infer }}>%</span>
                </div>
                <div style={{ margin: "12px 0 8px" }}><Confidence v={91} /></div>
                <span className="kpi-foot">CSAT & NPS not yet connected — connect to validate.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ S2 · Why trust breaks ============ */}
        <section id="s2" className="tbi-sec">
          <SectionHead n="02" icon={ShieldAlert} sub="The main area · pick a driver to drill"
            title="Why trust is breaking"
            right={<span style={{ fontSize: 12, color: t.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Target size={14} strokeWidth={2.2} /> Selected: <b style={{ color: t.ink }}>{driver.label}</b></span>} />

          <div className="grid-drivers">
            {DRIVERS.map((d) => {
              const q = QUAD[classify(d)];
              const active = d.id === sel;
              const Icon = d.icon;
              return (
                <button key={d.id} onClick={() => pick(d.id)}
                        className={"tbi-card tbi-driver" + (active ? " active" : "")}
                        aria-pressed={active}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: q.s, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon size={17} color={q.c} strokeWidth={2.3} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: FONTS, fontSize: 14.5, fontWeight: 700, color: t.ink, letterSpacing: "-0.01em" }}>{d.label}</div>
                        <span className={"tbi-tag " + (d.type === "cliff" ? "tag-cliff" : "tag-slope")}>
                          {d.type === "cliff" ? <Zap size={10} strokeWidth={2.6} /> : <TrendingDown size={10} strokeWidth={2.6} />}
                          {d.type === "cliff" ? "Cliff event" : "Steep slope"}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="tbi-chev" size={16} color={t.faint} strokeWidth={2.4}
                                 style={{ transform: active ? "rotate(180deg)" : "none" }} />
                  </div>

                  <div className="tbi-driver-stats">
                    <div className="ds">
                      <span className="ds-l">Complaints <Database size={9} strokeWidth={2.6} style={{ opacity: .5 }} /></span>
                      <span className="ds-v">{fmt(scale(d.complaints))}</span>
                    </div>
                    <div className="ds">
                      <span className="ds-l">{R.delta} <Database size={9} strokeWidth={2.6} style={{ opacity: .5 }} /></span>
                      <span className="ds-v"><Delta value={d.wow} good="down" /></span>
                    </div>
                    <div className="ds">
                      <span className="ds-l">Neg. sentiment <Sparkles size={9} strokeWidth={2.6} style={{ color: t.infer }} /></span>
                      <span className="ds-v" style={{ color: t.infer }}>{d.sentNeg}% <span style={{ fontFamily: MONO, fontSize: 10, color: t.faint, fontWeight: 600 }}>·{d.conf}%</span></span>
                    </div>
                    <div className="ds">
                      <span className="ds-l">Repeat contact <Database size={9} strokeWidth={2.6} style={{ opacity: .5 }} /></span>
                      <span className="ds-v">{d.repeat}×</span>
                    </div>
                  </div>

                  <p className="tbi-mean">{d.meaning}</p>
                  <div className="tbi-next">
                    <ArrowRight size={13} color={t.brand} strokeWidth={2.6} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{d.next}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ============ S3 · Cliff vs slope ============ */}
        <section id="s3" className="tbi-sec">
          <SectionHead n="03" icon={Zap} sub="Incident rate × network effect (blast radius)"
            title="Cliff events vs steep-slope erosion" />
          <div className="tbi-card" style={{ padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ height: 340 }} aria-label="Scatter plot classifying trust drivers by incident rate and blast radius">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 14, right: 20, bottom: 34, left: 8 }}>
                    <ReferenceArea x1={0} x2={IX} y1={BY} y2={100} fill={QUAD.cliff.s} fillOpacity={1} />
                    <ReferenceArea x1={IX} x2={3.6} y1={BY} y2={100} fill={QUAD.hotspot.s} fillOpacity={1} />
                    <ReferenceArea x1={IX} x2={3.6} y1={0} y2={BY} fill={QUAD.ops.s} fillOpacity={1} />
                    <ReferenceArea x1={0} x2={IX} y1={0} y2={BY} fill={QUAD.monitor.s} fillOpacity={1} />
                    <CartesianGrid stroke={t.border} strokeDasharray="3 3" />
                    <ReferenceLine x={IX} stroke={t.borderStrong} strokeDasharray="4 4" />
                    <ReferenceLine y={BY} stroke={t.borderStrong} strokeDasharray="4 4" />
                    <XAxis type="number" dataKey="incident" domain={[0, 3.6]} ticks={[0, 1.2, 2.4, 3.6]}
                           tick={{ fontSize: 11, fill: t.muted, fontFamily: MONO }} stroke={t.borderStrong}
                           label={{ value: "Incident rate  (per 1,000 units)  →", position: "bottom", offset: 16, fontSize: 11.5, fill: t.muted, fontWeight: 600 }} />
                    <YAxis type="number" dataKey="blast" domain={[0, 100]} ticks={[0, 25, 50, 65, 75, 100]}
                           tick={{ fontSize: 11, fill: t.muted, fontFamily: MONO }} stroke={t.borderStrong}
                           label={{ value: "Network effect / blast radius  →", angle: -90, position: "insideLeft", offset: 14, fontSize: 11.5, fill: t.muted, fontWeight: 600 }} />
                    <ZAxis type="number" dataKey="complaints" range={[130, 900]} />
                    <Tooltip content={<ScatterTip />} cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={chartData} isAnimationActive={false}>
                      {chartData.map((d) => (
                        <Cell key={d.id} fill={QUAD[classify(d)].c} fillOpacity={d.id === sel ? 0.95 : 0.72}
                              stroke={d.id === sel ? t.ink : "#fff"} strokeWidth={d.id === sel ? 2.4 : 1.4} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="tbi-quadlegend">
                {["hotspot", "cliff", "ops", "monitor"].map((k) => (
                  <div key={k} className="ql">
                    <span style={{ width: 12, height: 12, borderRadius: 4, background: QUAD[k].c, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>{QUAD[k].label}</div>
                      <div style={{ fontSize: 11, color: t.muted }}>{QUAD[k].note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tbi-insight">
              <BadgeCheck size={15} color={t.brand} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><b>Read:</b> your frequent problems (damaged, wrong item) are <b>operational</b>; your dangerous
                ones (counterfeit, account takeover, never-delivered) are <b>low-frequency, high-blast cliff risks</b>.
                Only <b style={{ color: t.crit }}>refund-not-credited</b> sits in both — the true breakdown hotspot to fix first.</span>
            </div>
          </div>
        </section>

        {/* ============ S4 · Deep dive ============ */}
        <section id="s4" className="tbi-sec" ref={deepRef}>
          <SectionHead n="04" icon={Layers} sub="Verdict first, then the business cuts"
            title={<span>Driver deep-dive · <span style={{ color: t.brand }}>{driver.label}</span></span>}
            right={<div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span className="pill"><Database size={11} strokeWidth={2.5} />{fmt(scale(driver.complaints))} complaints</span>
              <span className="pill">{R.delta} <Delta value={driver.wow} good="down" /></span>
              <span className="pill pill-i"><Sparkles size={11} strokeWidth={2.5} />{driver.sentNeg}% neg · {driver.conf}%</span>
            </div>} />

          {/* verdict box */}
          <div className="tbi-verdict tbi-verdict--deep">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: t.brandSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Target size={18} color={t.brand} strokeWidth={2.3} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: t.brand }}>What to do</span>
                  <Inferred conf={cut.conf} hl={hl} />
                </div>
                <p style={{ margin: 0, fontFamily: FONTS, fontSize: 15, lineHeight: 1.55, color: t.ink, fontWeight: 500 }}>{cut.verdict}</p>
              </div>
            </div>
          </div>

          <div className="grid-cuts reveal" key={sel}>
            <CutTile icon={Layers} title="By category"><RankedBars rows={cut.category} /></CutTile>
            <CutTile icon={Tag} title="By seller type"><SplitBar rows={cut.seller} /></CutTile>
            <CutTile icon={MapPin} title="By region · pincode"><RankedBars rows={cut.region} accent={t.high} /></CutTile>
            <CutTile icon={Truck} title="By fulfilment path"><RankedBars rows={cut.path} accent={t.watch} /></CutTile>
            <CutTile icon={Users} title="By customer segment"><RankedBars rows={cut.segment} accent={t.good} /></CutTile>
            <CutTile icon={MessageSquare} title="By channel"><RankedBars rows={cut.channel} accent={t.ink2} /></CutTile>
          </div>
        </section>

        {/* ============ S5 · Segments ============ */}
        <section id="s5" className="tbi-sec">
          <SectionHead n="05" icon={Users} sub="Which customers are losing trust"
            title="Trust impact by customer segment" />
          <div className="grid-seg">
            {SEGMENTS.map((s) => (
              <div key={s.label} className="tbi-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: FONTS, fontSize: 13.5, fontWeight: 700, color: t.ink, letterSpacing: "-0.01em" }}>{s.label}</span>
                  <Measured small />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: "-0.02em" }}>{fmt(scale(s.affected))}</span>
                  <span className="kpi-foot">affected</span>
                </div>
                <div style={{ margin: "12px 0 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11.5, color: t.muted, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Sentiment <Sparkles size={10} color={t.infer} strokeWidth={2.6} />
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Delta value={-s.drop} good="up" suffix=" pts" />
                    <span style={{ fontFamily: MONO, fontSize: 10, color: t.faint, fontWeight: 600 }}>{s.conf}%</span>
                  </span>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.5, color: t.body }}>{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ S6 · Evidence ============ */}
        <section id="s6" className="tbi-sec">
          <SectionHead n="06" icon={Sparkles} sub={'Answering "how are you saying this?"'}
            title="Evidence & explainability" />
          <div className="grid-evi">
            {/* AI summary */}
            <div className="tbi-card kpi-infer" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Sparkles size={16} color={t.infer} strokeWidth={2.4} />
                <span style={{ fontFamily: FONTS, fontSize: 13.5, fontWeight: 700, color: t.ink }}>AI summary</span>
                <Inferred conf={91} small hl={hl} />
              </div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: t.ink2 }}>
                Trust risk is rising mainly from <b>damaged-product</b> complaints in Mobiles &amp; Appliances and
                <b> refund-not-credited</b> cases. Customers repeatedly use phrases like “received a damaged product again”,
                “replacement also defective”, and “refund still not credited — this feels like fraud”.
              </p>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.border}`, display: "grid", gap: 10 }}>
                <div className="basis"><span>Signal type</span><b style={{ color: t.infer }}>Inference</b></div>
                <div className="basis"><span>Confidence</span><div style={{ width: 160 }}><Confidence v={91} /></div></div>
                <div className="basis"><span>Sources used</span><b>Chat · Email · Voice · Tickets · Social</b></div>
                <div className="basis"><span>Missing validation</span><b style={{ color: t.high }}>CSAT &amp; Relational NPS</b></div>
              </div>

              <div className="tbi-suggest">
                <Info size={14} color={t.brand} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Suggested validation: cross-check against <b>CSAT</b>, <b>relational NPS</b>, <b>refund status</b> and
                  <b> order data</b> to move these signals from inference toward measured knowledge.</span>
              </div>
            </div>

            {/* evidence snippets */}
            <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>
                Real interaction evidence
              </span>
              {EVIDENCE.map((e) => {
                const Icon = e.icon;
                return (
                  <div key={e.src} className="tbi-card tbi-evi">
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: t.panel2, border: `1px solid ${t.border}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon size={15} color={t.muted} strokeWidth={2.2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: "0 0 5px", fontSize: 13, lineHeight: 1.45, color: t.ink, fontStyle: "italic" }}>“{e.quote}”</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="src-chip">{e.src}</span>
                        <span style={{ fontSize: 11, color: t.faint }}>{e.tag}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ S7 · Actions ============ */}
        <section id="s7" className="tbi-sec">
          <SectionHead n="07" icon={ArrowRight} sub="Every trust issue → a cross-functional owner"
            title="Recommended actions" />
          <div className="tbi-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tbi-table-head">
              <span>Trust issue</span><span>Root-cause signal</span><span>Owner team</span><span>Suggested action</span><span></span>
            </div>
            {ACTIONS.map((a, i) => (
              <div key={i} className="tbi-row">
                <span data-l="Trust issue" style={{ fontWeight: 600, color: t.ink }}>{a.issue}</span>
                <span data-l="Root-cause signal" style={{ color: t.body }}>{a.cause}</span>
                <span data-l="Owner team"><span className="team">{a.team}</span></span>
                <span data-l="Suggested action" style={{ color: t.body }}>{a.action}</span>
                <span data-l="">
                  <button className={"routebtn " + (a.kind === "Escalate" ? "rb-esc" : a.kind === "Act now" ? "rb-now" : "")}>
                    {a.kind} <ArrowRight size={13} strokeWidth={2.6} />
                  </button>
                </span>
              </div>
            ))}
          </div>
          <div className="tbi-boundary">
            <Info size={14} color={t.muted} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><b>CX action boundary:</b> this desk resolves, contains and mitigates anxiety, and routes ownership to
              the right team. It does not disable categories or sellers directly — those move through the owning teams above.</span>
          </div>
        </section>

        <footer className="tbi-foot">
          <span>clariverse · Fluid CX — Trust Breakdown Intelligence</span>
          <span>Head of CX persona · retail (Flipkart) demo · illustrative data · sensitive fields shown with confidence</span>
        </footer>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- styles --- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

* { box-sizing: border-box; }
.tbi-root { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.tbi-root ::selection { background: ${t.brandSoft}; }

/* top bar */
.tbi-bar { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,.86); backdrop-filter: blur(10px); border-bottom: 1px solid ${t.border}; }
.tbi-bar-in { max-width: 1240px; margin: 0 auto; padding: 11px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.tbi-sync { display: inline-flex; align-items: center; gap: 7px; font-size: 11.5px; color: ${t.muted}; font-weight: 600; white-space: nowrap; }
.tbi-dot { width: 7px; height: 7px; border-radius: 99px; background: ${t.good}; box-shadow: 0 0 0 3px ${t.goodSoft}; animation: tbipulse 2.4s ease-in-out infinite; }
@keyframes tbipulse { 0%,100% { opacity: 1 } 50% { opacity: .45 } }
.tbi-seg { display: inline-flex; background: ${t.panel2}; border: 1px solid ${t.border}; border-radius: 9px; padding: 2px; }
.tbi-seg-b { border: 0; background: transparent; font-family: ${MONO}; font-size: 11.5px; font-weight: 600; color: ${t.muted}; padding: 5px 10px; border-radius: 7px; cursor: pointer; transition: all .15s ease; }
.tbi-seg-b:hover { color: ${t.ink}; }
.tbi-seg-b.on { background: #fff; color: ${t.brand}; box-shadow: 0 1px 3px rgba(15,23,41,.1); }
.tbi-toggle { display: inline-flex; align-items: center; gap: 6px; border: 1px solid ${t.border}; background: #fff; color: ${t.muted}; font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 9px; cursor: pointer; transition: all .15s ease; white-space: nowrap; }
.tbi-toggle:hover { border-color: ${t.inferBorder}; color: ${t.infer}; }
.tbi-toggle.on { background: ${t.inferSoft}; border-color: ${t.inferBorder}; color: ${t.infer}; }
.tbi-nav { max-width: 1240px; margin: 0 auto; padding: 0 14px 8px; display: flex; gap: 2px; overflow-x: auto; }
.tbi-nav::-webkit-scrollbar { height: 0; }
.tbi-nav-b { border: 0; background: transparent; color: ${t.muted}; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 7px; cursor: pointer; white-space: nowrap; transition: all .15s ease; }
.tbi-nav-b:hover { background: ${t.brandSoft}; color: ${t.brand}; }

.tbi-main { max-width: 1240px; margin: 0 auto; padding: 18px 22px 40px; }

/* legend */
.tbi-legend { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; background: #fff; border: 1px solid ${t.border}; border-radius: 12px; padding: 12px 16px; margin-bottom: 22px; box-shadow: 0 1px 2px rgba(15,23,41,.03); }

/* sections */
.tbi-sec { margin-bottom: 34px; scroll-margin-top: 108px; }
.tbi-demo { font-size: 10.5px; font-weight: 700; letter-spacing: .04em; color: ${t.faint}; border: 1px dashed ${t.borderStrong}; border-radius: 6px; padding: 3px 8px; text-transform: uppercase; }

/* cards */
.tbi-card { background: ${t.panel}; border: 1px solid ${t.border}; border-radius: 13px; box-shadow: 0 1px 2px rgba(15,23,41,.04); }
.tbi-card--btn { text-align: left; }

/* chips (the signature system) */
.tbi-chip { display: inline-flex; align-items: center; gap: 4px; font-weight: 700; border-radius: 99px; padding: 3px 8px; line-height: 1; white-space: nowrap; }
.chip-measured { background: ${t.panel2}; color: ${t.muted}; border: 1px solid ${t.border}; }
.chip-inferred { background: ${t.inferSoft}; color: ${t.infer}; border: 1px solid ${t.inferBorder}; }
.chip-inferred--hl { box-shadow: 0 0 0 3px ${t.inferSoft}; border-color: ${t.infer}; }

/* verdict */
.tbi-verdict { background: linear-gradient(180deg,#fff,#fcfdff); border: 1px solid ${t.border}; border-left: 4px solid ${t.high}; border-radius: 13px; padding: 16px 18px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(15,23,41,.05); }
.tbi-verdict--deep { border-left-color: ${t.brand}; }

/* KPI */
.grid-kpi { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.tbi-kpi { padding: 15px; display: flex; flex-direction: column; }
.kpi-infer { background: linear-gradient(180deg,#fff, ${t.inferSoft}22); }
.kpi-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; min-height: 20px; }
.kpi-label { font-size: 11.5px; font-weight: 700; color: ${t.muted}; letter-spacing: .01em; }
.kpi-foot { font-size: 10.5px; color: ${t.faint}; font-weight: 500; }
.tbi-ragscale { display: flex; gap: 4px; }

/* drivers */
.grid-drivers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.tbi-driver { padding: 15px; cursor: pointer; text-align: left; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; }
.tbi-driver:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(15,23,41,.09); border-color: ${t.borderStrong}; }
.tbi-driver.active { border-color: ${t.brand}; box-shadow: 0 0 0 1px ${t.brand}, 0 10px 26px rgba(42,47,143,.14); }
.tbi-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; border-radius: 99px; padding: 2px 7px; margin-top: 4px; }
.tag-cliff { background: ${t.highSoft}; color: ${t.high}; }
.tag-slope { background: ${t.watchSoft}; color: ${t.watch}; }
.tbi-driver-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 14px; margin: 14px 0 12px; padding: 12px 0; border-top: 1px solid ${t.border}; border-bottom: 1px solid ${t.border}; }
.ds { display: flex; flex-direction: column; gap: 3px; }
.ds-l { font-size: 10.5px; color: ${t.faint}; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.ds-v { font-size: 15px; font-weight: 700; color: ${t.ink}; font-family: ${MONO}; letter-spacing: -.01em; }
.tbi-mean { margin: 0 0 12px; font-size: 12.5px; line-height: 1.5; color: ${t.body}; }
.tbi-next { display: flex; gap: 7px; align-items: flex-start; background: ${t.brandSoft}; border-radius: 9px; padding: 9px 11px; font-size: 12px; line-height: 1.45; color: ${t.ink2}; font-weight: 500; }

/* scatter */
.tbi-quadlegend { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding-top: 4px; }
.ql { display: flex; gap: 8px; align-items: flex-start; }
.tbi-insight { margin-top: 14px; padding-top: 14px; border-top: 1px solid ${t.border}; display: flex; gap: 9px; align-items: flex-start; font-size: 12.5px; line-height: 1.55; color: ${t.body}; }
.tbi-insight b { color: ${t.ink}; }

/* pills / deep dive */
.pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; color: ${t.ink2}; background: ${t.panel2}; border: 1px solid ${t.border}; border-radius: 8px; padding: 4px 9px; }
.pill-i { background: ${t.inferSoft}; border-color: ${t.inferBorder}; color: ${t.infer}; }
.grid-cuts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

/* segments */
.grid-seg { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

/* evidence */
.grid-evi { display: grid; grid-template-columns: 1.05fr 1fr; gap: 16px; align-items: start; }
.tbi-evi { display: flex; gap: 11px; padding: 13px 14px; }
.src-chip { font-size: 10.5px; font-weight: 700; color: ${t.brand}; background: ${t.brandSoft}; border-radius: 6px; padding: 2px 7px; }
.basis { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12.5px; color: ${t.muted}; }
.basis b { color: ${t.ink2}; font-weight: 700; }
.tbi-suggest { margin-top: 14px; background: ${t.brandSoft}; border-radius: 10px; padding: 11px 13px; display: flex; gap: 8px; align-items: flex-start; font-size: 12px; line-height: 1.5; color: ${t.ink2}; }
.tbi-suggest b { color: ${t.brand}; }

/* actions table */
.tbi-table-head, .tbi-row { display: grid; grid-template-columns: 1.3fr 1.5fr 1fr 1.7fr auto; gap: 14px; align-items: center; padding: 13px 18px; }
.tbi-table-head { background: ${t.panel2}; border-bottom: 1px solid ${t.border}; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: ${t.faint}; }
.tbi-row { border-bottom: 1px solid ${t.border}; font-size: 12.5px; transition: background .12s ease; }
.tbi-row:last-child { border-bottom: 0; }
.tbi-row:hover { background: ${t.panel2}; }
.team { font-size: 11.5px; font-weight: 700; color: ${t.ink2}; background: ${t.panel2}; border: 1px solid ${t.border}; border-radius: 7px; padding: 4px 9px; display: inline-block; }
.routebtn { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; color: #fff; background: ${t.brand}; border: 0; border-radius: 8px; padding: 7px 12px; cursor: pointer; white-space: nowrap; transition: filter .15s ease, transform .12s ease; }
.routebtn:hover { filter: brightness(1.08); transform: translateY(-1px); }
.rb-esc { background: ${t.crit}; }
.rb-now { background: ${t.good}; }
.tbi-boundary { margin-top: 12px; display: flex; gap: 8px; align-items: flex-start; font-size: 12px; line-height: 1.5; color: ${t.muted}; padding: 0 4px; }
.tbi-boundary b { color: ${t.ink2}; }

/* footer */
.tbi-foot { margin-top: 30px; padding-top: 18px; border-top: 1px solid ${t.border}; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; font-size: 11px; color: ${t.faint}; }

/* focus + reveal */
.tbi-root button:focus-visible { outline: 2.5px solid ${t.brand}; outline-offset: 2px; border-radius: 10px; }
@keyframes tbiUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.reveal { animation: tbiUp .28s ease both; }

/* responsive */
@media (max-width: 1100px) {
  .grid-kpi { grid-template-columns: repeat(3, 1fr); }
  .grid-seg { grid-template-columns: repeat(2, 1fr); }
  .tbi-quadlegend { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .grid-cuts { grid-template-columns: repeat(2, 1fr); }
  .grid-evi { grid-template-columns: 1fr; }
  .tbi-toggle span, .tbi-sync { display: none; }
}
@media (max-width: 720px) {
  .tbi-bar-in { padding: 10px 14px; }
  .tbi-main { padding: 14px 14px 32px; }
  .grid-drivers { grid-template-columns: 1fr; }
  .tbi-table-head { display: none; }
  .tbi-row { grid-template-columns: 1fr; gap: 8px; padding: 14px; }
  .tbi-row span[data-l]::before { content: attr(data-l); display: block; font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: ${t.faint}; margin-bottom: 2px; }
  .tbi-row span[data-l=""]::before { display: none; }
}
@media (max-width: 560px) {
  .grid-kpi, .grid-seg, .grid-cuts, .tbi-quadlegend { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
`;
