/** Canonical Neogroup industry id — isolated from registry.tsx to avoid circular imports. */
export const NEOGROUP_INDUSTRY_ID = "neogroup" as const;

/** Neogroup · Head of Client Experience — same role id as Nuvama, separate industry route. */
export const NEOGROUP_HEAD_CLIENT_EXPERIENCE_ROLE_ID =
  "head_client_experience" as const;

export function isNeogroupHeadClientExperience(
  industryId: string,
  roleId: string,
): boolean {
  return (
    industryId === NEOGROUP_INDUSTRY_ID &&
    roleId === NEOGROUP_HEAD_CLIENT_EXPERIENCE_ROLE_ID
  );
}
