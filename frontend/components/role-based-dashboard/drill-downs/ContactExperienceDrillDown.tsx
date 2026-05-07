"use client";

import { ContactExperienceDrillDown as LegacyContactExperienceDrillDown } from "../ContactCentreDrillDownScreens";

type Props = {
  onBack: () => void;
};

export default function ContactExperienceDrillDown({ onBack }: Props) {
  return <LegacyContactExperienceDrillDown onBack={onBack} />;
}
