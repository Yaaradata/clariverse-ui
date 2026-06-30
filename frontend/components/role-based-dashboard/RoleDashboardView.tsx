"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle,
  ChevronRight,
  Crosshair,
  Globe,
  Grid,
  Home as HomeIcon,
  Layers,
  Lock,
  MessageCircle,
  Shield,
  Target,
  Users,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { RoleBasedComplianceTimePills } from "@/components/role-based-dashboard/RoleBasedComplianceTimePills";
import { RoleBasedUnifiedChrome } from "@/components/role-based-dashboard/RoleBasedUnifiedChrome";
import { RoleBasedUnifiedReadingShell } from "@/components/role-based-dashboard/RoleBasedUnifiedReadingShell";
import {
  RoleBasedUnifiedScreen1Addon,
  RoleBasedUnifiedScreen2Addon,
  RoleBasedUnifiedScreen3Addon,
  RoleBasedUnifiedScreen4Addon,
  RoleBasedUnifiedScreen5Addon,
} from "@/components/role-based-dashboard/RoleBasedUnifiedScreenExtensions";
import { useEisenhowerThreadsSnapshot } from "@/components/role-based-dashboard/useEisenhowerThreadsSnapshot";
import type { EisenhowerThread } from "@/lib/api";
import {
  initialKpiSignalFilter,
  skipExecutiveScreen,
} from "@/lib/role-based-dashboard/personaUnifiedConfig";
import {
  T as INDUSTRY_THEME,
  type Industry,
  type LensId,
  LOB_DATA,
  LOB_DRILL_KPIS,
  ROLE_DATA,
  type Role,
  roleDisplayName,
  type RoleDashboardData,
  type ScreenId,
  usesRetailBankingDashboard,
} from "@/lib/role-based-dashboard/registry";
import {
  isSterlingHeadRetail,
  resolveRoleDataKey,
  shouldShowExecutiveBrief,
} from "@/lib/role-based-dashboard/sterlingHeadContactScreen";
import { renderHeadContactDrillCard } from "@/lib/role-based-dashboard/headContactDrill";
import {
  swapUsdSymbolDeep,
  swapUsdSymbolForSterling,
  useSterlingHeadRetailCurrencyActive,
} from "@/lib/role-based-dashboard/sterlingHeadRetailCurrency";
import {
  swapUsdSymbolDeep as swapContactUsdDeep,
  useSterlingHeadContactCurrencyActive,
} from "@/lib/role-based-dashboard/sterlingHeadContactCurrency";
import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
  useDashboardTheme,
} from "./DashboardThemeContext";
import {
  CardsBlockersProblemsDrill,
  CardsTransactionsOffersDrill,
  CardsVoiceJoinDrill,
} from "./CardsPortfolioDrillScreens";
import { CategoryIntelligenceDashboard } from "./CategoryIntelligenceDashboard";
import { CXVoCHeadDashboard } from "./CXVoCHeadDashboard";
import { CXVoCHeadDashboardV2 } from "./CXVoCHeadDashboardV2";
import { FastagIntelligenceDashboard } from "./FastagIntelligenceDashboard";
import { HeadOfCreditCardsDashboard } from "./HeadOfCreditCardsDashboard";
import { CardsPortfolioV2Dashboard } from "./CardsPortfolioV2Dashboard";
import { OpenbankInsightExecutiveDashboard } from "./OpenbankInsightExecutiveDashboard";
import { RbiConductIntelligencePreview } from "./RbiConductIntelligencePreview";
import {
  BrandReputationDrillDown,
  CustomerHappinessDrillDown,
  ServiceFulfilmentDrillDown,
} from "./RetailDrillDownScreens";

type BadgeColor =
  | "red"
  | "amber"
  | "green"
  | "teal"
  | "purple"
  | "blue"
  | "gold"
  | "cyan";

function Badge({
  color = "blue",
  children,
}: {
  color?: BadgeColor;
  children: ReactNode;
}) {
  const T = useDashboardTheme();
  const m: Record<BadgeColor, [string, string]> = {
    red: [T.red, `${T.red}25`],
    amber: [T.amber, `${T.amber}25`],
    green: [T.green, `${T.green}25`],
    teal: [T.cyan, `${T.cyan}25`],
    purple: [T.purple, `${T.purple}25`],
    blue: [T.blue, `${T.blue}25`],
    gold: [T.gold, `${T.gold}25`],
    cyan: [T.cyan, `${T.cyan}25`],
  };
  const [fg, bg] = m[color] ?? m.blue;
  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontSize: 10,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 6,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
type SecLane = "default" | "recorded" | "conversation";

function Sec({
  title,
  sub,
  action,
  lane = "default",
  children,
}: {
  title: string;
  sub?: ReactNode;
  action?: ReactNode;
  lane?: SecLane;
  children: ReactNode;
}) {
  const T = useDashboardTheme();
  const wrap: CSSProperties = {
    background: T.elevated,
    border: `1px solid ${T.borderLight}`,
    borderRadius: 14,
    padding: 20,
  };
  if (lane === "recorded") wrap.borderLeft = `4px solid ${T.cyan}`;
  if (lane === "conversation") {
    wrap.borderLeft = `4px solid ${T.gold}`;
    wrap.backgroundImage = `linear-gradient(135deg, ${T.gold}0d 0%, transparent 45%)`;
  }
  return (
    <div style={wrap}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
              {title}
            </div>
            {lane === "recorded" ? <Badge color="cyan">Recorded</Badge> : null}
            {lane === "conversation" ? (
              <Badge color="gold">Conversation AI</Badge>
            ) : null}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 12,
                color: T.textSec,
                marginTop: 4,
                lineHeight: 1.45,
              }}
            >
              {sub}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const SCREENS: {
  id: ScreenId;
  label: string;
  sub: string;
  icon: LucideIcon;
}[] = [
  {
    id: 1,
    label: "Executive View",
    sub: "Promise · Stability · Risk",
    icon: HomeIcon,
  },
  {
    id: 2,
    label: "LOB / Industry Filter",
    sub: "Business Context + KPIs",
    icon: Grid,
  },
  {
    id: 3,
    label: "KPI Signals",
    sub: "CX · Ops · Risk · Compliance",
    icon: Activity,
  },
  {
    id: 4,
    label: "Functional Lens",
    sub: "Operations / Risk / Compliance",
    icon: Layers,
  },
  {
    id: 5,
    label: "Root Cause + Action",
    sub: "Signal → Cause → Action",
    icon: Crosshair,
  },
];

/** Roles that use the click-into-tile drill-down model (no "Screen #" prefix). */
const DRILL_ROLE_IDS = new Set(["head_retail", "head_contact", "cards_portfolio"]);
function isDrillRoleId(roleId: string): boolean {
  return DRILL_ROLE_IDS.has(roleId);
}

/** Drill-model roles use shorter screen names and no "Screen #" title prefix. */
function screenNavEntry(
  roleId: string,
  s: (typeof SCREENS)[number],
): (typeof SCREENS)[number] {
  if (isDrillRoleId(roleId) && s.id === 2) return { ...s, label: "LOB" };
  return s;
}

function screenNavTooltip(roleId: string, s: (typeof SCREENS)[number]): string {
  const e = screenNavEntry(roleId, s);
  if (isDrillRoleId(roleId)) return `${e.label} — ${e.sub}`;
  return `Screen ${s.id}: ${e.label} — ${e.sub}`;
}

function visibleSidebarScreens(
  industryId: string,
  roleId: string,
): typeof SCREENS {
  if (roleId === "head_contact") return SCREENS.filter((s) => s.id === 1);
  if (isSterlingHeadRetail(industryId, roleId)) return SCREENS.filter((s) => s.id === 1);
  if (isDrillRoleId(roleId)) return SCREENS.filter((s) => s.id <= 2);
  return SCREENS;
}

function defaultScreenForRole(industry: Industry, role: Role): ScreenId {
  if (role.id === "head_contact") return 1;
  return skipExecutiveScreen(industry, role) ? 3 : 1;
}

// Happiness % → color (aligned with tile gauge `gC`): high ≥80 green, medium 60–79 amber only, low <60 red.
function happinessPctColor(pct: number, T: DashboardThemeTokens): string {
  if (pct >= 80) return T.green;
  if (pct >= 60) return T.amber;
  return T.red;
}

// ── Head of Retail Banking: trend meta + info body for each tier card ────────
type RetailTileTrend = {
  value: number;
  delta: string;
  deltaColor: string;
  stroke: string;
  trendData: { w: string; v: number }[];
  yPadBelow: number;
  yPadAbove: number;
};

function formatPtsDelta(
  from: number,
  to: number,
  T: DashboardThemeTokens,
): { delta: string; deltaColor: string; value: number } {
  const value = to;
  const diff = Math.round(to - from);
  const abs = Math.abs(diff);
  const ptWord = abs === 1 ? "pt" : "pts";
  if (diff === 0) return { value, delta: `0 ${ptWord}`, deltaColor: T.textMut };
  if (diff > 0)
    return { value, delta: `+${abs} ${ptWord}`, deltaColor: T.green };
  return { value, delta: `−${abs} ${ptWord}`, deltaColor: T.red };
}

/** Head of Retail tier cards: six daily points (D1…D6, D6 = now); headline + delta from D1 vs D6. */
function retailDailyTrendFromSeries(
  values: readonly [number, number, number, number, number, number],
  stroke: string,
  T: DashboardThemeTokens,
  yPadBelow: number,
  yPadAbove: number,
): RetailTileTrend {
  const trendData = values.map((v, i) => ({ w: `D${i + 1}`, v }));
  const first = values[0];
  const last = values[5];
  const { value, delta, deltaColor } = formatPtsDelta(first, last, T);
  return {
    value,
    delta,
    deltaColor,
    stroke,
    trendData,
    yPadBelow,
    yPadAbove,
  };
}

function retailTileTrendMeta(
  tileIdx: number,
  T: DashboardThemeTokens,
): RetailTileTrend {
  if (tileIdx === 0) {
    return retailDailyTrendFromSeries(
      [68, 61, 73, 63, 68, 72],
      T.green,
      T,
      6,
      4,
    );
  }
  if (tileIdx === 1) {
    return retailDailyTrendFromSeries(
      [70, 62, 68, 59, 63, 64],
      T.amber,
      T,
      6,
      4,
    );
  }
  return retailDailyTrendFromSeries([82, 70, 84, 66, 74, 68], T.red, T, 8, 5);
}

function sterlingRetailTileTrendMeta(
  tileIdx: number,
  T: DashboardThemeTokens,
): RetailTileTrend {
  if (tileIdx === 0) {
    return retailDailyTrendFromSeries([55, 58, 60, 59, 62, 61], T.amber, T, 6, 4);
  }
  if (tileIdx === 1) {
    return retailDailyTrendFromSeries([68, 64, 62, 60, 59, 58], T.red, T, 6, 4);
  }
  return retailDailyTrendFromSeries([58, 60, 62, 61, 64, 63], T.amber, T, 8, 5);
}

// ── Head of Contact Centre: tile trend meta (mirrors retail pattern) ─────────
function contactTileTrendMeta(
  tileIdx: number,
  T: DashboardThemeTokens,
): RetailTileTrend {
  if (tileIdx === 0) {
    // Customer Experience — post-contact outcome quality
    return retailDailyTrendFromSeries(
      [69, 71, 70, 72, 71, 72],
      T.cyan,
      T,
      6,
      4,
    );
  }
  if (tileIdx === 1) {
    // Service Reputation — service-driven brand sentiment dropping
    return retailDailyTrendFromSeries(
      [70, 68, 66, 64, 63, 62],
      T.amber,
      T,
      6,
      4,
    );
  }
  // Service Operations — SLA / workforce gap deepening
  return retailDailyTrendFromSeries([72, 68, 66, 62, 60, 60], T.red, T, 8, 5);
}

// ── Cards Portfolio Manager: tile trend meta (mirrors retail/contact pattern) ──
function cardsPortfolioTileTrendMeta(
  tileIdx: number,
  T: DashboardThemeTokens,
): RetailTileTrend {
  if (tileIdx === 0) {
    // Revenue & Recovery — leakage / recoverable score eroding
    return retailDailyTrendFromSeries([72, 70, 71, 66, 65, 64], T.cyan, T, 6, 4);
  }
  if (tileIdx === 1) {
    // Conduct & Regulatory — exposure rising (score falling)
    return retailDailyTrendFromSeries([68, 66, 64, 61, 60, 58], T.amber, T, 6, 4);
  }
  // Forward Credit & Attrition — cost forming first
  return retailDailyTrendFromSeries([70, 67, 66, 63, 61, 60], T.red, T, 8, 5);
}

// Tile info renderers for Cards Portfolio Manager (mirrors retailTileInfo shape).
function cardsPortfolioTileInfo(
  tileIdx: number,
  T: DashboardThemeTokens,
): ReactElement {
  const statCell = (label: string, value: string, color: string) => (
    <div>
      <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "var(--mono)" }}>{value}</div>
    </div>
  );
  if (tileIdx === 0) {
    // A — Transactions & offers: incremental / profitable gauges + yield/offer stats
    return (
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8, minWidth: 0, alignItems: "end" }}>
          <MiniGauge label="Incremental" value={58} color={T.green} suffix="%" T={T} />
          <MiniGauge label="Profitable spend" topLabel="Profitable" bottomLabel="spend" value={55} color={T.amber} suffix="%" T={T} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "4px 14px", alignItems: "end" }}>
          {statCell("Yield leak", "₹1.2 Cr", T.red)}
          {statCell("Offers to kill", "2", T.amber)}
        </div>
      </div>
    );
  }
  if (tileIdx === 1) {
    // B — Blockers & problems: decline-taxonomy / blocker pressure lanes
    const lanes = [
      { name: "Token break", v: 0.82, c: T.red },
      { name: "Fraud-rule", v: 0.7, c: T.red },
      { name: "Limit / util", v: 0.5, c: T.amber },
      { name: "Activation", v: 0.6, c: T.amber },
      { name: "Roll Q2-24", v: 0.55, c: T.amber },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 6 }}>
        {lanes.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 10, color: T.textMut, width: 78, flexShrink: 0 }}>{l.name}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${l.c}20` }}>
              <div style={{ height: "100%", width: `${l.v * 100}%`, background: l.c, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  // C — Transaction × voice join (LiSN only): curable / hardship-split gauges + join stats
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8, minWidth: 0, alignItems: "end" }}>
        <MiniGauge label="Curable" value={62} color={T.green} suffix="%" T={T} />
        <MiniGauge label="Genuine hardship" topLabel="Genuine" bottomLabel="hardship" value={64} color={T.purple} suffix="%" T={T} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "4px 14px", alignItems: "end" }}>
        {statCell("Voice lead", "~2 wks", T.purple)}
        {statCell("IO clock", "4 cases", T.red)}
      </div>
    </div>
  );
}

// Tile info renderers for Head of Contact Centre (mirrors retailTileInfo shape).
function contactTileInfo(
  tileIdx: number,
  T: DashboardThemeTokens,
): ReactElement {
  if (tileIdx === 0) {
    const rows = [
      { label: "Post-CSAT", pct: 87 },
      { label: "FCR", pct: 78 },
    ].map((r) => ({ ...r, color: happinessPctColor(r.pct, T) }));
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 8,
            minWidth: 0,
            alignItems: "end",
          }}
        >
          {rows.map((r) => (
            <MiniGauge
              key={r.label}
              label={r.label}
              value={r.pct}
              color={r.color}
              suffix="%"
              T={T}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "4px 14px",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMut,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Repeat
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.red,
                fontFamily: "var(--mono)",
              }}
            >
              14%
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMut,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Sentiment
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.amber,
                fontFamily: "var(--mono)",
              }}
            >
              72%
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (tileIdx === 1) {
    const platforms = [
      { name: "Trustpilot", v: 0.46 },
      { name: "App Store", v: 0.55 },
      { name: "Reddit", v: 0.48 },
      { name: "Play Store", v: 0.54 },
      { name: "X / Twitter", v: 0.38 },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {platforms.map((p) => {
          const barColor =
            p.v >= 0.65 ? T.green : p.v >= 0.55 ? T.amber : T.red;
          return (
            <div
              key={p.name}
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: T.textMut,
                  width: 64,
                  flexShrink: 0,
                }}
              >
                {p.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: `${barColor}20`,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${p.v * 100}%`,
                    background: barColor,
                    borderRadius: 3,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: barColor,
                  width: 28,
                  textAlign: "right",
                  fontFamily: "var(--mono)",
                }}
              >
                {p.v.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  // tileIdx === 2 — Service Operations: best vs worst SLA + workforce signal
  const bars = [
    {
      label: "In-house · FCR",
      topLabel: "In-house",
      bottomLabel: "FCR 81%",
      pct: 81,
      color: T.green,
    },
    {
      label: "BPO Beta · FCR",
      topLabel: "BPO Beta",
      bottomLabel: "FCR 62%",
      pct: 62,
      color: T.red,
      offsetY: -0.5,
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        flex: 1,
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 8,
          minWidth: 0,
          alignItems: "end",
        }}
      >
        {bars.map((b) => (
          <MiniGauge
            key={b.label}
            label={b.label}
            topLabel={b.topLabel}
            bottomLabel={b.bottomLabel}
            offsetY={b.offsetY}
            value={b.pct}
            color={b.color}
            suffix="%"
            T={T}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "4px 14px",
          alignItems: "end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: T.textMut,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            SL 80/20
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.red,
              fontFamily: "var(--mono)",
            }}
          >
            76/22
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: T.textMut,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Abandon
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.red,
              fontFamily: "var(--mono)",
            }}
          >
            6.4%
          </div>
        </div>
      </div>
    </div>
  );
}

function retailTileInfo(
  tileIdx: number,
  T: DashboardThemeTokens,
): ReactElement {
  if (tileIdx === 0) {
    const rows = [
      { label: "High Value", pct: 68 },
      { label: "Low Value", pct: 81 },
    ].map((r) => ({ ...r, color: happinessPctColor(r.pct, T) }));
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 8,
            minWidth: 0,
            alignItems: "end",
          }}
        >
          {rows.map((r) => (
            <MiniGauge
              key={r.label}
              label={r.label}
              value={r.pct}
              color={r.color}
              suffix="%"
              T={T}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "4px 14px",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMut,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Top Pain
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                fontFamily: "var(--mono)",
              }}
            >
              EMI 31%
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMut,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Churn Risk
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.red,
                fontFamily: "var(--mono)",
              }}
            >
              3 HNI
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (tileIdx === 1) {
    const channels = [
      { name: "App Store", v: 0.71 },
      { name: "Voice", v: 0.64 },
      { name: "Chat", v: 0.62 },
      { name: "Email", v: 0.56 },
      { name: "Social/X", v: 0.41 },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {channels.map((ch) => {
          const barColor =
            ch.v >= 0.65 ? T.green : ch.v >= 0.55 ? T.amber : T.red;
          return (
            <div
              key={ch.name}
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: T.textMut,
                  width: 52,
                  flexShrink: 0,
                }}
              >
                {ch.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: `${barColor}20`,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${ch.v * 100}%`,
                    background: barColor,
                    borderRadius: 3,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: barColor,
                  width: 28,
                  textAlign: "right",
                  fontFamily: "var(--mono)",
                }}
              >
                {ch.v.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  const bars = [
    {
      label: "Best · Card Replacement",
      topLabel: "Best",
      bottomLabel: "Card Replacement",
      pct: 91,
      color: T.green,
    },
    {
      label: "Worst · Fee Dispute",
      topLabel: "Worst",
      bottomLabel: "Fee Dispute",
      pct: 64,
      color: T.red,
      offsetY: -0.5,
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        flex: 1,
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 8,
          minWidth: 0,
          alignItems: "end",
        }}
      >
        {bars.map((b) => (
          <MiniGauge
            key={b.label}
            label={b.label}
            topLabel={b.topLabel}
            bottomLabel={b.bottomLabel}
            offsetY={b.offsetY}
            value={b.pct}
            color={b.color}
            suffix="%"
            T={T}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "4px 14px",
          alignItems: "end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: T.textMut,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Trend
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.red,
              fontFamily: "var(--mono)",
            }}
          >
            ▼ −6%
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: T.textMut,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Bottleneck
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.amber,
              fontFamily: "var(--mono)",
            }}
          >
            KYC API
          </div>
        </div>
      </div>
    </div>
  );
}

function sterlingRetailTileInfo(
  tileIdx: number,
  T: DashboardThemeTokens,
): ReactElement {
  if (tileIdx === 0) {
    const rows = [
      { label: "Declined", pct: 57 },
      { label: "Accepted", pct: 43 },
    ].map((r) => ({ ...r, color: happinessPctColor(r.pct, T) }));
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 8,
            minWidth: 0,
            alignItems: "end",
          }}
        >
          {rows.map((r) => (
            <MiniGauge
              key={r.label}
              label={r.label}
              value={r.pct}
              color={r.color}
              suffix="%"
              T={T}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "4px 14px",
            alignItems: "end",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Avg balance
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "var(--mono)" }}>
              £4,241
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Est. leak/wk
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.red, fontFamily: "var(--mono)" }}>
              £310K
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (tileIdx === 1) {
    const channels = [
      { name: "App Store", v: 0.62 },
      { name: "Voice", v: 0.55 },
      { name: "Chat", v: 0.57 },
      { name: "Email", v: 0.50 },
      { name: "Social/X", v: 0.41 },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {channels.map((ch) => {
          const barColor =
            ch.v >= 0.65 ? T.red : ch.v >= 0.55 ? T.amber : T.green;
          return (
            <div
              key={ch.name}
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
            >
              <span style={{ fontSize: 10, color: T.textMut, width: 52, flexShrink: 0 }}>
                {ch.name}
              </span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${barColor}20` }}>
                <div
                  style={{
                    height: "100%",
                    width: `${ch.v * 100}%`,
                    background: barColor,
                    borderRadius: 3,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: barColor,
                  width: 28,
                  textAlign: "right",
                  fontFamily: "var(--mono)",
                }}
              >
                {ch.v.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  const bars = [
    {
      label: "Best · When eased",
      topLabel: "Best",
      bottomLabel: "When eased",
      pct: 78,
      color: T.green,
    },
    {
      label: "Worst · Rejected",
      topLabel: "Worst",
      bottomLabel: "Rejected",
      pct: 57,
      color: T.red,
      offsetY: -0.5,
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        flex: 1,
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 8,
          minWidth: 0,
          alignItems: "end",
        }}
      >
        {bars.map((b) => (
          <MiniGauge
            key={b.label}
            label={b.label}
            topLabel={b.topLabel}
            bottomLabel={b.bottomLabel}
            offsetY={b.offsetY}
            value={b.pct}
            color={b.color}
            suffix="%"
            T={T}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "4px 14px",
          alignItems: "end",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Growth lost
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.red, fontFamily: "var(--mono)" }}>
            £2.3M
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Viable rejected
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.amber, fontFamily: "var(--mono)" }}>
            ↑ rising
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniGauge({
  label,
  topLabel,
  bottomLabel,
  offsetY = 0,
  value,
  color,
  suffix = "%",
  T,
}: {
  label: string;
  topLabel?: string;
  bottomLabel?: string;
  offsetY?: number;
  value: number;
  color: string;
  suffix?: string;
  T: DashboardThemeTokens;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: clamped, fill: color }];
  const GAUGE_H = 54;
  const OUTER_R = 46;
  const INNER_R = 32;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        gap: 2,
        transform: offsetY === 0 ? undefined : `translateY(${offsetY}px)`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.textMut,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {topLabel ?? label}
      </div>
      <div style={{ position: "relative", width: "100%", height: GAUGE_H }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={INNER_R}
            outerRadius={OUTER_R}
            cx="50%"
            cy="100%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: `${T.borderLight}90` }}
            />
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
          {clamped}
          {suffix}
        </div>
      </div>
      {bottomLabel ? (
        <div
          style={{
            fontSize: 10,
            color: T.textMut,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            textAlign: "center",
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "clip",
            lineHeight: 1.15,
            minHeight: 24,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {bottomLabel}
        </div>
      ) : null}
    </div>
  );
}

function TileScoreGauge({
  score,
  color,
  T,
}: {
  score: number;
  color: string;
  T: DashboardThemeTokens;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const data = [{ name: "Score", value: clamped, fill: color }];

  return (
    <div
      style={{
        width: 214,
        height: 106,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius="65%"
          outerRadius="94%"
          cx="50%"
          cy="84%"
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: `${T.borderLight}90` }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 14,
          transform: "translateX(-50%)",
          fontSize: 17,
          fontWeight: 800,
          color,
          fontFamily: "var(--mono)",
          letterSpacing: 0.2,
          pointerEvents: "none",
        }}
      >
        {clamped}
      </div>
    </div>
  );
}

function Screen1({
  data,
  goTo,
  role,
  industry,
  unifiedNavigation,
  onDrillCard,
}: {
  data: RoleDashboardData;
  goTo: (n: ScreenId) => void;
  role: Role;
  industry: Industry;
  unifiedNavigation: boolean;
  onDrillCard?: (idx: number) => void;
}) {
  const T = useDashboardTheme();
  const gC = (s: number) => (s >= 80 ? T.green : s >= 60 ? T.amber : T.red);
  const isRetail = role.id === "head_retail";
  const isContact = role.id === "head_contact";
  const isCardsPortfolio = role.id === "cards_portfolio";
  const isDrillRole = isRetail || isContact || isCardsPortfolio;
  const primaryIdx =
    unifiedNavigation &&
    "primaryTile" in role &&
    typeof role.primaryTile === "number"
      ? role.primaryTile
      : null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
          minWidth: 0,
        }}
      >
        {data.tiles.map((tile, i) => {
          const Icon = tile.icon;
          const sc = gC(tile.score);
          const isPrimary = primaryIdx === i;
          const isLisnJoinTile = isCardsPortfolio && i === 2;
          const handleClick =
            isDrillRole && onDrillCard ? () => onDrillCard(i) : () => goTo(2);
          const drillTrend = isRetail
            ? retailTileTrendMeta(i, T)
            : isContact
              ? contactTileTrendMeta(i, T)
              : isCardsPortfolio
                ? cardsPortfolioTileTrendMeta(i, T)
                : null;
          const drillInfo = isRetail
            ? retailTileInfo(i, T)
            : isContact
              ? contactTileInfo(i, T)
              : isCardsPortfolio
                ? cardsPortfolioTileInfo(i, T)
                : null;
          return (
            <div
              key={i}
              onClick={handleClick}
              style={{
                position: "relative",
                background: isLisnJoinTile ? `${T.purple}0d` : T.elevated,
                border: isLisnJoinTile
                  ? `1px solid ${T.purple}66`
                  : `1px solid ${isPrimary ? T.cyan : sc}40`,
                borderTop: isLisnJoinTile ? `3px solid ${T.gold}` : undefined,
                borderRadius: 16,
                padding: "24px 22px",
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: isPrimary
                  ? `0 0 0 2px ${T.cyan}, 0 8px 28px ${T.cyan}22`
                  : isLisnJoinTile
                    ? `0 0 0 1px ${T.purple}1f inset`
                    : undefined,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isPrimary)
                  e.currentTarget.style.boxShadow = `0 8px 32px ${sc}15`;
              }}
              onMouseLeave={(e) => {
                if (!isPrimary) e.currentTarget.style.boxShadow = "none";
                else
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${T.cyan}, 0 8px 28px ${T.cyan}22`;
              }}
            >
              {isLisnJoinTile ? (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    pointerEvents: "none",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    background: T.gold,
                    borderRadius: 4,
                    padding: "2px 7px",
                  }}
                >
                  ✨ LiSN only
                </div>
              ) : null}
              {isDrillRole ? null : (
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    right: 12,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TileScoreGauge score={tile.score} color={sc} T={T} />
                  <ChevronRight size={16} color={T.textMut} />
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isDrillRole ? 10 : 16,
                  gap: 14,
                  paddingRight: isDrillRole ? 0 : 232,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${tile.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={tile.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: T.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tile.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: T.textMut,
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tile.sub}
                    </div>
                  </div>
                </div>
                {isDrillRole ? (
                  <ChevronRight
                    size={36}
                    color={T.textMut}
                    style={{
                      flexShrink: 0,
                      alignSelf: "stretch",
                      height: "100%",
                      width: 36,
                    }}
                    strokeWidth={1.75}
                  />
                ) : null}
              </div>
              {drillTrend ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
                    gap: 16,
                    alignItems: "stretch",
                    marginBottom: 16,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        fontSize: 13,
                        color: drillTrend.deltaColor,
                        fontWeight: 700,
                        fontFamily: "var(--mono)",
                        flexShrink: 0,
                      }}
                    >
                      {drillTrend.delta}
                    </span>
                    <div style={{ marginBottom: 6, paddingRight: 64 }}>
                      <div
                        style={{
                          fontSize: 34,
                          fontWeight: 800,
                          color: T.text,
                          fontFamily: "var(--mono)",
                          lineHeight: 1,
                        }}
                      >
                        {drillTrend.value}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        flex: 1,
                        minHeight: 96,
                      }}
                    >
                      <ResponsiveContainer>
                        <AreaChart
                          data={drillTrend.trendData}
                          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id={`retail-trend-grad-${i}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={drillTrend.stroke}
                                stopOpacity={0.42}
                              />
                              <stop
                                offset="55%"
                                stopColor={drillTrend.stroke}
                                stopOpacity={0.16}
                              />
                              <stop
                                offset="100%"
                                stopColor={drillTrend.stroke}
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="w" hide />
                          <YAxis
                            hide
                            domain={[
                              (min: number) =>
                                Math.max(0, min - drillTrend.yPadBelow),
                              (max: number) => max + drillTrend.yPadAbove,
                            ]}
                          />
                          <RechartsTooltip
                            cursor={false}
                            labelFormatter={(label) => `${label}`}
                            formatter={(value) => [
                              `${Number(value ?? 0)} pts`,
                              "Score",
                            ]}
                            contentStyle={{
                              background: "rgba(10,14,22,0.96)",
                              border: `1px solid ${T.borderLight}`,
                              borderRadius: 8,
                              fontSize: 11,
                              color: T.text,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke={drillTrend.stroke}
                            strokeWidth={3}
                            fill={`url(#retail-trend-grad-${i})`}
                            fillOpacity={1}
                            dot={false}
                            activeDot={{
                              r: 3.5,
                              fill: drillTrend.stroke,
                              stroke: drillTrend.stroke,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      minWidth: 0,
                    }}
                  >
                    {drillInfo}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 14px",
                      flex: 1,
                    }}
                  >
                    {tile.kpis.map((k, j) => (
                      <div key={j}>
                        <div
                          style={{
                            fontSize: 12,
                            color: T.textMut,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {k.l}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: T.text,
                            fontFamily: "var(--mono)",
                          }}
                        >
                          {k.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div
                style={{
                  marginTop: isDrillRole ? "auto" : 0,
                  background: `linear-gradient(135deg, ${T.gold}10 0%, ${sc}08 38%)`,
                  border: `1px solid ${T.gold}28`,
                  borderLeft: `4px solid ${T.gold}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
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
                  <Bot size={11} color={T.gold} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.gold,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Conversation AI
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: T.textSec,
                    lineHeight: 1.55,
                    flex: 1,
                  }}
                >
                  {tile.insight}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {unifiedNavigation ? (
        <RoleBasedUnifiedScreen1Addon role={role} industryId={industry.id} />
      ) : null}
    </div>
  );
}

function Screen2({
  goTo,
  industry,
  onLobChange,
  activeLob,
  role,
  unifiedNavigation,
  eisenhowerThreads,
}: {
  goTo: (n: ScreenId) => void;
  industry: Industry;
  onLobChange: (lob: string) => void;
  activeLob: string;
  role: Role;
  unifiedNavigation: boolean;
  eisenhowerThreads: EisenhowerThread[];
}) {
  const T = useDashboardTheme();
  // Determine available LOBs based on industry
  const lobTabs: { id: string; label: string }[] = [];
  if (industry.id === "retail_banking") {
    lobTabs.push({ id: "retail_banking", label: "Retail Banking" });
    lobTabs.push({ id: "cards_business", label: "Cards Business" });
  } else if (industry.id === "credit_cards") {
    lobTabs.push({ id: "cards_business", label: "Cards Business" });
  } else if (industry.id === "insurance") {
    lobTabs.push({ id: "insurance", label: "Insurance" });
  } else if (industry.id === "ecommerce") {
    lobTabs.push({ id: "retail_banking", label: "Marketplace" });
  }

  const lobData = LOB_DATA[activeLob] ?? LOB_DATA.retail_banking;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {lobTabs.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {lobTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onLobChange(tab.id)}
              style={{
                background:
                  activeLob === tab.id ? `${industry.color}20` : T.elevated,
                border: `1px solid ${activeLob === tab.id ? industry.color : T.borderLight}`,
                borderRadius: 10,
                padding: "10px 20px",
                cursor: "pointer",
                color: activeLob === tab.id ? T.text : T.textSec,
                fontWeight: activeLob === tab.id ? 700 : 500,
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
              {lobData.label}{" "}
              <span style={{ color: T.textSec, fontWeight: 400 }}>
                — Core KPIs
              </span>
            </div>
            <Badge color="cyan">Recorded</Badge>
            <span
              style={{
                fontSize: 12,
                color: T.textSec,
                lineHeight: 1.45,
                flex: "1 1 200px",
              }}
            >
              From contact-centre and core banking feeds (queues, SLAs,
              volumes). Not model-generated.
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {lobData.kpis.map((k, i) => {
              const col =
                k.st === "red" ? T.red : k.st === "amber" ? T.amber : T.green;
              return (
                <div
                  key={i}
                  onClick={() => goTo(3)}
                  style={{
                    background: T.elevated,
                    border: `1px solid ${T.borderLight}`,
                    borderRadius: 12,
                    padding: "16px 14px",
                    borderTop: `3px solid ${col}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.textSec,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    {k.l}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: col,
                      fontFamily: "var(--mono)",
                      lineHeight: 1,
                    }}
                  >
                    {k.v}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 8,
                      fontSize: 11,
                    }}
                  >
                    <span
                      style={{
                        color: k.delta >= 0 ? T.red : T.green,
                        fontWeight: 700,
                      }}
                    >
                      {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta)}
                    </span>
                    <span style={{ color: T.textSec }}>T: {k.target}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Sec
            title="AI Insights"
            sub="Model-ranked themes from conversations — validate before executive use."
            lane="conversation"
          >
            {lobData.insights.map((ins, i) => (
              <div
                key={i}
                onClick={() => goTo(5)}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.amber}30`,
                  borderLeft: `3px solid ${T.amber}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <Bot size={12} color={T.amber} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.amber,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Insight #{i + 1}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
                  {ins}
                </div>
              </div>
            ))}
          </Sec>
        </div>
        <Sec
          title="Priority Matrix"
          sub="Eisenhower: what needs action now?"
          lane="recorded"
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {[
              {
                label: "DO NOW",
                items: lobData.eisenhower.do,
                bg: `${T.red}18`,
                bc: T.red,
              },
              {
                label: "PLAN",
                items: lobData.eisenhower.plan,
                bg: `${T.amber}18`,
                bc: T.amber,
              },
              {
                label: "DELEGATE",
                items: lobData.eisenhower.delegate,
                bg: `${T.blue}18`,
                bc: T.blue,
              },
              {
                label: "MONITOR",
                items: lobData.eisenhower.monitor,
                bg: `${T.textMut}15`,
                bc: T.textMut,
              },
            ].map((q, i) => (
              <div
                key={i}
                style={{
                  background: q.bg,
                  border: `1px solid ${q.bc}35`,
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: q.bc,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {q.label}
                </div>
                {q.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 11,
                      color: T.text,
                      lineHeight: 1.5,
                      marginBottom: 5,
                      paddingLeft: 8,
                      borderLeft: `2px solid ${q.bc}50`,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Sec>
      </div>
      {unifiedNavigation ? (
        <RoleBasedUnifiedScreen2Addon
          role={role}
          threads={eisenhowerThreads}
          activeLob={activeLob}
        />
      ) : null}
    </div>
  );
}

function Screen3({
  goTo,
  activeLob,
  industry,
  role,
  unifiedNavigation,
  personaInitialFilter,
}: {
  goTo: (n: ScreenId) => void;
  activeLob: string;
  industry: Industry;
  role: Role;
  unifiedNavigation: boolean;
  personaInitialFilter: string;
}) {
  const T = useDashboardTheme();
  const [userFilter, setUserFilter] = useState<string>(() =>
    unifiedNavigation ? personaInitialFilter : "all",
  );
  const userFilters = [
    { id: "all", label: "All Signals" },
    { id: "ops", label: "Operations" },
    { id: "fraud", label: "Fraud" },
    { id: "training", label: "Training" },
    { id: "staffing", label: "Staffing" },
  ];

  const groups = [
    {
      label: "CX Metrics",
      color: T.cyan,
      icon: Target,
      filterTags: ["ops", "training"],
      kpis: [
        { n: "NPS", v: "+38", a: "▼6 pts in 4 weeks" },
        { n: "CSAT", v: "81%", a: null },
        { n: "Sentiment", v: "0.58", a: "Below 0.60 threshold" },
        { n: "Complaint Rate", v: "2.8%", a: "▲40% in 6 weeks" },
      ],
    },
    {
      label: "Operational",
      color: T.gold,
      icon: Activity,
      filterTags: ["ops", "staffing"],
      kpis: [
        { n: "AHT", v: "8.3m", a: "Above 8 min target" },
        { n: "SLA Compliance", v: "87%", a: "Below 95% — 3rd week" },
        { n: "Vol vs Capacity", v: "112%", a: "Exceeded 9–11 AM" },
        { n: "FCR", v: "74%", a: "Below 80% target" },
      ],
    },
    {
      label: "Risk / Fraud",
      color: T.red,
      icon: Shield,
      filterTags: ["fraud"],
      kpis: [
        { n: "Fraud Signals", v: "69", a: "FL cluster + MCC 7995" },
        { n: "System Failures", v: "4", a: "KYC API + payment" },
        { n: "Breach Exposure", v: "1,247", a: "Active merchant breach" },
        { n: "ATO Attempts", v: "23", a: "Social engineering" },
      ],
    },
    {
      label: "Regulatory",
      color: T.purple,
      icon: Globe,
      filterTags: ["ops", "fraud"],
      kpis: [
        { n: "CFPB Risk Cases", v: "7", a: ">60% escalation" },
        { n: "Social Velocity", v: "3.4×", a: "Above 2× threshold" },
        { n: "Compliance", v: "91%", a: null },
        { n: "Cmpl→Social", v: "4.2%", a: "Posting after complaints" },
      ],
    },
    {
      label: "Training & Quality",
      color: T.blue,
      icon: Target,
      filterTags: ["training"],
      kpis: [
        { n: "QA Score", v: "78%", a: "Below 85% benchmark" },
        { n: "Agent Knowledge Gap", v: "23%", a: "HELOC + fee queries" },
        { n: "Script Adherence", v: "94%", a: null },
        { n: "Coaching Completion", v: "62%", a: "Behind schedule" },
        { n: "Cross-sell Misfire", v: "18%", a: "During complaint calls" },
      ],
    },
    {
      label: "Staffing & Workforce",
      color: T.green,
      icon: Activity,
      filterTags: ["staffing"],
      kpis: [
        { n: "Staffing Gap", v: "12 short", a: "10–12 PM window" },
        { n: "Agent Utilisation", v: "94%", a: "Above 88% target" },
        { n: "Overtime Hours", v: "+34%", a: "3rd week rising" },
        { n: "BPO Quality Score", v: "68%", a: "Below 85% SLA" },
        { n: "New Hire Ramp", v: "14 agents", a: "4 weeks to ready" },
      ],
    },
  ];

  // Add LOB-specific drill KPIs
  const extraGroups: typeof groups = [];
  if (activeLob === "retail_banking" || usesRetailBankingDashboard(industry.id)) {
    const mortgageData = LOB_DRILL_KPIS.mortgage_loans;
    if (mortgageData) {
      mortgageData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.amber,
          icon: AlertTriangle,
          filterTags: ["ops", "fraud"],
          kpis: g.kpis,
        });
      });
    }
  }
  if (activeLob === "insurance" || industry.id === "insurance") {
    const insData = LOB_DRILL_KPIS.insurance_lob;
    if (insData) {
      insData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.purple,
          icon: Globe,
          filterTags: ["fraud", "ops"],
          kpis: g.kpis,
        });
      });
    }
  }
  // Head of Contact Centre drill KPIs (Per-contact CX, Service Reputation, Service Operations)
  if (role.id === "head_contact") {
    const cx = LOB_DRILL_KPIS.contact_experience;
    if (cx)
      cx.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.cyan,
          icon: Target,
          filterTags: ["ops", "training"],
          kpis: g.kpis,
        });
      });
    const rep = LOB_DRILL_KPIS.contact_service_reputation;
    if (rep)
      rep.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.amber,
          icon: Shield,
          filterTags: ["ops"],
          kpis: g.kpis,
        });
      });
    const ops = LOB_DRILL_KPIS.contact_service_operations;
    if (ops)
      ops.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.red,
          icon: Activity,
          filterTags: ["ops", "staffing"],
          kpis: g.kpis,
        });
      });
  }
  // Head of Retail Banking drill KPIs (Valuable Customers, Channel Sentiment)
  if (role.id === "head_retail") {
    const vcData = LOB_DRILL_KPIS.retail_valuable_customers;
    if (vcData) {
      vcData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.cyan,
          icon: Target,
          filterTags: ["ops"],
          kpis: g.kpis,
        });
      });
    }
    const chData = LOB_DRILL_KPIS.retail_channel_sentiment;
    if (chData) {
      chData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.purple,
          icon: Globe,
          filterTags: ["ops", "fraud"],
          kpis: g.kpis,
        });
      });
    }
  }
  // Head of Contact Centre drill KPIs (Agent Health, Promise Adherence)
  if (role.id === "head_contact") {
    const agData = LOB_DRILL_KPIS.contact_agent_health;
    if (agData) {
      agData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.cyan,
          icon: Users,
          filterTags: ["staffing", "ops"],
          kpis: g.kpis,
        });
      });
    }
    const paData = LOB_DRILL_KPIS.contact_promise_adherence;
    if (paData) {
      paData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.gold,
          icon: Shield,
          filterTags: ["ops"],
          kpis: g.kpis,
        });
      });
    }
  }
  // CRO-specific drill KPIs (Financial Crime, Consumer Duty, Cross-Jurisdiction)
  if (role.id === "cro") {
    const fcData = LOB_DRILL_KPIS.cro_financial_crime;
    if (fcData) {
      fcData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.red,
          icon: Shield,
          filterTags: ["fraud"],
          kpis: g.kpis,
        });
      });
    }
    const cdData = LOB_DRILL_KPIS.cro_consumer_duty;
    if (cdData) {
      cdData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.purple,
          icon: Lock,
          filterTags: ["fraud", "ops"],
          kpis: g.kpis,
        });
      });
    }
    const cjData = LOB_DRILL_KPIS.cro_cross_jurisdiction;
    if (cjData) {
      cjData.forEach((g) => {
        extraGroups.push({
          label: g.label,
          color: T.blue,
          icon: Globe,
          filterTags: ["ops", "fraud"],
          kpis: g.kpis,
        });
      });
    }
  }

  const allGroups = [...groups, ...extraGroups];
  const filteredGroups =
    userFilter === "all"
      ? allGroups
      : allGroups.filter((g) => g.filterTags.includes(userFilter));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {userFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setUserFilter(f.id)}
            style={{
              background: userFilter === f.id ? `${T.cyan}20` : T.elevated,
              border: `1px solid ${userFilter === f.id ? T.cyan : T.borderLight}`,
              borderRadius: 8,
              padding: "7px 16px",
              cursor: "pointer",
              color: userFilter === f.id ? T.text : T.textSec,
              fontWeight: userFilter === f.id ? 700 : 500,
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${T.borderLight}`,
          background: T.elevated,
        }}
      >
        <Badge color="cyan">Recorded</Badge>
        <span style={{ fontSize: 12, color: T.textSec, lineHeight: 1.45 }}>
          KPI tiles = operational and risk metrics from systems of record.
          Unified blocks below may add conversation-derived panels (CRO:
          financial crime, Consumer Duty).
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(filteredGroups.length, 4)}, 1fr)`,
          gap: 14,
        }}
      >
        {filteredGroups.map((g, gi) => {
          const Icon = g.icon;
          return (
            <div
              key={gi}
              style={{
                background: T.elevated,
                border: `1px solid ${T.borderLight}`,
                borderRadius: 14,
                padding: "16px 14px",
                borderTop: `3px solid ${g.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${T.borderLight}`,
                }}
              >
                <Icon size={14} color={g.color} />
                <span style={{ fontSize: 13, fontWeight: 700, color: g.color }}>
                  {g.label}
                </span>
              </div>
              {g.kpis.map((k, ki) => {
                const tc = k.a ? T.red : T.green;
                return (
                  <div
                    key={ki}
                    onClick={() => goTo(4)}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.borderLight}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      marginBottom: 8,
                      cursor: "pointer",
                      borderLeft: k.a
                        ? `3px solid ${tc}`
                        : "3px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{ fontSize: 12, fontWeight: 600, color: T.text }}
                      >
                        {k.n}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: tc,
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {k.v}
                      </span>
                    </div>
                    {k.a && (
                      <div style={{ fontSize: 10, color: tc, fontWeight: 600 }}>
                        ⚠ {k.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {unifiedNavigation ? <RoleBasedUnifiedScreen3Addon role={role} /> : null}
    </div>
  );
}

function Screen4({
  goTo,
  defaultLens,
  role,
  industryId,
  unifiedNavigation,
  eisenhowerThreads,
  sterlingCurrency = false,
}: {
  goTo: (n: ScreenId) => void;
  defaultLens?: LensId;
  role: Role;
  industryId: Industry["id"];
  unifiedNavigation: boolean;
  eisenhowerThreads: EisenhowerThread[];
  sterlingCurrency?: boolean;
}) {
  const T = useDashboardTheme();
  const [lens, setLens] = useState<LensId>(defaultLens ?? "ops");
  const lenses: Record<
    LensId,
    {
      label: string;
      icon: LucideIcon;
      color: string;
      cols: { t: string; items: [string, string, string, string][] }[];
    }
  > = {
    ops: {
      label: "Operations",
      icon: Activity,
      color: T.gold,
      cols: [
        {
          t: "Process Breakdown",
          items: [
            ["Vol vs Capacity", "112%", "Exceeded 9–11 AM", T.red],
            ["Queue Depth", "847", "Peak: 10:15 AM", T.amber],
            ["SLA Adherence", "87%", "Below 95%", T.red],
            ["Backlog Age", "312 >48h", "Growing 8%/week", T.amber],
          ],
        },
        {
          t: "Workforce Layer",
          items: [
            ["Staffing Gap", "12 short", "10–12 PM window", T.red],
            ["AHT Trend", "8.3m ▲", "3rd week above target", T.amber],
            ["Agent Variation", "3.2× spread", "Best 4.1, Worst 13.2", T.amber],
            ["BPO Performance", "2.7× slower", "Evidence collection", T.red],
          ],
        },
        {
          t: "Pattern Signals",
          items: [
            ["Peak Spike", "9–11 AM", "32% over capacity", T.red],
            ["Region Skew", "Florida", "3× avg complaints", T.amber],
            ["Channel Shift", "Voice→Chat", "12% migration", T.cyan],
            ["Segment", "Premium", "Highest dissatisfaction", T.amber],
          ],
        },
      ],
    },
    risk: {
      label: "Risk",
      icon: Shield,
      color: T.red,
      cols: [
        {
          t: "Fraud Signals",
          items: [
            ["Active Alerts", "69", "▲12 in 24h", T.red],
            ["Social Eng.", "23 calls", "FL seniors targeted", T.red],
            ["Card Testing", "89 cards", "MCC 7995 gaming", T.amber],
            ["ATO Attempts", "23", "Via contact centre", T.amber],
          ],
        },
        {
          t: "System Risk",
          items: [
            ["KYC API", "3× latency", "Since Tuesday", T.red],
            ["Payment Gateway", "0.4% errors", "Above 0.1%", T.amber],
            ["Retry Anomalies", "2,340", "Unusual auth pattern", T.amber],
            ["App Crashes", "847", "iOS password loop", T.amber],
          ],
        },
        {
          t: "Exposure View",
          items: [
            ["Customers Hit", "2,847", "All active events", T.red],
            ["Breach Cards", "1,247", "Reissuance 68%", T.red],
            ["Value at Risk", "$312K", "Merchant breach", T.red],
            ["Fraud Loss/Wk", "$47K", "MCC 7995", T.amber],
          ],
        },
      ],
    },
    compliance: {
      label: "Compliance",
      icon: Lock,
      color: T.purple,
      cols: [
        {
          t: "Complaint Risk",
          items: [
            ["Backlog", "312 open", "28 new this week", T.red],
            ["SLA Breach", "43 cases", "Within 3 days", T.red],
            ["Escalation Delays", "7 cases", ">60% CFPB prob", T.red],
            ["Unactioned", "3", ">4 hours", T.amber],
          ],
        },
        {
          t: "Reputation",
          items: [
            ["Sentiment", "0.58 ▼", "Below 0.60 — 2nd wk", T.red],
            ["Social Velocity", "3.4×", "Backlash + competitor", T.red],
            ["App Store", "4.1 ▼0.2", "Dropped 30 days", T.amber],
            ["Cmpl→Social", "4.2%", "Posting after filing", T.amber],
          ],
        },
        {
          t: "Regulatory",
          items: [
            ["CFPB Risk", "7", ">60% escalation", T.red],
            ["Reg E Deadline", "43", "Provisional credit due", T.red],
            ["Doc Gaps", "12%", "Incomplete trails", T.amber],
            ["Compliance/Unit", "91%", "Cards 88%, Retail 94%", T.green],
          ],
        },
      ],
    },
  };

  const L = lenses[lens];
  const displayCols = useMemo(
    () =>
      sterlingCurrency
        ? L.cols.map((col) => ({
            ...col,
            items: col.items.map(
              (row) =>
                [row[0], swapUsdSymbolForSterling(row[1]), row[2], row[3]] as [
                  string,
                  string,
                  string,
                  string,
                ],
            ),
          }))
        : L.cols,
    [L.cols, sterlingCurrency],
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {Object.entries(lenses).map(([id, l]) => {
          const Icon = l.icon;
          return (
            <button
              key={id}
              onClick={() => setLens(id as LensId)}
              style={{
                background: lens === id ? `${l.color}20` : T.elevated,
                border: `1px solid ${lens === id ? l.color : T.borderLight}`,
                borderRadius: 10,
                padding: "10px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: lens === id ? T.text : T.textSec,
                fontWeight: lens === id ? 700 : 500,
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              <Icon size={14} /> {l.label}
            </button>
          );
        })}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {displayCols.map((col, ci) => (
          <Sec key={ci} title={col.t} lane="recorded">
            {col.items.map(([l, v, s, c], i) => (
              <div
                key={i}
                onClick={c === T.red ? () => goTo(5) : undefined}
                style={{
                  background: T.surface,
                  border: `1px solid ${c === T.red ? `${T.red}35` : T.borderLight}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 8,
                  cursor: c === T.red ? "pointer" : "default",
                  borderLeft:
                    c === T.red
                      ? `3px solid ${T.red}`
                      : "3px solid transparent",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: 12, color: T.text }}>{l}</span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: c,
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {v}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 3 }}>
                  {s}
                </div>
              </div>
            ))}
          </Sec>
        ))}
      </div>
      {unifiedNavigation ? (
        <RoleBasedUnifiedScreen4Addon
          lens={lens}
          role={role}
          threads={eisenhowerThreads}
          industryId={industryId}
        />
      ) : null}
    </div>
  );
}

function Screen5({
  data,
  role,
  unifiedNavigation,
  sterlingCurrency = false,
}: {
  data: RoleDashboardData;
  role: Role;
  unifiedNavigation: boolean;
  sterlingCurrency?: boolean;
}) {
  const T = useDashboardTheme();
  const incidents = [
    {
      sev: "critical",
      title: data.insights[0]?.split("—")[0] || "Critical Issue",
      what: data.insights[0] || "",
      where: {
        ch: "Voice + Digital",
        region: "National",
        product: "Retail Banking",
      },
      why: [data.insights[0] || "", data.insights[1] || ""],
      impact: {
        cust: "2,847 impacted",
        fin: sterlingCurrency ? "£312K exposure" : "$312K exposure",
        sla: "SLA breach — 3 days",
      },
      actions: [
        { type: "fix", text: data.eisenhower.do[0] || "Fix primary issue" },
        { type: "fix", text: data.eisenhower.do[1] || "Fix secondary issue" },
        {
          type: "escalate",
          text: data.eisenhower.plan[0] || "Escalate to team",
        },
        {
          type: "outreach",
          text: "Proactive customer notification for affected accounts",
        },
      ],
    },
  ];
  if (data.insights[2]) {
    incidents.push({
      sev: "warning",
      title: data.insights[2].split("—")[0] || "Warning",
      what: data.insights[2],
      where: {
        ch: "Multiple channels",
        region: "Specific cohort",
        product: "Retail Banking",
      },
      why: [data.insights[2]],
      impact: {
        cust: "Cohort affected",
        fin: "Revenue / compliance risk",
        sla: "Monitoring required",
      },
      actions: [
        { type: "fix", text: data.eisenhower.plan[1] || "Address root cause" },
        { type: "escalate", text: "Escalate for review" },
      ],
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {incidents.map((inc, i) => {
        const col = inc.sev === "critical" ? T.red : T.amber;
        return (
          <div
            key={i}
            style={{
              background: T.elevated,
              border: `1px solid ${col}40`,
              borderRadius: 14,
              padding: 22,
              borderLeft: `4px solid ${col}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Badge color={inc.sev === "critical" ? "red" : "amber"}>
                {inc.sev}
              </Badge>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
                {inc.title}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.textSec,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                1. What Happened
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: T.text,
                  lineHeight: 1.65,
                  background: `${col}10`,
                  border: `1px solid ${col}25`,
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                {inc.what}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.textSec,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                2. Where
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  ["Channel", inc.where.ch],
                  ["Region", inc.where.region],
                  ["Product", inc.where.product],
                ].map(([l, v], j) => (
                  <div
                    key={j}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.borderLight}`,
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textSec,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{ fontSize: 13, color: T.text, fontWeight: 600 }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.textSec,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  3. Why
                </span>
                <Badge color="gold">AI Root Cause</Badge>
              </div>
              {inc.why.filter(Boolean).map((w, j) => (
                <div
                  key={j}
                  style={{
                    background: `${T.amber}10`,
                    border: `1px solid ${T.amber}25`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: `${T.amber}25`,
                      color: T.amber,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {j + 1}
                  </span>
                  <span
                    style={{ fontSize: 12, color: T.text, lineHeight: 1.55 }}
                  >
                    {w}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.textSec,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                4. Impact
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  ["Customers", inc.impact.cust, T.amber],
                  ["Financial", inc.impact.fin, T.red],
                  ["SLA", inc.impact.sla, T.amber],
                ].map(([l, v, c], j) => (
                  <div
                    key={j}
                    style={{
                      background: `${c}15`,
                      border: `1px solid ${c}35`,
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textSec,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{ fontSize: 14, color: T.text, fontWeight: 700 }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.textSec,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  5. Actions
                </span>
                <Badge color="teal">AI-Proposed</Badge>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {inc.actions.map((a, j) => {
                  const ac =
                    a.type === "fix"
                      ? T.cyan
                      : a.type === "escalate"
                        ? T.amber
                        : T.green;
                  return (
                    <div
                      key={j}
                      style={{
                        background: `${ac}10`,
                        border: `1px solid ${ac}30`,
                        borderRadius: 10,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          background: `${ac}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {a.type === "fix" ? (
                          <CheckCircle size={13} color={ac} />
                        ) : a.type === "escalate" ? (
                          <AlertTriangle size={13} color={ac} />
                        ) : (
                          <MessageCircle size={13} color={ac} />
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: T.text, flex: 1 }}>
                        {a.text}
                      </span>
                      <Badge
                        color={
                          a.type === "fix"
                            ? "teal"
                            : a.type === "escalate"
                              ? "amber"
                              : "green"
                        }
                      >
                        {a.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      {unifiedNavigation ? <RoleBasedUnifiedScreen5Addon role={role} /> : null}
    </div>
  );
}

// ═══════════════════════════
// DASHBOARD SHELL (per role route)
// ═══════════════════════════

export type RoleDashboardViewProps = {
  industry: Industry;
  role: Role;
  onExit: () => void;
  /** When set (e.g. Swedbank compliance styling), overrides default industry dashboard colors. */
  theme?: DashboardThemeTokens;
  /**
   * When true, embeds unified intelligence components (AI spikes, filters bar, persona-specific panels)
   * per screen. Used by `/role-based` routes.
   */
  unifiedNavigation?: boolean;
};

function RoleDashboardShell({
  industry,
  role,
  onExit,
  unifiedNavigation,
  eisenhowerThreads,
}: {
  industry: Industry;
  role: Role;
  onExit: () => void;
  unifiedNavigation: boolean;
  eisenhowerThreads: EisenhowerThread[];
}) {
  const T = useDashboardTheme();
  const [screen, setScreen] = useState<ScreenId>(() =>
    defaultScreenForRole(industry, role),
  );
  const defaultLob =
    industry.id === "insurance"
      ? "insurance"
      : industry.id === "credit_cards"
        ? "cards_business"
        : "retail_banking";
  const [activeLob, setActiveLob] = useState<string>(defaultLob);
  const roleDataMap = ROLE_DATA as Record<string, RoleDashboardData>;
  const roleDataKey = resolveRoleDataKey(industry.id, role.id);
  const rawData = roleDataMap[roleDataKey] ?? ROLE_DATA.ceo;
  const sterlingHeadContactCurrency = useSterlingHeadContactCurrencyActive(
    undefined,
    industry.id,
    role.id,
  );
  const sterlingCurrency = useSterlingHeadRetailCurrencyActive(
    undefined,
    industry.id,
    role.id,
  );
  const data = useMemo(() => {
    let next = rawData;
    if (sterlingHeadContactCurrency) next = swapContactUsdDeep(next);
    else if (sterlingCurrency) next = swapUsdSymbolDeep(next);
    return next;
  }, [rawData, sterlingCurrency, sterlingHeadContactCurrency]);

  const IndIcon = industry.icon;
  const RoleIcon = role.icon;
  const active = (() => {
    const row = SCREENS.find((s) => s.id === screen);
    return row ? screenNavEntry(role.id, row) : undefined;
  })();
  const executiveSub =
    sterlingCurrency && active?.sub === "Promise · Stability · Risk"
      ? "Promise · Stability · Volume"
      : active?.sub;
  const initialLens: LensId =
    "defaultLens" in role &&
    (role.defaultLens === "ops" ||
      role.defaultLens === "risk" ||
      role.defaultLens === "compliance")
      ? role.defaultLens
      : "ops";

  const personaFilter = initialKpiSignalFilter(role.id);

  const [drillCard, setDrillCard] = useState<number | null>(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const SIDEBAR_W_EXPANDED = 268;
  const SIDEBAR_W_COLLAPSED = 76;
  const sidebarW = sidebarHover ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  useEffect(() => {
    const visibleIds = new Set(
      visibleSidebarScreens(industry.id, role.id).map((entry) => entry.id),
    );
    if (!visibleIds.has(screen)) {
      setScreen(defaultScreenForRole(industry, role));
      setDrillCard(null);
    }
  }, [industry, role, screen]);

  const screenComponents: Record<ScreenId, ReactElement> = {
    1: (
      <Screen1
        data={data}
        goTo={setScreen}
        role={role}
        industry={industry}
        unifiedNavigation={unifiedNavigation}
        onDrillCard={setDrillCard}
      />
    ),
    2: (
      <Screen2
        goTo={setScreen}
        industry={industry}
        onLobChange={setActiveLob}
        activeLob={activeLob}
        role={role}
        unifiedNavigation={unifiedNavigation}
        eisenhowerThreads={eisenhowerThreads}
      />
    ),
    3: (
      <Screen3
        goTo={setScreen}
        activeLob={activeLob}
        industry={industry}
        role={role}
        unifiedNavigation={unifiedNavigation}
        personaInitialFilter={personaFilter}
      />
    ),
    4: (
      <Screen4
        goTo={setScreen}
        defaultLens={initialLens}
        role={role}
        industryId={industry.id}
        unifiedNavigation={unifiedNavigation}
        eisenhowerThreads={eisenhowerThreads}
        sterlingCurrency={sterlingCurrency}
      />
    ),
    5: (
      <Screen5
        data={data}
        role={role}
        unifiedNavigation={unifiedNavigation}
        sterlingCurrency={sterlingCurrency}
      />
    ),
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "var(--font), system-ui, sans-serif",
      }}
    >
      <div
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        style={{
          width: sidebarW,
          minWidth: sidebarW,
          transition: "width 0.22s ease, min-width 0.22s ease",
          background: T.elevated,
          borderRight: `1px solid ${T.borderLight}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        <div
          style={{
            padding: sidebarHover ? "18px 16px" : "14px 10px",
            borderBottom: `1px solid ${T.borderLight}`,
            textAlign: sidebarHover ? "left" : "center",
          }}
        >
          {sidebarHover ? (
            <>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: T.cyan,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                }}
              >
                Yaaralabs
              </div>
              <div style={{ fontSize: 13, color: T.textMut, marginTop: 2 }}>
                Fluid Intelligence
              </div>
            </>
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                margin: "0 auto",
                borderRadius: 10,
                background: T.cyanGlow,
                border: `1px solid ${T.cyan}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                color: T.cyan,
                fontFamily: "var(--mono)",
              }}
              title="Yaaralabs · Fluid Intelligence"
            >
              Y
            </div>
          )}
        </div>
        <div
          style={{
            padding: sidebarHover ? "12px 14px" : "10px 8px",
            borderBottom: `1px solid ${T.borderLight}`,
            display: "flex",
            flexDirection: "column",
            gap: sidebarHover ? 8 : 6,
            alignItems: sidebarHover ? "stretch" : "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: sidebarHover ? "flex-start" : "center",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `${industry.color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IndIcon size={12} color={industry.color} />
            </div>
            {sidebarHover ? (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.text,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {industry.name}
              </span>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: sidebarHover ? "flex-start" : "center",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `${industry.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <RoleIcon size={12} color={industry.color} />
            </div>
            {sidebarHover ? (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.cyan,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {roleDisplayName(role)}
              </span>
            ) : null}
          </div>
        </div>
        <div
          style={{
            padding: sidebarHover ? "10px 8px" : "8px 6px",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {sidebarHover ? (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.textMut,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              Drill-Down
            </div>
          ) : (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.textMut,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 6,
                textAlign: "center",
                opacity: 0.85,
              }}
              title="Drill-down navigation"
            >
              Nav
            </div>
          )}
          {visibleSidebarScreens(industry.id, role.id).map((s, i, visibleScreens) => {
            const Icon = s.icon;
            const act = screen === s.id;
            const nav = screenNavEntry(role.id, s);
            const tip = screenNavTooltip(role.id, s);
            return (
              <div key={s.id}>
                <button
                  type="button"
                  title={tip}
                  onClick={() => {
                    setScreen(s.id);
                    setDrillCard(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: sidebarHover ? 8 : 0,
                    padding: sidebarHover ? "8px 10px" : "10px 8px",
                    width: "100%",
                    textAlign: "left",
                    background: act ? T.cyanGlow : "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    borderLeft: act
                      ? `3px solid ${T.cyan}`
                      : "3px solid transparent",
                    justifyContent: sidebarHover ? "flex-start" : "center",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: act ? T.cyanGlow : `${T.textMut}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={11} color={act ? T.cyan : T.textMut} />
                  </div>
                  {sidebarHover ? (
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: act ? 700 : 500,
                          color: act ? T.text : T.textSec,
                        }}
                      >
                        {!isDrillRoleId(role.id) ? (
                          <span
                            style={{
                              color: act ? T.cyan : T.textMut,
                              fontFamily: "var(--mono)",
                              marginRight: 4,
                              fontSize: 12,
                            }}
                          >
                            {s.id}.
                          </span>
                        ) : null}
                        {nav.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: T.textMut,
                          lineHeight: 1.35,
                        }}
                      >
                        {s.sub}
                      </div>
                    </div>
                  ) : null}
                </button>
                {sidebarHover && i < visibleScreens.length - 1 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: T.borderLight,
                      fontSize: 11,
                      padding: "1px 0",
                    }}
                  >
                    ↓
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          style={{
            padding: sidebarHover ? "10px 12px" : "10px 8px",
            borderTop: `1px solid ${T.borderLight}`,
          }}
        >
          <button
            type="button"
            title="Change role"
            onClick={onExit}
            style={{
              background: T.surface,
              border: `1px solid ${T.borderLight}`,
              borderRadius: 8,
              padding: sidebarHover ? "8px 14px" : "10px 8px",
              cursor: "pointer",
              color: T.textSec,
              fontSize: 13,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: sidebarHover ? 6 : 0,
              fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={11} />
            {sidebarHover ? "Change Role" : null}
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isDrillRoleId(role.id) &&
        drillCard === null &&
        screen === 1 ? null : unifiedNavigation ? (
          <div
            style={{
              padding: "12px 24px",
              borderBottom: `1px solid ${T.borderLight}`,
              background: T.elevated,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.text,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {!isDrillRoleId(role.id) ? (
                  <span
                    style={{
                      color: T.cyan,
                      fontFamily: "var(--mono)",
                      marginRight: 8,
                    }}
                  >
                    Screen {active?.id}
                  </span>
                ) : null}
                {active?.label}
              </h1>
              <div
                style={{
                  fontSize: 14,
                  color: T.textSec,
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                {industry.name} · {roleDisplayName(role)} · {executiveSub}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
                flexShrink: 0,
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                style={{
                  background: `linear-gradient(135deg, ${T.cyan}, ${T.green})`,
                  color: T.bg,
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Export Report
              </button>
              <RoleBasedComplianceTimePills />
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "12px 24px",
              borderBottom: `1px solid ${T.borderLight}`,
              background: T.elevated,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.text,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {!isDrillRoleId(role.id) ? (
                  <span
                    style={{
                      color: T.cyan,
                      fontFamily: "var(--mono)",
                      marginRight: 8,
                    }}
                  >
                    Screen {active?.id}
                  </span>
                ) : null}
                {active?.label}
              </h1>
              <div
                style={{
                  fontSize: 14,
                  color: T.textSec,
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                {industry.name} · {roleDisplayName(role)} · {executiveSub}
              </div>
            </div>
            <button
              type="button"
              style={{
                background: `linear-gradient(135deg, ${T.cyan}, ${T.green})`,
                color: T.bg,
                border: "none",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Export Report
            </button>
          </div>
        )}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: unifiedNavigation ? "16px 18px 20px" : "18px 22px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {isDrillRoleId(role.id) && drillCard === null && screen === 1 ? (
            <div
              style={{
                margin: unifiedNavigation
                  ? "-16px -18px 10px -18px"
                  : "-18px -22px 10px -22px",
                padding: "10px 24px 0",
                background: "transparent",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {shouldShowExecutiveBrief(industry.id, role.id) ? (
                  <div
                    style={{
                      background: T.elevated,
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: `1px solid ${T.borderLight}`,
                      boxShadow: `0 0 0 1px ${T.amber}12 inset`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        minWidth: 0,
                      }}
                    >
                      <span style={{ fontSize: 13, color: T.amber }}>✨</span>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.amber,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Executive Brief
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 7,
                        fontSize: 13.5,
                        color: T.textSec,
                        lineHeight: 1.4,
                      }}
                    >
                      {role.id === "head_contact"
                        ? "↕ Per-contact CSAT −7pts, service-driven brand −8pts, service ops −12pts; BPO Beta is the top operational risk"
                        : "Satisfaction up +4pts — only score improving. Brand -6pts, service delivery -14pts"}
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    background: T.elevated,
                    borderRadius: 10,
                    padding: "12px 14px",
                    borderLeft: `3px solid ${T.amber}`,
                    border: `1px solid ${T.borderLight}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: T.amber,
                      }}
                    >
                      ✨
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.amber,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Executive Pulse
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 8,
                      alignItems: "stretch",
                    }}
                  >
                    {(role.id === "head_contact"
                      ? [
                          {
                            q: "🔴 What's critical",
                            main: "BPO Beta dispute win-rate dropped to 38% vs 71% in-house. Evidence-collection step ~4 days slow.",
                          },
                          {
                            q: "🎯 Where's your focus",
                            main: "SLA 87% (3rd week below 95%) · 12-agent staffing gap 10–11 AM · 22% repeat-contact rate.",
                          },
                          {
                            q: "🟢 What's stable/ on-track",
                            main: "In-house FCR holding at 81% · App SS deflection 89% — escalate BPO QA + activate overflow before 9:45 AM.",
                          },
                        ]
                      : role.id === "cards_portfolio"
                        ? [
                            {
                              q: "🔴 What's critical",
                              main: "Premium-HNI declines +38% WoW since 11:00 — a CoFT re-tokenisation break, ₹2.4 Cr at risk. Route the fix to Ops now.",
                            },
                            {
                              q: "🎯 Where's your focus",
                              main: "4 'incorrect late fee' cases sit inside the 30-day IO clock on one co-brand (queue Q-07); weak-auth adds ₹6–9L exposure.",
                            },
                            {
                              q: "🟢 What's stable / on-track",
                              main: "62% of the decline spike is curable — ₹2.4 Cr recoverable today via a cohort-level EMI-conversion nudge.",
                            },
                          ]
                        : [
                          {
                            q: "🔴 What's critical",
                            main: "3 HNI accounts flagged for churn. Closure intents up 375% this week, escalate to relationship managers today",
                          },
                          {
                            q: "🎯 Where's your focus",
                            main: "KYC API delays blocking 580 applications. SLA trend down 6% WoW, bottleneck identified",
                          },
                          {
                            q: "🟢 What's stable/ on-track",
                            main: "App Store holding at 0.71 — best performing channel, digital migration positive",
                          },
                        ]
                    ).map((item, idx) => (
                      <div
                        key={item.q}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${T.borderLight}`,
                          borderRadius: 8,
                          padding: "9px 10px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: "#b7a6ff",
                            }}
                          >
                            {idx + 1}. {item.q}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 13.5,
                            color: T.textSec,
                            lineHeight: 1.35,
                            fontWeight: 600,
                          }}
                        >
                          {item.main}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {isDrillRoleId(role.id) && drillCard !== null ? (
            (() => {
              const onBack = () => setDrillCard(null);
              const drillContent =
                role.id === "head_contact" ? (
                  renderHeadContactDrillCard(
                    drillCard,
                    onBack,
                    industry.id,
                    role.id,
                  )
                ) : role.id === "cards_portfolio" ? (
                  drillCard === 0 ? (
                    <CardsTransactionsOffersDrill onBack={onBack} />
                  ) : drillCard === 1 ? (
                    <CardsBlockersProblemsDrill onBack={onBack} />
                  ) : (
                    <CardsVoiceJoinDrill onBack={onBack} />
                  )
                ) : drillCard === 0 ? (
                  <CustomerHappinessDrillDown
                    onBack={onBack}
                    sterlingCurrency={sterlingCurrency}
                  />
                ) : drillCard === 1 ? (
                  <BrandReputationDrillDown
                    onBack={onBack}
                    variant={
                      sterlingCurrency ? "sterling-brand-reputation" : "default"
                    }
                  />
                ) : (
                  <ServiceFulfilmentDrillDown
                    onBack={onBack}
                    sterlingCurrency={sterlingCurrency}
                  />
                );
              // Unify every card / panel / pill background on the drill-down
              // tiers (retail: Customers happy? · Brand at risk? · Service delivery?
              //  · contact: Contact ending well? · Service reputation? · Service engine?)
              // to #0D0D0D by overriding the theme tokens that power their `background`
              // styles (`T.elevated`, `T.card`, `T.surface`). This cascades through
              // every descendant that reads the dashboard theme via `useDashboardTheme()`.
              const drillTheme: DashboardThemeTokens = {
                ...T,
                elevated: "#0D0D0D",
                card: "#0D0D0D",
                surface: "#0D0D0D",
              };
              const themedDrill = (
                <DashboardThemeProvider value={drillTheme}>
                  {drillContent}
                </DashboardThemeProvider>
              );
              return unifiedNavigation ? (
                <RoleBasedUnifiedReadingShell>
                  {themedDrill}
                </RoleBasedUnifiedReadingShell>
              ) : (
                themedDrill
              );
            })()
          ) : unifiedNavigation ? (
            <RoleBasedUnifiedReadingShell>
              {screenComponents[screen]}
            </RoleBasedUnifiedReadingShell>
          ) : (
            screenComponents[screen]
          )}
        </div>
        {unifiedNavigation ? <RoleBasedUnifiedChrome /> : null}
      </div>
    </div>
  );
}

export function RoleDashboardView({
  industry,
  role,
  onExit,
  theme,
  unifiedNavigation = false,
}: RoleDashboardViewProps) {
  const eisenhowerThreadsRaw = useEisenhowerThreadsSnapshot(unifiedNavigation);
  const sterlingHeadRetailRoute = useSterlingHeadRetailCurrencyActive(
    undefined,
    industry.id,
    role.id,
  );
  const eisenhowerThreads = useMemo(
    () =>
      sterlingHeadRetailRoute
        ? swapUsdSymbolDeep(eisenhowerThreadsRaw)
        : eisenhowerThreadsRaw,
    [eisenhowerThreadsRaw, sterlingHeadRetailRoute],
  );

  if (industry.id === "credit_cards" && role.id === "head_cards") {
    return (
      <HeadOfCreditCardsDashboard
        industryName={industry.name}
        roleName={roleDisplayName(role)}
        industryColor={industry.color}
        onExit={onExit}
        theme={theme}
      />
    );
  }

  if (industry.id === "credit_cards" && role.id === "cards_portfolio_v2") {
    return <CardsPortfolioV2Dashboard onExit={onExit} />;
  }

  if (industry.id === "openbank" && role.id === "ceo_insight") {
    return (
      <OpenbankInsightExecutiveDashboard
        industryName={industry.name}
        industryColor={industry.color}
        onExit={onExit}
        theme={theme}
      />
    );
  }

  if (industry.id === "rbi_conduct") {
    const lensByRole: Record<string, "L1" | "L2" | "L3" | "L4" | "L5"> = {
      head_product_digital: "L1",
      board_nrc: "L1",
      cco_customer: "L2",
      head_cx: "L3",
      cro_conduct: "L4",
      io_office: "L5",
    };
    return (
      <RbiConductIntelligencePreview
        industryName={industry.name}
        industryColor={industry.color}
        onExit={onExit}
        theme={theme}
        defaultLens={lensByRole[role.id] ?? "L1"}
      />
    );
  }

  if (industry.id === "fastag") {
    return (
      <FastagIntelligenceDashboard
        industryName={industry.name}
        industryColor={industry.color}
        roleName={roleDisplayName(role)}
        initialPersona={role.id === "head_cx" ? "coh" : "hob"}
        onExit={onExit}
        theme={theme}
      />
    );
  }

  if (industry.id === "ecommerce" && role.id === "business_head") {
    return (
      <CategoryIntelligenceDashboard
        industryName={industry.name}
        roleName={roleDisplayName(role)}
        industryColor={industry.color}
        onExit={onExit}
      />
    );
  }

  if (industry.id === "ecommerce" && role.id === "head_cx_retail") {
    return (
      <CXVoCHeadDashboard
        industryId={industry.id}
        industryName={industry.name}
        roleName={roleDisplayName(role)}
        industryColor={industry.color}
        onExit={onExit}
      />
    );
  }

  if (industry.id === "ecommerce" && role.id === "head_cx_retail_v2") {
    return (
      <CXVoCHeadDashboardV2
        industryId={industry.id}
        industryName={industry.name}
        roleName={roleDisplayName(role)}
        industryColor={industry.color}
        onExit={onExit}
      />
    );
  }

  return (
    <DashboardThemeProvider value={theme ?? INDUSTRY_THEME}>
      <RoleDashboardShell
        industry={industry}
        role={role}
        onExit={onExit}
        unifiedNavigation={unifiedNavigation}
        eisenhowerThreads={eisenhowerThreads}
      />
    </DashboardThemeProvider>
  );
}
