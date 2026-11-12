/** Canonical HDFC industry id — isolated from registry.tsx to avoid circular imports. */
export const HDFC_BANK_INDUSTRY_ID = "hdfc" as const;

/** LisN Customer Pulse demo versions, listed as HDFC roles; each opens its own dashboard route. */
export const HDFC_PULSE_V1_ROLE_ID = "lisn_pulse_v1" as const;
export const HDFC_PULSE_V2_ROLE_ID = "lisn_pulse_v2" as const;

/**
 * Every LisN demo version stays reachable, as tabs on the one LisN card (newest first). The 13 Oct review build is a
 * frozen copy (components/hdfc-oct13, lib/hdfc-oct13, app/hdfc-pulse/oct13) of the screens Vidya reviewed, before V4.
 */
export const HDFC_PULSE_VERSIONS: Record<
  string,
  { label: string; href: string; title: string }[]
> = {
  [HDFC_PULSE_V2_ROLE_ID]: [
    {
      label: "V4",
      href: "/hdfc-pulse/v2/mds-office",
      title: "Current: V4 (B11), with actions, roles and presenter mode",
    },
    {
      label: "13 Oct",
      href: "/hdfc-pulse/oct13/mds-office",
      title: "As reviewed on 13 Oct, before V4",
    },
    {
      label: "V1",
      href: "/hdfc-pulse/v1/mds-office",
      title: "Customer Pulse as first shown",
    },
  ],
};

export const HDFC_PULSE_ROLE_HREF: Record<string, string> = {
  [HDFC_PULSE_V1_ROLE_ID]: "/hdfc-pulse/v1/mds-office",
  [HDFC_PULSE_V2_ROLE_ID]: "/hdfc-pulse/v2/mds-office",
};
