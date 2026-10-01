"use client";

import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { CSSProperties, ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

/** Local drill chrome — ChannelView look, no v1 DemoProvider. */
const DR = {
  card: K.bg,
  border: K.border,
  text: K.text,
  sub: K.textSec,
  muted: K.textMut,
  dim: K.textMut,
  red: K.red,
  orange: K.orange,
  amber: K.amber,
  green: K.green,
  purple: K.violet400,
} as const;

function severityColor(s: string): string {
  const k = s.toLowerCase();
  if (k.includes("friction") || k.includes("critical") || k.includes("high"))
    return DR.amber;
  if (k.includes("praise") || k.includes("healthy") || k.includes("improving"))
    return DR.green;
  if (k.includes("watch")) return DR.amber;
  return DR.muted;
}

function DrMono({
  children,
  color,
  size = 15,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <span
      style={{
        fontFamily: K.mono,
        fontWeight: 700,
        color: color || DR.text,
        fontSize: size,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </span>
  );
}

function DrTag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 3,
        background: withAlpha(color, 0.18),
        color,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function DrCard({
  children,
  accent,
  style,
}: {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: DR.card,
        border: `1px solid ${DR.border}`,
        borderLeft: accent ? `3px solid ${accent}` : `1px solid ${DR.border}`,
        borderRadius: 16,
        padding: 14,
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function DrHead({ children, sub }: { children: ReactNode; sub?: string }) {
  const L = useLabel2();
  return (
    <header style={{ marginBottom: 12 }}>
      <h3
        style={{
          margin: 0,
          color: DR.text,
          fontSize: 17,
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {typeof children === "string" ? L(children) : children}
      </h3>
      {sub ? (
        <p style={{ margin: "4px 0 0", fontSize: 13, color: DR.muted }}>
          {L(sub)}
        </p>
      ) : null}
    </header>
  );
}

export type InstallStep = {
  step: string;
  shortLabel: string;
  friction: number;
  praise: number;
  topPhrase: string;
};

/** Step strip — v1 ChannelMixStrip layout. */
export function InstallStepStrip({ steps }: { steps: InstallStep[] }) {
  const L = useLabel2();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: 10,
      }}
    >
      {steps.map((t) => (
        <div
          key={t.step}
          style={{
            background: DR.card,
            border: `1px solid ${DR.border}`,
            borderRadius: 14,
            padding: "12px 14px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: DR.sub }}>
            {L(t.shortLabel)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <DrMono size={22} color={DR.amber}>
              {t.friction}
            </DrMono>
            <span style={{ fontSize: 12, color: DR.muted }}>friction</span>
            <DrMono size={22} color={DR.green}>
              {t.praise}
            </DrMono>
            <span style={{ fontSize: 12, color: DR.muted }}>praise</span>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: DR.text,
              lineHeight: 1.35,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {L(t.topPhrase)}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Diverging friction / praise bars — symmetric axis, fixed ticks. */
export function FrictionPraiseChart({
  steps,
  frictionTotal,
  praiseTotal,
}: {
  steps: InstallStep[];
  frictionTotal: number;
  praiseTotal: number;
}) {
  const L = useLabel2();
  const data = steps.map((s) => ({
    step: s.shortLabel,
    friction: -s.friction,
    praise: s.praise,
  }));

  return (
    <DrCard accent={DR.orange}>
      <DrHead
        sub={`Experience only · friction ${frictionTotal} · praise ${praiseTotal}`}
      >
        {`Friction vs praise by step · ${frictionTotal} / ${praiseTotal}`}
      </DrHead>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 12,
          fontWeight: 700,
          color: DR.muted,
          padding: "0 8px 0 120px",
        }}
      >
        <span style={{ color: DR.amber }}>Friction</span>
        <span style={{ color: DR.green }}>Praise</span>
      </div>
      <div
        role="img"
        aria-label="Friction versus praise by step"
        style={{ height: 260 }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 1, height: 1 }}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 8, left: 4 }}
            stackOffset="sign"
          >
            <CartesianGrid stroke={K.borderLight} horizontal={false} />
            <XAxis
              type="number"
              domain={[-20, 20]}
              ticks={[-20, -10, 0, 10, 20]}
              tickFormatter={(v) => String(Math.abs(Number(v)))}
              tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
              axisLine={{ stroke: K.borderLight }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="step"
              width={118}
              tick={{ fill: K.textSec, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => L(String(v))}
            />
            <ReferenceLine x={0} stroke={K.borderLight} strokeWidth={1.5} />
            <Tooltip
              contentStyle={{
                background: K.elevated,
                border: `1px solid ${K.borderLight}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => {
                const n = Math.abs(Number(value));
                return [n, name === "friction" ? "Friction" : "Praise"];
              }}
            />
            <Bar
              dataKey="friction"
              name="friction"
              stackId="exp"
              fill={K.amber}
              isAnimationActive={false}
              radius={[4, 0, 0, 4]}
            >
              {data.map((d) => (
                <Cell key={`f-${d.step}`} fill={K.amber} />
              ))}
            </Bar>
            <Bar
              dataKey="praise"
              name="praise"
              stackId="exp"
              fill={K.green}
              isAnimationActive={false}
              radius={[0, 4, 4, 0]}
            >
              {data.map((d) => (
                <Cell key={`p-${d.step}`} fill={K.green} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DrCard>
  );
}

export type InstallTopic = {
  topic: string;
  tone: string;
  growthPct: number;
  mentions: number;
  why: string;
};

/** Left — What installers mention most (v1 TrendingPartnerTopics). */
export function InstallerTopics({ topics }: { topics: InstallTopic[] }) {
  const L = useLabel2();
  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub="Topics gaining mentions across help desk and service calls.">
        What installers mention most
      </DrHead>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {topics.map((t) => {
          const toneColor = severityColor(t.tone);
          const growthColor = t.tone === "PRAISE" ? DR.green : DR.orange;
          return (
            <div
              key={t.topic}
              style={{
                border: `1px solid ${DR.border}`,
                borderRadius: 10,
                padding: "14px 14px 12px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: DR.text,
                    fontSize: 14,
                    lineHeight: 1.3,
                    minWidth: 0,
                  }}
                >
                  {L(t.topic)}
                </div>
                <DrTag color={toneColor}>{t.tone}</DrTag>
              </div>
              <div style={{ marginTop: 10 }}>
                <DrMono size={24} color={growthColor}>
                  {t.growthPct >= 0 ? "+" : ""}
                  {t.growthPct}%
                </DrMono>
                <span style={{ marginLeft: 8, fontSize: 13, color: DR.muted }}>
                  {t.mentions} mentions
                </span>
              </div>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 13,
                  color: DR.muted,
                  lineHeight: 1.45,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {L(t.why)}
              </p>
            </div>
          );
        })}
      </div>
    </DrCard>
  );
}

export type InstallQuote = {
  text: string;
  step: string;
  partner: string;
  region: string;
  date: string;
  tone: string;
  note: string | null;
};

/** Right — In installers' words (v1 MarketSaying). */
export function InstallerQuotes({ quotes }: { quotes: InstallQuote[] }) {
  const L = useLabel2();
  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <DrHead sub="Quotes from help desk and service calls · experience only.">
        In installers&apos; words
      </DrHead>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "grid",
          gap: 10,
          paddingRight: 4,
          alignContent: "start",
        }}
      >
        {quotes.map((c) => (
          <div
            key={`${c.partner}-${c.date}-${c.text.slice(0, 24)}`}
            style={{
              border: `1px solid ${DR.border}`,
              borderRadius: 10,
              padding: 14,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: DR.text,
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              “{L(c.text)}”
            </p>
            {c.note ? (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: DR.amber,
                  fontWeight: 600,
                }}
              >
                {L(c.note)}
              </div>
            ) : null}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                fontSize: 12,
                color: DR.muted,
              }}
            >
              <DrTag color={severityColor(c.tone)}>{c.tone}</DrTag>
              <span>{L(c.step)}</span>
              <span>·</span>
              <span>{L(c.region)}</span>
              <span>·</span>
              <span>{c.date}</span>
            </div>
          </div>
        ))}
      </div>
    </DrCard>
  );
}

export type PartnerRow = {
  partner: string;
  region: string;
  friction: number;
  praise: number;
  topStep: string;
  trend: string;
};

/** By partner — v1 PartnerStandings (simplified, no drafts). */
export function ByPartnerTable({ rows }: { rows: PartnerRow[] }) {
  const L = useLabel2();
  return (
    <DrCard>
      <DrHead sub="Friction and praise mentions by partner · experience only.">
        By partner
      </DrHead>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 720,
          }}
        >
          <thead>
            <tr>
              {(
                [
                  "Partner",
                  "Region",
                  "Friction",
                  "Praise",
                  "Top step",
                  "Trend",
                ] as const
              ).map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: DR.dim,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    borderBottom: `1px solid ${DR.border}`,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const trendColor =
                r.trend === "up"
                  ? DR.amber
                  : r.trend === "down"
                    ? DR.green
                    : DR.muted;
              const trendGlyph =
                r.trend === "up" ? "▲" : r.trend === "down" ? "▼" : "—";
              return (
                <tr key={r.partner}>
                  <td style={td}>
                    <span style={{ fontWeight: 700, color: DR.text }}>
                      {L(r.partner)}
                    </span>
                  </td>
                  <td style={td}>{L(r.region)}</td>
                  <td style={td}>
                    <DrMono size={13} color={DR.amber}>
                      {r.friction}
                    </DrMono>
                  </td>
                  <td style={td}>
                    <DrMono size={13} color={DR.green}>
                      {r.praise}
                    </DrMono>
                  </td>
                  <td style={td}>{L(r.topStep)}</td>
                  <td style={{ ...td, color: trendColor, fontWeight: 700 }}>
                    {trendGlyph}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DrCard>
  );
}

/** Thin capture-gap note with Partner view link. */
export function CaptureGapNote({ text }: { text: string }) {
  const L = useLabel2();
  const { setView } = useDemo2();
  const trimmed = text.replace(/\s*·\s*See Partner view\.?\s*$/i, "");
  return (
    <p
      style={{
        margin: 0,
        fontSize: 12,
        color: K.textMut,
        lineHeight: 1.45,
      }}
    >
      {L(trimmed)} ·{" "}
      <button
        type="button"
        className="kgs2-focus"
        onClick={() => setView("partner")}
        style={{
          background: "none",
          border: "none",
          color: K.violet300,
          fontWeight: 700,
          fontFamily: "inherit",
          fontSize: 12,
          cursor: "pointer",
          padding: 0,
          textDecoration: "underline",
        }}
      >
        See Partner view
      </button>
    </p>
  );
}

const td: CSSProperties = {
  padding: "10px 10px",
  borderBottom: `1px solid ${DR.border}`,
  color: DR.sub,
  fontSize: 13,
  verticalAlign: "middle",
};
