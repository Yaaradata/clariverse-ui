"use client";

/**
 * The one MD's office / Head of CX view (30 Sep review): the pulse first (Customer pulse, CX pulse), then today's
 * morning brief. Every section follows the period filter and shows its period.
 */

import type { Bundle } from "@/lib/hdfc-v3/types";
import { ExecPage } from "./ExecPage";
import { CustomerPulse, CxPulse, PeriodFilter, usePeriod } from "./Pulse";

export function MdView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PeriodFilter file={b.periods} current={p} />
      <CustomerPulse p={p} />
      <CxPulse p={p} />
      <ExecPage b={b} view="mds-office" />
    </div>
  );
}
