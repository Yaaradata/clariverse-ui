# Stage 4 Personas — LiSN (Retail/E-commerce CX) / Head of CX

> **Phase 3, stage 1 of 5.** Input: the resolved run-config + the Drive Stage 3 catalogue (`LiSN_Ph1_Retail_Stage3_InsightCardCatalogue.md`, 20 Tier-2 tiles + 2 plumbing layers · 24 Tier-3 bridges · the nominated 12-card 24×7 set). Output: this persona definition, binding the buyer to the actual catalogue cards so Stage 6 screen selection is decided by the persona, not by what is easy to render. Brand: LiSN · British "distil" · "who" not "that" · India primary · no exclamation marks.
>
> Grounding discipline: every KPI, routed exec, trust line and remove-reason below is read off the completed four-engine research, not invented. Where the persona profile did not pre-exist, it is reframed from the catalogue.

---

## Primary persona: Head of CX / Voice-of-Customer Head

**The seat every Tier-2 card routes to** — the catalogue surfaces all 20 anomaly tiles "→ CX/VoC Head → [owning function]". She is the one human who reads the whole interaction corpus and decides who acts.

- **Mandate.** Owns the voice-of-customer / interaction-intelligence function at a large Indian marketplace + quick-commerce operator (Blinkit/Zepto/Instamart-class): every ticket, call, in-app and delivery-partner chat, review, app-store review, social mention, return/cancellation free-text and grievance. Accountable for customer trust, complaint and grievance posture, service quality (FCR/SLA), CX automation quality, and statutory grievance compliance. Reports to the COO or CCO; CX Ops, the grievance/Nodal desk, the AI-ops/conversation-design team, and the analyst round-trip sit under or beside her. **Crucially she sits on a seam:** she owns the CX north-star, but every signal she surfaces must pre-wire to a P&L destination owned by another seat (Category/Business/Growth, Ops). That seam is the product's wedge.
- **Day in the life.** She opens LiSN **daily** — specifically to stop reading the "daily dump" of thousands of mentions an analyst hand-sorts today. She wants the few things worth an exec's attention distilled to one ranked list in the first five seconds, with an **intraday** escalation rail for anything breaking now (a dark-store outbreak, a payment-gateway failure, a virality spike). She has a **weekly** rhythm with the business heads where the CX-to-revenue story has to land. What she does next with what she sees is always the same shape: read the ranked card → confirm the evidence on one drill → approve the drafted route to the owning function. She never fires the action herself.
- **Top questions** (grouped by cadence; tagged for whether answering needs the differentiating transaction join):

  | # | Question | Cadence | Needs join? | Decision it feeds | Action available | Routed exec |
  |---|---|---|---|---|---|---|
  | 1 | What is breaking right now across the whole corpus, and who owns it? | real-time / daily | No (cost via MB1/MB3) | where to point attention today | draft a ranked "emerging now" route within the day | owning function (T2-1) |
  | 2 | Which dark-store catchment is failing before the warehouse dashboard shows it? | intraday | No (margin via MB1) | localised halt / intervene this shift | draft a localised ops alert | City/Dark-store Ops (T2-2) |
  | 3 | Is a perishable/expiry cluster a food-safety event, not a supplier ticket? | intraday | No (via MB2) | immediate node-level decision | route to food-safety with FSSAI exposure flagged | Food-safety + Hygiene (T2-3) |
  | 4 | Which grievances are about to breach a statutory clock? | daily / event | No (via MB22) | re-prioritise by regulatory risk, not time-waiting | override routing, draft a priority alert | Nodal / Grievance officer (T2-11) |
  | 5 | Where are we exposed to a named regulatory instrument before a regulator finds it? | weekly / event | No (provable via MB10) | document and remediate internally | draft a regulatory-exposure card to internal Legal | Legal / Compliance (T2-10) |
  | 6 | Which seller/SKU is degrading in the text before returns or rating move? | daily / weekly | No (trust-tax via MB4) | pre-empt the trust tax | route the entity + evidence, gated to risk review | Seller-Brand Partnerships + T&S (T2-5, T2-6) |
  | 7 | Which intents drive repeat contacts, and which process owner can fix the cause? | weekly | No (cost via MB9) | fix the cause, not the queue | route the cause to the owning process team | process owner for the intent (T2-15) |
  | 8 | Is a "good" number actually a warning? (falling complaint volume) | weekly | No (proven via MB23) | treat a suppressed metric as silent churn | flag as a warning, not a win | CX Ops + Product (T2-20) |
  | 9 | Which refund experiences erode trust / kill repeat? | weekly | No (dollarised via MB8) | fix the refund experiences that destroy demand | route the narrative cluster, flag CP-Rules | Refund/Payments Ops + Compliance (T2-18) |
  | 10 | Is our AI agent quietly failing or containing badly? | daily | No (cost via MB21) | fix the failing bot flow | route the failing flow, gate any flow change | AI-ops / conversation-design (T2-14) |
  | 11 | Did our own release or policy change hurt us? | event | No (cost via MB11/MB14) | roll back / fix the flow | route the version diff; flag Legal if dark-pattern-like | Product (+ Legal) (T2-16) |
  | 12 | **What is the revenue impact of what we are already finding?** | weekly / QBR | **Yes** | justify the Phase-2 expansion | reveal the dollarised bridge tiles lighting up | P&L owner — Category/Business/Growth (MB1/MB4/MB8/MB17) |

  *Question 12 is the wedge question — it is the only one that needs the transaction feed, and it is the one that travels upward with CX's name on it. Every Tier-2 answer is pre-wired to it.*

- **KPI vocabulary** (grounded in the catalogue Tier-1 taxonomy and the merge's quantified anchors; persona fit is checkable against these):
  - **North-star (how CX is measured today):** NPS · CSAT · DSAT · FCR · repeat-contact rate · SLA (acknowledgement / resolution) · CSAT-after-bot / containment quality. *Note the seam: the P&L owner treats these as lagging proxies, which is exactly why every card pre-wires a revenue destination.*
  - **Diagnostic:** contact-per-order (the normalised view, never raw counts) · theme mix & velocity · sentiment by entity · negative-review velocity · escalation rate · AHT / transfer rate · bot-containment rate · channel mix · grievance / NCH volume · statutory-clock exposure · dark-pattern complaint themes.
  - **Wedge / pre-wired P&L destinations (the renewal metrics):** complaint-adjusted GMV-at-risk · contribution margin per store · seller "trust tax" (conversion + returns + seller-health) · refund→repeat loss (30/60/90-day) · cost-to-serve + downstream churn · avoided penalty + grievance-handling cost · silent-retention-loss.

- **Trust threshold** (what a card must carry before she will act — this becomes a per-persona hard fail at 9C/11). A card earns action only when it shows, in this order:
  1. a **confidence band, not a verdict** — the only quantified accuracy bound in the research is ~88.9–90.69% binary, with a hard fall-off on neutral and vernacular sarcasm (the MA18 layer); low-confidence/sarcastic items route to a senior queue, never auto-classify;
  2. **cross-channel corroboration** — a theme breaks its own baseline across ≥2 independent channels (corroboration is the gate, not raw volume);
  3. **denominator normalisation, growth-relative** — "is this up faster than we grew", not "is this up" (MA21);
  4. an **evidence cluster** — the raw-mentions→signals ratio, drillable in one click;
  5. a **recommended draft action + the named routed owner**;
  6. the **named P&L destination + bridge status**.
  - **Hard fails (carry to 9C AUTO_REJECT / 11 HIGH):** a score or badge with no plain-language reason; a raw count not order-normalised; an identity-level flag (must be cohort-level); any action label implying the platform auto-fires or auto-denies; a regulator-facing figure that is not verified-anchor-clean.

- **What this role does NOT want** (remove list — each with its reason; removing the wrong-persona widget is a first-class decision):
  - **Identity-level individual flags** — cohort / catchment-level only; holds the DPDP line and keeps the join defensible (buyer-fraud T2-13 is review-only and never auto-denies a refund).
  - **Auto-fire / auto-send / auto-deny actions** — copilot, not autopilot; every action is draft → human approves → audit-logged.
  - **Raw, un-normalised volume counts** — a high-volume zone looks broken when it is merely busy; MA21 normalisation is mandatory under every tile.
  - **Agent-level per-case triage queues and AHT-by-agent league tables** — that is CX Ops altitude one level below; the head reads the cause and routes it, she does not work the case.
  - **The transaction-only P&L dump presented as the source of truth** — she pre-wires to the P&L destination but does not own the lakehouse; Tier-3 tiles are labelled "bridge-ready (lights up with transaction feed)", never run as if they were live.
  - **The social-virality card on the primary view, by default** (T2-19 / MB13) — the highest false-positive risk of any card; sequence it later, lower-confidence band, behind a mandatory human gate.
  - **Aggregated cross-channel virality / topic scores** — show per channel (governance RP-007), never one blended number.

- **UI expectation + theme accent.** Head-altitude density — calmer than an ops control room (density-by-seniority, CL-012). Dark canvas with a **light/dark toggle** (business heads often prefer light; offer it). The **sparkle/AI marker on every AI element**; the **confidence band visible on every text card**; **two layers only** (primary view + one drill, no Layer 3); bridge-ready tiles visibly labelled. Proposed accent: a **violet/indigo "voice" signature**, distinct from the family's gold/navy (Retail), cyan (Cards) and teal/emerald (Contact Centre). `[confirm accent]`

---

## Secondary personas (handoff context only — no full journeys, per the sales-demo intent)

- **City / Dark-store Ops.** Owns store-level fulfilment quality. *Receives:* the normalised outbreak alert (T2-2) and the perishability halt recommendation (T2-3). *Hands back:* confirmation of the localised action. *Touches:* the outbreak map drill, the bridge tile MB1 (GMV/margin per store).
- **Food-safety & Hygiene.** Owns FSSAI exposure. *Receives:* the perishable/expiry cluster with the FSSAI flag (T2-3 → MB2). *Hands back:* node-halt decision. *Touches:* the "48 of 50 from one node" tile.
- **Seller-Brand Partnerships + Trust & Safety.** Own seller health and authenticity. *Receive:* trust-erosion and rating-velocity clusters, gated to risk review (T2-5, T2-6); counterfeit escalations (→ MB5). *Hand back:* seller action under maker-checker. *Touch:* the seller "trust-tax" bridge MB4.
- **Legal / Compliance + Nodal / Grievance officer.** Own regulatory posture and the statutory clock. *Receive:* the dark-pattern exposure card (T2-10, internal only) and the statutory-breach priority alerts (T2-11); refund-timeline exposure (T2-18). *Hand back:* remediation and audit-logged handling. *Touch:* the regulatory-exposure card and the "approaching statutory breach" tile.
- **Category / Catalogue.** Own listings, sourcing and substitution logic. *Receive:* return/cancellation free-text causes (T2-8), MRP/weight-mismatch (T2-9), substitution-rule failures (T2-4). *Hand back:* listing/sourcing fixes. *Touch:* the return-reason radar; bridges MB6/MB12.
- **AI-ops / Conversation-design.** Own the CX bot. *Receive:* novel bot-failure and containment-quality drops (T2-14). *Hand back:* gated flow/prompt changes. *Touch:* the bot-quality monitor; bridge MB21.
- **Product (+ Payments, Refund Ops).** Own app flows, gateway and refunds. *Receive:* post-release UX regressions (T2-16), "deducted-not-confirmed" payment failures (T2-17), refund-friction narratives (T2-18), and the suppression warning (T2-20). *Hand back:* rollback / flow / reconciliation fixes. *Touch:* version-diff drill; bridges MB8/MB11/MB14/MB23.
- **The P&L owner — Category / Business / Growth head (the Phase-2 seat).** Owns GMV, margin, retention. *Receives:* the dollarised bridge tiles once the transaction feed lands (MB1/MB4/MB8/MB17). *Hands back:* the expansion mandate. *Touches:* the revenue-impact reveal — routed **through** the CX champion, never around her.

---

## Persona-to-card map (every Tier-2 card owned; demo spine marked)

All 20 tiles are surfaced to the **Head of CX**; the "acts" column is the routed exec who owns the fix. Demo-spine = the nominated 12-card 24×7 set (eight ship-now Tier-2 tiles + four bridge-ready tiles).

| Card | Name | Surfaced to | Acts (routed exec) | Demo-spine? | Needs join (Tier-3) |
|---|---|---|---|---|---|
| T2-1 | Cross-channel emerging-issue radar (home tile) | Head of CX | owning function | **Yes — hero** | MB1/MB3 |
| T2-2 | Dark-store operational-failure / outbreak | Head of CX | City/Dark-store Ops | **Yes — hero** | MB1 |
| T2-3 | Perishable / expiry radar (FSSAI) | Head of CX | Food-safety + Hygiene | Yes (WOW bridge) | MB2 |
| T2-4 | Substitution-failure radar | Head of CX | Substitution-logic owner | — | MB6/MB12 |
| T2-5 | Seller / brand trust-erosion (+ new-seller watch) | Head of CX | Seller-Brand Partnerships + T&S | **Yes** | MB4 |
| T2-6 | Per-SKU / per-seller rating-velocity break | Head of CX | Category + Seller/Catalogue | — | MB3 |
| T2-7 | Review-manipulation / fake-review detector | Head of CX | T&S + Marketing/PR | — (integrity floor) | protects MB3/MB4 |
| T2-8 | Cancellation / return-reason free-text radar | Head of CX | Category + Catalogue/Seller | — | MB6 |
| T2-9 | Weight-and-pack / MRP-mismatch (Legal Metrology) | Head of CX | Catalogue + Legal Metrology | — | MB24 |
| T2-10 | Dark-pattern / regulatory-exposure scan | Head of CX | Legal/Compliance (internal) | **Yes — hero** | MB10 |
| T2-11 | Statutory-grievance & SLA-breach predictor | Head of CX | Nodal / Grievance officer | **Yes — hero** | MB22 |
| T2-12 | Medicine-compliance exception | Head of CX | Compliance + Pharmacy | — (WOW, low volume) | bridge tagged |
| T2-13 | Buyer-fraud claim-pattern (review-only) | Head of CX | Trust & Safety / Ops | — | MB8/MB17 |
| T2-14 | AI-agent / chatbot quality monitor | Head of CX | AI-ops / conversation-design | **Yes** | MB21 |
| T2-15 | FCR / repeat-contact root-cause | Head of CX | process owner for the intent | **Yes** | MB9 |
| T2-16 | Post-release UX-regression / dark-pattern detector | Head of CX | Product (+ Legal) | — | MB11/MB14 |
| T2-17 | Payment-failure ("deducted, not confirmed") | Head of CX | Payments + CX reconciliation | — | bridge tagged |
| T2-18 | Refund-friction / promise-breaker radar | Head of CX | Refund/Payments Ops + Compliance | — | MB8 |
| T2-19 | Social-virality early-warning | Head of CX | PR/Brand + Legal | **No — remove from primary** (highest FP) | MB13 `[weak]` |
| T2-20 | Complaint-volume-suppression watchdog (the wedge) | Head of CX | CX Ops + Product | **Yes — hero (WOW)** | MB23 |

**Bridge-ready tiles in the demo spine (Tier-3, visibly labelled, light up with the feed):** **MB1** (dark-store → GMV/margin, the #1 hero) · **MB4** (seller trust-tax) · **MB8** (refund → repeat loss) · **MB17** (defect-cost-vs-LTV appeasement — the WOW differentiator and the compliance stress-test).

**No unowned high-value card.** The one deliberate demotion is **T2-19 social** — high value but the highest false-positive risk in the set; the catalogue panel leans "ship later", so it is removed from the primary demo view rather than dropped, and flagged below as a Stage-6 decision.

**Demo spine (the storyline build order, sales-demo intent):** **T2-1** (the home tile everything renders inside) → **T2-2 + MB1** (the q-commerce dark-store outbreak resolving into complaint-adjusted GMV-at-risk — the purest differentiator) → **T2-20** (the inverse-metric wedge: a falling number flagged as a warning) → **T2-11 / T2-10** (the compliance trust-builders) → the **MB1/MB4/MB8/MB17 revenue-impact reveal**. Each hero beat ends in act-now + approve.

---

## Routing map

```
Head of CX (surfaces every signal, approves every draft, owns the audit log)
  --emerging issue, ranked--------------> owning function                 (T2-1)
  --normalised outbreak, this shift------> City / Dark-store Ops          (T2-2 → MB1)   [CX-detected, Ops-actioned seam]
  --expiry cluster + FSSAI flag----------> Food-safety + Hygiene          (T2-3 → MB2)   [CX-detected, Ops-actioned seam]
  --wrong-substitute pattern-------------> Substitution-logic owner       (T2-4)         [process-gap diamond: NOT store Ops]
  --trust erosion / counterfeit----------> Seller-Brand Partnerships + T&S (T2-5,6 → MB4/MB5)  [gated to risk review]
  --statutory clock breach---------------> Nodal / Grievance officer      (T2-11 → MB22) [routing override on reg keywords]
  --named-instrument exposure------------> Legal / Compliance (internal)  (T2-10 → MB10) [own breach stays inside]
  --repeat-contact cause-----------------> process owner for the intent   (T2-15 → MB9)
  --falling metric, rising risk----------> CX Ops + Product               (T2-20 → MB23) [the wedge]
  --refund friction / promise breaker----> Refund/Payments Ops + Compliance (T2-18 → MB8)
  --bot failure / bad containment--------> AI-ops / conversation-design   (T2-14 → MB21) [gate flow change]
  --release / change regression----------> Product (+ Legal)              (T2-16 → MB11/MB14)
  --revenue-impact reveal (Phase 2)------> P&L owner: Category/Business/Growth  (MB1/MB4/MB8/MB17)  [routed THROUGH CX, never around]
```

Two routing patterns Stage 7 must design as first-class: the **"CX-detected, Ops-actioned" org seam** (the human gate respects the boundary, it does not bypass it — a political risk, not only a technical one), and the **process-gap diamond** (a substitution complaint routes to the team that owns the substitution algorithm, not to store Ops — an easily-lost distinction that is the whole value).

---

## Open questions that change Stage 6 screen selection

1. **Theme accent** — confirm the violet/indigo "voice" signature, or pick another family accent for this persona.
2. **Social card (T2-19)** — confirm it stays off the primary demo view (the recommendation), or whether one disciplined, human-gated instance earns a place in the storyline.
3. **Demo storyline shape** — confirm the five hero beats and their order (home → q-commerce outbreak+bridge → inverse-metric wedge → compliance pair → revenue reveal), which sets the Stage-6 screen list (3–5 screens).
4. **The revenue-impact reveal** — is it a dedicated screen, or an overlay that lights up the bridge tiles on the home view in front of the buyer? This changes the screen count.
5. **Wave-1 corpus scope for the demo's data narrative** — confirm text-first (review + ticket + return text, PII-light) so the DPDP posture reads as a feature in the walk-through, with voice/chat framed as Wave 2.

---

**Feeds:** Stage 5 (entities/data model — the domain spine Customer Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action), Stage 6 (screen selection + widget justification + the remove list), Stage 7 (the two routing patterns + the process-gap diamond), Stage 9C (the trust-threshold hard fails become AUTO_REJECT). Apply LiSN brand rules throughout.
