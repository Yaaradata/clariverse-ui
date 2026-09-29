"use client";

import { installedBase } from "@kgs/lib/data";
import { useKgsNav } from "../nav";
import { useLabel } from "../shell/DemoProvider";
import { Panel } from "./Panel";
import { SegmentTable } from "./SegmentTable";

const P = installedBase.panelCopy["P-E"];
const STATUS_COLUMN = 5;

/**
 * P-E (04 §3.7): one fault phrased many ways, counted once, beside today's coding. Signal rows
 * link. Full width: six columns do not fit a one-third grid column legibly.
 */
export function EmergingPhrasingTable() {
  const L = useLabel();
  const { go } = useKgsNav();
  return (
    <Panel title={L(P.title)} sub={L(P.sub ?? "")} right={L(P.right ?? "")}>
      <SegmentTable
        columns={P.columns ?? []}
        rows={installedBase.emergingPhrasing}
        chipColumn={STATUS_COLUMN}
        figures={[2, 3]}
        onRow={(r) => r.linkTo && go(r.linkTo)}
        caption={L(P.title)}
      />
    </Panel>
  );
}
