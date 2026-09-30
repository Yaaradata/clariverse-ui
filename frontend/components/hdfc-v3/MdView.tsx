"use client";

/**
 * The one MD's office / Head of CX view (30 Sep review). First scroll: the pulse (Customer pulse, CX pulse). Second
 * scroll: today's morning brief with the six business cards, the reputation pulse by product, MD-marked mail and the
 * actions. Every section follows the period filter and shows its period.
 */

import type { Bundle } from "@/lib/hdfc-v3/types";
import { Actions, MdMail, MorningBrief, ReputationTable } from "./Brief";
import { CustomerPulse, CxPulse, PeriodFilter, usePeriod } from "./Pulse";

export function MdView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PeriodFilter file={b.periods} current={p} />
      <CustomerPulse p={p} />
      <CxPulse p={p} />
      <MorningBrief p={p} />
      <ReputationTable p={p} />
      <MdMail p={p} />
      <Actions b={b} />
    </div>
  );
}
