"use client";

import { useState, useEffect, type ReactNode, type CSSProperties, type ComponentType } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from "recharts";
import type { LucideIcon } from "lucide-react";
import { Activity, Shield, Globe, Bell, Zap, Target, CreditCard, DollarSign, FileText, AlertTriangle, Percent, ExternalLink, Layers, AlertCircle, ArrowLeft } from "lucide-react";

export type CardOpsDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

const T = {
  bg: "#04080f", surface: "#0a1220", card: "#0e1830",
  elevated: "#142040", border: "#1a2d50", borderLight: "#243a60",
  cyan: "#06b6d4", cyanGlow: "rgba(6,182,212,0.12)",
  gold: "#eab308", goldGlow: "rgba(234,179,8,0.12)",
  green: "#22c55e", greenGlow: "rgba(34,197,94,0.1)",
  red: "#ef4444", redGlow: "rgba(239,68,68,0.1)",
  amber: "#f59e0b", amberGlow: "rgba(245,158,11,0.1)",
  teal: "#14b8a6", tealGlow: "rgba(20,184,166,0.1)",
  purple: "#a78bfa", purpleGlow: "rgba(167,139,250,0.1)",
  blue: "#3b82f6", blueGlow: "rgba(59,130,246,0.1)",
  text: "#e2e8f0", textSec: "#94a3b8", textMut: "#5e718a", white: "#fff",
};

// Tabs — fundamentally different structure from retail banking
type CardTabId = "promise" | "external" | "internal" | "portfolio" | "signals";

const TABS: { id: CardTabId; label: string; sub: string; icon: LucideIcon }[] = [
  { id: "promise", label: "Promise Scorecard", sub: "External ↔ Internal Gap", icon: Target },
  { id: "external", label: "External Intelligence", sub: "Market, Ranking & Perception", icon: Globe },
  { id: "internal", label: "Internal Operations", sub: "Process, Throughput & Quality", icon: Layers },
  { id: "portfolio", label: "Portfolio & Risk", sub: "Fraud, Delinquency & P&L", icon: Shield },
  { id: "signals", label: "Signals & Alerts", sub: "Anomalies, Journeys & Churn", icon: AlertTriangle },
];

const tt = { background: T.elevated, border: `1px solid ${T.borderLight}`, borderRadius: 8, fontSize: 11, color: T.text, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" };

type CardBadgeColor = "red" | "amber" | "green" | "teal" | "purple" | "blue" | "gold" | "cyan";

function Badge({ color = "blue", children }: { color?: CardBadgeColor; children: ReactNode }) {
  const m: Record<CardBadgeColor, [string, string]> = { red: [T.red, T.redGlow], amber: [T.amber, T.amberGlow], green: [T.green, T.greenGlow], teal: [T.teal, T.tealGlow], purple: [T.purple, T.purpleGlow], blue: [T.blue, T.blueGlow], gold: [T.gold, T.goldGlow], cyan: [T.cyan, T.cyanGlow] };
  const [fg, bg] = m[color] ?? m.blue;
  return <span style={{ background: bg, color: fg, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>;
}

function Sec({ title, sub, action, children, style: sx }: { title: string; sub?: ReactNode; action?: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, ...sx }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: -0.2 }}>{title}</div>{sub && <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{sub}</div>}</div>
        {action}
      </div>{children}
    </div>
  );
}

function KPI({ label, value, unit, delta, target, status, icon: Icon, sub }: { label: string; value: string | number; unit?: string; delta?: number; target?: string; status: "red" | "amber" | "green" | "neutral"; icon?: LucideIcon; sub?: string }) {
  const col = status === "red" ? T.red : status === "amber" ? T.amber : status === "green" ? T.green : T.text;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, borderTop: `2px solid ${col}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: T.textMut, letterSpacing: 0.6, textTransform: "uppercase" }}>{label}</span>
        {Icon && <div style={{ width: 24, height: 24, borderRadius: 6, background: `${col}12`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={12} color={col}/></div>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: col, fontFamily: "var(--mono)", lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: T.textMut }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10, color: T.textSec, marginTop: 4 }}>{sub}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {delta !== undefined && <span style={{ fontSize: 11, fontWeight: 600, color: delta >= 0 ? (status === "green" ? T.green : T.red) : (status === "red" ? T.green : T.red), display: "flex", alignItems: "center", gap: 3 }}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}</span>}
        {target && <span style={{ fontSize: 10, color: T.textMut }}>Target: {target}</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// TAB 1: PROMISE SCORECARD
// External ↔ Internal gap analysis
// ═══════════════════════════════════
function ScreenPromise() {
  const extScore = 62, intScore = 71, gap = intScore - extScore;
  const gC = (s: number) => (s >= 80 ? T.green : s >= 60 ? T.amber : T.red);

  const radarData = [
    { dim: "Fraud Safety", ext: 58, int: 74 },
    { dim: "Dispute Speed", ext: 55, int: 68 },
    { dim: "Reward Value", ext: 48, int: 72 },
    { dim: "Ease of Use", ext: 72, int: 82 },
    { dim: "Collections Tone", ext: 65, int: 60 },
  ];

  const brandScores = [
    { brand: "Premium Travel", ext: 52, int: 68, gap: -16, issue: "NerdWallet dropped #2→#3. Reward devaluation backlash.", status: "red" },
    { brand: "Cashback Plus", ext: 74, int: 78, gap: -4, issue: "Strong external. Competitor 5% offer threatening.", status: "amber" },
    { brand: "Business Card", ext: 65, int: 71, gap: -6, issue: "Comparison ranking stable. Low influencer coverage.", status: "amber" },
    { brand: "Student Card", ext: 78, int: 82, gap: -4, issue: "Best external perception. Strong TikTok presence.", status: "green" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero: External vs Internal scores */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
        {/* External Score */}
        <div style={{ background: `linear-gradient(135deg, ${T.card}, #1a1030)`, border: `1px solid ${T.purple}30`, borderRadius: "14px 0 0 14px", padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <ExternalLink size={14} color={T.purple}/>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.purple, letterSpacing: 2, textTransform: "uppercase" }}>External Perception</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: gC(extScore), fontFamily: "var(--mono)", lineHeight: 1 }}>{extScore}</div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>Market ranking, social sentiment, review sites</div>
          <div style={{ fontSize: 10, color: T.textMut, marginTop: 4 }}>What customers & the market think of us</div>
        </div>

        {/* Gap Indicator */}
        <div style={{ background: T.elevated, width: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "20px 12px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMut, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Gap</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: gap > 0 ? T.amber : T.red, fontFamily: "var(--mono)", lineHeight: 1 }}>{gap > 0 ? "+" : ""}{gap}</div>
          <div style={{ width: 40, height: 3, background: T.border, borderRadius: 2, margin: "10px 0" }}/>
          <div style={{ fontSize: 9, color: T.amber, textAlign: "center", lineHeight: 1.4 }}>Internal ops outperforming external perception</div>
        </div>

        {/* Internal Score */}
        <div style={{ background: `linear-gradient(135deg, ${T.card}, #0a1a20)`, border: `1px solid ${T.teal}30`, borderRadius: "0 14px 14px 0", padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Layers size={14} color={T.teal}/>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: 2, textTransform: "uppercase" }}>Internal Performance</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: gC(intScore), fontFamily: "var(--mono)", lineHeight: 1 }}>{intScore}</div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>Dispute speed, quality, throughput, fraud response</div>
          <div style={{ fontSize: 10, color: T.textMut, marginTop: 4 }}>How we're actually performing operationally</div>
        </div>
      </div>

      {/* Insight bar */}
      <div style={{ background: T.amberGlow, border: `1px solid ${T.amber}20`, borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <Zap size={14} color={T.amber}/>
        <span style={{ fontSize: 12, color: T.amber }}><strong>Key Insight:</strong> Internal ops score (71) is 9 points above external perception (62). The gap means customers aren't experiencing the improvements you've made — or social/review signals haven't caught up. Focus: external comms + comparison site positioning.</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Radar: External vs Internal by dimension */}
        <Sec title="Promise Dimensions — External vs Internal" sub="Where perception lags reality (and vice versa)">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={T.border}/>
              <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: T.textSec }}/>
              <PolarRadiusAxis tick={{ fontSize: 9, fill: T.textMut }} domain={[0, 100]} stroke={T.border}/>
              <Radar name="External" dataKey="ext" stroke={T.purple} fill={T.purple} fillOpacity={0.15} strokeWidth={2}/>
              <Radar name="Internal" dataKey="int" stroke={T.teal} fill={T.teal} fillOpacity={0.15} strokeWidth={2}/>
              <Tooltip contentStyle={tt}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 10 }}>
            <span style={{ color: T.purple }}>● External Perception</span>
            <span style={{ color: T.teal }}>● Internal Performance</span>
          </div>
        </Sec>

        {/* Per-brand External vs Internal */}
        <Sec title="Brand-Level Scorecard" sub="Per Sowmya: which brands doing well? Which are dragging score down?">
          {brandScores.map((b, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, borderLeft: `3px solid ${b.status === "red" ? T.red : b.status === "amber" ? T.amber : T.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{b.brand}</span>
                <Badge color={b.status as CardBadgeColor}>{b.status === "red" ? "Needs Action" : b.status === "amber" ? "Watch" : "Healthy"}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 8 }}>
                {([
                  ["External", b.ext, T.purple],
                  ["Internal", b.int, T.teal],
                  ["Gap", b.gap, b.gap < -10 ? T.red : T.amber],
                ] as const satisfies readonly (readonly [string, number, string])[]).map(([l, v, c], j) => (
                  <div key={j}>
                    <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: c, fontFamily: "var(--mono)" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: T.textSec }}>{b.issue}</div>
            </div>
          ))}
        </Sec>
      </div>

      {/* AI Time Saved + Quick KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KPI label="Revenue / Active Card" value="$487" unit="/yr" delta={-12} target="> $500" status="amber" icon={DollarSign} sub="Interchange + fees + interest"/>
        <KPI label="Net Charge-Off Rate" value="3.8" unit="%" delta={0.3} target="< 3.5%" status="red" icon={Percent} sub="Portfolio credit losses"/>
        <KPI label="Dispute Backlog" value="1,847" delta={312} target="< 1,200" status="red" icon={FileText} sub="Open disputes growing"/>
        <KPI label="Social Sentiment" value="0.52" delta={-0.08} target="> 0.65" status="red" icon={Globe} sub="Dragged by reward backlash"/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// TAB 2: EXTERNAL INTELLIGENCE
// Market position, rankings, competitors
// ═══════════════════════════════════
function ScreenExternal() {
  const rankings = [
    { site: "NerdWallet", cat: "Best Travel Cards", rank: 3, prev: 2, change: "down", competitor: "CompetitorZ took #2 with new sign-up bonus" },
    { site: "Bankrate", cat: "Best Cashback Cards", rank: 5, prev: 4, change: "down", competitor: "CompetitorY 5% unlimited cashback" },
    { site: "NerdWallet", cat: "Best Student Cards", rank: 2, prev: 2, change: "same", competitor: "Holding position. Strong campus presence." },
    { site: "The Points Guy", cat: "Best Business Cards", rank: 4, prev: 5, change: "up", competitor: "Rose due to enhanced travel protections" },
    { site: "WalletHub", cat: "Best No-Fee Cards", rank: 7, prev: 6, change: "down", competitor: "Three new entrants from fintechs" },
  ];

  const competitors = [
    { name: "CompetitorY", offer: "5% unlimited cashback", launched: "3 weeks ago", ourCallers: 412, segment: "High-spenders ($2K+/mo)", threat: "high" },
    { name: "CompetitorZ", offer: "100K sign-up bonus + 3x travel", launched: "2 weeks ago", ourCallers: 189, segment: "Premium travelers", threat: "high" },
    { name: "Fintech A", offer: "No-fee metal card + 2% all", launched: "6 weeks ago", ourCallers: 67, segment: "Gen Z / millennials", threat: "medium" },
  ];

  const influencers = [
    { platform: "YouTube", mentions: 23, positive: 8, negative: 12, neutral: 3, topCreator: "@CreditCardGuru (1.2M subs)", topTopic: "Reward devaluation comparison" },
    { platform: "TikTok", mentions: 47, positive: 28, negative: 11, neutral: 8, topCreator: "@FinanceBro (840K)", topTopic: "Student card #1 recommendation" },
    { platform: "Twitter/X", mentions: 890, positive: 210, negative: 480, neutral: 200, topCreator: "@FinanceInfluencer (84K)", topTopic: "\"CompetitorY's cashback is better\"" },
    { platform: "Reddit", mentions: 340, positive: 80, negative: 190, neutral: 70, topCreator: "r/CreditCards", topTopic: "Point devaluation math thread (3.4K upvotes)" },
  ];

  const sentTrend = [
    { w: "W1", ours: 0.68, comp: 0.62 }, { w: "W2", ours: 0.65, comp: 0.65 },
    { w: "W3", ours: 0.58, comp: 0.68 }, { w: "W4", ours: 0.52, comp: 0.71 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.purpleGlow, border: `1px solid ${T.purple}20`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <ExternalLink size={14} color={T.purple}/>
        <span style={{ fontSize: 12, color: T.purple }}><strong>External View:</strong> What the market, comparison sites, influencers, and social media say about our card products. This is the perception your CEO sees.</span>
      </div>

      {/* Comparison Site Rankings */}
      <Sec title="Comparison Site Rankings" sub="NerdWallet, Bankrate, Points Guy, WalletHub — where do our cards rank?">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rankings.map((r, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "grid", gridTemplateColumns: "120px 160px 80px 80px 1fr", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.cyan }}>{r.site}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{r.cat}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: r.rank <= 3 ? T.green : r.rank <= 5 ? T.amber : T.red, fontFamily: "var(--mono)" }}>#{r.rank}</span>
              </div>
              <span style={{ fontSize: 11, color: r.change === "up" ? T.green : r.change === "down" ? T.red : T.textMut, fontWeight: 600 }}>
                {r.change === "up" ? `▲ was #${r.prev}` : r.change === "down" ? `▼ was #${r.prev}` : "— stable"}
              </span>
              <span style={{ fontSize: 10, color: T.textSec }}>{r.competitor}</span>
            </div>
          ))}
        </div>
      </Sec>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Competitor Threats */}
        <Sec title="Competitive Threats — From Customer Calls" sub="AI-detected: what competitors are our cardholders mentioning?">
          {competitors.map((c, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${c.threat === "high" ? `${T.red}25` : T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, borderLeft: `3px solid ${c.threat === "high" ? T.red : T.amber}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{c.name}</span>
                <Badge color={c.threat === "high" ? "red" : "amber"}>{c.threat} threat</Badge>
              </div>
              <div style={{ fontSize: 12, color: T.cyan, fontWeight: 600, marginBottom: 8 }}>{c.offer}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 10 }}>
                <div><span style={{ color: T.textMut }}>Launched</span><div style={{ color: T.text, fontWeight: 600 }}>{c.launched}</div></div>
                <div><span style={{ color: T.textMut }}>Our callers mentioning</span><div style={{ color: T.red, fontWeight: 700, fontSize: 16, fontFamily: "var(--mono)" }}>{c.ourCallers}</div></div>
                <div><span style={{ color: T.textMut }}>At-risk segment</span><div style={{ color: T.text, fontWeight: 600 }}>{c.segment}</div></div>
              </div>
            </div>
          ))}
        </Sec>

        {/* Sentiment trend: Ours vs Competitor */}
        <Sec title="Social Sentiment — Ours vs Market" sub="4-week trend: are we gaining or losing the perception battle?">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="w" tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border}/>
              <YAxis tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border} width={35} domain={[0.4, 0.8]}/>
              <Tooltip contentStyle={tt}/>
              <Line type="monotone" dataKey="ours" stroke={T.cyan} strokeWidth={2.5} dot={{ fill: T.cyan, r: 4 }} name="Our Brand"/>
              <Line type="monotone" dataKey="comp" stroke={T.red} strokeWidth={2} strokeDasharray="5 3" dot={{ fill: T.red, r: 3 }} name="Top Competitor Avg"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ background: T.redGlow, border: `1px solid ${T.red}25`, borderRadius: 8, padding: "10px 14px", marginTop: 10, fontSize: 11, color: T.red }}>
            ⚠ Sentiment crossover in Week 3 — competitors now ahead. Root cause: reward devaluation + CompetitorY launch.
          </div>
        </Sec>
      </div>

      {/* Influencer Coverage */}
      <Sec title="Influencer & Creator Coverage" sub="Who's talking about our cards? Positive vs negative vs neutral by platform">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {influencers.map((inf, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>{inf.platform}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.cyan, fontFamily: "var(--mono)", marginBottom: 8 }}>{inf.mentions} <span style={{ fontSize: 10, fontWeight: 400, color: T.textMut }}>mentions</span></div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {([["Pos", inf.positive, T.green], ["Neg", inf.negative, T.red], ["Neu", inf.neutral, T.textMut]] as [string, number, string][]).map(([l, v, c], j) => (
                  <div key={j} style={{ flex: 1, background: `${c}12`, borderRadius: 6, padding: "4px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "var(--mono)" }}>{v}</div>
                    <div style={{ fontSize: 8, color: T.textMut }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: T.textMut, marginBottom: 2 }}>Top creator: <span style={{ color: T.textSec }}>{inf.topCreator}</span></div>
              <div style={{ fontSize: 9, color: T.textMut }}>Top topic: <span style={{ color: T.amber }}>{inf.topTopic}</span></div>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// ═══════════════════════════════════
// TAB 3: INTERNAL OPERATIONS
// Process efficiency, throughput, quality
// ═══════════════════════════════════
function ScreenInternal() {
  const resTime = [
    { intent: "Fraud Claim", fastest: 2.1, avg: 6.8, slowest: 18.4 },
    { intent: "Billing Dispute", fastest: 1.5, avg: 8.2, slowest: 22.1 },
    { intent: "Reward Issue", fastest: 0.5, avg: 3.1, slowest: 12.0 },
    { intent: "Card Activation", fastest: 0.1, avg: 0.8, slowest: 4.2 },
    { intent: "Annual Fee Waiver", fastest: 0.2, avg: 1.4, slowest: 7.8 },
    { intent: "Credit Limit Change", fastest: 0.3, avg: 2.2, slowest: 9.1 },
  ];

  const throughput = [
    { team: "In-House Team A", cases: 42, complexity: "High", quality: 94, win: 71, cost: "$18" },
    { team: "In-House Team B", cases: 38, complexity: "Mixed", quality: 89, win: 68, cost: "$21" },
    { team: "BPO — Vendor Alpha", cases: 28, complexity: "Low-Med", quality: 72, win: 42, cost: "$12" },
    { team: "BPO — Vendor Beta", cases: 31, complexity: "Low", quality: 68, win: 38, cost: "$11" },
  ];

  const qaAlerts = [
    { who: "BPO Vendor Alpha", issue: "Misclassifying friendly fraud as unauthorized", rate: "23%", cost: "$340K/month", sev: "critical" },
    { who: "BPO Vendor Beta", issue: "Missing evidence collection on billing disputes", rate: "34%", cost: "Representment win: 38% vs 71% in-house", sev: "critical" },
    { who: "Evening Shift", issue: "Incorrect Reg E timeline communicated", rate: "8%", cost: "Compliance exposure", sev: "warning" },
    { who: "Cross-sell during complaints", issue: "Cross-sell on negative-sentiment calls → 3.2× worse CSAT", rate: "89% gave 1-star", cost: "Brand damage", sev: "warning" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: T.tealGlow, border: `1px solid ${T.teal}20`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <Layers size={14} color={T.teal}/>
        <span style={{ fontSize: 12, color: T.teal }}><strong>Internal View:</strong> Process efficiency, workforce throughput, quality scores. Per Sowmya: "How fast are they solving? What's the throughput? Complexity vs speed."</span>
      </div>

      {/* Process Resolution Times */}
      <Sec title="Process Resolution Time — By Top Intent" sub="Fastest / Average / Slowest (days). Identifies bottlenecks by intent type." action={<Badge color="cyan">Sowmya's Request</Badge>}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={resTime} layout="vertical" barSize={10} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
            <XAxis type="number" tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border} unit="d"/>
            <YAxis type="category" dataKey="intent" tick={{ fontSize: 10, fill: T.textSec }} width={100} stroke={T.border}/>
            <Tooltip contentStyle={tt}/>
            <Bar dataKey="fastest" fill={T.green} name="Fastest" radius={[0,0,0,0]}/>
            <Bar dataKey="avg" fill={T.amber} name="Average" radius={[0,0,0,0]}/>
            <Bar dataKey="slowest" fill={T.red} name="Slowest" radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Sec>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* Throughput: Complexity vs Speed by Team */}
        <Sec title="Workforce Throughput — Complexity vs Speed vs Quality" sub="Per person/team. Who handles complex cases fastest without sacrificing quality?">
          <div style={{ display: "grid", gridTemplateColumns: "140px 70px 80px 60px 60px 55px", gap: 1, fontSize: 11, marginBottom: 8 }}>
            {["Team", "Cases/day", "Complexity", "Quality", "Win Rate", "Cost/case"].map(h => (
              <div key={h} style={{ background: T.elevated, padding: "8px 10px", fontWeight: 700, color: T.textMut, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
            ))}
            {throughput.flatMap((t, i) => {
              const qc = t.quality >= 85 ? T.green : t.quality >= 70 ? T.amber : T.red;
              return [t.team, t.cases, t.complexity, `${t.quality}%`, `${t.win}%`, t.cost].map((v, j) => (
                <div key={`${i}-${j}`} style={{ background: T.surface, padding: "8px 10px", color: j === 3 ? qc : j === 4 ? (t.win >= 60 ? T.green : t.win >= 45 ? T.amber : T.red) : j === 0 ? T.cyan : T.text, fontWeight: j === 0 || j === 3 || j === 4 ? 700 : 400, fontFamily: j >= 1 && j <= 5 ? "var(--mono)" : "inherit", fontSize: j === 0 ? 10 : 11 }}>{v}</div>
              ));
            })}
          </div>
          <div style={{ background: T.redGlow, border: `1px solid ${T.red}25`, borderRadius: 8, padding: "10px 14px", fontSize: 11, color: T.red }}>
            ⚠ BPO Vendor Beta: 2.7× slower on evidence collection. Representment win rate 38% vs 71% in-house. Cost saving of $7/case is erased by $890K/quarter in lost representments.
          </div>
        </Sec>

        {/* QA Alerts */}
        <Sec title="Quality Alerts — 100% Scored" sub="Every dispute call & chat scored. Systemic issues surfaced.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ background: T.tealGlow, border: `1px solid ${T.teal}20`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.teal, fontFamily: "var(--mono)" }}>100%</div>
              <div style={{ fontSize: 9, color: T.textMut }}>interactions scored</div>
            </div>
            <div style={{ background: T.redGlow, border: `1px solid ${T.red}20`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.red, fontFamily: "var(--mono)" }}>$340K</div>
              <div style={{ fontSize: 9, color: T.textMut }}>monthly misclassification cost</div>
            </div>
          </div>
          {qaAlerts.map((qa, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${qa.sev === "critical" ? `${T.red}20` : T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${qa.sev === "critical" ? T.red : T.amber}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.cyan }}>{qa.who}</span>
                <Badge color={qa.sev === "critical" ? "red" : "amber"}>{qa.rate}</Badge>
              </div>
              <div style={{ fontSize: 11, color: T.text }}>{qa.issue}</div>
              <div style={{ fontSize: 10, color: T.red, marginTop: 4, fontWeight: 600 }}>{qa.cost}</div>
            </div>
          ))}
        </Sec>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// TAB 4: PORTFOLIO & RISK
// Card-specific P&L, fraud, delinquency
// ═══════════════════════════════════
function ScreenPortfolio() {
  const delinquency = [
    { bucket: "Current", pct: 92.1, accounts: "4.6M", trend: "stable" },
    { bucket: "30 day", pct: 4.2, accounts: "210K", trend: "up" },
    { bucket: "60 day", pct: 2.1, accounts: "105K", trend: "up" },
    { bucket: "90+ day", pct: 1.6, accounts: "80K", trend: "up" },
  ];

  const fraudByType = [
    { name: "CNP", value: 52, color: T.red },
    { name: "Friendly", value: 18, color: T.amber },
    { name: "ATO", value: 14, color: T.purple },
    { name: "Counterfeit", value: 9, color: T.blue },
    { name: "Other", value: 7, color: T.textMut },
  ];

  const tradeoff = [
    { m: "Oct", approval: 89.2, loss: 6.8 }, { m: "Nov", approval: 90.1, loss: 7.2 },
    { m: "Dec", approval: 91.0, loss: 8.1 }, { m: "Jan", approval: 91.8, loss: 9.4 },
    { m: "Feb", approval: 92.5, loss: 11.2 }, { m: "Mar", approval: 93.1, loss: 14.8 },
  ];

  const collections = [
    { bucket: "30-day", rpc: 48, ptp: 34, recovery: 72, tone: 0.62 },
    { bucket: "60-day", rpc: 35, ptp: 22, recovery: 54, tone: 0.51 },
    { bucket: "90-day", rpc: 22, ptp: 14, recovery: 31, tone: 0.44 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Portfolio KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        <KPI label="Portfolio Receivables" value="$1.24" unit="B" delta={+3.2} status="green" icon={DollarSign} sub="QoQ growth"/>
        <KPI label="Net Interest Margin" value="12.4" unit="%" delta={-0.3} target="> 13%" status="amber" icon={Percent}/>
        <KPI label="Fraud Loss Rate" value="11.2" unit="bps" delta={+2.8} target="< 8 bps" status="red" icon={Shield}/>
        <KPI label="Charge-Off Rate" value="3.8" unit="%" delta={+0.3} target="< 3.5%" status="red" icon={AlertCircle}/>
        <KPI label="Payment Rate" value="28.3" unit="%" delta={-1.1} status="amber" icon={CreditCard} sub="Transactor mix shifting"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Delinquency Buckets */}
        <Sec title="Delinquency Migration" sub="30/60/90+ day buckets — are accounts migrating down?">
          {delinquency.map((d, i) => {
            const col = d.bucket === "Current" ? T.green : d.trend === "up" ? T.red : T.amber;
            return (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text, width: 70 }}>{d.bucket}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: col, fontFamily: "var(--mono)" }}>{d.pct}%</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: T.textSec }}>{d.accounts} accounts</div>
                    <div style={{ fontSize: 10, color: d.trend === "up" ? T.red : T.green, fontWeight: 600 }}>{d.trend === "up" ? "▲ migrating" : "— stable"}</div>
                  </div>
                </div>
                <div style={{ width: "100%", height: 4, background: T.surface, borderRadius: 2, marginTop: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                  <div style={{ width: `${d.pct}%`, height: "100%", background: col, borderRadius: 2 }}/>
                </div>
              </div>
            );
          })}
          <div style={{ background: T.amberGlow, border: `1px solid ${T.amber}25`, borderRadius: 8, padding: "10px 14px", fontSize: 11, color: T.amber }}>
            ⚠ 412 inbound calls mentioned hardship keywords but were not flagged for loss mitigation. Estimated avoidable charge-off: <strong>$1.2M</strong>.
          </div>
        </Sec>

        {/* Fraud by Type + Approval Tradeoff */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Sec title="Fraud Loss Distribution" sub="By fraud type — where are the losses concentrated?">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={fraudByType} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    {fraudByType.map((e, i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={tt}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {fraudByType.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: f.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 11, color: T.text, flex: 1 }}>{f.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: f.color, fontFamily: "var(--mono)" }}>{f.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Sec>

          <Sec title="Approval Rate vs Fraud Loss" sub="The tradeoff: higher approvals = more revenue until losses exceed gains">
            <ResponsiveContainer width="100%" height={140}>
              <ComposedChart data={tradeoff}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="m" tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border}/>
                <YAxis yAxisId="l" tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border} width={30} domain={[88, 94]}/>
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10, fill: T.textMut }} stroke={T.border} width={30}/>
                <Tooltip contentStyle={tt}/>
                <Line yAxisId="l" type="monotone" dataKey="approval" stroke={T.green} strokeWidth={2} dot={{ fill: T.green, r: 3 }} name="Approval %"/>
                <Bar yAxisId="r" dataKey="loss" fill={`${T.red}50`} name="Loss (bps)" radius={[3,3,0,0]}/>
              </ComposedChart>
            </ResponsiveContainer>
          </Sec>
        </div>
      </div>

      {/* Collections */}
      <Sec title="Collections Intelligence" sub="RPC rate, promise-to-pay, recovery, agent tone scoring by bucket">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {collections.map((c, i) => {
            const tc = c.tone >= 0.6 ? T.green : c.tone >= 0.5 ? T.amber : T.red;
            return (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.cyan, fontFamily: "var(--mono)" }}>{c.bucket}</span>
                  <Badge color={tc === T.green ? "green" : tc === T.amber ? "amber" : "red"}>Tone: {c.tone.toFixed(2)}</Badge>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {([
                    ["RPC Rate", `${c.rpc}%`, c.rpc > 40 ? T.green : T.amber],
                    ["PTP Conv.", `${c.ptp}%`, c.ptp > 25 ? T.green : T.amber],
                    ["Recovery", `${c.recovery}%`, c.recovery > 50 ? T.green : T.red],
                    ["Tone", c.tone.toFixed(2), tc],
                  ] as [string, string, string][]).map(([l, v, col], j) => (
                    <div key={j}>
                      <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: col, fontFamily: "var(--mono)" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Sec>
    </div>
  );
}

// ═══════════════════════════════════
// TAB 5: SIGNALS & ALERTS
// Anomalies, journeys, churn
// ═══════════════════════════════════
function ScreenSignals() {
  const anomalies = [
    { severity: "critical", time: "02:30", title: "Merchant Breach — 1,247 Cards Still Exposed", desc: "Visa CAID 72 hrs ago. Reissuance 68% complete. 4 fraudulent txns on exposed cards.", impact: "Est exposure: $312K", action: "Expedite remaining 32% reissuance" },
    { severity: "critical", time: "04:15", title: "CNP Fraud Spike — MCC 7995 (Gaming)", desc: "180% increase. Pattern: $1-5 test txns → $200-800 purchases. 89 cards flagged.", impact: "Est losses: $47K/week", action: "Temp MCC velocity limit" },
    { severity: "warning", time: "06:40", title: "Reg E Deadline — 43 Disputes at Risk", desc: "43 disputes within 3 days of provisional credit deadline. 7 are high-LTV.", impact: "Regulatory compliance risk", action: "Auto-prioritised. Credit recommendations generated." },
    { severity: "warning", time: "07:10", title: "Reward Backlash Accelerating", desc: "Reddit: 3,400 upvotes. Twitter: 890 mentions. 67 retention calls linked.", impact: "Projected media threshold: tomorrow", action: "Comms response drafted" },
    { severity: "info", time: "07:45", title: "Statement Confusion Cluster", desc: "189 calls about merchant name display. Top: AMZN MKTP vs Amazon.", impact: "2,800 calls/month on this topic", action: "Enhanced merchant name mapping recommended" },
  ];

  const journey = [
    { time: "Day 1", ch: "Statement", ev: "Unknown $89 charge. Merchant shows as 'MRC*SUBSVC' — unrecognisable.", sent: -0.2 },
    { time: "Day 1", ch: "Voice", ev: "Calls to dispute. Wait 8 min. Agent opens case. Told 10 business days.", sent: -0.4 },
    { time: "Day 3", ch: "System", ev: "Provisional credit of $89 issued. Email notification sent.", sent: 0.1 },
    { time: "Day 14", ch: "Merchant", ev: "Merchant sends evidence: signed recurring subscription agreement.", sent: 0.0 },
    { time: "Day 16", ch: "System", ev: "Provisional credit reversed. $89 re-debited. Letter sent.", sent: -0.7 },
    { time: "Day 16", ch: "Voice", ev: "\"You gave me my money then took it back!\" Supervisor escalation. 22 min call.", sent: -0.9 },
    { time: "Day 17", ch: "Twitter", ev: "\"@BankX stole $89 from me. Avoid this card.\" — 1,800 impressions.", sent: -1.0 },
  ];

  const churn = [
    { id: "VIP-2891", tenure: "8 yrs", spend: "$3,200 → $800/mo", prob: 89, sig: "Spend collapsed + competitor mentions + all points redeemed", offer: "Match 5% cashback 6 mo" },
    { id: "VIP-4412", tenure: "5 yrs", spend: "$2,100 → $1,400/mo", prob: 76, sig: "Annual fee dispute + 2 competitor calls + secondary card usage up", offer: "Fee waiver + rewards boost" },
    { id: "VIP-7803", tenure: "12 yrs", spend: "$4,500 → $3,800/mo", prob: 72, sig: "Fraud claim took 14 days. Expressed distrust. Reduced auto-payments.", offer: "Expedite claim + RM outreach" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Anomaly Feed */}
        <Sec title="AI Anomaly Feed" sub="Live-streaming, sorted by severity & financial impact" action={<span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }}/><span style={{ fontSize: 9, color: T.textMut }}>Live</span></span>}>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {anomalies.map((a, i) => {
              const col = a.severity === "critical" ? T.red : a.severity === "warning" ? T.amber : T.blue;
              return (
                <div key={i} style={{ background: T.surface, border: `1px solid ${col}25`, borderLeft: `3px solid ${col}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Badge color={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "blue"}>{a.severity}</Badge>
                    <span style={{ fontSize: 10, color: T.textMut, fontFamily: "var(--mono)" }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6 }}>{a.desc}</div>
                  {a.impact && <div style={{ fontSize: 10, color: col, fontWeight: 600, marginTop: 6 }}>{a.impact}</div>}
                  {a.action && <div style={{ fontSize: 10, color: T.teal, marginTop: 4 }}>→ {a.action}</div>}
                </div>
              );
            })}
          </div>
        </Sec>

        {/* Customer Journey */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Sec title="Cardholder Journey — Dispute #D-48291" sub="The story: unknown charge → provisional credit → reversal → social explosion">
            <div style={{ position: "relative", paddingLeft: 22, borderLeft: `2px solid ${T.border}` }}>
              {journey.map((s, i) => {
                const col = s.sent > 0 ? T.green : s.sent > -0.4 ? T.amber : s.sent > -0.7 ? T.red : "#ff4040";
                return (
                  <div key={i} style={{ marginBottom: 12, position: "relative" }}>
                    <div style={{ position: "absolute", left: -29, top: 3, width: 12, height: 12, borderRadius: "50%", background: col, border: `2px solid ${T.card}`, boxShadow: `0 0 6px ${col}50` }}/>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 9, color: T.textMut, fontFamily: "var(--mono)" }}>{s.time}</span>
                      <Badge color={s.ch === "Twitter" ? "purple" : s.ch === "Voice" ? "cyan" : s.ch === "Statement" ? "gold" : "blue"}>{s.ch}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{s.ev}</div>
                    <div style={{ width: `${Math.max(Math.abs(s.sent), 0.15) * 100}%`, height: 3, background: col, borderRadius: 2, marginTop: 4, opacity: 0.7 }}/>
                  </div>
                );
              })}
            </div>
          </Sec>

          {/* Churn */}
          <Sec title="Churn Prediction — High-Value Cardholders" sub="Spend decline + competitor signals + behaviour changes = churn risk">
            {churn.map((c, i) => {
              const pc = c.prob > 80 ? T.red : c.prob > 70 ? T.amber : T.blue;
              return (
                <div key={i} style={{ background: T.surface, border: `1px solid ${c.prob > 80 ? `${T.red}20` : T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.cyan, fontFamily: "var(--mono)" }}>#{c.id}</span>
                    <div style={{ background: `${pc}20`, padding: "3px 10px", borderRadius: 6 }}><span style={{ fontSize: 14, fontWeight: 800, color: pc, fontFamily: "var(--mono)" }}>{c.prob}%</span></div>
                  </div>
                  <div style={{ fontSize: 10, color: T.textMut, marginBottom: 4 }}>{c.tenure} · Spend: {c.spend}</div>
                  <div style={{ fontSize: 11, color: T.text, marginBottom: 6 }}>{c.sig}</div>
                  <div style={{ fontSize: 10, color: T.teal, fontWeight: 600, paddingTop: 6, borderTop: `1px solid ${T.border}` }}>→ Retention: {c.offer}</div>
                </div>
              );
            })}
          </Sec>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// MAIN — Head of Credit Cards (card ops)
// ═══════════════════════════
const CARD_SCREENS: Record<CardTabId, ComponentType> = {
  promise: ScreenPromise,
  external: ScreenExternal,
  internal: ScreenInternal,
  portfolio: ScreenPortfolio,
  signals: ScreenSignals,
};

export function CardOpsDashboard({ industryName, roleName, industryColor, onExit }: CardOpsDashboardProps) {
  const [tab, setTab] = useState<CardTabId>("promise");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const Screen = CARD_SCREENS[tab];
  const active = TABS.find((x) => x.id === tab);

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "var(--font)", color: T.text, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        :root { --font: 'Outfit', system-ui, sans-serif; --mono: 'JetBrains Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.cyan, letterSpacing: 2.5, textTransform: "uppercase" }}>Yaaralabs</div>
          <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>Fluid Intelligence · Card Ops</div>
        </div>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: `${industryColor}18`, border: `1px solid ${industryColor}35` }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{industryName}</span>
          </div>
          <div style={{ fontSize: 10, color: T.cyan, fontWeight: 600 }}>{roleName}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {TABS.map((tb) => {
            const Icon = tb.icon;
            const act = tab === tb.id;
            return (
              <button key={tb.id} type="button" onClick={() => setTab(tb.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                background: act ? `linear-gradient(90deg, ${T.cyanGlow}, transparent)` : "transparent",
                border: "none", borderRadius: 10, cursor: "pointer", borderLeft: act ? `3px solid ${T.cyan}` : "3px solid transparent",
                width: "100%", textAlign: "left",
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: act ? T.cyanGlow : `${T.textMut}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={act ? T.cyan : T.textMut}/>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: act ? 700 : 500, color: act ? T.text : T.textSec }}>{tb.label}</div>
                  <div style={{ fontSize: 9, color: T.textMut }}>{tb.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
          <button type="button" onClick={onExit} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: T.textSec, fontSize: 11, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
            <ArrowLeft size={11}/> Change role
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: T.surface }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: -0.3, margin: 0 }}>{active?.label}</h1>
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{active?.sub} · {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · <span style={{ fontFamily: "var(--mono)", fontSize: 10 }}>{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Bell size={17} color={T.textSec}/><span style={{ position: "absolute", top: -5, right: -6, width: 16, height: 16, borderRadius: "50%", background: T.red, fontSize: 9, fontWeight: 800, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.surface}` }}>5</span>
            </div>
            <button style={{ background: `linear-gradient(135deg, ${T.cyan}, ${T.teal})`, color: T.bg, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Export Report</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}><Screen/></div>
      </div>
    </div>
  );
}
