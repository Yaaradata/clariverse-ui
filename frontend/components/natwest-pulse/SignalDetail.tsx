/**
 * NatWest Group · one Cora journey (re-bound from the signal detail): the leakage trend, where it comes back, by brand
 * and segment, and the owner. Internal and illustrative.
 */

import { OUTCOME_LABEL } from "@/lib/natwest-pulse/copy";
import {
  type CoraAgg,
  fmtN,
  fmtP,
  type JourneyBlock,
} from "@/lib/natwest-pulse/nw";
import { AreaTrend } from "./Pulse";
import { C, Kpi, MONO, PAIRS, Table, Tile } from "./primitives";

function Split({
  rows,
  label,
}: {
  rows: (CoraAgg & { id: string; label: string })[];
  label: string;
}) {
  return (
    <Table
      head={[label, "Marked resolved", "As call", "As complaint", "Leakage"]}
      align={["left", "right", "right", "right", "right"]}
      rows={rows.map((x) => [
        <span key="l" style={{ color: C.text }}>
          {x.label}
        </span>,
        <span key="r" style={{ fontFamily: MONO }}>
          {fmtN(x.resolved)}
        </span>,
        <span key="c" style={{ fontFamily: MONO }}>
          {fmtN(x.back_call)}
        </span>,
        <span key="k" style={{ fontFamily: MONO }}>
          {fmtN(x.back_complaint)}
        </span>,
        <span key="x" style={{ fontFamily: MONO }}>
          {fmtP(x.leakage_pct)}
        </span>,
      ])}
    />
  );
}

export function SignalDetail({
  j,
  productLabel,
}: {
  j: JourneyBlock;
  productLabel: string;
}) {
  return (
    <>
      <Tile
        title={`${j.label}: Cora leakage`}
        sub={`${productLabel} · ${j.owner}`}
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
            value={fmtN(j.conversations)}
            sub="In the window"
          />
          <Kpi label="Marked resolved" value={fmtN(j.resolved)} sub="By Cora" />
          <Kpi
            label="Back within 7 days"
            value={fmtP(j.leakage_pct)}
            sub={`${fmtN(j.back_call + j.back_complaint)} journeys`}
          />
          <Kpi
            label="Calls on this journey"
            value={fmtN(j.calls)}
            sub="All calls in the window"
          />
          <Kpi
            label="Complaints"
            value={fmtN(j.complaints)}
            sub={`${fmtP(j.complaints_upheld_pct)} upheld`}
          />
        </div>
        <AreaTrend data={j.trend} unit="%" label="Back within 7 days" />
      </Tile>
      <div style={PAIRS}>
        <Tile
          title="By brand"
          sub="Leakage of resolved journeys"
          prov="internal"
        >
          <Split rows={j.by_brand} label="Brand" />
        </Tile>
        <Tile
          title="By segment"
          sub="Leakage of resolved journeys"
          prov="internal"
        >
          <Split rows={j.by_segment} label="Segment" />
        </Tile>
      </div>
      <Tile
        title="Owner and next step"
        sub="A recommendation, routed"
        prov="internal"
      >
        <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>
          Owner: <strong style={{ color: C.text }}>{j.owner}</strong>. Consumer
          Duty: {OUTCOME_LABEL[j.outcome]}. Review where Cora marks this journey
          resolved.
        </div>
      </Tile>
    </>
  );
}
