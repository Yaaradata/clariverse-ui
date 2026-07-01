"use client";

import { ServiceReputationDrillDown as LegacyServiceReputationDrillDown } from "../ContactCentreDrillDownScreens";

type Props = {
  onBack: () => void;
  sterlingContact?: boolean;
};

export default function ServiceReputationDrillDown({
  onBack,
  sterlingContact = false,
}: Props) {
  return (
    <LegacyServiceReputationDrillDown
      onBack={onBack}
      sterlingContact={sterlingContact}
    />
  );
}
