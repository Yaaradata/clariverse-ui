\================================================================================

CURSOR BUILD PROMPT

Project: Fluid CX — RBI Conduct Intelligence Add-On

Version: Pass 7v2

\================================================================================

You are building a polished React (JSX) + Tailwind CSS dashboard module called

"RBI Conduct Intelligence" as an add-on inside the existing Fluid CX platform.

Build exactly what is specified below. Do not add features not listed.

Do not remove any specified feature.

────────────────────────────────────────────────────────────────────────────────

SECTION 0 — PREVIEW / ARTIFACT COMPATIBILITY

────────────────────────────────────────────────────────────────────────────────

The main module must also run as a single-file React artifact in Claude.ai for

preview. Keep all dependencies to the libraries listed (Recharts, lucide-react).

No browser storage. Default export the main module. All mock data must be inline

in the artifact file or in a sibling mockData.js that the main file imports.

When building for Cursor (multi-file), use the full directory structure below.

When the single-file artifact is requested, collapse everything into one file

with all mock data at the top and all components below it.

────────────────────────────────────────────────────────────────────────────────

SECTION 1 — TECH CONSTRAINTS (NON-NEGOTIABLE)

────────────────────────────────────────────────────────────────────────────────

\- React (JSX), functional components + hooks only. No class components.

\- Tailwind CSS core utility classes only. No compiler-derived or custom classes.

Compatible with Claude Artifacts preview AND standard React/Vite/Next.js.

\- Recharts for ALL charts. No other charting library.

\- lucide-react for ALL icons. No other icon library.

\- Mock data only. No fetch(), no axios, no API calls of any kind.

\- No localStorage, no sessionStorage, no cookies, no IndexedDB.

\- No Redux, no Zustand, no MobX. One React Context only (PersonaContext).

\- shadcn/ui patterns are acceptable conceptually but do not import from

@shadcn/ui unless you are certain it is available in the target environment.

Implement cards, badges, and drawers with plain Tailwind instead.

────────────────────────────────────────────────────────────────────────────────

SECTION 2 — PRODUCT BOUNDARY (MUST ENFORCE IN CODE AND UI)

────────────────────────────────────────────────────────────────────────────────

Fluid CX is a CONVERSATION INTELLIGENCE layer. It reads and analyses recorded

customer interactions. It does NOT:

\- Run CMS (complaint management system) workflow or write SR records.

\- Replace the Internal Ombudsman's independent judgment.

\- Generate or send core-banking transaction alerts.

\- Make fraud-authentication decisions or access authentication metadata.

\- Execute refund or credit-shadow workflows.

\- Audit UI/UX dark patterns in digital journeys.

\- Enforce data-governance or DPDP access controls.

\- Provide legal or compliance judgment.

These items appear ONLY as:

\- Small "boundary note" UI components (BoundaryNote) with a named partner owner.

\- Integration dependency banners (amber) where Fluid co-controls with a partner system.

\- "Coming in v2" labels in S12 for deferred integrations.

\- NEVER as main features, main CTAs, or primary dashboard content.

Enforce in data shape:

\- ComplaintCaptureSignal.cmsSrCreatedFlag is READ-ONLY. The "Force-create SR"

button in S4 renders as DISABLED with tooltip: "SR creation is managed by

your CMS. Fluid feeds discovered complaints to CMS."

\- FraudDisputeSignal.weakAuthSignalPresent is partner-fed (null in mock).

Never show a value Fluid computed for this field.

\- OUT_OF_SCOPE obligations never generate RiskAlert records in mock data.

\- buildTier is an internal field. It is NEVER rendered as text in the UI.

It is only used to derive ComplianceLabelBadge display (see Section 7).

────────────────────────────────────────────────────────────────────────────────

SECTION 3 — DIRECTORY STRUCTURE

────────────────────────────────────────────────────────────────────────────────

src/

modules/

RBIConductIntelligence/

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

TopNav.jsx

SideNav.jsx

PersonaSwitcher.jsx

DeadlineHorizonBand.jsx

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

────────────────────────────────────────────────────────────────────────────────

SECTION 4 — PRODUCT SPINE (EVERY SCREEN MUST EXPRESS THIS)

────────────────────────────────────────────────────────────────────────────────

Every screen renders the product logic in this order:

Regulation → Obligation → Customer Interaction Signal → Control Owner →

Evidence → Recommended Action

The SpineStrip shared component renders this as 6 labelled chips connected by

ChevronRight icons. It appears in:

\- EvidenceDrawer (always, at top)

\- S3 ObligationDetail header

\- S0 Landing (condensed, as a tagline strip)

────────────────────────────────────────────────────────────────────────────────

SECTION 5 — NAVIGATION MODEL

────────────────────────────────────────────────────────────────────────────────

The parent Fluid CX shell owns URL routing. This module is URL-less internally.

Navigation is driven by activeScreen state in PersonaContext.

Screen keys:

'landing' | 'worklist' | 'themes' | 'obligation-detail' |

'missed-complaint' | 'recovery-conduct' | 'vulnerable-customer' |

'vendor-governance' | 'rca-board-pack' | 'bundling-consent' |

'repeat-contact' | 'regulatory-horizon' | 'honest-gap'

SideNav: fixed left rail. Desktop: 200px expanded (icon + label). Tablet: 64px

icon-only. Mobile: hidden, replaced by a bottom tab bar showing 5 key screens

(Landing, Worklist, Themes, Vendor, Honest-Gap).

PersonaSwitcher: L1–L5 chips in TopNav. Switching persona re-filters KPI tiles,

queue, and obligation lists within each screen — it does NOT change which screen

is active and does NOT hide any screens.

Drill-down navigation:

ObligationRow click → navigate('obligation-detail', oblId)

Theme tile click → local drill within S2 (useState, not global navigate)

Vendor row click → accordion expand in S7 (local useState)

Any alert row / signal → openDrawer(alertId) — slides EvidenceDrawer from right

────────────────────────────────────────────────────────────────────────────────

SECTION 6 — PERSONA CONTEXT (PersonaContext.jsx)

────────────────────────────────────────────────────────────────────────────────

State managed in context:

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

direction: string|null // "INBOUND"|"OUTBOUND"|null

}

Functions:

navigate(screen, oblId?) // sets activeScreen + optionally selectedObligationId

openDrawer(alertId) // sets drawerOpen=true + drawerAlertId

setActivePersonaId(id)

setGlobalFilters(partialUpdate)

Export hook: export const usePersona = () => useContext(PersonaContext)

────────────────────────────────────────────────────────────────────────────────

SECTION 7 — SHARED COMPONENT SPECS

────────────────────────────────────────────────────────────────────────────────

KPICard

Props: label, value, delta?, deltaDir?('up'|'down'|'neutral'), severity?

('red'|'amber'|'green'|'neutral'), tooltip?, onClick?

Style: white card, rounded-xl, shadow-sm, border-l-4 coloured by severity.

Tooltip on hover (title attribute or small popover). Keyboard focusable.

Empty: renders "—" when value is null/undefined.

SeverityBadge

Props: severity ('CRITICAL'|'HIGH'|'MEDIUM'|'LOW')

ALWAYS renders colour + text (never colour alone — accessibility requirement).

CRITICAL → bg-red-100 text-red-800 ring-1 ring-red-300, label "Critical"

HIGH → bg-orange-100 text-orange-800, label "High"

MEDIUM → bg-yellow-100 text-yellow-800, label "Medium"

LOW → bg-gray-100 text-gray-600, label "Low"

ComplianceLabelBadge ← THE MOST IMPORTANT BADGE. RAW TIERS NEVER SHOWN.

Props: buildTier (internal value, never rendered)

Mapping (buildTier → business label → style):

MAIN_FEATURE → "Monitored by Fluid CX" bg-teal-600 text-white px-2 py-0.5 rounded-full text-xs

INTEGRATION_DEPENDENT→ "Monitored with system integration" border border-teal-600 text-teal-700 bg-white px-2 py-0.5 rounded-full text-xs

EVIDENCE_ONLY → "Evidence support only" border border-gray-400 text-gray-600 bg-white px-2 py-0.5 rounded-full text-xs

OUT_OF_SCOPE → "Outside Fluid CX scope" bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs + Lock icon (lucide Lock size 10)

ObligationStatus badge:

IN_FORCE → bg-blue-800 text-white text-xs rounded px-1.5 py-0.5 "In Force"

DRAFT_PROPOSED → border border-amber-500 text-amber-700 bg-amber-50 text-xs rounded px-1.5 py-0.5 "Draft · Proposed"

AlertStatus badge:

OPEN → bg-red-100 text-red-800 "Open"

IN_REVIEW → bg-yellow-100 text-yellow-800 "In Review"

ACTIONED → bg-green-100 text-green-800 "Actioned"

CLOSED → bg-gray-100 text-gray-600 "Closed"

ESCALATED_TO_IO → bg-purple-100 text-purple-800 "Escalated to IO"

DeadlinePill

Props: date (ISO string), label

daysRemaining = daysBetween(today, date). Use a fixed reference of 2026-05-25

as "today" in mock mode so deadlines render consistently.

past → text-gray-400 "Passed" (date shown)

0–60 days → ring-2 ring-red-500 text-red-700 "Xd" + label

61–180 days → ring-2 ring-amber-400 text-amber-700 "Xd" + label

\>180 days → ring-2 ring-blue-400 text-blue-700 "Xd" + label

BoundaryNote

Props: reason, primaryControlOwner, displayType

DO_NOT_BUILD_BANNER → red-outlined div, Lock icon, "Outside Fluid CX scope.

\[primaryControlOwner\] owns this control."

EVIDENCE_ONLY_CARD → grey-outlined div, Info icon, "Evidence support only.

Fluid CX provides evidence context; \[primaryControlOwner\]

holds the primary control."

HONEST_GAP_SHELF → amber-outlined div, AlertTriangle icon,

"Acknowledged gap: \[reason\]"

AIInsightCard

Props: headline, detail, signalTaxonomy (string\[\]), linkTo?

Style: soft indigo-50 bg, rounded-xl, left border indigo-400, Sparkles icon.

Renders a pill per signalTaxonomy term (max 3 shown + "+N" if more).

Generated by deriveInsights.js functions — never hardcoded prose.

SpineStrip

Props: regulation, obligation, signalSummary, owner, evidenceSummary,

recommendedAction

Horizontal row of 6 chips: each labelled, connected by ChevronRight icons.

Compact on mobile (collapses to vertical list).

OwnerChip

Props: roleTitle, lineOfDefence ('1LoD'|'2LoD'|'3LoD')

Small grey pill. lineOfDefence as subscript text.

TranscriptSnippet

Props: snippet, language, signalType, timestamp

Monospace font, bg-gray-50 rounded, border-l-2 border-gray-300.

Language tag prefix: "\[hi\]", "\[ta\]", "\[en\]" etc.

120-char truncation with "Show more" expand toggle.

"Play clip" button (lucide Play icon) → onClick shows alert/toast:

"Recording player connects via Fluid CX integration.

// TODO: FluidCX API — FluidCX.playRecording(interactionId)"

EvidenceDrawer

Right-side slide panel, 480px, z-50, overlay (does not push content).

Keyboard-trapped while open. Esc closes. Click-outside closes.

Assembles content via assembleEvidence.js (see Section 10).

Sections: SpineStrip | Signals list (TranscriptSnippet per signal) |

Evidence items | Recommended action card | Boundary/integration note.

CTA buttons (mock): "Mark actioned", "Add note" — show console.log + toast.

"Escalate to IO" button renders but is labelled:

"IO review is conducted by the Internal Ombudsman — not Fluid CX."

EmptyState

Props: message, icon? (lucide component)

Centred, text-gray-400, icon above message. Every data section must define its

specific empty message — no generic "No data" allowed.

FilterPanel

Props: filters (from context), onChange, variant ('panel'|'inline')

'panel': 240px right rail with section headers.

'inline': compact chip row above tables.

Filters: severity (multi-checkbox), status (multi-checkbox), themeIds

(multi-checkbox, 8 themes), dateRange (from/to date inputs), businessLine

(dropdown), vendorId (searchable dropdown), direction (INBOUND/OUTBOUND toggle).

All filtering is client-side via applyFilters.js.

DeadlineHorizonBand

Full-width sticky top strip showing 7 key deadlines as milestone pills.

31 Mar 2026 | 1 Apr 2026 | 10 Apr 2026 | 30 Jun 2026 | 1 Jul 2026 |

1 Oct 2026 | 13 May 2027

Each pill uses DeadlinePill component. Scrollable horizontally on mobile.

"Today" marker at 2026-05-25.

────────────────────────────────────────────────────────────────────────────────

SECTION 8 — SCREEN-BY-SCREEN SPECIFICATIONS

────────────────────────────────────────────────────────────────────────────────

Build these 13 screens. Each screen is one JSX file in components/screens/.

──── S0: Persona-Aware Landing ────

KPI tiles (3): "Interactions analysed today" (42,318 · 100% coverage, teal),

"Open critical alerts" (count from RISK_ALERTS severity=CRITICAL status=OPEN,

red if >0), "RB-IOS exposure — cases at risk" (alerts where boardPackInclusion=

true and status=OPEN, amber).

Body: DeadlineHorizonBand at top (sticky). Persona greeting strip:

"Good morning — \[persona.realWorldTitles\[0\]\], Suvarna Bank".

Two-column layout (60/40): left = condensed alert table (5 rows max, columns:

Severity|Alert title|Obligation|Age|Status, "View all" → S1). Right = 8-theme

heat grid (4×2 desktop, 2×4 mobile scroll; each tile: theme name, exception

count, trend arrow using TrendingUp/Minus/TrendingDown lucide icons).

Two AIInsightCards below grid.

PersonaSwitcher chips (L1–L5) in TopNav. Switching re-filters queue and tiles.

Mobile: stacked, KPI tiles 2-col grid, queue top-3 only.

──── S1: My Worklist ────

KPI tiles (4): Critical open, High open, Actioned today, Escalated to IO.

Full-width alert table from RISK_ALERTS. Columns: Severity \[SeverityBadge\] |

Alert title | Obligation \[OBL-NNN pill + ComplianceLabelBadge + ObligationStatus\]

| Theme | Affected (agentIds/vendorIds, max 2 + "+N") | First seen (relative) |

Occurrences | Status \[AlertStatus badge\] | Actions ("View Evidence" button).

Default sort: severity DESC then firstObservedTs ASC.

Row click or "View Evidence" → openDrawer(alertId).

FilterPanel (right rail, 'panel' variant). All globalFilters apply.

Sortable columns: severity, firstObservedTs, occurrenceCount.

Empty: "No alerts match your filters. Adjust filters or check back after the

next analysis run."

──── S2: Conduct Themes Index ────

KPI tiles (3): Themes with critical exceptions | Obligations monitored by

Fluid CX (count where buildTier=MAIN_FEATURE, shown as "13 of 38") |

Next hard deadline (nearest future effectiveDate, coloured pill).

8-theme tile grid (4×2). Each tile: themeName, themeDefinition (1 line),

obligationCount, exception count (sum of open RiskAlerts for theme's oblIds),

trend arrow. Tile border-colour = highest severity open alert for that theme.

Click theme tile → drill to theme obligation list (breadcrumb updates, local

useState in S2). Obligation list shows ObligationRow per obligation.

Collapsible "Regulatory Horizon" panel below grid (auto-expand if nearest

deadline < 60 days). Horizontal milestone timeline (custom div-based, not

Recharts). Each milestone is a DeadlinePill linked to obligation count.

1 AIInsightCard: fastest-rising cluster from RCA_CLUSTERS.

Filter chips above grid: "Themes with critical alerts only" toggle | "My themes"

toggle (filters to persona's primaryObligationIds theme membership).

──── S3: Obligation Detail ────

Obligation identity strip (full width): oblId | obligationStatement |

ObligationStatus badge | ComplianceLabelBadge | DeadlinePill | exception count.

SpineStrip below identity strip.

If buildTier = OUT_OF_SCOPE: replace body with full-width BoundaryNote (DO_NOT_

BUILD_BANNER type). No signal table rendered.

If buildTier = INTEGRATION_DEPENDENT: amber integration banner above signal table

showing externalSystemName and currentlyIntegratedFlag.

If branchDependentFlag = true: small grey note "Branch recording required for

full coverage of this obligation."

Signal feed table (entity: CustomerInteractionSignal filtered to oblId).

Columns: Severity | Direction \[INBOUND/OUTBOUND pill\] | Signal type (human label

from SIGNAL_TYPE_LABELS) | Channel (icon+text) | Agent/Vendor | Transcript

snippet | Timestamp | "View evidence" link.

Filters inline above table: Direction toggle | Severity multi-select | Channel

chips | Date range.

EvidenceItem table below signal table: Evidence type pill | Why it is evidence |

Audit-ready badge ("Audit-ready" teal or "Pending review" grey) | Audit trail ID

| Download placeholder button.

Signal volume sparkline (30-day BarChart, right panel, narrow).

1 AIInsightCard: top signal for this obligation.

──── S4: Missed-Complaint Hub ────

UC-01 + UC-23. Left/right 50/50 layout on desktop, stacked on mobile.

KPI tiles (4): Complaints detected not in CMS (last 24h, red if >0) |

CMS gap rate last 7 days (%) | First-90s adherence score today (mean of

firstNinetySecondsAdherenceScore, red &lt;60%, amber 60–80%, green &gt;80%) |

Escalation route disclosed % (escalationRouteDisclosedFlag=true / total).

LEFT PANEL — Missed-Complaint Feed (UC-01):

Entity: ComplaintCaptureSignal where cmsSrCreatedFlag=false.

Columns: Severity | Channel (icon+text) | Complaint type (human label) |

Product | Agent/Vendor | Transcript snippet | Gap to SR (null="No SR" red pill,

else hours) | Presumed RBI category | "Force-create SR" (DISABLED button with

tooltip: "SR creation is managed by your CMS. Fluid feeds discovered complaints

to CMS. // TODO: FluidCX API").

Chart C2 above: 7-day LineChart (detected vs logged vs missed). See Section 9.

RIGHT PANEL — First-90-Seconds Adherence (UC-23):

Entity: ComplaintCaptureSignal (EXT-2 fields).

Columns: Severity | Agent | Adherence score (0-100 score + colour bar) |

Acknowledgement (✓/✗ + Yes/No text) | SR creation language (✓/✗) |

Escalation route disclosed (✓/✗, highlighted red if false) |

Dismissive framing (⚠ + Yes if true).

Default sort: adherenceScore ASC (worst first).

Chart C3 above: adherence score distribution BarChart.

Boundary note below both panels (small, grey):

"Fluid CX feeds CMS with discovered complaints. CMS auto-escalation to IO is

managed by your CMS vendor (IO Directions 2026, 30 Jun 2026 deadline).

Outside Fluid CX scope."

──── S5: Recovery Conduct Hub ────

UC-02 + UC-03. Two tabs: "Conduct Violations" (default) | "Distress Engagement".

KPI tiles (4): Critical conduct exceptions (last 24h) | Distress detected not

engaged (last 7d) | Non-borrower contact incidents (last 7d, red if >0) |

Draft framework deadline (1 Jul 2026, DeadlinePill + "Draft · Proposed" badge).

TAB 1 — Conduct Violations:

Entity: RecoveryConductSignal where any of (threatFlag|profanityFlag|

harassmentFlag|shamingFlag|nonBorrowerContactFlag)=true.

Columns: Severity | Agent / Vendor | Product / DPD bucket |

Flags \[icon strip — only active flags shown, each with icon+text label:

Threat (AlertOctagon), Profanity (VolumeX), Harassment (UserX),

Shaming (EyeOff), Non-borrower (Users) — all from lucide-react\] |

Transcript snippet | Timestamp | Alert status | "View evidence".

Chart C4 above: 14-day stacked BarChart by flag type.

TAB 2 — Distress Engagement:

Entity: RecoveryConductSignal where distressLanguageDetected=true.

Columns: Severity | Agent / Vendor | Product / DPD bucket |

Distress markers (transcript snippet) | Agent response \[engagement badge:

ENGAGED=teal, DISMISSED=red, SILENT=amber, each with text\] |

Hardship handoff (if CRM integrated via INT-001; else "Unknown — CRM not

connected" grey note).

Chart C5: Recharts PieChart — ENGAGED/DISMISSED/SILENT proportions.

──── S6: Vulnerable Customer Hub ────

UC-08 + UC-24. Two tabs: "Bereavement & Deceased Claims" | "Vulnerable on

General Queue".

KPI tiles (4): Bereaved-customer calls detected (7d) | Empathy failures on

general queue (7d) | Specialist routing triggered (7d, note "Requires ACD

integration" if INT-007 not connected) | Deceased customers compliance deadline

(31 Mar 2026 → "Passed" grey pill).

TAB 1 — Bereavement & Deceased Claims:

Entity: CustomerInteractionSignal where signalType contains 'empathy_failure'

or transcriptSnippet contains bereavement markers.

Columns: Severity | Direction | Agent | Transcript snippet |

Empathy score (0–100 colour bar) | Repeat contact flag (from RepeatContactPattern

— "Called back X times in 7 days" if pattern exists) | Settlement status

("Unknown — operations workflow" with BoundaryNote icon) |

Branch-dependent note if interactionType='branch_visit'.

Chart C6: empathy score distribution BarChart.

TAB 2 — Vulnerable on General Queue:

Entity: InboundQueueSignal joined to CustomerInteractionSignal.

Columns: Severity | Vulnerability type \[pill per type: Bereavement/Financial

distress/Fraud victim/PwD/MSE\] | Queue name | Agent |

Specialist routing recommended (Yes/No pill) |

Routing outcome ("Unknown — ACD integration required" note if INT-007 not live) |

Transcript snippet | Alert link.

Chart C7: PieChart — vulnerability type proportions.

──── S7: Vendor Governance Hub ────

UC-10. KPI tiles (4): Vendors at 100% Fluid coverage | Vendors below in-house

benchmark | Severe exceptions all vendors (30d) |

Outsourcing compliance deadline (10 Apr 2026 → "Passed" grey pill).

Main vendor table from VENDOR_SCORES:

Columns: Vendor name | Vendor type \[pill: BPO Voice/Recovery Agency/DSA/DMA\] |

Fluid coverage % (100% = teal, <100% = amber) | Conduct score \[0–100 + colour

bar: &lt;60 red, 60–75 amber, &gt;75 green\] | Complaint rate/10k |

Severe exceptions/30d | Benchmark vs in-house \[BETTER/PARITY/WORSE — each as

coloured pill+text\] | Last review date | Attestation pack \[link or "Generate"\].

Sortable: conductScoreOverall ASC (default), complaintRatePer10k.

Click vendor row → accordion expands below row (not new screen): obligation-score

breakdown table (OBL-NNN | obligation statement | score | in-house avg delta).

Per-vendor score trend sparkline (LineChart, 4-week mock).

Chart C8: horizontal BarChart comparing all vendor scores vs in-house average.

Right panel (280px): Attestation Pack generator.

Quarter selector, vendor multi-select, in-house benchmark toggle.

"Generate PDF attestation pack" button → console.log + toast: "Attestation

pack export: Fluid CX API — // TODO: FluidCX API FluidCX.generateAttestationPack()"

"Coming in v2" label on DSA/DMA vendor type rows.

──── S8: RCA & Board Pack Studio ────

UC-07. KPI tiles (3): Active rising clusters (boardPackInclusion=true, RISING) |

Interactions contributing current quarter | Board pack due (30 Jun 2026, red).

Two tabs: "Active Clusters" (default) | "Board Pack Builder".

TAB 1 — Active Clusters:

Table from RCA_CLUSTERS. Columns: Severity score \[colour bar 0–100\] |

Cluster theme | Conduct theme | Volume | Trend \[TrendingUp+Rising red /

Minus+Stable grey / TrendingDown+Falling green\] |

Key dimension (top entry from dimensionBreakdown) | First detected / Last updated

| Board pack inclusion \[checkbox styled as toggle\] | Recommended remediation

(80-char truncated) | "View evidence" link.

Expanded row: Chart C11 (dimension breakdown horizontal BarChart) + evidence

items.

Left sidebar (300px on desktop): Chart C10 Recharts Treemap (clusters sized by

volume, coloured by severityScore).

1 AIInsightCard: fastest-rising cluster.

TAB 2 — Board Pack Builder:

boardPackInclusion=true clusters only.

Inline-editable remediation field per cluster (textarea, mock save to state).

Year-on-year comparison panel (mock: show % change vs prior quarter numbers).

"Export CSCB pack" button → toast: "Board pack export is a Fluid CX API feature.

// TODO: FluidCX API FluidCX.exportCSCBPack()"

"Export top-5 grounds" button → same pattern.

Boundary note: "IO independent review is conducted by the Internal Ombudsman.

This pack supports, not replaces, that review."

──── S9: Bundling & Consent Hub ────

UC-04. KPI tiles (3): Bundling violations detected (7d) |

Campaigns with violations | Obligation effective since (1 Apr 2026, In Force).

Two-column layout 65/35.

Left: signal table from INTERACTION_SIGNALS where signalType='bundling_pressure'

or 'consent_extraction'. Columns: Severity | Direction | Signal type |

Agent/Vendor | Campaign ID (from linked alert.affectedCampaignIds) | Product |

Transcript snippet | Timestamp | Customer objection present (Yes/No).

Right: Chart C12 campaign bundling BarChart.

Integration note: "CRM consent flags available when CRM integration is connected

(INT-001)." Small amber banner.

Branch-dependent note: "Branch-channel cross-sell monitoring requires branch

recording."

──── S10: FCR / Repeat-Contact Module ────

UC-22. KPI tiles (4): Repeat contacts 7d (2+ contacts same issue) |

Customers with 3+ contacts 30d | Top repeat issue (issueCategory by volume) |

Escalated to RB-IOS (escalationStage='RBIOS_escalated', red if >0).

Two tabs: "By Issue Category" (default) | "By Customer".

TAB 1: Aggregated RepeatContactPattern grouped by issueCategory.

Columns: Issue category | Linked obligations \[pills\] | Total repeat contacts |

Distinct customers | Avg contacts per customer |

Escalation risk \[stage badge: inbound_repeat=grey, complaint_filed=amber,

IO_referred=orange, RBIOS_escalated=red, each with text\] |

Closure clarity score (avg, 0-100 colour bar) | "View cases" link.

Chart C13: horizontal BarChart top-10 issues by repeat contact volume.

TAB 2: Per-customer. Columns: Customer ID (hashed) | Issue category |

Contact count | Channels used (icons) | Agents (first 2 + "+N") |

First contact | Escalation stage | Closure clarity | "View journey" link.

"View journey" → drawer with per-customer timeline (custom div-based horizontal

timeline, each contact as a node: channel icon + agent + date). Each node

links to CustomerInteractionSignal transcript.

──── S11: Regulatory Horizon ────

KPI tiles (2): Deadlines within 60 days (red if >0) |

Obligations not yet monitored by Fluid CX (buildTier != MAIN_FEATURE, future).

Full-width vertical milestone list. Per milestone:

Date + countdown badge | Regulation short name + circularRef (tooltip) |

Linked obligations (OBL pills, max 3 + "+N") | ObligationStatus badge |

ComplianceLabelBadge per obligation.

Expandable row: obligation sub-table (oblId, statement, buildTier label, owner

role, open exception count).

Filter: IN_FORCE only toggle | "Monitored by Fluid CX only" toggle.

Note on OBL-022 milestone (30 Jun 2026): "CMS auto-escalation deadline belongs

to your CMS vendor. Outside Fluid CX scope."

──── S12: Honest-Gap & Integrations ────

KPI tiles (2): Obligations outside Fluid CX scope (count) |

Integrations connected (X of Y).

Two sections separated by divider:

SECTION A — Capability Boundaries (CapabilityBoundary entity):

Table: Obligation | Why outside scope | Primary control owner |

Display type \[ComplianceLabelBadge via displayInDashboard mapping\] |

Linked regulation.

No signal tables, no monitoring features, no CTAs for these items.

SECTION B — Integration Health (IntegrationDependency entity):

Table: Integration name | System type \[pill\] | What it provides |

Obligations unlocked (first 3 pills) |

Status \[Connected teal / Partial amber / Not connected red / Roadmap grey\] |

Roadmap target.

Click Connected/Partial row → drawer: which obligationIds receive data vs pending.

Click Roadmap row → tooltip: "Contact your Fluid CX account team to expedite."

All deferred v2 use cases shown here as "Coming in v2" grey entries:

UC-05, UC-06, UC-13, UC-14, UC-15, UC-16, UC-18, UC-25, UC-26, UC-27, UC-28,

UC-29.

────────────────────────────────────────────────────────────────────────────────

SECTION 9 — CHART SPECIFICATIONS (ALL RECHARTS)

────────────────────────────────────────────────────────────────────────────────

ALL charts: wrap in &lt;ResponsiveContainer width="100%" height={N}&gt;.

ALL charts: include &lt;Tooltip /&gt;.

ALL charts: aria-label on the wrapper div.

C2 — CMS Gap Trend (S4 left, height=80):

&lt;LineChart&gt; data=7 days \[{day, detected, logged, missed}\]

Lines: detected (stroke="#9ca3af"), logged (stroke="#0d9488"), missed (stroke="#ef4444")

No axes labels — sparkline style.

C3 — First-90s Adherence Distribution (S4 right, height=100):

&lt;BarChart&gt; data=\[{bucket:"0–20",count:4},{bucket:"21–40",count:9},

{bucket:"41–60",count:18},{bucket:"61–80",count:31},{bucket:"81–100",count:22}\]

Fill: 0–60 buckets="#ef4444", 61–80="#f59e0b", 81–100="#10b981"

C4 — Recovery Violation Trend (S5, height=120):

&lt;BarChart&gt; stacked, 14 days, dataKeys: threat/profanity/harassment/shaming/

nonBorrower. Colors: threat="#ef4444", profanity="#f97316", harassment="#f59e0b",

shaming="#8b5cf6", nonBorrower="#6b7280". Show &lt;Legend /&gt;.

C5 — Distress Engagement Pie (S5 Tab 2, height=160):

&lt;PieChart&gt;&lt;Pie dataKey="value" label={({name,percent})=&gt;name+' '+Math.round(percent\*100)+'%'}>

Data: \[{name:"Engaged",value:22,fill:"#0d9488"},{name:"Dismissed",value:14,fill:"#ef4444"},

{name:"Silent",value:8,fill:"#f59e0b"}\]

C6 — Empathy Score Distribution (S6 Tab 1, height=100): Same structure as C3.

C7 — Vulnerable Signal Mix Pie (S6 Tab 2, height=160):

Data: \[{name:"Bereavement",value:11,fill:"#8b5cf6"},{name:"Financial distress",

value:34,fill:"#ef4444"},{name:"Fraud victim",value:8,fill:"#f97316"},

{name:"PwD",value:3,fill:"#6b7280"},{name:"MSE",value:6,fill:"#0d9488"}\]

C8 — Vendor Score Comparison (S7, height=180):

&lt;BarChart layout="vertical"&gt; vendors on Y-axis, score on X-axis 0–100.

Two bars per vendor: score (coloured by benchmark: BETTER=#10b981, PARITY=

#6b7280, WORSE=#ef4444) + in-house reference bar (#9ca3af dashed).

&lt;ReferenceLine x={81} stroke="#1e40af" strokeDasharray="4 4" label="In-house avg"/&gt;

C9 — Per-Vendor Score Trend (S7 accordion, height=60):

&lt;LineChart&gt; 4-week sparkline. Mock data inline per vendor.

C10 — RCA Treemap (S8 left panel, height=300):

&lt;Treemap dataKey="size" data=RCA_CLUSTERS.map(c=&gt;({name:c.clusterTheme,

size:c.volume,severityScore:c.severityScore})) aspectRatio={4/3}

Fill computed: severityScore>75="#ef4444", 50–75="#f97316", <50="#f59e0b"

C11 — Cluster Dimension Breakdown (S8 expanded row, height=120):

&lt;BarChart layout="vertical"&gt; top 5 dimensionBreakdown entries.

C12 — Campaign Bundling (S9 right panel, height=140):

&lt;BarChart&gt; campaigns on X, count on Y. Red fill if count >10% threshold.

&lt;ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 2" label="10% threshold"/&gt;

C13 — Repeat-Contact Issue Volume (S10, height=200):

&lt;BarChart layout="vertical"&gt; top 10 issueCategories by contactCountInWindow.

────────────────────────────────────────────────────────────────────────────────

SECTION 10 — MOCK DATA (FULL SUVARNA BANK CONTEXT)

────────────────────────────────────────────────────────────────────────────────

Bank: Suvarna Bank. ~600 branches. In-house CC + 3 BPO vendors.

Vendors: Sutherland Chennai (BPO_voice, 480 agents), Krescent BPO Pune

(BPO_voice, 220 agents), Pinnacle Recovery Agency Hyderabad (recovery_agency,

95 agents). In-house conduct score benchmark: 81/100.

Languages: include signals in Hindi (hi), Tamil (ta), Telugu (te), Kannada (kn),

Marathi (mr), English (en) across different signals and agents.

Products: Cards, PL (Personal Loan), HL (Home Loan), Auto, SavAcct, ULIP, MF.

Regulatory deadlines (use ISO dates, reference "today" = 2026-05-25):

2026-03-31 → Deceased customers (PASSED)

2026-04-01 → Authentication Directions + IRDAI bancassurance (PASSED)

2026-04-10 → IT Outsourcing contract compliance (PASSED)

2026-06-30 → IO Directions automated CMS auto-escalation

2026-07-01 → RB-IOS 2026 cutover + draft uniform recovery framework

2026-10-01 → Cross-border CNP authentication

2027-05-13 → DPDP Rules 2025 substantive obligations

Build these mock arrays. Include at least the quantities shown:

REGULATIONS: 5 records (REG-001 through REG-005 + REG-007 deceased customers)

OBLIGATIONS: 12 records covering OBL-002, OBL-007, OBL-010, OBL-011, OBL-012,

OBL-013 (OUT_OF_SCOPE), OBL-020, OBL-022 (EVIDENCE_ONLY), OBL-023, OBL-024,

OBL-027, OBL-037

CONDUCT_THEMES: all 8 (THM-01 through THM-08)

INTERACTION_SIGNALS: 15 records across multiple agents, languages, signal types

RISK_ALERTS: 8 records, mix of severity levels and statuses

EVIDENCE_ITEMS: 6 records (transcript_snippet, journey_reconstruction,

cluster_proof types)

CONTROL_OWNERS: 6 records (OWN-COLL-01, OWN-CS-01, OWN-CUST-02, OWN-CRO-01,

OWN-VEN-01, OWN-IO-01)

PERSONAS: 5 records (L1–L5)

RCA_CLUSTERS: 4 records including rising bundling-pressure and distress-

dismissal clusters

VENDOR_SCORES: 3 records (Sutherland, Krescent, Pinnacle)

RECOVERY_SIGNALS: 6 records across products (Cards DPD-45, PL DPD-12,

HL DPD-180) and vendors

COMPLAINT_SIGNALS: 6 records with first-90s EXT-2 fields populated

REPEAT_PATTERNS: 4 records at different escalation stages

INBOUND_QUEUE_SIGNALS: 4 records (General Service, 24x7 Fraud Reporting,

Cards Complaint queues)

INTEGRATION_DEPS: 6 records (INT-001 CRM, INT-002 CMS, INT-003 Genesys,

INT-004 Fraud Hub, INT-005 Outbound gateway, INT-007 ACD/CTI)

CAPABILITY_BOUNDARIES: 8 records (BND-001 through BND-008)

Signal types to include (use SIGNAL_TYPE_LABELS mapping from Section 11):

threat_language, profanity, harassment_pattern, public_shaming,

customer_distress, empathy_failure, bundling_pressure, consent_extraction,

complaint_marker_no_SR, non_borrower_contact, language_mismatch.

Include at least 3 Hindi-language signals with romanised Hindi transcript snippets,

1 Tamil signal, 1 Kannada signal in the mock data.

────────────────────────────────────────────────────────────────────────────────

SECTION 11 — UTILITY FUNCTIONS

────────────────────────────────────────────────────────────────────────────────

signalTypeLabels.js — export const SIGNAL_TYPE_LABELS = {

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

deadlineHelpers.js:

export const TODAY = new Date("2026-05-25"); // fixed mock reference

export function daysRemaining(isoDate) {

return Math.ceil((new Date(isoDate) - TODAY) / 86400000);

}

export function relativeTime(isoTs) {

// returns "3 days ago", "2h ago", etc. relative to TODAY

}

applyFilters.js — pure function, no side effects. Applies globalFilters object

to any array of items. See Section 6 for filter keys.

deriveInsights.js — exports:

deriveTopSignalInsight(signals, obligationId) → AIInsightCard props | null

deriveVendorInsight(vendorScores) → AIInsightCard props | null

deriveClusterInsight(clusters) → AIInsightCard props | null

deriveComplaintInsight(complaintSignals) → AIInsightCard props | null

All functions derive their output from mock arrays — never return hardcoded prose.

assembleEvidence.js — export function assembleEvidencePackage(alertId, allData):

Returns { alert, relatedSignals, evidence, obligation, regulation, owner,

spineNodes, isBoundaryCase, isIntegrationCase }

spineNodes has 6 string values for SpineStrip.

isBoundaryCase = true when obligation.buildTier = 'OUT_OF_SCOPE'

isIntegrationCase = true when obligation.buildTier = 'INTEGRATION_DEPENDENT'

getIntegrationStatus.js — export function getIntegrationStatus(obligationId, deps)

Returns the IntegrationDependency record or null.

getBoundary.js — export function getBoundary(obligationId, boundaries)

Returns the CapabilityBoundary record or null.

────────────────────────────────────────────────────────────────────────────────

SECTION 12 — FUTURE API STUBS (place exactly in these locations)

────────────────────────────────────────────────────────────────────────────────

// TODO: FluidCX API — in PersonaContext.jsx

// const user = await FluidCX.getCurrentUser();

// setActivePersonaId(user.personaId);

// TODO: FluidCX API — in mockInteractionSignals.js top comment

// Replace INTERACTION_SIGNALS with:

// const res = await FluidCX.getSignals({ obligationIds, dateRange, personaId });

// TODO: FluidCX API — in TranscriptSnippet.jsx "Play clip" button onClick

// FluidCX.playRecording(interactionId, { startOffsetSeconds });

// TODO: FluidCX API — in S4 "Force-create SR" button (DISABLED in mock)

// FluidCX.createCMSRecord({ signalId, category, agentId });

// TODO: FluidCX API — in S7 "Generate attestation pack" button

// FluidCX.generateAttestationPack({ vendorIds, quarter, includeInhouseBenchmark });

// TODO: FluidCX API — in S8 "Export CSCB pack" button

// FluidCX.exportCSCBPack({ clusterIds, quarter, annotations });

// TODO: FluidCX API — in FilterPanel.jsx onChange

// FluidCX.saveUserPreferences({ filters: globalFilters });

────────────────────────────────────────────────────────────────────────────────

SECTION 13 — RESPONSIVE RULES

────────────────────────────────────────────────────────────────────────────────

All layout uses Tailwind responsive prefixes (sm: md: lg: xl:).

Desktop (lg+): SideNav 200px expanded, EvidenceDrawer 480px right overlay,

all table columns visible, filter panels as side rails.

Tablet (md–lg): SideNav icon-only 64px, tables horizontally scrollable

(overflow-x-auto), EvidenceDrawer 80vh bottom sheet.

Mobile (<md): SideNav hidden, bottom tab bar (5 items), tables collapse to

card-per-row (key columns only + "expand" button), EvidenceDrawer full-screen

modal. S0 shows KPI tiles 2-col grid + DeadlineHorizonBand scroll strip +

top-3 alerts only + "View all" link.

────────────────────────────────────────────────────────────────────────────────

SECTION 14 — ACCESSIBILITY

────────────────────────────────────────────────────────────────────────────────

\- All badges render colour + text label. Never colour alone.

\- All icon-only buttons have aria-label.

\- EvidenceDrawer is keyboard-trapped while open (Tab cycles inside, Esc closes).

\- All tables have role="table", proper &lt;th&gt; with scope, sortable columns have

aria-sort attribute updated on click.

\- Charts have aria-label on wrapper div: e.g. aria-label="Vendor conduct scores".

\- EmptyState components always render a named message (no blank/empty states).

\- Focus ring: ring-2 ring-offset-2 ring-blue-500 on all interactive elements.

\- Minimum text size: text-xs (12px) for badges, text-sm (14px) for body.

────────────────────────────────────────────────────────────────────────────────

SECTION 15 — CODE QUALITY RULES

────────────────────────────────────────────────────────────────────────────────

\- Each JSX file: one default export, named exports for utility functions.

\- No prop drilling beyond 2 levels — use PersonaContext for cross-screen state.

\- All client-side filtering via applyFilters() — no filter logic duplicated in

screen components.

\- All badge/label mappings live in their respective badge component (not inline

in screens).

\- All chart data is derived from mock arrays (not hardcoded inside chart JSX).

\- Comment each API stub with "// TODO: FluidCX API" prefix so Cursor can grep.

\- No console.error suppression. Handle null/undefined with optional chaining.

\- Sort functions: always return new arrays (do not mutate mock data).

\================================================================================

END OF CURSOR BUILD PROMPT

\================================================================================