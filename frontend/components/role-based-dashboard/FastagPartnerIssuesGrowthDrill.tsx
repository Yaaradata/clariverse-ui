"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { getPartnerIssuesForPeriod } from "@/lib/fastag-partner-issues/period-data";
import {
  FastagDrillCanvas,
  FastagDrillPanel,
  FastagSectionBadge,
  FastagTableScroll,
  useFastagDrillTokens,
  type FastagDrillTokens,
} from "./fastag-drill-ui";
import { STATE_MAP_BY_CODE } from "@/lib/fastag-business-performance/state-map-data";
import { FastagIndiaStateFilter } from "./FastagIndiaStateFilter";
import { useFastagPeriod } from "./FastagPeriodContext";

type Palette = FastagDrillTokens & { panel: string; panelAlt: string; card: string; cardEnd: string; textDim: string; textFaint: string; borderSoft: string; blue: string };

const BREAKDOWN = [
  { cat: "Double deduction", pct: 27, d: "+38%", tone: "red" as const },
  { cat: "Recharge failure", pct: 22, d: "+24%", tone: "red" as const },
  { cat: "Blacklist / low balance", pct: 19, d: "+62%", tone: "amber" as const },
  { cat: "KYC / activation", pct: 14, d: "+17%", tone: "amber" as const },
  { cat: "Plaza mis-read", pct: 10, d: "+9%", tone: "blue" as const },
  { cat: "Others", pct: 8, d: "-3%", tone: "faint" as const },
] as const;

const SLA_KPI = [
  { label: "Resolved in Promise", v: "51%", sub: "target 80%", tone: "red" as const },
  { label: "Beyond SLA", v: "56", sub: "cases overdue", tone: "amber" as const },
  { label: "Avg Resolution", v: "78h", sub: "vs 48h promise", tone: "red" as const },
  { label: "Repeat Contact", v: "44%", sub: "+6 pts WoW", tone: "amber" as const },
] as const;

const PARTNERS = [
  { name: "Acquirer Bank A", role: "Toll acquirer", sla: 62, err: "4.8%", cases: "640", exp: "₹22L", sev: "Critical" },
  { name: "Payment Gateway", role: "Recharge / UPI", sla: 71, err: "3.1%", cases: "410", exp: "₹14L", sev: "High" },
  { name: "Issuing Bank B", role: "Tag issuance", sla: 88, err: "1.2%", cases: "120", exp: "₹4L", sev: "Watch" },
  { name: "BPO Vendor Beta", role: "KYC / support", sla: 58, err: "6.0%", cases: "310", exp: "₹11L", sev: "Critical" },
] as const;

const SENTIMENT = [40, 44, 42, 50, 48, 58, 62, 70, 66, 78, 84];

const ROOTCAUSE = [
  { cause: "Plaza reader / acquirer reconciliation", share: 34, tone: "red" as const },
  { cause: "Payment gateway timeouts", share: 26, tone: "amber" as const },
  { cause: "Vendor KYC backlog", share: 22, tone: "amber" as const },
  { cause: "Process / first-response gap", share: 18, tone: "blue" as const },
] as const;

const ACTIONS = [
  { act: "Auto-reverse duplicate charges + acquirer reconciliation SLA", owner: "Ops + Acquirer A", impact: "₹47L recovered, churn −high", sev: "Critical" },
  { act: "Fail-over gateway + proactive recharge-fail notifications", owner: "Payments", impact: "₹28L protected", sev: "Critical" },
  { act: "KAM retention outreach to 12 at-risk fleet accounts", owner: "Sales / KAM", impact: "₹4.2M spend retained", sev: "Critical" },
  { act: "Publish auto-recharge FAQ + influencer comms on blacklist", owner: "Marketing / CX", impact: "Reputation + new-acq drag", sev: "High" },
  { act: "Reroute high-value KYC off Vendor Beta to in-house pod", owner: "CX Ops", impact: "₹18L activation unblocked", sev: "High" },
] as const;

function toneColor(p: Palette, tone: "red" | "amber" | "green" | "blue" | "faint") {
  if (tone === "red") return p.red;
  if (tone === "amber") return p.amber;
  if (tone === "green") return p.green;
  if (tone === "blue") return p.blue;
  return p.textFaint;
}

function sevColor(p: Palette, s: string) {
  return s === "Critical" ? p.red : s === "High" ? p.amber : p.green;
}

function toPalette(t: FastagDrillTokens): Palette {
  return {
    ...t,
    panel: t.surface,
    panelAlt: t.surface2,
    card: t.surface,
    cardEnd: t.bg2,
    textDim: t.dim,
    textFaint: t.faint,
    borderSoft: t.border2,
    blue: "#4aa8ff",
  };
}

function TrendLine({ data, color, h = 90 }: { data: number[]; color: string; h?: number }) {
  const w = 760;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const sx = w / (data.length - 1);
  const y = (v: number) => h - 10 - ((v - min) / (max - min || 1)) * (h - 24);
  const pts = data.map((v, i) => [i * sx, y(v)] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i += 1) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cxm = (x0 + x1) / 2;
    d += ` C ${cxm} ${y0}, ${cxm} ${y1}, ${x1} ${y1}`;
  }
  const gradId = `tl-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" />
      {pts.map(([x, yy], i) =>
        i === pts.length - 1 ? <circle key={i} cx={x - 1} cy={yy} r="3.5" fill={color} /> : null,
      )}
    </svg>
  );
}

function SectionHead({ p, n, title, right }: { p: Palette; n: string; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 7,
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            fontWeight: 700,
            background: "rgba(255,77,82,0.13)",
            color: p.red,
          }}
        >
          {n}
        </span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: p.text }}>{title}</h3>
      </div>
      {right}
    </div>
  );
}

function tableHead(p: Palette, text: string) {
  return (
    <th
      key={text}
      style={{
        fontSize: 10,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: p.textFaint,
        textAlign: "left",
        padding: "0 10px 9px",
        fontWeight: 600,
      }}
    >
      {text}
    </th>
  );
}

type PartnerPeriodData = ReturnType<typeof getPartnerIssuesForPeriod>;

function ScoreHeader({ p, data }: { p: Palette; data: PartnerPeriodData }) {
  return (
    <FastagDrillPanel tokens={p} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,77,82,0.13)",
            color: p.red,
            fontSize: 15,
          }}
        >
          ♥
        </span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: p.text }}>Are customer &amp; partner issues affecting growth?</div>
          <div style={{ fontSize: 10, marginTop: 4, textTransform: "uppercase", letterSpacing: 1.2, color: p.textFaint }}>
            Complaints · Resolution · Partner SLA · Churn linkage
          </div>
        </div>
      </div>

      <div className="fastag-drill-score-row">
        <div>
          <div style={{ fontSize: "clamp(40px, 5vw, 52px)", fontWeight: 700, lineHeight: 1, color: p.text, fontFamily: "var(--font-mono)" }}>{data.serviceScore}</div>
          <div style={{ color: p.red, fontSize: 13, fontWeight: 600, marginTop: 6 }}>
            {data.scoreDelta >= 0 ? `+${data.scoreDelta}` : `▼ ${Math.abs(data.scoreDelta)}`} pts WoW
          </div>
          <div style={{ color: p.textFaint, fontSize: 11, marginTop: 4 }}>Service-health index · {data.periodLabel}</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <TrendLine data={data.trend} color={p.red} />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          borderTop: `1px solid ${p.borderSoft}`,
          borderRight: `1px solid ${p.borderSoft}`,
          borderBottom: `1px solid ${p.borderSoft}`,
          borderLeft: `2px solid ${p.red}`,
          borderRadius: 11,
          padding: "12px 13px 12px 15px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.015), transparent)",
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.red, marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
          <span>▦</span> WHY IT MOVED
        </div>
        <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.55 }}>
          The {Math.abs(data.scoreDelta)}-point shift in {data.periodLabel} is driven by rising double-deduction refunds and blacklist-on-low-balance disputes, compounded by acquirer reconciliation delays.{" "}
          <span style={{ color: p.text }}>
            ₹1.33Cr of spend is now exposed across 12 at-risk fleet accounts
          </span>
          , making resolution friction a direct growth risk — not just a service metric.
        </div>
      </div>
    </FastagDrillPanel>
  );
}

function ImpactMap({ p, rows }: { p: Palette; rows: PartnerPeriodData["impact"] }) {
  return (
    <FastagDrillPanel tokens={p} style={{ marginBottom: 18 }}>
      <SectionHead
        p={p}
        n="1"
        title="Issue → growth impact"
        right={<span style={{ color: p.textFaint, fontSize: 10.5 }}>ranked by spend at risk · WoW</span>}
      />
      <FastagTableScroll>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {tableHead(p, "Issue type")}
            {tableHead(p, "Complaints")}
            {tableHead(p, "Customers / tags affected")}
            {tableHead(p, "Spend at risk")}
            {tableHead(p, "Churn correlation")}
            {tableHead(p, "Severity")}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.issue}>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, fontWeight: 600, color: p.text }}>{r.issue}</td>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.text }}>
                {r.vol} <span style={{ color: p.red, fontSize: 11, fontWeight: 600 }}>↑{r.volD}</span>
              </td>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.textDim }}>{r.affected}</td>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.red, fontWeight: 700 }}>{r.risk}</td>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}` }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 20,
                    fontWeight: 600,
                    background: r.churn === "High" ? "rgba(255,77,82,0.15)" : r.churn === "Med" ? "rgba(245,166,35,0.15)" : "rgba(128,128,128,0.12)",
                    color: r.churn === "High" ? p.red : r.churn === "Med" ? p.amber : p.textDim,
                  }}
                >
                  {r.churn}
                </span>
              </td>
              <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}` }}>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    padding: "4px 8px",
                    borderRadius: 6,
                    display: "inline-flex",
                    color: sevColor(p, r.sev),
                    background: `${sevColor(p, r.sev)}1f`,
                    borderTop: `1px solid ${sevColor(p, r.sev)}55`,
                    borderRight: `1px solid ${sevColor(p, r.sev)}55`,
                    borderBottom: `1px solid ${sevColor(p, r.sev)}55`,
                    borderLeft: `1px solid ${sevColor(p, r.sev)}55`,
                  }}
                >
                  {r.sev}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </FastagTableScroll>
    </FastagDrillPanel>
  );
}

function BreakdownCard({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p}>
      <SectionHead p={p} n="2" title="Complaint & dispute breakdown" />
      {BREAKDOWN.map((b) => (
        <div key={b.cat} style={{ marginBottom: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: p.text }}>{b.cat}</span>
            <span style={{ fontSize: 11.5 }}>
              <span style={{ fontWeight: 700, color: p.text }}>{b.pct}%</span>
              <span style={{ color: b.d.startsWith("-") ? p.green : p.red, fontSize: 10.5, marginLeft: 6, fontWeight: 600 }}>{b.d}</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 5, background: "rgba(128,128,128,0.12)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 5, width: `${b.pct * 3.4}%`, background: toneColor(p, b.tone) }} />
          </div>
        </div>
      ))}
      <div style={{ color: p.textFaint, fontSize: 10.5, marginTop: 4 }}>Share of total complaint volume · last 7 days</div>
    </FastagDrillPanel>
  );
}

function SlaSummaryCard({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p}>
      <SectionHead p={p} n="3" title="Resolution / SLA summary" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {SLA_KPI.map((k) => (
          <div
            key={k.label}
            style={{
              padding: "12px 14px",
              borderTop: `1px solid ${p.borderSoft}`,
              borderRight: `1px solid ${p.borderSoft}`,
              borderBottom: `1px solid ${p.borderSoft}`,
              borderLeft: `1px solid ${p.borderSoft}`,
              borderRadius: 11,
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.textFaint }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, marginTop: 7, color: toneColor(p, k.tone) }}>{k.v}</div>
            <div style={{ color: p.textFaint, fontSize: 10, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ color: p.textFaint, fontSize: 10.5, marginTop: 12 }}>High-level only — detailed queue / agent view lives in the CX board.</div>
    </FastagDrillPanel>
  );
}

function PartnerScorecard({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p} style={{ marginBottom: 18 }}>
      <SectionHead p={p} n="4" title="Partner / acquirer scorecard" right={<span style={{ color: p.textFaint, fontSize: 10.5 }}>who is the bottleneck</span>} />
      <FastagTableScroll>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {tableHead(p, "Partner")}
            {tableHead(p, "Role")}
            {tableHead(p, "SLA adherence")}
            {tableHead(p, "Error / recon rate")}
            {tableHead(p, "Attributable cases")}
            {tableHead(p, "Business exposure")}
            {tableHead(p, "Status")}
          </tr>
        </thead>
        <tbody>
          {PARTNERS.map((row) => {
            const col = row.sla >= 85 ? p.green : row.sla >= 70 ? p.amber : p.red;
            return (
              <tr key={row.name}>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, fontWeight: 600, color: p.text }}>{row.name}</td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.textDim }}>{row.role}</td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ height: 8, borderRadius: 5, background: "rgba(128,128,128,0.12)", overflow: "hidden", flex: 1 }}>
                      <div style={{ height: "100%", borderRadius: 5, width: `${row.sla}%`, background: col }} />
                    </div>
                    <span style={{ minWidth: 30, fontSize: 11.5, fontWeight: 700, color: col }}>{row.sla}%</span>
                  </div>
                </td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.text }}>{row.err}</td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.text }}>{row.cases}</td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}`, color: p.red, fontWeight: 700 }}>{row.exp}</td>
                <td style={{ fontSize: 12.5, padding: "11px 10px", borderTop: `1px solid ${p.borderSoft}` }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      padding: "4px 8px",
                      borderRadius: 6,
                      display: "inline-flex",
                      color: sevColor(p, row.sev),
                      background: `${sevColor(p, row.sev)}1f`,
                      borderTop: `1px solid ${sevColor(p, row.sev)}55`,
                      borderRight: `1px solid ${sevColor(p, row.sev)}55`,
                      borderBottom: `1px solid ${sevColor(p, row.sev)}55`,
                      borderLeft: `1px solid ${sevColor(p, row.sev)}55`,
                    }}
                  >
                    {row.sev}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </FastagTableScroll>
    </FastagDrillPanel>
  );
}

function ChurnLinkageCard({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p}>
      <SectionHead p={p} n="5" title="Churn & at-risk linkage" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${p.borderSoft}`, borderRight: `1px solid ${p.borderSoft}`, borderBottom: `1px solid ${p.borderSoft}`, borderLeft: `1px solid ${p.borderSoft}`, borderRadius: 11 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.textFaint }}>At-Risk Accounts</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 7, color: p.text }}>
            12 <span style={{ fontSize: 12, fontWeight: 400, color: p.textDim }}>fleets</span>
          </div>
          <div style={{ color: p.red, fontSize: 10.5, marginTop: 3, fontWeight: 600 }}>↑ 5 WoW</div>
        </div>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${p.borderSoft}`, borderRight: `1px solid ${p.borderSoft}`, borderBottom: `1px solid ${p.borderSoft}`, borderLeft: `1px solid ${p.borderSoft}`, borderRadius: 11 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.textFaint }}>Spend at Risk</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 7, color: p.red }}>₹4.2M</div>
          <div style={{ color: p.red, fontSize: 10.5, marginTop: 3, fontWeight: 600 }}>↑ 56%</div>
        </div>
      </div>
      <div style={{ color: p.textDim, fontSize: 11.5, lineHeight: 1.55 }}>
        Closure-intent signals rose from 7 → 18 cases, concentrated in accounts with unresolved double-deduction and recharge-failure tickets. Retention window:{" "}
        <span style={{ color: p.amber }}>act within 48h</span>.
      </div>
    </FastagDrillPanel>
  );
}

function ReputationCard({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p}>
      <SectionHead p={p} n="6" title="Reputation / sentiment" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ color: p.textDim, fontSize: 11.5 }}>Negative-mention volume (48h)</span>
        <span style={{ color: p.red, fontSize: 12, fontWeight: 600 }}>#FASTagFail ↑ 287%</span>
      </div>
      <TrendLine data={SENTIMENT} color={p.amber} h={70} />
      <div style={{ color: p.textDim, fontSize: 11.5, lineHeight: 1.5, marginTop: 8 }}>
        Reputation drag suppresses <span style={{ color: p.text }}>new tag acquisition</span>, not just service — making this a growth signal. Blacklist narrative leads, reach est. 1.8M.
      </div>
    </FastagDrillPanel>
  );
}

function RootCauseActions({ p }: { p: Palette }) {
  return (
    <FastagDrillPanel tokens={p}>
      <SectionHead p={p} n="7" title="Root-cause clusters & recommended actions" />
      <div className="fastag-drill-2col" style={{ gap: 20 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.textFaint, marginBottom: 12 }}>Where issues originate</div>
          {ROOTCAUSE.map((r) => (
            <div key={r.cause} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, color: p.text }}>{r.cause}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: p.text }}>{r.share}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: "rgba(128,128,128,0.12)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 5, width: `${r.share * 2.6}%`, background: toneColor(p, r.tone) }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: p.textFaint, marginBottom: 12 }}>Prioritized actions</div>
          {ACTIONS.map((a, i) => (
            <div
              key={a.act}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "9px 0",
                borderTop: i ? `1px solid ${p.borderSoft}` : "none",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: sevColor(p, a.sev), marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, lineHeight: 1.4, color: p.text }}>{a.act}</div>
                <div style={{ color: p.textFaint, fontSize: 10, marginTop: 3 }}>
                  {a.owner} · <span style={{ color: p.green }}>{a.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FastagDrillPanel>
  );
}

export function FastagPartnerIssuesGrowthDrill() {
  const p = toPalette(useFastagDrillTokens());
  const { period } = useFastagPeriod();
  const periodData = useMemo(() => getPartnerIssuesForPeriod(period), [period]);
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const regionLabel = selectedStateCode ? STATE_MAP_BY_CODE[selectedStateCode]?.name : "All India";

  return (
    <FastagDrillCanvas tokens={p}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ width: "100%" }}>
        <ScoreHeader p={p} data={periodData} />
        <div style={{ marginBottom: 18 }}>
          <FastagIndiaStateFilter
            tokens={p}
            selectedStateCode={selectedStateCode}
            onSelectState={setSelectedStateCode}
            compact
          />
          <div style={{ marginTop: 8, fontSize: 11, color: p.textFaint }}>
            Viewing service-health signals for <span style={{ color: p.text, fontWeight: 600 }}>{regionLabel}</span>
            {selectedStateCode ? " · state-level RTO filter applied" : " · pick a state to narrow partner and complaint context"}
          </div>
        </div>
        <ImpactMap p={p} rows={periodData.impact} />
        <div className="fastag-drill-2col" style={{ marginBottom: 18 }}>
          <BreakdownCard p={p} />
          <SlaSummaryCard p={p} />
        </div>
        <PartnerScorecard p={p} />
        <div className="fastag-drill-2col" style={{ marginBottom: 18 }}>
          <ChurnLinkageCard p={p} />
          <ReputationCard p={p} />
        </div>
        <RootCauseActions p={p} />
      </motion.div>
    </FastagDrillCanvas>
  );
}
