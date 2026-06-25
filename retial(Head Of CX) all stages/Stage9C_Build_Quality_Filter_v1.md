# Stage 9C — Build-Quality Filter (governance bridge) — v1

> **Phase 4.5.** The only bridge to the `yaara-frontend-dashboard-skill` rulebook. It **maps existing rules onto the prototype; it never authors a rule.** All IDs below are the rulebook's real IDs (CL-/RP-/AP-/CF-/LR-). Injected verbatim into the Stage 10 prompt; with `frontend_review_checklist.md` it drives Stage 11.

---

## Resolution

- **Product key (product_context_index.md):** **"Fluid (Banking CX / Voice-of-Customer Intelligence Dashboard)"** — the VoC/CX flagship. *Caveat:* the rulebook is **banking-keyed**; this run is **retail/e-commerce CX**. The CX/VoC structural rules transfer; retail-specific surfaces (q-commerce outbreak map, dark-pattern/FSSAI/statutory-grievance conduct cards, the inverse-metric watchdog, the bridge-ready q-commerce tile) have **no product-specific rule** → listed under Governance gaps and handled with Global + Persona rules (GAP_RULE: flag upstream, proceed).
- **Persona altitude:** **Head** (Head of CX, head level) — density-by-seniority calmer than ops/analyst (CL-012).
- **Files loaded (per cx.md):** product_context_index → global_dashboard_rules → persona_specific_rules (Head/CX sections) → product_specific_rules (Fluid CX) → component_rules → layout_density_rules → visualization_rules → naming_copy_rules → approved_patterns → rejected_patterns → frontend_review_checklist.
- **Precedence:** product/persona-specific overrides Global; screen-specific is never auto-generalised.

---

## Global enforce (every screen, with IDs)

- **Frame cards as business questions** (CL-001) — titles are short noun-phrases/questions, never sentences.
- **Thin AI exec-summary bar, change-first** (CL-004 / AP-011) — 3 sections + 1 AI line on top; "what changed" before "what happened".
- **AI insight = compact sparkle card above the fold** (CL-005 / RP-006), never a wide bar.
- **Canonical executive triad** (AP-001 / AP-002) — three question-framed top tiles, primary largest, skeleton reused.
- **Headline KPIs as dials/gauges + trend sparkline** (AP-014); **deltas beside the number** (not bottom/right).
- **Two-level executive depth** (AP-019) — cards + one drill; no Layer 3.
- **Star integration-dependent tiles with an access caveat** (AP-015) — this is the governance pattern for the **bridge-ready Tier-3 tiles** (MB1/MB4/MB8/MB17): visible, starred, honest that they need the order feed.
- **One persona per screen + density-by-seniority** (CL-012 / LR-007) — head altitude, calmer.
- **Light/dark** (CF-002) — dark canvas is permitted **only** for a polished demo with verified contrast; offer the light toggle (business heads often prefer light).
- **Fixed spine/boundary checks:** every element traces the DOMAIN SPINE (Interaction→Signal→Issue→Owner→Evidence→Action); the **AI sparkle marker on every AI element**; a status/score is **never shown without its evidence/explanation** (here: the confidence band + the drill evidence pack); **no autonomous-action label** (draft/prepare/route only).
- **Remove decorative/no-function elements** (CL-013).

## Global reject (the Rejected Pattern Library items that apply)

- **No matrices/heat-maps/bubble-maps on the head screen** (RP-001) — route them to ops/analyst. *Carve-out:* the geo **OutbreakMap** is allowed as a **geo map with a city/national default** (AP-009 is the approved geo exception to RP-001); it must read as a node map, not a dense intent×channel matrix.
- **≤2 encoded dimensions per card** (RP-002).
- **No component name over-claiming capability** (RP-004) — e.g. never "escalation risk monitor"; name cards for what they actually do.
- **No judgmental/biased labels** (RP-005) — no "at risk"/"buzz"/"watch closely". *Note:* the suppression card's "a warning, not a win" is permitted only because it is **evidence-backed** (the normalised drop + access-change marker) and renders as a neutral status with its reason, not a bare judgement.
- **Per-channel signals, never aggregated** (RP-007) — the T2-1 radar shows corroboration **per channel**; never one blended virality number.
- **No virality/social-velocity tile on the head brand view** (RP-003) — banking-scoped, but the run independently keeps T2-19 social **off the primary view**; if ever shown, per-channel + advisory + human-gated only.
- **Counts at realistic scale** (RP-009) — compliance/grievance counts read at believable magnitude, not single units.

---

## Per-element mapping

**`AiExecSummaryBar` (all screens)** — altitude head · key Fluid CX.
- Domain-spine: summarises Signals → owners ✓.
- Rules: CL-004, AP-011, CL-005/RP-006. **Enforce:** thin bar, 3 sections + 1 AI line, sparkle. **Avoid:** RP-006 (wide bar).

**`ExecutiveTile` ×3 (S1)** — Enforce CL-001 (question framing), AP-001/AP-002 (triad, primary largest), AP-014 (dial + sparkline), deltas beside number. **Avoid:** RP-002 (>2 dims).

**`InsightCard` (monitor-rail, all screens)** — Enforce the honest slots (title/severity/cohort/**honesty line**/onset/stats/**AI verdict sparkle**/**confidence band**); status never without evidence; RP-004 honest naming. **Avoid:** RP-002, RP-005 (biased labels).

**`RadarRail` / `RiskSpikeMonitor` (S1)** — Enforce RP-007 (corroboration shown **per channel**), CL-005 (reads as AI), raw-mentions→signals ratio visible. **Avoid:** aggregated cross-channel virality (RP-007), biased labels (RP-005).

**`OutbreakMap` (S2)** — geo map, head altitude. Enforce AP-009 (geo defaults to city/national view); node routes by `dark_store_id`. **Avoid:** mis-applying RP-001 to bar a legitimate geo map; do **not** render it as a dense intent×channel matrix.

**`StatutoryQueue` (S3)** — head-readable worklist. Enforce RP-009 (realistic counts), CL-001 framing, the audit trail visible; no per-transaction regulatory label on the face (regulation firm-level). **Avoid:** "regulator" as an actor on the card face.

**`ComplianceEvidenceCard` (S3)** — Enforce honest naming (RP-004) — named instrument + evidence count, no over-claim; status-with-evidence. **Avoid:** RP-005.

**`SuppressionWatchdogCard` (S4)** — Enforce evidence-backed status (normalised overlay + access-change marker shown), neutral label with its reason. **Avoid:** RP-005 (the "warning" must carry its evidence, not pre-judge).

**`SellerTrustCard` / `FcrRepeatCard` / `BotQualityCard` (S4)** — Enforce ≤2 dims (RP-002), honest naming (RP-004), sparkle + confidence band. **Avoid:** agent-level/mixed-persona content on a head screen (CL-012).

**`BridgeReadyTile` ×4 (S5)** — Enforce **AP-015** (star + access caveat "bridge-ready, lights up with transaction feed"); cohort-level + human-approved guardrail shown; honesty line explicit. **Avoid:** showing the dollar figure as if live (over-claim).

**`DraftActionFooter` (all)** — Enforce: labels read "Draft / Prepare / Route" + approve + "accepted by X on date Y"; AI marker. **Avoid:** any autonomous-action label ("Complete Now") — boundary violation.

**Storyline steps (naming/copy)** — Enforce honest capability naming (RP-004) and neutral, evidence-backed labels (RP-005) on every beat.

---

## Governance gaps (to add upstream in the rulebook — then proceed)

1. **No retail/e-commerce/q-commerce product key** in `product_context_index.md` — the run uses the banking "Fluid CX" key as the nearest fit. Add a "Fluid (Retail / Q-commerce CX / VoC)" product context.
2. **No rule for a head-altitude dark-store outbreak map** — handled via the AP-009 geo carve-out; a product-specific rule would make it explicit.
3. **No rule for the inverse-metric / suppression watchdog** — a card that flags a *falling* number as a warning has no precedent; handled via "evidence-backed neutral status" but worth a named rule.
4. **No rule for CX-context conduct cards** (dark-pattern / FSSAI / statutory-grievance) — banking conduct rules live under the separate Compliance/Risk product key, not Fluid CX; add CX-conduct guidance.
5. **AP-015 is not scoped to "bridge-ready q-commerce tiles"** — reused as-is (it fits cleanly), but a scoped note would help future runs.

**Feeds:** Stage 10 (pasted verbatim), Stage 11 (the per-element enforce/avoid + the governance `frontend_review_checklist.md` drive the audit).
