# Stage 1 · Use-Case Miner C — Channel, commercial and carve-out lens

**Prospect:** Kartik Kumar, President – Global Commercial Fire, Kidde Global Solutions (KGS) · **Owner:** YaaraLabs / LiSN · **Date:** 28 Sep 2026 · **Inputs:** `KGS_Stage0_Merged_Dossier_v1.md` (IDs M0.x, MD-x, MH-x, K-x) plus recall cross-check of raw engine files C (Opus), G (ChatGPT — unique facts `[src-unresolved]`), P (Perplexity) and X (Exa, read from Drive).

## Framing

This lens covers the part of Kartik's P&L that sits between the product and the building: the Edwards Strategic Partners, ESDs, dealers, distributors, consultants and national accounts who turn KGS hardware into installed, accepted and serviced systems, and the carve-out plumbing (entities, invoices, portals, TSAs) through which they now transact. The dossier's consensus is that the voice that matters is B2B and private (`[4-src]`), that "where is my order" is often a master-data or ATP symptom rather than a service problem (D.3, G `[single — preserve]`), and that a year-2 separation is precisely when a correlation once available through inherited tooling "may temporarily require five manual extracts" (E.2, `[4-src]`). The use cases below therefore favour **Bucket B joins** — interaction language time-aligned with order lines, promise dates, cutover calendars, partner master, LMS, install base, opportunities and ConnectedSafety+ usage — each carried through aggregation → baseline → detection → distillation → routing, each ending in a drafted artefact that a named KGS executive approves. Every figure in a card headline or worked example is `[illustrative]` (each headline is also tagged individually so it survives being lifted into a deck); every numeric threshold is an `[illustrative]` starting point to be tuned in Discovery; no use case implies a current KGS defect or asserts that KGS data is fragmented — each join is framed as a testable Discovery question (Brief principle 7). Product quality, firmware, RMA defects, nuisance alarms, safety/recall and cyber belong to the UC-Q miner and are referenced only where the commercial decision differs.

**Scale anchor for every P&L line:** Commercial Fire ≈ **$1bn+** (Kartik's figure, M0.3-11), not KGS's ~$2bn (B merge note). One day of Commercial Fire revenue ≈ **$2.7m** `[estimate — $1bn/365]`. Interaction volume ≈ **200k–900k/yr** (C.1, `[2-src estimate]`).

## Index

| ID | Name | Bucket | Tier | Demo |
|---|---|---|---|---|
| UC-C-1 | Strategic Partner drift radar (friction × share × certification) | B | T2 | **Y** |
| UC-C-2 | Competitor-switching and ownership-churn language watch | A | T2 | N |
| UC-C-3 | Carve-out separation friction radar (topic × cutover × distributor) | B | T2 | **Y** |
| UC-C-4 | TSA-exit readiness gate — business-outcome regression by cutover wave | B | T2 | N |
| UC-C-5 | Legacy-residue tracker and Carrier-era evidence preservation | B | T1 + T2 | N |
| UC-C-6 | Backorder consequence vs promise-date slippage | B | T2 | **Y** |
| UC-C-7 | Substitution-feasibility gap (backorder × compatibility × listing) | B | T3 → T2 | N |
| UC-C-8 | "Where is my order" as upstream EDI / acknowledgement / master-data defect detector | B | T2 | N |
| UC-C-9 | EST3→EST4 migration intent and at-risk installed base | B | T2 | **Y** |
| UC-C-10 | UL 268 7th-edition replacement demand and status-confusion watch | A | T2 | N |
| UC-C-11 | Deflectable how-to clusters → knowledge and tool fixes | A | T1 + T2 | N |
| UC-C-12 | Cost-to-serve ledger by partner, product and job stage | B | T1 + T2 | N (v2 CFO) |
| UC-C-13 | Training gap by partner → seat allocation and certification targeting | B | T2 | N |
| UC-C-14 | Spec and AHJ documentation friction as spec-win risk | B | T2 | N (v2) |
| UC-C-15 | Quote and pricing friction, margin leakage | B | T2 | N |
| UC-C-16 | National / strategic account multi-site health and service-contract renewal risk | B | T2 (T3 identity) | N |
| UC-C-17 | ConnectedSafety+ / KESMobile adoption and renewal friction | B | T2 | **Y** |
| UC-C-18 | Access-policy and licence-change lockout watch | A | T2 | N |
| UC-C-19 | China and MEA project-channel commercial signals (vertical, tender, approval, delivery) | B | T3 → T2 | N |
| UC-C-20 | India authorised-channel leakage, grey market and service-partner authorisation | B | T2 | N |
| UC-C-21 | Site service-provider handover and programme-file friction | A | T2 | N |

21 use cases: 5 in Bucket A, 16 in Bucket B.

**Common card grammar (applies to every use case):** severity class (S1 regulatory/incident · S2 revenue/cash · S3 operational/watch · S4 efficiency), type (cliff = step change on an event; slope = sustained drift), blast radius (revenue / backlog / ARR at risk, partners, sites, projects), incident flag (Y only when orders, commissioning or cash collection are actually blocked), confidence marker (High / Medium / Low) with **knowledge** (system-of-record facts) visibly separated from **inference** (LiSN's correlation or estimate), evidence drawer (source interactions), counter-evidence line, and a human gate. LiSN drafts; it never sends partner, customer or regulator communications.

---

## Use cases

### UC-C-1 — Strategic Partner drift radar (friction × share × certification)

- **Archetype:** Channel-health drift / partner churn early warning · **Bucket:** B · **Proposed tier:** T2 proactive anomaly card (T3 extension: share-of-wallet estimate from POS/sell-through) · **Demo candidate:** **Y** — this is Kartik's own key-account-recovery playbook (M0.1-11: regained ~$100m key accounts) from someone who visits dealers personally (M0.1-7); a dual-axis "friction vs orders" timeline is legible in five seconds.
- **Signal:** A named ESD/dealer's friction language (recontacts, escalations, frustration, competitor names) rises against its own seasonal baseline while its sell-in slips and its certified-technician count falls.
- **Cadence/trigger:** Daily scoring; weekly partner roll-up; event trigger when the composite crosses threshold or a cancellation follows switching language within 14 days.
- **Primary user → routed exec(s):** Regional GM / VP Sales & Channel → President Commercial Fire (top-decile partners by revenue), VP Service & Tech Support (friction owner), Learning Center/Academy (certification component).
- **Source trace:** MH-4 `[4-src]` (ranks C3/G2/P2/X2); E row "Which partners are drifting?" `[3-src C P X]`; C.4 #11 `[2-src C P]`; A.3 metro-level brand dominance `[single — preserve]` P; B KPI "channel share, active dealers" `[4-src]`; M0.1-11 `[fact — supplied]`; raw P partner-QBR join "qualitative warning ↔ order share ↔ support history ↔ inventory and forecast" `[single — preserve]` P; raw X "AHT/NPS averages hide a small strategic partner's repeat install failures" and "partner × order/RMA separates service-quality failure from stock/credit friction" `[single — preserve]` X; raw C Regional GM "partner risk surfaces at the lost bid" `[single]` C; A.3 Honeywell partner tiers tied to revenue, payment, inventory, POS `[proxy]` X.
- **1. Data aggregation** — *Interaction:* tech-support calls/cases (Salesforce Service Cloud if used), after-hours line, order-desk and order-change mailboxes, RSM/QBR notes, Learning Center enquiries, RMA narratives (as friction, not defect), Kidde FX ticket portal. *Operational:* ERP sell-in (SAP/Oracle/JDE) by sold-to × product family × week; Salesforce partner accounts and tier; open opportunities and backlog; LMS (learning.edwardsfire.com, Fire & Security Academy) technician certifications and expiry; territory map; credit-hold status from AR; distributor POS/inventory where reported.
- **2. Baseline creation** — Per partner × platform family (EST4, Edge, Evolve, Genesis) × territory: 13-week rolling plus same-quarter prior year to absorb quarter-end ordering and construction seasonality. "Normal" = the partner's own contacts per $ of sell-in, own recontact rate, own competitor-mention rate, own certified-headcount ratio. Small partners are shrunk towards their tier baseline (G's point that 1→5 at a small distributor can be more abnormal than 90→100 at a giant, F4).
- **3. Dynamic detection** — Composite drift fires when (a) friction z-score ≥ 2.5 sustained ≥ 4 weeks (slope) **and** (b) sell-in ≤ −15% vs own seasonal baseline **or** certified technicians fall below the partner's tier requirement, **and** (c) competitor-switching mentions ≥ 3× own baseline. Time-aligned join: LiSN searches a 4–10 week lead of friction over order decline per partner and reports the lag it found. Cliff variant: switching phrase plus a cancelled order line within 14 days.
- **4. Distillation** — Suppress partners whose order decline coincides with a KGS allocation or credit hold (route to UC-C-6 or AR, per X's supply/credit separation); suppress seasonal troughs; collapse "done with EST", "moving this job to Notifier", "why do we bother" into one switching signal; deduplicate the same issue across call + email + QBR note. Rank by trailing revenue × friction severity × source independence × partner tier.
- **5. Surfacing & routing** — *Headline:* "ESD-SE-07 drifting: friction 3.1× own baseline for 6 weeks; EST4 sell-in −22%; 2 of 5 certified technicians lapsed; Notifier named in 4 calls." `[illustrative]` *Severity:* S2 revenue · slope · blast radius $6.4m trailing sell-in, $0.9m backlog, $1.7m open retrofit bids · incident flag N. *Confidence:* High on orders and certifications (knowledge); Medium on "friction leads orders" (inference). *Recommended action:* executive partner intervention — GM visit, named L3 engineer, two priority class seats. *Draft artefact:* partner-recovery brief (timeline, five unresolved cases with verbatims, order trend, certification gaps, suggested offers). *Human gate:* Regional GM approves any outreach. *UI hero:* partner timeline — friction stream vs sell-in line, evidence pins on each spike.
- **Join tags:** channel partner, territory/region, brand, platform, channel, time · **P&L destination metric:** partner revenue retention / channel share (with backlog conversion as secondary).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Salesforce shows the order decline after quarter close; NPS is semi-annual and survey-biased (D.2); RSM warnings sit in inboxes; an LLM treats each case independently and has no per-partner baseline or lead-lag search.
- **Differentiation:** **requires the join — does not exist today** (to be tested in Discovery, not asserted).
- **Worked example `[illustrative]`:** ESD-SE-07, a Florida Edwards Strategic Partner with $6.4m trailing-12-month KGS sell-in (~0.6% of Commercial Fire). Weeks 1–6: 41 interactions vs own seasonal baseline of 13 (3.1×); recontact rate 38% vs 14%; four calls name Notifier on two retrofit bids; two of five EST4-certified technicians lapsed per LMS; EST4 sell-in −22% vs the same eight weeks last year while territory peers are +4%. Two backorder cases are excluded from the friction score and cross-linked to UC-C-6. Recovery brief lists two EST4 loop-mapping escalations (MD-1 pattern), one programme-upload failure and two backorders.
- **Regulatory/governance hook:** Competition-law caution — partner-level data stays internal; never disclose one partner's volumes, prices or terms to another; support and training offers must not be conditioned on exclusivity where unlawful. Call-recording consent in all-party-consent US states and UK/EU GDPR notices for partner staff. `[panel guidance — not researched in Stage 0; counsel to confirm, applies to both the competition-law and privacy points]`.
- **Feasibility (four-lens):** *Data:* 12–24 months of cases and sell-in by sold-to; LMS export with company IDs. *Hardest part:* partner identity resolution across Salesforce accounts, ERP sold-to/ship-to and LMS company names, especially where carve-out re-keying created duplicates (C.2 #5). *False-positive risk:* medium — project lumpiness mimics decline; mitigated by the lag test and backlog check. *Must be true in Discovery:* cases carry an account ID that maps to ERP sold-to; certification records carry an employer. *Panel disagreement:* PE partner would restrict to the top 50 partners by revenue; former service VP insists on including small Edge/Evolve dealers because mid-market partners churn silently; architect sides with the VP but wants shrinkage priors to control noise.
- **Residual risk LiSN does NOT address:** It cannot fix the cause (price, supply, product), cannot see competitor offers, and its share-of-wallet view is an estimate unless distributors report POS.

### UC-C-2 — Competitor-switching and ownership-churn language watch

- **Archetype:** Competitive displacement early warning · **Bucket:** A · **Proposed tier:** T2 · **Demo candidate:** N — valuable, but interaction-only and lower confidence; better as a tile inside UC-C-1.
- **Signal:** Switching-intent mentions of Notifier, Simplex, Siemens/Cerberus, Potter, Mircom, Fire-Lite, Silent Knight or Hochiki, and ownership-churn anxiety ("pawned off"), rise against a metro's own baseline.
- **Cadence/trigger:** Weekly per metro/territory; trigger on step change or a competitor's first appearance in a metro.
- **Primary user → routed exec(s):** VP Sales/Channel → Regional GM, Product Management (competitive-gap themes), President (monthly digest).
- **Source trace:** C.4 #11 `[2-src C P]`; MD-8 "EST just can't stay a part of one company…" `[single — preserve]` C; A.3 metro-level dominance `[single — preserve]` P; A.3 Edwards trains partners on VESDA (Honeywell) `[single — preserve]` C; MH-4 `[4-src]`; D.1 sufficiency conflict K-8.
- **1. Data aggregation** — *Interaction:* calls, emails, RSM/QBR notes, quote correspondence, public forums (r/firealarms, thefirepanel.com) with a controlled alias dictionary. *Operational (light):* territory map and partner master for tagging only.
- **2. Baseline creation** — Competitor mentions per 1,000 interactions per metro × competitor × stance (neutral comparison / specified alternative / switching intent). 26-week rolling with bid-season adjustment.
- **3. Dynamic detection** — Switching-intent rate ≥ 3× own 26-week baseline in a metro over ≥ 3 weeks; novelty when a competitor with near-zero baseline appears in ≥ 2 independent partners; ownership-churn anxiety ≥ 3× baseline in the four weeks after a KGS corporate event (a cutover, a divestiture such as Gloria — K-11 `[src-unresolved]`, verify).
- **4. Distillation** — Stance classifier separates "we quoted both" from "we're moving"; suppress VESDA mentions in legitimate aspiration context; cluster stated reasons (lead time, EST4 diagnostics vs EST3, price, programme lock-in). Rank by partners involved × metro revenue.
- **5. Surfacing & routing** — *Headline:* "Switching language towards Simplex 3.6× in Houston metro; top reason: Genesis lead time; 3 partners." `[illustrative]` *Severity:* S3 watch · slope · blast radius 3 partners, metro sell-in · incident N. *Confidence:* Low–Medium (interaction-only; inference). *Action:* competitive-response brief to Regional GM; reason themes to Product Management. *Draft artefact:* competitive-reason digest with verbatims and counter-evidence. *Human gate:* VP Sales. *UI hero:* metro heat-map of switching intent with reason chips.
- **Join tags:** metro/region, partner, competitor, brand, channel, time · **P&L destination metric:** retrofit/spec win rate (channel share).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** CRM win/loss is filled after the loss with a coarse code; keyword search counts neutral comparisons as threats; an LLM finds mentions but has no metro baseline or stance-weighted trend.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** Houston metro, six weeks: 11 switching-intent mentions of Simplex vs baseline 3; reasons — Genesis horn-strobe lead time (6), EST4 diagnostics vs EST3 (3, the MD-2 theme), price (2); 27 neutral comparisons suppressed. Cross-link: two of the three partners also appear in UC-C-6.
- **Regulatory/governance hook:** Competitor price intelligence mentioned by partners is logged as intelligence only and never relayed to other partners (avoid facilitating information exchange) `[panel guidance — not researched in Stage 0; counsel to confirm]`. Public-forum data: no unjustified identity matching (E, `[4-src]`).
- **Feasibility (four-lens):** *Data:* calls/email/RSM notes. *Hardest part:* stance detection in installer banter. *False-positive risk:* medium–high. *Must be true:* RSM/QBR notes are captured somewhere machine-readable. *Panel disagreement:* architect wants public forums from day one; former service VP says the public corpus is too thin and brand-ambiguous (K-8) and would suppress public-only signals until corroborated internally.
- **Residual risk LiSN does NOT address:** It cannot confirm a share loss, see competitor offers or change lead times.
- **See also:** UC-Q-19 (different decision: public installer posts as corroboration of an internal quality cluster, not competitive response).

### UC-C-3 — Carve-out separation friction radar (topic × cutover × distributor)

- **Archetype:** Separation friction · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y** — the dossier's Demo 3 (I.3); Kartik-owned and time-sensitive; the "cutover line on a timeline" is the clearest possible picture of why the join matters in a year-2 carve-out.
- **Signal:** After an entity, ERP, portal or EDI cutover, contacts about invoices/remit-to, entity/VAT numbers, part numbers, portal login, missing acknowledgements, wrong price or ship date and bounced legacy Carrier addresses rise for the distributors on that cutover — relative to regions not yet cut over.
- **Cadence/trigger:** Daily for 30 days either side of each cutover; weekly otherwise; triggered by the separation PMO calendar.
- **Primary user → routed exec(s):** CIO / separation lead → COO, CFO (DSO), Regional GM (distributor communications).
- **Source trace:** MH-5 `[4-src]` (C4/G2/P3/X para); C.2 #34 `[4-src]`; E row "Carve-out friction by region" `[2-src C G]`; E.2 `[4-src]`; M0.6 Hyderabad "independent digital organisation separate from the former owners" `[single — preserve]` G `[src-unresolved]`; 0.2 elc@carrier.com `[single — preserve]` C; D.2 carve-out anxiety `[3-src]`; I.3 Demo 3; raw G "ERP programme can be green while dealers experience missing acknowledgements, duplicate accounts, slow quotes, wrong entitlement" `[single — preserve]` G.
- **1. Data aggregation** — *Interaction:* order-change and AP/AR shared inboxes, order desk calls, partner-portal tickets, Kidde FX tickets, auto-reply/bounce logs from legacy domains. *Operational:* PMO cutover calendar (entity, system, process, country, date); ERP company codes (legacy vs KGS entity); AR ageing and dispute reason codes; EDI/CommerceHub error logs; portal identity logs; price-master change log.
- **2. Baseline creation** — Per distributor × topic × region: 8-week pre-cutover baseline plus a **control region** not yet cut over (difference-in-differences). Quarter-end billing spikes are baselined separately.
- **3. Dynamic detection** — Topic rate ≥ 2.5× pre-cutover **and** ≥ 2× the control region's change within 21 days of the cutover; time-aligned with AR disputes coded "wrong entity/remit-to" and DSO movement for the same distributors. Typically a cliff.
- **4. Distillation** — Collapse "can't log in", "password loop", "new portal doesn't show my orders" into one portal-entitlement signal; separate **expected, communicated** change answerable by FAQ (route to UC-C-11) from **defects** (wrong price, lost acknowledgement). Rank by AR $ affected × distributors × tier.
- **5. Surfacing & routing** — *Headline:* "UK-EU invoice/remit-to contacts 2.7× since entity cutover; 14 distributors; £1.1m invoices in dispute; DSO +6 days at top-10 accounts." `[illustrative]` *Severity:* S2 cash · cliff · blast radius 14 distributors, £1.1m disputed · incident flag Y if acknowledgements are failing (orders not landing). *Confidence:* High on timing (knowledge); Medium on cause (inference). *Action:* separation defect ticket; dunning pause on disputed invoices; distributor notice. *Draft artefacts:* separation defect ticket (ServiceNow) with sample invoices and verbatims; distributor notice with corrected remit-to. *Human gate:* CIO/PMO triage; CFO approves dunning pause; Regional GM approves notice. *UI hero:* cutover timeline — vertical cutover markers with friction bands per topic, affected region vs control.
- **Join tags:** legal entity, system, process, region/country, distributor, topic, time · **P&L destination metric:** DSO / cash conversion (secondary: cost-to-serve).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** There is no "carve-out" reason code (MH-5); the PMO reports technical cutover; ERP sees disputes but not the portal and email pattern; an LLM has no cutover calendar or control region.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** A KGS UK entity (Milton Keynes footprint, M0.3 `[single — preserve]` P) takes over invoicing from a Carrier-era entity on 1 September. By 21 September: remit-to/entity/VAT contacts 2.7× pre-cutover (APAC control 1.1×); portal-login contacts 3.4×; 212 invoices (£1.1m) in AR dispute; top-10 UK-EU distributors' DSO +6 days — about £1.0m of cash at £60m annual sell-in. Top verbatim cluster: "invoice entity doesn't match our PO entity" → candidate cause: PO-entity mapping in the EDI layer (engineering to confirm). Variant to hold until K-11 (`[src-unresolved]`) is verified: distributor confusion ordering Gloria after its divestiture.
- **Regulatory/governance hook:** Customer communications human-approved; AR holds under finance policy; UK/EU GDPR lawful basis and DPIA for processing partner-staff email `[panel guidance — not researched in Stage 0; counsel to confirm]`.
- **Feasibility (four-lens):** *Data:* cutover calendar (often a PMO spreadsheet); AR dispute codes. *Hardest part:* obtaining and maintaining the calendar and mapping distributors to entities. *False-positive risk:* medium — planned changes create expected spikes; the expected-vs-defect classifier is essential. *Must be true:* I.4 Q1 answered — which systems remain on Carrier TSAs, and when each cuts over. *Panel disagreement:* PE partner calls this the fastest-payback wedge (cash); former service VP says the friction fades within weeks so value is transient; architect argues the evidence graph it leaves behind is durable.
- **Residual risk LiSN does NOT address:** It does not fix master data or portals, and it cannot see distributors who silently move orders rather than complain.

### UC-C-4 — TSA-exit readiness gate: business-outcome regression by cutover wave

- **Archetype:** Separation programme assurance · **Bucket:** B · **Proposed tier:** T2 (programme-bound) · **Demo candidate:** N — a CIO/PMO and board instrument rather than a President hero; mention as a v2 line.
- **Signal:** After each wave, interaction-derived business outcomes (recontacts per order, transfer rate, "who handles this now?", RMA-status chasing) regress against the pre-wave baseline and fail to converge — including regional divergence hidden behind a green global status.
- **Cadence/trigger:** Scorecards at T+7, T+30, T+60 per wave; gate before the next wave and before each TSA service line terminates.
- **Primary user → routed exec(s):** Separation PMO lead / CIO → COO, CFO (TSA fees, stranded cost), Lone Star operating-partner reporting.
- **Source trace:** MH-16 `[single — preserve]` P; B KPI "TSA exit, app/data migration %, stranded costs" `[4-src]`; E.2 `[4-src]` incl. X proxies (APi–Chubb 17-country migration; HVAC carve-out >$750k/month stranded costs) `[proxy]`; raw P "detecting regional process divergence hidden by global project status" and "prioritising which integrations materially affect revenue, cash, safety or partner loyalty" `[single — preserve]` P; raw G ERP-green-while-dealers-suffer `[single — preserve]` G; raw C standalone ERP/CRM builds 18–36 months `[estimate]` C. *Decision differs from UC-C-3:* UC-C-3 files defects per distributor; UC-C-4 decides whether to exit a TSA line or start the next wave.
- **1. Data aggregation** — *Interaction:* all queues, with telephony transfer/hand-off metadata and email thread forwarding chains. *Operational:* wave plan; TSA service catalogue (service line, monthly fee, termination date); process-to-system mapping; order, RMA and case denominators.
- **2. Baseline creation** — Per region × process (order-to-cash, RMA, tech support, training): 8–12 weeks pre-wave, seasonally adjusted, with not-yet-migrated regions as controls; an expected hypercare decay curve.
- **3. Dynamic detection** — Any process metric ≥ 1.5× pre-wave at T+30 **and** decay slower than the hypercare curve; divergence where one country regresses while the wave average is flat.
- **4. Distillation** — Suppress regressions that converge inside the hypercare window; rank by revenue, AR or RMA credit flowing through the affected process × TSA fee at stake.
- **5. Surfacing & routing** — *Headline:* "Wave 3 APAC order-to-cash not converged at T+30: order-status contacts per 100 lines 1.9×; Australia 2.8× drives it; TSA line terminates in 26 days." `[illustrative]` *Severity:* S2 programme · slope · blast radius revenue through affected process · incident N. *Confidence:* Medium–High (knowledge: rates; inference: attribution to wave, shown against control). *Action:* extend hypercare or TSA line for one country; reprioritise integration backlog. *Draft artefact:* TSA-exit readiness memo with evidence and counterfactual. *Human gate:* separation steering committee. *UI hero:* wave scorecard — process × country heat-grid with convergence curves and TSA-termination countdown.
- **Join tags:** entity, system, process, region/country, wave, time · **P&L destination metric:** TSA fees and stranded cost (secondary: DSO, cost-to-serve).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** PMO dashboards measure interfaces and records migrated; they do not measure what partners experience. Building this bespoke per wave is exactly the "five manual extracts" problem (E.2).
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Wave 3 moves APAC order management from a Carrier-era instance to KGS ERP in four countries on 4 August. At T+30: order-status contacts per 100 order lines 1.9× (Australia 2.8×, others 1.2×); transfer rate 22% vs 9%; RMA-status chasing per open RMA 2.4×. PMO status: green (99.6% of orders migrated). The APAC order-management TSA line ($180k/month) terminates 30 September. Recommendation: extend Australia 30 days ($180k) against ~$1.2m backlog affected by acknowledgement failures; fix acknowledgements first.
- **Regulatory/governance hook:** Board and lender reporting; no customer-facing action.
- **Feasibility (four-lens):** *Data:* TSA schedule, telephony transfer metadata. *Hardest part:* attribution when several changes land together. *False-positive risk:* medium. *Must be true:* TSA catalogue and wave plan shareable with the pilot team. *Panel disagreement:* PE partner rates this board-level; architect warns attribution is weak without controls; former service VP says hypercare teams already know anecdotally and the value is only in the regional divergence view.
- **Residual risk LiSN does NOT address:** It does not negotiate TSAs or migrate systems; it sees only what customers and partners say.

### UC-C-5 — Legacy-residue tracker and Carrier-era evidence preservation

- **Archetype:** Separation hygiene / evidence continuity · **Bucket:** B · **Proposed tier:** T1 descriptive inventory + T2 residue alert · **Demo candidate:** N — low drama; mention as a governance proof point.
- **Signal:** (a) Interactions still arriving via legacy Carrier addresses, domains, phone trees or brand names, by partner and region; (b) active signals and open accounts whose evidence lives in repositories scheduled for retirement.
- **Cadence/trigger:** Weekly residue scan; event triggers at repository retirement date −90/−30 days and forwarding-rule expiry.
- **Primary user → routed exec(s):** CIO / separation lead → Legal/records (retention, legal hold), VP Service (continuity), Learning Center (legacy training address).
- **Source trace:** 0.2 elc@carrier.com `[single — preserve]` C; MH-16 "preserve Carrier-era interaction history before repositories retire" `[single — preserve]` P; raw C "Chubb Edwards" naming in an Ontario forum post `[single — preserve]` C (not carried into dossier); E.2 "five manual extracts" `[4-src]`; G section — CPSC chronology "beginning with the first information received" `[4-src]`.
- **1. Data aggregation** — *Interaction:* inbound metadata (to-address, domain, dialled number), text mentions of legacy entity or brand names. *Operational:* repository inventory with retirement dates; retention schedule and legal holds; mailbox forwarding configuration; LiSN evidence-graph references.
- **2. Baseline creation** — Residue share per channel × region × partner, with an expected decay curve after each change notice.
- **3. Dynamic detection** — Residue flat or rising 60 days after communication; partner cohorts still using legacy routes; evidence at risk where an active signal or open account has > 20% of its evidence in a repository retiring within 90 days.
- **4. Distillation** — Suppress residue auto-forwarded and answered first time; rank by partner revenue and by evidentiary value (safety- and regulatory-linked evidence first).
- **5. Surfacing & routing** — *Headlines:* "31% of Learning Center enquiries from Canadian partners still via legacy address; forwarding ends in 45 days." / "Repository retiring 31 Dec holds 1,840 interactions linked to 12 active signals." `[illustrative]` *Severity:* S3 operational; S1 if regulatory evidence is at risk · cliff (date-driven) · blast radius partners, interactions, signals · incident flag N (Y only if evidence tied to an open S1 watch is at risk). *Confidence:* High (metadata is knowledge). *Action:* partner re-communication; evidence snapshot into a KGS-owned store under legal-hold rules. *Draft artefacts:* partner address-change notice; evidence-preservation request to Legal. *Human gate:* CIO and Legal. *UI hero:* residue decay curve beside a retirement countdown.
- **Join tags:** channel/address, region, partner, repository, time · **P&L destination metric:** TSA exit / stranded cost (secondary: regulatory exposure avoided).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** IT sees mail flow, not which partners and intents still depend on legacy routes; nobody owns "which evidence behind today's signals is about to disappear".
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Nine months after the address change, 31% of Canadian partners' training enquiries still use the legacy address and three partners still write "Chubb Edwards"; the legacy case repository retiring 31 December holds 1,840 interactions linked to 12 active signals, two of them safety-watch items owned by the UC-Q miner's pipeline.
- **Regulatory/governance hook:** CPSC §15 chronology and EU CRA awareness timestamps depend on original records (G, `[4-src]`); rights to copy Carrier-era data are a TSA contractual question.
- **Feasibility (four-lens):** *Data:* mail-flow metadata and repository inventory. *Hardest part:* legal right to copy Carrier-era data. *False-positive risk:* low. *Must be true:* a repository inventory with retirement dates exists. *Panel disagreement:* compliance adviser ranks preservation very high; PE partner sees it as hygiene that would not be bought standalone — bundle it.
- **Residual risk LiSN does NOT address:** It cannot resolve data-ownership disputes with Carrier or restore evidence already deleted.
- **See also:** UC-Q-7 (different decision: safety awareness chronology and reportability evaluation by Quality/CLO; this UC only preserves the evidence it relies on).

### UC-C-6 — Backorder consequence vs promise-date slippage

- **Archetype:** Supply reaction / backlog-at-risk · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y** — PE partner's first pilot journey (H.4, P); "OTD looks fine against the revised date" is a sharp, Six-Sigma-flavoured insight Kartik will recognise.
- **Signal:** Consequence language ("cancel", "substitute", "project delay", "liquidated damages", "going with Simplex") on a SKU family rises ahead of OTIF movement, time-aligned with line-level promise-date push-outs.
- **Cadence/trigger:** Daily; triggered by promise-date change events and allocation decisions.
- **Primary user → routed exec(s):** COO / VP Supply Chain → VP Sales/Channel, Regional GM, CFO (backlog conversion).
- **Source trace:** MH-8 `[4-src]`; C.2 #7, #8 `[4-src]`/`[2-src]`; C.4 #6 `[2-src P G]`; E.1 #4 `[4-src]`; B KPI OTIF and lead-time promise accuracy `[4-src]`; D.3 operating need behind the order desk `[single — preserve]` G; raw G "KGS's own sale terms discuss product lead times and order handling" `[src-unresolved]`; raw C Carrier 2023 "supply chain constraints for certain components" `[proxy]`.
- **1. Data aggregation** — *Interaction:* order-desk calls and email, order-change mailbox, RSM notes, EDI/portal messages, tech-support mentions of waiting parts. *Operational:* ERP order lines (requested, first-promised, revised dates and change history), Kinaxis supply plan and allocation, backlog value, CommerceHub/EDI POs, Salesforce project/opportunity links (occupancy dates where recorded), partner master.
- **2. Baseline creation** — Per SKU family × region × partner: contacts per open late line and share of consequence language; quarter-end and construction-season adjustments.
- **3. Dynamic detection** — Consequence-language rate on a SKU family ≥ 2× own baseline **and** ≥ N lines pushed out ≥ 2 weeks; lead-lag test for contacts preceding cancellations by 3–6 weeks; **masking check** — OTD measured against revised promise ≥ target while OTD against first promise or request date has fallen.
- **4. Distillation** — Suppress status chasing on on-time lines (route to UC-C-8); cluster by upstream root (shared component); rank by backlog $ × consequence severity × partner tier × project criticality (inspection or occupancy within 30 days).
- **5. Surfacing & routing** — *Headline:* "Genesis horn-strobe push-outs: cancel/substitute language 3.2× baseline across 11 NA partners; $2.3m backlog; OTD shows 94% vs revised date, 71% vs original." `[illustrative]` *Severity:* S2 revenue · slope · blast radius $2.3m backlog, 11 partners, 4 occupancy-critical projects · incident N. *Confidence:* High on dates (knowledge); Medium on cancellation risk (inference). *Action:* allocation review with occupancy-critical projects first; approved substitutes offered; proactive revised-date communication. *Draft artefacts:* allocation priority list; partner-specific revised-date and substitute drafts. *Human gate:* Supply Chain and VP Sales approve allocation and every message. *UI hero:* backlog-at-risk waterfall by SKU with a consequence-language overlay and the "revised vs original promise" toggle.
- **Join tags:** SKU/platform, region, partner, order line, project, time · **P&L destination metric:** backlog conversion / OTIF (secondary: premium freight, revenue at risk).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** ERP knows dates and quantities, not consequence (MH-8); OTD re-baselined to revised dates hides pain; an LLM cannot link an email to order lines.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Genesis LED horn-strobe family: 312 lines pushed out ≥ 3 weeks across 11 NA partners in five weeks; consequence language 3.2× seasonal baseline; $2.3m backlog; four projects face inspections within 30 days; three partners name Simplex (cross-link UC-C-2). OTD vs revised promise 94%, vs original 71%.
- **Regulatory/governance hook:** Document allocation criteria to show fair, objective treatment; allocation messages must not reveal other partners' positions (competition-law caution `[panel guidance — not researched in Stage 0; counsel to confirm]`); check contractual lead-time terms (G `[src-unresolved]`).
- **Feasibility (four-lens):** *Data:* line-level promise-date change history (often overwritten — confirm retention). *Hardest part:* linking free-text emails to order lines (PO numbers, entity resolution). *False-positive risk:* medium (habitual chasers — per-partner baseline mitigates). *Must be true:* ERP keeps first-promise and revised-promise dates. *Panel disagreement:* PE partner: pilot journey #1; former service VP: the order desk already knows individual cases — value is only the cross-partner aggregation and consequence ranking.
- **Residual risk LiSN does NOT address:** LiSN cannot create supply or fix shortages; it prioritises who hears first and what they are offered.

### UC-C-7 — Substitution-feasibility gap (backorder × compatibility × listing)

- **Archetype:** Supply-meets-compatibility blocker · **Bucket:** B · **Proposed tier:** T3 (parked) → T2 once the compatibility matrix is ingested · **Demo candidate:** N — too intricate for one screen; strong for a Product Management follow-up. `[long-tail — preserve]`
- **Signal:** On the same order or site, backorder language co-occurs with "compatible with", "approved substitute", "listed combination", "firmware" questions — partners cannot accept offered substitutes because of compatibility, listing or AHJ constraints.
- **Cadence/trigger:** Weekly; trigger when a substitute is offered for a backordered SKU.
- **Primary user → routed exec(s):** Product Management (VP PM Edwards) + Supply Chain → Application engineering, Regional GM.
- **Source trace:** raw X white-space #3 "promise-to-delivery/legacy migration risk: co-occurrence of ETA, substitute, EOL, compatibility and cancelled-quote language; ERP sees shipment, not the technical reason a customer cannot substitute" `[single — preserve]` X (split across MH-7/MH-8 in the dossier); C.2 #4, #8, #15; MD-5 Kidde↔Edwards compatibility `[single — preserve]` P; G table UL 864 "firmware changes to listed configurations are not ordinary SaaS releases" `[single]` G; C.4 #8 `[2-src P X]`.
- **1. Data aggregation** — *Interaction:* order desk, tech support, application support (Edwards Signaling option 2 pattern). *Operational:* approved-substitute table; compatibility matrix (panel × device × firmware × listing); backlog lines; EOL list; listing documents.
- **2. Baseline creation** — Substitute-acceptance rate per SKU family × region; compatibility-question rate per backordered SKU.
- **3. Dynamic detection** — Acceptance of substitute S′ < 50% of the substitution baseline **and** compatibility/listing questions about S′ ≥ 3× baseline; demand signal where partners ask for alternatives absent from the approved table.
- **4. Distillation** — Group by (backordered SKU, substitute, panel family, jurisdiction); route price-only rejections to UC-C-15.
- **5. Surfacing & routing** — *Headline:* "Offered substitute for backordered Signature module rejected on 64% of lines; 'not on our panel's listed combinations' in 23 interactions; $780k backlog blocked." `[illustrative]` *Severity:* S2 revenue · slope · blast radius $780k, 9 partners · incident N. *Confidence:* Medium. *Action:* compatibility clarification or listing evaluation; temporary allocation priority for the original SKU. *Draft artefact:* compatibility clarification bulletin draft built only from controlled documentation. *Human gate:* Product Management plus compliance sign-off. *UI hero:* substitute matrix — backordered SKU → offered substitutes, acceptance bars and blocking reasons.
- **Join tags:** SKU, substitute, panel/firmware, listing, jurisdiction, partner, time · **P&L destination metric:** backlog conversion (secondary: stranded substitute inventory).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** ERP records the substitute offer and the non-conversion, never the technical reason; an LLM answering compatibility questions would be the "incorrect confident answer" the compliance adviser forbids (D.3).
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** 36% substitute acceptance vs 80% baseline; 23 interactions cite panel-listing concerns on EST3 sites; $780k blocked across nine partners; four ask for an alternative not in the approved table.
- **Regulatory/governance hook:** UL 864 listed configurations (edition conflict K-7 — verify); AHJ acceptance; LiSN never advises compatibility.
- **Feasibility (four-lens):** *Data:* machine-readable compatibility matrix. *Hardest part:* substitute offers are often verbal. *False-positive risk:* high at first. *Must be true:* approved-substitute table exists per region. *Panel disagreement:* compliance adviser insists every compatibility statement be human-authored; architect wants LiSN to draft from controlled sources — consensus: draft-only with provenance.
- **Residual risk LiSN does NOT address:** It cannot create listings or rule on compatibility.
- **See also:** UC-Q-11 (different decision: product-risk review of installed off-list combinations, owned by Product Management and Regulatory).

### UC-C-8 — "Where is my order" as upstream EDI / acknowledgement / master-data defect detector

- **Archetype:** Contact elimination via upstream process defect · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N — strong CFO story, weaker visual.
- **Signal:** Order-status contacts on lines ERP shows as on time — pointing to missing acknowledgements (EDI 855), advance ship notices (856), ship-to or unit-of-measure mismatches, post-carve-out part-number mapping or ATP errors.
- **Cadence/trigger:** Daily; trigger on integration changes.
- **Primary user → routed exec(s):** Head of order management / customer service → COO, CIO (integration), CFO.
- **Source trace:** D.3 operating need behind the order desk `[single — preserve]` G; MH-6 upstream process defects `[4-src]`; E row order status `[4-src]`; 0.6 CommerceHub/EDI `[single]` G `[src-unresolved]`; raw G "missing order acknowledgement" `[single — preserve]` G.
- **1. Data aggregation** — *Interaction:* order desk, order-change mailbox, portal messages. *Operational:* EDI transaction logs (850/855/856/810), CommerceHub, ERP line status, ATP snapshots, ship-to master, carrier tracking.
- **2. Baseline creation** — Status contacts per 100 order lines per partner × order channel (EDI, emailed PO, portal); weekday and quarter-end profiles.
- **3. Dynamic detection** — Status contacts on "green" lines ≥ 2× baseline for a partner or integration **and** co-signal: ≥ 30% of that partner's POs without an acknowledgement inside 24 hours, or mismatch classes rising.
- **4. Distillation** — Cluster by defect class; route genuinely late lines to UC-C-6; rank by contacts × cost per contact plus disputed-invoice effect.
- **5. Surfacing & routing** — *Headline:* "Status chasing from 6 EDI distributors 2.8× baseline; 71% of their POs lack acknowledgement since the mapping change; ERP shows 93% on time." `[illustrative]` *Severity:* S3 efficiency; S2 with incident flag Y if POs are not landing · cliff · blast radius 6 distributors. *Confidence:* High (logs are knowledge). *Action:* integration fix; proactive status feed. *Draft artefacts:* defect ticket with sample POs and verbatims; KB/status-feed recommendation. *Human gate:* order-management lead. *UI hero:* "green in ERP, red in the inbox" split bar per partner.
- **Join tags:** partner, integration channel, order line, SKU, time · **P&L destination metric:** cost-to-serve (secondary: DSO, order-exception rate).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** CRM counts "order status" cases; ERP says on time; only the join says the partner cannot see that it is on time.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Six EDI distributors moved to a new mapping on 12 August; status contacts 2.8×; 71% of POs unacknowledged within 24 hours; ~390 avoidable contacts a month × $25–60 (C.1 panel range) ≈ $10k–23k a month (reviewer: reduced from ~1,150, which implied ~300 status contacts a month per distributor and 1.5–7% of all Commercial Fire volume from six accounts); three distributors re-ordered, creating duplicate-order and inventory risk.
- **Regulatory/governance hook:** None specific.
- **Feasibility (four-lens):** *Data:* EDI logs. *Hardest part:* matching emails to POs. *False-positive risk:* low–medium. *Must be true:* EDI/CommerceHub logs accessible read-only. *Panel disagreement:* PE partner says contact cost is small next to working capital; former service VP says it is a top partner irritant.
- **Residual risk LiSN does NOT address:** Integration fixes are IT's; LiSN does not process orders.

### UC-C-9 — EST3→EST4 migration intent and at-risk installed base

- **Archetype:** Lifecycle opportunity and retention risk · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y** — the dossier's Demo 2 (I.3) and the "grow core / lifecycle services" pillar in Kartik's own words (M0.1-11); a map of EST3 sites coloured opportunity vs at-risk is instantly understood.
- **Signal:** EST3/EST2 spares availability, "replacement for…", programme-file access, migration cost, AHJ concern and competitor-migration language per site, joined to install base, legacy part orders and the serving partner's EST4 certification.
- **Cadence/trigger:** Weekly site scoring; monthly regional roll-up; trigger when a site crosses the intent threshold with no open opportunity.
- **Primary user → routed exec(s):** VP Sales / Strategic Accounts → Product Management (migration kits), Regional GM, President (quarterly), Learning Center (migration-course seats).
- **Source trace:** MH-7 `[4-src]`; A.2 installed-base migration `[3-src C G P]`; 0.4 EST3 new orders halted 31 Dec 2023 `[single — preserve]` C; MD-2, MD-3, MD-4, MD-7; 0.5 EST3→EST4 migration course Aug 2026 `[single]` C; B aftermarket KPI `[4-src]`; I.3 Demo 2; raw C "wiring and most rail modules are backward compatible, so migration is serviceable aftermarket" `[single — preserve]` C (not carried into the dossier).
- **1. Data aggregation** — *Interaction:* tech support, order desk (EST3 spares), application support, RSM notes, ITM partner contacts, forums (corroboration only). *Operational:* install base (ship-to/site from order history; ConnectedSafety+ where connected); legacy part orders; Salesforce migration opportunities; EST4 certification by partner (LMS); EOL/last-buy dates; migration-kit pricing.
- **2. Baseline creation** — Per region × partner × site class: EST3 spares enquiries per installed EST3 panel; owners' capital-budget seasonality.
- **3. Dynamic detection** — Site intent score crosses threshold (≥ 2 intent signals within 90 days) with no open opportunity; risk overlay where the serving partner shows competitor mentions (UC-C-2) or lacks EST4 certification; regional anomaly when intent volume ≥ 2× baseline.
- **4. Distillation** — Deduplicate per site; suppress sites with active opportunities; separate maintenance spares from migration intent; rank by estimated migration value × risk × partner capability.
- **5. Surfacing & routing** — *Headline:* "412 EST3 sites show migration intent in Q2; 38% served by partners with rising competitor mentions; 151 have no opportunity in Salesforce." `[illustrative]` *Severity:* S2 growth/retention · slope · blast radius sites and pipeline $ · incident N. *Confidence:* Medium (site resolution is inference where serials are missing). *Action:* create opportunities through the serving partner; reserve migration-course seats. *Draft artefact:* migration opportunity brief per partner (site list, evidence, backward-compatibility talking points, offer). *Human gate:* Strategic Accounts/Regional GM create opportunities; no direct owner contact that bypasses the partner. *UI hero:* installed-base map — EST3 sites coloured opportunity vs at-risk, partner overlay.
- **Join tags:** platform (EST3/EST4), site, partner, region, certification, time · **P&L destination metric:** aftermarket/modernisation revenue; installed-base migration win rate.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Orders show purchases, not intent; the CRM opportunity appears only after sales notices (MH-7).
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** 412 EST3 sites with intent in Q2 (dossier Demo 2 figure, illustrative); at an average migration value of $38k, $15.7m potential, of which 151 sites ($5.7m) have no opportunity; 156 sites served by partners with rising competitor mentions; 23 sites mention programme-file access (cross-link UC-C-21).
- **Regulatory/governance hook:** Channel-conflict and competition-law caution on territories `[panel guidance — not researched in Stage 0; counsel to confirm]`; owner programme-file ownership (MD-4).
- **Feasibility (four-lens):** *Data:* site-level install base. *Hardest part:* resolving ship-to to site. *False-positive risk:* medium (maintenance spares). *Must be true:* ship-to or ConnectedSafety+ records resolve to sites. *Panel disagreement:* former service VP: migration is a partner-led sale and KGS must not be seen to go around partners; PE partner: KGS should own the list because it is the aftermarket engine.
- **Residual risk LiSN does NOT address:** It cannot reduce migration cost (MD-7) or close the EST4 diagnostics gap Edwards described in June 2022 (MD-2; current status unverified), which is engineering's.
- **See also:** UC-Q-16 (different decision: product-roadmap input on migration diagnostics) and UC-Q-9 (different decision: advisory/remedy reach, whose "past supported life" gaps hand off here).

### UC-C-10 — UL 268 7th-edition replacement demand and status-confusion watch

- **Archetype:** Standards-transition demand sensing · **Bucket:** A · **Proposed tier:** T2 · **Demo candidate:** N.
- **Signal:** Questions such as "is this 7th edition?", 6th-edition replacement requests and AHJ-requested listing evidence rise in a jurisdiction's partner base. *Scope note:* commercial replacement demand only; nuisance performance by detector model is the UC-Q miner's.
- **Cadence/trigger:** Weekly by state/country.
- **Primary user → routed exec(s):** Product Management (detection) → Application engineering (KB), VP Sales (replacement campaign), Regional GM.
- **Source trace:** A.2 UL 268 7th / UL 217 8th `[3-src C P X]`; G table UL 268 `[3-src]`; C.2 #19 incl. "UL 268 7th status" `[4-src]`; NFPA 72 adoption depends on AHJ `[4-src]`; raw C "replacements must comply (ORR)" `[single]` C.
- **1. Data aggregation** — *Interaction:* tech and application support, spec emails, distributor queries. *Operational (light):* jurisdiction tag, catalogue edition flags.
- **2. Baseline creation** — Per jurisdiction × detector family, 26-week rolling.
- **3. Dynamic detection** — Status questions ≥ 3× own baseline for ≥ 4 weeks; rejection markers route to UC-C-14. LiSN reports the rise; any link to a local code adoption is presented as a candidate cause, not an external-signal claim (Brief principle 5).
- **4. Distillation** — Separate informational from rejection; collapse phrasings; rank by regional installed detectors and revenue.
- **5. Surfacing & routing** — *Headline:* "7th-edition status questions 3.4× in one Southwest state; 40% cite an AHJ request; two datasheet revisions word the edition differently." `[illustrative]` *Severity:* S3 · slope · blast radius partners, region · incident flag N. *Confidence:* Medium. *Action:* KB article, datasheet clarification, partner replacement campaign. *Draft artefact:* KB article draft from controlled sources. *Human gate:* Product Management + compliance review. *UI hero:* jurisdiction map with a confusion index.
- **Join tags:** detector family, UL edition, jurisdiction, partner, time · **P&L destination metric:** aftermarket replacement revenue (secondary: cost-to-serve).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** No CRM code for "edition status"; download counts show activity, not confusion; an LLM might answer listing questions wrongly.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** 58 status questions in six weeks vs a baseline of 17; 23 cite an AHJ request; two datasheet revisions conflict.
- **Regulatory/governance hook:** UL 268 7th effective 30 Jun 2024 `[3-src]`; all answers compliance-reviewed.
- **Feasibility (four-lens):** *Data:* interaction text with jurisdiction. *Hardest part:* reliable jurisdiction tagging. *False-positive risk:* medium. *Must be true:* cases carry site location. *Panel disagreement:* compliance adviser owns the answer; VP Sales owns the campaign — the card routes to both, with compliance first.
- **Residual risk LiSN does NOT address:** It cannot change AHJ adoption or certify products.
- **See also:** UC-Q-6 (different decision: detector nuisance performance and bypass risk, owned by Product/Quality).

### UC-C-11 — Deflectable how-to clusters → knowledge and tool fixes

- **Archetype:** Cost-to-serve / contact elimination · **Bucket:** A · **Proposed tier:** T1 benchmark + T2 new-cluster alert · **Demo candidate:** N — best as the "tech-support buyer" slide.
- **Signal:** Repeat programming and commissioning questions (EST4 4-CU rules, audio/NCA, cause-and-effect, Edge/Evolve set-up, HDT mapping) answered from existing documentation, per platform and release.
- **Cadence/trigger:** Monthly benchmark; alert when a new cluster emerges after a launch or release.
- **Primary user → routed exec(s):** VP Service & Tech Support → Learning Center, Product Management (tool UX), CFO.
- **Source trace:** MH-6 `[4-src]`; C.2 #1, #3; B estimate $1.5–6m/yr `[estimate]` C; MD-9 skills gap; D.2 "conflicting repositories" `[single — preserve]` G; raw G white space "technical-support emerging issue → engineering loop; KB may normalise a new failure into an old category" `[single — preserve]` G (not in MH list); raw C Edwards webinars on rule-syntax errors `[single]` C.
- **1. Data aggregation** — *Interaction:* tech-support calls, cases, emails, after-hours line, webinar Q&A, portal search logs. *Operational (light):* KB/document repository with revision history; release calendar; cost per contact tier.
- **2. Baseline creation** — Per platform × topic cluster: contacts per 100 active installs per month, with an expected post-launch decay curve.
- **3. Dynamic detection** — Clusters where ≥ 60% of resolutions reference existing steps, volume ≥ N/month and not decaying as expected; new clusters within 60 days of a release; conflicting-repository flag where answers cite different document revisions.
- **4. Distillation** — **Guard:** exclude clusters where the "answer" was a workaround to abnormal behaviour — those route to the UC-Q miner's quality pipeline (G's normalisation warning). Rank by volume × cost per contact × repeat rate.
- **5. Surfacing & routing** — *Headline:* "EST4 audio/NCA configuration: 640 contacts/quarter, 78% answered from existing steps; 3 conflicting document revisions cited." `[illustrative]` *Severity:* S4 efficiency · slope · blast radius contacts/quarter and partners in cluster · incident flag N. *Confidence:* High on counts; Medium on deflectability. *Action:* KB article, configuration-tool wizard fix, targeted webinar. *Draft artefact:* KB article draft with source excerpts and revision conflicts flagged. *Human gate:* KB owner + Product Management. *UI hero:* deflection Pareto with $ and document-conflict flags.
- **Join tags:** platform, release/firmware, topic, partner, channel, time · **P&L destination metric:** cost-to-serve per contact.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Dashboards count agent-chosen categories; they don't cluster meaning or spot conflicting documents.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** 640 contacts a quarter; ~500 deflectable × $25–60 ≈ $12.5k–30k a quarter for this one cluster; the Edge first-year cluster adds a similar amount.
- **Regulatory/governance hook:** Controlled retrieval and human approval for any KB content touching configuration of listed systems.
- **Feasibility (four-lens):** *Data:* resolution notes. *Hardest part:* telling how-to from latent defect. *False-positive risk:* the dangerous kind (a defect labelled how-to) — the guard is mandatory. *Must be true:* cases record resolution text. *Panel disagreement:* PE partner: $ small unless freed capacity is redeployed; former service VP: biggest partner irritant; architect: guard rail first.
- **Residual risk LiSN does NOT address:** It does not write or publish documentation; deflection depends on partners using the KB.
- **See also:** UC-Q-14 and UC-Q-15 (different decision: engineering escalation of new failure phrasing and unsafe workarounds; this UC's guard routes those clusters there).

### UC-C-12 — Cost-to-serve ledger by partner, product and job stage

- **Archetype:** Unpriced technical complexity · **Bucket:** B · **Proposed tier:** T1 quarterly + T2 outliers · **Demo candidate:** N (v2 for CFO/PE lens).
- **Signal:** Interaction effort (contacts, L2/L3 minutes, escalations, after-hours share, RMA follow-ups, truck-roll mentions) per $ of partner revenue and margin, with outliers by partner × product family × job stage.
- **Cadence/trigger:** Quarterly ledger; alert on two consecutive outlier quarters.
- **Primary user → routed exec(s):** CFO / Global CFO Commercial Fire → VP Service, VP Sales/Channel (partner programme tiers), Pricing.
- **Source trace:** B KPI cost-to-serve `[4-src]`; E.1 #7 financial outcome `[2-src P C]`; MH-6 `[4-src]`; C.1 cost per contact conflict K-9; B value sensitivity `[estimate]` G; raw X "repeat contacts/escalation age/after-hours calls by partner, product/version and job stage" `[single — preserve]` X.
- **1. Data aggregation** — *Interaction:* all channels with handle time, tier and after-hours flag. *Operational:* ERP revenue and gross margin by partner × product; cost rates by tier; partner tier; job stage (commissioning vs service) from case type or order link.
- **2. Baseline creation** — Expected effort per $ by product family × partner tier × job stage; peer-group medians.
- **3. Dynamic detection** — Partner effort per $ ≥ 2× peer-tier median for two quarters; product-family effort per $ rising after launch; after-hours share outliers.
- **4. Distillation** — Attribute excess to product (→ Product Management), partner capability (→ UC-C-13) or process (→ UC-C-8); rank by excess cost $.
- **5. Surfacing & routing** — *Headline:* "Mid-market Evolve dealer cohort: L3 minutes per $1k revenue 2.6× the ESD tier; excess ≈ $410k/yr." `[illustrative]` *Severity:* S3 · slope · blast radius excess cost $ and partners in cohort · incident flag N. *Confidence:* Medium (cost-allocation assumptions shown). *Action:* enablement first, then support-entitlement tiering or pricing review. *Draft artefact:* cost-to-serve brief. *Human gate:* CFO and VP Sales. *UI hero:* revenue vs effort scatter per partner with outliers labelled.
- **Join tags:** partner, product family, job stage, region, time · **P&L destination metric:** cost-to-serve; contribution margin.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Contact counts without revenue denominators and job-stage context mislead; an LLM has neither.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** 42 Evolve dealers: after-hours share 31% vs 12%; excess ≈ 5,400 L3 hours/yr × $76 ≈ $410k.
- **Regulatory/governance hook:** Differentiated support tiers must be objective and non-discriminatory (competition-law caution `[panel guidance — not researched in Stage 0; counsel to confirm]`).
- **Feasibility (four-lens):** *Data:* handle time and tier. *Hardest part:* cost allocation. *False-positive risk:* new partners are legitimately expensive. *Must be true:* case data carries handling tier. *Panel disagreement:* former service VP warns that penalising high-effort partners pushes them to competitors — enable before re-tiering; PE partner wants tiering sooner.
- **Residual risk LiSN does NOT address:** It does not set prices or support policy.
- **See also:** UC-Q-3 (different decision: engineering/test-coverage response to NFF and repeat-replacement loops, whose credits and freight also land in this ledger).

### UC-C-13 — Training gap by partner → seat allocation and certification targeting

- **Archetype:** Enablement gap · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N (tile inside UC-C-1).
- **Signal:** Repeat commissioning errors and how-to contacts by partner after a launch, joined to LMS certification status, expiries and class capacity — showing where a seat removes the most support load.
- **Cadence/trigger:** Monthly, and 45 days before each class.
- **Primary user → routed exec(s):** Learning Center / Academy → VP Service, Regional GM/Channel.
- **Source trace:** MH-11 `[3-src C P X]`; MD-11 June 2026 EST4 classes full `[single]` C; E training gaps `[4-src]`; B KPI training throughput `[3-src]`; M0.1-6 Kartik on learning from experienced installers `[single — preserve]` C; raw C "EST4 certification gates webinar materials and ITM courses (NFPA 72-2022 §10.5.3)" and EDGE-ML/Evolve-ML certifications `[single — preserve]` C; raw P "training availability aligned to launches, territory demand and observed support gaps" `[single — preserve]` P; raw G uncertified partner "unable to bid" `[src-unresolved]`.
- **1. Data aggregation** — *Interaction:* tech support, Learning Center enquiries, certification queries. *Operational:* LMS completions, expiries, waitlists; technician roster by partner; launch calendar; class schedule and capacity; panels shipped per partner (commissioning-job denominator).
- **2. Baseline creation** — Contacts per commissioning job per partner × platform vs certified peers.
- **3. Dynamic detection** — Partners with uncertified or lapsed technicians and contacts per job ≥ 2× certified-peer median; high-load partners on waitlists; expiries within 60 days among technicians who drive high volume (and who will lose gated material access).
- **4. Distillation** — Rank by expected contact reduction per seat × partner revenue; suppress product-defect-driven load.
- **5. Surfacing & routing** — *Headline:* "October EST4 class: assigning 18 seats to 7 high-load partners would cut ~210 contacts/quarter." `[illustrative]` *Severity:* S3 · slope · blast radius partners and technicians affected, contacts/quarter · incident flag N. *Confidence:* Medium (uplift is inference from certified-peer gap). *Action:* seat priority; targeted webinars. *Draft artefacts:* seat-allocation recommendation; partner invitation drafts. *Human gate:* Learning Center manager. *UI hero:* partner × certification matrix with support-load bubbles and waitlist.
- **Join tags:** partner, technician certification, platform, region, time · **P&L destination metric:** cost-to-serve; installable channel capacity.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** The LMS reports completions, not whether training reduced faults (MH-11).
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Seven partners at 2.1× contacts per commissioning job; four technicians' certifications expire before the class, which would also lock them out of gated webinar material.
- **Regulatory/governance hook:** NFPA 72 qualified-personnel requirements; technician-level data is personal data (UK/EU GDPR, India DPDP Act 2023) and may need works-council consultation in parts of the EU — aggregate to partner level for commercial use `[panel guidance — not researched in Stage 0 (DPDP and works-council points are not in the dossier); counsel to confirm]`.
- **Feasibility (four-lens):** *Data:* LMS export with employer IDs. *Hardest part:* linking a caller to an LMS user. *False-positive risk:* complex jobs inflate load. *Must be true:* LMS and CRM share a partner key. *Panel disagreement:* architect wants technician granularity; compliance adviser and former service VP prefer partner level.
- **Residual risk LiSN does NOT address:** It cannot add training capacity.
- **See also:** UC-Q-10 (different decision: product-vs-practice attribution for containment; practice-leaning clusters hand off here).

### UC-C-14 — Spec and AHJ documentation friction as spec-win risk

- **Archetype:** Spec-win risk · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N (v2 — spec wins lead revenue by 12–36 months, too slow for a first screen).
- **Signal:** Repeated certificate, listing, DoP/CE, submittal and battery-calculation requests and rejected-submittal language, clustered by consultant, jurisdiction and document revision, joined to Salesforce opportunities at specification or tender stage.
- **Cadence/trigger:** Weekly; trigger on rejection language against an open opportunity or after a document revision.
- **Primary user → routed exec(s):** Regional spec / sales-engineering lead → Regional GM, Product Management/Regulatory (document owner), President (spec-win rate, quarterly).
- **Source trace:** MH-9 `[4-src]`; C.2 #19, #20, #32; C.4 #9 `[2-src P X]`; E listing/AHJ `[4-src]`; D.3 "incorrect confident answer worse than none" `[single — preserve]` G; G table CPR 2024/3110 `[3-src]`, UK BSA golden thread `[4-src]`, India NBC `[4-src, verification gap]`; raw G "maintain India standards metadata at state/AHJ/project level" `[single — preserve]` G; raw P MEA "mega-project specification, consultant approval, distributor capability and delivery performance" `[single — preserve]` P; raw P NFPA 72-2025 expands network-connected-system documentation `[single]` P.
- **1. Data aggregation** — *Interaction:* application support, sales-engineer email, distributor forwards, web contact forms. *Operational:* Salesforce opportunities (stage, consultant, project, value, jurisdiction, win/loss); document control (revision history, certificates, DoP); web downloads.
- **2. Baseline creation** — Per consultant/jurisdiction × document type; tender seasonality (MEA project cycles, India financial-year end, China year-end).
- **3. Dynamic detection** — Rejection language or ≥ 3 repeat requests for the same document on an opportunity at spec stage; cohort anomaly where requests with rejection language ≥ 3× baseline after a revision; learned join — opportunities with documentation friction lose at a measured multiple of others.
- **4. Distillation** — Deduplicate per project; rank by opportunity value × stage × rejection severity. The AHJ is tagged as a gatekeeper, never scored as a customer (A.4, G).
- **5. Surfacing & routing** — *Headline:* "Dubai consultant cohort: 9 rejected-submittal mentions citing one EN 54 certificate/DoP revision across 4 tenders; $6.2m pipeline." `[illustrative]` *Severity:* S2 spec-risk · slope · blast radius $ pipeline, tenders · incident N. *Confidence:* Medium. *Action:* corrected documentation, consultant CPD session, sales-engineer visit. *Draft artefacts:* documentation-correction request; consultant response pack from controlled sources. *Human gate:* documentation owner + sales engineer. *UI hero:* opportunity pipeline with documentation-friction flags and $.
- **Join tags:** consultant, jurisdiction/AHJ, document revision, product, opportunity, region, time · **P&L destination metric:** spec win rate / quote-to-order conversion.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Downloads show activity, not why approvals fail (MH-9); opportunities record losses, not the document behind them.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** Five weeks, nine rejection mentions vs a baseline of 1–2 a quarter; four tenders worth $6.2m; the referenced revision lacks the configuration the consultant's specification names. India variant: acceptance questions tagged by state and AHJ, not a single national field.
- **Regulatory/governance hook:** EU CPR, UK golden thread, NFPA 72, India NBC; LiSN never answers compliance questions autonomously.
- **Feasibility (four-lens):** *Data:* opportunity links on emails. *Hardest part:* attaching unstructured emails to opportunities. *False-positive risk:* medium. *Must be true:* Salesforce opportunities carry consultant and jurisdiction. *Panel disagreement:* PE partner says spec wins are slow to show in revenue; compliance adviser says documentation errors are an acceptance risk regardless of value.
- **Residual risk LiSN does NOT address:** It cannot influence the AHJ; documentation is Regulatory's to correct.
- **See also:** UC-Q-11 (different decision: whether installed combinations are a listing/product risk, not spec-win risk).

### UC-C-15 — Quote and pricing friction, margin leakage

- **Archetype:** Pricing friction · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N.
- **Signal:** Quote chasing, expired prices, inconsistent prices across channels, "competitor quoted…" and discount escalations — and pushback aligned to price-list changes — joined to CPQ cycle time, discount depth, win/loss and realised margin.
- **Cadence/trigger:** Weekly; trigger on price-list or approval-rule change.
- **Primary user → routed exec(s):** Pricing / commercial excellence → VP Sales, Regional GM, CFO.
- **Source trace:** C.2 #9 `[4-src]`, #10 `[single]` P; E quote/pricing `[2-src P X]`; B KPI price-mix and margin leakage `[4-src]`; M0.1-11 Kartik's Six Sigma pricing tool (+15% win rate) `[fact — supplied]`; raw X outbound "price/quote expiry" `[single — preserve]` X; A.2 tariffs `[single]` C `[inference, not verified]`.
- **1. Data aggregation** — *Interaction:* sales email, distributor calls, RSM notes. *Operational:* Salesforce/CPQ quotes (created, sent, expiry, discount, approvals); price-list change log; win/loss; ERP realised margin.
- **2. Baseline creation** — Per region × partner tier × product family: quote cycle time, chase contacts per quote, discount-escalation rate; tender seasonality.
- **3. Dynamic detection** — Chase contacts per quote ≥ 2× baseline with cycle time rising and conversion falling on a lag; pushback ≥ 3× baseline within 30 days of a price-list change; competitor-price mentions clustering with discount escalations.
- **4. Distillation** — Separate ordinary negotiation from friction; rank by open quote $ × conversion drop.
- **5. Surfacing & routing** — *Headline:* "UK-EU project quotes: turnaround 9.4 days vs 4.1 since the approval-rule change; chase contacts 2.3×; conversion −8 points." `[illustrative]` *Severity:* S2 revenue/margin · cliff · blast radius open quote $ and partners · incident flag N. *Confidence:* High on cycle times; Medium on conversion attribution. *Action:* approval-rule fix; price communication. *Draft artefact:* pricing-friction brief. *Human gate:* Pricing lead. *UI hero:* quote funnel with friction markers.
- **Join tags:** partner, region, product family, quote, price-list version, time · **P&L destination metric:** quote conversion; price realisation.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** CPQ shows cycle time, not the partner's reaction; an LLM cannot tie a complaint to the quote.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** £3.4m of open UK-EU quotes affected; 14 partners; tariff pass-through named as a reason in 9 interactions (a candidate cause only).
- **Regulatory/governance hook:** Strongest competition-law exposure in this set — never share a partner's price or discount with another; no resale price maintenance; handle partner-reported competitor prices as internal intelligence only `[panel guidance — not researched in Stage 0; counsel to confirm]`.
- **Feasibility (four-lens):** *Data:* CPQ access. *Hardest part:* extracting numbers from text with confidence. *False-positive risk:* medium. *Must be true:* quotes carry partner and project IDs. *Panel disagreement:* PE partner rates it highly; former service VP notes quotes are a sales process, not service — owner must be commercial.
- **Residual risk LiSN does NOT address:** It does not set prices or verify competitor quotes.

### UC-C-16 — National / strategic account multi-site health and service-contract renewal risk

- **Archetype:** Account renewal risk · **Bucket:** B · **Proposed tier:** T2 (T3 until multi-party identity is proven) · **Demo candidate:** N.
- **Signal:** Across a national account's sites — resolved across dealer, owner and monitoring identities — rising unresolved issues, ITM deficiencies and "inaccessible support" language ahead of a service-contract renewal or estate-standardisation decision.
- **Cadence/trigger:** Weekly per account; trigger at renewal −180 days.
- **Primary user → routed exec(s):** Strategic Accounts lead → Regional GM, VP Service, President (top accounts).
- **Source trace:** C.2 #33 `[single]` G; C.2 #28 escalation to national account `[3-src]`; A.4 national accounts `[2-src G P]`; D.2 fragmented identity `[3-src]`; B aftermarket `[4-src]`; raw G Strategic Accounts roles target national replacement projects, inspection, service/maintenance and lifecycle modernisation `[src-unresolved]`; raw X NFPA system-record fields (owner, installer, supplier, service and monitoring organisation, approving agency) as identity anchors `[single — preserve]` X.
- **1. Data aggregation** — *Interaction:* calls and emails from multiple dealers servicing the estate, owner complaints, ConnectedSafety+/KESMobile support. *Operational:* Salesforce account hierarchy; site list; service-contract dates and values; install base per site; ITM records; connected status.
- **2. Baseline creation** — Per account: contacts per site per quarter; unresolved age; renewal-cycle seasonality.
- **3. Dynamic detection** — ≥ 3 sites with escalating unresolved issues within 60 days **and** renewal within 180 days; or account-level rate ≥ 2× own baseline.
- **4. Distillation** — Resolve identities to the account; rank by contract value × renewal proximity × severity.
- **5. Surfacing & routing** — *Headline:* "National retail account (220 sites): unresolved issues at 14 sites across 4 dealers; renewal in 120 days; $1.9m annual service value." `[illustrative]` *Severity:* S2 revenue · slope · blast radius sites, dealers and annual contract value · incident flag N. *Confidence:* Medium (identity resolution is inference). *Action:* joint account review with dealers; executive sponsor call. *Draft artefact:* account-health brief. *Human gate:* Strategic Account manager. *UI hero:* estate map with site status and renewal countdown.
- **Join tags:** account, site, dealer, platform, region, contract, time · **P&L destination metric:** service-contract renewal / aftermarket revenue.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** "Customer" is not one account field (A.4, G); each dealer sees its own sites only.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** 14 of 220 sites; four dealers; recurring "nobody owns this" language; renewal in 120 days.
- **Regulatory/governance hook:** Confidentiality between dealers serving one estate; owner data protection `[not researched in Stage 0; counsel to confirm]`.
- **Feasibility (four-lens):** *Data:* account hierarchy with site mapping. *Hardest part:* multi-party identity. *False-positive risk:* medium. *Must be true:* sites carry account IDs. *Panel disagreement:* architect: T3 until the identity graph is proven; PE partner: map the top 20 accounts manually and run it now.
- **Residual risk LiSN does NOT address:** It cannot fix a dealer's field performance.
- **See also:** UC-Q-20 (different decision: fixing monitoring-centre interoperability and test-notification failures, which often surface first as national-account escalations).

### UC-C-17 — ConnectedSafety+ / KESMobile adoption and renewal friction

- **Archetype:** Digital-service adoption and renewal · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y** — connected services is Kartik's stated personal theme (M0.1-4), and this card makes ConnectedSafety+ the hero rather than a rival (F3, P).
- **Signal:** Connected-service contacts (gateway, connectivity, permissions, reports, alert interpretation) and subscribers still calling for tasks the product is meant to remove, joined to activation and usage telemetry and renewal dates.
- **Cadence/trigger:** Weekly; triggers at day 60 after activation and at renewal −90 days.
- **Primary user → routed exec(s):** ConnectedSafety+ product owner → VP Service, VP Sales (renewals), President (quarterly digital scorecard).
- **Source trace:** MH-14 `[single — preserve]` G; C.2 #29 `[4-src]`, #30 `[2-src G P]`; M0.1-4 `[2-src G P]`; F1 "covers only connected sites" `[single]` P; F3 complementary `[4-src]`; B KPI connected adoption `[3-src]`; raw X KPI "service attach/renewal, connected-base activation" and "cloud identity/access logs" `[single — preserve]` X.
- **1. Data aggregation** — *Interaction:* CS+/KESMobile cases, TechSupport+ sessions, dealer calls, app feedback. *Operational:* subscription and entitlement records (activation, tier, renewal); usage telemetry (logins, reports, remote sessions, walk tests); gateway health; identity logs.
- **2. Baseline creation** — Per dealer × site cohort: expected post-activation usage curve; contacts per activated site; ITM inspection-cycle seasonality.
- **3. Dynamic detection** — Usage < 30% of cohort curve at day 60 **and** onboarding friction ≥ 2× baseline (adoption stall); renewal risk at −90 days with declining usage and "not worth it" language; workflow failure where subscribers request help for in-product tasks above baseline.
- **4. Distillation** — Separate site IT connectivity, product UX and dealer training; route login anomalies with suspicious features to the UC-Q miner/PSIRT; rank by ARR at risk.
- **5. Surfacing & routing** — *Headline:* "Adoption stall: 38 sites activated by 6 dealers; Inspection+ unused; 'report not accepted in AHJ format' in 17 contacts; $210k ARR renews in 90 days." `[illustrative]` *Severity:* S2 recurring revenue · slope · blast radius sites, dealers and ARR at risk · incident flag N. *Confidence:* High on usage (knowledge); Medium on reason attribution. *Action:* dealer enablement; report-format fix; renewal outreach via dealer. *Draft artefacts:* renewal-rescue brief; product feedback ticket. *Human gate:* product owner + Sales. *UI hero:* activation-to-value funnel with friction reasons at each drop.
- **Join tags:** site, dealer, subscription tier, feature, firmware, region, time · **P&L destination metric:** connected-services ARR / renewal rate (secondary: support labour).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Product analytics show clicks; conversations explain why the workflow fails (MH-14).
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** 38 sites, six dealers, Inspection+ unused at day 60; 17 contacts about report format; $210k ARR at renewal.
- **Regulatory/governance hook:** Telemetry use under subscription terms; data protection `[not researched in Stage 0; counsel to confirm]`; alert-interpretation advice for life-safety systems is human-authored.
- **Feasibility (four-lens):** *Data:* usage telemetry (I.4 Q7). *Hardest part:* telemetry-to-case identity. *False-positive risk:* low–medium. *Must be true:* subscription and telemetry exports available. *Panel disagreement:* PE partner: ARR is small today, value is strategic narrative; former service VP: alert fatigue (C.2 #30) belongs in scope.
- **Residual risk LiSN does NOT address:** It covers only connected sites and cannot fix site networks.
- **See also:** UC-Q-5 (different decision: voice-vs-telemetry divergence as a product/event-model quality signal, not adoption or renewal).

### UC-C-18 — Access-policy and licence-change lockout watch

- **Archetype:** Change-induced friction · **Bucket:** A · **Proposed tier:** T2 · **Demo candidate:** N. `[long-tail — preserve]`
- **Signal:** Login, dongle, licence, MFA and entitlement contacts spike after a MyEddie, portal or ConnectedSafety+ access-policy change, with shared-credential workaround language.
- **Cadence/trigger:** Daily for 14 days after any access or licence change.
- **Primary user → routed exec(s):** Portal / digital product owner → CIO, VP Service; security-relevant patterns flagged to the UC-Q miner/PSIRT.
- **Source trace:** C.2 #5 `[4-src]`, #22 `[4-src]`; E cloud login `[single]` G; raw P outbound "licence or platform change: renewal, deprecation, MFA, access policy → lockout, shadow accounts" `[single — preserve]` P.
- **1. Data aggregation** — *Interaction:* portal, email, phone access contacts. *Operational (light):* change calendar.
- **2. Baseline creation** — Access contacts per active user per partner.
- **3. Dynamic detection** — ≥ 3× baseline within 7 days of a change; "commissioning blocked" phrasing; shared-login phrasing.
- **4. Distillation** — Separate routine resets; rank by partners blocked mid-job.
- **5. Surfacing & routing** — *Headline:* "MFA rollout: lockout contacts 4.1× in 72h; 23 partners; 6 report commissioning blocked; 5 mention shared logins." `[illustrative]` *Severity:* S2 with incident flag Y (jobs blocked) · cliff · blast radius partners and jobs blocked. *Confidence:* High. *Action:* grace period or rollback; partner guidance. *Draft artefacts:* partner guidance; change-management ticket. *Human gate:* IT change owner. *UI hero:* change marker with lockout spike and blocked-job counter.
- **Join tags:** system, partner, release, job stage, time · **P&L destination metric:** cost-to-serve (secondary: commissioning delay → revenue timing).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Identity logs show failures, not that a technician is standing on a site unable to commission.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** As in the headline; 40% of lockout contacts arrive after hours.
- **Regulatory/governance hook:** Shared credentials are a security weakness — route to IT security (and to PSIRT where a KGS product's access control is implicated, UC-Q-8).
- **Feasibility (four-lens):** Easy data; low false-positive risk; must be true that a change calendar exists. *Panel disagreement:* compliance adviser wants security routing first; former service VP wants the grace period first.
- **Residual risk LiSN does NOT address:** It does not design identity and access management.
- **See also:** UC-Q-8 (different decision: whether access anomalies are cyber-indicative and belong in the PSIRT/CRA process).

### UC-C-19 — China and MEA project-channel commercial signals (vertical, tender, approval, delivery)

- **Archetype:** Regional growth-channel intelligence · **Bucket:** B · **Proposed tier:** T3 (parked) → T2 once opportunity data is joined · **Demo candidate:** N. `[single — preserve]` commercial slice; the quality slice of MH-15 is the UC-Q miner's.
- **Signal:** By vertical (energy storage, petrochemicals, rail, electronics, data centres) and by mega-project: tender-response delays, local-approval questions (CCC in China; consultant approval in MEA), reference-site concerns, delivery-for-commissioning and receivable friction, joined to pipeline, local fill rate and AR.
- **Cadence/trigger:** Monthly; trigger at tender deadlines.
- **Primary user → routed exec(s):** China GM / MEA GM → President Commercial Fire, CFO (working capital), Product Management (localisation).
- **Source trace:** M0.1-1 `[4-src]`; MH-15 `[single — preserve]` P; 0.1 China localisation tension (X PE vs X architect) `[single — preserve]`; raw P China "CCC acceptance, industrial references, tender response and supply continuity" and MEA "mega-project specification, consultant approval, distributor capability and delivery performance" `[single — preserve]` P; raw X service VP would test China growth against partner certification, escalation and fill rate `[single — preserve]` X; A.1 GCC $1.57bn `[single]` G `[src-unresolved]`.
- **1. Data aggregation** — *Interaction:* GST sales and support (Mandarin), distributor and integrator email, MEA consultant correspondence (Arabic/English). *Operational:* tender and opportunity pipeline by vertical; local fill rate; AR ageing; warranty-claim counts by vertical (count only).
- **2. Baseline creation** — Per vertical × province/country; tender cycles; regional calendar seasonality.
- **3. Dynamic detection** — Tender-stage friction ≥ 2× vertical baseline with a falling win rate; AR disputes rising in a localised vertical.
- **4. Distillation** — Cross-language normalisation; rank by pipeline $.
- **5. Surfacing & routing** — *Headline:* "Energy-storage projects, two provinces: local-approval and delivery-for-commissioning friction 2.6× baseline across 5 integrators; ¥48m at tender stage." `[illustrative]` *Severity:* S2 growth · slope · blast radius projects, integrators and pipeline $ · incident flag N. *Confidence:* Medium–Low. *Action:* localised documentation pack; supply priority for reference sites. *Draft artefact:* vertical brief to the regional GM. *Human gate:* regional GM. *UI hero:* vertical × stage heat-grid.
- **Join tags:** vertical, region/province/country, integrator/distributor, project, time · **P&L destination metric:** bookings in stated verticals (secondary: DSO/working capital).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** Global dashboards average dissimilar environments (MH-15); no single report ties tender language to pipeline and receivables.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** As in the headline; MEA variant — a Gulf data-centre project where consultant approval questions and distributor delivery-date chasing co-occur six weeks before tender close.
- **Regulatory/governance hook:** China PIPL (in-country processing, cross-border transfer rules) and regional data-residency rules — LiSN's in-environment deployment fits, but must be confirmed per region `[panel guidance — not researched in Stage 0; local counsel to confirm]`.
- **Feasibility (four-lens):** *Data:* in-language corpora. *Hardest part:* technical Mandarin/Arabic extraction and residency. *False-positive risk:* medium–high. *Must be true:* regional opportunity data in Salesforce. *Panel disagreement:* X's PE partner sees China as margin/working-capital risk until supply, receivables and warranty loops are visible; X's architect sees it as the ideal early-warning case — preserved, not averaged.
- **Residual risk LiSN does NOT address:** It cannot win tenders or read market conditions outside KGS's own interactions.
- **See also:** UC-Q-12 (different decision: product/application anomaly in the same verticals, owned by Quality and Product Management).

### UC-C-20 — India authorised-channel leakage, grey market and service-partner authorisation

- **Archetype:** Channel integrity · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N. `[long-tail — preserve]`
- **Signal:** Support and warranty contacts on units whose serial ship-to maps to another territory or an unauthorised source; independent repairers requesting parts or firmware; warranty-eligibility disputes.
- **Cadence/trigger:** Monthly by city.
- **Primary user → routed exec(s):** India country head / Rest-of-Asia sales → channel manager, Service (warranty policy), Legal.
- **Source trace:** 0.3 India grey/parallel market and independent repairers `[2-src C P]`; raw C IndiaMART listings in Delhi, Gurugram, Noida, Ahmedabad, Mohali `[single — preserve]` C; authorised GST service partner, Chennai `[single]` P; A.4/0.4 India route to market; M0.1-8 Hyderabad GST Experience Centre (centre `[2-src G P]`; leadership attendance `[single G]` `[src-unresolved]`).
- **1. Data aggregation** — *Interaction:* India support calls and email (English plus Indian languages), warranty claims, repairer enquiries. *Operational:* serial/lot → ship-to (ERP); authorised-partner master; territory; warranty policy; Salesforce pipeline.
- **2. Baseline creation** — Share of contacts on out-of-territory serials per city; repairer-contact rate.
- **3. Dynamic detection** — Out-of-channel share ≥ 2× baseline in a city; one distributor's serials appearing disproportionately elsewhere; warranty disputes rising.
- **4. Distillation** — Separate legitimate project movement across states; flag unauthorised repair of life-safety panels to the UC-Q miner/compliance.
- **5. Surfacing & routing** — *Headline:* "EST4 serials shipped to one northern distributor appear in 34% of Ahmedabad support contacts; 11 warranty disputes; 3 independent repairers asking for firmware." `[illustrative]` *Severity:* S3 · slope · blast radius serials, cities and partners · incident flag N. *Confidence:* Medium. *Action:* legal-cleared channel review; offer repairers a path to authorised service-partner status; clarify warranty policy. *Draft artefact:* channel-review brief marked for Legal review. *Human gate:* India head + Legal. *UI hero:* city map of serial flows (ship-to vs contact location).
- **Join tags:** serial/lot, ship-to distributor, city/state, partner authorisation, time · **P&L destination metric:** price realisation / channel margin (secondary: warranty cost, service revenue).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** ERP knows where units shipped; only contacts reveal where they are serviced.
- **Differentiation:** **requires the join — does not exist today.**
- **Worked example `[illustrative]`:** As in the headline.
- **Regulatory/governance hook:** India Competition Act `[not researched in Stage 0; Indian counsel to confirm]` — resale and territory restrictions can be anti-competitive and parallel trade may be lawful, so Legal frames any action; DPDP Act 2023 `[panel guidance — not researched in Stage 0; Indian counsel to confirm]`; partner sanctions only by human decision (raw G).
- **Feasibility (four-lens):** *Data:* serials captured on India cases. *Hardest part:* serial capture. *False-positive risk:* medium. *Must be true:* serial → ship-to available. *Panel disagreement:* PE partner: margin protection; compliance adviser: competition-law exposure if used to police resale; former service VP: converting repairers into authorised partners is worth more than policing.
- **Residual risk LiSN does NOT address:** It cannot stop grey-market trade or decide its legality.

### UC-C-21 — Site service-provider handover and programme-file friction

- **Archetype:** Installed-base portability risk · **Bucket:** A (optional install-base join) · **Proposed tier:** T2 · **Demo candidate:** N. `[single — preserve]`
- **Signal:** "Need the programme file from the previous company", "locked", "can't get the password", "new service provider" — dealer switches at site level that risk a competitor rip-and-replace.
- **Cadence/trigger:** Monthly by region.
- **Primary user → routed exec(s):** VP Sales/Channel (policy) → Product Management (programme escrow/versioning), Regional GM, Legal.
- **Source trace:** MD-4 `[single — preserve]` P; D.2 legacy lock-in `[2-src P C]`; D.3 owner need for programme ownership/escrow `[4-src]`; C.2 #1 passwords, upload/download; MH-7 programme-access; raw P owners want "vendor portability" `[single]` P; raw X Edwards courses cover "database reconciliation" `[single]` X.
- **1. Data aggregation** — *Interaction:* tech support, forums (corroboration only). *Operational (optional):* install base to identify the prior partner.
- **2. Baseline creation** — Handover-friction rate per 1,000 technical contacts per region.
- **3. Dynamic detection** — ≥ 2× baseline; clustering on sites leaving one partner (partner distress) or moving to competitor-affiliated service firms.
- **4. Distillation** — Separate routine password resets; rank by sites affected and competitor risk.
- **5. Surfacing & routing** — *Headline:* "Programme-file handover disputes 2.4× in Ontario; 60% involve sites leaving one ESD; 4 mention competitor replacement quotes." `[illustrative]` *Severity:* S3 · slope · blast radius sites and partners involved · incident flag N. *Confidence:* Medium. *Action:* handover/escrow policy; broker transfer to another authorised partner. *Draft artefacts:* policy options memo; handover mediation brief. *Human gate:* VP Channel + Legal. *UI hero:* handover flow (from partner → to partner/competitor).
- **Join tags:** site, partner (from/to), platform, region, time · **P&L destination metric:** installed-base retention / retrofit win rate.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** No code exists for "can't get the file"; it hides inside password and upload cases.
- **Differentiation:** interaction-visible (substrate-enriched with install base).
- **Worked example `[illustrative]`:** 37 handover cases in a quarter vs 15 baseline; 22 from sites leaving one ESD, which also appears in UC-C-1.
- **Regulatory/governance hook:** Lock-in that forecloses independent servicers can attract competition scrutiny `[panel guidance — not researched in Stage 0; counsel to confirm]`; NFPA 72 acceptance-record retention for the life of the system (X `[single]`, NFPA extract); UK golden-thread handover.
- **Feasibility (four-lens):** Interaction data only; phrasing detection straightforward; must be true that site is captured. *Panel disagreement:* former service VP sees programme control as a partner-model strength (quality); P's inference sees owner-portability pain — both preserved.
- **Residual risk LiSN does NOT address:** It cannot change dealer contracts or owners' choices.

---

## Panel notes

### Sharpest disagreements (stated, not averaged)

1. **Going around the partner (UC-C-9, UC-C-16, UC-C-21).** PE partner: site- and owner-level visibility is the aftermarket engine and KGS should own the list. Former service VP: the moment a partner sees KGS use support data to approach its owners, the channel defects — route every opportunity through the serving partner. Compliance adviser: territory and customer allocation between dealers carries competition-law risk. Working rule: opportunities route via the authorised partner; Strategic Accounts acts directly only on accounts it already owns.
2. **Carve-out use cases: transient or durable (UC-C-3, UC-C-4, UC-C-5).** PE partner: fastest cash payback in the set; fine if the instrument retires after TSA exit. Former service VP: friction decays within weeks, so the value window is short. Architect (with X's PE partner on the "durable standalone data asset"): the entity graph and evidence continuity built for separation become the permanent join layer. Unresolved — present carve-out as the entry point, not the product.
3. **Partner-level surveillance and competition law (UC-C-1, UC-C-15, UC-C-20).** PE partner wants margin and channel policing; compliance adviser warns that pricing, territory and resale analytics can become evidence of unlawful restraint if acted on carelessly. Consensus: internal use only, no cross-partner disclosure, human decision on any partner consequence, Legal review for UC-C-15 and UC-C-20. `[All competition-law points in this file are panel guidance — not researched in Stage 0; counsel to confirm.]`
4. **Single-partner commercial anomalies ("count of three").** Architect: surface low-count novel signals early (C.1, G). Former service VP: suppress single-source commercial anomalies until corroborated (C.4). Unlike safety — where the dossier's consensus is never to suppress — this lens adopts a watchlist rule: a commercial anomaly becomes a card only when corroborated by a second independent source or by movement in the substrate (orders, AR, certification).

### Five strongest demo / UI candidates

1. **UC-C-1 Strategic Partner drift radar** — Kartik's own key-account-recovery story; the friction-vs-sell-in timeline makes the join visible at a glance.
2. **UC-C-6 Backorder consequence** — the "94% vs revised promise, 71% vs original" toggle is a Six-Sigma-grade insight that no ERP report shows.
3. **UC-C-3 Carve-out friction radar** — the cutover line on a timeline with a control region is the clearest year-2 PE timing hook.
4. **UC-C-9 EST3→EST4 migration map** — growth rather than defence; the natural v2 follow-up (I.3).
5. **UC-C-17 ConnectedSafety+ adoption funnel** — makes Kartik's flagship digital product the hero and positions LiSN as complementary (F3).

### Recall note — items recovered from raw engine files that the dossier dropped or under-weighted

- **X:** combined "promise-to-delivery / legacy migration / compatibility" cohort — "ERP sees shipment, not the technical reason a customer cannot substitute" — split across MH-7 and MH-8 in the dossier, recovered as **UC-C-7**.
- **X:** "after-hours calls by partner, product/version and **job stage**" — job stage added as a dimension in UC-C-12, UC-C-18.
- **X:** "channel-partner × order/RMA separates service-quality failure from stock/**credit** friction" — credit holds used as a suppressor in UC-C-1.
- **X:** KPI "service attach/renewal, connected-base activation" and "cloud identity/access logs" — UC-C-17.
- **X:** NFPA system-record fields (owner, installer, supplier, service and monitoring organisation, approving agency) as identity anchors — UC-C-16.
- **X:** service VP would test China growth against partner certification, escalation and fill rate — UC-C-19.
- **X:** PE partner's "durable standalone data asset"; architect's "poor identity resolution can create false cohorts" — Panel note 2 and every feasibility block.
- **X:** Edwards courses include "database reconciliation" — UC-C-21; outbound "price/quote expiry" — UC-C-15.
- **C:** EST4 certification gates webinar materials and ITM courses (NFPA 72-2022 §10.5.3); EDGE-ML / Evolve-ML certifications — UC-C-13 (certification lapse also locks out gated material).
- **C:** "wiring and most rail modules are backward compatible, so migration is serviceable aftermarket" — UC-C-9 talking points.
- **C:** "Chubb Edwards" naming in an Ontario forum post — brand/entity residue in UC-C-5.
- **C:** named IndiaMART cities (Delhi, Gurugram, Noida, Ahmedabad, Mohali) — UC-C-20.
- **C:** standalone ERP/CRM builds typically 18–36 months `[estimate]` — UC-C-4 horizon; Regional GM "partner risk surfaces at the lost bid" — UC-C-1.
- **G:** "KGS's own sale terms discuss product lead times and order handling" `[src-unresolved]` — UC-C-6.
- **G:** "the ERP programme can be green while dealers experience missing acknowledgements, duplicate accounts, slow quotes, wrong entitlement or new support hand-offs" — UC-C-3, UC-C-4, UC-C-8.
- **G:** white-space row "technical-support emerging issue → engineering loop; the KB may normalise a new failure into an old category" (absent from the MH list) — the mandatory guard in UC-C-11.
- **G:** uncertified partner "unable to bid" `[src-unresolved]` — UC-C-13; India standards metadata at state/AHJ/project level — UC-C-14; partner sanctions require human approval — UC-C-20; Strategic Accounts roles for national replacement, inspection and modernisation `[src-unresolved]` — UC-C-16; distributor rebate/forecast/inventory account management — UC-C-1.
- **P:** "regional process divergence hidden by global project status" and "prioritising which integrations materially affect revenue, cash, safety or partner loyalty" — UC-C-4.
- **P:** outbound licence/MFA/access-policy change causing lockouts and shadow accounts — UC-C-18.
- **P:** "training availability aligned to launches, territory demand and observed support gaps" — UC-C-13; partner-QBR join (warning ↔ order share ↔ support history ↔ inventory and forecast) — UC-C-1.
- **P:** China "CCC acceptance, industrial references, tender response, supply continuity"; MEA "mega-project specification, consultant approval, distributor capability, delivery performance" — UC-C-19; owners want "vendor portability" — UC-C-21.
- **Noted, not mined (outside this lens or too thin):** P's Australia maintenance-services growth `[single]` (possible extension of UC-C-12/16); P and X's monitoring-station stakeholder (the UC-Q miner / service); X's NFPA planned-test and impairment notices (service operations); X's PFAS transition substitution demand (perimeter unconfirmed — K-10, K-11).
