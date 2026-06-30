"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, Sparkles, Newspaper, Mail, Ticket, MessageSquare, Phone } from "lucide-react";
import {
  Line,
  BarChart, Bar,
  ComposedChart,
  Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";

// Reused existing components from across the codebase (Customer Happiness drill-down only)
import { RetailFCIKPICards, type RetailFCIVariant } from "./RetailFCIKPICards";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { fciClusters, type FCICluster } from "@/lib/fci-lib/fciData";

import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";
import { IntentScoreHeatmap } from "@/components/FCI/IntentScoreHeatmap";
// Brand & Reputation — role-based local copies (self-contained mock data)
import { RetailTopTopicsByVirality, type RetailBrandDrillVariant } from "./RetailTopTopicsByVirality";
import { RetailMomentumHashtags } from "./RetailMomentumHashtags";
import { RetailInfluencerWatchlist } from "./RetailInfluencerWatchlist";
import { RetailIntentPressureAlerts } from "./RetailIntentPressureAlerts";
import { RetailSLAPerformanceOverview } from "./RetailSLAPerformanceOverview";

/* ─────────────────────────────────────────────────────────────────────────
   Shared helpers — chart panels + optional AI Executive Insight blocks
   ──────────────────────────────────────────────────────────────────────── */

function BackButton({ onBack }: { onBack: () => void }) {
  const T = useDashboardTheme();
  return (
    <button
      type="button"
      onClick={onBack}
      style={{
        display: "flex", alignItems: "center", gap: 8, background: T.elevated,
        border: `1px solid ${T.borderLight}`, borderRadius: 10, padding: "8px 16px",
        cursor: "pointer", color: T.textSec, fontSize: 13, fontWeight: 600,
        fontFamily: "inherit", transition: "all 0.2s", marginBottom: 20, width: "fit-content",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.cyan; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = T.textSec; e.currentTarget.style.borderColor = T.borderLight; }}
    >
      <ArrowLeft size={14} />
      Back to Overview
    </button>
  );
}

/**
 * Inline drill-down page header — back button beside title + subtitle on one row.
 * Used as the first element of each Screen 1 drill-down (Are our Customers happy?,
 * Is the Brand at risk?, How is our Service delivery?).
 */
function DrillPageHeader({
  onBack, title, sub,
}: { onBack: () => void; title: string; sub: string }) {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: T.elevated,
          borderTop: `1px solid ${T.borderLight}`,
          borderRight: `1px solid ${T.borderLight}`,
          borderBottom: `1px solid ${T.borderLight}`,
          borderLeft: `1px solid ${T.borderLight}`,
          borderRadius: 10, padding: "8px 16px",
          cursor: "pointer", color: T.textSec, fontSize: 13, fontWeight: 600,
          fontFamily: "inherit", transition: "all 0.2s", width: "fit-content", flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = T.text;
          e.currentTarget.style.borderTopColor = T.cyan;
          e.currentTarget.style.borderRightColor = T.cyan;
          e.currentTarget.style.borderBottomColor = T.cyan;
          e.currentTarget.style.borderLeftColor = T.cyan;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = T.textSec;
          e.currentTarget.style.borderTopColor = T.borderLight;
          e.currentTarget.style.borderRightColor = T.borderLight;
          e.currentTarget.style.borderBottomColor = T.borderLight;
          e.currentTarget.style.borderLeftColor = T.borderLight;
        }}
      >
        <ArrowLeft size={14} />
        Back to Overview
      </button>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textSec, marginTop: 3, maxWidth: 780 }}>{sub}</div>
      </div>
    </div>
  );
}

function DrillHeader({ title, sub, score, scoreColor }: { title: string; sub: string; score: number; scoreColor: string }) {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%", border: `3px solid ${scoreColor}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${scoreColor}20`, boxShadow: `0 0 22px ${scoreColor}45`, flexShrink: 0,
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor, fontFamily: "var(--mono)" }}>{score}</span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textSec, marginTop: 3, maxWidth: 780 }}>{sub}</div>
      </div>
    </div>
  );
}

/**
 * Drill-down chart card.
 * - Default: plain chart panel (no AI chrome).
 * - Pass `ai` + `aiModel` to mark a widget as AI-powered: shows ✨ prefix on title
 *   and an "AI · {model}" pill (same language as the AI Risk Spike Monitor).
 */
function AIPanel({
  title, subtitle, children, accentColor, minHeight, ai = false, aiModel, headerRight, fill = false, compact = false, borderless = false,
}: {
  title: string; subtitle?: string; children: ReactNode;
  accentColor?: string; minHeight?: number;
  ai?: boolean; aiModel?: string;
  /** Optional custom content placed on the top-right of the header.
   *  When provided, it replaces the default AI model pill. */
  headerRight?: ReactNode;
  /** When true, the panel grows to fill its grid row height and lays out its
   *  children as a flex column so the body can stretch with `flex: 1`. */
  fill?: boolean;
  /** Tighter padding and header for dense stacks (e.g. sidebar leaderboards). */
  compact?: boolean;
  /** Removes card border lines while preserving layout. */
  borderless?: boolean;
}) {
  const T = useDashboardTheme();
  const accent = accentColor || T.cyan;
  return (
    <div style={{
      background: T.elevated,
      borderTop: borderless ? "none" : `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderRight: borderless ? "none" : `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderBottom: borderless ? "none" : `1px solid ${ai ? `${accent}35` : T.borderLight}`,
      borderLeft: borderless ? "none" : `3px solid ${accent}`,
      borderRadius: compact ? 12 : 14,
      padding: compact ? 11 : 18,
      minHeight,
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
        gap: compact ? 6 : 10,
        marginBottom: compact ? 8 : 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: compact ? 5 : 7 }}>
            {ai ? <span style={{ fontSize: 14, lineHeight: 1 }}>✨</span> : null}
            <span style={{
              fontSize: compact ? 11 : 12.5, fontWeight: 700, color: T.text,
              textTransform: "uppercase", letterSpacing: compact ? 0.65 : 0.8,
            }}>{title}</span>
          </div>
          {subtitle ? (
            <div style={{
              fontSize: compact ? 9.5 : 11,
              color: T.textMut,
              marginTop: compact ? 2 : 4,
              lineHeight: compact ? 1.35 : undefined,
            }}>
              {subtitle}
        </div>
          ) : null}
        </div>
        {headerRight ? (
          <div style={{ flexShrink: 0, minWidth: 0 }}>{headerRight}</div>
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
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/** Unified Recharts tooltip — dark, compact. */
function ChartTip({ active, payload, label, T, valueSuffix = "" }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "rgba(10,14,22,0.96)", border: `1px solid ${T.borderLight}`,
      borderRadius: 8, padding: "8px 11px", backdropFilter: "blur(8px)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.45)", fontSize: 11,
    }}>
      {label !== undefined && (
        <div style={{ fontSize: 10.5, color: T.textMut, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i ? 3 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill, display: "inline-block" }} />
          <span style={{ color: T.textSec }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)", marginLeft: "auto" }}>
            {typeof p.value === "number" ? p.value : p.value}{valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

const axisTickStyle = (T: DashboardThemeTokens) => ({ fill: T.textMut, fontSize: 10.5, fontFamily: "var(--mono)" });

/* ─────────────────────────────────────────────────────────────────────────
   Shared helper — sentiment colour + intent row card (HV vs LV block)
   ──────────────────────────────────────────────────────────────────────── */

function sentimentColor(T: DashboardThemeTokens, s: number) {
  if (s <= -0.5) return T.red;
  if (s <  -0.2) return T.amber;
  if (s <=  0.1) return T.gold;
  if (s <=  0.4) return "#84cc16";
  return T.green;
}

function sentimentFace(s: number) {
  if (s <= -0.5) return "😠";
  if (s <  -0.2) return "😟";
  if (s <=  0.1) return "😐";
  if (s <=  0.4) return "🙂";
  return "😊";
}

/**
 * BrandRowPlaceholder — empty dashed card used to reserve a slot in the
 * Brand & Reputation top row until the final visualization is decided.
 */
function BrandRowPlaceholder({ T, label }: { T: DashboardThemeTokens; label: string }) {
  return (
    <div
      aria-label={label}
      style={{
        background: T.elevated,
        border: `1px dashed ${T.borderLight}`,
        borderRadius: 14,
        padding: 18,
        minHeight: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: T.textMut,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.8,
      }}
    >
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD 1 — CUSTOMER HAPPINESS
   ──────────────────────────────────────────────────────────────────────── */

// NPS_TREND, CHURN_GAUGE, CHURN_LEADERS and RCR_ROWS were removed along with
// their charts. Those three signals (NPS Segment Monitor, Churn Signal Index
// and Repeat Contact Rate) now live inside RetailFCIKPICards at the top of
// this drill-down. If you need the historic mock data back, look at git history.

const SENT_HEATMAP = [
  { ch: "Voice",     cells: [0.68, 0.65, 0.62, 0.60, 0.58, 0.56] },
  { ch: "Email",     cells: [0.62, 0.60, 0.58, 0.56, 0.54, 0.52] },
  { ch: "Chat",      cells: [0.65, 0.64, 0.63, 0.62, 0.60, 0.58] },
  { ch: "Social/X",  cells: [0.52, 0.48, 0.44, 0.41, 0.38, 0.36] },
  { ch: "App Store", cells: [0.71, 0.72, 0.72, 0.73, 0.73, 0.74] },
];
const HEATMAP_WEEKS = ["W-5", "W-4", "W-3", "W-2", "W-1", "Now"];

// Vulnerability indicators surfaced by an NLP model from live conversations —
// maps to FCA Consumer Duty requirements (bereavement, financial difficulty, health).
// ─── Mock data adapters for reused existing components ───────────────────────
// Phrases grouped by parent topic and ordered to mirror Top Topics at Risk
// (topics by total desc → phrases by count desc within each topic).
//   1. Payment Processing Failure 212 → 86 + 66 + 60
//   2. Account Access Problems 167 → 167
//   3. Fee Structure Criticism 141 → 95 + 46
//   4. Cross Border Issues 118 → 118
//   5. Customer Service (Disappointment) 102 → 47 + 32 + 23
// Percentages are of the extracted phrase total (740).
const REUSED_NARRATIVE_PHRASES = [
  { phrase: "Payment didn't go through",       count: 86,  percentage: 11.6, trend: "up" as const,     channels: ["App Store", "Play Store"],                    topic: "Payment Processing Failure" },
  { phrase: "Card was declined again",         count: 66,  percentage: 8.9,  trend: "stable" as const, channels: ["Trustpilot"],                                 topic: "Payment Processing Failure" },
  { phrase: "Still waiting on my refund",      count: 60,  percentage: 8.1,  trend: "up" as const,     channels: ["X (Twitter)", "Reddit", "Play Store"],        topic: "Payment Processing Failure" },
  { phrase: "Can't log in to the app",         count: 167, percentage: 22.6, trend: "up" as const,     channels: ["Play Store", "Reddit"],                       topic: "Account Access Problems" },
  { phrase: "Why is the fee on my account?",   count: 95,  percentage: 12.8, trend: "up" as const,     channels: ["App Store", "Trustpilot", "X (Twitter)"],     topic: "Fee Structure Criticism" },
  { phrase: "Hidden charges on my statement",  count: 46,  percentage: 6.2,  trend: "up" as const,     channels: ["Trustpilot", "X (Twitter)"],                  topic: "Fee Structure Criticism" },
  { phrase: "Transfer stuck for 3 days",       count: 118, percentage: 15.9, trend: "down" as const,   channels: ["Play Store", "X (Twitter)"],                  topic: "Cross Border Issues" },
  { phrase: "Nobody called me back",           count: 47,  percentage: 6.4,  trend: "stable" as const, channels: ["App Store", "Reddit"],                        topic: "Customer Service" },
  { phrase: "Agent couldn't resolve",          count: 32,  percentage: 4.3,  trend: "stable" as const, channels: ["Trustpilot", "Reddit", "X (Twitter)"],        topic: "Customer Service" },
  { phrase: "I've called 4 times now",         count: 23,  percentage: 3.1,  trend: "down" as const,   channels: ["X (Twitter)"],                                topic: "Customer Service" },
];

const VOC_CHANNEL_COLORS: Record<string, string> = {
  "App Store": "#9333EA",
  "Play Store": "#0891B2",
  Reddit: "#B45309",
  Trustpilot: "#65A30D",
  "X (Twitter)": "#64748B",
};

// Mirror of total-mentions tiers used in RetailTopTopicsByVirality so the
// Friction Driver tag color matches its parent topic tier in Card 1.
// Critical ≥150 (red) · High 100–149 (amber) · Watch 50–99 (gold) · Stable <50 (slate)
const TOPIC_TIER_COLOR: Record<string, string> = {
  "Payment Processing Failure":      "#EF4444", // 212 → Critical
  "Mobile App Crashes":              "#EF4444", // 184 → Critical
  "Account Access Problems":         "#EF4444", // 167 → Critical
  "Fee Structure Criticism":         "#F59E0B", // 141 → High
  "System Outage Frustration":       "#F59E0B", // 129 → High
  "Cross Border Issues":             "#F59E0B", // 118 → High
  "Customer Service":                "#F59E0B", // 102 → High
  "Customer Service Disappointment": "#F59E0B", // 102 → High
  "Regulatory Compliance Questions": "#E8B931", //  96 → Watch
};



// ─── Top intents × sentiment · HV vs LV (first block in drill-down) ────────
type IntentRow = {
  intent: string;
  share: number;      // % of that segment's contact volume
  sentiment: number;  // -1..+1
  delta: number;      // sentiment delta vs prior 4 weeks
  sampleQuote: string;
};

const HV_INTENTS: IntentRow[] = [
  { intent: "Wealth / Investment Advice",    share: 24, sentiment: -0.58, delta: -0.14, sampleQuote: "My RM hasn't called me back in 3 weeks." },
  { intent: "Fee & Charge Disputes",         share: 19, sentiment: -0.64, delta: -0.08, sampleQuote: "Why am I paying £45 when I'm a Private client?" },
  { intent: "Mortgage / Large Loan",         share: 14, sentiment: -0.28, delta: -0.05, sampleQuote: "Offer expired while you kept asking for docs." },
  { intent: "Card Declines (Travel / FX)",   share: 11, sentiment: -0.41, delta: -0.10, sampleQuote: "Card blocked in Dubai, no one answered." },
  { intent: "Relationship Manager Access",   share: 10, sentiment: -0.52, delta: -0.17, sampleQuote: "Three different RMs in six months." },
  { intent: "Complaint Escalation",          share: 8,  sentiment: -0.71, delta: -0.12, sampleQuote: "I've escalated this twice already." },
  { intent: "Tax / Statement Requests",      share: 8,  sentiment:  0.12, delta:  0.02, sampleQuote: "Quick and polite service, thanks." },
  { intent: "Rewards / Concierge",           share: 6,  sentiment:  0.38, delta:  0.04, sampleQuote: "Loved the airport lounge upgrade." },
];

const LV_INTENTS: IntentRow[] = [
  { intent: "App Login & Authentication",    share: 26, sentiment: -0.56, delta: -0.11, sampleQuote: "Face ID broken after the update." },
  { intent: "Card Declines (Everyday)",      share: 21, sentiment: -0.62, delta: -0.15, sampleQuote: "Declined at Tesco in front of everyone." },
  { intent: "Fee Disputes (Overdraft)",      share: 17, sentiment: -0.69, delta: -0.09, sampleQuote: "£35 overdraft fee for £2 shortfall." },
  { intent: "Payment / Transfer Issues",     share: 12, sentiment: -0.44, delta: -0.06, sampleQuote: "Transfer stuck pending for 3 days." },
  { intent: "Account Access / Password",     share: 9,  sentiment: -0.32, delta: -0.03, sampleQuote: "Locked out again after reset." },
  { intent: "Balance & Statements",          share: 6,  sentiment:  0.18, delta:  0.01, sampleQuote: "App shows balance clearly, helpful." },
  { intent: "New Product Inquiry",           share: 5,  sentiment:  0.22, delta:  0.03, sampleQuote: "Opened a savings account in 5 minutes." },
  { intent: "Complaint / Social Escalation", share: 4,  sentiment: -0.74, delta: -0.18, sampleQuote: "Posting this on Twitter — no response." },
];

export type CustomerHappinessDrillVariant = RetailFCIVariant;

const HV_COMMON_INTENTS = [
  { intent: "Fee Disputes",     hv: -0.64, lv: -0.69 },
  { intent: "Card Declines",    hv: -0.41, lv: -0.62 },
  { intent: "App / Login",      hv: -0.22, lv: -0.56 },
  { intent: "Escalations",      hv: -0.71, lv: -0.74 },
  { intent: "Statements / Tax", hv:  0.12, lv:  0.18 },
  { intent: "Rewards / Offers", hv:  0.38, lv:  0.22 },
];

const STERLING_HV_INTENTS: IntentRow[] = [
  { intent: "Savings / Easy-Saver decline",     share: 27, sentiment: -0.66, delta: -0.20, sampleQuote: "Tried to move £80k in — rejected with no reason." },
  { intent: "Decline reason not given",          share: 18, sentiment: -0.71, delta: -0.15, sampleQuote: "No explanation, no appeal — told to call a fraud-prevention agency." },
  { intent: "Interest removed / rate cut",       share: 15, sentiment: -0.58, delta: -0.12, sampleQuote: "3.25% gone — why would I keep my money here?" },
  { intent: "ISA vs Easy-Saver confusion",       share: 12, sentiment: -0.24, delta: -0.04, sampleQuote: "Which one actually pays interest now?" },
  { intent: "High-balance consolidation / FSCS", share: 11, sentiment: -0.18, delta: -0.03, sampleQuote: "Is £150k still protected if I bring it all here?" },
  { intent: "Relationship Manager access",       share:  9, sentiment: -0.50, delta: -0.10, sampleQuote: "No one can tell me why I was turned down." },
  { intent: "Proof of funds / documentation",    share:  5, sentiment: -0.30, delta: -0.05, sampleQuote: "Sent everything twice, still declined." },
  { intent: "Fair-value of savings query",       share:  3, sentiment:  0.10, delta:  0.02, sampleQuote: "At least explain the rate change." },
];

const STERLING_LV_INTENTS: IntentRow[] = [
  { intent: "Easy-Saver application declined",   share: 28, sentiment: -0.62, delta: -0.16, sampleQuote: "Applied online, instantly rejected, no reason." },
  { intent: "Why was I rejected",                share: 19, sentiment: -0.64, delta: -0.13, sampleQuote: "Just says 'unable to offer' — that's it." },
  { intent: "Interest rate query",               share: 16, sentiment: -0.41, delta: -0.08, sampleQuote: "Rate dropped and no one told me." },
  { intent: "ISA vs Easy-Saver",                 share: 12, sentiment: -0.28, delta: -0.05, sampleQuote: "Don't know which account to open." },
  { intent: "Switching savings elsewhere",       share: 10, sentiment: -0.55, delta: -0.14, sampleQuote: "Moving my savings to Chase — better rate." },
  { intent: "FSCS / protection question",        share:  6, sentiment:  0.12, delta:  0.01, sampleQuote: "Is my money safe up to £85k?" },
  { intent: "New savings product inquiry",       share:  5, sentiment:  0.20, delta:  0.03, sampleQuote: "Opened a saver in 5 minutes — easy." },
  { intent: "Complaint / social escalation",     share:  4, sentiment: -0.72, delta: -0.17, sampleQuote: "Posting about this rejection on Twitter." },
];

const STERLING_COMMON_INTENTS = [
  { intent: "Savings decline",    hv: -0.66, lv: -0.62 },
  { intent: "Interest removed",   hv: -0.58, lv: -0.41 },
  { intent: "Reason not given",   hv: -0.71, lv: -0.64 },
  { intent: "ISA vs Easy-Saver",  hv: -0.24, lv: -0.28 },
  { intent: "FSCS / protection",  hv: -0.18, lv:  0.12 },
  { intent: "Switching elsewhere", hv: -0.50, lv: -0.55 },
];

const h1FailureClusters: FCICluster[] = [
  {
    id: "h1-1",
    category: "Savings eligibility declines",
    count: 428,
    trend: 18.4,
    severity: "High Impact",
    examples: [
      "£80k Easy-Saver application rejected with no reason given",
      "High-balance saver declined after proof-of-funds submission",
      "Savings account opening failed at final verification step",
    ],
    affectedCustomers: 312,
    businessImpact: "~£310K/week deposit outflow from declined high-balance savers",
    totalInteractions: 1842,
    avgResolutionTime: "4.6 hours",
    topChannels: [
      { channel: "App", percentage: 34 },
      { channel: "Voice", percentage: 28 },
      { channel: "Chat", percentage: 18 },
      { channel: "Email", percentage: 12 },
      { channel: "Social", percentage: 8 },
    ],
    topics: ["No reason given", "Fraud-prevention referral", "Rate removed", "Appeal / re-apply", "Move to competitor"],
    nextActionSuggestion: "Draft reason-code disclosure review for savings declines — never auto-send",
    processError: 68,
    productKnowledgeGap: 32,
  },
  {
    id: "h1-2",
    category: "Decline reason not provided",
    count: 312,
    trend: 14.2,
    severity: "High Impact",
    examples: [
      "Customer told to contact external fraud-prevention agency with no case reference",
      "App shows 'unable to offer' with no appeal path",
      "Voice agent cannot see decline code on savings application",
    ],
    affectedCustomers: 287,
    businessImpact: "FOS upheld conflicting-explanation complaint — conduct risk on tipping-off / SAR tension",
    totalInteractions: 1240,
    avgResolutionTime: "3.8 hours",
    topChannels: [
      { channel: "Voice", percentage: 42 },
      { channel: "App", percentage: 26 },
      { channel: "Chat", percentage: 16 },
      { channel: "Email", percentage: 10 },
      { channel: "Social", percentage: 6 },
    ],
    topics: ["No reason given", "Fraud-prevention referral", "Appeal / re-apply"],
    nextActionSuggestion: "Draft disclosure playbook for savings decline handling — propose only, never auto-send",
    processError: 74,
    productKnowledgeGap: 26,
  },
  {
    id: "h1-3",
    category: "Easy-Saver application drop-off",
    count: 198,
    trend: 9.6,
    severity: "Medium",
    examples: [
      "Digital application abandoned after instant rejection screen",
      "Customer re-applies three times with same outcome",
      "Proof-of-funds upload loop before silent decline",
    ],
    affectedCustomers: 176,
    businessImpact: "Digital acquisition funnel leak at savings onboarding",
    totalInteractions: 890,
    avgResolutionTime: "2.4 hours",
    topChannels: [
      { channel: "App", percentage: 48 },
      { channel: "Chat", percentage: 22 },
      { channel: "Voice", percentage: 18 },
      { channel: "Email", percentage: 8 },
      { channel: "Social", percentage: 4 },
    ],
    topics: ["No reason given", "Appeal / re-apply", "Move to competitor"],
    nextActionSuggestion: "Draft in-app decline explanation template for Easy-Saver — propose only",
    processError: 62,
    productKnowledgeGap: 38,
  },
  {
    id: "h1-4",
    category: "Interest-removal / rate-cut queries",
    count: 164,
    trend: 11.8,
    severity: "Medium",
    examples: [
      "3.25% Easy-Saver rate removed — customer asks why balance still here",
      "No proactive notification before rate change on existing saver",
      "Customer comparing Chase/Monzo/Nationwide rates in voice",
    ],
    affectedCustomers: 142,
    businessImpact: "Primacy erosion — switch intent precedes outbound transfers",
    totalInteractions: 720,
    avgResolutionTime: "2.1 hours",
    topChannels: [
      { channel: "Voice", percentage: 36 },
      { channel: "App", percentage: 24 },
      { channel: "Email", percentage: 20 },
      { channel: "Chat", percentage: 14 },
      { channel: "Social", percentage: 6 },
    ],
    topics: ["Rate removed", "Move to competitor", "Appeal / re-apply"],
    nextActionSuggestion: "Draft save-offer for flight-risk cohort within retention window — propose only",
    processError: 55,
    productKnowledgeGap: 45,
  },
  {
    id: "h1-5",
    category: "ISA vs Easy-Saver confusion",
    count: 98,
    trend: 4.2,
    severity: "Low",
    examples: [
      "Customer unsure which product still pays interest",
      "ISA allowance question after Easy-Saver decline",
      "Branch refers to website — website shows conflicting rates",
    ],
    affectedCustomers: 88,
    businessImpact: "Product clarity friction extending handle time on savings enquiries",
    totalInteractions: 410,
    avgResolutionTime: "1.6 hours",
    topChannels: [
      { channel: "Chat", percentage: 32 },
      { channel: "Voice", percentage: 28 },
      { channel: "App", percentage: 22 },
      { channel: "Email", percentage: 14 },
      { channel: "Social", percentage: 4 },
    ],
    topics: ["Rate removed", "Appeal / re-apply"],
    nextActionSuggestion: "Draft product comparison one-pager for ISA vs Easy-Saver — propose only",
    processError: 48,
    productKnowledgeGap: 52,
  },
  {
    id: "h1-6",
    category: "FSCS / consolidation confusion",
    count: 76,
    trend: 2.8,
    severity: "Low",
    examples: [
      "Is £150k protected if consolidated into one Sterling account?",
      "Customer splitting balances across banks after decline scare",
      "FSCS limit question before moving high balance in",
    ],
    affectedCustomers: 64,
    businessImpact: "Consolidation hesitation blocking deposit capture from HV savers",
    totalInteractions: 320,
    avgResolutionTime: "1.4 hours",
    topChannels: [
      { channel: "Voice", percentage: 38 },
      { channel: "Email", percentage: 24 },
      { channel: "Chat", percentage: 20 },
      { channel: "App", percentage: 12 },
      { channel: "Social", percentage: 6 },
    ],
    topics: ["No reason given", "Fraud-prevention referral"],
    nextActionSuggestion: "Draft FSCS consolidation guidance for RM and voice teams — propose only",
    processError: 42,
    productKnowledgeGap: 58,
  },
];

export function CustomerHappinessDrillDown({
  onBack,
  variant = "default",
}: {
  onBack: () => void;
  variant?: CustomerHappinessDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterlingDepositLeak = variant === "sterling-deposit-leak";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title={
          isSterlingDepositLeak
            ? "Are we leaking deposits at the door?"
            : "Are our Customers happy?"
        }
        sub={
          isSterlingDepositLeak
            ? "Where high-value savers are declined for Savings / Easy-Saver with no reason given — and how much deposit walks out as a result. Decline-reason vacuum → deposit outflow."
            : "How happy are your customers and what is driving unhappiness across segments, journeys, products and channels?"
        }
      />

      {/* Row 0 — FCI KPI wall (requested to appear on top) */}
      <RetailFCIKPICards isDarkMode variant={variant} />

      {/* Tier 1 — What's Failing? diagnostic wall promoted by request */}
      <FailureClusters
        clusters={isSterlingDepositLeak ? h1FailureClusters : fciClusters}
        isDarkMode
      />

      {/* Row 1 removed — Topic Bubble Map dropped from Customer Happiness drill-down;
          Sentiment Heatmap now lives in the Brand & Reputation drill-down and
          NPS Segment Monitor sits in the RetailFCIKPICards block above. */}

      {/* Row 2 removed — Churn Signal Index + Repeat Contact Tracker now live in the
          RetailFCIKPICards block at the top of this drill-down. */}

      {/* Bottom row — TOP INTENTS × SENTIMENT · HV vs LV */}
      <HVvsLVIntentPanel
        T={T}
        hvIntents={isSterlingDepositLeak ? STERLING_HV_INTENTS : HV_INTENTS}
        lvIntents={isSterlingDepositLeak ? STERLING_LV_INTENTS : LV_INTENTS}
        commonIntents={isSterlingDepositLeak ? STERLING_COMMON_INTENTS : HV_COMMON_INTENTS}
        panelSubtitle={
          isSterlingDepositLeak
            ? "What high-value and mass-retail savers are contacting about after savings declines (last 30 days)"
            : "What High-Value and Low-Value customers are calling about, and how they feel about each intent (last 30 days)"
        }
      />

      {/* Reused components: most were curated away after review.
          Previously here: SentimentChart, RepeatContactRate, CustomerEmotion,
          SeverePainIncidents, TimeInPain, NarrativeLens, TopicBubbleMap,
          CrossChannelToneIntelligenceCard, IntentScoreHeatmap. */}
          </div>
  );
}

/**
 * Simple labelled wrapper for the "Reused Components" staging area.
 * Keeps each imported component visually separated with a consistent chrome
 * while preserving the component's own native styling inside.
 */
function ReusedSlot({
  T, label, note, children,
}: {
  T: DashboardThemeTokens; label: string; note?: string; children: ReactNode;
}) {
  return (
    <div style={{
      border: `1px dashed ${T.borderLight}`, borderRadius: 12,
      padding: 12, background: T.card,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
          color: T.gold, padding: "3px 8px", borderRadius: 999,
          background: `${T.gold}18`, border: `1px solid ${T.gold}40`, fontFamily: "var(--mono)",
        }}>
          Reused · {label}
        </span>
        {note ? <span style={{ fontSize: 11, color: T.textMut }}>{note}</span> : null}
      </div>
      <div className="dark" style={{ colorScheme: "dark" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HV vs LV · Top Intents × Sentiment
   First block of the Customer Happiness drill-down — the "lead signal".
   Shows what HV and LV customers are calling about AND how they feel about it.
   ──────────────────────────────────────────────────────────────────────── */

const INTENT_GRID_COLUMNS = "10px minmax(0, 1fr) 54px 72px 52px";

function IntentRowCard({
  row, color, T, isLast,
}: { row: IntentRow; color: string; T: DashboardThemeTokens; isLast: boolean }) {
  const sColor = sentimentColor(T, row.sentiment);
  const nps = Math.round(row.sentiment * 100);

                  return (
                    <div
                      style={{
        display: "grid",
        gridTemplateColumns: INTENT_GRID_COLUMNS,
        columnGap: 10,
        rowGap: 6,
        alignItems: "center",
        padding: "10px 14px",
        borderBottom: isLast ? "none" : `1px solid ${T.borderLight}`,
        position: "relative",
      }}
      title={`"${row.sampleQuote}"`}
    >
      <span style={{
        width: 8, height: 8, borderRadius: 999, background: color,
        boxShadow: `0 0 0 3px ${color}22`,
      }} />

      <div style={{ minWidth: 0 }}>
        <span style={{
          fontSize: 12.5, fontWeight: 700, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          display: "block",
        }}>
          {row.intent}
        </span>
          </div>

      <span style={{
        textAlign: "right", fontSize: 13, fontWeight: 800, color: T.text,
        fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.3,
      }}>
        {row.share}%
      </span>

      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
        fontSize: 11.5, fontWeight: 800, color: sColor,
        fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}>
        <span>{row.sentiment > 0 ? "+" : ""}{row.sentiment.toFixed(2)}</span>
      </span>

      <span style={{
        textAlign: "right", fontSize: 12, fontWeight: 800, color: sColor,
        fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.2,
      }}>
        {nps > 0 ? "+" : ""}{nps}
      </span>
              </div>
  );
}

function IntentGroupCard({
  title, subtitle, color, rows, T,
}: {
  title: string; subtitle: string; color: string;
  rows: IntentRow[]; T: DashboardThemeTokens;
}) {
              return (
    <div style={{
      borderRadius: 12,
      background: T.card,
      borderTop: `1px solid ${color}30`,
      borderRight: `1px solid ${color}30`,
      borderBottom: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      overflow: "hidden",
    }}>
      {/* Group header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: INTENT_GRID_COLUMNS,
        columnGap: 10,
        alignItems: "center",
        padding: "10px 14px",
        background: `linear-gradient(90deg, ${color}14 0%, transparent 60%)`,
        borderBottom: `1px solid ${T.borderLight}`,
      }}>
        <span />
        <span style={{
          fontSize: 11, fontWeight: 800, color,
          letterSpacing: 0.8, textTransform: "uppercase",
        }}>
          {title}
        </span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textMut, textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>Share</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textMut, textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>Happiness</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textMut, textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>NPS</span>
                  </div>
      <div style={{ padding: "0 2px", fontSize: 10.5, color: T.textMut, margin: "6px 14px 0" }}>
        {subtitle}
                </div>
      <div>
        {rows.map((r, i) => (
          <IntentRowCard
            key={`${title}-${r.intent}`}
            row={r}
            color={color}
            T={T}
            isLast={i === rows.length - 1}
          />
        ))}
          </div>
          </div>
  );
}

function HVvsLVIntentPanel({
  T,
  hvIntents,
  lvIntents,
  commonIntents,
  panelSubtitle,
}: {
  T: DashboardThemeTokens;
  hvIntents: IntentRow[];
  lvIntents: IntentRow[];
  commonIntents: { intent: string; hv: number; lv: number }[];
  panelSubtitle: string;
}) {
  const avgHV = hvIntents.reduce((a, r) => a + r.sentiment * r.share, 0) / hvIntents.reduce((a, r) => a + r.share, 0);
  const avgLV = lvIntents.reduce((a, r) => a + r.sentiment * r.share, 0) / lvIntents.reduce((a, r) => a + r.share, 0);

  const gaps = commonIntents
    .map((r) => ({ intent: r.intent, gap: Math.abs(r.hv - r.lv) }))
    .sort((a, b) => b.gap - a.gap);

  // Roll-up experience metrics for the summary strip
  const sentimentGap = avgHV - avgLV; // + means HV happier than LV
  const hvNps = Math.round(avgHV * 100);
  const lvNps = Math.round(avgLV * 100);

  const summaryChips: { k: string; v: string; c: string }[] = [
    { k: "HV happiness", v: `${avgHV > 0 ? "+" : ""}${avgHV.toFixed(2)}`, c: sentimentColor(T, avgHV) },
    { k: "LV happiness", v: `${avgLV > 0 ? "+" : ""}${avgLV.toFixed(2)}`, c: sentimentColor(T, avgLV) },
    { k: "HV NPS",       v: `${hvNps > 0 ? "+" : ""}${hvNps}`, c: sentimentColor(T, avgHV) },
    { k: "LV NPS",       v: `${lvNps > 0 ? "+" : ""}${lvNps}`, c: sentimentColor(T, avgLV) },
    { k: "HV−LV gap",    v: `${sentimentGap > 0 ? "+" : ""}${sentimentGap.toFixed(2)}`, c: sentimentGap >= 0 ? T.green : T.red },
    { k: "Widest gap",   v: `${gaps[0].intent} · ${gaps[0].gap.toFixed(2)}`, c: T.red },
  ];

  const summaryStrip = (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
      justifyContent: "flex-end",
    }}>
      {summaryChips.map((chip) => (
        <div key={chip.k} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 999,
          background: `${chip.c}12`,
          borderTop: `1px solid ${chip.c}35`,
          borderRight: `1px solid ${chip.c}35`,
          borderBottom: `1px solid ${chip.c}35`,
          borderLeft: `1px solid ${chip.c}35`,
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: T.textMut }}>
            {chip.k}
          </span>
          <span style={{
            fontSize: 11.5, fontWeight: 800, color: chip.c,
            fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
          }}>
            {chip.v}
                  </span>
                </div>
      ))}
          </div>
  );

  return (
    <AIPanel
      title="Top Intents × Sentiment — HV vs LV"
      subtitle={panelSubtitle}
      accentColor={T.cyan}
      ai
      headerRight={summaryStrip}
    >
      {/* Compact segment meta — avg sentiment dials */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
        {[
          { label: "HV Customers", color: T.cyan,  count: "148K accounts", avg: avgHV, nps: hvNps, note: "Private · HNI · Mass Affluent" },
          { label: "LV Customers", color: T.amber, count: "2.41M accounts", avg: avgLV, nps: lvNps, note: "Mass Retail · Digital-only" },
        ].map((m) => {
          const avgColor = sentimentColor(T, m.avg);
          const dialPct = ((m.avg + 1) / 2) * 100; // map -1..+1 to 0..100%
          return (
            <div key={m.label} style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${m.color}10 0%, transparent 70%), ${T.card}`,
              borderTop: `1px solid ${m.color}35`,
              borderRight: `1px solid ${m.color}35`,
              borderBottom: `1px solid ${m.color}35`,
              borderLeft: `3px solid ${m.color}`,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: m.color }}>{m.label}</div>
                <div style={{ fontSize: 10.5, color: T.textMut, marginTop: 3 }}>{m.note}</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                  fontSize: 10.5, color: T.textMut,
                  fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
                }}>
                  <span>{m.count}</span>
          </div>
          </div>
              <div style={{ textAlign: "right", minWidth: 110 }}>
                <div style={{ fontSize: 9.5, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.7 }}>Happiness score</div>
                <div style={{
                  fontSize: 22, fontWeight: 800, color: avgColor,
                  fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.05, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end",
                }}>
                  <span style={{ fontSize: 18 }}>{sentimentFace(m.avg)}</span>
                  <span>{m.avg > 0 ? "+" : ""}{m.avg.toFixed(2)}</span>
      </div>
                <div style={{
                  marginTop: 4, fontSize: 10, color: T.textMut,
                  textTransform: "uppercase", letterSpacing: 0.65,
                }}>
                  NPS score <span style={{ color: avgColor, fontWeight: 800, fontFamily: "var(--mono)" }}>{m.nps > 0 ? "+" : ""}{m.nps}</span>
          </div>
                {/* Mini sentiment scale -1 → +1 */}
                <div style={{
                  marginTop: 8, position: "relative", height: 4, borderRadius: 999,
                  background: `linear-gradient(90deg, ${T.red} 0%, ${T.amber} 50%, ${T.green} 100%)`,
                  opacity: 0.6,
                }}>
                  <div style={{
                    position: "absolute", top: -3, left: `calc(${dialPct}% - 5px)`,
                    width: 10, height: 10, borderRadius: 999,
                    background: avgColor, boxShadow: `0 0 0 2px ${T.card}, 0 0 8px ${avgColor}99`,
                  }} />
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginTop: 3,
                  fontSize: 9, color: T.textMut,
                  fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
                }}>
                  <span>-1</span><span>0</span><span>+1</span>
              </div>
          </div>
          </div>
                );
              })}
        </div>

      {/* Two-column ranking tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <IntentGroupCard
          title="HV · Top Intents"
          subtitle="Ranked by share of HV contact volume"
          color={T.cyan}
          rows={hvIntents}
          T={T}
        />
        <IntentGroupCard
          title="LV · Top Intents"
          subtitle="Ranked by share of LV contact volume"
          color={T.amber}
          rows={lvIntents}
          T={T}
      />
    </div>

    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD 2 — BRAND & REPUTATION RISK
   ──────────────────────────────────────────────────────────────────────── */


const MEDIA = [
  { outlet: "This Is Money",   tone: "negative", reach: 840,  time: "2h ago",  title: "UK bank under fire for hidden EMI penalties" },
  { outlet: "Financial Times", tone: "neutral",  reach: 1200, time: "5h ago",  title: "Retail banks reassess HELOC pricing amid rate pressure" },
  { outlet: "MoneyWeek",       tone: "negative", reach: 420,  time: "9h ago",  title: "Fee policy confusion driving switching activity" },
  { outlet: "The Guardian",    tone: "negative", reach: 1800, time: "1d ago",  title: "Which? flags transparency gaps at major UK banks" },
  { outlet: "TechCrunch",      tone: "positive", reach: 620,  time: "1d ago",  title: "Budgeting tool wins UX award — rare banking bright spot" },
];

// Feature requests surfaced from voice, chat, social, app store and community forums —
// Ranjith's explicit ask: "show what conversations are uncovering… new feature requests".
const SOCIAL_CHANNEL_ORDER = ["App Store", "Play Store", "Reddit", "Trustpilot", "X (Twitter)"] as const;
type SocialChannel = (typeof SOCIAL_CHANNEL_ORDER)[number];
const SOCIAL_CHANNEL_COLORS: Record<SocialChannel, string> = {
  "App Store": "#9333EA",
  "Play Store": "#0891B2",
  Reddit: "#B45309",
  Trustpilot: "#65A30D",
  "X (Twitter)": "#64748B",
};
type FeatureRequestRow = {
  req: string;
  mentions: number;
  sentiment: number;
  channels: string;
  channelSplit: Record<SocialChannel, number>;
};
const FEATURE_REQUESTS: FeatureRequestRow[] = [
  {
    req: "Joint account in-app invites",
    mentions: 284,
    sentiment: 0.72,
    channels: "App Store · Play Store · Reddit",
    channelSplit: { "App Store": 142, "Play Store": 68, Reddit: 49, Trustpilot: 17, "X (Twitter)": 8 },
  },
  {
    req: "Savings pots / auto-rules",
    mentions: 246,
    sentiment: 0.78,
    channels: "App Store · Trustpilot · X (Twitter)",
    channelSplit: { "App Store": 124, "Play Store": 30, Reddit: 18, Trustpilot: 52, "X (Twitter)": 22 },
  },
  {
    req: "Real-time FX transfers",
    mentions: 198,
    sentiment: 0.66,
    channels: "Reddit · X (Twitter) · Play Store",
    channelSplit: { "App Store": 31, "Play Store": 44, Reddit: 69, Trustpilot: 18, "X (Twitter)": 36 },
  },
  {
    req: "Biometric re-auth on high-value txns",
    mentions: 162,
    sentiment: 0.70,
    channels: "Play Store · App Store · X (Twitter)",
    channelSplit: { "App Store": 55, "Play Store": 61, Reddit: 16, Trustpilot: 10, "X (Twitter)": 20 },
  },
  {
    req: "Investment dashboard integration",
    mentions: 141,
    sentiment: 0.64,
    channels: "App Store · Reddit · Trustpilot",
    channelSplit: { "App Store": 62, "Play Store": 22, Reddit: 34, Trustpilot: 15, "X (Twitter)": 8 },
  },
  {
    req: "Pay-by-link for small business",
    mentions: 104,
    sentiment: 0.69,
    channels: "X (Twitter) · Reddit · Trustpilot",
    channelSplit: { "App Store": 15, "Play Store": 17, Reddit: 33, Trustpilot: 19, "X (Twitter)": 20 },
  },
];

export type BrandReputationDrillVariant = RetailBrandDrillVariant;

const STERLING_VOC_CHANNEL_COLORS: Record<string, string> = {
  "App Store": "#9333EA",
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "Social/X": "#64748B",
};

const STERLING_TOPIC_TIER_COLOR: Record<string, string> = {
  "Interest removed": "#EF4444",
  "Competitor switch": "#EF4444",
  "Rate uncompetitive": "#F59E0B",
  "Primacy redirection": "#F59E0B",
  "Silent switch": "#F59E0B",
  "Primacy decay": "#E8B931",
};

type FlightPhrase = {
  phrase: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  channels: string[];
  topic: string;
};

const STERLING_FLIGHT_PHRASES: FlightPhrase[] = [
  { phrase: "No interest — 3.25% is gone", count: 186, percentage: 18.6, trend: "up", channels: ["Voice", "App Store"], topic: "Interest removed" },
  { phrase: "Moving my savings to Chase", count: 164, percentage: 16.4, trend: "up", channels: ["App Store", "Social/X"], topic: "Competitor switch" },
  { phrase: "Why would I keep money here?", count: 148, percentage: 14.8, trend: "up", channels: ["Voice"], topic: "Rate uncompetitive" },
  { phrase: "Monzo pays more on the same balance", count: 132, percentage: 13.2, trend: "up", channels: ["Social/X", "Chat"], topic: "Competitor switch" },
  { phrase: "Switching my salary over", count: 118, percentage: 11.8, trend: "up", channels: ["Voice"], topic: "Primacy redirection" },
  { phrase: "Nationwide gave me a better rate", count: 96, percentage: 9.6, trend: "up", channels: ["Social/X"], topic: "Competitor switch" },
  { phrase: "Already moved most of it out", count: 84, percentage: 8.4, trend: "up", channels: ["Voice"], topic: "Silent switch" },
  { phrase: "Cancelling my direct debits", count: 72, percentage: 7.2, trend: "up", channels: ["Chat"], topic: "Primacy decay" },
];

const STERLING_MEDIA = [
  { outlet: "This Is Money", tone: "negative" as const, reach: 840, time: "2h ago", title: "Easy-access savers move billions as rates are cut" },
  { outlet: "MoneyWeek", tone: "negative" as const, reach: 420, time: "9h ago", title: "Fee policy confusion driving switching activity" },
  { outlet: "Financial Times", tone: "neutral" as const, reach: 1200, time: "5h ago", title: "Retail banks reassess savings pricing amid rate pressure" },
  { outlet: "The Guardian", tone: "negative" as const, reach: 1800, time: "1d ago", title: "Which? flags transparency gaps at major UK banks" },
  { outlet: "TechCrunch", tone: "positive" as const, reach: 620, time: "1d ago", title: "Budgeting tool wins UX award — rare banking bright spot" },
];

const STERLING_CHANNEL_ORDER = ["App Store", "Voice", "Chat", "Email", "Social/X"] as const;
type SterlingFeatureChannel = (typeof STERLING_CHANNEL_ORDER)[number];

type SterlingFeatureRequestRow = {
  req: string;
  mentions: number;
  sentiment: number;
  channels: string;
  channelSplit: Record<SterlingFeatureChannel, number>;
};

const STERLING_FEATURE_REQUESTS: SterlingFeatureRequestRow[] = [
  {
    req: "Rate-match / save-offer on outflow intent",
    mentions: 312,
    sentiment: 0.74,
    channels: "Voice · App Store · Chat",
    channelSplit: { "App Store": 98, Voice: 142, Chat: 48, Email: 14, "Social/X": 10 },
  },
  {
    req: "Easy-Saver fast-track",
    mentions: 268,
    sentiment: 0.71,
    channels: "App Store · Voice · Email",
    channelSplit: { "App Store": 112, Voice: 86, Chat: 32, Email: 28, "Social/X": 10 },
  },
  {
    req: "Savings pots / auto-rules",
    mentions: 246,
    sentiment: 0.78,
    channels: "App Store · Chat · Social/X",
    channelSplit: { "App Store": 104, Voice: 38, Chat: 62, Email: 18, "Social/X": 24 },
  },
  {
    req: "Rate-change proactive alerts",
    mentions: 218,
    sentiment: 0.69,
    channels: "App Store · Email · Voice",
    channelSplit: { "App Store": 88, Voice: 64, Chat: 22, Email: 34, "Social/X": 10 },
  },
  {
    req: "FSCS consolidation guidance",
    mentions: 174,
    sentiment: 0.66,
    channels: "Voice · Email · Chat",
    channelSplit: { "App Store": 28, Voice: 72, Chat: 38, Email: 28, "Social/X": 8 },
  },
  {
    req: "Primary-account switch incentives",
    mentions: 156,
    sentiment: 0.72,
    channels: "Voice · App Store · Social/X",
    channelSplit: { "App Store": 42, Voice: 68, Chat: 18, Email: 12, "Social/X": 16 },
  },
];

type ChannelRiskRow = {
  name: string;
  channelColor: string;
  trend: number[];
  hot: { label: string; topic: string }[];
  note?: string;
};

const STERLING_CHANNELS_AT_RISK: ChannelRiskRow[] = [
  {
    name: "Voice",
    channelColor: STERLING_VOC_CHANNEL_COLORS.Voice,
    trend: [0.58, 0.54, 0.51, 0.48, 0.44, 0.41],
    hot: [
      { label: "RATE", topic: "Interest removed / rate cut" },
      { label: "SWITCH", topic: "Moving savings to competitor" },
      { label: "PRIMACY", topic: "Salary / primary-account redirection" },
    ],
  },
  {
    name: "Social/X",
    channelColor: STERLING_VOC_CHANNEL_COLORS["Social/X"],
    trend: [0.52, 0.48, 0.45, 0.42, 0.39, 0.36],
    hot: [
      { label: "SWITCH", topic: "Moving savings to competitor" },
      { label: "RATE", topic: "Easy-Saver rate uncompetitive" },
    ],
  },
  {
    name: "App Store",
    channelColor: STERLING_VOC_CHANNEL_COLORS["App Store"],
    trend: [0.62, 0.59, 0.56, 0.53, 0.50, 0.47],
    hot: [
      { label: "RATE", topic: "Interest removed / rate cut" },
      { label: "SWITCH", topic: "CASS switch initiated" },
    ],
  },
  {
    name: "Chat",
    channelColor: STERLING_VOC_CHANNEL_COLORS.Chat,
    trend: [0.56, 0.54, 0.52, 0.50, 0.48, 0.46],
    hot: [
      { label: "PRIMACY", topic: "Primacy decay" },
      { label: "RATE", topic: "Fair-value of savings (PRIN 2A)" },
    ],
  },
  {
    name: "Email",
    channelColor: STERLING_VOC_CHANNEL_COLORS.Email,
    trend: [0.54, 0.52, 0.50, 0.48, 0.46, 0.44],
    hot: [
      { label: "SWITCH", topic: "ISA transfer out" },
      { label: "RATE", topic: "Balance drawdown / partial exit" },
    ],
  },
];

const DEFAULT_CHANNELS_AT_RISK: ChannelRiskRow[] = [
  {
    name: "X (Twitter)", channelColor: VOC_CHANNEL_COLORS["X (Twitter)"],
    trend: [0.55, 0.50, 0.44, 0.49, 0.41, 0.36],
    hot: [
      { label: "PAY", topic: "Payment Processing Failure" },
      { label: "FEE", topic: "Fee Structure Criticism" },
      { label: "CSV", topic: "Customer Service" },
    ],
  },
  {
    name: "Play Store", channelColor: VOC_CHANNEL_COLORS["Play Store"],
    trend: [0.63, 0.58, 0.62, 0.55, 0.57, 0.52],
    hot: [
      { label: "APP", topic: "Mobile App Crashes" },
      { label: "ACC", topic: "Account Access Problems" },
      { label: "PAY", topic: "Payment Processing Failure" },
    ],
  },
  {
    name: "Trustpilot", channelColor: VOC_CHANNEL_COLORS.Trustpilot,
    trend: [0.60, 0.62, 0.56, 0.59, 0.55, 0.54],
    hot: [
      { label: "FEE", topic: "Fee Structure Criticism" },
      { label: "PAY", topic: "Payment Processing Failure" },
      { label: "CSV", topic: "Customer Service" },
    ],
  },
  {
    name: "Reddit", channelColor: VOC_CHANNEL_COLORS.Reddit,
    trend: [0.62, 0.59, 0.61, 0.57, 0.59, 0.56],
    hot: [
      { label: "ACC", topic: "Account Access Problems" },
      { label: "CSV", topic: "Customer Service" },
      { label: "CRB", topic: "Cross Border Issues" },
    ],
  },
  {
    name: "App Store", channelColor: VOC_CHANNEL_COLORS["App Store"],
    trend: [0.71, 0.73, 0.71, 0.74, 0.72, 0.74],
    hot: [{ label: "APP", topic: "Mobile App Crashes" }],
    note: "(quality praise)",
  },
];

function ChannelRiskLegend({
  T,
  channelLegend,
  riskTiers,
}: {
  T: DashboardThemeTokens;
  channelLegend: Record<string, string>;
  riskTiers: { label: string; color: string }[];
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      columnGap: 14,
      rowGap: 9,
      alignItems: "center",
      padding: "5px 7px",
      borderRadius: 10,
      background: T.elevated,
      border: `1px solid ${T.borderLight}`,
      flexShrink: 0,
      alignSelf: "flex-start",
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, color: T.textMut,
        textTransform: "uppercase", letterSpacing: 0.7,
      }}>
        Channels
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        {Object.entries(channelLegend).map(([ch, color]) => (
          <div key={ch} style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{ch}</span>
          </div>
        ))}
      </div>

      <div style={{ gridColumn: "1 / -1", height: 1, background: T.borderLight }} />

      <span style={{
        fontSize: 11, fontWeight: 700, color: T.textMut,
        textTransform: "uppercase", letterSpacing: 0.7,
      }}>
        Risk
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {riskTiers.map((chip) => (
          <div key={chip.label} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "2px 8px", borderRadius: 999,
            background: `${chip.color}14`,
            border: `1px solid ${chip.color}55`,
            whiteSpace: "nowrap",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: chip.color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: T.text, letterSpacing: 0.2 }}>{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandReputationDrillDown({
  onBack,
  variant = "default",
}: {
  onBack: () => void;
  variant?: BrandReputationDrillVariant;
}) {
  const T = useDashboardTheme();
  const isSterling = variant === "sterling-deposit-flight";
  const channelLegend = isSterling ? STERLING_VOC_CHANNEL_COLORS : VOC_CHANNEL_COLORS;
  const mediaRows = isSterling ? STERLING_MEDIA : MEDIA;
  const featureRequests = isSterling ? STERLING_FEATURE_REQUESTS : FEATURE_REQUESTS;
  const narrativePhrases = isSterling ? STERLING_FLIGHT_PHRASES : REUSED_NARRATIVE_PHRASES;
  const topicTierColor = isSterling ? STERLING_TOPIC_TIER_COLOR : TOPIC_TIER_COLOR;
  const channelsAtRisk = isSterling ? STERLING_CHANNELS_AT_RISK : DEFAULT_CHANNELS_AT_RISK;

  const renderFeatureRequestTooltip = ({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload: unknown }> }) => {
    if (!active || !payload || payload.length === 0) return null;
    const row = payload[0].payload as FeatureRequestRow | SterlingFeatureRequestRow;
    const total = Math.max(row.mentions, 1);
    const channelOrder = isSterling ? STERLING_CHANNEL_ORDER : SOCIAL_CHANNEL_ORDER;
    const channelColors: Record<string, string> = isSterling ? STERLING_VOC_CHANNEL_COLORS : SOCIAL_CHANNEL_COLORS;
    return (
      <div style={{
        minWidth: 260,
        background: "#090f1f",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: 10,
        padding: "10px 12px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.45 }}>
          {row.req}
        </div>
        <div style={{ fontSize: 10, color: T.textMut, marginBottom: 8 }}>
          Mentions by channel · total {row.mentions}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {channelOrder.map((ch) => {
            const count = row.channelSplit[ch as keyof typeof row.channelSplit] ?? 0;
            const pct = ((count / total) * 100).toFixed(1);
            return (
              <div key={ch} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: channelColors[ch], display: "inline-block" }} />
                  <span style={{ fontSize: 10.5, color: T.textSec }}>{ch}</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: channelColors[ch], fontFamily: "var(--mono)" }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RISK_TIERS = [
    { label: "Critical ≥150", color: T.red },
    { label: "High 100–149",  color: T.amber },
    { label: "Watch 50–99",   color: T.gold },
    { label: "Stable <50",    color: "#64748B" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isSterling ? 12 : 16 }}>
      {/* Header — title left · Channels/Risk legend top-right (same row as reference layout) */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "nowrap",
      }}>
        <div style={{ minWidth: 0, flex: "1 1 auto", paddingRight: 8 }}>
          <DrillPageHeader
            onBack={onBack}
            title={
              isSterling
                ? "Is our deposit base flying out?"
                : "Is the Brand at risk?"
            }
            sub={
              isSterling
                ? "Where balances are leaving and primary relationships are decaying — interest-removal flight, silent-switch precursors, and the CASS gap. Intent-voice caught before the balance clears."
                : "Real-time brand, social, review-site and media signals — where is perception eroding and what is driving it?"
            }
          />
        </div>
        <ChannelRiskLegend T={T} channelLegend={channelLegend} riskTiers={RISK_TIERS} />
      </div>

      {isSterling ? (
        <AIPanel
          title="Primacy & CASS Pulse"
          subtitle="H3 evidence — relationship decay before balances clear · switching intent leads provider CASS data by ~3 months"
          accentColor={T.red}
          ai
          aiModel="Relationship Decay"
          compact
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
          }}>
            {[
              { label: "ARPAU (YoY)", value: "£302 → £275", delta: "−£27", color: T.red },
              { label: "Retail primacy", value: "35%", delta: "−3 pts", color: T.amber },
              { label: "SME primacy", value: "56%", delta: "−2 pts", color: T.amber },
              { label: "CASS net flows", value: "Net loss", delta: "outbound", color: T.red },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: T.card,
                  border: `1px solid ${m.color}35`,
                  borderLeft: `3px solid ${m.color}`,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "var(--mono)", marginTop: 4 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.color, fontFamily: "var(--mono)", marginTop: 2 }}>
                  {m.delta}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: `${T.gold}10`,
            border: `1px solid ${T.gold}28`,
            borderLeft: `4px solid ${T.gold}`,
            fontSize: 12,
            color: T.textSec,
            lineHeight: 1.45,
          }}>
            Switching intent in voice precedes outbound transfers by ~3 months — draft save-offer for flight-risk cohort within the retention window (never auto-send).
          </div>
        </AIPanel>
      ) : null}

      {/* Row 0 — 1. Top Topics at Risk · 2. Friction Drivers · 3. Channels at Risk */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.95fr) minmax(0, 1.05fr)",
        gridAutoRows: "420px",
        gap: 16,
        alignItems: "stretch",
      }}>
        <RetailTopTopicsByVirality variant={variant} />

        {/* Card 2 — Friction Drivers (linked to top topics) */}
        <AIPanel
          title={isSterling ? "✨ Flight-Intent Verbatims" : "✨ Top Friction Drivers"}
          subtitle={
            isSterling
              ? "Flight-intent phrases extracted from voice before balances clear"
              : "Complaint phrases extracted from the top reputational topics"
          }
          accentColor="#b90abd"
          fill
        >
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {narrativePhrases.map((p, i) => {
                const tierColor = topicTierColor[p.topic] ?? "#64748B";
                const phraseChannelColors = isSterling ? STERLING_VOC_CHANNEL_COLORS : VOC_CHANNEL_COLORS;
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20px minmax(0, 1fr) auto",
                      alignItems: "center",
                      gap: 10,
                      padding: "7px 0",
                      borderBottom: i === narrativePhrases.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
                      color: "#64748B", textAlign: "right",
                    }}>
                      {i + 1}.
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 12.5, fontWeight: 600, color: T.text,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        &ldquo;{p.phrase}&rdquo;
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, color: tierColor,
                          padding: "1px 6px", borderRadius: 4,
                          background: `${tierColor}18`,
                          border: `1px solid ${tierColor}44`,
                          textTransform: "uppercase", letterSpacing: 0.3,
                        }}>
                          → {p.topic}
                        </span>
                        <span style={{ fontSize: 9.5, color: T.textMut, fontFamily: "var(--mono)" }}>
                          {p.count.toLocaleString()} · {p.percentage}%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ display: "inline-flex", gap: 3 }}>
                        {p.channels.map((ch) => (
                          <span
                            key={ch}
                            title={ch}
                            style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: phraseChannelColors[ch] ?? T.textMut,
                              display: "inline-block",
                            }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AIPanel>

        {/* Card 3 — Channels at Risk (sentiment · hot drivers · 6-week trend) */}
        {(() => {
          const tierFor = (v: number) =>
            v < 0.50 ? T.red : v < 0.60 ? T.amber : v < 0.70 ? T.gold : "#22C55E";

          const ranked = [...channelsAtRisk].sort((a, b) => a.trend[5] - b.trend[5]);

          const Sparkline = ({ data, color, id, channel }: { data: number[]; color: string; id: string; channel: string }) => {
            const chartData = data.map((v, i) => ({
              week: i === data.length - 1 ? "Now" : `W-${data.length - 1 - i}`,
              v,
            }));
            const gradId = `spark-grad-${id}`;
            const renderTip = ({ active, payload }: any) => {
              if (!active || !payload || payload.length === 0) return null;
              const d = payload[0].payload;
              return (
                <div style={{
                  background: "#0D0D0D",
                  border: `1px solid ${color}66`,
                  borderRadius: 6,
                  padding: "4px 8px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
                  fontFamily: "var(--mono)",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color }}>{d.v.toFixed(2)}</div>
                  <div style={{ fontSize: 9, color: "#94A3B8" }}>{channel} · {d.week}</div>
                </div>
              );
            };
            return (
              <ResponsiveContainer width="100%" height={32}>
                <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={color} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={1.75}
                    fill={`url(#${gradId})`}
                    isAnimationActive={false}
                    dot={false}
                    activeDot={{ r: 3, fill: color, stroke: "#0D0D0D", strokeWidth: 1 }}
                  />
                  <Tooltip
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "2 3" }}
                    content={renderTip}
                  />
                </AreaChart>
              </ResponsiveContainer>
            );
          };

          return (
            <AIPanel
              title="Channels at Risk"
              subtitle={
                isSterling
                  ? "Flight-intent sentiment by channel · 6-week trend · hot drivers: RATE · SWITCH · PRIMACY"
                  : "Sorted by current sentiment · 6-week trend"
              }
              accentColor={T.red}
              fill
            >
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                {ranked.map((c) => {
                  const now = c.trend[5];
                  const first = c.trend[0];
                  const delta = now - first;
                  const nowColor = tierFor(now);
                  const deltaColor = delta < 0 ? T.red : delta > 0 ? "#22C55E" : T.textMut;
                  const deltaSign = delta > 0 ? "+" : "";
                  return (
                    <div
                      key={c.name}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr) auto",
                        alignItems: "center",
                        gap: 12,
                        padding: "8px 2px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.channelColor, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.name}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0, width: "100%" }}>
                        <Sparkline
                          data={c.trend}
                          color={deltaColor}
                          id={c.name.replace(/[^a-z0-9]/gi, "")}
                          channel={c.name}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 15, fontFamily: "var(--mono)", fontWeight: 700, color: nowColor, lineHeight: 1 }}>
                          {now.toFixed(2)}
                        </span>
                        <span style={{ fontSize: 9.5, fontFamily: "var(--mono)", fontWeight: 700, color: deltaColor, lineHeight: 1 }}>
                          {deltaSign}{delta.toFixed(2)} over 6wks
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AIPanel>
          );
        })()}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.3fr 1fr",
        gridAutoRows: "460px",
        gap: 16,
        alignItems: "stretch",
      }}>
        <RetailMomentumHashtags variant={variant} />
        <RetailInfluencerWatchlist variant={variant} />
      </div>

      {/* Media Monitor + Customer Feature Requests side by side */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
        gridAutoRows: "380px",
        gap: 16,
        alignItems: "stretch",
      }}>
        <AIPanel title="Media Monitor" subtitle="Tier-1 outlets · weighted by reach · tone auto-classified" accentColor={T.red} fill>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0, overflowY: "auto" }}>
            {mediaRows.map((m, i) => {
              const color = m.tone === "negative" ? T.red : m.tone === "positive" ? T.green : T.textMut;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "10px 1fr 60px 70px", gap: 10, alignItems: "center",
                  padding: "9px 10px", borderRadius: 10, background: `${color}10`, border: `1px solid ${color}22`,
                }}>
                  <Newspaper size={14} color={color} />
                  <div>
                    <div style={{ fontSize: 12, color: T.text, lineHeight: 1.35 }}>{m.title}</div>
                    <div style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>{m.outlet} · {m.time}</div>
                  </div>
                  <span style={{ fontSize: 11, color: T.textSec, fontFamily: "var(--mono)", textAlign: "right" }}>{m.reach}K</span>
                  <span style={{
                    fontSize: 10, color, padding: "3px 8px", borderRadius: 999,
                    background: `${color}20`, border: `1px solid ${color}35`, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700,
                  }}>{m.tone}</span>
                </div>
              );
            })}
          </div>
        </AIPanel>

        <AIPanel
          title={isSterling ? "Top Requests for Retention Features" : "Top Requests for Features"}
          subtitle={
            isSterling
              ? "Retention and savings requests from voice, chat, app store and social — ranked by mention volume"
              : "Requests surfaced from conversations across voice, chat, app store and social — ranked by mention volume"
          }
          accentColor={T.green}
          ai
          aiModel="Request Mining"
          fill
        >
          <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureRequests} layout="vertical" margin={{ top: 6, right: 16, left: 6, bottom: 0 }}>
                <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={axisTickStyle(T)} stroke={T.borderLight} />
                <YAxis type="category" dataKey="req" tick={axisTickStyle(T)} stroke={T.borderLight} width={210} />
                <Tooltip content={renderFeatureRequestTooltip} />
                <Bar dataKey="mentions" name="Mentions" fill={T.green} radius={[0, 4, 4, 0]}>
                  {featureRequests.map((d, i) => (
                    <Cell key={i} fill={d.sentiment > 0.72 ? T.green : d.sentiment > 0.66 ? T.cyan : T.amber} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AIPanel>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD 3 — SERVICE FULFILMENT
   ──────────────────────────────────────────────────────────────────────── */

const FCR_CHANNEL_COLORS: Record<string, string> = {
  Voice:    "#E11D48",  // Deep Rose
  Chat:     "#EA580C",  // Burnt Orange
  Email:    "#0D9488",  // Teal / Pine
  "Social/X": "#22c55e",  // Green
  "App SS": "#2563EB",  // Royal Blue
};

const FCR_CH = [
  { ch: "Voice",    actual: 74, target: 80, last: 78 },
  { ch: "Chat",     actual: 62, target: 75, last: 66 },
  { ch: "Email",    actual: 58, target: 70, last: 61 },
  { ch: "Social/X", actual: 41, target: 60, last: 48 },
  { ch: "App SS",   actual: 89, target: 85, last: 86 },
];

const SLA_MATRIX = [
  { intent: "Card Replace",    Voice: 92, Chat: 94, Email: 88, "App SS": 98 },
  { intent: "Balance Query",   Voice: 88, Chat: 90, Email: 82, "App SS": 99 },
  { intent: "Fee Dispute",     Voice: 64, Chat: 58, Email: 54, "App SS": 72 },
  { intent: "Mortgage",        Voice: 72, Chat: 68, Email: 65, "App SS": 80 },
  { intent: "Onboarding KYC",  Voice: 69, Chat: 72, Email: 70, "App SS": 76 },
  { intent: "Acct Closure",    Voice: 81, Chat: 76, Email: 74, "App SS": 83 },
];
const STERLING_H4_SLA_MATRIX = [
  { intent: "KYC verification",          Voice: 72, Chat: 74, Email: 68, "App SS": 81 },
  { intent: "Source-of-wealth refresh",  Voice: 58, Chat: 61, Email: 55, "App SS": 64 },
  { intent: "Proof-of-trading (SME)",    Voice: 54, Chat: 57, Email: 52, "App SS": 59 },
  { intent: "ID re-verification",        Voice: 78, Chat: 80, Email: 76, "App SS": 85 },
  { intent: "Entity / PSC check (SME)",  Voice: 48, Chat: 51, Email: 46, "App SS": 52 },
  { intent: "Account activation",        Voice: 88, Chat: 90, Email: 86, "App SS": 94 },
];
const SLA_CHANNELS = ["Voice", "Chat", "Email", "App SS"] as const;

const INTENT_TOP = [
  { intent: "App Balance",         sla: 99, fcr: 97, wow: +2 },
  { intent: "Card Replace",        sla: 94, fcr: 92, wow: +1 },
  { intent: "Password Reset",      sla: 93, fcr: 95, wow: +2 },
];
const STERLING_H4_INTENT_TOP = [
  { intent: "Account activation",        sla: 94, fcr: 92, wow: +2 },
  { intent: "KYC verification",          sla: 88, fcr: 86, wow: +1 },
  { intent: "ID re-verification",        sla: 85, fcr: 84, wow: +2 },
];
// Each bottom intent ties back to the stage in the Bottleneck Detector that is
// driving its SLA failure — both must read red end-to-end (causal chain).
const INTENT_BOTTOM = [
  { intent: "Fee Dispute",         sla: 58, fcr: 52, wow: -6, bottleneck: "KYC API",       bottleneckActual: 4.2, bottleneckSla: 1   },
  { intent: "HELOC Enquiry",       sla: 63, fcr: 59, wow: -4, bottleneck: "BPO Evidence",  bottleneckActual: 4.8, bottleneckSla: 2   },
  { intent: "Mortgage Servicing",  sla: 66, fcr: 61, wow: -3, bottleneck: "Resolve",       bottleneckActual: 5.2, bottleneckSla: 4   },
];
const STERLING_H4_INTENT_BOTTOM = [
  { intent: "Source-of-wealth refresh", sla: 41, fcr: 38, wow: -8, bottleneck: "Source-of-wealth refresh", bottleneckActual: 4.6, bottleneckSla: 2 },
  { intent: "Entity / PSC check (SME)", sla: 48, fcr: 44, wow: -6, bottleneck: "Manual entity check",      bottleneckActual: 5.1, bottleneckSla: 3 },
  { intent: "Proof-of-trading (SME)",   sla: 52, fcr: 49, wow: -5, bottleneck: "Manual entity check",      bottleneckActual: 4.8, bottleneckSla: 3 },
];

// Decision tree replaces the old funnel (which wrongly ended at "Regulator/FOS").
// Per feedback: retail banking transactions never hit a regulator at transaction
// level — only firm-level aggregates do. Flow is:
//   Total contacts → { Bot, Human } → { Closed, Escalated } on each branch
//   Escalations have their own SLA + a fraud/compliance flag subset.
const CONTACT_TREE = {
  total: 58000,
  bot: {
    total:     21_900,
    closed:    18_140,   // closed by bot, no escalation
    escalated:  3_760,   // bot handed off to human
  },
  human: {
    total:     36_100,
    closed:    31_020,   // resolved by agent
    escalated:  5_080,   // agent escalated upward
  },
  escalation: {
    total:          8_840,   // bot.escalated + human.escalated
    slaAttainment:     62,   // % of escalations closed within SLA
    slaBreached:    3_360,   // ~ 38% of total
    fraudCompliance:  780,   // flagged as "Potential fraud / compliance support"
  },
};

const PROCESS_STAGES = [
  { stage: "Intake",          sla: 2,   actual: 2.3, status: "ok" },
  { stage: "KYC API",         sla: 1,   actual: 4.2, status: "critical" },
  { stage: "BPO Evidence",    sla: 2,   actual: 4.8, status: "critical" },
  { stage: "Route / Assign",  sla: 0.5, actual: 1.1, status: "warn" },
  { stage: "Resolve",         sla: 4,   actual: 5.2, status: "warn" },
  { stage: "Close & Confirm", sla: 0.5, actual: 0.6, status: "ok" },
];

// Back-office queue depth — each team has its own SLA threshold (days).
// Buckets on the right of the SLA cut-off are amber (breached) or red (far-breach).
// The meeting ask: "how much am I over / under SLA", not just raw counts.
type QueueRow = {
  team: string;
  slaDays: number;                 // SLA target in days — dotted line reference
  "0-1d": number;
  "1-3d": number;
  "3-7d": number;
  ">7d":  number;
};
const BACKOFFICE_QUEUE: QueueRow[] = [
  { team: "KYC / Onboarding", slaDays: 3, "0-1d": 142, "1-3d": 89,  "3-7d": 46, ">7d": 21 },
  { team: "Fraud Ops",        slaDays: 7, "0-1d": 188, "1-3d": 74,  "3-7d": 32, ">7d": 11 },
  { team: "Mortgage Ops",     slaDays: 3, "0-1d": 96,  "1-3d": 124, "3-7d": 78, ">7d": 52 },
  { team: "Card Ops",         slaDays: 1, "0-1d": 208, "1-3d": 61,  "3-7d": 24, ">7d": 8  },
  { team: "AML / Sanctions",  slaDays: 3, "0-1d": 72,  "1-3d": 38,  "3-7d": 19, ">7d": 9  },
  { team: "Payments Invst.",  slaDays: 3, "0-1d": 118, "1-3d": 67,  "3-7d": 30, ">7d": 14 },
];
const STERLING_H4_ONBOARDING_QUEUE: QueueRow[] = [
  { team: "In KYC review",              slaDays: 3, "0-1d": 156, "1-3d": 98,  "3-7d": 52, ">7d": 28 },
  { team: "Source-of-wealth pending",   slaDays: 3, "0-1d": 84,  "1-3d": 142, "3-7d": 118, ">7d": 46 },
  { team: "Manual entity check",        slaDays: 3, "0-1d": 62,  "1-3d": 88,  "3-7d": 74, ">7d": 38 },
  { team: "Awaiting proof-of-trading",  slaDays: 3, "0-1d": 48,  "1-3d": 76,  "3-7d": 62, ">7d": 34 },
  { team: "Ready to approve",           slaDays: 3, "0-1d": 214, "1-3d": 42,  "3-7d": 12, ">7d": 4  },
];

export type ServiceFulfilmentDrillVariant = "default" | "sterling-h4-acquisition";

// For a given SLA (days), return whether each aging bucket is within / breached /
// critical. This lets us colour cells consistently and narrate the breach story.
function bucketTone(bucket: "0-1d" | "1-3d" | "3-7d" | ">7d", slaDays: number) {
  const maxDay = bucket === "0-1d" ? 1 : bucket === "1-3d" ? 3 : bucket === "3-7d" ? 7 : 999;
  if (maxDay <= slaDays) return "ok" as const;                  // still within SLA
  if (maxDay <= slaDays + 4) return "warn" as const;            // breached but not far
  return "bad" as const;                                        // far-breached
}

/* Decision tree for the Escalation / Contact Resolution panel.
 *   Total contacts
 *        ├─ Bot       ─┬─ Closed by bot
 *        │             └─ Escalated
 *        └─ Human     ─┬─ Closed by agent
 *                      └─ Escalated
 *   + aggregate escalation SLA + fraud/compliance hand-off tag.
 * Rendered as nested flex boxes with dotted connector rails — no chart lib.
 */
function ContactResolutionTree({
  tree, T,
}: {
  tree: typeof CONTACT_TREE;
  T: DashboardThemeTokens;
}) {
  const connector = `1px dashed ${T.borderLight}`;
  const pct = (part: number, whole: number) => whole > 0 ? Math.round((part / whole) * 100) : 0;

  const Node = ({
    label, value, accent, tone = "primary", sub,
  }: {
    label: string; value: number; accent: string;
    tone?: "primary" | "secondary"; sub?: string;
  }) => (
    <div style={{
      background: tone === "primary" ? `${accent}18` : `${accent}0e`,
      border: `1px solid ${accent}${tone === "primary" ? "55" : "30"}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 10,
      padding: "8px 12px",
      minWidth: 120,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{
        fontSize: tone === "primary" ? 18 : 15,
        fontWeight: 800, color: accent, fontFamily: "var(--mono)", lineHeight: 1.1, marginTop: 3,
      }}>
        {value.toLocaleString()}
      </div>
      {sub ? (
        <div style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>{sub}</div>
      ) : null}
    </div>
  );

  // One parent branch with its two leaves (closed / escalated).
  const Branch = ({
    parentLabel, parentValue, closedValue, escalatedValue, accent,
  }: {
    parentLabel: string; parentValue: number;
    closedValue: number; escalatedValue: number;
    accent: string;
  }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
      <Node
        label={parentLabel}
        value={parentValue}
        accent={accent}
        sub={`${pct(parentValue, tree.total)}% of total`}
      />
      {/* Vertical rail from parent to leaf-split */}
      <div style={{ width: 0, height: 14, borderLeft: connector }} />
      {/* Horizontal rail spanning the two leaves */}
      <div style={{ width: "82%", height: 0, borderTop: connector }} />
      {/* Two leaves */}
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: 8, marginTop: -10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ width: 0, height: 10, borderLeft: connector }} />
          <Node
            label="Closed"
            value={closedValue}
            accent={T.green}
            tone="secondary"
            sub={`${pct(closedValue, parentValue)}% of ${parentLabel.toLowerCase()}`}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ width: 0, height: 10, borderLeft: connector }} />
          <Node
            label="Escalated"
            value={escalatedValue}
            accent={T.red}
            tone="secondary"
            sub={`${pct(escalatedValue, parentValue)}% of ${parentLabel.toLowerCase()}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Root */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Node label="Total contacts" value={tree.total} accent={T.cyan} />
      </div>
      {/* Rail from root down to the Bot/Human split */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 0, height: 14, borderLeft: connector }} />
        <div style={{ width: "70%", height: 0, borderTop: connector }} />
      </div>

      {/* Two branches: Bot vs Human */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: -10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ width: 0, height: 10, borderLeft: connector }} />
          <Branch
            parentLabel="Bot"
            parentValue={tree.bot.total}
            closedValue={tree.bot.closed}
            escalatedValue={tree.bot.escalated}
            accent={T.cyan}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ width: 0, height: 10, borderLeft: connector }} />
          <Branch
            parentLabel="Human"
            parentValue={tree.human.total}
            closedValue={tree.human.closed}
            escalatedValue={tree.human.escalated}
            accent={T.purple}
          />
        </div>
      </div>

      {/* Escalation aggregate summary — SLA attainment + fraud/compliance tag */}
      <div style={{
        marginTop: 6,
        padding: "12px 14px", borderRadius: 10,
        background: `${T.red}10`, border: `1px solid ${T.red}35`, borderLeft: `3px solid ${T.red}`,
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>Escalations</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", lineHeight: 1.1, marginTop: 3 }}>
              {tree.escalation.total.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>
              {pct(tree.escalation.total, tree.total)}% of all contacts
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>Escalation SLA</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 }}>
              <span style={{
                fontSize: 18, fontWeight: 800,
                color: tree.escalation.slaAttainment >= 80 ? T.green : tree.escalation.slaAttainment >= 65 ? T.amber : T.red,
                fontFamily: "var(--mono)", lineHeight: 1.1,
              }}>
                {tree.escalation.slaAttainment}%
              </span>
              <span style={{ fontSize: 10, color: T.textMut }}>closed within SLA</span>
            </div>
            <div style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>
              {tree.escalation.slaBreached.toLocaleString()} breached
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>Fraud / compliance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 9px", borderRadius: 999,
                background: `${T.amber}22`, border: `1px solid ${T.amber}55`,
                color: T.amber, fontSize: 11, fontWeight: 700, fontFamily: "var(--mono)",
              }}>
                {tree.escalation.fraudCompliance.toLocaleString()}
              </span>
              <span style={{ fontSize: 10.5, color: T.textMut }}>
                Potential fraud / compliance support required
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingQueueDepthPanel({
  T,
  queue,
}: {
  T: DashboardThemeTokens;
  queue: QueueRow[];
}) {
  const buckets = ["0-1d", "1-3d", "3-7d", ">7d"] as const;
  const bucketLabel: Record<typeof buckets[number], string> = {
    "0-1d": "0–1d",
    "1-3d": "1–3d",
    "3-7d": "3–7d",
    ">7d": ">7d",
  };

  const toneColor = (tone: ReturnType<typeof bucketTone>) =>
    tone === "ok" ? T.green : tone === "warn" ? T.amber : T.red;

  return (
    <AIPanel
      title="Onboarding Queue Depth"
      subtitle="612 accounts past 3-day SLA · 38% source-of-wealth refresh"
      accentColor={T.amber}
      fill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {queue.map((row) => {
          const total = buckets.reduce((sum, b) => sum + row[b], 0);
          return (
            <div key={row.team}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{row.team}</span>
                <span style={{ fontSize: 10, color: T.textMut, fontFamily: "var(--mono)" }}>
                  {total.toLocaleString()} · SLA {row.slaDays}d
                </span>
              </div>
              <div style={{ display: "flex", height: 14, borderRadius: 6, overflow: "hidden", gap: 1 }}>
                {buckets.map((b) => {
                  const count = row[b];
                  if (count <= 0) return null;
                  const tone = bucketTone(b, row.slaDays);
                  const color = toneColor(tone);
                  return (
                    <div
                      key={b}
                      title={`${row.team} · ${bucketLabel[b]}: ${count}`}
                      style={{
                        flex: count,
                        background: `${color}${tone === "ok" ? "88" : tone === "warn" ? "aa" : "cc"}`,
                        minWidth: 4,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.borderLight}` }}>
        {([
          { tone: "ok" as const, label: "Within SLA" },
          { tone: "warn" as const, label: "Breached" },
          { tone: "bad" as const, label: "Far breach" },
        ]).map((item) => (
          <div key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{
              width: 14, height: 14, borderRadius: 4, display: "inline-block",
              background: `${toneColor(item.tone)}88`,
              border: `1px solid ${toneColor(item.tone)}55`,
            }} />
            <span style={{ fontSize: 10, color: T.textMut }}>{item.label}</span>
          </div>
        ))}
      </div>
    </AIPanel>
  );
}

function ServiceFulfilmentBackOfficeQueueDepth({
  T,
  variant = "default",
}: {
  T: DashboardThemeTokens;
  variant?: ServiceFulfilmentDrillVariant;
}) {
  const isH4 = variant === "sterling-h4-acquisition";
  if (isH4) {
    return <OnboardingQueueDepthPanel T={T} queue={STERLING_H4_ONBOARDING_QUEUE} />;
  }

  const channels = ["email", "ticket", "chat", "voice"] as const;
  const channelIcons = {
    email: Mail,
    ticket: Ticket,
    chat: MessageSquare,
    voice: Phone,
  } as const;
  const channelIconColors = {
    email: "#bfdbfe",
    ticket: "#e9d5ff",
    chat: "#bbf7d0",
    voice: "#fecaca",
  } as const;
  const heatmapCounts: Record<typeof channels[number], Record<typeof channels[number], number>> = {
    email: { email: 0, ticket: 2, chat: 1, voice: 0 },
    ticket: { email: 1, ticket: 1, chat: 0, voice: 1 },
    chat: { email: 0, ticket: 1, chat: 1, voice: 1 },
    voice: { email: 0, ticket: 1, chat: 0, voice: 0 },
  };

  let maxCount = 0;
  channels.forEach((origin) => {
    channels.forEach((target) => {
      maxCount = Math.max(maxCount, heatmapCounts[origin][target]);
    });
  });

  const heatTone = (count: number) => {
    if (count <= 0) return { bg: "transparent", glow: "none" };
    const ratio = count / Math.max(1, maxCount);
    if (ratio >= 0.85) return { bg: "rgba(223,22,22,0.80)", glow: "0 0 12px rgba(223,22,22,0.96), 0 0 6px rgba(223,22,22,0.96)" };
    if (ratio >= 0.45) return { bg: "rgba(223,131,22,0.68)", glow: "0 0 12px rgba(223,131,22,0.81), 0 0 6px rgba(223,131,22,0.81)" };
    return { bg: "rgba(43,223,22,0.42)", glow: "0 0 10px rgba(43,223,22,0.62), 0 0 5px rgba(43,223,22,0.62)" };
  };

  return (
    <AIPanel
      title="Cross channel Escalation"
      subtitle="Customer escalation flow visualization"
      accentColor={T.amber}
      fill
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 700, color: T.textSec }}>
                Origin Channels
              </th>
              {channels.map((target) => {
                const Icon = channelIcons[target];
                return (
                  <th key={target} style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 700, color: T.textSec }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <Icon size={16} style={{ color: channelIconColors[target] }} />
                      <span style={{ textTransform: "capitalize", fontSize: 11 }}>{target}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {channels.map((origin) => {
              const OriginIcon = channelIcons[origin];
              return (
                <tr key={origin}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <OriginIcon size={16} style={{ color: channelIconColors[origin] }} />
                      <span style={{ textTransform: "capitalize", fontSize: 12, fontWeight: 600, color: T.text }}>{origin}</span>
                    </div>
                  </td>
                  {channels.map((target) => {
                    const count = heatmapCounts[origin][target];
                    const tone = heatTone(count);
                    return (
                      <td
                        key={`${origin}-${target}`}
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          background: tone.bg,
                          boxShadow: tone.glow,
                          borderRadius: 6,
                        }}
                      >
                        {count > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{count}</span>
                            <span style={{ fontSize: 10, color: T.textSec }}>customers</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: T.textMut }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AIPanel>
  );
}

function ServiceFulfilmentIntentLeaderboard({ T }: { T: DashboardThemeTokens }) {
  const rowGrid = "1fr 42px 42px 48px" as const;
  return (
    <AIPanel
      title="Intent Leaderboard"
      subtitle="Bottom intents trace through to the bottleneck KPI · both read red"
      accentColor={T.cyan}
      compact
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 9, color: T.green, textTransform: "uppercase", letterSpacing: 0.55, marginBottom: 4 }}>Top 3</div>
        {INTENT_TOP.map((i) => (
          <div key={i.intent} style={{
            display: "grid", gridTemplateColumns: rowGrid, gap: 6, alignItems: "center",
            padding: "5px 8px", marginBottom: 3, borderRadius: 6,
            background: `${T.green}12`, border: `1px solid ${T.green}25`,
          }}>
            <span style={{ fontSize: 11, color: T.text, lineHeight: 1.25 }}>{i.intent}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: T.green, fontFamily: "var(--mono)", textAlign: "right" }}>{i.sla}%</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: T.green, fontFamily: "var(--mono)", textAlign: "right" }}>{i.fcr}%</span>
            <span style={{
              fontSize: 10, fontWeight: 800, color: T.green, fontFamily: "var(--mono)", textAlign: "right",
            }}>
              {i.wow > 0 ? "↑" : "↓"}{Math.abs(i.wow)}%
            </span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 9, color: T.red, textTransform: "uppercase", letterSpacing: 0.55, marginBottom: 4 }}>Bottom 3 · drill-through to bottleneck</div>
        {INTENT_BOTTOM.map((i) => (
          <div key={i.intent} style={{
            padding: "5px 8px", marginBottom: 4, borderRadius: 6,
            background: `${T.red}12`, border: `1px solid ${T.red}35`,
            borderLeft: `3px solid ${T.red}`,
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: rowGrid, gap: 6, alignItems: "center",
            }}>
              <span style={{ fontSize: 11, color: T.text, fontWeight: 600, lineHeight: 1.25 }}>{i.intent}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", textAlign: "right" }}>{i.sla}%</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", textAlign: "right" }}>{i.fcr}%</span>
              <span style={{
                fontSize: 10, fontWeight: 800, color: T.red, fontFamily: "var(--mono)", textAlign: "right",
              }}>
                ↓{Math.abs(i.wow)}%
              </span>
            </div>
            <div style={{
              marginTop: 4, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
              fontSize: 9.5, color: T.textMut, lineHeight: 1.35,
            }}>
              <span style={{ color: T.textMut }}>Bottleneck</span>
              <span style={{ color: T.red }}>→</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "1px 6px", borderRadius: 999,
                background: `${T.red}22`, border: `1px solid ${T.red}55`,
                color: T.red, fontWeight: 700, fontFamily: "var(--mono)",
              }}>
                {i.bottleneck}
                <span style={{ color: T.red, opacity: 0.85 }}>· {i.bottleneckActual}h / SLA {i.bottleneckSla}h</span>
              </span>
              <span style={{ color: T.textMut, marginLeft: "auto" }}>WoW</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: rowGrid, fontSize: 8, color: T.textMut, padding: "0 8px", marginTop: 2 }}>
        <span>Intent</span>
        <span style={{ textAlign: "right" }}>SLA</span>
        <span style={{ textAlign: "right" }}>FCR</span>
        <span style={{ textAlign: "right" }}>WoW</span>
      </div>
    </AIPanel>
  );
}

function ConstraintLeakHeroPanel({ T }: { T: DashboardThemeTokens }) {
  return (
    <AIPanel
      title="Constraint Leak — Growth Lost to Controls"
      subtitle="Post-fine KYC tightening · viable acquisition suppressed"
      accentColor={T.red}
      ai
      aiModel="Acquisition Leak"
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "var(--mono)" }}>
          Growth lost £2.3M
        </span>
        <span style={{ fontSize: 14, color: T.textMut }}>·</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: T.amber }}>
          ~900 viable applicants suppressed
        </span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: T.textSec, marginBottom: 6 }}>Decline split</div>
        <div style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "38%", background: T.amber }} title="Genuine crime-constraint 38%" />
          <div style={{ width: "62%", background: T.red }} title="Viable-but-rejected 62%" />
        </div>
        <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>
          Genuine crime-constraint <strong style={{ color: T.amber }}>38%</strong>
          {" · "}
          Viable-but-rejected <strong style={{ color: T.red }}>62%</strong>
        </div>
      </div>

      <div style={{
        padding: "10px 12px", borderRadius: 10,
        background: `${T.cyan}10`, border: `1px solid ${T.cyan}28`,
        marginBottom: 12, fontSize: 12, color: T.textSec,
      }}>
        <strong style={{ color: T.cyan }}>CFO evidence:</strong>{" "}
        SME openings more than tripled in April once constraints eased.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
        {[
          "Rejected, no reason — prove I already trade.",
          "Sent my accounts twice, still turned away.",
        ].map((quote) => (
          <div
            key={quote}
            style={{
              padding: "10px 12px", borderRadius: 10,
              background: T.elevated, border: `1px solid ${T.borderLight}`,
              borderLeft: `3px solid ${T.red}`,
              fontSize: 12, color: T.textSec, fontStyle: "italic",
            }}
          >
            &ldquo;{quote}&rdquo;
          </div>
        ))}
      </div>

      <div style={{
        padding: "10px 12px", borderRadius: 10,
        background: `${T.gold}10`, border: `1px solid ${T.gold}28`,
        borderLeft: `4px solid ${T.gold}`,
        fontSize: 12, color: T.textSec, marginBottom: 10,
      }}>
        <strong style={{ color: T.gold }}>Action:</strong>{" "}
        Draft criteria-calibration brief separating genuine crime-constraint declines from
        viable-but-rejected (never auto-approve).
      </div>

      <div style={{ fontSize: 10, color: T.textMut, fontStyle: "italic" }}>
        Conduct freeze/closure slice routes to the CRO underneath as depth.
      </div>
    </AIPanel>
  );
}

export function ServiceFulfilmentDrillDown({
  onBack,
  variant = "default",
}: {
  onBack: () => void;
  variant?: ServiceFulfilmentDrillVariant;
}) {
  const T = useDashboardTheme();
  const isH4 = variant === "sterling-h4-acquisition";
  const slaMatrix = isH4 ? STERLING_H4_SLA_MATRIX : SLA_MATRIX;
  const intentColWidth = isH4 ? 168 : 120;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title={
          isH4
            ? "Are we losing viable new customers?"
            : "How is our Service delivery?"
        }
        sub={
          isH4
            ? "Where post-fine KYC tightening suppresses viable acquisition — viable-but-rejected applicants, the growth lost to controls, and the onboarding queue that holds it up."
            : "Which channels, intents and stages are breaking SLA, FCR and AHT?"
        }
      />

      {isH4 ? <ConstraintLeakHeroPanel T={T} /> : null}

      <RetailSLAPerformanceOverview variant={isH4 ? "retail_h4" : "default"} />

      <RetailIntentPressureAlerts variant={isH4 ? "retail_h4" : "default"} />

      <div style={{
        background: "rgba(10,10,10,0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 20,
      }}>
        <IntentScoreHeatmap isDarkMode />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
        <ServiceFulfilmentBackOfficeQueueDepth T={T} variant={variant} />

        <AIPanel
          title={isH4 ? "Onboarding Stage Heatmap" : "SLA Heatmap"}
          subtitle={
            isH4
              ? "Onboarding stage × channel · intensity = approval-time SLA / drop-off"
              : "Intent × channel · intensity = compliance gap"
          }
          accentColor={T.red}
          fill
        >
          <div style={{ display: "grid", gridTemplateColumns: `${intentColWidth}px repeat(4, 1fr)`, gap: 4 }}>
            <div />
            {SLA_CHANNELS.map((c) => (
              <div key={c} style={{ fontSize: 10, color: T.textMut, textAlign: "center", fontFamily: "var(--mono)" }}>{c}</div>
            ))}
            {slaMatrix.map((row) => (
              <Fragment key={row.intent}>
                <div style={{ fontSize: 11, color: T.textSec, alignSelf: "center", lineHeight: 1.25 }}>{row.intent}</div>
                {SLA_CHANNELS.map((c) => {
                  const v = row[c];
                  const color = v >= 90 ? T.green : v >= 75 ? T.amber : T.red;
                  const intensity = v >= 90 ? "44" : v >= 80 ? "66" : v >= 70 ? "88" : "cc";
                  return (
                    <div
                      key={`${row.intent}-${c}`}
                      title={`${row.intent} · ${c}: ${v}% SLA`}
                      style={{
                        background: `${color}${intensity}`, border: `1px solid ${color}55`, borderRadius: 6,
                        height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: T.text, fontFamily: "var(--mono)",
                        cursor: "pointer", transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {v}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.borderLight}` }}>
            {[
              { color: T.green, intensity: "44", label: "≥ 90% — On Track" },
              { color: T.amber, intensity: "66", label: "75–89% — At Risk" },
              { color: T.red, intensity: "cc", label: "< 75% — Breaching" },
            ].map((item) => (
              <div key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 14, height: 14, borderRadius: 4, display: "inline-block",
                    background: `${item.color}${item.intensity}`,
                    border: `1px solid ${item.color}55`,
                  }}
                />
                <span style={{ fontSize: 10, color: T.textMut }}>{item.label}</span>
              </div>
            ))}
          </div>
        </AIPanel>

      </div>

    </div>
  );
}
