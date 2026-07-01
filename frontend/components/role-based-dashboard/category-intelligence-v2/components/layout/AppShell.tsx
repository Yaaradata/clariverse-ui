import React from "react";

import { useNavigation } from "../../lib/NavigationContext";
import type { ScreenId } from "../../lib/routes";
import { cssVar } from "../../theme/tokens";
import { Header } from "./Header";
import { CategoryOverviewScreen } from "../../screens/CategoryOverviewScreen";
import { CategoryProfitabilityScreen } from "../../screens/CategoryProfitabilityScreen";
import { FestivalIncidentMonitor } from "../../screens/FestivalIncidentMonitor";
import { LaneRtoArbitration } from "../../screens/LaneRtoArbitration";
import { RecoverableMarginReturns } from "../../screens/RecoverableMarginReturns";
import { SellerTrustRiskBoard } from "../../screens/SellerTrustRiskBoard";
import { SharedDrillPanel } from "../../screens/SharedDrillPanel";

const SCREENS: Record<ScreenId, React.ComponentType> = {
  overview: CategoryOverviewScreen,
  "category-profitability": CategoryProfitabilityScreen,
  "returns-margin": RecoverableMarginReturns,
  "seller-trust": SellerTrustRiskBoard,
  "lane-rto": LaneRtoArbitration,
  "festival-monitor": FestivalIncidentMonitor,
};

export function AppShell(): React.ReactElement {
  const { activeScreen } = useNavigation();
  const ActiveScreen = SCREENS[activeScreen] ?? CategoryOverviewScreen;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: cssVar("bg"),
        color: cssVar("text-primary"),
        overflow: "hidden",
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          background: cssVar("bg"),
        }}
      >
        <ActiveScreen key={activeScreen} />
      </main>
      <SharedDrillPanel />
    </div>
  );
}
