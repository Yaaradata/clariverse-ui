"use client";

import React from "react";
import type { CrossChannelEscalationFlow, CrossChannelMention } from "../../lib/cxHeadRetailV3HubCards";
import { DetailSection } from "./HubDetailPrimitives";
import { EcommerceCrossChannelEscalation } from "./EcommerceCrossChannelEscalation";

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
    <DetailSection premium fill={fill} title="Cross channel escalation">
      <EcommerceCrossChannelEscalation channels={channels} escalationFlows={escalationFlows} />
    </DetailSection>
  );
}
