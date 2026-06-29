"use client";

import React, { useState } from "react";

import { ActionBar } from "../components/common/ActionBar";
import { EvidenceFeed } from "../components/common/EvidenceFeed";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import { OwnershipBoard, SellerDetailPanel } from "../components/data/DrillComponents";
import { EVIDENCE_PACKS } from "../lib/seedData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";

export function SellerTrustRiskBoard(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>("SELL-QS");
  const pack = EVIDENCE_PACKS["T2-07"];

  return (
    <ScreenScaffold
      title="Seller trust-risk board"
      subtitle="3 sellers putting ₹52L of category GMV at risk this week — ranked by customer-backed exposure"
      onBack={() => navigate("command-centre")}
    >
      <OwnershipBoard selectedId={selectedId} onSelectSeller={setSelectedId} />
      {selectedId ? <SellerDetailPanel sellerId={selectedId} /> : null}
      {pack ? <EvidenceFeed pack={pack} /> : null}
      <ActionBar
        personaId={state.personaId}
        actions={[
          {
            label: "Draft",
            text: "Seller coaching — cancel-after-wait script + dispatch SLA",
            routedOwner: "Seller-Brand",
            signalId: "T2-07",
            gated: false,
            gateNote: "FDI non-discrimination check passed · 23% concentration within 25% cap.",
          },
        ]}
      />
    </ScreenScaffold>
  );
}
