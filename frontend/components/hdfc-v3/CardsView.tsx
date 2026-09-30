"use client";

/**
 * The Cards business-head view (30 Sep review, changes_30sep.md C). It follows the same period filter as the MD's view:
 * the issue pulse (internal and external, side by side), the issue categories as an accordion, then the drill-downs that
 * moved here from the MD's view, scoped to Cards. No deliverables, no retention watch.
 */

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { fmt, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import {
  type Category,
  type CategoryFigures,
  CHANNEL_LABEL,
  CHANNEL_ORDER,
  type Period,
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
import { C, MONO, MutedNote, Table, Tile, tint } from "./primitives";

const pct = (a: number | null | undefined, b: number) =>
  a === null || a === undefined || !b ? null : (100 * a) / b;

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
      sub="The bank's own Cards contacts and public voice about Cards, side by side."
      prov={["internal", "public"]}
      tone="violet"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
          gap: 12,
        }}
      >
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
              display: "flex",
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

function Categories({ p }: { p: Period }) {
  const head: [string, string][] = [
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
            {head.map(([id, h]) => (
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

/* ---------------------------------------------------------------- C4 moved-in sections */

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "8px 10px",
        minWidth: 0,
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
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 750 }}>
        {value}
      </div>
      {sub ? (
        <div style={{ fontSize: 12.5, color: C.textSec }}>{sub}</div>
      ) : null}
    </div>
  );
}

const TWO = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
  gap: 16,
};
const STATS = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 8,
};

function Happy({ p }: { p: Period }) {
  const m = p.cards.mood;
  return (
    <Tile
      title={titled("Are my customers happy?", p)}
      sub="Net sentiment of public voice about Cards, source-weighted."
      prov="public"
    >
      <div style={STATS}>
        <Stat
          label="Net sentiment"
          value={fmtSigned(m.net, "", 0)}
          sub={`${fmt(m.items)} public items`}
        />
        <Stat
          label="Change"
          value={
            m.net_trend_current === null || m.net_trend_previous === null
              ? "—"
              : fmtSigned(m.net_trend_current - m.net_trend_previous, " pts", 0)
          }
          sub={p.compare}
        />
      </div>
      <MutedNote>
        Net sentiment = positive share minus negative share, each source
        weighted by its share of the window.
      </MutedNote>
    </Tile>
  );
}

function Market({ p }: { p: Period }) {
  return (
    <Tile
      title={titled("What is the market saying about us?", p)}
      sub="The largest Cards themes in public voice."
      prov="public"
    >
      <Table
        head={["Theme", "Items", "Negative", "Share of voice"]}
        align={["left", "right", "right", "right"]}
        rows={p.cards.market.map((m) => [
          m.label,
          fmt(m.count),
          fmt(m.negative),
          m.share_change_pct === null ? "—" : fmtSigned(m.share_change_pct),
        ])}
      />
      <MutedNote>
        Share of voice: source-weighted change, {p.compare}.
      </MutedNote>
    </Tile>
  );
}

function Service({ p }: { p: Period }) {
  const s = p.cards.service;
  return (
    <Tile
      title={titled("Service", p)}
      sub="How the bank's own Cards contacts were handled."
      prov={["internal", "public"]}
    >
      <div style={STATS}>
        <Stat
          label="Resolved"
          value={fmtPct(pct(s.resolved, s.volume))}
          sub={`${fmt(s.resolved)} of ${fmt(s.volume)}`}
        />
        <Stat
          label="Open over 48 h"
          value={s.open_too_long === null ? "—" : fmt(s.open_too_long)}
        />
        <Stat
          label="First written reply"
          value={
            s.median_first_response_hours_written === null
              ? "—"
              : `${s.median_first_response_hours_written} h`
          }
          sub="median, email / WhatsApp / social"
        />
        <Stat
          label="Service complaints"
          value={fmt(s.public_service_negative)}
          sub="negative public items"
        />
      </div>
    </Tile>
  );
}

function Friction({ p }: { p: Period }) {
  return (
    <Tile
      title={titled("Friction drivers", p)}
      sub="Where Cards customers come back, escalate or complain, by category."
      prov={["internal", "public"]}
    >
      <Table
        head={[
          "Category",
          "Repeat contact (internal)",
          "Escalation (internal)",
          "Escalation language (public)",
          "Negative share (public)",
        ]}
        align={["left", "right", "right", "right", "right"]}
        rows={p.cards.friction.map((f) => [
          f.label,
          fmtPct(f.repeat_contact_internal),
          fmt(f.escalation_internal),
          fmt(f.escalation_external),
          fmtPct(f.negative_share),
        ])}
      />
    </Tile>
  );
}

function Pillars({ p }: { p: Period }) {
  return (
    <Tile
      title={titled("Themes by trust pillar", p)}
      sub="Public voice about Cards by trust pillar."
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
  );
}

function Journey({ p }: { p: Period }) {
  return (
    <Tile
      title={titled("Where contacts come from", p)}
      sub="The bank's own Cards contacts by journey stage."
      prov="internal"
    >
      <Table
        head={["Stage", "Contacts", "Negative share", "Repeat contact"]}
        align={["left", "right", "right", "right"]}
        rows={p.cards.journey.map((j) => [
          j.stage,
          fmt(j.volume),
          fmtPct(j.negative_share),
          fmtPct(j.repeat_share),
        ])}
      />
    </Tile>
  );
}

function Stores({ p }: { p: Period }) {
  return (
    <Tile
      title={titled("Complaints, requests and feedback, by store", p)}
      sub="Cards reviews on each store, one store at a time."
      prov="public"
    >
      <div style={TWO}>
        {p.cards.stores.map((s) => (
          <div
            key={s.store}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minWidth: 0,
            }}
          >
            <strong>
              {s.label}: {fmt(s.reviews)} reviews
              {s.avg_rating === null ? "" : ` · ${s.avg_rating.toFixed(1)}★`}
            </strong>
            {s.reviews < 5 ? (
              <MutedNote>
                Too few Cards reviews on this store in this period to list.
              </MutedNote>
            ) : (
              <Table
                head={["", "Top three"]}
                align={["left", "left"]}
                rows={[
                  [
                    "Complaints",
                    s.complaints
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "—",
                  ],
                  [
                    "Feature requests",
                    s.feature_requests
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "none named",
                  ],
                  [
                    "Existing features praised",
                    s.praised
                      .map((c) => `${c.label} (${fmt(c.count)})`)
                      .join(" · ") || "—",
                  ],
                ]}
              />
            )}
          </div>
        ))}
      </div>
    </Tile>
  );
}

function Volumes({ p }: { p: Period }) {
  const ch = p.cards.channels;
  return (
    <div style={TWO}>
      <Tile
        title={titled("Volume by channel", p)}
        sub="The bank's own channels and public sources."
        prov={["internal", "public"]}
      >
        <Table
          head={["Channel", "Contacts"]}
          align={["left", "right"]}
          rows={[
            ...CHANNEL_ORDER.map((c) => [
              `${CHANNEL_LABEL[c]} (internal)`,
              fmt(ch.internal[c] ?? 0),
            ]),
            ...Object.entries(ch.external).map(([k, v]) => [
              `${k} (public)`,
              fmt(v),
            ]),
          ]}
        />
      </Tile>
      <Tile
        title={titled("Volume by customer list", p)}
        sub="The bank's own Cards contacts, by the Customer pulse lists."
        prov="internal"
      >
        <Table
          head={["List", "Contacts", "Open", "Negative"]}
          align={["left", "right", "right", "right"]}
          rows={p.cards.tiers.map((t) => [
            t.label,
            fmt(t.volume),
            fmt(t.open),
            fmt(t.negative),
          ])}
        />
        <MutedNote>
          A customer can be on more than one list, so the rows are not added up.
        </MutedNote>
      </Tile>
    </div>
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

export function CardsView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PeriodFilter file={b.periods} current={p} />
      <div style={{ fontSize: 13.5 }}>
        <Link
          href={withPeriod("/hdfc-pulse/v2/mds-office", p)}
          style={{ color: C.brandInk }}
        >
          ← MD&apos;s office / Head of CX
        </Link>
      </div>
      <IssuePulse p={p} />
      <Categories p={p} />
      <div style={TWO}>
        <Happy p={p} />
        <Market p={p} />
      </div>
      <div style={TWO}>
        <Service p={p} />
        <Pillars p={p} />
      </div>
      <Friction p={p} />
      <Journey p={p} />
      <Stores p={p} />
      <Volumes p={p} />
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
