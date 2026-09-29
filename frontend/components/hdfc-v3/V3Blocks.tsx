"use client";

/**
 * V3 exec blocks (B7 §1 E1): numbers first. Dials, the priority-relationships strip, the pulse-by-product table, the
 * product filter and customer memory. Every figure comes from the bundle; internal figures are tagged illustrative.
 */

import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import { MODULES, PRODUCT_ORDER } from "@/lib/hdfc-v3/products";
import type {
  Bundle,
  InternalProductRow,
  ProductId,
  PublicProductRow,
  View,
} from "@/lib/hdfc-v3/types";
import {
  C,
  MONO,
  MutedNote,
  OwnerChip,
  ProvenanceTag,
  Table,
  Tile,
  tint,
} from "./primitives";

export { MODULES, PRODUCT_ORDER };

export function productHref(id: ProductId, from: string): string {
  const m = MODULES[id];
  return m
    ? `/hdfc-pulse/v2/module/${m}?from=${from}`
    : `/hdfc-pulse/v2/business/${id}?from=${from}`;
}

export function hoursLabel(h: number | null | undefined): string {
  if (h === null || h === undefined) return "—";
  if (h < 48) return `${Math.round(h)} h`;
  return `${(h / 24).toFixed(1)} days`;
}

/* ---------------------------------------------------------------- dials */

const PRODUCT_APP: Partial<Record<ProductId, string>> = {
  digital: "HDFC Bank app",
  payzapp: "PayZapp",
  home_loans: "Home Loans",
  personal_loans: "Loan Assist",
};

function replyTime(h: number | null | undefined): string {
  if (h === null || h === undefined) return "—";
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  return `${h.toFixed(1)} h`;
}

function Ring({
  value,
  color,
  label,
  big,
  sub,
  pending,
}: {
  value: number | null;
  color: string;
  label: string;
  big: string;
  sub: string;
  pending?: boolean;
}) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div
      data-testid="dial"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: C.cardAlt,
        border: `1px solid ${pending ? C.border : tint(color, 0.25)}`,
        borderRadius: 12,
        padding: "10px 12px",
        minWidth: 0,
      }}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        role="img"
        aria-label={`${label}: ${big}`}
        style={{ flexShrink: 0 }}
      >
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={C.inner}
          strokeWidth="7"
        />
        {pending ? null : (
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${(circ * v) / 100} ${circ}`}
            transform="rotate(-90 36 36)"
          />
        )}
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fontSize="12.5"
          fontWeight="700"
          fill={pending ? C.textMut : color}
          fontFamily="JetBrains Mono, monospace"
        >
          {pending ? "—" : value === null ? "" : `${Math.round(v)}%`}
        </text>
      </svg>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            color: C.textMut,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: pending ? 15 : 24,
            fontWeight: 800,
            fontFamily: pending ? undefined : MONO,
            color: pending ? C.textMut : C.text,
            lineHeight: 1.15,
            marginTop: 2,
          }}
        >
          {big}
        </div>
        <div style={{ fontSize: 12.5, color: C.textSec, marginTop: 2 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

const DIAL_GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
  gap: 8,
} as const;

/** Four dials inside the bank (illustrative) and the same four outside (public). Optionally scoped to one product. */
export function DialsRow({ b, product }: { b: Bundle; product?: ProductId }) {
  const inside = product
    ? b.v3.products.find((p) => p.id === product)
    : b.v3.dials;
  const pub = product
    ? b.products.rows.find((r) => r.id === product)
    : undefined;
  const r = b.responses;
  if (!inside) return null;
  // Replies are visible on Play Store reviews only: bank-wide, or for the product's own app.
  const app = product ? PRODUCT_APP[product] : undefined;
  const rs = product ? (app ? r.by_app[app] : undefined) : r.all;
  const rn = product ? undefined : r.negative;
  const outsideTotal = pub ? pub.count : b.themes.total_items;
  const outsideNeg = pub
    ? pub.negative
    : b.signals.ladder_public.voice_negative;
  return (
    <Tile
      id="dials"
      title="The numbers first"
      sub={`Inside the bank: ${fmt(inside.total)} interactions in the demo sample, ${fmtDate(b.v3.window.start)} to this morning. Outside: public posts and reviews in the same window.`}
      prov={["internal", "public"]}
      tone="violet"
    >
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 800,
          color: C.violet,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        Inside the bank <ProvenanceTag kind="internal" />
      </div>
      <div style={DIAL_GRID}>
        <Ring
          value={100}
          color={C.violet}
          label="Total signals"
          big={fmt(inside.total)}
          sub="calls, chats, emails, branch, bot, social inbox"
        />
        <Ring
          value={inside.total ? (100 * inside.closed) / inside.total : null}
          color={C.green}
          label="Closed or responded"
          big={fmt(inside.closed_or_responded)}
          sub={`${fmt(inside.closed)} closed (${fmtPct(inside.total ? (100 * inside.closed) / inside.total : null)}) · ${fmt(inside.closed_or_responded - inside.closed)} open with a reply`}
        />
        <Ring
          value={inside.open_pct}
          color={C.amber}
          label="Open"
          big={fmt(inside.open)}
          sub={`${fmtPct(inside.open_pct, 1)} of total`}
        />
        <Ring
          value={inside.open_too_long_pct_of_open}
          color={C.red}
          label="Open too long"
          big={fmt(inside.open_too_long)}
          sub={`${fmtPct(inside.open_too_long_pct_of_open)} of open · past the deliverable`}
        />
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 800,
          color: C.cyan,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 4,
        }}
      >
        Outside the bank <ProvenanceTag kind="public" />
      </div>
      <div style={DIAL_GRID}>
        <Ring
          value={100}
          color={C.cyan}
          label="Total signals"
          big={fmt(outsideTotal)}
          sub={`public posts and reviews · ${fmt(outsideNeg)} negative`}
        />
        {rs ? (
          <>
            <Ring
              value={rs.responded_pct}
              color={C.green}
              label="Responded"
              big={fmt(rs.responded)}
              sub={`${fmtPct(rs.responded_pct)} of ${fmt(rs.reviews)} Play Store reviews · median reply ${replyTime(rs.median_reply_hours)}`}
            />
            <Ring
              value={rs.open_pct}
              color={C.amber}
              label="Open"
              big={fmt(rs.open)}
              sub="no bank reply on the review"
            />
            <Ring
              value={rs.open_too_long_pct_of_open}
              color={C.red}
              label="Open too long"
              big={fmt(rs.open_too_long)}
              sub="no bank reply within 48 hours"
            />
          </>
        ) : (
          <div
            style={{
              gridColumn: "span 3",
              fontSize: 13.5,
              color: C.textMut,
              alignSelf: "center",
              lineHeight: 1.5,
            }}
          >
            No bank replies are visible in public for this product: its voice is
            on X, Reddit and forums, where replies were not collected.
          </div>
        )}
      </div>
      {rs && rn ? (
        <div
          data-testid="redirect-line"
          style={{
            background: tint(C.amber, 0.06),
            border: `1px solid ${tint(C.amber, 0.3)}`,
            borderLeft: `3px solid ${C.amber}`,
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 14.5,
            color: C.textSec,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: C.text }}>Responded is not resolved.</strong>{" "}
          Of {fmt(rn.responded)} replies to negative reviews,{" "}
          <strong style={{ color: C.amber }}>
            {fmt(rn.redirect_only)} ({fmtPct(rn.redirect_only_pct_of_replied)})
          </strong>{" "}
          only redirect the customer to email, phone, chat or a branch rather
          than answering.
        </div>
      ) : null}
      <Table
        head={["", "Total", "Closed or responded", "Open", "Open too long"]}
        align={["left", "right", "right", "right", "right"]}
        rows={[
          [
            "Inside (illustrative)",
            fmt(inside.total),
            `${fmt(inside.closed)} closed + ${fmt(inside.closed_or_responded - inside.closed)} replied`,
            `${fmt(inside.open)} (${fmtPct(inside.open_pct, 1)})`,
            `${fmt(inside.open_too_long)} (${fmtPct(inside.open_too_long_pct_of_open)} of open)`,
          ],
          [
            rs ? "Outside (Play Store replies)" : "Outside (public)",
            rs ? fmt(rs.reviews) : fmt(outsideTotal),
            rs ? `${fmt(rs.responded)} (${fmtPct(rs.responded_pct)})` : "—",
            rs ? `${fmt(rs.open)} (${fmtPct(rs.open_pct)})` : "—",
            rs ? fmt(rs.open_too_long) : "—",
          ],
        ]}
      />
      <MutedNote>
        {r.definition} {r.scope_note} Open too long inside the bank means open
        past the deliverable (RBI TAT where published, otherwise the bank TAT to
        confirm in discovery).
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- cohorts */

export function CohortStrip({
  b,
  from,
  product,
}: {
  b: Bundle;
  from: View;
  product?: ProductId;
}) {
  const cohorts = b.v3.cohorts;
  return (
    <Tile
      id="priority"
      title="Priority relationships"
      sub={
        product
          ? `Open issues for priority customers in ${b.products.rows.find((p) => p.id === product)?.label}, and across all their products. Cohorts come from the bank's own tiers and lists.`
          : "Customers on the bank's own priority lists and relationship tiers. Issues open over 5 hours and over 24 hours, and whether the RM knows."
      }
      prov="internal"
      tone="red"
      right={
        <Link
          href={`/hdfc-pulse/v2/priority?from=${from}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: C.text,
            textDecoration: "none",
            border: `1px solid ${C.borderLight}`,
            borderRadius: 999,
            padding: "5px 12px",
            background: C.cardAlt,
          }}
        >
          <Users size={14} color={C.violet} /> Open priority relationships
          <ChevronRight size={14} />
        </Link>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
          gap: 10,
        }}
      >
        {cohorts.map((c) => {
          const inProduct = product
            ? (c.products_affected[product] ?? 0)
            : null;
          const neg = Object.values(c.negative_by_channel).reduce(
            (s, n) => s + n,
            0,
          );
          const hot = c.open_over_24h > 0;
          return (
            <Link
              key={c.id}
              href={`/hdfc-pulse/v2/priority?from=${from}#${c.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: hot ? tint(C.red, 0.05) : C.cardAlt,
                border: `1px solid ${hot ? tint(C.red, 0.25) : C.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 15.5, fontWeight: 700 }}>
                  {c.label}
                </span>
                <span style={{ fontSize: 12.5, color: C.textMut }}>
                  {fmt(c.customers)} customers
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 6,
                }}
              >
                <Mini
                  label={product ? "Open here" : "Open"}
                  value={fmt(inProduct ?? c.open)}
                  color={C.amber}
                />
                <Mini
                  label={product ? "Over 5 h, any product" : "Over 5 h"}
                  value={fmt(c.open_over_5h)}
                  color={C.amber}
                />
                <Mini
                  label={product ? "Over 24 h, any product" : "Over 24 h"}
                  value={fmt(c.open_over_24h)}
                  color={C.red}
                />
              </div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.45 }}>
                {fmt(c.customers_with_open_issue)} customers with an open issue
                · {fmt(neg)} negative mentions across channels.{" "}
                <span style={{ color: C.red, fontWeight: 600 }}>
                  RM told today: {fmt(c.rm_notified_today)} of{" "}
                  {fmt(c.rm_should_know)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <MutedNote>
        Flags prioritise service. They never restrict or downgrade it. A
        complaint&apos;s impact (a regulator named, legal language, a public
        post with reach) is marked on the complaint, never on the person.
      </MutedNote>
    </Tile>
  );
}

function Mini({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "6px 8px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 800,
          fontFamily: MONO,
          color,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- product pulse */

function trendCell(p: PublicProductRow): ReactNode {
  if (p.trend_change_pct === null)
    return <span style={{ color: C.textMut }}>too few to trend</span>;
  const up = p.trend_change_pct > 0;
  return (
    <span style={{ color: up ? C.amber : C.green, fontFamily: MONO }}>
      {fmtSigned(p.trend_change_pct)}
    </span>
  );
}

export function ProductPulseTable({ b, from }: { b: Bundle; from: View }) {
  const pub = Object.fromEntries(b.products.rows.map((r) => [r.id, r]));
  const inn = Object.fromEntries(b.v3.products.map((r) => [r.id, r])) as Record<
    string,
    InternalProductRow
  >;
  const ledger = b.v3.deliverables;
  // Public descriptions of a delay, per product: allocated promise-break mentions.
  return (
    <Tile
      id="by-product"
      title="Pulse by product"
      sub="The morning review, product by product. Public voice beside the bank's own queues. Each row opens its module or product page."
      prov={["public", "internal"]}
      tone="cyan"
    >
      <Table
        head={[
          "Product",
          "Negative signals (public)",
          "Trend",
          "Open / open too long (inside)",
          "Deliverables met / outside (inside)",
          "Public posts describing a delay",
          "Top issue",
          "Escalation language (public)",
          "",
        ]}
        align={[
          "left",
          "right",
          "right",
          "right",
          "right",
          "right",
          "left",
          "right",
          "right",
        ]}
        rows={PRODUCT_ORDER.map((id) => {
          const p = pub[id] as PublicProductRow;
          const i = inn[id];
          const thin = p.count < 30;
          return [
            <Link
              key={id}
              href={productHref(id, from)}
              style={{ color: C.text, fontWeight: 650, textDecoration: "none" }}
            >
              {p.label}
            </Link>,
            thin ? (
              <span key="n" style={{ color: C.textMut }}>
                {p.count
                  ? `${fmt(p.negative)} (thin)`
                  : "not tagged in public voice"}
              </span>
            ) : (
              <span key="n" style={{ fontFamily: MONO, color: C.text }}>
                {fmt(p.negative)}{" "}
                <span style={{ color: C.textMut }}>of {fmt(p.count)}</span>
              </span>
            ),
            trendCell(p),
            <span key="o" style={{ fontFamily: MONO }}>
              {fmt(i.open)} /{" "}
              <span style={{ color: i.open_too_long ? C.red : C.textSec }}>
                {fmt(i.open_too_long)}
              </span>
            </span>,
            <span key="d" style={{ fontFamily: MONO }}>
              {fmtPct(i.deliverables.met_pct)} /{" "}
              <span style={{ color: C.amber }}>
                {fmt(i.deliverables.outside)}
              </span>
            </span>,
            <span key="pb" style={{ fontFamily: MONO }}>
              {thin ? "—" : fmt(p.promise_break_mentions)}
            </span>,
            p.top_issue && !thin
              ? p.top_issue.label
              : (i.top_issue?.label ?? "—"),
            <span key="e" style={{ fontFamily: MONO }}>
              {thin ? "—" : fmt(p.escalation)}
            </span>,
            <Link
              key="go"
              href={productHref(id, from)}
              aria-label={`Open ${p.label}`}
              style={{ color: C.textMut }}
            >
              <ChevronRight size={16} />
            </Link>,
          ];
        })}
      />
      <MutedNote>
        Negative signals count each public item once (
        {fmt(b.products.total_rows)} items across these rows;{" "}
        {fmt(Object.values(b.products.excluded).reduce((s, n) => s + n, 0))}{" "}
        wealth, SME and corporate items sit outside the table). Loans are split
        by the loan apps and by keyword, so the split is approximate.{" "}
        {b.products.trend_rule} Deliverables are measured on closed items and on
        open items already past their TAT ({ledger.length} deliverable types).
        Group-company apps are excluded.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- filter */

export function ProductFilter({
  current,
  from,
  b,
}: {
  current?: ProductId;
  from: View;
  b: Bundle;
}) {
  const label = Object.fromEntries(b.products.rows.map((r) => [r.id, r.label]));
  const chip = (href: string, text: string, on: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={on ? "page" : undefined}
      style={{
        padding: "4px 11px",
        borderRadius: 999,
        textDecoration: "none",
        fontSize: 13.5,
        color: on ? C.text : C.textSec,
        background: on ? C.brandSoft : "transparent",
        border: `1px solid ${on ? `${C.brand}66` : C.border}`,
        fontWeight: on ? 700 : 500,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Link>
  );
  return (
    <div
      data-testid="product-filter"
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 13.5, color: C.textMut, marginRight: 2 }}>
        Product:
      </span>
      {chip(`/hdfc-pulse/v2/${from}`, "All products", !current)}
      {PRODUCT_ORDER.map((id) =>
        chip(
          `/hdfc-pulse/v2/business/${id}?from=${from}`,
          label[id] as string,
          current === id,
        ),
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- customer memory */

export function CustomerMemory({ b, from }: { b: Bundle; from: View }) {
  const m = b.v3.customer_memory;
  const story = b.v3.personas.find((p) => p.story);
  return (
    <Tile
      id="customer-pulse"
      title="Customer pulse: one customer, every product"
      sub="LisN remembers each customer across products and channels. A flag set in one product follows the customer into the next."
      prov="internal"
      tone="violet"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
          gap: 8,
        }}
      >
        <MemoryStat
          label="Negative in 2+ products"
          value={fmt(m.negative_in_two_or_more_products)}
          sub={`of ${fmt(m.customers_with_signals)} customers with a signal`}
        />
        <MemoryStat
          label="Still open"
          value={fmt(m.with_open_issue)}
          sub="with an issue open today"
          color={C.amber}
        />
        <MemoryStat
          label="Open too long"
          value={fmt(m.with_open_too_long)}
          sub="past the deliverable in at least one product"
          color={C.red}
        />
        <MemoryStat
          label="Priority customers among them"
          value={fmt(m.priority_among_them)}
          sub="on a list or in the ultra-HNI or HNI tier"
          color={C.violet}
        />
      </div>
      <div style={{ fontSize: 13.5, color: C.textSec }}>
        Most common pairs:{" "}
        {m.pairs
          .slice(0, 3)
          .map((p) => `${p.pair} (${fmt(p.customers)})`)
          .join(" · ")}
      </div>
      {story ? (
        <Link
          href={`/hdfc-pulse/v2/customer/${story.masked_id}?from=${from}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            background: tint(C.violet, 0.06),
            border: `1px solid ${tint(C.violet, 0.3)}`,
            borderLeft: `3px solid ${C.violet}`,
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14.5, color: C.textSec, lineHeight: 1.45 }}>
            <strong style={{ color: C.text }}>
              {story.persona} ({story.masked_id})
            </strong>
            : {story.trail.length} touchpoints across{" "}
            {new Set(story.trail.map((t) => t.team)).size} teams in{" "}
            {hoursLabel(
              (new Date(story.trail[story.trail.length - 1].at).getTime() -
                new Date(story.trail[0].at).getTime()) /
                3.6e6,
            )}
            . No one saw the pattern; the RM was not told.
          </span>
          <ChevronRight size={16} color={C.textDim} style={{ flexShrink: 0 }} />
        </Link>
      ) : null}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <OwnerChip owner="cx" />
        <OwnerChip owner="rm" />
      </div>
    </Tile>
  );
}

function MemoryStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "10px 12px",
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
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          fontFamily: MONO,
          color: color ?? C.text,
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12.5, color: C.textSec, marginTop: 2 }}>
        {sub}
      </div>
    </div>
  );
}
