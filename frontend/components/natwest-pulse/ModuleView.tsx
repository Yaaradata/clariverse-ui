/**
 * NatWest Group · S-CORA Cora leakage (re-bound from the module view, module cora_digital): journeys Cora marked
 * resolved that came back as a call or a complaint within 7 days, by journey, product and segment. Internal and
 * illustrative; joining Cora logs to call and complaint records needs bank systems.
 */

import Link from "next/link";

import { DEFINITIONS } from "@/lib/natwest-pulse/copy";
import {
  type BrandId,
  type CoraBlock,
  type CoraJourney,
  fmtBig,
  fmtN,
  fmtP,
  nwHref,
  vsPrev,
  type WindowId,
} from "@/lib/natwest-pulse/nw";
import { AreaTrend, Delta } from "./Pulse";
import { BarRow, C, Kpi, MONO, PAIRS, Table, Tile } from "./primitives";

const ROWS = 6;

export function CoraModule({
  cora,
  w,
  b,
  windowLabel,
  productLabel,
}: {
  cora: CoraBlock;
  w: WindowId;
  b: BrandId;
  windowLabel: string;
  productLabel: Record<string, string>;
}) {
  const showDelta = w !== "w13";
  const max = Math.max(
    1,
    ...cora.by_product.map((p) => p.back_call + p.back_complaint),
  );
  const top = cora.journeys[0];
  const row = (j: CoraJourney) => [
    <Link
      key="l"
      href={nwHref(`signal/${j.id}`, w, b)}
      style={{ color: C.text, fontWeight: 650 }}
    >
      {j.label}
    </Link>,
    <span key="p">{productLabel[j.product]}</span>,
    <span key="r" style={{ fontFamily: MONO }}>
      {fmtN(j.resolved)}
    </span>,
    <span key="c" style={{ fontFamily: MONO }}>
      {fmtN(j.back_call)}
    </span>,
    <span key="k" style={{ fontFamily: MONO }}>
      {fmtN(j.back_complaint)}
    </span>,
    <strong key="x" style={{ fontFamily: MONO, color: C.text }}>
      {fmtP(j.leakage_pct)}
    </strong>,
    showDelta ? (
      <Delta key="d" value={j.leakage_delta} kind="pts" />
    ) : (
      <span key="o">{j.owner}</span>
    ),
  ];
  const head = [
    "Journey",
    "Product",
    "Marked resolved",
    "Back as call",
    "Back as complaint",
    "Leakage",
    showDelta ? "Change" : "Owner",
  ];
  const align: ("left" | "right")[] = [
    "left",
    "left",
    "right",
    "right",
    "right",
    "right",
    "right",
  ];
  return (
    <>
      <Tile
        title="Resolved by Cora, then back"
        sub={
          showDelta ? `Change ${vsPrev(windowLabel)}` : "Levels in the window"
        }
        prov={["internal", "joined"]}
        accent
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
            gap: 10,
          }}
        >
          <Kpi
            label="Cora conversations"
            value={fmtBig(cora.conversations)}
            sub="In the window"
          />
          <Kpi
            label="Marked resolved"
            value={fmtP(cora.resolved_pct)}
            sub={`${fmtBig(cora.resolved)} journeys`}
          />
          <Kpi
            label="Back within 7 days"
            value={fmtP(cora.leakage_pct)}
            sub={
              showDelta ? (
                <Delta value={cora.leakage_delta} kind="pts" />
              ) : (
                "Of journeys marked resolved"
              )
            }
            tone={(cora.leakage_delta ?? 0) > 0 ? "amber" : undefined}
          />
          <Kpi
            label="Back as a call"
            value={fmtN(cora.back_call)}
            sub="Within 7 days"
          />
          <Kpi
            label="Back as a complaint"
            value={fmtN(cora.back_complaint)}
            sub="Within 7 days"
          />
        </div>
        {top ? (
          <div style={{ fontSize: 14, color: C.textSec }}>
            Largest leak:{" "}
            <Link
              href={nwHref(`signal/${top.id}`, w, b)}
              style={{ color: C.brandInk }}
            >
              {top.label}
            </Link>
            , {fmtP(top.leakage_pct)} back within 7 days.
          </div>
        ) : null}
        <AreaTrend data={cora.trend} unit="%" label="Back within 7 days" />
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          {DEFINITIONS.leakage}
        </div>
      </Tile>
      <Tile
        title="Leakage by journey"
        sub="Ordered by journeys back"
        prov={["internal", "joined"]}
        id="journeys"
      >
        <Table
          head={head}
          align={align}
          rows={cora.journeys.slice(0, ROWS).map(row)}
        />
        {cora.journeys.length > ROWS ? (
          <details>
            <summary
              style={{ cursor: "pointer", fontSize: 13.5, color: C.brandInk }}
            >
              Show all {cora.journeys.length}
            </summary>
            <div style={{ marginTop: 8 }}>
              <Table
                head={head}
                align={align}
                rows={cora.journeys.slice(ROWS).map(row)}
              />
            </div>
          </details>
        ) : null}
      </Tile>
      <div style={PAIRS}>
        <Tile
          title="By product"
          sub="Journeys back within 7 days"
          prov="internal"
        >
          {cora.by_product.map((p) => (
            <BarRow
              key={p.id}
              label={p.label}
              value={p.back_call + p.back_complaint}
              max={max}
              right={
                <span style={{ fontFamily: MONO }}>
                  {fmtN(p.back_call + p.back_complaint)} · {fmtP(p.leakage_pct)}
                </span>
              }
              color={C.cyan}
            />
          ))}
        </Tile>
        <Tile
          title="By segment"
          sub="Leakage of resolved journeys"
          prov="internal"
        >
          <Table
            head={["Segment", "Marked resolved", "Leakage"]}
            align={["left", "right", "right"]}
            rows={cora.by_segment.map((s) => [
              <span key="l" style={{ color: C.text }}>
                {s.label}
              </span>,
              <span key="r" style={{ fontFamily: MONO }}>
                {fmtN(s.resolved)}
              </span>,
              <span key="x" style={{ fontFamily: MONO }}>
                {fmtP(s.leakage_pct)}
              </span>,
            ])}
          />
        </Tile>
      </div>
    </>
  );
}
