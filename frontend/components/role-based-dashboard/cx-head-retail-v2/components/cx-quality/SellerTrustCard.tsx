"use client";

import React from "react";
import { SELLER_TRUST_CARD } from "../../lib/cxHeadRetailData";
import { CompactSignalCard } from "../common/CompactSignalCard";

export function SellerTrustCard({ onOpenDrill }: { onOpenDrill: () => void }): React.ReactElement {
  const card = SELLER_TRUST_CARD;

  return (
    <CompactSignalCard
      title={card.title}
      stat={card.stat}
      aiLine={card.aiVerdict}
      flag={card.flag}
      flagTone="accent"
      onAction={onOpenDrill}
    />
  );
}
