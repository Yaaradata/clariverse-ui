# Stage 6 — UI Specification (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage6_UI_Spec_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 6.

> **Inputs.** Stage 4 personas (Rahul Jain) + Stage 5 conversation-only capabilities. **Reference structure (binding):** match **`CreditCardsV3DrillDownScreens`** (the drill-down screen pattern) and the **Head of Retail Banking** page `role-based/retail_banking/head_retail` (the **service-promise + complaints** command-view layout). **Do not** use `HeadOfCreditCardsDashboard`. The repo components are the source of truth; the layout below is a guide. **Conversation data only — no book/₹ figure anywhere.** Structure & content only; colour/spacing governed at 9C.
>
> **Seven design rules:** action-first · explainability-on-demand (lines written below) · time-travel default **this week vs last** · signal-triage · two-layers-only · executive/light density · no internal machinery on the face (no codes/vendor/"agent"/"chargeback"/**no ₹**).

---

## Screen list (4 + drills; no Layer-3)

| # | Screen | Role | Renders (conversation-only) |
|---|---|---|---|
| 1 | **Command View** (landing — composed like `head_retail`) | the hook | Service-promise panel · Complaints panel · NPS/CSAT · **Attrition-risk signal rail** (✦) · 3 executive tiles |
| 2 | **Attrition-risk Evidence Drill** (`CreditCardsV3` pattern) | the wow | exit-language excerpts + theme breakdown + ruled-out + draft action |
| 3 | **CX / Service Lens** | service depth | NPS/CSAT root-cause + Complaint heat-map |
| 4 | **Suitability-language Worklist** (CRO lens) | conduct + the diamond | missing-disclosure items + maker-checker + boundary banner |

**Cut/removed (need book — out of this build):** proposal-to-flow conversion, NNM-leak sizing, AUM-at-risk, portfolio mismatch. **Landing = Screen 1.**

---

## Command View layout (match `head_retail`)
Compose Screen 1 to mirror the Head of Retail Banking page's structure:
- **Header band** — title + the **this week vs last** time control.
- **3 executive tiles** — **NPS (~85)** · **Complaint / escalation rate** · **Service-promise adherence %** (all conversation-only).
- **Service-promise panel** — promises made / kept / **broken / overdue**, by branch/cohort (the head_retail "service promise" block).
- **Complaints panel** — top complaint themes + escalation + SCORES ATR (21-day) risk (the head_retail "complaints" block).
- **Attrition-risk signal rail (✦)** — the "act on these" horizontal rail of conversation signals (severity-ordered).
- **FilterBar** — segment / RM-EWM / region-branch / channel / tenure.
Keep the head_retail density and composition; swap in the conversation content above.

## Drill screens (match `CreditCardsV3DrillDownScreens`)
Each card opens into a detail screen with the **same drill structure** as CreditCardsV3DrillDownScreens (header → evidence/detail panel → back-navigation):
- **Attrition-risk drill (S2):** left = exit-language excerpts (cohort-level), theme tags, talk-listen; right = engagement/escalation trend; below = ruled-out list + confidence + recommended draft action + route.
- **Service-promise drill:** the promise ledger — each promise, its source call, and the follow-up that shows kept/broken/overdue.
- **Complaint-theme drill:** a heat-map cell → its contributing themes (route by `cellId`).
- **NPS drill:** score → theme clusters → contributing cohorts.
- **Suitability-language worklist (S4):** item → missing-disclosure evidence + ruled-out; accept / return-with-reason / route (maker-checker).

---

## Widget justification
**Keep:** the Attrition-risk rail (the early signal), Service-promise + Complaints panels (the head_retail spine), NPS/CSAT, the Suitability-language worklist (conduct + the moat). **Remove:** per-RM QA scorecards, raw transcripts/players, the CRO case queue on RJ's command view (it lives on S4), live-ops tickers, **any book/₹ metric** (rule 7 / persona REMOVE).

---

## Cards (conversation-only) + written explainability lines
- **Attrition-risk language** — *"Flagged because this cohort's call/chat language shifted to exit/liquidity/anxiety over the last 6 weeks and engagement fell; 47 clients affected, up from 6. Market-wide and seasonal moves ruled out."*
- **Service-promise adherence** — *"12 promises overdue and 9 broken in this branch versus its baseline — callbacks and statements committed on calls but not referenced as completed."*
- **Complaint heat-map** — *"This branch×theme cell is above its own baseline; SCORES ATR due in 9 days."*
- **NPS/CSAT root-cause** — *"NPS −7 in South branches, driven by a delayed-reporting + performance-concern theme cluster."*
- **Suitability-language gap** — *"Surfaced for review because advisory calls in this cohort lack mandated risk/disclosure language — prioritised for human adjudication, not an AI verdict; documented exceptions ruled out."*

**Card anatomy (every card):** Title · Severity · Cohort (grain; never a named client) · **Data source (honesty line)** · Time (onset) · Stats box (baseline vs actual, **in conversation terms**) · **AI verdict ✦**. Impact is conversational, never rupees.

---

## Goal → capability → UI (conversation proxies; gaps flagged)
| Persona question | Capability | UI zone | Note |
|---|---|---|---|
| Q1/Q2 NNM-leak / silent redemption | O-1 attrition-risk language | S1 rail → S2 | conversation early-signal proxy |
| Q3 proposal conversion | O-5/O-1 unresolved-objection | S1 rail (optional card) | conversation proxy |
| Q4 branch leak | O-1 (branch grain) | S1 filter | — |
| Q5 EWM under-serving | O-1/O-6 | S1/S4 EWM filter | **partial — EWM voice gap** |
| Q6 recurring-mix | — | — | **out (needs book)** |
| Q7 conduct/suitability | O-3 suitability-language gap | S4 worklist | the diamond |

---

## Navigation, states
- **Landing** S1 → drill S2 → back; lens-switch S1↔S3↔S4 **resets transient state + timers**. Two layers only.
- **Empty:** "No cohorts above threshold this week." **Loading:** skeleton of rail + panels. **Error/stale:** <90% transcription coverage → card degrades to **advisory** ("feed incomplete — advisory only").

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
