"use client";

/**
 * The one MD's office / Head of CX view (30 Sep review). First scroll: the Customer pulse (internal list cards, then the
 * external block), the CX pulse and the Ombudsman watch. Second scroll: today's morning brief with the business cards, then the reputation
 * pulse by product. Every section follows the period filter.
 */

import type { Bundle } from "@/lib/hdfc-v3/types";
import { MorningBrief } from "./Brief";
import { OmbudsmanWatch } from "./Ombudsman";
import { CustomerPulse, CxPulse, usePeriod } from "./Pulse";
import { OpenTooLongTile, setOwnerRoles } from "./V4";

export function MdView({ b }: { b: Bundle }) {
  const p = usePeriod(b.periods);
  setOwnerRoles(b.periods.v4?.owner_roles);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomerPulse p={p} />
      <CxPulse p={p} />
      {/* B11 item 2: open too long at bank level and for each business; the list is one click away. */}
      <OpenTooLongTile
        o={p.v4.bank.open_too_long}
        title="Open too long: the bank and each business"
        businesses={p.v4.bank.open_too_long.by_business}
      />
      <OmbudsmanWatch o={p.ombudsman} p={p} scope="bank" />
      <MorningBrief p={p} />
    </div>
  );
}
