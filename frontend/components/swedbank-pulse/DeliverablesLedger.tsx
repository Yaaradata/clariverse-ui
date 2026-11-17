"use client";

/**
 * D1 · Deliverables ledger (B7 §1): each service standard with its standard, compensation, met, outside, open too long, public
 * posts describing a delay, owner and action. A standard is an FCA published standard, a bank-confirmed SLA (both with their
 * source under the standard), or, while unconfirmed, "Bank service standard: confirm in discovery". A second table splits "met" by product.
 */

import { fmt, fmtPct } from "@/lib/swedbank-pulse/format";
import type { Bundle, LedgerRow, ProductId } from "@/lib/swedbank-pulse/types";
import {
  ActionChip,
  AnswerLine,
  C,
  MONO,
  MutedNote,
  OwnerChip,
  Table,
  Tile,
} from "./primitives";
import { PRODUCT_ORDER } from "./V3Blocks";

const REQUEST_TYPE: Record<string, string> = {
  failed_reversal: "reversal",
  card_closure: "closure",
  credit_report: "credit_report",
  card_dispatch: "card_delivery",
  dispute: "dispute",
  refund: "refund",
  service_request: "kyc",
  loan_disbursal: "loan_disbursal",
};
const OWNER: Record<string, string> = {
  failed_reversal: "payments",
  card_closure: "cards",
  unauthorised_reversal: "fraud_cyber",
  credit_report: "compliance",
  loan_documents: "loans",
  complaint_resolution: "cx",
  card_dispatch: "operations",
  dispute: "operations",
  refund: "operations",
  service_request: "operations",
  account_unfreeze: "operations",
  loan_disbursal: "loans",
  query_response: "cx",
};
const SHORT: Record<string, string> = {
  cards: "Credit cards",
  payments_fraud: "Payments",
  current_accounts: "Accounts",
  personal_loans: "Loans",
  mortgages: "Mortgages",
  savings: "Savings",
  digital: "Cora",
};

/** The recommended action for a ledger row, from its own figures (review finding #40). */
function rowAction(r: {
  open_too_long: number;
  open_within: number;
  met_pct: number | null;
}): string {
  const open = r.open_too_long + r.open_within;
  if (open && r.open_too_long / open >= 0.25) return "Set a new date";
  if ((r.met_pct ?? 100) < 80) return "Route with evidence";
  if (r.open_too_long) return "Update and close";
  return "Monitor";
}

function TatCell({ row }: { row: LedgerRow }) {
  switch (row.source) {
    case "fca":
    case "psr":
    case "psrs":
    case "scheme":
    case "industry":
    case "bank_indicative":
    case "bank_confirmed":
      return (
        <span>
          {row.tat_label}
          <div
            style={{
              fontSize: 12,
              color: ["fca", "psr", "psrs", "scheme"].includes(row.source)
                ? C.cyan
                : C.textMut,
            }}
          >
            {row.source_note}
          </div>
        </span>
      );
    case "bank":
      return <span style={{ color: C.textMut }}>{row.tat_label}</span>;
    default: {
      const unreachable: never = row.source;
      return unreachable;
    }
  }
}

export function DeliverablesLedger({ b }: { b: Bundle }) {
  const rows = b.v3.deliverables;
  const pubBy = Object.fromEntries(
    b.signals.promise_by_request_type.map((p) => [p.request_type, p.count]),
  );
  const measured = rows.reduce((s, r) => s + r.measured, 0);
  const met = rows.reduce((s, r) => s + r.met, 0);
  const otl = rows.reduce((s, r) => s + r.open_too_long, 0);
  const worst = [...rows]
    .filter((r) => r.measured >= 50)
    .sort((a, z) => (a.met_pct ?? 100) - (z.met_pct ?? 100))[0];
  return (
    <>
      <Tile prov={["internal", "public"]} accent tone="violet">
        <AnswerLine
          sub={`Sample of ${fmt(b.v3.sample.interactions)} contacts (illustrative). Weakest: ${worst?.label.toLowerCase()} at ${fmtPct(worst?.met_pct)} met. Rows citing the FCA, the PSRs or Faster Payments are published standards; the rest are the bank's own, shown as figures once the bank confirms them.`}
        >
          {fmtPct((100 * met) / measured)} of service standards met across{" "}
          {rows.length} service standard types; {fmt(otl)} items are open past
          their standard this morning.
        </AnswerLine>
      </Tile>
      <Tile
        id="ledger"
        title="Service standards ledger"
        sub={`Inside figures: a sample of ${fmt(b.v3.sample.interactions)} contacts, illustrative until discovery; public posts describing a delay are live.`}
        prov={["internal", "public"]}
        tone="violet"
      >
        <Table
          head={[
            "Service standard",
            "Standard",
            "Redress",
            "Met",
            "Outside",
            "Open too long",
            "Public posts describing a delay",
            "Owner",
            "Action",
          ]}
          align={[
            "left",
            "left",
            "left",
            "right",
            "right",
            "right",
            "right",
            "left",
            "left",
          ]}
          rows={rows.map((r) => [
            <span key="l" style={{ color: C.text, fontWeight: 600 }}>
              {r.label}
            </span>,
            <TatCell key="t" row={r} />,
            r.redress,
            <span key="m" style={{ fontFamily: MONO }}>
              {fmtPct(r.met_pct)}
            </span>,
            <span key="o" style={{ fontFamily: MONO, color: C.amber }}>
              {fmt(r.outside)}
            </span>,
            <span
              key="x"
              style={{
                fontFamily: MONO,
                color: r.open_too_long ? C.red : C.textSec,
              }}
            >
              {fmt(r.open_too_long)}
            </span>,
            <span key="p" style={{ fontFamily: MONO }}>
              {REQUEST_TYPE[r.id] ? fmt(pubBy[REQUEST_TYPE[r.id]] ?? 0) : "—"}
            </span>,
            <OwnerChip key="w" owner={OWNER[r.id] ?? "cx"} />,
            <ActionChip key="a" action={rowAction(r)} />,
          ])}
        />
        <MutedNote>
          FCA rows use published FCA standards. Where FCA sets none, the
          standard is the bank&apos;s confirmed SLA, with its source document
          under the standard. Any row still reading &ldquo;Bank standard:
          confirm in discovery&rdquo; is unconfirmed; on those rows, met,
          outside and open too long come from the illustrative sample, measured
          against a placeholder that is not a bank figure. Met = closed within
          the standard (for the first-response row: answered within it). Outside
          = settled late, or open and already past the standard. Business days
          skip weekends and bank holidays. Public posts describing a delay are
          matched to a service standard by request type; &ldquo;—&rdquo; where
          public voice has no matching type. Action: set a new date when a
          quarter or more of the open items are past the standard; route with
          evidence when under 80% is met; update and close when a few items are
          past the standard; otherwise monitor.
        </MutedNote>
      </Tile>
      <Tile
        id="by-product"
        title="Service standards met, by product"
        sub="Share met for each service standard within each product. Amber: under 75% met. Blank where a product has fewer than 5 items."
        prov="internal"
        tone="violet"
      >
        <Table
          head={["Service standard", ...PRODUCT_ORDER.map((p) => SHORT[p])]}
          align={["left", ...PRODUCT_ORDER.map(() => "right" as const)]}
          rows={rows.map((r) => {
            const by = Object.fromEntries(
              r.products.map((p) => [p.product, p]),
            ) as Record<ProductId, (typeof r.products)[number]>;
            return [
              r.label,
              ...PRODUCT_ORDER.map((p) => {
                const x = by[p];
                if (!x) return "";
                return (
                  <span
                    key={p}
                    style={{
                      fontFamily: MONO,
                      // Red is for breaches only; a low share met is a warning (review finding #39).
                      color: (x.met_pct ?? 100) < 75 ? C.amber : C.textSec,
                    }}
                  >
                    {fmtPct(x.met_pct)}
                  </span>
                );
              }),
            ];
          })}
        />
      </Tile>
    </>
  );
}
