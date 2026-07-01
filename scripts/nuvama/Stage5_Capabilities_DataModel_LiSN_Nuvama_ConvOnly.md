# Stage 5 — Capabilities & Data Model (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage5_Capabilities_DataModel_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 5.

> **Inputs.** Stage 4 personas (Rahul Jain primary, kept) + the LiSN methodology (`fluid-lisn-analysis-method.md`: auto-adaptive baselining DENSE/BURSTY/SPARSE, the detection pipeline, per-signal template, honesty line). **Data is conversation-only** — calls, WhatsApp-bot chats, service calls, app/portal messages, email, complaints, NPS/CSAT. **No book/transaction data** (no AUM, NNM, flows, redemptions, holdings, portfolio, proposal-funding, revenue, ₹). Book-dependent capabilities are removed; the book join is a later tier. **Domain spine:** Interaction → Signal → Issue → Evidence → Action. **Boundary:** owns the conversation corpus + insight store; consumes no book in this build; never auto-fires (draft → human approves → audit-logged); cohort-level; every AI element ✦-marked.
>
> **Naming guard:** capability codes are `O-<n>` (interaction/operational); they are distinct from card names.

---

## Entity model (conversation-only)
**Entities & relationships:**
- **Interaction** (n:1 → Cohort) — the unit of voice. `{id, channel(call/whatsapp/app/service/email), ts, cohortId, sentiment, intentTags[], themeTags[], suitabilityLanguagePresent:bool, queryType, talkListenRatio, escalationFlag, repeatContactFlag, promiseMade?:bool, promiseType?}`
- **Complaint** (n:1 → Cohort) — `{id, cohortId, theme, openedTs, atrDueTs, status, escalationFlag}`
- **NPS_Response** (n:1 → Cohort) — `{id, cohortId, score, verbatimTheme, ts}` · **CSAT_Touchpoint** — `{id, cohortId, score, ts}`
- **ServicePromise** (n:1 → Cohort; n:1 → source Interaction) — `{id, cohortId, sourceInteractionId, type(callback/document/resolution), dueTs, status(kept/broken/overdue), evidenceInteractionId?}`
- **Cohort** — the analysis unit, defined by **conversation metadata only**: `{id, segment, region, branch, rmEwmId, channel, tenureBand, clientCount, interactionCount}` — **no AUM**.
- **Signal** — insight-store unit: `{id, card, cohortId|cellId, severity, confidence, conversationImpact, themeEvidence[], ruledOut[], owner, recommendedAction, aiMarker:true}`
- **Action** (n:1 → Signal) — `{id, parentSignalId, status(draft/approved/actioned), approverId, ts}` · **AuditEvent** (n:1 → Action, immutable).

**Removed entities:** Flow, Holding, Proposal, RiskProfile, Product-AUM (all book-side).

**Spine, explicit:** `Interaction` → `Signal` (Issue = `Signal.issue_type`) → Evidence = `Signal.themeEvidence` (conversation excerpts + theme/complaint/NPS refs) → `Action` (draft). Representable end-to-end with conversation data alone.

**Differentiating frame (conversation-only).** Not the voice↔book join (later tier). The wedge here is **100% conversation coverage stitched across every channel into one governed signal layer** — what Nuvama's point-AI (single-call analytics, trade-confirmation audit) does *not* do as a persistent cross-channel corpus, AI-marked and human-gated.

**Cohort vs identity:** cohort-level only (DPDP); no named-client drill. **Audit chain:** `Action.parent_signal_id`; maker-checker on `Action.status` with `approver_id`; `AuditEvent` immutable.

---

## Capabilities (all conversation-derived)
| Code | Name | Computes (conversation-only) | Feeds card |
|---|---|---|---|
| **O-1** | Intent/sentiment-shift detection | drift to exit/liquidity/anxiety/dissatisfaction language (DENSE) | Attrition-risk language |
| **O-2** | Complaint-theme emergence & clustering | theme spikes & cohort clustering (BURSTY) | Complaint heat-map; NPS root-cause |
| **O-3** | Suitability-language presence/absence | mandated risk/disclosure language missing in advice (SPARSE) | Suitability-language gap |
| **O-4** | NPS/CSAT verbatim theme extraction | themes behind a score move | NPS/CSAT root-cause |
| **O-5** | Query-intent extraction | "guarantee/access/protection" intents in chat/service | (supports attrition + suitability) |
| **O-6** | Service-promise extraction & adherence | promises made on calls vs referenced-as-kept/broken/overdue later | Service-promise adherence |
| **O-7** | Escalation & repeat-contact detection | rising escalations / repeat contacts (BURSTY) | (supports attrition + complaints) |

*(All book-side C-* capabilities removed.)*

**Persona TOP_QUESTION → capability map (gap check).** The book questions are served by **conversation proxies**: Q1/Q2 NNM-leak/silent-redemption → **O-1 attrition-risk language** (the early signal *before* the book moves); Q3 proposal-conversion → **O-5/O-1 unresolved-objection** signal (conversation proxy); Q4 branch leak → O-1 at branch grain; Q5 EWM → O-1/O-6 **partial — EWM voice-coverage gap**; Q6 recurring-mix → **not a conversation signal — out of this build**; Q7 conduct/suitability → **O-3 suitability-language gap** (routes to CRO). Gaps flagged, not hidden.

---

## Pipeline (the methodology's stages, conversation-only)
1. **Ingest** the corpus (calls/WhatsApp/service/app/email/complaints/NPS).
2. **Feature layer** — conversation features (sentiment, intent, themes, suitability-language flag, promise events, escalation/repeat) at the grain `segment × region/branch × RM/EWM × channel × tenure × time`.
3. **Baseline store** — per-cohort, seasonality-adjusted, **event-excluded** (a market-volatility week lifts anxiety language across all cohorts → exclude before baselining; the analogue of sale-day exclusion).
4. **Detection** — DENSE percentile bands (attrition-language, sentiment), BURSTY median+IQR (complaint/escalation spikes), SPARSE Poisson/binary (missing-disclosure events); min-sample gate; sub-threshold suppressed.
5. **Root-cause** — classify with conversation rule-outs (market-wide tone vs cohort-specific via peer cohorts; seasonal; known one-off).
6. **Severity** — in **conversation terms** (clients/interactions affected, escalation count, promises broken, missing-disclosure rate) — **never rupees**.
7. **Confidence** — sample + baseline stability + corroboration; degrade to **advisory** on <90% transcription/feed coverage.
8. **Insight store** — persist Signal (cohort, conversation evidence, ruled-out, severity, confidence, owner, recommended draft action, ✦).
9. **Cards** → render per the Stage-6 conversation-only screen set.
10. **Routing** — `issue_type → routing_table` → **draft** only; human approves; audit-logged.
11. **AI analyst** — NL questions over the insight store (✦).

**Grain:** `segment × region/branch × RM/EWM × channel × tenure × time`. **Comparison basis:** per-cohort event-excluded baseline (DENSE/BURSTY) or expected-language state (SPARSE).

---

## Unit / signal library (conversation-only; each carries an honesty line)

### Attrition-risk language *(demo hero; O-1+O-7)*
- **Behaviour:** DENSE (tone) + BURSTY (engagement/escalation).
- **Formula:** flag a cohort when exit/liquidity/anxiety/dissatisfaction language rises above baseline **and** engagement falls / friction rises, over a trailing window.
- **Feeds:** call/chat sentiment & intent, query-type, repeat-contact, complaint themes.
- **Min sample / baseline:** cohort ≥ ~30 clients & ≥ M interactions; trailing 8 same-periods, event-excluded.
- **Severity:** "N clients using exit/liquidity language, up from baseline."
- **FP rule-outs:** market-wide tone (peer-cohort control + event calendar), seasonal, known one-off.
- **Routing:** Market Head — draft "review these cohorts."
- **Honesty line:** *from conversation only — an early-warning signal, not a confirmed redemption; no book data used.*

### Service-promise adherence *(O-6; matches `head_retail` "service promise")*
- **Behaviour:** DENSE (adherence %) + BURSTY (overdue spikes).
- **Formula:** promises detected on calls (callbacks/documents/resolutions) vs whether later conversations reference them as kept/broken/overdue.
- **Severity:** "X promises overdue / Y broken vs baseline."
- **Routing:** branch/service owner — draft.
- **Honesty line:** *from what was committed and later referenced on calls.*

### Complaint theme heat-map *(O-2)*
- **Behaviour:** BURSTY per `branch × theme`.
- **Formula:** complaint-theme rate above its own baseline; escalation + ATR (SCORES 21-day) risk.
- **Routing:** CX / ops process owner — route by `cellId`.
- **Honesty line:** *from complaints + service conversations.*

### NPS / CSAT root-cause *(O-2+O-4)*
- **Behaviour:** BURSTY (score move) over DENSE theme prevalence.
- **Formula:** decompose a score move by cohort into conversation themes + complaint categories.
- **Severity:** "NPS −n in [cohort], driven by [theme]."
- **Routing:** CX → business heads — draft.
- **Honesty line:** *score from survey; root cause from conversation themes.*

### Suitability-language gap *(CRO lens; O-3 — the diamond)*
- **Behaviour:** SPARSE (rare, high-impact).
- **Formula:** advisory conversations **missing mandated risk/disclosure language** (vs ~0 baseline).
- **Trust gate:** **surveillance prioritisation, never an AI verdict** (Reg 16C); maker-checker.
- **Severity:** "k advisory calls per 1,000 missing mandated disclosure."
- **Routing:** CRO/Compliance worklist — draft.
- **Honesty line:** *detects whether the mandated disclosure was said; does not assess the client's actual holdings — conversation-only.*

*(Optional) Unresolved-objection* — calls where interest/objection was raised but not resolved (O-1/O-5); conversation proxy for the old proposal-conversion question.

---

## Edge cases (methodology register, conversation-only)
Hierarchy fallback (sparse cohort → parent region/segment baseline) · event contamination (market-volatility/quarter-end → exclusion) · cold-start (new branch/RM → parent fallback) · classification drift (>20% theme-distribution shift → stability monitor) · data-quality (<90% transcription → advisory degrade) · alert fatigue/correlated alerts (market event lighting many cohorts → root-cause group + cohort alert budget) · saturation (metric pinned → pivot).

---

## KPI definitions (conversation-only; formula + source)
| KPI | Formula | Source | Persona | Tag |
|---|---|---|---|---|
| NPS (segment) | standard NPS | `NPS_Response.score` | RJ (via CX) | retention lead |
| CSAT | mean touchpoint score | `CSAT_Touchpoint.score` | RJ/CX | diagnostic |
| Complaint rate | complaints ÷ interactions, cohort | `Complaint` | CX | diagnostic |
| Escalation rate | escalated ÷ complaints | `Complaint.escalationFlag` | CX/CRO | diagnostic |
| Service-promise adherence % | kept ÷ made | `ServicePromise` | RJ/branch | north-star (service) |
| Attrition-risk-language prevalence | clients w/ exit language ÷ cohort | `Interaction` (O-1) | RJ | north-star (early signal) |
| Suitability-language coverage % | language-present ÷ advised | `Interaction.suitabilityLanguagePresent` | CRO | diagnostic |
| Repeat-contact / FCR | repeat ÷ total ; 1−repeat | `Interaction.repeatContactFlag` | CX | diagnostic |

**No book KPI anywhere.**

---

## Capability boundary
- **Owns:** the conversation corpus it processes + the insight store (Signals, evidence, confidence, recommended draft actions, audit trail).
- **Consumes:** nothing book-side in this build.
- **Never:** owns a system of record; auto-fires (draft → human → audit; maker-checker on the suitability worklist); joins at identity level (cohort-only, DPDP); shows an AI element without ✦; shows a rupee/book figure.

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
