"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { AISummaryWall } from "../components/common/AISummaryWall";
import { DetailPageHeader } from "../components/common/ChartPanel";
import { ProfitabilityLayout } from "../components/common/DetailGrid";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import {
  ContributionTrendChart,
  GapDriverChart,
  PnlBridgeChart,
  SubCategoryTable,
} from "../components/data/DetailCharts";
import { PROFITABILITY_INSIGHTS } from "../lib/categoryDetailData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";
import { cssVar } from "../theme/tokens";

export function CategoryProfitabilityScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const { state } = useAppState();

  return (
    <ScreenScaffold>
      <DetailPageHeader
        onBack={() => navigate("overview")}
        title="Is my category profitable after returns and CAC?"
        subtitle={
          <>
            Contribution is <strong style={{ color: cssVar("text-primary"), fontWeight: 600 }}>₹2.42 Cr</strong> —{" "}
            <strong style={{ color: cssVar("text-primary"), fontWeight: 600 }}>₹18L</strong> below plan. Returns on
            Fashion SKUs explain 70% of the gap.
          </>
        }
        accentWord="profitable"
      />

      <ProfitabilityLayout>
        <ContributionTrendChart />
        <AISummaryWall insights={PROFITABILITY_INSIGHTS} />
        <GapDriverChart />
        <PnlBridgeChart />
        <SubCategoryTable />
        <ActionBar
          layout="profitability"
          personaId={state.personaId}
          actions={[
            {
              label: "Route",
              text: "Prioritise Aura shirt PIM fix before weekend promo",
              routedOwner: "Catalogue/PIM",
              signalId: "T2-02",
            },
            {
              label: "Draft",
              text: "Pause Fashion promo until return clusters are addressed",
              routedOwner: "Category Head",
              signalId: "T2-02",
            },
            {
              label: "Prepare",
              text: "Tighten reverse-logistics SLA on Fashion high-return SKUs",
              routedOwner: "Supply Chain",
              signalId: "T2-02",
            },
          ]}
        />
      </ProfitabilityLayout>
    </ScreenScaffold>
  );
}
