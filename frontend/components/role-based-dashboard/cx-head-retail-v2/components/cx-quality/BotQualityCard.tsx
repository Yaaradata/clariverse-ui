"use client";

import React from "react";
import { BOT_QUALITY_CARD } from "../../lib/cxHeadRetailData";
import { CompactSignalCard } from "../common/CompactSignalCard";

export function BotQualityCard(): React.ReactElement {
  const card = BOT_QUALITY_CARD;

  return (
    <CompactSignalCard
      title={card.title}
      stat={card.stat}
      aiLine={card.aiVerdict}
      flag={card.gated ? "Gated" : undefined}
      flagTone="med"
    />
  );
}
