/** Canonical Kidde Global industry id — isolated from registry.tsx to avoid circular imports. */
export const KIDDE_GLOBAL_INDUSTRY_ID = "kidde_global" as const;

/** President, Global Commercial Fire — the LiSN × KGS field-signal demo (v1). */
export const KIDDE_GLOBAL_PRESIDENT_ROLE_ID =
  "president_commercial_fire" as const;

/** Regional GM, Asia ex China — LiSN × KGS v2 demo. */
export const KIDDE_GLOBAL_REGIONAL_GM_ROLE_ID = "regional_gm_asia" as const;

export function isKiddeGlobalPresident(
  industryId: string,
  roleId: string,
): boolean {
  return (
    industryId === KIDDE_GLOBAL_INDUSTRY_ID &&
    roleId === KIDDE_GLOBAL_PRESIDENT_ROLE_ID
  );
}

export function isKiddeGlobalRegionalGm(
  industryId: string,
  roleId: string,
): boolean {
  return (
    industryId === KIDDE_GLOBAL_INDUSTRY_ID &&
    roleId === KIDDE_GLOBAL_REGIONAL_GM_ROLE_ID
  );
}
