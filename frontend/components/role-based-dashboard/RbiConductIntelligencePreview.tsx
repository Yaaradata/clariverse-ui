"use client";

import {
  Activity,
  ArrowLeft,
  Briefcase,
  ChevronRight,
  FileText,
  Globe,
  Headphones,
  Heart,
  Languages,
  Megaphone,
  MessagesSquare,
  Phone,
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  type CSSProperties,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FLUID_ALONE_CONTROLS,
  OBLIGATION_MET_SUMMARIES,
  REGISTER_OVERALL_MET_PCT,
  VIOLATION_TREND_WEEKLY,
} from "@/lib/role-based-dashboard/rbiObligationRegister";
import {
  CHANNEL_LABELS,
  CONTACT_REASONS_RICH,
  CONTACT_TYPE_COVERAGE,
  EXECUTIVE_LENSES,
  type ExecutiveLens,
  healthDistribution,
  mainGapForObligation,
  OBLIGATION_GROUPS,
  obligationHealth,
  OUTBOUND_LOCATIONS,
  OUTBOUND_OBLIGATION_MET_BY_PURPOSE,
  OUTBOUND_PURPOSE_STATS,
  OUTBOUND_VIOLATIONS,
  REGISTER_STATS,
  SENSITIVE_WIDGETS,
  topControlsByProcess,
  type ChannelKey,
  channelCell,
} from "@/lib/role-based-dashboard/rbiPreviewData";
import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";

import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
} from "./DashboardThemeContext";

const headlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const TODAY = "2026-05-25";

const C = {
  bg: "#070707",
  card: "#0d0d0d",
  inset: "#1a1a1a",
  border: "#242424",
  muted: "#939394",
  teal: "#14b8a6",
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

type Tab = "coverage" | "outbound";

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

function metColor(pct: number): string {
  if (pct >= 85) return C.green;
  if (pct >= 70) return C.amber;
  return C.red;
}

function statusColor(s: string): string {
  switch (s) {
    case "MEETING":
    case "green":
      return C.green;
    case "WATCH":
    case "amber":
      return C.amber;
    case "BREACH":
    case "red":
      return C.red;
    case "MISSING_DATA":
    case "grey":
      return C.muted;
    default:
      return C.teal;
  }
}

const LABEL = "text-[10px] font-black uppercase tracking-wide text-zinc-500";
const NEST = "rounded-xl border border-white/10 bg-black/25 p-3";

function Shell({
  title,
  subtitle,
  accent = C.teal,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-3xl border bg-[#0d0d0d] shadow-[0_18px_64px_-32px_rgba(0,0,0,0.85)]",
        className,
      )}
      style={{ borderColor: C.border }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${accent}66 60%, transparent)`,
        }}
        aria-hidden
      />
      <header className="px-5 pt-5 pb-3">
        <h3 className="text-base font-black text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-[12px] font-semibold text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </header>
      <div className={cx("px-5 pb-5", bodyClassName)}>{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  accent = C.teal,
}: {
  label: string;
  value: string | number;
  delta?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-[#0d0d0d] p-4"
      style={{ borderColor: C.border, borderLeft: `4px solid ${accent}` }}
    >
      <p className={LABEL}>{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums text-white">{value}</p>
      {delta ? (
        <p className="mt-1 text-[11px] font-semibold text-zinc-400">{delta}</p>
      ) : null}
    </div>
  );
}

function Pill({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
      style={{ borderColor: `${color}55`, background: `${color}14`, color }}
    >
      {children}
    </span>
  );
}

// ─── Screen 1 components ─────────────────────────────────────────────────────

function HeroRiskGauge() {
  const score = 100 - Math.round((100 - REGISTER_OVERALL_MET_PCT) * 1.2);
  const dist = healthDistribution();
  const breached = dist.BREACH;
  const r = 78;
  const circ = 2 * Math.PI * r;
  const riskLabel = score >= 75 ? "Elevated" : score >= 60 ? "Watch" : "Controlled";
  const riskColor = score >= 75 ? C.red : score >= 60 ? C.amber : C.green;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative mx-auto size-[200px] shrink-0 lg:mx-0">
        <svg
          viewBox="0 0 200 200"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Conduct risk ${score}, ${riskLabel}`}
        >
          <circle cx="100" cy="100" r={r} fill="none" stroke={C.inset} strokeWidth="14" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={riskColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (score / 100) * circ}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-black text-white">{score}</p>
          <p className="text-[11px] font-black uppercase" style={{ color: riskColor }}>
            {riskLabel}
          </p>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className={NEST}>
          <p className={LABEL}>Obligations met</p>
          <p className="text-xl font-black text-white">{REGISTER_OVERALL_MET_PCT}%</p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Breached</p>
          <p className="text-xl font-black text-red-400">{breached}</p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Missing data impact</p>
          <p className="text-xl font-black text-amber-300">
            {REGISTER_STATS.missingChannelGaps} gaps
          </p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Critical signals</p>
          <p className="text-xl font-black text-red-300">
            {REGISTER_STATS.criticalSignals}
          </p>
        </div>
      </div>
    </div>
  );
}

function CoverageAiInsight() {
  return (
    <section
      className="flex h-full min-h-[240px] flex-col rounded-3xl border bg-gradient-to-br from-indigo-950/50 via-[#0d0d0d] to-[#0d0d0d] p-5"
      style={{ borderColor: `${C.indigo}55` }}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <div>
          <p className={LABEL}>AI insight · obligation coverage</p>
          <p className="text-sm font-black leading-snug text-white">
            OBL-002 First-90s and OBL-001 Complaint Capture drive 64% of this
            week&apos;s exposure
          </p>
        </div>
      </div>
      <ul className="mt-4 flex-1 space-y-2.5 text-[12px] font-semibold leading-relaxed text-zinc-300">
        <li>
          <strong className="text-white">312</strong> complaint-like contacts had
          no CMS SR mapping — start with Mumbai in-house queue.
        </li>
        <li>
          <strong className="text-white">27</strong> recovery calls contain
          threat or distress-dismissal signals — Pune Recovery BPO is the hotspot.
        </li>
        <li>
          KFS read-out on outbound PL sales is <strong className="text-amber-300">62%</strong>{" "}
          — Head of Product / Digital should review Chennai script pack before
          30-Jun IO deadline.
        </li>
      </ul>
      <p className="mt-3 text-[10px] font-bold text-zinc-500">
        Recommended action · Review OBL-002 SR-offer control with Head of CX today
      </p>
    </section>
  );
}

const CHANNEL_KEYS: ChannelKey[] = [
  "inbound_voice",
  "outbound_voice",
  "chat",
  "email",
  "tickets",
  "social",
];

function ObligationChannelMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left text-[10px] font-black uppercase tracking-wide text-zinc-500">
              Obligation group
            </th>
            {CHANNEL_KEYS.map((ch) => (
              <th
                key={ch}
                className="px-2 py-2 text-center text-[10px] font-black uppercase tracking-wide text-zinc-500"
              >
                {CHANNEL_LABELS[ch]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {OBLIGATION_GROUPS.map((g) => (
            <tr key={g.key}>
              <td className="rounded-lg bg-black/40 px-2 py-2">
                <p className="text-[11px] font-black text-white">{g.label}</p>
                <p className="text-[10px] font-semibold text-zinc-500">
                  {g.obligationIds.join(" · ")}
                </p>
              </td>
              {CHANNEL_KEYS.map((ch) => {
                const cell = channelCell(g.key, ch);
                const col = statusColor(cell.status);
                if (cell.contacts === 0) {
                  return (
                    <td
                      key={ch}
                      className="rounded-lg bg-zinc-900/40 px-1 py-2 text-center text-[10px] text-zinc-600"
                    >
                      N/A
                    </td>
                  );
                }
                return (
                  <td
                    key={ch}
                    className="rounded-lg px-1 py-2 text-center"
                    style={{
                      background: `${col}18`,
                      border: `1px solid ${col}44`,
                    }}
                    title={`${fmt(cell.contacts)} contacts · ${fmt(cell.signals)} signals`}
                  >
                    <p className="text-[10px] font-black tabular-nums text-white">
                      {fmt(cell.contacts)}
                    </p>
                    <p className="text-[9px] font-bold" style={{ color: col }}>
                      {fmt(cell.signals)} sig
                    </p>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeetingObligationPanel() {
  const rows = [...OBLIGATION_MET_SUMMARIES].sort(
    (a, b) => a.metPct - b.metPct,
  );

  return (
    <div className="max-h-[min(480px,65vh)] overflow-x-hidden overflow-y-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "26%" }} />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-[#0a0a0a] shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
          <tr className="border-b border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-wide text-zinc-500">
            <th className="px-3 py-2 text-left font-black">ID</th>
            <th className="px-3 py-2 text-left font-black">Obligation</th>
            <th className="px-3 py-2 text-left font-black">Met % · Status</th>
            <th className="px-3 py-2 text-left font-black">Main gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => {
            const health = obligationHealth(o.metPct);
            return (
              <tr
                key={o.obligationId}
                className="border-b border-white/5 align-top"
              >
                <td className="px-3 py-2.5 align-top">
                  <span className="text-[11px] font-black text-teal-300">
                    {o.obligationId}
                  </span>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <p className="whitespace-normal break-words text-[11px] font-bold leading-snug text-white">
                    {o.obligation}
                  </p>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="text-[11px] font-black tabular-nums"
                      style={{ color: metColor(o.metPct) }}
                    >
                      {o.metPct}%
                    </span>
                    <Pill color={statusColor(health)}>{health}</Pill>
                  </div>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <p className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-zinc-400">
                    {mainGapForObligation(o.obligationId)}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ContactReasonsMap() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] table-fixed border-collapse">
        <colgroup>
          <col style={{ width: "22%" }} />
          <col style={{ width: "72px" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "12%" }} />
          <col />
          <col style={{ width: "72px" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-wide text-zinc-500">
            <th className="px-3 py-2 text-left font-black">Contact reason</th>
            <th className="px-3 py-2 text-left font-black">Volume</th>
            <th className="px-3 py-2 text-left font-black">Obligations</th>
            <th className="px-3 py-2 text-left font-black">Channel</th>
            <th className="px-3 py-2 text-left font-black">Top signal</th>
            <th className="px-3 py-2 text-left font-black">Risk</th>
          </tr>
        </thead>
        <tbody>
          {CONTACT_REASONS_RICH.map((r) => (
            <tr key={r.reason} className="border-b border-white/5 align-middle">
              <td className="px-3 py-2.5 align-middle">
                <p className="text-[11px] font-black text-white">{r.reason}</p>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <span className="text-[11px] font-black tabular-nums text-zinc-200">
                  {fmt(r.volume)}
                </span>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <span className="text-[10px] font-bold text-teal-300">
                  {r.obligations.join(" · ")}
                </span>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <span className="text-[10px] font-semibold text-zinc-400">
                  {r.topChannel}
                </span>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <p className="truncate text-[10px] font-semibold text-zinc-400">
                  {r.topSignal}
                </p>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <Pill
                  color={
                    r.risk === "CRITICAL"
                      ? C.red
                      : r.risk === "HIGH"
                        ? C.amber
                        : C.yellow
                  }
                >
                  {r.risk}
                </Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactTypeCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CONTACT_TYPE_COVERAGE.map((t) => (
        <div
          key={t.type}
          className="rounded-2xl border border-white/10 bg-black/25 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-black text-white">{t.type}</p>
            <Pill color={statusColor(t.status)}>{t.status}</Pill>
          </div>
          <p className="mt-2 text-xl font-black tabular-nums text-white">
            {fmt(t.contacts)}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-zinc-500">
            {t.obligations} obligations · {fmt(t.signals)} signals
          </p>
        </div>
      ))}
    </div>
  );
}

function ProcessControlCoverage() {
  const rows = topControlsByProcess(FLUID_ALONE_CONTROLS, 14);
  return (
    <div className="max-h-[min(480px,65vh)] overflow-x-hidden overflow-y-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col style={{ width: "24%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "32%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-[#0a0a0a] shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
          <tr className="border-b border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-wide text-zinc-500">
            <th className="px-3 py-2 text-left font-black">Process</th>
            <th className="px-3 py-2 text-left font-black">Obligation</th>
            <th className="px-3 py-2 text-left font-black">Control checked</th>
            <th className="px-3 py-2 text-left font-black">Detection signal</th>
            <th className="px-3 py-2 text-left font-black">Met %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr
              key={c.controlId}
              className="border-b border-white/5 align-middle"
            >
              <td className="px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[10px] font-bold leading-snug text-zinc-300">
                  {c.process}
                </p>
              </td>
              <td className="max-w-0 px-3 py-2.5 align-middle">
                <span className="truncate text-[10px] font-black text-teal-300">
                  {c.obligationId}
                </span>
              </td>
              <td className="max-w-0 px-3 py-2.5 align-middle">
                <p className="truncate text-[10px] font-semibold text-white">
                  {c.control}
                </p>
              </td>
              <td className="max-w-0 px-3 py-2.5 align-middle">
                <p className="truncate text-[10px] font-semibold text-zinc-500">
                  {c.detectionSignal}
                </p>
              </td>
              <td className="max-w-0 px-3 py-2.5 align-middle">
                <span
                  className="text-[11px] font-black tabular-nums"
                  style={{ color: metColor(c.adherencePct ?? 0) }}
                >
                  {c.adherencePct ?? "—"}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SensitiveWidgets() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SENSITIVE_WIDGETS.map((w) => (
        <div
          key={w.label}
          className="rounded-2xl border p-3"
          style={{
            borderColor: `${w.color}44`,
            background: `${w.color}0a`,
          }}
        >
          <p className="text-[11px] font-black text-white">{w.label}</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-2xl font-black tabular-nums text-white">
              {w.count}
            </p>
            <span
              className={cx(
                "text-[10px] font-black",
                w.trend.startsWith("+")
                  ? "text-red-400"
                  : w.trend.startsWith("-")
                    ? "text-green-400"
                    : "text-zinc-400",
              )}
            >
              {w.trend}
            </span>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-zinc-500">
            {w.obligationId} · {w.channel}
          </p>
        </div>
      ))}
    </div>
  );
}

function CoverageScreen() {
  const dist = healthDistribution();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Shell
          className="xl:col-span-5"
          title="Overall conduct risk score"
          subtitle="Met obligations · breach load · missing data · critical signals"
          accent={C.teal}
        >
          <HeroRiskGauge />
        </Shell>
        <div className="xl:col-span-7">
          <CoverageAiInsight />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <Kpi label="RBI obligations" value={REGISTER_STATS.totalObligations} />
        <Kpi
          label="Interaction-monitorable"
          value={REGISTER_STATS.interactionMonitorable}
        />
        <Kpi label="Meeting expected conduct" value={dist.MEETING} accent={C.green} />
        <Kpi label="At risk" value={dist.WATCH + dist.BREACH} accent={C.amber} />
        <Kpi
          label="Conversation controls"
          value={REGISTER_STATS.conversationControls}
          delta={`of ${REGISTER_STATS.totalControls} in register`}
        />
        <Kpi label="Contacts analysed" value={fmt(REGISTER_STATS.contactsAnalysed)} />
        <Kpi label="Conduct signals" value={fmt(REGISTER_STATS.conductSignals)} accent={C.amber} />
        <Kpi
          label="Evidence ready"
          value={`${REGISTER_STATS.evidenceReadyPct}%`}
          accent={C.green}
        />
      </div>

      <Shell
        title="Obligation × channel signal map"
        subtitle="Contacts analysed and signals detected per obligation group and channel"
        accent={C.cyan}
      >
        <ObligationChannelMatrix />
      </Shell>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Shell
          className="h-full xl:col-span-7"
          title="Are we meeting the obligation?"
          subtitle="Met % · status · main gap"
          accent={C.teal}
        >
          <MeetingObligationPanel />
        </Shell>

        <Shell
          className="h-full xl:col-span-5"
          title="Why customers are contacting us — mapped to RBI obligations"
          subtitle="Inbound drivers · volume · obligations · channel · signal · risk"
          accent={C.purple}
        >
          <ContactReasonsMap />
        </Shell>
      </div>

      <Shell
        title="Contacts analysed by interaction type"
        subtitle="Coverage across inbound, outbound, complaint, fraud, vulnerable, and BPO-handled contacts"
        accent={C.indigo}
      >
        <ContactTypeCards />
      </Shell>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Shell
          className="xl:col-span-8"
          title="Process · obligation · control coverage"
          subtitle="What is checked from recorded conversation · detection signal · adherence"
          accent={C.teal}
        >
          <ProcessControlCoverage />
        </Shell>
        <Shell
          className="xl:col-span-4"
          title="Sensitive conduct signals"
          subtitle="Compact widgets · count · trend · obligation"
          accent={C.red}
        >
          <SensitiveWidgets />
        </Shell>
      </div>
    </div>
  );
}

// ─── Screen 2 components ─────────────────────────────────────────────────────

function OutboundAiInsight() {
  return (
    <section
      className="rounded-3xl border bg-gradient-to-br from-amber-950/40 via-[#0d0d0d] to-[#0d0d0d] p-5"
      style={{ borderColor: `${C.amber}55` }}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
          <Radar className="size-5" aria-hidden />
        </span>
        <div>
          <p className={LABEL}>AI insight · outbound & location</p>
          <p className="text-sm font-black text-white">
            Recovery outbound at Pune BPO accounts for 41% of location-level
            breaches — sales bundling concentrated at Hyderabad outsource site
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-2 text-[12px] font-semibold text-zinc-300">
        <li>
          <strong className="text-white">OBL-005</strong> threat-language on
          recovery: 87 breaches / 7d · suspend dialler batch #RC-441 pending
          vendor attestation.
        </li>
        <li>
          <strong className="text-white">OBL-018</strong> bundling on salary-a/c
          outbound: Helios Hyderabad 54 breaches vs 12 in-house Bengaluru.
        </li>
        <li>
          Kolkata BPO missing recording on <strong className="text-amber-300">4</strong>{" "}
          channels — language-routing signals under-reported for OBL-029.
        </li>
      </ul>
    </section>
  );
}

function OutboundPurposeCards() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {OUTBOUND_PURPOSE_STATS.map((p) => (
        <div
          key={p.purpose}
          className="rounded-2xl border p-4"
          style={{
            borderColor: `${p.color}44`,
            background: `${p.color}0a`,
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-black uppercase text-white">
              {p.purpose}
            </p>
            <Megaphone className="size-4" style={{ color: p.color }} aria-hidden />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-white">
            {fmt(p.calls)}
          </p>
          <p className="text-[10px] font-semibold text-zinc-500">calls / 7d</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className={NEST}>
              <p className={LABEL}>Obls</p>
              <p className="text-sm font-black text-white">{p.obligations}</p>
            </div>
            <div className={NEST}>
              <p className={LABEL}>Breach</p>
              <p className="text-sm font-black text-red-300">{p.breaches}</p>
            </div>
            <div className={NEST}>
              <p className={LABEL}>Pass</p>
              <p className="text-sm font-black" style={{ color: metColor(p.passRate) }}>
                {p.passRate}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-400">
            Top issue: {p.topIssue}
          </p>
        </div>
      ))}
    </div>
  );
}

function LocationTable() {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[1100px] border-b border-white/10 bg-black/40 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-500"
        style={{
          gridTemplateColumns:
            "minmax(160px,1.2fr) 90px 110px 90px 80px 80px 70px 70px minmax(160px,1fr)",
        }}
      >
        <span>Location</span>
        <span>Type</span>
        <span>Vendor</span>
        <span>Calls</span>
        <span>Purpose</span>
        <span>Obls</span>
        <span>Breach</span>
        <span>Risk</span>
        <span>Top issue</span>
      </div>
      <div className="divide-y divide-white/5">
        {OUTBOUND_LOCATIONS.map((l) => (
          <div
            key={l.id}
            className="grid min-w-[1100px] items-center gap-2 px-3 py-2.5"
            style={{
              gridTemplateColumns:
                "minmax(160px,1.2fr) 90px 110px 90px 80px 80px 70px 70px minmax(160px,1fr)",
            }}
          >
            <div>
              <p className="text-[11px] font-black text-white">{l.name}</p>
              <p className="text-[10px] font-semibold text-zinc-500">{l.city}</p>
            </div>
            <Pill color={l.type === "IN_SOURCE" ? C.teal : C.purple}>
              {l.type === "IN_SOURCE" ? "In-house" : "Outsource"}
            </Pill>
            <span className="truncate text-[10px] font-bold text-zinc-300">
              {l.vendor ?? "—"}
            </span>
            <span className="text-[11px] font-black tabular-nums text-white">
              {fmt(l.calls)}
            </span>
            <span className="text-[10px] font-semibold text-zinc-400">
              {l.purpose}
            </span>
            <span className="text-[11px] font-black text-zinc-200">
              {l.obligations}
            </span>
            <span className="text-[11px] font-black text-red-300">
              {l.breaches}
              {l.missingData > 0 ? (
                <span className="text-amber-400"> · {l.missingData}md</span>
              ) : null}
            </span>
            <span
              className="text-[11px] font-black"
              style={{
                color:
                  l.riskScore >= 70
                    ? C.red
                    : l.riskScore >= 45
                      ? C.amber
                      : C.green,
              }}
            >
              {l.riskScore}
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

function LocationBreachChart() {
  const data = OUTBOUND_LOCATIONS.map((l) => ({
    name: l.city,
    breaches: l.breaches,
    risk: l.riskScore,
  }));
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} />
          <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "#121212",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 11,
            }}
          />
          <Bar dataKey="breaches" fill={C.red} radius={[4, 4, 0, 0]} name="Breaches" />
          <Bar dataKey="risk" fill={C.amber} radius={[4, 4, 0, 0]} name="Risk score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OutboundViolationFeed() {
  return (
    <div className="space-y-2">
      {OUTBOUND_VIOLATIONS.map((v) => (
        <div
          key={v.ts + v.signal}
          className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5"
        >
          <Pill
            color={
              v.severity === "CRITICAL"
                ? C.red
                : v.severity === "HIGH"
                  ? C.amber
                  : C.yellow
            }
          >
            {v.severity}
          </Pill>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black text-white">{v.signal}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
              {v.location} · {v.purpose} · {v.obligationId} ·{" "}
              {new Date(v.ts).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OutboundViolationTrend() {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[...VIOLATION_TREND_WEEKLY]}>
          <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 10 }} />
          <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "#121212",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="violations"
            stroke={C.amber}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="breaches"
            stroke={C.red}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function OutboundObligationByPurpose() {
  const slotKeys = ["obl1", "obl2", "obl3", "obl4"] as const;
  const slotColors = [C.purple, C.amber, C.teal, C.blue];
  const chartData = OUTBOUND_OBLIGATION_MET_BY_PURPOSE.map((row) => ({
    purpose: row.purpose,
    ...Object.fromEntries(
      row.obligations.map((o, i) => [slotKeys[i], o.metPct]),
    ),
  }));

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
          <XAxis dataKey="purpose" tick={{ fill: C.muted, fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "#121212",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 11,
            }}
            formatter={(value: number, _name, item): [string, string] => {
              const purposeRow = OUTBOUND_OBLIGATION_MET_BY_PURPOSE.find(
                (r) => r.purpose === item.payload.purpose,
              );
              const slotIndex = slotKeys.indexOf(
                item.dataKey as (typeof slotKeys)[number],
              );
              const obligationId: string =
                purposeRow?.obligations[slotIndex]?.id ??
                String(item.dataKey ?? "Obligation");
              return [`${value}% met`, obligationId];
            }}
          />
          {slotKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={slotColors[i]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OutboundScreen() {
  return (
    <div className="space-y-5">
      <OutboundAiInsight />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Outbound calls / 7d" value={fmt(110_600)} accent={C.teal} />
        <Kpi label="Locations monitored" value={OUTBOUND_LOCATIONS.length} />
        <Kpi
          label="Outbound breaches"
          value={346}
          delta="Sales 186 · Recovery 142 · Feedback 18"
          accent={C.red}
        />
        <Kpi
          label="Sites with missing data"
          value={2}
          delta="Kolkata BPO · Pune BPO partial feed"
          accent={C.amber}
        />
      </div>

      <Shell
        title="Outbound purpose coverage"
        subtitle="Sales · Feedback · Recovery — obligations applicable · breaches · pass rate"
        accent={C.purple}
      >
        <OutboundPurposeCards />
      </Shell>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Shell
          className="xl:col-span-7"
          title="Conduct by contact centre / location"
          subtitle="In-house vs outsourced · obligations · breaches · risk · missing data flagged"
          accent={C.teal}
        >
          <LocationTable />
        </Shell>
        <Shell
          className="xl:col-span-5"
          title="Breaches & risk by location"
          subtitle="Where action is needed first"
          accent={C.red}
        >
          <LocationBreachChart />
        </Shell>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Shell
          title="Obligation met % by outbound purpose"
          subtitle="Which obligations apply to sales vs recovery vs feedback calls"
          accent={C.indigo}
        >
          <OutboundObligationByPurpose />
        </Shell>
        <Shell
          title="Violation trend · 7 weeks"
          subtitle="Outbound conduct violations vs confirmed breaches"
          accent={C.amber}
        >
          <OutboundViolationTrend />
        </Shell>
      </div>

      <Shell
        title="Recent outbound violations"
        subtitle="Sales · recovery · feedback — obligation · location · detected signal"
        accent={C.red}
      >
        <OutboundViolationFeed />
      </Shell>

      <Shell
        title="Why customers receive outbound calls — obligation map"
        subtitle="Outbound drivers mapped to conduct obligations (recovery pressure · bundling · KFS)"
        accent={C.purple}
      >
        <ContactReasonsMap />
      </Shell>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "coverage" as const,
    label: "RBI Obligation Coverage Dashboard",
    sub: "Contacts analysed · obligations monitored · signals · evidence readiness",
    icon: ShieldCheck,
  },
  {
    key: "outbound" as const,
    label: "Outbound Conduct & Location Intelligence",
    sub: "Sales · feedback · recovery · contact centres · violations · action",
    icon: Phone,
  },
];

const FALLBACK_THEME: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#070707",
  surface: "#121212",
  card: "#0d0d0d",
  elevated: "#1a1a1a",
  border: "#242424",
  borderLight: "#3a3a3a",
};

export type RbiConductIntelligencePreviewProps = {
  industryName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
  defaultLens?: ExecutiveLens;
};

export function RbiConductIntelligencePreview({
  industryColor,
  onExit,
  theme,
  defaultLens = "L1",
}: RbiConductIntelligencePreviewProps) {
  const [tab, setTab] = useState<Tab>("coverage");
  const [lens, setLens] = useState<ExecutiveLens>(defaultLens);
  const [sidebarHover, setSidebarHover] = useState(false);
  const lensMeta = EXECUTIVE_LENSES[lens];
  const SIDEBAR_W_EXPANDED = 268;
  const SIDEBAR_W_COLLAPSED = 76;
  const sidebarW = sidebarHover ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <DashboardThemeProvider value={theme ?? FALLBACK_THEME}>
      <div className="relative flex h-screen overflow-hidden bg-[#070707] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_34%)]" />

        <aside
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          className="relative z-20 flex shrink-0 flex-col overflow-hidden border-r bg-[#0a0a0a]/98"
          style={{
            width: sidebarW,
            minWidth: sidebarW,
            borderColor: C.border,
            transition: "width 0.22s ease, min-width 0.22s ease",
          }}
          aria-label="Dashboard views"
        >
          <div
            className="border-b"
            style={{
              borderColor: C.border,
              padding: sidebarHover ? "18px 16px" : "14px 10px",
              textAlign: sidebarHover ? "left" : "center",
            }}
          >
            {sidebarHover ? (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-300">
                  Views
                </p>
                <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                  Coverage · outbound intelligence
                </p>
              </>
            ) : (
              <span
                className="mx-auto grid size-9 place-items-center rounded-xl text-teal-300"
                style={{
                  background: `${C.teal}22`,
                  border: `1px solid ${C.teal}44`,
                }}
                title="RBI Conduct Intelligence views"
              >
                <ShieldCheck className="size-4" aria-hidden />
              </span>
            )}
          </div>

          <nav
            className="flex-1 overflow-x-hidden overflow-y-auto"
            style={{ padding: sidebarHover ? "10px 8px" : "8px 6px" }}
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  title={t.label}
                  className={cx(
                    "mb-1.5 flex w-full items-center rounded-lg border-none text-left transition",
                    active ? "bg-teal-500/10" : "bg-transparent hover:bg-white/[0.04]",
                  )}
                  style={{
                    padding: sidebarHover ? "8px 10px" : "10px 8px",
                    gap: sidebarHover ? 8 : 0,
                    justifyContent: sidebarHover ? "flex-start" : "center",
                    borderLeft: active
                      ? `3px solid ${C.teal}`
                      : "3px solid transparent",
                  }}
                >
                  <span
                    className="grid size-6 shrink-0 place-items-center rounded-md"
                    style={{
                      background: active ? `${C.teal}22` : `${C.muted}20`,
                      color: active ? C.teal : C.muted,
                    }}
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {sidebarHover ? (
                    <span className="min-w-0">
                      <span
                        className={cx(
                          "block text-[12px] leading-snug",
                          active ? "font-bold text-white" : "font-medium text-zinc-300",
                        )}
                      >
                        {t.label}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-zinc-500">
                        {t.sub}
                      </span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <header
            className="shrink-0 border-b bg-[#070707]/95 backdrop-blur"
            style={{ borderColor: C.border }}
          >
            <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] py-2 pr-3 pl-2.5 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                  style={{ borderLeftWidth: 3, borderLeftColor: industryColor }}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 place-items-center rounded-2xl text-white"
                    style={{
                      background: `linear-gradient(135deg, ${C.teal}, ${C.indigo})`,
                    }}
                  >
                    <Shield className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-300">
                      RBI Conduct Intelligence · Preview
                    </p>
                    <h1
                      className={cx(
                        headlineFont.className,
                        "text-xl font-bold sm:text-2xl",
                      )}
                    >
                      {TABS.find((t) => t.key === tab)?.label ??
                        "RBI Conduct Intelligence"}
                    </h1>
                    <p className="text-[11px] font-semibold text-zinc-400">
                      Private sector bank · post-Nov 2025 RBI rulebook · {TODAY}{" "}
                      · {lensMeta.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 md:flex">
                  <Activity className="size-3.5 text-teal-300" aria-hidden />
                  <span className="text-[10px] font-black uppercase text-zinc-400">
                    {fmt(REGISTER_STATS.contactsAnalysed)} interactions · 100%
                    voice
                  </span>
                </div>
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 md:flex">
                  <Languages className="size-3.5 text-teal-300" aria-hidden />
                  <span className="text-[10px] font-black uppercase text-zinc-400">
                    en · hi · ta · te · kn · mr
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
                  {(Object.keys(EXECUTIVE_LENSES) as ExecutiveLens[]).map(
                    (id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setLens(id)}
                        title={EXECUTIVE_LENSES[id].title}
                        className={cx(
                          "rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wide transition",
                          lens === id
                            ? "bg-teal-500/25 text-teal-100 ring-1 ring-teal-500/50"
                            : "text-zinc-500 hover:text-white",
                        )}
                      >
                        {id}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-5">
            {tab === "coverage" ? <CoverageScreen /> : <OutboundScreen />}
          </main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
}

export default RbiConductIntelligencePreview;
