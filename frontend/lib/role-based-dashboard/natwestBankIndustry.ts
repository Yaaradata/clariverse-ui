/** NatWest Group industry on the role-based landing page — isolated from registry.tsx to avoid circular imports. */
export const NATWEST_BANK_INDUSTRY_ID = "natwest_bank" as const;

/** The one role: Head of Customer Experience, opening the NatWest customer pulse (app/natwest-pulse/v1). */
export const NATWEST_HEAD_CX_ROLE_ID = "natwest_head_cx" as const;

export const NATWEST_ROLE_HREF: Record<string, string> = {
  [NATWEST_HEAD_CX_ROLE_ID]: "/natwest-pulse/v1/mds-office",
};

/** The group's name as shown: header text only, no logo, no brand colour. */
export const NATWEST_BANK_NAME = "NatWest Group" as const;

export const NATWEST_ROLE_COPY = [
  {
    id: NATWEST_HEAD_CX_ROLE_ID,
    name: "Head of Customer Experience",
    sub: "Customer pulse across channels and brands · Cora leakage · Ombudsman watch · Consumer Duty outcomes",
  },
] as const;
