"use client";

import React, { useState } from "react";

import { ActionBar } from "../components/common/ActionBar";
import { AISummaryWall } from "../components/common/AISummaryWall";
import { CustomerChannelEvidence } from "../components/common/CustomerChannelEvidence";
import { DetailPageHeader } from "../components/common/ChartPanel";
import { DetailGrid } from "../components/common/DetailGrid";
import { PROFITABILITY_ROW_BOTTOM, PROFITABILITY_ROW_MID, PROFITABILITY_ROW_TOP } from "../components/common/detailLayout";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import { SellerRiskScorecard } from "../components/data/DrillComponents";
import { ComplaintThemeChart, SellerTrustTrendChart } from "../components/data/DetailCharts";
import { SELLER_CHANNEL_EVIDENCE, SELLER_INSIGHTS } from "../lib/categoryDetailData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";

export function SellerTrustRiskBoard(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>("SELL-QS");

  return (
    <ScreenScaffold>
      <DetailPageHeader
        onBack={() => navigate("overview")}
        title="Which sellers threaten category trust?"
        subtitle="4 sellers · ₹60L GMV at risk — ranked by customer-backed exposure, not raw breach counts."
        accentWord="trust"
      />

      <DetailGrid columns={PROFITABILITY_ROW_TOP} align="stretch">
        <SellerTrustTrendChart />
        <AISummaryWall insights={SELLER_INSIGHTS} />
      </DetailGrid>

      <DetailGrid columns={PROFITABILITY_ROW_MID} align="stretch">
        <ComplaintThemeChart />
        <SellerRiskScorecard selectedId={selectedId} onSelectSeller={setSelectedId} />
      </DetailGrid>

      <DetailGrid columns={PROFITABILITY_ROW_BOTTOM} align="stretch">
        <CustomerChannelEvidence
          channels={SELLER_CHANNEL_EVIDENCE}
          subtitle="Cancel-after-wait · seller conduct"
        />
        <ActionBar
          layout="profitability"
          personaId={state.personaId}
          actions={[
            {
              label: "Draft",
              text: "Seller coaching — cancel-after-wait script + dispatch SLA",
              routedOwner: "Seller-Brand",
              signalId: "T2-07",
            },
            {
              label: "Route",
              text: "Escalate QuickStyle to Seller-Brand partnership desk",
              routedOwner: "Seller-Brand",
              signalId: "T2-07",
            },
            {
              label: "Prepare",
              text: "Monitor FDI concentration before penalty wave on top seller",
              routedOwner: "Category Head",
              signalId: "T2-07",
            },
          ]}
        />
      </DetailGrid>
    </ScreenScaffold>
  );
}
