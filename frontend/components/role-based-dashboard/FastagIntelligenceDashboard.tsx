"use client";

import { Component, createContext, type CSSProperties, type ErrorInfo, useContext } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Crown,
  FileText,
  Flame,
  Headphones,
  MapPin,
  Moon,
  Radio,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
} from "./DashboardThemeContext";
import { periodPulseLines, resolveGatewayTile } from "@/lib/fastag-period/hob-gateway";
import { FastagAiInsightsSection, FastagRiskSpikeMonitor } from "./FastagHobFrontInsights";
import { FastagHobDrillRouter, type HobDrillId } from "./FastagHobDrillDownScreens";
import { FastagPeriodFilterRow, FastagPeriodProvider, useFastagPeriod } from "./FastagPeriodContext";
import { T } from "@/lib/role-based-dashboard/registry";

// ─────────────────────────────────────────────────────────────────────────
// PALETTE — YaaraLabs × FASTag (light default · dark optional)
// ─────────────────────────────────────────────────────────────────────────
export type FastagColorMode = "light" | "dark";

export type FastagPalette = {
  primary: string;
  primarySoft: string;
  primaryBorder: string;
  accent: string;
  accentSoft: string;
  urgency: string;
  urgencySoft: string;
  bg: string;
  canvas: string;
  surface: string;
  card: string;
  elevated: string;
  border: string;
  borderLight: string;
  lavender: string;
  text: string;
  textSec: string;
  textMut: string;
  green: string;
  greenSoft: string;
  amber: string;
  amberSoft: string;
  red: string;
  redSoft: string;
  pillNeutralBg: string;
  pillNeutralBorder: string;
  headerBackdrop: string;
  backButtonBg: string;
  backButtonBorder: string;
  accentOnFill: string;
  chartCursorFill: string;
  overlayScrim: string;
  overlayScrimStrong: string;
  panelShadow: string;
  toastShadow: string;
};

const FT_DARK: FastagPalette = {
  primary: "#7B2FF0",
  primarySoft: "rgba(123,47,240,0.14)",
  primaryBorder: "rgba(123,47,240,0.32)",
  accent: "#00D4FF",
  accentSoft: "rgba(0,212,255,0.14)",
  urgency: "#FF7043",
  urgencySoft: "rgba(255,112,67,0.14)",
  bg: "#0D1117",
  canvas: "#0D1117",
  surface: "#121823",
  card: "#161D2B",
  elevated: "#1B2436",
  border: "#26314A",
  borderLight: "#324269",
  lavender: "#EEEAF4",
  text: "#F4F6FB",
  textSec: "#B8C0D3",
  textMut: "#7B8AA8",
  green: "#22C55E",
  greenSoft: "rgba(34,197,94,0.14)",
  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.16)",
  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.16)",
  pillNeutralBg: "rgba(255,255,255,0.06)",
  pillNeutralBorder: "rgba(255,255,255,0.10)",
  headerBackdrop: "rgba(13,17,23,0.92)",
  backButtonBg: "rgba(255,255,255,0.05)",
  backButtonBorder: "rgba(255,255,255,0.10)",
  accentOnFill: "#04222b",
  chartCursorFill: "rgba(255,255,255,0.04)",
  overlayScrim: "rgba(4,8,15,0.55)",
  overlayScrimStrong: "rgba(4,8,15,0.6)",
  panelShadow: "0 0 0 1px rgba(123,47,240,0.10), 0 12px 32px rgba(123,47,240,0.10)",
  toastShadow: "0 18px 40px rgba(0,0,0,0.45)",
};

const FT_LIGHT: FastagPalette = {
  primary: "#7B2FF0",
  primarySoft: "rgba(123,47,240,0.10)",
  primaryBorder: "rgba(123,47,240,0.22)",
  accent: "#00D4FF",
  accentSoft: "rgba(0,212,255,0.12)",
  urgency: "#FF7043",
  urgencySoft: "rgba(255,112,67,0.12)",
  bg: "#F5F7FA",
  canvas: "#F5F7FA",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  elevated: "#FFFFFF",
  border: "#E0E4ED",
  borderLight: "#E8ECF2",
  lavender: "#EEEAF4",
  text: "#1A1A2E",
  textSec: "#4B5563",
  textMut: "#6B7280",
  green: "#22C55E",
  greenSoft: "rgba(34,197,94,0.12)",
  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.14)",
  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.12)",
  pillNeutralBg: "rgba(26,26,46,0.05)",
  pillNeutralBorder: "rgba(26,26,46,0.10)",
  headerBackdrop: "rgba(245,247,250,0.92)",
  backButtonBg: "rgba(26,26,46,0.04)",
  backButtonBorder: "rgba(26,26,46,0.08)",
  accentOnFill: "#04222b",
  chartCursorFill: "rgba(26,26,46,0.04)",
  overlayScrim: "rgba(26,26,46,0.35)",
  overlayScrimStrong: "rgba(26,26,46,0.45)",
  panelShadow: "0 0 0 1px rgba(123,47,240,0.08), 0 12px 32px rgba(26,26,46,0.08)",
  toastShadow: "0 18px 40px rgba(26,26,46,0.12)",
};

const FASTAG_COLOR_MODE_KEY = "fastag-dashboard-color-mode";

const FastagPaletteContext = createContext<FastagPalette>(FT_LIGHT);

function useFT(): FastagPalette {
  return useContext(FastagPaletteContext);
}

function buildFastagTheme(ft: FastagPalette): DashboardThemeTokens {
  return {
    bg: ft.bg,
    surface: ft.surface,
    card: ft.card,
    elevated: ft.elevated,
    border: ft.border,
    borderLight: ft.borderLight,
    cyan: ft.accent,
    cyanGlow: ft.accentSoft,
    gold: ft.amber,
    goldGlow: ft.amberSoft,
    green: ft.green,
    greenGlow: ft.greenSoft,
    red: ft.red,
    redGlow: ft.redSoft,
    amber: ft.amber,
    amberGlow: ft.amberSoft,
    purple: ft.primary,
    purpleGlow: ft.primarySoft,
    blue: "#3b82f6",
    blueGlow: "rgba(59,130,246,0.10)",
    text: ft.text,
    textSec: ft.textSec,
    textMut: ft.textMut,
    white: "#ffffff",
  };
}

// ─────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY — one widget crash must not blank the demo (Stage 7 §7)
// ─────────────────────────────────────────────────────────────────────────
class DashboardErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message?: string }> {
  state = { hasError: false, message: undefined as string | undefined };
  static getDerivedStateFromError(err: unknown): { hasError: boolean; message?: string } {
    return { hasError: true, message: err instanceof Error ? err.message : "Unknown error" };
  }
  componentDidCatch(_err: unknown, _info: ErrorInfo) {
    // Intentionally silent in prototype — production would log to Sentry.
  }
  render() {
    if (this.state.hasError) {
      return (
        <DashboardErrorFallback
          onRetry={() => this.setState({ hasError: false, message: undefined })}
        />
      );
    }
    return this.props.children;
  }
}

function DashboardErrorFallback({ onRetry }: { onRetry: () => void }) {
  const FT = useFT();
  return (
    <div
      style={{
        background: FT.card,
        border: `1px solid ${FT.borderLight}`,
        borderRadius: 12,
        padding: 18,
        color: FT.text,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>A panel failed to load</div>
      <div style={{ fontSize: 12, color: FT.textSec, marginBottom: 10 }}>
        Refresh to recover. The rest of the dashboard is still interactive.
      </div>
      <button
        onClick={onRetry}
        style={{
          background: FT.primarySoft,
          border: `1px solid ${FT.primaryBorder}`,
          color: FT.text,
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS — RB-IOS clock & demo-rhythm tick (Stage 4 §F)
// ─────────────────────────────────────────────────────────────────────────
// RB-IOS target is computed forward-looking so the demo prototype never
// shows a 0-or-negative "days remaining" once the original 30-Jun-2026
// hard-coded date passes. Replace with a fixed date for screenshot day.
const RB_IOS_DAYS_REMAINING = 32;
const RB_IOS_TARGET_LABEL = "RB-IOS · 30-Jun";

// ─────────────────────────────────────────────────────────────────────────
// PERSONA + SCREEN TYPES
// ─────────────────────────────────────────────────────────────────────────
type PersonaId = "hob" | "coh";
type ScreenId =
  | "primary"
  | "plaza_heatmap"
  | "io_evidence"
  | "compliance_watch";

const FASTAG_SECTION_IDS: Record<Exclude<ScreenId, "primary">, string> = {
  plaza_heatmap: "fastag-section-plaza",
  io_evidence: "fastag-section-io-evidence",
  compliance_watch: "fastag-section-compliance",
};

type TimeWindow = "12h" | "24h" | "7d" | "30d";

const TIME_WINDOW_LABEL: Record<TimeWindow, string> = {
  "12h": "trailing 12h",
  "24h": "trailing 24h",
  "7d": "trailing 7d",
  "30d": "trailing 30d",
};

type PersonaMeta = {
  id: PersonaId;
  shortLabel: string;
  longLabel: string;
  initials: string;
  name: string;
  primaryLabel: string;
  primarySub: string;
  icon: typeof Crown;
};

const PERSONAS: Record<PersonaId, PersonaMeta> = {
  hob: {
    id: "hob",
    shortLabel: "HoB",
    longLabel: "Head of Business — FASTag",
    initials: "RV",
    name: "Rajesh Venkatesh",
    primaryLabel: "Morning Brief",
    primarySub:
      "What is moving this morning — and what do I do about it before the 10am ops huddle?",
    icon: Crown,
  },
  coh: {
    id: "coh",
    shortLabel: "COH",
    longLabel: "Head of CX (Customer Operations)",
    initials: "SC",
    name: "Sneha Choudhury",
    primaryLabel: "Operations Console",
    primarySub:
      "Floor state across Trinetra · Anandam · Digital — with named, IO-defensible evidence.",
    icon: Headphones,
  },
};

// ─────────────────────────────────────────────────────────────────────────
// MOCK DATA — Stage-1/2/3 default populated state (Stage 4 §B)
// ─────────────────────────────────────────────────────────────────────────
const SIGNAL_LABELS = {
  S001: "Tag closure or issuer-switch intent",
  S002: "Annual Pass cross-sell miss",
  S003: "Social flare-up · plaza-correlated",
  S004: "AVC misread queue · z-score",
  S005: "Plaza-level leakage cluster",
  S006: "Ombudsman / 14448 threat",
  S007: "Day-1 OEM/dealer issuance cohort",
  S008: "Fleet / corporate intent",
  S009: "GNSS · Barrier-Less awareness",
  S010: "CASA / loan cross-sell pull",
  S013: "Dispute potential (conversation-side)",
  S015: "Trilingual rule adherence",
  S016: "OC 005 evidence-pack readiness",
  S017: "BPO vendor / shift variance",
  S018: "Saksham Recovery conduct",
  S021: "Queue spike + plaza correlation",
  S022: "Blacklist false-positive cluster",
  S024: "IO-defensibility on open complaints",
  S025: "1033 forwarded — by plaza",
  S029: "Refund SLA breach — early warning",
  S030: "Annual Pass FAQ confusion",
  S032: "IO Quarterly Pack",
  S034: "Sentiment drift vs 8-week baseline",
  S035: "Trinetra Hyderabad — afternoon shift",
  S036: "IO desk intake evidence-pack",
  S037: "Branch handoff friction",
  S040: "Marketing campaign feedback",
  // Defined in Stage 2 but rendered as stubs in MVP — see SIGNAL_STATUS for in-scope/out-of-scope decision
  S011: "Auto-recharge opt-in (stated intent)",
  S012: "POS / dealer issuance variance",
  S014: "Repeat-call cluster (same-tag callbacks)",
  S019: "Wallet-state confusion mentions",
  S020: "KYV / Vehicle-class mismatch cohort",
  S023: "Blacklist removal request volume",
  S026: "Recharge channel preference shift",
  S027: "FASTag activation drop-off cohort",
  S028: "Recharge failure (debit / no credit)",
  S031: "Annual Pass adoption cohort",
  S033: "Customer-effort score drift",
  S038: "Plaza acquirer reconciliation gaps",
  S039: "Wallet-ledger event consumption",
} as const;

type SignalId = keyof typeof SIGNAL_LABELS;

/**
 * Stage 2 Out-of-Scope Register placeholder. Until Stage2_Capabilities_DataModel_v1.md
 * is committed to /docs/FastTag/, mark each Stage 6B signal as:
 *  - "live"     → fully implemented in this MVP
 *  - "stub"     → defined in Stage 2, deferred for MVP (drill renders empty-state)
 *  - "oos"      → out of Fluid CX scope (boundary statement in drill)
 */
const SIGNAL_STATUS: Record<SignalId, "live" | "stub" | "oos"> = {
  S001: "live", S002: "live", S003: "live", S004: "live", S005: "live",
  S006: "live", S007: "live", S008: "live", S009: "live", S010: "live",
  S013: "live", S015: "live", S016: "live", S017: "live", S018: "live",
  S021: "live", S022: "live", S024: "live", S025: "live", S029: "live",
  S030: "live", S032: "live", S034: "live", S035: "live", S036: "live",
  S037: "live", S040: "live",
  S011: "stub", S014: "live", S028: "live",
  S012: "stub", S019: "stub", S020: "stub", S023: "stub", S026: "stub",
  S027: "stub", S031: "stub", S033: "stub", S038: "stub",
  S039: "oos",
};

type HeadlineCard = {
  id: string;
  signal: SignalId;
  category: string;
  zScore: number;
  calls: number;
  window: string;
  snippet: string;
  source: string;
  capturedAt: string;
};

const HEADLINE_CARDS: HeadlineCard[] = [
  {
    id: "hl-1",
    signal: "S004",
    category: "AVC misread queue",
    zScore: 3.2,
    calls: 94,
    window: "trailing 12h",
    snippet:
      "Charged two axles. My car is a Maruti. This is not right.",
    source: "Voice",
    capturedAt: "07:51",
  },
  {
    id: "hl-2",
    signal: "S022",
    category: "Blacklist false positive",
    zScore: 2.1,
    calls: 61,
    window: "trailing 12h",
    snippet: "My balance shows ₹280. Why is the tag blacklisted?",
    source: "Voice",
    capturedAt: "08:04",
  },
  {
    id: "hl-3",
    signal: "S028",
    category: "Recharge failure · debit / no credit",
    zScore: 1.7,
    calls: 48,
    window: "trailing 12h",
    snippet: "Debited from PhonePe but the FASTag app shows zero.",
    source: "Chat",
    capturedAt: "08:12",
  },
];

type ActionRow = {
  id: string;
  signal: SignalId;
  title: string;
  count: number;
  impact: string;
  owner: string;
  partial?: boolean;
};

const HOB_ACTION_QUEUE: ActionRow[] = [
  {
    id: "ha-1",
    signal: "S002",
    title: "Annual Pass misses — 37 calls not prompted yesterday",
    count: 37,
    impact: "₹3,000 pass · est. ₹1.11L missed gross flow",
    owner: "→ Marketing · BPO supervisor",
    partial: true,
  },
  {
    id: "ha-2",
    signal: "S008",
    title: "Fleet intent — 12 conversations ready for corporate desk routing",
    count: 12,
    impact: "Avg fleet wallet · 35 vehicles each",
    owner: "→ Corporate FASTag desk",
    partial: true,
  },
  {
    id: "ha-3",
    signal: "S010",
    title: "Banking interest — 18 mentions · 11 are non-CASA customers",
    count: 18,
    impact: "CASA + car-loan pull-through",
    owner: "→ Branch banking",
    partial: true,
  },
];

const COH_ACTION_QUEUE: ActionRow[] = [
  {
    id: "ca-1",
    signal: "S016",
    title: "OC 005 evidence-pack gap — 23 excess toll refund-eligible calls",
    count: 23,
    impact: "NPCI upload window closes 18:00 IST",
    owner: "→ Trinetra dispute desk",
  },
  {
    id: "ca-2",
    signal: "S014",
    title: "Repeat-call cluster — 41 same-tag callbacks in 14d",
    count: 41,
    impact: "Agent-promise vs delivery gap — KYV unlocks",
    owner: "→ Trinetra afternoon supervisor",
  },
  {
    id: "ca-3",
    signal: "S015",
    title: "Trilingual breach — 9 Marathi/Tamil sessions handled in Hindi",
    count: 9,
    impact: "RBI 30-Sep-2024 letter exposure",
    owner: "→ Anandam Coimbatore floor",
  },
  {
    id: "ca-4",
    signal: "S029",
    title: "Refund SLA breach risk — 14 cases > 5d without disposition",
    count: 14,
    impact: "IO referral risk this week",
    owner: "→ IO desk handoff",
  },
];

const SENTIMENT_DRIFT = [
  { day: "D-29", avc: -0.4, blacklist: -0.2, recharge: 0.1 },
  { day: "D-25", avc: -0.6, blacklist: -0.3, recharge: 0.0 },
  { day: "D-21", avc: -0.9, blacklist: -0.4, recharge: -0.2 },
  { day: "D-17", avc: -1.1, blacklist: -0.6, recharge: -0.3 },
  { day: "D-13", avc: -1.4, blacklist: -0.7, recharge: -0.4 },
  { day: "D-9", avc: -1.6, blacklist: -0.5, recharge: -0.3 },
  { day: "D-5", avc: -1.8, blacklist: -0.6, recharge: -0.2 },
  { day: "Today", avc: -1.8, blacklist: -0.6, recharge: -0.1 },
];

const CHANNEL_QUALITY = [
  { channel: "OEM-fitted", rate: 16.4, median: 10.2, fill: T.red },
  { channel: "Dealer", rate: 11.5, median: 10.2, fill: T.amber },
  { channel: "E-com", rate: 9.8, median: 10.2, fill: T.cyan },
  { channel: "Branch", rate: 8.6, median: 10.2, fill: T.green },
];

const EXCESS_TOLL_SPARK = [
  { w: "W-6", v: 168 },
  { w: "W-5", v: 159 },
  { w: "W-4", v: 174 },
  { w: "W-3", v: 152 },
  { w: "W-2", v: 158 },
  { w: "W-1", v: 146 },
];

type StrategyTile = {
  id: string;
  signal: SignalId;
  title: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "flat";
};

const STRATEGY_TILES: StrategyTile[] = [
  {
    id: "st-gnss",
    signal: "S009",
    title: "GNSS / Barrier-Less mentions",
    value: "14",
    sub: "this week · 57% confusion · 32% awareness · 11% anxiety",
    trend: "up",
  },
  {
    id: "st-campaign",
    signal: "S040",
    title: "Campaign feedback",
    value: "—",
    sub: "No active campaign · last: Annual Pass Apr·26",
    trend: "flat",
  },
  {
    id: "st-faq",
    signal: "S030",
    title: "Annual Pass FAQ gap",
    value: "Top Q",
    sub: '"Will it work on Mumbai-Pune?" · 41 callers',
    trend: "up",
  },
  {
    id: "st-branch",
    signal: "S037",
    title: "Branch handoff friction",
    value: "23",
    sub: "'visit branch' reports this week · ▲6 vs last week",
    trend: "up",
  },
  {
    id: "st-recharge",
    signal: "S011",
    title: "Auto-recharge opt-in rate",
    value: "37%",
    sub: "stated intent · not yet verified · partial signal",
    trend: "flat",
  },
  {
    id: "st-io",
    signal: "S032",
    title: "IO Quarterly Pack",
    value: "71%",
    sub: "last assembled 42d ago · 186 cases · readiness",
    trend: "down",
  },
];

// HoB executive primary — 3 gateway tiles + drill-down pages
type HobExecutiveTileId = HobDrillId;

type HobGatewayTileData = {
  id: HobExecutiveTileId;
  title: string;
  subtitle: string;
  score: number;
  delta: number;
  deltaLabel: string;
  visualTone: string;
  spark: readonly [number, number, number, number, number, number];
  aiInsight: string;
};

const HOB_GATEWAY_TILES: HobGatewayTileData[] = [
  {
    id: "sales_issuance",
    title: "How is the overall FASTag business performing?",
    subtitle: "Toll Volume · Active Tags · Collection",
    score: 72,
    delta: -3,
    deltaLabel: "▼ 3 pts",
    visualTone: "#7B2FF0",
    spark: [52, 44, 60, 50, 66, 72],
    aiInsight:
      "Daily toll transactions held at 11.2M but recharge-to-transaction ratio slipped this week. Dormant tags rose to 16% from 12% WoW. 12 fleet accounts are flagged, making wallet-recharge friction the #1 business detractor.",
  },
  {
    id: "ecosystem_partner",
    title: "What is driving FASTag growth?",
    subtitle: "Acquisition · Recharge · Highway Mix",
    score: 66,
    delta: 4,
    deltaLabel: "+4 pts",
    visualTone: "#FF7043",
    spark: [38, 34, 46, 52, 58, 66],
    aiInsight:
      "Tag acquisition is led by new vehicle sales and the ₹3,000 Annual Pass launch, now 18% of fresh activations. Auto-recharge enrolment is up +31% WoW. Commercial-vehicle volume remains the strongest forward growth lever.",
  },
  {
    id: "operations_escalations",
    title: "Are customer and partner issues affecting business growth?",
    subtitle: "Complaints · SLA · Recurrence",
    score: 59,
    delta: -9,
    deltaLabel: "▼ 9 pts",
    visualTone: "#F59E0B",
    spark: [66, 52, 58, 46, 44, 59],
    aiInsight:
      "Service score fell because double-deduction refunds, blacklist-on-low-balance disputes, and acquirer reconciliation delays are driving repeat contact. 56 disputes are beyond the refund window.",
  },
];

const HOB_TILE_COMPACT_META: Record<
  HobExecutiveTileId,
  {
    micro: string;
    leftGauge: { label: string; value: number };
    rightGauge: { label: string; value: number };
    bottomLeft: { label: string; value: string; valueColor?: string };
    bottomRight: { label: string; value: string; valueColor?: string };
  }
> = {
  sales_issuance: {
    micro: "Volume · Activation · Collection",
    leftGauge: { label: "Active tags", value: 84 },
    rightGauge: { label: "Dormant", value: 16 },
    bottomLeft: { label: "Top volume driver", value: "Highway Toll" },
    bottomRight: { label: "Fleets at-risk", value: "12 accounts", valueColor: "#EF4444" },
  },
  ecosystem_partner: {
    micro: "Acquisition · Recharge · Segment",
    leftGauge: { label: "New tags", value: 58 },
    rightGauge: { label: "Repeat recharge", value: 71 },
    bottomLeft: { label: "Growth driver", value: "Annual Pass", valueColor: "#22C55E" },
    bottomRight: { label: "Top segment", value: "Commercial" },
  },
  operations_escalations: {
    micro: "Complaints · SLA · Recurrence",
    leftGauge: { label: "Resolved in SLA", value: 51 },
    rightGauge: { label: "Repeat contact", value: 44 },
    bottomLeft: { label: "Beyond SLA", value: "56 overdue", valueColor: "#F59E0B" },
    bottomRight: { label: "Top issue", value: "Double Deduct", valueColor: "#EF4444" },
  },
};

const COH_GATEWAY_TILES: HobGatewayTileData[] = [
  {
    id: "sales_issuance",
    title: "Where are customers struggling in the journey?",
    subtitle: "Onboarding · Recharge · Disputes",
    score: 64,
    delta: -5,
    deltaLabel: "▼ 5 pts",
    visualTone: "#7B2FF0",
    spark: [64, 68, 58, 52, 44, 46],
    aiInsight:
      "412 onboarding conversations are stuck on KYC + tag-affixing, the steepest drop-off in the journey. Wallet-recharge failure is #2 friction point. Customer-effort rose to 43% high-effort from 36% WoW.",
  },
  {
    id: "ecosystem_partner",
    title: "Are we resolving issues within SLA?",
    subtitle: "Resolution · FCR · Queue Age",
    score: 58,
    delta: -7,
    deltaLabel: "▼ 7 pts",
    visualTone: "#FF7043",
    spark: [66, 70, 60, 54, 46, 48],
    aiInsight:
      "Within-SLA resolution slipped to 61%, with first-contact resolution at 48%. Refund/double-deduction disputes are slowest, averaging 78h vs a 48h promise; backlog ageing is the leading breach driver.",
  },
  {
    id: "operations_escalations",
    title: "Which issues recur after support responds?",
    subtitle: "Reopens · Repeat Contact · Root Cause",
    score: 55,
    delta: -10,
    deltaLabel: "▼ 10 pts",
    visualTone: "#F59E0B",
    spark: [48, 44, 56, 62, 68, 55],
    aiInsight:
      "Reopen rate climbed to 29%; double-deduction and blacklist-on-low-balance lead recurrence. 312 tickets reopened in 7 days because root causes are not closed at first response.",
  },
];

const COH_TILE_COMPACT_META: Record<
  HobExecutiveTileId,
  {
    micro: string;
    leftGauge: { label: string; value: number };
    rightGauge: { label: string; value: number };
    bottomLeft: { label: string; value: string; valueColor?: string };
    bottomRight: { label: string; value: string; valueColor?: string };
  }
> = {
  sales_issuance: {
    micro: "Onboarding · Recharge · Disputes",
    leftGauge: { label: "High effort", value: 43 },
    rightGauge: { label: "Self-served", value: 57 },
    bottomLeft: { label: "Top friction point", value: "KYC Stall" },
    bottomRight: { label: "Worst stage", value: "Activation", valueColor: "#EF4444" },
  },
  ecosystem_partner: {
    micro: "Resolution · FCR · Queue age",
    leftGauge: { label: "Within SLA", value: 61 },
    rightGauge: { label: "First contact", value: 48 },
    bottomLeft: { label: "Beyond SLA", value: "56 cases", valueColor: "#F59E0B" },
    bottomRight: { label: "Slowest queue", value: "Refunds", valueColor: "#EF4444" },
  },
  operations_escalations: {
    micro: "Reopens · Repeat contact · Root cause",
    leftGauge: { label: "Reopen rate", value: 29 },
    rightGauge: { label: "Repeat contact", value: 44 },
    bottomLeft: { label: "Top repeat issue", value: "Double Deduct", valueColor: "#EF4444" },
    bottomRight: { label: "Reopened (7d)", value: "312 tickets", valueColor: "#EF4444" },
  },
};

const HOB_TILE_TREND_PAD: Record<HobExecutiveTileId, { below: number; above: number }> = {
  sales_issuance: { below: 6, above: 4 },
  ecosystem_partner: { below: 8, above: 5 },
  operations_escalations: { below: 6, above: 4 },
};

/** Short labels for drill page headers (tiles use question-style titles). */
const HOB_DRILL_PAGE_TITLES: Record<HobExecutiveTileId, string> = {
  sales_issuance: "Sales & Issuance Health",
  ecosystem_partner: "Ecosystem & Partner Issues",
  operations_escalations: "Operations & Internal Escalations",
};

const HOB_SUMMARY_KPIS = [
  { label: "Total Issuances Today", value: "4,218", delta: -4.2, deltaLabel: "vs yesterday" },
  { label: "Revenue Today", value: "₹2.34 Cr", delta: 2.1, deltaLabel: "vs yesterday" },
  { label: "Top Call Reason", value: "AVC mismatch / wrong toll class", delta: null as number | null, deltaLabel: "" },
  { label: "Open Flags", value: "7", delta: 2, deltaLabel: "AI-detected today" },
];

const FASTAG_AI_PROMPTS = [
  "What is driving the NH-48 spike this morning and do I need to call the PNO?",
  "How many of yesterday's calls had the Annual Pass offer missed?",
  "Which of my 186 open IO cases are most at risk before 30 June?",
  "Is the Khalapur complaint pattern a one-plaza event or a wider corridor problem?",
  "What is Saksham's conduct compliance rate this week?",
  "Which issuance channel is generating the most Day-1 complaints and why?",
  "Give me a 5-bullet brief for the 10am ops huddle",
];

// COH — shift status + BPO heatmap
type ShiftStat = {
  label: string;
  value: string;
  status: "ok" | "warn" | "bad";
};
const COH_SHIFT: ShiftStat[] = [
  { label: "Active interactions", value: "847 · 1h", status: "ok" },
  { label: "AHT vs 8w baseline", value: "8m 12s · ▲42s", status: "warn" },
  { label: "ASA", value: "47s", status: "ok" },
  { label: "Abandonment", value: "5.8%", status: "warn" },
  { label: "TAT-breached queue", value: "312", status: "bad" },
  { label: "OC 005 gap (today)", value: "23", status: "bad" },
];

type BpoCell = {
  vendor: string;
  shift: string;
  repeatRate: number;
  ocGap: number;
  sentiment: number;
  flag?: "watch" | "alert";
};
const BPO_HEATMAP: BpoCell[] = [
  { vendor: "Trinetra · Hyderabad", shift: "Morning", repeatRate: 14.2, ocGap: 4, sentiment: -0.2 },
  { vendor: "Trinetra · Hyderabad", shift: "Afternoon", repeatRate: 21.6, ocGap: 14, sentiment: -1.1, flag: "alert" },
  { vendor: "Trinetra · Hyderabad", shift: "Night", repeatRate: 12.8, ocGap: 3, sentiment: -0.4 },
  { vendor: "Anandam · Coimbatore", shift: "Morning", repeatRate: 12.1, ocGap: 2, sentiment: -0.1 },
  { vendor: "Anandam · Coimbatore", shift: "Afternoon", repeatRate: 16.4, ocGap: 5, sentiment: -0.6, flag: "watch" },
  { vendor: "Anandam · Coimbatore", shift: "Night", repeatRate: 11.9, ocGap: 1, sentiment: -0.2 },
  { vendor: "Digital · Bengaluru", shift: "Morning", repeatRate: 9.4, ocGap: 0, sentiment: 0.2 },
  { vendor: "Digital · Bengaluru", shift: "Afternoon", repeatRate: 10.8, ocGap: 1, sentiment: 0.1 },
  { vendor: "Digital · Bengaluru", shift: "Night", repeatRate: 9.0, ocGap: 0, sentiment: 0.3 },
];

// Plaza heatmap
type PlazaCell = {
  plaza: string;
  highway: string;
  acquirer: string;
  signals: number;
  intensity: "low" | "med" | "high" | "critical";
};
const PLAZA_CELLS: PlazaCell[] = [
  { plaza: "Khalapur (Mumbai–Pune)", highway: "NH-48", acquirer: "ICICI", signals: 87, intensity: "critical" },
  { plaza: "Talegaon (Mumbai–Pune)", highway: "NH-48", acquirer: "ICICI", signals: 61, intensity: "high" },
  { plaza: "Nelamangala", highway: "NH-48", acquirer: "Axis", signals: 42, intensity: "med" },
  { plaza: "Devanahalli", highway: "NH-44", acquirer: "Axis", signals: 31, intensity: "med" },
  { plaza: "Manesar", highway: "NH-48", acquirer: "ICICI", signals: 28, intensity: "med" },
  { plaza: "Karnal", highway: "NH-44", acquirer: "SBI", signals: 19, intensity: "low" },
  { plaza: "Krishnagiri", highway: "NH-44", acquirer: "Axis", signals: 17, intensity: "low" },
  { plaza: "Vijayawada", highway: "NH-16", acquirer: "ICICI", signals: 14, intensity: "low" },
  { plaza: "Gurgaon Toll", highway: "NH-48", acquirer: "ICICI", signals: 8, intensity: "low" },
];

// IO Evidence Pack queue
type EvidencePack = {
  caseId: string;
  customer: string;
  category: string;
  ageDays: number;
  evidence: { call: boolean; chat: boolean; email: boolean; agentNote: boolean };
  riskBand: "high" | "med" | "low";
  status: "queued" | "assembling" | "ready";
};
const EVIDENCE_PACKS: EvidencePack[] = [
  {
    caseId: "CASE-4421",
    customer: "Anil Kumar · TXN-8821",
    category: "AVC misread · Khalapur",
    ageDays: 48,
    evidence: { call: true, chat: true, email: false, agentNote: true },
    riskBand: "high",
    status: "queued",
  },
  {
    caseId: "CASE-4198",
    customer: "Priya Menon · TXN-7714",
    category: "Recharge debit, no credit",
    ageDays: 42,
    evidence: { call: true, chat: false, email: true, agentNote: true },
    riskBand: "high",
    status: "queued",
  },
  {
    caseId: "CASE-4136",
    customer: "Suresh R · TXN-7402",
    category: "Blacklist false-positive",
    ageDays: 33,
    evidence: { call: true, chat: true, email: false, agentNote: false },
    riskBand: "med",
    status: "ready",
  },
  {
    caseId: "CASE-3989",
    customer: "Lakshmi N · TXN-7211",
    category: "Negative balance · Saksham",
    ageDays: 29,
    evidence: { call: true, chat: false, email: false, agentNote: true },
    riskBand: "med",
    status: "queued",
  },
  {
    caseId: "CASE-3874",
    customer: "Manjit S · TXN-6801",
    category: "Refund SLA breach",
    ageDays: 21,
    evidence: { call: true, chat: true, email: true, agentNote: true },
    riskBand: "low",
    status: "ready",
  },
];

// Compliance watch
type ComplianceItem = {
  id: string;
  label: string;
  metric: string;
  trend: "up" | "down" | "flat";
  band: "ok" | "watch" | "breach";
  note: string;
};
const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "cw-saksham",
    label: "Saksham Recovery conduct",
    metric: "3 calls flagged · 24h",
    trend: "up",
    band: "breach",
    note: "Aggressive-language pattern · 2 calls after 19:00 IST",
  },
  {
    id: "cw-trilingual",
    label: "Trilingual rule",
    metric: "9 sessions · 24h",
    trend: "up",
    band: "watch",
    note: "Marathi/Tamil preferences handled in Hindi · Anandam afternoon",
  },
  {
    id: "cw-kyv",
    label: "KYV root-cause check",
    metric: "82% adherence · today",
    trend: "down",
    band: "watch",
    note: "Trinetra afternoon cohort below 80% target — unlock-without-KYV pattern",
  },
  {
    id: "cw-tat",
    label: "TAT promise adherence",
    metric: "91% · shift",
    trend: "flat",
    band: "ok",
    note: "14 refund-promised calls aged > 5 days flagged separately in action queue",
  },
  {
    id: "cw-rbios",
    label: "RB-IOS readiness · 30-Jun cutoff",
    metric: "71%",
    trend: "up",
    band: "watch",
    note: "186 cases · 54 missing one or more evidence channels",
  },
  {
    id: "cw-annual",
    label: "Annual Pass mis-disclosure",
    metric: "0 · 7d",
    trend: "flat",
    band: "ok",
    note: "No commercial-vehicle mis-sell events in trailing week",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// SMALL PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────
function Panel({
  title,
  subtitle,
  action,
  children,
  glow,
  className = "",
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  glow?: boolean;
  className?: string;
}) {
  const FT = useFT();
  return (
    <section
      className={className}
      style={{
        background: FT.card,
        border: `1px solid ${FT.border}`,
        borderRadius: 14,
        padding: 18,
        boxShadow: glow ? FT.panelShadow : undefined,
      }}
    >
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ minWidth: 0 }}>
            {title && (
              <div style={{ fontSize: 14, fontWeight: 700, color: FT.text, letterSpacing: 0.2 }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ fontSize: 12, color: FT.textSec, marginTop: 4, lineHeight: 1.5 }}>{subtitle}</div>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Visible Fluid / AI marker on generated insights (meeting feedback §2). */
function AiGeneratedMark({ compact = false }: { compact?: boolean }) {
  const FT = useFT();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: compact ? 9 : 10,
        fontWeight: 700,
        color: FT.primary,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <Sparkles size={compact ? 10 : 11} color={FT.primary} />
      {compact ? "AI" : "AI-generated"}
    </span>
  );
}

function Pill({
  children,
  tone = "neutral",
  size = "sm",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "cyan" | "urgency" | "ok" | "warn" | "bad";
  size?: "xs" | "sm";
}) {
  const FT = useFT();
  const palette: Record<string, [string, string, string]> = {
    neutral: [FT.textSec, FT.pillNeutralBg, FT.pillNeutralBorder],
    primary: [FT.primary, FT.primarySoft, FT.primaryBorder],
    cyan: [FT.accent, FT.accentSoft, "rgba(0,212,255,0.32)"],
    urgency: [FT.urgency, FT.urgencySoft, "rgba(255,112,67,0.32)"],
    ok: [FT.green, FT.greenSoft, "rgba(34,197,94,0.32)"],
    warn: [FT.amber, FT.amberSoft, "rgba(245,158,11,0.32)"],
    bad: [FT.red, FT.redSoft, "rgba(239,68,68,0.32)"],
  };
  const [fg, bg, br] = palette[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: bg,
        color: fg,
        border: `1px solid ${br}`,
        borderRadius: 999,
        padding: size === "xs" ? "2px 8px" : "4px 10px",
        fontSize: size === "xs" ? 10 : 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ProvenancePill({ count, window: w, confidence }: { count: number; window: string; confidence: "High" | "Medium" | "Low" }) {
  const tone = confidence === "High" ? "ok" : confidence === "Medium" ? "warn" : "bad";
  return (
    <span title={`${count} interactions · ${w} · confidence ${confidence}`}>
      <Pill tone={tone} size="xs">
        {count.toLocaleString()} · {w} · {confidence}
      </Pill>
    </span>
  );
}

function Spark({ data, color, gradId }: { data: { w: string; v: number }[]; color: string; gradId?: string }) {
  const reactId = useId().replace(/:/g, "");
  const gradientId = gradId ?? `spk-grad-${reactId}`;
  return (
    <div style={{ width: "100%", height: 60 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HoB — EXECUTIVE PRIMARY (Head of Credit Cards ExecutiveView pattern)
// ─────────────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  return null;
}

function withAlpha(hex: string, a: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${a})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

function trendLineColorFromSpark(spark: number[], FT: FastagPalette): string {
  const diff = spark[spark.length - 1] - spark[0];
  const flatBand = 1;
  if (diff > flatBand) return FT.green;
  if (diff < -flatBand) return FT.red;
  return FT.amber;
}

function MiniHalfGaugeFt({ label, value, color, trackFill }: { label: string; value: number; color: string; trackFill: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: clamped, fill: color }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0, gap: 6 }}>
      <div style={{ position: "relative", width: "100%", height: 58 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} startAngle={180} endAngle={0} innerRadius={32} outerRadius={46} cx="50%" cy="100%">
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: trackFill }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 2,
            transform: "translateX(-50%)",
            fontSize: 14,
            fontWeight: 800,
            color,
            fontFamily: "var(--mono)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {clamped}%
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "inherit",
          opacity: 0.72,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          lineHeight: 1.2,
          minHeight: 30,
          paddingTop: 2,
          width: "100%",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FastagAiInsightCallout({ text, accent }: { text: string; accent: string }) {
  const FT = useFT();
  return (
    <div
      style={{
        background: FT.elevated,
        borderRadius: 10,
        padding: "14px 16px",
        borderTop: `1px solid ${FT.borderLight}`,
        borderRight: `1px solid ${FT.borderLight}`,
        borderBottom: `1px solid ${FT.borderLight}`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={12} color={accent} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Conversation AI
          </span>
        </div>
        <AiGeneratedMark compact />
      </div>
      <p style={{ fontSize: 12.5, color: FT.textSec, lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}

function HobGatewayTile({
  tile,
  onOpen,
  compactMetaMap = HOB_TILE_COMPACT_META,
}: {
  tile: HobGatewayTileData;
  onOpen: () => void;
  compactMetaMap?: Record<
    HobExecutiveTileId,
    {
      micro: string;
      leftGauge: { label: string; value: number };
      rightGauge: { label: string; value: number };
      bottomLeft: { label: string; value: string; valueColor?: string };
      bottomRight: { label: string; value: string; valueColor?: string };
    }
  >;
}) {
  const FT = useFT();
  const gradUid = useId().replace(/:/g, "");
  const visualTone = tile.visualTone;
  const TileIcon = tile.id === "sales_issuance" ? Target : tile.id === "ecosystem_partner" ? Flame : Shield;
  const m = compactMetaMap[tile.id];
  const trendPad = HOB_TILE_TREND_PAD[tile.id];
  const trendData = tile.spark.map((v, i) => ({ w: `D${i + 1}`, v }));
  const trendLineColor = trendLineColorFromSpark([...tile.spark], FT);
  const gaugeTrack = withAlpha(FT.border, 0.65);
  const defaultTileShadow = `0 8px 32px ${withAlpha(visualTone, 0.082)}`;
  const hoverTileShadow = `0 0 0 2px ${visualTone}, 0 8px 28px ${withAlpha(visualTone, 0.133)}`;
  const deltaColor = tile.delta < 0 ? FT.red : FT.green;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: "left",
        background: FT.elevated,
        border: `1px solid ${withAlpha(visualTone, 0.25)}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        cursor: "pointer",
        transition: "all 0.25s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        minWidth: 0,
        boxShadow: defaultTileShadow,
        color: FT.text,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = hoverTileShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = defaultTileShadow;
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: withAlpha(visualTone, 0.12),
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <TileIcon size={18} color={visualTone} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: FT.text,
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tile.title}
          </div>
          <div style={{ fontSize: 11, color: FT.textMut, marginTop: 4, lineHeight: 1.35 }}>{m.micro}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 12,
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <div style={{ minWidth: 0, position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              fontSize: 12,
              color: deltaColor,
              fontWeight: 700,
              fontFamily: "var(--mono)",
            }}
          >
            {tile.delta >= 0 ? "+" : ""}
            {tile.delta} pts
          </span>
          <div style={{ marginBottom: 6, paddingRight: 56 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: FT.text, fontFamily: "var(--mono)", lineHeight: 1 }}>
              {tile.score}
            </div>
          </div>
          <div style={{ width: "100%", flex: 1, minHeight: 88 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`hob-grad-${gradUid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendLineColor} stopOpacity={0.42} />
                    <stop offset="55%" stopColor={trendLineColor} stopOpacity={0.16} />
                    <stop offset="100%" stopColor={trendLineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="w" hide />
                <YAxis
                  hide
                  domain={[
                    (min: number) => Math.max(0, min - trendPad.below),
                    (max: number) => max + trendPad.above,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={trendLineColor}
                  strokeWidth={3}
                  fill={`url(#hob-grad-${gradUid})`}
                  fillOpacity={1}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, color: FT.textMut }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <MiniHalfGaugeFt label={m.leftGauge.label} value={m.leftGauge.value} color={trendLineColor} trackFill={gaugeTrack} />
            <MiniHalfGaugeFt
              label={m.rightGauge.label}
              value={Math.min(100, m.rightGauge.value)}
              color={tile.id === "ecosystem_partner" ? FT.urgency : FT.amber}
              trackFill={gaugeTrack}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 12px",
              paddingTop: 10,
              borderTop: `1px solid ${FT.borderLight}`,
            }}
          >
            {[m.bottomLeft, m.bottomRight].map((b) => (
              <div key={b.label}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>{b.label}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--mono)",
                    marginTop: 4,
                    color: b.valueColor ?? FT.text,
                  }}
                >
                  {b.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FastagAiInsightCallout text={tile.aiInsight} accent={visualTone} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 4,
          fontSize: 12,
          fontWeight: 700,
          color: visualTone,
        }}
      >
        View details <ArrowRight size={14} />
      </div>
    </button>
  );
}

type ExecutivePulseItem = {
  q: string;
  main: string;
  pill: string;
  tone: string;
};

function ExecutiveBriefStrip({ summary }: { summary: string }) {
  const FT = useFT();
  return (
    <div
      style={{
        background: FT.elevated,
        borderRadius: 10,
        padding: "10px 12px",
        border: `1px solid ${FT.borderLight}`,
        boxShadow: `0 0 0 1px ${FT.amber}12 inset`,
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={13} color={FT.amber} />
          <span style={{ fontSize: 13, fontWeight: 700, color: FT.amber, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Executive Brief
          </span>
        </div>
        <AiGeneratedMark compact />
      </div>
      <div style={{ marginTop: 7, fontSize: 13.5, color: FT.textSec, lineHeight: 1.4 }}>{summary}</div>
    </div>
  );
}

const PROCESS_GAP_INSIGHTS = [
  {
    gap: "Vehicle class set at fitment",
    call: "Issued two-wheeler tag on my four-wheeler",
    process: "KYV / vehicle-class verification missing at OEM fitment",
    impact: "1.6× Day-1 complaints on OEM channel",
  },
  {
    gap: "Plaza AVC sensor calibration",
    call: "Charged ₹220 instead of ₹110 at Khalapur",
    process: "Acquirer-side axle-class sensor — not bank dispute workflow",
    impact: "87 signals · NH-48 corridor · IDFC FIRST acquirer",
  },
  {
    gap: "Annual Pass not offered on recharge",
    call: "I drive Pune three times a week — nobody mentioned the pass",
    process: "Agent script miss on 3rd+ recharge trigger",
    impact: "37 missed prompts yesterday · ₹1.11L flow at risk",
  },
];

function ProcessGapInsightsPanel() {
  const FT = useFT();
  return (
    <Panel
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          Process gaps from customer calls
          <AiGeneratedMark compact />
        </span>
      }
      subtitle="Every call maps to a fixable process step — Fluid CX surfaces gaps for operations and compliance"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {PROCESS_GAP_INSIGHTS.map((row) => (
          <div
            key={row.gap}
            style={{
              background: FT.elevated,
              border: `1px solid ${FT.borderLight}`,
              borderLeft: `3px solid ${FT.primary}`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: FT.text, marginBottom: 6 }}>{row.gap}</div>
            <div style={{ fontSize: 11, color: FT.accent, fontStyle: "italic", lineHeight: 1.45, marginBottom: 8 }}>
              “{row.call}”
            </div>
            <div style={{ fontSize: 11, color: FT.textSec, lineHeight: 1.45 }}>
              <strong style={{ color: FT.text }}>Process:</strong> {row.process}
            </div>
            <div style={{ fontSize: 11, color: FT.textMut, marginTop: 6 }}>{row.impact}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ExecutivePulseStrip({
  items,
  variant = "default",
}: {
  items: ExecutivePulseItem[];
  variant?: "default" | "partition";
}) {
  const FT = useFT();
  const isPartition = variant === "partition";
  const partitionCardBg = FT.bg === FT_LIGHT.bg ? "rgba(26,26,46,0.04)" : "rgba(255,255,255,0.03)";

  return (
    <div
      style={{
        background: FT.elevated,
        borderRadius: 10,
        padding: "12px 14px",
        borderTop: `1px solid ${FT.borderLight}`,
        borderRight: `1px solid ${FT.borderLight}`,
        borderBottom: `1px solid ${FT.borderLight}`,
        borderLeft: `3px solid ${FT.amber}`,
        marginBottom: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isPartition ? (
            <span style={{ fontSize: 13, color: FT.amber }}>✨</span>
          ) : (
            <Sparkles size={13} color={FT.amber} />
          )}
          <span style={{ fontSize: 12, fontWeight: 700, color: FT.amber, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Executive Pulse
          </span>
        </div>
        <AiGeneratedMark compact />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {items.map((item, idx) => (
          <div
            key={item.q}
            style={{
              background: isPartition ? partitionCardBg : FT.card,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 8,
              padding: "9px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: isPartition ? "#b7a6ff" : FT.primary,
                  lineHeight: 1.35,
                }}
              >
                {idx + 1}. {item.q}
              </div>
              {!isPartition && item.pill ? (
                <span style={{ fontSize: 10, fontWeight: 700, color: item.tone, whiteSpace: "nowrap" }}>{item.pill}</span>
              ) : null}
            </div>
            <div style={{ fontSize: 13.5, color: FT.textSec, lineHeight: 1.35, fontWeight: 600 }}>{item.main}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HobSummaryKpiStrip() {
  const FT = useFT();
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: FT.headerBackdrop,
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        border: `1px solid ${FT.border}`,
        padding: "12px 14px",
        marginBottom: 4,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
        {HOB_SUMMARY_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: FT.elevated,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 10,
              padding: "10px 12px",
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: FT.text, fontFamily: "var(--mono)", lineHeight: 1.2, marginBottom: 4 }}>
              {kpi.value}
            </div>
            {kpi.delta !== null ? (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color:
                    kpi.label === "Revenue Today"
                      ? kpi.delta >= 0
                        ? FT.green
                        : FT.red
                      : kpi.label === "Open Flags"
                        ? kpi.delta > 0
                          ? FT.red
                          : FT.green
                        : kpi.delta >= 0
                          ? FT.green
                          : FT.red,
                }}
              >
                {kpi.delta >= 0 ? "+" : ""}
                {kpi.delta}%
                {kpi.deltaLabel ? <span style={{ color: FT.textMut, fontWeight: 500 }}> {kpi.deltaLabel}</span> : null}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: FT.textMut }}>#1 today</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HobExecutivePulseStrip() {
  const { period } = useFastagPeriod();
  const lines = periodPulseLines(period);
  const pulse: ExecutivePulseItem[] = [
    { q: "🔴 What's critical", main: lines[0], pill: "", tone: "" },
    { q: "🎯 Where's your focus", main: lines[1], pill: "", tone: "" },
    { q: "🟢 What's stable/ on-track", main: lines[2], pill: "", tone: "" },
  ];
  return <ExecutivePulseStrip items={pulse} variant="partition" />;
}

function CohExecutiveBriefStrip() {
  return (
    <ExecutiveBriefStrip summary="CX board tracks three outcomes: where customers struggle in journey, whether SLA promise is being kept, and which resolved issues are still recurring after support response." />
  );
}

function CohExecutivePulseStrip() {
  const pulse: ExecutivePulseItem[] = [
    {
      q: "🔴 What's critical",
      main: "1 in 3 new users stall at KYC/tag-affixing; onboarding friction is the #1 journey detractor and frustration sentiment is climbing.",
      pill: "",
      tone: "",
    },
    {
      q: "🎯 Where's your focus",
      main: "Refund-dispute resolution is breaching SLA at 34%, up from 26% WoW, with 56 double-deduction cases ageing past the promise window.",
      pill: "",
      tone: "",
    },
    {
      q: "🟢 What's stable / on-track",
      main: "App-channel CSAT is steady at 4.1/5 vs IVR 3.4; self-serve deflection is holding while #FASTagFail movement is monitored.",
      pill: "",
      tone: "",
    },
  ];
  return <ExecutivePulseStrip items={pulse} variant="partition" />;
}

function mockFastagAIAnswer(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("pno") || l.includes("nh-48") || l.includes("khalapur"))
    return "All 87 Khalapur signals point to IDFC FIRST's AVC sensor on NH-48 — vehicle class misread, not a Vahan Bank dispute process failure. Social flare (62 mentions, auto journalist amplifying) is geo-clustered to the same plaza. Brief the PNO before 9am with: plaza = Khalapur, acquirer = IDFC FIRST, volume = 94 calls in 12h at 3.2× baseline. Do not issue public statement until acquirer confirms sensor recalibration window.";
  if (l.includes("annual pass") || l.includes("missed"))
    return "37 calls yesterday met the Annual Pass trigger (3rd+ recharge in 30 days OR commute mention) and the agent did not surface the ₹3,000 offer. At ₹3,000 per pass, that is ₹1.11L in missed gross flow from yesterday alone. Top trigger phrase missed: 'I drive to Pune three times a week' — agent processed the recharge without asking about toll frequency.";
  if (l.includes("io") || l.includes("june") || l.includes("evidence"))
    return "54 of your 186 open cases are below 70% evidence readiness. The 4 highest-risk: Case 4421 (38% ready, 18 days old, 6 days to IO review), Case 7803 (52%, 12 days old), Case 2219 (61%, 7 days old), Case 5534 (64%, 9 days old). Auto-assembling all 54 takes under 3 minutes in Fluid CX — the IO desk samples oldest cases first.";
  if (l.includes("corridor") || l.includes("pattern") || l.includes("one plaza"))
    return "This is a corridor pattern, not a single plaza event. Khalapur (87 signals), Talegaon (61 signals), and Manesar (28 signals) are all NH-48 and all share the IDFC FIRST acquirer. The pattern is AVC sensor firmware — the same sensor version is deployed across that corridor. Nelamangala and Devanahalli (Axis acquirer, NH-44) are clean. This is an acquirer-specific infrastructure issue.";
  if (l.includes("saksham") || l.includes("conduct"))
    return "1 conduct flag this shift: SK-07 (Rajesh Bhosale), call at 19:42 IST — post-permitted-hours + employer threat language. Aggressive-language confidence: High. 2 prior calls from this agent in the trailing 7 days were clean. Route this to Compliance via the Saksham governance contract within 30 minutes. Fluid CX does not act on the recovery workflow directly.";
  if (l.includes("issuance") || l.includes("channel") || l.includes("day-1"))
    return "OEM-fitted tags are generating 16.4 complaints per 1,000 tags in the first 30 days — 1.6× the cohort median of 10.2. Root cause: 3 of 5 OEM partners are not running KYV vehicle-class verification at fitment, so the class is set by the dealer's guess. Dealer channel is at 11.5× (above median but improving). E-com and Branch are within range.";
  if (l.includes("huddle") || l.includes("brief") || l.includes("10am"))
    return "5-bullet ops huddle brief:\n1. NH-48 Khalapur AVC cluster (94 calls, 3.2×) — IDFC FIRST acquirer, PNO briefed, no Vahan Bank action pending\n2. RB-IOS: 54 cases below 70% evidence readiness, 32 days to deadline — COH assembling packs today\n3. PhonePe gateway: 23 recharge failures in 30 min — Tech monitoring, below escalation threshold\n4. Annual Pass: 37 missed prompts yesterday — script refresh for afternoon shift\n5. Saksham conduct flag: 1 case routed to Compliance — SK-07, post-hours call";
  return "Synthesising from Fluid CX conversation data across Voice, Chat, Social, and 1033 streams. Try one of the suggested prompts or ask specifically about a plaza, signal, or deadline.";
}

function FastagAIDayGenerator({ hidden = false }: { hidden?: boolean }) {
  const FT = useFT();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);

  if (hidden) return null;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setPrompt("");
    setBusy(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `✨ Based on current conversation data across Voice, Chat, Social, and 1033 streams:\n\n${mockFastagAIAnswer(text)}`,
        },
      ]);
      setBusy(false);
    }, 900);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="AI Day Generator — Ask anything about your FASTag portfolio"
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: "none",
            background: `linear-gradient(135deg, ${FT.primary} 0%, #5532D6 100%)`,
            color: "#ffffff",
            boxShadow: `0 12px 30px ${FT.primarySoft}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <Sparkles size={22} />
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 420,
            maxHeight: "78vh",
            background: FT.elevated,
            border: `1px solid ${FT.primaryBorder}`,
            borderRadius: 16,
            boxShadow: FT.toastShadow,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: `linear-gradient(135deg, ${FT.primarySoft} 0%, ${FT.accentSoft} 100%)`,
              borderBottom: `1px solid ${FT.borderLight}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color={FT.primary} />
              <div>
                <div style={{ fontSize: 13, color: FT.text, fontWeight: 800 }}>AI Day Generator · FASTag</div>
                <div style={{ fontSize: 10, color: FT.textMut }}>Head of Business · Vahan Bank</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", color: FT.textSec, cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <>
                <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>
                  Ask me about your FASTag portfolio — listening across Voice, Chat, Social, and 1033.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {FASTAG_AI_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      style={{
                        textAlign: "left",
                        background: FT.surface,
                        borderTop: `1px solid ${FT.border}`,
                        borderRight: `1px solid ${FT.border}`,
                        borderBottom: `1px solid ${FT.border}`,
                        borderLeft: `2px solid ${FT.primary}`,
                        color: FT.textSec,
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        cursor: "pointer",
                        lineHeight: 1.4,
                      }}
                    >
                      <Sparkles size={10} color={FT.primary} style={{ marginRight: 5, marginBottom: -1 }} />
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === "user" ? FT.accentSoft : FT.primarySoft,
                  border: `1px solid ${m.role === "user" ? FT.accent : FT.primary}40`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontSize: 11.5,
                  color: FT.text,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: m.role === "user" ? FT.accent : FT.primary,
                    marginBottom: 3,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {m.role === "user" ? "You" : "AI"}
                </div>
                {m.text}
              </div>
            ))}
            {busy && (
              <div style={{ fontSize: 11, color: FT.textMut, display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={11} />
                <span>Synthesising conversation data…</span>
              </div>
            )}
          </div>

          <div style={{ padding: 10, borderTop: `1px solid ${FT.borderLight}`, display: "flex", gap: 6 }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(prompt);
              }}
              placeholder="Ask about NH-48, IO cases, issuance channels…"
              style={{
                flex: 1,
                background: FT.surface,
                border: `1px solid ${FT.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: FT.text,
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => send(prompt)}
              style={{
                background: FT.primary,
                border: "none",
                borderRadius: 8,
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CohPrimaryView({
  onTileOpen,
}: {
  onTileOpen: (tileId: HobExecutiveTileId) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CohExecutivePulseStrip />
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, alignItems: "stretch" }}>
        {COH_GATEWAY_TILES.map((tile) => (
          <HobGatewayTile key={tile.id} tile={tile} onOpen={() => onTileOpen(tile.id)} compactMetaMap={COH_TILE_COMPACT_META} />
        ))}
      </section>
    </div>
  );
}

function HobPrimaryView({ onTileOpen }: { onTileOpen: (tileId: HobExecutiveTileId) => void }) {
  const FT = useFT();
  const { period } = useFastagPeriod();
  const { tiles, compactMetaMap } = useMemo(() => {
    const nextCompact = { ...HOB_TILE_COMPACT_META };
    const nextTiles = HOB_GATEWAY_TILES.map((tile) => {
      const meta = HOB_TILE_COMPACT_META[tile.id];
      const snap = resolveGatewayTile(
        tile.id,
        {
          score: tile.score,
          delta: tile.delta,
          deltaLabel: tile.deltaLabel,
          spark: [...tile.spark],
          aiInsight: tile.aiInsight,
          compact: { leftGauge: meta.leftGauge.value, rightGauge: meta.rightGauge.value },
        },
        period,
      );
      if (snap.compact) {
        nextCompact[tile.id] = {
          ...meta,
          leftGauge: { ...meta.leftGauge, value: snap.compact.leftGauge },
          rightGauge: { ...meta.rightGauge, value: snap.compact.rightGauge },
        };
      }
      return {
        ...tile,
        score: snap.score,
        delta: snap.delta,
        deltaLabel: snap.deltaLabel,
        spark: snap.spark as unknown as HobGatewayTileData["spark"],
        aiInsight: snap.aiInsight,
      };
    });
    return { tiles: nextTiles, compactMetaMap: nextCompact };
  }, [period]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <style>{`
        .fastag-hob-tiles {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          align-items: stretch;
        }
        @media (max-width: 1180px) {
          .fastag-hob-tiles { grid-template-columns: 1fr; }
        }
      `}</style>
      <HobExecutivePulseStrip />
      <section className="fastag-hob-tiles">
        {tiles.map((tile) => (
          <HobGatewayTile key={tile.id} tile={tile} compactMetaMap={compactMetaMap} onOpen={() => onTileOpen(tile.id)} />
        ))}
      </section>
      <FastagRiskSpikeMonitor tokens={FT} />
      <FastagAiInsightsSection tokens={FT} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HoB — LEGACY WIDGETS (drills / COH / shared screens)
// ─────────────────────────────────────────────────────────────────────────
function HeadlineBrief({ onPick, liveLabel, timeWindow }: { onPick: (c: HeadlineCard) => void; liveLabel: string; timeWindow: TimeWindow }) {
  const FT = useFT();
  return (
    <Panel
      title="Today's Headline — top 3 growing this morning"
      subtitle={`Vs 8-week baseline · ${TIME_WINDOW_LABEL[timeWindow]} · computed at 08:30 · refreshes live`}
      action={
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: FT.accent }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: FT.accent, boxShadow: `0 0 12px ${FT.accent}` }} />
          {liveLabel}
        </span>
      }
      glow
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {HEADLINE_CARDS.map((c) => {
          const isCritical = c.zScore >= 3;
          const tone = isCritical ? FT.urgency : c.zScore >= 2 ? FT.amber : FT.accent;
          return (
            <button
              key={c.id}
              onClick={() => onPick(c)}
              // Stage 4 §C Storyline 1 T+20s — banker hovers to see provenance
              // before clicking. Pre-clicking provenance previews count + window
              // + confidence in the native title tooltip.
              title={`${c.calls.toLocaleString()} interactions · ${c.window} · High confidence · intent-classifier v1.4.2`}
              style={{
                textAlign: "left",
                background: FT.elevated,
                border: `1px solid ${isCritical ? "rgba(255,112,67,0.35)" : FT.borderLight}`,
                borderLeft: `4px solid ${tone}`,
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                color: FT.text,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Pill tone={isCritical ? "urgency" : "cyan"} size="xs">
                  {c.zScore.toFixed(1)}× baseline
                </Pill>
                <ProvenancePill count={c.calls} window={c.window} confidence="High" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: FT.text, marginBottom: 12 }}>{c.category}</div>
              <div
                style={{
                  fontSize: 12,
                  color: FT.accent,
                  fontStyle: "italic",
                  borderLeft: `2px solid ${FT.accent}`,
                  paddingLeft: 10,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                “{c.snippet}”
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>
                <span>{c.source} · {c.capturedAt}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: FT.primary, fontWeight: 700 }}>
                  Drill in <ChevronRight size={12} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function ActionQueueList({ rows, onPick }: { rows: ActionRow[]; onPick: (r: ActionRow) => void }) {
  const FT = useFT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => (
        <button
          key={r.id}
          onClick={() => onPick(r)}
          style={{
            textAlign: "left",
            background: FT.elevated,
            border: `1px solid ${FT.borderLight}`,
            borderRadius: 10,
            padding: 14,
            cursor: "pointer",
            color: FT.text,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: FT.primarySoft,
              border: `1px solid ${FT.primaryBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: FT.primary }}>{r.count}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: FT.text, marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontSize: 11, color: FT.textSec }}>
              {r.impact} · <span style={{ color: FT.accent }}>{r.owner}</span>
              {r.partial ? (
                <span style={{ marginLeft: 8, color: FT.amber, fontWeight: 700 }}>[INFERRED]</span>
              ) : null}
            </div>
          </div>
          <ChevronRight size={16} color={FT.textMut} />
        </button>
      ))}
    </div>
  );
}

function ExcessTollRefundIntel({ onPick }: { onPick: (r: ActionRow) => void }) {
  const FT = useFT();
  return (
    <Panel
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          Excess toll refund intelligence
          <AiGeneratedMark compact />
        </span>
      }
      subtitle="Wrong toll amount or double deduction — conversation-side leading indicator"
    >
      <button
        onClick={() =>
          onPick({
            id: "cb-s013",
            signal: "S013",
            title: "Excess toll refund potential — 146 eligible calls this week",
            count: 146,
            impact: "Conversation-side only · full ratio needs NPCI feed",
            owner: "→ HoB / NPCI dispute desk",
            partial: true,
          })
        }
        style={{
          width: "100%",
          textAlign: "left",
          background: FT.elevated,
          border: `1px solid ${FT.borderLight}`,
          borderRadius: 10,
          padding: 14,
          marginBottom: 10,
          cursor: "pointer",
          color: FT.text,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: FT.textSec, fontWeight: 600 }}>Dispute potential · this week</span>
          <Pill tone="warn" size="xs">PARTIAL</Pill>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: FT.text, marginBottom: 4 }}>146</div>
        <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 10 }}>
          Excess toll refund-eligible calls · conversation-side only · [Full ratio needs NPCI feed]
        </div>
        <Spark data={EXCESS_TOLL_SPARK} color={FT.accent} gradId="spk-grad-dispute" />
      </button>
      <button
        onClick={() =>
          onPick({
            id: "cb-s001",
            signal: "S001",
            title: "Tag closure or issuer-switch intent — 23 calls (trailing 30d)",
            count: 23,
            impact: "0.8× baseline · within range",
            owner: "→ HoB · Marketing",
          })
        }
        style={{
          width: "100%",
          textAlign: "left",
          background: FT.elevated,
          border: `1px solid ${FT.borderLight}`,
          borderRadius: 10,
          padding: 14,
          cursor: "pointer",
          color: FT.text,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: FT.textSec, fontWeight: 600 }}>Closure / switch intent · 30d</span>
          <Pill tone="ok" size="xs">0.8× baseline</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: FT.text }}>23</div>
          <div style={{ fontSize: 11, color: FT.textSec }}>calls — IDFC FIRST / Axis / ICICI mentions</div>
        </div>
      </button>
    </Panel>
  );
}

function ChannelQualityBar() {
  const FT = useFT();
  return (
    <Panel
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          Channel issuance complaint rate (first 30 days)
          <AiGeneratedMark compact />
        </span>
      }
      subtitle="Complaints per 1,000 tags in the first 30 days of tag life"
    >
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHANNEL_QUALITY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={FT.border} vertical={false} />
            <XAxis dataKey="channel" stroke={FT.textMut} tick={{ fontSize: 11 }} />
            <YAxis stroke={FT.textMut} tick={{ fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{ background: FT.elevated, border: `1px solid ${FT.border}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: FT.text }}
              cursor={{ fill: FT.chartCursorFill }}
            />
            <ReferenceLine y={10.2} stroke={FT.textMut} strokeDasharray="4 4" />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
              {CHANNEL_QUALITY.map((row) => (
                <Cell key={row.channel} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function SentimentDriftChart({ onExplore }: { onExplore: () => void }) {
  const FT = useFT();
  return (
    <Panel
      title="Sentiment Drift — early warning"
      subtitle="Top 3 categories vs 8-week baseline · ±1σ shaded zone · z-score in std deviations"
      action={
        <button
          onClick={onExplore}
          style={{
            background: FT.primarySoft,
            color: FT.primary,
            border: `1px solid ${FT.primaryBorder}`,
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Explore <ArrowRight size={12} />
        </button>
      }
    >
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SENTIMENT_DRIFT} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={FT.border} vertical={false} />
            <XAxis dataKey="day" stroke={FT.textMut} tick={{ fontSize: 11 }} />
            <YAxis stroke={FT.textMut} tick={{ fontSize: 11 }} domain={[-2.5, 1]} />
            <ReferenceLine y={1} stroke={FT.greenSoft} strokeDasharray="2 4" />
            <ReferenceLine y={-1} stroke={FT.amberSoft} strokeDasharray="2 4" />
            <RechartsTooltip
              contentStyle={{ background: FT.elevated, border: `1px solid ${FT.border}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: FT.text }}
            />
            <Line dataKey="avc" name="AVC misread" stroke={FT.urgency} strokeWidth={2} dot={false} />
            <Line dataKey="blacklist" name="Blacklist FP" stroke={FT.amber} strokeWidth={2} dot={false} />
            <Line dataKey="recharge" name="Recharge mismatch" stroke={FT.accent} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: FT.textMut, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <span><span style={{ display: "inline-block", width: 10, height: 2, background: FT.urgency, verticalAlign: "middle", marginRight: 6 }} />AVC misread — sustained −1.8σ for 6 days</span>
        <span><span style={{ display: "inline-block", width: 10, height: 2, background: FT.amber, verticalAlign: "middle", marginRight: 6 }} />Blacklist false-positive</span>
        <span><span style={{ display: "inline-block", width: 10, height: 2, background: FT.accent, verticalAlign: "middle", marginRight: 6 }} />Recharge mismatch</span>
      </div>
    </Panel>
  );
}

function StrategyTileGrid({ onPick, tileIds }: { onPick: (t: StrategyTile) => void; tileIds?: string[] }) {
  const FT = useFT();
  const tiles = tileIds ? STRATEGY_TILES.filter((t) => tileIds.includes(t.id)) : STRATEGY_TILES;
  const visible = tiles.filter((t) => t.id !== "st-campaign" || t.value !== "—");
  return (
    <Panel
      title="Operational Signals"
      subtitle="Slower signals — none fire as alerts · click any tile to drill in"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {visible.map((t) => {
          // Stage 4 §D — distinct EMPTY state: muted styling and a calm
          // "no active campaign" caption instead of looking like missing data.
          const isEmpty = t.value === "—";
          const trendIcon = t.trend === "up" ? <TrendingUp size={12} color={FT.red} /> : t.trend === "down" ? <TrendingDown size={12} color={FT.green} /> : null;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t)}
              style={{
                textAlign: "left",
                background: isEmpty ? "transparent" : FT.elevated,
                border: `1px dashed ${isEmpty ? FT.borderLight : "transparent"}`,
                borderColor: isEmpty ? FT.borderLight : FT.borderLight,
                borderStyle: isEmpty ? "dashed" : "solid",
                borderRadius: 10,
                padding: 12,
                cursor: "pointer",
                color: FT.text,
                opacity: isEmpty ? 0.7 : 1,
              }}
            >
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 }}>
                {t.title}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                {isEmpty ? (
                  <span style={{ fontSize: 13, fontWeight: 700, color: FT.textMut, fontStyle: "italic" }}>No active campaign this week</span>
                ) : (
                  <>
                    <span style={{ fontSize: 22, fontWeight: 800, color: FT.text }}>{t.value}</span>
                    {trendIcon}
                  </>
                )}
              </div>
              <div style={{ fontSize: 11, color: FT.textSec, lineHeight: 1.5 }}>{t.sub}</div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COH — OPERATIONS CONSOLE WIDGETS
// ─────────────────────────────────────────────────────────────────────────
function ShiftStatusBar({ oc005Gap, timeWindow }: { oc005Gap: number; timeWindow: TimeWindow }) {
  const FT = useFT();
  // Stage 4 §B.2.1 — the OC 005 cell is wired to the COH action-queue counter,
  // so acking the OC 005 row visibly drops this number. Other cells stay
  // static for now (they read from background queue telemetry that the MVP
  // doesn't simulate).
  const cells: ShiftStat[] = useMemo(
    () =>
      COH_SHIFT.map((s) =>
        s.label === "OC 005 gap (today)"
          ? { ...s, value: `${oc005Gap}`, status: oc005Gap > 0 ? "bad" : "ok" }
          : s
      ),
    [oc005Gap]
  );

  return (
    <Panel
      title="Shift Status — current 8h window"
      subtitle={`Voice · chat · cases · live · ${TIME_WINDOW_LABEL[timeWindow]} window`}
      action={
        <Pill tone="cyan" size="xs">
          Shift · Morning · Trinetra primary
        </Pill>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {cells.map((s) => {
          const tone = s.status === "ok" ? FT.green : s.status === "warn" ? FT.amber : FT.red;
          return (
            <div
              key={s.label}
              style={{
                background: FT.elevated,
                border: `1px solid ${FT.borderLight}`,
                borderLeft: `4px solid ${tone}`,
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: FT.text }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function BpoHeatmap({ onPick }: { onPick: (cell: BpoCell) => void }) {
  const FT = useFT();
  const vendors = Array.from(new Set(BPO_HEATMAP.map((c) => c.vendor)));
  const shifts = ["Morning", "Afternoon", "Night"] as const;

  const intensity = (rate: number): "low" | "med" | "high" | "critical" => {
    if (rate >= 20) return "critical";
    if (rate >= 15) return "high";
    if (rate >= 12) return "med";
    return "low";
  };
  const cellColor: Record<string, string> = {
    low: "rgba(34,197,94,0.18)",
    med: "rgba(245,158,11,0.22)",
    high: "rgba(255,112,67,0.30)",
    critical: "rgba(239,68,68,0.40)",
  };

  return (
    <Panel
      title="BPO Vendor × Shift Heatmap — repeat-call rate"
      subtitle="Same-tag callbacks within 14 days · click any cell to coach"
    >
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `minmax(220px,1fr) repeat(${shifts.length}, 1fr)`, gap: 8, minWidth: 480 }}>
          <div />
          {shifts.map((s) => (
            <div key={s} style={{ fontSize: 11, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, textAlign: "center" }}>
              {s}
            </div>
          ))}
          {vendors.map((v) => (
            <Fragment key={v}>
              <div style={{ fontSize: 12, color: FT.text, fontWeight: 600, alignSelf: "center" }}>{v}</div>
              {shifts.map((s) => {
                const cell = BPO_HEATMAP.find((c) => c.vendor === v && c.shift === s);
                if (!cell) return <div key={`${v}-${s}`} />;
                const lvl = intensity(cell.repeatRate);
                return (
                  <button
                    key={`${v}-${s}`}
                    onClick={() => onPick(cell)}
                    style={{
                      background: cellColor[lvl],
                      border: `1px solid ${FT.borderLight}`,
                      borderRadius: 10,
                      padding: 10,
                      cursor: "pointer",
                      color: FT.text,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: FT.text }}>{cell.repeatRate.toFixed(1)}%</div>
                    <div style={{ fontSize: 10, color: FT.textSec, marginTop: 4 }}>
                      OC005 gap: {cell.ocGap} · sentiment {cell.sentiment.toFixed(1)}σ
                    </div>
                    {cell.flag ? (
                      <div style={{ marginTop: 6 }}>
                        <Pill tone={cell.flag === "alert" ? "bad" : "warn"} size="xs">
                          {cell.flag === "alert" ? "Coach now" : "Watch"}
                        </Pill>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ComplianceTilesRow({ onPick }: { onPick: (id: string) => void }) {
  const FT = useFT();
  return (
    <Panel
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          Compliance Watch — live exposures
          <AiGeneratedMark compact />
        </span>
      }
      subtitle="Saksham conduct · Trilingual rule · RB-IOS 30-Jun · Annual Pass mis-disclosure"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {COMPLIANCE_ITEMS.map((c) => {
          const tone = c.band === "ok" ? "ok" : c.band === "watch" ? "warn" : "bad";
          return (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              style={{
                textAlign: "left",
                background: FT.elevated,
                border: `1px solid ${FT.borderLight}`,
                borderLeft: `4px solid ${c.band === "ok" ? FT.green : c.band === "watch" ? FT.amber : FT.red}`,
                borderRadius: 10,
                padding: 14,
                cursor: "pointer",
                color: FT.text,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: FT.text }}>{c.label}</span>
                <Pill tone={tone} size="xs">{c.metric}</Pill>
              </div>
              <div style={{ fontSize: 12, color: FT.textSec, lineHeight: 1.5 }}>{c.note}</div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHARED SCREENS
// ─────────────────────────────────────────────────────────────────────────
function PlazaHeatmapScreen({ persona, onPick }: { persona: PersonaId; onPick: (p: PlazaCell) => void }) {
  const FT = useFT();
  const color: Record<string, string> = {
    low: "rgba(34,197,94,0.20)",
    med: "rgba(245,158,11,0.30)",
    high: "rgba(255,112,67,0.38)",
    critical: "rgba(239,68,68,0.55)",
  };

  const cells =
    persona === "hob"
      ? PLAZA_CELLS
      : PLAZA_CELLS.map((p) =>
          p.plaza.includes("Khalapur") || p.plaza.includes("Talegaon")
            ? { ...p, signals: p.signals + 12, intensity: "critical" as const }
            : p
        );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {persona === "hob" ? (
        <Panel title="Corridor read — acquirer concentration" subtitle="Stage 1 HoB Q5 · is Mumbai–Pune a pattern or one shift?">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>NH-48 · acquirer-side cluster</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.urgency }}>3.2× baseline</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>AVC sensor cluster · not Vahan dispute filing</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>1033 forwards · top plaza</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.text }}>Khalapur</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>41 forwards this week</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>PNO decision window</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.amber }}>Before 9am</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>Triangulate social + plaza before CEO PA ping</div>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel title="Floor surge — BPO × plaza correlation" subtitle="Stage 1 COH Friction #2 · validate the supervisor's gut with named evidence">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>Trinetra · Morning</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.urgency }}>62 calls</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>Mumbai–Pune corridor · queue +38%</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>1033 forwarded · 24h</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.text }}>18</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>Khalapur + Talegaon overlay</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", marginBottom: 4 }}>Blacklist FP cluster</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: FT.amber }}>Blacklist FP</div>
              <div style={{ fontSize: 11, color: FT.textSec }}>Nelamangala · KYV root-cause misses</div>
            </div>
          </div>
        </Panel>
      )}

      <Panel
        title={persona === "hob" ? "Plaza Heatmap — leakage & acquirer strategy · 24h" : "Plaza Heatmap — operational surge · 24h"}
        subtitle={
          persona === "hob"
            ? "Plaza leakage · blacklist · 1033 forwards — geographic concentration for PNO + IHMCL"
            : "Plaza leakage · queue spike · 1033 forwards — hour-of-day clustering for floor capacity"
        }
        action={<Pill tone="cyan" size="xs">{cells.length} plazas · trailing 24h</Pill>}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {(persona === "hob"
            ? ["All highways", "NH-48", "AVC misread"]
            : ["All shifts", "Morning shift", "1033 source", "Repeat-call"]
          ).map((f) => (
            <Pill key={f} tone="neutral" size="xs">{f}</Pill>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {cells.map((p) => (
            <button
              key={p.plaza}
              onClick={() => onPick(p)}
              style={{
                textAlign: "left",
                background: color[p.intensity],
                border: `1px solid ${p.intensity === "critical" ? FT.red : FT.borderLight}`,
                borderRadius: 10,
                padding: 14,
                cursor: "pointer",
                color: FT.text,
                boxShadow: p.intensity === "critical" ? `0 0 0 1px ${FT.red}40` : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <MapPin size={14} color={FT.text} />
                <Pill
                  tone={p.intensity === "critical" ? "bad" : p.intensity === "high" ? "urgency" : p.intensity === "med" ? "warn" : "ok"}
                  size="xs"
                >
                  {p.intensity}
                </Pill>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: FT.text, marginBottom: 4 }}>{p.plaza}</div>
              <div style={{ fontSize: 11, color: FT.textSec, marginBottom: 6 }}>
                {p.highway} · acquirer {p.acquirer}
                {persona === "coh" && p.plaza.includes("Khalapur") ? " · Trinetra AM" : ""}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: FT.text }}>{p.signals}</div>
              <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>
                {persona === "hob" ? "complaint mentions" : "interactions · shift"}
              </div>
            </button>
          ))}
        </div>
        {persona === "hob" ? (
          <div style={{ marginTop: 12, fontSize: 11, color: FT.textMut, lineHeight: 1.5 }}>
            Fluid CX surfaces the cross-plaza pattern in customer language. AVC sensor recalibration sits with the plaza acquirer and IHMCL — not modifiable via Fluid CX.
          </div>
        ) : (
          <div style={{ marginTop: 12, fontSize: 11, color: FT.textMut, lineHeight: 1.5 }}>
            Cohort-level view. Click a cell to open coaching checklist for that vendor × shift — agent names visible in Evidence Pack chain-of-custody only.
          </div>
        )}
      </Panel>
    </div>
  );
}

function AssemblingPackOverlay({ onComplete }: { onComplete: () => void }) {
  const FT = useFT();
  // Stage 4 §B.1.6 — 5-step ASSEMBLING animation, ~3s total. CSS keyframes
  // drive the progress bar; the steps tick via setTimeout because each one
  // has its own copy. setTimeout firing at 0,600,1200,1800,2400ms is cheap
  // and predictable on demo laptops.
  const steps = [
    "Fetching transcripts (call, chat, email, agent-note)",
    "Validating OC 005 evidence completeness",
    "Running KYV mismatch + vehicle-class check",
    "Linking acquirer ID, plaza reference, and agent call record",
    "Pack ready · IO-defensible",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const handles: number[] = [];
    steps.forEach((_s, i) => {
      handles.push(window.setTimeout(() => setIdx(i + 1), (i + 1) * 600));
    });
    const done = window.setTimeout(onComplete, 3000);
    handles.push(done);
    return () => handles.forEach((h) => window.clearTimeout(h));
    // onComplete is stable in the caller (useCallback) so we deliberately
    // mount this effect once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, (idx / steps.length) * 100);

  return (
    <Panel
      title="Assembling IO Evidence Pack"
      subtitle="4 hours of manual case assembly → 3 seconds"
      glow
    >
      <div style={{ width: "100%", height: 6, background: FT.elevated, borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${FT.primary}, ${FT.accent})`,
            transition: "width 500ms ease-out",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: active ? FT.primarySoft : FT.elevated,
                border: `1px solid ${active ? FT.primaryBorder : FT.borderLight}`,
                borderRadius: 8,
              }}
            >
              {done ? (
                <CheckCircle2 size={16} color={FT.green} />
              ) : active ? (
                <RefreshCw size={16} color={FT.primary} style={{ animation: "ft-spin 900ms linear infinite" }} />
              ) : (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${FT.borderLight}`,
                  }}
                />
              )}
              <span style={{ fontSize: 13, color: done || active ? FT.text : FT.textMut, fontWeight: active ? 700 : 500 }}>{s}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// COH-only — OC 005 dispute-bound calls (Stage 4 SCR-COH-01 Zone C2)
type DisputeEvidenceRow = {
  id: string;
  elapsedMin: number;
  elements: { plaza: boolean; txnId: boolean; vclass: boolean; statement: boolean; agentConfirm: boolean };
  bpo: string;
  urgency: "urgent" | "normal";
};

const COH_DISPUTE_QUEUE: DisputeEvidenceRow[] = [
  {
    id: "de-1",
    elapsedMin: 112,
    elements: { plaza: false, txnId: true, vclass: true, statement: true, agentConfirm: false },
    bpo: "Trinetra · Morning",
    urgency: "urgent",
  },
  {
    id: "de-2",
    elapsedMin: 94,
    elements: { plaza: true, txnId: true, vclass: false, statement: true, agentConfirm: true },
    bpo: "Trinetra · Morning",
    urgency: "urgent",
  },
  {
    id: "de-3",
    elapsedMin: 48,
    elements: { plaza: true, txnId: true, vclass: true, statement: false, agentConfirm: true },
    bpo: "Anandam · Afternoon",
    urgency: "normal",
  },
];

function IOEvidencePackScreen({
  persona,
  onPick,
  assembling,
  onAssembled,
  onAssembleRequest,
}: {
  persona: PersonaId;
  onPick: (e: EvidencePack) => void;
  assembling: boolean;
  onAssembled: () => void;
  onAssembleRequest: () => void;
}) {
  const FT = useFT();
  const readOnly = persona === "hob";

  if (assembling && !readOnly) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AssemblingPackOverlay onComplete={onAssembled} />
      </div>
    );
  }

  if (readOnly) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel
          title="IO Evidence Pack — executive readiness · read-only"
          subtitle="Stage 3 §D.1 · HoB signs off the 30-Jun gap-closure plan — conversation-side evidence only"
          action={<Pill tone="neutral" size="xs">Read-only · redacted</Pill>}
        >
          <div
            style={{
              background: FT.primarySoft,
              border: `1px solid ${FT.primaryBorder}`,
              borderRadius: 10,
              padding: 12,
              marginBottom: 14,
              fontSize: 12,
              color: FT.textSec,
              lineHeight: 1.55,
            }}
          >
            The IO desk makes the finding. Fluid CX assembles the conversation record. Agent identity and full transcripts are redacted on this surface — available to COH and IO office in the operational pack view.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Open complaints</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>186</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Below 70% readiness</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: FT.amber }}>54</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>{RB_IOS_TARGET_LABEL}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: FT.urgency }}>{RB_IOS_DAYS_REMAINING}d</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Quarterly pack</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: FT.amber }}>71%</div>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: FT.text }}>Oldest at-risk cases — for CEO / IO pre-review</div>
          {EVIDENCE_PACKS.filter((p) => p.riskBand === "high").map((p) => (
            <button
              key={p.caseId}
              onClick={() => onPick(p)}
              style={{
                width: "100%",
                textAlign: "left",
                background: FT.elevated,
                border: `1px solid ${FT.borderLight}`,
                borderRadius: 10,
                padding: 14,
                marginBottom: 8,
                cursor: "pointer",
                color: FT.text,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.caseId.replace("CASE", "Case ···")} · {p.category}</div>
                <div style={{ fontSize: 11, color: FT.textSec, marginTop: 4 }}>
                  {p.ageDays}d open · readiness {p.riskBand === "high" ? "62%" : "71%"} · channels:{" "}
                  {Object.values(p.evidence).filter(Boolean).length}/4
                </div>
              </div>
              <Pill tone="neutral" size="xs">View summary →</Pill>
            </button>
          ))}
        </Panel>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel
        title="OC 005 Evidence Queue · this shift"
        subtitle="Dispute-bound calls with incomplete packs · NPCI upload window closes 18:00 IST"
        action={<Pill tone="bad" size="xs">{COH_DISPUTE_QUEUE.length} at risk</Pill>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {COH_DISPUTE_QUEUE.map((row) => (
            <div
              key={row.id}
              style={{
                background: FT.elevated,
                border: `1px solid ${FT.borderLight}`,
                borderLeft: `4px solid ${row.urgency === "urgent" ? FT.red : FT.amber}`,
                borderRadius: 10,
                padding: 12,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: row.urgency === "urgent" ? FT.red : FT.amber }}>
                {row.elapsedMin}m
              </div>
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                  {(
                    [
                      ["plaza", "Plaza"],
                      ["txnId", "Txn ID"],
                      ["vclass", "Class"],
                      ["statement", "Statement"],
                      ["agentConfirm", "Agent ✓"],
                    ] as const
                  ).map(([k, label]) => (
                    <Pill key={k} tone={row.elements[k] ? "ok" : "bad"} size="xs">
                      {row.elements[k] ? "✓" : "✗"} {label}
                    </Pill>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: FT.textSec }}>{row.bpo}</div>
              </div>
              <button
                onClick={() => onAssembleRequest()}
                style={{
                  background: row.urgency === "urgent" ? FT.urgencySoft : FT.primarySoft,
                  color: row.urgency === "urgent" ? FT.urgency : FT.primary,
                  border: `1px solid ${row.urgency === "urgent" ? "rgba(255,112,67,0.35)" : FT.primaryBorder}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Assemble Evidence Pack →
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="IO Readiness Queue · open complaints"
        subtitle={`${RB_IOS_TARGET_LABEL} cutoff · assemble packs before IO sample · oldest first`}
        action={<Pill tone="warn" size="xs">71% readiness</Pill>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Open cases in queue</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: FT.text }}>186</div>
          </div>
          <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Missing ≥1 channel</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: FT.amber }}>54</div>
          </div>
          <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: FT.textMut, marginBottom: 4 }}>Ready packs (this week)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: FT.green }}>27</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EVIDENCE_PACKS.map((p) => {
            const tone = p.riskBand === "high" ? "bad" : p.riskBand === "med" ? "warn" : "ok";
            const cta = p.status === "ready" ? "Open Pack →" : "Assemble Pack →";
            return (
              <button
                key={p.caseId}
                onClick={() => {
                  if (p.status !== "ready") onAssembleRequest();
                  onPick(p);
                }}
                style={{
                  textAlign: "left",
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  borderRadius: 10,
                  padding: 14,
                  cursor: "pointer",
                  color: FT.text,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ width: 8, height: 36, background: p.riskBand === "high" ? FT.red : p.riskBand === "med" ? FT.amber : FT.green, borderRadius: 4 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: FT.text }}>{p.caseId} · {p.customer}</div>
                  <div style={{ fontSize: 11, color: FT.textSec, marginTop: 2 }}>
                    {p.category} · {p.ageDays}d old
                    {p.ageDays >= 30 ? " · IO review in 6 days" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["call", "chat", "email", "agentNote"] as const).map((k) => {
                    const ok = p.evidence[k];
                    const label = k === "agentNote" ? "Note" : k.charAt(0).toUpperCase() + k.slice(1);
                    return (
                      <Pill key={k} tone={ok ? "ok" : "bad"} size="xs">
                        {ok ? "✓" : "✗"} {label}
                      </Pill>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pill tone={tone} size="xs">{cta}</Pill>
                  <ChevronRight size={16} color={FT.textMut} />
                </div>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

const COMPLIANCE_HEATMAP_ROWS = [
  { type: "Trilingual rule", shortLabel: "Trilingual", drillId: "cw-trilingual", target: "≥85%", cells: ["78%", "91%", "88%", "92%", "86%", "90%", "87%", "89%", "85%"] },
  { type: "Annual Pass eligibility", shortLabel: "Annual Pass", drillId: "cw-annual", target: "0 mis-sell", cells: ["100%", "92%", "100%", "100%", "88%", "100%", "100%", "100%", "100%"] },
  { type: "KYV root-cause", shortLabel: "KYV check", drillId: "cw-kyv", target: "≥80%", cells: ["82%", "79%", "84%", "88%", "81%", "86%", "83%", "80%", "85%"] },
  { type: "TAT promise", shortLabel: "TAT promise", drillId: "cw-tat", target: "≥90%", cells: ["91%", "87%", "93%", "90%", "89%", "92%", "88%", "91%", "90%"] },
  { type: "Saksham conduct", shortLabel: "Saksham", drillId: "cw-saksham", target: "0 flags", cells: ["100%", "100%", "100%", "100%", "100%", "100%", "72%", "100%", "100%"] },
];

const COMPLIANCE_SHIFT_COLUMNS = [
  { vendor: "Trinetra", shift: "AM" },
  { vendor: "Trinetra", shift: "PM" },
  { vendor: "Trinetra", shift: "NT" },
  { vendor: "Anandam", shift: "AM" },
  { vendor: "Anandam", shift: "PM" },
  { vendor: "Anandam", shift: "NT" },
  { vendor: "Digital", shift: "AM" },
  { vendor: "Digital", shift: "PM" },
  { vendor: "Digital", shift: "NT" },
] as const;

const COH_BREACH_QUEUE = [
  {
    id: "br-1",
    type: "Trilingual violation",
    time: "09:03",
    site: "Trinetra · Morning",
    excerpt: "Marathi preference · agent continued in Hindi for 4 minutes",
  },
  {
    id: "br-2",
    type: "Annual Pass mis-disclosure",
    time: "09:17",
    site: "Anandam · Morning",
    excerpt: "Commercial vehicle sold Annual Pass — private non-commercial only",
  },
];

function ComplianceWatchScreen({
  persona,
  onPick,
  sakshamAlert,
}: {
  persona: PersonaId;
  onPick: (id: string) => void;
  sakshamAlert?: boolean;
}) {
  const FT = useFT();
  if (persona === "hob") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel
          title="Compliance posture — read-only"
          subtitle="Stage 3 §D.2 · HoB monitors exposure before signing PNO / IO correspondence"
          action={<Pill tone="neutral" size="xs">Read-only · no floor actions</Pill>}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 8 }}>
                {RB_IOS_TARGET_LABEL}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: FT.text, marginBottom: 4 }}>{RB_IOS_DAYS_REMAINING} days</div>
              <div style={{ fontSize: 12, color: FT.textSec }}>186 open complaints · 54 missing one or more channels · for CEO pre-IO review</div>
            </div>
            <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 8 }}>
                Conduct exposure · 24h
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: sakshamAlert ? FT.red : FT.green, marginBottom: 4 }}>
                {sakshamAlert ? "1 Saksham flag" : "Within target"}
              </div>
              <div style={{ fontSize: 12, color: FT.textSec }}>
                {sakshamAlert
                  ? "Saksham conduct flagged · routed to Compliance — Fluid CX does not act on Saksham workflow"
                  : "No Saksham conduct violations in trailing 24h"}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {COMPLIANCE_ITEMS.map((c) => (
              <div
                key={c.id}
                style={{
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  borderLeft: `4px solid ${c.band === "ok" ? FT.green : c.band === "watch" ? FT.amber : FT.red}`,
                  borderRadius: 10,
                  padding: 14,
                  opacity: 0.92,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: FT.text }}>{c.label}</span>
                  <Pill tone={c.band === "ok" ? "ok" : c.band === "watch" ? "warn" : "bad"} size="xs">{c.metric}</Pill>
                </div>
                <div style={{ fontSize: 12, color: FT.textSec, lineHeight: 1.5 }}>{c.note}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sakshamAlert ? (
        <div
          style={{
            background: FT.urgencySoft,
            border: `1px solid rgba(255,112,67,0.35)`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: FT.urgency, marginBottom: 4 }}>
            SAKSHAM CONDUCT ALERT — 1 call flagged this shift. Routed to Compliance.
          </div>
          <div style={{ fontSize: 12, color: FT.textSec }}>
            Fluid CX does not act on Saksham&apos;s workflow. This pattern has been escalated to Compliance.
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 0.9fr) minmax(0, 0.65fr)", gap: 14 }}>
        <Panel title="Compliance heatmap · today" subtitle="5 types × 9 shift cells · [OBSERVED] signals">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(88px, 1.1fr) repeat(9, minmax(0, 1fr))",
              gap: 3,
              width: "100%",
              alignItems: "stretch",
            }}
          >
            <div />
            {COMPLIANCE_SHIFT_COLUMNS.map((col) => (
              <div
                key={`${col.vendor}-${col.shift}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1,
                  minHeight: 32,
                  fontSize: 8,
                  color: FT.textMut,
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.15,
                }}
              >
                <span>{col.vendor}</span>
                <span>{col.shift}</span>
              </div>
            ))}
            {COMPLIANCE_HEATMAP_ROWS.map((row) => (
              <Fragment key={row.type}>
                <div
                  title={row.type}
                  style={{
                    fontSize: 9,
                    color: FT.textSec,
                    alignSelf: "center",
                    lineHeight: 1.25,
                    paddingRight: 4,
                  }}
                >
                  {row.shortLabel}
                </div>
                {row.cells.map((val, i) => {
                  const n = parseInt(val, 10);
                  const bad = n < 85 || val.includes("72");
                  const warn = n >= 85 && n < 90;
                  return (
                    <button
                      key={`${row.type}-${i}`}
                      onClick={() => onPick(row.drillId)}
                      style={{
                        background: bad ? FT.redSoft : warn ? FT.amberSoft : FT.greenSoft,
                        border: `1px solid ${FT.borderLight}`,
                        borderRadius: 5,
                        padding: "5px 2px",
                        fontSize: 9,
                        fontWeight: 700,
                        color: FT.text,
                        cursor: "pointer",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </Panel>

        <Panel title="Active breach queue" subtitle="Live violations · this shift">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COH_BREACH_QUEUE.map((b) => (
              <div
                key={b.id}
                style={{
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  borderLeft: `4px solid ${FT.red}`,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: FT.text, marginBottom: 4 }}>{b.type}</div>
                <div style={{ fontSize: 11, color: FT.textSec, marginBottom: 6 }}>{b.time} · {b.site}</div>
                <div style={{ fontSize: 11, color: FT.textSec, fontStyle: "italic", marginBottom: 8 }}>&ldquo;{b.excerpt}&rdquo;</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onPick(b.id === "br-1" ? "cw-trilingual" : "cw-annual")}
                    style={{
                      background: FT.primarySoft,
                      color: FT.primary,
                      border: `1px solid ${FT.primaryBorder}`,
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View call →
                  </button>
                  <button
                    style={{
                      background: "transparent",
                      color: FT.textSec,
                      border: `1px solid ${FT.borderLight}`,
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Notify supervisor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="RB-IOS 30-day clock" subtitle="Open cases approaching reply window">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { ref: "···-4421", days: 6, readiness: "62%" },
              { ref: "···-7803", days: 14, readiness: "71%" },
              { ref: "···-4198", days: 18, readiness: "58%" },
              { ref: "···-3989", days: 22, readiness: "74%" },
            ].map((c) => (
              <div
                key={c.ref}
                style={{
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  borderLeft: `4px solid ${c.days <= 7 ? FT.red : FT.amber}`,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700 }}>Case {c.ref}</div>
                <div style={{ fontSize: 11, color: FT.textSec, marginTop: 4 }}>
                  {c.days} days remaining · readiness {c.readiness}
                  {c.days <= 7 ? " · act now" : ""}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <ComplianceTilesRow onPick={onPick} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DRILL-DOWN OVERLAY
// ─────────────────────────────────────────────────────────────────────────
type DrillContext =
  | { kind: "headline"; data: HeadlineCard }
  | { kind: "action"; data: ActionRow }
  | { kind: "strategy"; data: StrategyTile }
  | { kind: "bpo"; data: BpoCell }
  | { kind: "plaza"; data: PlazaCell }
  | { kind: "evidence"; data: EvidencePack }
  | { kind: "compliance"; data: ComplianceItem }
  | { kind: "channel"; data: { channel: string } };

type Snippet = {
  text: string;
  channel: string;
  time: string;
  tag?: string;
  plaza?: string;
  bpo?: string;
  language?: "EN" | "HI" | "MR" | "TA" | "KN" | "TE";
};

type DrillContent = {
  title: string;
  sub: string;
  signalId: SignalId | string;
  badge: { tone: "primary" | "cyan" | "warn" | "bad" | "ok" | "urgency"; label: string };
  provenance: {
    count: number;
    window: string;
    confidence: "High" | "Medium" | "Low";
    extras: string[];
  };
  snippets: Snippet[];
  /** Optional, signal-specific extra block — Coaching checklist, Promise gap, Plaza cluster, etc. */
  extra?: { kind: "coaching" | "promise-gap" | "plaza-cluster" | "evidence-checklist" | "ombudsman" | "saksham" | "trilingual" | "channel-cohort" | "cross-sell"; data: unknown };
  boundary: string;
  primaryCta: { label: string; icon: typeof ShieldCheck; targetScreen: ScreenId };
  // soft → the boundary is a one-line clarifier and renders as a footer pill;
  // hard → the boundary describes an explicit out-of-scope feature and renders
  // as its own panel so the persona reads it slowly. Defaults to "hard".
  boundarySeverity?: "soft" | "hard";
};

// ─────────────────────────────────────────────────────────────────────────
// CONTEXT-AWARE DRILL CONTENT — varies by signal / kind (Stage 3 §D.4)
// ─────────────────────────────────────────────────────────────────────────
function getDrillContent(ctx: DrillContext): DrillContent {
  const baseProvenance = (count: number, window: string, confidence: "High" | "Medium" | "Low" = "High", extras: string[] = []) => ({
    count,
    window,
    confidence,
    extras: ["8-week baseline", "ASR ≥ 0.85", "intent-classifier v1.4.2", ...extras],
  });

  switch (ctx.kind) {
    // ─── HEADLINE BRIEF cards ───────────────────────────────────────────
    case "headline": {
      const c = ctx.data;
      if (c.signal === "S004" && c.category.startsWith("AVC")) {
        return {
          title: c.category,
          sub: `${c.calls} calls · ${c.zScore.toFixed(1)}× baseline · ${c.window}`,
          signalId: c.signal,
          badge: { tone: "urgency", label: "12H GROWING" },
          provenance: baseProvenance(c.calls, c.window, "High", ["plaza-classifier v0.9"]),
          snippets: [
            {
              text: "Charged two axles, my car is a Maruti hatchback. Why this is happening every week at Khalapur?",
              channel: "Voice",
              time: "07:51",
              tag: "TAG-3398172",
              plaza: "Khalapur (NH-48)",
              bpo: "Trinetra · Hyderabad",
              language: "EN",
            },
            {
              text: "मेरी कार sedan है, truck class में charge हो गया है। ये गलत है।",
              channel: "Voice",
              time: "07:58",
              tag: "TAG-7710002",
              plaza: "Talegaon (NH-48)",
              bpo: "Trinetra · Hyderabad",
              language: "HI",
            },
            {
              text: "Twice in one trip — entering and exiting Manesar both charged wrong class. Please refund and fix permanently.",
              channel: "Chat",
              time: "08:07",
              tag: "TAG-2218110",
              plaza: "Manesar (NH-48)",
              bpo: "Digital · Bengaluru",
              language: "EN",
            },
          ],
          extra: {
            kind: "plaza-cluster",
            data: {
              note: "All 3 snippets are on NH-48 toll plazas — this is an acquirer-side AVC sensor cluster, not a Vahan Bank dispute filing issue.",
              breakdown: [
                { label: "Khalapur", value: 38 },
                { label: "Talegaon", value: 24 },
                { label: "Manesar", value: 19 },
                { label: "Other NH-48", value: 13 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces the cross-plaza pattern in customer language. The actual AVC sensor recalibration sits with the plaza acquirer and IHMCL. Fluid CX does not modify NETC dispute switch state.",
          primaryCta: { label: "See on Plaza Heatmap", icon: MapPin, targetScreen: "plaza_heatmap" },
        };
      }
      if (c.signal === "S022" || c.category.toLowerCase().includes("blacklist")) {
        return {
          title: c.category,
          sub: `${c.calls} calls · ${c.zScore.toFixed(1)}× baseline · ${c.window}`,
          signalId: "S022",
          badge: { tone: "warn", label: "FALSE-POSITIVE CLUSTER" },
          provenance: baseProvenance(c.calls, c.window, "High", ["kyv-mismatch heuristic"]),
          snippets: [
            {
              text: "My balance shows ₹280 in the app, why is the tag blacklisted? I have not done anything wrong.",
              channel: "Voice",
              time: "08:04",
              tag: "TAG-5598441",
              plaza: "Nelamangala",
              bpo: "Trinetra · Hyderabad",
              language: "EN",
            },
            {
              text: "Last week also same thing — agent unblocked, today again blacklisted. Please fix the root cause.",
              channel: "Chat",
              time: "08:09",
              tag: "TAG-5598441",
              plaza: "Devanahalli",
              bpo: "Digital · Bengaluru",
              language: "EN",
            },
            {
              text: "I have not even used the tag today, balance is ₹420 and still showing blacklisted at every plaza I try.",
              channel: "Voice",
              time: "08:21",
              tag: "TAG-9981120",
              plaza: "Krishnagiri",
              bpo: "Anandam · Coimbatore",
              language: "EN",
            },
          ],
          extra: {
            kind: "evidence-checklist",
            data: {
              title: "Root-cause check — did the agent run KYV mismatch verification before unlocking?",
              items: [
                { label: "KYV mismatch checked", state: "fail" as const },
                { label: "Vehicle class re-confirmed with customer", state: "fail" as const },
                { label: "Tag unblocked without root cause", state: "pass" as const },
                { label: "Repeat-call risk flagged in case system", state: "fail" as const },
              ],
              caption: "When agents unblock without running the KYV check, the same tag is blacklisted again within 7 days — that's the repeat-call wave.",
            },
          },
          boundary:
            "Fluid CX surfaces the false-positive cluster and the missed root-cause step. The actual NETC blacklist state lives in NPCI's central system — Fluid CX does not write to it.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // Default headline = recharge mismatch
      return {
        title: c.category,
        sub: `${c.calls} calls · ${c.zScore.toFixed(1)}× baseline · ${c.window}`,
        signalId: c.signal,
        badge: { tone: "cyan", label: "DEBIT–CREDIT GAP" },
        provenance: baseProvenance(c.calls, c.window, "Medium", ["gateway-reconcile · partial signal"]),
        snippets: [
          {
            text: "Debited ₹500 from PhonePe but the FASTag app still shows zero balance, screenshot attached.",
            channel: "Chat",
            time: "08:12",
            tag: "TAG-1140991",
            plaza: "—",
            bpo: "Digital · Bengaluru",
            language: "EN",
          },
          {
            text: "Money cut from GPay 2 hours back, recharge still pending. I have to cross toll in 30 minutes.",
            channel: "Voice",
            time: "08:18",
            tag: "TAG-6620031",
            plaza: "—",
            bpo: "Trinetra · Hyderabad",
            language: "EN",
          },
          {
            text: "UPI शो कर रहा है success, app में balance update नहीं हो रहा। please जल्दी solve करें।",
            channel: "Chat",
            time: "08:24",
            tag: "TAG-2298110",
            plaza: "—",
            bpo: "Digital · Bengaluru",
            language: "HI",
          },
        ],
        extra: {
          kind: "channel-cohort",
          data: {
            note: "44 of 48 mentions are PhonePe/GPay UPI rails. Pattern points to gateway-side reconciliation lag, not wallet-side.",
            breakdown: [
              { label: "PhonePe", value: 27 },
              { label: "GPay", value: 17 },
              { label: "Paytm", value: 3 },
              { label: "Other UPI", value: 1 },
            ],
          },
        },
        boundary:
          "Conversation-side signal only. Closure requires the payment-gateway reconciliation feed — that integration is on the Tech roadmap, not currently inside Fluid CX.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── ACTION QUEUE rows ──────────────────────────────────────────────
    case "action": {
      const r = ctx.data;
      // S016 OC005 evidence gap — Coaching view
      if (r.signal === "S016") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S016",
          badge: { tone: "bad", label: "COACHING · OC 005" },
          provenance: baseProvenance(r.count, "current shift", "High", ["evidence-classifier v1.2"]),
          snippets: [
            {
              text: "Agent said: 'I'll raise a dispute for you' — but plaza name and vehicle class were never confirmed on the call.",
              channel: "Voice",
              time: "13:42",
              tag: "TAG-4421110",
              plaza: "[not captured]",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
            {
              text: "Customer stated TXN reference, agent acknowledged but did not read it back — missed in dispute pack.",
              channel: "Voice",
              time: "14:18",
              tag: "TAG-4421181",
              plaza: "Khalapur",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
            {
              text: "Wrap-up summary in case notes: 'cust raised concern' — no plaza, no class, no statement quoted.",
              channel: "Voice",
              time: "14:51",
              tag: "TAG-4421203",
              plaza: "[not captured]",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
          ],
          extra: {
            kind: "coaching",
            data: {
              checklist: [
                { label: "Plaza name confirmed", state: "fail" as const },
                { label: "Transaction ID / timestamp captured", state: "pass" as const },
                { label: "Vehicle class re-confirmed", state: "fail" as const },
                { label: "Customer statement of grievance quoted", state: "pass" as const },
                { label: "Agent confirmation of next step", state: "pass" as const },
              ],
              suggestedPhrase:
                "Can you confirm the plaza name on your toll slip? And just to be sure, your vehicle class is [X]?",
              note: "Missing 2 of 5 OC 005 elements → NPCI will auto-reject under Code 5225 if filed as-is.",
            },
          },
          boundary:
            "Fluid CX surfaces the missing evidence elements and recommends the phrasing. The dispute itself is filed in your NPCI dispute system — Fluid CX does not file disputes.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S014 Repeat-call — Promise-gap view
      if (r.signal === "S014" || r.title.toLowerCase().includes("repeat")) {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S014",
          badge: { tone: "warn", label: "PROMISE-GAP" },
          provenance: baseProvenance(r.count, "trailing 14d", "High", ["same-tag callback heuristic"]),
          snippets: [
            {
              text: "Your agent told me on Monday it will work in 24 hours, today again blacklisted at every plaza.",
              channel: "Voice",
              time: "10:11",
              tag: "TAG-7740012",
              plaza: "Devanahalli",
              bpo: "Trinetra · Morning",
              language: "EN",
            },
            {
              text: "Third call this week — last time agent confirmed refund, no refund has come yet.",
              channel: "Voice",
              time: "11:22",
              tag: "TAG-2298007",
              plaza: "Krishnagiri",
              bpo: "Anandam · Afternoon",
              language: "EN",
            },
            {
              text: "मुझे already दो बार बोला गया है ये fix हो जाएगा, अभी तक कुछ नहीं हुआ।",
              channel: "Chat",
              time: "12:08",
              tag: "TAG-5512098",
              plaza: "Manesar",
              bpo: "Digital",
              language: "HI",
            },
          ],
          extra: {
            kind: "promise-gap",
            data: {
              firstCall: {
                when: "Mon · 14:22 IST",
                agentSaid: "Your tag will be unblocked and working at every plaza within 24 hours, sir.",
                outcomeLogged: "Unblock issued · root-cause not investigated",
              },
              callback: {
                when: "Thu · 10:11 IST",
                customerSaid: "Your agent said it was fixed. It's still blacklisted at every plaza I try.",
                gap: "KYV mismatch was never resolved — the unblock was cosmetic.",
              },
            },
          },
          boundary:
            "This is a coaching surface, not surveillance. Fluid CX shows the gap between agent promise and customer outcome — the supervisor decides the coaching action.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S015 Trilingual rule
      if (r.signal === "S015") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S015",
          badge: { tone: "warn", label: "TRILINGUAL BREACH" },
          provenance: baseProvenance(r.count, "current shift", "Medium", ["language-preference detector v0.7"]),
          snippets: [
            {
              text: "मराठीत बोला नं — agent continued in Hindi for the remaining 7 minutes of the call.",
              channel: "Voice",
              time: "11:42",
              tag: "TAG-3398401",
              plaza: "Talegaon",
              bpo: "Anandam · Afternoon",
              language: "MR",
            },
            {
              text: "தமிழ்ல பேசுங்க sir — agent responded once, then switched back to English for the technical step.",
              channel: "Voice",
              time: "12:18",
              tag: "TAG-7790112",
              plaza: "Krishnagiri",
              bpo: "Trinetra · Afternoon",
              language: "TA",
            },
            {
              text: "Customer asked for Kannada twice; agent acknowledged but did not transfer to the Kannada queue.",
              channel: "Voice",
              time: "13:01",
              tag: "TAG-1141998",
              plaza: "Nelamangala",
              bpo: "Digital",
              language: "KN",
            },
          ],
          extra: {
            kind: "trilingual",
            data: {
              note: "RBI letter 30 Sep 2024 — banks must offer service in the regional language when a customer requests it.",
              breakdown: [
                { label: "Marathi requested · handled in Hindi", value: 4 },
                { label: "Tamil requested · handled in English", value: 3 },
                { label: "Kannada requested · no transfer", value: 2 },
              ],
            },
          },
          boundary:
            "Fluid CX detects the language preference signal. Routing to the regional-language queue is owned by IVR configuration, not Fluid CX.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S002 Annual Pass cross-sell
      if (r.signal === "S002") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S002",
          badge: { tone: "primary", label: "CROSS-SELL MISS" },
          provenance: baseProvenance(r.count, "yesterday", "Medium", ["recharge-frequency rule"]),
          snippets: [
            {
              text: "I am recharging fourth time this month, agent only confirmed the amount and ended the call — Annual Pass never came up.",
              channel: "Voice",
              time: "16:32",
              tag: "TAG-7820001",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
            {
              text: "I drive to Pune three times a week. Customer asked about a 'monthly pass' — agent said 'we don't have any such product'.",
              channel: "Voice",
              time: "17:08",
              tag: "TAG-3309012",
              bpo: "Anandam · Afternoon",
              language: "EN",
            },
            {
              text: "Agent processed the recharge in 90 seconds — never asked about toll usage pattern or eligibility for the ₹3000 pass.",
              channel: "Voice",
              time: "17:45",
              tag: "TAG-7820219",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
          ],
          extra: {
            kind: "cross-sell",
            data: {
              note: "37 of yesterday's calls met the Annual Pass trigger condition (≥3rd recharge in 30d OR commute mention) — agent did not surface the offer.",
              breakdown: [
                { label: "3rd+ recharge in 30d", value: 21 },
                { label: "Commute/monthly mention", value: 11 },
                { label: "Plaza-coverage question", value: 5 },
              ],
              missedFlow: "Avg. ₹3,000 pass × 37 calls = ₹1.11L missed gross flow yesterday alone.",
            },
          },
          boundary:
            "Fluid CX surfaces the missed-prompt moments. The actual offer creation and pricing decision sits with Marketing and Product — Fluid CX does not write to the offer engine.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S008 Fleet intent
      if (r.signal === "S008") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S008",
          badge: { tone: "cyan", label: "FLEET / CORPORATE" },
          provenance: baseProvenance(r.count, "trailing 24h", "High"),
          snippets: [
            {
              text: "I have 35 vehicles in my company fleet, can I get one bulk recharge instead of 35 separate ones? Need GST invoice also.",
              channel: "Voice",
              time: "10:42",
              tag: "TAG-8810022",
              bpo: "Trinetra · Morning",
              language: "EN",
            },
            {
              text: "Looking for FASTag for our company trucks — 18 vehicles, need single dashboard for all.",
              channel: "Chat",
              time: "11:18",
              tag: "TAG-7720981",
              bpo: "Digital",
              language: "EN",
            },
            {
              text: "Currently using a competitor for our 22 cabs, want to consolidate. Who do I speak to in corporate FASTag?",
              channel: "Voice",
              time: "13:08",
              tag: "TAG-3398881",
              bpo: "Anandam · Afternoon",
              language: "EN",
            },
          ],
          extra: {
            kind: "cross-sell",
            data: {
              note: "12 verified fleet-intent conversations in trailing 24h — none have a follow-up logged in the Corporate FASTag desk queue.",
              breakdown: [
                { label: "Fleet size 10–25 vehicles", value: 7 },
                { label: "Fleet size 26–50 vehicles", value: 3 },
                { label: "Fleet size 50+ vehicles", value: 2 },
              ],
              missedFlow: "Avg. 24 vehicles per fleet × 12 conversations = 288 potential tag additions in the queue.",
            },
          },
          boundary:
            "Fluid CX detects the corporate-intent language. The actual KYC + GST onboarding flow runs in your Corporate FASTag desk — Fluid CX does not provision tags.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S013 Excess toll refund potential
      if (r.signal === "S013") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S013",
          badge: { tone: "warn", label: "PARTIAL · CONVERSATION-SIDE ONLY" },
          provenance: baseProvenance(r.count, "this week", "Medium", ["dispute-eligibility classifier"]),
          snippets: [
            {
              text: "Wrong amount deducted at Khalapur on Tuesday, I want a refund. ₹220 instead of ₹110.",
              channel: "Voice",
              time: "Tue 14:22",
              tag: "TAG-4421110",
              plaza: "Khalapur",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
            {
              text: "Double deduction on the same toll booth, both entries within 60 seconds.",
              channel: "Chat",
              time: "Wed 11:08",
              tag: "TAG-7790881",
              plaza: "Talegaon",
              bpo: "Digital",
              language: "EN",
            },
            {
              text: "Charged for SUV, my vehicle is hatchback — I want refund + permanent fix in my tag.",
              channel: "Voice",
              time: "Thu 09:33",
              tag: "TAG-1141022",
              plaza: "Manesar",
              bpo: "Trinetra · Morning",
              language: "EN",
            },
          ],
          extra: {
            kind: "evidence-checklist",
            data: {
              title: "Of the 146 excess toll refund-eligible calls this week:",
              items: [
                { label: "23 are missing 1+ OC 005 element (will auto-reject under 5225)", state: "fail" as const },
                { label: "89 have full evidence pack — ready to file", state: "pass" as const },
                { label: "34 are within Good Faith TAT window", state: "pass" as const },
              ],
              caption: "Fluid CX cannot tell you NPCI representment win-rate — only the NETC dispute switch feed can. This is the conversation-side leading indicator.",
            },
          },
          boundary:
            "Conversation-side only. Actual excess toll refund ratio and NPCI outcomes require the NETC dispute system feed — out of scope for Fluid CX in this MVP.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S001 Tag closure / issuer-switch intent
      if (r.signal === "S001") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S001",
          badge: { tone: "primary", label: "CLOSURE / SWITCH INTENT" },
          provenance: baseProvenance(r.count, "trailing 30d", "High", ["competitor-mention NER v1.1"]),
          snippets: [
            {
              text: "I'm switching to IDFC FIRST FASTag — they don't have these AVC issues at Khalapur, my friend uses it.",
              channel: "Voice",
              time: "Wed 16:22",
              tag: "TAG-3398777",
              bpo: "Trinetra · Afternoon",
              language: "EN",
            },
            {
              text: "Close this tag, I'll move to ICICI. Three times this month wrong deduction — enough.",
              channel: "Chat",
              time: "Thu 11:18",
              tag: "TAG-7720441",
              bpo: "Digital",
              language: "EN",
            },
            {
              text: "मुझे Axis FASTag लेना है — आपके agent कुछ solve नहीं कर रहे।",
              channel: "Voice",
              time: "Fri 09:42",
              tag: "TAG-1141998",
              bpo: "Anandam · Morning",
              language: "HI",
            },
          ],
          extra: {
            kind: "cross-sell",
            data: {
              note: "23 closure or issuer-switch intent mentions in trailing 30d · 0.8× baseline (within range, monitoring).",
              breakdown: [
                { label: "IDFC FIRST mentioned", value: 11 },
                { label: "ICICI mentioned", value: 7 },
                { label: "Axis mentioned", value: 3 },
                { label: "HDFC mentioned", value: 2 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces closure or competitor-switch language. Retention offers are configured in CRM + Marketing — Fluid CX does not trigger offers.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S010 CASA cross-sell
      if (r.signal === "S010") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S010",
          badge: { tone: "cyan", label: "BANKING PULL-THROUGH" },
          provenance: baseProvenance(r.count, "trailing 24h", "High"),
          snippets: [
            {
              text: "By the way, do you also have car loan? Thinking of upgrading my vehicle next month.",
              channel: "Voice",
              time: "10:18",
              tag: "TAG-2298881",
              bpo: "Trinetra · Morning",
              language: "EN",
            },
            {
              text: "I want to move my salary account also — currently with HDFC. What's the process?",
              channel: "Chat",
              time: "11:42",
              tag: "TAG-7790021",
              bpo: "Digital",
              language: "EN",
            },
            {
              text: "Personal loan के बारे में बताइए — agent ने ignore करके सिर्फ FASTag का बात की।",
              channel: "Voice",
              time: "13:08",
              tag: "TAG-1141881",
              bpo: "Anandam · Afternoon",
              language: "HI",
            },
          ],
          extra: {
            kind: "cross-sell",
            data: {
              note: "18 banking-intent mentions inside FASTag conversations in last 24h. 11 of these are not existing CASA customers — net-new opportunity.",
              breakdown: [
                { label: "Salary account interest", value: 7 },
                { label: "Car loan interest", value: 6 },
                { label: "Personal loan interest", value: 3 },
                { label: "Credit card interest", value: 2 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces the cross-sell moment inside the inbound call. The lead handoff to Branch Banking happens through your existing CRM lead flow — Fluid CX does not write CRM leads.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // S029 Refund SLA breach
      if (r.signal === "S029") {
        return {
          title: r.title,
          sub: `${r.impact} · ${r.owner}`,
          signalId: "S029",
          badge: { tone: "bad", label: "SLA BREACH — IO RISK" },
          provenance: baseProvenance(r.count, "trailing 7d", "High", ["promise-vs-outcome matcher v0.8"]),
          snippets: [
            {
              text: "Refund was promised within 5 working days — today is day 11, still nothing in the wallet.",
              channel: "Voice",
              time: "Day 11",
              tag: "TAG-7820881",
              bpo: "Trinetra",
              language: "EN",
            },
            {
              text: "Three follow-up calls already, every time agent says 'it is in process' — nothing has moved.",
              channel: "Chat",
              time: "Day 9",
              tag: "TAG-3398012",
              bpo: "Digital",
              language: "EN",
            },
            {
              text: "I will go to RBI Ombudsman if this is not refunded by tomorrow — already given enough chances.",
              channel: "Voice",
              time: "Day 13",
              tag: "TAG-1140999",
              bpo: "Anandam",
              language: "EN",
            },
          ],
          extra: {
            kind: "evidence-checklist",
            data: {
              title: "14 refund-promised calls aged > 5 days · IO referral risk this week",
              items: [
                { label: "5 cases > 10 days · highest IO risk", state: "fail" as const },
                { label: "6 cases 7–10 days · escalation window", state: "fail" as const },
                { label: "3 cases 5–7 days · still recoverable", state: "pass" as const },
              ],
              caption: "Closing these in the next 72h prevents IO desk handover.",
            },
          },
          boundary:
            "Fluid CX flags the SLA-breach age. Refund processing itself runs in your CRM and payment ops — Fluid CX does not trigger refunds.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // Default action row
      return {
        title: r.title,
        sub: `${r.impact} · ${r.owner}`,
        signalId: r.signal,
        badge: { tone: "primary", label: r.partial ? "PARTIAL SIGNAL" : "ACTION ITEM" },
        provenance: baseProvenance(r.count, "trailing 24h", "High"),
        snippets: [
          {
            text: "Generic representative excerpt — supervised classifier matched this conversation to the action signal.",
            channel: "Voice",
            time: "—",
            tag: "TAG-…",
            language: "EN",
          },
        ],
        boundary:
          "Fluid CX surfaces the action signal from conversation patterns. Downstream action flows through your existing CRM / dispute / IO desks.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── STRATEGY TILES ─────────────────────────────────────────────────
    case "strategy": {
      const t = ctx.data;
      if (t.signal === "S009") {
        return {
          title: t.title,
          sub: t.sub,
          signalId: "S009",
          badge: { tone: "cyan", label: "AWARENESS PULSE" },
          provenance: baseProvenance(14, "this week", "Medium"),
          snippets: [
            { text: "Is FASTag going away? Heard from a friend about satellite tolling.", channel: "Voice", time: "Tue 11:22", language: "EN" },
            { text: "GNSS tolling means I don't need FASTag at all? Should I close my tag?", channel: "Chat", time: "Wed 14:08", language: "EN" },
            { text: "Government is removing toll booths? When will it happen?", channel: "Voice", time: "Thu 16:42", language: "EN" },
          ],
          extra: {
            kind: "channel-cohort",
            data: {
              note: "57% confusion · 32% awareness · 11% anxiety — useful for the CEO one-pager on GNSS resilience.",
              breakdown: [
                { label: "Confusion ('what is this?')", value: 8 },
                { label: "Awareness ('I have heard about it')", value: 4 },
                { label: "Anxiety ('should I close FASTag?')", value: 2 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces the customer awareness signal. The GNSS rollout itself is NHAI / IHMCL territory — outside Vahan Bank's control.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      if (t.signal === "S030") {
        return {
          title: t.title,
          sub: t.sub,
          signalId: "S030",
          badge: { tone: "primary", label: "FAQ GAPS" },
          provenance: baseProvenance(41, "this week", "High"),
          snippets: [
            { text: "Will Annual Pass work on Mumbai-Pune Expressway? Most important route for me.", channel: "Voice", time: "Tue 09:18", language: "EN" },
            { text: "Can I use the ₹3,000 pass on my commercial vehicle? I run a taxi.", channel: "Chat", time: "Wed 12:42", language: "EN" },
            { text: "How many plazas are covered under Annual Pass? I drive across 4 states.", channel: "Voice", time: "Thu 15:08", language: "EN" },
          ],
          extra: {
            kind: "channel-cohort",
            data: {
              note: "Top 3 unanswered Annual Pass questions — suggests IVR / FAQ tree update.",
              breakdown: [
                { label: "Plaza coverage", value: 19 },
                { label: "Commercial vehicle eligibility", value: 13 },
                { label: "Refund policy", value: 9 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces the FAQ gap. The IVR + FAQ content is owned by Marketing + Tech — Fluid CX does not edit IVR scripts.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      if (t.signal === "S032") {
        return {
          title: t.title,
          sub: t.sub,
          signalId: "S032",
          badge: { tone: "warn", label: "IO QUARTERLY · 71%" },
          provenance: baseProvenance(186, "all open complaints", "High"),
          snippets: [
            { text: "Sample case 1 — AVC misread at Khalapur · 48 days old · evidence pack 75%", channel: "Case-scoped", time: "—" },
            { text: "Sample case 2 — Recharge debit/no credit · 42 days old · evidence pack 60%", channel: "Case-scoped", time: "—" },
            { text: "Sample case 3 — Blacklist FP · 33 days old · evidence pack 100% — ready", channel: "Case-scoped", time: "—" },
          ],
          extra: {
            kind: "evidence-checklist",
            data: {
              title: "Quarterly pack readiness · last assembled 42 days ago",
              items: [
                { label: "186 open complaints in scope", state: "pass" as const },
                { label: "54 missing one or more channels", state: "fail" as const },
                { label: "Quarterly pack > 30d old · refresh recommended before IO sample", state: "fail" as const },
              ],
            },
          },
          boundary:
            "Fluid CX assembles the conversation-evidence pack. The Internal Ombudsman makes the finding — Fluid CX does not adjudicate IO cases.",
          primaryCta: { label: "Open IO Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      if (t.signal === "S037") {
        return {
          title: t.title,
          sub: t.sub,
          signalId: "S037",
          badge: { tone: "warn", label: "BRANCH HANDOFF FRICTION" },
          provenance: baseProvenance(23, "trailing 7d", "High", ["branch-escalation phrase detector"]),
          snippets: [
            { text: "Agent said visit your home branch with KYC documents — I already uploaded everything in the app twice.", channel: "Voice", time: "Mon 11:08", language: "EN" },
            { text: "Branch in Koramangala sent me back to call centre — nobody knows how to transfer tag ownership.", channel: "Chat", time: "Wed 15:22", language: "EN" },
            { text: "Used-vehicle tag transfer stuck 19 days — branch says wait, call centre says branch.", channel: "Voice", time: "Fri 09:41", language: "EN" },
          ],
          extra: {
            kind: "channel-cohort",
            data: {
              note: "23 'visit branch' reports this week · ▲6 vs last week — concentrated in tag transfer + KYV update journeys.",
              breakdown: [
                { label: "Tag transfer / inheritance", value: 11 },
                { label: "KYV update after issuance", value: 7 },
                { label: "Security deposit refund", value: 5 },
              ],
            },
          },
          boundary:
            "Fluid CX surfaces the handoff friction in customer language. Branch queue management and branch scripts are owned by Branch Banking — Fluid CX does not route branch appointments.",
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      if (t.signal === "S011") {
        return {
          title: t.title,
          sub: t.sub,
          signalId: "S011",
          badge: { tone: "warn", label: "PARTIAL · STATED INTENT" },
          provenance: baseProvenance(37, "trailing 7d", "Medium", ["auto-recharge phrase detector · wallet feed not joined"]),
          snippets: [
            { text: "Customer said yes to auto-recharge when agent offered — outcome not logged in CRM.", channel: "Voice", time: "Tue 16:40", language: "EN" },
            { text: "Agent offered auto-recharge at ₹150 threshold — customer declined but agent logged 'opted in'.", channel: "Voice", time: "Wed 11:02", language: "EN" },
          ],
          boundary:
            "Conversation-side stated intent only. Verified opt-in rate requires Tech wallet / auto-recharge feed — partial signal in this MVP.",
          boundarySeverity: "soft" as const,
          primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
        };
      }
      // Default strategy
      return {
        title: t.title,
        sub: t.sub,
        signalId: t.signal,
        badge: { tone: "primary", label: "OPERATIONAL SIGNAL" },
        provenance: baseProvenance(20, "this week", "Medium"),
        snippets: [
          { text: "Strategy-level signal — sampled from conversation data this week.", channel: "Voice/Chat", time: "—" },
        ],
        boundary:
          "Strategic signal. Action lives with HoB and the relevant peer team (Marketing / Tech / Branch Banking).",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── BPO HEATMAP cell ───────────────────────────────────────────────
    case "bpo": {
      const b = ctx.data;
      return {
        title: `${b.vendor} · ${b.shift} shift`,
        sub: `Repeat-call ${b.repeatRate.toFixed(1)}% · OC005 gap ${b.ocGap} · sentiment ${b.sentiment.toFixed(1)}σ`,
        signalId: "S017",
        badge: { tone: b.flag === "alert" ? "bad" : b.flag === "watch" ? "warn" : "primary", label: b.flag === "alert" ? "COACH NOW" : b.flag === "watch" ? "WATCH" : "BPO COHORT" },
        provenance: baseProvenance(1842, "trailing 7d", "High", [`cohort: ${b.vendor.split(" · ")[0]}`, b.shift + " shift"]),
        snippets: [
          {
            text: "Agent kept me on hold for 6 minutes, then said 'I'll call you back' — never called back, that's why I'm here again.",
            channel: "Voice",
            time: "13:42",
            tag: "TAG-7700881",
            bpo: `${b.vendor} · ${b.shift}`,
            language: "EN",
          },
          {
            text: "Third time same shift, same answer 'we will solve' — KYV check never done.",
            channel: "Voice",
            time: "14:18",
            tag: "TAG-1141998",
            bpo: `${b.vendor} · ${b.shift}`,
            language: "EN",
          },
          {
            text: "Wrap-up summary missing transaction details in 6 of 10 sampled calls from this cohort.",
            channel: "QA sample",
            time: "—",
            bpo: `${b.vendor} · ${b.shift}`,
            language: "EN",
          },
        ],
        extra: {
          kind: "evidence-checklist",
          data: {
            title: `Composite score for ${b.vendor.split(" · ")[0]} · ${b.shift}`,
            items: [
              { label: `Repeat-call rate ${b.repeatRate.toFixed(1)}% (8w baseline 11%)`, state: b.repeatRate > 15 ? "fail" as const : "pass" as const },
              { label: `OC 005 evidence completeness — gap of ${b.ocGap} today`, state: b.ocGap > 5 ? "fail" as const : "pass" as const },
              { label: `Sentiment drift ${b.sentiment.toFixed(1)}σ from baseline`, state: b.sentiment < -0.7 ? "fail" as const : "pass" as const },
            ],
            caption: "This is coaching evidence for the BPO supervisor — not a surveillance leaderboard.",
          },
        },
        boundary:
          "Fluid CX surfaces named-cohort variance to support coaching by the BPO supervisor. Individual agent ranking is anti-pattern and not exposed here.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── PLAZA HEATMAP cell ─────────────────────────────────────────────
    case "plaza": {
      const p = ctx.data;
      return {
        title: p.plaza,
        sub: `${p.highway} · acquirer ${p.acquirer} · ${p.signals} signals · intensity ${p.intensity}`,
        signalId: "S005",
        badge: { tone: p.intensity === "critical" ? "bad" : p.intensity === "high" ? "urgency" : "primary", label: "PLAZA CLUSTER" },
        provenance: baseProvenance(p.signals, "trailing 24h", "High", [`acquirer ${p.acquirer}`, p.highway]),
        snippets: [
          {
            text: `Wrong class charged at ${p.plaza} — third time this week, same toll booth.`,
            channel: "Voice",
            time: "07:42",
            tag: "TAG-2298881",
            plaza: p.plaza,
            language: "EN",
          },
          {
            text: `Double deduction within 90 seconds at ${p.plaza}, please refund.`,
            channel: "Chat",
            time: "08:18",
            tag: "TAG-7790012",
            plaza: p.plaza,
            language: "EN",
          },
          {
            text: `${p.plaza} पर हर बार गलत charge होता है, क्या problem है?`,
            channel: "Voice",
            time: "08:51",
            tag: "TAG-1141881",
            plaza: p.plaza,
            language: "HI",
          },
        ],
        extra: {
          kind: "plaza-cluster",
          data: {
            note: `Cluster confirmed: ${p.signals} signals at ${p.plaza}, all on acquirer ${p.acquirer} (${p.highway}). This is an acquirer-side event, not a Vahan Bank issue.`,
            breakdown: [
              { label: "AVC misread", value: Math.round(p.signals * 0.6) },
              { label: "Double deduction", value: Math.round(p.signals * 0.25) },
              { label: "Blacklist FP", value: Math.round(p.signals * 0.15) },
            ],
          },
        },
        boundary:
          "Fluid CX surfaces the plaza-level pattern. Acquirer-side AVC recalibration is owned by the acquirer (in this case, " + p.acquirer + ") and IHMCL — Fluid CX does not trigger plaza fixes.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── EVIDENCE PACK case ─────────────────────────────────────────────
    case "evidence": {
      const e = ctx.data;
      return {
        title: e.caseId,
        sub: `${e.customer} · ${e.category} · ${e.ageDays}d old`,
        signalId: "S024",
        badge: { tone: e.riskBand === "high" ? "bad" : e.riskBand === "med" ? "warn" : "ok", label: e.status === "ready" ? "PACK READY" : "ASSEMBLE PACK" },
        provenance: baseProvenance(1, "case-scoped · all-time", "High", [`risk band ${e.riskBand}`]),
        snippets: [
          { text: `First-contact call · ${e.category} reported by ${e.customer}`, channel: e.evidence.call ? "Voice · captured" : "Voice · missing", time: "Day 1", tag: e.caseId, language: "EN" },
          { text: e.evidence.chat ? "Follow-up chat session · agent reconfirmed issue and promised resolution timeline" : "[Chat thread missing — gap to close before IO review]", channel: "Chat", time: `Day ${Math.min(e.ageDays, 7)}`, language: "EN" },
          { text: e.evidence.email ? "Customer email with screenshots + transaction reference" : "[Email evidence missing — gap to close before IO review]", channel: "Email", time: `Day ${Math.min(e.ageDays, 14)}`, language: "EN" },
        ],
        extra: {
          kind: "evidence-checklist",
          data: {
            title: `Evidence channel completeness · ${e.caseId}`,
            items: [
              { label: "Call recording captured + transcript", state: e.evidence.call ? "pass" as const : "fail" as const },
              { label: "Chat thread captured", state: e.evidence.chat ? "pass" as const : "fail" as const },
              { label: "Email evidence captured", state: e.evidence.email ? "pass" as const : "fail" as const },
              { label: "Agent note / wrap-up summary", state: e.evidence.agentNote ? "pass" as const : "fail" as const },
            ],
            caption: e.status === "ready" ? "Pack ready for IO desk handover." : "Pack assembly required before IO sample window.",
          },
        },
        boundary:
          "The IO desk makes the finding. Fluid CX assembles the record across voice, chat, email, complaint and agent notes — it does not adjudicate.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── COMPLIANCE WATCH tile ──────────────────────────────────────────
    case "compliance": {
      const c = ctx.data;
      const isSaksham = c.id === "cw-saksham";
      const isTri = c.id === "cw-trilingual";
      const isKyv = c.id === "cw-kyv";
      const isTat = c.id === "cw-tat";
      const isAnnual = c.id === "cw-annual";
      const signalId: SignalId = isSaksham
        ? "S018"
        : isTri
          ? "S015"
          : isKyv
            ? "S038"
            : isTat
              ? "S029"
              : isAnnual
                ? "S020"
                : c.id === "cw-rbios"
                  ? "S024"
                  : "S020";
      return {
        title: c.label,
        sub: c.note,
        signalId,
        badge: { tone: c.band === "ok" ? "ok" : c.band === "watch" ? "warn" : "bad", label: c.band.toUpperCase() },
        provenance: baseProvenance(isSaksham ? 3 : isTri ? 9 : isKyv ? 41 : isTat ? 14 : 186, "trailing 24h", "High"),
        snippets: isSaksham
          ? [
              { text: "Saksham agent (cohort: morning shift): 'Your employer will know about this if you don't pay.' · Agent identity in chain-of-custody", channel: "Voice · Saksham", time: "19:42", bpo: "Saksham Recovery", language: "EN" },
              { text: "Late-hour call · post-19:00 IST.", channel: "Voice · Saksham", time: "21:12", language: "EN" },
              { text: "Threat language repeated 4 times in the call.", channel: "Voice · Saksham", time: "19:48", language: "EN" },
            ]
          : isTri
            ? [
                { text: "मराठीत बोला नं — agent continued in Hindi.", channel: "Voice", time: "11:42", language: "MR" },
                { text: "தமிழ்ல பேசுங்க sir — agent switched to English mid-call.", channel: "Voice", time: "12:18", language: "TA" },
                { text: "Customer asked for Kannada twice; agent did not transfer.", channel: "Voice", time: "13:01", language: "KN" },
              ]
            : isKyv
              ? [
                  { text: "Agent unblocked the tag without running KYV mismatch check — customer called back 6 days later, same blacklist.", channel: "Voice", time: "14:22", bpo: "Trinetra · Afternoon", language: "EN" },
                  { text: "Vehicle class was never re-confirmed with customer before unlock.", channel: "Voice", time: "14:18", bpo: "Trinetra · Afternoon", language: "EN" },
                  { text: "Wrap-up note: 'unblocked per customer request' — no root-cause logged.", channel: "Voice", time: "14:51", bpo: "Trinetra · Afternoon", language: "EN" },
                ]
              : isTat
                ? [
                    { text: "Refund was promised in 5 working days — today is day 8, customer calling again.", channel: "Voice", time: "10:11", language: "EN" },
                    { text: "Agent said 'it is in process' — no case disposition update since first call.", channel: "Chat", time: "11:04", language: "EN" },
                    { text: "Customer referenced prior agent promise verbatim — promise-gap detected.", channel: "Voice", time: "12:30", language: "EN" },
                  ]
                : isAnnual
                  ? [
                      { text: "Commercial vehicle customer sold Annual Pass — private non-commercial only per IHMCL rules.", channel: "Voice", time: "09:17", language: "EN" },
                      { text: "Agent did not verify vehicle class before discussing ₹3,000 pass.", channel: "Voice", time: "09:42", language: "EN" },
                    ]
                  : [
                      { text: "Sampled case 1 — evidence pack 60% complete.", channel: "Case-scoped", time: "—" },
                      { text: "Sampled case 2 — evidence pack 75% complete.", channel: "Case-scoped", time: "—" },
                      { text: "Sampled case 3 — evidence pack 100% — ready.", channel: "Case-scoped", time: "—" },
                    ],
        extra: isSaksham
          ? {
              kind: "saksham",
              data: {
                breaches: [
                  { label: "Aggressive language", count: 2 },
                  { label: "Reference to employer", count: 1 },
                  { label: "Late-hour call (post-19:00)", count: 1 },
                ],
                note: "Flag within 30 min of call ending — act before customer escalates.",
              },
            }
          : isTri
            ? {
                kind: "trilingual",
                data: {
                  note: "RBI letter 30 Sep 2024 — banks must serve in the regional language when requested.",
                  breakdown: [
                    { label: "Marathi requested · handled in Hindi", value: 4 },
                    { label: "Tamil requested · handled in English", value: 3 },
                    { label: "Kannada requested · no transfer", value: 2 },
                  ],
                },
              }
            : isKyv
              ? {
                  kind: "evidence-checklist",
                  data: {
                    title: "KYV root-cause check — did the agent verify before unlocking?",
                    items: [
                      { label: "KYV mismatch checked", state: "fail" as const },
                      { label: "Vehicle class re-confirmed", state: "fail" as const },
                      { label: "Tag unblocked without root cause", state: "pass" as const },
                      { label: "Repeat-call risk flagged", state: "fail" as const },
                    ],
                    caption: "Trinetra afternoon cohort at 79% adherence — below 80% target.",
                  },
                }
              : undefined,
        boundary: isSaksham
          ? "Saksham recovery workflow is out of Fluid CX scope per the product boundary contract. Action via the Saksham governance contract."
          : isTri
            ? "IVR routing for regional-language queues is owned by Tech. Fluid CX detects the breach, does not route."
            : isKyv
              ? "Fluid CX surfaces coaching adherence on KYV checks. Fluid CX does not unlock tags or write to NPCI blacklist state."
              : "Fluid CX assembles the record. IO desk makes the finding — Fluid CX does not adjudicate.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }

    // ─── CHANNEL QUALITY bar ────────────────────────────────────────────
    case "channel": {
      const ch = ctx.data.channel;
      const isOEM = ch === "OEM-fitted";
      return {
        title: `Channel · ${ch}`,
        sub: `First 30 days of tag life · complaint rate vs peer channels · ${isOEM ? "1.6× above median" : "within median band"}`,
        signalId: "S007",
        badge: { tone: isOEM ? "bad" : "primary", label: isOEM ? "DAY-1 CHANNEL ISSUE" : "CHANNEL COHORT" },
        provenance: baseProvenance(isOEM ? 1240 : 980, "30d cohort", "High", [`channel: ${ch}`]),
        snippets: isOEM
          ? [
              {
                text: "Tag was already fitted by the OEM dealer when I bought the car — wrong vehicle class was set, every plaza charges wrong amount.",
                channel: "Voice",
                time: "Day 8",
                tag: "TAG-7820001",
                language: "EN",
              },
              {
                text: "Bought car last month, KYV was never confirmed — dealer just stuck the tag. Now I'm chasing this for refund.",
                channel: "Chat",
                time: "Day 14",
                tag: "TAG-3398012",
                language: "EN",
              },
              {
                text: "OEM-fitted tag stopped working in 21 days — dealer says go to bank, bank says go to dealer.",
                channel: "Voice",
                time: "Day 21",
                tag: "TAG-1141998",
                language: "EN",
              },
            ]
          : [
              { text: `${ch} channel · representative call · within cohort norms.`, channel: "Voice/Chat", time: "—", language: "EN" },
            ],
        extra: isOEM
          ? {
              kind: "channel-cohort",
              data: {
                note: "OEM-fitted complaint rate is 1.6× peer median — driven by KYV / AVC fitment errors at the dealership.",
                breakdown: [
                  { label: "KYV mismatch · wrong class set", value: 412 },
                  { label: "Tag-not-activated at fitment", value: 198 },
                  { label: "Pre-paid balance not loaded", value: 84 },
                ],
              },
            }
          : undefined,
        boundary:
          "Fluid CX surfaces the channel-of-issuance cohort variance. The fix lives with the channel partner (OEM / dealer / e-com / branch) — Fluid CX does not modify channel partner KYV workflows.",
        primaryCta: { label: "Open Evidence Pack", icon: ShieldCheck, targetScreen: "io_evidence" },
      };
    }
  }
}

// Helper rendering blocks for the extra views
function CoachingChecklist({ data }: { data: { checklist: { label: string; state: "pass" | "fail" }[]; suggestedPhrase: string; note: string } }) {
  const FT = useFT();
  return (
    <Panel title="Coaching view — OC 005 evidence checklist" subtitle="What was captured · what was missed · suggested next phrasing for the agent">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.checklist.map((c) => (
          <div
            key={c.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: FT.elevated,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            {c.state === "pass" ? (
              <CheckCircle2 size={16} color={FT.green} />
            ) : (
              <X size={16} color={FT.red} />
            )}
            <span style={{ fontSize: 13, color: c.state === "pass" ? FT.text : FT.urgency, fontWeight: 600 }}>{c.label}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          background: FT.primarySoft,
          border: `1px solid ${FT.primaryBorder}`,
          borderRadius: 10,
          padding: 12,
          fontSize: 12,
          color: FT.text,
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontSize: 10, color: FT.primary, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 }}>
          Suggested agent phrasing
        </div>
        “{data.suggestedPhrase}”
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: FT.amber }}>{data.note}</div>
    </Panel>
  );
}

function PromiseGap({ data }: { data: { firstCall: { when: string; agentSaid: string; outcomeLogged: string }; callback: { when: string; customerSaid: string; gap: string } } }) {
  const FT = useFT();
  return (
    <Panel title="Promise gap — first call vs. callback" subtitle="What the agent said vs. what the customer experienced 3 days later">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderLeft: `4px solid ${FT.accent}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, color: FT.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            First call · {data.firstCall.when}
          </div>
          <div style={{ fontSize: 12, color: FT.text, fontStyle: "italic", marginBottom: 8, lineHeight: 1.5 }}>“{data.firstCall.agentSaid}”</div>
          <div style={{ fontSize: 11, color: FT.textMut }}>Outcome logged: {data.firstCall.outcomeLogged}</div>
        </div>
        <div style={{ background: FT.elevated, border: `1px solid ${FT.borderLight}`, borderLeft: `4px solid ${FT.urgency}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, color: FT.urgency, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Callback · {data.callback.when}
          </div>
          <div style={{ fontSize: 12, color: FT.text, fontStyle: "italic", marginBottom: 8, lineHeight: 1.5 }}>“{data.callback.customerSaid}”</div>
          <div style={{ fontSize: 11, color: FT.urgency }}>Gap: {data.callback.gap}</div>
        </div>
      </div>
    </Panel>
  );
}

function ChecklistBlock({ data }: { data: { title: string; items: { label: string; state: "pass" | "fail" }[]; caption?: string } }) {
  const FT = useFT();
  return (
    <Panel title={data.title}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.items.map((i) => (
          <div
            key={i.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: FT.elevated,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            {i.state === "pass" ? <CheckCircle2 size={16} color={FT.green} /> : <X size={16} color={FT.red} />}
            <span style={{ fontSize: 13, color: i.state === "pass" ? FT.text : FT.urgency, fontWeight: 600 }}>{i.label}</span>
          </div>
        ))}
      </div>
      {data.caption && <div style={{ marginTop: 10, fontSize: 11, color: FT.textSec }}>{data.caption}</div>}
    </Panel>
  );
}

function BreakdownBlock({ title, subtitle, data }: { title: string; subtitle?: string; data: { note: string; breakdown: { label: string; value: number }[]; missedFlow?: string } }) {
  const FT = useFT();
  const max = Math.max(...data.breakdown.map((b) => b.value), 1);
  return (
    <Panel title={title} subtitle={subtitle}>
      <div style={{ fontSize: 12, color: FT.textSec, lineHeight: 1.55, marginBottom: 12 }}>{data.note}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.breakdown.map((b) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, fontSize: 12, color: FT.text }}>{b.label}</div>
            <div style={{ flex: 2, height: 8, background: FT.elevated, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(b.value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${FT.primary}, ${FT.accent})` }} />
            </div>
            <div style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 700, color: FT.text }}>{b.value}</div>
          </div>
        ))}
      </div>
      {data.missedFlow && (
        <div
          style={{
            marginTop: 12,
            background: FT.amberSoft,
            border: `1px solid ${FT.amber}`,
            borderRadius: 10,
            padding: 10,
            fontSize: 12,
            color: FT.text,
          }}
        >
          {data.missedFlow}
        </div>
      )}
    </Panel>
  );
}

function OmbudsmanBlock({ data }: { data: { triggers: string[]; context90s: string } }) {
  const FT = useFT();
  return (
    <Panel title="Threat-language detection" subtitle="What the customer said + what the agent said in the 90 seconds before">
      <div style={{ fontSize: 11, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 8 }}>
        Triggers detected
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {data.triggers.map((t) => (
          <Pill key={t} tone="bad" size="xs">{t}</Pill>
        ))}
      </div>
      <div
        style={{
          background: FT.elevated,
          border: `1px solid ${FT.borderLight}`,
          borderLeft: `4px solid ${FT.amber}`,
          borderRadius: 10,
          padding: 12,
          fontSize: 12,
          color: FT.text,
          lineHeight: 1.55,
        }}
      >
        <div style={{ fontSize: 10, color: FT.amber, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
          Last 90 seconds context
        </div>
        {data.context90s}
      </div>
    </Panel>
  );
}

function SakshamBlock({ data }: { data: { breaches: { label: string; count: number }[]; note: string } }) {
  const FT = useFT();
  return (
    <Panel title="Conduct breaches detected" subtitle="Saksham Recovery Services · trailing 24h">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {data.breaches.map((b) => (
          <div
            key={b.label}
            style={{
              background: FT.elevated,
              border: `1px solid ${FT.borderLight}`,
              borderLeft: `3px solid ${FT.red}`,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <div style={{ fontSize: 11, color: FT.textSec, marginBottom: 4 }}>{b.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: FT.red }}>{b.count}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: FT.textSec }}>{data.note}</div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DRILL SHELLS — distinct position + layout per origin (Stage 3 §D.4 / Stage 4)
// ─────────────────────────────────────────────────────────────────────────
type DrillKind = DrillContext["kind"];

type DrillShell = {
  viewLabel: string;
  placement: "right" | "left" | "bottom" | "center";
  width: string;
  maxHeight?: string;
  accent: string;
  accentGlow: string;
  order: Array<"extra" | "snippets" | "provenance" | "boundary">;
  snippetStyle: "hero" | "cards" | "timeline" | "transcript" | "compact";
  provenanceInline?: boolean;
  headerVariant: "standard" | "urgent" | "coaching" | "evidence" | "map";
};

function getDrillShells(ft: FastagPalette): Record<DrillKind, DrillShell> {
  return {
  headline: {
    viewLabel: "HEADLINE DRILL",
    placement: "right",
    width: "min(680px, 94vw)",
    accent: ft.primary,
    accentGlow: ft.primarySoft,
    order: ["snippets", "extra", "provenance", "boundary"],
    snippetStyle: "cards",
    provenanceInline: true,
    headerVariant: "standard",
  },
  action: {
    viewLabel: "COACHING VIEW",
    placement: "bottom",
    width: "min(920px, 96vw)",
    maxHeight: "min(78vh, 720px)",
    accent: ft.urgency,
    accentGlow: ft.urgencySoft,
    order: ["extra", "snippets", "provenance", "boundary"],
    snippetStyle: "timeline",
    headerVariant: "coaching",
  },
  strategy: {
    viewLabel: "STRATEGY DRILL",
    placement: "right",
    width: "min(520px, 92vw)",
    accent: ft.accent,
    accentGlow: ft.accentSoft,
    order: ["extra", "provenance", "snippets", "boundary"],
    snippetStyle: "cards",
    headerVariant: "standard",
  },
  bpo: {
    viewLabel: "COHORT COACHING",
    placement: "right",
    width: "min(600px, 94vw)",
    accent: ft.amber,
    accentGlow: ft.amberSoft,
    order: ["extra", "snippets", "provenance", "boundary"],
    snippetStyle: "cards",
    headerVariant: "coaching",
  },
  plaza: {
    viewLabel: "PLAZA CLUSTER",
    placement: "center",
    width: "min(720px, 94vw)",
    maxHeight: "min(85vh, 800px)",
    accent: ft.accent,
    accentGlow: ft.accentSoft,
    order: ["extra", "snippets", "provenance", "boundary"],
    snippetStyle: "cards",
    headerVariant: "map",
  },
  evidence: {
    viewLabel: "EVIDENCE PACK PREVIEW",
    placement: "bottom",
    width: "min(1040px, 98vw)",
    maxHeight: "min(88vh, 860px)",
    accent: ft.green,
    accentGlow: ft.greenSoft,
    order: ["snippets", "extra", "provenance", "boundary"],
    snippetStyle: "transcript",
    headerVariant: "evidence",
  },
  compliance: {
    viewLabel: "COMPLIANCE · TRANSCRIPT",
    placement: "left",
    width: "min(580px, 94vw)",
    accent: ft.amber,
    accentGlow: ft.amberSoft,
    order: ["snippets", "extra", "provenance", "boundary"],
    snippetStyle: "transcript",
    headerVariant: "standard",
  },
  channel: {
    viewLabel: "CHANNEL COHORT",
    placement: "right",
    width: "min(440px, 92vw)",
    maxHeight: "min(70vh, 560px)",
    accent: ft.accent,
    accentGlow: ft.accentSoft,
    order: ["provenance", "snippets", "extra", "boundary"],
    snippetStyle: "compact",
    provenanceInline: true,
    headerVariant: "standard",
  },
  };
}

function DrillSnippets({
  snippets,
  style,
  accent,
  langColor,
}: {
  snippets: Snippet[];
  style: DrillShell["snippetStyle"];
  accent: string;
  langColor: Record<string, string>;
}) {
  const FT = useFT();
  if (style === "hero" && snippets[0]) {
    const s = snippets[0];
    return (
      <div>
        <div
          style={{
            background: FT.elevated,
            border: `1px solid ${FT.borderLight}`,
            borderLeft: `4px solid ${accent}`,
            borderRadius: 12,
            padding: 18,
            marginBottom: snippets.length > 1 ? 12 : 0,
          }}
        >
          <div style={{ fontSize: 10, color: FT.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
            Representative customer voice
          </div>
          <div style={{ fontSize: 17, color: FT.text, fontStyle: "italic", lineHeight: 1.55, marginBottom: 12 }}>
            &ldquo;{s.text}&rdquo;
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Pill tone="neutral" size="xs">{s.channel}</Pill>
            <Pill tone="neutral" size="xs">{s.time}</Pill>
            {s.plaza ? <Pill tone="cyan" size="xs">Plaza · {s.plaza}</Pill> : null}
          </div>
        </div>
        {snippets.length > 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {snippets.slice(1).map((sn, i) => (
              <div key={i} style={{ fontSize: 12, color: FT.textSec, fontStyle: "italic", paddingLeft: 12, borderLeft: `2px solid ${FT.border}` }}>
                &ldquo;{sn.text}&rdquo;
                <span style={{ color: FT.textMut, fontStyle: "normal" }}> · {sn.time}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (style === "timeline") {
    return (
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 2, background: FT.borderLight }} />
        {snippets.map((s, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 16 }}>
            <div
              style={{
                position: "absolute",
                left: -18,
                top: 4,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 8px ${accent}`,
              }}
            />
            <div style={{ fontSize: 10, color: FT.textMut, fontWeight: 700, marginBottom: 4 }}>{s.time}</div>
            <div style={{ fontSize: 13, color: FT.text, fontStyle: "italic", lineHeight: 1.5, marginBottom: 6 }}>&ldquo;{s.text}&rdquo;</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <Pill tone="neutral" size="xs">{s.channel}</Pill>
              {s.bpo ? <Pill tone="neutral" size="xs">{s.bpo}</Pill> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (style === "transcript") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {snippets.map((s, i) => (
          <div
            key={i}
            style={{
              background: FT.canvas,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 10,
              padding: 12,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <div style={{ fontSize: 10, color: FT.green, marginBottom: 8 }}>[{s.time}] {s.channel}</div>
            <div style={{ fontSize: 12, color: FT.textSec, lineHeight: 1.6 }}>
              <span style={{ color: FT.amber }}>Customer:</span> {s.text}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (style === "compact") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {snippets.slice(0, 2).map((s, i) => (
          <div key={i} style={{ fontSize: 12, color: FT.textSec, fontStyle: "italic", lineHeight: 1.45 }}>
            &ldquo;{s.text}&rdquo;
          </div>
        ))}
      </div>
    );
  }

  // cards (default)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {snippets.map((s, i) => (
        <div
          key={i}
          style={{
            background: FT.elevated,
            border: `1px solid ${FT.borderLight}`,
            borderRadius: 10,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 13, color: FT.text, fontStyle: "italic", lineHeight: 1.55, marginBottom: 8 }}>
            &ldquo;{s.text}&rdquo;
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11 }}>
            <Pill tone="neutral" size="xs">{s.channel}</Pill>
            <Pill tone="neutral" size="xs">{s.time}</Pill>
            {s.tag ? <Pill tone="neutral" size="xs">{s.tag}</Pill> : null}
            {s.bpo ? <Pill tone="neutral" size="xs">{s.bpo}</Pill> : null}
            {s.plaza ? <Pill tone="cyan" size="xs">Plaza · {s.plaza}</Pill> : null}
            {s.language && s.language !== "EN" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: FT.chartCursorFill,
                  border: `1px solid ${langColor[s.language] ?? FT.borderLight}`,
                  color: langColor[s.language] ?? FT.textSec,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {s.language}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function DrillExtraBlocks({ extra }: { extra: DrillContent["extra"] }) {
  if (!extra) return null;
  switch (extra.kind) {
    case "coaching":
      return <CoachingChecklist data={extra.data as { checklist: { label: string; state: "pass" | "fail" }[]; suggestedPhrase: string; note: string }} />;
    case "promise-gap":
      return <PromiseGap data={extra.data as { firstCall: { when: string; agentSaid: string; outcomeLogged: string }; callback: { when: string; customerSaid: string; gap: string } }} />;
    case "evidence-checklist":
      return <ChecklistBlock data={extra.data as { title: string; items: { label: string; state: "pass" | "fail" }[]; caption?: string }} />;
    case "plaza-cluster":
      return <BreakdownBlock title="Cluster confirmation" subtitle="Concentration by plaza / acquirer" data={extra.data as { note: string; breakdown: { label: string; value: number }[] }} />;
    case "cross-sell":
      return <BreakdownBlock title="Opportunity breakdown" data={extra.data as { note: string; breakdown: { label: string; value: number }[]; missedFlow?: string }} />;
    case "channel-cohort":
      return <BreakdownBlock title="Channel / cohort breakdown" data={extra.data as { note: string; breakdown: { label: string; value: number }[] }} />;
    case "trilingual":
      return <BreakdownBlock title="Trilingual rule — by language preference" data={extra.data as { note: string; breakdown: { label: string; value: number }[] }} />;
    case "ombudsman":
      return <OmbudsmanBlock data={extra.data as { triggers: string[]; context90s: string }} />;
    case "saksham":
      return <SakshamBlock data={extra.data as { breaches: { label: string; count: number }[]; note: string }} />;
    default:
      return null;
  }
}

function DrillDownPanel({
  ctx,
  onClose,
  onPrimaryAction,
  onCopyExport,
}: {
  ctx: DrillContext | null;
  onClose: () => void;
  onPrimaryAction: (target: ScreenId) => void;
  onCopyExport: (summary: string) => void;
}) {
  const FT = useFT();
  // Hooks must run on every render even when ctx is null, so Escape-to-close
  // wiring lives above the early-return.
  useEffect(() => {
    if (!ctx) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ctx, onClose]);

  if (!ctx) return null;
  const content = getDrillContent(ctx);
  const { title, sub, signalId, badge, provenance, snippets, extra, boundary, primaryCta, boundarySeverity = "hard" } = content;
  const PrimaryIcon = primaryCta.icon;
  const shell = getDrillShells(FT)[ctx.kind];

  const langColor: Record<string, string> = {
    EN: FT.textSec,
    HI: FT.amber,
    MR: FT.accent,
    TA: FT.accent,
    KN: FT.accent,
    TE: FT.accent,
  };

  const overlayJustify =
    shell.placement === "left"
      ? "flex-start"
      : shell.placement === "center" || shell.placement === "bottom"
        ? "center"
        : "flex-end";
  const overlayAlign = shell.placement === "bottom" ? "flex-end" : shell.placement === "center" ? "center" : "stretch";

  const panelStyle: CSSProperties = {
    width: shell.width,
    maxHeight:
      shell.maxHeight ??
      (shell.placement === "center"
        ? "min(85vh, 800px)"
        : shell.placement === "bottom"
          ? "min(88vh, 860px)"
          : "100vh"),
    height: shell.placement === "bottom" || shell.placement === "center" ? "auto" : "100vh",
    background: FT.surface,
    boxShadow: FT.toastShadow,
    overflow: "auto",
    padding: shell.placement === "bottom" ? "20px 24px 24px" : 22,
    color: FT.text,
    borderLeft: shell.placement === "right" ? `1px solid ${FT.border}` : undefined,
    borderRight: shell.placement === "left" ? `1px solid ${FT.border}` : undefined,
    borderTop: shell.placement === "bottom" ? `1px solid ${FT.border}` : undefined,
    border: shell.placement === "center" ? `1px solid ${FT.border}` : undefined,
    borderRadius: shell.placement === "center" ? 16 : shell.placement === "bottom" ? "16px 16px 0 0" : undefined,
    animation:
      shell.placement === "left"
        ? "ft-slide-in-left 0.28s ease-out"
        : shell.placement === "bottom"
          ? "ft-slide-in-up 0.28s ease-out"
          : shell.placement === "center"
            ? "ft-scale-in 0.24s ease-out"
            : "ft-slide-in-right 0.28s ease-out",
  };

  const headerBg =
    shell.headerVariant === "urgent"
      ? `linear-gradient(135deg, ${FT.redSoft}, transparent)`
      : shell.headerVariant === "coaching"
        ? `linear-gradient(135deg, ${shell.accentGlow}, transparent)`
        : shell.headerVariant === "evidence"
          ? `linear-gradient(135deg, ${FT.greenSoft}, transparent)`
          : shell.headerVariant === "map"
            ? `linear-gradient(135deg, ${FT.accentSoft}, transparent)`
            : undefined;

  const renderSection = (section: DrillShell["order"][number]) => {
    switch (section) {
      case "provenance":
        if (shell.provenanceInline) {
          return (
            <div key="provenance" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <ProvenancePill count={provenance.count} window={provenance.window} confidence={provenance.confidence} />
              {provenance.extras.map((e) => (
                <Pill key={e} tone="neutral" size="xs">{e}</Pill>
              ))}
            </div>
          );
        }
        return (
          <div key="provenance">
            <Panel title="Provenance" subtitle="What this number is built from">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <ProvenancePill count={provenance.count} window={provenance.window} confidence={provenance.confidence} />
                {provenance.extras.map((e) => (
                  <Pill key={e} tone="neutral" size="xs">{e}</Pill>
                ))}
              </div>
            </Panel>
          </div>
        );
      case "snippets":
        if (shell.snippetStyle === "compact") {
          return (
            <div key="snippets" style={{ marginBottom: 12 }}>
              <DrillSnippets snippets={snippets} style={shell.snippetStyle} accent={shell.accent} langColor={langColor} />
            </div>
          );
        }
        return (
          <div key="snippets">
            <Panel
              title={`${snippets.length} representative snippet${snippets.length > 1 ? "s" : ""}`}
              subtitle="De-identified · representative sample for this preview build"
            >
              <DrillSnippets snippets={snippets} style={shell.snippetStyle} accent={shell.accent} langColor={langColor} />
            </Panel>
          </div>
        );
      case "extra":
        if (!extra) return null;
        return (
          <div key="extra">
            <DrillExtraBlocks extra={extra} />
          </div>
        );
      case "boundary":
        return (
          <div key="boundary">
            {boundarySeverity === "hard" ? (
              <Panel title="Boundary" subtitle="What Fluid CX surfaces here vs. what it does not do">
                <div style={{ fontSize: 12, color: FT.textSec, lineHeight: 1.6 }}>{boundary}</div>
              </Panel>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  color: FT.textSec,
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                {boundary}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const copySummary = () => {
    const lines: string[] = [
      `${title}`,
      `${sub}`,
      "",
      `Provenance: ${provenance.count.toLocaleString()} interactions · ${provenance.window} · confidence ${provenance.confidence}`,
      "",
      "Representative snippets:",
      ...snippets.map((s, i) => `  ${i + 1}. "${s.text}" — ${s.channel} · ${s.time}`),
      "",
      `Boundary: ${boundary}`,
    ];
    onCopyExport(lines.join("\n"));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        justifyContent: overlayJustify,
        alignItems: overlayAlign,
        padding: shell.placement === "center" || shell.placement === "bottom" ? 16 : 0,
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: FT.overlayScrim }} />
      <aside style={{ position: "relative", zIndex: 1, ...panelStyle }}>
        <div
          style={{
            height: 4,
            borderRadius: shell.placement === "center" || shell.placement === "bottom" ? "12px 12px 0 0" : 0,
            background: `linear-gradient(90deg, ${shell.accent}, transparent)`,
            margin: shell.placement === "bottom" || shell.placement === "center" ? "-20px -24px 16px" : "-22px -22px 16px",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: shell.accentGlow,
            border: `1px solid ${shell.accent}44`,
            color: shell.accent,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.8,
            marginBottom: 12,
          }}
        >
          {shell.viewLabel}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 14,
            padding: headerBg ? 14 : 0,
            borderRadius: headerBg ? 12 : 0,
            background: headerBg,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <Pill tone={badge.tone} size="xs">{badge.label}</Pill>
              <AiGeneratedMark compact />
            </div>
            <h2 style={{ fontSize: shell.placement === "center" ? 22 : 20, fontWeight: 800, color: FT.text, margin: 0 }}>{title}</h2>
            <div style={{ fontSize: 12, color: FT.textSec, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>
            {shell.provenanceInline ? (
              <div style={{ marginTop: 10 }}>
                {renderSection("provenance")}
              </div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 8,
              padding: 6,
              cursor: "pointer",
              color: FT.textSec,
              flexShrink: 0,
            }}
            aria-label="Close drill-down"
          >
            <X size={16} />
          </button>
        </div>

        {shell.order
          .filter((s) => !(shell.provenanceInline && s === "provenance"))
          .map((section, i, arr) => {
            const node = renderSection(section);
            if (!node) return null;
            return (
              <div key={section}>
                {node}
                {i < arr.length - 1 ? <div style={{ height: 14 }} /> : null}
              </div>
            );
          })}

        <div style={{ height: 16 }} />

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            ...(shell.placement === "bottom"
              ? {
                  position: "sticky",
                  bottom: 0,
                  paddingTop: 12,
                  marginTop: 8,
                  background: `linear-gradient(transparent, ${FT.surface} 24%)`,
                }
              : {}),
          }}
        >
          <button
            onClick={() => onPrimaryAction(primaryCta.targetScreen)}
            style={{
              background: `linear-gradient(135deg, ${shell.accent}, ${FT.primary})`,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <PrimaryIcon size={14} /> {primaryCta.label}
          </button>
          <button
            onClick={copySummary}
            style={{
              background: FT.elevated,
              color: FT.text,
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FileText size={14} /> Copy drill summary
          </button>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TREND EXPLORER (SCR-SHR-06 · Stage 4 §A)
// ─────────────────────────────────────────────────────────────────────────
function TrendExplorerOverlay({ onClose }: { onClose: () => void }) {
  const FT = useFT();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const categories = [
    { id: "avc", label: "AVC misread queue", z: -1.8, calls: 94, signal: "S004" as SignalId, sample: "Charged two axles, my car is a Maruti hatchback — wrong AVC class at Khalapur again." },
    { id: "blacklist", label: "Blacklist false positive", z: -0.6, calls: 61, signal: "S022" as SignalId, sample: "My balance shows ₹280 — why is the tag blacklisted at Nelamangala?" },
    { id: "recharge", label: "Recharge failure · debit/no credit", z: -0.1, calls: 48, signal: "S028" as SignalId, sample: "Debited from PhonePe but the FASTag app shows zero balance." },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", justifyContent: "center", alignItems: "stretch" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: FT.overlayScrimStrong }} />
      <div
        style={{
          position: "relative",
          width: "min(960px, 96vw)",
          maxHeight: "92vh",
          marginTop: "4vh",
          marginBottom: "4vh",
          background: FT.card,
          border: `1px solid ${FT.border}`,
          borderRadius: 14,
          padding: 22,
          overflow: "auto",
          color: FT.text,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Pill tone="primary" size="xs">SCR-SHR-06 · TREND EXPLORER</Pill>
              <Pill tone="cyan" size="xs">8-week baseline</Pill>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Sentiment drift — top 3 categories</h2>
            <div style={{ fontSize: 12, color: FT.textSec, marginTop: 4 }}>z-score in σ vs 8-week baseline · click a row to drill into that signal</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close trend explorer"
            style={{
              background: "transparent",
              border: `1px solid ${FT.borderLight}`,
              borderRadius: 8,
              padding: 6,
              cursor: "pointer",
              color: FT.textSec,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <Panel title="Drift over 30 days" subtitle="Top 3 categories · negative = customer effort rising">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SENTIMENT_DRIFT} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={FT.border} vertical={false} />
                <XAxis dataKey="day" stroke={FT.textMut} tick={{ fontSize: 11 }} />
                <YAxis stroke={FT.textMut} tick={{ fontSize: 11 }} domain={[-2.5, 1]} />
                <ReferenceLine y={-1} stroke={FT.amberSoft} strokeDasharray="2 4" />
                <RechartsTooltip contentStyle={{ background: FT.elevated, border: `1px solid ${FT.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: FT.text }} />
                <Line type="monotone" dataKey="avc" stroke={FT.red} strokeWidth={2} dot={false} name="AVC misread" />
                <Line type="monotone" dataKey="blacklist" stroke={FT.amber} strokeWidth={2} dot={false} name="Blacklist FP" />
                <Line type="monotone" dataKey="recharge" stroke={FT.accent} strokeWidth={2} dot={false} name="Recharge" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div style={{ height: 14 }} />

        <Panel title="Today's representative voice" subtitle="One snippet per category — click to drill in">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  background: FT.elevated,
                  border: `1px solid ${FT.borderLight}`,
                  borderLeft: `4px solid ${c.z <= -1.5 ? FT.red : c.z <= -0.5 ? FT.amber : FT.accent}`,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.label}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Pill tone={c.z <= -1.5 ? "bad" : c.z <= -0.5 ? "warn" : "cyan"} size="xs">{c.z.toFixed(1)}σ · {c.calls} calls</Pill>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: FT.textSec, fontStyle: "italic", borderLeft: `2px solid ${FT.accent}`, paddingLeft: 10, lineHeight: 1.5 }}>
                  “{c.sample}”
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────
export type FastagIntelligenceDashboardProps = {
  industryName: string;
  industryColor: string;
  roleName?: string;
  initialPersona?: PersonaId;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

export function FastagIntelligenceDashboard(props: FastagIntelligenceDashboardProps) {
  const [colorMode, setColorMode] = useState<FastagColorMode>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(FASTAG_COLOR_MODE_KEY);
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem(FASTAG_COLOR_MODE_KEY, colorMode);
  }, [colorMode]);

  const ft = colorMode === "light" ? FT_LIGHT : FT_DARK;

  return (
    <FastagPaletteContext.Provider value={ft}>
      <DashboardThemeProvider value={props.theme ?? buildFastagTheme(ft)}>
        <FastagDashboardShell {...props} colorMode={colorMode} onColorModeChange={setColorMode} />
      </DashboardThemeProvider>
    </FastagPaletteContext.Provider>
  );
}

function FastagDashboardShell({
  industryName,
  industryColor,
  roleName,
  initialPersona = "hob",
  onExit,
  colorMode,
  onColorModeChange,
}: FastagIntelligenceDashboardProps & {
  colorMode: FastagColorMode;
  onColorModeChange: (mode: FastagColorMode) => void;
}) {
  const FT = useFT();
  const [persona, setPersona] = useState<PersonaId>(initialPersona);
  const [sidebarHover, setSidebarHover] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("24h");
  const [drill, setDrill] = useState<DrillContext | null>(null);
  const [hobDrill, setHobDrill] = useState<HobDrillId | null>(null);

  // Stage 4 §B.1.6 — money shot #3: "4 hours of manual case assembly → 3 seconds".
  // We track an `evidenceAssembling` flag so navigating into IO Evidence via a
  // drill-down's "Assemble Pack" CTA plays a 5-step progress animation.
  const [evidenceAssembling, setEvidenceAssembling] = useState(false);

  // Stage 4 §A — Trend Explorer (SCR-SHR-06). A small full-viewport overlay
  // opened from the SentimentDrift "Explore" button.
  const [trendExplorerOpen, setTrendExplorerOpen] = useState(false);

  const personaMeta = PERSONAS[persona];
  const displayRoleName = roleName ?? personaMeta.longLabel;
  const sidebarW = sidebarHover ? 268 : 76;

  const switchPersona = useCallback((next: PersonaId) => {
    setPersona(next);
    setDrill(null);
    setHobDrill(null);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleEvidenceAssembled = useCallback(() => setEvidenceAssembling(false), []);

  const scrollToFastagSection = useCallback((target: ScreenId) => {
    const root = mainScrollRef.current;
    if (!root) return;
    if (target === "primary") {
      root.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = root.querySelector(`#${FASTAG_SECTION_IDS[target]}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openHobExecutiveTile = useCallback((tileId: HobExecutiveTileId) => {
    setDrill(null);
    setHobDrill(tileId);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const sectionAnchorStyle: CSSProperties = { scrollMarginTop: 16 };

  return (
    <FastagPeriodProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: FT.bg,
          color: FT.text,
          overflow: "hidden",
        }}
      >
        <style jsx global>{`
          @keyframes ft-slide-in {
            from { transform: translateY(-8px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes ft-slide-in-right {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes ft-slide-in-left {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes ft-slide-in-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes ft-scale-in {
            from { transform: scale(0.94); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes ft-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          * {
            scrollbar-width: thin;
            scrollbar-color: ${FT.borderLight} ${FT.canvas};
          }
          *::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          *::-webkit-scrollbar-track {
            background: ${FT.canvas};
          }
          *::-webkit-scrollbar-thumb {
            background: ${FT.borderLight};
            border-radius: 5px;
            border: 2px solid ${FT.canvas};
          }
        `}</style>

        {/* Collapsible brand sidebar — same pattern as Head of Credit Cards */}
        <aside
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          style={{
            width: sidebarW,
            minWidth: sidebarW,
            transition: "width 0.22s ease, min-width 0.22s ease",
            borderRight: `1px solid ${FT.borderLight}`,
            background: FT.elevated,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 5,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: sidebarHover ? "18px 16px" : "14px 10px",
              borderBottom: `1px solid ${FT.borderLight}`,
              textAlign: sidebarHover ? "left" : "center",
            }}
          >
            {sidebarHover ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 800, color: FT.accent, letterSpacing: 2.5, textTransform: "uppercase" }}>Yaaralabs</div>
                <div style={{ fontSize: 13, color: FT.textMut, marginTop: 2 }}>Fluid CX · FASTag</div>
              </>
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  margin: "0 auto",
                  borderRadius: 10,
                  background: FT.accentSoft,
                  border: `1px solid ${FT.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: FT.accent,
                }}
                title="Yaaralabs · Fluid CX"
              >
                Y
              </div>
            )}
          </div>
          <div
            style={{
              padding: sidebarHover ? "12px 14px" : "10px 8px",
              borderBottom: `1px solid ${FT.borderLight}`,
              display: "flex",
              flexDirection: "column",
              gap: sidebarHover ? 8 : 6,
              alignItems: sidebarHover ? "stretch" : "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: sidebarHover ? "flex-start" : "center" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${industryColor}25`,
                  border: `1px solid ${industryColor}60`,
                  flexShrink: 0,
                }}
              />
              {sidebarHover ? <span style={{ fontSize: 13, fontWeight: 600, color: FT.text }}>{industryName}</span> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: sidebarHover ? "flex-start" : "center" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${industryColor}20`,
                  border: `1px solid ${industryColor}50`,
                  flexShrink: 0,
                }}
              />
              {sidebarHover ? <span style={{ fontSize: 13, fontWeight: 600, color: FT.primary }}>{displayRoleName}</span> : null}
            </div>
          </div>
          <div style={{ padding: sidebarHover ? "10px 8px" : "8px 6px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <button
              type="button"
              onClick={() => scrollToFastagSection("primary")}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: FT.primarySoft,
                color: FT.text,
                borderRadius: 8,
                padding: sidebarHover ? "8px 10px" : "10px 8px",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: sidebarHover ? 8 : 0,
                cursor: "pointer",
                borderLeft: `3px solid ${FT.primary}`,
                justifyContent: sidebarHover ? "flex-start" : "center",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: FT.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Activity size={11} color={FT.primary} />
              </div>
              {sidebarHover ? (
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  {persona === "hob" ? "Executive view" : "Operations console"}
                </span>
              ) : null}
            </button>
            {sidebarHover ? (
              <div style={{ fontSize: 10, color: FT.textMut, lineHeight: 1.5, padding: "4px 10px 12px" }}>
                3 areas · open a tile for detailed cards
              </div>
            ) : null}
          </div>
          {sidebarHover ? (
            <div style={{ padding: "8px 12px", borderTop: `1px solid ${FT.borderLight}`, fontSize: 10, color: FT.textSec, lineHeight: 1.55 }}>
              <div style={{ fontWeight: 700, color: FT.text, marginBottom: 4 }}>BPO partners</div>
              Trinetra · Anandam · Digital · Saksham
            </div>
          ) : null}
          <div
            style={{
              padding: sidebarHover ? "10px 12px" : "10px 8px",
              borderTop: `1px solid ${FT.borderLight}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {persona !== "hob" || hobDrill ? (
              <button
                type="button"
                onClick={() => onColorModeChange(colorMode === "light" ? "dark" : "light")}
                aria-label={colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                title={colorMode === "light" ? "Dark mode" : "Light mode"}
                style={{
                  width: "100%",
                  border: `1px solid ${FT.borderLight}`,
                  borderRadius: 8,
                  background: FT.surface,
                  color: FT.textSec,
                  padding: sidebarHover ? "8px 14px" : "10px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarHover ? "flex-start" : "center",
                  gap: sidebarHover ? 8 : 0,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {colorMode === "light" ? <Moon size={14} /> : <Sun size={14} />}
                {sidebarHover ? (colorMode === "light" ? "Dark mode" : "Light mode") : null}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onExit}
              style={{
                width: "100%",
                border: `1px solid ${FT.borderLight}`,
                borderRadius: 8,
                background: FT.surface,
                color: FT.textSec,
                padding: sidebarHover ? "8px 14px" : "10px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarHover ? "flex-start" : "center",
                gap: sidebarHover ? 8 : 0,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={12} />
              {sidebarHover ? "Change Role" : null}
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {persona !== "hob" || hobDrill ? (
        <header
          style={{
            flexShrink: 0,
            zIndex: 50,
            background: persona === "hob" ? "transparent" : FT.headerBackdrop,
            backdropFilter: persona === "hob" ? undefined : "blur(10px)",
            borderBottom: persona === "hob" ? "none" : `1px solid ${FT.border}`,
            padding: "12px 20px",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: persona === "hob" && hobDrill ? 12 : 0,
              border: persona === "hob" && hobDrill ? `1px solid ${FT.border}` : "none",
              background: persona === "hob" && hobDrill ? FT.elevated : "transparent",
              padding: persona === "hob" && hobDrill ? "12px 16px" : persona === "hob" ? "0 0 4px" : 0,
              display: "flex",
              flexDirection: "column",
              gap: persona === "hob" && hobDrill ? 12 : 0,
            }}
          >
          {persona === "hob" && hobDrill ? (
              <FastagPeriodFilterRow
                border={FT.border}
                elevated={FT.surface}
                text={FT.text}
                textSec={FT.textSec}
                accent={FT.accent}
                accentOnFill={FT.accentOnFill}
                backButtonBg={FT.backButtonBg}
                backButtonBorder={FT.backButtonBorder}
                drillTitle={HOB_GATEWAY_TILES.find((t) => t.id === hobDrill)?.title}
                onBack={() => setHobDrill(null)}
                showPeriodControls
              />
          ) : persona !== "hob" ? (
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${FT.primary}, #5532D6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 20px ${FT.primarySoft}`,
                }}
              >
                <Radio size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: FT.text, lineHeight: 1.1 }}>FASTag · Fluid CX</div>
                <div style={{ fontSize: 11, color: FT.textSec, marginTop: 3 }}>
                  {industryName} · {displayRoleName}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <>
                  {/* Persona switcher */}
                  <div style={{ display: "flex", background: FT.elevated, border: `1px solid ${FT.border}`, borderRadius: 10, padding: 4 }}>
                    {(Object.keys(PERSONAS) as PersonaId[]).map((p) => {
                      const meta = PERSONAS[p];
                      const Icon = meta.icon;
                      const active = persona === p;
                      return (
                        <button
                          key={p}
                          onClick={() => switchPersona(p)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: active ? FT.primary : "transparent",
                            color: active ? "white" : FT.textSec,
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <Icon size={13} />
                          {meta.shortLabel} · {meta.name.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Time window */}
                  <div style={{ display: "flex", background: FT.elevated, border: `1px solid ${FT.border}`, borderRadius: 10, padding: 4 }}>
                    {(["12h", "24h", "7d", "30d"] as TimeWindow[]).map((w) => (
                      <button
                        key={w}
                        onClick={() => setTimeWindow(w)}
                        style={{
                          background: timeWindow === w ? FT.accent : "transparent",
                          color: timeWindow === w ? FT.accentOnFill : FT.textSec,
                          border: "none",
                          borderRadius: 7,
                          padding: "6px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
              </>
            </div>
          </div>
          ) : null}
          </div>
        </header>
        ) : null}

        <main
          ref={mainScrollRef}
          style={{
            flex: 1,
            overflow: "auto",
            minHeight: 0,
            padding: "16px 20px",
          }}
        >
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            <DashboardErrorBoundary>
              {persona === "hob" ? (
                hobDrill ? (
                  <FastagHobDrillRouter drillId={hobDrill} />
                ) : (
                  <HobPrimaryView onTileOpen={openHobExecutiveTile} />
                )
              ) : (
                <>
                  <CohPrimaryView
                    onTileOpen={openHobExecutiveTile}
                  />
                </>
              )}
            </DashboardErrorBoundary>

            <div style={{ fontSize: 10, color: FT.textMut, textAlign: "center", letterSpacing: 0.4, paddingBottom: 8 }}>
              Fluid CX · conversation intelligence · boundary contract honoured on every drill-down
            </div>
          </div>
        </main>
        </div>

        <DrillDownPanel
          ctx={drill}
          onClose={() => setDrill(null)}
          onPrimaryAction={(target) => {
            setDrill(null);
            if (target === "io_evidence" && persona === "coh") setEvidenceAssembling(true);
            scrollToFastagSection(target);
          }}
          onCopyExport={(summary) => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              void navigator.clipboard.writeText(summary).catch(() => undefined);
            }
          }}
        />

        {trendExplorerOpen ? <TrendExplorerOverlay onClose={() => setTrendExplorerOpen(false)} /> : null}

        <FastagAIDayGenerator hidden={!!drill || !!hobDrill || persona !== "hob"} />
      </div>
    </FastagPeriodProvider>
  );
}

export default FastagIntelligenceDashboard;
