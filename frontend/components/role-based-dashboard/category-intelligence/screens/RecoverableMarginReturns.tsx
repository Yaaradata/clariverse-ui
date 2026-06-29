"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { EvidenceFeed } from "../components/common/EvidenceFeed";
import { InsightCard } from "../components/common/InsightCard";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import {
  CatalogueCorrectionCard,
  CauseCodeBreakdown,
  FixableIntentSplit,
} from "../components/data/ReturnsComponents";
import { CAUSE_CODES, EVIDENCE_PACKS, getSignalById, type CategorySignalView } from "../lib/seedData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";
import { cssVar } from "../theme/tokens";

export function RecoverableMarginReturns(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();
  const signal = getSignalById("T2-02");
  const contextSignal: CategorySignalView = {
    ...signal!,
    signalId: "T2-05",
    cardId: "T2-05",
    title: "Return rate vs category band",
    stats: "Control denim 21% in band · Fashion structurally higher but this SKU breached",
    aiVerdict: "Rate vs category-relative band — anomaly isolated to Aura run.",
    honestyLine: "Substrate: return rate vs category-relative band",
  };
  const pack = EVIDENCE_PACKS["T2-02"];

  if (!signal || !pack) return <div />;

  return (
    <ScreenScaffold
      title="Recoverable-margin returns"
      subtitle="₹6.0L recoverable contribution on the Fashion returns spike this week"
      onBack={() => navigate("command-centre")}
    >
      <InsightCard signal={signal} variant="hero" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
        <CauseCodeBreakdown causes={CAUSE_CODES} />
        <FixableIntentSplit fixableShare={36} intentShare={64} />
      </div>
      <div style={{ marginTop: 14 }}>
        <CatalogueCorrectionCard />
      </div>
      <div style={{ marginTop: 14, padding: 14, borderRadius: 10, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
        <InsightCard signal={contextSignal} variant="hero" />
      </div>
      <EvidenceFeed pack={pack} />
      <ActionBar
        personaId={state.personaId}
        actions={[
          {
            label: "Draft",
            text: "PIM sizing-chart fix — chest +2.5 cm remap M–XL",
            routedOwner: "Catalogue/PIM",
            signalId: "T2-02",
          },
          {
            label: "Route",
            text: "Route fixable share to Seller-Brand partnership desk",
            routedOwner: "Seller-Brand",
            signalId: "T2-02",
          },
          {
            label: "Draft",
            text: "Pre-empt the size-guide ticket",
            routedOwner: "CX",
            signalId: "T2-02",
            secondary: true,
          },
        ]}
      />
    </ScreenScaffold>
  );
}
