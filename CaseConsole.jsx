import React, { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, Clock, AlertTriangle, CheckCircle2, ChevronRight,
  Info, RefreshCw, ArrowUpRight, Package, MapPin, Truck, Sparkles, ArrowRight,
  CircleDot, Circle, User, ShieldCheck, FileText, CalendarDays, Tag, Check, X,
  Pencil, Zap
} from "lucide-react";

/* ------------------------------------------------------------------ tokens */
const C = {
  appBg: "#f4f5fb", panel: "#ffffff", panelAlt: "#fafbff",
  border: "#e7e9f3", borderStrong: "#d6d9ea",
  ink: "#1b1e34", ink2: "#585d7d", ink3: "#8a8fac",
  accent: "#4f46e5", accentLine: "#6366f1", accentSoft: "#eef0fe",
};
// Disposition = ENTITY palette (cool / brand-family), kept distinct from breach STATE palette
const DISPO = {
  info_update:   { label: "Information + update",   dot: "#0284c7", soft: "#e7f4fb", ink: "#075985", Icon: Info },
  repromise:     { label: "Re-promise",             dot: "#7c3aed", soft: "#f1eafe", ink: "#5b21b6", Icon: RefreshCw },
  escalate:      { label: "Escalate",               dot: "#db2777", soft: "#fce7f1", ink: "#9d174d", Icon: ArrowUpRight },
  info_followup: { label: "Information + follow-up", dot: "#0d9488", soft: "#e1f5f2", ink: "#115e59", Icon: Clock },
};
// Breach = STATE palette (red / amber / green), never reused for entities
const BREACH = {
  breaching: { label: "Breaching",  c: "#dc2626", bg: "#fef2f2", bd: "#fecaca" },
  atrisk:    { label: "At risk",    c: "#d97706", bg: "#fffbeb", bd: "#fde68a" },
  ontrack:   { label: "On track",   c: "#16a34a", bg: "#f0fdf4", bd: "#bbf7d0" },
};

const JOURNEY = ["Order confirmed", "Picked · FC", "In transit · forward leg", "At delivery hub", "Out for delivery", "Delivered"];

/* ------------------------------------------------------------------- data  */
const CASES = [
  {
    id: "CASE-8842-XA", dispo: "escalate",
    intent: "No movement for 48h — customer escalating, wants it resolved today",
    issue: "Delivery delay", sub: "Shipment stuck, no scan",
    breach: "breaching", ttb: "−2h 10m", ttbMin: -130,
    promise: "07 Aug", edd: "11 Aug", delta: "+4d",
    status: "Stuck at delivery hub · 48h no scan", node: 3,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Large Appliances", sub2: "Refrigerator",
    notes: "D-1", conf: "High", item: "Single-item · single-unit",
    sopRule: "SOP · forward-leg breach + no-scan > 36h → escalate to Hub-Ops",
    sopTrigger: "EDD 11 Aug is 4 days past promise (07 Aug); last hub scan 48h ago; breach already crossed",
    action: "Raise Hub-Ops escalation with shipment ref; request manual sort + re-scan; set revised EDD 13 Aug",
  },
  {
    id: "CASE-8817-QP", dispo: "repromise",
    intent: "Order delayed — customer wants a firm new delivery date",
    issue: "Delivery delay", sub: "EDD passed, no update",
    breach: "breaching", ttb: "−45m", ttbMin: -45,
    promise: "08 Aug", edd: "12 Aug", delta: "+4d",
    status: "In transit · forward leg · behind plan", node: 2,
    courier: "eKart", ctype: "1P", seller: "Omniverse Retail", cat: "Home & Kitchen", sub2: "Cookware Set",
    notes: "D-1", conf: "High", item: "Single-item · single-unit",
    sopRule: "SOP · promise-breach on forward leg → re-promise with revised EDD",
    sopTrigger: "EDD 12 Aug is 4 days past promise (08 Aug); shipment moving but behind plan",
    action: "Re-promise with revised EDD 13 Aug; note delay reason (forward-leg backlog) on the case",
  },
  {
    id: "CASE-8790-LM", dispo: "repromise",
    intent: "Delivery attempt failed — customer was available, wants re-attempt",
    issue: "Failed delivery", sub: "Attempt marked, customer disputes",
    breach: "atrisk", ttb: "3h 20m", ttbMin: 200,
    promise: "10 Aug", edd: "11 Aug", delta: "+1d",
    status: "Out for delivery · 1 failed attempt", node: 4,
    courier: "Ecom Express", ctype: "3P", seller: "RetailNet", cat: "Electronics", sub2: "Headphones",
    notes: "D-1", conf: "Medium", item: "Single-item · single-unit",
    sopRule: "SOP · failed-attempt dispute → re-promise + re-attempt request",
    sopTrigger: "One failed attempt logged; EDD 11 Aug within 1 day of promise; re-attempt window open",
    action: "Re-promise next-day delivery; flag re-attempt to 3P courier; confirm contact number on case",
  },
  {
    id: "CASE-8776-RT", dispo: "info_update",
    intent: "Where is my order — customer just wants a status update",
    issue: "WISMO", sub: "Status enquiry",
    breach: "atrisk", ttb: "5h 05m", ttbMin: 305,
    promise: "11 Aug", edd: "11 Aug", delta: "on plan",
    status: "Out for delivery · on plan", node: 4,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Fashion", sub2: "Footwear",
    notes: "D-1", conf: "High", item: "Single-item · single-unit",
    sopRule: "SOP · WISMO + on-plan → information + update, no promise change",
    sopTrigger: "EDD 11 Aug matches promise; shipment out for delivery; no exception on the leg",
    action: "Send status update: out for delivery today, EDD 11 Aug unchanged; no re-promise needed",
  },
  {
    id: "CASE-8751-BK", dispo: "escalate",
    intent: "Item appears mis-sorted to wrong hub — customer chasing for 3rd time",
    issue: "Delivery delay", sub: "Wrong-hub / mis-route",
    breach: "atrisk", ttb: "7h 40m", ttbMin: 460,
    promise: "10 Aug", edd: "12 Aug", delta: "+2d",
    status: "At delivery hub · route mismatch flagged", node: 3,
    courier: "eKart", ctype: "1P", seller: "Prime Sellers", cat: "Home & Kitchen", sub2: "Mixer Grinder",
    notes: "D-1", conf: "Medium", item: "Single-item · single-unit",
    sopRule: "SOP · route mismatch + repeat contact → escalate to Hub-Ops",
    sopTrigger: "Destination hub ≠ pincode hub; 3rd customer contact; EDD 2 days past promise",
    action: "Escalate mis-route to Hub-Ops; request re-induct to correct hub; revised EDD 13 Aug once re-routed",
  },
  {
    id: "CASE-8729-WV", dispo: "info_followup",
    intent: "Delivery address needs correction before it goes out",
    issue: "Address issue", sub: "Incomplete address",
    breach: "atrisk", ttb: "9h 15m", ttbMin: 555,
    promise: "12 Aug", edd: "12 Aug", delta: "on plan",
    status: "At delivery hub · awaiting address confirmation", node: 3,
    courier: "Delhivery", ctype: "3P", seller: "RetailNet", cat: "Electronics", sub2: "Smart Watch",
    notes: "D-1", conf: "Medium", item: "Single-item · single-unit",
    sopRule: "SOP · address gap → information + follow-up before OFD",
    sopTrigger: "Address flagged incomplete at hub; EDD on plan but OFD blocked until confirmed",
    action: "Follow up with customer to confirm landmark + pincode; hold at hub, release to OFD on confirmation",
  },
  {
    id: "CASE-8703-DZ", dispo: "info_update",
    intent: "Customer checking status a day before EDD, no issue reported",
    issue: "WISMO", sub: "Pre-EDD enquiry",
    breach: "ontrack", ttb: "22h", ttbMin: 1320,
    promise: "12 Aug", edd: "12 Aug", delta: "on plan",
    status: "In transit · forward leg · on plan", node: 2,
    courier: "eKart", ctype: "1P", seller: "CloudTail", cat: "Fashion", sub2: "Apparel",
    notes: "D-1", conf: "High", item: "Single-item · single-unit",
    sopRule: "SOP · WISMO + on-plan → information + update",
    sopTrigger: "Shipment on plan; EDD matches promise; comfortable buffer to breach window",
    action: "Send reassurance update: on track for 12 Aug; no action required beyond the update",
  },
  {
    id: "CASE-8688-HN", dispo: "info_followup",
    intent: "Marked delivered but customer says not received — wants confirmation",
    issue: "Delivered not received", sub: "POD dispute",
    breach: "ontrack", ttb: "—", ttbMin: 99999,
    promise: "10 Aug", edd: "10 Aug", delta: "delivered",
    status: "Delivered · POD on file", node: 5,
    courier: "eKart", ctype: "1P", seller: "Omniverse Retail", cat: "Electronics", sub2: "Power Bank",
    notes: "D-1", conf: "Medium", item: "Single-item · single-unit",
    sopRule: "SOP · POD dispute → information + follow-up (no re-promise on delivered)",
    sopTrigger: "Status delivered with POD; customer disputes receipt; not a breach case",
    action: "Follow up: share POD detail + delivery timestamp; open receipt check if customer maintains dispute",
  },
];

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

const Field = ({ icon: I, label, value, accent }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "8px 0" }}>
    <I size={15} strokeWidth={2} style={{ color: C.ink3, marginTop: 1, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13, color: accent || C.ink, fontWeight: accent ? 700 : 500, marginTop: 1 }}>{value}</div>
    </div>
  </div>
);

/* ------------------------------------------------------------ stage shell  */
function Stage({ n, title, tag, children, accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 3, background: accent || C.accentLine }} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: C.accentSoft, color: C.accent,
            display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{n}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{title}</span>
          {tag && <span style={{ marginLeft: "auto" }}>{tag}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- journey strip  */
function Journey({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: 4 }}>
      {JOURNEY.map((label, i) => {
        const done = i < current, here = i === current;
        const col = here ? "#d97706" : done ? C.accent : C.ink3;
        return (
          <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center", position: "relative" }}>
            {i < JOURNEY.length - 1 && (
              <div style={{ position: "absolute", top: 7, left: "50%", right: "-50%", height: 2,
                background: done ? C.accent : C.border }} />
            )}
            <div style={{ position: "relative", display: "grid", placeItems: "center", marginBottom: 6 }}>
              {here ? <CircleDot size={16} strokeWidth={2.6} style={{ color: col, background: C.panel }} />
                : done ? <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: col, background: C.panel }} />
                : <Circle size={16} strokeWidth={2} style={{ color: col, background: C.panel }} />}
            </div>
            <div style={{ fontSize: 9.5, lineHeight: 1.25, color: here ? "#b45309" : done ? C.ink2 : C.ink3,
              fontWeight: here ? 700 : 500, padding: "0 2px" }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================ main app */
export default function CaseConsole() {
  const [selId, setSelId] = useState(CASES[0].id);
  const [fDispo, setFDispo] = useState("all");
  const [fBreach, setFBreach] = useState("all");
  const [q, setQ] = useState("");
  const [actioned, setActioned] = useState({}); // id -> true

  const ranked = useMemo(() => {
    return CASES
      .filter(c => fDispo === "all" || c.dispo === fDispo)
      .filter(c => fBreach === "all" || c.breach === fBreach)
      .filter(c => !q || (c.id + c.intent + c.seller).toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.ttbMin - b.ttbMin);
  }, [fDispo, fBreach, q]);

  const sel = CASES.find(c => c.id === selId) || ranked[0] || CASES[0];
  const counts = {
    open: CASES.length,
    atrisk: CASES.filter(c => c.breach === "atrisk").length,
    breaching: CASES.filter(c => c.breach === "breaching").length,
  };
  const isDone = !!actioned[sel.id];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: C.appBg,
      color: C.ink, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ---------------------------------------------------------- header */}
      <header style={{ height: 58, flexShrink: 0, background: C.panel, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 16, padding: "0 18px" }}>
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

        {/* compact stats with adjacent deltas */}
        <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
          <Stat label="Open cases" value={counts.open} delta="+3" tone="neutral" />
          <Stat label="At risk" value={counts.atrisk} delta="−2" tone="amber" />
          <Stat label="Breaching" value={counts.breaching} delta="+1" tone="red" />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Pill style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>
            <Clock size={12} strokeWidth={2.4} /> Case notes · D-1 lag
          </Pill>
          <div style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: C.accentSoft, color: C.accent,
              display: "grid", placeItems: "center" }}><User size={15} strokeWidth={2.2} /></div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>Ops agent</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ============================================== left · the queue */}
        <aside style={{ width: 344, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.panel,
          display: "flex", flexDirection: "column", minHeight: 0 }}>

          <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink, letterSpacing: 0.2 }}>WORK QUEUE</span>
              <Pill style={{ background: C.accentSoft, color: C.accent, marginLeft: "auto" }}>
                <ArrowUpRight size={11} strokeWidth={2.6} /> Ranked by time-to-breach
              </Pill>
            </div>

            {/* search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.appBg, border: `1px solid ${C.border}`,
              borderRadius: 9, padding: "7px 10px", marginBottom: 9 }}>
              <Search size={14} style={{ color: C.ink3 }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search case, intent, seller…"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: C.ink, width: "100%" }} />
            </div>

            {/* filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[["all", "All"], ["breaching", "Breaching"], ["atrisk", "At risk"], ["ontrack", "On track"]].map(([k, l]) => (
                <FilterChip key={k} active={fBreach === k} onClick={() => setFBreach(k)}
                  color={k !== "all" ? BREACH[k]?.c : C.accent}>{l}</FilterChip>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              <FilterChip active={fDispo === "all"} onClick={() => setFDispo("all")} color={C.accent} icon={SlidersHorizontal}>All actions</FilterChip>
              {Object.entries(DISPO).map(([k, d]) => (
                <FilterChip key={k} active={fDispo === k} onClick={() => setFDispo(k)} color={d.dot} dot>{d.label.replace("Information", "Info")}</FilterChip>
              ))}
            </div>
          </div>

          {/* the list — internal scroll */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
            {ranked.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: C.ink3, fontSize: 12.5 }}>No cases match these filters.</div>
            )}
            {ranked.map(c => {
              const active = c.id === sel.id, b = BREACH[c.breach], done = !!actioned[c.id];
              return (
                <button key={c.id} onClick={() => setSelId(c.id)} style={{
                  width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 7,
                  background: active ? C.accentSoft : C.panel,
                  border: `1px solid ${active ? "#c7cbfb" : C.border}`, borderLeft: `3px solid ${b.c}`,
                  borderRadius: 10, padding: "10px 11px", transition: "all .12s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: C.ink, fontFamily: "ui-monospace, monospace" }}>{c.id}</span>
                    {done && <CheckCircle2 size={13} strokeWidth={2.6} style={{ color: "#16a34a" }} />}
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: b.c, whiteSpace: "nowrap" }}>{c.ttb}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.35, marginBottom: 7,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.intent}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <DispoTag k={c.dispo} />
                    <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 3,
                      fontSize: 10.5, color: C.ink3, fontWeight: 600 }}>
                      <Truck size={11} />{c.ctype}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ==================================== right · the case work surface */}
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: 18 }}>

          {/* case header strip */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "ui-monospace, monospace", color: C.ink }}>{sel.id}</span>
              <BreachChip k={sel.breach} ttb={sel.ttb} />
              <DispoTag k={sel.dispo} size="lg" />
              <Pill style={{ background: C.appBg, color: C.ink2, border: `1px solid ${C.border}` }}>
                <Package size={12} /> {sel.item}
              </Pill>
              <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} style={{ color: C.accent }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.accent }}>LiSN intelligence</span>
                <span style={{ fontSize: 11, color: C.ink3, fontWeight: 600 }}>· confidence {sel.conf}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, color: C.ink, marginTop: 10, fontWeight: 500, lineHeight: 1.4 }}>{sel.intent}</div>
          </div>

          {/* two columns: intelligence flow (1-2-3) + case data state */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: 14 }}>

            {/* --------------------------------------- col 1: the 3 legs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* ① what the customer wants — the PROBLEM block */}
              <Stage n={1} title="What the customer wants"
                tag={<Pill style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>
                  <Clock size={11} strokeWidth={2.4} /> notes D-1</Pill>} accent="#0284c7">
                <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, marginBottom: 11 }}>{sel.intent}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  <KV k="Issue" v={sel.issue} />
                  <KV k="Sub-issue" v={sel.sub} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 9, borderTop: `1px dashed ${C.border}` }}>
                  <FileText size={13} style={{ color: C.ink3 }} />
                  <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                    Source · Smart Assist case summary + issue codes. No call transcript in this phase.
                  </span>
                </div>
              </Stage>

              {/* ② probable answer — the SOLUTION block (kept separate) */}
              <Stage n={2} title="Probable answer"
                tag={<DispoTag k={sel.dispo} />} accent={DISPO[sel.dispo].dot}>
                <div style={{ background: DISPO[sel.dispo].soft, border: `1px solid ${DISPO[sel.dispo].dot}22`,
                  borderRadius: 10, padding: "11px 12px", marginBottom: 11 }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", fontWeight: 800,
                    color: DISPO[sel.dispo].ink, marginBottom: 4 }}>Recommended disposition</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DISPO[sel.dispo].ink }}>{DISPO[sel.dispo].label}</div>
                </div>

                <Why label="SOP rule applied" body={sel.sopRule} icon={ShieldCheck} />
                <Why label="Why — data state that triggered it" body={sel.sopTrigger} icon={AlertTriangle} />

                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, paddingTop: 9,
                  borderTop: `1px dashed ${C.border}` }}>
                  <Info size={13} style={{ color: C.ink3 }} />
                  <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                    Recommended by LiSN — you review and act. Read-only: no write-back to Smart Assist.
                  </span>
                </div>
              </Stage>

              {/* ③ action + close the loop */}
              <Stage n={3} title="Recommended action" accent="#4f46e5"
                tag={<Pill style={{ background: C.appBg, color: C.ink2, border: `1px solid ${C.border}` }}>manual · Phase 1</Pill>}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.accentSoft,
                  borderRadius: 10, padding: "11px 12px", marginBottom: 12 }}>
                  <ArrowRight size={16} strokeWidth={2.4} style={{ color: C.accent, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, fontWeight: 500 }}>{sel.action}</div>
                </div>

                {!isDone ? (
                  <>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Btn primary icon={Check} onClick={() => setActioned(a => ({ ...a, [sel.id]: true }))}>Accept &amp; close loop</Btn>
                      <Btn icon={Pencil}>Modify</Btn>
                      <Btn icon={ArrowUpRight}>Escalate instead</Btn>
                      <Btn icon={X} subtle>Skip</Btn>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 11, paddingTop: 10,
                      borderTop: `1px dashed ${C.border}` }}>
                      <RefreshCw size={13} style={{ color: C.ink3 }} />
                      <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>
                        On accept: status closes here and is reconciled back to Smart Assist (no direct write).
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <CheckCircle2 size={17} strokeWidth={2.6} style={{ color: "#16a34a" }} />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#15803d" }}>Action taken · loop closed on LiSN</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#3f6b48", lineHeight: 1.5 }}>
                      Marked for reconciliation to Smart Assist. Status will transition to resolved on Smart Assist to close the loop.
                    </div>
                    <button onClick={() => setActioned(a => ({ ...a, [sel.id]: false }))} style={{
                      marginTop: 9, cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#15803d",
                      background: "transparent", border: "none", textDecoration: "underline" }}>Undo</button>
                  </div>
                )}
              </Stage>
            </div>

            {/* --------------------------------------- col 2: case data state (evidence) */}
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
              <div style={{ height: 3, background: "#0d9488" }} />
              <div style={{ padding: "12px 15px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>Case data state</span>
                  <Pill style={{ background: "#e1f5f2", color: "#115e59", marginLeft: "auto" }}>evidence</Pill>
                </div>
                <div style={{ fontSize: 11, color: C.ink3, fontWeight: 600, marginBottom: 8 }}>
                  Assembled from backend systems · what the probable answer rests on
                </div>

                {/* promise vs EDD — delta beside the numbers */}
                <div style={{ display: "flex", gap: 10, background: C.appBg, borderRadius: 10, padding: "11px 12px", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>Promise date</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 2 }}>{sel.promise}</div>
                  </div>
                  <div style={{ width: 1, background: C.border }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>Current EDD</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{sel.edd}</span>
                      <span style={{ fontSize: 12, fontWeight: 800,
                        color: sel.delta.startsWith("+") ? "#dc2626" : "#16a34a" }}>{sel.delta}</span>
                    </div>
                  </div>
                </div>

                <Field icon={MapPin} label="Current status" value={sel.status}
                  accent={sel.breach === "breaching" ? "#dc2626" : sel.breach === "atrisk" ? "#b45309" : undefined} />
                <div style={{ height: 1, background: C.border }} />
                <Field icon={Truck} label="Courier" value={`${sel.courier} · ${sel.ctype === "1P" ? "first-party (eKart)" : "third-party"}`} />
                <div style={{ height: 1, background: C.border }} />
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1 }}><Field icon={User} label="Seller" value={sel.seller} /></div>
                  <div style={{ flex: 1 }}><Field icon={Tag} label="Category" value={`${sel.cat}`} /></div>
                </div>
                <div style={{ fontSize: 11.5, color: C.ink2, marginTop: -4, marginBottom: 6, paddingLeft: 24 }}>
                  Sub-category · {sel.sub2}
                </div>

                {/* journey nodes */}
                <div style={{ paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700, marginBottom: 4 }}>
                    Forward-leg journey nodes
                  </div>
                  <Journey current={sel.node} />
                </div>

                {/* source freshness — honest flagging */}
                <div style={{ marginTop: 14, paddingTop: 11, borderTop: `1px solid ${C.border}`,
                  display: "flex", flexDirection: "column", gap: 6 }}>
                  <SrcRow name="Smart Assist · case + notes" lag="D-1" warm />
                  <SrcRow name={`Tracking · ${sel.ctype === "1P" ? "e-Ship Multi Track" : "Shipping UI / FLO"}`} lag={sel.ctype === "1P" ? "~ hourly" : "24–26h"} warm={sel.ctype !== "1P"} />
                  <SrcRow name="Order warehouse · FDP" lag="~24h" warm />
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 8 }} />
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ small parts  */
function Stat({ label, value, delta, tone }) {
  const col = tone === "red" ? "#dc2626" : tone === "amber" ? "#d97706" : C.accent;
  const dcol = delta.startsWith("+") ? (tone === "neutral" ? C.ink3 : col) : "#16a34a";
  return (
    <div style={{ background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "5px 11px", minWidth: 78 }}>
      <div style={{ fontSize: 9.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: col }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: dcol }}>{delta}</span>
      </div>
    </div>
  );
}

function FilterChip({ children, active, onClick, color, dot, icon: I }) {
  return (
    <button onClick={onClick} style={{
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

function KV({ k, v }) {
  return (
    <div style={{ background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700 }}>{k}</div>
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

function Btn({ children, primary, subtle, icon: I, onClick }) {
  return (
    <button onClick={onClick} style={{
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 12.5, fontWeight: 700, padding: "8px 13px", borderRadius: 9,
      border: `1px solid ${primary ? C.accent : C.border}`,
      background: primary ? C.accent : subtle ? "transparent" : C.panel,
      color: primary ? "#fff" : subtle ? C.ink3 : C.ink, transition: "all .12s" }}>
      {I && <I size={14} strokeWidth={2.4} />}{children}
    </button>
  );
}

function SrcRow({ name, lag, warm }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: warm ? "#d97706" : "#16a34a", flexShrink: 0 }} />
      <span style={{ color: C.ink2, fontWeight: 600 }}>{name}</span>
      <span style={{ marginLeft: "auto", fontWeight: 700, color: warm ? "#b45309" : "#15803d",
        background: warm ? "#fffbeb" : "#f0fdf4", border: `1px solid ${warm ? "#fde68a" : "#bbf7d0"}`,
        padding: "1px 7px", borderRadius: 999 }}>{lag}</span>
    </div>
  );
}
