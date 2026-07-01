# Stage 11 — Review / Audit (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage11_Review_Audit_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 11. Final gate over the conversation-only Stage 4–10 package.

> **Scope.** Audits the conversation-only build: persona (Stage 4, kept) + conversation-only Stages 5–10 + reference = `CreditCardsV3DrillDownScreens` + `head_retail`. **Conversation data only; no book/₹.**

## Traceability (persona question → capability → UI → seeded signal)
| Persona Q | Capability | UI | Seeded signal | Status |
|---|---|---|---|---|
| Q1/Q2 NNM-leak / silent redemption | O-1 attrition-risk language | S1 rail → S2 | SIG-A | ✅ conversation proxy |
| Q3 conversion | O-5/O-1 unresolved-objection | S1 (optional) | SIG-F | ✅ proxy |
| Q4 branch leak | O-1 (branch grain) | S1 filter | SIG-A@BR-S1 | ✅ |
| Q5 EWM | O-1/O-6 | S1/S4 EWM filter | — | ⚠ EWM voice-coverage gap (advisory) |
| Q6 recurring-mix | — | — | — | ⛔ out (needs book) |
| Q7 conduct/suitability | O-3 suitability-language gap | S4 worklist | SIG-E | ✅ the diamond |
Service-promise + complaints + NPS (SIG-B/C/D) trace to the `head_retail` panels. ✅

## Checks
- **Seven design rules:** ✅ (incl. *no ₹/book on a face*; explainability lines written; this-week-vs-last default; two-layers-only).
- **Spine / boundary / honesty:** ✅ — Interaction→Signal→Issue→Evidence→Action; draft→human→audit; maker-checker on suitability; ✦ on every AI element; cohort-level; **no book consumed**; honesty line on every card.
- **Methodology fidelity:** ✅ — DENSE/BURSTY/SPARSE applied to conversation metrics; **market-event exclusion** carried; min-sample + hierarchy fallback; advisory-degrade on <90% coverage.
- **AUTO_REJECT:** encoded at 9C ✅ (incl. *any book/₹ figure*, *wrong reference component*).
- **Bug-class pre-emptions:** ✅ — drill-by-id; unique SVG gradient id per chart; single global `@keyframes`; timers cleared on unmount/lens-switch; no `localStorage`/`sessionStorage`.
- **Brand:** ✅.

## Open items before the live demo
1. **Wealth-led vs CX-led** — built Wealth-led (Rahul Jain, per "research up to persona is fine"); conversation-only + service-promise/complaints layout also fits the **CX seat**.
2. **Exact reference names** — confirm `CreditCardsV3DrillDownScreens` and route `role-based/retail_banking/head_retail` match the repo file/component names exactly.
3. **9C exact rule IDs** — reconcile families against the installed `yaara-frontend-dashboard-skill` rulebook.
4. **Book join is a later tier** — keep the demo honest: this build is conversation-only; the voice↔book join is the upgrade.
5. **Verify names** — CX head (Dattattray Desai — Pplx-only), Private CIO (Saurabh Rungta — disputed), Group CIO/Head of AI, regional labels, GreyLabs.
6. **EWM partner-voice** thin — advisory caveat on EWM cohorts.

## ⚠ Critical note on what this audit does and does not cover
This audit covers the **specification**. The **live screen** is built by Cursor in the repo from the Stage-10 conversation-only prompt — it is **not** changed by these documents. The final UI must be run through `frontend_review_checklist.md` **after** Cursor rebuilds; if the on-screen result is still wrong, the cause is the **build run**, not the spec (see the build note below).

## Verdict
The conversation-only Stage 4–10 package is internally consistent, traceable, methodology-faithful and **spec-complete**, subject to the open items. The screen is fixed only when Cursor rebuilds from `Stage10_Cursor_Build_Prompt_LiSN_Nuvama_v2_ConversationOnly.md` and passes `frontend_review_checklist.md`.

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
