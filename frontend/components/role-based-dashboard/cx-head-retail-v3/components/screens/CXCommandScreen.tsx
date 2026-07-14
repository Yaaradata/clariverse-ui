"use client";

import React from "react";
import {
  COMMAND_PAGE,
  COMMAND_TIME_COMPARE,
  EXECUTIVE_TILES,
  getRadarSignalById,
  RADAR_SIGNALS,
  type RadarSignal,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { ExecutiveTile } from "../common/ExecutiveTile";
import { RadarRail } from "../common/RadarRail";
import { cssVar, layout, radius, space, type } from "../../theme/tokens";

function CommandHeadline(): React.ReactElement {
  return (
    <div
      style={{
        borderLeft: `3px solid ${cssVar("accent")}`,
        paddingLeft: 14,
        maxWidth: 920,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: type.scale.display,
          fontWeight: type.weight.bold,
          color: cssVar("text-primary"),
          lineHeight: 1.12,
          letterSpacing: -0.55,
        }}
      >
        What is{" "}
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>breaking</span> right now,
        and{" "}
        <span
          style={{
            color: cssVar("accent-2"),
            fontWeight: 800,
            boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
          }}
        >
          who owns it
        </span>
        <span style={{ color: cssVar("accent") }}>?</span>
      </h2>
      <p
        style={{
          margin: `${space["2"]} 0 0`,
          fontSize: type.scale.small,
          color: cssVar("text-secondary"),
          lineHeight: 1.5,
          maxWidth: 720,
        }}
      >
        {COMMAND_PAGE.purpose}
      </p>
    </div>
  );
}

/** V3 detail — breaking tiles, corroboration radar, evidence drill-down. */
export function CXCommandScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const handleOpenSignal = (signal: RadarSignal) => {
    openDrill({
      screenId: "command-centre",
      itemId: signal.id,
      drillSignature: signal.drillSignature,
    });
  };

  const handleOpenBreakingTile = (tileId: string, drillSignalId?: string) => {
    if (tileId === "statutory-clock") {
      openDrill({
        screenId: "command-centre",
        itemId: "statutory-clock",
        drillSignature: "statutory-queue",
      });
      return;
    }
    if (drillSignalId) {
      const signal = getRadarSignalById(drillSignalId);
      if (signal) {
        handleOpenSignal(signal);
        return;
      }
    }
    if (tileId === "d07-outbreak") {
      openDrill({
        screenId: "command-centre",
        itemId: "DS-BLR-D07",
        drillSignature: "geo-outbreak",
      });
    }
  };

  return (
    <>
      <div
        className="lisn-anim-fade"
        style={{
          maxWidth: layout.contentMaxWidth,
          margin: "0 auto",
          padding: "24px 32px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CommandHeadline />
          </div>

          <span
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              borderRadius: radius.pill,
              fontSize: type.scale.caption,
              fontWeight: type.weight.semibold,
              color: cssVar("text-secondary"),
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              whiteSpace: "nowrap",
            }}
          >
            {COMMAND_TIME_COMPARE}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, alignItems: "start" }}>
          {EXECUTIVE_TILES.map((tile, index) => (
            <ExecutiveTile
              key={tile.id}
              tile={tile}
              isPrimary={index === 0}
              onClick={() => handleOpenBreakingTile(tile.id, tile.drillSignalId)}
            />
          ))}
        </div>

        <RadarRail signals={RADAR_SIGNALS} onOpen={handleOpenSignal} />
      </div>
    </>
  );
}
