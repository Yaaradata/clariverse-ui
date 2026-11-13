/**
 * NatWest Group · timelines ledger (re-bound from the deliverables ledger): each rule from the register, measured in
 * the window; met + outside = measured. Red marks a breach (HL-24).
 */

import {
  fmtN,
  fmtP,
  type LedgerRow,
  type RegisterEntry,
} from "@/lib/natwest-pulse/nw";
import { C, MONO, Table, Tile } from "./primitives";

export function DeliverablesLedger({
  rows,
  register,
}: {
  rows: LedgerRow[];
  register: RegisterEntry[];
}) {
  const reg = Object.fromEntries(register.map((e) => [e.id, e]));
  return (
    <Tile
      title="Timelines met and missed"
      sub="Measured in the window"
      prov="internal"
      id="ledger"
    >
      <Table
        head={["Timeline", "Rule", "Measured", "Met", "Outside", "Met share"]}
        align={["left", "left", "right", "right", "right", "right"]}
        rows={rows.map((r) => [
          <strong key="l" style={{ color: C.text }}>
            {r.label}
          </strong>,
          <span
            key="g"
            title={
              reg[r.register]
                ? `${reg[r.register].basis}. ${reg[r.register].status}.`
                : undefined
            }
          >
            {reg[r.register]?.value ?? "—"}
          </span>,
          <span key="m" style={{ fontFamily: MONO }}>
            {fmtN(r.measured)}
          </span>,
          <span key="t" style={{ fontFamily: MONO }}>
            {fmtN(r.met)}
          </span>,
          <span
            key="o"
            style={{ fontFamily: MONO, color: r.outside ? C.red : C.textSec }}
          >
            {fmtN(r.outside)}
          </span>,
          <span key="p" style={{ fontFamily: MONO }}>
            {fmtP(r.met_pct)}
          </span>,
        ])}
      />
      <div style={{ fontSize: 12.5, color: C.textMut }}>
        Rules from the register; source citations pending the research pack.
      </div>
    </Tile>
  );
}
