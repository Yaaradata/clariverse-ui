/** Canonical IndusInd Bank industry id — isolated from registry.tsx to avoid circular imports. */
export const INDUSIND_BANK_INDUSTRY_ID = "indusind_bank" as const;

/** LisN Customer pulse roles: each opens the customer-pulse screens in its view (CEO's office or Head of CX). */
export const INDUSIND_CEO_OFFICE_ROLE_ID = "indusind_ceo_office" as const;
export const INDUSIND_HEAD_CX_ROLE_ID = "indusind_head_cx" as const;
/** Head of Cards (V1) opens S-CARDS (IND-B4 §7). The earlier Head of Cards demo keeps its own role id (head_cards). */
export const INDUSIND_HEAD_CARDS_ROLE_ID = "indusind_head_cards" as const;
export const INDUSIND_PULSE_BASE =
  "/role-based/indusind_bank/customer-pulse" as const;

export const INDUSIND_PULSE_ROLE_HREF: Record<string, string> = {
  [INDUSIND_CEO_OFFICE_ROLE_ID]: INDUSIND_PULSE_BASE,
  [INDUSIND_HEAD_CX_ROLE_ID]: `${INDUSIND_PULSE_BASE}?v=cx`,
  [INDUSIND_HEAD_CARDS_ROLE_ID]: `${INDUSIND_PULSE_BASE}/cards?r=cards`,
  indusind_mds_office_v2: "/role-based/indusind_bank/pulse-v2/mds-office",
};

/** Pulse V2: the clone of the HDFC pulse V2 screens (MD's office / Head of CX), under /role-based/indusind_bank/pulse-v2. */
export const INDUSIND_PULSE_V2_ROLE_ID = "indusind_mds_office_v2" as const;
export const INDUSIND_PULSE_V2_VERSION = "V2" as const;
export const INDUSIND_PULSE_V2_HREF = `/role-based/${INDUSIND_BANK_INDUSTRY_ID}/pulse-v2/mds-office`;
export const INDUSIND_PULSE_V2_COPY = {
  id: INDUSIND_PULSE_V2_ROLE_ID,
  name: "MD's office / Head of CX",
  sub: "The pulse first, then today's morning brief, business by business",
} as const;

/** The earlier Head of Cards demo (transactions and offers, blockers, drilldowns). Rendered by the shared role page. */
export const INDUSIND_EARLIER_CARDS_ROLE_ID = "head_cards" as const;
export const INDUSIND_EARLIER_CARDS_HREF = `/role-based/${INDUSIND_BANK_INDUSTRY_ID}/${INDUSIND_EARLIER_CARDS_ROLE_ID}`;
export const INDUSIND_EARLIER_CARDS_COPY = {
  id: INDUSIND_EARLIER_CARDS_ROLE_ID,
  name: "Head of Cards",
  sub: "Transactions & offers · blockers & problems · 2 drilldowns · AI Analyst",
} as const;

/** The bank's name as it appears on screen (header text only, IND-B4 §1). */
export const INDUSIND_BANK_NAME = "IndusInd Bank" as const;

/** The customer-pulse roles (V1), in order: one source for the registry and the IndusInd role page. */
export const INDUSIND_PULSE_VERSION = "V1" as const;
export const INDUSIND_ROLE_COPY = [
  {
    id: INDUSIND_CEO_OFFICE_ROLE_ID,
    name: "CEO's office",
    sub: "Customer pulse · inside the bank and in public · four items that need a decision",
  },
  {
    id: INDUSIND_HEAD_CX_ROLE_ID,
    name: "Head of CX",
    sub: "Customer pulse by channel · Ombudsman watch · owners and status",
  },
  {
    id: INDUSIND_HEAD_CARDS_ROLE_ID,
    name: "Head of Cards",
    sub: "Cards business view · issue pulse · Ombudsman watch · closure risk by category",
  },
] as const;
