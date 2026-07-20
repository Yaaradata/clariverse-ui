"use client";

import React from "react";
import type { CrossChannelEscalationFlow, CrossChannelMention } from "../../lib/cxHeadRetailV3HubCards";
import { DetailSection } from "./HubDetailPrimitives";
import { EcommerceCrossChannelEscalation } from "./EcommerceCrossChannelEscalation";
import { cssVar } from "../../theme/tokens";

export function EcommerceCrossChannelEscalationSection({
  channels,
  escalationFlows,
  fill = false,
}: {
  channels: CrossChannelMention[];
  escalationFlows: CrossChannelEscalationFlow[];
  fill?: boolean;
}): React.ReactElement {
  return (
    <DetailSection
      premium
      fill={fill}
      title="Cross channel escalation"
      subtitle="Per-channel mentions and flows — never rolled into one virality number."
    >
      <p style={{ margin: "0 0 10px", fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
        Each origin × target cell is a separate customer count. Social virality (where present) stays on its own
        channel row.
      </p>
      <EcommerceCrossChannelEscalation channels={channels} escalationFlows={escalationFlows} />
    </DetailSection>
  );
}
