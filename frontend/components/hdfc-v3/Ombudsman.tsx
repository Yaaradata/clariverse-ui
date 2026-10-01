"use client";

/**
 * Ombudsman watch (docs/demo-rebuild/ombudsman_watch_design.md). Internal · illustrative. A snapshot of the complaint
 * register as of the end of the selected period, compared with the end of the previous period; every figure comes from
 * periods.json. Eligibility and risk only: LisN flags and recommends, people act, and nothing contacts a customer.
 */

import { Info, Scale } from "lucide-react";
import Link from "next/link";

import { fmt, fmtDateTime } from "@/lib/hdfc-v3/format";
import type {
  CardsOmbudsman,
  OmbudsmanBlock,
  OmbudsmanRisk,
  Period,
} from "@/lib/hdfc-v3/periods";
import { Delta, Dial, titled, withPeriod } from "./Pulse";
import { C, cols, MONO, MutedNote, Tile, tint } from "./primitives";

const CARDS_VIEW = "/hdfc-pulse/v2/business/cards";

const pct = (a: number, b: number) => (b ? (100 * a) / b : null);

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
  info,
  rows,
}: {
  title: string;
  info: string;
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
        {/* The definitions and RBI rules stay reachable without taking room on the tile. */}
        <span
          role="img"
          aria-label={info}
          title={info}
          style={{
            display: "inline-flex",
            marginLeft: 6,
            cursor: "help",
            verticalAlign: "-2px",
          }}
        >
          <Info size={13} />
        </span>
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
                style={{
                  textDecoration: "none",
                  minWidth: 0,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
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
            flex: "4 1 380px",
            minWidth: 0,
            background: C.cardAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px 8px",
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
        </div>
        <div
          style={{
            flex: "5 1 420px",
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
            info={`On the brink: no reply yet and 10 days or fewer to the 30-day limit. Already eligible: past day 30 with no reply, within the 90 days to file. Unhappy with the reply: after the reply the customer reopened the complaint, contacted the bank again about the issue, or used escalation language. At risk counts each complaint once; rings show the share of open complaints. ${o.rules}`}
            rows={split}
          />
        </div>
      </div>
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
      {/* Cards, not a table: each complaint's reason stays readable on a phone. */}
      <ol
        style={{
          ...cols(2, 420, 10),
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {o.save_list.map((r, i) => {
          const color = r.state === "eligible" ? C.red : C.amber;
          return (
            <li
              key={r.id}
              data-testid="save-row"
              style={{
                background: C.cardAlt,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 5,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 13 }}>
                  {i + 1}. {r.id}{" "}
                  <span style={{ color: C.textMut }}>· {r.customer}</span>
                </span>
                <strong style={{ color, whiteSpace: "nowrap", fontSize: 13.5 }}>
                  {r.state === "eligible"
                    ? "Eligible"
                    : `${r.days_left} day${r.days_left === 1 ? "" : "s"} left`}
                </strong>
              </div>
              <div style={{ fontSize: 14, fontWeight: 650 }}>
                {r.category}
                <span style={{ fontWeight: 400, color: C.textMut }}>
                  {" "}
                  · {r.issue}
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.45 }}>
                {r.reason}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 12.5,
                  color: C.textMut,
                }}
              >
                <span>
                  Owner: <strong style={{ color: C.text }}>{r.owner}</strong>
                </span>
                {r.lists.length ? <span>· {r.lists.join(", ")}</span> : null}
              </div>
            </li>
          );
        })}
      </ol>
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
