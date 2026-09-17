"use client";

import type { ReactElement } from "react";
import ContactExperienceDrillDown, {
  type ContactExperienceDrillVariant,
} from "@/components/role-based-dashboard/drill-downs/ContactExperienceDrillDown";
import ServiceOperationsDrillDown from "@/components/role-based-dashboard/drill-downs/ServiceOperationsDrillDown";
import ServiceReputationDrillDown from "@/components/role-based-dashboard/drill-downs/ServiceReputationDrillDown";
import ContactsEndingWellDashboard from "@/components/role-based-dashboard/hdfc/ContactsEndingWellDashboard";
import HdfcServiceDeliveryDrillDown from "@/components/role-based-dashboard/hdfc/HdfcServiceDeliveryDrillDown";
import ServiceReputationDashboard from "@/components/role-based-dashboard/hdfc/ServiceReputationDashboard";
import { isHdfcHeadOfCx } from "@/lib/role-based-dashboard/hdfcHeadOfCxScreen";
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
 * Head of Contact Centre / HDFC Head of CX drill stack.
 *
 * HDFC head_of_cx:
 *   drill 0 = Contacts Ending Well
 *   drill 1 = Service Reputation
 *   drill 2 = Service delivery (same UI as retail head_retail)
 */
export function renderHeadContactDrillCard(
  drillCard: number,
  onBack: () => void,
  industryId: string,
  roleId: string,
): ReactElement {
  const sterlingContact = sterlingHeadContactUsesRetailParity(industryId, roleId);
  const experienceVariant = headContactDrillVariant(industryId, roleId);
  const hdfcHeadOfCx = isHdfcHeadOfCx(industryId, roleId);

  if (drillCard === 0) {
    if (hdfcHeadOfCx) {
      return <ContactsEndingWellDashboard onBack={onBack} />;
    }
    return (
      <ContactExperienceDrillDown onBack={onBack} variant={experienceVariant} />
    );
  }

  if (drillCard === 1) {
    if (hdfcHeadOfCx) {
      return <ServiceReputationDashboard onBack={onBack} />;
    }
    return (
      <ServiceReputationDrillDown
        onBack={onBack}
        sterlingContact={sterlingContact}
      />
    );
  }

  // drill 2 — Can the engine deliver? → retail "How is our Service delivery?"
  if (hdfcHeadOfCx) {
    return <HdfcServiceDeliveryDrillDown onBack={onBack} />;
  }

  return (
    <ServiceOperationsDrillDown
      onBack={onBack}
      sterlingContact={sterlingContact}
    />
  );
}
