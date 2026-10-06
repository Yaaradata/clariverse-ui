"use client";

/**
 * The one MD's office / Head of CX view (30 Sep review). First scroll: the Customer pulse (internal list cards, then the
 * external block), the CX pulse and the Ombudsman watch. Second scroll: today's morning brief with the business cards, then the reputation
 * pulse by product. Every section follows the period filter.
 */

import type { Bundle } from "@/lib/indusind-v2/types";
import { MorningBrief } from "./Brief";
import { OmbudsmanWatch } from "./Ombudsman";
import { CustomerPulse, CxPulse, usePeriod } from "./Pulse";

export function MdView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomerPulse p={p} />
      <CxPulse p={p} />
      <OmbudsmanWatch o={p.ombudsman} p={p} scope="bank" />
      <MorningBrief p={p} />
    </div>
  );
}
