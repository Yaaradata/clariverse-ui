"use client";

import { usePathname } from "next/navigation";
import { isSterlingHeadContact } from "./sterlingHeadContactScreen";

export {
  swapUsdSymbolDeep,
  swapUsdSymbolForSterling,
} from "./sterlingHeadRetailCurrency";

/** True when the browser is on /role-based/sterling_bank/head_contact. */
export function useSterlingHeadContactCurrencyRoute(): boolean {
  const pathname = usePathname();
  if (!pathname) return false;
  return /\/role-based\/sterling_bank\/head_contact(?:\/|$)/.test(pathname);
}

/** Route, explicit prop, or industry+role — Sterling head_contact £ mode. */
export function useSterlingHeadContactCurrencyActive(
  explicit?: boolean,
  industryId?: string,
  roleId?: string,
): boolean {
  const fromRoute = useSterlingHeadContactCurrencyRoute();
  if (explicit === true || fromRoute) return true;
  if (industryId && roleId) return isSterlingHeadContact(industryId, roleId);
  return false;
}
