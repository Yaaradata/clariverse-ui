# Stage 9C — Build-Quality Filter (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage9C_Build_Quality_Filter_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 9C.

> **Inputs.** The `yaara-frontend-dashboard-skill` rulebook + Stages 6/7/8 (conversation-only). Applies design governance to the build. **Conversation data only; reference = `CreditCardsV3DrillDownScreens` + `head_retail`.** Exact rule numbers/text must be reconciled against the installed rulebook (`product_context_index.md`, the rulebook, `frontend_review_checklist.md`); families are mapped below.

## Product key & altitude
- **Product:** Fluid / CX (confirm key in `product_context_index.md`).
- **Altitude:** **head** (executive density per CL-012 density-by-seniority); **light theme** default.
- **Profiles applied:** executive + cx + compliance.

## Rule families → conversation components
| Component | Rule families (reconcile exact IDs) |
|---|---|
| `ExecutiveTile` (NPS / complaint-escalation / promise-adherence) | executive-KPI cluster (CL-###) + AP-001..019 (action) + RP-001..009 (routing) |
| `AttritionRiskRail` / `InsightCard` | monitor-rail cluster + ✦ AI-marker + explainability-on-demand (written line) |
| `ServicePromisePanel` / `ServicePromiseLedger` | service-ledger family + RP "no per-RM attribution on the face" |
| `ComplaintHeatmapMatrix` | heat-map cluster + **route-by-`cellId`** (RP against route-by-constant) |
| `NPSDecompositionPanel` | cx-decomposition family |
| `SuitabilityWorklist` | compliance-worklist family + **maker-checker** + boundary banner |
| layout primitives | CF-/LR- anchors (grid, F-pattern, spacing, density, AI-marker) |

## AUTO_REJECT (must not ship)
- A unit card missing **conversation-evidence / recommended action / routing**.
- An AI element without **✦**.
- An **autonomous-action** label (anything that fires without human approval).
- **Any book/₹ figure on screen** (AUM, NNM, flows, holdings, portfolio, proposal-funding, revenue, ₹-at-risk).
- "agent" / "chargeback" / internal code / vendor name on a face.
- A number with no spine (no Interaction → Signal → Evidence trail).
- A drill **routed by a shared constant** instead of the item id.
- Use of `HeadOfCreditCardsDashboard` structure instead of `CreditCardsV3DrillDownScreens` + `head_retail`.

## Precedence & gaps
- **Precedence:** product/persona-specific rules > global; screen-specific styling not auto-generalised across screens.
- **Gaps:** exact CL-/AP-/RP-/CF-/LR- numbers to reconcile against the installed rulebook; EWM partner-voice coverage thin (advisory caveat on EWM cohorts); if the demo flips to **CX-led**, re-check altitude/profile.
- **Acceptance gate:** run `frontend_review_checklist.md` against the **built** UI at Stage 11.

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
