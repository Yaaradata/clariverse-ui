# Stage 9C Build-Quality Filter — LiSN (Retail / e-commerce) / Category-Business Head

> Phase 4.5. The one bridge to the `yaara-frontend-dashboard-skill` governance rulebook. This **reads** the frozen rulebook and maps its **real IDs** onto S1–S5 and the Stage 8 components; it **never authors a rule**. Injected verbatim into the Stage 10 prompt; with the rulebook's `frontend_review_checklist.md` it drives the Stage 11 audit. Real ID scheme only — CL-### clusters, RP-001..009 / AP-001..019 pattern libraries, CF-/LR- anchors. No invented GLOBAL-/EXEC- codes.

---

## 1. Resolution

- **Governance product key:** **"Fluid (Banking CX / Voice-of-Customer Intelligence Dashboard)"** — resolved by *function* (the VoC / interaction-intelligence layer: "are we delivering on the customer promise / where are we at risk / are we operationally in control"). This is the run-config `GOVERNANCE_PRODUCT_KEY`. **Caveat:** the rulebook's corpus is banking/FMCG; **there is no retail/e-commerce product and no Category-Head persona in it** (see §5 gaps). So the *structural / layout / AI / pattern* rules apply; the *banking-specific naming and persona* rules do **not** map literally and are flagged, not forced.
- **Persona altitude:** **Head** (Category/Business Head sits in the "Heads — Cards/Retail/Business/CFO" tier: question-framed cards, one-click drill, curated "biggest diamonds", neutral labels). Secondary **CX/VoC Head** = Head + the "CX-Ops one level below" overlay on the shared cards. Density decreases with seniority (CL-012).
- **Files loaded** (per the executive + cx governance profiles, in order): `product_context_index` → `global_dashboard_rules` → `persona_specific_rules` → `product_specific_rules` → `component_rules` → `layout_density_rules` → `visualization_rules` → `naming_copy_rules` → `approved_patterns` → `rejected_patterns` → `frontend_review_checklist`.
- **Precedence:** product/persona-specific overrides global; **screen-specific feedback is never auto-generalised**. Where a rule is *banking-scoped* (e.g. RP-003), it is **not** mis-applied to this e-commerce run — only its generalisable principle carries.

---

## 2. Global enforce (every screen — cite the real IDs)

- **Question-framed cards resolving to a state (CL-001)** + the **frozen three-question executive triad (AP-001)** reused as one **canonical skeleton across the Category and CX personas, inner metrics varied (AP-002)**.
- **Thin AI exec-summary band on top, change-first, question-set by level (AP-011, CL-004, CF-003)** — this is the approved *bar*; distinct from the rejected wide AI *insight* bar.
- **AI insight as a compact ✦ sparkle card above the fold (CL-005, RP-006)**; AI used to triage the long list so the screen reads as an AI product.
- **Headline largest, top-left (F-pattern); deltas beside the number; 5-second headline / 2-minute comprehension (frontend_review_checklist).**
- **Headline KPIs as dials/gauges + trend sparkline (AP-014).**
- **One persona per screen; one-click-max drill for heads; two levels deep at most (CL-012, LR-007, AP-019).**
- **Star integration-dependent tiles with an access caveat (AP-015)** — the voice-join cards depend on the operator ingesting the interaction corpus; star them so the demo never sells data that is not yet integrated.
- **Light theme default for this dense business screen; dark only for a polished demo with verified contrast (CF-002).**
- **Fixed spine/boundary checks:** every element traces the Fluid/LiSN spine (Interaction → Signal → Issue → Owner → Evidence → Action); the ✦ AI marker on every AI element; a score/status is **never** shown without its evidence/explanation; **no autonomous-action label** (Draft/Prepare/Route only).

## 3. Global reject (the Rejected Pattern Library items that apply, with IDs)

- **No matrices / heat-maps / bubble-maps on the head screens (RP-001)** — route any matrix to an analyst/ops surface; the geo national-default heat-map (AP-009) is the one exception if a geo view is added.
- **≤2 encoded dimensions per card (RP-002)** — split over-statted cards.
- **No component name over-claiming capability (RP-004)** — e.g. nothing named to imply live prediction the method does not do.
- **No judgmental/biased labels — "at risk", "buzz", "watch closely" (RP-005)** — neutral, quantified labels + colour/icon; a glasses icon for "watch".
- **AI insight not a wide real-estate-hungry bar (RP-006).**
- **Channel-bound voice signals shown per channel, never aggregated into one figure (RP-007)** — applies to reviews / care / social as separate sources.
- **Atomic rejections:** no decorative/no-function elements (CL-013); no duplicated metrics; no mixed-persona screens; no deep (>1) drill for heads; no detached deltas; no sentence-style card titles (short noun phrase / question); no undefined/non-derivable metrics (recoverable margin, incrementality, sentiment composite must state a method); no per-transaction regulatory labels / "regulator" as an actor on the face.
- **Correctly NOT applied here (scoping):** RP-003 (social-velocity on *banking* brand cards — "banking ≠ e-commerce") does **not** bar this run's legitimate e-commerce review/social voice; RP-008 (CRO miss-counts) and RP-009 (thousands-scale compliance counts) are Fluid-Compliance/CRO-scoped and out of scope for this head.

## 4. AUTO_REJECT — Priya's trust threshold (per-persona hard fail, from Stage 4)

A card fails the build outright unless it carries **all** of: **(1)** a quantified ₹ figure (contribution or GMV at risk); **(2)** the customer-voice evidence (verbatim cluster or ranked cause-code); **(3)** a fixable-vs-intent split **or** a correlation-evidence band on a join; **(4)** one recommended action; **(5)** the routed owner; **(6)** the regime-aware **"is this real?" badge** distinguishing a sale-day spike from an incident. A score/rate with no voice evidence and no ₹ behind it is an AUTO_REJECT (this is the Stage 11 first-fail check alongside the spine/boundary checks).

---

## 5. Per-element mapping (screen / component → enforce / avoid)

**S1 · Category Command Centre** — *Head · Fluid (Banking CX/VoC).* Spine: ✓ (tiles → rail Signals → drills). Applicable: AP-001/AP-002 (three-question triad), AP-011+CL-004 (thin AI band), CL-005/RP-006 (sparkle rail cards), AP-014 (tiles = gauge+sparkline), CL-012/LR-007/AP-019 (one persona, ≤2-deep), CF-002 (light default). **Enforce:** frame the 3 tiles as business questions ("Is my category profitable after returns and CAC?" / "What returns margin is recoverable?" / "Which sellers threaten category trust?"); reuse the triad skeleton; Executive Brief/Pulse = the thin AI band (3 sections + 1 ✦ line, this-week-vs-last). **Avoid:** any matrix/heat-map on this surface (RP-001); >2 dims per tile (RP-002); a wide AI bar (RP-006); decorative elements (CL-013).

**ExecutiveTile ×3** — Applicable AP-014, RP-002, CL-001, "deltas beside the number". **Enforce:** score + sparkline + mini gauge + ✦ callout; delta adjacent; one primary number per tile. **Avoid:** a second encoded dimension beyond the gauge (RP-002); a big graph to convey one number (CL-013).

**RiskSpikeMonitor rail ("Today's Category Signal Monitor", ✦)** — Applicable CL-005/RP-006 (compact sparkle cards), RP-004 (honest name), RP-005 (neutral labels), RP-007 (per-source voice). **Enforce:** keep the honest name "Signal Monitor" (it surfaces *detected* signals); severity-order; each card a compact sparkle card carrying its honesty line. **Avoid:** naming it for live *prediction* (RP-004); a bare "at risk/watch closely" tag — use a quantified label + icon (RP-005).

**ExecutiveBriefStrip / ExecutivePulseStrip** — Applicable AP-011, CL-004, CF-003. **Enforce:** critical/focus/stable, change-first, question-set tuned to head altitude. **Avoid:** turning it into the wide AI insight bar (RP-006).

**FloatingAIDayGenerator (✦)** — Applicable CL-005, AI-marker check. **Enforce:** ✦ marker; re-ranks the rail to the act-on-these. **Avoid:** implying it *acts* (boundary; no autonomous-action label).

**S2 · Recoverable-Margin Returns + InsightCard(T2-02) + CauseCodeBreakdown + FixableIntentSplit + CatalogueCorrectionCard + EvidenceFeed + ActionBar** — Spine ✓. Applicable CL-001, RP-002, RP-005, AP-015 (star — needs the corpus), the AUTO_REJECT set, "undefined-metric" rejection. **Enforce:** headline as a short noun-phrase/question; the honesty line ("detection = return rate; verdict = return free-text + reviews"); recoverable-margin shown with its stated method (fixable-share × excess × contribution); the fixable-vs-intent split as the trust anchor; star the card as integration-dependent. **Avoid:** "returns-data-only" over-claim (dishonest honesty line — HIGH); a sentence-style headline; >2 dims on the card (RP-002); recoverable margin without its method (undefined-metric rejection).

**S3 · Seller Trust-Risk Board + OwnershipBoard + SellerSlaTrustCard + DisputeTriageList + EvidenceFeed + ActionBar** — Spine ✓. Applicable **AP-013 (segment-ownership #1 tile driving drills — reused, relabelled for *sellers*)**, RP-001 (board is a ranked *list/table*, not a matrix — compliant), RP-005, the AUTO_REJECT set. **Enforce:** rank by *customer-backed* exposure; the per-seller evidence pack (doubles as the fall-back-liability artifact); seller-facing draft is FDI-non-discrimination-aware + 25%-cap-checked. **Avoid:** rendering the board as an intent×seller matrix (RP-001); a bare "trust-risk" tag without the quantified exposure + evidence behind it (RP-005 + AUTO_REJECT); naming "Seller Trust-Risk Board" must keep the quantified ₹ exposure visible so "risk" is evidenced, not a judgmental label.

**S4 · Lane RTO Arbitration + VoiceThemeSplit + FaultSplitCard + EvidenceFeed + ActionBar** — Spine ✓. Applicable RP-001/AP-009 (lane shown as a *verdict card*, not a geo heat-map; if a geo view is added, use the national-default heat-map AP-009), RP-002, the process-gap handoff, O-9 gating. **Enforce:** the voice-theme split with the deciding share; the cohort-level honesty line; the process-gap route to the warehouse map; pin-code differential action **gated** (geography proxy). **Avoid:** a dense lane×reason matrix on this head screen (RP-001); a per-customer claim (cohort-level only); >2 dims (RP-002).

**S5 · Festival Incident Monitor + RealVsFailureVerdictCard + DefectWaveCard + EvidenceFeed + ActionBar** — *real-time tier.* Spine ✓. Applicable RP-004 (honest "verdict", not "prediction"), the "is this real?" badge (AUTO_REJECT #6), AP-015, the suppressed-near-miss credibility rule. **Enforce:** the spike-vs-sale-scaled-baseline with the failure-voice corroboration; the conservative tier selector; the suppressed near-miss shown inline; the honesty line (verdict needs the failure-voice feed). **Avoid:** naming it a "prediction" or "risk monitor" (RP-004); an all-red screen (seed the suppressed case); claiming order-data-only.

**Reusable components — InsightCard / DrillPanel / EvidenceFeed / ActionBar** — Applicable CL-005 (✦), RP-002, RP-004, the boundary checks. **Enforce:** InsightCard carries the methodology §G slots incl. the honesty line + ✦ verdict; DrillPanel routes by the item's own ID (never a shared constant); ActionBar labels are Draft/Prepare/Route, advisory items carry no action button, every accept appends an audit line. **Avoid:** over-claiming component names (RP-004); a status/score without its evidence (HIGH); any "Complete Now"/autonomous-firing label (boundary HIGH).

**Storyline naming (all beats)** — Applicable RP-004, RP-005, naming_copy principles. **Enforce:** honest capability naming; neutral, quantified phrasing; e-commerce-correct terms (returns / RTO / reverse logistics / refund). **Avoid:** "chargeback" (card term); internal codes (T2-##, DENSE/BURSTY/SPARSE), vendor/engine names on the face; "buzz/at risk/watch closely" tags (RP-005).

---

## 6. Governance gaps (flag upstream in the `yaara-frontend-dashboard-skill`; do NOT invent at 9C)

1. **No retail / e-commerce product key** — this run maps to "Fluid (Banking CX/VoC)" by function only. **Add** a "Fluid (Retail / E-commerce CX)" product context (industry, sub-domains, the returns/RTO/seller-concentration vocabulary).
2. **No Category / Business Head persona section** — mapped to the generic Head altitude. **Add** a Category/Business Head persona contract (its KPI vocabulary, the must-show/remove list, the dual-buyer ordering with the CX/VoC Head).
3. **No e-commerce naming/copy rules** — `naming_copy_rules` is banking-token (HNI/HSHF/LSLF, "promise breach", revolve/EMI). **Add** e-commerce naming (returns/RTO/reverse-logistics not chargeback; "recoverable margin"; "do-not-promote"; "seller concentration vs FDI 25% cap"). Until added, the generalisable RP-004/RP-005 principles govern.
4. **No "is this real?" sale-window regime badge rule** — Priya's trust threshold needs it (sale-day-vs-incident), and the methodology's sale-scaling supports it, but the rulebook has no pattern. **Add** an approved "regime-aware baseline badge" pattern.
5. **Social/external-voice is governed only by a banking *rejection* (RP-003/RP-007)** — the parked Tier-3 e-commerce social/review-voice reveal needs an **approved** e-commerce pattern (analogous to AP-018 "influential engagement with credentials + sentiment×volume quadrant", relabelled), so per-source social voice is shown the *right* way rather than merely barred. **Add** it before the reveal is built.

---
*Feeds: Stage 10 (pasted verbatim), Stage 11 (the per-element enforce/avoid + the rulebook's `frontend_review_checklist.md` drive the audit). Brand rules applied. — End of Phase 4.5.*
