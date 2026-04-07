"use client";

import { useState, type ReactNode, type ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  Bot,
  CheckCircle,
  ChevronRight,
  Crosshair,
  Globe,
  Grid,
  Home as HomeIcon,
  Layers,
  Lock,
  MessageCircle,
  Shield,
  Target,
} from "lucide-react";
import { CardOpsDashboard } from "./CardOpsDashboard";
import {
  T,
  ROLE_DATA,
  type Industry,
  type Role,
  type RoleDashboardData,
  type ScreenId,
  type LensId,
} from "@/lib/industry-dashboard/registry";
type BadgeColor = "red" | "amber" | "green" | "teal" | "purple" | "blue" | "gold" | "cyan";

function Badge({ color = "blue", children }: { color?: BadgeColor; children: ReactNode }) {
  const m: Record<BadgeColor, [string, string]> = { red: [T.red, T.redGlow], amber: [T.amber, T.amberGlow], green: [T.green, T.greenGlow], teal: [T.cyan, T.cyanGlow], purple: [T.purple, T.purpleGlow], blue: [T.blue, T.blueGlow], gold: [T.gold, T.goldGlow], cyan: [T.cyan, T.cyanGlow] };
  const [fg, bg] = m[color] ?? m.blue;
  return <span style={{ background: bg, color: fg, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>;
}
function Sec({ title, sub, action, children }: { title: string; sub?: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (<div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</div>{sub && <div style={{ fontSize: 12, color: T.textMut, marginTop: 2 }}>{sub}</div>}</div>{action}
    </div>{children}</div>);
}

const SCREENS: { id: ScreenId; label: string; sub: string; icon: LucideIcon }[] = [
  { id: 1, label: "Executive View", sub: "Promise · Stability · Risk", icon: HomeIcon },
  { id: 2, label: "LOB View", sub: "Business KPIs + AI Insights", icon: Grid },
  { id: 3, label: "KPI Signals", sub: "CX · Ops · Risk · Compliance", icon: Activity },
  { id: 4, label: "Functional Lens", sub: "Operations / Risk / Compliance", icon: Layers },
  { id: 5, label: "Root Cause + Action", sub: "Signal → Cause → Action", icon: Crosshair },
];

function Screen1({ data, goTo }: { data: RoleDashboardData; goTo: (n: ScreenId) => void }) {
  const gC = (s: number) => (s >= 80 ? T.green : s >= 60 ? T.amber : T.red);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {data.tiles.map((tile, i) => {
          const Icon = tile.icon; const sc = gC(tile.score);
          return (
            <div key={i} onClick={() => goTo(2)} style={{ background: `linear-gradient(160deg, ${T.card}, ${T.elevated})`, border: `1px solid ${sc}30`, borderRadius: 16, padding: "24px 22px", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${sc}15`} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tile.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} color={tile.color}/></div>
                  <div><div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{tile.title}</div><div style={{ fontSize: 11, color: T.textMut }}>{tile.sub}</div></div>
                </div>
                <ChevronRight size={16} color={T.textMut}/>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", border: `3px solid ${sc}`, display: "flex", alignItems: "center", justifyContent: "center", background: `${sc}08`, boxShadow: `0 0 20px ${sc}15` }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: sc, fontFamily: "var(--mono)" }}>{tile.score}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", flex: 1 }}>
                  {tile.kpis.map((k, j) => (<div key={j}><div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.l}</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "var(--mono)" }}>{k.v}</div></div>))}
                </div>
              </div>
              <div style={{ background: `${sc}08`, border: `1px solid ${sc}20`, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Bot size={11} color={sc}/><span style={{ fontSize: 10, fontWeight: 700, color: sc, letterSpacing: 0.5, textTransform: "uppercase" }}>AI Insight</span></div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.55 }}>{tile.insight}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: T.textMut }}><ArrowDown size={14} color={T.cyan} style={{ verticalAlign: "middle", marginRight: 6 }}/>Click any tile to drill into <strong style={{ color: T.cyan }}>Screen 2: LOB View</strong></div>
    </div>
  );
}

function Screen2({ data, goTo }: { data: RoleDashboardData; goTo: (n: ScreenId) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
            {data.lobKpis.map((k, i) => {
              const col = k.st === "red" ? T.red : k.st === "amber" ? T.amber : T.green;
              return (
                <div key={i} onClick={() => goTo(3)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 12px", borderTop: `2px solid ${col}`, cursor: "pointer" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{k.l}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: col, fontFamily: "var(--mono)", lineHeight: 1 }}>{k.v}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
                    <span style={{ color: T.red, fontWeight: 600 }}>{k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta)}</span>
                    <span style={{ color: T.textMut }}>T: {k.target}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Sec title="AI Insights" sub="Top issues driving KPI movement" action={<Badge color="gold">Max 2–3</Badge>}>
            {data.insights.map((ins, i) => (
              <div key={i} onClick={() => goTo(5)} style={{ background: T.surface, border: `1px solid ${T.amber}20`, borderLeft: `3px solid ${T.amber}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Bot size={12} color={T.amber}/><span style={{ fontSize: 10, fontWeight: 700, color: T.amber, textTransform: "uppercase" }}>AI Insight #{i + 1}</span></div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{ins}</div>
              </div>
            ))}
          </Sec>
        </div>
        <Sec title="Priority Matrix" sub="Eisenhower: what needs action now?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6 }}>
            {[{ label: "DO NOW", items: data.eisenhower.do, bg: T.redGlow, bc: T.red }, { label: "PLAN", items: data.eisenhower.plan, bg: T.amberGlow, bc: T.amber }, { label: "DELEGATE", items: data.eisenhower.delegate, bg: T.blueGlow, bc: T.blue }, { label: "MONITOR", items: data.eisenhower.monitor, bg: `${T.textMut}08`, bc: T.textMut }].map((q, i) => (
              <div key={i} style={{ background: q.bg, border: `1px solid ${q.bc}20`, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: q.bc, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{q.label}</div>
                {q.items.map((item, j) => (<div key={j} style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${q.bc}30` }}>{item}</div>))}
              </div>
            ))}
          </div>
        </Sec>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: T.textMut }}><ArrowDown size={14} color={T.cyan} style={{ verticalAlign: "middle", marginRight: 6 }}/>Click any KPI to drill into <strong style={{ color: T.cyan }}>Screen 3: KPI Signals</strong></div>
    </div>
  );
}

function Screen3({ goTo }: { goTo: (n: ScreenId) => void }) {
  const groups = [
    { label: "CX Metrics", color: T.cyan, icon: Target, kpis: [{ n: "NPS", v: "+38", a: "▼6 pts in 4 weeks" }, { n: "CSAT", v: "81%", a: null }, { n: "Sentiment", v: "0.58", a: "Below 0.60 threshold" }, { n: "Complaint Rate", v: "2.8%", a: "▲40% in 6 weeks" }] },
    { label: "Operational", color: T.gold, icon: Activity, kpis: [{ n: "AHT", v: "8.3m", a: "Above 8 min target" }, { n: "SLA Compliance", v: "87%", a: "Below 95% — 3rd week" }, { n: "Vol vs Capacity", v: "112%", a: "Exceeded 9–11 AM" }, { n: "FCR", v: "74%", a: "Below 80% target" }] },
    { label: "Risk", color: T.red, icon: Shield, kpis: [{ n: "Fraud Signals", v: "69", a: "FL cluster + MCC 7995" }, { n: "System Failures", v: "4", a: "KYC API + payment" }, { n: "Breach Exposure", v: "1,247", a: "Active merchant breach" }, { n: "ATO Attempts", v: "23", a: "Social engineering" }] },
    { label: "Regulatory", color: T.purple, icon: Globe, kpis: [{ n: "CFPB Risk Cases", v: "7", a: ">60% escalation" }, { n: "Social Velocity", v: "3.4×", a: "Above 2× threshold" }, { n: "Compliance", v: "91%", a: null }, { n: "Cmpl→Social", v: "4.2%", a: "Posting after complaints" }] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.cyanGlow, border: `1px solid ${T.cyan}20`, borderRadius: 10, padding: "10px 16px", fontSize: 12, color: T.cyan }}>
        <strong>Balanced view:</strong> Where performance is strong (green), breaking (red), shifting (amber). Click any KPI for functional lens.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {groups.map((g, gi) => {
          const Icon = g.icon;
          return (
            <div key={gi} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 14px", borderTop: `2px solid ${g.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}><Icon size={14} color={g.color}/><span style={{ fontSize: 13, fontWeight: 700, color: g.color }}>{g.label}</span></div>
              {g.kpis.map((k, ki) => {
                const tc = k.a ? T.red : T.green;
                return (
                  <div key={ki} onClick={() => goTo(4)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer", borderLeft: k.a ? `3px solid ${tc}` : "3px solid transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{k.n}</span><span style={{ fontSize: 16, fontWeight: 800, color: tc, fontFamily: "var(--mono)" }}>{k.v}</span></div>
                    {k.a && <div style={{ fontSize: 10, color: tc, fontWeight: 600 }}>⚠ {k.a}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: T.textMut }}><ArrowDown size={14} color={T.cyan} style={{ verticalAlign: "middle", marginRight: 6 }}/>Click any KPI for <strong style={{ color: T.cyan }}>Screen 4: Functional Lens</strong></div>
    </div>
  );
}

function Screen4({ goTo, defaultLens }: { goTo: (n: ScreenId) => void; defaultLens?: LensId }) {
  const [lens, setLens] = useState<LensId>(defaultLens ?? "ops");
  const lenses: Record<LensId, { label: string; icon: LucideIcon; color: string; cols: { t: string; items: [string, string, string, string][] }[] }> = { ops: { label: "Operations", icon: Activity, color: T.gold, cols: [
    { t: "Process Breakdown", items: [["Vol vs Capacity", "112%", "Exceeded 9–11 AM", T.red], ["Queue Depth", "847", "Peak: 10:15 AM", T.amber], ["SLA Adherence", "87%", "Below 95%", T.red], ["Backlog Age", "312 >48h", "Growing 8%/week", T.amber]] },
    { t: "Workforce Layer", items: [["Staffing Gap", "12 short", "10–12 PM window", T.red], ["AHT Trend", "8.3m ▲", "3rd week above target", T.amber], ["Agent Variation", "3.2× spread", "Best 4.1, Worst 13.2", T.amber], ["BPO Performance", "2.7× slower", "Evidence collection", T.red]] },
    { t: "Pattern Signals", items: [["Peak Spike", "9–11 AM", "32% over capacity", T.red], ["Region Skew", "Florida", "3× avg complaints", T.amber], ["Channel Shift", "Voice→Chat", "12% migration", T.cyan], ["Segment", "Premium", "Highest dissatisfaction", T.amber]] },
  ]}, risk: { label: "Risk", icon: Shield, color: T.red, cols: [
    { t: "Fraud Signals", items: [["Active Alerts", "69", "▲12 in 24h", T.red], ["Social Eng.", "23 calls", "FL seniors targeted", T.red], ["Card Testing", "89 cards", "MCC 7995 gaming", T.amber], ["ATO Attempts", "23", "Via contact centre", T.amber]] },
    { t: "System Risk", items: [["KYC API", "3× latency", "Since Tuesday", T.red], ["Payment Gateway", "0.4% errors", "Above 0.1%", T.amber], ["Retry Anomalies", "2,340", "Unusual auth pattern", T.amber], ["App Crashes", "847", "iOS password loop", T.amber]] },
    { t: "Exposure View", items: [["Customers Hit", "2,847", "All active events", T.red], ["Breach Cards", "1,247", "Reissuance 68%", T.red], ["Value at Risk", "$312K", "Merchant breach", T.red], ["Fraud Loss/Wk", "$47K", "MCC 7995", T.amber]] },
  ]}, compliance: { label: "Compliance", icon: Lock, color: T.purple, cols: [
    { t: "Complaint Risk", items: [["Backlog", "312 open", "28 new this week", T.red], ["SLA Breach", "43 cases", "Within 3 days", T.red], ["Escalation Delays", "7 cases", ">60% CFPB prob", T.red], ["Unactioned", "3", ">4 hours", T.amber]] },
    { t: "Reputation", items: [["Sentiment", "0.58 ▼", "Below 0.60 — 2nd wk", T.red], ["Social Velocity", "3.4×", "Backlash + competitor", T.red], ["App Store", "4.1 ▼0.2", "Dropped 30 days", T.amber], ["Cmpl→Social", "4.2%", "Posting after filing", T.amber]] },
    { t: "Regulatory", items: [["CFPB Risk", "7", ">60% escalation", T.red], ["Reg E Deadline", "43", "Provisional credit due", T.red], ["Doc Gaps", "12%", "Incomplete trails", T.amber], ["Compliance/Unit", "91%", "Cards 88%, Retail 94%", T.green]] },
  ]}};

  const L = lenses[lens];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {Object.entries(lenses).map(([id, l]) => {
          const Icon = l.icon;
          return (<button key={id} onClick={() => setLens(id as LensId)} style={{ background: lens === id ? `${l.color}12` : T.surface, border: `1px solid ${lens === id ? l.color : T.border}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: lens === id ? l.color : T.textSec, fontWeight: lens === id ? 700 : 500, fontSize: 13, fontFamily: "inherit" }}><Icon size={14}/> {l.label}</button>);
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {L.cols.map((col, ci) => (
          <Sec key={ci} title={col.t}>
            {col.items.map(([l, v, s, c], i) => (
              <div key={i} onClick={c === T.red ? () => goTo(5) : undefined} style={{ background: T.surface, border: `1px solid ${c === T.red ? `${T.red}28` : T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, cursor: c === T.red ? "pointer" : "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: T.text }}>{l}</span><span style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "var(--mono)" }}>{v}</span></div>
                <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{s}</div>
              </div>
            ))}
          </Sec>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: T.textMut }}>Click any <span style={{ color: T.red, fontWeight: 600 }}>red</span> metric for <strong style={{ color: T.cyan }}>Screen 5: Root Cause + Action</strong></div>
    </div>
  );
}

function Screen5({ data }: { data: RoleDashboardData }) {
  const incidents = [
    { sev: "critical", title: data.insights[0]?.split("—")[0] || "Critical Issue", what: data.insights[0] || "", where: { ch: "Voice + Digital", region: "National", product: "Retail Banking" }, why: [data.insights[0] || "", data.insights[1] || ""], impact: { cust: "2,847 impacted", fin: "$312K exposure", sla: "SLA breach — 3 days" },
      actions: [{ type: "fix", text: data.eisenhower.do[0] || "Fix primary issue" }, { type: "fix", text: data.eisenhower.do[1] || "Fix secondary issue" }, { type: "escalate", text: data.eisenhower.plan[0] || "Escalate to team" }, { type: "outreach", text: "Proactive customer notification for affected accounts" }] },
  ];
  if (data.insights[2]) {
    incidents.push({ sev: "warning", title: data.insights[2].split("—")[0] || "Warning", what: data.insights[2], where: { ch: "Multiple channels", region: "Specific cohort", product: "Retail Banking" }, why: [data.insights[2]], impact: { cust: "Cohort affected", fin: "Revenue / compliance risk", sla: "Monitoring required" },
      actions: [{ type: "fix", text: data.eisenhower.plan[1] || "Address root cause" }, { type: "escalate", text: "Escalate for review" }] });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.cyanGlow, border: `1px solid ${T.cyan}20`, borderRadius: 10, padding: "10px 16px", fontSize: 12, color: T.cyan, display: "flex", alignItems: "center", gap: 8 }}>
        <Crosshair size={14}/> <strong>Signal → Cause → Action.</strong> What happened, where, why, impact, and clear next steps.
      </div>
      {incidents.map((inc, i) => {
        const col = inc.sev === "critical" ? T.red : T.amber;
        return (
          <div key={i} style={{ background: T.card, border: `1px solid ${col}25`, borderRadius: 14, padding: 22, borderLeft: `4px solid ${col}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Badge color={inc.sev === "critical" ? "red" : "amber"}>{inc.sev}</Badge>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{inc.title}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>1. What Happened</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, background: T.surface, borderRadius: 8, padding: "10px 14px" }}>{inc.what}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>2. Where</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Channel", inc.where.ch], ["Region", inc.where.region], ["Product", inc.where.product]].map(([l, v], j) => (
                  <div key={j} style={{ background: T.surface, borderRadius: 8, padding: "8px 12px" }}><div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{v}</div></div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 1 }}>3. Why</span><Badge color="gold">AI Root Cause</Badge></div>
              {inc.why.filter(Boolean).map((w, j) => (
                <div key={j} style={{ background: T.surface, border: `1px solid ${T.amber}15`, borderRadius: 8, padding: "8px 14px", marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: T.amberGlow, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{j + 1}</span>
                  <span style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>4. Impact</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Customers", inc.impact.cust, T.amber], ["Financial", inc.impact.fin, T.red], ["SLA", inc.impact.sla, T.amber]].map(([l, v, c], j) => (
                  <div key={j} style={{ background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 8, padding: "8px 12px" }}><div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", marginBottom: 2 }}>{l}</div><div style={{ fontSize: 13, color: c, fontWeight: 700 }}>{v}</div></div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 1 }}>5. Actions</span><Badge color="teal">AI-Proposed</Badge></div>
              {inc.actions.map((a, j) => {
                const ac = a.type === "fix" ? T.cyan : a.type === "escalate" ? T.amber : T.green;
                return (
                  <div key={j} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: `${ac}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {a.type === "fix" ? <CheckCircle size={12} color={ac}/> : a.type === "escalate" ? <AlertTriangle size={12} color={ac}/> : <MessageCircle size={12} color={ac}/>}
                    </div>
                    <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{a.text}</span>
                    <Badge color={a.type === "fix" ? "teal" : a.type === "escalate" ? "amber" : "green"}>{a.type}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════
// DASHBOARD SHELL (per role route)
// ═══════════════════════════

export function RoleDashboardView({ industry, role, onExit }: { industry: Industry; role: Role; onExit: () => void }) {
  const [screen, setScreen] = useState<ScreenId>(1);
  const roleDataMap = ROLE_DATA as Record<string, RoleDashboardData>;
  const data = roleDataMap[role.id] ?? ROLE_DATA.ceo;

  if (industry.id === "credit_cards" && role.id === "head_cards") {
    return (
      <CardOpsDashboard
        industryName={industry.name}
        roleName={role.name}
        industryColor={industry.color}
        onExit={onExit}
      />
    );
  }
  const IndIcon = industry.icon;
  const RoleIcon = role.icon;
  const active = SCREENS.find(s => s.id === screen);
  const initialLens: LensId =
    "defaultLens" in role &&
    (role.defaultLens === "ops" || role.defaultLens === "risk" || role.defaultLens === "compliance")
      ? role.defaultLens
      : "ops";

  const screenComponents: Record<ScreenId, ReactElement> = {
    1: <Screen1 data={data} goTo={setScreen} />,
    2: <Screen2 data={data} goTo={setScreen} />,
    3: <Screen3 goTo={setScreen} />,
    4: <Screen4 goTo={setScreen} defaultLens={initialLens} />,
    5: <Screen5 data={data} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: 230, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.cyan, letterSpacing: 2.5, textTransform: "uppercase" }}>Yaaralabs</div>
          <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>Fluid Intelligence</div>
        </div>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><div style={{ width: 24, height: 24, borderRadius: 6, background: `${industry.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><IndIcon size={12} color={industry.color}/></div><span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{industry.name}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 24, height: 24, borderRadius: 6, background: `${industry.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}><RoleIcon size={12} color={industry.color}/></div><span style={{ fontSize: 11, fontWeight: 600, color: T.cyan }}>{role.name}</span></div>
        </div>
        <div style={{ padding: "10px 8px", flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMut, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>Drill-Down</div>
          {SCREENS.map((s, i) => {
            const Icon = s.icon; const act = screen === s.id;
            return (
              <div key={s.id}>
                <button onClick={() => setScreen(s.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", width: "100%", textAlign: "left", background: act ? T.cyanGlow : "transparent", border: "none", borderRadius: 8, cursor: "pointer", borderLeft: act ? `3px solid ${T.cyan}` : "3px solid transparent" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: act ? T.cyanGlow : `${T.textMut}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={11} color={act ? T.cyan : T.textMut}/></div>
                  <div><div style={{ fontSize: 11, fontWeight: act ? 700 : 500, color: act ? T.text : T.textSec }}><span style={{ color: act ? T.cyan : T.textMut, fontFamily: "var(--mono)", marginRight: 4, fontSize: 10 }}>{s.id}.</span>{s.label}</div><div style={{ fontSize: 9, color: T.textMut }}>{s.sub}</div></div>
                </button>
                {i < SCREENS.length - 1 && <div style={{ textAlign: "center", color: T.border, fontSize: 9, padding: "1px 0" }}>↓</div>}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={onExit} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: T.textSec, fontSize: 11, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}><ArrowLeft size={11}/> Change Role</button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}><span style={{ color: T.cyan, fontFamily: "var(--mono)", marginRight: 8 }}>Screen {active?.id}</span>{active?.label}</h1>
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{industry.name} · {role.name} · {active?.sub}</div>
          </div>
          <button style={{ background: `linear-gradient(135deg, ${T.cyan}, ${T.green})`, color: T.bg, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Export Report</button>
        </div>
        <div style={{ flex: 1, padding: "18px 22px", overflowY: "auto" }}>{screenComponents[screen]}</div>
      </div>
    </div>
  );
}
