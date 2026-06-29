import React, { useState } from "react";

import { useNavigation } from "../../lib/NavigationContext";
import type { ScreenId } from "../../lib/routes";
import { cssVar } from "../../theme/tokens";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CategoryCommandCentre } from "../../screens/CategoryCommandCentre";
import { FestivalIncidentMonitor } from "../../screens/FestivalIncidentMonitor";
import { LaneRtoArbitration } from "../../screens/LaneRtoArbitration";
import { RecoverableMarginReturns } from "../../screens/RecoverableMarginReturns";
import { SellerTrustRiskBoard } from "../../screens/SellerTrustRiskBoard";
import { SharedDrillPanel } from "../../screens/SharedDrillPanel";

const SCREENS: Record<ScreenId, React.ComponentType> = {
  "command-centre": CategoryCommandCentre,
  "returns-margin": RecoverableMarginReturns,
  "seller-trust": SellerTrustRiskBoard,
  "lane-rto": LaneRtoArbitration,
  "festival-monitor": FestivalIncidentMonitor,
};

export function AppShell(): React.ReactElement {
  const { activeScreen } = useNavigation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const ActiveScreen = SCREENS[activeScreen] ?? CategoryCommandCentre;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background: cssVar("bg"),
        color: cssVar("text-primary"),
        overflow: "hidden",
      }}
    >
      <Sidebar
        expanded={sidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
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
      </div>
      <SharedDrillPanel />
    </div>
  );
}
