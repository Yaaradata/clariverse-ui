\============================================================================

CURSOR BUILD PROMPT — Fluid CX "RBI Conduct Intelligence" Add-On

\============================================================================

You are building a polished React (JSX) add-on for an existing enterprise SaaS shell called Fluid CX. The add-on is "RBI Conduct Intelligence" — a customer-conduct compliance dashboard for Indian Private Banks built against the post-Nov-2025 RBI rulebook. Today's mock date is 2026-05-25.

You will produce production-quality, readable, reusable code. The single primary deliverable is one React module that can be (a) dropped into the Fluid CX shell as a route, and (b) previewed as a single-file React artifact in Claude.ai with no modification.

\---

\## 0. ARTIFACT COMPATIBILITY CLAUSE — READ FIRST

The main module must also run as a single-file React artifact in Claude.ai for preview before being moved into Cursor's multi-file structure. To support this:

\- Keep dependencies to: react, recharts, lucide-react. No other libraries.

\- No browser storage (no localStorage, no sessionStorage, no IndexedDB).

\- No fetch, no API calls, no backend.

\- Default-export the main module from the entry file.

\- All mock data lives inline in the artifact file OR in a sibling \`mockData.js\` that the main file imports. When building for Cursor, split mock data into the files listed in section 4; when building the Claude artifact preview, bundle them in one file.

\- Use only Tailwind core utility classes (no \`@apply\`, no custom theme, no plugin classes).

\---

\## 1. TECH CONSTRAINTS — FIRM

\- React functional components + hooks only. No class components.

\- Tailwind CSS core utility classes only.

\- Recharts for every chart. lucide-react for every icon. Nothing else.

\- Mock data only. No fetch, no axios, no API client.

\- No Redux. One React Context (\`PersonaContext\`) for cross-screen state. Everything else is local \`useState\`.

\- No browser storage of any kind.

\- shadcn/ui patterns (cards, badges, drawers) are conceptually fine; do not import the library — re-implement the small set of primitives used.

\---

\## 2. PRODUCT BOUNDARY — ENFORCED IN DATA SHAPE AND COMPONENT LOGIC

Fluid CX must NOT be built to look like it replaces any of the following systems. They appear only as integration dependencies, roadmap items, or small boundary notes — never as main features:

\- CMS workflow engine (TCS BaNCS, Newgen, etc.)

\- Internal Ombudsman decisioning

\- Core-banking alert engine

\- Fraud-authentication engine

\- Refund-processing workflow

\- Data-governance / access-control system

\- UI dark-pattern audit tool

\- Legal / compliance judgment

Enforce this in the data shape:

\- \`ComplaintCaptureSignal.cmsSrCreatedFlag\` — Fluid reads this from CMS; never writes it.

\- \`FraudDisputeSignal.weakAuthSignalPresent\` — partner-fed; null in mock.

\- "Force-create SR" button (S4) is rendered DISABLED in mock with a tooltip: "SR creation is managed by your CMS. Fluid feeds detected signals to CMS."

\- Obligations with \`buildTier = OUT_OF_SCOPE\` do not generate \`RiskAlert\` records in mock data.

\- Any out-of-scope screen surface uses \`BoundaryNote\` instead of a "manage / resolve" CTA.

\---

\## 3. PRODUCT SPINE — VISIBLE ON EVERY SCREEN

Every screen must surface the product spine in some form:

Regulation → Obligation → Customer Interaction Signal → Control Owner → Evidence → Recommended Action

Implementation: a horizontal \`SpineStrip\` component (6 labelled chips connected by \`ChevronRight\` icons) appears in the EvidenceDrawer header and inside S3 ObligationDetail header. On screens where a full spine doesn't fit, an abbreviated version (Obligation → Signal → Action) appears in card headers.

\---

\## 4. DIRECTORY STRUCTURE — FOR CURSOR BUILD

src/

modules/

RBIConductIntelligence/

index.jsx // default export — mount this in Fluid CX shell

RBIConductIntelligence.jsx // top-level rendered component

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

mockRCAClusters.js

mockVendorScores.js

mockRecoverySignals.js

mockComplaintSignals.js

mockRepeatPatterns.js

mockInboundQueueSignals.js

mockIntegrationDeps.js

mockCapabilityBoundaries.js

mockPersonas.js

utils/

applyFilters.js

assembleEvidence.js

deriveInsights.js

getBoundary.js

getIntegrationStatus.js

dateUtils.js

signalLabels.js

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

\---

\## 5. NAVIGATION MODEL — URL-LESS

The Fluid CX shell owns URL routing. This add-on is URL-less internally and uses \`activeScreen\` state inside \`PersonaContext\`.

const SCREENS = {

S0: 'landing',

S1: 'worklist',

S2: 'themes',

S3: 'obligation-detail', // uses selectedObligationId

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

Layout: TopNav (with PersonaSwitcher + sticky DeadlineHorizonBand) + SideNav (icon rail 64px collapsed / 200px expanded) + MainContent area.

Persona switcher (L1–L5) does NOT change the active screen — it re-filters and re-emphasises data within the current screen.

\---

\## 6. PERSONA CONTEXT — SHAPE

{

activePersonaId, setActivePersonaId, // "L1" | "L2" | "L3" | "L4" | "L5"

activeScreen, // current screen key

selectedObligationId, setSelectedObligationId, // for S3 drill-down

drawerOpen, drawerAlertId, openDrawer, setDrawerOpen,

globalFilters, setGlobalFilters, // shared filter state

navigate, // (screen, oblId?) => void

}

Default \`activePersonaId = "L3"\` (Head of CX — primary daily user).

Persona mapping:

\- L1 = Board / NRC Member

\- L2 = Chief Conduct Officer (CCO) — primary narrative buyer

\- L3 = Head of CX — primary daily user

\- L4 = CRO / Compliance Head — primary economic buyer

\- L5 = Internal Ombudsman

\---

\## 7. SHARED COMPONENT SPECS

\### KPICard

Props: \`label, value, delta?, deltaDir?, severity?, tooltip?, onClick?\`

White card, \`rounded-xl\`, \`shadow-sm\`, \`border-l-4\` coloured by severity (red/amber/green/neutral). Focusable when \`onClick\` provided.

\### SeverityBadge

Props: \`severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'\`

Renders BOTH background colour AND text label (never colour alone).

\- CRITICAL → \`bg-red-100 text-red-800 ring-1 ring-red-400\` text "Critical"

\- HIGH → \`bg-orange-100 text-orange-800\` text "High"

\- MEDIUM → \`bg-yellow-100 text-yellow-800\` text "Medium"

\- LOW → \`bg-gray-100 text-gray-600\` text "Low"

\### OwnerChip

Props: \`roleTitle, lineOfDefence ('1LoD'|'2LoD'|'3LoD')\`

Small grey chip, LoD as subscript.

\### DeadlinePill

Props: \`date (ISO), label\`

Compute \`daysRemaining\` from \`today = 2026-05-25\`.

\- \`< 0\`: grey, text \`"\[label\] — Passed"\`

\- \`0–60\`: red ring, text \`"X days"\`

\- \`61–180\`: amber ring

\- \`> 180\`: blue ring

Always shows label + date text.

\### ComplianceLabelBadge

\*\*CRITICAL RULE: NEVER render raw buildTier values to the DOM.\*\* Always translate via this map:

const BUILD_TIER_MAP = {

MAIN_FEATURE: { label: "Monitored by Fluid CX", style: "bg-teal-600 text-white" },

INTEGRATION_DEPENDENT: { label: "Monitored with system integration", style: "border border-teal-600 text-teal-700 bg-white" },

EVIDENCE_ONLY: { label: "Evidence support only", style: "border border-gray-400 text-gray-600 bg-white" },

OUT_OF_SCOPE: { label: "Outside Fluid CX scope", style: "bg-gray-100 text-gray-500" },

};

// Append lucide Lock icon when OUT_OF_SCOPE.

The strings "MAIN_FEATURE", "INTEGRATION_DEPENDENT", "EVIDENCE_ONLY", "OUT_OF_SCOPE", "FULL", "PARTIAL", "ADJACENT" must never appear in any rendered text.

\### ObligationRow

Props: \`oblId, obligationStatement, status, buildTier, effectiveDate, exceptionCount, onClick\`

Renders: OBL-NNN pill | statement | status badge | ComplianceLabelBadge | exception count | DeadlinePill.

\### EvidenceDrawer

Right-slide panel, 480px on desktop, full-screen on mobile.

Slides in over main content. Closes on Escape / X / click-outside. Keyboard-trapped.

Content assembled via \`assembleEvidencePackage()\` utility (see section 12).

Always shows: SpineStrip, signal list with TranscriptSnippet per signal, evidence items, recommended action, integration banner (if INTEGRATION_DEPENDENT), BoundaryNote (if OUT_OF_SCOPE).

\### BoundaryNote

Props: \`reason, primaryControlOwner, displayType\`

\- \`DO_NOT_BUILD_BANNER\` → red-outlined banner, lock icon, "Outside Fluid CX scope"

\- \`EVIDENCE_ONLY_CARD\` → grey outlined card, info icon, "Evidence support only"

\- \`HONEST_GAP_SHELF\` → amber outlined card, "Acknowledged gap"

\### AIInsightCard

Props: \`headline, detail, signalTaxonomy\[\], linkTo?\`

Soft indigo background, \`Sparkles\` icon, taxonomy chips. Content always derived from \`deriveInsights.js\` (never hardcoded prose).

\### RCAClusterCard

Props: \`cluster, onClick\`

Shows: clusterTheme, severity bar, volume, trend arrow (TrendingUp red / Minus grey / TrendingDown green), boardPackInclusion toggle.

\### VendorScorecard

Props: \`vendor, onDrillDown\`

Shows: vendor name, conduct score bar, complaintRatePer10k, benchmarkVsInhouse badge (BETTER/PARITY/WORSE — coloured + text), fluidCoveragePct vs sampleCoveragePctLegacy (before/after).

\### FilterPanel

Props: \`filters, onChange, variant ('panel' | 'inline')\`

Filters: severity, status, themeIds, dateRange, businessLine, vendorId, direction.

\### TranscriptSnippet

Props: \`snippet, language, signalType, timestamp\`

Monospace \`bg-gray-50\` container, prepends \`\[lang\]\` tag, 120-char truncation with "Show more". "Play clip" button shows toast: "Recording player connects via Fluid CX integration."

\### SpineStrip

Props: \`regulation, obligation, signalSummary, owner, evidenceSummary, recommendedAction\`

6 labelled chips connected by \`ChevronRight\` icons.

\### EmptyState

Props: \`message, icon?\`

Centred grey-text empty state. Always named — no blank screens.

\---

\## 8. SCREEN SPECS — ALL 13

For each screen, header has page title + 3–4 KPICards. Body varies.

\*\*S0 Landing\*\* — Persona-tuned home. KPI strip (Open Criticals, Deadlines in <60 days, Vendor low-scores, IO referrals pending). My Queue (top 5 alerts routed to active persona's owner). Deadline Horizon Band (horizontal scroll of upcoming reg deadlines). One AIInsightCard derived from highest-severity recent signal.

\*\*S1 Worklist\*\* — Full alert table (T1). Sortable by severity DESC default. Filter panel right rail. Row click → openDrawer.

\*\*S2 Themes Index\*\* — 8 conduct theme tiles in a grid. Click → drilled view (theme obligation list, local state). Each theme tile shows obligation count + exception count + primary lens persona.

\*\*S3 Obligation Detail\*\* — SpineStrip header. Obligation metadata + ComplianceLabelBadge + DeadlinePill. Integration banner if applicable. Signal feed table (T3) with TranscriptSnippet per row. Recommended action card. If \`buildTier = OUT_OF_SCOPE\`, replace signal table with full-width BoundaryNote.

\*\*S4 Missed-Complaint Hub\*\* — Two-panel layout. Left: missed-complaint feed (T4) + CMS Gap Trend chart (C2). Right: first-90s adherence list (T5) + adherence distribution chart (C3). "Force-create SR" button DISABLED with tooltip.

\*\*S5 Recovery Conduct Monitor\*\* — 3 tabs: (1) Violations — table T6 + stacked chart C4; (2) Distress engagement — table T7 + pie C5; (3) Vendor breakdown — links to S7.

\*\*S6 Vulnerable Customer Care\*\* — 3 tabs: (1) Empathy scoring — table + chart C6; (2) Signal mix — pie C7; (3) Routing — flags inbound-queue routing failures (vulnerable on general queue).

\*\*S7 Vendor Governance\*\* — Vendor main table T8 + horizontal bar chart C8 + accordion per vendor. Expanded row: per-vendor obligation-level scorecard + trend chart C9. "Generate Attestation Pack" button (stub).

\*\*S8 RCA & Board Pack\*\* — Treemap C10 (left). RCA cluster table T9 (right, sortable by severity). Expanded cluster: dimension breakdown chart C11 + recommended remediation. "Export CSCB pack" button (stub).

\*\*S9 Bundling & Consent\*\* — Campaign view. Bundling pressure chart C12 with threshold line. Campaign-level table with halt-recommendation badges. AIInsightCard for highest-pressure campaign.

\*\*S10 Repeat-Contact & FCR\*\* — 2 tabs: (1) By Issue — horizontal bar C13; (2) By Customer — repeat-contact table T12 with escalation stage badges.

\*\*S11 Regulatory Horizon\*\* — Timeline of all regulations (custom SVG/div, chart C1). Each milestone shows DeadlinePill + linked obligations count.

\*\*S12 Honest Gap & Integrations\*\* — Two sections: (1) Integration health table T10 (per IntegrationDependency record); (2) Capability boundaries table T11 + BoundaryNote cards per boundary.

\---

\## 9. CHARTS — RECHARTS SPECS

All wrapped in \`&lt;ResponsiveContainer width="100%" height={N}&gt;\`. Always include \`&lt;Tooltip&gt;\`. Legend only for multi-series. \`aria-label\` on container.

\- \*\*C1\*\* Regulatory Horizon Timeline (S0, S11) — custom SVG (not Recharts)

\- \*\*C2\*\* CMS Gap Trend (S4) — \`&lt;LineChart&gt;\` h=80, lines: detected (grey), logged (teal), missed (red)

\- \*\*C3\*\* First-90s Distribution (S4) — \`&lt;BarChart&gt;\` h=100, buckets coloured by score band

\- \*\*C4\*\* Recovery Violation Trend (S5) — \`&lt;BarChart&gt;\` stacked by flag type (threat, profanity, harassment, shaming, nonBorrower), 14 days

\- \*\*C5\*\* Distress Engagement (S5) — \`&lt;PieChart&gt;\` Engaged/Dismissed/Silent

\- \*\*C6\*\* Empathy Distribution (S6) — \`&lt;BarChart&gt;\` 5 buckets

\- \*\*C7\*\* Vulnerable Signal Mix (S6) — \`&lt;PieChart&gt;\` Bereavement/Distress/Fraud/PwD/MSE

\- \*\*C8\*\* Vendor Conduct Comparison (S7) — \`&lt;BarChart&gt;\` horizontal layout, with in-house reference

\- \*\*C9\*\* Per-Vendor Score Trend (S7) — \`&lt;LineChart&gt;\` sparkline, 4-week

\- \*\*C10\*\* RCA Cluster Treemap (S8) — \`&lt;Treemap&gt;\`, size by volume, fill by severity

\- \*\*C11\*\* Cluster Dimension Breakdown (S8) — \`&lt;BarChart&gt;\` horizontal, top 5 dimensions

\- \*\*C12\*\* Campaign Bundling Pattern (S9) — \`&lt;BarChart&gt;\` with threshold reference line

\- \*\*C13\*\* Repeat-Contact Issue Volume (S10) — \`&lt;BarChart&gt;\` horizontal, top 10 issues

\---

\## 10. TABLES — REQUIREMENTS

All tables: HTML \`&lt;table&gt;\` or Tailwind div rows. Sortable headers via local \`useState\`. Pagination via client-side slice at 50 rows.

\- \*\*T1\*\* Worklist (S1) — sortable: severity (default DESC), firstObservedTs, occurrenceCount. Badges: SeverityBadge + alert status pill + ComplianceLabelBadge + DeadlinePill. CTA: "View Evidence" → openDrawer.

\- \*\*T2\*\* Theme obligations (S2) — sortable: exceptionCount, effectiveDate. Badges: status, ComplianceLabel, Deadline.

\- \*\*T3\*\* Signal feed (S3) — sortable: severity, timestamp. Badges: Severity, direction (INBOUND/OUTBOUND), channel icon. TranscriptSnippet expandable.

\- \*\*T4\*\* Missed-complaint feed (S4) — sortable: severity, gapHoursToSr. cmsSrCreatedFlag rendered as "No SR" red pill or SR ID chip.

\- \*\*T5\*\* First-90s adherence (S4) — sortable: firstNinetySecondsAdherenceScore ASC (worst first). Tick/cross icons per boolean field.

\- \*\*T6\*\* Recovery violations (S5) — flag strip with icons per active flag.

\- \*\*T7\*\* Distress engagement (S5 Tab 2) — engagement badge ENGAGED (teal) / DISMISSED (red) / SILENT (amber).

\- \*\*T8\*\* Vendor table (S7) — sortable: conductScoreOverall ASC, complaintRatePer10k. Benchmark badge BETTER/PARITY/WORSE.

\- \*\*T9\*\* RCA cluster table (S8) — sortable: severityScore DESC, volume. Trend icon + label.

\- \*\*T10\*\* Integration health (S12) — status: Connected (teal) / Partial (amber) / Not connected (red) / Roadmap (grey).

\- \*\*T11\*\* Capability boundaries (S12) — ComplianceLabelBadge per row.

\- \*\*T12\*\* Repeat-contact by customer (S10) — escalation stage badge.

\---

\## 11. MOCK DATA MINIMUMS — SUVARNA BANK CONTEXT

Build mock data with this fictional context. No real customer data. No real bank names.

\*\*Bank:\*\* Suvarna Bank, ~600 branches, Indian Private Bank

\*\*Today (mock):\*\* 2026-05-25

\*\*BPO Vendors:\*\*

\- Sutherland Chennai — VEN-001, 480 agents, conduct score 68, WORSE vs in-house

\- Krescent BPO Pune — VEN-002, 220 agents, conduct score 71, WORSE vs in-house

\- Pinnacle Recovery Agency (Hyderabad) — VEN-014, 95 agents, conduct score 59, WORSE vs in-house

\- In-house benchmark: 81

\*\*Languages required in transcript snippets:\*\* en, hi, ta, te, kn, mr.

\*\*Minimum mock counts:\*\*

\- ≥ 6 Regulations (incl. REG-001 RBC Directions 2025, REG-002 IO Directions 2026, REG-003 RB-IOS 2026, REG-005 Draft Recovery Framework, plus 2 more)

\- ≥ 12 Obligations across themes (mix of IN_FORCE and DRAFT_PROPOSED; mix of all 4 buildTiers)

\- 8 ConductThemes

\- ≥ 15 RiskAlerts (mix of CRITICAL / HIGH / MEDIUM, mix of OPEN / IN_REVIEW / ACTIONED)

\- ≥ 25 CustomerInteractionSignals (across all 6 languages, mix INBOUND/OUTBOUND)

\- ≥ 10 EvidenceItems linked to alerts

\- ≥ 8 ControlOwners across 1LoD/2LoD/3LoD

\- ≥ 5 RCAClusters with realistic dimension breakdowns

\- 3 VendorBPOScores (as above)

\- ≥ 10 RecoveryConductSignals

\- ≥ 10 ComplaintCaptureSignals (with EXT-2 first-90s fields)

\- ≥ 6 RepeatContactPatterns

\- ≥ 5 InboundQueueSignals

\- ≥ 8 IntegrationDependencies (CMS, CRM, Core Banking, Genesys, NICE QM, Fraud Engine, IO System, MIS)

\- ≥ 6 CapabilityBoundaries

\- 5 ExecutivePersonas (L1–L5)

\*\*Realistic deadline dates to feature:\*\*

\- 31 Mar 2026 (deceased customers — PASSED)

\- 1 Apr 2026 (authentication directions — PASSED)

\- 10 Apr 2026 (IT outsourcing — PASSED)

\- 30 Jun 2026 (IO Directions CMS auto-escalation — UPCOMING)

\- 1 Jul 2026 (RB-IOS cutover + draft recovery framework — UPCOMING)

\- 1 Oct 2026 (cross-border CNP auth — UPCOMING)

\- 13 May 2027 (DPDP substantive obligations — UPCOMING)

\*\*Sample transcript snippets (in transcript field):\*\*

\- \`\[hi\] ...agar kal tak nahi diya toh hum aapke office aa jayenge aur sabko bata denge...\` (threat language, recovery)

\- \`\[en\] ...I have been calling for three weeks now, no one is resolving my dispute...\` (missed complaint marker)

\- \`\[hi\] ...madam, salary account ke saath insurance lena compulsory hai...\` (bundling pressure)

\- \`\[hi\] Customer: mere husband ka abhi operation hua hai... | Agent: Madam EMI toh deni hi padegi...\` (distress dismissed)

\- \`\[ta\] ...vangiyathu nalla iruku, aana neenga help pannala...\` (TN region, service)

\- \`\[en\] Customer: My husband passed away last week... | Agent: Please submit Form 15G at the branch.\` (empathy failure)

\- \`\[kn\] ...nimma loan EMI bandide, swalpa adjust madkolli...\` (recovery, KA region)

\*\*Product codes to feature:\*\* Cards, PL (personal loan), HL (home loan), SavAcct, ULIP, MF.

\---

\## 12. UTILITY FUNCTIONS — EXPORTS

// utils/applyFilters.js

export function applyFilters(items, filters) { /\* pure function, see arch \*/ }

// utils/assembleEvidence.js

export function assembleEvidencePackage(alertId, lookups) {

// Returns { alert, relatedSignals, evidence, obligation, regulation, owner,

// spineNodes, isBoundaryCase, isIntegrationCase }

}

// utils/deriveInsights.js

export function deriveTopSignalInsight(signals, obligationId) { ... }

export function deriveVendorInsight(vendorScores) { ... }

export function deriveClusterInsight(clusters) { ... }

// utils/getBoundary.js

export function getBoundary(obligationId, boundaries) { ... }

// utils/getIntegrationStatus.js

export function getIntegrationStatus(obligationId, integrationDeps) { ... }

// utils/dateUtils.js

export function daysUntil(isoDate, today = "2026-05-25") { ... }

export function relativeTime(isoTs) { ... }

// utils/signalLabels.js

export const SIGNAL_TYPE_LABELS = { /\* taxonomy → human labels \*/ };

\`SIGNAL_TYPE_LABELS\` must cover at minimum: threat_language, profanity, harassment_pattern, public_shaming, customer_distress, bundling_pressure, consent_extraction, complaint_marker_no_SR, empathy_failure, non_borrower_contact, language_mismatch, banned_phrase_penal_interest.

\---

\## 13. FLUID CX API STUB LOCATIONS

Place \`// TODO: FluidCX API\` comments at every future-integration point. Cursor will grep this string to find all stubs. Required locations:

1\. \`data/mockInteractionSignals.js\` — top of file, replacing const with \`FluidCX.getSignals(...)\`

2\. \`components/shared/TranscriptSnippet.jsx\` — \`FluidCX.playRecording(interactionId, ...)\`

3\. \`components/screens/S4_MissedComplaintHub.jsx\` — "Force-create SR" button stub

4\. \`components/screens/S7_VendorGovernance.jsx\` — "Generate Attestation Pack" button stub

5\. \`components/screens/S8_RCABoardPack.jsx\` — "Export CSCB pack" button stub

6\. \`context/PersonaContext.jsx\` — load default persona from \`FluidCX.getCurrentUser()\`

7\. \`components/shared/FilterPanel.jsx\` — persist filter preferences via \`FluidCX.saveUserPreferences(...)\`

Each stub should include a brief comment explaining what the real call will do and what the mock currently does instead.

\---

\## 14. RESPONSIVE RULES

Breakpoints: Tailwind defaults (sm 640, md 768, lg 1024, xl 1280).

\- \*\*Desktop (lg+):\*\* SideNav left rail (64px collapsed / 200px expanded). EvidenceDrawer = 480px right panel overlay. All chart and table columns visible.

\- \*\*Tablet (md–lg):\*\* SideNav icon-only. Tables \`overflow-x-auto\`. EvidenceDrawer = full-width bottom sheet (80vh). S7 accordion expands below row.

\- \*\*Mobile (< md):\*\* SideNav hidden, replaced by bottom tab bar (S0 / S1 / S2 / S7 / S12). S0 stacks. Tables become card-per-row. EvidenceDrawer full-screen modal. Charts hidden except C2 (sparkline) and C5/C7 (pies).

CRO summary on mobile S0 prioritises KPI tiles + deadline horizon strip + top 3 alerts.

\---

\## 15. ACCESSIBILITY + CODE QUALITY RULES

\*\*Accessibility (must):\*\*

\- All badges show colour + text label (never colour alone).

\- All interactive elements keyboard-reachable (Tab order logical).

\- Focus rings visible (\`focus:ring-2 focus:ring-teal-500\`).

\- EvidenceDrawer traps focus while open; Escape closes.

\- All charts have container \`aria-label\`.

\- All icons used in clickable elements have accompanying text or \`aria-label\`.

\*\*Code quality (must):\*\*

\- Functional components only.

\- Component files < 250 lines where possible — split into sub-components.

\- No magic strings — taxonomy and badge maps live in \`utils/\` or constants files.

\- No \`any\`-equivalent untyped props — destructure with sensible defaults.

\- Imports grouped: react → external libs → local context → utils → components → data.

\- Tailwind classes ordered: layout → spacing → typography → colour → state.

\- No commented-out dead code in final output. Comments only for: \`// TODO: FluidCX API\` stubs, non-obvious business rules, boundary enforcement.

\- No console.log in production paths (toast/modal messages only for stubs).

\---

\## DELIVERABLE EXPECTATION

When you run this prompt, output the complete file tree as specified in section 4 with every file populated, polished, and runnable. The main entry file (\`src/modules/RBIConductIntelligence/index.jsx\`) must default-export the component and be drop-in-ready for both the Fluid CX shell and a single-file Claude artifact preview (with mock data inlined for the artifact version).

Start by scaffolding the directory, then build context + utils + shared components + data files, then build screens S0 → S12 in order. Confirm at each milestone before continuing.

\============================================================================

END CURSOR BUILD PROMPT

\============================================================================