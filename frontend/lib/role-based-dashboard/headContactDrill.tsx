"use client";

import type { ReactElement } from "react";
import ContactExperienceDrillDown, {
  type ContactExperienceDrillVariant,
} from "@/components/role-based-dashboard/drill-downs/ContactExperienceDrillDown";
import ServiceOperationsDrillDown from "@/components/role-based-dashboard/drill-downs/ServiceOperationsDrillDown";
import ServiceReputationDrillDown from "@/components/role-based-dashboard/drill-downs/ServiceReputationDrillDown";
import { sterlingHeadContactUsesRetailParity } from "@/lib/role-based-dashboard/sterlingHeadContactScreen";

export function headContactDrillVariant(
  industryId: string,
  roleId: string,
): ContactExperienceDrillVariant {
  return sterlingHeadContactUsesRetailParity(industryId, roleId)
    ? "sterling-contact"
    : "default";
}

/**
 * Head of Contact Centre drill stack — retail_banking/head_contact layout;
 * sterling_bank/head_contact swaps £ + UK intents only.
 */
export function renderHeadContactDrillCard(
  drillCard: number,
  onBack: () => void,
  industryId: string,
  roleId: string,
): ReactElement {
  const sterlingContact = sterlingHeadContactUsesRetailParity(industryId, roleId);
  const experienceVariant = headContactDrillVariant(industryId, roleId);

  if (drillCard === 0) {
    return (
      <ContactExperienceDrillDown onBack={onBack} variant={experienceVariant} />
    );
  }
  if (drillCard === 1) {
    return (
      <ServiceReputationDrillDown
        onBack={onBack}
        sterlingContact={sterlingContact}
      />
    );
  }
  return (
    <ServiceOperationsDrillDown
      onBack={onBack}
      sterlingContact={sterlingContact}
    />
  );
}
