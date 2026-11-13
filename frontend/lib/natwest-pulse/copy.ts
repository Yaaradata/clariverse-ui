/**
 * NatWest Group · screen copy (the register swap of docs/natwest/brief.md Step 4). Titles and subtitles follow HL-22:
 * subtitles at most 6 words, items at most 12. Regulatory wording lives in the register
 * (data/public/natwest_register.json), never here.
 */

export const OUTCOME_LABEL: Record<string, string> = {
  products_services: "Products and services",
  price_value: "Price and value",
  understanding: "Consumer understanding",
  support: "Consumer support",
};

export const SCREEN_COPY = {
  home: { title: "Customer pulse", subtitle: "Group first, then segments" },
  channel: {
    title: "Cross-channel pulse",
    subtitle: "Same metrics, every channel",
  },
  cora: { title: "Cora leakage", subtitle: "Resolved by Cora, then back" },
  fos: {
    title: "Ombudsman watch",
    subtitle: "Eligibility and risk, not prediction",
  },
  duty: {
    title: "Consumer Duty outcomes",
    subtitle: "Four outcomes by segment",
  },
  brand: { title: "Brand lens", subtitle: "Three brands side by side" },
  agents: {
    title: "AI-agent outcomes",
    subtitle: "Followed to repeat contact",
  },
  ledger: { title: "Timelines", subtitle: "Met and outside, by rule" },
} as const;

/** Definitions behind each (i). */
export const DEFINITIONS: Record<string, string> = {
  negative: "Share of contacts whose outcome code or wording is negative.",
  repeat:
    "Share of contacts followed by another on the same theme within 7 days.",
  resolved:
    "Closed at first contact with no repeat within 7 days. Complaints: closed within 3 days.",
  leakage:
    "Of journeys Cora marked resolved, the share back as a call or complaint within 7 days.",
  at_risk:
    "Awaiting a final response, 7 days or fewer left (3 business days for payment services).",
};
