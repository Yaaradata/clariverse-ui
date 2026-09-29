/** Canonical Kidde Global industry id — isolated from registry.tsx to avoid circular imports. */
export const KIDDE_GLOBAL_INDUSTRY_ID = "kidde_global" as const;

/** Placeholder role — dashboard content not wired yet. */
export const KIDDE_GLOBAL_HEAD_OF_CX_ROLE_ID = "head_cx" as const;

/** KGS Commercial Fire President role */
export const KIDDE_GLOBAL_PRESIDENT_ROLE_ID = "president_commercial_fire" as const;

export function isKiddeGlobalIndustry(industryId: string): boolean {
  return industryId === KIDDE_GLOBAL_INDUSTRY_ID;
}
