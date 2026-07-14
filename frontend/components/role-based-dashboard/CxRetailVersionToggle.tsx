/** Kept for shell context typing; version picker removed — only v3 ships. */
export type CxRetailVersion = "v1" | "v2" | "v3";

export function cxRetailVersionFromRoleId(roleId: string): CxRetailVersion | null {
  if (roleId === "head_cx_retail") return "v3";
  return null;
}
