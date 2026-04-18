"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, Sparkles, Newspaper } from "lucide-react";
import {
  Line,
  BarChart, Bar,
  Area,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";

// Reused existing components from across the codebase (Customer Happiness drill-down only)
import { RetailFCIKPICards } from "./RetailFCIKPICards";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { fciClusters } from "@/lib/fci-lib/fciData";
import { NarrativeLens } from "@/components/paingradation/NarrativeLens";
import { CrossChannelToneIntelligenceCard } from "@/components/unified/intelligence/CrossChannelToneIntelligenceCard";
import { IntentScoreHeatmap } from "@/components/FCI/IntentScoreHeatmap";
import { TopicBubbleMap } from "@/components/social/TopicBubbleMap";
// Brand & Reputation — role-based local copies (self-contained mock data)
import { RetailTopTopicsByVirality } from "./RetailTopTopicsByVirality";
import { RetailMomentumHashtags } from "./RetailMomentumHashtags";
import { RetailInfluencerWatchlist } from "./RetailInfluencerWatchlist";
import { RetailViolationsAndRiskAlerts } from "./RetailViolationsAndRiskAlerts";
import { RetailComplianceHealth } from "./RetailComplianceHealth";
import { RetailCrossChannelInteractionBreakdownAudit } from "./RetailCrossChannelInteractionBreakdownAudit";
import { RetailCrossChannelEmotionShockboard } from "./RetailCrossChannelEmotionShockboard";
import { RetailIntentPressureAlerts } from "./RetailIntentPressureAlerts";
import { RetailEscalationRiskMonitor } from "./RetailEscalationRiskMonitor";
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
 * Used as the first element of each Screen 1 drill-down (Customer Happiness,
 * Brand & Reputation, Service Fulfilment).
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
  title, subtitle, children, accentColor, minHeight, ai = false, aiModel, headerRight, fill = false, compact = false,
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
 * Sentiment-aware gradient for the share bar.
 * - Positive sentiment  → green → lime (no yellow, no red)
 * - Mild negative       → green → yellow-green
 * - Moderate negative   → green → amber
 * - Severe negative     → green → amber → red
 */
function sentimentBarGradient(T: DashboardThemeTokens, s: number) {
  if (s >=  0.2) return `linear-gradient(90deg, ${T.green} 0%, #84cc16 100%)`;
  if (s >=  0)   return `linear-gradient(90deg, ${T.green} 0%, #a3e635 100%)`;
  if (s >= -0.3) return `linear-gradient(90deg, ${T.green} 0%, #bef264 60%, ${T.amber} 100%)`;
  if (s >= -0.5) return `linear-gradient(90deg, ${T.green} 0%, ${T.amber} 100%)`;
  return `linear-gradient(90deg, ${T.green} 0%, ${T.amber} 55%, ${T.red} 100%)`;
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

// HNI broken out into 3 tiers — directly requested in the meeting
// ("can we see churn risk for three HNIs"). Deposits in £M, happiness as %.
const HNI_TIERS = [
  { tier: "H1  · £1M+",     happy: 44, neutral: 26, unhappy: 30, deposits: 184, accounts: 312 },
  { tier: "H2  · £500K–1M", happy: 51, neutral: 24, unhappy: 25, deposits: 276, accounts: 624 },
  { tier: "H3  · £250–500K",happy: 58, neutral: 22, unhappy: 20, deposits: 312, accounts: 1085 },
];

// Vulnerability indicators surfaced by an NLP model from live conversations —
// maps to FCA Consumer Duty requirements (bereavement, financial difficulty, health).
// ─── Mock data adapters for reused existing components ───────────────────────
const REUSED_NARRATIVE_PHRASES = [
  { phrase: "Why is the fee on my account?", count: 1420, percentage: 18.4, trend: "up" as const },
  { phrase: "Payment didn't go through", count: 1180, percentage: 15.3, trend: "up" as const },
  { phrase: "Can't log in to the app", count: 1060, percentage: 13.8, trend: "up" as const },
  { phrase: "Card was declined again", count: 910, percentage: 11.8, trend: "stable" as const },
  { phrase: "Still waiting on my refund", count: 820, percentage: 10.6, trend: "up" as const },
  { phrase: "Hidden charges on my statement", count: 680, percentage: 8.8, trend: "up" as const },
  { phrase: "Nobody called me back", count: 560, percentage: 7.3, trend: "stable" as const },
  { phrase: "Transfer stuck for 3 days", count: 450, percentage: 5.8, trend: "down" as const },
  { phrase: "Agent couldn't resolve", count: 380, percentage: 4.9, trend: "stable" as const },
  { phrase: "I've called 4 times now", count: 270, percentage: 3.5, trend: "down" as const },
];



// Coordinates spread out so bubbles don't cluster in the upper-right quadrant.
// Volumes drive bubble size (see ZAxis range passed below).
const REUSED_TOPIC_BUBBLES = [
  { topic: "Fee Disputes",  volume: 1240, sentiment: -0.72, businessImpact: 88, resolutionDifficulty: 70, mentions: 1240, sampleQuotes: ["Why is this charge on my account?", "Never told me there was a fee"] },
  { topic: "App Login",     volume: 1060, sentiment: -0.61, businessImpact: 74, resolutionDifficulty: 28, mentions: 1060, sampleQuotes: ["Cannot login after update", "Face ID broken"] },
  { topic: "KYC Delays",    volume:  920, sentiment: -0.48, businessImpact: 56, resolutionDifficulty: 58, mentions:  920, sampleQuotes: ["Waiting 9 days for KYC"] },
  { topic: "Card Declines", volume:  780, sentiment: -0.33, businessImpact: 46, resolutionDifficulty: 40, mentions:  780, sampleQuotes: ["Card declined at ATM abroad"] },
  { topic: "HNI Wealth",    volume:  410, sentiment: -0.21, businessImpact: 94, resolutionDifficulty: 86, mentions:  410, sampleQuotes: ["RM unreachable for 2 weeks"] },
  { topic: "Branch Wait",   volume:  520, sentiment:  0.12, businessImpact: 30, resolutionDifficulty: 62, mentions:  520, sampleQuotes: ["Branch was empty but still slow"] },
  { topic: "Rewards",       volume:  280, sentiment:  0.54, businessImpact: 18, resolutionDifficulty: 22, mentions:  280, sampleQuotes: ["Love the new cashback tier"] },
];

// ─── Top intents × sentiment · HV vs LV (first block in drill-down) ────────
type IntentRow = {
  intent: string;
  share: number;      // % of that segment's contact volume
  volume: number;     // absolute contacts / month
  sentiment: number;  // -1..+1
  delta: number;      // sentiment delta vs prior 4 weeks
  sampleQuote: string;
};

const HV_INTENTS: IntentRow[] = [
  { intent: "Wealth / Investment Advice",    share: 24, volume: 3820, sentiment: -0.58, delta: -0.14, sampleQuote: "My RM hasn't called me back in 3 weeks." },
  { intent: "Fee & Charge Disputes",         share: 19, volume: 3020, sentiment: -0.64, delta: -0.08, sampleQuote: "Why am I paying £45 when I'm a Private client?" },
  { intent: "Mortgage / Large Loan",         share: 14, volume: 2230, sentiment: -0.28, delta: -0.05, sampleQuote: "Offer expired while you kept asking for docs." },
  { intent: "Card Declines (Travel / FX)",   share: 11, volume: 1750, sentiment: -0.41, delta: -0.10, sampleQuote: "Card blocked in Dubai, no one answered." },
  { intent: "Relationship Manager Access",   share: 10, volume: 1590, sentiment: -0.52, delta: -0.17, sampleQuote: "Three different RMs in six months." },
  { intent: "Complaint Escalation",          share: 8,  volume: 1270, sentiment: -0.71, delta: -0.12, sampleQuote: "I've escalated this twice already." },
  { intent: "Tax / Statement Requests",      share: 8,  volume: 1270, sentiment:  0.12, delta:  0.02, sampleQuote: "Quick and polite service, thanks." },
  { intent: "Rewards / Concierge",           share: 6,  volume:  960, sentiment:  0.38, delta:  0.04, sampleQuote: "Loved the airport lounge upgrade." },
];

const LV_INTENTS: IntentRow[] = [
  { intent: "App Login & Authentication",    share: 26, volume: 9840, sentiment: -0.56, delta: -0.11, sampleQuote: "Face ID broken after the update." },
  { intent: "Card Declines (Everyday)",      share: 21, volume: 7950, sentiment: -0.62, delta: -0.15, sampleQuote: "Declined at Tesco in front of everyone." },
  { intent: "Fee Disputes (Overdraft)",      share: 17, volume: 6430, sentiment: -0.69, delta: -0.09, sampleQuote: "£35 overdraft fee for £2 shortfall." },
  { intent: "Payment / Transfer Issues",     share: 12, volume: 4540, sentiment: -0.44, delta: -0.06, sampleQuote: "Transfer stuck pending for 3 days." },
  { intent: "Account Access / Password",     share: 9,  volume: 3400, sentiment: -0.32, delta: -0.03, sampleQuote: "Locked out again after reset." },
  { intent: "Balance & Statements",          share: 6,  volume: 2270, sentiment:  0.18, delta:  0.01, sampleQuote: "App shows balance clearly, helpful." },
  { intent: "New Product Inquiry",           share: 5,  volume: 1890, sentiment:  0.22, delta:  0.03, sampleQuote: "Opened a savings account in 5 minutes." },
  { intent: "Complaint / Social Escalation", share: 4,  volume: 1510, sentiment: -0.74, delta: -0.18, sampleQuote: "Posting this on Twitter — no response." },
];

const VULNERABILITY_ROWS = [
  { id: "CX-48122", segment: "HNI",       indicator: "Bereavement",         source: "Voice · Branch",    flagged: "2h ago",  severity: "High",   action: "Specialist desk routing pending" },
  { id: "CX-48090", segment: "Mass Aff.", indicator: "Financial difficulty",source: "Chat · Web",        flagged: "5h ago",  severity: "High",   action: "Forbearance offer not yet made" },
  { id: "CX-47984", segment: "Mass",      indicator: "Health / mobility",   source: "Voice · IVR",       flagged: "1d ago",  severity: "Medium", action: "Accessibility path triggered" },
  { id: "CX-47861", segment: "HNI",       indicator: "Debt stress",         source: "Email · Complaint", flagged: "1d ago",  severity: "High",   action: "Collections pause — flagged" },
  { id: "CX-47702", segment: "Affluent",  indicator: "Cognitive / age",     source: "Chat · App",        flagged: "2d ago",  severity: "Medium", action: "Trusted contact prompt offered" },
  { id: "CX-47590", segment: "Mass",      indicator: "Financial difficulty",source: "Social · DM",       flagged: "3d ago",  severity: "Low",    action: "Budgeting tool resource sent" },
];

export function CustomerHappinessDrillDown({ onBack }: { onBack: () => void }) {
  const T = useDashboardTheme();
  const segColor = { hni: T.cyan, affluent: T.purple, mass: T.amber, digital: T.green } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Customer Happiness"
        sub="How happy are your customers and what is driving unhappiness across segments, journeys, products and channels?"
      />

      {/* Row 0 — FCI KPI wall (requested to appear on top) */}
      <RetailFCIKPICards isDarkMode />

      {/* Row 0 — TOP INTENTS × SENTIMENT · HV vs LV (lead signal) */}
      <HVvsLVIntentPanel T={T} />

      {/* Tier 1 — What's Failing? diagnostic wall promoted by request */}
      <FailureClusters clusters={fciClusters} isDarkMode />

      {/* Row 1 — Sentiment Heatmap + Topic Bubble Map (NPS Segment Monitor promoted into RetailFCIKPICards above) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
        <AIPanel
          title="Sentiment Heatmap"
          subtitle="Weekly customer sentiment by channel · red tiles mark where complaints are concentrated"
          accentColor={T.red}
          ai
          aiModel="Sentiment NLP"
          fill
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "72px repeat(6, 1fr)",
            gridTemplateRows: "auto repeat(5, 1fr)",
            gap: 6,
            flex: 1,
            minHeight: 0,
          }}>
            <div />
            {HEATMAP_WEEKS.map((w) => (
              <div key={w} style={{ fontSize: 10, color: T.textMut, textAlign: "center", fontFamily: "var(--mono)" }}>{w}</div>
            ))}
            {SENT_HEATMAP.map((row) => (
              <Fragment key={row.ch}>
                <div style={{ fontSize: 11, color: T.textSec, alignSelf: "center" }}>{row.ch}</div>
                {row.cells.map((v, ci) => {
                  const neg = 1 - v;
                  const color = neg > 0.5 ? T.red : neg > 0.4 ? T.amber : neg > 0.3 ? T.gold : T.green;
                  return (
                    <div
                      key={`${row.ch}-${HEATMAP_WEEKS[ci] ?? ci}`}
                      title={`${row.ch} · ${HEATMAP_WEEKS[ci]}: ${v.toFixed(2)} sentiment`}
                      style={{
                        background: `${color}${neg > 0.5 ? "cc" : neg > 0.4 ? "99" : neg > 0.3 ? "66" : "44"}`,
                        border: `1px solid ${color}50`, borderRadius: 6,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: T.text, fontFamily: "var(--mono)", fontWeight: 700,
                        cursor: "pointer", transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {v.toFixed(2)}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14,
            alignItems: "center",
          }}>
            {[
              { label: "Healthy",  color: T.green, hint: "≥ 0.70" },
              { label: "Watch",    color: T.gold,  hint: "0.60 – 0.69" },
              { label: "Strain",   color: T.amber, hint: "0.50 – 0.59" },
              { label: "Acute",    color: T.red,   hint: "< 0.50" },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 10px", borderRadius: 999,
                  background: `${chip.color}18`,
                  border: `1px solid ${chip.color}55`,
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: chip.color,
                  boxShadow: `0 0 0 2px ${chip.color}33`,
                  display: "inline-block",
                }} />
                <span style={{
                  fontSize: 12, fontWeight: 700, color: T.text,
                  textTransform: "uppercase", letterSpacing: 0.4,
                }}>{chip.label}</span>
                <span style={{
                  fontSize: 11, color: T.textMut,
                  fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
                }}>{chip.hint}</span>
              </div>
            ))}
          </div>
        </AIPanel>

        <AIPanel
          title="Topic Bubble Map"
          subtitle="Impact vs resolution difficulty · crisis zone highlighted"
          accentColor={T.amber}
          fill
        >
          <div className="dark" style={{ colorScheme: "dark", flex: 1, minHeight: 0 }}>
            <TopicBubbleMap
              data={REUSED_TOPIC_BUBBLES}
              showTopicCards={false}
              bubbleSizeRange={[40, 180]}
            />
          </div>
        </AIPanel>
      </div>

      {/* Row 2 removed — Churn Signal Index + Repeat Contact Tracker now live in the
          RetailFCIKPICards block at the top of this drill-down. */}

      {/* Row 4 — HNI tier tracker + Revenue-at-Risk attribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <AIPanel
          title="Wealth Tier Health"
          subtitle="Sentiment split across H1 · H2 · H3 wealth tiers · deposits at stake (£M)"
          accentColor={T.cyan}
        >
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={HNI_TIERS} layout="vertical" margin={{ top: 6, right: 12, left: 20, bottom: 0 }} stackOffset="expand">
                <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide domain={[0, 1]} />
                <YAxis type="category" dataKey="tier" tick={axisTickStyle(T)} stroke={T.borderLight} width={110} />
                <Tooltip content={<ChartTip T={T} valueSuffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="happy"   name="Happy"   stackId="a" fill={T.green} />
                <Bar dataKey="neutral" name="Neutral" stackId="a" fill={T.amber} />
                <Bar dataKey="unhappy" name="Unhappy" stackId="a" fill={T.red} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 16, marginBottom: 8,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, color: T.textSec,
              textTransform: "uppercase", letterSpacing: 0.8,
            }}>
              Deposits at stake per tier
            </span>
            <span style={{ fontSize: 10.5, color: T.textMut }}>
              Balances held · active accounts
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {HNI_TIERS.map((t) => (
              <div key={t.tier} style={{
                border: `1px solid ${T.borderLight}`, borderRadius: 10, padding: "8px 10px", background: T.card,
              }}>
                <div style={{ fontSize: 10.5, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6 }}>{t.tier.split("·")[0].trim()}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "var(--mono)" }}>£{t.deposits}M</span>
                  <span style={{ fontSize: 10, color: T.textMut }}>{t.accounts} accts</span>
                </div>
              </div>
            ))}
          </div>
        </AIPanel>
        <AIPanel title="Vulnerable Customer Watchlist" subtitle="FCA Consumer Duty · vulnerability indicators auto-detected from live conversations" accentColor={T.amber} ai aiModel="Vulnerability NLP">
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", color: T.textMut, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.7 }}>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Case</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Segment</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Indicator</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Source</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Flagged</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Severity</th>
                  <th style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {VULNERABILITY_ROWS.map((r) => {
                  const sevColor = r.severity === "High" ? T.red : r.severity === "Medium" ? T.amber : T.green;
                  return (
                    <tr key={r.id} style={{ color: T.textSec }}>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}`, fontFamily: "var(--mono)", color: T.text }}>{r.id}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>{r.segment}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}`, color: T.text }}>{r.indicator}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>{r.source}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}`, fontFamily: "var(--mono)" }}>{r.flagged}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: sevColor, textTransform: "uppercase", letterSpacing: 0.6,
                          padding: "2px 8px", borderRadius: 999, background: `${sevColor}18`, border: `1px solid ${sevColor}40`,
                        }}>{r.severity}</span>
                      </td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.borderLight}` }}>{r.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10.5, color: T.textMut, marginTop: 8 }}>
            Model surfaces bereavement, financial difficulty, health, age and debt-stress signals across voice, chat, email, social and app.
          </div>
        </AIPanel>
      </div>

      {/* Reused components: most were curated away after review.
          TopicBubbleMap is now rendered beside the Sentiment Heatmap in Row 1.
          Previously here: SentimentChart, RepeatContactRate, CustomerEmotion,
          SeverePainIncidents, TimeInPain, NarrativeLens, CrossChannelToneIntelligenceCard,
          IntentScoreHeatmap. */}
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

function IntentRowCard({
  row, color, T, max, isLast,
}: { row: IntentRow; color: string; T: DashboardThemeTokens; max: number; isLast: boolean }) {
  const sColor = sentimentColor(T, row.sentiment);
  const deltaUp = row.delta > 0;
  const deltaFlat = Math.abs(row.delta) < 0.02;
  const deltaColor = deltaFlat ? T.textMut : deltaUp ? T.green : T.red;
  const pct = Math.min(100, (row.share / max) * 100);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10px minmax(0, 1fr) 60px 76px 58px",
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

      <div style={{
        display: "flex", alignItems: "center", gap: 8, minWidth: 0,
      }}>
        <span style={{
          fontSize: 12.5, fontWeight: 700, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {row.intent}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 10, fontWeight: 800, color: sColor,
          fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
          padding: "1px 6px", borderRadius: 999,
          background: `${sColor}15`,
          borderTop: `1px solid ${sColor}40`,
          borderRight: `1px solid ${sColor}40`,
          borderBottom: `1px solid ${sColor}40`,
          borderLeft: `1px solid ${sColor}40`,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          <span style={{ fontSize: 10.5, lineHeight: 1 }}>{sentimentFace(row.sentiment)}</span>
          {row.sentiment > 0 ? "+" : ""}{row.sentiment.toFixed(2)}
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
        textAlign: "right", fontSize: 10.5, color: T.textMut,
        fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
      }}>
        {row.volume.toLocaleString()}/mo
      </span>

      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 3,
        textAlign: "right", fontSize: 11, fontWeight: 700, color: deltaColor,
        fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
      }}>
        <span style={{ fontSize: 9, lineHeight: 1 }}>
          {deltaFlat ? "●" : deltaUp ? "▲" : "▼"}
        </span>
        {deltaFlat ? "0.00" : `${Math.abs(row.delta).toFixed(2)}`}
      </span>

      {/* Full-width sentiment thermometer at bottom */}
      <div style={{
        gridColumn: "1 / -1",
        height: 4, borderRadius: 999, background: T.borderLight,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: `${pct}%`,
          background: sentimentBarGradient(T, row.sentiment),
          borderRadius: 999,
          boxShadow: `0 0 6px ${sColor}66`,
        }} />
      </div>
    </div>
  );
}

function IntentGroupCard({
  title, subtitle, color, rows, T, max,
}: {
  title: string; subtitle: string; color: string;
  rows: IntentRow[]; T: DashboardThemeTokens; max: number;
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
        gridTemplateColumns: "10px minmax(0, 1fr) 60px 76px 58px",
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
        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textMut, textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>Volume</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textMut, textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>Δ30d</span>
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
            max={max}
            isLast={i === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function HVvsLVIntentPanel({ T }: { T: DashboardThemeTokens }) {
  const maxHV = Math.max(...HV_INTENTS.map((r) => r.share));
  const maxLV = Math.max(...LV_INTENTS.map((r) => r.share));

  const avgHV = HV_INTENTS.reduce((a, r) => a + r.sentiment * r.share, 0) / HV_INTENTS.reduce((a, r) => a + r.share, 0);
  const avgLV = LV_INTENTS.reduce((a, r) => a + r.sentiment * r.share, 0) / LV_INTENTS.reduce((a, r) => a + r.share, 0);

  // Intents shared by both tiers — kept only to compute the "widest gap" chip in
  // the summary strip. The full HV-vs-LV bar chart was removed by request.
  const commonIntents = [
    { intent: "Fee Disputes",     hv: -0.64, lv: -0.69 },
    { intent: "Card Declines",    hv: -0.41, lv: -0.62 },
    { intent: "App / Login",      hv: -0.22, lv: -0.56 },
    { intent: "Escalations",      hv: -0.71, lv: -0.74 },
    { intent: "Statements / Tax", hv:  0.12, lv:  0.18 },
    { intent: "Rewards / Offers", hv:  0.38, lv:  0.22 },
  ];

  const gaps = commonIntents
    .map((r) => ({ intent: r.intent, gap: Math.abs(r.hv - r.lv) }))
    .sort((a, b) => b.gap - a.gap);

  // Roll-up numbers for the summary strip
  const hvAtRisk = HV_INTENTS.filter((r) => r.sentiment <= -0.3).reduce((a, r) => a + r.volume, 0);
  const lvAtRisk = LV_INTENTS.filter((r) => r.sentiment <= -0.3).reduce((a, r) => a + r.volume, 0);
  const totalAtRisk = hvAtRisk + lvAtRisk;
  const sentimentGap = avgHV - avgLV; // + means HV happier than LV

  const summaryChips: { k: string; v: string; c: string }[] = [
    { k: "HV avg",       v: `${avgHV > 0 ? "+" : ""}${avgHV.toFixed(2)}`, c: sentimentColor(T, avgHV) },
    { k: "LV avg",       v: `${avgLV > 0 ? "+" : ""}${avgLV.toFixed(2)}`, c: sentimentColor(T, avgLV) },
    { k: "HV−LV gap",    v: `${sentimentGap > 0 ? "+" : ""}${sentimentGap.toFixed(2)}`, c: sentimentGap >= 0 ? T.green : T.red },
    { k: "At-risk vol",  v: `${totalAtRisk.toLocaleString()}/mo`, c: T.amber },
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
      subtitle="What High-Value and Low-Value customers are calling about, and how they feel about each intent (last 30 days)"
      accentColor={T.cyan}
      ai
      headerRight={summaryStrip}
    >
      {/* Compact segment meta — avg sentiment dials */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
        {[
          { label: "HV Customers", color: T.cyan,  count: "148K accounts", vol: HV_INTENTS.reduce((a, r) => a + r.volume, 0), avg: avgHV, note: "Private · HNI · Mass Affluent" },
          { label: "LV Customers", color: T.amber, count: "2.41M accounts", vol: LV_INTENTS.reduce((a, r) => a + r.volume, 0), avg: avgLV, note: "Mass Retail · Digital-only" },
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
                  <span style={{ color: T.borderLight }}>·</span>
                  <span>{m.vol.toLocaleString()} contacts/mo</span>
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 110 }}>
                <div style={{ fontSize: 9.5, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.7 }}>Avg sentiment</div>
                <div style={{
                  fontSize: 22, fontWeight: 800, color: avgColor,
                  fontFamily: "var(--mono)", fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.05, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end",
                }}>
                  <span style={{ fontSize: 18 }}>{sentimentFace(m.avg)}</span>
                  <span>{m.avg > 0 ? "+" : ""}{m.avg.toFixed(2)}</span>
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
          rows={HV_INTENTS}
          T={T}
          max={maxHV}
        />
        <IntentGroupCard
          title="LV · Top Intents"
          subtitle="Ranked by share of LV contact volume"
          color={T.amber}
          rows={LV_INTENTS}
          T={T}
          max={maxLV}
        />
      </div>

    </AIPanel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD 2 — BRAND & REPUTATION RISK
   ──────────────────────────────────────────────────────────────────────── */

const BRAND_RT = [
  { t: "-6h", mentions: 210, sentiment: 0.58 },
  { t: "-5h", mentions: 240, sentiment: 0.54 },
  { t: "-4h", mentions: 290, sentiment: 0.49 },
  { t: "-3h", mentions: 380, sentiment: 0.42 },
  { t: "-2h", mentions: 470, sentiment: 0.38 },
  { t: "-1h", mentions: 520, sentiment: 0.35 },
  { t: "Now", mentions: 580, sentiment: 0.33 },
];

const MEDIA = [
  { outlet: "This Is Money",   tone: "negative", reach: 840,  time: "2h ago",  title: "UK bank under fire for hidden EMI penalties" },
  { outlet: "Financial Times", tone: "neutral",  reach: 1200, time: "5h ago",  title: "Retail banks reassess HELOC pricing amid rate pressure" },
  { outlet: "MoneyWeek",       tone: "negative", reach: 420,  time: "9h ago",  title: "Fee policy confusion driving switching activity" },
  { outlet: "The Guardian",    tone: "negative", reach: 1800, time: "1d ago",  title: "Which? flags transparency gaps at major UK banks" },
  { outlet: "TechCrunch",      tone: "positive", reach: 620,  time: "1d ago",  title: "Budgeting tool wins UX award — rare banking bright spot" },
];

// Feature requests surfaced from voice, chat, social, app store and community forums —
// Ranjith's explicit ask: "show what conversations are uncovering… new feature requests".
const FEATURE_REQUESTS = [
  { req: "Joint account in-app invites",         mentions: 284, sentiment: 0.72, channels: "App · Chat · Reddit" },
  { req: "Savings pots / auto-rules",            mentions: 246, sentiment: 0.78, channels: "App · Trustpilot"    },
  { req: "Real-time FX transfers",               mentions: 198, sentiment: 0.66, channels: "Social · Email"      },
  { req: "Biometric re-auth on high-value txns", mentions: 162, sentiment: 0.70, channels: "Chat · App"          },
  { req: "Investment dashboard integration",     mentions: 141, sentiment: 0.64, channels: "App · Voice"         },
  { req: "Pay-by-link for small business",       mentions: 104, sentiment: 0.69, channels: "Email · Social"      },
];

export function BrandReputationDrillDown({ onBack }: { onBack: () => void }) {
  const T = useDashboardTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Brand & Reputation Risk"
        sub="Real-time brand, social, review-site and media signals — where is perception eroding and what is driving it?"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "start" }}>
        <RetailTopTopicsByVirality />
        <RetailMomentumHashtags />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1fr)",
        gridAutoRows: "380px",
        gap: 16,
        alignItems: "stretch",
      }}>
        <AIPanel
          title="VoC Friction Drivers"
          subtitle="Issue Statement Extractor · Top 10 complaint phrases"
          accentColor="#b90abd"
          fill
        >
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <NarrativeLens phrases={REUSED_NARRATIVE_PHRASES} variant="embedded" />
          </div>
        </AIPanel>

        <AIPanel title="Brand Pulse" subtitle="Mentions (bars) vs net sentiment (line) · last 6 hours" accentColor={T.red} fill>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}>
            <div style={{ width: "100%", flex: 1, minHeight: 250 }}>
              <ResponsiveContainer>
                <ComposedChart data={BRAND_RT} margin={{ top: 6, right: 14, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mentionsGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={T.red} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={T.red} stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" tick={axisTickStyle(T)} stroke={T.borderLight} />
                  <YAxis yAxisId="left"  tick={axisTickStyle(T)} stroke={T.borderLight} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tick={axisTickStyle(T)} stroke={T.borderLight} />
                  <Tooltip content={<ChartTip T={T} />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  <Area yAxisId="left"  type="monotone" dataKey="mentions"  name="Mentions"  stroke={T.red}  fill="url(#mentionsGrad)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="sentiment" name="Sentiment" stroke={T.cyan} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AIPanel>

        <AIPanel title="Media Monitor" subtitle="Tier-1 outlets · weighted by reach · tone auto-classified" accentColor={T.red} fill>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0, overflowY: "auto" }}>
            {MEDIA.map((m, i) => {
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
      </div>

      {/* Row 3 — Feature request surfacer */}
      <AIPanel title="Customer Feature Requests" subtitle="Requests surfaced from conversations across voice, chat, app store and social — ranked by mention volume" accentColor={T.green} ai aiModel="Request Mining">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={FEATURE_REQUESTS} layout="vertical" margin={{ top: 6, right: 16, left: 6, bottom: 0 }}>
                <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={axisTickStyle(T)} stroke={T.borderLight} />
                <YAxis type="category" dataKey="req" tick={axisTickStyle(T)} stroke={T.borderLight} width={210} />
                <Tooltip content={<ChartTip T={T} />} />
                <Bar dataKey="mentions" name="Mentions" fill={T.green} radius={[0, 4, 4, 0]}>
                  {FEATURE_REQUESTS.map((d, i) => (
                    <Cell key={i} fill={d.sentiment > 0.72 ? T.green : d.sentiment > 0.66 ? T.cyan : T.amber} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FEATURE_REQUESTS.map((f) => (
              <div key={f.req} style={{
                padding: "8px 10px", borderRadius: 10, background: T.card,
                border: `1px solid ${T.borderLight}`,
              }}>
                <div style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{f.req}</div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: T.textMut }}>{f.channels}</span>
                  <span style={{ fontSize: 10, color: T.green, fontFamily: "var(--mono)", fontWeight: 700 }}>
                    sent. {f.sentiment.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AIPanel>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
        gridAutoRows: "520px",
        gap: 16,
        alignItems: "stretch",
      }}>
        <RetailInfluencerWatchlist />
        <RetailComplianceHealth />
      </div>

      <RetailViolationsAndRiskAlerts />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARD 3 — SERVICE FULFILMENT
   ──────────────────────────────────────────────────────────────────────── */

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
const SLA_CHANNELS = ["Voice", "Chat", "Email", "App SS"] as const;

const INTENT_TOP = [
  { intent: "App Balance",         sla: 99, fcr: 97, wow: +2 },
  { intent: "Card Replace",        sla: 94, fcr: 92, wow: +1 },
  { intent: "Password Reset",      sla: 93, fcr: 95, wow: +2 },
];
// Each bottom intent ties back to the stage in the Bottleneck Detector that is
// driving its SLA failure — both must read red end-to-end (causal chain).
const INTENT_BOTTOM = [
  { intent: "Fee Dispute",         sla: 58, fcr: 52, wow: -6, bottleneck: "KYC API",       bottleneckActual: 4.2, bottleneckSla: 1   },
  { intent: "HELOC Enquiry",       sla: 63, fcr: 59, wow: -4, bottleneck: "BPO Evidence",  bottleneckActual: 4.8, bottleneckSla: 2   },
  { intent: "Mortgage Servicing",  sla: 66, fcr: 61, wow: -3, bottleneck: "Resolve",       bottleneckActual: 5.2, bottleneckSla: 4   },
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

function ServiceFulfilmentBackOfficeQueueDepth({ T }: { T: DashboardThemeTokens }) {
  const bodyScroll: CSSProperties = {
    maxHeight: "min(337px, 40vh)",
    overflowY: "auto",
    overflowX: "hidden",
    minWidth: 0,
  };
  return (
    <AIPanel
      title="Back-office Queue Depth"
      subtitle="Pending cases by team · bucketed by SLA age · how much are we over / under SLA?"
      accentColor={T.amber}
    >
      <div style={bodyScroll}>
      {/* Legend: bucket tones are mapped against each team's SLA line */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
        fontSize: 10.5, color: T.textMut, marginBottom: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: T.green }} /> Within SLA
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: T.amber }} /> Breached
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: T.red }} /> Far-breach (critical)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <span style={{
            display: "inline-block", width: 18, height: 0,
            borderTop: `2px dashed ${T.text}`, opacity: 0.7,
          }} /> SLA threshold
        </div>
      </div>

      {/* Per-team rows: name + SLA pill, stacked bar split at SLA cut, story under */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BACKOFFICE_QUEUE.map((row) => {
          const total = row["0-1d"] + row["1-3d"] + row["3-7d"] + row[">7d"];
          const buckets: Array<{ key: "0-1d" | "1-3d" | "3-7d" | ">7d"; label: string; value: number }> = [
            { key: "0-1d", label: "0–1d", value: row["0-1d"] },
            { key: "1-3d", label: "1–3d", value: row["1-3d"] },
            { key: "3-7d", label: "3–7d", value: row["3-7d"] },
            { key: ">7d",  label: ">7d",  value: row[">7d"] },
          ];
          const withinSla = buckets
            .filter((b) => bucketTone(b.key, row.slaDays) === "ok")
            .reduce((s, b) => s + b.value, 0);
          const breached = total - withinSla;
          const farBreach = row[">7d"] > 0 && row.slaDays < 7 ? row[">7d"] : 0;

          let thresholdPct = 0;
          let running = 0;
          for (const b of buckets) {
            running += b.value;
            if (bucketTone(b.key, row.slaDays) === "ok") {
              thresholdPct = total > 0 ? running / total : 0;
            }
          }

          return (
            <div key={row.team} style={{
              padding: "10px 12px", borderRadius: 10,
              background: T.elevated,
              border: `1px solid ${T.borderLight}`,
              borderLeft: `3px solid ${farBreach > 0 ? T.red : breached > 0 ? T.amber : T.green}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{row.team}</span>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, color: T.text, fontFamily: "var(--mono)",
                    padding: "2px 7px", borderRadius: 999,
                    background: `${T.text}14`, border: `1px solid ${T.borderLight}`,
                  }}>
                    SLA {row.slaDays}d
                  </span>
                </div>
                <div style={{ fontSize: 11, color: T.textMut, fontFamily: "var(--mono)" }}>
                  <span style={{ color: T.text, fontWeight: 700 }}>{total.toLocaleString()}</span> total
                  <span style={{ margin: "0 6px", color: T.borderLight }}>·</span>
                  <span style={{ color: T.green, fontWeight: 700 }}>{withinSla.toLocaleString()}</span> within
                  <span style={{ margin: "0 6px", color: T.borderLight }}>·</span>
                  <span style={{ color: breached > 0 ? T.amber : T.textMut, fontWeight: 700 }}>{breached.toLocaleString()}</span> breached
                  {farBreach > 0 ? (
                    <>
                      <span style={{ margin: "0 6px", color: T.borderLight }}>·</span>
                      <span style={{ color: T.red, fontWeight: 700 }}>{farBreach.toLocaleString()}</span> critical
                    </>
                  ) : null}
                </div>
              </div>

              <div style={{
                position: "relative",
                display: "flex", height: 18, borderRadius: 6, overflow: "hidden",
                background: `${T.borderLight}`, border: `1px solid ${T.borderLight}`,
              }}>
                {buckets.map((b) => {
                  const tone = bucketTone(b.key, row.slaDays);
                  const c = tone === "ok" ? T.green : tone === "warn" ? T.amber : T.red;
                  const w = total > 0 ? (b.value / total) * 100 : 0;
                  return (
                    <div
                      key={b.key}
                      title={`${b.label}: ${b.value} cases · ${tone === "ok" ? "within SLA" : tone === "warn" ? "breached" : "critical"}`}
                      style={{
                        width: `${w}%`, background: c,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#0a0e16", fontFamily: "var(--mono)",
                        transition: "width 0.5s",
                      }}
                    >
                      {w >= 10 ? b.value : ""}
                    </div>
                  );
                })}
                {thresholdPct > 0 && thresholdPct < 1 ? (
                  <div style={{
                    position: "absolute",
                    left: `${thresholdPct * 100}%`,
                    top: -3, bottom: -3,
                    width: 0,
                    borderLeft: `2px dashed ${T.text}`,
                    opacity: 0.85,
                    pointerEvents: "none",
                  }} />
                ) : null}
              </div>

              <div style={{ fontSize: 10.5, color: T.textMut, marginTop: 6, lineHeight: 1.5 }}>
                {total.toLocaleString()} in queue → <span style={{ color: T.green, fontWeight: 600 }}>{withinSla.toLocaleString()} within {row.slaDays}d</span>
                {breached > 0 ? (
                  <> → <span style={{ color: T.amber, fontWeight: 600 }}>{breached.toLocaleString()} past SLA</span></>
                ) : null}
                {farBreach > 0 ? (
                  <> → <span style={{ color: T.red, fontWeight: 600 }}>{farBreach.toLocaleString()} over 7d</span></>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 10.5, color: T.textMut, marginTop: 10, lineHeight: 1.55 }}>
        <span style={{ color: T.red, fontWeight: 700 }}>Mortgage Ops</span> has 52 cases over 7 days against a 3d SLA — the driver of the Mortgage Servicing FCR drop.
        KYC &amp; Onboarding also shows {BACKOFFICE_QUEUE[0]["3-7d"] + BACKOFFICE_QUEUE[0][">7d"]} cases past the 3-day target.
      </div>
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

export function ServiceFulfilmentDrillDown({ onBack }: { onBack: () => void }) {
  const T = useDashboardTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader
        onBack={onBack}
        title="Service Fulfilment"
        sub="Which channels, intents and stages are breaking SLA, FCR and AHT?"
      />

      <RetailIntentPressureAlerts />

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(300px, 0.95fr) minmax(0, 1.35fr)",
        gap: 16,
        alignItems: "start",
      }}>
        <div style={{ minWidth: 0 }}>
          <RetailEscalationRiskMonitor />
        </div>
        <div style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <ServiceFulfilmentBackOfficeQueueDepth T={T} />
          </div>
          <div style={{ minWidth: 0, flexShrink: 0 }}>
            <ServiceFulfilmentIntentLeaderboard T={T} />
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
        <AIPanel title="FCR Intelligence" subtitle="Actual vs. target · dashed line = last month" accentColor={T.green}>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ComposedChart data={FCR_CH} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ch" tick={axisTickStyle(T)} stroke={T.borderLight} />
                <YAxis tick={axisTickStyle(T)} stroke={T.borderLight} domain={[0, 100]} />
                <Tooltip content={<ChartTip T={T} valueSuffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
                  {FCR_CH.map((d, i) => (
                    <Cell key={i} fill={d.actual >= d.target ? T.green : d.actual >= d.target - 10 ? T.amber : T.red} />
                  ))}
                </Bar>
                <Bar dataKey="target" name="Target" fill={T.textMut} fillOpacity={0.35} radius={[4, 4, 0, 0]} />
                <Line dataKey="last" name="Last month" stroke={T.cyan} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AIPanel>

        <AIPanel title="SLA Heatmap" subtitle="Intent × channel · intensity = compliance gap" accentColor={T.red}>
          <div style={{ display: "grid", gridTemplateColumns: "120px repeat(4, 1fr)", gap: 4 }}>
            <div />
            {SLA_CHANNELS.map((c) => (
              <div key={c} style={{ fontSize: 10, color: T.textMut, textAlign: "center", fontFamily: "var(--mono)" }}>{c}</div>
            ))}
            {SLA_MATRIX.map((row) => (
              <Fragment key={row.intent}>
                <div style={{ fontSize: 11, color: T.textSec, alignSelf: "center" }}>{row.intent}</div>
                {SLA_CHANNELS.map((c) => {
                  const v = (row as any)[c] as number;
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
        </AIPanel>
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        <AIPanel
          title="Contact Resolution Tree"
          subtitle={`${CONTACT_TREE.total.toLocaleString()} contacts → Bot vs Human → Closed vs Escalated · escalations have their own SLA`}
          accentColor={T.red}
        >
          <ContactResolutionTree tree={CONTACT_TREE} T={T} />
        </AIPanel>

        <AIPanel title="Bottleneck Detector" subtitle="Actual vs. SLA at each resolution stage (hours)" accentColor={T.amber} ai aiModel="Process ML">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PROCESS_STAGES.map((s, i) => {
              const color = s.status === "ok" ? T.green : s.status === "warn" ? T.amber : T.red;
              const ratio = Math.min(s.actual / Math.max(s.sla, 0.3) * 50, 100);
              const overage = s.actual > s.sla ? (((s.actual - s.sla) / s.sla) * 100).toFixed(0) + "% over" : "within SLA";
              return (
                <div key={s.stage} style={{
                  padding: "10px 12px", borderRadius: 10,
                  background: `${color}10`,
                  borderTop: `1px solid ${color}28`,
                  borderRight: `1px solid ${color}28`,
                  borderBottom: `1px solid ${color}28`,
                  borderLeft: `3px solid ${color}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%", background: `${color}28`,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, color, fontFamily: "var(--mono)",
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.stage}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: T.textMut }}>SLA {s.sla}h</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color, fontFamily: "var(--mono)" }}>{s.actual}h</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: `${color}25`, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ratio}%`, background: color, transition: "width 0.6s" }} />
                  </div>
                  <div style={{ fontSize: 10, color: T.textMut, marginTop: 4 }}>{overage}</div>
                </div>
              );
            })}
          </div>
        </AIPanel>
      </div>

      {/* Moved from Customer Happiness — escalation paths and pillar × intent scoring
          are operational service-fulfilment signals, not brand/happiness ones. */}
      <ReusedSlot T={T} label="unified / CrossChannelToneIntelligenceCard" note="Escalation paths across channels (auto-data)">
        <CrossChannelToneIntelligenceCard />
      </ReusedSlot>

      <ReusedSlot T={T} label="FCI / IntentScoreHeatmap" note="Pillars × intents score heatmap">
        <IntentScoreHeatmap isDarkMode />
      </ReusedSlot>

      <RetailCrossChannelInteractionBreakdownAudit />

      <RetailCrossChannelEmotionShockboard />
    </div>
  );
}
