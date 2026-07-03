import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  Layers,
  Linkedin,
  Mail,
  MessageSquare,
  PackageX,
  Phone,
  RefreshCw,
  Shield,
  ShieldAlert,
  Tag,
  Target,
  Truck,
} from "lucide-react";

export type TrustDriverId =
  | "damaged"
  | "refund"
  | "wrong"
  | "hidden"
  | "never"
  | "counterfeit"
  | "ato"
  | "missing";

export type TrustDriverType = "slope" | "cliff";
export type TrustRangeKey = "24H" | "7D" | "30D";
export type TrustRagLevel = "good" | "watch" | "high" | "crit";
export type TrustQuadKind = "cliff" | "hotspot" | "ops" | "monitor";
export type TrustActionKind = "Route" | "Escalate" | "Act now";

export interface TrustDriver {
  id: TrustDriverId;
  label: string;
  icon: LucideIcon;
  complaints: number;
  wow: number;
  sentNeg: number;
  conf: number;
  repeat: number;
  type: TrustDriverType;
  incident: number;
  blast: number;
  meaning: string;
  next: string;
  dealPoints: readonly [string, string, string];
}

export interface TrustCategoryCutRow {
  label: string;
  share: number;
  complaints: number;
  wow: number;
  negSentiment: number;
}

export interface TrustSegmentMatrixRow {
  code: "HVHF" | "HVLF" | "LVHF" | "LVLF";
  share: number;
  complaints: number;
}

export interface TrustChannelCutRow {
  label: string;
  share: number;
  complaints: number;
  messages: readonly [string, string, string, string];
}

export interface TrustPathCutRow {
  label: string;
  share: number;
  complaints: number;
  detail: string;
}

export interface TrustDriverCut {
  verdict: string;
  conf: number;
  category: TrustCategoryCutRow[];
  seller: [string, number][];
  region: [string, number][];
  path: TrustPathCutRow[];
  segment: [string, number][];
  segmentMatrix: TrustSegmentMatrixRow[];
  channel: TrustChannelCutRow[];
}

export interface TrustSegment {
  label: string;
  affected: number;
  wow: number;
  drop: number;
  conf: number;
  aiInsight: string;
}

export interface TrustEvidence {
  src: string;
  icon: LucideIcon;
  quote: string;
  tag: string;
}

export interface TrustAction {
  issue: string;
  cause: string;
  team: string;
  action: string;
  kind: TrustActionKind;
}

export const TRUST_RANGES: Record<
  TrustRangeKey,
  { f: number; delta: string; period: string }
> = {
  "24H": { f: 0.16, delta: "vs prev day", period: "last 24 hours" },
  "7D": { f: 1, delta: "WoW", period: "this week" },
  "30D": { f: 3.7, delta: "MoM", period: "last 30 days" },
};

export const TRUST_RAG: Record<TrustRagLevel, { label: string }> = {
  good: { label: "Healthy" },
  watch: { label: "Watch" },
  high: { label: "Elevated" },
  crit: { label: "Critical" },
};

export const TRUST_DRIVERS: TrustDriver[] = [
  {
    id: "damaged",
    label: "Damaged Product",
    icon: PackageX,
    complaints: 12840,
    wow: 18,
    sentNeg: 71,
    conf: 92,
    repeat: 2.4,
    type: "slope",
    incident: 3.1,
    blast: 55,
    meaning: "Customers doubt product quality and fulfilment reliability.",
    next: "Drill damage by category & pincode, then route the top-5 pincodes to Supply Chain.",
    dealPoints: [
      "Drill damage by category & pincode",
      "Route top-5 pincodes to Supply Chain",
      "QA-hold repeat-damage sellers",
    ],
  },
  {
    id: "refund",
    label: "Refund Not Credited",
    icon: RefreshCw,
    complaints: 6540,
    wow: 22,
    sentNeg: 78,
    conf: 90,
    repeat: 2.1,
    type: "slope",
    incident: 1.6,
    blast: 78,
    meaning: "Customers feel their money is unsafe — the fastest trust eroder.",
    next: "Validate refund-status mismatch between comms and the payment ledger → Payments.",
    dealPoints: [
      "Fix refund-status vs ledger mismatch",
      "Escalate refunds pending >48h",
      "Send proactive wallet-credit alerts",
    ],
  },
  {
    id: "wrong",
    label: "Wrong Item Received",
    icon: Layers,
    complaints: 8120,
    wow: 11,
    sentNeg: 64,
    conf: 89,
    repeat: 1.9,
    type: "slope",
    incident: 2.0,
    blast: 42,
    meaning: "Fulfilment feels unreliable; erodes confidence at scale.",
    next: "Re-check seller-to-catalog SKU mapping for flagged sellers → Marketplace.",
    dealPoints: [
      "Re-check SKU mapping for flagged sellers",
      "Audit pick-pack errors by fulfilment centre",
      "Replacement-first before refund offer",
    ],
  },
  {
    id: "hidden",
    label: "Hidden Platform Fee",
    icon: Tag,
    complaints: 4210,
    wow: 31,
    sentNeg: 68,
    conf: 85,
    repeat: 1.4,
    type: "slope",
    incident: 1.1,
    blast: 48,
    meaning: "Customers feel misled when fees surface late in checkout.",
    next: "Review fee-communication clarity at the checkout step → Product / Pricing.",
    dealPoints: [
      "Clarify fees at checkout step",
      "Show all fees before payment confirm",
      "Test transparent cart fee breakdown",
    ],
  },
  {
    id: "never",
    label: "Never Delivered",
    icon: Truck,
    complaints: 3180,
    wow: 14,
    sentNeg: 82,
    conf: 91,
    repeat: 2.6,
    type: "slope",
    incident: 0.9,
    blast: 70,
    meaning: "Severe fulfilment failure; high anxiety before contact even lands.",
    next: "Trace the non-delivery cohort and fire proactive re-promise notifications.",
    dealPoints: [
      "Trace ND cohort by hub & carrier",
      "Re-promise affected orders within 2h",
      "Escalate repeat ND hubs to last-mile ops",
    ],
  },
  {
    id: "counterfeit",
    label: "Counterfeit Concern",
    icon: ShieldAlert,
    complaints: 640,
    wow: 9,
    sentNeg: 88,
    conf: 94,
    repeat: 1.2,
    type: "cliff",
    incident: 0.18,
    blast: 92,
    meaning: "Authenticity doubt with regulatory exposure in consumables.",
    next: "Trigger a seller compliance review for baby-food & consumable SKUs → Trust & Safety.",
    dealPoints: [
      "Compliance review on consumable SKUs",
      "Pull evidence on exposed listings",
      "Trust & Safety hold on flagged sellers",
    ],
  },
  {
    id: "ato",
    label: "Account Takeover",
    icon: Shield,
    complaints: 210,
    wow: 6,
    sentNeg: 95,
    conf: 96,
    repeat: 1.1,
    type: "cliff",
    incident: 0.06,
    blast: 96,
    meaning: "Immediate financial-trust collapse — a true cliff event.",
    next: "Escalate flagged accounts and wallet activity → Fraud / Security.",
    dealPoints: [
      "Escalate flagged wallet activity now",
      "Lock wallet + force step-up auth",
      "Route to Fraud / Security in 15 min",
    ],
  },
  {
    id: "missing",
    label: "Item Missing in Order",
    icon: Target,
    complaints: 1120,
    wow: 8,
    sentNeg: 85,
    conf: 93,
    repeat: 1.5,
    type: "cliff",
    incident: 0.3,
    blast: 84,
    meaning: "Customer feels cheated when a paid item is absent from the box.",
    next: "Reconcile shipment manifests for affected SKUs → Ops.",
    dealPoints: [
      "Reconcile manifests for affected SKUs",
      "Match pick-list to pack-scan & POD",
      "Instant credit on verified missing items",
    ],
  },
];

const categoryRow = (
  total: number,
  label: string,
  share: number,
  wow: number,
  negSentiment: number,
): TrustCategoryCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  wow,
  negSentiment,
});

const segmentMatrix = (
  total: number,
  hvhf: number,
  hvlf: number,
  lvhf: number,
  lvlf: number,
): TrustSegmentMatrixRow[] => [
  { code: "HVHF", share: hvhf, complaints: Math.round((total * hvhf) / 100) },
  { code: "HVLF", share: hvlf, complaints: Math.round((total * hvlf) / 100) },
  { code: "LVHF", share: lvhf, complaints: Math.round((total * lvhf) / 100) },
  { code: "LVLF", share: lvlf, complaints: Math.round((total * lvlf) / 100) },
];

const channelRow = (
  total: number,
  label: string,
  share: number,
  messages: readonly [string, string, string, string],
): TrustChannelCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  messages,
});

const pathRow = (total: number, label: string, share: number, detail: string): TrustPathCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  detail,
});

export const TRUST_DRIVER_CUTS: Record<TrustDriverId, TrustDriverCut> = {
  damaged: {
    verdict:
      "Damage is concentrated in Mobiles & Appliances, driven by marketplace sellers on the Ekart-North route into Tier-2 pincodes. Route a packaging + handling audit to Supply Chain for the top 5 pincodes.",
    conf: 92,
    category: [
      categoryRow(12840, "Mobiles", 34, 22, 74),
      categoryRow(12840, "Appliances", 28, 18, 71),
      categoryRow(12840, "Furniture", 18, 14, 68),
      categoryRow(12840, "Fashion", 12, 11, 65),
      categoryRow(12840, "Others", 8, 9, 62),
    ],
    seller: [
      ["Marketplace seller", 68],
      ["Flipkart-fulfilled", 32],
    ],
    region: [
      ["Jaipur · 302012", 14],
      ["Lucknow · 226010", 12],
      ["Patna · 800001", 11],
      ["Kanpur · 208001", 9],
      ["Nagpur · 440002", 8],
    ],
    path: [
      pathRow(12840, "Ekart · North", 45, "Own fleet · North hub · Tier-2 last mile"),
      pathRow(12840, "Partner-A", 31, "3PL partner · heavy mobiles & appliances"),
      pathRow(12840, "Partner-B", 24, "Secondary hub · repack / handoff failures"),
    ],
    segment: [
      ["High-frequency", 31],
      ["New users", 28],
      ["High-value", 22],
      ["Occasional", 19],
    ],
    segmentMatrix: segmentMatrix(12840, 24, 19, 26, 31),
    channel: [
      channelRow(12840, "Chat", 38, [
        "The box was completely crushed — this is the second damaged item in a month.",
        "Screen has dead pixels straight out of the box.",
        "Outer packaging intact but product inside is shattered.",
        "Return pickup was promised three times — still waiting with a broken TV.",
      ]),
      channelRow(12840, "Voice", 26, [
        "I don't trust Flipkart delivery anymore; please pick up and refund.",
        "Every appliance I order arrives with dents — fix your handling.",
        "Your courier threw the box over the gate and left.",
        "Calling again because chat said someone would call back — nobody did.",
      ]),
      channelRow(12840, "Email", 16, [
        "Received a broken phone screen. Need replacement or full refund immediately.",
        "Attached photos of the damage — please respond within 24 hours.",
        "Order ID attached — item is unusable on arrival.",
        "Escalating to consumer forum if I don't hear back by tomorrow.",
      ]),
      channelRow(12840, "LinkedIn", 12, [
        "Received a broken item again — never buying from Flipkart.",
        "Quality control is zero — third damaged delivery this quarter.",
        "Sharing my experience so others know what to expect.",
        "Tagging leadership because support tickets keep getting auto-closed.",
      ]),
      channelRow(12840, "X", 8, [
        "Never buying from Flipkart again — third damaged TV in two months.",
        "Posting photos of crushed box — this keeps happening in my pincode.",
        "Tagging @flipkart because chat closed my ticket without pickup.",
        "Going public — quality control is broken on mobiles.",
      ]),
    ],
  },
  refund: {
    verdict:
      "Refund failures cluster on prepaid orders where the ledger shows 'processed' but the customer sees no credit. Validate the status mismatch and expose a proactive refund ETA before customers escalate.",
    conf: 90,
    category: [
      categoryRow(6540, "Fashion", 30, 24, 78),
      categoryRow(6540, "Mobiles", 26, 21, 76),
      categoryRow(6540, "Grocery", 20, 16, 72),
      categoryRow(6540, "Appliances", 14, 12, 70),
      categoryRow(6540, "Others", 10, 9, 68),
    ],
    seller: [
      ["Marketplace seller", 61],
      ["Flipkart-fulfilled", 39],
    ],
    region: [
      ["Delhi · 110001", 15],
      ["Mumbai · 400001", 13],
      ["Bengaluru · 560001", 12],
      ["Hyderabad · 500001", 9],
      ["Pune · 411001", 7],
    ],
    path: [
      pathRow(6540, "UPI / prepaid", 58, "Prepaid ledger mismatch · status vs bank"),
      pathRow(6540, "Card", 27, "Card refunds · 5–7 day settlement lag"),
      pathRow(6540, "Wallet", 15, "SuperCoins / wallet · instant credit expected"),
    ],
    segment: [
      ["High-value", 34],
      ["High-frequency", 27],
      ["New users", 22],
      ["Occasional", 17],
    ],
    segmentMatrix: segmentMatrix(6540, 28, 22, 24, 26),
    channel: [
      channelRow(6540, "Email", 32, [
        "Refund shows processed on your app but nothing has hit my bank account.",
        "Bank statement attached — no credit after 10 business days.",
        "Please confirm UTR number for my prepaid refund.",
        "Legal notice will follow if refund is not credited this week.",
      ]),
      channelRow(6540, "Chat", 30, [
        "It's been 12 days — where is my refund? This feels like fraud.",
        "Agent said refund is done but wallet balance unchanged.",
        "Need refund today — I cancelled before dispatch.",
        "Every agent gives a different timeline — which one is true?",
      ]),
      channelRow(6540, "Voice", 19, [
        "I paid prepaid and you still haven't credited me. Escalate this now.",
        "Third call this week on the same refund — no resolution.",
        "Transfer me to someone who can actually release my money.",
        "Recording this call — your app says refunded, my bank says no.",
      ]),
      channelRow(6540, "LinkedIn", 9, [
        "Flipkart took my money and no refund after 2 weeks.",
        "Prepaid order cancelled — still waiting for my ₹4,200 back.",
        "Posting publicly because support keeps closing my ticket.",
        "Anyone else stuck in refund limbo after cancelling prepaid orders?",
      ]),
      channelRow(6540, "X", 10, [
        "Refund shows processed but bank still empty after 12 days — thread 🧵",
        "Prepaid cancelled, wallet untouched — is this normal @flipkart?",
        "Screenshot of app vs bank statement — someone explain this.",
        "Public warning: don't cancel prepaid until you see UTR.",
      ]),
    ],
  },
  wrong: {
    verdict:
      "Wrong-item spikes track to catalog/SKU mapping errors from a small set of fashion sellers. Re-verify SKU-to-catalog mapping for flagged sellers before the pattern scales.",
    conf: 89,
    category: [
      categoryRow(8120, "Fashion", 41, 14, 66),
      categoryRow(8120, "Mobiles", 19, 11, 63),
      categoryRow(8120, "Home", 16, 10, 61),
      categoryRow(8120, "Appliances", 14, 9, 60),
      categoryRow(8120, "Others", 10, 8, 58),
    ],
    seller: [
      ["Marketplace seller", 74],
      ["Flipkart-fulfilled", 26],
    ],
    region: [
      ["Kolkata · 700001", 13],
      ["Chennai · 600001", 12],
      ["Ahmedabad · 380001", 11],
      ["Surat · 395001", 9],
      ["Indore · 452001", 8],
    ],
    path: [
      pathRow(8120, "Ekart · East", 39, "East FC pick errors · fashion SKUs"),
      pathRow(8120, "Partner-A", 34, "Catalog mismatch · marketplace sellers"),
      pathRow(8120, "Partner-C", 27, "Alternate 3PL · wrong bin picks"),
    ],
    segment: [
      ["New users", 33],
      ["High-frequency", 26],
      ["Occasional", 22],
      ["High-value", 19],
    ],
    segmentMatrix: segmentMatrix(8120, 20, 18, 29, 33),
    channel: [
      channelRow(8120, "Chat", 40, [
        "I ordered a blue shirt and got a completely different colour — third time this month.",
        "Received XL instead of M — label on box doesn't match item inside.",
        "Wrong SKU delivered again — same seller, same mistake.",
        "Please stop sending random items — I need the exact product I paid for.",
      ]),
      channelRow(8120, "Voice", 22, [
        "Wrong item again. How hard is it to pick the right SKU from the shelf?",
        "I ordered black sneakers, got white — need pickup today.",
        "Warehouse keeps sending someone else's order to my address.",
        "This seller has wrong-pick complaints every week — why still live?",
      ]),
      channelRow(8120, "Email", 18, [
        "Received size M instead of L. Please send the correct item or refund.",
        "Product image on app doesn't match what was shipped.",
        "Attached photos — completely different brand than ordered.",
        "Return label attached — ship correct SKU or process refund.",
      ]),
      channelRow(8120, "LinkedIn", 10, [
        "Flipkart sent me the wrong product AGAIN. Sort your warehouse out.",
        "Fashion orders are a coin toss — wrong colour twice in a row.",
        "How does a marketplace this big mess up basic SKU picking?",
        "Seller keeps shipping wrong variants — marketplace QA is broken.",
      ]),
      channelRow(8120, "X", 10, [
        "Wrong colour AGAIN — fashion pick accuracy is a joke on @flipkart.",
        "Ordered M got XL — posting so others don't waste money.",
        "Third wrong SKU from same seller — why is this store still live?",
        "Warehouse roulette: you never know what colour you'll get.",
      ]),
    ],
  },
  hidden: {
    verdict:
      "Fee complaints rise where platform / handling fees appear only on the final payment screen. Surface fees earlier in the funnel and review checkout copy with Product / Pricing.",
    conf: 85,
    category: [
      categoryRow(4210, "Grocery", 33, 31, 70),
      categoryRow(4210, "Fashion", 24, 19, 67),
      categoryRow(4210, "Mobiles", 21, 17, 65),
      categoryRow(4210, "Home", 13, 12, 63),
      categoryRow(4210, "Others", 9, 8, 61),
    ],
    seller: [
      ["Marketplace seller", 52],
      ["Flipkart-fulfilled", 48],
    ],
    region: [
      ["Bengaluru · 560001", 14],
      ["Pune · 411001", 12],
      ["Delhi · 110001", 11],
      ["Mumbai · 400001", 10],
      ["Jaipur · 302012", 7],
    ],
    path: [
      pathRow(4210, "Checkout screen", 63, "Fee surfaced only at payment step"),
      pathRow(4210, "Cart page", 24, "Cart-stage fee disclosure gaps"),
      pathRow(4210, "Post-order", 13, "Invoice surprise · post-checkout"),
    ],
    segment: [
      ["Occasional", 31],
      ["New users", 29],
      ["High-frequency", 23],
      ["High-value", 17],
    ],
    segmentMatrix: segmentMatrix(4210, 16, 21, 27, 36),
    channel: [
      channelRow(4210, "LinkedIn", 30, [
        "Flipkart charged me ₹49 delivery on a 'free delivery' order. Screenshots attached.",
        "Promised free delivery on Plus — still got charged at checkout.",
        "Hidden platform fee on grocery — not shown until payment page.",
        "Checkout UX hides fees until OTP — feels deliberately misleading.",
      ]),
      channelRow(4210, "Chat", 28, [
        "Your checkout said free delivery but I was charged at payment. Fix this.",
        "Delivery fee appeared only after I entered OTP — misleading.",
        "Why is there a handling charge not listed on the product page?",
        "Reverse the fee or I cancel Plus — this wasn't disclosed upfront.",
      ]),
      channelRow(4210, "Email", 20, [
        "Hidden fee added at the last step — I would not have ordered if I knew.",
        "Invoice shows charges not in the order summary I approved.",
        "Please refund the undisclosed convenience fee immediately.",
        "Attaching side-by-side screenshots of product page vs final bill.",
      ]),
      channelRow(4210, "Voice", 12, [
        "Why am I paying delivery when the product page clearly says free?",
        "Agent couldn't explain the extra ₹40 on my bill.",
        "I want the hidden charge reversed before I place another order.",
        "Read me the exact line item — none of this was shown in cart.",
      ]),
      channelRow(4210, "X", 10, [
        "Hidden ₹49 fee at checkout — product page said free delivery. Screenshots.",
        "Plus member still charged delivery — who else got hit?",
        "Fee only appeared after OTP — feels like a bait-and-switch.",
        "Posting cart vs invoice side-by-side so buyers know what to expect.",
      ]),
    ],
  },
  never: {
    verdict:
      "Non-delivery concentrates on long-haul lanes with repeated 'out for delivery' loops. Trace the cohort and fire proactive re-promise notifications — this is an anxiety-mitigation win CX owns directly.",
    conf: 91,
    category: [
      categoryRow(3180, "Appliances", 29, 16, 84),
      categoryRow(3180, "Furniture", 24, 14, 81),
      categoryRow(3180, "Mobiles", 21, 12, 79),
      categoryRow(3180, "Fashion", 16, 10, 76),
      categoryRow(3180, "Others", 10, 8, 74),
    ],
    seller: [
      ["Marketplace seller", 57],
      ["Flipkart-fulfilled", 43],
    ],
    region: [
      ["Patna · 800001", 16],
      ["Guwahati · 781001", 13],
      ["Ranchi · 834001", 11],
      ["Lucknow · 226010", 10],
      ["Bhopal · 462001", 8],
    ],
    path: [
      pathRow(3180, "Long-haul lane", 61, "Inter-city lanes · repeated OFD loops"),
      pathRow(3180, "Ekart · North", 22, "North hub · missed delivery slots"),
      pathRow(3180, "Partner-B", 17, "Partner last-mile · no-show pattern"),
    ],
    segment: [
      ["New users", 35],
      ["High-value", 26],
      ["High-frequency", 21],
      ["Occasional", 18],
    ],
    segmentMatrix: segmentMatrix(3180, 22, 20, 30, 28),
    channel: [
      channelRow(3180, "Voice", 34, [
        "I took a day off for delivery and nobody showed up. No call, no update.",
        "Rescheduled twice — rider never came either time.",
        "Waited till 9 PM — tracking still says out for delivery.",
        "Need a confirmed slot today — can't take another leave for this.",
      ]),
      channelRow(3180, "Chat", 28, [
        "Marked delivered but I was home all day — item never arrived.",
        "Delivery failed but status updated to delivered automatically.",
        "Need proof of delivery — nobody came to my flat.",
        "Bot keeps saying 'attempted' — I have CCTV showing no visit.",
      ]),
      channelRow(3180, "Email", 18, [
        "Third missed delivery attempt. When will you actually deliver my order?",
        "Large appliance — need confirmed slot, not vague 'by end of day'.",
        "Escalate to hub manager — two weeks of failed attempts.",
        "Attaching work-leave letter — cost of your missed deliveries.",
      ]),
      channelRow(3180, "LinkedIn", 10, [
        "Flipkart says delivered — I was waiting at the door. Where is my package?",
        "Never-delivered but marked complete — this keeps happening in my pincode.",
        "Lost a full day of work waiting for a delivery that never came.",
        "Neighbors report same fake 'delivered' status on our lane.",
      ]),
      channelRow(3180, "X", 10, [
        "#NeverDelivered again — tracking says delivered, I was home all day.",
        "Took leave for appliance delivery — rider never showed. Thread.",
        "Fake 'delivered' status in our pincode — neighbours seeing the same.",
        "Posting CCTV timestamp because support says 'attempted'.",
      ]),
    ],
  },
  counterfeit: {
    verdict:
      "Low volume but high blast radius and regulatory weight, focused on baby-food & consumables from a few sellers. Trigger a compliance-grade seller review immediately — treat as a cliff event.",
    conf: 94,
    category: [
      categoryRow(640, "Baby & food", 44, 9, 90),
      categoryRow(640, "Beauty", 22, 7, 87),
      categoryRow(640, "Health", 18, 6, 85),
      categoryRow(640, "Electronics", 10, 5, 82),
      categoryRow(640, "Others", 6, 4, 80),
    ],
    seller: [
      ["Marketplace seller", 91],
      ["Flipkart-fulfilled", 9],
    ],
    region: [
      ["Delhi · 110006", 17],
      ["Mumbai · 400002", 14],
      ["Kolkata · 700007", 12],
      ["Chennai · 600003", 10],
      ["Surat · 395003", 8],
    ],
    path: [
      pathRow(640, "3rd-party seller", 86, "Unverified marketplace listings"),
      pathRow(640, "Reseller", 9, "Grey-market reseller channel"),
      pathRow(640, "Import", 5, "Cross-border import listings"),
    ],
    segment: [
      ["New users", 30],
      ["High-frequency", 27],
      ["High-value", 25],
      ["Occasional", 18],
    ],
    segmentMatrix: segmentMatrix(640, 26, 24, 28, 22),
    channel: [
      channelRow(640, "LinkedIn", 36, [
        "Pretty sure this baby food is fake — packaging looks off.",
        "Counterfeit beauty product — smell and texture don't match the real one.",
        "Reporting seller selling duplicate health supplements on your platform.",
        "Regulatory complaint filed — selling fake consumables is not acceptable.",
      ]),
      channelRow(640, "Email", 24, [
        "Product seal was broken and expiry date looks tampered. This is dangerous.",
        "Batch number doesn't match manufacturer website — please verify.",
        "Attached comparison photos with authorised retailer packaging.",
        "Need written confirmation of authenticity before my child uses this.",
      ]),
      channelRow(640, "Chat", 18, [
        "I received what looks like a counterfeit product. I want this investigated.",
        "QR code on box doesn't scan — is this genuine?",
        "Not safe to use — need immediate pickup and refund.",
        "Stop auto-closing — this is a safety issue, not a return delay.",
      ]),
      channelRow(640, "Voice", 10, [
        "This doesn't look genuine — I won't use it on my child until you verify.",
        "Need brand authorization proof before I open this.",
        "Escalate to trust & safety — suspected fake item.",
        "Connect me to compliance — I won't drop this until seller is delisted.",
      ]),
      channelRow(640, "X", 12, [
        "WARNING: suspect fake baby food from @flipkart seller — photos attached.",
        "Counterfeit beauty product — smell is wrong. Reporting publicly.",
        "Duplicate health supplements on marketplace — regulatory risk.",
        "Parents please check batch numbers — this seal looked tampered.",
      ]),
    ],
  },
  ato: {
    verdict:
      "Rare but catastrophic to trust: unauthorised logins followed by wallet / gift-card use. Escalate flagged accounts and freeze wallet movement with Fraud / Security — resolution speed is everything.",
    conf: 96,
    category: [
      categoryRow(210, "Wallet / GC", 52, 6, 96),
      categoryRow(210, "High-value SKUs", 28, 5, 94),
      categoryRow(210, "Electronics", 12, 4, 92),
      categoryRow(210, "Others", 8, 3, 90),
    ],
    seller: [
      ["Marketplace seller", 34],
      ["Flipkart-fulfilled", 66],
    ],
    region: [
      ["Bengaluru · 560001", 19],
      ["Delhi · 110001", 16],
      ["Mumbai · 400001", 14],
      ["Hyderabad · 500001", 9],
      ["Pune · 411001", 7],
    ],
    path: [
      pathRow(210, "Unknown device", 71, "New device login · no customer OTP"),
      pathRow(210, "SIM-swap signal", 18, "Telco SIM-swap correlation"),
      pathRow(210, "Credential reuse", 11, "Password reuse across apps"),
    ],
    segment: [
      ["High-value", 44],
      ["High-frequency", 29],
      ["Occasional", 15],
      ["New users", 12],
    ],
    segmentMatrix: segmentMatrix(210, 38, 28, 20, 14),
    channel: [
      channelRow(210, "Voice", 42, [
        "Someone used my wallet balance without my OTP. Lock my account immediately.",
        "Got SMS for login from another city — I wasn't online.",
        "Unauthorized COD order placed — cancel before dispatch.",
        "On the phone now — need fraud desk, not standard support.",
      ]),
      channelRow(210, "Email", 26, [
        "Unauthorized order placed from my account — I never approved this transaction.",
        "Password reset emails I didn't request — account compromised.",
        "Need fraud investigation report for my bank dispute.",
        "Attached login alert screenshots from three unknown devices.",
      ]),
      channelRow(210, "Chat", 16, [
        "My gift card was drained overnight. How did they get access?",
        "Wallet shows debit to seller I've never purchased from.",
        "Freeze my account — suspicious activity since yesterday.",
        "OTP was never entered on my phone — how was wallet debited?",
      ]),
      channelRow(210, "LinkedIn", 7, [
        "Account hacked on Flipkart — ₹18k gone from wallet. No response for 3 days.",
        "ATO on my Plus account — orders shipping to unknown addresses.",
        "Public alert: check your Flipkart wallet if you got odd login alerts.",
        "Sharing IOCs so others can check for unauthorized wallet debits.",
      ]),
      channelRow(210, "X", 9, [
        "Wallet drained overnight on @flipkart — no OTP on my phone. Help.",
        "Account takeover — orders shipping to addresses I've never used.",
        "Public alert: odd login SMS? Check your Flipkart wallet now.",
        "₹18k gone from wallet — still no fraud desk callback.",
      ]),
    ],
  },
  missing: {
    verdict:
      "Paid items absent from multi-unit orders, concentrated on a specific fulfilment centre. Reconcile shipment manifests for the affected SKUs with Ops before repeat contacts build.",
    conf: 93,
    category: [
      categoryRow(1120, "Mobiles", 31, 10, 86),
      categoryRow(1120, "Beauty", 24, 9, 84),
      categoryRow(1120, "Grocery", 19, 8, 82),
      categoryRow(1120, "Fashion", 16, 7, 80),
      categoryRow(1120, "Others", 10, 6, 78),
    ],
    seller: [
      ["Marketplace seller", 46],
      ["Flipkart-fulfilled", 54],
    ],
    region: [
      ["Hyderabad · 500001", 15],
      ["Chennai · 600001", 13],
      ["Bengaluru · 560001", 12],
      ["Kochi · 682001", 9],
      ["Vizag · 530001", 8],
    ],
    path: [
      pathRow(1120, "FC-South-2", 58, "Pick/pack error · multi-unit orders"),
      pathRow(1120, "Ekart · South", 26, "South last-mile · false POD"),
      pathRow(1120, "Partner-A", 16, "Partner hub · partial shipment"),
    ],
    segment: [
      ["High-frequency", 32],
      ["High-value", 27],
      ["New users", 24],
      ["Occasional", 17],
    ],
    segmentMatrix: segmentMatrix(1120, 23, 21, 28, 28),
    channel: [
      channelRow(1120, "Chat", 35, [
        "Tracking says delivered but there's nothing at my door — check with the rider.",
        "Empty package received — seal looked re-taped.",
        "Rider photo shows wrong building — not my address.",
        "Open-box delivery missing main unit — only accessories inside.",
      ]),
      channelRow(1120, "Voice", 26, [
        "Package marked delivered to a neighbour I don't have. Where is my order?",
        "Item missing from shipment — outer box fine, product gone.",
        "Need GPS proof from delivery app — I was home.",
        "Hub says delivered — I want CCTV from the handover point.",
      ]),
      channelRow(1120, "Email", 19, [
        "Item missing from the box — outer package intact but product not inside.",
        "Partial shipment — accessories missing from mobile order.",
        "Invoice shows 2 items, received only 1 — investigate warehouse.",
        "Weight on label doesn't match what I received — possible pilferage.",
      ]),
      channelRow(1120, "LinkedIn", 10, [
        "Flipkart 'delivered' my phone but I never received it. This is theft.",
        "Missing item report ignored for a week — no callback.",
        "Posting because support keeps auto-closing my missing-package ticket.",
        "FC error or rider theft — either way customer is left empty-handed.",
      ]),
      channelRow(1120, "X", 10, [
        "'Delivered' but phone never arrived — posting proof for others.",
        "Empty box, re-taped seal — main unit missing from shipment.",
        "Support auto-closed missing-item ticket — going public.",
        "Invoice says 2 items, box had 1 — warehouse error or theft?",
      ]),
    ],
  },
};

export const TRUST_SEGMENTS: TrustSegment[] = [
  {
    label: "High-frequency customers",
    affected: 12400,
    wow: 9,
    drop: 9,
    conf: 87,
    aiInsight:
      "HF buyers drive 34% of trust contacts — repeat-route damage and refund delays dominate. Proactive outreach on the 3rd negative contact cuts escalation by ~22%.",
  },
  {
    label: "New customers (first order)",
    affected: 10500,
    wow: 12,
    drop: 12,
    conf: 86,
    aiInsight:
      "First-order cohort shows the steepest 12 pt trust drop. Never-delivered and wrong-SKU failures here convert at half the rate of repeat buyers — fast refund + apology credit is critical.",
  },
  {
    label: "High-value customers",
    affected: 7900,
    wow: 6,
    drop: 6,
    conf: 88,
    aiInsight:
      "HV buyers cite refund-not-credited and damaged premium SKUs in 71% of contacts. White-glove recovery before ₹15k+ orders churn saves an estimated 18% of at-risk GMV.",
  },
  {
    label: "Category-loyal (Mobiles)",
    affected: 6100,
    wow: 8,
    drop: 8,
    conf: 85,
    aiInsight:
      "Mobile loyalists report delivery damage and wrong-SKU at 2.1× category average. Route top 5 pincodes from the Ekart-North lane to a packaging audit within 48 hours.",
  },
];

export const TRUST_EVIDENCE: TrustEvidence[] = [
  {
    src: "Chat",
    icon: MessageSquare,
    quote: "This is the second time I received a damaged product.",
    tag: "Damaged product · Mobiles · High-frequency",
  },
  {
    src: "Voice",
    icon: Phone,
    quote: "I don't trust Flipkart delivery anymore — please pick up and refund.",
    tag: "Damaged product · Appliances · High-value",
  },
  {
    src: "Email",
    icon: Mail,
    quote: "Refund shows processed on your app but nothing has hit my bank account.",
    tag: "Refund not credited · Prepaid · New user",
  },
  {
    src: "X",
    icon: AtSign,
    quote: "Never buying from Flipkart again — third damaged TV in two months.",
    tag: "Damaged product · Reach ≈ 24k impressions",
  },
  {
    src: "LinkedIn",
    icon: Linkedin,
    quote: "Prepaid order cancelled — still waiting for my ₹4,200 back after 12 days.",
    tag: "Refund not credited · Payments · Public post",
  },
];

export const TRUST_ACTIONS: TrustAction[] = [
  {
    issue: "Damage rising in Appliances & Mobiles",
    cause: "35% of trust complaints · 68% marketplace · Ekart-North · Tier-2",
    team: "Supply Chain / Packaging",
    action: "Audit packaging & handling for the top 5 pincodes.",
    kind: "Route",
  },
  {
    issue: "Refund-not-credited spike (+22% WoW)",
    cause: "18% of trust complaints · prepaid ledger mismatch",
    team: "Payments / CX",
    action: "Validate mismatch; expose a proactive refund ETA.",
    kind: "Route",
  },
  {
    issue: "Wrong-item spike in Fashion",
    cause: "22% of trust complaints · seller SKU-mapping errors",
    team: "Marketplace / Catalog",
    action: "Re-verify SKU-to-catalog mapping for flagged sellers.",
    kind: "Route",
  },
  {
    issue: "Counterfeit concern in Baby & consumables",
    cause: "High severity + regulatory exposure",
    team: "Trust & Safety / Compliance",
    action: "Trigger a seller compliance review.",
    kind: "Escalate",
  },
  {
    issue: "Hidden-fee complaints (+31% WoW)",
    cause: "Fees disclosed late in checkout",
    team: "Product / Pricing",
    action: "Review fee-communication clarity at checkout.",
    kind: "Route",
  },
  {
    issue: "Never-delivered cohort, high anxiety",
    cause: "Long-haul lanes; contact not yet raised",
    team: "CX — owned lever",
    action: "Fire proactive re-promise notifications before contact.",
    kind: "Act now",
  },
];

const TRUST_TOTAL_COMPLAINTS = TRUST_DRIVERS.reduce((sum, driver) => sum + driver.complaints, 0);
const TOP_TRUST_DRIVER = [...TRUST_DRIVERS].sort((a, b) => b.complaints - a.complaints)[0];
const TRUST_WEIGHTED_REPEAT =
  TRUST_DRIVERS.reduce((sum, driver) => sum + driver.complaints * driver.repeat, 0) / TRUST_TOTAL_COMPLAINTS;

export { TRUST_TOTAL_COMPLAINTS };

export const TRUST_PULSE = {
  trustIndex: 72,
  trustRag: "high" as TrustRagLevel,
  trustDelta: -4,
  topBreakerShare: Math.round((TOP_TRUST_DRIVER.complaints / TRUST_TOTAL_COMPLAINTS) * 100),
  topBreakerWow: TOP_TRUST_DRIVER.wow,
  customersImpacted: Math.round(TRUST_TOTAL_COMPLAINTS / TRUST_WEIGHTED_REPEAT),
  customersDelta: 12,
  sentimentScore: 0.55,
  sentimentDelta: -0.06,
  resolutionScore: 0.74,
  resolutionDelta: -0.05,
  csatScore: 3.9,
  csatDelta: -0.2,
  sentimentSpark: [0.61, 0.6, 0.59, 0.58, 0.57, 0.56, 0.55] as const,
  resolutionSpark: [0.79, 0.78, 0.77, 0.76, 0.75, 0.75, 0.74] as const,
  csatSpark: [4.1, 4.05, 4.0, 3.95, 3.92, 3.91, 3.9] as const,
  repeatContactRate: Math.round(TRUST_WEIGHTED_REPEAT * 10) / 10,
  repeatContactDelta: 0.3,
  repeatContactSpark: [1.8, 1.85, 1.9, 1.95, 2.0, 2.05, 2.1] as const,
  modelConfidence: 91,
  verdictConf: 91,
  verdict:
    "Trust is eroding on a steep slope — damaged product leads at 35% of trust complaints (+18% WoW), with refund-not-credited rising fastest (+22%). No active cliff breach, but counterfeit signals in consumables need a compliance pass now.",
};

export const SCATTER_IX = 1.2;
export const SCATTER_BY = 65;
