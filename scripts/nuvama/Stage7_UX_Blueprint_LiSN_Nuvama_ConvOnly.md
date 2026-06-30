# Stage 7 — UX Blueprint (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage7_UX_Blueprint_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 7.

> **Inputs.** Stage 6 conversation-only UI spec (4 screens, matched to `CreditCardsV3DrillDownScreens` + `head_retail`) + Stage 5 conversation-only model. **Spine every flow traverses:** Interaction → Signal → Issue → Evidence → Action. **Conversation data only; no book/₹.** Every action is **drafted for approval**, never auto-fired; cohort-level; ✦-marked.

---

## Primary flows (≤2 clicks; each ends in a draft action/owner)
| Flow | Path | Spine | Ends in |
|---|---|---|---|
| Attrition-risk | S1 rail → **S2 evidence drill** → Route to Market Head | exit-language → attrition Signal → at-risk Issue → excerpts+engagement Evidence → Route | drafted "review these cohorts" + approve/audit |
| Service-promise | S1 service-promise panel → **promise-ledger drill** → Route to branch/service owner | promise → broken/overdue Signal → source+follow-up Evidence → Route | drafted route |
| Complaints | S1 complaints panel → **heat-map cell drill** → Route to CX/ops | complaint theme → cell Signal → contributing-theme Evidence → Route | drafted route (by `cellId`) |
| NPS/CSAT | S3 → **decomposition drill** → Route to CX | score move → theme Signal → verbatim Evidence → Route | drafted route |
| Suitability-language | S1/S2 (diamond) or S4 → **worklist** → Route to CRO/Compliance | missing-disclosure → suitability Signal → conduct Issue → missing-language Evidence → Route | routed to worklist; human adjudicates |

---

## Five distinct drill signatures (no shared generic table)
1. **Evidence pack** — *Attrition-risk* (S2): exit-language excerpts + engagement/escalation trend + ruled-out + draft action. Built around proof-of-signal.
2. **Promise ledger** — *Service-promise*: each promise, its source call, and the follow-up showing kept/broken/overdue. A made-vs-kept ledger, not a chart.
3. **Matrix cell** — *Complaints*: a `branch × theme` cell → its contributing themes, **routed by `cellId`** (never a shared constant).
4. **Decomposition** — *NPS/CSAT*: score → theme clusters → contributing cohorts.
5. **Queue / worklist** — *Suitability-language*: item-by-item, with accept / return-with-reason / route (maker-checker).

---

## Cross-owner / process-gap diamond
Within Rahul Jain's attrition/complaint flow (S1→S2), a **suitability-language gap** is detected in advisory calls → "**not yours to action**" → routed to the **CRO/Compliance worklist** (S4), carrying the conversation evidence (which calls, what was missing) so the CRO opens it already-contexted. Secondary diamonds: a "delayed reporting" complaint theme → an **ops/reporting process gap** to the process owner; a recurring missing-disclosure pattern by team → an **RM-training gap** to the Market Head.

---

## Demo storyline (conversation-only; hook → drill → act-now + approve)
1. **Attrition-risk hook** (S1 rail): "47 clients in South Core-HNI are using exit/liquidity language, up from 6." → **drill S2**: the actual phrases, weeks before anything shows in the book. → **act-now:** draft "review these cohorts" → Route to Market Head → approve ("accepted by [name] on [date]," audit-logged).
2. **Service-promise + complaints** (S1 panels / S3): "12 promises broken in this branch; delayed-reporting complaints up and NPS −7." → Route to CX/branch.
3. **The diamond** (S2 → S4): a suitability-language gap surfaces → "not yours to action" → Route to the CRO worklist with evidence → maker-checker.
4. **The moat:** same corpus, many lenses — "one governed, AI-marked, human-approved layer over 100% of conversations; no book needed to see this."

---

## Interaction states
Selection (a cohort highlights across panels) · filtering (segment/RM-EWM/region/channel/tenure; EWM shows the coverage-gap note) · loading (skeletons) · empty ("no cohorts above threshold this week") · error/stale (<90% coverage → advisory). **Live-rail reset rule:** the attrition-risk rail and its timers **reset on lens switch** (S1↔S3↔S4) — no stale closures/leaked timers.

## Human-gate & maker-checker
Every action is a **draft** (Route / Draft outreach / Draft coaching note / Prepare evidence pack) → explicit **approve + audit** ("accepted by [name] on [date]" → immutable `AuditEvent`). **Suitability worklist** = maker (LiSN flags, ✦) → checker (CRO/Compliance: accept / return-with-reason); no item closed by the model. **Boundary banner** on S4: "Surveillance prioritisation, not an automated compliance decision — the regulated entity remains responsible for AI output."

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
