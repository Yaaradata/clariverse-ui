# Stage 6 — UI Specification — LiSN (Retail/E-commerce CX) / Head of CX

> **Phase 3, stage 3 of 5.** Input: run-config + Stage 3 catalogue + Stage 4 personas + Stage 5 data model. Decides what screens exist and what each answers. Visual *rules* (colour/spacing/chart) are governed at 9C; this stage decides structure and content. The seven design rules and the persona MUST-SHOW/REMOVE lists govern every decision. Brand: LiSN · British "distil" · India primary · no exclamation marks.

**Locked decisions (from Stage 4 open questions):** accent violet/indigo "voice" signature; T2-19 social OFF the primary view; five-beat storyline; the revenue reveal is a dedicated fifth screen; Wave-1 corpus text-first. Reference build pattern: `HeadOfCreditCardsDashboard` (dark canvas + light/dark toggle, collapsible sidebar, three exec tiles, AI exec-summary bar, AI risk-spike monitor, floating AI day generator).

---

## Screen list (5 screens — within the sales-demo 3–5 target)

| # | Screen | Persona TOP_QUESTION answered | Storyline role |
|---|---|---|---|
| 1 | **CX Command** (default landing) | Q1 "What is breaking right now, and who owns it?" | Beat 1 — the home tile every card lives inside |
| 2 | **Quick-Commerce Health** | Q2/Q3 dark-store outbreak + perishable food-safety | Beat 2 — the q-commerce WOW + the #1 bridge |
| 3 | **Compliance & Conduct** | Q4/Q5/Q9 statutory clock + dark-pattern + refund friction | Beat 4 — the compliance trust-builders |
| 4 | **CX Quality & the Wedge** | Q6/Q7/Q10 seller trust, repeat-cause, bot quality + **the suppression watchdog** | Beat 3 — the inverse-metric WOW |
| 5 | **Revenue Bridge** (the reveal) | Q12 "What is the revenue impact of what we are already finding?" | Beat 5 — bridge tiles light up with the (mock) transaction feed |

**Cuts (stated):** no agent-level queue screen (CX Ops altitude, one below — wrong altitude); no standalone Social/Virality screen (T2-19 highest FP — removed from primary, sequenced later); no per-individual case screen (cohort-level only). Each cut removes a wrong-persona or wrong-altitude surface, per the persona REMOVE list.

**Default landing:** Screen 1 (CX Command).

---

## Widget justification (both directions)

**Keep (component → why, against the persona's questions + MUST-SHOW):**
- *AI exec-summary bar (thin, 3 sections + 1 line)* → signals "this is an AI product" in the first 5 seconds (AP-011); answers "what changed" before "what happened" (CL-004).
- *Three executive tiles (the triad)* → the role in one glance: **Emerging Issues · Quick-Commerce Health · Compliance Posture** (AP-001/AP-002, the canonical triad reused).
- *Emerging-issue radar rail (T2-1)* → the distilled "act on these" list; the home tile every other card drills from (O-1).
- *Catchment outbreak map (T2-2)* → peer-relative, normalised; the q-commerce differentiator.
- *Statutory-clock queue (T2-11)* and *dark-pattern exposure card (T2-10)* → the compliance trust-builders the role is accountable for.
- *Suppression watchdog (T2-20)* → the wedge; the rare "falling number is a warning" card.
- *Bridge-ready tiles (MB1/MB4/MB8/MB17)* → starred integration-dependent tiles (AP-015) — visible, labelled, honest about needing the feed.
- *Floating AI Day Generator* → the AI analyst over the insight store.
- *Sparkle marker + confidence band* on every AI element (non-negotiable).

**Remove (component → reason, from the persona REMOVE list):**
- *Agent-level queues / AHT-by-agent league tables* → CX Ops altitude one below; the head reads the cause, not the case (CL-012, mixed-persona).
- *Identity-level individual flags* → cohort/catchment-level only (DPDP line); buyer-fraud is review-only.
- *Raw un-normalised volume counts* → a busy zone looks broken; everything is contact-per-order normalised (MA21).
- *Social-velocity / virality tile on the primary view* → highest FP of any card; off primary, and if ever shown, per-channel only, behind a human gate (aligns with RP-003/RP-007).
- *The transaction-only P&L dump as a source of truth* → she pre-wires to the P&L destination but does not own the lakehouse; bridges are labelled "bridge-ready", not live.
- *Auto-fire / "Complete Now" action labels* → copilot not autopilot; every action reads "Draft / Prepare / Route".

---

## Per-screen zone specification

### Screen 1 — CX Command (landing)
- **Headline signal (top-left, largest):** the #1 ranked emerging issue from the radar, e.g. *"UPI-step checkout failures breaking across 3 channels — route to Payments today."* **So what:** the single costliest emerging problem and its owner, not a number.
- **AI exec-summary bar:** 3 sections (Critical / Focus / Stable) + one AI line. Renders T2-1 distillation.
- **Three executive tiles:** Emerging Issues (T2-1) · Quick-Commerce Health (rolls up T2-2/T2-3) · Compliance Posture (rolls up T2-10/T2-11). Each: a primary number + sparkline + AI callout.
- **Emerging-issue radar rail (T2-1):** horizontal scroll of ranked "emerging now" cards, each with the **raw-mentions→signals ratio** and corroborating-channel chips.
- **KPIs shown:** contact-per-order (Δ vs last week), theme velocity, NPS/CSAT delta — all from Stage 5 fields; all in the persona vocabulary.
- **Explainability line (written):** *"Flagged because this theme broke baseline across app reviews, care chat and X within ~6 hours; 1,900 mentions distilled to 1 signal."*
- **Default time comparison:** **this week vs last** (head cadence, rule 3); intraday toggle on the radar rail.
- **Primary actions:** "Route to owning function" (draft) · "Open AI Day Generator".
- **Layer-2 drill:** the radar-card evidence pack (corroboration + snippets + ruled-out + draft route).

### Screen 2 — Quick-Commerce Health
- **Headline:** *"Koramangala D07 issue-rate is 6× its own baseline while peers hold flat."* **So what:** a catchment is failing before the warehouse dashboard shows it.
- **Cards:** Catchment outbreak map (T2-2) · Perishable/expiry radar (T2-3, FSSAI-flagged) · Substitution-failure radar (T2-4). The **bridge-ready MB1 tile** sits beside the map, starred (AP-015).
- **KPIs:** normalised issue-rate per store, peer-relative; perishable-cluster count; substitution-failure rate.
- **Explainability line:** *"Normalised to order volume so a busy store does not read as a broken one; 48 of 50 spoilage complaints trace to one node."*
- **Time default:** today vs yesterday + this-shift (outbreaks are intraday).
- **Primary actions:** "Draft localised ops alert → City Ops" · "Route to Food-safety (FSSAI flag)" · "Route to substitution-logic owner" (the process-gap diamond — not store Ops).
- **Drill:** outbreak signature — store × issue-type breakdown + the complaint snippets + the drafted ops alert.

### Screen 3 — Compliance & Conduct
- **Headline:** *"3 grievances within 6 hours of a statutory deadline — re-prioritised above time-waiting."* **So what:** the queue is ranked by regulatory risk, not by who waited longest.
- **Cards:** Statutory-clock queue (T2-11) · Dark-pattern exposure scan (T2-10, internal-Legal-only) · Refund-friction radar (T2-18) · Weight/MRP-mismatch (T2-9, Legal Metrology).
- **KPIs:** statutory-clock exposure count; named-instrument evidence count; refund-narrative cluster size. Counts render at realistic scale (RP-009).
- **Explainability line:** *"Matched to a named instrument (CCPA basket-sneaking) with an auditable evidence count — not a loose keyword."*
- **Time default:** this week vs last; clock countdowns live per item.
- **Primary actions:** "Draft priority alert → Nodal officer" · "Prepare regulatory-exposure card → internal Legal" (never external) · "Route refund cluster → Refund Ops".
- **Drill:** compliance-evidence signature — the instrument, the evidence count, the surface reference, the audit trail.

### Screen 4 — CX Quality & the Wedge
- **Headline (top-left):** the **suppression watchdog** — *"Electronics ticket volume fell 18% — but contact-per-order is flat and the chat button moved. A warning, not a win."* **So what:** the sharpest CX-vs-P&L seam, made visible.
- **Cards:** Suppression watchdog (T2-20, the WOW) · Seller trust-erosion (T2-5) · FCR/repeat root-cause (T2-15) · AI-agent quality monitor (T2-14).
- **KPIs:** contact-per-order vs order growth; negative-review velocity; repeat-contact rate by intent; containment / CSAT-after-bot.
- **Explainability line:** *"Falling complaint volume coincides with a support-access change, not a quality improvement — flagged as silent churn."*
- **Time default:** this week vs last.
- **Primary actions:** "Route to CX Ops + Product (check access path)" · "Route to Seller-Brand Partnerships (gated to risk review)" · "Route cause to the process owner" · "Route failing flow → AI-ops".
- **Drill:** inverse-anomaly signature — the falling line shown as *red*, the access-change event marker, the order-normalised baseline overlay.

### Screen 5 — Revenue Bridge (the reveal)
- **Headline:** *"The signals you already trust, now in rupees — when the order feed lands."* **So what:** the Phase-2 flip, routed through the CX champion, never around her.
- **Cards (starred, AP-015):** MB1 (dark-store → GMV/margin) · MB4 (seller trust-tax) · MB8 (refund → repeat loss) · MB17 (defect-cost-vs-LTV appeasement, heaviest-governance, differential action gated).
- **KPIs:** complaint-adjusted GMV-at-risk; seller trust-tax; refund→repeat loss — all `[illustrative]`, all `[Phase 2]`.
- **Explainability line:** *"Bridge-ready: the CX signal on the left joins to a minimal order feed on the right at cohort level; lights up with the transaction feed."*
- **Time default:** this week vs last.
- **Primary actions:** "Preview the join (mock feed)" · "Frame the pilot data ask" — no live action; this is the expansion narrative.
- **Drill:** bridge signature — CX signal ⨝ (mock) transaction cohort → the dollarised number, with the cohort-level + human-approved guardrail shown.

---

## Card anatomy (the Fluid monitor-rail slots, per the methodology — honest slots only)

Every surfaced-unit card renders these slots:
1. **Title** — names what deviated (short noun phrase, never a sentence title).
2. **Severity** — from magnitude + impact + confidence; drives ordering.
3. **Cohort** — who/where it was isolated at (catchment, seller cohort, intent — never an individual).
4. **Data source (honesty line)** — the feed that actually proves it; states where detection is interaction-only and attribution needs the Phase-2 feed.
5. **Time-onset** — the change-point window.
6. **Stats box** — the deviation, normalised (contact-per-order, peer-relative).
7. **AI verdict (sparkle)** — the plain-language cause + the recommended **draft** action.
8. **Confidence band** — High/Med/Low (never a bare verdict; MA18).
9. **Bridge status** (Tier-3 tiles only) — "bridge-ready (lights up with transaction feed)" + the star (AP-015).

---

## Goal → Capability → UI mapping

| TOP_QUESTION | Capability (Stage 5) | UI zone | Gap? |
|---|---|---|---|
| Q1 what is breaking now | O-1, C-3 | S1 radar rail + headline | — |
| Q2 dark-store failing | C-5, C-1 | S2 outbreak map | — |
| Q3 perishable/food-safety | C-5, C-4 | S2 perishable radar | — |
| Q4 statutory clock | C-8 | S3 statutory-clock queue | — |
| Q5 regulatory exposure | C-7 | S3 dark-pattern card | — |
| Q6 seller degrading | C-6, O-5 | S4 seller trust-erosion | — |
| Q7 repeat-contact cause | C-2, C-6 | S4 FCR/repeat card | — |
| Q8 good number = warning | C-9, C-2 | S4 suppression watchdog (headline) | — |
| Q9 refund experiences | C-7 | S3 refund-friction radar | — |
| Q10 bot quality | O-4, C-3 | S4 AI-agent monitor | — |
| Q11 release hurt us | C-10 | (drill within S1 radar / S4) | — |
| Q12 revenue impact | C-11 `[P2]` | S5 Revenue Bridge | bridge-ready (honest, not a gap) |

No persona question is left without a capability.

---

## Navigation + landing + states
- **Navigation:** collapsible sidebar (5 screens); default landing S1; Floating AI Day Generator persists across screens. Two layers only (screen → one drill; no Layer 3 — AP-019).
- **States (sales-demo):** selection + happy path fully built; loading/empty/error may be stubbed but never break the walk-through; live radar rail must reset cleanly on persona/screen switch (no stale timers). No browser storage.
