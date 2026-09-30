"use client";

/**
 * The one MD's office / Head of CX view (30 Sep review). First scroll: the Customer pulse (internal list cards, then the
 * external block) and the CX pulse. Second scroll: today's morning brief with the business cards, then the reputation
 * pulse by product. Every section follows the period filter.
 */

import type { Bundle } from "@/lib/hdfc-v3/types";
import { MorningBrief, ReputationTable } from "./Brief";
import { CustomerPulse, CxPulse, usePeriod } from "./Pulse";

export function MdView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomerPulse p={p} />
      <CxPulse p={p} />
      <MorningBrief p={p} />
      <ReputationTable p={p} />
    </div>
  );
}
