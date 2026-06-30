"use client";

import { type CSSProperties, type ReactNode, useState } from "react";
import { ArrowLeft, Sparkles, AlertTriangle, TrendingDown, TrendingUp, Activity, ShieldCheck, Phone, MessageSquare, Mail, Ticket, Flag, Calendar, UserCheck, Eye, ChevronRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";

// Reused, generic-enough drop-ins
import { IntentScoreHeatmap } from "@/components/FCI/IntentScoreHeatmap";
import { SmartAgentActionList } from "@/components/FCI/SmartAgentActionList";
import { agentActionData } from "@/lib/fci-lib/fciAdvancedData";
import { ChannelSentimentSplitChart, type ChannelSentimentSplitEntry } from "@/components/social/ChannelSentimentSplitChart";

// Reused from retail drill-downs (these are role-based local copies — generic content)
import { RetailSLAPerformanceOverview } from "./RetailSLAPerformanceOverview";
import { RetailIntentPressureAlerts } from "./RetailIntentPressureAlerts";
import {
  STERLING_HEAD_CONTACT_LEADING_INTENTS,
  STERLING_HEAD_CONTACT_REPEAT_BY_INTENT,
  STERLING_HEAD_CONTACT_RECOVERY_TOP_INTENTS,
  type SterlingContactRecoveryQuadrantId,
} from "@/lib/role-based-dashboard/sterlingHeadContactIntentsData";
import {
  STERLING_HEAD_CONTACT_DRILL1_INSIGHTS,
  STERLING_HEAD_CONTACT_DRILL2_INSIGHTS,
  STERLING_HEAD_CONTACT_DRILL3_INSIGHTS,
} from "@/lib/role-based-dashboard/sterlingHeadContactAISummaryData";

/* ─────────────────────────────────────────────────────────────────────────
   Shared shells — DrillPageHeader · AIPanel · HeroSummaryWall · ChartTip
   ──────────────────────────────────────────────────────────────────────── */

function DrillPageHeader({
  onBack, title, sub, headerRight,
}: { onBack: () => void; title: string; sub: string; headerRight?: ReactNode }) {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: T.elevated,
            border: `1px solid ${T.borderLight}`, borderRadius: 10, padding: "8px 16px",
            cursor: "pointer", color: T.textSec, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit", transition: "all 0.2s", flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.text;
            e.currentTarget.style.borderColor = T.cyan;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.textSec;
            e.currentTarget.style.borderColor = T.borderLight;
          }}
        >
          <ArrowLeft size={14} />
          Back to Overview
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>{title}</div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 3, maxWidth: 820 }}>{sub}</div>
        </div>
      </div>
      {headerRight}
    </div>
  );
}

function AIPanel({
  title, subtitle, children, accentColor, ai = false, aiModel, fill = false, headerRight, padding = 18,
}: {
  title: string; subtitle?: string; children: ReactNode;
  accentColor?: string; ai?: boolean; aiModel?: string; fill?: boolean;
  headerRight?: ReactNode; padding?: number;
}) {
  const T = useDashboardTheme();
  const accent = accentColor || T.cyan;
  return (
    <div style={{
      background: T.elevated,
      borderTop: `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderRight: `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderBottom: `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 14,
      padding,
      position: ai ? "relative" : undefined,
      overflow: ai ? "hidden" : undefined,
      height: fill ? "100%" : undefined,
      display: fill ? "flex" : undefined,
      flexDirection: fill ? "column" : undefined,
    }}>
      {ai ? (
        <div style={{
          position: "absolute", top: -40, right: -40, width: 120, height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      ) : null}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 10, marginBottom: 12, position: "relative", zIndex: 1,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {ai ? <span style={{ fontSize: 14, lineHeight: 1 }}>✨</span> : null}
            <span style={{
              fontSize: 12.5, fontWeight: 700, color: T.text,
              textTransform: "uppercase", letterSpacing: 0.8,
            }}>{title}</span>
          </div>
          {subtitle ? (
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>{subtitle}</div>
          ) : null}
        </div>
        {headerRight ? (
          <div style={{ flexShrink: 0 }}>{headerRight}</div>
        ) : ai ? (
          <span style={{
            fontSize: 9, fontWeight: 800, color: accent,
            letterSpacing: 0.7, textTransform: "uppercase",
            padding: "3px 8px", borderRadius: 999,
            background: `${accent}15`, border: `1px solid ${accent}40`,
            display: "inline-flex", alignItems: "center", gap: 4,
            flexShrink: 0, whiteSpace: "nowrap",
          }}>
            <Sparkles size={9} />
            {aiModel ? `AI · ${aiModel}` : "AI"}
          </span>
        ) : null}
      </div>
      {fill ? (
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
          {children}
        </div>
      ) : children}
    </div>
  );
}

function ChartTip({ active, payload, label, T, valueSuffix = "" }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "rgba(10,14,22,0.96)", border: `1px solid ${T.borderLight}`,
      borderRadius: 8, padding: "8px 11px", fontSize: 11,
    }}>
      {label !== undefined ? (
        <div style={{ color: T.text, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      ) : null}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: T.textSec }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>
            {p.value}{valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

type HeroInsight = {
  tone: "danger" | "warning" | "info" | "success";
  title: string;
  body: string;
};

function HeroSummaryWall({ accentColor, insights }: { accentColor?: string; insights: HeroInsight[] }) {
  const T = useDashboardTheme();
  const accent = accentColor || T.amber;
  const toneColor = (tone: HeroInsight["tone"]): string => {
    if (tone === "danger") return T.red;
    if (tone === "warning") return T.amber;
    if (tone === "success") return T.green;
    return T.cyan;
  };
  return (
    <AIPanel
      title="AI Summary Wall"
      subtitle="3-second takeaway · ranked by business impact"
      accentColor={accent}
      ai
      aiModel="Insight Ranker"
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.map((ins, i) => {
          const c = toneColor(ins.tone);
          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", gap: 4,
              padding: "10px 12px", borderRadius: 10,
              background: `${c}10`,
              borderTop: `1px solid ${c}30`,
              borderRight: `1px solid ${c}30`,
              borderBottom: `1px solid ${c}30`,
              borderLeft: `3px solid ${c}`,
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>
                {i + 1}. {ins.title}
              </div>
              <div style={{ fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>{ins.body}</div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

function StatPill({
  label, value, delta, deltaTone = "down", target, color, fill = "transparent",
}: {
  label: string; value: string; delta?: string;
  deltaTone?: "up" | "down" | "flat";
  target?: string; color: string; fill?: string;
}) {
  const T = useDashboardTheme();
  const deltaColor = deltaTone === "up" ? T.green : deltaTone === "down" ? T.red : T.textMut;
  const Icon = deltaTone === "up" ? TrendingUp : deltaTone === "down" ? TrendingDown : Activity;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: fill,
      borderTop: `3px solid ${color}`,
      borderRight: `1px solid ${color}40`,
      borderBottom: `1px solid ${color}40`,
      borderLeft: `1px solid ${color}40`,
      borderRadius: 10, padding: "11px 12px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "var(--mono)", lineHeight: 1 }}>{value}</span>
        {delta ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 10.5, fontWeight: 800, color: deltaColor, fontFamily: "var(--mono)" }}>
            <Icon size={10} />
            {delta}
          </span>
        ) : null}
      </div>
      {target ? <div style={{ fontSize: 10, color: T.textMut }}>{target}</div> : null}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   DRILL 1 — Is every contact ending well?  (default)
   Sterling variant: sterling-service-attrition — franchise consequence drill
   sterling-contact — retail layout with UK intent labels (Sterling head_contact)
   ═════════════════════════════════════════════════════════════════════════ */

export type ContactExperienceDrillVariant =
  | "default"
  | "sterling-contact"
  | "sterling-service-attrition";

function usesSterlingContactIntents(
  variant?: ContactExperienceDrillVariant,
): boolean {
  return (
    variant === "sterling-contact" || variant === "sterling-service-attrition"
  );
}

const CONTACT_HEALTH_TREND = [
  { w: "W-11", v: 76 }, { w: "W-10", v: 74 }, { w: "W-9", v: 73 }, { w: "W-8", v: 72 },
  { w: "W-7",  v: 70 }, { w: "W-6",  v: 69 }, { w: "W-5", v: 68 }, { w: "W-4", v: 67 },
  { w: "W-3",  v: 66 }, { w: "W-2",  v: 65 }, { w: "W-1", v: 64 }, { w: "Now", v: 64 },
];

const CONTACT_KPI_PACK = [
  { label: "Post-Contact CSAT", value: "78%", delta: "−4", target: "Target > 85%", color: "#F59E0B" },
  { label: "First Contact Resolution", value: "74%", delta: "−3", target: "Target > 80%", color: "#EF4444" },
  { label: "Repeat Contact Rate", value: "22%", delta: "+4", target: "Target < 15%", color: "#EF4444" },
  { label: "Premature Closure", value: "7%", delta: "+2", target: "Target < 3%", color: "#EF4444" },
  { label: "Tone Drift Flags", value: "18%", delta: "+5", target: "Target < 8%", color: "#EF4444" },
];

const QUALITY_MATRIX = [
  { ch: "Voice", icon: Phone,        csat: 81, fcr: 78, repeat: 19, premature: 6,  tone: 14 },
  { ch: "Chat",  icon: MessageSquare, csat: 76, fcr: 71, repeat: 24, premature: 9,  tone: 22 },
  { ch: "Email", icon: Mail,          csat: 79, fcr: 70, repeat: 20, premature: 5,  tone: 12 },
  { ch: "Ticket", icon: Ticket,       csat: 74, fcr: 66, repeat: 27, premature: 11, tone: 16 },
];

const REPEAT_BY_INTENT = [
  { intent: "Fee Dispute",          repeats: 412, share: 31, color: "#EF4444" },
  { intent: "HELOC Rate Query",     repeats: 248, share: 18, color: "#F59E0B" },
  { intent: "Mortgage Servicing",   repeats: 196, share: 15, color: "#FBBF24" },
  { intent: "Card Replacement",     repeats: 134, share: 10, color: "#22C55E" },
  { intent: "EMI Failure",          repeats: 121, share: 9,  color: "#06B6D4" },
  { intent: "Account Closure",      repeats: 87,  share: 7,  color: "#A78BFA" },
  { intent: "Other",                repeats: 134, share: 10, color: "#64748B" },
];

const STERLING_ATTRITION_RISK_TREND = [
  { w: "W-11", v: 62 }, { w: "W-10", v: 63 }, { w: "W-9", v: 63 }, { w: "W-8", v: 64 },
  { w: "W-7",  v: 65 }, { w: "W-6",  v: 65 }, { w: "W-5", v: 66 }, { w: "W-4", v: 66 },
  { w: "W-3",  v: 67 }, { w: "W-2",  v: 67 }, { w: "W-1", v: 68 }, { w: "Now", v: 68 },
];

const STERLING_FRANCHISE_KPI_PACK = [
  { label: "Service-driven switch-intent", value: "22%", delta: "+8", target: "Franchise risk ↑", color: "#EF4444", deltaTone: "down" as const },
  { label: "Avoidable cost-to-serve / wk", value: "£142K", delta: "+£18K", target: "vs £124K prior wk", color: "#EF4444", deltaTone: "down" as const },
  { label: "Agentic-AI containment", value: "84%", delta: "−3", target: "H6 · target > 90%", color: "#F59E0B", deltaTone: "down" as const },
  { label: "Avoidable repeat-contact", value: "19%", delta: "+5", target: "Cost-to-serve driver", color: "#EF4444", deltaTone: "down" as const },
  { label: "Reputation→acquisition drag", value: "−11 pts", delta: "w/w", target: "Acquisition-channel NPS", color: "#EF4444", deltaTone: "down" as const },
];

const STERLING_COST_MATRIX = [
  { ch: "Phone",       icon: Phone,         switchIntent: 22, avoidRepeat: 19, costLeak: 48, containment: 86 },
  { ch: "In-app chat", icon: MessageSquare, switchIntent: 26, avoidRepeat: 24, costLeak: 62, containment: 82 },
  { ch: "Email",       icon: Mail,          switchIntent: 18, avoidRepeat: 20, costLeak: 34, containment: 88 },
  { ch: "Complaints",  icon: Flag,          switchIntent: 24, avoidRepeat: 27, costLeak: 41, containment: 79 },
];

const STERLING_POOR_ENDING_CHANNELS = ["Phone", "Chat", "Email", "Complaints"] as const;
type SterlingPoorEndingChannel = typeof STERLING_POOR_ENDING_CHANNELS[number];

const STERLING_POOR_ENDING_CHANNEL_COLORS: Record<SterlingPoorEndingChannel, string> = {
  Phone: "#EF4444",
  Chat: "#F59E0B",
  Email: "#06B6D4",
  Complaints: "#A78BFA",
};

type SterlingPoorEndingDetail = {
  category: string;
  total: number;
  channels: Record<SterlingPoorEndingChannel, number>;
  worstChannels: SterlingPoorEndingChannel[];
  switchIntent: number;
  avoidRepeat: number;
  costLeakK: number;
  mainReason: string;
  aiInsight: string;
  recommendedFix: string;
};

const STERLING_POOR_ENDING_CONTACTS: SterlingPoorEndingDetail[] = [
  {
    category: "Account Access & Security",
    total: 2847,
    channels: { Phone: 712, Chat: 1023, Email: 398, Complaints: 714 },
    worstChannels: ["Chat", "Complaints"],
    switchIntent: 28, avoidRepeat: 24, costLeakK: 38,
    mainReason: "Passcode/PIN reset and account-lockout flows close before the customer can transact — switch-intent follows.",
    aiInsight: "Passcode/PIN reset and account-lockout flows are creating unresolved closures and override calls.",
    recommendedFix: "Push passcode reset to in-app self-serve; add closure-confirmation step before ending chat — route flow change to COO.",
  },
  {
    category: "Card & Payments",
    total: 2134,
    channels: { Phone: 982, Chat: 254, Email: 543, Complaints: 355 },
    worstChannels: ["Phone", "Email"],
    switchIntent: 31, avoidRepeat: 27, costLeakK: 44,
    mainReason: "Payment declines and card blocks drive repeat contacts before funds clear — cost-to-serve leak on avoidable voice.",
    aiInsight: "False-positive payee blocks trigger override calls; customers re-contact before the decline reason is visible in-app.",
    recommendedFix: "Route rule-tuning to fraud-ops; surface decline reason in-app before human handoff — never auto-send.",
  },
  {
    category: "Savings & Easy-Saver",
    total: 1432,
    channels: { Phone: 467, Chat: 524, Email: 178, Complaints: 263 },
    worstChannels: ["Chat", "Phone"],
    switchIntent: 35, avoidRepeat: 22, costLeakK: 29,
    mainReason: "Interest-rate and Easy-Saver queries end without save context — switch language appears in voice within 48h.",
    aiInsight: "Savings decline and rate-removal voice precedes outbound transfers; franchise attrition risk concentrated here.",
    recommendedFix: "Draft save-offer for flight-risk savers — never auto-send; Distil switch-intent for primacy cohort.",
  },
  {
    category: "Fraud & Scam",
    total: 1654,
    channels: { Phone: 794, Chat: 149, Email: 463, Complaints: 248 },
    worstChannels: ["Phone", "Complaints"],
    switchIntent: 24, avoidRepeat: 19, costLeakK: 31,
    mainReason: "Scam-report journeys close at 'report logged' while funds remain at risk — repeat contacts inflate cost-to-serve.",
    aiInsight: "Containment failures on scam intents drive avoidable repeats; FOS / Consumer Duty exposure on outcome clarity.",
    recommendedFix: "Escalate fraud-ops playbook update to COO; Raghu tracks franchise harm from repeat scam contacts.",
  },
  {
    category: "Direct Debit & Payroll",
    total: 1287,
    channels: { Phone: 232, Chat: 579, Email: 154, Complaints: 322 },
    worstChannels: ["Chat", "Complaints"],
    switchIntent: 26, avoidRepeat: 21, costLeakK: 26,
    mainReason: "Payroll and mandate failures close without confirming the next payment date — primacy customers re-contact.",
    aiInsight: "Salary-switch precursors cluster on mandate failures; switch-intent rises before CASS data moves.",
    recommendedFix: "Expand Assistant containment on mandate status; draft payroll-switch retention outreach — never auto-send.",
  },
  {
    category: "Onboarding & KYC",
    total: 1184,
    channels: { Phone: 312, Chat: 498, Email: 214, Complaints: 160 },
    worstChannels: ["Chat", "Phone"],
    switchIntent: 19, avoidRepeat: 18, costLeakK: 22,
    mainReason: "Viable applicants stall on document re-submission — growth lost and avoidable support cost compound.",
    aiInsight: "Onboarding friction inflates cost-to-serve without deposit capture; viable-rejected voice rising.",
    recommendedFix: "Escalate KYC-criteria calibration to CRO; Raghu tracks growth lost + experience of viable-rejected.",
  },
  {
    category: "Account Closure & Switching",
    total: 1543,
    channels: { Phone: 821, Chat: 198, Email: 312, Complaints: 212 },
    worstChannels: ["Phone", "Complaints"],
    switchIntent: 38, avoidRepeat: 16, costLeakK: 36,
    mainReason: "Closure intents handled as informational — switch-intent in voice precedes outbound transfers.",
    aiInsight: "'Moving to Monzo/Chase' language in voice before balances clear; retention window narrowing.",
    recommendedFix: "Draft retention/service-fix for switch-intent cohort — never auto-send; route queue execution to COO.",
  },
];

const STERLING_RETENTION_EXPOSURE = [
  {
    rank: 1,
    label: "Primary-account · switch-intent voice",
    balance: "£842K",
    accounts: 284,
    primacy: "Primary",
    action: "Draft save-offer for flight-risk cohort — never auto-send",
  },
  {
    rank: 2,
    label: "High-balance · fee/charge dispute repeat",
    balance: "£410K",
    accounts: 156,
    primacy: "Primary",
    action: "Draft fee-resolution outreach — never auto-send",
  },
  {
    rank: 3,
    label: "Easy-Saver · rate-removal voice",
    balance: "£318K",
    accounts: 92,
    primacy: "Secondary",
    action: "Draft Easy-Saver save-offer — never auto-send",
  },
  {
    rank: 4,
    label: "Payment-declined · repeat within 7d",
    balance: "£186K",
    accounts: 214,
    primacy: "Primary",
    action: "Route containment fix to fraud-ops; quantify cost-to-serve here",
  },
];

const STERLING_DRILL1_INSIGHTS: HeroInsight[] = [
  {
    tone: "danger",
    title: "Avoidable cost-to-serve concentrates on Email + Chat",
    body: "Email avoid-repeat 20% and Chat switch-intent 26% are the worst cells. These two channels account for ~58% of avoidable cost-to-serve this week.",
  },
  {
    tone: "warning",
    title: "Fee/charge disputes and payment declines drive ~49% of avoidable repeats",
    body: "412 + 248 avoidable repeats — 49% of total. Avoidable repeats inflate cost-to-serve; route containment and dispute flows to COO.",
  },
  {
    tone: "info",
    title: "Switch-intent rising fastest among primary-account holders",
    body: "Service-driven switch-intent up 8 pts among primacy customers — £842K balance-at-risk in voice before transfers move. Draft retention exposure review.",
  },
];

function ContactHealthHero({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterling = variant === "sterling-service-attrition";
  const trend = isSterling ? STERLING_ATTRITION_RISK_TREND : CONTACT_HEALTH_TREND;
  const score = trend[trend.length - 1].v;
  const start = trend[0].v;
  const delta = score - start;
  const stroke = isSterling ? T.red : T.amber;
  const deltaWorsening = isSterling ? delta > 0 : delta < 0;
  const DeltaIcon = isSterling
    ? delta > 0
      ? TrendingUp
      : TrendingDown
    : TrendingDown;
  return (
    <AIPanel
      title={isSterling ? "Service-driven attrition risk" : "Contact Health Score"}
      subtitle={
        isSterling
          ? "Composite switch-intent, avoidable repeat-contact and cost-to-serve leak · 12-week trend"
          : "Composite of post-contact CSAT, FCR, repeat-contact and tone drift · 12-week trend"
      }
      accentColor={stroke}
      ai
      aiModel={isSterling ? "Franchise Risk Index" : "Contact Quality Index"}
      fill
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) minmax(280px, 1fr)", gap: 16, alignItems: "stretch", flex: 1, width: "100%", minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: stroke, fontFamily: "var(--mono)", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {isSterling ? "attrition risk index" : "out of 100"}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, color: deltaWorsening ? T.red : T.green, fontFamily: "var(--mono)", marginTop: 6 }}>
            <DeltaIcon size={12} />
            {delta > 0 ? `+${delta}` : delta} pts vs 12w ago
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 4, lineHeight: 1.4 }}>
            <strong style={{ color: T.text }}>Verdict:</strong>{" "}
            {isSterling
              ? "Softening service endings are converting to switch-intent in voice before balances move; cost-to-serve rising on avoidable contacts."
              : "contact-quality eroding for the 11th week. Per-contact CSAT and Tone Drift are the lead drag."}
          </div>
        </div>
        <div style={{ minHeight: 160, flex: 1 }}>
          <ResponsiveContainer>
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="contact-health-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="w" stroke={T.textMut} fontSize={10} />
              <YAxis domain={isSterling ? [58, 72] : [55, 80]} stroke={T.textMut} fontSize={10} />
              <Tooltip content={(p: any) => <ChartTip {...p} T={T} valueSuffix={isSterling ? " risk" : " / 100"} />} />
              <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2.5} fill="url(#contact-health-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AIPanel>
  );
}

function ContactKPIPack({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const isSterling = variant === "sterling-service-attrition";
  const pack = isSterling ? STERLING_FRANCHISE_KPI_PACK : CONTACT_KPI_PACK;
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {pack.map((k) => (
        <StatPill
          key={k.label}
          label={k.label}
          value={k.value}
          delta={k.delta}
          deltaTone={
            isSterling
              ? (k as (typeof STERLING_FRANCHISE_KPI_PACK)[number]).deltaTone
              : "down"
          }
          target={k.target}
          color={k.color}
        />
      ))}
    </div>
  );
}

function QualityMatrixPanel({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterling = variant === "sterling-service-attrition";

  const pctCell = (val: number, kind: "good" | "bad") => {
    const isHealthy = kind === "good" ? val >= 80 : val <= 10;
    const isWatch = kind === "good" ? val >= 70 : val <= 20;
    const c = isHealthy ? T.green : isWatch ? T.amber : T.red;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 56, padding: "5px 10px",
        background: `${c}18`, border: `1px solid ${c}45`,
        borderRadius: 6, color: c,
        fontSize: 12.5, fontWeight: 800, fontFamily: "var(--mono)",
      }}>
        {val}%
      </span>
    );
  };

  const sterlingCell = (val: number | string, tone: "good" | "bad" | "money") => {
    const num = typeof val === "number" ? val : parseFloat(val);
    const c =
      tone === "money"
        ? num >= 50
          ? T.red
          : num >= 35
            ? T.amber
            : T.green
        : tone === "good"
          ? num >= 85
            ? T.green
            : num >= 78
              ? T.amber
              : T.red
          : num <= 20
            ? T.green
            : num <= 25
              ? T.amber
              : T.red;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 56, padding: "5px 10px",
        background: `${c}18`, border: `1px solid ${c}45`,
        borderRadius: 6, color: c,
        fontSize: 12.5, fontWeight: 800, fontFamily: "var(--mono)",
      }}>
        {typeof val === "number" && tone === "money" ? `£${val}K` : `${val}${tone === "money" ? "" : "%"}`}
      </span>
    );
  };

  if (isSterling) {
    const sterlingHeaders = ["Channel", "Switch-intent ↑", "Avoid repeat ↓", "Cost leak/wk ↑", "Containment ↑"];
    return (
      <AIPanel
        title="Where avoidable cost-to-serve concentrates by channel"
        subtitle="Switch-intent, avoidable repeat, weekly cost leak and Assistant containment — franchise-weighted read"
        accentColor={T.cyan}
      >
        <div style={{ overflowX: "auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(140px, 1fr) repeat(4, minmax(110px, 1fr))",
            gap: 0, minWidth: 680,
            border: `1px solid ${T.borderLight}`, borderRadius: 10, overflow: "hidden",
          }}>
            {sterlingHeaders.map((label, i) => (
              <div key={`sh-${i}`} style={{
                padding: "10px 12px", background: T.surface,
                borderBottom: `1px solid ${T.borderLight}`,
                fontSize: 10.5, fontWeight: 800, color: T.textSec,
                letterSpacing: 0.6, textTransform: "uppercase",
              }}>
                {label}
              </div>
            ))}
            {STERLING_COST_MATRIX.map((row, ri) => {
              const Icon = row.icon;
              return (
                <div key={`sr-${ri}`} style={{ display: "contents" }}>
                  <div style={{
                    padding: "12px", display: "flex", alignItems: "center", gap: 8,
                    borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                    background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                  }}>
                    <Icon size={14} color={T.cyan} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{row.ch}</span>
                  </div>
                  {[
                    { v: row.switchIntent, tone: "bad" as const },
                    { v: row.avoidRepeat, tone: "bad" as const },
                    { v: row.costLeak, tone: "money" as const },
                    { v: row.containment, tone: "good" as const },
                  ].map((c, ci) => (
                    <div key={`sr-${ri}-c-${ci}`} style={{
                      padding: "12px", display: "flex", alignItems: "center", justifyContent: "flex-start",
                      borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                      background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                    }}>
                      {sterlingCell(c.v, c.tone)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.textMut, lineHeight: 1.5 }}>
          <strong style={{ color: T.red }}>Hotspot:</strong> In-app chat and Complaints carry the highest cost leak and switch-intent · Phone containment holds best.
        </div>
      </AIPanel>
    );
  }

  const headers: { label: string; tip: string }[] = [
    { label: "Channel", tip: "" },
    { label: "Post-CSAT ↑", tip: "Higher = healthier" },
    { label: "FCR ↑", tip: "Higher = healthier" },
    { label: "Repeat ↓", tip: "Lower = healthier" },
    { label: "Premature ↓", tip: "Lower = healthier" },
    { label: "Tone Drift ↓", tip: "Lower = healthier" },
  ];
  return (
    <AIPanel
      title="Quality Matrix · per-channel"
      subtitle="Five quality signals × four contact channels — green: on target, amber: watch, red: breaching"
      accentColor={T.cyan}
    >
      <div style={{ overflowX: "auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(140px, 1fr) repeat(5, minmax(110px, 1fr))",
          gap: 0, minWidth: 720,
          border: `1px solid ${T.borderLight}`, borderRadius: 10, overflow: "hidden",
        }}>
          {headers.map((h, i) => (
            <div key={`h-${i}`} style={{
              padding: "10px 12px", background: T.surface,
              borderBottom: `1px solid ${T.borderLight}`,
              fontSize: 10.5, fontWeight: 800, color: T.textSec,
              letterSpacing: 0.6, textTransform: "uppercase",
            }}>
              {h.label}
            </div>
          ))}
          {QUALITY_MATRIX.map((row, ri) => {
            const Icon = row.icon;
            return (
              <div key={`r-${ri}`} style={{ display: "contents" }}>
                <div style={{
                  padding: "12px", display: "flex", alignItems: "center", gap: 8,
                  borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                  background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                }}>
                  <Icon size={14} color={T.cyan} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{row.ch}</span>
                </div>
                {[
                  { v: row.csat, kind: "good" as const },
                  { v: row.fcr, kind: "good" as const },
                  { v: row.repeat, kind: "bad" as const },
                  { v: row.premature, kind: "bad" as const },
                  { v: row.tone, kind: "bad" as const },
                ].map((c, ci) => (
                  <div key={`r-${ri}-c-${ci}`} style={{
                    padding: "12px", display: "flex", alignItems: "center", justifyContent: "flex-start",
                    borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                    background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                  }}>
                    {pctCell(c.v, c.kind)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: T.textMut, lineHeight: 1.5 }}>
        <strong style={{ color: T.red }}>Hotspot:</strong> Ticket and Chat carry the worst Repeat + Premature Closure scores · Voice quality holds best.
      </div>
    </AIPanel>
  );
}

function RepeatContactByIntentPanel({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterlingFranchise = variant === "sterling-service-attrition";
  const data = (
    usesSterlingContactIntents(variant)
      ? STERLING_HEAD_CONTACT_REPEAT_BY_INTENT
      : REPEAT_BY_INTENT
  ).map((r) => ({ ...r }));
  return (
    <AIPanel
      title="Where do customers come back?"
      subtitle={
        isSterlingFranchise
          ? "Avoidable repeat-contact by intent · cost-to-serve concentration"
          : "Repeat-contact volume by intent · top playbook gaps"
      }
      accentColor={T.amber}
      ai
      aiModel="Repeat-Contact Mining"
      fill
    >
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
            <XAxis type="number" stroke={T.textMut} fontSize={10} />
            <YAxis type="category" dataKey="intent" stroke={T.textSec} fontSize={11} width={130} />
            <Tooltip cursor={{ fill: `${T.cyan}10` }} content={(p: any) => <ChartTip {...p} T={T} valueSuffix=" repeats" />} />
            <Bar dataKey="repeats" radius={[0, 6, 6, 0]}>
              {data.map((row, idx) => <Cell key={idx} fill={row.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textMut }}>
        <span>Top 2 intents = 49% of {isSterlingFranchise ? "avoidable repeats" : "all repeats"}</span>
        <span style={{ color: T.amber, fontWeight: 700 }}>
          {isSterlingFranchise ? "Cost-to-serve concentration" : "Playbook gap detected"}
        </span>
      </div>
    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROW 4 · Where contacts fail to end well
   Stacked bar by channel + focused side panel (worst channel · repeat ·
   premature · tone drift · main reason · AI insight · recommended fix)
   ──────────────────────────────────────────────────────────────────────── */

const POOR_ENDING_CHANNELS = ["Voice", "Chat", "Email", "Ticket"] as const;
type PoorEndingChannel = typeof POOR_ENDING_CHANNELS[number];

const POOR_ENDING_CHANNEL_COLORS: Record<PoorEndingChannel, string> = {
  Voice: "#EF4444",
  Chat: "#F59E0B",
  Email: "#06B6D4",
  Ticket: "#A78BFA",
};

type PoorEndingDetail = {
  category: string;
  total: number;
  channels: Record<PoorEndingChannel, number>;
  worstChannels: PoorEndingChannel[];
  repeat: number;
  premature: number;
  toneDrift: number;
  mainReason: string;
  aiInsight: string;
  recommendedFix: string;
};

const POOR_ENDING_CONTACTS: PoorEndingDetail[] = [
  {
    category: "Account Access & Security",
    total: 2847,
    channels: { Voice: 712, Chat: 1023, Email: 398, Ticket: 714 },
    worstChannels: ["Chat", "Ticket"],
    repeat: 28, premature: 9, toneDrift: 22,
    mainReason: "Customers are being marked resolved while authentication reset remains incomplete.",
    aiInsight: "SafePass reset and account lockout flows are creating unresolved closures.",
    recommendedFix: "Push SafePass reset to self-service and add closure-confirmation script before ending chat.",
  },
  {
    category: "Transaction Disputes & Fraud",
    total: 2134,
    channels: { Voice: 982, Chat: 254, Email: 543, Ticket: 355 },
    worstChannels: ["Voice", "Email"],
    repeat: 31, premature: 11, toneDrift: 19,
    mainReason: "Provisional credit timing and dispute decisions trigger repeat contacts before resolution lands.",
    aiInsight: "Fraud queue closes the case at 'investigation submitted' but the customer-visible status still says 'open'.",
    recommendedFix: "Hold case-close until provisional credit posts and the status change is mirrored in the app and email.",
  },
  {
    category: "Fee Complaints & Waivers",
    total: 1432,
    channels: { Voice: 467, Chat: 524, Email: 178, Ticket: 263 },
    worstChannels: ["Chat", "Voice"],
    repeat: 35, premature: 8, toneDrift: 26,
    mainReason: "Agents waive but don't explain — customer returns when the next statement still shows the fee.",
    aiInsight: "No standard fee-explanation script · agents close on 'waiver requested' before the reversal posts.",
    recommendedFix: "Auto-confirm waiver in real time, attach a short reason-code letter, end chat only after confirmation.",
  },
  {
    category: "Loan & Mortgage Inquiries",
    total: 1654,
    channels: { Voice: 794, Chat: 149, Email: 463, Ticket: 248 },
    worstChannels: ["Voice", "Email"],
    repeat: 24, premature: 7, toneDrift: 16,
    mainReason: "HELOC rate-reset queries answered ad-hoc — agents close as 'informed' while the customer is mid-decision.",
    aiInsight: "No HELOC playbook · 38% of repeats come back within 48h asking the same rate-reset question.",
    recommendedFix: "Stand up a HELOC rate-reset playbook plus a scheduled 24h follow-up email with rate scenarios.",
  },
  {
    category: "Digital Banking & Technology",
    total: 1287,
    channels: { Voice: 232, Chat: 579, Email: 154, Ticket: 322 },
    worstChannels: ["Chat", "Ticket"],
    repeat: 26, premature: 12, toneDrift: 21,
    mainReason: "Erica/app issues 'workaround-resolved' without root-cause logging — defects re-surface on next session.",
    aiInsight: "82% process-error driven · in-app reporting gap means tickets close with 'advised to retry'.",
    recommendedFix: "Auto-attach the session log to the ticket and force a defect-link before chat closure on app-crash intents.",
  },
  {
    category: "Branch & ATM Services",
    total: 987,
    channels: { Voice: 513, Chat: 247, Email: 79, Ticket: 148 },
    worstChannels: ["Voice", "Chat"],
    repeat: 19, premature: 6, toneDrift: 14,
    mainReason: "Branch-phone loop · customer routed back to branch but the appointment slot has already passed.",
    aiInsight: "Cardless ATM and appointment booking issues bounce 3+ times before resolution.",
    recommendedFix: "Allow contact-centre agents to book branch appointments directly with hold-confirmation.",
  },
];

function StackedChannelTooltip({
  active, payload, label, T,
}: { active?: boolean; payload?: any[]; label?: string; T: DashboardThemeTokens }) {
  if (!active || !payload || !payload.length) return null;
  const total = payload.reduce((sum: number, p: any) => sum + (p.value ?? 0), 0);
  return (
    <div style={{
      background: "rgba(10,14,22,0.96)", border: `1px solid ${T.borderLight}`,
      borderRadius: 8, padding: "10px 12px", fontSize: 11, minWidth: 200,
    }}>
      <div style={{ color: T.text, fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, color: T.textSec, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill }} />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", color: T.textMut }}>
        <span>Total</span>
        <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

function PoorEndingDetailPanel({ selected }: { selected: PoorEndingDetail }) {
  const T = useDashboardTheme();
  const metricColor = (val: number, threshold: number) => (val >= threshold ? T.red : T.amber);
  const metrics: { label: string; value: number; threshold: number }[] = [
    { label: "Repeat",     value: selected.repeat,     threshold: 25 },
    { label: "Premature",  value: selected.premature,  threshold: 8  },
    { label: "Tone Drift", value: selected.toneDrift,  threshold: 18 },
  ];
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12,
      background: T.surface, border: `1px solid ${T.borderLight}`,
      borderRadius: 12, padding: 14, minHeight: 340,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 4 }}>{selected.category}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", lineHeight: 1 }}>
            {selected.total.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: T.textMut }}>poor-ending contacts</span>
        </div>
        <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>
          <span style={{ color: T.textMut }}>Worst channel: </span>
          <strong style={{ color: T.red }}>{selected.worstChannels.join(" + ")}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {metrics.map((m) => {
          const c = metricColor(m.value, m.threshold);
          return (
            <div key={m.label} style={{
              background: `${c}12`, border: `1px solid ${c}40`,
              borderRadius: 8, padding: "8px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: "var(--mono)", marginTop: 2 }}>
                {m.value}%
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div style={{ fontSize: 9, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
          Main reason
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.mainReason}</div>
      </div>

      <div style={{
        background: `${T.purple}10`, border: `1px solid ${T.purple}35`,
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Sparkles size={11} color={T.purple} />
          <span style={{ fontSize: 9, fontWeight: 800, color: T.purple, textTransform: "uppercase", letterSpacing: 0.7 }}>
            AI Insight
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.aiInsight}</div>
      </div>

      <div style={{
        background: `${T.green}10`, border: `1px solid ${T.green}35`,
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <ShieldCheck size={11} color={T.green} />
          <span style={{ fontSize: 9, fontWeight: 800, color: T.green, textTransform: "uppercase", letterSpacing: 0.7 }}>
            Recommended fix
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.recommendedFix}</div>
      </div>
    </div>
  );
}

function SterlingPoorEndingDetailPanel({
  selected,
}: {
  selected: SterlingPoorEndingDetail;
}) {
  const T = useDashboardTheme();
  const metricColor = (val: number, threshold: number) =>
    val >= threshold ? T.red : T.amber;
  const metrics: { label: string; value: number; threshold: number; suffix: string }[] = [
    { label: "Switch-intent", value: selected.switchIntent, threshold: 25, suffix: "%" },
    { label: "Avoid repeat", value: selected.avoidRepeat, threshold: 22, suffix: "%" },
    { label: "Cost leak", value: selected.costLeakK, threshold: 35, suffix: "K/wk" },
  ];
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12,
      background: T.surface, border: `1px solid ${T.borderLight}`,
      borderRadius: 12, padding: 14, minHeight: 340,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 4 }}>{selected.category}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", lineHeight: 1 }}>
            {selected.total.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: T.textMut }}>avoidable cost-to-serve contacts</span>
        </div>
        <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>
          <span style={{ color: T.textMut }}>Worst channel: </span>
          <strong style={{ color: T.red }}>{selected.worstChannels.join(" + ")}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {metrics.map((m) => {
          const c = metricColor(m.value, m.threshold);
          return (
            <div key={m.label} style={{
              background: `${c}12`, border: `1px solid ${c}40`,
              borderRadius: 8, padding: "8px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: "var(--mono)", marginTop: 2 }}>
                {m.suffix === "K/wk" ? `£${m.value}${m.suffix.replace("/wk", "")}` : `${m.value}${m.suffix}`}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div style={{ fontSize: 9, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
          Franchise signal
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.mainReason}</div>
      </div>

      <div style={{
        background: `${T.purple}10`, border: `1px solid ${T.purple}35`,
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Sparkles size={11} color={T.purple} />
          <span style={{ fontSize: 9, fontWeight: 800, color: T.purple, textTransform: "uppercase", letterSpacing: 0.7 }}>
            AI Insight
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.aiInsight}</div>
      </div>

      <div style={{
        background: `${T.green}10`, border: `1px solid ${T.green}35`,
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <ShieldCheck size={11} color={T.green} />
          <span style={{ fontSize: 9, fontWeight: 800, color: T.green, textTransform: "uppercase", letterSpacing: 0.7 }}>
            Draft action
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.recommendedFix}</div>
      </div>
    </div>
  );
}

function PoorEndingContactsPanel({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterling = variant === "sterling-service-attrition";
  const [selectedId, setSelectedId] = useState<string>(
    isSterling
      ? STERLING_POOR_ENDING_CONTACTS[0].category
      : POOR_ENDING_CONTACTS[0].category,
  );

  if (isSterling) {
    const selected =
      STERLING_POOR_ENDING_CONTACTS.find((c) => c.category === selectedId) ??
      STERLING_POOR_ENDING_CONTACTS[0];
    const chartData = STERLING_POOR_ENDING_CONTACTS.map((c) => ({
      category: c.category,
      Phone: c.channels.Phone,
      Chat: c.channels.Chat,
      Email: c.channels.Email,
      Complaints: c.channels.Complaints,
    }));
    return (
      <AIPanel
        title="Where avoidable cost-to-serve concentrates"
        subtitle="Stacked by channel · click a bar to see switch-intent exposure and draft franchise action"
        accentColor={T.red}
        ai
        aiModel="Cost-to-Serve Diagnostics"
      >
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 1fr)", gap: 16, alignItems: "stretch" }}>
          <div style={{ minHeight: 380 }}>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 14, left: 14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
                <XAxis type="number" stroke={T.textMut} fontSize={10} />
                <YAxis type="category" dataKey="category" stroke={T.textSec} fontSize={10} width={190} />
                <Tooltip cursor={{ fill: `${T.cyan}10` }} content={(p: any) => <StackedChannelTooltip {...p} T={T} />} />
                <Legend wrapperStyle={{ fontSize: 10, color: T.textMut }} />
                {STERLING_POOR_ENDING_CHANNELS.map((ch) => (
                  <Bar
                    key={ch}
                    dataKey={ch}
                    stackId="ch"
                    fill={STERLING_POOR_ENDING_CHANNEL_COLORS[ch]}
                    cursor="pointer"
                    onClick={(p: any) => {
                      if (p && typeof p.category === "string") setSelectedId(p.category);
                    }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <SterlingPoorEndingDetailPanel selected={selected} />
        </div>
      </AIPanel>
    );
  }

  const selected = POOR_ENDING_CONTACTS.find((c) => c.category === selectedId) ?? POOR_ENDING_CONTACTS[0];
  const chartData = POOR_ENDING_CONTACTS.map((c) => ({
    category: c.category,
    Voice: c.channels.Voice,
    Chat: c.channels.Chat,
    Email: c.channels.Email,
    Ticket: c.channels.Ticket,
  }));
  return (
    <AIPanel
      title="Where contacts fail to end well"
      subtitle="Stacked by channel · click a bar to see what's broken and how to fix it"
      accentColor={T.red}
      ai
      aiModel="Closure Diagnostics"
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 1fr)", gap: 16, alignItems: "stretch" }}>
        <div style={{ minHeight: 340 }}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 14, left: 14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" stroke={T.textMut} fontSize={10} />
              <YAxis type="category" dataKey="category" stroke={T.textSec} fontSize={11} width={170} />
              <Tooltip cursor={{ fill: `${T.cyan}10` }} content={(p: any) => <StackedChannelTooltip {...p} T={T} />} />
              <Legend wrapperStyle={{ fontSize: 10, color: T.textMut }} />
              {POOR_ENDING_CHANNELS.map((ch) => (
                <Bar
                  key={ch}
                  dataKey={ch}
                  stackId="ch"
                  fill={POOR_ENDING_CHANNEL_COLORS[ch]}
                  cursor="pointer"
                  onClick={(p: any) => {
                    if (p && typeof p.category === "string") setSelectedId(p.category);
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <PoorEndingDetailPanel selected={selected} />
      </div>
    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROW 5 (right) · Contact Recovery Priority Matrix (Eisenhower-style)
   Quadrants: Do Now · Schedule · Delegate · Monitor — click for details
   ──────────────────────────────────────────────────────────────────────── */

type RecoveryQuadrantId = "do_now" | "schedule" | "delegate" | "monitor";

type RecoveryQuadrant = {
  id: RecoveryQuadrantId;
  label: string;
  axis: string;
  count: number;
  sub: string;
  bullets: string[];
  color: string;
  Icon: typeof Flag;
  topReason: string;
  topIntents: string[];
  recommendedAction: string;
};

const RECOVERY_QUADRANTS: RecoveryQuadrant[] = [
  {
    id: "do_now",
    label: "Do Now",
    axis: "Important + Urgent",
    count: 184,
    sub: "Repeat + negative exit",
    bullets: ["Fee disputes", "Account lockout", "Branch-phone loop"],
    color: "#EF4444",
    Icon: Flag,
    topReason: "Customers repeated within 7 days and exited negative.",
    topIntents: ["Fee dispute", "Account access", "Branch-phone loop"],
    recommendedAction: "Create a same-day recovery queue for high-risk repeat contacts.",
  },
  {
    id: "schedule",
    label: "Schedule",
    axis: "Important + Not urgent",
    count: 426,
    sub: "Playbook / knowledge gaps",
    bullets: ["HELOC response playbook", "Fee explanation article", "Evening shift coaching"],
    color: "#F59E0B",
    Icon: Calendar,
    topReason: "Repeat themes traced to missing playbooks and KB articles.",
    topIntents: ["HELOC rate query", "Fee explanation", "Tone drift PM shift"],
    recommendedAction: "Stand up 3 playbooks plus 1 evening-shift coaching cohort by next sprint.",
  },
  {
    id: "delegate",
    label: "Delegate",
    axis: "Urgent + Lower strategic impact",
    count: 312,
    sub: "Routine recovery tasks",
    bullets: ["Callback reminders", "Upload-link nudges", "Password reset follow-ups"],
    color: "#06B6D4",
    Icon: UserCheck,
    topReason: "Mechanical follow-ups draining tier-1 capacity.",
    topIntents: ["Missed callback", "Document upload", "Password reset"],
    recommendedAction: "Route to automation plus a tier-0 swarm; keep humans for exceptions only.",
  },
  {
    id: "monitor",
    label: "Monitor",
    axis: "Low urgency + Low impact",
    count: 690,
    sub: "Low-risk / already handled",
    bullets: ["Duplicate informational calls", "Low sentiment pressure", "Closed duplicate tickets"],
    color: "#94A3B8",
    Icon: Eye,
    topReason: "Already-resolved or non-actionable — track only for trend break.",
    topIntents: ["Informational queries", "Duplicate tickets", "Already resolved"],
    recommendedAction: "Auto-monitor weekly · alert only on a +25% volume swing.",
  },
];

function ContactRecoveryPriorityMatrix({
  variant = "default",
}: {
  variant?: ContactExperienceDrillVariant;
}) {
  const T = useDashboardTheme();
  const [selectedId, setSelectedId] = useState<RecoveryQuadrantId>("do_now");
  const quadrants =
    variant === "sterling-contact"
      ? RECOVERY_QUADRANTS.map((q) => ({
          ...q,
          topIntents: [
            ...STERLING_HEAD_CONTACT_RECOVERY_TOP_INTENTS[
              q.id as SterlingContactRecoveryQuadrantId
            ],
          ],
        }))
      : RECOVERY_QUADRANTS;
  const selected = quadrants.find((q) => q.id === selectedId) ?? quadrants[0];
  return (
    <AIPanel
      title="Contact Recovery Priority Matrix"
      subtitle="Prioritise poor-ending contacts by urgency and customer impact"
      accentColor={T.cyan}
      ai
      aiModel="Recovery Prioritiser"
      fill
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {quadrants.map((q) => {
          const active = q.id === selectedId;
          const QIcon = q.Icon;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelectedId(q.id)}
              style={{
                textAlign: "left",
                background: active ? `${q.color}18` : T.surface,
                borderTop: `3px solid ${q.color}`,
                borderRight: `1px solid ${active ? q.color : T.borderLight}`,
                borderBottom: `1px solid ${active ? q.color : T.borderLight}`,
                borderLeft: `1px solid ${active ? q.color : T.borderLight}`,
                borderRadius: 10, padding: "10px 12px",
                display: "flex", flexDirection: "column", gap: 6,
                cursor: "pointer", color: T.text, fontFamily: "inherit",
                transition: "all 0.18s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <QIcon size={12} color={q.color} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: q.color, textTransform: "uppercase", letterSpacing: 0.7 }}>
                    {q.label}
                  </span>
                </div>
                <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right" }}>
                  {q.axis}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: q.color, fontFamily: "var(--mono)", lineHeight: 1 }}>
                  {q.count}
                </span>
                <span style={{ fontSize: 10.5, color: T.textMut }}>contacts · {q.sub}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, color: T.textSec, fontSize: 11, lineHeight: 1.5 }}>
                {q.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 10, padding: "10px 12px",
        background: `${selected.color}10`,
        borderTop: `1px solid ${selected.color}40`,
        borderRight: `1px solid ${selected.color}40`,
        borderBottom: `1px solid ${selected.color}40`,
        borderLeft: `3px solid ${selected.color}`,
        borderRadius: 10,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <ChevronRight size={11} color={selected.color} />
          <span style={{ fontSize: 9, fontWeight: 800, color: selected.color, textTransform: "uppercase", letterSpacing: 0.6 }}>
            Selected · {selected.label}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>
          <div><strong style={{ color: T.text }}>Top reason: </strong>{selected.topReason}</div>
          <div><strong style={{ color: T.text }}>Top intents: </strong>{selected.topIntents.join(" · ")}</div>
          <div><strong style={{ color: T.text }}>Recommended action: </strong>{selected.recommendedAction}</div>
        </div>
      </div>
    </AIPanel>
  );
}

function ServiceDrivenRetentionPanel() {
  const T = useDashboardTheme();
  const [selectedRank, setSelectedRank] = useState(STERLING_RETENTION_EXPOSURE[0].rank);
  const selected =
    STERLING_RETENTION_EXPOSURE.find((r) => r.rank === selectedRank) ??
    STERLING_RETENTION_EXPOSURE[0];
  return (
    <AIPanel
      title="Service-driven retention exposure"
      subtitle="Poor-ending / switch-intent contacts ranked by balance-at-risk and primacy"
      accentColor={T.cyan}
      ai
      aiModel="Franchise Retention Ranker"
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {STERLING_RETENTION_EXPOSURE.map((row) => {
          const active = row.rank === selectedRank;
          return (
            <button
              key={row.rank}
              type="button"
              onClick={() => setSelectedRank(row.rank)}
              style={{
                textAlign: "left",
                background: active ? `${T.red}14` : T.surface,
                border: `1px solid ${active ? T.red : T.borderLight}`,
                borderLeft: `3px solid ${active ? T.red : T.borderLight}`,
                borderRadius: 10,
                padding: "10px 12px",
                cursor: "pointer",
                color: T.text,
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{row.rank}. {row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.red, fontFamily: "var(--mono)" }}>{row.balance}</span>
              </div>
              <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>
                {row.accounts} accounts · {row.primacy} primacy
              </div>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 10, padding: "10px 12px",
        background: `${T.amber}10`,
        borderTop: `1px solid ${T.amber}40`,
        borderRight: `1px solid ${T.amber}40`,
        borderBottom: `1px solid ${T.amber}40`,
        borderLeft: `3px solid ${T.amber}`,
        borderRadius: 10,
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: T.amber, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
          Draft action · never auto-send
        </div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{selected.action}</div>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: T.textMut, lineHeight: 1.45 }}>
        Recovery-queue execution routes to COO — Raghu tracks franchise harm, not staffing.
      </div>
    </AIPanel>
  );
}

const DRILL1_INSIGHTS: HeroInsight[] = [
  { tone: "danger",
    title: "Per-contact resolution is breaking on Ticket + Chat",
    body: "Ticket Repeat 27% / Premature 11% and Chat Tone-Drift 22% are the worst cells in the quality matrix. These two channels alone account for ~60% of poor-ending contacts." },
  { tone: "warning",
    title: "Fee Dispute and HELOC drive half of all repeats",
    body: "412 + 248 repeats this week — 49% of total. No standard playbook exists for either; agents improvise responses, which inflates both AHT and repeat-contact rate." },
  { tone: "info",
    title: "Tone drift is concentrated on the evening shift",
    body: "18% of evening contacts show negative tone-drift mid-conversation — 2.4× the day-shift rate. Coaching window opens after 6pm shift handover." },
];

export function ContactExperienceDrillDown({
  onBack,
  variant = "default",
}: {
  onBack: () => void;
  variant?: ContactExperienceDrillVariant;
}) {
  const isSterlingFranchise = variant === "sterling-service-attrition";
  const isSterlingContact = variant === "sterling-contact";
  const drill1Insights = isSterlingFranchise
    ? STERLING_DRILL1_INSIGHTS
    : isSterlingContact
      ? STERLING_HEAD_CONTACT_DRILL1_INSIGHTS
      : DRILL1_INSIGHTS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title={isSterlingFranchise ? "Is service driving customers away?" : "Is every contact ending well?"}
        sub={
          isSterlingFranchise
            ? "Where poor service endings turn into switch-intent, avoidable cost-to-serve, and reputation drag — the franchise cost of service, not agent scorecards."
            : "Per-contact resolution quality across voice, chat, email and ticket — sentiment exit, FCR, repeats, premature closure and tone drift."
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)", gap: 16, alignItems: "stretch" }}>
        <ContactHealthHero variant={variant} />
        <HeroSummaryWall accentColor="#F59E0B" insights={drill1Insights} />
      </div>

      <ContactKPIPack variant={variant} />

      <QualityMatrixPanel variant={variant} />

      <PoorEndingContactsPanel variant={variant} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
        <RepeatContactByIntentPanel variant={variant} />
        {isSterlingFranchise ? (
          <ServiceDrivenRetentionPanel />
        ) : (
          <ContactRecoveryPriorityMatrix variant={variant} />
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   DRILL 2 — Is our service shaping how we're seen?
   PRIMARY LENS · current public reputation of the service experience.
   SECONDARY   · contact-centre operational implications.
   FLOW
     ROW 1  · Service Reputation Score  +  AI Summary Wall (reputation-led)
     ROW 2  · Channel Reputation Snapshot (5 platform cards · state badge,
              top theme, secondary note · platform colour = source marker
              only; status colour = reputation health)
     ROW 3  · Service Reputation Themes (public service complaints)
     ROW 4  · Reputation Split by Channel (positive vs negative perception)
     ROW 5  · App & Play Store Service Decay  |  High-Reach Reputation Watch
     ROW 6  · Reputation Momentum Topics (fastest-growing service narratives)
     ROW 7  · Wider Reputation Signals (meta-reputation context · competitor
              comparison, ranking/review movement, public trust narratives)
   ═════════════════════════════════════════════════════════════════════════ */

const SOCIAL_CHANNEL_ORDER = ["Trustpilot", "X", "Reddit", "App Store", "Play Store"] as const;
const SOCIAL_CHANNEL_COLORS: Record<typeof SOCIAL_CHANNEL_ORDER[number], string> = {
  Trustpilot: "#22C55E",
  X: "#0EA5E9",
  Reddit: "#FB923C",
  "App Store": "#A78BFA",
  "Play Store": "#F472B6",
};

const REPUTATION_TREND = [
  { w: "W-7", v: 0.62 }, { w: "W-6", v: 0.58 }, { w: "W-5", v: 0.55 }, { w: "W-4", v: 0.53 },
  { w: "W-3", v: 0.50 }, { w: "W-2", v: 0.48 }, { w: "W-1", v: 0.47 }, { w: "Now", v: 0.46 },
];
const REPUTATION_SCORE_TREND = REPUTATION_TREND.map((p) => ({ w: p.w, v: Math.round(p.v * 100) }));

type ReputationState = "Weak" | "Negative" | "Watch" | "Declining";

type PlatformReputationCard = {
  name: string;
  sourceColor: string;
  score: string;
  delta: string;
  state: ReputationState;
  topTheme: string;
  secondaryNote: string;
};

const PLATFORM_PILLS: PlatformReputationCard[] = [
  {
    name: "Trustpilot", sourceColor: "#22C55E",
    score: "3.1 ★", delta: "▼ 0.5",
    state: "Weak",
    topTheme: "Long hold time",
    secondaryNote: "Durable review evidence",
  },
  {
    name: "X / Twitter", sourceColor: "#0EA5E9",
    score: "0.38", delta: "▼ 0.09",
    state: "Negative",
    topTheme: "No answer / public escalation",
    secondaryNote: "Fastest amplification",
  },
  {
    name: "Reddit", sourceColor: "#FB923C",
    score: "0.48", delta: "▼ 0.04",
    state: "Watch",
    topTheme: "IVR loop / workaround threads",
    secondaryNote: "Community narrative",
  },
  {
    name: "App Store", sourceColor: "#A78BFA",
    score: "4.0 ★", delta: "▼ 0.4",
    state: "Declining",
    topTheme: "App support not responding",
    secondaryNote: "Service complaints inside app reviews",
  },
  {
    name: "Play Store", sourceColor: "#F472B6",
    score: "4.1 ★", delta: "▼ 0.3",
    state: "Declining",
    topTheme: "Reach-human failure",
    secondaryNote: "Android support friction",
  },
];

const REPUTATION_STATE_COLOR: Record<ReputationState, string> = {
  Negative: "#DC2626",
  Weak: "#EF4444",
  Declining: "#F97316",
  Watch: "#F59E0B",
};

const SERVICE_THEMES = [
  { theme: "Kept on hold > 30 min",        mentions: 482, channels: { Trustpilot: 142, X: 198, Reddit: 56, "App Store": 64, "Play Store": 22 } },
  { theme: "No one answered",              mentions: 376, channels: { Trustpilot: 88,  X: 134, Reddit: 41, "App Store": 76, "Play Store": 37 } },
  { theme: "Complaint handling poor",      mentions: 312, channels: { Trustpilot: 138, X: 72,  Reddit: 38, "App Store": 42, "Play Store": 22 } },
  { theme: "Rude / unhelpful agent",       mentions: 268, channels: { Trustpilot: 124, X: 64,  Reddit: 28, "App Store": 38, "Play Store": 14 } },
  { theme: "Payment / card issues",        mentions: 246, channels: { Trustpilot: 64,  X: 84,  Reddit: 36, "App Store": 38, "Play Store": 24 } },
  { theme: "IVR loop / can't reach human", mentions: 214, channels: { Trustpilot: 52,  X: 78,  Reddit: 36, "App Store": 32, "Play Store": 16 } },
  { theme: "App login failures",           mentions: 192, channels: { Trustpilot: 14,  X: 32,  Reddit: 24, "App Store": 86, "Play Store": 36 } },
  { theme: "Fraud / scam concern",         mentions: 178, channels: { Trustpilot: 56,  X: 64,  Reddit: 28, "App Store": 18, "Play Store": 12 } },
  { theme: "Callback never happened",      mentions: 168, channels: { Trustpilot: 71,  X: 42,  Reddit: 14, "App Store": 28, "Play Store": 13 } },
  { theme: "Transferred too many times",   mentions: 142, channels: { Trustpilot: 38,  X: 56,  Reddit: 18, "App Store": 22, "Play Store": 8  } },
  { theme: "App support failing",          mentions: 124, channels: { Trustpilot: 12,  X: 34,  Reddit: 8,  "App Store": 38, "Play Store": 32 } },
];

const SERVICE_SENTIMENT_SPLIT: ChannelSentimentSplitEntry[] = [
  {
    channel: "Trustpilot",  positive: 24, negative: 54,
    topPositive: ["Quick callback", "Issue resolved fast"],
    topNegative: ["On-hold > 30 min", "Repeat callbacks failed"],
  },
  {
    channel: "X / Twitter", positive: 18, negative: 62,
    topPositive: ["Helpful DM response"],
    topNegative: ["Kept on hold", "No one answered DMs"],
  },
  {
    channel: "Reddit",      positive: 22, negative: 52,
    topPositive: ["Community workaround"],
    topNegative: ["IVR loop", "Transferred too many times"],
  },
  {
    channel: "App Store",   positive: 31, negative: 45,
    topPositive: ["In-app chat smooth"],
    topNegative: ["Support never replied", "Rude agent"],
  },
  {
    channel: "Play Store",  positive: 28, negative: 46,
    topPositive: ["Fast resolution via app"],
    topNegative: ["Couldn't reach human", "App support failing"],
  },
];

const APP_STORE_DECAY = [
  { week: "W-7", rating: 4.4, complaints: 18 },
  { week: "W-6", rating: 4.4, complaints: 22 },
  { week: "W-5", rating: 4.3, complaints: 27 },
  { week: "W-4", rating: 4.2, complaints: 34 },
  { week: "W-3", rating: 4.2, complaints: 41 },
  { week: "W-2", rating: 4.1, complaints: 52 },
  { week: "W-1", rating: 4.1, complaints: 61 },
  { week: "Now", rating: 4.0, complaints: 68 },
];

type ReputationVoice = {
  name: string;
  platform: string;
  reach: string;
  theme: string;
  tone: "negative" | "neutral" | "positive";
  whyItMatters: string;
};

const SERVICE_INFLUENCERS: ReputationVoice[] = [
  {
    name: "@FinanceWatcher", platform: "X", reach: "184K",
    theme: "On-hold time exposé", tone: "negative",
    whyItMatters: "High public visibility around wait time.",
  },
  {
    name: "r/PersonalFinance", platform: "Reddit", reach: "2.1M",
    theme: "IVR-loop complaints", tone: "negative",
    whyItMatters: "Community narrative is forming.",
  },
  {
    name: "Trustpilot · Top1", platform: "Trustpilot", reach: "Tier 1",
    theme: "Repeat-callback failures", tone: "negative",
    whyItMatters: "Durable review evidence.",
  },
  {
    name: "AppRecon", platform: "App Store", reach: "62K",
    theme: "App-support response", tone: "neutral",
    whyItMatters: "App review perception is visible to prospects.",
  },
];

function ReputationHero() {
  const T = useDashboardTheme();
  const score = REPUTATION_SCORE_TREND[REPUTATION_SCORE_TREND.length - 1].v;
  const start = REPUTATION_SCORE_TREND[0].v;
  const delta = score - start;
  const stroke = T.amber;
  return (
    <AIPanel
      title="Service Reputation Score"
      subtitle="Current public perception of our service experience · 8-week trend"
      accentColor={stroke}
      ai
      aiModel="Service Reputation Index"
      fill
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) minmax(280px, 1fr)", gap: 16, alignItems: "stretch", flex: 1, width: "100%", minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: stroke, fontFamily: "var(--mono)", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>out of 100</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", marginTop: 6 }}>
            <TrendingDown size={12} />
            {delta} pts vs 8w ago
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 4, lineHeight: 1.4 }}>
            <strong style={{ color: T.text }}>Verdict:</strong> public service reputation is declining for the 8th week. Hold-time, no-answer and rude-agent themes are now the dominant external perception of our service.
          </div>
        </div>
        <div style={{ minHeight: 160, flex: 1 }}>
          <ResponsiveContainer>
            <AreaChart data={REPUTATION_SCORE_TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="reputation-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="w" stroke={T.textMut} fontSize={10} />
              <YAxis domain={[40, 70]} stroke={T.textMut} fontSize={10} />
              <Tooltip content={(p: any) => <ChartTip {...p} T={T} valueSuffix=" / 100" />} />
              <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2.5} fill="url(#reputation-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AIPanel>
  );
}

function PlatformPills() {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}>
      {PLATFORM_PILLS.map((p) => {
        const stateColor = REPUTATION_STATE_COLOR[p.state];
        return (
          <div key={p.name} style={{
            minWidth: 0,
            background: T.elevated,
            borderTop: `3px solid ${stateColor}`,
            borderRight: `1px solid ${T.borderLight}`,
            borderBottom: `1px solid ${T.borderLight}`,
            borderLeft: `1px solid ${T.borderLight}`,
            borderRadius: 10, padding: "11px 12px",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: p.sourceColor, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10.5, fontWeight: 800, color: T.text,
                  textTransform: "uppercase", letterSpacing: 0.5,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {p.name}
                </span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
                color: stateColor, padding: "2px 7px", borderRadius: 999,
                background: `${stateColor}18`, border: `1px solid ${stateColor}40`,
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {p.state}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "var(--mono)", lineHeight: 1 }}>
                {p.score}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.red, fontFamily: "var(--mono)" }}>{p.delta}</span>
            </div>
            <div style={{
              fontSize: 10.5, color: T.textSec, lineHeight: 1.4,
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              <span><span style={{ color: T.textMut }}>Top: </span>{p.topTheme}</span>
              <span style={{ color: T.textMut, fontSize: 10 }}>{p.secondaryNote}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ServiceMentionThemesPanel() {
  const T = useDashboardTheme();
  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const row = payload[0].payload as typeof SERVICE_THEMES[number];
    const total = Math.max(row.mentions, 1);
    return (
      <div style={{
        minWidth: 240, background: "rgba(10,14,22,0.96)",
        border: `1px solid ${T.borderLight}`, borderRadius: 10,
        padding: "10px 12px", fontSize: 11,
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.45 }}>
          {row.theme}
        </div>
        <div style={{ fontSize: 10, color: T.textMut, marginBottom: 8 }}>
          Mentions by social channel · total {row.mentions}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SOCIAL_CHANNEL_ORDER.map((ch) => {
            const count = (row.channels as any)[ch] ?? 0;
            const pct = ((count / total) * 100).toFixed(1);
            return (
              <div key={ch} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: SOCIAL_CHANNEL_COLORS[ch] }} />
                  <span style={{ fontSize: 10.5, color: T.textSec }}>{ch}</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: SOCIAL_CHANNEL_COLORS[ch], fontFamily: "var(--mono)" }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <AIPanel
      title="Service Reputation Themes"
      subtitle="Public service complaints across reviews, social, and app stores"
      accentColor={T.red}
      ai
      aiModel="Theme Mining"
    >
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={SERVICE_THEMES} layout="vertical" margin={{ top: 4, right: 28, left: 14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
            <XAxis type="number" stroke={T.textMut} fontSize={10} />
            <YAxis type="category" dataKey="theme" stroke={T.textSec} fontSize={11} width={195} />
            <Tooltip cursor={{ fill: `${T.red}10` }} content={renderTooltip} />
            <Bar dataKey="mentions" radius={[0, 6, 6, 0]} fill={T.red} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLight}`, fontSize: 11, color: T.textMut }}>
        Top 5 themes shape <span style={{ color: T.red, fontWeight: 700 }}>62%</span> of negative service reputation this month.
      </div>
    </AIPanel>
  );
}

function AppStoreServiceDecayPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="App & Play Store · service decay"
      subtitle="Star rating vs service complaint mentions — 8-week trend"
      accentColor={T.amber}
      ai
      aiModel="Review Decay"
      fill
    >
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={APP_STORE_DECAY} margin={{ top: 6, right: 12, left: 6, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
            <XAxis dataKey="week" stroke={T.textMut} fontSize={10} />
            <YAxis yAxisId="left" stroke={T.textMut} fontSize={10} />
            <YAxis yAxisId="right" orientation="right" stroke={T.textMut} fontSize={10} domain={[3.5, 4.5]} />
            <Tooltip content={(p: any) => <ChartTip {...p} T={T} />} />
            <Legend wrapperStyle={{ fontSize: 10, color: T.textMut }} />
            <Bar yAxisId="left" dataKey="complaints" name="Service Complaints" radius={[6, 6, 0, 0]} fill={T.red} />
            <Bar yAxisId="right" dataKey="rating" name="Star Rating" radius={[6, 6, 0, 0]} fill={T.amber} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLight}`, fontSize: 11, color: T.textMut }}>
        Service complaints up <span style={{ color: T.red, fontWeight: 700 }}>3.8×</span> in 8 weeks · rating dropped <span style={{ color: T.red, fontWeight: 700 }}>0.4 ★</span>
      </div>
    </AIPanel>
  );
}

function ServiceInfluencerWatchPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="High-Reach Reputation Watch"
      subtitle="Public voices amplifying service-experience complaints"
      accentColor={T.purple}
      ai
      aiModel="Reach Index"
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SERVICE_INFLUENCERS.map((row, i) => {
          const toneColor = row.tone === "negative" ? T.red : row.tone === "neutral" ? T.amber : T.green;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr auto auto",
              columnGap: 12, rowGap: 4, alignItems: "center",
              padding: "10px 12px", borderRadius: 10,
              background: T.surface, border: `1px solid ${T.borderLight}`,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{row.name}</div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{row.theme} · {row.platform}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMut, fontFamily: "var(--mono)" }}>
                {row.reach}
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
                padding: "3px 8px", borderRadius: 999,
                color: toneColor, background: `${toneColor}18`, border: `1px solid ${toneColor}40`,
              }}>{row.tone}</span>
              <div style={{ gridColumn: "1 / -1", fontSize: 11, color: T.textMut, lineHeight: 1.45 }}>
                <span style={{ color: T.textSec, fontWeight: 700 }}>Why it matters: </span>{row.whyItMatters}
              </div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROW 6 · Reputation Momentum Topics
   Service-led narratives only — fastest-growing public service complaints.
   ──────────────────────────────────────────────────────────────────────── */

type ReputationTopic = {
  topic: string;
  growth: number;
  tone: "negative" | "neutral" | "positive";
  mainChannel: string;
  meaning: string;
};

const REPUTATION_TOPICS: ReputationTopic[] = [
  {
    topic: "#LongHoldTime", growth: 287, tone: "negative",
    mainChannel: "X + Trustpilot",
    meaning: "Wait time is becoming the dominant service reputation story.",
  },
  {
    topic: "#NoCallback", growth: 164, tone: "negative",
    mainChannel: "Trustpilot",
    meaning: "Customers believe promised follow-ups are not happening.",
  },
  {
    topic: "#AppSupportFail", growth: 142, tone: "negative",
    mainChannel: "App Store + Play Store",
    meaning: "App support is damaging digital-service perception.",
  },
  {
    topic: "#HiddenFees", growth: 118, tone: "negative",
    mainChannel: "Reddit + Trustpilot",
    meaning: "Fee explanation quality is shaping public distrust.",
  },
  {
    topic: "#IVRLoop", growth: 96, tone: "negative",
    mainChannel: "Reddit + X",
    meaning: "Customers feel blocked from reaching a human.",
  },
  {
    topic: "#RudeAgent", growth: 76, tone: "negative",
    mainChannel: "Trustpilot + App Store",
    meaning: "Agent conduct is becoming part of reputation damage.",
  },
];

function ReputationMomentumTopicsPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="Reputation Momentum Topics"
      subtitle="Fastest-growing public service narratives"
      accentColor={T.red}
      ai
      aiModel="Narrative Velocity"
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 10,
      }}>
        {REPUTATION_TOPICS.map((t) => {
          const toneColor = t.tone === "negative" ? T.red : t.tone === "neutral" ? T.amber : T.green;
          return (
            <div key={t.topic} style={{
              background: T.surface,
              borderTop: `3px solid ${toneColor}`,
              borderRight: `1px solid ${T.borderLight}`,
              borderBottom: `1px solid ${T.borderLight}`,
              borderLeft: `1px solid ${T.borderLight}`,
              borderRadius: 10, padding: "11px 12px",
              display: "flex", flexDirection: "column", gap: 6,
              minWidth: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{
                  fontSize: 12.5, fontWeight: 800, color: T.text,
                  fontFamily: "var(--mono)", whiteSpace: "nowrap",
                  overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {t.topic}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 11, fontWeight: 800, color: toneColor, fontFamily: "var(--mono)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  <TrendingUp size={11} />
                  {t.growth}%
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
                  color: toneColor, padding: "2px 7px", borderRadius: 999,
                  background: `${toneColor}18`, border: `1px solid ${toneColor}40`,
                }}>{t.tone}</span>
                <span style={{ fontSize: 10.5, color: T.textMut }}>
                  <span style={{ color: T.textSec, fontWeight: 700 }}>Main: </span>{t.mainChannel}
                </span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.45 }}>{t.meaning}</div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ROW 7 · Wider Reputation Signals
   Meta-reputation context — beyond service-experience themes:
   competitor comparison · ranking/review movement · public trust narratives.
   ──────────────────────────────────────────────────────────────────────── */

type WiderSignalTone = "negative" | "neutral" | "positive";

type WiderReputationSignal = {
  id: string;
  title: string;
  metric: string;
  metricNote: string;
  trend: string;
  tone: WiderSignalTone;
  topFrame: string;
  strongestChannel: string;
  whyItMatters: string;
};

const WIDER_REPUTATION_SIGNALS: WiderReputationSignal[] = [
  {
    id: "competitor",
    title: "Competitor comparison",
    metric: "412",
    metricNote: "mentions / week comparing our service to peers",
    trend: "▲ 38% in 8 weeks",
    tone: "negative",
    topFrame: "“X is faster · Y picks up on first ring”",
    strongestChannel: "Reddit + Trustpilot",
    whyItMatters: "Customers are starting to use peer brands as the service benchmark.",
  },
  {
    id: "rating-movement",
    title: "Ranking / review movement",
    metric: "−0.4 ★",
    metricNote: "average across Trustpilot, App Store, Play Store",
    trend: "▼ across all 3 review platforms",
    tone: "negative",
    topFrame: "Durable rating slide · 8-week trend",
    strongestChannel: "Trustpilot + App Store",
    whyItMatters: "Visible to prospects, recruiters and partners — long-tail evidence.",
  },
  {
    id: "trust",
    title: "Public trust narratives",
    metric: "3 viral threads",
    metricNote: "this month · 2.4M cumulative reach",
    trend: "▲ phrase recurrence × 2.1",
    tone: "negative",
    topFrame: "“Bank that doesn’t pick up” forming as a public phrase",
    strongestChannel: "X + Reddit",
    whyItMatters: "Trust phrasing is solidifying in public discourse beyond individual complaints.",
  },
];

function WiderReputationSignalsPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="Wider Reputation Signals"
      subtitle="Beyond service themes — how customers are framing us in public"
      accentColor={T.purple}
      ai
      aiModel="Reputation Context"
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
      }}>
        {WIDER_REPUTATION_SIGNALS.map((s) => {
          const toneColor = s.tone === "negative" ? T.red : s.tone === "neutral" ? T.amber : T.green;
          return (
            <div key={s.id} style={{
              background: T.surface,
              borderTop: `3px solid ${toneColor}`,
              borderRight: `1px solid ${T.borderLight}`,
              borderBottom: `1px solid ${T.borderLight}`,
              borderLeft: `1px solid ${T.borderLight}`,
              borderRadius: 10, padding: "12px 14px",
              display: "flex", flexDirection: "column", gap: 8,
              minWidth: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 800, color: T.text,
                  textTransform: "uppercase", letterSpacing: 0.6,
                }}>
                  {s.title}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
                  color: toneColor, padding: "2px 7px", borderRadius: 999,
                  background: `${toneColor}18`, border: `1px solid ${toneColor}40`,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>{s.tone}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: toneColor, fontFamily: "var(--mono)", lineHeight: 1 }}>
                  {s.metric}
                </span>
                <span style={{ fontSize: 10.5, color: T.textMut }}>{s.metricNote}</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, fontWeight: 700, fontFamily: "var(--mono)" }}>
                {s.trend}
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.45 }}>
                <span style={{ color: T.textMut }}>Frame: </span>{s.topFrame}
              </div>
              <div style={{ fontSize: 10.5, color: T.textMut }}>
                <span style={{ color: T.textSec, fontWeight: 700 }}>Strongest channel: </span>{s.strongestChannel}
              </div>
              <div style={{
                marginTop: 4, paddingTop: 8,
                borderTop: `1px solid ${T.borderLight}`,
                fontSize: 11, color: T.textSec, lineHeight: 1.45,
              }}>
                <span style={{ color: T.text, fontWeight: 700 }}>Why it matters: </span>{s.whyItMatters}
              </div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

const DRILL2_INSIGHTS: HeroInsight[] = [
  { tone: "danger",
    title: "Hold-time is now defining public service perception",
    body: "482 mentions of 'kept on hold > 30 min' across public channels. X is amplifying the story fastest, while Trustpilot gives it long-tail credibility." },
  { tone: "warning",
    title: "App-store service perception is decaying",
    body: "Service complaints in app reviews are up 3.8× in 8 weeks. Customers repeatedly mention 'no one answered' and 'app support did not respond.'" },
  { tone: "info",
    title: "Rude-agent and callback failures are spreading across review channels",
    body: "Trustpilot and App Store carry the most durable negative service evidence; X and Reddit are accelerating the narrative." },
];

export function ServiceReputationDrillDown({
  onBack,
  sterlingContact = false,
}: {
  onBack: () => void;
  sterlingContact?: boolean;
}) {
  const T = useDashboardTheme();
  const reputationInsights = sterlingContact
    ? STERLING_HEAD_CONTACT_DRILL2_INSIGHTS
    : DRILL2_INSIGHTS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Is our service shaping how we're seen?"
        sub="Current public reputation of our service experience across Trustpilot, X, Reddit, App Store and Play Store."
        headerRight={
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr",
            columnGap: 14, rowGap: 9, alignItems: "center",
            padding: "5px 7px", borderRadius: 10,
            background: T.elevated, border: `1px solid ${T.borderLight}`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.7 }}>
              Channels
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SOCIAL_CHANNEL_ORDER.map((ch) => (
                <span key={ch} style={{
                  fontSize: 11, fontWeight: 700, color: SOCIAL_CHANNEL_COLORS[ch],
                  padding: "3px 9px", borderRadius: 999,
                  background: `${SOCIAL_CHANNEL_COLORS[ch]}18`,
                  border: `1px solid ${SOCIAL_CHANNEL_COLORS[ch]}45`,
                }}>{ch}</span>
              ))}
            </div>
          </div>
        }
      />

      {/* ROW 1 — Reputation headshot */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)", gap: 16, alignItems: "stretch" }}>
        <ReputationHero />
        <HeroSummaryWall accentColor="#F59E0B" insights={reputationInsights} />
      </div>

      {/* ROW 2 — Channel Reputation Snapshot */}
      <PlatformPills />

      {/* ROW 3 — Service Reputation Themes */}
      <ServiceMentionThemesPanel />

      {/* ROW 5 — App & Play Store Service Decay · High-Reach Reputation Watch */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "stretch" }}>
        <AppStoreServiceDecayPanel />
        <ServiceInfluencerWatchPanel />
      </div>

      {/* ROW 6 — Reputation Momentum Topics (service-led narratives only) */}
      <ReputationMomentumTopicsPanel />

      {/* ROW 7 — Wider Reputation Signals (meta-reputation context) */}
      <WiderReputationSignalsPanel />
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   DRILL 3 — Is the service engine running clean?
   FLOW
     1. HEADSHOT  · Operations Vital Signs (3 sparklines + status)  +  AI Summary Wall
     2. STATPACK  · 5 ops KPIs
     3. TIER 1    · SLA Performance Overview
     4. TIER 2    · In-house vs Outsourced  |  Cross-Centre Health (2-col)
     5. TIER 3    · Intent Pressure Alerts (cards)
     6. TIER 4    · Intent Score Heatmap (intent × channel)
     7. TIER 5    · Compliance Spotlights  |  Smart Agent Action List (2-col)
   ═════════════════════════════════════════════════════════════════════════ */

const VITAL_SIGNS = [
  {
    label: "SLA Compliance",
    value: "87%",
    delta: "−4",
    target: "95%",
    color: "#EF4444",
    series: [{ x: 1, v: 95 }, { x: 2, v: 94 }, { x: 3, v: 93 }, { x: 4, v: 91 }, { x: 5, v: 90 }, { x: 6, v: 89 }, { x: 7, v: 88 }, { x: 8, v: 87 }],
  },
  {
    label: "Avg Handle Time",
    value: "8.3m",
    delta: "+0.8",
    target: "< 8m",
    color: "#F59E0B",
    series: [{ x: 1, v: 7.4 }, { x: 2, v: 7.5 }, { x: 3, v: 7.7 }, { x: 4, v: 7.9 }, { x: 5, v: 8.0 }, { x: 6, v: 8.1 }, { x: 7, v: 8.2 }, { x: 8, v: 8.3 }],
  },
  {
    label: "First Contact Resolution",
    value: "74%",
    delta: "−3",
    target: "> 80%",
    color: "#EF4444",
    series: [{ x: 1, v: 79 }, { x: 2, v: 78 }, { x: 3, v: 78 }, { x: 4, v: 77 }, { x: 5, v: 76 }, { x: 6, v: 76 }, { x: 7, v: 75 }, { x: 8, v: 74 }],
  },
];

const OPS_KPI_PACK = [
  { label: "Abandonment", value: "8.2%", delta: "+1.4", target: "< 5%", color: "#EF4444" },
  { label: "Callback SLA", value: "68%", delta: "−6", target: "> 90%", color: "#EF4444" },
  { label: "Staffing Gap", value: "12", delta: "+5", target: "0", color: "#EF4444" },
  { label: "QA Score", value: "78%", delta: "−2", target: "> 85%", color: "#F59E0B" },
  { label: "Recording Consent Miss", value: "0.8%", delta: "+0.1", target: "0%", color: "#F59E0B" },
];

const SOURCE_COMPARISON = [
  { metric: "FCR",            inhouse: 81, bpo: 62, target: 80 },
  { metric: "AHT (min)",      inhouse: 6.4, bpo: 11.1, target: 8 },
  { metric: "CSAT",           inhouse: 87, bpo: 68, target: 85 },
  { metric: "Dispute Win %",  inhouse: 71, bpo: 38, target: 65 },
  { metric: "QA Score",       inhouse: 84, bpo: 64, target: 85 },
];

const CENTRES = [
  { centre: "London (In-house)",     health: 92, agents: 184, sla: 96, slaTarget: 95, note: "On target" },
  { centre: "Edinburgh (In-house)",  health: 86, agents: 122, sla: 91, slaTarget: 95, note: "Evening tone concern" },
  { centre: "Manchester (In-house)", health: 78, agents: 148, sla: 88, slaTarget: 95, note: "8 agents short" },
  { centre: "Mumbai (BPO Beta)",     health: 64, agents: 96,  sla: 79, slaTarget: 90, note: "Quality + AHT breach" },
  { centre: "Manila (BPO Beta)",     health: 71, agents: 112, sla: 84, slaTarget: 90, note: "Auth pass-rate low" },
];

const COMPLIANCE_SPOTLIGHTS = [
  { id: "consent",  title: "Recording consent",   value: "0.8% miss",        detail: "~240 calls/mo · script timing in 3 voice queues",  severity: "amber" as const },
  { id: "respa",    title: "RESPA collections",   value: "Variant A halted", detail: "7 calls flagged · UDAAP timing on rate-reset",     severity: "red" as const },
  { id: "kyc",      title: "KYC handoff",         value: "12% fail",         detail: "ID verification breaks on digital→voice handover",severity: "red" as const },
  { id: "pep",      title: "PEP screening",       value: "3 gaps",           detail: "Trigger missed on digital onboarding handover",   severity: "amber" as const },
];

function VitalSignsHero() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="Operations Vital Signs"
      subtitle="The three you check every morning · 8-week trend"
      accentColor={T.red}
      ai
      aiModel="Ops Pulse"
      fill
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, flex: 1 }}>
        {VITAL_SIGNS.map((s) => (
          <div key={s.label} style={{
            display: "flex", flexDirection: "column", gap: 6,
            padding: "12px 14px", borderRadius: 10,
            background: T.surface,
            borderTop: `3px solid ${s.color}`,
            borderRight: `1px solid ${T.borderLight}`,
            borderBottom: `1px solid ${T.borderLight}`,
            borderLeft: `1px solid ${T.borderLight}`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>
              {s.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "var(--mono)", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: T.red, fontFamily: "var(--mono)" }}>{s.delta}</span>
            </div>
            <div style={{ height: 56 }}>
              <ResponsiveContainer>
                <LineChart data={s.series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <Line type="monotone" dataKey="v" stroke={s.color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: 10, color: T.textMut }}>Target: {s.target}</div>
          </div>
        ))}
      </div>
    </AIPanel>
  );
}

function OpsKPIPack() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {OPS_KPI_PACK.map((k) => (
        <StatPill
          key={k.label}
          label={k.label}
          value={k.value}
          delta={k.delta}
          deltaTone="down"
          target={`Target ${k.target}`}
          color={k.color}
        />
      ))}
    </div>
  );
}

function SourceComparisonPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="In-house vs Outsourced (BPO Beta)"
      subtitle="Performance gap by metric · normalised, AHT shown in minutes"
      accentColor={T.red}
      ai
      aiModel="Workforce Intelligence"
      fill
    >
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={SOURCE_COMPARISON} margin={{ top: 6, right: 14, left: 6, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
            <XAxis dataKey="metric" stroke={T.textMut} fontSize={10} />
            <YAxis stroke={T.textMut} fontSize={10} />
            <Tooltip content={(p: any) => <ChartTip {...p} T={T} />} />
            <Legend wrapperStyle={{ fontSize: 10, color: T.textMut }} />
            <Bar dataKey="inhouse" name="In-house" radius={[6, 6, 0, 0]} fill={T.green} />
            <Bar dataKey="bpo"     name="BPO Beta" radius={[6, 6, 0, 0]} fill={T.red} />
            <Bar dataKey="target"  name="Target"   radius={[6, 6, 0, 0]} fill={T.cyan} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLight}`, fontSize: 11, color: T.textMut }}>
        <span style={{ color: T.red, fontWeight: 700 }}>33pt</span> dispute-win-rate gap is the top operational risk — evidence-collection step ~4 days slower on BPO.
      </div>
    </AIPanel>
  );
}

function CrossCentreHealthPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="Cross-centre health monitor"
      subtitle="Composite health = SLA × QA × Adherence · per centre"
      accentColor={T.amber}
      ai
      aiModel="Centre Parity"
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CENTRES.map((row, i) => {
          const healthColor = row.health >= 85 ? T.green : row.health >= 75 ? T.amber : T.red;
          const slaColor = row.sla >= row.slaTarget ? T.green : T.red;
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) 64px 60px 60px minmax(0, 1.4fr)",
              gap: 10, alignItems: "center",
              padding: "10px 12px", borderRadius: 10,
              background: T.surface, border: `1px solid ${T.borderLight}`,
            }}>
              <div style={{ minWidth: 0, fontSize: 12.5, fontWeight: 700, color: T.text }}>
                {row.centre}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>Health</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: healthColor, fontFamily: "var(--mono)" }}>{row.health}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>Agents</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "var(--mono)" }}>{row.agents}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>SLA</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: slaColor, fontFamily: "var(--mono)" }}>{row.sla}%</div>
              </div>
              <div style={{ minWidth: 0, fontSize: 11, color: T.textSec, lineHeight: 1.4 }}>
                {row.note}
              </div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

function ComplianceSpotlightsPanel() {
  const T = useDashboardTheme();
  return (
    <AIPanel
      title="Compliance spotlights"
      subtitle="Recording consent · UDAAP / RESPA · KYC handoff · PEP — flagged this week"
      accentColor={T.purple}
      ai
      aiModel="Compliance Watch"
      fill
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COMPLIANCE_SPOTLIGHTS.map((c) => {
          const sevColor = c.severity === "red" ? T.red : T.amber;
          return (
            <div key={c.id} style={{
              background: T.surface,
              borderTop: `1px solid ${T.borderLight}`,
              borderRight: `1px solid ${T.borderLight}`,
              borderBottom: `1px solid ${T.borderLight}`,
              borderLeft: `3px solid ${sevColor}`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: T.text, textTransform: "uppercase", letterSpacing: 0.6 }}>
                  {c.title}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800, color: sevColor,
                  letterSpacing: 0.6, textTransform: "uppercase",
                  padding: "2px 7px", borderRadius: 999,
                  background: `${sevColor}18`, border: `1px solid ${sevColor}40`,
                }}>{c.severity}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: sevColor, fontFamily: "var(--mono)", marginBottom: 6 }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11.5, color: T.textSec, lineHeight: 1.45 }}>
                {c.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AIPanel>
  );
}

const DRILL3_INSIGHTS: HeroInsight[] = [
  { tone: "danger",
    title: "BPO Beta is the single biggest operational risk",
    body: "19pt FCR gap and a 33pt dispute-win-rate gap (38% vs 71%). Mumbai centre health 64 / 100. Evidence-collection step is ~4 days slower than in-house." },
  { tone: "warning",
    title: "10–11 AM peak is short 12 agents · SLA bleeding 4pts",
    body: "Workforce gap concentrated in the morning peak. Activate overflow before 9:45 AM and rebalance Manchester (8 short) to keep SLA above 90%." },
  { tone: "info",
    title: "Compliance integrity holding, but two active red flags",
    body: "RESPA collections variant A halted (7 calls), KYC handoff failing on 12% of digital→voice transitions. Recording-consent miss steady at 0.8%." },
];

export function ServiceOperationsDrillDown({
  onBack,
  sterlingContact = false,
}: {
  onBack: () => void;
  sterlingContact?: boolean;
}) {
  const operationsInsights = sterlingContact
    ? STERLING_HEAD_CONTACT_DRILL3_INSIGHTS
    : DRILL3_INSIGHTS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Is the service engine running clean?"
        sub="SLA, AHT, capacity, agent performance, BPO vs in-house and compliance — the operational backbone of the contact centre."
      />

      {/* TIER 0 — HEADSHOT */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)", gap: 16, alignItems: "stretch" }}>
        <VitalSignsHero />
        <HeroSummaryWall accentColor="#EF4444" insights={operationsInsights} />
      </div>

      {/* TIER 0b — KPI strip */}
      <OpsKPIPack />

      {/* TIER 1 — SLA & Intent pressure */}
      <RetailSLAPerformanceOverview
        leadingIntents={
          sterlingContact ? STERLING_HEAD_CONTACT_LEADING_INTENTS : undefined
        }
      />

      {/* TIER 2 — Workforce 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "stretch" }}>
        <SourceComparisonPanel />
        <CrossCentreHealthPanel />
      </div>

      {/* TIER 3 — Pressure alerts */}
      <RetailIntentPressureAlerts />

      {/* TIER 4 — Intent × channel heatmap */}
      <div style={{
        background: "rgba(10,10,10,0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 20,
      }}>
        <IntentScoreHeatmap isDarkMode />
      </div>

      {/* TIER 5 — Compliance + Coaching 2-col (retail head_contact only) */}
      {!sterlingContact ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "stretch" }}>
          <ComplianceSpotlightsPanel />
          <SmartAgentActionList data={agentActionData} isDarkMode />
        </div>
      ) : null}
    </div>
  );
}
