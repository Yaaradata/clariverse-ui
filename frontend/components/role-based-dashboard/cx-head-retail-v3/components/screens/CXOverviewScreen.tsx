"use client";

import React from "react";
import { AIRiskSpikeMonitor } from "@/components/unified/actions/AIRiskSpikeMonitor";
import {
  CX_HEAD_V3_RISK_DRIVER_CONTEXT,
  CX_HEAD_V3_RISK_SPIKES,
} from "@/lib/role-based-dashboard/cxHeadRetailV3RiskSpikes";
import { HUB_JOURNEY_CARDS, OVERVIEW_EXEC_PULSE } from "../../lib/cxHeadRetailV3OverviewData";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { HubJourneyCard } from "../common/HubJourneyCard";
import { cssVar, layout, radius } from "../../theme/tokens";

/** V3 front screen — executive pulse, three hub cards, operational risk spikes. */
export function CXOverviewScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const { mode } = useTheme();

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
          {OVERVIEW_EXEC_PULSE.map((item, idx) => (
            <div
              key={item.q}
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
          alignItems: "start",
        }}
      >
        {HUB_JOURNEY_CARDS.map((card) => (
          <HubJourneyCard key={card.id} card={card} onClick={() => navigate(card.targetScreen)} />
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
          spikes={CX_HEAD_V3_RISK_SPIKES}
          driverContext={CX_HEAD_V3_RISK_DRIVER_CONTEXT}
          isDarkMode={mode === "dark"}
        />
      </div>
    </div>
  );
}
