"use client";

/**
 * Ombudsman watch (docs/demo-rebuild/ombudsman_watch_design.md). Internal · illustrative. A snapshot of the complaint
 * register as of the end of the selected period, compared with the end of the previous period; every figure comes from
 * periods.json. Eligibility and risk only: LisN flags and recommends, people act, and nothing contacts a customer.
 */

import { Scale } from "lucide-react";
import Link from "next/link";

import { fmt, fmtDateTime } from "@/lib/hdfc-v3/format";
import type {
  CardsOmbudsman,
  CountdownBucket,
  OmbudsmanBlock,
  OmbudsmanRisk,
  Period,
} from "@/lib/hdfc-v3/periods";
import { Delta, Dial, titled, withPeriod } from "./Pulse";
import { C, MONO, MutedNote, Table, Tile, tint } from "./primitives";

const CARDS_VIEW = "/hdfc-pulse/v2/business/cards";

const pct = (a: number, b: number) => (b ? (100 * a) / b : null);

const BUCKETS: {
  id: CountdownBucket | "eligible";
  label: string;
  color: string;
}[] = [
  { id: "8-10", label: "8–10 days left", color: tint(C.amber, 0.45) },
  { id: "4-7", label: "4–7 days left", color: C.amber },
  { id: "0-3", label: "0–3 days left", color: tint(C.red, 0.75) },
  { id: "eligible", label: "Past day 30: eligible", color: C.red },
];

/** One bar that fills towards day 30: the no-reply complaints, closest to the limit on the right. */
function Countdown({ o }: { o: OmbudsmanBlock }) {
  const n = (id: CountdownBucket | "eligible") =>
    id === "eligible" ? o.now.eligible : o.now.buckets[id];
  const total = BUCKETS.reduce((s, b) => s + n(b.id), 0);
  return (
    <div data-testid="ombudsman-countdown">
      <div
        style={{
          fontSize: 12,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 6,
        }}
      >
        Countdown to the 30-day reply limit · no reply yet
      </div>
      <div
        style={{
          display: "flex",
          height: 14,
          borderRadius: 999,
          overflow: "hidden",
          background: C.inner,
        }}
      >
        {BUCKETS.map((b) =>
          n(b.id) ? (
            <div
              key={b.id}
              title={`${b.label}: ${n(b.id)}`}
              style={{
                width: `${(100 * n(b.id)) / (total || 1)}%`,
                background: b.color,
              }}
            />
          ) : null,
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 6,
          marginTop: 6,
        }}
      >
        {BUCKETS.map((b) => (
          <div key={b.id} style={{ display: "flex", gap: 6, minWidth: 0 }}>
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: b.color,
                marginTop: 4,
                flexShrink: 0,
              }}
            />
            <span
              style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.35 }}
            >
              <strong style={{ fontFamily: MONO, color: C.text }}>
                {fmt(n(b.id))}
              </strong>{" "}
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A small stacked bar: on the brink, eligible (no reply) and unhappy with the reply. */
function RiskBar({ r, max }: { r: OmbudsmanRisk; max: number }) {
  const w = (n: number) => `${(100 * n) / (max || 1)}%`;
  return (
    <div
      style={{
        display: "flex",
        height: 8,
        borderRadius: 999,
        overflow: "hidden",
        background: C.inner,
      }}
    >
      <div style={{ width: w(r.brink), background: C.amber }} />
      <div style={{ width: w(r.eligible), background: C.red }} />
      <div style={{ width: w(r.unhappy), background: C.violet }} />
    </div>
  );
}

function RiskLegend() {
  const dot = (color: string, label: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        aria-hidden
        style={{ width: 9, height: 9, borderRadius: 3, background: color }}
      />
      {label}
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        fontSize: 12,
        color: C.textMut,
      }}
    >
      {dot(C.amber, "On the brink")}
      {dot(C.red, "Eligible, no reply")}
      {dot(C.violet, "Unhappy with the reply")}
    </div>
  );
}

/** Split by business (MD view) or by category (Cards view): where the at-risk complaints come from. */
function Split({
  title,
  rows,
}: {
  title: string;
  rows: { id: string; label: string; href?: string; r: OmbudsmanRisk }[];
}) {
  const max = Math.max(...rows.map((x) => x.r.at_risk), 1);
  return (
    <div
      data-testid="ombudsman-split"
      style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}
    >
      <div
        style={{
          fontSize: 12,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
      <RiskLegend />
      {rows.map((x) => {
        const label = (
          <span
            style={{
              fontSize: 13.5,
              color: x.href ? C.brandInk : C.textSec,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {x.label}
          </span>
        );
        return (
          <div
            key={x.id}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr) 42px",
              gap: 10,
              alignItems: "center",
            }}
          >
            {x.href ? (
              <Link
                href={x.href}
                style={{ textDecoration: "none", minWidth: 0 }}
              >
                {label}
              </Link>
            ) : (
              label
            )}
            <RiskBar r={x.r} max={max} />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 13.5,
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              {fmt(x.r.at_risk)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OmbudsmanWatch({
  o,
  p,
  scope,
}: {
  o: OmbudsmanBlock | CardsOmbudsman;
  p: Period;
  scope: "bank" | "cards";
}) {
  const n = o.now;
  const since = `since ${fmtDateTime(o.prev_as_of)}`;
  const split =
    scope === "bank"
      ? o.by_business.map((x) => ({
          id: x.id,
          label: x.label,
          href: withPeriod(
            x.id === "cards" ? CARDS_VIEW : `/hdfc-pulse/v2/business/${x.id}`,
            p,
          ),
          r: x,
        }))
      : [...(o as CardsOmbudsman).categories]
          .filter((c) => c.at_risk)
          .sort((a, b) => b.at_risk - a.at_risk)
          .map((c) => ({ id: c.id, label: c.label, r: c }));
  const lists = Object.entries(o.on_lists.by_list).filter(([, v]) => v);
  return (
    <Tile
      id="ombudsman-watch"
      title={titled(
        scope === "bank" ? "Ombudsman watch" : "Ombudsman watch: Cards",
        p,
      )}
      sub={`Complaints eligible to approach the RBI Ombudsman, or close to it. As of ${fmtDateTime(o.as_of)}; changes ${since}.`}
      prov="internal"
      tone="red"
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "5 1 520px",
            minWidth: 0,
            background: C.cardAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 8,
              alignItems: "start",
            }}
          >
            <Dial
              value={pct(n.brink, n.open)}
              color={C.amber}
              big={fmt(n.brink)}
              label="On the brink"
              sub={
                <>
                  10 days or fewer left
                  <br />
                  <Delta n={o.delta.brink} label={since} goodDown />
                </>
              }
            />
            <Dial
              value={pct(n.eligible, n.open)}
              color={C.red}
              big={fmt(n.eligible)}
              label="Already eligible"
              sub={
                <>
                  past day 30, no reply
                  <br />
                  <Delta n={o.delta.eligible} label={since} goodDown />
                </>
              }
            />
            <Dial
              value={pct(n.unhappy, n.open)}
              color={C.violet}
              big={fmt(n.unhappy)}
              label="Unhappy with the reply"
              sub={
                <>
                  eligible at any point
                  <br />
                  <Delta n={o.delta.unhappy} label={since} goodDown />
                </>
              }
            />
            <Dial
              value={pct(n.awaiting_io, n.open)}
              color={C.cyan}
              big={fmt(n.awaiting_io)}
              label="Awaiting IO review"
              sub={
                <>
                  rejection held for review
                  <br />
                  <Delta n={o.delta.awaiting_io} label={since} goodDown />
                </>
              }
            />
          </div>
          <Countdown o={o} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 13.5,
              color: C.textSec,
              lineHeight: 1.45,
            }}
          >
            <span>
              <Scale
                size={14}
                style={{ display: "inline", verticalAlign: "-2px" }}
                color={C.red}
              />{" "}
              <strong style={{ color: C.text }}>{fmt(n.at_risk)}</strong> of{" "}
              {fmt(n.open)} open complaints are at risk ·{" "}
              <strong style={{ color: C.text }}>
                {fmt(o.became_eligible)}
              </strong>{" "}
              became eligible in this period ({p.label.toLowerCase()}).
            </span>
            <span>
              <strong style={{ color: C.text }}>
                {fmt(o.on_lists.at_risk)}
              </strong>{" "}
              at-risk complaints are from customers on the bank&apos;s lists
              {lists.length
                ? `: ${lists.map(([k, v]) => `${o.on_lists.labels[k]} ${fmt(v)}`).join(" · ")}`
                : ""}
              .
            </span>
          </div>
        </div>
        <div
          style={{
            flex: "4 1 360px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Split
            title={
              scope === "bank" ? "At risk, by business" : "At risk, by category"
            }
            rows={split}
          />
          {scope === "bank" ? (
            <span style={{ fontSize: 12.5, color: C.textMut }}>
              Cards opens its business view; the other businesses are coming
              soon.
            </span>
          ) : null}
        </div>
      </div>
      <details style={{ fontSize: 12.5, color: C.textMut, lineHeight: 1.5 }}>
        <summary style={{ cursor: "pointer", color: C.textSec }}>
          How it&apos;s counted, and the RBI rules
        </summary>
        <p style={{ margin: "6px 0 0" }}>
          On the brink: no reply yet and 10 days or fewer to the 30-day limit.
          Already eligible: past day 30 with no reply, within the 90 days to
          file. Unhappy with the reply: after the reply the customer reopened
          the complaint, contacted the bank again about the issue with a
          negative contact, or used escalation language (RBI or Ombudsman named,
          consumer court, legal notice). At risk counts each complaint once;
          rings show the share of open complaints. {o.rules}
        </p>
      </details>
    </Tile>
  );
}

/** Cards: the ten at-risk complaints to call today, highest risk first. */
export function SaveList({ o, p }: { o: CardsOmbudsman; p: Period }) {
  return (
    <Tile
      id="save-list"
      title={titled("Save list: call today", p)}
      sub={`The ${o.save_list.length} Cards complaints most at risk as of ${fmtDateTime(o.as_of)}, each with why and who owns it. LisN recommends; people call.`}
      prov="internal"
      tone="red"
    >
      <Table
        head={["Complaint", "Category · issue", "Status", "Why", "Owner"]}
        align={["left", "left", "left", "left", "left"]}
        rows={o.save_list.map((r) => [
          <span key="id" style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: MONO, fontSize: 13 }}>{r.id}</span>
            <span style={{ fontSize: 12, color: C.textMut }}>
              {r.customer}
              {r.lists.length ? ` · ${r.lists.join(", ")}` : ""}
            </span>
          </span>,
          <span key="c" style={{ display: "flex", flexDirection: "column" }}>
            <span>{r.category}</span>
            <span style={{ fontSize: 12, color: C.textMut }}>{r.issue}</span>
          </span>,
          <span
            key="s"
            style={{
              fontWeight: 700,
              whiteSpace: "nowrap",
              color: r.state === "eligible" ? C.red : C.amber,
            }}
          >
            {r.state === "eligible"
              ? "Eligible"
              : `${r.days_left} day${r.days_left === 1 ? "" : "s"} left`}
          </span>,
          <span key="w" style={{ fontSize: 13, lineHeight: 1.45 }}>
            {r.reason}
          </span>,
          <span key="o" style={{ fontSize: 13 }}>
            {r.owner}
          </span>,
        ])}
      />
      <MutedNote>
        Ordered by a points score from signals LisN already holds: days to the
        limit or eligibility, an unhappy reply, repeat contacts, channels used,
        escalation language, the bank&apos;s lists and a public post that
        reached the social inbox. The score orders the list; it is not a
        probability. Owners are roles. IO timeline: confirm with the bank.
      </MutedNote>
    </Tile>
  );
}

/** A pill for the issues accordion: at-risk complaints in the category or subcategory. */
export function RiskPill({ r }: { r?: OmbudsmanRisk }) {
  if (!r || !r.at_risk) return null;
  const hot = r.eligible + r.unhappy > 0;
  const color = hot ? C.red : C.amber;
  return (
    <span
      data-testid="ombudsman-pill"
      title={`Ombudsman risk: ${r.at_risk} at risk (${r.brink} on the brink, ${r.eligible} eligible with no reply, ${r.unhappy} unhappy with the reply)`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11.5,
        fontWeight: 700,
        color,
        background: tint(color, 0.1),
        border: `1px solid ${tint(color, 0.35)}`,
        borderRadius: 999,
        padding: "1px 7px",
        whiteSpace: "nowrap",
      }}
    >
      <Scale size={11} style={{ flexShrink: 0 }} />
      {r.at_risk} at risk
    </span>
  );
}
