"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Hash,
  Info,
  Target,
  RefreshCw,
  Sparkles,
  Timer,
  TrendingUp,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { type CSSProperties, type ComponentType, type MouseEvent, type ReactNode, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type BrandPromiseCard,
  type BrandPromiseGapRow,
  type BrandPromiseLens,
  type EngagementCardKind,
  type EngagementChannel,
  type EngagementImpact,
  type EngagementSentiment,
  type RankingImpact,
  type RankingLens,
  type RankingReviewRow,
  type V3JourneyIntentSegmentKey,
  BRAND_PROMISE_LENS_LABEL,
  BRAND_PROMISE_LENS_ORDER,
  V3_BRAND_PROMISE_LENS_ROW_COUNTS,
  getBrandPromiseGapRows,
  getSortedRankingReviewRows,
  RANKING_AI_SUMMARY_BY_LENS,
  RANKING_LENS_LABEL,
  RANKING_LENS_ORDER,
  RANKING_LENS_ROW_COUNTS,
  V3_JOURNEY_INTENT_SEGMENT_KEYS,
  V3_JOURNEY_INTENT_SEGMENT_RING_COUNTS,
  V3_JOURNEY_TOP_INTENT_AGGREGATE,
  V3_JOURNEY_TOP_INTENT_BY_SEGMENT,
  V3_EXECUTIVE_DIAGNOSIS_MARKET,
  ENGAGEMENT_CHANNEL_LABEL,
  ENGAGEMENT_CHANNEL_ORDER,
  getInfluentialEngagementItems,
  INFLUENTIAL_ENGAGEMENT_ITEMS,
  V3_MOMENTUM_HASHTAGS,
} from "@/lib/role-based-dashboard/creditCardsV3Data";
import { useDashboardTheme } from "./DashboardThemeContext";
import { RoleBasedUnifiedReadingShell } from "./RoleBasedUnifiedReadingShell";
import { ServicePromiseIndiaDrillBody } from "./ServicePromiseIndiaDrill";

type DrillProps = { onBack: () => void };

/** Card / shell palette aligned with Head of Retail drill-downs (near-black surfaces, subtle borders). */
const V3D = {
  gap: 16,
  surface: "#0d0d0d",
  surfaceAlt: "#151515",
  border: "#1f1f1f",
  borderBtn: "#393939",
  text: "#ffffff",
  textBody: "#e8e9e9",
  muted: "#939394",
} as const;

/** Column layout for drill bodies; outer padding matches retail via `HeadOfCreditCardsV3Dashboard` main when a drill is open. */
function V3DrillShell({
  children,
  bodyFontSize = 18,
}: {
  children: React.ReactNode;
  bodyFontSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: V3D.gap,
        minWidth: 0,
        fontSize: bodyFontSize,
        lineHeight: 1.625,
        color: V3D.textBody,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Back control + title row — same structure as Head of Retail `DrillPageHeader`
 * (arrow, “Back to Overview”, 28px title, 15px subtitle; larger when `comfortable`).
 */
function DrillPageHeader({
  onBack,
  title,
  sub,
  comfortable: comfortableTypography = false,
}: {
  onBack: () => void;
  title: string;
  sub: string;
  /** Larger title, subtitle, and back control (e.g. journey command center) */
  comfortable?: boolean;
}) {
  const T = useDashboardTheme();
  const backFs = comfortableTypography ? 17 : 15;
  const titleFs = comfortableTypography ? 34 : 28;
  const subFs = comfortableTypography ? 18 : 15;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: V3D.surface,
          border: `1px solid ${V3D.borderBtn}`,
          borderRadius: 10,
          padding: comfortableTypography ? "10px 18px" : "8px 16px",
          cursor: "pointer",
          color: V3D.textBody,
          fontSize: backFs,
          fontWeight: 600,
          fontFamily: "inherit",
          transition: "0.2s",
          width: "fit-content",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = V3D.text;
          e.currentTarget.style.borderColor = T.cyan;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = V3D.textBody;
          e.currentTarget.style.borderColor = V3D.borderBtn;
        }}
      >
        <ArrowLeft size={comfortableTypography ? 18 : 16} />
        Back to Overview
      </button>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: titleFs,
            fontWeight: 800,
            color: V3D.text,
            letterSpacing: -0.3,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: subFs,
            color: V3D.textBody,
            marginTop: 3,
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════ PRIMITIVES ═════════════════════════════
function SectionCard({
  title,
  subtitle,
  children,
  accent,
  fullWidth,
  dense,
  aiPill,
  comfortable: comfortableTypography = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: string;
  fullWidth?: boolean;
  dense?: boolean;
  aiPill?: boolean;
  comfortable?: boolean;
}) {
  const T = useDashboardTheme();
  const titleFs = comfortableTypography ? 16 : 12.5;
  const subFs = comfortableTypography ? 13 : 10.5;
  const pillFs = comfortableTypography ? 10 : 8.5;
  const pad = dense
    ? comfortableTypography
      ? 12
      : 10
    : comfortableTypography
      ? 16
      : 12;
  return (
    <section
      style={{
        background: V3D.surface,
        border: `1px solid ${V3D.border}`,
        borderTop: accent ? `3px solid ${accent}` : undefined,
        borderRadius: 12,
        padding: pad,
        gridColumn: fullWidth ? "1 / -1" : undefined,
        display: "flex",
        flexDirection: "column",
        transform: "translateY(0px)",
        transition: "0.2s",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: comfortableTypography ? 10 : 8,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                fontSize: titleFs,
                fontWeight: 700,
                color: V3D.text,
                lineHeight: 1.3,
              }}
            >
              {title}
            </div>
            {aiPill ? (
              <span
                style={{
                  background: `${T.gold}20`,
                  color: T.gold,
                  fontSize: pillFs,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  padding: comfortableTypography ? "2px 7px" : "1px 6px",
                  borderRadius: 4,
                }}
              >
                ✨ AI
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: subFs,
                color: V3D.muted,
                marginTop: 2,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </section>
  );
}

function AIInsightStrip({
  text,
  tone = "gold",
}: {
  text: string;
  tone?: "gold" | "cyan" | "red";
}) {
  const T = useDashboardTheme();
  const c = tone === "cyan" ? T.cyan : tone === "red" ? T.red : T.gold;
  return (
    <div
      style={{
        background: `${c}10`,
        borderTop: `1px solid ${c}40`,
        borderRight: `1px solid ${c}40`,
        borderBottom: `1px solid ${c}40`,
        borderLeft: `3px solid ${c}`,
        borderRadius: 8,
        padding: "8px 10px",
        display: "flex",
        alignItems: "flex-start",
        gap: 6,
        fontSize: 11,
        color: V3D.textBody,
        lineHeight: 1.5,
        marginTop: 8,
      }}
    >
      <Sparkles size={11} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
}

const TOOLTIP_STYLE = {
  background: V3D.surfaceAlt,
  borderRadius: 8,
  border: `1px solid ${V3D.borderBtn}`,
  fontSize: 11,
  color: V3D.textBody,
};

/**
 * Head of Credit Cards V3 — "Are cardholders satisfied with their journey?" drill
 * (conversation-first layout: Are cardholders satisfied with their journey?)
 */
const JH = {
  bg: "#0d0d0d",
  card: "#0d0d0d",
  /** Table / panel header band (rgb(21,21,21)) */
  surfaceRow: "#151515",
  /** Inset wells, secondary panels (rgb(26,26,26)) */
  surfaceInset: "#1a1a1a",
  /** Bar / row track (rgb(31,31,31)) */
  track: "#1f1f1f",
  /** Inner divider / pill chrome (rgb(42,42,42)) */
  borderInner: "#2a2a2a",
  border: "#1f1f1f",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#939394",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  watchYellow: "#eab308",
  neutralStack: "#1f1f1f",
  SEG: {
    HSHF: "#f59e0b",
    HSLF: "#14b8a6",
    LSHF: "#8b5cf6",
    LSLF: "#f97316",
  },
  CH: {
    Voice: "#ef4444",
    Chat: "#f97316",
    Email: "#eab308",
    Ticket: "#38bdf8",
    Social: "#4ade80",
  },
} as const;

type JhSegKey = keyof typeof JH.SEG;
type JhChannelKey = keyof typeof JH.CH;
type JhHealth = "Critical" | "At Risk" | "Watch" | "Good";

function jhHealthColor(health: JhHealth): string {
  if (health === "Critical") return JH.red;
  if (health === "At Risk") return JH.amber;
  if (health === "Watch") return JH.watchYellow;
  return JH.green;
}

function jhChurnBlockColor(churn: number): string {
  if (churn >= 10) return JH.red;
  if (churn >= 5) return JH.amber;
  return JH.watchYellow;
}

function JhN({ v, c, s = 15 }: { v: ReactNode; c?: string; s?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono), ui-monospace, monospace",
        fontWeight: 700,
        color: c ?? JH.text,
        fontSize: s,
      }}
    >
      {v}
    </span>
  );
}

function JhSeg({ k }: { k: JhSegKey }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 3,
        background: `${JH.SEG[k]}15`,
        color: JH.SEG[k],
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {k}
    </span>
  );
}

function JhCh({ k }: { k: JhChannelKey }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        color: JH.muted,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: JH.CH[k],
          flexShrink: 0,
        }}
      />
      {k}
    </span>
  );
}

function JhStatus({ h }: { h: JhHealth }) {
  const col = jhHealthColor(h);
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 3,
        background: `${col}14`,
        color: col,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {h}
    </span>
  );
}

function JhCard({
  children,
  accent,
  s = {},
}: {
  children: ReactNode;
  accent?: string;
  s?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: JH.card,
        border: `1px solid ${accent ? `${accent}33` : JH.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function JhSLbl({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: JH.text,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 7,
      }}
    >
      {children}
    </div>
  );
}

function JhHR() {
  return (
    <div style={{ height: 1, background: JH.borderInner, margin: "10px 0" }} />
  );
}

function JhInsight({
  children,
  color = JH.amber,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: "8px 11px",
        background: `${color}08`,
        borderLeft: `2px solid ${color}`,
        borderRadius: "0 4px 4px 0",
        marginTop: 8,
      }}
    >
      <span style={{ fontSize: 11, color: JH.muted, lineHeight: 1.5 }}>
        ✦ {children}
      </span>
    </div>
  );
}

function JhActionBar({ children }: { children: ReactNode }) {
    return (
    <div
      style={{
        padding: "6px 11px",
        background: `${JH.green}08`,
        borderLeft: `2px solid ${JH.green}`,
        borderRadius: "0 4px 4px 0",
        marginTop: 4,
      }}
    >
      <span style={{ fontSize: 11, color: JH.green, fontWeight: 600 }}>→ </span>
      <span style={{ fontSize: 11, color: JH.muted }}>{children}</span>
    </div>
  );
}

const JH_STAGES: {
  id: string;
  label: string;
  health: JhHealth;
  convos: string;
  neg: number;
  repeat: number;
  churn: number;
  wow: string;
  channel: Record<JhChannelKey, number>;
  pains: { label: string; pct: number; churn: number }[];
  insight: string;
  evidence: string;
  action: string;
}[] = [
  {
    id: "app",
    label: "Application & Onboarding",
    health: "Watch",
    convos: "4,420",
    neg: 36,
    repeat: 28,
    churn: 2.1,
    wow: "+8%",
    channel: { Voice: 42, Chat: 28, Email: 12, Ticket: 10, Social: 8 },
    pains: [
      { label: "App status enquiry", pct: 44, churn: 2.1 },
      { label: "Document pending", pct: 30, churn: 1.8 },
      { label: "KYC delay", pct: 16, churn: 1.2 },
    ],
    insight:
      "Customers are anxious about timelines, not the process itself. 'Where is my card' is the #1 phrase. Digital applicants expect 48hr but processing takes 5–7 days.",
    evidence: `"I applied 6 days ago, no update at all. Is this normal?" — Chat · LSLF`,
    action:
      "Add proactive SMS updates at each milestone. Enable IVR self-service for application tracking.",
  },
  {
    id: "act",
    label: "Activation & First Use",
    health: "At Risk",
    convos: "5,980",
    neg: 41,
    repeat: 31,
    churn: 3.2,
    wow: "+14%",
    channel: { Voice: 36, Chat: 38, Email: 8, Ticket: 12, Social: 6 },
    pains: [
      { label: "PIN / OTP failure", pct: 46, churn: 3.2 },
      { label: "Card declined — first use", pct: 28, churn: 4.1 },
      { label: "App registration issue", pct: 16, churn: 1.8 },
    ],
    insight:
      "OTP failure up 22% after gateway migration last week. 31% repeat contact means the first call isn't resolving it. Card-declined-on-first-use has the highest churn signal of any activation issue.",
    evidence: `"PIN is not working and the OTP never arrived. Third call this week." — Voice · LSHF`,
    action:
      "Escalate OTP gateway failure to tech as P1. Branch fallback activation for stuck cardholders.",
  },
  {
    id: "ev",
    label: "Everyday Usage",
    health: "At Risk",
    convos: "18,600",
    neg: 44,
    repeat: 34,
    churn: 6.2,
    wow: "+18%",
    channel: { Voice: 30, Chat: 32, Email: 14, Ticket: 8, Social: 16 },
    pains: [
      { label: "Cashback not credited", pct: 38, churn: 6.2 },
      { label: "Annual fee — not worth it", pct: 26, churn: 7.4 },
      { label: "Reward redemption failed", pct: 20, churn: 4.8 },
    ],
    insight:
      "Cashback missing has 42% repeat contact — not resolved on first call. Annual fee complaints carry the highest churn signal. HSHF cardholders are questioning fee value loudest.",
    evidence: `"Cashback hasn't appeared in 45 days. I've been promised it three times." — Chat · LSLF`,
    action:
      "Fix reward-status visibility in app (accrual + clear posting dates). Update fee-waiver scripts for agents.",
  },
  {
    id: "disp",
    label: "Disputes",
    health: "Critical",
    convos: "5,620",
    neg: 52,
    repeat: 47,
    churn: 6.8,
    wow: "+6%",
    channel: { Voice: 58, Chat: 24, Email: 6, Ticket: 8, Social: 4 },
    pains: [
      { label: "Dispute status follow-up", pct: 52, churn: 6.8 },
      { label: "Provisional credit delay", pct: 28, churn: 7.2 },
      { label: "Fraud claim denied", pct: 14, churn: 9.4 },
    ],
    insight:
      "BPO Vendor Beta holds 62% of cases at evidence collection — avg TAT now 3.2 days, up from 2.4. Customers calling 3–4 times for status updates. Highest repeat contact of any stage (47%).",
    evidence: `"Third call about the same dispute. I need an update, not another callback promise." — Voice · HSHF`,
    action:
      "Cap Vendor Beta to low-complexity cases only. Outbound calls for any case aged 14+ days.",
  },
  {
    id: "ret",
    label: "Retention",
    health: "Critical",
    convos: "1,240",
    neg: 68,
    repeat: 39,
    churn: 18.5,
    wow: "+31%",
    channel: { Voice: 64, Chat: 18, Email: 8, Ticket: 6, Social: 4 },
    pains: [
      { label: "Closure intent", pct: 56, churn: 68 },
      { label: "Annual fee negotiation", pct: 26, churn: 38 },
      { label: "Downgrade request", pct: 14, churn: 42 },
    ],
    insight:
      "68% negative sentiment — worst of any stage. Save rate at 32% vs industry benchmark of 40–45%. 18 HSHF cardholders showed closure intent this week — combined spend at risk: ~$4.2M.",
    evidence: `"8-year customer. Annual fee up again. Competitor is offering same lounge access for free." — Voice · HSHF`,
    action:
      "Retention callback for all HSHF closure-intent conversations. Brief agents on retention offers immediately.",
  },
];

const JH_SEG_ROWS: {
  k: JhSegKey;
  desc: string;
  happy: number;
  neu: number;
  unhappy: number;
  churn: string;
  pain: string;
  convos: string;
  neg: number;
  repeat: number;
}[] = [
  {
    k: "HSHF",
    desc: "High Spend · High Freq",
    happy: 32,
    neu: 27,
    unhappy: 41,
    churn: "7.2%",
    pain: "Annual fee",
    convos: "1,420",
    neg: 41,
    repeat: 28,
  },
  {
    k: "HSLF",
    desc: "High Spend · Low Freq",
    happy: 38,
    neu: 27,
    unhappy: 35,
    churn: "5.1%",
    pain: "Reward redemption",
    convos: "860",
    neg: 35,
    repeat: 22,
  },
  {
    k: "LSHF",
    desc: "Low Spend · High Freq",
    happy: 34,
    neu: 28,
    unhappy: 38,
    churn: "4.8%",
    pain: "Card declined",
    convos: "2,940",
    neg: 38,
    repeat: 31,
  },
  {
    k: "LSLF",
    desc: "Low Spend · Low Freq",
    happy: 28,
    neu: 28,
    unhappy: 44,
    churn: "6.9%",
    pain: "Statement confusion",
    convos: "1,760",
    neg: 44,
    repeat: 26,
  },
];

const JH_CHANNEL_TABLE: {
  ch: JhChannelKey;
  neg: number;
  vol: string;
  topIssue: string;
  insight: string;
}[] = [
  {
    ch: "Social",
    neg: 62,
    vol: "3,820",
    topIssue: "Annual fee complaints",
    insight: "",
  },
  {
    ch: "Voice",
    neg: 54,
    vol: "14,820",
    topIssue: "Dispute follow-up",
    insight: "",
  },
  {
    ch: "Ticket",
    neg: 48,
    vol: "2,840",
    topIssue: "Dispute status enquiry",
    insight: "",
  },
  {
    ch: "Chat",
    neg: 41,
    vol: "9,640",
    topIssue: "Cashback missing",
    insight: "",
  },
  {
    ch: "Email",
    neg: 36,
    vol: "2,180",
    topIssue: "Statement query",
    insight: "",
  },
];

const JH_ALERTS: { sev: string; msg: string; action: string; c: string }[] = [
  {
    sev: "CRITICAL",
    msg: "Save rate 32% vs 45% industry. 18 HSHF closures this week — $4.2M spend at risk.",
    action: "Retention callback for HSHF closure-intent today.",
    c: "#ef4444",
  },
  {
    sev: "CRITICAL",
    msg: "Dispute repeat contact at 47%. BPO Vendor Beta bottleneck unresolved for 3 weeks.",
    action: "Cap Vendor Beta, escalate 14+ day cases to in-house team.",
    c: "#ef4444",
  },
  {
    sev: "ALERT",
    msg: "Cashback missing: 3,620 conversations, 42% repeat contact, 6.2% churn signal.",
    action: "Reward-status fix in app — post accrual date clearly.",
    c: "#f59e0b",
  },
  {
    sev: "ALERT",
    msg: "OTP gateway failure +22% WoW. 2,140 activation calls this week.",
    action: "Escalate to tech as P1. Branch fallback for stuck activations.",
    c: "#f59e0b",
  },
  {
    sev: "WARNING",
    msg: "Cross-sell during complaints creating 840 frustrated callbacks this month.",
    action: "Pause all mid-complaint upsell scripts until complaint resolved.",
    c: "#eab308",
  },
  {
    sev: "WARNING",
    msg: "Average retention queue hold time up 41% WoW — 840 callbacks abandoned mid-call.",
    action: "Add skill-based routing; cap concurrent cases per advisor.",
    c: "#eab308",
  },
  {
    sev: "ALERT",
    msg: "Foreign-transaction declines +18% YoY · 920 conversations tagged “declined overseas”.",
    action: "Refresh travel-notification UX; push proactive SMS before trip windows.",
    c: "#f59e0b",
  },
  {
    sev: "CRITICAL",
    msg: "Wallet provisioning anomalies: 4 linked accounts same device ×  distinct cardholders.",
    action: "Freeze instant provisioning; escalate to Fraud ops with device fingerprints.",
    c: "#ef4444",
  },
  {
    sev: "ALERT",
    msg: "App crash rate on Payment screen doubled (2.1% sessions) · Android 13+ spike.",
    action: "Hotfix rollout P0; downgrade payment SDK bridge until patched.",
    c: "#f59e0b",
  },
];

const JH_REPEAT: {
  issue: string;
  rate: number;
  vol: string;
  ch: JhChannelKey;
  seg: JhSegKey;
}[] = [
  {
    issue: "Dispute follow-up",
    rate: 47,
    vol: "2,640",
    ch: "Voice",
    seg: "HSHF",
  },
  {
    issue: "Cashback not credited",
    rate: 42,
    vol: "3,620",
    ch: "Chat",
    seg: "LSLF",
  },
  {
    issue: "Annual fee complaint",
    rate: 31,
    vol: "2,410",
    ch: "Voice",
    seg: "HSHF",
  },
  {
    issue: "PIN / OTP failure",
    rate: 34,
    vol: "1,840",
    ch: "Chat",
    seg: "LSHF",
  },
  {
    issue: "Reward redemption failed",
    rate: 29,
    vol: "1,980",
    ch: "Chat",
    seg: "HSLF",
  },
  {
    issue: "Card declined — first use",
    rate: 22,
    vol: "1,060",
    ch: "Voice",
    seg: "LSHF",
  },
];

const JH_TOP_SEGMENT_ROWS = [
  { seg: "HSHF", interactions: "9,550", wow: "+2.1%", wowUp: true, sentiment: "0.08", sentimentColor: "#10b981", fci: "0.8%" },
  { seg: "HSLF", interactions: "6,360", wow: "-0.8%", wowUp: false, sentiment: "0.03", sentimentColor: "#f59e0b", fci: "1.2%" },
  { seg: "LSHF", interactions: "22,700", wow: "+3.4%", wowUp: true, sentiment: "0.16", sentimentColor: "#ef4444", fci: "2.1%" },
  { seg: "LSLF", interactions: "15,130", wow: "-1.5%", wowUp: false, sentiment: "0.26", sentimentColor: "#ef4444", fci: "2.8%" },
] as const;

const JH_AI_SUMMARY_ROWS = [
  { sev: "CRITICAL", title: "Debit Card Dispute Flow Broken", detail: "900 repeat calls today without dispute form submission.", color: "#ef4444" },
  { sev: "ALERT", title: "Branch + Phone Loop Detected", detail: "340 customers are bouncing channels without closure.", color: "#f97316" },
  { sev: "WARNING", title: "SLA Failure: VIP Emails", detail: "156 high-value customers delayed beyond 48 hours.", color: "#eab308" },
  { sev: "INFO", title: "Platinum Card Launch Volume Surge", detail: "2,340 feature and eligibility calls logged today.", color: "#22c55e" },
] as const;

const JH_FAILING_DATA = [
  {
    topic: "Dispute follow-up",
    Voice: 1082,
    Chat: 911,
    Email: 512,
    Social: 163,
    Ticket: 179,
    HSHF: 812,
    HSLF: 534,
    LSHF: 853,
    LSLF: 448,
    totalCases: 2847,
    interactions: 8234,
    resolution: "2.8 hours",
    gap: "28%",
    affected: "2,156",
    processError: "72%",
    insight:
      "Chargeback status ambiguity and delayed evidence confirmation are driving repeated dispute follow-up calls.",
    recommendation:
      "Auto-push dispute stage updates in app/SMS and provide same-screen agent visibility of chargeback timeline.",
    topics: ["Chargeback Status", "Merchant Reversal", "Dispute Documents", "Provisional Credit", "Fraud Review"],
  },
  {
    topic: "Cashback not credited",
    Voice: 960,
    Chat: 256,
    Email: 301,
    Social: 0,
    Ticket: 355,
    HSHF: 540,
    HSLF: 488,
    LSHF: 366,
    LSLF: 178,
    totalCases: 1872,
    interactions: 6390,
    resolution: "3.9 hours",
    gap: "34%",
    affected: "1,484",
    processError: "68%",
    insight:
      "Cycle-cutoff confusion and merchant category exclusions are causing repeat contacts on cashback eligibility.",
    recommendation:
      "Expose cashback eligibility reason codes in app and trigger proactive alerts when payout is deferred.",
    topics: ["Cashback Missing", "MCC Exclusion", "Statement Cycle", "Offer Eligibility", "Reward Posting Delay"],
  },
  {
    topic: "Annual fee complaint",
    Voice: 525,
    Chat: 788,
    Email: 238,
    Social: 134,
    Ticket: 112,
    HSHF: 462,
    HSLF: 406,
    LSHF: 292,
    LSLF: 0,
    totalCases: 1797,
    interactions: 5216,
    resolution: "2.1 hours",
    gap: "22%",
    affected: "1,210",
    processError: "59%",
    insight:
      "Waiver promise mismatch between campaign terms and servicing scripts is creating trust loss for cardholders.",
    recommendation:
      "Standardize fee-waiver policy by card tier and surface real-time waiver eligibility in agent desktop.",
    topics: ["Fee Waiver", "Renewal Fee", "Spend Milestone", "Retention Offer", "Reversal Request"],
  },
  {
    topic: "PIN / OTP failure",
    Voice: 793,
    Chat: 149,
    Email: 441,
    Social: 0,
    Ticket: 188,
    HSHF: 383,
    HSLF: 0,
    LSHF: 299,
    LSLF: 188,
    totalCases: 1571,
    interactions: 4010,
    resolution: "2.6 hours",
    gap: "31%",
    affected: "964",
    processError: "64%",
    insight:
      "OTP expiry and PIN reset fallback failures are increasing authentication retries and repeat support contacts.",
    recommendation:
      "Enable one-tap OTP resend with trusted-device fallback and simplify card PIN reset journey in-app.",
    topics: ["OTP Timeout", "PIN Reset Failed", "3DS Verification", "CVV Auth Failure", "Login Lockout"],
  },
  {
    topic: "Reward redemption failed",
    Voice: 476,
    Chat: 842,
    Email: 408,
    Social: 116,
    Ticket: 139,
    HSHF: 328,
    HSLF: 421,
    LSHF: 0,
    LSLF: 219,
    totalCases: 1981,
    interactions: 5746,
    resolution: "3.1 hours",
    gap: "24%",
    affected: "1,098",
    processError: "57%",
    insight:
      "Points ledger sync delays and catalogue rejection errors are causing repeat redemption attempts.",
    recommendation:
      "Add instant redemption status tracking and auto-retry for failed partner fulfilment transactions.",
    topics: ["Points Not Visible", "Voucher Failure", "Partner Rejection", "Catalogue Error", "Miles Transfer Delay"],
  },
  {
    topic: "Card declined — first use",
    Voice: 612,
    Chat: 743,
    Email: 384,
    Social: 192,
    Ticket: 255,
    HSHF: 212,
    HSLF: 167,
    LSHF: 519,
    LSLF: 0,
    totalCases: 1618,
    interactions: 4692,
    resolution: "2.4 hours",
    gap: "33%",
    affected: "1,005",
    processError: "66%",
    insight:
      "First-transaction declines are mostly linked to activation mismatch and risk-rule false positives.",
    recommendation:
      "Trigger proactive first-use readiness checks and allow instant secure unblock for verified cardholders.",
    topics: ["Card Not Activated", "POS Decline", "Risk Block", "International Toggle", "First Swipe Failure"],
  },
  {
    topic: "EMI conversion failed",
    Voice: 548,
    Chat: 476,
    Email: 239,
    Social: 82,
    Ticket: 121,
    HSHF: 431,
    HSLF: 0,
    LSHF: 269,
    LSLF: 214,
    totalCases: 1366,
    interactions: 3928,
    resolution: "2.7 hours",
    gap: "26%",
    affected: "892",
    processError: "58%",
    insight:
      "Post-purchase EMI conversion failures are concentrated around merchant mapping and tenure validation breaks.",
    recommendation:
      "Add real-time EMI eligibility checks at transaction level and provide instant fallback conversion path.",
    topics: ["EMI Eligibility", "Tenure Mismatch", "Merchant Mapping", "Conversion Timeout", "Interest Dispute"],
  },
  {
    topic: "Credit limit not updated",
    Voice: 433,
    Chat: 501,
    Email: 184,
    Social: 67,
    Ticket: 96,
    HSHF: 392,
    HSLF: 297,
    LSHF: 242,
    LSLF: 0,
    totalCases: 1281,
    interactions: 3614,
    resolution: "3.0 hours",
    gap: "29%",
    affected: "774",
    processError: "61%",
    insight:
      "Limit-enhancement promises are not reflecting after bureau refresh, creating repeat complaint loops.",
    recommendation:
      "Surface approval/decline reason codes and sync limit updates instantly across app and contact center tools.",
    topics: ["Limit Increase", "Bureau Refresh", "Utilization Threshold", "Pre-Approved Offer", "Statement Update"],
  },
  {
    topic: "Statement not generated",
    Voice: 384,
    Chat: 418,
    Email: 296,
    Social: 51,
    Ticket: 88,
    HSHF: 0,
    HSLF: 0,
    LSHF: 389,
    LSLF: 313,
    totalCases: 1237,
    interactions: 3478,
    resolution: "2.9 hours",
    gap: "23%",
    affected: "736",
    processError: "53%",
    insight:
      "Billing-cycle statement generation delays are causing payment confusion and avoidable late-fee anxiety.",
    recommendation:
      "Push statement-ready notifications with due-date context and auto-share downloadable copies in-app.",
    topics: ["Billing Cycle", "Statement Delay", "Due Date", "Late Fee Concern", "E-Statement Download"],
  },
  {
    topic: "International usage blocked",
    Voice: 362,
    Chat: 334,
    Email: 177,
    Social: 73,
    Ticket: 69,
    HSHF: 286,
    HSLF: 0,
    LSHF: 0,
    LSLF: 0,
    totalCases: 1015,
    interactions: 2892,
    resolution: "2.5 hours",
    gap: "21%",
    affected: "628",
    processError: "49%",
    insight:
      "Travel-mode toggles and geofence checks are not consistently applied, causing legitimate international declines.",
    recommendation:
      "Pre-authorize travel windows with dynamic risk thresholds and send real-time unblock prompts to cardholders.",
    topics: ["Travel Notice", "International Toggle", "FX Transaction Decline", "Geo-Risk Rule", "POS Unblock"],
  },
] as const;

function JourneyWhatsFailingPanel() {
  const [selectedTopic, setSelectedTopic] = useState<string>(JH_FAILING_DATA[0].topic);
  const selected =
    JH_FAILING_DATA.find((d) => d.topic === selectedTopic) ?? JH_FAILING_DATA[0];
  const handleBarSelect = (entry: unknown) => {
    const topic = (
      entry as
        | { topic?: string; payload?: { topic?: string } }
        | undefined
    )?.topic ?? (
      entry as
        | { topic?: string; payload?: { topic?: string } }
        | undefined
    )?.payload?.topic;
    if (topic) setSelectedTopic(topic);
  };

  const series = (
    [
      ["HSHF", "HSHF — High Spend High Frequency"],
      ["HSLF", "HSLF — High Spend Low Frequency"],
      ["LSHF", "LSHF — Low Spend High Frequency"],
      ["LSLF", "LSLF — Low Spend Low Frequency"],
    ] as const
  ).map(([key, label]) => ({
    key,
    label,
    color: JH.SEG[key],
  }));

  return (
    <div style={{ background: JH.card, border: `1px solid ${JH.borderInner}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: JH.text, margin: "0 0 12px" }}>Repeat contact analysis - By Customer Segment</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, minHeight: 450 }}>
        <div style={{ width: "50%", transition: "width 0.3s ease" }}>
          <div style={{ width: "100%", height: 460 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={JH_FAILING_DATA as unknown as any[]}
                margin={{ top: 0, right: 10, left: 10, bottom: 80 }}
                barSize={47}
                barCategoryGap={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis
                  dataKey="topic"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={78}
                  tick={{ fontSize: 9, fill: JH.sub }}
                />
                <YAxis tick={{ fontSize: 11, fill: JH.sub }} />
                <Tooltip
                  contentStyle={{
                    background: "#0d0d0d",
                    border: `1px solid ${JH.borderInner}`,
                    borderRadius: 10,
                  }}
                  formatter={(value, name) => [Number(value ?? 0), String(name)]}
                />
                {series.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    stackId="a"
                    fill={s.color}
                    radius={[0, 0, 0, 0]}
                    cursor="pointer"
                    onClick={(data) => handleBarSelect(data)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: -70, padding: 12, borderRadius: 10, background: JH.surfaceInset, border: `1px solid ${JH.borderInner}` }}>
            {series.map((s) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: s.color, display: "inline-block" }} />
                <span style={{ fontSize: 13, color: JH.sub }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "50%", transition: "width 0.3s ease", border: `1px solid ${JH.borderInner}`, borderRadius: 12, padding: 14, background: JH.card, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h4 style={{ margin: 0, fontSize: 18, color: JH.text }}>{selected.topic}</h4>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: JH.red, borderRadius: 4, padding: "3px 8px" }}>High Impact</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: JH.red }}>{selected.totalCases}</span>
                <span style={{ fontSize: 12, color: JH.dim }}>cases</span>
                <span style={{ fontSize: 11, color: JH.red, fontWeight: 700 }}>+12.5%</span>
              </div>
            </div>
            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                color: JH.dim,
                fontSize: 18,
                lineHeight: 1,
                cursor: "default",
                padding: 2,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, padding: 12, borderRadius: 10, background: JH.surfaceInset, marginBottom: 10 }}>
            <div><div style={{ fontSize: 10, color: JH.dim }}>Total Interactions</div><div style={{ fontSize: 13, color: JH.text, fontWeight: 800 }}>{selected.interactions}</div></div>
            <div><div style={{ fontSize: 10, color: JH.dim }}>Avg Resolution</div><div style={{ fontSize: 13, color: JH.text, fontWeight: 800 }}>{selected.resolution}</div></div>
            <div><div style={{ fontSize: 10, color: JH.dim }}>Knowledge Gap</div><div style={{ fontSize: 13, color: JH.amber, fontWeight: 800 }}>{selected.gap}</div></div>
            <div><div style={{ fontSize: 10, color: JH.dim }}>Customers Affected</div><div style={{ fontSize: 13, color: JH.text, fontWeight: 800 }}>{selected.affected}</div></div>
            <div><div style={{ fontSize: 10, color: JH.dim }}>Process Error</div><div style={{ fontSize: 13, color: JH.red, fontWeight: 800 }}>{selected.processError}</div></div>
          </div>

          <div style={{ border: "1px solid rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.08)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: JH.amber, textTransform: "uppercase", marginBottom: 4 }}>AI Insight</div>
            <div style={{ fontSize: 13, color: JH.sub, lineHeight: 1.5 }}>{selected.insight}</div>
          </div>
          <div style={{ border: "1px solid rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.08)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: JH.green, textTransform: "uppercase", marginBottom: 4 }}>Recommendation</div>
            <div style={{ fontSize: 13, color: JH.sub, lineHeight: 1.5 }}>{selected.recommendation}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: JH.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Dominant Topics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selected.topics.map((t) => (
                <span key={t} style={{ fontSize: 11, color: JH.sub, background: JH.surfaceInset, border: `1px solid ${JH.borderInner}`, borderRadius: 999, padding: "4px 10px" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyTopCommandCenter() {
  const [topIntentSegment, setTopIntentSegment] = useState<V3JourneyIntentSegmentKey | null>(null);
  const intentSlice =
    topIntentSegment === null ? V3_JOURNEY_TOP_INTENT_AGGREGATE : V3_JOURNEY_TOP_INTENT_BY_SEGMENT[topIntentSegment];

  const npsData = [
    { week: "W-11", HSHF: 48, HSLF: 40, LSHF: 54, LSLF: 30 },
    { week: "W-10", HSHF: 46, HSLF: 39, LSHF: 55, LSLF: 28 },
    { week: "W-9", HSHF: 44, HSLF: 37, LSHF: 56, LSLF: 25 },
    { week: "W-8", HSHF: 42, HSLF: 36, LSHF: 58, LSLF: 23 },
    { week: "W-7", HSHF: 39, HSLF: 34, LSHF: 59, LSLF: 21 },
    { week: "W-6", HSHF: 36, HSLF: 32, LSHF: 60, LSLF: 18 },
    { week: "W-5", HSHF: 33, HSLF: 31, LSHF: 61, LSLF: 16 },
    { week: "W-4", HSHF: 31, HSLF: 30, LSHF: 62, LSLF: 14 },
    { week: "W-3", HSHF: 28, HSLF: 29, LSHF: 63, LSLF: 13 },
    { week: "W-2", HSHF: 25, HSLF: 27, LSHF: 64, LSLF: 11 },
    { week: "W-1", HSHF: 23, HSLF: 26, LSHF: 65, LSLF: 10 },
    { week: "Now", HSHF: 20, HSLF: 25, LSHF: 66, LSLF: 9 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 14, background: JH.card, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: JH.dim, margin: 0 }}>TOTAL INTERACTIONS</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 3 }}>
              <span style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, background: "linear-gradient(135deg, #5332ff 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>53,740</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 999, padding: "2px 8px" }}>▲ +1,842 vs last week</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10.5, color: JH.dim }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#34d399" }} />Positive</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#fbbf24" }} />Neutral</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff073a" }} />Negative</span>
          </div>
        </div>
        <div style={{ border: `1px solid ${JH.border}`, borderRadius: 8, overflow: "hidden", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "64px minmax(88px,1fr) 80px 64px 60px", gap: 12, padding: "8px 12px", background: JH.surfaceRow, borderBottom: `1px solid ${JH.border}` }}>
            {["SEGMENT", "INTERACTIONS", "WoW", "SENTIMENT", "FCI RATE"].map((h) => (
              <span key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: JH.dim }}>{h}</span>
            ))}
          </div>
          {[
            ["HSHF", "9,550", true, "2.1%", "0.08", "0.8%", JH.SEG.HSHF, "#10b981"],
            ["HSLF", "6,360", false, "0.8%", "0.03", "1.2%", JH.SEG.HSLF, "#f59e0b"],
            ["LSHF", "22,700", true, "3.4%", "0.16", "2.1%", JH.SEG.LSHF, "#ef4444"],
            ["LSLF", "15,130", false, "1.5%", "0.26", "2.8%", JH.SEG.LSLF, "#ef4444"],
          ].map(([seg, itx, up, wow, sent, fci, segColor, sentColor], i) => (
            <div key={String(seg)} style={{ display: "grid", gridTemplateColumns: "64px minmax(88px,1fr) 80px 64px 60px", gap: 12, padding: "8px 12px", borderTop: i === 0 ? "none" : `1px solid ${JH.border}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: String(segColor), background: `${segColor}18`, border: `1px solid ${segColor}40`, borderRadius: 999, width: "max-content", padding: "2px 8px" }}>{seg}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: JH.text }}>{itx}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: up ? "#10b981" : "#ef4444" }}>{up ? "▲" : "▼"} {wow}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: String(sentColor) }}>{sent}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: JH.text }}>{fci}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 12, background: JH.card, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 3, background: "#5332ff" }} />
        <div style={{ marginLeft: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: JH.text }}>Sentiment by Relationship Value</div>
          <div style={{ fontSize: 10, color: JH.dim, marginBottom: 8 }}>Sentiment split · deposits at stake</div>
          {[
            ["H1 · $1M+", "$184M · 312 accts", 44, 26, 30],
            ["H2 · $500K–1M", "$276M · 624 accts", 51, 24, 25],
            ["H3 · $250K–500K", "$312M · 1085 accts", 58, 22, 20],
          ].map(([l, sub, h, n, u]) => (
            <div key={String(l)} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: JH.text }}>{l}</span>
                <span style={{ fontSize: 10, color: JH.dim }}>{sub}</span>
              </div>
              <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", background: JH.track }}>
                <div style={{ width: `${h}%`, background: "#22c55e", fontSize: 10, fontWeight: 700, color: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>{h}%</div>
                <div style={{ width: `${n}%`, background: "#f59e0b", fontSize: 10, fontWeight: 700, color: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>{n}%</div>
                <div style={{ width: `${u}%`, background: "#ef4444", fontSize: 10, fontWeight: 700, color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>{u}%</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${JH.border}`, paddingTop: 6, display: "flex", gap: 12, fontSize: 9.5, color: JH.dim }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#22c55e" }} />Happy</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#f59e0b" }} />Neutral</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#ef4444" }} />Unhappy</span>
          </div>
        </div>
      </div>

      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 12, background: JH.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: JH.text }}>Top Intent</div>
          {topIntentSegment ? (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: JH.SEG[topIntentSegment],
                background: `${JH.SEG[topIntentSegment]}18`,
                border: `1px solid ${JH.SEG[topIntentSegment]}44`,
                borderRadius: 999,
                padding: "2px 8px",
              }}
            >
              {topIntentSegment} lens
            </span>
          ) : (
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color: JH.dim }}>All segments</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: JH.red, lineHeight: 1 }}>{intentSlice.identifiedCount}</span>
          <span style={{ fontSize: 11, color: JH.dim }}>identified</span>
        </div>
        <div
          style={{
            display: "flex",
            height: 22,
            marginBottom: 8,
            borderRadius: 8,
            overflow: "hidden",
            gap: 2,
          }}
          title={intentSlice.intents.map((i) => `${i.label}: ${i.count}`).join(" · ")}
        >
          {intentSlice.intents.map((row) => (
            <div
              key={row.label}
              style={{
                flex: row.count,
                minWidth: 0,
                background: row.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {row.count}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 6, marginBottom: 8 }}>
          {intentSlice.intents.map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: row.color, flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11,
                  color: JH.sub,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color: JH.dim, marginBottom: 6 }}>INTENT VOLUME BY SEGMENT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 4 }}>
          {V3_JOURNEY_INTENT_SEGMENT_KEYS.map((seg) => {
            const c = JH.SEG[seg];
            const n = V3_JOURNEY_INTENT_SEGMENT_RING_COUNTS[seg];
            const selected = topIntentSegment === seg;
            return (
              <button
                key={seg}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopIntentSegment((prev) => (prev === seg ? null : seg))}
                style={{
                  background: selected ? `${c}22` : JH.track,
                  borderRadius: 8,
                  padding: "6px 2px",
                  textAlign: "center",
                  border: selected ? `2px solid ${c}` : `1px solid ${JH.borderInner}`,
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c,
                    border: `1.5px solid ${c}`,
                    fontSize: 9,
                    fontWeight: 700,
                    background: `${c}20`,
                  }}
                >
                  {n}
                </div>
                <div style={{ marginTop: 4, fontSize: 8.5, fontWeight: selected ? 800 : 600, color: selected ? c : JH.dim }}>{seg}</div>
              </button>
            );
          })}
        </div>

      </div>

      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 12, background: JH.card }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: JH.text, marginBottom: 2 }}>NPS Segment Monitor</div>
        <div style={{ fontSize: 10, color: JH.dim, marginBottom: 6 }}>12-week rolling · HSHF deterioration is fastest (-28 pts)</div>
        <div style={{ height: 142, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={npsData} margin={{ top: 10, right: 15, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={JH.border} />
              <XAxis dataKey="week" tick={{ fill: JH.dim, fontSize: 10 }} tickMargin={8} axisLine={{ stroke: "#393939" }} tickLine={false} />
              <YAxis tick={{ fill: JH.dim, fontSize: 10 }} width={28} domain={[0, 70]} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="HSHF" stroke={JH.SEG.HSHF} strokeWidth={2.5} dot={{ r: 2, fill: "#fff" }} />
              <Line type="monotone" dataKey="HSLF" stroke={JH.SEG.HSLF} strokeWidth={2} dot={{ r: 2, fill: "#fff" }} />
              <Line type="monotone" dataKey="LSHF" stroke={JH.SEG.LSHF} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 2, fill: "#fff" }} />
              <Line type="monotone" dataKey="LSLF" stroke={JH.SEG.LSLF} strokeWidth={2} dot={{ r: 2, fill: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4, borderTop: `1px solid ${JH.border}`, paddingTop: 4 }}>
          {(["HSHF", "HSLF", "LSHF", "LSLF"] as const).map((seg) => (
            <div key={seg} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: JH.SEG[seg] }} />
              <span style={{ fontSize: 10, color: JH.dim }}>{seg}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 12, background: JH.card, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 3, background: "#f59e0b" }} />
        <div style={{ marginLeft: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: JH.text }}>Vulnerable Watchlist</div>
              <div style={{ fontSize: 10, color: JH.dim }}>High Churn Signals</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 999, padding: "2px 6px" }}>
              AI
            </span>
          </div>
          {[
            ["HSHF", "2 customers", "High", JH.SEG.HSHF, "#ef4444"],
            ["HSLF", "1 customer", "High", JH.SEG.HSLF, "#ef4444"],
            ["LSHF", "2 customers", "Medium", JH.SEG.LSHF, "#f59e0b"],
            ["LSLF", "1 customer", "Medium", JH.SEG.LSLF, "#f59e0b"],
          ].map(([seg, n, level, segColor, levelColor]) => (
            <div
              key={String(seg)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                padding: "6px 8px",
                borderRadius: 6,
                background: `${segColor}12`,
                border: `1px solid ${segColor}30`,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: String(segColor) }}>
                {seg} <span style={{ color: JH.dim, fontWeight: 500 }}>· {n}</span>
              </span>
              <span style={{ fontSize: 9, fontWeight: 800, color: String(levelColor), background: `${levelColor}15`, border: `1px solid ${levelColor}40`, borderRadius: 999, padding: "2px 6px" }}>
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${JH.border}`, borderRadius: 12, padding: 12, background: JH.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: JH.text }}>Strain &amp; Friction</span>
          <span style={{ fontSize: 9.5, color: JH.dim }}>+2.1% vs last</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: JH.text, fontWeight: 600 }}>Strained Conversations</span>
            <span style={{ fontSize: 11, color: "#5332ff", fontWeight: 700 }}>34.2%</span>
          </div>
          <div style={{ height: 14, borderRadius: 999, background: JH.track, overflow: "hidden" }}>
            <div style={{ width: "34.2%", height: "100%", background: "linear-gradient(90deg, #5332ff 0%, #7c3aed 100%)" }} />
          </div>
        </div>
        <div style={{ border: `1px solid ${JH.borderInner}`, borderRadius: 8, overflow: "hidden", background: JH.track }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 44px 44px 44px 44px 56px", gap: 4, padding: "5px 8px", borderBottom: `1px solid ${JH.borderInner}` }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: JH.dim }}>SIGNAL</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: JH.SEG.HSHF, textAlign: "center" }}>HSHF</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: JH.SEG.HSLF, textAlign: "center" }}>HSLF</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: JH.SEG.LSHF, textAlign: "center" }}>LSHF</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: JH.SEG.LSLF, textAlign: "center" }}>LSLF</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#5332ff", textAlign: "right" }}>TOTAL</span>
          </div>
          {[
            ["Escalations", 182, 118, 94, 62, 456],
            ["Long Handling Time", 246, 204, 168, 105, 723],
            ["Interruptions", 96, 84, 78, 54, 312],
            ["High Agitation Calls", 72, 48, 42, 27, 189],
          ].map((r, i) => (
            <div key={String(r[0])} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 44px 44px 44px 44px 56px", gap: 4, padding: "5px 8px", borderTop: i === 0 ? "none" : `1px solid ${JH.borderInner}`, alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: JH.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r[0]}</span>
              <span style={{ fontSize: 10, color: JH.SEG.HSHF, textAlign: "center", fontWeight: 600 }}>{r[1]}</span>
              <span style={{ fontSize: 10, color: JH.SEG.HSLF, textAlign: "center", fontWeight: 600 }}>{r[2]}</span>
              <span style={{ fontSize: 10, color: JH.SEG.LSHF, textAlign: "center", fontWeight: 600 }}>{r[3]}</span>
              <span style={{ fontSize: 10, color: JH.SEG.LSLF, textAlign: "center", fontWeight: 600 }}>{r[4]}</span>
              <span style={{ fontSize: 11.5, color: "#5332ff", textAlign: "right", fontWeight: 700 }}>{r[5]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JourneyTopAISummaryWall() {
  type SummaryWallRow = {
    id: string;
    level: "CRITICAL" | "ALERT" | "WARNING" | "INFO";
    levelColor: string;
    tag: string;
    title: string;
    body: string;
    metric: string;
    delta: string;
    icon: ComponentType<{ size?: number; color?: string }>;
    tagIcon: ComponentType<{ size?: number; color?: string }>;
    pulse?: boolean;
    extra?: string;
    details: string[];
    action: string;
    rootCause: string;
    affectedAreas: string[];
    recommendedActions: string[];
    timeline: string;
    owner: string;
    priorityLabel: "High" | "Immediate" | "Medium" | "Low";
  };

  const rows: SummaryWallRow[] = [
    {
      id: "critical-journey-decline",
      level: "CRITICAL",
      levelColor: "#ef4444",
      tag: "Journey Outcome",
      title: "NPS erosion concentrated in HSHF cardholders",
      body: "NPS monitor shows HSHF dropping from 48 to 20 over 12 weeks while LSLF remains in single digits, signaling urgent retention risk in high-value cohorts.",
      metric: "HSHF down 28 points",
      delta: "+12.5% dissatisfaction trend",
      icon: CircleAlert,
      tagIcon: CreditCard,
      pulse: true,
      details: [
        "HSHF trajectory declines from 48 to 20 across 12 weeks.",
        "LSLF remains single-digit NPS, indicating structural dissatisfaction.",
        "Retention-stage negative sentiment is highest in vulnerable cohorts.",
      ],
      action:
        "Launch HSHF recovery program: proactive outreach + priority resolution on dispute and authentication journeys.",
      rootCause:
        "High-value cardholders face unresolved repeat issues across dispute, authentication, and first-use failure paths with limited proactive recovery.",
      affectedAreas: ["Retention", "Card Servicing", "Disputes", "Premium Desk", "NPS Governance"],
      recommendedActions: [
        "Launch HSHF rescue queue with <4 hour callback SLA",
        "Enable proactive outreach for NPS-critical cardholders",
        "Escalate repeat-contact cases to specialized resolution pod",
        "Track weekly NPS recovery by segment and issue intent",
      ],
      timeline: "1-2 weeks for operating model, 3-4 weeks for sustained NPS lift tracking",
      owner: "Head of Cardholder Experience",
      priorityLabel: "Immediate",
    },
    {
      id: "alert-repeat-intents",
      level: "ALERT",
      levelColor: "#f97316",
      tag: "Repeat Contact Driver",
      title: "Dispute follow-up + cashback gaps dominate repeat demand",
      body: "The highest-volume failure intents are Dispute follow-up and Cashback not credited, with multi-segment spread and elevated process error levels.",
      metric: "4,719 combined cases",
      delta: "+31% pressure vs next cluster",
      icon: TriangleAlert,
      tagIcon: RefreshCw,
      details: [
        "Dispute follow-up is the highest-volume repeat contact intent.",
        "Cashback not credited is the second-most persistent callback driver.",
        "Both intents show elevated process error and cross-segment spread.",
      ],
      action:
        "Fix dispute status transparency and cashback posting visibility first to reduce avoidable repeat load quickly.",
      rootCause:
        "Status opacity in dispute lifecycle and delayed cashback posting create avoidable callbacks and trust erosion.",
      affectedAreas: ["Disputes", "Rewards Engine", "App Experience", "Contact Center", "Operations"],
      recommendedActions: [
        "Expose real-time dispute stage in app and agent desktop",
        "Publish cashback eligibility and posting ETA per transaction",
        "Trigger proactive notification when payout is deferred",
        "Create single owner for dispute + cashback escalations",
      ],
      timeline: "1-2 weeks for policy/visibility fixes, 4-6 weeks for full workflow integration",
      owner: "Disputes & Rewards Operations Manager",
      priorityLabel: "High",
    },
    {
      id: "warning-service-friction",
      level: "WARNING",
      levelColor: "#eab308",
      tag: "Service Friction",
      title: "Authentication and first-use issues still unresolved",
      body: "PIN/OTP failures and first-use card declines continue to trigger preventable callbacks and onboarding friction in early lifecycle stages.",
      metric: "3,189 affected cases",
      extra: "2.4-2.6 hrs avg resolution",
      delta: "+22% repeat propensity",
      icon: Zap,
      tagIcon: Timer,
      details: [
        "PIN/OTP failures continue to break first-touch resolution.",
        "Card declined-first-use impacts onboarding confidence.",
        "Authentication friction is concentrated in high-repeat sub-journeys.",
      ],
      action:
        "Prioritize OTP fallback hardening and first-use card readiness checks before next billing cycle.",
      rootCause:
        "Authentication pathways fail under retry scenarios and first-use decline rules are not consistently contextualized for cardholders.",
      affectedAreas: ["Auth Platform", "Card Controls", "Fraud Rules", "Mobile App", "Onboarding"],
      recommendedActions: [
        "Deploy resilient OTP retry with trusted-device fallback",
        "Add first-use readiness checklist before card activation",
        "Tune fraud thresholds for first 7-day card usage window",
        "Surface unblock guidance directly in app journey",
      ],
      timeline: "2-3 weeks for auth hardening, 4-5 weeks for first-use decline reduction",
      owner: "Authentication & Risk Journey Lead",
      priorityLabel: "High",
    },
    {
      id: "info-improvement-focus",
      level: "INFO",
      levelColor: "#22c55e",
      tag: "Execution Focus",
      title: "Highest payoff levers are visible and actionable",
      body: "Automating dispute status, fixing cashback visibility, and tightening OTP fallback can reduce repeat load quickly without major channel redesign.",
      metric: "Top 3 fixes identified",
      delta: "Potential repeat rate <20%",
      icon: Info,
      tagIcon: BookOpen,
      details: [
        "Top levers are operational, not structural platform rebuilds.",
        "Current data supports phased execution by issue cluster.",
        "Impact is measurable via repeat-rate and NPS recovery deltas.",
      ],
      action:
        "Track weekly execution scorecard across dispute, cashback, and authentication to sustain repeat-rate reduction.",
      rootCause:
        "Improvement opportunities exist, but execution depends on cross-team governance and consistent scorecard ownership.",
      affectedAreas: ["Journey Analytics", "CX Operations", "Product", "Service Design", "Leadership Review"],
      recommendedActions: [
        "Run weekly issue-level execution review for top intents",
        "Assign metric owners per action with due dates",
        "Link action closure to repeat-rate and NPS movement",
        "Publish monthly recovery dashboard to leadership",
      ],
      timeline: "1 week to start governance, 4 weeks to establish stable improvement cadence",
      owner: "Journey Excellence PMO",
      priorityLabel: "Medium",
    },
  ];
  const [selectedSignalId, setSelectedSignalId] = useState<string>(rows[0].id);
  const [selectedSignal, setSelectedSignal] = useState<SummaryWallRow | null>(null);
  const [detailTop, setDetailTop] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const handleSignalClick = (row: SummaryWallRow, event: MouseEvent<HTMLDivElement>) => {
    const scrollEl = scrollAreaRef.current;
    if (scrollEl) {
      const rowRect = event.currentTarget.getBoundingClientRect();
      const scrollRect = scrollEl.getBoundingClientRect();
      const relativeTop = rowRect.top - scrollRect.top + scrollEl.scrollTop;
      setDetailTop(relativeTop);
    } else {
      setDetailTop(0);
    }
    setSelectedSignalId(row.id);
    setSelectedSignal(row);
  };

  const closeDetail = () => {
    setSelectedSignal(null);
    setDetailTop(null);
  };

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 24,
        background: "#0d0d0d",
        border: "1px solid #2a2a2a",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        height: 780,
        maxHeight: 840,
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexShrink: 0, padding: "8px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>✨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>AI Summary Wall</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#939394" }}>Real-time FCI intelligence</p>
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: "#1a1a1a", color: "#939394" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#22c55e" }} />
          Live
        </div>
      </div>

      <div ref={scrollAreaRef} style={{ flex: 1, overflowY: "auto", padding: "8px 8px 8px 0", minHeight: 0, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((row) => {
            const Icon = row.icon;
            const TagIcon = row.tagIcon;
            return (
              <div
                key={row.id}
                onClick={(event) => handleSignalClick(row, event)}
                style={{
                  position: "relative",
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer",
                  background: `linear-gradient(135deg, ${row.levelColor}26 0%, ${row.levelColor}0d 100%)`,
                  border: `1px solid ${row.levelColor}50`,
                  boxShadow: selectedSignalId === row.id ? `0 0 0 1px ${row.levelColor}80 inset` : "none",
                }}
              >
                {row.pulse ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      background: `radial-gradient(circle, ${row.levelColor}10 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />
                ) : null}
                <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, background: `${row.levelColor}20`, flexShrink: 0 }}>
                    <Icon size={16} color={row.levelColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: `${row.levelColor}25`, color: row.levelColor }}>
                        {row.level}
                      </span>
                      <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4, background: "#2a2a2a", color: "#939394" }}>
                        <TagIcon size={12} />
                        {row.tag}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#fff" }}>{row.title}</p>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "#d6d9d8" }}>{row.body}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: row.levelColor }}>{row.metric}</span>
                      {row.extra ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#939394" }}>
                          <Timer size={12} />
                          {row.extra}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "#ef4444" }}>
                      <TrendingUp size={14} />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{row.delta}</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 10, color: row.levelColor, opacity: selectedSignalId === row.id ? 1 : 0.7 }}>
                      <span>Click for details</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                  <ChevronRight size={16} color={row.levelColor} style={{ flexShrink: 0, opacity: selectedSignalId === row.id ? 1 : 0.4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {selectedSignal && detailTop !== null ? (
          <>
            <div
              onClick={closeDetail}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                zIndex: 20,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 8,
                right: 8,
                top: detailTop,
                zIndex: 30,
                background: "#1a1a1a",
                border: `2px solid ${selectedSignal.levelColor}`,
                borderRadius: 12,
                padding: 12,
                boxShadow: `0 8px 32px ${selectedSignal.levelColor}40, 0 4px 16px rgba(0,0,0,0.3)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <div style={{ padding: 6, borderRadius: 8, background: `${selectedSignal.levelColor}20` }}>
                    <TriangleAlert size={14} color={selectedSignal.levelColor} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{selectedSignal.title}</div>
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  style={{ border: "none", background: "transparent", color: "#939394", fontSize: 16, cursor: "pointer" }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${selectedSignal.levelColor}20`, color: selectedSignal.levelColor }}>
                  {selectedSignal.priorityLabel} Priority
                </span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#2a2a2a", color: "#939394" }}>
                  {selectedSignal.tag}
                </span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <CreditCard size={13} color={selectedSignal.levelColor} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#939394", textTransform: "uppercase" }}>Root Cause</span>
                </div>
                <div style={{ fontSize: 12, color: "#e0e0e0", lineHeight: 1.5 }}>{selectedSignal.rootCause}</div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Target size={13} color={selectedSignal.levelColor} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#939394", textTransform: "uppercase" }}>Affected Areas</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedSignal.affectedAreas.map((a) => (
                    <span key={a} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "#2a2a2a", color: "#d6d9d8" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <ArrowRight size={13} color={selectedSignal.levelColor} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#939394", textTransform: "uppercase" }}>Recommended Actions</span>
                </div>
                {selectedSignal.recommendedActions.map((a, idx) => (
                  <div key={a} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: `${selectedSignal.levelColor}20`, color: selectedSignal.levelColor, flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: 11, color: "#d6d9d8", lineHeight: 1.45 }}>{a}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, borderTop: "1px solid #2a2a2a", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "#939394" }}>
                    <Timer size={11} />
                    {selectedSignal.timeline}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "#939394" }}>
                    <Users size={11} />
                    {selectedSignal.owner}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: selectedSignal.levelColor }}>
                  {selectedSignal.priorityLabel}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #2a2a2a", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#ef4444" }}>1</p>
          <p style={{ margin: 0, fontSize: 12, color: "#939394" }}>Critical</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#f97316" }}>2</p>
          <p style={{ margin: 0, fontSize: 12, color: "#939394" }}>Warnings</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#22c55e" }}>1</p>
          <p style={{ margin: 0, fontSize: 12, color: "#939394" }}>Improving</p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DRILL 1 — Cardholder journey (Are cardholders satisfied with their journey?)
// ═════════════════════════════════════════════════════════════════════
export function CustomerCardJourneyV3Drill({ onBack }: DrillProps) {
  const [stageTab, setStageTab] = useState<string>("disp");
  const sel =
    JH_STAGES.find((s) => s.id === stageTab) ??
    JH_STAGES.find((x) => x.id === "disp");

  const negTone = (n: number): string =>
    n >= 55 ? JH.red : n >= 45 ? JH.amber : n >= 38 ? JH.watchYellow : JH.green;
  const repeatTone = (r: number): string =>
    r >= 40 ? JH.red : r >= 28 ? JH.amber : JH.watchYellow;

  const stageHcSel = sel ? jhHealthColor(sel.health) : JH.amber;

  const jhRadarCrit = JH_ALERTS.filter((a) => a.sev === "CRITICAL").length;
  const jhRadarAlert = JH_ALERTS.filter((a) => a.sev === "ALERT").length;
  const jhRadarWarn = JH_ALERTS.filter((a) => a.sev === "WARNING").length;

  return (
    <RoleBasedUnifiedReadingShell>
      <>
      <div style={{ marginBottom: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Are cardholders satisfied with their journey?"
          sub="Conversation-derived view of cardholder happiness across the full journey."
          comfortable
      />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)",
          gap: 12,
          marginBottom: 12,
          alignItems: "start",
        }}
      >
        <JourneyTopCommandCenter />
        <JourneyTopAISummaryWall />
      </div>
      <JourneyWhatsFailingPanel />

      <JhCard
        accent={JH.red}
        s={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          marginBottom: 10,
        }}
      >
          <JhSLbl>
            Where is the struggle? — pain concentration by journey stage
          </JhSLbl>
          <p style={{ fontSize: 12, color: JH.dim, margin: "0 0 9px" }}>
            Stage-level concentration of dissatisfaction across the journey.
          </p>
          <div style={{ border: `1px solid ${JH.borderInner}`, borderRadius: 8, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
                gap: 8,
                padding: "9px 10px",
                background: JH.surfaceRow,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, letterSpacing: "0.05em" }}>Journey</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, letterSpacing: "0.05em" }}>Total Conversations</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, letterSpacing: "0.05em" }}>Negative Sentiment</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, letterSpacing: "0.05em" }}>Repeat Contact</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, letterSpacing: "0.05em" }}>Churn Signal</span>
            </div>
            {JH_STAGES.map((st) => (
              <div
                key={st.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 8,
                  padding: "9px 10px",
                  borderTop: `1px solid ${JH.borderInner}`,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: JH.text, fontWeight: 700 }}>{st.label}</span>
                <span style={{ fontSize: 12, color: JH.sub, fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700 }}>{st.convos}</span>
                <span style={{ fontSize: 12, color: negTone(st.neg), fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700 }}>{st.neg}%</span>
                <span style={{ fontSize: 12, color: repeatTone(st.repeat), fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700 }}>{st.repeat}%</span>
                <span style={{ fontSize: 12, color: jhChurnBlockColor(st.churn), fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700 }}>{st.churn}%</span>
              </div>
            ))}
          </div>
      </JhCard>
    </>
    </RoleBasedUnifiedReadingShell>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DRILL 2 — MARKET REPUTATION (V2 flow: external → echo → brand → evidence)
// ═════════════════════════════════════════════════════════════════════

const MR = {
  card: "#0d0d0d",
  border: "#1f1f1f",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#939394",
  red: "#ef4444",
  orange: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#38bdf8",
  purple: "#8b5cf6",
  gold: "#f59e0b",
} as const;

function MrMono({
  children,
  color,
  size = 15,
  weight = 700,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  weight?: number;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--mono), ui-monospace, monospace",
        fontWeight: weight,
        color: color || MR.text,
        fontSize: size,
      }}
    >
      {children}
    </span>
  );
}

function MrBadge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        background: `${color}18`,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </span>
  );
}

function MrTag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 3,
        background: `${color}25`,
        color,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

function MrCard({
  children,
  accent,
  style: s = {},
}: {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: MR.card,
        border: `1px solid ${accent ? `${accent}30` : MR.border}`,
        borderRadius: 12,
        padding: "20px",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function MrHead({
  children,
  sub,
  badge,
  icon,
}: {
  children: ReactNode;
  sub?: string;
  badge?: string;
  icon?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon ? <span style={{ fontSize: 18 }}>{icon}</span> : null}
        <h3
          style={{ fontSize: 17, fontWeight: 700, margin: 0, color: MR.text }}
        >
          {children}
        </h3>
        {badge ? <MrBadge color={MR.purple}>{badge}</MrBadge> : null}
      </div>
      {sub ? (
        <p style={{ fontSize: 13, color: MR.muted, margin: "3px 0 0" }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function MrDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        margin: "28px 0 18px",
      }}
    >
      <div style={{ height: 1, flex: 1, background: MR.border }} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: MR.sub,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
      <div style={{ height: 1, flex: 1, background: MR.border }} />
    </div>
  );
}

function rankingPortfolioLensLabel(lens: RankingReviewRow["lens"]): string {
  if (lens === "standalone") return "Standalone";
  if (lens === "cobrand") return "Co-branded";
  return "Business";
}

function rankingPortfolioBadgeStyle(lens: RankingReviewRow["lens"]): { border: string; background: string; color: string } {
  if (lens === "standalone") {
    return { border: `${MR.gold}90`, background: `${MR.gold}14`, color: MR.gold };
  }
  if (lens === "cobrand") {
    return { border: `${MR.purple}90`, background: `${MR.purple}12`, color: MR.purple };
  }
  return { border: `${MR.cyan}90`, background: `${MR.cyan}12`, color: MR.cyan };
}

function rankingImpactBadgeColor(impact: RankingImpact): string {
  switch (impact) {
    case "Critical":
      return MR.red;
    case "High":
      return MR.orange;
    case "Medium":
      return MR.yellow;
    case "Positive":
      return MR.green;
    default: {
      const _e: never = impact;
      return _e;
    }
  }
}

function rankingRankMoveParts(row: RankingReviewRow): { line: string; sub: string; color: string } {
  const { previousRank: prev, currentRank: cur, direction } = row;
  const line = `#${prev} → #${cur}`;
  if (direction === "flat") return { line, sub: "held", color: MR.yellow };
  if (direction === "up") {
    const n = prev - cur;
    return { line, sub: `up ${n}`, color: MR.green };
  }
  const n = cur - prev;
  return { line, sub: `down ${n}`, color: MR.red };
}

function RankingLensFilterBar({
  lens,
  onChange,
  counts,
}: {
  lens: RankingLens;
  onChange: (next: RankingLens) => void;
  counts: Record<RankingLens, number>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
      }}
    >
      {RANKING_LENS_ORDER.map((key) => {
        const active = lens === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 8,
              border: `1px solid ${active ? MR.orange : MR.border}`,
              background: active ? `${MR.orange}14` : "rgba(255,255,255,0.03)",
              color: active ? MR.text : MR.sub,
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span>{RANKING_LENS_LABEL[key]}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                fontFamily: "var(--mono), ui-monospace, monospace",
                color: active ? "rgba(255,255,255,0.85)" : MR.muted,
                background: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.05)",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function diagnosisLabelColor(
  tone: "red" | "orange" | "yellow" | "green",
): string {
  const m: Record<"red" | "orange" | "yellow" | "green", string> = {
    red: MR.red,
    orange: MR.orange,
    yellow: MR.yellow,
    green: MR.green,
  };
  return m[tone];
}

function mrMomentumStanceStyles(stance: (typeof V3_MOMENTUM_HASHTAGS)[number]["stance"]) {
  if (stance === "negative") return { label: "negative", color: MR.red };
  if (stance === "positive") return { label: "positive", color: MR.green };
  return { label: "neutral", color: "#9ca3af" };
}

function engagementImpactColor(impact: EngagementImpact): string {
  switch (impact) {
    case "Severe":
      return MR.red;
    case "High":
      return MR.orange;
    case "Medium":
      return MR.yellow;
    case "Low":
      return MR.green;
    default: {
      const _e: never = impact;
      return _e;
    }
  }
}

function engagementSentimentColor(sentiment: EngagementSentiment): string {
  switch (sentiment) {
    case "Negative":
      return MR.red;
    case "Mixed":
      return MR.yellow;
    case "Positive":
      return MR.green;
    default: {
      const _e: never = sentiment;
      return _e;
    }
  }
}

function engagementAffectedCardPillStyle(kind: EngagementCardKind): { border: string; background: string } {
  if (kind === "cobrand") return { border: `${MR.purple}90`, background: `${MR.purple}12` };
  if (kind === "business") return { border: `${MR.cyan}90`, background: `${MR.cyan}12` };
  return { border: `${MR.gold}90`, background: `${MR.gold}10` };
}

function MarketReputationMomentumWatchRow() {
  const [engagementChannel, setEngagementChannel] = useState<EngagementChannel>("all");
  const engagementChannelCounts = useMemo(() => {
    const counts: Record<EngagementChannel, number> = {
      all: INFLUENTIAL_ENGAGEMENT_ITEMS.length,
      app_store: 0,
      play_store: 0,
      reddit: 0,
      trustpilot: 0,
      x: 0,
    };
    for (const row of INFLUENTIAL_ENGAGEMENT_ITEMS) {
      counts[row.channel]++;
    }
    return counts;
  }, []);
  const engagementRows = useMemo(
    () => getInfluentialEngagementItems(engagementChannel),
    [engagementChannel],
  );

  const cardChrome = {
    borderRadius: 16,
    border: "1px solid #2b2b2b",
    background: MR.card,
    boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
    height: "100%" as const,
    display: "flex" as const,
    flexDirection: "column" as const,
    minHeight: 0,
    overflow: "hidden" as const,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.22fr)",
        gridAutoRows: "minmax(400px, 1fr)",
        gap: 16,
        alignItems: "stretch",
        marginBottom: 16,
      }}
    >
      <div style={cardChrome}>
        <div style={{ flexShrink: 0, padding: "24px 24px 12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18,
              fontWeight: 600,
              color: MR.text,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            <Hash size={20} strokeWidth={2} color={MR.purple} aria-hidden />
            Momentum Hashtags
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 6 }}>
            Fastest growing conversation entry points
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "0 24px 16px",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
            alignContent: "start",
          }}
        >
          {V3_MOMENTUM_HASHTAGS.map((h) => {
            const st = mrMomentumStanceStyles(h.stance);
            return (
              <div
                key={h.tag}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: MR.text, wordBreak: "break-word" }}>
                    {h.tag}
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: st.color,
                      flexShrink: 0,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 40, fontWeight: 600, color: MR.text, lineHeight: 1 }}>{h.growth}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af", paddingBottom: 2 }}>
                    Growth · <span style={{ fontWeight: 600, color: MR.sub }}>{h.volume.toLocaleString()}</span> posts
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", lineHeight: 1.45, wordBreak: "break-word" }}>
                  {h.context}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={cardChrome}>
        <div style={{ flexShrink: 0, padding: "20px 20px 10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <Users size={20} strokeWidth={2} color={MR.purple} aria-hidden />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: MR.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Influential Engagement
              </span>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 9,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 6,
                border: `1px solid ${MR.purple}55`,
                background: `${MR.purple}18`,
                color: MR.text,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}
            >
              <Sparkles size={11} aria-hidden />
              AI
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8, lineHeight: 1.45 }}>
            Cross-channel posts, reviews, and communities shaping external card sentiment
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {ENGAGEMENT_CHANNEL_ORDER.map((key) => {
              const active = key === engagementChannel;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEngagementChannel(key)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: `1px solid ${active ? MR.purple : MR.border}`,
                    background: active ? `${MR.purple}22` : "rgba(255,255,255,0.03)",
                    color: active ? MR.text : MR.sub,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <span>{ENGAGEMENT_CHANNEL_LABEL[key]}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      fontFamily: "var(--mono), ui-monospace, monospace",
                      color: active ? "rgba(255,255,255,0.9)" : MR.muted,
                    }}
                  >
                    {engagementChannelCounts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            maxHeight: 400,
            overflowY: "auto",
            padding: "0 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {engagementRows.map((row) => (
            <div
              key={`${row.channel}-${row.source}-${row.topic}`}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr) minmax(160px, 0.85fr)",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: MR.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {ENGAGEMENT_CHANNEL_LABEL[row.channel]}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: MR.text, marginTop: 4, wordBreak: "break-word" }}>
                    {row.source}
                  </div>
                  <div style={{ fontSize: 10, color: MR.muted, marginTop: 2 }}>{row.sourceType}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: MR.sub, marginTop: 8 }}>{row.topic}</div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af", lineHeight: 1.45, wordBreak: "break-word" }}>
                    {row.narrative}
                  </p>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: MR.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Channel metrics
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: MR.text, marginTop: 6 }}>{row.metrics.primary}</div>
                  <div style={{ fontSize: 11, color: MR.sub, marginTop: 4, lineHeight: 1.4 }}>{row.metrics.secondary}</div>
                  {row.metrics.tertiary ? (
                    <div style={{ fontSize: 10, color: MR.muted, marginTop: 4, lineHeight: 1.4 }}>{row.metrics.tertiary}</div>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 6,
                      border: `1px solid ${engagementSentimentColor(row.sentiment)}55`,
                      color: engagementSentimentColor(row.sentiment),
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {row.sentiment}
                  </span>
                  <MrBadge color={engagementImpactColor(row.impact)}>{row.impact}</MrBadge>
                  <div style={{ fontSize: 10, color: MR.muted, textAlign: "right", lineHeight: 1.35 }}>
                    {row.engagementLabel}
                    {row.engagementRate ? (
                      <>
                        <br />
                        <span style={{ fontWeight: 700, color: MR.sub }}>{row.engagementRate}</span>
                      </>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: MR.orange,
                      textAlign: "right",
                      lineHeight: 1.35,
                    }}
                  >
                    {row.action}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center", paddingTop: 2, borderTop: `1px solid ${MR.border}` }}>
                {row.affectedCards.map((c) => {
                  const pill = engagementAffectedCardPillStyle(c.kind);
                  return (
                    <span
                      key={`${row.source}-${c.name}`}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 6,
                        border: `1px solid ${pill.border}`,
                        background: pill.background,
                        color: MR.sub,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function brandPromiseImportanceColor(importance: BrandPromiseGapRow["importance"]): string {
  if (importance === "Critical") return MR.red;
  if (importance === "High") return MR.orange;
  if (importance === "Moderate") return MR.yellow;
  return MR.green;
}

function brandPromiseCardPillStyle(lens: BrandPromiseCard["lens"]): { border: string; background: string } {
  if (lens === "cobrand") return { border: `${MR.purple}90`, background: `${MR.purple}12` };
  if (lens === "business") return { border: `${MR.cyan}90`, background: `${MR.cyan}12` };
  return { border: `${MR.gold}90`, background: `${MR.gold}10` };
}

function BrandPromiseLensFilterBar({
  lens,
  onChange,
  counts,
}: {
  lens: BrandPromiseLens;
  onChange: (l: BrandPromiseLens) => void;
  counts: Record<BrandPromiseLens, number>;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
      {BRAND_PROMISE_LENS_ORDER.map((key) => {
        const active = key === lens;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 11px",
              borderRadius: 8,
              border: `1px solid ${active ? MR.orange : MR.border}`,
              background: active ? `${MR.orange}22` : "rgba(255,255,255,0.025)",
              color: active ? MR.text : MR.sub,
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span>{BRAND_PROMISE_LENS_LABEL[key]}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                fontFamily: "var(--mono), ui-monospace, monospace",
                color: active ? "rgba(255,255,255,0.85)" : MR.muted,
                background: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.05)",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function brandPromiseChannelsLine(ch: BrandPromiseGapRow["channelsPct"]): string {
  return `Voice ${ch.voice}% · Chat ${ch.chat}% · Social ${ch.social}% · Email ${ch.email}% · Ticket ${ch.ticket}%`;
}

function BrandPromiseAffectedCardPills({ cards }: { cards: readonly BrandPromiseCard[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center", minWidth: 0 }}>
      {cards.map((c) => {
        const pill = brandPromiseCardPillStyle(c.lens);
        return (
          <span
            key={`${c.shortName}-${c.fullName}`}
            title={c.partner ? `Partner: ${c.partner}` : c.fullName}
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: `1px solid ${pill.border}`,
              background: pill.background,
              color: MR.sub,
              whiteSpace: "nowrap",
            }}
          >
            {c.shortName}
          </span>
        );
      })}
    </div>
  );
}

export function MarketReputationV3Drill({ onBack }: DrillProps) {
  const [brandPromiseLens, setBrandPromiseLens] = useState<BrandPromiseLens>("all");
  const brandGapTableRows = useMemo(
    () => getBrandPromiseGapRows(brandPromiseLens),
    [brandPromiseLens],
  );
  const brandPromiseLensCounts = V3_BRAND_PROMISE_LENS_ROW_COUNTS;

  const [rankingLens, setRankingLens] = useState<RankingLens>("all");
  const rankingReviewRows = useMemo(() => getSortedRankingReviewRows(rankingLens), [rankingLens]);
  const rankingLensCounts = RANKING_LENS_ROW_COUNTS;

  return (
    <V3DrillShell>
      <DrillPageHeader
        onBack={onBack}
        title="What is the market saying about us?"
        sub="Reviews, social, and ranking sites. External narrative and internal conversation mentions."
        comfortable
      />

      <MrCard accent={MR.orange}>
        <MrHead
          icon="⚖"
          sub="Promise made vs. where customers say it breaks — by portfolio type and affected card brands."
          badge="AI"
        >
          Brand Promise Gap
        </MrHead>

        <BrandPromiseLensFilterBar
          lens={brandPromiseLens}
          onChange={setBrandPromiseLens}
          counts={brandPromiseLensCounts}
        />

        <div
          style={{
            marginTop: 4,
            maxHeight: 540,
            overflowY: "auto",
            overflowX: "auto",
            paddingRight: 4,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
              tableLayout: "fixed",
              minWidth: 920,
            }}
          >
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: MR.card,
                boxShadow: `0 1px 0 ${MR.border}`,
              }}
            >
              <tr style={{ borderBottom: `1px solid ${MR.border}` }}>
                {[
                  ["We promise", "left"],
                  ["Where it breaks", "left"],
                  ["Affected card brands", "left"],
                  ["Volume + channels", "left"],
                  ["Sentiment impact", "right"],
                  ["Importance", "left"],
                ].map(([h, align]) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 8px",
                      textAlign: align as "left" | "right",
                      color: MR.dim,
                      fontWeight: 700,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: MR.card,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brandGapTableRows.map((r) => {
                const sentColor =
                  r.negativeSentiment <= -0.45
                    ? MR.red
                    : r.negativeSentiment <= -0.35
                      ? MR.orange
                      : MR.green;
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${MR.border}` }}>
                    <td style={{ padding: "10px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontWeight: 700, color: MR.text, fontSize: 12, lineHeight: 1.35 }}>
                        {r.promise}
                      </div>
                      <div style={{ fontSize: 10, color: MR.muted, marginTop: 4, lineHeight: 1.35 }}>
                        {r.promiseCategory}
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontSize: 11, color: MR.text, lineHeight: 1.45 }}>{r.whereItBreaks}</div>
                      <div
                        style={{
                          fontSize: 9,
                          color: MR.muted,
                          marginTop: 6,
                          lineHeight: 1.4,
                          fontStyle: "italic",
                        }}
                      >
                        {r.evidenceNote}
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                      <BrandPromiseAffectedCardPills cards={r.cards} />
                    </td>
                    <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                      <MrMono size={18} color={MR.text}>
                        {r.volume.toLocaleString()}
                      </MrMono>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 9,
                          color: MR.muted,
                          lineHeight: 1.35,
                          fontFamily: "var(--mono), ui-monospace, monospace",
                        }}
                      >
                        {brandPromiseChannelsLine(r.channelsPct)}
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", verticalAlign: "top", textAlign: "right", whiteSpace: "nowrap" }}>
                      <MrMono size={11} color={sentColor}>
                        {r.negativeSentiment.toFixed(2)}
                      </MrMono>
                    </td>
                    <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                      <MrBadge color={brandPromiseImportanceColor(r.importance)}>{r.importance}</MrBadge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {brandGapTableRows.length === 0 ? (
          <div style={{ fontSize: 11, color: MR.muted, marginTop: 10 }}>
            No promise gaps for this portfolio slice.
          </div>
        ) : null}
      </MrCard>

      <MarketReputationMomentumWatchRow />

      <MrCard>
        <MrHead
          icon="⭐"
          badge="AI"
          sub="Track card-category rank movement across review sites and comparison sites"
        >
          Rankings &amp; Reviews
        </MrHead>

        <RankingLensFilterBar lens={rankingLens} onChange={setRankingLens} counts={rankingLensCounts} />

        <div
          style={{
            marginTop: 4,
            maxHeight: 420,
            overflowY: "auto",
            overflowX: "auto",
            paddingRight: 4,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
              tableLayout: "fixed",
              minWidth: 1040,
            }}
          >
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: MR.card,
                boxShadow: `0 1px 0 ${MR.border}`,
              }}
            >
              <tr style={{ borderBottom: `1px solid ${MR.border}` }}>
                {[
                  "Site",
                  "Category",
                  "Portfolio",
                  "Our card",
                  "Rank move",
                  "#1 competitor",
                  "Why it moved",
                  "Internal echo",
                  "Impact",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 8px",
                      textAlign: "left",
                      color: MR.dim,
                      fontWeight: 700,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: MR.card,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankingReviewRows.map((r) => {
                const pf = rankingPortfolioBadgeStyle(r.lens);
                const rm = rankingRankMoveParts(r);
                return (
                  <tr key={`${r.site}-${r.ourCard}-${r.category}`} style={{ borderBottom: `1px solid ${MR.border}` }}>
                    <td style={{ padding: "8px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontWeight: 700, color: MR.text, fontSize: 12, lineHeight: 1.3 }}>{r.site}</div>
                      <div style={{ fontSize: 9, color: MR.muted, marginTop: 3 }}>{r.siteSource}</div>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: `1px solid ${V3D.borderBtn}`,
                          background: "rgba(255,255,255,0.04)",
                          color: MR.sub,
                          lineHeight: 1.25,
                        }}
                      >
                        {r.category}
                      </span>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: `1px solid ${pf.border}`,
                          background: pf.background,
                          color: pf.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {rankingPortfolioLensLabel(r.lens)}
                      </span>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: `1px solid ${V3D.borderBtn}`,
                          background: "rgba(255,255,255,0.06)",
                          color: MR.text,
                          lineHeight: 1.25,
                        }}
                      >
                        {r.ourCard}
                      </span>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <MrMono size={12} color={rm.color}>
                        {rm.line}
                      </MrMono>
                      <div style={{ fontSize: 9, fontWeight: 700, color: rm.color, marginTop: 3 }}>{rm.sub}</div>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: MR.text, lineHeight: 1.35 }}>
                        {r.competitorRankOne}
                      </div>
                      {r.competitorScore ? (
                        <div style={{ fontSize: 10, color: MR.muted, marginTop: 3 }}>{r.competitorScore}</div>
                      ) : null}
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontSize: 11, color: MR.sub, lineHeight: 1.45 }}>{r.reason}</div>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                      <div style={{ fontSize: 11, color: MR.text, lineHeight: 1.35 }}>
                        <MrMono size={12} color={MR.text}>
                          {r.internalEcho.toLocaleString()}
                        </MrMono>
                        <span style={{ fontSize: 10, color: MR.muted }}> conversations</span>
                      </div>
                      <div style={{ fontSize: 9, color: MR.muted, marginTop: 5, lineHeight: 1.35, fontStyle: "italic" }}>
                        “{r.echoLabel}”
                      </div>
                    </td>
                    <td style={{ padding: "8px 8px", verticalAlign: "top" }}>
                      <MrBadge color={rankingImpactBadgeColor(r.impact)}>{r.impact}</MrBadge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rankingReviewRows.length === 0 ? (
          <div style={{ fontSize: 11, color: MR.muted, marginTop: 10 }}>No ranking movements for this portfolio slice.</div>
        ) : null}

        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: `${MR.purple}0d`,
            borderRadius: 8,
            borderLeft: `3px solid ${MR.purple}`,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, color: MR.purple, letterSpacing: "0.06em", marginBottom: 4 }}>
            AI note
          </div>
          <div style={{ fontSize: 11, color: MR.sub, lineHeight: 1.5 }}>{RANKING_AI_SUMMARY_BY_LENS[rankingLens]}</div>
        </div>
      </MrCard>

      <MrDivider label="Executive diagnosis" />

      <MrCard accent={MR.purple}>
        <MrHead icon="✦">AI Executive Diagnosis</MrHead>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {V3_EXECUTIVE_DIAGNOSIS_MARKET.map((r) => (
              <tr key={r.label} style={{ borderBottom: `1px solid ${MR.border}` }}>
                <td
                  style={{
                    padding: "10px 8px 10px 0",
                    verticalAlign: "top",
                    width: 130,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: diagnosisLabelColor(r.tone),
                    }}
                  >
                    {r.label}
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px 0",
                    fontSize: 12,
                    color: MR.text,
                    lineHeight: 1.55,
                  }}
                >
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MrCard>
    </V3DrillShell>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DRILL 3 — SERVICE PROMISE (India: service + disputes lens)
// ═════════════════════════════════════════════════════════════════════
export function FraudAndFulfillmentV3Drill({ onBack }: DrillProps) {
            return (
    <V3DrillShell bodyFontSize={16}>
      <DrillPageHeader
        onBack={onBack}
        title="Are we keeping our service promise?"
        sub="Where service promises break, repeat contacts rise, and recovery is needed"
        comfortable
      />
      <ServicePromiseIndiaDrillBody />
    </V3DrillShell>
  );
}

