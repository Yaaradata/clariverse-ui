"use client";

/**
 * B1 · Business-head view: the exec page with the product filter set (B7 §1). Dials, the cohort strip, the product's
 * issue pulse, its deliverables and its actions. No separate layout: the same blocks, scoped to one product.
 */

import Link from "next/link";

import { fmt, fmtPct } from "@/lib/hdfc-v3/format";
import {
  itemHref,
  signalFromTheme,
  signalHref,
  themeMap,
  trendWords,
} from "@/lib/hdfc-v3/selectors";
import type { Bundle, ProductId, View } from "@/lib/hdfc-v3/types";
import {
  ActionChip,
  AnswerLine,
  C,
  MONO,
  MutedNote,
  OwnerChip,
  RungChip,
  Status,
  Table,
  Tile,
  tint,
} from "./primitives";
import { useFrom } from "./Shell";
import { CohortStrip, DialsRow, MODULES, ProductFilter } from "./V3Blocks";

export function BusinessView({
  b,
  product,
}: {
  b: Bundle;
  product: ProductId;
}) {
  const from: View = useFrom();
  const pub = b.products.rows.find((r) => r.id === product);
  const inn = b.v3.products.find((r) => r.id === product);
  if (!pub || !inn) return <MutedNote>Product not found.</MutedNote>;
  const tm = themeMap(b);
  const thin = pub.count < 30;
  const issues = pub.issues
    .filter((i) => tm[i.id])
    .slice(0, 6)
    .map((i) => ({ i, t: tm[i.id] }));
  const actions = issues
    .slice(0, 3)
    .map(({ t }) =>
      signalFromTheme(b, t, t.status === "improving" ? "watching" : t.status),
    );
  const ledger = b.v3.deliverables
    .map((d) => ({ d, p: d.products.find((x) => x.product === product) }))
    .filter((x) => x.p);
  const module = MODULES[product];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ProductFilter b={b} from={from} current={product} />
      <Tile prov={["public", "internal"]} accent>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 800,
            color: C.violet,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Business view · {pub.label}
        </div>
        <AnswerLine
          sub={
            thin
              ? `Public voice on ${pub.label.toLowerCase()} is thin in this window (${fmt(pub.count)} items), so this view leans on the bank's own queues.`
              : `Top public issue: ${pub.top_issue?.label ?? "—"}. ${fmt(pub.escalation)} items use escalation language.`
          }
        >
          {thin
            ? `${pub.label}: ${fmt(inn.open)} open inside the bank, ${fmt(inn.open_too_long)} past the deliverable; ${fmtPct(inn.deliverables.met_pct)} of deliverables met.`
            : `${pub.label}: ${fmt(pub.negative)} negative public items; inside, ${fmt(inn.open)} open and ${fmt(inn.open_too_long)} past the deliverable; ${fmtPct(inn.deliverables.met_pct)} of deliverables met.`}
        </AnswerLine>
        {module ? (
          <Link
            href={`/hdfc-pulse/v2/module/${module}?from=${from}`}
            style={{ fontSize: 14, color: C.textSec }}
          >
            Open the {pub.label} module for the full issue list and evidence
          </Link>
        ) : null}
      </Tile>

      <DialsRow b={b} product={product} />
      <CohortStrip b={b} from={from} product={product} />

      <Tile
        title="Issue pulse"
        sub={
          thin
            ? "Too few public items to rank; inside-the-bank top issue shown below."
            : "Public issues for this product, ranked by negative items. Theme mentions: an item can carry up to three."
        }
        prov={thin ? "internal" : "public"}
        tone="amber"
      >
        {thin ? (
          <div style={{ fontSize: 15, color: C.textSec }}>
            Inside the bank, the top issue is{" "}
            <strong style={{ color: C.text }}>
              {inn.top_issue?.label ?? "—"}
            </strong>{" "}
            ({fmt(inn.top_issue?.negative)} negative interactions,
            illustrative).
          </div>
        ) : (
          <Table
            head={[
              "Issue",
              "Mentions",
              "Negative",
              "Escalation",
              "Trend",
              "Owner",
              "Status",
            ]}
            align={["left", "right", "right", "right", "left", "left", "left"]}
            rows={issues.map(({ i, t }) => [
              <Link
                key="l"
                href={signalHref(i.id, from)}
                style={{
                  color: C.text,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {i.label}
              </Link>,
              <span key="c" style={{ fontFamily: MONO }}>
                {fmt(i.count)}
              </span>,
              <span key="n" style={{ fontFamily: MONO }}>
                {fmt(i.negative)}
              </span>,
              <span key="e" style={{ fontFamily: MONO }}>
                {fmt(i.escalation)}
              </span>,
              trendWords(t),
              <OwnerChip key="o" owner={t.owner} />,
              <Status key="s" value={t.status} />,
            ])}
          />
        )}
      </Tile>

      <Tile
        title="Deliverables"
        sub="Measured on closed items and on open items already past their TAT."
        prov="internal"
        tone="violet"
      >
        <Table
          head={[
            "Deliverable",
            "TAT",
            "Met",
            "Outside",
            "Open too long",
            "Compensation",
          ]}
          align={["left", "left", "right", "right", "right", "left"]}
          rows={ledger.map(({ d, p }) => [
            d.label,
            <span
              key="t"
              style={{ color: d.source === "rbi" ? C.text : C.textMut }}
            >
              {d.tat_label}
            </span>,
            fmtPct(p?.met_pct),
            fmt(p?.outside),
            <span
              key="o"
              style={{ color: p?.open_too_long ? C.red : C.textSec }}
            >
              {fmt(p?.open_too_long)}
            </span>,
            d.compensation,
          ])}
        />
      </Tile>

      {!thin ? (
        <Tile
          title="Actions to take"
          sub="The top three issues for this product, each routed to its owner."
          prov="public"
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
            {actions.map((s) => (
              <Link
                key={s.id}
                href={itemHref(s, from)}
                data-testid="action-card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: tint(C.red, 0.04),
                  border: `1px solid ${tint(C.red, 0.22)}`,
                  borderLeft: `3px solid ${C.red}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: 15.5, fontWeight: 700, color: C.text }}
                >
                  {s.label}
                </span>
                <span style={{ fontSize: 13.5, color: C.textSec }}>
                  {s.why}
                </span>
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <OwnerChip owner={s.owner} />
                  <RungChip rung={s.rung} />
                  <ActionChip action={s.action} />
                </span>
              </Link>
            ))}
          </div>
        </Tile>
      ) : null}
      <MutedNote>
        The rest of the business-head view (targets, portfolio measures) is to
        be defined with the business head at the next review.
      </MutedNote>
    </div>
  );
}
