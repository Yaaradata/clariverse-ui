/** Canonical Indus Ind Bank industry id — isolated from registry.tsx to avoid circular imports. */
export const INDUSIND_BANK_INDUSTRY_ID = "indusind_bank" as const;

/** On every IndusInd screen, the role page included (IND-B4 §1). */
export const INDUSIND_WATERMARK =
  "Demonstration · public data plus illustrative internal data · not IndusInd Bank MIS";

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
