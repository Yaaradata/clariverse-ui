"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { satisfactionAnswer } from "@/lib/indusind-v2/copy";
import {
  fmt,
  fmtDate,
  fmtPct,
  fmtSigned,
  halfLabel,
  rangeLabel,
} from "@/lib/indusind-v2/format";
import {
  sayingThemes,
  signalHref,
  themeMap,
  trendWords,
} from "@/lib/indusind-v2/selectors";
import type { Bundle, View } from "@/lib/indusind-v2/types";
import {
  AnswerLine,
  BarRow,
  BaselineCaption,
  C,
  Kpi,
  MONO,
  MutedNote,
  negColor,
  OwnerChip,
  PAIRS,
  SERIES,
  SentimentBar,
  SPLIT,
  Status,
  statusColor,
  Table,
  Tile,
  TrendLine,
  tint,
} from "./primitives";
import { useFrom } from "./Shell";

const SOURCE_LABEL: Record<string, string> = {
  x: "X",
  reddit: "Reddit",
  forum: "Forums",
  playstore: "Play Store",
  appstore: "App Store",
};
const BUSINESS_LABEL: Record<string, string> = {
  retail_banking: "Retail banking",
  cards: "Cards",
  loans: "Loans",
  payments: "Payments",
  wealth: "Wealth",
  sme_merchant: "SME and merchant",
  corporate: "Corporate",
  group_company: "Group company",
};
const EXCLUDE = new Set(["other", "market_news", "offers_deals"]);

export function SatisfactionView({ b }: { b: Bundle }) {
  const from: View = useFrom();
  const tm = themeMap(b);
  const internal = b.v3.satisfaction;
  const [pillar, setPillar] = useState<string | null>(null);

  const pillars = b.themes.pillars;
  const themesIn = (pid: string | null) =>
    b.themes.themes
      .filter((t) => !EXCLUDE.has(t.id) && (pid === null || t.pillar === pid))
      .sort((a, c) => c.count - a.count);
  const topThemes = themesIn(pillar).slice(0, 8);

  // Weekly net sentiment, source-weighted (review step 5): full weeks only, each source by its share of the window.
  const weekly = b.mood.weekly
    .filter((w) => w.net !== null)
    .map((w) => ({ week: fmtDate(w.week), net: Math.round(w.net ?? 0) }));
  const SOURCE_NAME: Record<string, string> = {
    playstore: "Play Store",
    appstore: "App Store",
    x: "X",
    forum: "Forums",
    reddit: "Reddit",
  };

  const saying = sayingThemes(b);

  const closureEx = b.signals.closure_intent.exemplars
    .map((id) => b.evidence[id])
    .filter(Boolean)
    .slice(0, 2);

  // repeat contact × business (public)
  const byBiz = b.signals.by_business.filter((x) => x.business !== "corporate");
  const repeatThemes = b.themes.themes
    .filter((t) => t.repeat_count >= 3 && !EXCLUDE.has(t.id))
    .sort((a, c) => c.repeat_count - a.repeat_count)
    .slice(0, 8);
  const bizKeys = [
    "retail_banking",
    "cards",
    "loans",
    "payments",
    "sme_merchant",
    "wealth",
  ];
  const repeatChart = repeatThemes.map((t) => {
    const row: Record<string, string | number> = {
      theme: t.label.length > 34 ? `${t.label.slice(0, 33)}…` : t.label,
      id: t.id,
    };
    const tot = Object.values(t.by_business).reduce((s, v) => s + v, 0) || 1;
    for (const k of bizKeys)
      row[k] = Math.round((t.repeat_count * (t.by_business[k] ?? 0)) / tot);
    return row;
  });
  const netColor = (v: number | null) =>
    v === null ? C.text : v >= 0 ? C.green : v > -30 ? C.amber : C.red;

  // A post can carry up to three themes; never show the same quote under two of them.
  const usedQuotes = new Set<string>();
  const sayingEvidence = saying.map((t) => {
    const id = t.exemplars.find((x) => b.evidence[x] && !usedQuotes.has(x));
    if (id) usedQuotes.add(id);
    return id ? b.evidence[id] : undefined;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["public", "internal"]}>
        <AnswerLine sub="Trust pillars from public voice (live); relationship tiers and journey stages are illustrative until discovery.">
          {satisfactionAnswer(b)}
        </AnswerLine>
      </Tile>

      <Tile
        title="Public items this window, by source"
        sub={`IndusInd Bank, on-topic, ${rangeLabel(b.meta.window.start, b.meta.window.end)}`}
        prov="public"
        id="sources"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          <Kpi
            label="All public items"
            value={fmt(b.themes.total_items)}
            href={`/role-based/indusind_bank/pulse-v2/market?from=${from}#themes`}
            tone="cyan"
          />
          {Object.entries(b.meta.bank_by_source)
            .sort((a, c) => c[1] - a[1])
            .map(([k, v]) => (
              <Kpi key={k} label={SOURCE_LABEL[k] ?? k} value={fmt(v)} />
            ))}
        </div>
        <MutedNote>{b.meta.coverage_notes.slice(0, 2).join(" ")}</MutedNote>
      </Tile>

      <Tile
        title="Interactions and sentiment by relationship tier"
        sub={`${fmt(internal.interactions_total)} interactions across all channels in the demo sample, 1 Jul to this morning`}
        prov="internal"
        id="tiers"
      >
        <Table
          head={[
            "Tier",
            "Interactions",
            "Positive",
            "Negative",
            "Customers affected",
            "Positive · neutral · negative",
          ]}
          align={["left", "right", "right", "right", "right", "left"]}
          rows={internal.tiers.map((t) => [
            t.tier,
            fmt(t.interactions),
            <span key="p" style={{ color: C.green, fontWeight: 700 }}>
              {fmtPct(t.share_positive)}
            </span>,
            <span key="n" style={{ color: C.red, fontWeight: 700 }}>
              {fmtPct(t.share_negative)}
            </span>,
            fmt(t.customers_affected),
            <div key="bar" style={{ minWidth: 220 }}>
              <SentimentBar
                pos={t.positive}
                neu={t.neutral}
                neg={t.negative}
                legend={false}
              />
            </div>,
          ])}
        />
        <MutedNote>
          Tier names to be verified with the bank. Figures are illustrative, not
          IndusInd Bank figures.
        </MutedNote>
      </Tile>

      <Tile
        title="Sentiment trend (conversation-inferred)"
        sub="Weekly net sentiment of public IndusInd Bank voice, full-window sources, source-weighted"
        prov="public"
        id="trend"
      >
        <div style={SPLIT}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <TrendLine
              data={weekly}
              height={214}
              xKey="week"
              yKey="net"
              reference={b.mood.window_average}
              referenceLabel="Window average"
              yLabel="Net sentiment"
              xLabel="Week starting"
              domain={[-100, 100]}
            />
            <BaselineCaption>
              Net sentiment = (positive − negative) ÷ items × 100, per source,
              then weighted by each source&apos;s share of the window. Dashed
              line: window average. No earlier baseline for social sources.
            </BaselineCaption>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Table
              head={[
                "Source",
                "Share of window",
                "Share of last 7 days",
                "Window net",
                "Last 7 days net",
              ]}
              align={["left", "right", "right", "right", "right"]}
              rows={b.mood.by_source.map((x) => [
                SOURCE_NAME[x.source] ?? x.source,
                fmtPct(x.weight_pct),
                fmtPct(x.last7_share_pct),
                fmtSigned(x.window_net),
                x.last7_net === null ? "—" : fmtSigned(x.last7_net),
              ])}
            />
            <MutedNote>
              Mood by source. Unweighted, the last 7 days would read{" "}
              {fmtSigned(b.mood.unweighted.delta_pts, " pts")} against the
              window average, because one source&apos;s share jumped;
              source-weighted, the change is{" "}
              {fmtSigned(b.mood.delta_pts, " pts")}. Reddit is left out: its
              collector changed on 1 Sep.
            </MutedNote>
          </div>
        </div>
      </Tile>

      <Tile
        title="Strain and friction by business"
        sub="Repeat contact and escalation language in public voice"
        prov="public"
        id="strain"
      >
        <Table
          head={[
            "Business",
            "Items",
            "Repeat contact",
            "Escalation language",
            "Negative",
          ]}
          align={["left", "right", "right", "right", "right"]}
          rows={byBiz.map((x) => [
            BUSINESS_LABEL[x.business] ?? x.business,
            fmt(x.count),
            <span key="r" style={{ color: C.amber }}>
              {fmt(x.repeat)}
            </span>,
            <span key="e" style={{ color: C.red }}>
              {fmt(x.escalation)}
            </span>,
            fmtPct((100 * x.negative) / x.count),
          ])}
        />
      </Tile>

      <Tile
        title="Top themes by trust pillar"
        sub="Tap a pillar to filter. Counts are public items that carry the theme."
        prov="public"
        id="pillars"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { id: null, label: "All pillars" },
                ...pillars.map((p) => ({ id: p.id, label: p.label })),
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPillar(p.id)}
                  style={{
                    fontSize: 13,
                    padding: "4px 10px",
                    borderRadius: 999,
                    cursor: "pointer",
                    background: pillar === p.id ? C.brandSoft : "transparent",
                    color: pillar === p.id ? C.text : C.textSec,
                    border: `1px solid ${pillar === p.id ? tint(C.brand, 0.4) : C.border}`,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 8,
              }}
            >
              {pillars.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: tint(netColor(p.net_sentiment), 0.06),
                    border: `1px solid ${tint(netColor(p.net_sentiment), 0.25)}`,
                    borderTop: `3px solid ${netColor(p.net_sentiment)}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                  }}
                >
                  <div style={{ fontSize: 13, color: C.textMut }}>
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 20,
                      fontWeight: 800,
                      color: netColor(p.net_sentiment),
                    }}
                  >
                    {fmtSigned(p.net_sentiment, "", 0)}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMut }}>
                    net sentiment · {fmt(p.count)} items ·{" "}
                    {fmtSigned(p.net_change_pts, " pts")} 2nd half vs 1st
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={SPLIT}>
            {[topThemes.slice(0, 4), topThemes.slice(4)].map((col) => (
              <div
                key={col[0]?.id ?? "empty"}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                {col.map((t) => (
                  <BarRow
                    key={t.id}
                    label={t.label}
                    value={t.count}
                    max={topThemes[0]?.count ?? 1}
                    href={signalHref(t.id, from)}
                    sub={`${fmtPct(t.share_negative)} negative · ${trendWords(t)}`}
                    color={negColor(t.share_negative)}
                  />
                ))}
              </div>
            ))}
          </div>
          <BaselineCaption>
            Trend within window: second half (
            {halfLabel(b.themes.themes[0].trend.second_half_dates)}) vs first
            half ({halfLabel(b.themes.themes[0].trend.first_half_dates)}), as a
            share of posts.
          </BaselineCaption>
        </div>
      </Tile>

      <div style={PAIRS}>
        <Tile
          title="What customers are saying"
          sub="The three largest themes this window, in customers' words (paraphrased)"
          prov="public"
        >
          {saying.map((t, i) => {
            const e = sayingEvidence[i];
            const sc = statusColor(t.status);
            return (
              <Link
                key={t.id}
                href={signalHref(t.id, from)}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: tint(sc, 0.05),
                  border: `1px solid ${tint(sc, 0.22)}`,
                  borderLeft: `3px solid ${sc}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15 }}>
                    {t.label}
                  </span>
                  <Status
                    value={t.status === "this_week" ? "this_week" : t.status}
                  />
                </div>
                <div
                  style={{ fontSize: 14, color: C.textSec, lineHeight: 1.5 }}
                >
                  {e?.summary}
                </div>
                <div style={{ fontSize: 12.5, color: C.textMut }}>
                  {fmt(t.count)} items · {e?.place}
                  {e ? ` · ${fmtDate(e.created_at)}` : ""}
                </div>
              </Link>
            );
          })}
        </Tile>

        <Tile
          title="Retention watchlist"
          sub="Closure intent in high-value tiers, routed to the RM"
          prov={["internal", "public"]}
          id="retention"
        >
          <Table
            head={[
              "Tier",
              "Customers with closure intent",
              "Top driver",
              "Owner",
              "Action",
            ]}
            align={["left", "right", "left", "left", "left"]}
            rows={internal.retention_watchlist.rows.map((r) => [
              r.tier,
              fmt(r.customers_with_closure_intent),
              r.top_driver,
              "RM",
              r.action,
            ])}
          />
          <div style={{ fontSize: 13.5, color: C.textSec }}>
            In public voice,{" "}
            <strong>{fmt(b.signals.closure_intent.count)}</strong> posts say the
            customer will close or has closed an account or card. For example:
          </div>
          {closureEx.map((e) => (
            <Link
              key={e.id}
              href={signalHref(e.themes[0], from)}
              style={{
                fontSize: 13.5,
                color: C.textSec,
                borderLeft: `2px solid ${C.red}`,
                paddingLeft: 10,
                textDecoration: "none",
              }}
            >
              {e.summary}{" "}
              <span style={{ color: C.textMut }}>
                ({e.place} · {fmtDate(e.created_at)})
              </span>
            </Link>
          ))}
        </Tile>
      </div>

      <div style={PAIRS}>
        <Tile
          title="Where is the struggle? Journey stages"
          sub={`${fmt(internal.journey_stages.total)} interactions mapped to journey stages (the same demo sample)`}
          prov="internal"
          id="journey"
        >
          <Table
            head={[
              "Stage",
              "Interactions",
              "Negative share",
              "Repeat contact",
              "Closure intent",
            ]}
            align={["left", "right", "right", "right", "right"]}
            rows={[
              ...internal.journey_stages.rows.map((r) => [
                r.stage,
                fmt(r.interactions),
                <span key="n" style={{ color: C.red }}>
                  {fmtPct(r.negative_share, 1)}
                </span>,
                <span key="r" style={{ color: C.amber }}>
                  {fmtPct(r.repeat_contact_share, 1)}
                </span>,
                fmt(r.closure_intent),
              ]),
              [
                <strong key="t">Total</strong>,
                <strong key="n">{fmt(internal.journey_stages.total)}</strong>,
                "",
                "",
                <strong key="c">
                  {fmt(
                    internal.journey_stages.rows.reduce(
                      (s, r) => s + r.closure_intent,
                      0,
                    ),
                  )}
                </strong>,
              ],
            ]}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <OwnerChip owner="cx" />
            <span style={{ fontSize: 12.5, color: C.textMut }}>
              Stage mapping and figures confirmed in discovery.{" "}
              {internal.journey_stages.rule}
            </span>
          </div>
        </Tile>

        <Tile
          title="Repeat contact by theme and business"
          sub="Public items where customers say they have raised it before, by business. Tap a bar to open the theme."
          prov="public"
          id="repeat"
        >
          {/* One row per theme, every theme labelled (the axis used to skip alternate labels). */}
          <div style={{ width: "100%", height: 90 + repeatChart.length * 38 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={repeatChart}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 24 }}
              >
                <CartesianGrid stroke={C.border} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: C.textMut, fontSize: 11 }}
                  allowDecimals={false}
                  label={{
                    value: "Items with repeat contact",
                    position: "insideBottom",
                    offset: -8,
                    fill: C.textDim,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="theme"
                  width={210}
                  interval={0}
                  tick={{ fill: C.textSec, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: C.tooltip,
                    color: C.text,
                    border: `1px solid ${C.borderLight}`,
                    fontSize: 12.5,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{
                    fontSize: 12,
                    color: C.textMut,
                    paddingBottom: 8,
                  }}
                  formatter={(v) => BUSINESS_LABEL[String(v)] ?? v}
                />
                {bizKeys.map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    stackId="a"
                    fill={SERIES[i % SERIES.length]}
                    cursor="pointer"
                    onClick={(d: unknown) => {
                      const id = (d as { payload?: { id?: string } }).payload
                        ?.id;
                      if (id) window.location.assign(signalHref(id, from));
                    }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Tile>
      </div>
      {tm.app_praise ? null : null}
    </div>
  );
}
