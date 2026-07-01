# LiSN / Fluid CX · Nuvama — CONVERSATION-ONLY Package (v2) — Stages 4–11
**`LiSN_Nuvama_ConversationOnly_v2_Stages4to11.md`** — supersedes the book-based versions of Stages 4–9C and 11 for the conversation-only build. The v2 build prompt is separate: `Stage10_Cursor_Build_Prompt_LiSN_Nuvama_v2_ConversationOnly.md`.

> **Two corrections, binding throughout.**
> 1. **Conversation-only data.** Every metric, card, drill and number derives **solely from the interaction corpus** — calls, WhatsApp, service calls, app/portal messages, email, complaints, NPS/CSAT. **No book/transaction data** (no AUM, NNM, flows, redemptions, holdings, portfolio, proposal-funding, revenue, ₹-at-risk). Book-dependent cards are removed; the book join is a **later tier**, not this build.
> 2. **Reference structure.** Match **`CreditCardsV3DrillDownScreens`** (drill-down screens) and **`role-based/retail_banking/head_retail`** (Head of Retail Banking — service-promise + complaints). **Not** `HeadOfCreditCardsDashboard`. The repo components are the source of truth.
>
> **Persona kept:** Rahul Jain (President & Head, Nuvama Wealth) primary + Head of CX co-anchor — *can flip to CX-led on request; this conversation-only framing sits naturally with the CX seat.* **Domain spine:** Interaction → Signal → Issue → Evidence → Action. **Boundary:** owns the conversation corpus + insight store; **no book consumed in this build**; never auto-fires (draft → human approves → audit-logged); cohort-level; every AI element ✦-marked. **Brand rules** at the foot apply to every section.

---

# Stage 4 (revised) — Personas

People unchanged. The conversation-only dashboard surfaces **conversation-side leading indicators** of Rahul Jain's concerns rather than book figures.
- **Rahul Jain (primary).** Mandate unchanged (HNI/affluent P&L). On-screen, his view is conversation signals: **attrition-risk language** (the early signal that *precedes* an NNM leak), **service-promise adherence**, **complaint/NPS root-cause**, **suitability-language assurance**. **On-screen KPIs are conversation-only:** NPS (~85), CSAT, complaint/escalation rate, service-promise adherence %, attrition-risk-language prevalence, suitability-language coverage %. **Trust threshold (reframed):** a card must show **conversation impact** (clients/interactions affected) + the conversational **evidence** + a recommended **action** + a **routing** target — *no rupee figure*. Remove-list unchanged (no per-RM QA scorecards, no raw transcripts/players, no CRO case queue on his face, no live-ops tickers).
- **Head of CX (co-anchor).** Owns the corpus, NPS, complaints, service promises, SCORES/SMART-ODR. Natural primary for a conversation-only build.
- **CRO (Keyur Ajmera), COO (Riyaz Marfatia), CTO (Harsh Jha)** — control/champion seats as before.
- **Open:** Wealth-led vs CX-led primary (this build kept Wealth-led).

---

# Stage 5 (revised) — Capabilities & data model (conversation-only)

**Entity model.** `Interaction`, `Complaint`, `NPS_Response`, `CSAT_Touchpoint`, `ServicePromise`, `Cohort` (conversation metadata only), `Signal`, `Action`, `AuditEvent`. **Removed:** Flow, Holding, Proposal, RiskProfile, Product-AUM.
- `Interaction {id, channel, ts, cohortId, sentiment, intentTags[], themeTags[], suitabilityLanguagePresent, queryType, talkListenRatio, escalationFlag, repeatContactFlag, promiseMade?, promiseType?}`
- `Complaint {id, cohortId, theme, openedTs, atrDueTs, status, escalationFlag}` · `NPS_Response {id, cohortId, score, verbatimTheme, ts}` · `CSAT_Touchpoint {id, cohortId, score, ts}`
- `ServicePromise {id, cohortId, sourceInteractionId, type, dueTs, status(kept/broken/overdue), evidenceInteractionId?}`
- `Cohort {id, segment, region, branch, rmEwmId, channel, tenureBand, clientCount, interactionCount}` — **no AUM**
- `Signal {id, card, cohortId|cellId, severity, confidence, conversationImpact, themeEvidence[], ruledOut[], owner, recommendedAction, aiMarker}` · `Action {…, status, approverId, parentSignalId}` · `AuditEvent {…, immutable}`

**Differentiating frame (conversation-only).** Not the voice↔book join (later tier). Here the wedge is **100% conversation coverage stitched across every channel into one governed signal layer** — what Nuvama's point-AI (single-call analytics, trade-confirmation audit) does *not* do as a persistent cross-channel corpus.

**Capabilities (all conversation-derived).** O-1 intent/sentiment-shift → attrition-risk language (DENSE) · O-2 complaint-theme emergence & clustering (BURSTY) · O-3 suitability-language presence/absence (SPARSE) · O-4 NPS/CSAT verbatim theme extraction · O-5 query-intent extraction (guarantee/access/protection) · O-6 service-promise extraction & adherence · O-7 escalation/repeat-contact detection. *(All C-* book capabilities removed.)*

**Pipeline (conversation-only).** Ingest corpus → feature layer (conversation features at cohort grain) → baseline store (DENSE percentile bands / BURSTY median+IQR / SPARSE Poisson, **event-excluded**) → detection → root-cause (conversation rule-outs: market-wide tone vs cohort-specific) → **severity in conversation terms** → confidence (advisory if coverage <90%) → insight store → cards → **draft** routing → AI analyst. **Event exclusion still applies** (a market-volatility week lifts anxiety language across all cohorts → exclude before baselining).

**Unit blocks (conversation-only; each carries an honesty line).**
- **Attrition-risk language** (DENSE+BURSTY): tone shift to exit/liquidity/anxiety + reduced engagement + rising friction. *Honesty: from conversation only — an early signal, not a confirmed redemption; no book data used.*
- **Service-promise adherence** (from O-6): promises made vs referenced-as-kept/broken/overdue. *Honesty: from what was committed and later referenced on calls.*
- **Complaint theme heat-map** (BURSTY): themes × branch/channel + escalation + ATR. *Honesty: from complaints + service conversations.*
- **NPS/CSAT root-cause** (BURSTY over DENSE themes): themes behind a score move. *Honesty: score from survey; cause from conversation themes.*
- **Suitability-language gap** (SPARSE): advisory calls missing mandated disclosure language. *Honesty: detects whether the disclosure was said; does not assess the client's holdings — conversation-only.* Surveillance prioritisation, maker-checker, never an AI verdict (Reg 16C).

**KPI definitions (conversation-only).** NPS (segment), CSAT, complaint rate, escalation rate, **service-promise adherence %**, **attrition-risk-language prevalence**, **suitability-language coverage %**, first-contact-resolution, repeat-contact rate — each a plain formula over corpus/complaint/NPS fields. **No book KPI.**

**Boundary.** Owns the conversation corpus + insight store; **consumes no book in this build**; never auto-fires; cohort-level; ✦-marked.

---

# Stage 6 (revised) — UI specification (conversation-only; new reference)

**Reference:** match `CreditCardsV3DrillDownScreens` (drill structure) + `head_retail` (service-promise + complaints command view). Light, executive density.

**Screens (4 + drills, no Layer-3):**
1. **Command View** (composed like `head_retail`): header + **Service-promise** panel + **Complaints** panel + **NPS/CSAT** + an **Attrition-risk signal rail** (✦) + 3 executive tiles (**NPS**, **complaint/escalation rate**, **service-promise adherence %**) + `FilterBar`. Time default **this week vs last**.
2. **Attrition-risk Evidence Drill** (CreditCardsV3 pattern): exit-language excerpts + theme breakdown + ruled-out + draft action.
3. **CX/Service Lens**: NPS/CSAT decomposition + complaint heat-map (route by `cellId`).
4. **Suitability-language Worklist** (CRO lens): missing-language items + maker-checker + boundary banner.

**Cards:** Attrition-risk language · Service-promise adherence · Complaint heat-map · NPS/CSAT root-cause · Suitability-language gap (+ optional Unresolved-objection). **Removed:** proposal-to-flow, NNM-leak sizing, AUM-at-risk, portfolio mismatch.

**Seven design rules** applied (action-first; explainability-on-demand with written lines; time-travel this-week-vs-last; signal-triage; two-layers-only; executive/light density; no internal machinery/no "agent"/"chargeback"/**no ₹/book figure** on a face). **Goal→capability→UI** maps each persona question to a conversation capability (Q on NNM-leak → **attrition-risk language** proxy; Q on conversion → **unresolved-objection** proxy; Q on conduct → suitability-language gap). **Card anatomy** = methodology monitor-rail slots with the **conversation honesty line** + ✦. Impact shown in **conversation terms**, never rupees.

---

# Stage 7 (revised) — UX blueprint (conversation-only)

**Primary flows** (≤2 clicks; each traverses the spine, ends in a draft action/owner): attrition-risk → evidence drill → Route to Market Head; service-promise → promise-ledger drill → Route to branch/service owner; complaint → matrix-cell drill → Route to CX/ops; NPS → theme decomposition → Route to CX; suitability-language gap → worklist → Route to CRO/Compliance (maker-checker).

**Five distinct drill signatures:** evidence-pack (attrition-risk) · **promise ledger** (service-promise: made/kept/broken/overdue with source + follow-up interactions) · matrix-cell routed by `cellId` (complaints) · decomposition (NPS) · queue/worklist (suitability-language).

**Process-gap diamond:** an attrition/complaint conversation surfaces a **suitability-language gap** → "not yours to action" → routed to the CRO worklist carrying the conversation evidence.

**Storyline (conversation-only):** attrition-risk language hook → exit-language excerpts (the signal before the book shows it) → service-promise + complaint root-cause → suitability-language gap to the CRO → "one governed layer over 100% of conversations." **States** (selection/filter/loading/empty/error → advisory on <90% coverage; **live rail resets on lens switch**). **Human-gate/maker-checker** on every action; CRO worklist accept/return-with-reason; boundary banner.

---

# Stage 8 (revised) — Frontend architecture (conversation-only; new reference)

**Component tree.**
- *Primitives:* `DashboardThemeProvider` (light default), `AppShell`/`CollapsibleSidebar`, `LayoutGrid`, `CardShell`, `SectionHeader`, `FilterBar`.
- *Data components:* `ExecutiveTile` (conversation KPI), `AttritionRiskRail`+`InsightCard` (✦), `ServicePromiseLedger`, `ComplaintHeatmapMatrix` (route-by-cellId), `NPSDecompositionPanel`, `SuitabilityWorklist`, `EvidenceDrillPanel`, `DrillPanel`. *(Removed ConversionFunnel — book-dependent.)*
- *Intelligence (✦):* `AIRiskSpikeMonitor` (attrition rail), `ExecutiveBrief`, `ExecutivePulse`, `FloatingAIDayGenerator`.
- *Screens:* `CommandView` (S1, head_retail composition) · `AttritionEvidenceDrill` · `CXServiceLens` · `SuitabilityWorklistScreen`.
- Each component states its feeding conversation entity.

**Routes:** `/` (default) · `/attrition/:cohortId` · `/promises/:cohortId` · `/complaints/:cellId` · `/nps/:themeId` · `/suitability/:itemId`. **Drill by item id, never a shared constant.** Lens switch **resets transient state + timers**.

**State (in-memory; NO browser storage):** `AppState { filters, comparisonBasis{window, baselineStore}, cohorts[], signals[], evidencePacks{[signalId]}, kpis{nps, csat, complaintRate, escalationRate, promiseAdherence, attritionLanguagePrevalence, suitabilityCoverage}, selected{cohortId,cellId,themeId,itemId}, governance{draftActions[], auditLog[]} }`. Seeded signals in `signals[]`; baselines in `comparisonBasis`; evidence in `evidencePacks`.

**Reference match:** `CreditCardsV3DrillDownScreens` + `head_retail` — study in repo, match exactly.

**Tech constraints:** React/TSX, multi-file; recharts, lucide-react (✦), Tailwind; **no localStorage/sessionStorage**; one global `@keyframes`; **unique SVG gradient id per chart instance**; timers cleared on unmount/lens-switch; drill-by-id.

---

# Stage 9A (revised) — Mock-data universe (conversation-only)

**Entities (no AUM):** 4 regions / 8 branches / 30 RMs (`RM-001…`) / 15 EWMs (`EWM-001…`) / **12 cohorts** `CH-01…CH-12` keyed by `{segment, region, branch, channel, tenureBand, clientCount, interactionCount}` / 6 product *labels for context only* (not as data). Monthly interaction volumes `[illustrative]`: calls ~9k (~92% transcribed), WhatsApp ~22k, service ~6.5k, app ~14k, email ~11k. NPS ~85 (segment baselines), complaints ~140/mo, CSAT 21 touchpoints.

**Comparison basis (conversation metrics, event-excluded):** per-cohort **attrition-risk-language prevalence** (DENSE p05/p50/p95) · **complaint-theme rate** (BURSTY median+IQR) · **suitability-language-present rate** (SPARSE ~99% baseline) · **service-promise adherence %** baseline · NPS/CSAT baselines.

**Control/corroboration:** peer cohorts (CH-01/CH-04/CH-07 same segment, distinguish market-wide tone from cohort-specific) · prior-cycle baselines · shared **market-event calendar** (a volatility week that lifts anxiety language everywhere) so a spike can be ruled market-wide.

**Reference data:** regions/branches; channels (RM-direct/EWM/Digital/Service); complaint theme taxonomy `[illustrative]` (delayed reporting, fee/charges clarity, performance concern, mis-set expectation, service responsiveness, statement/access); risk-band scale; SCORES 2.0 21-day ATR / SMART ODR; platforms referenced (Nuvama One, WhatsApp bot, grievance/SCORES registry).

**Consistency invariants:** complaint/NPS/promise totals tie out; a cohort's conversation numbers identical wherever shown; basis and current share units (% / counts); every id 9B references exists here; one shared event calendar. **No anomalies seeded here.**

---

# Stage 9B (revised) — Mock-data behaviour (conversation-only seeded signals)

- **SIG-A · Attrition-risk language · CH-07** (South Core-HNI, RM-direct): exit/liquidity/anxiety language in **47 clients** vs **6** baseline; repeat-contact + friction up; onset ~6 wks; peers CH-01/CH-04 stable → not market-wide; **High** → Route to South Market Head (Sandeep Chakraborti).
- **SIG-B · Service-promise · BR-S1:** **12 promises overdue / 9 broken** (callbacks, statements) vs baseline → Route to branch/service owner.
- **SIG-C · Complaint heat-map · `CELL-BRS1-DELREP`** (BR-S1 × "delayed reporting") above BURSTY baseline; ATR due 9 days; route by `cellId`.
- **SIG-D · NPS root-cause · South:** NPS **78 vs ~85**; "delayed reporting" + "performance concern" themes → Route to CX.
- **SIG-E · Suitability-language gap · CH-07/CH-08 advisory:** **8 calls per 1,000** missing mandated disclosure (vs ~0 baseline); ruled-out no documented exception; surveillance prioritisation, maker-checker → CRO/Compliance (Keyur Ajmera).

State payloads filled to the Stage-8 shape (signals[] + evidencePacks{}), all conversation-only; numbers tie to 9A; rule-outs use peer cohorts + the event calendar. **No book/₹ figure anywhere.**

---

# Stage 9C (revised) — Build-quality filter (conversation-only)

- **Product key:** Fluid/CX (confirm in `product_context_index.md`). **Altitude:** head (CL-012 density-by-seniority), light theme. **Profiles:** executive + cx + compliance.
- **Rule families → conversation components** (reconcile exact IDs against the installed `yaara-frontend-dashboard-skill` rulebook): executive-KPI cluster + AP/RP on `ExecutiveTile`; monitor-rail cluster + ✦/explainability on `AttritionRiskRail`/`InsightCard`; service-ledger + RP-no-attribution on `ServicePromiseLedger`; heatmap cluster + **route-by-cellId** (RP against route-by-constant) on `ComplaintHeatmapMatrix`; cx-decomposition on `NPSDecompositionPanel`; compliance-worklist + maker-checker on `SuitabilityWorklist`; CF-/LR- anchors for grid/F-pattern/spacing/AI-marker.
- **AUTO_REJECT (must not ship):** unit card missing conversation-evidence / action / routing; AI element without ✦; autonomous-action label; **any book/₹ figure on screen**; "agent"/"chargeback"/internal code/vendor name on a face; number with no spine; drill routed by a shared constant.
- **Precedence:** product/persona-specific > global; screen-specific not auto-generalised. **Gaps:** exact rule IDs to reconcile; EWM voice coverage thin (advisory caveat); flip altitude if CX-led. **Acceptance gate:** `frontend_review_checklist.md` at Stage 11 against the built UI.

---

# Stage 11 (revised) — Review / audit (conversation-only)

**Traceability:** each persona question → a **conversation** capability → UI → seeded signal (attrition-risk proxy for NNM-leak; unresolved-objection proxy for conversion; suitability-language gap for conduct) — ✅, with EWM voice-coverage flagged. **Seven design rules:** ✅ (incl. no ₹/book on a face). **Spine/boundary/honesty:** ✅ (draft→human→audit, maker-checker, ✦, cohort-level, no book consumed). **Methodology fidelity:** DENSE/BURSTY/SPARSE applied to conversation metrics; **event exclusion** carried; min-sample + hierarchy fallback; advisory-degrade on <90% coverage — ✅. **AUTO_REJECT** encoded at 9C ✅. **Bug-class pre-emptions** ✅ (drill-by-id, unique gradient ids, single @keyframes, timers cleared, no storage). **Brand** ✅.

**Open items before the live demo:** (1) **Wealth-led vs CX-led** primary — built Wealth-led; conversation-only fits CX. (2) **Exact reference names** — confirm `CreditCardsV3DrillDownScreens` and `role-based/retail_banking/head_retail`. (3) **9C exact rule IDs** — reconcile against the installed rulebook. (4) **Book join is a later tier** — keep the demo honest that this build is conversation-only; the voice↔book join is the upgrade. (5) **Verify names** — CX head, Private CIO, Group CIO/Head of AI, regional labels, GreyLabs. (6) **EWM voice** thin — advisory caveat.

**Verdict:** the conversation-only Stage 4–10 package is internally consistent, traceable, methodology-faithful and **build-ready**, subject to the open items. Run `frontend_review_checklist.md` against the built UI as the final gate.

---

### Pipeline status (conversation-only v2)
PHASE 1 ✅ (4-engine merge) · PHASE 2 (proto-cards via merge) · PHASE 3 ✅ (Stages 4–8, conversation-only) · PHASE 4 ✅ (9A/9B, conversation-only) · PHASE 4.5 ✅ (9C, families mapped — reconcile IDs) · PHASE 5 ✅ (Stage 10 v2 conversation-only build prompt) · PHASE 6 ✅ (Stage 11 audit).

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
