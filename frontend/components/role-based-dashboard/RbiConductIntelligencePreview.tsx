"use client";

import {
  ArrowLeft,
  Briefcase,
  ChevronRight,
  FileText,
  Globe,
  Headphones,
  Heart,
  Megaphone,
  MessagesSquare,
  Phone,
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Moon,
  Sparkles,
  Sun,
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
import {
  RbiConductThemeProvider,
  useRbiConductTheme,
} from "./RbiConductThemeContext";
import { RBI_ACCENT } from "./rbiConductTheme";

const headlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const TODAY = "2026-05-25";

/** Accent colors — shared across light and dark RBI Conduct themes. */
const C = RBI_ACCENT;

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

const LABEL =
  "text-[10px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]";
const NEST =
  "rounded-xl border border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-subtle-bg)] p-3";

function Shell({
  title,
  subtitle,
  accent = C.teal,
  className,
  bodyClassName,
  headerClassName,
  children,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-3xl border bg-[var(--rbi-card)] shadow-[0_18px_64px_-32px_var(--rbi-shell-shadow)]",
        className,
      )}
      style={{ borderColor: "var(--rbi-border)" }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${accent}66 60%, transparent)`,
        }}
        aria-hidden
      />
      <header className={cx("px-5 pt-5 pb-3", headerClassName)}>
        <h3 className="text-base font-black text-[var(--rbi-text)]">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-[12px] font-semibold text-[var(--rbi-text-muted)]">
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
  compact = false,
}: {
  label: string;
  value: string | number;
  delta?: string;
  accent?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cx("rounded-2xl border bg-[var(--rbi-card)]", compact ? "p-3" : "p-4")}
      style={{ borderColor: "var(--rbi-border)", borderLeft: `4px solid ${accent}` }}
    >
      <p className={LABEL}>{label}</p>
      <p
        className={cx(
          "font-black tabular-nums text-[var(--rbi-text)]",
          compact ? "mt-1 text-xl" : "mt-2 text-2xl",
        )}
      >
        {value}
      </p>
      {delta ? (
        <p className="mt-0.5 text-[10px] font-semibold text-[var(--rbi-text-muted)]">{delta}</p>
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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative mx-auto size-[168px] shrink-0 lg:mx-0">
        <svg
          viewBox="0 0 200 200"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Conduct risk ${score}, ${riskLabel}`}
        >
          <circle cx="100" cy="100" r={r} fill="none" stroke="var(--rbi-inset)" strokeWidth="14" />
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
          <p className="text-3xl font-black text-[var(--rbi-text)]">{score}</p>
          <p className="text-[10px] font-black uppercase" style={{ color: riskColor }}>
            {riskLabel}
          </p>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        <div className={NEST}>
          <p className={LABEL}>Obligations met</p>
          <p className="text-lg font-black text-[var(--rbi-text)]">{REGISTER_OVERALL_MET_PCT}%</p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Breached</p>
          <p className="text-lg font-black text-red-400">{breached}</p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Missing data impact</p>
          <p className="text-lg font-black text-amber-300">
            {REGISTER_STATS.missingChannelGaps} gaps
          </p>
        </div>
        <div className={NEST}>
          <p className={LABEL}>Critical signals</p>
          <p className="text-lg font-black text-red-300">
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
      className="flex h-full min-h-0 flex-col rounded-3xl border bg-gradient-to-br from-[var(--rbi-gradient-coverage-from)] via-[var(--rbi-card)] to-[var(--rbi-card)] p-4"
      style={{ borderColor: `${C.indigo}55` }}
    >
      <div className="flex items-start gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div>
          <p className={LABEL}>AI insight · obligation coverage</p>
          <p className="text-[13px] font-black leading-snug text-[var(--rbi-text)]">
            OBL-002 First-90s and OBL-001 Complaint Capture drive 64% of this
            week&apos;s exposure
          </p>
        </div>
      </div>
      <ul className="mt-3 flex-1 space-y-2 text-[11px] font-semibold leading-snug text-[var(--rbi-text-secondary)]">
        <li>
          <strong className="text-[var(--rbi-text)]">312</strong> complaint-like contacts had
          no CMS SR mapping — start with Mumbai in-house queue.
        </li>
        <li>
          <strong className="text-[var(--rbi-text)]">27</strong> recovery calls contain
          threat or distress-dismissal signals — Pune Recovery BPO is the hotspot.
        </li>
        <li>
          KFS read-out on outbound PL sales is <strong className="text-amber-300">62%</strong>{" "}
          — Head of Product / Digital should review Chennai script pack before
          30-Jun IO deadline.
        </li>
      </ul>
      <p className="mt-2 text-[10px] font-bold text-[var(--rbi-text-dim)]">
        Recommended action · Review OBL-002 SR-offer control with Head of CX today
      </p>
    </section>
  );
}

function formatLocationBreachLabel(breaches: number, missingData: number): string {
  const breachLabel = `${breaches} breach${breaches === 1 ? "" : "es"}`;
  if (missingData === 0) return breachLabel;
  const gapLabel = `${missingData} data gap${missingData === 1 ? "" : "s"}`;
  return `${breachLabel} · ${gapLabel}`;
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
            <th className="px-2 py-2 text-left text-[10px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]">
              Obligation group
            </th>
            {CHANNEL_KEYS.map((ch) => (
              <th
                key={ch}
                className="px-2 py-2 text-center text-[10px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]"
              >
                {CHANNEL_LABELS[ch]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {OBLIGATION_GROUPS.map((g) => (
            <tr key={g.key}>
              <td className="rounded-lg bg-[var(--rbi-table-head)] px-2 py-2">
                <p className="text-[11px] font-black text-[var(--rbi-text)]">{g.label}</p>
                <p className="text-[10px] font-semibold text-[var(--rbi-text-dim)]">
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
                      className="rounded-lg bg-[var(--rbi-subtle-bg)] px-1 py-2 text-center text-[10px] text-[var(--rbi-text-dim)]"
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
                    <p className="text-[10px] font-black tabular-nums text-[var(--rbi-text)]">
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
        <thead className="sticky top-0 z-10 bg-[var(--rbi-table-head-sticky)] shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
          <tr className="border-b border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-table-head)] text-[9px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]">
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
                className="border-b border-[color:var(--rbi-border-subtle)] align-top"
              >
                <td className="px-3 py-2.5 align-top">
                  <span className="text-[11px] font-black text-teal-300">
                    {o.obligationId}
                  </span>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <p className="whitespace-normal break-words text-[11px] font-bold leading-snug text-[var(--rbi-text)]">
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
                  <p className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-[var(--rbi-text-muted)]">
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

function ContactReasonsMap({ scrollable = false }: { scrollable?: boolean }) {
  return (
    <div
      className={cx(
        "w-full overflow-x-auto",
        scrollable && "max-h-[min(480px,65vh)] overflow-y-auto pr-1",
      )}
    >
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[9%]" />
          <col className="w-[14%]" />
          <col className="w-[12%]" />
          <col className="w-[33%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead
          className={
            scrollable
              ? "sticky top-0 z-10 bg-[var(--rbi-table-head-sticky)] shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
              : undefined
          }
        >
          <tr className="border-b border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-table-head)] text-[9px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]">
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
            <tr key={r.reason} className="border-b border-[color:var(--rbi-border-subtle)] align-top">
              <td className="px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[11px] font-black leading-snug text-[var(--rbi-text)]">
                  {r.reason}
                </p>
              </td>
              <td className="px-3 py-2.5 align-top">
                <span className="text-[11px] font-black tabular-nums text-[var(--rbi-text-secondary)]">
                  {fmt(r.volume)}
                </span>
              </td>
              <td className="px-3 py-2.5 align-top">
                <span className="whitespace-normal break-words text-[10px] font-bold leading-snug text-teal-300">
                  {r.obligations.join(" · ")}
                </span>
              </td>
              <td className="px-3 py-2.5 align-top">
                <span className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-[var(--rbi-text-muted)]">
                  {r.topChannel}
                </span>
              </td>
              <td className="min-w-0 px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-[var(--rbi-text-muted)]">
                  {r.topSignal}
                </p>
              </td>
              <td className="px-3 py-2.5 align-top">
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
          className="rounded-2xl border border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-subtle-bg)] p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-black text-[var(--rbi-text)]">{t.type}</p>
            <Pill color={statusColor(t.status)}>{t.status}</Pill>
          </div>
          <p className="mt-2 text-xl font-black tabular-nums text-[var(--rbi-text)]">
            {fmt(t.contacts)}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[var(--rbi-text-dim)]">
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
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: "18%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "35%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-[var(--rbi-table-head-sticky)] shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
          <tr className="border-b border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-table-head)] text-[9px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]">
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
              className="border-b border-[color:var(--rbi-border-subtle)] align-top"
            >
              <td className="px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[10px] font-bold leading-snug text-[var(--rbi-text-secondary)]">
                  {c.process}
                </p>
              </td>
              <td className="px-3 py-2.5 align-top">
                <span className="text-[10px] font-black text-teal-300">
                  {c.obligationId}
                </span>
              </td>
              <td className="px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-[var(--rbi-text)]">
                  {c.control}
                </p>
              </td>
              <td className="px-3 py-2.5 align-top">
                <p className="whitespace-normal break-words text-[10px] font-semibold leading-snug text-[var(--rbi-text-muted)]">
                  {c.detectionSignal}
                </p>
              </td>
              <td className="px-3 py-2.5 align-top">
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

function SensitiveWidgets({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cx(
        "grid gap-2",
        compact
          ? "grid-cols-2 md:grid-cols-4 xl:grid-cols-4"
          : "grid-cols-2 md:grid-cols-4",
      )}
    >
      {SENSITIVE_WIDGETS.map((w) => (
        <div
          key={w.label}
          className="rounded-xl border px-2.5 py-2"
          style={{
            borderColor: `${w.color}44`,
            background: `${w.color}0a`,
          }}
        >
          <p className="truncate text-[10px] font-black text-[var(--rbi-text)]">{w.label}</p>
          <div className="mt-1 flex items-center justify-between gap-1">
            <p className="text-lg font-black tabular-nums text-[var(--rbi-text)]">{w.count}</p>
            <span
              className={cx(
                "text-[9px] font-black",
                w.trend.startsWith("+")
                  ? "text-red-400"
                  : w.trend.startsWith("-")
                    ? "text-green-400"
                    : "text-[var(--rbi-text-muted)]",
              )}
            >
              {w.trend}
            </span>
          </div>
          <p className="mt-1 truncate text-[9px] font-semibold text-[var(--rbi-text-dim)]">
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Shell
          className="xl:col-span-5"
          title="Overall conduct risk score"
          subtitle="Met obligations · breach load · missing data · critical signals"
          accent={C.teal}
          headerClassName="px-4 pt-4 pb-2"
          bodyClassName="px-4 pb-4"
        >
          <HeroRiskGauge />
        </Shell>
        <div className="xl:col-span-7">
          <CoverageAiInsight />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
        <Kpi compact label="RBI obligations" value={REGISTER_STATS.totalObligations} />
        <Kpi
          compact
          label="Interaction-monitorable"
          value={REGISTER_STATS.interactionMonitorable}
        />
        <Kpi compact label="Meeting expected conduct" value={dist.MEETING} accent={C.green} />
        <Kpi compact label="At risk" value={dist.WATCH + dist.BREACH} accent={C.amber} />
        <Kpi
          compact
          label="Conversation controls"
          value={REGISTER_STATS.conversationControls}
          delta={`of ${REGISTER_STATS.totalControls} in register`}
        />
        <Kpi compact label="Contacts analysed" value={fmt(REGISTER_STATS.contactsAnalysed)} />
        <Kpi compact label="Conduct signals" value={fmt(REGISTER_STATS.conductSignals)} accent={C.amber} />
        <Kpi
          compact
          label="Evidence ready"
          value={`${REGISTER_STATS.evidenceReadyPct}%`}
          accent={C.green}
        />
      </div>

      <Shell
        title="Sensitive conduct signals"
        subtitle="Key indicators · count · trend · obligation · channel"
        accent={C.red}
        headerClassName="px-4 pt-4 pb-2"
        bodyClassName="px-4 pb-4 pt-0"
      >
        <SensitiveWidgets compact />
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
          <ContactReasonsMap scrollable />
        </Shell>
      </div>

      <Shell
        title="Process · obligation · control coverage"
        subtitle="What is checked from recorded conversation · detection signal · adherence"
        accent={C.teal}
      >
        <ProcessControlCoverage />
      </Shell>

      <Shell
        title="Obligation × channel signal map"
        subtitle="Contacts analysed and signals detected per obligation group and channel"
        accent={C.cyan}
      >
        <ObligationChannelMatrix />
      </Shell>

      <Shell
        title="Contacts analysed by interaction type"
        subtitle="Coverage across inbound, outbound, complaint, fraud, vulnerable, and BPO-handled contacts"
        accent={C.indigo}
      >
        <ContactTypeCards />
      </Shell>
    </div>
  );
}

// ─── Screen 2 components ─────────────────────────────────────────────────────

function OutboundAiInsight() {
  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-3xl border bg-gradient-to-br from-[var(--rbi-gradient-outbound-from)] via-[var(--rbi-card)] to-[var(--rbi-card)] p-4"
      style={{ borderColor: `${C.amber}55` }}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
          <Radar className="size-5" aria-hidden />
        </span>
        <div>
          <p className={LABEL}>AI insight · outbound & location</p>
          <p className="text-sm font-black text-[var(--rbi-text)]">
            Recovery outbound at Pune BPO accounts for 41% of location-level
            breaches — sales bundling concentrated at Hyderabad outsource site
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-2 text-[12px] font-semibold text-[var(--rbi-text-secondary)]">
        <li>
          <strong className="text-[var(--rbi-text)]">OBL-005</strong> threat-language on
          recovery: 87 breaches / 7d · suspend dialler batch #RC-441 pending
          vendor attestation.
        </li>
        <li>
          <strong className="text-[var(--rbi-text)]">OBL-018</strong> bundling on salary-a/c
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
            <p className="text-[12px] font-black uppercase text-[var(--rbi-text)]">
              {p.purpose}
            </p>
            <Megaphone className="size-4" style={{ color: p.color }} aria-hidden />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-[var(--rbi-text)]">
            {fmt(p.calls)}
          </p>
          <p className="text-[10px] font-semibold text-[var(--rbi-text-dim)]">calls / 7d</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className={NEST}>
              <p className={LABEL}>Obls</p>
              <p className="text-sm font-black text-[var(--rbi-text)]">{p.obligations}</p>
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
          <p className="mt-3 text-[11px] font-semibold text-[var(--rbi-text-muted)]">
            Top issue: {p.topIssue}
          </p>
        </div>
      ))}
    </div>
  );
}

function LocationTypeBadge({ type }: { type: "IN_SOURCE" | "OUTSOURCE" }) {
  const color = type === "IN_SOURCE" ? C.teal : C.purple;
  const label = type === "IN_SOURCE" ? "In-house" : "Outsource";
  return (
    <span
      className="inline-flex shrink-0 justify-self-start rounded-full border px-2 py-0.5 text-[9px] font-bold leading-none whitespace-nowrap"
      style={{ borderColor: `${color}55`, background: `${color}14`, color }}
    >
      {label}
    </span>
  );
}

function LocationTable() {
  const locationGrid =
    "minmax(0,1.35fr) minmax(84px,92px) minmax(112px,1.2fr) 52px 60px 36px minmax(0,0.95fr) 36px";

  return (
    <div className="w-full">
      <div
        className="grid w-full gap-x-3 border-b border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-table-head)] px-3 py-2 text-[9px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]"
        style={{ gridTemplateColumns: locationGrid }}
      >
        <span>Location · top issue</span>
        <span>Type</span>
        <span className="hidden sm:inline">Vendor</span>
        <span>Calls</span>
        <span>Purpose</span>
        <span>Obls</span>
        <span>Breaches</span>
        <span>Risk</span>
      </div>
      <div className="divide-y divide-[color:var(--rbi-border-subtle)]">
        {OUTBOUND_LOCATIONS.map((l) => {
          const riskReasonColor =
            l.riskScore >= 70 ? C.red : l.riskScore >= 45 ? C.amber : C.green;
          return (
            <div
              key={l.id}
              className="grid w-full items-start gap-x-3 gap-y-1 px-3 py-2.5"
              style={{ gridTemplateColumns: locationGrid }}
            >
              <div className="min-w-0">
                <p className="text-[11px] font-black text-[var(--rbi-text)]">{l.name}</p>
                <p className="text-[10px] font-semibold text-[var(--rbi-text-dim)]">{l.city}</p>
                <p
                  className="mt-1 whitespace-normal break-words text-[10px] font-semibold leading-snug"
                  style={{ color: riskReasonColor }}
                >
                  {l.topIssue}
                </p>
              </div>
              <LocationTypeBadge type={l.type} />
              <span className="hidden min-w-0 whitespace-normal break-words pr-1 text-[10px] font-bold leading-snug text-[var(--rbi-text-secondary)] sm:inline">
                {l.vendor ?? "—"}
              </span>
              <span className="text-[11px] font-black tabular-nums text-[var(--rbi-text)]">
                {fmt(l.calls)}
              </span>
              <span className="text-[10px] font-semibold text-[var(--rbi-text-muted)]">
                {l.purpose}
              </span>
              <span className="text-[11px] font-black text-[var(--rbi-text-secondary)]">
                {l.obligations}
              </span>
              <p className="min-w-0 whitespace-normal break-words text-[10px] font-semibold leading-snug text-red-300">
                {formatLocationBreachLabel(l.breaches, l.missingData)}
              </p>
              <span
                className="text-[11px] font-black"
                style={{ color: riskReasonColor }}
              >
                {l.riskScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LocationBreachInsightChip({
  label,
  value,
  accent = C.teal,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl border bg-[var(--rbi-subtle-bg)] px-2.5 py-2"
      style={{ borderColor: `${accent}33` }}
    >
      <p className="text-[9px] font-black uppercase tracking-wide text-[var(--rbi-text-dim)]">
        {label}
      </p>
      <p className="mt-1 text-[11px] font-black leading-snug text-[var(--rbi-text)]">{value}</p>
    </div>
  );
}

function LocationBreachPanel() {
  const data = OUTBOUND_LOCATIONS.map((l) => ({
    name: l.city,
    breaches: l.breaches,
    risk: l.riskScore,
  }));

  const highestBreach = [...OUTBOUND_LOCATIONS].sort((a, b) => b.breaches - a.breaches)[0];
  const highestRisk = [...OUTBOUND_LOCATIONS].sort((a, b) => b.riskScore - a.riskScore)[0];
  const dataGapHotspot = [...OUTBOUND_LOCATIONS].sort(
    (a, b) => b.missingData - a.missingData,
  )[0];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="h-[370px] w-full shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="var(--rbi-border)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
            <YAxis tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "var(--rbi-card)",
                border: "1px solid var(--rbi-border)",
                borderRadius: 12,
                fontSize: 11,
              }}
            />
            <Bar dataKey="breaches" fill={C.red} radius={[4, 4, 0, 0]} name="Breaches" />
            <Bar dataKey="risk" fill={C.amber} radius={[4, 4, 0, 0]} name="Risk score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
        <LocationBreachInsightChip
          label="Highest breach site"
          value={`${highestBreach.city} — ${highestBreach.breaches} breaches`}
          accent={C.red}
        />
        <LocationBreachInsightChip
          label="Highest risk site"
          value={`${highestRisk.city} — risk score ${highestRisk.riskScore}`}
          accent={C.amber}
        />
        <LocationBreachInsightChip
          label="Data gap hotspot"
          value={`${dataGapHotspot.city} — ${dataGapHotspot.missingData} data gap${
            dataGapHotspot.missingData === 1 ? "" : "s"
          }`}
          accent={C.cyan}
        />
      </div>
    </div>
  );
}

function OutboundViolationFeed() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {OUTBOUND_VIOLATIONS.map((v) => (
        <div
          key={v.ts + v.signal}
          className="flex items-start gap-2 rounded-xl border border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-subtle-bg)] px-2.5 py-1.5"
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
            <p className="text-[11px] font-black leading-snug text-[var(--rbi-text)]">{v.signal}</p>
            <p className="mt-0.5 text-[9px] font-semibold leading-snug text-[var(--rbi-text-dim)]">
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
          <CartesianGrid stroke="var(--rbi-border)" strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
          <YAxis tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "var(--rbi-card)",
              border: "1px solid var(--rbi-border)",
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
          <CartesianGrid stroke="var(--rbi-border)" strokeDasharray="3 3" />
          <XAxis dataKey="purpose" tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "var(--rbi-text-muted)", fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "var(--rbi-card)",
              border: "1px solid var(--rbi-border)",
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
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <OutboundAiInsight />
        </div>
        <Shell
          className="h-full xl:col-span-7"
          title="Top outbound conduct breaches"
          subtitle="Recent violations · severity · location · purpose · obligation"
          accent={C.red}
          headerClassName="px-4 pt-4 pb-2"
          bodyClassName="px-4 pb-4 pt-0"
        >
          <OutboundViolationFeed />
        </Shell>
      </div>

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

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <Shell
          className="xl:col-span-8"
          title="Conduct by contact centre / location"
          subtitle="In-house vs outsourced · obligations · breaches · risk reason · missing data flagged"
          accent={C.teal}
        >
          <LocationTable />
        </Shell>
        <Shell
          className="flex h-full flex-col xl:col-span-4"
          title="Breaches & risk by location"
          subtitle="Where action is needed first"
          accent={C.red}
          bodyClassName="flex flex-1 flex-col pb-4"
        >
          <LocationBreachPanel />
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

function RbiThemeToggle() {
  const { isDarkMode, toggleTheme } = useRbiConductTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      className="relative h-8 w-[3.25rem] shrink-0 rounded-full border border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-chip-bg)] p-0.5 transition-colors"
    >
      <span
        className={cx(
          "absolute top-0.5 flex size-7 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out",
          isDarkMode ? "left-[calc(100%-1.875rem)]" : "left-0.5",
        )}
      >
        {isDarkMode ? (
          <Moon className="size-3.5 text-zinc-700" aria-hidden />
        ) : (
          <Sun className="size-3.5 text-zinc-700" aria-hidden />
        )}
      </span>
    </button>
  );
}

function RbiConductDashboard({
  industryColor,
  onExit,
  defaultLens = "L1",
}: Pick<
  RbiConductIntelligencePreviewProps,
  "industryColor" | "onExit" | "defaultLens"
>) {
  const [tab, setTab] = useState<Tab>("coverage");
  const [sidebarHover, setSidebarHover] = useState(false);
  const lensMeta = EXECUTIVE_LENSES[defaultLens];
  const SIDEBAR_W_EXPANDED = 268;
  const SIDEBAR_W_COLLAPSED = 76;
  const sidebarW = sidebarHover ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div className="relative flex h-screen overflow-hidden bg-[var(--rbi-bg)] text-[var(--rbi-text)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, var(--rbi-radial-a), transparent 32%), radial-gradient(circle at top right, var(--rbi-radial-b), transparent 34%)",
        }}
      />

      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="relative z-20 flex shrink-0 flex-col overflow-hidden border-r bg-[var(--rbi-sidebar)]"
        style={{
          width: sidebarW,
          minWidth: sidebarW,
          borderColor: "var(--rbi-border)",
          transition: "width 0.22s ease, min-width 0.22s ease",
        }}
          aria-label="Dashboard views"
        >
          <div
            className="border-b"
            style={{
              borderColor: "var(--rbi-border)",
              padding: sidebarHover ? "18px 16px" : "14px 10px",
              textAlign: sidebarHover ? "left" : "center",
            }}
          >
            {sidebarHover ? (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-300">
                  Views
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[var(--rbi-text-dim)]">
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
                    active ? "bg-teal-500/10" : "bg-transparent hover:bg-[var(--rbi-chip-bg)]",
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
                          active ? "font-bold text-[var(--rbi-text)]" : "font-medium text-[var(--rbi-text-secondary)]",
                        )}
                      >
                        {t.label}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-[var(--rbi-text-dim)]">
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
            className="shrink-0 border-b bg-[var(--rbi-bg)]/95 backdrop-blur"
            style={{ borderColor: "var(--rbi-border)" }}
          >
            <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--rbi-border-subtle)] bg-[var(--rbi-chip-bg)] py-2 pr-3 pl-2.5 text-sm font-semibold text-[var(--rbi-text-secondary)] hover:bg-[var(--rbi-hover)]"
                  style={{ borderLeftWidth: 3, borderLeftColor: industryColor }}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 place-items-center rounded-2xl text-[var(--rbi-text)]"
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
                    <p className="text-[11px] font-semibold text-[var(--rbi-text-muted)]">
                      Private sector bank · post-Nov 2025 RBI rulebook · {TODAY}{" "}
                      · {lensMeta.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <RbiThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-5">
            {tab === "coverage" ? <CoverageScreen /> : <OutboundScreen />}
          </main>
        </div>
      </div>
  );
}

export function RbiConductIntelligencePreview({
  industryColor,
  onExit,
  theme,
  defaultLens = "L1",
}: RbiConductIntelligencePreviewProps) {
  return (
    <DashboardThemeProvider value={theme ?? FALLBACK_THEME}>
      <RbiConductThemeProvider>
        <RbiConductDashboard
          industryColor={industryColor}
          onExit={onExit}
          defaultLens={defaultLens}
        />
      </RbiConductThemeProvider>
    </DashboardThemeProvider>
  );
}

export default RbiConductIntelligencePreview;
