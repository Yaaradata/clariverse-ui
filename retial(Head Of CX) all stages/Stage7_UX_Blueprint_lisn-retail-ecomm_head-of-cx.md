# Stage 7 — UX Blueprint — LiSN (Retail/E-commerce CX) / Head of CX

> **Phase 3, stage 4 of 5.** Input: Stage 6 UI spec + Stage 4 personas + Stage 5 model + the methodology card-anatomy. Turns the static screens into flows, **distinct** drill-down signatures (a hard LiSN preference — no shared drill block), the process-gap diamond, the ordered demo storyline, states, and the human-gate moments. Brand: LiSN · India primary.

Every flow must visibly traverse the DOMAIN SPINE end to end: **Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action.** A flow that stops before the drafted action is incomplete.

---

## 1. Primary flows (one per TOP_QUESTION; spine traversed)

| # | Flow (landing → screen → card → drill → action) | Spine traversed |
|---|---|---|
| Q1 | S1 → radar headline → drill: corroboration + snippets + ruled-out → **Draft "Route to owning function"** | Interaction→Signal→Issue→Owner→Evidence→Action ✓ |
| Q2 | S1 tile → S2 outbreak map → drill: store×issue + snippets → **Draft "Localised ops alert → City Ops"** | ✓ (CX-detected, Ops-actioned seam) |
| Q3 | S2 perishable radar → drill: node concentration + return-reason text → **Draft "Route → Food-safety (FSSAI flag)"** | ✓ |
| Q4 | S1 tile → S3 statutory queue → drill: clock countdown + keyword + audit trail → **Draft "Priority alert → Nodal officer"** | ✓ |
| Q5 | S3 dark-pattern card → drill: named instrument + evidence count + surface ref → **Prepare "Regulatory-exposure card → internal Legal"** | ✓ |
| Q6 | S4 seller card → drill: text cluster + new-seller window + integrity check → **Route → Seller-Brand Partnerships (gated)** | ✓ |
| Q7 | S4 FCR/repeat card → drill: Pareto of repeat-driving intents → **Route cause → process owner** | ✓ |
| Q8 | S4 headline (suppression) → drill: falling line + access-change marker → **Route → CX Ops + Product (warning)** | ✓ |
| Q9 | S3 refund radar → drill: narrative cluster + CP-Rules exposure → **Route → Refund/Payments Ops** | ✓ |
| Q10 | S4 bot monitor → drill: failing flow + containment drop → **Route failing flow → AI-ops (gated)** | ✓ |
| Q12 | S5 bridge tile → drill: CX signal ⨝ mock feed → dollarised number → **"Preview join / Frame pilot data ask"** | ✓ (cohort-level, honest) |

Head depth is two clicks (card → one drill → action), per AP-019.

---

## 2. Distinct drill-down signatures (NO shared pattern — each has a different spine)

1. **Radar/emerging-issue signature (T2-1).** A *ranked corroboration view*: the raw-mentions→signals funnel, a cross-channel corroboration strip (which channels lit up, when), a theme timeline, the ruled-out alternatives (single-channel? sale-day? sarcasm?), then the draft route. *What it proves:* this is signal, not noise, distilled from thousands.
2. **Geographic outbreak signature (T2-2/T2-3).** A *peer-relative map drill*: the catchment vs its peer stores (normalised), the store's issue-type breakdown, the complaint snippets keyed to the node, a perishable/food-safety multiplier, then the localised ops-alert draft. *Proves:* the failure is local and real, not a busy-store artefact. Routes by the **store's own ID** (never a shared constant).
3. **Statutory-clock queue signature (T2-11).** A *worklist drill*: the queue re-ranked by clock proximity, each item's countdown + statutory keyword + stall-state, the full audit trail, then the priority-alert draft. *Proves:* the re-ranking is explicit (clock + keyword), low FP.
4. **Compliance-evidence signature (T2-10/T2-9).** A *named-instrument evidence pack*: the matched instrument, the auditable evidence count, the surface reference (checkout/listing/PDP), the live fact-pattern it matches, then the internal-Legal draft. *Proves:* it is a defensible regulatory finding, not a keyword.
5. **Inverse-anomaly signature (T2-20).** A *deliberately inverted drill*: the falling metric shown as **red**, the order-normalised baseline overlaid (so the "improvement" disappears once normalised), the support-access-change event marker, then the warning route to Product. *Proves:* a good-looking number is silent churn. Unique on purpose — no other card inverts.
6. **Entity velocity signature (T2-5/T2-6).** A *seller/SKU drill*: the negative-review velocity break vs the still-flat lagging average, the onboarding-cohort window, the integrity-guard check (is this brigading? T2-7), then the gated route. *Proves:* the text leads the metric.
7. **Bridge signature (MB1/MB4/MB8/MB17).** A *split join view*: the CX signal cohort on the left ⨝ the (mock) transaction cohort on the right → the dollarised P&L number, with the cohort-level + human-approved + bridge-ready guardrails shown. *Proves:* the wedge — voice explains a movement the transaction dump alone cannot.

Seven card types, seven distinct drill spines. Repeated identical drill blocks are an anti-pattern here.

---

## 3. The process-gap / cross-owner "diamond"

- **Primary diamond — substitution failure (T2-4).** A "wrong substitute" complaint is *not* a store-Ops ticket: it routes to the team that owns the **substitution algorithm**. The drill makes the distinction explicit ("this is a logic failure, not a picker failure → substitution-logic owner"). This easily-lost distinction is the highest-value handoff in the q-commerce story.
- **Org-seam diamond — CX-detected, Ops-actioned (T2-2/T2-3).** CX detects the outbreak; Ops acts. The human gate is designed to **respect the seam, not bypass it**: LiSN drafts the alert, the CX Head approves and routes, City Ops owns the action — a political boundary, not only a technical one.
- **Regulatory diamond — the operator's own breach (T2-10).** When the scan documents the operator's *own* dark pattern, it routes to **internal Legal only**, never external. The drill carries the "stays inside" guardrail visibly.

---

## 4. Demo storyline (ordered beats — built from the most differentiating beat first)

Each beat: **hook → drill (proof) → act-now + approve**.

- **Beat 1 — "The daily dump, distilled." (S1, T2-1).** *Hook:* the radar headline names the one costliest emerging issue. *Drill:* 1,900 mentions → 1 signal, corroborated across 3 channels. *Act-now:* Draft route to the owning function → CX Head approves ("accepted by [name] on [date]").
- **Beat 2 — "A store is failing before the warehouse knows." (S2, T2-2 → MB1).** *Hook:* Koramangala D07 at 6× its own baseline while peers hold flat. *Drill:* 48 of 50 spoilage complaints from one node; normalised so it is not a busy-store artefact. *Act-now:* Draft localised ops alert → City Ops, approve. *Reveal:* the starred MB1 tile beside it — "this is ₹X in contribution margin at risk when the order feed lands."
- **Beat 3 — "The good number that is actually bad." (S4, T2-20).** *Hook:* electronics ticket volume fell 18%. *Drill:* contact-per-order is flat and the chat button moved — silent churn, not quality. *Act-now:* Route to CX Ops + Product as a **warning, not a win**. (The WOW beat — the seam made visible.)
- **Beat 4 — "Caught before the regulator." (S3, T2-11 + T2-10).** *Hook:* 3 grievances within hours of a statutory deadline; a basket-sneaking pattern matched to a named instrument. *Drill:* the clock countdowns + the auditable evidence count. *Act-now:* Draft priority alert → Nodal officer; Prepare regulatory-exposure card → internal Legal (never external), approve.
- **Beat 5 — "Now in rupees." (S5, MB1/MB4/MB8/MB17).** *Hook:* the signals she already trusts, dollarised. *Drill:* the split join view (CX signal ⨝ mock feed → P&L). *Act-now:* "Frame the pilot data ask" — routed through the CX champion. The Phase-2 flip.

Every AI element across all beats carries the sparkle marker and a confidence band.

---

## 5. Interaction states (calibrated to the sales-demo intent)

- **Selection / filter:** screen + time-comparison (this-week-vs-last default; intraday on S2). Selecting a radar card or a map node opens its distinct drill.
- **Loading / empty / error:** stubbed or static — never in a way that breaks the walk-through (sales-demo rule). The Revenue Bridge tiles render in a visible "bridge-ready / awaiting feed" state by design (not an error state).
- **Simulated "live" behaviour:** the S1 radar rail streams ranked cards. **Reset rule:** clear all intervals/toasts on screen or persona switch — no stale closures or timer leaks (a known bug class).
- **No browser storage** — all state in app memory.

---

## 6. Human-gate & maker-checker moments

Every drafted action carries the gate. Explicit gate points:
- **T2-1, T2-2, T2-3, T2-11, T2-18:** Draft → CX Head approves → audit-logged ("accepted by [name] on [date]").
- **T2-5 / MB5 (counterfeit), T2-13 (buyer-fraud), MB17 (LTV appeasement):** **gated to risk review** — insight is surfaced, but *differential action* (a seller penalty, a refund denial, a differential refund) requires human + risk approval; never auto-fired, never auto-denied.
- **T2-10 (operator's own breach):** drafted to **internal Legal only**, audit-logged, never external.
- **MB17 specifically:** the heaviest-governance card — cohort-banded, proxy-audited, transparent, human-approved; the low-LTV edge under the heaviest scrutiny.

No card auto-fires. No action label implies autonomous filing ("Complete Now" is forbidden; labels read "Draft / Prepare / Route").

**Feeds:** Stage 8 (flows + drill signatures shape the component tree + routing), Stage 9B (storyline beats + evidence packs to seed), Stage 10 (storyline + human-gate steps to build).
