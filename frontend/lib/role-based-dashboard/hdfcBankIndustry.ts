/** Canonical HDFC industry id — isolated from registry.tsx to avoid circular imports. */
export const HDFC_BANK_INDUSTRY_ID = "hdfc" as const;

/** LisN Customer Pulse demo versions, listed as HDFC roles; each opens its own dashboard route. */
export const HDFC_PULSE_V1_ROLE_ID = "lisn_pulse_v1" as const;
export const HDFC_PULSE_V2_ROLE_ID = "lisn_pulse_v2" as const;

export const HDFC_PULSE_ROLE_HREF: Record<string, string> = {
  [HDFC_PULSE_V1_ROLE_ID]: "/hdfc-pulse/v1/mds-office",
  [HDFC_PULSE_V2_ROLE_ID]: "/hdfc-pulse/v2/mds-office",
};
