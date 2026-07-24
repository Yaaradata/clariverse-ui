"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * IndusInd Head of Cards — third drill-down.
 *
 * Designed as a standalone replacement for the current VoiceJoinDrill.
 * It keeps the CardsPortfolioV2Dashboard visual grammar, but does not expose
 * communication and transaction information as two separate halves.
 *
 * Integration inside CardsPortfolioV2Dashboard.tsx: default-import this file,
 * then render it when screen === "voice" and showVoiceJoin is true, passing the
 * go navigator — <IndusIndCardsCustomerPortfolioDrill go={go} />.
 */

type NavigateFn = (screen: string) => void;

const T = {
  bg: "#0d0d0d",
  card: "#0d0d0d",
  row: "#151515",
  inset: "#1a1a1a",
  track: "#1f1f1f",
  border: "#1f1f1f",
  inner: "#2a2a2a",
  btn: "#393939",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#7e7f80",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  green: "#22c55e",
  yellow: "#eab308",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  blue: "#5332ff",
  gold: "#eab308",
};

const MONO = "var(--mono), ui-monospace, SFMono-Regular, Menlo, monospace";

type IssueId = "rewards" | "app" | "payments" | "conduct" | "emi";

interface Issue {
  id: IssueId;
  short: string;
  title: string;
  product: string;
  lifecycle: string;
  severity: number;
  baseline: string;
  customerSignal: string;
  portfolioMovement: string;
  exposure: string;
  affected: string;
  repeatContact: string;
  conduct: string;
  curability: number;
  owner: string;
  ownerTone: string;
  nextAction: string;
  cause?: string;
  listeningPosts?: string;
  evidence: string[];
  channelCount: number;
  productCount: number;
  trend: number[];
}

const ISSUE_CATALOGUE: Issue[] = [
  {
    id: "rewards",
    short: "Reward value",
    title: "Reward value erosion",
    product: "EazyDiner Signature · Legend",
    lifecycle: "Repeat spend",
    severity: 92,
    baseline: "3.1× above normal",
    customerSignal: "Benefit-value complaints are concentrated among premium, high-spend cardholders.",
    portfolioMovement: "Repeat spend −8.6% · redemption abandonment +17%",
    exposure: "₹1.4 Cr MTD EST",
    affected: "~3.2k cardholders",
    repeatContact: "38% repeat contact",
    conduct: "Medium",
    curability: 78,
    owner: "Rewards & Portfolio",
    ownerTone: "violet",
    nextAction: "Review benefit design and prepare a targeted retention proposition for affected high-value cardholders.",
    cause: "Follows the EazyDiner Prime discontinuation (on Celesta) and the Legend fee/threshold revision effective 15 Jul — the erosion on EazyDiner Signature and Legend trails our own benefit change.",
    listeningPosts: "Service chat + app store · ~214 similar contacts caught ahead of MIS",
    evidence: ["Service chat", "App stores", "TechnoFino", "Complaints"],
    channelCount: 4,
    productCount: 2,
    trend: [42, 47, 53, 61, 76, 88, 92],
  },
  {
    id: "app",
    short: "INDIE access",
    title: "INDIE servicing access friction",
    product: "INDIE · credit-card-only cardholders",
    lifecycle: "Usage",
    severity: 86,
    baseline: "2.7× above normal",
    customerSignal: "Login, OTP, UCIC and card-visibility failures are preventing self-service servicing and payment.",
    portfolioMovement: "Self-service payments −9% · assisted contacts +24%",
    exposure: "₹40 L MTD EST",
    affected: "6.8k high-value cardholders",
    repeatContact: "41% repeat contact",
    conduct: "Low",
    curability: 84,
    owner: "Digital Cards",
    ownerTone: "cyan",
    nextAction: "Create an alternate payment path and isolate UCIC/card-visibility failures for correction.",
    evidence: ["Google Play", "Calls", "Complaints", "Payment events"],
    channelCount: 5,
    productCount: 3,
    trend: [35, 39, 48, 59, 73, 81, 86],
  },
  {
    id: "payments",
    short: "Payment pending",
    title: "Payment pending and credit delay",
    product: "Cross-portfolio",
    lifecycle: "Usage",
    severity: 76,
    baseline: "2.2× above normal",
    customerSignal: "Cardholders report payment debited but card balance not updated within the expected window.",
    portfolioMovement: "Payment retries +16% · disputes +11%",
    exposure: "₹62 L pending EST",
    affected: "9.6k cardholders",
    repeatContact: "34% repeat contact",
    conduct: "Medium",
    curability: 72,
    owner: "Payments & Authorisation",
    ownerTone: "amber",
    nextAction: "Prioritise reconciliation exceptions and send resolution updates to cardholders with ageing pending payments.",
    evidence: ["App reviews", "Calls", "Complaints", "Reconciliation"],
    channelCount: 3,
    productCount: 5,
    trend: [41, 46, 52, 60, 65, 72, 76],
  },
  {
    id: "conduct",
    short: "Upgrade consent",
    title: "Upgrade consent and expectation mismatch",
    product: "Pinnacle · Celesta migrations",
    lifecycle: "Attrition",
    severity: 81,
    baseline: "1.9× above normal",
    customerSignal: "Upgrade and benefit-expectation complaints include fee disputes and consent concerns.",
    portfolioMovement: "Fee reversals ₹18 L EST · closure intent +13%",
    exposure: "₹18 L EST",
    affected: "1.7k cardholders EST",
    repeatContact: "46% repeat contact",
    conduct: "High",
    curability: 66,
    owner: "Conduct & Compliance",
    ownerTone: "red",
    nextAction: "Validate consent evidence, sales scripts and fee reversals before the next upgrade campaign wave.",
    evidence: ["Complaints", "Trustpilot", "Call reviews", "Fee events"],
    channelCount: 4,
    productCount: 2,
    trend: [28, 32, 35, 44, 57, 69, 81],
  },
  {
    id: "emi",
    short: "EMI conversion",
    title: "Eligible spend not converting to EMI",
    product: "Premium cards · high-ticket spend",
    lifecycle: "Repeat spend",
    severity: 63,
    baseline: "1.6× above normal",
    customerSignal: "Eligible cardholders report that EMI conversion is missing or unavailable after high-ticket purchases.",
    portfolioMovement: "Eligible conversion −7% · service contacts +12%",
    exposure: "₹31 L NII EST",
    affected: "3.1k transactions",
    repeatContact: "22% repeat contact",
    conduct: "Low",
    curability: 89,
    owner: "Cards Product",
    ownerTone: "green",
    nextAction: "Check eligibility-rule gaps and trigger a human-approved EMI reminder for eligible unconverted spend.",
    evidence: ["Complaints", "Emails", "Calls", "Eligible spend"],
    channelCount: 3,
    productCount: 3,
    trend: [30, 34, 38, 44, 51, 59, 63],
  },
];

interface ProductRow {
  product: string;
  rewards: number;
  app: number;
  payments: number;
  conduct: number;
  emi: number;
}

const PRODUCT_MATRIX: ProductRow[] = [
  { product: "EazyDiner", rewards: 92, app: 38, payments: 44, conduct: 23, emi: 31 },
  { product: "Legend", rewards: 86, app: 35, payments: 48, conduct: 32, emi: 42 },
  { product: "INDIE app access", rewards: 29, app: 94, payments: 73, conduct: 18, emi: 26 },
  { product: "Pinnacle", rewards: 54, app: 41, payments: 39, conduct: 88, emi: 52 },
  { product: "Tiger", rewards: 63, app: 33, payments: 46, conduct: 27, emi: 37 },
];

const LIFECYCLE = [
  { stage: "Activation", score: 72, delta: "−4 pts", issue: "Card visibility / OTP", linkedIssue: "app", tone: T.amber },
  { stage: "Usage", score: 61, delta: "−9 pts", issue: "INDIE access · payment pending", linkedIssue: "app", tone: T.red },
  { stage: "Repeat spend", score: 58, delta: "−8 pts", issue: "Reward value · EMI gap", linkedIssue: "rewards", tone: T.red },
  { stage: "Dormancy", score: 67, delta: "+6% risk", issue: "Benefits no longer compelling", linkedIssue: "rewards", tone: T.amber },
  { stage: "Attrition", score: 64, delta: "+13% intent", issue: "Consent / unresolved service", linkedIssue: "conduct", tone: T.red },
];

const HIGH_VALUE_BUBBLES: { id: IssueId; x: number; y: number; size: number; label: string; value: string }[] = [
  { id: "rewards", x: 72, y: 82, size: 74, label: "Reward value", value: "₹1.4 Cr" },
  { id: "app", x: 61, y: 69, size: 58, label: "INDIE access", value: "6.8k HV" },
  { id: "conduct", x: 88, y: 45, size: 42, label: "Upgrade consent", value: "High conduct" },
  { id: "payments", x: 53, y: 58, size: 48, label: "Payment pending", value: "₹62 L" },
  { id: "emi", x: 38, y: 37, size: 36, label: "EMI gap", value: "₹31 L" },
];

const TONE: Record<string, string> = {
  red: T.red,
  amber: T.amber,
  green: T.green,
  cyan: T.cyan,
  violet: T.violet,
  gold: T.gold,
};

function tone(name: string): string {
  return TONE[name] || T.gold;
}

function Eyebrow({ children, color = T.muted }: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </div>
  );
}

function Mono({ children, color = T.text, size = 14 }: { children: ReactNode; color?: string; size?: number }) {
  return (
    <span style={{ fontFamily: MONO, fontWeight: 800, color, fontSize: size }}>
      {children}
    </span>
  );
}

function Pill({ children, toneName = "gold", solid = false }: { children: ReactNode; toneName?: string; solid?: boolean }) {
  const color = tone(toneName);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        padding: "3px 8px",
        borderRadius: 999,
        border: solid ? "none" : `1px solid ${color}44`,
        background: solid ? color : `${color}18`,
        color: solid ? T.bg : color,
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: ".05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Chip({ children, toneName = "muted" }: { children: ReactNode; toneName?: string }) {
  const color = toneName === "muted" ? T.muted : tone(toneName);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        border: `1px solid ${color}3a`,
        background: `${color}14`,
        color,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  accent,
  ai,
  right,
  children,
  className = "",
  style,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: string;
  ai?: boolean;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={className}
      style={{
        minWidth: 0,
        borderRadius: 12,
        border: `1px solid ${T.border}`,
        borderTop: accent ? `3px solid ${accent}` : `1px solid ${T.border}`,
        background: T.card,
        padding: 14,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{title}</span>
            {ai ? <Pill toneName="gold">Distilled</Pill> : null}
          </div>
          {subtitle ? (
            <div style={{ color: T.muted, fontSize: 10.5, lineHeight: 1.45, marginTop: 3 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function AIInsightStrip({ children, toneName = "gold" }: { children: ReactNode; toneName?: string }) {
  const color = tone(toneName);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
        borderRadius: 8,
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        background: `${color}10`,
        padding: "9px 10px",
        color: T.sub,
        fontSize: 11.5,
        lineHeight: 1.5,
      }}
    >
      <Sparkles size={13} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

function DrillHeader({ onBack }: { onBack: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          margin: "2px 0 14px",
          borderRadius: 10,
          border: `1px solid ${T.btn}`,
          background: T.row,
          color: T.sub,
          padding: "8px 15px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} /> Back to Overview
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ minWidth: 280, maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.3px", lineHeight: 1.15 }}>
              What are my cardholders experiencing across the cards portfolio?
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function Metric({ label, value, danger, positive }: { label: ReactNode; value: ReactNode; danger?: boolean; positive?: boolean }) {
  return (
    <div style={{ background: T.inset, border: `1px solid ${T.inner}`, borderRadius: 8, padding: 9 }}>
      <Eyebrow>{label}</Eyebrow>
      <div
        style={{
          color: danger ? T.red : positive ? T.green : T.text,
          fontFamily: MONO,
          fontSize: 11.5,
          fontWeight: 800,
          lineHeight: 1.35,
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PressureRadar({ issue }: { issue: Issue }) {
  const exposureScore = Math.max(42, issue.severity - 12);
  const contributors = [
    { label: "Cardholder pressure", value: issue.severity, color: T.violet },
    { label: "Portfolio exposure", value: exposureScore, color: T.red },
    { label: "Curability", value: issue.curability, color: T.green },
  ];

  return (
    <SectionCard
      title="Portfolio pressure now"
      subtitle="The issue with the highest combined customer, portfolio and intervention priority"
      accent={T.violet}
      right={<Pill toneName={issue.severity >= 85 ? "red" : "amber"}>{issue.baseline}</Pill>}
      style={{ padding: 11 }}
    >
      <div className="icpd-pressure-body">
        <div style={{ minWidth: 0 }}>
          <div style={{ height: 112, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="92%"
                barSize={12}
                data={[{ name: "Priority index", value: issue.severity, fill: T.violet }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: T.track }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Mono size={24}>{issue.severity}</Mono>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 4 }}>
            <Eyebrow>Priority index</Eyebrow>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
            {contributors.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9.5, color: T.muted, width: 106, flexShrink: 0 }}>{c.label}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: T.track }}>
                  <div style={{ height: "100%", width: `${c.value}%`, background: c.color, borderRadius: 3 }} />
                </div>
                <Mono color={c.color} size={10}>{c.value}</Mono>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 9, color: T.dim, marginTop: 6, lineHeight: 1.35 }}>
            Priority index is a weighted blend of these three drivers — not a raw mention count.
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <Eyebrow color={T.violet}>Highest priority</Eyebrow>
          <div style={{ color: T.text, fontSize: 15, fontWeight: 900, marginTop: 2 }}>{issue.title}</div>
          <div style={{ color: T.sub, fontSize: 11, lineHeight: 1.45, marginTop: 5 }}>
            {issue.customerSignal}
          </div>
          <div className="icpd-mini-grid" style={{ marginTop: 8 }}>
            <Metric label="Affected" value={issue.affected} />
            <Metric label="Portfolio movement" value={issue.portfolioMovement} danger />
            <Metric label="Exposure" value={issue.exposure} danger />
            <Metric label="Curability" value={`${issue.curability}/100`} positive />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function MatrixRow({ row, columns }: { row: ProductRow; columns: { id: IssueId; label: string }[] }) {
  return (
    <>
      <div style={{ color: T.sub, fontSize: 10.5, fontWeight: 800, alignSelf: "center" }}>{row.product}</div>
      {columns.map((column) => {
        const value = row[column.id];
        const color = value >= 80 ? T.red : value >= 60 ? T.amber : value >= 40 ? T.yellow : T.green;
        return (
          <div
            key={`${row.product}-${column.id}`}
            title={`${row.product} · ${column.label}: ${value}`}
            style={{
              height: 27,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              border: `1px solid ${color}55`,
              background: `${color}${value >= 80 ? "45" : value >= 60 ? "32" : "22"}`,
              color: T.text,
              fontFamily: MONO,
              fontSize: 10.5,
              fontWeight: 800,
            }}
          >
            {value}
          </div>
        );
      })}
    </>
  );
}

function ProductIssueMatrix() {
  const columns: { id: IssueId; label: string }[] = ISSUE_CATALOGUE.map((issue) => ({ id: issue.id, label: issue.short }));
  return (
    <SectionCard
      title="Product × friction concentration"
      subtitle="How each friction type concentrates across the card products"
      accent={T.cyan}
      right={<Pill toneName="cyan">vs own baseline</Pill>}
      style={{ padding: 11 }}
    >
      <div className="icpd-matrix-scroll">
        <div className="icpd-matrix" style={{ gridTemplateColumns: `104px repeat(${columns.length}, minmax(58px, 1fr))` }}>
          <div />
          {columns.map((column) => (
            <div key={column.id} className="icpd-matrix-header" style={{ color: T.muted, cursor: "default" }}>
              {column.label}
            </div>
          ))}
          {PRODUCT_MATRIX.map((row) => (
            <MatrixRow key={row.product} row={row} columns={columns} />
          ))}
        </div>
      </div>
      <AIInsightStrip toneName="cyan">
        EazyDiner and Legend show the strongest reward-value pressure; INDIE is dominated by access and payment friction,
        while Pinnacle carries the highest consent sensitivity.
      </AIInsightStrip>
    </SectionCard>
  );
}

function BriefLine({ label, value, danger }: { label: ReactNode; value: ReactNode; danger?: boolean }) {
  return (
    <div style={{ paddingBottom: 8, borderBottom: `1px solid ${T.inner}` }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ color: danger ? T.red : T.sub, fontSize: 12, fontWeight: 700, lineHeight: 1.45, marginTop: 3 }}>
        {value}
      </div>
    </div>
  );
}

function ExecutiveAI({ issue }: { issue: Issue }) {
  const conductTone = issue.conduct === "High" ? "red" : issue.conduct === "Medium" ? "amber" : "green";
  return (
    <SectionCard
      title="AI Portfolio brief"
      subtitle="Highest-priority issue across the cards portfolio right now — with the customer signal, evidence and owner action behind it"
      accent={T.gold}
      ai
      className="icpd-ai-card"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, justifyContent: "space-between" }}>
        <div>
          <Eyebrow color={T.gold}>What changed</Eyebrow>
          <div style={{ color: T.text, fontSize: 15, fontWeight: 900, lineHeight: 1.3, marginTop: 4 }}>
            {issue.title} is {issue.baseline}
          </div>
        </div>
        <BriefLine label="Concentrated in" value={issue.product} />
        {issue.listeningPosts ? <BriefLine label="Heard on" value={issue.listeningPosts} /> : null}
        {issue.cause ? <BriefLine label="Likely cause" value={issue.cause} /> : null}
        <BriefLine label="Portfolio implication" value={issue.portfolioMovement} danger />
        <BriefLine label="Lifecycle" value={issue.lifecycle} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Pill toneName={conductTone}>Conduct: {issue.conduct}</Pill>
          <Pill toneName={issue.ownerTone}>{issue.owner}</Pill>
          <Pill toneName="amber">Needs validation</Pill>
        </div>
        <AIInsightStrip toneName="gold">
          {issue.nextAction} This is a draft recommendation; a named human owner must validate and approve it.
        </AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function LifecycleMap() {
  const min = 50, max = 78, Hc = 108;
  const xPct = (idx: number) => ((idx + 0.5) / LIFECYCLE.length) * 100;
  const yPx = (v: number) => 12 + (1 - (v - min) / (max - min)) * 72;
  const linePts = LIFECYCLE.map((st, idx) => `${xPct(idx)},${yPx(st.score)}`).join(" ");
  const areaPath =
    `M ${xPct(0)},${Hc} ` +
    LIFECYCLE.map((st, idx) => `L ${xPct(idx)},${yPx(st.score)}`).join(" ") +
    ` L ${xPct(LIFECYCLE.length - 1)},${Hc} Z`;

  return (
    <SectionCard
      title="Cardholder lifecycle impact"
      subtitle="Journey health across the lifecycle — where friction is weakening each stage"
      accent={T.amber}
    >
      <div style={{ position: "relative", height: Hc }}>
        <svg
          viewBox={`0 0 100 ${Hc}`}
          width="100%"
          height={Hc}
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient id="icpd-lc-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.amber} stopOpacity="0.26" />
              <stop offset="100%" stopColor={T.amber} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#icpd-lc-grad)" />
          <polyline
            points={linePts}
            fill="none"
            stroke={T.amber}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {LIFECYCLE.map((st, idx) => (
          <div key={st.stage}>
            <div
              style={{
                position: "absolute",
                left: `${xPct(idx)}%`,
                top: yPx(st.score),
                transform: "translate(-50%, -50%)",
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: T.bg,
                border: `2.5px solid ${st.tone}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${xPct(idx)}%`,
                top: yPx(st.score) - 19,
                transform: "translateX(-50%)",
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 800,
                color: st.tone,
              }}
            >
              {st.score}
            </div>
          </div>
        ))}
      </div>

      <div className="icpd-lifecycle" style={{ marginTop: 8 }}>
        {LIFECYCLE.map((st) => (
          <div key={st.stage} style={{ textAlign: "center", minWidth: 0 }}>
            <Eyebrow>{st.stage}</Eyebrow>
            <div style={{ color: st.tone, fontSize: 9.5, fontWeight: 800, marginTop: 3 }}>{st.delta}</div>
            <div style={{ color: T.sub, fontSize: 9.5, lineHeight: 1.3, marginTop: 4 }}>{st.issue}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <AIInsightStrip toneName="amber">
          Journey health bottoms out at usage and repeat spend — INDIE access, payment-pending and reward-value friction — while attrition intent rises at the tail.
        </AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function HighValueExposure() {
  return (
    <SectionCard
      title="High-value cardholder exposure"
      subtitle="Issues placed by cardholder value, intervention urgency and affected population"
      accent={T.green}
      right={<Pill toneName="green">Bubble size = reach</Pill>}
    >
      <div className="icpd-bubble-chart">
        <div className="icpd-axis-y">Cardholder value</div>
        <div className="icpd-axis-x">Intervention urgency →</div>
        <div className="icpd-quadrant-label" style={{ top: 8, right: 10, color: T.red }}>Act now</div>
        <div className="icpd-quadrant-label" style={{ bottom: 26, left: 30, color: T.muted }}>Monitor</div>
        {HIGH_VALUE_BUBBLES.map((bubble) => {
          const issue = ISSUE_CATALOGUE.find((item) => item.id === bubble.id);
          if (!issue) return null;
          const color = issue.severity >= 85 ? T.red : issue.severity >= 75 ? T.amber : T.green;
          return (
            <div
              key={bubble.id}
              title={`${bubble.label} · ${bubble.value}`}
              style={{
                position: "absolute",
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                transform: "translate(-50%, 50%)",
                width: bubble.size,
                height: bubble.size,
                borderRadius: 999,
                border: `1px solid ${color}`,
                background: `${color}35`,
                color: T.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 5,
                fontSize: 8.5,
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {bubble.label}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function IssueConfidence() {
  return (
    <SectionCard
      title="Issue confidence and reach"
      subtitle="Patterns become more actionable when they repeat across channels, products, cardholders and contacts"
      accent={T.cyan}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ISSUE_CATALOGUE.map((issue) => (
          <div
            key={issue.id}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(105px,1.2fr) .55fr .55fr .8fr",
              alignItems: "center",
              gap: 8,
              width: "100%",
              borderRadius: 8,
              border: `1px solid ${T.inner}`,
              background: T.inset,
              padding: "8px 9px",
              color: T.sub,
            }}
          >
            <span style={{ color: T.text, fontSize: 10.5, fontWeight: 800 }}>{issue.short}</span>
            <span style={{ fontFamily: MONO, fontSize: 10 }}>{issue.channelCount} ch</span>
            <span style={{ fontFamily: MONO, fontSize: 10 }}>{issue.productCount} prod</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: issue.repeatContact.startsWith("4") ? T.red : T.amber }}>
              {issue.repeatContact.replace(" repeat contact", " repeat")}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function EmergingPatterns() {
  return (
    <SectionCard
      title="Emerging patterns"
      subtitle="Ranked by abnormality, business exposure, conduct sensitivity and curability — not mention volume"
      accent={T.gold}
      ai
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ISSUE_CATALOGUE.slice(0, 4).map((issue, index) => (
          <div
            key={issue.id}
            style={{
              display: "grid",
              gridTemplateColumns: "28px minmax(0,1fr) 92px",
              alignItems: "center",
              gap: 8,
              borderRadius: 9,
              border: `1px solid ${T.inner}`,
              background: T.inset,
              padding: 9,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: issue.severity >= 85 ? `${T.red}22` : `${T.amber}22`,
                color: issue.severity >= 85 ? T.red : T.amber,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              {index + 1}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: T.text, fontSize: 11, fontWeight: 800 }}>{issue.title}</div>
              <div style={{ color: T.muted, fontSize: 9.5, marginTop: 2 }}>{issue.product}</div>
            </div>
            <div style={{ height: 32 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={issue.trend.map((v) => ({ v }))}>
                  <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
                  <Line type="monotone" dataKey="v" stroke={issue.severity >= 85 ? T.red : T.amber} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function PriorityBoard({ activeIssue, onSelect }: { activeIssue: IssueId; onSelect: (id: IssueId) => void }) {
  return (
    <SectionCard
      title="Intervention priority board"
      subtitle="Select a row to load its draft in the Decision & action centre"
      accent={T.red}
      right={<Pill toneName="violet">Selection drives the action centre</Pill>}
    >
      <div className="icpd-priority-table">
        <div className="icpd-priority-head">
          <span>Priority</span><span>Issue / product</span><span>Exposure ₹</span><span>Population</span><span>Conduct</span><span>Curability</span><span>Owner</span>
        </div>
        {ISSUE_CATALOGUE.map((issue, index) => {
          const selected = issue.id === activeIssue;
          const conductTone = issue.conduct === "High" ? T.red : issue.conduct === "Medium" ? T.amber : T.green;
          return (
            <button
              type="button"
              key={issue.id}
              onClick={() => onSelect(issue.id)}
              className="icpd-priority-row"
              style={{ borderColor: selected ? T.violet : T.inner, background: selected ? `${T.violet}0d` : T.inset }}
            >
              <span><Pill toneName={index < 2 ? "red" : index < 4 ? "amber" : "green"}>P{index + 1}</Pill></span>
              <span>
                <b style={{ color: T.text }}>{issue.title}</b>
                <small>{issue.product}</small>
              </span>
              <span style={{ color: T.red, fontFamily: MONO, fontWeight: 800 }}>{issue.exposure}</span>
              <span style={{ color: T.sub, fontFamily: MONO, fontWeight: 700 }}>{issue.affected}</span>
              <span style={{ color: conductTone, fontWeight: 700 }}>{issue.conduct}</span>
              <span style={{ color: issue.curability >= 80 ? T.green : T.amber, fontFamily: MONO, fontWeight: 800 }}>
                {issue.curability}/100
              </span>
              <span style={{ color: T.sub, fontWeight: 700 }}>{issue.owner}</span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10 }}>
        <AIInsightStrip toneName="violet">
          Priority blends abnormality, exposure, conduct sensitivity and curability. The selected row is the only thing that drives the Decision & action centre — the rest of the board stays fixed.
        </AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function StatusTile({ icon: Icon, label, value, color }: { icon: LucideIcon; label: ReactNode; value: ReactNode; color: string }) {
  return (
    <div style={{ border: `1px solid ${T.inner}`, background: T.inset, borderRadius: 8, padding: 9 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Icon size={12} color={color} />
        <Eyebrow>{label}</Eyebrow>
      </div>
      <div style={{ color: T.sub, fontSize: 10.5, fontWeight: 800, marginTop: 5, lineHeight: 1.3 }}>{value}</div>
    </div>
  );
}

const DRAFT_META: Record<IssueId, { channel: string; metric: string }> = {
  rewards: { channel: "Push · WhatsApp (service)", metric: "Repeat-spend recovery within 30d" },
  app: { channel: "In-app · SMS fallback", metric: "Self-service payment recovery" },
  payments: { channel: "SMS · email", metric: "Pending-payment resolution SLA" },
  conduct: { channel: "Assisted call · email", metric: "Consent-valid closure rate" },
  emi: { channel: "In-app · push", metric: "Eligible-spend EMI conversion" },
};

function DraftField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ color: T.sub, fontSize: 10.5, fontWeight: 800, marginTop: 3, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

const APPROVER: Record<IssueId, string> = {
  rewards: "A. Menon · Rewards & Portfolio",
  app: "R. Iyer · Digital Cards",
  payments: "S. Nair · Payments & Authorisation",
  conduct: "K. Rao · Conduct & Compliance",
  emi: "D. Shah · Cards Product",
};

function ActionCentre({ issue }: { issue: Issue }) {
  const draft = DRAFT_META[issue.id];
  const [gateByIssue, setGateByIssue] = useState<Record<string, "draft" | "approved" | "live">>({});
  const stage = gateByIssue[issue.id] ?? "draft";
  const setStage = (s: "draft" | "approved" | "live") => setGateByIssue((m) => ({ ...m, [issue.id]: s }));
  const actions = useMemo(() => {
    if (issue.id === "rewards") {
      return [
        "Validate impacted premium cohorts and benefit-usage behaviour",
        "Prepare targeted retention proposition for high-value cardholders",
        "Review earn, redemption fee and benefit communication before next campaign",
      ];
    }
    if (issue.id === "app") {
      return [
        "Isolate OTP, UCIC and card-visibility failure populations",
        "Publish alternate payment and servicing route",
        "Track self-service payment recovery after the fix",
      ];
    }
    if (issue.id === "conduct") {
      return [
        "Validate consent and call evidence for affected upgrades",
        "Pause the next similar campaign wave pending review",
        "Prepare fee-remediation and customer-contact cohort for approval",
      ];
    }
    if (issue.id === "payments") {
      return [
        "Reconcile aged pending-payment exceptions",
        "Prioritise cardholders with repeat contact or dispute intent",
        "Send resolution updates after Payments owner approval",
      ];
    }
    return [
      "Validate EMI eligibility-rule gaps",
      "Identify eligible high-ticket transactions not converted",
      "Prepare a human-approved reminder and measure conversion recovery",
    ];
  }, [issue.id]);

  return (
    <SectionCard
      title="Decision and action centre"
      subtitle="Draft response for the selected portfolio issue"
      accent={T.green}
      right={<Pill toneName={issue.ownerTone}>{issue.owner}</Pill>}
      style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingRight: 4 }}>
      <div style={{ borderRadius: 9, border: `1px solid ${T.inner}`, background: T.inset, padding: 11 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <Eyebrow color={T.green}>Selected issue</Eyebrow>
            <div style={{ color: T.text, fontSize: 14, fontWeight: 900, marginTop: 3 }}>{issue.title}</div>
            <div style={{ color: T.muted, fontSize: 10.5, marginTop: 3 }}>{issue.product}</div>
          </div>
          <Pill toneName="amber">Draft ready</Pill>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "9px 12px",
            marginTop: 11,
            paddingTop: 11,
            borderTop: `1px solid ${T.inner}`,
          }}
        >
          <DraftField label="Cohort" value={`${issue.product} · ${issue.affected}`} />
          <DraftField label="Signal" value={issue.portfolioMovement} />
          <DraftField label="Channel" value={draft.channel} />
          <DraftField label="Est. reach" value={issue.affected} />
          <DraftField
            label="Guardrails"
            value={
              <span style={{ display: "flex", flexWrap: "wrap", gap: 5, fontFamily: MONO }}>
                <span style={{ background: `${T.green}14`, border: `1px solid ${T.green}40`, borderRadius: 999, padding: "2px 7px", fontSize: 9 }}>no_send_after_2200</span>
                <span style={{ background: `${T.green}14`, border: `1px solid ${T.green}40`, borderRadius: 999, padding: "2px 7px", fontSize: 9 }}>max_1_per_72h</span>
              </span>
            }
          />
          <DraftField label="Success metric" value={draft.metric} />
        </div>

        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.inner}`, fontSize: 9.5, color: T.dim, lineHeight: 1.4 }}>
          Privacy: cohort-level view · identity-level access gated and logged · consent- and purpose-limited (DPDP).
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {actions.map((action, index) => (
            <div key={action} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${T.green}1b`,
                  color: T.green,
                  fontFamily: MONO,
                  fontSize: 9,
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>
              <span style={{ color: T.sub, fontSize: 11.5, lineHeight: 1.45 }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 9 }}>
        <StatusTile icon={Target} label="Decision owner" value={issue.owner} color={T.cyan} />
        <StatusTile icon={CheckCircle2} label="Control" value="Human approval required" color={T.green} />
        <StatusTile icon={ShieldAlert} label="Claim posture" value="Needs validation" color={T.amber} />
        <StatusTile icon={Zap} label="Automation" value="Never auto-fires" color={T.red} />
      </div>

      {stage === "draft" ? (
        <button
          type="button"
          onClick={() => setStage("approved")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 10,
            borderRadius: 9,
            border: `1px solid ${T.green}66`,
            background: `${T.green}18`,
            color: T.green,
            padding: "9px 12px",
            fontWeight: 900,
            fontSize: 11.5,
            cursor: "pointer",
          }}
        >
          Approve draft — Gate 1 (owner) <CheckCircle2 size={14} />
        </button>
      ) : (
        <div style={{ marginTop: 10, borderRadius: 9, border: `1px solid ${T.green}55`, background: `${T.green}10`, padding: "9px 11px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} color={T.green} />
            <span style={{ color: T.green, fontSize: 10.5, fontWeight: 900 }}>Gate 1 · Approved</span>
          </div>
          <div style={{ color: T.sub, fontSize: 10, fontFamily: MONO, marginTop: 5, lineHeight: 1.4 }}>
            approved by {APPROVER[issue.id]} · 24 Jul 07:14 IST · evidence v3 · routed to {issue.owner}
          </div>
        </div>
      )}

      {stage === "approved" ? (
        <button
          type="button"
          onClick={() => setStage("live")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
            borderRadius: 9,
            border: `1px solid ${T.cyan}66`,
            background: `${T.cyan}18`,
            color: T.cyan,
            padding: "9px 12px",
            fontWeight: 900,
            fontSize: 11.5,
            cursor: "pointer",
          }}
        >
          Engineering configured &amp; tested — confirm go-live (Gate 2) <ArrowUpRight size={14} />
        </button>
      ) : null}

      {stage === "live" ? (
        <div style={{ marginTop: 8, borderRadius: 9, border: `1px solid ${T.cyan}55`, background: `${T.cyan}10`, padding: "9px 11px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} color={T.cyan} />
            <span style={{ color: T.cyan, fontSize: 10.5, fontWeight: 900 }}>Gate 2 · Live</span>
          </div>
          <div style={{ color: T.sub, fontSize: 10, fontFamily: MONO, marginTop: 5, lineHeight: 1.4 }}>
            configured &amp; tested by Engineering · go-live confirmed by {issue.owner} manager · 24 Jul 09:02 IST
          </div>
        </div>
      ) : null}
      </div>
    </SectionCard>
  );
}

export function IndusIndCardsCustomerPortfolioDrill({ go, onBack }: { go?: NavigateFn; onBack?: () => void } = {}) {
  const [activeIssueId, setActiveIssueId] = useState<IssueId>("rewards");
  const activeIssue = ISSUE_CATALOGUE.find((issue) => issue.id === activeIssueId) || ISSUE_CATALOGUE[0];
  const topIssue = ISSUE_CATALOGUE[0];
  const handleBack = onBack || (() => go?.("overview"));

  return (
    <div
      className="icpd fade"
      style={{
        background: T.bg,
        color: T.text,
        minHeight: "100%",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontWeight: 600,
      }}
    >
      <style>{`
        .icpd *{box-sizing:border-box}
        .icpd.fade{animation:icpdf .22s ease-out}
        @keyframes icpdf{from{opacity:.3;transform:translateY(6px)}to{opacity:1;transform:none}}
        .icpd button:focus-visible{outline:2px solid ${T.gold};outline-offset:2px}
        .icpd-top-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr) minmax(280px,.78fr);gap:12px;margin-bottom:12px;align-items:stretch}
        .icpd-row-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:12px;align-items:stretch}
        .icpd-final-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr);gap:12px;margin-bottom:12px;align-items:start}
        .icpd-pressure-body{display:grid;grid-template-columns:minmax(180px,.78fr) minmax(0,1.22fr);gap:8px;align-items:center}
        .icpd-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
        .icpd-matrix-scroll{overflow-x:auto;padding-bottom:4px}
        .icpd-matrix{display:grid;gap:4px;align-items:center;min-width:470px}
        .icpd-matrix-header{border:none;background:transparent;padding:2px;color:${T.muted};font-size:8.5px;font-weight:800;line-height:1.2;text-align:center;cursor:pointer}
        .icpd-lifecycle{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
        .icpd-bubble-chart{position:relative;height:232px;border-left:1px solid ${T.inner};border-bottom:1px solid ${T.inner};margin:6px 8px 16px 24px;background-image:linear-gradient(${T.inner}55 1px,transparent 1px),linear-gradient(90deg,${T.inner}55 1px,transparent 1px);background-size:25% 25%}
        .icpd-axis-y{position:absolute;left:-46px;top:50%;transform:rotate(-90deg);color:${T.dim};font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
        .icpd-axis-x{position:absolute;right:0;bottom:-18px;color:${T.dim};font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
        .icpd-quadrant-label{position:absolute;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.05em}
        .icpd-priority-table{display:flex;flex-direction:column;gap:6px;overflow-x:auto}
        .icpd-priority-head,.icpd-priority-row{display:grid;grid-template-columns:52px minmax(170px,1.3fr) minmax(96px,.7fr) minmax(96px,.7fr) 62px 70px minmax(116px,.8fr);gap:9px;align-items:center;min-width:860px}
        .icpd-priority-head{padding:0 9px 4px;color:${T.dim};font-size:8.5px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
        .icpd-priority-row{border:1px solid ${T.inner};border-radius:9px;padding:9px;background:${T.inset};color:${T.sub};cursor:pointer;text-align:left;font-size:10.5px}
        .icpd-priority-row span:nth-child(2){display:flex;flex-direction:column;gap:2px}
        .icpd-priority-row small{color:${T.muted};font-size:9px}
        .icpd-query-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
        @media(max-width:1280px){.icpd-top-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.icpd-ai-card{grid-column:1/-1}.icpd-row-3{grid-template-columns:repeat(2,minmax(0,1fr))}.icpd-row-3>section:last-child{grid-column:1/-1}.icpd-lifecycle{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:900px){.icpd-top-grid,.icpd-row-3,.icpd-final-grid{grid-template-columns:1fr}.icpd-row-3>section:last-child,.icpd-ai-card{grid-column:auto}.icpd-pressure-body{grid-template-columns:1fr}.icpd-query-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:620px){.icpd-lifecycle,.icpd-query-grid,.icpd-mini-grid{grid-template-columns:1fr}.icpd{padding:0}.icpd-bubble-chart{height:260px}}
        @media(prefers-reduced-motion:reduce){.icpd.fade{animation:none}}
      `}</style>

      <DrillHeader onBack={handleBack} />

      <div className="icpd-top-grid" style={{ gridTemplateColumns: "minmax(0,1.15fr) minmax(280px,.85fr)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <PressureRadar issue={topIssue} />
          <ProductIssueMatrix />
        </div>
        <ExecutiveAI issue={topIssue} />
      </div>

      <div className="icpd-row-3" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <LifecycleMap />
        <HighValueExposure />
      </div>

      <div className="icpd-row-3" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <IssueConfidence />
        <EmergingPatterns />
      </div>

      <div className="icpd-final-grid" style={{ alignItems: "stretch" }}>
        <PriorityBoard activeIssue={activeIssueId} onSelect={setActiveIssueId} />
        <div style={{ position: "relative", minWidth: 0, minHeight: 0 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            <ActionCentre issue={activeIssue} />
          </div>
        </div>
      </div>

      <div style={{ height: 28 }} />
    </div>
  );
}

export default IndusIndCardsCustomerPortfolioDrill;
