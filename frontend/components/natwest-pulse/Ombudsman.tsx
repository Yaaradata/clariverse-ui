/**
 * NatWest Group · S-FOS Ombudsman watch (re-bound from the Ombudsman watch): Financial Ombudsman Service states as at
 * the freeze, by theme, product and brand. Eligibility and risk, never prediction (HL-27). Every rule line comes from a
 * register entry. At-risk is a subset of complaints awaiting a final response.
 */

import { DEFINITIONS } from "@/lib/natwest-pulse/copy";
import {
  type FosBlock,
  type FosRow,
  fmtN,
  fmtP,
  type RegisterEntry,
} from "@/lib/natwest-pulse/nw";
import { C, Kpi, MONO, PAIRS, Table, Tile } from "./primitives";

const ROWS = 6;

/** A register entry as one line, its basis and source status behind an (i). */
export function RegisterLine({ e }: { e: RegisterEntry }) {
  const note = `${e.basis}. ${e.status}.`;
  return (
    <div
      data-testid="register-line"
      data-register={e.id}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "baseline",
        flexWrap: "wrap",
        fontSize: 13.5,
        color: C.textSec,
      }}
    >
      <span style={{ color: C.text, fontWeight: 650 }}>{e.label}:</span>
      <span style={{ fontFamily: MONO }}>{e.value}</span>
      <span
        title={note}
        role="img"
        aria-label={note}
        style={{
          fontSize: 11.5,
          color: C.textMut,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 999,
          padding: "0 6px",
          cursor: "help",
        }}
      >
        i
      </span>
    </div>
  );
}

function StateTable({ rows, label }: { rows: FosRow[]; label: string }) {
  const shown = rows.filter((r) => r.total > 0);
  const body = (rs: FosRow[]) =>
    rs.map((r) => [
      <span key="l" style={{ color: C.text }}>
        {r.label}
      </span>,
      <span key="w" style={{ fontFamily: MONO }}>
        {fmtN(r.within)}
      </span>,
      <span
        key="a"
        style={{ fontFamily: MONO, color: r.at_risk ? C.amber : C.textSec }}
      >
        {fmtN(r.at_risk)}
      </span>,
      <span
        key="e"
        style={{ fontFamily: MONO, color: r.eligible ? C.red : C.textSec }}
      >
        {fmtN(r.eligible)}
      </span>,
      <span key="c" style={{ fontFamily: MONO }}>
        {fmtN(r.clock_running)}
      </span>,
      <span key="r" style={{ fontFamily: MONO }}>
        {fmtN(r.referred)}
      </span>,
    ]);
  const head = [
    label,
    "Within time",
    "At risk",
    "Eligible to refer",
    "Clock running",
    "Referred",
  ];
  const align: ("left" | "right")[] = [
    "left",
    "right",
    "right",
    "right",
    "right",
    "right",
  ];
  return (
    <>
      <Table head={head} align={align} rows={body(shown.slice(0, ROWS))} />
      {shown.length > ROWS ? (
        <details>
          <summary
            style={{ cursor: "pointer", fontSize: 13.5, color: C.brandInk }}
          >
            Show all {shown.length}
          </summary>
          <div style={{ marginTop: 8 }}>
            <Table head={head} align={align} rows={body(shown.slice(ROWS))} />
          </div>
        </details>
      ) : null}
    </>
  );
}

export function OmbudsmanWatch({
  fos,
  rules,
  windowLabel,
}: {
  fos: FosBlock;
  rules: RegisterEntry[];
  windowLabel: string;
}) {
  const eligible = fos.states.find((s) => s.id === "eligible")?.count ?? 0;
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
    gap: 10,
  } as const;
  return (
    <>
      <Tile
        title="Where complaints stand"
        sub={`As at ${fos.as_at}`}
        prov="internal"
        tone={eligible > 0 ? "red" : undefined}
        accent
      >
        <div data-testid="fos-states" style={grid}>
          {fos.states.map((s) => {
            const breach = s.id === "eligible" && s.count > 0;
            return (
              <div
                key={s.id}
                style={{
                  background: breach
                    ? `color-mix(in srgb, ${C.red} 6%, transparent)`
                    : C.cardAlt,
                  border: `1px solid ${breach ? `color-mix(in srgb, ${C.red} 35%, transparent)` : C.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  minWidth: 0,
                }}
              >
                <div style={{ fontSize: 12.5, color: C.textMut }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 24,
                    fontWeight: 800,
                    color: breach ? C.red : C.text,
                  }}
                >
                  {fmtN(s.count)}
                </div>
                <div style={{ fontSize: 12.5, color: C.textSec }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={grid}>
          <Kpi
            label="Awaiting final response"
            value={fmtN(fos.pending)}
            sub="Within time plus eligible"
          />
          <Kpi
            label="At risk"
            value={fmtN(fos.at_risk)}
            sub="Subset of awaiting; 7 days or fewer"
            tone={fos.at_risk ? "amber" : undefined}
          />
          <Kpi
            label="Payment services awaiting"
            value={fmtN(fos.psd_pending)}
            sub="15 business days rule"
          />
        </div>
        <div style={{ fontSize: 12.5, color: C.textMut, lineHeight: 1.5 }}>
          Eligibility and risk only; LisN does not predict who will refer. At
          risk: {DEFINITIONS.at_risk}
        </div>
      </Tile>
      <div style={PAIRS}>
        <Tile title="The rules applied" sub="From the register" prov="public">
          {rules.map((e) => (
            <RegisterLine key={e.id} e={e} />
          ))}
          <div style={{ fontSize: 12.5, color: C.textMut }}>
            Source citations pending the research pack.
          </div>
        </Tile>
        <Tile
          title={`Flows, ${windowLabel.toLowerCase()}`}
          sub="Received, answered, referred"
          prov="internal"
        >
          <div style={grid}>
            <Kpi
              label="Received"
              value={fmtN(fos.flows.received)}
              sub="Complaints"
            />
            <Kpi
              label="Final responses"
              value={fmtN(fos.flows.final_responses)}
              sub={`${fmtP(fos.flows.on_time_pct)} within the limit`}
            />
            <Kpi
              label="Referred"
              value={fmtN(fos.flows.referred)}
              sub="To the Ombudsman Service"
            />
          </div>
        </Tile>
      </div>
      <Tile
        title="By theme"
        sub="Ordered by eligible and at risk"
        prov="internal"
      >
        <StateTable rows={fos.by_theme} label="Theme" />
      </Tile>
      <div style={PAIRS}>
        <Tile title="By product" sub="Same states, by product" prov="internal">
          <StateTable rows={fos.by_product} label="Product" />
        </Tile>
        <Tile title="By brand" sub="Same states, by brand" prov="internal">
          {fos.by_brand.length > 1 ? (
            <StateTable rows={fos.by_brand} label="Brand" />
          ) : (
            <div style={{ fontSize: 14, color: C.textSec }}>
              One brand selected. Choose All brands to compare.
            </div>
          )}
        </Tile>
      </div>
    </>
  );
}
