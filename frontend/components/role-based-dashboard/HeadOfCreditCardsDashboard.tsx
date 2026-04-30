"use client";

import { ArrowLeft, Bot, ChevronRight, CreditCard, Shield, Target, Activity, AlertTriangle } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { DashboardThemeProvider, type DashboardThemeTokens } from "./DashboardThemeContext";
import {
  CustomerCardJourneyDrillDown,
  FraudAndFulfillmentDrillDown,
  MarketReputationDrillDown,
} from "./CreditCardsDrillDownScreens";
import {
  CREDIT_CARD_AI_COMMAND_BRIEF,
  CREDIT_CARD_CHANNEL_PULSE,
  CREDIT_CARD_CHANNEL_SCORES,
  CREDIT_CARD_CHANNELS,
  CREDIT_CARD_EXTERNAL_VS_INTERNAL,
  CREDIT_CARD_PILLARS,
  CREDIT_CARD_PRIORITY_QUEUE,
  CREDIT_CARD_PROCESS_RESOLUTION,
  CREDIT_CARD_PROMISE_SCORE,
  CX_PROMISE_DIMENSIONS,
  CX_PROMISE_FCI_BY_CHANNEL,
  type CreditCardChannel,
} from "@/lib/role-based-dashboard/creditCardsData";
import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";

type DrillId = "customer_card_journey" | "market_reputation" | "fraud_fulfillment";

export type HeadOfCreditCardsDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

function statusColor(status: string, T: DashboardThemeTokens) {
  if (status === "green") return T.green;
  if (status === "red") return T.red;
  return T.amber;
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const T = REGISTRY_THEME;
  return (
    <section
      style={{
        background: T.elevated,
        border: `1px solid ${T.borderLight}`,
        borderRadius: 12,
        padding: 14,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  const T = REGISTRY_THEME;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</div>
      {sub ? <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{sub}</div> : null}
    </div>
  );
}

function CommandCenter({ onOpenDrill }: { onOpenDrill: (drill: DrillId) => void }) {
  const T = REGISTRY_THEME;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ════════ HERO — CX PROMISE SCORE (transparent formula) ════════ */}
      <section
        style={{
          background: `linear-gradient(135deg, ${T.elevated} 0%, ${T.card} 100%)`,
          border: `1px solid ${T.borderLight}`,
          borderLeft: `4px solid ${T.cyan}`,
          borderRadius: 14,
          padding: 18,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 22, alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <CreditCard size={16} color={T.cyan} />
              <div style={{ fontSize: 10, color: T.cyan, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800 }}>
                Credit Cards · CX Promise Command Center
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.25 }}>
              Is your customer experience promise being met this week?
            </div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 6, lineHeight: 1.55 }}>
              {CREDIT_CARD_PROMISE_SCORE.narrative}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: T.textMut,
                fontFamily: "var(--mono)",
                background: T.surface,
                border: `1px dashed ${T.border}`,
                borderRadius: 8,
                padding: "6px 10px",
                display: "inline-block",
              }}
            >
              Formula · {CREDIT_CARD_PROMISE_SCORE.formula}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 1 }}>Weighted Promise Score</div>
            <div style={{ fontSize: 56, lineHeight: 1, color: T.cyan, fontWeight: 800, fontFamily: "var(--mono)" }}>
              {CREDIT_CARD_PROMISE_SCORE.score}
            </div>
            <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>
              {CREDIT_CARD_PROMISE_SCORE.weekDelta} pts WoW · Target {CREDIT_CARD_PROMISE_SCORE.target}
            </div>
          </div>
        </div>

        {/* Channel weighted contribution strip (transparent) */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 8 }}>
          {CREDIT_CARD_CHANNEL_SCORES.map((c) => (
            <div
              key={c.channel}
              style={{
                background: T.surface,
                border: `1px solid ${T.borderLight}`,
                borderTop: `3px solid ${statusColor(c.status, T)}`,
                borderRadius: 10,
                padding: "8px 10px",
              }}
            >
              <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.channel}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: T.text, fontFamily: "var(--mono)", fontSize: 18, fontWeight: 800 }}>{c.score}</span>
                <span style={{ color: T.textSec, fontSize: 10 }}>wt {(c.weight * 100).toFixed(0)}%</span>
              </div>
              <div style={{ marginTop: 6, height: 4, background: `${statusColor(c.status, T)}20`, borderRadius: 2 }}>
                <div style={{ width: `${c.score}%`, height: "100%", background: statusColor(c.status, T), borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ 3 CLICKABLE PILLARS ════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
        {CREDIT_CARD_PILLARS.map((pillar, idx) => {
          const borderTone = [T.cyan, T.purple, T.amber][idx];
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onOpenDrill(pillar.id)}
              style={{
                background: T.elevated,
                border: `1px solid ${T.borderLight}`,
                borderTop: `3px solid ${borderTone}`,
                borderRadius: 12,
                padding: 14,
                textAlign: "left",
                cursor: "pointer",
                transition: "transform 0.12s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, color: T.text, fontWeight: 700 }}>{pillar.title}</div>
                <ChevronRight size={16} color={T.textMut} />
              </div>
              <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{pillar.sub}</div>

              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: statusColor(pillar.status, T), fontFamily: "var(--mono)" }}>
                  {pillar.score}
                </span>
                <span style={{ fontSize: 11, color: T.textSec }}>{pillar.trend}</span>
              </div>

              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {pillar.kpis.map((k) => (
                  <div key={k.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 7px" }}>
                    <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase" }}>{k.label}</div>
                    <div style={{ fontSize: 12, color: T.text, fontFamily: "var(--mono)", fontWeight: 700 }}>{k.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 11, color: T.textSec, lineHeight: 1.45 }}>
                <AlertTriangle size={10} color={T.amber} style={{ marginRight: 4, marginBottom: -1 }} />
                {pillar.topSignal}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: T.gold,
                  background: `${T.gold}10`,
                  borderLeft: `2px solid ${T.gold}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  lineHeight: 1.45,
                }}
              >
                {pillar.aiInsight}
              </div>
            </button>
          );
        })}
      </section>

      {/* ════════ FCI MATRIX + EXTERNAL + INTERNAL LENSES ════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 10 }}>
        <Card>
          <SectionTitle
            title="CX Promise FCI Matrix"
            sub="Ownership · Emotion · Quality · Effort · Retention — scored per channel"
          />
          <div style={{ display: "grid", gridTemplateColumns: `86px repeat(${CREDIT_CARD_CHANNELS.length}, 1fr)`, gap: 4 }}>
            <div />
            {CREDIT_CARD_CHANNELS.map((ch) => (
              <div key={ch} style={{ fontSize: 10, color: T.textMut, textAlign: "center", fontWeight: 600 }}>{ch}</div>
            ))}
            {CX_PROMISE_DIMENSIONS.map((dim) => (
              <Fragment key={dim.id}>
                <div style={{ fontSize: 10, color: T.textSec, alignSelf: "center" }}>{dim.label}</div>
                {CREDIT_CARD_CHANNELS.map((ch) => {
                  const score = CX_PROMISE_FCI_BY_CHANNEL[ch as CreditCardChannel][dim.id as keyof typeof CX_PROMISE_FCI_BY_CHANNEL["Email"]];
                  const tone = score >= 72 ? T.green : score >= 60 ? T.amber : T.red;
                  return (
                    <div
                      key={`${dim.id}-${ch}`}
                      style={{
                        background: `${tone}22`,
                        border: `1px solid ${tone}55`,
                        color: tone,
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: "center",
                        padding: "5px 0",
                        borderRadius: 5,
                      }}
                    >
                      {score}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: T.textMut, lineHeight: 1.45 }}>
            Social is red across every dimension — listening signal says promise is not being experienced there even though internal ops deliver.
          </div>
        </Card>

        <Card>
          <SectionTitle title="External Lens" sub="What the market feels about us" />
          {CREDIT_CARD_EXTERNAL_VS_INTERNAL.external.map((item) => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr 60px", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: T.textSec }}>{item.label}</div>
                <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 1 }}>{item.context}</div>
              </div>
              <span style={{ color: statusColor(item.status, T), fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, textAlign: "right" }}>
                {item.value}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle title="Internal Lens" sub="What our ops actually delivered" />
          {CREDIT_CARD_EXTERNAL_VS_INTERNAL.internal.map((item) => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr 60px", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: T.textSec }}>{item.label}</div>
                <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 1 }}>{item.context}</div>
              </div>
              <span style={{ color: statusColor(item.status, T), fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, textAlign: "right" }}>
                {item.value}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              color: T.gold,
              background: `${T.gold}10`,
              borderLeft: `2px solid ${T.gold}`,
              borderRadius: 6,
              padding: "6px 8px",
              lineHeight: 1.45,
            }}
          >
            ✨ Gap: {CREDIT_CARD_EXTERNAL_VS_INTERNAL.mismatch}
          </div>
        </Card>
      </section>

      {/* ════════ PROCESS RESOLUTION STRIP + CHANNEL PULSE + PRIORITY QUEUE ════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 10 }}>
        <Card>
          <SectionTitle
            title="Card Intent Resolution — Fastest · Avg · Slowest (days)"
            sub="Top card-specific processes ranked by weekly volume"
          />
          <div style={{ display: "grid", gap: 6 }}>
            {CREDIT_CARD_PROCESS_RESOLUTION.slice(0, 6).map((p) => {
              const attentionTone =
                p.attention === "pay_attention" ? T.red : p.attention === "watch" ? T.amber : T.green;
              const barMax = 11;
              return (
                <div key={p.process} style={{ display: "grid", gridTemplateColumns: "190px 1fr 70px 54px", gap: 8, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.text }}>{p.process}</div>
                    <div style={{ fontSize: 9.5, color: T.textMut }}>{p.dominantChannel} · {p.volume}/wk</div>
                  </div>
                  <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: T.surface }}>
                    <div style={{ width: `${(p.fastest / barMax) * 100}%`, background: T.green }} />
                    <div style={{ width: `${((p.avg - p.fastest) / barMax) * 100}%`, background: T.amber }} />
                    <div style={{ width: `${((p.slowest - p.avg) / barMax) * 100}%`, background: T.red }} />
                  </div>
                  <div style={{ fontSize: 10, color: T.textMut, fontFamily: "var(--mono)" }}>
                    <span style={{ color: T.green }}>{p.fastest}</span>
                    {" · "}
                    <span style={{ color: T.amber }}>{p.avg}</span>
                    {" · "}
                    <span style={{ color: T.red }}>{p.slowest}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: attentionTone,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      textAlign: "right",
                      letterSpacing: 0.4,
                    }}
                  >
                    {p.attention.replace("_", " ")}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Channel Pulse" sub="Sentiment · Volume · Backlog" />
          {CREDIT_CARD_CHANNEL_PULSE.map((row) => (
            <div key={row.channel} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T.textSec, fontWeight: 600 }}>{row.channel}</span>
                <span style={{ fontSize: 10, color: T.textMut, fontFamily: "var(--mono)" }}>
                  Vol {row.volume.toLocaleString()} · B {row.backlog} · {row.resolutionDays}d
                </span>
              </div>
              <div style={{ marginTop: 4, height: 6, borderRadius: 3, background: `${T.cyan}15` }}>
                <div
                  style={{
                    width: `${Math.round(row.sentiment * 100)}%`,
                    height: "100%",
                    borderRadius: 3,
                    background: row.sentiment >= 0.62 ? T.green : row.sentiment >= 0.55 ? T.amber : T.red,
                  }}
                />
              </div>
              <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 2 }}>Top intent · {row.topIntent}</div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle title="Priority Queue" sub="Top intents the head of cards must action" />
          {CREDIT_CARD_PRIORITY_QUEUE.map((item) => (
            <div
              key={item.intent}
              style={{
                marginBottom: 8,
                borderLeft: `3px solid ${item.severity === "High" ? T.red : T.amber}`,
                paddingLeft: 8,
                background: T.surface,
                borderRadius: 4,
                padding: "6px 8px",
              }}
            >
              <div style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{item.intent}</div>
              <div style={{ fontSize: 9.5, color: T.textMut, marginTop: 1 }}>
                {item.owner} · {item.channel} · ETA {item.eta}
              </div>
              <div style={{ fontSize: 10, color: T.cyan, marginTop: 2 }}>{item.impact}</div>
            </div>
          ))}
        </Card>
      </section>

      {/* ════════ ✨ AI COMMAND BRIEF (prominent, decision-ready) ════════ */}
      <section
        style={{
          background: `linear-gradient(135deg, ${T.gold}14 0%, ${T.gold}06 100%)`,
          border: `1px solid ${T.gold}40`,
          borderLeft: `4px solid ${T.gold}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Bot size={14} color={T.gold} />
              <span style={{ fontSize: 12, color: T.gold, fontWeight: 800 }}>{CREDIT_CARD_AI_COMMAND_BRIEF.headline}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
              {CREDIT_CARD_AI_COMMAND_BRIEF.bullets.map((b) => (
                <li key={b} style={{ marginBottom: 4 }}>{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.gold, fontWeight: 700, marginBottom: 6 }}>✨ AI Recommended Focus</div>
            {CREDIT_CARD_AI_COMMAND_BRIEF.recommendedFocus.map((r) => (
              <div
                key={r.action}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px",
                  gap: 4,
                  padding: "6px 8px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  marginBottom: 6,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{r.action}</div>
                  <div style={{ fontSize: 9.5, color: T.textMut }}>{r.owner}</div>
                </div>
                <div style={{ fontSize: 10, color: T.cyan, textAlign: "right", fontFamily: "var(--mono)", fontWeight: 700 }}>
                  {r.eta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function HeadOfCreditCardsDashboard({
  industryName,
  roleName,
  industryColor,
  onExit,
  theme,
}: HeadOfCreditCardsDashboardProps) {
  const T = theme ?? REGISTRY_THEME;
  const [activeDrill, setActiveDrill] = useState<DrillId | null>(null);

  const content = useMemo(() => {
    if (activeDrill === "customer_card_journey") return <CustomerCardJourneyDrillDown onBack={() => setActiveDrill(null)} />;
    if (activeDrill === "market_reputation") return <MarketReputationDrillDown onBack={() => setActiveDrill(null)} />;
    if (activeDrill === "fraud_fulfillment") return <FraudAndFulfillmentDrillDown onBack={() => setActiveDrill(null)} />;
    return <CommandCenter onOpenDrill={setActiveDrill} />;
  }, [activeDrill]);

  return (
    <DashboardThemeProvider value={T}>
      <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: "var(--font), system-ui, sans-serif", overflow: "hidden" }}>
        <aside style={{ width: 240, borderRight: `1px solid ${T.borderLight}`, background: T.elevated, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 14px", borderBottom: `1px solid ${T.borderLight}` }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.cyan, fontWeight: 800 }}>Yaaralabs</div>
            <div style={{ fontSize: 11, color: T.textMut }}>Fluid Intelligence</div>
          </div>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.borderLight}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: `${industryColor}20`, border: `1px solid ${industryColor}` }} />
              <span style={{ fontSize: 11, color: T.textSec }}>{industryName}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: T.cyan, fontWeight: 700 }}>{roleName}</div>
            <div style={{ marginTop: 4, fontSize: 10, color: T.textMut }}>CX Promise listening dashboard</div>
          </div>
          <div style={{ padding: "12px 10px", flex: 1 }}>
            {[
              { id: "command", label: "Command Center", icon: Activity },
              {
                id: "customer_card_journey",
                label: "Are cardholders satisfied with their journey?",
                icon: Target,
              },
              { id: "market_reputation", label: "What is the market saying about us?", icon: Shield },
              { id: "fraud_fulfillment", label: "Are we keeping our service promise?", icon: CreditCard },
            ].map((item) => {
              const active = (activeDrill ?? "command") === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveDrill(item.id === "command" ? null : (item.id as DrillId))}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: active ? `${T.cyan}20` : "transparent",
                    color: active ? T.text : T.textSec,
                    borderRadius: 8,
                    padding: "9px 10px",
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <Icon size={12} color={active ? T.cyan : T.textMut} />
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "10px", borderTop: `1px solid ${T.borderLight}` }}>
            <button
              type="button"
              onClick={onExit}
              style={{
                width: "100%",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                background: T.surface,
                color: T.textSec,
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={12} />
              Change Role
            </button>
          </div>
        </aside>
        <main style={{ flex: 1, padding: 16, overflow: "auto" }}>{content}</main>
      </div>
    </DashboardThemeProvider>
  );
}
