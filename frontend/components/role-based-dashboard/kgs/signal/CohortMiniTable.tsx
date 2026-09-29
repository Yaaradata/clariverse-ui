"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { int } from "./format";

const cell = {
  padding: "6px 8px",
  fontSize: 14,
  fontVariantNumeric: "tabular-nums",
} as const;

/** Cohort table by region with a total row (04 §4.6); also used by the drawer's Cohort tab. */
export function CohortMiniTable() {
  const L = useLabel();
  const { cohort, signal } = signalFw41;
  const { cohortColumns, cohortTotal } = meta.ui.hero;
  const total = [
    cohort.panels,
    cohort.sites,
    cohort.partners,
    signal.evidenceCount ?? 0,
  ];
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        color: K.textSec,
      }}
    >
      <thead>
        <tr>
          {cohortColumns.map((h, i) => (
            <th
              key={h}
              scope="col"
              style={{
                ...cell,
                fontSize: 12,
                fontWeight: 600,
                color: K.textMut,
                textAlign: i === 0 ? "left" : "right",
                borderBottom: `1px solid ${K.borderLight}`,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cohort.regions.map((r) => (
          <tr key={r.region}>
            <th
              scope="row"
              style={{ ...cell, textAlign: "left", fontWeight: 500 }}
            >
              {L(r.region)}
            </th>
            {[r.panels, r.sites, r.partners, r.contacts].map((n, i) => (
              <td
                key={cohortColumns[i + 1]}
                style={{ ...cell, textAlign: "right", fontFamily: K.mono }}
              >
                {int(n)}
              </td>
            ))}
          </tr>
        ))}
        <tr style={{ borderTop: `1px solid ${K.borderLight}` }}>
          <th
            scope="row"
            style={{
              ...cell,
              textAlign: "left",
              fontWeight: 800,
              color: K.text,
            }}
          >
            {cohortTotal}
          </th>
          {total.map((n, i) => (
            <td
              key={cohortColumns[i + 1]}
              style={{
                ...cell,
                textAlign: "right",
                fontFamily: K.mono,
                fontWeight: 800,
                color: K.text,
              }}
            >
              {int(n)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
