"use client";

import { ServiceOperationsDrillDown as LegacyServiceOperationsDrillDown } from "../ContactCentreDrillDownScreens";
import { ContainmentAvoidableContactsPanel } from "../widgets/ContainmentAvoidableContactsPanel";
import { CostOfBadServiceOverlay } from "../widgets/CostOfBadServiceOverlay";

type Props = {
  onBack: () => void;
};

export default function ServiceOperationsDrillDown({ onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <LegacyServiceOperationsDrillDown onBack={onBack} />
      <CostOfBadServiceOverlay />
      <ContainmentAvoidableContactsPanel />
    </div>
  );
}
