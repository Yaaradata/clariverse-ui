/** Canonical IndusInd Bank industry id — isolated from registry.tsx to avoid circular imports. */
export const INDUSIND_BANK_INDUSTRY_ID = "indusind_bank" as const;

/** On every IndusInd screen, the role page included (IND-B4 §1). */
export const INDUSIND_WATERMARK =
  "Demonstration · public and modelled data plus illustrative internal data · not IndusInd Bank MIS";

/** LisN Customer pulse roles: each opens the customer-pulse screens in its view (CEO's office or Head of CX). */
export const INDUSIND_CEO_OFFICE_ROLE_ID = "indusind_ceo_office" as const;
export const INDUSIND_HEAD_CX_ROLE_ID = "indusind_head_cx" as const;
/** Head of Cards opens S-CARDS (IND-B4 §7). The earlier cards demo (head_cards) is unlisted and its URL redirects to S-CARDS. */
export const INDUSIND_HEAD_CARDS_ROLE_ID = "indusind_head_cards" as const;
export const INDUSIND_PULSE_BASE =
  "/role-based/indusind_bank/customer-pulse" as const;

export const INDUSIND_PULSE_ROLE_HREF: Record<string, string> = {
  [INDUSIND_CEO_OFFICE_ROLE_ID]: INDUSIND_PULSE_BASE,
  [INDUSIND_HEAD_CX_ROLE_ID]: `${INDUSIND_PULSE_BASE}?v=cx`,
  [INDUSIND_HEAD_CARDS_ROLE_ID]: `${INDUSIND_PULSE_BASE}/cards?r=cards`,
  // The earlier cards demo: its URL opens the Cards business view (next.config.mjs redirects it on the server too).
  head_cards: `${INDUSIND_PULSE_BASE}/cards?r=cards`,
};

/** The bank's name as it appears on screen (header text only, IND-B4 §1). */
export const INDUSIND_BANK_NAME = "IndusInd Bank" as const;

/** The listed roles, in order: one source for the registry and the IndusInd role page. */
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
