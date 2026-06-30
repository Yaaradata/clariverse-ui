import { STERLING_BANK_INDUSTRY_ID } from "./sterlingBankIndustry";

/** Sterling Bank / head_retail — Raghu Narula franchise dashboard (main page + drill tiles). */
export function isSterlingHeadRetail(
  industryId: string,
  roleId: string,
): boolean {
  return industryId === STERLING_BANK_INDUSTRY_ID && roleId === "head_retail";
}

/** Sterling Bank / head_contact route — shares retail_banking/head_contact data and UI. */
export function isSterlingHeadContact(
  industryId: string,
  roleId: string,
): boolean {
  return industryId === STERLING_BANK_INDUSTRY_ID && roleId === "head_contact";
}

/**
 * sterling_bank/head_contact mirrors retail_banking/head_contact (ROLE_DATA key + layout).
 * Industry context stays Sterling Bank; persona content matches retail head_contact.
 */
export function sterlingHeadContactUsesRetailParity(
  industryId: string,
  roleId: string,
): boolean {
  return isSterlingHeadContact(industryId, roleId);
}

/** Registry ROLE_DATA key — Sterling head_contact resolves to retail head_contact. */
export function resolveRoleDataKey(industryId: string, roleId: string): string {
  if (sterlingHeadContactUsesRetailParity(industryId, roleId)) {
    return "head_contact";
  }
  if (roleId === "head_cx_retail" || roleId === "head_cx_retail_v2") {
    return "head_cx";
  }
  return roleId;
}

/** Executive Brief hidden for Sterling head_retail only (head_contact matches retail). */
export function shouldShowExecutiveBrief(
  industryId: string,
  roleId: string,
): boolean {
  if (roleId === "cards_portfolio") return false;
  if (isSterlingHeadRetail(industryId, roleId)) return false;
  return true;
}

/**
 * AI Risk Spike Monitor on sterling_bank/head_contact — force dark card tokens so
 * Channel / Top Intent / Time labels stay legible on the role-dashboard shell.
 */
export function sterlingHeadContactRiskSpikeMonitorProps(): {
  forceDarkMode: true;
} {
  return { forceDarkMode: true };
}
