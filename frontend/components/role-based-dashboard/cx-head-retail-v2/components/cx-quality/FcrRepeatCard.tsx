"use client";

import React from "react";
import { FCR_REPEAT_CARD } from "../../lib/cxHeadRetailData";
import { CompactSignalCard } from "../common/CompactSignalCard";

export function FcrRepeatCard(): React.ReactElement {
  const card = FCR_REPEAT_CARD;

  return <CompactSignalCard title={card.title} stat={card.stat} aiLine={card.aiVerdict} />;
}
