"use client";

import React from "react";

import { AiExecSummaryBar } from "../components/common/AiExecSummaryBar";
import { ExecutivePulseStrip } from "../components/common/ExecutivePulseStrip";
import { ExecutiveTile } from "../components/common/ExecutiveTile";
import { FloatingAIDayGenerator } from "../components/common/FloatingAIDayGenerator";
import { RiskSpikeMonitor } from "../components/common/RiskSpikeMonitor";
import {
  COMMAND_TIME_COMPARE,
  EXEC_BRIEF,
  EXEC_PULSE,
  EXECUTIVE_TILES,
  HEADLINE_EXPLAINABILITY,
} from "../lib/categoryCommandData";
import type { CategorySignalView } from "../lib/seedData";
import { resolveSignalNavigation } from "../lib/signalNavigation";
import { useNavigation } from "../lib/NavigationContext";
import { cssVar, layout, radius, type } from "../theme/tokens";

export function CategoryCommandCentre(): React.ReactElement {
  const { navigate, openDrill } = useNavigation();

  const handleTileClick = (tile: (typeof EXECUTIVE_TILES)[number]) => {
    if (!tile.drillScreen) return;
    navigate(tile.drillScreen);
    if (tile.drillSignalId) {
      const kind =
        tile.drillScreen === "returns-margin"
          ? "returns"
          : tile.drillScreen === "seller-trust"
            ? "sellers"
            : "signal";
      openDrill({ kind, itemId: tile.drillSignalId });
    }
  };

  const handleOpenSignal = (signal: CategorySignalView) => {
    const { screenId, drill } = resolveSignalNavigation(signal);
    navigate(screenId);
    openDrill(drill);
  };

  const [primary, ...secondary] = EXECUTIVE_TILES;

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
            <p
              style={{
                margin: 0,
                fontSize: type.scale.caption,
                fontWeight: type.weight.semibold,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: cssVar("accent"),
              }}
            >
              What should I act on this week?
            </p>
            <h2
              style={{
                margin: "10px 0 0",
                fontSize: type.scale.display,
                fontWeight: type.weight.bold,
                color: cssVar("text-primary"),
                lineHeight: 1.1,
                letterSpacing: -0.4,
                maxWidth: 920,
              }}
              title={HEADLINE_EXPLAINABILITY}
            >
              Contribution is ₹18L below last week
            </h2>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: type.scale.body,
                color: cssVar("text-secondary"),
                lineHeight: 1.5,
                maxWidth: 820,
              }}
            >
              Category contribution after returns and CAC — not gross GMV. The costliest fixable driver is on the
              signal rail below.
            </p>
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

        <AiExecSummaryBar {...EXEC_BRIEF} />
        <ExecutivePulseStrip {...EXEC_PULSE} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr 1fr",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          <ExecutiveTile tile={primary} isPrimary explainability={HEADLINE_EXPLAINABILITY} />
          {secondary.map((tile) => (
            <ExecutiveTile
              key={tile.id}
              tile={tile}
              onClick={tile.drillScreen ? () => handleTileClick(tile) : undefined}
            />
          ))}
        </div>

        <RiskSpikeMonitor onOpenSignal={handleOpenSignal} />
      </div>
      <FloatingAIDayGenerator />
    </>
  );
}
