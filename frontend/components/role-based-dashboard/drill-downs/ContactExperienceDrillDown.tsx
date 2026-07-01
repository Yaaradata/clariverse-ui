"use client";

import {
  ContactExperienceDrillDown as LegacyContactExperienceDrillDown,
  type ContactExperienceDrillVariant,
} from "../ContactCentreDrillDownScreens";

type Props = {
  onBack: () => void;
  variant?: ContactExperienceDrillVariant;
};

export type { ContactExperienceDrillVariant };

export default function ContactExperienceDrillDown({ onBack, variant = "default" }: Props) {
  return <LegacyContactExperienceDrillDown onBack={onBack} variant={variant} />;
}
