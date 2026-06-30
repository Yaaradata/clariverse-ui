# Stage 10 (v2 · CONVERSATION-ONLY) — Cursor Build Prompt — LiSN / Fluid CX · Nuvama
**`Stage10_Cursor_Build_Prompt_LiSN_Nuvama_v2_ConversationOnly.md`** — supersedes the earlier Stage 10.

> **Two corrections from review, both binding:**
> 1. **DATA IS CONVERSATION-ONLY.** Every metric, card, drill and number on screen derives **solely from the interaction corpus** — recorded calls, WhatsApp-bot chats, service calls, app/portal messages, email, complaints, NPS/CSAT. **No book/transaction data of any kind** — no AUM, NNM, flows, redemptions, holdings, portfolio, proposal-funding, revenue. If a card needs book data, it is **out of this build**.
> 2. **REFERENCE STRUCTURE.** Match **`CreditCardsV3DrillDownScreens`** (the drill-down screen structure) and the **Head of Retail Banking** page at `role-based/retail_banking/head_retail` (the **service-promise + complaints** layout). **Do not** use `HeadOfCreditCardsDashboard`. Study both components in the repo and match their structure, spacing, and drill pattern exactly; the descriptions below are a guide, the repo components are the source of truth.

---

## 0 · Role & guardrails
Build a **front-end prototype** (sales demo) that is a **conversation-intelligence dashboard**. Implement exactly; invent no metrics, screens, or data. Every AI element carries a ✦ marker. Every action is a **draft for human approval** — never autonomous. Cohort-level only; no named-client drill. **Conversation data only** (see §3 deny-list). Brand rules verbatim (§10).

## 1 · What this is (one paragraph)
**LiSN / Fluid CX** listens to **100% of client conversations** and turns them into early signals — before the book ever shows them. It surfaces: clients whose language is shifting to exit/anxiety, **service promises** made-vs-kept, **complaint themes** and escalation risk, **NPS/CSAT root-cause**, and **suitability-language assurance** (was the mandated disclosure actually said). Persona: **Rahul Jain, President & Head, Nuvama Wealth** (consumes it as the voice of his book's clients) with a **Client Experience** co-lens. *Note: this conversation-only framing sits naturally with the CX seat — confirm whether the primary should be Wealth or CX (see cover note).* No book join in this build; that is a later tier.

## 2 · Reference build — match exactly (in the repo)
- **`CreditCardsV3DrillDownScreens`** — match its **drill-down screen structure** (how a card opens into a detail screen; layout, back-navigation, evidence panel pattern).
- **`role-based/retail_banking/head_retail`** (Head of Retail Banking — **service promise + complaints**) — match its **command-view layout**: the service-promise framing, the complaints panel, the KPI/header treatment, the overall page composition.
- Keep whatever theme/density those components use (light, executive). **Do not** reproduce `HeadOfCreditCardsDashboard`.

## 3 · DATA — conversation corpus ONLY
**Allowed sources (the only data in this build):** recorded RM advisory/review calls · WhatsApp-bot chats · service calls · app/portal messages · email · complaints/grievance registry (+ SCORES 2.0 21-day ATR, SMART ODR) · NPS (monthly telephonic) + CSAT touchpoints.
**Deny-list (must NOT appear anywhere):** AUM, net-new-money, flows, redemptions, holdings, portfolio value, product mix, proposal-funding, conversion-to-funded, revenue, ARR, ₹-at-risk, wallet share, or any market/book figure.
**Cohort grain** (from conversation metadata only): `segment × region/branch × RM/EWM × channel × client-tenure × time`. Cohort size is expressed as **number of clients who contacted / number of interactions** — never AUM.
**Impact/severity is conversational**, e.g. "47 clients using exit/liquidity language this week, up from 6," "12 service promises overdue," "NPS −7 in South branches," "8 advisory calls missing mandated disclosure" — **never a rupee figure**.

## 4 · Conversation-only data model (entities → fields)
- **Interaction** `{id, channel, timestamp, cohortId, sentiment, intentTags[], themeTags[], suitabilityLanguagePresent:bool, queryType, talkListenRatio, escalationFlag, repeatContactFlag, promiseMade?, promiseType?}`
- **Complaint** `{id, cohortId, theme, openedTs, atrDueTs, status, escalationFlag}`
- **NPS_Response** `{id, cohortId, score, verbatimTheme, ts}` · **CSAT_Touchpoint** `{id, cohortId, score, ts}`
- **ServicePromise** `{id, cohortId, sourceInteractionId, type(callback/document/resolution), dueTs, status(kept/broken/overdue), evidenceInteractionId?}`
- **Cohort** `{id, segment, region, branch, rmEwmId, channel, tenureBand, clientCount, interactionCount}`
- **Signal** `{id, card, cohortId|cellId, severity, confidence, conversationImpact, themeEvidence[], ruledOut[], owner, recommendedAction, aiMarker:true}`
- **Action** `{id, parentSignalId, status(draft/approved/actioned), approverId, ts}` · **AuditEvent** `{id, actionId, ts}`
*(No Flow / Holding / Proposal / RiskProfile / Product-AUM entities — removed.)*

## 5 · Capabilities & cards (conversation-only; book-dependent cards removed)
| Card | Signal (conversation-only) | Drill |
|---|---|---|
| **Attrition-risk language** | cohorts whose call/chat tone shifted to exit/liquidity/anxiety/dissatisfaction + reduced engagement + rising friction | evidence pack: excerpts + theme breakdown + ruled-out + draft action |
| **Service-promise adherence** | promises made on calls vs referenced-as-kept/broken/overdue later (matches `head_retail` "service promise") | promise list → the source + follow-up interactions |
| **Complaint theme heat-map** | complaint themes × branch/channel, escalation + ATR (21-day) risk | cell → contributing complaint themes (route by `cellId`) |
| **NPS / CSAT root-cause** | themes behind a score move (verbatims) | score → theme clusters → contributing cohorts |
| **Suitability-language gap** | advisory conversations **missing mandated risk/disclosure language** (surveillance prioritisation) | worklist item → missing-language evidence + ruled-out; maker-checker |
| *(optional)* **Unresolved-objection** | calls where interest/objection was raised but not resolved in conversation | call-theme drill |
**Removed (needs book — do not build):** proposal-to-flow conversion, NNM-leak sizing, AUM-at-risk, portfolio mismatch by holdings.

## 6 · Screens, routes, state
- **S1 Command View** — composed like `head_retail`: header + **service-promise** panel + **complaints** panel + **NPS/CSAT** + an **Attrition-risk signal rail** (✦), 3 executive tiles (e.g. **NPS**, **complaint/escalation rate**, **service-promise adherence %**), `FilterBar`. Time default **this week vs last**. AI analyst (read-only) optional.
- **Drill screens** — match `CreditCardsV3DrillDownScreens`: Attrition-risk evidence drill, Service-promise drill, Complaint-theme drill, NPS-theme drill, Suitability-gap worklist. **Two layers only.**
- **Routes:** `/` (command, default) · `/attrition/:cohortId` · `/promises/:cohortId` · `/complaints/:cellId` · `/nps/:themeId` · `/suitability/:itemId`. **Drill by the item's own id, never a shared constant.** Lens/route switch **resets transient state + timers**.
- **State:** in-memory only (**no `localStorage`/`sessionStorage`**). `AppState { filters, comparisonBasis, cohorts[], signals[], evidencePacks{[signalId]}, kpis{nps, csat, complaintRate, escalationRate, promiseAdherence, attritionLanguagePrevalence, suitabilityCoverage}, selected{cohortId,cellId,themeId,itemId}, governance{draftActions[], auditLog[]} }`. Actions append a draft then an approval event; suitability worklist is maker-checker.

## 7 · Card anatomy + honesty lines (conversation-only)
Slots: Title · Severity · Cohort (grain; never a named client) · **Data source** · Time (onset) · Stats box (baseline vs actual, in **conversation terms**) · **AI verdict ✦**.
Honesty lines: Attrition-risk: "*from conversation only — an early-warning signal, not a confirmed redemption; no book data used*"; Suitability-gap: "*detects whether the mandated disclosure was said; does not assess the client's actual holdings — conversation-only*"; NPS: "*score from survey; root cause from conversation themes*"; Service-promise: "*from what was committed and later referenced on calls*".

## 8 · Mock data (conversation-only)
**Normal:** 4 regions / 8 branches / 30 RMs / 15 EWMs / 12 cohorts (CH-01…CH-12, defined by segment·region·channel·tenure, with `clientCount`/`interactionCount` — **no AUM**) / monthly interaction volumes (calls ~9k, WhatsApp ~22k, service ~6.5k, app ~14k, email ~11k) / NPS ~85 / complaints ~140/mo / CSAT. Per-cohort **baselines** for: attrition-risk-language prevalence (DENSE p05/p50/p95), complaint-theme rate (BURSTY median+IQR), suitability-language-present rate (SPARSE, ~99% baseline), service-promise adherence %. Shared **event calendar** (e.g. market-volatility week) so a tone spike can be ruled market-wide. Peer-cohort controls. All `[illustrative]`.
**Seeded signals (conversation-only):**
- `SIG-A` **Attrition-risk** · CH-07 (South Core-HNI, RM-direct): exit/liquidity language in **47 clients** (vs 6 baseline); friction + repeat-contact up; onset ~6 wks; peers CH-01/CH-04 stable → not market-wide; **High**; → Route to South Market Head (Sandeep Chakraborti).
- `SIG-B` **Service-promise** · BR-S1: **12 promises overdue / 9 broken** (callbacks, statements) vs baseline; → Route to branch/service owner.
- `SIG-C` **Complaint heat-map** · `CELL-BRS1-DELREP` (BR-S1 × "delayed reporting") above baseline; ATR due 9 days; route by cellId.
- `SIG-D` **NPS root-cause** · South: NPS **78 vs ~85**, "delayed reporting" + "performance concern" themes; → Route to CX.
- `SIG-E` **Suitability-language gap** · CH-07/CH-08 advisory: **8 calls per 1,000** missing mandated risk/disclosure language (vs ~0 baseline); ruled-out no documented exception; surveillance prioritisation, maker-checker → CRO/Compliance (Keyur Ajmera).
Numbers tie out across rail, drill and lens screens.

## 9 · Governance / visual rules
Executive density, light theme, ✦ on every AI element, two-layers-only, route-by-id, maker-checker on the suitability worklist, boundary banner ("Surveillance prioritisation, not an automated compliance decision — the regulated entity remains responsible for AI output"). **AUTO_REJECT (must not ship):** a unit card missing conversation-evidence / recommended action / routing; an AI element without ✦; an autonomous-action label; **any book/₹ figure on screen**; "agent"/"chargeback"/internal codes/vendor names on a face; a drill routed by a shared constant. *(Exact CL-/AP-/RP-/CF-/LR- IDs reconcile against the installed `yaara-frontend-dashboard-skill` rulebook.)*

## 10 · Demo storyline, boundary & brand
**Storyline (conversation-only):** Attrition-risk language hook (S1 rail) → drill to the exit-language excerpts (the signal the book can't show yet) → service-promise + complaint root-cause → suitability-language gap routed to the CRO (the diamond) → "one governed, AI-marked, human-approved layer over 100% of conversations." Each action drafted → approved → audit-logged.
**Boundary:** LiSN owns the conversation corpus + insight store; **no book consumed in this build**; never auto-fires; cohort-level; ✦ on every AI element.
**Brand:** "LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a **Relationship Manager** (never an "agent"); a client outflow is **"attrition"** (never a "chargeback").

## 11 · Definition of done
Command view matches `head_retail` composition; drill screens match `CreditCardsV3DrillDownScreens`; **no book/₹ data anywhere**; the attrition→promise/complaint→suitability storyline runs; every card shows its honesty line + ✦; drills route by id; timers reset on route switch; no browser storage; no AUTO_REJECT violation.
