"use client";

import React from "react";
import { DetailSection } from "./HubDetailPrimitives";
import { EcommerceFciIntentHeatmap } from "./EcommerceFciIntentHeatmap";

export function EcommerceFciHeatmapSection({ fill = false }: { fill?: boolean }): React.ReactElement {
  return (
    <DetailSection premium fill={fill} title="How well are we serving shoppers?">
      <EcommerceFciIntentHeatmap />
    </DetailSection>
  );
}
