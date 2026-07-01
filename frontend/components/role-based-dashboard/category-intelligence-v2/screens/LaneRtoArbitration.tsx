"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { EvidenceFeed } from "../components/common/EvidenceFeed";
import { InsightCard } from "../components/common/InsightCard";
import { DetailPageHeader } from "../components/common/ChartPanel";
import { DetailGrid } from "../components/common/DetailGrid";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import { FaultSplitCard, VoiceThemeSplit } from "../components/data/DrillComponents";
import { EVIDENCE_PACKS, getSignalById } from "../lib/seedData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";

export function LaneRtoArbitration(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();
  const signal = getSignalById("T2-26");
  const pack = EVIDENCE_PACKS["T2-26"];

  if (!signal || !pack) return <div />;

  return (
    <ScreenScaffold>
      <DetailPageHeader
        onBack={() => navigate("overview")}
        title="Lane RTO arbitration"
        subtitle="Metro lane RTO 33% vs a 21% band — the voice says logistics, not seller"
      />
      <InsightCard signal={signal} variant="hero" />
      <DetailGrid columns="1fr 1fr">
        <VoiceThemeSplit />
        <FaultSplitCard />
      </DetailGrid>
      <EvidenceFeed pack={pack} />
      <ActionBar
        personaId={state.personaId}
        actions={[
          {
            label: "Route",
            text: "Lane verdict to Operations — logistics failure, seller penalty held",
            routedOwner: "Operations",
            signalId: "T2-26",
          },
          {
            label: "Route",
            text: "Pick/pack process-gap to warehouse map",
            routedOwner: "Warehouse map",
            signalId: "T2-26",
          },
          {
            label: "Route",
            text: "Pin-code differential action",
            routedOwner: "Operations",
            signalId: "T2-26",
            gated: true,
            gateNote: "Gated — geography proxy; requires compliance review before draft.",
          },
        ]}
      />
    </ScreenScaffold>
  );
}
