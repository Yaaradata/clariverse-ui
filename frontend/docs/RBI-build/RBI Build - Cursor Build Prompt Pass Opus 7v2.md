\================================================================================

CURSOR BUILD PROMPT — RBI Conduct Intelligence (Fluid CX Add-On)

Version: Pass Opus 7v2

\================================================================================

You are building a polished React (JSX) + Tailwind CSS dashboard module called

"RBI Conduct Intelligence" — an add-on inside the existing Fluid CX platform.

Build exactly what is specified. Do not invent features. Do not omit specified

features. Treat the product boundary (Section 2) as a hard contract.

────────────────────────────────────────────────────────────────────────────────

SECTION 0 — ARTIFACT / CURSOR DUAL COMPATIBILITY

────────────────────────────────────────────────────────────────────────────────

The main module must also run as a single-file React artifact in Claude.ai for

preview. Keep all dependencies to the libraries listed (Recharts, lucide-react).

No browser storage. Default export the main module. All mock data inline in the

artifact file or in a sibling mockData.js that the main file imports.

For the full Cursor build, use the directory structure in Section 3.

For a single-file artifact preview, collapse everything into one file: mock data

constants at the top, utility functions in the middle, components below, and the

main RBIConductIntelligence component as the default export at the bottom.

────────────────────────────────────────────────────────────────────────────────

SECTION 1 — TECH CONSTRAINTS (NON-NEGOTIABLE)

────────────────────────────────────────────────────────────────────────────────

\- React (JSX), functional components + hooks only. No class components.

\- Tailwind CSS core utility classes only. No custom config, no compiler-derived

classes, no @apply. Must work in Claude Artifacts AND standard Vite/Next.js.

\- Recharts for ALL charts.

\- lucide-react for ALL icons.

\- Mock data only. No fetch(), no axios, no API of any kind.

\- NO localStorage, sessionStorage, cookies, IndexedDB, or any browser persistence.

\- NO Redux, Zustand, MobX. ONE React Context only: PersonaContext.

\- Do not import from @shadcn/ui. Build cards, badges, drawers with plain Tailwind.

────────────────────────────────────────────────────────────────────────────────

SECTION 2 — PRODUCT BOUNDARY (ENFORCE IN CODE AND UI)

────────────────────────────────────────────────────────────────────────────────

Fluid CX is a conversation-intelligence layer. It reads recorded customer

interactions and surfaces conduct signals. It does NOT:

\- Run the CMS workflow engine or write SR records.

\- Replace the Internal Ombudsman's independent judgment.

\- Generate or send core-banking transaction alerts.

\- Make fraud-authentication decisions or own authentication metadata.

\- Execute refund or credit-shadow workflows.

\- Audit UI/UX dark patterns in digital journeys.

\- Enforce data-governance or DPDP access controls.

\- Provide legal or compliance judgment.

These items appear ONLY as:

\- Small BoundaryNote components with a named partner system as primary owner.

\- Amber integration-dependency banners on co-controlled obligations.

\- "Coming in v2" labels in S12 for deferred integrations.

\- NEVER as main features, primary CTAs, or main dashboard content.

Boundary enforcement in data shape:

\- ComplaintCaptureSignal.cmsSrCreatedFlag is READ-ONLY in the mock — Fluid

reads CMS state; it does not write. The "Force-create SR" button in S4

renders DISABLED with tooltip: "SR creation is managed by your CMS. Fluid

feeds discovered complaints to CMS."

\- FraudDisputeSignal.weakAuthSignalPresent is partner-fed (always null in mock).

\- OUT_OF_SCOPE obligations generate NO RiskAlert records anywhere in mock data.

\- buildTier is an INTERNAL field. It is NEVER rendered as text in the UI. It

is only used inside ComplianceLabelBadge to derive the business label.

────────────────────────────────────────────────────────────────────────────────

SECTION 3 — DIRECTORY STRUCTURE

────────────────────────────────────────────────────────────────────────────────

src/modules/RBIConductIntelligence/

index.jsx ← default export; mounts shell + context

RBIConductIntelligence.jsx ← top-level rendered component

context/

PersonaContext.jsx

data/

mockRegulations.js

mockObligations.js

mockConductThemes.js

mockRiskAlerts.js

mockInteractionSignals.js

mockEvidenceItems.js

mockControlOwners.js

mockPersonas.js

mockRCAClusters.js

mockVendorScores.js

mockRecoverySignals.js

mockComplaintSignals.js

mockRepeatPatterns.js

mockInboundQueueSignals.js

mockIntegrationDeps.js

mockCapabilityBoundaries.js

utils/

deriveInsights.js

assembleEvidence.js

applyFilters.js

getIntegrationStatus.js

getBoundary.js

deadlineHelpers.js

signalTypeLabels.js

components/

shared/

KPICard.jsx SeverityBadge.jsx OwnerChip.jsx

DeadlinePill.jsx ObligationRow.jsx EvidenceDrawer.jsx

BoundaryNote.jsx AIInsightCard.jsx ComplianceLabelBadge.jsx

RCAClusterCard.jsx VendorScorecard.jsx FilterPanel.jsx

TranscriptSnippet.jsx SpineStrip.jsx EmptyState.jsx

TopNav.jsx SideNav.jsx PersonaSwitcher.jsx

DeadlineHorizonBand.jsx

screens/

S0_Landing.jsx S1_Worklist.jsx S2_ThemesIndex.jsx

S3_ObligationDetail.jsx S4_MissedComplaintHub.jsx S5_RecoveryConduct.jsx

S6_VulnerableCustomer.jsx S7_VendorGovernance.jsx S8_RCABoardPack.jsx

S9_BundlingConsent.jsx S10_RepeatContact.jsx S11_RegulatoryHorizon.jsx

S12_HonestGap.jsx

────────────────────────────────────────────────────────────────────────────────

SECTION 4 — PRODUCT SPINE (EVERY SCREEN MUST EXPRESS THIS)

────────────────────────────────────────────────────────────────────────────────

The product narrative is a six-node chain expressed on every screen:

Regulation → Obligation → Customer Interaction Signal → Control Owner →

Evidence → Recommended Action

SpineStrip renders this as six labelled chips connected by ChevronRight icons.

Render SpineStrip in: EvidenceDrawer (top), S3 ObligationDetail header,

S0 Landing (condensed). It is the visual anchor of the entire add-on.

────────────────────────────────────────────────────────────────────────────────

SECTION 5 — NAVIGATION MODEL

────────────────────────────────────────────────────────────────────────────────

The parent Fluid CX shell owns URL routing. This module is URL-less internally.

Navigation is driven by activeScreen state in PersonaContext.

Screen keys: 'landing' | 'worklist' | 'themes' | 'obligation-detail' |

'missed-complaint' | 'recovery-conduct' | 'vulnerable-customer' |

'vendor-governance' | 'rca-board-pack' | 'bundling-consent' | 'repeat-contact' |

'regulatory-horizon' | 'honest-gap'.

SideNav: lg+ 200px expanded (icon + label) → md 64px icon-only → mobile hidden,

replaced by bottom tab bar with 5 items (Landing / Worklist / Themes / Vendor /

Honest-Gap).

PersonaSwitcher (L1–L5 chips in TopNav): switching re-filters data within each

screen. It does NOT change activeScreen and does NOT hide any screen.

Drill-down navigation:

ObligationRow click → navigate('obligation-detail', oblId)

Theme tile (S2) → local useState drill (does not change activeScreen)

Vendor row (S7) → in-place accordion expansion (local useState)

Any alert row → openDrawer(alertId) — slides EvidenceDrawer from right

────────────────────────────────────────────────────────────────────────────────

SECTION 6 — PERSONA CONTEXT

────────────────────────────────────────────────────────────────────────────────

PersonaContext state:

activePersonaId: string // default "L3"

activeScreen: string // default "landing"

selectedObligationId: string|null

drawerOpen: boolean

drawerAlertId: string|null

globalFilters: {

severity: string\[\] // \[\] = all

status: string\[\]

themeIds: string\[\]

dateRange: { from: string|null, to: string|null }

businessLine: string|null

vendorId: string|null

direction: string|null // "INBOUND" | "OUTBOUND" | null

}

Functions exposed:

navigate(screen, oblId?) openDrawer(alertId) closeDrawer()

setActivePersonaId(id) setGlobalFilters(partial)

Export hook: export const usePersona = () => useContext(PersonaContext);

LOCAL state (inside individual screens, not in context):

\- Table sort column + direction

\- Expanded accordion rows (S7, S8)

\- Tab selection within hubs (S4, S5, S6, S10)

\- Filter panel open/closed on mobile

\- S2 drilled theme

────────────────────────────────────────────────────────────────────────────────

SECTION 7 — SHARED COMPONENTS + BADGE LOGIC

────────────────────────────────────────────────────────────────────────────────

\# ComplianceLabelBadge — THE MOST IMPORTANT BADGE. Raw tiers NEVER reach DOM.

Internal buildTier → business label → style:

MAIN_FEATURE → "Monitored by Fluid CX" bg-teal-600 text-white

INTEGRATION_DEPENDENT → "Monitored with system integration" border border-teal-600 text-teal-700 bg-white

EVIDENCE_ONLY → "Evidence support only" border border-gray-400 text-gray-600 bg-white

OUT_OF_SCOPE → "Outside Fluid CX scope" + Lock icon (lucide Lock 10px) bg-gray-100 text-gray-500

\# SeverityBadge — ALWAYS colour + text label (never colour alone, accessibility).

CRITICAL → bg-red-100 text-red-800 ring-1 ring-red-300 "Critical"

HIGH → bg-orange-100 text-orange-800 "High"

MEDIUM → bg-yellow-100 text-yellow-800 "Medium"

LOW → bg-gray-100 text-gray-600 "Low"

\# ObligationStatus badge:

IN_FORCE → bg-blue-800 text-white "In Force"

DRAFT_PROPOSED → border border-amber-500 text-amber-700 bg-amber-50 "Draft · Proposed"

\# AlertStatus badge:

OPEN / IN_REVIEW / ACTIONED / CLOSED / ESCALATED_TO_IO →

red-100/yellow-100/green-100/gray-100/purple-100 with matching text. Always text label.

\# DeadlinePill — fixed mock "today" = 2026-05-25.

Past → text-gray-400 "\[label\] — Passed (date)"

0–60 days → ring-2 ring-red-500 text-red-700 "Xd · \[label\]"

61–180 days → ring-2 ring-amber-400 text-amber-700

\>180 days → ring-2 ring-blue-400 text-blue-700

\# BoundaryNote:

DO_NOT_BUILD_BANNER → red outline, Lock icon, "Outside Fluid CX scope. \[owner\] owns this."

EVIDENCE_ONLY_CARD → grey outline, Info icon, "Evidence support only. \[owner\] holds primary control."

HONEST_GAP_SHELF → amber outline, AlertTriangle icon, "Acknowledged gap: \[reason\]"

\# AIInsightCard:

Indigo-50 bg, rounded-xl, left border indigo-400, Sparkles icon.

Props: headline, detail, signalTaxonomy (string\[\], up to 3 pills + "+N"), linkTo?

Content derived at render time from mock data via deriveInsights.js. Never hardcoded.

\# SpineStrip:

Horizontal row of 6 chips: Regulation | Obligation | Signal | Owner | Evidence | Action

Connected by ChevronRight icons. Collapses to vertical list on mobile.

\# OwnerChip:

Small grey pill: roleTitle + subscript lineOfDefence ("1LoD" / "2LoD" / "3LoD").

\# TranscriptSnippet:

Monospace font, bg-gray-50, border-l-2 border-gray-300, p-2 rounded.

Language tag prefix: "\[hi\]", "\[ta\]", "\[en\]" etc.

120-char truncation with "Show more" expand toggle.

"Play clip" button (lucide Play icon) → onClick shows toast:

"Recording player connects via Fluid CX integration.

// TODO: FluidCX API — FluidCX.playRecording(interactionId)"

\# EvidenceDrawer:

Right-slide panel, 480px on desktop, full-screen on mobile, 80vh sheet on tablet.

Keyboard-trapped while open; Esc closes; click-outside closes; X button closes.

Contents in order:

1\. SpineStrip (assembled via assembleEvidencePackage)

2\. Signals list (TranscriptSnippet per signal)

3\. EvidenceItem list with attestationReady badges

4\. RecommendedAction card with CTAs

5\. BoundaryNote or integration banner if applicable

CTAs (mock-only):

"Mark actioned" → console.log + toast

"Add note" → console.log + toast

"Escalate to IO"→ rendered with label:

"IO review is conducted by the Internal Ombudsman — not Fluid CX."

\# EmptyState:

Centred grey text + optional lucide icon above.

Every data section MUST define its specific empty message. No generic "No data".

\# FilterPanel:

'panel' variant: 240px right rail with section headers.

'inline' variant: compact chip row above tables.

Filters: severity (multi-checkbox), status (multi-checkbox), themeIds

(multi-checkbox, 8 themes), dateRange (from/to date inputs), businessLine

(dropdown), vendorId (searchable dropdown), direction (INBOUND/OUTBOUND toggle).

All filtering client-side via applyFilters.js.

\# DeadlineHorizonBand:

Full-width sticky strip at top, 7 milestone DeadlinePills horizontally arranged:

31 Mar 2026 | 1 Apr 2026 | 10 Apr 2026 | 30 Jun 2026 | 1 Jul 2026 |

1 Oct 2026 | 13 May 2027

"Today" marker at 2026-05-25. Horizontally scrollable on mobile.

────────────────────────────────────────────────────────────────────────────────

SECTION 8 — SCREEN-BY-SCREEN SPECIFICATIONS

────────────────────────────────────────────────────────────────────────────────

\#### S0 Persona-Aware Landing

DeadlineHorizonBand sticky top. Persona greeting strip below.

KPI tiles (3): "Interactions analysed today" (42,318 · 100% coverage) |

"Open critical alerts" (count, red if >0) | "RB-IOS exposure — cases at risk"

(boardPackInclusion=true AND status=OPEN, amber).

60/40 split body: LEFT alert preview table (5 rows, "View all" → S1).

RIGHT 8-theme heat grid (4×2 desktop, 2×4 mobile scroll; each tile: themeName,

exception count, trend arrow TrendingUp/Minus/TrendingDown).

Below grid: 2 AIInsightCards.

Mobile: stacked, KPI 2-col grid, top-3 alerts only.

\#### S1 My Worklist

KPI tiles (4): Critical open | High open | Actioned today | Escalated to IO.

Full-width RiskAlert table. Columns:

Severity \[SeverityBadge\] | Alert title | Obligation \[OBL-NNN pill +

ComplianceLabelBadge + ObligationStatus\] | Theme | Affected (agentIds/vendorIds,

max 2 + "+N") | First seen (relative) | Occurrences | Status \[AlertStatus\] |

Actions ("View Evidence").

Default sort: severity DESC then firstObservedTs ASC.

FilterPanel right rail ('panel' variant). All globalFilters apply.

Row click → openDrawer(alertId).

Empty: "No alerts match your filters. Adjust filters or check back after the

next analysis run."

\#### S2 Conduct Themes Index

KPI tiles (3): Themes with critical exceptions | Obligations monitored by Fluid CX

(shown as "13 of 38") | Next hard deadline.

4×2 theme tile grid; border colour = highest severity open alert.

Click tile → local drill to obligation list (breadcrumb, useState in S2).

Collapsible Regulatory Horizon panel below grid (auto-expand if nearest

deadline < 60 days). Horizontal milestone timeline (div-based, not Recharts).

1 AIInsightCard: fastest-rising cluster.

Filter chips above grid: "Themes with critical alerts only" | "My themes".

\#### S3 Obligation Detail

Obligation identity strip: oblId | obligationStatement | ObligationStatus |

ComplianceLabelBadge | DeadlinePill | exception count.

SpineStrip directly below identity strip.

If buildTier = OUT_OF_SCOPE: body is a full-width BoundaryNote. NO signal table.

If buildTier = INTEGRATION_DEPENDENT: amber integration banner above signal table.

If branchDependentFlag = true: small grey note "Branch recording required for

full coverage."

Signal feed table: Severity | Direction \[INBOUND/OUTBOUND\] | Signal type (human

label) | Channel (icon+text) | Agent/Vendor | Transcript snippet | Timestamp |

"View evidence".

EvidenceItem table below signal table: Evidence type | Why evidence | Audit-ready

badge | Audit trail ID | Download.

Signal volume sparkline (30-day BarChart) right panel.

1 AIInsightCard.

\#### S4 Missed-Complaint Hub (UC-01 + UC-23)

KPI tiles (4): Complaints not in CMS (last 24h) | CMS gap rate 7d (%) |

First-90s adherence score today | Escalation route disclosed %.

50/50 panels desktop, stacked mobile.

LEFT: ComplaintCaptureSignal WHERE cmsSrCreatedFlag=false.

Columns: Severity | Channel | Complaint type (human label) | Product |

Agent/Vendor | Transcript snippet | Gap to SR (null = "No SR" red pill) |

Presumed RBI category | "Force-create SR" (DISABLED, boundary tooltip).

Chart C2 above (7-day LineChart: detected vs logged vs missed).

RIGHT: ComplaintCaptureSignal (EXT-2 fields).

Columns: Severity | Agent | Adherence score (0-100 colour bar) | Acknowledgement

(✓/✗) | SR creation (✓/✗) | Escalation route (✓/✗, red if false) |

Dismissive framing (⚠ if true).

Default sort: adherenceScore ASC (worst first).

Chart C3 above (adherence bucket BarChart).

Boundary note below: "CMS auto-escalation belongs to CMS vendor (IO Directions

2026, 30 Jun 2026). Outside Fluid CX scope."

\#### S5 Recovery Conduct Hub (UC-02 + UC-03)

KPI tiles (4): Critical conduct exceptions (24h) | Distress detected not engaged

(7d) | Non-borrower contact (7d) | Draft framework deadline (1 Jul 2026,

DeadlinePill + "Draft · Proposed").

TAB1 Conduct Violations: RecoveryConductSignal WHERE any flag = true.

Columns: Severity | Agent/Vendor | Product/DPD | Flags \[icon strip with text:

Threat AlertOctagon, Profanity VolumeX, Harassment UserX, Shaming EyeOff,

Non-borrower Users\] | Transcript snippet | Timestamp | Alert status |

"View evidence".

Chart C4 above (14-day stacked BarChart).

TAB2 Distress Engagement: WHERE distressLanguageDetected=true.

Columns: Severity | Agent/Vendor | Product/DPD | Distress markers | Agent

response \[ENGAGED teal / DISMISSED red / SILENT amber, with text\] |

Hardship handoff ("Unknown — CRM not connected" if INT-001 absent).

Chart C5 (PieChart proportions).

\#### S6 Vulnerable Customer Hub (UC-08 + UC-24)

KPI tiles (4): Bereaved calls detected (7d) | Empathy failures general queue (7d)

| Specialist routing triggered (7d) | Deceased compliance deadline (31 Mar 2026

→ "Passed" grey).

TAB1 Bereavement & Deceased Claims:

Columns: Severity | Direction | Agent | Transcript snippet | Empathy score

(0-100 colour bar) | Repeat contact flag (from RepeatContactPattern) |

Settlement status ("Unknown — operations workflow" with BoundaryNote icon) |

Branch note if interactionType='branch_visit'.

Chart C6 (empathy score distribution).

TAB2 Vulnerable on General Queue: InboundQueueSignal joined to CustomerInteractionSignal.

Columns: Severity | Vulnerability type \[pill: Bereavement / Financial distress /

Fraud victim / PwD / MSE\] | Queue name | Agent | Specialist routing recommended

(Yes/No) | Routing outcome ("Unknown — ACD integration required" if INT-007 absent)

| Transcript snippet | Alert link.

Chart C7 (PieChart vulnerability mix).

\#### S7 Vendor Governance Hub (UC-10)

KPI tiles (4): Vendors at 100% Fluid coverage | Below in-house benchmark |

Severe exceptions all vendors (30d) | Outsourcing deadline (10 Apr 2026 → Passed).

Main VendorBPOScore table.

Columns: Vendor name | Vendor type pill | Fluid coverage % (100% teal, <100%

amber) | Conduct score (0-100 colour bar) | Complaint rate/10k | Severe

exceptions/30d | Benchmark vs in-house \[BETTER teal / PARITY grey / WORSE red,

with text\] | Last review | Attestation pack link/Generate.

Sortable: conductScoreOverall ASC (default), complaintRatePer10k.

Click vendor row → accordion expand (obligation score breakdown + C9 sparkline).

Chart C8 horizontal BarChart with in-house ReferenceLine.

Right panel (280px): Attestation Pack generator.

Quarter selector | vendor multi-select | in-house benchmark toggle |

"Generate PDF" → toast + API stub.

"Coming in v2" label on DSA/DMA vendor rows.

\#### S8 RCA & Board Pack Studio (UC-07)

KPI tiles (3): Active rising clusters | Interactions contributing this quarter |

Board pack due (30 Jun 2026, red).

TAB1 Active Clusters: RCACluster table.

Columns: Severity score colour bar | Cluster theme | Conduct theme | Volume |

Trend \[TrendingUp+Rising red / Minus+Stable grey / TrendingDown+Falling green\] |

Key dimension | First detected/Last updated | Board pack toggle | Recommended

remediation (80-char) | "View evidence".

Expanded row: Chart C11 dimension BarChart + evidence items.

Left sidebar (300px desktop): Chart C10 Recharts Treemap.

1 AIInsightCard.

TAB2 Board Pack Builder: boardPackInclusion=true clusters only.

Inline-editable remediation textarea per cluster (state-only).

YoY comparison panel (mock %).

"Export CSCB pack" + "Export top-5 grounds" buttons → toast + API stubs.

Boundary note: "IO independent review is conducted by the Internal Ombudsman.

This pack supports, not replaces, that review."

\#### S9 Bundling & Consent Hub (UC-04)

KPI tiles (3): Bundling violations (7d) | Campaigns with violations |

Obligation effective since (1 Apr 2026, In Force).

65/35 layout. LEFT signal table (bundling_pressure + consent_extraction).

Columns: Severity | Direction | Signal type | Agent/Vendor | Campaign ID | Product

| Transcript snippet | Timestamp | Customer objection present.

RIGHT Chart C12 campaign BarChart with ReferenceLine.

Integration note: "CRM consent flags available when CRM integration is

connected (INT-001)." Amber banner.

Branch precondition note small.

\#### S10 FCR & Repeat-Contact (UC-22)

KPI tiles (4): Repeat contacts 7d | 3+ contacts in 30d | Top repeat issue |

Escalated to RB-IOS (red if >0).

TAB1 By Issue Category: RepeatContactPattern grouped by issueCategory.

Columns: Issue category | Linked obligations pills | Total repeats | Distinct

customers | Avg per customer | Escalation risk \[stage badge with text\] |

Closure clarity score | "View cases".

Chart C13 horizontal BarChart top-10 issues.

TAB2 By Customer: per-pattern. Columns: Customer ID (hashed) | Issue category |

Contact count | Channels (icons) | Agents | First contact | Escalation stage |

Closure clarity | "View journey".

"View journey" → drawer with horizontal timeline of contacts (div-based, each

node clickable to CustomerInteractionSignal).

\#### S11 Regulatory Horizon

KPI tiles (2): Deadlines within 60 days (red if >0) | Obligations not yet

monitored by Fluid CX (future, buildTier != MAIN_FEATURE).

Vertical milestone list with expandable rows.

Per milestone: Date + countdown | Regulation short name + circularRef tooltip |

Linked obligations pills (3 + "+N") | ObligationStatus | ComplianceLabelBadge.

Expanded row: obligation sub-table (oblId, statement, capability label, owner,

exception count).

Filter: "IN_FORCE only" | "Monitored by Fluid CX only".

Note on OBL-022 30 Jun 2026 milestone: "CMS auto-escalation belongs to your CMS

vendor. Outside Fluid CX scope."

\#### S12 Honest-Gap & Integrations

KPI tiles (2): Obligations outside Fluid CX scope | Integrations connected (X of Y).

SECTION A — Capability Boundaries (CapabilityBoundary entity).

Table: Obligation | Why outside scope | Primary control owner |

Display type \[ComplianceLabelBadge derived from displayInDashboard\] |

Linked regulation. NO monitoring CTAs anywhere in this section.

SECTION B — Integration Health (IntegrationDependency entity).

Table: Integration name | System type pill | What it provides |

Obligations unlocked (first 3 pills) | Status \[Connected teal / Partial amber /

Not connected red / Roadmap grey\] | Roadmap target.

Click Connected/Partial row → drawer (which oblIds receive data vs pending).

"Coming in v2" entries for deferred use cases: UC-05, UC-06, UC-13, UC-14,

UC-15, UC-16, UC-18, UC-25, UC-26, UC-27, UC-28, UC-29.

────────────────────────────────────────────────────────────────────────────────

SECTION 9 — CHART SPECIFICATIONS (ALL RECHARTS)

────────────────────────────────────────────────────────────────────────────────

Every chart: wrap in &lt;ResponsiveContainer width="100%" height={N}&gt;, include

&lt;Tooltip /&gt;, aria-label on wrapper div, no raw field names as labels.

C2 LineChart h=80 S4 left sparkline detected/logged/missed (gray/teal/red), 7 days

C3 BarChart h=100 S4 right adherence buckets, fill red/amber/green by range

C4 BarChart h=120 S5 T1 14-day stacked: threat/profanity/harassment/shaming/non-borrower (red/orange/amber/violet/gray) + Legend

C5 PieChart h=160 S5 T2 ENGAGED teal / DISMISSED red / SILENT amber, % labels

C6 BarChart h=100 S6 T1 empathy score buckets (same fill logic as C3)

C7 PieChart h=160 S6 T2 5 vulnerability types, distinct fills

C8 BarChart h=180 S7 horizontal, vendor scores vs in-house ReferenceLine at 81

C9 LineChart h=60 S7 acc. 4-week per-vendor sparkline (render on accordion expand)

C10 Treemap h=300 S8 side clusters sized by volume, coloured by severityScore

C11 BarChart h=120 S8 row horizontal, top-5 dimensionBreakdown entries

C12 BarChart h=140 S9 right campaigns; red fill if >10% threshold; ReferenceLine at threshold

C13 BarChart h=200 S10 T1 horizontal, top-10 issueCategories

Custom non-Recharts visuals: Regulatory Horizon timeline (S0/S2/S11) and

per-customer contact timeline (S10 drawer) implemented with positioned divs.

────────────────────────────────────────────────────────────────────────────────

SECTION 10 — MOCK DATA REQUIREMENTS (SUVARNA BANK)

────────────────────────────────────────────────────────────────────────────────

Bank context: Suvarna Bank, ~600 branches, in-house contact centre + 3 BPO vendors.

VEN-001 Sutherland Chennai BPO_voice 480 agents, score 68

VEN-002 Krescent BPO Pune BPO_voice 220 agents, score 71

VEN-014 Pinnacle Recovery Hyd recovery_agency 95 agents, score 59

In-house benchmark: 81/100.

Products: Cards, PL (Personal Loan), HL (Home Loan), Auto, SavAcct, ULIP, MF, TermDeposit.

Languages: hi, ta, te, kn, mr, en distributed across signals.

Hindi snippet examples (include at least 3):

"agar kal tak nahi diya toh hum aapke office aa jayenge aur sabko bata denge"

"madam, salary account ke saath insurance lena compulsory hai"

"mere husband ka abhi operation hua hai" (paired with agent "Madam EMI toh deni hi padegi")

Include at least 1 Tamil and 1 Kannada signal.

Mock "today" = 2026-05-25 (use this consistently).

Key deadlines (ISO):

2026-03-31 Deceased Customers (PASSED)

2026-04-01 Authentication Directions + IRDAI bancassurance (PASSED)

2026-04-10 IT Outsourcing contract compliance (PASSED)

2026-06-30 IO Directions automated CMS auto-escalation

2026-07-01 RB-IOS 2026 cutover + draft uniform recovery framework

2026-10-01 Cross-border CNP authentication

2027-05-13 DPDP Rules 2025 substantive obligations

Minimum mock record counts:

REGULATIONS×5 OBLIGATIONS×12 CONDUCT_THEMES×8 (all)

INTERACTION_SIGNALS×15 RISK_ALERTS×8 EVIDENCE_ITEMS×6

CONTROL_OWNERS×6 PERSONAS×5 (L1–L5) RCA_CLUSTERS×4

VENDOR_SCORES×3 RECOVERY_SIGNALS×6 COMPLAINT_SIGNALS×6

REPEAT_PATTERNS×4 INBOUND_QUEUE_SIGNALS×4

INTEGRATION_DEPS×6 CAPABILITY_BOUNDARIES×8

Obligations to include (at minimum):

OBL-002 (Cross-sell consent, IN_FORCE, MAIN_FEATURE, L2)

OBL-007 (Recording with prior intimation, DRAFT_PROPOSED, INTEGRATION_DEPENDENT)

OBL-010 (Recovery conduct, DRAFT_PROPOSED, MAIN_FEATURE, L3)

OBL-011 (Borrower distress, DRAFT_PROPOSED, MAIN_FEATURE, L2)

OBL-012 (Graduated escalation, DRAFT_PROPOSED)

OBL-013 (Data minimisation, OUT_OF_SCOPE — NO RiskAlert records)

OBL-020 (Complaint capture, IN_FORCE, MAIN_FEATURE, L3)

OBL-022 (Automated CMS workflow, IN_FORCE, EVIDENCE_ONLY — shown only in S12)

OBL-023 (Quarterly RCA, IN_FORCE)

OBL-024 (Annual top-5 grounds, IN_FORCE)

OBL-027 (Bereaved customer empathy, IN_FORCE, MAIN_FEATURE, L2, branchDependentFlag=true)

OBL-037 (BPO vendor governance, IN_FORCE, MAIN_FEATURE, L4)

Signal types in mock taxonomy:

threat_language, profanity, harassment_pattern, public_shaming,

customer_distress, empathy_failure, bundling_pressure, consent_extraction,

complaint_marker_no_SR, non_borrower_contact, language_mismatch.

Anchor RiskAlerts to include:

ALT-3301 OBL-010 CRITICAL — threat language, AGT-1142, VEN-002 Krescent, 7 occurrences

ALT-3340 OBL-020 HIGH — 12 service calls, no CMS SR

ALT-3372 OBL-011 CRITICAL — distress dismissed, AGT-1342, VEN-001 Sutherland

ALT-3358 OBL-002 HIGH — bundling pressure, campaign C-2026-MAY-04, 38 occurrences

Anchor RCAClusters:

RCA-00012 "Cards cross-sell bundling pressure" THM-01 volume=412 RISING severityScore=78

RCA-00018 "HL document-release delay, Bengaluru" THM-04 volume=64 RISING severityScore=71

RCA-00021 "PL distress dismissal — Sutherland concentration" THM-05 volume=187 RISING severityScore=84

────────────────────────────────────────────────────────────────────────────────

SECTION 11 — UTILITY FUNCTIONS (required exports)

────────────────────────────────────────────────────────────────────────────────

\# signalTypeLabels.js

export const SIGNAL_TYPE_LABELS = {

threat_language: "Threat language",

profanity: "Profanity",

harassment_pattern: "Harassment pattern",

public_shaming: "Public shaming",

customer_distress: "Customer distress",

empathy_failure: "Empathy failure",

bundling_pressure: "Bundling pressure",

consent_extraction: "Consent extraction",

script_deviation: "Script deviation",

complaint_marker_no_SR: "Missed complaint (no SR)",

non_borrower_contact: "Non-borrower contact",

language_mismatch: "Language mismatch",

banned_phrase_penal_interest: "Banned phrase: 'penal interest'",

};

\# deadlineHelpers.js

export const TODAY = new Date("2026-05-25");

export function daysRemaining(isoDate) // returns integer (negative = past)

export function relativeTime(isoTs) // returns "3 days ago", "2h ago", etc.

export function deadlineColour(days) // returns 'red'|'amber'|'blue'|'gray'

\# applyFilters.js

export function applyFilters(items, filters) // pure; returns new array

\# deriveInsights.js

export function deriveTopSignalInsight(signals, obligationId)

export function deriveVendorInsight(vendorScores)

export function deriveClusterInsight(clusters)

export function deriveComplaintInsight(complaintSignals)

// All derive from mock arrays. Never return hardcoded prose.

\# assembleEvidence.js

export function assembleEvidencePackage(alertId, allData)

// Returns { alert, relatedSignals, evidence, obligation, regulation, owner,

// spineNodes, isBoundaryCase, isIntegrationCase }

\# getIntegrationStatus.js

export function getIntegrationStatus(obligationId, deps) // → dep | null

\# getBoundary.js

export function getBoundary(obligationId, boundaries) // → boundary | null

────────────────────────────────────────────────────────────────────────────────

SECTION 12 — FUTURE API STUBS (grep prefix: "// TODO: FluidCX API")

────────────────────────────────────────────────────────────────────────────────

Place exactly in these locations:

\# PersonaContext.jsx (user auth)

// TODO: FluidCX API — const user = await FluidCX.getCurrentUser();

// setActivePersonaId(user.personaId);

\# data/mockInteractionSignals.js (top of file)

// TODO: FluidCX API — Replace INTERACTION_SIGNALS const with:

// const res = await FluidCX.getSignals({ obligationIds, dateRange, personaId });

\# components/shared/TranscriptSnippet.jsx (Play button onClick)

// TODO: FluidCX API — FluidCX.playRecording(interactionId, { startOffsetSeconds });

\# components/screens/S4_MissedComplaintHub.jsx (Force-create SR button, DISABLED in mock)

// TODO: FluidCX API — FluidCX.createCMSRecord({ signalId, category, agentId });

// Currently disabled because Fluid does not own CMS workflow.

\# components/screens/S7_VendorGovernance.jsx (Generate attestation pack button)

// TODO: FluidCX API — FluidCX.generateAttestationPack({

// vendorIds, quarter, includeInhouseBenchmark });

\# components/screens/S8_RCABoardPack.jsx (Export CSCB pack button)

// TODO: FluidCX API — FluidCX.exportCSCBPack({ clusterIds, quarter, annotations });

\# components/shared/FilterPanel.jsx (onChange handler)

// TODO: FluidCX API — FluidCX.saveUserPreferences({ filters });

────────────────────────────────────────────────────────────────────────────────

SECTION 13 — RESPONSIVE RULES

────────────────────────────────────────────────────────────────────────────────

Use Tailwind responsive prefixes (sm: md: lg: xl:) throughout.

Desktop (lg+):

SideNav 200px expanded. EvidenceDrawer 480px right overlay. All table columns

visible. FilterPanels as side rails.

Tablet (md to lg):

SideNav 64px icon-only. Tables horizontally scrollable (overflow-x-auto).

EvidenceDrawer becomes 80vh bottom sheet.

Mobile (<md):

SideNav hidden. Bottom tab bar (5 items: Landing / Worklist / Themes / Vendor /

Honest-Gap). Tables collapse to card-per-row format (key fields only +

"Expand" button). EvidenceDrawer full-screen modal.

S0 mobile: 2-col KPI grid, top-3 alerts only, "View all" link, deadline band

as horizontal scroll strip.

────────────────────────────────────────────────────────────────────────────────

SECTION 14 — ACCESSIBILITY

────────────────────────────────────────────────────────────────────────────────

\- Every badge renders colour + text label. Never colour alone.

\- All icon-only buttons have aria-label.

\- EvidenceDrawer is keyboard-trapped while open (Tab cycles inside; Esc closes).

\- Tables: role="table", proper &lt;th scope&gt;, aria-sort on sortable columns updates

on click.

\- Charts: aria-label on wrapper div (e.g. "Vendor conduct scores").

\- EmptyState components always render a named message (no blank states allowed).

\- Focus ring: ring-2 ring-offset-2 ring-blue-500 on all interactive elements.

\- Minimum text-xs for badges, text-sm for body.

────────────────────────────────────────────────────────────────────────────────

SECTION 15 — CODE QUALITY

────────────────────────────────────────────────────────────────────────────────

\- One default export per file. Named exports for utility functions only.

\- No prop drilling beyond 2 levels. Use PersonaContext for cross-screen state.

\- All filtering through applyFilters() — no filter logic duplicated in screens.

\- Badge/label mappings live in their badge components, not inline in screens.

\- Chart data derived from mock arrays — no data hardcoded inside chart JSX.

\- API stubs prefixed "// TODO: FluidCX API" so grep finds every one.

\- Handle nullable fields with optional chaining and ?? fallbacks.

\- Sort functions return new arrays; do not mutate mock data.

\- No console.error suppression. No try/catch swallowing.

\================================================================================

END OF CURSOR BUILD PROMPT — Pass Opus 7v2

\================================================================================