"use client";

import React from "react";
import { AIRiskSpikeMonitor } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { getBusinessHeadRiskSpikes } from "@/lib/role-based-dashboard/businessHeadV2RiskSpikes";
import { getHubJourneyCards, getOverviewExecPulse } from "../lib/categoryOverviewData";
import { useNavigation } from "../lib/NavigationContext";
import { useTheme } from "../theme/DashboardThemeProvider";
import { HubJourneyCard } from "../components/common/HubJourneyCard";
import { cssVar, layout, radius } from "../theme/tokens";

/** Overview — pulse → hub triad → spike monitor (timeframe from header). */
export function CategoryOverviewScreen(): React.ReactElement {
  const { navigate, openDrill, timeRange } = useNavigation();
  const { mode } = useTheme();
  const pulse = getOverviewExecPulse(timeRange);
  const cards = getHubJourneyCards(timeRange);
  const spikes = getBusinessHeadRiskSpikes(timeRange);

  const handleHubCard = (card: (typeof cards)[number]) => {
    if (!card.targetScreen) return;
    navigate(card.targetScreen);
    if (card.drillSignalId) {
      const kind =
        card.targetScreen === "returns-margin"
          ? "returns"
          : card.targetScreen === "seller-trust"
            ? "sellers"
            : card.targetScreen === "lane-rto"
              ? "lanes"
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
          <span style={{ fontSize: 13, color: cssVar("severity-med") }}>✨</span>
          <span
            style={{
              fontSize: 12,
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
          {pulse.map((item, idx) => (
            <div
              key={`${timeRange}-${item.q}`}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${cssVar("border")}`,
                borderRadius: radius.sm,
                padding: "9px 10px",
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#b7a6ff", marginBottom: 4 }}>
                {idx + 1}. {item.q}
              </div>
              <div style={{ fontSize: 13.5, color: cssVar("text-secondary"), lineHeight: 1.35, fontWeight: 600 }}>
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
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {cards.map((card) => (
          <HubJourneyCard
            key={`${timeRange}-${card.id}`}
            card={card}
            onClick={card.targetScreen ? () => handleHubCard(card) : undefined}
          />
        ))}
      </div>

      <div
        style={{
          background: cssVar("surface"),
          borderRadius: radius.lg,
          padding: "16px 18px",
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <AIRiskSpikeMonitor
          spikes={spikes}
          driverContext="category share · new-buyer stall · A-SKU stockouts · search gaps · delivery SLA · repeat-rate dip"
          alertSubtitle="Live detection of sudden shifts in demand, availability, fulfilment, and retention across channels."
          isDarkMode={mode === "dark"}
          alertBadgeLabel="AI · Spike signal"
        />
      </div>
    </div>
  );
}
