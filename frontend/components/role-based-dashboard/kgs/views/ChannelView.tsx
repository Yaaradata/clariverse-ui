"use client";

import { channel } from "@kgs/lib/data";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import {
  ChannelMixStrip,
  MarketSaying,
  PartnerPromiseGap,
  PartnerStandings,
  TrendingPartnerTopics,
} from "../drill/channel/ChannelDrillSections";

const C = channel;

/**
 * Q2 /channel — market-reputation layout (mix → promise gap → topics + market → standings).
 * No Signal Wall / cohort chart (those stay on Installed base only).
 */
export function ChannelView() {
  const v2 = C.v2;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackToOverviewHeader title={C.title} subtitle={C.subtitle} />
      <ChannelMixStrip mix={v2.channelMix} />
      <PartnerPromiseGap data={v2.promiseGap} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <TrendingPartnerTopics topics={v2.trendingTopics} />
        <MarketSaying data={v2.marketSay} />
      </div>
      <PartnerStandings data={v2.standings} />
    </div>
  );
}
