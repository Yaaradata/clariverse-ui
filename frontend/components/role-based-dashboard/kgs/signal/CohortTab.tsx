"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { CohortMiniTable } from "./CohortMiniTable";
import { fill, int } from "./format";

/** Cohort tab (04 §4.10): cohort line, region table, eligible count, disabled "Export list". */
export function CohortTab() {
  const L = useLabel();
  const { cohort } = signalFw41;
  const { cohortHeadline, eligible, exportList } = meta.ui.hero;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          fontSize: 14,
          color: K.textSec,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {L(
          fill(cohortHeadline, {
            panels: int(cohort.panels),
            serialRange: cohort.serialRange,
          }),
        )}
      </div>
      <CohortMiniTable />
      <div
        style={{
          fontSize: 14,
          color: K.textSec,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fill(eligible, { n: int(cohort.eligibleNotUpgraded) })}
      </div>
      <button
        type="button"
        aria-disabled
        title={cohort.exportTooltip}
        onClick={(e) => e.preventDefault()}
        className="kgs-focus"
        style={{
          alignSelf: "flex-start",
          padding: "7px 12px",
          borderRadius: K.radius.chip,
          background: K.elevated,
          border: `1px solid ${K.chipBorder}`,
          color: K.textMut,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "not-allowed",
        }}
      >
        {exportList}
      </button>
    </div>
  );
}
