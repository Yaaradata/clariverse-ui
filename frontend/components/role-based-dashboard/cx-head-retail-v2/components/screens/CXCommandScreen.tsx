"use client";

import React from "react";
import {
  COMMAND_TIME_COMPARE,
  EXEC_SUMMARY,
  EXECUTIVE_TILES,
  HEADLINE_SIGNAL,
  KPI_RIBBON,
  RADAR_SIGNALS,
  type RadarSignal,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { CompactPageHeader, pageShellStyle } from "../common/CompactPageHeader";
import { ExecutiveTile } from "../common/ExecutiveTile";
import { KpiSparkRibbon } from "../common/KpiSparkRibbon";
import { RadarRail } from "../common/RadarRail";

export function CXCommandScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const handleOpenSignal = (signal: RadarSignal) => {
    openDrill({
      screenId: "command-centre",
      itemId: signal.id,
      drillSignature: signal.drillSignature,
    });
  };

  return (
    <div className="lisn-anim-fade" style={pageShellStyle()}>
      <CompactPageHeader
        eyebrow="CX Command"
        title={HEADLINE_SIGNAL.title}
        subtitle={HEADLINE_SIGNAL.soWhat}
        badge={COMMAND_TIME_COMPARE}
      />

      <AiExecSummaryBar {...EXEC_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {EXECUTIVE_TILES.map((tile, index) => (
          <ExecutiveTile key={tile.id} tile={tile} isPrimary={index === 0} />
        ))}
      </div>

      <KpiSparkRibbon items={KPI_RIBBON} />

      <RadarRail signals={RADAR_SIGNALS} onOpen={handleOpenSignal} />
    </div>
  );
}
