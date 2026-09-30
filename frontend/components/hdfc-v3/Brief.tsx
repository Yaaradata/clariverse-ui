"use client";

/**
 * The second scroll of the MD's office / Head of CX view (30 Sep review, changes_30sep.md B): today's morning brief,
 * built from the business cards beneath it, the reputation pulse by product, MD-marked mail and the actions.
 * Everything follows the period filter except the actions, which are labelled with their own period.
 */

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { fmt, fmtDate, fmtPct } from "@/lib/hdfc-v3/format";
import type { BriefItem, Business, Period } from "@/lib/hdfc-v3/periods";
import { actions, itemHref, type SignalItem } from "@/lib/hdfc-v3/selectors";
import type { Bundle } from "@/lib/hdfc-v3/types";
import { SmallRing, TrendChip, titled, withPeriod } from "./Pulse";
import {
  ActionChip,
  C,
  MONO,
  MutedNote,
  OWNER_LABEL,
  OwnerChip,
  RungChip,
  Status,
  statusColor,
  Table,
  Tile,
  tint,
} from "./primitives";

const CARDS_VIEW = "/hdfc-pulse/v2/business/cards";
const BRIEF_ORDER = [
  "cards",
  "payzapp",
  "accounts",
  "personal_loans",
  "home_loans",
  "insurance",
];

function businessHref(id: string, p: Period): string | null {
  return id === "cards" ? withPeriod(CARDS_VIEW, p) : null;
}

/* ---------------------------------------------------------------- morning brief */

function BriefColumn({
  title,
  items,
  color,
  p,
}: {
  title: string;
  items: BriefItem[];
  color: string;
  p: Period;
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
          const href = businessHref(it.business, p);
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
          const style = {
            display: "flex",
            flexDirection: "column" as const,
            gap: 3,
            textDecoration: "none",
            color: "inherit",
            borderLeft: `2px solid ${tint(color, 0.5)}`,
            paddingLeft: 10,
          };
          return href ? (
            <Link
              key={`${it.business}-${it.issue ?? ""}`}
              href={href}
              style={style}
            >
              {head}
            </Link>
          ) : (
            <div key={`${it.business}-${it.issue ?? ""}`} style={style}>
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
  const href = businessHref(x.id, p);
  const i = x.internal;
  const e = x.external;
  const r = e.responded;
  const na = i.open_too_long === null;
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
        <span style={{ fontSize: 12.5, color: href ? C.brandInk : C.textMut }}>
          {href ? (
            <>
              Business view{" "}
              <ChevronRight size={12} style={{ verticalAlign: "-2px" }} />
            </>
          ) : (
            "Business view: coming soon"
          )}
        </span>
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
          Open / too long:{" "}
          <strong style={{ color: C.text }}>
            {fmt(i.open)} / {na ? "—" : fmt(i.open_too_long)}
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
      {x.anecdote ? (
        <div
          style={{
            fontSize: 13,
            color: C.textSec,
            borderLeft: `2px solid ${C.border}`,
            paddingLeft: 8,
            lineHeight: 1.45,
          }}
        >
          &ldquo;{x.anecdote.summary}&rdquo;
          <span style={{ color: C.textMut }}>
            {" "}
            · {x.anecdote.source_label}, {fmtDate(x.anecdote.date)}
          </span>
        </div>
      ) : null}
    </>
  );
  const style = {
    background: C.cardAlt,
    border: `1px solid ${href ? tint(C.brand, 0.35) : C.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    minWidth: 0,
    textDecoration: "none",
    color: "inherit",
  };
  return href ? (
    <Link data-testid="business-card" href={href} style={style}>
      {body}
    </Link>
  ) : (
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
        }}
      >
        <BriefColumn
          title="What needs you"
          items={p.brief.needs_you}
          color={C.red}
          p={p}
        />
        <BriefColumn
          title="Signals that are building"
          items={p.brief.building}
          color={C.amber}
          p={p}
        />
        <BriefColumn
          title="What's improving or stable"
          items={p.brief.improving}
          color={C.green}
          p={p}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 10,
        }}
      >
        {cards.map((x) => (
          <BusinessCard key={x.id} x={x} p={p} />
        ))}
      </div>
      <MutedNote>
        {p.brief.rules} Internal figures are illustrative; public shares are
        source-weighted; public trends use store reviews and forums only. Quotes
        are paraphrased and anonymised. Insurance is thin in public voice.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- reputation pulse by product */

export function ReputationTable({ p }: { p: Period }) {
  return (
    <Tile
      id="reputation-pulse"
      title={titled("Reputation pulse by product", p)}
      sub="Every product, internal and public. Cards opens its business view; the others are coming soon."
      prov={["internal", "public"]}
    >
      <Table
        head={[
          "Product",
          "Overall volume",
          "Negative internal",
          "Negative public",
          "Trend",
          "Open / too long",
          "Top issue",
          "Escalation language (public)",
          "",
        ]}
        align={[
          "left",
          "right",
          "right",
          "right",
          "left",
          "right",
          "left",
          "right",
          "right",
        ]}
        rows={p.businesses.map((x) => {
          const href = businessHref(x.id, p);
          return [
            href ? (
              <Link
                key="l"
                href={href}
                style={{ color: C.text, fontWeight: 650 }}
              >
                {x.label}
              </Link>
            ) : (
              x.label
            ),
            fmt(x.overall_volume),
            fmt(x.internal.negative),
            `${fmt(x.external.negative)} (${fmtPct(x.external.negative_share)})`,
            <span key="t" style={{ display: "flex", gap: 10 }}>
              <TrendChip pct={x.internal.change_pct} label="internal" />
              <TrendChip pct={x.external.change_pct} label="public" />
            </span>,
            `${fmt(x.internal.open)} / ${x.internal.open_too_long === null ? "—" : fmt(x.internal.open_too_long)}`,
            x.top_issue?.label ?? "—",
            fmt(x.external.escalation),
            href ? (
              <Link key="go" href={href} aria-label={`Open ${x.label}`}>
                <ChevronRight size={16} color={C.textMut} />
              </Link>
            ) : (
              <span key="soon" style={{ fontSize: 12, color: C.textMut }}>
                coming soon
              </span>
            ),
          ];
        })}
      />
      <MutedNote>
        Overall volume: the bank&apos;s own contacts plus public posts and
        reviews. Negative public share is source-weighted. Trend: {p.compare}.
        Public trends use store reviews and forums only. Open too long: still
        open more than 48 hours after the contact came in
        {p.id === "brief" ? " (can't be measured in a 24-hour window)" : ""}.
        Wealth, SME and corporate items sit outside the table.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- MD-marked mail */

export function MdMail({ p }: { p: Period }) {
  const m = p.md_mail;
  return (
    <Tile
      id="md-mail"
      title={titled("MD-marked mail", p)}
      sub={`${fmt(m.total)} written complaints reached the MD's office in this period, sieved into themes and routed to owners.`}
      prov="internal"
    >
      {m.rows.length ? (
        <Table
          head={["Theme", "Mails", "Resolved"]}
          align={["left", "right", "right"]}
          rows={m.rows.map((r) => [
            r.label,
            fmt(r.mails),
            `${fmt(r.resolved)} of ${fmt(r.mails)}`,
          ])}
        />
      ) : (
        <MutedNote>
          No written complaints reached the MD&apos;s office in this period.
        </MutedNote>
      )}
    </Tile>
  );
}

/* ---------------------------------------------------------------- actions (left as is, 30 Sep review B6) */

function ActionCard({ s }: { s: SignalItem }) {
  const color = statusColor(s.status);
  return (
    <Link
      href={itemHref(s, "mds-office")}
      data-testid="action-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        background: `linear-gradient(180deg, ${tint(color, 0.07)}, ${C.card} 70%)`,
        border: `1px solid ${tint(color, 0.28)}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 15.5,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.35,
          }}
        >
          {s.label}
        </span>
        <Status value={s.status} />
      </div>
      <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.5 }}>
        {s.why}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <OwnerChip owner={s.owner} />
        <RungChip rung={s.rung} />
        <ActionChip action={s.action} />
      </div>
      {s.ackAt ? (
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Routed to {OWNER_LABEL[s.owner] ?? s.owner} · {s.ackSystem} ·
          acknowledged {s.ackAt}
        </div>
      ) : null}
    </Link>
  );
}

export function Actions({ b }: { b: Bundle }) {
  const acts = actions(b, "mds-office");
  return (
    <Tile
      id="actions"
      title={titled("Actions to take", b.periods.periods.all)}
      sub="At most three: complaints closed without resolution, the app fix list, then priority relationships. Built on the full window."
      prov={["public", "internal"]}
      tone="red"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 10,
        }}
      >
        {acts.map((s) => (
          <ActionCard key={s.id} s={s} />
        ))}
      </div>
      <MutedNote>
        Every action is a recommendation routed to the owner&apos;s system. LisN
        never executes, authorises or decides.
      </MutedNote>
    </Tile>
  );
}
