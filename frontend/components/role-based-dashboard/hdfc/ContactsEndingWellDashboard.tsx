"use client";

/**
 * HDFC Head of CX — Contacts Ending Well drill.
 * Visual system mirrors retail_banking/head_contact ContactExperienceDrillDown
 * (AIPanel rhythm, StatPill KPIs, quality matrix grid, closure 2-col).
 * All metrics from ContactsEndingWellData — no inline literals.
 */
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Ticket,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getContactsEndingWellSnapshot,
  getDefaultContactsEndingWellWindow,
  MATRIX_SIGNAL_KEYS,
  STATUS_COLOR,
  type ClosureCategory,
  type MatrixSignalKey,
  type QualityMatrixRow,
  type SignalStatus,
} from "@/lib/role-based-dashboard/hdfc/ContactsEndingWellData";
import { ContactsEndingWellBottomRow } from "./ContactsEndingWellBottomRow";
import {
  type DashboardThemeTokens,
  useDashboardTheme,
} from "../DashboardThemeContext";

type Props = { onBack: () => void };

/** Match retail PoorEndingContactsPanel channel palette. */
const CHANNEL_COLORS: Record<string, string> = {
  Voice: "#EF4444",
  Chat: "#F59E0B",
  Email: "#06B6D4",
  Ticket: "#A78BFA",
};

function channelIcon(icon: string, color: string) {
  const props = { size: 14, color };
  switch (icon) {
    case "phone":
      return <Phone {...props} />;
    case "chat":
      return <MessageSquare {...props} />;
    case "mail":
      return <Mail {...props} />;
    case "ticket":
      return <Ticket {...props} />;
    default:
      return <MessageSquare {...props} />;
  }
}

function borderSides(
  top: string,
  right: string,
  bottom: string,
  left: string,
): Pick<
  CSSProperties,
  "borderTop" | "borderRight" | "borderBottom" | "borderLeft"
> {
  return {
    borderTop: top,
    borderRight: right,
    borderBottom: bottom,
    borderLeft: left,
  };
}

function boxBorder(color: string, width = 1) {
  const v = `${width}px solid ${color}`;
  return borderSides(v, v, v, v);
}

/** Same shell language as retail AIPanel. */
function AIPanel({
  title,
  subtitle,
  children,
  accentColor,
  ai = false,
  aiModel,
  fill = false,
  headerRight,
  padding = 18,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
  ai?: boolean;
  aiModel?: string;
  fill?: boolean;
  headerRight?: ReactNode;
  padding?: number;
}) {
  const T = useDashboardTheme();
  const accent = accentColor || T.cyan;
  const edge = ai ? `${accent}35` : T.borderLight;
  return (
    <div
      style={{
        background: T.elevated,
        ...borderSides(`1px solid ${edge}`, `1px solid ${edge}`, `1px solid ${edge}`, `3px solid ${accent}`),
        borderRadius: 14,
        padding,
        position: ai ? "relative" : undefined,
        overflow: ai ? "hidden" : undefined,
        height: fill ? "100%" : undefined,
        display: fill ? "flex" : undefined,
        flexDirection: fill ? "column" : undefined,
      }}
    >
      {ai ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {ai ? <span style={{ fontSize: 14, lineHeight: 1 }}>✨</span> : null}
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: T.text,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {title}
            </span>
          </div>
          {subtitle ? (
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>{subtitle}</div>
          ) : null}
        </div>
        {headerRight ? (
          <div style={{ flexShrink: 0 }}>{headerRight}</div>
        ) : ai ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: accent,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 999,
              background: `${accent}15`,
              ...boxBorder(`${accent}40`),
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={9} />
            {aiModel ? `AI · ${aiModel}` : "AI"}
          </span>
        ) : null}
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: fill ? 1 : undefined,
          minHeight: 0,
          display: fill ? "flex" : undefined,
          flexDirection: fill ? "column" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ChartTip({
  active,
  payload,
  label,
  T,
  valueSuffix = "",
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; fill?: string }[];
  label?: string;
  T: DashboardThemeTokens;
  valueSuffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(10,14,22,0.96)",
        ...boxBorder(T.borderLight),
        borderRadius: 8,
        padding: "8px 11px",
        fontSize: 11,
      }}
    >
      <div style={{ color: T.text, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={String(p.name)}
          style={{ display: "flex", alignItems: "center", gap: 6, color: T.textSec }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color || p.fill || T.cyan,
            }}
          />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>
            {Number(p.value).toLocaleString()}
            {valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

function StackedChannelTooltip({
  active,
  payload,
  label,
  T,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; fill?: string }[];
  label?: string;
  T: DashboardThemeTokens;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);
  return (
    <div
      style={{
        background: "rgba(10,14,22,0.96)",
        ...boxBorder(T.borderLight),
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 11,
        minWidth: 200,
      }}
    >
      <div style={{ color: T.text, fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={String(p.name)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: T.textSec,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.fill,
            }}
          />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
      <div
        style={{
          marginTop: 6,
          paddingTop: 6,
          borderTop: `1px solid ${T.borderLight}`,
          display: "flex",
          justifyContent: "space-between",
          color: T.textMut,
        }}
      >
        <span>Total</span>
        <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function StatusPill({ value, status }: { value: number; status: SignalStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 56,
        padding: "5px 10px",
        background: `${c}18`,
        ...boxBorder(`${c}45`),
        borderRadius: 6,
        color: c,
        fontSize: 12.5,
        fontWeight: 800,
        fontFamily: "var(--mono)",
      }}
    >
      {value}%
    </span>
  );
}

export default function ContactsEndingWellDashboard({ onBack }: Props) {
  const T = useDashboardTheme();
  const data = useMemo(
    () => getContactsEndingWellSnapshot(getDefaultContactsEndingWellWindow()),
    [],
  );

  const health = data.contact_health_score;
  const wall = data.ai_summary_wall;
  const matrix = data.quality_matrix;
  const closure = data.closure_diagnostics;
  const repeats = data.repeat_contact_mining;
  const recovery = data.recovery_priority_matrix;

  const [selectedCategory, setSelectedCategory] = useState(
    closure.categories[0]?.category ?? "",
  );
  const selectedCat: ClosureCategory =
    closure.categories.find((c) => c.category === selectedCategory) ??
    closure.categories[0];

  const insightTone = (rank: number): "danger" | "warning" | "info" =>
    rank === 1 ? "danger" : rank === 2 ? "warning" : "info";
  const toneColor = (tone: "danger" | "warning" | "info") =>
    tone === "danger" ? T.red : tone === "warning" ? T.amber : T.cyan;

  const trend = health.trend_12w.map((p) => ({ w: p.week, v: p.value }));
  const stackedData = closure.categories.map((c) => ({
    category: c.category,
    ...c.by_channel,
  }));

  const metricColor = (val: number, threshold: number) =>
    val >= threshold ? T.red : T.amber;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header — retail DrillPageHeader rhythm + HDFC chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.elevated,
              ...boxBorder(T.borderLight),
              borderRadius: 10,
              padding: "8px 16px",
              cursor: "pointer",
              color: T.textSec,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={14} />
            Back to Overview
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                letterSpacing: -0.3,
              }}
            >
              {data.title}
            </div>
            <div style={{ fontSize: 13, color: T.textSec, marginTop: 3, maxWidth: 820 }}>
              {data.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1 — Health + AI Wall (retail 1.6fr / 320px) */}
      <div
        className="cew-top-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <AIPanel
          title={health.label}
          subtitle={`Composite of ${health.composite_of.join(", ")} · 12-week trend`}
          accentColor={T.amber}
          ai
          aiModel="Contact Quality Index"
          fill
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 280px) minmax(280px, 1fr)",
              gap: 16,
              alignItems: "stretch",
              flex: 1,
              width: "100%",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: T.amber,
                  fontFamily: "var(--mono)",
                  lineHeight: 1,
                }}
              >
                {health.score}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textMut,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                out of {health.out_of}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 800,
                  color: T.red,
                  fontFamily: "var(--mono)",
                  marginTop: 6,
                }}
              >
                <TrendingDown size={12} />
                {health.delta_pts} pts {health.delta_label}
              </div>
              <div style={{ fontSize: 11, color: T.textSec, marginTop: 4, lineHeight: 1.4 }}>
                <strong style={{ color: T.text }}>Verdict:</strong> {health.verdict}
              </div>
            </div>
            <div style={{ minHeight: 160, flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={160}>
                <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hdfc-cew-health" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.amber} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={T.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
                  <XAxis dataKey="w" stroke={T.textMut} fontSize={10} />
                  <YAxis domain={[55, 80]} stroke={T.textMut} fontSize={10} />
                  <Tooltip
                    content={(p: any) => (
                      <ChartTip {...p} T={T} valueSuffix=" / 100" />
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={T.amber}
                    strokeWidth={2.5}
                    fill="url(#hdfc-cew-health)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AIPanel>

        <AIPanel
          title="AI Summary Wall"
          subtitle={wall.subtitle}
          accentColor={T.amber}
          ai
          aiModel="Insight Ranker"
          fill
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {wall.insights.map((ins) => {
              const c = toneColor(insightTone(ins.rank));
              return (
                <div
                  key={ins.rank}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: `${c}10`,
                    ...borderSides(
                      `1px solid ${c}30`,
                      `1px solid ${c}30`,
                      `1px solid ${c}30`,
                      `3px solid ${c}`,
                    ),
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: T.text,
                      lineHeight: 1.3,
                    }}
                  >
                    {ins.rank}. {ins.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>
                    {ins.body}
                  </div>
                </div>
              );
            })}
          </div>
        </AIPanel>
      </div>

      {/* KPI strip — retail StatPill sizing */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} className="cew-kpi-strip">
        {data.kpis.map((kpi) => {
          const color = STATUS_COLOR[kpi.status];
          const DeltaIcon = kpi.delta > 0 ? TrendingUp : TrendingDown;
          const deltaStr =
            kpi.delta > 0 ? `+${kpi.delta}` : kpi.delta < 0 ? `−${Math.abs(kpi.delta)}` : "0";
          return (
            <div
              key={kpi.key}
              style={{
                flex: 1,
                minWidth: 0,
                background: "transparent",
                ...borderSides(
                  `3px solid ${color}`,
                  `1px solid ${color}40`,
                  `1px solid ${color}40`,
                  `1px solid ${color}40`,
                ),
                borderRadius: 10,
                padding: "11px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: T.textMut,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {kpi.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color,
                    fontFamily: "var(--mono)",
                    lineHeight: 1,
                  }}
                >
                  {kpi.value}
                  {kpi.unit}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: T.red,
                    fontFamily: "var(--mono)",
                  }}
                >
                  <DeltaIcon size={10} />
                  {deltaStr}
                </span>
              </div>
              <div style={{ fontSize: 10, color: T.textMut }}>Target {kpi.target}</div>
            </div>
          );
        })}
      </div>

      {/* Quality Matrix — full width like retail */}
      <AIPanel
        title={matrix.title}
        subtitle={matrix.subtitle}
        accentColor={T.cyan}
      >
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px, 1fr) repeat(5, minmax(110px, 1fr))",
              gap: 0,
              minWidth: 720,
              ...boxBorder(T.borderLight),
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {["Channel", ...matrix.signals].map((label, i) => (
              <div
                key={`h-${i}`}
                style={{
                  padding: "10px 12px",
                  background: T.surface,
                  borderBottom: `1px solid ${T.borderLight}`,
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: T.textSec,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            ))}
            {matrix.rows.map((row: QualityMatrixRow, ri) => (
              <div key={row.channel} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                    background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                  }}
                >
                  {channelIcon(row.icon, T.cyan)}
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>
                    {row.channel}
                  </span>
                </div>
                {MATRIX_SIGNAL_KEYS.map((key: MatrixSignalKey) => {
                  const cell = row[key];
                  return (
                    <div
                      key={`${row.channel}-${key}`}
                      style={{
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderTop: ri === 0 ? "none" : `1px solid ${T.borderLight}`,
                        background: ri % 2 === 0 ? "transparent" : `${T.borderLight}12`,
                      }}
                    >
                      <StatusPill value={cell.v} status={cell.status} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.textMut, lineHeight: 1.5 }}>
          <strong style={{ color: T.red }}>Hotspot:</strong> {matrix.hotspot}
        </div>
      </AIPanel>

      {/* Closure diagnostics — retail 1.4fr / detail side-by-side */}
      <AIPanel
        title={closure.title}
        subtitle={closure.subtitle}
        accentColor={T.red}
        ai
        aiModel="Closure Diagnostics"
      >
        <div
          className="cew-closure-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 1fr)",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <div style={{ minHeight: 380 }}>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={stackedData}
                layout="vertical"
                margin={{ top: 4, right: 14, left: 14, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 3000]}
                  stroke={T.textMut}
                  fontSize={10}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke={T.textSec}
                  fontSize={10}
                  width={190}
                />
                <Tooltip
                  cursor={{ fill: `${T.cyan}10` }}
                  content={(p: any) => <StackedChannelTooltip {...p} T={T} />}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: T.textMut }} />
                {closure.channel_legend.map((ch) => (
                  <Bar
                    key={ch}
                    dataKey={ch}
                    stackId="ch"
                    fill={CHANNEL_COLORS[ch] ?? T.cyan}
                    cursor="pointer"
                    onClick={(p: any) => {
                      if (p && typeof p.category === "string") {
                        setSelectedCategory(p.category);
                      }
                    }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {selectedCat ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: T.surface,
                ...boxBorder(T.borderLight),
                borderRadius: 12,
                padding: 14,
                minHeight: 340,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: T.text,
                    marginBottom: 4,
                  }}
                >
                  {selectedCat.category}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: T.red,
                      fontFamily: "var(--mono)",
                      lineHeight: 1,
                    }}
                  >
                    {selectedCat.total.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: T.textMut }}>
                    poor-ending contacts
                  </span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 6 }}>
                  <span style={{ color: T.textMut }}>Worst channel: </span>
                  <strong style={{ color: T.red }}>{selectedCat.worst_channel}</strong>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {(
                  [
                    ["Repeat", selectedCat.repeat_pct, 25],
                    ["Premature", selectedCat.premature_pct, 8],
                    ["Tone Drift", selectedCat.tone_drift_pct, 18],
                  ] as const
                ).map(([label, value, threshold]) => {
                  const c = metricColor(value, threshold);
                  return (
                    <div
                      key={label}
                      style={{
                        background: `${c}12`,
                        ...boxBorder(`${c}40`),
                        borderRadius: 8,
                        padding: "8px 10px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: T.textMut,
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: c,
                          fontFamily: "var(--mono)",
                          marginTop: 2,
                        }}
                      >
                        {value}%
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: T.textMut,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  Main reason
                </div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>
                  {selectedCat.issue}
                </div>
              </div>

              <div
                style={{
                  background: `${T.green}10`,
                  ...boxBorder(`${T.green}35`),
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: T.green,
                    textTransform: "uppercase",
                    letterSpacing: 0.7,
                    marginBottom: 4,
                  }}
                >
                  Recommended Fix
                </div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>
                  {selectedCat.recommended_fix}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </AIPanel>

      {/* Bottom row — structured equal-height panels */}
      <ContactsEndingWellBottomRow repeats={repeats} recovery={recovery} />

      <style>{`
        @media (max-width: 1100px) {
          .cew-top-grid,
          .cew-closure-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
