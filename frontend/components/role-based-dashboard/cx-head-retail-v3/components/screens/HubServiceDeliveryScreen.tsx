"use client";

import React from "react";
import { getHubCardById } from "../../lib/cxHeadRetailV3HubCards";
import type { ServiceDeliveryDrill } from "../../lib/cxHeadRetailV3HubCards";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { DetailSection } from "../hub/HubDetailPrimitives";
import {
  FcrIntelligenceVisual,
  ServicePromiseBoardVisual,
  SlaHeatmapVisual,
} from "../hub/HubServiceDeliveryVisuals";
import { EcommerceCrossChannelEscalationSection } from "../hub/EcommerceCrossChannelEscalationSection";
import { EcommerceFciHeatmapSection } from "../hub/EcommerceFciHeatmapSection";
import { layout } from "../../theme/tokens";

export function HubServiceDeliveryScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const card = getHubCardById("service-delivery");
  const drill = card?.drill as ServiceDeliveryDrill | undefined;
  const latest = card?.timeline[card.timeline.length - 1];

  if (!card || !drill || !latest?.service) {
    return <div style={{ padding: 32 }}>Card data unavailable.</div>;
  }

  const s = latest.service;

  return (
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
      <HubFluidHeadline
        variant="service-delivery"
        trailing={<ScreenBackBar onBack={() => navigate("overview")} />}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, alignItems: "stretch", marginBottom: 14 }}>
        <DetailSection premium fill title="Service promise & breach map">
          <ServicePromiseBoardVisual service={s} failures={drill.slaFailures} />
        </DetailSection>

        <DetailSection premium fill title="FCR Intelligence" subtitle="Actual vs. target · dashed line = last month">
          <FcrIntelligenceVisual />
        </DetailSection>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        <DetailSection premium fill title="SLA heatmap" subtitle="Intent × channel · intensity = compliance gap">
          <SlaHeatmapVisual heatmap={drill.slaHeatmap} />
        </DetailSection>

        <EcommerceCrossChannelEscalationSection
          fill
          channels={drill.channels}
          escalationFlows={drill.escalationFlows}
        />
      </div>

      <EcommerceFciHeatmapSection fill />
    </div>
  );
}
