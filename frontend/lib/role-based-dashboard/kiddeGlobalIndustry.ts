/** Canonical Kidde Global industry id — isolated from registry.tsx to avoid circular imports. */
export const KIDDE_GLOBAL_INDUSTRY_ID = "kidde_global" as const;

/** President, Global Commercial Fire — the LiSN × KGS field-signal demo. */
export const KIDDE_GLOBAL_PRESIDENT_ROLE_ID =
  "president_commercial_fire" as const;

export function isKiddeGlobalPresident(
  industryId: string,
  roleId: string,
): boolean {
  return (
    industryId === KIDDE_GLOBAL_INDUSTRY_ID &&
    roleId === KIDDE_GLOBAL_PRESIDENT_ROLE_ID
  );
}
