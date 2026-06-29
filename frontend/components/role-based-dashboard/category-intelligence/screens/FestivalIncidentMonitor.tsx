"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { EvidenceFeed } from "../components/common/EvidenceFeed";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import {
  DefectWaveCard,
  RealVsFailureVerdictCard,
  SuppressedNearMissInline,
} from "../components/data/DrillComponents";
import { EVIDENCE_PACKS, getSignalById } from "../lib/seedData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";

export function FestivalIncidentMonitor(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();
  const signal = getSignalById("T2-28");
  const pack = EVIDENCE_PACKS["T2-28"];

  if (!signal || !pack) return <div />;

  return (
    <ScreenScaffold
      title="Festival incident monitor"
      subtitle="3× order spike — is it real demand or a payment failure?"
      onBack={() => navigate("command-centre")}
    >
      <RealVsFailureVerdictCard signal={signal} />
      <SuppressedNearMissInline />
      <div style={{ marginTop: 14 }}>
        <DefectWaveCard />
      </div>
      <EvidenceFeed pack={pack} />
      <ActionBar
        personaId={state.personaId}
        actions={[
          {
            label: "Prepare",
            text: "Incident packet → Trust & Safety + Operations (verified, human-gated)",
            routedOwner: "Trust & Safety + Operations",
            signalId: "T2-28",
          },
        ]}
      />
    </ScreenScaffold>
  );
}
