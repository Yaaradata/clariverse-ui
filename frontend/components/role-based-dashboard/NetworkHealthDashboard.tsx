"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ControlTowerLeadership from "./network-health/ControlTowerLeadership";
import NetworkHealth from "./network-health/NetworkHealth";

export type NetworkHealthDashboardProps = {
  onExit: () => void;
};

function NetworkHealthDashboardInner({
  onExit,
}: NetworkHealthDashboardProps): React.ReactElement {
  const searchParams = useSearchParams();
  const version = searchParams.get("v") === "2" ? "v2" : "v1";

  if (version === "v2") {
    return <ControlTowerLeadership onExit={onExit} />;
  }

  return <NetworkHealth onExit={onExit} />;
}

/** Delivery Network Health control tower for the ecommerce Network Health role. */
export function NetworkHealthDashboard({
  onExit,
}: NetworkHealthDashboardProps): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <NetworkHealthDashboardInner onExit={onExit} />
    </Suspense>
  );
}

export default NetworkHealthDashboard;
