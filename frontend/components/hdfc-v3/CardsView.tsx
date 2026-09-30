"use client";

/**
 * The Cards business-head view (30 Sep review, changes_30sep.md C). It follows the same period filter as the MD's view
 * (the filter sits in the header). Top to bottom: the issue pulse (internal and external, side by side), the issue
 * categories as an accordion, then three question cards, one per drill-down, each opening its own page:
 *   1. Are my customers happy?             /business/cards/happy    (was the satisfaction page)
 *   2. What is the market saying about us? /business/cards/market   (was the market page)
 *   3. Are we keeping our timelines?       /business/cards/service  (was the deliverables page, without TAT compliance)
 * No deliverables ledger, no retention watch. Every figure comes from periods.json for the selected period.
 */

import {
  Activity,
  ChevronDown,
  ChevronRight,
  Shield,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import type { DrillDownId } from "@/lib/hdfc-v3/drilldowns";
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
  Sparkline,
  TrendChip,
  titled,
  usePeriod,
  withPeriod,
} from "./Pulse";
import {
  BarRow,
  BaselineCaption,
  C,
  cols,
  HalfGauge,
  Kpi,
  MONO,
  MutedNote,
  PAIRS,
  ProvenanceTag,
  SentimentBar,
  SPLIT,
  Table,
  Tile,
  type Tone,
  TrendLine,
  tint,
  WeeklyBars,
} from "./primitives";

const pct = (a: number | null | undefined, b: number) =>
  a === null || a === undefined || !b ? null : (100 * a) / b;

const CARDS = "/hdfc-pulse/v2/business/cards";

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
              value={pct(hi.escalation, hi.volume)}
              color={C.red}
              big={
                hi.volume
                  ? `${fmt(hi.escalation)} of ${fmt(hi.volume)}`
                  : "No high-impact posts"
              }
              label="High impact with escalation language"
            />
          </div>
        </div>
      </div>
      <MutedNote>
        Internal: emails, calls, chat, WhatsApp, social inbox and branch (IVR
        bot not counted); open over 48 hours = still open more than 48 hours
        after the contact came in. External: responded = a bank reply on a Play
        Store review (the only source with reply data); high impact = a post
        with reach, almost all on X and Reddit, which carry no reply data, so
        high impact shows escalation language (RBI or ombudsman, consumer court,
        legal action, ministers or the grievance cell) instead; shares are
        source-weighted; trends use store reviews and forums only.
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

/* ---------------------------------------------------------------- question cards (the drill-down entries) */

function QuestionCard({
  href,
  icon,
  title,
  micro,
  answer,
  headline,
  headlineLabel,
  caption,
  gauges,
  stats,
  saying,
  prov,
  accent,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  micro: string;
  answer: string;
  headline: string;
  headlineLabel: string;
  caption: string;
  gauges: { label: string; value: number; sub: string; tone?: Tone }[];
  stats: { label: string; value: string; sub: string; color?: string }[];
  saying: string;
  prov: ("public" | "internal")[];
  accent: string;
}) {
  return (
    <section
      data-testid="tile"
      style={{
        background: C.card,
        border: `1px solid ${tint(accent, 0.25)}`,
        borderRadius: 16,
        padding: "18px 18px 14px",
        // Subgrid: title, answer, headline, stats, quote and tags line up across the three cards (layout rule B).
        display: "grid",
        gridRow: "span 6",
        gridTemplateRows: "subgrid",
        rowGap: 12,
        alignContent: "start",
        minWidth: 0,
        boxShadow: `0 8px 32px ${tint(accent, 0.08)}`,
      }}
    >
      <Link
        href={href}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: tint(accent, 0.12),
            color: accent,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 16.5,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 12.5, color: C.textMut, marginTop: 2 }}>
            {micro}
          </div>
        </div>
        <ChevronRight size={20} color={C.textDim} />
      </Link>
      <p
        style={{ margin: 0, fontSize: 14.5, color: C.textSec, lineHeight: 1.5 }}
      >
        {answer}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <div
            style={{
              fontSize: 12.5,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {headlineLabel}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontFamily: MONO,
              color: C.text,
              lineHeight: 1.1,
              marginTop: 2,
            }}
          >
            {headline}
          </div>
          <BaselineCaption>{caption}</BaselineCaption>
        </Link>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {gauges.map((g) => (
            <HalfGauge
              key={g.label}
              label={g.label}
              value={g.value}
              sub={g.sub}
              tone={g.tone}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 10,
        }}
      >
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={href}
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: i === 1 ? "right" : "left",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: s.color ?? C.text,
                marginTop: 3,
                lineHeight: 1.3,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: C.textMut, marginTop: 2 }}>
              {s.sub}
            </div>
          </Link>
        ))}
      </div>
      <div
        style={{
          background: tint(accent, 0.055),
          border: `1px solid ${tint(accent, 0.22)}`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={13} color={accent} />
          What customers are saying
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: C.textSec,
            lineHeight: 1.5,
          }}
        >
          {saying}
        </p>
      </div>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", alignSelf: "end" }}
      >
        {prov.map((x) => (
          <ProvenanceTag key={x} kind={x} />
        ))}
      </div>
    </section>
  );
}

function QuestionCards({ p }: { p: Period }) {
  const c = p.cards;
  const m = c.mood;
  const h = c.happy;
  const mk = c.market_full;
  const sv = c.service_full;
  const change =
    m.net_trend_current === null || m.net_trend_previous === null
      ? null
      : m.net_trend_current - m.net_trend_previous;
  const topPain = mk.themes.slice().sort((a, b) => b.negative - a.negative)[0];
  const riser = mk.rising[0];
  const play = c.stores.find((s) => s.store === "playstore");
  const ios = c.stores.find((s) => s.store === "appstore");
  const riserQuote =
    h.saying.find((s) => riser && s.id === riser.id) ?? h.saying[0];
  const repeatShare = pct(
    c.friction.reduce((s, f) => s + f.escalation_internal, 0),
    1,
  ); // placeholder replaced below
  void repeatShare;
  const internalRepeat = h.repeat_by_category.reduce(
    (s, r) => s + r.internal_repeat,
    0,
  );
  const href = (id: DrillDownId) => withPeriod(`${CARDS}/${id}`, p);
  return (
    <div
      data-testid="question-cards"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, max(340px, calc((100% - 28px) / 3))), 1fr))",
        gap: 14,
      }}
    >
      <QuestionCard
        href={href("happy")}
        accent={C.violet}
        icon={<Activity size={18} />}
        title="Are my customers happy?"
        micro="Sentiment · Trust pillars · Top pain"
        answer={`Net sentiment of Cards public voice is ${fmtSigned(m.net, "", 0)} (${fmtSigned(change, " pts", 0)} ${p.compare}), source-weighted. ${topPain ? `${topPain.label} draws the most negative posts.` : ""}`}
        headlineLabel="Net sentiment"
        headline={fmtSigned(m.net, "", 0)}
        caption={`${fmt(m.items)} public items about Cards in the period. Positive share minus negative share, each source weighted by its share of the window.`}
        gauges={[
          {
            label: "Positive share",
            value: c.external.positive_share ?? 0,
            sub: "of Cards public voice",
            tone: "green",
          },
          {
            label: "Resolved",
            value: pct(c.internal.resolved, c.internal.volume) ?? 0,
            sub: "of the bank's Cards contacts",
            tone: "green",
          },
        ]}
        stats={[
          {
            label: "Top pain",
            value: topPain?.label ?? "—",
            sub: `${fmt(topPain?.negative)} negative items`,
            color: C.red,
          },
          {
            label: "Closure intent",
            value: `${fmt(sv.closure.public_intent)} posts`,
            sub: "customers saying they will close or leave",
          },
        ]}
        saying={
          h.saying[0]?.summary ?? "No quotable public item in this period."
        }
        prov={["public", "internal"]}
      />
      <QuestionCard
        href={href("market")}
        accent={C.cyan}
        icon={<Shield size={18} />}
        title="What is the market saying about us?"
        micro="Themes · Rising · App pulse"
        answer={`${riser ? `${riser.label} is rising fastest (share of voice ${fmtSigned(riser.share_change_pct)} ${p.compare}).` : "No Cards theme is rising by the 30% rule in this period."} ${mk.reach.volume ? `${fmt(mk.reach.volume)} posts with reach.` : "No posts with reach."}`}
        headlineLabel="Public posts and reviews"
        headline={fmt(c.external.volume)}
        caption={`About Cards, in the period: X, Reddit, forums, Play Store, App Store. ${fmt(c.external.escalation)} use escalation language.`}
        gauges={[
          {
            label: "Play Store",
            value: play?.share_positive ?? 0,
            sub: `4–5★ share · ${fmt(play?.reviews)} reviews`,
            tone: "amber",
          },
          {
            label: "App Store",
            value: ios?.share_positive ?? 0,
            sub: `4–5★ share · ${fmt(ios?.reviews)} reviews`,
            tone: "amber",
          },
        ]}
        stats={[
          {
            label: "Rising theme",
            value: riser?.label ?? "—",
            sub: riser ? `${fmt(riser.count)} items` : "none by the rule",
            color: C.amber,
          },
          {
            label: "High impact",
            value: `${fmt(mk.reach.volume)} posts`,
            sub: `${fmt(mk.reach.negative)} negative · ${fmt(mk.reach.escalation)} escalation language`,
            color: C.red,
          },
        ]}
        saying={
          riserQuote?.summary ?? "No quotable public item in this period."
        }
        prov={["public"]}
      />
      <QuestionCard
        href={href("service")}
        accent={C.amber}
        icon={<Timer size={18} />}
        title="Are we keeping our timelines?"
        micro="Missed timelines · Status-seeking · Escalation"
        answer={`${fmt(sv.missed_timelines.total)} public Cards posts describe a missed timeline; ${fmt(sv.transparency.count)} ask where something is; ${fmt(sv.public_escalation)} use escalation language.`}
        headlineLabel="Missed timelines heard"
        headline={fmt(sv.missed_timelines.total)}
        caption={`Public posts in the period, by request type on the drill-down. Inside the bank: ${c.internal.open_too_long === null ? "open over 48 hours needs 48 hours" : `${fmt(c.internal.open_too_long)} Cards contacts open over 48 hours`}.`}
        gauges={[
          {
            label: "Repeat contact",
            value: pct(internalRepeat, c.internal.volume) ?? 0,
            sub: "of the bank's Cards contacts",
            tone: "red",
          },
          {
            label: "Asking status",
            value: sv.transparency.share ?? 0,
            sub: "of Cards public posts",
            tone: "amber",
          },
        ]}
        stats={[
          {
            label: "Escalation language",
            value: `${fmt(sv.public_escalation)} posts`,
            sub: sv.targets[0]
              ? `most name ${sv.targets[0].label.toLowerCase()}`
              : "public voice",
            color: C.red,
          },
          {
            label: "TAT-related contacts",
            value: fmt(sv.tat_related.contacts),
            sub: `${fmtPct(sv.tat_related.share)} of Cards contacts · ${fmt(sv.tat_related.open)} open`,
            color: C.amber,
          },
        ]}
        saying={
          sv.transparency.quote?.summary ??
          sv.closure.quote?.summary ??
          "No quotable public item in this period."
        }
        prov={["public", "internal"]}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- drill-down 1: are my customers happy? */

/** Keeps the repeat-contact list level with the two tables beside it; the rest scrolls. */
const REPEAT_LIST_HEIGHT = 222;
/** The weekly table beside the trend chart scrolls at the chart's height. */
const TREND_HEIGHT = 260;

export function Happy({ p }: { p: Period }) {
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
      <div style={cols(3, 320, 14)}>
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

        <Tile
          id="happy-repeat"
          title={titled("Repeat contact by category", p)}
          sub="Customers who came back on the same issue: the bank's own contacts (a repeat within 30 days) and public posts that say it is not the first time."
          prov={["internal", "public"]}
        >
          <div
            data-testid="repeat-scroll"
            style={{
              maxHeight: REPEAT_LIST_HEIGHT,
              overflowY: "auto",
              paddingRight: 6,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
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
          </div>
        </Tile>
      </div>

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
            height={TREND_HEIGHT}
            yLabel="Net sentiment"
            xLabel="Period ending"
            domain={[-100, 100]}
          />
          <div style={{ maxHeight: TREND_HEIGHT, overflowY: "auto" }}>
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
              "repeat(auto-fit, minmax(min(100%, max(360px, calc((100% - 20px) / 3))), 1fr))",
            gap: 10,
          }}
        >
          {h.saying.slice(0, 3).map((s) => (
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
    </>
  );
}

/* ---------------------------------------------------------------- drill-down 2: what is the market saying? */

export function Market({ p }: { p: Period }) {
  const mk = p.cards.market_full;
  const r = mk.reach;
  const s = mk.safety;
  const topSix = mk.themes.slice(0, 6);
  return (
    <>
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
              "repeat(auto-fit, minmax(min(100%, max(360px, calc((100% - 20px) / 3))), 1fr))",
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
                  : ` · ${st.avg_rating.toFixed(1)}★ · ${fmtPct(st.share_positive)} 4–5★`}
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

export function Service({ p }: { p: Period }) {
  const sv = p.cards.service_full;
  const sr = p.cards.service;
  const ladderMax = Math.max(1, sv.ladder[0]?.count ?? 1);
  const three = { display: "flex", flexDirection: "column" as const, gap: 10 };
  return (
    <>
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

/* ---------------------------------------------------------------- views */

export function CardsView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <IssuePulse p={p} />
      <Categories p={p} />
      <QuestionCards p={p} />
      <Channels p={p} />
      <CardsActions p={p} />
    </div>
  );
}

/** A drill-down page: the section only; the period is set in the header. */
export function CardsDrillDown({ b, id }: { b: Bundle; id: DrillDownId }) {
  const p = usePeriod(b.periods);
  const Body = id === "happy" ? Happy : id === "market" ? Market : Service;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Body p={p} />
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
      <Link href={CARDS} style={{ color: C.brandInk, fontSize: 14 }}>
        Open the Cards business view
      </Link>
    </Tile>
  );
}
