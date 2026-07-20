export const WHATS_FAILING_CHANNELS = ["Voice", "Chat", "Email", "Social Media", "Ticket"] as const;
export type WhatsFailingChannel = (typeof WHATS_FAILING_CHANNELS)[number];

export const WHATS_FAILING_SEGMENTS = ["HVHF", "HVLF", "LVHF", "LVLF"] as const;
export type WhatsFailingSegment = (typeof WHATS_FAILING_SEGMENTS)[number];

export const WHATS_FAILING_CHANNEL_COLORS: Record<WhatsFailingChannel, string> = {
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "Social Media": "#22c55e",
  Ticket: "#2563EB",
};

export const WHATS_FAILING_SEGMENT_COLORS: Record<WhatsFailingSegment, string> = {
  HVHF: "#A855F7",
  HVLF: "#06B6D4",
  LVHF: "#6366F1",
  LVLF: "#94A3B8",
};

export type WhatsFailingCluster = {
  shortName: string;
  total: number;
  byChannel: Record<WhatsFailingChannel, number>;
  bySegment: Record<WhatsFailingSegment, number>;
};

export type CustomerValueTier = {
  id: string;
  shortLabel: string;
  label: string;
  happy: number;
  neutral: number;
  unhappy: number;
  gmv: string;
  interactions: number;
  color: string;
};

export const CUSTOMER_VALUE_TIERS: CustomerValueTier[] = [
  {
    id: "hvhf",
    shortLabel: "HVHF",
    label: "High Value High Frequency",
    happy: 38,
    neutral: 32,
    unhappy: 30,
    gmv: "₹420M",
    interactions: 9_550,
    color: "#A855F7",
  },
  {
    id: "hvlf",
    shortLabel: "HVLF",
    label: "High Value Low Frequency",
    happy: 32,
    neutral: 33,
    unhappy: 35,
    gmv: "₹312M",
    interactions: 6_360,
    color: "#06B6D4",
  },
  {
    id: "lvhf",
    shortLabel: "LVHF",
    label: "Low Value High Frequency",
    happy: 26,
    neutral: 32,
    unhappy: 42,
    gmv: "₹186M",
    interactions: 22_700,
    color: "#6366F1",
  },
  {
    id: "lvlf",
    shortLabel: "LVLF",
    label: "Low Value Low Frequency",
    happy: 22,
    neutral: 30,
    unhappy: 48,
    gmv: "₹94M",
    interactions: 15_130,
    color: "#94A3B8",
  },
];

export const CUSTOMER_WHATS_FAILING: WhatsFailingCluster[] = [
  {
    shortName: "Payment issue",
    total: 2840,
    byChannel: { Voice: 1190, Chat: 820, Email: 340, "Social Media": 310, Ticket: 180 },
    bySegment: { HVHF: 710, HVLF: 620, LVHF: 980, LVLF: 530 },
  },
  {
    shortName: "Order not received",
    total: 2210,
    byChannel: { Voice: 980, Chat: 540, Email: 290, "Social Media": 250, Ticket: 150 },
    bySegment: { HVHF: 420, HVLF: 540, LVHF: 760, LVLF: 490 },
  },
  {
    shortName: "Refund / return",
    total: 1980,
    byChannel: { Voice: 720, Chat: 610, Email: 380, "Social Media": 180, Ticket: 90 },
    bySegment: { HVHF: 580, HVLF: 420, LVHF: 640, LVLF: 340 },
  },
  {
    shortName: "Delivery delay",
    total: 1620,
    byChannel: { Voice: 580, Chat: 490, Email: 260, "Social Media": 210, Ticket: 80 },
    bySegment: { HVHF: 310, HVLF: 410, LVHF: 520, LVLF: 380 },
  },
  {
    shortName: "Wrong item",
    total: 1240,
    byChannel: { Voice: 420, Chat: 380, Email: 220, "Social Media": 140, Ticket: 80 },
    bySegment: { HVHF: 280, HVLF: 320, LVHF: 410, LVLF: 230 },
  },
  {
    shortName: "App login / OTP",
    total: 980,
    byChannel: { Voice: 180, Chat: 290, Email: 120, "Social Media": 280, Ticket: 110 },
    bySegment: { HVHF: 140, HVLF: 260, LVHF: 320, LVLF: 260 },
  },
  {
    shortName: "Seller trust",
    total: 720,
    byChannel: { Voice: 210, Chat: 180, Email: 90, "Social Media": 190, Ticket: 50 },
    bySegment: { HVHF: 220, HVLF: 140, LVHF: 240, LVLF: 120 },
  },
  {
    shortName: "Fee dispute",
    total: 540,
    byChannel: { Voice: 240, Chat: 150, Email: 80, "Social Media": 40, Ticket: 30 },
    bySegment: { HVHF: 180, HVLF: 110, LVHF: 160, LVLF: 90 },
  },
];
