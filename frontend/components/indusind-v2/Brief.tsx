"use client";

/**
 * The second scroll of the MD's office / Head of CX view (30 Sep review, changes_30sep.md B): today's morning brief,
 * built from the business cards beneath it, the reputation pulse by product, MD-marked mail and the actions.
 * Everything follows the period filter except the actions, which are labelled with their own period.
 */

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { fmt, fmtDate, fmtPct } from "@/lib/indusind-v2/format";
import type { BriefItem, Business, Period } from "@/lib/indusind-v2/periods";
import { SmallRing, TrendChip, titled, withPeriod } from "./Pulse";
import { C, MONO, Tile, tint } from "./primitives";

const CARDS_VIEW = "/role-based/indusind_bank/pulse-v2/business/cards";
const BRIEF_ORDER = [
  "cards",
  "upi",
  "accounts",
  "personal_loans",
  "home_loans",
  "insurance",
];

/* ---------------------------------------------------------------- morning brief */

function BriefColumn({
  title,
  items,
  color,
}: {
  title: string;
  items: BriefItem[];
  color: string;
}) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <strong style={{ fontSize: 15 }}>{title}</strong>
      {items.length ? (
        items.map((it) => {
          const head = (
            <>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color,
                }}
              >
                {it.business_label}
                {it.status ? ` · ${it.status}` : ""}
              </span>
              {it.issue ? (
                <span
                  style={{ fontSize: 14.5, fontWeight: 650, color: C.text }}
                >
                  {it.issue}
                </span>
              ) : null}
              <span
                style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.45 }}
              >
                {it.text}
              </span>
            </>
          );
          return (
            <div
              key={`${it.business}-${it.issue ?? ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                borderLeft: `2px solid ${tint(color, 0.5)}`,
                paddingLeft: 10,
              }}
            >
              {head}
            </div>
          );
        })
      ) : (
        <span style={{ fontSize: 13.5, color: C.textMut }}>
          Nothing met the rule in this period.
        </span>
      )}
    </div>
  );
}

function BusinessCard({ x, p }: { x: Business; p: Period }) {
  const i = x.internal;
  const e = x.external;
  const r = e.responded;
  const body = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <strong style={{ fontSize: 16 }}>{x.label}</strong>
        {x.id === "cards" ? (
          <Link
            href={withPeriod(CARDS_VIEW, p)}
            data-testid="deep-dive"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: C.brand,
              color: "#fff",
              border: `1px solid ${C.brand}`,
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Deep dive <ChevronRight size={14} />
          </Link>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SmallRing value={e.negative_share} color={C.red} size={58} />
          <span style={{ fontSize: 12, color: C.textMut, lineHeight: 1.3 }}>
            negative
            <br />
            public
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SmallRing
            value={i.volume ? (100 * i.open) / i.volume : null}
            color={C.amber}
            size={58}
          />
          <span style={{ fontSize: 12, color: C.textMut, lineHeight: 1.3 }}>
            open
            <br />
            internal
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 750 }}>
            {fmt(x.overall_volume)}
          </span>
          <span style={{ fontSize: 12, color: C.textMut }}>
            contacts: {fmt(i.volume)} internal · {fmt(e.volume)} public
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <TrendChip pct={i.change_pct} label="internal" />
        <TrendChip pct={e.change_pct} label="public" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 6,
          fontSize: 13,
          color: C.textSec,
        }}
      >
        <span>
          Open / waiting:{" "}
          <strong style={{ color: C.text }}>
            {fmt(i.open)} / {fmt(i.waiting_on_customer)}
          </strong>
        </span>
        <span>
          Responded:{" "}
          <strong style={{ color: C.text }}>
            {r.reviews ? `${fmt(r.responded)} of ${fmt(r.reviews)}` : "—"}
          </strong>
        </span>
        <span>
          Negative public:{" "}
          <strong style={{ color: C.text }}>{fmtPct(e.negative_share)}</strong>
        </span>
        <span>
          Negative internal:{" "}
          <strong style={{ color: C.text }}>
            {fmtPct(i.volume ? (100 * i.negative) / i.volume : null)}
          </strong>
        </span>
      </div>
      <div style={{ fontSize: 13.5 }}>
        <span style={{ color: C.textMut }}>Top issue: </span>
        <strong>{x.top_issue?.label ?? "—"}</strong>
        {x.top_issue?.source === "internal" ? (
          <span style={{ color: C.textMut }}>
            {" "}
            (internal; thin public voice)
          </span>
        ) : null}
      </div>
      <div
        style={{
          fontSize: 13,
          color: x.anecdote ? C.textSec : C.textMut,
          borderLeft: `2px solid ${C.border}`,
          paddingLeft: 8,
          lineHeight: 1.45,
          alignSelf: "end",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {x.anecdote ? (
          <>
            &ldquo;{x.anecdote.summary}&rdquo;
            <span style={{ color: C.textMut }}>
              {" "}
              · {x.anecdote.source_label}, {fmtDate(x.anecdote.date)}
            </span>
          </>
        ) : (
          "No quotable public post in this period."
        )}
      </div>
    </>
  );
  const style = {
    background: C.cardAlt,
    border: `1px solid ${x.id === "cards" ? tint(C.brand, 0.35) : C.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    // Rule B: six sections, one per subgrid row, so cards in a row line up section by section.
    display: "grid",
    gridRow: "span 6",
    gridTemplateRows: "subgrid",
    rowGap: 10,
    minWidth: 0,
    textDecoration: "none",
    color: "inherit",
  };
  return (
    <div data-testid="business-card" style={style}>
      {body}
    </div>
  );
}

export function MorningBrief({ p }: { p: Period }) {
  const by = Object.fromEntries(p.businesses.map((x) => [x.id, x]));
  const cards = BRIEF_ORDER.map((id) => by[id]).filter(Boolean);
  return (
    <Tile
      id="morning-brief"
      title={titled("Today's morning brief", p)}
      sub="Bank-wide, built from the six businesses below. Each item names its business."
      prov={["internal", "public"]}
      tone="violet"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 10,
          alignItems: "start",
        }}
      >
        <BriefColumn
          title="What needs you"
          items={p.brief.needs_you}
          color={C.red}
        />
        <BriefColumn
          title="Signals that are building"
          items={p.brief.building}
          color={C.amber}
        />
        <BriefColumn
          title="What's improving or stable"
          items={p.brief.improving}
          color={C.green}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, max(360px, calc((100% - 20px) / 3))), 1fr))",
          gap: 10,
        }}
      >
        {cards.map((x) => (
          <BusinessCard key={x.id} x={x} p={p} />
        ))}
      </div>
    </Tile>
  );
}
