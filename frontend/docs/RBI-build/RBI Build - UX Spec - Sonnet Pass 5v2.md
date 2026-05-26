RBI Build - UX Spec - Sonnet Pass 5v2

Fluid CX — RBI Conduct Intelligence Add-On

Source: PRD Opus Pass 4v2 | Mock-Data Pack Pass 3 + Inbound Addendum

Spine on every screen: Regulation → Obligation → Signal → Owner → Evidence → Action

IA TIGHTENING NOTE (one change proposed):

S2 (Conduct Themes Index) and S11 (Regulatory Horizon) serve overlapping navigation purposes. Proposed: merge S11 deadline timeline into a collapsible "Regulatory Horizon" panel within S2, keeping S2 as the single navigation hub for themes + deadlines. Reason: reduces nav depth by one level for L4 who needs both in the same boardroom context. All other screens unchanged.

\---

GLOBAL DESIGN RULES (apply to all screens)

Capability labels (never raw tiers):

\- "Monitored by Fluid CX" — solid teal pill

\- "Monitored with system integration" — outlined teal pill

\- "Evidence support only" — outlined grey pill

\- "Outside Fluid CX scope" — grey fill with lock icon

Obligation status badges:

\- IN_FORCE — solid dark-blue pill, text "In Force"

\- DRAFT_PROPOSED — amber outlined pill, text "Draft · Proposed"

Deadline colour band (applies to any countdown element):

\- Red: < 60 days remaining

\- Amber: 60–180 days

\- Blue: > 180 days

Severity (colour + text label always paired):

\- CRITICAL — red background, text "Critical"

\- HIGH — orange background, text "High"

\- MEDIUM — yellow background, text "Medium"

\- LOW — grey background, text "Low"

Typography: Inter or system sans-serif. Minimum 16px body. Bold labels for entity names.

Empty states: named per section (see per-screen specs below).

Keyboard: full tab navigation across rows, cards, and filters. Enter opens drilldown. Escape closes drawer.

Mobile/tablet: S0 and S1 prioritised. Dense tables (S7, S8) collapse to summary cards on viewport < 1024px.

\---

SCREEN S0 — PERSONA-AWARE LANDING

1\. Screen name: Persona-Aware Landing

2\. Purpose: Deliver the 5-second CRO moment — regulatory deadlines + today's queue + 3 headline numbers, tuned to the logged-in persona.

3\. Primary user + business question:

L4 (CRO): "What is our exposure against the deadlines, and what needs my attention today?"

L3 (Head of CX, daily): "What is open in my queue right now?"

L2 (CCO): "How are vulnerable customers being treated today?"

4\. Layout:

Header: Full-width regulatory horizon band (sticky, always visible). Below: persona greeting strip ("Good morning, \[Name\] — Head of CX, Suvarna Bank"). Then 3 KPI tiles in a row. Below tiles: two columns — left 60% is My Queue summary (top 5 open alerts), right 40% is Conduct Themes heat strip (8 theme tiles, exception count + trend arrow each). Footer strip: last-updated timestamp + data-coverage note ("100% of yesterday's 42,318 interactions analysed").

Side: None on landing — full-width layout only.

5\. KPI cards (3):

\- "Interactions analysed today" — count with vs-baseline delta (e.g., "42,318 · 100% coverage"). Entity: CustomerInteractionSignal count.

\- "Open critical alerts" — count, red if > 0, with drill link to S1. Entity: RiskAlert (severity=CRITICAL, status=OPEN).

\- "RB-IOS exposure — cases at risk" — count of RiskAlert records where boardPackInclusion=true and status=OPEN. Amber/red based on count. Tooltip: "Cases that may attract ₹30 lakh consequential-loss compensation if unresolved."

6\. Tables: None on landing. My Queue preview is a 5-row condensed alert list (alertTitle, severity badge, obligation badge, age, "View" link → S1). Entity: RiskAlert. Columns: Alert | Severity \[badge+text\] | Obligation | Age | Status.

7\. Charts:

\- Regulatory Horizon Band (top of screen): horizontal timeline. Recharts: custom SVG timeline (not a standard chart type — implement as a positioned bar with milestone markers). Shows all key deadlines from Mock-Data: 31 Mar 2026, 1 Apr 2026, 10 Apr 2026, 30 Jun 2026, 1 Jul 2026, 1 Oct 2026, ~May 2027. Each milestone coloured by proximity rule. Today marker shown. Reason: a timeline communicates sequence and proximity in a way a table cannot; it is the anchor of the 5-second moment.

\- Conduct Theme heat strip: 8 tiles arranged in a 4×2 grid (desktop) or 2×4 scroll (mobile). Each tile: theme name, exception count this week, trend arrow (RISING/STABLE/FALLING from RCACluster.trendDirection). Not a Recharts chart — simple CSS grid cards. Colour-coded by highest-severity open alert within the theme.

8\. AI-insight cards (2, below KPI tiles):

\- "Today's top signal: \[signalType from highest-severity unactioned CustomerInteractionSignal\]" — e.g., "Threat language detected in Cards recovery — 7 instances, Krescent BPO Pune." Links to S5.

\- "Emerging cluster: \[clusterTheme from highest-severityScore RCACluster with trendDirection=RISING\]" — e.g., "Bundling pressure rising in Cards cross-sell — 412 signals, 14 days." Links to S8.

9\. Filters + Drill-down:

\- Persona toggle: L1/L2/L3/L4/L5 chips in the greeting strip. Switching persona re-renders KPI tiles and queue with that persona's ControlOwner filter. URL-persists persona selection.

\- Date range picker (default: yesterday). Affects KPI counts and queue.

\- Click any theme tile → S2 (Conduct Themes Index, filtered to that theme).

\- Click any queue alert row → S1 (Worklist), scrolled to that alert.

\- Click KPI "Open critical alerts" → S1 filtered to CRITICAL.

\- Click regulatory horizon milestone → S2 with Regulatory Horizon panel expanded for that date.

10\. NOT on this screen:

\- No full alert list (that is S1).

\- No obligation detail (that is S3).

\- No transcript snippets.

\- No boundary notes or integrations (that is S12).

\- No raw OBL codes or regulation circular numbers — business language only.

Empty states:

\- Queue: "No open alerts today — all exceptions are actioned."

\- Theme strip: "No exceptions detected this week for this theme."

\---

SCREEN S1 — MY WORKLIST

1\. Screen name: My Worklist

2\. Purpose: The primary daily-user surface — all open alerts routed to the logged-in owner, severity-sorted, one-click to evidence.

3\. Primary user + business question:

L3 (Head of CX): "What do I need to action today, in what order, and what is the evidence?"

L4 (CRO): "What is open across conduct themes that needs my decision?"

4\. Layout:

Header: 4 KPI tiles. Below: full-width alert table (primary body). Right side: collapsible filter panel (240px). When a row is clicked, a detail drawer slides in from the right (480px) — main table remains visible at 60% width.

5\. KPI cards (4):

\- "Critical open" — RiskAlert count, severity=CRITICAL, status=OPEN.

\- "High open" — severity=HIGH, status=OPEN.

\- "Actioned today" — status=ACTIONED, lastObservedTs=today.

\- "Escalated to IO" — status=ESCALATED_TO_IO. Tooltip: "These have been referred to the Internal Ombudsman for independent review."

6\. Tables:

Entity: RiskAlert. Columns:

\- Severity \[badge+text label\]

\- Alert title (alertTitle)

\- Obligation \[pill: OBL-NNN · short name · IN_FORCE or DRAFT badge\]

\- Conduct theme (themeId → ConductTheme.themeName)

\- Affected \[agentId or vendorId, max 2 shown + "+N more"\]

\- First seen (firstObservedTs, relative: "3 days ago")

\- Occurrences (occurrenceCount)

\- Status \[OPEN / IN_REVIEW / ACTIONED / CLOSED / ESCALATED_TO_IO — each as distinct colour+text badge\]

\- Actions \[primary CTA button: "View Evidence" | secondary: "Mark In Review"\]

Default sort: severity DESC, then firstObservedTs ASC.

Row hover: highlight. Row click: open detail drawer.

7\. Charts: None in table view. Drawer (see drill-down) contains a mini sparkline for occurrence trend.

8\. AI-insight cards: None persistent. The detail drawer surfaces the signal-level AI insight (see drill-down below).

9\. Filters (right panel):

\- Severity: multi-select checkboxes (CRITICAL / HIGH / MEDIUM / LOW).

\- Status: multi-select (OPEN / IN_REVIEW / ACTIONED / ESCALATED_TO_IO).

\- Conduct theme: multi-select (8 themes from ConductTheme).

\- Obligation: searchable dropdown (OBL-NNN list).

\- Business line: Cards / RetailAssets / Collections / ContactCentre / CrossCutting.

\- Date range: first-seen window.

\- Vendor: searchable dropdown (VendorBPOScore.vendorName, plus "In-house").

All filters URL-persisted.

Drill-down on row click → Detail Drawer (slides in from right):

\- Alert title + severity badge.

\- Spine strip: Regulation name (from Obligation → Regulation) | Obligation statement | Signal type | Owner (ControlOwner.roleTitle) | Evidence | Recommended Action (RiskAlert.recommendedAction).

\- Signals panel: list of linked CustomerInteractionSignal records. Per signal: signalType label, severity, transcriptSnippet (truncated to 120 chars), timestamp, agentId, language, channel. "Play clip" button (links to call recording player — external to this spec but placeholder required). Occurrence sparkline (7-day bar chart, Recharts BarChart, narrow).

\- Evidence section: EvidenceItem records linked to this alert. Per item: evidenceType pill, whyThisIsEvidence text, attestationReady badge ("Audit-ready" or "Pending"). "Download evidence pack" button.

\- Recommended action: RiskAlert.recommendedAction as a highlighted action card with owner name and CTA buttons: "Mark actioned", "Escalate to IO", "Add note".

\- Obligation boundary note (if buildTier = INTEGRATION_DEPENDENT): small grey banner "This obligation is monitored with CRM integration. Coverage may be partial until integration is complete."

10\. NOT on this screen:

\- No theme navigation — that is S2.

\- No vendor governance scorecard — that is S7.

\- No RCA clusters — that is S8.

\- No out-of-scope obligations — they do not generate RiskAlerts and must not appear here.

Empty states:

\- Table: "No alerts match your filters. Adjust the filter panel or check back after the next analysis run."

\- Drawer signals: "No individual signals found for this alert — cluster-proof evidence attached."

\---

SCREEN S2 — CONDUCT THEMES INDEX (with integrated Regulatory Horizon panel)

1\. Screen name: Conduct Themes Index

2\. Purpose: Theme-level navigation hub for the CRO and Head of Customer — 8 conduct themes as tiles, each showing obligation count, coverage status, and exception volume; with collapsible Regulatory Horizon timeline below.

3\. Primary user + business question:

L4: "Which conduct themes have the most exposure, and which deadlines are approaching?"

L2: "Where are vulnerable-customer obligations concentrated?"

4\. Layout:

Header: 3 KPI tiles. Below: 8-tile theme grid (4×2 desktop, scrollable on mobile). Below grid: collapsible "Regulatory Horizon" panel (collapsed by default, expandable by user or auto-expanded if a deadline is within 60 days). No persistent side panel.

5\. KPI cards (3):

\- "Themes with critical exceptions" — count of ConductTheme with any linked RiskAlert severity=CRITICAL and status=OPEN.

\- "Obligations monitored by Fluid CX" — count of Obligation where buildTier=MAIN_FEATURE across all themes (shows "13 of 38").

\- "Next hard deadline" — nearest future effectiveDate from Regulation/Obligation, with countdown and red/amber/blue colour.

6\. Tables: None in main view. Each theme tile opens a theme detail page (same screen, drilled) showing a table of obligations within the theme: OBL-NNN | Statement | Status badge | Build-tier label | Owner role | Exception count | Action link → S3.

7\. Charts:

\- Theme tiles: each tile is a summary card (not a Recharts chart). Shows: theme name, theme definition (one line), obligationCount, exception count this week, trend arrow. Colour border reflects highest-severity exception in theme.

\- Regulatory Horizon panel (collapsible): horizontal scrollable timeline (custom SVG or Recharts custom shape). Milestones: 31 Mar 2026 (PAST — greyed), 1 Apr 2026 (PAST — greyed), 10 Apr 2026 (PAST — greyed), 30 Jun 2026, 1 Jul 2026, 1 Oct 2026, ~May 2027. Each milestone: dot + label + linked obligation count. Reason: timeline communicates urgency and sequence better than a list; it also visually pairs deadline proximity with theme exposure.

8\. AI-insight cards (1, below theme grid):

\- "Fastest-rising cluster this week: \[RCACluster.clusterTheme, volume, trendDirection=RISING, first theme\]" — links to S8.

9\. Filters + Drill-down:

\- Filter chips above theme grid: "Show only: themes with open critical alerts" toggle. "My themes" toggle (filters to themes linked to logged-in persona's obligations).

\- Click theme tile → drill to theme detail table (obligation list within theme, same S2 screen, breadcrumb updated).

\- Click obligation row in theme detail → S3 (Obligation Detail).

\- Click Regulatory Horizon milestone → filter theme grid to show only themes with obligations linked to that milestone's deadline.

\- Breadcrumb: "Conduct Themes > \[Theme Name\]" when drilled.

10\. NOT on this screen:

\- No individual alert rows — that is S1.

\- No transcript evidence — that is the S1/S3 drawer.

\- No vendor scorecard — that is S7.

\- No out-of-scope obligations shown as theme entries (they appear only in S12).

\- No regulation circular numbers in tile view — obligation statement in plain English only.

Empty states:

\- Theme tile: "No exceptions detected this week."

\- Regulatory Horizon: all past dates show "(Passed)" label in grey.

\---

SCREEN S3 — OBLIGATION DETAIL (atomic spine view)

1\. Screen name: Obligation Detail

2\. Purpose: Express the full product spine for a single obligation — one screen, one obligation, every node of Regulation → Obligation → Signal → Owner → Evidence → Action.

3\. Primary user + business question:

L3 / L4: "What exactly is this obligation, what has Fluid detected, who owns it, what is the evidence, and what should happen next?"

4\. Layout:

Header: Obligation identity strip (full width). Below: 5-column spine row (Regulation | Obligation | Signal summary | Owner | Evidence). Below spine row: body in two columns — left 65% is signal feed (list of linked CustomerInteractionSignal + EvidenceItem), right 35% is action panel (recommended action, ownership, integration note if applicable). No persistent side filter — filters are within the signal feed.

5\. KPI cards (4, in the obligation identity strip):

\- Obligation status badge: IN_FORCE / DRAFT_PROPOSED (prominent, coloured).

\- "Monitored by" label: capability label pill (see global rules).

\- Exception count (last 30 days): count from linked RiskAlert records.

\- Effective date countdown: days remaining to effectiveDate, coloured by proximity rule.

6\. Tables:

Signal feed table. Entity: CustomerInteractionSignal (filtered to this oblId). Columns:

\- Severity \[badge+text\]

\- Direction \[INBOUND / OUTBOUND pill — from EXT-1 direction field\]

\- Signal type (signalType — human label, not raw enum: e.g., "Threat language" not "threat_language")

\- Channel \[voice / chat / email / social / ticket icon + label\]

\- Agent / Vendor (agentId + vendorId if applicable)

\- Transcript snippet (transcriptSnippet, 120 chars, truncated)

\- Timestamp

\- "View evidence" link → opens EvidenceItem drawer

Below signal table: EvidenceItem table. Columns:

\- Evidence type \[pill: Transcript snippet / Journey reconstruction / Cluster proof / etc.\]

\- Why it is evidence (whyThisIsEvidence)

\- Audit-ready \[boolean → "Audit-ready" teal badge or "Pending review" grey badge\]

\- Audit trail ID (auditTrailId)

\- Download

7\. Charts:

\- Signal volume sparkline (right panel, above action card): 30-day BarChart (Recharts) of daily exception count for this obligation. Reason: shows whether the issue is trending or contained — a table of counts would not convey trend at a glance.

8\. AI-insight cards (1, top of signal feed):

\- Top detected signal for this obligation, plain English: e.g., "Most frequent signal: threat language — 7 of 12 exceptions this week." From CustomerInteractionSignal signalType frequency count.

9\. Filters (inline above signal table):

\- Direction: INBOUND / OUTBOUND toggle.

\- Severity: multi-select.

\- Channel: voice / chat / email / social / ticket chips.

\- Date range.

Click "View evidence" on any signal row → EvidenceItem detail drawer (same as S1 drawer, evidence section only).

Integration dependency banner (if buildTier=INTEGRATION_DEPENDENT): amber banner below obligation identity strip — "This obligation is monitored with \[system name\] integration. \[System name\] provides \[whatItProvides\]. Coverage may be partial." (from IntegrationDependency entity).

Boundary note (if buildTier=EVIDENCE_ONLY or OUT_OF_SCOPE): grey banner — "This obligation is outside Fluid CX's monitoring scope. \[primaryControlOwner\] is the primary control owner." (from CapabilityBoundary). No signal table rendered for OUT_OF_SCOPE.

Branch-dependent note (if branchDependentFlag=true): small icon + "Branch calls not currently recorded — branch-channel coverage pending." (from CapabilityBoundary BND-008).

10\. NOT on this screen:

\- No other obligations — one screen, one obligation.

\- No vendor governance tables — link to S7 if vendorId present.

\- No RCA cluster engine — link to S8 for cluster view.

\- No legal text or regulation circular body — short name + circular reference only, with tooltip.

Empty states:

\- Signal feed: "No signals detected for this obligation in the selected date range. This may indicate clean compliance or that interaction volume has not yet been analysed."

\- Evidence table: "No evidence items attached. Evidence is generated when a RiskAlert is created."

\---

SCREEN S4 — MISSED-COMPLAINT HUB

UC-01 (Missed-Complaint Detector) + UC-23 (First-90-Seconds Complaint Handling)

Obligation: OBL-020 (ComplaintCaptureSignal) + OBL-020/025/026 (first-90s extension EXT-2)

1\. Screen name: Missed-Complaint Hub

2\. Purpose: Surface complaints in conversations that never reached CMS, and score inbound complaint handling in the first 90 seconds — the two highest-leverage RB-IOS exposure mitigations.

3\. Primary user + business question:

L3: "Which complaints did my agents not log, and which ones were handled without SR creation or escalation-route disclosure?"

L4: "What is our RB-IOS exposure from missed complaint handling?"

4\. Layout:

Header: 4 KPI tiles. Body: two side-by-side panels at 50/50. Left panel: Missed-Complaint feed (UC-01). Right panel: First-90-Seconds Adherence breakdown (UC-23). On mobile/tablet: stacked vertically, missed-complaint panel first. Right side (desktop): no persistent filter panel — filters sit above each panel inline.

5\. KPI cards (4):

\- "Complaints detected, not logged in CMS (last 24h)" — ComplaintCaptureSignal count where cmsSrCreatedFlag=false. Red if > 0.

\- "CMS gap rate (last 7 days)" — (missed / total detected) as %. Trend arrow.

\- "First-90s adherence score (today)" — mean of firstNinetySecondsAdherenceScore across all inbound complaint calls today (from EXT-2 extension). Red &lt; 60%, amber 60-80%, green &gt; 80%.

\- "Escalation route disclosed %" — escalationRouteDisclosedFlag=true / total complaint calls today. This is the single most direct RB-IOS defence metric.

6\. Tables:

Left panel — Missed-Complaint feed. Entity: ComplaintCaptureSignal where cmsSrCreatedFlag=false. Columns:

\- Severity \[badge+text\]

\- Channel \[icon+text: voice / chat / email / social / ticket\]

\- Complaint marker type (human label: "Escalation request" / "Mis-selling allegation" / etc.)

\- Product (productCode)

\- Agent / Vendor

\- Transcript snippet (truncated)

\- Gap to SR (gapHoursToSr — null = "No SR created" badge in red)

\- Presumed RBI category (presumedCategoryRBI)

\- "Force-create SR" action button (triggers CMS feed, if INT-002 integrated) or "Copy to clipboard" fallback.

Right panel — First-90-Seconds table. Entity: ComplaintCaptureSignal (EXT-2 fields). Columns:

\- Severity \[badge+text\]

\- Agent

\- Adherence score (firstNinetySecondsAdherenceScore — 0–100, shown as score + colour bar)

\- Acknowledgement \[tick/cross icon + "Yes"/"No" text\]

\- SR creation language \[tick/cross + "Yes"/"No"\]

\- Escalation route disclosed \[tick/cross + "Yes"/"No"\]

\- Dismissive framing \[warning icon + "Yes" if true\]

Default sort: adherenceScore ASC (worst first).

7\. Charts:

\- CMS gap trend (left panel header): 7-day LineChart (Recharts), missed count vs total detected. Reason: trend reveals whether the gap is improving or worsening — a number alone does not.

\- First-90s adherence distribution (right panel header): Recharts BarChart — X-axis: adherence score buckets (0-20, 21-40, 41-60, 61-80, 81-100), Y-axis: call count. Reason: distribution shows whether failures are clustered (training problem) or scattered (individual behaviour).

8\. AI-insight cards (1 per panel):

Left: "Highest-risk missed complaint: \[complaintMarkerType, productCode, agentId, gapHoursToSr\]." From ComplaintCaptureSignal worst record.

Right: "Lowest adherence agent today: \[agentId, firstNinetySecondsAdherenceScore, escalationRouteDisclosedFlag=false\]." Signal taxonomy: complaint_marker_no_SR; first-90s adherence failure.

9\. Filters (inline above each panel):

Left: Channel chips (voice/chat/email/social/ticket), severity multi-select, date range.

Right: Agent search, date range, "Show only: escalation route NOT disclosed" toggle.

Drill-down: Click any row in either table → S3 Obligation Detail (OBL-020), with that signal's interactionId pre-selected in the signal feed, and evidence drawer open.

10\. NOT on this screen:

\- No complaint resolution workflow — Fluid does not manage CMS workflow (OBL-022 boundary).

\- No IO referral workflow — that is the IO's own system (OBL-021 boundary).

\- No PNO correspondence — that is OBL-025 boundary.

\- No CMS SR status tracking — Fluid feeds CMS; CMS owns the SR lifecycle.

Empty states:

\- Left panel: "No missed complaints detected in the selected period. All complaint signals have corresponding CMS records."

\- Right panel: "No inbound complaint calls detected today."

\---

SCREEN S5 — RECOVERY CONDUCT HUB

UC-02 (Recovery Conduct Monitor) + UC-03 (Borrower-Distress Identifier)

Obligations: OBL-010, OBL-011. Entity: RecoveryConductSignal.

1\. Screen name: Recovery Conduct Hub

2\. Purpose: Detect threat/harassment/shaming/tone failures in recovery calls, and surface distress language paired with agent engagement classification.

3\. Primary user + business question:

L3 (Head of Collections): "Which agents and vendors are breaching the recovery code of conduct, and which distressed borrowers did not get hardship engagement?"

L4: "What is our regulatory exposure on recovery conduct ahead of the 1 Jul 2026 draft framework deadline?"

4\. Layout:

Header: 4 KPI tiles. Body: two tabs — "Conduct Violations" (default) and "Distress Engagement". Tab switch retains date/filter state. Right side: filter panel (240px, collapsible).

5\. KPI cards (4):

\- "Critical conduct exceptions (last 24h)" — RecoveryConductSignal count where (threatFlag OR profanityFlag OR harassmentFlag OR shamingFlag)=true AND severity CRITICAL.

\- "Distress detected, not engaged (last 7 days)" — RecoveryConductSignal count where distressLanguageDetected=true AND agentEngagementWithHardship=DISMISSED or SILENT.

\- "Non-borrower contact incidents" — nonBorrowerContactFlag=true count (last 7 days). Red if > 0.

\- "Draft framework deadline" — countdown to 1 Jul 2026 (colour-coded by proximity). Tooltip: "Draft RBI Uniform Recovery Framework — proposed effective 1 July 2026."

6\. Tables:

Tab "Conduct Violations". Entity: RecoveryConductSignal filtered to any conduct flag=true. Columns:

\- Severity \[badge+text\]

\- Agent / Vendor (vendorId nullable)

\- Product / DPD bucket (productCode + bucketDPD)

\- Flags detected \[icon strip: Threat | Profanity | Harassment | Shaming | Non-borrower — each as icon+label, only flagged ones shown\]

\- Transcript snippet (truncated, from linked CustomerInteractionSignal)

\- Timestamp

\- Alert status (relatedAlertId status)

\- "View evidence" link

Tab "Distress Engagement". Entity: RecoveryConductSignal filtered to distressLanguageDetected=true. Columns:

\- Severity \[badge+text\]

\- Agent / Vendor

\- Product / DPD bucket

\- Distress markers (from CustomerInteractionSignal transcriptSnippet, truncated — e.g., "mere husband ka abhi operation hua hai")

\- Agent response \[ENGAGED — teal / DISMISSED — red / SILENT — amber — each as coloured text+icon\]

\- Hardship handoff status (downstream CRM disposition, if INT-001 integrated — else "Unknown — CRM not connected")

\- "View full call" link

7\. Charts:

\- Conduct violation trend (above Conduct Violations tab): 14-day BarChart (Recharts), stacked by flag type (threat / profanity / harassment / shaming / non-borrower). Reason: stacked bar reveals whether a single signal type dominates or the problem is mixed — drives different remediation paths.

\- Distress engagement rate (above Distress tab): Recharts PieChart — ENGAGED / DISMISSED / SILENT proportions. Reason: proportion is the key metric for supervisory defensibility — a pie is faster to read at a glance than a row count.

8\. AI-insight cards (1 per tab):

Conduct: "Pattern detected: \[top agentId or vendorId\] has \[count\] threat-language instances in \[N\] days — \[% of their total calls\]." Signal taxonomy: threat_language, profanity, harassment_pattern, public_shaming.

Distress: "Worst engagement: \[vendorId\] — distress detected in \[N\] calls, engaged in \[M\] (\[%\])." Signal taxonomy: customer_distress + empathy_failure.

9\. Filters (right panel):

\- Agent search; Vendor dropdown (VendorBPOScore names); Product (Cards/PL/HL/Auto); DPD bucket range; Flag type (multi-select checkboxes); Date range.

Drill-down:

\- "View evidence" → S3 Obligation Detail (OBL-010 or OBL-011), signal pre-selected.

\- Agent name → filtered view of all that agent's RecoveryConductSignal records (same screen, filter applied).

\- Vendor name → S7 (Vendor Governance Hub, filtered to that vendor).

10\. NOT on this screen:

\- No data-governance controls — OBL-013 boundary. Do not show borrower data-feed audit or DPDP exposure.

\- No dialer scheduling or time-window enforcement — Fluid detects non-borrower language, not dialer configuration.

\- No legal-action workflow — graduated escalation is UC-06, deferred to v2.

Empty states:

\- Conduct Violations: "No conduct violations detected in the selected period."

\- Distress Engagement: "No distress signals detected. All calls in the selected period showed no financial-hardship or distress language."

\---

SCREEN S6 — VULNERABLE CUSTOMER HUB

UC-08 (Bereaved-Customer Empathy Monitor) + UC-24 (Vulnerable-on-General-Queue Router)

Obligations: OBL-027 (EXT: branch-dependent leg flagged); CO-i-07 cross-cuts OBL-011, OBL-027, OBL-028, OBL-033, OBL-034.

Entities: CustomerInteractionSignal (vulnerable-signal types), InboundQueueSignal.

1\. Screen name: Vulnerable Customer Hub

2\. Purpose: Detect vulnerable customers (bereaved, distressed, fraud victim, PwD, MSE) before and after specialist routing; surface empathy failures on the general queue.

3\. Primary user + business question:

L2 (CCO): "Are we identifying and routing vulnerable customers before empathy failure occurs?"

L3: "Which agents on the general queue are handling vulnerable customers without specialist support?"

4\. Layout:

Header: 4 KPI tiles. Body: two tabs — "Bereavement & Deceased Claims" (UC-08) and "Vulnerable on General Queue" (UC-24). Both tabs show a signal feed and an agent-empathy table.

5\. KPI cards (4):

\- "Bereaved-customer calls detected (last 7 days)" — CustomerInteractionSignal count where signalType includes bereavement markers and interactionType=service_call.

\- "Empathy failures on general queue (last 7 days)" — signalType=empathy_failure count where InboundQueueSignal.queueName='General Service'.

\- "Specialist routing triggered (last 7 days)" — count of InboundQueueSignal records where downstreamComplaintCorrelation is null AND a specialist desk handoff was recorded. (Proxy: if integration with ACD routing is live via INT-007; else "Requires ACD integration" note.)

\- "Deadline: Deceased Customers compliance" — countdown to 31 Mar 2026 (this date has now passed — displayed as "PASSED" in grey with date; retained for audit reference).

6\. Tables:

Tab "Bereavement & Deceased Claims". Entity: CustomerInteractionSignal filtered to signalType containing bereavement + empathy markers. Columns:

\- Severity \[badge+text\]

\- Direction \[INBOUND / OUTBOUND\]

\- Agent

\- Transcript snippet (e.g., "mere husband ka abhi operation hua hai" — truncated)

\- Empathy score \[0–100 from linked EvidenceItem, shown as coloured score bar\]

\- Repeat contact flag \[from RepeatContactPattern — if same customer appears > 1 time\]

\- Settlement status \[if linked to OBL-027 EvidenceItem — "Settlement initiated" / "Pending" / "Unknown"\]

\- Branch-dependent leg note \[small icon if branch_visit interactionType: "Branch recording required for full coverage"\]

Tab "Vulnerable on General Queue". Entity: InboundQueueSignal joined to CustomerInteractionSignal (direction=INBOUND, vulnerable signal types). Columns:

\- Severity \[badge+text\]

\- Vulnerability type detected \[Bereavement / Financial distress / Fraud victim / PwD / MSE — from signalType, human labels\]

\- Queue (queueName from InboundQueueSignal)

\- Agent

\- Specialist routing recommended \[Yes/No\]

\- Routing outcome \[Routed to specialist / Remained on general — if ACD integration live; else "Unknown — ACD not connected"\]

\- Transcript snippet

\- Alert link

7\. Charts:

\- Empathy score distribution (Tab 1 header): Recharts BarChart — buckets 0-20, 21-40, 41-60, 61-80, 81-100, Y-axis: call count. Reason: distribution shows whether empathy failures are clustered at particular agents (training problem) or universal.

\- Vulnerable signal type mix (Tab 2 header): Recharts PieChart — proportions of Bereavement / Distress / Fraud-victim / PwD / MSE across detected vulnerable signals this week. Reason: proportion drives specialist-desk staffing decisions.

8\. AI-insight cards (1 per tab):

Tab 1: "Empathy failure rate for bereaved customers: \[%\] of \[N\] calls this week. Repeat-contact rate: \[%\] called back within 7 days." Signal taxonomy: empathy_failure, customer_distress.

Tab 2: "Vulnerable signals detected on general queue before routing: \[count\] this week. Top unrouted type: \[vulnerabilityType\]." Signal taxonomy: vulnerable-on-general-queue-detection (CO-i-07).

9\. Filters (inline above each tab table):

Agent search; date range; vulnerability type filter (Tab 2); severity multi-select.

Drill-down:

\- Any row → S3 Obligation Detail (OBL-027 for Tab 1, relevant OBL for Tab 2), with that signal pre-selected.

\- Repeat-contact flag → S10 (Repeat-Contact Module), filtered to that customer's repeat pattern.

\- Specialist routing recommended / unknown → S12 (Integrations), scrolled to INT-007 ACD/CTI entry.

10\. NOT on this screen:

\- No settlement workflow or deceased-account operations — Fluid monitors the interaction, not the settlement process (OBL-022 boundary analogy).

\- No PwD accessibility journey audit — that is the product team's obligation (OBL-029 boundary note shown only if user navigates to that OBL via S3).

\- No branch KYC monitoring — branch recording precondition; boundary note shown on OBL-027 cards only.

Empty states:

\- Tab 1: "No bereaved-customer signals detected in the selected period."

\- Tab 2: "No vulnerable signals detected on general queue. Specialist routing data unavailable — ACD integration required."

\---

SCREEN S7 — VENDOR GOVERNANCE HUB

UC-10 (BPO / Contact-Centre Vendor Governance Scorecard). Obligation: OBL-037.

Entity: VendorBPOScore.

1\. Screen name: Vendor Governance Hub

2\. Purpose: Produce supervisor-acceptable evidence of vendor governance at 100% interaction coverage — the Outsourcing Directions 2025 answer.

3\. Primary user + business question:

L4: "Which vendors are below benchmark, and do I have an attestation pack the supervisor will accept?"

L3 (Vendor Governance Head): "Which vendor needs consequence management this week?"

4\. Layout:

Header: 4 KPI tiles. Body: Vendor comparison table (full width). Below: per-vendor drilldown accordion (click vendor row to expand obligation-level scores). Right side: "Generate Attestation Pack" panel (always visible, 280px).

5\. KPI cards (4):

\- "Vendors monitored at 100%" — count of VendorBPOScore where fluidCoveragePct=100% vs legacy sampleCoveragePctLegacy.

\- "Vendors below benchmark vs in-house" — count where benchmarkVsInhouse=WORSE.

\- "Severe exceptions (last 30 days, all vendors)" — sum of severeExceptionCountLast30d.

\- "Outsourcing compliance deadline" — countdown to 10 Apr 2026 (now passed — "PASSED" in grey, retained for audit reference).

6\. Tables:

Main vendor table. Entity: VendorBPOScore. Columns:

\- Vendor name (vendorName)

\- Vendor type \[pill: BPO voice / Recovery agency / DSA / DMA\]

\- Fluid coverage \[% — "100%" in teal; anything < 100% in amber with note\]

\- Overall conduct score \[0–100 score + colour bar: red &lt; 60, amber 60–75, green &gt; 75\]

\- Complaint rate / 10k (complaintRatePer10k)

\- Severe exceptions / 30d (severeExceptionCountLast30d)

\- Benchmark vs in-house \[BETTER (teal) / PARITY (grey) / WORSE (red) — each as coloured pill+text\]

\- Last governance review (lastGovernanceReviewDate)

\- Attestation pack \[link icon if attestationPackUrl present; "Generate" button if not\]

Per-vendor accordion (expanded row): obligation-score breakdown from conductScoreByObligation JSON. Table: OBL-NNN | Obligation statement | Score | Compared to in-house avg.

7\. Charts:

\- Vendor conduct score comparison (above main table): Recharts BarChart — X-axis: vendor names, Y-axis: conductScoreOverall. Reference line: in-house average. Reason: instant visual of which vendors are below the bank's own standard — the core supervisory argument.

\- Score trend (in expanded accordion): 4-week LineChart per vendor (requires historical VendorBPOScore snapshots). Reason: trend is the governance narrative — a static score does not show improvement or deterioration.

8\. AI-insight cards (1):

"Highest-risk vendor: \[vendorName\] — \[severeExceptionCountLast30d\] severe exceptions, conduct score \[conductScoreOverall\], \[complaintRatePer10k\] complaints per 10k." Signal taxonomy: vendor-segmented conduct signal (all types at vendor level).

9\. Filters (inline above main table):

Vendor type filter (BPO voice / recovery agency / DSA / DMA); benchmark filter ("Show only WORSE"); date range for exception counts.

Attestation Pack panel (right, 280px):

\- Quarter selector (Q1/Q2/Q3/Q4 FY).

\- Vendor multi-select (default: all).

\- "Include: in-house benchmark comparison" toggle.

\- "Generate PDF attestation pack" button → triggers export of VendorBPOScore + per-obligation breakdown + EvidenceItem cluster-proof records for selected vendors and quarter.

\- Last generated: date + download link.

Drill-down:

\- Click vendor name → expanded accordion (obligation breakdown).

\- Click OBL-NNN in accordion → S3 (Obligation Detail, filtered to that vendor's signals).

\- Click "Severe exceptions" count → S1 (Worklist filtered to that vendorId, severity HIGH/CRITICAL).

10\. NOT on this screen:

\- No agent training certificates — that is HR/vendor management system (INT-006). Show "HR system" note if user clicks on an agent who lacks a certificate.

\- No DSA-level monitoring (UC-17 deferred to v2) — show "Coming in v2" label on DSA/DMA vendor rows.

\- No data-governance audit of borrower-data feeds (OBL-013 boundary) — not shown.

Empty states:

\- Main table: "No vendors configured. Add vendor records to begin monitoring."

\- Attestation pack: "No attestation pack generated for this quarter. Click 'Generate' to create."

\---

SCREEN S8 — RCA & BOARD PACK STUDIO

UC-07 (Quarterly RCA & Top-5 Grounds Engine). Obligations: OBL-023 + OBL-024.

Entity: RCACluster + EvidenceItem (cluster_proof type).

1\. Screen name: RCA & Board Pack Studio

2\. Purpose: The quarterly Root-Cause-Analysis engine — cluster complaint patterns by agent/branch/region/product/campaign, generate the CSCB pack, and export the annual top-5 grounds disclosure.

3\. Primary user + business question:

L4: "Can I produce a RCA methodology that my auditor and the RBI supervisor will accept? Can I generate the CSCB pack?"

L3 (Head of Customer Service): "What systemic patterns should I brief the Board on this quarter?"

4\. Layout:

Header: 3 KPI tiles. Body: two tabs — "Active Clusters" (default) and "Board Pack Builder". Left-side persistent panel (300px) on desktop: Cluster filter sidebar. Mobile: filters collapse to top chip strip.

5\. KPI cards (3):

\- "Active clusters (rising)" — RCACluster count where trendDirection=RISING and boardPackInclusion=true.

\- "Interactions contributing (current quarter)" — sum of RCACluster.volume across boardPackInclusion=true clusters.

\- "Top-5 grounds deadline" — countdown to next annual report date (configurable — defaulting to 30 Jun 2026 as a proxy for quarterly board pack). Shown as "30 Jun 2026 — CSCB pack due."

6\. Tables:

Tab "Active Clusters". Entity: RCACluster. Columns:

\- Severity score \[0–100 score + colour bar\]

\- Cluster theme (clusterTheme)

\- Conduct theme (themeId → ConductTheme.themeName)

\- Volume (interaction count)

\- Trend \[RISING (red arrow) / STABLE (grey) / FALLING (green arrow) — arrow icon + text\]

\- Key dimension (top entry from dimensionBreakdown JSON — e.g., "Campaign C-2026-MAY-04 (288)")

\- First detected / Last updated

\- Board pack inclusion \[toggle: include/exclude\]

\- Recommended remediation (truncated to 80 chars, full on hover)

\- "View evidence" link → EvidenceItem drawer

Tab "Board Pack Builder":

\- List of clusters marked boardPackInclusion=true, ordered by severityScore DESC.

\- Inline editable remediation-action field per cluster (for IO/Conduct Risk to annotate before submission).

\- "Year-on-year comparison" panel: if prior quarter data exists, shows volume change per cluster theme.

\- "Export CSCB pack" button → PDF output containing: cluster list + methodology note + evidence refs + remediation actions + year-on-year movement.

\- "Export top-5 grounds" button → top 5 RCACluster by volume, formatted for annual report disclosure section.

7\. Charts:

\- Cluster severity heatmap (left panel sidebar): Recharts Treemap — each rectangle is an RCACluster, sized by volume, coloured by severityScore. Reason: treemap simultaneously communicates volume (size) and severity (colour) for all clusters — a table of numbers cannot do both at once.

\- Dimension breakdown (expanded cluster row): Recharts HorizontalBarChart — top 5 entries from dimensionBreakdown JSON (e.g., agent, branch, region, product). Reason: horizontal bars handle long label names (branch names, campaign IDs) better than vertical.

8\. AI-insight cards (1, above cluster table):

"Fastest-rising cluster: \[clusterTheme\] — \[volume\] signals, \[trendDirection=RISING\], first detected \[firstDetected\]. Recommended remediation: \[recommendedRemediation\]." Signal taxonomy: root-cause clusters.

9\. Filters (left sidebar):

\- Conduct theme multi-select (8 themes).

\- Trend: RISING / STABLE / FALLING chips.

\- Severity score range slider.

\- Date range (firstDetected window).

\- Dimension type: agent / branch / region / product / campaign.

\- "Board pack only" toggle.

Drill-down:

\- Click cluster row → expand dimension breakdown + EvidenceItem drawer.

\- "View evidence" → EvidenceItem records of type cluster_proof, with AUD-NNN reference and download.

\- Click dimension entry (e.g., "AGT-2014") → S1 Worklist filtered to that agentId.

\- Click conduct theme label → S2 Themes Index, filtered to that theme.

10\. NOT on this screen:

\- No individual signal transcript player — that lives in S1/S3 drilldown.

\- No IO review or decision — OBL-021 boundary. Note in board pack export: "IO independent review is conducted by the Internal Ombudsman. This pack supports the IO review process but does not replace it."

\- No complaint submission to RBI — not Fluid's role.

Empty states:

\- Cluster table: "No clusters generated for the selected period. Clusters are updated nightly from the previous day's interactions."

\- Board Pack Builder: "No clusters marked for board inclusion. Toggle 'Include in board pack' on clusters above."

\---

SCREEN S9 — BUNDLING & CONSENT HUB

UC-04 (Cross-Sell Consent & Compulsory-Bundling Detector). Obligation: OBL-002.

Entity: CustomerInteractionSignal (signalType=bundling_pressure / consent_extraction).

1\. Screen name: Bundling & Consent Hub

2\. Purpose: Detect compulsory-bundling language and consent-extraction patterns across 100% of cross-sell interactions.

3\. Primary user + business question:

L2 (CCO): "Are agents or campaigns using bundling language that violates the 1 April 2026 para 86A obligation?"

L4: "What is our RB-IOS exposure from mis-sold bundled products?"

4\. Layout:

Header: 3 KPI tiles. Body: two columns — left 65%: signal table. Right 35%: campaign-level pattern panel. No persistent side panel — filters above the table inline.

5\. KPI cards (3):

\- "Bundling violations detected (last 7 days)" — CustomerInteractionSignal count where signalType=bundling_pressure or consent_extraction, last 7 days.

\- "Campaigns with violations" — count of distinct affectedCampaignIds across linked RiskAlerts.

\- "Obligation effective since" — "1 Apr 2026 (In Force)" for OBL-002 para 86A. Static reference card.

6\. Tables:

Signal table. Entity: CustomerInteractionSignal (bundling_pressure + consent_extraction). Columns:

\- Severity \[badge+text\]

\- Direction \[INBOUND / OUTBOUND\]

\- Signal type \["Bundling pressure" / "Consent extraction" — human labels\]

\- Agent / Vendor

\- Campaign ID (affectedCampaignIds from linked RiskAlert — if available)

\- Product (productCode)

\- Transcript snippet (e.g., "madam, salary account ke saath insurance lena compulsory hai")

\- Timestamp

\- Customer objection present \[Yes / No — derived from follow-up sentiment in CustomerInteractionSignal\]

\- "View evidence" link

7\. Charts:

\- Campaign-level pattern (right panel): Recharts BarChart — X-axis: campaign IDs, Y-axis: bundling signal count. Colour: red if violations > 10% of campaign calls. Reason: campaign-level view is the action trigger — agent retraining is insufficient if the script itself contains bundling language.

8\. AI-insight cards (1):

"Top violation pattern: \[signalType, productCode, agentId or campaignId, count in last 7 days\]." Signal taxonomy: bundling_pressure, consent_extraction.

9\. Filters (inline above table):

Direction (INBOUND / OUTBOUND), signal type chips, campaign search, product, vendor, date range.

Drill-down: any row → S3 Obligation Detail (OBL-002), signal pre-selected.

10\. NOT on this screen:

\- No CRM consent flag display — CRM integration (INT-001) is a co-control; show note "CRM consent flags available when CRM integration is connected" if INT-001 not integrated.

\- No suitability assessment — UC-13 is deferred to v2.

\- No branch-channel monitoring — branch-dependent leg flagged per BND-008.

Empty states:

\- Signal table: "No bundling or consent-extraction signals detected. All monitored cross-sell calls are compliant in the selected period."

\- Campaign panel: "No campaign data available. Campaign IDs are populated from linked RiskAlert records."

\---

SCREEN S10 — FCR / REPEAT-CONTACT MODULE

UC-22 (Repeat-Contact Root-Cause Engine). Cross-cuts OBL-014, OBL-020, OBL-023, OBL-026, OBL-027, OBL-036.

Entity: RepeatContactPattern.

1\. Screen name: FCR & Repeat-Contact Module

2\. Purpose: Surface same-customer same-issue repeat contact clusters — the operational ROI line (cost of avoidable contacts) alongside the conduct case (repeat contact as evidence of unresolved complaint).

3\. Primary user + business question:

L3 (Head of CX): "Which issues are generating the most repeat contacts, and where is my team failing to resolve at first call?"

L4: "Where is repeat contact creating RB-IOS exposure through unresolved complaints?"

4\. Layout:

Header: 4 KPI tiles. Body: two tabs — "By Issue Category" (default) and "By Customer" (for case-level investigation). No persistent side panel.

5\. KPI cards (4):

\- "Repeat contacts (last 7 days, 2+ contacts same issue)" — RepeatContactPattern count where contactCountInWindow >= 2, windowDays=7.

\- "Customers with 3+ contacts (30 days)" — count where contactCountInWindow >= 3, windowDays=30.

\- "Top repeat issue" — issueCategory with highest volume (RepeatContactPattern, top by contactCountInWindow sum).

\- "Escalation stage reached RB-IOS" — count where escalationStage=RBIOS_escalated.

6\. Tables:

Tab "By Issue Category" (aggregated). Entity: RepeatContactPattern grouped by issueCategory. Columns:

\- Issue category (issueCategory)

\- Linked obligations \[FK array pills — e.g., "OBL-014 Document release" "OBL-020 Complaint capture"\]

\- Total repeat contacts (sum of contactCountInWindow)

\- Distinct customers affected

\- Average contacts per customer

\- Escalation risk \[highest escalationStage reached: inbound_repeat / complaint_filed / IO_referred / RBIOS_escalated — coloured label\]

\- Closure clarity score (avg closureCommunicationClarityScore — 0–100)

\- "View cases" link

Tab "By Customer" (case-level). Entity: RepeatContactPattern. Columns:

\- Customer ID (hashed)

\- Issue category

\- Contact count (contactCountInWindow)

\- Channels used (channelsUsed icons)

\- Agents contacted (first 2 shown + "+N")

\- First contact (firstContactTs)

\- Escalation stage

\- Closure clarity score

\- "View journey" link → opens a per-customer contact-timeline drawer

7\. Charts:

\- Issue category volume (By Issue tab, above table): Recharts HorizontalBarChart — top 10 issue categories by total repeat contacts. Reason: ranking by volume reveals where operations investment will have the biggest FCR impact.

\- Customer contact-timeline (drawer, By Customer tab): custom timeline component (not Recharts) showing each contact as a node on a horizontal line — channel icon, agent, date. Reason: sequence matters for conduct evidence (when was a complaint first expressed, when was it logged, when was it resolved).

8\. AI-insight cards (1):

"Highest repeat-contact issue: \[issueCategory, total contacts, % escalated to IO or RB-IOS\]." Signal taxonomy: repeat-contact patterns (CO-i-04).

9\. Filters (inline above each tab):

Window selector (7 / 14 / 30 days); issue category search; escalation stage filter; date range.

Drill-down:

\- "View cases" (By Issue tab) → switches to By Customer tab, filtered to that issueCategory.

\- "View journey" (By Customer tab) → opens per-customer timeline drawer. In drawer: each contact node links to CustomerInteractionSignal for that interaction (transcript snippet visible).

\- Linked obligation pills → S3 (Obligation Detail for that OBL).

10\. NOT on this screen:

\- No complaint resolution workflow — CMS manages SR lifecycle.

\- No refund timeline tracking — OBL-036 boundary (evidence support only).

\- No IO referral status — that is the IO's system.

Empty states:

\- By Issue: "No repeat-contact patterns detected in the selected window. Each customer contacted only once per issue."

\- By Customer: "No customers with multiple contacts in the selected window."

\---

SCREEN S11 — REGULATORY HORIZON (now a panel within S2; retained as standalone for deep-link navigation)

NOTE: Per the IA tightening proposal, the Regulatory Horizon timeline is a collapsible panel within S2. This screen spec covers the standalone deep-link version (URL: /regulatory-horizon) for users who bookmark it directly.

1\. Screen name: Regulatory Horizon

2\. Purpose: Full-width timeline of all key regulatory deadlines mapped to obligations and coverage status.

3\. Primary user + business question:

L4: "Which deadlines require budget commitment, and what is our current Fluid coverage against each?"

4\. Layout:

Header: 2 KPI tiles. Body: full-width vertical milestone list (more readable than horizontal scroll on this standalone view). Each milestone is an expandable row.

5\. KPI cards (2):

\- "Deadlines within 60 days" — count of Regulation/Obligation records with effectiveDate within 60 days. Red if > 0.

\- "Obligations not yet monitored by Fluid CX" — Obligation count where buildTier != MAIN_FEATURE AND effectiveDate is future.

6\. Tables:

Milestone list. Columns per milestone:

\- Date (formatted DD MMM YYYY + countdown badge)

\- Regulation short name + circular reference (tooltip on hover)

\- Linked obligations (OBL-NNN pill list, max 3 shown + "+N more")

\- Status \[IN_FORCE / DRAFT_PROPOSED badge\]

\- Fluid coverage \[capability label pill per linked obligation\]

Expandable row: obligation detail sub-table (OBL-NNN, statement, buildTier label, owner role, open exception count).

7\. Charts: None — timeline as a list is more accessible than a scrollable SVG on this standalone view.

8\. AI-insight cards: None — data is regulatory reference, not AI-generated.

9\. Filters: Filter by status (IN_FORCE / DRAFT_PROPOSED). Filter by "Monitored by Fluid CX only."

Drill-down: Click obligation pill → S3. Click regulation name → tooltip with circular ref + issuing body.

10\. NOT on this screen:

\- No signal data or exception counts in the milestone list (except linked OBL open count).

\- No vendor governance.

\- No out-of-scope milestone entries except where the boundary note clarifies "this deadline belongs to CMS vendor" (OBL-022 30 Jun 2026).

Empty states: N/A — deadlines are static reference data from Regulation entity.

\---

SCREEN S12 — HONEST-GAP & INTEGRATIONS

Entities: CapabilityBoundary + IntegrationDependency.

1\. Screen name: Honest-Gap & Integrations

2\. Purpose: Show exactly what Fluid does NOT solve, with the named partner system; show integration health for co-control obligations; earn CRO trust through explicit boundary disclosure.

3\. Primary user + business question:

L4: "Which obligations are NOT covered by Fluid, and which system owns them?"

L3: "Which integrations do I need to configure to unlock co-control monitoring?"

4\. Layout:

Header: 2 KPI tiles. Body: two sections separated by a visual divider — "Capability Boundaries" (CapabilityBoundary table) and "Integration Health" (IntegrationDependency table). No side filter panel.

5\. KPI cards (2):

\- "Obligations outside Fluid CX scope" — CapabilityBoundary count where displayInDashboard=DO_NOT_BUILD_BANNER.

\- "Integrations connected" — IntegrationDependency count where currentlyIntegratedFlag=true vs total.

6\. Tables:

Capability Boundaries. Entity: CapabilityBoundary. Columns:

\- Obligation (oblId + statement, or cross-OBL description for preconditions like branch recording)

\- Why outside scope (boundaryReason)

\- Who owns it (primaryControlOwner)

\- Display type \[DO_NOT_BUILD_BANNER / EVIDENCE_ONLY_CARD / HONEST_GAP_SHELF — translated to: "Outside Fluid CX scope" / "Evidence support only" / "Acknowledged gap" — as coloured pills per global capability label rules\]

\- Linked regulation

Integration Health. Entity: IntegrationDependency. Columns:

\- Integration name (externalSystemName)

\- System type \[pill: CRM / CMS / Dialer / Fraud risk / IVR / etc.\]

\- What it provides (whatItProvides, truncated)

\- Obligations it unlocks (dependentObligationIds, first 3 as pills)

\- Status \[Connected (teal) / Partial (amber) / Not connected (red) / Roadmap (grey)\]

\- Roadmap target (roadmapTargetQuarter if not yet connected)

7\. Charts: None — this screen is a reference register, not a data-analytics surface.

8\. AI-insight cards: None.

9\. Filters: None beyond section headers. Search bar above each table for obligation/system name.

Drill-down:

\- Click obligation in Boundaries table → S3 (Obligation Detail, boundary note visible).

\- Click integration row (Connected or Partial) → configuration status drawer showing which obligationIds are currently receiving data vs which are pending.

\- Click "Roadmap" status integration → tooltip: "\[System\] integration is on the Fluid CX roadmap for \[roadmapTargetQuarter\]. Contact your Fluid CX account team to expedite."

10\. NOT on this screen:

\- No exception alerts or signal feeds — this is a reference screen only.

\- No buildable features for out-of-scope items — DO_NOT_BUILD discipline enforced. The screen describes the boundary; it does not contain any monitoring module for the out-of-scope obligations.

Empty states:

\- Boundaries: "No capability boundaries configured. Contact Fluid CX admin."

\- Integration Health: "No integrations configured. Visit the Admin panel to add integration credentials."

\---

END OF UX SPEC — Sonnet Pass 5v2

13 screens (S0–S12) × 10 fields each.

MVP use cases covered: UC-01, UC-02, UC-03, UC-04, UC-07, UC-08, UC-10, UC-22, UC-23, UC-24.

Entities referenced: Regulation, Obligation, ConductTheme, CustomerInteractionSignal (+ direction EXT-1), RiskAlert, EvidenceItem, ControlOwner, ExecutivePersona, RCACluster, VendorBPOScore, RecoveryConductSignal, ComplaintCaptureSignal (+ first-90s EXT-2), RepeatContactPattern (entity 18), InboundQueueSignal (entity 16), IntegrationDependency, CapabilityBoundary.

Spine (Regulation → Obligation → Signal → Owner → Evidence → Action) expressed on every screen.