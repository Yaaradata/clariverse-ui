# Cursor Build — LiSN (Retail/E-commerce CX) / Head of CX  (give passes one at a time; confirm each before the next)

> Assembled from locked Stages 4–9C. **Do not paste this whole file at once.** Give Cursor Pass 1, confirm it builds, then Pass 2, and so on. Cursor implements only; it never invents strategy, screens, data, product logic, or design rules. Brand: LiSN · British "distil" · "who" not "that" · "cost-efficient at scale" · no exclamation marks · India primary.

---

## Locked context (read before any pass)

- **Product / wedge:** LiSN, the interaction-intelligence layer for an Indian marketplace + quick-commerce operator. It ingests 100% of the interaction/voice/complaint corpus, surfaces proactive anomalies a transaction-only tool cannot, and **pre-wires each to a named P&L destination** one field-flip away.
- **Boundary (DOES_NOT_DO):** consumes the operator's feeds; owns the interaction corpus; **never owns the lakehouse; never auto-fires; never files regulatory evidence itself; cohort-level, never identity-level.** Every action is **draft → human approves → audit-logged**. Every AI element carries the **sparkle marker**; every text card shows a **confidence band, not a verdict**.
- **Domain spine (every element must trace it):** Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action.
- **Primary persona:** Head of CX / VoC Head — head altitude, daily cadence (this-week-vs-last default; intraday on q-commerce). The seat every signal routes to.
- **Intent / target:** client sales demo; Cursor React/TSX prototype; 5 screens; mock data shallow-but-vivid, numbers tie out; in-memory state only (**no localStorage/sessionStorage**).
- **Reference component — study and match its pattern exactly:** `HeadOfCreditCardsDashboard` (dark canvas + light/dark toggle, collapsible sidebar, `DashboardThemeProvider`, 3 executive tiles, thin AI exec-summary bar, AI Risk Spike Monitor, Floating AI Day Generator, drill-downs as separate components). File: `frontend/components/role-based-dashboard/CXVoCHeadDashboard.tsx` (+ drill components).
- **Accent:** violet/indigo "voice" signature (token applied in Pass 1).
- **Screens (locked):** S1 CX Command (`/`, landing) · S2 Quick-Commerce Health (`/quick-commerce`) · S3 Compliance & Conduct (`/compliance`) · S4 CX Quality & the Wedge (`/cx-quality`) · S5 Revenue Bridge (`/revenue-bridge`).
- **Mock data:** use **only** the embedded Stage 9A universe + Stage 9B units/payloads/evidence (entities DS-/SLR-, signals SIG-T2-..; baselines sale-excluded; every number ties out across screens). Do not generate your own data.

---

## Pass 1 — Foundation
**Files:** `CXVoCHeadDashboard.tsx`, `DashboardThemeProvider`, `AppShell`, sidebar.
- Study `HeadOfCreditCardsDashboard` and match its shell exactly: dark canvas + **light/dark toggle**, collapsible sidebar with the 5 routes, `DashboardThemeProvider` carrying the **violet/indigo** accent token.
- Header cleanup; remove dead-weight/decorative elements (CL-013). No vendor/platform names, no internal codes on any face.
- No business logic yet.
- **9C enforce:** CF-002 (offer light; dark only with verified contrast). **DoD:** shell renders, toggle works, 5 routes navigate, default landing `/`.

## Pass 2 — Primary screen (S1 CX Command)
**File:** `CXCommandScreen.tsx` + `ExecutiveTile`, `AiExecSummaryBar`.
- **Headline top-left, largest:** the #1 emerging issue from SIG-T2-01-001 — *"UPI-step checkout failures breaking across 3 channels — route to Payments today."* with its **so-what**, not a bare number.
- **`AiExecSummaryBar`** (thin, 3 sections Critical/Focus/Stable + 1 AI line) — AP-011/CL-004, sparkle.
- **Three `ExecutiveTile`s (canonical triad, AP-001/AP-002):** Emerging Issues (T2-1) · Quick-Commerce Health (T2-2/T2-3 roll-up) · Compliance Posture (T2-10/T2-11 roll-up). Each: primary number + sparkline + AI callout; deltas beside the number.
- KPIs: contact-per-order (Δ vs last week), theme velocity, NPS/CSAT delta — from the embedded data.
- Default time comparison **this week vs last**; intraday toggle on the rail (Pass 3).
- **9C enforce:** CL-001 (question framing), AP-014 (dial+sparkline), ≤2 dims (RP-002), one persona per screen (CL-012). **Avoid:** RP-006 (wide AI bar). **DoD:** triad + summary bar render from embedded data; no agent-level/identity-level content.

## Pass 3 — Intelligence widgets + drill framework
**Files:** `InsightCard`, `RadarRail`/`RiskSpikeMonitor`, `FloatingAIDayGenerator`, `DrillPanel`, `AiMarker`, `ConfidenceBand`, `DraftActionFooter`.
- **`RadarRail` (T2-1):** horizontal scroll of ranked `InsightCard`s; each shows the **raw-mentions→signals ratio** and **corroboration per channel** (RP-007 — never one blended number). Reset timers on screen switch (no stale closures).
- **`InsightCard` honest slots:** title · severity · cohort · **honesty line** · onset · stats (normalised) · **AI verdict (sparkle)** · **confidence band**. Status never without its evidence.
- **`DrillPanel` — seven DISTINCT signatures** switched on `signal.type` (do not reuse one table): radar/corroboration · geo outbreak · statutory queue · compliance-evidence · inverse-anomaly · entity-velocity · bridge. Each renders the Stage-9B evidence pack for the selected unit; **routes by the item's own ID**.
- **`DraftActionFooter`:** "Draft / Prepare / Route" + approve + "accepted by X on date Y"; appends to in-memory `auditLog`. **Never** "Complete Now" or any auto-fire label.
- **9C enforce:** CL-005/RP-006 (sparkle card), RP-007 (per-channel), RP-004 (honest names). **DoD:** radar renders SIG-T2-01-001 with its drill; sparkle + confidence band on every AI element; draft footer gates the action.

## Pass 4 — S2 Quick-Commerce Health (+ the MB1 bridge reveal)
**File:** `QuickCommerceHealthScreen.tsx` + `OutbreakMap`, `BridgeReadyTile`.
- **Headline:** SIG-T2-02-001 — *"Koramangala D07 issue-rate is 6× its own baseline while peers hold flat."*
- **`OutbreakMap`** — peer-relative, normalised, geo map defaulting to city view (AP-009 geo carve-out to RP-001 — a node map, **not** a dense matrix); nodes route by `dark_store_id`.
- Perishable radar (SIG-T2-03-001, FSSAI-flagged) + substitution radar (T2-4 → the **process-gap diamond**: route to the substitution-logic owner, not store Ops).
- **`BridgeReadyTile`(MB1)** beside the map — **starred (AP-015)**, labelled "bridge-ready (lights up with transaction feed)"; the dollar figure shown as `[illustrative, Phase 2]`, never live.
- Actions: "Draft localised ops alert → City Ops" (CX-detected, Ops-actioned seam — respect it), "Route → Food-safety (FSSAI)", "Route → substitution-logic owner".
- **DoD:** outbreak drill shows D07 vs peers + node snippets + drafted alert; MB1 tile reads as bridge-ready, not live.

## Pass 5 — S3 Compliance & Conduct
**File:** `ComplianceConductScreen.tsx` + `StatutoryQueue`, `ComplianceEvidenceCard`.
- **Headline:** SIG-T2-11-001 — *"3 grievances within 6 hours of a statutory deadline — re-prioritised above time-waiting."*
- `StatutoryQueue` (T2-11): re-ranked by clock proximity; each row a countdown + statutory keyword + audit trail; counts at realistic scale (RP-009); regulation firm-level, never "regulator" as an actor on the face.
- `ComplianceEvidenceCard` (T2-10): named instrument (CCPA basket-sneaking) + evidence count + surface ref; routes to **internal Legal only**.
- Refund-friction (T2-18) + MRP-mismatch (T2-9) cards.
- Actions: "Draft priority alert → Nodal officer", "Prepare regulatory-exposure card → internal Legal" (never external).
- **DoD:** statutory drill shows GRV-0412 countdown + keyword + audit trail; dark-pattern drill shows the named-instrument evidence pack; nothing routes externally.

## Pass 6 — S4 CX Quality & the Wedge
**File:** `CXQualityWedgeScreen.tsx` + `SuppressionWatchdogCard`, `SellerTrustCard`, `FcrRepeatCard`, `BotQualityCard`.
- **Headline = the WOW:** SIG-T2-20-001 — *"Electronics ticket volume fell 18% — but contact-per-order is flat and the chat button moved. A warning, not a win."*
- `SuppressionWatchdogCard` inverse-anomaly drill: the falling line shown **red**, the order-normalised overlay (the "improvement" vanishes), the support-access-change marker — evidence-backed neutral status (RP-005 satisfied because the verdict carries its evidence).
- Seller trust-erosion (SIG-T2-05-001, integrity-guarded), FCR/repeat (SIG-T2-15-001), bot quality (SIG-T2-14-001).
- Actions: "Route → CX Ops + Product (warning)", "Route → Seller-Brand Partnerships (gated to risk review)", "Route cause → process owner", "Route failing flow → AI-ops (gated)".
- **DoD:** the suppression drill makes the seam visible; gated cards show the risk-review gate, never auto-act.

## Pass 7 — S5 Revenue Bridge + global cleanup
**File:** `RevenueBridgeScreen.tsx` + 4×`BridgeReadyTile`.
- Four starred bridge tiles (AP-015): MB1 (dark-store → GMV/margin), MB4 (seller trust-tax), MB8 (refund → repeat loss), MB17 (defect-cost-vs-LTV appeasement — **heaviest governance:** cohort-banded, proxy-audited, differential action **gated**, never auto-applied).
- Bridge drill = split join view: CX signal cohort ⨝ mock transaction cohort → `[illustrative]` P&L number; cohort-level + human-approved + "bridge-ready" guardrails shown. Actions: "Preview the join (mock feed)", "Frame the pilot data ask" — no live action.
- **Global cleanup pass:** verify numbers tie out across S1/S2/S5 for each cohort; strip any internal codes/vendor names; confirm every AI element has the sparkle + confidence band; confirm no auto-fire labels anywhere; confirm light/dark contrast.
- **DoD:** the five-beat storyline runs end to end with no dead drill; the differentiation (the voice→P&L join) is unmistakable.

---

## Stage 9C rules (apply per screen/component — full file: `Stage9C_Build_Quality_Filter_v1.md`)
**Global enforce:** CL-001 question cards · CL-004/AP-011 thin AI bar · CL-005/RP-006 sparkle card · AP-001/AP-002 triad · AP-014 dial+sparkline · AP-019 two-level depth · **AP-015 star the bridge tiles** · CL-012/LR-007 one persona + head density · CF-002 light/dark · spine trace · AI marker · status-with-evidence · no autonomous-action label · deltas beside number · short noun-phrase titles · CL-013 no decorative.
**Global reject:** RP-001 no matrices/heatmaps on the head screen (geo OutbreakMap is the AP-009 carve-out) · RP-002 ≤2 dims · RP-003 no virality tile on the primary view · RP-004 no over-claiming component names · RP-005 no biased labels (evidence-backed status only) · RP-006 no wide AI bar · RP-007 per-channel never aggregated · RP-009 realistic counts.

## Engineering guardrails (every pass)
**Cursor MUST NOT:** invent screens/cards/KPIs/logic; change persona/scope/positioning; add/remove widgets outside the locked MUST-SHOW/REMOVE lists; generate its own data; introduce design rules; use localStorage/sessionStorage; put internal codes/vendor names/domain-wrong terms on a card face; auto-fire any action or label one; show an AI verdict or "compliant" status without its evidence + a human approve step.
**Cursor MUST:** build exactly the locked screen list + component tree; reuse components, never duplicate; match `HeadOfCreditCardsDashboard` exactly; render each card from its specified data + its **distinct** drill signature; sparkle on every AI element; honour the 9C enforce/avoid IDs; implement the human-gate/approve step; keep state in app memory.

## Recurring bug-class checks (every pass)
- single global `@keyframes` block for the `DrillPanel` slide-in;
- unique SVG gradient ID per `Sparkline`/`Gauge` instance;
- intervals/timers cleared on unmount + screen switch (the live radar rail);
- drill-down routes by the row's own ID, never a shared constant;
- screen/persona switch resets active drill + filters + timers.

**If anything required is missing or contradictory, stop and surface the gap — do not invent a resolution.**
