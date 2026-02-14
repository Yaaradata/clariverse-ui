"use client";

import { AIRiskSpikeMonitor, type RiskSpike } from "@/components/unified/actions/AIRiskSpikeMonitor";
import { flipkartRiskSpikes } from "@/lib/flipkart/riskSpikes";

/**
 * Flipkart AI Risk Spike Monitor – same UI as unified dashboard,
 * with e-commerce operational alerts (delivery, returns, payment, etc.).
 */
export function FlipkartRiskSpikeMonitor() {
  return <AIRiskSpikeMonitor spikes={flipkartRiskSpikes as RiskSpike[]} />;
}
