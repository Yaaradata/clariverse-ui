"use client";

import {
  Activity,
  ArrowLeft,
  Briefcase,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Flag,
  Globe,
  Headphones,
  Heart,
  Info,
  Languages,
  Link2,
  ListChecks,
  Lock,
  type LucideIcon,
  Megaphone,
  MessagesSquare,
  Minus,
  Phone,
  Plug,
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  OBLIGATION_MET_BY_ID,
  OBLIGATION_MET_SUMMARIES,
  REGISTER_CONDUCT_RISK_SCORE,
  REGISTER_FLUID_ALONE_COUNT,
  REGISTER_OVERALL_MET_PCT,
  TOP_CALL_REASONS,
  VIOLATION_TREND_WEEKLY,
} from "@/lib/role-based-dashboard/rbiObligationRegister";
import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";

import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
} from "./DashboardThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
//  RBI CONDUCT INTELLIGENCE — Next.js client dashboard
//  Mirrors the dense, glassy, dark aesthetic of OpenbankInsightExecutiveDashboard.
//  Reference: docs/RBI-build (Pass 4 PRD · Pass 5 UX · Pass 6 Architecture · Pass 7 Build).
//  Single-file deliverable with inline mock data. No fetch, no storage.
// ─────────────────────────────────────────────────────────────────────────────

const rbiHeadlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

/** Fixed mock "today" used across the dashboard. */
const TODAY_ISO = "2026-05-25";

const COLORS = {
  bg: "#070707",
  card: "#0d0d0d",
  card2: "#121212",
  inset: "#1a1a1a",
  border: "#242424",
  border2: "#3a3a3a",
  text: "#ffffff",
  muted: "#939394",
  dim: "#6b7280",
  teal: "#14b8a6",
  tealSoft: "#0d9488",
  indigo: "#6366f1",
  purple: "#a78bfa",
  red: "#ef4444",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#38bdf8",
  blue: "#60a5fa",
  saffron: "#f97316",
} as const;

const severityColor = {
  CRITICAL: COLORS.red,
  HIGH: COLORS.amber,
  MEDIUM: COLORS.yellow,
  LOW: COLORS.dim,
  Critical: COLORS.red,
  High: COLORS.amber,
  Watch: COLORS.yellow,
  Good: COLORS.green,
  Improving: COLORS.green,
  Working: COLORS.green,
  New: COLORS.purple,
  Pending: COLORS.dim,
  ESCALATED_TO_IO: COLORS.purple,
  ACTIONED: COLORS.green,
  IN_REVIEW: COLORS.blue,
  OPEN: COLORS.red,
  CLOSED: COLORS.dim,
  IN_FORCE: COLORS.blue,
  DRAFT_PROPOSED: COLORS.amber,
  SUPERVISORY_SIGNAL: COLORS.purple,
} as const;

type SeverityKey = keyof typeof severityColor;

function cx(...items: Array<string | false | null | undefined>): string {
  return items.filter(Boolean).join(" ");
}

function list<T>(value: ReadonlyArray<T> | null | undefined): T[] {
  return value?.length ? [...value] : [];
}

function colorFor(key: string): string {
  if (key in severityColor) {
    return severityColor[key as SeverityKey];
  }
  return COLORS.teal;
}

function daysUntil(isoDate: string, today = TODAY_ISO): number {
  const a = new Date(today).getTime();
  const b = new Date(isoDate).getTime();
  return Math.round((b - a) / 86_400_000);
}

function _relativeAge(isoDate: string, today = TODAY_ISO): string {
  const diff = -daysUntil(isoDate, today);
  if (diff < 1) return "today";
  if (diff < 2) return "yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.round(diff / 7)} wks ago`;
  return `${Math.round(diff / 30)} mo ago`;
}

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN");
}

// ─────────────────────────────────────────────────────────────────────────────
//  PERSONA CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

type PersonaId = "L1" | "L2" | "L3" | "L4" | "L5";

type ExecutivePersona = {
  personaId: PersonaId;
  displayName: string;
  realWorldTitle: string;
  primaryLens: string;
  pulseQuestion: string;
};

const PERSONAS: readonly ExecutivePersona[] = [
  {
    personaId: "L1",
    displayName: "Board / NRC",
    realWorldTitle: "Board / NRC Member",
    primaryLens: "Conduct exposure narrative",
    pulseQuestion:
      "What conduct exposure does the supervisor see in our bank this quarter?",
  },
  {
    personaId: "L2",
    displayName: "CCO",
    realWorldTitle: "Chief Customer Officer",
    primaryLens: "Vulnerable customer treatment",
    pulseQuestion: "How are vulnerable customers being treated today?",
  },
  {
    personaId: "L3",
    displayName: "Head of CX",
    realWorldTitle: "Head of Customer Experience",
    primaryLens: "Daily worklist · FCR · missed complaints",
    pulseQuestion: "What is open in my queue, and what is the evidence?",
  },
  {
    personaId: "L4",
    displayName: "CRO / Conduct",
    realWorldTitle: "CRO / Chief Conduct Officer",
    primaryLens: "Regulatory exposure · vendor governance",
    pulseQuestion:
      "What is our exposure against the 30-Jun and 1-Jul 2026 deadlines?",
  },
  {
    personaId: "L5",
    displayName: "Internal Ombudsman",
    realWorldTitle: "Internal Ombudsman",
    primaryLens: "Escalations · IO referrals",
    pulseQuestion: "Which cases need independent review before RB-IOS?",
  },
];

type RbiTab = "coverage" | "operations";

type RbiContextValue = {
  activePersonaId: PersonaId;
  setActivePersonaId: (id: PersonaId) => void;
  activeTab: RbiTab;
  setActiveTab: (tab: RbiTab) => void;
  drawerAlertId: string | null;
  drawerObligationId: string | null;
  openEvidenceDrawer: (alertId: string) => void;
  openObligationDrawer: (oblId: string) => void;
  closeDrawer: () => void;
};

const PersonaContext = createContext<RbiContextValue | null>(null);

function usePersona(): RbiContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("PersonaContext missing");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK DATA — Suvarna Bank (fictional Indian Private Bank, ~600 branches)
// ─────────────────────────────────────────────────────────────────────────────

type Regulation = {
  regulationId: string;
  shortName: string;
  circularRef: string;
  issuingBody: string;
  dateIssued: string;
  effectiveDate: string;
  status: "IN_FORCE" | "DRAFT_PROPOSED" | "SUPERVISORY_SIGNAL";
  scope: string;
};

const REGULATIONS: readonly Regulation[] = [
  {
    regulationId: "REG-001",
    shortName: "RBC Directions 2025",
    circularRef: "RBI/DOR/2025-26/170",
    issuingBody: "RBI",
    dateIssued: "2025-11-12",
    effectiveDate: "2026-04-01",
    status: "IN_FORCE",
    scope: "Commercial Banks",
  },
  {
    regulationId: "REG-002",
    shortName: "IO Directions 2026",
    circularRef: "RBI/DOR/2026-27/15",
    issuingBody: "RBI",
    dateIssued: "2026-01-08",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    scope: "Commercial Banks & NBFCs",
  },
  {
    regulationId: "REG-003",
    shortName: "RB-IOS 2026 (Integrated Ombudsman)",
    circularRef: "RBI/CEPD/2026-27/04",
    issuingBody: "RBI",
    dateIssued: "2026-02-04",
    effectiveDate: "2026-07-01",
    status: "IN_FORCE",
    scope: "All Regulated Entities",
  },
  {
    regulationId: "REG-004",
    shortName: "Outsourcing of IT & Recovery Directions",
    circularRef: "RBI/DOS/2025-26/91",
    issuingBody: "RBI",
    dateIssued: "2025-10-02",
    effectiveDate: "2026-04-10",
    status: "IN_FORCE",
    scope: "Commercial Banks",
  },
  {
    regulationId: "REG-005",
    shortName: "Draft Fair Practice Recovery Framework",
    circularRef: "RBI/DOR/2026-27/Draft-22",
    issuingBody: "RBI",
    dateIssued: "2026-03-18",
    effectiveDate: "2026-07-01",
    status: "DRAFT_PROPOSED",
    scope: "Commercial Banks",
  },
  {
    regulationId: "REG-006",
    shortName: "DPDP Substantive Obligations",
    circularRef: "MeitY/DPDP/2025/Notif-04",
    issuingBody: "MeitY",
    dateIssued: "2025-08-22",
    effectiveDate: "2027-05-13",
    status: "IN_FORCE",
    scope: "All Data Fiduciaries",
  },
  {
    regulationId: "REG-007",
    shortName: "Cross-Border CNP Authentication",
    circularRef: "RBI/DPSS/2025-26/55",
    issuingBody: "RBI",
    dateIssued: "2025-09-30",
    effectiveDate: "2026-10-01",
    status: "IN_FORCE",
    scope: "Card Issuing Banks",
  },
];

type ConductTheme = {
  themeId: string;
  themeName: string;
  themeDefinition: string;
  primaryLens: PersonaId;
  obligationCount: number;
  weeklyExceptions: number;
  trend: "RISING" | "STABLE" | "FALLING";
};

const THEMES: readonly ConductTheme[] = [
  {
    themeId: "THM-01",
    themeName: "Complaint Capture & First-90s",
    themeDefinition:
      "Detect every complaint expressed in conversation, even if no SR was created.",
    primaryLens: "L3",
    obligationCount: 6,
    weeklyExceptions: 412,
    trend: "RISING",
  },
  {
    themeId: "THM-02",
    themeName: "Recovery Conduct",
    themeDefinition:
      "Threats, harassment, public shaming, non-borrower contact, profanity, banned phrasing.",
    primaryLens: "L4",
    obligationCount: 7,
    weeklyExceptions: 287,
    trend: "RISING",
  },
  {
    themeId: "THM-03",
    themeName: "Vulnerable Customer Care",
    themeDefinition:
      "Bereavement, distress, fraud-victim, MSE, PwD — including on the general queue.",
    primaryLens: "L2",
    obligationCount: 5,
    weeklyExceptions: 138,
    trend: "STABLE",
  },
  {
    themeId: "THM-04",
    themeName: "Cross-Sell & Bundling Pressure",
    themeDefinition:
      "Consent-extraction language, mandatory-bundling phrasing in sales scripts.",
    primaryLens: "L2",
    obligationCount: 4,
    weeklyExceptions: 264,
    trend: "RISING",
  },
  {
    themeId: "THM-05",
    themeName: "Vendor BPO Governance",
    themeDefinition:
      "Outsourced agent conduct parity with in-house — sampling collapse risk.",
    primaryLens: "L4",
    obligationCount: 4,
    weeklyExceptions: 197,
    trend: "RISING",
  },
  {
    themeId: "THM-06",
    themeName: "Repeat-Contact & FCR",
    themeDefinition:
      "Same-customer same-issue contacts within a window — operational ROI lens.",
    primaryLens: "L3",
    obligationCount: 3,
    weeklyExceptions: 1842,
    trend: "STABLE",
  },
  {
    themeId: "THM-07",
    themeName: "Disclosure-in-Conversation",
    themeDefinition:
      "KFS read-out, cooling-off mention, pre-payment terms, penal-charge phrasing.",
    primaryLens: "L1",
    obligationCount: 5,
    weeklyExceptions: 64,
    trend: "FALLING",
  },
  {
    themeId: "THM-08",
    themeName: "Language & Campaign Conduct",
    themeDefinition:
      "Language-mismatch (Tamil customer / English agent), campaign-deviation, mis-selling.",
    primaryLens: "L5",
    obligationCount: 4,
    weeklyExceptions: 91,
    trend: "STABLE",
  },
];

type BuildTier =
  | "MAIN_FEATURE"
  | "INTEGRATION_DEPENDENT"
  | "EVIDENCE_ONLY"
  | "OUT_OF_SCOPE";

const BUILD_TIER_MAP: Record<
  BuildTier,
  { label: string; color: string; outlined: boolean }
> = {
  MAIN_FEATURE: {
    label: "Monitored by Fluid CX",
    color: COLORS.teal,
    outlined: false,
  },
  INTEGRATION_DEPENDENT: {
    label: "Monitored with system integration",
    color: COLORS.teal,
    outlined: true,
  },
  EVIDENCE_ONLY: {
    label: "Evidence support only",
    color: COLORS.muted,
    outlined: true,
  },
  OUT_OF_SCOPE: {
    label: "Outside Fluid CX scope",
    color: COLORS.dim,
    outlined: false,
  },
};

type Obligation = {
  oblId: string;
  statement: string;
  themeId: string;
  parentRegulationId: string;
  effectiveDate: string;
  status: "IN_FORCE" | "DRAFT_PROPOSED";
  buildTier: BuildTier;
  accountablePersonaId: PersonaId;
  businessProcessOwnerRole: string;
  exceptionCount: number;
  vulnerableCustomerFlag: boolean;
  branchDependentFlag: boolean;
};

const OBLIGATIONS: readonly Obligation[] = [
  {
    oblId: "OBL-001",
    statement:
      "Detect and reconcile every customer complaint expressed in conversation against CMS SR records.",
    themeId: "THM-01",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L3",
    businessProcessOwnerRole: "Head of CX",
    exceptionCount: 412,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-002",
    statement:
      "First 90 seconds of every inbound complaint must include acknowledgement, SR offer, and escalation route.",
    themeId: "THM-01",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L3",
    businessProcessOwnerRole: "Head of CX",
    exceptionCount: 188,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-005",
    statement:
      "Recovery calls shall not threaten, shame, harass, or contact non-borrowers.",
    themeId: "THM-02",
    parentRegulationId: "REG-005",
    effectiveDate: "2026-07-01",
    status: "DRAFT_PROPOSED",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L4",
    businessProcessOwnerRole: "Head of Collections",
    exceptionCount: 67,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-008",
    statement:
      "Engage hardship pathway when borrower-distress markers are detected during recovery.",
    themeId: "THM-02",
    parentRegulationId: "REG-005",
    effectiveDate: "2026-07-01",
    status: "DRAFT_PROPOSED",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L2",
    businessProcessOwnerRole: "Head of Customer",
    exceptionCount: 54,
    vulnerableCustomerFlag: true,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-011",
    statement:
      "Bereaved customers shall be handled with empathy and routed to specialist desk.",
    themeId: "THM-03",
    parentRegulationId: "REG-001",
    effectiveDate: "2026-03-31",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L2",
    businessProcessOwnerRole: "Head of Customer",
    exceptionCount: 23,
    vulnerableCustomerFlag: true,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-018",
    statement:
      "Cross-sell shall not extract consent under pressure or mandate bundled products.",
    themeId: "THM-04",
    parentRegulationId: "REG-001",
    effectiveDate: "2026-04-01",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L2",
    businessProcessOwnerRole: "Head of Sales",
    exceptionCount: 264,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-024",
    statement:
      "Vendor BPO conduct parity vs in-house — 100% interaction coverage required.",
    themeId: "THM-05",
    parentRegulationId: "REG-004",
    effectiveDate: "2026-04-10",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L4",
    businessProcessOwnerRole: "Head of Outsourcing",
    exceptionCount: 197,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-027",
    statement:
      "Vulnerable customers shall not be left on general queue after detection signals appear.",
    themeId: "THM-03",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L2",
    businessProcessOwnerRole: "Head of Customer",
    exceptionCount: 41,
    vulnerableCustomerFlag: true,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-030",
    statement:
      "Repeat-contact same-customer same-issue must trigger FCR root-cause cluster review.",
    themeId: "THM-06",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "MAIN_FEATURE",
    accountablePersonaId: "L3",
    businessProcessOwnerRole: "Head of CX",
    exceptionCount: 1842,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-014",
    statement:
      "Key Fact Statement (KFS) shall be read out during loan/credit card sales.",
    themeId: "THM-07",
    parentRegulationId: "REG-001",
    effectiveDate: "2026-04-01",
    status: "IN_FORCE",
    buildTier: "INTEGRATION_DEPENDENT",
    accountablePersonaId: "L1",
    businessProcessOwnerRole: "Head of Products",
    exceptionCount: 44,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-019",
    statement:
      "Penal charges shall not be phrased as penal interest in any customer communication.",
    themeId: "THM-07",
    parentRegulationId: "REG-001",
    effectiveDate: "2026-04-01",
    status: "IN_FORCE",
    buildTier: "EVIDENCE_ONLY",
    accountablePersonaId: "L1",
    businessProcessOwnerRole: "Head of Products",
    exceptionCount: 12,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-029",
    statement:
      "Language-mismatch (regional customer → English-only agent) shall trigger re-routing.",
    themeId: "THM-08",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "INTEGRATION_DEPENDENT",
    accountablePersonaId: "L5",
    businessProcessOwnerRole: "Head of Contact Centre",
    exceptionCount: 76,
    vulnerableCustomerFlag: false,
    branchDependentFlag: true,
  },
  {
    oblId: "OBL-022",
    statement:
      "CMS workflow auto-escalation when SR not resolved within timelines.",
    themeId: "THM-01",
    parentRegulationId: "REG-002",
    effectiveDate: "2026-06-30",
    status: "IN_FORCE",
    buildTier: "OUT_OF_SCOPE",
    accountablePersonaId: "L4",
    businessProcessOwnerRole: "Head of CMS (TCS BaNCS)",
    exceptionCount: 0,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
  {
    oblId: "OBL-032",
    statement: "Dark-pattern UI audit on consent flows in mobile + web app.",
    themeId: "THM-04",
    parentRegulationId: "REG-006",
    effectiveDate: "2027-05-13",
    status: "IN_FORCE",
    buildTier: "OUT_OF_SCOPE",
    accountablePersonaId: "L1",
    businessProcessOwnerRole: "Head of Digital / Design",
    exceptionCount: 0,
    vulnerableCustomerFlag: false,
    branchDependentFlag: false,
  },
];

type ControlOwner = {
  ownerId: string;
  roleTitle: string;
  lineOfDefence: "1LoD" | "2LoD" | "3LoD";
  personaId: PersonaId;
};

const CONTROL_OWNERS: readonly ControlOwner[] = [
  {
    ownerId: "OWN-CX01",
    roleTitle: "Head of CX",
    lineOfDefence: "1LoD",
    personaId: "L3",
  },
  {
    ownerId: "OWN-COLL01",
    roleTitle: "Head of Collections",
    lineOfDefence: "1LoD",
    personaId: "L4",
  },
  {
    ownerId: "OWN-CUST01",
    roleTitle: "Head of Customer",
    lineOfDefence: "1LoD",
    personaId: "L2",
  },
  {
    ownerId: "OWN-SALES01",
    roleTitle: "Head of Sales",
    lineOfDefence: "1LoD",
    personaId: "L2",
  },
  {
    ownerId: "OWN-OUTS01",
    roleTitle: "Head of Outsourcing",
    lineOfDefence: "2LoD",
    personaId: "L4",
  },
  {
    ownerId: "OWN-CCR01",
    roleTitle: "Conduct Risk Lead",
    lineOfDefence: "2LoD",
    personaId: "L4",
  },
  {
    ownerId: "OWN-IO01",
    roleTitle: "Internal Ombudsman Office",
    lineOfDefence: "3LoD",
    personaId: "L5",
  },
  {
    ownerId: "OWN-AUDIT01",
    roleTitle: "Conduct Audit",
    lineOfDefence: "3LoD",
    personaId: "L4",
  },
];

type SignalType =
  | "threat_language"
  | "profanity"
  | "harassment_pattern"
  | "public_shaming"
  | "customer_distress"
  | "bundling_pressure"
  | "consent_extraction"
  | "complaint_marker_no_SR"
  | "empathy_failure"
  | "non_borrower_contact"
  | "language_mismatch"
  | "banned_phrase_penal_interest";

const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  threat_language: "Threat language",
  profanity: "Profanity",
  harassment_pattern: "Harassment pattern",
  public_shaming: "Public shaming",
  customer_distress: "Customer distress",
  bundling_pressure: "Bundling pressure",
  consent_extraction: "Consent extraction",
  complaint_marker_no_SR: "Complaint, no SR",
  empathy_failure: "Empathy failure",
  non_borrower_contact: "Non-borrower contact",
  language_mismatch: "Language mismatch",
  banned_phrase_penal_interest: "Banned phrase: penal interest",
};

type InteractionSignal = {
  signalId: string;
  interactionId: string;
  channel: "voice" | "chat" | "email" | "social" | "ticket";
  direction: "INBOUND" | "OUTBOUND" | "INTERNAL_TRANSFER";
  signalType: SignalType;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  transcriptSnippet: string;
  language: "en" | "hi" | "ta" | "te" | "kn" | "mr";
  agentId: string;
  vendorId: string | null;
  productCode: "Cards" | "PL" | "HL" | "SavAcct" | "ULIP" | "MF";
  customerSegment: "retail" | "MSE" | "wealth" | "NRI";
  timestamp: string;
  relatedObligationIds: readonly string[];
  relatedAlertId: string | null;
};

const SIGNALS: readonly InteractionSignal[] = [
  {
    signalId: "SIG-018472",
    interactionId: "INT-92113",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "threat_language",
    severity: "CRITICAL",
    transcriptSnippet:
      "agar kal tak nahi diya toh hum aapke office aa jayenge aur sabko bata denge",
    language: "hi",
    agentId: "AG-2204",
    vendorId: "VEN-014",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-24T11:18:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3301",
  },
  {
    signalId: "SIG-018473",
    interactionId: "INT-92114",
    channel: "voice",
    direction: "INBOUND",
    signalType: "complaint_marker_no_SR",
    severity: "HIGH",
    transcriptSnippet:
      "I have been calling for three weeks now, no one is resolving my dispute",
    language: "en",
    agentId: "AG-1102",
    vendorId: null,
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-24T09:42:00+05:30",
    relatedObligationIds: ["OBL-001", "OBL-002"],
    relatedAlertId: "ALT-3302",
  },
  {
    signalId: "SIG-018474",
    interactionId: "INT-92115",
    channel: "voice",
    direction: "INBOUND",
    signalType: "bundling_pressure",
    severity: "HIGH",
    transcriptSnippet:
      "madam, salary account ke saath insurance lena compulsory hai",
    language: "hi",
    agentId: "AG-3017",
    vendorId: null,
    productCode: "SavAcct",
    customerSegment: "retail",
    timestamp: "2026-05-23T15:08:00+05:30",
    relatedObligationIds: ["OBL-018"],
    relatedAlertId: "ALT-3303",
  },
  {
    signalId: "SIG-018475",
    interactionId: "INT-92116",
    channel: "voice",
    direction: "INBOUND",
    signalType: "customer_distress",
    severity: "CRITICAL",
    transcriptSnippet:
      "mere husband ka abhi operation hua hai ... Agent: Madam EMI toh deni hi padegi",
    language: "hi",
    agentId: "AG-2204",
    vendorId: "VEN-014",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-22T13:54:00+05:30",
    relatedObligationIds: ["OBL-008"],
    relatedAlertId: "ALT-3304",
  },
  {
    signalId: "SIG-018476",
    interactionId: "INT-92117",
    channel: "voice",
    direction: "INBOUND",
    signalType: "language_mismatch",
    severity: "MEDIUM",
    transcriptSnippet: "vangiyathu nalla iruku, aana neenga help pannala",
    language: "ta",
    agentId: "AG-4422",
    vendorId: "VEN-001",
    productCode: "HL",
    customerSegment: "retail",
    timestamp: "2026-05-23T10:22:00+05:30",
    relatedObligationIds: ["OBL-029"],
    relatedAlertId: "ALT-3305",
  },
  {
    signalId: "SIG-018477",
    interactionId: "INT-92118",
    channel: "voice",
    direction: "INBOUND",
    signalType: "empathy_failure",
    severity: "CRITICAL",
    transcriptSnippet:
      "Customer: My husband passed away last week ... Agent: Please submit Form 15G at the branch.",
    language: "en",
    agentId: "AG-1103",
    vendorId: null,
    productCode: "SavAcct",
    customerSegment: "wealth",
    timestamp: "2026-05-22T17:05:00+05:30",
    relatedObligationIds: ["OBL-011"],
    relatedAlertId: "ALT-3306",
  },
  {
    signalId: "SIG-018478",
    interactionId: "INT-92119",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "harassment_pattern",
    severity: "CRITICAL",
    transcriptSnippet:
      "nimma loan EMI bandide, swalpa adjust madkolli ... aaru baari call madidini, beda andre office ge banni",
    language: "kn",
    agentId: "AG-2207",
    vendorId: "VEN-014",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-21T16:30:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3301",
  },
  {
    signalId: "SIG-018479",
    interactionId: "INT-92120",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "public_shaming",
    severity: "HIGH",
    transcriptSnippet:
      "aapke padosi ko bhi bata dunga ki aap default kar rahe hain",
    language: "hi",
    agentId: "AG-2208",
    vendorId: "VEN-014",
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-20T14:11:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3301",
  },
  {
    signalId: "SIG-018480",
    interactionId: "INT-92121",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "non_borrower_contact",
    severity: "HIGH",
    transcriptSnippet:
      "agent dialled spouse number 4 times before borrower number — borrower number on file",
    language: "en",
    agentId: "AG-2209",
    vendorId: "VEN-002",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-19T11:48:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3307",
  },
  {
    signalId: "SIG-018481",
    interactionId: "INT-92122",
    channel: "chat",
    direction: "INBOUND",
    signalType: "consent_extraction",
    severity: "HIGH",
    transcriptSnippet:
      "agent: I'll add the ULIP to your application — you can cancel later, just say yes to proceed",
    language: "en",
    agentId: "AG-3018",
    vendorId: null,
    productCode: "ULIP",
    customerSegment: "wealth",
    timestamp: "2026-05-23T11:12:00+05:30",
    relatedObligationIds: ["OBL-018"],
    relatedAlertId: "ALT-3303",
  },
  {
    signalId: "SIG-018482",
    interactionId: "INT-92123",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "banned_phrase_penal_interest",
    severity: "MEDIUM",
    transcriptSnippet:
      "agar 5 din ke andar payment nahi hua to penal interest charge ho jayega",
    language: "hi",
    agentId: "AG-2210",
    vendorId: "VEN-001",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-22T10:05:00+05:30",
    relatedObligationIds: ["OBL-019"],
    relatedAlertId: "ALT-3308",
  },
  {
    signalId: "SIG-018483",
    interactionId: "INT-92124",
    channel: "voice",
    direction: "INBOUND",
    signalType: "complaint_marker_no_SR",
    severity: "HIGH",
    transcriptSnippet:
      "मेरी ECS bounce charge wapas chahiye, agent ne kuch nahi kiya, SR bhi nahi banaya",
    language: "hi",
    agentId: "AG-1104",
    vendorId: null,
    productCode: "SavAcct",
    customerSegment: "retail",
    timestamp: "2026-05-24T14:20:00+05:30",
    relatedObligationIds: ["OBL-001", "OBL-002"],
    relatedAlertId: "ALT-3302",
  },
  {
    signalId: "SIG-018484",
    interactionId: "INT-92125",
    channel: "voice",
    direction: "INBOUND",
    signalType: "customer_distress",
    severity: "HIGH",
    transcriptSnippet: "naa husband death aayindi ... naaku okka EMI kattalemu",
    language: "te",
    agentId: "AG-1107",
    vendorId: null,
    productCode: "HL",
    customerSegment: "retail",
    timestamp: "2026-05-23T16:44:00+05:30",
    relatedObligationIds: ["OBL-008", "OBL-011"],
    relatedAlertId: "ALT-3306",
  },
  {
    signalId: "SIG-018485",
    interactionId: "INT-92126",
    channel: "voice",
    direction: "INBOUND",
    signalType: "language_mismatch",
    severity: "LOW",
    transcriptSnippet:
      "marathi customer routed to english-only agent — held 6 min before transfer",
    language: "mr",
    agentId: "AG-1108",
    vendorId: null,
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-22T09:18:00+05:30",
    relatedObligationIds: ["OBL-029"],
    relatedAlertId: "ALT-3305",
  },
  {
    signalId: "SIG-018486",
    interactionId: "INT-92127",
    channel: "voice",
    direction: "INBOUND",
    signalType: "complaint_marker_no_SR",
    severity: "MEDIUM",
    transcriptSnippet:
      "I am very disappointed, please escalate this to your supervisor",
    language: "en",
    agentId: "AG-1109",
    vendorId: null,
    productCode: "HL",
    customerSegment: "wealth",
    timestamp: "2026-05-24T08:32:00+05:30",
    relatedObligationIds: ["OBL-001"],
    relatedAlertId: "ALT-3302",
  },
  {
    signalId: "SIG-018487",
    interactionId: "INT-92128",
    channel: "chat",
    direction: "INBOUND",
    signalType: "bundling_pressure",
    severity: "MEDIUM",
    transcriptSnippet:
      "Bot: For approval we recommend adding accidental cover — please type YES",
    language: "en",
    agentId: "AG-BOT-CC",
    vendorId: null,
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-23T19:02:00+05:30",
    relatedObligationIds: ["OBL-018"],
    relatedAlertId: "ALT-3303",
  },
  {
    signalId: "SIG-018488",
    interactionId: "INT-92129",
    channel: "voice",
    direction: "INBOUND",
    signalType: "empathy_failure",
    severity: "HIGH",
    transcriptSnippet:
      "fraud victim called — agent: ma'am please file FIR first, then call back",
    language: "en",
    agentId: "AG-1110",
    vendorId: null,
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-23T20:15:00+05:30",
    relatedObligationIds: ["OBL-011", "OBL-027"],
    relatedAlertId: "ALT-3309",
  },
  {
    signalId: "SIG-018489",
    interactionId: "INT-92130",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "threat_language",
    severity: "CRITICAL",
    transcriptSnippet:
      "we will send recovery team to your home tomorrow morning, get ready",
    language: "en",
    agentId: "AG-2211",
    vendorId: "VEN-002",
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-21T12:40:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3301",
  },
  {
    signalId: "SIG-018490",
    interactionId: "INT-92131",
    channel: "voice",
    direction: "INBOUND",
    signalType: "customer_distress",
    severity: "MEDIUM",
    transcriptSnippet:
      "lost my job last month, can you give me 3 months relief on EMI please",
    language: "en",
    agentId: "AG-2212",
    vendorId: "VEN-001",
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-22T14:25:00+05:30",
    relatedObligationIds: ["OBL-008"],
    relatedAlertId: "ALT-3304",
  },
  {
    signalId: "SIG-018491",
    interactionId: "INT-92132",
    channel: "chat",
    direction: "INBOUND",
    signalType: "complaint_marker_no_SR",
    severity: "MEDIUM",
    transcriptSnippet:
      "bot escalated to agent — agent disconnected without creating SR; conversation length 18 min",
    language: "en",
    agentId: "AG-3019",
    vendorId: null,
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-24T07:22:00+05:30",
    relatedObligationIds: ["OBL-001"],
    relatedAlertId: "ALT-3302",
  },
  {
    signalId: "SIG-018492",
    interactionId: "INT-92133",
    channel: "voice",
    direction: "INBOUND",
    signalType: "language_mismatch",
    severity: "MEDIUM",
    transcriptSnippet:
      "telugu customer escalated 3 times before reaching telugu-speaking agent",
    language: "te",
    agentId: "AG-1111",
    vendorId: null,
    productCode: "SavAcct",
    customerSegment: "retail",
    timestamp: "2026-05-21T11:08:00+05:30",
    relatedObligationIds: ["OBL-029"],
    relatedAlertId: "ALT-3305",
  },
  {
    signalId: "SIG-018493",
    interactionId: "INT-92134",
    channel: "voice",
    direction: "OUTBOUND",
    signalType: "non_borrower_contact",
    severity: "MEDIUM",
    transcriptSnippet:
      "called borrower's elderly mother 3 times — she is not co-borrower or guarantor",
    language: "kn",
    agentId: "AG-2213",
    vendorId: "VEN-014",
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-20T15:35:00+05:30",
    relatedObligationIds: ["OBL-005"],
    relatedAlertId: "ALT-3307",
  },
  {
    signalId: "SIG-018494",
    interactionId: "INT-92135",
    channel: "voice",
    direction: "INBOUND",
    signalType: "complaint_marker_no_SR",
    severity: "HIGH",
    transcriptSnippet:
      "I want to lodge a formal complaint about double-debit on my card statement",
    language: "en",
    agentId: "AG-1112",
    vendorId: null,
    productCode: "Cards",
    customerSegment: "retail",
    timestamp: "2026-05-24T10:12:00+05:30",
    relatedObligationIds: ["OBL-001", "OBL-002"],
    relatedAlertId: "ALT-3302",
  },
  {
    signalId: "SIG-018495",
    interactionId: "INT-92136",
    channel: "voice",
    direction: "INBOUND",
    signalType: "bundling_pressure",
    severity: "HIGH",
    transcriptSnippet:
      "agent insisted Health Insurance is mandatory along with PL — said system won't allow otherwise",
    language: "en",
    agentId: "AG-3020",
    vendorId: null,
    productCode: "PL",
    customerSegment: "retail",
    timestamp: "2026-05-22T16:18:00+05:30",
    relatedObligationIds: ["OBL-018"],
    relatedAlertId: "ALT-3303",
  },
  {
    signalId: "SIG-018496",
    interactionId: "INT-92137",
    channel: "voice",
    direction: "INBOUND",
    signalType: "customer_distress",
    severity: "HIGH",
    transcriptSnippet:
      "I am being shouted at on the road by recovery boys, please stop this, I have small children",
    language: "en",
    agentId: "AG-1113",
    vendorId: null,
    productCode: "PL",
    customerSegment: "MSE",
    timestamp: "2026-05-19T17:42:00+05:30",
    relatedObligationIds: ["OBL-008", "OBL-027"],
    relatedAlertId: "ALT-3304",
  },
];

type RiskAlert = {
  alertId: string;
  alertTitle: string;
  obligationId: string;
  themeId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  signalIds: readonly string[];
  affectedAgentIds: readonly string[];
  affectedVendorIds: readonly string[];
  firstObservedTs: string;
  lastObservedTs: string;
  occurrenceCount: number;
  routedToOwnerId: string;
  status: "OPEN" | "IN_REVIEW" | "ACTIONED" | "CLOSED" | "ESCALATED_TO_IO";
  recommendedAction: string;
  boardPackInclusion: boolean;
  evidenceIds: readonly string[];
};

const RISK_ALERTS: readonly RiskAlert[] = [
  {
    alertId: "ALT-3301",
    alertTitle:
      "Threat & shaming pattern in Pinnacle Recovery — 9 calls in 4 days",
    obligationId: "OBL-005",
    themeId: "THM-02",
    severity: "CRITICAL",
    signalIds: ["SIG-018472", "SIG-018478", "SIG-018479", "SIG-018489"],
    affectedAgentIds: ["AG-2204", "AG-2207", "AG-2208", "AG-2211"],
    affectedVendorIds: ["VEN-014", "VEN-002"],
    firstObservedTs: "2026-05-20T00:00:00+05:30",
    lastObservedTs: "2026-05-24T11:18:00+05:30",
    occurrenceCount: 9,
    routedToOwnerId: "OWN-COLL01",
    status: "OPEN",
    recommendedAction:
      "Suspend Pinnacle Recovery (VEN-014) outbound dialler until vendor attests on Section 7 of OBL-005.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7741", "EVD-7742", "EVD-7743"],
  },
  {
    alertId: "ALT-3302",
    alertTitle:
      "Missed-complaint hub: 47 inbound complaints with zero CMS SR (yesterday)",
    obligationId: "OBL-001",
    themeId: "THM-01",
    severity: "CRITICAL",
    signalIds: [
      "SIG-018473",
      "SIG-018483",
      "SIG-018486",
      "SIG-018491",
      "SIG-018494",
    ],
    affectedAgentIds: ["AG-1102", "AG-1104", "AG-1109", "AG-3019", "AG-1112"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-24T00:00:00+05:30",
    lastObservedTs: "2026-05-24T14:20:00+05:30",
    occurrenceCount: 47,
    routedToOwnerId: "OWN-CX01",
    status: "OPEN",
    recommendedAction:
      "Surface the 47 detected complaints to Head of CX for CMS SR creation. Fluid does not write SR records — route via CMS complaint intake workflow.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7744", "EVD-7745"],
  },
  {
    alertId: "ALT-3303",
    alertTitle:
      "Bundling-pressure cluster — Salary-A/c + ULIP cross-sell script",
    obligationId: "OBL-018",
    themeId: "THM-04",
    severity: "HIGH",
    signalIds: ["SIG-018474", "SIG-018481", "SIG-018487", "SIG-018495"],
    affectedAgentIds: ["AG-3017", "AG-3018", "AG-3020"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-22T00:00:00+05:30",
    lastObservedTs: "2026-05-23T15:08:00+05:30",
    occurrenceCount: 28,
    routedToOwnerId: "OWN-SALES01",
    status: "IN_REVIEW",
    recommendedAction:
      "Halt Cross-Sell Script Variant A in Salary-A/c onboarding; QA review of 3 agents within 48h.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7746"],
  },
  {
    alertId: "ALT-3304",
    alertTitle: "Borrower-distress dismissed during recovery (4 calls flagged)",
    obligationId: "OBL-008",
    themeId: "THM-02",
    severity: "CRITICAL",
    signalIds: ["SIG-018475", "SIG-018490", "SIG-018496"],
    affectedAgentIds: ["AG-2204", "AG-2212", "AG-1113"],
    affectedVendorIds: ["VEN-014", "VEN-001"],
    firstObservedTs: "2026-05-19T00:00:00+05:30",
    lastObservedTs: "2026-05-22T13:54:00+05:30",
    occurrenceCount: 6,
    routedToOwnerId: "OWN-CUST01",
    status: "OPEN",
    recommendedAction:
      "Route 6 borrowers to hardship-pathway desk; coach 3 agents on distress cue script.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7747"],
  },
  {
    alertId: "ALT-3305",
    alertTitle:
      "Language-mismatch routing failure — Tamil, Telugu, Marathi customers",
    obligationId: "OBL-029",
    themeId: "THM-08",
    severity: "MEDIUM",
    signalIds: ["SIG-018476", "SIG-018485", "SIG-018492"],
    affectedAgentIds: ["AG-4422", "AG-1108", "AG-1111"],
    affectedVendorIds: ["VEN-001"],
    firstObservedTs: "2026-05-21T00:00:00+05:30",
    lastObservedTs: "2026-05-23T10:22:00+05:30",
    occurrenceCount: 12,
    routedToOwnerId: "OWN-IO01",
    status: "IN_REVIEW",
    recommendedAction:
      "Re-validate IVR language detection threshold; review queue routing rules for TN/AP/MH circles.",
    boardPackInclusion: false,
    evidenceIds: ["EVD-7748"],
  },
  {
    alertId: "ALT-3306",
    alertTitle:
      "Bereavement empathy failure — 3 cases on general queue, not specialist desk",
    obligationId: "OBL-011",
    themeId: "THM-03",
    severity: "CRITICAL",
    signalIds: ["SIG-018477", "SIG-018484", "SIG-018488"],
    affectedAgentIds: ["AG-1103", "AG-1107", "AG-1110"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-22T00:00:00+05:30",
    lastObservedTs: "2026-05-23T20:15:00+05:30",
    occurrenceCount: 3,
    routedToOwnerId: "OWN-CUST01",
    status: "OPEN",
    recommendedAction:
      "Personal follow-up by Head of Customer; refresh bereavement script + queue tag in Genesys.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7749"],
  },
  {
    alertId: "ALT-3307",
    alertTitle:
      "Non-borrower contact policy breach — spouse / elderly parent dialled",
    obligationId: "OBL-005",
    themeId: "THM-02",
    severity: "HIGH",
    signalIds: ["SIG-018480", "SIG-018493"],
    affectedAgentIds: ["AG-2209", "AG-2213"],
    affectedVendorIds: ["VEN-002", "VEN-014"],
    firstObservedTs: "2026-05-19T00:00:00+05:30",
    lastObservedTs: "2026-05-20T15:35:00+05:30",
    occurrenceCount: 7,
    routedToOwnerId: "OWN-COLL01",
    status: "ESCALATED_TO_IO",
    recommendedAction:
      "IO referral pack created; dialler whitelist enforcement requested from Outbound Telephony.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7750"],
  },
  {
    alertId: "ALT-3308",
    alertTitle: "Banned phrase: penal interest used in collections script",
    obligationId: "OBL-019",
    themeId: "THM-07",
    severity: "MEDIUM",
    signalIds: ["SIG-018482"],
    affectedAgentIds: ["AG-2210"],
    affectedVendorIds: ["VEN-001"],
    firstObservedTs: "2026-05-22T00:00:00+05:30",
    lastObservedTs: "2026-05-22T10:05:00+05:30",
    occurrenceCount: 14,
    routedToOwnerId: "OWN-CCR01",
    status: "IN_REVIEW",
    recommendedAction:
      "Update Sutherland Chennai script set; remove 'penal interest' phrasing per RBI 2023 directive.",
    boardPackInclusion: false,
    evidenceIds: ["EVD-7751"],
  },
  {
    alertId: "ALT-3309",
    alertTitle: "Fraud victim on general queue — no vulnerable-routing tag",
    obligationId: "OBL-027",
    themeId: "THM-03",
    severity: "HIGH",
    signalIds: ["SIG-018488"],
    affectedAgentIds: ["AG-1110"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-23T00:00:00+05:30",
    lastObservedTs: "2026-05-23T20:15:00+05:30",
    occurrenceCount: 11,
    routedToOwnerId: "OWN-CUST01",
    status: "OPEN",
    recommendedAction:
      "Add fraud-victim signal to vulnerable-queue routing rule; agent coaching for 7-day refresh.",
    boardPackInclusion: false,
    evidenceIds: ["EVD-7752"],
  },
  {
    alertId: "ALT-3310",
    alertTitle:
      "Repeat-contact cluster: card-dispute customers calling 3x in 14 days",
    obligationId: "OBL-030",
    themeId: "THM-06",
    severity: "MEDIUM",
    signalIds: ["SIG-018473", "SIG-018494"],
    affectedAgentIds: ["AG-1102", "AG-1112"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-12T00:00:00+05:30",
    lastObservedTs: "2026-05-24T10:12:00+05:30",
    occurrenceCount: 482,
    routedToOwnerId: "OWN-CX01",
    status: "IN_REVIEW",
    recommendedAction:
      "Root-cause review on Card Dispute SLA; staffing on T-2 evidence-collection step.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7753"],
  },
  {
    alertId: "ALT-3311",
    alertTitle: "KFS read-out missed on PL telesales — pending CRM integration",
    obligationId: "OBL-014",
    themeId: "THM-07",
    severity: "MEDIUM",
    signalIds: [],
    affectedAgentIds: ["AG-3017", "AG-3018"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-15T00:00:00+05:30",
    lastObservedTs: "2026-05-23T18:00:00+05:30",
    occurrenceCount: 31,
    routedToOwnerId: "OWN-CCR01",
    status: "OPEN",
    recommendedAction:
      "Coverage limited until CRM event-trigger integration ships (target Sep 2026).",
    boardPackInclusion: false,
    evidenceIds: ["EVD-7754"],
  },
  {
    alertId: "ALT-3312",
    alertTitle: "First-90s adherence below 60% on chat-to-voice escalation",
    obligationId: "OBL-002",
    themeId: "THM-01",
    severity: "HIGH",
    signalIds: ["SIG-018491"],
    affectedAgentIds: ["AG-3019", "AG-1102"],
    affectedVendorIds: [],
    firstObservedTs: "2026-05-22T00:00:00+05:30",
    lastObservedTs: "2026-05-24T07:22:00+05:30",
    occurrenceCount: 188,
    routedToOwnerId: "OWN-CX01",
    status: "OPEN",
    recommendedAction:
      "Update warm-transfer macro to include SR-offer + acknowledgement template in first 90s.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7755"],
  },
  {
    alertId: "ALT-3313",
    alertTitle:
      "Vendor BPO Sutherland Chennai — conduct score dropped to 68 (-4 WoW)",
    obligationId: "OBL-024",
    themeId: "THM-05",
    severity: "HIGH",
    signalIds: ["SIG-018476", "SIG-018482"],
    affectedAgentIds: ["AG-4422", "AG-2210"],
    affectedVendorIds: ["VEN-001"],
    firstObservedTs: "2026-05-10T00:00:00+05:30",
    lastObservedTs: "2026-05-24T11:18:00+05:30",
    occurrenceCount: 197,
    routedToOwnerId: "OWN-OUTS01",
    status: "IN_REVIEW",
    recommendedAction:
      "Generate attestation pack for VEN-001; weekly review with Sutherland AVP.",
    boardPackInclusion: true,
    evidenceIds: ["EVD-7756"],
  },
  {
    alertId: "ALT-3315",
    alertTitle:
      "Bereavement empathy retraining cohort delivered (closure pack)",
    obligationId: "OBL-011",
    themeId: "THM-03",
    severity: "LOW",
    signalIds: ["SIG-018477"],
    affectedAgentIds: ["AG-1103"],
    affectedVendorIds: [],
    firstObservedTs: "2026-04-12T00:00:00+05:30",
    lastObservedTs: "2026-05-15T00:00:00+05:30",
    occurrenceCount: 12,
    routedToOwnerId: "OWN-CUST01",
    status: "ACTIONED",
    recommendedAction:
      "Retraining complete; 14-day measurement window in progress.",
    boardPackInclusion: false,
    evidenceIds: ["EVD-7757"],
  },
];

type EvidenceItem = {
  evidenceId: string;
  evidenceType:
    | "transcript_snippet"
    | "journey_reconstruction"
    | "cluster_proof"
    | "vendor_attestation"
    | "rca_cluster";
  obligationId: string;
  linkedAlertId: string | null;
  whyThisIsEvidence: string;
  attestationReady: boolean;
};

const EVIDENCE: readonly EvidenceItem[] = [
  {
    evidenceId: "EVD-7741",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-005",
    linkedAlertId: "ALT-3301",
    whyThisIsEvidence:
      "Direct threat language in recovery call — verbatim phrase + agent ID + timestamp.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7742",
    evidenceType: "cluster_proof",
    obligationId: "OBL-005",
    linkedAlertId: "ALT-3301",
    whyThisIsEvidence:
      "Pinnacle Recovery cluster: 9 calls / 4 agents / 4 days — pattern not isolated.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7743",
    evidenceType: "vendor_attestation",
    obligationId: "OBL-005",
    linkedAlertId: "ALT-3301",
    whyThisIsEvidence:
      "Vendor scorecard — Pinnacle (VEN-014) conduct 59, WORSE vs in-house benchmark 81.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7744",
    evidenceType: "journey_reconstruction",
    obligationId: "OBL-001",
    linkedAlertId: "ALT-3302",
    whyThisIsEvidence:
      "47 inbound flagged with explicit complaint markers; no SR record in CMS feed for any.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7745",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-002",
    linkedAlertId: "ALT-3302",
    whyThisIsEvidence:
      "First-90s window analysed — acknowledgement and SR-offer missing in 22/47 cases.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7746",
    evidenceType: "cluster_proof",
    obligationId: "OBL-018",
    linkedAlertId: "ALT-3303",
    whyThisIsEvidence:
      "28 calls + 4 chats use 'compulsory / mandatory' phrasing for optional ULIP attachment.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7747",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-008",
    linkedAlertId: "ALT-3304",
    whyThisIsEvidence:
      "Distress cue ignored — agent response did not acknowledge bereavement or hardship pathway.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7748",
    evidenceType: "journey_reconstruction",
    obligationId: "OBL-029",
    linkedAlertId: "ALT-3305",
    whyThisIsEvidence:
      "12 calls show language-mismatch wait > 6 min before re-routing to vernacular agent.",
    attestationReady: false,
  },
  {
    evidenceId: "EVD-7749",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-011",
    linkedAlertId: "ALT-3306",
    whyThisIsEvidence:
      "Bereaved customer routed bureaucratically; specialist-desk transfer not offered.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7750",
    evidenceType: "journey_reconstruction",
    obligationId: "OBL-005",
    linkedAlertId: "ALT-3307",
    whyThisIsEvidence:
      "Outbound dialler logs vs CRM contact-permission flags — 7 calls to non-borrowers.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7751",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-019",
    linkedAlertId: "ALT-3308",
    whyThisIsEvidence:
      "Penal-interest phrase still in active Sutherland script — 14 occurrences in 3 days.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7752",
    evidenceType: "cluster_proof",
    obligationId: "OBL-027",
    linkedAlertId: "ALT-3309",
    whyThisIsEvidence:
      "Fraud-victim markers in 11 cases routed to general queue — vulnerable tag never set.",
    attestationReady: false,
  },
  {
    evidenceId: "EVD-7753",
    evidenceType: "rca_cluster",
    obligationId: "OBL-030",
    linkedAlertId: "ALT-3310",
    whyThisIsEvidence:
      "Card dispute repeat-contact root cause: evidence-collection T-2 step not staffed.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7754",
    evidenceType: "transcript_snippet",
    obligationId: "OBL-014",
    linkedAlertId: "ALT-3311",
    whyThisIsEvidence:
      "KFS read-out absent in PL telesales — pending CRM event-trigger integration.",
    attestationReady: false,
  },
  {
    evidenceId: "EVD-7755",
    evidenceType: "cluster_proof",
    obligationId: "OBL-002",
    linkedAlertId: "ALT-3312",
    whyThisIsEvidence:
      "188 chat→voice transfers missed SR-offer + acknowledgement within first 90s.",
    attestationReady: true,
  },
  {
    evidenceId: "EVD-7756",
    evidenceType: "vendor_attestation",
    obligationId: "OBL-024",
    linkedAlertId: "ALT-3313",
    whyThisIsEvidence:
      "Sutherland Chennai monthly attestation pack — conduct 68 vs in-house benchmark 81.",
    attestationReady: true,
  },
];

type VendorBPOScore = {
  vendorId: string;
  vendorName: string;
  region: string;
  agents: number;
  conductScoreOverall: number;
  complaintRatePer10k: number;
  benchmarkVsInhouse: "BETTER" | "PARITY" | "WORSE" | "BASELINE";
  fluidCoveragePct: number;
  sampleCoveragePctLegacy: number;
  trend: readonly number[];
};

const VENDORS: readonly VendorBPOScore[] = [
  {
    vendorId: "VEN-001",
    vendorName: "Sutherland Chennai",
    region: "TN — Chennai",
    agents: 480,
    conductScoreOverall: 68,
    complaintRatePer10k: 14.2,
    benchmarkVsInhouse: "WORSE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 3,
    trend: [74, 72, 71, 70, 68],
  },
  {
    vendorId: "VEN-002",
    vendorName: "Krescent BPO Pune",
    region: "MH — Pune",
    agents: 220,
    conductScoreOverall: 71,
    complaintRatePer10k: 11.8,
    benchmarkVsInhouse: "WORSE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 4,
    trend: [73, 73, 72, 71, 71],
  },
  {
    vendorId: "VEN-014",
    vendorName: "Pinnacle Recovery (Hyderabad)",
    region: "TG — Hyderabad",
    agents: 95,
    conductScoreOverall: 59,
    complaintRatePer10k: 24.5,
    benchmarkVsInhouse: "WORSE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 2,
    trend: [68, 65, 63, 61, 59],
  },
  {
    vendorId: "VEN-INHOUSE",
    vendorName: "Suvarna In-house Benchmark",
    region: "PAN-IN",
    agents: 1100,
    conductScoreOverall: 81,
    complaintRatePer10k: 6.4,
    benchmarkVsInhouse: "BASELINE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 5,
    trend: [80, 81, 81, 82, 81],
  },
];

type RCACluster = {
  clusterId: string;
  clusterTheme: string;
  themeId: string;
  severityScore: number;
  volume: number;
  trendDirection: "RISING" | "STABLE" | "FALLING";
  boardPackInclusion: boolean;
  topDimension: string;
  remediation: string;
};

const _RCA_CLUSTERS: readonly RCACluster[] = [
  {
    clusterId: "RCA-2401",
    clusterTheme: "Recovery harassment — Pinnacle outbound dialler",
    themeId: "THM-02",
    severityScore: 92,
    volume: 287,
    trendDirection: "RISING",
    boardPackInclusion: true,
    topDimension: "Vendor: VEN-014 · Region: TG/AP",
    remediation:
      "Vendor halt + 2-week attestation refresh + dialler whitelist on borrower-only numbers.",
  },
  {
    clusterId: "RCA-2402",
    clusterTheme: "Missed complaints in card disputes",
    themeId: "THM-01",
    severityScore: 88,
    volume: 412,
    trendDirection: "RISING",
    boardPackInclusion: true,
    topDimension: "Product: Cards · Channel: Voice",
    remediation:
      "CMS auto-push from detected complaints; staffing on evidence-collection T-2 step.",
  },
  {
    clusterId: "RCA-2403",
    clusterTheme: "Bundling pressure — Salary-A/c + ULIP",
    themeId: "THM-04",
    severityScore: 74,
    volume: 264,
    trendDirection: "RISING",
    boardPackInclusion: true,
    topDimension: "Campaign: SALARY_2026Q1 · Channel: Voice + Chat",
    remediation:
      "Halt Script Variant A; QA cohort review; consent script refresh.",
  },
  {
    clusterId: "RCA-2404",
    clusterTheme: "Borrower-distress dismissal in recovery",
    themeId: "THM-02",
    severityScore: 81,
    volume: 138,
    trendDirection: "STABLE",
    boardPackInclusion: true,
    topDimension: "Vendor mix: VEN-014 + VEN-001 · Product: PL/HL",
    remediation:
      "Hardship-pathway route + 3-agent coaching; revise distress-cue checklist.",
  },
  {
    clusterId: "RCA-2405",
    clusterTheme: "Bereavement empathy gap (general queue)",
    themeId: "THM-03",
    severityScore: 77,
    volume: 23,
    trendDirection: "FALLING",
    boardPackInclusion: true,
    topDimension: "Channel: Voice · Segment: wealth + retail",
    remediation:
      "Specialist-desk routing tag + bereavement script refresh; closure pack live.",
  },
  {
    clusterId: "RCA-2406",
    clusterTheme: "Language-mismatch — TN / AP / MH circles",
    themeId: "THM-08",
    severityScore: 58,
    volume: 76,
    trendDirection: "STABLE",
    boardPackInclusion: false,
    topDimension: "Circles: TN + AP + MH · Channel: Voice",
    remediation: "IVR language detection threshold; queue routing rule update.",
  },
];

type RecoveryConductSignal = {
  id: string;
  agentId: string;
  vendorId: string | null;
  flags: {
    threat: boolean;
    profanity: boolean;
    harassment: boolean;
    shaming: boolean;
    nonBorrower: boolean;
  };
  customerId: string;
  productCode: "Cards" | "PL" | "HL";
  amount: number;
  language: string;
  timestamp: string;
};

const _RECOVERY_SIGNALS: readonly RecoveryConductSignal[] = [
  {
    id: "RCV-1",
    agentId: "AG-2204",
    vendorId: "VEN-014",
    flags: {
      threat: true,
      profanity: false,
      harassment: true,
      shaming: true,
      nonBorrower: false,
    },
    customerId: "CU-110234",
    productCode: "PL",
    amount: 250000,
    language: "hi",
    timestamp: "2026-05-24T11:18:00+05:30",
  },
  {
    id: "RCV-2",
    agentId: "AG-2207",
    vendorId: "VEN-014",
    flags: {
      threat: false,
      profanity: false,
      harassment: true,
      shaming: false,
      nonBorrower: false,
    },
    customerId: "CU-110441",
    productCode: "PL",
    amount: 175000,
    language: "kn",
    timestamp: "2026-05-21T16:30:00+05:30",
  },
  {
    id: "RCV-3",
    agentId: "AG-2208",
    vendorId: "VEN-014",
    flags: {
      threat: false,
      profanity: false,
      harassment: false,
      shaming: true,
      nonBorrower: false,
    },
    customerId: "CU-110118",
    productCode: "Cards",
    amount: 78000,
    language: "hi",
    timestamp: "2026-05-20T14:11:00+05:30",
  },
  {
    id: "RCV-4",
    agentId: "AG-2209",
    vendorId: "VEN-002",
    flags: {
      threat: false,
      profanity: false,
      harassment: false,
      shaming: false,
      nonBorrower: true,
    },
    customerId: "CU-110920",
    productCode: "PL",
    amount: 320000,
    language: "en",
    timestamp: "2026-05-19T11:48:00+05:30",
  },
  {
    id: "RCV-5",
    agentId: "AG-2210",
    vendorId: "VEN-001",
    flags: {
      threat: false,
      profanity: false,
      harassment: false,
      shaming: false,
      nonBorrower: false,
    },
    customerId: "CU-110774",
    productCode: "PL",
    amount: 92000,
    language: "hi",
    timestamp: "2026-05-22T10:05:00+05:30",
  },
  {
    id: "RCV-6",
    agentId: "AG-2211",
    vendorId: "VEN-002",
    flags: {
      threat: true,
      profanity: false,
      harassment: true,
      shaming: false,
      nonBorrower: false,
    },
    customerId: "CU-110551",
    productCode: "Cards",
    amount: 64000,
    language: "en",
    timestamp: "2026-05-21T12:40:00+05:30",
  },
  {
    id: "RCV-7",
    agentId: "AG-2213",
    vendorId: "VEN-014",
    flags: {
      threat: false,
      profanity: false,
      harassment: false,
      shaming: false,
      nonBorrower: true,
    },
    customerId: "CU-110312",
    productCode: "Cards",
    amount: 41000,
    language: "kn",
    timestamp: "2026-05-20T15:35:00+05:30",
  },
  {
    id: "RCV-8",
    agentId: "AG-2212",
    vendorId: "VEN-001",
    flags: {
      threat: false,
      profanity: false,
      harassment: false,
      shaming: false,
      nonBorrower: false,
    },
    customerId: "CU-110987",
    productCode: "PL",
    amount: 187000,
    language: "en",
    timestamp: "2026-05-22T14:25:00+05:30",
  },
  {
    id: "RCV-9",
    agentId: "AG-2204",
    vendorId: "VEN-014",
    flags: {
      threat: true,
      profanity: true,
      harassment: true,
      shaming: true,
      nonBorrower: false,
    },
    customerId: "CU-111090",
    productCode: "PL",
    amount: 222000,
    language: "hi",
    timestamp: "2026-05-18T17:08:00+05:30",
  },
  {
    id: "RCV-10",
    agentId: "AG-2207",
    vendorId: "VEN-014",
    flags: {
      threat: false,
      profanity: false,
      harassment: true,
      shaming: true,
      nonBorrower: true,
    },
    customerId: "CU-111104",
    productCode: "PL",
    amount: 145000,
    language: "kn",
    timestamp: "2026-05-19T13:22:00+05:30",
  },
];

type ComplaintCaptureSignal = {
  id: string;
  agentId: string;
  channel: "voice" | "chat" | "email";
  complaintPhrase: string;
  cmsSrCreatedFlag: "YES" | "NO";
  srId: string | null;
  gapHoursToSr: number | null;
  firstNinety: {
    acknowledged: boolean;
    srOffered: boolean;
    escalationRouteDisclosed: boolean;
    adherenceScore: number;
  };
  productCode: "Cards" | "PL" | "HL" | "SavAcct";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
};

const _COMPLAINT_SIGNALS: readonly ComplaintCaptureSignal[] = [
  {
    id: "CCS-1",
    agentId: "AG-1102",
    channel: "voice",
    complaintPhrase: "I have been calling for three weeks now",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: false,
      srOffered: false,
      escalationRouteDisclosed: false,
      adherenceScore: 22,
    },
    productCode: "Cards",
    severity: "HIGH",
  },
  {
    id: "CCS-2",
    agentId: "AG-1112",
    channel: "voice",
    complaintPhrase: "double-debit on my card statement",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: true,
      srOffered: false,
      escalationRouteDisclosed: false,
      adherenceScore: 41,
    },
    productCode: "Cards",
    severity: "HIGH",
  },
  {
    id: "CCS-3",
    agentId: "AG-1104",
    channel: "voice",
    complaintPhrase: "ECS bounce charge wapas chahiye",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: false,
      srOffered: false,
      escalationRouteDisclosed: false,
      adherenceScore: 18,
    },
    productCode: "SavAcct",
    severity: "HIGH",
  },
  {
    id: "CCS-4",
    agentId: "AG-1109",
    channel: "voice",
    complaintPhrase: "I am very disappointed, please escalate",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: true,
      srOffered: false,
      escalationRouteDisclosed: true,
      adherenceScore: 64,
    },
    productCode: "HL",
    severity: "MEDIUM",
  },
  {
    id: "CCS-5",
    agentId: "AG-3019",
    channel: "chat",
    complaintPhrase: "agent disconnected without creating SR",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: false,
      srOffered: false,
      escalationRouteDisclosed: false,
      adherenceScore: 12,
    },
    productCode: "Cards",
    severity: "MEDIUM",
  },
  {
    id: "CCS-6",
    agentId: "AG-1108",
    channel: "voice",
    complaintPhrase: "I want to file a formal complaint about NEFT failure",
    cmsSrCreatedFlag: "YES",
    srId: "SR-887211",
    gapHoursToSr: 0.4,
    firstNinety: {
      acknowledged: true,
      srOffered: true,
      escalationRouteDisclosed: true,
      adherenceScore: 92,
    },
    productCode: "SavAcct",
    severity: "LOW",
  },
  {
    id: "CCS-7",
    agentId: "AG-1110",
    channel: "voice",
    complaintPhrase: "fraud on my card, please block immediately",
    cmsSrCreatedFlag: "YES",
    srId: "SR-887340",
    gapHoursToSr: 0.1,
    firstNinety: {
      acknowledged: true,
      srOffered: true,
      escalationRouteDisclosed: true,
      adherenceScore: 96,
    },
    productCode: "Cards",
    severity: "LOW",
  },
  {
    id: "CCS-8",
    agentId: "AG-1102",
    channel: "voice",
    complaintPhrase: "no one is resolving my dispute since 22 days",
    cmsSrCreatedFlag: "NO",
    srId: null,
    gapHoursToSr: null,
    firstNinety: {
      acknowledged: false,
      srOffered: false,
      escalationRouteDisclosed: false,
      adherenceScore: 28,
    },
    productCode: "Cards",
    severity: "HIGH",
  },
  {
    id: "CCS-9",
    agentId: "AG-1111",
    channel: "voice",
    complaintPhrase: "telugu lo matladu, complain register cheyandi",
    cmsSrCreatedFlag: "YES",
    srId: "SR-887412",
    gapHoursToSr: 2.1,
    firstNinety: {
      acknowledged: true,
      srOffered: true,
      escalationRouteDisclosed: false,
      adherenceScore: 71,
    },
    productCode: "SavAcct",
    severity: "MEDIUM",
  },
  {
    id: "CCS-10",
    agentId: "AG-1113",
    channel: "voice",
    complaintPhrase: "I am being harassed by recovery boys",
    cmsSrCreatedFlag: "YES",
    srId: "SR-887488",
    gapHoursToSr: 1.8,
    firstNinety: {
      acknowledged: true,
      srOffered: true,
      escalationRouteDisclosed: true,
      adherenceScore: 88,
    },
    productCode: "PL",
    severity: "CRITICAL",
  },
];

type RepeatContactPattern = {
  id: string;
  customerSegment: string;
  issueCluster: string;
  contactsIn14Days: number;
  channelSwitches: number;
  escalationStage: "L0" | "L1-Supervisor" | "L2-Nodal" | "IO-Referral";
  productCode: "Cards" | "PL" | "HL" | "SavAcct";
};

const _REPEAT_PATTERNS: readonly RepeatContactPattern[] = [
  {
    id: "RPT-1",
    customerSegment: "retail",
    issueCluster: "Card dispute / chargeback",
    contactsIn14Days: 5,
    channelSwitches: 3,
    escalationStage: "L1-Supervisor",
    productCode: "Cards",
  },
  {
    id: "RPT-2",
    customerSegment: "retail",
    issueCluster: "EMI failure / debit reversal",
    contactsIn14Days: 4,
    channelSwitches: 2,
    escalationStage: "L1-Supervisor",
    productCode: "PL",
  },
  {
    id: "RPT-3",
    customerSegment: "wealth",
    issueCluster: "HL prepayment statement",
    contactsIn14Days: 3,
    channelSwitches: 2,
    escalationStage: "L2-Nodal",
    productCode: "HL",
  },
  {
    id: "RPT-4",
    customerSegment: "retail",
    issueCluster: "ECS bounce charge reversal",
    contactsIn14Days: 6,
    channelSwitches: 4,
    escalationStage: "IO-Referral",
    productCode: "SavAcct",
  },
  {
    id: "RPT-5",
    customerSegment: "MSE",
    issueCluster: "OD limit dispute",
    contactsIn14Days: 4,
    channelSwitches: 2,
    escalationStage: "L1-Supervisor",
    productCode: "PL",
  },
  {
    id: "RPT-6",
    customerSegment: "retail",
    issueCluster: "Mandate cancellation NEFT",
    contactsIn14Days: 3,
    channelSwitches: 1,
    escalationStage: "L0",
    productCode: "SavAcct",
  },
];

type InboundQueueSignal = {
  id: string;
  detectedFlag: "bereavement" | "fraud_victim" | "MSE" | "PwD";
  queueLandedOn: string;
  timeToVulnerableRoutingMin: number | null;
  routedCorrectly: boolean;
};

const _INBOUND_QUEUE_SIGNALS: readonly InboundQueueSignal[] = [
  {
    id: "IQS-1",
    detectedFlag: "bereavement",
    queueLandedOn: "General Voice IN",
    timeToVulnerableRoutingMin: null,
    routedCorrectly: false,
  },
  {
    id: "IQS-2",
    detectedFlag: "bereavement",
    queueLandedOn: "Specialist Desk",
    timeToVulnerableRoutingMin: 0,
    routedCorrectly: true,
  },
  {
    id: "IQS-3",
    detectedFlag: "fraud_victim",
    queueLandedOn: "General Voice IN",
    timeToVulnerableRoutingMin: 7.2,
    routedCorrectly: false,
  },
  {
    id: "IQS-4",
    detectedFlag: "MSE",
    queueLandedOn: "MSE Queue",
    timeToVulnerableRoutingMin: 0,
    routedCorrectly: true,
  },
  {
    id: "IQS-5",
    detectedFlag: "PwD",
    queueLandedOn: "General Chat IN",
    timeToVulnerableRoutingMin: null,
    routedCorrectly: false,
  },
];

type IntegrationDependency = {
  id: string;
  partnerSystem: string;
  obligationIds: readonly string[];
  status: "Connected" | "Partial" | "Not connected" | "Roadmap";
  notes: string;
};

const INTEGRATIONS: readonly IntegrationDependency[] = [
  {
    id: "INT-CMS",
    partnerSystem: "CMS — TCS BaNCS",
    obligationIds: ["OBL-001", "OBL-022"],
    status: "Partial",
    notes: "Read-only SR feed live; auto-push pending Q3 2026.",
  },
  {
    id: "INT-CRM",
    partnerSystem: "CRM — Salesforce",
    obligationIds: ["OBL-014", "OBL-018"],
    status: "Roadmap",
    notes: "Suitability / KFS event triggers planned Sep 2026.",
  },
  {
    id: "INT-CORE",
    partnerSystem: "Core Banking — Finacle",
    obligationIds: ["OBL-001"],
    status: "Connected",
    notes: "Read-only account context for SR drill-down.",
  },
  {
    id: "INT-DIALER",
    partnerSystem: "Outbound Dialler — Genesys",
    obligationIds: ["OBL-005", "OBL-024", "OBL-029"],
    status: "Connected",
    notes: "Recording + queue tag stream live for all in-house + vendor calls.",
  },
  {
    id: "INT-QM",
    partnerSystem: "Quality Mgmt — NICE",
    obligationIds: ["OBL-002", "OBL-024"],
    status: "Connected",
    notes: "Two-way sync — QM sample tags + Fluid signal score.",
  },
  {
    id: "INT-FRAUD",
    partnerSystem: "Fraud Engine — Partner-fed",
    obligationIds: ["OBL-027"],
    status: "Not connected",
    notes: "Auth metadata pending — null in mock.",
  },
  {
    id: "INT-IO",
    partnerSystem: "Internal Ombudsman System",
    obligationIds: ["OBL-001", "OBL-008", "OBL-027"],
    status: "Partial",
    notes: "Referral pack export live; decisioning is human judgement.",
  },
  {
    id: "INT-MIS",
    partnerSystem: "MIS / Data Warehouse",
    obligationIds: ["OBL-030"],
    status: "Connected",
    notes: "Daily aggregates for repeat-contact / FCR.",
  },
  {
    id: "INT-IVR",
    partnerSystem: "IVR — Voicebot",
    obligationIds: ["OBL-029"],
    status: "Roadmap",
    notes: "DTMF + voicebot ingestion deferred to v2.",
  },
];

type CapabilityBoundary = {
  id: string;
  partnerSystemNamed: string;
  obligationId: string;
  reason: string;
  displayType:
    | "DO_NOT_BUILD_BANNER"
    | "EVIDENCE_ONLY_CARD"
    | "HONEST_GAP_SHELF";
};

const BOUNDARIES: readonly CapabilityBoundary[] = [
  {
    id: "BND-1",
    partnerSystemNamed: "TCS BaNCS CMS workflow engine",
    obligationId: "OBL-022",
    reason:
      "CMS auto-escalation is a workflow concern; Fluid feeds detected signals, not workflow.",
    displayType: "DO_NOT_BUILD_BANNER",
  },
  {
    id: "BND-2",
    partnerSystemNamed: "Internal Ombudsman judgement",
    obligationId: "OBL-001",
    reason:
      "IO independent review is a human-judgement decisioning surface — Fluid supports evidence only.",
    displayType: "HONEST_GAP_SHELF",
  },
  {
    id: "BND-3",
    partnerSystemNamed: "Core-banking transaction alert engine",
    obligationId: "OBL-001",
    reason:
      "Real-time tx alerts are core-banking infrastructure; Fluid reads alerts as context.",
    displayType: "DO_NOT_BUILD_BANNER",
  },
  {
    id: "BND-4",
    partnerSystemNamed: "Refund timeline (Finance Ops)",
    obligationId: "OBL-001",
    reason:
      "10-day shadow-credit workflow is finance ops, not conduct intelligence.",
    displayType: "EVIDENCE_ONLY_CARD",
  },
  {
    id: "BND-5",
    partnerSystemNamed: "Dark-pattern UI audit (Design / Digital)",
    obligationId: "OBL-032",
    reason:
      "UI dark-pattern audit is a journey analytics / product design responsibility.",
    displayType: "DO_NOT_BUILD_BANNER",
  },
  {
    id: "BND-6",
    partnerSystemNamed: "DPDP / Vendor master (HR & Compliance)",
    obligationId: "OBL-024",
    reason:
      "Data governance for recovery agent feeds is DPDP / vendor management territory.",
    displayType: "EVIDENCE_ONLY_CARD",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  REGULATORY-HORIZON MILESTONES (S0 sticky band + S11 timeline)
// ─────────────────────────────────────────────────────────────────────────────

type HorizonMilestone = {
  isoDate: string;
  label: string;
  linkedObligationIds: readonly string[];
};

const _HORIZON: readonly HorizonMilestone[] = [
  {
    isoDate: "2026-03-31",
    label: "Deceased-customer empathy",
    linkedObligationIds: ["OBL-011"],
  },
  {
    isoDate: "2026-04-01",
    label: "RBC Directions in force",
    linkedObligationIds: ["OBL-014", "OBL-018", "OBL-019"],
  },
  {
    isoDate: "2026-04-10",
    label: "IT/Recovery Outsourcing",
    linkedObligationIds: ["OBL-024"],
  },
  {
    isoDate: "2026-06-30",
    label: "IO Directions · CMS auto-escalation",
    linkedObligationIds: [
      "OBL-001",
      "OBL-002",
      "OBL-027",
      "OBL-029",
      "OBL-030",
    ],
  },
  {
    isoDate: "2026-07-01",
    label: "RB-IOS cutover · Draft Recovery",
    linkedObligationIds: ["OBL-005", "OBL-008"],
  },
  {
    isoDate: "2026-10-01",
    label: "Cross-border CNP auth",
    linkedObligationIds: [],
  },
  {
    isoDate: "2027-05-13",
    label: "DPDP substantive obligations",
    linkedObligationIds: ["OBL-032"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  LOOKUPS
// ─────────────────────────────────────────────────────────────────────────────

const OBLIGATIONS_BY_ID: Record<string, Obligation> = OBLIGATIONS.reduce(
  (m, o) => {
    m[o.oblId] = o;
    return m;
  },
  {} as Record<string, Obligation>,
);

const THEMES_BY_ID: Record<string, ConductTheme> = THEMES.reduce(
  (m, t) => {
    m[t.themeId] = t;
    return m;
  },
  {} as Record<string, ConductTheme>,
);

const REGULATIONS_BY_ID: Record<string, Regulation> = REGULATIONS.reduce(
  (m, r) => {
    m[r.regulationId] = r;
    return m;
  },
  {} as Record<string, Regulation>,
);

const OWNERS_BY_ID: Record<string, ControlOwner> = CONTROL_OWNERS.reduce(
  (m, o) => {
    m[o.ownerId] = o;
    return m;
  },
  {} as Record<string, ControlOwner>,
);

const SIGNALS_BY_ID: Record<string, InteractionSignal> = SIGNALS.reduce(
  (m, s) => {
    m[s.signalId] = s;
    return m;
  },
  {} as Record<string, InteractionSignal>,
);

const EVIDENCE_BY_ID: Record<string, EvidenceItem> = EVIDENCE.reduce(
  (m, e) => {
    m[e.evidenceId] = e;
    return m;
  },
  {} as Record<string, EvidenceItem>,
);

const ALERTS_BY_ID: Record<string, RiskAlert> = RISK_ALERTS.reduce(
  (m, a) => {
    m[a.alertId] = a;
    return m;
  },
  {} as Record<string, RiskAlert>,
);

// ─────────────────────────────────────────────────────────────────────────────
//  STYLE HELPERS — match the Openbank dashboard vocabulary
// ─────────────────────────────────────────────────────────────────────────────

const LABEL_CAPS =
  "text-[10px] font-black uppercase tracking-wide text-zinc-500";

const NEST = "rounded-xl border border-white/10 bg-black/25 p-2.5";

function _severitySurface(severity: string): {
  className: string;
  style: CSSProperties;
} {
  const c = colorFor(severity);
  return {
    className: "rounded-2xl border p-3.5",
    style: { borderColor: `${c}55`, background: `${c}0c` },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ShellCard({
  title,
  subtitle,
  accent = COLORS.teal,
  className = "",
  bodyClassName = "",
  actions,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: string;
  className?: string;
  bodyClassName?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={cx(
        "relative flex flex-col overflow-hidden rounded-3xl border bg-[#0d0d0d] shadow-[0_18px_64px_-32px_rgba(0,0,0,0.85)]",
        className,
      )}
      style={{ borderColor: COLORS.border }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${accent}66 60%, transparent)`,
        }}
        aria-hidden
      />
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black leading-tight text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-[12px] font-semibold leading-relaxed text-zinc-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div
        className={cx(
          "flex min-h-0 flex-1 flex-col gap-3 px-5 pt-1 pb-5",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

function Pill({
  severity,
  children,
  className = "",
}: {
  severity: string;
  children: ReactNode;
  className?: string;
}) {
  const c = colorFor(severity);
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        className,
      )}
      style={{ borderColor: `${c}55`, background: `${c}14`, color: c }}
    >
      {children}
    </span>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}) {
  const label = severity.charAt(0) + severity.slice(1).toLowerCase();
  return <Pill severity={severity}>{label}</Pill>;
}

function ObligationStatusBadge({
  status,
}: {
  status: "IN_FORCE" | "DRAFT_PROPOSED";
}) {
  if (status === "IN_FORCE") {
    return (
      <span className="inline-flex items-center rounded-full border border-blue-500/60 bg-blue-900/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-blue-300">
        In Force
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border-2 border-dashed border-amber-500/70 bg-amber-900/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-400">
      Draft · Proposed
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: "OPEN" | "IN_REVIEW" | "ACTIONED" | "CLOSED" | "ESCALATED_TO_IO";
}) {
  const labelMap: Record<typeof status, string> = {
    OPEN: "Open",
    IN_REVIEW: "In Review",
    ACTIONED: "Actioned",
    CLOSED: "Closed",
    ESCALATED_TO_IO: "Escalated · IO",
  };
  return <Pill severity={status}>{labelMap[status]}</Pill>;
}

function ComplianceLabelBadge({ buildTier }: { buildTier: BuildTier }) {
  const meta = BUILD_TIER_MAP[buildTier];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
        meta.outlined ? "border" : "border",
      )}
      style={
        meta.outlined
          ? {
              borderColor: meta.color,
              color: meta.color,
              background: "transparent",
            }
          : buildTier === "OUT_OF_SCOPE"
            ? {
                background: "#2a2a2a",
                color: meta.color,
                borderColor: COLORS.border2,
              }
            : {
                background: meta.color,
                color: "#0a0a0a",
                borderColor: meta.color,
              }
      }
    >
      {buildTier === "OUT_OF_SCOPE" ? (
        <Lock className="size-3" aria-hidden />
      ) : null}
      {meta.label}
    </span>
  );
}

function DeadlinePill({ date, label }: { date: string; label: string }) {
  const days = daysUntil(date);
  let color: string = COLORS.blue;
  let body = `${days} days`;
  if (days < 0) {
    color = COLORS.red;
    body = "In Force";
  } else if (days <= 60) {
    color = COLORS.red;
  } else if (days <= 180) {
    color = COLORS.amber;
  }
  const formatted = new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide"
      style={{ borderColor: `${color}80`, color, background: `${color}10` }}
    >
      <span className="text-white/85">{label}</span>
      <span className="text-zinc-500">·</span>
      <span>{formatted}</span>
      <span className="text-zinc-500">·</span>
      <span>{body}</span>
    </span>
  );
}

function OwnerChip({ owner }: { owner: ControlOwner }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold text-zinc-200">
      {owner.roleTitle}
      <sub className="ml-0.5 text-[9px] font-black tracking-wide text-zinc-500">
        {owner.lineOfDefence}
      </sub>
    </span>
  );
}

function KPICard({
  label,
  value,
  delta,
  severity = "neutral",
  icon: Icon,
  onClick,
  hint,
}: {
  label: string;
  value: string | number;
  delta?: string;
  severity?: "red" | "amber" | "green" | "neutral" | "teal";
  icon?: LucideIcon;
  onClick?: () => void;
  hint?: string;
}) {
  const map = {
    red: COLORS.red,
    amber: COLORS.amber,
    green: COLORS.green,
    teal: COLORS.teal,
    neutral: COLORS.blue,
  };
  const c = map[severity];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative w-full overflow-hidden rounded-2xl border bg-[#0d0d0d] p-4 text-left transition",
        onClick
          ? "hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-teal-500"
          : "cursor-default",
      )}
      style={{ borderColor: COLORS.border, borderLeft: `4px solid ${c}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tabular-nums leading-none text-white">
            {value}
          </p>
          {delta ? (
            <p className="mt-1.5 text-[11px] font-semibold text-zinc-400">
              {delta}
            </p>
          ) : null}
          {hint ? (
            <p className="mt-2 text-[11px] leading-snug text-zinc-500">
              {hint}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
            style={{ background: `${c}18`, color: c }}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
    </button>
  );
}

function SpineStrip({
  regulation,
  obligation,
  signalSummary,
  owner,
  evidenceSummary,
  recommendedAction,
}: {
  regulation: string;
  obligation: string;
  signalSummary: string;
  owner: string;
  evidenceSummary: string;
  recommendedAction: string;
}) {
  const nodes = [
    { label: "Regulation", value: regulation },
    { label: "Obligation", value: obligation },
    { label: "Signal", value: signalSummary },
    { label: "Owner", value: owner },
    { label: "Evidence", value: evidenceSummary },
    { label: "Action", value: recommendedAction },
  ];
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
      {nodes.map((node, idx) => (
        <div key={node.label} className={cx(NEST, "relative overflow-hidden")}>
          {idx < nodes.length - 1 ? (
            <ChevronRight
              className="absolute right-1 top-3 hidden size-3.5 text-zinc-700 md:block"
              aria-hidden
            />
          ) : null}
          <p className={LABEL_CAPS}>{node.label}</p>
          <p className="mt-1 line-clamp-3 text-[11px] font-semibold leading-snug text-zinc-200">
            {node.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function BoundaryNote({
  reason,
  partnerSystem,
  displayType,
}: {
  reason: string;
  partnerSystem: string;
  displayType:
    | "DO_NOT_BUILD_BANNER"
    | "EVIDENCE_ONLY_CARD"
    | "HONEST_GAP_SHELF";
}) {
  const map = {
    DO_NOT_BUILD_BANNER: {
      color: COLORS.red,
      label: "Outside Fluid CX scope",
      icon: Lock,
    },
    EVIDENCE_ONLY_CARD: {
      color: COLORS.muted,
      label: "Evidence support only",
      icon: Info,
    },
    HONEST_GAP_SHELF: {
      color: COLORS.amber,
      label: "Acknowledged gap",
      icon: Flag,
    },
  } as const;
  const meta = map[displayType];
  const Icon = meta.icon;
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border p-3.5"
      style={{ borderColor: `${meta.color}66`, background: `${meta.color}0c` }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
        style={{ background: `${meta.color}18`, color: meta.color }}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p
          className="text-[10px] font-black uppercase tracking-[0.14em]"
          style={{ color: meta.color }}
        >
          {meta.label}
        </p>
        <p className="mt-1 text-sm font-bold text-white">{partnerSystem}</p>
        <p className="mt-1 text-[12px] font-semibold leading-snug text-zinc-300">
          {reason}
        </p>
      </div>
    </div>
  );
}

function _AIInsightCard({
  headline,
  detail,
  taxonomy,
  onAction,
  actionLabel,
}: {
  headline: string;
  detail: string;
  taxonomy: readonly string[];
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.07] p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-indigo-300" aria-hidden />
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-200">
          AI conduct insight
        </span>
      </div>
      <p className="mt-2 text-sm font-black leading-snug text-white">
        {headline}
      </p>
      <p className="mt-1 text-[12px] font-semibold leading-relaxed text-zinc-300">
        {detail}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {taxonomy.map((t) => (
          <span
            key={t}
            className="rounded-full border border-indigo-300/30 bg-indigo-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-indigo-200"
          >
            {t}
          </span>
        ))}
      </div>
      {onAction && actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-300/40 bg-indigo-400/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-indigo-100 hover:bg-indigo-400/25"
        >
          {actionLabel}
          <ChevronRight className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function TranscriptSnippet({ signal }: { signal: InteractionSignal }) {
  const [expanded, setExpanded] = useState(false);
  const snippet = signal.transcriptSnippet;
  const truncated =
    snippet.length > 120 && !expanded ? `${snippet.slice(0, 120)}…` : snippet;
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide text-zinc-300">
          [{signal.language}]
        </span>
        <Pill severity={signal.severity}>
          {SIGNAL_TYPE_LABELS[signal.signalType]}
        </Pill>
        <span className="text-[10px] font-bold text-zinc-500">
          {signal.channel} · {signal.direction.toLowerCase()} · {signal.agentId}
          {signal.vendorId ? ` · ${signal.vendorId}` : " · in-house"}
        </span>
      </div>
      <p className="mt-2 font-mono text-[12px] leading-relaxed text-zinc-200">
        "{truncated}"
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-zinc-500">
        <span>
          {new Date(signal.timestamp).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <div className="flex items-center gap-2">
          {snippet.length > 120 ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 font-black uppercase tracking-wide text-zinc-300 hover:text-white"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          ) : null}
          <button
            type="button"
            disabled
            title="Recording playback available in Fluid CX integrated mode"
            className="cursor-not-allowed rounded-md border border-teal-500/40 bg-teal-500/15 px-2 py-0.5 font-black uppercase tracking-wide text-teal-200 opacity-50"
          >
            Play clip
          </button>
        </div>
      </div>
    </div>
  );
}

function _RCAClusterCard({
  cluster,
  onClick,
}: {
  cluster: RCACluster;
  onClick?: () => void;
}) {
  const TrendIcon =
    cluster.trendDirection === "RISING"
      ? TrendingUp
      : cluster.trendDirection === "FALLING"
        ? TrendingDown
        : Minus;
  const trendColor =
    cluster.trendDirection === "RISING"
      ? COLORS.red
      : cluster.trendDirection === "FALLING"
        ? COLORS.green
        : COLORS.dim;
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-left transition hover:border-white/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={LABEL_CAPS}>
            {THEMES_BY_ID[cluster.themeId]?.themeName ?? "Theme"}
          </p>
          <p className="mt-1 text-sm font-black leading-snug text-white">
            {cluster.clusterTheme}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
          style={{ background: `${trendColor}18`, color: trendColor }}
        >
          <TrendIcon className="size-3" aria-hidden />
          {cluster.trendDirection.toLowerCase()}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full"
          style={{
            width: `${cluster.severityScore}%`,
            background:
              cluster.severityScore > 80
                ? COLORS.red
                : cluster.severityScore > 65
                  ? COLORS.amber
                  : COLORS.teal,
          }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-zinc-400">
        <span>
          Severity{" "}
          <span className="font-black tabular-nums text-white">
            {cluster.severityScore}
          </span>
        </span>
        <span>
          Volume{" "}
          <span className="font-black tabular-nums text-white">
            {fmt(cluster.volume)}
          </span>
        </span>
        {cluster.boardPackInclusion ? (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-black uppercase tracking-wide text-amber-200">
            In board pack
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] font-semibold leading-snug text-zinc-400">
        <span className="font-black text-zinc-500">Top dimension: </span>
        {cluster.topDimension}
      </p>
    </button>
  );
}

function VendorScorecard({ vendor }: { vendor: VendorBPOScore }) {
  const bm = vendor.benchmarkVsInhouse;
  const bmColor =
    bm === "BETTER"
      ? COLORS.green
      : bm === "PARITY"
        ? COLORS.amber
        : bm === "BASELINE"
          ? COLORS.teal
          : COLORS.red;
  const bmLabel =
    bm === "BASELINE" ? "Baseline" : `${bm.toLowerCase()} vs in-house`;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{vendor.vendorName}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-zinc-500">
            {vendor.vendorId} · {vendor.region} · {fmt(vendor.agents)} agents
          </p>
        </div>
        <span
          className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
          style={{
            borderColor: `${bmColor}66`,
            color: bmColor,
            background: `${bmColor}14`,
          }}
        >
          {bmLabel}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className={LABEL_CAPS}>Conduct score</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white">
            {vendor.conductScoreOverall}
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${vendor.conductScoreOverall}%`,
                background:
                  vendor.conductScoreOverall < 65
                    ? COLORS.red
                    : vendor.conductScoreOverall < 75
                      ? COLORS.amber
                      : COLORS.teal,
              }}
            />
          </div>
        </div>
        <div>
          <p className={LABEL_CAPS}>Complaints / 10k</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white">
            {vendor.complaintRatePer10k.toFixed(1)}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            Coverage{" "}
            <span className="text-white">{vendor.fluidCoveragePct}%</span> vs
            sample{" "}
            <span className="text-white">
              {vendor.sampleCoveragePctLegacy}%
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={vendor.trend.map((v, i) => ({ w: i + 1, v }))}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={bmColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EmptyState({
  message,
  icon: Icon = Info,
}: {
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
      <Icon className="size-5 text-zinc-500" aria-hidden />
      <p className="text-[12px] font-semibold text-zinc-400">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  EVIDENCE DRAWER
// ─────────────────────────────────────────────────────────────────────────────

function EvidenceDrawer() {
  const persona = usePersona();
  const alertId = persona.drawerAlertId;
  const alert = alertId ? ALERTS_BY_ID[alertId] : null;
  const [ioEscalated, setIoEscalated] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: alertId is the intentional trigger; we want to reset the IO-escalation state whenever a different alert is opened.
  useEffect(() => {
    setIoEscalated(false);
  }, [alertId]);

  useEffect(() => {
    if (!alert) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") persona.closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [alert, persona]);

  if (!alert) return null;

  const obligation = OBLIGATIONS_BY_ID[alert.obligationId];
  const regulation = obligation
    ? REGULATIONS_BY_ID[obligation.parentRegulationId]
    : null;
  const owner = OWNERS_BY_ID[alert.routedToOwnerId];
  const linkedSignals = list(alert.signalIds)
    .map((id) => SIGNALS_BY_ID[id])
    .filter(Boolean);
  const linkedEvidence = list(alert.evidenceIds)
    .map((id) => EVIDENCE_BY_ID[id])
    .filter(Boolean);
  const boundary = BOUNDARIES.find(
    (b) => b.obligationId === alert.obligationId,
  );
  const integration = INTEGRATIONS.find((i) =>
    i.obligationIds.includes(alert.obligationId),
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={persona.closeDrawer}
        className="flex-1 bg-black/55 backdrop-blur-sm"
      />
      <aside
        className="relative h-full w-full max-w-[520px] overflow-y-auto border-l bg-[#070707] shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        style={{ borderColor: COLORS.border }}
        role="dialog"
        aria-modal="true"
        aria-label="Evidence drawer"
      >
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#070707]/95 px-5 py-4 backdrop-blur"
          style={{ borderColor: COLORS.border }}
        >
          <div className="min-w-0">
            <p className={LABEL_CAPS}>Risk alert</p>
            <p className="mt-0.5 truncate text-sm font-black text-white">
              {alert.alertTitle}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <SeverityBadge severity={alert.severity} />
              <StatusBadge status={alert.status} />
              {alert.boardPackInclusion ? (
                <Pill severity="HIGH">Board pack</Pill>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={persona.closeDrawer}
            className="ml-3 grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="space-y-5 px-5 py-5">
          {obligation && regulation && owner ? (
            <SpineStrip
              regulation={regulation.shortName}
              obligation={`${obligation.oblId} · ${obligation.statement.slice(0, 72)}…`}
              signalSummary={`${linkedSignals.length} signals · ${linkedSignals[0] ? SIGNAL_TYPE_LABELS[linkedSignals[0].signalType] : "—"}`}
              owner={`${owner.roleTitle} (${owner.lineOfDefence})`}
              evidenceSummary={`${linkedEvidence.length} items · ${linkedEvidence.filter((e) => e.attestationReady).length} audit-ready`}
              recommendedAction={alert.recommendedAction}
            />
          ) : null}

          {boundary ? (
            <BoundaryNote
              partnerSystem={boundary.partnerSystemNamed}
              reason={boundary.reason}
              displayType={boundary.displayType}
            />
          ) : null}

          {integration &&
          obligation &&
          obligation.buildTier === "INTEGRATION_DEPENDENT" ? (
            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-3.5">
              <div className="flex items-center gap-2">
                <Plug className="size-3.5 text-teal-300" aria-hidden />
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-200">
                  Monitored with system integration
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">
                {integration.partnerSystem}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-zinc-300">
                {integration.notes}
              </p>
            </div>
          ) : null}

          <section className="space-y-3">
            <p className={LABEL_CAPS}>
              Linked signals · {linkedSignals.length}
            </p>
            {linkedSignals.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                message="No individual signals — cluster-proof evidence attached."
              />
            ) : (
              <div className="space-y-2">
                {linkedSignals.slice(0, 4).map((s) => (
                  <TranscriptSnippet key={s.signalId} signal={s} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <p className={LABEL_CAPS}>
              Evidence pack · {linkedEvidence.length} items
            </p>
            {linkedEvidence.length === 0 ? (
              <EmptyState message="Evidence assembled by RCA cluster — no atomic items." />
            ) : (
              <div className="space-y-2">
                {linkedEvidence.map((e) => (
                  <div
                    key={e.evidenceId}
                    className="rounded-xl border border-white/10 bg-black/35 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-zinc-300">
                        {e.evidenceType.replace(/_/g, " ")}
                      </span>
                      {e.attestationReady ? (
                        <Pill severity="ACTIONED">Audit-ready</Pill>
                      ) : (
                        <Pill severity="MEDIUM">Pending</Pill>
                      )}
                    </div>
                    <p className="mt-2 text-[12px] font-semibold leading-snug text-zinc-200">
                      {e.whyThisIsEvidence}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/15 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-teal-200 hover:bg-teal-500/25"
            >
              <Download className="size-3.5" aria-hidden /> Download evidence
              pack
            </button>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className={LABEL_CAPS}>Recommended action</p>
            <p className="mt-1.5 text-sm font-bold leading-snug text-white">
              {alert.recommendedAction}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-teal-500/50 bg-teal-500/20 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-teal-100 hover:bg-teal-500/30"
              >
                Mark actioned
              </button>
              <button
                type="button"
                onClick={() => setIoEscalated(true)}
                className="rounded-lg border border-purple-400/40 bg-purple-400/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-purple-100 hover:bg-purple-400/25"
              >
                Escalate to IO
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-zinc-200 hover:bg-white/[0.12]"
              >
                Add note
              </button>
            </div>
            {ioEscalated ? (
              <div className="mt-3">
                <BoundaryNote
                  partnerSystem="Internal Ombudsman — IO referral package created"
                  reason="Fluid has assembled the evidence package. IO independent review and judgment (OBL-021) is a human function — Fluid provides interaction history and evidence, not the decision."
                  displayType="HONEST_GAP_SHELF"
                />
              </div>
            ) : null}
          </section>
        </div>
      </aside>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
//  RBI CONDUCT INTELLIGENCE v2 — 2-SCREEN ARCHITECTURE
//  Screen 1: Obligation Coverage Command Center
//  Screen 2: Outbound Conduct & Location Intelligence
//  Everything else is a widget, drawer, filter, or drill-down.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
//  ADDITIONAL MOCK DATA  ·  Conduct Areas · Channels · Locations · Outbound
// ─────────────────────────────────────────────────────────────────────────────

type ConductAreaKey =
  | "complaint_grievance"
  | "recovery_conduct"
  | "sales_cross_sell"
  | "disclosure_lending"
  | "vulnerable_customer"
  | "fraud_dispute"
  | "vendor_outsourcing"
  | "language_routing";

const CONDUCT_AREAS: ReadonlyArray<{
  key: ConductAreaKey;
  name: string;
  short: string;
  color: string;
  icon: LucideIcon;
  blurb: string;
}> = [
  {
    key: "complaint_grievance",
    name: "Complaint & Grievance",
    short: "Complaint",
    color: COLORS.red,
    icon: MessagesSquare,
    blurb:
      "RB-IOS 2021 · IO Directions 2023 · Master Direction grievance redress",
  },
  {
    key: "recovery_conduct",
    name: "Recovery Conduct",
    short: "Recovery",
    color: COLORS.amber,
    icon: Phone,
    blurb: "Fair Practice Code · Recovery Agent Directions",
  },
  {
    key: "sales_cross_sell",
    name: "Sales & Cross-Sell",
    short: "Sales",
    color: COLORS.purple,
    icon: Megaphone,
    blurb: "RBC Directions 2025 · suitability · bundling consent",
  },
  {
    key: "disclosure_lending",
    name: "Disclosure & Lending",
    short: "Disclosure",
    color: COLORS.blue,
    icon: FileText,
    blurb: "KFS · cooling-off · pre-payment charges · penal-charge phrasing",
  },
  {
    key: "vulnerable_customer",
    name: "Vulnerable Customer",
    short: "Vulnerable",
    color: COLORS.cyan,
    icon: Heart,
    blurb: "Bereavement · borrower distress · senior citizen · PwD · MSE",
  },
  {
    key: "fraud_dispute",
    name: "Fraud & Dispute",
    short: "Fraud",
    color: COLORS.indigo,
    icon: ShieldAlert,
    blurb: "Limited-liability circular · chargeback turnaround",
  },
  {
    key: "vendor_outsourcing",
    name: "Vendor / Outsourcing",
    short: "Vendor",
    color: COLORS.teal,
    icon: Briefcase,
    blurb: "Outsourcing Directions REG-004",
  },
  {
    key: "language_routing",
    name: "Language / Routing",
    short: "Language",
    color: COLORS.saffron,
    icon: Languages,
    blurb: "Regional language access (Hi · Ta · Te · Kn · Mr)",
  },
];

const CONDUCT_AREA_MAP: Record<ConductAreaKey, (typeof CONDUCT_AREAS)[number]> =
  CONDUCT_AREAS.reduce(
    (acc, area) => {
      acc[area.key] = area;
      return acc;
    },
    {} as Record<ConductAreaKey, (typeof CONDUCT_AREAS)[number]>,
  );

const THEME_TO_AREA: Record<string, ConductAreaKey> = {
  "THM-01": "complaint_grievance",
  "THM-02": "recovery_conduct",
  "THM-03": "vulnerable_customer",
  "THM-04": "sales_cross_sell",
  "THM-05": "vendor_outsourcing",
  "THM-06": "complaint_grievance",
  "THM-07": "disclosure_lending",
  "THM-08": "language_routing",
};

function getConductArea(obl: Obligation): ConductAreaKey {
  const text = obl.statement.toLowerCase();
  if (
    text.includes("fraud") ||
    text.includes("chargeback") ||
    text.includes("limited liability")
  ) {
    return "fraud_dispute";
  }
  if (
    text.includes("vendor") ||
    text.includes("outsourc") ||
    text.includes("recovery agent governance")
  ) {
    return "vendor_outsourcing";
  }
  if (
    text.includes("regional language") ||
    text.includes("vernacular") ||
    text.includes("language mismatch")
  ) {
    return "language_routing";
  }
  return THEME_TO_AREA[obl.themeId] ?? "complaint_grievance";
}

const OBLIGATIONS_BY_AREA: Record<ConductAreaKey, Obligation[]> = (() => {
  const m = {} as Record<ConductAreaKey, Obligation[]>;
  for (const a of CONDUCT_AREAS) m[a.key] = [];
  for (const o of OBLIGATIONS) m[getConductArea(o)].push(o);
  return m;
})();

// ─── Channels ─────────────────────────────────────────────────────────────────

type ChannelKey =
  | "inbound_voice"
  | "outbound_voice"
  | "chat"
  | "email"
  | "tickets"
  | "social";

const CHANNELS: ReadonlyArray<{
  key: ChannelKey;
  label: string;
  short: string;
  icon: LucideIcon;
}> = [
  {
    key: "inbound_voice",
    label: "Inbound Voice",
    short: "Inbound",
    icon: Phone,
  },
  {
    key: "outbound_voice",
    label: "Outbound Voice",
    short: "Outbound",
    icon: Phone,
  },
  { key: "chat", label: "Chat", short: "Chat", icon: MessagesSquare },
  { key: "email", label: "Email", short: "Email", icon: FileText },
  { key: "tickets", label: "Tickets", short: "Tickets", icon: ListChecks },
  { key: "social", label: "Social", short: "Social", icon: Globe },
];

const CHANNEL_APPLICABILITY: Record<
  ConductAreaKey,
  ReadonlyArray<ChannelKey>
> = {
  complaint_grievance: [
    "inbound_voice",
    "outbound_voice",
    "chat",
    "email",
    "tickets",
    "social",
  ],
  recovery_conduct: ["outbound_voice", "inbound_voice"],
  sales_cross_sell: ["outbound_voice", "inbound_voice", "chat"],
  disclosure_lending: ["outbound_voice", "chat", "email"],
  vulnerable_customer: ["inbound_voice", "outbound_voice", "chat"],
  fraud_dispute: ["inbound_voice", "tickets", "email"],
  vendor_outsourcing: ["outbound_voice", "inbound_voice"],
  language_routing: ["inbound_voice", "outbound_voice", "chat"],
};

type CoverageStatus =
  | "EVIDENCE_READY"
  | "MONITORING"
  | "MISSING_DATA"
  | "NOT_APPLICABLE"
  | "INTEGRATION_NEEDED";

type CoverageCell = {
  status: CoverageStatus;
  contactsAnalysed: number;
  signalsFound: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
};

function hashSeed(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(h | 0);
}

function getCoverageCell(obl: Obligation, channel: ChannelKey): CoverageCell {
  if (obl.buildTier === "OUT_OF_SCOPE") {
    return {
      status: "NOT_APPLICABLE",
      contactsAnalysed: 0,
      signalsFound: 0,
      severity: "NONE",
    };
  }
  const area = getConductArea(obl);
  const applicable = CHANNEL_APPLICABILITY[area];
  if (!applicable.includes(channel)) {
    return {
      status: "NOT_APPLICABLE",
      contactsAnalysed: 0,
      signalsFound: 0,
      severity: "NONE",
    };
  }
  if (
    obl.buildTier === "INTEGRATION_DEPENDENT" &&
    (channel === "tickets" || channel === "email")
  ) {
    return {
      status: "INTEGRATION_NEEDED",
      contactsAnalysed: 0,
      signalsFound: 0,
      severity: "NONE",
    };
  }
  if (
    obl.buildTier === "EVIDENCE_ONLY" &&
    (channel === "tickets" || channel === "social")
  ) {
    return {
      status: "MISSING_DATA",
      contactsAnalysed: 0,
      signalsFound: 0,
      severity: "NONE",
    };
  }
  const seed = hashSeed(`${obl.oblId}-${channel}`);
  const isVoice = channel === "inbound_voice" || channel === "outbound_voice";
  const baseVol = isVoice ? 900 : 240;
  const contactsAnalysed = baseVol + (seed % 1500);
  const signalRate = 0.022 + (seed % 60) / 1500;
  const signalsFound = Math.max(0, Math.floor(contactsAnalysed * signalRate));
  const linkedAlerts = RISK_ALERTS.filter((a) => a.obligationId === obl.oblId);
  const openCritical = linkedAlerts.some(
    (a) =>
      a.severity === "CRITICAL" &&
      a.status !== "ACTIONED" &&
      a.status !== "CLOSED",
  );
  const openHigh = linkedAlerts.some(
    (a) =>
      a.severity === "HIGH" && a.status !== "ACTIONED" && a.status !== "CLOSED",
  );
  let severity: CoverageCell["severity"] = "LOW";
  if (openCritical) severity = "CRITICAL";
  else if (openHigh) severity = "HIGH";
  else if (signalsFound > 22) severity = "MEDIUM";
  const status: CoverageStatus =
    linkedAlerts.length === 0 ? "EVIDENCE_READY" : "MONITORING";
  return { status, contactsAnalysed, signalsFound, severity };
}

function obligationCoverageSummary(obl: Obligation): {
  contactsAnalysed: number;
  signalsFound: number;
  readyChannels: number;
  monitoringChannels: number;
  missingChannels: number;
  applicableChannels: number;
  overallSeverity: CoverageCell["severity"];
} {
  let contactsAnalysed = 0;
  let signalsFound = 0;
  let readyChannels = 0;
  let monitoringChannels = 0;
  let missingChannels = 0;
  let applicableChannels = 0;
  let overallSeverity: CoverageCell["severity"] = "NONE";
  const sevOrder = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
    NONE: 0,
  } as const;
  for (const c of CHANNELS) {
    const cell = getCoverageCell(obl, c.key);
    if (cell.status === "NOT_APPLICABLE") continue;
    applicableChannels += 1;
    contactsAnalysed += cell.contactsAnalysed;
    signalsFound += cell.signalsFound;
    if (cell.status === "EVIDENCE_READY") readyChannels += 1;
    if (cell.status === "MONITORING") monitoringChannels += 1;
    if (cell.status === "MISSING_DATA" || cell.status === "INTEGRATION_NEEDED")
      missingChannels += 1;
    if (sevOrder[cell.severity] > sevOrder[overallSeverity]) {
      overallSeverity = cell.severity;
    }
  }
  return {
    contactsAnalysed,
    signalsFound,
    readyChannels,
    monitoringChannels,
    missingChannels,
    applicableChannels,
    overallSeverity,
  };
}

// ─── Locations & Vendors ──────────────────────────────────────────────────────

type LocationType = "IN_SOURCE" | "OUTSOURCE";

type Location = {
  locationId: string;
  name: string;
  city: string;
  type: LocationType;
  vendorId: string | null;
  agents: number;
  callsAnalysed: number;
  topPurpose: "SALES" | "FEEDBACK" | "RECOVERY";
  obligationsApplicable: number;
  breaches: number;
  missingDataCells: number;
  riskScore: number;
  topIssue: string;
  ownerId: string;
};

const LOCATIONS: readonly Location[] = [
  {
    locationId: "LOC-CHN-IH",
    name: "Chennai In-house Contact Center",
    city: "Chennai",
    type: "IN_SOURCE",
    vendorId: null,
    agents: 410,
    callsAnalysed: 11842,
    topPurpose: "FEEDBACK",
    obligationsApplicable: 22,
    breaches: 6,
    missingDataCells: 1,
    riskScore: 22,
    topIssue: "KFS read-out adherence 62% on personal-loan calls",
    ownerId: "OWN-CX01",
  },
  {
    locationId: "LOC-PUN-BPO",
    name: "Krescent BPO Pune",
    city: "Pune",
    type: "OUTSOURCE",
    vendorId: "VEN-KRES",
    agents: 320,
    callsAnalysed: 9420,
    topPurpose: "RECOVERY",
    obligationsApplicable: 18,
    breaches: 19,
    missingDataCells: 2,
    riskScore: 71,
    topIssue: "Threat language in 19 recovery calls — Marathi/Hindi",
    ownerId: "OWN-OUTS01",
  },
  {
    locationId: "LOC-HYD-IH",
    name: "Hyderabad In-house Hub",
    city: "Hyderabad",
    type: "IN_SOURCE",
    vendorId: null,
    agents: 280,
    callsAnalysed: 7610,
    topPurpose: "SALES",
    obligationsApplicable: 17,
    breaches: 11,
    missingDataCells: 0,
    riskScore: 48,
    topIssue: "Bundling pressure on Salary-A/c + ULIP cross-sell script",
    ownerId: "OWN-SALES01",
  },
  {
    locationId: "LOC-BLR-VEN",
    name: "TechServe Bengaluru",
    city: "Bengaluru",
    type: "OUTSOURCE",
    vendorId: "VEN-TS",
    agents: 220,
    callsAnalysed: 6184,
    topPurpose: "FEEDBACK",
    obligationsApplicable: 16,
    breaches: 7,
    missingDataCells: 1,
    riskScore: 39,
    topIssue: "Language mismatch — Tamil customers routed to Kannada queue",
    ownerId: "OWN-OUTS01",
  },
  {
    locationId: "LOC-MUM-COLL",
    name: "Mumbai Collections Hub",
    city: "Mumbai",
    type: "IN_SOURCE",
    vendorId: null,
    agents: 360,
    callsAnalysed: 10322,
    topPurpose: "RECOVERY",
    obligationsApplicable: 19,
    breaches: 14,
    missingDataCells: 0,
    riskScore: 62,
    topIssue: "Borrower distress dismissed on 14 graduated-escalation calls",
    ownerId: "OWN-COLL01",
  },
];

const LOCATIONS_BY_ID: Record<string, Location> = LOCATIONS.reduce(
  (acc, l) => {
    acc[l.locationId] = l;
    return acc;
  },
  {} as Record<string, Location>,
);

const EXTRA_VENDORS: readonly VendorBPOScore[] = [
  {
    vendorId: "VEN-KRES",
    vendorName: "Krescent BPO Pune",
    region: "MH — Pune",
    agents: 320,
    conductScoreOverall: 58,
    complaintRatePer10k: 26.1,
    benchmarkVsInhouse: "WORSE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 3,
    trend: [66, 63, 61, 59, 58],
  },
  {
    vendorId: "VEN-TS",
    vendorName: "TechServe Bengaluru",
    region: "KA — Bengaluru",
    agents: 220,
    conductScoreOverall: 71,
    complaintRatePer10k: 11.4,
    benchmarkVsInhouse: "WORSE",
    fluidCoveragePct: 100,
    sampleCoveragePctLegacy: 4,
    trend: [73, 72, 71, 71, 71],
  },
];

const ALL_VENDORS: readonly VendorBPOScore[] = [...VENDORS, ...EXTRA_VENDORS];

// ─── Outbound Purpose Buckets ─────────────────────────────────────────────────

type OutboundPurpose = "SALES" | "FEEDBACK" | "RECOVERY";

const OUTBOUND_PURPOSE_LABELS: Record<OutboundPurpose, string> = {
  SALES: "Sales Calls",
  FEEDBACK: "Feedback Calls",
  RECOVERY: "Recovery Calls",
};

type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type OutboundPurposeBucket = {
  purpose: OutboundPurpose;
  label: string;
  icon: LucideIcon;
  color: string;
  totalCalls: number;
  applicableObligations: number;
  breaches: number;
  passRate: number;
  topIssue: string;
  recommendedAction: string;
  signalLines: ReadonlyArray<{
    name: string;
    volume: number;
    severity: AlertSeverity;
  }>;
};

const OUTBOUND_PURPOSE_BUCKETS: readonly OutboundPurposeBucket[] = [
  {
    purpose: "SALES",
    label: "Sales Calls",
    icon: Megaphone,
    color: COLORS.purple,
    totalCalls: 12420,
    applicableObligations: 7,
    breaches: 184,
    passRate: 85,
    topIssue: "Bundling pressure on Salary-A/c + ULIP cross-sell script",
    recommendedAction:
      "Halt Cross-Sell Variant A; recalibrate suitability script for 3 agents",
    signalLines: [
      { name: "Bundling pressure", volume: 84, severity: "HIGH" },
      {
        name: "Suitability conversation missed",
        volume: 51,
        severity: "MEDIUM",
      },
      { name: "Script deviation", volume: 31, severity: "MEDIUM" },
      { name: "Misleading claim", volume: 18, severity: "HIGH" },
    ],
  },
  {
    purpose: "FEEDBACK",
    label: "Feedback Calls",
    icon: Headphones,
    color: COLORS.teal,
    totalCalls: 9210,
    applicableObligations: 5,
    breaches: 62,
    passRate: 93,
    topIssue: "47 complaints expressed but no CMS SR created — ALT-3302",
    recommendedAction:
      "Surface 47 detected complaints to Head of CX for CMS SR creation",
    signalLines: [
      { name: "Complaint capture missed", volume: 47, severity: "CRITICAL" },
      { name: "Escalation route not given", volume: 12, severity: "MEDIUM" },
      { name: "Language mismatch", volume: 21, severity: "MEDIUM" },
      { name: "Unresolved dissatisfaction", volume: 9, severity: "MEDIUM" },
    ],
  },
  {
    purpose: "RECOVERY",
    label: "Recovery Calls",
    icon: Phone,
    color: COLORS.amber,
    totalCalls: 14180,
    applicableObligations: 9,
    breaches: 287,
    passRate: 79,
    topIssue:
      "Recovery harassment cluster — VEN-KRES outbound dialler (RCA-2401)",
    recommendedAction:
      "Vendor halt + 2-week attestation refresh; whitelist borrower-only numbers",
    signalLines: [
      { name: "Threat / harassment", volume: 64, severity: "CRITICAL" },
      { name: "Borrower distress ignored", volume: 38, severity: "HIGH" },
      { name: "Disclaimer missing", volume: 92, severity: "MEDIUM" },
      { name: "Agent ID missing", volume: 47, severity: "MEDIUM" },
      {
        name: "Legal action before graduated escalation",
        volume: 14,
        severity: "HIGH",
      },
    ],
  },
];

// ─── Violation Feed ───────────────────────────────────────────────────────────

type Violation = {
  violationId: string;
  timestamp: string;
  locationId: string;
  agentOrVendor: string;
  callPurpose: OutboundPurpose;
  obligationId: string;
  detectedSignal: string;
  severity: AlertSeverity;
  linkedAlertId: string;
  recommendedAction: string;
};

const VIOLATIONS: readonly Violation[] = [
  {
    violationId: "VLT-9101",
    timestamp: "2026-05-24T14:08:00+05:30",
    locationId: "LOC-PUN-BPO",
    agentOrVendor: "AG-4422 · Krescent Pune",
    callPurpose: "RECOVERY",
    obligationId: "OBL-005",
    detectedSignal: "Threat language · Marathi cluster",
    severity: "CRITICAL",
    linkedAlertId: "ALT-3301",
    recommendedAction:
      "Vendor halt + attestation refresh; dialler whitelist on borrower-only numbers",
  },
  {
    violationId: "VLT-9102",
    timestamp: "2026-05-24T11:22:00+05:30",
    locationId: "LOC-CHN-IH",
    agentOrVendor: "AG-1102 · Chennai in-house",
    callPurpose: "FEEDBACK",
    obligationId: "OBL-001",
    detectedSignal: "Complaint expressed · no SR created (47 cases)",
    severity: "CRITICAL",
    linkedAlertId: "ALT-3302",
    recommendedAction:
      "Surface complaints to Head of CX; create CMS SRs via complaint intake workflow",
  },
  {
    violationId: "VLT-9103",
    timestamp: "2026-05-23T15:08:00+05:30",
    locationId: "LOC-HYD-IH",
    agentOrVendor: "AG-3017 · Hyderabad in-house",
    callPurpose: "SALES",
    obligationId: "OBL-018",
    detectedSignal: "Bundling pressure · ULIP cross-sell · 'no choice' phrase",
    severity: "HIGH",
    linkedAlertId: "ALT-3303",
    recommendedAction:
      "Halt Cross-Sell Variant A; QA review of 3 agents in 48h",
  },
  {
    violationId: "VLT-9104",
    timestamp: "2026-05-24T09:50:00+05:30",
    locationId: "LOC-MUM-COLL",
    agentOrVendor: "AG-2210 · Mumbai Collections",
    callPurpose: "RECOVERY",
    obligationId: "OBL-008",
    detectedSignal: "Borrower distress dismissed · medical emergency",
    severity: "HIGH",
    linkedAlertId: "ALT-3304",
    recommendedAction: "Empathy retraining for 2 agents; escalate to L2 review",
  },
  {
    violationId: "VLT-9105",
    timestamp: "2026-05-23T17:42:00+05:30",
    locationId: "LOC-BLR-VEN",
    agentOrVendor: "AG-5511 · TechServe Bengaluru",
    callPurpose: "FEEDBACK",
    obligationId: "OBL-016",
    detectedSignal: "Tamil customer routed to Kannada queue · 28s hold",
    severity: "MEDIUM",
    linkedAlertId: "ALT-3312",
    recommendedAction:
      "Reconfigure IVR routing matrix for Tamil-speaking customers",
  },
  {
    violationId: "VLT-9106",
    timestamp: "2026-05-24T12:11:00+05:30",
    locationId: "LOC-CHN-IH",
    agentOrVendor: "AG-1109 · Chennai in-house",
    callPurpose: "FEEDBACK",
    obligationId: "OBL-011",
    detectedSignal:
      "Bereavement bypass — 'mere husband ka abhi operation hua hai'",
    severity: "CRITICAL",
    linkedAlertId: "ALT-3305",
    recommendedAction:
      "Empathy retraining cohort delivered (closure pack); 14-day measurement window",
  },
  {
    violationId: "VLT-9107",
    timestamp: "2026-05-22T16:30:00+05:30",
    locationId: "LOC-PUN-BPO",
    agentOrVendor: "AG-4419 · Krescent Pune",
    callPurpose: "RECOVERY",
    obligationId: "OBL-007",
    detectedSignal: "Agent ID not disclosed in first 30s",
    severity: "MEDIUM",
    linkedAlertId: "ALT-3306",
    recommendedAction:
      "QA bot rule on agent-ID disclosure; weekly review with Krescent AVP",
  },
  {
    violationId: "VLT-9108",
    timestamp: "2026-05-23T10:20:00+05:30",
    locationId: "LOC-HYD-IH",
    agentOrVendor: "AG-3020 · Hyderabad in-house",
    callPurpose: "SALES",
    obligationId: "OBL-009",
    detectedSignal: "KFS read-out skipped · personal-loan onboarding",
    severity: "HIGH",
    linkedAlertId: "ALT-3311",
    recommendedAction:
      "Mandatory KFS read-out checkpoint via CRM integration (INT-CRM)",
  },
  {
    violationId: "VLT-9109",
    timestamp: "2026-05-21T13:42:00+05:30",
    locationId: "LOC-MUM-COLL",
    agentOrVendor: "AG-2218 · Mumbai Collections",
    callPurpose: "RECOVERY",
    obligationId: "OBL-005",
    detectedSignal: "Public shaming language on second-call escalation",
    severity: "HIGH",
    linkedAlertId: "ALT-3307",
    recommendedAction:
      "Suspend agent + script audit + IO referral package ready",
  },
  {
    violationId: "VLT-9110",
    timestamp: "2026-05-24T08:14:00+05:30",
    locationId: "LOC-CHN-IH",
    agentOrVendor: "AG-1112 · Chennai in-house",
    callPurpose: "FEEDBACK",
    obligationId: "OBL-002",
    detectedSignal: "First-90s acknowledgement missed (sample 32)",
    severity: "MEDIUM",
    linkedAlertId: "ALT-3309",
    recommendedAction:
      "Coaching nudge + adherence target 85%; reroute via supervisor",
  },
  {
    violationId: "VLT-9111",
    timestamp: "2026-05-23T19:05:00+05:30",
    locationId: "LOC-BLR-VEN",
    agentOrVendor: "AG-5520 · TechServe Bengaluru",
    callPurpose: "SALES",
    obligationId: "OBL-018",
    detectedSignal: "Misleading claim · 'guaranteed approval' phrase",
    severity: "HIGH",
    linkedAlertId: "ALT-3303",
    recommendedAction: "Vendor script review + agent removal from sales queue",
  },
  {
    violationId: "VLT-9112",
    timestamp: "2026-05-22T11:00:00+05:30",
    locationId: "LOC-HYD-IH",
    agentOrVendor: "AG-3022 · Hyderabad in-house",
    callPurpose: "SALES",
    obligationId: "OBL-014",
    detectedSignal: "Pre-payment penalty not announced in fixed-rate offer",
    severity: "MEDIUM",
    linkedAlertId: "ALT-3308",
    recommendedAction:
      "CRM-driven disclosure prompt (INT-CRM); recalibrate script",
  },
];

const _VIOLATIONS_BY_ID: Record<string, Violation> = VIOLATIONS.reduce(
  (acc, v) => {
    acc[v.violationId] = v;
    return acc;
  },
  {} as Record<string, Violation>,
);

// ─── Heatmap (location × conduct area) ────────────────────────────────────────

type HeatmapCellValue = {
  status: "GOOD" | "WATCH" | "RISK" | "CRITICAL" | "NO_DATA";
  volume: number;
  breaches: number;
  topSignal: string;
};

const HEATMAP_AREA_COLS: ReadonlyArray<ConductAreaKey> = [
  "complaint_grievance",
  "recovery_conduct",
  "sales_cross_sell",
  "disclosure_lending",
  "language_routing",
  "vulnerable_customer",
];

const HEATMAP_DATA: Record<
  string,
  Partial<Record<ConductAreaKey, HeatmapCellValue>>
> = {
  "LOC-CHN-IH": {
    complaint_grievance: {
      status: "CRITICAL",
      volume: 3210,
      breaches: 47,
      topSignal: "Complaint expressed · no SR",
    },
    recovery_conduct: {
      status: "GOOD",
      volume: 1102,
      breaches: 1,
      topSignal: "Agent ID disclosure 96%",
    },
    sales_cross_sell: {
      status: "WATCH",
      volume: 1840,
      breaches: 6,
      topSignal: "Suitability missed (6)",
    },
    disclosure_lending: {
      status: "RISK",
      volume: 2210,
      breaches: 18,
      topSignal: "KFS read-out 62% adherence",
    },
    language_routing: {
      status: "WATCH",
      volume: 980,
      breaches: 4,
      topSignal: "Hi→Ta routing edge cases",
    },
    vulnerable_customer: {
      status: "CRITICAL",
      volume: 720,
      breaches: 12,
      topSignal: "Bereavement bypass",
    },
  },
  "LOC-PUN-BPO": {
    complaint_grievance: {
      status: "WATCH",
      volume: 1842,
      breaches: 4,
      topSignal: "Capture rate 94%",
    },
    recovery_conduct: {
      status: "CRITICAL",
      volume: 4620,
      breaches: 64,
      topSignal: "Threat language cluster",
    },
    sales_cross_sell: {
      status: "NO_DATA",
      volume: 0,
      breaches: 0,
      topSignal: "Vendor does not run sales",
    },
    disclosure_lending: {
      status: "RISK",
      volume: 980,
      breaches: 11,
      topSignal: "Cooling-off not announced",
    },
    language_routing: {
      status: "WATCH",
      volume: 720,
      breaches: 2,
      topSignal: "Marathi handled well",
    },
    vulnerable_customer: {
      status: "RISK",
      volume: 480,
      breaches: 9,
      topSignal: "Borrower distress dismissed",
    },
  },
  "LOC-HYD-IH": {
    complaint_grievance: {
      status: "GOOD",
      volume: 1020,
      breaches: 2,
      topSignal: "Capture rate 98%",
    },
    recovery_conduct: {
      status: "GOOD",
      volume: 410,
      breaches: 1,
      topSignal: "Inside SLA",
    },
    sales_cross_sell: {
      status: "CRITICAL",
      volume: 4180,
      breaches: 51,
      topSignal: "Bundling pressure cluster",
    },
    disclosure_lending: {
      status: "WATCH",
      volume: 1640,
      breaches: 8,
      topSignal: "Pre-payment penalty (8)",
    },
    language_routing: {
      status: "GOOD",
      volume: 540,
      breaches: 0,
      topSignal: "Te + En coverage solid",
    },
    vulnerable_customer: {
      status: "WATCH",
      volume: 220,
      breaches: 3,
      topSignal: "Senior-citizen routing",
    },
  },
  "LOC-BLR-VEN": {
    complaint_grievance: {
      status: "WATCH",
      volume: 1240,
      breaches: 3,
      topSignal: "Capture rate 95%",
    },
    recovery_conduct: {
      status: "WATCH",
      volume: 540,
      breaches: 2,
      topSignal: "Light volume",
    },
    sales_cross_sell: {
      status: "RISK",
      volume: 2120,
      breaches: 14,
      topSignal: "Misleading claim cluster",
    },
    disclosure_lending: {
      status: "GOOD",
      volume: 880,
      breaches: 1,
      topSignal: "KFS adherence 91%",
    },
    language_routing: {
      status: "RISK",
      volume: 1240,
      breaches: 21,
      topSignal: "Tamil→Kannada queue mis-route",
    },
    vulnerable_customer: {
      status: "GOOD",
      volume: 160,
      breaches: 0,
      topSignal: "Within window",
    },
  },
  "LOC-MUM-COLL": {
    complaint_grievance: {
      status: "WATCH",
      volume: 1620,
      breaches: 5,
      topSignal: "Capture rate 96%",
    },
    recovery_conduct: {
      status: "CRITICAL",
      volume: 6480,
      breaches: 92,
      topSignal: "Disclaimer missing cluster",
    },
    sales_cross_sell: {
      status: "NO_DATA",
      volume: 0,
      breaches: 0,
      topSignal: "Hub does not run sales",
    },
    disclosure_lending: {
      status: "RISK",
      volume: 1180,
      breaches: 14,
      topSignal: "Penal-charge phrasing",
    },
    language_routing: {
      status: "WATCH",
      volume: 1040,
      breaches: 3,
      topSignal: "Mr→Hi cross-routing ok",
    },
    vulnerable_customer: {
      status: "RISK",
      volume: 580,
      breaches: 14,
      topSignal: "Distress ignored — graduated escalation",
    },
  },
};

// ─── Top obligation breaches (Strip) ──────────────────────────────────────────

type TopBreach = {
  obligationId: string;
  title: string;
  volume: number;
  channel: string;
  ownerId: string;
  severity: AlertSeverity;
  recommendedAction: string;
  linkedAlertId: string;
};

const TOP_BREACHES: readonly TopBreach[] = [
  {
    obligationId: "OBL-001",
    title: "Complaint expressed · no SR created",
    volume: 47,
    channel: "Inbound voice · chat",
    ownerId: "OWN-CX01",
    severity: "CRITICAL",
    recommendedAction:
      "Surface to Head of CX for CMS SR creation via complaint intake workflow",
    linkedAlertId: "ALT-3302",
  },
  {
    obligationId: "OBL-005",
    title: "Recovery threat language",
    volume: 64,
    channel: "Outbound voice",
    ownerId: "OWN-OUTS01",
    severity: "CRITICAL",
    recommendedAction:
      "Vendor halt + 2-week attestation refresh + dialler whitelist on borrower-only numbers",
    linkedAlertId: "ALT-3301",
  },
  {
    obligationId: "OBL-008",
    title: "Borrower distress ignored",
    volume: 38,
    channel: "Outbound voice",
    ownerId: "OWN-COLL01",
    severity: "HIGH",
    recommendedAction:
      "Empathy retraining cohort + 14-day measurement window; L2 review",
    linkedAlertId: "ALT-3304",
  },
  {
    obligationId: "OBL-018",
    title: "Bundling pressure · cross-sell script",
    volume: 28,
    channel: "Outbound voice",
    ownerId: "OWN-SALES01",
    severity: "HIGH",
    recommendedAction:
      "Halt Cross-Sell Variant A; QA review of 3 agents within 48h",
    linkedAlertId: "ALT-3303",
  },
  {
    obligationId: "OBL-016",
    title: "Language mismatch · regional routing",
    volume: 21,
    channel: "Inbound voice · chat",
    ownerId: "OWN-OUTS01",
    severity: "MEDIUM",
    recommendedAction:
      "Reconfigure IVR routing matrix for Tamil customers (Bengaluru queue)",
    linkedAlertId: "ALT-3312",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  COVERAGE-CELL · STATUS UTILITY
// ─────────────────────────────────────────────────────────────────────────────

const COVERAGE_STATUS_META: Record<
  CoverageStatus,
  { label: string; color: string; tone: string }
> = {
  EVIDENCE_READY: {
    label: "Evidence ready",
    color: COLORS.green,
    tone: "good",
  },
  MONITORING: { label: "Monitoring", color: COLORS.amber, tone: "watch" },
  MISSING_DATA: { label: "No data", color: COLORS.red, tone: "risk" },
  NOT_APPLICABLE: { label: "N/A", color: COLORS.dim, tone: "muted" },
  INTEGRATION_NEEDED: {
    label: "Needs integration",
    color: COLORS.purple,
    tone: "integrate",
  },
};

const HEATMAP_STATUS_META: Record<
  HeatmapCellValue["status"],
  { label: string; color: string }
> = {
  GOOD: { label: "Good", color: COLORS.green },
  WATCH: { label: "Watch", color: COLORS.amber },
  RISK: { label: "Risk", color: COLORS.red },
  CRITICAL: { label: "Critical", color: COLORS.red },
  NO_DATA: { label: "No data", color: COLORS.dim },
};

// ─────────────────────────────────────────────────────────────────────────────
//  MODULE COMPONENTS — Shared widgets for both screens
// ─────────────────────────────────────────────────────────────────────────────

function ChannelCoverageCell({
  cell,
  channelKey,
}: {
  cell: CoverageCell;
  channelKey: ChannelKey;
}) {
  const meta = COVERAGE_STATUS_META[cell.status];
  if (cell.status === "NOT_APPLICABLE") {
    return (
      <div
        className="grid h-full place-items-center rounded-md border border-white/5 bg-zinc-900/30 px-2 py-1.5 text-[10px] font-bold text-zinc-600"
        title="Not applicable for this obligation"
      >
        N/A
      </div>
    );
  }
  if (cell.status === "MISSING_DATA") {
    return (
      <div
        className="rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1.5"
        title="Channel applies but no Fluid data feed"
      >
        <p className="text-[10px] font-black uppercase tracking-wide text-red-300">
          No data
        </p>
        <p className="text-[10px] font-bold text-zinc-400">Feed missing</p>
      </div>
    );
  }
  if (cell.status === "INTEGRATION_NEEDED") {
    return (
      <div
        className="rounded-md border border-purple-400/40 bg-purple-400/10 px-2 py-1.5"
        title="Monitored with system integration (CRM / CMS)"
      >
        <p className="text-[10px] font-black uppercase tracking-wide text-purple-200">
          Integration
        </p>
        <p className="text-[10px] font-bold text-zinc-400">
          Needs partner feed
        </p>
      </div>
    );
  }
  const sevColor =
    cell.severity === "CRITICAL"
      ? COLORS.red
      : cell.severity === "HIGH"
        ? COLORS.amber
        : cell.severity === "MEDIUM"
          ? COLORS.yellow
          : COLORS.green;
  return (
    <div
      className="rounded-md border px-2 py-1.5"
      style={{
        borderColor: `${meta.color}55`,
        background: `${meta.color}10`,
      }}
      title={`${meta.label} · ${cell.contactsAnalysed} contacts / ${cell.signalsFound} signals on ${channelKey.replace("_", " ")}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          className="text-[10px] font-black uppercase tracking-wide"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: sevColor }}
          aria-hidden
        />
      </div>
      <p className="mt-0.5 text-[10px] font-bold tabular-nums text-zinc-200">
        {fmt(cell.contactsAnalysed)} <span className="text-zinc-500">/</span>{" "}
        {fmt(cell.signalsFound)}
      </p>
    </div>
  );
}

function OverallStatusBadge({
  summary,
  buildTier,
}: {
  summary: ReturnType<typeof obligationCoverageSummary>;
  buildTier: BuildTier;
}) {
  if (buildTier === "OUT_OF_SCOPE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-zinc-400">
        <Lock className="size-3" aria-hidden /> Outside scope
      </span>
    );
  }
  if (summary.overallSeverity === "CRITICAL") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-500/60 bg-red-900/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-red-300">
        Critical breach
      </span>
    );
  }
  if (summary.overallSeverity === "HIGH") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-500/60 bg-amber-900/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-300">
        Breach watch
      </span>
    );
  }
  if (summary.missingChannels > 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-purple-400/60 bg-purple-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-purple-200">
        Partial coverage
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-900/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-300">
      On track
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 1  ·  OBLIGATION COVERAGE COMMAND CENTER
// ─────────────────────────────────────────────────────────────────────────────

function _ObligationCoverageMatrix({
  conductAreaFilter,
  searchTerm,
}: {
  conductAreaFilter: ReadonlySet<ConductAreaKey>;
  searchTerm: string;
}) {
  const persona = usePersona();
  const trimSearch = searchTerm.trim().toLowerCase();

  return (
    <div className="space-y-3">
      {CONDUCT_AREAS.map((area) => {
        if (!conductAreaFilter.has(area.key)) return null;
        const obligations = OBLIGATIONS_BY_AREA[area.key].filter((o) => {
          if (!trimSearch) return true;
          return (
            o.statement.toLowerCase().includes(trimSearch) ||
            o.oblId.toLowerCase().includes(trimSearch) ||
            area.name.toLowerCase().includes(trimSearch)
          );
        });
        if (obligations.length === 0) return null;
        const AreaIcon = area.icon;
        return (
          <div
            key={area.key}
            className="overflow-hidden rounded-2xl border bg-[#0d0d0d]"
            style={{ borderColor: COLORS.border }}
          >
            <div
              className="flex items-center justify-between gap-3 border-b px-4 py-2.5"
              style={{
                borderColor: `${area.color}33`,
                background: `${area.color}0a`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-lg"
                  style={{ background: `${area.color}22`, color: area.color }}
                >
                  <AreaIcon className="size-3.5" aria-hidden />
                </span>
                <div>
                  <p
                    className="text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ color: area.color }}
                  >
                    {area.name}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500">
                    {area.blurb}
                  </p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-zinc-500">
                {obligations.length} obligations
              </p>
            </div>
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[1180px] border-b border-white/5 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
                style={{
                  gridTemplateColumns:
                    "minmax(220px,1.6fr) 90px repeat(6,minmax(96px,1fr)) 110px 90px",
                }}
              >
                <span>Obligation</span>
                <span>Owner</span>
                {CHANNELS.map((c) => (
                  <span key={c.key}>{c.short}</span>
                ))}
                <span>Overall</span>
                <span className="text-right">Action</span>
              </div>
              <div className="divide-y divide-white/5">
                {obligations.map((o) => {
                  const owner = CONTROL_OWNERS.find(
                    (co) => co.personaId === o.accountablePersonaId,
                  );
                  const summary = obligationCoverageSummary(o);
                  return (
                    <button
                      key={o.oblId}
                      type="button"
                      onClick={() => persona.openObligationDrawer(o.oblId)}
                      className="grid w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04] focus:bg-white/[0.06] focus:outline-none"
                      style={{
                        gridTemplateColumns:
                          "minmax(220px,1.6fr) 90px repeat(6,minmax(96px,1fr)) 110px 90px",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Pill severity="IN_FORCE">{o.oblId}</Pill>
                          <ObligationStatusBadge status={o.status} />
                        </div>
                        <p className="mt-1 line-clamp-2 text-[12px] font-bold text-zinc-200">
                          {o.statement}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold text-zinc-500">
                          {BUILD_TIER_MAP[o.buildTier].label}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-black text-zinc-100">
                          {owner?.roleTitle ?? o.businessProcessOwnerRole}
                        </p>
                        <p className="truncate text-[10px] font-semibold text-zinc-500">
                          {owner?.lineOfDefence ?? "—"}
                        </p>
                      </div>
                      {CHANNELS.map((c) => (
                        <ChannelCoverageCell
                          key={c.key}
                          cell={getCoverageCell(o, c.key)}
                          channelKey={c.key}
                        />
                      ))}
                      <OverallStatusBadge
                        summary={summary}
                        buildTier={o.buildTier}
                      />
                      <span className="text-right text-[10px] font-black uppercase tracking-wide text-teal-300">
                        Open
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopBreachesStrip() {
  const persona = usePersona();
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[1080px] grid-cols-5 gap-3">
        {TOP_BREACHES.map((b) => {
          const owner = OWNERS_BY_ID[b.ownerId];
          const sevColor =
            b.severity === "CRITICAL"
              ? COLORS.red
              : b.severity === "HIGH"
                ? COLORS.amber
                : COLORS.yellow;
          return (
            <button
              key={b.obligationId + b.linkedAlertId}
              type="button"
              onClick={() => persona.openEvidenceDrawer(b.linkedAlertId)}
              className="flex flex-col gap-2 rounded-2xl border bg-[#0d0d0d] p-3 text-left transition hover:border-white/25"
              style={{ borderColor: `${sevColor}40` }}
            >
              <div className="flex items-center justify-between gap-2">
                <Pill severity="IN_FORCE">{b.obligationId}</Pill>
                <SeverityBadge severity={b.severity} />
              </div>
              <p className="text-[13px] font-black leading-snug text-white">
                {b.title}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-zinc-400">
                <div>
                  <p className="font-black uppercase tracking-wide text-zinc-500">
                    Volume
                  </p>
                  <p className="text-zinc-100">{fmt(b.volume)}</p>
                </div>
                <div>
                  <p className="font-black uppercase tracking-wide text-zinc-500">
                    Channel
                  </p>
                  <p className="text-zinc-200">{b.channel}</p>
                </div>
              </div>
              <p className="text-[11px] font-bold text-zinc-400">
                Owner ·{" "}
                <span className="text-zinc-100">
                  {owner?.roleTitle ?? "Unassigned"}
                </span>
              </p>
              <div className="rounded-md border border-white/10 bg-black/40 p-2 text-[11px] leading-snug text-zinc-200">
                <p className="font-black uppercase tracking-wide text-[9px] text-teal-300">
                  Recommended action
                </p>
                <p>{b.recommendedAction}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function _ObligationDetailDrawer() {
  const persona = usePersona();
  const oblId = persona.drawerObligationId;
  const obligation = oblId ? OBLIGATIONS_BY_ID[oblId] : null;

  useEffect(() => {
    if (!obligation) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") persona.closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [obligation, persona]);

  if (!obligation) return null;

  const regulation = REGULATIONS_BY_ID[obligation.parentRegulationId];
  const theme = THEMES_BY_ID[obligation.themeId];
  const area = CONDUCT_AREA_MAP[getConductArea(obligation)];
  const owner = CONTROL_OWNERS.find(
    (o) => o.personaId === obligation.accountablePersonaId,
  );
  const obligationAlerts = RISK_ALERTS.filter(
    (a) => a.obligationId === obligation.oblId,
  );
  const linkedSignals = SIGNALS.filter((s) =>
    s.relatedObligationIds.includes(obligation.oblId),
  ).slice(0, 4);
  const linkedEvidence = obligationAlerts
    .flatMap((a) => list(a.evidenceIds))
    .map((id) => EVIDENCE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 4);
  const boundary = BOUNDARIES.find((b) => b.obligationId === obligation.oblId);
  const integration = INTEGRATIONS.find((i) =>
    i.obligationIds.includes(obligation.oblId),
  );
  const summary = obligationCoverageSummary(obligation);
  const AreaIcon = area.icon;
  const recommendedAction =
    obligationAlerts.find((a) => a.recommendedAction)?.recommendedAction ??
    "Continue monitoring — no recommended action yet.";

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close obligation drawer"
        onClick={persona.closeDrawer}
        className="flex-1 bg-black/55 backdrop-blur-sm"
      />
      <aside
        className="relative h-full w-full max-w-[560px] overflow-y-auto border-l bg-[#070707] shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        style={{ borderColor: COLORS.border }}
        role="dialog"
        aria-modal="true"
        aria-label="Obligation detail"
      >
        <header
          className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b bg-[#070707]/95 px-5 py-4 backdrop-blur"
          style={{ borderColor: COLORS.border }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="grid size-7 place-items-center rounded-lg"
                style={{
                  background: `${area.color}22`,
                  color: area.color,
                }}
              >
                <AreaIcon className="size-3.5" aria-hidden />
              </span>
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: area.color }}
              >
                {area.name}
              </p>
            </div>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500">
              {obligation.oblId} · {regulation?.shortName ?? "—"}
            </p>
            <p className="mt-1 text-sm font-black leading-snug text-white">
              {obligation.statement}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <ObligationStatusBadge status={obligation.status} />
              <ComplianceLabelBadge buildTier={obligation.buildTier} />
              <DeadlinePill date={obligation.effectiveDate} label="Effective" />
            </div>
          </div>
          <button
            type="button"
            onClick={persona.closeDrawer}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="space-y-5 px-5 py-5">
          <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className={LABEL_CAPS}>What this obligation requires</p>
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-zinc-200">
              {obligation.statement}
            </p>
            {theme ? (
              <p className="mt-2 text-[11px] font-semibold text-zinc-500">
                Theme · {theme.themeName} — {theme.themeDefinition}
              </p>
            ) : null}
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/35 p-3">
              <p className={LABEL_CAPS}>Contacts analysed</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">
                {fmt(summary.contactsAnalysed)}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-zinc-500">
                Across {summary.applicableChannels} applicable channels
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-3">
              <p className={LABEL_CAPS}>Signals detected</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">
                {fmt(summary.signalsFound)}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-zinc-500">
                {obligationAlerts.length} active alert
                {obligationAlerts.length === 1 ? "" : "s"}
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <p className={LABEL_CAPS}>Channel coverage</p>
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map((c) => {
                const cell = getCoverageCell(obligation, c.key);
                return (
                  <div
                    key={c.key}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/35 px-2.5 py-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <c.icon className="size-3.5 text-zinc-400" aria-hidden />
                      <span className="text-[11px] font-black text-zinc-200">
                        {c.label}
                      </span>
                    </div>
                    <ChannelCoverageCell cell={cell} channelKey={c.key} />
                  </div>
                );
              })}
            </div>
          </section>

          {boundary ? (
            <BoundaryNote
              partnerSystem={boundary.partnerSystemNamed}
              reason={boundary.reason}
              displayType={boundary.displayType}
            />
          ) : null}

          {integration ? (
            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-3.5">
              <div className="flex items-center gap-2">
                <Plug className="size-3.5 text-teal-300" aria-hidden />
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-200">
                  Integration dependency
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">
                {integration.partnerSystem}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-zinc-300">
                {integration.notes}
              </p>
            </div>
          ) : null}

          <section className="space-y-2">
            <p className={LABEL_CAPS}>
              Evidence snippets · {linkedSignals.length}
            </p>
            {linkedSignals.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                message="No individual signal snippets — cluster-proof evidence attached via alerts."
              />
            ) : (
              <div className="space-y-2">
                {linkedSignals.map((s) => (
                  <TranscriptSnippet key={s.signalId} signal={s} />
                ))}
              </div>
            )}
          </section>

          {linkedEvidence.length > 0 ? (
            <section className="space-y-2">
              <p className={LABEL_CAPS}>
                Evidence pack · {linkedEvidence.length} items
              </p>
              <div className="space-y-2">
                {linkedEvidence.map((e) => (
                  <div
                    key={e.evidenceId}
                    className="rounded-xl border border-white/10 bg-black/35 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-zinc-300">
                        {e.evidenceType.replace(/_/g, " ")}
                      </span>
                      {e.attestationReady ? (
                        <Pill severity="ACTIONED">Audit-ready</Pill>
                      ) : (
                        <Pill severity="MEDIUM">Pending</Pill>
                      )}
                    </div>
                    <p className="mt-2 text-[12px] font-semibold leading-snug text-zinc-200">
                      {e.whyThisIsEvidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className={LABEL_CAPS}>Owner & recommended action</p>
            {owner ? (
              <div className="mt-2 flex items-center gap-2">
                <OwnerChip owner={owner} />
              </div>
            ) : null}
            <p className="mt-3 text-sm font-bold leading-snug text-white">
              {recommendedAction}
            </p>
            {obligationAlerts.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    persona.openEvidenceDrawer(obligationAlerts[0].alertId)
                  }
                  className="rounded-lg border border-teal-500/50 bg-teal-500/20 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-teal-100 hover:bg-teal-500/30"
                >
                  Open evidence drawer
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DASHBOARD PANELS (component-first · register-grounded · minimal drill-down)
// ─────────────────────────────────────────────────────────────────────────────

function metPctColor(pct: number): string {
  if (pct >= 85) return COLORS.green;
  if (pct >= 70) return COLORS.amber;
  return COLORS.red;
}

function ConductRiskGauge() {
  const score = REGISTER_CONDUCT_RISK_SCORE;
  const metPct = REGISTER_OVERALL_MET_PCT;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const riskLabel =
    score >= 75 ? "Elevated" : score >= 60 ? "Watch" : "Controlled";
  const riskColor =
    score >= 75 ? COLORS.red : score >= 60 ? COLORS.amber : COLORS.green;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative size-[200px] shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Overall conduct risk score ${score} out of 100, status ${riskLabel}`}
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={COLORS.inset}
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={riskColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-4xl font-black tabular-nums text-white">{score}</p>
          <p
            className="text-[11px] font-black uppercase tracking-wide"
            style={{ color: riskColor }}
          >
            {riskLabel}
          </p>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className={NEST}>
          <p className={LABEL_CAPS}>Fluid-alone obligation met</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white">
            {metPct}%
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-400">
            {REGISTER_FLUID_ALONE_COUNT} controls · conversation-verified only
          </p>
        </div>
        <div className={NEST}>
          <p className={LABEL_CAPS}>Below 70% threshold</p>
          <p className="mt-1 text-lg font-black text-amber-300">
            {OBLIGATION_MET_SUMMARIES.filter((o) => o.metPct < 70).length}{" "}
            obligations
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            OBL-002 First-90s · OBL-008 Hardship · OBL-011 Bereavement empathy
          </p>
        </div>
      </div>
    </div>
  );
}

function CoverageAiInsightCard() {
  const below = OBLIGATION_MET_SUMMARIES.filter((o) => o.metPct < 70)
    .sort((a, b) => a.metPct - b.metPct)
    .slice(0, 3);
  const topReason = [...TOP_CALL_REASONS].sort(
    (a, b) => b.volume - a.volume,
  )[0];

  return (
    <section
      className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-950/40 via-[#0d0d0d] to-[#0d0d0d] p-5 shadow-[0_18px_64px_-32px_rgba(99,102,241,0.35)]"
      style={{ borderColor: `${COLORS.indigo}55` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div>
            <p className={LABEL_CAPS}>AI insight · coverage</p>
            <p className="text-sm font-black text-white">
              First-90s and missed-complaint gaps dominate exposure
            </p>
          </div>
        </div>
        <Pill severity="HIGH">Priority</Pill>
      </div>
      <ul className="mt-4 flex-1 space-y-2.5 text-[12px] font-semibold leading-relaxed text-zinc-300">
        <li>
          <span className="text-indigo-300">1.</span>{" "}
          <strong className="text-white">OBL-002</strong> first-90s adherence
          averages 64% — SR offer (58%) is the weakest control in the register.
        </li>
        <li>
          <span className="text-indigo-300">2.</span> Top inbound driver{" "}
          <strong className="text-white">{topReason.reason}</strong> maps to{" "}
          {topReason.obligationId} ({fmt(topReason.volume)} contacts / 7d).
        </li>
        <li>
          <span className="text-indigo-300">3.</span> Fluid-alone coverage is{" "}
          {REGISTER_OVERALL_MET_PCT}% overall; {below.length} obligations need
          control-owner action this week.
        </li>
      </ul>
      <p className="mt-3 text-[10px] font-bold text-zinc-500">
        Grounded in RBI_Obligation_Control_Register · Fluid-alone sheet · no CMS
        write-back
      </p>
    </section>
  );
}

function OperationsAiInsightCard() {
  const vendorGap = ALL_VENDORS.filter(
    (v) => v.vendorId !== "VEN-INHOUSE" && v.conductScoreOverall < 75,
  ).length;
  const recoveryTrend = VIOLATION_TREND_WEEKLY.at(-1)?.violations ?? 0;
  const prevTrend = VIOLATION_TREND_WEEKLY.at(-2)?.violations ?? 0;

  return (
    <section
      className="flex h-full min-h-[180px] flex-col overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-950/30 via-[#0d0d0d] to-[#0d0d0d] p-5"
      style={{ borderColor: `${COLORS.amber}55` }}
    >
      <div className="flex items-start gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
          <Radar className="size-4" aria-hidden />
        </span>
        <div>
          <p className={LABEL_CAPS}>AI insight · operations</p>
          <p className="text-sm font-black text-white">
            Recovery violations easing; vendor parity still lags in-house
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-2 text-[12px] font-semibold leading-relaxed text-zinc-300">
        <li>
          Weekly violations down{" "}
          <strong className="text-emerald-400">
            {prevTrend - recoveryTrend}
          </strong>{" "}
          ({prevTrend} → {recoveryTrend}) — threat-language cluster cooling at
          Pinnacle Recovery.
        </li>
        <li>
          <strong className="text-white">{vendorGap}</strong> outsourced vendors
          below 75 conduct score · CTL-024b parity at 68% on OBL-024.
        </li>
        <li>
          Repeat-contact volume ({fmt(1964)}/7d) still maps to OBL-030 — route
          FCR root-cause to Head of CX before IO deadline.
        </li>
      </ul>
    </section>
  );
}

function CrossChannelDetectionPanel() {
  const stats = useMemo(() => {
    return CHANNELS.map((ch) => {
      let contacts = 0;
      let signals = 0;
      for (const obl of OBLIGATIONS) {
        const cell = getCoverageCell(obl, ch.key);
        if (cell.status === "NOT_APPLICABLE") continue;
        contacts += cell.contactsAnalysed;
        signals += cell.signalsFound;
      }
      const rate = contacts > 0 ? (signals / contacts) * 100 : 0;
      return { key: ch.key, label: ch.short, contacts, signals, rate };
    }).filter((s) => s.contacts > 0);
  }, []);

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stats}
          layout="vertical"
          margin={{ left: 8, right: 16 }}
        >
          <CartesianGrid
            stroke={COLORS.border}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="label"
            width={72}
            tick={{ fill: COLORS.muted, fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: COLORS.card2,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [
              name === "signals" ? fmt(value) : `${value.toFixed(2)}%`,
              name === "signals" ? "Signals" : "Detection rate",
            ]}
          />
          <Bar dataKey="signals" fill={COLORS.teal} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-[10px] font-semibold text-zinc-500">
        Conduct signals detected across channels · rolling 7 days · 100%
        interaction coverage on voice
      </p>
    </div>
  );
}

function CallReasonsObligationMap() {
  const rows = [...TOP_CALL_REASONS].sort((a, b) => b.volume - a.volume);
  const maxVol = rows[0]?.volume ?? 1;

  return (
    <div className="space-y-2">
      {rows.map((r) => {
        const c = metPctColor(r.metPct);
        return (
          <div
            key={r.reason}
            className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-black text-white">{r.reason}</p>
                <p className="mt-0.5 text-[10px] font-bold text-zinc-500">
                  Maps to {r.obligationId} ·{" "}
                  {OBLIGATION_MET_BY_ID[r.obligationId]?.process ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black tabular-nums text-zinc-300">
                  {fmt(r.volume)}
                </p>
                <p className="text-[10px] font-bold" style={{ color: c }}>
                  {r.metPct}% met
                </p>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-teal-500/80"
                style={{ width: `${(r.volume / maxVol) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-semibold text-zinc-400">
              Top signal: {r.topSignal}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ObligationMetList() {
  const rows = [...OBLIGATION_MET_SUMMARIES].sort(
    (a, b) => a.metPct - b.metPct,
  );

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[900px] border-b border-white/10 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
        style={{
          gridTemplateColumns:
            "90px minmax(200px,1.4fr) minmax(140px,1fr) 80px 1fr",
        }}
      >
        <span>ID</span>
        <span>Obligation</span>
        <span>Process</span>
        <span>Controls</span>
        <span>Met % (Fluid-alone)</span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((o) => {
          const c = metPctColor(o.metPct);
          return (
            <div
              key={o.obligationId}
              className="grid min-w-[900px] items-center gap-2 px-3 py-2.5"
              style={{
                gridTemplateColumns:
                  "90px minmax(200px,1.4fr) minmax(140px,1fr) 80px 1fr",
              }}
            >
              <Pill severity="IN_FORCE">{o.obligationId}</Pill>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-white">
                  {o.obligation}
                </p>
                <p className="text-[10px] font-semibold text-zinc-500">
                  {o.theme}
                </p>
              </div>
              <p className="truncate text-[10px] font-bold text-zinc-400">
                {o.process}
              </p>
              <span className="text-[11px] font-black tabular-nums text-zinc-300">
                {o.fluidAloneControls}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${o.metPct}%`, background: c }}
                  />
                </div>
                <span
                  className="w-10 shrink-0 text-right text-[11px] font-black tabular-nums"
                  style={{ color: c }}
                >
                  {o.metPct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const AGENT_LEADERBOARD: ReadonlyArray<{
  id: string;
  name: string;
  site: string;
  score: number;
  breaches: number;
  topIssue: string;
}> = [
  {
    id: "AG-2041",
    name: "Priya N. · In-house",
    site: "Pune CC",
    score: 94,
    breaches: 1,
    topIssue: "KFS read-out gap",
  },
  {
    id: "AG-1188",
    name: "Rahul K. · In-house",
    site: "Mumbai CC",
    score: 91,
    breaches: 2,
    topIssue: "First-90s SR offer",
  },
  {
    id: "AG-3310",
    name: "Vendor · Pinnacle",
    site: "Outsource",
    score: 68,
    breaches: 14,
    topIssue: "Recovery threat cluster",
  },
  {
    id: "AG-1104",
    name: "Vendor · Helios",
    site: "Outsource",
    score: 72,
    breaches: 9,
    topIssue: "Missed complaint flag",
  },
  {
    id: "AG-2901",
    name: "Anita S. · In-house",
    site: "Chennai CC",
    score: 88,
    breaches: 3,
    topIssue: "Language routing",
  },
];

function AgentVendorLeaderboard() {
  const vendors = [...ALL_VENDORS]
    .sort((a, b) => b.conductScoreOverall - a.conductScoreOverall)
    .slice(0, 4);

  return (
    <div className="space-y-4">
      <div>
        <p className={LABEL_CAPS}>Agents · top & bottom</p>
        <div className="mt-2 space-y-2">
          {AGENT_LEADERBOARD.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-black text-white">
                  {a.name}
                </p>
                <p className="text-[10px] font-semibold text-zinc-500">
                  {a.site} · {a.topIssue}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-[12px] font-black tabular-nums"
                  style={{ color: metPctColor(a.score) }}
                >
                  {a.score}
                </p>
                <p className="text-[10px] font-bold text-zinc-500">
                  {a.breaches}b
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className={LABEL_CAPS}>Vendor BPO</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {vendors.map((v) => (
            <div
              key={v.vendorId}
              className="rounded-xl border border-white/10 bg-black/25 p-2.5"
            >
              <p className="text-[11px] font-black text-white">
                {v.vendorName}
              </p>
              <p className="mt-1 text-[10px] font-bold text-zinc-500">
                Score {v.conductScoreOverall} · {v.complaintRatePer10k}/10k
                complaints
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ViolationTrendChart() {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[...VIOLATION_TREND_WEEKLY]}>
          <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: COLORS.card2,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="violations"
            stroke={COLORS.amber}
            strokeWidth={2}
            dot={false}
            name="Violations"
          />
          <Line
            type="monotone"
            dataKey="breaches"
            stroke={COLORS.red}
            strokeWidth={2}
            dot={false}
            name="Breaches"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LiveConductAlertsFeed() {
  const persona = usePersona();
  const rows = RISK_ALERTS.filter(
    (a) => a.status !== "ACTIONED" && a.status !== "CLOSED",
  )
    .sort((a, b) => {
      const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return rank[a.severity] - rank[b.severity];
    })
    .slice(0, 8);

  return (
    <div className="space-y-2">
      {rows.map((a) => (
        <button
          key={a.alertId}
          type="button"
          onClick={() => persona.openEvidenceDrawer(a.alertId)}
          className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-left transition hover:border-teal-500/40 hover:bg-teal-500/5"
        >
          <SeverityBadge severity={a.severity} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-black text-white">
              {a.alertTitle}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
              {a.obligationId} · {a.alertId}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-zinc-600" aria-hidden />
        </button>
      ))}
    </div>
  );
}

function LocationSnapshotTable() {
  const rows = [...LOCATIONS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[720px] border-b border-white/10 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
        style={{
          gridTemplateColumns:
            "minmax(160px,1.2fr) 90px 90px 90px minmax(140px,1fr)",
        }}
      >
        <span>Location</span>
        <span>Type</span>
        <span>Risk</span>
        <span>Breaches</span>
        <span>Top issue</span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((l) => (
          <div
            key={l.locationId}
            className="grid min-w-[720px] items-center gap-2 px-3 py-2.5"
            style={{
              gridTemplateColumns:
                "minmax(160px,1.2fr) 90px 90px 90px minmax(140px,1fr)",
            }}
          >
            <div>
              <p className="text-[11px] font-black text-white">{l.name}</p>
              <p className="text-[10px] font-semibold text-zinc-500">
                {l.city}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase text-zinc-400">
              {l.type === "IN_SOURCE" ? "In-house" : "Outsource"}
            </span>
            <span
              className="text-[11px] font-black tabular-nums"
              style={{
                color:
                  l.riskScore >= 70
                    ? COLORS.red
                    : l.riskScore >= 50
                      ? COLORS.amber
                      : COLORS.green,
              }}
            >
              {l.riskScore}
            </span>
            <span className="text-[11px] font-bold text-zinc-300">
              {l.breaches}
            </span>
            <p className="truncate text-[10px] font-semibold text-zinc-400">
              {l.topIssue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 1 ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function ObligationCoverageCommandCenter() {
  const contactsAnalysed = OBLIGATIONS.reduce(
    (sum, o) => sum + obligationCoverageSummary(o).contactsAnalysed,
    0,
  );
  const criticalOpen = RISK_ALERTS.filter(
    (a) =>
      a.severity === "CRITICAL" &&
      a.status !== "ACTIONED" &&
      a.status !== "CLOSED",
  ).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ShellCard
          className="xl:col-span-5"
          title="Overall conduct risk"
          subtitle="Composite score from Fluid-alone obligation met % and open breach load"
          accent={COLORS.teal}
          bodyClassName="pt-2"
        >
          <ConductRiskGauge />
        </ShellCard>
        <div className="xl:col-span-7">
          <CoverageAiInsightCard />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Fluid-alone controls"
          value={REGISTER_FLUID_ALONE_COUNT}
          delta="Conversation-verified · no partner feed"
          severity="teal"
          icon={ShieldCheck}
        />
        <KPICard
          label="Obligations in register"
          value={OBLIGATION_MET_SUMMARIES.length}
          delta={`${REGISTER_OVERALL_MET_PCT}% avg met`}
          severity="teal"
          icon={ListChecks}
        />
        <KPICard
          label="Contacts analysed"
          value={fmt(contactsAnalysed)}
          delta="All channels · rolling 7 days"
          severity="teal"
          icon={MessagesSquare}
        />
        <KPICard
          label="Critical alerts open"
          value={criticalOpen}
          delta="Evidence available · one-click review"
          severity={criticalOpen > 0 ? "red" : "green"}
          icon={Siren}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ShellCard
          className="xl:col-span-7"
          title="Cross-channel detection"
          subtitle="Conduct signals surfaced per channel — no drill-down required"
          accent={COLORS.cyan}
        >
          <CrossChannelDetectionPanel />
        </ShellCard>
        <ShellCard
          className="xl:col-span-5"
          title="Why customers are calling"
          subtitle="Inbound drivers mapped to obligation & met %"
          accent={COLORS.purple}
        >
          <CallReasonsObligationMap />
        </ShellCard>
      </div>

      <ShellCard
        title="Obligation met %"
        subtitle="Fluid-alone controls only · from RBI_Obligation_Control_Register.xlsx"
        accent={COLORS.teal}
      >
        <ObligationMetList />
      </ShellCard>

      <div
        className="rounded-2xl border bg-[#0d0d0d] p-4"
        style={{ borderColor: COLORS.border }}
      >
        <p className={LABEL_CAPS}>Top breaches · open evidence</p>
        <p className="mt-0.5 text-[11px] font-bold text-zinc-500">
          Select a card to review transcript evidence
        </p>
        <div className="mt-3">
          <TopBreachesStrip />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 2  ·  OUTBOUND CONDUCT & LOCATION INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────

type OutboundFilters = {
  purposes: ReadonlySet<OutboundPurpose>;
  locationIds: ReadonlySet<string>;
  sourcingTypes: ReadonlySet<LocationType>;
  vendorIds: ReadonlySet<string>;
  conductAreas: ReadonlySet<ConductAreaKey>;
  severities: ReadonlySet<AlertSeverity>;
};

const ALL_SEVERITIES: AlertSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function _defaultOutboundFilters(): OutboundFilters {
  return {
    purposes: new Set<OutboundPurpose>(["SALES", "FEEDBACK", "RECOVERY"]),
    locationIds: new Set<string>(LOCATIONS.map((l) => l.locationId)),
    sourcingTypes: new Set<LocationType>(["IN_SOURCE", "OUTSOURCE"]),
    vendorIds: new Set<string>(ALL_VENDORS.map((v) => v.vendorId)),
    conductAreas: new Set<ConductAreaKey>(CONDUCT_AREAS.map((a) => a.key)),
    severities: new Set<AlertSeverity>(ALL_SEVERITIES),
  };
}

function FilterChipRow<T extends string>({
  label,
  options,
  values,
  onToggle,
  colorFn,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  values: ReadonlySet<T>;
  onToggle: (v: T) => void;
  colorFn?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {options.map((o) => {
        const active = values.has(o.value);
        const accent = colorFn ? colorFn(o.value) : COLORS.teal;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={cx(
              "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide transition",
              active ? "text-white" : "text-zinc-500 hover:text-zinc-300",
            )}
            style={{
              borderColor: active ? accent : "rgba(255,255,255,0.10)",
              background: active ? `${accent}1c` : "transparent",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function _OutboundFiltersBar({
  filters,
  setFilters,
  onReset,
  activeCount,
}: {
  filters: OutboundFilters;
  setFilters: (next: OutboundFilters) => void;
  onReset: () => void;
  activeCount: number;
}) {
  const toggle = <K extends keyof OutboundFilters, V extends string>(
    key: K,
    value: V,
  ) => {
    const current = filters[key] as ReadonlySet<V>;
    const next = new Set<V>(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFilters({ ...filters, [key]: next });
  };

  return (
    <div
      className="rounded-2xl border bg-[#0d0d0d] p-3"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-teal-300" aria-hidden />
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-300">
            Filters
          </span>
          {activeCount > 0 ? (
            <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-teal-200">
              {activeCount} active
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-zinc-300 hover:text-white"
        >
          Reset
        </button>
      </div>
      <div className="mt-3 grid gap-2.5">
        <FilterChipRow
          label="Purpose"
          options={[
            { value: "SALES", label: "Sales" },
            { value: "FEEDBACK", label: "Feedback" },
            { value: "RECOVERY", label: "Recovery" },
          ]}
          values={filters.purposes}
          onToggle={(v) => toggle("purposes", v)}
          colorFn={(v) =>
            v === "SALES"
              ? COLORS.purple
              : v === "RECOVERY"
                ? COLORS.amber
                : COLORS.teal
          }
        />
        <FilterChipRow
          label="Location"
          options={LOCATIONS.map((l) => ({
            value: l.locationId,
            label: l.city,
          }))}
          values={filters.locationIds}
          onToggle={(v) => toggle("locationIds", v)}
        />
        <FilterChipRow
          label="Sourcing"
          options={[
            { value: "IN_SOURCE", label: "In-source" },
            { value: "OUTSOURCE", label: "Outsource" },
          ]}
          values={filters.sourcingTypes}
          onToggle={(v) => toggle("sourcingTypes", v)}
        />
        <FilterChipRow
          label="Vendor"
          options={ALL_VENDORS.filter((v) => v.vendorId !== "VEN-INHOUSE").map(
            (v) => ({
              value: v.vendorId,
              label: v.vendorName.split(" ").slice(0, 2).join(" "),
            }),
          )}
          values={filters.vendorIds}
          onToggle={(v) => toggle("vendorIds", v)}
        />
        <FilterChipRow
          label="Conduct area"
          options={CONDUCT_AREAS.map((a) => ({
            value: a.key,
            label: a.short,
          }))}
          values={filters.conductAreas}
          onToggle={(v) => toggle("conductAreas", v)}
          colorFn={(v) => CONDUCT_AREA_MAP[v as ConductAreaKey].color}
        />
        <FilterChipRow
          label="Severity"
          options={ALL_SEVERITIES.map((s) => ({
            value: s,
            label: s.charAt(0) + s.slice(1).toLowerCase(),
          }))}
          values={filters.severities}
          onToggle={(v) => toggle("severities", v)}
          colorFn={(v) =>
            v === "CRITICAL"
              ? COLORS.red
              : v === "HIGH"
                ? COLORS.amber
                : v === "MEDIUM"
                  ? COLORS.yellow
                  : COLORS.dim
          }
        />
      </div>
    </div>
  );
}

function _OutboundPurposeCards({
  filters,
  onOpenAlert,
}: {
  filters: OutboundFilters;
  onOpenAlert: (alertId: string) => void;
}) {
  const visible = OUTBOUND_PURPOSE_BUCKETS.filter((b) =>
    filters.purposes.has(b.purpose),
  );
  if (visible.length === 0) {
    return (
      <EmptyState message="No outbound purpose selected — toggle a purpose filter above." />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {visible.map((bucket) => {
        const linkAlert = VIOLATIONS.find(
          (v) => v.callPurpose === bucket.purpose,
        )?.linkedAlertId;
        return (
          <div
            key={bucket.purpose}
            className="overflow-hidden rounded-2xl border bg-[#0d0d0d]"
            style={{ borderColor: COLORS.border }}
          >
            <div
              className="flex items-center justify-between gap-2 border-b px-4 py-2.5"
              style={{
                borderColor: `${bucket.color}33`,
                background: `${bucket.color}10`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-lg"
                  style={{
                    background: `${bucket.color}22`,
                    color: bucket.color,
                  }}
                >
                  <bucket.icon className="size-3.5" aria-hidden />
                </span>
                <div>
                  <p
                    className="text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ color: bucket.color }}
                  >
                    {bucket.label}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500">
                    {OUTBOUND_PURPOSE_LABELS[bucket.purpose]}
                  </p>
                </div>
              </div>
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                style={{
                  borderColor: `${bucket.color}55`,
                  color: bucket.color,
                }}
              >
                {bucket.passRate}% pass
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-black/35 p-2">
                  <p className={LABEL_CAPS}>Calls</p>
                  <p className="mt-0.5 text-base font-black tabular-nums text-white">
                    {fmt(bucket.totalCalls)}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/35 p-2">
                  <p className={LABEL_CAPS}>Obligations</p>
                  <p className="mt-0.5 text-base font-black tabular-nums text-white">
                    {bucket.applicableObligations}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/35 p-2">
                  <p className={LABEL_CAPS}>Breaches</p>
                  <p className="mt-0.5 text-base font-black tabular-nums text-red-300">
                    {fmt(bucket.breaches)}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {bucket.signalLines.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-black/35 px-2 py-1.5"
                  >
                    <span className="truncate text-[11px] font-bold text-zinc-200">
                      {l.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={l.severity} />
                      <span className="text-[11px] font-black tabular-nums text-white">
                        {fmt(l.volume)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-black/35 p-2.5">
                <p className={LABEL_CAPS}>Top issue</p>
                <p className="mt-1 text-[12px] font-bold leading-snug text-white">
                  {bucket.topIssue}
                </p>
                <p className="mt-2 text-[11px] font-semibold leading-snug text-zinc-300">
                  <span className="font-black uppercase tracking-wide text-teal-300">
                    Action ·{" "}
                  </span>
                  {bucket.recommendedAction}
                </p>
                {linkAlert ? (
                  <button
                    type="button"
                    onClick={() => onOpenAlert(linkAlert)}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-teal-300 hover:text-teal-200"
                  >
                    Open evidence drawer <ChevronRight className="size-3" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function _LocationConductTable({ filters }: { filters: OutboundFilters }) {
  const rows = LOCATIONS.filter(
    (l) =>
      filters.locationIds.has(l.locationId) &&
      filters.sourcingTypes.has(l.type) &&
      (l.vendorId === null || filters.vendorIds.has(l.vendorId)),
  );
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[1200px] border-b border-white/10 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
        style={{
          gridTemplateColumns:
            "minmax(200px,1.4fr) 90px 130px 100px 100px 90px 80px 80px 90px minmax(180px,1.4fr) 110px 80px",
        }}
      >
        <span>Location</span>
        <span>Type</span>
        <span>Vendor</span>
        <span className="text-right">Calls</span>
        <span>Top purpose</span>
        <span className="text-right">Obls</span>
        <span className="text-right">Breach</span>
        <span className="text-right">Missing</span>
        <span className="text-right">Risk</span>
        <span>Top issue</span>
        <span>Owner</span>
        <span className="text-right">Action</span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No locations match your filters." />
          </div>
        ) : (
          rows.map((l) => {
            const owner = OWNERS_BY_ID[l.ownerId];
            const vendor = l.vendorId
              ? ALL_VENDORS.find((v) => v.vendorId === l.vendorId)
              : null;
            const riskColor =
              l.riskScore >= 60
                ? COLORS.red
                : l.riskScore >= 35
                  ? COLORS.amber
                  : COLORS.green;
            return (
              <div
                key={l.locationId}
                className="grid items-center gap-2 px-3 py-2.5"
                style={{
                  gridTemplateColumns:
                    "minmax(200px,1.4fr) 90px 130px 100px 100px 90px 80px 80px 90px minmax(180px,1.4fr) 110px 80px",
                }}
              >
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-black text-white">
                    {l.name}
                  </p>
                  <p className="text-[10px] font-semibold text-zinc-500">
                    {l.city} · {fmt(l.agents)} agents
                  </p>
                </div>
                <span
                  className={cx(
                    "rounded-full border px-2 py-0.5 text-center text-[10px] font-black uppercase tracking-wide",
                    l.type === "IN_SOURCE"
                      ? "border-teal-500/40 bg-teal-500/10 text-teal-200"
                      : "border-purple-400/40 bg-purple-400/10 text-purple-200",
                  )}
                >
                  {l.type === "IN_SOURCE" ? "In-house" : "Vendor"}
                </span>
                <span className="truncate text-[11px] font-bold text-zinc-200">
                  {vendor?.vendorName ?? "—"}
                </span>
                <span className="text-right text-[12px] font-black tabular-nums text-white">
                  {fmt(l.callsAnalysed)}
                </span>
                <span className="text-[11px] font-bold text-zinc-200">
                  {OUTBOUND_PURPOSE_LABELS[l.topPurpose]}
                </span>
                <span className="text-right text-[12px] font-black tabular-nums text-white">
                  {l.obligationsApplicable}
                </span>
                <span className="text-right text-[12px] font-black tabular-nums text-red-300">
                  {l.breaches}
                </span>
                <span className="text-right text-[12px] font-black tabular-nums text-amber-300">
                  {l.missingDataCells}
                </span>
                <span
                  className="text-right text-[12px] font-black tabular-nums"
                  style={{ color: riskColor }}
                >
                  {l.riskScore}
                </span>
                <span className="truncate text-[11px] font-semibold text-zinc-200">
                  {l.topIssue}
                </span>
                <span className="truncate text-[10px] font-bold text-zinc-300">
                  {owner?.roleTitle ?? "—"}
                </span>
                <span className="text-right text-[10px] font-black uppercase tracking-wide text-teal-300">
                  Review
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function _LocationObligationHeatmap({ filters }: { filters: OutboundFilters }) {
  const rows = LOCATIONS.filter(
    (l) =>
      filters.locationIds.has(l.locationId) &&
      filters.sourcingTypes.has(l.type) &&
      (l.vendorId === null || filters.vendorIds.has(l.vendorId)),
  );
  const cols = HEATMAP_AREA_COLS.filter((k) => filters.conductAreas.has(k));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-[210px] px-2 py-1.5 text-left text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
              Location
            </th>
            {cols.map((c) => {
              const area = CONDUCT_AREA_MAP[c];
              return (
                <th
                  key={c}
                  className="px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.14em]"
                  style={{ color: area.color }}
                >
                  {area.short}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length + 1} className="px-2 py-4">
                <EmptyState message="No locations match your filters." />
              </td>
            </tr>
          ) : (
            rows.map((l) => {
              const cellRow = HEATMAP_DATA[l.locationId] ?? {};
              return (
                <tr key={l.locationId}>
                  <td className="rounded-md bg-black/35 px-2 py-2">
                    <p className="text-[11px] font-black text-white">
                      {l.name}
                    </p>
                    <p className="text-[10px] font-semibold text-zinc-500">
                      {l.city}
                    </p>
                  </td>
                  {cols.map((c) => {
                    const cell = cellRow[c];
                    if (!cell) {
                      return (
                        <td
                          key={c}
                          className="rounded-md bg-zinc-900/30 px-2 py-2 text-center text-[10px] font-bold text-zinc-600"
                          title="No data"
                        >
                          —
                        </td>
                      );
                    }
                    const meta = HEATMAP_STATUS_META[cell.status];
                    return (
                      <td
                        key={c}
                        className="rounded-md px-2 py-2 text-center"
                        style={{
                          background: `${meta.color}1c`,
                          border: `1px solid ${meta.color}55`,
                        }}
                        title={`${l.name} · ${CONDUCT_AREA_MAP[c].name}\n${fmt(cell.volume)} contacts · ${cell.breaches} breaches\nTop: ${cell.topSignal}`}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-wide"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-300">
                          {fmt(cell.volume)} · {cell.breaches}b
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function _VendorScorecardGrid({ filters }: { filters: OutboundFilters }) {
  const vendors = ALL_VENDORS.filter(
    (v) => v.vendorId === "VEN-INHOUSE" || filters.vendorIds.has(v.vendorId),
  );
  if (vendors.length === 0) {
    return <EmptyState message="No vendors match your filters." />;
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {vendors.map((v) => (
        <VendorScorecard key={v.vendorId} vendor={v} />
      ))}
    </div>
  );
}

function _ViolationFeed({
  filters,
  onOpenViolation,
}: {
  filters: OutboundFilters;
  onOpenViolation: (alertId: string) => void;
}) {
  const rows = VIOLATIONS.filter((v) => {
    if (!filters.purposes.has(v.callPurpose)) return false;
    if (!filters.locationIds.has(v.locationId)) return false;
    if (!filters.severities.has(v.severity)) return false;
    const loc = LOCATIONS_BY_ID[v.locationId];
    if (loc && !filters.sourcingTypes.has(loc.type)) return false;
    if (loc?.vendorId && !filters.vendorIds.has(loc.vendorId)) return false;
    const obl = OBLIGATIONS_BY_ID[v.obligationId];
    if (obl) {
      const area = getConductArea(obl);
      if (!filters.conductAreas.has(area)) return false;
    }
    return true;
  });
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[1200px] border-b border-white/10 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
        style={{
          gridTemplateColumns:
            "140px minmax(180px,1.2fr) minmax(160px,1.1fr) 110px 110px minmax(220px,1.6fr) 90px 110px 90px",
        }}
      >
        <span>Timestamp</span>
        <span>Location</span>
        <span>Agent / Vendor</span>
        <span>Purpose</span>
        <span>Obligation</span>
        <span>Detected signal</span>
        <span>Severity</span>
        <span>Evidence</span>
        <span className="text-right">Action</span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No violations match your filters." />
          </div>
        ) : (
          rows.map((v) => {
            const loc = LOCATIONS_BY_ID[v.locationId];
            return (
              <button
                key={v.violationId}
                type="button"
                onClick={() => onOpenViolation(v.linkedAlertId)}
                className="grid w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04] focus:bg-white/[0.06] focus:outline-none"
                style={{
                  gridTemplateColumns:
                    "140px minmax(180px,1.2fr) minmax(160px,1.1fr) 110px 110px minmax(220px,1.6fr) 90px 110px 90px",
                }}
              >
                <span className="text-[10px] font-bold text-zinc-300">
                  {new Date(v.timestamp).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-black text-white">
                    {loc?.name ?? v.locationId}
                  </p>
                  <p className="text-[10px] font-semibold text-zinc-500">
                    {loc?.city ?? "—"}
                  </p>
                </div>
                <span className="truncate text-[11px] font-bold text-zinc-200">
                  {v.agentOrVendor}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-center text-[10px] font-black uppercase tracking-wide"
                  style={{
                    borderColor:
                      v.callPurpose === "SALES"
                        ? `${COLORS.purple}55`
                        : v.callPurpose === "RECOVERY"
                          ? `${COLORS.amber}55`
                          : `${COLORS.teal}55`,
                    color:
                      v.callPurpose === "SALES"
                        ? COLORS.purple
                        : v.callPurpose === "RECOVERY"
                          ? COLORS.amber
                          : COLORS.teal,
                  }}
                >
                  {OUTBOUND_PURPOSE_LABELS[v.callPurpose]}
                </span>
                <Pill severity="IN_FORCE">{v.obligationId}</Pill>
                <p className="truncate text-[11px] font-bold text-zinc-200">
                  {v.detectedSignal}
                </p>
                <SeverityBadge severity={v.severity} />
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-teal-300">
                  <Link2 className="size-3" aria-hidden /> {v.linkedAlertId}
                </span>
                <span className="text-right text-[10px] font-black uppercase tracking-wide text-teal-300">
                  Open
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function ConductOperationsScreen() {
  const openAlerts = RISK_ALERTS.filter(
    (a) => a.status !== "ACTIONED" && a.status !== "CLOSED",
  ).length;
  const locationsAtRisk = LOCATIONS.filter((l) => l.riskScore >= 50).length;
  const vendorsUnder = ALL_VENDORS.filter(
    (v) => v.vendorId !== "VEN-INHOUSE" && v.conductScoreOverall < 75,
  ).length;
  const outboundCalls = OUTBOUND_PURPOSE_BUCKETS.reduce(
    (s, b) => s + b.totalCalls,
    0,
  );
  const weeklyViolations = VIOLATION_TREND_WEEKLY.at(-1)?.violations ?? 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-12">
        <div className="col-span-2 grid grid-cols-2 gap-3 md:col-span-4 xl:col-span-4">
          <KPICard
            label="Live alerts open"
            value={openAlerts}
            delta="Click any row below for evidence"
            severity={openAlerts > 4 ? "red" : "amber"}
            icon={Siren}
          />
          <KPICard
            label="Locations at risk"
            value={locationsAtRisk}
            delta="Risk score ≥ 50"
            severity={locationsAtRisk > 0 ? "amber" : "green"}
            icon={Target}
          />
          <KPICard
            label="Outbound analysed"
            value={fmt(outboundCalls)}
            delta="Sales · Feedback · Recovery"
            severity="teal"
            icon={Phone}
          />
          <KPICard
            label="Weekly violations"
            value={weeklyViolations}
            delta={`${vendorsUnder} vendors below threshold`}
            severity={weeklyViolations > 40 ? "red" : "amber"}
            icon={Radar}
          />
        </div>
        <div className="col-span-2 xl:col-span-8">
          <OperationsAiInsightCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ShellCard
          title="Top reasons customers call"
          subtitle="Volume drivers mapped to obligation & control met %"
          accent={COLORS.purple}
        >
          <CallReasonsObligationMap />
        </ShellCard>
        <ShellCard
          title="Violation trend"
          subtitle="7-week rolling · violations vs confirmed breaches"
          accent={COLORS.amber}
        >
          <ViolationTrendChart />
        </ShellCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ShellCard
          title="Agent & vendor conduct leaderboard"
          subtitle="In-house vs outsource · score and weekly breaches"
          accent={COLORS.teal}
        >
          <AgentVendorLeaderboard />
        </ShellCard>
        <ShellCard
          title="Live conduct alerts"
          subtitle="Open queue · severity sorted · evidence on click"
          accent={COLORS.red}
        >
          <LiveConductAlertsFeed />
        </ShellCard>
      </div>

      <ShellCard
        title="Contact centre snapshot"
        subtitle="Highest-risk sites · no filters — full network view"
        accent={COLORS.cyan}
      >
        <LocationSnapshotTable />
      </ShellCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  TOP NAV · MODULE TABS · PERSONA SWITCHER
// ─────────────────────────────────────────────────────────────────────────────

const MODULE_TABS: ReadonlyArray<{
  key: RbiTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}> = [
  {
    key: "coverage",
    label: "Obligation Coverage Command Center",
    sublabel: "Risk score · obligation met % · cross-channel · call drivers",
    icon: ShieldCheck,
  },
  {
    key: "operations",
    label: "Conduct Operations",
    sublabel: "Call reasons · leaderboard · violations · live alerts",
    icon: Headphones,
  },
];

function ModuleTabs() {
  const persona = usePersona();
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-[#0d0d0d]"
      style={{ borderColor: COLORS.border }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {MODULE_TABS.map((t) => {
          const active = persona.activeTab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => persona.setActiveTab(t.key)}
              className={cx(
                "flex items-center gap-3 border-b px-5 py-3 text-left transition md:border-b-0 md:border-r last:md:border-r-0",
                active
                  ? "bg-teal-500/10 text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
              )}
              style={{
                borderColor: active ? `${COLORS.teal}55` : COLORS.border,
                boxShadow: active
                  ? `inset 0 -3px 0 0 ${COLORS.teal}`
                  : undefined,
              }}
              aria-pressed={active}
            >
              <span
                className="grid size-9 place-items-center rounded-xl"
                style={{
                  background: active
                    ? `${COLORS.teal}22`
                    : "rgba(255,255,255,0.04)",
                  color: active ? COLORS.teal : COLORS.muted,
                }}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p
                  className={cx(
                    "text-[10px] font-black uppercase tracking-[0.14em]",
                    active ? "text-teal-300" : "text-zinc-500",
                  )}
                >
                  {active ? "Active" : "Open"}
                </p>
                <p className="truncate text-[13px] font-black text-white">
                  {t.label}
                </p>
                <p className="truncate text-[10px] font-semibold text-zinc-500">
                  {t.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PersonaSwitcher() {
  const persona = usePersona();
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
      {PERSONAS.map((p) => {
        const active = persona.activePersonaId === p.personaId;
        return (
          <button
            key={p.personaId}
            type="button"
            onClick={() => persona.setActivePersonaId(p.personaId)}
            className={cx(
              "rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide transition",
              active
                ? "bg-teal-500/25 text-teal-100 ring-1 ring-teal-500/50"
                : "text-zinc-400 hover:text-white",
            )}
            title={p.realWorldTitle}
          >
            {p.personaId} · {p.displayName}
          </button>
        );
      })}
    </div>
  );
}

function RbiScreenSwitch() {
  const persona = usePersona();
  switch (persona.activeTab) {
    case "coverage":
      return <ObligationCoverageCommandCenter />;
    case "operations":
      return <ConductOperationsScreen />;
    default:
      return <ObligationCoverageCommandCenter />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT — RbiConductIntelligenceDashboard
// ─────────────────────────────────────────────────────────────────────────────

const RBI_FALLBACK_THEME: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#070707",
  surface: "#121212",
  card: "#0d0d0d",
  elevated: "#1a1a1a",
  border: "#242424",
  borderLight: "#3a3a3a",
};

export type RbiConductIntelligenceDashboardProps = {
  industryName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

export function RbiConductIntelligenceDashboard({
  industryName: _industryName,
  industryColor,
  onExit,
  theme,
}: RbiConductIntelligenceDashboardProps) {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("L4");
  const [activeTab, setActiveTab] = useState<RbiTab>("coverage");
  const [drawerAlertId, setDrawerAlertId] = useState<string | null>(null);
  const [drawerObligationId, setDrawerObligationId] = useState<string | null>(
    null,
  );

  const value: RbiContextValue = useMemo(
    () => ({
      activePersonaId,
      setActivePersonaId,
      activeTab,
      setActiveTab,
      drawerAlertId,
      drawerObligationId,
      openEvidenceDrawer: (id: string) => {
        setDrawerObligationId(null);
        setDrawerAlertId(id);
      },
      openObligationDrawer: (id: string) => {
        setDrawerAlertId(null);
        setDrawerObligationId(id);
      },
      closeDrawer: () => {
        setDrawerAlertId(null);
        setDrawerObligationId(null);
      },
    }),
    [activePersonaId, activeTab, drawerAlertId, drawerObligationId],
  );

  return (
    <DashboardThemeProvider value={theme ?? RBI_FALLBACK_THEME}>
      <PersonaContext.Provider value={value}>
        <div className="min-h-screen w-full min-w-0 bg-[#070707] text-white">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_32%)]" />

          <main className="relative w-full min-w-0">
            <header
              className="sticky top-0 z-30 w-full border-b bg-[#070707]/95 backdrop-blur"
              style={{ borderColor: COLORS.border }}
            >
              <div className="mx-auto flex w-full max-w-[1880px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onExit}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] py-2 pr-3 pl-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: industryColor,
                    }}
                  >
                    <ArrowLeft className="size-4 shrink-0" aria-hidden />
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-10 place-items-center rounded-2xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.indigo})`,
                      }}
                    >
                      <Shield className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-300">
                        Fluid CX · add-on
                      </p>
                      <h1
                        className={cx(
                          rbiHeadlineFont.className,
                          "text-xl font-bold leading-tight text-white sm:text-2xl",
                        )}
                      >
                        RBI Conduct Intelligence
                      </h1>
                      <p className="text-[11px] font-semibold text-zinc-400">
                        Suvarna Bank · post-Nov 2025 RBI rulebook · today{" "}
                        {TODAY_ISO}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 md:flex">
                    <Activity className="size-3.5 text-teal-300" aria-hidden />
                    <span className="text-[10px] font-black uppercase tracking-wide text-zinc-400">
                      Last analysed · 42,318 interactions · 100% coverage
                    </span>
                  </div>
                  <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 md:flex">
                    <Languages className="size-3.5 text-teal-300" aria-hidden />
                    <span className="text-[10px] font-black uppercase tracking-wide text-zinc-400">
                      en · hi · ta · te · kn · mr
                    </span>
                  </div>
                  <PersonaSwitcher />
                </div>
              </div>
              <div className="mx-auto w-full max-w-[1880px] px-4 pb-3">
                <ModuleTabs />
              </div>
            </header>

            <div className="mx-auto w-full max-w-[1880px] px-4 py-5">
              <RbiScreenSwitch />
            </div>
          </main>

          <EvidenceDrawer />
        </div>
      </PersonaContext.Provider>
    </DashboardThemeProvider>
  );
}

export default RbiConductIntelligenceDashboard;
