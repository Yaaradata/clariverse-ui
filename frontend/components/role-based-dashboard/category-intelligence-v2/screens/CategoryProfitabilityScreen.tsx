"use client";

import React from "react";

import { ActionBar } from "../components/common/ActionBar";
import { AISummaryWall } from "../components/common/AISummaryWall";
import { DetailPageHeader } from "../components/common/ChartPanel";
import { DashboardSection, DetailGrid } from "../components/common/DetailGrid";
import { ScreenScaffold } from "../components/common/ScreenScaffold";
import { CategoryProfitabilityV2Content } from "../components/data/CategoryProfitabilityV2";
import {
  DemandCascadeCard,
  SpendVsRevenueChart,
  GapDriverChart,
} from "../components/data/DetailCharts";
import { PROFITABILITY_INSIGHTS, SPEND_VS_REVENUE } from "../lib/categoryDetailData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";
import { cssVar, space } from "../theme/tokens";

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
            Spend at{" "}
            <strong style={{ color: cssVar("text-primary"), fontWeight: 600 }}>
              {SPEND_VS_REVENUE.spendPctOfRevenue}%
            </strong>{" "}
            of revenue — contribution{" "}
            <strong style={{ color: cssVar("text-primary"), fontWeight: 600 }}>−₹39.6 Cr</strong>.
            Trace spend across the revenue line, then act on the categories that bleed.
          </>
        }
        accentWord="profitable"
      />

      <DashboardSection
        n="01"
        title="Spend vs the revenue line"
        sub="Demand cascade into take rate, then spend against that pool."
        first
      >
        <div style={{ display: "flex", flexDirection: "column", gap: space["4"] }}>
          <DemandCascadeCard />
          <SpendVsRevenueChart />
        </div>
      </DashboardSection>

      <DashboardSection
        n="02"
        title="Where the shortfall comes from"
        sub="Drivers of the gap · AI-ranked takeaways for the Category Head."
      >
        <DetailGrid columns="minmax(0, 1.4fr) minmax(0, 1fr)" align="stretch">
          <GapDriverChart />
          <AISummaryWall insights={PROFITABILITY_INSIGHTS} />
        </DetailGrid>
      </DashboardSection>

      <DashboardSection
        n="03"
        title="Portfolio economics by category"
        sub="Verdict, ₹ bridge, returns–CM relationship, scorecard, and the biggest lever."
      >
        <CategoryProfitabilityV2Content />
      </DashboardSection>

      <DashboardSection
        n="04"
        title="Action queue"
        sub="Route the next moves before the weekend promo wave."
      >
        <ActionBar
          layout="profitability"
          personaId={state.personaId}
          actions={[
            {
              label: "Route",
              text: "Cut return clusters driving ₹258 Cr returns cost",
              routedOwner: "Catalogue/PIM",
              signalId: "T2-02",
            },
            {
              label: "Draft",
              text: "Pause underperforming CAC until spend is under the revenue line",
              routedOwner: "Category Head",
              signalId: "T2-02",
            },
            {
              label: "Prepare",
              text: "Reallocate opex from above-line spend back under 100% of revenue",
              routedOwner: "Finance / Ops",
              signalId: "T2-02",
            },
          ]}
        />
      </DashboardSection>
    </ScreenScaffold>
  );
}
