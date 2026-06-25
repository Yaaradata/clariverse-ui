// Embedded mock universe — Stage 9A + 9B. Numbers tie out across screens.
// Internal signal IDs exist for drill routing only; never shown on card faces.

export type ConfidenceBand = "High" | "Med-High" | "Medium" | "Low";
export type Severity = "critical" | "high" | "medium" | "stable";

export type ExecutiveTileData = {
  id: string;
  title: string;
  primaryValue: string;
  delta: string;
  deltaTone: "up" | "down" | "flat" | "warn";
  spark: number[];
  gaugeLabel: string;
  gaugeValue: number;
  aiInsight: string;
  confidence: ConfidenceBand;
};

export type DrillSignature =
  | "radar-corroboration"
  | "geo-outbreak"
  | "statutory-queue"
  | "compliance-evidence"
  | "inverse-anomaly"
  | "entity-velocity"
  | "bridge";

export type RadarSignal = {
  id: string;
  title: string;
  severity: Severity;
  cohort: string;
  honestyLine: string;
  onset: string;
  mentions: number;
  signalsDistilled: number;
  channels: { name: string; time: string }[];
  stats: string;
  aiVerdict: string;
  confidence: ConfidenceBand;
  owner: string;
  draftAction: string;
  draftKind: "draft" | "prepare" | "route";
  drillSignature: DrillSignature;
  suppressed?: boolean;
  evidence?: {
    ruledOut: string[];
    snippets?: string[];
  };
};

export type DarkStoreNode = {
  id: string;
  label: string;
  city: string;
  issueRate: number;
  baseline: number;
  peerMultiple: number;
  status: "outbreak" | "flat" | "nominal";
};

export type BridgeGovernance = {
  cohortBanded?: boolean;
  proxyAudited?: boolean;
  differentialGated?: boolean;
  neverAutoApplied?: boolean;
};

export type BridgeTileData = {
  id: string;
  title: string;
  cohort: string;
  illustrativeValue: string;
  honestyLine: string;
  signalRef: string;
  starred: boolean;
  confidence: ConfidenceBand;
  aiVerdict: string;
  governance?: BridgeGovernance;
};

export type BridgeEvidencePack = {
  cxCohort: string;
  txnCohort: string;
  joinKey: string;
  cxSignalCount: string;
  txnRowCount: string;
  guardrails: string[];
  confidence: ConfidenceBand;
  aiVerdict: string;
};

export type AuditEntry = {
  action: string;
  acceptedBy: string;
  acceptedAt: string;
};

export const HEADLINE_SIGNAL = {
  title:
    "UPI-step checkout failures breaking across 3 channels — route to Payments today.",
  soWhat:
    "The earliest cross-channel promise breach in the checkout funnel; payments owns the fix before GMV bleeds.",
  explainability:
    "Flagged because this theme broke baseline across app reviews, care chat and social within ~6 hours; 1,900 mentions distilled to 1 signal.",
};

/** Default comparison basis for the command screen (intraday toggle lands in Pass 3). */
export const COMMAND_TIME_COMPARE = "This week vs last";

export const EXEC_SUMMARY = {
  critical: "UPI checkout · D07 spoilage cluster · statutory clock",
  focus: "Seller trust erosion · refund-status repeat · bot containment drop",
  stable: "5 of 8 dark-stores flat · 6 of 8 intents healthy FCR",
  aiLine:
    "Three independent channels corroborate the payment-step failure; peers hold flat on q-commerce spoilage.",
  aiConfidence: "High" as ConfidenceBand,
};

/** CL-004 / AP-011 thin exec bars — one per screen (9C). */
export const QUICK_COMMERCE_SUMMARY = {
  critical: "D07 outbreak · 6× baseline",
  focus: "Perishable cluster · substitution gap",
  stable: "5 of 8 dark-stores flat",
  aiLine: "48 of 50 spoilage complaints trace to one node; seven peer stores hold flat.",
  aiConfidence: "High" as ConfidenceBand,
};

export const COMPLIANCE_SUMMARY = {
  critical: "3 statutory-clock grievances",
  focus: "Dark-pattern exposure · refund-friction cluster",
  stable: "Routing internal until human approves",
  aiLine: "Queue re-ranked by clock proximity; named-instrument evidence stays inside Legal.",
  aiConfidence: "High" as ConfidenceBand,
};

export const CX_QUALITY_SUMMARY = {
  critical: "Electronics suppression warning",
  focus: "Seller trust · refund-status repeat · bot containment",
  stable: "6 of 8 intents healthy FCR",
  aiLine: "Tickets −18% but contact-per-order flat — support-entry change logged same week.",
  aiConfidence: "Med-High" as ConfidenceBand,
};

export const REVENUE_BRIDGE_SUMMARY = {
  critical: "D07 margin · refund repeat bridges",
  focus: "Seller trust-tax · LTV appeasement (governed)",
  stable: "All four tiles [illustrative, Phase 2]",
  aiLine: "CX signal cohort joins mock transaction feed at cohort level — pilot ask only.",
  aiConfidence: "Med-High" as ConfidenceBand,
};

export const EXECUTIVE_TILES: ExecutiveTileData[] = [
  {
    id: "emerging",
    title: "Emerging Issues",
    primaryValue: "1",
    delta: "+3 themes vs last week",
    deltaTone: "warn",
    spark: [2, 3, 2, 4, 5, 6, 7],
    gaugeLabel: "Theme velocity",
    gaugeValue: 74,
    aiInsight:
      "UPI-step failures cleared corroboration across reviews, chat and social — route to Payments before repeat contacts stack.",
    confidence: "High",
  },
  {
    id: "quick-commerce",
    title: "Quick-Commerce Health",
    primaryValue: "6×",
    delta: "D07 vs own baseline",
    deltaTone: "down",
    spark: [1.1, 1.0, 1.2, 2.4, 4.1, 5.8, 6.2],
    gaugeLabel: "Peer-relative issue-rate",
    gaugeValue: 38,
    aiInsight:
      "Koramangala D07 missing/spoiled cluster is local — seven peer stores hold flat this shift.",
    confidence: "High",
  },
  {
    id: "compliance",
    title: "Compliance Posture",
    primaryValue: "3",
    delta: "within 6h of deadline",
    deltaTone: "warn",
    spark: [1, 1, 2, 2, 3, 3, 3],
    gaugeLabel: "Statutory exposure",
    gaugeValue: 62,
    aiInsight:
      "Grievance queue re-ranked by clock proximity — DPDP keyword overrides time-waiting.",
    confidence: "High",
  },
];

export const KPI_RIBBON = [
  { label: "Contact per order", value: "14.2 / 1k", delta: "+0.8 vs last week", tone: "warn" as const },
  { label: "Theme velocity", value: "7 active", delta: "+3 vs last week", tone: "warn" as const },
  { label: "NPS delta", value: "−4 pts", delta: "Electronics-led", tone: "down" as const },
  { label: "CSAT delta", value: "−2.1 pts", delta: "Refund-status drag", tone: "down" as const },
];

export const RADAR_SIGNALS: RadarSignal[] = [
  {
    id: "upi-checkout",
    title: "UPI-step checkout failure",
    severity: "critical",
    cohort: "Checkout funnel · India cohort",
    honestyLine: "Interaction corpus only — order confirmation state needs the Phase-2 feed.",
    onset: "T−6h",
    mentions: 1900,
    signalsDistilled: 1,
    channels: [
      { name: "App review", time: "09:12" },
      { name: "Care chat", time: "09:40" },
      { name: "Social", time: "11:05" },
    ],
    stats: "Normalised theme velocity · 3 independent channels",
    aiVerdict: "Payment-step promise breach — not a single-channel blip.",
    confidence: "High",
    owner: "Payments",
    draftAction: "Draft route to Payments — checkout UPI step failure cluster.",
    draftKind: "draft",
    drillSignature: "radar-corroboration",
    evidence: {
      ruledOut: ["Single-channel decoy suppressed", "No sale-event distortion (calendar excluded)"],
      snippets: [
        "UPI deducted but order stuck on confirming — app review",
        "Payment step spinner since morning — care chat",
        "Anyone else UPI failing at checkout — social",
      ],
    },
  },
  {
    id: "d07-outbreak",
    title: "Koramangala D07 spoilage cluster",
    severity: "high",
    cohort: "Koramangala D07 catchment",
    honestyLine: "GMV/margin figure is bridge-ready — needs the order feed.",
    onset: "This shift",
    mentions: 48,
    signalsDistilled: 1,
    channels: [
      { name: "Care chat", time: "08:20" },
      { name: "Tickets", time: "09:15" },
    ],
    stats: "6× own baseline · peers flat",
    aiVerdict: "Picker/pack/substitution-layer failure at D07 — not city-wide.",
    confidence: "High",
    owner: "City Ops",
    draftAction: "Draft localised ops alert for D07 this shift.",
    draftKind: "draft",
    drillSignature: "geo-outbreak",
  },
  {
    id: "slow-delivery-decoy",
    title: "Slow delivery (single channel)",
    severity: "stable",
    cohort: "Marketplace · one channel",
    honestyLine: "Below corroboration threshold — correctly suppressed.",
    onset: "T−12h",
    mentions: 240,
    signalsDistilled: 0,
    channels: [{ name: "Email", time: "07:30" }],
    stats: "1 channel only — gate not cleared",
    aiVerdict: "Suppressed — fails the ≥2-channel corroboration gate.",
    confidence: "Low",
    owner: "—",
    draftAction: "Monitor only — no route.",
    draftKind: "route",
    drillSignature: "radar-corroboration",
    suppressed: true,
  },
  {
    id: "electronics-suppression",
    title: "Electronics ticket drop — warning",
    severity: "high",
    cohort: "Electronics category",
    honestyLine: "Proven in rupees by the revenue bridge — Phase 2 join.",
    onset: "T−1 week",
    mentions: 0,
    signalsDistilled: 1,
    channels: [
      { name: "Tickets", time: "—" },
      { name: "In-app", time: "Access change logged" },
    ],
    stats: "Tickets −18% · contact-per-order flat",
    aiVerdict: "A warning, not a win — chat entry point moved same week.",
    confidence: "Med-High",
    owner: "CX Ops + Product",
    draftAction:
      "Route → CX Ops + Product (warning). Electronics tickets −18% but contact-per-order flat + chat entry moved. Flagged as a warning, not a win.",
    draftKind: "route",
    drillSignature: "inverse-anomaly",
  },
];

export function getRadarSignalById(id: string): RadarSignal | undefined {
  return RADAR_SIGNALS.find((s) => s.id === id);
}

export function getDarkStoreById(id: string): DarkStoreNode | undefined {
  return DARK_STORES.find((d) => d.id === id);
}

export function getBridgeTileById(id: string): BridgeTileData | undefined {
  return BRIDGE_TILES.find((b) => b.id === id);
}

/** S2 hero headline — SIG-T2-02-001 (id internal only). */
export const QUICK_COMMERCE_HEADLINE = {
  title: "Koramangala D07 issue-rate is 6× its own baseline while peers hold flat.",
  soWhat:
    "A catchment is failing before the warehouse dashboard shows it — normalised to order volume so a busy store does not read as broken.",
  explainability:
    "48 of 50 spoilage complaints trace to one node; seven peer dark-stores hold flat in the same window.",
};

export type OutbreakEvidencePack = {
  storeId: string;
  issueSplit: { missing: number; spoiled: number; late: number };
  snippets: string[];
  ruledOut: string[];
  draftOpsAlert: string;
};

export const OUTBREAK_EVIDENCE: Record<string, OutbreakEvidencePack> = {
  "DS-BLR-D07": {
    storeId: "DS-BLR-D07",
    issueSplit: { missing: 31, spoiled: 17, late: 9 },
    snippets: [
      "Milk packet swollen — delivered warm from Koramangala hub — care chat",
      "Vegetables spoiled before promised slot — ticket",
      "Missing paneer again from same dark-store — care chat",
      "Curd expiry date already passed — app review",
      "Substituted item not what I ordered — ticket",
      "Two items missing from D07 fulfilment — care chat",
    ],
    ruledOut: ["Peers flat (not city-wide)", "No sale event (calendar excluded)", "Normalised per 1k orders"],
    draftOpsAlert:
      "Draft — for approval. D07 Koramangala: missing/spoiled at ~6× baseline this shift, peers flat. Suggested: inspect picker/pack + substitution at D07; localised slot review 6–10pm. Routed to City Ops on approval.",
  },
};

export type QuickCommerceRadarCard = {
  id: string;
  title: string;
  stat: string;
  honestyLine: string;
  aiVerdict: string;
  confidence: ConfidenceBand;
  draftAction: string;
  draftKind: RadarSignal["draftKind"];
  flag?: string;
};

export const PERISHABLE_RADAR: QuickCommerceRadarCard = {
  id: "perishable-d07",
  title: "Perishable spoilage cluster",
  stat: "48 of 50 complaints · one node",
  honestyLine: "SPARSE cluster — node-concentrated; precision-first routing.",
  aiVerdict: "Spoilage language concentrated at D07 — food-safety routing warranted.",
  confidence: "High",
  draftAction: "Route → Food-safety (FSSAI) — inspect cold-chain at D07.",
  draftKind: "route",
  flag: "FSSAI-flagged",
};

export const SUBSTITUTION_RADAR: QuickCommerceRadarCard = {
  id: "substitution-gap",
  title: "Wrong-substitute theme",
  stat: "Rising on care chat · not store floor volume",
  honestyLine: "Process-gap diamond — substitution logic owner, not store Ops.",
  aiVerdict: "Wrong-substitute intent rising — route to the logic owner who sets substitution rules.",
  confidence: "Med-High",
  draftAction: "Route → substitution-logic owner — not the dark-store floor.",
  draftKind: "route",
};

export const QUICK_COMMERCE_ACTIONS = {
  opsAlert: OUTBREAK_EVIDENCE["DS-BLR-D07"].draftOpsAlert,
  foodSafety: PERISHABLE_RADAR.draftAction,
  substitution: SUBSTITUTION_RADAR.draftAction,
};

/** S3 hero headline — SIG-T2-11-001 (id internal only). */
export const COMPLIANCE_HEADLINE = {
  title: "3 grievances within 6 hours of a statutory deadline — re-prioritised above time-waiting.",
  soWhat:
    "The queue is ranked by regulatory risk, not by who waited longest — explicit clock and keyword triggers.",
  explainability:
    "Matched to firm-level instruments with auditable evidence counts — routing stays internal until a human approves.",
};

export type StatutoryQueueItem = {
  /** Internal id for drill routing — not shown on card face. */
  id: string;
  countdown: string;
  keyword: string;
  regulation: string;
  touches: number;
  stallState: string;
  auditTrail: string[];
  urgency: "critical" | "high" | "medium";
};

/** Re-ranked by clock proximity — realistic scale (RP-009). */
export const STATUTORY_QUEUE: StatutoryQueueItem[] = [
  {
    id: "GRV-0412",
    countdown: "DPDP erasure −14h",
    keyword: "delete my data",
    regulation: "DPDP Rules 2025 · Rule 14",
    touches: 3,
    stallState: "Stalled across 3 touches",
    auditTrail: [
      "T−72h: first touch logged — no erasure action",
      "T−36h: follow-up — case still open",
      "T−14h: keyword override — re-prioritised above time-waiting",
    ],
    urgency: "critical",
  },
  {
    id: "GRV-0398",
    countdown: "48h acknowledgement −5h",
    keyword: "refund not received",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    touches: 2,
    stallState: "Awaiting first meaningful response",
    auditTrail: ["T−40h: grievance filed", "T−5h: clock proximity threshold crossed"],
    urgency: "high",
  },
  {
    id: "GRV-0401",
    countdown: "48h acknowledgement −4h",
    keyword: "no response",
    regulation: "Consumer Protection (E-Commerce) Rules 2020",
    touches: 4,
    stallState: "Multiple touches — no ack logged",
    auditTrail: ["T−44h: filed", "T−20h: second touch", "T−4h: re-ranked by clock"],
    urgency: "high",
  },
];

export function getStatutoryItemById(id: string): StatutoryQueueItem | undefined {
  return STATUTORY_QUEUE.find((g) => g.id === id);
}

export const DARK_PATTERN_EVIDENCE = {
  instrument: "CCPA basket-sneaking",
  evidenceCount: 37,
  surfaceRef: "Checkout step 3 — pre-ticked add-on",
  honestyLine:
    "Allegation surfaced from corpus; confirmed checkout state needs the Phase-2 feed.",
  aiVerdict:
    "Named-instrument match to basket-sneaking — auditable evidence count attached.",
  confidence: "High" as ConfidenceBand,
  factPattern: "Aligns with published pre-ticked add-on enforcement pattern",
  draftAction:
    "Prepare regulatory-exposure card → internal Legal only. Evidence pack attached. Not for external circulation.",
};

export const REFUND_FRICTION_CARD: QuickCommerceRadarCard = {
  id: "refund-friction",
  title: "Refund-friction narrative",
  stat: "Cluster of 142 contacts / week · refund-delay theme",
  honestyLine: "Cohort-level refund-status frustration — normalised to refund contacts.",
  aiVerdict: "Refund-delay narrative growing faster than order growth — route internally first.",
  confidence: "Med-High",
  draftAction: "Route refund cluster → Refund Ops (draft).",
  draftKind: "route",
};

export const MRP_MISMATCH_CARD: QuickCommerceRadarCard = {
  id: "mrp-mismatch",
  title: "Weight / MRP mismatch",
  stat: "28 corroborated mentions · packaged goods",
  honestyLine: "Legal Metrology (Packaged Commodities) Rules — internal Legal review only.",
  aiVerdict: "MRP-on-pack mismatch theme — firm-level instrument, not a loose keyword.",
  confidence: "High",
  draftAction: "Route → internal Legal — packaged commodities fact pattern.",
  draftKind: "route",
};

export const COMPLIANCE_ACTIONS = {
  priorityAlert:
    "Draft priority alert → Nodal officer. GRV nears DPDP erasure clock (−14h), keyword 'delete my data'. Re-prioritised above time-waiting. Audit trail attached.",
  regulatoryCard: DARK_PATTERN_EVIDENCE.draftAction,
  refundFriction: REFUND_FRICTION_CARD.draftAction,
  mrpMismatch: MRP_MISMATCH_CARD.draftAction,
};

/** S4 hero headline — SIG-T2-20-001 (id internal only). */
export const CX_QUALITY_HEADLINE = {
  title:
    "Electronics ticket volume fell 18% — but contact-per-order is flat and the chat button moved. A warning, not a win.",
  soWhat:
    "The sharpest CX-vs-P&L seam — a good-looking drop can be silent churn when support access changes in the same week.",
  explainability:
    "Order-normalised contact-per-order holds flat while raw ticket volume falls; support-entry change logged the same week.",
};

export type SuppressionWeekPoint = {
  label: string;
  ticketVolume: number;
  contactPerOrder: number;
  accessChange?: boolean;
};

export type SuppressionEvidencePack = {
  ticketDropPct: string;
  contactPerOrderLabel: string;
  weeklySeries: SuppressionWeekPoint[];
  accessChange: { label: string; when: string; detail: string };
  ruledOut: string[];
  statusVerdict: string;
  draftAction: string;
};

export const SUPPRESSION_EVIDENCE: SuppressionEvidencePack = {
  ticketDropPct: "−18%",
  contactPerOrderLabel: "14.2 / 1k orders (flat)",
  weeklySeries: [
    { label: "W-6", ticketVolume: 118, contactPerOrder: 14.1 },
    { label: "W-5", ticketVolume: 116, contactPerOrder: 14.2 },
    { label: "W-4", ticketVolume: 114, contactPerOrder: 14.1 },
    { label: "W-3", ticketVolume: 112, contactPerOrder: 14.2 },
    { label: "W-2", ticketVolume: 108, contactPerOrder: 14.2 },
    { label: "W-1", ticketVolume: 100, contactPerOrder: 14.2, accessChange: true },
    { label: "W0", ticketVolume: 97, contactPerOrder: 14.2 },
  ],
  accessChange: {
    label: "Support-entry change",
    when: "W-1 · same week as visible drop",
    detail: "Chat button buried on PDP — in-app access-change event logged",
  },
  ruledOut: [
    "Fewer orders (Electronics order volume flat-to-up)",
    "Seasonal dip (calendar excluded)",
    "Single-channel decoy suppressed",
  ],
  statusVerdict:
    "Evidence-backed neutral status: ticket volume fell but contact-per-order did not — not a quality win.",
  draftAction:
    "Route → CX Ops + Product (warning). Electronics tickets −18% but contact-per-order flat + chat entry moved. Flagged as a warning, not a win.",
};

export type CxQualityCard = QuickCommerceRadarCard & {
  gated?: boolean;
  gateLabel?: string;
  integrityNote?: string;
};

export const SELLER_TRUST_CARD: CxQualityCard = {
  id: "audiomax",
  title: "Seller trust-erosion",
  stat: "Neg-review velocity break · earbuds cluster",
  honestyLine: "Integrity-cleared — organic spread, not brigading.",
  aiVerdict:
    "Dead-on-arrival / not-as-described language ahead of star average — seller-health routing warranted.",
  confidence: "Med-High",
  draftAction: "Route → Seller-Brand Partnerships (gated to risk review).",
  draftKind: "route",
  gated: true,
  gateLabel: "Gated to risk review",
  integrityNote: "Integrity guard passed",
  flag: "Integrity-cleared",
};

export type SellerTrustEvidencePack = {
  sellerLabel: string;
  theme: string;
  velocityBreak: string;
  integrityNote: string;
  ruledOut: string[];
  snippets: string[];
  draftAction: string;
};

export const SELLER_TRUST_EVIDENCE: SellerTrustEvidencePack = {
  sellerLabel: "Electronics seller · earbuds SKU family",
  theme: "Dead on arrival / not as described",
  velocityBreak: "Neg-review velocity ahead of category star average",
  integrityNote: "Organic spread · not brigading · integrity guard passed",
  ruledOut: ["Brigading pattern ruled out", "Sale-event distortion excluded", "Single-review outlier suppressed"],
  snippets: [
    "Earbuds dead on arrival — left bud never paired — app review",
    "Not as described — battery life half of listing — ticket",
    "Received used unit in sealed box — care chat",
    "Sound quality nothing like the photos — app review",
  ],
  draftAction: "Route → Seller-Brand Partnerships (gated to risk review).",
};

export const FCR_REPEAT_CARD: CxQualityCard = {
  id: "refund-status-repeat",
  title: "FCR / repeat root-cause",
  stat: "\"refund-status\" repeat-contact 34% vs p50 22%",
  honestyLine: "DENSE break past p95 (31%) — cohort-level, not individual queue depth.",
  aiVerdict: "Refund-status intent driving excess repeats — fix the cause, not the queue.",
  confidence: "High",
  draftAction: "Route cause → process owner for the intent.",
  draftKind: "route",
};

export const BOT_QUALITY_CARD: CxQualityCard = {
  id: "bot-refund-status",
  title: "AI-agent quality monitor",
  stat: "Containment 64%→58% on refund-status after flow change",
  honestyLine: "Below p05 (64%) on a DENSE intent — flow change coincident.",
  aiVerdict: "Bot containment drop on refund-status — route the failing flow, gate any change.",
  confidence: "Med-High",
  draftAction: "Route failing flow → AI-ops (gated).",
  draftKind: "route",
  gated: true,
  gateLabel: "Gated — flow change requires AI-ops sign-off",
};

export const CX_QUALITY_ACTIONS = {
  suppressionWarning: SUPPRESSION_EVIDENCE.draftAction,
  sellerTrust: SELLER_TRUST_CARD.draftAction,
  fcrRepeat: FCR_REPEAT_CARD.draftAction,
  botQuality: BOT_QUALITY_CARD.draftAction,
};

export const DARK_STORES: DarkStoreNode[] = [
  { id: "DS-BLR-D07", label: "Koramangala D07", city: "Bengaluru", issueRate: 5.4, baseline: 0.9, peerMultiple: 6, status: "outbreak" },
  { id: "DS-BLR-D12", label: "Indiranagar D12", city: "Bengaluru", issueRate: 1.0, baseline: 1.0, peerMultiple: 1, status: "flat" },
  { id: "DS-BLR-D19", label: "HSR Layout D19", city: "Bengaluru", issueRate: 0.9, baseline: 1.0, peerMultiple: 0.9, status: "nominal" },
  { id: "DS-HYD-D04", label: "Gachibowli D04", city: "Hyderabad", issueRate: 1.1, baseline: 1.0, peerMultiple: 1.1, status: "flat" },
  { id: "DS-HYD-D08", label: "Kondapur D08", city: "Hyderabad", issueRate: 0.8, baseline: 1.0, peerMultiple: 0.8, status: "nominal" },
  { id: "DS-DEL-D02", label: "Saket D02", city: "Delhi NCR", issueRate: 1.0, baseline: 1.0, peerMultiple: 1, status: "flat" },
  { id: "DS-DEL-D11", label: "Gurugram D11", city: "Delhi NCR", issueRate: 1.2, baseline: 1.0, peerMultiple: 1.2, status: "flat" },
  { id: "DS-MUM-D05", label: "Powai D05", city: "Mumbai", issueRate: 0.9, baseline: 1.0, peerMultiple: 0.9, status: "nominal" },
];

/** S5 hero headline — voice→P&L reveal (internal ids never on face). */
export const REVENUE_BRIDGE_HEADLINE = {
  title: "The signals you already trust, now in rupees — when the order feed lands.",
  soWhat: "The Phase-2 flip, routed through the CX champion, never around her.",
  explainability:
    "Bridge-ready: the CX signal on the left joins to a minimal order feed on the right at cohort level; lights up with the transaction feed.",
};

export const STARRED_BRIDGE_IDS = ["MB1", "MB4", "MB8", "MB17"] as const;

export const BRIDGE_ACTIONS = {
  previewJoin:
    "Preview the join (mock feed) — cohort-level split view only. No live transaction action.",
  pilotDataAsk:
    "Frame the pilot data ask for the read-only transaction feed — human-approved pilot only.",
};

export const BRIDGE_TILES: BridgeTileData[] = [
  {
    id: "MB1",
    title: "D07 complaint-adjusted margin",
    cohort: "Koramangala D07 · missing/spoiled",
    illustrativeValue: "₹18.4L / week",
    honestyLine: "Bridge-ready — lights up with transaction feed. Illustrative, Phase 2.",
    signalRef: "6× baseline issue-rate · 48 of 50 complaints",
    starred: true,
    confidence: "High",
    aiVerdict: "Q-commerce outbreak cohort joins to complaint-adjusted margin when the order feed lands.",
  },
  {
    id: "MB4",
    title: "Seller trust-tax",
    cohort: "Electronics seller · earbuds cluster",
    illustrativeValue: "₹6.2L / month",
    honestyLine: "Bridge-ready — repeat and return cost join.",
    signalRef: "Neg-review velocity break · integrity-cleared",
    starred: true,
    confidence: "Med-High",
    aiVerdict: "Trust-erosion signal joins to conversion drag and return cost on the seller cohort.",
  },
  {
    id: "MB8",
    title: "Refund → repeat loss",
    cohort: "Refund-status intent",
    illustrativeValue: "₹11.1L / quarter",
    honestyLine: "Bridge-ready — cohort repeat join.",
    signalRef: "34% repeat vs p50 22%",
    starred: true,
    confidence: "High",
    aiVerdict: "Refund-status repeat root-cause joins to 30/60/90-day repeat loss when the feed lands.",
  },
  {
    id: "MB17",
    title: "Defect-cost vs LTV appeasement",
    cohort: "High-LTV defect cohort",
    illustrativeValue: "₹24.8L / quarter",
    honestyLine: "Heaviest governance — differential action gated, never auto-applied.",
    signalRef: "Proxy-audited cohort band",
    starred: true,
    confidence: "Med-High",
    aiVerdict: "Cohort-banded defect cost vs LTV appeasement — proxy-audited, human-approved only.",
    governance: {
      cohortBanded: true,
      proxyAudited: true,
      differentialGated: true,
      neverAutoApplied: true,
    },
  },
];

export const BRIDGE_EVIDENCE: Record<string, BridgeEvidencePack> = {
  MB1: {
    cxCohort: "Koramangala D07 · missing/spoiled (48 of 50 complaints)",
    txnCohort: "Mock order/GMV feed · dark-store + issue-theme keyed",
    joinKey: "store_catchment × issue_theme",
    cxSignalCount: "1 corroborated outbreak signal",
    txnRowCount: "12,400 orders / week (mock)",
    guardrails: [
      "Cohort-level join only — no individual routing",
      "Human-approved pilot data ask — no live feed action",
      "Bridge-ready — illustrative until transaction feed lands",
    ],
    confidence: "High",
    aiVerdict:
      "6× baseline issue-rate at D07 joins to ₹18.4L/week complaint-adjusted margin [illustrative, Phase 2].",
  },
  MB4: {
    cxCohort: "Electronics seller · earbuds · neg-review velocity break",
    txnCohort: "Mock conversion + return-cost feed · seller cohort",
    joinKey: "seller_cohort × SKU family",
    cxSignalCount: "1 integrity-cleared trust signal",
    txnRowCount: "8,200 units / month (mock)",
    guardrails: [
      "Cohort-level join only",
      "Gated to risk review — never auto-act on seller-health",
      "Bridge-ready — illustrative until transaction feed lands",
    ],
    confidence: "Med-High",
    aiVerdict: "Trust-tax joins to ₹6.2L/month conversion + return drag [illustrative, Phase 2].",
  },
  MB8: {
    cxCohort: "Refund-status intent · 34% repeat vs p50 22%",
    txnCohort: "Mock cohort repeat / LTV feed",
    joinKey: "intent × repeat_window",
    cxSignalCount: "1 FCR/repeat root-cause signal",
    txnRowCount: "41,000 refund contacts / quarter (mock)",
    guardrails: [
      "Cohort-level join only",
      "Route cause to process owner — bridge quantifies repeat loss",
      "Bridge-ready — illustrative until transaction feed lands",
    ],
    confidence: "High",
    aiVerdict: "Refund-status repeat break joins to ₹11.1L/quarter repeat loss [illustrative, Phase 2].",
  },
  MB17: {
    cxCohort: "High-LTV defect cohort · proxy-audited band",
    txnCohort: "Mock defect-cost vs LTV appeasement feed",
    joinKey: "ltv_band × defect_theme",
    cxSignalCount: "1 governance-heavy cohort signal",
    txnRowCount: "2,100 high-LTV defect cases / quarter (mock)",
    guardrails: [
      "Cohort-banded — differential action gated",
      "Proxy-audited — never auto-applied",
      "Human-approved pilot only — heaviest governance tier",
      "Bridge-ready — illustrative until transaction feed lands",
    ],
    confidence: "Med-High",
    aiVerdict:
      "Defect-cost vs LTV appeasement joins to ₹24.8L/quarter [illustrative, Phase 2] — governance gate required.",
  },
};

export function getBridgeEvidenceById(id: string): BridgeEvidencePack | undefined {
  return BRIDGE_EVIDENCE[id];
}

export const AI_DAY_PROMPTS = [
  "Distil what changed in checkout failures since yesterday",
  "Which dark-store peer set should I compare D07 against?",
  "Frame the pilot data ask for the D07 margin bridge",
  "Summarise statutory-clock exposure in plain language",
  "Why is Electronics ticket volume a warning, not a win?",
];

export function mockAiDayResponse(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("checkout") || l.includes("upi"))
    return "UPI-step failures rose across app reviews (09:12), care chat (09:40) and social (11:05). 1,900 mentions distilled to one corroborated signal. Payments owns the checkout step — draft route is prepared.";
  if (l.includes("d07") || l.includes("dark-store") || l.includes("peer"))
    return "D07 Koramangala reads 6× its own BURSTY baseline on missing/spoiled. Seven peer stores hold flat — the break is local to D07, not Bengaluru-wide. 48 of 50 spoilage complaints trace to this node.";
  if (l.includes("bridge") || l.includes("pilot") || l.includes("data ask"))
    return "Koramangala D07 margin bridge needs a read-only order/GMV feed keyed on dark-store and issue theme. Pilot ask: 90-day cohort join on missing/spoiled at D07 — complaint-adjusted margin shown as illustrative until the feed lands.";
  if (l.includes("statutory") || l.includes("clock"))
    return "Three grievances sit within 6 hours of a statutory deadline. One carries a DPDP erasure keyword — re-prioritised above time-waiting. Draft priority alert to the nodal officer is ready for approval.";
  if (l.includes("electronics") || l.includes("warning") || l.includes("win"))
    return "Electronics tickets fell 18% but contact-per-order is flat. A support-entry change (buried chat button) logged the same week. Route as a warning to CX Ops and Product — not a quality win.";
  return "This week vs last: one emerging checkout theme, one local q-commerce outbreak, three statutory-clock items, and a suppression warning on Electronics. All cohort-level, interaction-first, bridge-ready where rupees matter.";
}
