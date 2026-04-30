"use client";

import { ArrowLeft, Bot, TrendingDown, TrendingUp, Minus, AlertCircle, Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useDashboardTheme } from "./DashboardThemeContext";
import {
  CUSTOMER_CARD_JOURNEY_DATA,
  CREDIT_CARD_CHANNELS,
  CREDIT_CARD_PROCESS_RESOLUTION,
  FRAUD_FULFILLMENT_DATA,
  MARKET_REPUTATION_DATA,
} from "@/lib/role-based-dashboard/creditCardsData";

type DrillProps = { onBack: () => void };

// ═════════════════════════════ PRIMITIVES ═════════════════════════════

function SectionCard({
  title,
  subtitle,
  children,
  accent,
  height,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: string;
  height?: number;
}) {
  const T = useDashboardTheme();
  return (
    <section
      style={{
        background: T.elevated,
        border: `1px solid ${T.borderLight}`,
        borderTop: accent ? `3px solid ${accent}` : undefined,
        borderRadius: 12,
        padding: 12,
        minHeight: height ?? 220,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 10.5, color: T.textSec, marginTop: 1 }}>{subtitle}</div> : null}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </section>
  );
}

function AIBlock({
  title,
  text,
  tone = "gold",
  height,
}: {
  title: string;
  text: string;
  tone?: "gold" | "cyan" | "red";
  height?: number;
}) {
  const T = useDashboardTheme();
  const color = tone === "cyan" ? T.cyan : tone === "red" ? T.red : T.gold;
  return (
    <div
      style={{
        background: `${color}10`,
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: "10px 12px",
        minHeight: height,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Sparkles size={12} color={color} />
        <span style={{ color, fontSize: 11.5, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function DrillHeader({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack: () => void;
}) {
  const T = useDashboardTheme();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
        gap: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, color: T.text }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.textSec, marginTop: 2 }}>{description}</div>
      </div>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "transparent",
          border: `1px solid ${T.borderLight}`,
          color: T.textSec,
          borderRadius: 8,
          padding: "7px 11px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={12} />
        Back
      </button>
    </div>
  );
}

const COMMON_TOOLTIP_STYLE = {
  background: "rgba(10,14,22,0.96)",
  borderRadius: 8,
  border: "1px solid rgba(148,163,184,0.35)",
  fontSize: 11,
  color: "#e2e8f0",
};

// ═════════════════════════════════════════════════════════════════════
// DRILL 1 — CUSTOMER CARD JOURNEY
// 7 components · 3-column grid · channel-integrated FCI across cardholder stages
// ═════════════════════════════════════════════════════════════════════

export function CustomerCardJourneyDrillDown({ onBack }: DrillProps) {
  const T = useDashboardTheme();
  const channelColors = [T.cyan, T.amber, T.green, T.purple, T.blue];

  return (
    <div>
      <DrillHeader
        title="Are cardholders satisfied with their journey?"
        description="FCI per channel across the cardholder lifecycle — Apply → Activate → First Spend → Statement → Redeem → Dispute → Renewal. The CX Promise listening lens."
        onBack={onBack}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* ══════ COL 1 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 1. FCI Rail by channel across cardholder stages */}
          <SectionCard
            title="Cardholder FCI Rail · by channel"
            subtitle="How each channel delivers the promise at every stage of the card life"
            accent={T.cyan}
            height={280}
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CUSTOMER_CARD_JOURNEY_DATA.rail} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                <XAxis dataKey="stage" tick={{ fill: T.textMut, fontSize: 9 }} angle={-12} textAnchor="end" height={40} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} domain={[40, 90]} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {CREDIT_CARD_CHANNELS.map((channel, idx) => (
                  <Line
                    key={channel}
                    type="monotone"
                    dataKey={channel}
                    stroke={channelColors[idx]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* 2. FCI Dimension radar */}
          <SectionCard
            title="CX Promise FCI Breakdown"
            subtitle="Ownership · Emotion · Quality · Effort · Retention — cross-channel average"
            height={260}
          >
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={CUSTOMER_CARD_JOURNEY_DATA.fciBreakdown} outerRadius={70}>
                <PolarGrid stroke={T.border} />
                <PolarAngleAxis dataKey="dim" tick={{ fill: T.textSec, fontSize: 9 }} />
                <PolarRadiusAxis domain={[40, 90]} tick={{ fill: T.textMut, fontSize: 9 }} />
                <Radar dataKey="score" stroke={T.cyan} fill={T.cyan} fillOpacity={0.35} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>
              Effort (60) is the lowest — cardholders are working too hard on redemption + disputes.
            </div>
          </SectionCard>
        </div>

        {/* ══════ COL 2 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 3. Decline & Dispute Friction */}
          <SectionCard
            title="Decline & Dispute Friction · by channel"
            subtitle="Card-decline anxiety vs chargeback friction — two biggest promise-breakers"
            accent={T.red}
            height={260}
          >
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={CUSTOMER_CARD_JOURNEY_DATA.declineDispute} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="channel" tick={{ fill: T.textMut, fontSize: 10 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="declineFriction" fill={T.amber} name="Decline friction" radius={[2, 2, 0, 0]} />
                <Bar dataKey="disputeFriction" fill={T.red} name="Dispute friction" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* 4. Rewards & billing drivers pie */}
          <SectionCard
            title="Reward & Billing Confusion Drivers"
            subtitle="Top detractor topics · share of voice of card-unhappiness"
            height={280}
          >
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={CUSTOMER_CARD_JOURNEY_DATA.billingDrivers}
                  dataKey="share"
                  nameKey="topic"
                  innerRadius={30}
                  outerRadius={62}
                  paddingAngle={2}
                >
                  {CUSTOMER_CARD_JOURNEY_DATA.billingDrivers.map((_, idx) => (
                    <Cell key={idx} fill={[T.red, T.amber, T.purple, T.cyan, T.blue][idx]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, color: T.textMut, lineHeight: 1.5, marginTop: 4 }}>
              {CUSTOMER_CARD_JOURNEY_DATA.billingDrivers.map((d) => (
                <div key={d.topic} style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 2 }}>
                  <span style={{ color: T.textSec }}>{d.topic}</span>
                  <span style={{ color: T.text, fontFamily: "var(--mono)" }}>{d.share}% · {d.exampleChannel}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ══════ COL 3 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 5. HV vs LV cardholder happiness by product */}
          <SectionCard
            title="Cardholder Happiness · HV vs LV · by product"
            subtitle="High-value cardholders are most at risk on premium travel"
            accent={T.purple}
            height={240}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={CUSTOMER_CARD_JOURNEY_DATA.hvVsLv} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="product" tick={{ fill: T.textMut, fontSize: 9 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} domain={[50, 90]} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="hv" fill={T.amber} name="HV" radius={[2, 2, 0, 0]} />
                <Bar dataKey="lv" fill={T.cyan} name="LV" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* 6. Promise breach timeline */}
          <SectionCard
            title="Promise Breach Moments · weekly"
            subtitle="Events that correlate with promise score drops"
            accent={T.red}
            height={200}
          >
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={CUSTOMER_CARD_JOURNEY_DATA.promiseTimeline} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="week" tick={{ fill: T.textMut, fontSize: 10 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} domain={[68, 76]} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="score" stroke={T.red} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 2, lineHeight: 1.4 }}>
              {CUSTOMER_CARD_JOURNEY_DATA.promiseTimeline.map((e) => (
                <div key={e.week}>{e.week} · {e.event}</div>
              ))}
            </div>
          </SectionCard>

          {/* 7. AI Root Cause + Next-Best-Actions + Prediction */}
          <AIBlock title="✨ AI Why — Root Cause" text={CUSTOMER_CARD_JOURNEY_DATA.aiInsights.rootCause} tone="gold" />
          <AIBlock title="✨ AI Next Best Actions" text={CUSTOMER_CARD_JOURNEY_DATA.aiInsights.nextBestActions} tone="cyan" />
          <AIBlock title="✨ AI Prediction (7-day)" text={CUSTOMER_CARD_JOURNEY_DATA.aiInsights.predicted} tone="red" />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DRILL 2 — MARKET REPUTATION
// External-facing: brands, review sites, social virality, influencers,
// ops linkage. "Public perception about my company" lens from Ranjith.
// ═════════════════════════════════════════════════════════════════════

export function MarketReputationDrillDown({ onBack }: DrillProps) {
  const T = useDashboardTheme();

  const rankingArrow = (change: string) =>
    change === "up" ? (
      <TrendingUp size={11} color={T.green} />
    ) : change === "down" ? (
      <TrendingDown size={11} color={T.red} />
    ) : (
      <Minus size={11} color={T.textMut} />
    );

  return (
    <div>
      <DrillHeader
        title="What is the market saying about us?"
        description="External perception of the card brand — review sites, social virality, influencer stance, and where the market view mismatches internal ops."
        onBack={onBack}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* ══════ COL 1 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 1. Brand scoreboard — External vs Internal per card product */}
          <SectionCard
            title="Card Brand Scoreboard · External vs Internal"
            subtitle="Per-product perception gap · larger = more narrative work needed"
            accent={T.purple}
            height={300}
          >
            {MARKET_REPUTATION_DATA.brandScoreboard.map((row) => {
              const tone = row.status === "red" ? T.red : row.status === "amber" ? T.amber : T.green;
              return (
                <div
                  key={row.brand}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderLeft: `3px solid ${tone}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 700 }}>{row.brand}</span>
                    <span style={{ fontSize: 10, color: tone, fontFamily: "var(--mono)" }}>Δ {row.delta}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: T.textMut }}>
                      External <span style={{ color: tone, fontFamily: "var(--mono)", fontWeight: 700 }}>{row.external}</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.textMut }}>
                      Internal <span style={{ color: T.text, fontFamily: "var(--mono)", fontWeight: 700 }}>{row.internal}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.textSec, marginTop: 4, lineHeight: 1.4 }}>{row.note}</div>
                </div>
              );
            })}
          </SectionCard>

          {/* 2. Review site ranking panel */}
          <SectionCard
            title="Review Site Rankings · Top-5 tracker"
            subtitle="NerdWallet · Bankrate · WalletHub · The Points Guy · Forbes · CreditKarma"
            height={280}
          >
            {MARKET_REPUTATION_DATA.rankingPanel.map((r) => (
              <div
                key={`${r.site}-${r.category}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 40px",
                  gap: 6,
                  padding: "6px 0",
                  borderBottom: `1px dashed ${T.border}`,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{r.site}</div>
                  <div style={{ fontSize: 9.5, color: T.textMut }}>{r.category}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, color: r.top5 ? T.green : T.amber, fontFamily: "var(--mono)", fontWeight: 800 }}>#{r.rank}</div>
                  <div style={{ fontSize: 9, color: T.textMut }}>was #{r.prev}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                  {rankingArrow(r.change)}
                  {r.top5 ? (
                    <span style={{ fontSize: 9, color: T.green }}>Top5</span>
                  ) : (
                    <span style={{ fontSize: 9, color: T.red }}>Out</span>
                  )}
                </div>
              </div>
            ))}
          </SectionCard>
        </div>

        {/* ══════ COL 2 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 3. Sentiment vs competitor trend */}
          <SectionCard
            title="Brand Sentiment · Ours vs Competitor Avg"
            subtitle="Weekly listening — where the narrative actually is"
            accent={T.red}
            height={220}
          >
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={MARKET_REPUTATION_DATA.sentimentTrend} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="w" tick={{ fill: T.textMut, fontSize: 10 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} domain={[0.4, 0.8]} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="ours" stroke={T.cyan} strokeWidth={2.5} name="Our cards" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="comp" stroke={T.red} strokeWidth={2.5} name="Competitor avg" dot={{ r: 3 }} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* 4. Social virality + top hashtags */}
          <SectionCard
            title="Social Virality · Positive vs Negative"
            subtitle="Weekly viral-post count + dominant hashtags"
            accent={T.amber}
            height={380}
          >
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={MARKET_REPUTATION_DATA.socialMomentum} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="week" tick={{ fill: T.textMut, fontSize: 10 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="positive" fill={T.green} name="Positive" radius={[2, 2, 0, 0]} />
                <Bar dataKey="negative" fill={T.red} name="Negative" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, color: T.textMut, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Trending hashtags
              </div>
              {MARKET_REPUTATION_DATA.topHashtags.map((h) => (
                <div
                  key={h.tag}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 50px",
                    gap: 6,
                    fontSize: 10,
                    marginBottom: 3,
                  }}
                >
                  <span style={{ color: h.stance === "negative" ? T.red : T.green }}>{h.tag}</span>
                  <span style={{ color: T.textMut, fontFamily: "var(--mono)", textAlign: "right" }}>{h.volume.toLocaleString()}</span>
                  <span style={{ color: T.textSec, textAlign: "right" }}>{h.reach}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ══════ COL 3 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 5. Influencer + analyst watchlist */}
          <SectionCard
            title="Influencer & Analyst Watchlist"
            subtitle="YouTube · TikTok · Reddit · X — who is moving the card narrative"
            accent={T.purple}
            height={320}
          >
            {MARKET_REPUTATION_DATA.influencerWatch.map((row) => {
              const tone = row.stance === "Negative" ? T.red : row.stance === "Positive" ? T.green : T.amber;
              return (
                <div
                  key={row.name}
                  style={{
                    padding: "6px 0",
                    borderBottom: `1px dashed ${T.border}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{row.name}</span>
                    <span style={{ fontSize: 10, color: tone, fontWeight: 700 }}>{row.stance}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: T.textMut, marginTop: 1 }}>
                    <span>{row.platform} · {row.reach}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: T.textSec, marginTop: 2, lineHeight: 1.4 }}>{row.topic}</div>
                </div>
              );
            })}
          </SectionCard>

          {/* 6. External ↔ Internal ops linkage */}
          <SectionCard
            title="External Narrative ↔ Internal Ops Gap"
            subtitle="Where public perception is caused by an internal servicing gap"
            accent={T.cyan}
            height={260}
          >
            {MARKET_REPUTATION_DATA.opsLinkage.map((row) => (
              <div
                key={row.external}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "6px 8px",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{row.external}</span>
                  <span style={{ fontSize: 10, color: T.amber, fontFamily: "var(--mono)" }}>{row.externalImpact}%</span>
                </div>
                <div style={{ fontSize: 10, color: T.red, marginTop: 2 }}>
                  <AlertCircle size={9} style={{ marginRight: 3, marginBottom: -1 }} />
                  {row.internalGap}
                </div>
                <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 1 }}>{row.channels}</div>
              </div>
            ))}
          </SectionCard>

          {/* 7. AI trio */}
          <AIBlock title="✨ AI Reputation Early Warning" text={MARKET_REPUTATION_DATA.aiInsights.earlyWarning} tone="red" />
          <AIBlock title="✨ AI Narrative Counter-Moves" text={MARKET_REPUTATION_DATA.aiInsights.narrativeActions} tone="cyan" />
          <AIBlock title="✨ AI Competitive Move" text={MARKET_REPUTATION_DATA.aiInsights.competitiveMove} tone="gold" />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DRILL 3 — FRAUD & FULFILLMENT
// Sowmya: "how fast they solve, throughput of a team/channel/person,
// complexity and throughput are the two factors to weigh."
// ═════════════════════════════════════════════════════════════════════

export function FraudAndFulfillmentDrillDown({ onBack }: DrillProps) {
  const T = useDashboardTheme();

  return (
    <div>
      <DrillHeader
        title="Are we keeping our service promise?"
        description="Dispute · chargeback · fraud lifecycle and workforce throughput. Internal operations lens feeding the CX Promise score."
        onBack={onBack}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* ══════ COL 1 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 1. Resolution velocity by card intent */}
          <SectionCard
            title="Card Intent Resolution · Fastest / Avg / Slowest"
            subtitle="Sowmya's ask — how fast are we solving by intent?"
            accent={T.cyan}
            height={310}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={CREDIT_CARD_PROCESS_RESOLUTION}
                layout="vertical"
                margin={{ top: 4, right: 4, left: 28, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis type="number" tick={{ fill: T.textMut, fontSize: 10 }} domain={[0, 11]} />
                <YAxis type="category" dataKey="process" tick={{ fill: T.textMut, fontSize: 9 }} width={120} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="fastest" fill={T.green} name="Fastest (d)" />
                <Bar dataKey="avg" fill={T.amber} name="Avg (d)" />
                <Bar dataKey="slowest" fill={T.red} name="Slowest (d)" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* 2. Case lifecycle funnel */}
          <SectionCard
            title="Dispute & Fraud Case Lifecycle"
            subtitle="Where chargebacks stall · SLA per stage"
            accent={T.red}
            height={280}
          >
            {FRAUD_FULFILLMENT_DATA.caseLifecycle.map((s) => {
              const tone = s.status === "green" ? T.green : s.status === "amber" ? T.amber : T.red;
              return (
                <div key={s.stage} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                    <span style={{ color: T.textSec }}>{s.stage}</span>
                    <span style={{ color: T.text, fontFamily: "var(--mono)" }}>
                      {s.cases.toLocaleString()} · <span style={{ color: tone }}>{s.slaPct}% SLA</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: `${tone}20`, borderRadius: 3, marginTop: 3 }}>
                    <div style={{ width: `${s.slaPct}%`, height: "100%", background: tone, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </SectionCard>
        </div>

        {/* ══════ COL 2 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 3. SLA & Backlog pressure matrix */}
          <SectionCard
            title="SLA & Backlog Pressure · by channel"
            subtitle="Backlog, >48h aging, SLA — where the fire is burning"
            accent={T.amber}
            height={250}
          >
            <div style={{ display: "grid", gridTemplateColumns: "80px 46px 54px 60px 50px", gap: 6, fontSize: 10, color: T.textMut, borderBottom: `1px solid ${T.border}`, paddingBottom: 4, marginBottom: 6 }}>
              <span>Channel</span>
              <span style={{ textAlign: "right" }}>SLA</span>
              <span style={{ textAlign: "right" }}>Backlog</span>
              <span style={{ textAlign: "right" }}>&gt; 48h</span>
              <span style={{ textAlign: "right" }}>Sev</span>
            </div>
            {FRAUD_FULFILLMENT_DATA.slaBacklog.map((row) => {
              const tone = row.severity === "red" ? T.red : row.severity === "amber" ? T.amber : T.green;
              return (
                <div key={row.channel} style={{ display: "grid", gridTemplateColumns: "80px 46px 54px 60px 50px", gap: 6, fontSize: 10.5, marginBottom: 5 }}>
                  <span style={{ color: T.textSec }}>{row.channel}</span>
                  <span style={{ color: row.sla >= 85 ? T.green : row.sla >= 75 ? T.amber : T.red, fontFamily: "var(--mono)", textAlign: "right" }}>{row.sla}%</span>
                  <span style={{ color: T.text, fontFamily: "var(--mono)", textAlign: "right" }}>{row.backlog}</span>
                  <span style={{ color: T.red, fontFamily: "var(--mono)", textAlign: "right" }}>{row.aging48h}</span>
                  <span style={{ color: tone, textAlign: "right", fontWeight: 700 }}>{row.severity.toUpperCase()}</span>
                </div>
              );
            })}
          </SectionCard>

          {/* 4. Throughput vs Complexity workforce lens */}
          <SectionCard
            title="Workforce · Throughput vs Complexity"
            subtitle="Team cases/day × complexity handled · quality and cost-per-case"
            accent={T.purple}
            height={330}
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={FRAUD_FULFILLMENT_DATA.throughputComplexity} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="team" tick={{ fill: T.textMut, fontSize: 9 }} />
                <YAxis tick={{ fill: T.textMut, fontSize: 10 }} />
                <Tooltip contentStyle={COMMON_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="cases" fill={T.cyan} name="Cases/day" radius={[2, 2, 0, 0]} />
                <Bar dataKey="complexity" fill={T.purple} name="Complexity idx" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginTop: 4 }}>
              {FRAUD_FULFILLMENT_DATA.throughputComplexity.map((t) => {
                const qualityTone = t.quality >= 85 ? T.green : t.quality >= 75 ? T.amber : T.red;
                return (
                  <div key={t.team} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 6px" }}>
                    <div style={{ fontSize: 9.5, color: T.textMut }}>{t.team}</div>
                    <div style={{ fontSize: 10, color: qualityTone, fontFamily: "var(--mono)", fontWeight: 700 }}>Q {t.quality} · W {t.winRate}%</div>
                    <div style={{ fontSize: 9, color: T.textMut }}>{t.costPerCase}</div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* ══════ COL 3 ══════ */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* 5. Attention matrix — pay_attention / watch / ignore */}
          <SectionCard
            title="What to Action · Pay Attention / Watch / Ignore"
            subtitle="Ranjith's ask — pre-sorted so the head of cards doesn't have to"
            accent={T.red}
            height={300}
          >
            {(["pay_attention", "watch", "ignore"] as const).map((bucket) => {
              const rows = FRAUD_FULFILLMENT_DATA.attentionMatrix.filter((r) => r.bucket === bucket);
              if (rows.length === 0) return null;
              const tone = bucket === "pay_attention" ? T.red : bucket === "watch" ? T.amber : T.textMut;
              return (
                <div key={bucket} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: tone, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                    {bucket.replace("_", " ")}
                  </div>
                  {rows.map((r) => (
                    <div key={r.topic} style={{ borderLeft: `2px solid ${tone}`, paddingLeft: 8, marginBottom: 5 }}>
                      <div style={{ fontSize: 11, color: T.text }}>{r.topic}</div>
                      <div style={{ fontSize: 9.5, color: T.textMut, lineHeight: 1.4 }}>{r.reason}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </SectionCard>

          {/* 6. Escalation risk + Fraud type mix */}
          <SectionCard
            title="Escalation & Fraud Type Mix"
            subtitle="Reopen risk by channel · fraud type distribution"
            accent={T.cyan}
            height={330}
          >
            <div style={{ fontSize: 10, color: T.textMut, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Escalation risk · by channel
            </div>
            {FRAUD_FULFILLMENT_DATA.escalationRisk.map((r) => (
              <div key={r.channel} style={{ display: "grid", gridTemplateColumns: "70px 1fr 30px", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10.5, color: T.textSec }}>{r.channel}</span>
                <div style={{ height: 6, borderRadius: 3, background: `${T.red}20` }}>
                  <div style={{ width: `${r.risk}%`, height: "100%", borderRadius: 3, background: r.risk > 40 ? T.red : r.risk > 25 ? T.amber : T.green }} />
                </div>
                <span style={{ fontSize: 10, color: T.text, fontFamily: "var(--mono)", textAlign: "right" }}>{r.risk}</span>
              </div>
            ))}
            <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 4 }}>
              Top driver on Tickets: "{FRAUD_FULFILLMENT_DATA.escalationRisk.find((r) => r.channel === "Tickets")?.driver}"
            </div>

            <div style={{ fontSize: 10, color: T.textMut, margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Fraud type · share × loss bps
            </div>
            {FRAUD_FULFILLMENT_DATA.fraudTypes.map((f) => (
              <div key={f.name} style={{ display: "grid", gridTemplateColumns: "1fr 40px 40px 30px", gap: 4, fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: T.textSec }}>{f.name}</span>
                <span style={{ color: T.text, fontFamily: "var(--mono)", textAlign: "right" }}>{f.pct}%</span>
                <span style={{ color: T.red, fontFamily: "var(--mono)", textAlign: "right" }}>{f.lossBps}</span>
                <span style={{
                  color: f.trend === "up" ? T.red : f.trend === "down" ? T.green : T.textMut,
                  textAlign: "right",
                  fontSize: 9,
                }}>
                  {f.trend === "up" ? "▲" : f.trend === "down" ? "▼" : "—"}
                </span>
              </div>
            ))}
          </SectionCard>

          {/* 7. AI trio — Optimizer · What-If · Fraud pattern */}
          <AIBlock title="✨ AI Fulfillment Optimizer" text={FRAUD_FULFILLMENT_DATA.aiInsights.optimizer} tone="cyan" />
          <AIBlock title="✨ AI What-If Simulator" text={FRAUD_FULFILLMENT_DATA.aiInsights.whatIf} tone="gold" />
          <AIBlock title="✨ AI Fraud Pattern Alert" text={FRAUD_FULFILLMENT_DATA.aiInsights.fraudPattern} tone="red" />
        </div>
      </div>
    </div>
  );
}
