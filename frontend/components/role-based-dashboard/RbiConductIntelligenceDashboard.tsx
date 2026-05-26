"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Award,
  Briefcase,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Filter,
  Flag,
  Gavel,
  Globe,
  Heart,
  Info,
  Languages,
  Layers,
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
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
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
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

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

function relativeAge(isoDate: string, today = TODAY_ISO): string {
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

type ScreenKey =
  | "S0"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9"
  | "S10"
  | "S11"
  | "S12";

type PersonaContextValue = {
  activePersonaId: PersonaId;
  setActivePersonaId: (id: PersonaId) => void;
  activeScreen: ScreenKey;
  setActiveScreen: (s: ScreenKey) => void;
  selectedObligationId: string | null;
  setSelectedObligationId: (id: string | null) => void;
  drawerAlertId: string | null;
  openDrawer: (alertId: string) => void;
  closeDrawer: () => void;
  navigate: (s: ScreenKey, oblId?: string | null) => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

function usePersona(): PersonaContextValue {
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
      "Push the 47 detected complaints to CMS as proposed SRs for Head of CX approval before EOD.",
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
    alertId: "ALT-3314",
    alertTitle: "Dark-pattern audit pending — partner workflow (OUT_OF_SCOPE)",
    obligationId: "OBL-032",
    themeId: "THM-04",
    severity: "LOW",
    signalIds: [],
    affectedAgentIds: [],
    affectedVendorIds: [],
    firstObservedTs: "2026-04-01T00:00:00+05:30",
    lastObservedTs: "2026-05-20T00:00:00+05:30",
    occurrenceCount: 0,
    routedToOwnerId: "OWN-AUDIT01",
    status: "CLOSED",
    recommendedAction:
      "Outside Fluid CX scope — refer to Digital & Design team's quarterly audit tool.",
    boardPackInclusion: false,
    evidenceIds: [],
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
  benchmarkVsInhouse: "BETTER" | "PARITY" | "WORSE";
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
    benchmarkVsInhouse: "BETTER",
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

const RCA_CLUSTERS: readonly RCACluster[] = [
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

const RECOVERY_SIGNALS: readonly RecoveryConductSignal[] = [
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

const COMPLAINT_SIGNALS: readonly ComplaintCaptureSignal[] = [
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

const REPEAT_PATTERNS: readonly RepeatContactPattern[] = [
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

const INBOUND_QUEUE_SIGNALS: readonly InboundQueueSignal[] = [
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

const HORIZON: readonly HorizonMilestone[] = [
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

function severitySurface(severity: string): {
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
    color = COLORS.dim;
    body = "Passed";
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

function AIInsightCard({
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
            onClick={() =>
              alert("Recording player connects via Fluid CX integration.")
            }
            className="rounded-md border border-teal-500/40 bg-teal-500/15 px-2 py-0.5 font-black uppercase tracking-wide text-teal-200 hover:bg-teal-500/25"
          >
            Play clip
          </button>
        </div>
      </div>
    </div>
  );
}

function RCAClusterCard({
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
        : COLORS.red;
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
          {bm.toLowerCase()} vs in-house
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
          </section>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S0 — PERSONA-AWARE LANDING
// ─────────────────────────────────────────────────────────────────────────────

function HorizonBand() {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-[#0d0d0d]"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Radar className="size-4 text-teal-300" aria-hidden />
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-300">
            Regulatory horizon · Suvarna Bank · today {TODAY_ISO}
          </p>
        </div>
        <p className="text-[10px] font-semibold text-zinc-500">
          ~42,318 interactions analysed yesterday · 100% coverage
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 py-3">
        {HORIZON.map((m) => {
          const d = daysUntil(m.isoDate);
          const color =
            d < 0
              ? COLORS.dim
              : d <= 60
                ? COLORS.red
                : d <= 180
                  ? COLORS.amber
                  : COLORS.blue;
          return (
            <div
              key={m.isoDate}
              className="min-w-[180px] shrink-0 rounded-xl border bg-black/35 p-3"
              style={{ borderColor: `${color}55` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.14em]"
                  style={{ color }}
                >
                  {d < 0 ? "Passed" : `${d}d`}
                </span>
                <span className="text-[10px] font-bold text-zinc-500">
                  {new Date(m.isoDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-1 text-[12px] font-black leading-snug text-white">
                {m.label}
              </p>
              <p className="mt-1 text-[10px] font-bold text-zinc-500">
                {m.linkedObligationIds.length} linked obligations
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function S0Landing() {
  const persona = usePersona();
  const activePersona =
    PERSONAS.find((p) => p.personaId === persona.activePersonaId) ??
    PERSONAS[2];

  const openCriticals = RISK_ALERTS.filter(
    (a) => a.status === "OPEN" && a.severity === "CRITICAL",
  ).length;
  const ioPending = RISK_ALERTS.filter(
    (a) => a.status === "ESCALATED_TO_IO",
  ).length;
  const deadlinesUnder60 = HORIZON.filter((m) => {
    const d = daysUntil(m.isoDate);
    return d >= 0 && d <= 60;
  }).length;
  const vendorLow = VENDORS.filter(
    (v) => v.vendorId !== "VEN-INHOUSE" && v.conductScoreOverall < 75,
  ).length;

  const myQueue = RISK_ALERTS.filter((a) => a.status === "OPEN")
    .sort((x, y) => {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
      return order[x.severity] - order[y.severity];
    })
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <HorizonBand />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-teal-300">
            Persona · {activePersona.realWorldTitle}
          </p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-white">
            {activePersona.pulseQuestion}
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-zinc-400">
            {activePersona.primaryLens}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Interactions analysed today"
          value="42,318"
          delta="100% coverage · sample baseline was 3–5%"
          severity="teal"
          icon={MessagesSquare}
        />
        <KPICard
          label="Open critical alerts"
          value={openCriticals}
          delta={`${RISK_ALERTS.filter((a) => a.severity === "HIGH" && a.status === "OPEN").length} High · ${deadlinesUnder60} deadlines < 60d`}
          severity={openCriticals > 0 ? "red" : "green"}
          icon={Siren}
          onClick={() => persona.navigate("S1")}
        />
        <KPICard
          label="RB-IOS exposure · cases at risk"
          value={
            RISK_ALERTS.filter(
              (a) => a.boardPackInclusion && a.status === "OPEN",
            ).length
          }
          delta="Tooltip: ₹30 lakh consequential-loss cap under RB-IOS"
          severity="amber"
          icon={Scale}
        />
        <KPICard
          label="Vendor low-scores"
          value={vendorLow}
          delta={`${ioPending} cases escalated to Internal Ombudsman`}
          severity={vendorLow > 0 ? "amber" : "green"}
          icon={Briefcase}
          onClick={() => persona.navigate("S7")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="My queue today"
            subtitle={`Top 5 open alerts routed to ${activePersona.realWorldTitle}`}
            accent={COLORS.red}
            actions={
              <button
                type="button"
                onClick={() => persona.navigate("S1")}
                className="rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-200 hover:bg-white/[0.12]"
              >
                Open full worklist{" "}
                <ChevronRight className="ml-1 inline size-3" aria-hidden />
              </button>
            }
          >
            <div className="space-y-2">
              {myQueue.map((a) => {
                const obl = OBLIGATIONS_BY_ID[a.obligationId];
                const surf = severitySurface(a.severity);
                return (
                  <button
                    key={a.alertId}
                    type="button"
                    onClick={() => persona.openDrawer(a.alertId)}
                    className={cx(surf.className, "w-full text-left")}
                    style={surf.style}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <SeverityBadge severity={a.severity} />
                          <Pill severity={a.status}>
                            {a.status.replace(/_/g, " ")}
                          </Pill>
                          {obl ? (
                            <ComplianceLabelBadge buildTier={obl.buildTier} />
                          ) : null}
                        </div>
                        <p className="mt-1.5 text-sm font-black leading-snug text-white">
                          {a.alertTitle}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-zinc-400">
                          {a.obligationId} ·{" "}
                          {THEMES_BY_ID[a.themeId]?.themeName} ·{" "}
                          {relativeAge(a.firstObservedTs)} ·{" "}
                          {fmt(a.occurrenceCount)} occurrences
                        </p>
                      </div>
                      <ChevronRight
                        className="size-4 text-zinc-500"
                        aria-hidden
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </ShellCard>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <AIInsightCard
            headline="Recovery harassment hardening in Pinnacle (VEN-014)"
            detail="9 calls / 4 agents / 4 days with threat + shaming pattern. Crosses RB-IOS exposure threshold by 1 Jul 2026."
            taxonomy={["Threat language", "Public shaming", "Vendor pattern"]}
            actionLabel="Go to vendor governance"
            onAction={() => persona.navigate("S7")}
          />
          <AIInsightCard
            headline="Bundling pressure rising — Salary-A/c × ULIP"
            detail="28 signals + 4 chats use compulsory-bundling phrasing on optional ULIP. Halt Script Variant A is the recommended next action."
            taxonomy={["Bundling pressure", "Consent extraction", "Cross-sell"]}
            actionLabel="Go to bundling hub"
            onAction={() => persona.navigate("S9")}
          />

          <ShellCard
            title="Conduct theme pulse"
            subtitle="This-week exception count and trend"
            accent={COLORS.indigo}
          >
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => {
                const trendColor =
                  t.trend === "RISING"
                    ? COLORS.red
                    : t.trend === "FALLING"
                      ? COLORS.green
                      : COLORS.dim;
                const TrendIcon =
                  t.trend === "RISING"
                    ? TrendingUp
                    : t.trend === "FALLING"
                      ? TrendingDown
                      : Minus;
                return (
                  <button
                    key={t.themeId}
                    type="button"
                    onClick={() => persona.navigate("S2")}
                    className="rounded-xl border border-white/10 bg-black/35 p-3 text-left transition hover:border-white/25"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
                        {t.themeId}
                      </p>
                      <TrendIcon
                        className="size-3.5"
                        style={{ color: trendColor }}
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1.5 text-[12px] font-black leading-snug text-white">
                      {t.themeName}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold tabular-nums text-zinc-300">
                      {fmt(t.weeklyExceptions)} exceptions
                    </p>
                  </button>
                );
              })}
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S1 — WORKLIST
// ─────────────────────────────────────────────────────────────────────────────

type WorklistFilters = {
  severities: Set<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">;
  statuses: Set<
    "OPEN" | "IN_REVIEW" | "ACTIONED" | "CLOSED" | "ESCALATED_TO_IO"
  >;
  themeIds: Set<string>;
};

function S1Worklist() {
  const persona = usePersona();
  const [filters, setFilters] = useState<WorklistFilters>(() => ({
    severities: new Set(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
    statuses: new Set(["OPEN", "IN_REVIEW", "ESCALATED_TO_IO"]),
    themeIds: new Set(THEMES.map((t) => t.themeId)),
  }));

  const filtered = useMemo(() => {
    return RISK_ALERTS.filter(
      (a) =>
        filters.severities.has(a.severity) &&
        filters.statuses.has(a.status) &&
        filters.themeIds.has(a.themeId),
    ).sort((x, y) => {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
      const sev = order[x.severity] - order[y.severity];
      if (sev !== 0) return sev;
      return (
        new Date(x.firstObservedTs).getTime() -
        new Date(y.firstObservedTs).getTime()
      );
    });
  }, [filters]);

  function toggleSet<T>(s: Set<T>, value: T): Set<T> {
    const next = new Set(s);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  const criticalOpen = RISK_ALERTS.filter(
    (a) => a.severity === "CRITICAL" && a.status === "OPEN",
  ).length;
  const highOpen = RISK_ALERTS.filter(
    (a) => a.severity === "HIGH" && a.status === "OPEN",
  ).length;
  const actionedToday = RISK_ALERTS.filter(
    (a) => a.status === "ACTIONED",
  ).length;
  const ioEscalated = RISK_ALERTS.filter(
    (a) => a.status === "ESCALATED_TO_IO",
  ).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Critical · open"
          value={criticalOpen}
          severity="red"
          icon={Siren}
        />
        <KPICard
          label="High · open"
          value={highOpen}
          severity="amber"
          icon={AlertTriangle}
        />
        <KPICard
          label="Actioned"
          value={actionedToday}
          severity="green"
          icon={ShieldCheck}
        />
        <KPICard
          label="Escalated · IO"
          value={ioEscalated}
          severity="neutral"
          icon={Gavel}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <ShellCard
            title="My worklist"
            subtitle={`${filtered.length} of ${RISK_ALERTS.length} alerts · severity DESC · click any row to open evidence drawer`}
            accent={COLORS.red}
          >
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-[80px_minmax(0,1fr)_120px_140px_90px_90px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
                <span>Severity</span>
                <span>Alert</span>
                <span>Obligation</span>
                <span>Status</span>
                <span>First seen</span>
                <span className="text-right">Occurrences</span>
              </div>
              <div className="divide-y divide-white/5">
                {filtered.map((a) => {
                  const obl = OBLIGATIONS_BY_ID[a.obligationId];
                  return (
                    <button
                      key={a.alertId}
                      type="button"
                      onClick={() => persona.openDrawer(a.alertId)}
                      className="grid w-full grid-cols-[80px_minmax(0,1fr)_120px_140px_90px_90px] items-start gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04]"
                    >
                      <SeverityBadge severity={a.severity} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-white">
                          {a.alertTitle}
                        </p>
                        <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
                          {THEMES_BY_ID[a.themeId]?.themeName} ·{" "}
                          {OWNERS_BY_ID[a.routedToOwnerId]?.roleTitle}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Pill severity="IN_FORCE">{a.obligationId}</Pill>
                        {obl ? (
                          <ComplianceLabelBadge buildTier={obl.buildTier} />
                        ) : null}
                      </div>
                      <StatusBadge status={a.status} />
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {relativeAge(a.firstObservedTs)}
                      </span>
                      <span className="text-right text-[11px] font-black tabular-nums text-white">
                        {fmt(a.occurrenceCount)}
                      </span>
                    </button>
                  );
                })}
                {filtered.length === 0 ? (
                  <div className="px-3 py-6">
                    <EmptyState message="No alerts match your filters. Adjust the filter panel or check back after the next analysis run." />
                  </div>
                ) : null}
              </div>
            </div>
          </ShellCard>
        </div>

        <div className="xl:col-span-3">
          <ShellCard
            title="Filters"
            subtitle="Persona switcher does not change screen — it re-filters"
            accent={COLORS.teal}
          >
            <div className="space-y-3">
              <div>
                <p className={LABEL_CAPS}>Severity</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          severities: toggleSet(f.severities, s),
                        }))
                      }
                      className={cx(
                        "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
                        filters.severities.has(s)
                          ? "border-teal-500/50 bg-teal-500/15 text-teal-100"
                          : "border-white/10 bg-black/40 text-zinc-500",
                      )}
                    >
                      {s.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={LABEL_CAPS}>Status</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(
                    [
                      "OPEN",
                      "IN_REVIEW",
                      "ACTIONED",
                      "CLOSED",
                      "ESCALATED_TO_IO",
                    ] as const
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          statuses: toggleSet(f.statuses, s),
                        }))
                      }
                      className={cx(
                        "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
                        filters.statuses.has(s)
                          ? "border-teal-500/50 bg-teal-500/15 text-teal-100"
                          : "border-white/10 bg-black/40 text-zinc-500",
                      )}
                    >
                      {s.replace(/_/g, " ").toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={LABEL_CAPS}>Conduct theme</p>
                <div className="mt-2 space-y-1">
                  {THEMES.map((t) => {
                    const on = filters.themeIds.has(t.themeId);
                    return (
                      <label
                        key={t.themeId}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5"
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setFilters((f) => ({
                              ...f,
                              themeIds: toggleSet(f.themeIds, t.themeId),
                            }))
                          }
                          className="accent-teal-500"
                        />
                        <span className="text-[11px] font-semibold text-zinc-200">
                          {t.themeName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S2 — CONDUCT THEMES INDEX
// ─────────────────────────────────────────────────────────────────────────────

function S2ThemesIndex() {
  const persona = usePersona();
  const [drilledTheme, setDrilledTheme] = useState<string | null>(null);
  const [horizonExpanded, setHorizonExpanded] = useState(true);

  const themesWithCritical = THEMES.filter((t) =>
    RISK_ALERTS.some(
      (a) =>
        a.themeId === t.themeId &&
        a.severity === "CRITICAL" &&
        a.status === "OPEN",
    ),
  ).length;

  const monitoredMain = OBLIGATIONS.filter(
    (o) => o.buildTier === "MAIN_FEATURE",
  ).length;

  const nextDeadline = HORIZON.map((m) => ({ m, d: daysUntil(m.isoDate) }))
    .filter((x) => x.d >= 0)
    .sort((a, b) => a.d - b.d)[0];

  const drilledObligations = drilledTheme
    ? OBLIGATIONS.filter((o) => o.themeId === drilledTheme)
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KPICard
          label="Themes with critical exceptions"
          value={themesWithCritical}
          severity={themesWithCritical > 0 ? "red" : "green"}
          icon={ShieldAlert}
        />
        <KPICard
          label="Obligations monitored by Fluid CX"
          value={`${monitoredMain} of ${OBLIGATIONS.length}`}
          delta="Remaining sit on Honest-Gap shelf (S12)"
          severity="teal"
          icon={ShieldCheck}
        />
        <KPICard
          label="Next hard deadline"
          value={
            nextDeadline
              ? new Date(nextDeadline.m.isoDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })
              : "—"
          }
          delta={
            nextDeadline
              ? `${nextDeadline.m.label} · ${nextDeadline.d}d remaining`
              : "—"
          }
          severity={nextDeadline && nextDeadline.d <= 60 ? "red" : "amber"}
          icon={Target}
        />
      </div>

      <ShellCard
        title={
          drilledTheme
            ? `Conduct themes › ${THEMES_BY_ID[drilledTheme]?.themeName}`
            : "Conduct themes index"
        }
        subtitle="Theme-level navigation hub · click any tile to drill into obligation list"
        accent={COLORS.indigo}
        actions={
          drilledTheme ? (
            <button
              type="button"
              onClick={() => setDrilledTheme(null)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-200 hover:bg-white/[0.12]"
            >
              <ArrowLeft className="size-3" aria-hidden /> Back to themes
            </button>
          ) : null
        }
      >
        {drilledTheme && drilledObligations.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-[110px_minmax(0,1fr)_120px_220px_120px_140px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
              <span>OBL</span>
              <span>Statement</span>
              <span>Status</span>
              <span>Coverage</span>
              <span>Exceptions</span>
              <span>Deadline</span>
            </div>
            <div className="divide-y divide-white/5">
              {drilledObligations.map((o) => (
                <button
                  key={o.oblId}
                  type="button"
                  onClick={() => persona.navigate("S3", o.oblId)}
                  className="grid w-full grid-cols-[110px_minmax(0,1fr)_120px_220px_120px_140px] items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04]"
                >
                  <Pill severity="IN_FORCE">{o.oblId}</Pill>
                  <p className="line-clamp-2 text-[12px] font-bold text-zinc-200">
                    {o.statement}
                  </p>
                  <Pill
                    severity={
                      o.status === "IN_FORCE" ? "IN_FORCE" : "DRAFT_PROPOSED"
                    }
                  >
                    {o.status === "IN_FORCE" ? "In force" : "Draft · proposed"}
                  </Pill>
                  <ComplianceLabelBadge buildTier={o.buildTier} />
                  <span className="text-[12px] font-black tabular-nums text-white">
                    {fmt(o.exceptionCount)}
                  </span>
                  <DeadlinePill date={o.effectiveDate} label="" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {THEMES.map((t) => {
              const highest = RISK_ALERTS.filter(
                (a) => a.themeId === t.themeId,
              ).sort((x, y) => {
                const order = {
                  CRITICAL: 0,
                  HIGH: 1,
                  MEDIUM: 2,
                  LOW: 3,
                } as const;
                return order[x.severity] - order[y.severity];
              })[0];
              const borderC = highest
                ? colorFor(highest.severity)
                : COLORS.border;
              const TrendIcon =
                t.trend === "RISING"
                  ? TrendingUp
                  : t.trend === "FALLING"
                    ? TrendingDown
                    : Minus;
              const trendColor =
                t.trend === "RISING"
                  ? COLORS.red
                  : t.trend === "FALLING"
                    ? COLORS.green
                    : COLORS.dim;
              return (
                <button
                  key={t.themeId}
                  type="button"
                  onClick={() => setDrilledTheme(t.themeId)}
                  className="rounded-2xl border bg-[#0d0d0d] p-4 text-left transition hover:border-white/30"
                  style={{ borderColor: `${borderC}66` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
                      {t.themeId}
                    </span>
                    <TrendIcon
                      className="size-3.5"
                      style={{ color: trendColor }}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-1.5 text-sm font-black leading-snug text-white">
                    {t.themeName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-zinc-400">
                    {t.themeDefinition}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-black tabular-nums text-white">
                      {fmt(t.weeklyExceptions)} exc.
                    </span>
                    <Pill severity={highest ? highest.severity : "ACTIONED"}>
                      {t.obligationCount} oblig.
                    </Pill>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ShellCard>

      <ShellCard
        title="Regulatory horizon"
        subtitle="Collapsible timeline — auto-expanded when a deadline is within 60 days"
        accent={COLORS.amber}
        actions={
          <button
            type="button"
            onClick={() => setHorizonExpanded((v) => !v)}
            className="rounded-lg border border-white/15 bg-white/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-200 hover:bg-white/[0.12]"
          >
            {horizonExpanded ? "Collapse" : "Expand"}
          </button>
        }
      >
        {horizonExpanded ? (
          <HorizonTimeline />
        ) : (
          <p className="text-[11px] font-semibold text-zinc-500">
            Collapsed — click expand to view all 7 milestones.
          </p>
        )}
      </ShellCard>
    </div>
  );
}

function HorizonTimeline() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-stretch gap-3 py-2">
        {HORIZON.map((m, i) => {
          const d = daysUntil(m.isoDate);
          const color =
            d < 0
              ? COLORS.dim
              : d <= 60
                ? COLORS.red
                : d <= 180
                  ? COLORS.amber
                  : COLORS.blue;
          return (
            <div key={m.isoDate} className="flex items-center gap-3">
              <div
                className="min-w-[200px] rounded-xl border bg-black/35 p-3"
                style={{ borderColor: `${color}66` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.14em]"
                    style={{ color }}
                  >
                    {d < 0 ? "Passed" : `${d}d remaining`}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    {new Date(m.isoDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] font-black leading-snug text-white">
                  {m.label}
                </p>
                <p className="mt-1 text-[10px] font-bold text-zinc-500">
                  {m.linkedObligationIds.length} linked obligations
                </p>
              </div>
              {i < HORIZON.length - 1 ? (
                <ChevronRight className="size-4 text-zinc-700" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S3 — OBLIGATION DETAIL
// ─────────────────────────────────────────────────────────────────────────────

function S3ObligationDetail() {
  const persona = usePersona();
  const fallback = OBLIGATIONS[0];
  const obligation = persona.selectedObligationId
    ? (OBLIGATIONS_BY_ID[persona.selectedObligationId] ?? fallback)
    : fallback;
  const regulation = REGULATIONS_BY_ID[obligation.parentRegulationId];
  const theme = THEMES_BY_ID[obligation.themeId];
  const owner = CONTROL_OWNERS.find(
    (o) => o.personaId === obligation.accountablePersonaId,
  );
  const alerts = RISK_ALERTS.filter((a) => a.obligationId === obligation.oblId);
  const signals = SIGNALS.filter((s) =>
    s.relatedObligationIds.includes(obligation.oblId),
  );
  const boundary = BOUNDARIES.find((b) => b.obligationId === obligation.oblId);
  const integration = INTEGRATIONS.find((i) =>
    i.obligationIds.includes(obligation.oblId),
  );

  return (
    <div className="space-y-4">
      <ShellCard
        title={`${obligation.oblId} · ${theme?.themeName}`}
        subtitle={obligation.statement}
        accent={colorFor(obligation.status)}
        actions={
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-[11px] font-bold text-zinc-200"
              value={obligation.oblId}
              onChange={(e) => persona.setSelectedObligationId(e.target.value)}
            >
              {OBLIGATIONS.map((o) => (
                <option key={o.oblId} value={o.oblId}>
                  {o.oblId} — {o.statement.slice(0, 48)}…
                </option>
              ))}
            </select>
            <ComplianceLabelBadge buildTier={obligation.buildTier} />
            <DeadlinePill date={obligation.effectiveDate} label="Effective" />
          </div>
        }
      >
        {regulation && theme && owner ? (
          <SpineStrip
            regulation={`${regulation.shortName} · ${regulation.circularRef}`}
            obligation={`${obligation.oblId} — ${obligation.statement.slice(0, 70)}…`}
            signalSummary={`${signals.length} signals · ${alerts.length} alerts open`}
            owner={`${owner.roleTitle} (${owner.lineOfDefence})`}
            evidenceSummary={`${alerts.reduce((sum, a) => sum + a.evidenceIds.length, 0)} evidence items · ${alerts.filter((a) => a.boardPackInclusion).length} board-pack`}
            recommendedAction={alerts[0]?.recommendedAction ?? "—"}
          />
        ) : null}

        {boundary ? (
          <div className="mt-3">
            <BoundaryNote
              partnerSystem={boundary.partnerSystemNamed}
              reason={boundary.reason}
              displayType={boundary.displayType}
            />
          </div>
        ) : null}

        {integration && obligation.buildTier === "INTEGRATION_DEPENDENT" ? (
          <div className="mt-3 rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-3.5">
            <div className="flex items-center gap-2">
              <Plug className="size-3.5 text-teal-300" aria-hidden />
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-200">
                Integration banner — partial coverage
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
      </ShellCard>

      {obligation.buildTier === "OUT_OF_SCOPE" ? (
        <ShellCard title="Signal feed" accent={COLORS.dim}>
          <BoundaryNote
            partnerSystem="Out-of-scope obligation"
            reason="This obligation is owned by another system. Fluid CX does not raise alerts here. Refer to the partner system named on the boundary card."
            displayType="DO_NOT_BUILD_BANNER"
          />
        </ShellCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <ShellCard
              title="Signal feed"
              subtitle={`${signals.length} signals · sortable by severity, timestamp`}
              accent={COLORS.red}
            >
              <div className="space-y-2">
                {signals.length === 0 ? (
                  <EmptyState message="No signals linked to this obligation in the current window." />
                ) : (
                  signals.map((s) => (
                    <TranscriptSnippet key={s.signalId} signal={s} />
                  ))
                )}
              </div>
            </ShellCard>
          </div>
          <div className="xl:col-span-4 space-y-3">
            <ShellCard title="Open alerts" accent={COLORS.amber}>
              <div className="space-y-2">
                {alerts.length === 0 ? (
                  <EmptyState message="No open alerts." />
                ) : (
                  alerts.map((a) => (
                    <button
                      key={a.alertId}
                      type="button"
                      onClick={() => persona.openDrawer(a.alertId)}
                      className="w-full rounded-xl border border-white/10 bg-black/35 p-3 text-left hover:border-white/25"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <SeverityBadge severity={a.severity} />
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-1.5 text-[12px] font-bold text-white">
                        {a.alertTitle}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-zinc-500">
                        {fmt(a.occurrenceCount)} occurrences ·{" "}
                        {relativeAge(a.firstObservedTs)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </ShellCard>
            <ShellCard title="Recommended action" accent={COLORS.teal}>
              <p className="text-[13px] font-bold leading-snug text-white">
                {alerts[0]?.recommendedAction ??
                  "No active recommended action."}
              </p>
              {owner ? (
                <div className="mt-2">
                  <OwnerChip owner={owner} />
                </div>
              ) : null}
            </ShellCard>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S4 — MISSED-COMPLAINT HUB
// ─────────────────────────────────────────────────────────────────────────────

function S4MissedComplaint() {
  const noSR = COMPLAINT_SIGNALS.filter((c) => c.cmsSrCreatedFlag === "NO");
  const cmsTrend = [
    { d: "May 18", detected: 312, logged: 268, missed: 44 },
    { d: "May 19", detected: 287, logged: 240, missed: 47 },
    { d: "May 20", detected: 298, logged: 251, missed: 47 },
    { d: "May 21", detected: 341, logged: 277, missed: 64 },
    { d: "May 22", detected: 360, logged: 297, missed: 63 },
    { d: "May 23", detected: 372, logged: 309, missed: 63 },
    { d: "May 24", detected: 391, logged: 344, missed: 47 },
  ];
  const ninetyDist = [
    {
      b: "0–25",
      n: COMPLAINT_SIGNALS.filter((c) => c.firstNinety.adherenceScore < 25)
        .length,
    },
    {
      b: "25–50",
      n: COMPLAINT_SIGNALS.filter(
        (c) =>
          c.firstNinety.adherenceScore >= 25 &&
          c.firstNinety.adherenceScore < 50,
      ).length,
    },
    {
      b: "50–75",
      n: COMPLAINT_SIGNALS.filter(
        (c) =>
          c.firstNinety.adherenceScore >= 50 &&
          c.firstNinety.adherenceScore < 75,
      ).length,
    },
    {
      b: "75–90",
      n: COMPLAINT_SIGNALS.filter(
        (c) =>
          c.firstNinety.adherenceScore >= 75 &&
          c.firstNinety.adherenceScore < 90,
      ).length,
    },
    {
      b: "90+",
      n: COMPLAINT_SIGNALS.filter((c) => c.firstNinety.adherenceScore >= 90)
        .length,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Complaints detected (yesterday)"
          value={391}
          delta="+19 WoW"
          severity="amber"
          icon={MessagesSquare}
        />
        <KPICard
          label="No SR in CMS"
          value={47}
          delta="12% of detected"
          severity="red"
          icon={Siren}
        />
        <KPICard
          label="First-90s adherence (avg)"
          value="64%"
          delta="Target ≥ 85%"
          severity="amber"
          icon={Activity}
        />
        <KPICard
          label="Force-create SR (S4 stub)"
          value="Disabled"
          delta="SR creation is managed by your CMS"
          severity="neutral"
          icon={Lock}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="Missed-complaint feed (T4)"
            subtitle="Complaints expressed in conversation with no SR in CMS — UC-01"
            accent={COLORS.red}
          >
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_120px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
                <span>Severity</span>
                <span>Complaint phrase</span>
                <span>Channel</span>
                <span>Product</span>
                <span>CMS SR</span>
              </div>
              <div className="divide-y divide-white/5">
                {COMPLAINT_SIGNALS.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_120px] items-center gap-2 px-3 py-2.5"
                  >
                    <SeverityBadge severity={c.severity} />
                    <p className="truncate text-[12px] font-bold text-zinc-200">
                      "{c.complaintPhrase}"
                    </p>
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {c.channel}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {c.productCode}
                    </span>
                    {c.cmsSrCreatedFlag === "NO" ? (
                      <Pill severity="CRITICAL">No SR</Pill>
                    ) : (
                      <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-black text-zinc-200">
                        {c.srId}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ShellCard>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <ShellCard
            title="CMS gap trend (C2)"
            subtitle="Detected vs logged vs missed — 7-day"
            accent={COLORS.indigo}
          >
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cmsTrend}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="d" stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: `1px solid ${COLORS.border2}`,
                      fontSize: 11,
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#a3a3a3" }} />
                  <Line
                    type="monotone"
                    dataKey="detected"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="logged"
                    stroke={COLORS.teal}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="missed"
                    stroke={COLORS.red}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ShellCard>

          <ShellCard
            title="First-90s adherence distribution (C3)"
            subtitle="Score buckets across yesterday's complaints — UC-23"
            accent={COLORS.amber}
          >
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ninetyDist}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="b" stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: `1px solid ${COLORS.border2}`,
                      fontSize: 11,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                    {ninetyDist.map((entry, idx) => (
                      <Cell
                        key={entry.b}
                        fill={
                          idx < 2
                            ? COLORS.red
                            : idx < 3
                              ? COLORS.amber
                              : idx < 4
                                ? COLORS.yellow
                                : COLORS.green
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-zinc-400">
              {noSR.length} of {COMPLAINT_SIGNALS.length} complaints had no SR ·
              6 below 50% adherence.
            </p>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S5 — RECOVERY CONDUCT MONITOR
// ─────────────────────────────────────────────────────────────────────────────

function S5RecoveryConduct() {
  const [tab, setTab] = useState<"violations" | "distress" | "vendor">(
    "violations",
  );

  const trend = [
    { d: "May 11", threat: 4, harass: 6, shame: 3, profan: 1, nonbor: 2 },
    { d: "May 13", threat: 5, harass: 5, shame: 4, profan: 1, nonbor: 1 },
    { d: "May 15", threat: 6, harass: 7, shame: 4, profan: 2, nonbor: 2 },
    { d: "May 17", threat: 7, harass: 8, shame: 5, profan: 2, nonbor: 3 },
    { d: "May 19", threat: 6, harass: 7, shame: 6, profan: 3, nonbor: 4 },
    { d: "May 21", threat: 9, harass: 9, shame: 7, profan: 2, nonbor: 4 },
    { d: "May 23", threat: 11, harass: 10, shame: 8, profan: 3, nonbor: 5 },
  ];
  const distress = [
    { name: "Engaged", value: 38, fill: COLORS.green },
    { name: "Dismissed", value: 12, fill: COLORS.red },
    { name: "Silent", value: 9, fill: COLORS.amber },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Threat/harassment flags · 7d"
          value={67}
          delta="+24 WoW"
          severity="red"
          icon={Siren}
        />
        <KPICard
          label="Vendors at conduct risk"
          value={2}
          delta="Pinnacle + Krescent"
          severity="amber"
          icon={Briefcase}
        />
        <KPICard
          label="Distress engagement rate"
          value="64%"
          delta="Target ≥ 80%"
          severity="amber"
          icon={Heart}
        />
        <KPICard
          label="Non-borrower contacts"
          value={12}
          delta="OBL-005 breach · IO referred"
          severity="red"
          icon={Gavel}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "violations", label: "Violations" },
            { id: "distress", label: "Distress engagement" },
            { id: "vendor", label: "Vendor breakdown" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide",
              tab === t.id
                ? "border-teal-500/60 bg-teal-500/15 text-teal-100"
                : "border-white/10 bg-black/40 text-zinc-400 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "violations" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <ShellCard
              title="Recovery violations feed (T6)"
              subtitle="Per-call flags — threat / profanity / harassment / shaming / non-borrower"
              accent={COLORS.red}
            >
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-[100px_120px_120px_minmax(0,1fr)_140px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
                  <span>Agent</span>
                  <span>Vendor</span>
                  <span>Product · Amt</span>
                  <span>Flags</span>
                  <span>Timestamp</span>
                </div>
                <div className="divide-y divide-white/5">
                  {RECOVERY_SIGNALS.map((r) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-[100px_120px_120px_minmax(0,1fr)_140px] items-center gap-2 px-3 py-2.5"
                    >
                      <span className="font-mono text-[11px] font-bold text-zinc-200">
                        {r.agentId}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {r.vendorId ?? "In-house"}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-300">
                        {r.productCode} · ₹{(r.amount / 1000).toFixed(0)}k
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {r.flags.threat ? (
                          <Pill severity="CRITICAL">Threat</Pill>
                        ) : null}
                        {r.flags.profanity ? (
                          <Pill severity="CRITICAL">Profanity</Pill>
                        ) : null}
                        {r.flags.harassment ? (
                          <Pill severity="HIGH">Harass.</Pill>
                        ) : null}
                        {r.flags.shaming ? (
                          <Pill severity="HIGH">Shaming</Pill>
                        ) : null}
                        {r.flags.nonBorrower ? (
                          <Pill severity="HIGH">Non-borrower</Pill>
                        ) : null}
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500">
                        {new Date(r.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ShellCard>
          </div>
          <div className="xl:col-span-5">
            <ShellCard
              title="Violation trend (C4)"
              subtitle="Stacked by flag type · 14 days"
              accent={COLORS.red}
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trend}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="d"
                      stroke="#6b7280"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <RechartsTooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: `1px solid ${COLORS.border2}`,
                        fontSize: 11,
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, color: "#a3a3a3" }} />
                    <Bar dataKey="threat" stackId="a" fill={COLORS.red} />
                    <Bar dataKey="harass" stackId="a" fill={COLORS.amber} />
                    <Bar dataKey="shame" stackId="a" fill={COLORS.saffron} />
                    <Bar dataKey="profan" stackId="a" fill={COLORS.yellow} />
                    <Bar dataKey="nonbor" stackId="a" fill={COLORS.purple} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>
          </div>
        </div>
      ) : null}

      {tab === "distress" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <ShellCard
              title="Distress engagement table (T7)"
              subtitle="UC-03 — engaged / dismissed / silent classification"
              accent={COLORS.amber}
            >
              <div className="space-y-2">
                {RISK_ALERTS.filter((a) => a.obligationId === "OBL-008").map(
                  (a) => (
                    <div
                      key={a.alertId}
                      className="rounded-xl border border-white/10 bg-black/35 p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={a.severity} />
                        <Pill severity="HIGH">Dismissed</Pill>
                        <span className="text-[10px] font-bold text-zinc-500">
                          {a.affectedAgentIds.length} agents ·{" "}
                          {a.affectedVendorIds.join(", ") || "in-house"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold text-white">
                        {a.alertTitle}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold text-zinc-400">
                        {a.recommendedAction}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </ShellCard>
          </div>
          <div className="xl:col-span-5">
            <ShellCard
              title="Distress engagement mix (C5)"
              accent={COLORS.green}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distress}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={92}
                      label={{ fontSize: 11, fill: "#fff" }}
                    >
                      {distress.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: `1px solid ${COLORS.border2}`,
                        fontSize: 11,
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, color: "#a3a3a3" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>
          </div>
        </div>
      ) : null}

      {tab === "vendor" ? (
        <ShellCard
          title="Vendor breakdown → S7"
          subtitle="Click any vendor card to drill into vendor governance"
          accent={COLORS.teal}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {VENDORS.filter((v) => v.vendorId !== "VEN-INHOUSE").map((v) => (
              <VendorScorecard key={v.vendorId} vendor={v} />
            ))}
          </div>
        </ShellCard>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S6 — VULNERABLE CUSTOMER CARE
// ─────────────────────────────────────────────────────────────────────────────

function S6Vulnerable() {
  const [tab, setTab] = useState<"empathy" | "mix" | "routing">("empathy");

  const empathyDist = [
    { b: "0–20", n: 4 },
    { b: "20–40", n: 9 },
    { b: "40–60", n: 18 },
    { b: "60–80", n: 24 },
    { b: "80+", n: 11 },
  ];
  const mix = [
    { name: "Bereavement", value: 23, fill: COLORS.purple },
    { name: "Distress", value: 138, fill: COLORS.amber },
    { name: "Fraud victim", value: 41, fill: COLORS.red },
    { name: "PwD", value: 14, fill: COLORS.blue },
    { name: "MSE", value: 28, fill: COLORS.teal },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Bereavement empathy fails"
          value={3}
          delta="OBL-011 · CRITICAL"
          severity="red"
          icon={Heart}
        />
        <KPICard
          label="Vulnerable on general queue"
          value={11}
          delta="OBL-027 · routing miss"
          severity="amber"
          icon={Users}
        />
        <KPICard
          label="Empathy avg score"
          value="62/100"
          severity="amber"
          icon={Activity}
        />
        <KPICard
          label="Routing success"
          value="60%"
          delta="Target ≥ 90%"
          severity="red"
          icon={Filter}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "empathy", label: "Empathy scoring" },
            { id: "mix", label: "Signal mix" },
            { id: "routing", label: "Routing" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide",
              tab === t.id
                ? "border-purple-400/60 bg-purple-400/15 text-purple-100"
                : "border-white/10 bg-black/40 text-zinc-400 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "empathy" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <ShellCard
              title="Bereavement & vulnerable interactions"
              subtitle="UC-08 + UC-24 · empathy + routing failures"
              accent={COLORS.purple}
            >
              <div className="space-y-2">
                {SIGNALS.filter(
                  (s) =>
                    s.signalType === "empathy_failure" ||
                    s.signalType === "customer_distress",
                ).map((s) => (
                  <TranscriptSnippet key={s.signalId} signal={s} />
                ))}
              </div>
            </ShellCard>
          </div>
          <div className="xl:col-span-5">
            <ShellCard
              title="Empathy distribution (C6)"
              subtitle="Score buckets across vulnerable cohort"
              accent={COLORS.purple}
            >
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={empathyDist}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="b"
                      stroke="#6b7280"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <RechartsTooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: `1px solid ${COLORS.border2}`,
                        fontSize: 11,
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                      {empathyDist.map((e, i) => (
                        <Cell
                          key={e.b}
                          fill={
                            i < 2
                              ? COLORS.red
                              : i < 3
                                ? COLORS.amber
                                : i < 4
                                  ? COLORS.yellow
                                  : COLORS.green
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>
          </div>
        </div>
      ) : null}

      {tab === "mix" ? (
        <ShellCard
          title="Vulnerable signal mix (C7)"
          subtitle="Bereavement · Distress · Fraud victim · PwD · MSE"
          accent={COLORS.purple}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mix}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={96}
                  label={{ fontSize: 11, fill: "#fff" }}
                >
                  {mix.map((m) => (
                    <Cell key={m.name} fill={m.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: `1px solid ${COLORS.border2}`,
                    fontSize: 11,
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: "#a3a3a3" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ShellCard>
      ) : null}

      {tab === "routing" ? (
        <ShellCard
          title="Inbound vulnerable routing (UC-24)"
          subtitle="Flags detected before/while routing — specialist desk vs general queue"
          accent={COLORS.amber}
        >
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-[140px_140px_minmax(0,1fr)_160px_120px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
              <span>Flag</span>
              <span>Queue landed</span>
              <span>Outcome</span>
              <span>Time to route</span>
              <span>Verdict</span>
            </div>
            <div className="divide-y divide-white/5">
              {INBOUND_QUEUE_SIGNALS.map((q) => (
                <div
                  key={q.id}
                  className="grid grid-cols-[140px_140px_minmax(0,1fr)_160px_120px] items-center gap-2 px-3 py-2.5"
                >
                  <Pill severity={q.routedCorrectly ? "ACTIONED" : "HIGH"}>
                    {q.detectedFlag}
                  </Pill>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {q.queueLandedOn}
                  </span>
                  <span className="text-[12px] font-semibold text-zinc-200">
                    {q.routedCorrectly
                      ? "Routed to specialist desk correctly"
                      : "Stayed on general queue — handover never happened"}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-300">
                    {q.timeToVulnerableRoutingMin === null
                      ? "Never"
                      : `${q.timeToVulnerableRoutingMin.toFixed(1)} min`}
                  </span>
                  {q.routedCorrectly ? (
                    <Pill severity="ACTIONED">OK</Pill>
                  ) : (
                    <Pill severity="HIGH">Routing miss</Pill>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ShellCard>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S7 — VENDOR GOVERNANCE
// ─────────────────────────────────────────────────────────────────────────────

function S7Vendor() {
  const compareChart = VENDORS.map((v) => ({
    name: v.vendorName.split(" ").slice(0, 2).join(" "),
    score: v.conductScoreOverall,
    inhouse: 81,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Vendors below in-house"
          value={3}
          delta="All 3 vendors WORSE benchmark"
          severity="red"
          icon={Briefcase}
        />
        <KPICard
          label="Coverage uplift"
          value="100%"
          delta="vs 2–5% sample baseline"
          severity="teal"
          icon={ShieldCheck}
        />
        <KPICard
          label="Lowest vendor score"
          value="59"
          delta="Pinnacle Recovery"
          severity="red"
          icon={TrendingDown}
        />
        <KPICard
          label="Attestation packs"
          value="3"
          delta="Monthly artefact per vendor"
          severity="amber"
          icon={ClipboardList}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="Vendor scorecards (T8)"
            subtitle="Coverage = 100% via Fluid CX · Outsourcing Directions (REG-004) compliant"
            accent={COLORS.teal}
            actions={
              <button
                type="button"
                onClick={() =>
                  alert("Attestation pack generation queued — Fluid CX API.")
                }
                className="inline-flex items-center gap-1 rounded-lg border border-teal-500/50 bg-teal-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-teal-100 hover:bg-teal-500/25"
              >
                <FileText className="size-3" aria-hidden /> Generate attestation
                pack
              </button>
            }
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {VENDORS.map((v) => (
                <VendorScorecard key={v.vendorId} vendor={v} />
              ))}
            </div>
          </ShellCard>
        </div>
        <div className="xl:col-span-5">
          <ShellCard
            title="Vendor conduct comparison (C8)"
            subtitle="Horizontal — in-house reference at 81"
            accent={COLORS.teal}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compareChart}
                  layout="vertical"
                  margin={{ top: 10, right: 14, left: 8, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="#6b7280"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#6b7280"
                    tick={{ fontSize: 10 }}
                    width={120}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: `1px solid ${COLORS.border2}`,
                      fontSize: 11,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {compareChart.map((c) => (
                      <Cell
                        key={c.name}
                        fill={
                          c.score < 65
                            ? COLORS.red
                            : c.score < 75
                              ? COLORS.amber
                              : c.score < 85
                                ? COLORS.yellow
                                : COLORS.green
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-zinc-400">
              Pinnacle (59) and Sutherland (68) both below 70 — RB-IOS exposure
              proxy if recovery cases attract consequential-loss compensation.
            </p>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S8 — RCA & BOARD PACK
// ─────────────────────────────────────────────────────────────────────────────

function S8RCA() {
  const persona = usePersona();
  const treemapData = RCA_CLUSTERS.map((c) => ({
    name: c.clusterTheme,
    size: c.volume,
    severity: c.severityScore,
  }));
  const dimensions = [
    { d: "Vendor", v: 287 },
    { d: "Product", v: 412 },
    { d: "Channel", v: 264 },
    { d: "Campaign", v: 198 },
    { d: "Region", v: 138 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="RCA clusters · board pack"
          value={RCA_CLUSTERS.filter((c) => c.boardPackInclusion).length}
          severity="amber"
          icon={ListChecks}
        />
        <KPICard
          label="Top-5 grounds engine"
          value="Live"
          delta="Annual CSCB pack ready"
          severity="teal"
          icon={Award}
        />
        <KPICard
          label="Rising clusters"
          value={
            RCA_CLUSTERS.filter((c) => c.trendDirection === "RISING").length
          }
          severity="red"
          icon={TrendingUp}
        />
        <KPICard
          label="Falling / actioned"
          value={
            RCA_CLUSTERS.filter((c) => c.trendDirection === "FALLING").length
          }
          severity="green"
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="RCA cluster treemap (C10)"
            subtitle="Size = volume · fill = severity · click to drill"
            accent={COLORS.indigo}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  stroke={COLORS.border2}
                  fill={COLORS.indigo}
                  content={(props: unknown) => {
                    const p = (props ?? {}) as {
                      x?: number;
                      y?: number;
                      width?: number;
                      height?: number;
                      name?: string;
                      size?: number;
                      value?: number;
                      depth?: number;
                      root?: unknown;
                      payload?: { severity?: number; size?: number; name?: string };
                    };
                    const x = p.x ?? 0;
                    const y = p.y ?? 0;
                    const width = p.width ?? 0;
                    const height = p.height ?? 0;
                    // Recharts renders the root + any parent containers in addition to leaves.
                    // Only draw leaf cells (depth >= 1) that have a usable size.
                    const isLeaf = (p.depth ?? 0) >= 1;
                    if (!isLeaf || width <= 0 || height <= 0) {
                      return <g />;
                    }
                    const name = p.name ?? p.payload?.name ?? "";
                    const size = p.size ?? p.value ?? p.payload?.size ?? 0;
                    const sev = p.payload?.severity ?? 60;
                    const fill =
                      sev > 85
                        ? COLORS.red
                        : sev > 70
                          ? COLORS.amber
                          : COLORS.teal;
                    if (width < 40 || height < 30) {
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={fill}
                            stroke="#0a0a0a"
                          />
                        </g>
                      );
                    }
                    const charsThatFit = Math.max(
                      0,
                      Math.floor((width - 12) / 6),
                    );
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={fill}
                          stroke="#0a0a0a"
                        />
                        <text
                          x={x + 6}
                          y={y + 16}
                          fill="#fff"
                          fontSize={10}
                          fontWeight={700}
                        >
                          {name.slice(0, charsThatFit)}
                        </text>
                        <text x={x + 6} y={y + 28} fill="#ddd" fontSize={9}>
                          {fmt(size)} signals
                        </text>
                      </g>
                    );
                  }}
                />
              </ResponsiveContainer>
            </div>
          </ShellCard>
        </div>
        <div className="xl:col-span-5">
          <ShellCard
            title="RCA cluster table (T9)"
            subtitle="Sortable by severity · board-pack inclusion toggle"
            accent={COLORS.amber}
            actions={
              <button
                type="button"
                onClick={() =>
                  alert("CSCB board-pack export queued — Fluid CX API.")
                }
                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/50 bg-amber-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-100 hover:bg-amber-500/25"
              >
                <Download className="size-3" aria-hidden /> Export CSCB pack
              </button>
            }
          >
            <div className="space-y-2.5">
              {RCA_CLUSTERS.map((c) => (
                <RCAClusterCard
                  key={c.clusterId}
                  cluster={c}
                  onClick={() =>
                    persona.navigate(
                      "S3",
                      OBLIGATIONS.find((o) => o.themeId === c.themeId)?.oblId ??
                        null,
                    )
                  }
                />
              ))}
            </div>
          </ShellCard>
        </div>
      </div>

      <ShellCard
        title="Cluster dimension breakdown (C11)"
        subtitle="Top dimensions across all RCA clusters"
        accent={COLORS.indigo}
      >
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dimensions}
              layout="vertical"
              margin={{ top: 10, right: 16, left: 8, bottom: 0 }}
            >
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="d"
                type="category"
                stroke="#6b7280"
                tick={{ fontSize: 10 }}
                width={90}
              />
              <RechartsTooltip
                contentStyle={{
                  background: "#0a0a0a",
                  border: `1px solid ${COLORS.border2}`,
                  fontSize: 11,
                  color: "#fff",
                }}
              />
              <Bar dataKey="v" radius={[0, 4, 4, 0]} fill={COLORS.indigo} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ShellCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S9 — BUNDLING & CONSENT
// ─────────────────────────────────────────────────────────────────────────────

function S9Bundling() {
  const bundling = [
    { c: "SALARY_2026Q1", p: 84, halt: true },
    { c: "PL_Top-up_May26", p: 62, halt: false },
    { c: "Cards_Limit_2026", p: 58, halt: false },
    { c: "HL_Insurance_Apr26", p: 71, halt: false },
    { c: "ULIP_Wealth_Q2", p: 44, halt: false },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Bundling signals · 7d"
          value={264}
          delta="+39 WoW"
          severity="amber"
          icon={Megaphone}
        />
        <KPICard
          label="Consent-extraction phrases"
          value={48}
          delta="ULIP + Insurance"
          severity="red"
          icon={Siren}
        />
        <KPICard
          label="Halt-recommended campaigns"
          value={1}
          delta="SALARY_2026Q1 Script Variant A"
          severity="red"
          icon={Flag}
        />
        <KPICard
          label="Bot-led bundling"
          value={4}
          delta="Chat-bot CC variant"
          severity="amber"
          icon={MessagesSquare}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="Campaign bundling pattern (C12)"
            subtitle="Pressure score per campaign · red threshold = 70"
            accent={COLORS.amber}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bundling}
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="c"
                    stroke="#6b7280"
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: `1px solid ${COLORS.border2}`,
                      fontSize: 11,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="p" radius={[4, 4, 0, 0]}>
                    {bundling.map((b) => (
                      <Cell
                        key={b.c}
                        fill={
                          b.p >= 70
                            ? COLORS.red
                            : b.p >= 55
                              ? COLORS.amber
                              : COLORS.teal
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-zinc-400">
              Threshold line at 70: campaigns above this score recommended for
              halt + script review.
            </p>
          </ShellCard>
        </div>
        <div className="xl:col-span-5">
          <ShellCard title="Campaign halt list" accent={COLORS.red}>
            <div className="space-y-2">
              {bundling.map((b) => (
                <div
                  key={b.c}
                  className="rounded-xl border border-white/10 bg-black/35 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-black text-white">{b.c}</p>
                    {b.halt ? (
                      <Pill severity="CRITICAL">Halt recommended</Pill>
                    ) : (
                      <Pill severity="MEDIUM">Monitor</Pill>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-zinc-400">
                    Pressure score{" "}
                    <span className="font-black text-white">{b.p}/100</span>
                  </p>
                </div>
              ))}
            </div>
            <AIInsightCard
              headline="Highest-pressure campaign: SALARY_2026Q1"
              detail="84/100 — script uses 'compulsory' phrasing on optional ULIP across voice and chat. Halt Script Variant A is the recommended next action."
              taxonomy={["Bundling pressure", "Consent extraction"]}
            />
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S10 — REPEAT-CONTACT / FCR
// ─────────────────────────────────────────────────────────────────────────────

function S10Repeat() {
  const [tab, setTab] = useState<"issue" | "customer">("issue");
  const issueVol = [
    { i: "Card dispute / chargeback", v: 482 },
    { i: "EMI failure / debit reversal", v: 361 },
    { i: "ECS bounce charge reversal", v: 248 },
    { i: "HL prepayment statement", v: 174 },
    { i: "OD limit dispute", v: 142 },
    { i: "Mandate cancellation NEFT", v: 121 },
    { i: "KYC reverification", v: 98 },
    { i: "Card limit dispute", v: 76 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Repeat-contact rate"
          value="22%"
          delta="Target ≤ 15%"
          severity="red"
          icon={Activity}
        />
        <KPICard
          label="Repeat clusters"
          value={REPEAT_PATTERNS.length}
          delta="6 active clusters"
          severity="amber"
          icon={Layers}
        />
        <KPICard
          label="IO referrals (repeat-driven)"
          value={1}
          severity="amber"
          icon={Gavel}
        />
        <KPICard
          label="FCR (in-house)"
          value="78%"
          delta="vs BPO 61%"
          severity="green"
          icon={Target}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "issue", label: "By issue" },
            { id: "customer", label: "By customer" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide",
              tab === t.id
                ? "border-teal-500/60 bg-teal-500/15 text-teal-100"
                : "border-white/10 bg-black/40 text-zinc-400 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "issue" ? (
        <ShellCard
          title="Repeat-contact volume by issue (C13)"
          subtitle="Top 8 — horizontal"
          accent={COLORS.amber}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={issueVol}
                layout="vertical"
                margin={{ top: 10, right: 16, left: 16, bottom: 0 }}
              >
                <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="i"
                  type="category"
                  stroke="#6b7280"
                  tick={{ fontSize: 10 }}
                  width={220}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: `1px solid ${COLORS.border2}`,
                    fontSize: 11,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="v" radius={[0, 4, 4, 0]} fill={COLORS.amber} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ShellCard>
      ) : (
        <ShellCard
          title="Repeat-contact by customer (T12)"
          subtitle="Same-customer same-issue clusters"
          accent={COLORS.teal}
        >
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-[minmax(0,1fr)_140px_120px_120px_140px] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
              <span>Issue cluster</span>
              <span>Segment / Product</span>
              <span>Contacts (14d)</span>
              <span>Channel switches</span>
              <span>Escalation stage</span>
            </div>
            <div className="divide-y divide-white/5">
              {REPEAT_PATTERNS.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[minmax(0,1fr)_140px_120px_120px_140px] items-center gap-2 px-3 py-2.5"
                >
                  <p className="text-[12px] font-bold text-zinc-200">
                    {r.issueCluster}
                  </p>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {r.customerSegment} · {r.productCode}
                  </span>
                  <span className="font-black tabular-nums text-white">
                    {r.contactsIn14Days}
                  </span>
                  <span className="font-bold tabular-nums text-zinc-300">
                    {r.channelSwitches}
                  </span>
                  <Pill
                    severity={
                      r.escalationStage === "IO-Referral"
                        ? "ESCALATED_TO_IO"
                        : r.escalationStage === "L2-Nodal"
                          ? "HIGH"
                          : "MEDIUM"
                    }
                  >
                    {r.escalationStage}
                  </Pill>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S11 — REGULATORY HORIZON
// ─────────────────────────────────────────────────────────────────────────────

function S11Horizon() {
  const persona = usePersona();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Deadlines this quarter"
          value={
            HORIZON.filter(
              (m) => daysUntil(m.isoDate) >= 0 && daysUntil(m.isoDate) <= 90,
            ).length
          }
          severity="red"
          icon={Target}
        />
        <KPICard
          label="Deadlines 90–180d"
          value={
            HORIZON.filter(
              (m) => daysUntil(m.isoDate) > 90 && daysUntil(m.isoDate) <= 180,
            ).length
          }
          severity="amber"
          icon={Target}
        />
        <KPICard
          label="Deadlines > 180d"
          value={HORIZON.filter((m) => daysUntil(m.isoDate) > 180).length}
          severity="neutral"
          icon={Target}
        />
        <KPICard
          label="Passed milestones"
          value={HORIZON.filter((m) => daysUntil(m.isoDate) < 0).length}
          severity="green"
          icon={ShieldCheck}
        />
      </div>

      <ShellCard
        title="Regulatory horizon timeline"
        subtitle="All RBI + MeitY deadlines · click obligations to drill to S3"
        accent={COLORS.amber}
      >
        <HorizonTimeline />
        <div className="mt-5 space-y-3">
          {HORIZON.map((m) => (
            <div
              key={m.isoDate}
              className="rounded-2xl border border-white/10 bg-black/35 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black text-white">{m.label}</p>
                <DeadlinePill date={m.isoDate} label="Effective" />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.linkedObligationIds.map((oid) => {
                  const o = OBLIGATIONS_BY_ID[oid];
                  if (!o) return null;
                  return (
                    <button
                      key={oid}
                      type="button"
                      onClick={() => persona.navigate("S3", oid)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-zinc-200 hover:border-white/25"
                    >
                      <Pill severity="IN_FORCE">{oid}</Pill>
                      <span className="text-[11px] font-bold text-zinc-300">
                        {o.statement.slice(0, 42)}…
                      </span>
                    </button>
                  );
                })}
                {m.linkedObligationIds.length === 0 ? (
                  <p className="text-[11px] font-semibold text-zinc-500">
                    No linked obligations in MVP — roadmap monitoring.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN: S12 — HONEST GAP & INTEGRATIONS
// ─────────────────────────────────────────────────────────────────────────────

function S12HonestGap() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KPICard
          label="Integrations connected"
          value={INTEGRATIONS.filter((i) => i.status === "Connected").length}
          severity="green"
          icon={Plug}
        />
        <KPICard
          label="Partial / Roadmap"
          value={
            INTEGRATIONS.filter(
              (i) => i.status === "Partial" || i.status === "Roadmap",
            ).length
          }
          severity="amber"
          icon={Link2}
        />
        <KPICard
          label="Honest-gap boundaries"
          value={BOUNDARIES.length}
          severity="neutral"
          icon={Flag}
        />
        <KPICard
          label="Out-of-scope obligations"
          value={
            OBLIGATIONS.filter((o) => o.buildTier === "OUT_OF_SCOPE").length
          }
          delta="Named partner systems on cards"
          severity="neutral"
          icon={Lock}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ShellCard
            title="Integration health (T10)"
            subtitle="Per IntegrationDependency record · status pill"
            accent={COLORS.teal}
          >
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-[minmax(0,1fr)_180px_140px_minmax(0,1fr)] gap-2 border-b border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-500">
                <span>Partner system</span>
                <span>Obligations</span>
                <span>Status</span>
                <span>Notes</span>
              </div>
              <div className="divide-y divide-white/5">
                {INTEGRATIONS.map((i) => {
                  const sev =
                    i.status === "Connected"
                      ? "ACTIONED"
                      : i.status === "Partial"
                        ? "MEDIUM"
                        : i.status === "Not connected"
                          ? "CRITICAL"
                          : "OPEN";
                  return (
                    <div
                      key={i.id}
                      className="grid grid-cols-[minmax(0,1fr)_180px_140px_minmax(0,1fr)] items-start gap-2 px-3 py-2.5"
                    >
                      <p className="text-[12px] font-bold text-white">
                        {i.partnerSystem}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {i.obligationIds.map((oid) => (
                          <span
                            key={oid}
                            className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-black text-zinc-200"
                          >
                            {oid}
                          </span>
                        ))}
                      </div>
                      <Pill severity={sev}>{i.status}</Pill>
                      <p className="text-[11px] font-semibold text-zinc-400">
                        {i.notes}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ShellCard>
        </div>

        <div className="xl:col-span-5">
          <ShellCard
            title="Capability boundaries (T11)"
            subtitle="Out-of-scope obligations + named partner systems"
            accent={COLORS.dim}
          >
            <div className="space-y-3">
              {BOUNDARIES.map((b) => (
                <BoundaryNote
                  key={b.id}
                  partnerSystem={`${b.partnerSystemNamed} · ${b.obligationId}`}
                  reason={b.reason}
                  displayType={b.displayType}
                />
              ))}
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SIDE NAV + TOP NAV
// ─────────────────────────────────────────────────────────────────────────────

type NavSpec = {
  key: ScreenKey;
  label: string;
  icon: LucideIcon;
};

const NAV: readonly NavSpec[] = [
  { key: "S0", label: "Landing", icon: Globe },
  { key: "S1", label: "Worklist", icon: ListChecks },
  { key: "S2", label: "Themes", icon: Layers },
  { key: "S3", label: "Obligation", icon: Search },
  { key: "S4", label: "Missed complaints", icon: MessagesSquare },
  { key: "S5", label: "Recovery conduct", icon: Phone },
  { key: "S6", label: "Vulnerable care", icon: Heart },
  { key: "S7", label: "Vendor governance", icon: Briefcase },
  { key: "S8", label: "RCA & board pack", icon: ClipboardList },
  { key: "S9", label: "Bundling & consent", icon: Megaphone },
  { key: "S10", label: "Repeat / FCR", icon: Activity },
  { key: "S11", label: "Regulatory horizon", icon: Target },
  { key: "S12", label: "Honest gap & integrations", icon: Plug },
];

function SideNav() {
  const persona = usePersona();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cx(
        "sticky top-0 hidden h-[100dvh] flex-col border-r bg-[#0a0a0a] py-4 transition-[width] duration-200 ease-out md:flex",
        expanded ? "w-[220px]" : "w-[68px]",
      )}
      style={{ borderColor: COLORS.border }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="mb-4 px-3">
        <div
          className={cx(
            "flex items-center gap-2",
            expanded ? "" : "justify-center",
          )}
          role="img"
          aria-label="RBI Conduct Intelligence"
        >
          <span
            className="grid size-9 place-items-center rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.indigo})`,
            }}
          >
            <Shield className="size-4.5" aria-hidden />
          </span>
          {expanded ? (
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                Fluid CX
              </p>
              <p className="truncate text-[12px] font-black text-white">
                RBI Conduct Intel.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = persona.activeScreen === n.key;
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => persona.navigate(n.key)}
              className={cx(
                "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition",
                active
                  ? "bg-teal-500/15 text-teal-100 ring-1 ring-teal-500/40"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white",
              )}
              title={`${n.key} · ${n.label}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {expanded ? (
                <span className="truncate text-[12px] font-bold uppercase tracking-wide">
                  {n.label}
                </span>
              ) : null}
              {expanded && active ? (
                <span className="ml-auto text-[9px] font-black uppercase tracking-wide text-teal-300">
                  {n.key}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/5 px-3 pt-3">
        <p
          className={cx(
            "text-[9px] font-black uppercase tracking-[0.14em] text-zinc-600",
            expanded ? "" : "text-center",
          )}
        >
          {expanded ? "Today · 2026-05-25" : "v1"}
        </p>
      </div>
    </aside>
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

function RbiScreenSwitch() {
  const persona = usePersona();
  switch (persona.activeScreen) {
    case "S0":
      return <S0Landing />;
    case "S1":
      return <S1Worklist />;
    case "S2":
      return <S2ThemesIndex />;
    case "S3":
      return <S3ObligationDetail />;
    case "S4":
      return <S4MissedComplaint />;
    case "S5":
      return <S5RecoveryConduct />;
    case "S6":
      return <S6Vulnerable />;
    case "S7":
      return <S7Vendor />;
    case "S8":
      return <S8RCA />;
    case "S9":
      return <S9Bundling />;
    case "S10":
      return <S10Repeat />;
    case "S11":
      return <S11Horizon />;
    case "S12":
      return <S12HonestGap />;
    default:
      return <S0Landing />;
  }
}

export function RbiConductIntelligenceDashboard({
  industryName: _industryName,
  industryColor,
  onExit,
  theme,
}: RbiConductIntelligenceDashboardProps) {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("L3");
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("S0");
  const [selectedObligationId, setSelectedObligationId] = useState<
    string | null
  >(null);
  const [drawerAlertId, setDrawerAlertId] = useState<string | null>(null);

  const value: PersonaContextValue = useMemo(
    () => ({
      activePersonaId,
      setActivePersonaId,
      activeScreen,
      setActiveScreen,
      selectedObligationId,
      setSelectedObligationId,
      drawerAlertId,
      openDrawer: (id: string) => setDrawerAlertId(id),
      closeDrawer: () => setDrawerAlertId(null),
      navigate: (s: ScreenKey, oblId?: string | null) => {
        setActiveScreen(s);
        if (oblId !== undefined) setSelectedObligationId(oblId);
      },
    }),
    [activePersonaId, activeScreen, selectedObligationId, drawerAlertId],
  );

  return (
    <DashboardThemeProvider value={theme ?? RBI_FALLBACK_THEME}>
      <PersonaContext.Provider value={value}>
        <div className="min-h-screen w-full min-w-0 bg-[#070707] text-white">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_32%)]" />

          <div className="relative flex w-full min-w-0">
            <SideNav />

            <main className="relative min-w-0 flex-1">
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
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5">
                      <Languages
                        className="size-3.5 text-teal-300"
                        aria-hidden
                      />
                      <span className="text-[10px] font-black uppercase tracking-wide text-zinc-400">
                        en · hi · ta · te · kn · mr
                      </span>
                    </div>
                    <PersonaSwitcher />
                  </div>
                </div>
              </header>

              <div className="mx-auto w-full max-w-[1880px] px-4 py-5">
                <RbiScreenSwitch />
              </div>
            </main>
          </div>

          <EvidenceDrawer />
        </div>
      </PersonaContext.Provider>
    </DashboardThemeProvider>
  );
}

export default RbiConductIntelligenceDashboard;
