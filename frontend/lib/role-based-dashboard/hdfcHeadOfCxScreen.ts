import { HDFC_BANK_INDUSTRY_ID } from "./hdfcBankIndustry";

/** Canonical HDFC Head of CX role id — route: /role-based/hdfc/head_of_cx */
export const HDFC_HEAD_OF_CX_ROLE_ID = "head_of_cx" as const;

/**
 * HDFC / head_of_cx — dedicated industry role that renders the same
 * retail_banking/head_contact dashboard (ROLE_DATA + drills), without Sterling forks.
 *
 * Route: /role-based/hdfc/head_of_cx
 */
export function isHdfcHeadOfCx(
  industryId: string,
  roleId: string,
): boolean {
  return (
    industryId === HDFC_BANK_INDUSTRY_ID && roleId === HDFC_HEAD_OF_CX_ROLE_ID
  );
}

/** @deprecated Use isHdfcHeadOfCx — old /hdfc/head_contact alias. */
export function isHdfcHeadContact(
  industryId: string,
  roleId: string,
): boolean {
  return (
    isHdfcHeadOfCx(industryId, roleId) ||
    (industryId === HDFC_BANK_INDUSTRY_ID && roleId === "head_contact")
  );
}

/** HDFC Head of CX reuses retail head_contact ROLE_DATA + UI. */
export function hdfcHeadOfCxUsesRetailParity(
  industryId: string,
  roleId: string,
): boolean {
  return isHdfcHeadOfCx(industryId, roleId) || isHdfcHeadContact(industryId, roleId);
}

/** @deprecated Prefer hdfcHeadOfCxUsesRetailParity */
export const hdfcHeadContactUsesRetailParity = hdfcHeadOfCxUsesRetailParity;

/**
 * True for roles that use the Head of Contact Centre dashboard stack
 * (tiles, drills, sidebar screen-1 only).
 */
export function isContactCentreDashboardRole(roleId: string): boolean {
  return roleId === "head_contact" || roleId === HDFC_HEAD_OF_CX_ROLE_ID;
}
