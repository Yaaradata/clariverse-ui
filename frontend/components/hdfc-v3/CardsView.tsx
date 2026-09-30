"use client";

/**
 * The Cards business-head view (30 Sep review, changes_30sep.md C). It follows the same period filter as the MD's view.
 * Top to bottom: the issue pulse (internal and external, side by side), the issue categories as an accordion, then the
 * three drill-downs that moved here from the MD's view, rebuilt for Cards only:
 *   1. Are my customers happy?      (was the satisfaction page)
 *   2. What is the market saying?   (was the market page)
 *   3. Service                      (was the deliverables page, without TAT compliance)
 * No deliverables ledger, no retention watch. Every figure comes from periods.json for the selected period.
 */

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import {
  type Category,
  type CategoryFigures,
  CHANNEL_LABEL,
  CHANNEL_ORDER,
  type Period,
  type Quote,
} from "@/lib/hdfc-v3/periods";
import type { Bundle } from "@/lib/hdfc-v3/types";
import {
  Dial,
  PeriodFilter,
  Sparkline,
  TrendChip,
  titled,
  usePeriod,
  withPeriod,
} from "./Pulse";
import {
  BarRow,
  C,
  Kpi,
  MONO,
  MutedNote,
  PAIRS,
  SentimentBar,
  SPLIT,
  Table,
  Tile,
  TrendLine,
  tint,
  WeeklyBars,
} from "./primitives";

const pct = (a: number | null | undefined, b: number) =>
  a === null || a === undefined || !b ? null : (100 * a) / b;

/** A short quote, or a matching-height placeholder so tiles in a row end at the same line. */
function QuoteLine({ q }: { q: Quote | null }) {
  return (
    <div
      style={{
        fontSize: 13,
        color: q ? C.textSec : C.textMut,
        borderLeft: `2px solid ${C.border}`,
        paddingLeft: 8,
        lineHeight: 1.45,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {q ? (
        <>
          &ldquo;{q.summary}&rdquo;
          <span style={{ color: C.textMut }}>
            {" "}
            · {q.source_label}, {fmtDate(q.date)}
          </span>
        </>
      ) : (
        "No quote in this period."
      )}
    </div>
  );
}

/** Section header for each drill-down. */
function Section({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        flexWrap: "wrap",
        paddingTop: 6,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: 700,
          color: C.brandInk,
          border: `1px solid ${tint(C.brand, 0.4)}`,
          borderRadius: 999,
          padding: "1px 9px",
        }}
      >
        Drill-down {n}
      </span>
      <h2 style={{ fontSize: 19, fontWeight: 750, margin: 0 }}>{title}</h2>
      <span style={{ fontSize: 13.5, color: C.textMut }}>{sub}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- C2 issue pulse */

function IssuePulse({ p }: { p: Period }) {
  const i = p.cards.internal;
  const e = p.cards.external;
  const hi = e.high_impact;
  const na = i.open_too_long === null;
  const box = {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "12px 12px",
    display: "grid",
    gap: 8,
    minWidth: 0,
  };
  return (
    <Tile
      id="issue-pulse"
      title={titled("Issue pulse: Cards", p)}
      sub="The bank's own Cards contacts and public voice about Cards, side by side. The same figures as the Cards card on the MD's view."
      prov={["internal", "public"]}
      tone="violet"
    >
      <div style={{ ...PAIRS, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <strong>Internal channels</strong>
          <div
            style={{ ...box, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          >
            <Dial
              value={100}
              color={C.violet}
              centre={fmt(i.volume)}
              big={fmt(i.volume)}
              label="Volume"
              sub={<TrendChip pct={i.change_pct} label={p.compare} />}
            />
            <Dial
              value={pct(i.resolved, i.volume)}
              color={C.green}
              big={fmt(i.resolved)}
              label="Resolved"
            />
            <Dial
              value={pct(i.open, i.volume)}
              color={C.amber}
              big={fmt(i.open)}
              label="Open"
            />
            <Dial
              value={pct(i.open_too_long, i.volume)}
              color={C.red}
              big={na ? "—" : fmt(i.open_too_long)}
              label="Open over 48 h"
              sub={na ? "needs 48 hours" : undefined}
            />
          </div>
          <div
            style={{
              ...box,
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              padding: "10px 12px",
            }}
          >
            <Kpi
              label="Negative"
              value={fmt(i.negative)}
              sub={`${fmtPct(pct(i.negative, i.volume))} of contacts`}
              tone="red"
            />
            <Kpi
              label="Escalated"
              value={fmt(i.escalations)}
              sub="to a grievance desk or beyond"
              tone="amber"
            />
            <Kpi
              label="TAT-related"
              value={fmt(p.cards.service_full.tat_related.contacts)}
              sub={`${fmtPct(p.cards.service_full.tat_related.share)} carry a delivery timeline`}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <strong>External channels</strong>
          <div
            style={{ ...box, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            <Dial
              value={100}
              color={C.cyan}
              centre={fmt(e.volume)}
              big={fmt(e.volume)}
              label="Volume"
              sub={<TrendChip pct={e.change_pct} label="stores and forums" />}
            />
            <Dial
              value={e.positive_share}
              color={C.green}
              big={`${fmt(e.positive)} / ${fmt(e.negative)}`}
              label="Positive / negative"
              sub={`${fmtPct(e.negative_share)} negative`}
            />
            <Dial
              value={pct(e.responded.responded, e.responded.reviews)}
              color={C.violet}
              big={
                e.responded.reviews
                  ? `${fmt(e.responded.responded)} of ${fmt(e.responded.reviews)}`
                  : "—"
              }
              label="Responded"
            />
          </div>
          <div
            style={{ ...box, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            <Dial
              value={100}
              color={C.amber}
              centre={fmt(hi.volume)}
              big={fmt(hi.volume)}
              label="High impact"
            />
            <Dial
              value={hi.positive_share}
              color={C.green}
              big={`${fmt(hi.positive)} / ${fmt(hi.negative)}`}
              label="High impact + / −"
            />
            <Dial
              value={pct(hi.responded.responded, hi.responded.reviews)}
              color={C.violet}
              big={
                hi.responded.reviews
                  ? `${fmt(hi.responded.responded)} of ${fmt(hi.responded.reviews)}`
                  : "—"
              }
              label="High impact responded"
            />
          </div>
        </div>
      </div>
      <MutedNote>
        Internal: emails, calls, chat, WhatsApp, social inbox and branch (IVR
        bot not counted); open over 48 hours = still open more than 48 hours
        after the contact came in. External: responded = a bank reply on a Play
        Store review (the only source with reply data); high impact = a post
        with reach; shares are source-weighted; trends use store reviews and
        forums only.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- C3 accordion */

function FigureCells({ f }: { f: CategoryFigures }) {
  const i = f.internal;
  const e = f.external;
  const cell = {
    fontFamily: MONO,
    fontSize: 13.5,
    textAlign: "right" as const,
  };
  return (
    <>
      <span style={cell}>{fmt(i.volume)}</span>
      <span style={cell}>{fmt(i.resolved)}</span>
      <span style={cell}>{fmt(i.open)}</span>
      <span style={cell}>
        {i.open_too_long === null ? "—" : fmt(i.open_too_long)}
      </span>
      <span style={cell}>{fmt(e.volume)}</span>
      <span style={cell}>
        {fmt(e.positive)} / {fmt(e.negative)}
      </span>
      <span style={cell}>
        {e.responded.reviews
          ? `${fmt(e.responded.responded)}/${fmt(e.responded.reviews)}`
          : "—"}
      </span>
      <span style={cell}>{fmt(e.high_impact.volume)}</span>
      <span style={{ ...cell, textAlign: "left" }}>
        <Sparkline
          values={f.trend.map((t) => t.internal + t.external)}
          color={C.violet}
          width={70}
        />
      </span>
      <span style={cell}>
        {fmt(e.escalation)} · {fmt(i.escalations)}
      </span>
    </>
  );
}

const GRID =
  "minmax(180px, 2.2fr) repeat(8, minmax(52px, 0.8fr)) minmax(74px, 1fr) minmax(64px, 0.8fr)";

function CategoryRow({ c, p }: { c: Category; p: Period }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${C.border}` }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        data-testid="category"
        style={{
          display: "grid",
          gridTemplateColumns: GRID,
          gap: 8,
          alignItems: "center",
          width: "100%",
          background: "transparent",
          border: "none",
          color: "inherit",
          padding: "10px 4px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14.5,
              display: "inline-flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}{" "}
            {c.label}
          </span>
          <span style={{ fontSize: 12, color: C.textMut }}>
            {c.owner}
            {c.tat_related ? " · TAT-related" : ""}
          </span>
        </span>
        <FigureCells f={c} />
      </button>
      {open
        ? c.subcategories.map((s) => (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                gap: 8,
                alignItems: "center",
                padding: "6px 4px 6px 26px",
                background: tint(C.violet, 0.04),
              }}
            >
              <span style={{ fontSize: 13.5, color: C.textSec }}>
                {s.label}
              </span>
              <FigureCells f={s} />
            </div>
          ))
        : null}
      {open && !c.subcategories.length ? (
        <div
          style={{ padding: "4px 26px 8px", fontSize: 12.5, color: C.textMut }}
        >
          Themes outside the named categories. {p.label}.
        </div>
      ) : null}
    </div>
  );
}

const HEAD: [string, string][] = [
  ["cat", "Category · owner"],
  ["ivol", "Volume"],
  ["ires", "Resolved"],
  ["iopen", "Open"],
  ["i48", "Open 48 h+"],
  ["evol", "Volume"],
  ["epn", "+ / −"],
  ["eresp", "Responded"],
  ["ehi", "High impact"],
  ["trend", "Trend"],
  ["esc", "Escalations"],
];

function Categories({ p }: { p: Period }) {
  return (
    <Tile
      id="categories"
      title={titled("Issues by category", p)}
      sub="Largest first. Open a category for its subcategories."
      prov={["internal", "public"]}
      style={{ minWidth: 0, maxWidth: "100%" }}
    >
      <div style={{ overflowX: "auto", maxWidth: "100%", minWidth: 0 }}>
        <div style={{ minWidth: 980 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: GRID,
              gap: 8,
              padding: "0 4px 6px",
              fontSize: 11.5,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span />
            <span style={{ gridColumn: "span 4", textAlign: "center" }}>
              Internal
            </span>
            <span style={{ gridColumn: "span 4", textAlign: "center" }}>
              External
            </span>
            <span />
            <span />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: GRID,
              gap: 8,
              padding: "0 4px 8px",
              fontSize: 12,
              color: C.textMut,
              fontWeight: 700,
            }}
          >
            {HEAD.map(([id, h]) => (
              <span
                key={id}
                style={{
                  textAlign: id === "cat" || id === "trend" ? "left" : "right",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {p.cards.categories.map((c) => (
            <CategoryRow key={c.id} c={c} p={p} />
          ))}
        </div>
      </div>
      <MutedNote>
        Each contact and each public item counts once, under its main theme, so
        the categories add up to the issue pulse. Trend: internal plus public
        volume over the last {p.cards.categories[0]?.trend.length ?? 0} periods
        of the same length. Escalations: public posts with escalation language ·
        internal contacts escalated to a grievance desk or beyond. TAT-related:
        the category carries a delivery timeline; compliance is not shown here.
        Owners are roles in the cards team.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- drill-down 1: are my customers happy? */

function Happy({ p }: { p: Period }) {
  const h = p.cards.happy;
  const m = p.cards.mood;
  const change =
    m.net_trend_current === null || m.net_trend_previous === null
      ? null
      : m.net_trend_current - m.net_trend_previous;
  const trend = h.weekly_net.map((x) => ({
    w: fmtDate(x.end),
    net: x.net === null ? null : Math.round(x.net),
  }));
  const avg = h.weekly_net.filter((x) => x.net !== null);
  const reference = avg.length
    ? avg.reduce((s, x) => s + (x.net ?? 0), 0) / avg.length
    : 0;
  return (
    <>
      <Section
        n={1}
        title="Are my customers happy?"
        sub="Public voice about Cards, source-weighted; the bank's own Cards contacts by list and stage."
      />
      <Tile
        id="happy-sources"
        title={titled("Sentiment by source", p)}
        sub="Net sentiment = positive share minus negative share. Each source is weighted by its share of the whole window, so a burst in one source cannot move the total."
        prov="public"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 8,
          }}
        >
          <Kpi
            label="Net sentiment"
            value={fmtSigned(m.net, "", 0)}
            sub={`${fmt(m.items)} public items about Cards`}
            tone={(m.net ?? 0) < 0 ? "red" : "green"}
          />
          <Kpi
            label="Change"
            value={fmtSigned(change, " pts", 0)}
            sub={p.compare}
            tone={(change ?? 0) < 0 ? "red" : "green"}
          />
          <Kpi
            label="Negative share"
            value={fmtPct(p.cards.external.negative_share)}
            sub="source-weighted"
            tone="amber"
          />
          <Kpi
            label="Sources"
            value={String(h.by_source.length)}
            sub={h.by_source.map((s) => s.label).join(", ")}
          />
        </div>
        <Table
          head={[
            "Source",
            "Items",
            "Positive",
            "Neutral",
            "Negative",
            "Net",
            "Weight",
            "Split",
          ]}
          align={[
            "left",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "left",
          ]}
          rows={h.by_source.map((s) => [
            s.label,
            fmt(s.items),
            fmt(s.positive),
            fmt(s.neutral),
            fmt(s.negative),
            fmtSigned(s.net, "", 0),
            fmtPct(s.weight_pct),
            <SentimentBar
              key="b"
              pos={s.positive}
              neu={s.neutral}
              neg={s.negative}
              legend={false}
            />,
          ])}
        />
      </Tile>

      <Tile
        id="happy-trend"
        title={titled("Sentiment trend", p)}
        sub={`Net sentiment of Cards public voice per ${p.id === "all" ? "week" : "period of the same length"}, source-weighted. Dashed line: the average of the points shown.`}
        prov="public"
      >
        <div style={SPLIT}>
          <TrendLine
            data={trend}
            xKey="w"
            yKey="net"
            reference={Math.round(reference)}
            referenceLabel="Average"
            height={230}
            yLabel="Net sentiment"
            xLabel="Period ending"
            domain={[-100, 100]}
          />
          <Table
            head={["Period ending", "Items", "Net"]}
            align={["left", "right", "right"]}
            rows={h.weekly_net.map((x) => [
              fmtDate(x.end),
              fmt(x.items),
              fmtSigned(x.net, "", 0),
            ])}
          />
        </div>
      </Tile>

      <Tile
        id="happy-saying"
        title={titled("What customers are saying", p)}
        sub="One anonymised quote for each of the largest negative Cards themes. Names are replaced by roles; quotes that make an allegation are not shown."
        prov="public"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
            gap: 10,
          }}
        >
          {h.saying.map((s) => (
            <div
              key={s.id}
              style={{
                background: C.cardAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                display: "grid",
                gridRow: "span 2",
                gridTemplateRows: "subgrid",
                rowGap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "baseline",
                }}
              >
                <strong style={{ fontSize: 14 }}>{s.label}</strong>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12.5,
                    color: C.textMut,
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmt(s.count)} items
                </span>
              </div>
              <QuoteLine q={s} />
            </div>
          ))}
          {h.saying.length === 0 ? (
            <MutedNote>No quotable public items in this period.</MutedNote>
          ) : null}
        </div>
      </Tile>

      <Tile
        id="happy-pillars"
        title={titled("Themes by trust pillar", p)}
        sub="Public voice about Cards by trust pillar: items, net sentiment and the top themes in each."
        prov="public"
      >
        <Table
          head={["Pillar", "Items", "Net sentiment", "Top themes"]}
          align={["left", "right", "right", "left"]}
          rows={p.cards.pillars.map((x) => [
            x.label,
            fmt(x.count),
            fmtSigned(x.net, "", 0),
            x.top.map((t) => `${t.label} (${fmt(t.count)})`).join(" · ") || "—",
          ])}
        />
      </Tile>

      <div style={{ ...PAIRS, alignItems: "start" }}>
        <Tile
          id="happy-journey"
          title={titled("Where contacts come from", p)}
          sub="The bank's own Cards contacts by journey stage."
          prov="internal"
        >
          <Table
            head={["Stage", "Contacts", "Negative", "Repeat"]}
            align={["left", "right", "right", "right"]}
            rows={p.cards.journey.map((j) => [
              j.stage,
              fmt(j.volume),
              fmtPct(j.negative_share),
              fmtPct(j.repeat_share),
            ])}
          />
        </Tile>
        <Tile
          id="happy-tiers"
          title={titled("Contacts by customer list", p)}
          sub="The bank's own Cards contacts by the Customer pulse lists, with their sentiment."
          prov="internal"
        >
          <Table
            head={["List", "Contacts", "Open", "Split"]}
            align={["left", "right", "right", "left"]}
            rows={h.tiers.map((t) => [
              t.label,
              fmt(t.volume),
              fmt(t.open),
              <SentimentBar
                key="b"
                pos={t.positive}
                neu={t.neutral}
                neg={t.negative}
                legend={false}
              />,
            ])}
          />
        </Tile>
      </div>

      <Tile
        id="happy-repeat"
        title={titled("Repeat contact by category", p)}
        sub="Customers who came back on the same issue: the bank's own contacts (a repeat within 30 days) and public posts that say it is not the first time."
        prov={["internal", "public"]}
      >
        {h.repeat_by_category.map((r) => (
          <BarRow
            key={r.id}
            label={r.label}
            value={r.internal_repeat + r.public_repeat}
            max={Math.max(
              1,
              ...h.repeat_by_category.map(
                (x) => x.internal_repeat + x.public_repeat,
              ),
            )}
            color={C.amber}
            sub={`${fmt(r.internal_repeat)} internal repeats of ${fmt(r.contacts)} contacts · ${fmt(r.public_repeat)} public`}
          />
        ))}
      </Tile>
    </>
  );
}

/* ---------------------------------------------------------------- drill-down 2: what is the market saying? */

function Market({ p }: { p: Period }) {
  const mk = p.cards.market_full;
  const r = mk.reach;
  const s = mk.safety;
  const topSix = mk.themes.slice(0, 6);
  return (
    <>
      <Section
        n={2}
        title="What is the market saying about us?"
        sub="Every public Cards theme in the period, what is rising, who has reach, and the stores."
      />
      <Tile
        id="market-themes"
        title={titled("All Cards themes in public voice", p)}
        sub="Each item once, under its main theme. Share of voice is source-weighted; its change is against the comparison window."
        prov="public"
      >
        <Table
          head={[
            "Theme",
            "Items",
            "Negative",
            "Negative share",
            "Escalation language",
            "Share of voice",
          ]}
          align={["left", "right", "right", "right", "right", "right"]}
          rows={mk.themes
            .slice(0, 12)
            .map((t) => [
              t.label,
              fmt(t.count),
              fmt(t.negative),
              fmtPct(t.negative_share),
              fmt(t.escalation),
              t.share_change_pct === null ? "—" : fmtSigned(t.share_change_pct),
            ])}
        />
        {mk.themes.length > 12 ? (
          <MutedNote>
            {fmt(mk.themes.length - 12)} smaller themes not listed.
          </MutedNote>
        ) : null}
      </Tile>

      <Tile
        id="market-topsix"
        title={titled("Top six Cards themes: share of voice", p)}
        sub={`Each theme's source-weighted share of Cards public voice, per ${p.id === "all" ? "week" : "period of the same length"}.`}
        prov="public"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: 10,
          }}
        >
          {topSix.map((t) => (
            <div
              key={t.id}
              style={{
                background: C.cardAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                display: "grid",
                gridRow: "span 2",
                gridTemplateRows: "subgrid",
                rowGap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 650 }}>{t.label}</span>
                <span style={{ fontFamily: MONO, fontWeight: 700 }}>
                  {fmt(t.count)}
                </span>
              </div>
              <WeeklyBars
                data={t.weekly.map((w) => ({
                  week: w.end,
                  count: w.count,
                  share: w.share,
                }))}
                height={120}
              />
            </div>
          ))}
        </div>
      </Tile>

      <div style={{ ...PAIRS, alignItems: "start" }}>
        <Tile
          id="market-rising"
          title={titled("Rising themes", p)}
          sub={`Cards themes whose share of voice grew the most, ${p.compare}.`}
          prov="public"
        >
          {mk.rising.length ? (
            mk.rising.map((t) => (
              <BarRow
                key={t.id}
                label={t.label}
                value={t.share_change_pct ?? 0}
                max={Math.max(
                  1,
                  ...mk.rising.map((x) => x.share_change_pct ?? 0),
                )}
                color={C.amber}
                right={
                  <span style={{ fontFamily: MONO, fontWeight: 700 }}>
                    {fmtSigned(t.share_change_pct)}
                  </span>
                }
                sub={`${fmt(t.count)} items · ${fmt(t.negative)} negative`}
              />
            ))
          ) : (
            <MutedNote>
              No theme rose in this period (too few items, or no earlier
              period).
            </MutedNote>
          )}
        </Tile>
        <Tile
          id="market-safety"
          title={titled("Safety and reputation watch", p)}
          sub="Fraud, phishing, security blocks and collection conduct, on Cards."
          prov={["internal", "public"]}
          tone="red"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            <Kpi
              label="Public posts"
              value={fmt(s.public)}
              sub={`${fmt(s.public_negative)} negative · ${fmt(s.public_escalation)} escalation language`}
              tone="red"
            />
            <Kpi
              label="With reach"
              value={fmt(s.high_impact)}
              sub="high-impact public posts"
              tone="amber"
            />
            <Kpi
              label="Internal contacts"
              value={fmt(s.internal)}
              sub={`${fmt(s.internal_open)} still open`}
            />
            <Kpi
              label="High-impact complaints"
              value={fmt(s.internal_high_impact)}
              sub="regulator named, legal language, public reach"
            />
          </div>
          <div style={{ fontSize: 13.5, color: C.textSec }}>
            Top:{" "}
            {s.top.map((t) => `${t.label} (${fmt(t.count)})`).join(" · ") ||
              "—"}
          </div>
        </Tile>
      </div>

      <Tile
        id="market-reach"
        title={titled("Voices with reach", p)}
        sub="Cards posts with reach: an X account with 10,000+ followers, or 50+ likes or 20+ reposts; a Reddit post with 50+ upvotes; a store review 20+ people found helpful. Anonymised: no accounts are shown."
        prov="public"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 8,
          }}
        >
          <Kpi
            label="Posts with reach"
            value={fmt(r.volume)}
            sub={
              Object.entries(r.by_source)
                .map(([k, v]) => `${k} ${fmt(v)}`)
                .join(" · ") || "none"
            }
            tone="amber"
          />
          <Kpi
            label="Positive / negative"
            value={`${fmt(r.positive)} / ${fmt(r.negative)}`}
            sub="of the posts with reach"
          />
          <Kpi
            label="Escalation language"
            value={fmt(r.escalation)}
            sub="among posts with reach"
            tone="red"
          />
          <Kpi
            label="Responded"
            value={
              r.responded.reviews
                ? `${fmt(r.responded.responded)} of ${fmt(r.responded.reviews)}`
                : "—"
            }
            sub="Play Store reviews only"
          />
          <Kpi
            label="Top themes"
            value={r.top_themes[0]?.label ?? "—"}
            sub={
              r.top_themes
                .slice(1)
                .map((t) => t.label)
                .join(" · ") || ""
            }
          />
        </div>
      </Tile>

      <Tile
        id="market-stores"
        title={titled("App pulse: Cards reviews by store", p)}
        sub="One store at a time. Top complaints, feature requests and the existing features customers praise."
        prov="public"
      >
        <div style={SPLIT}>
          {p.cards.stores.map((st) => (
            <div
              key={st.store}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 0,
              }}
            >
              <strong>
                {st.label}: {fmt(st.reviews)} Cards reviews
                {st.avg_rating === null
                  ? ""
                  : ` · ${st.avg_rating.toFixed(1)}★`}
              </strong>
              <Table
                head={["", "Top three"]}
                align={["left", "left"]}
                rows={[
                  [
                    "Complaints",
                    st.complaints
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "—",
                  ],
                  [
                    "Feature requests",
                    st.feature_requests
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "none named",
                  ],
                  [
                    "Existing features praised",
                    st.praised
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "—",
                  ],
                ]}
              />
              {st.reviews < 5 ? (
                <MutedNote>
                  Too few Cards reviews on this store in this period to read
                  much into.
                </MutedNote>
              ) : (
                <MutedNote>
                  Reviews tagged to Cards on this store in the period.
                </MutedNote>
              )}
            </div>
          ))}
        </div>
      </Tile>
    </>
  );
}

/* ---------------------------------------------------------------- drill-down 3: service */

function Service({ p }: { p: Period }) {
  const sv = p.cards.service_full;
  const sr = p.cards.service;
  const ladderMax = Math.max(1, sv.ladder[0]?.count ?? 1);
  const three = { display: "flex", flexDirection: "column" as const, gap: 10 };
  return (
    <>
      <Section
        n={3}
        title="Service"
        sub="How Cards contacts are handled, where they escalate, and which timelines customers say were missed. No TAT compliance figures."
      />
      <Tile
        id="service-handling"
        title={titled("How Cards contacts were handled", p)}
        sub="The bank's own Cards contacts in the period."
        prov="internal"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 8,
          }}
        >
          <Kpi
            label="Resolved"
            value={fmtPct(pct(sr.resolved, sr.volume))}
            sub={`${fmt(sr.resolved)} of ${fmt(sr.volume)} contacts`}
            tone="green"
          />
          <Kpi
            label="Open over 48 h"
            value={sr.open_too_long === null ? "—" : fmt(sr.open_too_long)}
            sub={sr.open_too_long === null ? "needs 48 hours" : "still open"}
            tone="red"
          />
          <Kpi
            label="First written reply"
            value={
              sr.median_first_response_hours_written === null
                ? "—"
                : `${sr.median_first_response_hours_written} h`
            }
            sub="median, email / WhatsApp / social"
          />
          <Kpi
            label="TAT-related contacts"
            value={fmt(sv.tat_related.contacts)}
            sub={`${fmtPct(sv.tat_related.share)} of contacts · ${fmt(sv.tat_related.open)} open`}
            tone="amber"
          />
          <Kpi
            label="Service complaints in public"
            value={fmt(sr.public_service_negative)}
            sub="negative posts about service"
            tone="red"
          />
        </div>
      </Tile>

      <Tile
        id="service-ladder"
        title={titled("Escalation ladder", p)}
        sub="Hear it on the first rung. Left: the bank's own Cards contacts, and how far they climbed. Right: public Cards posts with escalation language, by who they name."
        prov={["internal", "public"]}
        tone="red"
      >
        <div style={SPLIT}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sv.ladder.map((x) => (
              <BarRow
                key={x.rung}
                label={x.rung}
                value={x.count}
                max={ladderMax}
                color={
                  x.rung === "Contacts"
                    ? C.violet
                    : x.rung === "Repeat"
                      ? C.amber
                      : C.red
                }
              />
            ))}
            <div style={{ fontSize: 12.5, color: C.textMut }}>
              Each rung counts every contact that reached at least that rung.
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 4,
              }}
            >
              Public posts with escalation language: {fmt(sv.public_escalation)}
            </div>
            <Table
              head={["Who they name", "Posts"]}
              align={["left", "right"]}
              rows={
                sv.targets.length
                  ? sv.targets.map((t) => [t.label, fmt(t.count)])
                  : [["None in this period", "—"]]
              }
            />
          </div>
        </div>
      </Tile>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        <Tile
          id="service-closure"
          title={titled("Closure intent", p)}
          sub="Customers saying they will close or leave."
          prov={["internal", "public"]}
          tone="red"
        >
          <div style={three}>
            <Kpi
              label="Public posts"
              value={fmt(sv.closure.public_intent)}
              sub="say they will close the card or leave"
              tone="red"
            />
            <div style={{ fontSize: 13.5, color: C.textSec }}>
              Closure requests to the bank:{" "}
              <strong style={{ color: C.text }}>
                {fmt(sv.closure.internal_requests)}
              </strong>
              , {fmt(sv.closure.internal_open)} still open.
            </div>
            <QuoteLine q={sv.closure.quote} />
          </div>
        </Tile>
        <Tile
          id="service-cure"
          title={titled("Cure watch", p)}
          sub="Negative posts where a fix would turn the customer around."
          prov="public"
          tone="amber"
        >
          <div style={three}>
            <Kpi
              label="Public posts"
              value={fmt(sv.cure.count)}
              sub="fixable, in the customer's own words"
              tone="amber"
            />
            <div style={{ fontSize: 13.5, color: C.textSec }}>
              Top:{" "}
              {sv.cure.top
                .map((t) => `${t.label} (${fmt(t.count)})`)
                .join(" · ") || "—"}
            </div>
            <QuoteLine q={sv.cure.quote} />
          </div>
        </Tile>
        <Tile
          id="service-transparency"
          title={titled("Transparency gap", p)}
          sub="Customers asking where something is."
          prov="public"
          tone="amber"
        >
          <div style={three}>
            <Kpi
              label="Public posts"
              value={fmt(sv.transparency.count)}
              sub={`${fmtPct(sv.transparency.share)} of Cards posts, source-weighted`}
              tone="amber"
            />
            <div style={{ fontSize: 13.5, color: C.textSec }}>
              A status message would answer these before the customer asks.
            </div>
            <QuoteLine q={sv.transparency.quote} />
          </div>
        </Tile>
      </div>

      <div style={{ ...PAIRS, alignItems: "start" }}>
        <Tile
          id="service-disputes"
          title={titled("Dispute recovery funnel", p)}
          sub="Card disputes raised with the bank in the period. Each stage is a subset of the one before."
          prov="internal"
        >
          {sv.disputes.map((d) => (
            <BarRow
              key={d.stage}
              label={d.stage}
              value={d.count}
              max={Math.max(1, sv.disputes[0]?.count ?? 1)}
              color={C.violet}
            />
          ))}
          <MutedNote>
            Credited: closed with money back to the customer.
          </MutedNote>
        </Tile>
        <Tile
          id="service-failures"
          title={titled("Top service failures", p)}
          sub="Cards themes with the most negative public items."
          prov="public"
          tone="red"
        >
          {sv.failures.slice(0, 4).map((f) => (
            <BarRow
              key={f.id}
              label={f.label}
              value={f.negative}
              max={Math.max(1, sv.failures[0]?.negative ?? 1)}
              color={C.red}
              sub={`${fmt(f.count)} items · ${fmt(f.escalation)} with escalation language`}
            />
          ))}
          <MutedNote>
            Negative public items, each counted once under its main theme.
          </MutedNote>
        </Tile>
      </div>

      <Tile
        id="service-timelines"
        title={titled("Timelines customers say were missed", p)}
        sub="Public Cards posts describing a missed timeline, by the request it concerned. Heard in public; not a compliance figure."
        prov="public"
      >
        <div style={SPLIT}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            <Kpi
              label="Posts"
              value={fmt(sv.missed_timelines.total)}
              sub="describe a missed timeline"
              tone="red"
            />
            <Kpi
              label="Request types"
              value={String(sv.missed_timelines.rows.length)}
              sub="named in those posts"
            />
          </div>
          <Table
            head={["Request type", "Posts"]}
            align={["left", "right"]}
            rows={
              sv.missed_timelines.rows.length
                ? sv.missed_timelines.rows.map((r) => [r.label, fmt(r.count)])
                : [["None in this period", "—"]]
            }
          />
        </div>
      </Tile>
    </>
  );
}

/* ---------------------------------------------------------------- volume by channel */

function Channels({ p }: { p: Period }) {
  const ch = p.cards.channels;
  return (
    <Tile
      id="channels"
      title={titled("Volume by channel", p)}
      sub="The bank's own Cards contacts by channel, and public Cards items by source."
      prov={["internal", "public"]}
    >
      <div style={SPLIT}>
        <Table
          head={["Internal channel", "Contacts"]}
          align={["left", "right"]}
          rows={CHANNEL_ORDER.map((c) => [
            CHANNEL_LABEL[c],
            fmt(ch.internal[c] ?? 0),
          ])}
        />
        <Table
          head={["Public source", "Items"]}
          align={["left", "right"]}
          rows={Object.entries(ch.external).map(([k, v]) => [k, fmt(v)])}
        />
      </div>
    </Tile>
  );
}

/* ---------------------------------------------------------------- C5 actions */

function CardsActions({ p }: { p: Period }) {
  const ranked = [...p.cards.categories]
    .filter((c) => c.id !== "other")
    .map((c) => ({
      c,
      score:
        (c.internal.open_too_long ?? c.internal.open) + c.external.escalation,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return (
    <Tile
      id="actions"
      title={titled("Actions to take", p)}
      sub="The three categories with the most cases open over 48 hours plus escalation language."
      prov={["internal", "public"]}
      tone="red"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 10,
        }}
      >
        {ranked.map(({ c }) => (
          <div
            key={c.id}
            data-testid="action-card"
            style={{
              background: C.cardAlt,
              border: `1px solid ${tint(C.red, 0.3)}`,
              borderLeft: `3px solid ${C.red}`,
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <strong>{c.label}</strong>
            <span style={{ fontSize: 13.5, color: C.textSec }}>
              {c.internal.open_too_long === null
                ? `${fmt(c.internal.open)} contacts still open`
                : `${fmt(c.internal.open_too_long)} contacts open over 48 hours`}
              ; {fmt(c.external.escalation)} public posts with escalation
              language.
            </span>
            <span style={{ fontSize: 12.5, color: C.textMut }}>
              Owner: {c.owner} · recommended: route with evidence
            </span>
          </div>
        ))}
      </div>
      <MutedNote>
        Recommendations, routed to the owner. LisN never executes, authorises or
        decides.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- view */

function Contents(): ReactNode {
  const items: [string, string][] = [
    ["#issue-pulse", "Issue pulse"],
    ["#categories", "By category"],
    ["#happy-sources", "1 · Are my customers happy?"],
    ["#market-themes", "2 · What is the market saying?"],
    ["#service-handling", "3 · Service"],
    ["#actions", "Actions"],
  ];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 13 }}>
      {items.map(([href, label]) => (
        <a
          key={href}
          href={href}
          style={{
            color: C.textSec,
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            padding: "2px 10px",
            textDecoration: "none",
          }}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export function CardsView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PeriodFilter file={b.periods} current={p} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link
          href={withPeriod("/hdfc-pulse/v2/mds-office", p)}
          style={{ color: C.brandInk, fontSize: 13.5 }}
        >
          ← MD&apos;s office / Head of CX
        </Link>
        <Contents />
      </div>
      <IssuePulse p={p} />
      <Categories p={p} />
      <Happy p={p} />
      <Market p={p} />
      <Service p={p} />
      <Channels p={p} />
      <CardsActions p={p} />
    </div>
  );
}

/** Every other product: its business view is not built yet (30 Sep review scope: Cards only). */
export function ComingSoon({ label }: { label: string }) {
  return (
    <Tile title={`${label}: business view`} prov="internal">
      <MutedNote>
        Coming soon. The Cards business view is the first; the others follow the
        same layout once it is agreed.
      </MutedNote>
      <Link
        href="/hdfc-pulse/v2/business/cards"
        style={{ color: C.brandInk, fontSize: 14 }}
      >
        Open the Cards business view
      </Link>
    </Tile>
  );
}
