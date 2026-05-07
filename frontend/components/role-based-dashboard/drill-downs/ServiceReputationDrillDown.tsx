"use client";

import { ServiceReputationDrillDown as LegacyServiceReputationDrillDown } from "../ContactCentreDrillDownScreens";

type Props = {
  onBack: () => void;
};

export default function ServiceReputationDrillDown({ onBack }: Props) {
  return <LegacyServiceReputationDrillDown onBack={onBack} />;
}
