"use client";

import React from "react";
import {
  getBridgeTileById,
  PERISHABLE_RADAR,
  QUICK_COMMERCE_HEADLINE,
  QUICK_COMMERCE_SUMMARY,
  SUBSTITUTION_RADAR,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { CompactPageHeader, pageShellStyle } from "../common/CompactPageHeader";
import { CompactSignalCard } from "../common/CompactSignalCard";
import { BridgeReadyTile } from "../quick-commerce/BridgeReadyTile";
import { OutbreakMap } from "../quick-commerce/OutbreakMap";

export function QuickCommerceHealthScreen(): React.ReactElement {
  const { openDrill } = useNavigation();
  const mb1 = getBridgeTileById("MB1");

  const openOutbreakDrill = (storeId: string) => {
    openDrill({
      screenId: "quick-commerce",
      itemId: storeId,
      drillSignature: "geo-outbreak",
    });
  };

  return (
    <div className="lisn-anim-fade" style={pageShellStyle()}>
      <CompactPageHeader
        eyebrow="Quick-commerce"
        title={QUICK_COMMERCE_HEADLINE.title}
        subtitle={QUICK_COMMERCE_HEADLINE.soWhat}
      />

      <AiExecSummaryBar {...QUICK_COMMERCE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 8, minHeight: 200, maxHeight: 220 }}>
        <OutbreakMap onSelectStore={openOutbreakDrill} defaultCity="Bengaluru" />
        {mb1 ? (
          <BridgeReadyTile
            tile={mb1}
            onOpen={() =>
              openDrill({
                screenId: "quick-commerce",
                itemId: "MB1",
                drillSignature: "bridge",
              })
            }
          />
        ) : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <CompactSignalCard
          title={PERISHABLE_RADAR.title}
          stat={PERISHABLE_RADAR.stat}
          aiLine={PERISHABLE_RADAR.aiVerdict}
          flag={PERISHABLE_RADAR.flag}
        />
        <CompactSignalCard
          title={SUBSTITUTION_RADAR.title}
          stat={SUBSTITUTION_RADAR.stat}
          aiLine={SUBSTITUTION_RADAR.aiVerdict}
        />
      </div>
    </div>
  );
}
