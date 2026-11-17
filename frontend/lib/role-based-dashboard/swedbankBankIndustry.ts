/** Swedbank industry on the role-based landing page (SW-D13): isolated from registry.tsx to avoid circular imports. */
export const SWEDBANK_BANK_INDUSTRY_ID = "swedbank_bank" as const;

/** The one role: Head of Customer Experience, opening the Swedbank customer pulse (app/swedbank-pulse/v1). */
export const SWEDBANK_HEAD_CX_ROLE_ID = "swedbank_head_cx" as const;

export const SWEDBANK_ROLE_HREF: Record<string, string> = {
  [SWEDBANK_HEAD_CX_ROLE_ID]: "/swedbank-pulse/v1/head-of-cx",
};

/** The bank's name as shown: header text only, no logo, no brand colour. */
export const SWEDBANK_BANK_NAME = "Swedbank" as const;

export const SWEDBANK_ROLE_COPY = [
  {
    id: SWEDBANK_HEAD_CX_ROLE_ID,
    name: "Head of Customer Experience",
    sub: "Customer pulse across channels · Nina hand-offs · ARN watch · FI focus areas",
  },
] as const;
