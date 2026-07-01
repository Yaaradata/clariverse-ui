"use client";

import React from "react";
import { AIRiskSpikeMonitor } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { BUSINESS_HEAD_V2_RISK_SPIKES } from "@/lib/role-based-dashboard/businessHeadV2RiskSpikes";
import { HUB_JOURNEY_CARDS, OVERVIEW_EXEC_PULSE } from "../lib/categoryOverviewData";
import { useNavigation } from "../lib/NavigationContext";
import { useTheme } from "../theme/DashboardThemeProvider";
import { HubJourneyCard } from "../components/common/HubJourneyCard";
import { cssVar, layout, radius } from "../theme/tokens";

/** V2 front screen — AI risk spikes, executive pulse, three hub cards (CX V3 structure). */
export function CategoryOverviewScreen(): React.ReactElement {
  const { navigate, openDrill } = useNavigation();
  const { mode } = useTheme();

  const handleHubCard = (card: (typeof HUB_JOURNEY_CARDS)[number]) => {
    navigate(card.targetScreen);
    if (card.drillSignalId) {
      const kind =
        card.targetScreen === "returns-margin"
          ? "returns"
          : card.targetScreen === "seller-trust"
            ? "sellers"
            : "signal";
      openDrill({ kind, itemId: card.drillSignalId });
    }
  };

  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          background: cssVar("surface"),
          borderRadius: radius.md,
          padding: "12px 14px",
          border: `1px solid ${cssVar("border")}`,
          borderLeft: `3px solid ${cssVar("severity-med")}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: cssVar("severity-med") }}>✨</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: cssVar("severity-med"),
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Executive Pulse
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {OVERVIEW_EXEC_PULSE.map((item, idx) => (
            <div
              key={item.q}
              style={{
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                borderRadius: radius.sm,
                padding: "9px 10px",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#b7a6ff", marginBottom: 4 }}>
                {idx + 1}. {item.q}
              </div>
              <div style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.4, fontWeight: 500 }}>
                {item.main}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          alignItems: "start",
        }}
      >
        {HUB_JOURNEY_CARDS.map((card) => (
          <HubJourneyCard key={card.id} card={card} onClick={() => handleHubCard(card)} />
        ))}
      </div>

      <AIRiskSpikeMonitor
        spikes={BUSINESS_HEAD_V2_RISK_SPIKES}
        driverContext="Fashion returns · NCR lane RTO · seller trust · festival payment · q-com defect"
        isDarkMode={mode === "dark"}
      />
    </div>
  );
}
