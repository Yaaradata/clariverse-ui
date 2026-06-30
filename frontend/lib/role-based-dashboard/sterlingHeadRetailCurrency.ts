"use client";

import { usePathname } from "next/navigation";
import { isSterlingHeadRetail } from "./sterlingHeadContactScreen";

/** Replace US-dollar currency symbol with pounds sterling — Sterling Bank head_retail demo only. */
export function swapUsdSymbolForSterling(text: string): string {
  return text.replace(/\$/g, "£");
}

/** Deep-walk strings in mock data / API payloads for £ display on sterling_bank/head_retail. */
export function swapUsdSymbolDeep<T>(value: T): T {
  if (typeof value === "string") {
    return swapUsdSymbolForSterling(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => swapUsdSymbolDeep(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = swapUsdSymbolDeep(nested);
    }
    return out as T;
  }
  return value;
}

/** True when the browser is on /role-based/sterling_bank/head_retail. */
export function useSterlingHeadRetailCurrencyRoute(): boolean {
  const pathname = usePathname();
  if (!pathname) return false;
  return /\/role-based\/sterling_bank\/head_retail(?:\/|$)/.test(pathname);
}

/** Route or explicit prop or industry+role — any signals Sterling head_retail £ mode. */
export function useSterlingHeadRetailCurrencyActive(
  explicit?: boolean,
  industryId?: string,
  roleId?: string,
): boolean {
  const fromRoute = useSterlingHeadRetailCurrencyRoute();
  if (explicit === true || fromRoute) return true;
  if (industryId && roleId) return isSterlingHeadRetail(industryId, roleId);
  return false;
}
