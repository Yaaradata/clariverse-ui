"use client";

import {
  AlertTriangle,
  BarChart3,
  Globe,
  Heart,
  Layers,
  MessageCircle,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
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
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
} from "recharts";
import { useDashboardTheme, type DashboardThemeTokens } from "./DashboardThemeContext";
import {
  RETAIL_VALUABLE_CUSTOMER_SEGMENTS,
  RETAIL_HV_PAIN_POINTS,
  RETAIL_CHANNEL_SENTIMENT,
  RETAIL_INTENT_SLA,
  RETAIL_BOTTLENECKS,
  RETAIL_INTENT_HEATMAP,
  CONTACT_AGENT_SEGMENTS,
  CONTACT_CENTRE_HEALTH,
  CONTACT_PROMISE_STAGES,
  CONTACT_INTENT_SPIKES,
  CONTACT_CLUSTER_SUMMARY,
} from "@/lib/role-based-dashboard/retailContactData";

/* ── shared helpers ── */

function tooltipProps(T: DashboardThemeTokens) {
  return {
    contentStyle: { background: T.elevated, border: `1px solid ${T.borderLight}`, borderRadius: 8, fontSize: 11, color: T.text },
    labelStyle: { color: T.text, fontWeight: 600 },
    itemStyle: { color: T.text },
  };
}

function SectionHeader({ icon: Icon, color, title, sub }: { icon: React.ComponentType<{ size: number; color: string }>; color: string; title: string; sub?: string }) {
  const T = useDashboardTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const T = useDashboardTheme();
  return (
    <div style={{ background: T.elevated, border: `1px solid ${T.borderLight}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SevDot({ severity }: { severity: string }) {
  const T = useDashboardTheme();
  const c = severity === "critical" ? T.red : severity === "high" ? T.amber : severity === "medium" ? T.gold : T.green;
  return <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />;
}

// ═══════════════════════════
// HEAD OF RETAIL BANKING EXTENSIONS
// ═══════════════════════════

/** Screen 2 Addon: Valuable Customer Segmentation + Pain Points */
export function RetailScreen2Addon() {
  const T = useDashboardTheme();
  const pieColors = [T.cyan, T.gold, T.purple];

  const pieData = RETAIL_VALUABLE_CUSTOMER_SEGMENTS.map((s) => ({
    name: s.segment,
    value: s.calls,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader icon={Target} color={T.cyan} title="Valuable Customer Segmentation" sub="Who is calling and why — high vs mid vs low value" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip {...tooltipProps(T)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RETAIL_VALUABLE_CUSTOMER_SEGMENTS.map((s, i) => (
              <div key={s.segment} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: pieColors[i] }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{s.segment}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
                  <span style={{ color: T.textSec }}>Calls: <strong style={{ color: T.text }}>{s.calls}</strong></span>
                  <span style={{ color: T.textSec }}>Top: <strong style={{ color: T.text }}>{s.topIntent}</strong></span>
                  <span style={{ color: T.textSec }}>Churn Risk: <strong style={{ color: s.churnRisk > 10 ? T.red : T.amber }}>{s.churnRisk}%</strong></span>
                  <span style={{ color: T.textSec }}>Sentiment: <strong style={{ color: s.sentiment < 0.6 ? T.red : T.green }}>{s.sentiment}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={AlertTriangle} color={T.red} title="High-Value Customer Pain Points" sub="Biggest pain points driving churn risk — sorted by impact" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RETAIL_HV_PAIN_POINTS.map((p) => (
            <div key={p.intent} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderLeft: `3px solid ${p.severity === "critical" ? T.red : p.severity === "high" ? T.amber : T.gold}`, borderRadius: 8, padding: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <SevDot severity={p.severity} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{p.intent}</div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{p.calls} calls · Avg resolution {p.avgResolution}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: p.pct > 25 ? T.red : T.amber }}>{p.pct}%</div>
                <div style={{ fontSize: 10, color: T.textMut }}>of HV calls</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 70 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.slaHit < 70 ? T.red : p.slaHit < 80 ? T.amber : T.green }}>{p.slaHit}%</div>
                <div style={{ fontSize: 10, color: T.textMut }}>SLA hit</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** Screen 3 Addon: Channel Sentiment + Intent SLA */
export function RetailScreen3Addon() {
  const T = useDashboardTheme();

  const slaBarData = RETAIL_INTENT_SLA.map((s) => ({
    intent: s.intent.length > 14 ? s.intent.slice(0, 14) + "…" : s.intent,
    closed: s.closed,
    notClosed: s.notClosed,
    slaTarget: s.slaTarget,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader icon={Globe} color={T.purple} title="Cross-Channel Sentiment" sub="Brand & reputation risk by channel — sentiment trends" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {RETAIL_CHANNEL_SENTIMENT.map((ch) => (
            <div key={ch.channel} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{ch.channel}</span>
                <span style={{ fontSize: 11, color: T.textMut }}>{ch.volume} contacts</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: ch.sentiment < 0.5 ? T.red : ch.sentiment < 0.65 ? T.amber : T.green }}>{ch.sentiment}</span>
                <span style={{ fontSize: 11, color: ch.trend < 0 ? T.red : T.green, fontWeight: 600 }}>{ch.trend > 0 ? "+" : ""}{ch.trend}</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.4 }}>{ch.topConcern}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader icon={BarChart3} color={T.gold} title="Intent-Based SLA Tracking" sub="Closed vs not-closed per intent — 4 key intents" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={slaBarData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="intent" tick={{ fill: T.textSec, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.textMut, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipProps(T)} />
            <Bar dataKey="closed" stackId="a" fill={T.green} name="Closed" radius={[0, 0, 0, 0]} />
            <Bar dataKey="notClosed" stackId="a" fill={T.red} name="Not Closed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader icon={Zap} color={T.red} title="Process Bottlenecks" sub="Where work gets stuck — impact on customer experience" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RETAIL_BOTTLENECKS.map((b) => (
            <div key={b.process} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderLeft: `3px solid ${b.severity === "critical" ? T.red : b.severity === "high" ? T.amber : T.gold}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <SevDot severity={b.severity} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{b.process}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.red }}>{b.impacted} impacted</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T.textSec }}>
                <span>Avg delay: <strong style={{ color: T.amber }}>{b.avgDelay}</strong></span>
                <span>Root cause: <strong style={{ color: T.text }}>{b.rootCause}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** Screen 4 Addon: Intent Heat Map (moved here from contact centre per boss feedback) */
export function RetailScreen4IntentHeatmap() {
  const T = useDashboardTheme();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const keys: (keyof typeof RETAIL_INTENT_HEATMAP[0] & string)[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  function heatColor(val: number): string {
    if (val >= 35) return T.red;
    if (val >= 20) return T.amber;
    if (val >= 10) return T.gold;
    return T.green;
  }

  return (
    <Card>
      <SectionHeader icon={Layers} color={T.amber} title="Intent Heat Map" sub="Intent volume by day — spot emerging patterns and spikes" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: T.textMut, fontWeight: 600, padding: "6px 8px" }}>Intent</th>
              {days.map((d) => <th key={d} style={{ color: T.textMut, fontWeight: 600, padding: "6px 8px", textAlign: "center" }}>{d}</th>)}
              <th style={{ color: T.textMut, fontWeight: 600, padding: "6px 8px", textAlign: "center" }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {RETAIL_INTENT_HEATMAP.map((row) => (
              <tr key={row.intent}>
                <td style={{ color: T.text, fontWeight: 500, padding: "6px 8px", whiteSpace: "nowrap" }}>{row.intent}</td>
                {keys.map((k) => {
                  const val = row[k] as number;
                  const c = heatColor(val);
                  return (
                    <td key={k} style={{ textAlign: "center", padding: "6px 8px" }}>
                      <div style={{ background: `${c}25`, color: c, fontWeight: 700, borderRadius: 6, padding: "4px 0", minWidth: 32, display: "inline-block" }}>{val}</div>
                    </td>
                  );
                })}
                <td style={{ textAlign: "center", padding: "6px 8px" }}>
                  <span style={{ color: row.trend === "spike" ? T.red : row.trend === "rising" ? T.amber : T.green, fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>
                    {row.trend === "spike" ? "⚠ SPIKE" : row.trend === "rising" ? "↑ Rising" : "— Stable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ═══════════════════════════
// HEAD OF CONTACT CENTRE EXTENSIONS
// ═══════════════════════════

/** Screen 2 Addon: Outsourced vs Insourced Agent Health */
export function ContactScreen2AgentHealth() {
  const T = useDashboardTheme();

  const barData = CONTACT_AGENT_SEGMENTS.map((s) => ({
    type: s.type,
    FCR: s.fcr,
    CSAT: s.csat,
    Quality: s.quality,
    Tone: s.tone,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader icon={Users} color={T.cyan} title="Agent Health — In-house vs Outsourced" sub="Performance comparison across agent segments" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="type" tick={{ fill: T.textSec, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.textMut, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip {...tooltipProps(T)} />
            <Bar dataKey="FCR" fill={T.cyan} name="FCR %" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CSAT" fill={T.green} name="CSAT %" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Quality" fill={T.gold} name="Quality %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
          {CONTACT_AGENT_SEGMENTS.map((s) => (
            <div key={s.type} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8 }}>{s.type}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
                <span style={{ color: T.textSec }}>Agents: <strong style={{ color: T.text }}>{s.agents}</strong></span>
                <span style={{ color: T.textSec }}>AHT: <strong style={{ color: s.aht > 8 ? T.red : T.green }}>{s.aht}m</strong></span>
                <span style={{ color: T.textSec }}>FCR: <strong style={{ color: s.fcr < 70 ? T.red : T.green }}>{s.fcr}%</strong></span>
                <span style={{ color: T.textSec }}>Tone: <strong style={{ color: s.tone < 85 ? T.amber : T.green }}>{s.tone}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Globe} color={T.purple} title="Cross-Centre Health Monitor" sub="All centres at a glance — staffing, FCR, AHT, risk level" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CONTACT_CENTRE_HEALTH.map((c) => {
            const riskColor = c.risk === "high" ? T.red : c.risk === "medium" ? T.amber : T.green;
            return (
              <div key={c.centre} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderLeft: `3px solid ${riskColor}`, borderRadius: 8, padding: 12, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.centre}</div>
                  <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>Staffing {c.staffing}% · AHT {c.aht}m</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 60 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c.health >= 85 ? T.green : c.health >= 70 ? T.amber : T.red }}>{c.health}%</div>
                  <div style={{ fontSize: 10, color: T.textMut }}>Health</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 60 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.fcr >= 80 ? T.green : c.fcr >= 70 ? T.amber : T.red }}>{c.fcr}%</div>
                  <div style={{ fontSize: 10, color: T.textMut }}>FCR</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 6, letterSpacing: 0.8, textTransform: "uppercase", background: `${riskColor}20`, color: riskColor }}>{c.risk}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/** Screen 3 Addon: Promise Adherence + Developing Issues */
export function ContactScreen3PromiseAdherence() {
  const T = useDashboardTheme();

  const radialData = CONTACT_PROMISE_STAGES.map((s) => ({
    name: s.stage,
    score: s.score,
    fill: s.score >= s.target ? T.green : s.score >= s.target - 10 ? T.amber : T.red,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader icon={Shield} color={T.gold} title="Promise Adherence" sub="Stage-by-stage — Receiving → Authenticating → Resolving → Following Up" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={120} data={radialData} startAngle={180} endAngle={0}>
                <RadialBar dataKey="score" cornerRadius={6} />
                <Tooltip {...tooltipProps(T)} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONTACT_PROMISE_STAGES.map((s) => {
              const gap = s.target - s.score;
              const c = gap <= 0 ? T.green : gap <= 10 ? T.amber : T.red;
              return (
                <div key={s.stage} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{s.stage}</div>
                    <div style={{ fontSize: 10, color: T.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.detail}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: c }}>{s.score}%</span>
                    <span style={{ fontSize: 10, color: T.textMut, marginLeft: 4 }}>/ {s.target}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={TrendingUp} color={T.red} title="Developing Issues — Intent Spikes" sub="Active spikes with root cause context and cluster analysis" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CONTACT_INTENT_SPIKES.map((s) => {
            const c = s.severity === "critical" ? T.red : s.severity === "high" ? T.amber : T.gold;
            return (
              <div key={s.intent} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderLeft: `3px solid ${c}`, borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SevDot severity={s.severity} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.intent}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: c }}>{s.spike}×</span>
                    <span style={{ fontSize: 10, color: T.textMut }}>in {s.period}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginBottom: 4 }}><strong style={{ color: T.text }}>Root cause:</strong> {s.rootCause}</div>
                <div style={{ fontSize: 11, color: T.textSec }}><strong style={{ color: T.text }}>Cluster:</strong> {s.cluster}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/** Screen 4 Addon: Cluster Summary (moved here from retail per boss feedback) */
export function ContactScreen4ClusterSummary() {
  const T = useDashboardTheme();

  return (
    <Card>
      <SectionHeader icon={MessageCircle} color={T.purple} title="Cluster Summary" sub="Top complaint clusters — root cause analysis and recommended actions" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONTACT_CLUSTER_SUMMARY.map((c) => {
          const sentColor = c.sentiment < 0.3 ? T.red : c.sentiment < 0.5 ? T.amber : T.green;
          return (
            <div key={c.cluster} style={{ background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{c.cluster}</div>
                  <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>"{c.topPhrase}"</div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{c.size}</div>
                    <div style={{ fontSize: 9, color: T.textMut }}>mentions</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: sentColor }}>{c.sentiment}</div>
                    <div style={{ fontSize: 9, color: T.textMut }}>sentiment</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: Number(c.resolution.replace("%", "")) < 50 ? T.red : T.green }}>{c.resolution}</div>
                    <div style={{ fontSize: 9, color: T.textMut }}>resolved</div>
                  </div>
                </div>
              </div>
              <div style={{ background: `${T.cyan}10`, border: `1px solid ${T.cyan}25`, borderRadius: 6, padding: "8px 12px", fontSize: 11, color: T.textSec }}>
                <strong style={{ color: T.cyan }}>Action:</strong> {c.action}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
