"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  FileWarning,
  Globe,
  Lock,
  MessageCircle,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";

/** Recharts default tooltip uses black for item text; set label + item colors for dark surfaces. */
function croRechartsTooltipProps(T: DashboardThemeTokens) {
  return {
    contentStyle: {
      background: T.elevated,
      border: `1px solid ${T.borderLight}`,
      borderRadius: 8,
      fontSize: 11,
      color: T.text,
    },
    labelStyle: { color: T.text, fontWeight: 600 },
    itemStyle: { color: T.text },
  };
}
import {
  CRO_EXEC_KPIS,
  CRO_LOB_RISK_DATA,
  CRO_FINANCIAL_CRIME_SIGNALS,
  CRO_CONSUMER_DUTY,
  CRO_CROSS_JURISDICTION,
  CRO_SMCR_ACCOUNTABILITY,
  CRO_INVESTIGATIONS,
  CRO_AI_CHAT_SUGGESTIONS,
  CRO_AI_CHAT_RESPONSES,
} from "@/lib/role-based-dashboard/croData";

/* ── shared helpers ── */

function SevBadge({ severity }: { severity: string }) {
  const T = useDashboardTheme();
  const m: Record<string, [string, string]> = {
    critical: [T.red, T.redGlow],
    high: [T.amber, T.amberGlow],
    medium: [T.gold, T.goldGlow],
    low: [T.green, T.greenGlow],
  };
  const [fg, bg] = m[severity] ?? m.medium;
  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontSize: 9,
        fontWeight: 800,
        padding: "3px 10px",
        borderRadius: 6,
        letterSpacing: 0.8,
        textTransform: "uppercase",
      }}
    >
      {severity}
    </span>
  );
}

function SectionHeader({
  icon: Icon,
  color,
  title,
  badge,
  sub,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  title: string;
  badge?: string;
  sub?: string;
}) {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{title}</span>
          {badge && (
            <span
              style={{
                background: `${color}20`,
                color,
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {sub && <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({
  children,
  style,
  lane,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Recorded = systems-of-record style metrics; conversation = NLP / model interpretation on interactions. */
  lane?: "recorded" | "conversation";
}) {
  const T = useDashboardTheme();
  const base: React.CSSProperties = {
    background: T.elevated,
    border: `1px solid ${T.borderLight}`,
    borderRadius: 14,
    padding: 22,
  };
  if (lane === "recorded") {
    base.borderLeft = `4px solid ${T.cyan}`;
  }
  if (lane === "conversation") {
    base.borderLeft = `4px solid ${T.gold}`;
    base.backgroundImage = `linear-gradient(135deg, ${T.gold}0c 0%, transparent 44%)`;
  }
  return <div style={{ ...base, ...style }}>{children}</div>;
}

function CroLaneLegend() {
  const T = useDashboardTheme();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${T.borderLight}`,
        background: T.surface,
        marginBottom: 2,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textSec, lineHeight: 1.4 }}>
        <span style={{ width: 4, height: 16, borderRadius: 2, background: T.cyan, flexShrink: 0 }} />
        <span>
          <strong style={{ color: T.text }}>Recorded</strong> — SAR stages, QA scores, compliance matrices, case counts.
        </span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textSec, lineHeight: 1.4 }}>
        <span style={{ width: 4, height: 16, borderRadius: 2, background: T.gold, flexShrink: 0 }} />
        <span>
          <strong style={{ color: T.text }}>Conversation AI</strong> — distributions, heatmaps, NLP signals, proposed actions.
        </span>
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  sub,
  delta,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
  delta?: number;
}) {
  const T = useDashboardTheme();
  return (
    <div
      style={{
        background: T.elevated,
        border: `1px solid ${T.borderLight}`,
        borderRadius: 12,
        padding: "16px 14px",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "var(--mono)", lineHeight: 1 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ fontSize: 11, color: delta > 0 ? T.red : delta < 0 ? T.green : T.green, fontWeight: 600, marginTop: 6 }}>
          {delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${Math.abs(delta)}` : "✓ Clean"} vs last week
        </div>
      )}
      {sub && <div style={{ fontSize: 10, color: T.textSec, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 1 — Executive Risk Cockpit
   ═══════════════════════════════════════ */

export function CROScreen1Addon() {
  const T = useDashboardTheme();
  const kpis = CRO_EXEC_KPIS;

  // Recharts trend data for the risk appetite area chart
  const trendData = kpis.riskAppetite.trend.map((v, i) => ({
    week: `W${i + 1}`,
    riskAppetite: v,
    consumerDuty: kpis.consumerDuty.trend[i],
    finCrime: kpis.finCrimeIndex.trend[i],
  }));

  // SAR pipeline data for bar chart
  const sarData = [
    { stage: "Detected", count: kpis.openSars.breakdown.detected, fill: T.red },
    { stage: "Review", count: kpis.openSars.breakdown.underReview, fill: T.amber },
    { stage: "Filed", count: kpis.openSars.breakdown.filed, fill: T.cyan },
    { stage: "Ack", count: kpis.openSars.breakdown.acknowledged, fill: T.green },
  ];

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      {/* Top KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <MetricCard label="Risk Appetite Score" value={kpis.riskAppetite.value} color={T.amber} delta={kpis.riskAppetite.delta} />
        <MetricCard label="Consumer Duty Compliance" value={kpis.consumerDuty.value} color={T.purple} delta={kpis.consumerDuty.delta} />
        <MetricCard label="Financial Crime Risk" value={kpis.finCrimeIndex.value} color={T.red} sub="Index: 72/100 — rising" />
        <MetricCard label="Vulnerable Customer Detection" value={kpis.vulnerableDetection.value} color={T.green} delta={kpis.vulnerableDetection.delta} />
      </div>

      {/* Charts row: Trend + SAR pipeline */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
        {/* Risk Trend Area Chart */}
        <Card lane="recorded">
          <SectionHeader icon={TrendingUp} color={T.cyan} title="Risk Trend (5-Week)" sub="Risk Appetite · Consumer Duty · Financial Crime" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.cyan} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.cyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradFC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.red} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
              <XAxis dataKey="week" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis tick={{ fill: T.textSec, fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 100]} />
              <Tooltip {...croRechartsTooltipProps(T)} />
              <Area type="monotone" dataKey="riskAppetite" stroke={T.cyan} fill="url(#gradRA)" strokeWidth={2} name="Risk Appetite" />
              <Area type="monotone" dataKey="consumerDuty" stroke={T.purple} fill="url(#gradCD)" strokeWidth={2} name="Consumer Duty" />
              <Area type="monotone" dataKey="finCrime" stroke={T.red} fill="url(#gradFC)" strokeWidth={2} name="Fin Crime Index" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* SAR Pipeline Bar Chart */}
        <Card lane="recorded">
          <SectionHeader icon={FileWarning} color={T.red} title="SAR Pipeline" badge="47 OPEN" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
              <XAxis dataKey="stage" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis tick={{ fill: T.textSec, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...croRechartsTooltipProps(T)} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                {sarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row: Regulatory + SMCR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <MetricCard
          label="Open SARs"
          value={kpis.openSars.value}
          color={T.red}
          delta={kpis.openSars.delta}
          sub={`Detected ${kpis.openSars.breakdown.detected} · Review ${kpis.openSars.breakdown.underReview} · Filed ${kpis.openSars.breakdown.filed}`}
        />
        <MetricCard label="Regulatory Findings" value={kpis.regulatoryFindings.value} color={T.amber} delta={kpis.regulatoryFindings.delta} sub="FCA Consumer Duty + CFPB" />
        <MetricCard label="SMCR Breaches" value={kpis.smcrBreaches.value} color={T.green} delta={kpis.smcrBreaches.delta} sub="Senior Management Certification Regime" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 2 — CRO Risk by LOB
   ═══════════════════════════════════════ */

export function CROScreen2Addon({ activeLob }: { activeLob: string }) {
  const T = useDashboardTheme();
  const lobData = CRO_LOB_RISK_DATA[activeLob] ?? CRO_LOB_RISK_DATA.retail_banking;
  const dist = lobData.customerRiskDistribution;

  const pieData = [
    { name: "Low", value: dist.low, color: T.green },
    { name: "Medium", value: dist.medium, color: T.amber },
    { name: "High", value: dist.high, color: T.red },
    { name: "Critical", value: dist.critical, color: "#ff2222" },
  ];

  const heatmapMax = Math.max(...lobData.conversationRiskHeatmap.flatMap((r) => r.hours));
  const timeLabels = ["8AM", "10", "12", "2PM", "4", "6", "8", "10PM"];

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Customer Risk Distribution — Pie Chart */}
        <Card lane="conversation">
          <SectionHeader icon={Users} color={T.cyan} title="Customer Risk Distribution" badge="CONVERSATION-DERIVED" />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...croRechartsTooltipProps(T)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>LOB Risk Score</span>
                <div style={{ fontSize: 32, fontWeight: 800, color: lobData.riskScore >= 70 ? T.green : lobData.riskScore >= 50 ? T.amber : T.red, fontFamily: "var(--mono)" }}>
                  {lobData.riskScore}<span style={{ fontSize: 14, color: T.textSec }}>/100</span>
                </div>
              </div>
              {pieData.map((band, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: band.color }} />
                  <span style={{ fontSize: 12, color: T.textSec, flex: 1 }}>{band.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "var(--mono)" }}>{band.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Conversation Risk Heatmap */}
        <Card lane="conversation">
          <SectionHeader icon={TrendingUp} color={T.amber} title="Conversation Risk Heatmap" sub="Risk signal density by day & hour" />
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 36, marginBottom: 4 }}>
              {timeLabels.map((t) => (
                <span key={t} style={{ flex: 1, fontSize: 9, color: T.textSec, textAlign: "center" }}>{t}</span>
              ))}
            </div>
            {lobData.conversationRiskHeatmap.map((row, ri) => (
              <div key={ri} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ width: 30, fontSize: 11, color: T.textSec, fontWeight: 600 }}>{row.day}</span>
                {row.hours.map((intensity, hi) => {
                  const ratio = intensity / heatmapMax;
                  const bg =
                    ratio >= 0.8 ? T.red : ratio >= 0.5 ? T.amber : T.green;
                  return (
                    <div
                      key={hi}
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 4,
                        background: `${bg}${ratio >= 0.8 ? "50" : ratio >= 0.5 ? "40" : "25"}`,
                        border: `1px solid ${bg}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{intensity}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "flex-end", marginTop: 8 }}>
            {[
              ["Low", T.green],
              ["Medium", T.amber],
              ["High", T.red],
            ].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: `${color}40`, border: `1px solid ${color}50` }} />
                <span style={{ fontSize: 10, color: T.textSec }}>{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Risk Pressure Insights */}
      <Card lane="conversation">
        <SectionHeader icon={Bot} color={T.amber} title="AI Risk Pressure Insights" badge="CONVERSATION-DERIVED" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {lobData.pressureInsights.map((insight, i) => (
            <div
              key={i}
              style={{
                background: `${T.amber}10`,
                border: `1px solid ${T.amber}30`,
                borderLeft: `3px solid ${T.amber}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Bot size={12} color={T.amber} />
                <span style={{ fontSize: 10, fontWeight: 700, color: T.amber, textTransform: "uppercase" }}>Risk Signal #{i + 1}</span>
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.65 }}>{insight}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 3 — Financial Crime & AML
   ═══════════════════════════════════════ */

export function CROScreen3FinancialCrime() {
  const T = useDashboardTheme();
  const fc = CRO_FINANCIAL_CRIME_SIGNALS;

  const fraudBarData = fc.fraudPatternClusters.map((c) => ({
    name: c.category,
    count: c.count,
    fill: c.severity === "critical" ? T.red : T.amber,
  }));

  const amlBarData = fc.amlConversationSignals.map((s) => ({
    name: s.signal.length > 25 ? s.signal.slice(0, 25) + "…" : s.signal,
    fullName: s.signal,
    count: s.count,
    fill: s.severity === "critical" ? T.red : s.severity === "high" ? T.amber : T.gold,
  }));

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      {/* SAR Pipeline — Visual Flow */}
      <Card lane="recorded">
        <SectionHeader icon={FileWarning} color={T.red} title="SAR Pipeline" badge={`TOTAL VALUE: ${fc.sarPipeline.totalValue}`} sub="Suspicious Activity Report lifecycle" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Detected", count: fc.sarPipeline.detected, color: T.red },
            { label: "Under Review", count: fc.sarPipeline.underReview, color: T.amber },
            { label: "Filed", count: fc.sarPipeline.filed, color: T.cyan },
            { label: "Acknowledged", count: fc.sarPipeline.acknowledged, color: T.green },
          ].map((stage, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div
                style={{
                  background: `${stage.color}15`,
                  border: `1px solid ${stage.color}40`,
                  borderRadius: 12,
                  padding: "18px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 800, color: stage.color, fontFamily: "var(--mono)", lineHeight: 1 }}>{stage.count}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 8 }}>{stage.label}</div>
              </div>
              {i < 3 && (
                <div style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                  <ArrowRight size={16} color={T.textSec} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Fraud Clusters Bar Chart + AML Signals Bar Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card lane="recorded">
          <SectionHeader icon={Shield} color={T.red} title="Fraud Pattern Clusters" sub="Active fraud categories by volume" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fraudBarData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.text, fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip {...croRechartsTooltipProps(T)} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                {fraudBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {fc.fraudPatternClusters.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <SevBadge severity={c.severity} />
                <span style={{ fontSize: 10, color: T.red, fontWeight: 600 }}>+{c.trend}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card lane="conversation">
          <SectionHeader icon={MessageCircle} color={T.purple} title="AML Conversation Signals" badge="NLP-DETECTED" sub="Risk phrases from customer calls" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={amlBarData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.text, fontSize: 10 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip
                {...croRechartsTooltipProps(T)}
                formatter={(value, _name, item) => {
                  const full = (item?.payload as { fullName?: string } | undefined)?.fullName;
                  return [Number(value ?? 0), full ?? String(_name)];
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                {amlBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Agent AML Compliance */}
      <Card lane="recorded">
        <SectionHeader
          icon={Lock}
          color={T.cyan}
          title="Agent AML Compliance"
          badge={`${fc.agentAmlCompliance.agentsBelowThreshold} AGENTS BELOW THRESHOLD`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "KYC Script Adherence", ...fc.agentAmlCompliance.kycScriptAdherence },
            { label: "ID Verification", ...fc.agentAmlCompliance.idVerification },
            { label: "PEP Check Completion", ...fc.agentAmlCompliance.pepCheckCompletion },
            { label: "Source of Funds Asked", ...fc.agentAmlCompliance.sourceOfFundsAsked },
          ].map((metric, i) => {
            const col = metric.status === "red" ? T.red : metric.status === "amber" ? T.amber : T.green;
            return (
              <div key={i} style={{ background: `${col}10`, border: `1px solid ${col}30`, borderRadius: 12, padding: "16px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>{metric.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: col, fontFamily: "var(--mono)", marginBottom: 8 }}>{metric.value}%</div>
                <div style={{ height: 8, borderRadius: 4, background: `${T.borderLight}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${metric.value}%`, background: col, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 10, color: T.textSec, marginTop: 6 }}>Target: {metric.target}%</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Risk Spikes — horizontal scroll */}
      <Card lane="conversation">
        <SectionHeader icon={AlertTriangle} color={T.red} title="AI Financial Crime Risk Spikes" sub="Before → After metrics with AI-proposed actions" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {fc.riskSpikes.map((spike, i) => {
            const col = spike.severity === "critical" ? T.red : T.amber;
            return (
              <div key={i} style={{ background: `${col}12`, border: `1px solid ${col}35`, borderRadius: 12, padding: "16px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{spike.metric}</span>
                  <SevBadge severity={spike.severity} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: T.textSec, fontFamily: "var(--mono)" }}>{spike.before}</span>
                  <ArrowRight size={14} color={T.textSec} />
                  <span style={{ fontSize: 20, fontWeight: 800, color: col, fontFamily: "var(--mono)" }}>{spike.after}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: col, background: `${col}20`, padding: "2px 6px", borderRadius: 4 }}>{spike.change}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, borderTop: `1px solid ${col}25`, paddingTop: 8 }}>
                  <Bot size={11} color={col} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  {spike.action}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 4 — Consumer Duty & Compliance
   ═══════════════════════════════════════ */

export function CROScreen4ConsumerDuty() {
  const T = useDashboardTheme();
  const cd = CRO_CONSUMER_DUTY;

  const radialData = cd.pillars.map((p) => ({
    name: p.name,
    value: p.score,
    fill: p.status === "red" ? T.red : p.status === "amber" ? T.amber : T.green,
  }));

  const vulnBarData = cd.vulnerableCustomerDetection.signals.map((s) => ({
    name: s.type,
    count: s.count,
    fill: T.cyan,
  }));

  const misSellingData = cd.misSellingRisk.map((r) => ({
    name: r.category,
    count: r.count,
    fill: r.severity === "critical" ? T.red : r.severity === "high" ? T.amber : T.gold,
  }));

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      {/* Consumer Duty Scorecard — FCA 4 Pillars */}
      <Card lane="recorded">
        <SectionHeader icon={Shield} color={T.purple} title="Consumer Duty Scorecard" badge="FCA 4 PILLARS" sub="UK regulation — becoming global standard" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {cd.pillars.map((pillar, i) => {
            const col = pillar.status === "red" ? T.red : pillar.status === "amber" ? T.amber : T.green;
            return (
              <div key={i} style={{ background: `${col}10`, border: `1px solid ${col}30`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>{pillar.name}</div>
                <ResponsiveContainer width="100%" height={90}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: pillar.score, fill: col }]} startAngle={180} endAngle={0} barSize={10}>
                    <RadialBar background={{ fill: `${T.borderLight}` }} dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 28, fontWeight: 800, color: col, fontFamily: "var(--mono)", marginTop: -10 }}>{pillar.score}%</div>
                <div style={{ marginTop: 8, textAlign: "left" }}>
                  {pillar.issues.map((issue, j) => (
                    <div key={j} style={{ fontSize: 10, color: T.textSec, lineHeight: 1.4, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${col}50` }}>{issue}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        {/* Vulnerable Customer Detection */}
        <Card lane="conversation">
          <SectionHeader icon={Users} color={T.cyan} title="Vulnerable Customer Detection" sub="AI-detected from conversation signals" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <div style={{ background: `${T.cyan}15`, border: `1px solid ${T.cyan}30`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.cyan, fontFamily: "var(--mono)" }}>{cd.vulnerableCustomerDetection.totalFlagged}</div>
              <div style={{ fontSize: 10, color: T.textSec, textTransform: "uppercase", marginTop: 2 }}>Flagged</div>
            </div>
            <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}30`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.green, fontFamily: "var(--mono)" }}>{cd.vulnerableCustomerDetection.confirmed}</div>
              <div style={{ fontSize: 10, color: T.textSec, textTransform: "uppercase", marginTop: 2 }}>Confirmed ({cd.vulnerableCustomerDetection.confirmationRate}%)</div>
            </div>
            <div style={{ background: `${T.amber}15`, border: `1px solid ${T.amber}30`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.amber, fontFamily: "var(--mono)" }}>{cd.vulnerableCustomerDetection.falsePositive}</div>
              <div style={{ fontSize: 10, color: T.textSec, textTransform: "uppercase", marginTop: 2 }}>False Positive</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={vulnBarData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.text, fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip {...croRechartsTooltipProps(T)} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14} fill={T.cyan} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginTop: 8 }}>{cd.vulnerableCustomerDetection.trend}</div>
        </Card>

        {/* Mis-Selling Risk */}
        <Card lane="conversation">
          <SectionHeader icon={AlertTriangle} color={T.red} title="Mis-Selling Risk Indicators" sub="Agent conduct violations detected from calls" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={misSellingData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textSec, fontSize: 10 }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.text, fontSize: 10 }} axisLine={false} tickLine={false} width={160} />
              <Tooltip {...croRechartsTooltipProps(T)} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {misSellingData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "10px 12px", background: `${T.red}15`, border: `1px solid ${T.red}30`, borderRadius: 8 }}>
            <TrendingUp size={13} color={T.red} />
            <span style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>Trend: ↑ 18% vs last month across all categories</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 4 — Cross-Jurisdiction + SMCR
   ═══════════════════════════════════════ */

export function CROScreen4Jurisdiction() {
  const T = useDashboardTheme();
  const cj = CRO_CROSS_JURISDICTION;
  const smcr = CRO_SMCR_ACCOUNTABILITY;

  const catKeys: (keyof (typeof cj.matrix)[0])[] = ["consumerDuty", "aml", "dataPrivacy", "conduct", "outsourcing"];

  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      {/* Cross-Jurisdiction Compliance Heatmap */}
      <Card lane="recorded">
        <SectionHeader icon={Globe} color={T.blue} title="Cross-Jurisdiction Compliance" sub="Highest jurisdiction controls apply everywhere" />
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 6 }}>
          <thead>
            <tr>
              <th style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textAlign: "left", padding: "8px 12px" }}></th>
              {cj.categories.map((cat) => (
                <th key={cat} style={{ fontSize: 10, fontWeight: 700, color: T.textSec, textAlign: "center", padding: "8px 10px", textTransform: "uppercase", letterSpacing: 0.3 }}>
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cj.matrix.map((row) => (
              <tr key={row.jurisdiction}>
                <td style={{ fontSize: 13, fontWeight: 700, color: T.text, padding: "8px 12px" }}>{row.jurisdiction}</td>
                {catKeys.map((key) => {
                  const met = row[key] === "met";
                  const bg = met ? `${T.green}20` : `${T.red}20`;
                  const fg = met ? T.green : T.red;
                  const border = met ? `${T.green}40` : `${T.red}40`;
                  return (
                    <td key={key} style={{ textAlign: "center", padding: 3 }}>
                      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 8px", fontSize: 16, fontWeight: 800, color: fg }}>
                        {met ? "✓ Met" : "✗ Gap"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* SMCR Accountability Map */}
      <Card lane="recorded">
        <SectionHeader icon={Lock} color={T.purple} title="SMCR Accountability Map" badge="SENIOR MANAGEMENT CERTIFICATION REGIME" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {smcr.map((person, i) => {
            const col = person.riskLevel === "high" ? T.red : person.riskLevel === "medium" ? T.amber : T.green;
            return (
              <div key={i} style={{ background: `${col}10`, border: `1px solid ${col}35`, borderRadius: 12, padding: "16px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{person.role}</span>
                  <SevBadge severity={person.riskLevel === "high" ? "high" : person.riskLevel === "medium" ? "medium" : "low"} />
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginBottom: 10 }}>{person.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: col, fontFamily: "var(--mono)" }}>{person.openFindings}</span>
                  <span style={{ fontSize: 10, color: T.textSec }}>findings</span>
                </div>
                {person.areas.length > 0 ? (
                  person.areas.map((area, j) => (
                    <div key={j} style={{ fontSize: 10, color: T.text, lineHeight: 1.45, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${col}60` }}>{area}</div>
                  ))
                ) : (
                  <div style={{ fontSize: 10, color: T.green, fontWeight: 600 }}>✓ No open findings</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 5 — CRO Investigations & Actions
   ═══════════════════════════════════════ */

export function CROScreen5Investigations() {
  const T = useDashboardTheme();
  const [expandedCase, setExpandedCase] = useState<string | null>(CRO_INVESTIGATIONS[0]?.id ?? null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatIdx, setChatIdx] = useState<number | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!chatOpen || chatIdx === null) return;
    setChatLoading(true);
    const id = window.setTimeout(() => setChatLoading(false), 550);
    return () => window.clearTimeout(id);
  }, [chatOpen, chatIdx]);

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <CroLaneLegend />
      <SectionHeader icon={Eye} color={T.red} title="Active Investigations" badge={`${CRO_INVESTIGATIONS.length} CASES`} sub="Conversation-evidence-driven risk investigations" />

      {CRO_INVESTIGATIONS.map((inv) => {
        const col = inv.severity === "critical" ? T.red : T.amber;
        const isExpanded = expandedCase === inv.id;

        return (
          <Card key={inv.id} style={{ borderLeft: `4px solid ${col}`, padding: 0, overflow: "hidden" }}>
            {/* Header — always visible */}
            <div
              style={{ padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
              onClick={() => setExpandedCase(isExpanded ? null : inv.id)}
            >
              <SevBadge severity={inv.severity} />
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec, fontFamily: "var(--mono)" }}>{inv.id}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.text, flex: 1 }}>{inv.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: T.textSec }}>
                  <Eye size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  {inv.evidence.conversations} conversations
                </span>
                <span style={{ fontSize: 11, color: col, fontWeight: 700 }}>{inv.impact.exposure}</span>
                {isExpanded ? <ChevronDown size={16} color={T.textSec} /> : <ChevronRight size={16} color={T.textSec} />}
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: "0 22px 22px", borderTop: `1px solid ${T.borderLight}` }}>
                {/* What */}
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>What Happened</div>
                  <div style={{ fontSize: 13, color: T.text, lineHeight: 1.65, background: `${col}08`, border: `1px solid ${col}25`, borderRadius: 10, padding: "12px 16px" }}>
                    {inv.what}
                  </div>
                </div>

                {/* Where */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Where</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {([["Channel", inv.where.channel], ["Region", inv.where.region], ["Agent", inv.where.agent]] as const).map(([l, v], j) => (
                      <div key={j} style={{ background: T.elevated, border: `1px solid ${T.borderLight}`, borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 10, color: T.textSec, textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Root Cause */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1 }}>Root Cause</span>
                    <span style={{ background: `${T.amber}20`, color: T.amber, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>AI-DERIVED</span>
                  </div>
                  {inv.why.map((w, j) => (
                    <div key={j} style={{ background: `${T.amber}08`, border: `1px solid ${T.amber}20`, borderRadius: 8, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${T.amber}25`, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                        {j + 1}
                      </span>
                      <span style={{ fontSize: 12, color: T.text, lineHeight: 1.55 }}>{w}</span>
                    </div>
                  ))}
                </div>

                {/* Impact + Evidence row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Impact</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {([
                        ["Exposure", inv.impact.exposure, T.red],
                        ["Customers", String(inv.impact.customers), T.amber],
                        ["SMCR Owner", inv.impact.smcrOwner, T.purple],
                        ["Reg Risk", inv.impact.regulatoryRisk, T.red],
                      ] as const).map(([l, v, c], j) => (
                        <div key={j} style={{ background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 9, color: T.textSec, textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 13, color: T.text, fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Conversation Evidence</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {([
                        [String(inv.evidence.conversations), "Conversations", T.cyan, Eye],
                        [String(inv.evidence.flaggedPhrases), "Flagged Phrases", T.amber, MessageCircle],
                        [`${inv.evidence.riskScore}/100`, "Risk Score", T.red, Target],
                      ] as const).map(([v, l, c, Icon], j) => (
                        <div key={j} style={{ background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                          <Icon size={14} color={c} style={{ margin: "0 auto 4px" }} />
                          <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: "var(--mono)" }}>{v}</div>
                          <div style={{ fontSize: 9, color: T.textSec }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 1 }}>Actions</span>
                    <span style={{ background: `${T.cyan}20`, color: T.cyan, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>AI-PROPOSED</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {inv.actions.map((action, j) => {
                      const ac = action.type === "immediate" ? T.red : action.type === "escalate" ? T.amber : action.type === "remediation" ? T.cyan : T.purple;
                      const typeIcon =
                        action.type === "immediate" ? <AlertTriangle size={13} color={ac} /> : action.type === "escalate" ? <TrendingUp size={13} color={ac} /> : action.type === "remediation" ? <CheckCircle size={13} color={ac} /> : <Lock size={13} color={ac} />;
                      return (
                        <div key={j} style={{ background: `${ac}08`, border: `1px solid ${ac}25`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ac}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {typeIcon}
                          </div>
                          <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{action.text}</span>
                          <span style={{ background: `${ac}20`, color: ac, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, textTransform: "uppercase" }}>{action.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* AI Quick Prompts */}
      <Card lane="conversation">
        <SectionHeader icon={Bot} color={T.cyan} title="AI Assistant — CRO Quick Prompts" sub="Click to query the AI about your risk posture" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {CRO_AI_CHAT_SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              style={{
                background: T.elevated,
                border: `1px solid ${T.borderLight}`,
                borderRadius: 10,
                padding: "12px 16px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: T.text,
                fontSize: 12,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onClick={() => {
                setChatIdx(i);
                setChatOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.cyan;
                e.currentTarget.style.background = `${T.cyan}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.borderLight;
                e.currentTarget.style.background = T.elevated;
              }}
            >
              <MessageCircle size={13} color={T.cyan} style={{ flexShrink: 0 }} />
              {suggestion}
            </button>
          ))}
        </div>
      </Card>

      <Dialog
        open={chatOpen}
        onOpenChange={(open) => {
          setChatOpen(open);
          if (!open) setChatIdx(null);
        }}
      >
        <DialogContent
          className="max-h-[88vh] max-w-xl overflow-y-auto sm:max-w-xl"
          style={{ borderColor: T.borderLight, background: T.elevated, color: T.text }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Bot size={18} color={T.cyan} />
              CRO assistant
            </DialogTitle>
            <DialogDescription style={{ color: T.textMut }}>Response for the selected prompt.</DialogDescription>
          </DialogHeader>
          {chatIdx !== null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${T.borderLight}`,
                  background: T.surface,
                  padding: "12px 14px",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>You</div>
                <div style={{ fontSize: 14, color: T.textSec, lineHeight: 1.55 }}>{CRO_AI_CHAT_SUGGESTIONS[chatIdx]}</div>
              </div>
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${T.cyan}45`,
                  background: `${T.cyan}0d`,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Bot size={14} color={T.cyan} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.cyan, textTransform: "uppercase", letterSpacing: 0.6 }}>Assistant</span>
                </div>
                {chatLoading ? (
                  <div className="animate-pulse text-sm" style={{ color: T.textMut }}>
                    Thinking…
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.65, margin: 0 }}>{CRO_AI_CHAT_RESPONSES[chatIdx]}</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
