/** Canonical Indus Ind Bank industry id — isolated from registry.tsx to avoid circular imports. */
export const INDUSIND_BANK_INDUSTRY_ID = "indusind_bank" as const;

/** LisN Customer pulse roles: each opens the customer-pulse screens in its view (CEO's office or Head of CX). */
export const INDUSIND_CEO_OFFICE_ROLE_ID = "indusind_ceo_office" as const;
export const INDUSIND_HEAD_CX_ROLE_ID = "indusind_head_cx" as const;
export const INDUSIND_PULSE_BASE =
  "/role-based/indusind_bank/customer-pulse" as const;

export const INDUSIND_PULSE_ROLE_HREF: Record<string, string> = {
  [INDUSIND_CEO_OFFICE_ROLE_ID]: INDUSIND_PULSE_BASE,
  [INDUSIND_HEAD_CX_ROLE_ID]: `${INDUSIND_PULSE_BASE}?v=cx`,
};
