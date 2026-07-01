"use client";

import React from "react";
import { getHubCardById } from "../../lib/cxHeadRetailV3HubCards";
import type { BrandRiskDrill } from "../../lib/cxHeadRetailV3HubCards";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { DetailSection } from "../hub/HubDetailPrimitives";
import {
  BrandChannelSentimentVisual,
  CompetitorBuzzVisual,
  InfluencerWatchlistVisual,
  PublicVoiceRankVisual,
  QualityTrustVisual,
  TopFeatureRequestsVisual,
} from "../hub/HubBrandRiskVisuals";
import { layout } from "../../theme/tokens";

export function HubBrandRiskScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const card = getHubCardById("brand-risk");
  const drill = card?.drill as BrandRiskDrill | undefined;
  const latest = card?.timeline[card.timeline.length - 1];

  if (!card || !drill || !latest?.brand) {
    return <div style={{ padding: 32 }}>Card data unavailable.</div>;
  }

  const channels = latest.rightPanel.kind === "channels" ? latest.rightPanel.channels : [];

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
        variant="brand-risk"
        trailing={<ScreenBackBar onBack={() => navigate("overview")} />}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 16,
          alignItems: "stretch",
        }}
      >
        <DetailSection premium fill title="Channels at risk" subtitle="Sorted by current sentiment · 6-week trend">
          <BrandChannelSentimentVisual channels={channels} timeline={card.timeline} />
        </DetailSection>

        <DetailSection premium fill title="What people say about us" subtitle="Top themes ranked #1–#5 · trust erosion voice per theme">
          <PublicVoiceRankVisual nodes={drill.spreadMap} />
        </DetailSection>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <DetailSection premium fill title="Competitor buzz" subtitle="Click a competitor for channel signals, quotes & action.">
          <CompetitorBuzzVisual competitors={drill.competitor} />
        </DetailSection>

        <DetailSection premium fill title="Quality-related trust issues" subtitle="Share of quality complaints driving returns.">
          <QualityTrustVisual quality={drill.quality} />
        </DetailSection>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        <DetailSection premium title="Influencer & Watchlist Accounts">
          <InfluencerWatchlistVisual influencers={drill.influencers} />
        </DetailSection>

        <DetailSection premium title="Top Requests for Features">
          <TopFeatureRequestsVisual featureRequests={drill.featureRequests} />
        </DetailSection>
      </div>
    </div>
  );
}
