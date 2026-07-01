"use client";

import { ServiceOperationsDrillDown as LegacyServiceOperationsDrillDown } from "../ContactCentreDrillDownScreens";
import { ContainmentAvoidableContactsPanel } from "../widgets/ContainmentAvoidableContactsPanel";
import { CostOfBadServiceOverlay } from "../widgets/CostOfBadServiceOverlay";

type Props = {
  onBack: () => void;
  sterlingContact?: boolean;
};

export default function ServiceOperationsDrillDown({
  onBack,
  sterlingContact = false,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <LegacyServiceOperationsDrillDown
        onBack={onBack}
        sterlingContact={sterlingContact}
      />
      {!sterlingContact ? (
        <>
          <CostOfBadServiceOverlay />
          <ContainmentAvoidableContactsPanel />
        </>
      ) : null}
    </div>
  );
}
