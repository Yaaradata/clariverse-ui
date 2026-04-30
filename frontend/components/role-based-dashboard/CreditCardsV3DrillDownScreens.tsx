"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import {
  V3_BRAND_PROMISE_GAP,
  V3_COMPARISON_RANKS,
  V3_COMPETITORS,
  V3_CONVERSATION_EVIDENCE_MARKET,
  V3_ECHO_SUMMARY,
  V3_ECHO_TRACKER,
  V3_EXECUTIVE_DIAGNOSIS_MARKET,
  V3_HASHTAGS,
  V3_MARKET_RANKS_INSIGHT,
  V3_MARKET_REPUTATION_ACTIONS,
  V3_MARKET_REPUTATION_COMMAND,
  V3_MEDIA,
  V3_SOCIAL_AI,
  V3_SOCIAL_SENTIMENT,
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

      {/* Two-column row: left stack + right radar */}
      <div
        style={{
          width: "100%",
          marginBottom: 8,
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        >
          <div
            style={{
              display: "grid",
            width: "max(100%, 700px)",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 0.8fr)",
            gap: 12,
            alignItems: "start",
          }}
        >
        <div
                  style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
            gap: 12,
                    minWidth: 0,
          }}
        >
        <JhCard
          accent={JH.amber}
          s={{
                    display: "flex",
                    flexDirection: "column",
            minHeight: 0,
                  }}
                >
          <JhSLbl>How happy are cardholders?</JhSLbl>
                  <div
                    style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 22,
            }}
          >
            <JhN v="62" s={44} c={JH.amber} />
            <span style={{ fontSize: 16, color: JH.muted }}>/100</span>
            <JhStatus h="At Risk" />
                  </div>

          {JH_SEG_ROWS.map((s) => {
            const churnN = Number.parseFloat(s.churn);
            return (
              <div key={s.k} style={{ marginBottom: 7 }}>
                  <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <JhSeg k={s.k} />
                    <span style={{ fontSize: 11, color: JH.dim }}>{s.desc}</span>
                  </div>
                  <span style={{ fontSize: 11, color: JH.muted }}>
                    churn{" "}
                    <JhN
                      v={s.churn}
                      s={11}
                      c={churnN >= 6 ? JH.red : JH.amber}
                    />
                  </span>
          </div>
        <div
          style={{
                    height: 5,
                    display: "flex",
                    borderRadius: 2,
                    overflow: "hidden",
                    gap: 1,
                  }}
                >
                  <div
            style={{
                      flex: s.happy,
                      background: JH.green,
                      opacity: 0.7,
                    }}
                  />
                  <div style={{ flex: s.neu, background: JH.neutralStack }} />
                <div
                  style={{
                      flex: s.unhappy,
                      background: JH.red,
                      opacity: 0.7,
                    }}
                  />
              </div>
              <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <span style={{ fontSize: 10, color: JH.green }}>
                    {s.happy}% happy
                  </span>
                  <span style={{ fontSize: 10, color: JH.red }}>
                    {s.unhappy}% unhappy 
                  </span>
              </div>
            </div>
            );
          })}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {(
              [
                ["Happy", JH.green],
                ["Neutral", JH.neutralStack],
                ["Unhappy", JH.red],
              ] as const
            ).map(([l, c]) => (
              <div
                key={l}
                style={{ display: "flex", alignItems: "center", gap: 3 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 3,
                    borderRadius: 1,
                    background: c,
                  }}
                />
                <span style={{ fontSize: 10, color: JH.dim }}>{l}</span>
                </div>
              ))}
            </div>
          <JhHR />
          <JhInsight color={JH.amber}>
            LSLF and HSHF are the unhappiest segments. LSLF at 44% unhappy
            driven by statement confusion and cashback delays. HSHF at 41%
            unhappy with fee value — highest churn risk.
          </JhInsight>
          <JhActionBar>
            Prioritise HSHF retention outreach. Fix cashback posting visibility
            for LSLF.
          </JhActionBar>
        </JhCard>

        <JhCard
          accent={JH.red}
          s={{
              display: "flex",
              flexDirection: "column",
            minHeight: 0,
          }}
        >
          <JhSLbl>
            Where are they struggling? — pain concentration by journey stage
          </JhSLbl>
          <p style={{ fontSize: 12, color: JH.dim, margin: "0 0 9px" }}>
            Block width = conversation volume · Color = churn signal intensity
          </p>

          <div
                style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarGutter: "stable",
              paddingBottom: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                  gap: 10,
                /* Wide enough so pain rows don’t clip before horizontal scroll activates */
                minWidth: "max(100%, 1100px)",
              }}
            >
          {JH_STAGES.map((st) => {
            const stageHc = jhHealthColor(st.health);
            return (
              <div key={st.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 3,
                        height: 12,
                        borderRadius: 1,
                        background: stageHc,
                      }}
                    />
                    <span
                      style={{ fontSize: 12, fontWeight: 600, color: JH.text }}
                    >
                      {st.label}
                    </span>
                    <JhStatus h={st.health} />
              </div>
        </div>
        <div
          style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
            alignItems: "stretch",
                    gap: 8,
                  }}
                >
                  {st.pains.map((p) => {
                    const pc = jhChurnBlockColor(p.churn);
                    /** Landscape pills: wider than tall — scale × floor so small shares still feel horizontal */
                    const px = Math.max(
                      Math.round((p.pct / 100) * 760),
                      188,
                    );
                    return (
                      <div
                        key={p.label}
                        title={`${p.label}: ${p.churn}% churn signal`}
                        style={{
                          flex: "none",
                          width: px,
                          minWidth: px,
                          minHeight: 56,
                          maxHeight: 74,
                          background: `${pc}18`,
                          border: `1px solid ${pc}30`,
                          borderRadius: 6,
                          padding: "6px 12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "center",
                          gap: 4,
                          boxSizing: "border-box",
                        }}
                      >
                        <span
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            fontSize: 12,
                            lineHeight: 1.3,
                            fontWeight: 600,
                            color: JH.text,
                            wordBreak: "break-word",
                          }}
                        >
                          {p.label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: pc,
                            fontFamily: "var(--mono), ui-monospace, monospace",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {p.pct}% conv · {p.churn}% churn
                        </span>
                  </div>
                    );
                  })}
              </div>
            </div>
            );
          })}
            </div>
          </div>
        </JhCard>
        </div>

        <div
          style={{
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <JhCard
            accent={JH.red}
            s={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              minHeight: 420,
              maxHeight: 580,
              overflow: "hidden",
            }}
          >
            <JhSLbl>✨What should you worry about? </JhSLbl>
            <div style={{ flexShrink: 0, marginBottom: 10 }}>
              <JhN v={String(jhRadarCrit)} s={32} c={JH.red} />
              <span style={{ fontSize: 13, color: JH.muted }}> critical · </span>
              <JhN v={String(jhRadarAlert)} s={32} c={JH.amber} />
              <span style={{ fontSize: 13, color: JH.muted }}> alerts · </span>
              <JhN v={String(jhRadarWarn)} s={32} c={JH.watchYellow} />
              <span style={{ fontSize: 13, color: JH.muted }}> warning</span>
            </div>

            <div
                  style={{
                flex: "1 1 0%",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                overscrollBehavior: "contain",
                touchAction: "pan-y",
                paddingRight: 8,
                paddingBottom: 2,
                scrollbarGutter: "stable",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {JH_ALERTS.map((a, idx) => (
                <div
                  key={`${a.sev}-${idx}-${a.msg.slice(0, 32)}`}
                  style={{
                    padding: "8px 10px",
                    marginBottom: idx === JH_ALERTS.length - 1 ? 0 : 6,
                    background: `${a.c}07`,
                    borderLeft: `2px solid ${a.c}`,
                    borderRadius: "0 5px 5px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                    fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: `${a.c}20`,
                        color: a.c,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {a.sev}
                    </span>
            </div>
                  <p
                        style={{
                      fontSize: 12,
                      color: JH.sub,
                      margin: "0 0 4px",
                      lineHeight: 1.45,
                    }}
                  >
                    {a.msg}
                  </p>
                  <span style={{ fontSize: 11, color: a.c, fontWeight: 600 }}>
                    → {a.action}
                  </span>
                </div>
              ))}
            </div>
          </JhCard>
        </div>
        </div>
      </div>

      <JhCard s={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div>
            <JhSLbl>Journey stage health — select stage</JhSLbl>
            <p style={{ fontSize: 12, color: JH.dim, margin: 0 }}>
              Metrics, channel mix, insight, evidence, and recommended action
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {JH_STAGES.map((x) => (
                <button
                key={x.id}
                  type="button"
                onClick={() => setStageTab(x.id)}
                  style={{
                  padding: "6px 12px",
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                    cursor: "pointer",
                  border: `1px solid ${stageTab === x.id ? jhHealthColor(x.health) : JH.border}`,
                  background:
                    stageTab === x.id
                      ? `${jhHealthColor(x.health)}12`
                      : JH.surfaceInset,
                  color: stageTab === x.id ? jhHealthColor(x.health) : JH.muted,
                  transition: "all 0.15s",
                }}
              >
                {x.label.split(" & ")[0]?.split(" ")[0] ?? x.id}
                </button>
              ))}
            </div>
                </div>

        {sel ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                  {sel.label}
                </span>
                <JhStatus h={sel.health} />
                <span
                  style={{ fontSize: 11, color: JH.red, marginLeft: "auto" }}
                >
                  {sel.wow} WoW
                </span>
            </div>
        <div
          style={{
            display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {[
                  { l: "Conversations", v: sel.convos, c: JH.text },
                  {
                    l: "Negative sentiment",
                    v: `${sel.neg}%`,
                    c:
                      sel.neg >= 50
                        ? JH.red
                        : sel.neg >= 40
                          ? JH.amber
                          : JH.watchYellow,
                  },
                  {
                    l: "Repeat contact",
                    v: `${sel.repeat}%`,
                    c:
                      sel.repeat >= 40
                        ? JH.red
                        : sel.repeat >= 28
                          ? JH.amber
                          : JH.watchYellow,
                  },
                  {
                    l: "Churn signal",
                    v: `${sel.churn}%`,
                    c:
                      sel.churn >= 10
                        ? JH.red
                        : sel.churn >= 5
                          ? JH.amber
                          : JH.watchYellow,
                  },
                ].map((m) => (
                  <div
                    key={m.l}
                    style={{
                      background: JH.surfaceInset,
                      borderRadius: 5,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                  style={{
                        fontSize: 10,
                        color: JH.dim,
                        textTransform: "uppercase",
                        fontWeight: 600,
                        marginBottom: 3,
                      }}
                    >
                      {m.l}
                    </div>
                    <JhN v={m.v} s={18} c={m.c} />
                  </div>
              ))}
            </div>
            </div>

            <div>
              <JhSLbl>Where customers raise issues at this stage</JhSLbl>
              {(Object.entries(sel.channel) as [JhChannelKey, number][]).map(
                ([ch, pct]) => (
                  <div key={ch} style={{ marginBottom: 5 }}>
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 2,
                      }}
                    >
                      <JhCh k={ch} />
                      <JhN v={`${pct}%`} s={11} />
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: JH.track,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: JH.CH[ch],
                          opacity: 0.6,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
                </div>

            <div>
              <JhSLbl>AI insight</JhSLbl>
              <p
                style={{
                  fontSize: 12,
                  color: JH.sub,
                  lineHeight: 1.55,
                  margin: "0 0 8px",
                  padding: "8px 10px",
                  background: `${stageHcSel}07`,
                  borderLeft: `2px solid ${stageHcSel}`,
                  borderRadius: "0 4px 4px 0",
                }}
              >
                {sel.insight}
              </p>
              <div
                    style={{
                  padding: "6px 10px",
                  background: JH.surfaceInset,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: JH.dim,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  Evidence
                    </div>
                <p
                  style={{
                    fontSize: 11,
                    color: JH.muted,
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: 1.45,
                  }}
                >
                  {sel.evidence}
                </p>
                  </div>
              <JhActionBar>{sel.action}</JhActionBar>
            </div>
        </div>
        ) : null}
      </JhCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <JhCard>
          <JhSLbl>Channel sentiment — complaints and severity</JhSLbl>
          <table
          style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${JH.borderInner}`,
                  background: JH.surfaceRow,
                }}
              >
                {[
                  "Channel",
                  "Volume",
                  "Neg sentiment",
                  "Top issue",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "5px 4px",
                      textAlign:
                        h === "Channel" || h === "Top issue"
                          ? "left"
                          : "center",
                      color: JH.dim,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JH_CHANNEL_TABLE.map((r) => {
                const nc = negTone(r.neg);
                return (
                  <tr
                    key={r.ch}
                    style={{ borderBottom: `1px solid ${JH.border}` }}
                  >
                    <td style={{ padding: "8px 4px" }}>
                      <JhCh k={r.ch} />
                    </td>
                    <td style={{ padding: "8px 4px", textAlign: "center" }}>
                      <JhN v={r.vol} s={12} />
                    </td>
                    <td style={{ padding: "8px 4px", textAlign: "center" }}>
                      <JhN v={`${r.neg}%`} s={13} c={nc} />
                    </td>
                    <td
                      style={{
                        padding: "8px 4px",
                        fontSize: 11,
                        color: JH.muted,
                      }}
                    >
                      {r.topIssue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <JhInsight color={JH.red}>
            Social is 62% negative — highest of all channels despite lowest
            volume. Customers go public when internal channels fail. Voice at
            54% is driven almost entirely by Disputes and Retention traffic.
          </JhInsight>
          <JhActionBar>
            Monitor Social for early warning signals. Reduce Dispute-related
            Voice volume with proactive case updates.
          </JhActionBar>
        </JhCard>

        <JhCard>
          <JhSLbl>Repeat contact analysis — unresolved on first touch</JhSLbl>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <JhN v="34%" s={28} c={JH.red} />
            <span style={{ fontSize: 12, color: JH.muted }}>
              overall repeat rate ·{" "}
              <span style={{ color: JH.dim }}>
                each repeat callback materially increases handling cost
              </span>
            </span>
          </div>

          {JH_REPEAT.map((r) => (
            <div key={r.issue} style={{ marginBottom: 7 }}>
              <div
                  style={{
                    display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: JH.text }}
                  >
                    {r.issue}
                  </span>
                  <JhSeg k={r.seg} />
                  <JhCh k={r.ch} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: JH.dim }}>{r.vol}</span>
                  <JhN v={`${r.rate}%`} s={13} c={repeatTone(r.rate)} />
          </div>
      </div>
              <div
                style={{
                  height: 4,
                  background: JH.track,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${r.rate}%`,
                    height: "100%",
                    background: repeatTone(r.rate),
                    opacity: 0.7,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ))}
          <JhHR />
          <JhInsight color={JH.amber}>
            Dispute follow-up (47%) and Cashback (42%) are the top repeat
            contact drivers. Both solvable: dispute needs operational fix;
            cashback needs visibility in-channel. Combined: ~6,260 unnecessary
            callbacks this month.
          </JhInsight>
          <JhActionBar>
            Prioritise dispute status automation and cashback posting
            transparency. Target: repeat below 20%.
          </JhActionBar>
        </JhCard>
      </div>
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

type MrGap = "NONE" | "MODERATE" | "WIDE" | "SEVERE";

const MR_GAP_BADGE: Record<MrGap, string> = {
  NONE: MR.green,
  MODERATE: MR.yellow,
  WIDE: MR.orange,
  SEVERE: MR.red,
};

const MR_CMD_TONE: Record<"orange" | "red" | "cyan", string> = {
  orange: MR.orange,
  red: MR.red,
  cyan: MR.cyan,
};

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

function rankDeltaColor(rank: number, prev: number): string {
  if (rank < prev) return MR.green;
  if (rank > prev) return MR.red;
  return MR.orange;
}

function MrRankRow({
  site,
  category,
  rank,
  prev,
  competitor,
  reason,
  color,
}: {
  site: string;
  category: string;
  rank: number;
  prev: number;
  competitor: string;
  reason: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${MR.border}`,
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MR.text }}>
          {site}
        </div>
        <div style={{ fontSize: 10, color: MR.muted }}>{category}</div>
      </div>
      <div style={{ textAlign: "center", minWidth: 50 }}>
        <MrMono size={22} color={color}>
          #{rank}
        </MrMono>
        <div style={{ fontSize: 9, color: MR.muted }}>was #{prev}</div>
      </div>
      <div style={{ flex: 1.2 }}>
        <div style={{ fontSize: 10, color: MR.dim }}>#1: {competitor}</div>
        <div style={{ fontSize: 10, color: MR.orange, marginTop: 2 }}>
          ✦ {reason}
        </div>
      </div>
    </div>
  );
}

function MrEchoRow({
  source,
  narrative,
  echoCount,
  channels,
  churnPct,
  phrase,
  velocity,
}: {
  source: string;
  narrative: string;
  echoCount: string;
  channels: string;
  churnPct: string;
  phrase: string;
  velocity: string;
}) {
  const churnN = parseFloat(churnPct);
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 10,
        marginBottom: 8,
        borderLeft: `3px solid ${MR.cyan}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: MR.text }}>
            {narrative}
          </div>
          <div style={{ fontSize: 10, color: MR.muted, marginTop: 2 }}>
            Source: {source}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <MrMono size={18} color={MR.cyan}>
            {echoCount}
          </MrMono>
          <div style={{ fontSize: 9, color: MR.muted }}>internal convos</div>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 6 }}
      >
        <div>
          <span
            style={{
              fontSize: 9,
              color: MR.dim,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Channels:{" "}
          </span>
          <span style={{ fontSize: 11, color: MR.sub }}>{channels}</span>
        </div>
        <div>
          <span
            style={{
              fontSize: 9,
              color: MR.dim,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Churn in echo:{" "}
          </span>
          <MrMono
            size={11}
            color={!Number.isNaN(churnN) && churnN > 5 ? MR.red : MR.orange}
          >
            {churnPct}
          </MrMono>
        </div>
        <div>
          <span
            style={{
              fontSize: 9,
              color: MR.dim,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Velocity:{" "}
          </span>
          <MrMono size={11} color={MR.orange}>
            {velocity}
          </MrMono>
        </div>
      </div>
      <div style={{ fontSize: 11, color: MR.orange, fontStyle: "italic" }}>
        Top phrase: &ldquo;{phrase}&rdquo;
      </div>
    </div>
  );
}

function socialBarColor(score: number): string {
  if (score >= 0.6) return MR.green;
  if (score >= 0.5) return MR.yellow;
  if (score >= 0.4) return MR.orange;
  return MR.red;
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

export function MarketReputationV3Drill({ onBack }: DrillProps) {
  const socialHashtagInsight = V3_SOCIAL_AI.replace(/^\s*✨\s*/u, "✦ ");
  const leadCompetitor = V3_COMPETITORS[0];
  const ranks5 = V3_COMPARISON_RANKS.slice(0, 5);
  const media4 = V3_MEDIA.slice(0, 4);
  const comp5 = V3_COMPETITORS.slice(0, 5);

  return (
    <V3DrillShell>
      <DrillPageHeader
        onBack={onBack}
        title="What is the market saying about us?"
        sub="Reviews, social, and ranking sites — how we compare to Amex, Chase, and peers. External narrative vs. internal conversation echo."
        comfortable
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {V3_MARKET_REPUTATION_COMMAND.map((m) => {
          const c = MR_CMD_TONE[m.tone];
          return (
            <MrCard key={m.label} accent={c}>
              <div
                style={{
                  fontSize: 9,
                  color: c,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {m.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <MrMono size={36} color={MR.text}>
                  {m.value}
                </MrMono>
                {m.unit ? (
                  <span style={{ fontSize: 14, color: MR.muted }}>
                    {m.unit}
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: 10, color: MR.sub, marginTop: 4 }}>
                {m.sub}
              </div>
            </MrCard>
          );
        })}
      </div>

      <MrDivider label="What's being said externally" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <MrCard>
          <MrHead
            icon="⭐"
            sub="NerdWallet · Bankrate · WalletHub · Forbes · CreditKarma"
          >
            Rankings &amp; Reviews
          </MrHead>
          {ranks5.map((r) => (
            <MrRankRow
              key={`${r.site}-${r.category}`}
              site={r.site}
              category={r.category}
              rank={r.rank}
              prev={r.prev}
              competitor={`${r.top1} · ${r.score}`}
              reason={r.aiNote}
              color={rankDeltaColor(r.rank, r.prev)}
            />
          ))}
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: `${MR.red}08`,
              borderRadius: 8,
              borderLeft: `3px solid ${MR.red}`,
            }}
          >
            <span style={{ fontSize: 11, color: MR.sub }}>
              {V3_MARKET_RANKS_INSIGHT.before}
            </span>
            <MrMono size={12} color={MR.red}>
              {V3_MARKET_RANKS_INSIGHT.highlight}
            </MrMono>
          </div>
        </MrCard>

        <MrCard>
          <MrHead
            icon="💬"
            sub="App Store · Play Store · Trustpilot · Reddit · X — 6-week trend"
          >
            Social Sentiment &amp; Hashtags
          </MrHead>
          {V3_SOCIAL_SENTIMENT.map((s) => {
            const barColor = socialBarColor(s.score);
            return (
              <div
                key={s.channel}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: MR.sub,
                    width: 72,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {s.channel}
                </span>
                <MrMono size={12} color={barColor}>
                  {s.score.toFixed(2)}
                </MrMono>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${s.score * 100}%`,
                      height: "100%",
                      background: barColor,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <MrMono size={10} color={MR.red}>
                  {s.delta6w.toFixed(2)}
                </MrMono>
              </div>
            );
          })}

          <div
            style={{
              marginTop: 14,
              marginBottom: 8,
              fontSize: 10,
              color: MR.dim,
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Hashtag Momentum
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {V3_HASHTAGS.map((h) => {
              const neg = h.stance === "Negative";
              const cellBg = neg ? `${MR.red}08` : `${MR.green}08`;
              const cellBorder = neg ? `${MR.red}20` : `${MR.green}20`;
              const nameColor = neg ? MR.red : MR.green;
              return (
                <div
                  key={h.tag}
                  style={{
                    background: cellBg,
                    borderRadius: 8,
                    padding: "10px 12px",
                    border: `1px solid ${cellBorder}`,
                  }}
                >
                  <div
                    style={{ fontSize: 13, fontWeight: 800, color: nameColor }}
                  >
                    {h.tag}
                  </div>
                  <div style={{ fontSize: 10, color: MR.sub, marginTop: 2 }}>
                    {h.growth} · {h.volume.toLocaleString()} posts
                  </div>
                  <div style={{ fontSize: 10, color: MR.muted, marginTop: 2 }}>
                    {h.context}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: `${MR.orange}08`,
              borderRadius: 8,
              borderLeft: `3px solid ${MR.orange}`,
            }}
          >
            <span style={{ fontSize: 11, color: MR.sub }}>
              {socialHashtagInsight}
            </span>
          </div>
        </MrCard>

        <MrCard>
          <MrHead
            icon="🏦"
            sub="Competitor mentions inside OUR voice, chat, and social conversations"
          >
            Competitor Mention Monitor
          </MrHead>
          {comp5.map((c) => {
            const threatS = c.threat.toFixed(1);
            const th = parseFloat(threatS);
            return (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${MR.border}`,
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: MR.text }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: MR.muted,
                      fontStyle: "italic",
                      marginTop: 2,
                    }}
                  >
                    {c.context}
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 40 }}>
                  <MrMono size={14}>{c.mentions}</MrMono>
                </div>
                <MrMono
                  size={12}
                  color={!Number.isNaN(th) && th > 5 ? MR.red : MR.orange}
                >
                  {threatS}/10
                </MrMono>
              </div>
            );
          })}

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: `${MR.orange}08`,
              borderRadius: 8,
              borderLeft: `3px solid ${MR.orange}`,
            }}
          >
            <span style={{ fontSize: 11, color: MR.sub }}>
              CompetitorY growth:{" "}
            </span>
            <MrMono size={11} color={MR.red}>
              {leadCompetitor.growth}
            </MrMono>
            <span style={{ fontSize: 11, color: MR.sub }}>
              {" "}
              — leading churn-intent signal.
            </span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10,
                color: MR.dim,
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Tier-1 Media This Week
            </div>
            {media4.map((m) => (
              <div
                key={m.headline}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: `1px solid ${MR.border}`,
                }}
              >
                <div>
                  <span
                    style={{ fontSize: 11, fontWeight: 600, color: MR.sub }}
                  >
                    {m.outlet}
                  </span>
                  <span
                    style={{ fontSize: 11, color: MR.muted, marginLeft: 8 }}
                  >
                    {m.headline}
                  </span>
                </div>
                <MrMono size={10} color={MR.sub}>
                  {m.reach}
                </MrMono>
              </div>
            ))}
          </div>
        </MrCard>
      </div>

      <MrDivider label="Is it leaking into customer conversations?" />

      <MrCard accent={MR.cyan} style={{ marginBottom: 0 }}>
        <MrHead
          icon="🔗"
          sub="Which external narratives are appearing in internal voice, chat, email, and ticket conversations — ranked by echo frequency"
          badge="AI"
        >
          Echo Tracker — External → Internal Bridge
        </MrHead>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 280px",
            gap: 20,
          }}
        >
          <div>
            {V3_ECHO_TRACKER.map((row) => (
              <MrEchoRow
                key={row.source}
                source={row.source}
                narrative={row.narrative}
                echoCount={row.echoCount}
                channels={row.channels}
                churnPct={row.churnPct}
                velocity={row.velocity}
                phrase={row.phrase}
              />
            ))}
          </div>

          <div
            style={{ borderLeft: `1px solid ${MR.border}`, paddingLeft: 20 }}
          >
            <div
              style={{
                fontSize: 10,
                color: MR.cyan,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: 12,
              }}
            >
              Echo Summary
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: MR.dim,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Total echo conversations
              </div>
              <MrMono size={32} color={MR.text}>
                {V3_ECHO_SUMMARY.totalEcho}
              </MrMono>
              <div style={{ fontSize: 10, color: MR.muted }}>
                of {V3_ECHO_SUMMARY.totalConversations} total (
                {V3_ECHO_SUMMARY.penetrationPct} penetration)
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: MR.dim,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Echo → Churn conversion
              </div>
              <MrMono size={22} color={MR.red}>
                {V3_ECHO_SUMMARY.echoToChurn}
              </MrMono>
              <div style={{ fontSize: 10, color: MR.muted }}>
                vs {V3_ECHO_SUMMARY.baselineChurn} baseline churn intent
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: MR.dim,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Fastest growing echo
              </div>
              <MrMono size={14} color={MR.red}>
                {V3_ECHO_SUMMARY.fastestLabel}
              </MrMono>
              <div style={{ fontSize: 10, color: MR.muted }}>
                {V3_ECHO_SUMMARY.fastestDetail}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: MR.dim,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Highest churn echo
              </div>
              <MrMono size={14} color={MR.red}>
                {V3_ECHO_SUMMARY.highestChurnLabel}
              </MrMono>
              <div style={{ fontSize: 10, color: MR.muted }}>
                {V3_ECHO_SUMMARY.highestChurnDetail}
              </div>
            </div>

            <div
              style={{
                background: `${MR.cyan}10`,
                borderRadius: 8,
                padding: "12px",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 11, color: MR.cyan }}>✦ </span>
              <span style={{ fontSize: 11, color: MR.sub }}>
                Customers who cite external sources in conversations are{" "}
              </span>
              <MrMono size={11} color={MR.red}>
                {V3_ECHO_SUMMARY.liftMultiple}
              </MrMono>
              <span style={{ fontSize: 11, color: MR.sub }}>
                {" "}
                more likely to express churn intent than those who don&apos;t.
              </span>
            </div>
          </div>
        </div>
      </MrCard>

      <MrDivider label="Are we keeping our brand promises?" />

      <MrCard accent={MR.orange}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 200px",
            gap: 20,
          }}
        >
          <div>
            <MrHead
              icon="⚖"
              sub="What we advertise vs. what customers + reviewers are actually saying"
              badge="AI"
            >
              Brand Promise Gap
            </MrHead>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${MR.border}` }}>
                  {["We Promise", "They Say (Evidence)", "Gap", "Evidence"].map(
                    (h) => (
                    <th
                      key={h}
                        style={{
                          padding: "10px 6px",
                          textAlign: h === "Evidence" ? "right" : "left",
                          color: MR.dim,
                          fontWeight: 600,
                          fontSize: 9,
                          textTransform: "uppercase",
                        }}
                    >
                      {h}
                    </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {V3_BRAND_PROMISE_GAP.gaps.map((r) => {
                  const g = r.gap as MrGap;
                  const fill = g in MR_GAP_BADGE ? MR_GAP_BADGE[g] : MR.yellow;
                  return (
                    <tr
                      key={r.promise}
                      style={{ borderBottom: `1px solid ${MR.border}` }}
                    >
                      <td
                        style={{
                          padding: "12px 6px",
                          fontWeight: 600,
                          color: MR.text,
                        }}
                      >
                        {r.promise}
                      </td>
                      <td
                        style={{
                          padding: "12px 6px",
                          color: MR.sub,
                          fontSize: 11,
                        }}
                      >
                        {r.reality}
                      </td>
                      <td style={{ padding: "12px 6px" }}>
                        <MrBadge color={fill}>{g}</MrBadge>
                      </td>
                      <td style={{ padding: "12px 6px", textAlign: "right" }}>
                        <MrMono size={12}>
                          {r.evidenceCount > 0
                            ? r.evidenceCount.toLocaleString()
                            : "—"}
                        </MrMono>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{
                marginTop: 14,
                padding: "12px 16px",
                background: `${MR.red}08`,
                borderRadius: 8,
                borderLeft: `3px solid ${MR.red}`,
              }}
            >
              <span style={{ fontSize: 11, color: MR.sub }}>
                {V3_BRAND_PROMISE_GAP.aiNarrative.replace(/^\s*✨\s*/u, "✦ ")}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: `1px solid ${MR.border}`,
              paddingLeft: 20,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: MR.dim,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Brand Promise Score
            </div>
            <MrMono size={72} color={MR.orange}>
              {V3_BRAND_PROMISE_GAP.compositeScore}
            </MrMono>
            <p
              style={{
                fontSize: 10,
                color: MR.muted,
                textAlign: "center",
                lineHeight: 1.4,
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              &ldquo;How&apos;s the brand?&rdquo; — the number the Head of Cards
              shows the CEO.
            </p>
          </div>
        </div>
      </MrCard>

      <MrDivider label="Evidence & What to do about it" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <MrCard>
          <MrHead
            icon="🗣"
            sub="Anonymised mixed-channel snippets where customers cite external sources"
            badge="AI"
          >
            Conversation Evidence
          </MrHead>
          {V3_CONVERSATION_EVIDENCE_MARKET.map((e) => {
            const sentColor =
              e.sentiment === "NEGATIVE"
                ? MR.red
                : e.sentiment === "NEUTRAL"
                  ? MR.yellow
                  : MR.green;
            return (
              <div
                key={`${e.channel}-${e.segment}-${e.text.slice(0, 120)}`}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <MrTag color={MR.cyan}>{e.channel}</MrTag>
                  <MrTag color={MR.gold}>{e.segment}</MrTag>
                  <MrTag color={sentColor}>{e.sentiment}</MrTag>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: MR.text,
                    lineHeight: 1.5,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{e.text}&rdquo;
                </p>
              </div>
            );
          })}
        </MrCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MrCard accent={MR.purple}>
            <MrHead icon="✦">AI Executive Diagnosis</MrHead>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {V3_EXECUTIVE_DIAGNOSIS_MARKET.map((r) => (
                  <tr
                    key={r.label}
                    style={{ borderBottom: `1px solid ${MR.border}` }}
                  >
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

          <MrCard accent={MR.green}>
            <MrHead>Recommended Actions</MrHead>
            {V3_MARKET_REPUTATION_ACTIONS.map((a) => {
              const bColor =
                a.priority === "Critical"
                  ? MR.red
                  : a.priority === "High"
                    ? MR.orange
                    : MR.yellow;
              return (
                <div
                  key={a.title}
                style={{
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <h4
                  style={{
                        fontSize: 13,
                        fontWeight: 700,
                        margin: "0 0 4px",
                        color: MR.text,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {a.title}
                    </h4>
                    <MrBadge color={bColor}>{a.priority}</MrBadge>
                </div>
                  <div style={{ fontSize: 11, color: MR.muted }}>
                    Owner: {a.owner}
              </div>
                  <div style={{ fontSize: 11, color: MR.sub, marginTop: 2 }}>
                    Impact: {a.impact}
                  </div>
                </div>
              );
            })}
          </MrCard>
          </div>
                  </div>
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

