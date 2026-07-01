"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { AISummaryWall } from "../components/common/AISummaryWall";
import { CustomerChannelEvidence } from "../components/common/CustomerChannelEvidence";
import { DetailPageHeader } from "../components/common/ChartPanel";
import { DetailGrid } from "../components/common/DetailGrid";
import { PROFITABILITY_ROW_BOTTOM, PROFITABILITY_ROW_MID, PROFITABILITY_ROW_TOP } from "../components/common/detailLayout";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import {
  PimCorrectionTimeline,
  ReturnCauseRecoverableChart,
  ReturnRateTrendChart,
} from "../components/data/DetailCharts";
import { RETURNS_CHANNEL_EVIDENCE, RETURNS_INSIGHTS } from "../lib/categoryDetailData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";

export function RecoverableMarginReturns(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();

  return (
    <ScreenScaffold>
      <DetailPageHeader
        onBack={() => navigate("overview")}
        title="What returns margin is recoverable?"
        subtitle="₹6.0L recoverable this week — customer voice confirms sizing chart error, not buyer remorse."
        accentWord="recoverable"
      />

      <DetailGrid columns={PROFITABILITY_ROW_TOP} align="stretch">
        <ReturnRateTrendChart />
        <AISummaryWall insights={RETURNS_INSIGHTS} />
      </DetailGrid>

      <DetailGrid columns={PROFITABILITY_ROW_MID} align="stretch">
        <ReturnCauseRecoverableChart />
        <PimCorrectionTimeline />
      </DetailGrid>

      <DetailGrid columns={PROFITABILITY_ROW_BOTTOM} align="stretch">
        <CustomerChannelEvidence channels={RETURNS_CHANNEL_EVIDENCE} />
        <ActionBar
          layout="profitability"
          personaId={state.personaId}
          actions={[
            {
              label: "Draft",
              text: "PIM sizing-chart fix — remap category measurements across core sizes",
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
              label: "Prepare",
              text: "Accelerate reverse pickup on fixable-return cohort (~600 units)",
              routedOwner: "Supply Chain",
              signalId: "T2-02",
            },
          ]}
        />
      </DetailGrid>
    </ScreenScaffold>
  );
}
