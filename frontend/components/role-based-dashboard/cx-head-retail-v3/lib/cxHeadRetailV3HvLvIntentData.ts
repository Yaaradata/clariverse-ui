export type HvLvIntentRow = {
  intent: string;
  share: number;
  sentiment: number;
  delta: number;
  sampleQuote: string;
};

/** Flipkart Plus / high-GMV shoppers — top contact intents */
export const HV_SHOPPER_INTENTS: HvLvIntentRow[] = [
  { intent: "Refund / return disputes", share: 22, sentiment: -0.61, delta: -0.12, sampleQuote: "Plus order refunded twice — still waiting on UPI credit." },
  { intent: "UPI / checkout failures", share: 19, sentiment: -0.58, delta: -0.14, sampleQuote: "UPI failed on ₹42K phone cart during BBD sale." },
  { intent: "Express delivery missed", share: 16, sentiment: -0.49, delta: -0.09, sampleQuote: "Flipkart Plus promise broken — order 2 days late." },
  { intent: "Wrong item / damaged goods", share: 13, sentiment: -0.44, delta: -0.07, sampleQuote: "Used laptop received on Flipkart Assured listing." },
  { intent: "Seller trust · electronics", share: 11, sentiment: -0.52, delta: -0.11, sampleQuote: "Third-party seller sent empty box before BBD." },
  { intent: "Complaint escalation", share: 9, sentiment: -0.68, delta: -0.15, sampleQuote: "Escalated on chat twice — no Flipkart callback." },
  { intent: "Platform fee / SuperCoins", share: 6, sentiment: -0.35, delta: -0.04, sampleQuote: "SuperCoins not applied — checkout total jumped." },
  { intent: "Plus early access", share: 4, sentiment: 0.28, delta: 0.03, sampleQuote: "BBD early access slot worked — smooth checkout." },
];

/** Mass / standard Flipkart shoppers — top contact intents */
export const LV_SHOPPER_INTENTS: HvLvIntentRow[] = [
  { intent: "Order not received", share: 24, sentiment: -0.64, delta: -0.13, sampleQuote: "#NeverDelivered — marked delivered, nothing at door." },
  { intent: "Delivery delay", share: 20, sentiment: -0.55, delta: -0.10, sampleQuote: "ETA slipped three times — still at hub." },
  { intent: "App login / OTP", share: 15, sentiment: -0.48, delta: -0.08, sampleQuote: "Flipkart app OTP never arrives on Jio." },
  { intent: "COD / payment issue", share: 12, sentiment: -0.51, delta: -0.09, sampleQuote: "COD blocked after building full cart." },
  { intent: "Return pickup status", share: 10, sentiment: -0.42, delta: -0.05, sampleQuote: "Return pickup scheduled — nobody came." },
  { intent: "Seller trust / fake listing", share: 8, sentiment: -0.46, delta: -0.06, sampleQuote: "Photo on Flipkart ≠ product received." },
  { intent: "Hidden platform fee", share: 6, sentiment: -0.38, delta: -0.03, sampleQuote: "Fee shock at checkout vs cart on Meesho posts." },
  { intent: "X / Reddit escalation", share: 5, sentiment: -0.72, delta: -0.16, sampleQuote: "Posting on X — Flipkart support silent." },
];
