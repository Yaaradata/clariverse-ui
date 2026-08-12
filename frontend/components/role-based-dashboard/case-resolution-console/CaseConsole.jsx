"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Search, SlidersHorizontal, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
  Info, RefreshCw, ArrowUpRight, MapPin, Truck, ArrowRight, Copy,
  CircleDot, Circle, User, ShieldCheck, FileText, Tag, Check, X,
  Pencil, Zap, ArrowLeft, Layers, Sparkles, Hash, Tags, ScanLine, ClipboardList, Warehouse,
} from "lucide-react";

/* ------------------------------------------------------------------ tokens */
const C = {
  appBg: "#f4f5fb", panel: "#ffffff", panelAlt: "#fafbff",
  border: "#e7e9f3", borderStrong: "#d6d9ea",
  ink: "#1b1e34", ink2: "#585d7d", ink3: "#6b7191",
  accent: "#4f46e5", accentLine: "#6366f1", accentSoft: "#eef0fe",
};
const DISPO = {
  info_update:   { label: "Information + update",   dot: "#0284c7", soft: "#e7f4fb", ink: "#075985", Icon: Info },
  repromise:     { label: "Re-promise",             dot: "#7c3aed", soft: "#f1eafe", ink: "#5b21b6", Icon: RefreshCw },
  escalate:      { label: "Escalate",               dot: "#db2777", soft: "#fce7f1", ink: "#9d174d", Icon: ArrowUpRight },
  info_followup: { label: "Information + follow-up", dot: "#0d9488", soft: "#e1f5f2", ink: "#115e59", Icon: Clock },
};
const BREACH = {
  breaching: { label: "Breaching",  c: "#dc2626", bg: "#fef2f2", bd: "#fecaca" },
  atrisk:    { label: "At risk",    c: "#d97706", bg: "#fffbeb", bd: "#fde68a" },
  ontrack:   { label: "On track",   c: "#16a34a", bg: "#f0fdf4", bd: "#bbf7d0" },
};
const OVERRIDE_REASONS = [
  "wrong intent",
  "wrong disposition",
  "data stale",
  "SOP doesn't cover this",
  "other",
];
const JOURNEY = ["Order confirmed", "Picked · FC", "In transit · forward leg", "At delivery hub", "Out for delivery", "Delivered"];

/** Fleet metrics from API (not CASES.length). Demo defaults use Indian scale. */
const DEFAULT_METRICS = {
  open: 241860,
  atRisk: 18420,
  breaching: 6124,
  resolvedToday: 842,
  medianTtrMin: 38,
};
const QUEUE_PAGE_SIZE = 50;
const CARD_HEIGHT = 108;

function formatIn(n) {
  return Number(n).toLocaleString("en-IN");
}

/* ------------------------------------------------------------------- data  */
const CASES = [
  {
    id: "CASE-8842-XA", orderId: "OD3428819201", dispo: "escalate",
    intent: "No movement for 48h — customer escalating, wants it resolved today",
    issue: "Delivery delay", sub: "Shipment stuck, no scan", hub: "Bhiwandi hub",
    breach: "breaching", ttb: "−2h 10m", ttbMin: -130,
    promise: "07 Aug", edd: "11 Aug", delta: "+4d",
    status: "Stuck at delivery hub · 48h no scan", node: 3,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Large Appliances", sub2: "Refrigerator", pinCode: "421302",
    notes: "D-1", receivedAt: "09 Aug 2026, 11:18", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8842XA991", cohort: "Plus",
    repeatContact: 3,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "22h ago" }, status: { source: "Multi Track", lag: "40m ago" } },
    sopRule: "SOP · forward-leg breach + no-scan > 36h → escalate to Hub-Ops",
    sopTrigger: "EDD 11 Aug is 4 days past promise (07 Aug); last hub scan 48h ago; breach already crossed",
    action: "Raise Hub-Ops escalation with shipment ref; request manual sort + re-scan; set revised EDD 13 Aug",
  },
  {
    id: "CASE-8817-QP", orderId: "OD3428801144", dispo: "repromise",
    intent: "Order delayed — customer wants a firm new delivery date",
    issue: "Delivery delay", sub: "EDD passed, no update", hub: "Bhiwandi hub",
    breach: "breaching", ttb: "−45m", ttbMin: -45,
    promise: "08 Aug", edd: "12 Aug", delta: "+4d",
    status: "In transit · forward leg · behind plan", node: 2,
    courier: "eKart", ctype: "1P", seller: "Omniverse Retail", cat: "Home & Kitchen", sub2: "Cookware Set", pinCode: "421302",
    notes: "D-1", receivedAt: "10 Aug 2026, 09:42", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8817QP220", cohort: "Standard",
    repeatContact: 2,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "18h ago" }, status: { source: "Multi Track", lag: "1h ago" } },
    sopRule: "SOP · promise-breach on forward leg → re-promise with revised EDD",
    sopTrigger: "EDD 12 Aug is 4 days past promise (08 Aug); shipment moving but behind plan",
    action: "Re-promise with revised EDD 13 Aug; note delay reason (forward-leg backlog) on the case",
  },
  {
    id: "CASE-8790-LM", orderId: "OD3428790550", dispo: "repromise",
    intent: "Delivery attempt failed — customer was available, wants re-attempt",
    issue: "Failed delivery", sub: "Attempt marked, customer disputes", hub: "Andheri hub",
    breach: "atrisk", ttb: "3h 20m", ttbMin: 200,
    promise: "10 Aug", edd: "11 Aug", delta: "+1d",
    status: "Out for delivery · 1 failed attempt", node: 4,
    courier: "Ecom Express", ctype: "3P", seller: "RetailNet", cat: "Electronics", sub2: "Headphones", pinCode: "400053",
    notes: "D-1", receivedAt: "10 Aug 2026, 14:05", conf: "Medium", confBasis: "codes", item: "Single-item · single-unit",
    trackingId: "EE8790LM441", cohort: "Plus",
    repeatContact: 1,
    exceptions: [{ node: 4, type: "failed_attempt", at: "10 Aug 14:22" }],
    provenance: { edd: { source: "FDP", lag: "26h ago" }, status: { source: "Shipping UI / FLO", lag: "6h ago", stale: true } },
    sopRule: "SOP · failed-attempt dispute → re-promise + re-attempt request",
    sopTrigger: "One failed attempt logged; EDD 11 Aug within 1 day of promise; re-attempt window open",
    action: "Re-promise next-day delivery; flag re-attempt to 3P courier; confirm contact number on case",
  },
  {
    id: "CASE-8776-RT", orderId: "OD3428776122", dispo: "info_update",
    intent: "Where is my order — customer just wants a status update",
    issue: "WISMO", sub: "Status enquiry", hub: "Whitefield hub",
    breach: "atrisk", ttb: "5h 05m", ttbMin: 305,
    promise: "11 Aug", edd: "11 Aug", delta: "on plan",
    status: "Out for delivery · on plan", node: 4,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Fashion", sub2: "Footwear", pinCode: "560066",
    notes: "D-1", receivedAt: "11 Aug 2026, 08:21", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8776RT100", cohort: "Standard",
    repeatContact: 0,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "12h ago" }, status: { source: "Multi Track", lag: "25m ago" } },
    sopRule: "SOP · WISMO + on-plan → information + update, no promise change",
    sopTrigger: "EDD 11 Aug matches promise; shipment out for delivery; no exception on the leg",
    action: "Send status update: out for delivery today, EDD 11 Aug unchanged; no re-promise needed",
  },
  {
    id: "CASE-8751-BK", orderId: "OD3428751440", dispo: "escalate",
    intent: "Item appears mis-sorted to wrong hub — customer chasing for 3rd time",
    issue: "Delivery delay", sub: "Wrong-hub / mis-route", hub: "Bhiwandi hub",
    breach: "atrisk", ttb: "7h 40m", ttbMin: 460,
    promise: "10 Aug", edd: "12 Aug", delta: "+2d",
    status: "At delivery hub · route mismatch flagged", node: 3,
    courier: "eKart", ctype: "1P", seller: "Prime Sellers", cat: "Home & Kitchen", sub2: "Mixer Grinder", pinCode: "421302",
    notes: "D-2", receivedAt: "09 Aug 2026, 16:47", conf: "Medium", confBasis: "codes", item: "Single-item · single-unit",
    trackingId: "EK8751BK330", cohort: "Grocery",
    repeatContact: 3,
    exceptions: [{ node: 3, type: "mis_route", at: "10 Aug 09:10" }],
    provenance: { edd: { source: "FDP", lag: "30h ago" }, status: { source: "Multi Track", lag: "55m ago" } },
    sopRule: "SOP · route mismatch + repeat contact → escalate to Hub-Ops",
    sopTrigger: "Destination hub ≠ pincode hub; 3rd customer contact; EDD 2 days past promise",
    action: "Escalate mis-route to Hub-Ops; request re-induct to correct hub; revised EDD 13 Aug once re-routed",
  },
  {
    id: "CASE-8729-WV", orderId: "OD3428729011", dispo: "info_followup",
    intent: "Delivery address needs correction before it goes out",
    issue: "Address issue", sub: "Incomplete address", hub: "Gurgaon hub",
    breach: "atrisk", ttb: "9h 15m", ttbMin: 555,
    promise: "12 Aug", edd: "12 Aug", delta: "on plan",
    status: "At delivery hub · awaiting address confirmation", node: 3,
    courier: "Delhivery", ctype: "3P", seller: "RetailNet", cat: "Electronics", sub2: "Smart Watch", pinCode: "122001",
    notes: "D-1", receivedAt: "11 Aug 2026, 10:03", conf: "Medium", confBasis: "codes", item: "Single-item · single-unit",
    trackingId: "DL8729WV088", cohort: "Standard",
    repeatContact: 1,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "20h ago" }, status: { source: "Shipping UI / FLO", lag: "3h ago" } },
    sopRule: "SOP · address gap → information + follow-up before OFD",
    sopTrigger: "Address flagged incomplete at hub; EDD on plan but OFD blocked until confirmed",
    action: "Follow up with customer to confirm landmark + pincode; hold at hub, release to OFD on confirmation",
  },
  {
    id: "CASE-8703-DZ", orderId: "OD3428703330", dispo: "info_update",
    intent: "Customer checking status a day before EDD, no issue reported",
    issue: "WISMO", sub: "Pre-EDD enquiry", hub: "Whitefield hub",
    breach: "ontrack", ttb: "22h", ttbMin: 1320,
    promise: "12 Aug", edd: "12 Aug", delta: "on plan",
    status: "In transit · forward leg · on plan", node: 2,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Fashion", sub2: "Apparel", pinCode: "560066",
    notes: "D-1", receivedAt: "11 Aug 2026, 07:55", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8703DZ011", cohort: "Plus",
    repeatContact: 0,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "8h ago" }, status: { source: "Multi Track", lag: "55m ago" } },
    sopRule: "SOP · WISMO + on-plan → information + update",
    sopTrigger: "Shipment on plan; EDD matches promise; comfortable buffer to breach window",
    action: "Send reassurance update: on track for 12 Aug; no action required beyond the update",
  },
  {
    id: "CASE-8688-HN", orderId: "OD3428688002", dispo: "info_followup",
    intent: "Marked delivered but customer says not received — wants confirmation",
    issue: "Delivered not received", sub: "POD dispute", hub: "Noida hub",
    breach: "ontrack", ttb: "—", ttbMin: 99999,
    promise: "10 Aug", edd: "10 Aug", delta: "delivered",
    status: "Delivered · POD on file", node: 5,
    courier: "eKart", ctype: "1P", seller: "Omniverse Retail", cat: "Electronics", sub2: "Power Bank", pinCode: "201301",
    notes: "D-1", receivedAt: "10 Aug 2026, 19:12", conf: "Medium", confBasis: "codes", item: "Multi-item · multi-unit",
    trackingId: "EK8688HN771", cohort: "Standard",
    repeatContact: 2,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "delivered" }, status: { source: "Multi Track", lag: "2h ago" } },
    sopRule: "SOP · POD dispute → information + follow-up (no re-promise on delivered)",
    sopTrigger: "Status delivered with POD; customer disputes receipt; not a breach case",
    action: "Follow up: share POD detail + delivery timestamp; open receipt check if customer maintains dispute",
  },
  {
    id: "CASE-8840-XB", orderId: "OD3428840110", dispo: "escalate",
    intent: "Same hub stuck — fridge still no scan after 48h",
    issue: "Delivery delay", sub: "Shipment stuck, no scan", hub: "Bhiwandi hub",
    breach: "breaching", ttb: "−1h 05m", ttbMin: -65,
    promise: "07 Aug", edd: "11 Aug", delta: "+4d",
    status: "Stuck at delivery hub · 48h no scan", node: 3,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Large Appliances", sub2: "Refrigerator", pinCode: "421302",
    notes: "D-1", receivedAt: "09 Aug 2026, 12:30", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8840XB002", cohort: "Plus",
    repeatContact: 2,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "22h ago" }, status: { source: "Multi Track", lag: "35m ago" } },
    sopRule: "SOP · forward-leg breach + no-scan > 36h → escalate to Hub-Ops",
    sopTrigger: "Same Bhiwandi no-scan signature as sibling cases",
    action: "Raise Hub-Ops escalation; batch with sibling stuck-at-hub cases",
  },
  {
    id: "CASE-8838-XC", orderId: "OD3428838220", dispo: "escalate",
    intent: "No scan at Bhiwandi — customer threatening escalation",
    issue: "Delivery delay", sub: "Shipment stuck, no scan", hub: "Bhiwandi hub",
    breach: "breaching", ttb: "−3h 20m", ttbMin: -200,
    promise: "06 Aug", edd: "10 Aug", delta: "+4d",
    status: "Stuck at delivery hub · 48h no scan", node: 3,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Large Appliances", sub2: "Washing Machine", pinCode: "421302",
    notes: "D-1", receivedAt: "08 Aug 2026, 15:08", conf: "High", confBasis: "summary", item: "Single-item · single-unit",
    trackingId: "EK8838XC019", cohort: "Standard",
    repeatContact: 4,
    exceptions: [],
    provenance: { edd: { source: "FDP", lag: "28h ago" }, status: { source: "Multi Track", lag: "42m ago" } },
    sopRule: "SOP · forward-leg breach + no-scan > 36h → escalate to Hub-Ops",
    sopTrigger: "Bhiwandi no-scan cluster; shipment stuck past breach window",
    action: "Escalate hub cluster to Hub-Ops; request manual sort + re-scan",
  },
];

function confReason(c) {
  return c.confBasis === "summary"
    ? "from case summary + issue codes"
    : "issue codes only — notes not yet available";
}

function isPhase1(c) {
  return String(c.item || "").toLowerCase().includes("single-item") && String(c.item || "").toLowerCase().includes("single-unit");
}

function causeKey(c) {
  return `${c.issue}||${c.sub}||${c.hub || c.courier}`;
}

function causeLabel(c) {
  const hubBit = c.hub ? c.hub.replace(/ hub$/i, "") : c.courier;
  return `${c.sub.toLowerCase()} · ${hubBit}`;
}

/** Rank components: lower score = higher priority. */
function rankScore(c) {
  const ttb = Math.min(Math.max(c.ttbMin, -5000), 20000);
  const cohortBoost = c.cohort === "Plus" ? -120 : c.cohort === "Grocery" ? -60 : 0;
  const repeatBoost = -Math.min(c.repeatContact || 0, 5) * 40;
  const score = ttb + cohortBoost + repeatBoost;
  return {
    score,
    parts: [
      { k: "Time-to-breach", v: c.ttb },
      { k: "Cohort", v: `${c.cohort}${cohortBoost ? ` (${cohortBoost})` : ""}` },
      { k: "Repeat contact", v: `${c.repeatContact || 0}${repeatBoost ? ` (${repeatBoost})` : ""}` },
    ],
  };
}

function buildSmartAssistCopy(c) {
  return [
    `Case: ${c.id}`,
    `Order: ${c.orderId}`,
    `Disposition: ${DISPO[c.dispo].label}`,
    `Revised EDD: ${c.edd}${c.delta && c.delta.startsWith("+") ? ` (${c.delta} vs promise ${c.promise})` : ""}`,
    `Reason: ${c.sopTrigger}`,
    `Action: ${c.action}`,
  ].join("\n");
}

/** Server-shaped fetch: filters + sort + cursor. Demo returns top page from module data. */
function useCasesQuery({ filters, sort, cursor, refreshKey, metrics }) {
  const totalOpen = metrics?.open ?? DEFAULT_METRICS.open;
  const [state, setState] = useState({ status: "loading", rows: [], nextCursor: null, totalOpen, error: null });
  const prevRefresh = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const isManualRefresh = refreshKey !== prevRefresh.current;
    prevRefresh.current = refreshKey;
    setState((s) => ({
      ...s,
      status: isManualRefresh || s.rows.length === 0 ? "loading" : s.status,
      error: null,
    }));
    const t = window.setTimeout(() => {
      if (cancelled) return;
      try {
        let rows = CASES
          .filter((c) => filters.dispo === "all" || c.dispo === filters.dispo)
          .filter((c) => filters.breach === "all" || c.breach === filters.breach)
          .filter((c) => !filters.q || (c.id + c.orderId + c.intent + c.seller + c.hub).toLowerCase().includes(filters.q.toLowerCase()))
          .map((c) => ({ ...c, _rank: rankScore(c) }));
        if (sort === "ttb") rows = rows.sort((a, b) => a.ttbMin - b.ttbMin);
        else if (sort === "cohort") rows = rows.sort((a, b) => a.cohort.localeCompare(b.cohort) || a._rank.score - b._rank.score);
        else rows = rows.sort((a, b) => a._rank.score - b._rank.score);
        const start = cursor ? Number(cursor) || 0 : 0;
        const page = rows.slice(start, start + QUEUE_PAGE_SIZE);
        const next = start + QUEUE_PAGE_SIZE < rows.length ? String(start + QUEUE_PAGE_SIZE) : null;
        setState({ status: "ready", rows: page, nextCursor: next, totalOpen, error: null });
      } catch (err) {
        setState({ status: "error", rows: [], nextCursor: null, totalOpen, error: String(err) });
      }
    }, isManualRefresh ? 280 : 0);
    return () => { cancelled = true; window.clearTimeout(t); };
  }, [filters.dispo, filters.breach, filters.q, sort, cursor, refreshKey, totalOpen]);

  return state;
}

/* ---------------------------------------------------------------- helpers  */
const Pill = ({ children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
    padding: "3px 9px", borderRadius: 999, lineHeight: 1.1, ...style }}>{children}</span>
);

function DispoTag({ k, size = "sm" }) {
  const d = DISPO[k]; const I = d.Icon;
  const pad = size === "lg" ? "5px 11px" : "3px 9px";
  const fs = size === "lg" ? 12.5 : 11.5;
  return (
    <Pill style={{ background: d.soft, color: d.ink, padding: pad, fontSize: fs }}>
      <I size={size === "lg" ? 14 : 12} strokeWidth={2.4} style={{ color: d.dot }} />
      {d.label}
    </Pill>
  );
}

function BreachChip({ k, ttb }) {
  const b = BREACH[k];
  return (
    <Pill style={{ background: b.bg, color: b.c, border: `1px solid ${b.bd}` }}>
      {k === "breaching" ? <AlertTriangle size={12} strokeWidth={2.6} />
        : k === "atrisk" ? <Clock size={12} strokeWidth={2.6} />
        : <CheckCircle2 size={12} strokeWidth={2.6} />}
      {b.label}{ttb && ttb !== "—" ? ` · ${ttb}` : ""}
    </Pill>
  );
}

const Field = ({ icon: I, label, value, accent, sub, stamp }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "8px 0" }}>
    <I size={15} strokeWidth={2} style={{ color: C.ink3, marginTop: 1, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13, color: accent || C.ink, fontWeight: accent ? 700 : 500, marginTop: 1 }}>{value}</div>
      {sub ? <div style={{ fontSize: 11.5, color: C.ink2, marginTop: 2 }}>{sub}</div> : null}
      {stamp ? <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 2, fontWeight: 600 }}>{stamp}</div> : null}
    </div>
  </div>
);

function Stage({ n, title, tag, children, accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 3, background: accent || C.accentLine }} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: C.accentSoft, color: C.accent,
            display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{n}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{title}</span>
          {tag && <span style={{ marginLeft: "auto", display: "inline-flex", gap: 6, flexWrap: "wrap" }}>{tag}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

function Journey({ current, exceptions = [] }) {
  const byNode = Object.fromEntries(exceptions.map((e) => [e.node, e]));
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: 4 }}>
      {JOURNEY.map((label, i) => {
        const done = i < current, here = i === current;
        const ex = byNode[i];
        const col = ex ? "#dc2626" : here ? "#d97706" : done ? C.accent : C.ink3;
        return (
          <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center", position: "relative" }} title={ex ? `${ex.type} · ${ex.at}` : undefined}>
            {i < JOURNEY.length - 1 && (
              <div style={{ position: "absolute", top: 7, left: "50%", right: "-50%", height: 2,
                background: done ? C.accent : C.border }} />
            )}
            <div style={{ position: "relative", display: "grid", placeItems: "center", marginBottom: 6 }}>
              {ex ? <AlertTriangle size={16} strokeWidth={2.6} style={{ color: col, background: C.panel }} />
                : here ? <CircleDot size={16} strokeWidth={2.6} style={{ color: col, background: C.panel }} />
                : done ? <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: col, background: C.panel }} />
                : <Circle size={16} strokeWidth={2} style={{ color: col, background: C.panel }} />}
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.25, color: ex ? "#b91c1c" : here ? "#b45309" : done ? C.ink2 : C.ink3,
              fontWeight: here || ex ? 700 : 500, padding: "0 2px" }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function OverrideModal({ title, onClose, onConfirm }) {
  const [reason, setReason] = useState(OVERRIDE_REASONS[0]);
  const [other, setOther] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,30,52,0.45)", zIndex: 50, display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "min(420px, 100%)", background: C.panel, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.ink2, marginBottom: 12 }}>Capture override reason (SME agreement / rule tuning).</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {OVERRIDE_REASONS.map((r) => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.ink, cursor: "pointer" }}>
              <input type="radio" name="override" checked={reason === r} onChange={() => setReason(r)} />
              {r}
            </label>
          ))}
        </div>
        {reason === "other" ? (
          <input value={other} onChange={(e) => setOther(e.target.value)} placeholder="Describe…"
            style={{ width: "100%", boxSizing: "border-box", marginBottom: 12, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
        ) : null}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn subtle onClick={onClose}>Cancel</Btn>
          <Btn primary onClick={() => onConfirm(reason === "other" ? (other || "other") : reason)}>Confirm</Btn>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ main app */
export default function CaseConsole({ onExit, metrics: metricsProp }) {
  const metrics = { ...DEFAULT_METRICS, ...metricsProp };
  const [selId, setSelId] = useState(CASES[0].id);
  const [fDispo, setFDispo] = useState("all");
  const [fBreach, setFBreach] = useState("all");
  const [q, setQ] = useState("");
  const [actioned, setActioned] = useState({});
  const [overrides, setOverrides] = useState({});
  const [queueMode, setQueueMode] = useState("ranked"); // ranked | cause
  const [sortBy, setSortBy] = useState("rank"); // rank | ttb | cohort
  const [expandedCauses, setExpandedCauses] = useState({});
  const [selectedIds, setSelectedIds] = useState({});
  const [modal, setModal] = useState(null); // { type, caseId? }
  const [copied, setCopied] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sourceError, setSourceError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    setLastRefresh(new Date());
  }, []);

  const query = useCasesQuery({
    filters: { dispo: fDispo, breach: fBreach, q },
    sort: sortBy,
    cursor: null,
    refreshKey,
    metrics,
  });
  const ranked = query.rows;
  const loading = query.status === "loading";

  useEffect(() => {
    if (query.status === "error") setSourceError(query.error || "Queue fetch failed");
    else setSourceError(null);
  }, [query.status, query.error]);

  useEffect(() => {
    if (!ranked.some((c) => c.id === selId)) {
      setSelId(ranked[0]?.id || "");
    }
  }, [ranked, selId]);

  const sel = ranked.find((c) => c.id === selId) || null;
  const isDone = sel ? !!actioned[sel.id] : false;
  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  const causeGroups = useMemo(() => {
    const map = new Map();
    ranked.forEach((c) => {
      const key = causeKey(c);
      if (!map.has(key)) map.set(key, { key, label: causeLabel(c), cases: [] });
      map.get(key).cases.push(c);
    });
    return [...map.values()].sort((a, b) => b.cases.length - a.cases.length || a.cases[0]._rank.score - b.cases[0]._rank.score);
  }, [ranked]);

  const rowVirtualizer = useVirtualizer({
    count: queueMode === "ranked" ? ranked.length : 0,
    getScrollElement: () => listRef.current,
    estimateSize: () => 108,
    overscan: 8,
  });

  const refresh = useCallback(() => {
    setSourceError(null);
    setRefreshKey((k) => k + 1);
    setLastRefresh(new Date());
  }, []);

  const fmtTime = (d) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };
  const nextCycle = useMemo(() => {
    if (!lastRefresh) return "—";
    return fmtTime(new Date(lastRefresh.getTime() + 40 * 60 * 1000));
  }, [lastRefresh]);

  const moveSel = useCallback((dir) => {
    if (!ranked.length) return;
    const idx = Math.max(0, ranked.findIndex((c) => c.id === selId));
    const next = ranked[Math.min(ranked.length - 1, Math.max(0, idx + dir))];
    if (next) setSelId(next.id);
  }, [ranked, selId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (modal) return;
      if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
      if (e.key === "k" || e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
      if (e.key === "Enter" && sel && isPhase1(sel) && !actioned[sel.id]) {
        e.preventDefault();
        setActioned((a) => ({ ...a, [sel.id]: true }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveSel, sel, actioned, modal]);

  const toggleSelect = (id) => setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  const clearSelection = () => setSelectedIds({});

  const bulkApplyIds = useCallback((ids, dispo) => {
    if (!ids.length) return;
    setActioned((a) => {
      const next = { ...a };
      ids.forEach((id) => { next[id] = true; });
      return next;
    });
    setOverrides((o) => {
      const next = { ...o };
      ids.forEach((id) => { next[id] = { type: "bulk", dispo }; });
      return next;
    });
    clearSelection();
  }, []);

  const bulkApply = (dispo) => {
    bulkApplyIds(Object.keys(selectedIds).filter((id) => selectedIds[id]), dispo);
  };

  const copyBlock = async () => {
    if (!sel) return;
    try {
      await navigator.clipboard.writeText(buildSmartAssistCopy(sel));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const confirmOverride = (reason) => {
    if (!modal) return;
    const id = modal.caseId || sel?.id;
    if (id) {
      setOverrides((o) => ({ ...o, [id]: { type: modal.type, reason } }));
      if (modal.type === "skip" || modal.type === "escalate" || modal.type === "modify") {
        setActioned((a) => ({ ...a, [id]: true }));
      }
    }
    setModal(null);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: C.appBg,
      color: C.ink, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <header style={{ minHeight: 58, flexShrink: 0, background: C.panel, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 12, padding: "8px 18px", flexWrap: "wrap" }}>
        {onExit ? (
          <button type="button" onClick={onExit} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`,
            background: C.appBg, color: C.ink2, borderRadius: 8, padding: "6px 10px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            <ArrowLeft size={14} strokeWidth={2.4} /> Roles
          </button>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
            display: "grid", placeItems: "center" }}>
            <Zap size={17} color="#fff" strokeWidth={2.6} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.2 }}>LiSN · Case Resolution Console</div>
            <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600, marginTop: -1 }}>Forward-delivery control tower · execution</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginLeft: 4, flexWrap: "wrap" }}>
          <Stat label="Open cases" value={formatIn(metrics.open)} delta="+3" tone="neutral" />
          <Stat label="At risk" value={formatIn(metrics.atRisk)} delta="−2" tone="amber" />
          <Stat label="Breaching" value={formatIn(metrics.breaching)} delta="+1" tone="red" />
          <Stat label="Resolved today" value={formatIn(metrics.resolvedToday)} delta="+18%" tone="neutral" />
          <Stat label="Median TTR" value={`${metrics.medianTtrMin}m`} delta="−4m" tone="neutral" />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={refresh} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`,
            background: C.appBg, borderRadius: 8, padding: "5px 9px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: C.ink2,
          }}>
            <RefreshCw size={12} strokeWidth={2.4} />
            Last refreshed {lastRefresh ? fmtTime(lastRefresh) : "—:—"} · next ~{nextCycle}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <aside style={{ width: 360, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.panel,
          display: "flex", flexDirection: "column", minHeight: 0 }}>

          <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink, letterSpacing: 0.2 }}>WORK QUEUE</span>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 9 }}>
              <FilterChip active={queueMode === "ranked"} onClick={() => setQueueMode("ranked")} color={C.accent}>Flat</FilterChip>
              <FilterChip active={queueMode === "cause"} onClick={() => setQueueMode("cause")} color={C.accent} icon={Layers}>By cause</FilterChip>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                marginLeft: "auto", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                padding: "4px 8px", color: C.ink2, background: C.panel,
              }}>
                <option value="rank">Sort · rank score</option>
                <option value="ttb">Sort · time-to-breach</option>
                <option value="cohort">Sort · cohort</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.appBg, border: `1px solid ${C.border}`,
              borderRadius: 9, padding: "7px 10px", marginBottom: 9 }}>
              <Search size={14} style={{ color: C.ink3 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case, order, intent, seller…"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: C.ink, width: "100%" }} />
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <FilterDropdown
                label="Breach status"
                value={fBreach}
                options={[
                  { value: "all", label: "All" },
                  { value: "breaching", label: "Breaching", color: BREACH.breaching.c },
                  { value: "atrisk", label: "At risk", color: BREACH.atrisk.c },
                  { value: "ontrack", label: "On track", color: BREACH.ontrack.c },
                ]}
                onChange={setFBreach}
              />
              <FilterDropdown
                label="Disposition"
                value={fDispo}
                icon={SlidersHorizontal}
                options={[
                  { value: "all", label: "All actions" },
                  ...Object.entries(DISPO).map(([k, d]) => ({
                    value: k,
                    label: d.label.replace("Information", "Info"),
                    color: d.dot,
                  })),
                ]}
                onChange={setFDispo}
              />
            </div>
          </div>

          {selectedCount > 0 ? (
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${C.border}`, background: C.accentSoft,
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.accent }}>{selectedCount} selected</span>
              <Btn primary onClick={() => bulkApply("info_update")}>Bulk info+update</Btn>
              <Btn onClick={() => bulkApply("repromise")}>Bulk re-promise</Btn>
              <Btn onClick={() => bulkApply("escalate")}>Bulk escalate</Btn>
              <Btn subtle onClick={clearSelection}>Clear</Btn>
            </div>
          ) : null}

          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "8px 10px", paddingBottom: CARD_HEIGHT }}>
            {loading && ranked.length === 0 ? (
              <div style={{ padding: 8 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 88, marginBottom: 8, borderRadius: 10, background: C.appBg, border: `1px solid ${C.border}` }} />
                ))}
              </div>
            ) : null}
            {ranked.length === 0 && !loading ? (
              <div style={{ padding: 24, textAlign: "center", color: C.ink3, fontSize: 12.5 }}>No cases match these filters.</div>
            ) : null}

            {queueMode === "cause" && ranked.length > 0 ? causeGroups.map((g) => {
              const open = !!expandedCauses[g.key];
              return (
                <div key={g.key} style={{ marginBottom: 8, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <button type="button" onClick={() => setExpandedCauses((e) => ({ ...e, [g.key]: !open }))} style={{
                    width: "100%", textAlign: "left", cursor: "pointer", border: 0, background: C.panelAlt, padding: "10px 11px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{g.cases.length} cases · {g.label}</div>
                      <div style={{ fontSize: 11, color: C.ink3, fontWeight: 600 }}>{g.cases[0].issue}</div>
                    </div>
                  </button>
                  {open ? (
                    <div style={{ padding: "6px 8px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <Btn onClick={() => bulkApplyIds(g.cases.map((c) => c.id), "escalate")}>Bulk escalate</Btn>
                        <Btn onClick={() => bulkApplyIds(g.cases.map((c) => c.id), "repromise")}>Bulk re-promise</Btn>
                      </div>
                      {g.cases.map((c) => (
                        <CaseCard key={c.id} c={c} active={c.id === selId} done={!!actioned[c.id]}
                          checked={!!selectedIds[c.id]} onCheck={() => toggleSelect(c.id)} onSelect={() => setSelId(c.id)} />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }) : null}

            {queueMode === "ranked" && ranked.length > 0 ? (
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
                {rowVirtualizer.getVirtualItems().map((vr) => {
                  const c = ranked[vr.index];
                  return (
                    <div key={c.id} data-index={vr.index} ref={rowVirtualizer.measureElement} style={{
                      position: "absolute", top: 0, left: 0, width: "100%",
                      transform: `translateY(${vr.start}px)`,
                    }}>
                      <CaseCard c={c} active={c.id === selId} done={!!actioned[c.id]}
                        checked={!!selectedIds[c.id]} onCheck={() => toggleSelect(c.id)} onSelect={() => setSelId(c.id)} />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 18, paddingBottom: sel ? 12 : 18 }}>
          {!sel ? (
            <div style={{ padding: 40, textAlign: "center", color: C.ink3, fontSize: 13.5, fontWeight: 600 }}>
              Select a case from the queue to open the work surface.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Stage n={1} title="What the customer wants" accent="#0284c7"
                  tag={<>
                    <Pill style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>
                      <Clock size={11} strokeWidth={2.4} /> notes {sel.notes}
                    </Pill>
                    <Pill style={{ background: C.accentSoft, color: C.accent, border: `1px solid ${C.accent}33` }} title={`Intent confidence · ${sel.conf}`}>
                      <Sparkles size={12} strokeWidth={2.4} />
                      {sel.conf}
                    </Pill>
                  </>}>
                  {!isPhase1(sel) ? (
                    <Pill style={{ background: "#f3e8ff", color: "#6b21a8", border: "1px solid #e9d5ff", marginBottom: 10 }}>later phase</Pill>
                  ) : null}
                  <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, marginBottom: 8 }}>{sel.intent}</div>
                  <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600, marginBottom: 10 }}>{confReason(sel)}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <KV k="Issue" v={sel.issue} />
                    <KV k="Sub-issue" v={sel.sub} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 9, borderTop: `1px dashed ${C.border}` }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                      <Clock size={12} strokeWidth={2.4} />
                      {sel.receivedAt}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                      <FileText size={13} />
                      Source · Sentinel
                    </span>
                  </div>
                </Stage>

                {/* Stage 2 Why blocks — keep structure exactly */}
                <Stage n={2} title="Probable answer" tag={<DispoTag k={sel.dispo} />} accent={DISPO[sel.dispo].dot}>
                  <Why label="SOP rule applied" body={sel.sopRule} icon={ShieldCheck} />
                  <Why label="Why — data state that triggered it" body={sel.sopTrigger} icon={AlertTriangle} />
                </Stage>

                <Stage n={3} title="Recommended action" accent="#4f46e5"
                  tag={<Pill style={{ background: C.appBg, color: C.ink2, border: `1px solid ${C.border}` }}>manual · Phase 1</Pill>}>
                  {!isPhase1(sel) ? (
                    <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "11px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#6b21a8" }}>Outside phase-1 scope</div>
                      <div style={{ fontSize: 12.5, color: "#7e22ce", marginTop: 4 }}>Multi-item / multi-unit — recommendation withheld. Route to later-phase handling.</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.accentSoft,
                      borderRadius: 10, padding: "11px 12px" }}>
                      <ArrowRight size={16} strokeWidth={2.4} style={{ color: C.accent, marginTop: 2, flexShrink: 0 }} />
                      <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, fontWeight: 500 }}>{sel.action}</div>
                    </div>
                  )}
                  {isDone ? (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 13px", marginTop: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <CheckCircle2 size={17} strokeWidth={2.6} style={{ color: "#16a34a" }} />
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#15803d" }}>Action taken · loop closed on LiSN</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#3f6b48", lineHeight: 1.5, marginBottom: 10 }}>
                        Marked for reconciliation to Smart Assist. Status will transition to resolved on Smart Assist to close the loop.
                        {overrides[sel.id]?.reason ? ` Override: ${overrides[sel.id].reason}.` : ""}
                      </div>
                      <pre style={{ marginTop: 4, padding: 10, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8,
                        fontSize: 11.5, color: C.ink2, whiteSpace: "pre-wrap", fontFamily: "ui-monospace, monospace" }}>
                        {buildSmartAssistCopy(sel)}
                      </pre>
                    </div>
                  ) : null}
                </Stage>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
                <div style={{ height: 3, background: "#0d9488" }} />
                <div style={{ padding: "12px 15px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>Case data state</span>
                    <Pill style={{ background: "#e1f5f2", color: "#115e59", marginLeft: "auto" }}>evidence</Pill>
                  </div>
                  <div style={{ fontSize: 11, color: C.ink3, fontWeight: 600, marginBottom: 8 }}>
                    Assembled from backend systems · what the probable answer rests on
                  </div>

                  {sourceError ? (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 10, marginBottom: 10, color: "#b91c1c", fontSize: 12.5 }}>
                      {sourceError}
                    </div>
                  ) : null}

                  {sel.provenance.status.stale ? (
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, marginBottom: 10, color: "#92400e", fontSize: 12.5 }}>
                      {sel.provenance.status.source} has not returned within its expected window ({sel.provenance.status.lag}). Treat values below as potentially stale.
                    </div>
                  ) : null}

                  <div style={{ display: "flex", gap: 10, background: C.appBg, borderRadius: 10, padding: "11px 12px", marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>Promise date</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 2 }}>{sel.promise}</div>
                    </div>
                    <div style={{ width: 1, background: C.border }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>Current EDD</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{sel.edd}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: sel.delta.startsWith("+") ? "#dc2626" : "#16a34a" }}>{sel.delta}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    <Field icon={ClipboardList} label="Case ID" value={sel.id} />
                    <Field icon={ScanLine} label="Tracking ID" value={sel.trackingId} />
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={FileText} label="Order ID" value={sel.orderId} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={Truck} label="Courier" value={`${sel.courier} · ${sel.ctype === "1P" ? "1PL" : "3PL"}`} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={MapPin} label="Current status" value={sel.status}
                        accent={sel.breach === "breaching" ? "#dc2626" : sel.breach === "atrisk" ? "#b45309" : undefined} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={Warehouse} label="Hub" value={sel.hub} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={User} label="Seller" value={sel.seller} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={Tag} label="Category" value={sel.cat} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={Hash} label="Pin code" value={sel.pinCode} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <Field icon={Tags} label="Sub-category" value={sel.sub2} />
                    </div>
                  </div>

                  <div style={{ paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700, marginBottom: 4 }}>
                      Forward-leg journey nodes
                    </div>
                    <Journey current={sel.node} exceptions={sel.exceptions} />
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {sel ? (
            <div style={{
              flexShrink: 0, borderTop: `1px solid ${C.border}`, background: C.panel,
              padding: "10px 18px 12px", boxShadow: "0 -6px 16px rgba(27,30,52,0.06)",
            }}>
              {!isDone ? (
                <>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <Btn primary icon={Check} disabled={!isPhase1(sel)} onClick={() => setActioned((a) => ({ ...a, [sel.id]: true }))}>Accept &amp; close loop</Btn>
                    <Btn icon={Pencil} onClick={() => setModal({ type: "modify", caseId: sel.id })}>Modify</Btn>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8 }}>
                    <RefreshCw size={13} style={{ color: C.ink3 }} />
                    <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                      On accept: status closes here and is reconciled back to Smart Assist (no direct write).
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <Btn icon={Copy} onClick={copyBlock}>{copied ? "Copied" : "Copy update for Smart Assist"}</Btn>
                  <button type="button" onClick={() => setActioned((a) => ({ ...a, [sel.id]: false }))} style={{
                    cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#15803d",
                    background: "transparent", border: "none", textDecoration: "underline" }}>Undo</button>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {modal ? (
        <OverrideModal
          title={modal.type === "modify" ? "Modify disposition" : modal.type === "escalate" ? "Escalate instead" : "Skip case"}
          onClose={() => setModal(null)}
          onConfirm={confirmOverride}
        />
      ) : null}
    </div>
  );
}

function CaseCard({ c, active, done, checked, onCheck, onSelect }) {
  const b = BREACH[c.breach];
  const tip = c._rank?.parts?.map((p) => `${p.k}: ${p.v}`).join("\n") || "";
  return (
    <div style={{
      width: "100%", marginBottom: 7, display: "flex", gap: 0, alignItems: "stretch",
      background: active ? C.accentSoft : C.panel,
      borderTop: `1px solid ${active ? "#c7cbfb" : C.border}`,
      borderRight: `1px solid ${active ? "#c7cbfb" : C.border}`,
      borderBottom: `1px solid ${active ? "#c7cbfb" : C.border}`,
      borderLeft: `3px solid ${b.c}`,
      borderRadius: 10, overflow: "hidden",
    }}>
      <label style={{ display: "grid", placeItems: "center", padding: "0 8px", cursor: "pointer" }} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onCheck} />
      </label>
      <button type="button" onClick={onSelect} style={{
        flex: 1, textAlign: "left", cursor: "pointer", border: 0, background: "transparent", padding: "10px 11px 10px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.ink, fontFamily: "ui-monospace, monospace" }}>{c.id}</span>
          <Pill style={{ background: C.appBg, color: C.ink2, border: `1px solid ${C.border}`, fontSize: 10.5 }}>
            <Truck size={11} strokeWidth={2.4} />
            {c.ctype === "1P" ? "1PL" : "3PL"}
          </Pill>
          {!isPhase1(c) ? <Pill style={{ background: "#f3e8ff", color: "#6b21a8", fontSize: 10.5 }}>later phase</Pill> : null}
          {done && <CheckCircle2 size={13} strokeWidth={2.6} style={{ color: "#16a34a" }} />}
          <span title={tip} style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: b.c, whiteSpace: "nowrap", cursor: "help" }}>{c.ttb}</span>
        </div>
        <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.intent}</div>
      </button>
    </div>
  );
}

function Stat({ label, value, delta, tone }) {
  const col = tone === "red" ? "#dc2626" : tone === "amber" ? "#d97706" : C.accent;
  const dcol = String(delta).startsWith("+") ? (tone === "neutral" ? C.ink3 : col) : "#16a34a";
  return (
    <div style={{ background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "5px 11px", minWidth: 78 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: col }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: dcol }}>{delta}</span>
      </div>
    </div>
  );
}

function FilterChip({ children, active, onClick, color, dot, icon: I }) {
  return (
    <button type="button" onClick={onClick} style={{
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11.5, fontWeight: 700, padding: "4px 9px", borderRadius: 999,
      border: `1px solid ${active ? color : C.border}`,
      background: active ? color : C.panel, color: active ? "#fff" : C.ink2, transition: "all .12s" }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 999, background: active ? "#fff" : color }} />}
      {I && <I size={12} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

function FilterDropdown({ label, value, options, onChange, icon: I }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];
  const active = value !== "all";

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "100%", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11.5, fontWeight: 700, padding: "7px 10px", borderRadius: 9,
          border: `1px solid ${active || open ? C.accent : C.border}`,
          background: active ? C.accentSoft : C.panel,
          color: active ? C.accent : C.ink2,
        }}
      >
        {I ? <I size={12} strokeWidth={2.4} /> : <SlidersHorizontal size={12} strokeWidth={2.4} />}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {active ? selected.label : label}
        </span>
        {selected.color && active ? (
          <span style={{ width: 7, height: 7, borderRadius: 999, background: selected.color, flexShrink: 0 }} />
        ) : null}
        <ChevronDown size={13} strokeWidth={2.4} style={{ marginLeft: "auto", flexShrink: 0, transform: open ? "rotate(180deg)" : undefined }} />
      </button>
      {open ? (
        <div
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 30,
            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10,
            boxShadow: "0 10px 28px rgba(27,30,52,0.12)", padding: 4, maxHeight: 240, overflowY: "auto",
          }}
        >
          {options.map((o) => {
            const isSel = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={isSel}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer", border: 0, borderRadius: 7,
                  padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
                  background: isSel ? C.accentSoft : "transparent",
                  color: isSel ? C.accent : C.ink, fontSize: 12, fontWeight: isSel ? 800 : 600,
                }}
              >
                {o.color ? <span style={{ width: 8, height: 8, borderRadius: 999, background: o.color, flexShrink: 0 }} /> : null}
                <span style={{ flex: 1 }}>{o.label}</span>
                {isSel ? <Check size={13} strokeWidth={2.6} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div style={{ background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", flex: 1, minWidth: 110 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{k}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 1 }}>{v}</div>
    </div>
  );
}

function Why({ label, body, icon: I }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 9 }}>
      <I size={15} strokeWidth={2.2} style={{ color: C.ink3, marginTop: 1, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}

function Btn({ children, primary, subtle, icon: I, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 12.5, fontWeight: 700, padding: "8px 13px", borderRadius: 9, opacity: disabled ? 0.45 : 1,
      border: `1px solid ${primary ? C.accent : C.border}`,
      background: primary ? C.accent : subtle ? "transparent" : C.panel,
      color: primary ? "#fff" : subtle ? C.ink3 : C.ink, transition: "all .12s" }}>
      {I && <I size={14} strokeWidth={2.4} />}{children}
    </button>
  );
}