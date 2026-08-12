"use client";

import React from "react";
import NetworkHealth from "./network-health/NetworkHealth";

export type NetworkHealthDashboardProps = {
  onExit: () => void;
};

/** Delivery Network Health control tower for the ecommerce Network Health role. */
export function NetworkHealthDashboard({
  onExit,
}: NetworkHealthDashboardProps): React.ReactElement {
  return <NetworkHealth onExit={onExit} />;
}

export default NetworkHealthDashboard;
