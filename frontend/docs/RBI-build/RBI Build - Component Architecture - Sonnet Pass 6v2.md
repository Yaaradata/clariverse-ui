RBI Build - Component Architecture - Sonnet Pass 6v2

Fluid CX — RBI Conduct Intelligence Add-On

Source: UX Spec Pass 5v2 | Mock-Data Pass 3 + Inbound Addendum

Tech: React (JSX) + Tailwind CSS + Recharts + lucide-react | Mock data only | No API calls | No localStorage

\===============================================================

1\. MAIN MODULE + FILE PATH

\===============================================================

src/

modules/

RBIConductIntelligence/

index.jsx <- Shell: persona context + screen router

RBIConductIntelligence.jsx <- Top-level rendered component (import this into FluidCX shell)

context/

PersonaContext.jsx <- React Context: active persona, filters, selected obligation

data/

mockRegulations.js

mockObligations.js

mockConductThemes.js

mockRiskAlerts.js

mockInteractionSignals.js

mockEvidenceItems.js

mockControlOwners.js

mockRCAClusters.js

mockVendorScores.js

mockRecoverySignals.js

mockComplaintSignals.js

mockRepeatPatterns.js

mockInboundQueueSignals.js

mockIntegrationDeps.js

mockCapabilityBoundaries.js

mockPersonas.js

components/

shared/

KPICard.jsx

SeverityBadge.jsx

OwnerChip.jsx

DeadlinePill.jsx

ObligationRow.jsx

EvidenceDrawer.jsx

BoundaryNote.jsx

AIInsightCard.jsx

ComplianceLabelBadge.jsx

RCAClusterCard.jsx

VendorScorecard.jsx

FilterPanel.jsx

TranscriptSnippet.jsx

SpineStrip.jsx

EmptyState.jsx

screens/

S0_Landing.jsx

S1_Worklist.jsx

S2_ThemesIndex.jsx

S3_ObligationDetail.jsx

S4_MissedComplaintHub.jsx

S5_RecoveryConduct.jsx

S6_VulnerableCustomer.jsx

S7_VendorGovernance.jsx

S8_RCABoardPack.jsx

S9_BundlingConsent.jsx

S10_RepeatContact.jsx

S11_RegulatoryHorizon.jsx

S12_HonestGap.jsx

\===============================================================

2\. COMPONENT TREE

\===============================================================

RBIConductIntelligence (root)

PersonaContext.Provider

TopNav

PersonaSwitcher (L1–L5 chips)

DeadlineHorizonBand (sticky, global)

SideNav (desktop left rail, 64px collapsed / 200px expanded)

NavItem × 13 (S0–S12)

MainContent (flex-1, overflow-y-auto)

\[active screen component\]

Screen components each follow this internal structure:

ScreenShell

ScreenHeader

PageTitle

KPICard × 3–4

ScreenBody

\[screen-specific content\]

EvidenceDrawer (portal, slides from right)

Shared atomic components used across screens:

KPICard

SeverityBadge

OwnerChip

DeadlinePill

ObligationRow

ComplianceLabelBadge

BoundaryNote

AIInsightCard

RCAClusterCard

VendorScorecard

TranscriptSnippet

SpineStrip

EmptyState

\===============================================================

3\. NAVIGATION MODEL

\===============================================================

The parent Fluid CX shell owns URL routing. RBIConductIntelligence is mounted

as a single-page add-on at whatever path the shell assigns (e.g., /rbi-conduct).

Internal navigation is URL-less, driven by activeScreen state in PersonaContext.

const SCREENS = {

S0: 'landing',

S1: 'worklist',

S2: 'themes',

S3: 'obligation-detail', // receives selectedObligationId prop

S4: 'missed-complaint',

S5: 'recovery-conduct',

S6: 'vulnerable-customer',

S7: 'vendor-governance',

S8: 'rca-board-pack',

S9: 'bundling-consent',

S10: 'repeat-contact',

S11: 'regulatory-horizon',

S12: 'honest-gap',

};

SideNav NavItems navigate by calling setActiveScreen(screenKey).

Drill-downs (obligation click → S3) call setActiveScreen('obligation-detail')

\+ setSelectedObligationId(oblId) in one dispatch.

Persona switcher (L1–L5) does NOT change the active screen — it re-filters

the data within the current screen and adjusts KPI card emphasis.

Breadcrumb inside S2 (theme drill): handled by local useState inside S2_ThemesIndex —

does not change the global activeScreen.

\===============================================================

4\. REUSABLE UI COMPONENTS — PROPS + BEHAVIOUR

\===============================================================

\---- KPICard ----

Props:

label: string

value: string | number

delta?: string // e.g. "+3 since yesterday"

deltaDir?: 'up'|'down'|'neutral'

severity?: 'red'|'amber'|'green'|'neutral'

tooltip?: string

onClick?: fn

Tailwind: white card, rounded-xl, shadow-sm, border-l-4 coloured by severity.

Keyboard: focusable, Enter triggers onClick.

\---- SeverityBadge ----

Props: severity: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'

Renders BOTH coloured background AND text label (accessibility rule).

CRITICAL → bg-red-100 text-red-800 ring-1 ring-red-400 text: "Critical"

HIGH → bg-orange-100 text-orange-800 text: "High"

MEDIUM → bg-yellow-100 text-yellow-800 text: "Medium"

LOW → bg-gray-100 text-gray-600 text: "Low"

\---- OwnerChip ----

Props: roleTitle: string, lineOfDefence: '1LoD'|'2LoD'|'3LoD'

Small chip, grey bg. lineOfDefence shown as subscript. Keyboard-focusable.

\---- DeadlinePill ----

Props: date: string (ISO), label: string

Derives daysRemaining = daysBetween(today, date).

daysRemaining < 0 → grey, text "\[label\] — Passed"

0–60 → red ring, countdown "X days"

61–180 → amber ring

\>180 → blue ring

Always shows text label + date (not colour alone).

\---- ObligationRow ----

Props:

oblId: string

obligationStatement: string

status: 'IN_FORCE'|'DRAFT_PROPOSED'

buildTier: string // INTERNAL — never rendered as-is

effectiveDate: string

exceptionCount: number

onClick: fn

Renders: OBL-NNN pill | statement | status badge | ComplianceLabelBadge | exception count | DeadlinePill.

buildTier is translated to ComplianceLabelBadge (see item 13).

\---- ComplianceLabelBadge ----

Props: buildTier: 'MAIN_FEATURE'|'INTEGRATION_DEPENDENT'|'EVIDENCE_ONLY'|'OUT_OF_SCOPE'

Maps to business labels (raw tiers NEVER rendered):

MAIN_FEATURE → "Monitored by Fluid CX" teal solid pill

INTEGRATION_DEPENDENT → "Monitored with system integration" teal outlined pill

EVIDENCE_ONLY → "Evidence support only" grey outlined pill

OUT_OF_SCOPE → "Outside Fluid CX scope" grey + lock icon

\---- EvidenceDrawer ----

Props:

isOpen: boolean

onClose: fn

alert: RiskAlert | null

signals: CustomerInteractionSignal\[\]

evidenceItems: EvidenceItem\[\]

obligation: Obligation | null

Renders (right-side panel, 480px, slides in over main content):

SpineStrip (regulation → obligation → signal → owner → evidence → action)

Signal list with TranscriptSnippet per signal

EvidenceItem list with attestation badge + download placeholder

RecommendedAction card with CTA buttons (mark actioned, add note)

Integration dependency banner if buildTier = INTEGRATION_DEPENDENT

Boundary note banner if OUT_OF_SCOPE

Close: Escape key, X button, click-outside. Keyboard-trapped while open.

\---- BoundaryNote ----

Props: reason: string, primaryControlOwner: string, displayType: string

DO_NOT_BUILD_BANNER → red-outlined banner, lock icon, "Outside Fluid CX scope"

EVIDENCE_ONLY_CARD → grey outlined card, info icon, "Evidence support only"

HONEST_GAP_SHELF → amber outlined card, "Acknowledged gap"

Appears inline in S3, S12, and inside EvidenceDrawer when applicable.

\---- AIInsightCard ----

Props: headline: string, detail: string, signalTaxonomy: string\[\], linkTo?: string

Soft blue/indigo bg, sparkle icon (lucide Sparkles), pill per signal taxonomy term.

Always derived from mock data logic (see item 14) — never hardcoded prose.

\---- RCAClusterCard ----

Props: cluster: RCACluster, onClick: fn

Shows: clusterTheme, severityScore bar, volume, trend arrow, boardPackInclusion toggle.

Trend arrow: TrendingUp (red), Minus (grey), TrendingDown (green) from lucide-react.

\---- VendorScorecard ----

Props: vendor: VendorBPOScore, onDrillDown: fn

Shows: vendorName, conductScoreOverall (score bar), complaintRatePer10k,

benchmarkVsInhouse badge (BETTER/PARITY/WORSE as coloured pill+text),

fluidCoveragePct vs sampleCoveragePctLegacy (before/after), attestation link.

\---- TranscriptSnippet ----

Props: snippet: string, language: string, signalType: string, timestamp: string

Renders snippet in a code-block-style container (monospace, bg-gray-50).

Prepends language tag (e.g., "\[hi\]") and signal type label.

120-char truncation with "Show more" toggle.

\---- SpineStrip ----

Props: regulation, obligation, signalSummary, owner, evidenceSummary, recommendedAction

Horizontal strip of 6 labelled nodes connected by chevron arrows (ChevronRight icon).

Each node is a small labelled chip. Used in EvidenceDrawer and S3 header.

\---- EmptyState ----

Props: message: string, icon?: lucide component

Centred in its container. Grey text. Always has a named message (no blank states).

\===============================================================

5\. DATA OBJECTS + FIELDS

\===============================================================

All objects are plain JS — no classes, no ORM. Linking keys shown explicitly.

REGULATION

regulationId: string // "REG-001"

shortName: string // "RBC Directions 2025"

circularRef: string // "RBI/DOR/2025-26/170"

issuingBody: string // "RBI"

dateIssued: string // ISO date

effectiveDate: string // ISO date

status: string // "IN_FORCE" | "DRAFT_PROPOSED" | "SUPERVISORY_SIGNAL"

instrumentType: string // "MasterDirection" | "Circular" | "Directions" etc.

scopeApplicable: string // "CommercialBanks" | "NBFCs" | "Both"

relevantObligationIds: string\[\]

OBLIGATION

oblId: string // "OBL-020"

obligationStatement: string

themeId: string -> ConductTheme.themeId

parentRegulationId: string -> Regulation.regulationId

effectiveDate: string

status: string // "IN_FORCE" | "DRAFT_PROPOSED"

buildTier: string // INTERNAL: "MAIN_FEATURE" | "INTEGRATION_DEPENDENT" | "EVIDENCE_ONLY" | "OUT_OF_SCOPE"

accountablePersonaId: string -> ExecutivePersona.personaId ("L1"–"L5")

businessProcessOwnerRole: string

vulnerableCustomerFlag: boolean

interactionSurfaces: string\[\]

branchDependentFlag: boolean

CONDUCT_THEME

themeId: string // "THM-01"

themeName: string

themeDefinition: string

primaryLensId: string -> ExecutivePersona.personaId

obligationCount: number

CUSTOMER_INTERACTION_SIGNAL

signalId: string // "SIG-018472"

interactionId: string

interactionType: string // "recovery_call" | "service_call" | "sales_call" etc.

direction: string // "INBOUND" | "OUTBOUND" | "INTERNAL_TRANSFER" \[EXT-1\]

channel: string // "voice" | "chat" | "email" | "social" | "ticket"

signalType: string // see taxonomy in item 14

severity: string // "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

transcriptSnippet: string

timestamp: string

agentId: string

vendorId: string | null

customerSegment: string // "retail" | "MSE" | "wealth" | "NRI" | "bancassurance"

productCode: string // "Cards" | "PL" | "HL" | "SavAcct" | "ULIP" | "MF"

language: string // "en" | "hi" | "ta" | "te" | "kn" etc.

relatedObligationIds: string\[\]

relatedAlertId: string | null

RISK_ALERT

alertId: string // "ALT-3301"

alertTitle: string

obligationId: string -> Obligation.oblId

themeId: string -> ConductTheme.themeId

severity: string

signalIds: string\[\] -> CustomerInteractionSignal.signalId\[\]

affectedAgentIds: string\[\]

affectedVendorIds: string\[\]

affectedCampaignIds: string\[\]

affectedCustomerSegment: string

firstObservedTs: string

lastObservedTs: string

occurrenceCount: number

routedToOwnerId: string -> ControlOwner.ownerId

status: string // "OPEN" | "IN_REVIEW" | "ACTIONED" | "CLOSED" | "ESCALATED_TO_IO"

recommendedAction: string

boardPackInclusion: boolean

EVIDENCE_ITEM

evidenceId: string // "EVD-7741"

evidenceType: string // "transcript_snippet" | "journey_reconstruction" | "cluster_proof" etc.

obligationId: string -> Obligation.oblId

linkedSignalIds: string\[\]

linkedAlertId: string | null

interactionRef: string

snippet: string

whyThisIsEvidence: string

attestationReady: boolean

auditTrailId: string

CONTROL_OWNER

ownerId: string // "OWN-COLL-01"

roleTitle: string

lineOfDefence: string // "1LoD" | "2LoD" | "3LoD"

businessLine: string

executivePersonaId: string -> ExecutivePersona.personaId

escalationOwnerId: string | null

obligationsOwned: string\[\]

EXECUTIVE_PERSONA

personaId: string // "L1"–"L5"

personaCode: string

realWorldTitles: string\[\]

slogan: string

primaryObligationIds: string\[\]

topThreeUseCases: string\[\]

RCA_CLUSTER

clusterId: string // "RCA-00012"

clusterTheme: string

themeId: string -> ConductTheme.themeId

linkedObligationIds: string\[\]

volume: number

trendDirection: string // "RISING" | "STABLE" | "FALLING"

dimensionBreakdown: object // { campaign: string, agentCluster: string\[\], region: string\[\] }

firstDetected: string

lastUpdated: string

severityScore: number // 0–100

boardPackInclusion: boolean

recommendedRemediation: string

VENDOR_BPO_SCORE

vendorId: string // "VEN-001"

vendorName: string

vendorType: string // "BPO_voice" | "recovery_agency" | "DSA" | "DMA"

agentHeadcount: number

monthlyInteractionVolume: number

sampleCoveragePctLegacy: number // old QA % — Fluid READS, does not set

fluidCoveragePct: number

conductScoreOverall: number // 0–100

conductScoreByObligation: object // { "OBL-010": 61, "OBL-020": 71 }

complaintVolumeLast30d: number

complaintRatePer10k: number

severeExceptionCountLast30d: number

benchmarkVsInhouse: string // "BETTER" | "PARITY" | "WORSE"

lastGovernanceReviewDate: string

attestationPackUrl: string | null

RECOVERY_CONDUCT_SIGNAL

recoverySignalId: string // "RCS-99221"

interactionId: string

agentId: string

vendorId: string | null

bucketDPD: number

productCode: string

disclaimerPresent: boolean

identificationPresent: boolean

timeWindowCompliant: boolean

nonBorrowerContactFlag: boolean

threatFlag: boolean

profanityFlag: boolean

harassmentFlag: boolean

shamingFlag: boolean

distressLanguageDetected: boolean

agentEngagementWithHardship: string // "ENGAGED"|"DISMISSED"|"SILENT"|"NA"

settlementDiscussionPresent: boolean

borrowerJourneyEscalationStep: number // 1–7

severity: number

relatedAlertId: string | null

COMPLAINT_CAPTURE_SIGNAL

complaintSignalId: string // "CCS-50012"

interactionId: string

channel: string

customerId: string // hashed — Fluid reads, does not store raw PII

complaintMarkerType: string // "dissatisfaction"|"escalation_request"|"repeat_contact" etc.

cmsSrCreatedFlag: boolean // Fluid reads CMS; it does NOT write or manage SR lifecycle

cmsSrId: string | null // null if no SR created

gapHoursToSr: number | null

presumedCategoryRBI: string

severity: number

productCode: string

agentId: string

vendorId: string | null

relatedAlertId: string | null

// EXT-2 first-90s fields:

firstNinetySecondsAdherenceScore: number // 0–100

acknowledgementPresentFlag: boolean

srCreationLanguagePresentFlag: boolean

escalationRouteDisclosedFlag: boolean

regulatoryTimelineCommunicatedFlag: boolean

dismissiveFramingFlag: boolean

REPEAT_CONTACT_PATTERN (entity 18, inbound addendum)

repeatPatternId: string // "RCP-22001"

customerId: string // hashed

issueCategory: string

firstContactTs: string

latestContactTs: string

contactCountInWindow: number

windowDays: number // 7 | 14 | 30

channelsUsed: string\[\]

agentsContacted: string\[\]

firstContactResolutionAttemptedFlag: boolean

closureCommunicationClarityScore: number // 0–100

escalationStage: string // "inbound_repeat"|"complaint_filed"|"IO_referred"|"RBIOS_escalated"

linkedObligationIds: string\[\]

severity: number

relatedAlertId: string | null

INBOUND_QUEUE_SIGNAL (entity 16, inbound addendum)

queueSignalId: string // "IQS-77001"

interactionId: string

queueName: string // "General Service" | "24x7 Fraud Reporting" | "Cards Complaint"

queueEntryTs: string

holdDurationSeconds: number

transferCount: number

transferLoopFlag: boolean

abandonmentFlag: boolean

preAbandonmentAudioCaptured: boolean

preAbandonmentFrustrationMarkers: string\[\]

callbackPromisedFlag: boolean

callbackHonouredFlag: boolean | null

downstreamComplaintCorrelation: string | null -> ComplaintCaptureSignal.complaintSignalId

customerSegment: string

relatedAlertId: string | null

INTEGRATION_DEPENDENCY

integrationId: string // "INT-001"

externalSystemName: string

systemType: string

whatItProvides: string

dependentObligationIds: string\[\]

currentlyIntegratedFlag: boolean | 'partial'

roadmapTargetQuarter: string | null

CAPABILITY_BOUNDARY

boundaryId: string // "BND-001"

obligationId: string | null // null for cross-OBL preconditions (e.g. branch recording)

crossOblDescription: string | null

boundaryReason: string

primaryControlOwner: string

displayInDashboard: string // "DO_NOT_BUILD_BANNER"|"EVIDENCE_ONLY_CARD"|"HONEST_GAP_SHELF"

relatedRegulationId: string

\===============================================================

6\. MOCK DATA EXAMPLES (Suvarna Bank fictional context)

\===============================================================

\---- mockRegulations.js ----

export const REGULATIONS = \[

{

regulationId: "REG-001",

shortName: "RBC Directions 2025",

circularRef: "RBI/DOR/2025-26/170",

issuingBody: "RBI",

dateIssued: "2025-11-28",

effectiveDate: "2025-11-28",

status: "IN_FORCE",

instrumentType: "MasterDirection",

scopeApplicable: "CommercialBanks",

relevantObligationIds: \["OBL-001","OBL-003","OBL-014","OBL-015","OBL-016","OBL-019","OBL-027","OBL-028","OBL-030"\]

},

{

regulationId: "REG-002",

shortName: "Internal Ombudsman Directions 2026",

circularRef: "RBI/CEPD/2025-26/381",

issuingBody: "RBI",

dateIssued: "2026-01-14",

effectiveDate: "2026-06-30",

status: "IN_FORCE",

instrumentType: "MasterDirection",

scopeApplicable: "CommercialBanks",

relevantObligationIds: \["OBL-020","OBL-021","OBL-022","OBL-023","OBL-026"\]

},

{

regulationId: "REG-003",

shortName: "RB-IOS 2026",

circularRef: "Press Release 2025-2026/1936",

issuingBody: "RBI",

dateIssued: "2026-01-16",

effectiveDate: "2026-07-01",

status: "IN_FORCE",

instrumentType: "Scheme",

scopeApplicable: "Both",

relevantObligationIds: \["OBL-020","OBL-025"\]

},

{

regulationId: "REG-005",

shortName: "Draft Uniform Recovery Framework",

circularRef: "Draft (rev. mid-May 2026)",

issuingBody: "RBI",

dateIssued: "2026-02-12",

effectiveDate: "2026-07-01",

status: "DRAFT_PROPOSED",

instrumentType: "Directions",

scopeApplicable: "Both",

relevantObligationIds: \["OBL-007","OBL-008","OBL-009","OBL-010","OBL-011","OBL-012"\]

},

\];

\---- mockObligations.js (5 samples) ----

export const OBLIGATIONS = \[

{

oblId: "OBL-020",

obligationStatement: "Capture every customer complaint expressed in any channel into CMS",

themeId: "THM-04",

parentRegulationId: "REG-002",

effectiveDate: "2026-06-30",

status: "IN_FORCE",

buildTier: "MAIN_FEATURE",

accountablePersonaId: "L3",

businessProcessOwnerRole: "Head of Customer Service",

vulnerableCustomerFlag: true,

interactionSurfaces: \["inbound_call","chat","email","social","ticket"\],

branchDependentFlag: false,

},

{

oblId: "OBL-010",

obligationStatement: "Recovery agents must maintain civil tone; no threats, harassment, public shaming",

themeId: "THM-02",

parentRegulationId: "REG-005",

effectiveDate: "2026-07-01",

status: "DRAFT_PROPOSED",

buildTier: "MAIN_FEATURE",

accountablePersonaId: "L3",

businessProcessOwnerRole: "Head of Collections",

vulnerableCustomerFlag: true,

interactionSurfaces: \["recovery_call"\],

branchDependentFlag: false,

},

{

oblId: "OBL-027",

obligationStatement: "Bereaved next-of-kin claims to be handled with empathy and timely settlement",

themeId: "THM-05",

parentRegulationId: "REG-007",

effectiveDate: "2026-03-31",

status: "IN_FORCE",

buildTier: "MAIN_FEATURE",

accountablePersonaId: "L2",

businessProcessOwnerRole: "Head of Customer Service",

vulnerableCustomerFlag: true,

interactionSurfaces: \["inbound_call","branch_visit"\],

branchDependentFlag: true,

},

{

oblId: "OBL-002",

obligationStatement: "Explicit prior consent required for cross-sell; compulsory bundling prohibited",

themeId: "THM-01",

parentRegulationId: "REG-001",

effectiveDate: "2026-04-01",

status: "IN_FORCE",

buildTier: "MAIN_FEATURE",

accountablePersonaId: "L2",

businessProcessOwnerRole: "Head of Contact Centre Operations",

vulnerableCustomerFlag: true,

interactionSurfaces: \["sales_call","inbound_call"\],

branchDependentFlag: true,

},

{

oblId: "OBL-013",

obligationStatement: "Data minimisation and audit for borrower information shared with recovery agents",

themeId: "THM-02",

parentRegulationId: "REG-005",

effectiveDate: "2026-07-01",

status: "DRAFT_PROPOSED",

buildTier: "OUT_OF_SCOPE",

accountablePersonaId: "L4",

businessProcessOwnerRole: "Head of Vendor Management",

vulnerableCustomerFlag: true,

interactionSurfaces: \["case_allocation_feed"\],

branchDependentFlag: false,

},

\];

\---- mockRiskAlerts.js (4 samples) ----

export const RISK_ALERTS = \[

{

alertId: "ALT-3301",

alertTitle: "Threat language in Cards recovery — Agent AGT-1142 (Krescent BPO Pune)",

obligationId: "OBL-010",

themeId: "THM-02",

severity: "CRITICAL",

signalIds: \["SIG-018472","SIG-018501","SIG-018603"\],

affectedAgentIds: \["AGT-1142"\],

affectedVendorIds: \["VEN-002"\],

affectedCampaignIds: \[\],

affectedCustomerSegment: "retail",

firstObservedTs: "2026-05-22T14:08:00Z",

lastObservedTs: "2026-05-24T09:21:00Z",

occurrenceCount: 7,

routedToOwnerId: "OWN-COLL-01",

status: "OPEN",

recommendedAction: "Suspend agent from queue; vendor conduct review; HR consequence under recovery COC",

boardPackInclusion: true,

},

{

alertId: "ALT-3340",

alertTitle: "12 service calls with complaint markers — no CMS SR logged (last 7 days)",

obligationId: "OBL-020",

themeId: "THM-04",

severity: "HIGH",

signalIds: \["SIG-018931","SIG-018932","SIG-018944","SIG-018966"\],

affectedAgentIds: \["AGT-1788","AGT-1801"\],

affectedVendorIds: \[\],

affectedCampaignIds: \[\],

affectedCustomerSegment: "mixed",

firstObservedTs: "2026-05-17T09:00:00Z",

lastObservedTs: "2026-05-23T18:30:00Z",

occurrenceCount: 12,

routedToOwnerId: "OWN-CS-01",

status: "IN_REVIEW",

recommendedAction: "Force-create SR for each identified call; agent retraining on complaint-disposition coding",

boardPackInclusion: true,

},

{

alertId: "ALT-3372",

alertTitle: "Distress dismissed in PL early-bucket recovery — Sutherland Chennai",

obligationId: "OBL-011",

themeId: "THM-05",

severity: "CRITICAL",

signalIds: \["SIG-019112"\],

affectedAgentIds: \["AGT-1342"\],

affectedVendorIds: \["VEN-001"\],

affectedCampaignIds: \[\],

affectedCustomerSegment: "retail",

firstObservedTs: "2026-05-24T10:03:00Z",

lastObservedTs: "2026-05-24T10:03:00Z",

occurrenceCount: 1,

routedToOwnerId: "OWN-COLL-01",

status: "OPEN",

recommendedAction: "Route customer to Hardship Desk within 24h; agent coaching; vendor conduct review",

boardPackInclusion: true,

},

{

alertId: "ALT-3358",

alertTitle: "Bundling pressure detected — Cards cross-sell campaign C-2026-MAY-04",

obligationId: "OBL-002",

themeId: "THM-01",

severity: "HIGH",

signalIds: \["SIG-019004","SIG-019005","SIG-019011"\],

affectedAgentIds: \["AGT-2014","AGT-2031"\],

affectedVendorIds: \[\],

affectedCampaignIds: \["C-2026-MAY-04"\],

affectedCustomerSegment: "retail",

firstObservedTs: "2026-05-23T09:00:00Z",

lastObservedTs: "2026-05-24T17:00:00Z",

occurrenceCount: 38,

routedToOwnerId: "OWN-CS-01",

status: "OPEN",

recommendedAction: "Halt campaign C-2026-MAY-04; script audit; agent-cluster retraining (TN/KA regions)",

boardPackInclusion: true,

},

\];

\---- mockInteractionSignals.js (5 samples) ----

export const INTERACTION_SIGNALS = \[

{

signalId: "SIG-018472",

interactionId: "INT-9921",

interactionType: "recovery_call",

direction: "OUTBOUND",

channel: "voice",

signalType: "threat_language",

severity: "CRITICAL",

transcriptSnippet: "\[hi\] ...agar kal tak nahi diya toh hum aapke office aa jayenge aur sabko bata denge...",

timestamp: "2026-05-22T14:08:00Z",

agentId: "AGT-1142",

vendorId: "VEN-002",

customerSegment: "retail",

productCode: "Cards",

language: "hi",

relatedObligationIds: \["OBL-010"\],

relatedAlertId: "ALT-3301",

},

{

signalId: "SIG-018931",

interactionId: "INT-10044",

interactionType: "service_call",

direction: "INBOUND",

channel: "voice",

signalType: "complaint_marker_no_SR",

severity: "HIGH",

transcriptSnippet: "\[en\] ...I have been calling for three weeks now, no one is resolving my dispute...",

timestamp: "2026-05-23T11:42:00Z",

agentId: "AGT-1788",

vendorId: null,

customerSegment: "retail",

productCode: "Cards",

language: "en",

relatedObligationIds: \["OBL-020"\],

relatedAlertId: "ALT-3340",

},

{

signalId: "SIG-019004",

interactionId: "INT-10089",

interactionType: "sales_call",

direction: "OUTBOUND",

channel: "voice",

signalType: "bundling_pressure",

severity: "HIGH",

transcriptSnippet: "\[hi\] ...madam, salary account ke saath insurance lena compulsory hai...",

timestamp: "2026-05-23T16:15:00Z",

agentId: "AGT-2014",

vendorId: null,

customerSegment: "retail",

productCode: "SavAcct",

language: "hi",

relatedObligationIds: \["OBL-002"\],

relatedAlertId: "ALT-3358",

},

{

signalId: "SIG-019112",

interactionId: "INT-10131",

interactionType: "recovery_call",

direction: "OUTBOUND",

channel: "voice",

signalType: "customer_distress",

severity: "CRITICAL",

transcriptSnippet: "\[hi\] Customer: ...mere husband ka abhi operation hua hai... | Agent: Madam EMI toh deni hi padegi...",

timestamp: "2026-05-24T10:03:00Z",

agentId: "AGT-1342",

vendorId: "VEN-001",

customerSegment: "retail",

productCode: "PL",

language: "hi",

relatedObligationIds: \["OBL-011","OBL-010"\],

relatedAlertId: "ALT-3372",

},

{

signalId: "SIG-019220",

interactionId: "INT-10220",

interactionType: "service_call",

direction: "INBOUND",

channel: "voice",

signalType: "empathy_failure",

severity: "HIGH",

transcriptSnippet: "\[en\] Customer: My husband passed away last week... | Agent: Please submit Form 15G and original death certificate at the branch.",

timestamp: "2026-05-24T14:22:00Z",

agentId: "AGT-1788",

vendorId: null,

customerSegment: "retail",

productCode: "SavAcct",

language: "en",

relatedObligationIds: \["OBL-027"\],

relatedAlertId: null,

},

\];

\---- mockVendorScores.js (3 samples) ----

export const VENDOR_SCORES = \[

{

vendorId: "VEN-001",

vendorName: "Sutherland Chennai",

vendorType: "BPO_voice",

agentHeadcount: 480,

monthlyInteractionVolume: 287000,

sampleCoveragePctLegacy: 3,

fluidCoveragePct: 100,

conductScoreOverall: 68,

conductScoreByObligation: { "OBL-004": 74, "OBL-010": 61, "OBL-011": 52, "OBL-020": 71 },

complaintVolumeLast30d: 142,

complaintRatePer10k: 4.95,

severeExceptionCountLast30d: 12,

benchmarkVsInhouse: "WORSE",

lastGovernanceReviewDate: "2026-04-30",

attestationPackUrl: null,

},

{

vendorId: "VEN-002",

vendorName: "Krescent BPO Pune",

vendorType: "BPO_voice",

agentHeadcount: 220,

monthlyInteractionVolume: 118000,

sampleCoveragePctLegacy: 4,

fluidCoveragePct: 100,

conductScoreOverall: 71,

conductScoreByObligation: { "OBL-004": 76, "OBL-010": 58, "OBL-020": 78 },

complaintVolumeLast30d: 47,

complaintRatePer10k: 3.98,

severeExceptionCountLast30d: 7,

benchmarkVsInhouse: "WORSE",

lastGovernanceReviewDate: "2026-04-30",

attestationPackUrl: null,

},

{

vendorId: "VEN-014",

vendorName: "Pinnacle Recovery Agency (Hyd)",

vendorType: "recovery_agency",

agentHeadcount: 95,

monthlyInteractionVolume: 41000,

sampleCoveragePctLegacy: 2,

fluidCoveragePct: 100,

conductScoreOverall: 59,

conductScoreByObligation: { "OBL-007": 81, "OBL-008": 92, "OBL-009": 74, "OBL-010": 48, "OBL-011": 51 },

complaintVolumeLast30d: 38,

complaintRatePer10k: 9.27,

severeExceptionCountLast30d: 14,

benchmarkVsInhouse: "WORSE",

lastGovernanceReviewDate: "2026-04-30",

attestationPackUrl: null,

},

\];

\===============================================================

7\. STATE MANAGEMENT

\===============================================================

NO Redux. NO localStorage. NO sessionStorage.

One React Context covers the cross-screen state:

// context/PersonaContext.jsx

const PersonaContext = createContext();

export function PersonaProvider({ children }) {

const \[activePersonaId, setActivePersonaId\] = useState("L3"); // default daily user

const \[activeScreen, setActiveScreen\] = useState("landing");

const \[selectedObligationId, setSelectedObligationId\] = useState(null);

const \[drawerOpen, setDrawerOpen\] = useState(false);

const \[drawerAlertId, setDrawerAlertId\] = useState(null);

// Shared filters — screens read and may locally override

const \[globalFilters, setGlobalFilters\] = useState({

severity: \[\], // \[\] means all

status: \[\],

themeIds: \[\],

dateRange: { from: null, to: null },

businessLine: null,

vendorId: null,

direction: null, // "INBOUND" | "OUTBOUND" | null

});

const navigate = (screen, oblId = null) => {

setActiveScreen(screen);

if (oblId) setSelectedObligationId(oblId);

};

const openDrawer = (alertId) => {

setDrawerAlertId(alertId);

setDrawerOpen(true);

};

return (

<PersonaContext.Provider value={{

activePersonaId, setActivePersonaId,

activeScreen,

selectedObligationId, setSelectedObligationId,

drawerOpen, drawerAlertId, openDrawer,

setDrawerOpen,

globalFilters, setGlobalFilters,

navigate,

}}>

{children}

&lt;/PersonaContext.Provider&gt;

);

}

export const usePersona = () => useContext(PersonaContext);

LOCAL state (inside individual screen components, not shared):

\- Table sort column + direction (useState inside each screen)

\- Expanded accordion rows (useState inside S7, S8)

\- Tab selection within a hub (S4, S5, S6, S10)

\- Filter panel open/closed on mobile (useState)

\- S2 drilled theme (useState inside S2)

\===============================================================

8\. PERSONA-SWITCHING BEHAVIOUR

\===============================================================

PersonaSwitcher renders 5 chips (L1–L5).

On click: setActivePersonaId(id).

Effect of switching:

1\. S0 Landing — KPI tiles reorder; queue filters to persona's obligationsOwned via ControlOwner join.

2\. S1 Worklist — pre-filters to alerts routedToOwnerId matching persona's ownerId.

3\. S2 Themes Index — highlights themes where persona is primaryLensId.

4\. S3 Obligation Detail — "owned by" chip reflects persona.

5\. All screens — SpineStrip "Owner" node updates.

Persona does NOT hide screens — all 13 remain accessible via SideNav.

It filters and reorders emphasis, not access.

Implementation pattern (used in each screen):

const { activePersonaId } = usePersona();

const persona = PERSONAS.find(p => p.personaId === activePersonaId);

const myObligationIds = persona.primaryObligationIds;

// screens filter/highlight based on myObligationIds

\===============================================================

9\. FILTERING BEHAVIOUR

\===============================================================

FilterPanel is a shared component rendered in:

S1 (right slide panel), S4–S10 (inline above table, compact variant).

FilterPanel props:

filters: globalFilters object (from context)

onChange: (key, value) => void

variant: 'panel' | 'inline' // 'panel' = 240px right rail; 'inline' = chip row

Filter keys and their effect on data:

severity: \[\] → filters RISK_ALERTS and INTERACTION_SIGNALS by severity field

status: \[\] → filters RISK_ALERTS.status

themeIds: \[\] → filters by ConductTheme (join via obligation.themeId)

dateRange → filters by firstObservedTs / timestamp within range

businessLine → filters via ControlOwner.businessLine join

vendorId → filters INTERACTION_SIGNALS and RECOVERY_CONDUCT_SIGNALS

direction → filters INTERACTION_SIGNALS.direction (INBOUND/OUTBOUND)

All filtering is client-side on mock arrays using .filter().

Filter application is a pure function:

function applyFilters(items, filters) {

return items.filter(item => {

if (filters.severity.length && !filters.severity.includes(item.severity)) return false;

if (filters.status.length && !filters.status.includes(item.status)) return false;

if (filters.vendorId && item.vendorId !== filters.vendorId) return false;

if (filters.direction && item.direction !== filters.direction) return false;

if (filters.dateRange.from && new Date(item.timestamp) < new Date(filters.dateRange.from)) return false;

if (filters.dateRange.to && new Date(item.timestamp) > new Date(filters.dateRange.to)) return false;

return true;

});

}

Each screen applies applyFilters() to its relevant mock arrays before rendering.

\===============================================================

10\. DRILL-DOWN BEHAVIOUR

\===============================================================

Three levels of drill-down, all within the module:

LEVEL 1: Screen navigation

Any ObligationRow click → navigate('obligation-detail', oblId)

Any theme tile (S2) → local drill to theme obligation list (useState in S2)

Any vendor row (S7) → expand accordion in-place (useState in S7)

LEVEL 2: EvidenceDrawer (right-slide panel)

Any alert row in S1 / any signal in S3–S10 → openDrawer(alertId)

EvidenceDrawer assembles content from:

1\. alert = RISK_ALERTS.find(a => a.alertId === drawerAlertId)

2\. signals = INTERACTION_SIGNALS.filter(s => alert.signalIds.includes(s.signalId))

3\. evidence = EVIDENCE_ITEMS.filter(e => e.linkedAlertId === drawerAlertId)

4\. obligation = OBLIGATIONS.find(o => o.oblId === alert.obligationId)

5\. regulation = REGULATIONS.find(r => r.regulationId === obligation.parentRegulationId)

6\. owner = CONTROL_OWNERS.find(o => o.ownerId === alert.routedToOwnerId)

SpineStrip is constructed from these 6 objects.

BoundaryNote shown if obligation.buildTier is INTEGRATION_DEPENDENT or OUT_OF_SCOPE.

Integration banner shown if buildTier = INTEGRATION_DEPENDENT using IntegrationDependency lookup.

LEVEL 3: Transcript player placeholder

Each TranscriptSnippet has a "Play clip" button.

In mock mode: button is rendered but onClick shows a toast/modal:

"Recording player connects to Genesys / NICE via Fluid CX integration."

// TODO: replace with FluidCX.playRecording(interactionId) when API available

\===============================================================

11\. CHART REQUIREMENTS (Recharts)

\===============================================================

CHART C1 — Regulatory Horizon Timeline (S0, S11)

Component: Custom SVG (not standard Recharts) — positioned div with milestone markers

Data shape: REGULATIONS.map(r => ({ label: r.shortName, date: r.effectiveDate, status: r.status }))

Why custom: Recharts doesn't have a timeline primitive; horizontal line with dots is simpler in SVG/divs.

CHART C2 — CMS Gap Trend (S4, left panel header)

Component: &lt;LineChart&gt; width={300} height={80}

Data: Array of { day: "Mon", detected: 18, logged: 14, missed: 4 } (7 items)

Lines: "detected" (grey), "logged" (teal), "missed" (red)

No axes labels — just sparkline style with tooltip.

CHART C3 — First-90s Adherence Distribution (S4, right panel header)

Component: &lt;BarChart&gt; width={300} height={100}

Data: \[{ bucket: "0–20", count: 4 }, { bucket: "21–40", count: 9 }, ...\]

Fill: red for 0–60 buckets, amber for 61–80, green for 81–100.

CHART C4 — Conduct Violation Trend (S5, stacked by flag type)

Component: &lt;BarChart&gt; with stacked &lt;Bar&gt;s

Data: Array of { date: "2026-05-18", threat: 2, profanity: 1, harassment: 3, shaming: 0, nonBorrower: 1 } (14 items)

dataKey per Bar matches flag name. Legend shown below chart.

CHART C5 — Distress Engagement Proportion (S5, Tab 2)

Component: &lt;PieChart&gt; &lt;Pie&gt;

Data: \[{ name: "Engaged", value: 22 }, { name: "Dismissed", value: 14 }, { name: "Silent", value: 8 }\]

Colors: teal / red / amber. Label shows % inside segment.

CHART C6 — Empathy Score Distribution (S6, Tab 1)

Component: &lt;BarChart&gt; same structure as C3.

Data: buckets 0–20, 21–40, 41–60, 61–80, 81–100 with count per bucket.

CHART C7 — Vulnerable Signal Type Mix (S6, Tab 2)

Component: &lt;PieChart&gt; &lt;Pie&gt;

Data: \[{ name: "Bereavement", value: 11 }, { name: "Financial distress", value: 34 }, { name: "Fraud victim", value: 8 }, { name: "PwD", value: 3 }, { name: "MSE", value: 6 }\]

CHART C8 — Vendor Conduct Score Comparison (S7)

Component: &lt;BarChart&gt; horizontal layout using &lt;Bar layout="vertical"&gt;

Data: VENDOR_SCORES.map(v => ({ name: v.vendorName, score: v.conductScoreOverall, inhouse: 81 }))

Two bars per vendor: score (coloured by benchmark) + inhouse reference line.

CHART C9 — Per-Vendor Score Trend (S7, accordion expanded)

Component: &lt;LineChart&gt; sparkline, 4-week data.

Data: mock weekly snapshots — \[{ week: "W1", score: 72 }, { week: "W2", score: 70 }, ...\]

Only rendered when accordion row is expanded.

CHART C10 — RCA Cluster Severity Treemap (S8, left panel)

Component: &lt;Treemap&gt; from Recharts

Data: RCA_CLUSTERS.map(c => ({ name: c.clusterTheme, size: c.volume, severityScore: c.severityScore }))

Color fill derived from severityScore: &lt; 50 amber, 50–75 orange, &gt; 75 red.

CHART C11 — Cluster Dimension Breakdown (S8, expanded cluster row)

Component: &lt;BarChart&gt; layout="vertical"

Data: top 5 entries from cluster.dimensionBreakdown, e.g.

\[{ label: "Campaign C-2026-MAY-04", count: 288 }, { label: "AGT-2014", count: 47 }, ...\]

CHART C12 — Campaign Bundling Pattern (S9, right panel)

Component: &lt;BarChart&gt;

Data: campaigns with bundling count. Threshold line at 10% of campaign calls.

Color: red if count > threshold, grey otherwise.

CHART C13 — Repeat-Contact Issue Volume (S10, By Issue tab)

Component: &lt;BarChart&gt; layout="vertical"

Data: RepeatContactPatterns grouped by issueCategory, summed contactCountInWindow.

Top 10 categories shown.

All Recharts charts:

\- &lt;ResponsiveContainer width="100%" height={N}&gt;

\- &lt;Tooltip&gt; always included

\- &lt;Legend&gt; for stacked/multi-line charts only

\- Accessible: use aria-label on the container div

\===============================================================

12\. TABLE REQUIREMENTS

\===============================================================

All tables are plain HTML (&lt;table&gt;) or div-based rows with Tailwind.

Sortable columns: click header → local useState toggles sort column + direction.

TABLE T1 — Worklist (S1)

Sortable: severity (default DESC), firstObservedTs, occurrenceCount

Badges: SeverityBadge (severity), status pill (OPEN/IN_REVIEW/ACTIONED/CLOSED/ESCALATED_TO_IO),

ComplianceLabelBadge (obligation.buildTier), DeadlinePill (obligation.effectiveDate)

CTA: "View Evidence" button → openDrawer(alert.alertId)

Max rows before pagination: 50 (client-side slice)

TABLE T2 — Obligation list within Theme (S2 drilled)

Sortable: exceptionCount, effectiveDate

Badges: obligation status (IN_FORCE/DRAFT_PROPOSED), ComplianceLabelBadge, DeadlinePill

TABLE T3 — Signal feed (S3 Obligation Detail)

Sortable: severity, timestamp

Badges: SeverityBadge, direction pill (INBOUND/OUTBOUND), channel icon+label

Transcript snippet: TranscriptSnippet component (truncated, expandable)

TABLE T4 — Missed complaint feed (S4 left)

Sortable: severity, gapHoursToSr (null last)

Badges: SeverityBadge, channel pill, cmsSrCreatedFlag rendered as "No SR" red pill or SR ID

TABLE T5 — First-90s adherence (S4 right)

Sortable: firstNinetySecondsAdherenceScore ASC (worst first default)

Badges: tick/cross for each boolean field + text label

TABLE T6 — Recovery conduct violations (S5)

Sortable: severity, timestamp

Flag strip: each active flag as small icon+label (Threat|Profanity|Harassment|Shaming|NonBorrower)

TABLE T7 — Distress engagement (S5 Tab 2)

Sortable: agentEngagementWithHardship (DISMISSED first)

Engagement badge: ENGAGED (teal), DISMISSED (red), SILENT (amber) — all with text

TABLE T8 — Vendor main table (S7)

Sortable: conductScoreOverall ASC (worst first), complaintRatePer10k

benchmarkVsInhouse badge: BETTER (teal)/PARITY (grey)/WORSE (red) — each with text

TABLE T9 — RCA Cluster table (S8)

Sortable: severityScore DESC, volume

Trend badge: TrendingUp icon + "Rising" (red) / Minus + "Stable" (grey) / TrendingDown + "Falling" (green)

boardPackInclusion: toggle (HTML checkbox styled as switch)

TABLE T10 — Integration health (S12)

Not sortable — ordered by integration status (Connected first)

Status badges: "Connected" (teal) / "Partial" (amber) / "Not connected" (red) / "Roadmap" (grey)

TABLE T11 — Capability boundaries (S12)

Not sortable

displayInDashboard → ComplianceLabelBadge logic (see item 13)

TABLE T12 — Repeat-contact by customer (S10 Tab 2)

Sortable: contactCountInWindow DESC

escalationStage badge: inbound_repeat (grey) / complaint_filed (amber) / IO_referred (orange) / RBIOS_escalated (red)

\===============================================================

13\. BADGE / STATUS LOGIC (buildTier → business label mapping)

\===============================================================

// In ComplianceLabelBadge.jsx

const BUILD_TIER_MAP = {

MAIN_FEATURE: { label: "Monitored by Fluid CX", style: "bg-teal-600 text-white" },

INTEGRATION_DEPENDENT: { label: "Monitored with system integration", style: "border border-teal-600 text-teal-700 bg-white" },

EVIDENCE_ONLY: { label: "Evidence support only", style: "border border-gray-400 text-gray-600 bg-white" },

OUT_OF_SCOPE: { label: "Outside Fluid CX scope", style: "bg-gray-100 text-gray-500" },

};

// Lock icon (lucide Lock) appended when OUT_OF_SCOPE.

// Raw buildTier value is NEVER rendered to the DOM.

// Obligation status badge

const OBL_STATUS_MAP = {

IN_FORCE: { label: "In Force", style: "bg-blue-800 text-white" },

DRAFT_PROPOSED: { label: "Draft · Proposed", style: "border border-amber-500 text-amber-700 bg-amber-50" },

};

// Alert status badge

const ALERT_STATUS_MAP = {

OPEN: { label: "Open", style: "bg-red-100 text-red-800" },

IN_REVIEW: { label: "In Review", style: "bg-yellow-100 text-yellow-800" },

ACTIONED: { label: "Actioned", style: "bg-green-100 text-green-800" },

CLOSED: { label: "Closed", style: "bg-gray-100 text-gray-600" },

ESCALATED_TO_IO: { label: "Escalated to IO", style: "bg-purple-100 text-purple-800" },

};

// Benchmark badge (S7)

const BENCHMARK_MAP = {

BETTER: { label: "Above in-house", style: "bg-teal-100 text-teal-800" },

PARITY: { label: "At parity", style: "bg-gray-100 text-gray-600" },

WORSE: { label: "Below in-house", style: "bg-red-100 text-red-800" },

};

// Engagement badge (S5 Tab 2)

const ENGAGEMENT_MAP = {

ENGAGED: { label: "Engaged", style: "bg-teal-100 text-teal-800" },

DISMISSED: { label: "Dismissed", style: "bg-red-100 text-red-800" },

SILENT: { label: "Silent", style: "bg-amber-100 text-amber-800" },

NA: { label: "N/A", style: "bg-gray-100 text-gray-500" },

};

ALL badge components render colour + text (never colour alone).

\===============================================================

14\. AI-INSIGHT MOCK LOGIC

\===============================================================

AIInsightCard is NOT hardcoded prose. It is derived at render time from mock data.

// utils/deriveInsights.js

export function deriveTopSignalInsight(signals, obligationId) {

const relevant = signals.filter(s => s.relatedObligationIds.includes(obligationId));

if (!relevant.length) return null;

const critical = relevant.filter(s => s.severity === "CRITICAL");

const top = critical.length ? critical : relevant;

// Sort by most recent

top.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

const s = top\[0\];

const humanLabel = SIGNAL_TYPE_LABELS\[s.signalType\] || s.signalType;

const vendorNote = s.vendorId ? \` — ${VENDOR_SCORES.find(v => v.vendorId === s.vendorId)?.vendorName}\` : "";

return {

headline: \`Most recent signal: ${humanLabel}${vendorNote}\`,

detail: \`${top.length} instance${top.length > 1 ? "s" : ""} detected ${relative(s.timestamp)}.\`,

signalTaxonomy: \[...new Set(top.map(t => t.signalType))\],

};

}

export function deriveVendorInsight(vendorScores) {

if (!vendorScores.length) return null;

const worst = \[...vendorScores\].sort((a, b) => a.conductScoreOverall - b.conductScoreOverall)\[0\];

return {

headline: \`Highest-risk vendor: ${worst.vendorName}\`,

detail: \`${worst.severeExceptionCountLast30d} severe exceptions, conduct score ${worst.conductScoreOverall}/100, ${worst.complaintRatePer10k} complaints per 10k interactions.\`,

signalTaxonomy: \["vendor_conduct_signal"\],

};

}

export function deriveClusterInsight(clusters) {

const rising = clusters.filter(c => c.trendDirection === "RISING" && c.boardPackInclusion);

if (!rising.length) return null;

const top = rising.sort((a, b) => b.severityScore - a.severityScore)\[0\];

return {

headline: \`Fastest-rising cluster: ${top.clusterTheme}\`,

detail: \`${top.volume} signals, rising since ${top.firstDetected}. Recommended: ${top.recommendedRemediation}\`,

signalTaxonomy: \["root_cause_cluster"\],

};

}

const SIGNAL_TYPE_LABELS = {

threat_language: "Threat language",

profanity: "Profanity",

harassment_pattern: "Harassment pattern",

public_shaming: "Public shaming",

customer_distress: "Customer distress",

bundling_pressure: "Bundling pressure",

consent_extraction: "Consent extraction",

complaint_marker_no_SR: "Missed complaint (no SR)",

empathy_failure: "Empathy failure",

non_borrower_contact: "Non-borrower contact",

language_mismatch: "Language mismatch",

banned_phrase_penal_interest: "Banned phrase: 'penal interest'",

};

\===============================================================

15\. EVIDENCE-PACKAGE MOCK LOGIC

\===============================================================

// utils/assembleEvidence.js

export function assembleEvidencePackage(alertId, { alerts, signals, evidenceItems, obligations, regulations, owners }) {

const alert = alerts.find(a => a.alertId === alertId);

if (!alert) return null;

const relatedSignals = signals.filter(s => alert.signalIds.includes(s.signalId));

const evidence = evidenceItems.filter(e => e.linkedAlertId === alertId);

const obligation = obligations.find(o => o.oblId === alert.obligationId);

const regulation = regulations.find(r => r.regulationId === obligation?.parentRegulationId);

const owner = owners.find(o => o.ownerId === alert.routedToOwnerId);

return {

alert,

relatedSignals,

evidence,

obligation,

regulation,

owner,

spineNodes: {

regulation: regulation?.shortName ?? "—",

obligation: obligation?.obligationStatement ?? "—",

signal: relatedSignals\[0\]?.signalType

? SIGNAL_TYPE_LABELS\[relatedSignals\[0\].signalType\]

: "—",

owner: owner?.roleTitle ?? "—",

evidenceSummary: evidence.length

? \`${evidence.length} item${evidence.length > 1 ? "s" : ""} · ${evidence.filter(e => e.attestationReady).length} audit-ready\`

: "No evidence attached",

recommendedAction: alert.recommendedAction,

},

// Product boundary enforcement in data shape:

// cmsSrCreatedFlag is READ from CMS data — Fluid does not write this

// weakAuthSignalPresent would be partner-fed (null in mock) — Fluid does not decide

isBoundaryCase: obligation?.buildTier === "OUT_OF_SCOPE",

isIntegrationCase: obligation?.buildTier === "INTEGRATION_DEPENDENT",

};

}

EvidenceDrawer calls assembleEvidencePackage() on open and passes the result to its child renders.

The "Force-create SR" CTA in S4 renders as a disabled button with tooltip

"SR creation is managed by your CMS (TCS BaNCS). Fluid feeds this data to CMS."

in mock mode — enforcing the boundary visually.

\===============================================================

16\. INTEGRATION-DEPENDENCY HANDLING

\===============================================================

Two visual treatments for INTEGRATION_DEPENDENT obligations:

A. Inline banner on ObligationRow / S3 header:

&lt;div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700"&gt;

&lt;Info size={14} /&gt; {/\* lucide Info icon \*/}

&lt;span&gt;

Monitored with &lt;strong&gt;{dep.externalSystemName}&lt;/strong&gt; integration.

{!dep.currentlyIntegratedFlag && \` Integration not yet connected — coverage is partial.\`}

{dep.roadmapTargetQuarter && \` Target: ${dep.roadmapTargetQuarter}.\`}

&lt;/span&gt;

&lt;/div&gt;

B. Gated data in tables:

If an obligation.buildTier = INTEGRATION_DEPENDENT and the corresponding

IntegrationDependency.currentlyIntegratedFlag = false:

\- Table still renders but affected columns show:

&lt;span className="text-gray-400 italic text-xs"&gt;Requires {dep.externalSystemName}&lt;/span&gt;

\- KPI tile for that metric shows "—" with a tooltip explaining the dependency.

\- No fake numbers are shown for ungated fields.

Implementation:

// utils/getIntegrationStatus.js

export function getIntegrationStatus(obligationId, integrationDeps) {

return integrationDeps.find(dep =>

dep.dependentObligationIds.includes(obligationId)

) ?? null;

}

Used in S3, S4 (CRM consent flag), S5 (hardship handoff column), S6 (routing outcome column).

\===============================================================

17\. BOUNDARY-NOTE HANDLING

\===============================================================

CapabilityBoundary records drive BoundaryNote rendering.

// utils/getBoundary.js

export function getBoundary(obligationId, boundaries) {

return boundaries.find(b => b.obligationId === obligationId) ?? null;

}

Three render modes (matching displayInDashboard field):

DO_NOT_BUILD_BANNER → shown in S12 and as a red-outlined banner

on S3 when obligation.buildTier = OUT_OF_SCOPE.

S3 signal table is NOT rendered for OUT_OF_SCOPE obligations.

Instead: full-width BoundaryNote replaces the table.

EVIDENCE_ONLY_CARD → shown in EvidenceDrawer and S12.

S3 renders a reduced view: spine strip only, no signal table,

evidence items shown with "Evidence support only" label.

HONEST_GAP_SHELF → shown only in S12.

Amber card with acknowledged-gap framing.

Example: branch recording precondition (BND-008).

Product boundary enforcement in component logic:

No component renders a "manage" or "resolve" CTA for OUT_OF_SCOPE obligations.

Out-of-scope obligations do NOT generate RiskAlerts in the mock data (enforced

in mockRiskAlerts.js by only including MAIN_FEATURE and INTEGRATION_DEPENDENT oblIds).

\===============================================================

18\. RESPONSIVE RULES

\===============================================================

Breakpoints (Tailwind defaults):

sm: 640px, md: 768px, lg: 1024px, xl: 1280px

Desktop (lg+):

SideNav: fixed left rail, 64px collapsed (icon only), 200px expanded.

MainContent: ml-16 or ml-52 based on nav state.

EvidenceDrawer: 480px right panel, overlays but does not push content.

Tables: all columns visible.

Filter panel: right rail (S1) or left sidebar (S8).

Tablet (md–lg):

SideNav: icon-only (64px), no hover expansion.

Tables: horizontal scroll (overflow-x-auto).

EvidenceDrawer: full-width bottom sheet (80vh).

S7 accordion: expand below row (full width).

Mobile (< md):

SideNav: hidden, replaced by bottom tab bar (S0 / S1 / S2 / S7 / S12 only).

S0 Landing: stacked layout, KPI tiles in 2-column grid, queue list full width.

Tables: collapsed to card-per-row format (key fields only; "expand" to see all).

EvidenceDrawer: full-screen modal.

Charts: hidden on mobile except C2 (sparkline) and C5/C7 (pie) which scale.

CRO summary mobile view (S0):

Three KPI tiles + deadline horizon band (horizontal scroll strip) are prioritised.

My Queue shows top 3 alerts only with "View all" link to S1.

\===============================================================

19\. FUTURE FLUID CX API INTEGRATION POINTS

\===============================================================

Stubs are placed in mock data files and utility functions.

Cursor should search for "// TODO: FluidCX API" to find all stubs.

// In mockInteractionSignals.js

// TODO: FluidCX API — replace INTERACTION_SIGNALS constant with:

// const res = await FluidCX.getSignals({ obligationIds, dateRange, personaId });

// In TranscriptSnippet.jsx

// TODO: FluidCX API — replace placeholder with:

// FluidCX.playRecording(interactionId, { startOffsetSeconds: signalOffsetSeconds });

// In S4_MissedComplaintHub.jsx — "Force-create SR" button

// TODO: FluidCX API — when CMS integration (INT-002) is bidirectional:

// FluidCX.createCMSRecord({ signalId, category: presumedCategoryRBI, agentId });

// Until then: button is disabled with boundary tooltip.

// In S7_VendorGovernance.jsx — "Generate Attestation Pack" button

// TODO: FluidCX API — replace with:

// const pdf = await FluidCX.generateAttestationPack({ vendorIds, quarter, includeInhouseBenchmark });

// For mock: button triggers a console.log("Attestation pack would be generated") + toast message.

// In S8_RCABoardPack.jsx — "Export CSCB pack" button

// TODO: FluidCX API — replace with:

// const doc = await FluidCX.exportCSCBPack({ clusterIds, quarter, annotations });

// For mock: triggers toast "Board pack export is a Fluid CX API feature."

// In PersonaContext.jsx

// TODO: FluidCX API — replace default persona from auth:

// const user = await FluidCX.getCurrentUser();

// setActivePersonaId(user.personaId);

// In FilterPanel.jsx

// TODO: FluidCX API — persist filter preferences server-side:

// FluidCX.saveUserPreferences({ filters: globalFilters });

// In ComplianceLabelBadge.jsx

// NOTE: buildTier is an INTERNAL field. It is mapped to business labels here

// and must NEVER be passed through to any external API call or rendered as-is.

\===============================================================

SAVE CONFIRMATION BELOW — FILE WRITTEN TO DRIVE

\===============================================================